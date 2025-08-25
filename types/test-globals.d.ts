// This declaration helps TypeScript when using either Vitest or Jest.
// If Vitest is present, real types will be used; otherwise, fall back to globals from @types/jest if configured.
declare module "vitest" {
  export const describe: typeof globalThis.describe
  export const it: typeof globalThis.it
  export const test: typeof globalThis.it
  export const expect: typeof globalThis.expect
}