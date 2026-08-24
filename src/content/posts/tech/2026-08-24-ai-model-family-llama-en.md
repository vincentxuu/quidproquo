---
title: "Llama——From Open-Source Experiment to the Most Deployed Open LLM, and Meta's Closed-Source Pivot"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, llama, meta, model-family-llama, open-source, moe, multimodal, model-selection]
lang: en
type: deep-dive
tldr: "Llama is Meta's open-source LLM family, with the largest enterprise deployment footprint and the most mature ecosystem. Llama 4 Scout (10M context) and Maverick (17B active / 400B total MoE) are the current open multimodal benchmarks, but Meta pivoted to closed-source Muse Spark in April 2026—Llama 4 is likely the last major open Llama, and its license is not truly open (Llama 4 Community License, separate license required above 700M MAU)."
description: "Complete Llama model family guide: evolution 2023→2026, Llama 4 MoE architecture & 10M context, Community License trap, Scout/Maverick/Behemoth sub-lines, Meta's Muse Spark pivot, and selection guide for agent developers"
series:
  name: "AI 模型家族"
  order: 5
draft: false
glossary:
  - term: "Llama Community License"
    aliases: ["Llama 4 Community License"]
    definition: "Meta's Llama license—commercial use & fine-tuning allowed, but products above 700M MAU require separate authorization and must display 'Built with Llama'. Not OSI-certified open source"
  - term: "Behemoth"
    definition: "The largest teacher model in Llama 4, 288B active / ~2T total, never publicly released, used to distill Scout and Maverick"
  - term: "Muse Spark"
    definition: "Meta's closed-source flagship launched April 2026, calling Llama 4 Maverick 'our previous generation'—marking Meta's pivot from open to closed source"
  - term: "Llama.cpp"
    definition: "One of the most popular local inference frameworks, community-maintained, allowing Llama weights to run on laptops, phones, even Raspberry Pi—core to Llama's ecosystem"
---

> 🌏 [中文版](/posts/tech/2026-08-24-ai-model-family-llama)

In February 2023, Meta released Llama 1—an open LLM family at 7B/13B/33B/65B. That decision changed the industry: open models went from "academic toy" to "enterprise infrastructure." By April 2026, Llama 4 Scout arrived with a 10M-token window and Maverick with a 128-expert MoE, both open multimodal benchmarks. But the same year Meta launched closed-source Muse Spark, and Llama 4 is likely the last major open Llama. This is the fifth family deep-dive in the "AI 模型家族" series, tracing Llama's complete evolution from Llama 1 to Llama 4 and its changed position in 2026.

For how to read the benchmark numbers cited here, see our [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources). This is part of the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) series.

## Family Evolution Timeline

| Version | Date | Max Size | Key Milestones |
|---|---|---|---|
| Llama 1 | 2023-02 | 65B | First open LLM, catalyzed open ecosystem |
| Llama 2 | 2023-07 | 70B | Commercial license, first large-scale MoE exploration |
| Code Llama | 2023-08 | 34B / 70B | Code-specialized sub-line |
| Llama 3 | 2024-04 | 8B / 70B | 128K context, tool use |
| Llama 3.1 | 2024-07 | 405B | First 400B+ open model |
| Llama 3.2 | 2024-09 | 90B | Multimodal (vision), lightweight |
| Llama 3.3 | 2024-12 | 70B | Quality optimization |
| Llama 4 Scout | 2025-04 | 109B | 10M context, 16-expert MoE |
| Llama 4 Maverick | 2025-04 | 400B | 128-expert MoE, native multimodal |
| Muse Spark (closed) | 2026-04 | — | Meta's first closed flagship, signals pivot |

Three years, nine milestones. Llama's through-line: **from small to large, from text-only to multimodal, from open to (partly) closed**. Llama 4 is the inflection—both the open peak and likely the last major open Llama.

## Two Product Lines: Open Weights for Ecosystem, Closed Muse Spark for Flagship

To understand Llama's 2026 moves, split it into two parallel lines—like Qwen and Meta, open-first then recently closing:

**Open-Weight Line** (HuggingFace / Ollama / llama.cpp): Every generation from Llama 1 through Llama 4, fully downloadable, fine-tunable, self-hostable. This line owns ecosystem—Ollama, vLLM, llama.cpp all first-class; fine-tuning community's preferred base; nearly every local AI desktop app (LM Studio, Jan, GPT4All) runs Llama out of the box.

**Closed-Flagship Line** (Muse Spark): Only appeared April 2026, with Meta's announcement calling Llama 4 Maverick "our previous generation"—marking the flagship's shift from open to closed. This line never releases weights; future updates are Meta-only.

