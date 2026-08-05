<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

# Core Operating Instructions for AI Agents

This document defines the non-negotiable constraints and workflow for any Agent interacting with this codebase. Adherence is mandatory.

---

## 1. General Principles
- **Context First:** Always load and analyze the project's existing files before proposing or executing any code changes.
- **Minimalism (YAGNI):** Never create new files, components, or abstractions unless explicitly required by the current task. If it isn't used immediately, don't build it.
- **Incremental Changes:** Execute modifications in small, verifiable, and atomic steps. Avoid large, monolithic refactors.
- **Code Quality:** Output must be readable, maintainable, and scalable. Prioritize clarity over cleverness.
- **Project-Specific Logic:** Every architectural decision must be justified by the specific needs of *this* project. Do not apply generic "best practices" blindly.

---

## 2. Development Priorities (Strict Hierarchy)
Adhere to this exact order of precedence when making decisions:

1. **Logical Correctness** (Does it solve the problem?)
2. **Behavioral Reliability** (Is it robust and bug-free?)
3. **Architectural Simplicity** (Is it easy to understand the structure?)
4. **Readability & Maintainability** (Can another human/agent modify it?)
5. **UI Polish** (Visual aesthetics come last).

---

## 3. Behavioral Constraints (DOs and DON'Ts)
- **DO NOT** clutter the repository with temporary files, incomplete test stubs, or disposable one-off components.
- **DO** verify compatibility with the existing architecture before introducing a new feature.
- **IF** a change impacts the core architecture (e.g., state management, data flow), **THEN** map out the affected layers and dependencies *before* writing any code.
- **DO NOT** refactor code solely for "cleaner looks" unless it provides measurable technical value (e.g., reduces bundle size, fixes a coupling issue, improves performance).

---

## 4. Project Communication & Design Style
- **Acknowledge the Domain:** This is a **game**, not an enterprise dashboard.
- **UX Priorities:** Prioritize **predictability**, **interaction speed**, and **low latency** over decorative or gimmicky UI features.
- **Decision Heuristic:** If you are torn between two solutions, **ALWAYS** choose the one that is:
    - Simpler to implement.
    - Easier to test.
    - Carries the lowest risk of introducing regressions.

---

## 5. Mandatory Sequential Workflow
Execute your development process in this strict sequence. Do not skip steps:

1. **Understand:** Analyze the current architecture, state management, and data models.
2. **Engine:** Build or modify the underlying game logic/engine rules.
3. **Integration:** Connect the UI layer to the engine.
4. **Infrastructure:** Add real-time features and room management (if applicable).
5. **Polish:** Finalize with performance optimization and UI refinement.

---

## 6. Agent-Specific Operational Rules
- **Mandatory Reading:** Before modifying a specific module, read the relevant context files (e.g., current state, component tree, API contracts).
- **Zero Assumptions:** Do not rely on hidden assumptions. If a requirement is ambiguous, **DO NOT** implement a risky workaround. Instead, choose the simplest, most compatible fallback or explicitly state the ambiguity.
- **File Justification:** If you create a new file, your commit message or reasoning *must* explicitly state why that file is necessary.
- **Prohibited Patterns:**
    - Duplicate files/modules.
    - Anonymous helper functions with unclear scope (name them logically).
    - Fragmented or duplicated state management (centralize state where appropriate).

---

## 7. Final Reminder
Approach this codebase with the mindset of building a **"small, precise product"** rather than a **"scattered proof-of-concept"**. Quality of architecture and reliability outweigh the quantity of features added.

<!-- END:nextjs-agent-rules -->
