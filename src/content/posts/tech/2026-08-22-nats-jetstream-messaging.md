---
title: "NATS 與 JetStream：先選即時訊息還是持久事件，再談同一套 API"
date: 2026-08-22
category: tech
type: deep-dive
tags: [nats, jetstream, messaging, event-streaming, distributed-systems, microservices]
lang: zh-TW
tldr: "Core NATS 是不落盤的 at-most-once pub/sub；JetStream 才加入 stream、consumer、ack、retention 與重播。兩者同用 subject，可靠性契約卻完全不同。"
description: "介紹 Core NATS 的 subject、queue group、request-reply，以及 JetStream 的持久化與 consumer 模型，並比較 Kafka 和 RabbitMQ。"
series:
  name: "AI 時代的技術選擇"
  order: 27
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-nats-jetstream-messaging-en)

[NATS](https://docs.nats.io/learn/core-nats/) 把通訊建立在 subject 與 interest graph 上。publisher 送到 `orders.created`，所有當下訂閱這個 subject 的 client 都能收到；wildcard、request-reply 與 queue group 都沿用同一套 addressing。server 不解讀 payload，Core NATS 也不保存訊息。

所以第一個問題不是「NATS 還是 Kafka」，而是「訊息錯過了能不能算了」。能，就用 Core NATS 的低摩擦即時通訊；不能，就明確使用 JetStream 或另一個持久 broker。

## Core NATS 的速度來自少做保證

Core NATS 是 at-most-once。subscriber 若離線、重啟或尚未訂閱，publish 當下的訊息不會留著等它。這不是缺陷，而是產品契約。cache invalidation、live telemetry、service discovery signal 或可被下一筆覆蓋的狀態更新，不需要為歷史付出 storage 與 acknowledgment 成本。

subject 是以句點分隔的名稱，例如 `orders.created.eu`。subscriber 可用 `*` 匹配一個 token、`>` 匹配後續層級。queue group 讓同一 subject 的每筆訊息只送給 group 中一個 member，形成簡單 load balancing；不同 group 或一般 subscriber 仍各自收到副本。

```ts
const sub = nc.subscribe("orders.created", { queue: "fulfillment" });
for await (const msg of sub) {
  await pack(JSON.parse(sc.decode(msg.data)));
}
```

這段沒有 ack。handler crash 時，Core NATS 不會重送；需要工作一定完成，就不能停在 Core NATS。

## JetStream 把 subject 捕捉進 stream

[JetStream](https://docs.nats.io/concepts/jetstream) 是 NATS 的持久化層。stream 依 subject pattern 捕捉訊息，設定 storage、replicas、最大年齡或大小。consumer 保存 delivery 與 ack 狀態，能從指定 sequence、時間或最新位置讀取。

pull consumer 通常適合水平擴充 worker：worker 主動批次取得訊息，控制 backpressure，再用 ack 表示完成。ack timeout 後未確認的訊息可重送，因此 handler 必須冪等。durable consumer 保存進度；ephemeral consumer 則隨 subscription 消失。

JetStream 的 retention policy 也不只看時間。limits policy 依 stream 上限保留；interest policy 在所有有興趣 consumer 確認後移除；work queue policy 讓一則訊息被一個 consumer group 處理。選錯 policy，可能得到意外重播或意外刪除。

## 「Exactly once」仍要看 side effect

JetStream 以 publish ID 去重，並用 double acknowledgment 強化消費確認，可組合出服務內宣稱的 exactly-once semantics。這仍不能讓外部扣款或寄信自動原子化。message ack 與外部 side effect 之間存在 crash window，consumer 仍應使用 idempotency key。

更實際的契約是：Core NATS 接受遺失；JetStream 預設接受重複但不接受靜默遺失；真正跨系統 exactly-once 由業務資料庫與外部 API 共同完成。

## 跟 RabbitMQ、Kafka 怎麼選

NATS 的優勢是同一套輕量 subject 模型同時支援 pub/sub、request-reply、queue group 與持久 stream。微服務控制面、edge topology、低延遲 request-reply 和中型事件流可以少維護幾套基礎設施。

RabbitMQ 的 exchange、binding、TTL、priority 與 dead-letter topology 更適合複雜工作路由。Kafka 的 partition log、Connect、Streams 與資料平台生態更適合大量歷史重播、CDC 和分析。JetStream 能做持久事件，不代表應只用 latency benchmark 取代 Kafka；先比較 retention、consumer 數、重放模式、connector 與跨區需求。

## Agent 系統的兩層用法

Core NATS 可傳遞 worker presence、即時 token telemetry、取消通知與「有新任務」signal；JetStream 保存 tool-call event、任務狀態變更與待處理工作。不要讓同一個 subject 在某些環境只有 Core NATS、另一些環境被 stream 捕捉，卻不把可靠性差異寫進 contract。

實作前替每類事件標一個等級：ephemeral、at-least-once、replayable。再決定 subject、stream retention、durable name、ack wait 與 max deliver。這張表比「NATS 很快」更能避免 production 事故。

## 參考資料

- [Core NATS deep dive](https://docs.nats.io/learn/core-nats/)
- [NATS queue groups](https://docs.nats.io/learn/core-nats/queue-groups)
- [JetStream concepts](https://docs.nats.io/concepts/jetstream)
- [JetStream pull consumers](https://docs.nats.io/learn/jetstream/pull-consumers)
