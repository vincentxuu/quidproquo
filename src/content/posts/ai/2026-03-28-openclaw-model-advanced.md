---
title: "OpenClaw 模型進階：Failover、Prompt Caching 與 Token 計費"
date: 2026-03-28
category: ai
tags: [openclaw, model-failover, prompt-caching, token-usage, cost-optimization]
lang: zh-TW
tldr: "OpenClaw 內建 Auth 輪替 + Model Fallback 兩階段容錯，加上 Prompt Caching 省錢和完整的 Token 追蹤機制。"
description: "OpenClaw 的模型容錯機制、Prompt Caching 策略、Token 消耗追蹤與成本最佳化。"
draft: false
---

選好供應商和模型之後，下一步是讓它穩定、省錢。這篇講 OpenClaw 的三個進階模型功能：容錯切換、Prompt Caching、Token 追蹤與成本控制。

## 模型容錯（Failover）

OpenClaw 的容錯分兩階段：

```
Stage 1: 同供應商內輪替 Auth Profile（round-robin）
         ↓ 全部 cooldown
Stage 2: 切換到 fallback model
```

### Auth Profile 輪替

可以為同一個供應商設定多組 API Key。Auth profile 存在 `~/.openclaw/agents/<agentId>/agent/auth-profiles.json`。

選擇優先順序：
1. `auth.order[provider]` 明確指定的順序
2. 設定檔中的 profile（按 provider 過濾）
3. auth-profiles.json 中的 stored profile

預設排序：OAuth 優先於 API Key，同類型內按「最舊優先」（基於使用統計）。

### Session 黏著

選定 profile 後，整個 session 期間保持不變——這是為了維持 provider 端的 cache 效率。只有在 session reset、compaction 完成、或 profile 進入 cooldown 時才會切換。

### Cooldown 遞增

| 錯誤類型 | 冷卻時間 |
|---|---|
| 一般失敗 | 1 min → 5 min → 25 min → 1 hr（上限）|
| 帳單/額度失敗 | 5 hr → 10 hr → 20 hr → 24 hr（上限）|

帳單錯誤處罰更重，因為短時間內重試不會改善。

### Model Fallback

