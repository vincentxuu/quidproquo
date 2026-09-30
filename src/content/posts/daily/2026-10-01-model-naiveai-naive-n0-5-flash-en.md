---
title: "Model Card: Naive-N0.5-Flash"
date: 2026-10-01
category: daily
type: digest
tags: [ai-agent, model-release, daily, naiveai, model-family-naive]
lang: en
description: "Beijing startup NaiveAI open-sources a 309B MoE model, Naive-N0.5-Flash, that drops full-attention layers entirely — built around an 'AI building AI' R&D story"
tldr: "Naive-N0.5-Flash (HuggingFace: NaiveAI/Naive-N0.5-Flash): open-sourced 2026-09-27 under MIT, a 309B-total/15.5B-active MoE model built on Xiaomi's open MiMo-V2.5 base model with 3.25T further training tokens, replacing every full-attention layer with a hybrid of 39 Sliding-Window Attention layers and 9 DeepSeek Sparse Attention layers; its own NaiveRT inference runtime hits 50 tokens/s standard and up to 2,000 tokens/s in Ultrafast mode; NaiveAI's self-reported SWE-bench Pro score is 73.6 (behind Claude Opus 5.5's 89.9), and it trails same-tier open model DeepSeek V4.1 Flash on DeepSWE, Terminal-Bench, and ProgramBench; announced API pricing is $0.10 input / $0.40 output / $0.01 cache read per 1M tokens, but the API is not yet live; founder Dai Jifeng has an unresolved IP dispute with former employer MiroMind"
series:
  name: "AI Model Tracker"
  order: 36
glossary:
  - term: "Naive"
    def: "The debut model series from Beijing startup NaiveAI (founded by Tsinghua's Dai Jifeng), built around a training and inference pipeline it says AI systems designed autonomously under human direction"
---

> 🌏 [中文版](/posts/daily/2026-10-01-model-naiveai-naive-n0-5-flash)

## Model Details

