---
title: "AI Agent GitHub Digest — 2026-09-01"
date: 2026-09-01
category: daily
tags: [ai-agent, github, open-source, daily, mcp, agent-memory, self-hosted-agent, durable-execution]
lang: zh-TW
description: "自架個人 Agent 正在從玩具走向長期依賴——nanobot、CowAgent 主打小核心加長期記憶，conductor 和 context-mode 則從耐久執行與 context 管理補上基礎設施"
tldr: "HKUDS/nanobot 半年內衝上 4.7 萬星，示範「小核心＋多管道＋長期記憶」的自架個人 Agent；zhayujie/CowAgent（前身 chatgpt-on-wechat）用三層記憶架構和 Deep Dream 夜間蒸餾把老牌聊天機器人重生為完整 Agent Harness；conductor-oss/conductor 把耐久執行圖形引擎接上原生 MCP 工具呼叫，讓 agent 迴圈撐過當機或數週人工審核；mksglu/context-mode 直擊 MCP 工具呼叫塞爆 context window 的痛點，衝上 HN 第一。agno v3.0.4 是唯一達標的框架更新，把 KnowledgeManagementTools 的 ingest_path 改成預設關閉以堵安全缺口。"
series:
  name: "AI Agent GitHub Digest"
  order: 17
---

## 今日亮點

今天的關鍵字是「長時間運行的個人 Agent」正在從展示型專案走向長期依賴——nanobot 和 CowAgent 都主打「小核心、多聊天管道、長期記憶」的自架個人助理路線；而基礎設施端也在跟上：conductor 把耐久執行的圖形引擎接上原生 MCP 工具呼叫，讓 agent 的 think-act 迴圈撐過當機甚至等人審核數週，context-mode 則直接點出多數重度 MCP 使用者的共同痛點——工具呼叫把 context window 塞爆。

## Trending Repos

### HKUDS/nanobot ⭐ 47,574

