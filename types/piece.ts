import type { PlayerColor } from "@/constants/colors";

/**
 * Unique identifier for a single piece on the board.
 *
 * A piece is fully described by the player that owns it plus its
 * index inside that player's set of four pieces.
 */
export interface PieceId {
  color: PlayerColor;
  index: 0 | 1 | 2 | 3;
}
