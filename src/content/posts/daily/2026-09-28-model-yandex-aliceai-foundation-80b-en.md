---
title: "Model Card: AliceAI-Foundation-80B-A3B-Base"
date: 2026-09-28
category: daily
type: digest
tags: [ai-agent, model-release, daily, yandex, model-family-alice]
lang: en
description: "Yandex open-sources its first from-scratch 80B MoE base model — a KDA linear-attention hybrid architecture with 256K context that dominates on Russian factual knowledge"
tldr: "AliceAI-Foundation-80B-A3B-Base: released by Yandex on 2026-09-21, trained fully from scratch (not a Qwen/Llama fine-tune); 80B total / 3B active MoE parameters, 262,144-token context window; Apache-2.0, no official hosted API pricing yet; scores 91.1 on MATH-500, beating similarly-sized Qwen3.5-35B-A3B-Base and the much larger DeepSeek-V4-Flash-Base (284B-A13B); leads every comparison on the Russian-language WikiWebFacts benchmark at 86.5; it's a raw base model with no SFT/RL alignment, so it can't be used as an agent out of the box"
series:
  name: "AI Model Tracker"
  order: 33
glossary:
  - term: "Alice AI"
    def: "Yandex's AI assistant product; AliceAI-Foundation is the experimental base model behind its planned unified reasoning model"
---

> 🌏 [中文版](/posts/daily/2026-09-28-model-yandex-aliceai-foundation-80b)

## Model Info

