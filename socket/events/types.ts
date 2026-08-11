import type { SocketEventName } from "@/constants/events";

/**
 * Shared payload contract for every socket message.
 *
 * Phase 5 (Realtime Infrastructure) will populate this record with a
 * concrete payload type for each event name as the socket handlers are
 * written. Until then every payload is typed as `unknown`, which forces
 * handlers to narrow before use.
 *
 * Using `unknown` instead of `any` keeps the type system sound: a
 * handler cannot accidentally access `.data` on an untyped payload
 * without first asserting its shape.
 */
export type SocketEventPayloadMap = Partial<Record<SocketEventName, unknown>>;

/**
 * Resolve the payload type for a given socket event name `K`.
 * Returns `unknown` for any event that has not yet been mapped —
 * which is exactly every event during Phase 1 & 2.
 */
export type SocketEventPayload<K extends SocketEventName> =
  K extends keyof SocketEventPayloadMap ? SocketEventPayloadMap[K] : unknown;

export type { SocketEventName };
