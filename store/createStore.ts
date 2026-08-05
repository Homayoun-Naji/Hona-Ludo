import { create } from "zustand";
import type { RootState } from "./types";

/**
 * Factory for the root Zustand store.
 *
 * Phase 1 establishes only the architecture; state slices and socket
 * wiring are added in later phases. The initial state is intentionally
 * the empty shape so the app compiles before any UI or game logic exists.
 */
export const useStore = create<RootState>()(() => ({
  room: null,
}));
