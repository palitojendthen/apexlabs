# import pandas as pd
# import numpy as np
# import json
# import sys
# import importlib.util
# from pathlib import Path
# import os
# import traceback
# import warnings
# import inspect

# warnings.filterwarnings("ignore")
# sys.stderr = open(os.devnull, "w")


# OVERLAY_INDICATORS = {"SMA", "EMA", "PMA", "KAMA", "DEMA", "TEMA", "ITREND"}

# # Helpers
# def compute_metrics(equity, returns, trades):
#     equity = np.asarray(equity, dtype=float)
#     if equity.size == 0:
#         return {
#             "Final Equity": "0.00", 
#             "PnL %":"0.00 %", 
#             "WinRate": "0.00 %", 
#             "Profit Factor": "0.00",
#             "Sharpe": "0.00",
#             "MaxDD": "0.00 %",
#             "Total Trades": "0",
#             "Buy & Hold": "0.00 %",
#             "Largest Loss %": "0.00 %",
#             "SL Hit": "0"
#         }

#     trades = [t for t in trades if t.get("pnl") is not None]
#     pnl = equity[-1]
#     pnl_pct = (equity[-1]/equity[0]-1)*100.0
#     ret_arr = np.asarray(returns, dtype=float)
#     sd = ret_arr.std(ddof=1) if ret_arr.size > 1 else 0.0
#     sharpe = 0.0 if sd == 0 else (ret_arr.mean() / sd) * np.sqrt(252)

#     wins = [t for t in trades if t["pnl"] > 0]
#     losses = [t for t in trades if t["pnl"] < 0]
#     win_rate = (len(wins) / len(trades) * 100.0) if trades else 0.0
#     profit_factor = (
#         (sum(t["pnl"] for t in wins) / abs(sum(t["pnl"] for t in losses)))
#         if losses else np.inf
#     )

#     max_dd = 0.0
#     peak = equity[0]
#     for e in equity:
#         peak = max(peak, e)
#         dd = (e / peak) - 1.0
#         max_dd = min(max_dd, dd)

#     return {
#         "Final Equity": f"{pnl:.2f}",
#         "PnL %": f"{pnl_pct:.2f} %",
#         "WinRate": f"{win_rate:.1f} %",
#         "Profit Factor": "∞" if profit_factor == np.inf else f"{profit_factor:.2f}",
#         "Sharpe": f"{sharpe:.2f}",
#         "MaxDD": f"{max_dd * 100:.2f} %",
#         "Total Trades": 0,
#         "Buy & Hold": 0.00,
#         "Largest Loss %": 0.00,
#         "SL Hit": "0 x"
#     }

# def ensure_derived_sources(df: pd.DataFrame, source: str) -> str:
#     s = (source or "close").lower()
#     if s in df.columns:
#         return s
#     if s == "hl2":
#         df["hl2"] = (df["high"]+df["low"])/2.0
#         return "hl2"
#     if s == "hlc3":
#         df["hlc3"] = (df["high"]+df["low"]+df["close"])/3.0
#         return "hlc3"
#     if s == "ohlc4":
#         df["ohlc4"] = (df["open"]+df["high"]+df["low"]+df["close"])/4.0
#         return "ohlc4"
#     return "close"

# def import_indicator(module_basename: str):
#     base = module_basename.replace(" ", "_").lower()
#     module_path = Path(__file__).resolve().parents[1] / "indicators" / f"{base}.py"
#     if not module_path.exists():
#         raise FileNotFoundError(f"Indicator module not found: {module_path}")
#     spec = importlib.util.spec_from_file_location(base, module_path)
#     module = importlib.util.module_from_spec(spec)
#     spec.loader.exec_module(module)
#     return getattr(module, base)


# # Main
# def main():
#     body = json.load(sys.stdin)
#     df = pd.DataFrame(body["data"]).reset_index(drop=True)
#     indicators = body.get("indicators", [])
#     stop_loss_text = (body.get("stop_loss") or "3%").strip()
#     capital = float(body.get("capital", 1000))

#     for col in ["open", "high", "low", "close", "volume"]:
#         if col in df.columns:
#             df[col] = pd.to_numeric(df[col], errors="coerce")
    
