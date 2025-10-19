#!/usr/bin/env python3
import pandas as pd
import numpy as np


def wma(source_wma: pd.Series, n_wma=14):
    """
    technical analysis indicator:
    return weighted moving average,
    reference: https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/wma
    on a given time-series data
    params:
    @src: series, time-series input data
    @periods: integer, n lookback period
    example:
    >>> arr = np.random.randint(10, 30, 20)
    >>> df = pd.DataFrame(arr, columns = ['close'])
    >>> technical_indicator.wma(df['close'])
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