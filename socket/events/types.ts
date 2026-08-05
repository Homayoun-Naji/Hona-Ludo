import type { SOCKET_EVENTS } from "@/constants/events";

/**
 * Shared payload contract for every socket message.
 *
 * Implemented in Phase 5. Until then this type exists only so that
 * socket client/server/handler modules can reference a single,
 * centralized shape without guessing the wire format.
 */
export type SocketEventPayload = Partial<Record<keyof typeof SOCKET_EVENTS, unknown>>;
