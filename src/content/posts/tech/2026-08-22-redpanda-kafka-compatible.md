---
title: "Redpanda：Kafka API 相容，不代表換 broker 可以不做驗證"
date: 2026-08-22
category: tech
type: deep-dive
tags: [redpanda, kafka, event-streaming, distributed-systems, tiered-storage, self-hosted]
lang: zh-TW
tldr: "Redpanda 以 C++／Seastar、thread-per-core 與每個 partition 的 Raft group 重做 Kafka-compatible event log；client 相容度高，營運與邊角語意仍須實測。"
description: "介紹 Redpanda 的 Kafka API、Raft、thread-per-core、tiered storage 與遷移邊界，並說明何時適合取代或保留 Kafka。"
series:
  name: "AI 時代的技術選擇"
  order: 28
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-redpanda-kafka-compatible-en)

[Redpanda](https://docs.redpanda.com/streaming/current/get-started/architecture/) 是使用 Kafka API 的分散式 event log，但不是 Apache Kafka 的包裝版。它以 C++ 與 Seastar 實作 broker，採 thread-per-core、共享記憶體架構。Kafka producer、consumer 與多數工具可以沿用，同時移除 JVM 與另一套 metadata service。

選 Redpanda 的理由應是 Kafka event model 正確、但你想換一種 broker 實作與營運方式；不是因為需求其實只是一個簡單工作 queue。

## Topic 與 partition 模型仍是 Kafka

producer 透過 Kafka protocol 把 record 寫入 topic partition，consumer 依 offset 讀取；同 key 會路由到同一 partition，順序保證仍只在 partition 內。consumer group、retention、compaction、transaction 與 schema registry 等概念也延續 Kafka 生態。

所以 Redpanda 不會消除 partition key 選錯、hot partition、consumer lag、schema breaking change 或 exactly-once 邊界。application architecture 若在 Kafka 上不正確，換 broker 不會自動修好。

## 每個 partition 都是 Raft group

Redpanda 讓每個 topic partition 成為獨立 Raft group，包含 leader 與 followers。當 producer 使用 `acks=all`，leader 在多數 replicas 寫入後才確認 committed record。cluster metadata 則放在 controller partition，也由 Raft 複寫。

這個設計沒有 Kafka 歷史上的 ZooKeeper 分離，也不需要把 data-plane replication 和 metadata consensus 拼成兩個系統。不過現代 Kafka 已採 KRaft，所以「不用 ZooKeeper」不再是 Redpanda 對 Kafka 的獨占優勢；真正差異在 runtime、resource model、操作工具與商業功能。

## Thread-per-core 是效能模型，也是部署假設

Seastar 將 application thread 固定在 CPU core，透過 message passing 溝通，避免大量 context switch 與 lock。Redpanda 會預先配置並分區記憶體，也偏好 XFS、SSD 與可預期的 CPU 資源。這讓單機能有效 scale up，但也表示容器不能隨意 overcommit CPU／memory，再期待官方 benchmark 重現。

評估時應在自己的 message size、partition count、retention、replication、TLS 與 producer settings 下量 p99 latency、throughput、磁碟與復原時間。只比較空白 cluster 的峰值吞吐，沒有涵蓋 production failure mode。

## Tiered Storage 改變保留成本，不消除延遲差異

Redpanda Tiered Storage 可把 log segment 近即時 offload 到 object storage。consumer 使用同一套 Kafka API：近期 offset 從 local disk 讀，歷史 offset 由 object storage hydrate。這適合延長 retention、縮小本機磁碟與災難復原。

歷史讀取仍會受 object storage latency、cache 與網路影響。若 replay job 會掃大量冷資料，要獨立量測，並設定 bucket lifecycle、encryption、IAM 與刪除政策。把資料移到 S3-compatible storage 不是把資料治理責任移掉。

## Kafka-compatible 要逐層拆開

相容性至少分成 protocol、client、admin API、Connect、Streams、security、observability 與 operational behavior。一般 producer／consumer 往往可以直接換 bootstrap server。依賴特定 Kafka broker config、JMX metric、custom authorizer、第三方 connector 或邊緣 KIP 的系統，不能從「Kafka API compatible」推論零修改。

安全遷移採 shadow traffic 或 dual publish。先建立 topic config 與 ACL 對照，跑代表性 producer／consumer、rebalance、transaction、failure、lag 與 replay 測試，再逐個 workload 切換。回復計畫要包含 offset 對齊，不只是 DNS 改回去。

## 何時選 Redpanda

想保留 Kafka client 與 event model、追求較單一的 self-hosted broker、重視 tiered storage，或選用 Redpanda Cloud／BYOC 時，它值得進 shortlist。組織已有成熟 Kafka platform、依賴完整周邊工具，且瓶頸不在 broker，遷移收益可能不夠付相容驗證成本。

AI pipeline 的做法和 Kafka 相同：event 放 pointer 與 metadata，大型 prompt、文件和模型輸出放 object storage。Redpanda 能讓這條 event backbone 換一個 runtime，但資料契約、冪等、PII retention 與 replay governance 仍是應用責任。

## 參考資料

- [How Redpanda works](https://docs.redpanda.com/streaming/current/get-started/architecture/)
- [Redpanda Kafka compatibility](https://docs.redpanda.com/current/develop/kafka-clients/)
- [Redpanda Tiered Storage](https://docs.redpanda.com/current/manage/tiered-storage/)
