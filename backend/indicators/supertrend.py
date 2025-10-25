#!/usr/bin/env python3
import pandas as pd
import numpy as np

def supertrend(df: pd.DataFrame, n_atr: int = 10, mult_atr: float = 3.0) -> pd.Series:
    """
    Supertrend Indicator (single-line version)
    Reference: https://www.investopedia.com/supertrend-indicator-7976167

    params:
        df : pd.DataFrame with columns ['high','low','close']
        n_atr : ATR lookback period (default 10)
        multiplier : ATR multiplier (default 3.0)
    returns:
        pd.Series -> the single-line Supertrend series (upper/lower merged)
    """

    if not all(col in df.columns for col in ["high", "low", "close"]):
        raise ValueError("Input DataFrame must contain high, low, and close columns")

    # --- Step 1: Compute True Range & ATR
    hl = df["high"] - df["low"]
    hc = (df["high"] - df["close"].shift()).abs()
    lc = (df["low"] - df["close"].shift()).abs()
    tr = pd.concat([hl, hc, lc], axis=1).max(axis=1)
    atr = tr.ewm(alpha=1 / n_atr, adjust=False).mean()

    # --- Step 2: Compute Basic Bands
    basic_upper = (df["high"] + df["low"]) / 2 + mult_atr * atr
    basic_lower = (df["high"] + df["low"]) / 2 - mult_atr * atr

    # --- Step 3: Initialize arrays
    final_upper = basic_upper.copy()
    final_lower = basic_lower.copy()
    supertrend = pd.Series(index=df.index, dtype=float)
    trend = 1  # 1 = uptrend, -1 = downtrend

    # --- Step 4: Compute Supertrend series
    for i in range(1, len(df)):
        # final upper/lower logic (carry forward based on previous trend)
        if df["close"].iloc[i - 1] > final_upper.iloc[i - 1]:
            final_upper.iloc[i] = basic_upper.iloc[i]
        else:
            final_upper.iloc[i] = min(basic_upper.iloc[i], final_upper.iloc[i - 1])

        if df["close"].iloc[i - 1] < final_lower.iloc[i - 1]:
            final_lower.iloc[i] = basic_lower.iloc[i]
        else:
            final_lower.iloc[i] = max(basic_lower.iloc[i], final_lower.iloc[i - 1])

        # --- trend switch logic ---
        if trend == 1:
            if df["close"].iloc[i] < final_lower.iloc[i]:
                trend = -1
                supertrend.iloc[i] = final_upper.iloc[i]
            else:
                supertrend.iloc[i] = final_lower.iloc[i]
        else:
            if df["close"].iloc[i] > final_upper.iloc[i]:
                trend = 1
                supertrend.iloc[i] = final_lower.iloc[i]
            else:
                supertrend.iloc[i] = final_upper.iloc[i]

    return supertrend