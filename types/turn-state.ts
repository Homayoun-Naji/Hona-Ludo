import type { PlayerId } from "./player";
import type { DiceRoll } from "./dice";
import type { CommittedMove } from "./move";
import type { TurnStatus } from "./turn";

/**
 * A turn is the unit of authority in the engine: at any moment
 * exactly one turn is "current" within a game, and every action
 * is evaluated against its `status`, `dice`, and `committedMoves`.
 *
 * `committedMoves` holds every move applied during the current
 * turn. The Undo rule allows the player to pop the last one off,
 * but only while `status === "waiting-end-turn"` and only up to
 * `MAX_UNDO_STEPS` deep.
 *
 * All fields are readonly so the engine replaces the whole turn
 * object on each transition; it never mutates an in-flight turn
 * in place. This makes snapshotting trivially correct.
 */
export interface Turn {
  /** Index of this turn within the game, starting at 0. */
  readonly index: number;
  /** Player whose turn it is. */
  readonly currentPlayerId: PlayerId;
  /** Current state of the turn lifecycle. */
  readonly status: TurnStatus;
  /**
   * The roll for this turn, if any. Set when status transitions to
   * ROLLING and frozen when status moves out of SELECTING_PIECE.
   */
  readonly dice: DiceRoll | null;
  /**
   * Move committed this turn so far. Reset on turn boundary.
   * Undo is implemented by replacing the array with a truncated copy.
   */
  readonly committedMoves: ReadonlyArray<CommittedMove>;
  /**
   * Server timestamp at which this turn started. Used to drive
   * the turn timer (see Timer) and to identify stale turns on
   * reconnect.
   */
  readonly startedAt: number;
  /**
   * Server timestamp at which the player pressed End Turn, or
   * the turn auto-ended. Null while the turn is still live.
   */
  readonly endedAt: number | null;
}
