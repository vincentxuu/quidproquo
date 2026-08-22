---
title: "Oracle Cloud Infrastructure：先理解 Compartment、VCN 與 Fault Domain"
date: 2026-08-22
category: tech
type: deep-dive
tags: [oracle-cloud, oci, cloud-computing, kubernetes, infrastructure]
lang: zh-TW
tldr: "OCI 是完整 hyperscale cloud；架構起點不是 Compute shape，而是 tenancy/compartment IAM、region/AD/fault domain 與 VCN，再選 Compute、OKE、database 與 storage。"
description: "介紹 Oracle OCI 的 tenancy、compartment、IAM policy、region/availability/fault domain、VCN、Compute、OKE、database 與 HA。"
series:
  name: "AI 時代的技術選擇"
  order: 69
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-oracle-cloud-infrastructure-en)

[Oracle Cloud Infrastructure（OCI）](https://docs.oracle.com/en-us/iaas/Content/GSG/Concepts/concepts-core.htm) 是完整 public cloud。Compute 涵蓋 VM、bare metal 與 GPU，另有 Oracle Kubernetes Engine（OKE）、Functions、network 和 object/block/file storage。資料庫服務則包含 Autonomous Database、Base Database 與 Exadata。

只用「Oracle 的雲」理解 OCI 會漏掉重點。它有自己的 governance 與 failure-domain vocabulary，landing zone 必須先定義，否則資源很快散在 tenancy 裡。

## Compartment 不只是資料夾

tenancy 是最高層帳戶邊界，compartment 用來組織資源、套 IAM policy 與 quota。[IAM 文件](https://docs.oracle.com/en-us/iaas/Content/Identity/Concepts/overview.htm) 的 policy 以 group/dynamic group、verb、resource type、compartment 與 condition 表達權限。不要把所有資源與管理員放 root compartment，也不要給 application 使用者 credential。

依 platform/network/security、production/non-production 與團隊責任切 compartment。再以 dynamic group/workload identity 讓 instance、function 或 OKE workload 取得短效權限。先在測試 tenancy 驗 policy；OCI policy 語法可讀，但一條 tenancy-wide `manage all-resources` 仍是高風險捷徑。

## Region、AD 與 Fault Domain 是三層

region 是地理區域，availability domain（AD）是 region 內隔離的 datacenter 群，fault domain 再把同 AD 的硬體故障/maintenance 分組。不是每個 region 都有多 AD，所以 HA 不能複製固定「跨三 AZ」模板。[OCI HA guidance](https://docs.oracle.com/en-us/iaas/Content/cloud-adoption-framework/high-availability.htm) 要依目標 region 的 topology 與服務 resilience 設計。

Compute instances 分散 fault domain/AD，放在 Load Balancer 後；Block Volume 與 instance 的 attachment 有 scope 條件，Object Storage 是 regional resource。跨 region DR 需要另一份 network、compute/data replication、DNS/traffic switch、credential 與 runbook，不能只勾 backup。

## VCN 是網路基礎

VCN 包含 regional/AD subnet、route table、security list/network security group、internet/NAT/service/dynamic routing gateway。[Access control](https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/accesscontrol.htm) 又與 compartment policy 交織。應用程式 instance 放 private subnet，administration 走 Bastion/VPN/FastConnect，存取 Object Storage 等 OCI service 優先確認 service gateway 路徑。

Security List 套 subnet，NSG 套 VNIC/resource；把兩者混用卻沒有 ownership，規則會難以稽核。flow log、audit、Cloud Guard、Vault key 與 budget/quota 應在 landing zone 階段啟用。

## OCI 適合誰

Oracle Database/Exadata、bare metal、GPU/HPC、企業 network 與 Oracle license 是核心需求時，OCI 的整合有價值。一般 cloud-native workload 也能跑，但要比較團隊人才、region/product availability、managed-service 生態、support 與 exit path，不只比較 Compute 價格。

驗收時撤銷 dynamic-group policy、失去一個 fault domain，並 restore volume/database、切斷 NAT/service gateway。確認 application、alarm、audit 與 DR runbook 都在正確 compartment 與 region 運作。

## 參考資料

- [OCI core services concepts](https://docs.oracle.com/en-us/iaas/Content/GSG/Concepts/concepts-core.htm)
- [OCI IAM overview](https://docs.oracle.com/en-us/iaas/Content/Identity/Concepts/overview.htm)
- [OCI Compute overview](https://docs.oracle.com/en-us/iaas/Content/Compute/Concepts/computeoverview.htm)
- [OCI network access control](https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/accesscontrol.htm)
- [OCI high availability](https://docs.oracle.com/en-us/iaas/Content/cloud-adoption-framework/high-availability.htm)