#     if "open_time" in df.columns:
#         df["open_time"] = pd.to_datetime(df["open_time"], errors="coerce")

#     indicator_cols, signal_cols, plots = [], [], []

#     for idx, ind in enumerate(indicators):
#         name = str(ind.get("name", "")).strip()
#         if not name:
#             continue
#         params = dict(ind.get("params", {}))
#         lower_name = name.lower().replace(" ", "_")

#         source_key_name = f"source_{lower_name}"
#         source_val = params.pop(source_key_name, params.pop("source", "close"))
#         src_col = ensure_derived_sources(df, str(source_val))
#         func = import_indicator(lower_name)

#         if lower_name in ("sma", "ema"):
#             if "n" in params and f"n_{lower_name}" not in params:
#                 params[f"n_{lower_name}"] = params.pop("n")

#         sig = inspect.signature(func)
#         valid_params = set(sig.parameters.keys())
#         params = {k: v for k, v in params.items() if k in valid_params}

#         series = func(df[src_col], **params)
#         out_col = lower_name
#         df[out_col] = pd.Series(series).reset_index(drop=True)
#         df[out_col] = pd.to_numeric(df[out_col], errors="coerce").fillna(method="ffill").fillna(method="bfill")
#         indicator_cols.append(out_col)

#         sig_col = f"sig_{out_col}"
#         df[sig_col] = (df["close"] > df[out_col]).astype(int)
#         signal_cols.append(sig_col)

#         if idx == 0 and name.upper() in OVERLAY_INDICATORS:
#             out_col = lower_name
#             plots.append({
#                 "name": out_col,
#                 "display_name": name.upper(),
#                 "signal_col": sig_col,
#                 "color_up": "rgba(0,200,0,0.7)",
#                 "color_down": "rgba(200,0,0,0.7)"
#             })

#     if not signal_cols:
#         df["sig_dummy"] = 0
#         signal_cols = ["sig_dummy"]

#     df["final_signal"] = df[signal_cols].all(axis=1).astype(int)
#     # valid_mask = df[indicator_cols].notna().all(axis=1)
#     # df["final_signal"] = np.where(valid_mask, df[signal_cols].all(axis=1).astype(int), 0)


#     sl_pct = None
#     if "%" in stop_loss_text:
#         try:
#             sl_pct = float(stop_loss_text.replace("%", "").strip()) / 100.0
#         except Exception:
#             sl_pct = None

#     # position mode
#     mode = body.get("mode","long").lower()

#     cash = capital
#     position = 0.0
#     entry_price = None
#     equity_curve, trades = [], []
#     long_markers, short_markers = [], []

#     for i in range(1, len(df)):
#         px = float(df.loc[i, "close"])
#         sig = int(df.loc[i, "final_signal"])
#         prev = int(df.loc[i - 1, "final_signal"])


#         if sig == 1 and prev == 0 and cash > 0:
#             position = cash / px
#             entry_price = px
#             cash = 0.0
#             trades.append({"entry": px, "exit": None, "pnl": None})
#             long_markers.append({"x": str(df.loc[i, "open_time"]), "y": float(df.loc[i, "low"]) * 0.98})

#         if position > 0 and sl_pct is not None and entry_price is not None:
#             if px <= entry_price * (1 - sl_pct):
#                 exit_px = entry_price * (1 - sl_pct)
#                 cash = position * exit_px
#                 position = 0.0
#                 trades[-1]["exit"] = exit_px
#                 trades[-1]["pnl"] = -sl_pct
#                 short_markers.append({"x": str(df.loc[i, "open_time"]), "y": float(df.loc[i, "high"]) * 1.02})
#                 entry_price = None

#         if sig == 0 and prev == 1 and position > 0:
#             exit_px = px
#             cash = position * exit_px
#             position = 0.0
#             if trades and trades[-1]["exit"] is None and entry_price is not None:
#                 trades[-1]["exit"] = exit_px
#                 trades[-1]["pnl"] = (exit_px / entry_price) - 1
#             short_markers.append({"x": str(df.loc[i, "open_time"]), "y": float(df.loc[i, "high"]) * 1.02})
#             entry_price = None

