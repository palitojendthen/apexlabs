#!/usr/bin/env python3
import pandas as pd
import numpy as np

def donchian_channel(source_dc: pd.DataFrame, n_dc=10):
    """
    technical analysis indicator:
    return donchian channel (upper, lower, and middle bands)
    on a given time-series data
    reference: https://www.investopedia.com/terms/d/donchianchannels.asp
    params:
    @source_dc: DataFrame, ohlc input data
    @n_dc: integer, loockback period (default 20)
    returns:
        [lower, basis, upper] aligned with source index
    """
    _src = source_dc.copy()
    n = len(_src)
    
    if n < n_dc:
        raise ValueError('Periods cant be greater than data length')

    _src['lower'] = _src['low'].rolling(window=n_dc).min()
    _src['upper'] = _src['high'].rolling(window=n_dc).max()
    _src['basis'] = (_src['lower']+_src['upper'])/2

    return _src[['lower', 'basis', 'upper']]