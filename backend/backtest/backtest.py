# backend/backtest/backtest.py
import pandas as pd
import numpy as np
import json
import sys
import importlib
from pathlib import Path

# === helper ===
def pick_price(row, src: str = "close") -> float:
    """Select a source price based on keyword."""
    o, h, l, c = row["open"], row["high"], row["low"], row["close"]
    if src == "open":
        return o
    if src == "hl2":
        return (h + l) / 2
    if src == "hlc3":
        return (h + l + c) / 3
    if src == "ohlc4":
        return (o + h + l + c) / 4
    return c

def compute_metrics(equity, returns, trades):
    """Compute basic performance metrics."""
    pnl_pct = (equity[-1] / equity[0] - 1) * 100
    ret_arr = np.array(returns)
    if ret_arr.std() == 0:
        sharpe = 0.0
    else:
        sharpe = (ret_arr.mean() / ret_arr.std()) * np.sqrt(252)
    wins = [t for t in trades if t["pnl"] > 0]
    losses = [t for t in trades if t["pnl"] < 0]
    win_rate = len(wins) / len(trades) * 100 if trades else 0
    profit_factor = (
        sum(t["pnl"] for t in wins) / abs(sum(t["pnl"] for t in losses))
        if losses else np.inf
    )
    max_dd = 0
    peak = equity[0]
    for e in equity:
        peak = max(peak, e)
        dd = (e / peak) - 1
        max_dd = min(max_dd, dd)
    return {
        "pnlPct": f"{pnl_pct:.2f} %",
        "winRate": f"{win_rate:.1f} %",
        "sharpe": f"{sharpe:.2f}",
        "profitFactor": "∞" if profit_factor == np.inf else f"{profit_factor:.2f}",
        "maxDD": f"{max_dd*100:.2f} %",
    }

def main():
    # === 1️⃣ read JSON input from stdin ===
    body = json.load(sys.stdin)
    df = pd.DataFrame(body["data"])
    indicators = body.get("indicators", [])
    stop_loss_text = body.get("stop_loss", "3%")
    capital = float(body.get("capital", 1000))

    # === 2️⃣ compute indicators ===
    for ind in indicators:
        name = ind["name"].upper()
        params = ind.get("params", {})
        src = params.get("source_sma", "close")

        # dynamically import indicator
        module_path = Path(__file__).resolve().parents[1] / "indicators" / f"{name.lower()}.py"
        spec = importlib.util.spec_from_file_location(name.lower(), module_path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)

        func = getattr(module, name.lower())
        series = func(df[src], **params)
        df[name.lower()] = series

        # add binary signal for this indicator
        df[f"sig_{name.lower()}"] = (df["close"] > df[name.lower()]).astype(int)

    # === 3️⃣ combine signals (AND logic for multiple indicators) ===
    sig_cols = [c for c in df.columns if c.startswith("sig_")]
    df["final_signal"] = df[sig_cols].all(axis=1).astype(int)

    # === 4️⃣ run simple long/flat backtest ===
    sl_pct = None
    if "%" in stop_loss_text:
        try:
            sl_pct = float(stop_loss_text.replace("%", "").strip()) / 100
        except:
            sl_pct = None

    position = 0
    cash = capital
    equity_curve = []
    trades = []
    long_markers, short_markers = [], []
    entry_price = None

    for i in range(1, len(df)):
        px = df.loc[i, "close"]
        sig, prev = df.loc[i, "final_signal"], df.loc[i - 1, "final_signal"]

        # long entry
        if sig == 1 and prev == 0:
            position = cash / px
            entry_price = px
            cash = 0
            trades.append({"entry": px, "exit": None, "pnl": None})
            long_markers.append({"x": df.loc[i, "open_time"], "y": df.loc[i, "low"] * 0.995})

        # stop loss check
        if position > 0 and sl_pct is not None and entry_price:
            if px <= entry_price * (1 - sl_pct):
                cash = position * entry_price * (1 - sl_pct)
                position = 0
                trades[-1]["exit"] = entry_price * (1 - sl_pct)
                trades[-1]["pnl"] = -sl_pct
                short_markers.append({"x": df.loc[i, "open_time"], "y": df.loc[i, "high"] * 1.005})

        # exit if signal flips
        if sig == 0 and prev == 1 and position > 0:
            cash = position * px
            trades[-1]["exit"] = px
            trades[-1]["pnl"] = (px / entry_price) - 1
            position = 0
            entry_price = None
            short_markers.append({"x": df.loc[i, "open_time"], "y": df.loc[i, "high"] * 1.005})

        # equity update
        equity_curve.append(cash + position * px)

    df = df.iloc[1:].copy()
    df["equity"] = equity_curve

    # === 5️⃣ compute metrics ===
    returns = np.diff(df["equity"]) / df["equity"].shift(1).iloc[1:]
    metrics = compute_metrics(df["equity"].values, returns, trades)

    # === 6️⃣ print JSON output for Node API ===
    result = {
        "df": df.to_dict(orient="records"),
        "metrics": metrics,
        "markers": {"long": long_markers, "short": short_markers},
    }
    print(json.dumps(result, default=str))


if __name__ == "__main__":
    main()