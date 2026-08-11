# Board Specification

Purpose: Defines the SVG-based 5-player star-shaped board geometry, tile coordinates, per-color paths, and home stretches.

The board's data model is specified in `types/board.ts` (`BoardCell`, `BoardPath`, `BoardModel`) and configured in `config/board.config.ts` (`BoardConfig`).

Until Phase 7 (Board Rendering & Piece Movement), `boardConfig` remains a typed placeholder. The model surface is complete and no structural changes are expected — only real coordinate values need to be filled in.
