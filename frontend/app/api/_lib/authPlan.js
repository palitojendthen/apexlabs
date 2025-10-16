import { BigQuery } from "@google-cloud/bigquery";
import admin from "firebase-admin";

// Initialize firebase-admin once on the server
if (!admin.apps?.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

// Initialize BigQuery client
const bigquery = new BigQuery({
  projectId: process.env.GCP_PROJECT_ID,
});

/**
 * Reads the Firebase ID token from Authorization header,
 * verifies it, and fetches the user's plan_type from BigQuery.
 *
 * @param {Request} req - Next.js Request object
 * @returns {Promise<{decoded: object|null, plan: string}>}
 */
export async function getUserAndPlan(req) {
  // 1) Extract Bearer token
  const authHeader = req.headers.get("authorization") || "";
  const match = authHeader.match(/^Bearer (.+)$/);
  const idToken = match?.[1] || null;

  // If no token, treat as unauthenticated Free user
  if (!idToken) return { decoded: null, plan: "Free" };

  // 2) Verify the Firebase ID token
  let decoded = null;
  try {
    decoded = await admin.auth().verifyIdToken(idToken);
  } catch (e) {
    // Invalid/expired token -> treat as Free
    return { decoded: null, plan: "Free" };
  }

  // 3) Fetch plan from BigQuery by email
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
    // Fail-safe: don’t block users if BQ read fails — default to Free
    return { decoded, plan: "Free" };
  }
}