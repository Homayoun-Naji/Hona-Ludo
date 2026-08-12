/**
 * Client-side shell that mounts the TelegramProvider and a global
 * TelegramBackButton so the back button is available on every route.
 *
 * Rendered once from `app/layout.tsx`. The `TelegramBackButton` uses
 * an opt-in `enabled` prop defaulting to `true`, which keeps it active
 * on inner routes (e.g. `/room`, `/game`) and hidden on the home
 * route, where the system already has nothing to go back to.
 *
 * The component also publishes the current Telegram viewport height
 * as a `--tg-viewport-height` CSS custom property on `<html>`. The
 * application layout uses this variable instead of `100vh` so the UI
 * can adapt to Telegram's dynamic chrome without manual resizing.
 */

"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  TelegramProvider,
  TelegramBackButton,
  useTelegramViewport,
} from "@/telegram";

interface TelegramShellProps {
  children: React.ReactNode;
}

function ViewportPublisher() {
  const viewport = useTelegramViewport();
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!viewport) return;
    const root = document.documentElement;
    root.style.setProperty("--tg-viewport-height", `${viewport.height}px`);
    root.style.setProperty(
      "--tg-viewport-stable-height",
      `${viewport.stableHeight}px`,
    );
  }, [viewport]);
  return null;
}

function RouteAwareBackButton() {
  const pathname = usePathname();
  // Hide the back button on the home route — there is nothing to
  // navigate back to from `/`.
  const enabled = pathname !== "/";
  return <TelegramBackButton enabled={enabled} />;
}

export function TelegramShell({ children }: TelegramShellProps) {
  return (
    <TelegramProvider>
      <ViewportPublisher />
      <RouteAwareBackButton />
      {children}
    </TelegramProvider>
  );
}
