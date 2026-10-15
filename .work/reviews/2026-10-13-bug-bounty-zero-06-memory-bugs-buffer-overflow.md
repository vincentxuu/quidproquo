# CI recovery review: 2026-10-13-bug-bounty-zero-06-memory-bugs-buffer-overflow

Review date: 2026-10-16. Scope: this repair, both language versions, curriculum order 8. This replaces the unsupported broad “all claims confirmed” implication in older differently named review stubs; it does not certify a fresh full fact-check of every retained historical claim.

## post-verify

Preserved tested-example descriptions and bounded ASan/fortify observations; removed unsupported causal speculation. This session did not rerun every historical compiler configuration.

Mechanical evidence: full pnpm verify passed on final article sources; references/schema/series/language checks passed. Source evidence for changed supplier claims is in `../ci-fix-20261015/source-evidence.md`. Original research boundaries are preserved in that directory's AI/process-leak evidence notes. External source retrieval and local experiment scope are distinct.

## post-review

Topic/path and language pairing checked in `../ci-fix-20261015/reviews/structure.md`; final bilingual review of rewritten entry/tutorial pairs in `../ci-fix-20261015/reviews/language.md`. Canonical series is0–14, with22 duplicate entry redirects;26 existing article dates unchanged. Article is substantive, not an empty heading scaffold. Both language pages rendered successfully from the production build in the local static-browser check. Actual Worker redirects require preview/runtime evidence, not a file check.

Reverse heading outline of the reviewed Chinese version:

- 緩衝區溢位是什麼
- 一支故意有漏洞的小程式
- 為什麼蓋到隔壁會危險
- 修法：限制長度
- 讀程式的練習：哪一行會溢位
- 現代系統怎麼補強
- 為什麼常見在 C 與 C++，Rust 改變了什麼
- 跟獎金表的關係
- 限制
- 你今晚可以做的事
- 參考資料

## post-polish

Changed attribution/research-history paragraphs were rewritten with explicit scope boundaries; independent spot review is `../ci-fix-20261015/reviews/evidence-boundaries.md`. Unknown internals were not promoted to verified facts.

Code, source URLs, original dates and the strength of evidence limits are protected. Formatting checks do not establish pedagogical completeness or a live production release.

## Reviewed source hashes

- `src/content/posts/tech/2026-10-13-bug-bounty-zero-06-memory-bugs-buffer-overflow.md`: SHA256 `07950946cf19a17288d948f6a188faacfc61af7b3ba9988dfb7624f67e90ec90`
- `src/content/posts/tech/2026-10-13-bug-bounty-zero-06-memory-bugs-buffer-overflow-en.md`: SHA256 `c8956d14bf98004d5f8f952b502067599383d888e121a0e2d1ab0cfe77d1568d`