The turning point: Meta (ex-Facebook) has, since establishing FAIR in 2013, used "open source" as core strategy—not by selling model API (unlike OpenAI and Anthropic), but by enhancing social products and collecting hosting fees via Azure/AWS. Llama is the vehicle. Muse Spark's closure is a strategic pivot (against Claude, GPT closure pressure and rising training costs), not a return to roots—but it does leave "will Llama stay open?" as an open question.

## Architecture: Three Key Designs of Llama 4

### MoE: Only 17B Active Per Step

Llama 4 is Meta's first fully Mixture-of-Experts family. Maverick example:

```
Total params:    400B
Active params:   17B (activated per inference step)
Experts:         128 routed + 1 shared
Sparsity:        ~24:1
```

Each token hits the shared expert plus one of 128 routed experts. All parameters sit in memory, but only a fraction activates per step—letting a 400B-class model serve on a single H100 host while staying frontier quality. Scout is 17B active / 109B total, 16 experts, designed to fit a single H100 quantized to Int4.

### Native Multimodality: Early Fusion

Llama 4 uses early fusion—pre-training data mixes text and images from the start, not a vision adapter bolted onto a text model after training. Scout and Maverick natively understand images, not just "a text model with a vision add-on."

### 10M Context: Scout's Killer Feature

Scout's 10M-token context is the longest of any model (open or closed). A single request can hold an entire codebase, a whole book, or hours of transcript. Caveat: 10M is the documented upper bound; actual usable context depends on hardware and serving stack—after Int4 quantization Scout fits a single H100, but full 10M context still needs more KV-cache memory.

## Llama 4: Scout, Maverick, Behemoth—How to Choose

2026's three naming slots serve distinct roles:

| Item | Llama 4 Scout | Llama 4 Maverick | Llama 4 Behemoth |
|---|---|---|---|
| Total params | 109B | 400B | ~2T (unreleased) |
| Active params | 17B | 17B | 288B |
| Experts | 16 | 128 + 1 shared | 16 (planned) |
| Context | 10M | 1M | — |
| Multimodal | ✓ | ✓ | — |
| Status | Open source | Open source | Never released |
| Positioning | Ultra-long context reader | Production-grade multimodal | Teacher model (distillation) |

Pricing (via third-party hosts; Meta offers no first-party API):

| Model | Input ($/MTok) | Output ($/MTok) | Context |
|---|---|---|---|
| Llama 4 Scout | $0.08 | $0.30 | 10M |
| Llama 4 Maverick | $0.27 | $0.85 | 1M |
| Llama 3.1 405B | $3.50 | $3.50 | 128K |
| Llama 3.3 70B | $0.88 | $0.88 | 128K |

Scout's $0.08 input is the cheapest of all models; paired with 10M context, it's the value king for long-document work.

### License Trap: Open, But Not As Open As You Think

Llama 4 uses the **Llama 4 Community License**—not OSI-certified open source. Key restrictions:

- Products with **>700M MAU** using Llama 4 must seek separate authorization from Meta (approval at Meta's discretion)
- Must display "Built with Llama" on the product
- Has an Acceptable Use Policy

For most enterprises, this is near-open. For mega-platforms (Twitter, Snapchat, etc.), it's a real legal constraint. Compared to Apache 2.0 (most Qwen models) or MIT (GLM-5, DeepSeek), the permissiveness gap is clear—if your deployment depends on license certainty, "downloadable weights" ≠ "freely commercial."

### Performance Position

| Metric | Llama 4 Maverick / Scout | Comparison |
|---|---|---|
| SWE-bench and other engineering benchmarks | ~3pp behind | Claude Opus 5 96%, DeepSeek V4 Pro 96.4%—open vs closed flagship gap |
| Long context (10M) | Scout exclusive | Longest of any model (open or closed); Qwen3.8-Max 1M, Gemini 1M |
| Cost | Scout $0.08 input cheapest | Maverick $0.27/$0.85 still far below closed flagships (Claude $5/$25, GPT $5/$30) |
| Multimodality | Maverick native multimodal | Peer to Qwen3-VL and Gemini native multimodal |

Direct comparison:

| Metric | Llama 4 Maverick | Qwen3.8-Max | DeepSeek V4 Pro | Claude Opus 5 |
|---|---|---|---|---|
| Total params | 400B | 2.4T | — | — |
| Active params | 17B | 95B | — | — |
| Context | 1M | 1M | 1M | 1M |
| License | Community License | Custom / Apache | MIT | Closed |
| SWE-bench | ~3pp behind | 67.7% (SWE-Bench Pro) | 96.4% | 96% |

Llama 4 still owns long-context and cost, but trails frontier by ~3pp on engineering benchmarks. On the "openness" spectrum it sits in the "downloadable but conditional" middle—more restrictive than true open (Apache/MIT), more free than fully closed.

## Sub-lines & Ecosystem: A Table of All Llama Models

Llama runs multiple sub-lines beyond the general main line:

| Sub-line | Representative | Latest Status (2026-08) |
|---|---|---|
| General main line | Llama 3.1/3.3 → Llama 4 Scout/Maverick | Open weights, Community License |
| Code Llama | Code Llama 34B/70B | Independent iteration ended, capability merged into main line |
| Vision-language | Llama 3.2 Vision 11B/90B → Llama 4 native multimodal | Vision became native main-line capability |
| Lightweight edge | Llama 3.2 1B/3B | Phone, edge devices |
| Safety tooling | Purple Llama | Open safety evaluation framework |

Two trends in this table:

**Capability consolidated into the main line.** Code Llama independent iteration ended—same playbook as Qwen and DeepSeek consolidating sub-lines. Once general models' specialist capability was strong enough, maintaining standalone sub-lines no longer paid. Vision took a different path: not cut, but turned into native capability via early fusion.

**Ecosystem breadth is the hidden moat.** Llama's real moat isn't a single model but **ecosystem**. Llama.cpp, Ollama, vLLM, Hugging Face Transformers all first-class; fine-tuning community's preferred base; most local AI desktop apps run Llama by default. That "runs everywhere" penetration makes Llama the de facto standard for open inference.

Final reminder: model suffixes (Scout/Maverick/Behemoth) don't guarantee downloadable weights (Behemoth never released). Check license and release status for self-host, not the suffix.

## Position Against Competitors

Placing Llama 4 in the 2026 open landscape:

- **vs Qwen**: Qwen3.8-Max (2.4T) total and active params dwarf Maverick, and most Qwen models ship Apache 2.0 for better license certainty. Llama's edge is ecosystem maturity—still ahead on local inference framework support
- **vs DeepSeek V4**: DeepSeek's MLA architecture is cheaper, pricing more aggressive ($0.28/$0.42); Llama 4 exclusive on 10M context
- **vs Kimi K3 (2.8T open)**: K3 total params larger, but Llama 4 Scout's 10M context remains the longest
- **vs Closed (Claude / GPT / Gemini)**: Llama 4 trails ~3pp on SWE-bench and other engineering benchmarks, and Meta has pivoted to closed Muse Spark with uncertain future updates
- **vs Mistral / GLM**: Llama's ecosystem penetration still leads, but Mistral's license is cleaner (Apache/Modified MIT) and GLM pursues domestic compliance

## What This Means for Agent Developers

- **Ultra-long document analysis** → Llama 4 Scout: 10M context + $0.08/MTok, unbeatable value right now
- **Cost-sensitive enterprise deployment** → Scout / Maverick self-hostable, data never leaves your infra—fits healthcare, finance data-sovereignty needs
- **Multilingual scenarios** → Llama 4 supports 200 languages (Arabic, Spanish, German, Hindi, etc.)
- **Local / edge inference** → Llama.cpp + quantization lets Llama run on laptops, even phones
- **Need license certainty** → Community License's 700M MAU clause; mega-platforms should use MIT/Apache models (GLM, DeepSeek, most Qwen)
- **Need frontier coding agent** → Llama 4 trails Claude and DeepSeek—pick those instead
- **Citing benchmarks** → Llama's naming matrix (gen × Scout/Maverick/Behemoth) is easy to confuse with unreleased Behemoth. Always write the full model name plus date, otherwise you're comparing different events

## Overall

Llama's story is "how open source changed an industry." Meta's Llama family proved open models could hit commercial quality, spawning countless Llama-based products worldwide. Llama 4 Scout's 10M context and Maverick's 128-expert MoE remain technical benchmarks for open models; ecosystem penetration (Llama.cpp as the local inference byword) is unmatched.

But 2026's turn is also clear—Meta launched closed Muse Spark, calling Llama 4 Maverick "our previous generation." Two signals: Meta has moved its flagship from open to closed; Llama 4's future updates are uncertain. For agent developers, Llama 4 still owns ultra-long context and cost, but Community License (not OSI open) and Meta's strategic pivot are adoption risks. On the "openness" spectrum, Llama 4 sits "downloadable but conditional"—one more constraint than true open (Apache/MIT), one more freedom than fully closed.

---

## References

- [Llama 4 — Meta AI Official Blog](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)
- [Llama 4 Scout and Maverick on Hugging Face](https://huggingface.co/blog/llama4-release)
- [Llama 4 Model Card](https://github.com/meta-llama/llama-models/blob/main/models/llama4/MODEL_CARD.md)
- [Meta Llama Pricing Guide 2026 — AI Cost Check](https://aicostcheck.com/blog/meta-llama-pricing-guide-2026)
- [Llama 4, reviewed — benchr](https://benchr.org/articles/llama-4-review)
- [Meta Superintelligence Labs / Muse Spark](https://ai.meta.com/)
- [Llama.cpp — Local Inference Framework](https://github.com/ggerganov/llama.cpp)
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources) — this site
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) — this site