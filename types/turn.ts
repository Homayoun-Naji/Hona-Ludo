/**
 * Per-turn state machine. The turn belongs to exactly one player at a
 * time and advances strictly through the transitions documented in
 * `docs/DomainStateMachine.md`.
 *
 * ROLLING and MOVING are server-side micro-states that clients only
 * observe through the dice roll and piece move events; the engine
 * uses them to refuse out-of-order intents.
 */
export const TURN_STATUS = {
  /** Pre-game or between turns; no dice has been rolled. */
  IDLE: "idle",
  /** Server is generating the dice value for the current player. */
  ROLLING: "rolling",
  /** Dice is fixed; current player may select a piece to move. */
  SELECTING_PIECE: "selecting-piece",
  /** Server is animating / committing the move. */
  MOVING: "moving",
  /** Move committed, waiting for the player to press End Turn. */
  WAITING_END_TURN: "waiting-end-turn",
  /** Turn is complete; the engine is about to advance to the next player. */
  TURN_ENDED: "turn-ended",
  /** No legal moves for this dice; the engine will skip to next player. */
  SKIPPED: "skipped",
} as const;

export type TurnStatus = (typeof TURN_STATUS)[keyof typeof TURN_STATUS];

/**
 * Replay lifecycle. Replay is host-initiated and only valid when the
 * host is present (CLAUDE.md §8 Replay rule). The lifecycle lives
 * separately from Room/Game status so a finished game can be reset
 * without losing the seat assignments.
 */
export const REPLAY_STATUS = {
  /** Replay not requested. */
  IDLE: "idle",
  /** Host has requested a Replay; awaiting confirmation broadcast. */
  REQUESTED: "requested",
  /** Engine is performing the reset; clients should clear their caches. */
  RESETTING: "resetting",
  /** Replay unavailable (e.g. host absent). */
  UNAVAILABLE: "unavailable",
} as const;

export type ReplayStatus = (typeof REPLAY_STATUS)[keyof typeof REPLAY_STATUS];
