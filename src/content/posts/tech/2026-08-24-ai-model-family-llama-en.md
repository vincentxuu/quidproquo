---
title: "Llama: From Open-Source Experiment to the Most Deployed Open-Weight LLM, and Where It Stands After Meta Moved Open Weights to Muse"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, llama, meta, model-family-llama, open-source, moe, multimodal, model-selection]
lang: en
type: deep-dive
tldr: "Llama is Meta's open-weight LLM family, with the most mature ecosystem and the largest deployment footprint. The newest generation is still Llama 4, released 2025-04-05: Scout (109B total, 17B active, 10M context) and Maverick (400B / 17B, 1M context); there is no Llama 5. Meta's 2026 models use the Muse brand instead: the closed Muse Spark and Wonder, plus the open-weight Muse Glimmer (Apache 2.0) and Muse Spark Open. Llama 4 ships under the conditional Community License: a 700M monthly-active-user threshold, derivative model names that must start with Llama, and no multimodal rights for EU-based individuals and companies."
description: "A complete guide to the Llama family: the 2023-to-2026 timeline, Llama 4's MoE architecture and 10M context, official benchmarks, the three conditions of the Llama 4 Community License, how Scout, Maverick, and Behemoth differ, third-party hosting prices, where Llama stands after Meta's move to Muse, and selection advice for agent developers."
series:
  name: "AI Model Families"
  order: 5
draft: false
glossary:
  - term: "Llama Community License"
    aliases: ["Llama 4 Community License"]
    definition: "Meta's Llama license: commercial use and fine-tuning are allowed, but licensees above 700M monthly active users at Llama 4's release must request a separate license from Meta; distributions must display 'Built with Llama', and derivative models trained with Llama must start their names with 'Llama'. Not an OSI-approved open-source license"
  - term: "Behemoth"
    definition: "Llama 4's teacher model, with 288B active and nearly 2T total parameters across 16 experts, used to co-distill Maverick and never publicly released"
  - term: "Muse"
    definition: "The model family Meta Superintelligence Labs has released since April 2026, including the closed Muse Spark, Wonder, and Ember and the open-weight Muse Glimmer and Muse Spark Open; not a rename of Llama"
  - term: "Llama.cpp"
    definition: "One of the most popular local inference frameworks, community-maintained, letting Llama and other open-weight models run on laptops and phones; the core of the Llama ecosystem"
---

> :globe: [中文版](/posts/tech/2026-08-24-ai-model-family-llama)

Llama is the family that turned open-weight LLMs from academic toys into enterprise infrastructure. Llama 1 opened the story in February 2023, and Llama 4 Scout and Maverick brought MoE and native multimodality in April 2025. Since then Meta has shipped no new Llama: its 2026 models all carry the Muse name, including the open-weight Muse Glimmer and Muse Spark Open. This guide is for agent developers who already run Llama or are choosing an open-weight model: by the end you should know which work Llama 4 still suits, whether its license conditions affect you, and when to look at Muse or other families instead.

For how to read the benchmark numbers cited here, see the [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en). This is part of the [AI model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) series.

## Family positioning and model matrix

Based on Meta's `meta-llama` organization on Hugging Face and the official model cards as of 2026-11-23; the newest Llama generation is still Llama 4:

| Model / line | Positioning | Key difference | Access |
|---|---|---|---|
| Llama 4 Scout (17B×16E) | Ultra-long context, multimodal on a single GPU | 109B total, 17B active; 10M context; fits one H100 with Int4 quantization | Community License weights; third-party hosted APIs |
| Llama 4 Maverick (17B×128E) | General multimodal chat and image understanding | 400B total, 17B active; 1M context; FP8 weights fit one H100 host | Community License weights; third-party hosted APIs |
| Llama 3.3 70B / 3.2 1B, 3B | Older dense models, lightweight on-device | Text only; 128K context | Community License weights |
| Muse Glimmer / Muse Spark Open (separate family) | Meta's 2026 open-weight models | Not part of the Llama generations, with different licenses | See the [Muse Spark family](/posts/tech/2026-09-19-ai-model-family-muse-spark-en) |