[GitHub](https://github.com/HKUDS/nanobot)　·　Python　·　MIT

- **是什麼**：超輕量、自架的個人 AI Agent 框架，可跑在 WebUI、終端機或聊天 App 裡，把工具呼叫、長期記憶（Dream）、MCP 整合、模型路由、多 Agent 委派、排程自動化和 OpenAI 相容 API 全部塞進一個小而可讀的核心。
- **為什麼值得看**：2026 年 2 月才建立，半年內衝上 4.7 萬星，成長速度對一個「賣點是核心夠小而不是功能夠多」的框架來說相當罕見——它不是想取代 LangGraph、CrewAI 這類重型編排框架，而是瞄準想長期自架一個貼身助理、還要接進多個聊天平台的個人使用者。
- **Tech Stack**：Python 核心 + Bun 建置的 TUI/WebUI，OpenAI 相容 API，原生 MCP 整合，可替換 LLM 供應商
- **上手難度**：低——一行 curl 安裝腳本或 pip/uv 安裝，另有給非技術背景使用者的圖文指南

---

### conductor-oss/conductor ⭐ 32,152

[GitHub](https://github.com/conductor-oss/conductor)　·　Java　·　Apache-2.0

- **是什麼**：源自 Netflix 的開源耐久執行／事件驅動工作流引擎，現在明確把自己定位成 AI Agent 編排層，原生支援 LLM 任務和 MCP 工具呼叫（`LIST_MCP_TOOLS`、`CALL_MCP_TOOL`）。
- **為什麼值得看**：跟大多數程式碼優先的 agent 框架不同，conductor 把編排邏輯寫成一份版本化的 JSON 圖——agent 的「發現工具→LLM 推理→呼叫工具→重複」迴圈每一步都被持久化，可以在當機後恢復，甚至讓某一步暫停數週等人工審核，執行完再從原地繼續。對需要生產級耐久性、而不只是把 agent 迴圈放在記憶體裡跑的團隊是另一種思路。
- **Tech Stack**：Java 伺服器 + 多語言 worker（Java/Python/Go/JS/C#/Ruby/Rust），Redis／Postgres／MySQL 等 5 種持久化後端，內建 MCP 任務類型
- **上手難度**：中——`npm install -g @conductor-oss/conductor-cli && conductor server start` 一分鐘內就能跑起來，但正式環境要自己選持久化和訊息佇列後端

---

### mksglu/context-mode ⭐ 20,281

[GitHub](https://github.com/mksglu/context-mode)　·　TypeScript　·　ELv2

- **是什麼**：把 MCP 工具呼叫回傳的原始資料包進沙箱、並強制跨平台路由，防止 AI coding agent 的 context window 被工具輸出直接塞爆——官方舉例一次 Playwright snapshot 就要吃掉 56 KB。
- **為什麼值得看**：這是每個重度使用 MCP 的人都踩過的痛點——官方數據是跑 30 分鐘後 context 就少掉 40%，逼 agent 壓縮對話時連自己在改哪個檔案、待辦任務有哪些都會忘記。它衝上 Hacker News 第一名，而且透過 MCP + hooks 同時相容 17 種 agent 平台，定位是跟供應商無關的 context 管理層，而非單一工具的外掛。
- **Tech Stack**：TypeScript，npm 套件形式的 MCP server + hooks，相容 Claude Code／Cursor／Codex／Zed 等
- **上手難度**：低——npm 安裝成 MCP server／外掛即可

---

### zhayujie/CowAgent ⭐ 46,740

[GitHub](https://github.com/zhayujie/CowAgent)　·　Python　·　MIT

- **是什麼**：前身是 2022 年就存在的 chatgpt-on-wechat，現在改名重生為完整的「Agent Harness」——會規劃任務、執行工具與技能，並透過每晚的記憶／知識蒸餾自我進化，同時串接十幾個聊天管道（WeChat／Telegram／Slack／Discord 等）。
- **為什麼值得看**：作為最早一批「聊天機器人外殼」專案之一，CowAgent 這次升級加上了三層記憶架構（對話上下文→每日記憶→核心記憶）和一個叫「Deep Dream」的夜間蒸餾流程，還有技能市集，是觀察一個簡單外殼專案如何隨生態成熟長成完整 agent 基礎設施的活案例。
- **Tech Stack**：Python 核心，可替換 LLM 供應商（Claude／GPT／Gemini／DeepSeek／Qwen／GLM 等），原生 MCP 工具整合，另有 macOS／Windows 桌面客戶端
- **上手難度**：低——一行安裝腳本或 Docker compose，其餘設定都在 Web console 完成

## Notable Releases

### agno v3.0.4

[Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.0.4)

- **重要變更**：`KnowledgeManagementTools` 的建構參數改名，`ingest_path` 從預設開啟改成預設關閉——這個工具會讀取伺服器行程有權限讀的任何路徑，且在 `scope="shared"` 下讀進去的內容會變成該知識庫裡每個 agent 都能看到，所以現在要顯式註冊才會啟用；`agno.tools.knowledge_management` 的匯入路徑也搬到 `agno.tools.knowledge`。
- **Breaking Changes**：舊的 `enable_ingest` / `enable_remove` 參數不再被辨識，傳入會被忽略；舊的 `agno.tools.knowledge_management` 匯入路徑已移除（`FileGenerationTools` 的舊路徑仍保留相容 shim）。
- **對你的影響**：如果你在用 `KnowledgeManagementTools` 讓 agent 讀寫知識庫，升級後預設不再能讀取路徑，需要顯式加上 `ingest_path=True` 才會恢復原本行為——這是把「agent 可以讀伺服器任意路徑」這件事從預設行為改成刻意選擇的安全修正，建議直接升級而不是釘住舊版本。

## 今日收穫

之前以為「自架個人 Agent」多半是玩具型的示範專案，但 CowAgent 從 2022 年的 wechat bot 一路演化出三層記憶架構和每日蒸餾，加上 nanobot 半年內衝上 4.7 萬星，讓人意識到這條路線已經有真實使用者在長期依賴——「小核心＋長期記憶＋多管道」正在變成一種被驗證過的產品形態，而不只是週末專案。

## 參考資料

- [HKUDS/nanobot](https://github.com/HKUDS/nanobot)
- [nanobot README](https://raw.githubusercontent.com/HKUDS/nanobot/main/README.md)
- [conductor-oss/conductor](https://github.com/conductor-oss/conductor)
- [conductor README](https://raw.githubusercontent.com/conductor-oss/conductor/main/README.md)
- [mksglu/context-mode](https://github.com/mksglu/context-mode)
- [context-mode README](https://raw.githubusercontent.com/mksglu/context-mode/main/README.md)
- [zhayujie/CowAgent](https://github.com/zhayujie/CowAgent)
- [CowAgent README](https://raw.githubusercontent.com/zhayujie/CowAgent/master/README.md)
- [agno v3.0.4 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.0.4)
- [GitHub Trending — Daily](https://github.com/trending?since=daily)
