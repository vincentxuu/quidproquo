---
title: "AI Agent GitHub Digest — 2026-08-28"
date: 2026-08-28
category: daily
tags: [ai-agent, github, open-source, daily, agent-memory, agent-runtime]
lang: zh-TW
description: "Agent 的「記憶層」今天集體補位——claude-mem 和 OpenViking 從兩個方向解決 agent 忘記脈絡的問題，Apache 基金會也第一次收編了一個 agent 執行紀錄專案"
tldr: "thedotmack/claude-mem 用壓縮記憶讓 context 跨 session 存活，總星數破 9 萬；volcengine/OpenViking 把記憶／RAG／skills 統一成用 viking:// 協定瀏覽的虛擬檔案系統，本週 +3,078 星；apache/maka 進 Apache Incubator，把 agent 執行過程做成可回放的 event-sourcing log；K-Dense-AI/scientific-agent-skills 讓 17.5 萬科學家用 163 個 skill 把通用 coding agent 變成領域專家。Haystack v3.1.0 加入 AgentTool 支援多 agent 委派。"
series:
  name: "AI Agent GitHub Digest"
  order: 13
---

## 今日亮點

今天最大的主題是 agent 的「記憶/context」基礎設施在補位——claude-mem 和 OpenViking 都在解決同一個痛點（agent 一 compact context 就忘記自己在幹嘛），一個做成跨工具的記憶外掛，一個做成獨立的 context 資料庫；與此同時 Apache 軟體基金會第一次收編了一個 agent 執行紀錄專案（apache/maka），把這層基礎設施拉進了孵化出 Kafka、Spark 的同一套治理機制。

## Trending Repos

### thedotmack/claude-mem ⭐ 92,171

