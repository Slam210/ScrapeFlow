import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Build a space-separated class string from arbitrary `clsx` inputs and resolve Tailwind class conflicts.
 *
 * Accepts the same input shapes as `clsx` (strings, arrays, objects, nested combinations, and falsy values), then runs the result through `tailwind-merge` to collapse and prioritize conflicting Tailwind utility classes.
 *
 * @param inputs - Variadic class inputs (strings, arrays, objects, etc.) in `clsx` format
 * @returns A single className string with Tailwind utilities merged and de-duplicated
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
