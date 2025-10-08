// "use client";
// import { useTheme } from "next-themes";
// import dynamic from "next/dynamic";
// import { useEffect, useMemo, useState } from "react";
// import BackgroundFX from "./components/BackgroundFX";

// const Plot = dynamic(() => import("react-plotly.js").then((m) => m.default), {
//   ssr: false,
// });

// /** parse "n=14, hp=48, alpha=0.5" -> { n:14, hp:48, alpha:0.5 } */
// function parseParams(s) {
//   if (!s) return {};
//   return s
//     .split(/[,\n]/)
//     .map((x) => x.trim())
//     .filter(Boolean)
//     .reduce((acc, kv) => {
//       const [k, v] = kv.split("=").map((t) => t.trim());
//       if (!k) return acc;
//       const num = Number(v);
//       acc[k] = Number.isNaN(num) ? v : num;
//       return acc;
//     }, {});
// }

// /* ===========================================================
//    PARAMS VALIDATION LAYER START
// =========================================================== */

// // indicator schema definition and defaults
// const indicatorSchemas = {
//   SMA: {
//     n_sma: { default: 14, type: "int", min: 1, max: 500 },
//     source_sma: { default: "close", type: "string" },
//   },
//   EMA: {
//     n_ema: { default: 14, type: "int", min: 1, max: 500 },
//     alpha: { default: 0.5, type: "float", min: 0, max: 1 },
//     source_ema: { default: "close", type: "string" },
//   },
//   ADX: {
//     n_adx: { default: 14, type: "int", min: 1, max: 500 },
//     threshold_adx: { default: 20, type: "float", min: 0, max: 100 },
//   },
//   RSI: {
//     n_rsi: { default: 14, type: "int", min: 1, max: 500 },
//     source_rsi: { default: "close", type: "string" },
//   },
//   "Donchian Channel": {
//     n_dc: { default: 20, type: "int", min: 1, max: 500 },
//     source_dc: { default: "close", type: "string" },
//   },
// };

// /** validate params and route them to ind1 / ind2 */
// function validateParams(input, ind1, ind2) {
//   const entries = parseParams(input);
//   const schema1 = indicatorSchemas[ind1] || {};
//   const schema2 = indicatorSchemas[ind2] || {};

//   const result1 = {},
//     result2 = {},
//     warnings = [];

//   for (const [key, rawVal] of Object.entries(entries)) {
//     const val = typeof rawVal === "string" ? rawVal.trim() : rawVal;
//     const schemaKey1 = schema1[key];
//     const schemaKey2 = schema2[key];

//     const validateValue = (schemaDef, v) => {
//       if (!schemaDef) return { valid: false };
//       if (schemaDef.type === "string") {
//         // accept any non-empty string
//         if (typeof v !== "string" || v.length === 0)
//           return { valid: false };
//         return { valid: true, value: v };
//       } else {
//         const num = Number(v);
//         if (Number.isNaN(num)) return { valid: false };
//         if (num < schemaDef.min || num > schemaDef.max)
//           return { valid: false };
//         return {
//           valid: true,
//           value: schemaDef.type === "int" ? Math.round(num) : num,
//         };
//       }
//     };

//     if (schemaKey1) {
//       const check = validateValue(schemaKey1, val);
//       if (!check.valid)
//         warnings.push(`${key} (${val}) invalid for ${ind1}, using default`);
//       else result1[key] = check.value;
//     } else if (schemaKey2) {
//       const check = validateValue(schemaKey2, val);
//       if (!check.valid)
//         warnings.push(`${key} (${val}) invalid for ${ind2}, using default`);
//       else result2[key] = check.value;
//     } else {
//       warnings.push(`${key} not recognized, ignored`);
//     }
//   }

//   // fill defaults for missing params
//   for (const [k, def] of Object.entries(schema1))
//     if (!(k in result1)) result1[k] = def.default;
//   for (const [k, def] of Object.entries(schema2))
//     if (!(k in result2)) result2[k] = def.default;

//   return { params1: result1, params2: result2, warnings };
// }

// /* ===========================================================
//    PARAMS VALIDATION LAYER END
// =========================================================== */

// export default function Home() {
//   const { resolvedTheme } = useTheme();
//   const dark = resolvedTheme === "dark";

//   const [chartData, setChartData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [formState, setFormState] = useState({
//     symbol: "BTCUSDT",
//     timeframe: "1d",
//     start: "",
//     end: "",
//     ind1: "EMA",
//     ind2: "SMA",
//     params: "n=14",
//     stop: "Stop-Loss: 3%",
//   });

//   const chartTitle = useMemo(() => {
//     const range =
//       formState.start && formState.end
//         ? `${formState.start} → ${formState.end}`
//         : "auto-range";
//     const sl = formState.stop.replace("Stop-Loss: ", "");
//     return `${formState.symbol} • ${formState.timeframe} • ${range} • ${formState.ind1} • ${sl} SL`;
//   }, [formState]);

