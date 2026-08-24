import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-xs border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ink focus-visible:ring-[3px] focus-visible:ring-navy/50 aria-invalid:border-red aria-invalid:ring-red/20 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-navy text-paper [a&]:hover:bg-navy-deep",
        secondary: "bg-gold text-ink [a&]:hover:bg-gold-deep",
        destructive:
          "bg-red text-paper focus-visible:ring-red/40 [a&]:hover:bg-red-deep",
        outline: "border-ink text-ink [a&]:hover:bg-gold-tint",
        ghost: "text-ink [a&]:hover:bg-gold-tint",
        link: "text-red underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
