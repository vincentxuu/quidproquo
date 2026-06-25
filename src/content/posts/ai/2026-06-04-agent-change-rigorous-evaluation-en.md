---
title: "How to Rigorously Compare Before and After Agent Changes: From Golden Sets to Statistical Testing"
date: 2026-06-04
category: ai
type: deep-dive
tags: [evaluation, rag, llm-judge, ab-testing, ai-agent, llm]
lang: en
tldr: "Even with temperature=0, LLM outputs can still fluctuate by up to 15% in practice. To rigorously compare agent changes, you need a frozen golden set, at least 3 runs per query averaged out, LLM-as-judge blind evaluation (pairwise preference flip rate reaches 35%), and paired statistical tests -- not just running each version once and going by feel."
description: "A practical methodology for LLM agent evaluation: golden set sizing, rubric design, variable control, LLM-as-a-judge biases and calibration, paired statistical testing, dual-layer RAG metrics, and the staircase from offline eval to online A/B testing."
draft: false
glossary:
  - term: "golden set"
    aliases: ["golden dataset"]
    definition: "A frozen, unchanging test set with ground-truth answers or human ratings; both the before and after versions are run against the same set so comparisons are meaningful."
    context: "This article treats the golden set as the North Star of the entire evaluation methodology."
  - term: "rubric"
    aliases: ["scoring criteria"]
    definition: "A set of concrete, item-by-item scoring criteria that decompose 'good answer' into measurable dimensions (correctness, completeness, tone, etc.), making scores from humans or LLM-as-judge repeatable and comparable."
    context: "This article uses rubric design to reduce variance in subjective scoring."
---

> 🌏 [中文版](/posts/ai/2026-06-04-agent-change-rigorous-evaluation)

After tweaking a prompt, swapping a model, or changing knowledge base parameters, the most common way people validate is "ask a few questions before and after and see which one feels better." The problem is this approach will almost certainly fool you. This article lays out a practical methodology: how to build a test set, how to use an LLM as a judge without being misled by its biases, how to use statistics to determine whether differences are real, and what RAG systems specifically need to measure. The core idea fits in one sentence -- rigor = controlled variables + frozen baseline + sufficient samples + repeated sampling to suppress variance + statistical testing.

## Why "Run Each Version Once" Doesn't Count

Three inherent traps make intuitive comparison unreliable.

The first is **non-determinism**. Most people assume setting temperature to 0 makes output fixed, but the 2024 paper "Non-Determinism of 'Deterministic' LLM Settings" (arXiv 2408.04667) tested five major hosted LLMs across eight tasks and found that "even under supposedly deterministic settings, accuracy variance across runs reached up to 15%." In other words, the before-and-after difference you observed may just be random fluctuation between different calls to the same version.

The second is **confirmation bias**. Without fixed ground-truth answers and scoring criteria, "the new version seems better" is often because you already know which one is new and subconsciously want to prove the change worked.

The third is **small-sample illusion**. Trying 5 questions and feeling improvement isn't enough to represent real traffic distribution, let alone support any statistical conclusion.

The antidote to these three problems is the five design decisions below.

## Step 1: Freeze a Golden Set

The golden set is the North Star of the entire evaluation -- a fixed test set with ground-truth answers or human ratings. Both versions run against the same set so comparisons are meaningful.

How large should it be? Galtea's 2026 evaluation guide offers practical rules of thumb: "50 questions can detect major regressions; 200 questions give statistical confidence for 3--5% quality changes; beyond 500 is diminishing returns unless your application has many heterogeneous sub-tasks that need separate coverage." You don't need to get there all at once. Datadog recommends "start with 20--50 questions covering core use cases to validate the process early," then gradually grow from production traces.

Questions should ideally come from real conversation logs (most representative), deliberately including high-frequency questions, controversial questions, previously incorrect answers, and boundary/red-team cases -- the golden set covers "failures you've already seen," while pre-launch adversarial testing finds the ones you haven't. Each question should be annotated with at least: the question, expected answer/key points, category, and difficulty.

The most critical discipline is to **freeze and version-control everything**. Rubrics, datasets, and graders should all be in version control with changelogs. Statsig specifically warns: "protect your historical baseline so that a rubric change does not masquerade as a model win."

## Step 2: Lock Down the Rubric First

Don't just use "good/bad." Rubrics come in two flavors: **analytic (score per criterion)** and **holistic (single overall score)**. Analytic is easier to debug and reveals "why it's bad," making it suitable for long-term monitoring and root cause analysis; holistic is cheaper but hides trade-offs.

