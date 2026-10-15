# CI content repair — 2026-10-16

Base: origin/main 8a612398b345ec5c947e636cbc5bba91d7270891. Failing Deploy: 38740252979.

## Causes and repairs

- Invalid YAML title/date concatenation, duplicate frontmatter delimiter and mismatched quotation; invalid difficulty enums;13 blocking Taiwanese terminology occurrences.
-20 series order collision groups after new paths were added alongside existing memberships. Canonical30 posts now use original curriculum0–14, preserve26 legacy article dates, and retain new overview/workbench.22 duplicate URLs have redirects. Latest source snapshots retained at /tmp/quidproquo-ci-snapshot-20261015; Git base retains all original bodies.
- English placeholders and wrong-topic content repaired in synchronized overview/rules/website/XSS pairs. Technical chapters retain substantive source-backed teaching bodies rather than fabricated new Hyper-V CVEs/payouts.
- Five official-program reward comparison corrected to scoped category figures, not asserted universal income or combined Apple kernel/PCC conditions. See source-evidence.md.
- Four learning articles repaired for source coverage and actual teaching-writing scope. Certification map now matches0–14 and avoids unverified costs/eligibility/training assertions.
- Workbench is an HTTP/authorization baseline, not an XSS/IDOR exploit demonstration. Both article code blocks match local lab;16 cases cover login, Alice/Bob ownership, wrong passwords, malformed JSON/credential types and non-reflecting search.

## Independent reviews

- Final structural audit:30 topics/orders,26 preserved legacy dates,231 resolving internal links,22 redirect targets,4 learning identities. Report reviews/structure.md.
- Final bilingual semantic audit:7 canonical pairs (overview/rules/website/workbench/XSS/rewards/study route), code and conditional-claim fidelity. Report reviews/language.md.
- These are recovery-focused reviews. They do not certify that every retained historical claim in the entire series has been freshly verified.

## Validation

Validation results recorded after final source changes; remote PR checks and production release are separate.

- Final edited-article process-leak corrections preserve uncertain scope and archive original research/inference wording in ai-source-limits.md and process-leak-evidence.md; no exemption markers or checker changes.

- Final changed-paragraph evidence-boundary spot review: reviews/evidence-boundaries.md.
- Full `pnpm verify` on final article sources: PASS (/tmp/quidproquo-ci-final-verify.log).

- Final `pnpm build`: PASS;5650 OG images reused (/tmp/quidproquo-ci-final-build.log).
- Final content:ops, seo:freshness and seo:observe generation: PASS with report outputs under /tmp. Live GSC/GA4 fetch was not part of local verification.
- Local Worker extra QA blocked: Wrangler/esbuild child startup repeatedly fails with spawn EBADF under Node25 and Node22, with and without bundling. No project source/config was changed to bypass it. HTTP301/runtime rendering must be confirmed against the PR preview; do not present static mapping checks as runtime proof.
