---
title: "AWS Fargate：不用管 EC2，不代表不用管 ECS"
date: 2026-08-22
category: tech
type: deep-dive
tags: [aws, fargate, ecs, containers, cloud-computing]
lang: zh-TW
tldr: "Fargate 移除容器主機管理，但 task definition、ECS service、VPC、IAM、擴縮、部署與可觀測性仍是你的系統。"
description: "介紹 AWS Fargate 與 ECS 的責任邊界、task、service、網路、IAM、儲存、擴縮，以及跟 Lambda、ECS Express Mode、EC2 的選型。"
series:
  name: "AI 時代的技術選擇"
  order: 51
draft: false
---

> :globe: [English version](/posts/tech/2026-08-22-aws-fargate-containers-en)

[AWS Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-tasks-services.html) 是 ECS 與 EKS 可用的 serverless container compute。以 ECS 為例，你不必建 EC2 cluster、patch host 或配置 bin packing；但還是要定義 image、CPU/memory、port、health check、IAM、network、desired count 與 deployment policy。

## Task 是部署單位，Service 才維持長駐

task definition 是有版本的執行規格，可放一個主要 container 與緊密耦合的 sidecar。同一 task 的 containers 共用生命週期，也無法各自擴縮；API、worker 與排程工作通常拆成不同 task family。

一次性 batch 可直接 run task。長駐 API 則交給 ECS service 維持 desired count，搭配 Application/NLB、health check、rolling 或 blue/green deployment。Application Auto Scaling 改的是 task 數；每個 task 內能處理多少 concurrent request，仍由應用程式與 CPU/memory 決定。

## 每個 task 都進你的 VPC

Fargate 強制使用 `awsvpc`；[每個 task 取得 ENI](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html)、private IP 與 security groups。private subnet 若要拉 image、取 secret 或連公開 API，需要 NAT，或替 ECR、CloudWatch、Secrets Manager 等配置 VPC endpoint。這些網路元件的費用與故障面常比 container 本身更容易漏估。

區分 task execution role 與 task role：前者讓 ECS 拉 image、送 log、取得啟動所需 secret；後者才是 application 呼叫 AWS API 的身分。不要把 broad execution permission 當成應用程式權限，也不要把靜態 AWS key 烤進 image。

## 無主機不等於無狀態限制

task 會被替換，local disk 應視為 ephemeral。[Fargate storage 文件](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-storage.html) 定義可配置的 ephemeral storage；持久資料放 S3、RDS、DynamoDB 或合適的 network filesystem。收到 termination signal 時要停止接新工作、完成或重新排隊 in-flight job。

選定 CPU/memory 組合後，監控 utilization、OOM、task startup、deployment failure、ALB target response 與 queue depth。scale-in protection、minimum healthy percent、circuit breaker 和 rollback 都應用 failure injection 驗證。

## 跟 Lambda、ECS Express Mode、EC2 怎麼選

Fargate 適合標準 container、長時間服務或 worker、sidecar、VPC 深度整合，以及不想管 host 的團隊。Lambda 更適合短事件與極端 burst，多步長流程也可以先看 [Lambda durable functions](/posts/tech/2026-08-22-aws-lambda-compute)；EC2/ECS 則在穩定高利用率、特殊硬體或 host-level control 下可能更合適。

單純的 HTTP service 想少寫設定，以前會推 App Runner，但它從 2026-04-30 起停收新客戶（見 [App Runner 那篇](/posts/tech/2026-08-22-aws-app-runner)）。現在的對應選項是 [ECS Express Mode](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-overview.html)：給一個 image 與兩個 IAM role，它在 Fargate 上建好 ECS service、ALB、auto scaling 與網路。它不是另一個平台，建出來的就是本篇講的 task 與 service，之後要加 sidecar 或改 deployment 都直接改底層資源。

Fargate 的價值是把 host responsibility 交給 AWS，不是消除 platform engineering。驗收應中止一個 task、讓 image pull 失敗、耗盡 subnet IP、切斷 NAT 或 endpoint，再確認 deployment、alarm 與 rollback 能救回服務。

## 更新紀錄

- 2026-11-23：App Runner 從 2026-04-30 起停收新客戶，選型段改以 ECS Express Mode 對照，並補上 Lambda durable functions 的連結。

## 參考資料

- [Amazon ECS task definition differences for Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-tasks-services.html)
- [Fargate task networking](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html)
- [Fargate task ephemeral storage](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-storage.html)
- [Amazon ECS Express Mode](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-overview.html)
- [Choosing an AWS container service](https://docs.aws.amazon.com/decision-guides/latest/containers-on-aws-how-to-choose/choosing-aws-container-service.html)
