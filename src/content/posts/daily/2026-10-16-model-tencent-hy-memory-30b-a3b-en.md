---
title: "Model Card: Hy-Memory-30B-A3B"
date: 2026-10-16
category: daily
type: digest
tags: [ai-agent, model-release, daily, tencent, model-family-hunyuan]
lang: en
description: "Tencent Hunyuan open-sources a dedicated memory-writer model — the headline claim is beating Claude Opus 5, but over 80% of the margin comes from a single held-out framework"
tldr: "Hy-Memory-30B-A3B: open-sourced 2026-10-15 under Apache-2.0, a 30B-total / ~3B-active MoE with a 262,144-token context window, trained specifically to run the \"write\" path inside agent memory frameworks (Mem0, MemOS, Hy-Memory). Two-stage training — On-Policy Distillation plus Attributed Memory RL — raised the cross-harness macro average from 47.66 (its own base model) to 55.49, which Tencent frames as beating Claude Opus 5's 54.62. Broken down, though, the Mem0/Hy-Memory/MemOS margins are all under 0.6 points — essentially statistical noise — and the real gap comes from the single held-out EverMemOS harness (56.89 vs. 54.04, a 2.85-point difference), which accounts for over 80% of the overall lead. There's no quantized build and no hosted API yet, and the companion MemHub desktop app's install path isn't working end to end."
series:
  name: "AI Model Tracker"
  order: 49
glossary:
  - term: "Memory Writer Model"
    def: "A model trained specifically to run the \"write path\" of an agent's external memory system — deciding what to retain, how precisely to phrase it, and how new evidence should update the existing memory bank — in place of using a general-purpose LLM for that job"
  - term: "EverMemOS"
    def: "A memory framework deliberately held out of Hy-Memory-30B-A3B's training data, used to test whether the model's learned write policy transfers to a framework it has never seen"
---

> 🌏 [中文版](/posts/daily/2026-10-16-model-tencent-hy-memory-30b-a3b)

## Model Info

