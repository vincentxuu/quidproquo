---
title: "GPT——Closed API for Revenue, Open GPT-OSS for Ecosystem: the Unified Routing Platform Behind the World's Largest AI Service"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, gpt, openai, model-family-gpt, reasoning, agentic-coding, model-selection]
lang: en
type: deep-dive
tldr: "GPT is OpenAI's LLM family, from 117M parameters in 2018 to the three-tier GPT-5.6 Sol/Terra/Luna lineup in 2026, serving 1B+ users and 2M enterprise customers. GPT-5.6 Sol leads LiveBench 81.1%, Terminal-Bench 2.1 88.8%, and Artificial Analysis Coding Agent Index 80 across multiple agentic benchmarks, while OpenAI's first open-weight model GPT-OSS ships under Apache 2.0."
description: "Complete GPT model family guide: evolution from GPT-1 (2018) to GPT-5.6 (2026), closed API vs open GPT-OSS strategy, unified routing architecture, Sol/Terra/Luna pricing comparison, benchmarks, and selection guide for agent developers"
series:
  name: "AI Model Families"
  order: 3
draft: false
glossary:
  - term: "RLHF"
    definition: "Reinforcement Learning from Human Feedback—the alignment technique behind GPT-3.5 and ChatGPT"
  - term: "Reasoning effort"
    definition: "GPT-5.6's reasoning-depth control parameter—from none to max—letting users trade speed for quality"
  - term: "Programmatic Tool Calling"
    definition: "GPT-5.6 feature—model can write and execute code in memory, coordinating multiple tools over intermediate results"
  - term: "GPT-OSS"
    definition: "OpenAI's first open-weight family (2025/08), 120B and 20B sizes, Apache 2.0 licensed"
---

> 🌏 [中文版](/posts/tech/2026-08-24-ai-model-family-gpt)

On November 30, 2022, ChatGPT went live—1 million users in five days, 100 million in two months, the fastest-growing consumer product in history. Four years later, in July 2026, the GPT-5.6 Sol/Terra/Luna three-tier lineup launched, covering every price band from $0.20 to $30, with OpenAI at 1B+ users and 2M+ enterprise customers. This is the third family deep-dive in the "AI 模型家族" series, tracing GPT's full evolution from GPT-1 to GPT-5.6.

For how to read the benchmark numbers cited here, see our [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources). This is part of the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) series.

## Family Evolution Timeline

| Version | Date | Key Facts |
|---|---|---|
| GPT-1 | 2018-06 | 117M params, first generative pre-trained model |
| GPT-2 | 2019-02 | 1.5B params, delayed release as "too dangerous" (later fully open-sourced) |
| GPT-3 | 2020-05 | 175B params, few-shot learning, semi-open API (application required) |
| GPT-3.5 | 2022-03 | ~175B, RLHF fine-tuned, ChatGPT's base |
| ChatGPT | 2022-11 | ~175B, consumer AI revolution, 100M users in 2 months |
| GPT-4 | 2023-03 | ~1T (MoE), multimodal, 90th percentile on bar exam |
| GPT-4 Turbo | 2023-11 | ~1T, 128K context, faster and cheaper |
| GPT-4o | 2024-05 | Native multimodal (text + vision + speech) |
| o1 | 2024-09 | First reasoning model, "think before speaking" |
| o3 / o4-mini | 2025-04 | Reasoning model upgrades |
| GPT-4.1 | 2025-04 | API-only, 1M context |
| GPT-5 | 2025-08 | Unified routing: fast model + reasoning model + real-time router |
| GPT-5.5 | 2026-04 | Efficiency & agent capability boost, 1M context |
| GPT-OSS | 2025-08 | OpenAI's first open weights: 120B / 20B, Apache 2.0 |
| GPT-5.6 Sol/Terra/Luna | 2026-07 | Three-tier product line, 1.05M context |

Eight years, multiple milestones. GPT's through-line is clear: **from research paper to consumer product to platform ecosystem**. GPT-3 proved scaling laws, ChatGPT created consumer demand, GPT-4 set the quality bar, and everything after GPT-5 focused on agent capability and efficiency. 2025 added a side branch—weights released for the first time (GPT-OSS).

