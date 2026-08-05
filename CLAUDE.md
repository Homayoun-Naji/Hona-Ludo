@AGENTS.md

# Hona Ludo - Project Specification (Agent-Optimized Directive)

**English Project Name:** Hona Ludo  
**Persian Project Name:** منچ هُنا

This is a **5-player Ludo game** built as a Telegram Mini App. This document serves as the absolute source of truth for any AI Agent working on this codebase.

---

## 1. Project Introduction (Context)

- **Execution Environment:** Runs exclusively inside Telegram (Mobile-focused).
- **Platform:** Designed for mobile viewports only.
- **Language & Direction:** Fully Persian (Farsi) with RTL (Right-to-Left) layout.
- **Persistence:** Has **no** permanent database.
- **Scope Constraint:** Has **no** user accounts, scores, leaderboards, rewards, in-app purchases, or any gamification elements beyond the core game loop.
- **Ambition:** This project is intended to be a clean, professional-grade portfolio piece for Frontend, Real-time UI, and Telegram Mini App development.

---

## 2. Core Product Goals

1. Deliver a fast, simple, and intuitive Ludo experience on Telegram.
2. Support private multiplayer games via invite links.
3. Synchronize real-time gameplay between players within a single Room.
4. Support a maximum of **5 players**.
5. Allow **only the Host** to start the game.
6. Allow **only the Host** to initiate a Replay.
7. Implement standard Ludo rules with absolute precision and transparency.
8. Avoid common "vibe-coded" bugs through clean, layered architecture.

---

## 3. Product Principles (Hard Boundaries)

### MUST HAVE
- 5-player game support.
- Private Rooms.
- Invite links.
- Display name selection.
- Color selection from **available** colors only.
- Precise turn-based sequencing.
- Turn timer.
- Manual "End Turn" button.
- Limited Undo (before turn ends).
- Highlighting of movable pieces.
- **SVG-based** Board.
- Data-driven paths and coordinates.
- Animated (but simple) piece movement.
- Game Start exclusively by Host.
- Replay exclusively by Host.
- Fully Persian (Farsi) and RTL UI.

### MUST NOT HAVE (Currently)
- Database.
- User accounts.
- Leaderboards.
- Scores.
- Rewards.
- In-game Chat.
- AI / Bot opponent.
- Sound effects.
- Haptic feedback (vibration).
- Emoji reactions.
- Settings page.
- Spectator mode.
- Public matchmaking.
- Payments.
- Any decorative features lacking practical value.

---

## 4. Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand
- Framer Motion
- Shadcn (BaseUI)

### Realtime / Networking
- Socket.IO

### Telegram Integration
- Telegram Mini Apps SDK
- WebApp APIs (viewport, theme, back button)

### UI / Rendering
- **SVG** for the Game Board.
- CSS / Tailwind for layout and styling.
- Lightweight animations for dice rolls and piece movement.

### Storage
- **No permanent database** for this version.
- Game state is kept exclusively in server memory.
- (Future versions *may* add ephemeral storage for reliability, but this is NOT a goal for the current release).

### Deployment
- A lightweight service is required for the real-time server in production.
- The architecture **must not** be strictly dependent on Vercel's serverless functions if stable WebSocket connections are required.

---

## 5. Macro-Architecture (3-Layer Separation)

The project must be strictly divided into three distinct layers:

### A) Presentation Layer (UI)
- **Role:** Display only.
- **Contents:** Board, Dice, Player list, Room view, Waiting room, Turn timer, Modals, Buttons, Highlights, Replay/Start controls.
- **Constraint:** This layer **must not** contain game rules or business logic.

### B) Application Layer (Coordination)
- **Role:** Orchestrates the flow.
- **Responsibilities:**
  - Receives events from the UI.
  - Sends events to the socket.
  - Manages superficial UI state.
  - Coordinates between the UI and the Engine.
  - Controls the game flow.

### C) Domain / Game Engine (Core)
- **Role:** The heart of the project.
- **Responsibilities:**
  - Ludo rules.
  - Move validation.
  - Turn management.
  - Dice calculation.
  - Determining legal moves.
  - Capture logic.
  - Triple-six logic.
  - Endgame detection.
  - Undo logic.
  - Replay logic.
  - State reset.
- **Constraint:** This layer **must not** depend on React or any UI framework.

---

## 6. Directory Structure (Root Level - No `/src`)

The structure must be scalable but strictly avoid over-engineering.

