---
title: "AI Agent GitHub Digest — 2026-11-18"
date: 2026-11-18
category: daily
tags: [ai-agent, github, open-source, daily, mcp, agent-protocol, multi-agent]
lang: zh-TW
description: "AG-UI 協定凍結 1.0 規格；Google Research 把多 Agent 框架拿去寫論文；Pydantic AI 和 Agno 同日各出一版"
tldr: "AG-UI 1.0 規格正式凍結，TypeScript/Python/.NET SDK 全部從規格生成；Tencent LoopForge 把 10 種 coding agent CLI 包進自架審核流程；Google Research 的 PaperOrchestra 用多 Agent 寫投稿論文；Pydantic AI v2.69.0 和 Agno v3.2.1 同日發版。"
series:
  name: "AI Agent GitHub Digest"
  order: 95
---

> :globe: [English version](/posts/daily/2026-11-18-ai-agent-github-digest-en)

## 今日亮點

今天的 trending 榜不是比框架多寡，而是在補「協定與介面」這塊——AG-UI 把 Agent 跟前端溝通的方式訂成 1.0 正式規格，Tencent 的 LoopForge 把「跑 Agent + 人工核准」包成一套自架系統，Google Research 直接拿多 Agent 架構去寫論文；框架這邊 Pydantic AI 和 Agno 同一天各出一個版本，但方向不同：一個在收攏錯誤分類，一個在補可觀測性 API。

## Trending Repos

### ag-ui-protocol/ag-ui ★ 19,530 (+791)

