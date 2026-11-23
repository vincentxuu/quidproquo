---
title: "Gemma — Google's Open-Weights Flank: Gemma 4 Moves to Apache 2.0, From Mobile to Workstation Full-Size Open Weights"
date: 2026-09-19
category: tech
tags: [ai-agent, llm, gemma, google, open-weights, model-family-gemma, model-selection]
lang: en
type: deep-dive
tldr: "Gemma is Google's open-weights family paired with the closed-source Gemini flagship; Gemma 4, released in April 2026, switched its license from Google Gemma Terms of Use to Apache 2.0 — the single most important change in this article. Gemma 4 is still the current generation: June added the encoder-free 12B Unified for five sizes (E2B / E4B / 12B / 26B A4B / 31B), and October brought the 740M multimodal embedding model EmbeddingGemma 2. Hosted options include the Gemini API (free tier only), Workers AI, and more than a dozen providers on OpenRouter."
description: "Complete Gemma model family introduction: timeline from Gemma 1 to Gemma 4, Gemma 4's five sizes including 12B Unified, DiffusionGemma, EmbeddingGemma 2, key differences between Gemma 4's Apache 2.0 and previous generations' licenses, three deployment paths (hosted APIs / self-hosted / AI Edge), division of labor with the Gemini main article, and selection guide for agent developers."
series:
  name: "AI Model Families"
  order: 24
glossary:
  - term: "Gemma Terms of Use"
    definition: "Google's proprietary license used by Gemma 1 / 2 / 3 / 3n — requires login and click-through agreement on Hugging Face before downloading weights; stricter commercial and redistribution terms than Apache 2.0."
    links:
      - label: "Gemma Terms of Use"
        url: "https://ai.google.dev/gemma/terms"
  - term: "Apache 2.0"
    definition: "Permissive open-source license allowing commercial use, modification, and redistribution with patent grant. Gemma 4 switched to this license, making it Google's first genuinely open-weights release."
    links:
      - label: "Gemma 4 license (Apache 2.0)"
        url: "https://ai.google.dev/gemma/apache_2"
  - term: "MoE"
    aliases: ["Mixture-of-Experts", "混合專家模型"]
    definition: "Architecture that activates only a subset of expert sub-networks per inference. The active parameter count — not total parameters — determines speed and memory: Gemma 4 26B activates about 3.8B per inference."
  - term: "Workers AI"
    definition: "Cloudflare's hosted inference service — call models directly from the Workers environment without managing GPUs, billed per token."
    links:
      - label: "Cloudflare Workers AI"
        url: "https://developers.cloudflare.com/workers-ai/"
  - term: "AI Edge"
    aliases: ["Google AI Edge"]
    definition: "Google's on-device AI toolkit (including LiteRT runtime) that lets small Gemma sizes (E2B / E4B) run offline on phones and IoT devices."
    links:
      - label: "Google AI Edge"
        url: "https://ai.google.dev/edge"
---

On April 2, 2026, Google released [Gemma 4](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/) — four sizes (E2B / E4B / 26B-MoE / 31B), with 31B ranking third on the open-source Arena leaderboard. Size and scores are not the real news this time — the license is. Gemma 4 switched to **Apache 2.0**. Every previous Gemma generation was bound to Google's proprietary Gemma Terms of Use, which required a gated download with login and click-through agreement; starting with Gemma 4, self-hosting, fine-tuning, and commercial redistribution no longer require that step. On June 3, Google added [Gemma 4 12B Unified](https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemma-4-12b/), bringing Gemma 4 to five sizes. This is the 24th deep-dive in the "AI Model Families" series, tracing Gemma's complete path from its 2024 debut to Gemma 4, and its division of labor with the [Gemini main article](/posts/tech/2026-08-24-ai-model-family-gemini).

For how to read benchmark numbers cited here, see our [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources). This is part of the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) series.

## Family positioning and model matrix

