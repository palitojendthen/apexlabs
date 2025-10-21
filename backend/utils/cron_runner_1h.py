# #!/usr/bin/env python3
# import time
# from utils.ingestion_tools import append_latest
# import requests
# from dotenv import load_dotenv

# # load env and initialize clients
# load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))

# TG_CHAT_ID = os.getenv("TG_CHAT_ID")
# TG_API_KEY = os.getenv("TG_API_KEY")


# INTERVAL = "1h"
# SYMBOLS = [
# "BTCUSDT",
# "ETHUSDT",
# "XRPUSDT",
# "BNBUSDT",
# "SOLUSDT",
# "DOGEUSDT",
# "TRXUSDT",
# "ADAUSDT",
# "LINKUSDT",
# "HYPEUSDT",
# "SUIUSDT",
# "XLMUSDT",
# "AVAXUSDT",
# "HBARUSDT",
# "LTCUSDT",
# "1000SHIBUSDT",
# "TONUSDT",
# "DOTUSDT",
# "XMRUSDT",
# "UNIUSDT",
# "AAVEUSDT",
# "ENAUSDT",
# "1000PEPEUSDT",
# "NEARUSDT",
# "APTUSDT",
# "ONDOUSDT",
# "TAOUSDT",
# "WLDUSDT",
# "POLUSDT",
# "ICPUSDT",
# "ZECUSDT",
# "ARBUSDT",
# "VETUSDT",
# "ATOMUSDT",
# "ALGOUSDT",
# "RENDERUSDT",
# "FILUSDT",
# "QNTUSDT",
# "SEIUSDT",
# "BCHUSDT",
# "ETCUSDT",
# "PAXGUSDT",
# "PENGUUSDT",
# "1000BONKUSDT",
# "JUPUSDT",
# "CAKEUSDT",
# "IMXUSDT",
# "INJUSDT",
# "LDOUSDT",
# "MUSDT",
# "STXUSDT",
# "CRVUSDT",
# "OPUSDT",
# "FETUSDT",
# "GRTUSDT",
# "SUSDT",
# "PYTHUSDT",
# "1000FLOKIUSDT",
# "XTZUSDT",
# "KAIAUSDT",
# "IOTAUSDT",
# "CFXUSDT",
# "TWTUSDT",
# "THETAUSDT",
# "PENDLEUSDT",
# "DASHUSDT",
# "WIFUSDT",
# "GALAUSDT",
# "VIRTUALUSDT",
# "SANDUSDT",
# "JASMYUSDT",
# "SNXUSDT",
# "RAYUSDT",
# "STRKUSDT",
# "SUNUSDT",
# "MANAUSDT",
# "FLOWUSDT",
# "JTOUSDT",
# "OGUSDT",
# "RSRUSDT",
# "DEXEUSDT",
# "WUSDT",
# "APEUSDT",
# "NEOUSDT",
# "COMPUSDT",
# "CHZUSDT",
# "FORMUSDT",
# "JSTUSDT",
# "RUNEUSDT",
# "BATUSDT",
# "EGLDUSDT",
# "DYDXUSDT",
# "AXSUSDT",
# "ZKUSDT",
# "ARUSDT",
# "KAITOUSDT",
# "SUPERUSDT",
# "LPTUSDT",
# "AXLUSDT",
# "QTUMUSDT"
# ]

# LOG_FILE = f"/home/ubuntu/apexquantlabs/backend/cron_{INTERVAL}.log"

# def log(msg):
#     with open(LOG_FILE, "a") as f:
#         f.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {msg}\n")

# def main():
#     log(f"--- Starting job for interval {INTERVAL} ---")
#     for sym in SYMBOLS:
#         try:
#             result = append_latest(sym, INTERVAL)
#             log(f"{sym}: {result['status']} | {result['message']}")
#             time.sleep(0.3)
#         except Exception as e:
#             log(f"{sym}: ERROR - {e}")
#             url = f"https://api.telegram.org/bot{TG_API_KEY}/sendMessage?chat_id={TG_CHAT_ID}&text={e}"
#             requests.get(url).json()
#     log(f"--- Job for {INTERVAL} completed ---\n")

# if __name__ == "__main__":
#     main()


#!/usr/bin/env python3
import os
import time
import requests
import traceback
from utils.ingestion_tools import append_latest
from dotenv import load_dotenv
from urllib.parse import quote_plus

# Load environment
ENV_PATH = os.path.join(os.path.dirname(__file__), "../.env")
load_dotenv(dotenv_path=ENV_PATH)

TG_CHAT_ID = os.getenv("TG_CHAT_ID")
TG_API_KEY = os.getenv("TG_API_KEY")

INTERVAL = "1h"
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

LOG_FILE = f"/home/ubuntu/apexlabs/backend/cron_{INTERVAL}.log"

def log(msg: str):
    """Append a line to log and truncate if too large."""
    # Auto-truncate if >5MB
    if os.path.exists(LOG_FILE) and os.path.getsize(LOG_FILE) > 5_000_000:
        open(LOG_FILE, "w").close()
    with open(LOG_FILE, "a") as f:
        f.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {msg}\n")

def send_tg_alert(message: str):
    """Send Telegram message safely (non-blocking)."""
    if not TG_API_KEY or not TG_CHAT_ID:
        return
    safe_msg = quote_plus(message[:4000])  # limit length and escape text
    url = f"https://api.telegram.org/bot{TG_API_KEY}/sendMessage?chat_id={TG_CHAT_ID}&text={safe_msg}"
    try:
        requests.get(url, timeout=5)
    except Exception:
        # avoid blocking or crash on tg error
        pass

def main():
    log(f"--- Starting job for interval {INTERVAL} ---")
    for sym in SYMBOLS:
        try:
            result = append_latest(sym, INTERVAL)
            log(f"{sym}: {result['status']} | {result['message']}")
            time.sleep(0.3)  # respect Binance rate limits
        except Exception as e:
            err_text = f"{sym}: ERROR - {e}"
            log(err_text)
            send_tg_alert(f"{INTERVAL} | {err_text}\n{traceback.format_exc()}")
    log(f"--- Job for {INTERVAL} completed ---\n")

if __name__ == "__main__":
    main()