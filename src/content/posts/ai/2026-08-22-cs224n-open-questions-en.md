---
title: "CS224N Lecture 19: How Small Models Can Move Beyond Brute-Force Scaling"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, reasoning, small-language-model, synthetic-data, stanford]
lang: en
series:
  name: "Stanford CS224N 導讀"
  order: 20
tldr: "The final lecture frames Open Questions in NLP 2026 as smart scaling: prolonged RL, Prismatic synthetic data, RL as pretraining, and open collaboration seek reasoning gains beyond adding parameters."
description: "A lecture-by-lecture reading of CS224N Winter 2026 Lecture 19: ProRL, Prismatic Synthesis, RL as pretraining, OpenThoughts, and open reasoning questions."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224n-open-questions)

The [official CS224N Winter 2026 schedule](https://web.stanford.edu/class/cs224n/) places the final regular unit on March 10, 2026, but does not name a lecturer; this article therefore attributes it only to the course staff. The [official deck](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture19-open-questions.pdf) develops *The Art of Artificial Reasoning for (Small) Language Models*. It has no single agenda slide but repeatedly names three forms of innovation: unconventional data, algorithms, and collaboration.

## The problem: change what scales

The deck begins from the concentration of extreme compute in a few organizations. Beyond brute-force scaling, it proposes learning faster from limited data, synthesizing data outside the existing internet distribution, and reasoning at test or training time.

This does not prove that scaling laws have ended. More precisely, resources move from parameters and pretraining tokens toward data generation, RL trajectories, inference search, and collaborative infrastructure.

## ProRL: keep reinforcement learning from stopping early

[ProRL](https://arxiv.org/abs/2505.24864) addresses reasoning RL saturation caused by entropy collapse or exhausted useful problems. Building on dynamic sampling and decoupled clipping from DAPO, it controls exploration and task difficulty so a small model can continue learning from verifiable tasks.

The lesson is not “longer training always wins.” Extended training needs new effective signal. If reward, tasks, and exploration remain unchanged, extra steps reinforce shortcuts.

## Prismatic Synthesis: expand the problem space

Prismatic Synthesis does more than paraphrase existing questions. It combines skills and structures to generate reasoning data beyond ready-made internet distributions. The deck uses it to discuss long chain-of-thought and cross-domain generalization.

Synthetic data still requires contamination, correctness, and diversity checks. A teacher producing many similar solutions may increase tokens without increasing effective problem variety.

## RL as pretraining: move reasoning earlier

The conventional pipeline pretrains with next-token prediction and adds reasoning later. This section explores introducing verifiable reward earlier in base-model formation so representations and generation receive reasoning signal from the start.

An important experiment remains: does benefit come from reward, curriculum, or added computation? Comparisons must hold total data and compute constant to identify the effect of moving RL earlier.

## Collaboration and the final open questions

Collaborative datasets such as [OpenThoughts](https://www.open-thoughts.ai/) represent the third route: organizations share recipes, models, and evaluation so smaller teams can accumulate reasoning infrastructure. Openness requires more than downloadable weights; provenance, licensing, generator versions, and decontamination matter.

The closing questions include how much reasoning is memorized, how to generate genuinely novel problems, how to simulate learnable environments, and how algorithms and data efficiency can narrow the gap for small models. These are a research agenda, not conclusions solved by one method.

## Accounting for smart scaling

Count model/data compute plus synthetic teachers, RL rollouts, verifiers, inference search, hardware, and lifecycle amortization.

## Data saturation is capability-specific

Audit duplicate, source concentration, difficulty, solution diversity, contamination, and validity; total tokens do not equal effective data.

## Learn better from limited data

Prove architecture, recipe, curriculum, and selection efficiency under iso-data/iso-compute controls with random baselines.

## Diagnosing the ProRL plateau

Monitor reward variance, entropy, clipping, difficulty, length, KL, and out-of-domain behavior. Dynamic sampling and entropy control preserve learnable signal.

## Effortless versus effortful RL

Compare marginal gain per rollout, not default training against a method with an unreported larger budget.

## Evaluating small reasoning models

Test reasoning, instruction following, general knowledge, safety, calibration, latency, memory, privacy, and equal-budget pass@k.

## Prismatic synthesis design

Track seed skills, composition, generation, solving, verification, filtering, diversity, and complete lineage.

## Synthetic-data quality gates

Require validity, novelty beyond semantic duplicates, diversity, learnable difficulty, safety/license, and transfer to real or other-generator sets.

## Long-rationale risks

Final correctness does not validate every step. Compare short/long controls and process/outcome supervision.

## RL as pretraining

Introducing verifiable reward earlier may shape base learning but can narrow language behavior. Compare stage timing at fixed data and compute.

## Front-loading reasoning

Test the representation hypothesis with sample-efficiency, transfer, intervention, and controlled learning curves rather than probes alone.

## Test-time training

Temporary updates can adapt to a stream but require poisoning defense, budget, isolation, validation, and rollback; compare against in-context learning.

## Collaboration as a technical variable

Open recipes, code, data, provenance, licenses, checkpoints, and evaluation enable independent reproduction, beyond publishing weights.

## Operationalizing “ego is the enemy”

Publish negative results, allow audits, avoid cherry-picking, design composable contributions, and make credit/governance explicit.

## Is reasoning memory or computation?

Use near-neighbor audits, counterfactual symbols, novel rules, and fresh tasks; no single behavioral test settles the ontology.

## Beyond internet data

Programmatic generators, simulations, games, formal systems, and self-play provide ground truth but inherit environment scope. Test cross-environment transfer.

## An open-question matrix

For prolonged RL, synthesis, early RL, small-model practicality, and collaboration, specify discriminating evidence and resource confounds before scaling.

## An executable small-model study

Compare SFT, equal-rollout RL, and controlled prolonged RL; contrast paraphrase and compositional synthetic data; report quality, entropy, compute, latency, regressions, seeds, and open artifacts.

## Material gap

Winter 2026 recordings are not public. This article follows four recurring themes in the public deck. It does not generalize leaderboard numbers across models or invent spoken conclusions.

## References

- [Official CS224N Winter 2026 course page](https://web.stanford.edu/class/cs224n/)
- [Lecture 19 Open Questions in NLP 2026 slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture19-open-questions.pdf)
- [ProRL](https://arxiv.org/abs/2505.24864)
- [OpenThoughts](https://www.open-thoughts.ai/)
