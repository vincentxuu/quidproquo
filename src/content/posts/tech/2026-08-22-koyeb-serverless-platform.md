---
title: "Koyeb：App、Service、Instance 與全球 Serverless 部署模型"
date: 2026-08-22
category: tech
type: deep-dive
tags: [koyeb, paas, serverless, cloud-computing, devops]
lang: zh-TW
tldr: "Koyeb 以 App 收納 Services、以 Instance 在指定 region 執行 revision，並整合 global routing、autoscaling、private discovery 與 CPU/GPU compute。"
description: "介紹 Koyeb App、Service、Instance、deployment、regions、autoscaling、scale-to-zero、network 與 storage 邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 77
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-koyeb-serverless-platform-en)

[Koyeb](https://www.koyeb.com/docs) 是把 Git repository 或 container image 部署到多個 region 的 PaaS。它同時提供 CPU/GPU Instances、edge routing、TLS、service mesh、autoscaling 與 scale-to-zero，定位介於 repository-first PaaS 和可選區域的 container platform。

## App、Service、Instance 不要混在一起

App 是一組相關 Services 的 namespace。Service 描述來源、build、command、ports、environment、regions、instance type 與 scaling policy；每次改設定產生新 Deployment/revision。Instance 才是某個 region 實際執行該 revision 的 microVM。

因此「一個 App 部署全球」不表示單一 process 同時存在各地。要明確選 region 與 instance count，並讓 Service 無狀態、可重建、能接 termination。Web Service 接 incoming traffic；worker 類 workload 則要以 queue semantics、retry、idempotency 和 graceful shutdown 驗收。

## Routing 與 private mesh 解決的是連線

Koyeb Edge Network 將 public request 導向 healthy Service Instances，平台替 public endpoint 管 TLS。[Service mesh](https://www.koyeb.com/docs/reference/service-mesh) 提供 private service discovery 與加密連線，適合 API、worker、database proxy 的內部接線。

但 global load balancing 不會讓 session、cache 或 database 自動跨區一致。把 mutable state 放外部 datastore，根據 latency 與 data residency 選 region；若只有單區 primary，遠端 compute 可能只是把 database round trip 拉長。private endpoint 也仍需 application authentication 與 least privilege。

## Autoscaling 要讀懂訊號與冷啟動

[Autoscaling](https://www.koyeb.com/docs/run-and-scale/autoscaling) 可依 CPU、memory 或 request rate，在設定的最小與最大 Instances 間調整；多個條件同時存在時，會採滿足所有 target 所需的較大數量。這是 capacity controller，不是 application backpressure，queue depth、第三方 API limit 與 database connections 仍要另外控制。

[Scale-to-Zero](https://www.koyeb.com/docs/run-and-scale/scale-to-zero) 可把公開 Service 降到零並由新流量喚醒，但目前屬 public preview，且有 cold start、protocol 與 long-lived connection 限制。延遲敏感 API 應保留 minimum instance 或先量測；worker 不能假設沒有 HTTP traffic 就等於沒有工作。

Instance filesystem 應視為 ephemeral；需要持久資料時使用平台 volume 或外部 managed storage，並先確認所選 region、instance type、replica 與 deployment 的相容性。單一附加磁碟不等於 replicated database，backup/restore 仍須演練。

Koyeb 適合需要快速 global API、CPU/GPU inference、preview 與自動伸縮，而不想先維護 cluster 的團隊。純 frontend 比較 Vercel/Netlify；偏 multi-service developer UX 比較 Railway/Render；需要 programmable VM lifecycle 比較 Fly.io。驗收需涵蓋 scale-from-zero、region outage、超出 max replicas、dependency saturation、rollback 與 state restore。

## 參考資料

- [Koyeb documentation](https://www.koyeb.com/docs)
- [Koyeb applications](https://www.koyeb.com/docs/reference/apps)
- [Koyeb services](https://www.koyeb.com/docs/reference/services)
- [Koyeb service mesh](https://www.koyeb.com/docs/reference/service-mesh)
- [Koyeb autoscaling](https://www.koyeb.com/docs/run-and-scale/autoscaling)
- [Koyeb scale-to-zero](https://www.koyeb.com/docs/run-and-scale/scale-to-zero)
