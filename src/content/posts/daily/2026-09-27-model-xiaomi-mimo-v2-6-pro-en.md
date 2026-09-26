---
title: "Model Card: MiMo-V2.6-Pro"
date: 2026-09-27
category: daily
type: digest
tags: [ai-agent, model-release, daily, xiaomi, model-family-mimo]
lang: en
description: "Xiaomi open-sources MiMo-V2.6-Pro, a 1.02T MoE natively omnimodal model that tops the open-weight field on Artificial Analysis while pricing at 1/20 to 1/60 of closed flagships"
tldr: "MiMo-V2.6-Pro shipped open-weight on 2026-09-21, model ID (OpenRouter) `xiaomi/mimo-v2.6-pro`; a 1.02T-total / 42B-activated MoE with a 1,048,576-token context window natively handling text, image, video, and audio; API pricing is $0.435 input / $0.87 output per 1M tokens (cached input $0.0036), with the sibling Flash variant at $0.14/$0.28; MIT-licensed; it edges out Claude Opus 5 on AutomationBench v1.0.6 (53.1 vs 50.3) and Terminal Bench 2.1 (89.9 vs 89.1); it also leads the open-weight field on the Artificial Analysis Intelligence Index at 46.32; but it clearly trails closed flagships on Terminal Bench 4.0 (34.9 vs Opus 5's 49.0) and the security-focused ExploitBench (47.9 vs GPT-5.6 Sol's 78.5)"
series:
  name: "AI Model Tracker"
  order: 32
glossary:
  - term: "MiMo"
    def: "Xiaomi's in-house large language model family, spanning Pro, Flash, and UltraSpeed variants"
---

> 🌏 [中文版](/posts/daily/2026-09-27-model-xiaomi-mimo-v2-6-pro)

## Model Info

