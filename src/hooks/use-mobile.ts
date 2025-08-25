import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Returns whether the current viewport is considered mobile (viewport width < 768px).
 *
 * On mount this hook initializes its state from window.innerWidth and subscribes to a media-query change listener to keep the value updated. Note: the initial render returns false (the hook coerces an internal undefined state to false) until the effect runs and sets the actual value.
 *
 * @returns `true` when the viewport width is less than `MOBILE_BREAKPOINT` (768), otherwise `false`.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
