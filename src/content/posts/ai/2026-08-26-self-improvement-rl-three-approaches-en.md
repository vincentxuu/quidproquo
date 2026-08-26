---
title: "Three RL Post-Training Playbooks: How Ornith, Nous Research, and MiniMax Built Dark Horse Models"
date: 2026-08-26
category: ai
type: deep-dive
tags: [reinforcement-learning, grpo, post-training, self-improvement, open-source, agentic-coding, fine-tuning]
lang: en
tldr: "Three non-big-lab teams used different RL post-training strategies to produce benchmark dark horses in 2026: Ornith's self-improvement loop (GRPO), Nous Research's DataForge + Atropos execution-reward RL, and MiniMax's massive-scale RL across 200K real environments. Different strengths, but one shared proof point: post-training RL matters more than pretraining scale."
description: "Comparing three RL post-training methodologies — Ornith's self-scaffolding, Nous Research's DataForge/Atropos, and MiniMax's large-scale environment RL — their results, limitations, and implications for the open-source ecosystem."
draft: false
glossary:
  - term: "GRPO"
    def: "Group Relative Policy Optimization — a reinforcement learning algorithm that updates the policy using group-relative rewards without a separate value model, proposed by DeepSeek and adopted by Ornith"
  - term: "Rejection Sampling"
    def: "Generating multiple responses from a model and selecting only those that pass a quality threshold for training data, the core mechanism behind Nous Research's Atropos framework"
  - term: "SWE-bench"
    def: "Software Engineering Benchmark — a standardized test that measures a model's ability to solve real GitHub issues"
---

> 🌏 [中文版](/posts/ai/2026-08-26-self-improvement-rl-three-approaches)

There's a counterintuitive pattern in 2026: the models matching or beating top closed-source models on coding benchmarks aren't the ones with the biggest pretraining budgets. They're the ones that got creative with reinforcement learning during post-training. [Ornith](/en/posts/tech/2026-08-26-ornith-deepreinforce-model-family-en), [Nous Research](/en/posts/tech/2026-08-26-nous-research-hermes-en), and [MiniMax](/en/posts/tech/2026-08-26-minimax-model-family-en) took three very different RL paths and each produced results that surprised the field. This post compares their design philosophies, concrete methods, and respective strengths.

## The Shared Premise: Pretraining Isn't Your Battlefield

All three teams made the same strategic choice: **don't pretrain base models from scratch**.

- Ornith builds on Qwen3.5 and Gemma 4
- Nous Research's Hermes 4 uses Llama 3.1; NousCoder uses Qwen3-14B
- MiniMax has its own base, but treats RL post-training as the primary source of model capability

The logic is straightforward: pretraining requires thousands of GPUs for months — it's a big-lab arms race. But post-training RL — teaching a model better behaviors from its existing knowledge — is a domain where clever strategy can beat brute force.

