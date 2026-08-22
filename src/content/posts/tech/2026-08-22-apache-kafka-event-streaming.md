---
title: "Apache Kafka：不是把訊息排隊，而是保存可重播的事件日誌"
date: 2026-08-22
category: tech
type: deep-dive
tags: [kafka, event-streaming, distributed-systems, message-queue, data-pipeline, ai-agent]
lang: zh-TW
tldr: "Kafka 的核心是依 partition 排序、依 retention 保存的分散式 log；consumer group 用 offset 分工，exactly-once 只在 Kafka transaction 能涵蓋的邊界內成立。"
description: "從 partition、consumer group、offset、replication 與 transaction 解讀 Apache Kafka，並比較傳統訊息佇列與 Redpanda 的適用邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 25
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-apache-kafka-event-streaming-en)

[Apache Kafka](https://kafka.apache.org/42/design/design/) 常被放進「訊息佇列」清單，但它的核心資料結構不是一封信被拿走就消失的 queue，而是可保留、可重播的分散式 commit log。producer 把 record append 到 topic partition，consumer 保存自己讀到哪個 offset；資料是否刪除由 retention policy 決定，不由某個 consumer 是否讀過決定。

這個差別決定了 Kafka 適合事件串流、CDC、稽核軌跡與多下游資料管線，也決定了它通常比背景工作佇列更難營運。

## Partition 同時決定順序與平行度

topic 會切成多個 partition。Kafka 只保證單一 partition 內的順序，不保證整個 topic 的全域順序。producer 若用訂單 ID 當 key，同一張訂單通常會落到同一 partition，事件順序得以保留。沒有 key 或 key 分布不均，則可能得到無法預期的分配或 hot partition。

consumer group 是一個邏輯訂閱者。傳統 consumer group 裡，同一 partition 同一時間只交給 group 內一個 consumer；因此增加 consumer 超過 partition 數量，不會繼續增加平行度。不同 group 各自持有 offset，可以讓風控、通知與分析各讀一次相同事件，而不用複製三份資料。

```text
orders topic
  partition 0 ──> risk group / consumer A
  partition 1 ──> risk group / consumer B

  partition 0 ──> analytics group / consumer C
  partition 1 ──> analytics group / consumer C
```

offset 是下一筆要讀的位置，不是 broker 對每則訊息維護的 ack 狀態。consumer 能把 offset 往回移，修好程式後重跑歷史事件；這是 Kafka 和傳統 queue 最關鍵的分界。

## 可靠性不是只設 `acks=all`

每個 partition 有 leader 與 replicas。producer 送到 leader，追隨者複製 log；只有滿足 in-sync replica 條件的 record 才算 committed。常見可靠設定會一起考慮 replication factor、`min.insync.replicas` 與 producer `acks=all`，而不是只調其中一個。

consumer 的交付語意則由「處理輸出」和「提交 offset」的順序決定。先提交再處理，crash 可能漏資料，是 at-most-once；先處理再提交，crash 可能重做，是 at-least-once。實務預設應假設重複交付，讓 handler 以 event ID、業務 key 或資料庫 constraint 保持冪等。

## Exactly-once 有明確邊界

Kafka transaction 可以把輸出 topic 的 record 與輸入 consumer offset 放進同一筆 transaction。搭配 `read_committed` consumer，Kafka Streams 或 consume-transform-produce 管線能得到 exactly-once processing。這不等於「呼叫任何外部 API 都恰好一次」。

若 consumer 同時扣款、寄信或寫入另一套資料庫，Kafka 無法單方面把外部 side effect 和 offset 原子化。這時仍需要 outbox、外部系統的 idempotency key，或把 offset 與結果存在同一個資料庫 transaction。文章或架構圖只寫「Kafka exactly-once」而不畫 transaction boundary，幾乎一定說得太滿。

## KRaft 解掉 ZooKeeper，不解掉營運成本

現代 Kafka 已用 KRaft controller quorum 管理 cluster metadata，不再需要 ZooKeeper。這少了一套分散式系統，但 partition 數、replica placement、磁碟容量、consumer lag、rebalance、schema evolution 與跨區複寫仍要被管理。

Kafka 適合多個獨立 consumer 需要重播、保留時間長、吞吐高，而且團隊願意維護資料平台的情境。只有幾個背景工作、每筆處理完即可刪除時，RabbitMQ、SQS、BullMQ 或 Cloudflare Queues 通常更直接。需要 Kafka client 生態但不想維護 JVM broker，可評估 Redpanda 或託管 Kafka；那是營運模型選擇，不是事件模型改變。

## AI 系統該怎麼用

Kafka 很適合保存 agent run event、tool call、模型回應 metadata 與 evaluation 結果，讓線上監控、離線訓練與稽核各自消費。payload 不應直接塞大型 prompt、文件或模型輸出。把 blob 放 object storage，event 只帶 URI、hash、schema version 與權限資訊，較容易控制 retention 和重放成本。

導入前先寫出三件事：需要重播多久、哪個 key 必須保序、重複處理會造成什麼副作用。答不出來時，Kafka 的 partition 與 transaction 只會把模糊需求變成昂貴設定。

## 參考資料

- [Apache Kafka design](https://kafka.apache.org/42/design/design/)
- [Apache Kafka consumer groups](https://kafka.apache.org/42/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html)
- [Apache Kafka KRaft operations](https://kafka.apache.org/42/operations/kraft/)
