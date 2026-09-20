---
title: "Gemma — Google's Open-Weights Flank: Gemma 4 Moves to Apache 2.0, From Mobile to Workstation Full-Size Open Weights"
date: 2026-09-19
category: tech
tags: [ai-agent, llm, gemma, google, open-weights, model-family-gemma, model-selection]
lang: en
type: deep-dive
tldr: "Gemma is Google's open-weights family paired with the closed-source Gemini flagship; Gemma 4 (E2B / E4B / 26B-MoE / 31B) released in April 2026 switched its license from Google Gemma Terms of Use to Apache 2.0 — the single most important change in this article."
description: "Complete Gemma model family introduction: timeline from Gemma 1 to Gemma 4, key differences between Gemma 4's Apache 2.0 and previous generations' licenses, three deployment paths (Workers AI / self-hosted / AI Edge), division of labor with the Gemini main article, and selection guide for agent developers."
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

On April 2, 2026, Google released [Gemma 4](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/) — four sizes (E2B / E4B / 26B-MoE / 31B), with 31B ranking third on the open-source Arena leaderboard. Size and scores are not the real news this time — the license is. Gemma 4 switched to **Apache 2.0**. Every previous Gemma generation was bound to Google's proprietary Gemma Terms of Use, which required a gated download with login and click-through agreement; starting with Gemma 4, self-hosting, fine-tuning, and commercial redistribution no longer require that step. This is the 24th deep-dive in the "AI Model Families" series, tracing Gemma's complete path from its 2024 debut to Gemma 4, and its division of labor with the [Gemini main article](/posts/tech/2026-08-24-ai-model-family-gemini).

For how to read benchmark numbers cited here, see our [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources). This is part of the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) series.

## Family Evolution Timeline

| Version | Release | Sizes | Key Fact |
|---|---|---|---|
| Gemma 1 | 2024-02 | 2B / 7B | First open weights derived from Gemini technology; Gemma Terms of Use |
| Gemma 2 | 2024-06 | 9B / 27B | 27B first open-weight model near flagship tier |
| Gemma 3 | 2025-03 | 1B / 4B / 12B / 27B | Multimodal enters open-weights line; 270M ultra-small added later |
| Gemma 3n | 2025-06 | E2B / E4B | MatFormer + selective parameter activation; first mobile-first generation |
| Gemma 4 | 2026-04 | E2B / E4B / 26B-MoE / 31B | License switched to Apache 2.0; native function calling and agent workflow support |

Two years, five generations. Gemma's core line has always been simple: **repackage Gemini-generation research as downloadable, self-hostable open weights**. Size floor keeps dropping (7B → 2B → 1B → 270M → E2B), ceiling keeps rising (7B → 27B → 31B), with vertical variants (medical, vision, safety, function-calling, embedding) in between — but only Gemma 4 changed the license. Understanding that split is the key to reading the entire family.

