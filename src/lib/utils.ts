import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Tests for cn are in src/lib/utils.test.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
