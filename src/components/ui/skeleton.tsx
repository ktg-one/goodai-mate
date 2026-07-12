import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-xs bg-[var(--paper-deep)]", className)}
      {...props}
    />
  )
}

export { Skeleton }
