# Batch 2 independent review — 2026-10-22

Scope: order 2 and 3, Chinese and English, downloadable evidence/preflight examples; overview and identity navigation readback. Reviewer only edits this report. Read and applied post-verify, post-review, post-polish. Full-site verify, external link checker and release state belong to parent agent; no full-site checks rerun here.

## post-verify

### Resolved required findings

1. **Build expectation derived from observation**: original evidence-demo.py main derived expected_build from event.build, making its version check self-confirming. Original observe() silently routed unknown build labels to vulnerable code. Fixed at `public/examples/ai-security/evidence-demo.py:39-44,68-83,112-116`: declared expected contexts are separate from observations; unknown build raises ValueError; `wrong_build` runs vulnerable-v1 against intended fixed-v1 and is rejected. Independently reran final 14 cases and specifically asserted both build values and rejection verdict. Chinese/English PASS count and table now both say 14 and include wrong_build (both articles:75,106).
2. **Shared identities swapped**: original order 3 article and manifest put Carol/north and Bob/south. Fixed in both language articles:42 and `experiment-manifest.json:12`: Alice/Bob north, Carol south; N-1 Alice, N-2 Bob, S-1 Carol. Owner-only AND tenant policy matches order 1 and order 2.
3. **Ambiguous constructed-case reference**: Chinese order 2 originally said “最後三個假訊息案例”, while table's last rows were different cases. Chinese:112 now explicitly describes three constructed cases by name. English:112 likewise distinguishes constructed objects from observed natural/model behavior.

### Source-backed claims verified against full captured primary pages

No new public fetch was needed: read full local primary-source captures, not search snippets. This does not claim current live verification of those pages. Parent/author previously obtained captures with allowed Exa fallback after Groundlane inventory was unavailable.

- Order 2:29,115 — OWASP Authorization Cheat Sheet (`.work/ai-security/batch-1/research/raw/authorization.md`): requirements-defined permissions, object checks on every request, and unit/integration tests do not replace dedicated security testing. Confirmed single authoritative source.
- Order 2:55 — NIST CAISI (`.work/research/ai-security/ai-for-offense/raw/source-07.md`), sections 2.2 and 2.3: grade loopholes can produce required effects without intended exploit; editing provided local copy did not affect remote target. Confirmed single primary case record. Article does not import success-rate generalizations or claim model experiment here.
- Order 3:36 — PortSwigger Academy full capture and Stanford CRFM full `source-02.md`: interactive labs; Cybench CTF tasks/goals/subtasks. Confirmed single-source per product; no ranking or modern-model capability claim added.
- Order 3:38 — Meta full `source-06.md`: attacker/target pairs, cloud network conditions, known-good state and recommended single use per pair. Confirmed single authoritative source. Article does not claim arbitrary public hosts are included.
- Order 3:46 — complete PortSwigger specified lab capture: provided account and designated user's API-key goal. Confirmed single authoritative source.
- Order 3:54,56 — full Safe Harbor capture in environments-source-fetch.json and final current Code of Conduct in research/code-of-conduct.md: Safe Harbor adoption does not change scope; AI-assisted activity must follow each program scope and testing restrictions, including automation, volume and rate. Final article replaced the older Hackbot discussion with this direct policy source. Confirmed, platform-specific. No legal immunity or blanket authorization assertion.
- Teaching observations are explicitly synthetic/in-process. Version/target harness labels are not external identity attestation. Independent oracle is a separate fixed policy/text fixture, not an independent production data source. Exact-field checker misses other representations; article states this at order 2:115. No HTTP, model, live-service or real attack success claimed.

### Independent executable checks

- evidence-demo.py final CLI: PASS 14 evidence cases. wrong_build explicitly rejects expected fixed-v1 / actual vulnerable-v1; unknown label raises ValueError.
- Additional independent probes: fixed Bob/N-2 and Carol/S-1 allowed; fixed Alice/N-2 and S-1 denied; empty/wrong-type/extra-key requests rejected; new output produces 13 lines on initial revision; existing directory refuses overwrite with FileExistsError. Final count rerun 14; old count probe is not final-output evidence.
- Preflight baseline CLI: PASS record-only warning. Author's 16 cases independently rerun, all pass.
- Additional 30 independent preflight probes: unknown/null/list/object/numeric-or-boolean values across environment, automation, mode (15) rejected; malformed/null/list/bool section objects across five sections (15) rejected without exceptions. No unknown enum silently accepted.
- Free-text “latest”/weak authorization content can pass by design; order 3:94 explicitly teaches human verification. This is accepted record-validation scope, not proof of real permission, reproducibility, limits enforcement, or deployment isolation.

This review checks 11 grouped external and executable claims presented in these articles, and does not establish complete subject coverage or live-source currency.

## post-review

No unresolved required issues after the fixes above.

- Order 2:19-23 defines reader and synthetic scope, 59-76 supplies executable commands/output, 100-116 interprets genuine and constructed counterexamples, 119-134 provides report and impact boundaries, 138-142 asks matching questions and gives answers. Title/TLDR promises are fulfilled.
- Order 3:19-23 identifies the environment-selection question and prerequisites; table:29-34 compares conditions; 42-48 walks the same policy across environments; 62-102 gives manifest, command, PASS/FAIL output and limits; 108-113 questions have answers. No attempt to force all attack work into local labs.
- Chinese/English identities, owner policy, file links, command names, output text, three controls and four practice questions agree. Relevant tags and guide frontmatter coherent; article maps and table evidence are adequate without adding a redundant diagram.
- Overview Chinese:111/142 and English:110/141 link order 2/3 in the correct language; identity Chinese/English:146/150 link order 2 and describe only navigation updates. Original factual paragraphs were not reverified in this scoped navigation review.

### Suggested improvement

- Resolved: Order 3:94-100 now gives concrete automation=forbidden / mode=automated edits, expected FAIL and exit 1 in both languages. Independently executed that edited temporary manifest and reproduced exact output with returncode 1. Final prose says to align the mode with real rules rather than changing permission merely to pass.

## post-polish

Read both Chinese articles start-to-finish, including paragraph transitions and code/table references. Read English for equivalent conditions and natural prose. Order 2 advances hypothesis → evidence → run → false positives → report → exercise; order 3 advances question → environment differences → portability → scope → record → check → exercise. No dangling unnamed case after fixes.

Ran register-scan and phrase ledger on both Chinese drafts: order 2 2 long sentences/26 prose paragraphs; order 3 4/29. Ledger zero hits; no generic-English term pileup or repeated template contrasts. Numeric-density hits are concrete ticket identifiers needed for the exercise and should stay. The examples directly address developer work (tickets, API integration, deployment gateway) without inventing a Taiwan-specific incident. Remaining longer diagnostic sentences are readable; splitting error types into short sentences is optional.

## Remaining verification boundaries

Parent must run final repository gate and link checker after final changes, and ensure only text/source assets ship (no public Python bytecode). No full application, deployed HTTP target, browser rendering, external platform execution, model call or real target was tested by this reviewer. Approval covers the bounded draft/example content, not publication/deployment.

下一步（未完成前不能 commit）：post-review、post-polish。Both review layers above have been executed; parent still owns final mechanical gates.
