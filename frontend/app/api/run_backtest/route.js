import { spawn } from "child_process";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(req) {
  try {
    const body = await req.json();

    // absolute path to the python script
    const scriptPath = path.resolve("backend/backtest/backtest.py");

    return await new Promise((resolve) => {
      const py = spawn("python", [scriptPath]);
      let stdout = "";
      let stderr = "";

      py.stdout.on("data", (data) => (stdout += data.toString()));
      py.stderr.on("data", (data) => (stderr += data.toString()));

      py.on("close", (code) => {
        if (code !== 0) {
          console.error("Python error:", stderr);
          resolve(
            NextResponse.json(
              { error: stderr || "Python script failed" },
              { status: 500 }
            )
          );
          return;
        }

        try {
          const json = JSON.parse(stdout);
          resolve(NextResponse.json(json));
        } catch (err) {
          console.error("JSON parse error:", err, stdout);
          resolve(
            NextResponse.json(
              { error: "Failed to parse Python output" },
              { status: 500 }
            )
          );
        }
      });

      // write JSON input to python stdin
      py.stdin.write(JSON.stringify(body));
      py.stdin.end();
    });
  } catch (err) {
    console.error("Route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
