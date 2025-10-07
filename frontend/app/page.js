// "use client";
// import { useTheme } from "next-themes";

// export default function Home() {
//   const { resolvedTheme } = useTheme();
//   const dark = resolvedTheme === "dark";

//   return (
//     <main className="min-h-screen pt-24 px-6 bg-white text-black dark:bg-gradient-to-b dark:from-black dark:to-slate-950 dark:text-white transition-colors duration-300">
//       {/* ---------- HEADER ---------- */}
//       <div className="text-center mb-10">
//         <h1 className="text-4xl font-semibold mb-2">Research & Backtest</h1>
//         <p className="text-neutral-400">
//           Explore strategies, analyze performance, and visualize your results.
//         </p>
//       </div>

//       {/* ---------- MAIN GRID ---------- */}
//       { /*<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10"> */}
//       <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-10 items-start justify-between">
//         {/* LEFT — CONFIGURATION */}
//         {/*<div className="lg:col-span-1 bg-white/5 rounded-2xl p-6 backdrop-blur-md border border-white/10 lg:ml-6"> */}
//         <div className="flex-1 max-w-[420px] bg-white/5 rounded-2xl p-6 backdrop-blur-md border border-white/10">
//           <h2 className="text-lg font-semibold mb-4">Configuration</h2>

//           <form className="flex flex-col gap-4">
//             {/* Symbol */}
//             <input
//               placeholder="Symbol (e.g. BTCUSDT)"
//               className="p-2 rounded bg-white border border-gray-300 text-gray-800 
//                          dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
//             />

//             {/* Timeframe */}
//             <select className="p-2 rounded bg-white border border-gray-300 text-gray-800 
//                               dark:bg-neutral-900 dark:border-neutral-700 dark:text-white">
//               <option>1D</option>
//               <option>1W</option>
//               <option>12H</option>
//               <option>6H</option>
//               <option>4H 🏷️</option>
//               <option>2H 🏷️</option>
//               <option>1H 🏷️</option>
//             </select>

//             {/* Indicators — tiered access */}
//             <label className="text-sm text-neutral-400 mt-2">Indicators</label>

//             {/* 1st Indicator (Free) */}
//             <select className="p-2 rounded bg-white border border-gray-300 text-gray-800 
//                               dark:bg-neutral-900 dark:border-neutral-700 dark:text-white">
//               <option>EMA</option>
//               <option>SMA</option>
//               <option>ADX</option>
//               <option>RSI</option>
//               <option>Donchian Channel</option>
//             </select>

//             {/* 2nd Indicator (Free) */}
//             <select className="p-2 rounded bg-white border border-gray-300 text-gray-800 
//                               dark:bg-neutral-900 dark:border-neutral-700 dark:text-white">
//               <option>EMA</option>
//               <option>SMA</option>
//               <option>ADX</option>
//               <option>RSI</option>
//               <option>Donchian Channel</option>
//             </select>

//             {/* 3rd Indicator (Paid) */}
//             <select
//               disabled
//               className="p-2 rounded bg-neutral-200 border border-gray-300 text-gray-500 cursor-not-allowed
//                          dark:bg-neutral-800 dark:border-neutral-700 dark:text-gray-600"
//             >
//               <option>🔒 Unlock premium indicators</option>
//             </select>

//             {/* Indicator Parameters */}
//             <div className="bg-white/10 dark:bg-neutral-800 rounded-md p-3 border border-white/10 text-sm">
//               <p className="text-neutral-400 mb-1">Indicator Parameters</p>
//               <input
//                 placeholder="alpha = ..."
//                 className="w-full p-2 mb-2 rounded bg-white border border-gray-300 text-gray-800 
//                            dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
//               />
//               <input
//                 placeholder="n = ..."
//                 className="w-full p-2 mb-2 rounded bg-white border border-gray-300 text-gray-800 
//                            dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
//               />
//               <input
//                 placeholder="high-pass period = ..."
//                 className="w-full p-2 rounded bg-white border border-gray-300 text-gray-800 
//                            dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
//               />
//             </div>

//             {/* Stop-loss type */}
//             <select className="p-2 rounded bg-white border border-gray-300 text-gray-800 
//                               dark:bg-neutral-900 dark:border-neutral-700 dark:text-white">
//               <option>Stop-Loss: 3%</option>
//               <option>Stop-Loss: 5%</option>
//               <option>Stop-Loss: ATR × 1.5</option>
//               <option>Stop-Loss: ATR × 2.0</option>
//             </select>

