---
title: "Multi-Agent 通訊機制：Handoff、Delegate、Mailbox 與協定標準化"
date: 2026-09-18
type: deep-dive
category: ai
tags: [multi-agent, agent, communication, handoff, mcp, a2a, anthropic, openai]
lang: zh-TW
tldr: "Agent 間通訊分三種模式：handoff（移交控制權）、delegate（委派後等結果）、mailbox（即時點對點訊息）。各家實作差異大，但 MCP 和 A2A 正在推動協定標準化。"
description: "Multi-Agent 系統實戰系列第五篇。比較 handoff、delegate、mailbox 三種 agent 間通訊模式，從 Claude Code 到 Codex 的實作差異，以及 MCP/A2A 協定標準化進展。"
draft: false
series:
  name: "Multi-Agent 系統實戰"
  order: 5
---

多個 agent 協作，本質上是通訊問題——誰跟誰說話、說什麼格式、說完之後控制權在誰手上。

這篇整理三種主要的 agent 間通訊模式，以及正在推動的協定標準化。

## 三種通訊模式

### Handoff（移交）

**來源 agent 把控制權完全交出去，自己休眠。**

依 [OpenAI Agents SDK 文件](https://developers.openai.com/api/docs/guides/agents/orchestration)，handoff 是最簡單的模式：Agent A 判斷「這件事 Agent B 比我擅長」，就把整個對話交給 B，A 停止運作。B 完成後，對話可以回到 A，也可以交給 C。

在 multi-agent team 的語境裡，handoff 常見於「客服轉接」場景——通用助理接到技術問題，handoff 給技術專員。LangGraph 的 [handoff 模式](https://langchain-ai.github.io/langgraph/) 讓你在 graph edge 上定義轉接條件。

特性：
- 同一時間只有一個 agent 活躍
- 控制權是完整移交，不是「請幫我做一件事」
- 對話歷史通常隨著控制權一起傳遞（類似 fork context）
- 成本可預測——不會並行消耗

### Delegate（委派）

**來源 agent 派任務給目標 agent，等結果回來後繼續。**

Delegate 是最常見的模式。依 [Anthropic 的多 agent 模式研究](https://www.anthropic.com/research/multiagent-systems)，orchestrator-worker 架構的核心就是 delegate：orchestrator 拆解任務、分派給 worker、收集結果、合成回覆。

跟 handoff 的關鍵差異是**來源 agent 保持控制權**——它在等待期間可以做其他事（如果支援並行），或者等結果回來後決定下一步。

各家的實作：
- **Claude Code**：Team Edge 的 `delegate` interaction type，子 agent 執行完回傳結果給父
- **Codex**：`spawn_agent` + `wait_agent`，manager 派任務後可以繼續工作或等待
- **CrewAI**：hierarchical process 的 manager 自動把 task 委派給最適合的 agent

Delegate 模式可以搭配前一篇討論的 context_mode（fresh/fork）和結果壓縮。

### Mailbox（點對點訊息）

**Agent 之間可以隨時互傳訊息，不需要經過中央調度。**

這是最靈活也最少見的模式。目前主要在動態 spawn 的場景中出現——多個並行的子 agent 需要交換中間結果，但不想等全部做完才彙總。

實作通常是 in-memory 的 async queue：每個 agent 有自己的信箱，其他 agent 可以往裡面丟訊息，收件者可以隨時檢查有沒有新訊息。

Codex 的六個原語裡有 `send_message`，讓 manager 或 worker 之間互傳訊息。AutoGen 0.2 的 GroupChat 本質上也是 mailbox——每個 agent 都能看到群組裡的所有訊息。

特性：
- 非阻塞——sender 丟了就走，不等回覆
- 去中心化——不需要經過 orchestrator 中轉
- 單輪生命週期——通常只活在一個 conversation turn 內，turn 結束就清掉

### 三種模式的比較

| | Handoff | Delegate | Mailbox |
|---|---|---|---|
| 控制權 | 完全移交 | 來源保持 | 無中央控制 |
| 並行 | 不支援 | 支援 | 支援 |
| 典型用途 | 轉接、專家路由 | 任務分派、orchestrator-worker | 並行 agent 即時協調 |
| 成本可預測性 | 高 | 中 | 低 |
| Context 共享 | 完整歷史 | 可選（fresh/fork） | 只傳訊息內容 |

## 協定標準化：MCP 與 A2A

目前各家的 agent 通訊機制都是 proprietary 的——Claude Code 的 handoff/delegate 跟 Codex 的六原語不互通，LangGraph 的 graph edge 跟 CrewAI 的 process 也無法混用。

兩個標準化的努力正在進行：

### MCP（Model Context Protocol）

依 [Anthropic 的 MCP 文件](https://modelcontextprotocol.io/)，MCP 定義了 agent 與工具之間的標準介面——tools、resources、prompts。它解決的是「agent 怎麼呼叫外部能力」，不是「agent 怎麼跟 agent 溝通」。

但 MCP 間接影響了 multi-agent 通訊：當 Agent A 要呼叫 Agent B 時，可以把 B 包裝成一個 MCP tool。依 [OpenAI Agents SDK 的 agents-as-tools 模式](https://developers.openai.com/api/docs/guides/agents/orchestration)，一個 agent 可以被註冊為另一個 agent 的 tool——呼叫方式跟呼叫普通工具一樣。

這不是真正的 agent-to-agent 通訊（B 不知道 A 的存在），但它把 delegate 模式標準化了。

### A2A（Agent-to-Agent Protocol）

依 [A2A 協定 survey（arXiv 2505.02279）](https://arxiv.org/abs/2505.02279)，Google 在 2025 年提出的 A2A 專門解決 agent 間通訊：能力發現（「你會什麼」）、任務委派（「幫我做這個」）、狀態同步（「我做到哪了」）。

跟 MCP 的差異：MCP 是 agent ↔ tool 的介面，A2A 是 agent ↔ agent 的介面。MCP 裡被呼叫方是被動的工具，A2A 裡雙方都是有自主性的 agent。

目前 A2A 仍在早期階段，生產環境採用率低。但它代表了一個方向：multi-agent 系統需要一個通用的通訊協定，不然每換一個框架就要重新實作通訊邏輯。

## 設計決策樹

選擇通訊模式時：

```
需要讓出控制權嗎？
  ├─ 是 → Handoff（轉接場景）
  └─ 否 → 需要即時交換中間結果嗎？
           ├─ 是 → Mailbox（並行協調）
           └─ 否 → Delegate（orchestrator-worker）
```

多數場景用 **Delegate** 就夠了。Handoff 留給真正需要轉接的場景（客服路由、專家分流）。Mailbox 只在並行 agent 需要即時協調時才值得引入——它增加的複雜度不小，且除錯困難。

## 整體來說

Agent 間通訊的核心取捨是**控制力 vs 靈活性**——handoff 最有紀律（一次只有一個 agent 跑）、delegate 平衡控制與並行、mailbox 最靈活但最難 debug。

目前業界還沒有統一的通訊標準。MCP 正在成為 agent ↔ tool 的事實標準，A2A 嘗試成為 agent ↔ agent 的標準但採用率仍低。短期內，選擇通訊模式等於選擇框架——換框架就要重新接線。

## 參考資料

- [Anthropic — Building effective agents](https://docs.anthropic.com/en/docs/agents)
- [Anthropic — Patterns and problems in multiagent systems](https://www.anthropic.com/research/multiagent-systems)
- [Anthropic — Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- [OpenAI — Agents SDK orchestration and handoffs](https://developers.openai.com/api/docs/guides/agents/orchestration)
- [OpenAI — Codex GA 官方公告](https://openai.com/index/codex-now-generally-available/)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [CrewAI — Processes](https://docs.crewai.com/en/concepts/processes)
- [A Survey of Agent Interoperability Protocols: MCP, ACP, A2A, ANP (arXiv 2505.02279)](https://arxiv.org/abs/2505.02279)
- [A Technical Taxonomy of LLM Agent Communication (arXiv 2606.19135)](https://arxiv.org/abs/2606.19135)
