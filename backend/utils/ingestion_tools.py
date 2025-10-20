#!/usr/bin/env python3
import os
import pandas as pd
import traceback
from dotenv import load_dotenv
from google.cloud import bigquery
from binance.um_futures import UMFutures


# load env and initialize clients
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))

PROJECT_ID = os.getenv("PROJECT_ID")
DATASET_ID = os.getenv("DATASET_ID")
TABLE_ID = os.getenv("TABLE_ID")
BQ_LOCATION = os.getenv("BQ_LOCATION", "asia-southeast2")

BINANCE_API_KEY = os.getenv("BINANCE_API_KEY")
BINANCE_API_SECRET = os.getenv("BINANCE_API_SECRET")

# bigquery + binance clients
bq = bigquery.Client(project=PROJECT_ID, location=BQ_LOCATION)
client = UMFutures(key=BINANCE_API_KEY, secret=BINANCE_API_SECRET)


# core ingestion function
def append_latest(symbol: str, interval: str, limit: int = 1000) -> dict:
    """
    Fetches latest kline data from Binance and appends to BigQuery
    without duplication (MERGE by symbol + interval + open_time).

    Returns dict summary for logging.
    """

    summary = {
        "symbol": symbol,
        "interval": interval,
        "status": "failed",
        "fetched": 0,
        "inserted": 0,
        "message": "",
    }

    try:
        # get last timestamp from bigguery
        sql = f"""
        SELECT MAX(open_time) AS last_time
        FROM `{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}`
        WHERE symbol = '{symbol}' AND `interval` = '{interval}'
        """
        df_last = bq.query(sql).to_dataframe()
        last_time = df_last.iloc[0]["last_time"]

        if pd.isna(last_time):
            summary["message"] = "No existing data in BQ. Run full ingestion first."
            return summary

        # fetch new data from binance
        start_ms = int(pd.Timestamp(last_time).timestamp() * 1000) + 1
        data = client.klines(symbol=symbol, interval=interval, startTime=start_ms, limit=limit)

        if not data:
            summary["status"] = "ok"
            summary["message"] = "No new candles available."
            return summary

        cols = [
            "open_time", "open", "high", "low", "close", "volume",
            "close_time", "qav", "num_trades", "tbbav", "tbqav", "ignore"
        ]
        df_new = pd.DataFrame(data, columns=cols)

        # keep only relevant numeric columns
        numeric_cols = ["open", "high", "low", "close", "volume"]
        for col in numeric_cols:
            df_new[col] = pd.to_numeric(df_new[col], errors="coerce")

        df_new["open_time"] = pd.to_datetime(df_new["open_time"], unit="ms")
        df_new["symbol"] = symbol
        df_new["interval"] = interval
        df_new = df_new[["symbol", "interval", "open_time", "open", "high", "low", "close", "volume"]]

        df_new = df_new.drop_duplicates(
            subset=["symbol", "interval", "open_time"], keep="first"
        )


        summary["fetched"] = len(df_new)

        # load into temp table
        staging_table = f"{PROJECT_ID}.{DATASET_ID}._staging_{symbol.lower()}_{interval}"
        job_config = bigquery.LoadJobConfig(write_disposition="WRITE_TRUNCATE")
        bq.load_table_from_dataframe(df_new, staging_table, job_config=job_config).result()

        # merge into main table (idempotent insert)
        merge_sql = f"""
        MERGE `{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}` T
        USING `{staging_table}` S
        ON  T.symbol = S.symbol
        AND T.`interval` = S.`interval`
        AND T.open_time = S.open_time
        WHEN NOT MATCHED THEN
          INSERT (symbol, `interval`, open_time, open, high, low, close, volume)
          VALUES (S.symbol, S.`interval`, S.open_time, S.open, S.high, S.low, S.close, S.volume)
        """
        bq.query(merge_sql).result()

        summary["inserted"] = len(df_new)
        summary["status"] = "ok"
        summary["message"] = f"Inserted {len(df_new)} rows."

    except Exception as e:
        summary["status"] = "error"
        summary["message"] = str(e)
        traceback.print_exc()

    return summary


# quick test entry
if __name__ == "__main__":
    test_result = append_latest("BTCUSDT", "1d")
    print(test_result)
