import { BigQuery } from "@google-cloud/bigquery";
import admin from "firebase-admin";

// initialize firebase-admin once on the server
if (!admin.apps?.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

// initialize bigquery client
const bigquery = new BigQuery({
  projectId: process.env.GCP_PROJECT_ID,
});

/**
 * reads the firebase id token from authorization header,
 * verifies it, and fetches the user's plan_type from bigquery
 *
 * @param {Request} req - next.js request object
 * @returns {Promise<{decoded: object|null, plan: string}>}
 */
export async function getUserAndPlan(req) {
  // extract bearer token
  const authHeader = req.headers.get("authorization") || "";
  const match = authHeader.match(/^Bearer (.+)$/);
  const idToken = match?.[1] || null;

  // if no token, treat as unauthenticated free user
  if (!idToken) return { decoded: null, plan: "Free" };

  // verify the firebase id token
  let decoded = null;
  try {
    decoded = await admin.auth().verifyIdToken(idToken);
  } catch (e) {
    // invalid/expired token -> treat as free
    return { decoded: null, plan: "Free" };
  }

  // fetch plan from bigquery by email
  try {
    const [rows] = await bigquery.query({
      query: `
        SELECT plan_type
        FROM apexquantlabs.customers
        WHERE email = @email
        ORDER BY signup_date DESC
        LIMIT 1
      `,
      params: { email: decoded.email },
      location: "US",
    });

    const plan = rows?.[0]?.plan_type || "Free";
    return { decoded, plan };
  } catch (err) {
    console.error("BigQuery plan fetch error:", err);
    // fail-safe: don’t block users if bq read fails — default to free
    return { decoded, plan: "Free" };
  }
}