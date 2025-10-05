import Navbar from "./components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-16 flex-1">
        <section className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Quantitative Research. Backtesting. Automated.
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3">
            Run a quick backtest right from the landing page — no setup required.
          </p>
        </section>

        <section className="grid gap-8 md:grid-cols-[420px,1fr] items-start">
          {/* Left: Form */}
          <div className="rounded-2xl p-5 bg-white/70 dark:bg-white/5 backdrop-blur border border-black/10 dark:border-white/10">
            <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
              <label className="grid gap-1">
                <span className="text-sm text-slate-500 dark:text-slate-400">Ticker</span>
                <input
                  className="rounded-xl border px-3 py-2 bg-white dark:bg-slate-800 border-black/10 dark:border-white/10 outline-none"
                  defaultValue="BTCUSDT"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="grid gap-1">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Timeframe</span>
                  <select className="rounded-xl border px-3 py-2 bg-white dark:bg-slate-800 border-black/10 dark:border-white/10">
                    <option>1D</option>
                    <option>4H</option>
                    <option>1H</option>
                  </select>
                </label>

                <label className="grid gap-1">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Strategy</span>
                  <select className="rounded-xl border px-3 py-2 bg-white dark:bg-slate-800 border-black/10 dark:border-white/10">
                    <option>PMA</option>
                    <option>ADX Filter</option>
                    <option>Long/Short</option>
                  </select>
                </label>
              </div>

              <button className="rounded-xl bg-teal-400 px-4 py-2 text-black font-medium hover:bg-teal-300">
                Run Backtest
              </button>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                * Placeholder: backend connection coming soon.
              </p>
            </form>
          </div>

          {/* Right: Results */}
          <div className="rounded-2xl p-5 bg-white/70 dark:bg-white/5 backdrop-blur border border-black/10 dark:border-white/10 min-h-[320px]">
            <h3 className="text-lg font-medium mb-3">Results Preview</h3>
            <div className="h-[260px] grid place-items-center text-slate-500 dark:text-slate-400">
              <p>Equity curve and metrics will appear here.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10 dark:border-white/10 py-8 text-center text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} ApexQuantLabs
      </footer>
    </div>
  );
}