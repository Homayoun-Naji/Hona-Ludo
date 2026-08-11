# Domain Model Reference

> Phase 2 deliverable. Describes the complete type system, state machines,
> event model, and configuration contracts that all future phases are
> built on top of. Framework-independent: the domain layer depends on
> React, Telegram, and Socket.IO only behind interfaces (see §7).

---

## 1. Overview

The domain is split into three conceptual tiers:

| Tier | Files | Responsibility |
|------|-------|----------------|
| **Identity** (`types/player.ts`, `types/ids.ts`) | Who players / rooms are | Stable, server-assigned identifiers and immutable identity records. |
| **Configuration** (`config/*.ts`, `constants/*.ts`) | The rules of the game | Scalar rule constants, feature flags, board geometry description. |
| **Runtime** (`types/room.ts`, `types/game-state.ts`, `types/turn-state.ts`, `types/move.ts`, `types/snapshot.ts`, `types/replay.ts`, `types/timer.ts`, `types/winner.ts`) | What the game / room currently is | Mutable, event-sourced state snapshots. |

The engine never reaches into the client store; the store never reaches
into the engine. A single **state-sync event** (`StateSyncedEvent`) is the
only boundary crossing, keeping the layers honest.

## 2. Design Principles Applied

1. **Server authority** — every field that matters to gameplay lives
   on the server snapshot. Client intents are validated before they
   mutate state.
2. **Event sourcing / determinism** — `GameState.history` is an ordered
   log of `CommittedMove`s. Any future snapshot is reproducible by
   replaying from a seed. This is what makes Replay and Undo trivial
   to reason about.
3. **Flat snapshots** — full-state replacement (not diffs) on the wire.
   Clients swap their entire game view on every `StateSyncedEvent`.
   This is intentionally O(n) but eliminates an entire class of
   merge-conflict bugs.
4. **Composition over inheritance** — `PieceState` *has* a `PieceId`,
   `Turn` *has* a `DiceRoll`, `CommittedMove` *has* a `MoveIntent`.
   No polymorphic hierarchy exists; each type is a leaf in the
   dependency graph.
5. **Closed sets, not open strings** — every field that represents a
   state, color, or kind is a const-enum-backed literal union. There
   is exactly one canonical source per concept; nothing is duplicated.

## 3. Core Domain Types (by file)

### `types/ids.ts`
| Type | Shape | Why |
|------|-------|-----|
| `RoomId` | `string & { __brand: "RoomId" }` | Branded nominal so a `PlayerId` cannot be passed where a `RoomId` is expected. |
| `InviteCode` | `string & { __brand: "InviteCode" }` | Separated from `RoomId` so internal ids can rotate without invalidating invite links. |

### `types/player.ts`
| Type | Shape | Why |
|------|-------|-----|
| `PlayerId` | `string & { __brand: "PlayerId" }` | Nominal brand prevents mixing with room ids. |
| `Player` | `{ id, displayName, color }` | Immutable identity. Color may change during the lobby phase. `isHost` removed — host identity lives on `RoomState.hostId` (single source of truth). |
| `PlayerRuntime` | `{ id, ready, status, connection, timeoutCount, turnOrder, finishedPieceCount }` | Mutable per-player engine state. `playingColor` removed — color is read from `Player.color` to avoid duplication. |

**Design decision:** identity and runtime state are split. A `Replay`
resets `PlayerRuntime` fields but keeps `Player` intact, so the
seat list and colors all persist across a replay without a single
identity rewrite.

**Design decision:** `isHost` moved out of `Player` into
`RoomState.hostId`. This makes host identity a room-level fact (the
single player who owns the room) rather than an attribute duplicated
on every join. Re-deriving `isHost` for a given player is
`player.id === room.hostId`.

