"use server";

import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe";
import { auth } from "@clerk/nextjs/server";

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
