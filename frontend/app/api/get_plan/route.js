import { BigQuery } from "@google-cloud/bigquery";
import { NextResponse } from "next/server";
import { getSessionUser } from "../_lib/firebaseAdmin";

const bigquery = new BigQuery({ projectId: process.env.PROJECT_ID });
const datasetId = process.env.DATASET_ID || "apexquantlabs";
const tableId = process.env.TABLE_ID_USER || "customers";

export async function GET(req) {
  try {
    const decoded = await getSessionUser(req);
    if (!decoded?.uid) {
      return NextResponse.json({ plan: "Free", uid: null }, { status: 401 });
    }

    const query = `
      SELECT plan_type, email
      FROM \`${process.env.PROJECT_ID}.${datasetId}.${tableId}\`
      WHERE uid = @uid
      LIMIT 1
    `;
    const [rows] = await bigquery.query({ query, params: { uid: decoded.uid } });

    const plan = rows?.[0]?.plan_type || "Free";
    const email = rows?.[0]?.email || decoded.email || null;

    return NextResponse.json({ uid: decoded.uid, email, plan }, { status: 200 });
  } catch (err) {
    console.error("get_plan error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}