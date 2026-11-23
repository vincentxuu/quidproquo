---
title: "Ornith: The Open-Source Coding Dark Horse Built on Self-Improvement RL"
date: 2026-08-26
category: tech
type: deep-dive
tags: [open-source, reinforcement-learning, agentic-coding, moe, code-model, benchmark, qwen, gemma]
lang: en
series:
  name: "AI Model Families"
  order: 13
tldr: "DeepReinforce's Ornith 1.5 family, trained with self-improvement RL: the 397B flagship scores 86.0 on SWE-bench Verified, matching Claude Opus 4.8; the 35B-A3B activates only 3B parameters per token yet leads every coding benchmark in its class; the 9B runs on phones. A 122B MoE joined on 2026-10-16 with 84.5 on SWE-bench Verified (non-hack), a self-hosting option between the 35B and 397B. MIT-licensed, fully open-source."
description: "A deep dive into the Ornith model family: DeepReinforce's background, the self-scaffolding training methodology, benchmark comparisons across four scales (including the 122B added in October 2026), deployment options, and what it means for the open-source ecosystem."
draft: false
glossary:
  - term: "MoE"
    def: "Mixture of Experts — a model architecture with multiple parameter groups where only a subset activates per token, balancing capability and efficiency"
  - term: "GRPO"
    def: "Group Relative Policy Optimization — a reinforcement learning algorithm that updates the policy using group-relative rewards without a separate value model"
  - term: "SWE-bench"
    def: "Software Engineering Benchmark — a standardized test that measures a model's ability to solve real GitHub issues"
---

> :globe: [中文版](/posts/tech/2026-08-26-ornith-deepreinforce-model-family)

DeepReinforce is not a big lab. Not Alibaba, not Meta, not Google — it's a small team focused on agentic coding and reinforcement learning. Yet their Ornith 1.5 family, released in August 2026, matches or beats Claude Opus 4.8 on multiple coding benchmarks, all under an MIT license. Here's how they did it and whether it's worth paying attention to.

## Family positioning and model matrix

| Model / product line | Positioning | Key difference | Access |
|---|---|---|---|
| Ornith 1.5-397B | Flagship coding/reasoning | 397B MoE | MIT weights; vLLM/SGLang |
| Ornith 1.5-122B | Mid-to-large self-hosting | 122B MoE; 262K context, extendable to ~1M with YaRN | MIT weights; BF16, FP8, NVFP4, GGUF, MLX |
| Ornith 1.5-35B-A3B | Self-hosting efficiency | 35B/about 3B active | MIT weights; OpenAI-compatible interface |
| Ornith 1.5-9B | Small local model | 9B dense; quantized variants | MIT weights |

### The Team and Its Thesis

