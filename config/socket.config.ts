/**
 * Socket.IO runtime options (transports, reconnection, timeouts).
 *
 * Filled during Phase 5 (Realtime Infrastructure). No connection is
 * established here; this only describes how a future socket layer may
 * be configured.
 */
export type SocketConfig = {
  /** Reserved for server URL and transport settings. */
  readonly placeholder: true;
};
