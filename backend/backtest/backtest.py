# #!/usr/bin/env python3
# import pandas as pd
# import numpy as np
# import json
# import sys
# import importlib.util
# from pathlib import Path
# import traceback
# import warnings
# import inspect
# import io

# warnings.filterwarnings("ignore")
# OVERLAY_INDICATORS = {"SMA", "EMA", "PMA", "KAMA", "DEMA", "TEMA", "ITREND"}


# # helper function
# # metrics
# def compute_metrics(equity, returns, trades):
#     equity = np.asarray(equity, dtype=float)
#     if equity.size == 0:
#         return {
#             "Final Equity": "0.00",
#             "PnL %": "0.00 %",
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
#     pnl_pct = (equity[-1] / equity[0] - 1) * 100.0
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

#     # max drawdown
#     peak, max_dd = equity[0], 0
#     for e in equity:
#         peak = max(peak, e)
#         dd = (e / peak) - 1.0
#         max_dd = min(max_dd, dd)

#     return {
#         "Final Equity": f"{equity[-1]:.2f}",
#         "PnL %": f"{pnl_pct:.2f} %",
#         "WinRate": f"{win_rate:.1f} %",
#         "Profit Factor": "∞" if profit_factor == np.inf else f"{profit_factor:.2f}",
#         "Sharpe": f"{sharpe:.2f}",
#         "MaxDD": f"{max_dd * 100:.2f} %",
#         "Total Trades": len(trades),
#         "Buy & Hold": "0.00 %",
#         "Largest Loss %": "0.00 %"
#         ,"SL Hit": "Nx"
#     }

# # sources
# def ensure_derived_sources(df, source):
#     s = (source or "close").lower()
#     if s in df.columns:
#         return s
#     if s == "hl2":
#         df["hl2"] = (df["high"] + df["low"]) / 2
#         return "hl2"
#     if s == "hlc3":
#         df["hlc3"] = (df["high"] + df["low"] + df["close"]) / 3
#         return "hlc3"
#     if s == "ohlc4":
#         df["ohlc4"] = (df["open"] + df["high"] + df["low"] + df["close"]) / 4
#         return "ohlc4"
#     return "close"

# # import indicator
# def import_indicator(module_basename):
#     base = module_basename.replace(" ", "_").lower()
#     module_path = Path(__file__).resolve().parents[1] / "indicators" / f"{base}.py"
#     if not module_path.exists():
#         raise FileNotFoundError(f"Indicator module not found: {module_path}")
#     spec = importlib.util.spec_from_file_location(base, module_path)
#     module = importlib.util.module_from_spec(spec)
#     spec.loader.exec_module(module)
#     return getattr(module, base)

# # long-only strategy
# def run_long(df, start_idx, use_atr, atr_mult, sl_pct, capital):
#     cash, position, entry = capital, 0.0, None
#     equity, trades, long_m, short_m = [], [], [], []

#     for i in range(start_idx, len(df)):
#         px = df.loc[i, "close"]
#         sig = df.loc[i, "final_signal"]
#         prev = df.loc[i - 1, "final_signal"]

#         # entry long
#         if sig == 1 and prev == 0 and cash > 0:
#             position = cash / px
#             entry = px
#             cash = 0
#             trades.append({"entry": px, "exit": None, "pnl": None})
#             long_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "low"] * 0.98})

#         # stop-loss or exit
#         if position > 0 and entry:
#             if use_atr and "atr" in df.columns:
#                 stop_price = entry * (1 - atr_mult * df.loc[i, "atr"] / entry)
#             elif sl_pct:
#                 stop_price = entry * (1 - sl_pct)
#             else:
#                 stop_price = 0

#             if px <= stop_price or (sig == 0 and prev == 1):
#                 exit_px = stop_price if px <= stop_price else px
#                 cash = position * exit_px
#                 trades[-1]["exit"] = exit_px
#                 trades[-1]["pnl"] = (exit_px / entry) - 1
#                 short_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "high"] * 1.02})
#                 position, entry = 0, None

#         equity.append(cash + position * px)

#     return equity, trades, long_m, short_m

