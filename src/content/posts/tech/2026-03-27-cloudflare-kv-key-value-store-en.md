---
title: "Cloudflare KV: A Global Edge Key-Value Store"
date: 2026-03-27
type: guide
category: tech
tags: [cloudflare-kv, key-value, cache, edge, cloudflare-workers]
lang: en
tldr: "KV is Cloudflare's globally distributed key-value store. Reads are served from the nearest edge node with extremely low latency. It's ideal for caching, feature flags, and ephemeral data — but writes are eventually consistent."
description: "An introduction to Cloudflare KV: a globally distributed key-value store with low-latency edge reads and native TTL support. Covers Workers binding usage, type conversion patterns, a decision matrix comparing KV vs D1, and a real-world AI response caching implementation."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-cloudflare-kv-key-value-store)

KV is Cloudflare Workers' global key-value store. Data is replicated to all Cloudflare PoPs (Points of Presence) worldwide, and reads are served from the nearest node — typically within a few milliseconds. If you need a serverless caching layer without the overhead of managing Redis, KV is the most straightforward option.

## Core Characteristics

- **Ultra-fast reads**: Served from edge nodes, usually just a few milliseconds
- **Eventual consistency**: After a write, it may take seconds to tens of seconds for the change to propagate globally — this is the most important limitation; KV is not suitable for scenarios requiring strong consistency
- **Native TTL support**: Set expiration times on keys and they clean themselves up automatically
- **Size limits**: Values up to 25 MB, keys up to 512 bytes

## Basic Usage

**Binding in wrangler.toml**

```toml
[[kv_namespaces]]
binding = "KV"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
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
```

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
- Write rate limits (free tier: 1,000 writes per minute)
- Not suited for high write-frequency workloads

## When to Choose KV

- You've already committed to Cloudflare Workers as your compute platform
- You need a caching layer but don't want to manage Redis
- Your workload is read-heavy with low write frequency, and eventual consistency is acceptable
- Your data has a clear TTL (cache, ephemeral state, sessions)

If you need strong consistency or complex queries, use D1. If you need high write throughput and pub/sub, self-hosted Redis is a better fit.

## References

- [Cloudflare KV official documentation](https://developers.cloudflare.com/kv/)
- [Workers Storage Options guide](https://developers.cloudflare.com/workers/platform/storage-options/)
- [NobodyClimb system architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb RAG Pipeline architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) — KV's role in semantic caching
- [Cloudflare R2: Zero-Egress Object Storage](/posts/tech/2026-03-27-cloudflare-r2-object-storage-en)
