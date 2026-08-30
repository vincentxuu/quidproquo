---
title: "RAG Evaluation Frameworks and Tool Selection: Promptfoo, RAGAS, DeepEval, and TruLens"
date: 2026-03-12
updated: 2026-08-30
type: guide
category: ai
tags: [rag, evaluation, promptfoo, ragas, deepeval, trulens, metrics, quality]
lang: en
tldr: "No industry standard mandates one RAG evaluation tool. Measure retrieval, generation, and operations separately, then choose Promptfoo, RAGAS, DeepEval, or TruLens for the actual stack."
description: "RAG evaluation frameworks and tool selection: what formal standards require, how Promptfoo fits TypeScript CI, where RAGAS, DeepEval, and TruLens fit, and how an Ask AI retrieval incident becomes a regression test."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 37
---

> 🌏 [中文版](/posts/ai/2026-03-12-rag-evaluation-frameworks)

Evaluating RAG system quality is a hard problem: you can feel that the answers are bad, but you can't articulate which component is at fault — did the retriever fetch the wrong documents, or did the LLM extract incorrect information from the right documents?

Systematic evaluation frameworks quantify "feels bad" into concrete metrics, giving your optimization efforts a clear direction.

## Start with the conclusion: no standard mandates a tool

The NIST AI RMF makes **Measure** one of its core functions. ISO/IEC 42001 requires performance evaluation, monitoring, and continual improvement. Both expect organizations to evaluate effectiveness and reliability; neither tells them to install Promptfoo, RAGAS, DeepEval, or TruLens.

OpenTelemetry's GenAI attributes define fields for evaluation names, scores, labels, and explanations. They address how results are recorded and exchanged, not which scoring method to use.

Tool selection should therefore start with the regression you need to catch:

| Evaluation layer | Question | Useful checks |
|---|---|---|
| Retrieval | Did the system retrieve the required articles, and are the top results relevant? | Recall@k, Precision@k, MRR/nDCG, required-source assertions |
| Generation | Is the answer supported by context, and does it answer the query? | Faithfulness, Answer Relevance, Correctness |
| Operation | Did the change make the system slower, more expensive, or less reliable? | latency, token/API cost, error rate, retry rate |

Keep these layers separate. A single average can let fluent writing hide missing retrieval, while a quality score may say nothing about a severe latency regression.

## Promptfoo: start with CI regression tests in a TypeScript project

Promptfoo is an MIT-licensed TypeScript CLI and library. It can call ordinary HTTP endpoints and load custom providers. One suite can combine deterministic assertions with model-graded metrics, including context recall, context relevance, and context faithfulness.

For an Astro and Cloudflare Workers project, this is a shorter path than creating a Python evaluation environment first. There is still an integration boundary: this site's `/api/chat` endpoint streams SSE.

A custom provider must consume the stream and expose the final answer, retrieved sources, and context separately. Merely putting the endpoint URL into a config file is not a complete RAG evaluation.

Use two CI levels:

1. Run deterministic checks on every pull request: required slugs, forbidden sources, unique-source counts, output structure, and latency limits. This layer does not call a judge LLM.
2. Run model-graded checks daily or manually: context relevance, faithfulness, and answer relevance. Save reports first; only make them deployment-blocking after the judge model, judge prompt, and observed variance are fixed.

Promptfoo is an engineering choice for this repository, not a universal standard. A Python team, or a team already committed to LangSmith or Phoenix, may reasonably choose differently.

## RAGAS (RAG Assessment)

**Positioning**: The most widely cited RAG evaluation framework, defining the core metric system for RAG.

