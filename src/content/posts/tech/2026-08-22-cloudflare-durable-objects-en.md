---
title: "Cloudflare Durable Objects: Coordinating Realtime State with Globally Unique Actors"
date: 2026-08-22
category: tech
type: deep-dive
tags: [cloudflare, durable-objects, edge, websocket, distributed-systems]
lang: en
tldr: "Durable Objects route a name or ID to a globally unique, single-threaded actor with strongly consistent storage, WebSockets, and alarms; correctness depends on the object key and explicit lifecycle handling."
description: "Cloudflare Durable Object identity, single-threaded coordination, storage, RPC, WebSocket hibernation, alarms, sharding, location, and migration."
series:
  name: "AI 時代的技術選擇"
  order: 110
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-cloudflare-durable-objects)

[Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/) maps a name or ID to a globally unique actor instance. Requests for one object coordinate in one execution context with private, strongly consistent transactional storage. This fits chat rooms, matches, rate limiters, per-user state, and collaborative documents—not an entire application in one global singleton.

## Object identity is the concurrency boundary

`idFromName("room:123")` routes every room 123 request to one coordinator, while different rooms scale across objects. A key that is too coarse creates a hot object and throughput bottleneck; one that is too fine loses atomic coordination. State the invariant—what must be decided serially together—before selecting the key.

Objects are single-threaded, but async interleaving and external side effects can still race or duplicate. Storage transactions protect object-local data, not D1, R2, third-party APIs, or another object. Use idempotency, outboxes, and compensation across systems rather than treating an actor as a distributed transaction.

## Memory disappears; identity and storage persist

Idle objects can be evicted and reconstructed, rerunning the constructor. Persist important state and rebuild caches. Alarms wake objects for future work, but handlers need idempotency and retry handling. SQLite-backed storage offers SQL and KV interfaces; verify current capacity and query and request limits.

The Hibernation WebSocket API lets JavaScript sleep while clients remain connected and wakes on messages. Hibernation clears memory, so restore per-connection metadata from attachments or storage. Standard WebSockets, timers, pending requests, or outbound sockets may block hibernation and accrue duration cost. Slow consumers, queue caps, broadcast batching, deployment draining, and renewed authorization remain application duties.

Durable Objects fit per-key linear coordination inside Workers. PartyKit supplies a higher-level room framework; Liveblocks supplies collaboration features; Ably manages messaging; Redis and database locks have different consistency and cost models. Test hot-key throughput, placement latency, cold starts, storage growth, migrations and rollback, duplicate alarms, WebSocket hibernation, deletion, and provider outages.

## References

- [Durable Objects documentation](https://developers.cloudflare.com/durable-objects/)
- [What are Durable Objects?](https://developers.cloudflare.com/durable-objects/concepts/what-are-durable-objects/)
- [Rules of Durable Objects](https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/)
- [Storage API](https://developers.cloudflare.com/durable-objects/api/storage-api/)
- [WebSockets and hibernation](https://developers.cloudflare.com/durable-objects/best-practices/websockets/)
- [Durable Object lifecycle](https://developers.cloudflare.com/durable-objects/concepts/durable-object-lifecycle/)
- [Alarms](https://developers.cloudflare.com/durable-objects/api/alarms/)
