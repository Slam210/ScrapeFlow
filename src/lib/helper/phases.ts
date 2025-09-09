import { ExecutionPhase } from "@/generated/prisma";

type Phase = Pick<ExecutionPhase, "creditsConsumed">;

/**
 * Calculate the total credits consumed across an array of phases.
 *
 * Sums each phase's `creditsConsumed`, treating missing or falsy values as 0.
 *
 * @param phases - Array of phases to total; each phase may have `creditsConsumed` undefined.
 * @returns The numeric sum of `creditsConsumed` for all provided phases (0 for empty array).
 */
export function GetPhasesTotalCost(phases: Phase[]) {
  return phases.reduce((acc, phase) => acc + (phase.creditsConsumed || 0), 0);
}
