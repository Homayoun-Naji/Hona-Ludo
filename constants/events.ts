/**
 * Canonical socket event names exchanged between client and server.
 *
 * Both sides import from this single file to guarantee identical strings.
 * Sourced directly from CLAUDE.md §11 (Real-time / Socket Principles).
 */

export const SOCKET_EVENTS = {
  PLAYER_JOIN: "player:join",
  PLAYER_LEAVE: "player:leave",
  PLAYER_READY: "player:ready",
  PLAYER_COLOR_SELECT: "player:color-select",
  ROOM_LOCKED: "room:locked",
  GAME_START: "game:start",
  ROLL_DICE: "dice:roll",
  PIECE_SELECT: "piece:select",
  PIECE_MOVE: "piece:move",
  UNDO_MOVE: "undo:move",
  END_TURN: "turn:end",
  TURN_TIMEOUT: "turn:timeout",
  PLAYER_ELIMINATED: "player:eliminated",
  GAME_FINISHED: "game:finished",
  REPLAY_REQUEST: "replay:request",
  REPLAY_STARTED: "replay:started",
  PLAYER_RECONNECT: "player:reconnect",
} as const;

export type SocketEventName = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
