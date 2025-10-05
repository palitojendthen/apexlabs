import pandas as pd
from google.cloud import bigquery
from dotenv import load_dotenv
import os

load_dotenv()

project_id = os.getenv("PROJECT_ID")
dataset_id = os.getenv("DATASET_ID")
table_id = os.getenv("TABLE_ID")
table_ref = f"{project_id}.{dataset_id}.{table_id}"

client = bigquery.Client(project=project_id)

df_path = os.getenv("DF_PATH")
df = pd.read_parquet(df_path, engine="fastparquet")

numeric_cols = ["open", "high", "low", "close", "volume"]
for col in numeric_cols:
    df[col] = pd.to_numeric(df[col], errors="coerce")

df["open_time"] = pd.to_datetime(df["open_time"], errors="coerce")

job_config = bigquery.LoadJobConfig(
    write_disposition="WRITE_APPEND"
)

job = client.load_table_from_dataframe(df, table_ref, job_config=job_config)
job.result()

print(f"sucesffully ingest {df.shape[0]} rows into {table_ref}")