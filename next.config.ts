import type { NextConfig } from "next";

/**
 * Next.js project configuration.
 *
 * This project is Persian / RTL (CLAUDE.md §7). RTL is handled by:
 *   - `dir="rtl"` on the root `<html>` element (app/layout.tsx)
 *   - CSS logical properties (Tailwind 4 handles this)
 *   - Shadcn's `rtl: true` flag in components.json
 *
 * No `experimental.rtl` flag is needed on Next 16.
 */
const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
