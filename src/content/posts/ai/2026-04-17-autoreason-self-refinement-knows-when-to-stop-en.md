---
title: "Autoreason: Teaching LLMs When to Stop Self-Refining"
date: 2026-04-17
type: guide
category: ai
tags: [autoreason, nous-research, self-refinement, llm, borda-count, iterative-reasoning, ai-agent]
lang: en
tldr: "Autoreason replaces the traditional critique-and-revise loop with a competitive multi-version evaluation mechanism (A/B/AB + blind Borda count), solving three structural problems in LLM self-refinement: prompt bias, scope creep, and lack of restraint."
description: "A deep dive into Nous Research's Autoreason — a competitive evaluation mechanism that makes LLM iterative self-refinement actually converge, covering its algorithm design, experimental results, and limitations."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-17-autoreason-self-refinement-knows-when-to-stop)

Having an LLM repeatedly revise its own output until it improves — the idea sounds intuitive, but in practice it breaks down easily. Autoreason is a paper from Nous Research that identifies three structural flaws in traditional self-refinement pipelines and proposes a "tournament"-based alternative. This article breaks down its mechanism design, experimental results, and applicability boundaries.

## What Goes Wrong with Traditional Self-Refinement

Nearly all iterative self-refinement follows this pattern: generate -> critique -> revise based on critique -> critique again -> revise again... The paper identifies three structural problems with this loop:

**Prompt Bias**: When you ask a model to "find flaws in this text," it will almost always find some — even if the original text has no real issues. The model hallucinates non-existent defects to comply with the instruction.

**Scope Creep**: Each revision round tends to add more content. After several rounds, the output grows uncontrollably and drifts away from the original objective.

**Lack of Restraint**: The model almost never responds with "no changes needed." Even when the current version is already good enough, it will force changes that actually make things worse.

The root cause of all three problems is the same: in traditional pipelines, "keep it as is" is not a valid option.

## Core Mechanism: Competitive Multi-Version Evaluation

Autoreason's solution isn't to patch the critique-and-revise loop — it replaces it entirely. Each iteration becomes an elimination tournament:

```
Task prompt → Generate incumbent (Version A)
              │
              ├── Critic Agent → Write critique
              ├── Author B → Generate adversarial revision based on critique (Version B)
              └── Synthesizer → Merge the strengths of A and B (Version AB)
                        │
                  Judge Panel (3-7 fresh judges)
                  Blind Borda Count voting
                        │
                  Winner → Becomes the new A
                  ↓
                  A wins two consecutive rounds → Terminate
```

Key design decisions:

1. **Three candidate versions** — A (unchanged), B (adversarial revision), AB (synthesis). Keeping things as they are is always a legitimate first-class option.
2. **Fresh judge agents** — Each round's judges are freshly instantiated with no shared context with the agents that produced the candidates. This avoids self-confirmation bias.
3. **Blind Borda Count** — Judges cannot see which version is the "original" and rank purely based on quality. The Borda count scoring method ensures ranking information isn't wasted (unlike simply voting for "which is best").
4. **Convergence condition** — When Version A wins two consecutive rounds, the system deems it converged and stops iterating.

## Why Both B and AB Need to Exist

The paper's ablation experiments answer this question: removing either B or AB causes convergence speed to balloon from 2-3 rounds to 24 rounds.

B represents "major changes" — it makes adversarial revisions based on critique and may completely flip the direction. AB represents "conservative fusion" — it tries to preserve A's strengths while incorporating B's improvements. Having both present allows judges to choose between "radical change" and "incremental improvement," rather than being stuck with only "change" or "don't change" as the two extremes.

## Experimental Results

### Writing Tasks

8 tasks (5 open-ended + 3 constrained), each run for 15 iterations:

- 3 tasks achieved a perfect score of 42/42
- Length-controlled win rate: 21/28 beat the baseline
- Haiku 3.5's output length shrank by 59-70% after 15 rounds — the system isn't inflating, it's converging and refining

