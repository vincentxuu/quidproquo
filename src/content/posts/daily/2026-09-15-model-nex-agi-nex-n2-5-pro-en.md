---
title: "Model Card: Nex-N2.5-Pro"
date: 2026-09-15
category: daily
type: digest
tags: [ai-agent, model-release, daily, nex-agi, model-family-nex]
lang: en
description: "Nex AGI's mid-size Nex-N2.5-Pro keeps the 397B-A17B MoE footprint of its predecessor but posts the highest OSWorld-G grounding score in its own comparison table, ahead of Claude Opus 5 and GPT-5.6 Sol, and runs on a single 8xH100 node."
tldr: "Nex-N2.5-Pro (`nex-agi/Nex-N2.5-Pro`) keeps the prior Nex-N2-Pro's 397B-total, ~17B-active MoE footprint (built on Qwen3.5-397B-A17B), a 262,144-token context window, Apache-2.0 licensing, and a free OpenRouter tier. Nex reports Terminal-Bench 2.1 rising from 75.3 for N2-Pro to 82.7, and an OSWorld-G grounding score of 87.4 that tops every model in its own comparison table, including Claude Opus 5's 76.8."
series:
  name: "AI Model Tracker"
  order: 114
glossary:
  - term: "Nex-N2.5"
    def: "Nex AGI's open agentic model family, offered in mini, Pro, and Max sizes and designed for long-running computer and browser tasks with visual-feedback correction."
---

> 🌏 [中文版](/posts/daily/2026-09-15-model-nex-agi-nex-n2-5-pro)

## Model information

| Item | Value |
|---|---|
| Model ID | `nex-agi/Nex-N2.5-Pro`; OpenRouter free tier: `nex-agi/nex-n2.5-pro:free` |
| Parameters | Not restated in the N2.5-Pro model card; Nex describes it as continuing Nex-N2's multimodal foundation, which was built on `Qwen3.5-397B-A17B` (397B total, ~17B active MoE) |
| Context window | 262,144 tokens; roughly 236K maximum output |
| Price | $0.00 input and output on OpenRouter's free tier; Nex has not published standalone commercial API pricing |
| License | Apache-2.0 |
| Released | 2026-09-08 |

## Highlights

- Nex reports Terminal-Bench 2.1 improving from 75.3 for N2-Pro to 82.7, and SWE-Bench Pro from 58.8 to 61.2.
- OSWorld-G, a computer-use grounding benchmark, comes in at 87.4 — the top score in Nex's own comparison table, ahead of Claude Opus 5 (76.8) and GPT-5.6 Sol (77.7).
- Like the mini model, Pro is built around visual-feedback self-correction: it can operate a computer or browser, run and test code, and retry when the observed result does not match the intended one.
- Deployment stays lighter than the family's Max model: a single 8xH100 node is enough, versus the 2-node, 16xH200 cluster Nex documents for Max.

## Benchmark context

| Benchmark | Nex-N2.5-Pro | Prior N2-Pro | Reported leading competitor |
|---|---:|---:|---:|
| Terminal-Bench 2.1 | 82.7 | 75.3 | Claude Opus 5: 89.1 |
| SWE-Bench Pro | 61.2 | 58.8 | Claude Opus 5: 79.2 |
| BrowseComp | 89.7 | 83.7 | Claude Opus 5: 90.8 |
| OSWorld-G | 87.4 | N/A (not evaluated for N2-Pro) | Qwen3.8-Max: 84.9 (next highest) |
| DeepSWE (v1.1) | 55.8 | 33.6 (earlier DeepSWE version) | Claude Opus 5: 73.7 |

The release uses Nex AGI's own NexAU/NexCUA harness (`temperature=0.7`, `top_p=0.95`, `top_k=40`), measured on launch day with no independent third-party reproduction yet. Prior N2-Pro figures come from Nex's own GitHub repository; the DeepSWE benchmark version differs between the two rows, so treat the comparison as directional rather than a controlled head-to-head.

## Comparison with the prior model and competitors

The largest gains over N2-Pro land on coding and agentic tasks together — Terminal-Bench climbs 7.4 points and BrowseComp climbs 6.0 — rather than on a single benchmark. Notably, Nex did not restate a parameter count or mention a new base checkpoint for this release, which suggests the gains come mainly from post-training data and method rather than a larger model.

Against closed frontier models, Nex-N2.5-Pro still trails Claude Opus 5 on most coding and agentic benchmarks (SWE-Bench Pro 61.2 vs. 79.2; Terminal-Bench 82.7 vs. 89.1), but it leads every listed competitor on OSWorld-G — the same pattern seen in the mini model, where Nex concentrates training effort on visual grounding and self-correction rather than chasing parity across every benchmark.

On pricing, Pro follows the same open-weight-plus-free-tier approach as mini, in contrast to Claude Opus 5 and GPT-5.6 Sol, which require a paid API key to test. The difference is deployment cost: Pro needs a full 8xH100 node rather than mini's 2xH100, so the free tier functions more as a low-friction trial than a guarantee that self-hosting is cheap.

## What it means for agent builders

Nex-N2.5-Pro fills the gap between mini and Max: more capable than the 35B-A3B mini model, without requiring Max's multi-node cluster, on hardware a single 8xH100 machine can serve.

- If you're building a computer-use or browser-use agent that needs higher grounding accuracy: 87.4 on OSWorld-G is the top score in Nex's own table and an improvement over mini's 82.9, useful when you need better click/action targeting but don't need Max's text-only reasoning depth.
- If your team can operate a single 8xH100 node and wants to avoid lock-in to one closed API: the Apache-2.0 license and the same sglang-fork deployment scripts used for N2-Pro make this an easy upgrade path for teams already running Nex-N2.
- It is less suitable for production coding work that demands top-tier accuracy: SWE-Bench Pro sits at 61.2, still about 18 points behind Claude Opus 5. There is also no published commercial API pricing beyond the OpenRouter free tier, which limits it for workloads needing a production SLA.

## Takeaway

Nex-N2.5-Pro didn't get a new base model or a bigger parameter count, yet it posted double-digit percentage-point gains on Terminal-Bench and BrowseComp over its predecessor. That's a reminder that post-training method and data coverage can move agentic benchmarks as much as raw scale does — especially on capabilities like this one, where training-environment coverage matters more than parameter count.

## References

- [Nex-N2.5 official site](https://nex-agi.com/)
- [Nex-N2.5-Pro model card on Hugging Face](https://huggingface.co/nex-agi/Nex-N2.5-Pro)
- [Nex-N2.5-Pro free tier on OpenRouter](https://openrouter.ai/nex-agi/nex-n2.5-pro:free)
- [Nex-N2.5-Pro on Puter Developer (specs and pricing)](https://developer.puter.com/ai/nex-agi/nex-n2.5-pro/)
- [Nex-N2 GitHub repository (prior-generation benchmarks and base model spec)](https://github.com/nex-agi/Nex-N2)
- [Nex-N2.5: Nex-AGI's Mini, Pro, and Trillion-Param Max Agentic Models — MindStudio](https://www.mindstudio.ai/blog/nex-n2-5-agentic-model-family)
