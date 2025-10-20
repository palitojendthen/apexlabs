#!/usr/bin/env python3
import os
import pandas as pd
from dotenv import load_dotenv
from google.cloud import bigquery
from binance.um_futures import UMFutures


# load env variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

PROJECT_ID = os.getenv("PROJECT_ID")
DATASET_ID = os.getenv("DATASET_ID")
TABLE_ID = os.getenv("TABLE_ID")
BINANCE_API_KEY = os.getenv("BINANCE_API_KEY")
BINANCE_API_SECRET = os.getenv("BINANCE_API_SECRET")


# initialize clients
client = UMFutures(key=BINANCE_API_KEY, secret=BINANCE_API_SECRET)
bq = bigquery.Client(project=PROJECT_ID)


# test parameters
symbol = "BTCUSDT"
interval = "1d"
print(f"Testing append for {symbol} {interval}")


# fetch last timestamp from bigquery
sql = f"""
SELECT MAX(ah.open_time) AS last_time
FROM `{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}` AS ah
WHERE ah.symbol = '{symbol}' AND ah.`interval` = '{interval}'
"""
df_last = bq.query(sql).to_dataframe()
last_time = df_last.iloc[0]["last_time"]

if pd.isna(last_time):
    print("Table empty for this pair/interval — run full ingestion first.")
    raise SystemExit()

print("Last timestamp in BigQuery:", last_time)


# fetch new data from binance
start_ms = int(pd.Timestamp(last_time).timestamp() * 1000)
data = client.klines(symbol=symbol, interval=interval, startTime=start_ms, limit=1000)

if not data:
    print("No new candles — BigQuery already up to date.")
    raise SystemExit()

cols = [
    "open_time", "open", "high", "low", "close", "volume",
    "close_time", "qav", "num_trades", "tbbav", "tbqav", "ignore"
]
df_new = pd.DataFrame(data, columns=cols)
df_new["symbol"] = symbol
df_new["interval"] = interval
df_new["open_time"] = pd.to_datetime(df_new["open_time"], unit="ms", utc=True)


# explicitly convert numeric columns to float
numeric_cols = ["open", "high", "low", "close", "volume"]
for col in numeric_cols:
    df_new[col] = pd.to_numeric(df_new[col], errors="coerce")


# keep only columns in data schema
df_new = df_new[["symbol", "interval", "open_time", "open", "high", "low", "close", "volume"]]
print(f"Fetched {len(df_new)} new rows from Binance")


# load to bigquery with schema enforcement
staging_table = f"{PROJECT_ID}.{DATASET_ID}._staging_append_test"

schema = [
    bigquery.SchemaField("symbol", "STRING"),
    bigquery.SchemaField("interval", "STRING"),
    bigquery.SchemaField("open_time", "TIMESTAMP"),
    bigquery.SchemaField("open", "FLOAT"),
    bigquery.SchemaField("high", "FLOAT"),
    bigquery.SchemaField("low", "FLOAT"),
    bigquery.SchemaField("close", "FLOAT"),
    bigquery.SchemaField("volume", "FLOAT"),
]

job_config = bigquery.LoadJobConfig(
    write_disposition="WRITE_TRUNCATE",
    schema=schema
)

# upload to staging
bq.load_table_from_dataframe(df_new, staging_table, job_config=job_config).result()


# merge to main table - idempotent
merge_sql = f"""
MERGE `{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}` AS T
USING `{staging_table}` AS S
ON  T.symbol = S.symbol
AND T.`interval` = S.`interval`
AND T.open_time = S.open_time
WHEN NOT MATCHED THEN
  INSERT (symbol, `interval`, open_time, open, high, low, close, volume)
  VALUES (S.symbol, S.`interval`, S.open_time, S.open, S.high, S.low, S.close, S.volume)
"""
bq.query(merge_sql).result()
print("Merge completed successfully")


# validate counts - ensure no duplicates
check_sql = f"""
SELECT
  '{symbol}' AS symbol,
  '{interval}' AS `interval`,
  COUNT(*) AS total_rows,
  COUNT(DISTINCT ah.open_time) AS unique_rows
FROM `{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}` AS ah
WHERE ah.symbol = '{symbol}' AND ah.`interval` = '{interval}'
"""
result = bq.query(check_sql).to_dataframe()
print(result.to_json(orient="records", indent=2))

print("Append test finished.")