### Code Tasks

150 CodeContests competitive programming problems across 4 model tiers:

| Model | Autoreason | Baseline |
|-------|-----------|----------|
| Sonnet 4.6 | 77% | 73% (single-pass) |
| Haiku 3.5 (matched compute) | 40% | 31% (best-of-6) |

Under the same compute budget, Autoreason outperforms the brute-force "sample multiple times and pick the best" strategy.

### Effect of Judge Count

- 7 judges converge 3x faster than 3 judges
- More judges = fewer rounds = stop sooner

## Limitations and Boundaries

The paper honestly discloses several important limitations:

**Model Capability Threshold**: Haiku 4.5 (60% baseline accuracy) starts showing disappearing held-out gains. When the gap between a model's generation ability and evaluation ability narrows below a certain point, the tournament mechanism's advantage becomes negligible. The paper calls this "generation-evaluation gap closure."

**Weak Models Actually Regress**: For Haiku 3.5 using traditional critique-and-revise, output shrinks by 59-70% — not refinement, but collapse. This is exactly the problem Autoreason aims to solve, but it also shows that weak models' self-evaluation capabilities are inherently unreliable.

**Sonnet 4.6's Scaling Bottleneck**: The paper tried 8 different approaches to push Sonnet 4.6's results further — all failed. This suggests that for strong models, this method may already be near its ceiling.

## Repo Structure

```
paper/                          # LaTeX paper source and PDF
tasks/                          # 8 task prompts
human_eval/                     # Human blind evaluation materials
experiments/v2/
  ├── run_overnight.py          # Writing task runner
  ├── run_code_overnight.py     # CodeContests runner
  ├── run_code_haiku45.py       # Haiku 4.5 specific
  ├── run_multi_seed.py         # 15-run repeated experiments
  ├── run_ablations.py          # Ablation experiments
  ├── compute_stats.py          # Bootstrap CI + McNemar test
  └── results_*/                # Experiment result data
```

The paper is written in TeX (80.8%), with experiment code in Python (19.2%). Statistical analysis includes bootstrap confidence intervals and the McNemar test — not just running a few trials and drawing conclusions.

## Implications for AI Agent Development

Autoreason's design philosophy offers several takeaways for agent development:

1. **"Do nothing" must be a valid option** — Any loop-based agent should have explicit stopping conditions, and "maintain the status quo" should be treated as a legitimate choice, not a failure.
2. **Evaluators and executors must be separated** — Using the same context for both generation and evaluation makes self-confirmation bias nearly inevitable.
3. **Multiple candidates > single revision** — Generating multiple candidates with different directions and comparing them is more efficient than "revise once and see if it's better."
4. **Convergence matters more than improvement** — A system that knows when to stop is more reliable than one that keeps revising forever.

## Overall Assessment

Autoreason's core trade-off is **spending more compute to guarantee convergence**. Each round requires generating 3 candidates + 3-7 judges, consuming several times the compute of traditional self-refine. But what it buys is: the system knows when to stop, won't degrade with each revision, and won't inflate indefinitely.

Suitable scenarios are tasks where high-quality output matters more than compute cost — writing, code generation, anything that requires "polishing until it's right." Unsuitable scenarios include real-time responses, low-latency requirements, or cases where the model itself is already weak (effectiveness is limited when the generation-evaluation gap isn't large enough).

The paper was co-authored by SHL0MS and Hermes Agent — yes, the second author is an AI agent.

## References

- [Autoreason GitHub](https://github.com/NousResearch/autoreason)
- [Nous Research Official Website](https://nousresearch.com/)
- [Borda Count — Wikipedia](https://en.wikipedia.org/wiki/Borda_count)
- [CodeContests — Competitive Programming Benchmark](https://github.com/google-deepmind/code_contests)
- [Hermes Agent — Nous Research's AI Agent Framework](https://github.com/NousResearch/hermes-agent)
