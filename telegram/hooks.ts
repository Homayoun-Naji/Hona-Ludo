/**
 * Public Telegram hooks. Everything outside `telegram/` should import
 * from this file (or its barrel) rather than reaching into the
 * context or the WebApp script directly.
 *
 * The hooks are deliberately small and stable so that the rest of the
 * app never needs to know which Telegram SDK version is in use.
 */

"use client";

import {
  useTelegramContextInternal,
  useTelegramWebApp,
} from "./context";
import type {
  TelegramCapabilities,
  TelegramContextValue,
  TelegramPlatform,
  TelegramThemeParams,
  TelegramUser,
  TelegramViewport,
} from "./types";

/**
 * Returns the full Telegram context. Use when a component needs more
 * than one slice of information. Prefer the narrower hooks below when
 * you only need a single slice.
 */
export function useTelegram(): TelegramContextValue {
  return useTelegramContextInternal();
}

/** Whether the app is currently running inside a Telegram Mini App. */
export function useIsInsideTelegram(): boolean {
  return useTelegramContextInternal().isInsideTelegram;
}

/** The Telegram user, or `null` if not available. */
export function useTelegramUser(): TelegramUser | null {
  return useTelegramContextInternal().user;
}

/** The current viewport snapshot, or `null` outside Telegram. */
export function useTelegramViewport(): TelegramViewport | null {
  return useTelegramContextInternal().viewport;
}

/** The current Telegram theme, or `null` outside Telegram. */
export function useTelegramTheme(): TelegramThemeParams | null {
  return useTelegramContextInternal().theme;
}

/** Host platform identifier. */
export function useTelegramPlatform(): TelegramPlatform {
  return useTelegramContextInternal().platform;
}

/** Capability flags reported by the host. */
export function useTelegramCapabilities(): TelegramCapabilities {
  return useTelegramContextInternal().capabilities;
}

/** Re-export for the BackButton adapter only. Not for general use. */
export { useTelegramWebApp };