# # short-only strategy
# def run_short(df, start_idx, use_atr, atr_mult, sl_pct, capital):
#     cash, position, entry = capital, 0.0, None
#     equity, trades, short_m, cover_m = [], [], [], []

#     for i in range(start_idx, len(df)):
#         px = df.loc[i, "close"]
#         sig = df.loc[i, "final_signal"]
#         prev = df.loc[i - 1, "final_signal"]

#         # enter short
#         if sig == 0 and prev == 1 and cash > 0:
#             position = cash / px
#             entry = px
#             cash = 0
#             trades.append({"entry": px, "exit": None, "pnl": None})
#             short_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "high"] * 1.02})

#         # exit short
#         if position > 0 and entry:
#             if use_atr and "atr" in df.columns:
#                 stop_price = entry * (1 + atr_mult * df.loc[i, "atr"] / entry)
#             elif sl_pct:
#                 stop_price = entry * (1 + sl_pct)
#             else:
#                 stop_price = np.inf

#             if px >= stop_price or (sig == 1 and prev == 0):
#                 exit_px = stop_price if px >= stop_price else px
#                 cash = position * (2 * entry - exit_px)
#                 trades[-1]["exit"] = exit_px
#                 trades[-1]["pnl"] = (entry / exit_px) - 1
#                 cover_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "low"] * 0.98})
#                 position, entry = 0, None

#         equity.append(cash + position * (2 * entry - px if entry else px))

#     return equity, trades, cover_m, short_m

# # long-short strategy
# def run_longshort(df, start_idx, use_atr, atr_mult, sl_pct, capital):
#     cash, position, entry, side = capital, 0.0, None, None
#     equity, trades, long_m, short_m = [], [], [], []

#     for i in range(start_idx, len(df)):
#         px = df.loc[i, "close"]
#         sig = df.loc[i, "final_signal"]
#         prev = df.loc[i - 1, "final_signal"]

#         # entry long
#         if sig == 1 and prev == 0 and cash > 0 and side != "long":
#             # open long
#             position = cash / px
#             entry, side = px, "long"
#             cash = 0.0
#             trades.append({"entry": px, "exit": None, "pnl": None, "side": "long"})
#             long_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "low"] * 0.98})

#         # exit long/flip signal
#         elif sig == 0 and prev == 1 and position > 0 and side == "long":
#             exit_px = px
#             cash = position * exit_px
#             pnl = (exit_px / entry) - 1
#             trades[-1].update({"exit": exit_px, "pnl": pnl})
#             short_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "high"] * 1.02})

#             # flip into short
#             position = cash / px
#             entry, side = px, "short"
#             cash = 0.0
#             trades.append({"entry": px, "exit": None, "pnl": None, "side": "short"})

#         # exit short/flip signal
#         elif sig == 1 and prev == 0 and position > 0 and side == "short":
#             exit_px = px
#             cash = position * (2 * entry - exit_px)  # short close
#             pnl = (entry / exit_px) - 1
#             trades[-1].update({"exit": exit_px, "pnl": pnl})
#             long_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "low"] * 0.98})

#             # flip into long
#             position = cash / px
#             entry, side = px, "long"
#             cash = 0.0
#             trades.append({"entry": px, "exit": None, "pnl": None, "side": "long"})

#         # stop-loss handling
#         if position > 0 and entry is not None:
#             if side == "long":
#                 if use_atr and "atr" in df.columns:
#                     stop_price = entry * (1 - atr_mult * df.loc[i, "atr"] / entry)
#                 elif sl_pct:
#                     stop_price = entry * (1 - sl_pct)
#                 else:
#                     stop_price = 0
#                 if px <= stop_price:
#                     exit_px = stop_price
#                     cash = position * exit_px
#                     trades[-1].update({"exit": exit_px, "pnl": (exit_px / entry) - 1})
#                     short_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "high"] * 1.02})
#                     position, entry, side = 0.0, None, None

#             elif side == "short":
#                 if use_atr and "atr" in df.columns:
#                     stop_price = entry * (1 + atr_mult * df.loc[i, "atr"] / entry)
#                 elif sl_pct:
#                     stop_price = entry * (1 + sl_pct)
#                 else:
#                     stop_price = np.inf
#                 if px >= stop_price:
#                     exit_px = stop_price
#                     cash = position * (2 * entry - exit_px)
#                     trades[-1].update({"exit": exit_px, "pnl": (entry / exit_px) - 1})
#                     long_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "low"] * 0.98})
#                     position, entry, side = 0.0, None, None

