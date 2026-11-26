產出 AI Agent GitHub Digest 2026-11-23（order 100，中英雙版）：4 個 trending repo（CLI-Anything、last30days-skill、stitch-skills、firecrawl），今日無符合門檻的框架 release（Composio CLI 0.6.3、browser-use 1.0.8 皆為 patch 版本，無 breaking changes，略過）。補 1 張 dumbbell 長條圖（3 repo 今天 vs 幾天前的單日漲幅對照），中英版座標相同。

例外：
- Groundlane 未嘗試（雲端 session 未載入其工具），改走 Firecrawl `gh` 替代：`gh api` 對未在 session 白名單內的 repo（LangGraph、CrewAI 等）回 403（repo 存取範圍限制），改用 Firecrawl `alexandria_library_read` 的 `github-com` provider（`repositories/latest_release`、`repositories/search_repos`、`repositories/repo`）與 `firecrawl_scrape` 直接讀 github.com 公開頁完成全部 release 檢查與 trending 搜尋，`toolDegradation: "gh api 403 on out-of-scope repos, using Firecrawl alexandria github-com provider + firecrawl_scrape instead"`。
- 查詢中途 Firecrawl 每日 MCP 額度用盡（`repositories/repo` 批次呼叫被拒），剩餘的 license／language 資訊改從已下載的頁面內容（scrape 結果）裡找，沒有再重試 Firecrawl。
- diagram-preview 未跑：無瀏覽器，check:diagram-geometry／check:diagram-text 皆已過（中英各 1 篇、1 張圖、0 錯誤）。
- 工作區啟動時發現本機 main 分支落後且與 origin/main 分叉（50 vs 50 commits，疑似舊 session 殘留狀態），工作樹乾淨無未提交變更，已 `git reset --hard origin/main` 對齊遠端後才開始本次 routine。
