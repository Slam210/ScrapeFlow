import { HandleCheckoutSessionCompleted } from "@/lib/stripe/handleCheckoutSessionCompleted";
import { stripe } from "@/lib/stripe/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Handle Stripe webhook POST requests: verify the signature and dispatch supported events.
 *
 * Verifies the raw request body against the `stripe-signature` header using `STRIPE_WEBHOOK_SECRET`. On a verified event, dispatches handling for supported event types (currently `checkout.session.completed` → calls `HandleCheckoutSessionCompleted` with the event object). Returns HTTP 200 when processing succeeds; returns HTTP 400 with body `"Webhook error"` if verification or processing fails.
 *
 * @param request - Incoming HTTP request from Stripe; the raw body is used for signature verification.
 * @returns An HTTP response: 200 on success, 400 on verification or processing failure.
 */
export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature") as string;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed":
        await HandleCheckoutSessionCompleted(event.data.object);
        break;
      default:
        break;
    }
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Stripe webhook error", error);
    return new NextResponse("Webhook error", { status: 400 });
  }
}
