#!/usr/bin/env python3
import pandas as pd
import numpy as np

def macd(source_macd: pd.Series, n_fast_macd=14, n_slow_macd=26, n_signal_macd=9, ma_type_macd="ema") -> pd.DataFrame:
    """
    technical analysis indicator:
    MACD identifies momentum changes by comparing two EMAs.
    A bullish crossover occurs when the MACD line crosses above the signal line, and vice versa.
    reference: https://www.investopedia.com/terms/m/macd.asp
    params:
    @source_macd: series, input price series (e.g. df['close'])
    @n_fast_macd: integer, short MA lookback period (default 12)
    @n_slow_macd: integer, long MA lookback period (default 26)
    @n_signal_macd: integer, MA lookback period for the MACD signal (default 9)
    @ma_type_macd: string, moving average type ('ema', 'sma', 'wma', etc)
    returns:
        ['macd_line', 'signal_line'] aligned with source index
    """

    if not isinstance(source_macd, pd.Series):
        source_macd = pd.Series(source_macd)

    max_periods = max(n_fast_macd, n_slow_macd, n_signal_macd)

    if len(source_macd) < max_periods:
        raise ValueError("Periods cant be greater than data length")

    ma_type = str(ma_type_macd).lower()

    def _ma(series, period):
        if ma_type == "sma":
            return series.rolling(window=period).mean()
        elif ma_type == "wma":
            weights = np.arange(1, period + 1)
            return series.rolling(period).apply(lambda x: np.dot(x, weights) / weights.sum(), raw=True)
        elif ma_type == "rma":
            # Wilder’s moving average
            return series.ewm(alpha=1/period, adjust=False).mean()
        else:
            # default to EMA
            return series.ewm(span=period, adjust=False).mean()

    fast_ma = _ma(source_macd, n_fast_macd)
    slow_ma = _ma(source_macd, n_slow_macd)

    macd_line = fast_ma - slow_ma
    signal_line = _ma(macd_line, n_signal_macd)
    histogram = macd_line - signal_line

    return pd.DataFrame({
        "macd_line": macd_line,
        "signal_line": signal_line
        # "histogram": histogram
    })