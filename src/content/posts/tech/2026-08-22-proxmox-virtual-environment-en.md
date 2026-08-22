---
title: "Proxmox VE: Combining KVM, LXC, Clusters, Ceph, and Backups On-Premises"
date: 2026-08-22
category: tech
type: deep-dive
tags: [proxmox, virtualization, kvm, lxc, ceph, self-hosting]
lang: en
tldr: "Proxmox VE integrates VMs, containers, clusters, HA, storage, and backup; it simplifies virtualization management while hardware, quorum, networks, capacity, and DR remain yours."
description: "Proxmox VE KVM and LXC, cluster quorum, HA, Ceph, storage, backups, networking, and homelab or enterprise on-premises decisions."
series:
  name: "AI 時代的技術選擇"
  order: 70
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-proxmox-virtual-environment)

[Proxmox Virtual Environment (PVE)](https://pve.proxmox.com/pve-docs/pve-admin-guide.html) is a Debian-based virtualization platform integrating KVM VMs, LXC system containers, web and APIs, clustering, HA, software-defined networks, and multiple storage types. It fits homelabs, small private clouds, edge sites, and enterprises retaining hardware control.

## VMs and LXC have different isolation

KVM VMs have independent kernels for different operating systems, stronger isolation, and appliances. LXC shares the host kernel for fast, dense trusted Linux system workloads. Do not treat an unprivileged LXC as a complete sandbox for untrusted tenants or arbitrary agent code merely because it is a container. Kernel surface, devices, capabilities, and escapes still matter.

Templates, Cloud-Init, APIs, Terraform, or Ansible should make guests rebuildable. Use SSH mutation for diagnosis only and return fixes to images or configuration management.

## The first cluster rule is quorum

PVE uses corosync and pmxcfs for consistent cluster configuration. The [administration guide](https://pve.proxmox.com/pve-docs/pve-admin-guide.html#chapter_pvecm) requires a reliable low-latency cluster network. Restricting writes without majority quorum prevents split brain; it is not a defect.

A two-node cluster needs an explicit third vote or qdevice design. Two machines alone are not HA. Management and corosync, storage replication, migration, and guest traffic need separation or predictable QoS. Avoid shared failures in switches, power, racks, UPS systems, and upstream connectivity.

## HA, Ceph, and backup solve different failures

HA Manager restarts guests elsewhere after node failure and depends on quorum, available storage, spare capacity, and working recovery. It does not provide uninterrupted requests or repair corruption inside applications.

Ceph can distribute storage but needs enough nodes and disks, low-latency networks, failure-domain design, and ongoing health maintenance. Small clusters may be safer with ZFS replication, NFS, or SAN. Snapshots are not offline backups. Use Proxmox Backup Server or another independent, versioned, encrypted, preferably immutable and off-site system, and restore whole guests and files regularly.

## Proxmox is not OpenStack

Proxmox directly manages a virtualization cluster for operators. OpenStack provides a multi-tenant IaaS catalog, quotas, networking and storage APIs, and a larger control plane with much higher operating cost. PVE fits VMs, LXC, and a small operator group; OpenStack fits extensive self-service tenancy and cloud lifecycles.

Remove a node, disconnect corosync, fill storage, and restore into an isolated network. Verify quorum, HA placement, capacity alerts, backup keys, and runbooks under failure.

## References

- [Proxmox VE Administration Guide](https://pve.proxmox.com/pve-docs/pve-admin-guide.html)
- [Proxmox VE cluster manager](https://pve.proxmox.com/pve-docs/pve-admin-guide.html#chapter_pvecm)
- [Proxmox VE HA manager](https://pve.proxmox.com/pve-docs/pve-admin-guide.html#chapter_ha_manager)
- [Proxmox VE storage](https://pve.proxmox.com/pve-docs/pve-admin-guide.html#chapter_storage)
- [Proxmox Backup documentation](https://pbs.proxmox.com/docs/)
