---
title: "Nous Research: From Research Collective to Open-Source AI Ecosystem Rebel"
date: 2026-08-26
category: ai
type: deep-dive
tags: [nous-research, open-source, reinforcement-learning, fine-tuning, hermes-agent, llama, code-model]
lang: en
tldr: "Nous Research doesn't pretrain — they fine-tune and do RL. Hermes 4 scores 96.3% on MATH-500, NousCoder-14B improves Qwen3-14B's coding ability by 7% using only 24K training samples. But the real moat is Hermes Agent: 236K GitHub stars, #19 globally, 3,000 contributors."
description: "A deep dive into Nous Research: team background, Hermes 4 and NousCoder models, the DataForge + Atropos training methodology, the Hermes Agent ecosystem, and the controversy and impact of their uncensored AI philosophy."
draft: false
glossary:
  - term: "Rejection Sampling"
    def: "Selecting only responses that pass a quality threshold from multiple model outputs for training, ensuring training data quality"
  - term: "RefusalBench"
    def: "A benchmark measuring how often models refuse reasonable requests — higher scores mean fewer unnecessary refusals"
---

> 🌏 [中文版](/posts/ai/2026-08-26-nous-research-hermes)

Nous Research didn't start in someone's garage — it started as a loose collective of open-source LLM researchers who decided to form a company. Founded in 2023 by Jeffrey Quesnelle, Karan Malhotra, Shivani Mitra, and the researcher known as Teknium, they went from informal collaboration to a funded startup. Their position is clear: AI shouldn't have excessive safety guardrails, and users should decide what models can answer. This philosophy earned them a loyal following in the open-source community — and made them a lightning rod for controversy.

## The No-Pretraining Strategy

Like [Ornith (DeepReinforce)](/posts/ai/2026-08-26-ornith-deepreinforce-model-family), Nous Research doesn't pretrain base models from scratch. They build on Meta's Llama and Alibaba's Qwen, focusing their resources on fine-tuning and reinforcement learning.

But their fine-tuning isn't standard SFT. Nous built two proprietary tools:

- **[DataForge](https://github.com/NousResearch/DataForge)**: A graph-based synthetic data generator. Rather than having GPT-4 produce Q&A pairs, it constructs knowledge relationships as graphs, ensuring diversity and coverage in training data
- **[Atropos](https://github.com/NousResearch/Atropos)**: An open-source RL framework built on rejection sampling — the model generates multiple responses, and only verified ones enter training. NousCoder goes further with execution-reward RL: code is actually executed, and rewards are based on correctness

This pipeline lets them produce high-quality models with comparatively modest compute.

## Hermes 4: Hybrid Reasoning Model

Hermes 4 shipped in August 2025, built on Llama 3.1, available in 14B, 70B, and 405B sizes. The flagship 405B was trained on 192 NVIDIA B200 GPUs over 71,616 GPU hours. Training data included 3.5 million reasoning samples and 1.6 million non-reasoning samples.

Its signature feature is **hybrid reasoning mode** — thinking can be toggled on or off. On: chain-of-thought reasoning (similar to o1). Off: standard conversation.

Hermes 4 405B scores (reasoning mode):

| Benchmark | Hermes 4 405B | Comparison |
|---|---|---|
| MATH-500 | **96.3%** | — |
| AIME 2024 | **81.9%** | — |
| AIME 2025 | **78.1%** | — |
| RefusalBench | **57.1%** | GPT-4o 17.67%, Claude Sonnet 4 17% |

The RefusalBench gap is notable: Hermes 4 answered 57.1% of requests, while GPT-4o and Claude Sonnet 4 answered only ~17%. This reflects Nous's core philosophy — minimizing unnecessary refusals. Whether this number is a strength or a risk depends on your use case and your stance on AI safety.

## NousCoder-14B: An Efficiency Demonstration with 24K Samples

Released in January 2026, [NousCoder-14B](https://huggingface.co/NousResearch/NousCoder-14B) is built on Qwen3-14B and trained with execution-reward RL. The most striking number isn't the score itself — it's the **training scale**: only 24,000 samples.

| Benchmark | NousCoder-14B | Qwen3-14B (base) | Improvement |
|---|---|---|---|
| LiveCodeBench v6 | **67.87%** Pass@1 | ~60.79% | +7.08% |

More importantly, NousCoder-14B is **fully reproducible** — training code, dataset, and benchmark harness are all public. In a landscape where most teams only release weights, this level of transparency is rare.

## Hermes Agent: The Ecosystem Bigger Than the Models

Nous's real moat may not be their models but the [Hermes Agent](https://github.com/NousResearch/hermes-agent) framework. As of August 2026, it has **236,000 GitHub stars** (#19 globally), over 3,000 contributors, and is the fastest-growing open-source agent framework of 2026.

Hermes Agent's design philosophy:

- **Self-hosted first**: models run locally, no cloud API dependency
- **Model-agnostic**: works with any LLM, not locked to Nous models
- **Persistent memory**: agents retain long-term memory across conversations
- **Self-improving**: agents can learn new skills and continuously optimize
- **Multi-agent communication**: supports bot-to-bot messaging

This framework transformed Nous from "a small team making models" into "a platform with an ecosystem." Even when their models aren't the top scorers on benchmarks, the massive user community gives them sustained influence.

## Licensing and Limitations

Licensing is one of Nous's weak points. Since they don't pretrain, model licenses are inherited from the base:

- **Hermes 4**: Follows Llama 3.1's community license — open, but applications with over 700 million MAU need additional Meta approval
- **NousCoder-14B**: Follows Qwen3's Apache 2.0 license — fully open
- **Hermes Agent framework**: Open-source

Compared to Ornith's full MIT license, Hermes 4's restrictions (from Llama 3.1) require attention for large-scale deployments.

## Is It Worth Watching?

**Yes, for more than one reason:**

1. **Training efficiency** — NousCoder-14B trained on 24K samples outperforms its base by 7%, and it's fully reproducible. This demonstrates that with the right RL framework, data volume isn't decisive
2. **Ecosystem** — 236K stars on Hermes Agent is real. Models can be swapped; ecosystems are harder to replace
3. **Philosophical positioning** — uncensored AI is controversial, but it serves real use cases (research, security testing, internal tools)

**Caveats:**

- Uncensored models lack protection against malicious use, making them unsuitable for consumer-facing products
- Model licenses are inherited from base models, less clean than Ornith (MIT) or DeepSeek (MIT)
- Team of ~30-50 people; long-term maintenance capacity is uncertain

## References

- [Nous Research Official Website](https://nousresearch.com)
- [Hermes Agent — GitHub](https://github.com/NousResearch/hermes-agent)
- [Atropos RL Framework — GitHub](https://github.com/NousResearch/Atropos)
- [DataForge — GitHub](https://github.com/NousResearch/DataForge)
- [NousCoder-14B — Hugging Face](https://huggingface.co/NousResearch/NousCoder-14B)
- [Hermes 4 — Hugging Face](https://huggingface.co/NousResearch)
- [Ornith: The Open-Source Coding Dark Horse Built on Self-Improvement RL](/posts/ai/2026-08-26-ornith-deepreinforce-model-family) (in Chinese)
