---
title: "AI Agent GitHub Digest — 2026-10-10"
date: 2026-10-10
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, mcp-server]
lang: zh-TW
description: "今天 GitHub Trending 前五名有四個是 AI agent 相關的 skills／MCP 工具，單日星數衝到 2.6 萬到 28 萬不等；pydantic-ai 和 Claude Code 同日各出一個版本"
tldr: "**mattpocock/skills**（283,680★）是作者自己每天在用的工程 skills 集合，被收進 Claude Code 官方 plugin marketplace，可一行指令裝進 Codex／Copilot／Gemini CLI；**morluto/rea**（61,585★）讓 agent 接上 Ghidra／Hopper／IDA 去逆向分析原生程式、JS/Electron App 和網站；**cathrynlavery/diagram-design**（48,496★）是畫架構圖的 agent skill，44 種圖型全部輸出成一個自帶樣式的 HTML+SVG；**anthropics/knowledge-work-plugins**（28,593★）是 Anthropic 自己開源的 11 個職能 plugin，把 Slack／Notion／HubSpot 等連接器包進 Claude Cowork；**mksglu/context-mode**（26,062★）是解決「context 被工具輸出塞爆」的 MCP server。pydantic-ai v2.55.0 把 Python 版本下限拉到 3.11、新增 `Conversation` 物件；Claude Code v2.1.296 補了用自然語言寫的 hook 判斷邏輯。"
series:
  name: "AI Agent GitHub Digest"
  order: 56
---

> 🌏 [English version](/en/posts/daily/2026-10-10-ai-agent-github-digest-en)

## 今日亮點

今天的 GitHub Trending 前六名裡有四個是 AI agent 相關的 skills／MCP 工具，單日星數從 2.6 萬衝到 28 萬——不是同一個 repo 連續成長的結果，是五個各自獨立的 skill／plugin／MCP server 同一天一起衝上榜：裝 skill 給 agent 用的（mattpocock/skills）、用 skill 畫圖的（diagram-design）、用 skill 做逆向工程的（rea）、Anthropic 自己開源的職能 plugin（knowledge-work-plugins），加上一個專門解決「MCP 工具輸出塞爆 context」的 server（context-mode）。Agent Skills 已經不是單一框架的功能，而是長成一個有自己生態的分類。

## Trending Repos

### mattpocock/skills ⭐ 283,680

