# Personal UI browser acceptance, 2026-10-23

User explicitly authorized browser operation after initial no-browser restriction. Scope: personal UI repairs and the reported ChatHeader sparkle badge, removed in this pass.

Environment: real Chromium on local source, dedicated fresh Astro dev http://localhost:4355. Existing localhost4321 had stale content-store404; fresh rebuild restored exact requested CS329Z article200. Source HEAD283252d9 plus shared working changes (not a published revision).

## Behavioral evidence

Command: PERSONAL_TEST_BASE_URL=http://localhost:4355 pnpm exec playwright test --config playwright.personal.config.ts --workers=1
Final result:23/23 PASS, log /tmp/personal-ui-accepted-browser.log.

- Chat6: dark/light390/1280, refresh prompts, disclosure, empty/guest/save/history state, minimum44px and no horizontal overflow. No AI call made.
- Progress9: zh/en interview and English practice, auto cloud GET, no automatic local import, explicit import, guest persistence and error recovery.
- Vocabulary4: real article lookup modal, both themes, four voice choices, save once/closes/focus restored, selected-text action positioning + Escape, all four voice values reach TTS endpoint and media plays/stops.

API fixtures used to reach cloud/lookup/save/history states; media test serves a valid silent WAV. This proves UI transitions and actual browser media wiring, not genuine Access authentication, D1 persistence, generated dictionary accuracy, or real Aura voice quality. Guest401 and local progress persistence also manually exercised without API fixtures. Never label these as production end-to-end acceptance.

## Visual evidence

Manually inspected real screenshots: desktop chat light, mobile chat dark, mobile interview light, English mobile dark, actual article lookup mobile light; vocabulary library/expanded/review screenshot is a component harness with fixture cards, not an authenticated account page. Header green sparkle badge removed; new screenshot inspected. Complete artifact manifest follows after copy.

Full existing visual regression suite also started on fresh4355 with original assertions/baselines and original global warmup; temporary runner only changes server URL and disables launching another server. Result pending; no baseline auto-approval.

Deployment: not performed. Real owner Access/D1 and production readback remain separate pending checks.

## Final findings and checks

- Actual defect fixed: at1140px the article main overlapped the fixed chat panel by24px because the hidden TOC retained named grid areas. Reset areas/columns/gap, align the bounded reading column beside the AI panel, and prevent desktop body max-width from recentering the reserved layout. Actual1140/1519/1520/1920 browser assertions now verify24px gutter and no overflow.
- Added accessible current-article region; removed green decorative sparkle badge from ChatHeader. Independent read-only source review found no material new regression.
- Final23-case browser suite PASS. Final pnpm verify PASS (/tmp/ui-acceptance-final-gate.log). Owned diff-check PASS.
- Full existing screenshot suite is NOT accepted: existing chat screenshots differ after the redesign, and the three-column suite lacks tracked baselines. The second exploratory run reported20 failed/37 passed, but14 passes compared against freshly auto-generated candidates and must NOT count as accepted visual baselines. All28 generated candidates were moved to evidence/unapproved-three-column-candidates; none were staged or accepted.
- Playwright now defaults updateSnapshots:none. A targeted missing-baseline check correctly fails and does not recreate a source baseline (/tmp/ui-missing-baseline-check.log). Explicit update command still works when reviewed; no assertions or pixel thresholds were relaxed. The old gap test was corrected to measure the rightmost visible editorial column (TOC exists at >=1520) and now ALSO rejects overlap with a lower bound22px.
- Real owner Access/D1, real Aura voice quality, full screenshot-baseline acceptance and deployment remain unverified. Browser media test used valid silentWAV fixtures; cloud tests used controlled API data.

Published runtime source hashes: evidence/mobile-source-hashes.json. The two final mobile composer screenshots are included; other local captures remain in the original workspace. Main previews remain at http://localhost:4355/chat, /interview/, /english/, and the requested CS329Z article. No commit/push/deployment performed.