| Model / product line | Positioning | Key difference | Access |
|---|---|---|---|
| Gemma 4 E2B／E4B | Mobile/offline | 128K; native audio input | Apache 2.0 weights; AI Edge |
| Gemma 4 12B Unified | Laptop (16GB) | 11.95B dense; no vision or audio encoders; 256K; native audio input | Apache 2.0 weights; Ollama, LM Studio |
| Gemma 4 26B A4B | Cloud/workstation | 25.2B total, 3.8B active; 256K | Self-hosting; Gemini API; Workers AI; OpenRouter |
| Gemma 4 31B | Family quality ceiling | 30.7B dense; 256K | Weights; Gemini API; OpenRouter |
| EmbeddingGemma 2 | On-device multimodal embeddings | 740M (270M text-only); 768 dims; 8K | Apache 2.0 weights; Workers AI |
| DiffusionGemma | Experimental text diffusion | 26B A4B base; generates 256-token blocks; lower quality than Gemma 4 | Apache 2.0 weights; Vertex AI Model Garden |
| Gemma 1／2／3／3n | Historical versions | Still uses Gemma Terms of Use | Gated weights with different terms |

## Family evolution

### Family Evolution Timeline

| Version | Release | Sizes | Key Fact |
|---|---|---|---|
| Gemma 1 | 2024-02 | 2B / 7B | First open weights derived from Gemini technology; Gemma Terms of Use |
| Gemma 2 | 2024-06 | 9B / 27B | 27B first open-weight model near flagship tier |
| Gemma 3 | 2025-03 | 1B / 4B / 12B / 27B | Multimodal enters open-weights line; 270M ultra-small added later |
| Gemma 3n | 2025-06 | E2B / E4B | MatFormer + selective parameter activation; first mobile-first generation |
| Gemma 4 | 2026-04 | E2B / E4B / 26B-MoE / 31B | License switched to Apache 2.0; native function calling and agent workflow support |
| Gemma 4 12B Unified | 2026-06-03 | 12B | First mid-size model with native audio input; drops multimodal encoders and runs on a 16GB laptop |
| DiffusionGemma | 2026-06-10 | 26B A4B | Experimental text-diffusion model, up to 4x faster for low-concurrency local generation, trading quality for speed |
| EmbeddingGemma 2 | 2026-10-06 | 740M | Embeddings expand from text to images, video, and audio; context grows from 2K to 8K |

Two years, five generations. Gemma's core line has always been simple: **repackage Gemini-generation research as downloadable, self-hostable open weights**. Size floor keeps dropping (7B → 2B → 1B → 270M → E2B), ceiling keeps rising (7B → 27B → 31B), with vertical variants (medical, vision, safety, function-calling, embedding) in between — but only Gemma 4 changed the license. Understanding that split is the key to reading the entire family. Since Gemma 4 launched, Google has not opened a new generation; it has added sizes and variants within the same one. The latest entry on the official [releases page](https://gemma.ai/models/releases/) is EmbeddingGemma 2 on 2026-10-06.

