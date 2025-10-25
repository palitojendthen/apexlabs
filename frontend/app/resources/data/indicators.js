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
      { no: "16", base: "SHIB", quote: "USDT", trade_pairs: "1000SHIBUSDT", name: "Shiba Inu", exchange: "Binance" },
      { no: "17", base: "TON", quote: "USDT", trade_pairs: "TONUSDT", name: "Toncoin", exchange: "Binance" },
      { no: "18", base: "DOT", quote: "USDT", trade_pairs: "DOTUSDT", name: "Polkadot", exchange: "Binance" },
      { no: "19", base: "UNI", quote: "USDT", trade_pairs: "UNI", name: "Uniswap", exchange: "Binance" },
      { no: "20", base: "XMR", quote: "USDT", trade_pairs: "XMRUSDT", name: "Monero", exchange: "Binance" },
      { no: "21", base: "AAVE", quote: "USDT", trade_pairs: "AAVEUSDT", name: "AAVE", exchange: "Binance" },
      { no: "22", base: "ENA", quote: "USDT", trade_pairs: "ENAUSDT", name: "Ethena", exchange: "Binance" },
      { no: "23", base: "PEPE", quote: "USDT", trade_pairs: "1000PEPEUSDT", name: "Pepe", exchange: "Binance" },
      { no: "24", base: "NEAR", quote: "USDT", trade_pairs: "NEARUSDT", name: "Near Protocol", exchange: "Binance" },
      { no: "25", base: "APT", quote: "USDT", trade_pairs: "APTUSDT", name: "Aptos", exchange: "Binance" },
      { no: "26", base: "ONDO", quote: "USDT", trade_pairs: "ONDOUSDT", name: "Ondo", exchange: "Binance" },
      { no: "27", base: "TAO", quote: "USDT", trade_pairs: "TAOUSDT", name: "Bittensor", exchange: "Binance" },
      { no: "28", base: "WLD", quote: "USDT", trade_pairs: "WLDUSDT", name: "Worldcoin", exchange: "Binance" },
      { no: "29", base: "POL", quote: "USDT", trade_pairs: "POLUSDT", name: "Polygon (ex-Matic)", exchange: "Binance" },
      { no: "30", base: "ICP", quote: "USDT", trade_pairs: "ICPUSDT", name: "Internet Computer", exchange: "Binance" },
      { no: "31", base: "ZEC", quote: "USDT", trade_pairs: "ZECUSDT", name: "Zcash", exchange: "Binance" },
      { no: "32", base: "ARB", quote: "USDT", trade_pairs: "ARBUSDT", name: "Arbitrum", exchange: "Binance" },
      { no: "33", base: "VET", quote: "USDT", trade_pairs: "VETUSDT", name: "VeChain", exchange: "Binance" },
      { no: "34", base: "ATOM", quote: "USDT", trade_pairs: "ATOMUSDT", name: "Cosmos", exchange: "Binance" },
      { no: "35", base: "ALGO", quote: "USDT", trade_pairs: "ALGOUSDT", name: "Algorand", exchange: "Binance" },
      { no: "36", base: "RENDER", quote: "USDT", trade_pairs: "RENDERUSDT", name: "Render", exchange: "Binance" },
      { no: "37", base: "PEPE", quote: "USDT", trade_pairs: "FILUSDT", name: "Filecoin", exchange: "Binance" },
      { no: "38", base: "QNT", quote: "USDT", trade_pairs: "QNTUSDT", name: "Quant", exchange: "Binance" },
      { no: "39", base: "SEI", quote: "USDT", trade_pairs: "SEIUSDT", name: "Sei", exchange: "Binance" },
      { no: "40", base: "BCH", quote: "USDT", trade_pairs: "BCHUSDT", name: "Bitcoin Cash", exchange: "Binance" },
      { no: "41", base: "ETC", quote: "USDT", trade_pairs: "ETCUSDT", name: "Ethereum Classic", exchange: "Binance" },
      { no: "42", base: "PAXG", quote: "USDT", trade_pairs: "PAXGUSDT", name: "PAX Gold", exchange: "Binance" },
      { no: "43", base: "PENGU", quote: "USDT", trade_pairs: "PENGUUSDT", name: "Bitcoin Cash", exchange: "Binance" },
      { no: "44", base: "BONK", quote: "USDT", trade_pairs: "1000BONKUSDT", name: "Bonk", exchange: "Binance" },
      { no: "45", base: "JUP", quote: "USDT", trade_pairs: "JUPUSDT", name: "Jupiter", exchange: "Binance" },
      { no: "46", base: "CAKE", quote: "USDT", trade_pairs: "CAKEUSDT", name: "PancakeSwap", exchange: "Binance" },
      { no: "47", base: "IMX", quote: "USDT", trade_pairs: "IMXUSDT", name: "Immutable", exchange: "Binance" },
      { no: "48", base: "INJ", quote: "USDT", trade_pairs: "INJUSDT", name: "Injective", exchange: "Binance" },
      { no: "49", base: "LDO", quote: "USDT", trade_pairs: "LDOUSDT", name: "Lido DAO", exchange: "Binance" },
      { no: "50", base: "M", quote: "USDT", trade_pairs: "MUSDT", name: "MemeCore", exchange: "Binance" },
      { no: "51", base: "STX", quote: "USDT", trade_pairs: "STXUSDT", name: "Stacks", exchange: "Binance" },
      { no: "52", base: "CRV", quote: "USDT", trade_pairs: "CRVUSDT", name: "Curve DAO", exchange: "Binance" },
      { no: "53", base: "OP", quote: "USDT", trade_pairs: "OPUSDT", name: "Optimism", exchange: "Binance" },
      { no: "54", base: "FET", quote: "USDT", trade_pairs: "FETUSDT", name: "Artificial Superintelligence Alliance", exchange: "Binance" },
      { no: "55", base: "GRT", quote: "USDT", trade_pairs: "GRTUSDT", name: "The Graph", exchange: "Binance" },
      { no: "56", base: "S", quote: "USDT", trade_pairs: "SUSDT", name: "Sonic (ex-FTM)", exchange: "Binance" },
      { no: "57", base: "PYTH", quote: "USDT", trade_pairs: "PYTHUSDT", name: "Pyth Network", exchange: "Binance" },
      { no: "58", base: "FLOKI", quote: "USDT", trade_pairs: "FLOKIUSDT", name: "Floki", exchange: "Binance" },
      { no: "59", base: "XTZ", quote: "USDT", trade_pairs: "XTZUSDT", name: "Tezos", exchange: "Binance" },
      { no: "60", base: "KAIA", quote: "USDT", trade_pairs: "KAIAUSDT", name: "Kaia", exchange: "Binance" },
      { no: "61", base: "IOTA", quote: "USDT", trade_pairs: "IOTAUSDT", name: "Iota", exchange: "Binance" },
      { no: "62", base: "CFX", quote: "USDT", trade_pairs: "CFXUSDT", name: "Conflux", exchange: "Binance" },
      { no: "63", base: "TWT", quote: "USDT", trade_pairs: "TWTUSDT", name: "Trust Wallet", exchange: "Binance" },
      { no: "64", base: "THETA", quote: "USDT", trade_pairs: "THETAUSDT", name: "Theta Network", exchange: "Binance" },
      { no: "65", base: "PENDLE", quote: "USDT", trade_pairs: "PENDLEUSDT", name: "Pendle", exchange: "Binance" },
      { no: "66", base: "DASH", quote: "USDT", trade_pairs: "DASHUSDT", name: "Dash", exchange: "Binance" },
      { no: "67", base: "WIF", quote: "USDT", trade_pairs: "WIFUSDT", name: "dogwifhat", exchange: "Binance" },
      { no: "68", base: "GALA", quote: "USDT", trade_pairs: "GALAUSDT", name: "Gala", exchange: "Binance" },
      { no: "69", base: "VIRTUAL", quote: "USDT", trade_pairs: "VIRTUALUSDT", name: "Virtuals Protocol", exchange: "Binance" },
      { no: "70", base: "SAND", quote: "USDT", trade_pairs: "SANDUSDT", name: "The Sandbox", exchange: "Binance" },
      { no: "71", base: "JASMY", quote: "USDT", trade_pairs: "JASMYUSDT", name: "JasmyCoin", exchange: "Binance" },
      { no: "72", base: "SNX", quote: "USDT", trade_pairs: "SNXUSDT", name: "Synthetix", exchange: "Binance" },
      { no: "73", base: "RAY", quote: "USDT", trade_pairs: "RAYUSDT", name: "Raydium", exchange: "Binance" },
      { no: "74", base: "STRK", quote: "USDT", trade_pairs: "STRKUSDT", name: "Starknet", exchange: "Binance" },
      { no: "75", base: "SUN", quote: "USDT", trade_pairs: "SUNUSDT", name: "Sun Token", exchange: "Binance" },
      { no: "76", base: "MANA", quote: "USDT", trade_pairs: "MANAUSDT", name: "Decentraland", exchange: "Binance" },
      { no: "77", base: "FLOW", quote: "USDT", trade_pairs: "FLOWUSDT", name: "Flow", exchange: "Binance" },
      { no: "78", base: "JTO", quote: "USDT", trade_pairs: "JTOUSDT", name: "Jito", exchange: "Binance" },
      { no: "79", base: "OG", quote: "USDT", trade_pairs: "OGUSDT", name: "OG", exchange: "Binance" },
      { no: "80", base: "RSR", quote: "USDT", trade_pairs: "RSRUSDT", name: "Reserve Rights", exchange: "Binance" },
      { no: "81", base: "DEXE", quote: "USDT", trade_pairs: "DEXEUSDT", name: "DeXe", exchange: "Binance" },
      { no: "82", base: "W", quote: "USDT", trade_pairs: "WUSDT", name: "Wormhole", exchange: "Binance" },
      { no: "83", base: "APE", quote: "USDT", trade_pairs: "APEUSDT", name: "ApeCoin", exchange: "Binance" },
      { no: "84", base: "NEO", quote: "USDT", trade_pairs: "NEOUSDT", name: "NEO", exchange: "Binance" },
      { no: "85", base: "COMP", quote: "USDT", trade_pairs: "COMPUSDT", name: "Compound", exchange: "Binance" },
      { no: "86", base: "CHZ", quote: "USDT", trade_pairs: "CHZUSDT", name: "Chiliz", exchange: "Binance" },
      { no: "87", base: "FORM", quote: "USDT", trade_pairs: "FORM", name: "Four", exchange: "Binance" },
      { no: "88", base: "JST", quote: "USDT", trade_pairs: "JSTUSDT", name: "JUST", exchange: "Binance" },
      { no: "89", base: "RUNE", quote: "USDT", trade_pairs: "RUNEUSDT", name: "THORChain", exchange: "Binance" },
      { no: "90", base: "BAT", quote: "USDT", trade_pairs: "BATUSDT", name: "Basic Attention Token", exchange: "Binance" },
      { no: "91", base: "EGLD", quote: "USDT", trade_pairs: "EGLDUSDT", name: "MultiverseX", exchange: "Binance" },
      { no: "92", base: "DYDX", quote: "USDT", trade_pairs: "DYDXUSDT", name: "dYdX", exchange: "Binance" },
      { no: "93", base: "AXS", quote: "USDT", trade_pairs: "AXSUSDT", name: "Axie Infinity", exchange: "Binance" },
      { no: "94", base: "ZK", quote: "USDT", trade_pairs: "ZKUSDT", name: "ZKsync", exchange: "Binance" },
      { no: "95", base: "AR", quote: "USDT", trade_pairs: "ARUSDT", name: "Arweave", exchange: "Binance" },
      { no: "96", base: "KAITO", quote: "USDT", trade_pairs: "KAITOUSDT", name: "Kaito", exchange: "Binance" },
      { no: "97", base: "SUPER", quote: "USDT", trade_pairs: "SUPERUSDT", name: "SuperVerse", exchange: "Binance" },
      { no: "98", base: "LPT", quote: "USDT", trade_pairs: "LPTUSDT", name: "Livepeer", exchange: "Binance" },
      { no: "99", base: "AXL", quote: "USDT", trade_pairs: "AXLUSDT", name: "Axelar", exchange: "Binance" },
      { no: "100", base: "QTUM", quote: "USDT", trade_pairs: "QTUMUSDT", name: "Qtum", exchange: "Binance" }
    ]
  },
  {
    id: "sma",
    name: "Simple Moving Average (SMA)",
    type: "Trend Following",
    parameters: [
      { name: "n_sma", type: "integer", default: 14, description: "lookback period" },
      { name: "source_sma", type: "string", default: "close", description: "input data source" }
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
      { name: "alpha_ema", type: "float", default: 0.14, description: "smoothing" }
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
- \( $$P_t$$ \) = current price  
- \( n \) = lookback period  
- \( $$EMA_{t-1}$$ \) = previous EMA value  

&nbsp;

The **Exponential Moving Average (EMA)** gives more weight to recent prices, making it more responsive to recent market changes than SMA.

&nbsp;

**Usage:**  
A bullish signal (1) is generated when price crosses above the EMA line, and a bearish signal (0) when it crosses below.

&nbsp;

**References:**  
- [Investopedia: Exponential Moving Average](https://www.investopedia.com/terms/e/ema.asp)
`
  },
  {
  id: "wma",
  name: "Weighted Moving Average (WMA)",
  type: "Trend Following",
  parameters: [
    { name: "n_wma", type: "integer", default: 14, description: "lookback period" },
    { name: "source_wma", type: "string", default: "close", description: "input data source" }
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
A bullish signal (1) is generated when price crosses above the WMA line, and a bearish signal (0) when it crosses below. WMA is often used by traders seeking faster reaction to trend reversals compared to SMA.

&nbsp;

**References:**  
- [Investopedia: Weighted Moving Average (WMA)](https://www.investopedia.com/ask/answers/071414/whats-difference-between-moving-average-and-weighted-moving-average.asp)
`
  },
  {
  id: "adx",
  name: "Average Directional Index (ADX)",
  type: "Trend Strength",
  parameters: [
    { name: "n_adx", type: "integer", default: 14, description: "lookback period for smoothing" },
    { name: "threshold_adx", type: "integer", default: 20, description: "strong trend direction threshold" }
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
    id: "rsi",
    name: "Relative Strength Index (RSI)",
    type: "Momentum",
    parameters: [
      { name: "n_rsi", type: "integer", default: 14, description: "lookback period" },
      { name: "overbought_rsi", type: "integer", default: 70, description: "overbought threshold"},
      { name: "oversold_rsi", type: "integer", default: 30, description: "oversold threshold"},
      { name: "source_rsi", type: "string", default: "close", description: "input price" }
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
  id: "stochastic_oscillator",
  name: "Stochastic Oscillator (Stoch)",
  type: "Momentum",
  parameters: [
    { name: "n_k_stoch", type: "integer", default: 14, description: "lookback period for %K calculation" },
    { name: "n_d_stoch", type: "integer", default: 3, description: "smoothing period for %D signal line" },
    { name: "source_stoch", type: "string", default: "close", description: "input data source" },
  ],
  markdown: `

**Formula:**

Compute the %K line:

$$
\\%K_t = 100 \\times \\frac{C_t - L_n}{H_n - L_n}
$$

where  
- \( $$C_t$$ \) = current closing price  
- \( $$H_n$$ \) = highest high over the last *n* periods  
- \( $$L_n$$ \) = lowest low over the last *n* periods  

Then, compute the %D line as a moving average of %K:

$$
\\%D_t = SMA(\\%K_t, n_d)
$$

&nbsp;

The **Stochastic Oscillator** compares a security’s closing price to its price range over a specific period. It is based on the observation that prices tend to close near the highs in an uptrend and near the lows in a downtrend.

&nbsp;

**Usage:**  
- \`%K\` and \`%D\` oscillate between 0 and 100.  
- Readings above 80 indicate an **overbought** condition, while readings below 20 indicate **oversold**.  
- A bullish signal occurs when \`%K\` crosses above \`%D\`; a bearish signal occurs when \`%K\` crosses below \`%D\`.

&nbsp;

**References:**  
- [Investopedia: Stochastic Oscillator](https://www.investopedia.com/terms/s/stochasticoscillator.asp)
`
  },
  {
    id: "macd",
    name: "Moving Average Convergence Divergence (MACD)",
    type: "Momentum / Trend Following",
    parameters: [
      { name: "source_macd", type: "string", default: "close", description: "input price series" },
      { name: "n_fast_macd", type: "integer", default: 12, description: "fast EMA period" },
      { name: "n_slow_macd", type: "integer", default: 26, description: "slow EMA period" },
      { name: "n_signal_macd", type: "integer", default: 9, description: "signal EMA period" },
      { name: "ma_type_macd", type: "string", default: "ema", description: "moving average type", option: "[sma, ema, rma]" }      
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
- \( $$EMA_{fast}$$ \) = shorter-term EMA (e.g. 12)  
- \( $$EMA_{slow}$$ \) = longer-term EMA (e.g. 26)  
- \( $$EMA_{signal}$$ \) = signal line EMA (e.g. 9)  

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
  id: "donchian_channel",
  name: "Donchian Channel",
  type: "Volatility",
  parameters: [
    { name: "n_dc", type: "integer", default: 20, description: "lookback period for channel calculation" }
  ],
  markdown: `

**Formula:**

Compute the upper, lower, and middle bands:

$$
\\text{Upper Band}_t = \\max(High_{t-n+1}, \\dots, High_t)
$$

$$
\\text{Lower Band}_t = \\min(Low_{t-n+1}, \\dots, Low_t)
$$

$$
\\text{Middle Band}_t = \\frac{\\text{Upper Band}_t + \\text{Lower Band}_t}{2}
$$

&nbsp;

The **Donchian Channel** plots the highest high and lowest low over a specified lookback period, creating a dynamic price envelope that adapts to volatility and trend conditions. It was developed by **Richard Donchian**, a pioneer of mechanical trend-following systems.

&nbsp;

**Usage:**  
- A **breakout** occurs when price moves above the upper band (bullish) or below the lower band (bearish).  
- The **middle band** can act as a dynamic support/resistance or mean-reversion reference.  
- Commonly used in systematic trading for identifying trend entries and exits.

&nbsp;

**References:**  
- [Investopedia: Donchian Channel](https://www.investopedia.com/terms/d/donchianchannels.asp)
`
  },
  {
  id: "kama",
  name: "Kaufman Adaptive Moving Average (KAMA)",
  type: "Adaptive / Trend Following",
  parameters: [
    { name: "n_kama", type: "integer", default: 10, description: "efficiency ratio lookback period" },
    { name: "n_fast_kama", type: "integer", default: 2, description: "short-term smoothing constant" },
    { name: "n_slow_kama", type: "integer", default: 30, description: "long-term smoothing constant" },
    { name: "source_kama", type: "string", default: "close", description: "input data source" },
  ],
  markdown: `

**Formula:**

First, calculate the **Efficiency Ratio (ER):**

$$
ER_t = \\frac{|P_t - P_{t-n}|}{\\sum_{i=1}^{n} |P_i - P_{i-1}|}
$$

Then compute the **Smoothing Constant (SC):**

$$
SC_t = [ER_t \\times (SC_{fast} - SC_{slow}) + SC_{slow}]^2
$$

where  

$$
SC_{fast} = \\frac{2}{fast\\_period + 1}, \\quad SC_{slow} = \\frac{2}{slow\\_period + 1}
$$

Finally, compute the **Kaufman Adaptive Moving Average (KAMA):**

$$
KAMA_t = KAMA_{t-1} + SC_t \\times (P_t - KAMA_{t-1})
$$

&nbsp;

The **Kaufman Adaptive Moving Average (KAMA)** dynamically adjusts its sensitivity to price movements based on market noise and trend strength. It reacts quickly during strong trends and slows down during sideways or choppy markets.

&nbsp;

**Usage:**  
- A signal generated (1/long) is when KAMA line is greater than $$KAMA_{t-1}$$, and a signal (0/short) when KAMA line is less than $$KAMA_{t-1}$$.
- KAMA can be used to smooth signals for other systems or as a trailing stop reference.  
- The \`n_kama\` parameter defines responsiveness — shorter periods react faster but with more noise.

&nbsp;

**References:**  
- [Corporate Finance Institute: Kaufman’s Adaptive Moving Average (KAMA)](https://corporatefinanceinstitute.com/resources/career-map/sell-side/capital-markets/kaufmans-adaptive-moving-average-kama/)
- Perry J. Kaufman, Trading Systems and Methods pg. 779
`
  },
  {
    id: "atr",
    name: "Average True Range (ATR)",
    type: "Volatility",
    parameters: [
      { name: "n_atr", type: "integer", default: 14, description: "lookback period" }
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

  The **Average True Range (ATR)** measures market volatility by decomposing the entire range of an asset’s price for each period. A higher ATR indicates increased volatility, while a lower ATR suggests quieter market conditions.

  &nbsp;

  **Usage:**  
  ATR is often used to set dynamic stop-loss levels or identify breakout conditions. For example, a trailing stop might be placed at a multiple (e.g., 1.5×ATR) below a long entry price.

  &nbsp;

  **References:**  
  - [Investopedia: Average True Range (ATR)](https://www.investopedia.com/terms/a/atr.asp)
  `
},
{
  id: "simple_decycler",
  name: "(Ehlers) Simple Decycler",
  type: "Trend Following",
  parameters: [
    { name: "hp_simple_decycler", type: "integer", default: 48, description: "look-back period for high-pass filter" },
    { name: "source_simple_decycler", type: "string", default: "close", description: "input data source" }    
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

The **Ehlers Simple Decycler** removes high-frequency “cycle” components from the price series, leaving a low-lag trend component. Because the high-pass filter subtracts oscillatory noise, the resulting series tracks the trend with minimal distortion and lag.

&nbsp;

**Usage:**  
- When the price is above the Decycler line, the trend is considered bullish;  
- When the price is below the Decycler line, the trend is considered bearish;  
- Some traders employ bands around the Decycler (e.g., ±0.5% of the Decycler value) to define hysteresis zones and avoid false signals.  
- Use the HPPeriod parameter to adjust sensitivity: smaller values → more responsive (less filtering), larger values → smoother (more filtering).

&nbsp;

**References:**  
- [TASC Traders' Tips: Decyclers](https://traders.com/documentation/feedbk_docs/2015/09/traderstips.html)
- [ThinkOrSwim: EhlersSimpleDecycler](https://toslc.thinkorswim.com/center/reference/Tech-Indicators/studies-library/E-F/EhlersSimpleDecycler)
`
},
{
  id: "predictive_moving_average",
  name: "(Ehlers) Predictive Moving Average",
  type: "Trend Following",
  parameters: [
    { name: "source_pma", type: "string", default: "close", description: "input data source" },
  ],
  markdown: `

**Formula:**

Compute two 7-bar weighted moving averages of the price:

$$
WMA1_t = \\frac{7P_t + 6P_{t-1} + 5P_{t-2} + 4P_{t-3} + 3P_{t-4} + 2P_{t-5} + P_{t-6}}{28}
$$

$$
WMA2_t = \\frac{7WMA1_t + 6WMA1_{t-1} + 5WMA1_{t-2} + 4WMA1_{t-3} + 3WMA1_{t-4} + 2WMA1_{t-5} + WMA1_{t-6}}{28}
$$

Then, derive the **Predictive Moving Average**:

$$
Predict_t = 2 \\times WMA1_t - WMA2_t
$$

Finally, compute the **Trigger** line as a 4-bar weighted moving average of \`Predict\`:

$$
Trigger_t = \\frac{4Predict_t + 3Predict_{t-1} + 2Predict_{t-2} + Predict_{t-3}}{10}
$$

&nbsp;

The **Ehlers Predictive Moving Average (PMA)** is a fixed-length, two-stage weighted moving average designed to remove lag while maintaining smoothness. By differencing the two 7-bar WMAs, Ehlers effectively cancels phase delay, creating a near zero-lag smoother of the price function.

&nbsp;

**Usage:**  
- **Bullish signal:** when the *Predict* line crosses **above** the *Trigger* line.  
- **Bearish signal:** when the *Predict* line crosses **below** the *Trigger* line.  
- PMA serves as a leading smoother — responsive yet less noisy than a single short-period WMA.

&nbsp;

**References:**  
- John F. Ehlers, *Rocket Science for Traders: Digital Signal Processing Applications*, 2001, pg. 212
`
},
{
  id: "ultimate_smoother",
  name: "(Ehlers) Ultimate Smoother",
  type: "Digital Filter",
  parameters: [
    { name: "n_us", type: "integer", default: 20, description: "lookback period for smoothing" },
    { name: "source_us", type: "string", default: "close", description: "input data source" },
  ],
  markdown: `

**Formula:**

Compute the recursive coefficients based on the smoothing length \( L \):

$$
\\alpha = e^{-1.414\\pi / L}, \\quad
c_2 = 2\\alpha\\cos(1.414\\pi / L), \\quad
c_3 = -\\alpha^2, \\quad
c_1 = \\frac{1 + c_2 - c_3}{4}
$$

Then the **Ultimate Smoother** output is computed as:

$$
US_t = (1 - c_1)P_t + (2c_1 - c_2)P_{t-1} - (c_1 + c_3)P_{t-2}
       + c_2US_{t-1} + c_3US_{t-2}
$$

where  
- \( $$P_t$$ \) = input price (typically \( (High + Low)/2 \))  
- \( $$US_t$$ \) = Ultimate Smoother output  

&nbsp;

The **Ehlers Ultimate Smoother** is a two-pole digital low-pass filter that achieves *maximum smoothness for the least possible lag*. It is derived analytically rather than empirically and represents an enhancement over Ehlers’ prior **Super Smoother**, delivering a nearly Gaussian response while maintaining consistent phase characteristics across smoothing periods.

&nbsp;

**Usage:**  
- Provides a smooth, low-lag baseline for price series.  
- Ideal as a replacement for traditional moving averages in crossover systems.  
- Frequently used as an input to Ehlers’ cycle, band-pass, or spectral analysis filters.  
- Shorter lengths → faster reaction (less smooth).  
- Longer lengths → slower reaction (greater smoothness).

&nbsp;

**References:**
- [TASC Traders' Tips: Ultimate Smoother](https://traders.com/Documentation/FEEDbk_docs/2024/04/TradersTips.html)
- [MESA Software: Ultimate Smoother](https://www.mesasoftware.com/papers/UltimateSmoother.pdf)
`
}
];