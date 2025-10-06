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

            {/* Indicator selection */}
            <select className="p-2 rounded bg-white border border-gray-300 text-gray-800 
                              dark:bg-neutral-900 dark:border-neutral-700 dark:text-white">
              <option>SMA 🏷️</option>
              <option>EMA 🏷️</option>
              <option>ADX 🏷️</option>
              <option>RSI 🏷️</option>
              <option>Donchian Channel 🏷️</option>
              <option>Predictive Moving Average 🏷️</option>
              <option>Kaufman Adaptive Moving Average 🏷️</option>
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
          <div className="text-neutral-400 mb-4">Symbol + Timeframe + Indicator + Period </div>
          <div
            className={`w-full h-[590px] rounded-lg border ${
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
