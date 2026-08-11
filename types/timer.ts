import type { PlayerId } from "./player";

/**
 * Server-authoritative timer. The UI renders a countdown from
 * `expiresAt - now`; the engine uses `expiresAt` to evaluate timeout.
 *
 * `durationMs` is captured at turn start so that a future change to
 * the room's `turnDurationMs` setting only affects subsequent turns.
 *
 * Immutable: the engine produces a new `Timer` on each tick or
 * transition rather than mutating the live one.
 */
export interface Timer {
  /** Total length of this turn's budget in milliseconds. */
  readonly durationMs: number;
  /** Wall-clock timestamp at which the turn will time out. */
  readonly expiresAt: number;
  /** True iff the timer has already fired and the turn was lost. */
  readonly expired: boolean;
  /** Player whose turn this timer is for. */
  readonly forPlayerId: PlayerId;
  /**
   * The exact server timestamp the timer was started. Captured so
   * reconnecting clients can compute how much time elapsed even
   * if they missed intermediate updates.
   */
  readonly startedAt: number;
}
