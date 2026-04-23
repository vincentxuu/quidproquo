---
title: "BullMQ：Node.js 最成熟的 Redis-backed 任務佇列"
date: 2026-03-27
type: guide
category: tech
tags: [bullmq, redis, queue, nodejs, background-jobs]
lang: zh-TW
tldr: "BullMQ 是 Node.js 生態裡最成熟的任務佇列，底層用 Redis，支援優先級、重試、排程、延遲任務。島島用它處理通知發送和實踐自動完成排程。"
description: "BullMQ 讓 Node.js 應用把耗時工作丟進背景佇列，支援 P1/P2 優先級、自動重試、延遲任務、批次排程。這篇從基本概念到實際範例，說明島島（DaoDAO）通知系統如何用 BullMQ 處理 in-app 通知和 Email 批次發送。"
draft: false
---

Web API 的 response time 應該在 100ms 以內，但發 Email、推播通知、呼叫外部 AI 服務可能要幾秒甚至幾十秒。解法很簡單：不要在 request/response 週期裡做這些事，丟進背景佇列，讓 worker 非同步處理。

BullMQ 是 Node.js 生態裡做這件事的最佳選擇。它底層用 Redis，成熟、有完整文件、TypeScript 原生支援。

---

## BullMQ 是什麼

BullMQ 是 Redis-based 的 job queue library，前身是 Bull（BullMQ 是重寫版，API 更清楚，TypeScript first）。

核心概念三個：

- **Queue**：任務佇列，就是個有名字的 Redis key
- **Job**：丟進佇列的任務，帶有 payload 和配置（優先級、重試次數、延遲時間）
- **Worker**：消費佇列的 process，從 Redis 取 job 出來執行

```
Producer → Queue (Redis) → Worker
```

Redis 的 sorted set 和 list 確保 job 的原子性：同一個 job 不會被兩個 worker 同時取走，即使你開了多個 worker process。

---

## 安裝

```bash
npm install bullmq ioredis
```

---

## 基本用法

**建立 Queue 和 Producer**

```typescript
import { Queue } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis({ host: 'localhost', port: 6379 });

const notificationQueue = new Queue('notifications', { connection });

// 丟 job 進去
await notificationQueue.add('send-email', {
  userId: 'user-123',
  type: 'mention',
  mentionedBy: 'user-456',
});
```

**建立 Worker**

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

## 優先級、重試、延遲

**優先級**：數字越小優先級越高（1 > 10）

```typescript
// P1：高優先，立即處理
await notificationQueue.add('in-app-p1', payload, {
  priority: 1,
});

// P2：低優先，可以等
await notificationQueue.add('in-app-p2', payload, {
  priority: 10,
});
```

**自動重試**：失敗了自動再試，指數退避避免轟炸外部服務

```typescript
await notificationQueue.add('send-email', payload, {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000, // 2s → 4s → 8s
  },
});
```

**延遲任務**：N 毫秒後才讓 worker 取走

```typescript
// 5 分鐘後才執行
await notificationQueue.add('digest-email', payload, {
  delay: 5 * 60 * 1000,
});
```

**排程（Cron）**：定時執行，就像 crontab

```typescript
// 每 4 小時跑一次 Email 批次發送
await notificationQueue.add(
  'email-batch',
  {},
  {
    repeat: { pattern: '0 */4 * * *' },
  }
);
```

---

## 島島的通知系統

島島的通知系統完全建在 BullMQ 上，有三條 worker pipeline：

```
使用者互動（按讚、留言、追蹤、mention）
        │
        ▼
  Notification Service（判斷 P1 / P2）
        │
        ├── In-App Worker（立即建立通知記錄 → PostgreSQL）
        │     ├── P1：個別通知（mention、夥伴申請）
        │     └── P2：彙整通知（按讚、追蹤）
        │
        ├── Email Worker（每 4 小時批次）
        │     └── 撈出待發通知 → 合併同類 → 發送
        │
        └── Weekly Worker（每週排程）
              └── 週報摘要 Email（實踐統計 + 互動彙整）
```

**P1 vs P2 的設計邏輯**

不是每個互動都需要立即通知。被 mention 很重要，馬上要知道；有人按讚你的貼文，等一下再告訴你也沒差。

P1（priority: 1）：mention、夥伴申請、夥伴打卡——建立個別通知記錄，Email 批次時不彙整，直接發
P2（priority: 10）：按讚、追蹤、留言——建立彙整通知（同類合併），Email 批次時合併成「3 個人按讚了你的貼文」

**Email 批次 worker 的邏輯**

```typescript
// 每 4 小時跑一次
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

## 監控

BullMQ 有官方的 dashboard：**Bull Board**，可以看到每個 queue 的 waiting / active / completed / failed job 數量，也可以手動重試失敗的 job。

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

## 取捨

**優點**
- TypeScript first，型別完整
- 功能齊全：優先級、重試、延遲、Cron、批次
- Redis 保證 job 不會丟失（有持久化的話）
- Bull Board 監控介面直覺好用
- 可水平擴展：多個 worker process 同時跑，Redis 負責協調

**缺點**
- 依賴 Redis，Redis 掛了整個佇列就停了
- 不適合跨語言場景（Python worker 不能直接消費 BullMQ 的 job），島島的 Python AI 服務用 Celery 另外開
- Job payload 存在 Redis，不適合存大量資料（存 ID，讓 worker 自己去資料庫撈）

---

## BullMQ vs 其他選項

| | BullMQ | pg-boss | Celery |
|---|---|---|---|
| 後端 | Redis | PostgreSQL | Redis / RabbitMQ |
| 語言 | Node.js | Node.js | Python |
| 優先級 | 原生支援 | 支援 | 支援 |
| TypeScript | 原生 | 支援 | 不適用 |

如果你已經有 PostgreSQL、不想加 Redis，pg-boss 是不錯的選擇。如果是 Python 後端，用 Celery。Node.js + Redis，BullMQ 沒什麼好猶豫的。

---

## 參考資料

- [BullMQ 官方文件](https://docs.bullmq.io/)
- [Bull Board 監控 Dashboard](https://github.com/felixmosh/bull-board)
- [ioredis（Node.js Redis client）](https://github.com/redis/ioredis)
- [島島阿學技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — BullMQ 通知系統 P1/P2 分級設計、Email 批次發送與週報排程的完整脈絡