//             {/* Date range (condensed) */}
//             <div className="flex gap-2">
//               <input
//                 placeholder="Start (e.g. 2018-01-01)"
//                 className="w-1/2 p-2 rounded bg-white border border-gray-300 text-gray-800 
//                            dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
//               />
//               <input
//                 placeholder="End (e.g. 2024-12-31)"
//                 className="w-1/2 p-2 rounded bg-white border border-gray-300 text-gray-800 
//                            dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
//               />
//             </div>

//             {/* Run Button */}
//             <button className="mt-1 bg-gradient-to-r from-teal-400 to-cyan-500 text-black font-semibold py-2 rounded-md hover:opacity-90 transition">
//               Run Backtest
//             </button>
//           </form>
//         </div>

//         {/* RIGHT — CHART */}
//         { /*<div className="lg:col-span-2 bg-white/5 rounded-2xl p-6 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center"> */}
//         <div className="flex-[1.4] bg-white/5 rounded-2xl p-6 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center">
//           <div className="text-neutral-400 mb-4 text-sm">
//             Symbol × Timeframe × Indicator(s)
//           </div>

//           <div
//             className={`w-full h-[590px] lg:h-[620px] xl:h-[620px] rounded-lg border ${
//               dark ? "border-white/10" : "border-gray-300"
//             } flex items-center justify-center text-neutral-400`}
//             style={{ maxWidth: "100%" }}
//           >
//             [ Candlestick / Indicator Chart Placeholder ]
//           </div>
//         </div>
//       </div>

//       {/* ---------- PERFORMANCE + EQUITY ---------- */}
//       <div className="max-w-7xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
//         {/* PERFORMANCE TABLE */}
//         <div className="bg-white border border-gray-300 
//                         dark:bg-white/5 dark:border-white/10 backdrop-blur-md 
//                         rounded-2xl p-6 lg:ml-6">
//           <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
//           <div className="grid grid-cols-2 gap-y-4 text-center">
//             <div>
//               <p className="text-neutral-400 text-sm">PnL</p>
//               <p className="text-xl font-semibold text-teal-400">+1 114 USD</p>
//             </div>
//             <div>
//               <p className="text-neutral-400 text-sm">Total Trades</p>
//               <p className="text-xl font-semibold text-teal-400">142</p>
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

//         {/* EQUITY CURVE */}
//         <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-md border border-white/10 flex items-center justify-center">
//           <div className="text-neutral-400">[ Equity Curve Chart Placeholder ]</div>
//         </div>
//       </div>

//       {/* ---------- FOOTER ---------- */}
//       <footer className="mt-16 text-center text-sm text-neutral-500 pb-8">
//         © {new Date().getFullYear()} ApexQuantLabs — Built for systematic traders.
//       </footer>
//     </main>
//   );
// }


"use client";
import { useTheme } from "next-themes";
import BackgroundFX from "./components/BackgroundFX";

