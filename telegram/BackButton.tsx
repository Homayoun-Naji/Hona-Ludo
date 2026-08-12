/**
 * TelegramBackButton — an adapter that wires the Telegram host's
 * BackButton to Next.js App Router navigation.
 *
 * Rules:
 *  - Renders nothing.
 *  - Shows the button only when `enabled` is true AND the host supports
 *    it AND the app is inside Telegram.
 *  - When the user has history within the Mini App, `back()` is
 *    called; otherwise the configured `fallbackHref` is pushed.
 *  - Cleans up its click handler on unmount or when `enabled` flips.
 *
 * The component does NOT replace the Next.js router — it just calls
 * `router.back()` / `router.push()`. This keeps normal browser
 * navigation working when the app is opened outside Telegram.
 */

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTelegram, useTelegramWebApp } from "./hooks";

export interface TelegramBackButtonProps {
  /** Whether the button should be visible. Defaults to `true`. */
  enabled?: boolean;
  /**
   * Route to navigate to when there is no history to pop (e.g. the
   * user entered the Mini App directly on this page). Defaults to
   * "/".
   */
  fallbackHref?: string;
}

export function TelegramBackButton({
  enabled = true,
  fallbackHref = "/",
}: TelegramBackButtonProps) {
  const ctx = useTelegram();
  const app = useTelegramWebApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!app || !ctx.capabilities.backButton || !enabled) {
      return;
    }
    const handle = () => {
      // `window.history.length > 1` is a reasonable heuristic for
      // "user navigated within the Mini App". When the Mini App
      // opened directly on a deep link, there is no prior history
      // and we fall back to the home route.
      const hasHistory =
        typeof window !== "undefined" && window.history.length > 1;
      if (hasHistory) {
        router.back();
      } else {
        router.push(fallbackHref);
      }
    };
    app.BackButton.onClick(handle);
    app.BackButton.show();
    return () => {
      app.BackButton.offClick(handle);
      app.BackButton.hide();
    };
  }, [app, ctx.capabilities.backButton, enabled, fallbackHref, router, pathname]);

  return null;
}
