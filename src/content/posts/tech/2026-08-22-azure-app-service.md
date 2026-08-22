---
title: "Azure App Service：Web App 的核心不是 Container，而是 App Service Plan"
date: 2026-08-22
category: tech
type: deep-dive
tags: [azure, app-service, paas, web-development, cloud-computing]
lang: zh-TW
tldr: "App Service 代管 Web runtime、TLS、deployment 與 scaling；容量、成本和隔離則落在共享的 App Service Plan，不能只看單一 app。"
description: "介紹 Azure App Service runtime/container、App Service Plan、deployment slots、scaling、networking 與 Container Apps 選型。"
series:
  name: "AI 時代的技術選擇"
  order: 56
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-azure-app-service-en)

[Azure App Service](https://learn.microsoft.com/azure/app-service/overview) 是託管 Web app、REST API 與 mobile backend 的 PaaS，支援 .NET、Java、Node.js、Python、PHP，以及 Windows/Linux custom container。它的抽象是「網站平台」，不是通用 container orchestrator。

## Plan 才是容量與隔離單位

App 屬於 App Service Plan。[Hosting plan 文件](https://learn.microsoft.com/azure/app-service/overview-hosting-plans) 指出，同 plan 的 apps、slots、WebJobs 與部分診斷工作共享 VM instance 的 CPU/memory，scale out 也一起變動。一個 noisy app 能拖累鄰居；成本盤點若只看 app resource，也會看錯。

把相同環境、相近負載與信任邊界的 apps 放一起，重要或不規則 workload 用獨立 plan。設定 autoscale 時同時看 CPU/memory、request queue、response time 與 downstream capacity；加 instance 不能修掉 database bottleneck。

## Deployment slot 是 App Service 的強項

[官方部署建議](https://learn.microsoft.com/azure/app-service/deploy-best-practices) 要求先部署 staging slot、warm up 與 smoke test，再 swap 到 production。slot-specific settings 要標清楚，否則 swap 可能把 production secret、connection 或 feature flag 帶錯。schema migration 仍採 expand/contract，因為 rollback 後舊版程式必須能讀新 schema。

runtime stack 由平台 patch，custom container 的 base image 與 dependency 則由團隊更新。無論哪一種，都使用 immutable artifact 與可重現 pipeline，不在 production console/RDP 手改狀態。

## Networking 不是一個「接上 VNet」開關

[Networking features](https://learn.microsoft.com/azure/app-service/networking-features) 將 inbound private endpoint/access restriction 與 outbound VNet integration 分開。兩個方向需要不同設定；再加 DNS、route、NAT、service endpoint/private endpoint 才構成完整路徑。managed identity 用於 Key Vault、Storage、SQL 等 Azure resource，避免長效 client secret。

Application Insights、platform log、health check、backup 與 certificate renewal 都要納入營運。Always On、instance warmup 和 slot swap 可改善冷啟動，卻不能取代 readiness 與依賴 timeout。

## App Service 還是 Container Apps

既有 Web app、受支援 runtime、Windows/IIS 相容性、deployment slot 與 enterprise PaaS 流程，App Service 很成熟。需要 scale-to-zero、KEDA event worker、sidecar、多 revision traffic 或 jobs，Container Apps 更自然；需要 Kubernetes API 才往 AKS。

驗收應讓同 plan 的鄰居吃滿 CPU、swap 一個缺設定的 slot、撤銷 managed identity 並切斷 private DNS，確認隔離、rollback、alarm 與 runbook 能指出真正的 plan/network 邊界。

## 參考資料

- [Azure App Service overview](https://learn.microsoft.com/azure/app-service/overview)
- [Azure App Service plans](https://learn.microsoft.com/azure/app-service/overview-hosting-plans)
- [App Service deployment best practices](https://learn.microsoft.com/azure/app-service/deploy-best-practices)
- [Set up staging environments](https://learn.microsoft.com/azure/app-service/deploy-staging-slots)
- [App Service networking features](https://learn.microsoft.com/azure/app-service/networking-features)
