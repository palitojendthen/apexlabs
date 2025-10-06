// "use client";
// import Navbar from "./components/Navbar";

// export default function HomePage() {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />

//       <main className="mx-auto max-w-6xl px-4 py-16 flex-1">
//         <section className="text-center mb-10">
//           <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
//             Quantitative Research. Backtesting. Automated.
//           </h1>
//           <p className="text-slate-500 dark:text-slate-400 mt-3">
//             Run a quick backtest right from the landing page — no setup required.
//           </p>
//         </section>

//         <section className="grid gap-8 md:grid-cols-[420px,1fr] items-start">
//           {/* Left: Form */}
//           <div className="rounded-2xl p-5 bg-white/70 dark:bg-white/5 backdrop-blur border border-black/10 dark:border-white/10">
//             <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
//               <label className="grid gap-1">
//                 <span className="text-sm text-slate-500 dark:text-slate-400">Ticker</span>
//                 <input
//                   className="rounded-xl border px-3 py-2 bg-white dark:bg-slate-800 border-black/10 dark:border-white/10 outline-none"
//                   defaultValue="BTCUSDT"
//                 />
//               </label>

//               <div className="grid grid-cols-2 gap-4">
//                 <label className="grid gap-1">
//                   <span className="text-sm text-slate-500 dark:text-slate-400">Timeframe</span>
//                   <select className="rounded-xl border px-3 py-2 bg-white dark:bg-slate-800 border-black/10 dark:border-white/10">
//                     <option>1D</option>
//                     <option>1W</option>
//                     <option>12H</option>
//                     <option>6H</option>
//                     <option>4H</option>
//                     <option>2H</option>
//                     <option>1H</option>
//                   </select>
//                 </label>

//                 <label className="grid gap-1">
//                   <span className="text-sm text-slate-500 dark:text-slate-400">Strategy</span>
//                   <select className="rounded-xl border px-3 py-2 bg-white dark:bg-slate-800 border-black/10 dark:border-white/10">
//                     <option>Moving Average</option>
//                     <option>Bollinger Band</option>
//                     <option>RSI</option>
//                   </select>
//                 </label>
//               </div>

//               <button className="rounded-xl bg-teal-400 px-4 py-2 text-black font-medium hover:bg-teal-300">
//                 Run Backtest
//               </button>

//               <p className="text-xs text-slate-500 dark:text-slate-400">
//                 * Placeholder: backend connection coming soon.
//               </p>
//             </form>
//           </div>

//           {/* Right: Results */}
//           <div className="rounded-2xl p-5 bg-white/70 dark:bg-white/5 backdrop-blur border border-black/10 dark:border-white/10 min-h-[320px]">
//             <h3 className="text-lg font-medium mb-3">Results Preview</h3>
//             <div className="h-[260px] grid place-items-center text-slate-500 dark:text-slate-400">
//               <p>Equity curve and metrics will appear here.</p>
//             </div>
//           </div>
//         </section>
//       </main>

      // <footer className="border-t border-black/10 dark:border-white/10 py-8 text-center text-slate-500 dark:text-slate-400">
      //   © {new Date().getFullYear()} ApexQuantLabs — Built for systematic traders
      // </footer>
//     </div>
//   );
// }

// export default function Home() {
//   return (
//     // <main className="min-h-screen pt-24 px-6 bg-gradient-to-b from-black to-slate-950 text-white">
//     <main className="min-h-screen pt-24 px-6 bg-white text-black dark:bg-gradient-to-b dark:from-black dark:to-slate-950 dark:text-white transition-colors duration-300">
//       {/* Section 1 — Title / Header */}
//       <div className="text-center mb-10">
//         <h1 className="text-4xl font-semibold mb-2">Backtest & Research</h1>
//         <p className="text-neutral-400">
//           Explore strategies, analyze performance, and visualize your results.
//         </p>
//       </div>