#         # equity tracking
#         if side == "short" and entry is not None:
#             equity_val = cash + position * (2 * entry - px)
#         else:
#             equity_val = cash + position * px
#         equity.append(equity_val)

#     return equity, trades, long_m, short_m


# # main function
# def main():
#     body = json.load(sys.stdin)
#     df = pd.DataFrame(body["data"]).reset_index(drop=True)
#     indicators = body.get("indicators", [])
#     stop_loss_text = (body.get("stop_loss") or "3%").strip()
#     capital = float(body.get("capital", 1000))
#     mode = body.get("mode", "longshort").lower()

#     for col in ["open", "high", "low", "close", "volume"]:
#         if col in df.columns:
#             df[col] = pd.to_numeric(df[col], errors="coerce")
#     df["open_time"] = pd.to_datetime(df["open_time"], errors="coerce")

#     lookbacks, plots, signal_cols = [], [], []

#     for idx, ind in enumerate(indicators):
#         name = str(ind.get("name", "")).strip()
#         if not name:
#             continue
#         params = dict(ind.get("params", {}))
#         lower_name = name.lower().replace(" ", "_")
#         for k, v in params.items():
#             if k.startswith("n_") and isinstance(v, (int, float)):
#                 lookbacks.append(int(v))

#         # determine the correct input column (source)
#         source_key = None
#         for key in list(params.keys()):
#             if key.startswith("source_"):
#                 source_key = params.pop(key)
#                 break
#         if not source_key and "source" in params:
#             source_key = params.pop("source")

#         src = ensure_derived_sources(df, source_key or "close")

#         # import indicator and sanitize parameters
#         func = import_indicator(lower_name)
#         sig_params = inspect.signature(func).parameters
#         valid_params = {k: v for k, v in params.items() if k in sig_params and not k.startswith("source")}
#         df[lower_name] = func(df[src], **valid_params)

#         sig_col = f"sig_{lower_name}"
#         df[sig_col] = (df["close"] > df[lower_name]).astype(int)
#         signal_cols.append(sig_col)

#         if idx == 0 and name.upper() in OVERLAY_INDICATORS:
#             plots.append({
#                 "name": lower_name,
#                 "display_name": name.upper(),
#                 "signal_col": sig_col,
#                 "color_up": "rgba(0,200,0,0.7)",
#                 "color_down": "rgba(200,0,0,0.7)"
#             })

#     df["final_signal"] = df[signal_cols].all(axis=1).astype(int)
#     start_idx = max(lookbacks) if lookbacks else 1

#     # stop-loss parsing
#     use_atr, atr_mult, sl_pct = False, None, None
#     if "atr" in stop_loss_text.lower() or "x" in stop_loss_text.lower():
#         try:
#             atr_mult = float(stop_loss_text.split("x")[-1])
#             use_atr = True
#         except:
#             atr_mult = 1.5
#     else:
#         try:
#             sl_pct = float(stop_loss_text.replace("%", "")) / 100.0
#         except:
#             sl_pct = 0.03

#     if use_atr:
#         atr_mod = import_indicator("atr")
#         atr_df = atr_mod(df, n_atr=10)
#         df = df.join(atr_df[["tr", "atr"]])

#     # select mode runner
#     if mode == "long":
#         eq, trades, long_m, short_m = run_long(df, start_idx, use_atr, atr_mult, sl_pct, capital)
#     elif mode == "short":
#         eq, trades, long_m, short_m = run_short(df, start_idx, use_atr, atr_mult, sl_pct, capital)
#     else:
#         eq, trades, long_m, short_m = run_longshort(df, start_idx, use_atr, atr_mult, sl_pct, capital)

#     # align equity
#     full_equity = [capital] * start_idx + eq
#     full_equity = full_equity[:len(df)]
#     df["equity"] = full_equity

#     rets = df["equity"].pct_change().fillna(0).values
#     metrics = compute_metrics(df["equity"].values, rets, trades)

