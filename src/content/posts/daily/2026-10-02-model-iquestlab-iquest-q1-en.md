---
title: "Model Card: IQuest-Q1"
date: 2026-10-02
category: daily
type: digest
tags: [ai-agent, model-release, daily, iquestlab, model-family-iquest]
lang: en
description: "New entrant IQuest open-sources a 320B MoE model, IQuest-Q1 — 15B active parameters built for agentic coding, 84.5% on CyberGym (second only to DeepSeek-V4.1-Flash), and a 512K context window that drops into Claude Code or Codex"
tldr: "IQuest-Q1 (`IQuestLab/IQuest-Q1`): open-sourced 2026-09-28, 320B total / 15B active parameters (MoE, 256 experts with 8 active), 524,288-token context window; open weights, self-hosted, no official API pricing; 84.5% on CyberGym (real-world CVE remediation, second only to DeepSeek-V4.1-Flash's 88.1%), 83.2% on Terminal-Bench 2.1, 64.6% on DeepSWE v1.1, 63.0% on NL2Repo; drops into Claude Code or Codex CLI with just an environment-variable swap; the releasing lab, IQuest, had no prior public model track record and shipped weights, inference code, and training methodology together on its first release"
series:
  name: "AI Model Tracker"
  order: 37
glossary:
  - term: "IQuest"
    def: "A newly surfaced AI lab whose first release is IQuest-Q1, a MoE model built for agentic coding"
---

> 🌏 [中文版](/posts/daily/2026-10-02-model-iquestlab-iquest-q1)

## Model Details