export default function Home() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return (
    <main className="min-h-screen pt-24 px-6 bg-white text-black dark:bg-gradient-to-b dark:from-black dark:to-slate-950 dark:text-white transition-colors duration-300 opacity-80">
      <BackgroundFX></BackgroundFX>
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

          <form className="flex flex-col gap-4 flex-grow">
            <input
              placeholder="Symbol (e.g. BTCUSDT)"
              className="p-2 rounded bg-white border border-gray-300 text-gray-800 
                         dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            />

            <select className="p-2 rounded bg-white border border-gray-300 text-gray-800 
                              dark:bg-neutral-900 dark:border-neutral-700 dark:text-white">
              <option>1D</option>
              <option>1W</option>
              <option>12H</option>
              <option>6H</option>
              <option>4H 🏷️</option>
              <option>2H 🏷️</option>
              <option>1H 🏷️</option>
            </select>

            <label className="text-sm text-neutral-400 mt-2">Indicators</label>

            <select className="p-2 rounded bg-white border border-gray-300 text-gray-800 
                              dark:bg-neutral-900 dark:border-neutral-700 dark:text-white">
              <option>EMA</option>
              <option>SMA</option>
              <option>ADX</option>
              <option>RSI</option>
              <option>Donchian Channel</option>
            </select>

            <select className="p-2 rounded bg-white border border-gray-300 text-gray-800 
                              dark:bg-neutral-900 dark:border-neutral-700 dark:text-white">
              <option>EMA</option>
              <option>SMA</option>
              <option>ADX</option>
              <option>RSI</option>
              <option>Donchian Channel</option>
            </select>

            <select
              disabled
              className="p-2 rounded bg-neutral-200 border border-gray-300 text-gray-500 cursor-not-allowed
                         dark:bg-neutral-800 dark:border-neutral-700 dark:text-gray-600"
            >
              <option>🔒 Unlock more indicators</option>
            </select>

            <div className="bg-white/10 dark:bg-neutral-800 rounded-md p-3 border border-white/10 text-sm">
              <p className="text-neutral-400 mb-1">Indicator Parameters</p>
              <input
                placeholder="n/lookback period = e.g. 14"
                className="w-full p-2 mb-2 rounded bg-white border border-gray-300 text-gray-800 
                           dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              />
              <input
                placeholder="high-pass period = e.g 48"
                className="w-full p-2 mb-2 rounded bg-white border border-gray-300 text-gray-800 
                           dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              />
              <input
                placeholder="alpha = e.g. .5"
                className="w-full p-2 rounded bg-white border border-gray-300 text-gray-800 
                           dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              />
            </div>

            <select className="p-2 rounded bg-white border border-gray-300 text-gray-800 
                              dark:bg-neutral-900 dark:border-neutral-700 dark:text-white">
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

            <div className="flex gap-2">
              <input
                placeholder="Start e.g. '2018-12-31'"
                className="w-1/2 p-2 rounded bg-white border border-gray-300 text-gray-800 
                           dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              />
              <input
                placeholder="End e.g. '2024-12-31'"
                className="w-1/2 p-2 rounded bg-white border border-gray-300 text-gray-800 
                           dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              />
            </div>

            <button className="mt-1 bg-gradient-to-r from-teal-400 to-cyan-500 text-black font-semibold py-2 rounded-md hover:opacity-90 transition">
              Run Backtest
            </button>
          </form>
        </div>

        {/* RIGHT — CHART */}
        <div className="flex-[1.4] dark:bg-white/5 rounded-2xl p-6 backdrop-blur-md border dark:border-white/10 flex flex-col justify-between">
          <div className="text-neutral-400 mb-4 text-sm text-center">
            Symbol × Timeframe × Indicator(s)
          </div>

          {/* chart area grows to fill height of config */}
          <div
            className={`flex-grow rounded-lg border ${
              dark ? "border-white/10" : "border-gray-300"
            } flex items-center justify-center text-neutral-400`}
          >
            [ Candlestick / Indicator Chart Placeholder ]
          </div>
        </div>
      </div>

      {/* ---------- RESULTS SECTION (PERF + EQUITY) ---------- */}
      <section className="max-w-[1600px] mx-auto mt-10 dark:bg-white/5 dark:bg-white/5 rounded-2xl backdrop-blur-md border dark:border-white/10 flex flex-col lg:flex-row overflow-hidden">
        {/* PERFORMANCE TABLE */}
        <div className="flex-1 dark:border-b lg:border-b-0 lg:border-r dark:border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-2 gap-x-2 gap-y-10 text-center">
            <div>
              <p className="text-neutral-400 text-sm">PnL</p>
              <p className="text-xl font-semibold text-teal-400">+1 114 USD</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Total Trades</p>
              <p className="text-xl font-semibold text-teal-400">142</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Long</p>
              <p className="text-xl font-semibold text-teal-400">20x</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Short</p>
              <p className="text-xl font-semibold text-teal-400">14x</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Sharpe</p>
              <p className="text-xl font-semibold text-teal-400">1.78</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Profit Factor</p>
              <p className="text-xl font-semibold text-teal-400">1.4</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Max DD</p>
              <p className="text-xl font-semibold text-teal-400">-25.6 %</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Win Rate</p>
              <p className="text-xl font-semibold text-teal-400">62 %</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Buy & Hold</p>
              <p className="text-xl font-semibold text-teal-400">142 %</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">SL Hits</p>
              <p className="text-xl font-semibold text-teal-400">5×</p>
            </div>
          </div>
        </div>

        {/* EQUITY CURVE */}
        <div className="flex-[2.8] p-6 flex items-center justify-center">
          <div className="w-full h-[480px] rounded-lg border dark:border-white/10 flex items-center justify-center text-neutral-400">
            [ Equity Curve Chart Placeholder ]
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

