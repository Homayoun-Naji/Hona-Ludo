import type { PlayerId } from "./player";
import type { GameState } from "./game-state";

/**
 * A named, versioned snapshot of a full game for replay/undo.
 *
 * `kind` discriminates the purpose of the snapshot, so the engine
 * can pick the right retention policy and the UI can label it
 * correctly.
 *
 * `payload` is the full `GameState` at the moment the snapshot was
 * taken. The engine is free to choose how often to snapshot
 * (e.g. once per turn boundary) without changing the type.
 *
 * Note: `replay-seed` is intentionally absent here. The Replay
 * lifecycle carries its own `seedState` on `ReplayState`; a replay
 * seed is not a general-purpose undo snapshot.
 */
export interface Snapshot {
  /** Discriminator for what this snapshot represents. */
  readonly kind: "turn-boundary" | "undo-restore";
  /** Monotonic id within the parent game. */
  readonly id: number;
  /** The captured game state. */
  readonly payload: GameState;
  /** Server timestamp at which the snapshot was captured. */
  readonly capturedAt: number;
  /**
   * Player associated with the snapshot, when applicable.
   * For "undo-restore" this is the player who issued the undo;
   * for "turn-boundary" this is the player whose turn just ended.
   */
  readonly ownerId: PlayerId | null;
}
