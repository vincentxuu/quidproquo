---
title: "RAG Common Failure Modes: 10 Problems and Their Solutions"
date: 2026-03-12
type: debug
category: ai
tags: [rag, debugging, failure-modes, quality, troubleshooting]
lang: en
tldr: "When a RAG system breaks, 90% of the time it's one of these 10 failure modes. Identify which one first, then apply the matching fix — far more effective than optimizing blindly."
description: "The 10 most common RAG failure modes across retrieval failures, generation failures, and system design issues, along with diagnostic methods and solutions for each."
draft: false
series:
  name: "RAG 系統實戰"
  order: 2
---

> 🌏 [中文版](/posts/ai/2026-03-12-rag-failure-modes)

RAG system problems are usually not random — they cluster around a few identifiable failure modes. Once you diagnose which mode you're dealing with, the solution becomes clear.

## Retrieval Failures

### 1. Insufficient Recall: Relevant Documents Not Found

**Symptoms**: The system says "no relevant data found," but the database actually contains matching content.

**Common causes**:
- Large gap between query phrasing and document phrasing (question form vs. declarative statements)
- Filters too restrictive (e.g., `grade_numeric` too precise)
- Chunks too small, scattering key information across pieces

**Diagnosis**: Check `retrieval.vectorCandidates` and `retrieval.bm25Candidates` in the trace — if both are 0, it's a retrieval-level problem.

**Solutions**:
- Add HyDE (bridges the language gap between questions and statements)
- Add Multi-Query (covers multiple angles)
- Add CRAG (relaxes filters when 0 results are returned)
- Loosen metadata filter conditions

---

### 2. Poor Precision: Irrelevant Documents Retrieved

**Symptoms**: Search returns results, but the context is filled with irrelevant documents, causing the LLM to be distracted by noise.

**Common causes**:
- Insufficient vector embedding quality (model poorly understands domain terminology)
- Metadata filters not working properly
- Chunks too large, containing multiple unrelated topics

**Diagnosis**: Check `generation.injectedDocuments` and manually verify whether all documents are actually relevant to the query.

**Solutions**:
- Add Cross-Encoder Reranking (filters out low-relevance candidates)
- Raise the `reranker_relevance_threshold`
- Improve the metadata filter extraction logic
- Use smaller chunks (each chunk focuses on a single topic)

---

### 3. Chunk Islands: Fragment Text Loses Context

**Symptoms**: The retrieved chunk contains keywords but lacks context, preventing the LLM from giving a complete answer.

**Common causes**:
- Chunks too small — individual chunks can't express a complete idea
- No Contextual Retrieval (lacking document-level context injection)

**Diagnosis**: Examine the content of the retrieved chunks and determine whether each can be understood independently.

**Solutions**:
- Implement Contextual Retrieval (inject document summaries at indexing time)
- Use a Parent Document Retriever (search on small chunks, retrieve large chunks as context)
- Increase chunk size + overlap

---

### 4. Polysemy Confusion

**Symptoms**: The query contains words that have meaning in both domain-specific and general contexts, causing search results to include irrelevant content.

**Example**: The word "control" in climbing refers to a specific technique, but the embedding might match documents about "controlling emotions" or "controlling budgets."

