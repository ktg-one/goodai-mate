import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
<<<<<<< HEAD
      className={cn("animate-pulse rounded-md bg-accent", className)}
=======
      className={cn("animate-pulse rounded-xs bg-[var(--paper-deep)]", className)}
>>>>>>> cb9dafa (Merge pull request #195 from ktg-one/sentinel-ssrf-ipv6-unspecified-11941053551987039173)
      {...props}
    />
  )
}

export { Skeleton }
