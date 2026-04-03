---
title: "AI Agent 的 Cache 不只一層：從 Claude Code 的 18 種快取到 ReAct Agent 的多層設計"
date: 2026-04-03
category: ai
tags: [react-agent, cache, prompt-cache, semantic-cache, claude-code, cloudflare-kv, llm-cost-optimization]
lang: zh-TW
tldr: "拆解 Claude Code 的 18+ 種快取機制後發現：provider-level prompt cache 你做不了，但 embedding cache、tool result cache、entity cache 你不但做得了，效果還更好。附完整的 AgentCache 介面設計與 per-tool TTL 策略。"
description: "從 Claude Code 原始碼分析 AI Agent 的快取架構，設計一套適用於 ReAct Agent 的多層 cache 體系，涵蓋 semantic cache、embedding cache、tool result cache、entity cache 四層，搭配 Cloudflare KV 實作。"
draft: false
---

在為 NobodyClimb 設計 ReAct Agent 時，我花了不少時間研究 Claude Code 的快取機制。一個看起來簡單的問題——「Agent 的 cache 該怎麼做？」——拆開來才發現，Claude Code 內部有超過 18 種不同的快取，而且沒有一種是我原本想像的「語意快取」。

這篇整理我的發現，以及最終設計出的多層 cache 架構。

## Claude Code 的 18 種快取

逆向分析 Claude Code v2.1.88 的原始碼後，我把所有快取機制分成三大類：

### API Prompt Cache（最核心，但你做不了）

Claude Code 最精密的快取優化是 **Anthropic API 的 prompt caching**。每次 API 呼叫，system prompt + tool schema 大約佔 11K tokens。如果這些內容跟上一次呼叫完全相同（逐 byte 比對），Anthropic 會重用 GPU 記憶體中的 KV attention states，只收 1/10 的價格。

為了最大化命中率，Claude Code 做了幾件精細的事：

- **靜態內容前置**：system prompt 被 `SYSTEM_PROMPT_DYNAMIC_BOUNDARY` 標記分成兩段，穩定的部分放前面標記 `cache_control: ephemeral`，動態內容放後面
- **Tool schema 鎖定**：`toolSchemaCache.ts` 在 session 內第一次 render tool schema 後就鎖死 bytes，避免 feature flag 翻轉或 MCP 重連導致微小差異
- **Cache break 偵測**：`promptCacheBreakDetection.ts` 用雙階段偵測（pre-call 記錄 hash → post-call 比對 `cache_read_tokens` 下降），還能區分是 TTL 過期（5min / 1hr）還是真正的 schema 變動

**但這件事你做不了。** Prompt cache 是 provider inference engine 內部的 GPU 記憶體優化，發生在你的應用層碰不到的地方。你能做的只有「確保送出去的 prefix 盡量穩定」。

而且各家 provider 的支援程度不一：

| Provider | 機制 | 折扣 | 你要做什麼 |
|----------|------|------|-----------|
| Anthropic | `cache_control` 標記 | 90% | 標記 system prompt |
| OpenAI | 自動，prefix ≥ 1024 tokens | 50% | 不用做 |
| Google | 顯式建立 `cachedContent` 物件 | 類似 Anthropic | API 不同，需 adapter |
| GitHub Models | 同 OpenAI（Azure 底層） | 50% | 不用做 |
| Workers AI | 不支援 | 0% | 無法做 |

### 檔案 / 狀態 Cache（效能優化）

Claude Code 的第二大類快取都是為了減少重複 I/O：

- **FileStateCache**：LRU cache，100 entries + 25MB 上限，存檔案內容和 diff 狀態
- **FileReadCache**：1000 entries，用 mtime 驗證是否過期
- **Context Memoize**：`getSystemContext()`、`getUserContext()`、`getGitStatus()` 都用 `memoize` 包裝，`setSystemPromptInjection()` 觸發清除
- **WebFetch URL Cache**：LRU，50MB 上限，15 分鐘 TTL

### 應用層 Cache（運營用）

第三類是給監控和分析用的：

- **Stats Cache**：日活、token 用量統計，持久化到 `~/.claude/stats-cache.json`
- **GrowthBook Cache**：feature flag 值 + exposure dedup
- **Plugin ZIP Cache**：解壓後的 plugin 檔案，orphan 7 天後清除
- **Settings Cache**：三層合併的設定檔

### 一個重要的發現

**Claude Code 沒有語意快取。** 沒有「相似的問題回傳相同的答案」這種機制。每一次使用者輸入，都會走完整的 ReAct loop。

這不是設計疏忽——Claude Code 是開發工具，每次查詢幾乎都不同（「修這個 bug」「加這個功能」），語意快取的命中率極低。

但攀岩資訊平台不一樣。「龍洞有什麼路線」「今天龍洞天氣怎樣」這類查詢高度重複。