| Item | Value |
|---|---|
| Model ID | `tencent/Hy-Memory-30B-A3B` |
| Vendor | Tencent (Tencent Hunyuan) |
| Parameters | 30B total / ~3B active (MoE, 48 layers — 1 dense + 47 sparse — 128 experts with top-8 routing plus 1 shared expert) |
| Context Window | 262,144 tokens |
| Input Pricing (USD/1M tokens) | No official API; open weights only, self-hosted (not yet listed on any inference platform) |
| Output Pricing (USD/1M tokens) | Same as above |
| Open Source | Yes (Apache-2.0) |
| Release Date | 2026-10-15 |
| Official Announcement | [GitHub: Tencent-Hunyuan/Hy-Memory](https://github.com/Tencent-Hunyuan/Hy-Memory) |
| Hugging Face | [tencent/Hy-Memory-30B-A3B](https://huggingface.co/tencent/Hy-Memory-30B-A3B) |
| Family | Hunyuan (Hy) — fine-tuned from Hy3-A3B Base, the dedicated model inside the Hy Memory 2.0 bundle (framework + model + the MemHub desktop app) |

## Key Capabilities

- Trained specifically to run the "write path" of an agent's external memory framework; it can directly replace the general-purpose LLM that Mem0, MemOS, and Hy-Memory normally use for that job, with no change to the retrieval architecture
- Two-stage training: Memory On-Policy Distillation (a frozen teacher provides dense supervision on the student's memory-state chains) followed by Attributed Memory Reinforcement Learning (chunk-level credit assignment across an entire memory bank)
- A cross-harness macro average of 55.49 across four memory frameworks (Mem0, Hy-Memory, MemOS, EverMemOS) — 7.8 points above the pre-training base model Hy3-A3B Base's 47.66, which is the real, uncontested gain from this training approach
- Ships with an open-source Hy Memory 2.0 framework (PyPI `hy-memory==2.0.1`, Apache-2.0) and a desktop app, MemHub, that can import history from ten coding tools including Claude Code, Cursor, and Codex into one shared memory store

## Benchmarks

| Benchmark (cross-harness macro average) | Hy-Memory-30B-A3B | Predecessor (Hy3-A3B Base, pre-training) | Strongest Competitor (Claude Opus 5) |
|---|---|---|---|
| Cross-harness macro average | **55.49** | 47.66 | 54.62 |
| Mem0 harness | 54.02 | 40.20 | 53.43 |
| Hy-Memory harness | 60.55 | 50.39 | 60.53 |
| MemOS harness | 50.51 | 49.05 | 50.50 |
| EverMemOS harness (held out — never seen during training) | **56.89** | 50.98 | 54.04 |

⚠️ All figures above are Tencent's own, measured on a fixed 20% subsample of each benchmark; there is no independent third-party reproduction yet. The margins over Claude Opus 5 on Mem0, Hy-Memory, and MemOS are all under 0.6 points — close to statistical noise. Of the 0.87-point overall lead in the macro average, roughly 80% (2.85 of the total 3.47-point sum of gaps) comes entirely from the single held-out EverMemOS harness.

## Compared to the Predecessor / Competitors

Against its own pre-training base model Hy3-A3B Base, the two-stage training (On-Policy Distillation plus Attributed Memory RL) lifted the cross-harness macro average from 47.66 to 55.49 — a 7.8-point gain that is the real, uncontested payoff of fine-tuning specifically for the memory-writing task, and the least disputable number in this whole report.

Against Claude Opus 5, the headline "beats" claim splits into two stories. On the three in-training harnesses — Mem0 (54.02 vs. 53.43), Hy-Memory (60.55 vs. 60.53), and MemOS (50.51 vs. 50.50) — the margins are all under 0.6 points, essentially statistical noise. The real gap comes from EverMemOS, a framework deliberately held out of training entirely (56.89 vs. 54.04, a 2.85-point difference) — the only test that actually verifies whether the learned write policy transfers to a framework the model has never seen, and the most persuasive single number behind the "beats Claude Opus 5" claim. But it's still just one of four sub-scores.

On pricing, Hy-Memory-30B-A3B has no official API — you have to self-host. Only a 60.1GB BF16 checkpoint has been released (no GGUF or FP8 quantization), so you need your own GPU capacity, and no inference platform has it listed yet. The companion Hy Memory 2.0 framework can already be installed with `pip install hy-memory==2.0.1`, but the MemHub desktop app's npm package hasn't been published, so Tencent's own documented install path doesn't fully work yet.

## What This Means for Agent Development

If your agent already uses Mem0 or MemOS for long-term memory: Hy-Memory-30B-A3B can directly swap in for the general-purpose LLM handling the write path, with no changes needed to your retrieval architecture, and it's Apache-2.0 licensed with no commercial-use concerns. This is the part of the release you can actually use today.

If you're deciding whether to adopt a dedicated memory-writer model instead of continuing to use a general-purpose LLM for this job: the 2.85-point held-out advantage on EverMemOS is currently the only piece of evidence supporting "a specialized memory writer beats a general-purpose model for this task," and it's worth weighing — but keep in mind the comparison point is Tencent's own prior-generation base model, Hy3-A3B Base, not a representative sample of general-purpose LLMs on the market.

If you plan to call memory-writing at production volume: writing memory is a high-frequency, low-output task that runs on every conversational turn, and running it on a 30B/3B-active model with `no_think` mode should, in theory, be far cheaper than calling a frontier model every time — but no platform hosts it yet, and nobody has published a per-write token cost, so you'll need to measure that yourself before estimating ROI.

Not a fit: anyone wanting to try it with one click. There's no quantized build (no GGUF, no FP8), no hosted API, and the companion MemHub desktop app's install path isn't working end to end — using it today means installing and running the model yourself.

## Today's Takeaway

Headlines like "beats Claude Opus 5" often only win on one dimension when you break them apart. Hy-Memory-30B-A3B's cross-harness average lead comes over 80% from a single held-out framework, EverMemOS, while the margins on the three in-training harnesses are all under 0.6 points — close to statistical noise. When evaluating a "beats X" claim like this, check which sub-score is actually driving the margin instead of looking at the average alone.

## References

- [GitHub: Tencent-Hunyuan/Hy-Memory](https://github.com/Tencent-Hunyuan/Hy-Memory)
- [Hugging Face: tencent/Hy-Memory-30B-A3B model card](https://huggingface.co/tencent/Hy-Memory-30B-A3B)
- [arXiv 2610.22196: Hy-Memory-30B-A3B technical report](https://arxiv.org/pdf/2610.22196)
- [AlphaSignal: Tencent's Hy Memory 2.0 Beats Claude Opus 5 at Remembering What Agents Need](https://alphasignal.ai/news/tencent-s-hy-memory-2-0-beats-claude-opus-5-at-remembering-what-agents-need)
- [OrcaRouter: Hy Memory 2.0 Is Out — Tencent Open-Sourced a Memory Writer, a Framework and a Mac App in One Drop](https://www.orcarouter.ai/blog/hy-memory-2-0-open-source-stack)
