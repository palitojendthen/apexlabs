#!/usr/bin/env python3
import pandas as pd
import numpy as np
import json
import sys
import importlib.util
from pathlib import Path
import traceback
import warnings
import inspect
import io

warnings.filterwarnings("ignore")
OVERLAY_INDICATORS = {"SMA", "EMA", "PMA", "KAMA", "DEMA", "TEMA", "ITREND", "DONCHIAN_CHANNEL"}

# ---- helper: dynamic lookback extraction ----
def _extract_lookbacks(ind):
    lb = []
    for k, v in dict(ind.get("params", {})).items():
        k_low = str(k).lower()
        if any(tag in k_low for tag in ("n_", "_n", "len", "period", "hp", "window")):
            try:
                lb.append(int(v))
            except:
                pass
    return lb

# ---- adaptive valid start detector for unstable filters ----
def find_valid_start(df, ind_col, close_col="close", tolerance=0.2, min_bars=10):
    """Find first stable index where indicator ratio to close is within ±tolerance."""
    if ind_col not in df.columns or close_col not in df.columns:
        return 0
    ratio = (df[ind_col] / df[close_col]).abs()
    valid_mask = ratio.between(1 - tolerance, 1 + tolerance)
    first_valid = valid_mask.idxmax() if valid_mask.any() else None
    if first_valid is None or pd.isna(first_valid):
        first_valid = min_bars
    return int(first_valid)

# ---- helper: metrics ----
def compute_metrics(equity, returns, trades, buyhold_pct=0.0, sl_hits=0):
    equity = np.asarray(equity, dtype=float)
    if equity.size == 0:
        return {
            "Final Equity": "0.00","PnL %":"0.00 %","WinRate":"0.00 %",
            "Profit Factor":"0.00","Sharpe":"0.00","MaxDD":"0.00 %",
            "Total Trades":"0","Buy & Hold":"0.00 %","Largest Loss %":"0.00 %"
        }

    pnl_pct = (equity[-1]/equity[0]-1)*100.0
    ret_arr = np.asarray(returns, dtype=float)
    sd = ret_arr.std(ddof=1) if ret_arr.size>1 else 0.0
    sharpe = 0.0 if sd==0 else (ret_arr.mean()/sd)*np.sqrt(252)

    closed = [t for t in trades if t.get("pnl") is not None]
    wins   = [t for t in closed if t["pnl"]>0]
    losses = [t for t in closed if t["pnl"]<0]
    win_rate = (len(wins)/len(closed)*100.0) if closed else 0.0
    pf = (sum(t["pnl"] for t in wins)/abs(sum(t["pnl"] for t in losses))) if losses else float("inf")
    largest_loss = min([t["pnl"] for t in closed]+[0.0])*100.0

    peak, max_dd = equity[0], 0.0
    for e in equity:
        peak = max(peak, e)
        max_dd = min(max_dd,(e/peak)-1.0)

    eq_dev = (sd*100.0) if sd>0 else 0.0

    return {
        "Final Equity": f"{equity[-1]:.2f}",
        "PnL %": f"{pnl_pct:.2f} %",
        "WinRate": f"{win_rate:.1f} %",
        "Profit Factor": ("inf" if pf==float("inf") else f"{pf:.2f}"),
        "Sharpe": f"{sharpe:.3f}",
        "MaxDD": f"{max_dd*100:.2f} %",
        "Total Trades": len(closed),
        "Buy & Hold": f"{buyhold_pct:.2f} %",
        "Largest Loss %": f"{largest_loss:.2f} %",
        "SL Hit": f"{sl_hits}x",
    }

def ensure_derived_sources(df, source):
    s = (source or "close").lower()
    if s in df.columns:
        return s
    if s=="hl2":
        df["hl2"]=(df["high"]+df["low"])/2; return "hl2"
    if s=="hlc3":
        df["hlc3"]=(df["high"]+df["low"]+df["close"])/3; return "hlc3"
    if s=="ohlc4":
        df["ohlc4"]=(df["open"]+df["high"]+df["low"]+df["close"])/4; return "ohlc4"
    return "close"

