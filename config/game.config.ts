/**
 * High-level game rule configuration.
 *
 * The numeric rule values themselves live in `@/constants/game`; this module
 * is the future home for aggregate toggles (e.g. whether undo is enabled,
 * triple-six behaviour flags) without duplicating the rule constants.
 */
export type GameConfig = {
  /** Reserved for feature-level toggles. */
  readonly placeholder: true;
};
