# Socket Events

Purpose: Living inventory of every real-time event exchanged between client and server, including direction (client→server / server→client), payload shape, and expected side effects.

The domain event model is defined in `types/events.ts` and is transport-agnostic. This document will be extended in Phase 5 to map each domain event onto the corresponding `SOCKET_EVENTS` string constant from `constants/events.ts`.

Until Phase 5, the canonical mapping is documented in `docs/DomainModel.md` §4 and §7.
