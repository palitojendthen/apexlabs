#!/usr/bin/env python3
import time
from utils.ingestion_tools import append_latest

INTERVAL = "4h"
SYMBOLS = [
"BTCUSDT",
"ETHUSDT",
"XRPUSDT",
"BNBUSDT",
"SOLUSDT",
"DOGEUSDT",
"TRXUSDT",
"ADAUSDT",
"LINKUSDT",
"HYPEUSDT",
"SUIUSDT",
"XLMUSDT",
"AVAXUSDT",
"HBARUSDT",
"LTCUSDT",
"1000SHIBUSDT",
"TONUSDT",
"DOTUSDT",
"XMRUSDT",
"UNIUSDT",
"AAVEUSDT",
"ENAUSDT",
"1000PEPEUSDT",
"NEARUSDT",
"APTUSDT",
"ONDOUSDT",
"TAOUSDT",
"WLDUSDT",
"POLUSDT",
"ICPUSDT",
"ZECUSDT",
"ARBUSDT",
"VETUSDT",
"ATOMUSDT",
"ALGOUSDT",
"RENDERUSDT",
"FILUSDT",
"QNTUSDT",
"SEIUSDT",
"BCHUSDT",
"ETCUSDT",
"PAXGUSDT",
"PENGUUSDT",
"1000BONKUSDT",
"JUPUSDT",
"CAKEUSDT",
"IMXUSDT",
"INJUSDT",
"LDOUSDT",
"MUSDT",
"STXUSDT",
"CRVUSDT",
"OPUSDT",
"FETUSDT",
"GRTUSDT",
"SUSDT",
"PYTHUSDT",
"1000FLOKIUSDT",
"XTZUSDT",
"KAIAUSDT",
"IOTAUSDT",
"CFXUSDT",
"TWTUSDT",
"THETAUSDT",
"PENDLEUSDT",
"DASHUSDT",
"WIFUSDT",
"GALAUSDT",
"VIRTUALUSDT",
"SANDUSDT",
"JASMYUSDT",
"SNXUSDT",
"RAYUSDT",
"STRKUSDT",
"SUNUSDT",
"MANAUSDT",
"FLOWUSDT",
"JTOUSDT",
"OGUSDT",
"RSRUSDT",
"DEXEUSDT",
"WUSDT",
"APEUSDT",
"NEOUSDT",
"COMPUSDT",
"CHZUSDT",
"FORMUSDT",
"JSTUSDT",
"RUNEUSDT",
"BATUSDT",
"EGLDUSDT",
"DYDXUSDT",
"AXSUSDT",
"ZKUSDT",
"ARUSDT",
"KAITOUSDT",
"SUPERUSDT",
"LPTUSDT",
"AXLUSDT",
"QTUMUSDT"
]

LOG_FILE = f"/home/ubuntu/apexquantlabs/backend/cron_{INTERVAL}.log"

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
