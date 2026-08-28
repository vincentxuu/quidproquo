# Claude Code Dynamic Workflows Review - 2026-08-29

## 判定

可維持 draft:true 進入下一輪發布前排程。這次沒有發現結構性 publish-blocking issue；主要問題是官方文件未支撐的 availability/version 斷言，以及參考資料覆蓋不足。

## 修改

- 中文與英文版同步移除「v2.1.154 起內建、所有付費方案可用、Pro 要在 /config 開啟」這組未被目前官方 workflows 頁明確支撐的斷言，改成要求讀者檢查 Claude Code 版本、/config 與組織設定。
- 中文與英文版同步把 `/effort ultracode` 改成「支援的版本與模型上」可用，避免把版本門檻寫成無條件功能。
- 中文與英文版同步補上 dynamic workflows 與 prompt caching 的 inline official source links。
- 中文與英文版同步把官方判斷標準由長段原文直引改成轉述，降低引用負擔。
- 中文與英文版同步補足 References：workflows、Run agents in parallel、prompt caching，消除參考資料覆蓋警告。
- 中文與英文版同步修正 changelog，不再重複已移除的版本/方案宣稱。

## Groundlane Sources

- `web_fetch`: https://code.claude.com/docs/en/workflows
  - status: 200
  - used for: workflow definition, prompt triggers, `/effort ultracode`, approval/save flow, symlink behavior, limits, resume behavior, cost warning, size guideline, prompt-cache fan-out behavior.
- `web_fetch`: https://code.claude.com/docs/en/agents
  - status: 200
  - used for: official comparison across subagents, agent view, Agent Teams, and dynamic workflows.
- `web_fetch`: https://code.claude.com/docs/en/prompt-caching
  - status: 200
  - used for: prompt-cache background and cost framing.
- `web_search`: `site:code.claude.com/docs/en/workflows Claude Code v2.1.154 dynamic workflows paid plans Pro config`
  - status: provider unavailable
  - handling: did not fall back to legacy fetch, WebFetch, stealth_fetch, fetch_page, Playwright, or platform web browsing.

## 驗證結果

- `pnpm check:references src/content/posts/tech/deep-dive/2026-08-26-claude-code-dynamic-workflows.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-dynamic-workflows-en.md` - pass: OK, no reference issues found.
- `pnpm check:tw src/content/posts/tech/deep-dive/2026-08-26-claude-code-dynamic-workflows.md` - pass: 0 blocking, 0 to review.
- `node scripts/check-lang-parity.mjs` - pass: checked 1428 zh/en pairs, no parity issues found.
- `pnpm check:post-quality src/content/posts/tech/deep-dive/2026-08-26-claude-code-dynamic-workflows.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-dynamic-workflows-en.md` - pass: OK, no quality issues found.
- `pnpm check:links src/content/posts/tech/deep-dive/2026-08-26-claude-code-dynamic-workflows.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-dynamic-workflows-en.md` - pass: OK, no broken external links among 3 checked.

## 殘餘風險

- Dynamic workflows 是快速變動的 Claude Code 功能；版本門檻、plan availability、快捷鍵與 UI 文案仍可能在發布日前變動。正文已避免把未被目前官方頁支撐的方案可用性寫死。
- Groundlane search provider 本次不可用，因此沒有額外搜尋 changelog 或 release note；本輪只依成功抓取的官方 docs 頁修正。
