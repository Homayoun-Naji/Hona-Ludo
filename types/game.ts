/**
 * Broad lifecycle of a game.
 *
 * Sits above the room lifecycle: a room can host at most one active game
 * at a time, and a finished game can transition back to "waiting" only
 * via an explicit Replay initiated by the host.
 *
 * Room membership and seat assignment are independent from this state.
 */
export const GAME_STATUS = {
  /** No game has started yet; the room is still forming. */
  WAITING: "waiting",
  /** Game is active; the engine is producing turns. */
  IN_PROGRESS: "in-progress",
  /** A winner has been decided; no further moves are accepted. */
  FINISHED: "finished",
} as const;

export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS];

/**
 * Room-level state, broader than the game state. A closed room can no
 * longer accept connections; an open room may either be waiting for
 * players or hosting an in-progress game.
 */
export const ROOM_STATUS = {
  /** Created or idle; new players may still join. */
  OPEN: "open",
  /** Locked: at least one game has started, no new joiners allowed. */
  LOCKED: "locked",
  /** Host has left or explicitly closed the room; terminal state. */
  CLOSED: "closed",
} as const;

export type RoomStatus = (typeof ROOM_STATUS)[keyof typeof ROOM_STATUS];

/**
 * Per-player lifecycle within a room.
 *
 * JOINING is transient (player is in the join handshake).
 * ELIMINATED is a sticky state set by the engine (triple timeout or
 * manual elimination rule); eliminated players can no longer act.
 */
export const PLAYER_STATUS = {
  /** Has connected but not yet provided a display name / color. */
  JOINING: "joining",
  /** Seated in the room, ready state independent of game state. */
  SEATED: "seated",
  /** Connection lost but the Mini App is still expected to return. */
  DISCONNECTED: "disconnected",
  /** Removed from the room by game rules (e.g. triple timeout). */
  ELIMINATED: "eliminated",
  /** Player voluntarily left or was the last one to disconnect. */
  LEFT: "left",
} as const;

export type PlayerStatus = (typeof PLAYER_STATUS)[keyof typeof PLAYER_STATUS];

/**
 * Connection status mirrors socket liveness; lives in the room state so
 * the UI can show who is reachable without re-deriving from sockets.
 */
export const CONNECTION_STATUS = {
  /** Never connected or no socket activity yet. */
  OFFLINE: "offline",
  /** Socket handshake succeeded; player is reachable. */
  ONLINE: "online",
  /** Brief network interruption; client is expected to reconnect. */
  RECONNECTING: "reconnecting",
  /** Permanently unreachable (Mini App closed). */
  GONE: "gone",
} as const;

export type ConnectionStatus =
  (typeof CONNECTION_STATUS)[keyof typeof CONNECTION_STATUS];
