import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

export type DiceState =
  | "idle" // no roll yet / waiting
  | "rolling" // animating a roll
  | "value" // showing a rolled value
  | "disabled"; // turn not active

const DICE_ICONS: Record<DiceValue, React.ElementType> = {
  1: Dice1,
  2: Dice2,
  3: Dice3,
  4: Dice4,
  5: Dice5,
  6: Dice6,
};

export interface DiceProps {
  /** The value to display. Required when state === "value". */
  value?: DiceValue;
  /** Current visual state. */
  state?: DiceState;
  /** Whether it is currently the owner's turn. */
  isCurrentTurn?: boolean;
  /** Called when the player wants to roll. */
  onRoll?: () => void;
  /** Accessible label override. */
  "aria-label"?: string;
  className?: string;
}

/**
 * Presentational single die — no RNG, no rules.
 *
 * The game uses exactly ONE die (CLAUDE.md §8 Dice). This component
 * never renders a pair or attempts to support multiple dice.
 *
 * Visual states:
 *  - idle:    outline, tappable
 *  - rolling: spinning icon (placeholder animation — real roll
 *             animations ship in a later phase)
 *  - value:   filled with pips
 *  - disabled: dimmed, untappable
 */
export function Dice({
  value,
  state = "idle",
  isCurrentTurn = false,
  onRoll,
  className,
  ...rest
}: DiceProps) {
  const Icon = value ? DICE_ICONS[value] : Dice1;
  const disabled = state === "disabled" || !isCurrentTurn;
  const isRolling = state === "rolling";

  return (
    <motion.button
      type="button"
      disabled={disabled || isRolling}
      onClick={onRoll}
      aria-label={
        rest["aria-label"] ??
        (value
          ? `تاس ${value}`
          : state === "rolling"
            ? "در حال انداختن تاس"
            : "انداختن تاس")
      }
      className={cn(
        "relative flex h-14 w-14 items-center justify-center rounded-xl border text-4xl transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        state === "value"
          ? "border-primary bg-primary/10 text-primary"
          : state === "rolling"
            ? "border-accent animate-pulse text-accent-foreground"
            : "border-border bg-surface text-muted-foreground",
        isRolling && "animate-spin",
        disabled && "cursor-not-allowed opacity-40",
        className,
      )}
      {...rest}
    >
      {isRolling ? (
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
          className="block"
        >
          <Dice6 aria-hidden />
        </motion.span>
      ) : (
        <Icon aria-hidden />
      )}
    </motion.button>
  );
}
