# load library
import pandas as pd
import numpy as np
from binance.um_futures import UMFutures
from binance.error import ClientError
import simplejson as json
from datetime import datetime, timezone
import time
import os


# utility function
def get_key(_credential):
    with open(_credential, 'r') as f:
        token = json.loads(f.read())
        return token

def get_data(symbol, interval, start_time=None, end_time=None, limit=1000):
    """
    fetch historical OHLCV from Binance Futures,
    params:
    @symbol: string, followed trade pairs symbol available on binance
    @interval: string, time interval of the ohlc data e.g. '1w', '1d', '4h', etc
    @start_time: integer, converted date format to millisecond as its initial retrieve
    @end_time: integer, converted date format to millisecond end of fetch data
    @limit: integer, n lookback period
    """
    raw = um_futures_client.klines(
        symbol=symbol,
        interval=interval,
        limit=limit,
        startTime=start_time,
        endTime=end_time
    )
    
    if not raw:
        return pd.DataFrame()

    df = pd.DataFrame(raw, columns=[
        "open_time","open","high","low","close","volume",
        "close_time","qav","trades","tbbav","tbqav","ignore"
    ])
    
    df = df[["open_time","open","high","low","close","volume"]]
    df["open_time"] = pd.to_datetime(df["open_time"], unit="ms")
    df.set_index("open_time", inplace=True)
    df = df.astype(float)
    df["ohlc4"] = (df["open"]+df["high"]+df["low"]+df["close"])/4
    return df

def get_milliseconds(date_str):
    """
    return converted datetime to milliseconds format
    params:
    @date_str: string, datetime to be convert
    """
    return int(pd.to_datetime(date_str).timestamp() * 1000)

def fetch_historic_data(symbol, intervals, start_date="2018-01-01", save_dir="data"):
    """
    iteratively fetch OHLCV for full historic data (yearly rolling),
    per each trade pairs, per interva/time-frame
    auto-detects new listings (won't return pre-listing data)
    params:
    @symbol: string, followed trade pairs symbol available on binance
    @interval: string, time interval of the ohlc data e.g. '1w', '1d', '4h', etc
    @start_date: integer, converted date format to millisecond as its initial retrieve
    """
    
    os.makedirs(save_dir, exist_ok=True)
    all_data = {}

    for interval in intervals:
        print(f"Fetching {symbol} {interval} ...")
        start_ts = get_milliseconds(start_date)
        now_ts = int(datetime.now().timestamp() * 1000)
        interval_ms = ms_interval[interval]

        frames = []
        
        while start_ts < now_ts:
            try:
                klines = um_futures_client.klines(
                    symbol=symbol,
                    interval=interval,
                    startTime=start_ts,
                    limit=1000
                )
            except ClientError as e:
                print(f"Error fetching {symbol} {interval}: {e}")
                break

            if not klines:
                start_ts += interval_ms
                continue

            df = pd.DataFrame(klines, columns=[
                "open_time", "open", "high", "low", "close", "volume",
                "close_time", "quote_asset_volume", "number_of_trades",
                "taker_buy_base_volume", "taker_buy_quote_volume", "ignore"
            ])
            df["open_time"] = pd.to_datetime(df["open_time"], unit="ms")
            df["close_time"] = pd.to_datetime(df["close_time"], unit="ms")

            frames.append(df)

            last_open_time = klines[-1][0]
            start_ts = last_open_time + interval_ms

        if frames:
            full_df = pd.concat(frames, ignore_index=True)
            file_path = f"{save_dir}/{symbol}_{interval}.parquet"
            full_df.to_parquet(file_path, engine="fastparquet")
            all_data[interval] = full_df
            print(f"Saved {symbol} {interval}: {len(full_df)} rows")
        else:
            print(f"No data found for {symbol} {interval}")

    return all_data


# create connection
path = "./key.json"
cred = get_key(path)

api_key = cred.get('api_key')
secret_key = cred.get('secret_key')

um_futures_client = UMFutures(key = api_key, secret = secret_key)


# preferences
interval = ['1w', '1d', '12h', '6h', '4h', '2h', '1h']
lookback = 1000
ms_interval = {
    "1h": 60*60*1000,
    "2h": 2*60*60*1000,
    "4h": 4*60*60*1000,
    "6h": 6*60*60*1000,
    "12h": 12*60*60*1000,
    "1d": 24*60*60*1000,
    "1w": 7*24*60*60*1000,
}


# get ticker
path = "./binance_ticker.xlsx"
save_path = "./historical_data"

ticker = pd.read_excel(open(path, 'rb'), sheet_name='Sheet1', engine='openpyxl')


# fetch historical data
for symbol in ticker['trade_pairs']:
    print(f"Fetching {symbol} ...")
    data_dict = fetch_historic_data(
        symbol,
        intervals=interval,
        start_date="2018-01-01",
        save_dir=save_path
    )