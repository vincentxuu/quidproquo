---
title: "Gemini——Google's Native Multimodal Flagship: 1M Context and Scientific Reasoning Champion"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, gemini, google-deepmind, model-family-gemini, multimodal, reasoning, model-selection]
lang: en
type: deep-dive
tldr: "Gemini is Google DeepMind's native multimodal LLM family, famed for a 1M-token context window and native video/speech input plus scientific reasoning. 3.1 Pro tops GPQA Diamond 94.1% and ARC-AGI-2 77.1% to claim science-reasoning dual crowns, at $2/$12—1/6 of Claude. 3.8 Flash delivers agentic coding results close to frontier models at $0.75/$3.75 (Terminal-Bench 2.1 89.4%; DeepSWE v1.1 73.7%), with the same introductory pricing across 3.6, 3.7, and 3.8."
description: "Complete Gemini model family guide: evolution from Gemini 1.0 (2023) to 3.1 Pro / 3.8 Flash (2026), native multimodal architecture, 1M context, pricing comparison, benchmarks, and selection guide for agent developers"
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
  - term: "Effort levels"
    definition: "3.8 Flash reasoning settings: higher effort adds reasoning and tool calls, while lower effort reduces token overhead"
---

> 🌏 [中文版](/posts/tech/2026-08-24-ai-model-family-gemini)

In December 2023, Google DeepMind released Gemini 1.0—the first "native multimodal" model that integrated text, image, video, and speech from pre-training. Two and a half years later, in February 2026, Gemini 3.1 Pro topped GPQA Diamond at 94.1% to become the strongest science-reasoning model, and hit 77.1% on ARC-AGI-2 as the highest Fluid Intelligence score. At $2/$12, roughly one-sixth of Claude Opus. This is the fourth family deep-dive in the "AI Model Families" series, tracing Gemini's evolution from 1.0 to 3.8 Flash.

For how to read the benchmark numbers cited here, see our [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources). This is part of the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) series.

## Family positioning and model matrix

| Model / line | Positioning | Key difference | Access |
|---|---|---|---|
| Gemini 3.1 Pro | Complex reasoning and multimodality | Pro tier | Hosted API |
| Gemini Flash | High-throughput multimodality | Flash line; versions detailed below | Hosted API |
| Gemma | Self-hosting option | Separate from Gemini | Open weights; terms below |



### Two Product Lines: Closed Gemini for Revenue, Open Gemma for Ecosystem
To understand Gemini's 2026 layout, split it into two lines—much like GPT's dual track:

**Closed API Line** (AI Studio / Vertex AI): The entire Gemini 3 family runs only on Google infrastructure, no downloadable weights. Since the 1.5 era, 1M context has been standard; pricing starts at $2/$12. This line owns revenue—Google's enterprise and consumer traffic all runs here, backed by TPU hardware and a global datacenter footprint.

**Open-Weight Line** (Gemma 2 / 3, 2B–27B): Apache 2.0, downloadable, fine-tunable, self-hostable. This line owns ecosystem—giving developers needing self-host, fine-tuning, and data sovereignty a path, but explicitly not the frontier model.

Google wrote the Transformer paper in 2017, acquired DeepMind in 2014, and in December 2023 merged Brain and DeepMind into **Google DeepMind** with Gemini as the unified brand—consolidating research to counter OpenAI and Microsoft. Gemma's open source is strategic gap-filling, not a reversal—the closed-flagship main line has never loosened.


### Sub-lines & Ecosystem: A Table of All Gemini Products
| Sub-line | Representative | Positioning |
|---|---|---|
| Flagship reasoning | Gemini 3.1 Pro / 3.8 Flash | Highest intelligence / high efficiency with configurable effort levels |
| Cybersecurity variant | Gemini 3.8 Flash Cyber | Vulnerability discovery and patching; trusted defenders in the Fairwind Program only |
| Video-generation sub-line | Gemini Omni 1.1 Flash | Video generation / editing; separate from the main LLM line |
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

## Family evolution