//   async function fetchData(conf) {
//     setLoading(true);
//     setChartData(null);
//     try {
//       const res = await fetch("/api/fetch_data", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(conf),
//       });
//       const json = await res.json();
//       if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
//       if (!json?.data?.length) throw new Error("No rows returned");
//       const normalized = json.data.map((row) => ({
//         ...row,
//         open_time: new Date(
//           row.open_time?.value || row.open_time
//         ).toISOString(),
//         open: Number(row.open),
//         high: Number(row.high),
//         low: Number(row.low),
//         close: Number(row.close),
//         volume: Number(row.volume),
//       }));
//       setChartData(normalized);
//     } catch (err) {
//       console.error("Fetch failed:", err);
//       alert(`Fetch failed: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchData({
//       symbol: "BTCUSDT",
//       timeframe: "1d",
//       startDate: "",
//       endDate: "",
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   async function handleRun(e) {
//     e.preventDefault();
//     const t = e.currentTarget;

//     // validate indicator params before sending
//     const { params1, params2, warnings } = validateParams(
//       t.params.value,
//       t.ind1.value,
//       t.ind2.value
//     );
//     if (warnings.length) {
//       console.warn("[PARAM WARNINGS]", warnings);
//       alert("Some parameters were invalid or ignored:\n" + warnings.join("\n"));
//     }

//     const conf = {
//       symbol: t.symbol.value.trim().toUpperCase(),
//       timeframe: t.timeframe.value.trim().toLowerCase(),
//       startDate: t.start.value.trim(),
//       endDate: t.end.value.trim(),
//       indicators: [
//         { name: t.ind1.value, params: params1 },
//         { name: t.ind2.value, params: params2 },
//       ],
//     };

//     setFormState((s) => ({
//       ...s,
//       symbol: conf.symbol,
//       timeframe: conf.timeframe,
//       start: conf.startDate,
//       end: conf.endDate,
//       ind1: t.ind1.value,
//       ind2: t.ind2.value,
//       params: t.params.value,
//       stop: t.stop.value,
//     }));

//     await fetchData(conf);
//   }

//   const borderColor = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.2)";
//   const gridColor = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

//   return (
//     <main className="min-h-screen pt-24 px-6 bg-white text-black dark:bg-gradient-to-b dark:from-black dark:to-slate-950 dark:text-white transition-colors duration-300 opacity-80">
//       <BackgroundFX />

//       <div className="text-center mb-10">
//         <h1 className="text-4xl font-semibold mb-2">Research & Backtest</h1>
//         <p className="text-neutral-400">
//           Explore strategies, analyze performance, and visualize your results.
//         </p>
//       </div>

//       <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-10 items-stretch justify-between">
//         <div className="flex-1 max-w-[420px] dark:bg-white/5 rounded-2xl p-6 backdrop-blur-md border dark:border-white/10 flex flex-col">
//           <h2 className="text-lg font-semibold mb-4">Configuration</h2>

//           <form className="flex flex-col gap-4 flex-grow" onSubmit={handleRun}>
//             <input
//               name="symbol"
//               defaultValue={formState.symbol}
//               placeholder="Symbol (e.g. BTCUSDT)"
//               className="p-2 rounded bg-white border border-gray-300 text-gray-800 
//                          dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
//               required
//             />

//             <select
//               name="timeframe"
//               defaultValue={formState.timeframe}
//               className="p-2 rounded bg-white border border-gray-300 text-gray-800 
//                          dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
//             >
//               <option value="1d">1D</option>
//               <option value="1w">1W</option>
//               <option value="12h">12H</option>
//               <option disabled>6H 🔒</option>
//               <option disabled>4H 🔒</option>
//               <option disabled>2H 🔒</option>
//               <option disabled>1H 🔒</option>
//             </select>

//             <label className="text-sm text-neutral-400 mt-2">Indicators</label>

//             <select
//               name="ind1"
//               defaultValue={formState.ind1}
//               className="p-2 rounded bg-white border border-gray-300 text-gray-800 
//                          dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
//             >
//               <option>EMA</option>
//               <option>SMA</option>
//               <option>ADX</option>
//               <option>RSI</option>
//               <option>Donchian Channel</option>
//               <option disabled>Predictive Moving Average 🔒</option>
//               <option disabled>Kaufman Adaptive MA 🔒</option>
//             </select>

//             <select
//               name="ind2"
//               defaultValue={formState.ind2}
//               className="p-2 rounded bg-white border border-gray-300 text-gray-800 
//                          dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
//             >
//               <option>SMA</option>
//               <option>EMA</option>
//               <option>ADX</option>
//               <option>RSI</option>
//               <option>Donchian Channel</option>
//               <option disabled>Predictive Moving Average 🔒</option>
//               <option disabled>Kaufman Adaptive MA 🔒</option>
//             </select>

//             <select
//               disabled
//               className="p-2 rounded bg-neutral-200 border border-gray-300 text-gray-500 cursor-not-allowed
//                          dark:bg-neutral-800 dark:border-neutral-700 dark:text-gray-600"
//               title="Unlock premium indicators on paid plan"
//             >
//               <option>🔒 Unlock more indicators</option>
//             </select>

//             {/* ⬇️ Indicator Parameter Input */}
//             <div className="bg-white/10 dark:bg-neutral-800 rounded-md p-3 border border-white/10 text-sm">
//               <p className="text-neutral-400 mb-1">
//                 Refer indicator parameter to the Resources page! (e.g.{" "}
//                 <code>n=14, hp=48, alpha=0.5, source=ohlc4</code>)
//               </p>
//               <textarea
//                 name="params"
//                 defaultValue={formState.params}
//                 rows={2}
//                 className="w-full p-2 rounded bg-white border border-gray-300 text-gray-800 
//                            dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
//               />
//             </div>

//             <select
//               name="stop"
//               defaultValue={formState.stop}
//               className="p-2 rounded bg-white border border-gray-300 text-gray-800 
//                          dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
//             >
//               <option>Stop-Loss: 1%</option>
//               <option>Stop-Loss: 3%</option>
//               <option>Stop-Loss: 5%</option>
//               <option>Stop-Loss: 8%</option>
//               <option>Stop-Loss: 10%</option>
//               <option>Stop-Loss: ATR × 1.5</option>
//               <option>Stop-Loss: ATR × 2.0</option>
//               <option>Stop-Loss: ATR × 2.5</option>
//               <option>Stop-Loss: ATR × 3.0</option>
//             </select>

//             <div className="flex gap-2">
//               <input
//                 name="start"
//                 defaultValue={formState.start}
//                 placeholder="Start YYYY-MM-DD"
//                 className="w-1/2 p-2 rounded bg-white border border-gray-300 text-gray-800 
//                            dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
//               />
//               <input
//                 name="end"
//                 defaultValue={formState.end}
//                 placeholder="End YYYY-MM-DD"
//                 className="w-1/2 p-2 rounded bg-white border border-gray-300 text-gray-800 
//                            dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
//               />
//             </div>

//             <button
//               type="submit"
//               className="mt-1 bg-gradient-to-r from-teal-400 to-cyan-500 text-black font-semibold py-2 rounded-md hover:opacity-90 transition"
//             >
//               {loading ? "Loading..." : "Run Backtest"}
//             </button>
//           </form>
//         </div>

//         <div className="flex-[1.4] dark:bg-white/5 rounded-2xl p-6 backdrop-blur-md border dark:border-white/10 flex flex-col justify-between">
//           <div className="text-neutral-300 dark:text-neutral-400 mb-3 text-sm text-center">
//             {chartTitle}
//           </div>

//           <div
//             className={`flex-grow rounded-lg border ${
//               dark ? "border-white/10" : "border-gray-300"
//             } flex items-center justify-center text-neutral-400`}
//           >
//             {!chartData ? (
//               loading ? (
//                 <span className="text-sm text-neutral-400">Fetching data...</span>
//               ) : (
//                 "[ Candlestick / Indicator Chart Placeholder ]"
//               )
//             ) : (
//               <Plot
//                 data={[
//                   {
//                     x: chartData.map((d) => d.open_time),
//                     open: chartData.map((d) => d.open),
//                     high: chartData.map((d) => d.high),
//                     low: chartData.map((d) => d.low),
//                     close: chartData.map((d) => d.close),
//                     type: "candlestick",
//                     increasing: { line: { color: "#00bfa6" } },
//                     decreasing: { line: { color: "#ff4d4f" } },
//                   },
//                 ]}
//                 layout={{
//                   autosize: true,
//                   margin: { l: 40, r: 20, t: 10, b: 40 },
//                   paper_bgcolor: "transparent",
//                   plot_bgcolor: "transparent",
//                   xaxis: {
//                     rangeslider: { visible: false },
//                     gridcolor: gridColor,
//                     linecolor: borderColor,
//                     zerolinecolor: gridColor,
//                   },
//                   yaxis: {
//                     fixedrange: false,
//                     gridcolor: gridColor,
//                     linecolor: borderColor,
//                     zerolinecolor: gridColor,
//                   },
//                   font: { color: dark ? "#e5e5e5" : "#111" },
//                 }}
//                 style={{ width: "100%", height: "600px" }}
//                 config={{ responsive: true, displayModeBar: false }}
//               />
//             )}
//           </div>
//         </div>
//       </div>

//       <section className="max-w-[1600px] mx-auto mt-10 dark:bg-white/5 rounded-2xl backdrop-blur-md border dark:border-white/10 flex flex-col lg:flex-row overflow-hidden">
//         <div className="flex-1 dark:border-b lg:border-b-0 lg:border-r dark:border-white/10 p-6">
//           <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
//           <div className="grid grid-cols-2 gap-x-2 gap-y-10 text-center">
//             <div>
//               <p className="text-neutral-400 text-sm">PnL</p>
//               <p className="text-xl font-semibold text-teal-400">+1 114 USD</p>
//             </div>
//             <div>
//               <p className="text-neutral-400 text-sm">Total Trades</p>
//               <p className="text-xl font-semibold text-teal-400">142</p>
//             </div>
//             <div>
//               <p className="text-neutral-400 text-sm">Long</p>
//               <p className="text-xl font-semibold text-teal-400">20x</p>
//             </div>
//             <div>
//               <p className="text-neutral-400 text-sm">Short</p>
//               <p className="text-xl font-semibold text-teal-400">14x</p>
//             </div>
//             <div>
//               <p className="text-neutral-400 text-sm">Sharpe</p>
//               <p className="text-xl font-semibold text-teal-400">1.78</p>
//             </div>
//             <div>
//               <p className="text-neutral-400 text-sm">Profit Factor</p>
//               <p className="text-xl font-semibold text-teal-400">1.4</p>
//             </div>
//             <div>
//               <p className="text-neutral-400 text-sm">Max DD</p>
//               <p className="text-xl font-semibold text-teal-400">-25.6 %</p>
//             </div>
//             <div>
//               <p className="text-neutral-400 text-sm">Win Rate</p>
//               <p className="text-xl font-semibold text-teal-400">62 %</p>
//             </div>
//             <div>
//               <p className="text-neutral-400 text-sm">Buy & Hold</p>
//               <p className="text-xl font-semibold text-teal-400">142 %</p>
//             </div>
//             <div>
//               <p className="text-neutral-400 text-sm">SL Hits</p>
//               <p className="text-xl font-semibold text-teal-400">5×</p>
//             </div>
//           </div>
//         </div>

//         <div className="flex-[2.8] p-6 flex items-center justify-center">
//           <div className="w-full h-[480px] rounded-lg border dark:border-white/10 flex items-center justify-center text-neutral-400">
//             [ Equity Curve Chart Placeholder ]
//           </div>
//         </div>
//       </section>

//       <footer className="mt-16 text-center text-sm text-neutral-500 pb-8">
//         © {new Date().getFullYear()} ApexQuantLabs — Built for systematic traders.
//       </footer>
//     </main>
//   );
// }



"use client";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import BackgroundFX from "./components/BackgroundFX";

const Plot = dynamic(() => import("react-plotly.js").then((m) => m.default), {
  ssr: false,
});

/** parse "n=14, hp=48, alpha=0.5" -> { n:14, hp:48, alpha:0.5 } */
function parseParams(s) {
  if (!s) return {};
  return s
    .split(/[,\n]/)
    .map((x) => x.trim())
    .filter(Boolean)
    .reduce((acc, kv) => {
      const [k, v] = kv.split("=").map((t) => t.trim());
      if (!k) return acc;
      const num = Number(v);
      acc[k] = Number.isNaN(num) ? v : num;
      return acc;
    }, {});
}

/* ===========================================================
   ⬇️ PARAM VALIDATION LAYER (typed) + helpers
=========================================================== */

const indicatorSchemas = {
  SMA: {
    n_sma: { default: 14, type: "int", min: 1, max: 500 },
    source_sma: { default: "close", type: "string" }, // close|open|hl2|hlc3|ohlc4
  },
  EMA: {
    n_ema: { default: 14, type: "int", min: 1, max: 500 },
    alpha: { default: 0.5, type: "float", min: 0, max: 1 },
    source_ema: { default: "close", type: "string" },
  },
  ADX: {
    n_adx: { default: 14, type: "int", min: 1, max: 500 },
    threshold_adx: { default: 20, type: "float", min: 0, max: 100 },
  },
  RSI: {
    n_rsi: { default: 14, type: "int", min: 1, max: 500 },
    source_rsi: { default: "close", type: "string" },
  },
  "Donchian Channel": {
    n_dc: { default: 20, type: "int", min: 1, max: 500 },
    source_dc: { default: "close", type: "string" },
  },
};

function validateParams(input, ind1, ind2) {
  const entries = parseParams(input);
  const schema1 = indicatorSchemas[ind1] || {};
  const schema2 = indicatorSchemas[ind2] || {};

  const result1 = {};
  const result2 = {};
  const warnings = [];

  const validateValue = (schemaDef, rawVal) => {
    if (!schemaDef) return { valid: false };
    const v = typeof rawVal === "string" ? rawVal.trim() : rawVal;

    if (schemaDef.type === "string") {
      if (typeof v !== "string" || v.length === 0) return { valid: false };
      return { valid: true, value: v };
    }

    const num = Number(v);
    if (Number.isNaN(num)) return { valid: false };
    if (num < schemaDef.min || num > schemaDef.max) return { valid: false };
    return {
      valid: true,
      value: schemaDef.type === "int" ? Math.round(num) : num,
    };
  };

  for (const [key, rawVal] of Object.entries(entries)) {
    const schemaKey1 = schema1[key];
    const schemaKey2 = schema2[key];

    if (schemaKey1) {
      const check = validateValue(schemaKey1, rawVal);
      if (!check.valid)
        warnings.push(`${key} (${rawVal}) invalid for ${ind1}, using default`);
      else result1[key] = check.value;
    } else if (schemaKey2) {
      const check = validateValue(schemaKey2, rawVal);
      if (!check.valid)
        warnings.push(`${key} (${rawVal}) invalid for ${ind2}, using default`);
      else result2[key] = check.value;
    } else {
      warnings.push(`${key} not recognized, ignored`);
    }
  }

  for (const [k, def] of Object.entries(schema1))
    if (!(k in result1)) result1[k] = def.default;
  for (const [k, def] of Object.entries(schema2))
    if (!(k in result2)) result2[k] = def.default;

  return { params1: result1, params2: result2, warnings };
}

/* ====== Backtest helpers (SMA/EMA + metrics) ====== */

function barsPerYear(tf) {
  switch (tf) {
    case "1h": return 24 * 365;
    case "2h": return 12 * 365;
    case "4h": return 6 * 365;
    case "6h": return 4 * 365;
    case "12h": return 2 * 365;
    case "1w": return 52;
    case "1d":
    default: return 252;
  }
}

function pickPrice(row, src = "close") {
  const c = Number(row.close), o = Number(row.open), h = Number(row.high), l = Number(row.low);
  switch (String(src || "close").toLowerCase()) {
    case "open": return o;
    case "hl2": return (h + l) / 2;
    case "hlc3": return (h + l + c) / 3;
    case "ohlc4": return (o + h + l + c) / 4;
    case "close":
    default: return c;
  }
}

function SMA(arr, n) {
  const out = new Array(arr.length).fill(undefined);
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    if (i >= n) sum -= arr[i - n];
    if (i >= n - 1) out[i] = sum / n;
  }
  return out;
}

