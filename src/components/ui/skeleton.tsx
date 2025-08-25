import { cn } from "@/lib/utils"

/**
 * Render a simple skeleton placeholder div used for loading states.
 *
 * Renders a <div> with `data-slot="skeleton"` and base styles for a pulsing, rounded placeholder.
 * Any additional props are forwarded to the underlying div; the `className` prop is merged with
 * the component's default classes.
 *
 * @returns The skeleton div element.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
