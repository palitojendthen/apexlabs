# import pandas as pd
# import numpy as np

# def ema(source_ema: pd.Series, n_ema=14) -> pd.Series:
#     """
#     technical analysis indicator:
#     compute and return simple moving average (sma) over a given price series,
#     referece: https://www.investopedia.com/terms/e/ema.asp
#     params:
#     @source_ema: series, time-series input data (e.g., df['close'])
#     @n_ema: integer, n lookback period (e.g. n_ema=14)
#     returns:
#     pd.Series
#         ema series aligned with the input index
#     """

#     if not isinstance(source_ema, pd.Series):
#         source_ema = pd.Series(source_ema)

#     n = len(source_ema)

#     if n < n_ema:
#         raise ValueError("Periods can't be greater than data length")

#     try:
#         alpha = 2/(n_ema+1)
#     except:
#         pass

#     if alpha is None:
#         alpha = 2/(14+1)

#     _sma = source_ema.rolling(window = n_ema).mean()
#     _ema = pd.DataFrame({'values':np.nan}, index = source_ema.index)

#     for i in range(n_ema, n):
#         _ema['values'][i] = alpha*source_ema[i]+(1-alpha)*_sma[i]

#     return pd.Series(_ema['values'])

# backend/indicators/ema.py


import pandas as pd
import numpy as np

def ema(source_ema: pd.Series, n_ema=14, alpha=None) -> pd.Series:
    """
    Exponential Moving Average (EMA)
    Reference: https://www.investopedia.com/terms/e/ema.asp

    Parameters
    ----------
    source_ema : pd.Series
        Input price series (e.g. df['close'])
    n_ema : int, optional
        Lookback period (default 14)
    alpha : float, optional
        Smoothing factor; if None, uses 2/(n_ema+1)

    Returns
    -------
    pd.Series
        EMA values aligned with source_ema index
    """
    if not isinstance(source_ema, pd.Series):
        source_ema = pd.Series(source_ema)

    source_ema = pd.to_numeric(source_ema, errors="coerce")

    if alpha is None:
        alpha = 2 / (n_ema + 1)

    ema_series = source_ema.ewm(alpha=alpha, adjust=False).mean()
    return ema_series


# # backend/indicators/ema.py
# import pandas as pd
# import numpy as np

# def ema(source_ema, n_ema=14):
#     """
#     Exponential Moving Average (EMA) seeded by SMA.

#     Parameters
#     ----------
#     source_ema : pd.Series or pd.DataFrame
#         Input series (e.g. df['close']) or full OHLC dataframe.
#     n_ema : int
#         Lookback window length.

#     Returns
#     -------
#     pd.Series
#         EMA values aligned with the input index.
#     """
#     # --- normalize input ---
#     if isinstance(source_ema, pd.DataFrame):
#         # try to infer which column to use
#         if "close" in source_ema.columns:
#             s = source_ema["close"].copy()
#         elif "ohlc4" in source_ema.columns:
#             s = source_ema["ohlc4"].copy()
#         else:
#             # fallback to first numeric column
#             s = source_ema.select_dtypes(include=[np.number]).iloc[:, 0]
#     else:
#         s = pd.Series(source_ema).astype(float)

#     n = len(s)
#     if n < n_ema or n_ema < 1:
#         # keep alignment: return NaN series same index
#         return pd.Series(np.nan, index=s.index, dtype=float)

#     alpha = 2 / (n_ema + 1)

#     # --- initialize arrays ---
#     out = np.full(n, np.nan, dtype=float)

#     # seed with SMA of first n_ema values
#     seed_idx = n_ema - 1
#     out[seed_idx] = s.iloc[:n_ema].mean()

#     # --- iterative update (your manual EMA) ---
#     prev = out[seed_idx]
#     for i in range(n_ema, n):
#         x = float(s.iloc[i])
#         prev = alpha * x + (1 - alpha) * prev
#         out[i] = prev

#     return pd.Series(out, index=s.index, name="ema")