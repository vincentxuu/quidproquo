---
title: "Crusoe Cloud: From GPU VMs and Managed Kubernetes to Managed AI"
date: 2026-08-22
category: tech
type: deep-dive
tags: [crusoe, gpu-cloud, kubernetes, slurm, ai-infrastructure]
lang: en
tldr: "Crusoe offers both Infrastructure Cloud and Managed AI: GPU VMs and clusters provide control, while serverless and dedicated inference provide higher abstractions with different responsibilities."
description: "Crusoe GPU VMs, CMK, Slurm, InfiniBand, ephemeral storage, Managed AI inference, and AI-cloud selection."
series:
  name: "Technology Choices in the AI Era"
  order: 61
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-crusoe-ai-cloud)

[Crusoe Cloud](https://docs.crusoecloud.com/) divides its platform into Infrastructure Cloud and Managed AI. Infrastructure provides GPU VMs, Crusoe Managed Kubernetes (CMK), Slurm, networks, and storage for self-managed training and serving. Managed AI provides higher-level serverless inference, dedicated deployments, and fine-tuning.

## VMs, CMK, and Slurm solve different problems

VMs fit single-node research, custom runtimes, and direct debugging while leaving OS, libraries, processes, and recovery to the team. The [VM documentation](https://docs.crusoecloud.com/compute/virtual-machines/overview/) explicitly treats local GPU-instance storage as ephemeral. Checkpoints and datasets cannot live only on NVMe.

[CMK](https://docs.crusoecloud.com/orchestration/cmk/overview/) manages the Kubernetes control plane and can install GPU and network operators plus CSI. Teams still own node pools, Pod requests, rollouts, RBAC, policy, and application SLOs. Slurm fits queued fair-share distributed batch; Kubernetes fits services and platforms. Containers do not erase scheduler semantics.

## Benchmark topology, not just GPU names

PCIe, NVLink or fabric, InfiniBand/RoCE, CPU/RAM, and storage throughput change scaling efficiency on identical GPUs. Run framework-level all-reduce, dataset reads, checkpoint restores, and node failures. Command Center utilization, health, and topology views help diagnosis, but teams still define alarms and runbooks.

Managed AI suits products that do not want a serving control plane. Serverless trades idle savings for cold starts; dedicated deployments trade fixed capacity for latency and isolation. Compare queueing, model loading, batching, output correctness, and cost per successful request.

## Validate capacity and sustainability separately

Crusoe emphasizes energy and AI infrastructure, but procurement still depends on evidence for regional capacity, reservations, SLAs, support, networking, data residency, and egress. Sustainability claims need auditable methodology rather than replacing workload benchmarks.

Crusoe is compelling when direct clusters and Managed AI must coexist. Compare Replicate for a quick model API and hyperscalers for broader service integration. Fail a node, delete ephemeral cache, and disconnect storage to validate checkpoints, rescheduling, and inference failover.

## References

- [Crusoe Cloud documentation](https://docs.crusoecloud.com/)
- [Crusoe virtual machines](https://docs.crusoecloud.com/compute/virtual-machines/overview/)
- [Crusoe Managed Kubernetes](https://docs.crusoecloud.com/orchestration/cmk/overview/)
- [Spin up a GPU cluster](https://docs.crusoecloud.com/quickstart/spin-up-gpu-cluster/)
- [Crusoe infrastructure topology](https://docs.crusoecloud.com/command-center/topology/)
