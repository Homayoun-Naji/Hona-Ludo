/**
 * Telegram context — the single boundary through which the rest of the
 * application reads Telegram information. Game components, domain
 * types, and UI primitives MUST NOT import anything from this directory
 * directly; they go through the hooks exported from `./hooks.ts`.
 *
 * The provider is mounted once near the root of the app tree (in
 * `app/layout.tsx`). It performs the following lifecycle on mount:
 *
 *   1. Load the Telegram WebApp script (no-op outside Telegram).
 *   2. Detect whether a `Telegram.WebApp` instance was actually
 *      provided by the host.
 *   3. Resolve the user, viewport, theme, and capability snapshot.
 *   4. Subscribe to viewport / theme change events so consumers
 *      re-render on Telegram UI chrome changes.
 *   5. Unsubscribe on unmount.
 *
 * The status starts as `"unknown"` so the first render never reports
 * "unavailable" before detection completes. This prevents a flash of
 * the wrong theme / chrome during Mini App startup.
 */

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { buildContext } from "./snapshot";
import { loadTelegramScript, type TelegramWebApp } from "./script";
import type { TelegramContextValue } from "./types";

const TelegramContext = createContext<TelegramContextValue | null>(null);

/** Single shared slot for the live WebApp instance. */
let liveWebApp: TelegramWebApp | null = null;

interface ProviderProps {
  children: ReactNode;
}

export function TelegramProvider({ children }: ProviderProps) {
  const [context, setContext] = useState<TelegramContextValue>(() =>
    buildContext(
      // The stub values are never read — `app` is overwritten before
      // the first effect-driven `setContext` call. Building the
      // initial state with a stub keeps the type checker happy while
      // avoiding any platform reads during SSR.
      {} as TelegramWebApp,
      "unavailable",
    ),
  );
  const statusRef = useRef(context.status);

  // Phase 1: load the script and detect the host.
  useEffect(() => {
    let cancelled = false;
    loadTelegramScript().then((app) => {
      if (cancelled) return;
      if (!app) {
        setContext(buildContext({} as TelegramWebApp, "unavailable"));
        return;
      }
      liveWebApp = app;
      statusRef.current = "available";
      setContext(buildContext(app, "available"));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Phase 2: subscribe to viewport / theme change events. Only attach
  // once the WebApp is available; tear down when the provider
  // unmounts.
  useEffect(() => {
    if (context.status !== "available") return;
    const app = liveWebApp;
    if (!app) return;

    const onChange = () => {
      if (!liveWebApp) return;
      setContext(buildContext(liveWebApp, "available"));
    };
    app.onEvent("viewportChanged", onChange);
    app.onEvent("themeChanged", onChange);
    return () => {
      app.offEvent("viewportChanged", onChange);
      app.offEvent("themeChanged", onChange);
    };
  }, [context.status]);

  const value = useMemo(() => context, [context]);

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegramContextInternal(): TelegramContextValue {
  const ctx = useContext(TelegramContext);
  if (!ctx) {
    // Defensive: should never happen because the provider is mounted
    // at the app root. If it does, the safest fallback is the
    // "unavailable" sentinel so consumers can still render.
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
  return ctx;
}

/**
 * Returns the live Telegram WebApp instance, or `null` if not inside
 * Telegram. Only used by adapters (e.g. the BackButton) that need to
 * register imperative handlers. Most components should use
 * `useTelegram` instead.
 */
export function useTelegramWebApp(): TelegramWebApp | null {
  const ctx = useTelegramContextInternal();
  return ctx.status === "available" ? liveWebApp : null;
}
