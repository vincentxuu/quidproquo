# Observed HTTP events

Event IDs are unique only within each run; use run_id + event_id.

- 2026-10-22T00:09:36.068597+00:00 vulnerable-v1:evt-000001 alice N-1 allow HTTP 200
- 2026-10-22T00:09:36.069055+00:00 vulnerable-v1:evt-000002 alice N-2 allow HTTP 200
- 2026-10-22T00:09:36.069415+00:00 vulnerable-v1:evt-000003 alice S-1 allow HTTP 200
- 2026-10-22T00:09:36.069740+00:00 vulnerable-v1:evt-000004 bob N-2 allow HTTP 200
- 2026-10-22T00:09:36.070036+00:00 vulnerable-v1:evt-000005 carol S-1 allow HTTP 200
- 2026-10-22T00:09:36.112406+00:00 fixed-v1:evt-000001 alice N-1 allow HTTP 200
- 2026-10-22T00:09:36.112826+00:00 fixed-v1:evt-000002 alice N-2 deny HTTP 403
- 2026-10-22T00:09:36.113276+00:00 fixed-v1:evt-000003 alice S-1 deny HTTP 403
- 2026-10-22T00:09:36.113638+00:00 fixed-v1:evt-000004 bob N-2 allow HTTP 200
- 2026-10-22T00:09:36.113996+00:00 fixed-v1:evt-000005 carol S-1 allow HTTP 200