Write down the criteria and attach good/bad examples before scoring -- don't define standards as you go. But be prepared: the first version of any rubric will be wrong. Galtea puts it bluntly -- "scoring criteria aren't designed, they're discovered through scoring. Any rubric's first version will fail in ways you can't predict, until you watch it fail on real cases." So the correct process is: trial-score with real outputs first, see where two people would give different scores or where the rubric doesn't cover something, then iterate.

## Step 3: Control Variables, Run Each Question Multiple Times

Two principles.

**Change only one variable at a time.** If you're changing the prompt this time, don't swap the model simultaneously -- otherwise you can't attribute score changes to either one. For RAG systems, prompt changes and knowledge base/retrieval parameter changes should be separate experiments.

**Run each question at least 3 times and average.** Since non-determinism can't be eliminated, use repeated sampling to average it out. The practical approach is to set an "acceptable variance band" rather than a hard threshold -- SitePoint's testing guide recommends "run at least three times (the minimum for a stable average) then take the mean, and set a variance band rather than a hard cutoff." For critical cases, you can go further with the pass^k concept: it only counts as passing if all k runs pass.

## LLM-as-a-Judge: Blind Evaluation and Choosing the Right Protocol

Once sample sizes grow, you need an LLM as the judge. Two commonly overlooked decisions arise here.

**Pointwise (absolute scoring) or pairwise (A/B pick one)?** Pairwise is closer to human preferences and suits "is candidate B better than baseline A" selection decisions. But it has a serious weakness: Tripathi et al. in their COLM 2025 paper "Pairwise or Pointwise?" quantified that "pairwise preferences flip in about 35% of cases due to distractor features, while absolute scoring flips only about 9%." That means the generation side can game the pairwise judge by inserting appealing but irrelevant features. Conclusion: use pairwise for selection, analytic pointwise for long-term monitoring and debugging.

**Handle known biases.** Evidently's guide catalogs three classic biases: position bias (preferring whichever comes first), verbosity bias (preferring longer answers), and self-enhancement bias (preferring outputs from the same model family). The standard fix for position bias is **swap-and-average**: run each pair with A/B order swapped, and only count it as high-confidence if both runs agree on the winner.

Finally, always do **blind evaluation**: hide which version is new/old during scoring and randomize the order. Sample 10--20% for human re-evaluation to confirm the judge aligns with humans. For high-stakes samples, consider using a jury/panel (multiple heterogeneous models voting) instead of a single judge to improve reliability.

## Use Statistics to Decide, Not Gut Feeling

Turning before-and-after scores into actionable evidence requires several steps:

- **Paired difference analysis.** The same question is tested in both versions, making this a paired design. A paired t-test is more powerful than "compute each mean separately then subtract" because within-question variance gets absorbed.
- **Choose the right test.** Use Welch's t-test for mean shifts; use nonparametric tests for medians or ranks.
- **Calculate MDE and power first.** Cameron Wolfe's "Applying Statistics to LLM Evaluations" points out that required sample size increases as "variance grows, the effect you want to detect shrinks, and the confidence level you require rises" -- which also explains why verifying a 3--5% improvement needs ~200 questions.
- **Run an A/A test.** Split the same version into two groups and compare them against each other to measure the baseline of "natural variance." If even the A/A test produces apparently significant results, your pipeline noise is too high for any A/B conclusion to be trustworthy.
- **Always examine regressions.** Average scores going up while an entire category of questions collapses is often more important than the aggregate number.

## RAG Systems Need Dual-Layer Metrics

If your agent is a RAG system (retrieve then generate), overall scores can't tell you whether the problem is in retrieval or generation. The consensus from RAGAS and DeepEval is to **evaluate the retriever and generator separately**:

| Layer | Metric | What It Asks |
|---|---|---|
| Generator | **Faithfulness (hallucination rate)** | Does the answer only come from retrieved content? Did it fabricate anything? |
| Generator | **Answer Relevancy** | Does the answer actually address the question? |
| Generator | Answer Correctness | Compared to ground truth, is it correct and complete? |
| Retriever | **Context Precision / Recall** | Is the retrieved content relevant? Were all necessary items retrieved? |

Faithfulness directly measures hallucination. RAGAS's algorithm is intuitive: decompose the generated answer into N declarative statements, check each one against whether it can be inferred from the retrieved context, and the proportion that can be inferred is the score. For more reliable hallucination detection, you can also use a dedicated classification model (such as Vectara HHEM) instead of LLM-as-judge -- classification models are more stable than having another LLM make the judgment.

## High Offline Scores ≠ Online Wins

Offline eval and online A/B testing are complementary, not either-or. Offline is suited for pre-launch regression testing and model selection (repeatable, controlled, safe); online is the only way to measure real user behavior (task completion rate, follow-up rate, satisfaction) and distribution drift. Growthbook and Llama's deployment docs both recommend a progressive rollout staircase:

```
Offline eval (CI)  ──►  shadow mode  ──►  feature flag small traffic  ──►  online A/B
  block regressions     mirror traffic       small-scale real exposure      measure business metrics
                        to new version
                        without showing users
```

The value of shadow mode is running the new version on real traffic without affecting users. Growthbook cites DoorDash's example, where they observed a 4% accuracy gap between testing and production -- exactly the kind of discrepancy shadow mode is designed to catch early. Finally, feed the hard cases from A/B back into the golden set, and the whole system becomes a self-reinforcing flywheel.

## How to Choose Tools

If starting from scratch, you don't need a full platform right away. Get the process running with lightweight tools first:

| Tool | Positioning | Best For |
|---|---|---|
| **promptfoo** | YAML + CLI, CI regression, matrix comparison, generates before/after on PRs | Regression testing during prompt/model iteration |
| **DeepEval** | Python library, broadest metric coverage (including faithfulness) | Code-oriented, integrates into CI |
| **RAGAS** | Most complete academic metrics for RAG | Systems with a retrieval layer |
| **Braintrust / LangSmith** | Platform, side-by-side comparison, human annotation, release gating | When PMs and engineers need to review results together |

Mature teams often run two systems simultaneously: one for development-phase evaluation (promptfoo or DeepEval) and one for production observability (Arize Phoenix / Langfuse / Braintrust). The all-free combination is promptfoo + Arize Phoenix.

## Putting It All Together

The minimum viable rigorous version is actually not hard: 30--50 frozen golden set questions, change only one variable at a time, run each question 3 times, LLM-as-judge blind evaluation (pairwise + swap-and-average) with sampled human re-evaluation, compute paired win rates and watch the regression list. If you need confidence in 3--5% improvements, scale the golden set to ~200 questions, run an A/A test first to measure the baseline, and do a paired t-test. For major changes, don't trust offline scores alone -- follow the shadow, small traffic, A/B staircase.

The real cost isn't in the tools but in maintaining that golden set and rubric -- yet it's also the only thing that lets you replace "it feels better" with "there's evidence it's better."

## References

- [Non-Determinism of "Deterministic" LLM Settings (arXiv 2408.04667)](https://arxiv.org/html/2408.04667v5)
- [Galtea — The complete guide for LLM evaluations 2026](https://galtea.ai/blog/llm-evaluation-complete-guide)
- [Datadog — Offline evaluation for AI agents: Best practices](https://www.datadoghq.com/blog/offline-llm-evaluations)
- [Statsig — Golden datasets: Creating evaluation standards](https://www.statsig.com/perspectives/golden-datasets-evaluation-standards)
- [Tripathi et al., COLM 2025 — Pairwise or Pointwise? Evaluating Feedback Protocols for Bias in LLM-Based Evaluation](https://openreview.net/forum?id=uyX5Vnow3U)
- [A Systematic Study of Position Bias in LLM-as-a-Judge (IJCNLP 2025)](https://aclanthology.org/2025.ijcnlp-long.18.pdf)
- [Evidently AI — LLM-as-a-judge: a complete guide](https://www.evidentlyai.com/llm-guide/llm-as-a-judge)
- [Cameron R. Wolfe — Applying Statistics to LLM Evaluations](https://cameronrwolfe.substack.com/p/stats-llm-evals)
- [Statsig — A/B testing for LLMs: When statistical significance misleads](https://www.statsig.com/perspectives/abtesting-llms-misleading)
- [SitePoint — Testing AI Agents: Deterministic Evaluation in a Non-Deterministic World](https://www.sitepoint.com/testing-ai-agents-deterministic-evaluation-in-a-non-deterministic-world)
- [RAGAS docs — Faithfulness](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness)
- [DeepEval — Faithfulness metric](https://deepeval.com/docs/metrics-faithfulness)
- [Vectara — Evaluating RAG with RAGAs (HHEM)](https://www.vectara.com/blog/evaluating-rag)
- [Growthbook — AI Evals vs. A/B Testing: Why You Need Both to Ship GenAI](https://www.growthbook.io/blog/ai-evals-vs-a-b-testing-why-you-need-both-to-ship-genai)
- [Llama docs — A/B testing in production](https://www.llama.com/docs/deployment/a-b-testing)
- [promptfoo](https://www.promptfoo.dev/) ・ [DeepEval](https://deepeval.com/) ・ [RAGAS](https://docs.ragas.io/) ・ [Braintrust](https://www.braintrust.dev/) ・ [LangSmith](https://www.langchain.com/langsmith)
