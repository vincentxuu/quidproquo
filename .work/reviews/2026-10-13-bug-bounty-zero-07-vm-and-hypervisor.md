# CI recovery review: 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor

Review date: 2026-10-16. Scope: this repair, both language versions, curriculum order 9. This replaces the unsupported broad “all claims confirmed” implication in older differently named review stubs; it does not certify a fresh full fact-check of every retained historical claim.

## post-verify

Preserved virtualization mechanisms; clarified that displayed sandbox output does not identify the cloud provider or prove nested-virtualization availability. Provider internals remain unknown where not documented.

Mechanical evidence: full pnpm verify passed on final article sources; references/schema/series/language checks passed. Source evidence for changed supplier claims is in `../ci-fix-20261015/source-evidence.md`. Original research boundaries are preserved in that directory's AI/process-leak evidence notes. External source retrieval and local experiment scope are distinct.

## post-review

Topic/path and language pairing checked in `../ci-fix-20261015/reviews/structure.md`; final bilingual review of rewritten entry/tutorial pairs in `../ci-fix-20261015/reviews/language.md`. Canonical series is0–14, with22 duplicate entry redirects;26 existing article dates unchanged. Article is substantive, not an empty heading scaffold. Both language pages rendered successfully from the production build in the local static-browser check. Actual Worker redirects require preview/runtime evidence, not a file check.

Reverse heading outline of the reviewed Chinese version:

- 虛擬機與 hypervisor：定義
- CPU 的角色：Hyper-V 要求硬體輔助虛擬化
- 一棟大樓的比喻，與它的極限
- 巢狀虛擬化與 L1、L2
- 獎金表每一格對應哪一道牆
- 為什麼這個洞這麼貴
- 攻擊面的直覺：牆上有哪些門
- 在沙盒裡看一眼：我們自己就在虛擬環境裡
- 限制
- 下一步
- 參考資料

## post-polish

Changed attribution/research-history paragraphs were rewritten with explicit scope boundaries; independent spot review is `../ci-fix-20261015/reviews/evidence-boundaries.md`. Unknown internals were not promoted to verified facts.

Code, source URLs, original dates and the strength of evidence limits are protected. Formatting checks do not establish pedagogical completeness or a live production release.

## Reviewed source hashes

- `src/content/posts/tech/2026-10-13-bug-bounty-zero-07-vm-and-hypervisor.md`: SHA256 `d44789b9ad94b46502ab9eb7a01555fb0000b6e908577caea12ff5981cde2a81`
- `src/content/posts/tech/2026-10-13-bug-bounty-zero-07-vm-and-hypervisor-en.md`: SHA256 `96dbe95176e9edf44d7f6fc541080788bc52840398e00f7a8bc384a7797895ca`