#         equity_curve.append(cash + position * px)

#     df = df.iloc[1:].copy()
#     df["equity"] = equity_curve
#     df = df.replace([np.inf, -np.inf], np.nan)

#     for col in df.columns:
#         if col not in ['open_time', 'open', 'high', 'low', 'close', 'volume']:
#             df[col] = df[col].fillna(method='ffill').fillna(method='bfill')

#     rets = df["equity"].pct_change().fillna(0.0).values
#     metrics = compute_metrics(df["equity"].values, rets, trades)

#     # return clean JSON only
#     result = {
#         "df": df.to_dict(orient="records"),
#         "metrics": metrics,
#         "markers": {"long": long_markers, "short": short_markers},
#         "plots": plots
#     }

#     # json_str = json.dumps(result, ensure_ascii=False, default=str)
#     json_str = json.dumps(result, ensure_ascii=False, allow_nan=True, default=str)
#     sys.stdout.write(json_str)
#     sys.stdout.flush()

# if __name__ == "__main__":
#     try:
#         main()
#     except Exception as e:
#         traceback.print_exc()
#         sys.stderr.write(f"[BACKTEST ERROR] {e}\n")
#         sys.exit(1)




import pandas as pd
import numpy as np
import json
import sys
import importlib.util
from pathlib import Path
import traceback
import warnings
import inspect

warnings.filterwarnings("ignore")
OVERLAY_INDICATORS = {"SMA", "EMA", "PMA", "KAMA", "DEMA", "TEMA", "ITREND"}

# helper: metrics
def compute_metrics(equity, returns, trades):
    equity = np.asarray(equity, dtype=float)
    if equity.size == 0:
        return {
            "Final Equity": "0.00",
            "PnL %": "0.00 %",
            "WinRate": "0.00 %",
            "Profit Factor": "0.00",
            "Sharpe": "0.00",
            "MaxDD": "0.00 %",
            "Total Trades": "0",
            "Buy & Hold": "0.00 %",
            "Largest Loss %": "0.00 %",
            "SL Hit": "0"
        }

    trades = [t for t in trades if t.get("pnl") is not None]
    pnl_pct = (equity[-1] / equity[0] - 1) * 100.0
    ret_arr = np.asarray(returns, dtype=float)
    sd = ret_arr.std(ddof=1) if ret_arr.size > 1 else 0.0
    sharpe = 0.0 if sd == 0 else (ret_arr.mean() / sd) * np.sqrt(252)

    wins = [t for t in trades if t["pnl"] > 0]
    losses = [t for t in trades if t["pnl"] < 0]
    win_rate = (len(wins) / len(trades) * 100.0) if trades else 0.0
    profit_factor = (
        (sum(t["pnl"] for t in wins) / abs(sum(t["pnl"] for t in losses)))
        if losses else np.inf
    )

    # max drawdown
    peak, max_dd = equity[0], 0
    for e in equity:
        peak = max(peak, e)
        dd = (e / peak) - 1.0
        max_dd = min(max_dd, dd)

    return {
        "Final Equity": f"{equity[-1]:.2f}",
        "PnL %": f"{pnl_pct:.2f} %",
        "WinRate": f"{win_rate:.1f} %",
        "Profit Factor": "∞" if profit_factor == np.inf else f"{profit_factor:.2f}",
        "Sharpe": f"{sharpe:.2f}",
        "MaxDD": f"{max_dd * 100:.2f} %",
        "Total Trades": len(trades),
        "Buy & Hold": "0.00 %",
        "Largest Loss %": "0.00 %"
        ,"SL Hit": "Nx"
    }


# helper: sources
def ensure_derived_sources(df, source):
    s = (source or "close").lower()
    if s in df.columns:
        return s
    if s == "hl2":
        df["hl2"] = (df["high"] + df["low"]) / 2
        return "hl2"
    if s == "hlc3":
        df["hlc3"] = (df["high"] + df["low"] + df["close"]) / 3
        return "hlc3"
    if s == "ohlc4":
        df["ohlc4"] = (df["open"] + df["high"] + df["low"] + df["close"]) / 4
        return "ohlc4"
    return "close"