### `types/piece.ts`
| Type | Shape | Why |
|------|-------|-----|
| `PieceId` | `{ color, index: 0\|1\|2\|3 }` | Two-field composite. No global counter needed. |
| `PieceIdValue` | branded string | For map keys. |
| `PieceState` | `{ id, status, stepsTaken }` | `stepsTaken` is the canonical position measure used by finish/capture logic. |
| `PieceStatus` enum | `home \| on-board \| on-home-path \| finished` | Closed set mirrors the four physical regions of a Ludo board. `finished` is terminal. |
| `CellKind` enum | `normal \| entry-to-home \| center` | Only `entry-to-home` is mechanically meaningful; star markers are decorative NORMAL cells per the no-safe-blocks rule. |
| `BoardRegion` enum | `main-path \| home-yard \| home-path \| center` | Groups cells for the renderer without geometry re-derivation. |

### `types/ids.ts`
(Already documented in §3 above.)

### `types/game.ts`
| Type | Values | Why |
|------|--------|-----|
| `GameStatus` | `waiting \| in-progress \| finished` | Broad game lifecycle. Distinct from room status. |
| `RoomStatus` | `open \| locked \| closed` | Room lifecycle; `locked` fires the moment a game starts. |
| `PlayerStatus` | `joining \| seated \| disconnected \| eliminated \| left` | Per-player room membership. `eliminated` is sticky. |
| `ConnectionStatus` | `offline \| online \| reconnecting \| gone` | Network reachability; shown in the waiting-room UI. |

### `types/turn.ts`
| Type | Values | Why |
|------|--------|-----|
| `TurnStatus` | `idle \| rolling \| selecting-piece \| moving \| waiting-end-turn \| turn-ended \| skipped` | Micro-states let the engine refuse out-of-order intents (e.g. end-turn before rolling). |
| `ReplayStatus` | `idle \| requested \| resetting \| completed \| unavailable` | Replay lifecycle is decoupled from `GameStatus` so a finished game can be reset without losing seats. |

### `types/dice.ts`
| Type | Fields | Why |
|------|--------|-----|
| `DiceRoll` | `{ value, isSix, triggersTripleSixPenalty, consecutiveSixes, rolledBy, rolledAt }` | Carries all context for triple-six and extra-turn rules in one object. |

### `types/turn-state.ts`
| Type | Fields | Why |
|------|--------|-----|
| `Turn` | `{ index, currentPlayerId, status, dice, committedMoves, startedAt, endedAt }` | `committedMoves` is the per-turn log; Undo pops from it. `endedAt` is nullable until the turn closes. |

### `types/timer.ts`
| Type | Fields | Why |
|------|--------|-----|
| `Timer` | `{ durationMs, expiresAt, expired, forPlayerId, startedAt }` | `durationMs` is captured at turn start so future setting changes only affect later turns. |

### `types/move.ts`
| Type | Fields | Why |
|------|--------|-----|
| `MoveKind` | union of 6 literals | Discriminates how the engine/renderer interpret the move. |
| `MoveIntent` | `{ playerId, color, pieceId, dice, kind, issuedAt }` | The client-authorable request; validated by the engine. |
| `CommittedMove` | `{ index, action, intent, pieceStatusBefore, pieceStatusAfter, beforeCell, afterCell, capturedPiece, appliedAt }` | Full provenance: the renderer can animate, replay can reconstruct, undo can revert. |
| `MoveResult` | discriminated union `(ok:true, move) \| (ok:false, code, reason?)` | Forces every consumer to handle both success and failure. |

### `types/game-state.ts`
| Field | Purpose |
|-------|---------|
| `snapshotId` | Monotonic id; lets clients detect missed snapshots. |
| `roomVersion` | Mirrors `RoomState.version`; lets a snapshot detect room-level staleness. |
| `status` | Current `GameStatus`. |
| `playerColors` / `colorOwners` | Bidirectional color↔player maps; stored both ways to avoid lookups during rule evaluation. |
| `pieces` | Map of all pieces keyed by composite id; canonical piece store. |
| `currentTurn` | The live `Turn`, or null if the game has not started. |
| `currentTimer` | The live `Timer`, or null. |
| `history` | Ordered `CommittedMove[]`; the authoritative replay log. |
| `lastDice` | The most recent roll; kept for UI animation. |
| `generatedAt` | Server timestamp of this snapshot. |

