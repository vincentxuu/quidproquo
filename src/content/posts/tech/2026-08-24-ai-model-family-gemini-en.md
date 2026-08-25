---
title: "Gemini——Google's Native Multimodal Flagship: 1M Context and Scientific Reasoning Champion"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, gemini, google-deepmind, model-family-gemini, multimodal, reasoning, model-selection]
lang: en
type: deep-dive
tldr: "Gemini is Google DeepMind's native multimodal LLM family, famed for a 1M-token context window and native video/speech input plus scientific reasoning. 3.1 Pro tops GPQA Diamond 94.1% and ARC-AGI-2 77.1% to claim science-reasoning dual crowns, at $2/$12—1/6 of Claude. 3.7 Flash delivers near-Pro agent capability for $0.75/$3.75."
description: "Complete Gemini model family guide: evolution from Gemini 1.0 (2023) to 3.1 Pro / 3.7 Flash (2026), native multimodal architecture, 1M context, pricing comparison, benchmarks, and selection guide for agent developers"
series:
  name: "AI Model Families"
  order: 4
draft: false
glossary:
  - term: "Native multimodality"
    definition: "Integrated text, image, video, speech from pre-training—not retrofitted via vision/speech adapters"
  - term: "ARC-AGI-2"
    definition: "Second-generation AGI benchmark—tests models on novel logical patterns, considered closest to measuring 'true intelligence'"
  - term: "Context caching"
    definition: "Gemini's caching—reused context can be cached, cutting input cost by 75% on cache hits"
  - term: "Deep Think"
    definition: "Gemini's deep reasoning mode—spends more time thinking to improve accuracy on complex problems"
---

> 🌏 [中文版](/posts/tech/2026-08-24-ai-model-family-gemini)

In December 2023, Google DeepMind released Gemini 1.0—the first "native multimodal" model that integrated text, image, video, and speech from pre-training. Two and a half years later, in February 2026, Gemini 3.1 Pro topped GPQA Diamond at 94.1% to become the strongest science-reasoning model, and hit 77.1% on ARC-AGI-2 as the highest Fluid Intelligence score. At $2/$12, roughly one-sixth of Claude Opus. This is the fourth family deep-dive in the "AI 模型家族" series, tracing Gemini's evolution from 1.0 to 3.7 Flash.

For how to read the benchmark numbers cited here, see our [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources). This is part of the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) series.

## Family Evolution Timeline

| Version | Date | Context | Key Milestones |
|---|---|---|---|
| Gemini 1.0 Ultra/Pro/Nano | 2023-12 | 32K | First native multimodal model |
| Gemini 1.5 Pro | 2024-02 | 1M | Industry-first 1M context |
| Gemini 1.5 Flash | 2024-05 | 1M | Lightweight, speed-first |
| Gemini 2.0 Flash | 2024-12 | 1M | Agent capability, tool use |
| Gemini 2.5 Pro | 2025-03 | 1M | Major reasoning boost |
| Gemini 2.5 Flash | 2025-04 | 1M | Cost-effective Flash |
| Gemini 3.0 Pro | 2025-11 | 1M | Gemini 3 debut |
| Gemini 3.1 Pro | 2026-02 | 1M | ARC-AGI-2 77.1%, GPQA 94.1% |
| Gemini 3.1 Flash-Lite | 2026-03 | 1M | $0.25/$1.50, fastest & cheapest |
| Gemini 3.5 Flash | 2026-05 | 1M | Agent capability near Pro |
| Gemini 3.6 Flash | 2026-07 | 1M | Continuous iteration |
| Gemini 3.7 Flash | 2026-08 | 1M | Smartest Flash, $0.75/$3.75 |

Two and a half years, 12 milestones. Gemini's through-line: **from multimodality to agents, from flagship to full-size coverage**. 1M context was Gemini's earliest moat, and every subsequent generation pushed harder on multimodal understanding and agent capability.

## Two Product Lines: Closed Gemini for Revenue, Open Gemma for Ecosystem

To understand Gemini's 2026 layout, split it into two lines—much like GPT's dual track:

**Closed API Line** (AI Studio / Vertex AI): The entire Gemini 3 family runs only on Google infrastructure, no downloadable weights. Since the 1.5 era, 1M context has been standard; pricing starts at $2/$12. This line owns revenue—Google's enterprise and consumer traffic all runs here, backed by TPU hardware and a global datacenter footprint.

**Open-Weight Line** (Gemma 2 / 3, 2B–27B): Apache 2.0, downloadable, fine-tunable, self-hostable. This line owns ecosystem—giving developers needing self-host, fine-tuning, and data sovereignty a path, but explicitly not the frontier model.

Google wrote the Transformer paper in 2017, acquired DeepMind in 2014, and in December 2023 merged Brain and DeepMind into **Google DeepMind** with Gemini as the unified brand—consolidating research to counter OpenAI and Microsoft. Gemma's open source is strategic gap-filling, not a reversal—the closed-flagship main line has never loosened.

## Architecture: Two Walls—Native Multimodality and 1M Context

### Native Multimodality

