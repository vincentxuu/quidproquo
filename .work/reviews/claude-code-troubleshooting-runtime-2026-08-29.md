# Claude Code troubleshooting runtime review - 2026-08-29

## 判定

可上線品質，維持 `draft: true`。本次只針對 order 34 兩語版本做最小修正，保留 frontmatter `date`、`category`、`lang`、`series`、`order`，未改 slug。

## 修改

- 對齊官方 troubleshooting 最新分類：runtime 問題由原本文章涵蓋的 CPU/memory、hang、auto-compaction、search，補上大型 Markdown 表格顯示/舊 session resume stall。
- 更新 `/heapdump` 說法：補 `<session-id>.heapsnapshot`、`<session-id>-diagnostics.json` 檔名、Linux 無 Desktop 時寫到 home、array buffers / unaccounted native memory / native memory snapshot 限制。
- 更新 `/doctor` 說法：session 內用 `/doctor`；`claude` 無法啟動時才在 shell 跑 `claude doctor` 做唯讀診斷。
- 擴充其他症狀路由表：新增下載中斷、login/OAuth/403/cloud provider credentials、model not found、request validation、process exited、auto mode/permission modes。
- 移除 `performance`、`debugging` tags，保留更精準的 `claude-code`、`troubleshooting`、`ripgrep`，消除 post-quality tag warning。
- 同步中英版 title、tldr、description、正文新增段落、參考資料與更新紀錄。

## Groundlane sources

- `mcp__groundlane__web_search`: `site:docs.anthropic.com/en/docs/claude-code troubleshooting high CPU memory heapdump auto compact thrashing ripgrep Claude Code`
- `mcp__groundlane__web_fetch`: https://docs.anthropic.com/en/docs/claude-code/troubleshooting
  - confirmed high CPU/memory sequence, `/heapdump` output names and Linux fallback, large table 200-row behavior, auto-compaction thrashing recovery, hangs, terminal GPU renderer note, search/ripgrep recovery, WSL search note, `/doctor` vs `claude doctor`, symptom routing table.
- `mcp__groundlane__web_fetch`: https://docs.anthropic.com/en/docs/claude-code/setup
  - confirmed ripgrep dependency, Alpine/musl runtime requirements, `USE_BUILTIN_RIPGREP=0`, and `claude doctor` as shell diagnostics.
- `mcp__groundlane__web_fetch`: https://code.claude.com/docs/en/terminal-config
  - confirmed `/terminal-setup` changes integrated terminal GPU acceleration to `"off"` for VS Code/Cursor/Devin Desktop and related terminal settings.
- `mcp__groundlane__web_search`: `Claude Code release notes v2.1.208 table 200 rows auto compact troubleshooting`
  - used only to locate drift around the 200-row table behavior; final article facts were grounded in official troubleshooting docs, not search snippets.

## 驗證結果

- `pnpm check:references src/content/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime-en.md` - PASS
- `pnpm check:tw src/content/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime.md` - PASS
- `node scripts/check-lang-parity.mjs` - PASS
- `pnpm check:post-quality src/content/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime-en.md` - PASS
- `pnpm check:links src/content/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-troubleshooting-runtime-en.md` - PASS, 6 external links checked

## 殘餘風險

- Official Error reference fetch exceeded Groundlane output limits, so routing rows that point to the Error reference were verified through the current troubleshooting routing table rather than fetching the full Error reference page.
- Claude Code docs are actively changing; before flipping `draft` to `false`, re-run Groundlane fetch on the official troubleshooting page and repeat focused checks.