## 你做不了的 vs 你能做的

釐清了 Claude Code 的 18 種快取後，思路變得清晰：

```
你做不了的（Provider 層）        你能做的（應用層）
─────────────────────          ──────────────────
GPU KV Attention Cache          Semantic Cache（查詢級）
Inference Engine 優化            Embedding Cache（向量級）
Provider 內部 TTL 管理           Tool Result Cache（工具級）
                                Entity Cache（資料級）
```

而且你能做的效果更好——provider prompt cache 只省 input token 費用（90%），你自己做的 cache 命中時**省 100%**（完全不呼叫 API）。

## 四層 Cache 架構

最終設計出的架構長這樣：

```
用戶查詢進來
    │
    ▼
┌─ Layer 1: Semantic Cache ──────────────────┐
│  向量相似度 > 閾值？直接回傳快取回答        │
│  Key: vector + rag_strategy                 │
│  TTL: 30min                                 │
│  命中 → 省 100%（跳過整個 ReAct loop）      │
└─────────────┬──────────────────────────────┘
              │ miss
              ▼
┌─ Layer 2: Embedding Cache ─────────────────┐
│  同一段文字不重複 embed                      │
│  Key: hash(text + model)                    │
│  TTL: 24hr                                  │
│  命中 → 省 embedding API 費用               │
└─────────────┬──────────────────────────────┘
              │
              ▼
         進入 ReAct Loop
              │
              ▼
┌─ Layer 3: Tool Result Cache ───────────────┐
│  相同參數的 tool 呼叫不重複執行              │
│  Key: tool_name + hash(params)              │
│  TTL: per-tool（見下表）                     │
│  命中 → 省 DB 查詢 + 外部 API               │
└─────────────┬──────────────────────────────┘
              │ miss
              ▼
┌─ Layer 4: Entity Cache ────────────────────┐
│  靜態實體資料跨對話共享                      │
│  Key: entity_type + id                      │
│  TTL: 6hr                                   │
│  命中 → 省 D1 查詢                          │
└────────────────────────────────────────────┘
```

### 為什麼是四層而不是一層

一開始只規劃了 semantic cache（查詢層），但分析 ReAct loop 的實際行為後發現：

1. **Embedding 是最常被重複執行的操作**。semantic cache 要查向量、RAG 檢索也要 embed 查詢——同一句話在一個 request 裡可能被 embed 2-3 次
2. **LLM 在 ReAct loop 裡常重複呼叫同一個 tool**。例如先呼叫 `search_routes({ crag: "龍洞" })`，觀察結果後又呼叫 `search_routes({ crag: "龍洞", grade: "5.10" })`——第二次參數不同所以 miss，但如果 LLM 重新嘗試完全相同的參數，就能 hit
3. **岩場基本資料幾乎不變**。`crag_info` 和 `search_crags` 的底層資料（座標、交通、設施）更新頻率極低，6 小時的 TTL 完全合理

四層各自獨立，可以逐步上線，不需要一次全做。

## Per-Tool TTL 策略

不同 tool 的資料時效性差異很大，用統一的 TTL 不合理：

| Tool | TTL | 理由 |
|------|-----|------|
| `weather` | 30 min | 天氣預報更新頻率約 1hr，30min 是合理平衡 |
| `crag_info` | 6 hr | 岩場基本資訊（交通、設施、開放時間）極少變動 |
| `search_crags` | 6 hr | 岩場列表極少變動 |
| `search_routes` | 1 hr | 路線資料偶有更新（新評論、新評分） |
| `user_profile` | 10 min | 用戶可能剛完攀回來記錄新路線 |
| `recommend` | 5 min | 個人化推薦受 profile 影響，變動快 |
| `sql_query` | 5 min | 結構化數據可能有即時寫入 |

設計原則：**TTL 由資料的變動頻率決定，不是由查詢頻率決定。**

天氣 API 可能一小時才更新一次，但同一個岩場的天氣在 30 分鐘內被查 50 次是正常的（多人同時問）。反過來，`recommend` 雖然查詢頻率低，但因為依賴 `user_profile`，而 profile 可能隨時更新，所以 TTL 要短。

## AgentCache 介面設計

底層用 Cloudflare KV（原生支援 TTL），介面刻意保持簡單：

```typescript
interface AgentCache {
  get<T>(namespace: string, key: string): Promise<T | null>
  set<T>(namespace: string, key: string, data: T, ttlSeconds: number): Promise<void>
  invalidate(namespace: string, key?: string): Promise<void>
}
```

`namespace` 是關鍵設計：用來隔離不同類型的 cache，方便監控和批次清除。

命名慣例：
- `embedding` — 文字向量快取
- `tool:weather` — weather tool 的執行結果
- `tool:search_routes` — search_routes tool 的執行結果
- `entity:crag` — 岩場靜態資料

