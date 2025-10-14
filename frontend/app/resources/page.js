"use client";
import "katex/dist/katex.min.css";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import BackgroundFX from "../components/BackgroundFX";
import Navbar from "../components/Navbar";
import { indicators } from "./data/indicators";

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState(indicators[0]);

  const filtered = indicators.filter((indi) =>
    indi.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-black to-slate-950 text-white overflow-hidden opacity-80">
      <Navbar />
      <BackgroundFX />

      {/* floating container */}
      <div className="pt-24 flex justify-center items-center">
        <div
          className="relative w-full max-w-6xl h-[80vh] bg-white/5 border border-white/10
                     rounded-2xl shadow-xl backdrop-blur-md overflow-hidden flex"
        >
          {/* left panel */}
          <div className="w-[30%] border-r border-neutral-800 flex flex-col">
            {/* search bar */}
            <div className="p-4 border-b border-neutral-800 sticky top-0 bg-black/60 z-10 backdrop-blur-sm">
              <input
                type="text"
                placeholder="Search indicator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 
                           text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-teal-400"
              />
            </div>

            {/* scrollable indicator list */}
            <ul className="flex-1 overflow-y-auto divide-y divide-neutral-800">
              {filtered.map((indi) => (
                <li
                  key={indi.id}
                  onClick={() => setSelected(indi)}
                  className={`p-4 text-sm cursor-pointer transition-all ${
                    selected?.id === indi.id
                      ? "bg-neutral-800 text-teal-400"
                      : "hover:bg-neutral-900 hover:text-teal-300"
                  }`}
                >
                  <div className="font-medium">{indi.name}</div>
                  <div className="text-neutral-500 text-xs">{indi.type}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* right panel */}
          <div className="flex-1 overflow-y-auto p-8">
            {/* Title */}
            <h1 className="text-2xl font-semibold mb-2">{selected.name}</h1>
            <p className="text-sm text-neutral-400 mb-6">
              Type: {selected.type}
            </p>

            {/* JSON parameters */}
            <div className="mb-6 bg-neutral-900/40 rounded-lg p-4 text-xs font-mono overflow-x-auto border border-neutral-800">
              <pre>{JSON.stringify(selected.parameters, null, 2)}</pre>
            </div>

            {/* markdown content with math rendering */}
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {selected.markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
      
      {/* footer */}
      <footer className="mt-20 text-center text-sm text-neutral-500 pb-8">
        © 2025 ApexQuantLabs — Built for systematic traders.
      </footer>
    </main>
  );
}
