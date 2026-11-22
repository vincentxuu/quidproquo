產出 Pydantic AI v2.70.0 框架更新文章（中英雙版），主因是兩個 high severity ReDoS 安全公告（GHSA-m4cr-m4qc-9hh3、GHSA-5m5q-5qj4-gx9h）。

- 掃過 watchlist B2 全部框架（langgraph、crewAI、MCP spec、mastra、agno、composio、haystack、dspy、smolagents、llama_index、temporal、inngest、ag2、autogen），只有 pydantic-ai v2.70.0 落在過去 24 小時窗口內且值得寫；agno v3.2.1、pydantic-ai v2.69.0 已在前一天的 routine 寫過，crewAI 1.15.42／mastra 批量版號無足夠事件性，composio 為 beta 跳過。
- 工具鏈：`gh api` 對外部 repo 回 403（GitHub 存取範圍限定在 vincentxuu/quidproquo、lanefoundry/gatelane），改用 Groundlane `web_fetch` 抓 GitHub releases.atom／release tag 頁／`api.github.com` 取代，未記錄其他 toolDegradation。
- diagram-preview 未跑：無瀏覽器（`/opt/pw-browsers` 缺 chrome-headless-shell），check:diagram-geometry 已過。
