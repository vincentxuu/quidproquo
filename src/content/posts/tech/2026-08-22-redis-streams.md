---
title: "Redis Streams：用 append-only log 與 consumer group 補上 Redis 的可靠訊息層"
date: 2026-08-22
category: tech
type: deep-dive
tags: [redis-streams, redis, event-streaming, message-queue, consumer-group, background-jobs]
lang: zh-TW
tldr: "Redis Streams 以 `XADD` 保存可回讀 entry，consumer group 再用 Pending Entries List 與 `XACK` 追蹤處理；它比 Pub/Sub 可靠，但不是自動變成 Kafka。"
description: "介紹 Redis Streams 的 ID、range query、consumer group、PEL、claim 與 trimming，並比較 Redis Pub/Sub、Kafka 和專用 queue。"
series:
  name: "AI 時代的技術選擇"
  order: 30
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-redis-streams-en)

[Redis Streams](https://redis.io/docs/latest/develop/data-types/streams/) 是 Redis 裡的 append-only log。`XADD` 加入帶 ID 的 entry，`XRANGE` 按區間讀歷史，`XREAD` 等待新資料；consumer group 則讓多個 worker 分工並保存未確認狀態。它解決 Redis Pub/Sub subscriber 離線就漏訊息的問題，但仍受 Redis persistence、memory 與 cluster 模型約束。

## Entry ID 是位置，不只是訊息識別碼

Stream entry 預設 ID 由毫秒時間與序號組成，例如 `1710000000000-0`。client 可從某個 ID 繼續讀，也能查時間範圍。stream 不會因某個 reader 讀過就自動刪除；用 `MAXLEN`、`MINID` 或 `XTRIM` 控制成長。

```text
XADD orders MAXLEN ~ 100000 * order_id 42 state paid
XREAD BLOCK 5000 STREAMS orders $
```

近似 trimming 的 `~` 通常比精確裁切便宜。retention 設太小會讓慢 consumer 追不到歷史，設太大則把 Redis 變成昂貴 archive。大型 payload 應放 object storage，stream 只放 pointer 與 metadata。

## Consumer group 的關鍵是 PEL

`XGROUP` 建立 group，worker 用 `XREADGROUP` 取得新 entry。交付後，entry 進入該 group 的 Pending Entries List（PEL），直到 worker 執行 `XACK`。worker crash 時，其他 worker 可用 `XAUTOCLAIM` 接手 idle 太久的 pending entry。

```text
XGROUP CREATE orders fulfillment 0 MKSTREAM
XREADGROUP GROUP fulfillment worker-1 COUNT 10 STREAMS orders >
XACK orders fulfillment 1710000000000-0
```

這是 at-least-once。處理完成但 `XACK` 前 crash 會重做，因此資料庫寫入、寄信與付款仍需 idempotency key。也要監控 PEL size、oldest pending age、delivery count 與 stream length；只看 Redis CPU 會漏掉卡死 consumer。

## 多個 group 不會共享 ack

同一 stream 可以有 analytics、notification、fulfillment 等多個 group。每個 group 各自收到 entry、各自維護 PEL。某個 group `XACK` 不會替其他 group 確認，也不會從 stream 刪除 entry。

Redis 8.2 加入 `XACKDEL`、`XDELEX` 與 trimming reference policy，能更精細地處理多 group 已確認後的刪除；舊版需要應用自己協調。使用新命令前要確認 server、managed Redis 與 client library 版本都支援。

## 和 Pub/Sub、Kafka、BullMQ 的界線

Redis Pub/Sub 適合可遺失即時通知。Streams 適合需要 replay、consumer group 與 pending tracking 的中小型事件流。BullMQ 提供 delay、retry、job state 與 scheduler 等工作佇列 abstraction。Kafka／Pulsar 則為跨 broker partition、長 retention 與資料平台生態設計。

如果 Redis 已是關鍵基礎設施、流量可控、團隊願意操作 persistence 與 failover，Streams 能少一套服務。若 backlog 大到記憶體成本失控、需要多區複寫或大量 connector，不要因為「Redis 已經有」而硬撐。

## Agent 工作的使用方式

Streams 可記錄 agent state transition、工具執行結果 pointer 與 worker queue。每個 entry 帶 task ID、attempt、schema version 和 trace ID。consumer 完成外部 side effect 後才 ack，失敗則保留 pending 並由 claim／dead-letter policy 接管。

Stream 不知道一個多步流程的 checkpoint。需要跨天等待、逐步恢復或 compensation 時，仍應用 durable execution engine；Redis Streams 是 transport 與 event log，不是 workflow state machine。

## 參考資料

- [Redis Streams documentation](https://redis.io/docs/latest/develop/data-types/streams/)
- [Redis XREADGROUP](https://redis.io/docs/latest/commands/xreadgroup/)
- [Redis XAUTOCLAIM](https://redis.io/docs/latest/commands/xautoclaim/)
