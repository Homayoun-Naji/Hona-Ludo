/**
 * Hona Ludo — Design System Layout Constants
 *
 * Centralized numeric values used across the UI for spacing,
 * radius, motion, and touch targets. The Tailwind theme maps the
 * most important ones to CSS custom properties in `globals.css`.
 *
 * Anything referenced here must NOT be duplicated as a magic
 * number in a component file.
 */

/** Min physical touch target (iOS / WCAG). */
export const TOUCH_TARGET_MIN = 44;

/** Default comfortable touch target. */
export const TOUCH_TARGET_COMFORTABLE = 48;

/** Larger touch target used in game controls. */
export const TOUCH_TARGET_GAME = 56;

/** Standard fast transition. */
export const TRANSITION_FAST = "150ms";
export const TRANSITION_NORMAL = "200ms";
export const TRANSITION_SLOW = "300ms";

/** Board aspect ratio placeholder until the SVG renderer ships. */
export const BOARD_ASPECT_RATIO = 1;
