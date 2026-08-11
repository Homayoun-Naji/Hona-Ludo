import type { PlayerColor } from "@/constants/colors";

/**
 * Aggregate game rule configuration.
 *
 * The numeric rule values themselves live in `@/constants/game`; this
 * module is the home for feature-level toggles and aggregate flags
 * that are not single scalars.
 */

export interface GameConfig {
  /**
   * Whether the Undo mechanic is enabled at all for this room.
   * Kept as a feature flag so the engine can be tested with Undo
   * disabled without deleting the rule constants.
   */
  readonly undoEnabled: boolean;
  /**
   * Whether the triple-six penalty is active. Kept as a flag so
   * future rule variants can disable the penalty while keeping
   * the rest of the dice logic intact.
   */
  readonly tripleSixPenaltyEnabled: boolean;
  /**
   * Whether the turn timer is active. If false, turns never
   * auto-end and timeout elimination cannot occur.
   */
  readonly timerEnabled: boolean;
  /**
   * Whether a player leaving mid-game triggers immediate
   * elimination. If false, a disconnected player's timer pauses
   * until they reconnect.
   */
  readonly leaveOnDisconnectEnabled: boolean;
  /**
   * Ordered list of colors available for selection in this game.
   * Defaults to the full palette but may be restricted by the
   * room host.
   */
  readonly colorPool: ReadonlyArray<PlayerColor>;
  /** Maximum number of players allowed in a single game instance. */
  readonly maxPlayers: number;
}

/**
 * Default configuration. The engine uses this as the baseline for every
 * new room; the room host may override individual fields at creation.
 */
export const gameConfig: GameConfig = {
  undoEnabled: true,
  tripleSixPenaltyEnabled: true,
  timerEnabled: true,
  leaveOnDisconnectEnabled: false,
  colorPool: ["red", "blue", "green", "yellow", "purple"],
  maxPlayers: 5,
};
