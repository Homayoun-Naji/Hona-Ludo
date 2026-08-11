import type { PlayerId } from "./player";
import type { RoomId } from "./ids";
import type { PlayerColor } from "@/constants/colors";
import type { PieceId } from "./piece";
import type { DiceRoll } from "./dice";
import type { CommittedMove } from "./move";
import type { Turn } from "./turn-state";
import type { GameState } from "./game-state";
import type { RoomState } from "./room";
import type { ReplayState } from "./replay";
import type { Placement } from "./winner";

/**
 * Core domain events. These are the facts the engine emits; the
 * Socket.IO layer (Phase 5) simply maps each event to the
 * corresponding `SOCKET_EVENTS` string, but the events themselves
 * are transport-agnostic by design.
 *
 * Every event carries a server-generated `timestamp` in its base so
 * clients can order them without trusting their own clocks.
 */

export interface DomainEventBase {
  /** Server wall-clock timestamp at which the event was recorded. */
  readonly timestamp: number;
  /** The player responsible for this event, if any. Null = system. */
  readonly playerId: PlayerId | null;
  /** The room this event belongs to. */
  readonly roomId: RoomId;
}

export interface PlayerJoinedEvent extends DomainEventBase {
  readonly type: "player-joined";
  readonly playerId: PlayerId;
  readonly displayName: string;
  readonly newColor: PlayerColor | null;
  readonly seatIndex: number;
}

export interface PlayerLeftEvent extends DomainEventBase {
  readonly type: "player-left";
  readonly playerId: PlayerId;
  readonly reason: "voluntary" | "disconnected" | "eliminated";
}

export interface PlayerReconnectedEvent extends DomainEventBase {
  readonly type: "player-reconnected";
  readonly playerId: PlayerId;
}

export interface ColorSelectedEvent extends DomainEventBase {
  readonly type: "color-selected";
  readonly playerId: PlayerId;
  readonly from: PlayerColor | null;
  readonly to: PlayerColor;
}

export interface ReadyChangedEvent extends DomainEventBase {
  readonly type: "ready-changed";
  readonly playerId: PlayerId;
  readonly ready: boolean;
}

export interface GameStartedEvent extends DomainEventBase {
  readonly type: "game-started";
  readonly playerOrder: ReadonlyArray<PlayerId>;
  readonly startedBy: PlayerId;
}

export interface TurnStartedEvent extends DomainEventBase {
  readonly type: "turn-started";
  readonly turn: Turn;
}

export interface DiceRolledEvent extends DomainEventBase {
  readonly type: "dice-rolled";
  readonly playerId: PlayerId;
  readonly dice: DiceRoll;
}

export interface PieceSelectedEvent extends DomainEventBase {
  readonly type: "piece-selected";
  readonly playerId: PlayerId;
  readonly pieceId: PieceId;
  readonly availableMoves: ReadonlyArray<{
    readonly index: number;
    readonly target: { readonly x: number; readonly y: number };
  }>;
}

export interface PieceMovedEvent extends DomainEventBase {
  readonly type: "piece-moved";
  readonly playerId: PlayerId;
  readonly move: CommittedMove;
}

export interface UndoMoveEvent extends DomainEventBase {
  readonly type: "undo-move";
  readonly playerId: PlayerId;
  readonly revertedMove: CommittedMove;
}

export interface TurnEndedEvent extends DomainEventBase {
  readonly type: "turn-ended";
  readonly turn: Turn;
  /** Index of the next player in the cycle. */
  readonly nextPlayerId: PlayerId | null;
}

export interface TurnTimeoutEvent extends DomainEventBase {
  readonly type: "turn-timeout";
  readonly playerId: PlayerId;
  /** Number of timeouts now attributed to this player. */
  readonly timeoutCount: number;
  readonly eliminated: boolean;
}

export interface PlayerEliminatedEvent extends DomainEventBase {
  readonly type: "player-eliminated";
  readonly playerId: PlayerId;
  readonly reason: "triple-timeout" | "manual";
}

export interface TripleSixPenaltyEvent extends DomainEventBase {
  readonly type: "triple-six-penalty";
  readonly playerId: PlayerId;
  /** Pieces reset to their home yard as a result of this penalty. */
  readonly affectedPieces: ReadonlyArray<PieceId>;
}

export interface ReplayRequestedEvent extends DomainEventBase {
  readonly type: "replay-requested";
  readonly playerId: PlayerId;
  readonly fromGameEnd: boolean;
}

export interface ReplayStartedEvent extends DomainEventBase {
  readonly type: "replay-started";
  readonly replay: ReplayState;
  readonly seedState: GameState;
}

export interface GameFinishedEvent extends DomainEventBase {
  readonly type: "game-finished";
  readonly placements: ReadonlyArray<Placement>;
}

export interface RoomLockedEvent extends DomainEventBase {
  readonly type: "room-locked";
}

export interface RoomClosedEvent extends DomainEventBase {
  readonly type: "room-closed";
  readonly reason: "host-left" | "manual" | "all-left";
}

export interface StateSyncedEvent extends DomainEventBase {
  readonly type: "state-synced";
  readonly room: RoomState;
  readonly game: GameState | null;
}

/**
 * Discriminated union of every domain event. Consumers switch on
 * `event.type` to route handling. Adding a new event is an explicit
 *, deliberate act: the new interface must be listed here.
 */
export type DomainEvent =
  | PlayerJoinedEvent
  | PlayerLeftEvent
  | PlayerReconnectedEvent
  | ColorSelectedEvent
  | ReadyChangedEvent
  | GameStartedEvent
  | TurnStartedEvent
  | DiceRolledEvent
  | PieceSelectedEvent
  | PieceMovedEvent
  | UndoMoveEvent
  | TurnEndedEvent
  | TurnTimeoutEvent
  | PlayerEliminatedEvent
  | TripleSixPenaltyEvent
  | ReplayRequestedEvent
  | ReplayStartedEvent
  | GameFinishedEvent
  | RoomLockedEvent
  | RoomClosedEvent
  | StateSyncedEvent;
