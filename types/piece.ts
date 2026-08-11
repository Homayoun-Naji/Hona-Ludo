import type { PlayerColor } from "@/constants/colors";

/**
 * Where a piece currently lives. The five possible locations correspond
 * to the regions of a 5-player Ludo board and form a closed set: a piece
 * can only transition between them through the rules captured in
 * `engine/movement`.
 *
 * FINISHED is a terminal status set the moment a piece enters the final
 * home cell; it never returns to any other state.
 */
export const PIECE_STATUS = {
  /** In the player's home yard, not yet on the main loop. */
  HOME: "home",
  /** On the shared main loop (the 40-cell ring). */
  ON_BOARD: "on-board",
  /** In the player's own colored home stretch. */
  ON_HOME_PATH: "on-home-path",
  /** Reached the final home cell; contributes to the player's score. */
  FINISHED: "finished",
} as const;

export type PieceStatus = (typeof PIECE_STATUS)[keyof typeof PIECE_STATUS];

/**
 * On the 5-player board, every shared tile is one of these kinds.
 * There are no "safe" tiles in this variant (CLAUDE.md §8 Capture rule),
 * so a single ENTRY/EXIT marker per color is the only special-case
 * behavior; everything else is a regular NORMAL cell.
 *
 * Entry tiles mark the cell where a piece leaves the main loop and
 * enters its home stretch. The two STAR tiles that decorate the
 * physical board in classic Ludo are represented as NORMAL here —
 * they are decorative, not mechanically meaningful in this variant.
 */
export const CELL_KIND = {
  NORMAL: "normal",
  ENTRY_TO_HOME: "entry-to-home",
  CENTER: "center",
} as const;

export type CellKind = (typeof CELL_KIND)[keyof typeof CELL_KIND];

/**
 * Region on the 5-player star-shaped board. Used by the board model
 * so the renderer can group cells without re-deriving geometry.
 */
export const BOARD_REGION = {
  MAIN_PATH: "main-path",
  HOME_YARD: "home-yard",
  HOME_PATH: "home-path",
  CENTER: "center",
} as const;

export type BoardRegion = (typeof BOARD_REGION)[keyof typeof BOARD_REGION];

/**
 * Unique identifier for a single piece on the board.
 *
 * A piece is fully described by the player that owns it plus its
 * index inside that player's set of four pieces. Composing the id
 * from these two values avoids the need for a separate global
 * counter and makes serialization trivial.
 */
export interface PieceId {
  color: PlayerColor;
  index: 0 | 1 | 2 | 3;
}

/**
 * Branded nominal form of `PieceId`, used wherever the type system
 * should not allow accidental mixing with other composite ids.
 */
export type PieceIdValue = string & { readonly __brand: "PieceId" };

/**
 * Location-independent state of a single piece.
 *
 * Carries both its status (where it is) and any metadata the engine
 * needs to reason about it (steps taken, capture immunity, etc.).
 *
 * `stepsTaken` is the number of cells the piece has moved from its
 * color-specific entry cell on the main loop. It is the canonical
 * measure used for finish detection and home-stretch transitions,
 * and is independent of the absolute cell id so that piece state is
 * always trivially comparable across replays.
 */
export interface PieceState {
  readonly id: PieceId;
  readonly status: PieceStatus;
  /**
   * Cumulative steps taken along the main loop. 0 means the piece has
   * never left its home yard. Once `status === "finished"` this
   * value is no longer updated.
   */
  stepsTaken: number;
}
