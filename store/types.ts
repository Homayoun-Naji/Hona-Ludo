import type { RoomState } from "@/types";

/**
 * Shape of the single shared client-side store.
 *
 * Per CLAUDE.md §416, client (UI) state and server (room, pieces, turn)
 * state must NEVER be mixed. This store exposes a narrow surface:
 * authoritative state arrives through the socket and is slotted here
 * untouched, while the UI keeps only superficial selection state.
 */
export interface RootState {
  /** Authoritative room + game state received from the server. */
  room: RoomState | null;
  /** Transient UI selection (current dice roll, selected piece, etc.). */
  // ui: UiState; — added in a later phase when the UI layer is defined.
}