Hosted Llama inference comes mainly through aggregators such as OpenRouter and cloud providers, or you self-host. Behemoth was never released; seeing the name in a third-party catalog does not mean weights are downloadable.

### Two product lines: the Llama open-weight ecosystem, and Muse for new models
The key to Llama's 2026 position is to split Meta's models into two lines:

**The Llama open-weight line** (Hugging Face / Ollama / llama.cpp): every checkpoint from Llama 1 to Llama 4 can be downloaded, fine-tuned, and self-hosted. Ollama, vLLM, and llama.cpp all support it, the fine-tuning community has long treated it as the default base model, and nearly every local AI desktop app runs it out of the box. Meta's developer site still hosts docs, licenses, and use policies for Llama 4, 3, and 2, but the model directory in the `llama-models` repository stops at `llama4`.

**The Muse line** (Meta Superintelligence Labs): Muse Spark on 2026-04-08 was the first. Meta's announcement says its new pre-training stack reaches the same capability "with over an order of magnitude less compute than our previous model, Llama 4 Maverick." The later Muse Spark 1.x and Wonder are closed, while August's Muse Glimmer (30B, Apache 2.0) and October's Muse Spark Open (816B / 42B, Muse Model License) are open-weight. Meta has not formally ended Llama; a spokesperson said only that "our current Llama models will continue to be available as open source."

So the practical reading is: Llama 4 is a stable older generation with the most complete ecosystem, and Meta's new capabilities live in Muse. For anything new, go to the [Muse Spark family](/posts/tech/2026-09-19-ai-model-family-muse-spark-en).

### Sub-lines and ecosystem
| Sub-line | Representative models | Status (2026-11) |
|---|---|---|
| General main line | Llama 3.1 / 3.3 → Llama 4 Scout / Maverick | Open weights, Community License; no new generation after Llama 4 |
| Code Llama | Code Llama 7B–70B | No longer developed separately; capabilities folded into the main line |
| Vision-language | Llama 3.2 Vision 11B / 90B → Llama 4 native multimodality | Vision became a built-in main-line capability |
| Lightweight on-device | Llama 3.2 1B / 3B | Phones and edge devices |
| Safety tools | Llama Guard 4, Prompt Guard 2 (Purple Llama) | No new versions since April 2025 |

Two trends:

**Capabilities fold into the main line.** Code Llama stopped evolving separately, and vision became native through early fusion, the same script Qwen and DeepSeek followed when folding in their sub-lines.

**Ecosystem reach is the hidden moat.** Llama's real moat is not any single model but running everywhere. That advantage still holds, which is why Llama 4 is worth covering a year and a half after its last update; Muse Spark Open shipped with day-one support for llama.cpp, vLLM, SGLang, and the same toolchain, so Muse inherits that ecosystem rather than replacing it.

## Family evolution

### Family timeline
| Version | Released | Key facts | What changed for selection |
|---|---|---|---|
| Llama 1 | 2023-02 | 7B / 13B / 33B / 65B, research license | Open weights first approached commercial quality, kick-starting the open ecosystem |
| Llama 2 | 2023-07 | 7B / 13B / 70B, commercial use allowed (with a MAU clause) | Companies could legally put an open-weight model into products for the first time |
| Code Llama | 2023-08 | Code-specialized sub-line | Open coding models got an official base |
| Llama 3 | 2024-04 | 8B / 70B, 8K context | Big quality jump at small sizes; 8B became the local-deployment default |
| Llama 3.1 | 2024-07 | 405B, context extended to 128K, tool use | First 400B-class open-weight model; self-hosted frontier quality became feasible |
| Llama 3.2 | 2024-09 | 1B / 3B text, 11B / 90B vision | Official options for on-device and multimodal use |
| Llama 3.3 | 2024-12 | 70B, close to 405B quality | Large-model quality at 70B cost |
| Llama 4 Scout / Maverick | 2025-04-05 | MoE, native multimodality; Scout with 10M context | The current Llama selection baseline, covered in the sections below |
| Muse Spark (closed) | 2026-04-08 | MSL's first model, no weights released | Meta's flagship left the Llama brand, and Llama 4 stopped being Meta's newest model ([Muse Spark 1.2 model card](/posts/daily/2026-08-24-model-meta-muse-spark-1-2-en)) |
| Muse Glimmer | 2026-08-10 | 30B, Apache 2.0 | Meta resumed open-weight releases, under the Muse name and a looser license ([model card](/posts/daily/2026-08-17-model-meta-muse-glimmer-en)) |
| Muse Wonder (closed) | 2026-10-12 | MSL's first frontier model, $4/$20 | Meta's strongest model priced alongside closed flagships ([model card](/posts/daily/2026-10-12-model-meta-muse-wonder-en)) |
| Muse Spark Open | 2026-10-15 | 816B / 42B open weights, Muse Model License | Meta's large open-weight model shifted from Llama 4 Maverick to Spark Open ([model card](/posts/daily/2026-10-16-model-meta-muse-spark-open-en)) |

