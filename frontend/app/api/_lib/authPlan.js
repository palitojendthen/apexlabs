import { BigQuery } from "@google-cloud/bigquery";
import admin from "firebase-admin";

// firebase admin init
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

// bigquery client setup
const bigquery = new BigQuery({
  projectId: process.env.PROJECT_ID,
});
const datasetId = process.env.DATASET_ID || "apexquantlabs";
const tableId = process.env.TABLE_ID_USER || "customers";

/**
 * Verifies Firebase session and retrieves the user's plan from BigQuery.
 * 
 * @param {Request} req - The incoming Next.js request (with cookies).
 * @param {string} [explicitUid] - Optional UID already decoded in get_plan.
 * @returns {Promise<{ user: object|null, plan: string }>}
 */
export async function getUserAndPlan(req, explicitUid = null) {
  try {
    let decoded = null;
    const cookieHeader = req.headers.get("cookie");

    // check for session cookie
    const match = cookieHeader?.match(/session=([^;]+)/);
    const sessionCookie = match ? match[1] : null;

    if (explicitUid) {
      decoded = { uid: explicitUid };
    } else if (sessionCookie) {
      decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
    } else {
      console.log("No session cookie in getUserAndPlan");
      return { user: null, plan: "Free" };
    }

    // lookup plan in bigquery
    const query = `
      SELECT plan_type
      FROM \`${process.env.PROJECT_ID}.${datasetId}.${tableId}\`
      WHERE uid = @uid
      LIMIT 1
    `;
    const options = { query, params: { uid: decoded.uid } };
    const [rows] = await bigquery.query(options);

    if (rows.length > 0) {
      const plan = rows[0].plan_type || "Free";
      console.log(`[getUserAndPlan] UID ${decoded.uid} → ${plan}`);
      return { user: decoded, plan };
    } else {
      console.log(`[getUserAndPlan] No record in BigQuery for UID ${decoded.uid}`);
      return { user: decoded, plan: "Free" };
    }

  } catch (err) {
    console.error("getUserAndPlan error:", err);
    return { user: null, plan: "Free" };
  }
}