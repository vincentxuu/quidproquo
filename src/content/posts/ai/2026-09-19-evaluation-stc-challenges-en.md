---
title: "Evaluation Challenges: Why Deep Research Is Hard to Measure"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, evaluation, benchmark, hallucination, STC, citation]
lang: en
tldr: "A deep research agent produces a report—maybe thousands of words with dozens of citations. How do you score it? Using LLMs as judges is biased, asking humans is too expensive, and benchmarks can't keep up. STC and other recent approaches try to solve this from the 'confidence' angle—but there's no perfect answer yet."
description: "Deep analysis of the three major evaluation dilemmas for deep research agents: LLM judge bias, human evaluation cost, and benchmark-reality gap. STC methods tackle this from confidence calibration, but the evaluation problem remains unsolved."
draft: false
series:
  name: "Deep Research 前沿"
  order: 7
---

> 🌏 [中文版](/posts/ai/2026-09-19-evaluation-stc-challenges)

The previous articles all looked at "how to do better." This one addresses a more fundamental question: **how do we know if it's any good?**

A deep research agent produces a report—maybe thousands of words with dozens of citations. How do you score it?

This problem is harder than it looks. Three core dilemmas:

1. **LLM judges are biased**: Using GPT-4 to evaluate DeepResearch's reports is like having one AI judge another
2. **Human evaluation is too expensive**: A report requires domain experts spending hours reviewing
3. **Benchmarks don't match reality**: Benchmarks measure "standard answers," but deep research's value is in the "process"

**STC (Self-Trustworthiness Calibration)** is a recent attempt that tackles this from the "confidence" angle—making the agent judge how accurate its own claims are.

## Three Major Evaluation Dilemmas

### Dilemma 1: LLM Judge Bias

Both DeepResearch Bench and DeepResearch Bench II use LLMs as judges (usually Gemini 2.5-Pro). This has structural problems:

- **Judge and defendant are from the same family**: Both use models from the same model family
- **Rewards long-windedness**: LLM judges tend to give higher scores to longer reports, but longer doesn't mean better
- **Inconsistent benchmarks**: Different LLM judges can vary scores by 20%

DeepResearch Bench's experiments show: LLM-judge agreement with human experts is about 91.75% (accuracy) and 89.57% (F1). That sounds good—but it means nearly 10 out of every 100 judgments are wrong.

### Dilemma 2: Human Evaluation Cost

DeepResearch Bench II uses 9,430 expert-written rubrics covering 132 tasks. Each rubric is written by a domain expert.

Costs:
- Each rubric takes ~15-30 minutes to write
- 132 tasks × 70+ rubrics = 9,000+ evaluation criteria
- Total cost estimated in hundreds of thousands of dollars

This means: **almost no research team can afford their own benchmarks**. They can only rely on benchmarks released by a few major laboratories.

### Dilemma 3: Benchmark-Reality Gap

Existing benchmarks (DeepResearch Bench, GAIA, WebWalkerQA) evaluate:
- Question-answer correctness (closed-ended)
- Report completeness (open-ended)
- Citation accuracy

But real-world deep research value isn't about these:
- Users ask vague questions, not precise benchmark problems
- Process matters more than outcome—how the agent finds the answer is more valuable than the answer itself
- Adaptability—flexibility when facing new problems

## STC: Starting from Confidence

STC's core idea is elegant: **instead of directly evaluating whether the answer is right, evaluate whether the agent's "confidence" in its answer is accurate.**

### Core Mechanism

```
agent produces answer → agent declares confidence → verify whether confidence matches actual accuracy
```

If an agent says "I'm 90% sure" but actual accuracy is only 50%, its confidence is **overinflated**. Conversely, if it says "I'm only 30% sure" but accuracy is 80%, it's **overconservative**.

A good agent should:
- High confidence ↔ High accuracy
- Low confidence ↔ Low accuracy

### Practice

STC's method:
1. During reasoning, let the agent **voluntarily declare** its current answer's confidence
2. Compare declared confidence with actual correctness
3. Use this gap as an evaluation metric—instead of only looking at the final answer

Benefits:
- **No external judge needed**: Agent self-evaluates
- **Aligned with real use cases**: Users care not just "is the answer right" but "how reliable is the answer"
- **Encourages honesty**: Overconfident agents are penalized

### Limitations

STC hasn't solved everything:
- Agents can learn to "declare high confidence" while being inaccurate
- Confidence quantification standards are inconsistent
- For open-ended research questions, "accuracy" itself is hard to define

## Current State: No Perfect Answer

| Method | Pros | Cons |
|---|---|---|
| LLM Judge | Automated, low cost | Biased, inconsistent |
| Human Evaluation | Accurate | Extremely expensive, not scalable |
| STC Confidence | Aligned with use cases, encourages honesty | Quantification standards inconsistent |
| Fact-checking | Precise for citations | Only covers part of content |

**No single method is perfect.** Reality demands hybrid evaluation:
- STC as first filter (agents with inaccurate confidence are eliminated)
- LLM judges as second pass (structured scoring)
- Random human sampling as third pass (calibration)

## Key Takeaways

1. **Evaluation is harder than training**—an agent can be trained well but not know if what it's doing is good
2. **Confidence is the first real-world metric**—users need not just answers but how reliable they are
3. **Benchmarks are references, not truth**—scoring 50% on DeepResearch Bench II means "50% of expert standards not met"

## References

- [DeepResearch Bench II: Diagnosing Deep Research Agents via Rubrics from Expert Reports](https://arxiv.org/abs/2601.08536) — 132 tasks, 9,430 rubrics, expert-level evaluation.
- [DeepResearch Bench](https://deepresearch-bench.github.io) — 100 PhD-level tasks, RACE + FACT dual evaluation.
- [AA-Omniscience: Knowledge and Hallucination Benchmark](https://artificialanalysis.ai/evaluations/omniscience) — Confidence and hallucination benchmark.
- [BrowseConf: Confidence-Guided Test-Time Scaling for Web Agents](https://arxiv.org/abs/2510.23458) — Confidence-guided test-time scaling, ACL Findings 2026.
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — Previous article: three-phase landscape classification.
