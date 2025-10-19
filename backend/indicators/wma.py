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
    src = src.dropna()
    n = len(src)
    
    if n < periods:
        raise ValueError("Periods can't be greater than data length")
    
    w = np.arange(1, periods+1)
    w_sum = w.sum()
    weights = w/w_sum
    wma = src.rolling(window = periods).apply(lambda y: np.dot(y, weights), raw = True)    
    
    return wma