---
title: "AI Agent GitHub Digest — 2026-08-16"
date: 2026-08-16
category: daily
tags: [ai-agent, github, open-source, daily, agent-framework, multi-agent]
lang: zh-TW
description: "今天四個新面孔的 agent 框架不約而同拋棄『先編譯一張圖』的舊思路——Vercel、Prime Intellect、Hive、nanobot 都選擇把協調決策留到執行期才做"
tldr: "Vercel 推出 filesystem-first 的 TypeScript agent 框架 eve，深度綁定自家 AI Gateway/Sandboxes；Prime Intellect 的 Prime Agent 把整個對話 context 當程式變數，搭配可自我改寫的 Continual Harness；aden-hive 的 Hive 用『複製 Queen』取代預先編譯的執行圖；HKUDS 的 nanobot 靠 v0.3.0 Agency Release 半年內衝上 4.7 萬星。今日 watchlist 框架無重大版號更新。"
series:
  name: "AI Agent GitHub Digest"
  order: 1
---

## 今日亮點

今天四個新面孔的共通點是拒絕「先編譯一張執行圖」——Vercel 的 eve 把 agent 定義攤開成檔案系統，Prime Intellect 的 Prime Agent 把整段對話歷史當成可程式化的變數，aden-hive 的 Hive 用「複製 Queen」取代畫節點與邊，HKUDS 的 nanobot 則在 v0.3.0 讓 agent 學會在任務中途諮詢子 agent。這波共識隱約在說：圖是死的，協調結構應該留到執行期才決定。

## Trending Repos

### eve (vercel) ⭐ 4,647

[GitHub](https://github.com/vercel/eve)　·　TypeScript　·　Apache-2.0

- **是什麼**：filesystem-first 的 durable AI agent 框架，agent 的工具、技能、排程都是專案目錄底下的一般檔案（`agent/tools/*.ts`、`agent/agent.ts`），而不是藏在框架的設定物件裡。
- **為什麼值得看**：Vercel 這種規模的基礎設施公司親自下場做 agent 框架，還選了跟 Mastra 相近的「TypeScript 原生」路線，但用檔案系統取代 DSL 當 authoring interface；框架直接綁定 Vercel AI Gateway、Sandboxes、Workflows、Connect，等於把「agent 框架」和「agent 部署平台」焊在一起賣。
- **技術棧**：TypeScript + Vercel AI Gateway + Vercel Sandboxes + Workflows
- **上手難度**：低——`npx eve@latest init my-agent` 一行指令起手，但深度使用需要綁定完整 Vercel 技術棧。

---

### prime-agent (PrimeIntellect-ai) ⭐ 16,301

[GitHub](https://github.com/PrimeIntellect-ai/prime-agent)　·　Python　·　MIT

- **是什麼**：Prime Intellect（以分散式訓練、Prime-RL 聞名的團隊）推出的自我改進 coding agent，核心是 Recursive Language Model（RLM）+ Continual Harness 兩個抽象。
- **為什麼值得看**：多數 agent 框架把 tool-calling schema 寫死，Prime Agent 反其道而行，把整個對話 context 當成持久 IPython kernel 裡的「變數」，呼叫子 agent 變成普通的非同步函式呼叫；更特別的是 `/refine` 能讓 agent 自己修改「補充版」的 harness 狀態（但碰不了不可變的 base system prompt），官方展示它能在 EmulatorBench 上從零手刻出一個可過診斷測試的 Sega Genesis 模擬器。
- **技術棧**：Python + 持久 IPython kernel + agent-to-agent 訊息傳遞
- **上手難度**：中——CLI 工具，需先 `/login` 選訂閱或 API key 供應商，官方建議在拋棄式 clone 或乾淨 worktree 裡跑，避免直接動到正式專案。

---

### hive (aden-hive) ⭐ 10,915

[GitHub](https://github.com/aden-hive/hive)　·　Python　·　Apache-2.0

- **是什麼**：一個「多 agent 群落（colony）」執行環境——一個常駐、面向使用者的 Queen agent，依需求動態複製出 worker clone 去做子任務。
- **為什麼值得看**：跟 LangGraph 那種「先編譯一張圖」的思路完全相反，Hive 只有一個執行原語：Queen 本身就是 agent loop，每個 worker 都是它的複製體，彼此透過共享的 tracker ledger 協調，不用預先定義節點與邊；同時內建 crash-safe 的 park/resume、成本管控、人工介入（Sentinel）等生產環境要件。
- **技術棧**：Python + LiteLLM 相容多供應商路由 + MCP 工具整合
- **上手難度**：中——號稱零設定即可跑起來，但要用到成本管控、稽核軌跡等生產級功能仍需要理解它的 ledger 架構。

---

### nanobot (HKUDS) ⭐ 47,044 — v0.3.0「The Agency Release」

[GitHub](https://github.com/HKUDS/nanobot)　·　Python　·　MIT

- **是什麼**：香港大學資料科學實驗室（HKUDS）出品的超輕量、自架個人 AI agent 框架，可以跑在 WebUI、終端機，或直接接進 Telegram / Discord / Slack / 微信等聊天工具。
- **為什麼值得看**：上個月的 v0.3.0（260 個 PR、38 位新貢獻者合併）把 nanobot 從「耐用工作台」升級成「能協調幫手的 agent runtime」——新增行內子 agent 諮詢（不用跳出當前任務就能問子 agent 意見）、每個 session 可即時切換模型、更清楚的執行控管；從 2026 年 2 月建 repo 到現在半年出頭衝到 4.7 萬星，成長曲線相當誇張。
- **技術棧**：Python + OpenAI 相容 API + MCP 整合
- **上手難度**：低——一行 `nanobot webui` 就能跑起本地 WebUI。

## Notable Releases

今日無重要框架更新。Watchlist 內的 LangGraph、CrewAI、Mastra、Pydantic AI、Agno 等框架這幾天多半只有例行 patch 或部落格功能文（例如 Mastra 8/13 的 Built-in Tools 介紹），沒有觀察到 48 小時內的重大版號躍升或 breaking changes。

## 今日收穫

原本以為「agent 框架」的分歧點在語言（Python vs TypeScript）或抽象層級（graph vs role-based），但今天這幾個專案讓我意識到更底層的分歧其實是「執行結構什麼時候決定」——LangGraph、CrewAI 這一代選擇在寫程式時就把圖編譯好，Prime Agent、Hive、eve 這批新專案不約而同把這個決定往後推到執行期，賭的是模型已經聰明到能自己判斷要不要生一個子 agent，不需要人先畫好藍圖。

## 參考資料

- [vercel/eve](https://github.com/vercel/eve)
- [Vercel launches eve with custom agent harness — Downstream](https://buttondown.com/downstreamnews/archive/downstream-saturday-august-15-2026)
- [PrimeIntellect-ai/prime-agent](https://github.com/PrimeIntellect-ai/prime-agent)
- [Prime Agent: A self-improving RLM agent — Prime Intellect](https://www.primeintellect.ai/blog/prime-agent)
- [aden-hive/hive](https://github.com/aden-hive/hive)
- [HKUDS/nanobot](https://github.com/HKUDS/nanobot)
- [nanobot v0.3.0 release notes](https://github.com/HKUDS/nanobot/releases/tag/v0.3.0)
- [Introducing Built-in Tools for Mastra Agents](https://mastra.ai/blog/introducing-built-in-tools)