# helper: import indicator
def import_indicator(module_basename):
    base = module_basename.replace(" ", "_").lower()
    module_path = Path(__file__).resolve().parents[1] / "indicators" / f"{base}.py"
    if not module_path.exists():
        raise FileNotFoundError(f"Indicator module not found: {module_path}")
    spec = importlib.util.spec_from_file_location(base, module_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return getattr(module, base)


# mode function
def run_long(df, start_idx, use_atr, atr_mult, sl_pct, capital):
    cash, position, entry = capital, 0.0, None
    equity, trades, long_m, short_m = [], [], [], []

    for i in range(start_idx, len(df)):
        px = df.loc[i, "close"]
        sig = df.loc[i, "final_signal"]
        prev = df.loc[i - 1, "final_signal"]

        # entry long
        if sig == 1 and prev == 0 and cash > 0:
            position = cash / px
            entry = px
            cash = 0
            trades.append({"entry": px, "exit": None, "pnl": None})
            long_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "low"] * 0.98})

        # stop-loss or exit
        if position > 0 and entry:
            if use_atr and "atr" in df.columns:
                stop_price = entry * (1 - atr_mult * df.loc[i, "atr"] / entry)
            elif sl_pct:
                stop_price = entry * (1 - sl_pct)
            else:
                stop_price = 0

            if px <= stop_price or (sig == 0 and prev == 1):
                exit_px = stop_price if px <= stop_price else px
                cash = position * exit_px
                trades[-1]["exit"] = exit_px
                trades[-1]["pnl"] = (exit_px / entry) - 1
                short_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "high"] * 1.02})
                position, entry = 0, None

        equity.append(cash + position * px)

    return equity, trades, long_m, short_m


def run_short(df, start_idx, use_atr, atr_mult, sl_pct, capital):
    cash, position, entry = capital, 0.0, None
    equity, trades, short_m, cover_m = [], [], [], []

    for i in range(start_idx, len(df)):
        px = df.loc[i, "close"]
        sig = df.loc[i, "final_signal"]
        prev = df.loc[i - 1, "final_signal"]

        # enter short
        if sig == 0 and prev == 1 and cash > 0:
            position = cash / px
            entry = px
            cash = 0
            trades.append({"entry": px, "exit": None, "pnl": None})
            short_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "high"] * 1.02})

        # exit short
        if position > 0 and entry:
            if use_atr and "atr" in df.columns:
                stop_price = entry * (1 + atr_mult * df.loc[i, "atr"] / entry)
            elif sl_pct:
                stop_price = entry * (1 + sl_pct)
            else:
                stop_price = np.inf

            if px >= stop_price or (sig == 1 and prev == 0):
                exit_px = stop_price if px >= stop_price else px
                cash = position * (2 * entry - exit_px)
                trades[-1]["exit"] = exit_px
                trades[-1]["pnl"] = (entry / exit_px) - 1
                cover_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "low"] * 0.98})
                position, entry = 0, None

        equity.append(cash + position * (2 * entry - px if entry else px))

    return equity, trades, cover_m, short_m


# def run_longshort(df, start_idx, use_atr, atr_mult, sl_pct, capital):
#     cash, position, entry, side = capital, 0.0, None, None
#     equity, trades, long_m, short_m = [], [], [], []

#     for i in range(start_idx, len(df)):
#         px = df.loc[i, "close"]
#         sig = df.loc[i, "final_signal"]
#         prev = df.loc[i - 1, "final_signal"]

#         # enter long
#         if sig == 1 and prev == 0 and cash > 0:
#             position = cash / px
#             entry, side = px, "long"
#             cash = 0
#             trades.append({"entry": px, "exit": None, "pnl": None, "side": "long"})
#             long_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "low"] * 0.98})

#         # flip to short
#         elif sig == 0 and prev == 1 and position > 0 and side == "long":
#             exit_px = px
#             cash = position * exit_px
#             pnl = (exit_px / entry) - 1
#             trades[-1].update({"exit": exit_px, "pnl": pnl})
#             short_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "high"] * 1.02})
#             # reopen short
#             position = cash / px
#             entry, side = px, "short"
#             trades.append({"entry": px, "exit": None, "pnl": None, "side": "short"})