Llama's arc runs from small to large models, from text-only to multimodal, and from research licensing to conditional commercial use. Llama 4 is where that line currently ends; since then both Meta's open-weight and closed models have developed under Muse.

## Architecture and training trade-offs

### Architecture: three key designs in Llama 4
#### MoE: only 17B active per token

Llama 4 is Meta's first mixture-of-experts family. Specs from the official model card:

```
Scout:     109B total, 17B active, 16 experts, ~40T pre-training tokens
Maverick:  400B total, 17B active, 128 experts, ~22T pre-training tokens
Knowledge cutoff: August 2024
```

All parameters sit in memory, but each token activates only a small part. Meta's launch post says Scout fits a single H100 with Int4 quantization and Maverick's FP8 weights fit a single H100 host. Besides its 128 routed experts, Maverick has a shared expert that every token passes through. It was co-distilled during pre-training from Behemoth (288B active, nearly 2T total).

#### Native multimodality: early fusion

Llama 4 was trained with early fusion: the pre-training corpus mixes text and images from the start, rather than training a text model and bolting on a vision adapter. The model card says image understanding was tested with up to 5 input images; beyond that, test it yourself.

#### 10M context: Scout's signature feature

Scout's 10M-token context lets a single request hold a full codebase or an entire book. But 10M is the model's spec ceiling; usable length depends on the serving stack and KV cache memory, and third-party hosts usually expose only part of it: on OpenRouter, Scout's context is 1,310,720 and Maverick's is 524,288.

#### Languages

The model card lists 12 officially supported languages: Arabic, English, French, German, Hindi, Indonesian, Italian, Portuguese, Spanish, Tagalog, Thai, and Vietnamese. Pre-training covered 200 languages, and others can be fine-tuned, with safety the developer's responsibility. Chinese is not on the supported list.

## Evaluation and alternatives

### Official numbers: Llama 4 versus its predecessors
These are the instruction-tuned results (bf16) from the Llama 4 model card, compared with Meta's own previous models:

| Benchmark | Llama 3.3 70B | Llama 3.1 405B | Llama 4 Scout | Llama 4 Maverick |
|---|---|---|---|---|
| MMLU Pro | 68.9 | 73.4 | 74.3 | 80.5 |
| GPQA Diamond | 50.5 | 49.0 | 57.2 | 69.8 |
| LiveCodeBench (2024/10–2025/02) | 33.3 | 27.7 | 32.8 | 43.4 |
| MMMU (image reasoning) | Not supported | Not supported | 69.4 | 73.4 |
| ChartQA | Not supported | Not supported | 88.8 | 90.0 |
| DocVQA | Not supported | Not supported | 94.4 | 94.4 |

These are April 2025 evaluations, with questions and comparison models frozen at that time. Meta's launch post said Maverick beat GPT-4o and Gemini 2.0 Flash and matched DeepSeek V3 on reasoning and coding back then. To compare it with 2026 agentic coding models, rerun both on the same third-party evaluation; do not set this table against newer ones.

