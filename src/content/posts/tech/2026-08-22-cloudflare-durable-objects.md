---
title: "Cloudflare Durable Objects：以 Global Unique Actor 協調即時狀態"
date: 2026-08-22
category: tech
type: deep-dive
tags: [cloudflare, durable-objects, edge, websocket, distributed-systems]
lang: zh-TW
tldr: "Durable Objects 以 name/ID 路由到 globally unique、single-threaded actor，附帶強一致 storage、WebSockets 與 alarms；正確性來自選對 object key 與清楚處理 lifecycle。"
description: "介紹 Cloudflare Durable Objects identity、single-threaded coordination、storage、RPC、WebSocket hibernation、alarms、sharding、location 與 migration。"
series:
  name: "AI 時代的技術選擇"
  order: 110
additionalSeries:
  - name: "Cloudflare Edge Platform"
    order: 7
  - name: "Cloudflare AI Stack"
    order: 14
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-cloudflare-durable-objects-en)

[Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)（DO）把某個 name/ID 對應到 globally unique actor instance。對同一 object 的 requests 在單一執行 context 協調，並可讀寫該 object 私有的 strongly consistent transactional storage。它適合 chat room、match、rate limiter、per-user state 與 collaborative document，不是把整個 application 塞進一個全球 singleton。

## Object ID 就是 concurrency boundary

`idFromName("room:123")` 讓所有 room 123 traffic 找到同一 coordinator；不同 rooms 落到不同 objects 並水平擴展。Key 太粗會形成 hot object 與單點 throughput limit，太細又失去需要的 atomic coordination。先寫出 invariant：「哪些操作必須 serializable 地一起決定？」再決定 object key。

DO 是 single-threaded，但 async interleaving 與 external side effects 仍可能造成 race/duplicate。Storage transaction 保護 object-local data，不涵蓋 D1、R2、第三方 API 或另一個 DO。跨系統操作使用 idempotency key、outbox/compensation，不能把 actor 等同 distributed transaction。

## 記憶體會消失，identity 與 storage 不會

Object 可在 idle 後 eviction/rehydration，constructor 會再次執行；重要 state 必須寫 storage，in-memory cache 要能重建。Alarms 讓 object 在未來醒來做一次工作，但 handler 需 idempotent 並處理 retry。SQLite-backed storage 同時提供 SQL/KV API；容量、row/query 與 request limits 應依當期官方 limits 驗證。

Hibernation WebSocket API 可讓 JavaScript instance 休眠而 clients 保持連線，message 到達再喚醒；休眠會清掉記憶體，per-connection metadata 用 attachments 或 durable storage 還原。Standard WebSocket API、timer、in-flight request 或 outbound socket 可能阻止 hibernation並增加 duration cost。Slow client、queue cap、broadcast batching、deploy drain 與 authorization renewal仍由 application 負責。

DO 適合需要 per-key linear coordination 且已在 Workers 生態的系統。PartyKit 提供更高階 room framework；Liveblocks 提供完整 collaboration features；Ably 管理 messaging；Redis/database lock 是不同 consistency/cost model。Production 前測 hot-key throughput、placement latency、cold start、storage growth、migration/rollback、alarm duplicate、WebSocket hibernation、object deletion 與 provider outage。

## 參考資料

- [Durable Objects documentation](https://developers.cloudflare.com/durable-objects/)
- [What are Durable Objects?](https://developers.cloudflare.com/durable-objects/concepts/what-are-durable-objects/)
- [Rules of Durable Objects](https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/)
- [Storage API](https://developers.cloudflare.com/durable-objects/api/storage-api/)
- [WebSockets and hibernation](https://developers.cloudflare.com/durable-objects/best-practices/websockets/)
- [Durable Object lifecycle](https://developers.cloudflare.com/durable-objects/concepts/durable-object-lifecycle/)
- [Alarms](https://developers.cloudflare.com/durable-objects/api/alarms/)
