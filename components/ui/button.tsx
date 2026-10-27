import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-semibold disabled:pointer-events-none disabled:opacity-50 shrink-0 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "button",
        destructive:
          "button bg-destructive text-destructive-foreground",
        outline:
          "rounded-full border border-brand-line bg-brand-surface px-5 py-2.5 text-xs font-semibold text-brand-ink hover:border-brand-coral hover:bg-brand-paper",
        secondary:
          "demo-run text-brand-paper",
        ghost:
          "rounded-full px-4 py-2 text-xs font-semibold hover:bg-brand-paper/20 hover:text-brand-coral",
        link: "text-link",
      },
      size: {
        default: "",
        sm: "button-small",
        lg: "button-lg",
        icon: "size-9 p-0",
        "icon-sm": "size-8 p-0",
        "icon-lg": "size-10 p-0",
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
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
