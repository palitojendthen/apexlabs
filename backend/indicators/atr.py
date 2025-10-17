#!/usr/bin/env python3
import pandas as pd
import numpy as np

def atr(source_atr: pd.DataFrame, n_atr=10) -> pd.Series:
    """
    technical analysis indicator:
    return average true range, over a given dataframe
    reference: https://www.investopedia.com/terms/a/atr.asp
    params:
    @source_atr: DataFrame, ohlc input data
    @n_atr: integer, loockback period (default 10)
    returns:
        [true range, average true] aligned with source index
    """
    _src = source_atr.copy()
    n = len(_src)
    
    if n < n_atr:
        raise ValueError('Periods cant be greater than data length')

    _src['hl'] = _src['high']-_src['low']
    _src['hc1'] = _src['high']-_src['close'].shift(1)
    _src['lc1'] = _src['low']-_src['close'].shift(1)
    _src['tr'] = .00

    for i in range(0, n):
        _src.iloc[i, _src.columns.get_loc('tr')] = np.max([_src.iloc[i, _src.columns.get_loc('hl')], _src.iloc[i, _src.columns.get_loc('hc1')], _src.iloc[i, _src.columns.get_loc('lc1')]], axis=0)
    
    _src['atr'] = _src['tr'].rolling(window=n_atr).mean()
    
    return _src[['tr', 'atr']]