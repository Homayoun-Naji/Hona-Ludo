/**
 * The five selectable player colors used on the 5-player board.
 *
 * The order is intentionally non-static; it does not encode turn order.
 * Color order is decided by the room state, never by this list.
 */

export const PLAYER_COLORS = ["red", "blue", "green", "yellow", "purple"] as const;
export type PlayerColor = (typeof PLAYER_COLORS)[number];