```text
app/
components/
engine/
socket/
store/
hooks/
telegram/
services/
lib/
utils/
constants/
types/
config/
assets/
styles/
docs/
```

### Directory Breakdown (Agent Notes)

| Directory | Purpose |
| :--- | :--- |
| **`app/`** | ONLY Next.js routes, layouts, and pages. |
| **`components/`** | UI Components. Suggested sub-folders: `common/`, `board/`, `dice/`, `piece/`, `player/`, `room/`, `timer/`, `ui/`. |
| **`engine/`** | Game logic. Suggested sub-folders: `core/`, `rules/`, `board/`, `movement/`, `turn/`, `room/`, `replay/`, `validation/`. |
| **`socket/`** | Real-time communication. Sub-folders: `client/`, `server/`, `events/`, `handlers/`. |
| **`store/`** | Zustand state stores. |
| **`hooks/`** | Custom React hooks. |
| **`telegram/`** | All Telegram Mini App SDK integrations. |
| **`services/`** | API communication functions or network abstractions. |
| **`lib/`** | Higher-level helpers. |
| **`utils/`** | Small, generic helper functions. |
| **`constants/`** | Constants, enums, event names, timers, dimensions. |
| **`types/`** | All TypeScript types and interfaces. |
| **`config/`** | Core configurations: `board.config.ts`, `game.config.ts`, `socket.config.ts`, `telegram.config.ts`. |
| **`assets/`** | Static files (SVGs, icons). (Sounds are NOT used currently, but structure can be ready). |
| **`styles/`** | Global styles, design tokens, base CSS. |
| **`docs/`** | Internal project documentation (e.g., `Architecture.md`, `GameRules.md`, `SocketEvents.md`, `BoardSpec.md`). |

---

## 7. Language, Direction & Font

- **Language:** All UI text **must** be in Persian (Farsi).
- **Direction:** The project **must** be RTL (Right-to-Left).
- **English Restriction:** English text is **prohibited** in the UI, except for technical keys, file names, or code identifiers.
- **Font:** The font will be installed by the developer; the agent does not need to import it, but must structure elements to handle Persian glyphs properly.
- **Layout:** Spacing, flex directions, padding, and icon placements **must** be strictly verified for RTL compatibility.

---

## 8. Game Rules (Critical Implementation Specs)

### Players
- **Minimum:** 2 players.
- **Maximum:** 5 players.
- **Design Constraint:** The game logic and board **must** be built for 5 players from the start, even if only 2 or 3 are currently in the room.

### The Host
- **Only** the room creator can start the game.
- The "Start" button is visible **only** to the Host.
- The Host is solely the initiator; they hold no special managerial privileges during active gameplay (except for Replay).
- If the Host leaves before the game ends, Replay becomes unavailable unless they return.

### Player Colors
- Players choose colors from the remaining available pool.
- Color assignment must be managed inside the **room state**.
- Color order **must not** be static or dependent on the Host's position.

### Display Names
- Users enter a display name upon joining.
- This name is session-only (no permanent storage).
- The name is cleared upon game exit or room closure.
- The name must be displayed in the UI to identify players.

### Turn Management
- Turns cycle strictly and predictably between players.
- Turn logic **must be server-authoritative**.
- Turn timer is controlled **server-side**.
- **Timeout Rule:** If a user times out 3 times, they are **eliminated** from the game.

### Timer
- **Duration:** 2 minutes per turn.
- **Control:** Managed exclusively on the server. The UI only renders the remaining time.
- **Consequence:** Timeout -> Lost turn. Repeated timeouts -> Elimination.

### "End Turn" Button (Manual)
- **Crucial:** The turn must **not** end automatically after rolling.
- After rolling the dice and moving a piece, the player **must** manually click "End Turn".
- This decision enables the Undo feature and prevents accidental actions.

### Undo
- **Scope:** Only available before ending the turn.
- **Depth:** Only one step backward.
- **Constraint:** Only for the same player and the same turn.
- **Block:** Not available after "End Turn".
- **Implementation:** Must be based on a snapshot or transient state to prevent client-server divergence.

### Dice
- **Fairness:** Must be completely random (equal probability).
- **Authority:** Randomization happens **server-side**, not client-side.
- **Sixes:** Rolling a 6 grants an additional turn.
- **Triple Six:** Rolling three consecutive 6s resets active pieces on the board (per specific rules below).

### Piece Movement
- Pieces can only move if the move is **legal**.
- Illegal pieces must be disabled or unselectable in the UI.
- Movement must be displayed step-by-step or via smooth animation (avoid abrupt jumps).
- If no legal move exists, the turn must end or be skipped systematically.

