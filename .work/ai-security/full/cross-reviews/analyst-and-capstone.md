# Independent document/data review: analyst line and capstone

Reviewer: attack-line author, independent of orders 17–23. Date: 2026-10-22.

## Scope and method

Read the complete Chinese and English articles for orders 17–23, plus analyst-demo.py, analyst-truth.json, analyst-http-capture.py, ticket-lab.py and integrated-exercise.py. Also inspected existing synthetic fixtures, evaluation predictions, selftest output, HTTP trace/audit data and integration reports. After the parent's read-only instruction, no attack, exploit, HTTP capture, service, or application script was executed or imported. Only ordinary JSON loading, datetime sorting, arithmetic and existing-file SHA-256 comparisons were performed. No full-site gate was rerun. External-paper claims were checked for accurate qualification and linked provenance in the author's existing work; this review did not independently reread the linked papers and does not certify their full extraction.

## Initial required corrections (sent to parent and analyst author)

1. **Order 18: evidence already obtained vs required.** `src/content/posts/ai/2026-10-22-ai-security-patch-verification.md:29` labels the table 本次證據; rows 33–34 include scanner/new-alert/syntax and target HTTP evidence, while the article's executed companion provides a function matrix and a deliberately weak `if` proxy, not a real scanner or this article's deployment. English same issue at `...-en.md:29`. Change the column to required evidence and explicitly distinguish executed function tests from unexecuted scanner/deployment requirements. This is a claim framing correction; no scanner run is requested.
2. **Orders 20/22: positive-class definition vs C08.** `...-alert-triage.md:25` and `...-workflow-evaluation.md:25` define positives as malicious OR unauthorized attempts. C08 is an unauthorized request caused by a reproduced benign stale link but is labeled benign. State explicitly that independently verified benign accidental/client-defect requests are excluded from the positive class. Mirror the definition in English, truth-file provenance and any repeated exercise answer. Keep numerical labels unchanged if this is the intended task. Otherwise the confusion matrix measures a different class than its prose definition.

No canonical article or companion file was modified by this reviewer. Required fixes are pending author changes and readback as of this initial report.

## Per-article three-layer conclusions

### Order 17 — code review

- **post-verify:** Pass for internal consistency. Three users × three resources plus one missing ID = 12. Vulnerable permits all nine existing-resource reads: three legitimate plus three missing-ID results meet policy, hence 6/12. Tenant-only rejects four cross-tenant pairs but leaks Alice/N-2 and Bob/N-1, hence 10/12. Owner patch 12/12; deny-all loses three legitimate reads, hence 9/12. EXPECTED_ALLOW is fixed independently of tested implementations. Content comparison reuses synthetic TICKETS but is not an authorization oracle derived from the tested function. No model or CodeQL execution is claimed.
- **post-review:** Pass. Source-to-response walk, reachable counterexample, exact commands, matrix, F-17 handoff, deployment boundary, and exercise answers fulfill the title. Chinese and English preserve policy, counts, prerequisites and limits.
- **post-polish:** Pass by complete read. Concrete opening, natural questions, limited necessary identifiers. Tables convey the small comparison clearly; an additional diagram would duplicate them. No correction required.

### Order 18 — patch verification

- **post-verify:** Required framing correction 1. Matrix numbers, `or`/`and` explanation, independent allowlist, normal controls, unimplemented revocation extension and deployment limits otherwise align with source. No false model repair claim.
- **post-review:** Pass conditional on framing correction. All four candidate versions demonstrate partial fix, full policy fix and broken functionality. Missing cache/revocation coverage becomes a concrete next test, explicitly not completed.
- **post-polish:** Pass apart from evidence label. Chinese and English teach the same scope; no invented deployment success. Required correction should name what was executed without filling the text with process narration.

### Order 19 — incident timeline

- **post-verify:** Pass within the illustrated two-build run. Source timestamp `09:00:01+08:00` equals `01:00:01Z`; received_at `01:00:06Z` is five seconds later. Pure datetime sorting independently confirms E-001, E-002, E-003, E-004, E-005. Claim vs effect, one-ticket vs bulk disclosure, fixed denial vs historical recovery, and coverage-gap uncertainty are separated. HTTP and synthetic data are not conflated.
- **post-review:** Pass. Download set/commands match existing capture output, including 18 reads across two builds. Ordinary existing-output inspection confirms events and traces agree. The exercise distinguishes absence of evidence from complete negative evidence.
- **post-polish:** Pass. English follows the Chinese reasoning and field mapping. Optional improvement: add a unique capture/run identifier to target/build/event_id for multiple restarts of the SAME build. The illustrated distinct-build run is disambiguated already; current composite is insufficient as a universal multi-run key. Preserve this as an extension rather than claiming the small example handles every log topology.

### Order 20 — alert triage

- **post-verify:** Required class-definition correction 2. Existing prediction labels otherwise match the code: C01–03 positive; C04/C07 abstain; C05/C06/C08 benign. C07's author truth is withheld from the classifier. C08's separate trusted fixture is distinguished from attacker-supplied claims. Evidence IDs E-102/104/202–205 exist in triage_evidence(), distinct from the five timeline fixture events; no fake HTTP-origin claim.
- **post-review:** Pass conditional on class-definition correction. Clear alert contract, blocked attempts, abstention follow-up, shadow triage and closure criteria. C03 remains an intentionally conservative teaching escalation rule; the article explicitly requires real intent/mistake/testing adjudication in a SOC.
- **post-polish:** Pass. The repeated 403 contrast is supported by distinct scenarios. Two-language tables, commands, definitions and exercises agree, with the same semantic issue to correct in both.

### Order 21 — response permissions

