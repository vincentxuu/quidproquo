---
title: "DeepSeek: From an MoE Lab to OpenRouter's Most-used Open Model"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, deepseek, open-source, model-family-deepseek, moe, model-selection]
lang: en
type: deep-dive
tldr: "DeepSeek used MLA and MoE innovations to drive inference costs to an industry low. V4 Flash activates only 13B parameters while approaching frontier-model quality and ranks first by OpenRouter usage. This guide traces V1 through V4, the R1 reasoning branch, and how to choose each version."
description: "A complete guide to the DeepSeek family: the V1-to-V4 evolution, MLA and DeepSeekMoE, the R1 reasoning branch, V4 Pro versus Flash, pricing, and benchmark data."
series:
  name: "AI 模型家族"
  order: 1
draft: false
glossary:
  - term: "MLA"
    def: "Multi-head Latent Attention, DeepSeek's attention mechanism that compresses the KV cache into low-dimensional latent vectors, cutting inference memory use by 93%."
  - term: "KV cache"
    def: "The cache of Key-Value vectors for previously processed tokens during inference, and the main memory bottleneck for long sequences."
  - term: "DSpark"
    def: "DeepSeek's speculative decoding module, built into V4 to accelerate inference."
---

> 🌏 [中文版](/posts/tech/2026-08-24-ai-model-family-deepseek)

In August 2026, DeepSeek V4 Flash led OpenRouter usage with 11.6T processed tokens. DeepSeek-R1 had Hugging Face's highest text-generation like count at 13,585. Every model uses the MIT license. In two and a half years, this Chinese team moved from copying Llama-2 to a distinct technical path: not the largest scale, but the smartest architecture. This article traces V1 through V4, the R1 reasoning branch, the core architectural innovations, and version selection.

For help interpreting the benchmark figures, read the [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en). This is the first family deep dive in the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) series.

## Family Evolution Timeline

| Version | Release | Total parameters | Active parameters | Context | Key innovation |
|---|---|---|---|---|---|
| DeepSeek LLM 67B | 2024-01 | 67B | 67B (Dense) | 4K | Starting point based on Llama-2 |
| DeepSeek-MoE | 2024-01 | 145B | 22B | 4K | First fine-grained MoE |
| DeepSeek-V2 | 2024-05 | 236B | 21B | 128K | **MLA + DeepSeekMoE established** |
| DeepSeek-V3 | 2024-12 | 671B | 37B | 128K | Auxiliary-loss-free balancing, MTP, FP8 training |
| DeepSeek-R1 | 2025-01 | 671B | 37B | 128K | Pure-RL reasoning, R1-Zero |
| DeepSeek-V3-0324 | 2025-03 | 671B | 37B | 128K | Updated V3 |
| DeepSeek-R1-0528 | 2025-05 | 671B | 37B | 128K | Updated R1 |
| DeepSeek-V3.2 | 2025-12 | 671B | 37B | 128K | Unified Thinking/Chat modes |
| DeepSeek-V4 Flash | 2026-04 | 284B | 13B | 1M | CSA+HCA hybrid attention, genuine 1M context |
| DeepSeek-V4 Pro | 2026-04 | 1.6T | 49B | 1M | Flagship, six MoE experts/token |
| V4-Flash-0731 | 2026-07 | 284B | 13B | 1M | New post-training, major agentic gains |
| V4-Pro-0813 | 2026-08 | 1.6T | 49B | 1M | GA release, 96.4% SWE-bench Verified |

Twelve milestones in two and a half years. Each generation brought a specific architectural improvement, not merely more parameters. V2 was the turning point that established MLA and DeepSeekMoE; later generations built on that base.

## Two Main Lines: General vs. Reasoning

The **general line** (V1 → V2 → V3 → V3.2 → V4) optimizes conversation, coding, and tool use for efficiency and cost. V2 established MLA + MoE. V3 trained with 2.788M H800 GPU-hours, the lowest among comparable models. V4 extended context to 1M and split into Flash and Pro.

The **reasoning line** (R1 → R1-0528) specializes in long chains of thought. R1-Zero used only reinforcement learning, without SFT data, yet developed reasoning spontaneously—evidence that reasoning can emerge from reward signals alone. DeepSeek then distilled this capability into smaller Qwen and Llama models.

DeepSeek-Coder began as a separate code family but merged into the general line with V3, whose coding ability made separate training unnecessary. DeepSeek-Math and Prover followed a similar path as mathematical reasoning entered the main models.

## Architecture: Why DeepSeek Is So Cheap

