// import { BigQuery } from "@google-cloud/bigquery";
// import admin from "firebase-admin";

// // initialize firebase-admin once on the server
// if (!admin.apps?.length) {
//   admin.initializeApp({
//     credential: admin.credential.applicationDefault(),
//   });
// }

// // initialize bigquery client
// const bigquery = new BigQuery({
//   projectId: process.env.GCP_PROJECT_ID,
// });

// /**
//  * reads the firebase id token from authorization header,
//  * verifies it, and fetches the user's plan_type from bigquery
//  *
//  * @param {Request} req - next.js request object
//  * @returns {Promise<{decoded: object|null, plan: string}>}
//  */
// export async function getUserAndPlan(req) {
//   // extract bearer token
//   const authHeader = req.headers.get("authorization") || "";
//   const match = authHeader.match(/^Bearer (.+)$/);
//   const idToken = match?.[1] || null;

//   // if no token, treat as unauthenticated free user
//   if (!idToken) return { decoded: null, plan: "Free" };

//   // verify the firebase id token
//   let decoded = null;
//   try {
//     decoded = await admin.auth().verifyIdToken(idToken);
//   } catch (e) {
//     // invalid/expired token -> treat as free
//     return { decoded: null, plan: "Free" };
//   }

//   // fetch plan from bigquery by email
//   try {
//     const [rows] = await bigquery.query({
//       query: `
//         SELECT plan_type
//         FROM apexquantlabs.customers
//         WHERE email = @email
//         ORDER BY signup_date DESC
//         LIMIT 1
//       `,
//       params: { email: decoded.email },
//       location: "US",
//     });

//     const plan = rows?.[0]?.plan_type || "Free";
//     return { decoded, plan };
//   } catch (err) {
//     console.error("BigQuery plan fetch error:", err);
//     // fail-safe: don’t block users if bq read fails — default to free
//     return { decoded, plan: "Free" };
//   }
// }



// import admin from "firebase-admin";

// // 🧩 Initialize Firebase Admin safely (only once)
// if (!admin.apps.length) {
//   try {
//     admin.initializeApp({
//       credential: admin.credential.cert({
//         projectId: process.env.PROJECT_ID,
//         clientEmail: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN.includes("firebaseapp.com")
//           ? `firebase-adminsdk@${process.env.NEXT_PUBLIC_FB_PROJECT_ID}.iam.gserviceaccount.com`
//           : process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN, // fallback
//         privateKey: process.env.GOOGLE_APPLICATION_CREDENTIALS
//           ? JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS).private_key
//           : undefined,
//       }),
//     });
//     console.log("✅ Firebase Admin initialized");
//   } catch (err) {
//     console.error("🔥 Firebase Admin initialization failed:", err);
//   }
// }

// // ✅ Verify Firebase ID token from Authorization header
// export async function getUserAndPlan(req) {
//   const authHeader = req.headers.get("authorization") || "";
//   const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

//   if (!token) {
//     console.log("No auth token found in /api/get_plan");
//     return { user: null, plan: "Free" };
//   }

//   try {
//     const decoded = await admin.auth().verifyIdToken(token);
//     console.log("✅ Firebase token verified:", decoded.uid);

//     // In production you'd fetch the plan from BigQuery or Firestore
//     return { user: decoded, plan: "Essentials_Beta" };
//   } catch (err) {
//     console.error("Token verification failed:", err);
//     return { user: null, plan: "Free" };
//   }
// }



// import admin from "firebase-admin";
// import fs from "fs";

// // ------------------------------------------
// // Initialize Firebase Admin safely (only once)
// // ------------------------------------------
// if (!admin.apps.length) {
//   try {
//     let serviceAccount;

//     // Case 1: file path to firebase-admin.json
//     if (
//       process.env.FB_ADMIN_CREDENTIALS &&
//       fs.existsSync(process.env.FB_ADMIN_CREDENTIALS)
//     ) {
//       const raw = fs.readFileSync(process.env.FB_ADMIN_CREDENTIALS, "utf8");
//       serviceAccount = JSON.parse(raw);
//     }
//     // Case 2: directly a JSON string in env
//     else if (process.env.FB_ADMIN_CREDENTIALS?.trim().startsWith("{")) {
//       serviceAccount = JSON.parse(process.env.FB_ADMIN_CREDENTIALS);
//     } else {
//       throw new Error("FB_ADMIN_CREDENTIALS missing or invalid");
//     }

