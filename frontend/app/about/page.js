"use client";
import { motion } from "framer-motion";
import { BriefcaseBusiness, FlaskConical, LineChart } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import BackgroundFX from "../components/BackgroundFX";


export default function AboutPage() {
  const { setTheme } = useTheme();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, [setTheme]);

  const features = [
    {
      icon: <FlaskConical className="w-6 h-6 text-teal-400" />,
      title: "Research & Backtest",
      description:
        "Create, visualize, and validate your strategies with historical data and advanced performance analytics.",
    },
    {
      icon: <LineChart className="w-6 h-6 text-teal-400" />,
      title: "Live Strategies",
      description:
        "Deploy your algorithms and monitor performance in real time with seamless integration to live markets.",
    },
    {
      icon: <BriefcaseBusiness className="w-6 h-6 text-teal-400" />,
      title: "Portfolio Management",
      description:
        "Track exposure, equity, and returns across multiple strategies in a unified performance dashboard.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-28 pb-20 px-6 bg-white text-black dark:bg-gradient-to-b dark:from-black dark:to-slate-950 dark:text-white transition-colors duration-300 relative overflow-hidden opacity-80">
      <BackgroundFX />

      <div className="h-20 md:h-24" />

      {/* hero section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
          Empowering independent traders through research-driven automation.
        </h1>
        <p className="text-neutral-400 text-sm md:text-base mt-3">
          ApexQuantLabs is a quantitative research and trading platform built for transparency,
          experimentation, and performance.
        </p>
      </motion.div>

      {/* story + data section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="relative max-w-4xl mx-auto px-6 py-12 mb-24 text-center"
      >
        {/* subtle organic gridwave backdrop */}
        <div
          className="absolute inset-0 -z-10 opacity-20"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(45,212,191,0.15) 0%, transparent 60%), repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 60px), repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 60px)",
          }}
        />

        <h3 className="text-xl font-semibold mb-8 text-teal-400">Our Journey</h3>

        <div className="text-neutral-300 leading-relaxed text-sm md:text-base space-y-8 max-w-2xl mx-auto">
          <p>
            What began as a small attempt to earn extra income through the markets soon became a deeper curiosity —
            <em> can data uncover structure within price noise?</em>  
             With R and Python, we started building analytical tools, transforming scattered data into structured insight.
            Inspired by <strong>John F. Ehlers’</strong> <em>“Rocket Science for Traders”</em>, ApexQuantLabs grew from a personal pursuit into
            a commitment to quantitative discipline and systematic design.
          </p>

          {/* subtle divider */}
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent mx-auto" />

          <p>
            Today, ApexQuantLabs sources market data directly from <strong>Binance Futures</strong>,
            covering asset from inception to present with strict data integrity.
            Our internal pipelines handle collection, cleaning, and ingestion — ensuring reliable and continuous datasets.
            Future integrations with <strong>Interactive Brokers (IBKR)</strong> and institutional-grade sources
            will expand this foundation even further.
          </p>
        </div>
      </motion.section>

      {/* features section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.9 }}
        className="w-full max-w-6xl px-4 mb-24"
      >
        <h3 className="text-xl font-semibold mb-10 text-teal-400 text-center">Core Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
              className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-teal-400/30 hover:scale-[1.03] transition-transform shadow-xl"
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                {f.icon}
                <h3 className="text-lg font-semibold">{f.title}</h3>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* contact section */}
        <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.9 }}
        className="text-center mb-24"
        >
        <p className="text-neutral-400 text-sm md:text-base">
            Contact Us{" "}
            <a
            href="mailto:contact@apexquantlabs.com"
            className="text-teal-400 hover:text-cyan-400 transition-colors font-medium"
            >
            contact@apexquantlabs.com
            </a>
        </p>
        </motion.section>

      {/* disclaimer section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.9 }}
        className="max-w-3xl mx-auto text-center text-neutral-500 text-xs md:text-sm px-6"
      >
        <p>
          <strong>Disclaimer:</strong> Trading involves substantial risk and may not be suitable for every investor.
          All information on this site is for educational and research purposes only and should not be considered financial advice.
          Decisions to buy, sell, or trade in any markets are your own responsibility. Past performance does not guarantee future results.
        </p>
      </motion.div>

      {/* footer */}
      <footer className="mt-20 text-center text-sm text-neutral-500 pb-8">
        © 2025 ApexQuantLabs — Built for systematic traders.
      </footer>
    </main>
  );
}
