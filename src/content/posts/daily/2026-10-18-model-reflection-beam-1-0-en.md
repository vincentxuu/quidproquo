---
title: "Model Card: Reflection Beam 1.0"
date: 2026-10-18
category: daily
type: digest
tags: [ai-agent, model-release, daily, reflection-ai, model-family-beam]
lang: en
description: "Reflection AI ships its first open-weight model, Beam — a 501B/23B MoE under Apache 2.0 with a 1M-token context, 81.6% on SWE-bench Verified, pitched as the 'Western open-weight frontier'"
tldr: "Reflection Beam 1.0: a 501.3B-total/23.4B-active MoE, teased 2026-10-05 and shipped with open weights (Apache 2.0) on 2026-10-16, with a 1M-token context. It scores 81.6% on SWE-bench Verified (BF16), 80.1% on Terminal-Bench 2.1, and 97.7% on AIME 2026. Together AI hosts it at $0.40 input / $1.20 output per million tokens (cached input $0.04). Reflection positions Beam as a Western open-weight agentic-coding model on par with GLM 5.2 and closing in on Qwen 3.8 Max, though it still trails Kimi K3 on raw capability — its edge is reasoning-token efficiency."
series:
  name: "AI Model Tracker"
  order: 50
glossary:
  - term: "Beam"
    def: "Reflection AI's open-weight model family; the first release is a 501B-total/23B-active MoE, opened under Apache 2.0 in October 2026"
  - term: "Reflection AI"
    def: "A US AI startup previously known for reinforcement-learning agentic-coding research; Beam is its first open-weight model series"
---

> 🌏 [中文版](/posts/daily/2026-10-18-model-reflection-beam-1-0)

## Model Overview

