---
title: "Cloudflare Workers AI 模型選型指南：依用途、價格與 context 挑模型"
date: 2026-08-18
updated: 2026-11-23
type: guide
category: ai
tags: [cloudflare-workers-ai, llm, pricing, embedding, cloudflare-workers]
lang: zh-TW
tldr: "Workers AI 目錄頁列 76 個模型，扣掉 2026-11-20 已停止回應的 24 個，實際可用 52 個。通用對話選 glm-4.7-flash（$0.06 / $0.40 per M、131K context），要 vision 選 gemma-4-26b-a4b-it（$0.10 / $0.30、256K），極省成本選 granite-4.0-h-micro（$0.017 / $0.112），frontier 選 deepseek-v4.1-flash-1017 或 glm-5.3（1M context、需付費方案），embedding 選 qwen3-embedding-0.6b、bge-m3（$0.012 per M）或多模態的 embeddinggemma-2（$0.0017）。這篇會定期跟著官方目錄更新。"
description: "依 Cloudflare 官方模型目錄與定價頁整理的 Workers AI 選型表：文字生成分層比較、embedding 與 rerank、圖片與語音模型、Neurons 計費、2026-05-30 與 2026-11-20 兩波模型汰換的遷移建議。持續更新。"
draft: false
series:
  name: "Cloudflare 邊緣技術棧"
  order: 8
---

> :globe: [English version](/posts/ai/2026-08-18-workers-ai-model-guide-en)