所有 profile 用完後，切換到 `agents.defaults.model.fallbacks` 的下一個模型：

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-opus-4-6",
        fallbacks: ["openai/gpt-5.4", "google/gemini-3.1-pro-preview"]
      }
    }
  }
}
```

### Thinking 降級

Extended thinking 呼叫失敗時，自動降級為普通模式，不中斷對話。這是 provider 層級的 fallback，跟 model fallback 獨立。

## Prompt Caching

模型供應商可以重用對話中不變的 prompt prefix，省 token 也省延遲。第一次 request 付 `cacheWrite` 成本，後續 matching request 享受 `cacheRead` 折扣。

### 設定

```json5
{
  agents: {
    defaults: {
      models: {
        "anthropic/claude-opus-4-6": {
          params: {
            cacheRetention: "short"  // none | short (5 min) | long (1 hr)
          }
        }
      }
    }
  }
}
```

Anthropic API Key 預設 `short`。舊設定 `cacheControlTtl: "5m"` 會自動對應到 `short`。

### 供應商支援

| 供應商 | 支援 | 備註 |
|---|---|---|
| Anthropic（直接 API）| ✅ 完整 | 未設定的 Anthropic 模型預設 `short` |
| Amazon Bedrock | ✅ | 只限 Anthropic Claude 模型，其他強制 `none` |
| OpenRouter (Anthropic) | ✅ | 自動注入 system/developer block 的 cache control |
| 其他供應商 | ❌ | 設定不生效 |

### Context Pruning + Cache TTL

防止閒置後大量 context 被重新 cache：

```json5
{
  contextPruning: {
    mode: "cache-ttl",
    ttl: "1h"
  }
}
```

### Heartbeat 保活

定期心跳訊息保持 cache window 活躍，避免閒置後 full re-cache：

```json5
{
  heartbeat: {
    every: "55m"  // 設在 cache TTL 之內，例如 1hr TTL 用 55min heartbeat
  }
}
```

### 推薦組合

**混合流量：** 主要 agent 用 `long` + heartbeat，通知型 agent 用 `none`。

**成本導向：** 基線用 `short`，開啟 cache-TTL pruning，只在需要的地方加 heartbeat。

### 診斷

```bash
# 啟用 cache trace
OPENCLAW_CACHE_TRACE=1 openclaw gateway
```

會在 JSONL 裡記錄 cache hit、write、token 節省量。

## Token 消耗追蹤

### 什麼東西會消耗 token

發送到模型的所有東西都計入 context：

- System prompt（動態組裝：tool descriptions、skills、bootstrap files、安全指引...）
- 對話歷史
- Tool calls 和 results
- 附件（圖片、音訊、檔案）
- Compaction 摘要
- Provider wrappers 和 safety headers

Bootstrap 檔案（AGENTS.md、SOUL.md 等）單檔上限 20,000 字元，總量上限 150,000 字元。

圖片會在 API call 前降尺寸，`imageMaxDimensionPx` 預設 1200。

### 監控方式

**聊天內：**
- `/status` — session 模型、context 使用量、token 數、預估費用（API key 限定）
- `/usage full` — 每則回覆附 cost footer
- `/usage tokens` — 只顯示 token 數（OAuth 時沒有金額）
- `/usage cost` — 從 session log 彙總費用

**CLI：**
- `openclaw status --usage` — 每個 provider 的 usage breakdown

### 成本計算

基於模型定價設定（USD/1M tokens），分四種費率：input、output、cache read、cache write。OAuth 認證不顯示金額。

## 10 個會產生 API 費用的功能

不只聊天會花錢：

| # | 功能 | 說明 |
|---|---|---|
| 1 | 核心模型回覆 | 主要成本來源 |
| 2 | 媒體理解 | 音訊/圖片/影片處理 |
| 3 | Memory embeddings | 語意搜尋（OpenAI/Gemini/Voyage/Mistral/Ollama）|
| 4 | Web 搜尋 | Brave/Gemini/Grok/Kimi/Perplexity |
| 5 | Web fetch | Firecrawl（選配）|
| 6 | Provider 狀態查詢 | `/status` 查 usage endpoint |
| 7 | Compaction | 自動 session 摘要 |
| 8 | Model scanning | OpenRouter 探測能力 |
| 9 | Speech/Talk | ElevenLabs TTS |
| 10 | Skills | 自訂整合的第三方 API |

## Usage Tracking

OpenClaw 直接查詢供應商的 usage endpoint，顯示的是**實際消耗**而非估算。

支援的供應商：Anthropic、GitHub Copilot、Gemini CLI、OpenAI Codex、MiniMax、z.ai 等。需要有對應的 OAuth 或 API Key 才會顯示。

## 省 Token 的方法

- `/compact` — 壓縮長對話的歷史
- 減少 tool output 大小
- 降低 `imageMaxDimensionPx`（截圖密集場景）
- 精簡 skill descriptions
- 探索性任務用小模型

## 整體來說

模型管理的三個層次：

1. **穩定**：Auth 輪替 + Model Fallback + Thinking 降級 → 確保不中斷
2. **省錢**：Prompt Caching + Context Pruning + Heartbeat → 減少重複 token
3. **可見**：Usage Tracking + `/status` + Cache Trace → 知道錢花在哪

設好 fallbacks 和 caching，大部分情況下 OpenClaw 會自己處理好。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/concepts/model-failover.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/model-failover.md) — 模型容錯機制
- [docs/reference/prompt-caching.md](https://github.com/openclaw/openclaw/blob/main/docs/reference/prompt-caching.md) — Prompt Caching 參考
- [docs/reference/token-use.md](https://github.com/openclaw/openclaw/blob/main/docs/reference/token-use.md) — Token 消耗與成本
- [docs/reference/api-usage-costs.md](https://github.com/openclaw/openclaw/blob/main/docs/reference/api-usage-costs.md) — API 費用來源
- [docs/concepts/usage-tracking.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/usage-tracking.md) — Usage Tracking
- [docs/concepts/compaction.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/compaction.md) — Compaction（壓縮）
- [docs/reference/memory-config.md](https://github.com/openclaw/openclaw/blob/main/docs/reference/memory-config.md) — Memory 設定
