---
title: "Hetzner Cloud: Cheap VMs Mean Owning the Entire Operating System"
date: 2026-08-22
category: tech
type: deep-dive
tags: [hetzner, cloud-computing, virtual-machine, infrastructure, self-hosting]
lang: en
tldr: "Hetzner Cloud offers lean IaaS through servers, networks, volumes, load balancers, and firewalls; its price advantage is real only after patches, HA, backups, egress, and on-call are counted."
description: "Hetzner Cloud Servers, private networks, volumes, load balancers, firewalls, backups, placement groups, and self-hosting responsibilities."
series:
  name: "AI 時代的技術選擇"
  order: 64
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-hetzner-cloud)

[Hetzner Cloud](https://docs.hetzner.com/cloud/) is lean IaaS: cloud servers, private networks, volumes, load balancers, firewalls, primary IPs, snapshots and backups, plus APIs and Terraform. It suits Linux-capable teams wanting transparent building blocks and cost control, but it does not operate an application platform for them.

## Creating a server is not a golden path

[Server creation](https://docs.hetzner.com/cloud/servers/getting-started/creating-a-server/) takes minutes. Production still needs cloud-init or images, non-root SSH, security updates, host firewalls, logs and metrics, secret delivery, immutable deployment, and rebuild procedures. Manual repair creates unreproducible snowflakes.

Servers should be disposable. Keep application state on volumes, object stores, or databases, but a block volume is not a backup. Test retention, coverage, and restore for backups and snapshots; use consistent dumps or PITR for databases. Prove RPO and RTO through drills.

## HA is more than a second server

Two application servers behind a load balancer may still share a failure domain. [Placement Groups](https://docs.hetzner.com/cloud/placement-groups/overview/) help spread instances, while databases, volumes, regions, DNS, and control-plane dependencies need separate review. Isolate east-west traffic on private networks, expose only the load balancer, administer through VPNs or bastions, and default-deny firewalls.

Autoscaling, managed databases, queues, secret managers, and cross-region orchestration have a smaller product surface than hyperscalers and may require self-hosted or third-party systems. That engineering and on-call work belongs beside the low bill.

## Where it fits

Stable web services, CI runners, self-hosted tools, homelab extensions, and workloads with accepted operational ownership fit well. DigitalOcean, a hyperscaler, or a PaaS may lower total cost for broad managed services, enterprise IAM, complex compliance, or global databases.

Count compute, IPv4, volumes, snapshots, traffic, support, and engineering time. Delete a server, restore a volume and database, and simulate host failure to verify IaC, placement, health checks, DNS, and runbooks.

## References

- [Hetzner Cloud documentation](https://docs.hetzner.com/cloud/)
- [Creating a Cloud Server](https://docs.hetzner.com/cloud/servers/getting-started/creating-a-server/)
- [Hetzner Cloud Networks](https://docs.hetzner.com/cloud/networks/overview/)
- [Hetzner Cloud Volumes](https://docs.hetzner.com/cloud/volumes/overview/)
- [Hetzner Placement Groups](https://docs.hetzner.com/cloud/placement-groups/overview/)