Gemini has been native multimodal since v1—text, image, video, speech trained together from pre-training, not a vision adapter bolted onto a text model after the fact.

This means Gemini truly "understands" video and speech, not just transcribing them to text first. 3.1 Pro supports:

- **Text**: standard LLM capability
- **Image**: understanding, analysis, reasoning
- **Video**: directly processes video clips (not screenshots)
- **Speech**: native speech understanding and generation
- **PDF**: direct document parsing

### 1M Context Window

February 2024, Gemini 1.5 Pro became the industry's first 1M-token model. Not a gimmick—1M tokens ≈ 10 full novels, 30K lines of code, or five hours of speech transcription.

By 3.1 Pro, 1M context is mature and stable. Note: **beyond 200K tokens, pricing doubles** ($4/$18). If your workload routinely exceeds 200K, effective cost is far above $2/$12.

### Deep Think

Gemini's deep reasoning mode, analog to Claude's extended thinking or GPT's reasoning effort. 3.1 Pro's Deep Think jumped ARC-AGI-2 from 31.1% (3 Pro) to 77.1%—one of 2026's largest single capability leaps.

## Gemini 3.1 Pro and 3.7 Flash—How to Choose

February's flagship vs August's workhorse:

| Item | Gemini 3.1 Pro | Gemini 3.7 Flash | Gemini 3.1 Flash-Lite |
|---|---|---|---|
| Positioning | Flagship reasoning, science/research | Agent workhorse, balanced | High throughput, lowest cost |
| Input ($/MTok) | $2 (≤200K) / $4 (>200K) | $0.75 (promo thru 2026/12) | $0.25 |
| Output ($/MTok) | $12 (≤200K) / $18 (>200K) | $3.75 (promo thru 2026/12) | $1.50 |
| Context caching | $0.20 / $0.40 | $0.075 | $0.025 |
| Context | 1M | 1M | 1M |
| Max output | 64K | 64K | 64K |
| Deep Think | ✓ | ✓ | ✓ |
| Native multimodality | ✓ (text / img / video / speech / PDF) | ✓ | ✓ (text / img / video, speech extra) |

