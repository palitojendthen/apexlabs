// /frontend/data/indicators.js
export const indicators = [
  {
    id: "sma",
    name: "Simple Moving Average (SMA)",
    type: "Trend Following",
    parameters: [
      { name: "n_sma", type: "integer", default: 14, description: "lookback period" },
      { name: "source_sma", type: "string", default: "close", description: "input data source" },
    ],
    markdown: `

**Formula**
$$
SMA = \\frac{P_1 + P_2 + P_3 + \\dots + P_n}{n}
$$

The **Simple Moving Average (SMA)** smooths out short-term price fluctuations by averaging recent data points.  
It helps traders identify trend direction and potential reversals.

**Usage:**  
A bullish signal is generated when price crosses above the SMA line,  
and a bearish signal when it crosses below.

**References:**  
- [Investopedia: Moving Average](https://www.investopedia.com/terms/m/movingaverage.asp)  
- [Download PDF](/docs/indicators/sma.pdf)
`
  },
  {
    id: "ema",
    name: "Exponential Moving Average (EMA)",
    type: "Trend Following",
    parameters: [
      { name: "n_ema", type: "integer", default: 14, description: "lookback period" },
      { name: "source_ema", type: "string", default: "close", description: "input data source" },
    ],
    markdown: `
# Exponential Moving Average (EMA)
**Type:** Trend Following  

**Parameters:**  
- \`n_ema\`: integer, default=14 (lookback period)  
- \`source_ema\`: string, default='close' (input data)  

---

The **Exponential Moving Average (EMA)** gives more weight to recent prices,  
making it more responsive to recent market changes than SMA.

**Usage:**  
Traders often use EMA crossovers (e.g., 12 vs 26 period) as trend confirmation signals.

**References:**  
- [Wikipedia: Exponential Moving Average](https://en.wikipedia.org/wiki/Moving_average#Exponential_moving_average)
`
  },
  {
    id: "rsi",
    name: "Relative Strength Index (RSI)",
    type: "Momentum",
    parameters: [
      { name: "period", type: "integer", default: 14, description: "lookback period" },
      { name: "source", type: "string", default: "close", description: "input price" },
    ],
    markdown: `
# Relative Strength Index (RSI)
**Type:** Momentum Oscillator  

**Parameters:**  
- \`period\`: integer, default=14  
- \`source\`: string, default='close'  

---

The **RSI** measures the speed and magnitude of price movements to identify overbought or oversold conditions.  

**Usage:**  
- RSI > 70 → Overbought  
- RSI < 30 → Oversold  

**References:**  
- [Investopedia: RSI](https://www.investopedia.com/terms/r/rsi.asp)
`
  },
  {
    id: "macd",
    name: "MACD (Moving Average Convergence Divergence)",
    type: "Momentum / Trend",
    parameters: [
      { name: "fast_length", type: "integer", default: 12, description: "fast EMA period" },
      { name: "slow_length", type: "integer", default: 26, description: "slow EMA period" },
      { name: "signal_length", type: "integer", default: 9, description: "signal EMA period" },
    ],
    markdown: `
# Moving Average Convergence Divergence (MACD)
**Type:** Momentum / Trend Following  

**Parameters:**  
- \`fast_length\`: integer, default=12  
- \`slow_length\`: integer, default=26  
- \`signal_length\`: integer, default=9  

---

The **MACD** identifies momentum changes by comparing two EMAs.  
A bullish crossover occurs when the MACD line crosses above the signal line.

**Usage:**  
- MACD > Signal → Bullish momentum  
- MACD < Signal → Bearish momentum  

**References:**  
- [Wikipedia: MACD](https://en.wikipedia.org/wiki/MACD)
`
  },
];
