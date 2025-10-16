import { NextResponse } from "next/server";
import { getUserAndPlan } from "../_lib/authPlan";

export async function GET(req) {
  try {
    const { user, plan } = await getUserAndPlan(req);
    if (!user) {
      return NextResponse.json({ plan: "Free", uid: null }, { status: 401 });
    }

    return NextResponse.json({ plan, uid: user.uid }, { status: 200 });
  } catch (err) {
    console.error("get_plan error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}