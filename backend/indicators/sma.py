import pandas as pd
import numpy as np

def sma(source_sma: pd.Series, n_sma: int = 14) -> pd.Series:
    """
    technical analysis indicator:
    compute and return simple moving average (sma) over a given price series
    referece: https://www.investopedia.com/terms/s/sma.asp
    params:
    @source_sma: series, time-series input data (e.g., df['close'])
    @n_sma: integer, n lookback period (e.g. n_sma=14)
    returns:
    pd.Series
        sma series aligned with the input index
    """
    if not isinstance(source_sma, pd.Series):
        source_sma = pd.Series(source_sma)

    if len(source_sma) < n_sma:
        raise ValueError("Periods can't be greater than data length")

    return source_sma.rolling(window=n_sma, min_periods=n_sma).mean()