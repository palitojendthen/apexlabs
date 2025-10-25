"use client";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import BackgroundFX from "./components/BackgroundFX";
import { useUserPlan } from "./hooks/useUserPlan";

const Plot = dynamic(() => import("react-plotly.js").then((m) => m.default), {
  ssr: false,
});

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

/* params validation layer + helpers */
const indicatorSchemas = {
  SMA: {
    n_sma: { default: 14, type: "int", min: 1, max: 500 },
    source_sma: { default: "close", type: "string" },
  },
  EMA: {
    n_ema: { default: 14, type: "int", min: 1, max: 500 },
    alpha_ema: { default: 0.14, type: "float", min: 0, max: 1 },
    source_ema: { default: "close", type: "string" },
  },
  WMA: {
      n_wma: { default: 14, type: "int", min: 1, max: 500 },
      source_wma: { default: "close", type: "string" },
  },
  ADX: {
    n_adx: { default: 14, type: "int", min: 1, max: 500 },
    threshold_adx: { default: 20, type: "int", min: 0, max: 100 },
  },
  RSI: {
    n_rsi: { default: 14, type: "int", min: 1, max: 500 },
    source_rsi: { default: "close", type: "string" },
    overbought_rsi: { default: 70, type: "int", min:51, max:100 },
    oversold_rsi: { default: 30, type: "int", min:1, max:49 },
  },
  MACD: {
    source_macd: { default: "close", type: "string"}, 
    n_fast_macd: { default: 12, type: "int", min:1, max:500 },
    n_slow_macd: { default: 26, type: "int", min:1, max:500 },
    n_signal_macd: { default: 9, type: "int", min:1, max:500 },
    ma_type_macd: { default: "ema", type: "string"},
  },
  Donchian_Channel: {
    n_dc: { default: 20, type: "int", min: 1, max: 500 },
  },

    KAMA: {
      n_kama: { default: 14, type: "int", min: 1, max: 500 },
      n_fast_kama: { default: 2, type: "int", min: 1, max: 100 },
      n_slow_kama: { default: 30, type: "int", min: 1, max: 500 },
      source_kama: { default: "close", type: "string" },
    },
  "(Ehlers) Simple Decycler": {
      hp_simple_decycler: { default: 48, type: "int", min: 1, max: 500 },
      source_simple_decycler: { default: "close", type: "string" },
  },
    "(Ehlers) Predictive Moving Average": {
      source_pma: { default: "close", type: "string" },
  },
    "(Ehlers) Ultimate Smoother": {
      source_us: { default: "hl2", type: "string" },
      n_us: { default: 20, type: "int", min:1, max:100 },
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
    } else warnings.push(`${key} not recognized, ignored`);
  }

  for (const [k, def] of Object.entries(schema1))
    if (!(k in result1)) result1[k] = def.default;
  for (const [k, def] of Object.entries(schema2))
    if (!(k in result2)) result2[k] = def.default;

  return { params1: result1, params2: result2, warnings };
}

