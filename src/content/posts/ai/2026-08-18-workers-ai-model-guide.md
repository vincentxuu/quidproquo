---
title: "Cloudflare Workers AI 模型選型指南：依用途、價格與 context 挑模型"
date: 2026-08-18
type: guide
category: ai
tags: [cloudflare-workers-ai, llm, pricing, embedding, cloudflare-workers]
lang: zh-TW
tldr: "Workers AI 目錄目前 83 個模型。通用對話選 glm-4.7-flash（$0.06 / $0.40 per M、131K context），要 vision 選 gemma-4-26b-a4b-it（$0.10 / $0.30、256K），極省成本選 granite-4.0-h-micro（$0.017 / $0.11），embedding 選 qwen3-embedding-0.6b 或 bge-m3（同為 $0.012 per M）。這篇會定期跟著官方目錄更新。"
description: "依 Cloudflare 官方模型目錄與定價頁整理的 Workers AI 選型表：文字生成分層比較、embedding 與 rerank、圖片與語音模型、Neurons 計費、2026-05-30 那波模型汰換的遷移建議。持續更新。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-18-workers-ai-model-guide-en)

Workers AI 的模型目錄換得很快。上一次大規模汰換是 2026-05-30，一口氣拿掉 18 個 model ID，包含 Llama 2 / 3 / 3.1 全系列、Mistral 7B 與 Gemma 3 12B——很多教學文裡的第一行程式碼從那天起就是壞的。

