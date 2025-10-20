import os
import pandas as pd
from dotenv import load_dotenv
from google.cloud import bigquery
from binance.um_futures import UMFutures

# Load envs
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env.local"))

PROJECT_ID = os.getenv("GCP_PROJECT_ID")
DATASET = os.getenv("BQ_DATASET")
TABLE = os.getenv("BQ_TABLE")
BINANCE_API_KEY = os.getenv("BINANCE_API_KEY")
BINANCE_API_SECRET = os.getenv("BINANCE_API_SECRET")

client = UMFutures(key=BINANCE_API_KEY, secret=BINANCE_API_SECRET)
bq = bigquery.Client(project=PROJECT_ID)

symbol = "BTCUSDT"
interval = "1d"

print(f"Testing append for {symbol} {interval}")

# Step 1 — get max open_time from BQ
sql = f"""
SELECT MAX(open_time) AS last_time
FROM `{PROJECT_ID}.{DATASET}.{TABLE}`
WHERE symbol='{symbol}' AND interval='{interval}'
"""
df_last = bq.query(sql).to_dataframe()
last_time = df_last.iloc[0]["last_time"]
print("Last timestamp in BQ:", last_time)

if pd.isna(last_time):
    print("⚠️ Table empty for this pair/interval — run full ingestion first.")
    exit()

start_ms = int(pd.Timestamp(last_time).timestamp() * 1000) + 24*60*60*1000  # +1 day
data = client.klines(symbol=symbol, interval=interval, startTime=start_ms, limit=1000)

if not data:
    print("No new candles yet. Binance up to date with your table.")
    exit()

cols = [
    "open_time","open","high","low","close","volume",
    "close_time","qav","num_trades","tbbav","tbqav","ignore"
]
df_new = pd.DataFrame(data, columns=cols)
df_new["symbol"] = symbol
df_new["interval"] = interval
df_new["open_time"] = pd.to_datetime(df_new["open_time"], unit="ms")

print(f"Fetched {len(df_new)} new bars from Binance")

# Step 2 — append to BQ using MERGE (idempotent)
temp_table = f"{PROJECT_ID}.{DATASET}._staging_test"

bq.load_table_from_dataframe(
    df_new,
    temp_table,
    job_config=bigquery.LoadJobConfig(write_disposition="WRITE_TRUNCATE")
).result()

merge_sql = f"""
MERGE `{PROJECT_ID}.{DATASET}.{TABLE}` T
USING `{temp_table}` S
ON  T.symbol = S.symbol
AND T.interval = S.interval
AND T.open_time = S.open_time
WHEN NOT MATCHED THEN
  INSERT (symbol, interval, open_time, open, high, low, close, volume,
          close_time, num_trades, qav, tbbav, tbqav)
  VALUES (S.symbol, S.interval, S.open_time, S.open, S.high, S.low, S.close,
          S.volume, S.close_time, S.num_trades, S.qav, S.tbbav, S.tbqav)
"""
bq.query(merge_sql).result()

# Step 3 — check counts before/after
check_sql = f"""
SELECT
  '{symbol}' AS symbol,
  '{interval}' AS interval,
  COUNT(*) AS f1_,
  COUNT(DISTINCT open_time) AS f0_
FROM `{PROJECT_ID}.{DATASET}.{TABLE}`
WHERE symbol='{symbol}' AND interval='{interval}'
"""
result = bq.query(check_sql).to_dataframe()
print(result.to_json(orient="records", indent=2))
