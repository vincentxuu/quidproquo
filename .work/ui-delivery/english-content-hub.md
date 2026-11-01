# English content integration

## Scope and design
- Source: local HEAD 2193d725 with pre-existing shared changes; preserve unrelated work. User subsequently authorized commit/push when complete; no manual deployment requested. Release checkout: /tmp/quidproquo-english-integrate from origin/main 619baed3.
- Skills: ui-delivery, post-update. Existing site tokens and practice controls reused; new directory uses native anchors and semantic lists.
- Single registry joins published Markdown metadata to hub links and shared article navigation. User clarified that all methods/scenario articles belong to one series; unify 34 pairs at order 0–33 while retaining article identities/dates.
- Plan: inventory -> registry and directory -> contextual article navigation -> overview zh/en explanation -> source and browser checks.

| Screen / consumer | States / flow | Viewport / theme | Expected |
|---|---|---|---|
| /english/ | entry, directory anchors, all six practice scenarios | desktop/mobile, light/dark, keyboard | four clear entry points; complete published content links |
| /english/#home/work etc. | existing deep links, exercise, back, hash history | desktop/mobile | exercise survives integration; relevant material links |
| /english/#materials, #methods, #courses | direct load and in-page nav | mobile/reduced viewport | native anchors retain location through hydration |
| English-related posts, zh/en | scenario / method / course chapters of one series | desktop/mobile, light/dark | role label, hub links and appropriate practice action |
| /series/english-speaking-practice and /en/series/english-speaking-practice | series listing to hub | desktop/mobile | clear series scope and directory links |
| unrelated post | ordinary article | desktop | no English navigation |
| practice cloud login/storage | guest, loading/error | existing behavior unchanged | hub has no auth dependency; preserves progress |

## Evidence
| Gate | Status | Evidence | Remaining |
|---|---|---|---|
| Source and automated checks | pass | Isolated pnpm verify; 35 targeted Vitest tests; full pre-commit repeats final gate | Pregenerated audio remains pending, separate from source checks |
| Interaction | pass | CUA on final isolated server http://localhost:4338: 8 new lesson pages, shadowing zh/en, series zh/en, scenario notes, keyboard anchors and browser speech start | Audio sound quality/native speaker testing not claimed |
| Visual review | pass | CUA screenshots observed: desktop1280x800; mobile390x700 and390x430, light/dark; no horizontal overflow | No baseline snapshots changed |
| Deployment | pending | User authorized commit/push; no manual deploy executed | CI/deployment/public readback reported separately |

## Findings
- Existing malformed /english/26-10-07-work-standup-english/ is not a defined route; preserve stable /posts/ URLs rather than inventing moved content.
- Inventory initially lacked surf/health articles. User approved four new bilingual lessons; all six scenarios now have actual article files.
- Directory anchors must not reset React practice hash state or steal focus on hydration.

- Source review found print regression from new hub content in main; fixed print hiding for hub/directory/sync and heading selector. Actual Chrome print preview showed a single 31-sentence work cheat sheet with no hub or directory.

## Expanded scope and source review
- User steering: methods/research must be series members; all former standalone materials now share the same primary series. User accepted the recommended four new scenario lessons: daily health/lunch, flight delays and a cabin bag left onboard, surfing questions, climbing-gym beta.
- 34 Chinese + 34 English chapters, continuous 0–33; scenario directory: travel2/surf1/climbing2/work2/daily2/interview6 =15, methods3, overview/courses/review16.
- Added 15 cards; reused existing main answers and stable IDs. Linked 32 evidence records to their lesson; context adaptation is stored and displayed separately from sentence evidence.
- New articles have author and non-author source/teaching review records. Older methods/scenario bodies were preserved except one stale cross-article reference corrected bilingually; old prices/research were not reverified.
- Audio dry-run: 136 missing clips (60 for 15 new sentences, plus 76 existing gaps), approx $0.11. Account discovery returned403; explicit configured account reached synthesis but returned401 authentication error. No credentials changed. Missing clips use the existing browser speech fallback; pregenerated new audio remains pending.

- Isolated release dry-run uses the current remote baseline: 304/319 clips per voice, 60 new clips missing (approx $0.05). The earlier 136 included 76 stale shared-checkout gaps already filled on remote. This release retains those remote clips and manifest; it does not claim any newly pregenerated audio.
- Independent release scope audit preserved all179 original cards and dialogues, remote daily evidence improvements and regression assertions; no CI/schema/dependency changes or raw scraped pages included.

## Final isolated browser evidence
- Final source baseline: origin/main 619baed3, isolated branch codex/english-learning-integration-20261025. Product manifest digest: 2dbfc1c7384f47e682239087e5ddc7fd55393dd1a81391f0bb831950f4c59f4f.
- Directory: 34 Chinese and34 English links; scenario15/method3/overview-and-course16; six scenario groups have2/1/2/2/2/6 chapters. One h1 on hub.
- Visited all8 new bilingual article routes; each showed correct series membership15–18/34 and scenario practice link, no mobile overflow.
- Shadowing evidence zh/en showed series2/34 and method role. Series zh/en showed34 chapters and full-path role.
- New surfing topic showed7 cards and7 related-material links. Browser speech playback for new water-temperature sentence entered Stop playback state; no recording/microphone permissions requested.
- Keyboard Enter to #methods retained selected surfing scenario and placed section at96px. Direct method link from article also arrived at96px after hydration. Light390x430 and dark390x700 readable without horizontal overflow.
- Initial shared-checkout print test showed only one31-sentence work cheat sheet in actual Chrome print preview. The final checkout retains the same print CSS and work-card contents; no new screenshot baseline was created.
- Dependency setup issue resolved for final browser testing: replaced the temporary node_modules symlink with a local APFS clone so Vite could serve framework hydration modules. No package/lock/config changes were needed; dependency directory is ignored and excluded from release.
- Ready for commit/push. Pregenerated new audio pending (Cloudflare401); deployment acceptance not inferred from local checks.

- Final staged whitespace audit found Markdown hard-break trailing spaces in new dialogue blocks; replaced them with explicit br line breaks preserving the rendered dialogue. Cached diff whitespace check rerun before commit.

- First commit hook passed all full-site gates but correctly blocked old research-to-do sections under the stricter staged content check. Moved20 legacy sections into an exact-text working note and kept actionable source/use limitations in lesson introductions, with bilingual update records. No checker or threshold was changed; final hook must pass before publication. Earlier body-preservation audit is qualified by this explicit cleanup.

- Release currently paused before commit/push for required Tier2 approval: actual staged checker misclassifies My guess teaching examples as author hedges. Narrow proposal with20 selftests and independent review is ready, but real governance script remains unchanged. Q-045 tracks the approval; product work is otherwise reviewable and validated.

- 2026-10-25 user approved the narrow checker fix and commit/push. Applied only the reviewed classification change with9 added regression cases, retaining thresholds and all original assertions; final actual hook is required before push. Q-045 marked approved and moved to Done.

- User approved checker fix. Refreshed release base to origin/main25678862 in /tmp/quidproquo-english-publish after45 incoming commits. Only overlap was series.ts; retained every non-English definition. Scoped UI/code/content bytes otherwise unchanged from tested isolated version; latest main adds its own verification checks. Final commit hook will run in this actual checkout.