[GitHub](https://github.com/ag-ui-protocol/ag-ui)　·　TypeScript（也有 Python、.NET SDK）　·　MIT

- **是什麼**：一個開放、事件驅動的協定，用一條雙向事件流取代 Agent 跟前端之間各自亂接的客製化邏輯——串流文字、中途呼叫工具、同步共享狀態、暫停等人介入、分派 subagent，全部走同一套事件格式。
- **為什麼值得看**：LangChain、CrewAI、Mastra、Google ADK、Microsoft Agent Framework、Pydantic AI 各自有自己的串流和狀態同步寫法，AG-UI 想當中間那層通用轉接頭。這星期剛把 1.0 規格凍結成 JSON Schema，TypeScript/Python/.NET SDK 都從規格自動生成，且 1.0 跟 0.x 雙向相容——算是從「實驗性協定」正式畢業。昨天介紹過的治理層專案 OpenBot，底層就是建在這個協定上。
- **Tech Stack**：事件驅動協定 + JSON Schema 規格 + TypeScript/Python/.NET SDK
- **上手難度**：低——`npx create-ag-ui-app@latest` 直接生一個接好前端框架的範例專案

---

### ChromeDevTools/chrome-devtools-mcp ★ 57,850 (+841)

[GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)　·　TypeScript　·　Apache-2.0

- **是什麼**：Google 官方做的 MCP server，讓 Claude、Cursor、Copilot 這類 coding agent 直接控制、檢查一個真實的 Chrome——不只是點擊操作，還能拉效能追蹤、分析 network request、看帶原始碼對照的 console 錯誤堆疊。
- **為什麼值得看**：這不是社群拼出來的瀏覽器自動化工具，是 Chrome DevTools 團隊自己維護，底層用 Puppeteer 跑動作並自動等結果。單日 +841 顆星、累積到 5.78 萬，說明「讓 Agent 直接用瀏覽器除錯」已經從 nice-to-have 變成標配功能。
- **Tech Stack**：MCP server + CLI + Puppeteer + Chrome DevTools Protocol
- **上手難度**：低——`npx chrome-devtools-mcp@latest` 掛進 Claude Code／Cursor 的 MCP 設定就能用

---

### Tencent/LoopForge ★ 2,533 (+1,020)

[GitHub](https://github.com/Tencent/LoopForge)　·　Go／TypeScript　·　MIT

- **是什麼**：Tencent 做的自架工作區，讓團隊用 CodeBuddy、Codex、Claude Code 等 coding agent CLI 交付程式——在聊天室跟 Main Bot 描述需求，它開一個 Docker 沙箱、checkout 你的 repo、把工作分給不同角色、最後開 PR；把跑熟的流程存成 SOP，之後同類需求就照同一套（含人工審核關卡）跑。
- **為什麼值得看**：市面上已經有不少「管理 Agent 工作」的介面，但 LoopForge 把角色、沙箱、檢查點、歷史紀錄整套包進自己架的基礎設施，不綁死單一 coding agent——CodeBuddy、Codex、Claude Code、Cursor CLI、Antigravity、Kimi Code 都能接上去跑。今天單日 +1,020 顆星，是今天漲最快的 Agent 相關專案之一。
- **Tech Stack**：Docker 沙箱 + CLI 編排 + 10 種 coding agent CLI 介接，MIT 授權
- **上手難度**：中——要先決定團隊用哪幾個 coding agent CLI，再把自架的 Docker 環境架起來

---

### google-research/paper-orchestra ★ 1,889 (+313)

[GitHub](https://github.com/google-research/paper-orchestra)　·　Python　·　Apache-2.0

- **是什麼**：Google Research 做的多 Agent 框架，專門把「寫研究論文」拆給一組分工 Agent 做——outline、文獻回顧、各小節寫作、內容修訂、畫圖，最後吐出一份能投稿的 LaTeX manuscript。
- **為什麼值得看**：跟泛用的「多 Agent 寫作框架」不同，這個直接針對學術論文的結構做垂直優化，包含自動搜尋排序文獻、生成概念圖和實驗圖。作者掛名 Google Cloud AI Research，但 repo 本身聲明「非官方 Google 產品」。對照這幾週「Agent 生態從通用框架走向垂直領域」的觀察，這是一個具體案例。
- **Tech Stack**：Python + LaTeX 自動化 + Semantic Scholar API，模型可選 Gemini／OpenAI
- **上手難度**：中——需要自備 LaTeX 模板和一組 raw materials（想法、實驗紀錄），訓練用資料集另外發布，不是開箱即跑

## Notable Releases

### Pydantic AI v2.69.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.69.0)

- **重要變更**：支援 Gemini 4 Hydrogen；把 `RequestInput` 併進 `HandleDeferredToolCalls`（handler 現在能接 resume token）；新增 `DetectLoops`，偵測串流中思考、文字、工具呼叫的迴圈；Groq 支援 `service_tier`。
- **Breaking Changes**：沒有程式碼層的硬斷裂，但把一大批模型 provider（Google、OpenAI、Cohere 的 embeddings／image generation）原本各自土炮的錯誤處理，重新歸類成更細的 `ModelAPIError`／`ModelHTTPError`／`ModelRateLimitError`／`ModelQuotaExceededError` 子類。
- **對你的影響**：如果你的程式碼是靠攔截特定錯誤訊息字串做分支判斷，而不是 catch 錯誤類別，這次把底層 API 錯誤重新歸類後，舊的字串比對可能會跟著失準，建議對照 release notes 的 Compatibility Notes 清單重新檢查。

---

### Agno v3.2.1

[Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.2.1)

- **重要變更**：新增 Session Compactions API（`GET /sessions/{session_id}/compactions`，列出每次壓縮替換了多少訊息、壓縮前後的 token 數）；新增 Company Files API，讓 Task 的檔案和共享筆記能透過 `GET /company/tasks/{task_id}/files`、`GET /company/notes` 讀取；`MCPTools.connect()` 現在回傳布林值表示連線是否成功。
- **Breaking Changes**：無——這次都是向下相容的功能新增，加上 Slack、Qdrant、SQLTools、ExaTools 等多個內建 tool 的邊界情況修正。
- **對你的影響**：如果你在用 Agno 的 Session 系統，新的 compactions API 可以直接拿來做「這次對話被壓縮掉多少內容」的可觀測性面板，不用自己另外記錄。

## 今日收穫

查 AG-UI 1.0 規格凍結的時間線才發現，過去幾天介紹過的 OpenBot 治理層、CopilotKit 生態，其實都是疊在同一個協定上長出來的應用層——協定先穩定下來，上面的「治理」「辦公室整合」「審核流程」才有辦法一個接一個冒出來。原來這幾週看到的不是零散的巧合，是同一層基礎設施成熟之後的連鎖反應。

## 參考資料

- [AG-UI Protocol - GitHub](https://github.com/ag-ui-protocol/ag-ui)
- [AG-UI 1.0 Changelog](https://docs.ag-ui.com/spec/1.0/changelog)
- [ChromeDevTools/chrome-devtools-mcp - GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Tencent/LoopForge - GitHub](https://github.com/Tencent/LoopForge)
- [google-research/paper-orchestra - GitHub](https://github.com/google-research/paper-orchestra)
- [Pydantic AI v2.69.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.69.0)
- [Agno v3.2.1 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.2.1)
