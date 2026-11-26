---
title: "SenseNova (SenseTime) — the closed 6.8 Flash office agent and the open-weight looped model Loop-9B"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, sensetime, model-family-sensenova, open-source, multimodal, looped-transformer, model-selection]
lang: en
type: deep-dive
tldr: "SenseTime's SenseNova has two lines. The closed SenseNova 6.8 Flash and 6.8 Flash Lite are served through the Token Plan API and aimed at office and design agents; they are free during the public beta but have no published per-token price. The open-weight SenseNova-Loop-9B runs 32 layers of weights as 56 layer passes, ships under Apache 2.0 with a 512K context, and fits a 256K context in about 15 GiB of GPU memory once quantized to 4-bit. All benchmark numbers for both lines are self-reported; neither OpenRouter nor Artificial Analysis lists any SenseNova model."
description: "A guide to SenseTime's SenseNova model family: API specs for the closed SenseNova 6.8 Flash and Flash Lite, the Token Plan credit system and official benchmarks; the looped architecture, self-hosting memory needs and adoption numbers for the open-weight SenseNova-Loop-9B; U1.5 and other open-weight sub-lines, a 2025→2026 timeline, and agent selection guidance."
series:
  name: "AI Model Families"
  order: 42
draft: false
glossary:
  - term: "mHC (Manifold-Constrained Hyper-Connections)"
    aliases: ["mHC"]
    definition: "A design that widens the single residual path into several parallel residual streams and uses Sinkhorn normalization to constrain how they mix; SenseNova-Loop-9B uses two streams inside its looped block"
  - term: "Token Plan"
    definition: "SenseTime's subscription API plan for SenseNova: instead of per-million-token pricing, usage is deducted from credit caps on a rolling 5-hour window and a weekly window"
---

> :globe: [中文版](/posts/tech/2026-11-23-ai-model-family-sensenova)