[GitHub](https://github.com/mattpocock/skills)　·　Shell　·　MIT

- **是什麼**：前 TypeScript 教學作者 Matt Pocock 把自己每天寫程式在用的 agent skills（不是 vibe coding 的那種，是真的拿來做工程判斷）整理成一個可安裝的集合，直接取自他自己的 `.agents` 目錄。
- **為什麼值得看**：這個 repo 已經被收進 Claude Code 官方 plugin marketplace（`claude plugin install mattpocock-skills@claude-plugins-official`），同時支援 Codex、GitHub Copilot、Gemini CLI 和其他任何能讀 Agent Skills 格式的工具，等於同一份 skill 定義一次寫、到處裝。作者特別強調跟 GSD、BMAD、Spec-Kit 這類「接管流程」的做法不同——這些 skill 刻意做小、可拆、可自己改，出事時好除錯。
- **Tech stack**：Markdown skill 定義 + Shell 安裝腳本，透過 `npx skills@latest add` 或各平台原生 plugin marketplace 安裝
- **上手難度**：低——`claude plugin install mattpocock-skills@claude-plugins-official` 一行裝完，會自動更新。

---

### morluto/rea ⭐ 61,585

[GitHub](https://github.com/morluto/rea)　·　TypeScript　·　MIT

- **是什麼**：讓 agent 透過 MCP 連上 Hopper、Ghidra、IDA 等逆向工程引擎，不用先讀原始碼就能分析原生執行檔、JavaScript/Electron App、.NET assembly 和網站，說明某個功能在底層怎麼運作、附上判斷依據，再幫你照著做一份類似的功能。
- **為什麼值得看**：過去「拿 agent 做逆向工程」要自己兜 Ghidra headless script 或手動貼 disassembly 進對話視窗，rea 把整套流程包成 agent 可以直接呼叫的 MCP 工具，而且明確標出哪些結論是實測、哪些只是推測。對想做競品分析（「這個功能怎麼做的，幫我做一個類似的」）或 CTF 的場景特別直接。
- **Tech stack**：TypeScript MCP server + 本機逆向引擎橋接（Hopper／Ghidra／IDA，皆需另外安裝）
- **上手難度**：中——`npx rea-agents setup` 會自動幫 Claude Code／Codex／Cursor／Gemini CLI 等裝好 MCP 設定，但原生分析仍需要先裝好對應的逆向工程軟體。

---

### cathrynlavery/diagram-design ⭐ 48,496

[GitHub](https://github.com/cathrynlavery/diagram-design)　·　HTML　·　MIT

- **是什麼**：給 Claude Code、Codex、GitHub Copilot 等 agent 用的畫圖 skill，涵蓋 44 種圖型（架構圖、象限圖、時序圖等），全部輸出成一個自帶樣式、不用額外套件就能打開的 HTML+SVG 檔案。
- **為什麼值得看**：多數 agent 畫圖預設吐 Mermaid，排版死板、配色單調；這個 skill 把排版規則寫進 skill 定義裡，讓 agent 自己決定圖型、照設計規則排版，還能抓你網站的字體和色票讓每張圖風格一致。作者特別標註「官方發布只來自這個 repo」，避免被冒名的 plugin 收錄誤導。
- **Tech stack**：Agent Skill（SKILL.md + references/assets/scripts）+ 純 HTML/SVG 輸出，無執行期依賴
- **上手難度**：低——`npx skills add cathrynlavery/diagram-design` 或 Claude Code 的 `/plugin marketplace add` 都能裝，裝完直接用白話描述想要的圖即可。

---

### anthropics/knowledge-work-plugins ⭐ 28,593

[GitHub](https://github.com/anthropics/knowledge-work-plugins)　·　Python　·　Apache-2.0

- **是什麼**：Anthropic 自己開源的 11 個職能 plugin（productivity、sales、customer-support、product-management、marketing、legal、finance 等），每個都包好對應角色常用的 skills、連接器、slash command 和 sub-agent，給 Claude Cowork 用，也能跑在 Claude Code 上。
- **為什麼值得看**：這是 Anthropic 第一次把「怎麼幫特定職能設計 plugin」的具體做法開源出來——sales plugin 接 HubSpot／Close／ZoomInfo 幫你查對手底牌，legal plugin 接 Box／Egnyte 幫你審合約，而且官方明講這些只是起點，真正威力要自己照公司的工具、用語、流程客製化才出來。對想自己動手做內部 plugin 的團隊，這 11 個是現成的參考範本。
- **Tech stack**：Claude plugin 格式（skills + connectors + slash commands + sub-agents），連接器含 Slack、Notion、HubSpot、Jira、Microsoft 365 等
- **上手難度**：低（安裝）／中（客製化）——直接裝就能用通用版本，但官方自己說要改成貴公司的流程才真正好用。

---

### mksglu/context-mode ⭐ 26,062

[GitHub](https://github.com/mksglu/context-mode)　·　TypeScript　·　Elastic License 2.0

- **是什麼**：一個 MCP server，專門解決「MCP 工具呼叫把原始資料整包塞進 context window」的問題——Sandbox 工具輸出（實測 98% 縮減）、把對話中的檔案編輯／git 操作／任務／錯誤記進 SQLite，context 被壓縮時不整包塞回去，改用 FTS5 全文檢索只撈需要的部分。
- **為什麼值得看**：切入點跟多數「agent 記憶體」工具不同——不是幫你記更多，而是先擋住不必要的資料進 context。作者還主張一個「用程式碼想」的模式：讓 agent 寫一段腳本去處理資料、只把 `console.log` 的結果吐回來，而不是把 50 個檔案整包讀進 context 去算，官方舉例一次操作從 700 KB 降到 3.6 KB。支援 17 個平台加 OpenClaw gateway。
- **Tech stack**：TypeScript MCP server + SQLite + FTS5 全文檢索
- **上手難度**：中——以 MCP server 方式註冊進 agent 設定，沙箱執行腳本需要額外的執行環境權限。

## Notable Releases

### pydantic-ai v2.55.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.55.0)

- **重要變更**：所有套件的 Python 版本下限拉到 3.11（3.10 的安裝會停在 2.54.0 不再更新）；新增 `Conversation` 物件讓多次 run 之間可以帶著、存取對話狀態；新增 prompt cache 診斷，OpenAI Responses 預設開啟、`anthropic_cache_diagnostics` 選擇性開啟；`FallbackModel` 每次失敗嘗試現在會連模型、耗時、錯誤和用量一起記下來。
- **Breaking Changes**：有——Python 3.10 的使用者安裝會卡在舊版；`FileUrl.media_type` 對沒有副檔名的 URL 改成序列化為 `null`（舊行為是直接丟錯誤）。
- **對你的影響**：還在用 Python 3.10 的話，這版起要自己釘住 `pydantic-ai==2.54.0` 否則裝不到新版；有用到 `FallbackModel` 或想追蹤 prompt cache 命中率的話，這版補的資訊值得升級去看。

---

### Claude Code v2.1.296

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.296)

- **重要變更**：修掉 managed settings 裡會擋掉工具呼叫的 `PreToolUse` hook（回傳 `"continue": false`）和會擋掉的 `prompt` hook，兩者修掉之前只擋了那次呼叫卻沒真正結束對話回合；修掉 managed settings 的 `PostToolUse` hook 在某些 session 不套用 `updatedMCPToolOutput` 的問題；新增 `allow_large` 選項給 Read tool，需要讀整份超大檔案時可以一次讀完。
- **Breaking Changes**：無
- **對你的影響**：如果你靠 managed settings 的 hook 擋危險操作，這版修的正是「擋了卻沒真正中止」這類洞，建議升級；偶爾要讀超大檔案全文的話，`allow_large` 省了手動分段讀的麻煩。

## 今日收穫

本來以為「agent skills」只是 Claude Code 自己的一個功能，今天五個各自獨立的 repo 同一天衝上 GitHub Trending 才意識到，skills 已經長成一個有自己生態的分類——有專門賣 skill 集合的（mattpocock）、有專門做單一垂直功能的 skill（diagram-design、rea），甚至連「context 被塞爆」這種 agent 跑久了才會碰到的問題，現在也有專門的 MCP server 在補（context-mode）。

## 參考資料

- [mattpocock/skills](https://github.com/mattpocock/skills)
- [morluto/rea](https://github.com/morluto/rea)
- [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design)
- [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins)
- [mksglu/context-mode](https://github.com/mksglu/context-mode)
- [pydantic-ai v2.55.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.55.0)
- [Claude Code v2.1.296 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.296)
