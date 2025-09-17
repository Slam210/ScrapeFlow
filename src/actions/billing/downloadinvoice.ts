"use server";

import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe";
import { auth } from "@clerk/nextjs/server";

/**
 * Retrieves the hosted Stripe invoice URL for a user's purchase.
 *
 * Authenticates the current user, verifies the purchase belongs to that user, fetches
 * the Stripe checkout session and associated invoice, and returns the invoice's hosted URL.
 *
 * @param id - The userPurchase record ID to retrieve the invoice for.
 * @returns The hosted Stripe invoice URL as a string, or `null`/`undefined` if not set on the invoice.
 * @throws Error "Unauthenticated" if no authenticated user is present.
 * @throws Error "Bad request" if the purchase with the given `id` does not belong to the authenticated user.
 */
export async function DownloadInvoice(id: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const purchase = await prisma.userPurchase.findFirst({
    where: { id, userId },
  });

  if (!purchase) {
    throw new Error("Bad request");
  }

  const session = await stripe.checkout.sessions.retrieve(purchase.stripeId, {
    expand: ["invoice"],
  });
  const invoice =
    typeof session.invoice === "string"
      ? await stripe.invoices.retrieve(session.invoice)
      : session.invoice;
  if (!invoice?.hosted_invoice_url) {
    throw new Error("Invoice not available yet");
  }
  return invoice.hosted_invoice_url;
}