Variant positioning in one sentence: [MedGemma](https://deepmind.google/models/gemma/medgemma/) (medical text + image understanding), [ShieldGemma 2](https://deepmind.google/models/gemma/shieldgemma-2/) (content safety classifier), [FunctionGemma](https://ai.google.dev/gemma/docs/functiongemma) (edge function calling), [EmbeddingGemma 2](https://gemma.ai/models/embeddinggemma/) (740M on-device multimodal embedding; the previous version was 308M text-only), [PaliGemma](https://ai.google.dev/gemma/docs/paligemma) (vision-language). Full official variant list: [DeepMind Gemma page](https://deepmind.google/models/gemma/).

## Architecture and training trade-offs

The existing sources describe Gemma 3n with MatFormer and selective parameter activation, and Gemma 4 with dense and MoE sizes. Per the [Gemma 4 model card](https://gemma.ai/models/gemma-4/model-card/), 26B A4B has 25.2B total parameters with 3.8B active per token (8 of 128 experts plus 1 shared expert). The whole family interleaves sliding-window and global attention, with the final layer always global. The MoE still has to load all 26B parameters, about 57.7GB in BF16, so its memory footprint is close to a dense 26B model, not a 4B one. This article does not provide a complete training-data recipe, so deployment freedom should not be read as training transparency.

Two architecture experiments within the same generation are worth separating:

- **12B Unified removes the multimodal encoders.** Other Gemma 4 sizes first run inputs through a separate vision encoder (about 150M on small sizes, about 550M on medium sizes) and an audio encoder (about 300M). The 12B projects 48×48-pixel patches into the language model with a single matrix multiplication, and slices raw 16kHz audio into 40ms frames that are projected linearly ([official developer guide](https://developers.googleblog.com/gemma-4-12b-the-developer-guide/)). The payoff is lower multimodal latency, and LoRA or full fine-tuning updates the whole multimodal path in one pass.
- **DiffusionGemma generates with discrete diffusion.** It reuses the 26B A4B base and repeatedly denoises 256-token blocks; Google cites more than 1,000 tokens per second on a single H100. This only pays off for low-concurrency local inference: high-QPS cloud serving can already batch autoregressive models to saturation, so the diffusion advantage shrinks and serving can cost more.

## Evaluation and alternatives

### Division of Labor vs. Gemini: Closed-Source Flagship vs. Open-Weights Flank

Gemma and Gemini's relationship is Google's dual-track approach: **Gemini earns revenue; Gemma builds ecosystem**. See the [Gemini main article](/posts/tech/2026-08-24-ai-model-family-gemini) — the closed-source flagship (1M context, native multimodal, $2/$12) runs only on Google infrastructure; Gemma is the retreat path for developers who need self-hosting, fine-tuning, or data sovereignty. It is explicitly not the frontier. Gemma 4's Apache 2.0 makes that retreat path genuinely open for the first time, but the "open-weights flank" positioning has not changed: if you need the strongest model, go back to Gemini 3.1 Pro.

### Official evaluations across Gemma 4 sizes

The table below is the instruction-tuned results self-reported in the [Gemma 4 model card](https://gemma.ai/models/gemma-4/model-card/). It is one table under one set of conditions, so it compares sizes; do not mix it directly with other families' self-reported numbers.

| Benchmark | 31B | 26B A4B | 12B Unified | E4B | E2B |
|---|---|---|---|---|---|
| MMLU Pro | 85.2% | 82.6% | 77.2% | 69.4% | 60.0% |
| AIME 2026 (no tools) | 89.2% | 88.3% | 77.5% | 42.5% | 37.5% |
| LiveCodeBench v6 | 80.0% | 77.1% | 72.0% | 52.0% | 44.0% |
| GPQA Diamond | 84.3% | 82.3% | 78.8% | 58.6% | 43.4% |
| Tau2 (average over 3) | 76.9% | 68.2% | 69.0% | 42.2% | 24.5% |
| MRCR v2 8-needle 128K | 66.4% | 44.1% | 43.4% | 25.4% | 19.1% |

How to read it: 26B A4B tracks 31B closely on reasoning and coding; the gap is mainly long context and agent tasks. The 12B even edges out 26B A4B on Tau2 but trails on math and coding. DiffusionGemma's model card compares it with 26B A4B on the same benchmarks, and it scores only 69.1% on AIME 2026 (26B A4B: 88.3%); Google itself recommends standard Gemma 4 when quality matters.

In the open-weights competitive landscape:

- **Against Qwen** ([AI Model Family article](/posts/tech/2026-08-24-ai-model-family-qwen)): Qwen has the widest size coverage and highest Hugging Face download count, but its Max-tier weights switched to a custom license rather than Apache 2.0 in August 2026 — so Gemma 4 currently leads on "license purity." Qwen's advantages remain in Chinese ecosystem coverage and coding / vision specialist model lines.
- **Against Llama** ([AI Model Family article](/posts/tech/2026-08-24-ai-model-family-llama)): Llama 4 may be the last major open-source Llama release; Meta has shifted focus to the closed-source Muse Spark. The open-weights ground is changing hands — Gemma 4's Apache 2.0 arrives at exactly the right time.
- **Against DeepSeek**: MIT license plus frontier-level quality remains the ceiling for self-hosted cost-performance; Gemma's differentiation is Google's multi-language coverage (including Traditional Chinese) and the end-to-end deployment matrix (cloud → workstation → mobile in one line).

## Licensing, pricing, and deployment

### The License Trap: Gemma 4 Is Apache 2.0; Previous Generations Are Not

This is the most important section of the entire article — it is easy to confuse. Even the [Gemini main article](/posts/tech/2026-08-24-ai-model-family-gemini) once wrote the Gemma open-weights line as Apache 2.0 in one line. The precise split:

| | Gemma 1 / 2 / 3 / 3n | Gemma 4 |
|---|---|---|
| License | Gemma Terms of Use (Google proprietary) | [Apache 2.0](https://ai.google.dev/gemma/apache_2) (plus a separate prohibited-use policy) |
| Download method | Gated on Hugging Face; login + click-through agreement required | Standard open-source download, no click-through |
| Hugging Face tag | `license:gemma` (e.g. [`google/gemma-3n-E2B-it`](https://huggingface.co/google/gemma-3n-E2B-it)) | `apache-2.0` |
| Redistribution after fine-tuning | Bound by original terms | Handled under Apache 2.0 |

Three practical implications:

**First, how to identify.** On Hugging Face, `license:gemma` means the old license; `apache-2.0` means the Gemma 4 generation. Do not treat "Gemma = open source" as a blanket statement — redistribution and commercial terms differ completely.

**Second, Apache 2.0 is not zero restrictions.** Gemma 4 carries a separate [prohibited-use policy](https://ai.google.dev/gemma/prohibited_use_policy), and Google's trademarks are not covered by the license. In compliance reviews, read both the license page and the prohibited-use policy together.

**Third, old projects are not retroactively covered.** Existing Gemma 2 / 3 weights do not automatically become Apache 2.0 just because Gemma 4 switched. To change the licensing basis, you must actually switch to Gemma 4-generation weights and re-run evaluation — changing the model is the fastest way to break prompts, especially JSON formatting instructions that rely on few-shot examples or specific phrasing.

### Three Deployment Paths: Hosted APIs, Self-Hosted, Mobile AI Edge

Gemma 4's size matrix maps to hardware: E2B / E4B target mobile and IoT (extreme compute / memory efficiency), while 26B / 31B target "frontier intelligence on a personal computer." Official description: [DeepMind Gemma page](https://deepmind.google/models/gemma/). Three deployment paths:

#### Path 1: Hosted APIs (Simplest)

There are three hosted options, and their terms differ a lot:

| Channel | Sizes | Price (per million input / output tokens) | Conditions to note |
|---|---|---|---|
| [Gemini API](https://gemma.ai/deployment/gemini-api/) (AI Studio) | 31B, 26B A4B | Free tier only; no paid tier | Free-tier data is used to improve Google products; production use needs another channel |
| [OpenRouter](https://openrouter.ai/google/gemma-4-31b-it) | 31B, 26B A4B | By provider: 26B A4B input $0.04–$0.15, output $0.15–$0.60; 31B input $0.10–$0.75, output $0.10–$1.15 | 15 providers for 26B A4B and 18 for 31B, with quantization ranging from FP4 to BF16; each also has one Google AI Studio `:free` endpoint |
| [Workers AI](https://developers.cloudflare.com/workers-ai/models/gemma-4-26b-a4b-it/) | 26B A4B | $0.10 / $0.30 | Only 26B A4B; 31B is not available |

OpenRouter prices and provider lists change. When choosing a provider, check the quantization listed on the endpoint first; FP4 and BF16 outputs should not be compared as if they were the same model.

Workers AI hosts only `gemma-4-26b-a4b-it`: 256K context, Vision, Function calling, and Reasoning all enabled; priced at $0.10 / $0.30 per M input / output tokens. The MoE activates about 3.8B parameters per inference, so latency is actually better than previous dense 12B generations. Our site already has a practical record — [Gemma on Cloudflare Workers AI](/posts/ai/2026-04-28-gemma-3-cloudflare-workers-ai) — covering the full migration from Gemma 3 to Gemma 4, including RAG pipeline prompt retesting.

Three boundaries to remember: **31B is not on Workers AI**; for hosted 31B use the Gemini API or OpenRouter; the old `gemma-3-12b-it` was marked deprecated on 2026-05-30 — do not start new projects with it; [`@cf/aisingapore/gemma-sea-lion-v4-27b-it`](https://developers.cloudflare.com/workers-ai/models/) is AI Singapore's Southeast Asian language variant built on Gemma — note the `@cf/aisingapore` prefix, not `@cf/google`. Workers AI also hosts [`@cf/google/embeddinggemma-2`](https://developers.cloudflare.com/workers-ai/models/embeddinggemma-2/) (768 dimensions, 8,192 tokens, $0.0017 per M input tokens), which pairs with it for RAG embeddings in the same ecosystem. Full Workers AI model comparison: [Workers AI model catalog](/posts/ai/2026-08-18-workers-ai-model-guide).

#### Path 2: Self-Hosted (Ollama / vLLM — For Sovereignty)

This is where Apache 2.0 truly delivers value: weights downloadable from day one via [Ollama](https://ollama.com/library/gemma4), vLLM, llama.cpp, and Hugging Face Transformers. Official specs: unquantized bfloat16 fits in a single 80GB H100; quantized versions run on consumer-grade GPUs, supporting IDE coding assistants and agent workflows. If you need fine-tuning sovereignty, data that must stay on-premise, or long-term checkpoint locks (hosted API versions are opaque and can change without warning), take this path. On a laptop with only 16GB of memory, 12B Unified is the size Google points to, with support in Ollama, LM Studio, llama.cpp, and MLX; every size also has official QAT quantized checkpoints and an MTP draft model for speculative decoding.

#### Path 3: Mobile AI Edge (E2B / E4B — Another Battlefield)

E2B / E4B are designed for offline use: 128K context (256K for larger lines), native image processing across the family, and native speech input for E2B / E4B. Running fully offline on Android, Raspberry Pi, and Jetson Orin Nano via AICore, ML Kit, and LiteRT. Our [mobile small-model overview](/posts/ai/2026-03-31-mobile-small-models) has a full comparison of this line. In brief: only go off-cloud to touch E2B / E4B if you need offline execution, low latency, and power efficiency.

---

## Agent integration and selection

### What This Means for Agent Developers

- **Traditional Chinese RAG within the Cloudflare ecosystem** → Workers AI `gemma-4-26b-a4b-it`: 256K context, $0.10/$0.30, native Vision + Function calling support; details in our [Gemma practical guide](/posts/ai/2026-04-28-gemma-3-cloudflare-workers-ai)
- **Need 31B quality without self-hosting** → OpenRouter `google/gemma-4-31b-it` (multiple providers; check quantization first); the Gemini API's `gemma-4-31b-it` is free tier only, fine for prototypes but not for production or sensitive data
- **Local laptop with image and audio input** → 12B Unified: runs on 16GB, with official evaluations close to 26B A4B
- **Embeddings for on-device multimodal RAG** → EmbeddingGemma 2: text, images, video, and audio in one 768-dimensional space, truncatable to 128 dimensions to save storage; text-only loads just 270M
- **Ultra-low-latency local interaction where quality can give** → DiffusionGemma (experimental); keep standard Gemma 4 for production output
- **Need fine-tuning sovereignty or locked checkpoints** → Self-hosted Gemma 4 (Apache 2.0); Ollama / vLLM support from day one; previous Gemma 2/3 gated licenses do not apply
- **Offline mobile agent** → E2B / E4B + AI Edge; 128K context; native speech input
- **Southeast Asian multilingual** → Evaluate SEA-LION variant (`@cf/aisingapore` prefix); Traditional Chinese mainstay is still Gemma 4 core
- **Frontier reasoning / coding** → Not Gemma's battlefield; see the [Gemini main article](/posts/tech/2026-08-24-ai-model-family-gemini) for 3.1 Pro or 3.8 Flash
- **License audit** → Check the Hugging Face license tag first (`gemma` vs `apache-2.0`), then the prohibited-use policy; switching licensing basis for an old project means switching the model, and prompts must be re-tested

## Limitations and trade-offs

### Overall

Gemma's story is "open weights in exchange for ecosystem position." Google does not expect Gemma to win the frontier race — that is Gemini's job. Gemma's role is to make Google models present where Google infrastructure cannot reach: other people's clouds, self-hosted servers, phones. Gemma 4's Apache 2.0 turns that marketing line into a legal reality: before Gemma 4, Gemma was technically a "downloadable proprietary model" rather than open source. Now it is genuinely open.

The limitations are equally clear: 31B, however strong, is not frontier (third on the Arena open-source leaderboard means two ahead of it); 64K-level output limits remain; scientific reasoning and coding benchmarks fall well behind Gemini 3.1 Pro. If your scenario demands the strongest model, Gemma has never been the answer; if your scenario demands "strong enough, self-hostable, with a clean license," Gemma 4 is the first generation where Google genuinely delivers.

---

## Update history

- 2026-11-23: Gemma 4 is still the current generation; there is no Gemma 5. Added the later releases within the same generation, Gemma 4 12B Unified (2026-06-03), DiffusionGemma (2026-06-10), and EmbeddingGemma 2 (2026-10-06), to the matrix, timeline, architecture section, and selection guide; the original EmbeddingGemma 300M is now the previous version. Added a per-size evaluation table from the Gemma 4 model card. Rewrote hosted access: the Gemini API serves both 31B and 26B A4B but only on a free tier; OpenRouter has more than a dozen paid providers plus one free endpoint for each size, with price ranges added; Workers AI now includes EmbeddingGemma 2. Corrected errors: the article said 31B was only on AI Studio / Gemini API, but it is also on OpenRouter; 26B A4B has 25.2B total parameters per the model card.
- 2026-10-11: Reorganized the format, model matrix, and selection sections; retained existing sources and dates. No fresh fact-check was performed.

## References

- [DeepMind Gemma](https://deepmind.google/models/gemma/pro/)
- [Gemma 4 Official Announcement](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/)
- [Gemma 4 model card (specs and evaluations for five sizes)](https://gemma.ai/models/gemma-4/model-card/)
- [Gemma model releases page](https://gemma.ai/models/releases/)
- [Introducing Gemma 4 12B (2026-06-03, official blog)](https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemma-4-12b/)
- [Gemma 4 12B: The Developer Guide (2026-06-03)](https://developers.googleblog.com/gemma-4-12b-the-developer-guide/)
- [DiffusionGemma (2026-06-10, official blog)](https://blog.google/innovation-and-ai/technology/developers-tools/diffusion-gemma-faster-text-generation/)
- [`google/diffusiongemma-26B-A4B-it` model card](https://huggingface.co/google/diffusiongemma-26B-A4B-it)
- [EmbeddingGemma 2 (2026-10-06, official blog)](https://blog.google/innovation-and-ai/technology/developers-tools/embeddinggemma-2/)
- [Run Gemma with the Gemini API](https://gemma.ai/deployment/gemini-api/)
- [Gemini API pricing (Gemma 4 is free tier only)](https://ai.google.dev/gemini-api/docs/pricing)
- [OpenRouter: google/gemma-4-31b-it](https://openrouter.ai/google/gemma-4-31b-it), [google/gemma-4-26b-a4b-it](https://openrouter.ai/google/gemma-4-26b-a4b-it)
- [Workers AI: embeddinggemma-2 model page](https://developers.cloudflare.com/workers-ai/models/embeddinggemma-2/)
- [Gemma 4 License: Apache 2.0](https://ai.google.dev/gemma/apache_2)
- [Gemma Prohibited Use Policy](https://ai.google.dev/gemma/prohibited_use_policy)
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Google AI Edge](https://ai.google.dev/edge)
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources) — this site
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) — this site
