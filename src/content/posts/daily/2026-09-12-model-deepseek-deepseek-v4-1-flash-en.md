---
title: "Model Card｜DeepSeek-V4.1-Flash"
date: 2026-09-12
category: daily
type: digest
tags: [ai-agent, model-release, daily, deepseek, model-family-deepseek]
lang: en
description: "DeepSeek swaps architecture without bumping the generation number — a Causal Encoder-Decoder cuts active parameters even as agentic coding scores jump, and DeepSeek is routing its own V4-Pro flagship traffic to this Flash model starting Sept 14"
tldr: "DeepSeek-V4.1-Flash (API model: deepseek-flash): released 2026-09-10, 552B-parameter MoE with a Causal Encoder-Decoder architecture (only 8B active parameters for input, 16B for output), 1M-token context, MIT-licensed. Peak pricing: input $0.30 / output $1.20 per 1M tokens (off-peak halved) — cheaper than the predecessor V4-Flash. Terminal-Bench 4.0 jumps from 7.0 to 31.2, DeepSWE v1.1 (74.2) ties Claude Opus 5 (74.0). KV cache compressed to 890 bytes/token (1/4 of the predecessor, 437x less than DeepSeek-V1). DeepSeek announced that starting Sept 14, all traffic to its own V4-Pro flagship will be routed to this Flash model and billed at Flash rates."
series:
  name: "AI Model Tracker"
  order: 21
glossary:
  - term: "DeepSeek V4.1"
    def: "A new model architecture family DeepSeek introduced in September 2026; the first release, Flash, replaces the predecessor's MoE decoder with a Causal Encoder-Decoder, optimized for a smaller KV cache and stronger agentic performance"
---

> 🌏 [中文版](/posts/daily/2026-09-12-model-deepseek-deepseek-v4-1-flash)

## Model Information

