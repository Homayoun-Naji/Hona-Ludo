import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export type TimerState = "normal" | "warning" | "critical" | "expired";

export interface TimerProps {
  /** Remaining milliseconds (server-authoritative). */
  remainingMs: number;
  /** Total turn duration in milliseconds. */
  durationMs: number;
  /** Current visual state. */
  state?: TimerState;
  /** Persian label / accessibility text. */
  label?: string;
  className?: string;
}

/** Thresholds (percent of remaining) for the warning/critical states. */
const WARNING_THRESHOLD = 0.5; // < 50% remaining
const CRITICAL_THRESHOLD = 0.2; // < 20% remaining

function computeState(remaining: number, total: number): TimerState {
  if (remaining <= 0) return "expired";
  const pct = remaining / total;
  if (pct < CRITICAL_THRESHOLD) return "critical";
  if (pct < WARNING_THRESHOLD) return "warning";
  return "normal";
}

function formatTime(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  const persian = (n: number) =>
    n.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
  return `${persian(m)}:${persian(s).padStart(2, "۰")}`;
}

/**
 * Presentational turn timer. Does NOT calculate authoritative time —
 * receives `remainingMs` from the future server-authoritative layer
 * and renders the countdown + progress bar.
 *
 * Visual states:
 *  - normal:    green accent
 *  - warning:   amber
 *  - critical:  red + pulse
 *  - expired:   dimmed + "اتمام زمان"
 */
export function TurnTimer({
  remainingMs,
  durationMs,
  state: forcedState,
  label = "نوبت شما",
  className,
}: TimerProps) {
  const state = forcedState ?? computeState(remainingMs, durationMs);
  const pct = Math.max(0, remainingMs / durationMs);

  const stateClasses = {
    normal: "text-success",
    warning: "text-warning",
    critical: "text-destructive",
    expired: "text-muted-foreground",
  };

  const barColor = {
    normal: "bg-success",
    warning: "bg-warning",
    critical: "bg-destructive animate-pulse",
    expired: "bg-muted-foreground",
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <div className="relative w-48">
        <motion.div
          className={cn("h-2.5 rounded-full bg-muted", barColor[state])}
          initial={{ width: "100%" }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 0.3, ease: "linear" }}
        />
        {state === "critical" && remainingMs > 0 && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>
      <motion.span
        className={cn("text-2xl font-bold tabular-nums", stateClasses[state])}
        initial={{ scale: 1 }}
        animate={state === "critical" ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: state === "critical" ? Infinity : 1 }}
      >
        {state === "expired" ? "اتمام زمان" : formatTime(remainingMs)}
      </motion.span>
    </div>
  );
}