| Item | Value |
|---|---|
| Model ID | `IQuestLab/IQuest-Q1` (open weights, no hosted API — requires self-deployment) |
| Vendor | IQuest |
| Parameters | 320B total / 15B active (MoE, 256 experts, 8 active) |
| Context Window | 524,288 tokens |
| Input Pricing (USD/1M tokens) | No official API — self-hosted (open weights) |
| Output Pricing (USD/1M tokens) | No official API — self-hosted (open weights) |
| Open Source | Yes (Modified MIT License; commercial use must prominently display "IQuest-Q1" in the product UI) |
| Release Date | 2026-09-28 |
| Official Announcement | [IQuest-Q1 Technical Blog](https://iquestlab.github.io/) |
| HuggingFace | [IQuestLab/IQuest-Q1](https://huggingface.co/IQuestLab/IQuest-Q1) |
| Family | IQuest-Q series (first release) |

## Key Capabilities

- 320B total parameters with only 15B active (8 of 256 experts routed per token), scoring 84.5% on CyberGym (real-world CVE remediation) — second only to DeepSeek-V4.1-Flash's 88.1%, and ahead of GLM-5.3, DeepSeek-V4-Pro, and Hy4-preview
- A 524,288-token context window with native support for Claude Code and Codex CLI — swapping models only needs an environment variable change (e.g. `ANTHROPIC_MODEL="IQuest-Q1[1m]"`); the `[1m]` is just a client-side label, the actual context ceiling stays at 512K. It's positioned as a self-hosted alternative to the two mainstream coding-agent tools
- At inference, a single recursive MTP (multi-token prediction) layer runs 8 times paired with EAGLE speculative decoding, keeping latency down despite the 15B active-parameter budget
- The training and R&D pipeline lets the model itself take part in capability diagnosis, training-plan design, and parts of experiment execution, with humans reviewing only at key checkpoints — research direction changes, high-cost experiments, version adoption. IQuest calls this the model "taking part in its own development"

## Benchmark Results

| Benchmark | Score | Predecessor | Best Competitor |
|---|---|---|---|
| CyberGym (real-world CVE remediation) | 84.5% | First release, no predecessor | DeepSeek-V4.1-Flash 88.1% |
| Terminal-Bench 2.1 (terminal operation) | 83.2% | First release, no predecessor | Claude Opus 5 89.1% |
| DeepSWE v1.1 (long-horizon software engineering) | 64.6% | First release, no predecessor | DeepSeek-V4.1-Flash 74.2% |
| NL2Repo (repo-level code generation) | 63.0% | First release, no predecessor | Claude Opus 5 75.3% |
| JobBench (office-work tasks) | 55.7% | First release, no predecessor | Claude Opus 5 65.7% |

⚠️ All figures are IQuest's own self-reported benchmarks (harness: mini-SWE-agent for DeepSWE v1.1, Claude Code `2.1.140` / Codex `0.142` for the rest; a 6-hour cap for CyberGym and an 8-hour cap for Terminal-Bench 2.1), with no independent third-party reproduction yet.

## Versus Predecessor / Competitors

IQuest-Q1 is IQuest's first public model, so there's no predecessor to compare against — it can only be placed on the existing board of open-weight agentic-coding models. At 15B active parameters, it sits on the lighter end of its generation — DeepSeek-V4.1-Flash, GLM-5.3, and Hy4-preview are all larger or similarly sized open models — yet IQuest-Q1 lands near the top of the pack on CyberGym at 84.5% (just behind DeepSeek-V4.1-Flash's 88.1%), and its 83.2% on Terminal-Bench 2.1 trails Hy4-preview's 85.4% closely. A smaller active-parameter budget doesn't appear to cost it much task execution capability.

Against the strongest closed model on the board, Claude Opus 5, the gap is still clear: 12.3 points behind on NL2Repo, 10 points behind on JobBench, and 5.9 points behind on Terminal-Bench 2.1. In other words, IQuest-Q1's position is "solid upper-mid-tier among open-weight models of its size," not a challenge to the closed-model ceiling.

What stands out is the team itself: IQuest had no prior public model track record, yet its first release shipped weights, inference code, and training methodology (MOPD, Multi-Teacher On-Policy Distillation) together. That kind of complete, "all at once" release is unusual for a lab this new.

## What It Means for Agent Development

This model positions itself as a self-hosted, open-weight alternative to Claude Code or Codex CLI, not another general-purpose chat model.

- If you're building a coding agent that needs data to stay on-premises (finance, government, regulated industries): IQuest-Q1 is natively compatible with Claude Code's Anthropic Messages interface and Codex's OpenAI Responses interface — swapping models only requires changing environment variables and the gateway, not rewriting agent logic
- If you're running real-world CVE remediation or security-audit style agentic tasks: 84.5% on CyberGym is an uncommonly high score among open-weight models, worth evaluating as a replacement or supplement to your existing toolchain in a self-hosted setup
- Not a fit: workloads needing multimodal input (this checkpoint is text-only — the team is explicit that it has no image, audio, or video input capability), or teams without something like 8x H200-class GPUs for tensor parallelism — the BF16 weights run about 640GB, so the self-hosting bar is not low
- If you're still deciding whether to trust a model from a brand-new team: IQuest published its full training pipeline and a description of the "model takes part in its own development" R&D process, which is a point in favor of trust — but the lack of independent reproduction is still a risk, so validate against your own task set before shipping to production

## Today's Takeaway

A lab with no public model history three days ago shipped weights, inference code, training methodology, and a description of a process where the model participates in diagnosing its own training — all at once, on its first release. That's a level of completeness that doesn't lag behind teams with years of release history. It's a reminder that judging whether a new model is trustworthy isn't just about "how high did it score this time" — how much reproduction detail the team is willing to publish may be the more stable signal.

## References

- [IQuest-Q1 Technical Blog (with benchmark data)](https://iquestlab.github.io/)
- [HuggingFace: IQuestLab/IQuest-Q1](https://huggingface.co/IQuestLab/IQuest-Q1)
- [GitHub: IQuestLab/IQuest-Q1 (inference code and deployment guide)](https://github.com/IQuestLab/IQuest-Q1)
- [HuggingFace: IQuest-Q1 LICENSE (Modified MIT License)](https://huggingface.co/IQuestLab/IQuest-Q1/blob/main/LICENSE)
- [Pandaily: IQuest Research Open-Sources IQuest-Q1](https://pandaily.com/iquest-research-iquest-q1-320b-moe-15b-active-open-weights-agentic-coding)
- [NetEase (in Mandarin): a dark horse open-source model makes a striking debut](https://www.163.com/dy/article/L80KM0Q90511AQHO.html)