> **The API has been renamed.** This post was originally written against an early RAGAS version, when metrics were lowercase module-level instances (`faithfulness`, `answer_relevancy`, `context_precision`) and dataset columns were `question` / `answer` / `contexts` / `ground_truth`. Current RAGAS uses **class-based metrics**, and every column name has changed. The code below has been updated to the current API, but it is still moving — check the [official metric list](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/) before you build on it. The repo has also moved from `explodinggradients/ragas` to [`vibrantlabsai/ragas`](https://github.com/vibrantlabsai/ragas) (the old URL redirects).

### Four Core Metrics

Concepts first; the name mapping follows.

**Faithfulness**:
What proportion of the statements in the answer can be inferred from the context?

```
Answer: "The crux move on Longdong 5.11a is a sidepull that requires good footwork."
Context contains: "The crux of this route is a sidepull move."

Faithfulness = "sidepull" derivable from context + "footwork" not derivable from context
             = 1/2 = 0.5
```

Low Faithfulness = the LLM is hallucinating, adding information not present in the context.

**Answer Relevance (now called Response Relevancy)**:
How relevant is the answer to the original question? Uses an LLM to reverse-generate questions from the answer, then calculates semantic similarity between those generated questions and the original question.

Low Answer Relevance = the answer is off-topic and doesn't address the original question.

**Context Precision**:
Of the retrieved context chunks, how many are actually relevant?

```
Retrieved results: [Route A (relevant), Route B (irrelevant), Route C (relevant), Route D (irrelevant)]

Context Precision (RAGAS official formula, rank-sensitive) = Σ(Precision@k × v_k) / total relevant items
```

Low Context Precision = the retriever is introducing too much noise.

**Context Recall**:
Of the information required by the ground truth, how much was successfully retrieved? (Requires ground truth annotations.)

Low Context Recall = the retriever is missing critical information.

### Name Mapping and Current Usage

| Concept in this post | Current RAGAS class |
|---|---|
| Faithfulness | `Faithfulness` |
| Answer Relevance | `ResponseRelevancy` |
| Context Precision | `LLMContextPrecisionWithReference` (with reference) / `LLMContextPrecisionWithoutReference` |
| Context Recall | `LLMContextRecall` (a non-LLM `NonLLMContextRecall` also exists) |

Sample fields were renamed too: `question` → `user_input`, `answer` → `response`, `contexts` → `retrieved_contexts`, `ground_truth` → `reference`.

```python
from ragas import EvaluationDataset, SingleTurnSample, evaluate
from ragas.llms import LangchainLLMWrapper
from ragas.metrics import Faithfulness, LLMContextRecall, ResponseRelevancy

evaluator_llm = LangchainLLMWrapper(your_langchain_chat_model)

dataset = EvaluationDataset(samples=[
    SingleTurnSample(
        user_input="What beginner-friendly routes are there at Longdong?",
        retrieved_contexts=["The south wall of Longdong has multiple beginner routes ranging from 5.7-5.9…"],
        response="Longdong has several beginner-friendly routes…",
        reference="Beginner routes on Longdong's south wall are roughly 5.7-5.9.",
    ),
    # …
])

result = evaluate(
    dataset=dataset,
    metrics=[Faithfulness(), ResponseRelevancy(), LLMContextRecall()],
    llm=evaluator_llm,
)
print(result)
```

Note that `evaluate()` now requires you to pass an evaluator LLM explicitly — there is no implicit "defaults to some cloud model" behavior any more.

### Limitations of RAGAS

- The metrics are LLM-as-Judge, so score quality is tied to the judge model you pick; swapping the judge shifts the scores, which means the judge has to be pinned alongside every other variable
- The built-in prompts are written in English; non-English corpora (including Traditional Chinese) need a prompt language-adaptation pass first — the docs cover [how to adapt them](https://docs.ragas.io/en/stable/howtos/customizations/testgenerator/_language_adaptation/)
- Requires a reference (ground truth) to compute Context Recall
- High computational cost (multiple LLM calls per sample)

---

## DeepEval

**Positioning**: A developer-oriented RAG testing framework designed to integrate into CI/CD.

**Core Design**: Write RAG tests using the same mindset as unit tests.

```python
import pytest
from deepeval import assert_test
from deepeval.metrics import (
    FaithfulnessMetric,
    AnswerRelevancyMetric,
    ContextualPrecisionMetric,
)
from deepeval.test_case import LLMTestCase

def test_rag_quality():
    test_case = LLMTestCase(
        input="What beginner-friendly routes are there at Longdong?",
        actual_output="Longdong has several beginner-friendly routes rated between 5.8-5.9...",
        retrieval_context=[
            "The south wall of Longdong has multiple beginner routes ranging from 5.7-5.9...",
            "New climbers should start with routes that have dense protection points...",
        ],
        expected_output="Beginner routes on Longdong's south wall are roughly 5.7-5.9.",  # ContextualPrecision needs this
    )

    assert_test(test_case=test_case, metrics=[
        FaithfulnessMetric(threshold=0.7),
        AnswerRelevancyMetric(threshold=0.8),
        ContextualPrecisionMetric(threshold=0.7),
    ])
```

Run it with `deepeval test run <file>`, not plain `pytest`.

> **Do not use `HallucinationMetric` on RAG.** The original draft of this post paired `HallucinationMetric` with `retrieval_context`, which fails outright with a missing-parameter error: `HallucinationMetric` reads `context` (reference material you assert to be true), not `retrieval_context` (whatever your retriever actually pulled back). The [official docs](https://deepeval.com/docs/metrics-hallucination) say to use `FaithfulnessMetric` for RAG instead. These two fields look alike but mean completely different things — it's the most common DeepEval trap.

**Key Features**:
- pytest integration, runnable in CI/CD
- A large and still-growing metric set covering RAG, multi-turn conversation, agent trajectories, and safety — check the [metric list](https://deepeval.com/docs/metrics-introduction) rather than trusting any count you read in a blog post
- Local model support (not locked to one cloud API)
- Confident AI platform integration (visualize test results)

**Best For**:
- Teams with CI/CD pipelines that want to run RAG evaluations before every deployment
- Projects needing broad metric coverage

---

## TruLens

**Positioning**: An evaluation framework built around the "RAG Triad," providing clear definitions for the three critical questions in RAG.

### RAG Triad

TruLens decomposes RAG quality into three questions:

```
               [Query]
                  ↓
          [Context Retrieval]
                  ↓
           [LLM Generation]

Question 1: Context Relevance
  How relevant is the retrieved context to the query?
  (Prevents retrieval of irrelevant documents)

Question 2: Groundedness
  What proportion of the answer is grounded in the context?
  (Prevents LLM hallucination)

Question 3: Answer Relevance
  How relevant is the answer to the original question?
  (Prevents the LLM from going off-topic)
```

All three questions must score high for a RAG output to be considered high quality.

> **`Feedback` has been replaced by `Metric`.** TruLens unified its feedback-function interface: the old `Feedback(...)` plus chained `.on_input().on_output()` became `Metric(implementation=..., selectors={...})`. `Feedback` still exists but only as a deprecated alias that emits a warning, and the maintainers say it will be removed in the next major release — see the [official migration guide](https://www.trulens.org/component_guides/evaluation/metric_migration/). Also, you **cannot** pass a bound method like `provider.xxx_with_cot_reasons` straight into `feedbacks=` the way this post originally showed; it has to be wrapped in a `Metric` with explicit selectors, otherwise TruLens has no idea which field to feed the scoring function.

```python
import numpy as np
from trulens.apps.langchain import TruChain
from trulens.core import Metric, Selector, TruSession
from trulens.providers.openai import OpenAI

session = TruSession()
provider = OpenAI()

f_context_relevance = Metric(
    implementation=provider.context_relevance_with_cot_reasons,
    name="Context Relevance",
    selectors={
        "question": Selector.select_record_input(),
        "context": Selector.select_context(collect_list=False),
    },
    agg=np.mean,
)

f_groundedness = Metric(
    implementation=provider.groundedness_measure_with_cot_reasons,
    name="Groundedness",
    selectors={
        "source": Selector.select_context(collect_list=True),
        "statement": Selector.select_record_output(),
    },
)

f_answer_relevance = Metric(
    implementation=provider.relevance_with_cot_reasons,
    name="Answer Relevance",
    selectors={
        "prompt": Selector.select_record_input(),
        "response": Selector.select_record_output(),
    },
)

# Wrap your RAG chain
tru_recorder = TruChain(
    rag_chain,
    app_name="climbing-rag",
    feedbacks=[f_context_relevance, f_groundedness, f_answer_relevance],
)

# Every RAG call is automatically evaluated and recorded
with tru_recorder as recording:
    response = rag_chain.invoke({"query": "Beginner-friendly routes at Longdong"})
```

The selector keys (`question` / `context` / `source` / `statement` / `prompt` / `response`) are the scoring function's parameter names, so they change whenever you swap provider methods — check that method's API reference rather than copying keys around.

**Dashboard**:
```python
from trulens.dashboard import run_dashboard

session.get_leaderboard()   # Compare metrics across RAG configurations
run_dashboard(session)      # Launch the local UI
```

If you only want to score an already-collected dataset (a DataFrame) without attaching to a live app, there is now a `BatchEvaluator` for exactly that — cleaner than hand-building virtual records.

---

## How to read open source, stars, and maintenance

The following numbers are a GitHub repository snapshot taken on 2026-08-30. Stars indicate attention, not quality. A recent push proves that code changed, not that the API is stable. License, language, activity, and integration cost matter together.

| Project | License / primary language | Stars | Maintenance snapshot |
|---|---|---:|---|
| Promptfoo | MIT / TypeScript | 24,667 | pushed on 2026-08-30 |
| DeepEval | Apache-2.0 / Python | 17,957 | pushed on 2026-08-29; Python 4.2.0 released on Aug 24 |
| Ragas | Apache-2.0 / Python | 15,544 | last push on 2026-02-24; latest release was 0.4.3 on Jan 13 |
| Phoenix | Elastic License 2.0 / Python | 11,245 | pushed on 2026-08-29; source is available, but ELv2 should not be described as OSI open source |
| TruLens | MIT / Python | 3,529 | pushed on 2026-08-28; 2.13.1 released on Aug 20 |

If the requirements are a familiar OSI license, Node/TypeScript, CI support, community scale, and recent activity, Promptfoo is the best first step for this repository. DeepEval provides a more extensive testing framework when the team already maintains Python evaluation infrastructure. Ragas is useful for metric and dataset experiments. TruLens and Phoenix move closer to tracing, experiment management, and dashboards.

---

## Designing a RAG Evaluation Pipeline

### Building the Test Dataset

Evaluation quality depends on the test dataset. Two approaches:

**Approach 1: Manual Annotation**
- Collect real user queries
- Manually annotate correct answers and relevant context
- High cost but highest quality

**Approach 2: LLM-Generated**
- Generate question-answer pairs from your document corpus
- Fast and scalable
- Lower quality than manual; requires sampling and review

```python
# Automatically generate test data from documents
from ragas.testset import TestsetGenerator

# TestsetGenerator.with_openai() is gone; you now supply the
# generator LLM and embedding model yourself
generator = TestsetGenerator(
    llm=generator_llm,
    embedding_model=generator_embeddings,
)
testset = generator.generate_with_langchain_docs(
    climbing_documents,
    testset_size=100,
)
```

The generation pipeline itself is still changing (transforms, query distribution, and the knowledge graph are all configurable), so pull the parameters from the [official testset generation docs](https://docs.ragas.io/en/stable/getstarted/rag_testset_generation/).

### Turning a real retrieval incident into a test

When this site's Ask AI received “有哪些課程文章” (“What course articles are there?”), the UI reported 15 results. The answer still omitted many Stanford, MIT, CMU, and Berkeley course guides while including Cloudflare Cache Rules and AI Gateway. Production D1 inspection showed that the course posts and their chunks existed. Retrieval was the failure: broad wrapper terms equivalent to “which” and “articles” became OR conditions, recent unrelated content filled the top-k window, and multiple chunks from one post consumed Writer context repeatedly.

An effective regression contract cannot stop at “answer relevance must exceed 0.75.” It should require:

- routing the query to article-catalog or recommendation intent, retaining “course” as the retrieval subject while removing conversational wrappers;
- retrieving manually labelled university course maps and rejecting known irrelevant sources such as Cloudflare Cache Rules and AI Gateway;
- counting each slug once and displaying unique articles rather than raw chunk count;
- separately judging context relevance and faithfulness, because correct source slugs do not guarantee an on-topic answer.

The repository already contained `docs/rag-golden-dataset.json` and `pnpm eval:rag`. As of 2026-08-30, however, GitHub Actions did not execute the live evaluation, and the saved report came from four offline fixture cases. The script's faithfulness, answer relevance, and context recall values were deterministic comparisons of terms, source URLs, and forbidden claims—not RAGAS, DeepEval, or Promptfoo judges. Having files and metric-shaped names is not the same as evaluating production.

### Continuous Evaluation

Don't just evaluate before release — monitor continuously:

```
Sample 100 queries from production weekly
    ↓
Run automated RAGAS evaluation
    ↓
Monitor metric trends (are they degrading?)
    ↓
Metric drops below threshold → trigger alert
```

### Metric Selection Guide

| Problem | Priority Metrics |
|---------|-----------------|
| Poor retrieval quality | Context Precision, Context Recall |
| Answer hallucination | Faithfulness, Groundedness |
| Off-topic answers | Answer Relevance / Response Relevancy |
| Overall quality | No official composite score exists — define your own weighting |

That last row deserves a note: don't expect a framework to hand you a single "total score." The metrics differ in scale and sensitivity, so averaging them mostly lets regressions cancel each other out. What actually works in practice is a threshold and a trend line per metric, not one composite number that wobbles without explaining why.

## Overall Takeaway

RAG evaluation frameworks transform "feels bad" into "which metric, on which query type, is falling below threshold." This quantification makes optimization targeted rather than blindly trying different techniques.

Start with 20 cases that reproduce real failures. Encode required sources, forbidden sources, and latency as deterministic checks; then add model-graded context relevance and faithfulness. Promptfoo is a practical starting point for TypeScript, HTTP, and CI. Ragas or DeepEval may fit a Python research pipeline better. Evaluate TruLens or Phoenix when tracing and experiment infrastructure are part of the requirement.

Tools can change without invalidating the evaluation contract. Dataset version, judge model, judge prompt, thresholds, and raw results must remain recorded; otherwise today's 0.82 and next month's 0.76 may not have been measured with the same ruler.

---

## Changelog

- 2026-08-30: Added the boundary between formal standards and tools, Promptfoo selection criteria, an open-source maintenance snapshot, and a regression contract from the Ask AI course-article retrieval incident.
- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "RAG Techniques Compendium" series.

## References

- [Ragas: Automated Evaluation of Retrieval Augmented Generation (2023)](https://arxiv.org/abs/2309.15217)
- [RAGAS current metric list (official docs)](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/)
- [RAGAS RAG evaluation walkthrough](https://docs.ragas.io/en/stable/getstarted/rag_eval/)
- [DeepEval metrics overview](https://deepeval.com/docs/metrics-introduction)
- [DeepEval: unit testing in CI/CD](https://deepeval.com/docs/evaluation-unit-testing-in-ci-cd)
- [Promptfoo: Evaluating RAG pipelines](https://www.promptfoo.dev/docs/guides/evaluate-rag/)
- [Promptfoo HTTP/HTTPS provider](https://www.promptfoo.dev/docs/providers/http/)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [ISO/IEC 42001:2023 — AI management systems](https://www.iso.org/standard/42001)
- [OpenTelemetry GenAI semantic convention attributes](https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/)
- [Promptfoo GitHub repository](https://github.com/promptfoo/promptfoo)
- [DeepEval GitHub repository](https://github.com/confident-ai/deepeval)
- [Ragas GitHub repository](https://github.com/vibrantlabsai/ragas)
- [TruLens GitHub repository](https://github.com/truera/trulens)
- [Phoenix GitHub repository and ELv2 license](https://github.com/Arize-ai/phoenix/blob/main/LICENSE)
- [ARES: An Automated Evaluation Framework for Retrieval-Augmented Generation Systems (2023)](https://arxiv.org/abs/2311.09476)
- [TruLens RAG Triad — Context Relevance, Groundedness, Answer Relevance](https://www.trulens.org/getting_started/core_concepts/rag_triad/)
- [TruLens: migrating from Feedback to Metric](https://www.trulens.org/component_guides/evaluation/metric_migration/)
- [Retrieval-Augmented Generation for Large Language Models: A Survey (2023)](https://arxiv.org/abs/2312.10997)
- [NobodyClimb System Architecture: Cloudflare Full-Stack Climbing Community Platform](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en)
