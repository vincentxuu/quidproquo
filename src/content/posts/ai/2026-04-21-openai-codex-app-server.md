---
title: "Codex App Server：OpenAI 如何把 Agent Harness 變成通用協議"
date: 2026-04-21
category: ai
tags: [codex, app-server, json-rpc, agent-harness, openai, harness-engineering]
lang: zh-TW
tldr: "OpenAI 把 Codex harness 包裝成 JSON-RPC over stdio 的 App Server，讓 VS Code、JetBrains、Web、桌面 App 都能共用同一套 agent loop，三個核心 primitive：Item、Turn、Thread。"
description: "介紹 OpenAI Codex App Server 的設計：為什麼選 JSON-RPC over stdio、對話三基本單位（Item/Turn/Thread）是什麼、approval flow 如何運作，以及 Local/Web/TUI 三種整合模式的取捨。"
draft: false
---

OpenAI 工程師 Celia Chen 在 2026 年 2 月發表了一篇介紹 Codex App Server 的文章，說明他們怎麼把 Codex 的 agent harness 從一個 TUI 專用的實作，變成一個可以跨 IDE、Web、桌面 App 共用的通用協議。這篇文章整理其中的架構決策、三個對話基本單位，以及不同整合模式的取捨，適合對 agent harness 設計有興趣的工程師閱讀。

---

## 為什麼需要 App Server

Codex CLI 最初是一個 TUI（terminal UI），整個 agent loop 直接跑在同一個 process 裡。問題是當 VS Code extension 要加進來，就必須共用同一套 harness——包含對話歷史管理、config 和 auth、工具執行和 sandbox——但又不能讓每個 client 各自重新實作一遍。

第一個嘗試是把 Codex core 包成 MCP server。MCP 本來是用來讓 host 呼叫外部工具的協議，反過來讓 IDE 當 host、Codex 當 server 在技術上可行，但語意上很彆扭，維護也困難。Codex 的 agent loop 不只是「一個工具被呼叫」，它有自己的對話生命週期、審批流程、非同步事件推送，這些都不適合塞進 MCP 的 request-response 框架。

最後的選擇是 **JSON-RPC over stdio**，做成一個獨立的 App Server。這個決定讓 server 可以雙向通訊（server 主動推事件給 client）、協議簡單、跨語言容易整合，同時把 Codex core 的細節完全封裝在 server 端。

---

## Codex Core 包含什麼

App Server 的職責是把外部請求翻譯給 Codex core，所以理解 core 的範圍很重要。Codex core 負責三件事：

**Thread lifecycle & persistence**：對話歷史跨 session 保留。一個 thread 可以在某個時間點暫停，之後再從同樣的狀態繼續，或者 fork 出一個新的分支。

**Config & auth**：包含 Sign in with ChatGPT 等身份驗證機制，以及各種 per-thread 和 global 設定。

**Tool execution & extensions**：sandbox 隔離的工具執行環境，加上 MCP servers 和 skills 的擴充機制。

App Server 本身由四個組件構成：stdio reader（處理 IO）、Codex message processor（負責 JSON-RPC ↔ core 事件的翻譯）、thread manager（管理所有 thread 的生命週期）、以及 core threads（每個 thread 各跑一個 core session）。

---

## 三個對話基本單位

App Server 定義了三個 primitive，是整個協議的骨架。

### Item：最小的事件單位

Item 是對話裡最細粒度的一個片段。每個 item 有自己的 lifecycle：`started` → `delta`（可能有多個，用於 streaming）→ `completed`。

Item 的類型包含：
- **user message**：使用者的輸入
- **agent message**：模型的回應，支援 streaming
- **tool execution**：agent 呼叫工具的紀錄（包含輸入和輸出）
- **approval request**：需要使用者確認的動作
- **diff**：檔案變更的內容

這個設計讓 client 可以做細緻的 UI 更新——不用等整個回應完成，每個 delta 事件都能即時反映到介面上。

### Turn：一次完整的工作週期

Turn 代表從一個 user input 出發，到 agent 完成所有對應工作的完整週期。一個 turn 可以包含多個 item：agent 可能先呼叫幾個工具，再產出最終的文字回應。

Turn 是 approval flow 的操作粒度——server 可以在一個 turn 的中途暫停，等待使用者回應後再繼續。

### Thread：持久化的對話容器

