# Observed HTTP events

Event IDs are unique only within each run; use run_id + event_id.

- 2026-10-22T00:06:48.739976+00:00 vulnerable-v1:evt-000001 alice N-1 allow HTTP 200
- 2026-10-22T00:06:48.740457+00:00 vulnerable-v1:evt-000002 alice N-2 allow HTTP 200
- 2026-10-22T00:06:48.740838+00:00 vulnerable-v1:evt-000003 alice S-1 allow HTTP 200
- 2026-10-22T00:06:48.741249+00:00 vulnerable-v1:evt-000004 bob N-2 allow HTTP 200
- 2026-10-22T00:06:48.741615+00:00 vulnerable-v1:evt-000005 carol S-1 allow HTTP 200
- 2026-10-22T00:06:48.785068+00:00 fixed-v1:evt-000001 alice N-1 allow HTTP 200
- 2026-10-22T00:06:48.785543+00:00 fixed-v1:evt-000002 alice N-2 deny HTTP 403
- 2026-10-22T00:06:48.785970+00:00 fixed-v1:evt-000003 alice S-1 deny HTTP 403
- 2026-10-22T00:06:48.786299+00:00 fixed-v1:evt-000004 bob N-2 allow HTTP 200
- 2026-10-22T00:06:48.786629+00:00 fixed-v1:evt-000005 carol S-1 allow HTTP 200
