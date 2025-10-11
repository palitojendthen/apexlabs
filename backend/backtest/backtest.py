import pandas as pd
import numpy as np
import json
import sys
import importlib.util
from pathlib import Path
import os
import traceback
import warnings

warnings.filterwarnings("ignore")
sys.stderr = open(os.devnull, "w")


OVERLAY_INDICATORS = {"SMA", "EMA", "PMA", "KAMA", "DEMA", "TEMA", "ITREND"}

# Helpers
def compute_metrics(equity, returns, trades):
    equity = np.asarray(equity, dtype=float)
    if equity.size == 0:
        return {
            "pnlPct": "0.00 %", "winRate": "0.0 %", "sharpe": "0.00",
            "profitFactor": "0.00", "maxDD": "0.00 %"
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

    max_dd = 0.0
    peak = equity[0]
    for e in equity:
        peak = max(peak, e)
        dd = (e / peak) - 1.0
        max_dd = min(max_dd, dd)

    return {
        "pnlPct": f"{pnl_pct:.2f} %",
        "winRate": f"{win_rate:.1f} %",
        "sharpe": f"{sharpe:.2f}",
        "profitFactor": "∞" if profit_factor == np.inf else f"{profit_factor:.2f}",
        "maxDD": f"{max_dd * 100:.2f} %",
    }

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

def import_indicator(module_basename: str):
    base = module_basename.replace(" ", "_").lower()
    module_path = Path(__file__).resolve().parents[1] / "indicators" / f"{base}.py"
    if not module_path.exists():
        raise FileNotFoundError(f"Indicator module not found: {module_path}")
    spec = importlib.util.spec_from_file_location(base, module_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return getattr(module, base)


# Main
def main():
    body = json.load(sys.stdin)
    df = pd.DataFrame(body["data"]).reset_index(drop=True)
    indicators = body.get("indicators", [])
    stop_loss_text = (body.get("stop_loss") or "3%").strip()
    capital = float(body.get("capital", 1000))

    for col in ["open", "high", "low", "close", "volume"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")
    if "open_time" in df.columns:
        df["open_time"] = pd.to_datetime(df["open_time"], errors="coerce")

    indicator_cols, signal_cols, plots = [], [], []

    for idx, ind in enumerate(indicators):
        name = str(ind.get("name", "")).strip()
        if not name:
            continue
        params = dict(ind.get("params", {}))
        lower_name = name.lower().replace(" ", "_")

        source_key_name = f"source_{lower_name}"
        source_val = params.pop(source_key_name, params.pop("source", "close"))
        src_col = ensure_derived_sources(df, str(source_val))
        func = import_indicator(lower_name)

        if lower_name in ("sma", "ema"):
            if "n" in params and f"n_{lower_name}" not in params:
                params[f"n_{lower_name}"] = params.pop("n")

        import inspect
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
            out_col = lower_name
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

    sl_pct = None
    if "%" in stop_loss_text:
        try:
            sl_pct = float(stop_loss_text.replace("%", "").strip()) / 100.0
        except Exception:
            sl_pct = None

    cash = capital
    position = 0.0
    entry_price = None
    equity_curve, trades = [], []
    long_markers, short_markers = [], []

    for i in range(1, len(df)):
        px = float(df.loc[i, "close"])
        sig = int(df.loc[i, "final_signal"])
        prev = int(df.loc[i - 1, "final_signal"])

        if sig == 1 and prev == 0 and cash > 0:
            position = cash / px
            entry_price = px
            cash = 0.0
            trades.append({"entry": px, "exit": None, "pnl": None})
            long_markers.append({"x": str(df.loc[i, "open_time"]), "y": float(df.loc[i, "low"]) * 0.98})

        if position > 0 and sl_pct is not None and entry_price is not None:
            if px <= entry_price * (1 - sl_pct):
                exit_px = entry_price * (1 - sl_pct)
                cash = position * exit_px
                position = 0.0
                trades[-1]["exit"] = exit_px
                trades[-1]["pnl"] = -sl_pct
                short_markers.append({"x": str(df.loc[i, "open_time"]), "y": float(df.loc[i, "high"]) * 1.02})
                entry_price = None

        if sig == 0 and prev == 1 and position > 0:
            exit_px = px
            cash = position * exit_px
            position = 0.0
            if trades and trades[-1]["exit"] is None and entry_price is not None:
                trades[-1]["exit"] = exit_px
                trades[-1]["pnl"] = (exit_px / entry_price) - 1
            short_markers.append({"x": str(df.loc[i, "open_time"]), "y": float(df.loc[i, "high"]) * 1.02})
            entry_price = None

        equity_curve.append(cash + position * px)

    df = df.iloc[1:].copy()
    df["equity"] = equity_curve
    df = df.replace([np.inf, -np.inf], np.nan)

    for col in df.columns:
        if col not in ['open_time', 'open', 'high', 'low', 'close', 'volume']:
            df[col] = df[col].fillna(method='ffill').fillna(method='bfill')

    rets = df["equity"].pct_change().fillna(0.0).values
    metrics = compute_metrics(df["equity"].values, rets, trades)

    # return clean JSON only
    result = {
        "df": df.to_dict(orient="records"),
        "metrics": metrics,
        "markers": {"long": long_markers, "short": short_markers},
        "plots": plots
    }

    # json_str = json.dumps(result, ensure_ascii=False, default=str)
    json_str = json.dumps(result, ensure_ascii=False, allow_nan=True, default=str)
    sys.stdout.write(json_str)
    sys.stdout.flush()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        traceback.print_exc()
        sys.stderr.write(f"[BACKTEST ERROR] {e}\n")
        sys.exit(1)
