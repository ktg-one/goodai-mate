import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

// Canonical Good'ai brutalist button: sharp corners, 2px ink border, flat
// stamp shadow, one red per surface. Built on the .stamp-btn / .stamp-btn-*
// primitives in globals.css (no raw hex, no default tailwind tokens).
const buttonVariants = cva(
  "stamp-btn outline-none disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "stamp-btn-navy",
        destructive: "stamp-btn-red",
        outline: "stamp-btn-paper",
        secondary: "stamp-btn-gold",
        ghost:
          "!border-transparent !bg-transparent !shadow-none text-ink hover:!bg-[var(--paper-deep)]",
        link: "!border-transparent !bg-transparent !shadow-none text-navy underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9",
        xs: "h-6 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8",
        lg: "h-10 text-base",
        icon: "size-9 !p-0",
        "icon-xs": "size-6 !p-0 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 !p-0",
        "icon-lg": "size-10 !p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
