---
title: "Apache Pulsar：把 stateless broker 與 BookKeeper 儲存拆開的事件平台"
date: 2026-08-22
category: tech
type: deep-dive
tags: [apache-pulsar, event-streaming, message-queue, bookkeeper, distributed-systems, multi-tenancy]
lang: zh-TW
tldr: "Pulsar 將 serving 與 storage 分離：stateless broker 處理連線，BookKeeper 保存 ledger 與 subscription cursor；彈性與多租戶能力換來更多營運元件。"
description: "介紹 Apache Pulsar 的 broker／BookKeeper 架構、subscription 模型、geo-replication 與 tiered storage，並比較 Kafka。"
series:
  name: "AI 時代的技術選擇"
  order: 29
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-apache-pulsar-messaging-en)

[Apache Pulsar](https://pulsar.apache.org/docs/4.0.x/concepts-architecture-overview/) 同時提供 queue-like consumption 與 replayable stream，但它和 Kafka 最大的差異不在 API，而是儲存架構。Pulsar broker 主要處理 producer／consumer 連線與 dispatch，持久訊息和 subscription cursor 交給 Apache BookKeeper。broker 可以相對無狀態地擴縮，storage 則以 bookie 獨立擴充。

## Broker 與 storage 分離代表什麼

每個 topic 對應 managed ledger，底下由多個 BookKeeper ledger 組成。ledger 是 single-writer append-only log，entries 會複寫到多個 bookie；sealed ledger 可在不影響新寫入的情況下回收或 offload。broker ownership 轉移時，不必搬動整個 partition 的資料。

這對 topic 數量很多、tenant 間負載變化大、需要分別擴 CPU 與磁碟的服務有吸引力。代價是自架 cluster 不只 broker：還有 BookKeeper、metadata store、磁碟 journal、ledger recovery 與 placement。它不是「比 Kafka 少維護」，而是把責任拆成更明確的子系統。

## Subscription 決定消費語意

Pulsar subscription 有 Exclusive、Failover、Shared 與 Key_Shared 等模式。Exclusive 由單一 consumer 讀，Failover 保留 standby。Shared 將訊息分給多個 consumer，但不保證整體順序。Key_Shared 讓相同 key 固定到同一 consumer，以兼顧 key-local ordering 與水平擴充。

subscription cursor 會持久保存。ack 後 cursor 前進，未確認訊息可重送；reader 則能不建立一般 subscription，直接從位置讀取。這讓 Pulsar 同時接近 work queue 與 event log，但團隊仍需為每個 topic 寫清楚 subscription type、ack timeout、retry、dead letter 與 ordering key。

## Multi-tenancy 和 geo-replication 是一級概念

topic 名稱包含 tenant 與 namespace，例如 `persistent://tenant/ns/topic`。quota、retention、TTL、isolation 與 replication policy 可在 namespace 管理。跨區 replication 由 broker 將本地 topic 事件轉送到遠端 cluster，適合需要區域自治與全球資料分發的平台。

這些能力只有在組織真的有多團隊、多地區與隔離需求時才值回複雜度。單一產品、幾十個 queue 的背景工作，用 SQS、RabbitMQ 或 NATS JetStream 通常更直接。

## Tiered Storage 與長 backlog

[Pulsar Tiered Storage](https://pulsar.apache.org/docs/4.0.x/tiered-storage-overview/) 能把 sealed ledger offload 到 S3、GCS、Azure 等長期儲存，consumer 仍透過 Pulsar API 讀舊 backlog。BookKeeper 保持熱資料與近期 backlog，object storage 承接長期保留。

這很適合保留訓練事件或重新計算推薦資料，但 cold replay 的延遲、bucket lifecycle、未完成 multipart upload 與資料刪除仍需管理。長期儲存便宜，不代表可以無限保留 PII。

## Pulsar 還是 Kafka

Kafka 的單一 partition log 模型、Connect／Streams 生態與人才池更成熟。Pulsar 的 serving-storage separation、subscription 類型、多租戶與 geo-replication 更原生。不要只比吞吐。用自己的 topic 數、backlog、consumer pattern、跨區拓撲與故障演練做 proof of concept。

AI 平台若需要許多 tenant、每個 tenant 大量 topic、線上工作分派加離線 replay，Pulsar 值得評估。若只是把 agent 任務丟給 worker，BookKeeper 與 metadata layer 多半是超額架構。

## 參考資料

- [Apache Pulsar architecture overview](https://pulsar.apache.org/docs/4.0.x/concepts-architecture-overview/)
- [Apache Pulsar messaging concepts](https://pulsar.apache.org/docs/4.0.x/concepts-messaging/)
- [Apache Pulsar multi-tenancy](https://pulsar.apache.org/docs/4.0.x/concepts-multi-tenancy/)
- [Apache Pulsar tiered storage](https://pulsar.apache.org/docs/4.0.x/tiered-storage-overview/)
