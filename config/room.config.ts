/**
 * Room-level runtime configuration.
 *
 * Lives in the application layer (not the engine) because it mixes
 * transport and policy concerns. The room host's choices at creation
 * time populate this object; the socket handlers read it to decide
 * who may join and for how long.
 */

export interface RoomConfig {
  /** Hard ceiling on concurrent players (never exceeds MAX_PLAYERS). */
  readonly maxPlayers: number;
  /** Minimum players required for the host's Start button to be enabled. */
  readonly minPlayers: number;
  /** Whether the room is private (invite-only). Always true for this project. */
  readonly private: boolean;
  /** Inactivity grace period (ms) before a disconnected player is dropped. */
  readonly disconnectGraceMs: number;
  /** Maximum number of players that can be eliminated before the game ends early. */
  readonly eliminationToEndThreshold: number;
}

/**
 * Default room configuration derived from the project's hard
 * constraints (CLAUDE.md §11 & §8).
 */
export const roomConfig: RoomConfig = {
  maxPlayers: 5,
  minPlayers: 2,
  private: true,
  disconnectGraceMs: 5 * 60 * 1000,
  eliminationToEndThreshold: 4,
};
