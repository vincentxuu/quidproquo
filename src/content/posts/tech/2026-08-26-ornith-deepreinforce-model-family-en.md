---
title: "Ornith: The Open-Source Coding Dark Horse Built on Self-Improvement RL"
date: 2026-08-26
category: tech
type: deep-dive
tags: [open-source, reinforcement-learning, agentic-coding, moe, code-model, benchmark, qwen, gemma]
lang: en
series:
  name: "AI 模型家族"
  order: 13
tldr: "DeepReinforce's Ornith 1.5 family, trained with self-improvement RL: the 397B flagship scores 86.0 on SWE-bench Verified, matching Claude Opus 4.8; the 35B-A3B activates only 3B parameters per token yet leads every coding benchmark in its class; the 9B runs on phones. MIT-licensed, fully open-source."
description: "A deep dive into the Ornith model family: DeepReinforce's background, the self-scaffolding training methodology, benchmark comparisons across three scales, deployment options, and what it means for the open-source ecosystem."
draft: false
glossary:
  - term: "MoE"
    def: "Mixture of Experts — a model architecture with multiple parameter groups where only a subset activates per token, balancing capability and efficiency"
  - term: "GRPO"
    def: "Group Relative Policy Optimization — a reinforcement learning algorithm that updates the policy using group-relative rewards without a separate value model"
  - term: "SWE-bench"
    def: "Software Engineering Benchmark — a standardized test that measures a model's ability to solve real GitHub issues"
---

> 🌏 [中文版](/posts/tech/2026-08-26-ornith-deepreinforce-model-family)

DeepReinforce is not a big lab. Not Alibaba, not Meta, not Google — it's a small team focused on agentic coding and reinforcement learning. Yet their Ornith 1.5 family, released in August 2026, matches or beats Claude Opus 4.8 on multiple coding benchmarks, all under an MIT license. Here's how they did it and whether it's worth paying attention to.

## The Team and Its Thesis

