---
title: "Self-Reflection + LLM-as-Judge: Having AI Evaluate Its Own Answers"
date: 2026-03-12
type: guide
category: ai
tags: [rag, llm-judge, self-reflection, groundedness, quality-assurance]
lang: en
tldr: "Use another LLM to evaluate answer accuracy and quality — if the score is too low, regenerate, and automatically add appropriate disclaimers."
description: "LLM-as-Judge scoring mechanisms, Groundedness calculation, Self-Reflection regeneration decisions, and how to integrate quality evaluation into a RAG pipeline."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-12-self-reflection-llm-as-judge)

After a RAG system generates an answer, how do you know whether it's making things up?

The most intuitive approach is manual annotation, but that doesn't scale. An alternative is using another LLM to evaluate — **LLM-as-Judge**. This is currently the mainstream approach for evaluating generation quality in the industry, and it's particularly useful in RAG systems because we have context available as reference material.

## LLM-as-Judge Scoring Dimensions

The system evaluates along two dimensions:

**Groundedness (0.0 – 1.0)**: What proportion of the answer is based on the provided context
- 1.0: Entirely based on context, no speculation
- 0.8: Mostly based on context, with minor reasonable inferences
- 0.5: Half based on context, half supplemented by the LLM itself
- 0.2: Mostly the LLM's own knowledge, context is just decoration

**Quality (1 – 4)**: Overall quality of the answer
- 4: High quality, directly addresses the question, information is complete
- 3: Average, addresses the question but with notable gaps
- 2: Low quality, irrelevant or insufficient information
- 1: Extremely low, completely fails to answer the question

## Judge Prompt

The prompt sent to the Judge LLM:

```
You are a climbing knowledge quality evaluator. Please assess the following RAG system response quality.

[Retrieved Context]
{context}

[System Answer]
{answer}

[Original Question]
{query}

Please output JSON:
{
  "groundedness": 0.0-1.0,  // degree to which the answer is based on context
  "quality": 1-4,            // overall quality
  "reasoning": "rationale for scoring"
}
```

A lightweight model like `llama-3.1-8b-instruct` is used as the Judge — complex reasoning isn't needed, 8B is sufficient, and the cost is low.

## Using the Groundedness Score

The Groundedness score determines whether to add a disclaimer to the answer:

```typescript
function annotateGroundedness(answer: string, score: number): string {
  if (score >= 0.8) return answer;                    // High confidence, no annotation

  if (score >= 0.6) {
    return `⚠️ Some content may go beyond available data\n\n${answer}`;  // Add warning
  }

  return `❓ Insufficient data for this answer, use with caution\n\n${answer}`; // Add disclaimer
}
```

This design lets users know when to trust the system and when they should double-check. Transparency is more important than hiding uncertainty entirely.

## Self-Reflection (Regeneration via Self-Assessment)

Regeneration is triggered when Quality is 2 or below:

```typescript
async function selfReflect(ctx: PipelineContext): Promise<void> {
  const { quality, groundedness } = ctx.judgeResult;

  // Trigger condition: low quality + answer isn't too short (too short means context was empty)
  if (quality <= 2 && ctx.response.answer.length >= 50) {

    // Regenerate (using the same messages)
    const regenerated = await generateAnswer(ctx.messages, ctx.config);

    // Re-run Judge on the regenerated result
    const regenJudge = await judgeAnswer(regenerated, ctx.context, ctx.query);

    // Keep whichever has higher groundedness
    if (regenJudge.groundedness > groundedness) {
      ctx.response.answer = regenerated;
      ctx.judgeResult = regenJudge;
      ctx.trace.selfReflection.accepted = true;
    } else {
      ctx.trace.selfReflection.accepted = false; // Keep the original
    }
  }
}
```

Regeneration doesn't unconditionally replace the original — it **compares groundedness scores and keeps the higher one**. This avoids the "regeneration makes things worse" problem: if the regenerated answer hallucinates more, the original answer is preserved.

Regeneration is only triggered when `queryType === 'complex'`. Low quality on simple queries and SQL queries is typically due to insufficient data, where regeneration is meaningless.

## Automatically Flagging Poor Answers

Answers with Groundedness below 0.5 are automatically written to the `ai_flagged_responses` table:

```typescript
if (groundedness < 0.5) {
  await db.insert(aiFlaggedResponses).values({
    query_log_id: ctx.queryLogId,
    flag_reason: 'low_groundedness',
    auto_score: groundedness,
    created_at: Date.now(),
  });
}
```

Administrators can review flagged answers in the dashboard and manually confirm whether there are systemic issues (e.g., a certain type of query consistently scoring low on groundedness). This serves as a data source for continuous system improvement.

## Blind Spots of LLM-as-Judge

LLM-as-Judge isn't infallible. There are several known issues:

1. **Position Bias**: Judges tend to give higher scores to longer documents and those appearing earlier in the list
2. **Verbosity Bias**: Longer answers tend to receive higher quality scores
3. **Self-Enhancement Bias**: Models from the same family may be overly lenient when evaluating each other

To address these biases, the system treats Judge results as references rather than absolute truth, supplementing with user feedback (thumbs up/down) for calibration. When the gap between user feedback and auto_score is 2 or greater, flagging is also triggered, pending manual review.

## The Big Picture

LLM-as-Judge is a core mechanism for RAG quality assurance. Groundedness tells the system when to be humble, Self-Reflection provides one chance for self-correction, and automatic flagging establishes a feedback loop for continuous improvement.

The most important design principle: **never trust any single evaluation**. Low Judge score → flag for manual review. Poor user rating → also triggers flagging. Only when both signals agree is a problem truly confirmed. Multiple signals are more reliable than a single one.

---

## References

- [Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection (2023)](https://arxiv.org/abs/2310.11511)
- [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena (2023)](https://arxiv.org/abs/2306.05685)
- [Retrieval-Augmented Generation for Large Language Models: A Survey (2023)](https://arxiv.org/abs/2312.10997)
- [NobodyClimb System Architecture: Cloudflare Full-Stack Climbing Community Platform](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