/* main component */
export default function Home() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const plan = useUserPlan();
  const isPremium = plan === "Essentials" || plan === "Essentials_Beta";

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendResult, setBackendResult] = useState(null);

  const [formState, setFormState] = useState({
    symbol: "BTCUSDT",
    timeframe: "1d",
    start: "",
    end: "",
    ind1: "SMA",
    ind2: "Select Indicator",
    ind3: "Select Indicator",
    params: "n_sma=14,source_sma=close",
    stop: "3%",
  });

  const chartTitle = useMemo(() => {
    return `${formState.symbol} • ${formState.timeframe} • ${formState.ind1}`;
  }, [formState]);

  async function fetchData(conf) {
    setLoading(true);
    setChartData(null);
    setBackendResult(null);
    try {
      const res = await fetch("/api/fetch_data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(conf),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
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

  async function runBacktest(dataRows, conf) {
  try {
    const { params1, params2 } = validateParams(conf.params, conf.ind1, conf.ind2);

    const indicators = [];

    const skipNames = ["Select Indicator", "Select an indicator", "", null, undefined];

    if (conf.ind1 && !skipNames.includes(conf.ind1)) {
      indicators.push({ name: conf.ind1, params: params1 });
    }
    if (conf.ind2 && !skipNames.includes(conf.ind2)) {
      indicators.push({ name: conf.ind2, params: params2 });
    }
    if (conf.ind3 && !skipNames.includes(conf.ind3)) {
      indicators.push({ name: conf.ind3, params: {} });
    }

    const payload = {
      data: dataRows,
      indicators,
      stop_loss: conf.stop,
      capital: 1000,
      mode: conf.mode,
    };

    const res = await fetch("/api/run_backtest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    setBackendResult(result);
  } catch (err) {
    console.error("Backtest failed:", err);
  }
  }

  useEffect(() => {
    (async () => {
      const rows = await fetchData({
        symbol: "BTCUSDT",
        timeframe: "1d",
        startDate: "",
        endDate: "",
      });
      if (!rows) return;
      await runBacktest(rows);
    })();
  }, []);

  async function handleRun(e) {
    e.preventDefault();
    const t = e.currentTarget;

    const conf = {
      symbol: t.symbol.value.trim().toUpperCase(),
      timeframe: t.timeframe.value.trim().toLowerCase(),
      startDate: t.start.value.trim(),
      endDate: t.end.value.trim(),
      ind1: t.ind1.value,
      ind2: t.ind2.value,
      ind3: t.ind3?.value || "Select Indicator",
      params: t.params.value,
      stop: t.stop.value,
      mode: t.mode.value || "longshort",
    };

    setFormState(conf);
    setChartData(null);
    setBackendResult(null);

    const rows = await fetchData(conf);
    if (rows) await runBacktest(rows, conf);
  }

  const borderColor = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.2)";
  const gridColor = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const metrics = backendResult?.metrics ?? null;
  const plots = backendResult?.plots ?? [];
  const markers = backendResult?.markers ?? { long: [], short: [] };
  const equity =
    backendResult?.df?.map((d) => ({
      x: d.open_time,
      y: d.equity ?? null,
    })) ?? [];

  const entryX = markers.long.map((m) => m.x);
  const entryY = markers.long.map((m) => m.y * 1.005);
  const exitX = markers.short.map((m) => m.x);
  const exitY = markers.short.map((m) => m.y * 0.995);

  if (typeof window !== "undefined") {
    window.backendResult = backendResult;
  }

  // full render
  return (
    <main className="min-h-screen pt-24 px-6 bg-white text-black dark:bg-gradient-to-b dark:from-black 
                     dark:to-slate-950 dark:text-white transition-colors duration-300 opacity-80">
      <BackgroundFX />
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold mb-2">Research & Backtest</h1>
        <p className="text-neutral-400">
          Explore strategies, analyze performance, and visualize results.
        </p>
      </div>

      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-10 items-stretch justify-between">
        {/* left config */}
        <div className="flex-1 max-w-[420px] dark:bg-white/5 rounded-2xl p-6 backdrop-blur-md border dark:border-white/10 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Configuration</h2>
          <form className="flex flex-col gap-4 flex-grow" onSubmit={handleRun}>
            <input
              name="symbol"
              defaultValue={formState.symbol}
              placeholder="Symbol (e.g. BTCUSDT)"
              className="p-2 rounded bg-white border border-gray-300 text-gray-800 
                         dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              required
            />

            <select
              name="timeframe"
              defaultValue={formState.timeframe}
              className="p-2 rounded bg-white border border-gray-300 text-gray-800 
                         dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            >
              <option value="1d">1D</option>
              <option value="12h">12H</option>
              <option value="1w">1W</option>
              <option value="6h" disabled={!isPremium}>
                6H {isPremium ? "" : "🔒"}
              </option>
              <option value="4h" disabled={!isPremium}>
                4H {isPremium ? "" : "🔒"}
              </option>
              <option value="2h" disabled={!isPremium}>
                2H {isPremium ? "" : "🔒"}
              </option>
              <option value="1h" disabled={!isPremium}>
                1H {isPremium ? "" : "🔒"}
              </option>
            </select>

            <select
              name="ind1"
              defaultValue={formState.ind1}
              className="p-2 rounded bg-white border border-gray-300 text-gray-800 
                             dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            >
              <option>SMA</option>
              <option>EMA</option>
              <option>WMA</option>
              <option>ADX</option>
              <option>RSI</option>
              <option>MACD</option>
              <option>Donchian Channel</option>
              <option>KAMA</option>
              <option disabled={!isPremium}>
                (Ehlers) Simple Decycler {isPremium ? "" : "🔒"}
              </option>
              <option disabled={!isPremium}>
                (Ehlers) Predictive Moving Average {isPremium ? "" : "🔒"}
              </option>
              <option disabled={!isPremium}>
                (Ehlers) Ultimate Smoother {isPremium ? "" : "🔒"}
              </option>
            </select>

            <select
              name="ind2"
              defaultValue={formState.ind2}
              className="p-2 rounded bg-white border border-gray-300 text-gray-800 
                         dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            >
              <option>Select Indicator</option>
              <option>SMA</option>
              <option>EMA</option>
              <option>WMA</option>
              <option>ADX</option>
              <option>RSI</option>
              <option>MACD</option>
              <option>Donchian Channel</option>
              <option>KAMA</option>
              <option disabled={!isPremium}>
                (Ehlers) Simple Decycler {isPremium ? "" : "🔒"}
              </option>
              <option disabled={!isPremium}>
                (Ehlers) Predictive Moving Average {isPremium ? "" : "🔒"}
              </option>
              <option disabled={!isPremium}>
                (Ehlers) Ultimate Smoother {isPremium ? "" : "🔒"}
              </option>
            </select>

            <select
              name="ind3"
              defaultValue={formState.ind3}
              className={`p-2 rounded border border-gray-300 text-gray-800 cursor-not-allowed
                          dark:bg-neutral-900 dark:border-neutral-700 dark:text-white
                          ${!isPremium ? "opacity-70 pointer-events-none" : "bg-white"}`}
              title={!isPremium ? "Unlock more indicators" : ""}
            >
              <option>Select Indicator</option>
              <option>SMA</option>
              <option>EMA</option>
              <option>WMA</option>
              <option>ADX</option>
              <option>RSI</option>
              <option>MACD</option>
              <option>Donchian Channel</option>
              <option>KAMA</option>
              <option disabled={!isPremium}>
                (Ehlers) Simple Decycler {isPremium ? "" : "🔒"}
              </option>
              <option disabled={!isPremium}>
                (Ehlers) Predictive Moving Average {isPremium ? "" : "🔒"}
              </option>
              <option disabled={!isPremium}>
                (Ehlers) Ultimate Smoother {isPremium ? "" : "🔒"}
              </option>
            </select>

            {/* indicator parameters */}
            <div className="bg-white/10 dark:bg-neutral-800 rounded-md p-3 border border-white/10 text-sm">
              <p className="text-neutral-400 mb-1">
                Refer indicator parameters to the Resources page! (e.g.{" "}
                <code>n_sma=14, hp=48, alpha=0.5, source_sma=ohlc4</code>)
              </p>
              <textarea
                name="params"
                defaultValue={formState.params}
                rows={2}
                className="w-full p-2 rounded bg-white border border-gray-300 text-gray-800 
                           dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              />
            </div>

            <select
              name="stop"
              defaultValue={formState.stop || "3%"}
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

            <select
              name="mode"
              defaultValue={formState.mode || "longshort"}
              className="p-2 rounded bg-white border border-gray-300 text-gray-800 
                         dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            >
              <option value="long">Long Only</option>
              <option value="short">Short Only</option>
              <option value="longshort">Long-Short</option>
            </select>

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

        {/* right side chart */}
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
                <span className="text-sm text-neutral-400">
                  Fetching data...
                </span>
              ) : (
                "[ Chart Placeholder ]"
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
                    name: "Price",
                  },

                  ...(backendResult?.plots?.length
                  ? backendResult.plots
                      .map((p) => {
                        const df = backendResult.df ?? [];
                        if (!df.length) return null;
                        const times = df.map((d) => d.open_time);

                        // multi-line indicators (envelopes, bollinger, etc)
                        if (p.is_multiline && p.cols?.length) {
                          const colorMap = (col) => {
                            const c = col.toLowerCase();
                            // only apply special colors if envelope-like naming is detected
                            if (/(upper|lower|basis|middle)/.test(c)) {
                              if (c.includes("upper")) return "darkred";
                              if (c.includes("lower")) return "darkgreen";
                              if (c.includes("basis") || c.includes("middle")) return "rgba(255,165,0,0.9)";
                            }
                            // fallback neutral color for unknown multi-col indicators (e.g. mama lines)
                            return "rgba(200,200,200,0.7)";
                          };

                          // build the multiple traces
                          const traces = p.cols.map((col) => ({
                            x: times,
                            y: df.map((d) => d[col]),
                            type: "scatter",
                            mode: "lines",
                            line: { width: 1.6, color: colorMap(col) },
                            name: `${p.display_name}_${col
                              .replace(p.name + "_", "")
                              .replace(/_/g, " ")
                              .toUpperCase()}`,
                          }));

                          return traces;
                        }

                        // standard single-line overlays (sma, ema, wma, kama etc)
                        const values = df.map((d) => d[p.name] ?? null);
                        const signals = df.map((d) => d[p.signal_col] ?? 0);

                        const longLine = {
                          x: times,
                          y: values.map((v, i) => (signals[i] === 1 ? v : null)),
                          type: "scatter",
                          mode: "lines",
                          line: { width: 2, color: p.color_up },
                          name: `${p.display_name} (Long)`,
                        };

                        const shortLine = {
                          x: times,
                          y: values.map((v, i) => (signals[i] === -1 ? v : null)),
                          type: "scatter",
                          mode: "lines",
                          line: { width: 2, color: p.color_down },
                          name: `${p.display_name} (Short)`,
                        };

                        return [longLine, shortLine];
                      })
                      .flat()
                  : []),


                  ...(entryX.length
                    ? [
                        {
                          x: entryX,
                          y: entryY,
                          type: "scatter",
                          mode: "markers",
                          marker: { symbol: "triangle-up", size: 10, color: "lime" },
                          name: "Long",
                        },
                      ]
                    : []),

                  ...(exitX.length
                    ? [
                        {
                          x: exitX,
                          y: exitY,
                          type: "scatter",
                          mode: "markers",
                          marker: { symbol: "triangle-down", size: 10, color: "red" },
                          name: "Short",
                        },
                      ]
                    : []),
                ]}
                layout={{
                  autosize: true,
                  margin: { l: 40, r: 20, t: 10, b: 40 },
                  paper_bgcolor: "transparent",
                  plot_bgcolor: "transparent",
                  xaxis: {
                    gridcolor: gridColor,
                    linecolor: borderColor,
                    rangeslider: { visible: false },
                  },
                  yaxis: { gridcolor: gridColor, linecolor: borderColor },
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

      {/* results section */}
      <section className="max-w-[1600px] mx-auto mt-10 dark:bg-white/5 rounded-2xl backdrop-blur-md border dark:border-white/10 flex flex-col lg:flex-row overflow-hidden">
        {/* metrics table */}
        <div className="flex-1 dark:border-b lg:border-b-0 lg:border-r dark:border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
          {!metrics ? (
            <div className="text-neutral-400 text-sm">Run a backtest to populate metrics…</div>
          ) : (
            <div className="grid grid-cols-2 gap-x-2 gap-y-10 text-center">
              {Object.entries(metrics).map(([k, v]) => (
                <div key={k}>
                  <p className="text-neutral-400 text-sm">{k}</p>
                  <p className="text-xl font-semibold text-teal-400">{v}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* equity curve */}
        <div className="flex-[2.8] p-6 flex items-center justify-center">
          <div className="w-full h-[480px] rounded-lg border dark:border-white/10 flex items-center justify-center text-neutral-400">
            {!equity?.length ? (
              "[ Equity Curve Chart Placeholder ]"
            ) : (
              <Plot
                data={[
                  {
                    x: equity.map((p) => p.x),
                    y: equity.map((p) => p.y),
                    type: "scatter",
                    mode: "lines",
                    line: { width: 1.6, color: "#14b8a6" },
                    name: "Equity Curve",
                  },
                ]}
                layout={{
                  autosize: true,
                  margin: { l: 50, r: 20, t: 10, b: 40 },
                  paper_bgcolor: "transparent",
                  plot_bgcolor: "transparent",
                  xaxis: {
                    gridcolor: gridColor,
                    linecolor: borderColor,
                    zerolinecolor: gridColor,
                  },
                  yaxis: {
                    gridcolor: gridColor,
                    linecolor: borderColor,
                    zerolinecolor: gridColor,
                  },
                  font: { color: dark ? "#e5e5e5" : "#111" },
                  showlegend: false,
                }}
                style={{ width: "100%", height: "100%" }}
                config={{ responsive: true, displayModeBar: false }}
              />
            )}
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="mt-16 text-center text-sm text-neutral-500 pb-8">
        © 2025 ApexQuantLabs — Built for systematic traders.
      </footer>
    </main>
  );
}
