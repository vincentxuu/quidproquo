---
title: "Multi-Agent 可觀測性：怎麼知道錢花在哪、哪個 Agent 出了問題"
date: 2026-09-18
type: deep-dive
category: ai
tags: [multi-agent, observability, agent, langsmith, sentry, tracing, cost-optimization]
lang: zh-TW
tldr: "Multi-Agent 系統最常見的 debug 困境是「知道結果錯了，但不知道是哪個 agent 搞的」。三層可觀測性是必要的：per-agent token 計量、execution trace 記錄、即時成本儀表板。"
description: "Multi-Agent 系統實戰系列第六篇。從 LangSmith 到 Sentry，整理 multi-agent 系統的可觀測性分層、token 追蹤實作、常見 debug 場景與工具選擇。"
draft: false
series:
  name: "Multi-Agent 系統實戰"
  order: 6
---

Multi-Agent 系統最令人沮喪的 debug 體驗是這樣的：使用者回報「回答錯了」，你打開 log，看到 5 個 agent 跑了 12 個步驟，每個步驟都有 input/output——然後你完全不知道問題出在哪一步。

單 agent 系統的 debug 是線性的：看 prompt → 看回覆 → 找問題。Multi-agent 系統的 debug 是樹狀的：哪個 agent 拿到了錯誤資訊？是 orchestrator 分派錯了還是 worker 執行錯了？結果壓縮有沒有丟掉關鍵訊息？

這篇整理 multi-agent 可觀測性的分層架構和工具選擇。

## 三層可觀測性

### 第一層：Per-Agent Token 計量

最基本的需求——每個 agent 用了多少 token、花了多少錢。

依 [LangSmith](https://smith.langchain.com/) 的追蹤架構，LangGraph 的每個 node 是一次獨立的 LLM 呼叫，可以個別記錄 input/output tokens、延遲、模型名稱。這讓你一眼看出哪個 agent 是成本大戶。

Claude Code Workflow 的 `budget.remaining()` 是另一種做法——不是事後看報表，而是讓編排腳本在執行期間即時知道剩餘預算。依 [Claude Code 文件](https://code.claude.com/docs/en/workflows)，腳本可以根據剩餘 budget 決定要不要繼續 spawn。

**最低標準**：每個 agent 完成後記錄 `{agent_id, input_tokens, output_tokens, model, duration_ms}`。沒有這層，帳單暴衝時你連基本的歸因都做不到。

### 第二層：Execution Trace

記錄整個 multi-agent 執行的完整路徑——誰呼叫了誰、傳了什麼、回了什麼、花了多久。

Trace 的核心結構是一棵樹：

```
Trace（對應一次使用者訊息）
├─ Step 1: Entry Agent（input: 使用者問題）
│  ├─ Step 2: Delegate → Worker A（task: "查資料庫"）
│  │  └─ Step 3: Tool Call → SQL query（result: 15 rows）
│  ├─ Step 4: Delegate → Worker B（task: "搜尋知識庫"）
│  │  └─ Step 5: Tool Call → RAG retrieval（result: 3 chunks）
│  └─ Step 6: Synthesize（input: A+B 結果，output: 最終回覆）
```

每個 step 需要記錄：
- **歸屬**：哪個 agent、哪個 node
- **Input/Output**：傳入和回傳的內容（摘要即可，不需要完整 token）
- **Token 消耗**：input_tokens、output_tokens、cache 相關
- **耗時**：duration_ms
- **狀態**：completed / failed / timeout
- **interaction_type**：handoff / delegate / spawn

[LangSmith](https://smith.langchain.com/) 和 [Arize Phoenix](https://phoenix.arize.com/) 是目前最常用的 LLM 追蹤工具，都支援巢狀 span 來表示 multi-agent 的樹狀結構。

### 第三層：即時成本儀表板

前兩層是事後分析。第三層是即時的——讓你在 agent 還在跑的時候就知道花了多少。

這在 multi-agent 系統裡特別重要，因為成本是非線性的。單 agent 的成本大致跟回覆長度成正比，但 multi-agent 的成本取決於 spawn 了幾個 agent、每個跑了多久、有沒有巢狀 spawn。你可能看到前 30 秒只花了 5K tokens，然後第 31 秒並行 spawn 了 5 個 agent，token 消耗突然跳到 50K。

即時儀表板的最小版本：一個 WebSocket 端點，每個 agent 完成一步就 push 一筆 `{step, tokens, cost}`。前端累加顯示。不需要花俏的圖表——數字在動就夠了。

## 常見 Debug 場景

### 「回答錯了，不知道是誰的問題」

打開 execution trace，從最終回覆往上追：
1. Synthesize step 的 input 是什麼？→ 如果 input 就錯了，問題在上游 worker
2. 哪個 worker 的 output 有問題？→ 看該 worker 的 input 和 tool call 結果
3. 是 orchestrator 分派錯了嗎？→ 看 orchestrator 的 delegate 決策

trace 的樹狀結構讓你做二分搜尋，不需要逐步看。

### 「帳單突然暴衝」

看 per-agent token 計量：
1. 排序所有 agent 的 total_tokens → 找出大戶
2. 大戶是做了太多 tool call？還是 context 太長（fork 膨脹）？
3. 是一個 agent 重複跑（無限迴圈）？還是 spawn 了太多並行 agent？

### 「某個 agent 跑很久」

看 duration_ms 排序：
1. 是 LLM 回覆慢（模型端）？還是 tool call 慢（外部 API）？
2. 有沒有在等另一個 agent 的結果（mailbox 阻塞）？
3. 是不是撞到 rate limit 被 throttle？

## 工具選擇

| 工具 | 適合 | 特色 |
|---|---|---|
| [LangSmith](https://smith.langchain.com/) | LangGraph / LangChain 生態 | 原生支援巢狀 span、playground replay |
| [Arize Phoenix](https://phoenix.arize.com/) | 任何框架（OpenTelemetry） | 開源、支援 embedding drift 偵測 |
| [Sentry](https://sentry.io/) | 已用 Sentry 的團隊 | AI module 支援 token 追蹤、跟 error monitoring 整合 |
| 自建 trace table | 需要完整控制 | 資料在自己 DB、可以跟業務邏輯關聯 |

如果你用 LangGraph，LangSmith 幾乎零成本接入。如果你不在 LangChain 生態，OpenTelemetry-based 的方案（Phoenix、自建）更靈活。Sentry 的優勢是 error 和 trace 在同一個 UI，不用跳來跳去。

## 整體來說

Multi-Agent 可觀測性的核心原則是**每個 agent 是一個獨立的追蹤單位**。不要把整個 multi-agent 執行當一個黑盒——把每個 agent 的 input、output、token 消耗、耗時都記下來，然後用樹狀結構串起來。

三層分別回答不同問題：
- Token 計量：花了多少錢、花在誰身上
- Execution trace：哪一步出了問題
- 即時儀表板：現在正在燒多快

沒有可觀測性的 multi-agent 系統，就像沒有 APM 的微服務——能跑，但出問題的時候你會很痛苦。

## 參考資料

- [LangSmith — Tracing & Observability](https://smith.langchain.com/)
- [Arize Phoenix — Open-source LLM Observability](https://phoenix.arize.com/)
- [Sentry — AI Monitoring](https://sentry.io/for/ai/)
- [Claude Code — Dynamic Workflows（budget.remaining）](https://code.claude.com/docs/en/workflows)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [OpenTelemetry — Semantic Conventions for LLM](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [Anthropic — Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