### Where it sits against competitors
- **Versus Muse (same company)**: Muse Glimmer 30B is an Apache 2.0 small model aimed at local and agent use; Muse Spark Open is Meta's current large open-weight flagship. For Meta's new capabilities, see the [Muse Spark family](/posts/tech/2026-09-19-ai-model-family-muse-spark-en)
- **Versus DeepSeek and GLM**: both have moved their open weights to 2026 generations that far exceed Llama 4 on agentic coding; DeepSeek V4.1 Flash and GLM-5.3-Flash are MIT. See the [DeepSeek family](/posts/tech/2026-08-24-ai-model-family-deepseek-en) and [GLM family](/posts/tech/2026-08-24-ai-model-family-glm-en)
- **Versus Qwen**: a wider size range, mostly Apache 2.0, and better Chinese than Llama 4. See the [Qwen family](/posts/tech/2026-08-24-ai-model-family-qwen-en)
- **Versus closed models (Claude / GPT / Gemini)**: the gap is now several generations; Llama 4's remaining advantages are self-hosting, low prices, and the ecosystem

As of November 2026, Llama 4 holds only two exclusive niches: Scout's 10M-context spec and the maturity of support in every inference tool.

## Licensing, pricing, and deployment

### The license trap: downloadable does not mean unconditional
Llama 4 uses the **Llama 4 Community License** (effective 2025-04-05), which is not an OSI-approved open-source license. Its main conditions:

- **700M MAU threshold**: licensees with more than 700 million monthly active users in the month before Llama 4's release must request a license from Meta, which may grant it at its sole discretion
- **Attribution and naming**: distributing Llama or products containing it requires including the license and prominently displaying "Built with Llama"; models trained with Llama or its outputs and then distributed must start their names with "Llama"
- **EU restriction**: the use policy states that rights to the multimodal models in Llama 4 are not granted to individuals domiciled in, or companies with a principal place of business in, the European Union; end users of products built on them are not affected
- **Acceptable use policy**: a separate policy restricts uses

For most non-EU companies this is close to open source, but for EU companies wanting to deploy Scout or Maverick themselves, it is a hard limit. Compared with Apache 2.0 (most Qwen models, Muse Glimmer) or MIT (DeepSeek, GLM-5.3-Flash), "downloadable weights" does not mean "free commercial use."

### How Scout, Maverick, and Behemoth differ
| Item | Llama 4 Scout | Llama 4 Maverick | Llama 4 Behemoth |
|---|---|---|---|
| Total parameters | 109B | 400B | Nearly 2T |
| Active parameters | 17B | 17B | 288B |
| Experts | 16 | 128 | 16 |
| Context | 10M | 1M | — |
| Multimodal | ✓ | ✓ | ✓ |
| Status | Open weights | Open weights (BF16 / FP8) | Never released |
| Role | Ultra-long context, single-GPU deployment | General multimodal | Teacher model (for distillation) |

### Third-party hosting prices
OpenRouter's model catalog (read 2026-11-23), per 1M tokens:

| Model | Input | Output | Exposed context |
|---|---|---|---|
| Llama 4 Scout | $0.10 | $0.30 | 1,310,720 |
| Llama 4 Maverick | $0.35 | $1.00 | 524,288 |
| Llama 3.3 70B | $0.71 | $0.71 | 131,072 |

Prices vary widely by host; Artificial Analysis lists a median Maverick price of $0.25/$0.97. If you need long context, check how much a provider actually exposes rather than the 10M spec.

## Agent integration and selection

