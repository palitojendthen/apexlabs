import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * creates a stripe checkout session (sandbox mode).
 * expects JSON: { planType: "Essentials", billingCycle: "monthly" | "yearly", email: "..."}
 */
export async function POST(req) {
  try {
    const { planType, billingCycle, email } = await req.json();

    const priceIds = {
      Essentials: {
        monthly: "9.9",
        yearly: "96",
      },
    };

    const priceId = priceIds[planType]?.[billingCycle];
    if (!priceId) {
      return new Response(
        JSON.stringify({ error: "Invalid plan or billing cycle" }),
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    return new Response(
      JSON.stringify({ error: "Unable to create checkout session" }),
      { status: 500 }
    );
  }
}
