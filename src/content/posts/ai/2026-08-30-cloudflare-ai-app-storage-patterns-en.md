---
title: "Where to Store Cloudflare AI App Data: D1, R2, and Durable Objects"
date: 2026-08-30
type: guide
category: ai
tags: [cloudflare, d1, r2, durable-objects, rag, agents]
lang: en
tldr: "An AI app should not put conversations, artifacts, memory, retrieval documents, locks, and eval traces into one store. D1 fits queryable product data, R2 fits large files and artifacts, Durable Objects fit named coordination and per-session state, and Agent Memory / AI Search / Vectorize handle memory and retrieval."
description: "A practical storage architecture for AI, RAG, and agent apps on Cloudflare, covering D1, R2, Durable Objects, Agent Memory, AI Search, Vectorize, and Analytics Engine."
draft: true
series:
  name: "Cloudflare AI Stack"
  order: 12
additionalSeries:
  - name: "Cloudflare Edge Platform"
    order: 25
---

> 🌏 [中文版](/posts/ai/2026-08-30-cloudflare-ai-app-storage-patterns)

AI apps often put data in the wrong place. Conversations go into D1, full transcripts go into D1, PDFs go into D1, embedding metadata goes into D1, tool outputs go into D1, and eventually the database becomes a file cabinet. The opposite mistake is putting everything into R2, then discovering that status queries, tenant filters, and reports require object scans.

Cloudflare's advantage is that it has many data primitives. The drawback is the same: [D1](https://developers.cloudflare.com/d1/), [R2](https://developers.cloudflare.com/r2/), [Durable Objects](https://developers.cloudflare.com/durable-objects/), KV, Queues, Analytics Engine, AI Search, Vectorize, and Agent Memory can blur together. This post does not repeat each service's introduction. It maps common AI / RAG / agent app data to the right place.

## Start with Data Shape

I would start with this table:

| Data | Primary place | Reason |
|---|---|---|
| users, tenants, plans, conversation indexes | D1 | SQL, joins, queries, reports |
| full transcripts, attachments, PDFs, screenshots, tool outputs | R2 | large unstructured objects |
| current agent/session state, WebSocket coordination, locks | Durable Objects | named instances, strong consistency, near-compute state |
| user preferences, team rules, project memory | Agent Memory | cross-conversation scoped memory |
| RAG document retrieval | AI Search / Vectorize | managed RAG or custom vector search |
| queue jobs and workflow run indexes | D1 + Queues / Workflows | queryable state separated from background execution |
| usage, latency, tokens, tool metrics | Analytics Engine | high-cardinality events and time series |

The question is not which service is strongest. It is which data shape matches the problem.

## D1: Product Data and Queryable State

