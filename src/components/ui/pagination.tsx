import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

/**
 * Accessible wrapper that renders a pagination navigation container.
 *
 * Renders a <nav> element with role="navigation", aria-label="pagination", and
 * data-slot="pagination". Merges default layout classes with any `className`
 * provided and forwards all other props to the underlying nav element.
 */
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

/**
 * List container for pagination items.
 *
 * Renders a <ul> element with horizontal layout and spacing, and sets
 * `data-slot="pagination-content"` for styling/slot hooks. Additional
 * `className` provided is merged with the default layout classes; remaining
 * props are passed through to the underlying `<ul>`.
 *
 * @param className - Extra CSS classes to merge with the default layout classes.
 */
function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

/**
 * List-item wrapper for pagination controls.
 *
 * Renders an `li` with `data-slot="pagination-item"` and forwards all received props
 * (attributes, event handlers, children, etc.) to the underlying element.
 */
function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

/**
 * Anchor-styled pagination link that applies button-based variants and exposes an active state.
 *
 * When `isActive` is true, the link sets `aria-current="page"` and `data-active=true` for accessibility
 * and styling; otherwise those attributes are unset/false. The component maps the `size` prop to the
 * underlying button variant and forwards all other anchor props to the rendered `<a>` element.
 *
 * @param isActive - Whether this link represents the current page; controls `aria-current` and active styling.
 * @param size - Size variant passed to the button styling system (defaults to `"icon"`).
 * @returns A JSX `<a>` element with pagination-specific attributes and styling.
 */
function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a "previous page" pagination control.
 *
 * A convenience wrapper around `PaginationLink` that sets `aria-label="Go to previous page"`, `size="default"`,
 * appropriate padding classes, and includes a left chevron icon plus responsive "Previous" text.
 */
function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  )
}

/**
 * A pagination control that navigates to the next page.
 *
 * Renders a PaginationLink preconfigured with `aria-label="Go to next page"` and `size="default"`.
 * Shows a chevron icon and a "Next" label that is hidden on small screens. Forwards all other anchor props.
 *
 * @returns A `PaginationLink` element representing the "next" pagination control.
 */
function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

/**
 * Renders a pagination ellipsis indicator ("More pages") as a span with an icon and screen-reader text.
 *
 * The element is aria-hidden, centers a `MoreHorizontalIcon`, and includes a visually hidden "More pages"
 * label for assistive technologies. Any provided `className` is merged with the component's default layout classes.
 *
 * @param className - Additional CSS classes to merge with the default classes applied to the span.
 * @returns A React `span` element intended for use inside pagination lists.
 */
function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
