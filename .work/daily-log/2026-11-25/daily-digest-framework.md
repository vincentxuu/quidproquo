產出：框架更新《Pydantic AI v2.73.0》中英雙版，series order 74。

- 本次為 2026-11-26 補寫：2026-11-25 原 routine 成品因 Q-054 紅燈只留在已回收容器的暫存區而遺失，重新查證後補回。原預定 order 72 已被 11/26 的 v2.75.0 佔用（72 Pydantic AI、73 Mastra），改取 AI Framework Changelog 目前最大值 +1 = 74（系列 1–73 無空號）；`check:series-order` 已跑。
- 查證來源：GitHub release v2.73.0 頁面（標題日期 2026-11-23）；v2.72.0 的 release 頁 404，release notes 的 Full Changelog 為 v2.71.0...v2.73.0，故「前一版」寫 v2.71.0 並註明。內容只寫 v2.73.0 自己的變更，不含 v2.74.0／v2.75.0。
- Stars 21.3k 沿用站內 11/20、11/26 兩篇文章的 GitHub 頁面數字，未能即時重新查證（GitHub API 未回傳可用數值）。
- 「與其他框架的對比觀察」只對照站內 v2.71.0，查不到同日其他框架可對照資料，文中已註明未做橫向比較。
- 工具降級：gh CLI 與 github MCP 無權限讀 pydantic/pydantic-ai，改用 Groundlane web_fetch 讀 release 頁面。
- 圖解：無適合段落。