### What this means for agent developers
- **An existing Llama deployment that works well** → no need to rush a switch. Llama 4's weights and license remain, with the most complete toolchain support; just know it will not be updated
- **Reading very long documents in one pass** → Llama 4 Scout's 10M context is still the longest on paper, but hosts usually expose only part of it, so long context usually means self-hosting
- **Data that cannot leave your infrastructure, multimodal on one GPU** → Scout (fits one H100 with Int4 quantization)
- **New projects wanting Meta's open weights** → look at Muse Glimmer (Apache 2.0, 30B) or Muse Spark Open first, then decide whether Llama 4 still fits
- **Frontier coding agents, multi-step autonomous tasks** → Llama 4 is several generations behind; choose DeepSeek, GLM, Qwen, or a closed flagship
- **EU companies, or platforms near 700M MAU** → Llama 4's multimodal rights and MAU clause will block you directly; use Apache 2.0 or MIT models
- **Chinese-first applications** → Chinese is not among Llama 4's supported languages; Qwen, GLM, and DeepSeek fit better
- **When citing benchmarks** → state Scout or Maverick and instruct or base; Behemoth's numbers are a preview with no usable weights

## Limitations and trade-offs

Llama 4's official evaluations date from April 2025 and compare against models of that time; Meta has released no new Llama version and has not described a long-term plan for the line. The Community License's MAU threshold, naming rule, and EU multimodal restriction put it behind Apache 2.0 and MIT models on licensing certainty. Scout's 10M context is a spec, not what third-party hosts actually offer. And downloading Llama weights does not give you Muse's capabilities: they are different models under different licenses.

### The big picture
Llama's story is how open source changed an industry. Meta used it to prove open weights could reach commercial quality, and the ecosystem it left behind (llama.cpp is nearly synonymous with local inference) remains unmatched. But by late 2026 Llama 4 is an older generation: Meta's new models, including its new open weights, ship under the Muse name. For agent developers, Llama 4 is still a stable option that runs anywhere; for new capabilities or a cleaner license, look to Muse, DeepSeek, GLM, or Qwen.

## Update history

- 2026-11-23: Rewrote every section against Meta's official model card, the full license text, and third-party hosting prices as of 2026-11-23. The model matrix now states that Llama 4 is still the newest Llama generation, and Meta's 2026 models (Muse Spark, Glimmer, Wonder, Spark Open) were added to the timeline with links to the daily model cards and the Muse Spark family guide; evaluation now uses the official numbers from the Llama 4 model card; licensing adds the derivative-naming rule and the EU multimodal restriction; prices now come from the OpenRouter catalog. Corrections: the intro described Llama 4 as an April 2026 model (it was released 2025-04-05); Llama 2 was not an MoE model; Llama 3 launched with 8K context, and 128K arrived with 3.1; Llama 4 officially supports 12 languages, while 200 is the pre-training coverage; removed "about 3 points behind on SWE-bench" and the Claude and DeepSeek comparison figures, which do not match official evaluations; replaced the old price table (Scout at $0.08 and so on) with current hosting prices.
- 2026-10-11: Reorganized sections into the shared family format and added a matrix built from existing content. Kept the original versions, prices, and source dates; no new fact-check was performed.

## References

- [The Llama 4 herd — Meta AI blog](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)
- [Llama 4 Model Card — meta-llama/llama-models](https://github.com/meta-llama/llama-models/blob/main/models/llama4/MODEL_CARD.md)
- [Llama 4 Community License Agreement](https://github.com/meta-llama/llama-models/blob/main/models/llama4/LICENSE)
- [Llama 4 Acceptable Use Policy](https://github.com/meta-llama/llama-models/blob/main/models/llama4/USE_POLICY.md)
- [Llama 4 Scout and Maverick on Hugging Face](https://huggingface.co/blog/llama4-release)
- [Introducing Muse Spark — Meta AI](https://ai.meta.com/blog/introducing-muse-spark-msl)
- [Introducing Muse Spark Open — Meta AI Research](https://research.meta.ai/blog/muse-spark-open)
- [Goodbye, Llama? Meta launches new proprietary AI model Muse Spark — VentureBeat](https://venturebeat.com/technology/goodbye-llama-meta-launches-new-proprietary-ai-model-muse-spark-first-since)
- [OpenRouter Models API](https://openrouter.ai/api/v1/models)
- [Llama 4 Maverick — Artificial Analysis](https://artificialanalysis.ai/models/llama-4-maverick)
- [Llama.cpp — local inference framework](https://github.com/ggerganov/llama.cpp)
- [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
- [AI model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site
