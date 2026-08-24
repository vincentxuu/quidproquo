---
title: "Qwen: Open Weights at Every Size from 0.8B to 2.4T — How HuggingFace's Download Champion Runs a Two-Track Play"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, qwen, open-source, model-family-qwen, moe, model-selection]
lang: en
type: deep-dive
tldr: "Qwen is the most-downloaded model family on HuggingFace, spanning sizes from 0.8B to 2.4T. In August 2026, Alibaba open-sourced a Max-tier flagship for the first time (Qwen3.8-2.4T-A95B) — but swapped the customary Apache 2.0 license for custom terms. Meanwhile the other new release, Qwen3.8-27B, runs native vision on laptop-class hardware and is the only one shipping under Apache 2.0. This post traces the family from 2023 through generation 3.8, explains how the open line and the commercial line split apart, and helps you pick the right model at each tier."
description: "A complete guide to the Qwen (Tongyi Qianwen) model family: evolution timeline 2023→2026, the dual-track strategy of open vs. commercial lines, Gated DeltaNet and fine-grained MoE architecture, a Qwen3.8 Max/27B selection guide, and DashScope pricing and licensing tiers."
series:
  name: "AI Model Family"
  order: 2
draft: false
glossary:
  - term: "Gated DeltaNet"
    definition: "A variant from the linear attention family that replaces the full attention matrix with a fixed-size recurrent state, so compute grows linearly rather than quadratically with sequence length. Qwen has used it to replace part of the traditional attention layers since Qwen3.5"
  - term: "AxB-AyB notation"
    aliases: ["MoE parameter notation"]
    definition: "Parameter notation for MoE models: Ax is total parameters, Ay is what each token actually activates. 397B-A17B means 397B total parameters with only 17B active per forward pass"
  - term: "Early fusion"
    aliases: ["early fusion"]
    definition: "Mixing text, images, and video into pretraining from the start, rather than bolting a vision adapter onto a finished text model. The source of native multimodal capability"
---

> 🌏 [繁體中文版](/posts/tech/2026-08-24-ai-model-family-qwen)

