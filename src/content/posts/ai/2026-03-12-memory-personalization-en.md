---
title: "RAG Personalization: Learning User Preferences from Conversations"
date: 2026-03-12
updated: 2026-08-19
type: guide
category: ai
tags: [rag, personalization, memory, user-profile, async]
lang: en
tldr: "After each conversation, asynchronously extract likely user preferences and skill level, then automatically personalize search parameters on the next query — no manual setup required."
description: "Designing memory and personalization for RAG: inferring user information from queries, writing to user memory asynchronously, injecting personalized context on subsequent queries, and privacy considerations."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 32
---

> 🌏 [中文版](/posts/ai/2026-03-12-memory-personalization)

Most RAG systems treat every user identically: the same question gets the same answer regardless of whether the person is a beginner or an expert. But in rock climbing, skill level and preferences vary enormously — 5.10 is a challenge for a newcomer and a warmup for a seasoned climber.

The goal of personalized RAG is simple: **let the system remember a user's skill level and preferences, then automatically tune search parameters and response style** — without requiring the user to say "I'm a beginner" every single time.

## Memory Extraction: Inferring from Queries

Personalization doesn't require users to fill out a questionnaire. It can be inferred directly from what they ask:

- "Route recommendations for 5.11" → probably intermediate to advanced
- "How do I get started with bouldering" → likely a beginner interested in bouldering
- "Routes at Longdong" → interest in or proximity to Longdong crag
- "How to choose trad gear" → interest in traditional climbing

After each query completes, the system asynchronously extracts these inferable signals:

```typescript
// Runs inside ctx.waitUntil() — does not block the response
async function extractMemory(query: string, userId: string): Promise<void> {
  const extracted = await lightLlm.extract({
    prompt: MEMORY_EXTRACTION_PROMPT,
    query,
    // Infer from the query, not the answer (answers can hallucinate)
  });

  if (extracted.inferred_grade) {
    await upsertUserMemory(userId, {
      key: 'inferred_grade',
      value: extracted.inferred_grade,
      confidence: extracted.confidence,
    });
  }

  if (extracted.location_preference) {
    await upsertUserMemory(userId, {
      key: 'location_interest',
      value: extracted.location_preference,
      confidence: 0.7,
    });
  }
}
```

**Key design decision**: infer from the query itself, not from the system's answer. The answer may contain hallucinations; the user's query is a direct expression of real intent.

## Memory Extraction Prompt

```
Analyze the following climbing query and infer likely information about the user.
Only infer what the signals clearly support — do not guess when uncertain.

Query: {query}

Output JSON:
{
  "inferred_grade": "5.11a" | null,    // inferred skill grade
  "climbing_type": "sport" | null,     // preferred climbing discipline
  "location_interest": "longtung" | null,  // crag of interest
  "experience_level": "beginner" | null,   // experience level
  "confidence": 0.0-1.0               // overall confidence score
}
```

A small instruct model is enough here: extraction needs no complex reasoning, so it is fast and cheap. Which specific model shifts as vendor catalogs change, so no model name is pinned here — the selection rule is "the smallest model that reliably emits valid JSON," and you must validate the output, because small models occasionally return malformed JSON. Treat a parse failure as "no memory extracted this time," not as a reason to fail the whole pipeline.

## Memory Storage

```sql
CREATE TABLE user_ai_memory (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  key         TEXT NOT NULL,   -- memory type (inferred_grade, location_interest...)
  value       TEXT NOT NULL,   -- memory content
  confidence  REAL NOT NULL,   -- confidence score (0.0-1.0)
  source      TEXT,            -- source query
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL,
  UNIQUE(user_id, key)         -- only the latest entry per memory type
);
```

The `confidence` column matters: low-confidence inferences shouldn't heavily influence search parameters — they should act only as weak signals.

## Injecting Personalization

On the next query, memory is injected in two places:

**1. Search filter parameters**

```typescript
const memory = await getUserMemory(userId);

if (memory.inferred_grade && context.queryType === 'complex') {
  // Soft filter: widen the grade range, centered on the inferred level
  ctx.vectorFilter.grade_numeric = {
    gte: parseGrade(memory.inferred_grade) - 10,
    lte: parseGrade(memory.inferred_grade) + 15,
  };
}
```

