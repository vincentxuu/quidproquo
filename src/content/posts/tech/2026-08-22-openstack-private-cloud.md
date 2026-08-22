---
title: "OpenStack：不是一套虛擬化 UI，而是一組要長期營運的 Cloud Services"
date: 2026-08-22
category: tech
type: deep-dive
tags: [openstack, private-cloud, iaas, virtualization, infrastructure]
lang: zh-TW
tldr: "OpenStack 以 Keystone、Nova、Neutron、Glance、Placement、Cinder 等服務提供多租戶 IaaS；採用它等於建立 cloud platform team，而不是安裝完成就結束。"
description: "介紹 OpenStack 核心服務、control/data plane、deployment tooling、multi-tenancy、HA、upgrade 與 Proxmox/hyperscaler 選型。"
series:
  name: "AI 時代的技術選擇"
  order: 71
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-openstack-private-cloud-en)

[OpenStack](https://docs.openstack.org/) 是 open-source IaaS cloud operating system，用 API 與 dashboard 管理 datacenter 的 compute、network、image、identity 與 storage。它不是單一 daemon，也不是在 KVM 上加一個漂亮 UI；每項能力由可獨立部署與升級的 service 組成。

## 最小 cloud 已經是 distributed system

[官方最小服務](https://docs.openstack.org/install-guide/openstack-services.html) 包含 Keystone identity、Glance image、Placement resource inventory、Nova compute 與 Neutron networking，通常再加 Horizon dashboard 與 Cinder block storage。production 還會需要 database、message queue、load balancer、DNS、key manager、telemetry、object/file storage 等元件。

Nova 在 compute node 透過 hypervisor 建 instance；Neutron 以 agent/plugin 實作 virtual network；Cinder driver 連不同 storage backend。API 看似一致，實際效能、HA 與 feature support 取決於 hypervisor、SDN、storage、driver 與硬體組合。

## Multi-tenancy 是價值，也是安全面

Keystone domain/project/user/group/role 與 service catalog 建立 tenant 邊界，quota 限制 resource consumption。network isolation、security group、image provenance、metadata service、secret/key、host aggregate 與 admin API 都要 threat model。控制面 credential 一旦過寬，影響的是整個 cloud，不只一台 VM。

API self-service 也意味 capacity management。flavor、placement trait、availability zone、quota 與 scheduler 要反映實際 CPU overcommit、NUMA、GPU、network bandwidth 與 storage IOPS，否則「可以建立」不代表 workload 能達 SLO。

## 不要手裝 production

[Installation Guide](https://docs.openstack.org/install-guide/overview.html) 明說範例架構是學習用 PoC，不是 production。實務使用 Kolla-Ansible、OpenStack-Ansible 或 vendor distribution，把 package/container、configuration、certificate、database migration 與 HA topology 納入 automation。

選 release 與 deployment tool 後要有固定 upgrade train。每次升級先讀各 project release note，在近似 production 的環境測 API/DB migration、RPC compatibility、live migration、Neutron/Cinder driver 與 rollback。cloud 上的 tenant VM 還活著，不代表 control plane upgrade 成功。

## OpenStack、Proxmox 或 public cloud

需要大量 self-service tenant、API-compatible private IaaS、特殊硬體、資料主權或既有 datacenter 規模時，OpenStack可能合理。只有幾個 cluster 與管理員時，Proxmox 更直接；沒有足夠 platform/SRE team 或硬體規模時，public cloud/managed private cloud 的總成本通常較低。

採用前用 failure drill 驗證 controller/message queue/database、compute host、Neutron path 與 Cinder backend。再實際升級一個 release、restore control-plane database，並確認 tenant workload、quota、audit、billing/showback 與 support runbook 都可運作。

## 參考資料

- [OpenStack documentation](https://docs.openstack.org/)
- [OpenStack Installation Guide overview](https://docs.openstack.org/install-guide/overview.html)
- [OpenStack core services](https://docs.openstack.org/install-guide/openstack-services.html)
- [OpenStack Nova documentation](https://docs.openstack.org/nova/latest/)
- [OpenStack deployment guides](https://docs.openstack.org/2026.1/deploy/)
- [OpenStack security guide](https://docs.openstack.org/security-guide/)
