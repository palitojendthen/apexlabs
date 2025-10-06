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

//       <footer className="border-t border-black/10 dark:border-white/10 py-8 text-center text-slate-500 dark:text-slate-400">
//         © {new Date().getFullYear()} ApexQuantLabs — Built for systematic traders
//       </footer>
//     </div>
//   );
// }

export default function Home() {
  return (
    <main className="min-h-screen pt-24 px-6 bg-gradient-to-b from-black to-slate-950 text-white">
      {/* Section 1 — Title / Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold mb-2">Backtest & Research</h1>
        <p className="text-neutral-400">
          Explore strategies, analyze performance, and visualize your results.
        </p>
      </div>

      {/* Section 2 — Core Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Parameters Form */}
        <div className="lg:col-span-1 bg-white/5 rounded-2xl p-6 backdrop-blur-md border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Configuration</h2>
          <form className="flex flex-col gap-4">
            <input
              placeholder="Symbol (e.g. BTCUSDT)"
              className="p-2 rounded bg-neutral-900 border border-neutral-700"
            />
            <select className="p-2 rounded bg-neutral-900 border border-neutral-700">
              <option>1D</option>
              <option>4H</option>
              <option>1H</option>
            </select>
            <select className="p-2 rounded bg-neutral-900 border border-neutral-700">
              <option>SMA Crossover</option>
              <option>ADX Filter</option>
              <option>Volatility Regime</option>
            </select>
            <button className="bg-gradient-to-r from-teal-400 to-cyan-500 text-black font-semibold py-2 rounded-md hover:opacity-90 transition">
              Run Backtest
            </button>
          </form>
        </div>

        {/* Right — Chart area */}
        <div className="lg:col-span-2 bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10 flex items-center justify-center">
          {/* Plotly chart placeholder */}
          <div className="text-neutral-400">[ Chart will render here ]</div>
        </div>
      </div>

      {/* Section 3 — Results table */}
      <div className="max-w-5xl mx-auto mt-10 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
        <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-neutral-400 text-sm">PnL</p>
            <p className="text-xl font-semibold text-teal-400">+12.3%</p>
          </div>
          <div>
            <p className="text-neutral-400 text-sm">Sharpe</p>
            <p className="text-xl font-semibold text-teal-400">1.78</p>
          </div>
          <div>
            <p className="text-neutral-400 text-sm">Max DD</p>
            <p className="text-xl font-semibold text-teal-400">-4.6%</p>
          </div>
          <div>
            <p className="text-neutral-400 text-sm">Win Rate</p>
            <p className="text-xl font-semibold text-teal-400">62%</p>
          </div>
        </div>
      </div>
    </main>
  );
}