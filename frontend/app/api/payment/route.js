// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export async function POST(req) {
//   try {
//     const { planType, billingCycle, email } = await req.json();

//     const priceIds = {
//       Essentials: {
//         monthly: "price_1SIQYc7zV8DYjNNmo0oqcoE0",
//         yearly: "price_1SIRpV7zV8DYjNNm3SehWBq2",
//         essentials_lifetime_stripe:"price_1SIlBJ7zV8DYjNNmzZlTQOz2"
//       },
//     };

//     const priceId = priceIds[planType]?.[billingCycle];
//     if (!priceId) {
//       return new Response(
//         JSON.stringify({ error: "Invalid plan or billing cycle" }),
//         { status: 400 }
//       );
//     }

//     const session = await stripe.checkout.sessions.create({
//       mode: "subscription",
//       customer_email: email,
//       line_items: [{ price: priceId, quantity: 1 }],
//       success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?status=success`,
//       cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
//     });

//     return Response.json({ url: session.url });
//   } catch (err) {
//     console.error("Stripe error:", err.message);
//     return new Response(
//       JSON.stringify({ error: "Unable to create checkout session" }),
//       { status: 500 }
//     );
//   }
// }


// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = process.env.STRIPE_SECRET_KEY
//   ? new Stripe(process.env.STRIPE_SECRET_KEY)
//   : null;

// const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
// const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
// const PAYPAL_BASE =
//   process.env.NODE_ENV === "production"
//     ? "https://api-m.paypal.com"
//     : "https://api-m.sandbox.paypal.com";

// export async function POST(req) {
//   try {
//     const { email, planType } = await req.json();
//     const provider = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || "stripe";

//     // paypal flow
//     if (provider === "paypal") {
//       const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");
//       const tokenRes = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
//         method: "POST",
//         headers: {
//           Authorization: `Basic ${auth}`,
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: "grant_type=client_credentials",
//       });
//       const tokenData = await tokenRes.json();
//       const accessToken = tokenData.access_token;

//       const orderRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           intent: "CAPTURE",
//           purchase_units: [
//             {
//               amount: { currency_code: "USD", value: "19.99" },
//               description: "ApexQuantLabs Essentials Beta Lifetime Access",
//             },
//           ],
//           application_context: {
//             brand_name: "ApexQuantLabs",
//             landing_page: "LOGIN",
//             user_action: "PAY_NOW",
//             return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
//             cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
//           },
//         }),
//       });

//       const orderData = await orderRes.json();
//       const approvalUrl = orderData.links?.find((l) => l.rel === "approve")?.href;

//       if (!approvalUrl)
//         return NextResponse.json({ error: "PayPal order creation failed", details: orderData }, { status: 500 });

//       return NextResponse.json({ url: approvalUrl });
//     }

//     // stripe flow (for later use)
//     if (provider === "stripe" && stripe) {
//       const PRICE_ID = process.env.STRIPE_ONE_TIME_PRICE_ID;
//       const session = await stripe.checkout.sessions.create({
//         mode: "payment",
//         payment_method_types: ["card"],
//         line_items: [{ price: PRICE_ID, quantity: 1 }],
//         customer_email: email,
//         success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
//         cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
//         metadata: { planType },
//       });
//       return NextResponse.json({ url: session.url });
//     }

//     return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
//   } catch (err) {
//     console.error("Payment route error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

// unified paypal env switch (live/sandbox override)
const PAYPAL_ENV =
  process.env.PAYPAL_ENV ||
  (process.env.NODE_ENV === "production" ? "live" : "sandbox");

const PAYPAL_BASE =
  PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export async function POST(req) {
  try {
    const { email, planType } = await req.json();
    const provider = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || "stripe";

    // paypal flow
    if (provider === "paypal") {
      const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString(
        "base64"
      );
      const tokenRes = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      });
      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      const orderRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: { currency_code: "USD", value: "19.99" },
              description: "ApexQuantLabs Essentials Beta Lifetime Access",
            },
          ],
          application_context: {
            brand_name: "ApexQuantLabs",
            landing_page: "LOGIN",
            user_action: "PAY_NOW",
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
          },
        }),
      });

      const orderData = await orderRes.json();
      const approvalUrl = orderData.links?.find((l) => l.rel === "approve")?.href;

      if (!approvalUrl)
        return NextResponse.json(
          { error: "PayPal order creation failed", details: orderData },
          { status: 500 }
        );

      return NextResponse.json({ url: approvalUrl });
    }

    // stripe flow (for later use)
    if (provider === "stripe" && stripe) {
      const PRICE_ID = process.env.STRIPE_ONE_TIME_PRICE_ID;
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [{ price: PRICE_ID, quantity: 1 }],
        customer_email: email,
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
        metadata: { planType },
      });
      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  } catch (err) {
    console.error("Payment route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
