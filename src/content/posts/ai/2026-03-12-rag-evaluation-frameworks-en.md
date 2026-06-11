---
title: "RAG Evaluation Frameworks: How to Use RAGAS, DeepEval, and TruLens"
date: 2026-03-12
type: guide
category: ai
tags: [rag, evaluation, ragas, deepeval, trulens, metrics, quality]
lang: en
tldr: "RAG system quality is hard to evaluate by intuition alone. RAGAS, DeepEval, and TruLens provide systematic metric frameworks that pinpoint exactly which component is failing."
description: "A comparison of RAG evaluation frameworks: RAGAS core metrics, DeepEval's testing framework, TruLens' triad evaluation, and how to design a RAG evaluation pipeline."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-12-rag-evaluation-frameworks)

Evaluating RAG system quality is a hard problem: you can feel that the answers are bad, but you can't articulate which component is at fault — did the retriever fetch the wrong documents, or did the LLM extract incorrect information from the right documents?

Systematic evaluation frameworks quantify "feels bad" into concrete metrics, giving your optimization efforts a clear direction.

## RAGAS (RAG Assessment)

**Positioning**: The most widely cited RAG evaluation framework, defining the core metric system for RAG.

### Four Core Metrics

**Faithfulness**:
What proportion of the statements in the answer can be inferred from the context?

```
Answer: "The crux move on Longdong 5.11a is a sidepull that requires good footwork."
Context contains: "The crux of this route is a sidepull move."

Faithfulness = "sidepull" derivable from context + "footwork" not derivable from context
             = 1/2 = 0.5
```

Low Faithfulness = the LLM is hallucinating, adding information not present in the context.

**Answer Relevance**:
How relevant is the answer to the original question? Uses an LLM to reverse-generate questions from the answer, then calculates semantic similarity between those generated questions and the original question.

Low Answer Relevance = the answer is off-topic and doesn't address the original question.

**Context Precision**:
Of the retrieved context chunks, how many are actually relevant?

```
Retrieved results: [Route A (relevant), Route B (irrelevant), Route C (relevant), Route D (irrelevant)]

Context Precision = 2 relevant / 4 total = 0.5
```

Low Context Precision = the retriever is introducing too much noise.

**Context Recall**:
Of the information required by the ground truth, how much was successfully retrieved? (Requires ground truth annotations.)

Low Context Recall = the retriever is missing critical information.

```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision

results = evaluate(
    dataset=test_dataset,  # contains question, answer, contexts, ground_truth
    metrics=[faithfulness, answer_relevancy, context_precision],
)

print(results)
# {'faithfulness': 0.82, 'answer_relevancy': 0.79, 'context_precision': 0.71}
```

### Limitations of RAGAS

- Primarily uses GPT-4 as judge; limited Chinese support (Traditional Chinese performs even worse)
- Requires ground truth to compute Context Recall
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
    HallucinationMetric,
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
    )

    assert_test(test_case, metrics=[
        FaithfulnessMetric(threshold=0.7),
        AnswerRelevancyMetric(threshold=0.8),
        HallucinationMetric(threshold=0.3),
    ])
```

**Key Features**:
- pytest integration, runnable in CI/CD
- 40+ metrics covering RAG, conversation, and safety
- Local model support (not locked to OpenAI)
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

```python
from trulens.apps.langchain import TruChain
from trulens.core import TruSession
from trulens.providers.openai import OpenAI

session = TruSession()
provider = OpenAI()

# Wrap your RAG chain
tru_recorder = TruChain(
    rag_chain,
    app_name="climbing-rag",
    feedbacks=[
        provider.context_relevance_with_cot_reasons,
        provider.groundedness_measure_with_cot_reasons,
        provider.relevance_with_cot_reasons,
    ],
)

# Every RAG call is automatically evaluated and recorded
with tru_recorder as recording:
    response = rag_chain.invoke({"query": "Beginner-friendly routes at Longdong"})
```

**Dashboard**:
```
tru_session.get_leaderboard()
# Displays a comparison of metrics across different RAG configurations
```

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

generator = TestsetGenerator.with_openai()
testset = generator.generate_with_langchain_docs(
    documents=climbing_documents,
    testset_size=100,
)
```

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
| Off-topic answers | Answer Relevance |
| Overall quality | RAGAS Score (weighted average) |

## Overall Takeaway

RAG evaluation frameworks transform "feels bad" into "which metric, on which query type, is falling below threshold." This quantification makes optimization targeted rather than blindly trying different techniques.

Start by picking one framework (RAGAS is the quickest to get started with), build a small test dataset of 50-100 cases, establish baseline scores, then compare score changes after each optimization. Once this habit is in place, iterating on your RAG system becomes far more efficient.

---

## References

- [RAGAS: Automated Evaluation of Retrieval Augmented Generation (2023)](https://arxiv.org/abs/2309.15217)
- [ARES: An Automated Evaluation Framework for Retrieval-Augmented Generation Systems (2023)](https://arxiv.org/abs/2311.09476)
- [TruLens RAG Triad — Context Relevance, Groundedness, Answer Relevance](https://www.trulens.org/getting_started/core_concepts/rag_triad/)
- [Retrieval-Augmented Generation for Large Language Models: A Survey (2023)](https://arxiv.org/abs/2312.10997)
- [NobodyClimb System Architecture: Cloudflare Full-Stack Climbing Community Platform](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
