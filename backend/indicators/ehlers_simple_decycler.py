#!/usr/bin/env python3
import pandas as pd
import numpy as np
import math

def ehlers_simple_decycler(source_simple_decycler: pd.Series, hp_simple_decycler=48) -> pd.Series:
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


# #!/usr/bin/env python3
# import pandas as pd
# import numpy as np

# def ehlers_simple_decycler(source_simple_decycler: pd.Series, hp_simple_decycler=48) -> pd.Series:
#     """
#     John F. Ehlers' Simple Decycler
#     Removes high-frequency components from price to highlight trend.
#     """

#     if not isinstance(source_simple_decycler, pd.Series):
#         source_simple_decycler = pd.Series(source_simple_decycler)

#     if len(source_simple_decycler) < hp_simple_decycler:
#         raise ValueError("Periods can't be greater than data length")

#     _df = pd.DataFrame(index=source_simple_decycler.index)
#     _df["hp"] = 0.0
#     _df["decycler"] = 0.0

#     _pi = np.pi
#     _alpha1 = (
#         np.cos(0.707 * 2 * _pi / hp_simple_decycler)
#         + np.sin(0.707 * 2 * _pi / hp_simple_decycler)
#         - 1
#     ) / np.cos(0.707 * 2 * _pi / hp_simple_decycler)

#     src = source_simple_decycler.values

#     for i in range(hp_simple_decycler, len(src)):
#         _df.iloc[i, 0] = (
#             (1 - _alpha1 / 2) ** 2
#             * (src[i] - 2 * src[i - 1] + src[i - 2])
#             + 2 * (1 - _alpha1) * _df.iloc[i - 1, 0]
#             - (1 - _alpha1) ** 2 * _df.iloc[i - 2, 0]
#         )
#         _df.iloc[i, 1] = src[i] - _df.iloc[i, 0]

#     # --- cleanup for JSON safety ---
#     _df["decycler"].replace([np.inf, -np.inf], np.nan, inplace=True)
#     # _df["decycler"] = np.clip(_df["decycler"], -1e6, 1e6)
#     _df['decycler'] = pd.to_numeric(_df['decycler'], errors="coerce").clip(-1e6, 1e6)
#     # _df.loc[:hp_simple_decycler, "decycler"] = np.nan
#     _df.iloc[:hp_simple_decycler, 1] = .00

#     return pd.Series(_df["decycler"])


# #!/usr/bin/env python3
# import pandas as pd
# import numpy as np

# def ehlers_simple_decycler(source_simple_decycler: pd.Series, hp_simple_decycler=48, return_df=False):
#     """
#     John F. Ehlers – Simple Decycler
#     Removes the high-frequency component (noise) from price data while preserving trend.
#     """

#     if not isinstance(source_simple_decycler, pd.Series):
#         source_simple_decycler = pd.Series(source_simple_decycler)

#     if len(source_simple_decycler) < hp_simple_decycler:
#         raise ValueError("Periods can't be greater than data length")

#     _pi = np.pi
#     _alpha1 = (
#         (np.cos(0.707 * 2 * _pi / hp_simple_decycler)
#          + np.sin(0.707 * 2 * _pi / hp_simple_decycler) - 1)
#         / np.cos(0.707 * 2 * _pi / hp_simple_decycler)
#     )

#     _df = pd.DataFrame(index=source_simple_decycler.index)
#     _df["hp"] = 0.0
#     _df["decycler"] = 0.0

#     # seed first two values with source price to stabilize recursion
#     _df.iloc[0:2, _df.columns.get_loc("decycler")] = source_simple_decycler.iloc[0:2]

#     for i in range(2, len(source_simple_decycler)):
#         _df.iloc[i, 0] = (
#             (1 - _alpha1 / 2) ** 2 *
#             (source_simple_decycler.iloc[i]
#              - 2 * source_simple_decycler.iloc[i - 1]
#              + source_simple_decycler.iloc[i - 2])
#             + 2 * (1 - _alpha1) * _df.iloc[i - 1, 0]
#             - (1 - _alpha1) ** 2 * _df.iloc[i - 2, 0]
#         )
#         _df.iloc[i, 1] = source_simple_decycler.iloc[i] - _df.iloc[i, 0]

#     # trim unstable early values
#     _df.iloc[:hp_simple_decycler, _df.columns.get_loc("decycler")] = np.nan

#     # # sanitize output for JSON
#     # _df["decycler"].replace([np.inf, -np.inf], np.nan, inplace=True)
#     # _df["decycler"] = pd.to_numeric(_df["decycler"], errors="coerce").clip(-1e6, 1e6)
#     # _df.fillna(0.0, inplace=True)

#     # trim unstable early section and normalize scale
#     start = max(hp_simple_decycler, int(hp_simple_decycler * 2))
#     decycler = _df["decycler"].copy()
#     decycler.iloc[:start] = np.nan
#     decycler.replace([np.inf, -np.inf], np.nan, inplace=True)
#     decycler = decycler.fillna(method="bfill")  # or .ffill()

#     return decycler

#     return _df if return_df else _df["decycler"]