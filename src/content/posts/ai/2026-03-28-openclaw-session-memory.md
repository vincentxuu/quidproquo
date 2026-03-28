---
title: "OpenClaw Session、Memory 與 Compaction"
date: 2026-03-28
category: ai
tags: [openclaw, session, memory, compaction, context-engine, pruning]
lang: zh-TW
tldr: "OpenClaw 的 session 支援 4 種 DM 隔離層級，Memory 是 Markdown 檔案，Compaction 在 context 快滿時自動摘要壓縮。"
description: "OpenClaw 的 Session 管理、DM Scope 隔離、Memory 機制、Context Window Compaction 與 Session Pruning。"
draft: false
---

Agent 需要記住對話、需要知道跟誰在聊、需要在 context window 快滿時做出取捨。這篇講 OpenClaw 的 Session 管理、Memory 機制、和 Compaction 壓縮策略。

## Session 管理

### 基本架構

Session 由 Gateway 擁有（不是 client）。UI 要查 session 列表得問 Gateway，不能自己讀本地檔案。

存放位置：`~/.openclaw/agents/<agentId>/sessions/sessions.json`，transcript 是 JSONL 格式，用 tree structure（id/parentId linking）。

### Session Key 格式

| 類型 | Key 格式 |
|---|---|
| Direct chat | `agent:<agentId>:direct:<peerId>` 或 `main` |
| Group | `agent:<agentId>:<channel>:group:<id>` |
| Cron | `cron:<jobId>` |
| Hook | `hook:<uuid>` |
| Node | `node-<nodeId>` |

### DM Scope（隔離層級）

`session.dmScope` 控制直接訊息怎麼分組：

| 模式 | 行為 | 適合 |
|---|---|---|
| `main`（預設）| 所有 DM 共享一個 session | 個人使用，跨裝置連續 |
| `per-peer` | 按發送者隔離 | 多人存取 |
| `per-channel-peer` | 按頻道 + 發送者隔離 | 多用戶收件箱 |
| `per-account-channel-peer` | 按帳號 + 頻道 + 發送者 | 多帳號設定 |

**安全警告：** 如果你的 agent 會收到多人 DM，**不要用預設的 `main`**。否則所有人共享對話 context，會洩漏私人資訊。

### Identity Links

用 `session.identityLinks` 把不同平台的同一人對應到同一身份：

```json5
{
  session: {
    identityLinks: {
      "whatsapp:+15551234567": "alice",
      "telegram:alice_t": "alice"
    }
  }
}
```

這樣 Alice 從 WhatsApp 或 Telegram 發訊息會共享同一個 DM session。

### Session 生命週期

- **每日重置** — 預設凌晨 4:00（本地 Gateway 時區）
- **閒置重置** — 可選的滑動視窗，跟每日重置取先到期者
- **手動觸發** — `/new`（新 session）和 `/reset`（重置）
- **Cron job** — 每次執行都產生新 session ID

### 維護設定

```json5
{
  session: {
    maintenance: {
      mode: "warn",       // warn（只報告）| enforce（自動清理）
      pruneAfterDays: 30,
      maxEntries: 500,
      rotationThresholdMb: 10
    }
  }
}
```

正式環境建議 `enforce`。

```bash
# 預覽清理
openclaw sessions cleanup --dry-run
```

### Session Tools

Agent 可以跨 session 互動（預設關閉，需設定 policy）：

| 工具 | 用途 |
|---|---|
| `sessions_list` | 列出可用 session |
| `sessions_history` | 取得 transcript |
| `sessions_send` | 對其他 session 發訊息 |
| `sessions_spawn` | 建立隔離的子 session |

Sandbox 環境下，只能看到當前 session 和它 spawn 的子 session。

## Memory

OpenClaw 的 Memory 是**純 Markdown 檔案**，存在 Workspace 裡。模型只保留寫到磁碟的東西，不靠 RAM。

### 兩層結構

**每日記憶** — `memory/YYYY-MM-DD.md`，append-only。Session 啟動時載入今天和昨天的。

**長期記憶** — `MEMORY.md`（選配），存持久的決定和偏好。只在私人 session 載入（不在群組 context 裡）。

### 什麼存哪裡

| 存到 `MEMORY.md` | 存到 `memory/YYYY-MM-DD.md` |
|---|---|
| 持久決定 | 每日筆記 |
| 使用者偏好 | 當天 context |
| 長期事實 | 跑步中的紀錄 |

### Memory Tools

| 工具 | 功能 |
|---|---|
| `memory_search` | 語意搜尋，跨所有 memory snippet |
| `memory_get` | 取得特定檔案/行範圍（檔案不存在時回空字串，不報錯）|

### 自動 Memory Flush

