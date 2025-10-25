def ultimate_smoother(src, _length = 20, return_df = False):
    """
    technical analysis indicator:
    originated by John F. Ehlers, 
    an enhanced smoother, as an evolution of his previously developed SuperSmoother,
    reference: https://traders.com/Documentation/FEEDbk_docs/2024/04/TradersTips.html
    params:
    @src: series, time-series input data
    @_length: integer, length of lookback period
    @return_df: boolean, whether to return include input dataframe or result only
    example:
    >>> technical_indicator.ultimate_smoother(src=df['ohlc4'], _length=14, return_df=True)
    """
    src = src.dropna()
    n = len(src)
    
    if n < _length:
        raise ValueError('Periods cant be greater than data length')
    
    _df = pd.DataFrame({
        'close':src,
        'a1':0.00,
        'c2':0.00,
        'c3':0.00,
        'c1':0.00,
        'ultimate_smooth': 0.00
    }, index = src.index)
    
    _pi = 2*np.arcsin(1)
    _df['a1'] = math.exp(-1.414*_pi/_length)
    _df['c2'] = 2.0*_df['a1']*math.cos(1.414*_pi/_length)
    _df['c3'] = -_df['a1']*_df['a1']
    _df['c1'] = (1.0+_df['c2']-_df['c3'])/4.0
    _df['ultimate_smooth'] = _df['close']
    
    for i in range(4, n):
        _df['ultimate_smooth'][i] = (1.0-_df['c1'][i])*_df['close'][i]+(2.0*_df['c1'][i]-_df['c2'][i])*_df['close'][i-1]-(_df['c1'][i]+_df['c3'][i])*_df['close'][i-2]+_df['c2'][i]*_df['ultimate_smooth'][i-1]+_df['c3'][i]*_df['ultimate_smooth'][i-2]

    if return_df:
        return _df.iloc[_length:, :]
    else:
        return _df['ultimate_smooth'][_length:]