// import { NextResponse } from "next/server";
// import { getUserAndPlan } from "../_lib/authPlan";

// export async function GET(req) {
//   try {
//     const { user, plan } = await getUserAndPlan(req);
//     if (!user) {
//       return NextResponse.json({ plan: "Free", uid: null }, { status: 401 });
//     }

//     return NextResponse.json({ plan, uid: user.uid }, { status: 200 });
//   } catch (err) {
//     console.error("get_plan error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }


// import { NextResponse } from "next/server";
// import { getUserAndPlan } from "../_lib/authPlan";

// export async function GET(req) {
//   try {
//     // Extract the Firebase ID token from Authorization header or cookies
//     let token = null;

//     // try Authorization header first
//     const authHeader = req.headers.get("Authorization");
//     if (authHeader && authHeader.startsWith("Bearer ")) {
//       token = authHeader.split("Bearer ")[1];
//     }

//     // fallback: if running client-side fetch without explicit headers, try cookie
//     if (!token) {
//       const cookieHeader = req.headers.get("cookie");
//       if (cookieHeader) {
//         const match = cookieHeader.match(/token=([^;]+)/);
//         if (match) token = match[1];
//       }
//     }

//     // If still no token, assume user not logged in
//     if (!token) {
//       console.warn("No auth token found in /api/get_plan");
//       return NextResponse.json({ plan: "Free", uid: null }, { status: 401 });
//     }

//     // validate via helper
//     const { user, plan } = await getUserAndPlan(req);

//     if (!user) {
//       console.warn("getUserAndPlan returned null user");
//       return NextResponse.json({ plan: "Free", uid: null }, { status: 401 });
//     }

//     return NextResponse.json(
//       { plan: plan || "Free", uid: user.uid },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("get_plan error:", err);
//     // always return valid JSON (never HTML or raw text)
//     return NextResponse.json(
//       { error: err.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }



// import admin from "firebase-admin";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";
// import { getUserAndPlan } from "../_lib/authPlan";

// // --- Firebase Admin initialization (singleton)
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//     }),
//   });
// }

// export async function GET(req) {
//   try {
//     const cookieStore = cookies();
//     const sessionCookie = cookieStore.get("session")?.value;

//     // 🧩 1️⃣ Check if session cookie exists
//     if (!sessionCookie) {
//       console.warn("No auth token found in /api/get_plan");
//       return NextResponse.json({ plan: "Free", uid: null }, { status: 401 });
//     }

//     // 🧩 2️⃣ Verify Firebase session cookie
//     let decoded = null;
//     try {
//       decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
//     } catch (err) {
//       console.warn("Invalid or expired session cookie in /api/get_plan:", err.message);
//       return NextResponse.json({ plan: "Free", uid: null }, { status: 401 });
//     }

//     // 🧩 3️⃣ Optionally cross-check user plan from BigQuery via your helper
//     let plan = "Free";
//     try {
//       const planResult = await getUserAndPlan(req, decoded.uid);
//       if (planResult?.plan) plan = planResult.plan;
//     } catch (lookupErr) {
//       console.warn("Plan lookup failed:", lookupErr.message);
//     }

//     // 🧩 4️⃣ Respond with verified UID and plan
//     return NextResponse.json(
//       {
//         uid: decoded.uid,
//         email: decoded.email,
//         plan,
//       },
//       { status: 200 }
//     );

//   } catch (err) {
//     console.error("get_plan error:", err);
//     return NextResponse.json(
//       { error: err.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }



// import admin from "firebase-admin";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";
// import { getUserAndPlan } from "../_lib/authPlan";

// // --- Firebase Admin initialization (singleton)
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//     }),
//   });
// }

// export async function GET(req) {
//   try {
//     // 🔹 1. get session cookie
//     const cookieStore = cookies();
//     const sessionCookie = cookieStore.get("session")?.value;

//     if (!sessionCookie) {
//       console.warn("No auth token found in /api/get_plan");
//       return NextResponse.json({ plan: "Free", uid: null }, { status: 401 });
//     }

//     // 🔹 2. verify Firebase session cookie
//     const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);

//     // 🔹 3. use helper to check BigQuery for actual plan
//     const { plan } = await getUserAndPlan(req, decoded.uid);

//     // 🔹 4. return consistent JSON response
//     return NextResponse.json(
//       {
//         uid: decoded.uid,
//         email: decoded.email,
//         plan: plan || "Free",
//       },
//       { status: 200 }
//     );

//   } catch (err) {
//     console.error("get_plan error:", err);
//     return NextResponse.json(
//       { error: err.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }




// /app/api/get_plan/route.js
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