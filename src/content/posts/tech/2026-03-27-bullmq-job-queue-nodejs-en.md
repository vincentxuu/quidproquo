---
title: "BullMQ: The Most Mature Redis-Backed Job Queue for Node.js"
date: 2026-03-27
type: guide
category: tech
tags: [bullmq, redis, queue, nodejs, background-jobs]
lang: en
tldr: "BullMQ is the most mature job queue in the Node.js ecosystem, backed by Redis, with support for priorities, retries, scheduling, and delayed jobs. DaoDao uses it to handle notification delivery and practice auto-completion scheduling."
description: "BullMQ lets Node.js applications offload time-consuming work to background queues, with support for P1/P2 priority levels, automatic retries, delayed jobs, and batch scheduling. This guide covers everything from core concepts to real-world examples, showing how DaoDao's notification system uses BullMQ to handle in-app notifications and batch email delivery."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-bullmq-job-queue-nodejs)

Web API response times should stay under 100ms — but sending emails, push notifications, or calling external AI services can take seconds or even tens of seconds. The fix is straightforward: don't do this work inside the request/response cycle. Throw it into a background queue and let a worker handle it asynchronously.

BullMQ is the best tool for this job in the Node.js ecosystem. It's backed by Redis, battle-tested, well-documented, and TypeScript-native.

---

## What Is BullMQ

BullMQ is a Redis-based job queue library — a complete rewrite of the original Bull library with a cleaner API and TypeScript-first design.

Three core concepts:

- **Queue**: A named job queue stored as a Redis key
- **Job**: A task added to the queue, carrying a payload and configuration (priority, retry count, delay)
- **Worker**: A process that consumes the queue — pulls jobs from Redis and executes them

```
Producer → Queue (Redis) → Worker
```

Redis's sorted sets and lists guarantee atomicity: the same job won't be picked up by two workers simultaneously, even when running multiple worker processes.

---

## Installation

```bash
npm install bullmq ioredis
```

---

## Basic Usage

**Create a Queue and Producer**

```typescript
import { Queue } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis({ host: 'localhost', port: 6379 });

const notificationQueue = new Queue('notifications', { connection });

// Add a job to the queue
await notificationQueue.add('send-email', {
  userId: 'user-123',
  type: 'mention',
  mentionedBy: 'user-456',
});
```

**Create a Worker**

```typescript
import { Worker } from 'bullmq';

const worker = new Worker(
  'notifications',
  async (job) => {
    const { userId, type, mentionedBy } = job.data;

    if (type === 'mention') {
      await sendMentionEmail(userId, mentionedBy);
    }
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});
```

---

## Priorities, Retries, and Delays

**Priority**: Lower numbers mean higher priority (1 > 10)

```typescript
// P1: high priority, process immediately
await notificationQueue.add('in-app-p1', payload, {
  priority: 1,
});

// P2: lower priority, can wait
await notificationQueue.add('in-app-p2', payload, {
  priority: 10,
});
```

**Automatic Retries**: Retry on failure with exponential backoff to avoid hammering external services

```typescript
await notificationQueue.add('send-email', payload, {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000, // 2s → 4s → 8s
  },
});
```

**Delayed Jobs**: Hold the job for N milliseconds before making it available to workers

```typescript
// Execute after 5 minutes
await notificationQueue.add('digest-email', payload, {
  delay: 5 * 60 * 1000,
});
```

**Scheduling (Cron)**: Run on a schedule, just like crontab

```typescript
// Run email batch every 4 hours
await notificationQueue.add(
  'email-batch',
  {},
  {
    repeat: { pattern: '0 */4 * * *' },
  }
);
```

---

## DaoDao's Notification System

DaoDao's notification system is built entirely on BullMQ, with three worker pipelines:

```
User interaction (like, comment, follow, mention)
        │
        ▼
  Notification Service (determines P1 / P2)
        │
        ├── In-App Worker (creates notification record immediately → PostgreSQL)
        │     ├── P1: individual notifications (mentions, buddy requests)
        │     └── P2: aggregated notifications (likes, follows)
        │
        ├── Email Worker (batch every 4 hours)
        │     └── fetch pending notifications → merge by type → send
        │
        └── Weekly Worker (weekly schedule)
              └── weekly digest email (practice stats + interaction summary)
```

**The Logic Behind P1 vs P2**

Not every user interaction warrants an immediate notification. Being mentioned is important — you need to know right away. But someone liking your post? That can wait.

P1 (priority: 1): mentions, buddy requests, buddy check-ins — creates individual notification records, sent directly without aggregation in the email batch

P2 (priority: 10): likes, follows, comments — creates aggregated notifications (grouped by type), merged into messages like "3 people liked your post" in the email batch

**Email Batch Worker Logic**

```typescript
// Runs every 4 hours
const emailBatchWorker = new Worker('email-batch', async () => {
  const pendingUsers = await db.getUsersWithPendingNotifications();

  for (const userId of pendingUsers) {
    const notifications = await db.getPendingNotifications(userId);

    const p1 = notifications.filter((n) => n.priority === 'P1');
    const p2 = groupByType(notifications.filter((n) => n.priority === 'P2'));

    await sendDigestEmail(userId, { p1, p2 });
    await db.markNotificationsAsSent(userId);
  }
});
```

---

## Monitoring

BullMQ has an official dashboard: **Bull Board**. It gives you a real-time view of waiting, active, completed, and failed job counts for each queue, and lets you manually retry failed jobs.

```bash
npm install @bull-board/express @bull-board/api
```

```typescript
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';

const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [new BullMQAdapter(notificationQueue)],
  serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());
```

---

## Trade-offs

**Pros**
- TypeScript-first with complete type definitions
- Full feature set: priorities, retries, delays, cron, batch processing
- Redis guarantees no job loss (with persistence enabled)
- Bull Board dashboard is intuitive and practical
- Horizontally scalable: run multiple worker processes simultaneously, Redis handles coordination

**Cons**
- Redis dependency — if Redis goes down, the entire queue stops
- Not suited for cross-language scenarios (a Python worker can't consume BullMQ jobs directly); DaoDao's Python AI service uses Celery in a separate setup
- Job payloads are stored in Redis — avoid storing large data blobs (store an ID instead and have the worker fetch from the database)

---

## BullMQ vs Alternatives

| | BullMQ | pg-boss | Celery |
|---|---|---|---|
| Backend | Redis | PostgreSQL | Redis / RabbitMQ |
| Language | Node.js | Node.js | Python |
| Priority | Native | Supported | Supported |
| TypeScript | Native | Supported | N/A |

If you already have PostgreSQL and want to avoid adding Redis, pg-boss is a solid alternative. Python backend? Use Celery. Node.js + Redis? BullMQ is the obvious choice.

---

## References

- [BullMQ Official Docs](https://docs.bullmq.io/)
- [Bull Board Monitoring Dashboard](https://github.com/felixmosh/bull-board)
- [ioredis (Node.js Redis client)](https://github.com/redis/ioredis)
- [DaoDao Tech Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — Full context on BullMQ's P1/P2 notification priority design, batch email delivery, and weekly digest scheduling
