import type { Player } from "./player";
import type { GameStatus } from "./game";

/**
 * Room-level state shared with all clients.
 *
 * Persisted exclusively on the server memory. The client receives this
 * as part of every authoritative state push and never builds it locally.
 */
export interface RoomState {
  /** Unique room identifier embedded in the invite link. */
  id: string;
  /** Server-side authorization token for the current viewer, when applicable. */
  viewerId: string | null;
  /** Players currently seated in the room, including the Host. */
  players: ReadonlyArray<Player>;
  /** Locked rooms reject new joiners (set the moment a game starts). */
  isLocked: boolean;
  /** Broad lifecycle stage of the game inside this room. */
  status: GameStatus;
}
