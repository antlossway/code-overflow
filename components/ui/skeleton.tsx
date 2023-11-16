import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-state-900/50 dark:bg-slate-50/50 ",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
