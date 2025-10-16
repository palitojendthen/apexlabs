// import { spawn } from "child_process";
// import { NextResponse } from "next/server";
// import path from "path";

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     // go one directory up from frontend to reach /backend/backtest/backtest.py
//     const scriptPath = path.resolve(process.cwd(), "..", "backend", "backtest", "backtest.py");

//     console.log("[run_backtest] Executing Python script:", scriptPath);

//     const py = spawn("python", [scriptPath], { stdio: ["pipe", "pipe", "pipe"] });

//     py.stdin.write(JSON.stringify(body));
//     py.stdin.end();

//     let stdout = "";
//     let stderr = "";
//     py.stdout.on("data", (chunk) => (stdout += chunk.toString()));
//     py.stderr.on("data", (chunk) => (stderr += chunk.toString()));

//     const result = await new Promise((resolve, reject) => {
//     py.on("close", (code) => {
//       if (code !== 0) {
//         console.error("[Python ERROR]", stderr);
//         return reject(new Error(stderr || `Python exited with code ${code}`));
//       }

//     try {
//       const clean = stdout.trim();

//       // find first '{' and last '}'
//       const first = clean.indexOf("{");
//       const last = clean.lastIndexOf("}");

//       if (first === -1 || last === -1) {
//         throw new Error("No JSON braces found in Python output");
//       }

//       const jsonCandidate = clean.slice(first, last + 1);

//       // validate before parsing
//       let parsed;
//       try {
//         parsed = JSON.parse(jsonCandidate);
//       } catch (innerErr) {
//         console.error("[JSON Parse Inner ERROR]", innerErr);
//         console.error("[JSON Candidate Snippet]", jsonCandidate.slice(0, 300));
//         throw new Error("Invalid JSON structure returned from Python");
//       }

//       resolve(parsed);
//     } catch (err) {
//       console.error("[JSON Parse ERROR]", stdout);
//       reject(new Error("Invalid JSON returned from Python:\n" + stdout));
//     }

//     });
//   });

//     return NextResponse.json(result, { status: 200 });
//   } catch (err) {
//     console.error("[run_backtest API ERROR]", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }




import { spawn } from "child_process";
import { NextResponse } from "next/server";
import path from "path";

// ✅ Add these imports
import { getUserAndPlan } from "../_lib/authPlan";
import { ensurePremium } from "../_lib/guards";

const PREMIUM_TIMEFRAMES = new Set(["6H", "4H", "2H", "1H"]);
const PREMIUM_INDICATORS = new Set([
  "KAMA",
  "Instantaneous Trendline",
  "Predictive Moving Average",
]);

function isPremiumRequest(body) {
  const tf = (body?.timeframe || "").toUpperCase();
  const indicators = (body?.indicators || []).map((i) => (i?.name || "").trim());
  return (
    PREMIUM_TIMEFRAMES.has(tf) ||
    indicators.some((n) => PREMIUM_INDICATORS.has(n))
  );
}

export async function POST(req) {
  try {
    // 🔹 1. Get user + plan
    const { plan } = await getUserAndPlan(req);
    const body = await req.json();

    // 🔹 2. Enforce premium if necessary
    if (isPremiumRequest(body)) {
      ensurePremium(plan);
    }

    // 🔹 3. Proceed with your existing Python logic
    const scriptPath = path.resolve(
      process.cwd(),
      "..",
      "backend",
      "backtest",
      "backtest.py"
    );

    console.log("[run_backtest] Executing Python script:", scriptPath);

    const py = spawn("python", [scriptPath], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    py.stdin.write(JSON.stringify(body));
    py.stdin.end();

    let stdout = "";
    let stderr = "";
    py.stdout.on("data", (chunk) => (stdout += chunk.toString()));
    py.stderr.on("data", (chunk) => (stderr += chunk.toString()));

    const result = await new Promise((resolve, reject) => {
      py.on("close", (code) => {
        if (code !== 0) {
          console.error("[Python ERROR]", stderr);
          return reject(new Error(stderr || `Python exited with code ${code}`));
        }

        try {
          const clean = stdout.trim();
          const first = clean.indexOf("{");
          const last = clean.lastIndexOf("}");
          if (first === -1 || last === -1)
            throw new Error("No JSON braces found in Python output");

          const jsonCandidate = clean.slice(first, last + 1);
          const parsed = JSON.parse(jsonCandidate);
          resolve(parsed);
        } catch (err) {
          console.error("[JSON Parse ERROR]", stdout);
          reject(new Error("Invalid JSON returned from Python:\n" + stdout));
        }
      });
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("[run_backtest API ERROR]", err);
    const status = err?.status || 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}