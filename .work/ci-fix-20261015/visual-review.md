# Visual CI recovery — 2026-10-16

Run38767713208 / head e1623fe1 provided Linux expected/actual/diff artifacts.

- Root and independent reviewer visually inspected light/dark chat actual versus expected. Compact header, bottom suggestions and disclaimer match intentional d46ce901 source changes. That commit refreshed Darwin images only; Linux retained older layout. The two chat Linux baselines now copy exact CI actual bytes. No threshold change.
- Floating light/dark actual show a404 page. They have NOT been accepted as baselines. File and static artifact exist; actual dev404 cause is under investigation. Response200 and exact articleH1 assertions are being added before screenshot capture.
- Final baseline verdict must distinguish stale expected layout from functional router failure. Invalid pages must fail before screenshot comparison.
