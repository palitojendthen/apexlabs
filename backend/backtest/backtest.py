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

# ---------- Helper: Metrics ----------
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
            "SL Hit": "0 x",
        }

    trades = [t for t in trades if t.get("pnl") is not None]
    pnl = equity[-1]
    pnl_pct = (equity[-1] / equity[0] - 1) * 100.0
    ret_arr = np.asarray(returns, dtype=float)
    sd = ret_arr.std(ddof=1) if ret_arr.size > 1 else 0.0
    sharpe = 0.0 if sd == 0 else (ret_arr.mean() / sd) * np.sqrt(252)

    wins = [t for t in trades if t["pnl"] > 0]
    losses = [t for t in trades if t["pnl"] < 0]
    win_rate = (len(wins) / len(trades) * 100.0) if trades else 0.0
    profit_factor = (
        (sum(t["pnl"] for t in wins) / abs(sum(t["pnl"] for t in losses)))
        if losses
        else np.inf
    )

    max_dd = 0.0
    peak = equity[0]
    for e in equity:
        peak = max(peak, e)
        dd = (e / peak) - 1.0
        max_dd = min(max_dd, dd)

    return {
        "Final Equity": f"{pnl:.2f}",
        "PnL %": f"{pnl_pct:.2f} %",
        "WinRate": f"{win_rate:.1f} %",
        "Profit Factor": "∞" if profit_factor == np.inf else f"{profit_factor:.2f}",
        "Sharpe": f"{sharpe:.2f}",
        "MaxDD": f"{max_dd * 100:.2f} %",
        "Total Trades": len(trades),
        "Buy & Hold": "—",
        "Largest Loss %": "—",
        "SL Hit": "—",
    }


# ---------- Helper: Derived Sources ----------
def ensure_derived_sources(df: pd.DataFrame, source: str) -> str:
    s = (source or "close").lower()
    if s in df.columns:
        return s
    if s == "hl2":
        df["hl2"] = (df["high"] + df["low"]) / 2.0
        return "hl2"
    if s == "hlc3":
        df["hlc3"] = (df["high"] + df["low"] + df["close"]) / 3.0
        return "hlc3"
    if s == "ohlc4":
        df["ohlc4"] = (df["open"] + df["high"] + df["low"] + df["close"]) / 4.0
        return "ohlc4"
    return "close"


