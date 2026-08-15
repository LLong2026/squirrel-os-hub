/**
 * Squirrel OS — Stripe Checkout Session Creator
 * 
 * Creates a Stripe Checkout session for a given pricing tier.
 * Called by any app in the 67-app ecosystem to redirect users to payment.
 * 
 * Usage:
 *   POST /api/functions/createCheckoutSession
 *   Body: { tier: "licensed" | "saas", customer_email?: string, app_name?: string }
 *   Returns: { checkout_url: string }
 */

export default async function createCheckoutSession(req, res) {
  const body = await req.json();
  const { tier, customer_email, app_name } = body;

  if (!tier || !["licensed", "saas"].includes(tier)) {
    return Response.json({ error: "Invalid tier. Must be 'licensed' or 'saas'." }, { status: 400 });
  }

  // Stripe price IDs (set these after creating products in Stripe dashboard)
  const PRICE_IDS = {
    licensed: process.env.STRIPE_PRICE_LICENSED || "price_licensed_placeholder",
    saas: process.env.STRIPE_PRICE_SAAS || "price_saas_placeholder",
  };

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey || stripeSecretKey.includes("placeholder")) {
    return Response.json({ 
      error: "Stripe not configured. Leon needs to add the Stripe secret key.",
      setup_guide: "See STRIPE_DASHBOARD_SETUP_GUIDE.md"
    }, { status: 503 });
  }

  const sessionParams = {
    payment_method_types: ["card"],
    line_items: [
      {
        price: PRICE_IDS[tier],
        quantity: 1,
      },
    ],
    mode: tier === "licensed" ? "payment" : "subscription",
    success_url: `${req.headers.get("origin") || "https://app.base44.com"}/success?tier=${tier}`,
    cancel_url: `${req.headers.get("origin") || "https://app.base44.com"}/cancel`,
    metadata: {
      tier,
      app_name: app_name || "unknown",
      ecosystem: "squirrel-os",
      created_by: "gabriel-superagent",
    },
  };

  if (customer_email) {
    sessionParams.customer_email = customer_email;
  }

  try {
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "payment_method_types[]": "card",
        "line_items[0][price]": PRICE_IDS[tier],
        "line_items[0][quantity]": "1",
        mode: tier === "licensed" ? "payment" : "subscription",
        success_url: sessionParams.success_url,
        cancel_url: sessionParams.cancel_url,
        "metadata[tier]": tier,
        "metadata[app_name]": app_name || "unknown",
        "metadata[ecosystem]": "squirrel-os",
        ...(customer_email ? { customer_email } : {}),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return Response.json({ error: "Stripe API error", details: error }, { status: response.status });
    }

    const session = await response.json();
    return Response.json({ 
      checkout_url: session.url,
      session_id: session.id,
      tier
    });
  } catch (err) {
    return Response.json({ error: "Failed to create checkout session", details: err.message }, { status: 500 });
  }
}
