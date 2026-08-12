import { cn } from "@/lib/utils";

export interface BoardSurfaceProps {
  /** Aspect ratio to lock — defaults to 1:1 (square star board). */
  aspectRatio?: number;
  /** Placeholder content rendered when the board SVG is empty. */
  placeholder?: React.ReactNode;
  /** Optional className. */
  className?: string;
  onClick?: () => void;
}

const DEFAULT_RATIO = 1;

/**
 * A responsive container that reserves space for the future SVG
 * board. Keeps the board square on mobile, prevents horizontal
 * overflow, and provides a subtle surface so the empty board area
 * never feels "missing".
 *
 * The actual SVG data + rendering belongs to a later phase.
 */
export function BoardSurface({
  aspectRatio = DEFAULT_RATIO,
  placeholder,
  className,
  onClick,
}: BoardSurfaceProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative mx-auto w-full max-w-full rounded-2xl border border-border bg-muted/20",
        "shadow-elevated",
        className,
      )}
      aria-label="صفحه بازی"
      style={{ aspectRatio: aspectRatio.toString() }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
        {placeholder ?? (
          <p className="text-sm text-muted-foreground">
            ساختار صفحه بازی در اینجا قرار خواهد گرفت
          </p>
        )}
      </div>
    </div>
  );
}
