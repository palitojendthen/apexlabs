import { spawn } from "child_process";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(req) {
  try {
    const body = await req.json();

    // go one directory up from frontend to reach /backend/backtest/backtest.py
    const scriptPath = path.resolve(process.cwd(), "..", "backend", "backtest", "backtest.py");

    console.log("[run_backtest] Executing Python script:", scriptPath);

    const py = spawn("python", [scriptPath], { stdio: ["pipe", "pipe", "pipe"] });

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

      // try {
      //   const clean = stdout.trim();

      //   // find first "{" and last "}"
      //   const first = clean.indexOf("{");
      //   const last = clean.lastIndexOf("}");
      //   if (first === -1 || last === -1) throw new Error("No JSON braces found");

      //   const jsonCandidate = clean.slice(first, last + 1);
      //   const parsed = JSON.parse(jsonCandidate);

      //   resolve(parsed);
      // } catch (err) {
      //   console.error("[JSON Parse ERROR]", stdout);
      //   reject(new Error("Invalid JSON returned from Python:\n" + stdout));
      // }

    try {
      const parsed = JSON.parse(stdout.trim());
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}