## Two Product Lines: Closed API for Revenue, Open GPT-OSS for Ecosystem

To understand GPT's 2026 layout, split it into two lines—the opposite direction from Qwen (open-first, recently closing): GPT started closed and only recently added open:

**Closed API Line** (OpenAI official API / ChatGPT / Azure OpenAI Service): All flagships after GPT-5 are API-only, no downloadable weights. In 2026 this line split from a single GPT-5 into three SKUs—Sol (flagship) / Terra (balanced) / Luna (efficient)—covering every price band. This line owns revenue—1B+ users and 2M+ enterprise customers all run here.

**Open-Weight Line** (GPT-OSS): Only released in August 2025, 120B and 20B, Apache 2.0. This line owns ecosystem—giving developers who need self-host, fine-tuning, and data sovereignty a path, but explicitly not the frontier model.

The turning point: OpenAI's 2019 capped-profit conversion, IPO rumors in 2026, ever-increasing commercial pressure. GPT-OSS looks more like a strategic response (to Llama, Qwen, DeepSeek open offensives) than a return to roots—the closed-flagship main line has never loosened.

## Architecture: Why One System Can Handle Many Tasks

### Unified Routing Architecture: One System, Not One Model

GPT-5 (August 2025) marked OpenAI's shift from "single model" to "unified system":

**GPT-5 = fast model + reasoning model + real-time router**

The router decides which model to use based on conversation type, complexity, tool needs, and explicit user intent (e.g., "think carefully"). Conceptually similar to Anthropic's adaptive thinking, but GPT-5's implementation is more explicit—two independent models behind the scenes, while Claude adjusts reasoning depth inside one model.

Developers no longer pick a model; the system decides. The cost: routing is opaque, sometimes the wrong layer is chosen, and cost controllability suffers.

### GPT-5.6 Inference Efficiency: The Model Discounts Itself

Two price cuts after GPT-5.6 launched in July 2026, driven by efficiency gains: GPT-5.6 Sol optimized its own inference kernels (end-to-end serving cost -20%); speculative decoding efficiency +15%. The model discounts itself.

- **2026/07/30**: Luna -80% ($1/$6 → $0.20/$1.20), Terra -20%
- **2026/08/21**: Sol -20%+ (promo through 11/21)

This is OpenAI's 2026 core play: trade efficiency for price bands, pushing frontier quality down into more tiers.

### Native Multimodality and GPT-OSS Architecture

GPT-4o (2024-05) established native multimodal—text, vision, speech handled inside one model, not via adapter plugins. That capability carries into the GPT-5 main line.

GPT-OSS is the first time OpenAI handed over weights. 120B and 20B both support function calling and structured outputs, deployable on self-owned infra, under clean Apache 2.0. Quality lags the closed flagship significantly, but it proves OpenAI now seriously farms the open ecosystem niche.

## GPT-5.6: Sol, Terra, Luna—How to Choose

July 2026's three-tier naming serves distinct roles:

| Item | GPT-5.6 Sol | GPT-5.6 Terra | GPT-5.6 Luna |
|---|---|---|---|
| Positioning | Flagship reasoning, complex tasks | Daily balanced, cost-effective | High throughput, low cost |
| Input ($/MTok) | $5 | $2 | $0.20 |
| Output ($/MTok) | $30 | $12 | $1.20 |
| Long context input | $10 | $4 | $0.40 |
| Long context output | $45 | $18 | $1.80 |
| Cache hit | $0.50 | $0.20 | $0.02 |
| Batch API | $2.50 / $15 | $1 / $6 | $0.10 / $0.60 |
| Fast mode | $10 / $60 | $4 / $24 | $0.40 / $2.40 |
| Context | 1.05M | 1.05M | 1.05M |
| Max output | 128K | 128K | 128K |
| Reasoning effort | none → max | none → max | none → max |
| License | Closed API | Closed API | Closed API |

### License Trap: Flagship Is Closed, Open Is Not Frontier

OpenAI's licensing is the most stratified in the series—a hard line between open and closed:

- **Closed flagship (all GPT-5.6)**: API only, no weights, license = OpenAI Terms of Service. Strongest models are not self-hostable
- **Open weights (GPT-OSS 120B / 20B)**: Apache 2.0, downloadable, fine-tunable, self-hostable—but only mid-large (120B) and small-mid (20B), not frontier
- **Historical**: GPT-2 fully open, GPT-3 semi-open (application), GPT-4 onward fully closed

