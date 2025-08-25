import { describe, it, expect } from "vitest" // Vitest will tree-shake in Vitest projects; in Jest this import is ignored by transpilers. If Jest is used, globals are already defined.

/**
 * NOTE ON TESTING LIBRARY/FRAMEWORK:
 * - These tests are written to be compatible with both Vitest and Jest.
 *   If the repository uses Vitest (common in modern TS/Next.js projects), the explicit import above is valid.
 *   If the repository uses Jest, the global describe/it/expect will exist and bundlers often ignore type-only imports.
 *   If necessary, you can remove the import for Jest.
 */

import { cn } from "./utils"

describe("cn utility", () => {
  it("concatenates simple class names (happy path)", () => {
    expect(cn("p-2", "m-2")).toBe("p-2 m-2")
  })

  it("handles duplicates by keeping a single occurrence", () => {
    expect(cn("text-sm", "text-sm")).toBe("text-sm")
  })

  it("handles falsy values gracefully", () => {
    // @ts-expect-no-error deliberate variety of falsy inputs
    expect(cn("p-2", null as any, undefined as any, false as any, "", 0 as any)).toBe("p-2")
  })

  it("supports conditional objects ala clsx", () => {
    expect(cn("foo", { bar: true, baz: false }, ["qux"])).toBe("foo bar qux")
  })

  it("flattens nested arrays", () => {
    expect(cn(["flex", ["items-center", ["justify-between"]]])).toBe("flex items-center justify-between")
  })

  it("merges conflicting Tailwind utilities (last one wins)", () => {
    // tailwind-merge should collapse p-2 and p-4 into p-4
    expect(cn("p-2", "p-4")).toBe("p-4")
  })

  it("merges responsive/variant utilities per-scope (last wins within same variant)", () => {
    // hover:p-* should be resolved within the hover: variant scope
    expect(cn("hover:p-2", "hover:p-3")).toBe("hover:p-3")
  })

  it("keeps distinct variants intact (no cross-variant collision)", () => {
    // 'p-4' conflicts with 'p-2' but not with 'md:p-2'
    expect(cn("p-2", "md:p-2", "p-4")).toBe("md:p-2 p-4")
  })

  it("resolves color utilities conflicts correctly", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
  })

  it("prefers important modifiers", () => {
    // When both exist, last important should win; important beats non-important of same group
    expect(cn("p-2", "!p-3")).toBe("!p-3")
    expect(cn("!p-2", "p-3")).toBe("p-3") // last wins, important on first should be replaced by later non-important
    expect(cn("!p-2", "!p-3")).toBe("!p-3")
  })

  it("handles arbitrary values and standard utilities (last wins within same group)", () => {
    expect(cn("w-[13px]", "w-4")).toBe("w-4")
    expect(cn("w-4", "w-[13px]")).toBe("w-[13px]")
  })

  it("returns empty string when no truthy class is provided", () => {
    // @ts-expect-no-error exercising runtime behavior
    expect(cn(null as any, undefined as any, false as any, 0 as any, "")).toBe("")
  })

  it("does not trim or reorder non-conflicting classes", () => {
    const result = cn("font-semibold", "underline", "tracking-tight")
    expect(result).toBe("font-semibold underline tracking-tight")
  })

  it("supports mixed types similar to clsx", () => {
    const classes = cn(
      "base",
      ["group", ["peer", 0 as any, null as any]],
      { enabled: true, disabled: false },
      new Set(["set-class"]) as any
    )
    // clsx ignores non-stringish falsey values, flattens arrays/iterables
    expect(classes).toBe("base group peer enabled set-class")
  })
})