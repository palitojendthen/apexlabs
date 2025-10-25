#!/usr/bin/env python3
import pandas as pd
import numpy as np

def rsi(source_rsi: pd.Series, n_rsi=14) -> pd.Series:
    """
    technical analysis indicator:
    return relative strength index over a given timeseries data,
    to identify overbought or oversold are within a specific timeperiod
    reference: https://www.investopedia.com/terms/r/rsi.asp
    params:
    @source_rsi: series, input price series (e.g. df['close'])
    @n_rsi: integer, lookback period (default 14)
    returns:
        rsi values aligned with source index
    """

    if not isinstance(source_rsi, pd.Series):
        source_rsi = pd.Series(source_rsi)

    if len(source_rsi) < n_rsi:
        raise ValueError("Periods cant be greater than data length")

    _df = pd.DataFrame({
        'diff': 0.00,
        'gain':0.00,
        'loss':0.00,
        'avg_gain':0.00,
        'avg_loss':0.00,
        'rs':0.00,
        'rsi':0.00
    }, index = source_rsi.index)

    _df['diff'] = source_rsi.diff()
    _df['gain'] = np.where(_df['diff'] > 0, _df['diff'], 0)
    _df['loss'] = np.where(_df['diff'] < 0, _df['diff'], 0)
    _df['avg_gain'] = _df['gain'].ewm(com = n_rsi-1, adjust = False).mean()
    _df['avg_loss'] = _df['loss'].ewm(com = n_rsi-1, adjust = False).mean().abs()
    _df['rs'] = _df['avg_gain']/_df['avg_loss']
    _df['rsi'] = (100-(100/(1+_df['rs'])))

    return pd.Series(_df['rsi'])