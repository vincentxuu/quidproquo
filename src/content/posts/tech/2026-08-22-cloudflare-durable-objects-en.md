---
title: "Cloudflare Durable Objects: The Stateful Coordination Layer for Workers and WebSockets"
date: 2026-08-22
category: tech
type: deep-dive
tags: [cloudflare, durable-objects, edge, websocket, distributed-systems]
lang: en
tldr: "Durable Objects map a name or ID to a globally unique, single-threaded actor with private SQLite storage. They fit per-room, per-user, per-tenant, and per-run coordination boundaries; the real design question is where the object key belongs."
description: "A practical guide to Cloudflare Durable Objects: actor identity, SQLite storage, RPC, WebSocket hibernation, alarms, sharding, control/data planes, and their role in AI apps."
series:
  name: "Technology Choices in the AI Era"
  order: 110
additionalSeries:
  - name: "Cloudflare Edge Platform"
    order: 7
  - name: "Cloudflare AI Stack"
    order: 14
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-cloudflare-durable-objects)

[Cloudflare Workers](https://developers.cloudflare.com/workers/) are excellent for stateless requests: auth, routing, rendering, API handlers, and small transformations. The next layer is harder: a chat room needs broadcast coordination, a collaborative document needs ordered patches, a booking flow cannot sell the same seat twice, and an agent run cannot let concurrent steps spend the same budget twice. These cases need a place where operations for the same key are decided serially. [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/) are that state and coordination primitive for Cloudflare's serverless runtime.

The official model is direct: a Durable Object is a special Worker that combines compute and storage in one globally unique object instance. Each object has a unique name or ID, a single-threaded execution context, and private durable storage. Requests from anywhere can reach that object, letting it coordinate one room, document, user, tenant, or job.

## Coordination, not general storage

Cloudflare already has several data products. [D1](https://developers.cloudflare.com/d1/) is a SQL database, [KV](https://developers.cloudflare.com/kv/) is a globally distributed key-value store, and [R2](https://developers.cloudflare.com/r2/) is object storage. Durable Objects occupy a different slot: operations for one logical entity enter one execution point.

Use this rough map:

| Need | Start with |
|---|---|
| Queries, reports, relational data | D1 |
| Global read-mostly config or session cache | KV |
| Files, images, artifacts, datasets | R2 |
| Serializable coordination for one room/user/tenant/run | Durable Objects |
| Slow work, batch processing, retries | Queues / Workflows |

The common mistake is treating DO as a tiny database. If all you need is a profile record, and profile updates do not need to serialize through one actor, D1 or KV may be simpler. DO becomes the right tool when you can state an invariant: one ticket cannot be sold twice, messages in a room need a coherent order, patches to a document need one coordinator, or an agent run must advance through one state machine.

## The object key is the design decision

The core of Durable Objects is object identity. `getByName("room:123")` or `idFromName("room:123")` routes the same name to the same object. That name is your concurrency boundary.

```ts
import { DurableObject } from "cloudflare:workers";

export interface Env {
  ROOMS: DurableObjectNamespace<Room>;
}

export class Room extends DurableObject<Env> {
  async send(userId: string, message: string) {
    this.ctx.storage.sql.exec(
      "INSERT INTO messages (user_id, body, created_at) VALUES (?, ?, ?)",
      userId,
      message,
      Date.now(),
    );

    return { ok: true };
  }
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const roomId = url.searchParams.get("room");
    if (!roomId) return new Response("missing room", { status: 400 });

    const room = env.ROOMS.getByName(`room:${roomId}`);
    const body = await request.json<{ userId: string; message: string }>();
    return Response.json(await room.send(body.userId, body.message));
  },
};
```

A key that is too coarse becomes a hot object. If every chat room uses `getByName("global")`, all traffic bottlenecks on one object. A key that is too fine loses coordination. If every message is its own object, no one owns room order. Cloudflare's [Rules of Durable Objects](https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/) frames this as modeling around the coordination atom: room, document, booking event, seat group, session, or run.

The limits page also matters: one object is inherently single-threaded and has a soft limit around `1,000 requests / second` for simple operations; JSON parsing, storage writes, and external calls reduce that. Durable Objects scale by sharding the data model into many self-contained objects, not by making one object larger.

## SQLite-backed storage is the default path

Durable Object storage is private to the object that owns it. In 2026, the important shift is that [SQLite-backed Durable Object Storage](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/) is the recommended backend for new namespaces. Cloudflare's docs also recommend declaring new Durable Object classes with `exports` and `storage: "sqlite"`. The Free plan can use SQLite-backed Durable Objects; legacy KV-backed namespaces are not available to new Free-plan use.

The modern setup has two pieces: export the Durable Object class from Worker code, then declare both the binding and `exports` in `wrangler.jsonc`.

```jsonc
{
  "durable_objects": {
    "bindings": [
      {
        "name": "ROOMS",
        "class_name": "Room"
      }
    ]
  },
  "exports": {
    "Room": {
      "type": "durable-object",
      "storage": "sqlite"
    }
  }
}
```

SQLite storage supports the SQL API, point-in-time recovery, synchronous and asynchronous KV APIs, and alarms. It is not an external SQLite server. It is a private embedded database per object. Store the state that object coordinates: room messages, presence snapshots, document metadata, rate-limit counters, or run steps. Cross-object queries, site-wide search, reports, and analytics belong in D1, R2, Analytics Engine, or a warehouse.

One subtle API detail: `sql.exec()` returns a cursor, and the docs warn against holding that cursor across an `await`. Consume it with `.toArray()` or `Array.from(cursor)` before external I/O.

```ts
const rows = this.ctx.storage.sql
  .exec("SELECT * FROM messages ORDER BY created_at DESC LIMIT 50")
  .toArray();

await fetch("https://example.com/audit", {
  method: "POST",
  body: JSON.stringify(rows),
});
```

## Memory accelerates, storage is truth

A DO instance can be evicted or hibernated after inactivity; the next request runs the constructor again. [In-memory state](https://developers.cloudflare.com/durable-objects/reference/in-memory-state/) is useful for cache and short batching, but not as the durable source of truth.

Good uses:

- Load room metadata from storage on startup, then read `this.roomConfig`.
- Batch presence changes briefly before writing to storage.
- Keep a small hot index or config cache to reduce storage calls.

Risky uses:

- Keep payment state only in memory before persisting it.
- Store per-object data in module-level globals, which can leak across objects sharing an isolate.
- Perform heavy network initialization in the constructor, slowing every wake-up.

When initialization is required, use `ctx.blockConcurrencyWhile()` so the first request waits until state is loaded. Keep that initialization short and repeatable.

## WebSocket hibernation controls cost

Durable Objects are a natural WebSocket server because all connections for a room can meet at one coordinator. [WebSocket Hibernation](https://developers.cloudflare.com/durable-objects/best-practices/websockets/) is the production cost lever: clients stay connected while the JavaScript instance sleeps during idle periods, then wakes when a message arrives.

The API distinction matters:

- `ctx.acceptWebSocket(server)`: supports hibernation and is the recommended path.
- `server.accept()`: standard WebSocket API, familiar but non-hibernating; connected time can keep duration billing active.

Hibernation clears memory. Per-connection metadata needed after wake-up should go into `serializeAttachment()`, or durable data should go into storage with only a key stored on the attachment. The docs list a 16,384-byte attachment limit; larger data does not belong on the connection.

Hibernation does not remove all realtime work. Slow clients, broadcast batching, reconnect catch-up, authorization renewal, deploy draining, and hot rooms are still application concerns. High-frequency tiny messages can overwhelm a single object through context-switch overhead; Cloudflare recommends batching logical messages into fewer, larger frames.

## Alarms are per-object schedules

[Durable Objects Alarms](https://developers.cloudflare.com/durable-objects/api/alarms/) let an object wake itself at a future time and run `alarm()`. They are finer-grained than Cron Triggers because every object can have its own alarm. Use cases:

- Clear presence after a room has been idle for an hour.
- Release a booking hold after ten minutes.
- Mark an agent run as timed out.
- Flush usage counters per tenant.

Each object can have one alarm scheduled at a time. If you need many scheduled events, store the schedule in storage, process due events in `alarm()`, then set the next alarm. Alarms are at-least-once and retry with exponential backoff up to 6 times when the handler throws. The handler must be idempotent, and external side effects need dedupe keys.

```ts
export class AgentRun extends DurableObject<Env> {
  async start(runId: string) {
    this.ctx.storage.sql.exec(
      "INSERT OR IGNORE INTO runs (id, status, started_at) VALUES (?, ?, ?)",
      runId,
      "running",
      Date.now(),
    );
    await this.ctx.storage.setAlarm(Date.now() + 15 * 60 * 1000);
  }

  async alarm() {
    this.ctx.storage.sql.exec(
      "UPDATE runs SET status = ? WHERE status = ?",
      "timed_out",
      "running",
    );
  }
}
```

## Split control plane and data plane

Cloudflare's [Durable Objects reference architecture](https://developers.cloudflare.com/reference-architecture/diagrams/storage/durable-object-control-data-plane-pattern/) recommends separating control plane from data plane. The control plane owns resource metadata: create, delete, list, permissions. The data plane handles the high-volume path: read and write one document, room, or user workspace.

```txt
Worker
  |
  +--> Control DO: workspace registry, permissions, resource list
  |
  +--> Data DO: document:abc
  +--> Data DO: document:def
  +--> Data DO: room:123
```

That avoids sending every request through a registry DO. Resource creation goes through the control DO; normal reads and writes route directly from the Worker to the data DO. When the data model can be split by resource, the system scales across many DOs instead of pushing one object to its limit.

## Role in AI apps

In the Cloudflare AI Stack, Durable Objects usually play three roles.

First, **session coordinator**. One agent run, chat session, or browser automation task maps to one DO. It owns current step, tool-call state, cancellation flags, budget, WebSocket/SSE fan-out, and final status. Model calls can go through [AI Gateway](https://developers.cloudflare.com/ai-gateway/), long-term documents can live in [AI Search](https://developers.cloudflare.com/ai-search/) or [Vectorize](https://developers.cloudflare.com/vectorize/), but strong-consistency session progress belongs in DO.

Second, **per-tenant control point**. One DO per tenant can manage API quota, plan limits, feature-flag cache, and tenant-specific route policy. Global data still belongs in D1; DO should hold the part that needs serial decisions.

Third, **realtime bridge**. While an agent is working, the frontend needs stream updates, cancellation, retry, and human override. A DO can colocate WebSocket clients, run state, and durable storage so the UI does not poll D1.

Do not use DO as all AI memory. Long-term searchable knowledge belongs in RAG; large artifacts belong in R2; analytics and eval traces can flow to Analytics Engine or R2. DO owns the question: what is this key's current state, and can the next step proceed?

## When not to use it

Skip Durable Objects when:

- The request is fully stateless, like proxying an API or rendering HTML.
- You need global queries, joins, or reports rather than per-entity coordination.
- One key receives extreme traffic and cannot be sharded further.
- Data is large enough to approach the per-object 10 GB limit, or each operation scans too many rows.
- External side effects are the real bottleneck; DO can serialize calls, but it cannot make a third-party API faster.

Durable Objects are powerful, but they do not remove the need for data modeling. They force one question: what must be serialized at the same execution point? When the answer is clear, DO gives a serverless app a capability that D1, KV, and R2 do not replace. When the answer is vague, it becomes a more expensive and harder-to-debug singleton.

## Update Log

- 2026-08-30: Rewrote the post for the Cloudflare Edge Platform / AI Stack content paths, adding SQLite-backed storage, `exports` configuration, WebSocket hibernation, alarms, control/data planes, and AI app architecture roles.

## References

- [Cloudflare Durable Objects — Overview](https://developers.cloudflare.com/durable-objects/)
- [Cloudflare Durable Objects — What are Durable Objects?](https://developers.cloudflare.com/durable-objects/concepts/what-are-durable-objects/)
- [Cloudflare Durable Objects — Rules of Durable Objects](https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/)
- [Cloudflare Durable Objects — Getting started](https://developers.cloudflare.com/durable-objects/get-started/)
- [Cloudflare Durable Objects — SQLite-backed Durable Object Storage](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/)
- [Cloudflare Durable Objects — In-memory state](https://developers.cloudflare.com/durable-objects/reference/in-memory-state/)
- [Cloudflare Durable Objects — WebSockets and hibernation](https://developers.cloudflare.com/durable-objects/best-practices/websockets/)
- [Cloudflare Durable Objects — Alarms](https://developers.cloudflare.com/durable-objects/api/alarms/)
- [Cloudflare Durable Objects — Limits](https://developers.cloudflare.com/durable-objects/platform/limits/)
- [Cloudflare Durable Objects — Pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)
- [Cloudflare Reference Architecture — Durable Object control/data plane pattern](https://developers.cloudflare.com/reference-architecture/diagrams/storage/durable-object-control-data-plane-pattern/)
- [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/)