| Field | Value |
|---|---|
| Model ID | `deepseek-flash` (API model name; Hugging Face repo is `deepseek-ai/DeepSeek-V4.1-Flash`) |
| Vendor | DeepSeek |
| Parameters | 552B total MoE, Causal Encoder-Decoder (20 encoder layers + 20 decoder layers); 8B active for input, 16B active for output |
| Context Window | 1,000,000 tokens |
| Input pricing (USD/1M tokens) | Peak $0.30 (cache miss) / $0.006 (cache hit); off-peak $0.15 / $0.003 (off-peak is half of peak) |
| Output pricing (USD/1M tokens) | Peak $1.20; off-peak $0.60 |
| Open source | Yes (MIT; weights and technical report published on Hugging Face) |
| Release date | 2026-09-10 (new pricing effective 04:00 UTC the same day) |
| Official announcement | [DeepSeek: Introducing DeepSeek-V4.1-Flash](https://deepseek.com/en/news/deepseek-v4-1-flash/) |
| Hugging Face | [deepseek-ai/DeepSeek-V4.1-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash) |
| Family | DeepSeek V4.x (predecessors: V4-Flash-0731, V4-Pro-0813, V4-Flash-Vision-Exp — all three are retired and now route to this model) |

## Highlights

- Architecture switches from the predecessor's MoE decoder to a Causal Encoder-Decoder: total parameters double to 552B, yet active parameters for input drop from 13B to 8B (16B for output) — the decoder's global KV cache is projected directly from the encoder's final hidden states instead of being computed layer by layer
- Terminal-Bench 4.0 (currently the hardest agentic coding evaluation) jumps from the predecessor V4-Flash-0731's 7.0 to 31.2, and DeepSWE v1.1 rises from 54.4 to 74.2 — nearly tying Claude Opus 5 (74.0) and GPT-5.6 Sol (73.0)
- KV cache compressed to 890 bytes per token — 1/4 the HBM and 1/8 the SSD storage of predecessor V4-Flash, and a 437x reduction versus DeepSeek-V1 — striking directly at cache-hit cost, usually the largest line item in agent spend
- Adds a 196B-parameter Engram conditional memory module (held separate from the backbone, reached via sparse token lookup); vision is trained natively into the backbone for the first time (rather than bolted on) — the base model scores 95.6 on DocVQA and 56.5 on MMMU-Pro

## Benchmark Results

| Benchmark | V4.1-Flash | Predecessor (V4-Flash-0731) | Best competitor |
|---|---|---|---|
| Terminal-Bench 2.1 | 90.6 | 82.7 | Claude Opus 5: 89.1 |
| Terminal-Bench 4.0 | 31.2 | 7.0 | Claude Opus 5: 51.8 |
| DeepSWE v1.1 | 74.2 | 54.4 | Claude Opus 5: 74.0 |
| GPQA Diamond (base model, no tools) | 90.9 | N/A | GPT-5.6 Sol: 94.1 |
| SimpleQA-Verified (base model, factual recall) | 42.3 | N/A | Own flagship V4-Pro: 55.2 |

⚠️ All figures above are DeepSeek's own self-reported results under its strongest agent scaffold (mini-SWE); none have been independently reproduced yet. GPQA Diamond and SimpleQA-Verified are base-model (not instruct/agent) scores; V4-Flash-0731 has no published figure for either, hence "N/A".

## Comparison with Predecessor/Competitors

The biggest jump over the predecessor is in agentic coding: Terminal-Bench 4.0 climbs from 7.0 to 31.2 — more than a 4x increase — and DeepSWE v1.1 rises from 54.4 to 74.2. This leap comes mainly from the architecture change: the Causal Encoder-Decoder lets the model read long context with only 8B active input parameters, and the KV cache compression to 1/4–1/8 cuts both cost and latency across multi-turn tool calls, rather than simply scaling up parameter count for a higher score.

Against top competitors, DeepSWE v1.1's 74.2 already ties Claude Opus 5 (74.0) and GPT-5.6 Sol (73.0), well within margin of error. But Terminal-Bench 4.0 still trails Opus 5's 51.8 by a wide margin, showing a real gap remains at the hardest tier of agentic tasks. More notably, on knowledge-heavy evaluation: SimpleQA-Verified's 42.3 clearly trails DeepSeek's own flagship V4-Pro at 55.2 — a new 552B-parameter architecture actually losing to its predecessor flagship on factual recall, which suggests this release's gains are concentrated in "doing" rather than "knowing."

Pricing strategy is the biggest business signal here: V4.1-Flash's peak cache-miss input ($0.30) and output ($1.20) are both cheaper than predecessor V4-Flash's $0.44 / $1.32, and DeepSeek announced that starting Sept 14, all online traffic to its own V4-Pro flagship will be routed to this Flash model and billed at Flash rates — effectively DeepSeek admitting its smaller model's agentic capability has surpassed its old flagship, and retiring that flagship outright. DeepSeek also unusually published a table scoring the same model across 8 different agent scaffolds: DeepSWE scores swing 8.7 points between mini-SWE (74.2) and OpenCode (65.5) — a wider spread than the 1.2-point gap between the three top models (V4.1-Flash, Opus 5, GPT-5.6 Sol). That's a methodology disclosure worth everyone's attention.

## Implications for Agent Development

If you're building agentic pipelines that need long context and frequently replay conversation history (coding agents, terminal operation, multi-turn RAG): peak cache-hit input pricing is just $0.006/1M tokens, combined with the KV cache compressed to 1/4–1/8, making it highly cost-effective for long conversations with high cache-hit rates. The MIT license also lets you self-host without vendor lock-in.

If you're comparing scores across vendors to pick a model: DeepSeek's 8-scaffold comparison table is a useful reminder — the score swing from changing agent frameworks (8.7 points) is larger than the gap between changing models (1.2 points). Fix your own scaffold first before comparing model scores, rather than copying any single leaderboard.

Not a fit: use cases needing high factual accuracy, knowledge-intensive QA, or customer service — SimpleQA-Verified clearly trails DeepSeek's own older flagship V4-Pro, so don't swap in Flash for applications that demand strong factual recall. Also not a fit for production environments wary of vendor self-reported numbers — every benchmark here is DeepSeek's own result under its strongest scaffold, with no independent reproduction yet.

## Today's Takeaway

I used to compare models by lining up benchmark scores different vendors publish and ranking them directly. But DeepSeek's own 8-scaffold comparison table breaks that assumption: running the same model through 8 different agent frameworks swings the DeepSWE score by 8.7 points — wider than the 1.2-point gap between the three top models (V4.1-Flash, Opus 5, GPT-5.6 Sol). That means most "cross-vendor model leaderboards" are actually comparing whose scaffold is stronger, not whose model is stronger — from now on, any model score comparison deserves the question "which framework was this run with?"

## References

- [DeepSeek: Introducing DeepSeek-V4.1-Flash](https://deepseek.com/en/news/deepseek-v4-1-flash/)
- [DeepSeek-V4.1-Flash Technical Report (PDF)](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/main/DeepSeek_V41_Tech_Report.pdf)
- [Hugging Face: deepseek-ai/DeepSeek-V4.1-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash)
- [Coursiv: DeepSeek V4.1 Flash Replaces V4 Pro: Pricing, Benchmarks, and What Changed Since V4 Flash](https://coursiv.io/blog/deepseek-v4-1-flash)
- [DeepSeek official X announcement](https://x.com/deepseek_ai/status/2097930608790167907)
- [Hacker News discussion: DeepSeek launching v4.1 flash cheaper and more capable than v4 pro](https://news.ycombinator.com/item?id=49624603)
