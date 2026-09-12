---
title: "Model Card: Nex-N2.5-mini"
date: 2026-09-11
category: daily
type: digest
tags: [ai-agent, model-release, daily, nex-agi, model-family-nex]
lang: en
description: "Nex AGI released the open Nex-N2.5 family. Its 35B A3B mini model focuses on computer-use agents that use visual feedback to diagnose, correct, and retry their own actions."
tldr: "Nex-N2.5-mini (`nex-agi/Nex-N2.5-mini`) is a 35B MoE with about 3B active parameters, a 262,144-token context window, Apache-2.0 licensing, and a free OpenRouter tier. Nex reports large gains over N2-mini on DeepSWE and Terminal-Bench, with visual-feedback self-correction as its central design goal."
series:
  name: "AI Model Tracker"
  order: 20
glossary:
  - term: "Nex-N2.5"
    def: "Nex AGI's open agentic model family, offered in mini, Pro, and Max sizes and designed for long-running computer and browser tasks with visual-feedback correction."
---

> 🌏 [中文版](/posts/daily/2026-09-11-model-nex-agi-nex-n2-5-mini)

## Model information

| Item | Value |
|---|---|
| Model ID | `nex-agi/Nex-N2.5-mini`; OpenRouter free tier: `nex-agi/nex-n2.5-mini:free` |
| Parameters | 35B total, roughly 3B active; a Qwen3.5-35B-A3B-Base post-training derivative |
| Context window | 262,144 tokens; 235.9K maximum output |
| Price | $0.00 input and output on OpenRouter's free tier; Nex has not published standalone commercial API pricing |
| License | Apache-2.0 |
| Released | 2026-09-08 |

## Highlights

- Nex reports DeepSWE v1.1 improving from 8.0 for N2-mini to 36.1, and Terminal-Bench 2.1 improving from 60.7 to 73.4.
- The model is designed for visual-feedback self-correction: it can operate a computer or browser, inspect the result, diagnose a mismatch, and retry.
- Nex reports 82.9 on OSWorld-G, ahead of its reported Claude Opus 5 and GPT-5.6 Sol comparisons.

## Benchmark context

| Benchmark | Nex-N2.5-mini | Prior N2-mini | Reported leading competitor |
|---|---:|---:|---:|
| Terminal-Bench 2.1 | 73.4 | 60.7 | Claude Opus 5: 89.1 |
| DeepSWE v1.1 | 36.1 | 8.0 | Claude Opus 5: 73.7 |
| BrowseComp | 83.4 | 74.1 | Claude Opus 5: 90.8 |
| AutomationBench v1.0.6 | 32.3 | N/A | Claude Opus 5: 50.3 |
| SWE-Bench Pro | 43.8 | N/A | Claude Opus 5: 79.2 |

The release uses Nex AGI's own NexAU/NexCUA harness. Earlier N2-mini figures come from a mix of the project's GitHub material and third-party evaluators, so treat the table as directional rather than a controlled head-to-head comparison.

## What it means for agent builders

Nex-N2.5-mini is aimed at computer-use and browser-use loops rather than general chat. Its visual-feedback design and free tier make it a practical model for testing whether an agent can observe a result, correct an action, and retry before committing to a paid provider.

It is less suitable for high-accuracy production coding work: the reported SWE-Bench Pro result is 43.8, well below Nex's Max model and Claude Opus 5. The lack of independently published commercial API terms is also a constraint for workloads that require a production SLA.

## Comparison with the prior model

Nex's published gains are largest on longer software-engineering tasks, but the comparisons mix release-harness measurements with historical figures. Use them to form an evaluation shortlist, then run the same browser or computer-use tasks your agent must complete.

## Takeaway

The free tier and computer-use orientation make Nex-N2.5-mini useful for prototypes. Its published scores and commercial support details do not yet justify treating it as a drop-in production coding default.

## References

- [Nex-N2.5 official site](https://nex-agi.com/)
- [Nex-N2.5-mini model card on Hugging Face](https://huggingface.co/nex-agi/Nex-N2.5-mini)
- [Nex-N2.5-mini free tier on OpenRouter](https://openrouter.ai/nex-agi/nex-n2-5-mini:free)
- [Nex-N2 GitHub repository](https://github.com/nex-agi/Nex-N2)
