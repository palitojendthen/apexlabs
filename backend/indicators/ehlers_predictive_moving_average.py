#!/usr/bin/env python3
import pandas as pd
import numpy as np
import math


def ehlers_predictive_moving_average(source_pma: pd.Series) -> pd.Series:
    """
    technical analysis indicator:
    originated by John F. Ehlers,
    by taking difference of 2 lagging line of 7-bars Weighted Moving Average,
    given signal when predict crossing it's trigger
    reference: John F. Ehlers, Rocket Science for Traders pg. 212
    params:
    @source_pma: series, input price series (e.g. df['close'])
    returns:
    pd.Series
        [series] predictive moving average aligned with source_pma index
    """

    if not isinstance(source_pma, pd.Series):
        source_pma = pd.Series(source_pma)

    if len(source_pma) < 10:
        raise ValueError("Data length can't be lower than 10")

    _df = pd.DataFrame({
        'wma1': 0.00,
        'wma2':0.00,
        'predict':0.00,
        'trigger':0.00,
        'pma':0.00
    }, index = source_pma.index)
    
    for i in range(10, len(source_pma)):
        _df.iloc[i,0] = (7*source_pma[i]+6*source_pma[i-1]+5*source_pma[i-2]+4*source_pma[i-3]+3*source_pma[i-4]+2*source_pma[i-5]+source_pma[i-6])/28
        _df.iloc[i,1] = (7*_df.iloc[i,0]+6*_df.iloc[i-1,0]+5*_df.iloc[i-2,0]+4*_df.iloc[i-3,0]+3*_df.iloc[i-4,0]+2*_df.iloc[i-5,0]+_df.iloc[i-6,0])/28
        _df.iloc[i,2] = (2*_df.iloc[i,0])-_df.iloc[i,1]
        _df.iloc[i,3] = (4*_df.iloc[i,2]+3*_df.iloc[i-1,2]+2*_df.iloc[i-2,2]+_df.iloc[i,2])/10
        _df.iloc[i,4] = _df.iloc[i,2] if _df.iloc[i,2] > _df.iloc[i,3] else _df.iloc[i,3]
    
    _df['pma'] = _df['pma'].replace(0.00,np.nan).fillna(method='bfill').fillna(source_pma)
    return pd.Series(_df['pma'])