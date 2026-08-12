/**
 * Public Telegram integration surface. Import from `@/telegram`.
 *
 * Anything in this barrel is the supported API. Internal modules
 * (e.g. `./script`, `./snapshot`) are deliberately not re-exported.
 */

export { TelegramProvider } from "./context";
export {
  useTelegram,
  useIsInsideTelegram,
  useTelegramUser,
  useTelegramViewport,
  useTelegramTheme,
  useTelegramPlatform,
  useTelegramCapabilities,
} from "./hooks";
export { TelegramBackButton } from "./BackButton";
export type {
  TelegramCapabilities,
  TelegramColorScheme,
  TelegramContextValue,
  TelegramPlatform,
  TelegramStatus,
  TelegramThemeParams,
  TelegramUser,
  TelegramViewport,
} from "./types";
