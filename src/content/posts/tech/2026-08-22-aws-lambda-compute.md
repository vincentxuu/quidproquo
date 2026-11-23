---
title: "AWS Lambda：選函式運算前，先讀懂事件、重試與並行度"
date: 2026-08-22
category: tech
type: deep-dive
tags: [aws, lambda, serverless, event-driven, cloud-computing]
lang: zh-TW
tldr: "Lambda 適合短生命週期、事件驅動且流量不規則的工作；真正的設計中心是 invocation、重試、冪等與下游容量，不是把容器切小。"
description: "介紹 AWS Lambda 的 invocation、event source mapping、重試、並行度、冷啟動、封裝、durable functions，以及 Lambda、Step Functions 與 Fargate 的選型。"
series:
  name: "AI 時代的技術選擇"
  order: 50
draft: false
---

> :globe: [English version](/posts/tech/2026-08-22-aws-lambda-compute-en)

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

## 多步流程：durable functions 改變了分界

傳統 Lambda 一次 invocation 只做一件短事，多步流程的狀態要自己存，或交給 Step Functions。2025-12 GA 的 [Lambda durable functions](https://docs.aws.amazon.com/lambda/latest/dg/durable-functions.html) 把這件事收進 Lambda 本身：程式裡用 `step` 包住業務邏輯、用 `wait` 暫停，Lambda 自動 checkpoint；失敗或恢復時從頭 replay，但跳過已完成的 step，直接用存下來的結果。整個 durable execution 最長可以跑一年，`wait` 期間不收運算費。

它是 checkpoint/replay 模型，跟 Temporal、Inngest 這類 durable execution 是同一個家族，設計規則也一樣：

- **step 之外的程式碼每次 replay 都會重跑**，所以要 deterministic；呼叫外部 API、取時間、產生亂數都要放進 step。
- **單次 invocation 仍受 function timeout 限制**。一年是整個 execution 的總長，靠的是在 `wait` 與 step 邊界切成多次 invocation，不是一次跑一年。2026-11 起 on-demand 函式的 timeout 上限從 15 分鐘提高到 [30 分鐘](https://aws.amazon.com/blogs/compute/announcing-30-minute-timeout-for-on-demand-aws-lambda-event-functions/)。
- **一年只適用非同步呼叫**。同步呼叫或 function URL 的 durable execution 上限是 30 分鐘。
- **只能在建立函式時開啟**，不能事後套到既有函式；目前支援 Node.js、Python、Java、.NET 的部分 runtime 與 container image，每個 execution 的 checkpoint 資料有 100 MB、每個 operation 1 MB 的上限（[quotas](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html)）。

跟 Step Functions 的分工，[AWS 文件](https://docs.aws.amazon.com/lambda/latest/dg/durable-functions.html) 的說法是：流程跟業務邏輯綁得很緊、想用一般程式語言寫，選 durable functions；要跨大量 AWS 服務編排、需要視覺化設計與原生整合，選 Step Functions。

## Lambda、Step Functions 或 Fargate

事件觸發、短工作、流量高度不規則，Lambda 通常最省操作。多步、會等人審核或等外部事件、總時長以小時或天計的流程，以前的答案是 Step Functions 或長駐的 Fargate worker；現在先看 durable functions 能不能放得下，只要每一段運算塞得進 function timeout 就行。

需要長駐 process、單次連續運算超過 function timeout、自訂 runtime 行為、sidecar、穩定 connection pool 或 container-level 資源，選 Fargate。單純要把 HTTP container 變成公開服務，以前會推 App Runner，但它從 2026-04-30 起停收新客戶（見 [App Runner 那篇](/posts/tech/2026-08-22-aws-app-runner)），新專案改用 ECS Express Mode，底下同樣是 Fargate。

驗收時不要只打一次 HTTP。重送同一 event、讓 handler timeout、耗盡 concurrency、關閉 downstream，再確認 idempotency、backoff、DLQ、alarm 與 reserved concurrency 都照預期運作。用 durable functions 的話，再加一項：在兩個 step 之間讓 invocation 失敗，確認 replay 不會重做已完成的 side effect。

## 更新紀錄

- 2026-11-23：新增 durable functions 一節（2025-12 GA，最長一年、checkpoint/replay），重劃 Lambda、Step Functions、Fargate 的分界；移除 App Runner 選項（2026-04-30 起停收新客戶，新專案改用 ECS Express Mode）；補上 2026-11 起 on-demand 函式 timeout 上限提高到 30 分鐘。

## 參考資料

- [Understanding Lambda invocation methods](https://docs.aws.amazon.com/lambda/latest/dg/lambda-invocation.html)
- [Understanding retry behavior in Lambda](https://docs.aws.amazon.com/lambda/latest/dg/invocation-retries.html)
- [Understanding Lambda function scaling](https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html)
- [Lambda container images](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html)
- [AWS Fargate or AWS Lambda decision guide](https://docs.aws.amazon.com/decision-guides/latest/fargate-or-lambda/fargate-or-lambda.html)
- [Lambda durable functions](https://docs.aws.amazon.com/lambda/latest/dg/durable-functions.html)
- [AWS Lambda announces durable functions（2025-12-02）](https://aws.amazon.com/about-aws/whats-new/2025/12/lambda-durable-multi-step-applications-ai-workflows/)
- [Lambda quotas](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html)
- [Announcing 30-minute timeout for on-demand AWS Lambda Event Functions](https://aws.amazon.com/blogs/compute/announcing-30-minute-timeout-for-on-demand-aws-lambda-event-functions/)
