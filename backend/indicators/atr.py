def atr(src, periods = 10):
    """
    technical analysis indicator:
    return average true range
    on a given time-series data
    reference: https://www.investopedia.com/terms/a/atr.asp
    params:
    @src: series, time-series input data
    @periods: integer, n loockback period
    @return_df: boolean, whether to return include input dataframe or result only
    example:
    >>> technical_indicator.atr(df, return_df = True)
    """
    src = src.dropna()
    n = len(src)
    
    if n < periods:
        raise ValueError('Periods cant be greater than data length')

    src['hl'] = src['high']-src['low']
    src['hc1'] = src['high']-src['close'].shift(1)
    src['lc1'] = src['low']-src['close'].shift(1)
    src['tr'] = .00

    for i in range(0, len(src)):
        src['tr'][i] = np.max([src['hl'][i], src['hc1'][i], src['lc1'][i]], axis=0)
    
    src['atr'] = src['tr'].rolling(window=periods).mean()
    
    return src[['tr', 'atr']]