注入 `ToolContext`，tool 實作內一行就能用：

```typescript
async execute(params, ctx) {
  const key = `${params.crag_id}:${params.date}`
  const cached = await ctx.cache.get('tool:weather', key)
  if (cached) return cached

  const result = await fetchWeatherAPI(params)
  await ctx.cache.set('tool:weather', key, result, 1800) // 30min
  return result
}
```

選 Cloudflare KV 而不是 in-memory cache 的理由：

1. **Workers 是 stateless**。每個 request 可能跑在不同的 isolate，in-memory cache 無法跨 request 共享
2. **KV 原生支援 `expirationTtl`**。不需要自己管理過期，設定秒數就好
3. **全球邊緣節點**。KV 的讀取延遲通常 < 10ms，比查 D1 或呼叫外部 API 快很多
4. **已經在用了**。NobodyClimb 的 backend 已經綁了 KV binding

## 錯誤不快取

一個容易忽略的細節：**tool 執行失敗的結果不應該寫入 cache。**

ReAct Agent 的設計是 tool 失敗時包成 `is_error: true` 送回 LLM，讓 LLM 決定下一步。如果把錯誤結果快取了，後續的相同呼叫會直接拿到錯誤，LLM 永遠看不到正確結果。

```typescript
// engine 層的 cache 邏輯
const cacheKey = hashParams(tool.name, input)
const cached = await ctx.cache.get(`tool:${tool.name}`, cacheKey)
if (cached) return cached

const result = await tool.execute(input, ctx)

// 只快取成功的結果
if (!result.is_error && tool.cacheTTL > 0) {
  await ctx.cache.set(`tool:${tool.name}`, cacheKey, result, tool.cacheTTL)
}
return result
```

## 與 Provider Prompt Cache 的疊加效果

四層 cache 和 provider prompt cache 不衝突，疊加效果最好：

```
查詢進來
    │
    ▼
Semantic Cache 命中？ ──是──→ 直接回覆（省 100%）
    │ 否
    ▼
進入 ReAct loop（假設 5 turns）
    │
    Turn 1: Prompt Cache miss（首次，provider 寫入 cache）
    Turn 2: Prompt Cache hit（省 90% input tokens）
            + Tool Result Cache hit（省 DB 查詢）
    Turn 3: Prompt Cache hit + Tool Result Cache hit
    ...
```

以一個 5-turn 對話為例（system prompt + 7 tools ≈ 8K tokens）：

| 場景 | Input Token 費用 | Tool 執行次數 |
|------|----------------|--------------|
| 無任何 cache | 8K × 5 = 40K tokens | 5-10 次 |
| 只有 prompt cache (Anthropic) | 8K + 0.8K × 4 = 11.2K | 5-10 次 |
| prompt cache + tool result cache | 11.2K tokens | 2-4 次 |
| semantic cache 命中 | 0 tokens | 0 次 |

## 守衛優先順序

把 cache 融入 ReAct engine 的守衛系統後，完整的檢查順序是：

```
semantic_cache → embedding_cache → input_guard → (進入 loop) → tool_result_cache → token_budget → maxTurns → end_turn
```

邏輯：
- **semantic_cache 最先**：命中就完全不用做任何事
- **embedding_cache 在 input_guard 前**：embed 查詢本身不涉及安全性
- **input_guard 在 loop 前**：有害輸入不應進入 loop
- **tool_result_cache 在 loop 內**：每次 tool 執行前檢查
- **token_budget 在 maxTurns 前**：token 花光比輪數到更緊急

## 整體來說

設計 Agent cache 不是「加一層 Redis」這麼簡單。不同層級的快取解決不同的問題：

- **Provider prompt cache**：你做不了，但可以透過穩定 prefix 來最大化命中率
- **Semantic cache**：省最多（100%），但命中率取決於查詢的重複度
- **Embedding cache**：最容易被忽略，但命中率最高（同一文字的向量不會變）
- **Tool result cache**：per-tool TTL 是關鍵設計，資料時效性差異大
- **Entity cache**：靜態資料的長 TTL 快取，跨對話共享

核心取捨是 **資料新鮮度 vs 成本/延遲**。TTL 太長會回舊資料，太短形同沒有。沒有通用答案，只能根據每種資料的實際更新頻率來設定。

---

## 參考資料

- [Anthropic Prompt Caching Documentation](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
- [OpenAI Prompt Caching Guide](https://platform.openai.com/docs/guides/prompt-caching)
- [Google Gemini Context Caching](https://ai.google.dev/gemini-api/docs/caching)
- [Cloudflare KV Documentation](https://developers.cloudflare.com/kv/)
- [ReAct: Synergizing Reasoning and Acting in Language Models (Yao et al., 2022)](https://arxiv.org/abs/2210.03629)
