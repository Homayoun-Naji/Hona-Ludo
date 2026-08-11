/**
 * Domain error codes. These are the canonical identifiers that flow
 * through every layer; UI text / translations are derived from them,
 * never hardcoded in components.
 *
 * Each code maps to a single, well-defined failure mode. Generic
 * "engine error" / "unknown" should never be used — choose the closest
 * specific code so future telemetry and UX hooks can act on it.
 */
export const DOMAIN_ERROR_CODE = {
  // Move / turn validation
  INVALID_MOVE: "invalid-move",
  INVALID_TURN: "invalid-turn",
  PIECE_LOCKED: "piece-locked",
  NO_LEGAL_MOVE: "no-legal-move",
  CANNOT_UNDO: "cannot-undo",
  UNDO_NOT_AVAILABLE: "undo-not-available",

  // Dice
  DICE_NOT_ROLLED: "dice-not-rolled",
  DICE_ALREADY_ROLLED: "dice-already-rolled",
  DICE_NOT_SIX: "dice-not-six",

  // Room
  ROOM_NOT_FOUND: "room-not-found",
  ROOM_FULL: "room-full",
  ROOM_LOCKED: "room-locked",
  ROOM_CLOSED: "room-closed",
  NOT_ENOUGH_PLAYERS: "not-enough-players",

  // Player
  PLAYER_NOT_FOUND: "player-not-found",
  PLAYER_ELIMINATED: "player-eliminated",
  PLAYER_NOT_READY: "player-not-ready",
  DISPLAY_NAME_TAKEN: "display-name-taken",
  NOT_HOST: "not-host",
  COLOR_ALREADY_TAKEN: "color-already-taken",
  COLOR_NOT_AVAILABLE: "color-not-available",

  // Game state
  GAME_NOT_STARTED: "game-not-started",
  GAME_ALREADY_STARTED: "game-already-started",
  GAME_ALREADY_FINISHED: "game-already-finished",
  WRONG_TURN_PLAYER: "wrong-turn-player",

  // Time
  TIMEOUT: "timeout",
  TURN_EXPIRED: "turn-expired",

  // Replay
  REPLAY_UNAVAILABLE: "replay-unavailable",
  REPLAY_NOT_REQUESTED: "replay-not-requested",

  // Authorization / generic
  UNAUTHORIZED: "unauthorized",
  INVALID_PAYLOAD: "invalid-payload",
  RATE_LIMITED: "rate-limited",
} as const;

export type DomainErrorCode =
  (typeof DOMAIN_ERROR_CODE)[keyof typeof DOMAIN_ERROR_CODE];
