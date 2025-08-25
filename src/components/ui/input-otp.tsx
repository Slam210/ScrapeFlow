"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Thin wrapper around `OTPInput` that applies layout and sane default classes.
 *
 * Renders `OTPInput` with `data-slot="input-otp"`, merges `containerClassName` with
 * `"flex items-center gap-2 has-disabled:opacity-50"`, merges `className` with
 * `"disabled:cursor-not-allowed"`, and forwards all other props to `OTPInput`.
 *
 * @param containerClassName - Additional classes to append to the input container.
 * @returns The rendered `OTPInput` element.
 */
function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

/**
 * Wrapper container for grouping OTP slots.
 *
 * Renders a div with `data-slot="input-otp-group"` and combines the provided `className` with the base
 * layout classes (`flex items-center`). All other div props are forwarded to the underlying element.
 */
function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

/**
 * Renders a single OTP slot driven by the surrounding OTPInput context.
 *
 * Reads slot state from OTPInputContext.slots[index] and renders the slot character.
 * If the slot's state indicates a fake caret, a visually centered blinking caret is shown.
 *
 * @param index - Zero-based index selecting which slot from OTPInputContext.slots to render.
 * @returns A JSX element for the OTP slot.
 */
function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  )
}

/**
 * Renders a visual separator used between OTP slots.
 *
 * The component outputs a div with `data-slot="input-otp-separator"`, `role="separator"`, and a `MinusIcon` as its content.
 * All received div props (className, style, event handlers, etc.) are forwarded to the wrapper element.
 *
 * @returns A React element representing the OTP slot separator.
 */
function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
