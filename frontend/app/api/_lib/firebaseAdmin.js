// /app/api/_lib/firebaseAdmin.js
import admin from "firebase-admin";
import fs from "fs";

function loadServiceAccount() {
  // Preferred: FB_ADMIN_CREDENTIALS as a JSON string or path to a JSON file
  const cred = process.env.FB_ADMIN_CREDENTIALS;
  if (cred) {
    try {
      if (cred.trim().startsWith("{")) {
        return JSON.parse(cred);
      }
      if (fs.existsSync(cred)) {
        const raw = fs.readFileSync(cred, "utf8");
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error("FB_ADMIN_CREDENTIALS present but invalid JSON:", e);
    }
  }

  // Fallback: FIREBASE_* triplet
  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    return {
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
  }

  throw new Error(
    "Firebase Admin credentials missing. Provide FB_ADMIN_CREDENTIALS (JSON or path) OR FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY."
  );
}

if (!admin.apps.length) {
  const sa = loadServiceAccount();
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: sa.project_id,
      clientEmail: sa.client_email,
      privateKey: sa.private_key,
    }),
  });
  console.log("✅ Firebase Admin initialized");
}

export default admin;

// Helper: read and verify session cookie "session"
export async function getSessionUser(req) {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/);
  const sessionCookie = match ? match[1] : null;
  if (!sessionCookie) return null;

  try {
    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
    return decoded; // contains uid, email, etc.
  } catch (err) {
    console.warn("verifySessionCookie failed:", err?.message || err);
    return null;
  }
}