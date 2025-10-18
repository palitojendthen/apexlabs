// import { BigQuery } from "@google-cloud/bigquery";
// import { NextResponse } from "next/server";
// import admin, { getSessionUser } from "../_lib/firebaseAdmin";

// const bigquery = new BigQuery({ projectId: process.env.PROJECT_ID });
// const datasetId = process.env.DATASET_ID || "apexquantlabs";
// const tableId = process.env.TABLE_ID_USER || "customers";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const {
//       email,
//       full_name,
//       plan_type = "Free",
//       billing_cycle = null,
//       background = "Prefer not to say",
//       customer_id = null,
//       token,
//     } = body;

//     // get uid from session cookie first; fallback to token if provided
//     let uid = null;
//     const sessionUser = await getSessionUser(req);
//     if (sessionUser?.uid) {
//       uid = sessionUser.uid;
//     } else if (token) {
//       const decoded = await admin.auth().verifyIdToken(token);
//       uid = decoded.uid;
//     }

//     if (!uid) {
//       return NextResponse.json(
//         { error: "No authenticated UID — set session first." },
//         { status: 401 }
//       );
//     }
//     if (!email) {
//       return NextResponse.json({ error: "Missing email" }, { status: 400 });
//     }

//     const signup_date = new Date();
//     let expiry_date = null;

//     // lifetime vs recurring
//     if (String(plan_type).toLowerCase().includes("lifetime")) {
//       expiry_date = null;
//     } else if (billing_cycle === "monthly") {
//       expiry_date = new Date(signup_date);
//       expiry_date.setMonth(expiry_date.getMonth() + 1);
//     } else if (billing_cycle === "yearly") {
//       expiry_date = new Date(signup_date);
//       expiry_date.setFullYear(expiry_date.getFullYear() + 1);
//     }

//     // merge (upsert) by uid
//     const query = `
//       MERGE \`${process.env.PROJECT_ID}.${datasetId}.${tableId}\` T
//       USING (SELECT @uid AS uid) S
//       ON T.uid = S.uid
//       WHEN MATCHED THEN
//         UPDATE SET
//           email = @email,
//           full_name = @full_name,
//           plan_type = @plan_type,
//           billing_cycle = @billing_cycle,
//           customer_id = @customer_id,
//           background = @background,
//           status = 'active',
//           expiry_date = @expiry_date
//       WHEN NOT MATCHED THEN
//         INSERT (uid, email, full_name, plan_type, billing_cycle, customer_id, signup_date, expiry_date, background, status)
//         VALUES (@uid, @email, @full_name, @plan_type, @billing_cycle, @customer_id, @signup_date, @expiry_date, @background, 'active')
//     `;

//     const params = {
//       uid,
//       email,
//       full_name,
//       plan_type,
//       billing_cycle,
//       customer_id,
//       signup_date: signup_date.toISOString(),
//       expiry_date: expiry_date ? expiry_date.toISOString() : null,
//       background,
//     };

//     // await bigquery.query({ query, params, location: "US" });
//     await bigquery.query({
//       query,
//       params,
//       types: {
//         uid: "STRING",
//         email: "STRING",
//         full_name: "STRING",
//         plan_type: "STRING",
//         billing_cycle: "STRING",
//         customer_id: "STRING",
//         signup_date: "TIMESTAMP",
//         expiry_date: "TIMESTAMP",
//         background: "STRING",
//       },
//       location: "asia-southeast2",
//     });

//     return NextResponse.json({ success: true, uid });
//   } catch (err) {
//     console.error("register_user error:", err);
//     return NextResponse.json(
//       { error: err.message || "Failed to register user" },
//       { status: 500 }
//     );
//   }
// }


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
      plan_type = "Free", // always default to Free/Pending at first
      billing_cycle = null,
      background = "Prefer not to say",
      customer_id = null,
      token,
    } = body;

    // get uid from session cookie first; fallback to token if provided
    let uid = null;
    const sessionUser = await getSessionUser(req);
    if (sessionUser?.uid) uid = sessionUser.uid;
    else if (token) {
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

    // always default to Free (we'll upgrade later after validation)
    const safePlanType = "Free";

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
          status = 'active'
      WHEN NOT MATCHED THEN
        INSERT (uid, email, full_name, plan_type, billing_cycle, customer_id, signup_date, background, status)
        VALUES (@uid, @email, @full_name, @plan_type, @billing_cycle, @customer_id, @signup_date, @background, 'active')
    `;

    const params = {
      uid,
      email,
      full_name,
      plan_type: safePlanType,
      billing_cycle,
      customer_id,
      signup_date: signup_date.toISOString(),
      background,
    };

    // await bigquery.query({ query, params, location: "US" });

      await bigquery.query({
        query,
        params,
        types: {
          uid: "STRING",
          email: "STRING",
          full_name: "STRING",
          plan_type: "STRING",
          billing_cycle: "STRING",
          customer_id: "STRING",
          signup_date: "TIMESTAMP",
          expiry_date: "TIMESTAMP",
          background: "STRING",
        },
        location: "asia-southeast2",
      });

    return NextResponse.json({ success: true, uid });
  } catch (err) {
    console.error("register_user error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to register user" },
      { status: 500 }
    );
  }
}