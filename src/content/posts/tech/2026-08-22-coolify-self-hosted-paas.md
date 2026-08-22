---
title: "Coolify：自架 PaaS 的 Control Plane、Docker Server 與責任邊界"
date: 2026-08-22
category: tech
type: deep-dive
tags: [coolify, paas, self-hosting, docker, devops]
lang: zh-TW
tldr: "Coolify 用 SSH 控制自有 server 上的 Docker、proxy 與 resources；它簡化部署，但 OS、安全、容量、資料備份與平台復原仍由團隊負責。"
description: "介紹 Coolify control plane、connected servers、resources、reverse proxy、build、backup、高可用與自架責任。"
series:
  name: "AI 時代的技術選擇"
  order: 80
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-coolify-self-hosted-paas-en)

[Coolify](https://next.coolify.io/docs/core/what-is-coolify) 是開源、可自架的 PaaS control plane。它透過 SSH 操作團隊提供的 servers，在上面 build 或 pull image、建立 Docker container/network/volume，並設定 reverse proxy、domain、TLS、health check 與 deployment。

## Control plane 與 data plane 分開

Coolify instance 保存 project、environment、resource、server 與 credential 設定並協調工作；connected server 才執行 application、database、service、proxy 與 monitoring。HTTP traffic 直接進 workload server 的 proxy，不經 Coolify instance。Control plane 暫停時既有 containers 通常仍跑，但無法正常 deploy、操作或更新設定。

這個分離也表示 DNS 必須指向 resource 所在 server。用 SSH 管多台主機很方便，卻同時擴大管理面權限；應隔離 control plane、限制 SSH key、關閉 password login、設 firewall、更新 OS/Docker/Coolify，並記錄管理操作。

## Resource 是標準 Docker，平台仍有隱性狀態

[Coolify architecture](https://next.coolify.io/docs/core/how-coolify-works) 可部署 Git、Dockerfile、Compose 或既有 image。自建 image 時 build 可能搶走同機 CPU、memory 與 disk；production 宜用 dedicated build server 或 CI/registry，並固定 image digest、掃描 dependency、限制 build secret。

Traefik/Caddy 自動處理 routing 與 certificate，但它也是故障點。測試 certificate renewal、proxy reload、port collision、wildcard DNS 與直接繞過 proxy 的 host port。Container 可攜不代表設定自動可復原：platform database、generated files、registry artifact 和 DNS 都是系統的一部分。

## Backup 要拆成兩條

Coolify instance backup 只涵蓋 control-plane database，不包含 connected servers 上的 application files、database data、volumes 或 external storage。每個 stateful resource 要有自己的 consistent backup、off-site retention、encryption 與 restore drill；只看到 dashboard 顯示「backup successful」不算復原驗證。

多 server horizontal scaling 需要 shared registry、外部 load balancer 與一致的 image architecture；Docker Swarm 也會增加 quorum、overlay network、storage 和 upgrade 責任。先把 application stateless、資料外部化，再談 replicas。

Coolify 適合有 Linux/Docker 能力、想在 Hetzner、DigitalOcean、家用機或混合雲取得 PaaS UX 的團隊。若不想值班處理 host 與 control plane，選 Railway/Render；若需要成熟 scheduler、policy 與 ecosystem，評估 Kubernetes。驗收應包含 Coolify instance loss、workload host loss、registry outage、volume restore、certificate renewal 與升級 rollback。

## 參考資料

- [What is Coolify](https://next.coolify.io/docs/core/what-is-coolify)
- [How Coolify works](https://next.coolify.io/docs/core/how-coolify-works)
- [Coolify concepts](https://coolify.io/docs/get-started/concepts)
- [Coolify server introduction](https://coolify.io/docs/knowledge-base/server/introduction)
- [Coolify scalability](https://coolify.io/docs/knowledge-base/internal/scalability)