| Field | Value |
|---|---|
| Model ID | `NaiveAI/Naive-N0.5-Flash` (HuggingFace repo ID; no separate API model ID yet since the API isn't live) |
| Vendor | NaiveAI (Beijing, founded February 2026 by Dai Jifeng, associate professor at Tsinghua University's Department of Electronic Engineering) |
| Parameters | 309B total / 15.5B active (Mixture-of-Experts) |
| Context Window | 1,000,000 tokens (native; 48 transformer layers, no full-attention layers) |
| Input pricing (USD/1M tokens) | $0.10 (announced; cache read $0.01; API not live at time of writing) |
| Output pricing (USD/1M tokens) | $0.40 (announced; API not live at time of writing) |
| Open source | Yes (MIT, both weights and inference code) |
| Release date | 2026-09-27 |
| Official announcement | [NaiveAI technical blog: Naive-N0.5-Flash](https://naive.ai/en/research/) |
| HuggingFace | [NaiveAI/Naive-N0.5-Flash](https://huggingface.co/NaiveAI/Naive-N0.5-Flash) |
| Family | Debut of the Naive series; built on Xiaomi's open-weight MiMo-V2.5 base model, with 3.25T further training tokens and a full replacement of the attention architecture |

## Highlights

- Architectural break: all 48 transformer layers drop full attention entirely, replaced by a hybrid of 39 Sliding-Window Attention layers (128-token window) and 9 DeepSeek Sparse Attention layers (a lightweight indexer scores the full history; the backbone attends only to the top 2,048 tokens, with GQA4 grouping) — decoding cost no longer scales linearly with context length even at a million tokens
- Inference speed: its own NaiveRT runtime delivers 50 tokens/s per user in Standard mode and up to 2,000 tokens/s in Ultrafast mode, peaking at 2,122 tokens/s on 8 GPUs
- The "AI building AI" narrative: NaiveRT was reportedly built by human researchers working with AI models across 151 documented optimization trials in six days; separately, an AI-designed world model called AutoWM scored 77.43 on WorldArena-1 Track 1, ahead of the best previously published score of 73.64
- Pricing: announced API pricing of $0.10 input / $0.40 output / $0.01 cache read per 1M tokens, but as of this writing the API is not live and there's no OpenRouter listing

## Benchmark Results

| Benchmark | Score | Predecessor | Best competitor |
|---|---|---|---|
| SWE-bench Pro | 73.6 | None (NaiveAI's debut model) | Claude Opus 5.5 at 89.9 (3rd of 6 models charted) |
| DeepSWE v1.1 | 67.8 | None (NaiveAI's debut model) | Meta Muse Spark 1.3 at 75.4; same-tier open model DeepSeek V4.1 Flash at 74.2 (7th of 13 charted) |
| Terminal-Bench 2.1 | 86.7 | None (NaiveAI's debut model) | DeepSeek V4.1 Flash at 90.6 (7th of 9 charted) |
| NL2Repo-Bench | 71.9 | None (NaiveAI's debut model) | Tops NaiveAI's own chart, ahead of DeepSeek V4.1 Flash's 64.0 |
| ProgramBench | 17.5 | None (NaiveAI's debut model) | Claude Opus 5 at 37.0; DeepSeek V4.1 Flash at 20.3 (tied last of 7 charted) |

⚠️ All figures come from NaiveAI's own published charts, benchmarked with Claude Code 2.1.207 as the harness; competitor scores are copied from each vendor's own published pages and leaderboards rather than reproduced in the same test environment, and none of it has been independently verified yet.

## Versus the Predecessor and Competitors

There's no real "predecessor" here — this is NaiveAI's first public model. The meaningful comparison is against the closest same-tier open model, DeepSeek V4.1 Flash: Naive-N0.5-Flash trails on all three coding benchmarks charted — DeepSWE v1.1 (67.8 vs. 74.2), Terminal-Bench 2.1 (86.7 vs. 90.6), and ProgramBench (17.5 vs. 20.3) — and only leads on NL2Repo-Bench, a benchmark NaiveAI designed itself that no other vendor has publicly run (71.9 vs. 64.0), which limits how much that comparison actually tells you.

The real selling point isn't competitive benchmark scores — it's the architecture and inference efficiency. Replacing even the handful of full-attention layers that MiMo-V2.5 kept with DeepSeek Sparse Attention means the model still holds 50 tokens/s of single-user decoding at a million-token context, which points to a genuinely different cost structure for long-document or large-repo workloads.

On pricing, the announced $0.10 / $0.40 per 1M tokens is still just a promise — the API isn't live yet, and there's no third-party hosting to verify real-world availability or latency. That comparison can't happen until this step actually ships.

## Implications for Agent Development

The story here is "using AI to accelerate AI research," not a new score ceiling.

- If you're building coding agents that need to read large repos or long documents: holding 50 tokens/s of single-user decode speed at a million-token context — without gaming the benchmark by keeping a few full-attention layers around (the architecture genuinely removes all of them) — is worth weighing when evaluating self-hosted inference options
- If you're building AI-driven research automation (AI R&D agents): the AutoWM case NaiveAI published shows that "AI designs and optimizes autonomously, humans set direction and make key calls" can produce a repeatable workflow under a clear evaluation standard — worth studying as a harness design, though it's a single example and not yet broadly validated
- Not a fit: workloads that need to call an API right now (not live yet), workloads that need the strongest coding scores (same-tier DeepSeek V4.1 Flash leads on all three coding benchmarks), or enterprise procurement sensitive to supply-chain risk — founder Dai Jifeng has an unresolved technical/IP dispute with MiroMind, where he previously served as a technical advisor

## Today's Takeaway

I used to assume that "built on top of some base model" would always leave a `base_model` tag on HuggingFace that trending scans could pick up. Naive-N0.5-Flash shows otherwise: swapping out MiMo-V2.5's remaining full-attention layers entirely and adding 3.25T further training tokens was enough for HuggingFace to stop treating it as a derivative of the same base model. That's a reminder that detecting new models can't rely on tag presence alone — you also have to read how the model card itself describes its lineage, because at this level of architectural change, the line between "derivative" and "new model" is genuinely blurry.

## References

- [NaiveAI technical blog: Introducing Naive-N0.5-Flash](https://naive.ai/en/research/)
- [NaiveAI/Naive-N0.5-Flash · Hugging Face](https://huggingface.co/NaiveAI/Naive-N0.5-Flash)
- [NaiveAI official X launch post (2026-09-27)](https://x.com/naiveailab/status/2104247060186951725)
- [CellCog: Naive-N0.5-Flash — NaiveAI's Open Model, Built by AI](https://cellcog.ai/blog/naive-n0-5-flash/)
- [Implicator: Naive AI $1.4 billion valuation, $400 million raise](https://www.implicator.ai/naive-ai-1-4-billion-valuation-400-million-raise/)
