import type { PlayerId } from "./player";

/**
 * The visible result of a single dice roll, plus the bookkeeping the
 * engine needs to apply triple-six and per-turn rules.
 *
 * The dice is server-authoritative (CLAUDE.md §8 Dice). The client
 * never generates a roll; it only renders this object.
 */
export interface DiceRoll {
  /** Numeric value of the roll, in [1..6]. */
  readonly value: number;
  /** True iff `value === 6`. Convenience for rules that branch on six. */
  readonly isSix: boolean;
  /**
   * True iff this roll is the last in a run of `TRIPLE_SIX_THRESHOLD`
   * consecutive sixes. The engine uses this to apply the penalty
   * exactly once per triggering roll.
   */
  readonly triggersTripleSixPenalty: boolean;
  /** Number of consecutive sixes including this roll, capped at the threshold. */
  readonly consecutiveSixes: number;
  /** Player whose turn this roll belongs to. */
  readonly rolledBy: PlayerId;
  /**
   * Server timestamp at which the roll was generated. Used to
   * reconcile animation timing and to discard stale replays.
   */
  readonly rolledAt: number;
}
