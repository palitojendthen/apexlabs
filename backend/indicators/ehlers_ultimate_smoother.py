#!/usr/bin/env python3
import pandas as pd
import numpy as np
import math

def ehlers_ultimate_smoother(source_us: pd.Series, n_us=14):
    """
    technical analysis indicator:
    originated by John F. Ehlers, 
    an enhanced smoother, as an evolution of his previously developed SuperSmoother,
    reference: https://traders.com/Documentation/FEEDbk_docs/2024/04/TradersTips.html
    params:
    @source_us: series, input price series (e.g. df['close'])
    @n_us: integer, n lookback period (e.g. n_us=20)
    returns:
    pd.Series
        ultimate smoother aligned with source_pma index
    """
    
    if not isinstance(source_us, pd.Series):
        source_us = pd.Series(source_us)

    if len(source_us) < n_us:
        raise ValueError("Periods cant be greater than data length")
    
    _df = pd.DataFrame({
        'close':source_us,
        'a1':0.00,
        'c2':0.00,
        'c3':0.00,
        'c1':0.00,
        'ultimate_smoother': 0.00
    }, index = source_us.index)
    
    _pi = 2*np.arcsin(1)
    _df['a1'] = math.exp(-1.414*_pi/n_us)
    _df['c2'] = 2.0*_df['a1']*math.cos(1.414*_pi/n_us)
    _df['c3'] = -_df['a1']*_df['a1']
    _df['c1'] = (1.0+_df['c2']-_df['c3'])/4.0
    _df['ultimate_smoother'] = source_us
    
    for i in range(4, len(source_us)):
        _df.iloc[i, _df.columns.get_loc('ultimate_smoother')] = (
            (1.0 - _df.iloc[i]['c1']) * _df.iloc[i]['close']
            + (2.0 * _df.iloc[i]['c1'] - _df.iloc[i]['c2']) * _df.iloc[i - 1]['close']
            - (_df.iloc[i]['c1'] + _df.iloc[i]['c3']) * _df.iloc[i - 2]['close']
            + _df.iloc[i]['c2'] * _df.iloc[i - 1]['ultimate_smoother']
            + _df.iloc[i]['c3'] * _df.iloc[i - 2]['ultimate_smoother']
        )

    return pd.Series(_df['ultimate_smoother'])
