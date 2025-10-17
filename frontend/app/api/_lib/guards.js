import { NextResponse } from "next/server";

/**
 * ensures the user has premium access before proceeding.
 * used in api routes like /api/run_backtest to block restricted features.
 */
export function ensurePremium(planType, featureName = "this feature") {
  if (planType !== "Essentials") {
    console.warn(`[Access Denied] ${featureName} requires Essentials plan.`);
    return NextResponse.json(
      { error: `${featureName} is only available on the Essentials plan.` },
      { status: 403 }
    );
  }
  return null;
}