The catch: **"OpenAI open-source" ≠ "strongest model open-sourced."** GPT-OSS is genuine Apache 2.0—cleaner than Llama 4's Community License—but 120B's active params and quality lag GPT-5.6 Sol significantly. If you need "Apache 2.0 + frontier quality," GPT-OSS can't deliver; look at DeepSeek (MIT) or Qwen (mostly Apache).

Another trap is **API price volatility**: OpenAI adjusted GPT pricing multiple times across 2025–2026 (mostly cuts, but long-context surcharges too); prices during a contract term aren't guaranteed long-term. Easily missed: **beyond 272K input tokens, input doubles and output +50%**. Long-document workloads (codebases, contracts, meeting transcripts) cost ~2× the short-context sticker price.

### Performance Position

| Metric | GPT-5.6 Sol | Comparison |
|---|---|---|
| [Artificial Analysis Coding Agent Index](https://artificialanalysis.ai) | **80** | Terra 77.4; Claude Fable 5 77.2; GPT-5.5 76.4; Claude Opus 4.8 72.5. Sol uses < half the output tokens of Fable 5, half the time, ~1/3 the cost |
| [LiveBench](https://livebench.ai) Overall | **81.1%** | Claude Fable 5 83.0%; GPT-5.5 80.2%; Claude Opus 5 80.1%; Terra 77.9% |
| Terminal-Bench 2.1 | **88.8%** | Sol Ultra 91.9%; Claude Mythos 5 88%; GPT-5.5 85.6%; Fable 5 83.1% |
| BrowseComp | **90.4%** | Sol Ultra 92.2%; Claude Mythos 5 88%; Terra 87.5%; Fable 5 84.3% |
| Agents' Last Exam | **53.6** | Claude Fable 5 40.5; Fable 5 (medium) 42.2—Sol at medium reasoning already beats Fable 5 at ~1/4 cost |

Direct comparison:

| Metric | GPT-5.6 Sol | Claude Fable 5 | DeepSeek V4 Pro |
|---|---|---|---|
| LiveBench overall | 81.1% | **83.0%** | 77.4% |
| Coding Agent Index | **80** | 77.2 | — |
| BrowseComp | **90.4%** | 84.3% | — |
| Terminal-Bench 2.1 | **88.8%** | 83.1% | 82.7% |
| SWE-bench Verified | ~95% | 95% | **96.4%** |
| Output pricing ($/MTok) | $30 | $50 | **$0.87** |
| Context | 1.05M | 1M | 1M |

GPT-5.6 Sol clearly leads on agentic tasks (BrowseComp, Terminal-Bench, Agents' Last Exam), but DeepSeek V4 Pro matches or slightly beats SWE-bench Verified at ~1/34 the price. LiveBench's general ranking is slightly won by Claude Fable 5.

## Sub-lines & Ecosystem: A Table of All GPT Products

In the closed-source camp GPT ranks second in family breadth (only behind Qwen):

| Sub-line | Representative | Positioning |
|---|---|---|
| Flagship reasoning | GPT-5.6 / Sol / Pro | Unified routing, highest intelligence |
| Lightweight | GPT-5.6 mini / nano | High speed, low price, embedded |
| Open weights | GPT-OSS 120B / 20B | Apache 2.0, self-hostable |
| Reasoning specialist | o-series (o4 / o5) | Deep thinking, test-time compute |
| Image | DALL·E 3 / 4 | Text-to-image |
| Speech | Whisper (open) / GPT-4o-realtime | Transcription / voice chat |
| Embeddings | text-embedding-3 | RAG backbone |
| Dev tools | Codex / Assistants API / Function Calling | Agent infrastructure |
| Consumer product | ChatGPT | World's largest AI application |

Two observations:

**Unified routing is GPT-5's core bet.** Unlike Claude's four explicit tiers (Fable/Opus/Sonnet/Haiku) for developers to pick, GPT-5 uses one router to auto-allocate compute per task difficulty. Pro: no manual model selection. Con: cost controllability drops—you don't know which layer served each request.

**Breadth second only to Qwen.** Codex (coding agent), Whisper (open speech), DALL·E (image), embedding line—each standalone. Highest ecosystem completeness in the closed camp. Final reminder: model suffixes (Sol/Terra/Luna/mini/nano) are service tiers, not guarantees of downloadable weights—check the license field for self-host, not the suffix.

## Position Against Competitors

Placing GPT in the 2026 landscape:

- **vs Claude**: GPT-5.6 leads on agentic tasks (BrowseComp, Terminal-Bench, Agents' Last Exam); Claude is more stable on coding reliability and the overall LiveBench (83.0%). The two closed titans
- **vs DeepSeek V4**: DeepSeek matches or slightly beats SWE-bench Verified at ~1/34 price, MIT self-hostable. GPT's edge is ecosystem maturity (Codex, Assistants API) and global availability
- **vs Gemini 3.1**: Gemini leads on scientific reasoning and native multimodality; GPT is stronger on agentic tasks; general capability is split
- **vs Open source (Llama 4 / Qwen / Kimi / Mistral)**: GPT quality leads, but price is 20–50× open source. GPT-OSS offers an open path but not frontier quality

## What This Means for Agent Developers

- **Strongest agentic performance** → GPT-5.6 Sol (max): Coding Agent Index 80, BrowseComp 90.4%, Agents' Last Exam 53.6, multi-category leader
- **Daily coding balanced for quality & cost** → GPT-5.6 Terra, $12 output, Coding Agent Index 77.4, sufficient for most tasks
- **High-throughput classification / summarization** → GPT-5.6 Luna, $1.20 output, 1.05M context, for bulk lightweight requests
- **Chasing lowest SWE-bench score** → DeepSeek V4 Pro, $0.87 output, SWE-bench Verified 96.4%, ~1/34 Sol's cost
- **Self-host + Apache 2.0** → GPT-OSS 120B/20B self-hostable, but not frontier; frontier self-host look at Qwen or DeepSeek
- **Citing benchmarks** → GPT's naming matrix (gen × Sol/Terra/Luna × mini/nano × closed/open) is the most error-prone in the series. Always write the full model name plus date, otherwise you're comparing different events

## Overall

GPT's story is "from research paper to global infrastructure." OpenAI proved scaling laws with GPT-3, created consumer demand with ChatGPT, set the quality bar with GPT-4, and redefined model usage with GPT-5's unified routing. By GPT-5.6, the three-tier lineup (Sol/Terra/Luna) covers every band from $0.20 to $30, with 1.05M context and 128K output spanning most scenarios.

For agent developers, GPT-5.6's lead on agentic tasks (BrowseComp, Terminal-Bench, Agents' Last Exam) is real. But pricing is the highest tier—Sol's $30/MTok output is 1.2× Claude's and ~34× DeepSeek's. The pragmatic move: Sol for the hardest agent tasks, Terra for daily coding, Luna for high-throughput work.

The licensing stratification is worth watching: flagship fully closed, GPT-OSS genuinely Apache 2.0 but not frontier. On GPT, "open-source" is currently real at only one tier, and that tier is not the strongest model.

---

## References

- [GPT-5.6: Frontier intelligence that scales with your ambition — OpenAI](https://openai.com/index/gpt-5-6/)
- [Advancing the price-performance frontier with GPT-5.6 — OpenAI](https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/)
- [Introducing GPT-5 — OpenAI](https://openai.com/index/introducing-gpt-5/)
- [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing)
- [OpenAI — Wikipedia](https://en.wikipedia.org/wiki/OpenAI)
- [GPT-5 History Timeline & OpenAI Evolution](https://aitimeline.in/gpt-5-history-timeline-openai-evolution-1334/)
- [The Complete History of OpenAI](https://www.datastudios.org/post/the-complete-history-of-openai-founding-structure-gpt-models-chatgpt-and-the-road-to-2026)
- [OpenAI Pricing in 2026 — What You Actually Pay Per Token — StackWrite](https://stackwrite.com/blog/openai-api-pricing-2026/)
- [LiveBench Leaderboard](https://livebench.ai)
- [Artificial Analysis Coding Agent Index](https://artificialanalysis.ai)
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources) — this site
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) — this site