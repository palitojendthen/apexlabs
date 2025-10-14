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

**Formula:**
$$
SMA = \\frac{P_1 + P_2 + P_3 + \\dots + P_n}{n}
$$

&nbsp;

The **Simple Moving Average (SMA)** smooths out short-term price fluctuations by averaging recent data points. It helps traders identify trend direction and potential reversals.

&nbsp;

**Usage:**  
A bullish signal (1) is generated when price crosses above the SMA line, and a bearish signal (0) when it crosses below.

&nbsp;

**References:**  
- [Investopedia: Moving Average](https://www.investopedia.com/terms/m/movingaverage.asp)
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

**Formula:**

$$
EMA_t = (P_t \\times \\alpha) + EMA_{t-1} \\times (1 - \\alpha)
$$

where  

$$
\\alpha = \\frac{2}{n + 1}
$$  

and  
- \( P_t \) = current price  
- \( n \) = lookback period  
- \( EMA_{t-1} \) = previous EMA value  

&nbsp;

The **Exponential Moving Average (EMA)** gives more weight to recent prices, making it more responsive to recent market changes than SMA.

&nbsp;

**Usage:**  
Traders often use EMA crossovers (e.g., 12 vs 26 period) as trend confirmation signals.

&nbsp;

**References:**  
- [Wikipedia: Exponential Moving Average](https://en.wikipedia.org/wiki/Moving_average#Exponential_moving_average)
`
  },
  {
    id: "rsi",
    name: "Relative Strength Index (RSI)",
    type: "Momentum",
    parameters: [
      { name: "n_rsi", type: "integer", default: 14, description: "lookback period" },
      { name: "overbought_rsi", type: "integer", default: 70, description: "overbought threshold"},
      { name: "oversold_rsi", type: "integer", default: 30, description: "oversold threshold"},
      { name: "source", type: "string", default: "close", description: "input price" },
    ],
    markdown: `

**Formula:**

First compute average gains and losses over the lookback period:

$$
RS = \\frac{Average\\ Gain}{Average\\ Loss}
$$

Then the RSI is:

$$
RSI = 100 - \\frac{100}{1 + RS}
$$

where  
- \( RS \) = Relative Strength  
- \( RSI \) ranges from 0 to 100  

&nbsp;

The **RSI** measures the speed and magnitude of price movements to identify overbought or oversold conditions.

&nbsp;

**Usage:**  
- RSI > 70 → Overbought  
- RSI < 30 → Oversold

&nbsp;

**References:**  
- [Investopedia: RSI](https://www.investopedia.com/terms/r/rsi.asp)
`
  },
  {
    id: "macd",
    name: "MACD (Moving Average Convergence Divergence)",
    type: "Momentum / Trend Following",
    parameters: [
      { name: "fast_n_macd", type: "integer", default: 12, description: "fast EMA period" },
      { name: "slow_n_macd", type: "integer", default: 26, description: "slow EMA period" },
      { name: "signal_n_macd", type: "integer", default: 9, description: "signal EMA period" },
    ],
    markdown: `
**Formula:**

$$
MACD_t = EMA_{fast}(P_t) - EMA_{slow}(P_t)
$$

and  

$$
Signal_t = EMA_{signal}(MACD_t)
$$

**Histogram:**

$$
Histogram_t = MACD_t - Signal_t
$$

where  
- \( EMA_{fast} \) = shorter-term EMA (e.g. 12)  
- \( EMA_{slow} \) = longer-term EMA (e.g. 26)  
- \( EMA_{signal} \) = signal line EMA (e.g. 9)  

&nbsp;

The **MACD** identifies momentum changes by comparing two EMAs. A bullish crossover occurs when the MACD line crosses above the signal line.

&nbsp;

**Usage:**  
- MACD > Signal → Bullish momentum  
- MACD < Signal → Bearish momentum  

&nbsp;

**References:**  
- [Wikipedia: MACD](https://en.wikipedia.org/wiki/MACD)
`
  },
];
