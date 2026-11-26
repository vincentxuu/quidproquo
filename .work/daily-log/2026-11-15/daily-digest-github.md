產出 AI Agent GitHub Digest 2026-11-15（zh-TW + en）：4 個 trending repos（github/gh-aw、alibaba/open-code-review、openai/codex-security、deepseek-ai/dsh-superagent-prototype），今日無重要框架 release（watchlist 13 個 repo 都只有 patch 級更新或已在前幾日報導過）。

例外：
- `gh api` 對外部 repo 被這個 session 的 GitHub 範圍擋掉（403，只開放 vincentxuu/quidproquo、lanefoundry/gatelane），改用 Groundlane `web_fetch` 直打 `api.github.com` 取 release/repo metadata，`web_search` 做 trending 搜尋，未降級到更後面的 fallback。
- `diagram-preview.ts` 未跑：沙箱 `/opt/pw-browsers/` 只有 chromium-1243 / chromium_headless_shell-1243，但這次安裝的 `@playwright/test@1.58.2` 預設要找 `chromium_headless_shell-1208`，版本不對導致 launch 失敗；`pnpm check:diagram-geometry` 已過（0 錯誤），圖的座標是照 `matrix.md` 範例的既有排版公式算出來的。沒有動 `scripts/diagram-preview.ts`。