Workers AI 的模型目錄換得很快，半年內就有兩波大規模汰換。2026-05-30 那波把 18 個 model ID 標為 deprecated，包含 Llama 2 / 3 / 3.1 全系列、Mistral 7B 與 Gemma 3 12B，這些模型的文件頁現在已從目錄撤下。2026-11-20 那波更直接：[官方公告](https://developers.cloudflare.com/changelog/post/2026-11-05-planned-model-deprecations/)寫明從當天起請求一律回 HTTP `410 Gone`（錯誤碼 `5028`），名單涵蓋 Kimi K2.6／K2.7 Code、GLM-5.2、GLM-5.3 Flash、DeepSeek V4 Flash／Pro、Nemotron 3、QwQ、Qwen3-30B，連 8 月才上架的模型都在內。兩波的日期都延後過一次（5-10 → 5-30、11-15 → 11-20），公告到生效只有兩到三週。

這篇是一份對照表，照官方 [模型目錄](https://developers.cloudflare.com/workers-ai/models/) 與 [定價頁](https://developers.cloudflare.com/workers-ai/platform/pricing/) 整理，會持續更新。

**快照時間**：2026-11-23。官方模型目錄頁列出 **76 個模型**，但其中 24 個是 2026-11-20 已停止回應、仍掛在目錄上的模型（頁面標 Deprecated 11/20/2026），實際可用 52 個；定價頁最後更新 2026-11-18，也還留著已停用模型的價格列。

所有 context window 與價格都取自各模型的官方模型頁，不是原始模型的規格——同一個開源模型在 Workers AI 上的 context window 常常被裁短（`llama-3.3-70b-instruct-fp8-fast` 原生 128K，在 Workers AI 上只有 24,000 tokens）。

## 一分鐘結論

| 需求 | 選這個 | 價格（in / out per M tokens） |
|---|---|---|
| 通用對話、RAG 生成 | [`@cf/zai-org/glm-4.7-flash`](https://developers.cloudflare.com/workers-ai/models/glm-4.7-flash/) | $0.06 / $0.40 |
| 需要看圖 | [`@cf/google/gemma-4-26b-a4b-it`](https://developers.cloudflare.com/workers-ai/models/gemma-4-26b-a4b-it/) | $0.10 / $0.30 |
| 分類、路由、抽欄位（極省） | [`@cf/ibm-granite/granite-4.0-h-micro`](https://developers.cloudflare.com/workers-ai/models/granite-4.0-h-micro/) | $0.017 / $0.112 |
| 推理密集 | [`@cf/openai/gpt-oss-120b`](https://developers.cloudflare.com/workers-ai/models/gpt-oss-120b/) | $0.35 / $0.75 |
| Agentic / coding、1M context（需付費方案） | [`@cf/deepseek-ai/deepseek-v4.1-flash-1017`](https://developers.cloudflare.com/workers-ai/models/deepseek-v4.1-flash-1017/) 或 [`@cf/zai-org/glm-5.3`](https://developers.cloudflare.com/workers-ai/models/glm-5.3/) | $0.30 / $1.20；$1.40 / $4.40 |
| 分類、路由、抽值（不生成文字） | [`@cf/cloudflare/clef-flash`](https://developers.cloudflare.com/workers-ai/models/clef-flash/) 或 [`@cf/cloudflare/clairic-flash`](https://developers.cloudflare.com/workers-ai/models/clairic-flash/) | $0.038；$0.10（僅 input） |
| Embedding | [`@cf/qwen/qwen3-embedding-0.6b`](https://developers.cloudflare.com/workers-ai/models/qwen3-embedding-0.6b/) 或 [`@cf/baai/bge-m3`](https://developers.cloudflare.com/workers-ai/models/bge-m3/) | $0.012（僅 input） |
| Rerank | [`@cf/baai/bge-reranker-base`](https://developers.cloudflare.com/workers-ai/models/bge-reranker-base/) | $0.003 |
| 圖片生成 | [`@cf/black-forest-labs/flux-2-klein-4b`](https://developers.cloudflare.com/workers-ai/models/flux-2-klein-4b/) | $0.000059 / 輸入 512×512 tile |
| 語音轉文字（批次） | [`@cf/openai/whisper-large-v3-turbo`](https://developers.cloudflare.com/workers-ai/models/whisper-large-v3-turbo/) | $0.0005 / 音訊分鐘 |

目錄頁上 Cloudflare 置頂（Pinned）的四個現在全是自家訓練的模型：`clef`、`clef-flash`、`clef-omni`、`clairic`。它們不生成文字、只輸出選項機率或型別化的值，適合放在 agent 的分類、路由與抽欄位這一層，選型細節見本站的 [Cloudflare 模型家族](/posts/tech/2026-10-22-ai-model-family-cloudflare)。

## 先看懂 model ID

模型 ID 的格式是 `@cf/<發布者>/<模型名>`，後面那串命名幾乎都在講架構，看懂能省掉查文件的時間：

```
@cf/google/gemma-4-26b-a4b-it
 │      │      │    │   │   └── it = instruction tuned，對話用；沒有 -it 的是 base model
 │      │      │    │   └────── a4b = active 4 billion，MoE 每次推論只啟動 4B
 │      │      │    └────────── 26b = 總參數 26 billion
 │      │      └─────────────── 模型家族與世代
 │      └────────────────────── 發布者（google / meta / qwen / zai-org / moonshotai ...）
 └───────────────────────────── @cf = Cloudflare 自家託管；少數舊模型是 @hf（Hugging Face）
```

其他常見後綴：

| 後綴 | 意思 | 影響 |
|---|---|---|
| `-it` / `-instruct` | 指令微調版 | 沒有這個後綴的 base model 不適合直接對話 |
| `-fp8` / `-awq` / `-int8` | 量化精度 | 便宜、快，品質略降。fp8 折衷最好，int4（awq）最激進 |
| `a3b` / `a4b` / `a12b` | MoE 的 active 參數量 | 決定實際推論成本與速度，不是總參數量 |
| `-fast` | Cloudflare 的加速部署版 | 2026-05-30 汰換時 `-fast` 與 `-lora` 變體沒被砍，但 2026-11-20 那波砍了三個 `-lora` |
| `-lora` | 可掛 LoRA adapter 的 base | 搭配 Workers AI 的 fine-tune 功能用 |

MoE（Mixture-of-Experts）在這份目錄裡已經是主流：Gemma 4、Llama 4 Scout、DeepSeek V4.1 Flash、Inkling 2 Small、Moondream 3.1 全是。它的意義是「總參數決定聰明程度，active 參數決定你付多少錢跟等多久」——`gemma-4-26b-a4b-it` 用 26B 的知識量跑出接近 4B 的速度，這是它比舊的 dense 12B 模型又快又好又便宜的原因。

## 文字生成：三個層級

### 第一層：日常主力（不需付費方案）

| 模型 | Context | in / out per M | 能力 |
|---|---|---|---|
| [glm-4.7-flash](https://developers.cloudflare.com/workers-ai/models/glm-4.7-flash/) | 131,072 | $0.06 / $0.40 | Function calling、Reasoning |
| [gemma-4-26b-a4b-it](https://developers.cloudflare.com/workers-ai/models/gemma-4-26b-a4b-it/) | 256,000 | $0.10 / $0.30 | Function calling、Reasoning、Vision |
| [granite-4.0-h-micro](https://developers.cloudflare.com/workers-ai/models/granite-4.0-h-micro/) | 131,000 | $0.017 / $0.112 | Function calling |
| [qwen3.8-27b](https://developers.cloudflare.com/workers-ai/models/qwen3.8-27b/) | 262,144 | $0.45 / $3.20 | Function calling、Reasoning、Vision、Batch |
| [llama-4-scout-17b-16e-instruct](https://developers.cloudflare.com/workers-ai/models/llama-4-scout-17b-16e-instruct/) | 131,000 | $0.27 / $0.85 | Function calling、Vision、Batch |
| [mistral-small-3.1-24b-instruct](https://developers.cloudflare.com/workers-ai/models/mistral-small-3.1-24b-instruct/) | 128,000 | $0.351 / $0.555 | Function calling |

這六個分別是什麼：

- **[glm-4.7-flash](https://developers.cloudflare.com/workers-ai/models/glm-4.7-flash/)**（智譜 / Z.ai）— 中國智譜 AI 的 GLM 系列輕量版。官方描述是「Optimized for dialogue, instruction-following, and multi-turn tool calling across 100+ languages」，主打多語言對話與多輪工具呼叫。中文（含繁體）是它的強項語言之一。
- **[gemma-4-26b-a4b-it](https://developers.cloudflare.com/workers-ai/models/gemma-4-26b-a4b-it/)**（Google）— Gemma 是 Google 用 Gemini 研究成果做的開放模型家族，第 4 代官方定位是「built from Gemini 3 research to maximize intelligence-per-parameter」。26B 總參數、4B active 的 MoE，是這一層唯一同時有 vision、reasoning 與 function calling 的。
- **[granite-4.0-h-micro](https://developers.cloudflare.com/workers-ai/models/granite-4.0-h-micro/)**（IBM）— IBM 的企業取向開放模型，官方明講設計目標是 RAG、multi-agent workflow 與邊緣部署，並強調 instruction following 與 function calling 的表現。「h-micro」是 Granite 4.0 家族裡的混合架構最小尺寸。
- **[qwen3.8-27b](https://developers.cloudflare.com/workers-ai/models/qwen3.8-27b/)**（阿里 Qwen）— 27B 的視覺語言模型，有 reasoning、function calling 與 262K context，中文能力強、支援 Batch API。它是官方在 2026-11-20 汰換公告裡推薦的兩個「小模型」替代之一（另一個是 Gemma 4），取代原本這一層的 `qwen3-30b-a3b-fp8`。
- **[llama-4-scout-17b-16e-instruct](https://developers.cloudflare.com/workers-ai/models/llama-4-scout-17b-16e-instruct/)**（Meta）— Llama 4 系列裡最小的 Scout，17B 參數配 16 個 expert，**原生多模態**（不是外掛視覺模組）。是這一層少數支援 Batch API 的模型。
- **[mistral-small-3.1-24b-instruct](https://developers.cloudflare.com/workers-ai/models/mistral-small-3.1-24b-instruct/)**（法國 Mistral AI）— 24B dense 模型，歐洲陣營的代表。有個要注意的落差：官方模型描述說它「adds state-of-the-art vision understanding」，但目錄的能力標籤只掛了 Function calling，**沒有 Vision 標籤**——要用視覺功能前先自己測。

**預設選 `glm-4.7-flash`。** 它是這一層裡輸入端最便宜、又同時具備 function calling 與 131K context 的一個，官方描述寫「Optimized for dialogue, instruction-following, and multi-turn tool calling across 100+ languages」，繁體中文在這 100+ 語言裡面。

**輸出量大就換 `gemma-4-26b-a4b-it`。** 兩者的價格結構是反的：GLM 是 $0.06 進 / $0.40 出，Gemma 4 是 $0.10 進 / $0.30 出。RAG 場景輸入通常遠大於輸出（塞了一堆檢索文件、只回三百字），GLM 划算；反過來要產長文，Gemma 4 便宜。Gemma 4 還多了 vision 與 256K context。

**`granite-4.0-h-micro` 是被低估的一個。** $0.017 / $0.112 是這一層最便宜的，但仍有 function calling 與 131K context。做意圖分類、query 改寫、欄位抽取這種「量大、每次都短、不需要文采」的 pipeline step，用它跑比用主力模型跑省一個數量級。

**`qwen3.8-27b` 的輸出價 $3.20 是這一層最貴的**，是 Gemma 4 的十倍以上。它的價值在中文、vision 與推理一次到位；輸出量大的工作先算過帳單再選。

### 第二層：推理與長 context

| 模型 | Context | in / out per M | 備註 |
|---|---|---|---|
| [gpt-oss-120b](https://developers.cloudflare.com/workers-ai/models/gpt-oss-120b/) | 128,000 | $0.35 / $0.75 | 官方定位 production、high reasoning |
| [gpt-oss-20b](https://developers.cloudflare.com/workers-ai/models/gpt-oss-20b/) | 128,000 | $0.20 / $0.30 | 低延遲版 |

- **[gpt-oss-120b / gpt-oss-20b](https://developers.cloudflare.com/workers-ai/models/gpt-oss-120b/)**（OpenAI）— OpenAI 少見的開放權重模型，官方定位是「powerful reasoning, agentic tasks, and versatile developer use cases」，120b 給生產環境的高推理需求，20b 給低延遲與特化場景。

`gpt-oss-20b` 值得單獨提：$0.20 / $0.30 拿到 128K context 加 reasoning 加 function calling，輸出端比 `glm-4.7-flash` 的 $0.40 還便宜。要產長輸出又需要推理能力時，它常常是最佳解。

這一層原本還有 NVIDIA 的 `nemotron-3-120b-a12b`、`deepseek-r1-distill-qwen-32b` 與 `qwq-32b`，三個都在 2026-11-20 停止回應。要更強的推理，現在往上一層的付費 frontier 模型走。

### 第三層：Frontier（**需要付費方案**）

定價頁列出需要付費帳務的模型，目前仍可用的是 `@cf/zai-org/glm-5.3`、`@cf/deepseek-ai/deepseek-v4.1-flash-1017` 與 `@cf/thinkingmachines/inkling-2-small`（名單上其餘幾個已在 2026-11-20 停止回應）。Workers Free 方案打這些會失敗，要 Workers Paid 或預付的 [AI Gateway credits](https://developers.cloudflare.com/ai-gateway/features/unified-billing/)。

| 模型 | Context | in / cached in / out per M | 能力 |
|---|---|---|---|
| [deepseek-v4.1-flash-1017](https://developers.cloudflare.com/workers-ai/models/deepseek-v4.1-flash-1017/) | 1,048,576 | $0.30 / $0.006 / $1.20 | Function calling、Reasoning、Vision |
| [inkling-2-small](https://developers.cloudflare.com/workers-ai/models/inkling-2-small/) | 1,048,576 | $0.30 / $0.10 / $1.00 | Function calling、Reasoning、Vision |
| [glm-5.3](https://developers.cloudflare.com/workers-ai/models/glm-5.3/) | 1,048,576 | $1.40 / $0.26 / $4.40 | Function calling、Reasoning |

這一層是什麼：

- **[deepseek-v4.1-flash-1017](https://developers.cloudflare.com/workers-ai/models/deepseek-v4.1-flash-1017/)**（DeepSeek）— 552B backbone 的多模態 MoE，prefill 啟動 8B、decode 啟動 16B 參數，官方說法是讓輸入重的 agentic 工作又快又便宜。它取代了 8 月上架的 V4 Flash／Pro，價格也比 V4 Flash（$0.44 / $1.32）更低。
- **[inkling-2-small](https://developers.cloudflare.com/workers-ai/models/inkling-2-small/)**（Thinking Machines Lab）— 594B 總參數、18B active 的多模態 MoE，2026-11-12 上架，官方稱它是 Workers AI 上第一個來自美國實驗室的 frontier 開放模型，定位是 agentic coding、看圖與工具型知識工作。
- **[glm-5.3](https://developers.cloudflare.com/workers-ai/models/glm-5.3/)**（智譜 / Z.ai）— Z.ai 的旗艦 agentic coding 模型，跟 GLM-5.2 同一個 base model、全靠後訓練進步，Workers AI 上的價格也和 GLM-5.2 相同。輸入價是同門 `glm-4.7-flash` 的 23 倍，定位與價格差一個量級。

官方在 11-20 汰換公告裡推薦的 frontier 替代就是 `deepseek-v4.1-flash-1017` 與 `glm-5.3`。原本這一層的 Kimi K2.6、Kimi K2.7 Code、GLM-5.2、GLM-5.3 Flash、DeepSeek V4 Flash／Pro 都已停用，舊程式碼裡寫死這些 ID 的會直接拿到 410。

這一層的 **cached input 折扣差很多**：DeepSeek V4.1 Flash 的 cached input 是 $0.006，相對一般 input 的 $0.30 是 **1/50**；GLM-5.3 是 $0.26 對 $1.40，約 1/5；Inkling 2 Small 只有 1/3。多輪對話或反覆送同一份長 prompt 時，這個比例直接決定帳單。要吃到快取，記得送 `x-session-affinity` header 把請求導回同一個模型實例（見官方 [Prompt caching](https://developers.cloudflare.com/workers-ai/features/prompt-caching/) 文件）。

三個都是 1,048,576 tokens 的 context。要整本文件塞進去問問題，價格最低的 `deepseek-v4.1-flash-1017` 是現在的首選；GLM-5.3 沒有 vision，貴的部分買的是 coding 與長程 agent 任務的表現。另外要記得速率限制：這類付費模型預設每帳號每模型 20 requests/min，用預付 AI Gateway credits 計費則是 50（[Limits](https://developers.cloudflare.com/workers-ai/platform/limits/)）。

## Embedding 與 rerank

| 模型 | Context | 價格 per M input | 備註 |
|---|---|---|---|
| [qwen3-embedding-0.6b](https://developers.cloudflare.com/workers-ai/models/qwen3-embedding-0.6b/) | 8,192 | $0.012 | 多語言，支援 `instruction` 參數 |
| [bge-m3](https://developers.cloudflare.com/workers-ai/models/bge-m3/) | — | $0.012 | 多語言、多粒度，繁中表現好 |
| [embeddinggemma-2](https://developers.cloudflare.com/workers-ai/models/embeddinggemma-2/) | 8,192 | $0.0017 | 多模態（文字、圖片、影片、音訊），768 維 |
| [plamo-embedding-1b](https://developers.cloudflare.com/workers-ai/models/plamo-embedding-1b/) | — | $0.019 | 日文專用 |
| [bge-large-en-v1.5](https://developers.cloudflare.com/workers-ai/models/bge-large-en-v1.5/) | — | $0.204 | 英文，1024 維，支援 Batch |
| [bge-base-en-v1.5](https://developers.cloudflare.com/workers-ai/models/bge-base-en-v1.5/) | — | $0.067 | 英文，768 維 |
| [bge-small-en-v1.5](https://developers.cloudflare.com/workers-ai/models/bge-small-en-v1.5/) | — | $0.020 | 英文，384 維 |

這幾個 embedding 模型的來歷：

- **[qwen3-embedding-0.6b](https://developers.cloudflare.com/workers-ai/models/qwen3-embedding-0.6b/)**（阿里 Qwen）— Qwen3 家族裡專做 embedding 與 ranking 的分支，instruction-aware（可以針對不同任務給不同指令）。
- **[bge-m3](https://developers.cloudflare.com/workers-ai/models/bge-m3/)**（北京智源 BAAI）— BGE 系列的多語言旗艦，名字裡的 M3 指 Multi-Functionality（dense + sparse + multi-vector 三種檢索）、Multi-Linguality、Multi-Granularity。是開源 RAG 圈最廣泛使用的 embedding 模型之一。
- **[embeddinggemma-2](https://developers.cloudflare.com/workers-ai/models/embeddinggemma-2/)**（Google DeepMind）— 2026-11-12 上架的多模態 embedding，把文字（含程式碼）、圖片、影片與音訊映到同一個 768 維空間，支援 100+ 語言，`dimensions` 可縮成 128／256／512。它取代 2026-11-20 停用的 `embeddinggemma-300m`；舊模型建的 index 要整個重建。
- **[bge-large / base / small-en-v1.5](https://developers.cloudflare.com/workers-ai/models/bge-large-en-v1.5/)**（BAAI）— 同樣出自智源，但是**純英文**的舊世代版本，三個尺寸分別輸出 1024 / 768 / 384 維向量。
- **[plamo-embedding-1b](https://developers.cloudflare.com/workers-ai/models/plamo-embedding-1b/)**（Preferred Networks）— 日本 PFN 做的日文專用 embedding，處理日文語料時值得試。
- **[bge-reranker-base](https://developers.cloudflare.com/workers-ai/models/bge-reranker-base/)**（BAAI）— 不是 embedding 模型。它吃「問題 + 文件」一組進去，直接吐相關性分數，所以精準度比向量相似度高，但不能預先算好存起來。

繁體中文內容選 `qwen3-embedding-0.6b` 或 `bge-m3`，兩者同為 $0.012 per M input tokens——比英文專用的 `bge-large-en-v1.5`（$0.204）便宜 17 倍，而且多語言。純英文語料也沒有理由選 bge-large-en，除非你的 Vectorize index 已經用它建好了。`embeddinggemma-2` 的 $0.0017 又再便宜七倍，還能把圖片與影片放進同一個 index；它上架不久，繁中檢索品質先拿自己的資料比過再換。

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

**[FLUX](https://developers.cloudflare.com/workers-ai/models/flux-2-klein-4b/)**（Black Forest Labs）是 Stable Diffusion 原班人馬出走後做的模型家族。FLUX.2 [klein] 是蒸餾過的快速版，同時做生成與編輯，4B 便宜到可以當即時預覽用，9B 是品質版；舊的 `flux-1-schnell` 是 12B 的 rectified flow transformer，仍在目錄裡。**[lucid-origin](https://developers.cloudflare.com/workers-ai/models/lucid-origin/)** 與 **[phoenix-1.0](https://developers.cloudflare.com/workers-ai/models/phoenix-1.0/)** 來自 Leonardo.AI，強項是提示詞貼合度與把文字畫對。

**語音**：

| 模型 | 用途 | 價格 |
|---|---|---|
| [whisper-large-v3-turbo](https://developers.cloudflare.com/workers-ai/models/whisper-large-v3-turbo/) | ASR，批次 | $0.0005 / 音訊分鐘 |
| [nova-3](https://developers.cloudflare.com/workers-ai/models/nova-3/)（Deepgram） | ASR，即時 | $0.0052 / 分鐘（WebSocket $0.0092） |
| [flux](https://developers.cloudflare.com/workers-ai/models/flux/)（Deepgram） | 語音 agent 專用 ASR | $0.0077 / 分鐘 |
| [aura-2-en](https://developers.cloudflare.com/workers-ai/models/aura-2-en/) / [aura-2-es](https://developers.cloudflare.com/workers-ai/models/aura-2-es/) | TTS | $0.030 / 1k 字元 |
| [smart-turn-v2](https://developers.cloudflare.com/workers-ai/models/smart-turn-v2/) | 輪替偵測 | $0.00033795 / 分鐘 |

**[Whisper](https://developers.cloudflare.com/workers-ai/models/whisper-large-v3-turbo/)**（OpenAI）是通用語音辨識的事實標準，turbo 版是 large-v3 的加速蒸餾版。**Deepgram** 那三個是商業合作模型：`nova-3` 是通用即時 ASR，`aura` 系列是會依上下文調整語速與語氣的 TTS，而 `flux`（跟 Black Forest Labs 的圖片模型同名，別搞混）官方說是「第一個專為語音 agent 打造的對話式語音辨識模型」。**[smart-turn-v2](https://developers.cloudflare.com/workers-ai/models/smart-turn-v2/)**（Pipecat）不做辨識，它只判斷「使用者講完了沒」——做語音對話最惱人的搶話問題就靠它。

離線轉逐字稿用 Whisper turbo（$0.0005/分鐘，比 Deepgram Nova-3 便宜 10 倍）；要即時串流或做語音 agent 才需要 Deepgram 那條線。原本表上的多語言 TTS `melotts` 已在 2026-11-20 停用，官方建議改用 `aura-2-en`；語音 agent 中間那顆 LLM 則多了 Pipecat 後訓練的 [`phonellm-mini-alpha-2`](https://developers.cloudflare.com/workers-ai/models/phonellm-mini-alpha-2/)（$0.06 / $0.24），不開推理模式也能穩定呼叫工具。

**其他值得知道的**：

- **[moondream3.1-9B-A2B](https://developers.cloudflare.com/workers-ai/models/moondream3.1-9B-A2B/)**（$0.30 / $1.00）— 9B MoE、2B active 的小型視覺語言模型，專攻物件偵測、指位、OCR 與結構化輸出。要從截圖或文件圖片抽資料，它比叫通用大模型看圖便宜得多。
- **[llama-guard-3-8b](https://developers.cloudflare.com/workers-ai/models/llama-guard-3-8b/)**（Meta）— 不是拿來對話的，是內容安全分類器：把 prompt 或回應丟進去，它判斷安不安全並指出違反了哪一類。要做輸入輸出護欄就用它。
- **[gemma-sea-lion-v4-27b-it](https://developers.cloudflare.com/workers-ai/models/gemma-sea-lion-v4-27b-it/)**（AI Singapore）— 為東南亞語言預訓練與指令微調的 Gemma 變體，SEA-LION = Southeast Asian Languages In One Network。做東南亞市場的產品值得評估。
- **[m2m100-1.2b](https://developers.cloudflare.com/workers-ai/models/m2m100-1.2b/)**（Meta）與 **[indictrans2-en-indic-1B](https://developers.cloudflare.com/workers-ai/models/indictrans2-en-indic-1B/)**（AI4Bharat）— 專用翻譯模型（各 $0.342）。前者多對多多語言，後者專攻印度 22 種官方語言。
- **[distilbert-sst-2-int8](https://developers.cloudflare.com/workers-ai/models/distilbert-sst-2-int8/)**（$0.026）— 情緒分類的老兵，量大時比叫 LLM 便宜。

## 計費：Neurons 與免費額度

Workers AI 的底層計價單位是 Neuron，定價頁寫得很清楚：

> Workers AI is included in both the Free and Paid Workers plans and is priced at **$0.011 per 1,000 Neurons**. Our free allocation allows anyone to use a total of **10,000 Neurons per day at no charge**.

免費額度每天 UTC 00:00 重置。10,000 Neurons 能跑多少，完全看模型——`glm-4.7-flash` 是 5,500 neurons per M input tokens，所以免費額度大約等於 180 萬 input tokens；換成 `glm-5.3`（127,273 neurons per M input）就只剩 8 萬 tokens 左右。先用便宜模型把流程驗通再換大模型，這個順序能省下不少冤枉錢。

三件容易踩的事：

1. **超過任一限制就直接失敗**，不是降速。上線前要處理錯誤路徑。
2. **付費 frontier 模型在 Workers Free 上不能用**，打過去會被擋。
3. **AI Gateway 預付額度可以拿來付 Workers AI**，把 gateway 的 Workers AI billing 設成 Unified billing 即可；而且官方說明用預付額度打 frontier 模型會拿到更高的 rate limit。

## 模型會消失：把 model ID 收斂成一個常數

兩波汰換的完整名單值得貼出來當警惕。2026-11-20 起回 410 的是：`deepseek-r1-distill-qwen-32b`、`nemotron-3-120b-a12b`、`deepseek-v4-pro-0813`、`deepseek-v4-flash-0731`、`qwq-32b`、`qwen3-30b-a3b-fp8`、`kimi-k2.6`、`kimi-k2.7-code`、`glm-5.2`、`glm-5.3-flash`、`llama-2-7b-chat-hf-lora`、`gemma-2b-it-lora`、`gemma-7b-it-lora`、`llama-3.1-8b-instruct-fp8`、`llama-3.2-1b-instruct`、`llama-3.2-3b-instruct`，以及非 LLM 的 `melotts`（→ `aura-2-en`）、`stable-diffusion-xl-base-1.0`、`stable-diffusion-v1-5-inpainting`、`stable-diffusion-xl-lightning`、`dreamshaper-8-lcm`（四者 → `flux-2-klein-9b`）、`whisper-tiny-en`（→ `nova-3`）、`llava-1.5-7b-hf`（→ `moondream3.1-9B-A2B`）、`embeddinggemma-300m`（→ `embeddinggemma-2`）。LLM 的官方替代建議是 frontier 用 `deepseek-v4.1-flash-1017` 或 `glm-5.3`，小模型用 `gemma-4-26b-a4b-it` 或 `qwen3.8-27b`。

更早的 2026-05-30 那波名單：`kimi-k2.5`（自動 alias 到 k2.6，但價格更高）、`meta-llama-3-8b-instruct`、`llama-3-8b-instruct`(+awq)、`llama-3.1-8b-instruct`(+awq)、`llama-3.1-70b-instruct`、`llama-2-7b-chat-int8`、`llama-2-7b-chat-fp16`、`mistral-7b-instruct-v0.1`、`mistral-7b-instruct-v0.2`、`gemma-7b-it`、`gemma-3-12b-it`、`hermes-2-pro-mistral-7b`、`phi-2`、`sqlcoder-7b-2`、`uform-gen2-qwen-500m`、`bart-large-cnn`。

當時官方給的替代建議是：

> We recommend migrating to newer models such as `@cf/zai-org/glm-4.7-flash` for fast tool-calling, `@cf/google/gemma-4-26b-a4b-it` for an efficient open model, or `@cf/moonshotai/kimi-k2.6` for a capable tool-calling and vision model.

三個建議裡的 `kimi-k2.6` 半年後自己也進了汰換名單。5 月 alias 過去的 `kimi-k2.5` 使用者，等於在一年內被迫換了兩次模型。

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

`-fast` 與 `-lora` 變體也不是避風港。5 月那波沒動它們，但 11-20 那波砍了 `gemma-2b-it-lora`、`gemma-7b-it-lora`、`llama-2-7b-chat-hf-lora`；`llama-3.1-8b-instruct` 系列的 `-fp8-fast` 也已不在目錄頁上。

## 選型流程

實際挑的時候照這個順序走，比對照表更快：

1. **先看要不要 vision / function calling / 超長 context**。這三個是硬條件，直接把候選砍掉一大半。
2. **估你的 input : output 比例**。RAG 是輸入重（選 GLM 這種 input 便宜的），寫作生成是輸出重（選 Gemma 4 這種 output 便宜的）。
3. **看有沒有 pipeline step 可以降級**。分類、路由、query 改寫這種塞給 `granite-4.0-h-micro`，主力模型只留給最終生成。
4. **確認方案**。要用 GLM-5.3、DeepSeek V4.1 Flash、Inkling 2 Small 就必須是 Workers Paid 或 AI Gateway 預付。
5. **最後才調 prompt**。換模型後 prompt 一定要重跑評估，尤其是靠特定措辭撐住的 JSON 格式指令。

## 這篇怎麼更新

這是一份會過期的文章，所以更新規則寫在這裡：

- **每季或官方 changelog 有汰換公告時**重新對一次目錄頁與定價頁，改動記在文末更新紀錄。
- 更新時比對三件事：模型總數、Pinned 名單、定價表。價格與 context window 一律以各模型的官方模型頁為準，不從第三方整理抄。
- 新增模型只有在「改變某個用途的最佳選擇」時才進表，不追求列滿目錄裡的每一個。
- 已下架的模型保留在遷移章節裡，不要直接刪掉——讀者手上的舊程式碼還在用它們。

## 更新紀錄

- 2026-11-23：對照 2026-11 的目錄（76 個模型，其中 24 個 11-20 停用）與 11-18 版定價頁全面翻新。frontier 層改成 `deepseek-v4.1-flash-1017`、`inkling-2-small`、`glm-5.3`（原 Kimi K2.6／K2.7 Code、GLM-5.2、DeepSeek V4 Flash／Pro 已停用）；第一層 `qwen3-30b-a3b-fp8` 換成 `qwen3.8-27b`；第二層移除已停用的 Nemotron 3、DeepSeek-R1-Distill、QwQ；embedding 以 `embeddinggemma-2` 取代 `embeddinggemma-300m`；語音表移除 `melotts`；Pinned 名單改為 Clef／Clairic 四個自研模型；補 11-20 汰換名單與付費模型的 rate limit。
- 2026-08-19：對照官方文件逐項查證翻新，易腐內容交還官方連結，並收進「Cloudflare 邊緣tech stack」系列。
- 2026-08-18：首次發布。對照 2026-08-12 版目錄（84 個模型）與 2026-08-18 版定價頁。

## 參考資料

- [Workers AI 模型目錄](https://developers.cloudflare.com/workers-ai/models/) — 本文所有模型清單與 context window 的來源
- [Workers AI 定價](https://developers.cloudflare.com/workers-ai/platform/pricing/) — Neurons、免費額度與各模型單價
- [Workers AI Changelog](https://developers.cloudflare.com/workers-ai/changelog/) — 2026-05-30 的 deprecation 名單與官方替代建議
- [Planned model deprecations on Workers AI（2026-11-05）](https://developers.cloudflare.com/changelog/post/2026-11-05-planned-model-deprecations/) — 2026-11-20 停用名單、410 行為與替代建議
- [Cloudflare 模型家族：Clef 決策模型與 Clairic 抽取模型怎麼選](/posts/tech/2026-10-22-ai-model-family-cloudflare) — 目錄置頂的四個自研模型
- [Workers AI 限制](https://developers.cloudflare.com/workers-ai/platform/limits/)
- [Prompt caching](https://developers.cloudflare.com/workers-ai/features/prompt-caching/) — `x-session-affinity` 與快取命中
- [AI Gateway Unified billing](https://developers.cloudflare.com/ai-gateway/features/unified-billing/) — 用預付額度付 Workers AI
- [Workers AI Bindings 設定](https://developers.cloudflare.com/workers-ai/configuration/bindings/)
- [Gemma on Cloudflare Workers AI：繁中應用的務實選擇](/posts/ai/2026-04-28-gemma-3-cloudflare-workers-ai) — Gemma 3 下架與遷移到 Gemma 4 的細節
- [Cloudflare Workers AI binding 全貌：不只是 run()](/posts/tech/2026-04-17-cloudflare-workers-ai-binding-utilities) — `toMarkdown` / `autorag` / `gateway` 等其他 binding 方法