Variant positioning in one sentence: [MedGemma](https://deepmind.google/models/gemma/medgemma/) (medical text + image understanding), [ShieldGemma 2](https://deepmind.google/models/gemma/shieldgemma-2/) (content safety classifier), [FunctionGemma](https://ai.google.dev/gemma/docs/functiongemma) (edge function calling), [EmbeddingGemma](https://ai.google.dev/gemma/docs/embeddinggemma) (300M on-device embedding), [PaliGemma](https://ai.google.dev/gemma/docs/paligemma) (vision-language). Full official variant list: [DeepMind Gemma page](https://deepmind.google/models/gemma/).

## The License Trap: Gemma 4 Is Apache 2.0; Previous Generations Are Not

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

## Three Deployment Paths: Workers AI, Self-Hosted, Mobile AI Edge

Gemma 4's size matrix maps to hardware: E2B / E4B target mobile and IoT (extreme compute / memory efficiency), while 26B / 31B target "frontier intelligence on a personal computer." Official description: [DeepMind Gemma page](https://deepmind.google/models/gemma/). Three deployment paths:

### Path 1: Workers AI (Simplest)

Workers AI hosts only `gemma-4-26b-a4b-it`: 256K context, Vision, Function calling, and Reasoning all enabled; priced at $0.10 / $0.30 per M input / output tokens. The MoE activates about 3.8B parameters per inference, so latency is actually better than previous dense 12B generations. Our site already has a practical record — [Gemma on Cloudflare Workers AI](/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai) — covering the full migration from Gemma 3 to Gemma 4, including RAG pipeline prompt retesting.

Three boundaries to remember: **31B is only available via AI Studio / Gemini API**, not Workers AI; the old `gemma-3-12b-it` was marked deprecated on 2026-05-30 — do not start new projects with it; [`@cf/aisingapore/gemma-sea-lion-v4-27b-it`](https://developers.cloudflare.com/workers-ai/models/) is AI Singapore's Southeast Asian language variant built on Gemma — note the `@cf/aisingapore` prefix, not `@cf/google`. Full Workers AI model comparison: [Workers AI model catalog](/posts/ai/2026-08-18-workers-ai-model-guide).

### Path 2: Self-Hosted (Ollama / vLLM — For Sovereignty)

This is where Apache 2.0 truly delivers value: weights downloadable from day one via [Ollama](https://ollama.com/library/gemma4), vLLM, llama.cpp, and Hugging Face Transformers. Official specs: unquantized bfloat16 fits in a single 80GB H100; quantized versions run on consumer-grade GPUs, supporting IDE coding assistants and agent workflows. If you need fine-tuning sovereignty, data that must stay on-premise, or long-term checkpoint locks (hosted API versions are opaque and can change without warning), take this path.

### Path 3: Mobile AI Edge (E2B / E4B — Another Battlefield)

E2B / E4B are designed for offline use: 128K context (256K for larger lines), native image processing across the family, and native speech input for E2B / E4B. Running fully offline on Android, Raspberry Pi, and Jetson Orin Nano via AICore, ML Kit, and LiteRT. Our [mobile small-model overview](/posts/ai/2026-03-31-mobile-small-models) has a full comparison of this line. In brief: only go off-cloud to touch E2B / E4B if you need offline execution, low latency, and power efficiency.

---

## Division of Labor vs. Gemini: Closed-Source Flagship vs. Open-Weights Flank

Gemma and Gemini's relationship is Google's dual-track approach: **Gemini earns revenue; Gemma builds ecosystem**. See the [Gemini main article](/posts/tech/2026-08-24-ai-model-family-gemini) — the closed-source flagship (1M context, native multimodal, $2/$12) runs only on Google infrastructure; Gemma is the retreat path for developers who need self-hosting, fine-tuning, or data sovereignty. It is explicitly not the frontier. Gemma 4's Apache 2.0 makes that retreat path genuinely open for the first time, but the "open-weights flank" positioning has not changed: if you need the strongest model, go back to Gemini 3.1 Pro.

In the open-weights competitive landscape:

- **Against Qwen** ([AI Model Family article](/posts/tech/2026-08-24-ai-model-family-qwen)): Qwen has the widest size coverage and highest Hugging Face download count, but its Max-tier weights switched to a custom license rather than Apache 2.0 in August 2026 — so Gemma 4 currently leads on "license purity." Qwen's advantages remain in Chinese ecosystem coverage and coding / vision specialist model lines.
- **Against Llama** ([AI Model Family article](/posts/tech/2026-08-24-ai-model-family-llama)): Llama 4 may be the last major open-source Llama release; Meta has shifted focus to the closed-source Muse Spark. The open-weights ground is changing hands — Gemma 4's Apache 2.0 arrives at exactly the right time.
- **Against DeepSeek**: MIT license plus frontier-level quality remains the ceiling for self-hosted cost-performance; Gemma's differentiation is Google's multi-language coverage (including Traditional Chinese) and the end-to-end deployment matrix (cloud → workstation → mobile in one line).

## What This Means for Agent Developers

- **Traditional Chinese RAG within the Cloudflare ecosystem** → Workers AI `gemma-4-26b-a4b-it`: 256K context, $0.10/$0.30, native Vision + Function calling support; details in our [Gemma practical guide](/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai)
- **Need 31B quality without self-hosting** → AI Studio / Gemini API `gemma-4-31b-it`: third on the open-source Arena leaderboard (official blog April data)
- **Need fine-tuning sovereignty or locked checkpoints** → Self-hosted Gemma 4 (Apache 2.0); Ollama / vLLM support from day one; previous Gemma 2/3 gated licenses do not apply
- **Offline mobile agent** → E2B / E4B + AI Edge; 128K context; native speech input
- **Southeast Asian multilingual** → Evaluate SEA-LION variant (`@cf/aisingapore` prefix); Traditional Chinese mainstay is still Gemma 4 core
- **Frontier reasoning / coding** → Not Gemma's battlefield; see the [Gemini main article](/posts/tech/2026-08-24-ai-model-family-gemini) for 3.1 Pro or 3.8 Flash
- **License audit** → Check the Hugging Face license tag first (`gemma` vs `apache-2.0`), then the prohibited-use policy; switching licensing basis for an old project means switching the model, and prompts must be re-tested

## Overall

Gemma's story is "open weights in exchange for ecosystem position." Google does not expect Gemma to win the frontier race — that is Gemini's job. Gemma's role is to make Google models present where Google infrastructure cannot reach: other people's clouds, self-hosted servers, phones. Gemma 4's Apache 2.0 turns that marketing line into a legal reality: before Gemma 4, Gemma was technically a "downloadable proprietary model" rather than open source. Now it is genuinely open.

The limitations are equally clear: 31B, however strong, is not frontier (third on the Arena open-source leaderboard means two ahead of it); 64K-level output limits remain; scientific reasoning and coding benchmarks fall well behind Gemini 3.1 Pro. If your scenario demands the strongest model, Gemma has never been the answer; if your scenario demands "strong enough, self-hostable, with a clean license," Gemma 4 is the first generation where Google genuinely delivers.

---

## References

- [DeepMind Gemma](https://deepmind.google/models/gemma/pro/)
- [Gemma 4 Official Announcement](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/)
- [Gemma 4 License: Apache 2.0](https://ai.google.dev/gemma/apache_2)
- [Gemma Prohibited Use Policy](https://ai.google.dev/gemma/prohibited_use_policy)
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Google AI Edge](https://ai.google.dev/edge)
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources) — this site
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) — this site
