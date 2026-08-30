---
title: "Cloudflare Queues：把 Workers request 拆成可重試、可批次的背景工作"
date: 2026-08-22
category: tech
type: deep-dive
tags: [cloudflare-queues, cloudflare-workers, message-queue, serverless, background-jobs, edge-computing]
lang: zh-TW
tldr: "Cloudflare Queues 提供 at-least-once delivery、batch consumer、retry、delay 與 DLQ；它最適合 Workers 周邊背景工作，consumer 仍須逐筆 ack 與冪等。"
description: "介紹 Cloudflare Queues 的 producer／consumer、批次、重試、DLQ、pull consumer 與平台限制，並比較 SQS 和 durable execution。"
series:
  name: "AI 時代的技術選擇"
  order: 32
additionalSeries:
  - name: "Cloudflare Edge Platform"
    order: 8
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-cloudflare-queues-en)

[Cloudflare Queues](https://developers.cloudflare.com/queues/) 讓 Worker 在 request path 只做驗證與 enqueue，耗時工作交給另一個 consumer Worker。平台負責保存、delivery、retry、batching、delay 與 dead-letter queue，也支援外部服務透過 HTTP pull consumer 取訊息。

它適合 webhook、email、資料同步、文件處理與 AI batch，不等於一套可重播事件平台或 durable workflow engine。

## At-least-once 是第一條契約

Queues 預設 at-least-once。訊息至少送達一次，罕見情況可能重複。consumer 不能用「我已看過這個 queue」判斷唯一性；producer 產生 task ID，資料庫 insert 以它當 primary key，外部 API 也傳 idempotency key。

```ts
export default {
  async queue(batch, env) {
    for (const message of batch.messages) {
      try {
        await env.DB.prepare(
          "INSERT OR IGNORE INTO jobs (id, payload) VALUES (?, ?)"
        ).bind(message.id, JSON.stringify(message.body)).run();
        message.ack();
      } catch {
        message.retry({ delaySeconds: 60 });
      }
    }
  },
};
```

`ack()` 只表示這則訊息不必重送，不會替資料庫與外部 side effect 提供 transaction。`INSERT OR IGNORE` 只是示意；真正 handler 還要記錄狀態，分辨已完成與處理中的 attempt。

## Batch 能省 invocation，也會放大失敗

consumer binding 可設定 max batch size 與 max batch timeout，先到的門檻觸發 delivery。批次寫入外部 API 或 D1 能降低 invocation 與 round trip，但一則失敗若沒有逐筆 ack，整個 batch 可能重送。

因此，每筆完成就 `ack()`，只對失敗訊息 `retry()`；只有整批共享 transaction 時才考慮 `ackAll()`／`retryAll()`。batch size 也要受下游 API limit、Worker memory、CPU 與 wall-clock 限制約束。

## Retry 一定要接 DLQ

consumer 可設定 max retries，超過後刪除或送到 dead-letter queue。DLQ 要有告警、保留期、inspect tool 與 redrive 流程。payload 帶 error category、schema version 與 attempt，才能分辨 transient failure、永久輸入錯誤和 deploy regression。

delay 可以平滑流量或做退避，但不是精準 scheduler。需要某個時間點執行用 Cron Triggers；需要多步等待與狀態恢復，使用 Workflows 或其他 durable execution 工具。

## 平台邊界要先對 limits

官方 limits 會隨方案與時間變動，設計前直接查表。2026 文件列出的重要邊界包含單訊息大小、batch 數、retention、backlog、consumer duration 與 throughput。大型文件與模型結果放 R2，只把 URI、hash、tenant、trace ID 和 task parameters 放 queue。

Workers consumer 適合 Cloudflare 內部整合；pull consumer 讓 Kubernetes、VM 或其他雲端 worker 經 HTTP 消費。後者仍需處理 visibility timeout、ack 與 credential rotation，不能因跨雲介面簡單就省略 threat model。

## 跟 SQS 與 Workflows 怎麼選

應用主要在 Workers、需要免管 broker 與全球 ingress 時，Queues 是自然預設。AWS workload、Lambda integration 與 SNS fan-out 深時，SQS 更順。需要 event replay 與多個獨立 consumer group 時看 Kafka／Pulsar／Redpanda。需要逐步 checkpoint、sleep 與 compensation 時看 Cloudflare Workflows，而不是堆更多 retry。

AI agent worker 常有高成本外部呼叫。queue message 應保存不可變 input pointer 與 budget，consumer 在呼叫模型前先 claim idempotency record，完成後寫結果再 ack。這條順序比調大 concurrency 更重要，否則重送會把同一筆 token 成本付兩次。

## 參考資料

- [Cloudflare Queues overview](https://developers.cloudflare.com/queues/)
- [Cloudflare Queues delivery guarantees](https://developers.cloudflare.com/queues/reference/delivery-guarantees/)
- [Cloudflare Queues batching, retries, and delays](https://developers.cloudflare.com/queues/configuration/batching-retries/)
- [Cloudflare Queues limits](https://developers.cloudflare.com/queues/platform/limits/)