Compaction 之前，OpenClaw 會觸發一個 **silent agentic turn**，讓模型把重要記憶寫到磁碟。

觸發條件：token 估算接近 `contextWindow - reserveTokensFloor - softThresholdTokens`。

設定在 `agents.defaults.compaction.memoryFlush`。Workspace 是 read-only 時跳過。

### Vector Search

支援混合搜尋：BM25 關鍵字 + vector 相似度。多個 embedding provider 可用（OpenAI、Gemini、Voyage、Mistral、Ollama）。

## Compaction（壓縮）

Context window 有上限。當對話太長，OpenClaw 把舊對話摘要成一則 compact summary entry。

### Compaction ≠ Pruning

| | Compaction | Pruning |
|---|---|---|
| 做什麼 | 建立摘要，寫入 session JSONL | 暫時移除舊 tool result |
| 持久化 | ✅ | ❌ 只在 memory，per-request |
| 觸發條件 | Context 接近上限 | Cache TTL 過期 |

### 自動 vs 手動

**Auto-compaction：** Context 快滿時自動觸發，使用者看到 `🧹 Auto-compaction complete`。

**手動：** `/compact` 或 `/compact Focus on decisions and open questions`（帶指令）。

### 設定

```json5
{
  agents: {
    defaults: {
      compaction: {
        model: "openrouter/anthropic/claude-sonnet-4-6",  // 可用不同模型做摘要
        identifierPolicy: "strict",  // strict | off | custom
        memoryFlush: { /* ... */ }
      }
    }
  }
}
```

用不同模型做摘要很實用——主模型是本地小模型時，摘要可以用更強的雲端模型。

### OpenAI Server-Side Compaction

如果用 OpenAI 且 `store` 和 `context_management` 都開了，OpenAI 的 server-side compaction 會跟 OpenClaw 的 local compaction 並行運作。

## Session Pruning

Pruning 是 compaction 的輕量版——在 LLM call 之前暫時修剪舊 tool result，不改 session 檔。

### 觸發條件

`mode: "cache-ttl"` + 上次 Anthropic API call 超過 TTL 時間。

### 作用

只修剪 `toolResult` 訊息，保留所有 user 和 assistant 訊息。

兩種策略：
- **Soft-trim** — 保留開頭和結尾，中間插 ellipsis
- **Hard-clear** — 整個 tool result 換成 placeholder

受保護的內容：image blocks + 最近 3 則 assistant 訊息（可設定）。

### 為什麼有用

Prompt caching 有 TTL。Session 閒置超過 TTL 後，下一個 request 會 re-cache 整個 prompt。先 pruning 掉舊 tool output，可以大幅減少 `cacheWrite` token。

```json5
{
  contextPruning: {
    mode: "cache-ttl",
    ttl: "5m"  // 預設
  }
}
```

## Context Engine

Context Engine 是可插拔的元件，控制 OpenClaw 怎麼組裝模型 context。

四個生命週期點：

| 點 | 做什麼 |
|---|---|
| Ingest | 處理新訊息，存到自訂 data store |
| Assemble | 在 token budget 內組裝有序的訊息集 |
| Compact | 摘要舊歷史 |
| After Turn | 持久化狀態、背景 compaction |

內建的 `legacy` engine 保持原有行為。Plugin 開發者可以建自訂 engine（例如 DAG summary、vector retrieval），透過 `plugins.slots.contextEngine` 啟用。

`ownsCompaction: true` 表示 engine 完全管理 compaction；`false` 時 Pi 的 auto-compaction 會跟 engine 並行。

## 整體來說

Session、Memory、Compaction 三者環環相扣：

1. **Session** 決定對話的邊界（誰跟誰在哪個 session）
2. **Memory** 是跨 session 的持久記憶（寫到磁碟的 Markdown）
3. **Compaction** 處理 session 內的 context 壓力（摘要舊對話）

設好 DM Scope 確保隔離，開啟 Memory Flush 確保重要資訊不會在 compaction 時遺失，配合 Pruning 最佳化 token 成本。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/concepts/session.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/session.md) — Session 管理
- [docs/concepts/session-tool.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/session-tool.md) — Session Tools
- [docs/concepts/session-pruning.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/session-pruning.md) — Session Pruning
- [docs/concepts/memory.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/memory.md) — Memory 機制
- [docs/concepts/compaction.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/compaction.md) — Compaction
- [docs/concepts/context.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/context.md) — Context 概念
- [docs/concepts/context-engine.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/context-engine.md) — Context Engine
- [docs/reference/session-management-compaction.md](https://github.com/openclaw/openclaw/blob/main/docs/reference/session-management-compaction.md) — Session 管理與 Compaction 參考
- [docs/reference/memory-config.md](https://github.com/openclaw/openclaw/blob/main/docs/reference/memory-config.md) — Memory 設定參考
