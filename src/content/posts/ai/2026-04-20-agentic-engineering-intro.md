---
title: "Agentic Engineering：讓 AI Agent 像真實工程團隊一樣協作"
date: 2026-04-20
category: ai
tags: [agentic-engineering, multi-agent, langgraph, langsmith, a2a, mcp, worker-agent, leader-agent]
lang: zh-TW
tldr: "Agentic Engineering 不是讓 AI 寫更快的程式碼，而是讓軟體更快走完整個交付流程——透過多 agent 協作，壓縮跨團隊的協作摩擦。"
description: "Cisco 工程師的實戰報告：用 LangGraph + LangSmith + LangMem 建出 multi-agent 系統，debug 工作流縮短 93%、開發流程加速 65%。拆解 Worker Agent、Leader Agent 的架構設計，以及 A2A、MCP、CLI 的接入選擇。"
draft: false
---

軟體開發裡有一個問題，AI coding agent 一直沒有真正解決：**跨團隊的協作摩擦**。

Codex 幫你寫程式碼很快，Claude Code 幫你 debug 很準，但它們都活在單一 session 裡——一個工程師、一個任務、一個視窗。等到需要跨越 dev、QA、ops 的邊界，還是要人工傳遞上下文、手動協調進度。

Cisco 的兩位工程師今年四月發表了一篇文章，描述他們怎麼用不同的方法解這個問題。他們稱之為 **Agentic Engineering**。

---

## 核心洞見

> 「最大的突破不是工具變更好，而是系統能夠像真實工程團隊一樣運作。」

這句話切中要害。過去幾年的 AI 工程進展，基本上都在讓單一工具更強——更準的補全、更聰明的對話、更廣的 context window。但工程交付的瓶頸從來不只是「寫程式碼」這一步，而是整條流水線：需求、設計、開發、測試、部署、維運。

Agentic Engineering 的問法不是「如何更快寫程式碼？」，而是「**如何讓軟體更快、更安全地走完整個交付流程？**」

---

## 架構：兩種角色

系統由兩種 agent 組成，類比真實團隊的分工：

### Worker Agent（個別工程師）

每個 Worker 負責一個領域（debug、開發、測試、維運），能夠：

1. **解讀意圖**：接收自然語言的工程需求，產出執行計畫
2. **收集上下文**：從 repo、issue tracker、log 系統拉取相關資訊
3. **執行任務**：呼叫工具、呼叫 coding agent（Codex/Claude Code）、或派給 sub-agent
4. **驗證結果**：確認執行結果符合預期
5. **回報進度**：向 Leader Agent 彙報計畫、動作、結果

Worker 是鬆耦合的，可以水平擴展，也可以把子任務委派給其他 Worker。

### Leader Agent（專案負責人）

Leader 不執行任務，負責協調與治理：

- **共享 prompt 和 workflow 庫**：標準化最佳實踐，降低 onboarding 成本
- **統一 tool gateway**：以一致且安全的方式把工具能力暴露給 Worker
- **長期記憶**：累積跨 session、跨 Worker 的知識
- **全局可觀測性**：追蹤所有 agent 的決策與執行結果
- **任務路由**：根據意圖分派給正確的 Worker

透過把執行（Worker）和協調（Leader）分離，系統在邊緣保持自主性，在整體保持一致性。

---

## 技術選擇：為什麼是 LangChain 這套？

Cisco 評估了多個框架後選擇 LangGraph + LangSmith + LangMem，理由是它們把三個對 production 最重要的事情當作一等公民：

**LangGraph**——狀態管理和流程編排
- 每個 Worker 的工作流是一個 stateful graph
- 支援 checkpoint 和 retry（中途失敗不用從頭來）
- 可以在任何節點暫停，等待人工確認後繼續

**LangSmith**——全局可觀測性
- 記錄每個 agent 的完整執行 trace
- 每個決策都有 audit trail，知道「誰在什麼時候做了什麼、為什麼」
- 這是 Agentic Engineering 能被信任部署在 production 的基礎

**LangMem**——長期記憶
- 跨 session 保存工作流歷史、團隊偏好、過去的解法
- 讓 Worker Agent 能從過去的執行中學習，而不是每次都從零開始

---

## 一個完整的執行流程