Thread 是最高層的單位，一個 thread 包含多個 turn，代表一段完整的對話歷史。Thread 支援四個操作：

- **create**：建立新對話
- **resume**：從上次中斷的地方繼續
- **fork**：從某個歷史狀態分叉出新的對話線
- **archive**：封存不再使用的 thread

Thread 的持久化設計讓 Web 整合特別有意義——即使使用者關掉瀏覽器分頁，server 端的 thread 狀態依然存在，下次打開可以無縫繼續。

---

## Initialize Handshake 與 Approval Flow

App Server 有兩個設計細節值得特別說明。

**Initialize handshake**：client 連上 server 後，必須先送一個 `initialize` request。Server 回傳 userAgent、可用功能等 metadata 後，雙方才能開始正常的對話流程。這個機制讓不同版本的 server 和 client 可以協商能力，避免版本不相容的問題。

**Approval flow**：某些工具執行需要使用者確認（例如刪除檔案、執行危險命令）。App Server 的設計是 server 主動發送一個 approval request 給 client，turn 的執行暫停，等待 client 回傳 `allow` 或 `deny` 後才繼續。這個流程跟一般的 request-response 方向相反——是 server 向 client 發請求——這也是選擇雙向通訊協議的關鍵原因之一。

---

## 三種整合模式

App Server 的設計讓不同的 client 類型有不同的整合方式。

**Local / IDE 整合**（VS Code、JetBrains）：把 App Server binary 打包進 extension，透過 bidirectional stdio 通訊。Server 跑在本機，狀態存在本地端。這是最低延遲的整合方式，也最適合需要直接操作本地檔案系統的場景。

**Web 整合**：App Server 跑在 container 裡，state 完全在 server 端。使用者關掉分頁後 thread 不中斷，下次回來可以繼續。適合長時間執行、不需要本地工具權限的任務。

**TUI 整合**：目前 Codex CLI 的 TUI 還是直接呼叫 Rust core types，繞過 App Server。OpenAI 的計畫是未來把 TUI 也重構成透過 App Server 溝通，讓所有 client 都走同一套協議，減少重複維護的成本。

---

## 整合方式的選擇

文章也整理了四種不同深度的整合選項，從重到輕：

1. **App Server**：完整的 agent harness，有 thread 管理、approval flow、streaming
2. **Codex as MCP server**：把 Codex 包成工具，適合已有自己 agent loop 的系統
3. **Codex Exec**：CI/CD 環境用，一次性執行，不需要互動
4. **Codex SDK（TypeScript）**：最輕量，直接在程式碼裡呼叫，適合需要高度客製化的場景

這四層的取捨很清楚：越往上走，你得到更多現成的 harness 功能；越往下走，你保留更多控制權。

---

## 整體來說

Codex App Server 的核心取捨是：用標準協議的維護成本，換取多個 client 共用同一套 harness 的可靠性。JSON-RPC over stdio 不是最時髦的選擇，但它解決了具體的工程問題——bidirectional 通訊讓 approval flow 可行，協議的簡單性讓跨語言整合容易，而把 core 邏輯封裝在 server 端則避免了各個 client 各自實作帶來的行為不一致。

Item / Turn / Thread 三層結構的設計也值得注意。它不只是一個 API 規格，而是對「agent 對話」本質的一個明確建模：事件有生命週期、工作有邊界、對話有持久狀態。這種清晰的 primitive 設計，讓 client 實作者不需要猜測 server 的行為，也讓未來擴充新功能有清楚的地方可以掛載。

---

## 參考資料

- [Unlocking the Codex harness: how we built the App Server](https://openai.com/index/unlocking-the-codex-harness/) — Celia Chen，OpenAI，2026 年 2 月，本文原始來源
- [Codex CLI](https://github.com/openai/codex) — OpenAI Codex CLI 的 GitHub repository
- [Model Context Protocol](https://modelcontextprotocol.io/introduction) — MCP 規格，文章中提到的對比方案
- [從 Prompt 到 Harness：AI 工程的三次演化](/posts/ai/2026-03-28-harness-engineering-evolution) — Harness Engineering 的背景脈絡
- [Anthropic Harness Design：讓 AI Agent 像工程師一樣工作](/posts/ai/2026-03-28-anthropic-harness-design) — Anthropic 對 harness 設計的觀點，可與本文對照
