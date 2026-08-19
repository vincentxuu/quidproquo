---
title: "Cloudflare KV: A Global Edge Key-Value Store"
date: 2026-03-27
updated: 2026-08-19
type: guide
category: tech
tags: [cloudflare-kv, key-value, cache, edge, cloudflare-workers]
lang: en
tldr: "KV is Cloudflare's globally distributed key-value store. Reads are served from the nearest edge node with extremely low latency. It's ideal for caching, feature flags, and ephemeral data — but writes are eventually consistent."
description: "An introduction to Cloudflare KV: a globally distributed key-value store with low-latency edge reads and native TTL support. Covers Workers binding usage, type conversion patterns, a decision matrix comparing KV vs D1, and a real-world AI response caching implementation."
draft: false
series:
  name: "The Cloudflare Edge Stack"
  order: 3
---

🌏 [中文版](/posts/tech/2026-03-27-cloudflare-kv-key-value-store)

KV is Cloudflare Workers' global key-value store. If you need a serverless caching layer without the overhead of managing Redis, KV is the most straightforward option.

## What It Actually Is: A Read Cache, Not Global Replication

The sentence most often written wrong about KV is "data is replicated to every PoP." **It is not.** KV data lives in central storage and is cached at a given location only *after* it has been read there. A key nobody has read at that location is a cold read that goes back to the central store.

Two consequences follow:

- **The first read of a key is always slower**, and only later reads are fast. Data with a scattered read pattern — each key read once or twice — gains nothing from KV.
- **Post-write visibility is asymmetric.** A write is *usually* visible immediately to subsequent requests *in the same location*, but can take up to 60 seconds (or the `cacheTtl` you pass) to become visible elsewhere in the world. Note how guarded the docs are about the first half — [How KV works](https://developers.cloudflare.com/kv/concepts/how-kv-works/) says changes are *usually* immediately visible but that **this is not guaranteed and therefore it is not advised to rely on this behaviour**. Same-location read-after-write explains the behaviour you observe; it is not something to design against.

So "eventual consistency" here has a concrete number attached, not a vague "seconds to tens of seconds."

## Core Characteristics

- **Fast hot reads**: a few milliseconds when the location's cache holds the value
- **Eventual consistency**: immediate in the same location, up to roughly 60 seconds across locations (tunable via `cacheTtl`, minimum 30 seconds, default 60)
- **Native TTL support**: both `expiration` (absolute) and `expirationTtl` (relative) — keys clean themselves up
- **Size and count limits**: keys, values, and operations per Worker invocation all have ceilings; current numbers in [KV limits](https://developers.cloudflare.com/kv/platform/limits/)

## Basic Usage

**Binding in the Wrangler configuration file**

```jsonc
{
  "kv_namespaces": [{ "binding": "KV", "id": "<NAMESPACE_ID>" }]
}
```

**Working with KV in a Worker**

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Write with TTL
    await env.KV.put('config:ai-quota', JSON.stringify({ limit: 10 }), {
      expirationTtl: 3600, // expires in 1 hour
    });

    // Read
    const raw = await env.KV.get('config:ai-quota');
    if (!raw) return new Response('Not found', { status: 404 });
    const config = JSON.parse(raw);

    // Delete
    await env.KV.delete('config:ai-quota');

    return Response.json(config);
  },
};
```

**Reading with type conversion**

```typescript
// Get a JSON object directly
const data = await env.KV.get<{ limit: number }>('config:ai-quota', 'json');

// Get binary data as ArrayBuffer
const binary = await env.KV.get('some-key', 'arrayBuffer');

// For rarely-read keys, extend how long the value stays cached at this location
const rare = await env.KV.get('rarely-read-key', { cacheTtl: 3600 });
```

`cacheTtl` cuts both ways: raising it also means this location goes longer without seeing writes made elsewhere. Leave it alone for data that is written and read frequently.

## KV vs D1: How to Choose

Within the Cloudflare ecosystem, a common question is when to use KV versus D1 (SQLite):

| Scenario | Choice |
|----------|--------|
| Caching, ephemeral data, feature flags | KV |
| SQL queries, JOINs, ACID transactions | D1 |
| Global ultra-low-latency reads | KV |
| Strong consistency required | D1 |
| Large datasets with many keys | KV (unlimited keys) |

KV is not a database — it doesn't support range scans (you can't query "all keys starting with `user:`"). It only supports exact-key lookups. Data that requires querying capabilities belongs in D1.

## How NobodyClimb Uses KV

NobodyClimb uses KV to store two categories of data:

1. **Video metadata staging**: Some features need to temporarily hold video metadata (processing, completed, error states). TTL is set to a few hours and the data expires automatically once processing is done.
2. **AI response caching**: Cache LLM responses for identical or similar questions to avoid redundant inference. TTL is set to a few tens of minutes.

```typescript
// Cache an AI response
const cacheKey = `ai-response:${hashQuery(userQuery)}`;
const cached = await env.KV.get(cacheKey, 'json');
if (cached) return cached;

const response = await generateAIResponse(userQuery, context);
await env.KV.put(cacheKey, JSON.stringify(response), {
  expirationTtl: 1800, // 30 minutes
});
return response;
```

This caching strategy works in conjunction with the semantic cache step in the RAG pipeline — checking KV first for a semantically similar cached result, and returning it immediately if found, bypassing the entire retrieval and generation process.

## Trade-offs

**Pros**
- Ultra-fast global reads
- Native TTL support
- Extremely simple API
- Serverless — no infrastructure to manage

**Cons**
- Eventual consistency; not suitable for strong-consistency requirements
- No range queries; only exact-key lookups
- **Writes to the same key are capped at one per second on both free and paid plans** — this is not something upgrading fixes. High-frequency updates to a single key (counters, rate-limiter state) belong in Durable Objects
- The free plan's daily write allowance is small (two orders of magnitude below its read allowance); using KV as write-heavy storage hits the wall fast
- Concurrent writes to the same key are last-write-wins; there is no compare-and-swap

## When to Choose KV

- You've already committed to Cloudflare Workers as your compute platform
- You need a caching layer but don't want to manage Redis
- Your workload is read-heavy with low write frequency, and eventual consistency is acceptable
- Your data has a clear TTL (cache, ephemeral state, sessions)

If you need strong consistency or complex queries, use D1. If you need high-frequency writes to a single key or any coordination (counting, locking, rate limiting), use Durable Objects; for pub/sub, self-hosted Redis is a better fit.

## Changelog

- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "Cloudflare Edge Stack" series.

## References

- [Cloudflare KV official documentation](https://developers.cloudflare.com/kv/)
- [How KV works](https://developers.cloudflare.com/kv/concepts/how-kv-works/) — the caching layer and consistency behaviour
- [KV limits](https://developers.cloudflare.com/kv/platform/limits/) — key/value sizes, daily allowances, operations per invocation
- [KV pricing](https://developers.cloudflare.com/kv/platform/pricing/)
- [Workers Storage Options guide](https://developers.cloudflare.com/workers/platform/storage-options/)
- [NobodyClimb system architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en)
- [NobodyClimb RAG Pipeline architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en) — KV's role in semantic caching
- [Cloudflare R2: Zero-Egress Object Storage](/posts/tech/2026-03-27-cloudflare-r2-object-storage-en)
