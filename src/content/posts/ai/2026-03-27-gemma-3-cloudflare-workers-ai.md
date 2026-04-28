---
title: "Gemma on Cloudflare Workers AI：繁中應用的務實選擇"
date: 2026-04-28
type: guide
category: ai
tags: [gemma, cloudflare-workers-ai, llm, traditional-chinese]
lang: zh-TW
tldr: "在 Cloudflare Workers AI 上跑 LLM，gemma-3-12b-it 的繁體中文指令跟隨比 llama-3.1-8b-instruct 明顯更好；2026 年 Gemma 4 上線後多了 Vision、Function calling 與 256K context，視需求升級。"
description: "為什麼選 gemma-3-12b-it 而不是 llama，Cloudflare Workers AI 的使用方式、限制與取捨，以及實際在 nobodyclimb 繁中 RAG 系統中的表現觀察。2026 年更新：Gemma 4 (gemma-4-26b-a4b-it) 已上線，帶來 256K context 與多模態能力。"
draft: false
---

選 LLM 不是選「最強的那個」，是選「在你的限制條件下夠用的那個」。nobodyclimb 跑在 Cloudflare Workers 上，AI 推論也繼續留在 Cloudflare 生態系——`@cf/google/gemma-3-12b-it` 是在這個限制下最好用的選項。

