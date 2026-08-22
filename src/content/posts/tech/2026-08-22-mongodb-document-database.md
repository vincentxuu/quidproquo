---
title: "MongoDB：Document Model 的彈性，代價在資料邊界"
date: 2026-08-22
category: tech
type: deep-dive
tags: [mongodb, document-database, nosql, transactions, sharding]
lang: zh-TW
tldr: "MongoDB 適合一起讀寫的聚合資料與可演進 document schema；真正難題是 embedding、transaction boundary、index 與 shard key。"
description: "介紹 MongoDB document model、embedding、references、transactions、indexes、replica sets 與 sharding，並說明何時不該用 NoSQL。"
series:
  name: "AI 時代的技術選擇"
  order: 123
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-mongodb-document-database-en)

[MongoDB](https://www.mongodb.com/docs/manual/introduction/) 把 BSON document 存在 collection。Nested object 與 array 能讓資料形狀貼近應用物件，也能把常一起讀取的內容嵌進同一 document。這是 data modeling 選擇，不是「不用 schema」：validation、index、document size、更新頻率與 ownership boundary 仍須明確設計。

## Embed 還是 reference 才是核心問題

一起讀、生命週期相同、數量有界的資料適合 embedding，可用單一 document atomic write。被多人共享、無界成長或獨立更新的 entity 適合 reference。把所有關係都 embed 會造成 duplication 與巨大 document；把所有東西都 reference，又會把 relational joins 以多次 round trip 或 aggregation pipeline 重建。

MongoDB 支援 multi-document transactions，但官方也提醒 transaction 可能帶來效能成本，而且必須使用 replica set 或 sharded cluster。Transaction 是必要 escape hatch，不代表 domain boundary 可以不設計。Query 仍需吻合 index prefix；沒有合適 index 的「彈性查詢」會成為 collection scan。

## Sharding 的難點是 shard key

Replica set 處理可用性；sharding 才把 collection 分散到多台機器。Shard key 影響資料分布、targeted query 與 write hotspot。缺 shard key 的查詢可能 scatter/gather 到所有 shards；後來雖可 reshard，也不是免費修正。真正需要水平切分以前，managed replica set 往往更簡單。

## 選擇界線

產品以 aggregate/document 為中心、schema 持續演進、需要 nested data 與 MongoDB 生態時可選。需要大量跨 entity constraints、join-heavy reporting 或標準 SQL interoperability 時，PostgreSQL/MySQL 通常更直接。Analytics-first 本機工作選 DuckDB。AI 生成 JSON 很自然，卻也更容易產生未驗證欄位；應在 API 與 database validator 同時約束輸入，並用真實 query distribution 驗證 index。

## 參考資料

- [MongoDB data modeling](https://www.mongodb.com/docs/manual/data-modeling/)
- [Embedded data versus references](https://www.mongodb.com/docs/manual/data-modeling/concepts/embedding-vs-references/)
- [Transactions and data consistency](https://www.mongodb.com/docs/manual/data-modeling/enforce-consistency/transactions/)
- [MongoDB sharding](https://www.mongodb.com/docs/manual/sharding/)
