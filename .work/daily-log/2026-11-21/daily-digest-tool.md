產出：工具推薦｜Memanto（開源 agent 記憶系統，今天上線 Memanto Cloud），中英雙版。

- 候選來源：gh search repos（24h 新建 MCP server repos，全部 1-15 stars 無亮點）+ Groundlane web_search（Product Hunt）。選中 Memanto（Product Hunt 今日上架 Memanto Cloud，GitHub 2.4k stars／743 forks，MIT）而非同批候選 agent-rollback（7 stars，README SEO 痕跡重）或 pocket-design-mcp（15 stars，太新）。
- gh api 對未在 session repo scope 內的第三方 repo 直接回 403（access not enabled），stars/license 改用 Groundlane web_fetch 讀 GitHub 頁面文字確認。
- diagram-preview 未跑：無瀏覽器（/opt/pw-browsers 缺 chrome-headless-shell），check:diagram-text 已過（0 error）。
- check:references / check:lang-parity / check:tw / check:series-order 均 0 blocking；emoji:fix 0 轉換、check:no-emoji 通過。
