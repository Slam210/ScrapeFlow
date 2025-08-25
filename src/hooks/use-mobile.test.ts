import * as React from "react"
import { renderHook, act } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useIsMobile } from "./use-mobile"

type MQLListener = (this: MediaQueryList, ev: MediaQueryListEvent) => any

class MockMediaQueryList implements MediaQueryList {
  media: string
  matches: boolean
  onchange: MQLListener | null = null
  // Deprecated API (for some libs): addListener/removeListener – include for robustness
  private legacyListeners: Set<MQLListener> = new Set()
  private listeners: Set<MQLListener> = new Set()
  // Safari/WebKit used EventTarget-based addEventListener/removeEventListener
  addEventListener(type: string, listener: EventListenerOrEventListenerObject | null): void {
    if (type !== "change" || !listener) return
    const fn: MQLListener =
      typeof listener === "function" ? (listener as any) : (listener.handleEvent as any)
    this.listeners.add(fn)
  }
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject | null): void {
    if (type !== "change" || !listener) return
    const fn: MQLListener =
      typeof listener === "function" ? (listener as any) : (listener.handleEvent as any)
    this.listeners.delete(fn)
  }
  addListener(listener: MQLListener): void {
    this.legacyListeners.add(listener)
  }
  removeListener(listener: MQLListener): void {
    this.legacyListeners.delete(listener)
  }
  dispatchChange(matches: boolean) {
    this.matches = matches
    const evt = new (class implements MediaQueryListEvent {
      readonly media = thisRef.media
      readonly matches = matches
    })()
    // Fire all modern listeners
    this.listeners.forEach((l) => l.call(this, evt as any))
    // Fire onchange if present
    if (this.onchange) this.onchange.call(this, evt as any)
    // Fire legacy listeners
    this.legacyListeners.forEach((l) => l.call(this, evt as any))
  }
  constructor(query: string, matches: boolean) {
    this.media = query
    this.matches = matches
    // to access in dispatchChange
    thisRef = this
  }
}
let thisRef: MockMediaQueryList

// Keep originals to restore
const originalMatchMedia = window.matchMedia
const originalInnerWidth = window.innerWidth

function installMatchMediaMock(initialWidth: number, breakpoint = 768) {
  // @ts-expect-error assignable in test
  window.innerWidth = initialWidth
  const map = new Map<string, MockMediaQueryList>()
  // @ts-expect-error assign in test
  window.matchMedia = (query: string): MediaQueryList => {
    const maxWidthMatch = /max-width:\s*(\d+)px/.exec(query)
    const max = maxWidthMatch ? parseInt(maxWidthMatch[1], 10) : breakpoint - 1
    const mql =
      map.get(query) ??
      new MockMediaQueryList(query, initialWidth <= max /* matches for <= max-width */)
    map.set(query, mql)
    return mql as unknown as MediaQueryList
  }
  return {
    getMql(query: string) {
      return map.get(query)!
    },
    setWidth(width: number) {
      // @ts-expect-error assignable in test
      window.innerWidth = width
      // Update all MQLs' match state and dispatch change
      for (const [q, mql] of map.entries()) {
        const maxWidthMatch = /max-width:\s*(\d+)px/.exec(q)
        const max = maxWidthMatch ? parseInt(maxWidthMatch[1], 10) : breakpoint - 1
        const matches = width <= max
        mql.dispatchChange(matches)
      }
    },
    restore() {
      window.matchMedia = originalMatchMedia
      // @ts-expect-error assignable in test
      window.innerWidth = originalInnerWidth
    },
  }
}

describe("useIsMobile", () => {
  let env: ReturnType<typeof installMatchMediaMock>

  beforeEach(() => {
    vi.useFakeTimers()
    env = installMatchMediaMock(1200) // desktop by default
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    env.restore()
  })

  it("returns false on initial render before effect (state is undefined → coerced to false)", () => {
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it("initializes to false when innerWidth >= 768 after effect runs", () => {
    const { result } = renderHook(() => useIsMobile())
    // Flush effects/microtasks
    act(() => {})
    expect(result.current).toBe(false)
  })

  it("initializes to true when innerWidth < 768 after effect runs", () => {
    env.setWidth(500)
    const { result } = renderHook(() => useIsMobile())
    act(() => {})
    expect(result.current).toBe(true)
  })

  it("updates to true when crossing below the MOBILE_BREAKPOINT via matchMedia change", () => {
    const { result } = renderHook(() => useIsMobile())
    act(() => {})
    expect(result.current).toBe(false) // starting at 1200

    act(() => {
      env.setWidth(600)
    })
    expect(result.current).toBe(true)
  })

  it("updates to false when crossing above the MOBILE_BREAKPOINT via matchMedia change", () => {
    env.setWidth(600)
    const { result } = renderHook(() => useIsMobile())
    act(() => {})
    expect(result.current).toBe(true)

    act(() => {
      env.setWidth(900)
    })
    expect(result.current).toBe(false)
  })

  it("cleans up the change listener on unmount", () => {
    // Spy on add/remove to ensure remove is called
    const query = "(max-width: 767px)"
    const mql = window.matchMedia(query) as unknown as MockMediaQueryList
    const addSpy = vi.spyOn(mql, "addEventListener")
    const removeSpy = vi.spyOn(mql, "removeEventListener")

    const { unmount } = renderHook(() => useIsMobile())
    act(() => {})
    expect(addSpy).toHaveBeenCalledWith("change", expect.any(Function))

    unmount()
    expect(removeSpy).toHaveBeenCalledWith("change", expect.any(Function))
  })

  it("does not crash if environment lacks addEventListener but provides legacy addListener/removeListener", () => {
    // Provide a legacy-only MQL for this test
    const legacyMql = {
      media: "(max-width: 767px)",
      matches: false,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      // @ts-expect-error purposefully undefined modern API
      addEventListener: undefined,
      // @ts-expect-error purposefully undefined modern API
      removeEventListener: undefined,
      dispatchEvent: () => false,
    } as unknown as MediaQueryList

    // Override matchMedia to return legacy object
    // @ts-expect-error test override
    window.matchMedia = vi.fn().mockReturnValue(legacyMql)

    const { result, unmount } = renderHook(() => useIsMobile())
    act(() => {})
    // The hook should still compute based on window.innerWidth and not throw
    expect(result.current).toBe(false)
    unmount()
    // No assertions on remove; just ensure no exceptions were thrown
  })
})