- **post-verify:** Pass within explicitly trusted in-memory fixture scope. The six attempts correspond to role denial, missing approval, changed proposal, stale revision, applied state and replay denial. SHA-256 is correctly described as content binding without authentication. Fresh digest for the stale-revision test isolates that branch. Rollback is explicitly a plan, not an executed recovery. No identity-provider call, model call or real account disable is claimed.
- **post-review:** Pass. Roles, trusted approval provenance, proposal/state checks, consumption, actual-state verification and production migration are connected in one example. The article does not present the simulation as durable transactional authorization.
- **post-polish:** Pass. Necessary technical identifiers are explained. Chinese/English have the same six attempts, revision states and recovery limitation. No mandatory correction.

### Order 22 — workflow evaluation

- **post-verify:** Required class-definition correction 2. Independent recomputation directly from saved predictions and separate labels yields status-baseline TP2/FP2/TN2/FN2, cost 2×50+2×2=104, coverage 1 and accuracy 0.5; evidence-rules TP3/FP0/TN3/FN0 with one malicious and one benign abstention, coverage 6/8=0.75, conditional accuracy 6/6=1 and cost 2×5=10. Hypothetical review cost60 gives120 as stated. No AI effectiveness, actual human time, latency or fee measurement is claimed. Human follow-up correctness is an explicit assumption.
- **post-review:** Pass conditional on class-definition correction. No held-out set/generalization claim, clear truth/observation separation, abstention denominator, citation-quality check and product-matched evaluation design. The observational SOC study is not described as proving causal safety gains.
- **post-polish:** Pass. Quantitative examples retain denominators and conditions in both languages. Reader can reconstruct calculations without following hidden code. No unnecessary prose deletion requested.

### Order 23 — integrated exercise

- **post-verify:** Pass for saved evidence and current code consistency, not a newly executed wire test. integrated-run-03's server and runner hashes both match current files. Historical run-02's runner hash differs, and run-01 predates hash fields; those are not current-code evidence. All three saved runs have 10 trace/audit actor-resource-status pairs internally consistent. Current run-03 matches the article's two unauthorized reads before, zero after, and three legitimate controls per build. Build-specific expected `passed:5` is correctly separated from product safety. Public demo credentials, local-only execution, no model call, untested cloud/SSH and whole-product limits are explicit.
- **post-review:** Pass. Downloads, command, expected output, artifacts, error handling, immutable new output directory and three exercises form a complete handoff. Source independent CASES and expected text support the acceptance contract. Current code compares served and disk audit, event identities, target/build, decisions and returned resource. No request correlation beyond single sequential run is asserted.
- **post-polish:** Pass. Chinese and English preserve exact counts, resource strings, artifact names, credentials limitation and migration options. The third exercise intentionally mentions three unexplained denials and its answer clarifies the actual two negative cases; consistent, though simplifying to two could reduce cognitive friction.

## Ordinary data inspection details

- No tested application function was used to derive expected outcomes during this review. Matrix arithmetic was reconstructed from the fixed policy and source.
- Evaluation was independently recalculated from existing prediction JSON against labels, without importing classify/evaluate.
- Synthetic timestamp order was calculated with datetime on saved JSON, without importing timeline.
- Existing integration traces and audits were zipped and compared as stored data. Current-file hashes match integrated-run-03. These checks establish data/code correspondence, not an independent runtime reproduction.
- The HTTP capture reader only checks statuses and absence of text on forbidden requests; unlike the integration runner it does not validate complete expected allowed text. Current saved traces do contain the right synthetic content. A more comprehensive capture oracle is an optional extension, not evidence of a failing current lesson.

## Attack-line saved state at read-only transition

Orders4–9 bilingual 12 files and two public companion files had been authored before the instruction to stop attack execution. Existing results are in `.work/ai-security/full/attack/test-results.json`, `checks.log` and mode/build JSON. The 12 pre-transition runs total 49 HTTP requests (surface2+2, hypotheses5+5, verify5+5, injection3+3, loop5+4, chain5+5); four guard cases were non-network tests. Source fetches, registry, claim map, writing gate and style scans are saved under full/attack. References check on the 12 posts reported 0 errors/0 warnings, TW 0 blocking/0 review, process-leak no output/exit0. Style scans completed; the scanner emitted truncated multibyte snippets, so capture used replacement decoding while complete article text was manually read. Minor sentences were shortened without losing content. Six formal author three-section review files were not yet written at the read-only transition, and independent review of those 12 articles is not certified here. Do not treat this state note as a full-site verify or completed publication.

## Readback status

Initial: two required editorial corrections sent. Await author changes, then reread only changed passages and their affected definitions. No new execution required to resolve either.

### Author correction readback — complete

Both required corrections were applied by the analyst author and independently read back in canonical Chinese/English files:

- Order18 now labels the table 所需證據 / Evidence required and explicitly states that only the function matrix ran, while full scanner and final-deliverable evidence remain acceptance requirements (`...patch-verification.md:29`, paragraph at35–36; same location in English).
- Order20 and22 define the positive class as malicious attempts including blocked ones, expressly excluding client mistakes proven benign by trusted reproduction/investigation. Order20's exercise now refers to the fixture's established attack scenario. The separate truth-file provenance and C03 reason were aligned. This resolves the C08 class contradiction without relabeling the numerical dataset.

Final document/data verdict for orders17–23: **pass within the stated synthetic/no-model scope**. No required correction remains from this review. Optional same-build run-ID hardening and capture-oracle improvements remain extensions, not blockers for the illustrated runs. This verdict does not certify external-paper full-text reading, fresh HTTP execution, model effectiveness, production/cloud acceptance, publication, or the global quality gate.
