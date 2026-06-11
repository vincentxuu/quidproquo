---
title: "AI Agent Caching Goes Beyond One Layer: From Claude Code's 18 Cache Types to Multi-Layer ReAct Agent Design"
date: 2026-04-03
type: guide
category: ai
tags: [react-agent, cache, prompt-cache, semantic-cache, claude-code, cloudflare-kv, llm-cost-optimization]
lang: en
tldr: "After dissecting Claude Code's 18+ caching mechanisms, I found that you can't touch provider-level prompt cache, but embedding cache, tool result cache, and entity cache are not only within your reach — they deliver even better results. Includes a complete AgentCache interface design and per-tool TTL strategy."
description: "Analyzing AI Agent caching architecture from Claude Code's source code, then designing a multi-layer cache system for ReAct Agents covering semantic cache, embedding cache, tool result cache, and entity cache — implemented with Cloudflare KV."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-03-react-agent-cache-design)

While designing a ReAct Agent for NobodyClimb, I spent considerable time studying Claude Code's caching mechanisms. A seemingly simple question — "How should an Agent's cache be designed?" — turned out to be far more complex: Claude Code internally uses over 18 different caches, and none of them are the "semantic cache" I originally envisioned.

This post documents my findings and the multi-layer cache architecture I ultimately designed.

## Claude Code's 18 Cache Types

After reverse-engineering Claude Code v2.1.88's source code, I categorized all caching mechanisms into three major groups:

### API Prompt Cache (The Core — But You Can't Build It)

Claude Code's most sophisticated cache optimization is **Anthropic API prompt caching**. Each API call's system prompt + tool schema takes roughly 11K tokens. If this content is byte-identical to the previous call, Anthropic reuses the GPU memory's KV attention states and charges only 1/10 of the price.

To maximize hit rates, Claude Code does several meticulous things:

- **Static content first**: The system prompt is split into two segments by `SYSTEM_PROMPT_DYNAMIC_BOUNDARY` — stable parts go first with `cache_control: ephemeral`, dynamic content goes after
- **Tool schema locking**: `toolSchemaCache.ts` locks down the bytes after the first tool schema render within a session, preventing feature flag toggles or MCP reconnections from causing minor differences
- **Cache break detection**: `promptCacheBreakDetection.ts` uses two-stage detection (pre-call hash recording → post-call `cache_read_tokens` comparison), distinguishing between TTL expiration (5min / 1hr) and actual schema changes

**But you can't build this.** Prompt cache is a GPU memory optimization internal to the provider's inference engine — it happens in a layer your application can't reach. All you can do is "keep the prefix you send as stable as possible."

And provider support varies:

| Provider | Mechanism | Discount | What You Need to Do |
|----------|-----------|----------|---------------------|
| Anthropic | `cache_control` markers | 90% | Mark system prompt |
| OpenAI | Automatic, prefix >= 1024 tokens | 50% | Nothing |
| Google | Explicitly create `cachedContent` object | Similar to Anthropic | Different API, needs adapter |
| GitHub Models | Same as OpenAI (Azure backend) | 50% | Nothing |
| Workers AI | Not supported | 0% | Can't do it |

### File / State Cache (Performance Optimization)

Claude Code's second category of caches all aim to reduce redundant I/O:

- **FileStateCache**: LRU cache, 100 entries + 25MB limit, stores file contents and diff state
- **FileReadCache**: 1000 entries, validated by mtime for expiration
- **Context Memoize**: `getSystemContext()`, `getUserContext()`, `getGitStatus()` are all wrapped with `memoize`, cleared by `setSystemPromptInjection()`
- **WebFetch URL Cache**: LRU, 50MB limit, 15-minute TTL

### Application-Level Cache (Operations)

The third category serves monitoring and analytics:

- **Stats Cache**: DAU, token usage statistics, persisted to `~/.claude/stats-cache.json`
- **GrowthBook Cache**: Feature flag values + exposure dedup
- **Plugin ZIP Cache**: Extracted plugin files, orphans cleaned after 7 days
- **Settings Cache**: Three-layer merged configuration

### A Key Discovery

**Claude Code has no semantic cache.** There's no mechanism for "return the same answer for similar questions." Every user input goes through the full ReAct loop.

This isn't a design oversight — Claude Code is a development tool where every query is nearly unique ("fix this bug," "add this feature"), making semantic cache hit rates extremely low.

But a climbing information platform is different. Queries like "What routes does Longdong have?" and "What's the weather at Longdong today?" are highly repetitive.

## What You Can't Do vs. What You Can

