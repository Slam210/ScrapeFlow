import { intervalToDuration } from "date-fns";

/**
 * Produce a short, human-readable duration string for the interval between two dates.
 *
 * If either `start` or `end` is null/undefined the function returns `null`.
 * If the elapsed time (end - start) is less than 1000ms the function returns a millisecond string like `"123ms"`.
 * Otherwise it returns a minutes-and-seconds string in the form `"<minutes>m <seconds>s"`. Minutes and seconds default to `0` when absent.
 *
 * Note: the function computes `end.getTime() - start.getTime()` so a negative elapsed time (when `end` is before `start`) will produce a negative millisecond string when its absolute value is < 1000.
 *
 * @param end - The end time (may be before `start`).
 * @param start - The start time.
 * @returns A duration string (`"<n>ms"` or `"<m>m <s>s"`) or `null` if either argument is missing.
 */
export function DatesToDurationString(
  end: Date | null | undefined,
  start: Date | null | undefined
) {
  if (!start || !end) return null;

  const timeElapsed = end.getTime() - start.getTime();
  if (timeElapsed < 1000) {
    return `${timeElapsed}ms`;
  }

  const duration = intervalToDuration({
    start: 0,
    end: timeElapsed,
  });

  return `${duration.minutes || 0}m ${duration.seconds || 0}s`;
}
