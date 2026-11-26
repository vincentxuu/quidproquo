---
title: "Cloudflare Workers AI Model Picking Guide: By Use Case, Price, and Context"
date: 2026-08-18
updated: 2026-11-23
type: guide
category: ai
tags: [cloudflare-workers-ai, llm, pricing, embedding, cloudflare-workers]
lang: en
tldr: "The Workers AI catalog page lists 76 models; subtract the 24 that stopped responding on 2026-11-20 and 52 are usable. For general chat pick glm-4.7-flash ($0.06 / $0.40 per M, 131K context), for vision pick gemma-4-26b-a4b-it ($0.10 / $0.30, 256K), for cheap high-volume steps pick granite-4.0-h-micro ($0.017 / $0.112), for frontier work pick deepseek-v4.1-flash-1017 or glm-5.3 (1M context, paid plan required), and for embeddings pick qwen3-embedding-0.6b, bge-m3 ($0.012 per M), or the multimodal embeddinggemma-2 ($0.0017). This post is updated on a schedule."
description: "A Workers AI selection table built from Cloudflare's official model catalog and pricing page: tiered text-generation comparison, embeddings and reranking, image and speech models, Neurons billing, and migration advice after the 2026-05-30 and 2026-11-20 deprecation waves. Continuously updated."
draft: false
series:
  name: "The Cloudflare Edge Stack"
  order: 8
---

> :globe: [中文版](/posts/ai/2026-08-18-workers-ai-model-guide)