[D1](https://developers.cloudflare.com/d1/) is Cloudflare's managed serverless database with SQLite SQL semantics, Worker and HTTP API access, Time Travel, and Global Read Replication. It fits product data and queryable state:

- users / tenants / memberships
- conversations table
- messages index
- jobs / workflow runs
- billing events
- eval run summaries
- document metadata

A conversation does not need to store its full body in D1. A sturdier pattern is:

```sql
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  r2_key TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

D1 keeps indexes and queryable fields. R2 keeps the full transcript. You can query how many conversations a tenant had in the last 30 days without making the SQL database carry long text bodies.

## R2: Large Content and Artifacts

[R2](https://developers.cloudflare.com/r2/) is object storage for large unstructured data, without the egress bandwidth fees associated with typical cloud storage services. Common AI app uses include:

- user-uploaded PDFs, images, audio, CSV files
- source documents for RAG
- intermediate Markdown conversion output
- model / eval artifacts
- sandbox output
- browser screenshots and PDFs
- full conversation transcripts
- raw email or webhook payload archives

The rule is simple: if the data is large, retrieved as a whole, and not queried with SQL, store it as an object. D1 stores pointers and metadata. R2 stores bodies.

For example:

```ts
await env.ARTIFACTS.put(`tenants/${tenantId}/runs/${runId}/transcript.json`, JSON.stringify(messages), {
  httpMetadata: { contentType: "application/json" },
});

await env.DB.prepare(
  "UPDATE conversations SET r2_key = ?, updated_at = ? WHERE id = ?",
).bind(r2Key, new Date().toISOString(), conversationId).run();
```

The app queries the conversation in D1, then loads the full content from R2.

## Durable Objects: Named Coordination and Per-Session State

[Durable Objects](https://developers.cloudflare.com/durable-objects/) are the stateful serverless building block. The official docs emphasize that each Durable Object has a globally unique name and attached durable storage, which makes it fit coordination among clients or events.

In AI apps, Durable Objects often serve as:

- a WebSocket hub for one chat session
- the state owner for one agent instance
- a lock for one tenant or job
- a Browser Run session coordinator
- a Container / Sandbox lifecycle controller
- a rate limit bucket or concurrency controller

Durable Objects should not become the only product database. They are strongest at ordering and coordination for one entity. For example, streaming response, tool calls, user cancel, and reconnect events for one conversation should reach the same DO or Agent instance.

```ts
const id = env.CHAT_SESSION.idFromName(`${tenantId}:${conversationId}`);
const stub = env.CHAT_SESSION.get(id);
return stub.fetch(request);
```

That is more natural than pushing every synchronization problem into D1 transactions. D1 handles queries. Durable Objects handle live coordination.

## Agent Memory, AI Search, and Vectorize

Three AI data layers are easy to collapse into one bucket:

- Agent Memory: user/team/project facts, events, instructions, and tasks.
- AI Search: a managed RAG pipeline with data sources, indexing, and hybrid retrieval handled by Cloudflare.
- Vectorize: vector search where you control embeddings, metadata, and query path.

User preferences should not be hidden inside an AI Search document corpus. Product documentation should not become Agent Memory. An embedding index should not be the archive for full transcripts.

I would decide this way:

- "Remember this next time with this user": Agent Memory.
- "Retrieve documents while answering": AI Search or Vectorize.
- "Replay or audit the full record later": R2.
- "List, filter, join, or report": D1.
- "A session is running right now": Durable Objects / Agents.

## A Practical Architecture

Suppose you are building a support agent:

1. Worker receives chat, email, or webhook events.
2. Agent instance or Durable Object is addressed by `tenantId:userId`.
3. Agent Memory recalls user preferences, past events, and team instructions.
4. AI Search retrieves product docs and support knowledge.
5. D1 stores conversation indexes, ticket state, and billing events.
6. R2 stores full transcripts, attachments, generated summaries, and raw email.
7. Queues handles non-immediate classification, summaries, notifications, and retries.
8. Analytics Engine records tokens, latency, tool calls, retrieval hits, and tenant usage.

Each layer can change, but responsibilities should not blur. D1 is not a blob store. R2 is not a query engine. Durable Objects are not a BI database. Agent Memory is not a universal knowledge base.

## What Not to Store

AI apps are prone to over-retention. A few rules:

- Do not write provider API keys, session cookies, or OAuth tokens into transcripts.
- Do not put full prompts and responses into logs by default.
- Do not put personal data into Analytics Engine dimensions.
- Do not let R2 object keys reveal sensitive tenant or user information.
- Memory must support list, delete, and profile deletion flows.
- Eval traces should be separated from production user data.

Putting data in the right place is only the first step. The next step is deciding what should not exist, what should be short-lived, and what must be deletable.

## Minimum Viable Setup

If I were building a Cloudflare AI app tonight, I would start with:

- D1: `users`, `conversations`, `messages_index`, `jobs`.
- R2: `transcripts/`, `uploads/`, `artifacts/`.
- Durable Objects / Agents: `conversationId` or `tenantId:userId` as the instance key.
- AI Search: managed RAG first, then Vectorize only when custom retrieval is needed.
- Analytics Engine: usage, latency, and errors only; no PII.
- Secrets Store: AI Gateway BYOK or provider keys reused across Workers.

This is not the most complete version, but it has clear responsibility boundaries. As the workload grows, add queues, workflows, containers, browser tooling, and memory deliberately.

## References

- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [Cloudflare Agent Memory](https://developers.cloudflare.com/agent-memory/)
- [Cloudflare AI Search](https://developers.cloudflare.com/ai-search/)
- [Cloudflare Vectorize](https://developers.cloudflare.com/vectorize/)
- [Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/)
