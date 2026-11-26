產出兩篇框架更新（zh-TW + en）：Pydantic AI v2.75.0（order 72）、Mastra @mastra/core v1.86.0（order 73）。

- Step 3a 的 `gh api`／GitHub MCP 對 watchlist 12 個框架全部回 403（session 的 GitHub 權限 scope 只到 vincentxuu/quidproquo、lanefoundry/gatelane；`add_repo` 對這些 repo 只給得到匿名 git clone 讀權限，給不了 releases API）。改用 Groundlane `web_fetch` 直接抓各框架 `/releases` 頁面取代 Step 3a／3c，記錄 `toolDegradation: "gh api + github MCP 403，改用 Groundlane web_fetch 讀 releases 頁面"`。
- 12 個框架裡只有 Pydantic AI（v2.75.0，compatibility notes 收緊 workspace 檔案與 MCP 指令權限邊界）和 Mastra（@mastra/core@1.86.0，breaking changes + durable 實驗／Knowledge importer）在發布時間窗內且有 breaking changes 或重要新原語，其餘（LangGraph 1.2.24、CrewAI 1.15.45、Composio CLI beta、Haystack v3.5.0（已過窗）、DSPy 3.5.0（已過窗）、smolagents v1.26.0、LlamaIndex（monorepo security fix，已過窗）、MCP spec（draft，已過窗）、claude-code v2.1.332（非 B2 追蹤重點框架))判斷為 patch/非當日/非 agent 原語更新，不寫文。
- Mastra 的版本號不在 releases 頁標題上（顯示日期「November 25, 2026」），用 Groundlane `web_search` 查 npm／GitHub 比對確認實際 tag 為 `@mastra/core@1.86.0`（前一版 `@mastra/core@1.85.0`，2026-11-18）。
- 兩篇恰好同一天都在收緊「誰的話/身分算數」的權限邊界（Pydantic AI：指令權限；Mastra：Knowledge 工具呼叫身分），寫進「與其他框架的對比觀察」互相對照。
- Stars 用 Groundlane `web_search` 查 GitHub 頁面快取片段（Pydantic AI 21.3k、Mastra 29.8k）。
- 圖解：各補一張分類／前後對照圖（diagram skill 慣例），`diagram-preview.ts` 因容器內 Playwright 瀏覽器版本（chromium_headless_shell-1243）與專案釦定版本（1208）不符，用腳本自帶的 `--skip-if-no-browser` 優雅跳過，未手動視覺驗證渲染結果。
- 兩篇皆跑過 `check:references`（0 error）、`check:lang-parity`（OK）、`check:tw`／`check:series-order`（無新增 warning）、writing-phrase-ledger scan（乾淨）。
