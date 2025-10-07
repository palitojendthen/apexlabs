
// const query = `
//   SELECT open_time, open, high, low, close, volume
//   FROM \`${process.env.BQ_DATASET}.${process.env.BQ_TABLE}\`
//   WHERE symbol = @symbol
//   AND interval = @interval
//   AND open_time BETWEEN @start AND @end
//   ORDER BY open_time ASC
// `;

// const [rows] = await bigquery.query({
//   query,
//   params: {
//     symbol,
//     interval: timeframe, // changed key name
//     start: startDate,
//     end: endDate,
//   },
// });



// import { BigQuery } from "@google-cloud/bigquery";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { symbol, timeframe, startDate, endDate } = body;

//     const bigquery = new BigQuery({
//       projectId: process.env.PROJECT_ID,
//       keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
//     });

//     const query = `
//       SELECT open_time, open, high, low, close, volume
//       FROM \`${process.env.DATASET_ID}.${process.env.TABLE_ID}\`
//       WHERE symbol = @symbol
//       AND interval = @interval
//       AND open_time BETWEEN @start AND @end
//       ORDER BY open_time ASC
//     `;

//     const [rows] = await bigquery.query({
//       query,
//       params: {
//         symbol,
//         interval: timeframe,
//         start: startDate,
//         end: endDate,
//       },
//     });

//     return NextResponse.json({ data: rows });
//   } catch (err) {
//     console.error("BigQuery Error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }




// import { BigQuery } from "@google-cloud/bigquery";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { symbol, timeframe, startDate, endDate } = body;

//     const bigquery = new BigQuery({
//       projectId: process.env.PROJECT_ID,
//       keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
//     });

//     const query = `
//       SELECT open_time, open, high, low, close, volume
//       FROM \`${process.env.PROJECT_ID}.${process.env.DATASET_ID}.${process.env.TABLE_ID}\`
//       WHERE symbol = @symbol
//         AND interval = @interval
//         AND open_time BETWEEN @start AND @end
//       ORDER BY open_time ASC
//     `;

//     const [rows] = await bigquery.query({
//       query,
//       params: {
//         symbol,
//         interval: timeframe,
//         start: startDate,
//         end: endDate,
//       },
//     });

//     // Handle empty dataset
//     if (!rows || rows.length === 0) {
//       return NextResponse.json({ data: [] });
//     }

//     return NextResponse.json({ data: rows });
//   } catch (err) {
//     console.error("BigQuery Error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }




import { BigQuery } from "@google-cloud/bigquery";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

/** ---------- Build BigQuery Client ---------- */
function makeBQ() {
  const projectId = process.env.PROJECT_ID;

  // 1️⃣ Prefer JSON credentials from env (secure on Vercel / local)
  if (process.env.GCP_SERVICE_ACCOUNT) {
    const creds = JSON.parse(process.env.GCP_SERVICE_ACCOUNT);
    return new BigQuery({ projectId, credentials: creds });
  }

  // 2️⃣ Otherwise fall back to a key file
  const key = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (key) {
    const abs = path.isAbsolute(key) ? key : path.resolve(process.cwd(), key);
    if (fs.existsSync(abs)) {
      const creds = JSON.parse(fs.readFileSync(abs, "utf8"));
      return new BigQuery({ projectId, credentials: creds });
    }
  }

  // 3️⃣ Last resort: Application Default Credentials
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



