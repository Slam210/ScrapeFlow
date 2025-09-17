"use server";

import { getAppUrl } from "@/lib/helper/appUrl";
import { stripe } from "@/lib/stripe/stripe";
import { getCreditsPack, PackId } from "@/types/billing";
import { auth } from "@clerk/nextjs/server";

/**
 * Initiates a Stripe Checkout session to purchase a credits pack and returns the redirect URL.
 *
 * Validates the authenticated user and the requested pack, creates a Checkout session in payment mode
 * with invoice creation enabled, sets success/cancel URLs to the billing page, and attaches `userId`
 * and `packId` as metadata.
 *
 * @param packId - Identifier of the credits pack to purchase.
 * @returns The Stripe Checkout session URL for client redirection.
 * @throws Error "Unauthenticated" if there is no authenticated user.
 * @throws Error "Invalid pack" if the provided `packId` does not match any available pack.
 * @throws Error "Cannot create stripe session" if Stripe fails to create a session.
 */
export async function PurchaseCredits(packId: PackId) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const selectedPack = getCreditsPack(packId);
  if (!selectedPack) {
    throw new Error("Invalid pack");
  }
  const priceId = selectedPack.priceId;
  if (!priceId) {
    throw new Error("Stripe price ID not configured for selected pack");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    invoice_creation: {
      enabled: true,
    },
    success_url: getAppUrl("billing"),
    cancel_url: getAppUrl("billing"),
    metadata: {
      userId,
      packId: String(packId),
    },
    line_items: [
      {
        quantity: 1,
        price: priceId,
      },
    ],
  });

  if (!session) {
    throw new Error("Cannot create stripe session");
  }

  return session.url;
}