function EMA(arr, n, alphaOpt) {
  const out = new Array(arr.length).fill(undefined);
  const alpha = typeof alphaOpt === "number" ? alphaOpt : 2 / (n + 1);
  let prev;
  for (let i = 0; i < arr.length; i++) {
    const x = arr[i];
    prev = i === 0 ? x : alpha * x + (1 - alpha) * prev;
    out[i] = i < n - 1 ? undefined : prev;
  }
  return out;
}

function toPct(x) { return (x * 100).toFixed(2) + " %"; }
function fmt(x, d = 2) { return Number(x).toFixed(d); }

/** ⬇️ UPDATED: returns { equity, metrics, indicator, markers } */
function backtestMA(data, tf, maType, maParams, stopLossText) {
  const source = maType === "EMA" ? (maParams.source_ema || "close") : (maParams.source_sma || "close");
  const n = maType === "EMA" ? (maParams.n_ema || 14) : (maParams.n_sma || 14);
  const alpha = maType === "EMA" ? maParams.alpha : undefined;

  const price = data.map((r) => pickPrice(r, source));
  const closeArr = data.map((r) => Number(r.close));
  const ma = maType === "EMA" ? EMA(price, n, alpha) : SMA(price, n);

  let slPct = null;
  if (stopLossText && stopLossText.includes("%")) {
    const m = stopLossText.match(/(\d+(\.\d+)?)%/);
    if (m) slPct = Number(m[1]) / 100;
  }

  const nBars = data.length;
  if (nBars < n + 2) return { equity: [], metrics: null, indicator: [], markers: [] };

  const ret = new Array(nBars).fill(0);
  for (let i = 1; i < nBars; i++) ret[i] = price[i] / price[i - 1] - 1;

  let position = 0;
  let prevSignal = 0;
  let entryPx = null;
  const stratRet = new Array(nBars).fill(0);
  const equity = new Array(nBars).fill(1);
  const trades = [];
  const markers = [];

  let inTrade = false;
  let slHits = 0;

  for (let i = 1; i < nBars; i++) {
    const sig = ma[i] !== undefined ? (price[i] > ma[i] ? 1 : 0) : 0;
    let stopExit = false;

    if (position === 1 && slPct != null && entryPx != null) {
      if (price[i] <= entryPx * (1 - slPct)) {
        stopExit = true;
        slHits++;
      }
    }

    if (position === 0 && sig === 1 && prevSignal === 0) {
      position = 1;
      entryPx = price[i];
      inTrade = true;
      trades.push({ entry: price[i], exit: null, pnl: null });
      markers.push({ time: data[i].open_time, type: "entry", price: closeArr[i] });
    } else if ((position === 1 && sig === 0 && prevSignal === 1) || stopExit) {
      position = 0;
      const last = trades[trades.length - 1];
      if (last && last.exit === null) {
        last.exit = price[i];
        last.pnl = last.exit / last.entry - 1;
      }
      inTrade = false;
      entryPx = null;
      markers.push({ time: data[i].open_time, type: "exit", price: closeArr[i] });
    }

    stratRet[i] = ret[i] * (position === 1 ? 1 : 0);
    equity[i] = equity[i - 1] * (1 + stratRet[i]);
    prevSignal = sig;
  }

  if (inTrade) {
    const last = trades[trades.length - 1];
    if (last && last.exit === null) {
      last.exit = price[nBars - 1];
      last.pnl = last.exit / last.entry - 1;
    }
  }

  const hold = price[nBars - 1] / price[0] - 1;
  const mu = stratRet.reduce((a, b) => a + b, 0) / stratRet.length;
  const sd = Math.sqrt(stratRet.reduce((s, x) => s + Math.pow(x - mu, 2), 0) / Math.max(1, stratRet.length - 1));
  const ann = Math.sqrt(barsPerYear(tf));
  const sharpe = sd === 0 ? 0 : (mu / sd) * ann;

  let peak = equity[0], maxDD = 0;
  for (let i = 0; i < equity.length; i++) {
    peak = Math.max(peak, equity[i]);
    const dd = equity[i] / peak - 1;
    if (dd < maxDD) maxDD = dd;
  }

  const closed = trades.filter((t) => t.pnl !== null);
  const wins = closed.filter((t) => t.pnl > 0);
  const sumWin = wins.reduce((s, t) => s + t.pnl, 0);
  const sumLoss = closed.filter((t) => t.pnl < 0).reduce((s, t) => s + Math.abs(t.pnl), 0);
  const pf = sumLoss === 0 ? (sumWin > 0 ? Infinity : 0) : sumWin / sumLoss;

  const metrics = {
    pnlPct: toPct(equity[equity.length - 1] - 1),
    totalTrades: closed.length,
    winRate: toPct(closed.length ? wins.length / closed.length : 0),
    sharpe: fmt(sharpe, 2),
    profitFactor: pf === Infinity ? "∞" : fmt(pf, 2),
    maxDD: toPct(maxDD),
    buyHold: toPct(hold),
    slHits,
  };

  const eqSeries = data.map((d, i) => ({ x: d.open_time, y: equity[i] }));
  const indicator = data.map((d, i) => ({ x: d.open_time, y: ma[i] ?? null }));

  return { equity: eqSeries, metrics, indicator, markers };
}

