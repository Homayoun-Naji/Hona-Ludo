import type { PlayerColor } from "@/constants/colors";
import type { PieceId, PieceStatus } from "./piece";
import type { PlayerId } from "./player";
import type { DiceRoll } from "./dice";
import type { BoardCell } from "./board";
import type { GameAction } from "./action";
import type { DomainErrorCode } from "./error";

/**
 * Type of move, used to discriminate how the engine and renderer
 * interpret the rest of the payload.
 *
 * The categories are exhaustive over the kinds of moves a piece can
 * make on a 5-player Ludo board: leave home, walk the main loop,
 * transition into the home stretch, finish, or be captured.
 */
export type MoveKind =
  | "exit-home"
  | "walk"
  | "enter-home-path"
  | "finish"
  | "capture"
  | "no-move";

/**
 * A single authored move intent.
 *
 * Intents are emitted by the client when a player selects a piece;
 * the engine validates the intent against the current game state
 * and either promotes it to a `CommittedMove` (in `MoveResult`) or
 * rejects it with a `DomainErrorCode`.
 *
 * The intent carries enough information that:
 *  - the engine can validate without consulting the client;
 *  - a replay can reconstruct the move from a stored intent;
 *  - the renderer can preview the destination cell;
 *  - the server can synchronize intents to all clients in a single
 *    authoritative message.
 */
export interface MoveIntent {
  /** Player attempting the move. */
  readonly playerId: PlayerId;
  /** Color of the piece being moved. */
  readonly color: PlayerColor;
  /** Identifier of the piece being moved. */
  readonly pieceId: PieceId;
  /** The dice roll this move responds to. */
  readonly dice: DiceRoll;
  /** Discriminator describing what kind of move this is. */
  readonly kind: MoveKind;
  /**
   * Client-side timestamp of when the player issued the intent.
   * Used only for telemetry and out-of-order detection; the
   * server-authoritative `appliedAt` lives on the committed move.
   */
  readonly issuedAt: number;
}

/**
 * A move that has been validated and applied to game state.
 *
 * Committed moves are immutable. The engine records every committed
 * move in the snapshot log, which is the source of truth for Replay
 * and Undo.
 *
 * `beforeCell` and `afterCell` are full cells (not just ids) so the
 * renderer can animate the move without looking up coordinates at
 * playback time. `capturedPiece`, when present, is the opponent
 * piece sent back to its home yard as a side-effect of this move.
 */
export interface CommittedMove {
  /** Sequential index of this move within the current game. */
  readonly index: number;
  /** Action that produced this move, drawn from GameAction. */
  readonly action: GameAction;
  /** The original intent that was validated. */
  readonly intent: MoveIntent;
  /** Status of the piece before the move was applied. */
  readonly pieceStatusBefore: PieceStatus;
  /** Status of the piece after the move was applied. */
  readonly pieceStatusAfter: PieceStatus;
  /** Cell the piece occupied before the move (null if exiting home yard). */
  readonly beforeCell: BoardCell | null;
  /** Cell the piece occupied after the move. */
  readonly afterCell: BoardCell;
  /**
   * If the move captured an opponent piece, the snapshot of the
   * captured piece's state right before capture. Null otherwise.
   */
  readonly capturedPiece: {
    readonly pieceId: PieceId;
    readonly fromCell: BoardCell;
  } | null;
  /** Server timestamp of the application of this move. */
  readonly appliedAt: number;
}

/**
 * Result of submitting a MoveIntent to the engine.
 *
 * Either the move is committed and `ok === true`, or the engine
 * refused it and `ok === false` with a `DomainErrorCode`. The
 * discriminated union forces every consumer to handle both paths.
 */
export type MoveResult =
  | {
      readonly ok: true;
      readonly move: CommittedMove;
    }
  | {
      readonly ok: false;
      readonly code: DomainErrorCode;
      /**
       * Optional human-readable reason for logs / debug surfaces.
       * Never surfaced to UI without translation.
       */
      readonly reason?: string;
    };