//       {/* Section 2 — Core Grid */}
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
//          {/* Left — Parameters Form */}
//         <div className="lg:col-span-1 bg-white/5 rounded-2xl p-6 backdrop-blur-md border border-white/10">
//           <h2 className="text-lg font-semibold mb-4">Configuration</h2>
//           <form className="flex flex-col gap-4">
//             <input
//               placeholder="Symbol (e.g. BTCUSDT)"
//               className="p-2 rounded bg-white border border-gray-300 text-gray-800
//                         dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
//             />
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
//             <select className="p-2 rounded bg-white border border-gray-300 text-gray-800 
//                               dark:bg-neutral-900 dark:border-neutral-700 dark:text-white">
//               <option>EMA</option>
//               <option>SMA</option>
//               <option>ADX</option>
//               <option>RSI</option>
//               <option>Donchian Channel</option>
//               <option>Predictive Moving Average 🏷️</option>
//               <option>Kaufman Adaptive Moving Average 🏷️</option>
//             </select>
//             <select className="p-2 rounded bg-white border border-gray-300 text-gray-800 
//                               dark:bg-neutral-900 dark:border-neutral-700 dark:text-white">
//               <option>SMA</option>
//               <option>EMA</option>
//               <option>ADX</option>
//               <option>RSI</option>
//               <option>Donchian Channel</option>
//               <option>Predictive Moving Average 🏷️</option>
//               <option>Kaufman Adaptive Moving Average 🏷️</option>
//             </select>
//             <select className="p-2 rounded bg-white border border-gray-300 text-gray-800 
//                               dark:bg-neutral-900 dark:border-neutral-700 dark:text-white">
//               <option>🏷️</option>
//             </select>
//             <input
//               placeholder="Start Date (e.g. '2018-01-01') 🏷️"
//               className="p-2 rounded bg-white border border-gray-300 text-gray-800
//                         dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
//             />
//             <input
//               placeholder="End Date (e.g. '2024-12-31') 🏷️"
//               className="p-2 rounded bg-white border border-gray-300 text-gray-800
//                         dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
//             />
//             <button className="bg-gradient-to-r from-teal-400 to-cyan-500 text-black font-semibold py-2 rounded-md hover:opacity-90 transition">
//               Run Backtest
//             </button>
//           </form>
//         </div>

//         {/* Right — Chart area */}
//         <div className="lg:col-span-2 bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10 flex items-center justify-center">
//           {/* Plotly chart placeholder */}
//           <div className="text-neutral-400">[ Chart will render here ]</div>
//         </div>
//       </div>

//       {/* Section 3 — Results table */}
//       <div className="max-w-5xl mx-auto mt-10 bg-white border border-gray-300 
//                 dark:bg-white/5 dark:border-white/10 backdrop-blur-md 
//                 rounded-2xl p-6">
//         <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
//           <div>
//             <p className="text-neutral-400 text-sm">PnL</p>
//             <p className="text-xl font-semibold text-teal-400">+12.3%</p>
//           </div>
//           <div>
//             <p className="text-neutral-400 text-sm">Sharpe</p>
//             <p className="text-xl font-semibold text-teal-400">1.78</p>
//           </div>
//           <div>
//             <p className="text-neutral-400 text-sm">Max DD</p>
//             <p className="text-xl font-semibold text-teal-400">-4.6%</p>
//           </div>
//           <div>
//             <p className="text-neutral-400 text-sm">Win Rate</p>
//             <p className="text-xl font-semibold text-teal-400">62%</p>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";
import { useTheme } from "next-themes";