**2. System prompt injection**

```
You are a rock climbing knowledge assistant.

[User Profile]
Inferred grade: 5.11a (confidence 0.8)
Preferred discipline: sport climbing
Frequented crag: Longdong

Tailor the depth of your explanations to the user's level. Skip basic concepts,
but always explain safety-critical details thoroughly.
```

With this system prompt, the LLM naturally adjusts its tone and depth — no hardcoded logic required.

## Why Async Execution Matters

Memory extraction runs entirely inside `ctx.waitUntil()`:

```typescript
// Response has already been returned; this continues in the background
ctx.waitUntil(
  extractAndSaveMemory(query, userId, env)
);
```

This ensures memory extraction never adds latency to the main query. Users receive their answer at full speed; the memory processing happens quietly in the background.

## Build It Yourself, or Plug In a Memory Layer

The `user_ai_memory` table above is maybe a hundred lines of code, and that is enough for "one key stores one inferred value." But once the requirements grow — remembering conversational state across turns, reconciling facts that contradict each other, knowing *when* a preference changed — it is worth looking at what already exists before shouldering it yourself.

Three trade-offs:

- **Your own table** (what this post does): full control of the schema, no extra dependency, one SQL query to read. The price is that conflict resolution, expiry, and auditing are all yours to write. Good when the kinds of memory are few and fixed.
- **Persistence built into your framework**: if the pipeline already runs on LangGraph, its persistence layer splits the problem in two — checkpointers hold short-term state for a single conversation thread, stores hold long-term memory across threads. Worth knowing: LangChain's early `ConversationBufferMemory`-style memory classes are no longer the recommended path, so a new project should go straight to the LangGraph persistence docs. A great deal of tutorial material online still teaches the superseded API.
- **A dedicated memory service**: products like mem0 and Zep (and Graphiti, the open-source temporal knowledge graph underneath Zep) handle extraction, deduplication, conflict resolution, and the time axis for you. You save the most annoying logic; you pay with an external dependency, another data processor, and a decision about whether user data leaves your own system.

Which one to pick follows the shape of the memory: if it is "a few scalar preferences per user," build it yourself. If it is "a pile of facts that change over time and may contradict each other," that is a knowledge-graph problem, and a key-value table will not hold it.

## Privacy Design

A few important privacy considerations:

1. **Infer, don't store raw queries**: Memory stores inferred results (grade, preferences), not the full query history.
2. **Confidence threshold**: Inferences with `confidence < 0.5` are not written to memory, avoiding storage of unreliable signals.
3. **User control**: Users can view and delete all stored memory from their settings page.
4. **Explicit overrides**: Information the user explicitly provides in their profile bio takes precedence over anything inferred.
5. **The inference is itself personal data**: storing only inferences rather than raw queries lowers the risk, but "this person is a 5.11 sport climber who frequents Long Dong" is still a user profile. Deletion, export, and retention obligations do not disappear just because the data was inferred.

## The Bigger Picture

The philosophy behind personalized RAG is **observe, don't interrupt**. No surveys, no explicit preference settings — the system quietly learns from natural usage and gradually delivers results that feel more personally relevant.

In a domain like rock climbing, where skill grades provide a clear, objective axis, personalization pays off especially well. A recommendation that actually fits both the expert and the beginner — rather than serving the statistical average — is worth far more.

---

## Changelog

- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "RAG Techniques Compendium" series.

## References

- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560)
- [Augmenting Language Models with Long-Term Memory](https://arxiv.org/abs/2306.07174)
- [A-Mem: Agentic Memory for LLM Agents](https://arxiv.org/abs/2502.12110)
- [Zep: A Temporal Knowledge Graph Architecture for Agent Memory](https://arxiv.org/abs/2501.13956)
- [LangGraph Persistence (checkpointers vs. stores)](https://docs.langchain.com/oss/python/langgraph/persistence)
- [mem0 documentation](https://docs.mem0.ai/introduction)
- [Graphiti (Zep's open-source temporal knowledge graph)](https://github.com/getzep/graphiti)
- [NobodyClimb System Architecture: Cloudflare Full-Stack Climbing Community Platform](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en)
