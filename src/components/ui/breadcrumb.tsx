import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Breadcrumb container element.
 *
 * Renders a <nav> with `aria-label="breadcrumb"` and `data-slot="breadcrumb"`. All received props
 * are forwarded to the rendered <nav> element (e.g., className, id, children, etc.).
 *
 * @returns A navigation element suitable as the root of a breadcrumb trail.
 */
function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

/**
 * Renders an ordered list intended to contain breadcrumb items.
 *
 * The element receives a `data-slot="breadcrumb-list"` attribute and a set of
 * default styling classes; any `className` provided is merged with those
 * defaults. All other props are forwarded to the underlying `<ol>` element.
 *
 * @param className - Additional CSS classes to merge with the component's defaults
 * @returns The rendered `<ol>` element for breadcrumb items
 */
function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a breadcrumb list item (<li>) with standard layout styles and a data-slot for design-system composition.
 *
 * The component applies inline-flex layout, vertical centering, and a small gap between children, merges any
 * provided `className`, sets `data-slot="breadcrumb-item"`, and forwards all other native `<li>` props.
 *
 * @param className - Additional CSS classes to merge with the default layout classes.
 */
function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

/**
 * Renders a breadcrumb link; by default an `<a>` but uses Radix `Slot` when `asChild` is true.
 *
 * The component applies a data-slot attribute and combines the provided `className` with
 * a hover text-color transition. All other props are forwarded to the rendered element.
 *
 * @param asChild - If true, renders a Radix `Slot` so a parent can supply the concrete element (useful for custom link components).
 * @returns The rendered link element (an anchor or a `Slot`).
 */
function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  )
}

/**
 * Renders the current breadcrumb item as a non-interactive page indicator.
 *
 * The component outputs a <span> with aria-current="page", role="link", and aria-disabled="true"
 * to indicate the active page in a breadcrumb trail. It applies default styling ("text-foreground font-normal")
 * which is merged with any provided `className`. All other standard <span> props are forwarded.
 *
 * @param className - Additional class names to merge with the component's default classes
 * @returns A JSX element representing the current breadcrumb page
 */
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props}
    />
  )
}

/**
 * Renders a breadcrumb separator list item.
 *
 * Renders an <li> with presentation semantics and a default ChevronRight icon; if `children` is provided it will replace the default icon.
 *
 * @param children - Optional custom separator content that replaces the default ChevronRight icon
 */
function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

/**
 * Renders a breadcrumb ellipsis item used to indicate collapsed or hidden breadcrumb items.
 *
 * The component outputs a <span> with `data-slot="breadcrumb-ellipsis"`, `role="presentation"`, and
 * `aria-hidden="true"`. Visually it centers a `MoreHorizontal` icon and includes a visually-hidden
 * "More" label for assistive technologies. Accepts standard span props; `className` is merged with
 * the component's default sizing and centering classes.
 */
function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