//     admin.initializeApp({
//       credential: admin.credential.cert({
//         projectId: serviceAccount.project_id,
//         clientEmail: serviceAccount.client_email,
//         privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
//       }),
//     });

//     console.log("✅ Firebase Admin initialized successfully");
//   } catch (err) {
//     console.error("🔥 Firebase Admin initialization failed:", err);
//   }
// }

// // ------------------------------------------
// // Verify Firebase ID token from Authorization header
// // ------------------------------------------
// export async function getUserAndPlan(req) {
//   const authHeader = req.headers.get("authorization") || "";
//   const token = authHeader.startsWith("Bearer ")
//     ? authHeader.split(" ")[1]
//     : null;

//   if (!token) {
//     console.log("No auth token found in /api/get_plan");
//     return { user: null, plan: "Free" };
//   }

//   try {
//     const decoded = await admin.auth().verifyIdToken(token);
//     console.log("✅ Firebase token verified for:", decoded.uid);
//     // Placeholder: later we’ll query BigQuery for real plan
//     return { user: decoded, plan: "Essentials_Beta" };
//   } catch (err) {
//     console.error("Token verification failed:", err);
//     return { user: null, plan: "Free" };
//   }
// }



// import admin from "firebase-admin";

// // ... your existing admin initialization stays ...
// // DO NOT change your working admin.initializeApp part.

// // Helper: extract token from header or cookie
// function extractToken(req) {
//   // 1) Try Authorization header
//   const authHeader = req.headers.get("authorization") || "";
//   if (authHeader.startsWith("Bearer ")) {
//     return authHeader.slice("Bearer ".length);
//   }

//   // 2) Try cookie header
//   const cookieHeader = req.headers.get("cookie") || "";
//   // naive parse for "session="
//   const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/);
//   if (match) {
//     try {
//       // Cookies are URL-encoded
//       return decodeURIComponent(match[1]);
//     } catch {
//       return match[1];
//     }
//   }
//   return null;
// }

// export async function getUserAndPlan(req) {
//   const token = extractToken(req);

//   if (!token) {
//     console.log("No auth token found in /api/get_plan");
//     return { user: null, plan: "Free" };
//   }

//   try {
//     const decoded = await admin.auth().verifyIdToken(token);
//     // TODO: look up plan from BigQuery customers by decoded.uid if you want
//     return { user: decoded, plan: "Essentials_Beta" }; // or whatever your logic returns
//   } catch (err) {
//     console.error("Token verification failed:", err);
//     return { user: null, plan: "Free" };
//   }
// }



// import admin from "firebase-admin";
// import fs from "fs";

// let app; // global app reference

// if (!admin.apps.length) {
//   try {
//     let serviceAccount;

//     // load firebase-admin.json from env path (just like GCP key)
//     if (process.env.FB_ADMIN_CREDENTIALS && fs.existsSync(process.env.FB_ADMIN_CREDENTIALS)) {
//       const raw = fs.readFileSync(process.env.FB_ADMIN_CREDENTIALS, "utf8");
//       serviceAccount = JSON.parse(raw);
//     } else {
//       throw new Error("FB_ADMIN_CREDENTIALS missing or invalid");
//     }

//     app = admin.initializeApp({
//       credential: admin.credential.cert({
//         projectId: serviceAccount.project_id,
//         clientEmail: serviceAccount.client_email,
//         privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
//       }),
//     });

//     console.log("✅ Firebase Admin initialized successfully");
//   } catch (err) {
//     console.error("🔥 Firebase Admin initialization failed:", err);
//   }
// } else {
//   app = admin.app();
// }

// // export helper
// export async function getUserAndPlan(req) {
//   const authHeader = req.headers.get("authorization") || "";
//   const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

//   if (!token) {
//     console.log("No auth token found in /api/get_plan");
//     return { user: null, plan: "Free" };
//   }

//   try {
//     const decoded = await admin.auth().verifyIdToken(token);
//     console.log("✅ Firebase token verified:", decoded.uid);

//     // TODO: lookup user from BigQuery customers table by decoded.uid if needed
//     return { user: decoded, plan: "Essentials_Beta" };
//   } catch (err) {
//     console.error("Token verification failed:", err);
//     return { user: null, plan: "Free" };
//   }
// }

import { BigQuery } from "@google-cloud/bigquery";
import admin from "firebase-admin";

// --- Firebase Admin init (singleton)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

// --- BigQuery client setup
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

    // Check for session cookie
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

    // --- Lookup plan in BigQuery
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