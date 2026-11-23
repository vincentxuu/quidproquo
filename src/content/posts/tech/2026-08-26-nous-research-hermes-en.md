---
title: "Nous Research: From Research Collective to Open-Source AI Ecosystem Rebel"
date: 2026-08-26
category: tech
type: deep-dive
tags: [nous-research, open-source, reinforcement-learning, fine-tuning, hermes-agent, llama, code-model]
lang: en
series:
  name: "AI Model Families"
  order: 15
tldr: "Nous Research doesn't pretrain — they fine-tune and do RL. Hermes 4 scores 96.3% on MATH-500, NousCoder-14B improves Qwen3-14B's coding ability by 7% using only 24K training samples. But the real moat is Hermes Agent: 236K GitHub stars, #19 globally, 3,000 contributors. The model line also includes Hermes 4.3-36B (Seed-OSS base, post-trained on the Psyche network), the math-focused Nomos 1, and Arete-27B (2026-11-06), which uses Inkling as a teacher to shift Qwen3.8-27B's values."
description: "A deep dive into Nous Research: team background, the Hermes 4/4.3, NousCoder, Nomos 1, and Arete-27B models, the DataForge + Atropos training methodology, the Hermes Agent ecosystem, and the controversy and impact of their uncensored AI philosophy."
draft: false
glossary:
  - term: "Rejection Sampling"
    def: "Selecting only responses that pass a quality threshold from multiple model outputs for training, ensuring training data quality"
  - term: "RefusalBench"
    def: "A benchmark measuring how often models refuse reasonable requests — higher scores mean fewer unnecessary refusals"
---

> :globe: [中文版](/posts/tech/2026-08-26-nous-research-hermes)

Nous Research didn't start in someone's garage — it started as a loose collective of open-source LLM researchers who decided to form a company. Founded in 2023 by Jeffrey Quesnelle, Karan Malhotra, Shivani Mitra, and the researcher known as Teknium, they went from informal collaboration to a funded startup. Their position is clear: AI shouldn't have excessive safety guardrails, and users should decide what models can answer. This philosophy earned them a loyal following in the open-source community — and made them a lightning rod for controversy.

## Family positioning and model matrix

| Model / product line | Positioning | Key difference | Access |
|---|---|---|---|
| Hermes 4 | Hybrid reasoning/chat | 70B/405B (Llama 3.1 base) and 14B (Qwen3-14B base); switchable thinking | Hugging Face weights; Llama 3 license for 70B/405B, Apache 2.0 for 14B; 405B on OpenRouter |
| Hermes 4.3-36B | Mid-size hybrid reasoning | Seed-OSS-36B base; officially roughly equal to Hermes 4 70B | Hugging Face; Apache 2.0 |
| NousCoder-14B | Code RL | Qwen3-14B base | Hugging Face; Apache 2.0 |
| Nomos 1 | Math problem solving and proofs | Qwen3-30B-A3B-Thinking-2507 base, used with the Nomos reasoning harness | Hugging Face; Apache 2.0 |
| Arete-27B | Value-adjusted general assistant | Qwen3.8-27B base, SFT only, Inkling as teacher | Hugging Face; Apache 2.0 |
| Hermes Agent | Model-agnostic workflow | Framework, not a model version | GitHub; supports other models |

## Family evolution

Hermes 4 arrived in August 2025, followed by NousCoder-14B in January 2026. The family expands from hybrid reasoning toward reproducible coding RL, while Hermes Agent supplies a separate model-agnostic workflow.

| Date | Release | What changed for selection |
|---|---|---|
| 2025-08 | Hermes 4 (70B / 405B / 14B) | Hybrid-reasoning flagship; 70B/405B inherit the Llama 3.1 license, while the 14B moves to a Qwen3 base under Apache 2.0 |
| 2025-11 | Hermes 4.3-36B | First Hermes post-trained on the decentralized Psyche network; an Apache 2.0 mid-size option free of Llama license limits |
| 2025-12 | Nomos 1 | Math-specialist model built with Hillclimb AI, meant to run with the Nomos reasoning harness |
| 2026-01 | NousCoder-14B | Execution-reward RL coding model with a fully public training pipeline |
| 2026-02 | Hermes Agent | Listed on the official releases page as a released agent framework |
| 2026-11-06 | Arete-27B | First model aimed at changing a base model's values, using SFT rather than RL |

