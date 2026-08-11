/**
 * Stable, opaque identifier for a Room.
 *
 * Embedded in the invite link and used as the primary key in the
 * server-side in-memory store. Branded so accidental mixing with
 * other opaque strings is a compile error.
 */
export type RoomId = string & { readonly __brand: "RoomId" };

/**
 * Short, human-friendly code that the client can put in a URL.
 *
 * Separated from `RoomId` so the server can rotate internal ids
 * without breaking existing invite links. The short code is what
 * the user actually shares.
 */
export type InviteCode = string & { readonly __brand: "InviteCode" };