Research from [ACL 2026](https://aclanthology.org/2026.acl-long.1444) on RL post-training scaling confirms this: even with a fixed base model, increasing RL training compute continues to yield capability gains, particularly on reasoning and coding tasks.

## Approach 1: Ornith's Self-Improvement Loop

[Ornith (DeepReinforce)](/en/posts/tech/2026-08-26-ornith-deepreinforce-model-family-en) asks: **what if the model generates its own training data and improves itself?**

### How It Works

Ornith 1.5 runs a three-stage loop, all driven by [GRPO](https://futureagi.com/blog/what-is-grpo-llm-reinforcement-learning-2026) (Group Relative Policy Optimization):

```
Task Generation → Scaffold Construction → Solution Rollout
     ↑                                          |
     └──────────── reward signal ───────────────┘
```

1. **The model creates its own problems** — rewarded for validity, frontier difficulty, and novelty
2. **The model designs problem-solving scaffolds** — tool-calling strategies, reasoning frameworks
3. **The model solves the problems** — rollout rewards propagate back to the first two stages

### Why GRPO

GRPO doesn't need a separate value model (critic). Instead, it computes advantages from relative rankings within the same batch of rollouts. This lets all three stages share one RL framework for joint optimization, dramatically reducing infrastructure complexity for a small team.

### Results and Strengths

- **Strongest at coding**: 35B-A3B scores 79.0 on SWE-bench Verified (only model in its class above 79)
- **Self-reinforcing**: stronger model → harder problems → smarter scaffolds → better solutions
- **Weakness**: general reasoning (HLE) still lags behind larger models; self-improvement currently concentrated on coding tasks

## Approach 2: Nous Research's DataForge + Atropos

[Nous Research](/en/posts/tech/2026-08-26-nous-research-hermes-en) takes a different path: **use purpose-built tooling to synthesize high-quality training data, then apply execution-reward RL**.

### How It Works

Nous's training pipeline has two custom frameworks:

- **DataForge**: a graph-structured synthetic data generator. Rather than random problem generation, it uses knowledge graph relationships to produce logically coherent training samples. Hermes 4's dataset includes 3.5M reasoning samples + 1.6M non-reasoning samples
- **Atropos**: an open-source RL framework built on rejection sampling — the model generates multiple responses to the same problem, and only those passing quality thresholds enter the training set

NousCoder-14B goes further with **execution-reward RL**: the model's code is actually run, and rewards come directly from whether it passes.

### How It Differs from Ornith

| | Ornith | Nous |
|---|---|---|
| Training data source | Self-generated by the model | Graph-structured synthesis (DataForge) |
| RL algorithm | GRPO (group-relative ranking) | Rejection sampling + execution rewards |
| Iteration | Closed-loop self-improvement | External data pipeline + RL fine-tuning |
| Reproducibility | Partially open | NousCoder fully open (code, data, harness) |

### Results and Strengths

- **Strongest at reasoning**: Hermes 4 405B scores 96.3% on MATH-500, 81.9% on AIME 2024
- **Extremely data-efficient**: NousCoder-14B improved base model coding by 7% using only 24K samples
- **Fully reproducible**: NousCoder's training code, data, and harness are all public
- **Weakness**: constrained by base model licenses (Llama 3.1 has a 700M MAU restriction); model scale limited by the base

## Approach 3: MiniMax's Massive-Scale Environment RL

[MiniMax](/en/posts/tech/2026-08-26-minimax-model-family-en) takes the most "brute force" yet distinct approach: **large-scale RL in 200,000+ real environments, without self-generation or synthetic data**.

### How It Works

MiniMax describes M2.5 as being trained through "extensive RL in hundreds of thousands of complex real-world environments" across 10+ languages. The specifics:

- Training happens in real development environments (codebases, APIs, systems), not abstract problems
- M3 adds an **interactive user-simulator framework** — simulating real users in multi-turn conversations and learning from the interactions

### How It Differs

Ornith and Nous both do RL within a "solve problems" paradigm. MiniMax's difference is **environment richness**: not individual problems, but complete software development environments.

This produced an interesting emergent behavior — **spontaneous spec-writing**: the model learned to write architecture specifications before writing code, a behavior that was never explicitly trained.

### Results and Strengths

- **Best cost-performance**: M2.5 scores 80.2% on SWE-bench Verified at 1/10–1/20 the price of Claude Opus
- **Scale wins**: M3 (456B total) is the first open-weight model to break 59% on SWE-bench Pro
- **Weakness**: training details less open than Ornith or Nous; lower reproducibility

## Side-by-Side Comparison

| Dimension | Ornith | Nous Research | MiniMax |
|---|---|---|---|
| Core method | Self-improvement loop (GRPO) | DataForge + Atropos (rejection sampling) | Large-scale environment RL |
| Training data | Self-generated by model | External graph-structured synthesis | Real environment interactions |
| Strongest domain | Agentic coding | Reasoning + coding | Cost-efficiency + coding |
| Headline score | SWE-bench 79.0 (35B-A3B) | MATH-500 96.3% (405B) | SWE-bench 80.2% (229B) |
| Openness | Weights public, methods partially open | Weights + code + data fully open | Weights public, training details limited |
| Team size | Small (research team) | Small (30–50 people) | Medium (415 people) |

## The Bigger Question: Will Self-Improvement Plateau?

Ornith's self-improvement loop raises a fundamental question: if a model generates its own problems and improves itself, will it eventually stagnate?

Current evidence is optimistic — Ornith's DeepSWE score jumped from 8.0 (1.0) to 56.0 (1.5-397B), a massive leap. But this could simply be low-hanging fruit. Whether self-improvement's marginal returns drop sharply as models approach human engineering capability is something no one knows yet.

Nous and MiniMax sidestep this issue — their training data comes from external sources (synthesis tools or real environments) and doesn't depend on the model's own capability frontier. The tradeoff: they need to continuously expand their environments and data pipelines.

## What This Means for Open Source

All three approaches prove one thing: **post-training RL is a battlefield where small teams can win**.

Pretraining requires massive data and compute — that's the big-lab moat. But post-training RL competes on different dimensions: training method creativity, reward signal design, environment quality. Ornith matched Claude Opus 4.8 with a fraction of the team size, NousCoder improved its base model by 7% with just 24K samples, and MiniMax delivers 80% of the performance at one-tenth the price.

If this trend holds, the open-source model ecosystem will shift from "who pretrains biggest" to "who post-trains smartest." And in that race, small teams aren't necessarily at a disadvantage.

## References

- [Ornith 1.5 Official Technical Report](https://ornith.ai/ornith_1_5.html)
- [Nous Research — Atropos RL Framework](https://github.com/NousResearch/Atropos)
- [MiniMax Official Page](https://www.minimax.io/)
- [What Is GRPO in LLM Reinforcement Learning? — FutureAGI](https://futureagi.com/blog/what-is-grpo-llm-reinforcement-learning-2026)
- [Scaling Behaviors of LLM RL Post-Training — ACL 2026](https://aclanthology.org/2026.acl-long.1444)
- [How Agentic RL Trains Autonomous Agents in 2026 — FutureAGI](https://futureagi.com/blog/how-agentic-rl-trains-autonomous-agents-2026)
- [Ornith: The Open-Source Coding Dark Horse Built on Self-Improvement RL](/en/posts/tech/2026-08-26-ornith-deepreinforce-model-family-en) — this site
- [Nous Research: From Research Collective to Open-Source AI Ecosystem Rebel](/en/posts/tech/2026-08-26-nous-research-hermes-en) — this site
- [MiniMax: The Chatbot Company That Built a Coding Model Crushing Closed-Source on Cost](/en/posts/tech/2026-08-26-minimax-model-family-en) — this site