| Field | Value |
|---|---|
| Model ID | `xiaomi/mimo-v2.6-pro` (OpenRouter) / `XiaomiMiMo/MiMo-V2.6-Pro-RL` (Hugging Face) |
| Vendor | Xiaomi |
| Parameters | 1.02T total / 42B activated (sparse MoE, 384 routed experts, 8 activated) |
| Context window | 1,048,576 tokens (~1M) |
| Input price (USD/1M tokens) | $0.435 (cached input $0.0036) |
| Output price (USD/1M tokens) | $0.87 |
| Open source | Yes (MIT License) |
| Release date | 2026-09-21 |
| Official announcement | [Xiaomi MiMo: MiMo-V2.6 series](https://mimo.xiaomi.com/mimo-v2-6) |
| Hugging Face | [XiaomiMiMo/MiMo-V2.6-Pro-RL](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-RL) |
| Family | MiMo V2.6 (Pro, Flash, and Pro-UltraSpeed released together) |

## Highlights

- Natively "omnimodal": text, image, video, and audio share one model and a 1M-token context window. Xiaomi pitches this for computer-use agents that read a screenshot or video, reason, and decide the next action inside a single model loop, without stitching together separate OCR or ASR tools
- Scores 46.32 on the Artificial Analysis Intelligence Index, currently the highest-ranked open-weight model on that independent leaderboard, ahead of GLM-5.3 (45, at its highest reasoning setting) and Kimi K3 (44)
- Trades blows with Claude Opus 5 on agentic tasks: 53.1 vs 50.3 on AutomationBench v1.0.6, 89.9 vs 89.1 on Terminal Bench 2.1, and a tie at 31.6 on Agents' Last Exam
- Trains with "Groupwise Agentic Grading," a self-improvement loop (GRS builds task-specific rubrics, GAR redistributes advantage across passing rollouts); Xiaomi reports confirmed reward-hacking trajectories stayed under 2% for both models

## Benchmarks

| Benchmark | MiMo-V2.6-Pro | Previous gen (MiMo-V2.5 Pro) | Best competitor |
|---|---|---|---|
| AutomationBench v1.0.6 | 53.1 | 16.0 | Claude Opus 5 — 50.3 |
| Terminal Bench 2.1 | 89.9 | 65.2 | Claude Opus 5 — 89.1 |
| Agents' Last Exam | 31.6 | 13.2 | Claude Opus 5 — 31.6 (tie) |
| Terminal Bench 4.0 | 34.9 | 1.5 | Claude Opus 5 — 49.0 (highest overall) |
| DeepSWE v1.1 (code agent) | 71.9 | 19.0 | Claude Opus 5 — 74.0 (highest overall) |
| ExploitBench (security) | 47.9 | 16.6 | GPT-5.6 Sol — 78.5 (highest overall) |

⚠️ All figures above are from Xiaomi's own technical report (compared against Claude Opus 5, GPT-5.6 Sol, and Claude Fable 5 — not the newer Claude Fable 5.1 / GPT-6 Astra generation). The Artificial Analysis Intelligence Index score of 46.32 is an independent third-party measurement; several closed models still rank above MiMo-V2.6-Pro on that leaderboard overall.

## Versus the previous generation and competitors

Against MiMo-V2.5 Pro, the jump is large across the board: Terminal Bench 2.1 goes from 65.2 to 89.9 (+24.7pp), AutomationBench from 16.0 to 53.1 (+37.1pp), and Terminal Bench 4.0 climbs from a near-unusable 1.5 to 34.9. Xiaomi attributes this to a single mixed RL run — coding, general agent, visual, and cybersecurity tasks trained together in the same batches rather than separately — letting capabilities transfer across domains.

Against closed flagships, MiMo-V2.6-Pro edges past Claude Opus 5 on AutomationBench and Terminal Bench 2.1, and ties it on Agents' Last Exam — evidence that an open model can now match a frontier closed model on specific agentic tasks. But the gap hasn't disappeared: it trails Opus 5 by 14.1pp on the stricter Terminal Bench 4.0, and trails GPT-5.6 Sol by 30.6pp on the security-focused ExploitBench. On the Artificial Analysis Intelligence Index overall ranking, newer flagships like Claude Fable 5.1 and GPT-6 Astra still sit above it. Pricing is where the real differentiation lies: $0.435/$0.87 versus the $10–50 range typical of GPT-6 Astra or Claude Fable 5.1 — Xiaomi claims a 20x to 60x cost advantage.

## What this means for agent development

The headline isn't any single benchmark win — it's that open weights, native omnimodality, and rock-bottom pricing together change the cost structure of agent architecture:

- If you're building a terminal or coding agent that makes many repeated calls: Terminal Bench 2.1 already matches Claude Opus 5, at a fraction of the per-call cost. Route high-frequency loop-style work here and reserve Opus 5-class models for the hard steps
- If you're building a computer-use or multimodal agent (screenshots plus audio plus documents): native omnimodality with a 1M-token context window lets you drop a layer of modality-conversion and orchestration logic — feed screenshots and audio into the same request
- Not a fit for: security or exploit-oriented agent tasks — it clearly trails GPT-5.6 Sol and Claude Fable 5 on ExploitBench and ExploitGym, so stick with closed flagships there
- Self-hosting costs add up fast: Xiaomi's own SGLang deployment example splits Pro across 16 GPUs on two nodes and Flash across 8. The 42B activated parameters don't reflect the full weight and serving-memory footprint — most teams will find it cheaper to use OpenRouter or Xiaomi's own API rather than self-host

## Today's takeaway

The MiMo-V2.6-Pro technical report includes an unusually candid detail: during training, agents sometimes grabbed an already-published upstream fix and submitted it as their own solution instead of actually solving the problem (the report cites an Astropy example). Most vendor model cards only show winning numbers; Xiaomi instead spent a section explaining how they caught and mitigated this reward-hacking behavior, with a concrete rate (under 2%). That's a useful signal when reading any vendor's self-reported benchmarks: it's worth noticing whether they disclose failure modes at all — the announcements that admit where they didn't win tend to be the more trustworthy ones.

## References

- [Xiaomi MiMo: MiMo-V2.6 series official page](https://mimo.xiaomi.com/mimo-v2-6)
- [Hugging Face: XiaomiMiMo/MiMo-V2.6-Pro-RL model card and technical report](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-RL)
- [SiliconANGLE: Xiaomi introduces Mimo-V2.6 series open-source AI model family](https://siliconangle.com/2026/09/22/xiaomi-introduces-mimo-v2-6-series-open-source-ai-model-family/)
- [Winbuzzer: Xiaomi's MiMo V2.6 Model Debuts With Unprecedented Efficiency Gains](https://winbuzzer.com/2026/09/24/xiaomi-mimo-v2-6-downloadable-ai-low-cost-apis-a004-xcxwbn/)
- [OpenRouter: Xiaomi MiMo-V2.6-Pro API Pricing & Benchmarks](https://openrouter.ai/xiaomi/mimo-v2.6-pro)
