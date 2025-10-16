import { BigQuery } from "@google-cloud/bigquery";
import { NextResponse } from "next/server";

const bigquery = new BigQuery({
  projectId: process.env.GCP_PROJECT_ID,
});

export async function POST(req) {
  try {
    const { email, plan_type } = await req.json();

    if (!email || !plan_type) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const query = `
      UPDATE apexquantlabs.customers
      SET plan_type = @plan_type
      WHERE email = @email
    `;

    const options = {
      query,
      params: { email, plan_type },
      location: "US",
    };

    await bigquery.query(options);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating plan:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
