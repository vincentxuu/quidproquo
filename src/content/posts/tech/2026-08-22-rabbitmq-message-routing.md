---
title: "RabbitMQ：先用 exchange 表達路由，再用 quorum queue 保住工作"
date: 2026-08-22
category: tech
type: deep-dive
tags: [rabbitmq, message-queue, amqp, distributed-systems, background-jobs, event-streaming]
lang: zh-TW
tldr: "RabbitMQ 的強項是 exchange、binding 與 queue 組成的訊息路由；需要高可用時以 quorum queue 為預設，並同時啟用 publisher confirm、manual ack 與冪等 consumer。"
description: "介紹 RabbitMQ 的 exchange 路由模型、quorum queue、ack／confirm、stream 邊界，以及和 Kafka、NATS 的選擇方式。"
series:
  name: "AI 時代的技術選擇"
  order: 26
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-rabbitmq-message-routing-en)

[RabbitMQ](https://www.rabbitmq.com/docs) 的主角不是 queue 名稱，而是 producer 先把訊息送到 exchange，再由 binding 規則路由到一個或多個 queue。direct、topic、fanout 與 headers exchange 能把工作分派、廣播、pattern routing 和 dead-letter flow 留在 broker topology，而不是散落在每個 producer 裡。

如果需求是「這個工作一定要有人處理，失敗要重試，依類型送到不同 worker」，RabbitMQ 通常比 partitioned log 更貼近問題本身。

## Exchange、binding、queue 各負責一件事

producer publish 到 exchange，exchange 根據 routing key 與 binding 決定目的 queue；consumer 從 queue 收 delivery。多個 consumer 讀同一 queue 時，工作會被分配；多個 queue 綁同一 exchange 時，每個 queue 都能收到副本。這兩種拓撲不能混為一談。

```text
producer -> orders(topic exchange)
              | orders.paid.*
              +--> fulfillment queue -> workers
              | orders.*.failed
              +--> incident queue -> on-call worker
```

這套模型比 Kafka consumer group 更擅長細緻路由，也更自然地支援短生命週期工作、priority、TTL 與 dead-letter exchange。代價是訊息通常在 ack 後刪除；若需要多組 consumer 任意回到舊位置重播，應看 RabbitMQ Streams、Kafka 或 Redpanda。

## Quorum queue 是高可用工作的預設

[Quorum queue](https://www.rabbitmq.com/docs/quorum-queues) 以 Raft 複寫持久化 queue，是 RabbitMQ 對資料安全與 leader election 的現代預設。RabbitMQ 4.0 已移除 classic queue mirroring；新系統不要照舊教學建立 mirrored classic queue。

quorum queue 適合長期存在、重要且需要複寫的工作 queue。它不適合大量 transient／exclusive queue、最低延遲、超長 backlog 或大規模 fan-out；後兩者官方建議評估 stream。三個 member 是常見起點，增加 member 會增加共識成本，並不是越多越安全。

## Confirm 與 ack 是兩個方向的責任移交

publisher confirm 表示 broker 已接手訊息；quorum queue 會在訊息被 quorum 接受後 confirm。consumer manual acknowledgement 表示應用已完成必要處理，broker 才能刪除 delivery。只設 durable queue、persistent message，卻沒有 confirm 與 manual ack，仍可能在 publish 或 consume 邊界丟資料。

```ts
channel.prefetch(20);
channel.consume("fulfillment", async (msg) => {
  if (!msg) return;
  try {
    await processOrder(JSON.parse(msg.content.toString()));
    channel.ack(msg);
  } catch {
    channel.nack(msg, false, false);
  }
});
```

manual ack 帶來 at-least-once：worker 做完 side effect、還沒 ack 就 crash，訊息會重送。因此 `processOrder` 仍需 idempotency key；`nack` 是否 requeue 也要明確，否則 poison message 可能無限迴圈。quorum queue 有 delivery limit 與 poison-message handling，但 dead-letter policy 仍要由團隊設計。

## RabbitMQ Streams 不是普通 queue 的加速模式

RabbitMQ Streams 是可持久化、可複寫、non-destructive consumption 的 append-only log，同一筆訊息可被重讀。Super streams 再以 partition 擴充吞吐。它讓既有 RabbitMQ cluster 能承接部分 event-streaming use case，但 message priority、per-message TTL 等 queue 語意不會完整保留。

需要 AMQP routing 和可靠背景工作時用 quorum queue。需要同一 broker 裡的重播與高吞吐時評估 streams。若整個平台都以長期事件日誌、CDC 與 stream processing 為中心，Kafka 生態通常更完整。

## AI 工作負載的實際用法

RabbitMQ 適合排 LLM batch、文件解析、embedding、工具執行與 webhook retry。訊息放 task ID、tenant、輸入位置與 idempotency key，不要塞完整文件。設定 prefetch 來限制 worker 同時持有的未 ack 工作，並讓 retry 有上限、退避與 dead-letter queue。

agent task 可能跑很久。不要靠延長 ack timeout 假裝它已成為 durable execution；worker crash 後，RabbitMQ 只知道重新交付整筆訊息，不知道流程做完哪些 step。需要逐步恢復、等待人類數小時或跨多個外部呼叫時，Temporal、Restate 或 Trigger.dev 才是對應層。

## 參考資料

- [RabbitMQ queues](https://www.rabbitmq.com/docs/queues)
- [RabbitMQ quorum queues](https://www.rabbitmq.com/docs/quorum-queues)
- [RabbitMQ acknowledgements and publisher confirms](https://www.rabbitmq.com/docs/confirms)
- [RabbitMQ streams](https://www.rabbitmq.com/docs/streams)
