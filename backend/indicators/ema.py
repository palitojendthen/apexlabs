import pandas as pd
import numpy as np

def ema(source_ema: pd.Series, n_ema=14) -> pd.Series:
    """
    technical analysis indicator:
    compute and return simple moving average (sma) over a given price series,
    referece: https://www.investopedia.com/terms/e/ema.asp
    params:
    @source_ema: series, time-series input data (e.g., df['close'])
    @n_ema: integer, n lookback period (e.g. n_ema=14)
    returns:
    pd.Series
        ema series aligned with the input index
    """

    if not isinstance(source_ema, pd.Series):
        source_ema = pd.Series(source_ema)

    n = len(source_ema)

    if len(source_ema) < n_ema:
        raise ValueError("Periods can't be greater than data length")

    alpha = 2/(n_ema+1)

    if alpha is None:
        alpha = 2/(14+1)

    _sma = source_ema.rolling(window = n_ema).mean()
    _ema = pd.DataFrame({'values':np.nan}, index = src.index)

    for i in range(periods, n):
        _ema['values'][i] = alpha*src[i]+(1-alpha)*_sma[i]

    return pd.Series(_ema['values'])