| Item | Value |
|---|---|
| Model ID | `yandex/AliceAI-Foundation-80B-A3B-Base` |
| Vendor | Yandex |
| Parameters | 80B total / 3B active (MoE, 512 routed experts + 1 shared expert, top-10 routing) |
| Context Window | 262,144 tokens (~256K) |
| Input Pricing (USD/1M tokens) | Not available (fully open-source base model; no official hosted API, no third-party inference provider yet) |
| Output Pricing (USD/1M tokens) | Not available (same as above) |
| Open Source | Yes (Apache-2.0) |
| Release Date | 2026-09-21 |
| Official Announcement | [Yandex Investor Relations](https://ir.yandex/press-releases?id=2026-09-21&year=2026) |
| HuggingFace | [yandex/AliceAI-Foundation-80B-A3B-Base](https://huggingface.co/yandex/AliceAI-Foundation-80B-A3B-Base) |
| Family | Alice AI (Yandex's assistant model family; this release is an experimental step toward a future unified reasoning model) |

## Highlights

- Trained entirely from scratch — not a fine-tune of Qwen or Llama. The 48-layer network repeats a 4-layer pattern (three KDA linear-attention blocks followed by one Gated Attention block), with a 512-expert MoE attached to every layer; only 3.75% of parameters activate per token, sharply cutting inference compute
- Strong math and competition reasoning: MATH-500 hits 91.1, ahead of the similarly-sized Qwen3.5-35B-A3B-Base (81.9) and the 3.5x-larger DeepSeek-V4-Flash-Base (284B-A13B, 80.7); AIME 2026 pass@32 ties Qwen3.5-35B-A3B-Base for first place at 96.7
- Dominant on Russian factual knowledge: scores 86.5 on Yandex's own WikiWebFacts benchmark, 24.1pp ahead of Qwen3.5-35B-A3B-Base's 62.4, and matches Yandex's own previous closed model Alice AI LLM despite that model having 3x the parameters and 7x the active parameters
- On the engineering side, Yandex rebuilt its training optimizer so GPU-to-GPU data transfer overlaps with computation, roughly doubling training step speed; a cascade of classifiers now pre-filters documents before the expensive scoring model runs, cutting what would have been 200,000+ GPU-hours of compute by more than 10x while keeping about 95% of useful documents

## Benchmark Results

| Benchmark | AliceAI-Foundation-80B-A3B-Base | Previous Gen | Best Competitor |
|---|---|---|---|
| MATH-500 (5-shot) | 91.1 | N/A (Yandex's first from-scratch open base model) | Qwen3.5-35B-A3B-Base 81.9 |
| AIME 2026 pass@32 | 96.7 | N/A | Qwen3.5-35B-A3B-Base 96.7 (tied) |
| WikiWebFacts (Russian factual knowledge, 5-shot) | 86.5 | Alice AI LLM (Yandex's previous closed model, comparable score despite 3x the parameters and 7x the active parameters) | DeepSeek-V4-Flash-Base 83.2 |
| LiveCodeBench v5-6 CoT 1-shot pass@1 | 50.5 | N/A | Qwen3.5-35B-A3B-Base 50.4 |
| CodeForces C++ pass@8 | 68.9 | N/A | Qwen3.5-35B-A3B-Base 73.7 (highest overall) |

⚠️ All figures above are Yandex's own measurements on an internal evaluation setup (vLLM, t=0 or t=1) and await independent reproduction. WikiWebFacts, HardMultiQA, CultCat, and the EduBench series are Yandex's own Russian-language benchmarks, released publicly with full evaluation protocols so others can reproduce them.

## Comparison with Previous Gen and Competitors

This is Yandex's first fully from-scratch, publicly released open base model — not a fine-tune built on top of Qwen or Llama. The training corpus, architecture, and hyperparameters were all designed from the ground up. Yandex positions it as an experimental step toward a future unified reasoning model that will power Alice AI's agentic capabilities, letting users delegate specific actions to the assistant.

Against Qwen3.5-35B-A3B-Base, which has a comparable number of active parameters, the two trade wins: AliceAI leads MATH-500 by 9.2pp and ties on AIME 2026, but trails by 4.8pp on CodeForces C++ competitive programming. The real differentiator is Russian-language and domain-expert knowledge — WikiWebFacts, EduBench History/Literature, and the law and medicine tracks of ExpertFactsQA all go to AliceAI, often by more than 20pp, beating even DeepSeek-V4-Flash-Base despite that model having several times the parameters and active parameters.

There's no real basis for a pricing comparison: AliceAI ships fully open under Apache-2.0 with no official hosted API, so running it means self-hosting via vLLM or Transformers (the full BF16 checkpoint is about 163GB). That's a different approach from most closed-source flagships, which typically pair a release with API pricing on day one — a sign that Yandex's current goal is validating the architecture and training methodology rather than chasing market share.

## What This Means for Agent Development

A MoE architecture that mixes linear attention (KDA) with standard attention while keeping active parameters down to 3.75% is a useful reference point for the cost/context tradeoffs in agent architecture design.

- If you're experimenting with agent inference architectures: this is one of the few publicly released large models that interleaves linear attention (KDA) with standard Gated Attention layers on top of an extremely fine-grained 512-expert MoE — its cost structure, pairing a 256K context window with only 3B active parameters, is worth studying
- If your product targets Russian-speaking or multilingual markets: this is currently one of the strongest open models for Russian factual and domain-expert knowledge (law, medicine, education), and Yandex has released two Russian-language benchmarks, WikiWebFacts and HardMultiQA, so you can verify that yourself
- Not a fit if: this is a raw pretrained base model with no instruction tuning or RL alignment, so it can't be used directly as a chatbot or for agent action decisions — you'll need to do your own SFT/RL. There's also no official hosted API yet, meaning you'll need to self-host a vLLM deployment (a 163GB BF16 checkpoint), which is not a low deployment bar

## Today's Takeaway

It's easy to assume that any open base model competitive with much larger models is a fine-tune built on Qwen or Llama. AliceAI-Foundation is a counterexample: a search-engine company designed a hybrid attention architecture from scratch, without an obviously overwhelming data advantage, and still beat derivative models several times its size on math reasoning and domain-specific knowledge. That suggests the "base model moat" comes more from training methodology and data-curation precision than from raw parameter count alone.

## References

- [Yandex Investor Relations: Yandex Open-Sources New AI Model Trained from Scratch](https://ir.yandex/press-releases?id=2026-09-21&year=2026)
- [HuggingFace: yandex/AliceAI-Foundation-80B-A3B-Base](https://huggingface.co/yandex/AliceAI-Foundation-80B-A3B-Base)
- [AlphaSignal: Yandex Drops AliceAI Foundation 80B Open Source Model That Beats Rivals on Math](https://alphasignal.ai/news/yandex-drops-aliceai-foundation-80b-open-source-model-that-beats-rivals-on-math)
- [Yandex Medium technical report: AliceAI-Foundation-80B-A3B-Base Release](https://medium.com/yandex/aliceai-foundation-80b-a3b-base-release-what-we-learned-training-a-new-open-weight-model-from-9bb2490903f3)