After clarifying Claude Code's 18 cache types, the path forward becomes clear:

```
What You Can't Do (Provider Layer)    What You Can Do (Application Layer)
──────────────────────────────────    ──────────────────────────────────
GPU KV Attention Cache                Semantic Cache (query-level)
Inference Engine Optimization         Embedding Cache (vector-level)
Provider Internal TTL Management      Tool Result Cache (tool-level)
                                      Entity Cache (data-level)
```

And what you can do actually works better — provider prompt cache only saves input token costs (90%), while your own cache saves **100%** on hit (no API call at all).

## Four-Layer Cache Architecture

The final architecture looks like this:

```
User query arrives
    │
    ▼
┌─ Layer 1: Semantic Cache ──────────────────┐
│  Vector similarity > threshold?             │
│  Return cached answer directly              │
│  Key: vector + rag_strategy                 │
│  TTL: 30min                                 │
│  Hit → saves 100% (skips entire ReAct loop) │
└─────────────┬──────────────────────────────┘
              │ miss
              ▼
┌─ Layer 2: Embedding Cache ─────────────────┐
│  Don't re-embed the same text               │
│  Key: hash(text + model)                    │
│  TTL: 24hr                                  │
│  Hit → saves embedding API costs            │
└─────────────┬──────────────────────────────┘
              │
              ▼
         Enter ReAct Loop
              │
              ▼
┌─ Layer 3: Tool Result Cache ───────────────┐
│  Don't re-execute tool calls with           │
│  identical parameters                       │
│  Key: tool_name + hash(params)              │
│  TTL: per-tool (see table below)            │
│  Hit → saves DB queries + external APIs     │
└─────────────┬──────────────────────────────┘
              │ miss
              ▼
┌─ Layer 4: Entity Cache ────────────────────┐
│  Share static entity data across            │
│  conversations                              │
│  Key: entity_type + id                      │
│  TTL: 6hr                                   │
│  Hit → saves D1 queries                     │
└────────────────────────────────────────────┘
```

### Why Four Layers Instead of One

Initially I only planned a semantic cache (query layer), but analyzing actual ReAct loop behavior revealed:

1. **Embedding is the most frequently repeated operation.** Semantic cache needs vector lookups, and RAG retrieval also embeds the query — the same text can be embedded 2-3 times within a single request
2. **LLMs frequently re-invoke the same tool during a ReAct loop.** For example, first calling `search_routes({ crag: "Longdong" })`, observing results, then calling `search_routes({ crag: "Longdong", grade: "5.10" })` — the second call has different parameters so it misses, but if the LLM retries with identical parameters, it hits
3. **Crag basic data rarely changes.** The underlying data for `crag_info` and `search_crags` (coordinates, transportation, facilities) updates very infrequently, making a 6-hour TTL perfectly reasonable

The four layers are independent and can be rolled out incrementally — no need to build everything at once.

## Per-Tool TTL Strategy

Different tools have vastly different data freshness requirements, making a uniform TTL unreasonable:

| Tool | TTL | Rationale |
|------|-----|-----------|
| `weather` | 30 min | Weather forecasts update roughly every hour; 30min is a reasonable balance |
| `crag_info` | 6 hr | Crag basic info (transportation, facilities, operating hours) rarely changes |
| `search_crags` | 6 hr | Crag listings rarely change |
| `search_routes` | 1 hr | Route data occasionally updates (new reviews, new ratings) |
| `user_profile` | 10 min | Users might have just finished climbing and logged new routes |
| `recommend` | 5 min | Personalized recommendations depend on profile, which changes fast |
| `sql_query` | 5 min | Structured data may have real-time writes |

Design principle: **TTL is determined by data change frequency, not query frequency.**

A weather API might only update once per hour, but the same crag's weather being queried 50 times in 30 minutes is normal (multiple users asking simultaneously). Conversely, `recommend` has low query frequency, but because it depends on `user_profile` — which can update at any time — its TTL must be short.

## AgentCache Interface Design

The underlying storage uses Cloudflare KV (native TTL support), with a deliberately simple interface:

```typescript
interface AgentCache {
  get<T>(namespace: string, key: string): Promise<T | null>
  set<T>(namespace: string, key: string, data: T, ttlSeconds: number): Promise<void>
  invalidate(namespace: string, key?: string): Promise<void>
}
```

`namespace` is the key design decision: it isolates different cache types, making monitoring and bulk invalidation straightforward.

Naming conventions:
- `embedding` — text vector cache
- `tool:weather` — weather tool execution results
- `tool:search_routes` — search_routes tool execution results
- `entity:crag` — crag static data