## Architecture and training trade-offs

### The No-Pretraining Strategy

Like [Ornith (DeepReinforce)](/posts/tech/2026-08-26-ornith-deepreinforce-model-family), Nous Research doesn't pretrain base models from scratch. They build on Meta's Llama and Alibaba's Qwen, focusing their resources on fine-tuning and reinforcement learning.

But their fine-tuning isn't standard SFT. Nous built two proprietary tools:

- **[DataForge](https://github.com/NousResearch/DataForge)**: A graph-based synthetic data generator. Rather than having GPT-4 produce Q&A pairs, it constructs knowledge relationships as graphs, ensuring diversity and coverage in training data
- **[Atropos](https://github.com/NousResearch/Atropos)**: An open-source RL framework built on rejection sampling — the model generates multiple responses, and only verified ones enter training. NousCoder goes further with execution-reward RL: code is actually executed, and rewards are based on correctness

This pipeline lets them produce high-quality models with comparatively modest compute.

### Hermes 4: Hybrid Reasoning Model

Hermes 4 shipped in August 2025: the 70B and 405B are built on Llama 3.1, while the 14B uses Qwen3-14B as its base (per the Hugging Face `base_model` field). The flagship 405B was trained on 192 NVIDIA B200 GPUs over 71,616 GPU hours. Training data included 3.5 million reasoning samples and 1.6 million non-reasoning samples.

Its signature feature is **hybrid reasoning mode** — thinking can be toggled on or off. On: chain-of-thought reasoning (similar to o1). Off: standard conversation.

### NousCoder-14B: An Efficiency Demonstration with 24K Samples

Released in January 2026, [NousCoder-14B](https://huggingface.co/NousResearch/NousCoder-14B) is built on Qwen3-14B and trained with execution-reward RL. The most striking number isn't the score itself — it's the **training scale**: only 24,000 samples.

More importantly, NousCoder-14B is **fully reproducible** — training code, dataset, and benchmark harness are all public. In a landscape where most teams only release weights, this level of transparency is rare.

### Hermes 4.3-36B: training spread across the internet

[Hermes 4.3-36B](https://huggingface.co/NousResearch/Hermes-4.3-36B) is built on ByteDance's Seed-OSS-36B-Base and is the first Hermes post-trained in a decentralized way on the [Psyche](https://psyche.network) network. The model card lists both the Psyche run and a centralized run; the Psyche version scores slightly higher than the centralized one on AIME 24/25 and GPQA Diamond, and trades wins with Hermes 4 70B. Post-training data grew from about 1M samples and 1.2B tokens in Hermes 3 to about 5M samples and 60B tokens.

### Nomos 1: math only

[Nomos 1](https://huggingface.co/NousResearch/nomos-1) is a math problem-solving and proof-writing model built with Hillclimb AI on Qwen3-30B-A3B-Thinking-2507, designed to run with the [Nomos reasoning harness](https://github.com/NousResearch/nomos) open-sourced alongside it; the model card recommends using no system prompt.

### Arete-27B: shifting values with SFT

[Arete-27B](https://huggingface.co/NousResearch/Arete-27B) (2026-11-06) is built on Qwen3.8-27B, and Nous's model card states the goal as "reinforce western values on a Chinese-trained model": they observed refusals, deflections, and official-framed answers from Qwen3.8-27B on politically sensitive topics, and targeted seven categories including freedom of expression, state ideology, democracy, and data privacy.

The method is SFT only, with no RL, preference optimization, or architecture changes: Inkling as the teacher produced answers for about twenty thousand prompts, and training ran two epochs on about 52.8 million tokens at 64K context, with the vision encoder frozen and text-only data. Nous says it chose an open teacher to avoid the terms-of-use problems of distilling closed models.

## Evaluation and alternatives

Hermes 4 405B results use reasoning mode; NousCoder-14B reports LiveCodeBench v6 Pass@1 against its Qwen3-14B base. These are different tasks and model sizes, so these tables cannot establish a single family ranking.


### Hermes 4 reasoning-mode results

Hermes 4 405B scores (reasoning mode):

| Benchmark | Hermes 4 405B | Comparison |
|---|---|---|
| MATH-500 | **96.3%** | — |
| AIME 2024 | **81.9%** | — |
| AIME 2025 | **78.1%** | — |
| RefusalBench | **57.1%** | GPT-4o 17.67%, Claude Sonnet 4 17% |

The RefusalBench gap is notable: Hermes 4 answered 57.1% of requests, while GPT-4o and Claude Sonnet 4 answered only ~17%. This reflects Nous's core philosophy — minimizing unnecessary refusals. Whether this number is a strength or a risk depends on your use case and your stance on AI safety.


### NousCoder-14B coding comparison

| Benchmark | NousCoder-14B | Qwen3-14B (base) | Improvement |
|---|---|---|---|
| LiveCodeBench v6 | **67.87%** Pass@1 | ~60.79% | +7.08% |

### Official numbers for Hermes 4.3, Nomos 1, and Arete-27B

Each model uses a different evaluation, so they are listed separately rather than ranked together:

- **Hermes 4.3-36B**: RefusalBench 74.60% in non-reasoning mode and 72.29% in reasoning mode, above Hermes 4 70B reasoning mode at 59.50% (model card, average of 5 trials). The Psyche version scores 69.3 on AIME 25 and 65.5 on GPQA Diamond; Hermes 4 70B scores 67.4 and 66.1.
- **Nomos 1**: 87/120 on Putnam 2025 inside the Nomos reasoning harness, versus 24/120 for Qwen3-30B-A3B-Thinking-2507 under the same conditions. The score is tied to the harness, not the model answering alone.
- **Arete-27B**: on Nous's own 803-prompt [Propaganda_Eval](https://huggingface.co/datasets/NousResearch/Propaganda_Eval), the fact score rose from 2.32 to 2.98 out of 5 and answers with propaganda framing fell from 22% to 0.9%, judged by Grok 4.7. The model card says all seven categories improved with "no meaningful regression" on general-capability and agentic benchmarks, but these are Nous's own evaluation and criteria, with prompts and framing definitions designed by them.

## Licensing, pricing, and deployment

The hosted endpoint currently available is `nousresearch/hermes-4-405b` on OpenRouter, served by Nebius at $1 input and $3 output per million tokens (as of 2026-11-23); this article has not compiled hosted prices or hardware budgets for the other models. The framework license and each model’s inherited weight license must be reviewed separately.

### Licensing and Limitations

Licensing is one of Nous's weak points. Since they don't pretrain, model licenses are inherited from the base:

- **Hermes 4 70B/405B**: Follows Llama 3.1's community license — open, but applications with over 700 million MAU need additional Meta approval
- **Hermes 4 14B, Hermes 4.3-36B, NousCoder-14B, Nomos 1, Arete-27B**: Apache 2.0 on Hugging Face, with no Llama MAU threshold
- **Hermes Agent framework**: Open-source

Compared to Ornith's full MIT license, the restrictions on Hermes 4 70B/405B (from Llama 3.1) require attention for large-scale deployments; the Apache 2.0 options in the same family that avoid them are Hermes 4.3-36B and the 14B.

## Agent integration and selection

### Hermes Agent: The Ecosystem Bigger Than the Models

Nous's real moat may not be their models but the [Hermes Agent](https://github.com/NousResearch/hermes-agent) framework. As of August 2026, it has **236,000 GitHub stars** (#19 globally), over 3,000 contributors, and is the fastest-growing open-source agent framework of 2026.

Hermes Agent's design philosophy:

- **Self-hosted first**: models run locally, no cloud API dependency
- **Model-agnostic**: works with any LLM, not locked to Nous models
- **Persistent memory**: agents retain long-term memory across conversations
- **Self-improving**: agents can learn new skills and continuously optimize
- **Multi-agent communication**: supports bot-to-bot messaging

This framework transformed Nous from "a small team making models" into "a platform with an ecosystem." Even when their models aren't the top scorers on benchmarks, the massive user community gives them sustained influence.

### Choosing a model

- A self-hosted general assistant with few refusals that avoids the Llama license: Hermes 4.3-36B.
- The largest Hermes through an API: Hermes 4 405B (OpenRouter).
- Competitive programming problems: NousCoder-14B; math proofs: Nomos 1, paired with the Nomos harness.
- A Qwen-family model that does not answer politically sensitive questions in the official framing: evaluate Arete-27B against your own prompts, since the published improvement comes only from Nous's evaluation set.

## Limitations and trade-offs

### Selection rationale and reservations

**Reasons to evaluate it:**

1. **Training efficiency** — NousCoder-14B trained on 24K samples outperforms its base by 7%, and it's fully reproducible. This demonstrates that with the right RL framework, data volume isn't decisive
2. **Ecosystem** — 236K stars on Hermes Agent is real. Models can be swapped; ecosystems are harder to replace
3. **Philosophical positioning** — uncensored AI is controversial, but it serves real use cases (research, security testing, internal tools)

**Caveats:**

- Uncensored models lack protection against malicious use, making them unsuitable for consumer-facing products
- Model licenses are inherited from base models; the 70B/405B are less clean than Ornith (MIT) or DeepSeek (MIT)
- Arete-27B's value adjustment takes an explicit stance, so judge whether it fits your needs; it does not make the model neutral, it swaps in a different set of values
- Team of ~30-50 people; long-term maintenance capacity is uncertain

## Update history

- 2026-11-23: Added Hermes 4.3-36B (2025-11), Nomos 1 (2025-12), and Arete-27B (2026-11-06): model matrix, a family-evolution timeline, how each was trained, official numbers, licensing, and selection. Corrected the Hermes 4 14B base: the earlier text said all three sizes were built on Llama 3.1, but the 14B uses Qwen3-14B under Apache 2.0. Added OpenRouter pricing for Hermes 4 405B.
- 2026-10-11: Reorganized the format, model matrix, and selection sections; retained existing sources and dates. No fresh fact-check was performed.

## References

- [Nous Research Official Website](https://nousresearch.com)
- [Hermes Agent — GitHub](https://github.com/NousResearch/hermes-agent)
- [Atropos RL Framework — GitHub](https://github.com/NousResearch/Atropos)
- [DataForge — GitHub](https://github.com/NousResearch/DataForge)
- [NousCoder-14B — Hugging Face](https://huggingface.co/NousResearch/NousCoder-14B)
- [Hermes 4 — Hugging Face](https://huggingface.co/NousResearch)
- [Nous Research Releases](https://nousresearch.com/releases)
- [Hermes 4.3-36B — Hugging Face](https://huggingface.co/NousResearch/Hermes-4.3-36B)
- [Introducing Hermes 4.3 — Nous Research](https://nousresearch.com/introducing-hermes-4-3/)
- [Nomos 1 — Hugging Face](https://huggingface.co/NousResearch/nomos-1)
- [Nomos reasoning harness — GitHub](https://github.com/NousResearch/nomos)
- [Arete-27B — Hugging Face](https://huggingface.co/NousResearch/Arete-27B)
- [Arete — Nous Research](https://nousresearch.com/arete)
- [Propaganda_Eval dataset — Hugging Face](https://huggingface.co/datasets/NousResearch/Propaganda_Eval)
- [OpenRouter: nousresearch/hermes-4-405b](https://openrouter.ai/nousresearch/hermes-4-405b)
- [Ornith: The Open-Source Coding Dark Horse Built on Self-Improvement RL](/posts/tech/2026-08-26-ornith-deepreinforce-model-family) (in Chinese)
