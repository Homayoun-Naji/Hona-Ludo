/**
 * Broad lifecycle of a game.
 *
 * Room membership and seat assignment are independent from this state.
 */
export const GAME_STATUS = {
  WAITING: "waiting",
  IN_PROGRESS: "in-progress",
  FINISHED: "finished",
} as const;

export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS];