### Family Evolution Timeline
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
| Gemini 3.8 Flash / 3.8 Flash Cyber | 2026-09 | 1M | Strongest Flash, effort levels, Terminal-Bench 2.1 89.4% |

Two and a half years, 13 milestones. Gemini's through-line: **from multimodality to agents, from flagship to full-size coverage**. 1M context was Gemini's earliest moat, and every subsequent generation pushed harder on multimodal understanding and agent capability. Flash 3.6, 3.7, and 3.8 retain $0.75/$3.75 introductory pricing through December 31, 2026. Higher effort can shift upgrade costs into token usage rather than the unit price.

## Architecture and training trade-offs

### Architecture: Two Walls—Native Multimodality and 1M Context
#### Native Multimodality

Gemini has been native multimodal since v1—text, image, video, speech trained together from pre-training, not a vision adapter bolted onto a text model after the fact.

This means Gemini truly "understands" video and speech, not just transcribing them to text first. 3.1 Pro supports:

- **Text**: standard LLM capability
- **Image**: understanding, analysis, reasoning
- **Video**: directly processes video clips (not screenshots)
- **Speech**: native speech understanding and generation
- **PDF**: direct document parsing

#### 1M Context Window

February 2024, Gemini 1.5 Pro became the industry's first 1M-token model. Not a gimmick—1M tokens ≈ 10 full novels, 30K lines of code, or five hours of speech transcription.

By 3.1 Pro, 1M context is mature and stable. Note: **beyond 200K tokens, pricing doubles** ($4/$18). If your workload routinely exceeds 200K, effective cost is far above $2/$12.

#### Deep Think

Gemini's deep reasoning mode, analog to Claude's extended thinking or GPT's reasoning effort. 3.1 Pro's Deep Think jumped ARC-AGI-2 from 31.1% (3 Pro) to 77.1%—one of 2026's largest single capability leaps.

## Evaluation and alternatives

### Performance Position
| Metric | Gemini 3.1 Pro | Comparison |
|---|---|---|
| GPQA Diamond | **94.1%** | GPT-5.6 Sol 94.6%; Claude Fable 5 92.6%; Opus 4.8 92% |
| ARC-AGI-2 | **77.1%** (Deep Think) | Claude Opus 4.8 68.8%; Sonnet 4.6 60.4%; GPT-5.2 52.9% |
| SWE-bench Verified | 80.6% | Claude Opus 5 96%; DeepSeek V4 Pro 96.4%; Fable 5 95%—Gemini lags ~15pp |
| MMMU-Pro | **80.5~82%** | Qwen3-VL-235B 69.3%; GPT-5.4 81% |
| DocVQA | 92% | Qwen3-VL-235B 96.5%; GPT-5.4 95%—Qwen open actually stronger on docs |

### Gemini 3.8 Flash: agentic coding close to frontier results
The September 2, 2026 release concentrates gains in iterative tool use and long-running agent tasks. General expert reasoning changed less: HLE-Verified rose from 53.6% to 54.9%.

| Metric | Gemini 3.8 Flash | 3.7 Flash | Comparison |
|---|---|---|---|
| DeepSWE v1.1 (long-horizon software engineering) | 73.7% | 65.3% | Claude Opus 5 74.0%; GPT-5.6 Sol 72.7%—close results |
| Terminal-Bench 2.1 (agentic terminal coding) | 89.4% | 85.8% | Opus 5 89.1%; GPT-5.6 Terra 87.4%—slightly higher |
| Terminal-Bench 4.0 (general agent capabilities) | 19.1% | 11.2% | Opus 5 51.8%—a substantial remaining gap |
| HLE-Verified (multidisciplinary expert reasoning) | 54.9% | 53.6% | GPT-5.6 Terra 51.1% |

