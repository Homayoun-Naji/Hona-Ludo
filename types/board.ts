import type { PlayerColor } from "@/constants/colors";
import type { CellKind, BoardRegion } from "./piece";

/**
 * A 2D position in the SVG board's coordinate space.
 *
 * Coordinates are in board units (not pixels) so the renderer can
 * scale to any viewport without losing precision. The origin (0,0)
 * is the top-left of the board bounding box; the Y axis grows
 * downward to match SVG conventions.
 */
export interface BoardCoordinate {
  x: number;
  y: number;
}

/**
 * One cell on the board. Cells are the smallest addressable unit and
 * are immutable on the data side — the engine never moves cells, it
 * only moves pieces between them.
 *
 * `kind` describes the mechanical role of the cell (regular, entry
 * to home stretch, or center). The renderer reads this to apply
 * distinct decoration, but the engine treats every cell uniformly
 * except for the ENTRY_TO_HOME case.
 */
export interface BoardCell {
  /** Stable, indexable id of the cell within its region. */
  readonly id: string;
  /** Which region this cell belongs to. */
  readonly region: BoardRegion;
  /** Mechanical role of the cell. */
  readonly kind: CellKind;
  /**
   * Position of the cell's center in board units. Pieces animate to
   * this point; the renderer may add a small offset for stacking
   * (not currently used — the rules forbid same-color stacking).
   */
  readonly coordinate: BoardCoordinate;
  /**
   * If `kind === "entry-to-home"`, the color whose home stretch
   * this entry leads to. Otherwise null.
   */
  readonly entryFor: PlayerColor | null;
  /**
   * Absolute step index on the shared main loop. Null for cells
   * that are not on the main loop (home yards, home stretches,
   * center). Indexing wraps around modulo MAIN_PATH_LENGTH.
   */
  readonly mainPathIndex: number | null;
}

/**
 * A continuous ordered sequence of cells, plus the index of the
 * cell each color enters the main loop from.
 *
 * Three paths are defined per color:
 *  - mainPath: the shared 40-cell ring, in clockwise order.
 *  - homePath: the player's private 5-cell home stretch.
 *  - homeYard: the four starting cells (pieces start here, leave
 *    only on a dice-six).
 *
 * The board is data-driven: rendering reads from this structure
 * and never holds its own copy of the geometry.
 */
export interface BoardPath {
  /** Color this path set belongs to. */
  readonly color: PlayerColor;
  /** Ordered cells on the shared main loop that this color walks. */
  readonly mainPath: ReadonlyArray<BoardCell>;
  /** The shared main-loop index from which this color enters home. */
  readonly entryIndex: number;
  /** Ordered cells of the private home stretch (final stretch). */
  readonly homePath: ReadonlyArray<BoardCell>;
  /** The four home yard cells where pieces start. */
  readonly homeYard: ReadonlyArray<BoardCell>;
}

/**
 * The full board model. Carries enough data for a renderer to draw
 * the entire 5-player star-shaped board from scratch, with no
 * additional configuration.
 *
 * The board shape is fixed: 5 players, 5 colors, 40 main cells,
 * 5 home cells per color, 4 home yard cells per color, and a
 * single shared center cell. The model never changes shape based
 * on how many players are seated (CLAUDE.md §9).
 */
export interface BoardModel {
  /** Bounding box of the entire board in board units. */
  readonly bounds: {
    readonly width: number;
    readonly height: number;
  };
  /** All main-loop cells in clockwise order. */
  readonly mainPath: ReadonlyArray<BoardCell>;
  /** Per-color path bundles (main + home + home yard). */
  readonly paths: Readonly<Record<PlayerColor, BoardPath>>;
  /** The single center cell (visual and decorative only). */
  readonly center: BoardCell;
}
