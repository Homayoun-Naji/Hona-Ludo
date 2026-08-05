/**
 * Board geometry and path configuration.
 *
 * TODO — defined in a later phase. This file reserves the module so that
 * the data-driven SVG board (CLAUDE.md §9) can be assembled here without
 * reshaping the import graph. No board data is added yet on purpose.
 */

export type BoardConfig = {
  /** Reserved for tile coordinates, paths and home stretches. */
  readonly placeholder: true;
};

export const boardConfig: BoardConfig = {
  placeholder: true,
};
