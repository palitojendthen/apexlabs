// import { NextResponse } from "next/server";

// /**
//  * POST /api/session
//  * Body: { token: "<firebase id token>" }
//  * Sets a httpOnly cookie so server routes can identify the user without headers.
//  */
// export async function POST(req) {
//   try {
//     const { token } = await req.json();
//     if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

//     const res = NextResponse.json({ ok: true });
//     // httpOnly cookie readable by server only
//     res.cookies.set("session", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: 60 * 60, // 1 hour (idToken lifetime)
//     });
//     return res;
//   } catch (err) {
//     console.error("session POST error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// /**
//  * DELETE /api/session
//  * Clears the session cookie on sign-out.
//  */
// export async function DELETE() {
//   const res = NextResponse.json({ ok: true });
//   res.cookies.set("session", "", { httpOnly: true, path: "/", maxAge: 0 });
//   return res;
// }




// import admin from "firebase-admin";
// import { NextResponse } from "next/server";

// // --- Firebase Admin initialization
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//     }),
//   });
// }

// /**
//  * Creates a secure HttpOnly session cookie from Firebase ID token
//  */
// export async function POST(req) {
//   try {
//     const { token } = await req.json();
//     if (!token) {
//       return NextResponse.json({ error: "Missing token" }, { status: 400 });
//     }

//     // Verify the token
//     const decoded = await admin.auth().verifyIdToken(token);

//     // Create a secure session cookie (valid for 7 days)
//     const expiresIn = 7 * 24 * 60 * 60 * 1000;
//     const sessionCookie = await admin.auth().createSessionCookie(token, { expiresIn });

//     const response = NextResponse.json({
//       success: true,
//       uid: decoded.uid,
//       email: decoded.email,
//     });

//     // ✅ Set cookie so /api/get_plan can read it later
//     response.cookies.set("session", sessionCookie, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: expiresIn / 1000,
//     });

//     console.log(`[SESSION] Cookie set for ${decoded.email}`);
//     return response;
//   } catch (err) {
//     console.error("Error creating session cookie:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }



// /app/api/session/route.js
import { NextResponse } from "next/server";
import admin from "../_lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { token } = await req.json(); // Firebase ID token from client
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // Create a session cookie (default: 5 days)
    const expiresIn = 5 * 24 * 60 * 60 * 1000;
    const sessionCookie = await admin.auth().createSessionCookie(token, {
      expiresIn,
    });

    const res = NextResponse.json({ ok: true });

    // Set cookie
    res.headers.set(
      "Set-Cookie",
      [
        `session=${sessionCookie}`,
        `Path=/`,
        `HttpOnly`,
        `SameSite=Lax`,
        process.env.NODE_ENV === "production" ? "Secure" : "",
        `Max-Age=${Math.floor(expiresIn / 1000)}`,
      ]
        .filter(Boolean)
        .join("; ")
    );

    return res;
  } catch (err) {
    console.error("Create session cookie failed:", err);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}