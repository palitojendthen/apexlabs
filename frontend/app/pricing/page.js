// "use client";
// import { AnimatePresence, motion } from "framer-motion";
// import { useTheme } from "next-themes";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import BackgroundFX from "../components/BackgroundFX";

// export default function PricingPage() {
//   const [isAnnual, setIsAnnual] = useState(false);
//   const { setTheme } = useTheme();
//   const router = useRouter();

//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme");
//     if (savedTheme) setTheme(savedTheme);
//   }, [setTheme]);

//   const plans = [
//     {
//       name: "Free",
//       priceMonthly: 0,
//       priceAnnual: 0,
//       features: [
//         "Access to core indicators",
//         "Basic backtesting tools",
//         "Limited tickers & intervals",
//         "Community discussion board",
//       ],
//       buttonText: "Explore Free Tools",
//       href: "/",
//     },
//     {
//       name: "Essentials",
//       priceMonthly: 9.9,
//       priceAnnual: 96,
//       features: [
//         "All Free plan features",
//         "Full backtesting engine",
//         "Advanced indicator suite",
//         "Unlimited tickers & datasets",
//         "Priority email support",
//       ],
//       buttonText: "Upgrade to Essentials",
//       href: "/signup",
//       highlight: true,
//     },
//   ];

//   return (
//     <main className="min-h-screen flex flex-col items-center justify-start pt-28 pb-20 px-6 bg-white text-black dark:bg-gradient-to-b dark:from-black dark:to-slate-950 dark:text-white transition-colors duration-300 relative opacity-80">
//       <BackgroundFX />

//       <div className="h-20 md:h-24"/>

//       {/* tagline */}
//       <div className="text-center mb-14">
//         <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
//           Plans for every quantitative trading decision.
//         </h1>
//         <p className="text-neutral-400 text-sm md:text-base mt-3">
//           Choose a plan that scales with your research and strategy development.
//         </p>
//       </div>

//       {/* toggle switch */}
//       <div className="flex items-center mb-14 space-x-4">
//         <span
//           className={`text-sm ${!isAnnual ? "text-teal-400" : "text-neutral-400"}`}
//         >
//           Monthly
//         </span>
//         <div
//           onClick={() => setIsAnnual(!isAnnual)}
//           className="w-14 h-7 bg-neutral-800 rounded-full cursor-pointer flex items-center px-1 transition"
//         >
//           <motion.div
//             layout
//             className="w-5 h-5 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full shadow-lg"
//             animate={{ x: isAnnual ? 28 : 0 }}
//             transition={{ type: "spring", stiffness: 400, damping: 25 }}
//           />
//         </div>
//         <span
//           className={`text-sm ${isAnnual ? "text-teal-400" : "text-neutral-400"}`}
//         >
//           Annual
//         </span>
//         <span className="text-xs text-neutral-500 ml-2">
//           {isAnnual && "Save 20%"}
//         </span>
//       </div>

//       {/* plans table */}
//       {/* <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-12">
//         {plans.map((plan, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
//             className={`relative w-full max-w-xl p-12 rounded-2xl border backdrop-blur-md bg-white/5 dark:bg-white/5 shadow-xl ${
//               plan.highlight
//                 ? "border-teal-400/40 ring-1 ring-teal-400/30 scale-105"
//                 : "border-white/10"
//             } transition-transform`}
//           >
//             {plan.highlight && (
//               <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-400 to-cyan-500 text-black text-xs font-semibold px-3 py-1 rounded-full">
//                 Best Value
//               </div>
//             )}

//             <h2 className="text-2xl font-semibold mb-3 text-center">
//               {plan.name}
//             </h2>

//             <AnimatePresence mode="wait">
//               <motion.p
//                 key={isAnnual ? "annual" : "monthly"}
//                 initial={{ opacity: 0, y: 8 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -8 }}
//                 transition={{ duration: 0.3 }}
//                 className="text-center text-5xl font-bold mb-6"
//               >
//                 {plan.priceMonthly === 0 ? (
//                   "$0"
//                 ) : isAnnual ? (
//                   <>
//                     ${plan.priceAnnual}{" "}
//                     <span className="text-sm text-neutral-400">/year</span>
//                   </>
//                 ) : (
//                   <>
//                     ${plan.priceMonthly}{" "}
//                     <span className="text-sm text-neutral-400">/month</span>
//                   </>
//                 )}
//               </motion.p>
//             </AnimatePresence>

//             <ul className="space-y-2 mb-8 text-sm text-neutral-300">
//               {plan.features.map((f, idx) => (
//                 <li key={idx} className="flex items-center gap-2">
//                   <span className="text-teal-400">•</span> {f}
//                 </li>
//               ))}
//             </ul>

//             <button
//               onClick={() => router.push(plan.href)}
//               className={`w-full py-3 rounded-md font-semibold hover:opacity-90 transition ${
//                 plan.highlight
//                   ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-black"
//                   : "bg-neutral-800 text-white border border-white/10"
//               }`}
//             >
//               {plan.buttonText}
//             </button>
//           </motion.div>
//         ))}
//       </div> */}