def import_indicator(module_basename):
    base = module_basename.replace(" ", "_").lower().replace("(","").replace(")","")
    module_path = Path(__file__).resolve().parents[1]/"indicators"/f"{base}.py"
    if not module_path.exists():
        raise FileNotFoundError(f"Indicator module not found: {module_path}")
    spec = importlib.util.spec_from_file_location(base,module_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return getattr(module,base)

# ---- signal generation ----
def apply_technicals(df, indicators, user_tier="free"):
    signal_cols = []
    for idx, ind in enumerate(indicators,start=1):
        raw_name = str(ind.get("name","")).strip()
        name = raw_name.lower().replace(" ","_").replace("(","").replace(")","")
        sig_col = f"sig_{name}_{idx}"

        if user_tier=="free" and idx==3:
            df[sig_col]=0; signal_cols.append(sig_col); continue

        if name=="sma" and "sma" in df.columns:
            df[sig_col]=np.where(df["close"]>df["sma"],1,np.where(df["close"]<df["sma"],-1,0))
        elif name=="ema" and "ema" in df.columns:
            df[sig_col]=np.where(df["close"]>df["ema"],1,np.where(df["close"]<df["ema"],-1,0))
        elif name=="wma" and "wma" in df.columns:
            df[sig_col]=np.where(df["close"]>df["wma"],1,np.where(df["close"]<df["wma"],-1,0))
        elif name=="donchian_channel" and "basis" in df.columns:
            df[sig_col]=np.where(df["close"]>df["basis"],1,np.where(df["close"]<df["basis"],-1,0))
        elif name=="adx" and "adx" in df.columns:
            df[sig_col]=0
        elif name=="kama" and "kama" in df.columns:
            df[sig_col]=np.where(df["kama"]>df["kama"].shift(1),1,np.where(df["kama"]<df["kama"].shift(1),-1,0))
        elif name in ("ehlers_simple_decycler","simple_decycler") and "decycler" in df.columns:
            df[sig_col]=np.where(df["decycler"]>df["decycler"].shift(1),1,np.where(df["decycler"]<df["decycler"].shift(1),-1,0))
        else:
            df[sig_col]=0

        signal_cols.append(sig_col)

    active=[c for c in signal_cols if c in df.columns]
    if not active:
        df["final_signal"]=0
    else:
        all_long=(df[active]==1).all(axis=1)
        all_short=(df[active]==-1).all(axis=1)
        df["final_signal"]=np.select([all_long,all_short],[1,-1],default=0)

    return df,signal_cols

# ---- long-short engine ----
def run_longshort(df,use_atr,atr_mult,sl_pct,capital):
    cash,qty,entry,side=capital,0.0,None,0
    equity,trades,long_m,short_m=[],[],[],[]
    sl_hits=0

    for i in range(len(df)):
        px=float(df.loc[i,"close"])
        sig=int(df.loc[i,"final_signal"])
        ts=str(df.loc[i,"open_time"])

        # stop-loss
        if side!=0 and entry is not None:
            if use_atr and "atr" in df.columns:
                stop=entry*(1-atr_mult*df.loc[i,"atr"]/entry) if side>0 else entry*(1+atr_mult*df.loc[i,"atr"]/entry)
            elif sl_pct:
                stop=entry*(1-sl_pct) if side>0 else entry*(1+sl_pct)
            else:
                stop=None
            if stop is not None:
                if (side>0 and px<=stop) or (side<0 and px>=stop):
                    exit_px=stop
                    if side>0:
                        cash=qty*exit_px; pnl=(exit_px/entry)-1
                        short_m.append({"x":ts,"y":float(df.loc[i,"high"])*1.02})
                    else:
                        cash=qty*(2*entry-exit_px); pnl=(entry/exit_px)-1
                        long_m.append({"x":ts,"y":float(df.loc[i,"low"])*0.98})
                    trades.append({"entry":entry,"exit":exit_px,"pnl":pnl,"side":"long" if side>0 else "short","stop":True})
                    sl_hits+=1; qty,entry,side=0.0,None,0

        prev_side=side
        if sig!=prev_side:
            if prev_side!=0 and entry is not None:
                if prev_side>0:
                    cash=qty*px; pnl=(px/entry)-1
                    short_m.append({"x":ts,"y":float(df.loc[i,"high"])*1.02})
                else:
                    cash=qty*(2*entry-px); pnl=(entry/px)-1
                    long_m.append({"x":ts,"y":float(df.loc[i,"low"])*0.98})
                trades.append({"entry":entry,"exit":px,"pnl":pnl,"side":"long" if prev_side>0 else "short","stop":False})
                qty,entry,side=0.0,None,0

            if sig!=0 and cash>0:
                qty=cash/px; entry=px; side=sig; cash=0.0
                if side>0:
                    long_m.append({"x":ts,"y":float(df.loc[i,"low"])*0.98})
                else:
                    short_m.append({"x":ts,"y":float(df.loc[i,"high"])*1.02})

        eq=cash if side==0 or entry is None else cash+qty*(2*entry-px if side<0 else px)
        equity.append(eq)

    return equity,trades,long_m,short_m,sl_hits

# ---- main ----
def main():
    body=json.load(sys.stdin)
    df=pd.DataFrame(body["data"]).reset_index(drop=True)
    indicators=body.get("indicators",[])
    stop_loss_text=(body.get("stop_loss") or "3%").strip()
    capital=float(body.get("capital",1000))
    mode=body.get("mode","longshort").lower()

    for col in ["open","high","low","close","volume"]:
        if col in df.columns:
            df[col]=pd.to_numeric(df[col],errors="coerce")
    df["open_time"]=pd.to_datetime(df["open_time"],errors="coerce")

    lookbacks,plots,stable_starts=[],[],[]

    for idx,ind in enumerate(indicators):
        name=str(ind.get("name","")).strip()
        if not name: continue
        params=dict(ind.get("params",{}))
        lower_name=name.lower().replace(" ","_")
        lookbacks.extend(_extract_lookbacks(ind))
        src_key=None
        for key in list(params.keys()):
            if key.startswith("source_"): src_key=params.pop(key); break
        if not src_key and "source" in params: src_key=params.pop("source")

        src=ensure_derived_sources(df,src_key or "close")
        func=import_indicator(lower_name)
        sig_params=inspect.signature(func).parameters
        valid_params={k:v for k,v in params.items() if k in sig_params and not k.startswith("source")}
        df[lower_name]=func(df[src],**valid_params)

        # dynamic stability detection
        if lower_name in ["kama","ehlers_simple_decycler","simple_decycler"]:
            valid_start=find_valid_start(df,lower_name,"close",tolerance=0.2)
            stable_starts.append(valid_start)

        if idx==0 and name.upper() in OVERLAY_INDICATORS:
            plots.append({
                "name":lower_name,"display_name":name.upper(),
                "signal_col":f"sig_{lower_name}_{idx+1}",
                "color_up":"rgba(0,200,0,0.7)","color_down":"rgba(200,0,0,0.7)"
            })

    df,signal_cols=apply_technicals(df,indicators,user_tier="free")

    base_start=max(lookbacks) if lookbacks else 1
    stability_start=max(stable_starts) if stable_starts else 0
    calc_start=max(base_start,stability_start)
    df=df.iloc[calc_start:].reset_index(drop=True)

    use_atr,atr_mult,sl_pct=False,None,None
    if "atr" in stop_loss_text.lower() or "x" in stop_loss_text.lower():
        try: atr_mult=float(stop_loss_text.split("x")[-1]); use_atr=True
        except: atr_mult=1.5
    else:
        try: sl_pct=float(stop_loss_text.replace("%",""))/100.0
        except: sl_pct=0.03

    if use_atr:
        atr_mod=import_indicator("atr")
        atr_df=atr_mod(df,n_atr=10)
        df=df.join(atr_df[["tr","atr"]])

    eq,trades,long_m,short_m,sl_hits=run_longshort(df,use_atr,atr_mult,sl_pct,capital)

    df["equity"]=eq
    rets=pd.Series(df["equity"]).pct_change().fillna(0).values
    bh=(df["close"].iloc[-1]/df["close"].iloc[0]-1)*100.0
    metrics=compute_metrics(df["equity"].values,rets,trades,buyhold_pct=bh,sl_hits=sl_hits)

    result={"df":df.to_dict(orient="records"),
            "metrics":metrics,
            "markers":{"long":long_m,"short":short_m},
            "plots":plots}
    return result

if __name__=="__main__":
    try:
        if hasattr(sys.stdout,"reconfigure"):
            try: sys.stdout.reconfigure(encoding="utf-8")
            except: pass

        sys.stdout=io.StringIO()
        result=main()
        sys.stdout=sys.__stdout__
        json_output=json.dumps(result,ensure_ascii=True,allow_nan=False,default=str)
        sys.stdout.write(json_output); sys.stdout.flush()
    except Exception as e:
        import traceback; traceback.print_exc(file=sys.stderr)
        sys.stderr.write(f"[BACKTEST ERROR] {e}\n"); sys.exit(1)