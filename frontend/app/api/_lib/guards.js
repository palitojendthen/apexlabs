// /**
//  * throws an http 403 error if the user's plan
//  * is not in the allowed list.
//  *
//  * @param {string} plan - user's plan_type ("free", "essentials")
//  * @param {Object} [opts]
//  * @param {string[]} [opts.required] - list of plans allowed to continue
//  */
// export function ensurePremium(
//   plan,
//   { required = ["Essentials", "Essentials_Beta"] } = {}
// ) {
//   if (!required.includes(plan)) {
//     const err = new Error("Upgrade required");
//     err.status = 403;
//     throw err;
//   }
// }


// /frontend/app/api/_lib/guards.js
import { NextResponse } from "next/server";

/**
 * Ensures the user has premium access before proceeding.
 * Used in API routes like /api/run_backtest to block restricted features.
 */
export function ensurePremium(planType, featureName = "this feature") {
  if (planType !== "Essentials") {
    console.warn(`[Access Denied] ${featureName} requires Essentials plan.`);
    return NextResponse.json(
      { error: `${featureName} is only available on the Essentials plan.` },
      { status: 403 }
    );
  }
  return null; // authorized → continue
}