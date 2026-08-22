---
title: "AWS SQS 與 SNS：一個保存工作，一個把事件 fan-out"
date: 2026-08-22
category: tech
type: deep-dive
tags: [aws-sqs, aws-sns, message-queue, pub-sub, serverless, background-jobs]
lang: zh-TW
tldr: "SQS 是 pull-based durable queue，SNS 是 push-based topic；常見可靠 fan-out 是 SNS topic 接多個 SQS queue，而不是讓多個 worker 共讀一條 queue。"
description: "拆解 AWS SQS Standard／FIFO、visibility timeout、DLQ，以及 SNS fan-out、filtering 與兩者組合方式。"
series:
  name: "AI 時代的技術選擇"
  order: 31
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-aws-sqs-sns-en)

[Amazon SQS](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html) 和 [Amazon SNS](https://docs.aws.amazon.com/sns/latest/dg/welcome.html) 常一起出現，但責任不同。SQS 保存訊息，consumer pull 後處理並刪除；SNS 接收 publication，立即 push 給 HTTP、Lambda、email、SQS 等 subscriptions。需要多個服務各自可靠處理同一事件時，典型拓撲是 SNS fan-out 到多個 SQS queue。

## SQS Standard 預設接受重複與近似順序

Standard queue 提供 at-least-once delivery 與 best-effort ordering。收到訊息後，它不是立刻刪除，而是在 visibility timeout 期間對其他 consumer 隱藏；處理成功後呼叫 DeleteMessage。timeout 前沒刪除，訊息重新可見。

```text
ReceiveMessage -> invisible -> process -> DeleteMessage
                             \-> timeout -> visible again
```

因此 consumer 必須冪等。visibility timeout 要涵蓋正常處理時間，但不能長到 crash 後等太久；長工作可用 ChangeMessageVisibility heartbeat 延長。AWS 文件也建議超長或多步工作改用 Step Functions 或拆小，不要把 timeout 當 workflow checkpoint。

## FIFO 只在 message group 內保序

FIFO queue 透過 MessageGroupId 保證 group 內順序，MessageDeduplicationId 或 content-based deduplication 抑制 producer 重複。不同 group 可平行；所有訊息塞同一 group，吞吐就被單一路徑限制。

FIFO 不會讓 consumer side effect 自動 exactly-once。處理完但刪除前 crash，仍可能重送；deduplication 主要處理 publish 邊界。付款、寄信與資料庫寫入照樣需要 idempotency key。

## DLQ 是隔離，不是處理完成

redrive policy 以 receive count 將反覆失敗的訊息送到 dead-letter queue。DLQ 要有 alarm、查詢工具、修正後 redrive 流程與 retention；只建立 queue 而沒人處理，等於把資料遺失延後。

long polling 可降低空 receive 與成本；batch receive／delete 可提高效率。加密、queue policy、VPC endpoint 與 KMS 權限則要一起設計，尤其 message body 或 attributes 含 tenant 與資料位置時。

## SNS 負責 fan-out，不保留每個 consumer 的工作狀態

SNS topic 能推送給多種 endpoint，subscription filter policy 可依 message attributes 或 body 篩選。直接推 HTTP endpoint 時，接收端暫時失敗要依 SNS retry policy。若接 SQS，每個 subscriber 有自己的 backlog、DLQ、visibility timeout 與 scaling，故障隔離更清楚。

```text
order event -> SNS topic
                +-> fulfillment SQS
                +-> analytics SQS
                +-> notification SQS
```

這和「三組 worker 共讀一條 SQS」不同：共讀只會讓一組 worker 拿到訊息，fan-out 才會讓三個服務各拿一份。

## 選擇邊界

AWS-native、負載突發、希望免管 broker 時，SQS／SNS 是很穩的預設。需要複雜 AMQP routing、低延遲 broker topology 時看 RabbitMQ；需要長期 replay、partition log 與 stream processing 時看 Kafka、Redpanda 或 Pulsar。

Agent 系統可用 SQS 排文件解析、embedding、tool execution 與 batch inference，用 SNS 廣播任務狀態。message 只帶 task ID、tenant、attempt 與 S3 URI。任何會產生外部 side effect 的 consumer，都用 message ID 或業務 ID 做冪等，不依賴服務名稱裡的 FIFO 或 deduplication 猜測保證。

## 參考資料

- [Amazon SQS queue types](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-queue-types.html)
- [Amazon SQS visibility timeout](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html)
- [Amazon SQS dead-letter queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html)
- [Amazon SNS fanout](https://docs.aws.amazon.com/sns/latest/dg/sns-common-scenarios.html)
