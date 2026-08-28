# Claude Code Troubleshooting Collection Review - 2026-08-29

## Verdict

可上線品質，但依任務要求保留 `draft: true`。

這篇是 `Claude Code 深入介紹` / `Claude Code Deep Dives` 的 order 36 index。它指向的三篇 troubleshooting 子文都存在，series order 分別為 33、34、35；本文維持 order 36。

## Changes

- 中文與英文 title / tldr / description：補上 order 33-35 的定位，讓這篇明確成為三篇 troubleshooting 子文的索引。
- 內文開頭：把「三篇專文」改成「系列第 33-35 篇」/ `series orders 33-35`。
- 三個條目：補上第 33、34、35 篇標示；中文條目對齊子文目前的中文標題，英文 order 34/35 對齊子文目前英文標題。
- tags：從過寬的 `[claude-code, troubleshooting, debugging, dx, skills, hooks, settings]` 收斂為 `[claude-code, troubleshooting, dx]`，避免 index 頁承擔子文才完整覆蓋的 tag。
- 更新紀錄：同步改成 collection split into orders 33-35。

## Validation

- PASS: `pnpm check:references src/content/posts/tech/2026-03-28-claude-code-troubleshooting-collection.md src/content/posts/tech/2026-03-28-claude-code-troubleshooting-collection-en.md` - checked 2 post files, no reference issues found.
- PASS: `pnpm check:tw src/content/posts/tech/2026-03-28-claude-code-troubleshooting-collection.md` - 1 zh-TW file, 0 blocking, 0 to review.
- PASS: `node scripts/check-lang-parity.mjs src/content/posts/tech/2026-03-28-claude-code-troubleshooting-collection.md src/content/posts/tech/2026-03-28-claude-code-troubleshooting-collection-en.md` - checked 1428 zh/en pairs, no parity issues found.
- PASS: `pnpm check:post-quality src/content/posts/tech/2026-03-28-claude-code-troubleshooting-collection.md src/content/posts/tech/2026-03-28-claude-code-troubleshooting-collection-en.md` - checked 2 post files, no quality issues found.
- PASS: `pnpm check:links src/content/posts/tech/2026-03-28-claude-code-troubleshooting-collection.md src/content/posts/tech/2026-03-28-claude-code-troubleshooting-collection-en.md` - no broken external links among 2 checked.

## Residual Risk

- `src/content/posts/tech/deep-dive/2026-08-26-claude-code-troubleshoot-install-en.md` currently has a Chinese frontmatter title even though `lang: en`; this is outside the allowed write scope, so the index keeps an English reader-facing label for order 33 and records the mismatch here.
- No web research was used. This review only checked local article links, frontmatter, series order, language parity, and focused validators.

## Sources

- none
