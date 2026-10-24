# Observed HTTP events

Event IDs are unique only within each run; use run_id + event_id.

- 2026-10-22T00:07:08.118831+00:00 vulnerable-v1:evt-000001 alice N-1 allow HTTP 200
- 2026-10-22T00:07:08.119273+00:00 vulnerable-v1:evt-000002 alice N-2 allow HTTP 200
- 2026-10-22T00:07:08.119672+00:00 vulnerable-v1:evt-000003 alice S-1 allow HTTP 200
- 2026-10-22T00:07:08.120006+00:00 vulnerable-v1:evt-000004 bob N-2 allow HTTP 200
- 2026-10-22T00:07:08.120306+00:00 vulnerable-v1:evt-000005 carol S-1 allow HTTP 200
- 2026-10-22T00:07:08.164254+00:00 fixed-v1:evt-000001 alice N-1 allow HTTP 200
- 2026-10-22T00:07:08.164708+00:00 fixed-v1:evt-000002 alice N-2 deny HTTP 403
- 2026-10-22T00:07:08.165114+00:00 fixed-v1:evt-000003 alice S-1 deny HTTP 403
- 2026-10-22T00:07:08.165463+00:00 fixed-v1:evt-000004 bob N-2 allow HTTP 200
- 2026-10-22T00:07:08.165792+00:00 fixed-v1:evt-000005 carol S-1 allow HTTP 200