# ---------- Helper: Import Indicator ----------
def import_indicator(module_basename: str):
    base = module_basename.replace(" ", "_").lower()
    module_path = Path(__file__).resolve().parents[1] / "indicators" / f"{base}.py"
    if not module_path.exists():
        raise FileNotFoundError(f"Indicator module not found: {module_path}")
    spec = importlib.util.spec_from_file_location(base, module_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return getattr(module, base)


# ---------- Core Backtest ----------
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

    if "open_time" in df.columns:
        df["open_time"] = pd.to_datetime(df["open_time"], errors="coerce")

    indicator_cols, signal_cols, plots = [], [], []
    lookbacks = []

    # --- Load indicators dynamically ---
    for idx, ind in enumerate(indicators):
        name = str(ind.get("name", "")).strip()
        if not name:
            continue
        params = dict(ind.get("params", {}))
        lower_name = name.lower().replace(" ", "_")

        # determine lookback if present
        for k, v in params.items():
            if k.startswith("n_") and isinstance(v, (int, float)):
                lookbacks.append(int(v))

        source_key_name = f"source_{lower_name}"
        source_val = params.pop(source_key_name, params.pop("source", "close"))
        src_col = ensure_derived_sources(df, str(source_val))
        func = import_indicator(lower_name)

        sig = inspect.signature(func)
        valid_params = set(sig.parameters.keys())
        params = {k: v for k, v in params.items() if k in valid_params}

        series = func(df[src_col], **params)
        out_col = lower_name
        df[out_col] = pd.Series(series).reset_index(drop=True)
        df[out_col] = pd.to_numeric(df[out_col], errors="coerce").fillna(method="ffill").fillna(method="bfill")
        indicator_cols.append(out_col)

        sig_col = f"sig_{out_col}"
        df[sig_col] = (df["close"] > df[out_col]).astype(int)
        signal_cols.append(sig_col)

        if idx == 0 and name.upper() in OVERLAY_INDICATORS:
            plots.append({
                "name": out_col,
                "display_name": name.upper(),
                "signal_col": sig_col,
                "color_up": "rgba(0,200,0,0.7)",
                "color_down": "rgba(200,0,0,0.7)"
            })

    if not signal_cols:
        df["sig_dummy"] = 0
        signal_cols = ["sig_dummy"]

    df["final_signal"] = df[signal_cols].all(axis=1).astype(int)

    # --- Stop-loss type ---
    use_atr, atr_mult, sl_pct = False, None, None
    if "atr" in stop_loss_text.lower() or "x" in stop_loss_text.lower():
        try:
            atr_mult = float(stop_loss_text.split("x")[-1].strip())
            use_atr = True
        except Exception:
            atr_mult = 1.5
    else:
        try:
            sl_pct = float(stop_loss_text.replace("%", "").strip()) / 100.0
        except Exception:
            sl_pct = 0.03

    if use_atr:
        atr_mod = import_indicator("atr")
        atr_df = atr_mod(df, n_atr=10)
        df = df.join(atr_df[["tr", "atr"]])

    # --- Initialize ---
    cash = capital
    position = 0.0
    entry_price = None
    equity_curve, trades = [], []
    long_markers, short_markers = [], []

    start_idx = max(lookbacks) if lookbacks else 1

    # --- Backtest Loop ---
    for i in range(start_idx, len(df)):
        px = float(df.loc[i, "close"])
        sig = int(df.loc[i, "final_signal"])
        prev = int(df.loc[i - 1, "final_signal"])

        # ENTRY
        if sig == 1 and prev == 0 and cash > 0:
            position = cash / px
            entry_price = px
            cash = 0.0
            trades.append({"entry": px, "exit": None, "pnl": None, "side": "long"})
            long_markers.append({"x": str(df.loc[i, "open_time"]), "y": float(df.loc[i, "low"]) * 0.98})

        # STOP LOSS
        elif position > 0 and entry_price is not None:
            if use_atr and "atr" in df.columns:
                atr_val = float(df.loc[i, "atr"])
                stop_price = entry_price * (1 - atr_mult * atr_val / entry_price)
            elif sl_pct:
                stop_price = entry_price * (1 - sl_pct)
            else:
                stop_price = 0

            if px <= stop_price:
                exit_px = stop_price
                cash = position * exit_px
                trades[-1].update({"exit": exit_px, "pnl": (exit_px / entry_price) - 1})
                short_markers.append({"x": str(df.loc[i, "open_time"]), "y": float(df.loc[i, "high"]) * 1.02})
                position, entry_price = 0.0, None
                continue

        # LONG → SHORT FLIP
        elif mode == "longshort" and sig == 0 and prev == 1 and position > 0:
            exit_px = px
            cash = position * exit_px
            pnl = (exit_px / entry_price) - 1
            trades[-1].update({"exit": exit_px, "pnl": pnl})
            short_markers.append({"x": str(df.loc[i, "open_time"]), "y": float(df.loc[i, "high"]) * 1.02})
            position = cash / px
            entry_price = px
            trades.append({"entry": px, "exit": None, "pnl": None, "side": "short"})

        # LONG ONLY EXIT
        elif mode == "long" and sig == 0 and prev == 1 and position > 0:
            exit_px = px
            cash = position * exit_px
            pnl = (exit_px / entry_price) - 1
            trades[-1].update({"exit": exit_px, "pnl": pnl})
            short_markers.append({"x": str(df.loc[i, "open_time"]), "y": float(df.loc[i, "high"]) * 1.02})
            position, entry_price = 0.0, None

        equity_curve.append(cash + position * px)

    # # --- Finalize Equity ---
    # pad_len = start_idx
    # padded_equity = [capital] * pad_len + equity_curve
    # padded_equity = padded_equity[:len(df)]
    # df["equity"] = padded_equity

    # --- Finalize Equity ---
    pad_len = start_idx
    # build full equity vector (same length as full df)
    full_equity = [capital] * start_idx + equity_curve

    # ensure alignment
    if len(full_equity) < len(df):
        # pad the rest (shouldn't happen, but safe)
        full_equity += [full_equity[-1]] * (len(df) - len(full_equity))
    elif len(full_equity) > len(df):
        # trim if overshoot
        full_equity = full_equity[:len(df)]

    df["equity"] = full_equity

    df = df.replace([np.inf, -np.inf], np.nan)

    rets = df["equity"].pct_change().fillna(0.0).values
    metrics = compute_metrics(df["equity"].values, rets, trades)

    # --- Output ---
    result = {
        "df": df.to_dict(orient="records"),
        "metrics": metrics,
        "markers": {"long": long_markers, "short": short_markers},
        "plots": plots,
    }
    return result


if __name__ == "__main__":
    try:
        result = main()
        json.dump(result, sys.stdout, ensure_ascii=False, allow_nan=True, default=str)
        sys.stdout.flush()
    except Exception as e:
        traceback.print_exc()
        sys.stderr.write(f"[BACKTEST ERROR] {e}\n")
        sys.exit(1)