以開發工作流為例，Worker Agent 和 IDE 裡的 AI coding agent 協作的四個階段：

```
1. Intent Analysis
   工程師在 IDE 輸入自然語言需求
   → Worker Agent 用 LangGraph 分析意圖
   → 透過 MCP tools 拉取 repo 上下文

2. Planning & Notification
   Worker 產出結構化的多步驟計畫
   → 透過 Slack/Teams 通知工程師

3. Execution & Tracking
   計畫逐步執行，AI coding agent 負責程式碼生成
   → LangGraph checkpoint 追蹤每一步的執行狀態

4. Validation & Closure
   執行完成後驗證結果
   → 通知工程師，結果存入 LangMem 長期記憶
```

---

## 代理間通訊：A2A、MCP、還是 CLI？

文章裡 Worker Agent 之間用 **A2A 協議**（Google 2025 年發布的 agent 通訊標準）。但 AI coding agent 像 Claude Code 或 Codex 本身不支援 A2A，所以 Cisco 做了一個 **MCP 包裝器**來橋接。

這三種接入方式各有取捨：

| 方式 | 通訊方向 | 狀態 | 適合情境 |
|------|---------|------|---------|
| **A2A** | 雙向 | 無狀態 | Agent 之間的標準協作 |
| **MCP** | 雙向 | 無狀態 | 讓 coding agent 能回調 Worker |
| **CLI subprocess** | 單向 | 無狀態 | 最快的起步方案 |

MCP 相較 CLI 的核心優勢是**通訊方向**：CLI 只能 Worker → Claude，MCP 讓 Claude 在執行中途也能主動呼叫 Worker 的 tool，回報進度或請求更多上下文。

狀態問題（每次呼叫都失憶）三種方式都有，都需要靠 LangMem 注入歷史上下文來解決。

---

## 實驗數據

Cisco 在內部跑了兩類工作流的 pilot：

**Debug 工作流**（20+ 個跨團隊 triage 案例）
- **93% 的 time-to-root-cause 縮減**
- 多個跨團隊調查在 5 分鐘內完成
- 512 場 session、70 位用戶，**一個月省下 200+ 人工小時**
- QA 團隊獨立評估：品質沒有下降

**開發工作流**（15+ 個案例）
- **65% 執行時間縮減**
- 關鍵收益不是程式碼生成更快（coding agent 本來就快），而是 **PR merge 後的下游測試被壓縮**
- 最終瓶頸：**人類 code review**

第二個數據特別有意思。65% 的加速裡，大部分來自測試流程的壓縮，不是開發本身。這印證了 Agentic Engineering 的核心主張：**最大的槓桿在協調開銷，不在單一步驟的速度。**

---

## 與 AI Coding Agent 的關係

一個常見的誤解：Agentic Engineering 是要取代 Codex 或 Claude Code。

不是。

正確的關係是：**Codex/Claude Code 是 Worker Agent 內部的執行引擎**。Worker 負責理解意圖、收集上下文、追蹤狀態、協調跨團隊——這些是 coding agent 做不到的。Coding agent 負責把具體的程式碼任務做好——這是它最擅長的。

兩者在不同的抽象層次運作，配合而非競爭。

---

## 整體來說

Agentic Engineering 的核心取捨很清楚：你要接受更高的架構複雜度，換取整條交付流水線的加速。

它不適合所有團隊。如果你的交付瓶頸在於「寫程式碼太慢」，一個好的 coding agent 就夠了。如果你的瓶頸在於「跨團隊協作太慢、上下文傳遞太耗時、下游測試卡太久」，那 Agentic Engineering 的多 agent 架構才真正有意義。

從最小路徑開始：選一個真實的內部工作流（debug triage 是好的起點），跑通 Worker Agent 的四個節點，加上 LangSmith 追蹤，看看數字說什麼。

---

## 參考資料

- [Agentic Engineering: How Swarms of AI Agents Are Redefining Software Engineering](https://www.langchain.com/blog/agentic-engineering-redefining-software-engineering)
- [Building effective agents — Anthropic](https://www.anthropic.com/research/building-effective-agents)
- [Your harness, your memory — Harrison Chase](https://www.langchain.com/blog/your-harness-your-memory)
- [Continual learning for AI agents — Harrison Chase](https://www.langchain.com/blog/continual-learning-for-ai-agents)