In August 2026, Alibaba did two seemingly contradictory things. It launched [Qwen3.8-Max](https://qwen.ai/blog?id=qwen3.8), a 2.4T-parameter flagship — then published that flagship's base weights on HuggingFace, the first Max-tier model Qwen has ever open-sourced. In the same week it also released a 27B dense model whose pitch is native visual understanding on laptop-class hardware.

This family has been the most-downloaded on HuggingFace for years (see the [series overview](/posts/tech/2026-08-24-ai-model-landscape-overview), zh-TW). That lead doesn't come from any single winning model — it comes from coverage, from phone-sized small models all the way up to datacenter flagships. This post traces the family's evolution, its strategic pivot between two tracks, and how to choose the right model today.

For how to read the benchmark numbers cited here, see our [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources) (zh-TW). An earlier version of this family profile, covering up to Qwen3.6, is [also available](/posts/ai/2026-04-28-qwen-model-intro) (zh-TW).

## Family Evolution Timeline

| Version | Released | Key facts |
|---|---|---|
| Qwen-7B / 14B | 2023-08 | First open-source release; Tongyi Qianwen brand debuts |
| Qwen1.5 | 2024-02 | Full size coverage 0.5B–72B; multilingual gains |
| Qwen2 | 2024-06 | 72B flagship; 128K context |
| Qwen2.5 | 2024-09 | Specialist lines take shape: Coder / VL / Math |
| Qwen3 | 2025-04 | 235B-A22B MoE; switchable thinking mode; closed Qwen3-Max (>1T params) appears |
| Qwen3-Coder / Next | 2025-07 / 09 | Coder 480B-A35B launches; Next-80B-A3B pilots ultra-sparse MoE + hybrid Gated DeltaNet/full attention |
| Qwen3.5 | 2026-02 | Open flagship 397B-A17B: Gated DeltaNet + MoE, native multimodality, 201 languages |
| Qwen3.5 Small | late 2026-02 | On-device series 0.8B–9B; among the family's most-downloaded |
| Qwen3.6 commercial line | 2026-04-02 | Max-Preview / Plus / Flash SKUs, all closed, DashScope-exclusive |
| Qwen3.6 open line | mid 2026-04 | 35B-A3B and 27B Dense; Thinking Preservation added |
| Qwen3.7 | 2026-05–06 | Max (5/20) and Plus (6/1): an entire **closed** generation, no open weights at all |
| Qwen3.8-Max | 2026-08-03 | 2.4T-A95B GA, priced $2/$6, 16-day autonomous coding demo |
| Qwen3.8 open weights | 2026-08-12–14 | 2.4T-A95B (custom license) + 27B (Apache 2.0) |

Three years, eight generations. The first half ran on a single script — open source builds the ecosystem. The second half added a second storyline: the commercial line and the open line formally split.

## Two Product Lines: Openness Buys Ecosystem, Closure Collects Revenue

The key to reading Qwen's moves in 2026 is splitting them into two parallel tracks:

**The open line** (the `Qwen` org on HuggingFace): open checkpoints from every generation since 3.5, nearly all under Apache 2.0 with no commercial restrictions. This line exists to hold the ecosystem position — Ollama, vLLM, and llama.cpp all support it, and the fine-tuning community treats it as their default base.

**The commercial line** (the DashScope / Model Studio API): Max-tier models have never shipped weights. In 2026 this track visibly tightened — the three commercial SKUs of generation 3.6 went DashScope-only, and generation 3.7 released no weights whatsoever.

There was also a personnel twist. [Qwen's core technical leads left in early 2026](https://modelfit.io/blog/qwen-team-exodus-alibaba/), and under new management the next two generations leaned noticeably toward closure. At the time the open-source community wondered aloud whether this famously open lab had turned its back on openness for good.

Which is exactly why August mattered. [At launch, the Qwen team stated outright](https://www.alibabacloud.com/blog/qwen3-8-max-a-new-bar-for-coding-and-cowork_603421) that this would be the first time Max-tier weights were opened — closing out six closed generations of the Max line. The reading isn't hard: against Kimi K3's and DeepSeek's open-weights offensives, the open ecosystem remains Qwen's deepest moat. The new management chose to return to that path — just with more calculation involved (see the licensing section below).

## Architecture: Why Small Models Punch Up

### Gated DeltaNet: Making Long Context Cheap

A standard Transformer's attention compute grows quadratically with sequence length — that's why long context is expensive and slow. Gated DeltaNet is a linear attention variant: it swaps the full attention matrix for a fixed-size recurrent state, turning compute growth linear. It debuted as an experiment in September 2025's Qwen3-Next-80B-A3B, then became the mainline architecture in Qwen3.5. And it's not a wholesale replacement — it's a **hybrid layout**: some layers use DeltaNet for long-range dependencies while key layers keep full attention.

With Qwen3.8-Max, this hybrid layout finally runs at frontier scale. As the [NYU Shanghai library's release analysis](https://rits.shanghai.nyu.edu/ai/qwen3-8-2-4t-a95b-alibaba-open-weights-its-max-tier-flagship/) points out, whether linear attention could survive frontier scale used to be a paper claim only — now there's finally a publicly inspectable sample.

### Fine-Grained MoE: 17B Active Inside 397B

Qwen's MoE goes fine-grained: many small experts, with each token activating only a few. Qwen3.5-397B has over five hundred experts but activates roughly ten per token plus one shared expert. Qwen3.8-Max keeps the same design — a sparsity ratio of about 25:1 between total and active parameters (full specs in the comparison table below).

The practical meaning shows most clearly in 35B-A3B: active parameters are a rounding error next to total, yet it beat the previous generation's 235B-class flagship. For self-hosted inference, VRAM and latency are decided by active parameters, not total ones. Same hardware, much higher quality ceiling.

### Native Multimodality: Not Bolted On, Born With It

Since 3.5, Qwen has trained with early fusion — text, images, and video mixed into pretraining itself, rather than attaching a vision adapter after the fact. The August-released Qwen3.8-27B brings this to mid-size dense models, natively accepting text/images/video, and [CNBC reports](https://www.cnbc.com/2026/08/17/alibaba-meta-qwen-open-weight-ai-laptop-models.html) it runs in 17GB of VRAM. For local vision understanding workloads, this is among the most hardware-friendly options available right now.

## Choosing Between Qwen3.8 Max and 27B

The two new faces of August have completely different jobs:

| | Qwen3.8-Max (API) | Qwen3.8-2.4T-A95B (open) | Qwen3.8-27B (open) |
|---|---|---|---|
| Total params | 2.4T | 2.4T | 27B |
| Active params | 95B | 95B | 27B (dense) |
| Context | 1M | 262K native, expandable to ~1.01M | — |
| Multimodal | text/image/video | ✗ (text-only base) | ✓ (text/image/video) |
| License | closed API | **Custom Qwen3.8-Max License** | Apache 2.0 |
| Pricing | $2 / $6 / $0.25 cached per 1M tokens | free, datacenter hardware required | free, laptop-class OK |
| Role | frontier quality | self-hosted flagship research | local all-rounder |

Pricing and specs from the [official blog](https://qwen.ai/blog?id=qwen3.8), [Marktechpost's launch coverage](https://www.marktechpost.com/2026/08/03/alibaba-qwen-releases-qwen3-8-max/), and the [HuggingFace model card](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B).

### The License Trap: Open-Sourced, But Not Apache 2.0

For three years, "Qwen open source = Apache 2.0" was close to an equation. Not anymore. The [Qwen3.8-2.4T-A95B ships under a custom Qwen3.8-Max License](https://www.aimadetools.com/blog/qwen-3-8-max-complete-guide/) — not Apache 2.0 — and its specific restrictions on commercial deployment and redistribution need to be read clause by clause. The 27B stays Apache 2.0. This is a clear signal: **the boundary of "open source" is being redrawn by model tier**. Small and mid-size models keep being gifted; flagship-class becomes "open weights, with conditions." If your deployment depends on license certainty, this line matters more than any benchmark score.

### Where the Performance Lands

| Benchmark | Qwen3.8-Max | Comparison |
|---|---|---|
| [LongBench v2](https://benchlm.ai/benchmarks/longbench-v2) | 66.3% (top of board) | Claude Opus 4.5 64.4%; previous-gen Qwen3.5 397B 63.2% |
| Terminal-Bench 2.1 | 86.6% | Official table places it above GPT-5.6 Sol and Claude Fable 5 |
| OSWorld-Verified | 86.1% | same |
| SWE-Bench Pro | 67.7% | Claude Fable 5 80.3% — the widest gap on this list |
| [BenchLM composite](https://benchlm.ai/stats/open-source-llm) | 78.95 (#1 open, #6 overall) | ~4 points behind the strongest closed model |
| Arena.ai Vision | ELO 1305 (#2) | vendor-submitted, pending independent verification |

Three honest caveats beyond the numbers.

Arena rankings are vendor submissions without independent replication. The multimodal generational leap was measured against Qwen3.7-**Plus** (not Max) as baseline, which flatters the delta. And Alibaba's own RL curve counsels calm: past roughly four thousand training environments, reward declines instead of rising — RL environment scaling hasn't found a monotonically ascending path yet.

Alibaba also demoed Qwen3.8-Max [coding autonomously for 16 consecutive days](https://rits.shanghai.nyu.edu/ai/qwen3-8-2-4t-a95b-alibaba-open-weights-its-max-tier-flagship/) to produce the open-source framework oh-my-cli. That's a demonstration, not third-party replication.

As for the self-hosting bar on the 2.4T weights: even quantized to 4-bit, the weights alone need roughly 1.2TB of memory — [multi-node datacenter territory](https://aliteq.com/alibaba-qwen3-8-max-open-weights-2026), not a workstation. Its realistic audience is cloud teams and researchers, not individuals. For individuals, the 27B is your share.

## Sub-Lines and Ecosystem: One Table for How Many Models Qwen Actually Has

"How big is this family" is Qwen's most underestimated trait. Beyond the general mainline, it simultaneously runs eight-plus specialist lines:

| Line | Evolution | Latest status (2026-08) |
|---|---|---|
| General mainline | 3.5 (open) → 3.6/3.7 commercial (closed) → 3.8-Max API + 2.4T/27B open | tiered supply; see above |
| Coder | Qwen2.5-Coder → Qwen3-Coder 480B-A35B → Coder-Next 80B-A3B ($0.12/$0.60) | Apache; [no new release since March 2026](https://www.scriptbyai.com/qwen-timeline); coding now carried by mainline flagships |
| Vision-language | Qwen2.5-VL → [Qwen3-VL-235B](https://huggingface.co/collections/Qwen/qwen3-vl) (DocVQA 96.5%, MathVista 85.8%, see the [series overview](/posts/tech/2026-08-24-ai-model-landscape-overview)) → mainline-native multimodality | open-weight crown handed to the 3.5/3.8 mainline |
| Reasoning | QwQ-32B standalone research line → thinking mode merged into the Qwen3 mainline | absorbed |
| Omni/speech | Qwen2-Audio → Qwen3-Omni 30B-A3B (Apache; Instruct/Thinking/Captioner variants) → 3.5-Omni, Audio-3.0 series | new versions API-only since mid-July, no weights |
| Image generation | Qwen-Image → 2.0 → 2512 (all Apache 2.0) → Image-3.0 | new version went closed on 7/21 |
| Embedding/Reranker | Qwen3-Embedding and Qwen3-Reranker (0.6B/4B/8B) | Apache 2.0; workhorses of RAG stacks |
| Math | Qwen2.5-Math → math ability folded into the mainline | absorbed |

Two clear trends hide in this table:

**Capabilities are being folded into the mainline.** Coder, Math, and QwQ have all stopped iterating independently — the same playbook as DeepSeek folding Coder back into the mainline from V3 onward: once the general model's specialist abilities get strong enough, maintaining separate lines stops paying for itself. Vision took a different route: rather than killing the VL line, early fusion made vision a birthright of the mainline.

**New media-generation sub-lines are going the opposite way — closed.** July's Audio-3.0 Realtime/TTS/ASR and Image-3.0 are the first Qwen specialist models born closed. Their predecessors — Qwen3-TTS, Qwen3-Omni, Qwen-Image-2.0 — still sit under Apache 2.0. The open-source dividend continues on understanding tasks; on media generation it's being clawed back.

Deployment reach is a quiet advantage. AWS Bedrock carries a first-class card for Qwen3-Coder; Google Vertex AI Model Garden hosts Qwen3-VL directly; NVIDIA NIM serves Coder-480B. Add third-party hosting on OpenRouter, Together, and Fireworks, and "Qwen runs everywhere" currently has no rival.

On the tooling side there's Qwen Code, a terminal coding agent, plus MyContext, an open-source context infrastructure released in August. The latter organizes chat threads, documents, and collaboration records into traceable working files, targeting hallucination in long agent tasks (see our [China regional watch](/posts/daily/2026-08-21-region-china), zh-TW).

One last reminder: in API naming, Max/Plus/Flash/Turbo are service-tier labels, not weight guarantees. To know whether you can self-host, read the license field — not the suffix.

## Position Against Competitors

Placing Qwen3.8 back into the open-source landscape of August 2026:

- **Against Kimi K3 (2.8T open weights)**: K3 is bigger in both total and estimated active (~200B) parameters. Qwen3.8 competes on the same open table with half the active parameters, plus full-size coverage below 27B. These two labs are the only ones offering 2T-class open weights
- **Against DeepSeek V4**: DeepSeek wins on price (V4 Pro off-peak output $0.87) and MLA's structural cost advantage; Qwen wins on size spectrum and multimodal breadth. On long-context (LongBench v2), Qwen3.8-Max currently leads
- **Against the Claude/GPT frontier**: environment-operation tasks like Terminal-Bench and OSWorld are trading wins. But SWE-Bench Pro trails Fable 5 by twelve-plus points — the last mile of real software engineering isn't walked yet

## What This Means for Agent Developers

- **Frontier-quality API** → Qwen3.8-Max at $2/$6 undercuts 3.7-Max ($2.50/$7.50) — among the lowest output prices in the frontier tier
- **Heavy multimodal volume** → Qwen3.7-Plus ($0.40/$1.60, within 256K) is still the cheapest multimodal API around, five times cheaper than 3.8-Max; good enough for most vision tasks
- **Laptop or edge deployment** → Qwen3.8-27B: dense, native vision, Apache 2.0, runs in 17GB VRAM
- **Self-hosting a flagship for research or data sovereignty** → Qwen3.8-2.4T-A95B, but read the custom license first and prepare a multi-node cluster
- **RAG** → Qwen3-Embedding plus Reranker; staying in the same ecosystem as your main model buys vector-space behavioral consistency for free
- **Citing benchmarks** → Qwen's naming matrix — generation × Max/Plus/Flash × open/closed — is the easiest to get wrong of any family. Always write out the exact model and date, or you're comparing different races

## The Bottom Line

Qwen's bet is the whole bundle. It doesn't always win individual crowns — Claude still holds the agentic coding high-water mark, and DeepSeek wins the cost war — but from phones to datacenters, embeddings to speech, there's a matching option, and most of them you can run yourself.

The 2026 story has two turns: after the core team exodus, the family briefly pulled toward closure — then handed Max-tier weights back to the community at the end of August. The open ecosystem proved to be its deepest moat, one even the new leadership had to come back and tend.

What deserves watching is the stratification of licensing: Apache 2.0 for small models, custom terms for flagships, closed for media-generation specialists. "Open source" is becoming three different things at three different tiers — and Qwen is just the first family to draw the boundaries this explicitly.

---

## References

- [Qwen3.8-Max: A New Bar for Coding and Cowork — Qwen official blog](https://qwen.ai/blog?id=qwen3.8)
- [Qwen/Qwen3.8-2.4T-A95B — HuggingFace model card](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B)
- [Qwen3.8-2.4T-A95B: Alibaba Open-Weights Its Max-Tier Flagship — NYU Shanghai RITS](https://rits.shanghai.nyu.edu/ai/qwen3-8-2-4t-a95b-alibaba-open-weights-its-max-tier-flagship/)
- [Alibaba Qwen Releases Qwen3.8-Max — Marktechpost](https://www.marktechpost.com/2026/08/03/alibaba-qwen-releases-qwen3-8-max/)
- [Qwen3.8-Max — Benchmarks, Specs & Release Date — AI Release Tracker](https://aireleasetracker.com/model/qwen/qwen3.8-max)
- [Qwen Versions — Mungomash](https://mungomash.com/ai/qwen/versions/)
- [Qwen 3.8 Max Complete Guide (incl. licensing chapter) — Aimade Tools](https://www.aimadetools.com/blog/qwen-3-8-max-complete-guide/)
- [Qwen 3.7: Release Date, Status, and What's Real — Codersera](https://codersera.com/blog/qwen-3-7-release-date-whats-new-2026/)
- [Alibaba open-sources Qwen open-weight AI laptop models — CNBC](https://www.cnbc.com/2026/08/17/alibaba-meta-qwen-open-weight-ai-laptop-models.html)
- [Qwen3.8-27B — Artificial Analysis](https://artificialanalysis.ai/models/qwen3-8-27b)
- [Serve Qwen3.8-2.4T-A95B on NVIDIA GB300 NVL72 — NVIDIA Technical Blog](https://developer.nvidia.com/blog/serve-qwen3-8-2-4t-a95b-a-2-4t-parameter-model-with-configurable-reasoning-on-nvidia-gb300-nvl72/)
- [The hardware math behind self-hosting Qwen3.8-Max — Aliteq](https://aliteq.com/alibaba-qwen3-8-max-open-weights-2026)
- [Qwen team exodus — Modelfit](https://modelfit.io/blog/qwen-team-exodus-alibaba/)
- [Qwen Timeline: Model & Product Release History — ScriptbyAI](https://www.scriptbyai.com/qwen-timeline)
- [Qwen3 — AI Wiki (deployment ecosystem: Bedrock/Vertex/NIM)](https://aiwiki.ai/wiki/qwen_3)
- [Qwen3 Technical Report (arXiv:2505.09388)](https://huggingface.co/papers/2505.09388)
- [The AI Model Landscape overview — this site, series introduction (zh-TW)](/posts/tech/2026-08-24-ai-model-landscape-overview)
- [AI model evaluation sources guide — this site (zh-TW)](/posts/tech/2026-08-24-ai-model-evaluation-sources)
- [Earlier Qwen deep dive (through 3.6) — this site (zh-TW)](/posts/ai/2026-04-28-qwen-model-intro)
