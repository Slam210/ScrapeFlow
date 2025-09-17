import { getCreditsPack, PackId } from "@/types/billing";
import "server-only";
import Stripe from "stripe";
import prisma from "../prisma";

/**
 * Handle a completed Stripe Checkout Session by applying purchased credits to a user and recording the purchase.
 *
 * Looks for `userId` and `packId` in `event.metadata`, resolves the corresponding credits pack, increments or creates
 * the user's balance by the pack's credits, and creates a purchase record using the session `id`, `amount_total`, and `currency`.
 *
 * Errors:
 * - Throws if `event.metadata` is missing, or if `userId` or `packId` metadata are absent.
 * - Throws if the referenced credits pack cannot be found.
 *
 * @param event - The Stripe Checkout Session; must include `metadata.userId` and `metadata.packId`. The session's
 *   `id`, `amount_total`, and `currency` are used when recording the purchase.
 */
export async function HandleCheckoutSessionCompleted(
  event: Stripe.Checkout.Session
) {
  if (!event.metadata) {
    throw new Error("missing meta data");
  }

  const { userId, packId } = event.metadata;

  if (!userId) {
    throw new Error("Missing user id");
  }

  if (!packId) {
    throw new Error("Missing pack id");
  }

  const purchasedPack = getCreditsPack(packId as PackId);
  if (!purchasedPack) {
    throw new Error("Purchased pack not found");
  }

  await prisma.userBalance.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      credits: purchasedPack.credits,
    },
    update: {
      credits: {
        increment: purchasedPack.credits,
      },
    },
  });

  await prisma.userPurchase.create({
    data: {
      userId,
      stripeId: event.id,
      description: `${purchasedPack.name} - ${purchasedPack.credits} credits`,
      amount: event.amount_total!,
      currency: event.currency!,
    },
  });
}