[GitHub](https://github.com/thedotmack/claude-mem)　·　TypeScript　·　Apache-2.0

- **是什麼**：一個幫 Claude Code、Codex、Gemini CLI 等各種 coding agent 做「跨 session 記憶」的外掛，session 結束時自動把工具呼叫和對話壓縮成語意摘要存進本地資料庫，下次啟動再注入回 context。
- **為什麼值得看**：agent CLI 工具本身沒有長期記憶——每次重開終端機、每次 context 被 compact，之前建立的專案認知就沒了。claude-mem 直接在 hook 層解決這個問題，不用換掉底層 agent，而且同時支援 Claude Code、OpenClaw、Codex、Gemini、Hermes、Copilot、OpenCode 等七、八種主流 CLI，等於把記憶做成一個跨工具的共用層。9 萬多星、8 千多 fork 說明這個痛點有多普遍。
- **tech stack**：TypeScript + ChromaDB 向量儲存 + SQLite
- **上手難度**：低——`npx claude-mem install` 一行指令裝到 Claude Code，OpenCode／Antigravity 等其他 CLI 也有對應安裝旗標。

---

### volcengine/OpenViking ⭐ 33,902（本週 +3,078）

[GitHub](https://github.com/volcengine/OpenViking)　·　Go + Rust + TypeScript　·　AGPL-3.0

- **是什麼**：字節跳動旗下 Volcengine 開源的「agent context 資料庫」，把記憶、知識庫（RAG）、skills 全部收進一個叫 `viking://` 的虛擬檔案系統，讓 agent 用 `ls`、`tree`、`find` 瀏覽自己的上下文，而不是查一個黑盒向量庫。
- **為什麼值得看**：多數 agent 記憶方案（embedding + 向量檢索）對 agent 本身是不透明的——它只能拿到檢索結果，看不到記憶怎麼組織。OpenViking 把記憶結構顯式化成檔案樹，agent 可以像操作檔案系統一樣主動探索、整理自己的上下文，跟近期 agent harness 圈子在推的「filesystem as context」思路同方向，但 OpenViking 做成了獨立於任何單一 harness 的基礎設施層。本週 +3,078 星，成長速度在同類項目裡數一數二。
- **tech stack**：Go + Rust 核心 + Python/TypeScript SDK
- **上手難度**：中——需要自己起一個 context database 服務，目前主要文件是中文，英文/日文文件還在補。

---

### apache/maka ⭐ 2,552（Apache Incubator 收編後穩定成長）

[GitHub](https://github.com/apache/maka)　·　TypeScript + Rust　·　Apache-2.0

- **是什麼**：8/13 剛進 Apache Incubator 的本地優先 agent workspace，把每一次 model 訊息、工具呼叫、工具結果、權限決策都寫成 append-only log，用 event sourcing 的方式讓整個 agent 執行過程可回放、可稽核。
- **為什麼值得看**：這是第一個進 Apache 基金會孵化器的 agent runtime 專案——過去這類「agent 執行紀錄」的基礎設施都活在個人 repo 或新創公司裡，Maka 把它拉進了孵化出 Kafka、Spark、Airflow 的同一套治理機制。核心設計是「模型的記憶可以是有損的（context 會被 compact），但 workspace 的記錄不能是有損的」——可以搜尋、重試、從 log 的任意一點分岔出新的 session，精確稽核是哪個權限決策放行了哪次工具呼叫。
- **tech stack**：TypeScript + Rust（Electron 桌面殼 + Rust 沙箱邊界）+ SQLite
- **上手難度**：中——目前只有 macOS Apple Silicon 的公開桌面版本，資料格式和 CLI 指令都還在變動中。

---

### K-Dense-AI/scientific-agent-skills ⭐ 34,790（今日 +498）

[GitHub](https://github.com/K-Dense-AI/scientific-agent-skills)　·　Python　·　MIT

- **是什麼**：把 163 個「科學家常用工作流程」（跑生資分析、查藥物交互作用、算材料屬性）打包成標準 Agent Skills 格式，外加 100 多個科學資料庫的存取封裝，讓 Claude Code、Cursor、Codex 這類通用 coding agent 秒變領域專家。
- **為什麼值得看**：這是 Agent Skills 標準推出後，第一批做到「17.5 萬科學家在用」規模的垂直應用之一，證明 skills 這個機制不只是給工程師寫程式用的——只要把領域知識和工具呼叫封裝好，同一套 agent 就能直接跨到生物、化學、藥物開發等專業領域。對做科研工具鏈的團隊來說，這是「skills 怎麼設計才好用」的一個活教材。
- **tech stack**：Python + Agent Skills 標準（agentskills.io spec）
- **上手難度**：低——`pip install` 或直接把 skills 目錄丟進 Claude Code / Cursor 的 skills 資料夾即可。

## Notable Releases

### Haystack v3.1.0

[Release Notes](https://github.com/deepset-ai/haystack/releases/tag/v3.1.0)

- **重要變更**：新增 `AgentTool`，可以把一個 Haystack `Agent` 包成另一個 `Agent` 能呼叫的 `Tool`（只有最終回覆會被上層看到，中間步驟不會塞爆上層 context）；`Agent` 新增 `exit_reason` 輸出，明確回報是「文字回覆」「某個 tool 觸發退出條件」還是「撞到 max_agent_steps」；新增 `HAYSTACK_UNSAFE_DESERIALIZATION` 環境變數，可以一次關掉整個 process 的反序列化安全檢查。
- **Breaking Changes**：`exit_reason` 變成 `Agent` 的保留 state key，如果自訂的 `state_schema` 也用這個名字，初始化時會直接丟 `ValueError`；`agent.state_schema` 現在回傳的是傳進去的原始 schema，不再包含內部管理欄位，要讀完整 schema 得改用新的 `agent.resolved_state_schema`。
- **對你的影響**：如果 Pipeline 裡存了反序列化用的 custom_filters，升級後要嘛照舊在 `load` 時傳 `unsafe=True`，要嘛評估要不要開那個 process 等級的 `HAYSTACK_UNSAFE_DESERIALIZATION` 開關——後者一開，任何呼叫端傳進來的 tool/agent state 都會被無條件信任執行，等於把反序列化攻擊面從「載入時」擴大到「請求時」，官方 release note 自己也特別警告這一點。

---

### GitHub MCP Server 1.11.0

[Release Notes](https://github.com/github/github-mcp-server/releases/tag/v1.11.0)

- **重要變更**：OAuth 授權改成逐次呼叫檢查（per-call scope check），每個 tool 呼叫只跟 GitHub 要它實際需要的權限；修掉瀏覽器 OAuth 的 CORS 問題，且授權伺服器 URL 可自訂；新增「一次建立 parent issue + sub-issue」的 atomic 操作；STDIO 傳輸也支援 HTTP ETag 條件請求，減少重複資料傳輸。
- **Breaking Changes**：無，官方標記為功能與相容性強化，非破壞性變更。
- **對你的影響**：如果你的 agent 工作流裡有用 GitHub MCP Server 管 issue、PR，這版把「每個 tool 呼叫只拿到它需要的最小權限」做得更細，等於自動幫 agent 收斂攻擊面；用 STDIO 跑本機整合的人也能藉 ETag 快取省一點延遲。

## 今日收穫

之前以為 agent 記憶/context 這塊會一直是「各家自己接向量資料庫」的碎片化狀態，但今天 claude-mem 和 OpenViking 同時示範了兩種收斂路線——一個做成跨工具的記憶外掛，一個做成獨立於任何 harness 的 context 資料庫——說明這一層正在往「有自己的產品形態」的方向長，而不是永遠寄生在各家 agent 框架裡面當一個內部模組。

## 參考資料

- [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)
- [volcengine/OpenViking](https://github.com/volcengine/OpenViking)
- [apache/maka](https://github.com/apache/maka)
- [Apache Maka: Agent Infrastructure Grows Up — Clauday](https://clauday.com/article/e8ce3356-f853-47d0-b666-2fd2d0dfb313)
- [Apache Maka Project Incubation Status — Apache Incubator](https://incubator.apache.org/projects/maka.html)
- [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills)
- [Haystack v3.1.0 Release Notes](https://github.com/deepset-ai/haystack/releases/tag/v3.1.0)
- [GitHub MCP Server 1.11.0 Release Notes](https://github.com/github/github-mcp-server/releases/tag/v1.11.0)
