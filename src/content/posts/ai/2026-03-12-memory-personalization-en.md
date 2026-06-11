---
title: "RAG Personalization: Learning User Preferences from Conversations"
date: 2026-03-12
type: guide
category: ai
tags: [rag, personalization, memory, user-profile, async]
lang: en
tldr: "After each conversation, asynchronously extract likely user preferences and skill level, then automatically personalize search parameters on the next query — no manual setup required."
description: "Designing memory and personalization for RAG: inferring user information from queries, writing to user memory asynchronously, injecting personalized context on subsequent queries, and privacy considerations."
draft: false
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

Use a lightweight model (Llama-8b). Extraction doesn't require complex reasoning — it's fast and cheap.

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

## Privacy Design

A few important privacy considerations:

1. **Infer, don't store raw queries**: Memory stores inferred results (grade, preferences), not the full query history.
2. **Confidence threshold**: Inferences with `confidence < 0.5` are not written to memory, avoiding storage of unreliable signals.
3. **User control**: Users can view and delete all stored memory from their settings page.
4. **Explicit overrides**: Information the user explicitly provides in their profile bio takes precedence over anything inferred.

## The Bigger Picture

The philosophy behind personalized RAG is **observe, don't interrupt**. No surveys, no explicit preference settings — the system quietly learns from natural usage and gradually delivers results that feel more personally relevant.

In a domain like rock climbing, where skill grades provide a clear, objective axis, personalization pays off especially well. A recommendation that actually fits both the expert and the beginner — rather than serving the statistical average — is worth far more.

---

## References

- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560)
- [Augmenting Language Models with Long-Term Memory](https://arxiv.org/abs/2306.07174)
- [A-Mem: Agentic Memory for LLM Agents](https://arxiv.org/abs/2502.12110)
- [NobodyClimb System Architecture: Cloudflare Full-Stack Climbing Community Platform](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) (zh-TW only)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) (zh-TW only)