| Field | Value |
|---|---|
| Model ID | `reflection/Beam-1.0-501B-A23B` |
| Vendor | Reflection AI |
| Parameters | 501.3B total / 23.4B active (MoE, 256 experts, 52 layers: 3 dense + 49 MoE) |
| Context Window | 1,000,000 tokens |
| Input Price (USD/1M tokens) | $0.40 (hosted by Together AI; $0.04 cached) |
| Output Price (USD/1M tokens) | $1.20 (hosted by Together AI) |
| Open Weight | Yes (Apache 2.0) |
| Release Date | 2026-10-16 (weights, model card and safety report; teased 2026-10-05) |
| Official Announcement | [Reflection AI Blog: Introducing Beam](https://reflection.ai/blog/introducing-beam) |
| HuggingFace | [reflection/Beam-1.0-501B-A23B](https://huggingface.co/reflection/Beam-1.0-501B-A23B) |
| Family | Beam (Reflection AI's first model family; the company says larger follow-ups are already in training) |

## Capability Highlights

- A sparse MoE architecture (501.3B total / 23.4B active, 256 experts, gated GQA + sliding-window attention) with a 1M-token context, built specifically for agentic coding on text-only input and output
- Reflection claims comparable solution quality to peer open models while using roughly 3x fewer reasoning tokens, which translates into higher throughput per GPU-hour
- Pretrained on 23.8 trillion tokens, with an RL stage that ran 10,500 NVIDIA GB300 GPUs for four weeks and produced more than 100 million rollouts — reportedly one of the largest RL runs by any open lab to date
- Shipped in three numeric precisions (BF16, FP8, NVFP4) alongside a speculative-decoding drafter model, which Reflection says is unusual among open-weight releases

## Benchmark Results

| Benchmark | Beam (BF16) | Prior Generation | Best Competitor (per Reflection's own preview chart) |
|---|---|---|---|
| SWE-bench Verified | 81.6% | No predecessor to compare | Inkling 77.6%, Nemotron 3 Ultra 70.7% (GLM/Kimi/Qwen were not reported on this bench) |
| Terminal-Bench v2.1 | 80.1% | No predecessor to compare | DeepSeek V4.1 Flash 90.6%, Kimi K3 88.3%, GLM 5.3 88.2% |
| SWE-bench Pro v1 | 66.1% | No predecessor to compare | Qwen 3.8 Max 67.7%, GLM 5.2 62.1% |
| AIME 2026 | 97.7% | No predecessor to compare | ⚠️ No competitor score was published on the same benchmark |

⚠️ All figures are Reflection's own self-reported evaluations. The "best competitor" column is pulled from the comparison chart in Reflection's October 5 early-access blog post; its evaluation settings differ slightly from the final October 16 model card, so treat the numbers as indicative rather than independently reproduced. The FP8 and NVFP4 checkpoints score 80.2% and 80.7% on SWE-bench Verified respectively — within 1.5 points of BF16.

## Versus Predecessor / Competitors

Beam is Reflection AI's first open-weight model, so there is no predecessor to benchmark against — but the company put it straight into the ring with China's open-weight flagships. Reflection's own blog says Beam is "competitive with larger open models like GLM 5.2" and "approaching Qwen 3.8-Max," while conceding that models like Kimi K3 remain ahead on raw capability: on Terminal-Bench v2.1, both Kimi K3 (88.3%) and DeepSeek V4.1 Flash (90.6%) clearly beat Beam's 80.1%.

Beam's real pitch isn't the leaderboard — it's efficiency. With only 23.4B of 501.3B total parameters active per token (a 4.7% activation rate) and Reflection's claimed "3x reasoning-token efficiency," Beam reaches 81.6% on SWE-bench Verified at a fraction of the inference cost a 2T+-parameter model like Qwen 3.8 Max would require. Together AI's hosted pricing of $0.40 input / $1.20 output per million tokens sits in the low-to-mid range, but that reflects only the 23.4B active parameters — it says nothing about the cost of storing and deploying the full 501.3B weights, which still need roughly 251GB of memory even at 4-bit NVFP4.

## What This Means for Agent Development

Beam's significance has less to do with topping benchmarks and more with who gets to use it: it's one of the few US-built models above 500B parameters released under Apache 2.0, and Reflection open-sourced its own coding-agent environment, Mirror CLI, alongside it — compatible with existing agentic harnesses like Claude Code, OpenCode, Pi, and Hermes, with native MCP tool calling and a 1M-token context.

- If you're building agentic coding tools and don't want to be locked into a single closed API: Beam's Apache 2.0 weights give you a self-hostable, fine-tunable, distillable path that doesn't force a choice between "Qwen/GLM/Kimi" and "Claude/GPT"
- If you're building agents that need long multi-step tool use — extended debugging sessions, repo-scale refactors: the combination of 1M context and token efficiency should, in theory, lower the inference cost of a single long-running task, and is worth a proof of concept
- Not a good fit for: workloads that are primarily non-English (Reflection states the model is aligned predominantly for English), ultra-low-latency single-turn chat (Beam's advantage is token efficiency over long tasks, not single-response speed), or teams without serious self-hosting infrastructure (even at 4-bit quantization, roughly 251GB of weights is a non-trivial deployment bar)

## Today's Takeaway

Beam's official narrative splits the "open-weight frontier" into two separate races: Chinese labs are competing to push the raw benchmark ceiling higher (Kimi K3, GLM 5.3), while Reflection chose to compete on "same solution quality, fewer tokens." That's a reminder that judging open models purely by leaderboard position misses the variable that actually drives real-world inference cost — active parameters and reasoning-token count, not total parameter count or a single headline score.

## References

- [Reflection AI Blog: Introducing Beam](https://reflection.ai/blog/introducing-beam)
- [Reflection Beam Model Card (Hugging Face)](https://huggingface.co/reflection/Beam-1.0-501B-A23B)
- [Together AI: Reflection Beam API pricing and docs](https://www.together.ai/models/reflection-beam)
- [Data Studios: Reflection Beam 501B Open-Weight Coding Model: Benchmarks and Costs](https://www.datastudios.org/post/reflection-beam-501b-23b-open-weights-1m-context-coding-benchmarks)
