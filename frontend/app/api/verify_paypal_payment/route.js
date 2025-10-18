import { BigQuery } from "@google-cloud/bigquery";
import { NextResponse } from "next/server";

const PAYPAL_API =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const bigquery = new BigQuery({ projectId: process.env.PROJECT_ID });
const datasetId = process.env.DATASET_ID || "apexquantlabs";
const tableId = process.env.TABLE_ID_USER || "customers";

export async function POST(req) {
  try {
    const { orderID, email } = await req.json();
    if (!orderID || !email) {
      return NextResponse.json(
        { error: "Missing orderID or email" },
        { status: 400 }
      );
    }

    // 1️⃣ Get PayPal access token
    const basicAuth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");
    const tokenRes = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2️⃣ Verify the PayPal order
    const verifyRes = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const order = await verifyRes.json();

    if (order.status !== "COMPLETED") {
      console.warn("❌ PayPal order not completed:", order.status);
      return NextResponse.json(
        { verified: false, reason: order.status },
        { status: 400 }
      );
    }

    // 3️⃣ Update BigQuery plan_type → Essentials
    const query = `
      UPDATE \`${process.env.PROJECT_ID}.${datasetId}.${tableId}\`
      SET plan_type = 'Essentials', status = 'active'
      WHERE email = @email
    `;
    await bigquery.query({ query, params: { email }, location: "US" });

    console.log(`✅ Verified PayPal payment for ${email}, upgraded plan.`);
    return NextResponse.json({ verified: true, plan: "Essentials" });
  } catch (err) {
    console.error("verify_paypal_payment error:", err);
    return NextResponse.json(
      { error: err.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}