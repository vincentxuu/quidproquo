---
title: "Proxmox VE：把 KVM、LXC、Cluster、Ceph 與 Backup 組成地端平台"
date: 2026-08-22
category: tech
type: deep-dive
tags: [proxmox, virtualization, kvm, lxc, ceph, self-hosting]
lang: zh-TW
tldr: "Proxmox VE 整合 VM、container、cluster、HA、storage 與 backup；它降低虛擬化管理門檻，但 hardware、quorum、network、capacity 與 DR 仍由你負責。"
description: "介紹 Proxmox VE 的 KVM/LXC、cluster quorum、HA、Ceph、storage、backup、網路與 homelab/企業地端選型。"
series:
  name: "AI 時代的技術選擇"
  order: 70
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-proxmox-virtual-environment-en)

[Proxmox Virtual Environment（PVE）](https://pve.proxmox.com/pve-docs/pve-admin-guide.html) 是 Debian-based virtualization platform。它把 KVM VM、LXC system container、Web/API、cluster、HA、software-defined network 與多種 storage 整合在一起，適合 homelab、中小型私有雲、edge site 與希望掌握硬體的企業環境。

## VM 與 LXC 是不同隔離模型

KVM VM 有獨立 kernel，適合不同 OS、強隔離與傳統 appliance；LXC 共用 host kernel，啟動快、密度高，適合可信任的 Linux system workload。不要把 untrusted tenant 或任意 agent code 只因「也是 container」就放進 unprivileged LXC，然後視為完整 sandbox。還要考慮 kernel attack surface、device mount、capability 與 escape 防護。

template、Cloud-Init、API/Terraform/Ansible 應讓 VM/CT 可重建。SSH 到 guest 手改只能用於診斷，修正要回到 image/configuration management。

## Cluster 的第一條規則是 quorum

PVE cluster 透過 corosync 與 pmxcfs 維持一致設定。[管理指南](https://pve.proxmox.com/pve-docs/pve-admin-guide.html#chapter_pvecm) 要求可靠、低延遲的 cluster network；失去多數 quorum 時，限制寫入是避免 split-brain，不是 bug。

兩節點 cluster 需要明確的第三票/qdevice 設計，不能把「有兩台」等同 HA。management/corosync、storage replication、migration 與 guest traffic 應依 throughput/latency 分流或至少有可預測 QoS。交換器、電源、rack、UPS 與上游網路也要避免共同故障。

## HA、Ceph 與 Backup 解三種不同問題

HA manager 在 node 失敗後把 guest 重啟到其他 node，需要 quorum、可用 storage、足夠 spare capacity 與可運作的 fencing/recovery。它不保證 request 無中斷，也不修復 guest 內 application corruption。

Ceph 可提供分散式 storage，但需要足夠 node/disk、低延遲 network、failure-domain 規劃與持續 scrub/health 維護。小型 cluster 未必比簡單 ZFS replication/NFS/SAN 更可靠。storage snapshot 也不是離線 backup。使用 Proxmox Backup Server 或其他系統做獨立、版本化、加密、最好不可變/異地的備份，定期 restore VM、CT 與單檔。

## Proxmox 不是 OpenStack

Proxmox 強在管理一組虛擬化 cluster，API 與 UI 對 operator 直接。OpenStack 則提供 multi-tenant IaaS service catalog、quota、network/storage API 與更大規模 control plane，操作成本也高很多。只需 VM/LXC 與少數管理員時，PVE 通常更合適；需要大量 self-service tenant、cloud API 與跨 datacenter lifecycle 才考慮 OpenStack。

驗收要拔掉 cluster node、斷一條 corosync link、塞滿 storage，並 restore 到隔離 network。再確認 quorum、HA placement、capacity alert、backup encryption key 與 runbook 都可用。

## 參考資料

- [Proxmox VE Administration Guide](https://pve.proxmox.com/pve-docs/pve-admin-guide.html)
- [Proxmox VE cluster manager](https://pve.proxmox.com/pve-docs/pve-admin-guide.html#chapter_pvecm)
- [Proxmox VE HA manager](https://pve.proxmox.com/pve-docs/pve-admin-guide.html#chapter_ha_manager)
- [Proxmox VE storage](https://pve.proxmox.com/pve-docs/pve-admin-guide.html#chapter_storage)
- [Proxmox Backup documentation](https://pbs.proxmox.com/docs/)
