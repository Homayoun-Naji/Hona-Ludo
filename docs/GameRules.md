# Game Rules

Purpose: Canonical, unambiguous statement of the 5-player Ludo rule set.

The scalar rule values are defined in `constants/game.ts` and aggregated in `config/rules.config.ts` (`RulesConfig`). The `RULE_DEPENDENCY` map documents which rules apply to which engine actions.

## Rule → Constant map

| Rule | Source |
|------|--------|
| 5-player max, 2-player min | `constants/game.ts` (`MAX_PLAYERS`, `MIN_PLAYERS`) |
| 2-minute turn timer | `TURN_DURATION_MS` (room override: `RoomSettings.turnDurationMs`) |
| 3 consecutive sixes → penalty | `TRIPLE_SIX_THRESHOLD` / `RulesConfig.tripleSixThreshold` |
| 3 timeouts → elimination | `TIMEOUT_ELIMINATION_THRESHOLD` / `RulesConfig.timeoutEliminationThreshold` |
| 1 undo step, before turn ends | `MAX_UNDO_STEPS` / `RulesConfig.maxUndoSteps` |
| Exact landing on final home cell | `RulesConfig.exactFinishRequired` |
| Captured piece returns to home yard | `RulesConfig.captureReturnsToHomeYard` |
| No safe blocks, no stacking | Enforced by `engine/rules` (Phase 6) reading `CellKind` / `PieceStatus` from `types/piece.ts` |
| Home exit only on a six | `RulesConfig.extraTurnValue === 6` (Phase 6 validation) |