這篇是一份對照表，照官方 [模型目錄](https://developers.cloudflare.com/workers-ai/models/) 與 [定價頁](https://developers.cloudflare.com/workers-ai/platform/pricing/) 整理，會持續更新。

**快照時間**：2026-08-18。官方模型目錄頁標示 Last updated 2026-08-12，共 **83 個模型**；定價頁 Last updated 2026-08-14。

所有 context window 與價格都取自各模型的官方模型頁，不是原始模型的規格——同一個開源模型在 Workers AI 上的 context window 常常被裁短（下架前的 `gemma-3-12b-it` 原生 128K，在 Workers AI 上是 80,000 tokens）。

## 一分鐘結論

| 需求 | 選這個 | 價格（in / out per M tokens） |
|---|---|---|
| 通用對話、RAG 生成 | [`@cf/zai-org/glm-4.7-flash`](https://developers.cloudflare.com/workers-ai/models/glm-4.7-flash/) | $0.06 / $0.40 |
| 需要看圖 | [`@cf/google/gemma-4-26b-a4b-it`](https://developers.cloudflare.com/workers-ai/models/gemma-4-26b-a4b-it/) | $0.10 / $0.30 |
| 分類、路由、抽欄位（極省） | [`@cf/ibm-granite/granite-4.0-h-micro`](https://developers.cloudflare.com/workers-ai/models/granite-4.0-h-micro/) | $0.017 / $0.11 |
| 推理密集 | [`@cf/openai/gpt-oss-120b`](https://developers.cloudflare.com/workers-ai/models/gpt-oss-120b/) | $0.35 / $0.75 |
| Agentic / coding（需付費方案） | [`@cf/moonshotai/kimi-k2.7-code`](https://developers.cloudflare.com/workers-ai/models/kimi-k2.7-code/) | $0.95 / $4.00 |
| Embedding | [`@cf/qwen/qwen3-embedding-0.6b`](https://developers.cloudflare.com/workers-ai/models/qwen3-embedding-0.6b/) 或 [`@cf/baai/bge-m3`](https://developers.cloudflare.com/workers-ai/models/bge-m3/) | $0.012（僅 input） |
| Rerank | [`@cf/baai/bge-reranker-base`](https://developers.cloudflare.com/workers-ai/models/bge-reranker-base/) | $0.003 |
| 圖片生成 | [`@cf/black-forest-labs/flux-2-klein-4b`](https://developers.cloudflare.com/workers-ai/models/flux-2-klein-4b/) | $0.000059 / 輸入 512×512 tile |
| 語音轉文字（批次） | [`@cf/openai/whisper-large-v3-turbo`](https://developers.cloudflare.com/workers-ai/models/whisper-large-v3-turbo/) | $0.0005 / 音訊分鐘 |

目錄頁上 Cloudflare 自己置頂（Pinned）了四個：`kimi-k2.7-code`、`glm-4.7-flash`、`gpt-oss-120b`、`llama-4-scout-17b-16e-instruct`。這四個大致代表官方目前想推的組合。

## 文字生成：三個層級

### 第一層：日常主力（不需付費方案）

| 模型 | Context | in / out per M | 能力 |
|---|---|---|---|
| [glm-4.7-flash](https://developers.cloudflare.com/workers-ai/models/glm-4.7-flash/) | 131,072 | $0.06 / $0.40 | Function calling、Reasoning |
| [gemma-4-26b-a4b-it](https://developers.cloudflare.com/workers-ai/models/gemma-4-26b-a4b-it/) | 256,000 | $0.10 / $0.30 | Function calling、Reasoning、Vision |
| [granite-4.0-h-micro](https://developers.cloudflare.com/workers-ai/models/granite-4.0-h-micro/) | 131,000 | $0.017 / $0.11 | Function calling |
| [qwen3-30b-a3b-fp8](https://developers.cloudflare.com/workers-ai/models/qwen3-30b-a3b-fp8/) | 32,768 | $0.051 / $0.335 | Function calling、Reasoning、Batch |
| [llama-4-scout-17b-16e-instruct](https://developers.cloudflare.com/workers-ai/models/llama-4-scout-17b-16e-instruct/) | 131,000 | $0.27 / $0.85 | Function calling、Vision、Batch |
| [mistral-small-3.1-24b-instruct](https://developers.cloudflare.com/workers-ai/models/mistral-small-3.1-24b-instruct/) | 128K | $0.351 / $0.555 | Function calling |

**預設選 `glm-4.7-flash`。** 它是這一層裡輸入端最便宜、又同時具備 function calling 與 131K context 的一個，官方描述寫「Optimized for dialogue, instruction-following, and multi-turn tool calling across 100+ languages」，繁體中文在這 100+ 語言裡面。

**輸出量大就換 `gemma-4-26b-a4b-it`。** 兩者的價格結構是反的：GLM 是 $0.06 進 / $0.40 出，Gemma 4 是 $0.10 進 / $0.30 出。RAG 場景輸入通常遠大於輸出（塞了一堆檢索文件、只回三百字），GLM 划算；反過來要產長文，Gemma 4 便宜。Gemma 4 還多了 vision 與 256K context。

**`granite-4.0-h-micro` 是被低估的一個。** $0.017 / $0.11 是這一層最便宜的，但仍有 function calling 與 131K context。做意圖分類、query 改寫、欄位抽取這種「量大、每次都短、不需要文采」的 pipeline step，用它跑比用主力模型跑省一個數量級。

**`qwen3-30b-a3b-fp8` 的 32,768 context 是這層唯一的短板**，塞不下大量檢索文件，選之前先算一下你的 context 預算。

### 第二層：推理與長 context

| 模型 | Context | in / out per M | 備註 |
|---|---|---|---|
| [gpt-oss-120b](https://developers.cloudflare.com/workers-ai/models/gpt-oss-120b/) | 128,000 | $0.35 / $0.75 | 官方定位 production、high reasoning |
| [gpt-oss-20b](https://developers.cloudflare.com/workers-ai/models/gpt-oss-20b/) | 128,000 | $0.20 / $0.30 | 低延遲版 |
| [nemotron-3-120b-a12b](https://developers.cloudflare.com/workers-ai/models/nemotron-3-120b-a12b/) | 256,000 | $0.50 / $1.50 | NVIDIA，主打 multi-agent |
| [deepseek-r1-distill-qwen-32b](https://developers.cloudflare.com/workers-ai/models/deepseek-r1-distill-qwen-32b/) | — | $0.497 / $4.881 | 舊世代蒸餾推理模型，輸出很貴 |
| [qwq-32b](https://developers.cloudflare.com/workers-ai/models/qwq-32b/) | — | $0.66 / $1.00 | 同上世代 |

`gpt-oss-20b` 值得單獨提：$0.20 / $0.30 拿到 128K context 加 reasoning 加 function calling，輸出端比 `glm-4.7-flash` 的 $0.40 還便宜。要產長輸出又需要推理能力時，它常常是最佳解。

`deepseek-r1-distill-qwen-32b` 的 $4.881 輸出價是整個目錄裡最貴的幾個之一，比 `gpt-oss-120b` 貴 6.5 倍。它是早期推理模型的定價，現在沒什麼理由選它。

### 第三層：Frontier（**需要付費方案**）

定價頁明講：

> Some models require a paid billing method. This applies to `@cf/moonshotai/kimi-k2.6`, `@cf/moonshotai/kimi-k2.7-code`, `@cf/zai-org/glm-5.2`, `@cf/deepseek-ai/deepseek-v4-flash-0731`, and `@cf/deepseek-ai/deepseek-v4-pro-0813`.

Workers Free 方案打這五個會失敗，要 Workers Paid 或預付的 [AI Gateway credits](https://developers.cloudflare.com/ai-gateway/features/unified-billing/)。

| 模型 | Context | in / cached in / out per M |
|---|---|---|
| [kimi-k2.7-code](https://developers.cloudflare.com/workers-ai/models/kimi-k2.7-code/) | 262,100 | $0.95 / $0.19 / $4.00 |
| [kimi-k2.6](https://developers.cloudflare.com/workers-ai/models/kimi-k2.6/) | 262,100 | $0.95 / $0.16 / $4.00 |
| [deepseek-v4-flash-0731](https://developers.cloudflare.com/workers-ai/models/deepseek-v4-flash-0731/) | **1,048,576** | $0.44 / $0.014 / $1.32 |
| [deepseek-v4-pro-0813](https://developers.cloudflare.com/workers-ai/models/deepseek-v4-pro-0813/) | — | $1.32 / $0.044 / $3.96 |
| [glm-5.2](https://developers.cloudflare.com/workers-ai/models/glm-5.2/) | — | $1.40 / $0.26 / $4.40 |

這一層才有 **cached input 定價**，而且折扣幅度差很多：DeepSeek V4 Flash 的 cached input 是 $0.014，相對一般 input 的 $0.44 是 **1/31**；Kimi K2.6 的 $0.16 對 $0.95 只有 1/6。多輪對話或反覆送同一份長 prompt 時，這個比例直接決定帳單。要吃到快取，記得送 `x-session-affinity` header 把請求導回同一個模型實例（見官方 [Prompt caching](https://developers.cloudflare.com/workers-ai/features/prompt-caching/) 文件）。

`deepseek-v4-flash-0731` 的 1,048,576 tokens 是目錄裡唯一破百萬的 context，而且價格只有 $0.44 / $1.32，比 Kimi 便宜一半以上。要整本文件塞進去問問題，它是現在的答案。

## Embedding 與 rerank

| 模型 | Context | 價格 per M input | 備註 |
|---|---|---|---|
| [qwen3-embedding-0.6b](https://developers.cloudflare.com/workers-ai/models/qwen3-embedding-0.6b/) | 8,192 | $0.012 | 多語言，支援 `instruction` 參數 |
| [bge-m3](https://developers.cloudflare.com/workers-ai/models/bge-m3/) | — | $0.012 | 多語言、多粒度，繁中表現好 |
| [embeddinggemma-300m](https://developers.cloudflare.com/workers-ai/models/embeddinggemma-300m/) | — | 未列於定價頁 | 100+ 語言 |
| [plamo-embedding-1b](https://developers.cloudflare.com/workers-ai/models/plamo-embedding-1b/) | — | $0.019 | 日文專用 |
| [bge-large-en-v1.5](https://developers.cloudflare.com/workers-ai/models/bge-large-en-v1.5/) | — | $0.204 | 英文，1024 維，支援 Batch |
| [bge-base-en-v1.5](https://developers.cloudflare.com/workers-ai/models/bge-base-en-v1.5/) | — | $0.067 | 英文，768 維 |
| [bge-small-en-v1.5](https://developers.cloudflare.com/workers-ai/models/bge-small-en-v1.5/) | — | $0.020 | 英文，384 維 |

繁體中文內容選 `qwen3-embedding-0.6b` 或 `bge-m3`，兩者同為 $0.012 per M input tokens——比英文專用的 `bge-large-en-v1.5`（$0.204）便宜 17 倍，而且多語言。純英文語料也沒有理由選 bge-large-en，除非你的 Vectorize index 已經用它建好了。

`qwen3-embedding-0.6b` 有個容易漏掉的參數：`instruction`，預設值是 `Given a web search query, retrieve relevant passages that answer the query`。它是 instruction-aware 模型，query 端與 document 端該用不同 instruction，用錯會讓檢索品質打折。

**換 embedding 模型等於整個索引要重建**——維度不同、向量空間也不同，新舊向量不能混在同一個 Vectorize index 裡。所以 embedding 模型的選擇比 LLM 難改得多，值得先花時間評估。

Rerank 目前只有一個選項：`bge-reranker-base`，$0.003 per M input tokens，是整個目錄裡最便宜的一項。在 hybrid search 後面接一層 rerank 幾乎不花錢，是 CP 值最高的檢索改善。

## 圖片、語音與其他

**圖片生成**：

| 模型 | 價格 |
|---|---|
| [flux-2-klein-4b](https://developers.cloudflare.com/workers-ai/models/flux-2-klein-4b/) | $0.000059 / 輸入 512×512 tile、$0.000287 / 輸出 tile |
| [flux-2-klein-9b](https://developers.cloudflare.com/workers-ai/models/flux-2-klein-9b/) | $0.015 / 第一個 MP、$0.002 / 後續 MP |
| [flux-1-schnell](https://developers.cloudflare.com/workers-ai/models/flux-1-schnell/) | $0.0000528 / tile、$0.0001056 / step |
| [lucid-origin](https://developers.cloudflare.com/workers-ai/models/lucid-origin/)（Leonardo） | $0.006996 / tile、$0.000132 / step |

FLUX.2 [klein] 系列同時做生成與編輯，4B 版便宜到可以當即時預覽用；要品質再上 9B。

**語音**：

| 模型 | 用途 | 價格 |
|---|---|---|
| [whisper-large-v3-turbo](https://developers.cloudflare.com/workers-ai/models/whisper-large-v3-turbo/) | ASR，批次 | $0.0005 / 音訊分鐘 |
| [nova-3](https://developers.cloudflare.com/workers-ai/models/nova-3/)（Deepgram） | ASR，即時 | $0.0052 / 分鐘（WebSocket $0.0092） |
| [flux](https://developers.cloudflare.com/workers-ai/models/flux/)（Deepgram） | 語音 agent 專用 ASR | $0.0077 / 分鐘 |
| [aura-2-en](https://developers.cloudflare.com/workers-ai/models/aura-2-en/) / [aura-2-es](https://developers.cloudflare.com/workers-ai/models/aura-2-es/) | TTS | $0.030 / 1k 字元 |
| [melotts](https://developers.cloudflare.com/workers-ai/models/melotts/) | TTS，多語言 | $0.0002 / 音訊分鐘 |
| [smart-turn-v2](https://developers.cloudflare.com/workers-ai/models/smart-turn-v2/) | 輪替偵測 | $0.00033795 / 分鐘 |

離線轉逐字稿用 Whisper turbo（$0.0005/分鐘，比 Deepgram Nova-3 便宜 10 倍）；要即時串流或做語音 agent 才需要 Deepgram 那條線。

**其他**：`moondream3.1-9B-A2B`（視覺理解，$0.30 / $1.00）、`m2m100-1.2b` 與 `indictrans2-en-indic-1B`（翻譯，各 $0.342）、`llama-guard-3-8b`（內容安全分類）、`distilbert-sst-2-int8`（情緒分類，$0.026）。

## 計費：Neurons 與免費額度

Workers AI 的底層計價單位是 Neuron，定價頁寫得很清楚：

> Workers AI is included in both the Free and Paid Workers plans and is priced at **$0.011 per 1,000 Neurons**. Our free allocation allows anyone to use a total of **10,000 Neurons per day at no charge**.

免費額度每天 UTC 00:00 重置。10,000 Neurons 能跑多少，完全看模型——`glm-4.7-flash` 是 5,500 neurons per M input tokens，所以免費額度大約等於 180 萬 input tokens；換成 `kimi-k2.6`（86,364 neurons per M input）就只剩 11 萬 tokens 左右。先用便宜模型把流程驗通再換大模型，這個順序能省下不少冤枉錢。

三件容易踩的事：

1. **超過任一限制就直接失敗**，不是降速。上線前要處理錯誤路徑。
2. **付費 frontier 模型不吃免費額度**，Workers Free 打過去會被擋。
3. **AI Gateway 預付額度可以拿來付 Workers AI**，把 gateway 的 Workers AI billing 設成 Unified billing 即可；而且官方說明用預付額度打 frontier 模型會拿到更高的 rate limit。

## 模型會消失：把 model ID 收斂成一個常數

2026-05-30 那波汰換的完整名單，值得貼出來當警惕：`kimi-k2.5`（自動 alias 到 k2.6，但價格更高）、`meta-llama-3-8b-instruct`、`llama-3-8b-instruct`(+awq)、`llama-3.1-8b-instruct`(+awq)、`llama-3.1-70b-instruct`、`llama-2-7b-chat-int8`、`llama-2-7b-chat-fp16`、`mistral-7b-instruct-v0.1`、`mistral-7b-instruct-v0.2`、`gemma-7b-it`、`gemma-3-12b-it`、`hermes-2-pro-mistral-7b`、`phi-2`、`sqlcoder-7b-2`、`uform-gen2-qwen-500m`、`bart-large-cnn`。

官方給的替代建議是：

> We recommend migrating to newer models such as `@cf/zai-org/glm-4.7-flash` for fast tool-calling, `@cf/google/gemma-4-26b-a4b-it` for an efficient open model, or `@cf/moonshotai/kimi-k2.6` for a capable tool-calling and vision model.

這件事的工程含義比選哪個模型重要：**model ID 是會過期的設定值，不是常數字面量**。實務做法是把它收斂成一個地方——

```typescript
// src/lib/ai/models.ts
export const MODELS = {
  chat: '@cf/zai-org/glm-4.7-flash',
  vision: '@cf/google/gemma-4-26b-a4b-it',
  classify: '@cf/ibm-granite/granite-4.0-h-micro',
  embed: '@cf/qwen/qwen3-embedding-0.6b',
  rerank: '@cf/baai/bge-reranker-base',
} as const

// 呼叫端只認用途，不認 model ID
const answer = await env.AI.run(MODELS.chat, { messages, stream: true })
```

換模型時只動一個檔案。搭配 feature flag 讓新舊模型可以並行跑一段時間，出問題就切回去。

另外注意 `-fast` 與 `-lora` 變體不在汰換名單裡——`llama-3.1-8b-instruct` 被砍了，但 `llama-3.1-8b-instruct-fast` 還在。

## 選型流程

實際挑的時候照這個順序走，比對照表更快：

1. **先看要不要 vision / function calling / 超長 context**。這三個是硬條件，直接把候選砍掉一大半。
2. **估你的 input : output 比例**。RAG 是輸入重（選 GLM 這種 input 便宜的），寫作生成是輸出重（選 Gemma 4 這種 output 便宜的）。
3. **看有沒有 pipeline step 可以降級**。分類、路由、query 改寫這種塞給 `granite-4.0-h-micro`，主力模型只留給最終生成。
4. **確認方案**。要用 Kimi / GLM-5.2 / DeepSeek V4 就必須是 Workers Paid 或 AI Gateway 預付。
5. **最後才調 prompt**。換模型後 prompt 一定要重跑評估，尤其是靠特定措辭撐住的 JSON 格式指令。

## 這篇怎麼更新

這是一份會過期的文章，所以更新規則寫在這裡：

- **每季或官方 changelog 有汰換公告時**重新對一次目錄頁與定價頁，改動記在文末更新紀錄。
- 更新時比對三件事：模型總數、Pinned 名單、定價表。價格與 context window 一律以各模型的官方模型頁為準，不從第三方整理抄。
- 新增模型只有在「改變某個用途的最佳選擇」時才進表，不追求列滿目錄裡的每一個。
- 已下架的模型保留在遷移章節裡，不要直接刪掉——讀者手上的舊程式碼還在用它們。

## 更新紀錄

- 2026-08-18：首次發布。對照 2026-08-12 版目錄（83 個模型）與 2026-08-14 版定價頁。

## 參考資料

- [Workers AI 模型目錄](https://developers.cloudflare.com/workers-ai/models/) — 本文所有模型清單與 context window 的來源
- [Workers AI 定價](https://developers.cloudflare.com/workers-ai/platform/pricing/) — Neurons、免費額度與各模型單價
- [Workers AI Changelog](https://developers.cloudflare.com/workers-ai/changelog/) — 2026-05-30 汰換名單與官方替代建議
- [Workers AI 限制](https://developers.cloudflare.com/workers-ai/platform/limits/)
- [Prompt caching](https://developers.cloudflare.com/workers-ai/features/prompt-caching/) — `x-session-affinity` 與快取命中
- [AI Gateway Unified billing](https://developers.cloudflare.com/ai-gateway/features/unified-billing/) — 用預付額度付 Workers AI
- [Workers AI Bindings 設定](https://developers.cloudflare.com/workers-ai/configuration/bindings/)
- [Gemma on Cloudflare Workers AI：繁中應用的務實選擇](/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai) — Gemma 3 下架與遷移到 Gemma 4 的細節
- [Cloudflare Workers AI binding 全貌：不只是 run()](/posts/tech/2026-04-17-cloudflare-workers-ai-binding-utilities) — `toMarkdown` / `autorag` / `gateway` 等其他 binding 方法
