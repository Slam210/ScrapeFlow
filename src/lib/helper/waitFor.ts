/**
 * Returns a Promise that resolves after the given number of milliseconds.
 *
 * @param ms - Delay duration in milliseconds.
 * @returns A Promise that resolves with no value once the delay elapses.
 */
export function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