#         # flip back long
#         elif sig == 1 and prev == 0 and position > 0 and side == "short":
#             exit_px = px
#             cash = position * (2 * entry - exit_px)
#             pnl = (entry / exit_px) - 1
#             trades[-1].update({"exit": exit_px, "pnl": pnl})
#             long_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "low"] * 0.98})
#             # reopen long
#             position = cash / px
#             entry, side = px, "long"
#             trades.append({"entry": px, "exit": None, "pnl": None, "side": "long"})

#         equity.append(cash + position * px if side != "short" else cash + position * (2 * entry - px))

#     return equity, trades, long_m, short_m

def run_longshort(df, start_idx, use_atr, atr_mult, sl_pct, capital):
    cash, position, entry, side = capital, 0.0, None, None
    equity, trades, long_m, short_m = [], [], [], []

    for i in range(start_idx, len(df)):
        px = df.loc[i, "close"]
        sig = df.loc[i, "final_signal"]
        prev = df.loc[i - 1, "final_signal"]

        # === ENTRY: LONG ===
        if sig == 1 and prev == 0 and cash > 0 and side != "long":
            # open long
            position = cash / px
            entry, side = px, "long"
            cash = 0.0
            trades.append({"entry": px, "exit": None, "pnl": None, "side": "long"})
            long_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "low"] * 0.98})

        # === EXIT LONG / FLIP TO SHORT ===
        elif sig == 0 and prev == 1 and position > 0 and side == "long":
            exit_px = px
            cash = position * exit_px
            pnl = (exit_px / entry) - 1
            trades[-1].update({"exit": exit_px, "pnl": pnl})
            short_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "high"] * 1.02})

            # flip into short
            position = cash / px
            entry, side = px, "short"
            cash = 0.0
            trades.append({"entry": px, "exit": None, "pnl": None, "side": "short"})

        # === EXIT SHORT / FLIP BACK LONG ===
        elif sig == 1 and prev == 0 and position > 0 and side == "short":
            exit_px = px
            cash = position * (2 * entry - exit_px)  # short close
            pnl = (entry / exit_px) - 1
            trades[-1].update({"exit": exit_px, "pnl": pnl})
            long_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "low"] * 0.98})

            # flip into long
            position = cash / px
            entry, side = px, "long"
            cash = 0.0
            trades.append({"entry": px, "exit": None, "pnl": None, "side": "long"})

        # === STOP LOSS HANDLING (optional) ===
        if position > 0 and entry is not None:
            if side == "long":
                if use_atr and "atr" in df.columns:
                    stop_price = entry * (1 - atr_mult * df.loc[i, "atr"] / entry)
                elif sl_pct:
                    stop_price = entry * (1 - sl_pct)
                else:
                    stop_price = 0
                if px <= stop_price:
                    exit_px = stop_price
                    cash = position * exit_px
                    trades[-1].update({"exit": exit_px, "pnl": (exit_px / entry) - 1})
                    short_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "high"] * 1.02})
                    position, entry, side = 0.0, None, None

            elif side == "short":
                if use_atr and "atr" in df.columns:
                    stop_price = entry * (1 + atr_mult * df.loc[i, "atr"] / entry)
                elif sl_pct:
                    stop_price = entry * (1 + sl_pct)
                else:
                    stop_price = np.inf
                if px >= stop_price:
                    exit_px = stop_price
                    cash = position * (2 * entry - exit_px)
                    trades[-1].update({"exit": exit_px, "pnl": (entry / exit_px) - 1})
                    long_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "low"] * 0.98})
                    position, entry, side = 0.0, None, None

        # === EQUITY TRACKING (always append once per bar) ===
        if side == "short" and entry is not None:
            equity_val = cash + position * (2 * entry - px)
        else:
            equity_val = cash + position * px
        equity.append(equity_val)

    return equity, trades, long_m, short_m

