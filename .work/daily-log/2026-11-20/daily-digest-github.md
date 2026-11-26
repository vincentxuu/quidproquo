產出 GitHub Digest 中英雙語版：Agent Skills 開放標準單日爆紅（obra/superpowers +2,029★／cursor 官方外掛規格／HKUDS CLI-Anything／mvanhorn last30days-skill 四個 trending repo）+ Mastra／Claude Code 兩個 release。

- 圖解：無適合段落（本篇是新聞條列與版本更新，沒有結構可畫）。
- `gh api` 對 langgraph/crewAI 等框架 repo 與 `github.com` 直接 HTTPS（含 releases.atom）皆被 session 的 repo 範圍擋下（僅 vincentxuu/quidproquo、lanefoundry/gatelane 有權限；連 `curl https://github.com/...` 也回「sessions are bound to their configured repositories」）。改用 Firecrawl Alexandria 的 `github-com` provider（`repositories/latest_release`、`repositories/search_repos`、`repositories/repo`）查版本與 trending 候選；查到一半 Firecrawl 額度用盡（`alexandria_library_read` 回「out of credits」），依全域 fallback 鏈降級到 Groundlane `web_fetch`/`web_search` 完成剩餘查證（`toolDegradation: "firecrawl alexandria 額度用盡，改用 groundlane web_fetch/web_search"`）。
- 直接抓 `https://github.com/trending?since=daily`（Firecrawl scrape）比用 search API 猜候選更準——當天榜首確認是 Agent Skills 相關專案（superpowers/cursor-plugins/CLI-Anything/last30days-skill），star 數與今日漸增數都來自這個頁面並另找第三方報導（blockchain.news、skillleaderboard.com）交叉核對 obra/superpowers 的 32 萬星級規模，避免誤判成異常數字。
- `elementalsouls/Claude-BugHunter` 今天仍在 trending 且持續漸增，但昨天（2026-11-19）已完整介紹過，為避免重複只在排除清單記錄、不再寫進今天的 Trending Repos。
- `pnpm check:tw` 抓到一處：條目標籤用「技術棧」被判為非台灣慣用（建議改英文 Tech Stack），已全篇改成 **Tech Stack** 並通過；比對昨天的範例文章也是用英文標籤，屬一致慣例。
- diagram-preview 未跑：本篇無 diagram 區塊，不適用。
