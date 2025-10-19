export const indicators = [
  {
    id: "available_symbol",
    name: "Available Symbol",
    type: "Symbol",
    parameters: [
      { no: "1", base: "BTC", quote: "USDT", trade_pairs: "BTCUSDT", name: "Bitcoin", exchange: "Binance" },
      { no: "2", base: "ETH", quote: "USDT", trade_pairs: "ETHUSDT", name: "Ethereum", exchange: "Binance"},
      { no: "3", base: "SOL", quote: "USDT", trade_pairs: "SOLUSDT", name: "Solana", exchange: "Binance" },
      { no: "4", base: "ADA", quote: "USDT", trade_pairs: "ADAUSDT", name: "Cardano", exchange: "Binance" },
      { no: "5", base: "AVAX", quote: "USDT", trade_pairs: "AVAXUSDT", name: "Avalanche", exchange: "Binance" },      
      { no: "6", base: "XLM", quote: "USDT", trade_pairs: "XLMUSDT", name: "Stellar", exchange: "Binance" },
      { no: "7", base: "XRP", quote: "USDT", trade_pairs: "XRPUSDT", name: "XRP", exchange: "Binance" },
      { no: "8", base: "DOGE", quote: "USDT", trade_pairs: "DOGEUSDT", name: "Dogecoin", exchange: "Binance" },            
      { no: "9", base: "TRX", quote: "USDT", trade_pairs: "TRXUSDT", name: "Tron", exchange: "Binance" },
      { no: "10", base: "LINK", quote: "USDT", trade_pairs: "LINKUSDT", name: "Chainlink", exchange: "Binance" },
      { no: "11", base: "BNB", quote: "USDT", trade_pairs: "BNBUSDT", name: "Binance Coin", exchange: "Binance" },
      { no: "12", base: "HYPE", quote: "USDT", trade_pairs: "HYPEUSDT", name: "Hyperliquid", exchange: "Binance" },
      { no: "13", base: "SUI", quote: "USDT", trade_pairs: "SUIUSDT", name: "Sui", exchange: "Binance" },
      { no: "14", base: "HBAR", quote: "USDT", trade_pairs: "HBARUSDT", name: "Hedera Hashgraph", exchange: "Binance" },
      { no: "15", base: "LTC", quote: "USDT", trade_pairs: "LTCUSDT", name: "Litecoin", exchange: "Binance" },
      { no: "16", base: "SHIB", quote: "USDT", trade_pairs: "SHIBUSDT", name: "Shiba Inu", exchange: "Binance" },
      { no: "17", base: "TON", quote: "USDT", trade_pairs: "TONUSDT", name: "Toncoin", exchange: "Binance" },
      { no: "18", base: "DOT", quote: "USDT", trade_pairs: "DOTUSDT", name: "Polkadot", exchange: "Binance" },
      { no: "19", base: "UNI", quote: "USDT", trade_pairs: "UNI", name: "Uniswap", exchange: "Binance" },
      { no: "20", base: "XMR", quote: "USDT", trade_pairs: "XMRUSDT", name: "Monero", exchange: "Binance" }
    ]
  },
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
- [Investopedia: Exponential Moving Average](https://www.investopedia.com/terms/e/ema.asp)
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
    name: "Moving Average Convergence Divergence (MACD)",
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
- [Investopedia: MACD](https://www.investopedia.com/terms/m/macd.asp)
`
  },
  {
    id: "atr",
    name: "Average True Range (ATR)",
    type: "Volatility Indicator",
    parameters: [
      { name: "n_atr", type: "integer", default: 14, description: "lookback period" },
    ],
    markdown: `

  **Formula:**

  First, compute the **True Range (TR)** for each period:

  $$
  TR_t = \\max(High_t - Low_t, |High_t - Close_{t-1}|, |Low_t - Close_{t-1}|)
  $$

  Then, the **Average True Range (ATR)** is the moving average of the True Range over *n* periods:

  $$
  ATR_t = \\frac{1}{n} \\sum_{i=0}^{n-1} TR_{t-i}
  $$

  &nbsp;

  The **Average True Range (ATR)** measures market volatility by decomposing the entire range of an asset’s price for each period.  
  A higher ATR indicates increased volatility, while a lower ATR suggests quieter market conditions.

  &nbsp;

  **Usage:**  
  ATR is often used to set dynamic stop-loss levels or identify breakout conditions.  
  For example, a trailing stop might be placed at a multiple (e.g., 1.5×ATR) below a long entry price.

  &nbsp;

  **References:**  
  - [Investopedia: Average True Range (ATR)](https://www.investopedia.com/terms/a/atr.asp)
  `
  },
  {
  id: "adx",
  name: "Average Directional Index (ADX)",
  type: "Trend Strength Indicator",
  parameters: [
    { name: "n_adx", type: "integer", default: 14, description: "lookback period for smoothing" },
  ],
  markdown: `

**Formula:**

First, compute the **Directional Movements (DM)**:

$$
DM^+_t = 
\\begin{cases} 
High_t - High_{t-1}, & \\text{if } High_t - High_{t-1} > Low_{t-1} - Low_t \\\\
0, & \\text{otherwise}
\\end{cases}
$$

$$
DM^-_t = 
\\begin{cases} 
Low_{t-1} - Low_t, & \\text{if } Low_{t-1} - Low_t > High_t - High_{t-1} \\\\
0, & \\text{otherwise}
\\end{cases}
$$

Then compute the **True Range (TR)**:

$$
TR_t = \\max(High_t - Low_t, |High_t - Close_{t-1}|, |Low_t - Close_{t-1}|)
$$

Next, derive the **Directional Indicators (+DI and -DI)**:

$$
+DI_t = 100 \\times \\frac{EMA(DM^+_t, n)}{EMA(TR_t, n)}
$$

$$
-DI_t = 100 \\times \\frac{EMA(DM^-_t, n)}{EMA(TR_t, n)}
$$

Finally, calculate the **ADX** as the smoothed average of the Directional Index (DX):

$$
DX_t = 100 \\times \\frac{|(+DI_t) - (-DI_t)|}{(+DI_t) + (-DI_t)}
$$

$$
ADX_t = EMA(DX_t, n)
$$

&nbsp;

The **Average Directional Index (ADX)** quantifies the strength of a trend, regardless of direction.  
A high ADX indicates a strong trend, while a low ADX signals a weak or ranging market.

&nbsp;

**Usage:**  
- ADX > 25 → Strong trend  
- ADX < 20 → Weak or ranging market  
- The +DI and -DI crossovers can signal potential entry or exit points.

&nbsp;

**References:**  
- [Investopedia: Average Directional Index (ADX)](https://www.investopedia.com/articles/trading/07/adx-trend-indicator.asp)
`
},
{
  id: "wma",
  name: "Weighted Moving Average (WMA)",
  type: "Trend Following",
  parameters: [
    { name: "n_wma", type: "integer", default: 14, description: "lookback period" },
    { name: "source_wma", type: "string", default: "close", description: "input data source" },
  ],
  markdown: `

**Formula:**

$$
WMA = \\frac{P_1 \\times n + P_2 \\times (n - 1) + P_3 \\times (n - 2) + \\dots + P_n \\times 1}{n + (n - 1) + (n - 2) + \\dots + 1}
$$

&nbsp;

The **Weighted Moving Average (WMA)** assigns greater importance to more recent data points,  
making it more responsive to current price movements than a Simple Moving Average (SMA).  
Older prices contribute less influence as their weights decrease linearly over the lookback window.

&nbsp;

**Usage:**  
A bullish signal (1) is generated when price crosses above the WMA line,  
and a bearish signal (0) when it crosses below.  
WMA is often used by traders seeking faster reaction to trend reversals compared to SMA.

&nbsp;

**References:**  
- [Investopedia: Weighted Moving Average (WMA)])
`
},
{
  id: "ehlers_simple_decycler",
  name: "Ehlers Simple Decycler",
  type: "Trend / No-Lag Filter",
  parameters: [
    { name: "HPPeriod", type: "integer", default: 125, description: "look-back period for high-pass filter" }
  ],
  markdown: `

**Formula:**

The Simple Decycler is built by first applying a second-order high-pass filter to price, then subtracting the high-pass output from the original series:

Let:
$$
\\alpha = \\frac{ \\cos\\left(0.707 \\times \\tfrac{360°}{HPPeriod}\\right) + \\sin\\left(0.707 \\times \\tfrac{360°}{HPPeriod}\\right) - 1 }
              { \\cos\\left(0.707 \\times \\tfrac{360°}{HPPeriod}\\right) }
$$

Then compute the high-pass filter HP:
$$
HP_t = (1 - \\tfrac{\\alpha}{2})^2 \\times (P_t - 2P_{t-1} + P_{t-2})
        + 2(1 - \\alpha) \\times HP_{t-1}
        - (1 - \\alpha)^2 \\times HP_{t-2}
$$

Finally:
$$
Decycler_t = P_t - HP_t
$$

&nbsp;

The **Ehlers Simple Decycler** removes high-frequency “cycle” components from the price series, leaving a low-lag trend component.  
Because the high-pass filter subtracts oscillatory noise, the resulting series tracks the trend with minimal distortion and lag.

&nbsp;

**Usage:**  
- When the price is above the Decycler line, the trend is considered bullish;  
- When the price is below the Decycler line, the trend is considered bearish;  
- Some traders employ bands around the Decycler (e.g., ±0.5% of the Decycler value) to define hysteresis zones and avoid false signals. :contentReference[oaicite:4]{index=4}  
- Use the HPPeriod parameter to adjust sensitivity: smaller values → more responsive (less filtering), larger values → smoother (more filtering).

&nbsp;

**References:**  
- John F. Ehlers, “Decyclers”, *Traders’ Tips*, September 2015. :contentReference[oaicite:5]{index=5}  
- [ThinkOrSwim: Weighted Moving Average (WMA)])
`
}
];