DeepSeek's prices are among the industry's lowest—V4 Flash output costs $0.28 per million tokens, about one-ninetieth of Claude Opus—without a corresponding collapse in quality. Two architectural innovations create that structural cost advantage.

### MLA: Compressing the Memory Bottleneck by 93%

Standard multi-head attention stores every earlier token's Key and Value vectors in the KV cache. With 128 heads of 128 dimensions, one token requires 32,768 floating-point values; at long context lengths, the cache can exceed the model itself.

Multi-head Latent Attention compresses every head's K and V into one 512-dimensional latent vector—512 values instead of 32,768. Inference stores the latent and reconstructs each head's K or V when needed.

The result is a 93.3% smaller KV cache and 28× less memory traffic. Attention computation rises about fourfold, but memory bandwidth, not compute, is the bottleneck. This is why DeepSeek can offer 1M context without explosive cost.

### DeepSeekMoE: 37B Active Parameters from 671B

Conventional MoE uses eight large experts and selects one or two. DeepSeek divides experts much more finely:

- **V3:** one shared expert plus 256 routed experts; eight routed experts activate per token
- **V4 Pro:** 1.6T total parameters, 49B active

Selecting eight of 256 creates far more combinations than selecting two of eight, allowing finer specialization. The always-active shared expert handles common knowledge so routed experts do not all relearn it.

V3 also introduced **auxiliary-loss-free load balancing**. Instead of adding a penalty that interferes with the primary objective, it dynamically lowers an overloaded expert's routing bias and raises an idle expert's bias.

### Engineering Cost Reductions

- **FP8 training:** V3 trained throughout in FP8, with mixed FP4 for expert layers, reducing memory and increasing throughput.
- **DualPipe:** overlaps forward/backward computation with cross-node MoE communication to reduce idle GPU time.
- **PTX-level GPU optimization:** manually tunes warp scheduling below CUDA's abstraction level.

V3's 671B parameters required only 2.788M H800 GPU-hours, surprisingly low for its class; contemporary 600B+ models commonly required more than ten times as much compute.

## V4 Pro vs. V4 Flash