### `types/snapshot.ts`
| Field | Purpose |
|-------|---------|
| `kind` | `"turn-boundary" \| "undo-restore"`. `replay-seed` removed — the Replay lifecycle carries its own `seedState` on `ReplayState`. |
| `payload` | Full `GameState` captured at this moment. |

### `types/winner.ts`
| Type | Fields | Why |
|------|--------|-----|
| `Placement` | `{ rank, playerId, color }` | 1-based rank. |
| `Winner` | `{ winner, placements[] }` | `winner` is a convenience alias for `placements[0]`. |

### `types/replay.ts`
| Field | Purpose |
|-------|---------|
| `status` | `ReplayStatus`. |
| `seedState` | The game state the replay resets to. |
| `requestedBy` | Host who initiated. |
| `fromGameEnd` | Whether the seed is the end-of-game state. |

### `types/events.ts`
(See §4 below.)

### `types/action.ts`
| Type | Values |
|------|--------|
| `GameAction` | 15 literals (`roll-dice`, `move-piece`, …). |
| `RoomAction` | 9 literals (`join`, `leave`, `reconnect`, …). |

**`DomainAction` was removed** — the engine consumes `GameAction` and
the application layer consumes `RoomAction`; a combined union added no value.

**Design decision:** action strings are *values* of a const object, not
free-form strings. The application layer maps each incoming socket event
to an action, then to a domain event — a single source of truth.

### `types/error.ts`
(See §6.)

## 4. Event Model

Every domain event extends `DomainEventBase`:

```ts
interface DomainEventBase {
  readonly timestamp: number;   // server wall-clock
  readonly playerId: PlayerId | null;  // null = system
  readonly roomId: RoomId;
}
```

Events come in these logical groups:

**Lobby / room lifecycle**
`PlayerJoined`, `PlayerLeft`, `PlayerReconnected`, `ColorSelected`,
`ReadyChanged`, `GameStarted`, `RoomLocked`, `RoomClosed`.

**Turn / gameplay**
`TurnStarted`, `DiceRolled`, `PieceSelected`, `PieceMoved`,
`UndoMove`, `TurnEnded`, `TurnTimeout`, `PieceEliminated`,
`TripleSixPenalty`.

**Game result / replay**
`GameFinished`, `ReplayRequested`, `ReplayStarted`.

**Synchronization**
`StateSynced` — the only event that carries a full `RoomState` +
`GameState` snapshot.

**Design decision:** events are transport-agnostic. Phase 5 maps each
event to a `SOCKET_EVENTS` string constant, but a future UI-over-HTTP
variant would just re-emit the same event types.

## 5. State Machines

### Room state machine

```
  open ──► locked ──► closed
   │        │
   └─ join/leave happens here
```

- `open`: players join, pick colors, toggle ready.
- `locked`: a game has started; `ROOM_LOCKED` fires. No new joins.
- `closed`: host left or room manually closed. Terminal.

`GameStatus` runs as a parallel dimension inside the room:
`waiting → in-progress → finished`, with Replay resetting back to
`waiting`.

### Game state machine

```
 idle → rolling → selecting-piece → moving → waiting-end-turn
   │                                                 │
   └──────►(six) ──► next turn ──────────────────────┘
   └──────►(no legal move) ──► skipped ──► next turn
   └──────►(timeout) ──► turn-ended ──► next turn
   └──────►(all pieces home) ──► finished
```

- `idle`: between turns or pre-roll.
- `rolling`: server is generating dice.
- `selecting-piece`: dice is fixed; current player may choose.
- `moving`/`committing`: move is being applied.
- `waiting-end-turn`: player must press End Turn to close the turn.
- `skipped`: no legal move; engine auto-advances.
- `finished`: all of a player's pieces are home — game ends.

**Design decision:** the turn micro-states exist primarily to make the
client's "what am I allowed to do right now" question trivial to answer.
Each state admits exactly one set of legal client intents, which keeps
the UI layer declarative.

## 6. Error Model

