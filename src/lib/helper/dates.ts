import { intervalToDuration } from "date-fns";

/**
 * Produce a short, human-readable duration string for the interval between two times.
 *
 * Accepts Date, ISO date string, timestamp (number), or null/undefined for each argument.
 * Returns null when either argument is missing or cannot be parsed as a valid Date.
 *
 * Behavior:
 * - If the elapsed time (end - start) has absolute value < 1000 ms, returns a millisecond string preserving sign, e.g. `"123ms"` or `"-123ms"`.
 * - If the absolute elapsed time is >= 1000 ms, returns a minutes-and-seconds string in the form `"<minutes>m <seconds>s"`. Minutes and seconds are computed from the absolute duration and default to `0` when absent (sign is not preserved in this case).
 *
 * @param end - The end time (may be before `start`).
 * @param start - The start time.
 * @returns A duration string (`"<n>ms"` or `"<m>m <s>s"`) or `null` if inputs are missing or invalid.
 */

export function DatesToDurationString(
  end: Date | string | number | null | undefined,
  start: Date | string | number | null | undefined
) {
  if (!start || !end) return null;

  const endDate = new Date(end);
  const startDate = new Date(start);

  if (isNaN(endDate.getTime()) || isNaN(startDate.getTime())) {
    return null; // invalid date inputs
  }

  const timeElapsed = endDate.getTime() - startDate.getTime();
  if (Math.abs(timeElapsed) < 1000) {
    return `${timeElapsed}ms`;
  }

  const duration = intervalToDuration({
    start: 0,
    end: Math.abs(timeElapsed),
  });

  return `${duration.minutes || 0}m ${duration.seconds || 0}s`;
}
