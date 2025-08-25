import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * A presentational textarea component that applies shared styling and forwards native textarea props.
 *
 * Merges a base set of utility classes with an optional `className` via `cn`, sets `data-slot="textarea"`,
 * and spreads all other native textarea props onto the underlying element.
 *
 * @param className - Optional additional CSS classes to merge with the component's default styles.
 * @returns A styled `<textarea>` element with forwarded props.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
