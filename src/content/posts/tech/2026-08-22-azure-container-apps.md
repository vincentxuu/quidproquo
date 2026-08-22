---
title: "Azure Container Apps：用 Revision、KEDA 與 Environment 跑 Serverless Container"
date: 2026-08-22
category: tech
type: deep-dive
tags: [azure, container-apps, serverless, containers, keda]
lang: zh-TW
tldr: "Azure Container Apps 封裝 Kubernetes，提供 HTTP/TCP ingress、revision、KEDA scaling、jobs 與 Dapr；你仍要設計 replica concurrency、事件冪等、VNet 與身分。"
description: "介紹 Azure Container Apps 的 environment、revision、traffic splitting、KEDA scaling、jobs、Dapr、網路與 AKS/App Service 選型。"
series:
  name: "AI 時代的技術選擇"
  order: 55
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-azure-container-apps-en)

[Azure Container Apps](https://learn.microsoft.com/azure/container-apps/overview) 是不直接暴露 Kubernetes control plane 的 serverless container 平台。它支援 HTTP/TCP ingress、background app、event/schedule/on-demand jobs、revision、traffic split、Dapr 與 KEDA scaling，適合想用 container 與微服務能力、卻不想營運 AKS 的團隊。

## Environment 與 Revision 是核心單位

多個 container app 可放在同一 environment，分享 network、logging 與內部 DNS 邊界。這是 blast radius 與治理選擇：不同信任等級、網路或生命週期不要只為省事塞在一起。

[Revision](https://learn.microsoft.com/azure/container-apps/revisions) 是 immutable snapshot。single revision mode 適合一般 rolling replacement；multiple revision mode 可做 blue/green、canary 與 A/B traffic。database migration 必須向前／向後相容，因為兩個 revision 可能同時處理 request。

## KEDA 量的是訊號，不懂你的業務容量

[Scaling rules](https://learn.microsoft.com/azure/container-apps/scale-app) 可依 HTTP/TCP concurrency、CPU/memory，或 Service Bus、Event Hubs、Kafka、Redis 等 KEDA scaler 擴縮。scale to zero 省 idle 成本，卻帶來 cold start；min replicas 用成本換 latency 與可用性。

queue length 除以 target messages 只是近似。每個 replica 的 processing time、prefetch、visibility/lock timeout、下游 quota 與 failure rate 都會改變安全容量。consumer 必須冪等，並設 max replicas 防止把 database 壓垮。若是 run-to-completion，使用 Container Apps Jobs，而不是讓 app process 結束後由平台反覆重啟。

## Dapr 是選配，不是預設答案

Dapr sidecar 提供 service invocation、pub/sub、state 等 building blocks，也增加 version、resource、latency 與除錯層。只有團隊真的需要跨語言抽象與 Dapr component model 才啟用；單純 HTTP API 不必為「未來微服務」預付複雜度。

使用 managed identity 存取 Azure resource，secret 只存必要 bootstrap material。external/internal ingress、VNet integration、private endpoint、DNS 與 egress policy 要逐向驗證；environment 內可互通不代表 resource-level authorization 已完成。

## Container Apps、App Service 或 AKS

event-driven worker、多 revision microservice、sidecar 與 scale-to-zero 選 Container Apps。傳統 Web runtime、deployment slot 與既有企業 App Service 維運模型選 App Service。需要 Kubernetes API、operator、cluster extension 或 node control 才選 AKS。驗收要重送 queue message、切流兩個 revision、撤銷 managed identity 並測 scale from zero。

## 參考資料

- [Azure Container Apps overview](https://learn.microsoft.com/azure/container-apps/overview)
- [Revisions in Azure Container Apps](https://learn.microsoft.com/azure/container-apps/revisions)
- [Set scaling rules](https://learn.microsoft.com/azure/container-apps/scale-app)
- [Jobs in Azure Container Apps](https://learn.microsoft.com/azure/container-apps/jobs)
- [Networking in Azure Container Apps](https://learn.microsoft.com/azure/container-apps/networking)
