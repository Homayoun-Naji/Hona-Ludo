import type { PlayerColor } from "@/constants/colors";

/**
 * Hona Ludo — Player Color Configuration
 *
 * Single source of truth for everything visual related to the five
 * player colors. Consumed by player indicators, color pickers,
 * turn highlights, piece rendering, and the future SVG board.
 *
 * Colors are presented as Tailwind utility references (e.g.
 * `bg-player-red`) so that consumers can compose with opacity
 * (`bg-player-red/20`) and other utilities. Hex values are kept
 * here only for non-Tailwind contexts (e.g. inline SVG `fill`).
 *
 * Every color carries a "ring" variant for focus/active states and
 * a "soft" variant for subtle surfaces.
 */

export interface PlayerColorStyle {
  /** Tailwind background utility for solid fill. */
  readonly bg: string;
  /** Tailwind text utility for content on top of the solid fill. */
  readonly fg: string;
  /** Tailwind border utility for outlines. */
  readonly border: string;
  /** Tailwind background utility for soft (low-opacity) surfaces. */
  readonly soft: string;
  /** Tailwind ring utility for focus/active states. */
  readonly ring: string;
  /** Hex value for contexts where Tailwind utilities don't apply (SVG). */
  readonly hex: string;
  /** Human-readable Persian name. */
  readonly label: string;
}

export const PLAYER_COLOR_STYLES: Readonly<Record<PlayerColor, PlayerColorStyle>> =
  {
    red: {
      bg: "bg-player-red",
      fg: "text-player-red-foreground",
      border: "border-player-red",
      soft: "bg-player-red/15",
      ring: "ring-player-red/50",
      hex: "#E11D2C",
      label: "قرمز",
    },
    blue: {
      bg: "bg-player-blue",
      fg: "text-player-blue-foreground",
      border: "border-player-blue",
      soft: "bg-player-blue/15",
      ring: "ring-player-blue/50",
      hex: "#1E6CE8",
      label: "آبی",
    },
    green: {
      bg: "bg-player-green",
      fg: "text-player-green-foreground",
      border: "border-player-green",
      soft: "bg-player-green/15",
      ring: "ring-player-green/50",
      hex: "#16A34A",
      label: "سبز",
    },
    yellow: {
      bg: "bg-player-yellow",
      fg: "text-player-yellow-foreground",
      border: "border-player-yellow",
      soft: "bg-player-yellow/20",
      ring: "ring-player-yellow/50",
      hex: "#F5B700",
      label: "زرد",
    },
    purple: {
      bg: "bg-player-purple",
      fg: "text-player-purple-foreground",
      border: "border-player-purple",
      soft: "bg-player-purple/15",
      ring: "ring-player-purple/50",
      hex: "#8B3DD9",
      label: "بنفش",
    },
  };

/**
 * Returns the style for a given color. Falls back to red for the
 * rare `null` case (e.g. before a player has chosen a color) so
 * the UI never collapses to a blank dot.
 */
export function getPlayerColorStyle(color: PlayerColor | null): PlayerColorStyle {
  if (!color) return PLAYER_COLOR_STYLES.red;
  return PLAYER_COLOR_STYLES[color];
}
