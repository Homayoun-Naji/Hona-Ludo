/**
 * Maps the raw `window.Telegram.WebApp` object onto the project's
 * internal `TelegramContextValue` shape. Mappers live here so the rest
 * of the app never touches the SDK's runtime types directly.
 */

import type {
  TelegramCapabilities,
  TelegramContextValue,
  TelegramPlatform,
  TelegramThemeParams,
  TelegramUser,
  TelegramViewport,
} from "./types";
import type { TelegramWebApp } from "./script";

const KNOWN_PLATFORMS: ReadonlyArray<TelegramPlatform> = [
  "ios",
  "android",
  "macos",
  "windows",
  "linux",
  "web",
];

function mapPlatform(raw: string | undefined): TelegramPlatform {
  if (!raw) return "unknown";
  return (KNOWN_PLATFORMS as ReadonlyArray<string>).includes(raw)
    ? (raw as TelegramPlatform)
    : "unknown";
}

function mapUser(raw: unknown): TelegramUser | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "number" && typeof r.id !== "string") return null;
  if (typeof r.first_name !== "string") return null;
  return {
    id: String(r.id),
    is_bot: typeof r.is_bot === "boolean" ? r.is_bot : undefined,
    first_name: r.first_name,
    last_name: typeof r.last_name === "string" ? r.last_name : undefined,
    username: typeof r.username === "string" ? r.username : undefined,
    language_code:
      typeof r.language_code === "string" ? r.language_code : undefined,
    is_premium: typeof r.is_premium === "boolean" ? r.is_premium : undefined,
    photo_url: typeof r.photo_url === "string" ? r.photo_url : undefined,
  };
}

function mapViewport(app: TelegramWebApp): TelegramViewport {
  return {
    height: app.viewportHeight,
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    stableHeight: app.viewportStableHeight,
    isExpanded: app.isExpanded,
  };
}

function mapTheme(app: TelegramWebApp): TelegramThemeParams {
  const t = app.themeParams ?? {};
  return {
    colorScheme: app.colorScheme === "dark" ? "dark" : "light",
    bgColor: t.bg_color,
    textColor: t.text_color,
    hintColor: t.hint_color,
    linkColor: t.link_color,
    buttonColor: t.button_color,
    buttonTextColor: t.button_text_color,
    secondaryBgColor: t.secondary_bg_color,
    headerBgColor: t.header_bg_color,
    accentTextColor: t.accent_text_color,
    sectionBgColor: t.section_bg_color,
    sectionHeaderTextColor: t.section_header_text_color,
    subtitleTextColor: t.subtitle_text_color,
    destructiveTextColor: t.destructive_text_color,
  };
}

function mapCapabilities(app: TelegramWebApp): TelegramCapabilities {
  const ver = app.version ?? "0.0";
  const [major = 0, minor = 0] = ver.split(".").map(Number);
  // BackButton requires >= 6.1; theme events >= 6.5; viewport events >= 6.0.
  return {
    backButton: major > 6 || (major === 6 && minor >= 1),
    viewport: major > 6 || (major === 6 && minor >= 0),
    theme: major > 6 || (major === 6 && minor >= 5),
  };
}

export function buildContext(
  app: TelegramWebApp,
  status: "available" | "unavailable",
): TelegramContextValue {
  if (status === "unavailable") {
    return {
      status: "unavailable",
      user: null,
      viewport: null,
      theme: null,
      platform: "unknown",
      capabilities: { backButton: false, viewport: false, theme: false },
      isInsideTelegram: false,
      initData: null,
    };
  }
  return {
    status: "available",
    user: mapUser(app.initDataUnsafe?.user),
    viewport: mapViewport(app),
    theme: mapTheme(app),
    platform: mapPlatform(app.platform),
    capabilities: mapCapabilities(app),
    isInsideTelegram: true,
    initData: app.initData ?? "",
  };
}