DeepReinforce ([deep-reinforce.com](https://deep-reinforce.com), product page at [ornith.ai](https://ornith.ai)) argues that instead of hand-designing agent scaffolds and training data, models should learn to build their own scaffolds and generate their own training problems.

They don't pretrain base models from scratch. Ornith is built on top of Qwen3.5 and Gemma 4 through continued pretraining (CPT), mid-training, and post-training, then refined with a proprietary self-improvement RL framework. This lets a small team produce competitive models without thousands of GPUs.

### Model Family Specifications

Ornith 1.5 comes in four scales, all MIT-licensed with weights on [Hugging Face](https://huggingface.co/ornith-ai):

| Model | Architecture | Total Params | Active per Token | Notes |
|---|---|---|---|---|
| Ornith 1.5-397B | MoE | 397B | Undisclosed | Flagship, matches closed-source leaders |
| Ornith 1.5-122B | MoE | 122B | Undisclosed | Added 2026-10-16, between the 35B and 397B |
| Ornith 1.5-35B-A3B | MoE | 35B | ~3B | Efficiency champion, class leader |
| Ornith 1.5-9B | Dense | 9B | 9B | Quantized mobile version available |

The 9B offers an `Ornith-1.5-9B-Mobile` quantized variant that can run on iPhone and Android devices.

### 122B: a new size between 35B and 397B

[Ornith-1.5-122B](https://huggingface.co/ornith-ai/Ornith-1.5-122B) landed on Hugging Face on 2026-10-16, with FP8, NVFP4, GGUF, and MLX (4-bit/8-bit) versions following on 10-20, all marked MIT. It is a reasoning model that opens with a `<think>` block by default; its HF `config.json` is `Qwen3_5MoeForConditionalGeneration` with 256 experts and 8 selected per token, a native context of 262,144 tokens, and YaRN (factor 4.0) validated by the model card for roughly 1M. The model card does not state active parameters per token.

The model card calls it the "most capable and efficient" member of the 1.5 family and says it serves on a single 80GB GPU. Read that against the weight sizes: the BF16 checkpoint is about 250 GB and the FP8 version about 133 GB; only the NVFP4 version (about 78 GB) comes close to 80GB, leaving very little room for KV cache. Running it on one card in practice means NVFP4 plus a shorter context, so measure before relying on it. The card also mentions a phone-deployable `Ornith-1.5-122B-Mobile`, but the ornith-ai Hugging Face organization has no such repo at present.

## Family evolution

Ornith moves from self-scaffolding in 1.0 to the joint task-generation, scaffold-construction, and problem-solving loop in 1.5. This changes the training method, not merely the model size.

| Date | Release | What changed for selection |
|---|---|---|
| 2026-06 | Ornith 1.0 (9B / 35B / 397B) | First-generation self-scaffolding, three sizes plus FP8/GGUF versions |
| 2026-08-18 | Ornith 1.5 (9B / 35B-A3B / 397B) | Training loop adds self-generated tasks; the 35B-A3B becomes the efficient pick for self-hosted coding agents |
| 2026-09-20 | DFlash drafts for 1.5 | Speculative-decoding drafts for the 397B, 35B-A3B, and 9B cut self-hosting latency |
| 2026-10-16 | Ornith 1.5-122B | One more MoE size between 35B and 397B, quantized versions on 10-20; details in [Model Card: Ornith-1.5-122B](/posts/daily/2026-10-21-model-ornith-ai-ornith-1-5-122b-en) |

## Architecture and training trade-offs

### Training: From Self-Scaffolding to Self-Improvement

The training methodology is Ornith's most interesting contribution.

**Ornith 1.0** introduced self-scaffolding: the model learns not only to solve problems but also to construct the scaffolds it uses — tool-calling strategies, code structures, reasoning frameworks. Scaffolds and solution rollouts are jointly optimized via GRPO.

**Ornith 1.5** extends this into a full self-improvement loop with three jointly optimized stages:

1. **Task Generation** — the model creates its own problems. Rewards are based on validity (the task is well-formed), frontier difficulty (just at the edge of the model's capability), and novelty (not repeating previously seen tasks)
2. **Scaffold Construction** — the model designs a problem-solving scaffold for each task
3. **Solution Rollout** — the model executes the solution within the scaffold; the rollout reward propagates back to the first two stages

From the official Ornith technical report: "Repeated over training, this creates a closed self-improvement loop in which stronger policies enable the generation of harder and more informative tasks, evolving scaffolds discover better ways to elicit the model's capabilities, and higher-quality rollouts provide increasingly effective learning signals."

In short: stronger model → harder problems → smarter scaffolds → better solutions → even stronger model. This positive feedback loop doesn't depend on human-annotated datasets and can, in theory, drive continuous improvement.

## Evaluation and alternatives

### Benchmark Comparison

All data below comes from the official Ornith technical report. All Ornith scores are averages of five independent runs.

#### Flagship 397B vs Closed-Source Leaders

| Benchmark | Ornith 1.5-397B | Claude Opus 4.8 | GLM-5.2 | DeepSeek-V4-Flash |
|---|---|---|---|---|
| Terminal-Bench 2.1 | **86.1** | 85.0 | 82.7 | 82.7 |
| SWE-bench Verified | **86.0** | 85.8 | — | — |
| DeepSWE | 56.0 | **59.0** | 46.2 | 54.4 |
| GPQA Diamond | **92.8** | — | — | — |
| BrowseComp | **86.6** | — | — | — |

The 397B edges out Claude Opus 4.8 on Terminal-Bench and SWE-bench, loses slightly on DeepSWE. Overall, it trades blows with the strongest closed-source models — a remarkable achievement for an open-source model.

#### 35B-A3B: The Real Surprise

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

#### 9B: A Coding Agent on Your Phone

| Benchmark | Ornith 1.5-9B | Qwen3.5-9B |
|---|---|---|
| Terminal-Bench 2.1 | **46.2** | 21.3 |

The 9B more than doubles Qwen3.5-9B on Terminal-Bench. The team claims the 9B matches or exceeds models several times its size, including Gemma 4-31B and Qwen 3.6-35B.

#### 122B: a different table, different conditions

The 122B numbers come from its own [model card](https://huggingface.co/ornith-ai/Ornith-1.5-122B), with different comparison models and evaluation settings from the 1.5 technical report above (the SWE-bench family runs on OpenHands with anti-reward-hacking checks, labeled non-hack), so they are not merged with the 397B and 35B tables:

| Benchmark | Ornith 1.5-122B | Qwen3.8-Flash-Next (125B) | Qwen3.8 (27B) | DeepSeek-V4-Flash-0731 (284B) |
|---|---|---|---|---|
| SWE-bench Verified (non-hack) | **84.5** | 82.8 | 76.8 | — |
| SWE-bench Pro (no-hack) | **76.9** | 43.9 | 65.5 | — |
| SWE-bench Multilingual (non-hack) | **76.4** | 73.0 | 70.3 | — |
| Terminal-Bench 2.1 | 81.2 | **83.4** | 71.9 | 82.7 |
| CyberGym | **80.0** | 78.0 | 55.0 | 76.7 |
| NL2Repo | 51.2 | 45.2 | 42.3 | **54.2** |
| HLE (with tools) | 48.0 | 38.0 | 31.3 | **50.8** |
| BrowseComp | 78.5 | 75.3 | 71.4 | **80.2** |

Reading: the 122B leads the table on all three SWE-bench variants but trails Qwen3.8-Flash-Next or the twice-as-large DeepSeek-V4-Flash on Terminal-Bench 2.1, NL2Repo, HLE, and BrowseComp. Everything is self-reported by DeepReinforce with no third-party reproduction; Terminal-Bench 2.1 runs on Claude Code 2.1.126 averaged over 5 runs, and HLE uses Claude 4.6 Opus as the judge.

## Licensing, pricing, and deployment

Ornith 1.5 weights use MIT and are available on Hugging Face; the existing usage example uses vLLM/SGLang with an OpenAI-compatible local endpoint. This article has not compiled hosted API pricing, so weight access does not establish a hosted service cost.

The 122B model card metadata says MIT and its `license_link` points to a LICENSE file in the repo, but the repo currently has no such file; if legal needs the full license text, compare against the LICENSE in another repo of the family or confirm with DeepReinforce. The 122B needs Transformers ≥ 5.8.1, vLLM ≥ 0.19.1, or SGLang ≥ 0.5.9. YaRN is applied statically to every request, and the model card advises enabling it only when you truly need more than 262K, since it slightly hurts quality on ordinary-length inputs.

Since 2026-09-20, the 397B, 35B-A3B, and 9B each have a [DFlash](https://huggingface.co/ornith-ai/Ornith-1.5-397B-DFlash) speculative-decoding draft model; it needs a DFlash-enabled inference setup and only speeds things up, it is not a standalone model.

## Agent integration and selection

### Practical Usage

Ornith is compatible with the OpenAI API format and can be deployed with vLLM or SGLang. Per the GitHub repo, it plugs directly into agentic coding CLIs like Claude Code and OpenCode:

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="EMPTY")
response = client.chat.completions.create(
    model="Ornith-1.5-35B-A3B",
    messages=[{"role": "user", "content": "Fix the bug in this function..."}]
)
```

Pick a size by hardware first. Multi-GPU node and the best scores: 397B. Room for the 122B FP8 version (about 133 GB, two 80GB cards) or willing to run NVFP4 on one card, and wanting clearly better SWE-bench scores than the 35B: evaluate the 122B. A single card: 35B-A3B. Phones and small GPUs: 9B.

The 35B-A3B's inference cost is far lower than models with comparable scores, since only 3B parameters activate per token. Community members have reported running the 35B locally on a single A100. The quantized 9B runs on consumer GPUs (12 GB+) or even smartphones.

## Limitations and trade-offs

### Selection rationale and reservations

**Three reasons to evaluate it:**

1. **Methodological significance** — the self-improvement loop trains without human annotation and can, in principle, keep improving. If this path is viable, small teams can compete with big labs' proprietary data advantages
2. **Efficiency demonstration** — the 35B-A3B achieves SWE-bench 79 at ~3B inference cost, making "self-hosted open-source agentic coding" a practical option rather than a theoretical one
3. **Fully open** — MIT license, weights and code all public, no "open but non-commercial" restrictions

**Caveats:**

- Benchmark scores come from Ornith's own testing; large-scale independent reproductions are still underway
- General reasoning (HLE, MATH) still lags behind closed-source models at comparable scale — Ornith's strength is concentrated in coding and agentic tasks
- The team is small; long-term model maintenance and iteration cadence are unknowns

## Update history

- 2026-11-23: Added Ornith 1.5-122B (2026-10-16, MIT): model matrix, spec table, a family-evolution timeline (linking the 122B daily model card), a separate 122B official benchmark table (different conditions from the 1.5 technical report, not merged), deployment requirements, a weight-size check on the single-80GB claim, and the missing LICENSE file; added the 2026-09-20 DFlash draft models and a size-selection order.
- 2026-10-11: Reorganized the format, model matrix, and selection sections; retained existing sources and dates. No fresh fact-check was performed.

## References

- [Ornith 1.5 Official Technical Report](https://ornith.ai/ornith_1_5.html)
- [DeepReinforce Website](https://deep-reinforce.com)
- [Ornith GitHub Repository](https://github.com/ornith-ai/Ornith-1)
- [Ornith Hugging Face Models](https://huggingface.co/ornith-ai)
- [Hugging Face: ornith-ai/Ornith-1.5-122B (model card, evaluation, and serving notes)](https://huggingface.co/ornith-ai/Ornith-1.5-122B)
- [Hugging Face: ornith-ai/Ornith-1.5-122B-NVFP4](https://huggingface.co/ornith-ai/Ornith-1.5-122B-NVFP4)
- [Hugging Face: ornith-ai/Ornith-1.5-397B-DFlash](https://huggingface.co/ornith-ai/Ornith-1.5-397B-DFlash)
- [Model Card: Ornith-1.5-122B (on this site)](/posts/daily/2026-10-21-model-ornith-ai-ornith-1-5-122b-en)
- [Ornith 1.5 35B-A3B Benchmark Analysis — MindStudio](https://www.mindstudio.ai/blog/ornith-1-5-35b-a3b-benchmarks)
- [Ornith 1.5 Self-Improvement Loop Explained — MindStudio](https://www.mindstudio.ai/blog/ornith-1-5-self-improvement-loop)
- [AI Model Landscape Overview — 2026 Guide](/posts/tech/2026-08-24-ai-model-landscape-overview) (in Mandarin)
