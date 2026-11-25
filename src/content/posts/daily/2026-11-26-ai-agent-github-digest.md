---
title: "AI Agent GitHub Digest — 2026-11-26"
date: 2026-11-26
category: daily
tags: [ai-agent, github, open-source, daily, mcp, mcp-server, agent-platform, prompt-injection]
lang: zh-TW
description: "Pydantic AI 2.75 把工作區檔案依信任等級分流，正面回應 prompt injection；Wakeshift 幾乎同步把剛合併的 MCP Events 規格做成第一個開源實作"
tldr: "pydantic-ai v2.75.0 把 RepoContext、Skills、Memory 讀到的非 operator 層級檔案,從直接塞進 instructions 改成用工具讀取或當框架資料,正面防 prompt injection；Claude Code v2.1.332 開放 MCP server 提供 skill 的 beta,並新增可擋技能內嵌 shell 指令的 hook；temporal-mcp、Wakeshift 等新 MCP server 同週出現,分別補齊 workflow 除錯與事件推播；建在 Pydantic AI 上的 AgenticOS 剛拿下 2026 Open Agentic AI Innovation Award。"
series:
  name: "AI Agent GitHub Digest"
  order: 103
---

> :globe: [English version](/posts/daily/2026-11-26-ai-agent-github-digest-en)

## 今日亮點

今天的主線是「MCP 生態擴張」跟「agent 安全往上游收」同時發生：Pydantic AI 2.75 把工作區檔案依信任等級分流，不再無差別塞進 instructions，直接回應 prompt injection；同一週，Claude Code 開放 MCP server 提供 skill 的 beta，也補了一個能擋技能內嵌 shell 指令的 hook。MCP 這邊更熱鬧——官方剛合併的 MCP Events 規格，幾天內就冒出 Wakeshift 這個開源實作，Temporal 也低調推出自己的 MCP server。而建在 Pydantic AI 上的 AgenticOS，剛拿下 2026 Open Agentic AI Innovation Award。

## Trending Repos

### vstorm-co/agenticos ★803

