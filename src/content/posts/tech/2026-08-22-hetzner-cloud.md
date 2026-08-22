---
title: "Hetzner Cloud：便宜 VM 的真正成本是你要擁有整個作業系統"
date: 2026-08-22
category: tech
type: deep-dive
tags: [hetzner, cloud-computing, virtual-machine, infrastructure, self-hosting]
lang: zh-TW
tldr: "Hetzner Cloud 以 Server、Network、Volume、Load Balancer 與 Firewall 提供精簡 IaaS；價格優勢只有在 patch、HA、backup、egress 與 on-call 成本算進去後才成立。"
description: "介紹 Hetzner Cloud Servers、private networks、volumes、load balancers、firewalls、backups、placement groups 與自架責任。"
series:
  name: "AI 時代的技術選擇"
  order: 64
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-hetzner-cloud-en)

[Hetzner Cloud](https://docs.hetzner.com/cloud/) 是精簡 IaaS：Cloud Server、private Network、Volume、Load Balancer、Firewall、Primary IP、snapshot/backup 與 API/Terraform。它很適合熟悉 Linux、想用透明 building blocks 控制成本的團隊，但不會替你營運 application platform。

## Server 建立容易，golden path 才是工作

[建立 Server](https://docs.hetzner.com/cloud/servers/getting-started/creating-a-server/) 只需幾分鐘；production 還要 cloud-init/image、non-root SSH、automatic security updates、host firewall、log/metrics、secret delivery、immutable deployment 與 rebuild 流程。手動修一台機器會製造無法重現的 snowflake。

Server 應可銷毀重建。application state 放 Volume、object storage 或 database；但 block Volume 本身也不是 backup。每日 backup/snapshot 要驗證 retention、coverage 與 restore，database 另做 consistent dump/PITR。RPO/RTO 必須以演練結果，不是「有勾 backup」證明。

## HA 不是加一台 Server

兩台 app server 配 Load Balancer 仍可能共用同一 failure domain。[Placement Group](https://docs.hetzner.com/cloud/placement-groups/overview/) 可協助 spread，但 database、volume、region、DNS 與 control-plane dependency 都要逐項盤點。private Network 隔離 east-west traffic；public ingress 只開 load balancer，administration 走 VPN/bastion，Firewall 採 default deny。

autoscaling、managed database、queue、secret manager 與跨 region orchestration 的產品面比 hyperscaler 小，常要自架或採第三方。這也是低帳單之外的 engineering/on-call 成本。

## 什麼情況適合

穩定 Web service、CI runner、自架工具、homelab 延伸與可容忍自行營運的 workload 很適合。需要大量雲原生 managed service、企業 IAM 組織、複雜 compliance 或全球 multi-region database 時，DigitalOcean/hyperscaler/PaaS 可能更省總成本。

決策時把 compute、IPv4、volume、snapshot、traffic、support 與工程工時一起算。故意刪除 Server、restore Volume/database、讓一個 host failure，再確認 IaC、placement、health check、DNS 與 runbook 能恢復。

## 參考資料

- [Hetzner Cloud documentation](https://docs.hetzner.com/cloud/)
- [Creating a Cloud Server](https://docs.hetzner.com/cloud/servers/getting-started/creating-a-server/)
- [Hetzner Cloud Networks](https://docs.hetzner.com/cloud/networks/overview/)
- [Hetzner Cloud Volumes](https://docs.hetzner.com/cloud/volumes/overview/)
- [Hetzner Placement Groups](https://docs.hetzner.com/cloud/placement-groups/overview/)
