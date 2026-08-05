import type { PlayerColor } from "@/constants/colors";

/**
 * Identity record for a player inside a room.
 *
 * Game-derived data (turn order, timeout count, elimination status)
 * belongs to the engine state, not this identity object.
 */
export interface Player {
  /** Stable identifier assigned by the server when the player joins. */
  readonly id: string;
  /** Display name entered by the user. Session-only, not persisted. */
  displayName: string;
  /** Currently selected color, if any. */
  color: PlayerColor | null;
  /** Whether the player is the room creator (the Host). */
  isHost: boolean;
}
