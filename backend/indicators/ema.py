#!/usr/bin/env python3
import pandas as pd
import numpy as np

def ema(source_ema: pd.Series, n_ema=14, alpha_ema=None) -> pd.Series:
    """
    technical analysis indicator:
    compute and return exponential moving average over a given price series,
    referece: https://www.investopedia.com/terms/e/ema.asp
    params:
    @source_ema: series, input price series (e.g. df['close'])
    @n_ema: integer, lookback period (default 14)
    @alpha_ema : float, smoothing factor
    returns:
    pd.Series
        ema values aligned with source_ema index
    """

    if not isinstance(source_ema, pd.Series):
        source_ema = pd.Series(source_ema)

    source_ema = pd.to_numeric(source_ema, errors="coerce")

    if len(source_ema) < n_ema:
        raise ValueError("Periods can't be greater than data length")

    if alpha_ema is None:
        alpha_ema = 2/(n_ema+1)

    _sma = source_ema.rolling(window=n_ema, min_periods=n_ema).mean()
    ema_series = pd.Series(np.nan, index=source_ema.index, dtype=float)

    for i in range(n_ema, len(source_ema)):
        ema_series.iloc[i] = alpha_ema*source_ema.iloc[i]+(1-alpha_ema)*_sma.iloc[i]

    return ema_series
