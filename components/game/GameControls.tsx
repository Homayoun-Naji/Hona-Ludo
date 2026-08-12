import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Undo2, LogOut } from "lucide-react";

export interface GameControlsProps {
  /** Whether undo is available this turn. */
  canUndo?: boolean;
  /** Whether ending the turn is allowed. */
  canEndTurn?: boolean;
  /** Whether an action is in-flight (disables both). */
  processing?: boolean;
  /** Called when the player taps Undo. */
  onUndo?: () => void;
  /** Called when the player taps End Turn. */
  onEndTurn?: () => void;
  className?: string;
}

/**
 * Bottom-bar game controls — Undo and End Turn.
 *
 * Presentational only; no engine interaction. Disabled while a move
 * is being processed.
 */
export function GameControls({
  canUndo = false,
  canEndTurn = false,
  processing = false,
  onUndo,
  onEndTurn,
  className,
}: GameControlsProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        "rtl:flex-row-reverse",
        className,
      )}
    >
      <Button
        variant="outline"
        size="lg"
        disabled={!canUndo || processing}
        onClick={onUndo}
        aria-label="بازگشت حرکت"
      >
        <Undo2 aria-hidden />
        <span>بازگشت</span>
      </Button>
      <Button
        variant="default"
        size="game"
        disabled={!canEndTurn || processing}
        onClick={onEndTurn}
        aria-label="پایان نوبت"
      >
        {processing ? (
          <span className="text-sm">در حال پردازش…</span>
        ) : (
          <>
            <LogOut aria-hidden />
            <span>پایان نوبت</span>
          </>
        )}
      </Button>
    </div>
  );
}
