#!/usr/bin/env python3
import pandas as pd
import numpy as np


def wma(source_wma: pd.Series, n_wma=14):
    """
    technical analysis indicator:
    return weighted moving average over a given price series,
    reference: https://www.investopedia.com/ask/answers/071414/whats-difference-between-moving-average-and-weighted-moving-average.asp
    params:
    @source_wma: series, input price series (e.g. df['close'])
    @n_wma: integer, lookback period (default 14)
    returns:
    pd.Series
        wma values aligned with source_wma index
    """

    if not isinstance(source_wma, pd.Series):
        source_ema = pd.Series(source_wma)

    source_wma = pd.to_numeric(source_wma, errors="coerce")

    if len(source_wma) < n_wma:
        raise ValueError("Periods can't be greater than data length")

    w = np.arange(1, n_wma+1)
    w_sum = w.sum()
    weights = w/w_sum
    wma = source_wma.rolling(window = n_wma).apply(lambda y: np.dot(y, weights), raw = True)    
    wma_series = pd.Series(wma, index=source_wma.index, dtype=float)

    return wma_series