//       {/* plans table */}
//       <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-12">
//         {plans.map((plan, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
//             className={`relative w-full max-w-xl p-12 rounded-2xl border backdrop-blur-md bg-white/5 dark:bg-white/5 shadow-xl ${
//               plan.highlight
//                 ? "border-teal-400/40 ring-1 ring-teal-400/30 scale-105"
//                 : "border-white/10"
//             } transition-transform`}
//           >
//             {plan.highlight && (
//               <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-400 to-cyan-500 text-black text-xs font-semibold px-3 py-1 rounded-full">
//                 Best Value
//               </div>
//             )}

//             <h2 className="text-2xl font-semibold mb-3 text-center">
//               {plan.name}
//             </h2>

//             <AnimatePresence mode="wait">
//               <motion.p
//                 key={isAnnual ? "annual" : "monthly"}
//                 initial={{ opacity: 0, y: 8 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -8 }}
//                 transition={{ duration: 0.3 }}
//                 className="text-center text-5xl font-bold mb-6"
//               >
//                 {plan.priceMonthly === 0 ? (
//                   "$0"
//                 ) : isAnnual ? (
//                   <>
//                     ${plan.priceAnnual}{" "}
//                     <span className="text-sm text-neutral-400">/year</span>
//                   </>
//                 ) : (
//                   <>
//                     ${plan.priceMonthly}{" "}
//                     <span className="text-sm text-neutral-400">/month</span>
//                   </>
//                 )}
//               </motion.p>
//             </AnimatePresence>

//             <ul className="space-y-2 mb-8 text-sm text-neutral-300">
//               {plan.features.map((f, idx) => (
//                 <li key={idx} className="flex items-center gap-2">
//                   <span className="text-teal-400">•</span> {f}
//                 </li>
//               ))}
//             </ul>

//             {/* updated button logic */}
//             <button
//               onClick={() => {
//                 if (plan.name === "Essentials") {
//                   router.push(`/signup?billing=${isAnnual ? "yearly" : "monthly"}`);
//                 } else {
//                   router.push(plan.href);
//                 }
//               }}
//               className={`w-full py-3 rounded-md font-semibold hover:opacity-90 transition ${
//                 plan.highlight
//                   ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-black"
//                   : "bg-neutral-800 text-white border border-white/10"
//               }`}
//             >
//               {plan.buttonText}
//             </button>
//           </motion.div>
//         ))}
//       </div>


//       {/* footer */}
//       <footer className="mt-20 text-center text-sm text-neutral-500 pb-8">
//         © 2025 ApexQuantLabs — Built for systematic traders.
//       </footer>
//     </main>
//   );
// }



"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BackgroundFX from "../components/BackgroundFX";

export default function PricingPage() {
  const { setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, [setTheme]);

  // simplified to beta pricing
  const plans = [
    {
      name: "Free",
      price: 0,
      features: [
        "Access to core indicators",
        "Basic backtesting tools",
        "Limited tickers & intervals",
        "Community discussion board",
      ],
      buttonText: "Explore Free Tools",
      href: "/",
    },
    {
      name: "Essentials Beta",
      price: 19.99,
      features: [
        "All Free plan features",
        "Full backtesting engine",
        "Advanced indicator suite",
        "Unlimited tickers & datasets",
        "Priority email support",
        "Lifetime access — one-time payment",
      ],
      buttonText: "Get Lifetime Access",
      href: "/signup",
      highlight: true,
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-28 pb-20 px-6 bg-white text-black dark:bg-gradient-to-b dark:from-black dark:to-slate-950 dark:text-white transition-colors duration-300 relative opacity-80">
      <BackgroundFX />

      <div className="h-20 md:h-24" />

      {/* tagline */}
      <div className="text-center mb-14">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
          Plans for every quantitative trading decision.
        </h1>
        <p className="text-neutral-400 text-sm md:text-base mt-3">
          Beta Lifetime Access limited offer, get early access to ApexQuantLabs and unlock full features — one-time payment only.
        </p>
      </div>

      {/* plans table (no toggle) */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-12">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
            className={`relative w-full max-w-xl p-12 rounded-2xl border backdrop-blur-md bg-white/5 dark:bg-white/5 shadow-xl ${
              plan.highlight
                ? "border-teal-400/40 ring-1 ring-teal-400/30 scale-105"
                : "border-white/10"
            } transition-transform`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-400 to-cyan-500 text-black text-xs font-semibold px-3 py-1 rounded-full">
                Best Value
              </div>
            )}

            <h2 className="text-2xl font-semibold mb-3 text-center">
              {plan.name}
            </h2>

            <AnimatePresence mode="wait">
              <motion.p
                key={plan.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-center text-5xl font-bold mb-6"
              >
                {plan.price === 0 ? (
                  "$0"
                ) : (
                  <>
                    ${plan.price}{" "}
                    <span className="text-sm text-neutral-400"></span>
                  </>
                )}
              </motion.p>
            </AnimatePresence>

            <ul className="space-y-2 mb-8 text-sm text-neutral-300">
              {plan.features.map((f, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-teal-400">•</span> {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => router.push(plan.href)}
              className={`w-full py-3 rounded-md font-semibold hover:opacity-90 transition ${
                plan.highlight
                  ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-black"
                  : "bg-neutral-800 text-white border border-white/10"
              }`}
            >
              {plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>

      {/* footer */}
      <footer className="mt-20 text-center text-sm text-neutral-500 pb-8">
        © 2025 ApexQuantLabs — Built for systematic traders.
      </footer>
    </main>
  );
}
