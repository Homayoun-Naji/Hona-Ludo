import type { GameAction } from "@/types/action";

/**
 * Ludo rule configuration.
 *
 * Aggregates the scalar rule constants from `@/constants/game` into a
 * single, composable type so future rule variants can override
 * individual knobs without editing constants.
 *
 * The engine reads this interface (the default exported constant)
 * at startup. Tests may construct a `RulesConfig` with non-standard
 * values to exercise edge cases (e.g. short turn timers).
 */

export interface RulesConfig {
  /** Number of pieces each player owns. */
  readonly piecesPerPlayer: number;
  /** Minimum roll value on a single die. */
  readonly diceMin: number;
  /** Maximum roll value on a single die. */
  readonly diceMax: number;
  /** Cells on the shared main loop. */
  readonly mainPathLength: number;
  /** Cells on a single player's final home stretch. */
  readonly homePathLength: number;
  /** Roll value that grants an extra turn. */
  readonly extraTurnValue: number;
  /** Consecutive sixes that trigger the penalty. */
  readonly tripleSixThreshold: number;
  /** Turn timeout before loss / elimination. */
  readonly turnTimeoutMs: number;
  /** Number of timeouts before elimination. */
  readonly timeoutEliminationThreshold: number;
  /** Maximum undo depth (steps) before a turn ends. */
  readonly maxUndoSteps: number;
  /**
   * Whether captured pieces return to their home yard or to the
   * exact cell they started the game on. True = home yard (this project).
   */
  readonly captureReturnsToHomeYard: boolean;
  /**
   * Whether a piece must land exactly on the final cell to finish,
   * or whether overshooting is allowed (the piece then occupies
   * the last cell it can). True = exact landing required.
   */
  readonly exactFinishRequired: boolean;
}

export const rulesConfig: RulesConfig = {
  piecesPerPlayer: 4,
  diceMin: 1,
  diceMax: 6,
  mainPathLength: 40,
  homePathLength: 5,
  extraTurnValue: 6,
  tripleSixThreshold: 3,
  turnTimeoutMs: 2 * 60 * 1000,
  timeoutEliminationThreshold: 3,
  maxUndoSteps: 1,
  captureReturnsToHomeYard: true,
  exactFinishRequired: true,
};

/**
 * Map from engine action to the rule knob it consults, declared
 * for documentation and future rule-override tooling.
 *
 * Indexed by the literal string values of each GameAction variant.
 */
export const RULE_DEPENDENCY: Readonly<
  Record<GameAction, keyof RulesConfig>
> = {
  "roll-dice": "diceMax",
  "exit-home": "diceMax",
  "select-piece": "exactFinishRequired",
  "move-piece": "exactFinishRequired",
  "undo-move": "maxUndoSteps",
  "end-turn": "turnTimeoutMs",
  timeout: "timeoutEliminationThreshold",
  capture: "captureReturnsToHomeYard",
  "finish-piece": "exactFinishRequired",
  "enter-home-path": "homePathLength",
  "finish-game": "piecesPerPlayer",
  "start-game": "piecesPerPlayer",
  "triple-six-penalty": "tripleSixThreshold",
  "eliminate-player": "timeoutEliminationThreshold",
  replay: "turnTimeoutMs",
};
