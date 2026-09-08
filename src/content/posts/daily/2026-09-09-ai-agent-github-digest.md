---
title: "AI Agent GitHub Digest — 2026-09-09"
date: 2026-09-09
category: daily
tags: [ai-agent, github, open-source, daily, mcp, agent-verification, agent-platform]
lang: zh-TW
description: "reverify 用確定性工具攔住 AI 的錯誤宣稱、bankmcp 讓 AI 讀你的銀行帳戶——今天的 GitHub trending 在幫 agent 補上「可信任」這塊"
tldr: "reverify 用二進位逆向工程的真實基準（97% 錯誤率全數攔下）證明確定性驗證比要求模型謹慎更有效；useAgent 把 Claude Code / Codex 包成雲端 AI 同事平台；bankmcp 讓 AI 透過 PSD2 唯讀讀取歐洲銀行帳戶；headcount 把 Claude Code skill 生態系拆成 16 個部門的公司架構；Pydantic AI 2.41 與 Agno 3.0.8 同日更新"
series:
  name: "AI Agent GitHub Digest"
  order: 25
---

## 今日亮點

今天的主軸是「可信任」——reverify 不靠叫模型更謹慎，而是用外部確定性工具攔截 AI 的錯誤宣稱；bankmcp 把銀行資料存取權限鎖在唯讀、自架的邊界內；headcount 則是把「skill 太多不知道該裝哪個」的問題，用部門邊界解決。三個專案分屬不同層次，但都在回答同一件事：agent 能力越強，越需要把「它說的是不是真的」「它能碰到什麼」「它現在該用哪個工具」這幾件事釘死。

## Trending Repos

### 2akouwu/reverify ⭐ 1,036