Injected into `ToolContext`, making it a one-liner inside tool implementations:

```typescript
async execute(params, ctx) {
  const key = `${params.crag_id}:${params.date}`
  const cached = await ctx.cache.get('tool:weather', key)
  if (cached) return cached

  const result = await fetchWeatherAPI(params)
  await ctx.cache.set('tool:weather', key, result, 1800) // 30min
  return result
}
```

Reasons for choosing Cloudflare KV over in-memory cache:

1. **Workers are stateless.** Each request may run in a different isolate — in-memory cache can't be shared across requests
2. **KV natively supports `expirationTtl`.** No need to manage expiration yourself; just set the seconds
3. **Global edge nodes.** KV read latency is typically < 10ms, much faster than querying D1 or calling external APIs
4. **Already in use.** NobodyClimb's backend already has a KV binding

## Don't Cache Errors

An easily overlooked detail: **failed tool execution results should not be written to cache.**

ReAct Agents are designed so that when a tool fails, the error is wrapped as `is_error: true` and sent back to the LLM, letting it decide the next step. If you cache error results, subsequent identical calls will immediately get the error, and the LLM will never see the correct result.

```typescript
// Cache logic at the engine layer
const cacheKey = hashParams(tool.name, input)
const cached = await ctx.cache.get(`tool:${tool.name}`, cacheKey)
if (cached) return cached

const result = await tool.execute(input, ctx)

// Only cache successful results
if (!result.is_error && tool.cacheTTL > 0) {
  await ctx.cache.set(`tool:${tool.name}`, cacheKey, result, tool.cacheTTL)
}
return result
```

## Stacking with Provider Prompt Cache

The four cache layers don't conflict with provider prompt cache — they stack for maximum effect:

```
Query arrives
    │
    ▼
Semantic Cache hit? ──yes──→ Reply directly (saves 100%)
    │ no
    ▼
Enter ReAct loop (assume 5 turns)
    │
    Turn 1: Prompt Cache miss (first time, provider writes cache)
    Turn 2: Prompt Cache hit (saves 90% input tokens)
            + Tool Result Cache hit (saves DB query)
    Turn 3: Prompt Cache hit + Tool Result Cache hit
    ...
```

Example with a 5-turn conversation (system prompt + 7 tools ~ 8K tokens):

| Scenario | Input Token Cost | Tool Executions |
|----------|-----------------|-----------------|
| No cache at all | 8K x 5 = 40K tokens | 5-10 times |
| Prompt cache only (Anthropic) | 8K + 0.8K x 4 = 11.2K | 5-10 times |
| Prompt cache + tool result cache | 11.2K tokens | 2-4 times |
| Semantic cache hit | 0 tokens | 0 times |

## Guard Priority Order

After integrating cache into the ReAct engine's guard system, the complete check sequence is:

```
semantic_cache → embedding_cache → input_guard → (enter loop) → tool_result_cache → token_budget → maxTurns → end_turn
```

Rationale:
- **semantic_cache first**: On hit, nothing else needs to be done at all
- **embedding_cache before input_guard**: Embedding the query itself has no security implications
- **input_guard before loop**: Harmful inputs should not enter the loop
- **tool_result_cache inside loop**: Check before each tool execution
- **token_budget before maxTurns**: Running out of tokens is more urgent than reaching the turn limit

## Overall Takeaway

Designing Agent caching isn't as simple as "add a Redis layer." Different cache levels solve different problems:

- **Provider prompt cache**: You can't build it, but you can maximize hit rates by keeping the prefix stable
- **Semantic cache**: Saves the most (100%), but hit rate depends on query repetitiveness
- **Embedding cache**: Most easily overlooked, yet has the highest hit rate (the vector for the same text never changes)
- **Tool result cache**: Per-tool TTL is the key design decision, as data freshness varies widely
- **Entity cache**: Long-TTL cache for static data, shared across conversations

The core tradeoff is **data freshness vs. cost/latency**. TTL too long means stale data; too short is effectively no cache. There's no universal answer — you can only set it based on each data type's actual update frequency.

---

## References

- [Anthropic Prompt Caching Documentation](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
- [OpenAI Prompt Caching Guide](https://platform.openai.com/docs/guides/prompt-caching)
- [Google Gemini Context Caching](https://ai.google.dev/gemini-api/docs/caching)
- [Cloudflare KV Documentation](https://developers.cloudflare.com/kv/)
- [ReAct: Synergizing Reasoning and Acting in Language Models (Yao et al., 2022)](https://arxiv.org/abs/2210.03629)