#     # clean dataframe before returning
#     df = df.replace([np.inf, -np.inf], np.nan).fillna(0.0)
#     df = df[start_idx:]
#     result = {
#         "df": df.to_dict(orient="records"),
#         "metrics": metrics,
#         "markers": {"long": long_m, "short": short_m},
#         "plots": plots,
#     }
#     return result

# if __name__ == "__main__":
#     try:
#         # silence accidental prints, catch stray prints temporarily
#         sys.stdout = io.StringIO()

#         result = main()

#         # reset stdout and print clean json only
#         sys.stdout = sys.__stdout__
#         json_output = json.dumps(result, ensure_ascii=False, allow_nan=False, default=str)
#         sys.stdout.write(json_output)
#         sys.stdout.flush()

#     except Exception as e:
#         import traceback
#         traceback.print_exc(file=sys.stderr)
#         sys.stderr.write(f"[BACKTEST ERROR] {e}\n")
#         sys.exit(1)



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
OVERLAY_INDICATORS = {"SMA", "EMA", "PMA", "KAMA", "DEMA", "TEMA", "ITREND"}


# utility function
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
        "Largest Loss %": "0.00 %",
        "SL Hit": "Nx"
    }

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

def import_indicator(module_basename):
    base = module_basename.replace(" ", "_").lower()
    module_path = Path(__file__).resolve().parents[1] / "indicators" / f"{base}.py"
    if not module_path.exists():
        raise FileNotFoundError(f"Indicator module not found: {module_path}")
    spec = importlib.util.spec_from_file_location(base, module_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return getattr(module, base)

# signal generation
def apply_technicals(df, indicators, user_tier="free"):
    """
    Apply indicator-based trading signals dynamically.
    Supports SMA, EMA, ADX for up to 3 indicators.
    Indicator 3 is disabled (NaN) for free users.
    """
    signal_cols = []

    for idx, ind in enumerate(indicators, start=1):
        name = str(ind.get("name", "")).strip().lower().replace(" ", "_")
        sig_col = f"sig_{name}_{idx}"

        # free plan limit
        if user_tier == "free" and idx == 3:
            df[sig_col] = np.nan
            signal_cols.append(sig_col)
            continue

        # simple moving average
        if name == "sma" and "sma" in df.columns:
            df[sig_col] = np.where(df["close"] > df["sma"], 1, 0)
        
        # exponential moving average
        elif name == "ema" and "ema" in df.columns:
            df[sig_col] = np.where(df["close"] > df["ema"], 1, 0)
        
        # weighted moving average
        elif name == "wma" and "wma" in df.columns:
            df[sig_col] = np.where(df["close"] > df["wma"], 1, 0)

        # average directional index
        elif name == "adx" and "adx" in df.columns:
            df[sig_col] = np.where(df["adx"] > 20, 1, 0)

        # fallback
        else:
            df[sig_col] = 0

        signal_cols.append(sig_col)

    # final combined signal
    active_sigs = [c for c in signal_cols if df[c].notna().any()]
    if not active_sigs:
        df["final_signal"] = 0
    elif len(active_sigs) == 1:
        df["final_signal"] = df[active_sigs[0]]
    else:
        df["final_signal"] = df[active_sigs].all(axis=1).astype(int)

    return df


# strategy engines
def run_long(df, start_idx, use_atr, atr_mult, sl_pct, capital):
    cash, position, entry = capital, 0.0, None
    equity, trades, long_m, short_m = [], [], [], []

    for i in range(start_idx, len(df)):
        px = df.loc[i, "close"]
        sig = df.loc[i, "final_signal"]
        prev = df.loc[i - 1, "final_signal"]

        if sig == 1 and prev == 0 and cash > 0:
            position = cash / px
            entry = px
            cash = 0
            trades.append({"entry": px, "exit": None, "pnl": None})
            long_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "low"] * 0.98})

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

        if sig == 0 and prev == 1 and cash > 0:
            position = cash / px
            entry = px
            cash = 0
            trades.append({"entry": px, "exit": None, "pnl": None})
            short_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "high"] * 1.02})

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