### Capture
- **Allowed:** Opponent pieces can be captured (sent back home).
- **Disallowed:** A player **cannot** capture their own piece.
- **Home Base:** Captured pieces return to their starting base.
- **No Safe Blocks:** There are no safe squares.
- **No Stacking/Blocking:** Two pieces of the same color cannot occupy the same tile.
- **Logic:** A tile is either occupied or empty.

### Final Home Path
- Each player has a unique final home path.
- Once a piece enters the home path, it never returns to the start.
- Triple-six or other rules **must not** affect pieces inside the home path.

### Triple Six (Penalty)
- If a player rolls three 6s consecutively:
  - All their **active** pieces currently on the main board return to their start/home base.
  - Pieces already inside the **final home path** are **exempt** from this rule.
- This must be precisely implemented in the Engine.

### Starting from Home
- Exiting the home base is **only** possible by rolling a 6.

### Replay
- **Authority:** Only the Host can initiate a Replay.
- **Definition:** A complete reset of the game state, restarting with the exact same Room and players (provided the Host is present).
- **Fallback:** If the Host is absent, Replay is disabled; a new room must be created.

---

## 9. Board & Graphics

### Board Implementation
- **Technology:** **SVG** (Strictly forbidden to use PNG or static images).
- **Data-Driven:** All paths, tiles, coordinates, and zones must be defined in configuration files (`config/`).
- **React's Role:** Only render the SVG.
- **Reasoning:** SVG ensures clarity at all sizes, supports RTL/responsive layouts easily, aligns perfectly with piece coordinates, allows theme changes, and offers better control over animations.

### Board Shape
- 5-player star-shaped board.
- Completely symmetrical.
- Supports 5 colors / 5 paths.
- The board layout **must not** change based on player count (only active/inactive player states change).

### Pieces
- Pieces move based on SVG coordinates defined in the config.
- Pieces must support highlighting.
- Legal moves must be visually distinct.
- When a piece is selected, the movement path must be clearly indicated.

### UX Movement
- Animations must be simple, clean, and lightweight.
- Avoid heavy or cluttered visual effects.
- No sound, vibration, or emoji reactions currently.

---

## 10. UX & Flow

### Entry Flow
1. User opens the invite link.
2. Mini App loads.
3. User enters a display name.
4. User selects a color.
5. User enters the Waiting Room.
6. If Host, the "Start" button appears.
7. Host starts the game.
8. Game state transitions to `playing`.

### Waiting Room Requirements
- List of players.
- Each player's color.
- Ready status (Ready btn for each player except the host).
- Connection status.
- Host indicator.
- "Start" button (Host only).

### Game Screen Requirements
- Board.
- Pieces.
- Dice.
- Turn indicator.
- Timer.
- End Turn button.
- Undo button.
- Turn status for all players.
- Winner display upon game finish.

---

## 11. Real-time / Socket Principles (Critical)

