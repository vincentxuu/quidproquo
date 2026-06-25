---
title: "From Mock to Real AI: Integrating Cloudflare Workers AI into action-maker"
date: 2026-03-24
type: guide
category: tech
tags: [cloudflare-workers, hono, workers-ai, qwen3, langfuse, nextjs, postgresql]
lang: en
tldr: "Upgraded action-maker from hardcoded mock data to live Cloudflare Workers AI generation. The architecture splits into Worker (AI only), Server (data storage), and Frontend (orchestration). Hit two gotchas along the way: Qwen3's thinking block and the Workers AI response format."
description: "From product requirements to architecture design to implementation pitfalls — a complete record of building an AI-powered action suggestion service with Cloudflare Workers AI and Hono, integrated with PostgreSQL for record tracking and a Next.js frontend."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-24-action-maker-ai-integration)

## TL;DR

Upgraded action-maker from hardcoded mock data to live Cloudflare Workers AI generation. The architecture splits into Worker (AI only), Server (data storage), and Frontend (orchestration). Hit two gotchas along the way: Qwen3's thinking block and the Workers AI response format.

## Why This Needed to Happen

島島阿學 has an action-maker feature where users pick a category (interests, health, learning…), enter a goal, and the system generates three action suggestions at different difficulty levels (beginner / intermediate / advanced). The problem: those suggestions were fake. The frontend did a `setTimeout(800ms)` and returned hardcoded static data — users saw the same thing every single time.

Making it real required connecting to AI. But just wiring up an AI call wasn't enough — what happens after a user picks an action? Previously, the result page was a dead end: share or start over. The right solution was letting users go directly from a result to "start practicing," creating a practice entry in the DB for ongoing tracking.

There was also another scenario: when users select "I want to set my own goal" and type something rough like "practice guitar every day," AI should be able to refine it into something more concrete ("practice C, G, Am, F chord transitions for 15 minutes daily, using a metronome starting at 60 BPM") — with the user retaining final say.

So three things needed to happen: AI generation, AI-assisted refinement, and practice creation.

## Architecture: Who Owns What

The most critical decision was the division of responsibility between Worker and Server. Three options were on the table:

- **Worker connects directly to DB**: fewer hops, but Worker has to handle DB logic that duplicates the Server
- **Worker calls Server to store data**: one extra HTTP call, but clean separation of concerns
- **Worker only handles AI; Frontend and Server handle storage**: simplest, but the Frontend may not have a `user_id` (generation doesn't require login)

Went with a variant of the third option: after the Worker finishes generation, it fires a background call to the Server's internal API to store the record (non-blocking), while the Frontend handles creating practices and reporting user interactions.

```
Frontend
  ├─ POST Worker /action-maker/generate    → AI generates 3 actions
  ├─ POST Worker /action-maker/refine      → AI refines a custom action
  ├─ POST Server /api/v1/practices         → Create practice (requires login)
  └─ PATCH Server /api/v1/ai-generations   → Report which action the user picked

Worker
  ├─ Workers AI (Qwen3) → Generate content
  ├─ Langfuse → Track every AI call
  └─ POST Server /api/internal/ai-generations → Store record (background, 5s timeout)

Server
  ├─ POST /api/internal/ai-generations → Worker stores record (API Key auth)
  ├─ PATCH /api/v1/ai-generations/:sessionId → Frontend reports interaction (JWT auth)
  └─ POST /api/v1/practices → Existing practice creation API
```

Core principle: Worker doesn't touch the DB, doesn't touch auth — it only handles "ask AI, get answer." Data storage stays with the Server, which already does that.

## DB Design: A Generic `ai_generations` Table

Rather than designing this for action-maker alone, a general-purpose `ai_generations` table was built, using `feature` + `action_type` to distinguish use cases:

```sql
CREATE TABLE ai_generations (
    id SERIAL PRIMARY KEY,
    external_id UUID UNIQUE DEFAULT gen_random_uuid(),
    feature VARCHAR(50) NOT NULL,        -- 'action-maker', future 'checkin-encourage'
    action_type VARCHAR(20) NOT NULL,    -- 'generate', 'refine'
    session_id VARCHAR(64),              -- frontend-generated UUID linking the whole flow
    ip_hash VARCHAR(16),                 -- first 8 bytes of SHA-256, raw IP not stored
    user_id INT REFERENCES users(id),    -- nullable, user may not be logged in during generation
    status VARCHAR(20) DEFAULT 'success',
    input JSONB NOT NULL,
    output JSONB,                        -- nullable, no output if AI fails
    model VARCHAR(100),
    latency_ms INT,
    user_interaction JSONB,              -- frontend reports: what was selected, whether practice was created
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

`input`/`output` use JSONB so different features can have different structures without schema changes. `session_id` lets us link a single user's generate → refine → create practice flow together for analysis.

Later, when we want to know "what did AI generate → what did the user pick → did they actually do it," a single query handles it.

## Worker Implementation: Hono + Workers AI

The tech stack is minimal: Hono for routing, Cloudflare KV for rate limiting, Workers AI for inference.

### Rate Limiting

Using a factory pattern, `generate` and `refine` share the same counter pool:

```typescript
const rateLimiter = createRateLimiter("action-maker");

actionMakerRouter.post("/generate", rateLimiter, async (c) => { ... });
actionMakerRouter.post("/refine", rateLimiter, async (c) => { ... });
```

5 requests per IP per 10 minutes (generate + refine combined). KV stores `{ count, resetAt }` with TTL-based auto-expiry.

### Prompt Design

The system prompt specifies the JSON structure, character limits, and rules. Supports both `zh-TW` and `en` locales. The key is being explicit:

```
You must return only a valid JSON object. Do not include markdown, explanatory text, or any other content.
The JSON must match this structure:
{
  "actions": [
    {
      "id": "<categoryId>-beginner-001",
      "categoryId": "<categoryId>",
      "level": "beginner",
      "locked": false,
      "title": "Concise, specific action title",
      ...
    }
  ]
}
Always return exactly 3 actions (one each for beginner, intermediate, and advanced)
```

The refine prompt is "preserve the user's core intent, adjust difficulty based on level" — takes the user's rough idea and outputs a refined version.

## Pitfall #1: Qwen3's Thinking Block

Qwen3 is a thinking model. It "reasons" before giving a final answer:

```
<think>
The user wants to learn guitar. I should design actions for different levels...
Beginners can start with basic chords...
</think>

{
  "actions": [...]
}
```

Calling `JSON.parse()` directly on this will blow up. The fix is to strip the `<think>` block first:

```typescript
const cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
```

Then try direct parse, fall back to regex extraction on failure:

```typescript
let parsed;
try {
  parsed = JSON.parse(cleaned);
} catch {
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found");
  parsed = JSON.parse(jsonMatch[0]);
}
```

## Pitfall #2: Workers AI Response Format

The docs say Workers AI returns `{ response: "..." }`, but what actually comes back is an OpenAI-compatible chat completion format:

```json
{
  "id": "chatcmpl-xxx",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "<think>...</think>\n{...}"
    }
  }]
}
```

Both formats need to be handled:

```typescript
let text: string;
if (typeof response === "string") {
  text = response;
} else if (typeof response === "object" && response !== null) {
  const r = response as Record<string, unknown>;
  if ("response" in r) {
    text = String(r.response);
  } else if ("choices" in r && Array.isArray(r.choices)) {
    const choices = r.choices as Array<{ message?: { content?: string } }>;
    text = choices[0]?.message?.content ?? "";
  } else {
    text = JSON.stringify(response);
  }
} else {
  text = JSON.stringify(response);
}
```

Without this check, `String(response)` produces `[object Object]`, and then JSON.parse throws "No JSON found." During debugging, it looked like AI returned nothing — it did return something, just wrapped in an extra layer.

## Frontend: From Mock to Real AI

The original hook:

```typescript
// Pretend to wait 0.8 seconds
await new Promise((r) => setTimeout(r, 800));
const fallback = getFallbackActions(input.category);
setActions(fallback);
```

Replaced with:

```typescript
const response = await fetch(`${WORKER_URL}/action-maker/generate`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ category, topic, tags, locale, session_id }),
  signal: controller.signal,
});
```

If the Worker fails, it falls back to static data — users don't notice the difference. An `isFallback` flag lets the UI display "These are default suggestions."

### AI-Assisted Custom Goal

The "I want to set my own goal" flow went from a simple form to a four-step process:

1. **Choose difficulty** — Beginner / Intermediate / Advanced
2. **Enter your idea** — Title + description
3. **AI refinement** — Call `/action-maker/refine`, or skip and use the original
4. **Compare and choose** — Use the AI version / edit it / use the original

The user always has final say. AI just provides a more concrete reference point.

### Starting a Practice from the Result Page

The result page now has a "Start Practicing" button. If not logged in, a login modal appears; after login, a practice is created automatically:

```typescript
const { data } = await createPractice({
  title: result.action.title,
  practiceAction: result.action.description,
  otherContext: result.triggerTiming,
  tags: [result.category],
  startDate: new Date().toISOString().split("T")[0],
  durationDays: 14,
  frequencyMinDays: 1,
  frequencyMaxDays: 1,
});
```

After creation, the user is redirected to the practice page. From "seeing a suggestion" to "starting to track it" in one seamless flow.

## Security Considerations

A few things worth noting:

- **Internal API Key uses timing-safe comparison**: `crypto.timingSafeEqual` prevents timing attacks
- **Raw IPs are never stored**: SHA-256 first 8 bytes only, used for statistics
- **PATCH endpoint prevents unauthorized access**: only allows updates to rows where `user_id` is null or belongs to the current user
- **AI-returned `locked` field is always overwritten to `false`**: don't trust AI's field values
- **Input truncation**: topic max 100 chars, title max 30, description max 200, tags max 10 items each max 20 chars

## Overall Takeaways

The core tradeoff here was keeping the Worker extremely thin — only AI calls, no DB, no auth. The upside: Worker logic stays simple, deploys fast, and is easy to test (12 vitest tests run in under 2 seconds). The downside: an extra server-to-server hop to store records. But using `waitUntil` for background execution means it doesn't affect response latency.

Qwen3 as a free Workers AI model performs well — high compliance with JSON structure — but the thinking block must be handled. If we swap models later, it's a one-line change to the `AI_MODEL` constant.

From a product perspective, action-maker went from a "play once and you're done" tool to a "play and immediately start doing" entry point. AI generation → choose an action → create a practice → daily check-in tracking. The loop is closed.

## References

- [Cloudflare Workers AI Docs](https://developers.cloudflare.com/workers-ai/)
- [Hono - Web Framework for Cloudflare Workers](https://hono.dev/)
- [Qwen3 Model Overview](https://huggingface.co/Qwen)
- [Langfuse - LLM Observability](https://langfuse.com/)
- [Cloudflare KV Docs](https://developers.cloudflare.com/kv/)
- [Next.js Official Docs](https://nextjs.org/docs)
- [島島阿學 Tech Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