Errors are identified by `DomainErrorCode` — a flat, closed union of
~24 string literals, grouped into:

| Group | Examples |
|-------|----------|
| Move / turn | `invalid-move`, `invalid-turn`, `no-legal-move`, `cannot-undo` |
| Dice | `dice-not-rolled`, `dice-already-rolled`, `dice-not-six` |
| Room | `room-not-found`, `room-full`, `room-locked`, `not-enough-players` |
| Player | `player-not-found`, `not-host`, `color-already-taken`, `player-eliminated` |
| Game state | `game-not-started`, `game-already-finished`, `wrong-turn-player` |
| Replay | `replay-unavailable`, `replay-not-requested` |

**Design decision:** every error is a concrete, user-actionable concept.
No generic "engine error" exists, so the application layer can map a
code to a Persian localized string without ambiguity, and telemetry
can be sliced by exact failure reason from day one.

## 7. Configuration Models

| File | Type | Scope |
|------|------|-------|
| `config/game.config.ts` | `GameConfig` | Aggregate feature flags (undo on/off, timer on/off, color pool). |
| `config/board.config.ts` | `BoardConfig` | Board geometry model + home-position map. |
| `config/room.config.ts` | `RoomConfig` | Room policy (max players, disconnect grace, elimination threshold). |
| `config/rules.config.ts` | `RulesConfig` + `rulesConfig` | Scalar Ludo rules. `RULE_DEPENDENCY` maps actions to rule keys. |
| `config/socket.config.ts` | `SocketConfig` | Placeholder for Phase 5. |
| `config/telegram.config.ts` | `TelegramConfig` | Placeholder for Phase 4. |

**Design decision:** `rulesConfig` is a *value object* (a const), not a
mutable singleton. The engine reads it at startup; tests override it
per-test by constructing a new `RulesConfig`. This makes the ruleset
trivially mockable without monkey-patching module state.

## 8. Dependency Graph (compile-time)

```
constants/game.ts ──► types/game.ts (enums)
constants/colors.ts ──► types/piece.ts, types/player.ts, config/*.ts
types/player.ts ──► types/ids.ts, types/game.ts
types/piece.ts ──► types/board.ts ──► config/board.config.ts
types/error.ts ──► types/events.ts, types/move.ts
types/dice.ts ──► types/turn-state.ts
types/move.ts ──► types/game-state.ts, types/snapshot.ts
types/action.ts ──► config/rules.config.ts
types/game-state.ts ──► types/replay.ts, types/snapshot.ts
types/winner.ts ──► types/events.ts
types/ ──► index.ts (barrel)
```

All imports use `import type { … }` so the type files are erased at
build time and add zero runtime bytes to the client bundle.

**Direction:** dependencies point inward toward the core; nothing in
`types/`, `constants/`, or `config/` imports from `app/`, `components/`,
`lib/`, `socket/`, `store/`, `telegram/`, or any runtime framework.

## 9. Things That Affect Future Phases

1. `boardConfig` is a **typed placeholder** (all-zero geometry). Phase 7
   must fill in real coordinates but will not need to widen the type —
   the `BoardModel` surface is complete.
2. `GameState` uses a **string-keyed `pieces` map**. The engine must
   agree on the key format (`${color}-${index}`); this is codified in
   `PieceIdValue` but the serialization helper lives in Phase 6.
3. `GameAction` and `RoomAction` are intentionally **unions of string
   literals**, so Phase 5's socket handlers can be exhaustively
   `switch`ed — a missing case is a compile error.
4. `RoomState.runtimes` is a `Readonly<Record<PlayerId, PlayerRuntime>>`
   — adding or removing a player is a shallow copy, not a mutation.
   The application layer must respect this on every update path.
5. `Turn.committedMoves` is a `ReadonlyArray`. Undo and move-commit
   paths must produce new arrays; in-place mutation breaks type safety.
6. The state machine **does not prescribe** how many snapshots the
   engine retains for Undo — only that the type supports it. Phase 6
   may choose to keep a ring buffer, a full log, or both.