[GitHub](https://github.com/vstorm-co/agenticos)　·　Python (Pydantic AI)　·　Apache-2.0

- **是什麼**：一個開源、自架的企業 AI agent 平台——團隊可以在自己的伺服器上跑共用聊天室、RAG、技能、真實瀏覽器、4,700 多個 MCP server、預算控管、審批流程和稽核紀錄，定位是 ChatGPT Enterprise 的自架替代品。
- **為什麼值得看**：跟多數「agent 平台」比，AgenticOS 把 Claude Code／Codex 接進團隊共用聊天室，讓同事和 agent 在同一個對話裡協作，不是各自開獨立視窗；剛拿下 2026 Open Agentic AI Innovation Award，主辦方特別點名它採用 AGENTS.md 和整合 MCP 的做法。
- **Tech Stack**：Pydantic AI + 多語 README（含波蘭文、德文、西班牙文）+ 桌面／行動端
- **上手難度**：中——自架需要自己的伺服器和模型金鑰，但有現成的安裝流程

---

### temporalio/temporal-mcp ★9（9/18 公開，仍是 pre-release）

[GitHub](https://github.com/temporalio/temporal-mcp)　·　Go　·　MIT

- **是什麼**：Temporal 官方出的 MCP server，讓 agent 直接查 Temporal workflow 的狀態、事件歷史、task queue 的 poller 和 backlog，預設唯讀，也可以選擇開放啟動 workflow 的權限。
- **為什麼值得看**：「workflow 卡住了嗎」「過去一小時哪些 run 失敗」這類除錯問題，以前要工程師自己開 Temporal UI 查，現在可以直接讓 agent 查 Visibility API 回答；官方親自下場做 MCP server而不是交給社群寫，代表 workflow 編排這層也正式把「可以讓 agent 查但不能讓它亂寫」的權限模型定下來。
- **Tech Stack**：Go + Temporal Visibility API + OIDC（集中部署版）
- **上手難度**：中——單人用一行指令裝完，但接自己的 namespace 要寫 YAML 設定，正式上線還要過 OIDC 身分驗證

---

### experientiallabs/experiential ★18,559

[GitHub](https://github.com/experientiallabs/experiential)　·　Python　·　Apache-2.0

- **是什麼**：開源的 LLM gateway，統一用一個 OpenAI 相容 API 接 hosted、BYOK 和本地模型，可以按使用者或 agent 設定能用哪些模型、用途和花費上限，還能把正式流量回收訓練成自己的 router 或專屬模型。
- **為什麼值得看**：市面上的 LLM gateway 大多停在「轉發請求＋算費用」，experiential 多做了一步——把實際流量變成訓練資料，讓團隊之後能換成自己調過、更省錢的 router，不必永遠依賴雲端供應商的預設路由；星數半年內衝上 1.8 萬，顯示「省模型費用」這個痛點比想像中更痛。
- **Tech Stack**：Python（原生資料平面）+ OpenAI／Anthropic Messages 相容 API + OpenTelemetry 流量回收
- **上手難度**：低——`pip install experiential` 後一行指令開本機 gateway，正式串接才需要連供應商金鑰

---

### wakeshift/server ★2（11/23 剛公開）

[GitHub](https://github.com/wakeshift/server)　·　TypeScript / Node.js　·　Apache-2.0

- **是什麼**：讓 MCP server 可以「叫醒」正在用它的 agent——自己的後端 `emit()` 一個事件，訂閱中的對話就會被喚醒；支援標準 MCP Events（SEP-3415）的 agent 直接吃標準，Claude Code、Codex、Cursor 這些還沒支援的，Wakeshift 用各自的橋接方式照樣叫醒。
- **為什麼值得看**：MCP Events 規格才剛合併進規格沒幾天，幾乎沒有 agent 真的支援，Wakeshift 等於幫整個生態補一個「轉接頭」，讓任何 webhook（GitHub、Stripe、CI）都能直接變成喚醒 agent 的事件，不用自己寫 handler；是目前少數已經在吃這份剛定案規格的開源實作。
- **Tech Stack**：Node.js / TypeScript + Docker Compose + 官方 SDK（TypeScript／Python／Go）
- **上手難度**：中——自架要 Docker，官方也提供 hosted 版本可以先試

## Notable Releases

### Pydantic AI v2.75.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.75.0)

- **重要變更**：`RepoContext`、`Skills`、`Memory` 讀到的工作區檔案，現在依信任等級分流——`'operator'`（預設）等級的檔案維持現狀直接進 instructions；低於 `'operator'` 的檔案改成讓 model 自己用檔案工具讀取（`RepoContext`）、透過 `list_skills`／`load_skill` 工具取用（`Skills`）或當成框架資料附加（`Memory`），不再無條件混進 instructions。另外把「模型回應是空的或讀不懂」獨立成 `ModelEmptyResponseError`／`ModelInvalidResponseError`，讓 `FallbackModel` 預設能接手這類情況。
- **Breaking Changes**：有。用 Temporal／DBOS 之類 durable engine 跑的流程，升級後 workspace 會多記一次 `realpath` 呼叫，要等現有 run 跑完或用 worker 版本管理再升級；原本 `except UnexpectedModelBehavior` 寫在 `except ModelAPIError` 之後的程式碼，行為會變——新的兩個例外類別雖然同時繼承兩者，但排前面的 `ModelAPIError` 會先接住它們。
- **對你的影響**：如果你的 agent 會讀取使用者可寫入的目錄（例如 repo 裡的任意檔案、使用者丟進來的 memory），這個改版直接降低了「檔案內容被當成指令執行」的風險，值得優先升級；但要先檢查例外處理順序和 durable run 的升級時機。

---

### Claude Code v2.1.332（含 v2.1.331）

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.332)

- **重要變更**：MCP server 現在可以提供 skill 給 Claude Code 用（beta），在 `/` 選單用 `server:skill` 顯示；新增 `PreSkillShellCommand` hook，可以在技能或指令載入內嵌 shell 指令前擋下來；修掉一批會讓 session 卡死或吃滿記憶體的 hook／壓縮相關 bug（例如 hook 輸出無限印、超大 log 造成 context 爆掉）。
- **Breaking Changes**：無，但官方特別註明：2.1.331 以前的版本如果設定檔裡已經寫了 `PreSkillShellCommand`，啟動時會跳出對話框，是預期行為不是 bug。
- **對你的影響**：如果你的工作流會讓技能或 MCP server 跑任意 shell 指令，這兩版加起來補的是同一塊——先讓更多技能來源可控（MCP server 提供 skill），再讓你能在執行前擋下可疑的內嵌指令，建議升級後順手設一下 `PreSkillShellCommand`。

## 今日收穫

原本以為 agent 安全主要是下游的事——審查模型吐出來的東西、擋危險的工具呼叫。但 Pydantic AI 這次做的是上游分流：同一份工作區檔案，依「誰放的」分成不同信任等級，分別走 instructions、工具讀取或框架資料三條不同的管道，不是全部無差別倒進 prompt。跟 Claude Code 同週加的 `PreSkillShellCommand` hook 放在一起看，兩邊其實是同一個思路的兩個施工點——一個卡在「內容怎麼進 context」，一個卡在「指令執行前再擋一次」。

## 參考資料

- [vstorm-co/agenticos](https://github.com/vstorm-co/agenticos)
- [AgenticOS — 2026 Open Agentic AI Innovation Award 公告](https://aaif.io/blog/winners-of-the-first-aaif-annual-technical-excellence-awards)
- [temporalio/temporal-mcp](https://github.com/temporalio/temporal-mcp)
- [experientiallabs/experiential](https://github.com/experientiallabs/experiential)
- [wakeshift/server](https://github.com/wakeshift/server)
- [Wakeshift — MCP Events spec（SEP-3415）相關討論](https://news.ycombinator.com/item?id=50634239)
- [Pydantic AI v2.75.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.75.0)
- [Claude Code v2.1.332 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.332)
- [Claude Code v2.1.331 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.331)
