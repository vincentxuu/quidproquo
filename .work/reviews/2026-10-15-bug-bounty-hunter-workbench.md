# CI recovery review: 2026-10-15-bug-bounty-hunter-workbench

Review date: 2026-10-16. Scope: this repair, both language versions, curriculum order 3. This replaces the unsupported broad “all claims confirmed” implication in older differently named review stubs; it does not certify a fresh full fact-check of every retained historical claim.

## post-verify

Both article code blocks match the locally executed HTTP baseline. Sixteen cases cover Alice/Bob ownership, bad credentials, malformed JSON and non-reflecting JSON search. This is not an exploitable XSS lab.

Mechanical evidence: full pnpm verify passed on final article sources; references/schema/series/language checks passed. Source evidence for changed supplier claims is in `../ci-fix-20261015/source-evidence.md`. Original research boundaries are preserved in that directory's AI/process-leak evidence notes. External source retrieval and local experiment scope are distinct.

## post-review

Topic/path and language pairing checked in `../ci-fix-20261015/reviews/structure.md`; final bilingual review of rewritten entry/tutorial pairs in `../ci-fix-20261015/reviews/language.md`. Canonical series is0–14, with22 duplicate entry redirects;26 existing article dates unchanged. Article is substantive, not an empty heading scaffold. Both language pages rendered successfully from the production build in the local static-browser check. Actual Worker redirects require preview/runtime evidence, not a file check.

Reverse heading outline of the reviewed Chinese version:

- 從一個請求開始
- 建立可重複的本機基準
- 先用 curl 留下對照組
- 用 DevTools 抓瀏覽器真的送出的請求
- 用 Burp Repeater 改一個欄位
- 從觀察到漏洞證據，還差哪一步
- 自我檢查
- 更新紀錄
- 參考資料

## post-polish

Reviewed repaired topic progression, counterpart links and changed teaching claims; final staged process-leak check passed. This is a scoped recovery/readability review, not a claim of a new comprehensive line edit of every retained paragraph.

Code, source URLs, original dates and the strength of evidence limits are protected. Formatting checks do not establish pedagogical completeness or a live production release.

## Reviewed source hashes

- `src/content/posts/tech/2026-10-15-bug-bounty-hunter-workbench.md`: SHA256 `837fac93c44b7985a66172ba51bc014a773dfd4657ee139b5d82490252549d17`
- `src/content/posts/tech/2026-10-15-bug-bounty-hunter-workbench-en.md`: SHA256 `5009b548c6d1e872cfce3e70a9c9d7c7a97eafc4b76d20dd65b46b390ebb7e1c`
