from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="APEXLABS API")

# allow local next.js during dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class BacktestRequest(BaseModel):
    ticker: str
    timeframe: str
    strategy: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/backtest")
def backtest(req: BacktestRequest):
    # placeholder response-will change to retrieve directly database and applied strategy later;
    data = [{"idx": i, "equity": 100 + i*0.2} for i in range(120)]
    metrics = {"pnl": "12.8%", "sharpe": "1.32", "winrate": "54.1%", "mdd": "14.7%"}
    return {"data": data, "metrics": metrics}
