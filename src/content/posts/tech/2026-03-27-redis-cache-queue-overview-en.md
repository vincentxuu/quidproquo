---
title: "Redis Essentials: Caching, Sessions, and Pub/Sub in One Go"
date: 2026-03-27
type: guide
category: tech
tags: [redis, cache, session, pub-sub]
lang: en
tldr: "Redis is an in-memory key-value store that's blazingly fast. DaoDao uses it to handle three responsibilities at once — API caching, session storage, and BullMQ job queues — all from a single Redis instance."
description: "Redis is more than just a cache. This guide covers Redis's core use cases: API response caching, session storage, Pub/Sub messaging, and serving as the underlying broker for BullMQ — along with how DaoDao uses all three patterns in a real production architecture."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-redis-cache-queue-overview)

Redis is an in-memory key-value database where all data lives in RAM by default, making reads and writes 10–100x faster than disk-based databases. It's not a replacement for PostgreSQL — it's designed to intercept queries that don't need to hit the database every single time.

DaoDao uses Redis to do three things simultaneously: API caching, session storage, and as the underlying broker for BullMQ job queues.

---

## Why Redis

There are a few scenarios where Redis really shines:

- **High-read, low-write data**: Leaderboards, trending posts, homepage recommendation lists — these get read hundreds of times per minute but only update every few minutes. No need to hit the database on every request.
- **Ephemeral data**: Session tokens, OAuth state, verification codes — once they expire they're useless, so they don't need to be persisted to disk.
- **Async task queues**: Job queue libraries like BullMQ and Celery need a reliable broker to store pending jobs. Redis's list and sorted set structures are a natural fit.

The downside of Redis is that memory is expensive — costs scale quickly as data volume grows. So the general practice is to store only "hot data" or "ephemeral data" in Redis, leaving cold data in PostgreSQL.

---

## Core Data Structures

Redis isn't just a simple key-value store. It has five main data types:

| Type | Use Case |
|------|----------|
| **String** | The most basic type — cache values, counters |
| **Hash** | Like a JSON object — ideal for session data |
| **List** | Ordered list — BullMQ uses this for job queues |
| **Set** | Unordered unique collection — useful for follow/follower relationships |
| **Sorted Set** | Ranked collection — perfect for leaderboards |

---

## Basic Usage

Install the Node.js client (DaoDao uses `ioredis`):

```bash
npm install ioredis
```

Connect:

```typescript
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  password: process.env.REDIS_PASSWORD,
});
```

**String: Caching API Responses**

```typescript
// Set cache with a 5-minute TTL
await redis.set('posts:trending', JSON.stringify(posts), 'EX', 300);

// Read from cache
const cached = await redis.get('posts:trending');
if (cached) return JSON.parse(cached);

// Cache miss → hit the database, then store the result
const posts = await db.getTopPosts();
await redis.set('posts:trending', JSON.stringify(posts), 'EX', 300);
return posts;
```

**Hash: Storing Sessions**

```typescript
// Create a session on login
await redis.hset(`session:${sessionId}`, {
  userId: user.id,
  createdAt: Date.now(),
});
await redis.expire(`session:${sessionId}`, 7 * 24 * 60 * 60); // 7 days

// Read on authentication
const session = await redis.hgetall(`session:${sessionId}`);
if (!session.userId) throw new UnauthorizedError();
```

**Pub/Sub: Real-time Notifications**

```typescript
// Publisher
const pub = new Redis();
await pub.publish('notifications', JSON.stringify({ type: 'mention', userId: '123' }));

// Subscriber
const sub = new Redis();
sub.subscribe('notifications');
sub.on('message', (channel, message) => {
  const data = JSON.parse(message);
  // Handle notification
});
```

---

## How DaoDao Uses Redis

DaoDao uses Redis to serve three distinct roles simultaneously:

**1. API Caching + Sessions**
The Node.js backend caches high-frequency API responses in Redis. Session tokens are stored in Redis Hashes with a TTL — they expire automatically without needing a separate cleanup job.

**2. OAuth State Store**
During Google OAuth login, the `state` parameter is used to prevent CSRF attacks. The state value is generated at login time, stored in Redis, then verified when the OAuth callback arrives to confirm it corresponds to the original login request. The TTL is set short (a few minutes), so stale entries clean themselves up.

**3. BullMQ Broker**
This is the most critical use. BullMQ serializes all jobs (notification dispatch, scheduled tasks) into Redis sorted sets and lists. Workers pull jobs from there for processing. Redis's atomicity guarantees that the same job is never picked up by two workers simultaneously.

Architecture overview:

```
Node.js Server
    │
    ├── cache / session  →  Redis (String / Hash)
    │
    └── enqueue job      →  Redis (BullMQ)
                                │
                        BullMQ Worker
                                │
                         Send notification email
```

---

## Persistence Configuration

By default, Redis data lives only in memory and is lost on restart. There are two persistence options:

- **RDB (Snapshots)**: Dumps the entire dataset to disk at set intervals. Data can be recovered on restart, but you may lose the last few minutes of writes.
- **AOF (Append-Only File)**: Logs every write operation. Lower risk of data loss, but produces larger files.

For DaoDao's use cases, losing cached data or session data and rebuilding is mostly fine — but losing BullMQ jobs is a problem. So persistence needs to be enabled. In practice, both modes are usually enabled together: RDB for backups, AOF for real-time protection.

---

## Trade-offs

**Pros**
- Extremely fast — microsecond-level read/write latency
- Rich data structures beyond simple key-value
- Mature ecosystem — BullMQ, ioredis, and most ORMs support it out of the box
- Built-in TTL support makes managing ephemeral data straightforward

**Cons**
- Memory is expensive — not suited for large datasets
- No built-in cluster by default — high availability requires extra configuration
- Not suited for complex queries (JOINs, aggregations) — that's PostgreSQL's job
- Eventual consistency risk: there's a brief window where the cache and database may be out of sync

---

## When Not to Use Redis

- Need complex relational queries → PostgreSQL
- Need full-text search → Elasticsearch / pg_trgm
- Need semantic search → Qdrant
- Large dataset but low read frequency → plain PostgreSQL with good indexes is enough

Redis is an accelerator in the toolbox, not a general-purpose database. Before reaching for it, ask: "Is this data hot enough? What happens if it expires?" That question usually gives you the answer.

---

## References

- [Redis Official Documentation](https://redis.io/docs/)
- [ioredis (Node.js client)](https://github.com/redis/ioredis)
- [Redis Data Types Overview](https://redis.io/docs/data-types/)
- [Redis Persistence Configuration Guide](https://redis.io/docs/management/persistence/)
- [DaoDao Tech Architecture Deep Dive](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — Full context on how Redis handles caching, sessions, and BullMQ simultaneously in a real project
