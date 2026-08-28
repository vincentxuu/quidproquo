# Claude Code DevContainer Sandboxing Review - 2026-08-29

## 判定

可進下一輪上線準備，但仍保持 `draft: true`。本輪修掉 publish-blocking drift：官方 sandbox environments 現在列出六種方案，不是五種；`--dangerously-skip-permissions` 是硬性隔離要求，auto mode 則是建議加防禦縱深，不能寫成同一個強度。

## 修改

- 中文與英文 title / tldr / description：從 five / 五種改為 six / 六種，補上 Claude Code on the web。
- tags：移除泛用 `security`，保留更精準的 `claude-code`、`sandboxing`、`ai-agent`，並讓中英 frontmatter 一致。
- 比較表：新增 Claude Code on the web，並把分界敘述改為「前兩列 vs 後四列」。
- 選型段落：拆開 `--dangerously-skip-permissions` 與 auto mode 的建議，避免把 auto mode 說成官方硬性要求。
- on-the-web 段落：補清楚 `--cloud` 在沒有 GitHub 連線時可打包上傳本機 repository，但不能自行 push 回 remote。
- 參考資料：補 `devcontainer` 與 `claude-code-on-the-web` 官方頁，讓內文新主張有來源。

## Groundlane sources

- `mcp__groundlane__web_fetch` https://code.claude.com/docs/en/sandboxing.md
- `mcp__groundlane__web_fetch` https://code.claude.com/docs/en/sandbox-environments.md
- `mcp__groundlane__web_fetch` https://code.claude.com/docs/en/devcontainer
- `mcp__groundlane__web_fetch` https://code.claude.com/docs/en/claude-code-on-the-web

## 驗證結果

- PASS: `pnpm check:references src/content/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing-en.md` - checked 2 post files, no reference issues found.
- PASS: `pnpm check:tw src/content/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing.md` - 0 blocking, 0 to review.
- PASS: `node scripts/check-lang-parity.mjs` - checked 1428 zh/en pairs, no parity issues found.
- PASS: `pnpm check:post-quality src/content/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing-en.md` - checked 2 post files, no quality issues found.
- PASS: `pnpm check:links src/content/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing-en.md` - no broken external links among 4 checked.

## 殘餘風險

- 官方 Claude Code 文件仍在快速變動；本輪只複查 sandboxing、sandbox environments、devcontainer、on-the-web 四頁，未重跑整套 Claude Code 系列來源。
- 兩篇文章仍是 draft，未翻成 `draft: false`。
