/**
 * Game-wide numeric rules and limits.
 *
 * These values are the canonical source for every rule constant used
 * across the engine, UI and socket layers. Do not duplicate numbers
 * elsewhere — read from here instead.
 */

/** Minimum players required to start a room. */
export const MIN_PLAYERS = 2;

/** Hard maximum players per room (5-player Ludo). */
export const MAX_PLAYERS = 5;

/** Turn duration in milliseconds (2 minutes per turn, server-authoritative). */
export const TURN_DURATION_MS = 2 * 60 * 1000;

/** Consecutive turn timeouts that eliminate a player. */
export const TIMEOUT_ELIMINATION_THRESHOLD = 3;

/** Number of consecutive sixes that trigger the triple-six penalty. */
export const TRIPLE_SIX_THRESHOLD = 3;

/** Maximum number of Undo steps allowed (only before ending the turn). */
export const MAX_UNDO_STEPS = 1;
