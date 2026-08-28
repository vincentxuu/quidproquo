# Claude Code Deep Dives order 35 review - 2026-08-29

## Verdict

可上線品質：已達成，但兩篇仍保留 `draft: true`。

## Changes

- 修正中英文版 title / tldr / description，避免仍稱「四個診斷指令」。
- 補入 `/skills`、`/hooks`、`/permissions`、`/debug [issue]`、`/status` 的現行診斷分工。
- 更新 settings precedence：managed > command-line / `--settings` > project local > shared project > user，並補上環境變數要回 settings reference 確認。
- 修正 `~/.claude.json` wording：不是 settings file，但會保存登入 session、部分 MCP config、project trust decisions、global config keys。
- 更新 MCP troubleshooting：remote HTTP JSON entry 缺 `type` 的明確錯誤、workspace trust / approval 限制、`cached` / `Pending approval` / `Disabled` / `Failed` / `not configured` 狀態、0 tools 後的 reconnect 與 `claude --debug=mcp` 路徑。
- 更新 hook matcher drift：v2.1.191 後 comma separator 等同 `|`，舊版才會 literal mismatch；array matcher 對 user/project/local 與 managed settings 的處理不同。
- 更新 error wording：500 / 529 的 provider or gateway status wording、529 不等同 usage limit 且不計 quota、Prompt too long 的現行變體。

## Groundlane Sources

- `https://code.claude.com/docs/en/debug-your-config`
- `https://code.claude.com/docs/en/debug-your-config.md`
- `https://code.claude.com/docs/en/errors.md`
- `https://code.claude.com/docs/en/settings`
- `https://code.claude.com/docs/en/settings.md`
- `https://code.claude.com/docs/en/mcp`
- `https://code.claude.com/docs/en/mcp.md`

## Verification

- PASS: `pnpm check:references src/content/posts/tech/deep-dive/2026-08-26-claude-code-debug-config.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-debug-config-en.md` - checked 2 post files, no reference issues found.
- PASS: `pnpm check:tw src/content/posts/tech/deep-dive/2026-08-26-claude-code-debug-config.md` - checked 1 zh-TW post file, 0 blocking, 0 to review.
- BLOCKED OUTSIDE SCOPE: `node scripts/check-lang-parity.mjs` - failed on `src/content/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime.md` because changelog counts differ (zh 2 / en 1). The order 35 edited pair kept matching `date`, `series.order`, heading count, and changelog count, but the script has no file filter and checks all 1428 pairs.
- PASS WITH WARNINGS: `pnpm check:post-quality src/content/posts/tech/deep-dive/2026-08-26-claude-code-debug-config.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-debug-config-en.md` - no blocking errors; both files warn that tag `debugging` does not appear in title/body. Kept the tag because the post is explicitly about diagnostic debugging and the warning is non-blocking.
- PASS: `pnpm check:links src/content/posts/tech/deep-dive/2026-08-26-claude-code-debug-config.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-debug-config-en.md` - no broken external links among 4 checked.

## Residual Risk

- Claude Code docs are moving quickly and version-gated wording may drift again. The riskiest future drift areas are MCP cache/runtime status labels, hook matcher behavior, and error reference messages.
