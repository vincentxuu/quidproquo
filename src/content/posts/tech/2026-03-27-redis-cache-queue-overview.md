---
title: "Redis 入門：快取、Session、Pub/Sub 一次搞懂"
date: 2026-03-27
type: guide
category: tech
tags: [redis, cache, session, pub-sub]
lang: zh-TW
tldr: "Redis 是 in-memory key-value store，快到不像話，島島用它同時扛快取、Session、BullMQ 任務佇列三個職責，一台 Redis 幹三件事。"
description: "Redis 不只是快取。這篇介紹 Redis 的核心用法：API 回應快取、Session 儲存、Pub/Sub 訊息發佈、以及作為 BullMQ 的底層 broker，並說明島島（DaoDAO）如何在實際架構中同時用這三種模式。"
draft: false
---

Redis 是 in-memory 的 key-value 資料庫，預設所有資料都在記憶體裡，讀寫速度是磁碟資料庫的 10-100 倍。它不是要取代 PostgreSQL，而是用來擋住那些「不需要每次都去打資料庫」的查詢。

島島（DaoDAO）用 Redis 同時做三件事：API 快取、Session 儲存、BullMQ 任務佇列的底層 broker。

---

## 為什麼用 Redis

有幾個場景特別適合 Redis：

- **高頻讀取、低頻更新的資料**：排行榜、熱門貼文、首頁推薦清單——這些每分鐘被讀幾百次，但資料幾分鐘才更新一次，不需要每次都打資料庫
- **暫態資料**：Session token、OAuth state、驗證碼——有效期限過了就沒用，不需要持久化
- **非同步任務**：BullMQ、Celery 這些任務佇列需要一個可靠的 broker 來存放待處理的 job，Redis 的 list 和 sorted set 很適合

Redis 的缺點是記憶體貴，資料量一大成本就上去了。所以通常只存「熱資料」或「暫態資料」，冷資料還是在 PostgreSQL。

---

## 核心資料結構

Redis 不只有 key-value，它有五種主要型別：

| 型別 | 用途 |
|------|------|
| **String** | 最基本，存快取值、計數器 |
| **Hash** | 像 JSON object，存 Session 資料 |
| **List** | 有序清單，BullMQ 用來存 job 佇列 |
| **Set** | 無序唯一集合，存追蹤關係 |
| **Sorted Set** | 有排名的集合，適合排行榜 |

---

## 基本用法

安裝 Node.js client（島島用的是 `ioredis`）：

```bash
npm install ioredis
```

連接：

```typescript
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  password: process.env.REDIS_PASSWORD,
});
```

**String：快取 API 回應**

```typescript
// 設定快取，TTL 5 分鐘
await redis.set('posts:trending', JSON.stringify(posts), 'EX', 300);

// 讀快取
const cached = await redis.get('posts:trending');
if (cached) return JSON.parse(cached);

// cache miss → 打資料庫，再存回去
const posts = await db.getTopPosts();
await redis.set('posts:trending', JSON.stringify(posts), 'EX', 300);
return posts;
```

**Hash：存 Session**

```typescript
// 登入時建立 session
await redis.hset(`session:${sessionId}`, {
  userId: user.id,
  createdAt: Date.now(),
});
await redis.expire(`session:${sessionId}`, 7 * 24 * 60 * 60); // 7 天

// 驗證時讀取
const session = await redis.hgetall(`session:${sessionId}`);
if (!session.userId) throw new UnauthorizedError();
```

**Pub/Sub：即時通知**

```typescript
// Publisher
const pub = new Redis();
await pub.publish('notifications', JSON.stringify({ type: 'mention', userId: '123' }));

// Subscriber
const sub = new Redis();
sub.subscribe('notifications');
sub.on('message', (channel, message) => {
  const data = JSON.parse(message);
  // 處理通知
});
```

---

## 島島怎麼用 Redis

島島用 Redis 同時承擔三個角色：

**1. API 快取 + Session**
Node.js 後端把高頻讀取的 API 回應快取在 Redis，Session token 也存在 Redis Hash 裡，設 TTL 讓它自動過期，不需要另外跑清理程序。

**2. OAuth State Store**
Google OAuth 登入流程中，`state` 參數用來防 CSRF——登入時產生 state 存到 Redis，OAuth callback 時驗證，確保 callback 是對應的登入請求。TTL 設短（幾分鐘），過期自動清理。

**3. BullMQ Broker**
這是最重要的用途。BullMQ 把所有 job（通知發送、排程任務）序列化存到 Redis 的 sorted set 和 list，worker 從這邊拿 job 來處理。Redis 的原子性保證同一個 job 不會被兩個 worker 同時取走。

架構示意：

```
Node.js Server
    │
    ├── cache / session  →  Redis (String / Hash)
    │
    └── enqueue job      →  Redis (BullMQ)
                                │
                        BullMQ Worker
                                │
                         發送通知 Email
```

---

## 持久化設定

Redis 預設資料在記憶體，重啟就沒了。有兩種持久化方式：

- **RDB（快照）**：每隔一段時間把整份資料 dump 到磁碟，重啟可以恢復，但可能丟失最後幾分鐘的資料
- **AOF（Append-Only File）**：每個寫入操作都記錄到 log，資料丟失風險低，但檔案比較大

對島島的使用情境，快取和 session 丟掉重建影響不大，但 BullMQ 的 job 丟掉就有問題——所以要開持久化。實際配置通常兩者都開，RDB 做備份，AOF 做即時保護。

---

## 取捨

**優點**
- 極快，讀寫微秒級
- 資料結構豐富，不只是簡單 key-value
- 生態成熟，BullMQ、ioredis、各種 ORM 都支援
- TTL 支援，暫態資料管理方便

**缺點**
- 記憶體昂貴，不適合大量資料
- 單機預設無 cluster，需要額外設定高可用
- 不適合複雜查詢（JOIN、聚合），這是 PostgreSQL 的事
- 最終一致性風險：快取和資料庫之間有短暫不一致的窗口

---

## 什麼時候不該用 Redis

- 需要複雜關聯查詢 → PostgreSQL
- 需要全文搜尋 → Elasticsearch / pg_trgm
- 需要語意搜尋 → Qdrant
- 資料量大但讀取頻率低 → 直接 PostgreSQL，加 index 就夠

Redis 是工具箱裡的加速器，不是萬用資料庫。想清楚「這筆資料夠熱嗎？過期了有什麼後果？」再決定要不要用 Redis。

---

## 參考資料

- [Redis 官方文件](https://redis.io/docs/)
- [ioredis（Node.js client）](https://github.com/redis/ioredis)
- [Redis 資料型別一覽](https://redis.io/docs/data-types/)
- [Redis 持久化設定指南](https://redis.io/docs/management/persistence/)
- [島島阿學技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — Redis 在實際專案中同時扛快取、Session、BullMQ 三個職責的完整脈絡