**Solutions**:
- Strengthen metadata filtering (ensure search is constrained to `type = 'route'` or `type = 'technique'`)
- Emphasize in the system prompt: "Only use climbing-related knowledge to answer"
- Fine-tune the embedding model (improve the model's understanding of domain-specific terminology)

---

## Generation Failures

### 5. Hallucination: LLM Adds Information Not in the Context

**Symptoms**: The answer sounds complete but includes numbers, names, or facts not mentioned in the context.

**Common causes**:
- Insufficient context, causing the LLM to "fill in" with its own knowledge
- The model tends to generate complete-sounding answers
- The system prompt doesn't explicitly prohibit adding information beyond the context

**Diagnosis**: Check `judge.groundedness` — below 0.6 almost certainly indicates hallucination.

**Solutions**:
- System prompt must be explicit: "Strictly prohibited from adding information outside the knowledge base; when uncertain, say you're uncertain"
- Add LLM-as-Judge to automatically detect low groundedness
- Self-Reflection: regenerate when quality is low
- Improve retrieval so the context is more complete — then the LLM won't need to "guess"

---

### 6. Off-Topic Answers: Not Answering the User's Question

**Symptoms**: Search and context are fine, but the LLM's answer doesn't match the question (e.g., user asks for route recommendations, gets climbing history instead).

**Common causes**:
- Too many tangentially related documents in the context, dispersing the LLM's attention
- Query type misclassification
- System prompt instructions not clear enough

**Diagnosis**: Check `judge.quality` (low) and `judge.reasoning` (explains why the answer went off-topic).

**Solutions**:
- Streamline context — only pass in the most relevant documents (Top-5 after MMR, not Top-20)
- Use few-shot examples in the system prompt to demonstrate expected answer format
- Adjust Query Classification to ensure correct routing

---

### 7. Inconsistent Formatting

**Symptoms**: For the same type of query, sometimes the answer uses bullet points, sometimes paragraphs; difficulty is sometimes expressed as "5.11a," other times as "moderate difficulty."

**Solutions**:
- Specify the output format explicitly in the system prompt
- Provide few-shot examples (most effective approach)
- Consider fine-tuning to teach the model a consistent format

---

## System Design Issues

### 8. Quota Exhaustion UX Problems

**Symptoms**: When users exceed their quota, they see an error with no explanation of why or when it resets.

**Solutions**:
```
"You've used all your conversations for today (3/3).
You're currently at the Wall tier. Your quota resets tomorrow at 00:00.
Complete your profile to upgrade to the Edge tier and get more conversations."
```

Clearly communicate: how much was used, what the limit is, when it resets, and how to increase the quota.

---

### 9. Slow Response UX Problems

**Symptoms**: Users see a blank screen for 5-8 seconds before the answer appears, assuming the system is down.

**Solutions**:
- Implement SSE Streaming so the first token appears within 1 second
- Add a "Thinking..." status indicator
- Use Semantic Cache for instant responses to repeated queries

---

### 10. Silent Failures

**Symptoms**: The system returns an answer, but it's based on empty context and general knowledge — the user doesn't know the data was insufficient.

**Common causes**:
- CRAG relaxed filters but still found no results, yet the pipeline continued executing
- Judge groundedness is very low but no disclaimer was added

**Solutions**:
- Ensure all answers with groundedness < 0.6 include a disclaimer
- When context is empty, respond with "No relevant data available" instead of answering with general knowledge
- Log "empty context" states in traces and periodically review these queries to identify data gaps

---

## Diagnostic Workflow for Failure Modes

```
User reports "bad answer"
    ↓
Check trace judge.groundedness
    ↓
< 0.6 → Hallucination problem (#5)
    ↓
Check retrieval.vectorCandidates + bm25Candidates
    ↓
= 0 → Recall problem (#1)
> 0 but groundedness still low → Check generation.injectedDocuments
    ↓
Documents irrelevant → Precision problem (#2)
Documents relevant but fragmented → Chunk island problem (#3)
Documents correct but LLM off-topic → Generation problem (#6)
```

## The Big Picture

Most RAG problems don't require a change in technical architecture — they just need failure mode identification followed by targeted fixes. Build observability first (traces + judge scores) so you can quickly pinpoint which failure mode you're dealing with.

Diagnosing RAG problems without observability is like debugging blindfolded — you might fix it by chance, but you're far more likely to make things worse.

---

## References

- [Seven Failure Points When Engineering a Retrieval Augmented Generation System (2024)](https://arxiv.org/abs/2401.05856)
- [Retrieval-Augmented Generation for Large Language Models: A Survey (2023)](https://arxiv.org/abs/2312.10997)
- [RAGAS: Automated Evaluation of Retrieval Augmented Generation (2023)](https://arxiv.org/abs/2309.15217)
- [NobodyClimb System Architecture: Cloudflare Full-Stack Climbing Community Platform](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
