// import { BigQuery } from "@google-cloud/bigquery";
// import admin from "firebase-admin";
// import { NextResponse } from "next/server";

// // --- Firebase Admin Initialization (safe single-instance)
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//     }),
//   });
// }

// const bigquery = new BigQuery();
// const datasetId = "apexquantlabs";
// const tableId = "customers";

// /**
//  * Handles user registration: inserts a record into BigQuery customers table.
//  * Works for both Free and Paid users.
//  */
// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const {
//       token,            // Firebase ID token (optional for Free plan)
//       email,
//       full_name,
//       plan_type = "Free",
//       billing_cycle = null,
//       background = "Prefer not to say",
//       customer_id = null,
//     } = body;

//     // --- Verify Firebase ID token (if provided)
//     let decoded = null;
//     if (token) {
//       decoded = await admin.auth().verifyIdToken(token);
//     }

//     // --- Prepare record fields
//     const uid = decoded?.uid || `guest_${Date.now()}`;
//     const signup_date = new Date();
//     const status = "active";
//     let expiry_date = null;

//     // Lifetime or recurring logic
//     if (plan_type.toLowerCase().includes("lifetime")) {
//       expiry_date = null;
//     } else if (billing_cycle === "monthly") {
//       expiry_date = new Date(signup_date);
//       expiry_date.setMonth(expiry_date.getMonth() + 1);
//     } else if (billing_cycle === "yearly") {
//       expiry_date = new Date(signup_date);
//       expiry_date.setFullYear(expiry_date.getFullYear() + 1);
//     }

//     // --- Insert into BigQuery
//     await bigquery.dataset(datasetId).table(tableId).insert([
//       {
//         uid,
//         email,
//         full_name,
//         plan_type,
//         billing_cycle,
//         customer_id,
//         signup_date: signup_date.toISOString(),
//         expiry_date: expiry_date ? expiry_date.toISOString() : null,
//         background,
//         status,
//       },
//     ]);

//     console.log(`[REGISTER_USER] Added ${email} (${plan_type}) to BigQuery`);
//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("Error adding user to BigQuery:", err);
//     return NextResponse.json(
//       { error: err.message || "Failed to register user" },
//       { status: 500 }
//     );
//   }
// }




// import { BigQuery } from "@google-cloud/bigquery";
// import admin from "firebase-admin";
// import { NextResponse } from "next/server";

// // --- Firebase Admin Initialization (safe single-instance)
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//     }),
//   });
// }

// const bigquery = new BigQuery({
//   projectId: process.env.PROJECT_ID,
// });
// const datasetId = process.env.DATASET_ID || "apexquantlabs";
// const tableId = process.env.TABLE_ID_USER || "customers";

// /**
//  * Handles user registration and inserts record into BigQuery.
//  * Always uses the Firebase UID for consistent identity.
//  */
// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const {
//       token,            // Firebase ID token (required to verify UID)
//       email,
//       full_name,
//       plan_type = "Free",
//       billing_cycle = null,
//       background = "Prefer not to say",
//       customer_id = null,
//     } = body;

//     // --- Require token to ensure valid Firebase UID
//     if (!token) {
//       return NextResponse.json(
//         { error: "Missing Firebase ID token" },
//         { status: 401 }
//       );
//     }

//     // --- Verify token and extract UID
//     const decoded = await admin.auth().verifyIdToken(token);
//     const uid = decoded.uid;

//     const signup_date = new Date();
//     const status = "active";
//     let expiry_date = null;

//     if (plan_type.toLowerCase().includes("lifetime")) {
//       expiry_date = null;
//     } else if (billing_cycle === "monthly") {
//       expiry_date = new Date(signup_date);
//       expiry_date.setMonth(expiry_date.getMonth() + 1);
//     } else if (billing_cycle === "yearly") {
//       expiry_date = new Date(signup_date);
//       expiry_date.setFullYear(expiry_date.getFullYear() + 1);
//     }

//     await bigquery.dataset(datasetId).table(tableId).insert([
//       {
//         uid,
//         email,
//         full_name,
//         plan_type,
//         billing_cycle,
//         customer_id,
//         signup_date: signup_date.toISOString(),
//         expiry_date: expiry_date ? expiry_date.toISOString() : null,
//         background,
//         status,
//       },
//     ]);

//     console.log(`[REGISTER_USER] Added ${email} (${plan_type}) [${uid}]`);
//     return NextResponse.json({ success: true, uid });
//   } catch (err) {
//     console.error("Error adding user to BigQuery:", err);
//     return NextResponse.json(
//       { error: err.message || "Failed to register user" },
//       { status: 500 }
//     );
//   }
// }


// /app/api/register_user/route.js
import { BigQuery } from "@google-cloud/bigquery";
import { NextResponse } from "next/server";
import admin, { getSessionUser } from "../_lib/firebaseAdmin";

const bigquery = new BigQuery({ projectId: process.env.PROJECT_ID });
const datasetId = process.env.DATASET_ID || "apexquantlabs";
const tableId = process.env.TABLE_ID_USER || "customers";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      email,
      full_name,
      plan_type = "Free",
      billing_cycle = null,
      background = "Prefer not to say",
      customer_id = null,
      token, // optional: if you want to pass ID token directly
    } = body;

    // Get UID from session cookie first; fallback to token if provided
    let uid = null;
    const sessionUser = await getSessionUser(req);
    if (sessionUser?.uid) {
      uid = sessionUser.uid;
    } else if (token) {
      const decoded = await admin.auth().verifyIdToken(token);
      uid = decoded.uid;
    }

    if (!uid) {
      return NextResponse.json(
        { error: "No authenticated UID — set session first." },
        { status: 401 }
      );
    }
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const signup_date = new Date();
    let expiry_date = null;

    // Lifetime vs recurring
    if (String(plan_type).toLowerCase().includes("lifetime")) {
      expiry_date = null;
    } else if (billing_cycle === "monthly") {
      expiry_date = new Date(signup_date);
      expiry_date.setMonth(expiry_date.getMonth() + 1);
    } else if (billing_cycle === "yearly") {
      expiry_date = new Date(signup_date);
      expiry_date.setFullYear(expiry_date.getFullYear() + 1);
    }

    // MERGE (upsert) by uid
    const query = `
      MERGE \`${process.env.PROJECT_ID}.${datasetId}.${tableId}\` T
      USING (SELECT @uid AS uid) S
      ON T.uid = S.uid
      WHEN MATCHED THEN
        UPDATE SET
          email = @email,
          full_name = @full_name,
          plan_type = @plan_type,
          billing_cycle = @billing_cycle,
          customer_id = @customer_id,
          background = @background,
          status = 'active',
          expiry_date = @expiry_date
      WHEN NOT MATCHED THEN
        INSERT (uid, email, full_name, plan_type, billing_cycle, customer_id, signup_date, expiry_date, background, status)
        VALUES (@uid, @email, @full_name, @plan_type, @billing_cycle, @customer_id, @signup_date, @expiry_date, @background, 'active')
    `;

    const params = {
      uid,
      email,
      full_name,
      plan_type,
      billing_cycle,
      customer_id,
      signup_date: signup_date.toISOString(),
      expiry_date: expiry_date ? expiry_date.toISOString() : null,
      background,
    };

    await bigquery.query({ query, params, location: "US" });

    return NextResponse.json({ success: true, uid });
  } catch (err) {
    console.error("register_user error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to register user" },
      { status: 500 }
    );
  }
}