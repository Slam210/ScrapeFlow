/**
 * Build an absolute application URL by joining the configured base URL and a path.
 *
 * Reads the base URL from the NEXT_PUBLIC_APP_URL environment variable and returns
 * a string formed as `${appUrl}/${path}`.
 *
 * Note: No validation or normalization is performed; if NEXT_PUBLIC_APP_URL is
 * undefined the returned string will include `"undefined"`, and duplicate or
 * missing slashes are not normalized.
 *
 * @param path - The path to append to the application base URL (should not include a leading slash to avoid duplicated slashes)
 * @returns The concatenated URL string combining the environment base URL and `path`
 */
export function getAppUrl(path: string) {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV !== "production" ? "http://localhost:3000" : "");
  if (!base) {
    throw new Error("NEXT_PUBLIC_APP_URL is not set");
  }
  // new URL handles leading/trailing slashes robustly
  return new URL(path, base.endsWith("/") ? base : `${base}/`).toString();
}
