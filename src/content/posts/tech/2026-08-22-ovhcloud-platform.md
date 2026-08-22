---
title: "OVHcloud：Public Cloud、OpenStack、vRack 與 Dedicated Server 的組合"
date: 2026-08-22
category: tech
type: deep-dive
tags: [ovhcloud, openstack, cloud-computing, kubernetes, european-cloud]
lang: zh-TW
tldr: "OVHcloud 的特色是 Public Cloud、OpenStack API、Managed Kubernetes、vRack 與 dedicated/private cloud 共存；彈性也帶來較多 network 與責任邊界。"
description: "介紹 OVHcloud Public Cloud instances、OpenStack、MKS、vRack、storage、database、dedicated server 與歐洲 cloud 選型。"
series:
  name: "AI 時代的技術選擇"
  order: 68
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-ovhcloud-platform-en)

[OVHcloud](https://docs.ovhcloud.com/en/) 橫跨 VPS、Dedicated Server、Public Cloud、Managed Kubernetes、database、object/block/file storage，以及 VMware/Nutanix 等 hosted private cloud。Public Cloud 大量採用 OpenStack API，適合需要標準 IaaS 與 public/dedicated/private resource 混合的團隊。

## Public Cloud Instance 仍是你管理的 VM

平台負責 datacenter、hardware 與虛擬化，使用者負責 guest OS、SSH、patch、runtime、application firewall、deployment、monitoring 與資料保護。以 cloud-init/Packer、Terraform/OpenTofu 與 immutable artifact 建立可重建流程，不在 production VM 上累積手動狀態。

OpenStack API 提高工具與概念可攜性，但 provider extension、flavor、network、storage class 與 quota 仍有差異。「支援 OpenStack」不是無成本跨雲；至少以相同 IaC、image 與 restore workflow 在替代環境驗證。

## MKS 管 control plane，你管 worker 與 workload

[OVHcloud Managed Kubernetes 架構](https://docs.ovhcloud.com/en/guides/public-cloud/containers-orchestration/managed-kubernetes/understanding-mks-architecture) 說明平台代管 control plane，使用者控制 worker node 與 workload。Node pool sizing、requests/limits、RBAC、network policy、upgrade compatibility、persistent volume、backup 與 SLO 仍是平台工程工作。

MKS 可整合 Public Cloud Load Balancer、Block/File Storage 與 private network。建立 cluster 前查 region、plan、worker flavor、storage 與 Kubernetes version matrix；control plane 有服務承諾也不代表 Pod 自動跨 failure domain。

## vRack 是組合能力，也是設計責任

同 region Public Cloud resource 可用 private network；[vRack](https://docs.ovhcloud.com/en/guides/public-cloud/network-services/private-network/vrack-configuration) 還能連跨 region、Dedicated Server 與 Hosted Private Cloud。這讓 hybrid 拓撲有彈性，也更需要 IPAM、MTU、route、gateway、DNS、firewall 與 failure-domain 文件。

Object Storage 提供 S3-compatible workflow，仍要驗證 deployment mode、zone durability、versioning/lifecycle、SDK behavior 與 restore。Managed Database 代管部分 HA/patch/backup，schema、query、connection、authorization 與 recovery objective 仍由應用程式負責。

OVHcloud 適合歐洲資料位置、OpenStack、bare metal 與 hybrid/private connectivity 是核心需求的團隊。只要 source-to-URL 的小型 app，PaaS 更簡單；深度依賴 hyperscaler serverless 生態時則要估替代成本。演練失去 instance/worker、斷 vRack、restore object/database，再確認 audit、alarm 與 support path。

## 參考資料

- [OVHcloud documentation](https://docs.ovhcloud.com/en/)
- [OVHcloud Public Cloud](https://www.ovhcloud.com/en/public-cloud/)
- [OVHcloud Managed Kubernetes architecture](https://docs.ovhcloud.com/en/guides/public-cloud/containers-orchestration/managed-kubernetes/understanding-mks-architecture)
- [OVHcloud Public Cloud networking](https://docs.ovhcloud.com/en/guides/public-cloud/network-services/)
- [OVHcloud Object Storage](https://docs.ovhcloud.com/en/guides/public-cloud/storage/object-storage/)