| Item | V4 Flash 0731 | V4 Pro 0813 |
|---|---|---|
| Total parameters | 284B | 1.6T |
| Active parameters | 13B | 49B |
| Context | 1M | 1M |
| Input price ($/1M) | $0.14 | $0.435 off-peak / $1.32 peak |
| Output price ($/1M) | $0.28 | $0.87 off-peak / $3.96 peak |
| Cache-hit input | $0.0028 | $0.003625 |
| [SWE-bench Verified](https://www.swebench.com) | 79% | 96.4% ([Vals AI](https://vals.ai) independent test) |
| [LiveBench](https://livebench.ai) global | 74.17 | 77.44 |
| LiveBench agentic coding | 46.77 | 54.95 |
| Terminal-Bench 2.1 | 82.7 | — |
| SimpleQA-Verified | 34.1 | 57.9 |
| MRCR 1M | 78.7 | 83.5 |
| Concurrency limit | 2,500 | 500 |
| Open weights | ✓ (167GB, MIT) | ✓ (893GB, MIT) |
| Vision | ✓ (experimental) | ✗ |

### How to Choose

- **High-throughput classification, extraction, or summarization:** Flash, for $0.14/1M input, 2,500 concurrent requests, and 13B active parameters.
- **A coding agent fixing bugs:** Pro. Its 96.4% SWE-bench Verified nearly matches Claude Opus 5 at 97.0%, while output costs one twenty-eighth as much.
- **Precise factual answers:** Pro. SimpleQA-Verified is 57.9 vs. 34.1 (+24pp), and BrowseComp 83.4 vs. 73.2 (+10pp).
- **Accurate long-context retrieval:** Pro, with MRCR 1M at 83.5 vs. 78.7.
- **Local deployment:** Flash. Its 167GB MIT weights have 57+ community quantizations; Pro's 893GB is impractical for most hardware.
- **Multi-step autonomous agents:** note the gap. Flash scores 46.77 and Pro 54.95 on LiveBench agentic coding, roughly 10–20pp behind Claude Opus 5 at 65.20.

Flash 0731's post-training update beat the older Pro preview on all nine agentic benchmarks. DeepSWE jumped from 7.3% to 54.4% without an architectural change, showing that post-training may matter as much as pre-training. Pro 0813 GA narrowed some gaps, but Flash remains competitive on many agentic tasks.

## Branches and Ecosystem

- **DeepSeek-Coder / Coder-V2:** early dedicated code models, merged into the general line with V3 and superseded by V4.
- **DeepSeek-Math / Prover:** mathematical reasoning branch, now at V2 and focused on proofs.
- **DeepSeek-OCR:** separate MIT-licensed vision OCR model with 3,347 Hugging Face likes; independent of V4.
- **V4-Flash-Vision-Exp:** experimental multimodal Flash model released August 21, 2026. Images use at most 384 tokens; not recommended for production.
- **R1 distillations:** R1 reasoning distilled into Qwen and Llama models from 1.5B to 70B, arguably R1's largest contribution to the open ecosystem.

## Position Relative to Competitors

| Metric | DeepSeek V4 Pro 0813 | Claude Opus 5 | GPT-5.6 Sol |
|---|---|---|---|
| SWE-bench Verified | 96.4% | 97.0% | ~95% |
| LiveBench agentic coding | 54.95 | 65.20 | 56.21 |
| [HLE](https://www.lastexam.ai) with tools | 60.0% | 64.7% | — |
| Output price ($/1M) | $0.87 | ~$25 | ~$30 |
| Open source | ✓ MIT | ✗ | ✗ |

DeepSeek trails Claude Opus 5 by only 0.6pp on SWE-bench Verified at one twenty-eighth the output price, but the gap exceeds 10pp on agentic tasks requiring autonomous multi-step planning.

A [Codersera analysis](https://codersera.com/blog/deepseek-v4-pro-0813-guide-2026/) summarizes the position well: “V4 Pro is a patch-fixing specialist, not an autonomous agent.” For a clearly specified bug, DeepSeek is almost as strong as Claude. For planning and tool selection, Claude and GPT still lead.

## What It Means for Agent Developers

- **Coding-agent bug-fix pipeline:** V4 Pro nearly matches Opus at one twenty-eighth the cost for explicit “fix this known bug” tasks.
- **High-throughput processing:** V4 Flash offers $0.14/1M input and 2,500-way concurrency for classification, extraction, and summarization.
- **Self-hosting:** V4 Flash's 167GB MIT weights work with vLLM and SGLang and have 57+ quantizations.
- **Autonomous multi-step work:** DeepSeek remains about 10pp behind Claude/GPT. Use DeepSeek for explicit subtasks and Claude for top-level orchestration.
- **MLA and architecture selection:** inexpensive 1M context makes “put the whole corpus in context instead of building RAG” practical in more cases. Below 1M tokens, it may be simpler and more accurate.

## Overall

DeepSeek shows that frontier competitiveness can come from smarter architecture rather than compute alone. MLA and DeepSeekMoE are genuine innovations addressing structural inference cost. Flash's post-training jump in DeepSWE from 7.3% to 54.4% without an architecture change also suggests post-training is underestimated.

For agent developers: Flash for volume, Pro for precision, and Claude/GPT alongside DeepSeek for agentic work. This is no longer an era of one model for everything, but of choosing the right model for each task.

---

## References

- [DeepSeek-V2: A Strong, Economical, and Efficient MoE Language Model (arXiv:2405.04434)](https://arxiv.org/abs/2405.04434)
- [DeepSeek-V3 Technical Report (arXiv:2412.19437)](https://arxiv.org/abs/2412.19437)
- [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via RL (arXiv:2501.12948)](https://arxiv.org/abs/2501.12948)
- [DeepSeek-V4 Technical Report (arXiv:2606.19348)](https://arxiv.org/abs/2606.19348)
- [Revisit DeepSeek Key Papers — complete context across 13 papers](https://binghe2727.github.io/Revisit-DeepSeek-Key-Papers/)
- [The Inner Workings of MLA — Chris McCormick](https://mccormickml.com/2025/04/26/inner-workings-of-mla/)
- [The DeepSeek Series: A Technical Overview — Martin Fowler](https://martinfowler.com/articles/deepseek-papers.html)
- [A Review of DeepSeek Models' Key Innovative Techniques (arXiv:2503.11486)](https://arxiv.org/abs/2503.11486)
- [OpenRouter Rankings](https://openrouter.ai/rankings) — V4 Flash ranked first by usage as of 2026-08-23
- [DeepSeek API Pricing](https://api-docs.deepseek.com/quick_start/pricing)
- [Aider LLM Leaderboards](https://aider.chat/docs/leaderboards/)
- [DeepSeek V4-Pro 0813 GA: Benchmarks & Pricing — Codersera](https://codersera.com/blog/deepseek-v4-pro-0813-guide-2026/)
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en)
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en)
