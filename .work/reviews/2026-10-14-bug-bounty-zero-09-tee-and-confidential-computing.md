# CI recovery review: 2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing

Review date: 2026-10-16. Scope: this repair, both language versions, curriculum order 11. This replaces the unsupported broad “all claims confirmed” implication in older differently named review stubs; it does not certify a fresh full fact-check of every retained historical claim.

## post-verify

Retained documented TEE boundaries, audit exclusions and firmware limits. Removed speculative pricing explanations; audit coverage was not expanded beyond its cited scope.

Mechanical evidence: full pnpm verify passed on final article sources; references/schema/series/language checks passed. Source evidence for changed supplier claims is in `../ci-fix-20261015/source-evidence.md`. Original research boundaries are preserved in that directory's AI/process-leak evidence notes. External source retrieval and local experiment scope are distinct.

## post-review

Topic/path and language pairing checked in `../ci-fix-20261015/reviews/structure.md`; final bilingual review of rewritten entry/tutorial pairs in `../ci-fix-20261015/reviews/language.md`. Canonical series is0–14, with22 duplicate entry redirects;26 existing article dates unchanged. Article is substantive, not an empty heading scaffold. Both language pages rendered successfully from the production build in the local static-browser check. Actual Worker redirects require preview/runtime evidence, not a file check.

Reverse heading outline of the reviewed Chinese version:

- 先講定義：TEE 與機密運算
- 遠端證明：出示一張可驗證的「房間裡跑的是哪份程式」
- WhatsApp 為什麼用它
- 獎金表每一列，對應哪個環節
- 外部審查實際找到什麼
- TEE 不是萬能
- 讀完你應該能說出
- 下一步
- 參考資料

## post-polish

Changed attribution/research-history paragraphs were rewritten with explicit scope boundaries; independent spot review is `../ci-fix-20261015/reviews/evidence-boundaries.md`. Unknown internals were not promoted to verified facts.

Code, source URLs, original dates and the strength of evidence limits are protected. Formatting checks do not establish pedagogical completeness or a live production release.

## Reviewed source hashes

- `src/content/posts/tech/2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing.md`: SHA256 `1baf4c13fe31f41b7770cd907b70b99eb236cc154d40fef120bc7602d458b2d8`
- `src/content/posts/tech/2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing-en.md`: SHA256 `965114e8f53633912e4665e9f0627847c3454723703e663d67bb2f17fc34feaa`