def run_longshort(df, start_idx, use_atr, atr_mult, sl_pct, capital):
    cash, position, entry, side = capital, 0.0, None, None
    equity, trades, long_m, short_m = [], [], [], []

    for i in range(start_idx, len(df)):
        px = df.loc[i, "close"]
        sig = df.loc[i, "final_signal"]
        prev = df.loc[i - 1, "final_signal"]

        if sig == 1 and prev == 0 and cash > 0 and side != "long":
            position = cash / px
            entry, side = px, "long"
            cash = 0.0
            trades.append({"entry": px, "exit": None, "pnl": None, "side": "long"})
            long_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "low"] * 0.98})

        elif sig == 0 and prev == 1 and position > 0 and side == "long":
            exit_px = px
            cash = position * exit_px
            pnl = (exit_px / entry) - 1
            trades[-1].update({"exit": exit_px, "pnl": pnl})
            short_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "high"] * 1.02})

            position = cash / px
            entry, side = px, "short"
            cash = 0.0
            trades.append({"entry": px, "exit": None, "pnl": None, "side": "short"})

        elif sig == 1 and prev == 0 and position > 0 and side == "short":
            exit_px = px
            cash = position * (2 * entry - exit_px)
            pnl = (entry / exit_px) - 1
            trades[-1].update({"exit": exit_px, "pnl": pnl})
            long_m.append({"x": str(df.loc[i, "open_time"]), "y": df.loc[i, "low"] * 0.98})

            position = cash / px
            entry, side = px, "long"
            cash = 0.0
            trades.append({"entry": px, "exit": None, "pnl": None, "side": "long"})

        # stop-loss check
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

        equity_val = cash + position * (2 * entry - px if side == "short" and entry else px)
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

    lookbacks, plots = [], []

    for idx, ind in enumerate(indicators):
        name = str(ind.get("name", "")).strip()
        if not name:
            continue
        params = dict(ind.get("params", {}))
        lower_name = name.lower().replace(" ", "_")

        for k, v in params.items():
            if k.startswith("n_") and isinstance(v, (int, float)):
                lookbacks.append(int(v))

        source_key = None
        for key in list(params.keys()):
            if key.startswith("source_"):
                source_key = params.pop(key)
                break
        if not source_key and "source" in params:
            source_key = params.pop("source")

        src = ensure_derived_sources(df, source_key or "close")
        func = import_indicator(lower_name)
        sig_params = inspect.signature(func).parameters
        valid_params = {k: v for k, v in params.items() if k in sig_params and not k.startswith("source")}
        df[lower_name] = func(df[src], **valid_params)

        if idx == 0 and name.upper() in OVERLAY_INDICATORS:
            plots.append({
                "name": lower_name,
                "display_name": name.upper(),
                "signal_col": f"sig_{lower_name}_{idx+1}",
                "color_up": "rgba(0,200,0,0.7)",
                "color_down": "rgba(200,0,0,0.7)"
            })

    # apply technical/signal generated
    df = apply_technicals(df, indicators, user_tier="free")

    start_idx = max(lookbacks) if lookbacks else 1

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

    if mode == "long":
        eq, trades, long_m, short_m = run_long(df, start_idx, use_atr, atr_mult, sl_pct, capital)
    elif mode == "short":
        eq, trades, long_m, short_m = run_short(df, start_idx, use_atr, atr_mult, sl_pct, capital)
    else:
        eq, trades, long_m, short_m = run_longshort(df, start_idx, use_atr, atr_mult, sl_pct, capital)

    full_equity = [capital] * start_idx + eq
    full_equity = full_equity[:len(df)]
    df["equity"] = full_equity

    rets = df["equity"].pct_change().fillna(0).values
    metrics = compute_metrics(df["equity"].values, rets, trades)

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
        # silence accidental prints, catch stray prints temporarily
        sys.stdout = io.StringIO()

        result = main()

        # reset stdout and print clean json only
        sys.stdout = sys.__stdout__
        json_output = json.dumps(result, ensure_ascii=False, allow_nan=False, default=str)
        sys.stdout.write(json_output)
        sys.stdout.flush()

    except Exception as e:
        import traceback
        traceback.print_exc(file=sys.stderr)
        sys.stderr.write(f"[BACKTEST ERROR] {e}\n")
        sys.exit(1)