# main function
def main():
    body = json.load(sys.stdin)
    df = pd.DataFrame(body["data"]).reset_index(drop=True)
    indicators = body.get("indicators", [])
    stop_loss_text = (body.get("stop_loss") or "3%").strip()
    capital = float(body.get("capital", 1000))
    mode = body.get("mode", "longshort").lower()

    for col in ["open", "high", "low", "close", "volume"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")
    df["open_time"] = pd.to_datetime(df["open_time"], errors="coerce")

    lookbacks, plots, signal_cols = [], [], []

    for idx, ind in enumerate(indicators):
        name = str(ind.get("name", "")).strip()
        if not name:
            continue
        params = dict(ind.get("params", {}))
        lower_name = name.lower().replace(" ", "_")
        for k, v in params.items():
            if k.startswith("n_") and isinstance(v, (int, float)):
                lookbacks.append(int(v))

        # determine the correct input column (source)
        source_key = None
        for key in list(params.keys()):
            if key.startswith("source_"):
                source_key = params.pop(key)
                break
        if not source_key and "source" in params:
            source_key = params.pop("source")

        src = ensure_derived_sources(df, source_key or "close")

        # import indicator and sanitize parameters
        func = import_indicator(lower_name)
        sig_params = inspect.signature(func).parameters
        valid_params = {k: v for k, v in params.items() if k in sig_params and not k.startswith("source")}
        df[lower_name] = func(df[src], **valid_params)

        sig_col = f"sig_{lower_name}"
        df[sig_col] = (df["close"] > df[lower_name]).astype(int)
        signal_cols.append(sig_col)

        if idx == 0 and name.upper() in OVERLAY_INDICATORS:
            plots.append({
                "name": lower_name,
                "display_name": name.upper(),
                "signal_col": sig_col,
                "color_up": "rgba(0,200,0,0.7)",
                "color_down": "rgba(200,0,0,0.7)"
            })

    df["final_signal"] = df[signal_cols].all(axis=1).astype(int)
    start_idx = max(lookbacks) if lookbacks else 1

    # stop-loss parsing
    use_atr, atr_mult, sl_pct = False, None, None
    if "atr" in stop_loss_text.lower() or "x" in stop_loss_text.lower():
        try:
            atr_mult = float(stop_loss_text.split("x")[-1])
            use_atr = True
        except:
            atr_mult = 1.5
    else:
        try:
            sl_pct = float(stop_loss_text.replace("%", "")) / 100.0
        except:
            sl_pct = 0.03

    if use_atr:
        atr_mod = import_indicator("atr")
        atr_df = atr_mod(df, n_atr=10)
        df = df.join(atr_df[["tr", "atr"]])

    # Select mode runner
    if mode == "long":
        eq, trades, long_m, short_m = run_long(df, start_idx, use_atr, atr_mult, sl_pct, capital)
    elif mode == "short":
        eq, trades, long_m, short_m = run_short(df, start_idx, use_atr, atr_mult, sl_pct, capital)
    else:
        eq, trades, long_m, short_m = run_longshort(df, start_idx, use_atr, atr_mult, sl_pct, capital)

    # align equity
    full_equity = [capital] * start_idx + eq
    full_equity = full_equity[:len(df)]
    df["equity"] = full_equity

    rets = df["equity"].pct_change().fillna(0).values
    metrics = compute_metrics(df["equity"].values, rets, trades)

    # clean dataframe before returning
    df = df.replace([np.inf, -np.inf], np.nan).fillna(0.0)
    df = df[start_idx:]
    result = {
        "df": df.to_dict(orient="records"),
        "metrics": metrics,
        "markers": {"long": long_m, "short": short_m},
        "plots": plots,
    }
    return result

if __name__ == "__main__":
    try:
        # silence accidental prints
        import sys, io
        sys.stdout = io.StringIO()  # catch stray prints temporarily

        result = main()

        # reset stdout and print clean JSON only
        sys.stdout = sys.__stdout__
        json_output = json.dumps(result, ensure_ascii=False, allow_nan=False, default=str)
        sys.stdout.write(json_output)
        sys.stdout.flush()

    except Exception as e:
        import traceback
        traceback.print_exc(file=sys.stderr)
        sys.stderr.write(f"[BACKTEST ERROR] {e}\n")
        sys.exit(1)