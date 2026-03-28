---
title: "OpenClaw Agent Loop：執行迴圈、Streaming 與 Queue"
date: 2026-03-28
category: ai
tags: [openclaw, agent-loop, streaming, queue, messages, debounce]
lang: zh-TW
tldr: "一次 agent 執行：收到訊息 → context 組裝 → 模型推理 → tool 執行 → 串流回覆 → 持久化。每個 session 串行、支援 5 種佇列模式。"
description: "OpenClaw Agent Loop 的完整執行流程、Streaming 分塊機制、訊息佇列策略與並行控制。"
draft: false
---

Agent Loop 是 OpenClaw 的核心執行引擎——從收到一則訊息到送出回覆的完整流程。這篇講它怎麼跑、怎麼串流、怎麼處理同時進來的多則訊息。

## 完整執行流程

```
訊息進來 → 路由/binding → Session key → Queue（如果有 active run）
    ↓
RPC 入口：驗證參數、解析 session、回傳 runId
    ↓
Agent 指令執行：解析模型設定、載入 skills、呼叫 embedded runtime
    ↓
Embedded Runtime：串行執行（per-session queue）、管理 timeout、回傳 usage
    ↓
Event Bridge：轉換內部事件 → tool events + assistant deltas + lifecycle signals
    ↓
agent.wait：阻塞直到完成，回傳 status 和 timing
```

### 超時行為

- `agent.wait` 預設 30 秒
- Agent runtime 的 abort timer 預設 **48 小時**

## 訊息處理

### 去重

維護短期 cache（channel + account + peer + session + messageId），防止頻道斷線重連後重複觸發 agent。

### Debounce

同一個發送者的連續文字訊息會被批次合併成一次 agent turn。各頻道有不同的 debounce 時間：

| 頻道 | 預設 debounce |
|---|---|
| WhatsApp | 5000 ms |
| Slack | 1500 ms |

媒體和附件**不受 debounce 影響**，立即觸發。控制指令也是。

### Body 分層

| 層 | 用途 |
|---|---|
| Body | 完整 prompt 文字（含可選的 history wrapper）|
| CommandBody | 原始文字，給 command parsing 用 |
| RawBody | CommandBody 的 legacy 別名 |

群組訊息會在 prompt 裡加上 sender label。

## Streaming 與分塊

OpenClaw 有兩層串流機制：

### Block Streaming（頻道用）

把 assistant 的輸出切成文字區塊，作為一般頻道訊息發送（不是 token-by-token delta）。

```json5
{
  agents: {
    defaults: {
      blockStreamingDefault: "off",  // on | off
      blockStreamingBreak: "text_end",  // text_end | message_end
      blockStreamingChunk: {
        minChars: 800,
        maxChars: 1200,
        breakPreference: "paragraph"
      }
    }
  }
}
```

分割優先順序：段落斷行 → 換行 → 句子 → 空白 → 字元級。**永遠不在 code fence 內分割**，會尊重 fence 的關閉和重新開啟。

連續區塊在閒置期間會合併（`idleMs`），`humanDelay` 在第一則之後加自然停頓（800-2500 ms）。

### Preview Streaming（Telegram / Discord / Slack）

在生成過程中用編輯和 append 更新一則臨時預覽訊息。

模式：`off`、`partial`（單則可替換預覽）、`block`（分塊更新）、`progress`（狀態更新 + 最終答案）。

### Reasoning 可見性

`/reasoning on|off|stream` 控制是否給使用者看推理過程。即使關閉，推理 token 仍然消耗。

## Queue（佇列）

Agent 執行時如果又來了新訊息，需要佇列策略處理。

### 並行控制

- **Session lane** — 每個 session 串行執行，防止 race condition
- **Global lane** — 全域並行上限（`maxConcurrent`），main lane 預設 4、subagent lane 預設 8
- Typing indicator 立即觸發，不等 queue

### 5 種佇列模式

| 模式 | 行為 |
|---|---|
| `steer` | 立即注入到當前 run（streaming 時直接插入）|
| `followup` | 等下一個 agent turn |
| `collect`（預設）| 合併排隊的訊息為單一 followup |
| `steer-backlog` | 立即 steer + 保留做 followup |
| `interrupt` | 中止當前 run，執行最新訊息 |

### 設定

```json5
{
  messages: {
    queue: {
      debounceMs: 1000,  // followup turn 延遲
      cap: 20,            // 每個 session 最大排隊數
      drop: "summarize"   // 溢出處理：old | new | summarize
    }
  }
}
```

聊天內切換：`/queue steer` 或 `/queue collect --cap 10`。

## Reply 格式

回覆格式有階層式的 prefix 設定：global → channel → account。支援 threaded reply，各頻道可設定 threading mode。

## Hook 系統

兩個攔截點：

| 類型 | 可用 Hook |
|---|---|
| **Gateway hooks** | `agent:bootstrap`、`/new`、`/reset` 等生命週期事件 |
| **Plugin hooks** | `before_model_resolve`、`before_prompt_build`、`before_tool_call`、訊息生命週期 |

## 整體來說

Agent Loop 的設計重點是**串行安全 + 串流體驗**。每個 session 內部串行避免衝突，但多個 session 可以並行。Streaming 把長回覆切成自然的區塊送到聊天 app，Queue 處理「AI 還在想的時候又收到訊息」的情境。

理解了這個流程，才能知道 debounce、queue mode、streaming chunk 這些設定在調什麼。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/concepts/agent-loop.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/agent-loop.md) — Agent Loop 執行迴圈
- [docs/concepts/streaming.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/streaming.md) — Streaming 與 Chunking
- [docs/concepts/messages.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/messages.md) — 訊息處理流程
- [docs/concepts/queue.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/queue.md) — Command Queue
- [docs/concepts/typing-indicators.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/typing-indicators.md) — Typing Indicators
- [docs/concepts/retry.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/retry.md) — Retry 策略
