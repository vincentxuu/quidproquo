---
title: "DigitalOcean：從 Droplet 到 App Platform 的簡化型 Cloud"
date: 2026-08-22
category: tech
type: deep-dive
tags: [digitalocean, cloud-computing, paas, kubernetes, infrastructure]
lang: zh-TW
tldr: "DigitalOcean 用 Droplet、DOKS、Managed Databases 與 App Platform 覆蓋常見產品架構；簡單來自較小的服務面，不是免除 OS、網路、備份與 HA 設計。"
description: "介紹 DigitalOcean Droplets、App Platform、DOKS、Managed Databases、VPC、storage，以及與 hyperscaler/PaaS 的取捨。"
series:
  name: "AI 時代的技術選擇"
  order: 63
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-digitalocean-cloud-platform-en)

[DigitalOcean](https://docs.digitalocean.com/products/) 的賣點是把常見 cloud building blocks 做得較容易理解。產品包含 Droplet VM、App Platform、DigitalOcean Kubernetes（DOKS）、Managed Databases、Spaces object storage、Volumes、Load Balancer、VPC 與 DNS。

## 先選責任層

[Droplet](https://docs.digitalocean.com/products/droplets/how-to/create/) 是 VM。你負責 OS patch、SSH、firewall、runtime、process supervisor、deployment、monitoring 與備份。適合小型服務、現成 software、worker 或需要完整 Linux 控制的工作。

App Platform 從 Git repository 或 container image build/deploy web service、worker 與 job，平台管理基礎設施與 scaling。DOKS 則保留 Kubernetes API，適合多服務、controller 與共用 platform。只是跑一個 HTTP API 時，不要因為「未來可能變大」直接支付 Kubernetes 操作成本。

## 簡單架構也要畫 network 與 state

VPC 是 datacenter/region 與產品支援相關的 private network，不代表所有資源自動互通。[App Platform VPC](https://docs.digitalocean.com/products/app-platform/how-to/enable-vpc/) 還有 egress IP、datacenter 與 component 限制。逐條確認 public ingress、private database、egress、firewall/trusted source、DNS 與 load balancer。

Droplet root disk、Volume、Spaces、database backup 與 snapshot 的耐久性不同。snapshot 不是 application-consistent backup；database 要測 point-in-time/restore，object storage 要設 lifecycle/versioning，跨 region DR 要真的複製並演練。

## Managed 不等於完整治理

Managed Database 代管 patch、backup 與部分可用性。schema migration、query/index、connection pool、tenant authorization 與 recovery objective 仍屬於應用程式。Marketplace image 能快速啟動，卻要查維護者、更新頻率、預設 credential 與 exposed port。

DigitalOcean 適合小團隊、SaaS、開發環境與標準 Web stack。需要大量專用 managed service、跨帳號治理、全球 private backbone 或複雜合規時，hyperscaler 可能更完整；只要 source-to-URL，可再比較 Render/Railway。驗收時重建 Droplet、restore database、切斷 VPC path 並部署壞版，確認 IaC、backup、alarm 與 rollback。

## 參考資料

- [DigitalOcean products](https://docs.digitalocean.com/products/)
- [Create a Droplet](https://docs.digitalocean.com/products/droplets/how-to/create/)
- [DigitalOcean App Platform](https://docs.digitalocean.com/products/app-platform/)
- [DigitalOcean Kubernetes](https://docs.digitalocean.com/products/kubernetes/)
- [App Platform VPC](https://docs.digitalocean.com/products/app-platform/how-to/enable-vpc/)