export default function Home() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return (
    <main className="min-h-screen pt-24 px-6 bg-white text-black dark:bg-gradient-to-b dark:from-black dark:to-slate-950 dark:text-white transition-colors duration-300">
      {/* Section 1 — Title / Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold mb-2">Backtest & Research</h1>
        <p className="text-neutral-400">
          Explore strategies, analyze performance, and visualize your results.
        </p>
      </div>

      {/* Section 2 — Core Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left — Configuration Form */}
        <div className="lg:col-span-1 bg-white/5 rounded-2xl p-6 backdrop-blur-md border border-white/10 lg:ml-6">
          <h2 className="text-lg font-semibold mb-4">Configuration</h2>

          <form className="flex flex-col gap-4">
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

            {/* Indicator selection */}
            <select className="p-2 rounded bg-white border border-gray-300 text-gray-800 
                              dark:bg-neutral-900 dark:border-neutral-700 dark:text-white">
              <option>EMA</option>
              <option>SMA</option>
              <option>ADX</option>
              <option>RSI</option>
              <option>Donchian Channel</option>
              <option>Predictive Moving Average 🏷️</option>
              <option>Kaufman Adaptive Moving Average 🏷️</option>
            </select>

            {/* Indicator selection */}
            <select className="p-2 rounded bg-white border border-gray-300 text-gray-800 
                              dark:bg-neutral-900 dark:border-neutral-700 dark:text-white">
              <option>SMA</option>
              <option>EMA</option>
              <option>ADX</option>
              <option>RSI</option>
              <option>Donchian Channel</option>
              <option>Predictive Moving Average 🏷️</option>
              <option>Kaufman Adaptive Moving Average 🏷️</option>
            </select>

            {/* Strategy selection */}
            <select className="p-2 rounded bg-white border border-gray-300 text-gray-800 
                              dark:bg-neutral-900 dark:border-neutral-700 dark:text-white">
              <option> 🏷️</option>
            </select>

            {/* Placeholder for dynamic params (expand later) */}
            <div className="bg-white/10 dark:bg-neutral-800 rounded-md p-3 border border-white/10 text-sm">
              <p className="text-neutral-400 mb-1">Indicator Parameters</p>
              <input
                placeholder="alpha = ..."
                className="w-full p-2 rounded bg-white border border-gray-300 text-gray-800 
                           dark:bg-neutral-900 dark:border-neutral-700 dark:text-white mb-2"
              />
              <input
                placeholder="n = ..."
                className="w-full p-2 rounded bg-white border border-gray-300 text-gray-800 
                           dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              />
            </div>

            {/* Date range */}
            <input
              placeholder="Start Date (e.g. '2018-01-01')"
              className="p-2 rounded bg-white border border-gray-300 text-gray-800
                        dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            />
            <input
              placeholder="End Date (e.g. '2024-12-31')"
              className="p-2 rounded bg-white border border-gray-300 text-gray-800
                        dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            />

            {/* Run Button */}
            <button className="bg-gradient-to-r from-teal-400 to-cyan-500 text-black font-semibold py-2 rounded-md hover:opacity-90 transition">
              Run Backtest
            </button>
          </form>
        </div>

        {/* Right — Chart area */}
        <div className="lg:col-span-2 bg-white/5 rounded-2xl p-6 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center">
          <div className="text-neutral-400 mb-4">[ Chart will render here ]</div>
          <div
            className={`w-full h-[5px] rounded-lg border ${
              dark ? "border-white/10" : "border-gray-300"
            } flex items-center justify-center text-neutral-400`}
          >
            [ Candlestick / Indicator Chart Placeholder ]
          </div>
        </div>
      </div>

      {/* Section 3 — Performance + Equity */}
      <div className="max-w-7xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left — Performance Metrics */}
        <div className="bg-white border border-gray-300 
                        dark:bg-white/5 dark:border-white/10 backdrop-blur-md 
                        rounded-2xl p-6 lg:ml-6">
          <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-2 gap-y-4 text-center">
            <div>
              <p className="text-neutral-400 text-sm">PnL</p>
              <p className="text-xl font-semibold text-teal-400">+1,114 USD%</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Total Trades</p>
              <p className="text-xl font-semibold text-teal-400">1.78</p>
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
              <p className="text-xl font-semibold text-teal-400">-25.6%</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Win Rate</p>
              <p className="text-xl font-semibold text-teal-400">62%</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">Buy & Hold</p>
              <p className="text-xl font-semibold text-teal-400">142%</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm">SL Hit</p>
              <p className="text-xl font-semibold text-teal-400">5x</p>
            </div>
          </div>
        </div>

        {/* Right — Equity Curve Chart */}
        <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-md border border-white/10 flex items-center justify-center">
          <div className="text-neutral-400">[ Equity Curve Chart Placeholder ]</div>
        </div>
      </div>
    </main>
  );
}
