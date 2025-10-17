import { NextResponse } from "next/server";
import admin from "../_lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { token } = await req.json(); // firebase id token from client
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // create a session cookie (default: 5 days)
    const expiresIn = 5 * 24 * 60 * 60 * 1000;
    const sessionCookie = await admin.auth().createSessionCookie(token, {
      expiresIn,
    });

    const res = NextResponse.json({ ok: true });

    // set cookie
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