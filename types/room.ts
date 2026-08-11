import type { PlayerColor } from "@/constants/colors";
import type { GameStatus, RoomStatus } from "./game";
import type { Player, PlayerId, PlayerRuntime } from "./player";
import type { RoomId } from "./ids";
import type { ReplayStatus } from "./turn";

/**
 * Static configuration applied to a room. Stored in the room state so
 * the host's choices travel with the room and survive a Replay.
 *
 * `roomCode` is the only field that is persisted into the invite
 * link; everything else is server-side and never exposed.
 */
export interface RoomSettings {
  /** Whether the host has enabled Replay eligibility for this room. */
  readonly replayEnabled: boolean;
  /** Maximum players allowed in the room; capped at MAX_PLAYERS. */
  readonly maxPlayers: number;
  /**
   * Color set available for selection. Defaults to the full 5-color
   * palette, but the host may restrict it (e.g. only red+blue for a
   * 2-player game). The list is never reordered by the engine.
   */
  readonly allowedColors: ReadonlyArray<PlayerColor>;
  /** Turn duration override in milliseconds. Null = use default. */
  readonly turnDurationMs: number | null;
}

/**
 * Runtime state of a room, the single source of truth for everything
 * visible to clients.
 *
 * Persisted exclusively on the server memory. The client receives this
 * as part of every authoritative state push and never builds it locally.
 *
 * The split between `players` (identity) and `runtimes` (engine state)
 * is intentional: identity records are essentially immutable for the
 * life of a join session, while runtimes change every move.
 *
 * Invariant: `runtimes` is a strict subset of `players` keyed by id.
 * On `LEFT` / `ELIMINATED` transitions the runtime entry is removed.
 */
export interface RoomState {
  /** Unique room identifier embedded in the invite link. */
  readonly id: RoomId;
  /** Identity of the currently connected viewer, or null if observer. */
  readonly viewerId: PlayerId | null;
  /** The host. Authoritative source of who owns this room. */
  readonly hostId: PlayerId;
  /** Players currently seated in the room, including the Host. */
  readonly players: ReadonlyArray<Player>;
  /** Per-player engine state, keyed by id. Always a subset of `players`. */
  readonly runtimes: Readonly<Record<PlayerId, PlayerRuntime>>;
  /** Static settings (replay eligibility, color pool, etc.). */
  readonly settings: RoomSettings;
  /** Room admission-control lifecycle. */
  readonly roomStatus: RoomStatus;
  /** Broad lifecycle stage of the game inside this room. */
  readonly gameStatus: GameStatus;
  /** Current Replay lifecycle, decoupled from game status. */
  readonly replayStatus: ReplayStatus;
  /** Monotonic id of the latest room-level mutation. */
  readonly version: number;
  /** Server timestamp of the last state mutation. */
  readonly updatedAt: number;
}