> **2026-04 更新**：Cloudflare Workers AI 已上線 `@cf/google/gemma-4-26b-a4b-it`，帶來 256K context window、Vision 與 Function calling 支援。本文底部有 [Gemma 4 對比章節](#gemma-4-2026-年更新)。

## Cloudflare Workers AI 是什麼

Cloudflare Workers AI 是 Cloudflare 的推論服務，讓你在 Workers 環境直接呼叫 hosted 模型，不需要管 GPU 基礎設施。計費按 token 用量。

支援的模型涵蓋 text generation、embedding、image generation、speech-to-text 等類別。在 LLM 這塊，目前有 Llama、Mistral、Gemma、Qwen 等主流開源模型。

```typescript
// Workers 環境裡，binding 就是這樣用
const response = await env.AI.run("@cf/google/gemma-3-12b-it", {
  messages: [
    { role: "system", content: "你是一個台灣攀岩社群的 AI 助手。" },
    { role: "user", content: "龍洞有哪些適合初學者的路線？" }
  ],
  max_tokens: 1024,
  stream: true,
});
```

相比自己架推論服務，好處是明顯的：不需要管 GPU、不需要 model serving 的 ops 工作、跟 Workers 的其他 binding（D1、KV、Vectorize）在同一個環境。

## 為什麼是 gemma-3-12b-it，不是 llama-3.1-8b-instruct

nobodyclimb 早期用的是 `llama-3.1-8b-instruct`。換掉的主要原因：

**繁體中文指令跟隨**：Llama 3.1 8B 的繁體中文輸出品質不穩定，偶爾會夾雜簡體字，或是忽略系統提示裡的格式指令（例如「回答要包含來源連結」）。Gemma 3 在這方面明顯更可靠。

**12B vs 8B**：參數量的差距在 RAG 問答這個場景能感受到。Gemma 3 12B 對 context 的利用更好——給它 5 份檢索文件，它能更準確地整合資訊，而不是只用到前幾份。

**Gemma 3 的多語言訓練**：Google 在 Gemma 3 的訓練資料裡有更完整的多語言覆蓋，中文（包含繁體）的比例比 Llama 3.1 的公開訓練設定更高。

這不是說 Llama 不好，而是在繁體中文 RAG 這個具體 use case 上，gemma-3-12b-it 更適合。

## 基本使用方式

**非串流（適合 evaluation、background jobs）：**

```typescript
const result = await env.AI.run("@cf/google/gemma-3-12b-it", {
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userQuery }
  ],
  max_tokens: 512,
});

const answer = result.response; // string
```

**串流（適合使用者介面）：**

```typescript
const stream = await env.AI.run("@cf/google/gemma-3-12b-it", {
  messages: [...],
  stream: true,
});

// 搭配 Hono 的 streamSSE
return streamSSE(c, async (sseStream) => {
  for await (const chunk of stream) {
    if (chunk.response) {
      await sseStream.writeSSE({ data: chunk.response });
    }
  }
});
```

**JSON 輸出（適合結構化任務如 judge、filter-build）：**

```typescript
const result = await env.AI.run("@cf/google/gemma-3-12b-it", {
  messages: [
    {
      role: "system",
      content: "以 JSON 格式回答，格式為 { score: number, reason: string }"
    },
    { role: "user", content: `評估這個回答的品質：${answer}` }
  ],
  response_format: { type: "json_object" },
  max_tokens: 256,
});

const evaluation = JSON.parse(result.response);
```

## nobodyclimb 的使用場景

系統裡有多個 pipeline step 需要呼叫 LLM：

| Step | 任務 | 輸出類型 |
|------|------|----------|
| HyDE | 生成假設答案文件 | 純文字 |
| multi-query | 展開查詢成多個角度 | JSON array |
| filter-build | 萃取結構化搜尋條件 | JSON object |
| llm-generation | 最終回答生成 | 純文字（串流） |
| judge | 評估答案品質 | JSON object |
| agenticDecision | 判斷資訊是否足夠 | JSON boolean + reasoning |

同一個模型、不同的 prompt 工程，做截然不同的任務。這是選擇讓一個夠強的模型做所有事，而不是為每個任務選最小夠用的模型的策略——在 Cloudflare Workers AI 上，這樣管理更簡單。

## Cloudflare Workers AI 的限制

不說清楚這些，之後踩坑會很痛：

**CPU 時間限制**：Workers 有 CPU 時間上限（Paid plan 是 30 秒，但 AI 呼叫不計入 CPU 時間，計入 wall time）。pipeline 裡有多個 LLM 呼叫（HyDE + generation + judge），加起來可能超過 Workers 的執行時間限制。nobodyclimb 的解法是讓 judge 非同步寫入（不阻塞主流程），HyDE 只在複雜查詢啟用。

**模型版本不透明**：Cloudflare 管理模型版本，你不能鎖定特定 checkpoint。模型行為可能在沒有通知的情況下改變。需要有監控機制偵測輸出品質是否有異常。

**沒有 fine-tuning**：目前 Workers AI 上的 hosted 模型無法 fine-tune。領域適應只能靠 prompt engineering 和 RAG。

**冷啟動延遲**：在流量低的時段，第一次呼叫可能有較高延遲。semantic cache 可以緩解這個問題（有快取命中就不需要呼叫 LLM）。

**Context window**：gemma-3-12b-it 在 Cloudflare Workers AI 上的 context window 依據官方文件是 8192 tokens。長對話或大量檢索文件要注意不要超限。

## 跟其他選項比較

| | gemma-3-12b-it (Workers AI) | gemma-4-26b-a4b-it (Workers AI) | OpenAI GPT-4o-mini | 自架 Ollama |
|---|---|---|---|---|
| 繁中品質 | 好 | 好 | 很好 | 依模型 |
| Context window | 8K tokens | 256K tokens | 128K tokens | 依模型 |
| Vision | 無 | 有 | 有 | 依模型 |
| Function calling | 無 | 有 | 有 | 依模型 |
| 維運成本 | 零 | 零 | 零 | 高 |
| 延遲 | 中等 | 快（MoE active 4B） | 低 | 依硬體 |
| 彈性 | 低 | 低 | 中 | 高 |
| 費用結構 | Token-based | $0.10/$0.30 per M tokens | Token-based | 固定硬體成本 |

如果繁體中文品質是最高優先，GPT-4o 系列還是更強。但如果你已經在 Cloudflare 生態系，不想多維護一個 AI 服務的帳戶和 API key，Workers AI 是最順的選擇。

## 實際觀察

用了幾個月下來：

- 繁體中文的指令跟隨比 Llama 穩定，系統提示裡要求的格式（引用來源、JSON 輸出）基本上都能遵守
- 偶爾的幻覺問題靠 judge + self-reflection 機制攔截，groundedness 低於 0.5 就重試
- 12B 的推論速度不算快，串流的第一個 token 通常在 1-2 秒，完整回答（300-500 字）大約 5-8 秒
- JSON 輸出模式穩定，`response_format: { type: "json_object" }` 很少回傳格式錯誤的東西

整體判斷：在「不離開 Cloudflare 生態系」的限制下，這是目前最好的繁體中文 LLM 選項。

## Gemma 4（2026 年更新）

2026 年 Cloudflare Workers AI 上線了 `@cf/google/gemma-4-26b-a4b-it`，幾個關鍵升級值得注意：

**架構變化：MoE**  
Gemma 4 採用 Mixture-of-Experts 架構。總參數 26B，但每次推論只啟動約 4B（a4b = active 4 billion）。實際推論速度比 Gemma 3 12B 更快，同時在多數任務上表現更好。

**256K context window**  
Gemma 3 在 Workers AI 上只有 8K。Gemma 4 的 256K 是巨大的跳躍，對需要塞入大量文件的 RAG 場景直接受益。

**Vision 支援**  
可以傳入圖片做視覺理解，適合需要分析截圖、圖表的應用。

**Function calling**  
原生支援工具呼叫，比起用 prompt 硬塞 JSON 更可靠，適合 agentic workflow。

```typescript
// Gemma 4 使用方式與 Gemma 3 相同，只換 model ID
const response = await env.AI.run("@cf/google/gemma-4-26b-a4b-it", {
  messages: [
    { role: "system", content: "你是一個台灣攀岩社群的 AI 助手。" },
    { role: "user", content: "龍洞有哪些適合初學者的路線？" }
  ],
  max_tokens: 1024,
  stream: true,
});
```

**什麼時候升級到 Gemma 4？**

- 需要處理長文件或多份 context → 256K 直接解決 Gemma 3 的 8K 限制
- 需要 function calling 做 agentic 任務 → Gemma 4 原生支援
- 需要理解圖片 → Gemma 4 支援 vision
- 純文字 RAG、預算有限 → Gemma 3 12B 仍夠用，且費用結構不同（Gemma 3 沒有公開定價，Gemma 4 是 $0.10/$0.30 per M tokens）

## 參考資料

- [Cloudflare Workers AI 官方文件](https://developers.cloudflare.com/workers-ai/)
- [Workers AI：Text Generation](https://developers.cloudflare.com/workers-ai/models/text-generation/)
- [Workers AI：gemma-3-12b-it 模型頁](https://developers.cloudflare.com/workers-ai/models/gemma-3-12b-it/)
- [Workers AI：gemma-4-26b-a4b-it 模型頁](https://developers.cloudflare.com/workers-ai/models/gemma-4-26b-a4b-it/)
- [Google Gemma 3 技術報告](https://ai.google.dev/gemma/docs/gemma3)
- [NobodyClimb RAG Pipeline 架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) — gemma-3-12b-it 在 20 節點 pipeline 中的完整應用