- **Server Authority:** The server is the absolute source of truth.
- **Client Role:** The client sends only intents (UI actions) and renders the state. It does not compute game logic.
- **Validation:** All critical events must be validated server-side.
- **State Storage:** Room state is persisted exclusively on the server.
- **Reconnection:** Must be supported.
- **Temporary Disconnect:** Disconnection should **not** immediately eliminate the player (as long as the Mini App isn't closed).
- **Elimination:** Elimination happens strictly via game rules (e.g., 3 timeouts) or manual disconnection.

### Core Socket Events (Constants)
```text
PLAYER_JOIN
PLAYER_LEAVE
PLAYER_READY
PLAYER_COLOR_SELECT
ROOM_LOCKED
GAME_START
ROLL_DICE
PIECE_SELECT
PIECE_MOVE
UNDO_MOVE
END_TURN
TURN_TIMEOUT
PLAYER_ELIMINATED
GAME_FINISHED
REPLAY_REQUEST
REPLAY_STARTED
PLAYER_RECONNECT
```

---

## 12. Room Management

- Rooms are **private**.
- Rooms are created or joined exclusively via an invite link.
- Rooms **must** lock after the game starts.
- No new players can join after the room is locked.
- The invite link must contain a unique room identifier.
- Room state is stored in **server memory**.
- Rooms can be reset or deleted after the game concludes.

---

## 13. Host Rules (Recap)

- **Only** the Host can start the game.
- **Only** the Host can initiate a Replay.
- The Host is an initiator, not a permanent referee.
- The Host has no influence on game fairness.
- Replay is only available if the Host is present.

---

## 14. Responsive & Mobile-First

- **Primary Target:** Mobile phones.
- **Desktop:** Not a priority.
- **Optimizations:** Spacing, button sizes, touch targets, and board scaling must be optimized for mobile touch interfaces.
- **Readability:** UI must be perfectly readable on RTL small screens.

---

## 15. Technical Implementation Constraints

1.  **Engine Purity:** The Game Engine must have clear inputs, clear outputs, minimal side effects, be highly testable, and reusable.
2.  **State Segregation:** **Client State** (UI selection, local interactions) and **Server State** (room, turn, dice, board, pieces) must **never** be mixed.
3.  **Time Control:** Timers are **server-authoritative**. The client only renders the countdown.
4.  **No Database:** Do not introduce a database unless a clear, practical need arises.
5.  **No Unnecessary Abstractions:** Create hooks, services, or components **only** if absolutely necessary. Do not create empty or duplicate files.

---

## 16. Naming & Coding Standards

- Names must be clear and **domain-specific**.
- Avoid generic or ambiguous names.
- File names and types must perfectly match their responsibilities.
- **No Magic Numbers:** Game rule numbers must be moved to `constants/`.
- Event names, rules, and statuses must be defined in a single, centralized location.

---

## 17. Code Quality Rules

- Every phase must produce executable output.
- Every change must have a clearly defined purpose.
- Do not add code that "might be useful later" but is currently unused.
- Avoid duplication.
- If logic becomes complex, move it to the **Engine**, not the Component.
- The UI must **never** be the source of truth.

---

## 18. Testing Principles (Mandatory)

- The Engine **must** support Unit Testing.
- Rules **must** be tested independently of the UI.
- Turn logic must be testable.
- Timeout and Replay must be simulatable.
- Reconnection flow must be tested.
- Capture, Triple-Six, End-Turn, Undo, and Start-Game must have **deterministic** tests.

---

## 19. Project Phasing (Sequential Execution)

The project must be built in defined phases. Each phase must have:
- A clear objective.
- An executable output.
- Defined scope.
- Known dependencies.
- Backward compatibility with previous phases and readiness for the next.

**Phase List:**
1. Foundation & Project Setup
2. Core Domain Design (Types, Models, State Machine, Game Data Structures)
3. Design System & Core UI (Shadcn + Base UI + Design Tokens)
4. Telegram Mini App Integration
5. Realtime Infrastructure (Rooms & Socket)
6. Game Engine (Core Rules)
7. Board Rendering & Piece Movement
8. Gameplay Integration (Engine + UI + Socket)
9. Match Flow & Room Management
10. Polish, UX & Animations
11. Testing, Optimization & Production Release

---

## 20. Permanent Reminders for Claude (Agent)

- This project is strictly **5-player**.
- The project is **Persian (Farsi)** and **RTL**.
- The Board is **SVG**.
- **No Database** currently.
- **No** extra decorative features.
- The Host is **only** the starter and replay initiator.
- Undo is **limited** (one step, before turn ends).
- End Turn is **manual**, not automatic.
- The Timer is **server-side**.
- Colors are **selectable** from available options.
- **No safe blocks.**
- **No stacking/blocks.**
- A player **cannot** capture their own piece.
- **No sound.**
- **No vibration.**
- **No chat.**
- **No AI.**
- **No leaderboard.**
- The sole objective is a clean, reliable, and scalable Mini App.

---

## 21. Optimal Agent Workflow for this Project

1. **Read Context:** Analyze existing files before writing a single line of code.
2. **Understand Structure:** Grasp the macro-architecture (Engine, App, UI).
3. **Execute Phase by Phase:** Do not skip steps.
4. **Analyze Task:** Before coding, break down the specific prompt/task.
5. **Avoid Assumptions:** Do not proceed with high-risk guesses if something is ambiguous.
6. **Align Scope:** Responses and code must align with the actual project scope.
7. **Evaluate Architecture Impact:** If an architectural change is needed, analyze its impact on the entire project first.

---

## 22. Mental Summary (For the Agent)

This is a **5-player Persian RTL Ludo game** designed for Telegram. It uses **no database**, relies on **private rooms** and **invite links**, has **realtime socket-based** synchronization, a **SVG-based board**, **server-authoritative** logic, and a **mobile-first UI**.

**All decisions must prioritize simplicity, stability, and scalability—never clutter or unnecessary features.**