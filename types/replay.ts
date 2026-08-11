import type { PlayerId } from "./player";
import type { GameState } from "./game-state";
import type { ReplayStatus } from "./turn";

/**
 * A Replay replays a previously completed or in-progress game.
 *
 * Replay is host-initiated (CLAUDE.md §8). The host's request
 * carries the seed state that clients and the engine reset to,
 * so the same room + players can be re-run deterministically.
 */
export interface ReplayState {
  /** Current replay lifecycle status. */
  status: ReplayStatus;
  /**
   * The seed state that the replay starts from. Produced when
   * Replay was initiated (it is the game state at game-end, or
   * at an earlier snapshot chosen by the host).
   */
  seedState: GameState | null;
  /**
   * The player who requested (is responsible for) this replay.
   * Null if the request was cancelled before completion.
   */
  requestedBy: PlayerId | null;
  /**
   * Whether the seed state represents a finished or mid-game point.
   * When true, the replay can show a "Play Again" button.
   */
  fromGameEnd: boolean;
  /** Server timestamp at which the replay was initiated. */
  initiatedAt: number | null;
}
