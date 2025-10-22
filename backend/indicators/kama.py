#!/usr/bin/env python3
import pandas as pd
import numpy as np
import math


def kama(source_kama: pd.Series, n_fast_kama=2, n_slow_kama=30, n_kama=14) -> pd.Series:
    """
    technical analysis indicator:
    originated by Perry J. Kaufman,
    an adaptive trend following indicator, that one changes with market conditions,
    KAMA dynamically adjusts its sensitivity to price movements based on market noise and trend strength
    It reacts quickly during strong trends and slows down during sideways or choppy markets.
    reference: https://corporatefinanceinstitute.com/resources/capital-markets/kaufmans-adaptive-moving-average-kama/
    params:
    @source_kama: series, input price series (e.g. df['close'])
    @n_fast_kama: integer, short-term smoothing constant (default 2)
    @n_slow_kama: integer, long-term smoothing constant (default 30)
    @n_kama: integer, efficiency ratio lookback period (defaul 10)
    returns:
    pd.Series
        kama values aligned with source_kama index
    """

    if not isinstance(source_kama, pd.Series):
        source_kama = pd.Series(source_kama)

    if (len(source_kama) < n_slow_kama) or (n_kama > n_slow_kama):
        raise ValueError("Periods can't be greater than data length")

    _fastest = 2/(n_fast_kama+1)
    _slowest = 2/(n_slow_kama+1)

    _df = pd.DataFrame({
        'num': 0.00,
        'delta': 0.00,
        'denom': 0.00,
        'er': 0.00,
        'sc':0.00,
        'kama':0.00
    }, index = source_kama.index)

    for i in range(n_kama, len(source_kama)):
        _df.iloc[i, 0] = abs(source_kama[i]-source_kama[i-n_kama])
        _df.iloc[i, 1] = abs(source_kama[i]-source_kama[i-1])
        _df.iloc[n_kama-1:, 2] = np.convolve(_df['delta'], np.ones(n_kama), 'valid')
        _df.iloc[i, 3] = _df.iloc[i, 0]/_df.iloc[i, 2]
        _df.iloc[i, 4] = math.pow(_df.iloc[i, 3]*(_fastest-_slowest)+_slowest, 2)
        _df.iloc[i, 5] = _df.iloc[i-1,5]+_df.iloc[i,4]*(source_kama[i]-_df.iloc[i-1,5])

    return pd.Series(_df['kama'])