/* ===========================================================
   ⬆️ PARAM VALIDATION LAYER END
=========================================================== */

export default function Home() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  // NEW
  const [equity, setEquity] = useState(null);
  const [perf, setPerf] = useState(null);
  const [indLine, setIndLine] = useState(null);   // [{x,y}]
  const [markers, setMarkers] = useState(null);   // [{time, type, price}]

  const [formState, setFormState] = useState({
    symbol: "BTCUSDT",
    timeframe: "1d",
    start: "",
    end: "",
    ind1: "EMA",
    ind2: "SMA",
    params: "n=14",
    stop: "Stop-Loss: 3%",
  });

  const chartTitle = useMemo(() => {
    const range =
      formState.start && formState.end
        ? `${formState.start} → ${formState.end}`
        : "auto-range";
    const sl = formState.stop.replace("Stop-Loss: ", "");
    return `${formState.symbol} • ${formState.timeframe} • ${range} • ${formState.ind1} • ${sl} SL`;
  }, [formState]);

  async function fetchData(conf) {
    setLoading(true);
    setChartData(null);
    setEquity(null);
    setPerf(null);
    setIndLine(null);
    setMarkers(null);
    try {
      const res = await fetch("/api/fetch_data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(conf),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
      if (!json?.data?.length) throw new Error("No rows returned");
      const normalized = json.data.map((row) => ({
        ...row,
        open_time: new Date(row.open_time?.value || row.open_time).toISOString(),
        open: Number(row.open),
        high: Number(row.high),
        low: Number(row.low),
        close: Number(row.close),
        volume: Number(row.volume),
      }));
      setChartData(normalized);
      return normalized;
    } catch (err) {
      console.error("Fetch failed:", err);
      alert(`Fetch failed: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // auto-load default BTCUSDT 1d
  useEffect(() => {
    (async () => {
      const rows = await fetchData({
        symbol: "BTCUSDT",
        timeframe: "1d",
        startDate: "",
        endDate: "",
      });
      if (!rows) return;

      const { params1 } = validateParams(formState.params, formState.ind1, formState.ind2);
      if (["SMA", "EMA"].includes(formState.ind1)) {
        const { equity: eq, metrics, indicator, markers } = backtestMA(
          rows,
          formState.timeframe,
          formState.ind1,
          params1,
          formState.stop
        );
        setEquity(eq);
        setPerf(metrics);
        setIndLine(indicator);
        setMarkers(markers);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleRun(e) {
    e.preventDefault();
    const t = e.currentTarget;

    const { params1, params2, warnings } = validateParams(
      t.params.value,
      t.ind1.value,
      t.ind2.value
    );
    if (warnings.length) {
      console.warn("[PARAM WARNINGS]", warnings);
      alert("Some parameters were invalid or ignored:\n" + warnings.join("\n"));
    }

    const conf = {
      symbol: t.symbol.value.trim().toUpperCase(),
      timeframe: t.timeframe.value.trim().toLowerCase(),
      startDate: t.start.value.trim(),
      endDate: t.end.value.trim(),
      indicators: [
        { name: t.ind1.value, params: params1 },
        { name: t.ind2.value, params: params2 },
      ],
    };

    setFormState((s) => ({
      ...s,
      symbol: conf.symbol,
      timeframe: conf.timeframe,
      start: conf.startDate,
      end: conf.endDate,
      ind1: t.ind1.value,
      ind2: t.ind2.value,
      params: t.params.value,
      stop: t.stop.value,
    }));

    const rows = await fetchData(conf);
    if (!rows) return;

    if (["SMA", "EMA"].includes(t.ind1.value)) {
      const { equity: eq, metrics, indicator, markers } = backtestMA(
        rows,
        conf.timeframe,
        t.ind1.value,
        params1,
        t.stop.value
      );
      setEquity(eq);
      setPerf(metrics);
      setIndLine(indicator);
      setMarkers(markers);
    } else {
      setEquity(null);
      setPerf(null);
      setIndLine(null);
      setMarkers(null);
    }
  }

  const borderColor = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.2)";
  const gridColor = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  // marker arrays for plot
  const entryX = markers?.filter(m => m.type === "entry").map(m => m.time) ?? [];
  const entryY = markers?.filter(m => m.type === "entry").map(m => m.price) ?? [];
  const exitX  = markers?.filter(m => m.type === "exit").map(m => m.time) ?? [];
  const exitY  = markers?.filter(m => m.type === "exit").map(m => m.price) ?? [];

  return (
    <main className="min-h-screen pt-24 px-6 bg-white text-black dark:bg-gradient-to-b dark:from-black dark:to-slate-950 dark:text-white transition-colors duration-300 opacity-80">
      <BackgroundFX />

      {/* ---------- HEADER ---------- */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold mb-2">Research & Backtest</h1>
        <p className="text-neutral-400">
          Explore strategies, analyze performance, and visualize your results.
        </p>
      </div>

      {/* ---------- MAIN FLEX ---------- */}
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-10 items-stretch justify-between">
        {/* LEFT — CONFIGURATION */}
        <div className="flex-1 max-w-[420px] dark:bg-white/5 rounded-2xl p-6 backdrop-blur-md border dark:border-white/10 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Configuration</h2>

          <form className="flex flex-col gap-4 flex-grow" onSubmit={handleRun}>
            {/* Symbol */}
            <input
              name="symbol"
              defaultValue={formState.symbol}
              placeholder="Symbol (e.g. BTCUSDT)"
              className="p-2 rounded bg-white border border-gray-300 text-gray-800 
                         dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              required
            />

            {/* Timeframe */}
            <select
              name="timeframe"
              defaultValue={formState.timeframe}
              className="p-2 rounded bg-white border border-gray-300 text-gray-800 
                         dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            >
              <option value="1d">1D</option>
              <option value="1w">1W</option>
              <option value="12h">12H</option>
              <option disabled>6H 🔒</option>
              <option disabled>4H 🔒</option>
              <option disabled>2H 🔒</option>
              <option disabled>1H 🔒</option>
            </select>

            <label className="text-sm text-neutral-400 mt-2">Indicators</label>

            {/* Indicator 1 */}
            <select
              name="ind1"
              defaultValue={formState.ind1}
              className="p-2 rounded bg-white border border-gray-300 text-gray-800 
                         dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            >
              <option>EMA</option>
              <option>SMA</option>
              <option>ADX</option>
              <option>RSI</option>
              <option>Donchian Channel</option>
              <option disabled>Predictive Moving Average 🔒</option>
              <option disabled>Kaufman Adaptive MA 🔒</option>
            </select>

            {/* Indicator 2 */}
            <select
              name="ind2"
              defaultValue={formState.ind2}
              className="p-2 rounded bg-white border border-gray-300 text-gray-800 
                         dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            >
              <option>SMA</option>
              <option>EMA</option>
              <option>ADX</option>
              <option>RSI</option>
              <option>Donchian Channel</option>
              <option disabled>Predictive Moving Average 🔒</option>
              <option disabled>Kaufman Adaptive MA 🔒</option>
            </select>

            {/* Locked premium slot */}
            <select
              disabled
              className="p-2 rounded bg-neutral-200 border border-gray-300 text-gray-500 cursor-not-allowed
                         dark:bg-neutral-800 dark:border-neutral-700 dark:text-gray-600"
              title="Unlock premium indicators on paid plan"
            >
              <option>🔒 Unlock more indicators</option>
            </select>

            {/* Indicator Parameter Input */}
            <div className="bg-white/10 dark:bg-neutral-800 rounded-md p-3 border border-white/10 text-sm">
              <p className="text-neutral-400 mb-1">
                Refer indicator parameter to the Resources page! (e.g.{" "}
                <code>n=14, hp=48, alpha=0.5, source_sma=ohlc4</code>)
              </p>
              <textarea
                name="params"
                defaultValue={formState.params}
                rows={2}
                className="w-full p-2 rounded bg-white border border-gray-300 text-gray-800 
                           dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              />
            </div>

            {/* Stop-loss */}
            <select
              name="stop"
              defaultValue={formState.stop}
              className="p-2 rounded bg-white border border-gray-300 text-gray-800 
                         dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            >
              <option>Stop-Loss: 1%</option>
              <option>Stop-Loss: 3%</option>
              <option>Stop-Loss: 5%</option>
              <option>Stop-Loss: 8%</option>
              <option>Stop-Loss: 10%</option>
              <option>Stop-Loss: ATR × 1.5</option>
              <option>Stop-Loss: ATR × 2.0</option>
              <option>Stop-Loss: ATR × 2.5</option>
              <option>Stop-Loss: ATR × 3.0</option>
            </select>

            {/* Dates */}
            <div className="flex gap-2">
              <input
                name="start"
                defaultValue={formState.start}
                placeholder="Start YYYY-MM-DD"
                className="w-1/2 p-2 rounded bg-white border border-gray-300 text-gray-800 
                           dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              />
              <input
                name="end"
                defaultValue={formState.end}
                placeholder="End YYYY-MM-DD"
                className="w-1/2 p-2 rounded bg-white border border-gray-300 text-gray-800 
                           dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="mt-1 bg-gradient-to-r from-teal-400 to-cyan-500 text-black font-semibold py-2 rounded-md hover:opacity-90 transition"
            >
              {loading ? "Loading..." : "Run Backtest"}
            </button>
          </form>
        </div>

        {/* RIGHT — CHART (candles + overlay + markers) */}
        <div className="flex-[1.4] dark:bg-white/5 rounded-2xl p-6 backdrop-blur-md border dark:border-white/10 flex flex-col justify-between">
          <div className="text-neutral-300 dark:text-neutral-400 mb-3 text-sm text-center">
            {chartTitle}
          </div>

          <div
            className={`flex-grow rounded-lg border ${
              dark ? "border-white/10" : "border-gray-300"
            } flex items-center justify-center text-neutral-400`}
          >
            {!chartData ? (
              loading ? (
                <span className="text-sm text-neutral-400">Fetching data...</span>
              ) : (
                "[ Candlestick / Indicator Chart Placeholder ]"
              )
            ) : (
              <Plot
                data={[
                  // Candles
                  {
                    x: chartData.map((d) => d.open_time),
                    open: chartData.map((d) => d.open),
                    high: chartData.map((d) => d.high),
                    low: chartData.map((d) => d.low),
                    close: chartData.map((d) => d.close),
                    type: "candlestick",
                    increasing: { line: { color: "#00bfa6" } },
                    decreasing: { line: { color: "#ff4d4f" } },
                    name: "Price",
                  },
                  // Indicator overlay (SMA/EMA)
                  ...(indLine && indLine.length
                    ? [{
                        x: indLine.map((p) => p.x),
                        y: indLine.map((p) => p.y),
                        type: "scatter",
                        mode: "lines",
                        line: { width: 1.6, color: "#facc15" }, // amber-400
                        name: formState.ind1,
                        hoverinfo: "none",
                      }]
                    : []),
                  // Entries ▲
                  ...(entryX.length
                    ? [{
                        x: entryX,
                        y: entryY,
                        type: "scatter",
                        mode: "markers",
                        marker: { symbol: "triangle-up", size: 10 },
                        name: "Entry",
                      }]
                    : []),
                  // Exits ▼
                  ...(exitX.length
                    ? [{
                        x: exitX,
                        y: exitY,
                        type: "scatter",
                        mode: "markers",
                        marker: { symbol: "triangle-down", size: 10 },
                        name: "Exit",
                      }]
                    : []),
                ]}
                layout={{
                  autosize: true,
                  margin: { l: 40, r: 20, t: 10, b: 40 },
                  paper_bgcolor: "transparent",
                  plot_bgcolor: "transparent",
                  xaxis: {
                    rangeslider: { visible: false },
                    gridcolor: gridColor,
                    linecolor: borderColor,
                    zerolinecolor: gridColor,
                  },
                  yaxis: {
                    fixedrange: false,
                    gridcolor: gridColor,
                    linecolor: borderColor,
                    zerolinecolor: gridColor,
                  },
                  font: { color: dark ? "#e5e5e5" : "#111" },
                  showlegend: true,
                  legend: { orientation: "h", x: 0, y: 1.02 },
                }}
                style={{ width: "100%", height: "600px" }}
                config={{ responsive: true, displayModeBar: false }}
              />
            )}
          </div>
        </div>
      </div>

      {/* ---------- RESULTS SECTION ---------- */}
      <section className="max-w-[1600px] mx-auto mt-10 dark:bg-white/5 rounded-2xl backdrop-blur-md border dark:border-white/10 flex flex-col lg:flex-row overflow-hidden">
        {/* PERFORMANCE TABLE */}
        <div className="flex-1 dark:border-b lg:border-b-0 lg:border-r dark:border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
          {!perf ? (
            <div className="text-neutral-400 text-sm">Run a backtest to populate metrics…</div>
          ) : (
            <div className="grid grid-cols-2 gap-x-2 gap-y-10 text-center">
              <div><p className="text-neutral-400 text-sm">PnL</p><p className="text-xl font-semibold text-teal-400">{perf.pnlPct}</p></div>
              <div><p className="text-neutral-400 text-sm">Total Trades</p><p className="text-xl font-semibold text-teal-400">{perf.totalTrades}</p></div>
              <div><p className="text-neutral-400 text-sm">Win Rate</p><p className="text-xl font-semibold text-teal-400">{perf.winRate}</p></div>
              <div><p className="text-neutral-400 text-sm">Sharpe</p><p className="text-xl font-semibold text-teal-400">{perf.sharpe}</p></div>
              <div><p className="text-neutral-400 text-sm">Profit Factor</p><p className="text-xl font-semibold text-teal-400">{perf.profitFactor}</p></div>
              <div><p className="text-neutral-400 text-sm">Max DD</p><p className="text-xl font-semibold text-teal-400">{perf.maxDD}</p></div>
              <div><p className="text-neutral-400 text-sm">Buy & Hold</p><p className="text-xl font-semibold text-teal-400">{perf.buyHold}</p></div>
              <div><p className="text-neutral-400 text-sm">SL Hits</p><p className="text-xl font-semibold text-teal-400">{perf.slHits}</p></div>
            </div>
          )}
        </div>

        {/* EQUITY CURVE */}
        <div className="flex-[2.8] p-6 flex items-center justify-center">
          <div className="w-full h-[480px] rounded-lg border dark:border-white/10 flex items-center justify-center text-neutral-400">
            {!equity ? (
              "[ Equity Curve Chart Placeholder ]"
            ) : (
              <Plot
                data={[
                  {
                    x: equity.map((p) => p.x),
                    y: equity.map((p) => p.y),
                    type: "scatter",
                    mode: "lines",
                  },
                ]}
                layout={{
                  autosize: true,
                  margin: { l: 50, r: 20, t: 10, b: 40 },
                  paper_bgcolor: "transparent",
                  plot_bgcolor: "transparent",
                  xaxis: { gridcolor: gridColor, linecolor: borderColor, zerolinecolor: gridColor },
                  yaxis: { gridcolor: gridColor, linecolor: borderColor, zerolinecolor: gridColor },
                  font: { color: dark ? "#e5e5e5" : "#111" },
                }}
                style={{ width: "100%", height: "100%" }}
                config={{ responsive: true, displayModeBar: false }}
              />
            )}
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="mt-16 text-center text-sm text-neutral-500 pb-8">
        © {new Date().getFullYear()} ApexQuantLabs — Built for systematic traders.
      </footer>
    </main>
  );
}

