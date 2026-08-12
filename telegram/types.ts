/**
 * Telegram Mini App — public type surface.
 *
 * These types describe the small subset of the Telegram WebApp API that
 * Hona Ludo actually uses. They mirror the official Telegram typings
 * (https://core.telegram.org/bots/webapps#initializing-mini-apps) so
 * values returned by the platform can be assigned to them directly.
 *
 * The full SDK type surface is intentionally NOT re-exported here. Any
 * field that the game does not currently consume stays behind the
 * integration boundary.
 */

/** Lifecycle state of the Telegram WebApp environment. */
export type TelegramStatus = "unknown" | "available" | "unavailable";

/** Color scheme reported by the Telegram host. */
export type TelegramColorScheme = "light" | "dark";

/** Telegram user information exposed through the Mini App context. */
export interface TelegramUser {
  /** Telegram user id (numeric, as a string to preserve precision). */
  readonly id: string;
  /** Whether this is a bot user (typically false for Mini App users). */
  readonly is_bot?: boolean;
  /** User's first name. */
  readonly first_name: string;
  /** User's last name, if provided. */
  readonly last_name?: string;
  /** Telegram username, if set. */
  readonly username?: string;
  /** IETF language tag of the user's client language. */
  readonly language_code?: string;
  /** Whether the user allows Telegram to write premium-required requests. */
  readonly is_premium?: boolean;
  /** URL of the user's profile photo, if available. */
  readonly photo_url?: string;
}

/** Viewport snapshot reported by the Telegram host. */
export interface TelegramViewport {
  /** Current viewport height in pixels (excludes Telegram chrome). */
  readonly height: number;
  /** Current viewport width in pixels. */
  readonly width: number;
  /** Stable viewport height (does not change with keyboard / expansion). */
  readonly stableHeight: number;
  /** Whether the viewport is currently expanded. */
  readonly isExpanded: boolean;
}

/** Theme parameters exposed by the Telegram host. */
export interface TelegramThemeParams {
  readonly colorScheme: TelegramColorScheme;
  readonly bgColor?: string;
  readonly textColor?: string;
  readonly hintColor?: string;
  readonly linkColor?: string;
  readonly buttonColor?: string;
  readonly buttonTextColor?: string;
  readonly secondaryBgColor?: string;
  readonly headerBgColor?: string;
  readonly accentTextColor?: string;
  readonly sectionBgColor?: string;
  readonly sectionHeaderTextColor?: string;
  readonly subtitleTextColor?: string;
  readonly destructiveTextColor?: string;
}

/** Platform identifier reported by the Telegram host. */
export type TelegramPlatform =
  | "ios"
  | "android"
  | "macos"
  | "windows"
  | "linux"
  | "web"
  | "unknown";

/** Capability flags reported by the Telegram host. */
export interface TelegramCapabilities {
  /** Whether the BackButton is supported by the current host. */
  readonly backButton: boolean;
  /** Whether viewport change events are supported. */
  readonly viewport: boolean;
  /** Whether theme change events are supported. */
  readonly theme: boolean;
}

/** Shape of the Telegram context exposed to the application. */
export interface TelegramContextValue {
  /** Lifecycle state — `unknown` until detection completes. */
  readonly status: TelegramStatus;
  /** Telegram user, when the host exposes one. */
  readonly user: TelegramUser | null;
  /** Current viewport snapshot. */
  readonly viewport: TelegramViewport | null;
  /** Current theme snapshot. */
  readonly theme: TelegramThemeParams | null;
  /** Detected host platform. */
  readonly platform: TelegramPlatform;
  /** Capability flags. */
  readonly capabilities: TelegramCapabilities;
  /** True when running inside a Telegram Mini App. */
  readonly isInsideTelegram: boolean;
  /** Raw initData string from the host. Handle with care — not yet validated. */
  readonly initData: string | null;
}
