import { BigQuery } from "@google-cloud/bigquery";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

/** ---------- Build BigQuery Client ---------- */
function makeBQ() {
  const projectId = process.env.PROJECT_ID;

  // Prefer JSON credentials from env (secure on Vercel / local)
  if (process.env.GCP_SERVICE_ACCOUNT) {
    const creds = JSON.parse(process.env.GCP_SERVICE_ACCOUNT);
    return new BigQuery({ projectId, credentials: creds });
  }

  // Otherwise fall back to a key file
  const key = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (key) {
    const abs = path.isAbsolute(key) ? key : path.resolve(process.cwd(), key);
    if (fs.existsSync(abs)) {
      const creds = JSON.parse(fs.readFileSync(abs, "utf8"));
      return new BigQuery({ projectId, credentials: creds });
    }
  }

  // Last resort: Application Default Credentials
  return new BigQuery({ projectId });
}

/** ---------- API Route ---------- */
export async function POST(req) {
  const bq = makeBQ();

  try {
    const { symbol, timeframe, startDate, endDate } = await req.json();

    // normalize + sanitize
    const sym = (symbol || "").toUpperCase().trim();
    const itv = (timeframe || "").toLowerCase().trim();
    const start = (startDate || "").trim();
    const end = (endDate || "").trim();

    const project = process.env.PROJECT_ID;
    const dataset = process.env.DATASET_ID;
    const table = process.env.TABLE_ID;
    const fqn = `\`${project}.${dataset}.${table}\``;

    // base query
    let query = `
      SELECT 
        t.open_time, t.open, t.high, t.low, t.close, t.volume
      FROM ${fqn} AS t
      WHERE UPPER(t.symbol) = @symbol
        AND LOWER(t.\`interval\`) = @interval
    `;

    const params = { symbol: sym, interval: itv };

    // optional date range (paid plan)
    if (start && end) {
      query += `
        AND t.open_time BETWEEN CAST(@start AS TIMESTAMP) AND CAST(@end AS TIMESTAMP)
      `;
      params.start = start;
      params.end = end;
    }

    query += `
      ORDER BY t.open_time ASC
      LIMIT 5000
    `;

    // --- Debug log ---
    console.log("[DEBUG FINAL QUERY]", query.replace(/\s+/g, " ").trim());
    console.log("[DEBUG PARAMS]", params);

    // --- Execute ---
    const [rows] = await bq.query({ query, params });

    console.log("[/api/fetch_data] rowCount:", rows?.length ?? 0);

    return NextResponse.json({ data: rows || [] });
  } catch (err) {
    console.error("[/api/fetch_data] ERROR:", err?.message, err);
    return NextResponse.json(
      { error: err?.message || "BigQuery failed" },
      { status: 500 }
    );
  }
}



