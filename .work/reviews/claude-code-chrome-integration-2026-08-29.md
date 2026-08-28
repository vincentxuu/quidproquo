# Claude Code Chrome Integration Review - 2026-08-29

## 判定

可上線品質，但依任務要求保留 `draft: true`。主要 publish-blocking issue 是瀏覽器支援範圍用了舊 beta 語氣：文章寫「正式支援 Chrome/Edge，其他 Chromium 靠偵測」，但目前 Claude Code Chrome 文件已把 Chrome、Edge 與 Brave、Arc、Vivaldi、Opera 等 Chromium 系瀏覽器列為前置條件，並說多瀏覽器連線時可在 `/chrome` 選擇。

## 修改

- 中文與英文 `tldr`：改成官方前置條件列出 Chrome、Edge 與 Chromium 系瀏覽器，並保留 WSL 不支援。
- 中文與英文「瀏覽器偵測範圍 / Browser detection scope」段：移除「正式支援 Chrome/Edge、其他只靠偵測」的強度，補上多瀏覽器可用 `/chrome` 選擇。
- 中文與英文「限制 / Limitations」：同步改成 Chrome、Edge、其他 Chromium 系瀏覽器；Firefox、Safari、行動裝置瀏覽器與 WSL 不在範圍內。
- 中文與英文 tags：把正文未明確覆蓋的 `frontend`、`testing` 換成站內既有且正文有對應的 `mcp`、`devtools`。
- 參考資料：新增 Claude in Chrome permissions guide，讓權限與安全段落來源更完整。
- 更新紀錄：新增 2026-08-29 審稿修正紀錄。

## Groundlane Sources

- `mcp__groundlane__web_search`: `site:docs.anthropic.com Claude Code Chrome integration Claude in Chrome extension MCP claude-in-chrome`
- `mcp__groundlane__web_fetch`: `https://docs.anthropic.com/en/docs/claude-code/chrome`，最終 URL `https://code.claude.com/docs/en/chrome`
- `mcp__groundlane__web_fetch`: `https://code.claude.com/docs/en/chrome`
- `mcp__groundlane__web_fetch`: `https://support.claude.com/en/articles/12012173-getting-started-with-claude-in-chrome`
- `mcp__groundlane__web_fetch`: `https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn`
- `mcp__groundlane__web_search`: `Claude Code Chrome integration WSL not supported docs Anthropic`
- `mcp__groundlane__web_fetch`: `https://support.claude.com/en/articles/12902446-claude-in-chrome-permissions-guide`

## 驗證結果

- `pnpm check:references src/content/posts/tech/deep-dive/2026-03-28-claude-code-chrome-integration.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-chrome-integration-en.md`：OK，2 files，no reference issues。
- `pnpm check:tw src/content/posts/tech/deep-dive/2026-03-28-claude-code-chrome-integration.md`：OK，1 zh-TW file，0 blocking，0 to review。
- `node scripts/check-lang-parity.mjs src/content/posts/tech/deep-dive/2026-03-28-claude-code-chrome-integration.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-chrome-integration-en.md`：OK，checked 1428 zh/en pairs，no parity issues。
- `pnpm check:post-quality src/content/posts/tech/deep-dive/2026-03-28-claude-code-chrome-integration.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-chrome-integration-en.md`：OK，2 files，no quality issues。
- `pnpm check:links src/content/posts/tech/deep-dive/2026-03-28-claude-code-chrome-integration.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-chrome-integration-en.md`：OK，4 external links，no broken external links。

## 殘餘風險

- Groundlane 搜尋摘要同時回傳過舊 beta 說法與新版說法；本文以直接 fetch 的 `code.claude.com/docs/en/chrome` 正文為準。
- Chrome Web Store listing 的 general extension note 說其他 Chromium-based browsers 不支援；Claude Code 官方文件則列出 Brave、Arc、Vivaldi、Opera。本文只評論 Claude Code integration，因此以 Claude Code 文件為準。
