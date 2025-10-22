#!/usr/bin/env python3
import pandas as pd
import numpy as np
import math

def simple_decycler(source_simple_decycler: pd.Series, hp_simple_decycler=48) -> pd.Series:
    """
    technical analysis indicator:
    originated by John F. Ehlers, with aim to identified trend,
    of a given time-series data, by subtracting high-frequency component, 
    while retain the low-frequency components of price data,
    trends are kept intact with little to no lag
    reference: https://tlc.thinkorswim.com/center/reference/Tech-Indicators/studies-library/E-F/EhlersSimpleDecycler
    params:
    @source_simple_decycler: series, input price series (e.g. df['close'])
    @hp_simple_decycler: integer, look-back period for high-pass filter (default 48)
    returns:
    pd.Series
        simple decycler values aligned with source_simple_decycler index
    """

    if not isinstance(source_simple_decycler, pd.Series):
        source_simple_decycler = pd.Series(source_simple_decycler)

    if (len(source_simple_decycler) < hp_simple_decycler):
        raise ValueError("Periods can't be greater than data length")

    _df = pd.DataFrame({
        'hp':0.00,
        'decycler':0.00
    }, index = source_simple_decycler.index)
    
    _pi = 2*np.arcsin(1)
    _alpha1 = (np.cos(.707*2*_pi/hp_simple_decycler)+np.sin(.707*2*_pi/hp_simple_decycler)-1)/np.cos(.707*2*_pi/hp_simple_decycler)

    for i in range(hp_simple_decycler, len(source_simple_decycler)):
        _df.iloc[i, 0] = (1-_alpha1/2)*(1-_alpha1/2)*(source_simple_decycler[i]-2*source_simple_decycler[i-1]+source_simple_decycler[i-2])+2*(1-_alpha1)*_df.iloc[i-1, 0]-(1-_alpha1)*(1-_alpha1)*_df.iloc[i-2, 0]
        _df.iloc[i, 1] = source_simple_decycler[i]-_df.iloc[i, 0]

    return pd.Series(_df['decycler'])