[GitHub](https://github.com/2akouwu/reverify)　·　Python　·　MIT

- **是什麼**：MCP server + CLI，把 AI 對程式碼或二進位檔案的「宣稱」丟給確定性工具驗證，只有通過驗證的內容才算數，模型自己說了不算。
- **為什麼值得看**：作者選了幻覺率最高的場景——二進位逆向工程——做基準測試：71 個真實 Windows 系統檔案，AI 教科書式回答的錯誤率高達 97%，reverify 全部攔下，且沒有誤放行過任何一個錯誤宣稱（同一套 CI 在 Linux、macOS、獨立 aarch64 環境重跑過）。另外附帶 `rollover` 功能，把長任務交接到檔案再開新 session，取代容易失真的自動摘要，相容 Claude Code、Codex、Gemini CLI、OpenCode。
- **tech stack**：Python + MCP SDK，PyPI 套件 `reverify`
- **上手難度**：低——`pip install reverify` 後接上既有的 MCP client 即可，逆向工程場景最對症，其他場景要自己定義驗證判準

---

### useagenthq/useagent ⭐ 283

[GitHub](https://github.com/useagenthq/useagent)　·　TypeScript　·　AGPL-3.0

- **是什麼**：開源「AI 同事」平台，把 Claude Code、Codex、OpenCode 包進雲端沙箱，讓 agent 有自己的雲端電腦、公司工具與情境，完工後直接交付成品（網站、簡報、PR），不只是丟一段文字答案。
- **為什麼值得看**：多數 agent 平台只解決「怎麼呼叫模型」，useAgent 解決的是「怎麼讓 agent 安全拿到公司資源」——事件溯源的 Postgres timeline 讓每次執行重開機後可還原、人機協作靠 approval card 卡住危險操作、Slack 原生整合讓團隊直接在既有頻道派工。目前仍是 alpha，但官方說已在跑真實日常任務。
- **tech stack**：Bun runtime + Postgres 事件溯源 timeline + Daytona / Cube 沙箱
- **上手難度**：中——需要自己架後端與沙箱環境，不是單指令跑起來的工具

---

### noskillish/bankmcp ⭐ 151

[GitHub](https://github.com/noskillish/bankmcp)　·　TypeScript　·　MIT

- **是什麼**：自架的唯讀 MCP server，透過 Enable Banking（涵蓋 2,700+ 家歐洲銀行的 PSD2 API）讓 AI 助理直接讀你的銀行帳戶餘額與交易紀錄。
- **為什麼值得看**：個人理財類 agent 工具常見的痛點是資料存取方式很粗暴——要嘛截圖讓 agent 用眼睛讀，要嘛把帳密丟給第三方服務代管。bankmcp 走標準 MCP + PSD2 授權，資料留在自己主機、不存 balance/transaction、不送 telemetry，agent 端只拿到讀權限，動不了錢。代價是目前限歐洲銀行，受限於 Enable Banking 的覆蓋範圍。
- **tech stack**：Node.js 24+ · npm 套件 `bankmcp` · Enable Banking PSD2 API
- **上手難度**：中——需要先在 Enable Banking 註冊應用，並過一次 OAuth 銀行授權流程

---

### cbrock84/headcount ⭐ 1,323

[GitHub](https://github.com/cbrock84/headcount)　·　Markdown　·　MIT

- **是什麼**：把 Claude Code 的 skill 生態系包成一間「公司」——16 個部門、172 個 skill，每個部門都是可獨立安裝的 plugin。
- **為什麼值得看**：一般做法是把所有 skill 塞進同一包，專案越大越難分辨哪個 skill 該觸發。headcount 用部門邊界解決這件事——`department:skill` 命名避免撞名，一個問題丟出去只有相關部門的 skill 會被喚起。對想把 Claude Code 用到整個團隊（法務、財務、資安）而不只是工程部門的組織，是個現成骨架可以參考或直接裝。
- **tech stack**：純 Markdown skill 定義 + Claude Code plugin marketplace 機制
- **上手難度**：低——`/plugin marketplace add cbrock84/headcount` 一行裝好，按部門選裝

## Notable Releases

### Pydantic AI v2.41.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.41.0)

- **重要變更**：新增 `openai-codex` provider，可用 ChatGPT/Codex 訂閱直接驗證，不用另外申請 API key；新增 `ImageGenerator` 直接圖片生成 API；Anthropic 原生 web search 的用量現在會正確出現在 `RequestUsage.details` 並被計入 `cost`
- **Breaking Changes**：`ImageGeneration` 和 `XSearch` 上的 `fallback_model` 參數被棄用，改用 `fallback_subagent_model`（舊參數仍可用，但下個大版本會移除）
- **對你的影響**：如果你在用 pydantic-ai 呼叫 Anthropic 原生網頁搜尋，升級後成本計算會更準；用到 `fallback_model` 的地方建議提早改參數名，避免之後被移除

---

### Agno v3.0.8

[Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.0.8)

- **重要變更**：新增 `Knowledge.read_full_page` / `aread_full_page`，用單次有界 SQL 讀取拿回整頁內容並支援版本鎖定；新增 `create_postgres_engine` / `create_async_postgres_engine`，把連線池與 JSON 序列化預設值包成共用工廠函式
- **Breaking Changes**：無
- **對你的影響**：如果你在用 Agno 的 Knowledge base 讀長文件，升級後可以用有界讀取取代自己手刻的分頁邏輯；PostgreSQL 使用者可以少寫一些連線池樣板程式碼

## 今日收穫

之前以為 agent 工具的可信度問題主要卡在模型本身的幻覺率，今天看 reverify 的基準測試才意識到，把「驗證」做成獨立於模型之外的確定性層，才是真正把幻覺攔下來的方法——模型負責提案，工具負責蓋章，兩者分開執行，比單純要求模型「回答前再想一下」有效得多。

## 參考資料

- [2akouwu/reverify — GitHub](https://github.com/2akouwu/reverify)
- [useagenthq/useagent — GitHub](https://github.com/useagenthq/useagent)
- [noskillish/bankmcp — GitHub](https://github.com/noskillish/bankmcp)
- [cbrock84/headcount — GitHub](https://github.com/cbrock84/headcount)
- [Pydantic AI v2.41.0 — Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.41.0)
- [Agno v3.0.8 — Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.0.8)
