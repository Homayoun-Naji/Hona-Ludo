import type { PlayerId } from "./player";
import type { PlayerColor } from "@/constants/colors";

/**
 * A single ranked finisher in a completed game.
 *
 * Games of 5-player Ludo rank 1st through 5th. A player who is
 * eliminated (triple timeout) ranks after all non-eliminated
 * finishers. `rank === 0` is reserved for players who neither
 * finished nor were eliminated (still in progress when the game
 * ended via Replay or similar reset) — the engine should never
 * produce such a record for a finished game, but it is kept
 * nullable so a partial leaderboard never loses data.
 */
export interface Placement {
  /** 1-based finishing position (1 = winner). */
  readonly rank: number;
  /** Player who placed at this rank. */
  readonly playerId: PlayerId;
  /** Color the player was using at the moment of placement. */
  readonly color: PlayerColor;
}

/**
 * Full leaderboard snapshot for a finished game.
 *
 * `winner` is the 1st-place player (index 0 of `placements`),
 * provided separately for convenience when the game only needs
 * to announce the single victor.
 */
export interface Winner {
  /** First-place finisher. */
  readonly winner: Placement;
  /** All placements, in rank order. */
  readonly placements: ReadonlyArray<Placement>;
}