The Workers AI catalog turns over fast: two large sweeps in six months. The 2026-05-30 wave marked 18 model IDs deprecated — the entire Llama 2 / 3 / 3.1 line, Mistral 7B, and Gemma 3 12B — and their doc pages have since been pulled from the catalog. The 2026-11-20 wave was blunter: [the announcement](https://developers.cloudflare.com/changelog/post/2026-11-05-planned-model-deprecations/) says requests fail with HTTP `410 Gone` (error code `5028`) from that day on, and the list covers Kimi K2.6 / K2.7 Code, GLM-5.2, GLM-5.3 Flash, DeepSeek V4 Flash / Pro, Nemotron 3, QwQ, and Qwen3-30B, including models that only arrived in August. Both dates slipped once (5-10 → 5-30, 11-15 → 11-20), and each gave two to three weeks of notice.

This is a reference table built from the official [model catalog](https://developers.cloudflare.com/workers-ai/models/) and [pricing page](https://developers.cloudflare.com/workers-ai/platform/pricing/), and it gets updated on a schedule.

**Snapshot date**: 2026-11-23. The catalog page lists **76 models**, but 24 of them stopped responding on 2026-11-20 and are still shown with a "Deprecated 11/20/2026" label, so 52 are actually usable; the pricing page was last updated 2026-11-18 and still carries rows for the retired models.

Every context window and price below comes from the individual official model page, not from the upstream model's own spec. The same open model is often served with a shortened context window on Workers AI — `llama-3.3-70b-instruct-fp8-fast` ships with 128K upstream but is served at only 24,000 tokens on Workers AI.

## The one-minute answer

| Need | Pick | Price (in / out per M tokens) |
|---|---|---|
| General chat, RAG generation | [`@cf/zai-org/glm-4.7-flash`](https://developers.cloudflare.com/workers-ai/models/glm-4.7-flash/) | $0.06 / $0.40 |
| Image understanding | [`@cf/google/gemma-4-26b-a4b-it`](https://developers.cloudflare.com/workers-ai/models/gemma-4-26b-a4b-it/) | $0.10 / $0.30 |
| Classification, routing, extraction (cheapest) | [`@cf/ibm-granite/granite-4.0-h-micro`](https://developers.cloudflare.com/workers-ai/models/granite-4.0-h-micro/) | $0.017 / $0.112 |
| Reasoning-heavy work | [`@cf/openai/gpt-oss-120b`](https://developers.cloudflare.com/workers-ai/models/gpt-oss-120b/) | $0.35 / $0.75 |
| Agentic / coding, 1M context (paid plan required) | [`@cf/deepseek-ai/deepseek-v4.1-flash-1017`](https://developers.cloudflare.com/workers-ai/models/deepseek-v4.1-flash-1017/) or [`@cf/zai-org/glm-5.3`](https://developers.cloudflare.com/workers-ai/models/glm-5.3/) | $0.30 / $1.20; $1.40 / $4.40 |
| Classification, routing, value extraction (no text generation) | [`@cf/cloudflare/clef-flash`](https://developers.cloudflare.com/workers-ai/models/clef-flash/) or [`@cf/cloudflare/clairic-flash`](https://developers.cloudflare.com/workers-ai/models/clairic-flash/) | $0.038; $0.10 (input only) |
| Embeddings | [`@cf/qwen/qwen3-embedding-0.6b`](https://developers.cloudflare.com/workers-ai/models/qwen3-embedding-0.6b/) or [`@cf/baai/bge-m3`](https://developers.cloudflare.com/workers-ai/models/bge-m3/) | $0.012 (input only) |
| Reranking | [`@cf/baai/bge-reranker-base`](https://developers.cloudflare.com/workers-ai/models/bge-reranker-base/) | $0.003 |
| Image generation | [`@cf/black-forest-labs/flux-2-klein-4b`](https://developers.cloudflare.com/workers-ai/models/flux-2-klein-4b/) | $0.000059 / input 512×512 tile |
| Speech-to-text (batch) | [`@cf/openai/whisper-large-v3-turbo`](https://developers.cloudflare.com/workers-ai/models/whisper-large-v3-turbo/) | $0.0005 / audio minute |

The four models Cloudflare pins on the catalog page are now all its own: `clef`, `clef-flash`, `clef-omni`, and `clairic`. They don't generate text; they return option probabilities or typed values, which makes them a fit for the classification, routing, and field-extraction layer of an agent. See [The Cloudflare Model Family](/posts/tech/2026-10-22-ai-model-family-cloudflare-en) for how to pick among them.

## Reading a model ID

Model IDs follow `@cf/<publisher>/<model name>`, and almost every suffix in that trailing string describes the architecture. Learning to read them saves a trip to the docs:

```
@cf/google/gemma-4-26b-a4b-it
 │      │      │    │   │   └── it = instruction tuned, for chat; without it you get a base model
 │      │      │    │   └────── a4b = active 4 billion, the MoE activates 4B per inference
 │      │      │    └────────── 26b = 26 billion total parameters
 │      │      └─────────────── model family and generation
 │      └────────────────────── publisher (google / meta / qwen / zai-org / moonshotai ...)
 └───────────────────────────── @cf = Cloudflare-hosted; a few older models use @hf (Hugging Face)
```

Other common suffixes:

| Suffix | Meaning | Why it matters |
|---|---|---|
| `-it` / `-instruct` | Instruction-tuned | Base models without it are not suited to direct conversation |
| `-fp8` / `-awq` / `-int8` | Quantization precision | Cheaper and faster, slightly lower quality. fp8 is the best trade-off; int4 (awq) is the most aggressive |
| `a3b` / `a4b` / `a12b` | MoE active parameter count | This, not the total, determines your real inference cost and speed |
| `-fast` | Cloudflare's accelerated deployment | The 2026-05-30 sweep spared the `-fast` and `-lora` variants, but the 2026-11-20 sweep removed three `-lora` models |
| `-lora` | Base model that accepts LoRA adapters | Used with the Workers AI fine-tuning feature |

MoE (Mixture-of-Experts) is now the mainstream in this catalog: Gemma 4, Llama 4 Scout, DeepSeek V4.1 Flash, Inkling 2 Small, and Moondream 3.1 all use it. The practical reading is that total parameters govern how smart the model is while active parameters govern what you pay and how long you wait — `gemma-4-26b-a4b-it` delivers 26B worth of knowledge at close to 4B speed, which is why it beats the older dense 12B model on speed, quality, and price at once.

## Text generation: three tiers

### Tier 1: everyday workhorses (no paid plan needed)

| Model | Context | in / out per M | Capabilities |
|---|---|---|---|
| [glm-4.7-flash](https://developers.cloudflare.com/workers-ai/models/glm-4.7-flash/) | 131,072 | $0.06 / $0.40 | Function calling, Reasoning |
| [gemma-4-26b-a4b-it](https://developers.cloudflare.com/workers-ai/models/gemma-4-26b-a4b-it/) | 256,000 | $0.10 / $0.30 | Function calling, Reasoning, Vision |
| [granite-4.0-h-micro](https://developers.cloudflare.com/workers-ai/models/granite-4.0-h-micro/) | 131,000 | $0.017 / $0.112 | Function calling |
| [qwen3.8-27b](https://developers.cloudflare.com/workers-ai/models/qwen3.8-27b/) | 262,144 | $0.45 / $3.20 | Function calling, Reasoning, Vision, Batch |
| [llama-4-scout-17b-16e-instruct](https://developers.cloudflare.com/workers-ai/models/llama-4-scout-17b-16e-instruct/) | 131,000 | $0.27 / $0.85 | Function calling, Vision, Batch |
| [mistral-small-3.1-24b-instruct](https://developers.cloudflare.com/workers-ai/models/mistral-small-3.1-24b-instruct/) | 128,000 | $0.351 / $0.555 | Function calling |

What each of these actually is:

- **[glm-4.7-flash](https://developers.cloudflare.com/workers-ai/models/glm-4.7-flash/)** (Zhipu AI / Z.ai) — the lightweight member of the Chinese GLM family. Cloudflare's description: "Optimized for dialogue, instruction-following, and multi-turn tool calling across 100+ languages." Multilingual conversation and multi-turn tool use are the selling points, and Chinese is one of its strongest languages.
- **[gemma-4-26b-a4b-it](https://developers.cloudflare.com/workers-ai/models/gemma-4-26b-a4b-it/)** (Google) — Gemma is Google's open model family derived from Gemini research, and the fourth generation is positioned as "built from Gemini 3 research to maximize intelligence-per-parameter." A 26B-total / 4B-active MoE, and the only model in this tier with vision, reasoning, and function calling together.
- **[granite-4.0-h-micro](https://developers.cloudflare.com/workers-ai/models/granite-4.0-h-micro/)** (IBM) — IBM's enterprise-oriented open family. The docs explicitly target RAG, multi-agent workflows, and edge deployments, and highlight instruction following and function calling. "h-micro" is the hybrid-architecture smallest size in Granite 4.0.
- **[qwen3.8-27b](https://developers.cloudflare.com/workers-ai/models/qwen3.8-27b/)** (Alibaba Qwen) — a 27B vision-language model with reasoning, function calling, and a 262K window; strong on Chinese and supports the Batch API. It is one of the two "smaller model" replacements Cloudflare recommended in the 2026-11-20 deprecation notice (the other is Gemma 4), and it replaces `qwen3-30b-a3b-fp8` in this tier.
- **[llama-4-scout-17b-16e-instruct](https://developers.cloudflare.com/workers-ai/models/llama-4-scout-17b-16e-instruct/)** (Meta) — Scout is the smallest of the Llama 4 line, 17B parameters across 16 experts, and **natively multimodal** rather than bolting on a vision encoder. One of the few models in this tier with Batch API support.
- **[mistral-small-3.1-24b-instruct](https://developers.cloudflare.com/workers-ai/models/mistral-small-3.1-24b-instruct/)** (Mistral AI, France) — a 24B dense model and the European entry here. One discrepancy to note: the official description says it "adds state-of-the-art vision understanding," but the catalog only tags it with Function calling and **no Vision tag** — test before relying on image input.

**Default to `glm-4.7-flash`.** It has the cheapest input price in this tier while still offering function calling and a 131K context window. Cloudflare's own description: "Optimized for dialogue, instruction-following, and multi-turn tool calling across 100+ languages."

**Switch to `gemma-4-26b-a4b-it` when output dominates.** The two have inverted price structures: GLM is $0.06 in / $0.40 out, Gemma 4 is $0.10 in / $0.30 out. RAG workloads are input-heavy (you stuff in retrieved documents and get back a few hundred words), which favors GLM; long-form generation is output-heavy, which favors Gemma 4. Gemma 4 also adds vision and a 256K window.

**`granite-4.0-h-micro` is the underrated one.** At $0.017 / $0.112 it is the cheapest in this tier, yet it still has function calling and 131K context. For pipeline steps that are high-volume, short, and don't need any style — intent classification, query rewriting, field extraction — it runs an order of magnitude cheaper than your main model.

**`qwen3.8-27b`'s $3.20 output price is the highest in this tier**, more than ten times Gemma 4's. You are paying for Chinese, vision, and reasoning in one model; run the numbers before using it for output-heavy work.

### Tier 2: reasoning and long context

| Model | Context | in / out per M | Notes |
|---|---|---|---|
| [gpt-oss-120b](https://developers.cloudflare.com/workers-ai/models/gpt-oss-120b/) | 128,000 | $0.35 / $0.75 | Positioned for production, high-reasoning use |
| [gpt-oss-20b](https://developers.cloudflare.com/workers-ai/models/gpt-oss-20b/) | 128,000 | $0.20 / $0.30 | Lower-latency variant |

- **[gpt-oss-120b / gpt-oss-20b](https://developers.cloudflare.com/workers-ai/models/gpt-oss-120b/)** (OpenAI) — OpenAI's rare open-weight release, positioned for "powerful reasoning, agentic tasks, and versatile developer use cases." The 120b targets production high-reasoning work; the 20b targets low latency and specialized cases.

`gpt-oss-20b` deserves a callout: $0.20 / $0.30 buys 128K context plus reasoning plus function calling, and its output price undercuts `glm-4.7-flash`'s $0.40. When you need long output *and* reasoning, it is often the best answer in the catalog.

This tier used to include NVIDIA's `nemotron-3-120b-a12b`, `deepseek-r1-distill-qwen-32b`, and `qwq-32b`; all three stopped responding on 2026-11-20. For stronger reasoning, move up to the paid frontier tier.

### Tier 3: frontier (**paid billing required**)

The pricing page lists the models that need paid billing. The ones still live are `@cf/zai-org/glm-5.3`, `@cf/deepseek-ai/deepseek-v4.1-flash-1017`, and `@cf/thinkingmachines/inkling-2-small` (the rest of that list stopped responding on 2026-11-20). Calls to these fail on Workers Free; you need Workers Paid or prepaid [AI Gateway credits](https://developers.cloudflare.com/ai-gateway/features/unified-billing/).

| Model | Context | in / cached in / out per M | Capabilities |
|---|---|---|---|
| [deepseek-v4.1-flash-1017](https://developers.cloudflare.com/workers-ai/models/deepseek-v4.1-flash-1017/) | 1,048,576 | $0.30 / $0.006 / $1.20 | Function calling, Reasoning, Vision |
| [inkling-2-small](https://developers.cloudflare.com/workers-ai/models/inkling-2-small/) | 1,048,576 | $0.30 / $0.10 / $1.00 | Function calling, Reasoning, Vision |
| [glm-5.3](https://developers.cloudflare.com/workers-ai/models/glm-5.3/) | 1,048,576 | $1.40 / $0.26 / $4.40 | Function calling, Reasoning |

What this tier is:

- **[deepseek-v4.1-flash-1017](https://developers.cloudflare.com/workers-ai/models/deepseek-v4.1-flash-1017/)** (DeepSeek) — a multimodal MoE with a 552B backbone that activates 8B parameters during prefill and 16B during decode, which Cloudflare pitches as keeping input-heavy agentic work fast and cheap. It replaces the V4 Flash / Pro models added in August, and costs less than V4 Flash did ($0.44 / $1.32).
- **[inkling-2-small](https://developers.cloudflare.com/workers-ai/models/inkling-2-small/)** (Thinking Machines Lab) — a 594B-total / 18B-active multimodal MoE added on 2026-11-12, described by Cloudflare as the first frontier open model from a US lab on Workers AI, aimed at agentic coding, image understanding, and tool-driven knowledge work.
- **[glm-5.3](https://developers.cloudflare.com/workers-ai/models/glm-5.3/)** (Zhipu AI / Z.ai) — Z.ai's flagship agentic coding model. It shares GLM-5.2's base model, with every gain coming from post-training, and Workers AI prices it the same as GLM-5.2. Its input price is 23× that of its `glm-4.7-flash` sibling — a different class in both positioning and cost.

The frontier replacements Cloudflare recommended in the 11-20 notice are exactly `deepseek-v4.1-flash-1017` and `glm-5.3`. Everything that used to sit in this tier — Kimi K2.6, Kimi K2.7 Code, GLM-5.2, GLM-5.3 Flash, DeepSeek V4 Flash / Pro — is retired, and code that hard-codes those IDs now gets a 410.

**Cached-input discounts vary a lot here**: DeepSeek V4.1 Flash charges $0.006 for cached input against $0.30 normal — a **1/50** ratio — GLM-5.3 is $0.26 against $1.40, about 1/5, and Inkling 2 Small is only 1/3. For multi-turn conversations or repeatedly sending the same long prompt, that ratio drives your bill. To actually hit the cache, send the `x-session-affinity` header so requests route back to the same model instance (see the official [Prompt caching](https://developers.cloudflare.com/workers-ai/features/prompt-caching/) docs).

All three have a 1,048,576-token window. If you want to drop a whole document in and ask questions about it, the cheapest of them, `deepseek-v4.1-flash-1017`, is today's first pick; GLM-5.3 has no vision, and its premium buys coding and long-horizon agent performance. Mind the rate limits too: these paid models default to 20 requests per minute per account per model, or 50 when billed through prepaid AI Gateway credits ([Limits](https://developers.cloudflare.com/workers-ai/platform/limits/)).

## Embeddings and reranking

| Model | Context | Price per M input | Notes |
|---|---|---|---|
| [qwen3-embedding-0.6b](https://developers.cloudflare.com/workers-ai/models/qwen3-embedding-0.6b/) | 8,192 | $0.012 | Multilingual, takes an `instruction` parameter |
| [bge-m3](https://developers.cloudflare.com/workers-ai/models/bge-m3/) | — | $0.012 | Multilingual, multi-granularity |
| [embeddinggemma-2](https://developers.cloudflare.com/workers-ai/models/embeddinggemma-2/) | 8,192 | $0.0017 | Multimodal (text, image, video, audio), 768 dims |
| [plamo-embedding-1b](https://developers.cloudflare.com/workers-ai/models/plamo-embedding-1b/) | — | $0.019 | Japanese-specific |
| [bge-large-en-v1.5](https://developers.cloudflare.com/workers-ai/models/bge-large-en-v1.5/) | — | $0.204 | English, 1024 dims, Batch support |
| [bge-base-en-v1.5](https://developers.cloudflare.com/workers-ai/models/bge-base-en-v1.5/) | — | $0.067 | English, 768 dims |
| [bge-small-en-v1.5](https://developers.cloudflare.com/workers-ai/models/bge-small-en-v1.5/) | — | $0.020 | English, 384 dims |

Where these embedding models come from:

- **[qwen3-embedding-0.6b](https://developers.cloudflare.com/workers-ai/models/qwen3-embedding-0.6b/)** (Alibaba Qwen) — the embedding-and-ranking branch of the Qwen3 family, and instruction-aware (you can steer it per task).
- **[bge-m3](https://developers.cloudflare.com/workers-ai/models/bge-m3/)** (BAAI, Beijing) — the multilingual flagship of the BGE series. The M3 stands for Multi-Functionality (dense + sparse + multi-vector retrieval), Multi-Linguality, and Multi-Granularity. It is one of the most widely deployed embedding models in open-source RAG.
- **[embeddinggemma-2](https://developers.cloudflare.com/workers-ai/models/embeddinggemma-2/)** (Google DeepMind) — a multimodal embedding model added on 2026-11-12 that maps text (including code), images, video, and audio into one 768-dimensional space, covers 100+ languages, and can shrink output to 128 / 256 / 512 dimensions via `dimensions`. It replaces `embeddinggemma-300m`, retired on 2026-11-20; an index built on the old model has to be rebuilt.
- **[bge-large / base / small-en-v1.5](https://developers.cloudflare.com/workers-ai/models/bge-large-en-v1.5/)** (BAAI) — same lab, but the older **English-only** generation, emitting 1024 / 768 / 384-dimension vectors respectively.
- **[plamo-embedding-1b](https://developers.cloudflare.com/workers-ai/models/plamo-embedding-1b/)** (Preferred Networks) — a Japanese-specific embedding model from Japan's PFN, worth testing on Japanese corpora.
- **[bge-reranker-base](https://developers.cloudflare.com/workers-ai/models/bge-reranker-base/)** (BAAI) — not an embedding model. It takes a question and a document together and emits a relevance score directly, which is more accurate than vector similarity but cannot be precomputed and stored.

For multilingual content pick `qwen3-embedding-0.6b` or `bge-m3` — both at $0.012 per M input tokens, 17× cheaper than the English-only `bge-large-en-v1.5` at $0.204, and multilingual on top of that. Even for English-only corpora there is little reason to reach for bge-large-en unless your Vectorize index is already built on it. `embeddinggemma-2` at $0.0017 is another seven times cheaper and can put images and video in the same index; it is new, so benchmark it on your own data before switching.

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

**[FLUX](https://developers.cloudflare.com/workers-ai/models/flux-2-klein-4b/)** (Black Forest Labs) comes from the team that originally built Stable Diffusion. FLUX.2 [klein] is the distilled fast line that unifies generation and editing — the 4B is cheap enough for live previews, the 9B is the quality step up — while the older `flux-1-schnell` is a 12B rectified flow transformer still in the catalog. **[lucid-origin](https://developers.cloudflare.com/workers-ai/models/lucid-origin/)** and **[phoenix-1.0](https://developers.cloudflare.com/workers-ai/models/phoenix-1.0/)** come from Leonardo.AI, and their strengths are prompt adherence and rendering text correctly.

**Speech:**

| Model | Use | Price |
|---|---|---|
| [whisper-large-v3-turbo](https://developers.cloudflare.com/workers-ai/models/whisper-large-v3-turbo/) | ASR, batch | $0.0005 / audio minute |
| [nova-3](https://developers.cloudflare.com/workers-ai/models/nova-3/) (Deepgram) | ASR, real-time | $0.0052 / min ($0.0092 over WebSocket) |
| [flux](https://developers.cloudflare.com/workers-ai/models/flux/) (Deepgram) | ASR built for voice agents | $0.0077 / min |
| [aura-2-en](https://developers.cloudflare.com/workers-ai/models/aura-2-en/) / [aura-2-es](https://developers.cloudflare.com/workers-ai/models/aura-2-es/) | TTS | $0.030 / 1k characters |
| [smart-turn-v2](https://developers.cloudflare.com/workers-ai/models/smart-turn-v2/) | Turn detection | $0.00033795 / min |

**[Whisper](https://developers.cloudflare.com/workers-ai/models/whisper-large-v3-turbo/)** (OpenAI) is the de facto standard for general speech recognition, and turbo is the distilled, accelerated large-v3. The three **Deepgram** entries are commercial partner models: `nova-3` is general real-time ASR, the `aura` line is TTS that adapts pacing and expressiveness to context, and `flux` (unrelated to Black Forest Labs' image model despite the name) is described as "the first conversational speech recognition model built specifically for voice agents." **[smart-turn-v2](https://developers.cloudflare.com/workers-ai/models/smart-turn-v2/)** (Pipecat) does no recognition at all — it only decides whether the speaker has finished, which is what stops a voice agent from talking over people.

For offline transcription use Whisper turbo at $0.0005/min — 10× cheaper than Deepgram Nova-3. Reach for the Deepgram line only when you need real-time streaming or are building a voice agent. The multilingual TTS `melotts` that used to be on this table was retired on 2026-11-20, with `aura-2-en` as the suggested replacement; for the LLM in the middle of a voice agent there is now Pipecat's post-trained [`phonellm-mini-alpha-2`](https://developers.cloudflare.com/workers-ai/models/phonellm-mini-alpha-2/) ($0.06 / $0.24), which calls tools reliably without reasoning mode.

**Everything else worth knowing about:**

- **[moondream3.1-9B-A2B](https://developers.cloudflare.com/workers-ai/models/moondream3.1-9B-A2B/)** ($0.30 / $1.00) — a small 9B MoE / 2B active vision-language model built for object detection, pointing, OCR, and structured output. For pulling data out of screenshots or document images it is far cheaper than asking a general large model to look at the picture.
- **[llama-guard-3-8b](https://developers.cloudflare.com/workers-ai/models/llama-guard-3-8b/)** (Meta) — not a chat model but a content safety classifier: feed it a prompt or a response and it judges whether the content is safe and which category was violated. This is the one to use for input/output guardrails.
- **[gemma-sea-lion-v4-27b-it](https://developers.cloudflare.com/workers-ai/models/gemma-sea-lion-v4-27b-it/)** (AI Singapore) — a Gemma variant pretrained and instruction-tuned for Southeast Asian languages. SEA-LION stands for Southeast Asian Languages In One Network, and it is worth evaluating for products targeting that region.
- **[m2m100-1.2b](https://developers.cloudflare.com/workers-ai/models/m2m100-1.2b/)** (Meta) and **[indictrans2-en-indic-1B](https://developers.cloudflare.com/workers-ai/models/indictrans2-en-indic-1B/)** (AI4Bharat) — dedicated translation models at $0.342 each. The former is many-to-many multilingual; the latter covers India's 22 scheduled languages.
- **[distilbert-sst-2-int8](https://developers.cloudflare.com/workers-ai/models/distilbert-sst-2-int8/)** ($0.026) — the old workhorse of sentiment classification, and cheaper than an LLM call at volume.

## Billing: Neurons and the free allocation

Workers AI bills in Neurons underneath. From the pricing page:

> Workers AI is included in both the Free and Paid Workers plans and is priced at **$0.011 per 1,000 Neurons**. Our free allocation allows anyone to use a total of **10,000 Neurons per day at no charge**.

The allocation resets daily at 00:00 UTC. How far 10,000 Neurons goes depends entirely on the model: `glm-4.7-flash` costs 5,500 neurons per M input tokens, so the free tier is roughly 1.8M input tokens a day; `glm-5.3` at 127,273 neurons per M input leaves you about 80K tokens. Validating a pipeline on a cheap model before switching to a large one saves real money in that order.

Three things that catch people out:

1. **Exceeding any limit fails the request** rather than throttling it. Handle the error path before you ship.
2. **Paid frontier models are not available on Workers Free** — calls are rejected outright.
3. **Prepaid AI Gateway credits can pay for Workers AI.** Set the gateway's Workers AI billing to Unified billing; Cloudflare also notes that frontier-model requests paid with prepaid credits get higher rate limits.

## Models disappear: collapse model IDs into one constant

Both deprecation lists are worth pasting as a cautionary note. From 2026-11-20 these return 410: `deepseek-r1-distill-qwen-32b`, `nemotron-3-120b-a12b`, `deepseek-v4-pro-0813`, `deepseek-v4-flash-0731`, `qwq-32b`, `qwen3-30b-a3b-fp8`, `kimi-k2.6`, `kimi-k2.7-code`, `glm-5.2`, `glm-5.3-flash`, `llama-2-7b-chat-hf-lora`, `gemma-2b-it-lora`, `gemma-7b-it-lora`, `llama-3.1-8b-instruct-fp8`, `llama-3.2-1b-instruct`, `llama-3.2-3b-instruct`, plus the non-LLM `melotts` (→ `aura-2-en`), `stable-diffusion-xl-base-1.0`, `stable-diffusion-v1-5-inpainting`, `stable-diffusion-xl-lightning`, `dreamshaper-8-lcm` (all four → `flux-2-klein-9b`), `whisper-tiny-en` (→ `nova-3`), `llava-1.5-7b-hf` (→ `moondream3.1-9B-A2B`), and `embeddinggemma-300m` (→ `embeddinggemma-2`). For LLMs the official advice is `deepseek-v4.1-flash-1017` or `glm-5.3` for frontier needs, and `gemma-4-26b-a4b-it` or `qwen3.8-27b` for smaller ones.

The earlier 2026-05-30 list: `kimi-k2.5` (auto-aliased to k2.6, at a higher price), `meta-llama-3-8b-instruct`, `llama-3-8b-instruct` (+awq), `llama-3.1-8b-instruct` (+awq), `llama-3.1-70b-instruct`, `llama-2-7b-chat-int8`, `llama-2-7b-chat-fp16`, `mistral-7b-instruct-v0.1`, `mistral-7b-instruct-v0.2`, `gemma-7b-it`, `gemma-3-12b-it`, `hermes-2-pro-mistral-7b`, `phi-2`, `sqlcoder-7b-2`, `uform-gen2-qwen-500m`, and `bart-large-cnn`.

Cloudflare's recommended replacements at the time:

> We recommend migrating to newer models such as `@cf/zai-org/glm-4.7-flash` for fast tool-calling, `@cf/google/gemma-4-26b-a4b-it` for an efficient open model, or `@cf/moonshotai/kimi-k2.6` for a capable tool-calling and vision model.

Six months later `kimi-k2.6`, one of those three recommendations, landed on a deprecation list itself. Anyone auto-aliased from `kimi-k2.5` in May has had to change models twice within a year.

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

The `-fast` and `-lora` variants are no safe harbor either. The May wave left them alone, but the 11-20 wave removed `gemma-2b-it-lora`, `gemma-7b-it-lora`, and `llama-2-7b-chat-hf-lora`, and the `-fp8-fast` variant of `llama-3.1-8b-instruct` no longer appears on the catalog page.

## A selection procedure

In practice this order gets you there faster than reading the tables:

1. **Check the hard requirements first** — vision, function calling, very long context. These eliminate most of the candidates immediately.
2. **Estimate your input : output ratio.** RAG is input-heavy (favor cheap-input models like GLM); long-form writing is output-heavy (favor cheap-output models like Gemma 4).
3. **Look for pipeline steps you can downgrade.** Push classification, routing, and query rewriting to `granite-4.0-h-micro` and save the main model for final generation.
4. **Confirm your plan.** GLM-5.3, DeepSeek V4.1 Flash, and Inkling 2 Small require Workers Paid or prepaid AI Gateway credits.
5. **Tune prompts last.** Always re-run your evaluation after a model swap, especially for JSON formatting instructions that lean on specific phrasing.

## How this post is maintained

This is an article with an expiry date, so the update rules live here:

- Re-check the catalog and pricing pages **quarterly, or whenever the official changelog announces a deprecation**, and record the diff in the update log below.
- Compare three things on each pass: total model count, the pinned list, and the pricing table. Prices and context windows always come from the individual official model page, never from third-party summaries.
- A new model only enters the tables when it **changes the best answer for some use case**. The goal is not to mirror every entry in the catalog.
- Removed models stay in the migration section rather than being deleted — readers still have code calling them.

## Changelog

- 2026-11-23: Full refresh against the November catalog (76 models, 24 retired on 11-20) and the 11-18 pricing page. The frontier tier is now `deepseek-v4.1-flash-1017`, `inkling-2-small`, and `glm-5.3` (Kimi K2.6 / K2.7 Code, GLM-5.2, and DeepSeek V4 Flash / Pro are retired); `qwen3-30b-a3b-fp8` in tier 1 is replaced by `qwen3.8-27b`; the retired Nemotron 3, DeepSeek-R1-Distill, and QwQ are removed from tier 2; `embeddinggemma-2` replaces `embeddinggemma-300m`; `melotts` is removed from the speech table; the pinned list is now the four Clef / Clairic models; added the 11-20 deprecation list and paid-model rate limits.
- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "Cloudflare Edge Stack" series.
- 2026-08-18: First published, checked against the 2026-08-12 catalog (84 models) and the 2026-08-18 pricing page.

## References

- [Workers AI model catalog](https://developers.cloudflare.com/workers-ai/models/) — source for every model listed and its context window
- [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) — Neurons, free allocation, and per-model rates
- [Workers AI changelog](https://developers.cloudflare.com/workers-ai/changelog/) — the 2026-05-30 deprecation list and official replacement guidance
- [Planned model deprecations on Workers AI (2026-11-05)](https://developers.cloudflare.com/changelog/post/2026-11-05-planned-model-deprecations/) — the 2026-11-20 list, 410 behavior, and replacements
- [The Cloudflare Model Family](/posts/tech/2026-10-22-ai-model-family-cloudflare-en) — the four pinned in-house models
- [Workers AI limits](https://developers.cloudflare.com/workers-ai/platform/limits/)
- [Prompt caching](https://developers.cloudflare.com/workers-ai/features/prompt-caching/) — `x-session-affinity` and cache hit rates
- [AI Gateway unified billing](https://developers.cloudflare.com/ai-gateway/features/unified-billing/) — paying for Workers AI with prepaid credits
- [Workers AI bindings configuration](https://developers.cloudflare.com/workers-ai/configuration/bindings/)
- [Gemma on Cloudflare Workers AI: A Pragmatic Choice for Traditional Chinese](/posts/ai/2026-04-28-gemma-3-cloudflare-workers-ai-en) — Gemma 3's removal and the migration to Gemma 4
- [The Full Cloudflare Workers AI Binding: More Than run()](/posts/tech/2026-04-17-cloudflare-workers-ai-binding-utilities-en) — `toMarkdown`, `autorag`, `gateway`, and the other binding methods
