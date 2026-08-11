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

/** Number of pieces each player owns. */
export const PIECES_PER_PLAYER = 4;

/** Minimum value on a die. */
export const DICE_MIN = 1;

/** Maximum value on a die. */
export const DICE_MAX = 6;

/** Number of cells in a single player's home (final) path. */
export const HOME_PATH_LENGTH = 5;

/** Total number of cells on the shared main loop. */
export const MAIN_PATH_LENGTH = 40;

/**
 * Total number of cells a piece travels from its starting position,
 * through the full main loop, and into the home stretch (final cell).
 */
export const TOTAL_TRAVEL_CELLS = MAIN_PATH_LENGTH + HOME_PATH_LENGTH;
