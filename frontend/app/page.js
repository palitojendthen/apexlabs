"use client";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useState } from "react";
import BackgroundFX from "./components/BackgroundFX";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function Home() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  /** handle dynamic form submission */
  async function handleRun(e) {
    e.preventDefault();
    setLoading(true);
    setChartData(null);

    try {
      const form = e.target;

      const config = {
        symbol: form.symbol.value.trim().toUpperCase(),
        timeframe: form.timeframe.value.trim().toLowerCase(),
        startDate: form.start.value.trim(),
        endDate: form.end.value.trim(),
      };

      console.log("[Client] Sending config:", config);

      const res = await fetch("/api/fetch_data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const json = await res.json();
      console.log("[Client] Received:", json);

      if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
      if (!json?.data?.length) throw new Error("No rows returned");

      // normalize bigquery timestamps to valid ISO strings
      const normalized = json.data.map((row) => ({
        ...row,
        open_time: new Date(row.open_time?.value || row.open_time).toISOString(),
        open: Number(row.open),
        high: Number(row.high),
        low: Number(row.low),
        close: Number(row.close),
      }));

      console.log("[Client] Normalized sample row:", normalized[0]);
      setChartData(normalized);
    } catch (err) {
      console.error("Fetch failed:", err);
      alert(`Fetch failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pt-24 px-6 bg-white text-black dark:bg-gradient-to-b dark:from-black dark:to-slate-950 dark:text-white transition-colors duration-300 opacity-80">
      <BackgroundFX />

      {/* header*/}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold mb-2">Research & Backtest</h1>
        <p className="text-neutral-400">
          Explore strategies, analyze performance, and visualize your results.
        </p>
      </div>

      {/* main flex */}
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-10 items-stretch justify-between">
        {/* left config */}
        <div className="flex-1 max-w-[420px] dark:bg-white/5 rounded-2xl p-6 backdrop-blur-md border dark:border-white/10 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Configuration</h2>

          <form className="flex flex-col gap-4 flex-grow" onSubmit={handleRun}>
            <input
              name="symbol"
              placeholder="Symbol (e.g. BTCUSDT)"
              className="p-2 rounded bg-white border border-gray-300 text-gray-800 
                         dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              required
            />

            <select
              name="timeframe"
              className="p-2 rounded bg-white border border-gray-300 text-gray-800 
                         dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            >
              <option value="1d">1D</option>
              <option value="1w">1W</option>
              <option value="12h">12H</option>
              <option value="6h">6H</option>
              <option value="4h">4H 🏷️</option>
              <option value="2h">2H 🏷️</option>
              <option value="1h">1H 🏷️</option>
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
                name="start"
                placeholder="Start e.g. 2023-01-01"
                className="w-1/2 p-2 rounded bg-white border border-gray-300 text-gray-800 
                           dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              />
              <input
                name="end"
                placeholder="End e.g. 2024-01-01"
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

        {/* right chart */}
        <div className="flex-[1.4] dark:bg-white/5 rounded-2xl p-6 backdrop-blur-md border dark:border-white/10 flex flex-col justify-between">
          <div className="text-neutral-400 mb-4 text-sm text-center">
            Symbol × Timeframe × Indicator(s)
          </div>

          <div
            className={`flex-grow rounded-lg border ${
              dark ? "border-white/10" : "border-gray-300"
            } flex items-center justify-center text-neutral-400`}
          >
            {!chartData ? (
              loading ? (
                <span className="text-sm text-neutral-400">
                  Fetching historical data...
                </span>
              ) : (
                "[ Candlestick / Indicator Chart Placeholder ]"
              )
            ) : (
              <Plot
                data={[
                  {
                    x: chartData.map((d) => d.open_time),
                    open: chartData.map((d) => d.open),
                    high: chartData.map((d) => d.high),
                    low: chartData.map((d) => d.low),
                    close: chartData.map((d) => d.close),
                    type: "candlestick",
                    increasing: { line: { color: "#00bfa6" } },
                    decreasing: { line: { color: "#ff4d4f" } },
                  },
                ]}
                layout={{
                  autosize: true,
                  margin: { l: 40, r: 20, t: 20, b: 40 },
                  paper_bgcolor: "transparent",
                  plot_bgcolor: "transparent",
                  xaxis: { rangeslider: { visible: false } },
                  yaxis: { fixedrange: false },
                  font: { color: dark ? "#e5e5e5" : "#111" },
                }}
                style={{ width: "100%", height: "600px" }}
                config={{ responsive: true, displayModeBar: false }}
              />
            )}
          </div>
        </div>
      </div>

      {/* results section */}
      <section className="max-w-[1600px] mx-auto mt-10 dark:bg-white/5 rounded-2xl backdrop-blur-md border dark:border-white/10 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 dark:border-b lg:border-b-0 lg:border-r dark:border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-2 gap-x-2 gap-y-10 text-center">
            <div><p className="text-neutral-400 text-sm">PnL</p><p className="text-xl font-semibold text-teal-400">+1 114 USD</p></div>
            <div><p className="text-neutral-400 text-sm">Total Trades</p><p className="text-xl font-semibold text-teal-400">142</p></div>
            <div><p className="text-neutral-400 text-sm">Long</p><p className="text-xl font-semibold text-teal-400">20x</p></div>
            <div><p className="text-neutral-400 text-sm">Short</p><p className="text-xl font-semibold text-teal-400">14x</p></div>
            <div><p className="text-neutral-400 text-sm">Sharpe</p><p className="text-xl font-semibold text-teal-400">1.78</p></div>
            <div><p className="text-neutral-400 text-sm">Profit Factor</p><p className="text-xl font-semibold text-teal-400">1.4</p></div>
            <div><p className="text-neutral-400 text-sm">Max DD</p><p className="text-xl font-semibold text-teal-400">-25.6 %</p></div>
            <div><p className="text-neutral-400 text-sm">Win Rate</p><p className="text-xl font-semibold text-teal-400">62 %</p></div>
            <div><p className="text-neutral-400 text-sm">Buy & Hold</p><p className="text-xl font-semibold text-teal-400">142 %</p></div>
            <div><p className="text-neutral-400 text-sm">SL Hits</p><p className="text-xl font-semibold text-teal-400">5×</p></div>
          </div>
        </div>

        {/* equity curve */}
        <div className="flex-[2.8] p-6 flex items-center justify-center">
          <div className="w-full h-[480px] rounded-lg border dark:border-white/10 flex items-center justify-center text-neutral-400">
            [ Equity Curve Chart Placeholder ]
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="mt-16 text-center text-sm text-neutral-500 pb-8">
        © {new Date().getFullYear()} ApexQuantLabs — Built for systematic traders.
      </footer>
    </main>
  );
}


