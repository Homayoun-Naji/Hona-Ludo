/**
 * The five selectable player colors used on the 5-player board.
 *
 * This is a *fixed* enumeration of the colors that exist on the board.
 * The array order is alphabetical-only and does NOT encode seat order,
 * turn order, or home position. Those are derived dynamically from the
 * room state at game start.
 */

export const PLAYER_COLORS = ["red", "blue", "green", "yellow", "purple"] as const;
export type PlayerColor = (typeof PLAYER_COLORS)[number];

/**
 * Per-color home / start position on the star-shaped board.
 *
 * The board is built for 5 players from the start; "empty" homes stay in
 * the layout even when fewer than 5 players are seated, because the
 * shape never changes based on player count (CLAUDE.md §9).
 *
 * The order here is the canonical seat order on the physical board —
 * it is the only place where a stable color-to-position mapping lives.
 * Turn order, by contrast, is derived dynamically from the room state.
 */
export const PLAYER_HOME_POSITIONS = [
  "top",
  "top-right",
  "bottom-right",
  "bottom-left",
  "top-left",
] as const;

export type PlayerHomePosition = (typeof PLAYER_HOME_POSITIONS)[number];