SenseNova (Chinese name 日日新, "Ri Ri Xin") is SenseTime's large-model brand. In 2026 it split into two very different lines. One is the closed SenseNova 6.8 Flash series, available only through SenseTime's own API and pitched at agent workflows for office documents, data analysis and animated design. The other is a set of open-weight research models in the Hugging Face [`sensenova` organization](https://huggingface.co/sensenova), the most watched of which is the looped [SenseNova-Loop-9B](https://huggingface.co/sensenova/SenseNova-Loop-9B).

This post is for two kinds of reader: people looking for a small open-weight model that runs long contexts on a single consumer GPU, and people evaluating Chinese office-agent APIs. By the end you should be able to decide whether Loop-9B belongs in your local evaluation, whether the 6.8 Flash API terms are acceptable, and which questions you can only answer by testing yourself.

For how to read the benchmark numbers below, see the [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en).

## Family positioning and model matrix

| Model / line | Role | Key differences | Access |
|---|---|---|---|
| SenseNova 6.8 Flash (API name `sensenova-6.8-flash`) | Closed flagship, office and design agents | Text + image input; 1M context, up to 128K output per call; thinking cannot be turned off | Token Plan API; parameters and weights not disclosed |
| SenseNova 6.8 Flash Lite (`sensenova-6.8-flash-lite`) | Closed lightweight tier for everyday tasks | Text + image input; 262,144 context, up to 65,536 output; thinking can be turned off | Token Plan API |
| SenseNova-Loop-9B (HF `sensenova/SenseNova-Loop-9B`) | Open weights, looped architecture | About 9B parameters; 32 layers of weights run as 56 layer passes; text + image input; 512K context | Apache 2.0 weights (BF16, official AWQ 4-bit, GGUF); no official hosted API |
| SenseNova-U1.5-8B-MoT | Open weights, unified understanding and generation | One model for image understanding, generation and editing, with no separate vision encoder or VAE | Apache 2.0 weights; the API counterparts are U1.5 Lite / Fast |

Two things to know up front:

- **The closed and open models are not two versions of one model.** The 6.8 Flash series has no released weights and SenseTime has not disclosed its size. Loop-9B is a separate architecture experiment; SenseTime calls it "a frontier exploration of next-generation model architecture" and does not describe it as a distilled 6.8 Flash.
- **Token Plan also serves other vendors' models.** The model overview in the [platform docs](https://platform.sensenova.cn/docs) lists DeepSeek V4.1 Flash, GLM-5.3 and Kimi K3 next to 6.8 Flash, Flash Lite and U1.5. Choosing Token Plan does not mean using only SenseNova.

### Sub-lines and ecosystem

The `sensenova` organization currently holds 44 repos. Besides the Loop and U series there are several smaller lines:

- **SenseNova-SI**: spatial-intelligence fine-tunes built on open models such as InternVL3, Qwen2.5-VL and Qwen3-VL, Apache 2.0.
- **SenseNova-MARS** (8B / 32B) and **InteractiveOmni** (4B / 8B): MIT-licensed multimodal research models.
- **SenseNova-Vision-7B-MoT**: weights under [CC BY-NC 4.0](https://huggingface.co/sensenova/SenseNova-Vision-7B-MoT), non-commercial only, unlike the rest of the family.
- **Application models fine-tuned from Qwen3.8-27B**: [SenseNova 6.8 Code2Video](https://huggingface.co/sensenova/SenseNova-6.8-Code2Video) (writes code to produce short videos; the card recommends Claude Code as the harness) and the robotics model SenseNova-RoboRSI-27B-Preview. The "6.8" in the name is a brand version; the base weights are Qwen, not 6.8 Flash.
- **Looped-DiT-B16 / B32**: small looped image-generation models released in September 2026 under MIT, which applied "run the same layers again" to diffusion before Loop-9B did it for language.

On the tooling side, [SenseNova-Skills](https://github.com/OpenSenseNova/SenseNova-Skills) packages office capabilities such as slide decks, infographics, data analysis and deep research as skills; SenseTime recommends running them with OpenClaw or Hermes Agent.

## Family evolution

| Version | Released | What changed for selection | Site record |
|---|---|---|---|
| SenseNova V6.0 | 2025 | Native multimodal fusion training; SenseTime's first release built around multimodal reasoning | — |
| SenseNova V6.5 | 2025-07-27 | Interleaved image-text chain of thought; SenseTime claims 3× the cost-performance of V6.0 | — |
| NEO architecture | 2025-12-01 | Dropped the usual "vision encoder + projector + language model" stack; open-sourced at 2B / 9B; the later U series is built on it | — |
| SenseNova U1 | 2026-04-28 | SenseTime's first Apache 2.0 release of a unified understanding-and-generation model (8B dense and A3B MoE) | — |
| SenseNova 6.7 Flash-Lite + Token Plan | 2026-05-08 | The closed API moved to subscription credits, free during the beta; SenseNova-Skills open-sourced at the same time | — |
| SenseNova 6.8 Flash Lite Preview | 2026-08-11 | Long-horizon tasks with a main agent orchestrating more than ten sub-agents | — |
| SenseNova U1.5 | 2026-08 | Second U-series release, stronger image editing and interleaved image-text output | — |
| SenseNova-Loop-9B-Preview | 2026-10-30 | First open-weight looped language model, 262K training length | [Model card](/posts/daily/2026-10-31-model-sensetime-sensenova-loop-9b-preview-en) |
| SenseNova 6.8 Flash | 2026-11-02 | Closed flagship GA: 1M context, long-term memory, animated slides and Blender 3D design | — |
| SenseNova-Loop-9B | 2026-11-17 | Final release of the Preview; context doubled to 512K, with official AWQ and GGUF at launch | [Model card](/posts/daily/2026-11-21-model-sensetime-sensenova-loop-9b-en) |

In 2025, V6 and V6.5 followed a "one big multimodal flagship" path. From 2026 SenseTime split it in two: the closed side now sells a bundle of Flash / Flash Lite, subscription credits and open-source skills for office agents, while the open-weight side carries architecture experiments (NEO, the U series, Loop). The detailed Loop-9B-Preview scores (WorkBuddy Bench and RaccoonPPT Bench against Qwen3.5-27B) stay in the [model card from that time](/posts/daily/2026-10-31-model-sensetime-sensenova-loop-9b-preview-en); the comparison set differs from the final release's, so they are not merged into one table.

## Architecture and training trade-offs

### SenseNova-Loop-9B: buying depth with a loop

The design published in the [Loop-9B model card](https://huggingface.co/sensenova/SenseNova-Loop-9B):

- **Looped decoder**: 32 decoder layers. Input passes through layers 0–3, then layers 4–27 (24 layers) run twice with the same weights, then layers 28–31. Each forward pass performs 56 layer computations while storing 32 layers of weights; SenseTime converts this to about 14.6B "inference-equivalent parameters".
- **Two-stream mHC**: inside the looped block each layer reads from two residual streams, runs attention or FFN, and writes back; the stream-mixing matrix is constrained by 20 Sinkhorn normalization iterations.
- **Hybrid attention**: groups of four layers, three linear-attention layers followed by one full-attention layer. The loop boundaries align with whole four-layer groups, so both passes keep the same attention pattern.
- **Multimodal**: text and image in, text out. Training data includes text, images, code and tool-use trajectories, with context extended to 512K.

SenseTime ran a loop-count experiment: taking the same 9B model with a single pass as the baseline and keeping training data fixed, most of the four tasks peaked at three or four loops. Going from two loops to four added another 1.04 percentage points on LiveCodeBench v6. Both the Preview and the release use two loops, for inference efficiency. In other words, the shipped Loop-9B is not at its best loop count; it trades a little score for lower inference cost.

The model card does not say whether Loop-9B was pre-trained from scratch or initialized from another base model, and it does not disclose the training token count.

### Compared with Inkling 2 Mini's looped design

The site's [Inkling family post](/posts/tech/2026-09-05-ai-model-family-inkling-en) covers another looped model, Inkling 2 Mini. Both buy reasoning depth by re-running middle layers, but the trade-offs differ:

| | SenseNova-Loop-9B | Inkling 2 Mini |
|---|---|---|
| Backbone | Dense, hybrid linear / full attention | MoE, 26.4B total, 3.4B active |
| Looping | Middle 24 layers run 2× (32 layers → 56 passes) | Middle 12 layers run 3× (24 layers → 48 passes) |
| Extra design | Two-stream mHC | — |
| Context | 512K | 1M |
| Hosted API | None | Tinker and third parties on OpenRouter |

Loop-9B computes the full 9B of weights per token, plus a second pass through the middle block; Inkling 2 Mini activates 3.4B per token. The former has a smaller weight file (about 4.9GB at 4-bit), the latter less compute per token. Both vendors compare against Qwen3.8-27B, but on different benchmarks, so they cannot be ranked against each other directly.

### SenseNova 6.8 Flash: not disclosed

SenseTime has not published the parameter count, architecture or training data for 6.8 Flash or Flash Lite. The official docs and press release confirm only interface-level facts: it is natively multimodal (SenseTime's wording is that there is no intermediate "vision-to-text" layer), and thinking cannot be disabled on Flash. The [Token Plan page](https://www.sensenova.ai/token-plan) claims about 60% lower token use than text-only agent models on long multi-step tasks; that is SenseTime's own estimate, and the page notes that real jobs vary.

## Evaluation and alternatives

There is **no third-party evaluation** of this family yet: neither [Artificial Analysis](https://artificialanalysis.ai/models) nor [OpenRouter](https://openrouter.ai/models) lists any SenseNova model. Every number below is self-reported by SenseTime.

### Self-reported: Loop-9B against open models of similar size

From the benchmark chart in the [Loop-9B model card](https://huggingface.co/sensenova/SenseNova-Loop-9B) ("—" means the chart does not include that model):

| Benchmark | Loop-9B-Preview | Loop-9B | Qwen3.6-27B | Qwen3.8-27B |
|---|---|---|---|---|
| GAIA | 37.86 | 69.90 | — | 66.99 |
| Terminal-Bench 2.1 | 40.45 | 59.55 | 63.40 | — |
| AutomationBench | 14.33 | 36.67 | 14.33 | 36.67 |
| AIDABench | 58.62 | 65.31 | 58.62 | 65.01 |
| NL2Repo | 19.91 | 41.36 | 36.20 | 44.60 |
| T³-Banking | 18.56 | 30.93 | 14.43 | 36.08 |
| BIRD | 71.38 | 72.34 | 69.82 | — |

How to read it:

- **The release is a big step over the Preview.** GAIA nearly doubles, NL2Repo doubles, and all seven scores go up.
- **Against Qwen3.8-27B it wins some and loses some.** Slightly higher on GAIA and AIDABench, tied on AutomationBench, behind on NL2Repo and T³-Banking. Terminal-Bench 2.1 has no Qwen3.8 bar, and Loop-9B trails Qwen3.6-27B there. Coding and banking workflows remain weak spots, as with the Preview.
- **SenseTime chose the comparison set.** The same chart also includes Nanbeige4.2 3B, iQuest-Coder 40B and Qwen3.6 35B-A3B; the opponents vary from benchmark to benchmark, and no common inference settings are stated.

### Self-reported: 6.8 Flash against closed and Chinese flagships

From the benchmark charts on the [6.8 Flash product page](https://www.sensenova.cn/flash-6-8). Each benchmark has a different set of opponents, so the table lists only 6.8 Flash and the strongest opponent on that benchmark:

| Benchmark | 6.8 Flash | Strongest opponent |
|---|---|---|
| AutomationBench | 49.78 | Opus 5: 50.30 |
| WorkbuddyBench | 76.54 | Opus 5: 76.80 |
| TeamBench | 53.33 | MiMo V2.6 Flash: 52.22 (6.8 Flash highest) |
| DataAnalysis2.0 (built by SenseTime) | 86.89 | Opus 5: 86.48 (6.8 Flash highest) |
| RaccoonPPTBench v2 (built by SenseTime) | 69.60 | GPT 6 Sol: 74.20 |
| BrowseComp | 88.55 | GPT 5.6 Sol: 90.40 |
| LongMemEval-S | 93.33 | Claude 5.5 Haiku: 96.67 |
| BEAM 128K | 77.71 | GPT 6 Luna: 77.71 (tie) |
| PersonaMem-v2 | 69.33 | Claude 5.5 Haiku: 71.00 |
| π-bench | 58.16 | DeepSeek V4.1 Flash: 66.25 |

How to read it:

- **Out of ten benchmarks, 6.8 Flash is first on two and tied on one, and one of the two wins is on SenseTime's own benchmark.** The only public benchmark it leads is TeamBench; on AutomationBench and WorkbuddyBench it is within 0.6 points of Opus 5 but does not beat it.
- **Opponent versions are inconsistent.** The same chart uses three Claude versions (Opus 5, Opus 5.5, Opus 4.8) and two GPT versions (6 Sol, 5.6 Sol), so each benchmark has a different opponent. The chart cannot be read as "close to Opus 5 overall".
- **The memory benchmarks compare against small models.** The long-term-memory set pits it against lightweight models such as Claude 5.5 Haiku and GPT 6 Luna, and on π-bench 6.8 Flash trails DeepSeek V4.1 Flash and MiniMax M3 by about 8 points.

## Licensing, pricing, and deployment

### Open weights: mostly Apache 2.0, but check each repo

The Loop-9B card points its license to the [LICENSE file on GitHub](https://github.com/OpenSenseNova/SenseNova-Loop/blob/main/LICENSE), which is the unmodified Apache 2.0 text with no MAU threshold or regional restriction. U1 and U1.5 are also Apache 2.0. The exceptions are SenseNova-Vision-7B-MoT (CC BY-NC 4.0, no commercial use) and MARS and InteractiveOmni (MIT). Code2Video and RoboRSI, fine-tuned from Qwen3.8-27B, are labeled Apache 2.0; check the base model's license before use as well.

### Closed API: Token Plan credits

- **No published per-token price.** 6.8 Flash and Flash Lite are offered only through Token Plan. The [Token Plan page](https://www.sensenova.ai/token-plan) currently shows only the public-beta Free plan ($0/month, 1,500 calls per model per 5 hours, up to 20 API keys); paid Lite / Pro plans are marked "coming soon".
- **Actual capacity is set by credits.** Per the [platform docs](https://platform.sensenova.cn/docs), during the beta the general credit pool is capped at 120,000 per rolling 5 hours and 1,200,000 per week, with a separate Flash Lite pool of 60,000 / 600,000; different models deduct different amounts. SenseTime notes these are beta terms and may change.
- **The Free plan lists Flash Lite.** The Token Plan page's Free plan names 6.8 Flash Lite and U1 Fast, while the English press release says 6.8 Flash is free to try. The two pages disagree; confirm in the console before running 6.8 Flash in production.

### API specs

| | 6.8 Flash | 6.8 Flash Lite |
|---|---|---|
| Endpoint | `https://token.sensenova.cn/v1/chat/completions` (OpenAI-compatible) | Same |
| Context | 1M | 262,144 |
| Output per call | 64K default, up to 128K (shared by reasoning and answer) | Up to 65,536 |
| Thinking | Always on; `reasoning_effort` minimal / low / medium / high (default) / xhigh / max | Can be disabled (`reasoning_effort: none`); low / medium / high (default) / max |
| Input | Text, JPG / PNG / WebP images | Text, images |
| Tools | Function calling, JSON output, streaming | Function calling, parallel tool calls |

SenseTime's own guidance is Flash Lite for everyday tasks and Flash for complex multi-step tasks and professional deliverables.

### Self-hosting Loop-9B

- **Memory**: SenseTime estimates 4-bit weights (about 4.9GB) plus an 8-bit KV cache need about 10 GiB at 64K context, 12 GiB at 128K and 15 GiB at 256K; a 4-bit KV cache saves another 1 to 3 GiB at each size.
- **Inference stacks**: Transformers needs `trust_remote_code=True` (tested on 5.18.0). The LightLLM example runs BF16 with 4-way tensor parallelism. SGLang and vLLM must be built from unmerged PR branches; the AWQ version runs on a single GPU in vLLM.
- **The GGUF does not run on mainline llama.cpp.** The official GGUF files (BF16, Q8_0, Q5_K_M, Q4_K_M) require SenseTime's fork, [OpenSenseNova/llama.cpp](https://github.com/OpenSenseNova/llama.cpp), and the official Ollama library has no Loop-9B either.
- **Fine-tuning**: official examples live in [OpenSenseNova/torchtitan](https://github.com/OpenSenseNova/torchtitan); training scripts for speculative-decoding draft models are in SenseSpec.

### Adoption

Numbers from the Hugging Face API, 2026-11-23:

| Metric | Value |
|---|---|
| HF trending models | Loop-9B at #10 (#1 is Inkling 2 Mini) |
| Downloads, last 30 days | Loop-9B BF16 1,863, official GGUF 80,865, AWQ 735; Preview 6,015 |
| Derivatives tagging Loop-9B as base model | 64 (52 quantized, 11 fine-tunes, 1 adapter); 14 more for the Preview |
| U1.5-8B-MoT | 11,758 downloads in the last 30 days, 28,285 all-time; 28 derivatives |
| Hosted channels | None on OpenRouter, HF Inference Providers or the official Ollama library |

Downloads cluster on the GGUF, which suggests most people run it locally, even though mainline tooling does not support it yet; most derivatives are community quantizations.

## Agent integration and selection

- **Local agents needing long context on a single 16 GB-class GPU** → the AWQ build of Loop-9B is worth a try; SenseTime estimates about 15 GiB at 256K context. Check first that your inference stack supports its custom architecture.
- **You need a hosted API, an SLA, or OpenRouter** → Loop-9B does not fit; it has no hosted channel at all. If you want a looped model with an API, look at [Inkling 2 Mini](/posts/tech/2026-09-05-ai-model-family-inkling-en).
- **Main coding agent** → neither line is a first choice. Loop-9B's own card admits coding and long-horizon agent tasks are inconsistent, and it trails 27B-class rivals on NL2Repo and Terminal-Bench 2.1.
- **Chinese office documents, slide decks, data-analysis reports** → this is where SenseTime has invested most in 6.8 Flash; pair it with SenseNova-Skills and OpenClaw / Hermes Agent. SenseTime notes that the full workflows need an agent framework plus skills, and a bare model API call cannot reproduce them.
- **Latency-sensitive short tasks** → use 6.8 Flash Lite with thinking off; 6.8 Flash's thinking cannot be disabled.
- **Commercial deployment of open weights** → Loop-9B and U1.5 are Apache 2.0; Vision-7B-MoT is non-commercial.

A minimal selection test: run one set of local tasks on Loop-9B AWQ at two loops and record completion rate and GPU memory, then compare against a quantized Qwen or Inkling 2 Mini at the same memory budget. On the API side, use the Token Plan free quota to run 6.8 Flash Lite with thinking on and off, and record the credits each task consumes; with no published unit price, credit consumption is your only cost signal.

## Limitations and trade-offs

- **No third-party evaluation.** Neither Artificial Analysis nor OpenRouter lists the family; every score comes from SenseTime's own charts. The 6.8 Flash chart picks different opponent versions per benchmark, and one of its two wins is on a self-built benchmark.
- **Opaque pricing on the closed side.** Token Plan has only a beta Free plan and credit caps; paid plans and any per-million-token price are unpublished, which makes production cost hard to estimate up front.
- **Loop-9B's tooling is immature.** SGLang and vLLM need PR-branch builds, the GGUF needs a forked llama.cpp, and the official Ollama library does not carry it; compared with Qwen, which mainline stacks support, deployment costs more effort.
- **Loop-9B's known weaknesses**: SenseTime lists complex instruction following (it can miss requirements when given many tool definitions or constraints), inconsistent coding and general agent performance, and complex 3D web pages that take two or three rounds of refinement instead of one.
- **Training provenance is undisclosed.** Loop-9B does not say whether it was initialized from another base model, and 6.8 Flash does not even disclose its size.

One way to read SenseNova's strategy: the closed side uses free credits and open-source skills to pull developers into SenseTime's office-agent ecosystem, while the open-weight side builds technical reputation with architecture experiments such as looped models and NEO. For outside developers, Loop-9B is the one most worth testing now: it sits near the top of HF trending, its weights are plain Apache 2.0, and its memory needs are low. 6.8 Flash needs published paid plans and third-party evaluations before it can be compared fairly with other Chinese APIs.

## References

- [sensenova/SenseNova-Loop-9B — Hugging Face model card (specs, benchmark chart, deployment, known limitations)](https://huggingface.co/sensenova/SenseNova-Loop-9B)
- [sensenova/SenseNova-Loop-9B-Preview — Hugging Face model card](https://huggingface.co/sensenova/SenseNova-Loop-9B-Preview)
- [sensenova/SenseNova-Loop-9B-GGUF — Hugging Face](https://huggingface.co/sensenova/SenseNova-Loop-9B-GGUF)
- [sensenova/SenseNova-Loop-9B-AWQ — Hugging Face](https://huggingface.co/sensenova/SenseNova-Loop-9B-AWQ)
- [OpenSenseNova/SenseNova-Loop LICENSE (Apache 2.0) — GitHub](https://github.com/OpenSenseNova/SenseNova-Loop/blob/main/LICENSE)
- [sensenova — Hugging Face organization](https://huggingface.co/sensenova)
- [SenseNova 6.8 Flash 正式版发布 — SenseTime press release (in Chinese)](https://www.sensetime.com/cn/news/sensenova-6-8-flash-release-20261103-1421)
- [SenseTime Launches SenseNova 6.8 Flash — SenseTime press release](https://www.sensetime.com/en/news/sensenova-6-8-flash-release-20261103-1421)
- [SenseNova 6.8 Flash product page, with benchmark charts (in Chinese)](https://www.sensenova.cn/flash-6-8)
- [SenseNova platform API docs: model specs and credit rules (in Chinese)](https://platform.sensenova.cn/docs)
- [SenseNova Token Plan](https://www.sensenova.ai/token-plan)
- [SenseNova Models](https://www.sensenova.ai/models)
- [商汤发布日日新 SenseNova 6.7 Flash-Lite, Token Plan opens — SenseTime press release (in Chinese)](https://www.sensetime.com/cn/news/51170639)
- [SenseNova 6.8 Flash Lite Preview — SenseTime press release (in Chinese)](https://www.sensetime.com/cn/news/sensenova-6.8-flash-lite-preview)
- [SenseTime Launches the Enhanced SenseNova V6.5 — SenseTime press release](https://www.sensetime.com/en/news/51169861)
- [SenseTime Introduces NEO — SenseTime research page](https://www.sensetime.com/en/research/51170250/)
- [SenseTime Fully Open-Sources SenseNova U1 — SenseTime press release](https://www.sensetime.com/en/news/51170629)
- [SenseNova-U1 technical report — arXiv 2605.12500](https://arxiv.org/abs/2605.12500)
- [SenseNova U1.5 Technical Report — SenseTime](https://www.sensetime.com/en/news/sensenova-u1-5-20260917-1850)
- [sensenova/SenseNova-U1.5-8B-MoT — Hugging Face](https://huggingface.co/sensenova/SenseNova-U1.5-8B-MoT)
- [sensenova/SenseNova-6.8-Code2Video — Hugging Face](https://huggingface.co/sensenova/SenseNova-6.8-Code2Video)
- [sensenova/SenseNova-Vision-7B-MoT — Hugging Face (CC BY-NC 4.0)](https://huggingface.co/sensenova/SenseNova-Vision-7B-MoT)
- [OpenSenseNova/SenseNova-Skills — GitHub](https://github.com/OpenSenseNova/SenseNova-Skills)
- [OpenSenseNova/llama.cpp — GitHub (the fork required for Loop-9B GGUF)](https://github.com/OpenSenseNova/llama.cpp)
- [Model card: SenseNova Loop-9B (final release)](/posts/daily/2026-11-21-model-sensetime-sensenova-loop-9b-en) — this site
- [Model card: SenseNova Loop-9B-Preview](/posts/daily/2026-10-31-model-sensetime-sensenova-loop-9b-preview-en) — this site
- [The Inkling model family](/posts/tech/2026-09-05-ai-model-family-inkling-en) — this site, another looped model
- [AI model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site, series guide
- [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
