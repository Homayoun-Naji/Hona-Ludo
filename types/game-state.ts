import type { PlayerId } from "./player";
import type { Turn } from "./turn-state";
import type { Timer } from "./timer";
import type { PieceState, PieceIdValue } from "./piece";
import type { PlayerColor } from "@/constants/colors";
import type { DiceRoll } from "./dice";
import type { CommittedMove } from "./move";
import type { GameStatus } from "./game";

/**
 * Full snapshot of the game state at a point in time.
 *
 * The engine produces a new `GameState` for every committed move;
 * a serialized snapshot is what flows to clients over the socket
 * and what the engine stores for Replay and snapshot-based Undo.
 *
 * The shape is intentionally flat: there is exactly one `turn`
 * (the live one) and one `timer`, and the `pieces` and `players`
 * arrays are full replacements rather than diffs. Clients merge
 * by replacing their local state with the snapshot, which keeps
 * the synchronization logic simple and resilient to missed events.
 */
export interface GameState {
  /** Sequential id of this snapshot, monotonically increasing. */
  readonly snapshotId: number;
  /**
   * Monotonic version of this room-level snapshot, mirroring
   * `RoomState.version`. Lets a client detect that it is ahead of
   * or behind the server on a *room* basis.
   */
  readonly roomVersion: number;
  /** Status of the game at this snapshot. */
  status: GameStatus;
  /**
   * Map of player id to the color that player is currently using.
   * Mirrors RoomState.runtimes but flattened for the engine.
   */
  playerColors: Readonly<Record<PlayerId, PlayerColor | null>>;
  /**
   * Map of color to the player id currently playing that color.
   * The inverse of `playerColors`; both are stored to avoid
   * repeated lookups during rule evaluation.
   */
  colorOwners: Readonly<Record<PlayerColor, PlayerId | null>>;
  /**
   * All pieces on the board, keyed by their composite id (a
   * `PieceIdValue`). The engine treats this map as the canonical
   * piece store. Using the branded type prevents accidental mixing
   * with arbitrary strings.
   */
  pieces: Readonly<Record<PieceIdValue, PieceState>>;
  /** Current turn, or null if the game has not started. */
  currentTurn: Turn | null;
  /** Current timer, or null if there is no live turn. */
  currentTimer: Timer | null;
  /**
   * Ordered list of all committed moves in this game. This is
   * the authoritative history used for Replay and snapshot
   * reconstruction. Undo is implemented by truncating the tail.
   */
  history: ReadonlyArray<CommittedMove>;
  /** Last dice roll committed (kept for UI animations). */
  lastDice: DiceRoll | null;
  /** Server timestamp at which this snapshot was produced. */
  generatedAt: number;
}
