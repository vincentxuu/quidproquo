---
title: "AI Agent GitHub Digest — 2026-11-17"
date: 2026-11-17
category: daily
tags: [ai-agent, github, open-source, daily, mcp, browser-automation, rpa]
lang: zh-TW
description: "CopilotKit 把 AG-UI 治理層獨立成 OpenBot；browser-use 1.0.6 把預設模型換成貴 15 倍的 BU 4.0"
tldr: "CopilotKit 的 OpenBot 把「每個 Agent 一台隔離電腦＋治理層」做成獨立專案；browser-use 1.0.6 預設模型換成 BU 4.0，單次任務成本從 $0.0014 跳到 $0.022。"
series:
  name: "AI Agent GitHub Digest"
  order: 94
---

> :globe: [English version](/posts/daily/2026-11-17-ai-agent-github-digest-en)

## 今日亮點

今天沒有單一爆點，但三個方向都在往「可控、可審計」收斂：CopilotKit 把 Agent 的沙箱與治理邏輯拆成獨立的 OpenBot 專案，iFLYTEK 把 RPA 做成「Agent 可以直接呼叫」的工具，MCP 官方也在悄悄養大 server 註冊中心；另一邊 browser-use 1.0.6 把預設模型換貴 15 倍，提醒大家「沒指定模型」這件事本身也有成本。

## Trending Repos

### CopilotKit/OpenBot ★ 12,552

[GitHub](https://github.com/CopilotKit/OpenBot)　·　TypeScript　·　MIT

- **是什麼**：把「每個 AI Agent 都配一台自己的電腦」做成獨立專案——瀏覽器、檔案系統、工具都隔離，每個動作執行前先過一層治理判斷，執行後留稽核紀錄。
- **為什麼值得看**：底層走 AG-UI（CopilotKit 做的開放協定），所以不綁死特定 Agent 框架，現有的 Agent 不用重寫就能接上這層治理。對照這幾個月一路在談「Agent 權限怎麼收」的風向，這是把抽象原則變成可以直接跑的程式碼。
- **Tech Stack**：AG-UI 協定 + 瀏覽器自動化 + 檔案系統沙箱
- **上手難度**：中——需要先有一個 AG-UI 相容的 Agent，才能接上治理層

---

### iflytek/astron-rpa ★ 5,258

[GitHub](https://github.com/iflytek/astron-rpa)　·　Python　·　Apache-2.0

- **是什麼**：科大訊飛open source 的 RPA 套件，主打「Agent-ready」——不是傳統錄製點擊的 RPA，而是設計成讓 AI Agent 直接呼叫 RPA 引擎去操作真實桌面應用。
- **為什麼值得看**：多數 RPA 工具是給人用的錄製型介面，這個反過來把 RPA 包成 Agent 可呼叫的工具（topics 裡掛了 mcp），等於把「桌面自動化」這塊補進 Agent 工具箱。企業內部一堆靠 GUI 操作的舊系統，這種橋接比重寫 API 便宜很多。
- **Tech Stack**：Python + MCP 整合 + on-premise 部署
- **上手難度**：中——on-premise 自架，企業內網部署會比雲端 SaaS 多一層設定

---

### modelcontextprotocol/registry ★ 7,470

[GitHub](https://github.com/modelcontextprotocol/registry)　·　Go　·　NOASSERTION（官方組織維護）

- **是什麼**：MCP 官方的「社群驅動註冊中心」，存的不是 server 程式碼本身，而是每個 MCP server 的 `server.json`——名稱、套件位置、啟動方式、探索用的 metadata。
- **為什麼值得看**：MCP 生態一路都是「server 滿地開花但沒有統一目錄」，這個 registry 想當 npm/PyPI 那種中央索引。本週才剛加了圖示顯示、優化了搜尋效能，代表官方正在把它從「堪用」往「可依賴的基礎設施」推。
- **Tech Stack**：Go + PostgreSQL + Docker（`ghcr.io/modelcontextprotocol/registry`）
- **上手難度**：低——`docker run` 一行就能本機跑起來查

## Notable Releases

### browser-use 1.0.6

[Release Notes](https://github.com/browser-use/browser-use/releases/tag/1.0.6)

- **重要變更**：`Agent(task)` 和 `ChatBrowserUse()` 的預設模型從 `bu-fast` 換成 `bu-4.0`；首次無金鑰執行會先跳 Browser Use 登入頁，核准後才繼續；雲端瀏覽器現在會印出即時畫面連結。
- **Breaking Changes**：沒有程式碼層的 breaking change，但預設行為大改——BU 4.0 的 token 價格是 `bu-fast` 的 15 倍（$1.80/$9.00 vs $0.12/$0.60 每百萬 input/output tokens），而且預設用高推理量而非中等。官方自己測的例子，一個簡單任務成本從 $0.0014 跳到 $0.022。
- **對你的影響**：如果你的程式沒有明確指定 `llm` 參數，升級後帳單會無聲無息變貴 15 倍以上。想維持原本的模型和價格，要自己加 `llm='bu-fast'`；簡單任務可以用更便宜的 `llm='bu-4.0-mini'`。

## 今日收穫

browser-use 這次最值得記的不是模型升級本身，而是「預設值變更」這個動作——當一個工具把預設模型從便宜款換成貴 15 倍的旗艦款時，所有沒有明確鎖定模型版本的生產環境都會在不知不覺中被動漲價。這也是為什麼 Agno、LlamaIndex 這類框架最近的 release 裡,"BREAKING: raise requires-python" 或版本鎖定類的變更越來越常見——生態圈正在學著把「預設行為」當成需要明確溝通的 API 介面,而不是可以隨意調整的細節。

## 參考資料

- [CopilotKit/OpenBot - GitHub](https://github.com/CopilotKit/OpenBot)
- [iflytek/astron-rpa - GitHub](https://github.com/iflytek/astron-rpa)
- [modelcontextprotocol/registry - GitHub](https://github.com/modelcontextprotocol/registry)
- [browser-use 1.0.6 Release Notes](https://github.com/browser-use/browser-use/releases/tag/1.0.6)
- [browser-use pricing](https://docs.browser-use.com/open-source/models)
