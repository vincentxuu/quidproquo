---
title: "Cloudflare Workers AI Model Picking Guide: By Use Case, Price, and Context"
date: 2026-08-18
type: guide
category: ai
tags: [cloudflare-workers-ai, llm, pricing, embedding, cloudflare-workers]
lang: en
tldr: "The Workers AI catalog currently holds 83 models. For general chat pick glm-4.7-flash ($0.06 / $0.40 per M, 131K context), for vision pick gemma-4-26b-a4b-it ($0.10 / $0.30, 256K), for cheap high-volume steps pick granite-4.0-h-micro ($0.017 / $0.11), and for embeddings pick qwen3-embedding-0.6b or bge-m3 (both $0.012 per M). This post is updated on a schedule."
description: "A Workers AI selection table built from Cloudflare's official model catalog and pricing page: tiered text-generation comparison, embeddings and reranking, image and speech models, Neurons billing, and migration advice after the 2026-05-30 deprecation wave. Continuously updated."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-workers-ai-model-guide)

The Workers AI catalog turns over fast. The last big sweep was on 2026-05-30, which removed 18 model IDs at once — the entire Llama 2 / 3 / 3.1 line, Mistral 7B, and Gemma 3 12B. The first line of code in a lot of tutorials has been broken since that day.

This is a reference table built from the official [model catalog](https://developers.cloudflare.com/workers-ai/models/) and [pricing page](https://developers.cloudflare.com/workers-ai/platform/pricing/), and it gets updated on a schedule.

**Snapshot date**: 2026-08-18. The catalog page reads Last updated 2026-08-12 and lists **83 models**; the pricing page reads Last updated 2026-08-14.

Every context window and price below comes from the individual official model page, not from the upstream model's own spec. The same open model is often served with a shortened context window on Workers AI — `gemma-3-12b-it` ships with 128K upstream but was served at 80,000 tokens before it was removed.

## The one-minute answer

| Need | Pick | Price (in / out per M tokens) |
|---|---|---|
| General chat, RAG generation | [`@cf/zai-org/glm-4.7-flash`](https://developers.cloudflare.com/workers-ai/models/glm-4.7-flash/) | $0.06 / $0.40 |
| Image understanding | [`@cf/google/gemma-4-26b-a4b-it`](https://developers.cloudflare.com/workers-ai/models/gemma-4-26b-a4b-it/) | $0.10 / $0.30 |
| Classification, routing, extraction (cheapest) | [`@cf/ibm-granite/granite-4.0-h-micro`](https://developers.cloudflare.com/workers-ai/models/granite-4.0-h-micro/) | $0.017 / $0.11 |
| Reasoning-heavy work | [`@cf/openai/gpt-oss-120b`](https://developers.cloudflare.com/workers-ai/models/gpt-oss-120b/) | $0.35 / $0.75 |
| Agentic / coding (paid plan required) | [`@cf/moonshotai/kimi-k2.7-code`](https://developers.cloudflare.com/workers-ai/models/kimi-k2.7-code/) | $0.95 / $4.00 |
| Embeddings | [`@cf/qwen/qwen3-embedding-0.6b`](https://developers.cloudflare.com/workers-ai/models/qwen3-embedding-0.6b/) or [`@cf/baai/bge-m3`](https://developers.cloudflare.com/workers-ai/models/bge-m3/) | $0.012 (input only) |
| Reranking | [`@cf/baai/bge-reranker-base`](https://developers.cloudflare.com/workers-ai/models/bge-reranker-base/) | $0.003 |
| Image generation | [`@cf/black-forest-labs/flux-2-klein-4b`](https://developers.cloudflare.com/workers-ai/models/flux-2-klein-4b/) | $0.000059 / input 512×512 tile |
| Speech-to-text (batch) | [`@cf/openai/whisper-large-v3-turbo`](https://developers.cloudflare.com/workers-ai/models/whisper-large-v3-turbo/) | $0.0005 / audio minute |

Cloudflare pins four models on the catalog page: `kimi-k2.7-code`, `glm-4.7-flash`, `gpt-oss-120b`, and `llama-4-scout-17b-16e-instruct`. Those four are roughly the lineup Cloudflare wants you on right now.

## Text generation: three tiers

### Tier 1: everyday workhorses (no paid plan needed)

| Model | Context | in / out per M | Capabilities |
|---|---|---|---|
| [glm-4.7-flash](https://developers.cloudflare.com/workers-ai/models/glm-4.7-flash/) | 131,072 | $0.06 / $0.40 | Function calling, Reasoning |
| [gemma-4-26b-a4b-it](https://developers.cloudflare.com/workers-ai/models/gemma-4-26b-a4b-it/) | 256,000 | $0.10 / $0.30 | Function calling, Reasoning, Vision |
| [granite-4.0-h-micro](https://developers.cloudflare.com/workers-ai/models/granite-4.0-h-micro/) | 131,000 | $0.017 / $0.11 | Function calling |
| [qwen3-30b-a3b-fp8](https://developers.cloudflare.com/workers-ai/models/qwen3-30b-a3b-fp8/) | 32,768 | $0.051 / $0.335 | Function calling, Reasoning, Batch |
| [llama-4-scout-17b-16e-instruct](https://developers.cloudflare.com/workers-ai/models/llama-4-scout-17b-16e-instruct/) | 131,000 | $0.27 / $0.85 | Function calling, Vision, Batch |
| [mistral-small-3.1-24b-instruct](https://developers.cloudflare.com/workers-ai/models/mistral-small-3.1-24b-instruct/) | 128K | $0.351 / $0.555 | Function calling |

**Default to `glm-4.7-flash`.** It has the cheapest input price in this tier while still offering function calling and a 131K context window. Cloudflare's own description: "Optimized for dialogue, instruction-following, and multi-turn tool calling across 100+ languages."

**Switch to `gemma-4-26b-a4b-it` when output dominates.** The two have inverted price structures: GLM is $0.06 in / $0.40 out, Gemma 4 is $0.10 in / $0.30 out. RAG workloads are input-heavy (you stuff in retrieved documents and get back a few hundred words), which favors GLM; long-form generation is output-heavy, which favors Gemma 4. Gemma 4 also adds vision and a 256K window.

**`granite-4.0-h-micro` is the underrated one.** At $0.017 / $0.11 it is the cheapest in this tier, yet it still has function calling and 131K context. For pipeline steps that are high-volume, short, and don't need any style — intent classification, query rewriting, field extraction — it runs an order of magnitude cheaper than your main model.

**`qwen3-30b-a3b-fp8`'s 32,768-token window is the outlier here.** It won't hold a large retrieval set, so budget your context before choosing it.

### Tier 2: reasoning and long context

| Model | Context | in / out per M | Notes |
|---|---|---|---|
| [gpt-oss-120b](https://developers.cloudflare.com/workers-ai/models/gpt-oss-120b/) | 128,000 | $0.35 / $0.75 | Positioned for production, high-reasoning use |
| [gpt-oss-20b](https://developers.cloudflare.com/workers-ai/models/gpt-oss-20b/) | 128,000 | $0.20 / $0.30 | Lower-latency variant |
| [nemotron-3-120b-a12b](https://developers.cloudflare.com/workers-ai/models/nemotron-3-120b-a12b/) | 256,000 | $0.50 / $1.50 | NVIDIA, aimed at multi-agent systems |
| [deepseek-r1-distill-qwen-32b](https://developers.cloudflare.com/workers-ai/models/deepseek-r1-distill-qwen-32b/) | — | $0.497 / $4.881 | Older distilled reasoning model, expensive output |
| [qwq-32b](https://developers.cloudflare.com/workers-ai/models/qwq-32b/) | — | $0.66 / $1.00 | Same generation |

`gpt-oss-20b` deserves a callout: $0.20 / $0.30 buys 128K context plus reasoning plus function calling, and its output price undercuts `glm-4.7-flash`'s $0.40. When you need long output *and* reasoning, it is often the best answer in the catalog.

`deepseek-r1-distill-qwen-32b`'s $4.881 output price is among the highest anywhere in the catalog — 6.5× `gpt-oss-120b`. That is early-reasoning-model pricing, and there is little reason to pick it today.

### Tier 3: frontier (**paid billing required**)

Straight from the pricing page:

> Some models require a paid billing method. This applies to `@cf/moonshotai/kimi-k2.6`, `@cf/moonshotai/kimi-k2.7-code`, `@cf/zai-org/glm-5.2`, `@cf/deepseek-ai/deepseek-v4-flash-0731`, and `@cf/deepseek-ai/deepseek-v4-pro-0813`.

Calls to these five fail on Workers Free. You need Workers Paid or prepaid [AI Gateway credits](https://developers.cloudflare.com/ai-gateway/features/unified-billing/).

| Model | Context | in / cached in / out per M |
|---|---|---|
| [kimi-k2.7-code](https://developers.cloudflare.com/workers-ai/models/kimi-k2.7-code/) | 262,100 | $0.95 / $0.19 / $4.00 |
| [kimi-k2.6](https://developers.cloudflare.com/workers-ai/models/kimi-k2.6/) | 262,100 | $0.95 / $0.16 / $4.00 |
| [deepseek-v4-flash-0731](https://developers.cloudflare.com/workers-ai/models/deepseek-v4-flash-0731/) | **1,048,576** | $0.44 / $0.014 / $1.32 |
| [deepseek-v4-pro-0813](https://developers.cloudflare.com/workers-ai/models/deepseek-v4-pro-0813/) | — | $1.32 / $0.044 / $3.96 |
| [glm-5.2](https://developers.cloudflare.com/workers-ai/models/glm-5.2/) | — | $1.40 / $0.26 / $4.40 |

This tier is the only one with **cached-input pricing**, and the discount ratios differ wildly: DeepSeek V4 Flash charges $0.014 for cached input against $0.44 normal — a **1/31** ratio — while Kimi K2.6's $0.16 against $0.95 is only 1/6. For multi-turn conversations or repeatedly sending the same long prompt, that ratio drives your bill. To actually hit the cache, send the `x-session-affinity` header so requests route back to the same model instance (see the official [Prompt caching](https://developers.cloudflare.com/workers-ai/features/prompt-caching/) docs).

`deepseek-v4-flash-0731`'s 1,048,576 tokens is the only million-token context in the catalog, and at $0.44 / $1.32 it costs less than half of Kimi. If you want to drop a whole document in and ask questions about it, that is today's answer.

## Embeddings and reranking

| Model | Context | Price per M input | Notes |
|---|---|---|---|
| [qwen3-embedding-0.6b](https://developers.cloudflare.com/workers-ai/models/qwen3-embedding-0.6b/) | 8,192 | $0.012 | Multilingual, takes an `instruction` parameter |
| [bge-m3](https://developers.cloudflare.com/workers-ai/models/bge-m3/) | — | $0.012 | Multilingual, multi-granularity |
| [embeddinggemma-300m](https://developers.cloudflare.com/workers-ai/models/embeddinggemma-300m/) | — | Not listed on pricing page | 100+ languages |
| [plamo-embedding-1b](https://developers.cloudflare.com/workers-ai/models/plamo-embedding-1b/) | — | $0.019 | Japanese-specific |
| [bge-large-en-v1.5](https://developers.cloudflare.com/workers-ai/models/bge-large-en-v1.5/) | — | $0.204 | English, 1024 dims, Batch support |
| [bge-base-en-v1.5](https://developers.cloudflare.com/workers-ai/models/bge-base-en-v1.5/) | — | $0.067 | English, 768 dims |
| [bge-small-en-v1.5](https://developers.cloudflare.com/workers-ai/models/bge-small-en-v1.5/) | — | $0.020 | English, 384 dims |

For multilingual content pick `qwen3-embedding-0.6b` or `bge-m3` — both at $0.012 per M input tokens, 17× cheaper than the English-only `bge-large-en-v1.5` at $0.204, and multilingual on top of that. Even for English-only corpora there is little reason to reach for bge-large-en unless your Vectorize index is already built on it.

`qwen3-embedding-0.6b` has a parameter that is easy to miss: `instruction`, defaulting to `Given a web search query, retrieve relevant passages that answer the query`. It is an instruction-aware model, so the query side and document side should use different instructions; getting this wrong quietly costs you retrieval quality.

**Changing embedding models means rebuilding the whole index.** Dimensions differ, and the vector spaces are unrelated, so old and new vectors cannot share a Vectorize index. That makes the embedding choice much harder to reverse than the LLM choice, and worth evaluating carefully up front.

Reranking has exactly one option: `bge-reranker-base` at $0.003 per M input tokens — the cheapest line item in the whole catalog. Adding a rerank stage after hybrid search costs almost nothing and is the highest-leverage retrieval improvement available.

## Image, speech, and everything else

**Image generation:**

| Model | Price |
|---|---|
| [flux-2-klein-4b](https://developers.cloudflare.com/workers-ai/models/flux-2-klein-4b/) | $0.000059 / input 512×512 tile, $0.000287 / output tile |
| [flux-2-klein-9b](https://developers.cloudflare.com/workers-ai/models/flux-2-klein-9b/) | $0.015 / first MP, $0.002 / subsequent MP |
| [flux-1-schnell](https://developers.cloudflare.com/workers-ai/models/flux-1-schnell/) | $0.0000528 / tile, $0.0001056 / step |
| [lucid-origin](https://developers.cloudflare.com/workers-ai/models/lucid-origin/) (Leonardo) | $0.006996 / tile, $0.000132 / step |

The FLUX.2 [klein] models unify generation and editing; the 4B is cheap enough for live previews, and the 9B is the step up when quality matters.

**Speech:**

| Model | Use | Price |
|---|---|---|
| [whisper-large-v3-turbo](https://developers.cloudflare.com/workers-ai/models/whisper-large-v3-turbo/) | ASR, batch | $0.0005 / audio minute |
| [nova-3](https://developers.cloudflare.com/workers-ai/models/nova-3/) (Deepgram) | ASR, real-time | $0.0052 / min ($0.0092 over WebSocket) |
| [flux](https://developers.cloudflare.com/workers-ai/models/flux/) (Deepgram) | ASR built for voice agents | $0.0077 / min |
| [aura-2-en](https://developers.cloudflare.com/workers-ai/models/aura-2-en/) / [aura-2-es](https://developers.cloudflare.com/workers-ai/models/aura-2-es/) | TTS | $0.030 / 1k characters |
| [melotts](https://developers.cloudflare.com/workers-ai/models/melotts/) | TTS, multilingual | $0.0002 / audio minute |
| [smart-turn-v2](https://developers.cloudflare.com/workers-ai/models/smart-turn-v2/) | Turn detection | $0.00033795 / min |

For offline transcription use Whisper turbo at $0.0005/min — 10× cheaper than Deepgram Nova-3. Reach for the Deepgram line only when you need real-time streaming or are building a voice agent.

**Everything else**: `moondream3.1-9B-A2B` (visual reasoning, $0.30 / $1.00), `m2m100-1.2b` and `indictrans2-en-indic-1B` (translation, $0.342 each), `llama-guard-3-8b` (content safety classification), and `distilbert-sst-2-int8` (sentiment, $0.026).

## Billing: Neurons and the free allocation

Workers AI bills in Neurons underneath. From the pricing page:

> Workers AI is included in both the Free and Paid Workers plans and is priced at **$0.011 per 1,000 Neurons**. Our free allocation allows anyone to use a total of **10,000 Neurons per day at no charge**.

The allocation resets daily at 00:00 UTC. How far 10,000 Neurons goes depends entirely on the model: `glm-4.7-flash` costs 5,500 neurons per M input tokens, so the free tier is roughly 1.8M input tokens a day; `kimi-k2.6` at 86,364 neurons per M input leaves you about 110K tokens. Validating a pipeline on a cheap model before switching to a large one saves real money in that order.

Three things that catch people out:

1. **Exceeding any limit fails the request** rather than throttling it. Handle the error path before you ship.
2. **Paid frontier models do not draw from the free allocation** — Workers Free calls are rejected outright.
3. **Prepaid AI Gateway credits can pay for Workers AI.** Set the gateway's Workers AI billing to Unified billing; Cloudflare also notes that frontier-model requests paid with prepaid credits get higher rate limits.

## Models disappear: collapse model IDs into one constant

The full 2026-05-30 removal list is worth pasting as a cautionary note: `kimi-k2.5` (auto-aliased to k2.6, at a higher price), `meta-llama-3-8b-instruct`, `llama-3-8b-instruct` (+awq), `llama-3.1-8b-instruct` (+awq), `llama-3.1-70b-instruct`, `llama-2-7b-chat-int8`, `llama-2-7b-chat-fp16`, `mistral-7b-instruct-v0.1`, `mistral-7b-instruct-v0.2`, `gemma-7b-it`, `gemma-3-12b-it`, `hermes-2-pro-mistral-7b`, `phi-2`, `sqlcoder-7b-2`, `uform-gen2-qwen-500m`, and `bart-large-cnn`.

Cloudflare's recommended replacements:

> We recommend migrating to newer models such as `@cf/zai-org/glm-4.7-flash` for fast tool-calling, `@cf/google/gemma-4-26b-a4b-it` for an efficient open model, or `@cf/moonshotai/kimi-k2.6` for a capable tool-calling and vision model.

The engineering lesson matters more than the model choice: **a model ID is a config value with an expiry date, not a string literal**. Collapse it into one place.

```typescript
// src/lib/ai/models.ts
export const MODELS = {
  chat: '@cf/zai-org/glm-4.7-flash',
  vision: '@cf/google/gemma-4-26b-a4b-it',
  classify: '@cf/ibm-granite/granite-4.0-h-micro',
  embed: '@cf/qwen/qwen3-embedding-0.6b',
  rerank: '@cf/baai/bge-reranker-base',
} as const

// Call sites reference the purpose, never the model ID
const answer = await env.AI.run(MODELS.chat, { messages, stream: true })
```

Then a swap touches one file. Pair it with a feature flag so old and new models can run side by side for a while, and you can roll back when something breaks.

One more detail: the `-fast` and `-lora` variants were not part of the sweep. `llama-3.1-8b-instruct` is gone, but `llama-3.1-8b-instruct-fast` is still live.

## A selection procedure

In practice this order gets you there faster than reading the tables:

1. **Check the hard requirements first** — vision, function calling, very long context. These eliminate most of the candidates immediately.
2. **Estimate your input : output ratio.** RAG is input-heavy (favor cheap-input models like GLM); long-form writing is output-heavy (favor cheap-output models like Gemma 4).
3. **Look for pipeline steps you can downgrade.** Push classification, routing, and query rewriting to `granite-4.0-h-micro` and save the main model for final generation.
4. **Confirm your plan.** Kimi, GLM-5.2, and DeepSeek V4 require Workers Paid or prepaid AI Gateway credits.
5. **Tune prompts last.** Always re-run your evaluation after a model swap, especially for JSON formatting instructions that lean on specific phrasing.

## How this post is maintained

This is an article with an expiry date, so the update rules live here:

- Re-check the catalog and pricing pages **quarterly, or whenever the official changelog announces a deprecation**, and record the diff in the update log below.
- Compare three things on each pass: total model count, the pinned list, and the pricing table. Prices and context windows always come from the individual official model page, never from third-party summaries.
- A new model only enters the tables when it **changes the best answer for some use case**. The goal is not to mirror every entry in the catalog.
- Removed models stay in the migration section rather than being deleted — readers still have code calling them.

## References

- [Workers AI model catalog](https://developers.cloudflare.com/workers-ai/models/) — source for every model listed and its context window
- [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) — Neurons, free allocation, and per-model rates
- [Workers AI changelog](https://developers.cloudflare.com/workers-ai/changelog/) — the 2026-05-30 removal list and official replacement guidance
- [Workers AI limits](https://developers.cloudflare.com/workers-ai/platform/limits/)
- [Prompt caching](https://developers.cloudflare.com/workers-ai/features/prompt-caching/) — `x-session-affinity` and cache hit rates
- [AI Gateway unified billing](https://developers.cloudflare.com/ai-gateway/features/unified-billing/) — paying for Workers AI with prepaid credits
- [Workers AI bindings configuration](https://developers.cloudflare.com/workers-ai/configuration/bindings/)
- [Gemma on Cloudflare Workers AI: A Pragmatic Choice for Traditional Chinese](/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai-en) — Gemma 3's removal and the migration to Gemma 4
- [The Full Cloudflare Workers AI Binding: More Than run()](/posts/tech/2026-04-17-cloudflare-workers-ai-binding-utilities-en) — `toMarkdown`, `autorag`, `gateway`, and the other binding methods
