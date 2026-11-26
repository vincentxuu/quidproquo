產出 Pydantic AI v2.71.0 框架更新文章（中英雙版），系列 order 71。

- 掃描範圍：skill 清單 12 repos + watchlist 補的 temporal/inngest/ag2/autogen，共 16 個 GitHub repo，用 Groundlane `web_fetch` 讀 releases.atom（`gh`/`curl` 對這些第三方 public repo 回 403，環境把 GitHub API 存取限制在 add_repo 清單內，改走 Groundlane）。
- 過去 24 小時內有新 release 的：langgraph 1.2.23（純 bug fix，跳過）、crewAI 1.15.44（單一功能，跳過）、pydantic-ai v2.71.0（十幾個新 harness 原語＋一個 breaking rename，必寫）、claude-code v2.1.328（跳過，例行迭代）、composio 多個 beta CLI 版（跳過，例行）。agno/haystack/dspy/mastra/mcp spec 最新 release 都在 24 小時窗口外。
- 圖解：1 張樹狀分類圖（Harness 原語依預算/權限/工具情境分三類），中英各一張，check:diagram-geometry / check:diagram-text 皆過。
- diagram-preview 未跑：無瀏覽器（/opt/pw-browsers 缺 chrome-headless-shell），check:diagram-text 已過。
- targeted verify：check:references（新檔 0 warning）、check:lang-parity（OK）、check:tw（0 blocking）、check:series-order（0 blocking，無撞號）、check:diagram-text（0 錯誤）全過。
