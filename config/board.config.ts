import type { PlayerColor } from "@/constants/colors";
import type { PlayerHomePosition } from "@/constants/colors";
import type { BoardModel, BoardCell, BoardPath } from "@/types/board";

/**
 * Static configuration that describes the 5-player star-shaped board.
 *
 * Filled during Phase 7 (Board Rendering). Until then this module is
 * a type-only placeholder so that the rest of the domain can import
 * the `BoardConfig` type and compile.
 *
 * The board is data-driven (CLAUDE.md §9): the renderer and the
 * engine both read from a single `BoardConfig` instance and never
 * hold independent copies of the geometry.
 */

export interface BoardConfig {
  /** Full, immutable board model used for rendering and move calculation. */
  readonly model: BoardModel;
  /**
   * Maps each color to its physical home position on the star, used
   * by the renderer to place home-yard cells and home-stretch entry.
   */
  readonly homePositions: Readonly<Record<PlayerColor, PlayerHomePosition>>;
  /** Total number of cells across main path + all home paths. */
  readonly totalCellCount: number;
  /** Total number of cells across all home yards. */
  readonly homeYardCellCount: number;
}

/**
 * Placeholder constant. The real board data is generated in Phase 7
 * from the star geometry; until then a module that imports this
 * file compiles, and consumers cannot accidentally treat a
 * non-existent board as valid.
 */
export const boardConfig: BoardConfig = {
  model: {
    bounds: { width: 0, height: 0 },
    mainPath: [],
    paths: {} as Record<PlayerColor, BoardPath>,
    center: {} as BoardCell,
  },
  homePositions: {} as Record<PlayerColor, PlayerHomePosition>,
  totalCellCount: 0,
  homeYardCellCount: 0,
};
