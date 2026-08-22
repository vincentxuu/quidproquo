---
title: "AWS Lambda：選函式運算前，先讀懂事件、重試與並行度"
date: 2026-08-22
category: tech
type: deep-dive
tags: [aws, lambda, serverless, event-driven, cloud-computing]
lang: zh-TW
tldr: "Lambda 適合短生命週期、事件驅動且流量不規則的工作；真正的設計中心是 invocation、重試、冪等與下游容量，不是把容器切小。"
description: "介紹 AWS Lambda 的 invocation、event source mapping、重試、並行度、冷啟動、封裝與 Lambda/Fargate 選型。"
series:
  name: "AI 時代的技術選擇"
  order: 50
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-aws-lambda-compute-en)

[AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/lambda-invocation.html) 是事件驅動的函式運算服務。你部署程式與設定，AWS 依請求建立 execution environment；團隊不用維護主機，卻必須設計 invocation、並行度與失敗語意。

## 先分清三種 invocation

同步呼叫會等待結果，函式錯誤通常交給 caller 決定是否重試。非同步呼叫先進 Lambda 管理的 queue；失敗、throttle 與 event age 有另一套重試設定。SQS、Kinesis 等 event source mapping 則由 poller 批次取資料，其 retry、visibility timeout、partial batch failure 與 checkpoint 又依來源不同。

這些差異決定 duplicate 與資料遺失風險。[AWS 的 retry 說明](https://docs.aws.amazon.com/lambda/latest/dg/invocation-retries.html) 明確要求程式能處理同一事件多次。付款、寄信或寫外部 API 時，用 event id 建立 idempotency record；失敗事件送 destination 或 DLQ，並監控 queue age，而不只看函式 error rate。

## 自動擴縮不代表下游也能擴縮

Lambda 的 concurrency 是同時執行中的 invocation。突發流量可能迅速開出大量環境，先壓垮資料庫 connection、第三方 API quota 或 downstream queue。reserved concurrency 除了保留容量，也能當上限；provisioned concurrency 則用成本換較穩定的啟動延遲。[官方 scaling 文件](https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html) 仍有 account、function 與擴張速率限制，部署前要查目標 Region 的 quota。

冷啟動不能只看平均值。runtime、dependency、VPC、初始化與封裝大小都影響尾端延遲。先量 p95/p99，再決定是否縮 dependency、把初始化移出 handler 或採 provisioned concurrency。

## Container image 不等於一般容器平台

Lambda 支援 zip 與 [container image](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html)，但 image 仍要遵守 Lambda runtime API、唯讀檔案系統與 `/tmp` 邊界。它不是任意長駐 daemon，也不因用了 Dockerfile 就獲得 Fargate 的 process 與網路模型。

handler 應保持 stateless，把 durable state 放到資料庫或 object storage。execution environment 可能重用，因此可以重用 client connection，但不能把 `/tmp` 或全域變數當可靠狀態。IAM role 採最小權限，對 event source 另檢查 resource policy 與 cross-account boundary。

## Lambda、Fargate 或 App Runner

事件觸發、短工作、流量高度不規則，Lambda 通常最省操作。需要長時間 process、自訂 runtime 行為、sidecar、穩定 connection pool 或 container-level 資源，選 Fargate。單純把 HTTP container 從 repository 變成公開服務，App Runner 的抽象更高。

驗收時不要只打一次 HTTP。重送同一 event、讓 handler timeout、耗盡 concurrency、關閉 downstream，再確認 idempotency、backoff、DLQ、alarm 與 reserved concurrency 都照預期運作。

## 參考資料

- [Understanding Lambda invocation methods](https://docs.aws.amazon.com/lambda/latest/dg/lambda-invocation.html)
- [Understanding retry behavior in Lambda](https://docs.aws.amazon.com/lambda/latest/dg/invocation-retries.html)
- [Understanding Lambda function scaling](https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html)
- [Lambda container images](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html)
- [AWS Fargate or AWS Lambda decision guide](https://docs.aws.amazon.com/decision-guides/latest/fargate-or-lambda/fargate-or-lambda.html)
