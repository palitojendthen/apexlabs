#!/usr/bin/env python3
import pandas as pd
import numpy as np
import importlib.util
from pathlib import Path

# def atr(source_atr: pd.DataFrame, n_atr=10) -> pd.Series:
#     """
#     technical analysis indicator:
#     return average true range, over a given dataframe
#     reference: https://www.investopedia.com/terms/a/atr.asp
#     params:
#     @source_atr: DataFrame, ohlc input data
#     @n_atr: integer, loockback period (default 10)
#     returns:
#         [true range, average true] aligned with source index
#     """
#     _src = source_atr.copy()
#     n = len(_src)
    
#     if n < n_atr:
#         raise ValueError('Periods cant be greater than data length')

#     _src['hl'] = _src['high']-_src['low']
#     _src['hc1'] = _src['high']-_src['close'].shift(1)
#     _src['lc1'] = _src['low']-_src['close'].shift(1)
#     _src['tr'] = .00

#     for i in range(0, n):
#         _src.iloc[i, _src.columns.get_loc('tr')] = np.max([_src.iloc[i, _src.columns.get_loc('hl')], _src.iloc[i, _src.columns.get_loc('hc1')], _src.iloc[i, _src.columns.get_loc('lc1')]], axis=0)
    
#     _src['atr'] = _src['tr'].rolling(window=n_atr).mean()
    
#     return _src[['tr', 'atr']]


def load_atr_module():
    module_path = Path(__file__).resolve().parents[0]/"atr.py"
    spec = importlib.util.spec_from_file_location("atr", module_path)
    atr_mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(atr_mod)
    return atr_mod.atr

def adx(source_adx: pd.DataFrame, n_adx=14, threshold_adx=20):
    """
    technical analysis indicator:
    return average directional index, over a given dataframe
    reference: https://www.investopedia.com/articles/trading/07/adx-trend-indicator.asp
    params:
    @source_adx: DataFrame, ohlc input data
    @n_adx: integer, loockback period (default 14)
    @threshold_adx: integer, strong trend direction threshold
    returns:
        adx series
    """
    _src = source_adx.copy()
    n = len(_src)
    
    if n < n_adx:
        raise ValueError('Periods cant be greater than data length')
    
    def rma(_series, _periods=n_adx):
        """
        technical analysis indicator:
        return moving average in RSI,
        an exponentially weighted moving average with alpha = 1/length
        """
        _alpha = 1/_periods
        _result = []

        for i in range(len(_series)):
            if i < _periods:
                _result.append(np.nan)
            elif i == _periods:
                _seed = _series.iloc[:_periods].mean()
                _result.append(_seed)
            else:
                _prev = _result[-1]
                _value = _alpha*_series.iloc[i]+(1-_alpha)*_prev
                _result.append(_value)

        return pd.Series(_result, index=_series.index)

    _src['dx_up'] = _src['high']-_src['high'].shift(1)
    _src['dx_down'] = -(_src['low']-_src['low'].shift(1))
    _src['plus_dm'] = np.where(((_src['dx_up'] > _src['dx_down']) & (_src['dx_up'] > 0)), _src['dx_up'], 0)
    _src['minus_dm'] = np.where(((_src['dx_down'] > _src['dx_up']) & (_src['dx_down'] > 0)), _src['dx_down'], 0)
    atr_func = load_atr_module()
    _src['tr'] = atr_func(_src, n_atr=n_adx)['tr']
    _src['truerange'] = rma(_src['tr'], _periods=n_adx)
    _src['plus'] = (100*rma(_src['plus_dm'],_periods=n_adx)/_src['truerange']).fillna(0)
    _src['minus'] = (100*rma(_src['minus_dm'],_periods=n_adx)/_src['truerange']).fillna(0)
    _src['adx'] = 100*rma(abs(_src['plus']-_src['minus'])/np.where((_src['plus']+_src['minus'])==0, 1, _src['plus']+_src['minus']), _periods=n_adx)

    return pd.Series(_src['adx'])