Pricing and specs from [Gemini Developer API Pricing](https://ai.google.dev/gemini-api/docs/pricing) and [Gemini API Models](https://ai.google.dev/gemini-api/docs/models).

### License Trap: Strongest Models Locked to Google Infra

Google mirrors OpenAI—closed flagship + small open model dual track:

- **Closed flagship (all Gemini 3.1)**: API only (AI Studio / Vertex AI), no weights, license = Google Terms of Service
- **Open weights (Gemma 2 / 3, 2B–27B)**: Apache 2.0, downloadable, fine-tunable, self-hostable—but only small-mid, not frontier
- **Enterprise**: Gemini on Vertex AI governed by Google Cloud contracts; data-processing location selectable per region

The catch: **Gemini's strongest models are almost entirely bound to Google infrastructure**. Want 1M context or native video understanding? Must go through Google API or Vertex. Gemma is Apache 2.0 but at 27B is far behind Gemini 3.1 Pro. If you need "Apache 2.0 + frontier quality," Gemini can't deliver—look at DeepSeek (MIT) or Qwen (mostly Apache).

Another trap: **Google ecosystem lock-in**—Gemini's depth advantages (search, YouTube, Maps, Workspace) only shine inside Google's world. Outside, it reverts to an ordinary frontier model. And a pricing trap: **the 200K threshold**—once total input exceeds 200K tokens, the entire request (including output) is billed at the long-context rate. 199K input → $2/$12, 201K → $4/$18 (entire request, not just the excess). Plus **Gemini 3.7 Flash's $0.75/$3.75 expires 2026/12/31**, then reverts to $1.50/$7.50.

### Performance Position

| Metric | Gemini 3.1 Pro | Comparison |
|---|---|---|
| GPQA Diamond | **94.1%** | GPT-5.6 Sol 94.6%; Claude Fable 5 92.6%; Opus 4.8 92% |
| ARC-AGI-2 | **77.1%** (Deep Think) | Claude Opus 4.8 68.8%; Sonnet 4.6 60.4%; GPT-5.2 52.9% |
| SWE-bench Verified | 80.6% | Claude Opus 5 96%; DeepSeek V4 Pro 96.4%; Fable 5 95%—Gemini lags ~15pp |
| MMMU-Pro | **80.5~82%** | Qwen3-VL-235B 69.3%; GPT-5.4 81% |
| DocVQA | 92% | Qwen3-VL-235B 96.5%; GPT-5.4 95%—Qwen open actually stronger on docs |

Direct comparison:

| Metric | Gemini 3.1 Pro | Claude Fable 5 | GPT-5.6 Sol | DeepSeek V4 Pro |
|---|---|---|---|---|
| GPQA Diamond | **94.1%** | 92.6% | 94.6% | — |
| ARC-AGI-2 | **77.1%** | — | — | — |
| SWE-bench Verified | 80.6% | 95% | ~95% | **96.4%** |
| MMMU-Pro | **82%** | — | — | — |
| Context | 1M | 1M | 1.05M | 1M |
| Max output | 64K | 128K | 128K | 128K |
| Native video/speech | **✓** | ✗ | ✗ | ✗ |
| Output pricing ($/MTok) | $12 | $50 | $30 | **$0.87** |

Gemini's unique combo is **science reasoning + native multimodality + low pricing**, but 64K output cap and SWE-bench lag are real limits.

## Sub-lines & Ecosystem: A Table of All Gemini Products

| Sub-line | Representative | Positioning |
|---|---|---|
| Flagship reasoning | Gemini 3.1 Pro / Flash | Highest intelligence / high efficiency |
| Lightweight | Gemini 3.1 Flash-Lite | High speed, low price, large-scale classification |
| Open weights | Gemma 3 (2B–27B) | Apache 2.0, self-hostable |
| Image | Imagen 4 | Text-to-image |
| Speech / audio | Chirp / Lyria | Transcription / music generation |
| Video | Veo 3 | Text-to-video |
| Embeddings | Gecko / text-embedding | RAG backbone |
| Dev tools | AI Studio / Vertex AI Agent Builder | Agent infra |
| Consumer product | Gemini App / NotebookLM | World's second-largest AI app |

Two observations:

**Multimodal breadth is Gemini's most underestimated asset.** Text, image, video, speech, code—Gemini's native multimodal coverage is the most complete of any competitor, fused from pre-training (not bolted adapters). For agent scenarios needing "understand video + hear speech + read charts," Gemini currently stands alone.

**Infra advantage is a hidden moat.** Google owns the world's largest TPU cluster, giving Gemini better inference cost and availability than most competitors. But Gemini's fate is deeply bound to Google Cloud—risk for enterprises unwilling to depend on a single cloud.

## Position Against Competitors

Placing Gemini in the 2026 landscape:

- **vs Claude**: Gemini leads on science reasoning (GPQA 94.1%) and native multimodality; Claude is steadier on coding (SWE-bench 95%) and agentic reliability
- **vs GPT-5.6**: GPT stronger on agentic tasks (BrowseComp, Terminal-Bench); Gemini leads on science and multimodality; general capability split
- **vs DeepSeek V4**: DeepSeek matches on SWE-bench Verified at 1/40 price, MIT self-hostable. Gemini's edge is 1M context and multimodal breadth
- **vs Open source (Llama 4 / Qwen / Kimi / Mistral)**: Gemini quality leads, but price is 10–50× open, and the strongest model isn't open

## What This Means for Agent Developers

- **Science research & reasoning** → Gemini 3.1 Pro: GPQA 94.1%, ARC-AGI-2 77.1%—strongest for deep science reasoning
- **Video & speech understanding** → Gemini 3.1 Pro: native video/speech input, no transcription step. Unique for video analysis, voice assistants
- **Long-document handling** → Gemini 3.1 Pro: 1M context shines on bulk documents, especially with context caching to cut costs
- **Google ecosystem integration** → If already on Workspace / GCP, Gemini integration is natural
- **High value** → Gemini 3.1 Pro at $2/$12 is 1/6 of Claude, 1/2.5 of GPT, yet parity on science
- **High-throughput classification/summary** → Gemini 3.7 Flash: $0.75/$3.75 (promo), 1M context
- **Long-horizon coding agents** → SWE-bench Verified 80.6% trails Claude ~15pp; 64K output cap constrains complex tasks. For this scenario, prefer Claude Opus 5 or DeepSeek V4 Pro
- **Local deployment** → Flagship locked to Google infra; for self-host use Gemma (non-frontier) or Qwen / DeepSeek

## Overall

Gemini's story is "trading infrastructure advantage for pricing and multimodal leadership." Google's TPU hardware and global datacenter network let Gemini deliver 1M context and native multimodality at $2/$12—something Claude and GPT cannot match.

But Gemini has hard limits: 64K output cap, SWE-bench lag, agent stability behind Claude. Its best fit is the **science reasoning + multimodal understanding + high value** combo—if your scenario needs deep scientific reasoning or video/speech understanding, Gemini is the most cost-effective choice.

---

## References

- [Google DeepMind Gemini](https://deepmind.google/models/gemini/pro/)
- [Gemini 3.1 Pro Model Card](https://deepmind.google/models/model-cards/gemini-3-1-pro/)
- [Gemini 3.7 Flash: our most intelligent workhorse model](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/)
- [Gemini 3.1 Pro: Announcing our latest Gemini AI model](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-pro/)
- [Gemini Developer API Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini API Models](https://ai.google.dev/gemini-api/docs/models)
- [Gemini 3.1 Pro — BenchLM](https://benchlm.ai/models/gemini-3-1-pro)
- [Gemini 3.1 Pro — Artificial Analysis](https://renas.ai/models/gemini-3-1-pro)
- [Gemini 3.1 Pro reviewed — benchor](https://benchr.org/articles/gemini-3-1-pro-review)
- [ARC-AGI-2 Benchmark](https://arcprize.org)
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources) — this site
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) — this site