These figures come from the [Gemini 3.8 Flash Model Card](https://deepmind.google/models/model-cards/gemini-3-8-flash/), Google's official evaluation rather than an independent reproduction. The earlier check recorded different Terminal-Bench 2.1 readings from the launch blog's chart (90.8% / 81.6%) versus the model card (89.4% / 85.8%); this article uses the model card. The site's 3.7 Flash model card also records 85.8%. This limited parity update rechecked the model-card table, not those image-chart readings.

Effort levels let the same model vary reasoning depth and iterative tool calls against token overhead. For efficiency-first workloads, lower effort or the still-supported 3.7 Flash remain options.

The accompanying 3.8 Flash Cyber variant reports CWE-Bench patching pass@1 of 47.2% and over 70% vulnerability-discovery success across 20 languages. Access is through the Fairwind Program for trusted defenders, rather than a self-service API.

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

Gemini's unique combo is **science reasoning + native multimodality + low pricing**. The 64K output cap and Pro's SWE-bench Verified result remain limits, while Flash's DeepSWE v1.1 and Terminal-Bench 2.1 results add long-running agent tasks to its selection case; Terminal-Bench 4.0 still shows a large gap.


### Position Against Competitors
Placing Gemini in the 2026 landscape:

- **vs Claude**: Gemini leads on science reasoning (GPQA 94.1%) and native multimodality; Claude is steadier on coding (SWE-bench 95%) and agentic reliability
- **vs GPT-5.6**: GPT remains strong on some agent tasks such as BrowseComp, but the official Terminal-Bench 2.1 table reports 3.8 Flash at 89.4% against Terra at 87.4%. On Terminal-Bench 4.0, Opus 5 at 51.8% remains far ahead of 3.8 Flash at 19.1%; one benchmark does not establish general agent superiority. Gemini retains science and multimodal strengths.
- **vs DeepSeek V4**: DeepSeek matches on SWE-bench Verified at 1/40 price, MIT self-hostable. Gemini's edge is 1M context and multimodal breadth
- **vs Open source (Llama 4 / Qwen / Kimi / Mistral)**: Gemini quality leads, but price is 10–50× open, and the strongest model isn't open

## Licensing, pricing, and deployment

### License Trap: Strongest Models Locked to Google Infra
Google mirrors OpenAI—closed flagship + small open model dual track:

- **Closed flagship (all Gemini 3.1)**: API only (AI Studio / Vertex AI), no weights, license = Google Terms of Service
- **Open weights (Gemma 2 / 3, 2B–27B)**: Apache 2.0, downloadable, fine-tunable, self-hostable—but only small-mid, not frontier
- **Enterprise**: Gemini on Vertex AI governed by Google Cloud contracts; data-processing location selectable per region

The catch: **Gemini's strongest models are almost entirely bound to Google infrastructure**. Want 1M context or native video understanding? Must go through Google API or Vertex. Gemma is Apache 2.0 but at 27B is far behind Gemini 3.1 Pro. If you need "Apache 2.0 + frontier quality," Gemini can't deliver—look at DeepSeek (MIT) or Qwen (mostly Apache).

Another trap: **Google ecosystem lock-in**—Gemini's depth advantages (search, YouTube, Maps, Workspace) only shine inside Google's world. Outside, it reverts to an ordinary frontier model. And a pricing trap: **the 200K threshold**—once total input exceeds 200K tokens, the entire request (including output) is billed at the long-context rate. 199K input → $2/$12, 201K → $4/$18 (entire request, not just the excess). Plus **Flash 3.6 / 3.7 / 3.8 share $0.75/$3.75 introductory pricing through December 31, 2026**, reverting to $1.50/$7.50 on January 1, 2027; context caching changes from $0.075 to $0.15. Earlier 3.5 Flash was $1.50/$9.00. Higher effort in 3.8 can consume more tokens, so the same unit price does not guarantee a smaller bill.


### Gemini 3.1 Pro and 3.8 Flash—How to Choose
February's flagship vs September's workhorse:

| Item | Gemini 3.1 Pro | Gemini 3.8 Flash | Gemini 3.1 Flash-Lite |
|---|---|---|---|
| Positioning | Flagship reasoning, science/research | Agent workhorse, long-horizon coding | High throughput, lowest cost |
| Input ($/MTok) | $2 (≤200K) / $4 (>200K) | $0.75 (through 2026/12/31, then $1.50) | $0.25 |
| Output ($/MTok) | $12 (≤200K) / $18 (>200K) | $3.75 (through 2026/12/31, then $7.50) | $1.50 |
| Context caching | $0.20 / $0.40 | $0.075 (through 2026/12/31, then $0.15) | $0.025 |
| Context | 1M | 1M | 1M |
| Max output | 64K | 64K | 64K |
| Deep Think | ✓ | ✓ | ✓ |
| Effort levels | — | ✓ (reasoning depth and token overhead) | — |
| Native multimodality | ✓ (text / img / video / speech / PDF) | ✓ | ✓ (text / img / video, speech extra) |

Pricing and specs from [Gemini Developer API Pricing](https://ai.google.dev/gemini-api/docs/pricing) and [Gemini API Models](https://ai.google.dev/gemini-api/docs/models).

## Agent integration and selection

### What This Means for Agent Developers
- **Science research & reasoning** → Gemini 3.1 Pro: GPQA 94.1%, ARC-AGI-2 77.1%—strongest for deep science reasoning
- **Video & speech understanding** → Gemini 3.1 Pro: native video/speech input, no transcription step. Unique for video analysis, voice assistants
- **Long-document handling** → Gemini 3.1 Pro: 1M context shines on bulk documents, especially with context caching to cut costs
- **Google ecosystem integration** → If already on Workspace / GCP, Gemini integration is natural
- **High value** → Gemini 3.1 Pro at $2/$12 is 1/6 of Claude, 1/2.5 of GPT, yet parity on science
- **High-throughput classification/summary** → Gemini 3.8 Flash at lower effort or 3.7 Flash: $0.75/$3.75 through December 31, 2026, with 1M context
- **Long-horizon coding agents** → Evaluate Gemini 3.8 Flash at higher effort: DeepSWE v1.1 73.7% and Terminal-Bench 2.1 89.4% put it close to frontier results at Flash pricing. HLE-Verified changed little; efficiency-first tasks may retain 3.7 Flash.
- **Complex-task output limits** → The 64K cap requires splitting very long generations. Pro's SWE-bench Verified 80.6% still trails the cited comparison by about 15pp, but Flash should be assessed using its own DeepSWE / Terminal-Bench results.
- **Local deployment** → Flagship locked to Google infra; for self-host use Gemma (non-frontier) or Qwen / DeepSeek

## Limitations and trade-offs

Gemini and Gemma do not share licensing or deployment assumptions. Long-context and multimodal claims require the exact version, input conditions, and pricing rather than the family name.

### Overall
Gemini's story is "trading infrastructure advantage for pricing and multimodal leadership." Google's TPU hardware and global datacenter network let Gemini deliver 1M context and native multimodality at $2/$12—something Claude and GPT cannot match.

Gemini retains limits: 64K output, Pro's SWE-bench Verified gap, and Flash's substantial gap on Terminal-Bench 4.0. Its selection case now includes long-horizon agentic coding alongside **science reasoning + multimodal understanding + high value**. Flash 3.6, 3.7, and 3.8 share introductory unit pricing, while effort levels let developers trade extra tokens for task performance.


## Update history

- **2026-10-11**: Corrected English drift against the existing Chinese 3.8 Flash coverage. Rechecked only the official 3.8 model-card table, launch text, and relevant pricing passages through Groundlane; this was not a full article fact-check. Older checks and chart-reading caveats remain separate.

- **2026-10-11**: Reorganized the article into the shared family format and added a matrix derived from existing content. Existing versions, prices, and source dates were retained; no new fact-check was performed.


- 2026-09-19: Added Gemini 3.8 Flash (2026-09-02) — timeline, selection table, agentic coding performance section, sub-family table (3.8 Flash Cyber, Omni 1.1 Flash), three-generation same-price and effort levels; benchmark numbers verified against Model Card evaluation table, with blog chart reading differences noted in-text.

## References

- [Introducing Gemini 3.8 Flash and 3.8 Flash Cyber](https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/)
- [Gemini 3.8 Flash Model Card](https://deepmind.google/models/model-cards/gemini-3-8-flash/)
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
- [Model card: Gemini 3.8 Flash](/posts/daily/2026-09-04-model-google-gemini-3-8-flash) — this site

---
