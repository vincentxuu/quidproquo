---
title: "RAG A/B Testing: A Scientific Approach to Comparing Pipeline Configurations"
date: 2026-03-12
type: guide
category: ai
tags: [rag, ab-testing, experimentation, metrics, pipeline]
lang: en
tldr: '"Adding a Cross-Encoder feels better" is not a scientific evaluation. A/B testing tells you whether a change actually works, how much it helps, and which query types benefit.'
description: "How to design A/B tests for RAG systems: traffic splitting, metric selection, statistical significance, and how to avoid common testing pitfalls."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-12-rag-ab-testing)

Every change to a RAG system should be validated through A/B testing. Without a control group, you can't tell whether an improvement came from the change itself or from natural shifts in query distribution.

## Why RAG A/B Testing Is Hard

A few factors make RAG testing more complex than typical web feature A/B tests:

**Answer quality is hard to quantify automatically**: Unlike click-through rate, which you can measure directly, whether a response is "good" requires human judgment or LLM-as-Judge — both of which introduce noise.

**Query diversity**: The same configuration can behave completely differently on simple vs. complex queries. Aggregate scores can hide subgroup problems.

**Order effects**: Users remember their previous answers. If the same user alternates between seeing responses from A and B, a comparison effect can emerge.

**Small sample sizes**: Rate limits constrain query volume, and you may not reach statistical significance quickly.

## Traffic Splitting

**User-level assignment** (recommended):

```typescript
function assignVariant(userId: string): 'A' | 'B' {
  // Stable assignment via userId hash — same user always sees the same variant
  const hash = murmurhash(userId) % 100;
  return hash < 50 ? 'A' : 'B';
}
```

The same user always lands in the same group, keeping the experience consistent.

**Request-level assignment** (for rapid iteration):

```typescript
function assignVariant(): 'A' | 'B' {
  // Randomly assign per request — accumulates comparison data faster
  return Math.random() < 0.5 ? 'A' : 'B';
}
```

Request-level assignment accumulates samples faster, but the same user may see inconsistent responses.

## Change One Variable at a Time

Test only one change per experiment. A common anti-pattern: "Let's add HyDE and Cross-Encoder at the same time and see what happens" — even if results improve, you won't know which change drove the gain, or whether the two interact.

**The right approach**:

```
Experiment 1: Control (no HyDE) vs. Treatment (HyDE enabled)
  → Only the HyDE toggle differs; everything else is identical

Experiment 2: Control (no reranking) vs. Treatment (reranking enabled)
  → Built on the winning config from Experiment 1; only reranking differs
```

## Metric Design

**Primary metrics** (the ones that determine success or failure):

| Metric | Description | How to measure |
|--------|-------------|----------------|
| Groundedness | Response accuracy | Average LLM-as-Judge score |
| User Satisfaction | User satisfaction | thumbs up / (thumbs up + thumbs down) |
| Task Completion | Query resolution rate | Fraction of queries with no follow-up clarification |

**Secondary metrics** (supporting signals):

| Metric | Description |
|--------|-------------|
| Latency p50/p99 | Confirm the change didn't make things slower |
| Context Precision | Relevance of retrieved documents |
| Cache Hit Rate | Whether the change affected cache efficiency |

**Guardrail metrics** (stop the experiment if any threshold is breached):

- Latency p99 exceeds 15 seconds
- Error rate exceeds 5%
- Average Groundedness falls below 0.5

## Sample Size Calculation

Calculate the required sample size before collecting data:

```python
from scipy import stats
import math

def required_sample_size(
    baseline_rate: float,  # Current metric (e.g. Groundedness = 0.72)
    minimum_effect: float, # Minimum detectable improvement (e.g. +0.05 = 5%)
    alpha: float = 0.05,   # Significance level
    power: float = 0.80,   # Statistical power
) -> int:
    effect_size = minimum_effect / math.sqrt(
        baseline_rate * (1 - baseline_rate)
    )
    n = stats.norm.ppf(1 - alpha/2) + stats.norm.ppf(power)
    return math.ceil((n / effect_size) ** 2)

# Example: baseline Groundedness 0.72, target improvement 5% — how many samples?
n = required_sample_size(0.72, 0.05)
print(f"Samples needed per group: {n}")  # Roughly 500–1000
```

If rate limits keep daily query volume in the hundreds, you may need to run the test for several weeks to collect enough samples.

## Subgroup Analysis

A good overall metric doesn't mean all query types improved. Subgroup analysis is essential:

```sql
-- Analyze A/B results by query type
SELECT
  variant,
  query_type,
  AVG(judge_groundedness) as avg_groundedness,
  AVG(judge_quality) as avg_quality,
  COUNT(*) as sample_count
FROM ai_query_logs
WHERE experiment_id = 'exp-2026-03-01'
  AND created_at BETWEEN :start AND :end
GROUP BY variant, query_type;
```

You might find:
- HyDE improves complex queries by 10%, but actually hurts simple queries (unnecessary overhead)
- Cross-Encoder helps most with comparison queries spanning multiple entities

These subgroup findings are more valuable than aggregate averages — they guide more precise `skipWhen` condition design.

## Decision Framework

```
After the experiment ends:

1. Did the primary metric improve significantly?
   No → Discard the change (there may be other issues)

2. Did all guardrail metrics pass?
   No → Discard (the cost is too high)

3. Did any subgroup degrade significantly?
   Yes → Consider enabling the new config only for specific query types

4. Is statistical significance sufficient (p < 0.05)?
   No → Extend the experiment or lower the target effect size

All pass → Roll out to 100%
```

## Takeaway

RAG A/B testing doesn't require fancy tooling. The fundamentals are: clean controlled design (one variable at a time), the right metrics (primary + guardrails), sufficient sample size, and subgroup analysis.

The most important habit: **add an `experiment_id` column when the system first goes live** — don't wait until you need to run a test only to find there's no data to analyze. Design for observability upfront so every change is backed by data.

---

## References

- [Learning Metrics that Maximise Power for Accelerated A/B-Tests](https://arxiv.org/abs/2402.03915)
- [Machine Learning Testing: Survey, Landscapes and Horizons](https://arxiv.org/abs/1906.10742)
- [Dynamic Causal Effects Evaluation in A/B Testing with a Reinforcement Learning Framework](https://arxiv.org/abs/2002.01711)
- [Large-Scale Validation and Analysis of Interleaved Search Evaluation (Chapelle et al., 2012)](https://www.cs.cornell.edu/~tj/publications/chapelle_etal_12a.pdf)
- [RAG Pipeline A/B 測試指標設計：Groundedness 與 LLM-as-Judge (RAG Survey 2024)](https://arxiv.org/abs/2312.10997)
