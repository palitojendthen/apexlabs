/**
 * Throws an HTTP 403 error if the user's plan
 * is not in the allowed list.
 *
 * @param {string} plan - user's plan_type ("Free", "Essentials", ...)
 * @param {Object} [opts]
 * @param {string[]} [opts.required] - list of plans allowed to continue
 */
export function ensurePremium(
  plan,
  { required = ["Essentials", "Essentials_Beta"] } = {}
) {
  if (!required.includes(plan)) {
    const err = new Error("Upgrade required");
    err.status = 403;
    throw err;
  }
}