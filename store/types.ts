import type { RoomState } from "@/types";

/**
 * Shape of the single shared client-side store.
 *
 * Per CLAUDE.md §416, client (UI) state and server (room, pieces, turn)
 * state must NEVER be mixed. This store exposes only the authoritative
 * state received from the server; any superficial UI state (selected
 * piece, modal visibility, animation flags) lives in component-local
 * React state, not here.
 */
export interface RootState {
  /** Authoritative room + game state received from the server. */
  room: RoomState | null;
}
