# /backend/utils/cron_runner_1h.py
import time
from utils.ingestion_tools import append_latest

INTERVAL = "1h"
SYMBOLS = [
    "BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT",
    # ... add your full 100 list
]

LOG_FILE = f"/home/ubuntu/apexlabs/backend/cron_{INTERVAL}.log"

def log(msg):
    with open(LOG_FILE, "a") as f:
        f.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {msg}\n")

def main():
    log(f"--- Starting job for interval {INTERVAL} ---")
    for sym in SYMBOLS:
        try:
            result = append_latest(sym, INTERVAL)
            log(f"{sym}: {result['status']} | {result['message']}")
            time.sleep(0.3)  # slight cooldown for API stability
        except Exception as e:
            log(f"{sym}: ERROR - {e}")
    log(f"--- Job for {INTERVAL} completed ---\n")

if __name__ == "__main__":
    main()
