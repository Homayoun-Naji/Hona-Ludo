import { cn } from "@/lib/utils";

/**
 * Skeleton — a soft shimmer placeholder for content that has not
 * arrived yet. Used while the future socket layer warms up; this
 * phase does not yet connect to it.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
