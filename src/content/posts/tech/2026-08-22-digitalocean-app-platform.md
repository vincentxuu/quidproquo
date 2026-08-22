---
title: "DigitalOcean App Platform：用 Component 與 App Spec 管理 PaaS 拓撲"
date: 2026-08-22
category: tech
type: deep-dive
tags: [digitalocean, app-platform, paas, cloud-computing, devops]
lang: zh-TW
tldr: "DigitalOcean App Platform 以 Service、Worker、Job、Static Site 與 Function 等 Components 組成 App，再用 App Spec 保存可 review 的部署合約。"
description: "介紹 DigitalOcean App Platform components、App Spec、build、routing、health check、autoscaling 與 state 邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 79
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-digitalocean-app-platform-en)

[DigitalOcean App Platform](https://docs.digitalocean.com/products/app-platform/) 是從 Git repository 或 container image build、deploy 與 scale 應用的 managed PaaS。它位在 Droplet 與 Kubernetes 之間：平台管理 OS、routing、TLS、deployment 和 container lifecycle，團隊仍管理 application、data、dependency 與容量政策。

## Component type 是 process contract

一個 App 可包含公開 HTTP **Service**、無 ingress 的長駐 **Worker**、執行後退出的 scheduled/pre/post-deploy **Job**、**Static Site** 與 serverless **Function**。不要把 queue consumer 偽裝成 Service，也不要讓 migration 跟每個 web replica 一起啟動。

各 Component 可以來自不同 source directory 或 image，並以 bindable variables 引用 database 與其他元件。內部 routing 解決 reachability，不保證 dependency readiness；client 仍需 timeout、retry、connection budget 與 graceful shutdown。

## App Spec 是完整狀態，不是局部 patch

[App Spec](https://docs.digitalocean.com/products/app-platform/reference/app-spec/) 用 YAML 宣告 components、sources、commands、environment、domains、ingress、alerts、databases、regions 與 scaling。把它放進 version control，先由 API/CLI 下載現況再改；更新時 spec 應完整描述 App，漏欄位可能代表移除設定。

Secret 值不要明碼 commit；不同環境使用獨立 App、credential 與 database。build-time 和 run-time variables 要分清楚，build artifact 也不可內嵌 production secret。

## Health 與 autoscaling 需要 application 配合

[Health check](https://docs.digitalocean.com/products/app-platform/how-to/manage-health-checks/) 可做 readiness，失敗時停止送流量；另有 liveness probe 可重啟 Service 或 Worker。readiness 應檢查能否接新工作，liveness 只判斷 process 是否卡死，兩者都不應每次掃完整 database。

[Autoscaling](https://docs.digitalocean.com/products/app-platform/how-to/scale-app/) 支援固定水平副本，以及依 CPU 或 HTTP request metrics 調整；垂直 instance size 仍是手動固定。多 metrics 時任一超標即可 scale up、全部低於目標才 scale down。它不看 queue depth、database saturation 或第三方 rate limit，worker 容量仍需外部 signal 與 backpressure。

Runtime filesystem 應視為 ephemeral。長期檔案放 Spaces，關聯資料放 Managed Databases；若 workload 需要 writable local volume、特殊 network appliance 或 host control，改用 Droplet/DOKS 往往更直接。

App Platform 適合已有 DigitalOcean database/Spaces、想以較少維運部署 web、worker、job 與 static frontend 的團隊。比較 Railway/Render 的 developer workflow、Koyeb/Fly.io 的 placement，以及大雲的 IAM/compliance。驗收應包含壞版 rollback、readiness/liveness 分離、job 重跑、autoscaling 下的 connection storm 與 database restore。

## 參考資料

- [DigitalOcean App Platform](https://docs.digitalocean.com/products/app-platform/)
- [App Platform features](https://docs.digitalocean.com/products/app-platform/details/features/)
- [App specification reference](https://docs.digitalocean.com/products/app-platform/reference/app-spec/)
- [App Platform glossary](https://docs.digitalocean.com/glossary/app-platform/)
- [Manage health checks](https://docs.digitalocean.com/products/app-platform/how-to/manage-health-checks/)
- [Scale App Platform apps](https://docs.digitalocean.com/products/app-platform/how-to/scale-app/)
