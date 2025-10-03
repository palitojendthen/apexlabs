import pandas
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

# load .env
load_dotenv()
SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL")
engine = create_engine(SUPABASE_DB_URL)

# create table
create_table_sql = """
create table if not exists ohlcv (
    symbol text not null,
    interval text not null,
    open_time timestamp not null,
    open numeric,
    high numeric,
    low numeric,
    close numeric,
    volume numeric,
    primary ley (symbol, interval, open_time)
);
"""

# execute sql
with engine.connect() as conn:
    conn.execute(text(create_table_sql))
    conn.commit()

print("table 'ohlcv' ensured in Supabase/PostgreSQL")