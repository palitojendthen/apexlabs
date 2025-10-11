import { BigQuery } from "@google-cloud/bigquery";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

function makeBQ() {
  const projectId = process.env.PROJECT_ID;
  if (process.env.GCP_SERVICE_ACCOUNT) {
    const creds = JSON.parse(process.env.GCP_SERVICE_ACCOUNT);
    return new BigQuery({ projectId, credentials: creds });
  }
  const key = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (key) {
    const abs = path.isAbsolute(key) ? key : path.resolve(process.cwd(), key);
    if (fs.existsSync(abs)) {
      const creds = JSON.parse(fs.readFileSync(abs, "utf8"));
      return new BigQuery({ projectId, credentials: creds });
    }
  }
  return new BigQuery({ projectId });
}

// number of bars to return for free plan if dates not set
const FREE_MAX_BARS = 1000;

// convert timeframe to ms per bar (approx)
function barMs(tf) {
  switch (tf) {
    case "1h": return 60 * 60 * 1000;
    case "2h": return 2 * 60 * 60 * 1000;
    case "4h": return 4 * 60 * 60 * 1000;
    case "6h": return 6 * 60 * 60 * 1000;
    case "12h": return 12 * 60 * 60 * 1000;
    case "1w": return 7 * 24 * 60 * 60 * 1000;
    case "1d":
    default:   return 24 * 60 * 60 * 1000;
  }
}

export async function POST(req) {
  const bq = makeBQ();

  try {
    const { symbol, timeframe, startDate, endDate } = await req.json();

    const sym = (symbol || "").toUpperCase().trim();
    const itv = (timeframe || "").toLowerCase().trim();

    // derive start/end if not fully provided (free-plan cap)
    let start = (startDate || "").trim();
    let end   = (endDate || "").trim();

    if (!start || !end) {
      const endObj = end ? new Date(end) : new Date(); // now
      const windowMs = (FREE_MAX_BARS - 1) * barMs(itv || "1d");
      const startObj = start ? new Date(start) : new Date(endObj.getTime() - windowMs);

      // normalize to YYYY-MM-DD so BigQuery will coerce to TIMESTAMP
      const toYMD = (d) => d.toISOString().slice(0, 10);
      start = toYMD(startObj);
      end   = toYMD(endObj);
    }

    const project = process.env.PROJECT_ID;
    const dataset = process.env.DATASET_ID;
    const table = process.env.TABLE_ID;
    const fqn = `\`${project}.${dataset}.${table}\``;

    // parameterized query; note backticks for reserved `interval`
    const query = `
      SELECT t.open_time, t.open, t.high, t.low, t.close, t.volume
      FROM ${fqn} AS t
      WHERE UPPER(t.symbol) = @symbol
        AND LOWER(t.\`interval\`) = @interval
        AND t.open_time BETWEEN @start AND @end
      ORDER BY t.open_time ASC
      LIMIT @limit
    `;

    const params = {
      symbol: sym,
      interval: itv,
      start,
      end,
      limit: FREE_MAX_BARS,
    };

    console.log("[DEBUG FINAL QUERY]", query.replace(/\s+/g, " ").trim());
    console.log("[DEBUG PARAMS]", params);

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
