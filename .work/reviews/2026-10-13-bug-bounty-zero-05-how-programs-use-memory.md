# CI recovery review: 2026-10-13-bug-bounty-zero-05-how-programs-use-memory

Review date: 2026-10-16. Scope: this repair, both language versions, curriculum order 7. This replaces the unsupported broad “all claims confirmed” implication in older differently named review stubs; it does not certify a fresh full fact-check of every retained historical claim.

## post-verify

Preserved stack/heap teaching and code; added the report-to-memory bridge. No claim that every retained C example was rerun during this CI repair.

Mechanical evidence: full pnpm verify passed on final article sources; references/schema/series/language checks passed. Source evidence for changed supplier claims is in `../ci-fix-20261015/source-evidence.md`. Original research boundaries are preserved in that directory's AI/process-leak evidence notes. External source retrieval and local experiment scope are distinct.

## post-review

Topic/path and language pairing checked in `../ci-fix-20261015/reviews/structure.md`; final bilingual review of rewritten entry/tutorial pairs in `../ci-fix-20261015/reviews/language.md`. Canonical series is0–14, with22 duplicate entry redirects;26 existing article dates unchanged. Article is substantive, not an empty heading scaffold. Both language pages rendered successfully from the production build in the local static-browser check. Actual Worker redirects require preview/runtime evidence, not a file check.

Reverse heading outline of the reviewed Chinese version:

- 先建立三個比喻
- Stack 與 heap：兩種放資料的地方
- 返回位址：一張寫著「做完回哪一頁」的便條
- 動手：印出位址，看便條
- 自己驗證：返回位址真的是「呼叫指令的下一條」
- 為什麼每次跑位址都不一樣
- 限制
- 自我檢查
- 你現在可以做的一件事
- 參考資料

## post-polish

Reviewed repaired topic progression, counterpart links and changed teaching claims; final staged process-leak check passed. This is a scoped recovery/readability review, not a claim of a new comprehensive line edit of every retained paragraph.

Code, source URLs, original dates and the strength of evidence limits are protected. Formatting checks do not establish pedagogical completeness or a live production release.

## Reviewed source hashes

- `src/content/posts/tech/2026-10-13-bug-bounty-zero-05-how-programs-use-memory.md`: SHA256 `c0e55f9dc3b372122464380b30ccb350d915879504f65f3e654d239130421f8d`
- `src/content/posts/tech/2026-10-13-bug-bounty-zero-05-how-programs-use-memory-en.md`: SHA256 `f527640e602419f5a7997103f68026b9ee11f679c905542976d10e403d153e61`
