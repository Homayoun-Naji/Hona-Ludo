/**
 * Development-only debug panel that surfaces the Telegram context
 * (status, platform, user, viewport, theme, capabilities). Renders
 * only when `process.env.NODE_ENV === "development"`. Outside Telegram
 * it still renders, but the values reflect the "unavailable" state
 * which is itself useful information while developing locally.
 *
 * Production builds tree-shake the body of the component via the
 * `if (process.env.NODE_ENV === "production") return null;` guard at
 * the top — no Telegram data ever reaches the production UI.
 */

"use client";

import { useTelegram } from "@/telegram";

export function TelegramDebugPanel() {
  const ctx = useTelegram();
  if (process.env.NODE_ENV === "production") return null;
  return (
    <div
      dir="ltr"
      data-testid="telegram-debug-panel"
      className="mt-4 rounded-md border border-dashed border-border bg-muted/40 p-2 text-left font-mono text-[10px] text-muted-foreground"
    >
      <div className="font-semibold uppercase tracking-wide text-foreground">
        Telegram Context (dev)
      </div>
      <div>status: {ctx.status}</div>
      <div>isInsideTelegram: {String(ctx.isInsideTelegram)}</div>
      <div>platform: {ctx.platform}</div>
      <div>capabilities: {JSON.stringify(ctx.capabilities)}</div>
      <div>
        user:{" "}
        {ctx.user
          ? `${ctx.user.first_name}${ctx.user.last_name ? " " + ctx.user.last_name : ""} (#${ctx.user.id})`
          : "—"}
      </div>
      <div>
        viewport:{" "}
        {ctx.viewport
          ? `${ctx.viewport.width}×${ctx.viewport.height} (stable ${ctx.viewport.stableHeight}, expanded ${ctx.viewport.isExpanded})`
          : "—"}
      </div>
      <div>colorScheme: {ctx.theme?.colorScheme ?? "—"}</div>
    </div>
  );
}