DeepReinforce ([deep-reinforce.com](https://deep-reinforce.com), product page at [ornith.ai](https://ornith.ai)) argues that instead of hand-designing agent scaffolds and training data, models should learn to build their own scaffolds and generate their own training problems.

They don't pretrain base models from scratch. Ornith is built on top of Qwen3.5 and Gemma 4 through continued pretraining (CPT), mid-training, and post-training, then refined with a proprietary self-improvement RL framework. This lets a small team produce competitive models without thousands of GPUs.

## Training: From Self-Scaffolding to Self-Improvement

The training methodology is Ornith's most interesting contribution.

**Ornith 1.0** introduced self-scaffolding: the model learns not only to solve problems but also to construct the scaffolds it uses — tool-calling strategies, code structures, reasoning frameworks. Scaffolds and solution rollouts are jointly optimized via GRPO.

**Ornith 1.5** extends this into a full self-improvement loop with three jointly optimized stages:

1. **Task Generation** — the model creates its own problems. Rewards are based on validity (the task is well-formed), frontier difficulty (just at the edge of the model's capability), and novelty (not repeating previously seen tasks)
2. **Scaffold Construction** — the model designs a problem-solving scaffold for each task
3. **Solution Rollout** — the model executes the solution within the scaffold; the rollout reward propagates back to the first two stages

From the official Ornith technical report: "Repeated over training, this creates a closed self-improvement loop in which stronger policies enable the generation of harder and more informative tasks, evolving scaffolds discover better ways to elicit the model's capabilities, and higher-quality rollouts provide increasingly effective learning signals."

In short: stronger model → harder problems → smarter scaffolds → better solutions → even stronger model. This positive feedback loop doesn't depend on human-annotated datasets and can, in theory, drive continuous improvement.

## Model Family Specifications

Ornith 1.5 comes in three scales, all MIT-licensed with weights on [Hugging Face](https://huggingface.co/ornith-ai):

| Model | Architecture | Total Params | Active per Token | Notes |
|---|---|---|---|---|
| Ornith 1.5-397B | MoE | 397B | Undisclosed | Flagship, matches closed-source leaders |
| Ornith 1.5-35B-A3B | MoE | 35B | ~3B | Efficiency champion, class leader |
| Ornith 1.5-9B | Dense | 9B | 9B | Quantized mobile version available |

The 9B offers an `Ornith-1.5-9B-Mobile` quantized variant that can run on iPhone and Android devices.

## Benchmark Comparison

All data below comes from the official Ornith technical report. All Ornith scores are averages of five independent runs.

### Flagship 397B vs Closed-Source Leaders

| Benchmark | Ornith 1.5-397B | Claude Opus 4.8 | GLM-5.2 | DeepSeek-V4-Flash |
|---|---|---|---|---|
| Terminal-Bench 2.1 | **86.1** | 85.0 | 82.7 | 82.7 |
| SWE-bench Verified | **86.0** | 85.8 | — | — |
| DeepSWE | 56.0 | **59.0** | 46.2 | 54.4 |
| GPQA Diamond | **92.8** | — | — | — |
| BrowseComp | **86.6** | — | — | — |

The 397B edges out Claude Opus 4.8 on Terminal-Bench and SWE-bench, loses slightly on DeepSWE. Overall, it trades blows with the strongest closed-source models — a remarkable achievement for an open-source model.

### 35B-A3B: The Real Surprise

The 35B-A3B is the family's standout member. Activating only ~3B parameters per token, it leads every coding benchmark in its weight class and even surpasses much larger models:

| Benchmark | Ornith 1.5-35B | Qwen3.6-35B | Gemma 4-31B | Muse Glimmer-30B | Qwen3.5-397B |
|---|---|---|---|---|---|
| SWE-bench Verified | **79.0** | 73.4 | 52.0 | 76.0 | 76.4 |
| SWE-bench Pro | **59.6** | 49.5 | 35.7 | — | — |
| SWE-bench Multilingual | **71.4** | 67.2 | — | — | 69.3 |
| Terminal-Bench 2.1 (Terminus-2) | **67.8** | 52.5 | 42.1 | 51.7 | 53.5 |
| Terminal-Bench 2.1 (Claude Code) | **68.5** | 49.2 | 43.4 | — | — |
| DeepSWE | **22** | 0 | 0 | — | 1 |
| NL2Repo | **46.2** | 29.4 | — | — | 36.8 |
| GPQA Diamond | **89.2** | 86.0 | — | — | 88.4 |

Key takeaways:

- **SWE-bench Verified 79.0** is the only score above 79 in the 30B–35B class, surpassing even the 11× larger Qwen3.5-397B (76.4)
- **DeepSWE 22 vs 0** — Qwen3.6-35B and Gemma 4-31B both score zero on this benchmark, making it the most dramatic gap
- On general reasoning (HLE with tools), the 35B's 33.4 still trails Qwen3.5-397B's 48.3 — scale still matters for general reasoning

### 9B: A Coding Agent on Your Phone

| Benchmark | Ornith 1.5-9B | Qwen3.5-9B |
|---|---|---|
| Terminal-Bench 2.1 | **46.2** | 21.3 |

The 9B more than doubles Qwen3.5-9B on Terminal-Bench. The team claims the 9B matches or exceeds models several times its size, including Gemma 4-31B and Qwen 3.6-35B.

## Practical Usage

Ornith is compatible with the OpenAI API format and can be deployed with vLLM or SGLang. Per the GitHub repo, it plugs directly into agentic coding CLIs like Claude Code and OpenCode:

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="EMPTY")
response = client.chat.completions.create(
    model="Ornith-1.5-35B-A3B",
    messages=[{"role": "user", "content": "Fix the bug in this function..."}]
)
```

The 35B-A3B's inference cost is far lower than models with comparable scores, since only 3B parameters activate per token. Community members have reported running the 35B locally on a single A100. The quantized 9B runs on consumer GPUs (12 GB+) or even smartphones.

## Is It Worth Watching?

**Yes, for three reasons:**

1. **Methodological significance** — the self-improvement loop trains without human annotation and can, in principle, keep improving. If this path is viable, small teams can compete with big labs' proprietary data advantages
2. **Efficiency demonstration** — the 35B-A3B achieves SWE-bench 79 at ~3B inference cost, making "self-hosted open-source agentic coding" a practical option rather than a theoretical one
3. **Fully open** — MIT license, weights and code all public, no "open but non-commercial" restrictions

**Caveats:**

- Benchmark scores come from Ornith's own testing; large-scale independent reproductions are still underway
- General reasoning (HLE, MATH) still lags behind closed-source models at comparable scale — Ornith's strength is concentrated in coding and agentic tasks
- The team is small; long-term model maintenance and iteration cadence are unknowns

## References

- [Ornith 1.5 Official Technical Report](https://ornith.ai/ornith_1_5.html)
- [DeepReinforce Website](https://deep-reinforce.com)
- [Ornith GitHub Repository](https://github.com/ornith-ai/Ornith-1)
- [Ornith Hugging Face Models](https://huggingface.co/ornith-ai)
- [Ornith 1.5 35B-A3B Benchmark Analysis — MindStudio](https://www.mindstudio.ai/blog/ornith-1-5-35b-a3b-benchmarks)
- [Ornith 1.5 Self-Improvement Loop Explained — MindStudio](https://www.mindstudio.ai/blog/ornith-1-5-self-improvement-loop)
- [AI Model Landscape Overview — 2026 Guide](/posts/tech/2026-08-24-ai-model-landscape-overview) (in Mandarin)
