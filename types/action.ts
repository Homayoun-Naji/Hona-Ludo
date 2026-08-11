/**
 * Game actions are the well-known verbs the engine can apply. Every
 * domain event (see `types/events.ts`) maps to exactly one of these
 * actions on the server side, and every action has a deterministic
 * effect on the game state.
 *
 * The strings are kept here as a literal union so typecheck and IDE
 * autocomplete can catch typos before runtime.
 */
export const GAME_ACTION = {
  ROLL_DICE: "roll-dice",
  SELECT_PIECE: "select-piece",
  MOVE_PIECE: "move-piece",
  UNDO_MOVE: "undo-move",
  END_TURN: "end-turn",
  TIMEOUT: "timeout",
  CAPTURE: "capture",
  EXIT_HOME: "exit-home",
  ENTER_HOME_PATH: "enter-home-path",
  FINISH_PIECE: "finish-piece",
  TRIPLE_SIX_PENALTY: "triple-six-penalty",
  ELIMINATE_PLAYER: "eliminate-player",
  FINISH_GAME: "finish-game",
  START_GAME: "start-game",
  REPLAY: "replay",
} as const;

export type GameAction = (typeof GAME_ACTION)[keyof typeof GAME_ACTION];

/**
 * Replay / room-lifecycle actions that the host triggers.
 * Kept separate from gameplay actions because they mutate the
 * room rather than the game state.
 */
export const ROOM_ACTION = {
  JOIN: "join",
  LEAVE: "leave",
  RECONNECT: "reconnect",
  SELECT_COLOR: "select-color",
  TOGGLE_READY: "toggle-ready",
  LOCK: "lock",
  KICK: "kick",
  REQUEST_REPLAY: "request-replay",
  CLOSE: "close",
} as const;

export type RoomAction = (typeof ROOM_ACTION)[keyof typeof ROOM_ACTION];
