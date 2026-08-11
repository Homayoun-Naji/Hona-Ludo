import type { PlayerColor } from "@/constants/colors";
import type { ConnectionStatus, PlayerStatus } from "./game";

/**
 * Stable, opaque identifier for a player inside a room.
 *
 * Generated server-side at join time. Opaque on purpose: clients must
 * never parse or construct it. Kept as a brand-like nominal type so
 * accidental string mixing is caught at compile time.
 */
export type PlayerId = string & { readonly __brand: "PlayerId" };

/**
 * Identity record for a player inside a room.
 *
 * Game-derived data (turn order, timeout count, elimination status)
 * belongs to the engine state, not this identity object. Splitting
 * identity from engine state lets the same Player persist across a
 * Replay without rewriting the record.
 *
 * `color` is the color the player has chosen in the lobby phase. It
 * stays on the identity record (not the runtime) so it survives a
 * Replay without a write.
 */
export interface Player {
  /** Stable identifier assigned by the server when the player joins. */
  readonly id: PlayerId;
  /** Display name entered by the user. Session-only, not persisted. */
  displayName: string;
  /** Currently selected color, if any (null during the join handshake). */
  color: PlayerColor | null;
}

/**
 * Per-player engine state.
 *
 * Lives separately from `Player` because it is mutated by the engine
 * (timeouts, ready toggles, elimination) while the identity is
 * effectively immutable for the duration of the room session.
 *
 * `color` is intentionally absent here: the player's chosen color
 * lives on `Player.color`. The engine reads it from there to avoid
 * a duplicate source of truth.
 */
export interface PlayerRuntime {
  /** Back-reference to the owning identity record. */
  readonly id: PlayerId;
  /** Current ready flag (only meaningful before the game starts). */
  readonly ready: boolean;
  /** Lifecycle state for this player inside the room. */
  readonly status: PlayerStatus;
  /** Network reachability. */
  readonly connection: ConnectionStatus;
  /** Number of times this player has timed out on their turn. */
  readonly timeoutCount: number;
  /** Position in the turn cycle, if the game has started. */
  readonly turnOrder: number | null;
  /** Number of pieces this player has finished (reached HOME). */
  readonly finishedPieceCount: number;
}
