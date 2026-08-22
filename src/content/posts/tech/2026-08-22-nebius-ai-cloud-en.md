---
title: "Nebius AI Cloud: A Full Platform for GPU Clusters, Managed Kubernetes, and Serverless AI"
date: 2026-08-22
category: tech
type: deep-dive
tags: [nebius, gpu-cloud, kubernetes, ai-infrastructure, inference]
lang: en
tldr: "Nebius combines GPU VMs and clusters, Kubernetes, Slurm, storage, and Serverless AI; choose the responsibility layer before comparing hardware and price."
description: "Nebius AI Cloud GPU compute, Managed Kubernetes, Soperator, storage, Serverless AI, identity, and portability."
series:
  name: "AI 時代的技術選擇"
  order: 60
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-nebius-ai-cloud)

[Nebius AI Cloud](https://docs.nebius.com/) is a full cloud centered on AI workloads. Its infrastructure includes GPU VMs, InfiniBand GPU clusters, disk/file/object storage, and VPCs. Managed Kubernetes and Slurm-based Soperator provide orchestration; Serverless AI endpoints and jobs, MLflow, and packaged applications sit above them.

## Choose responsibility before GPUs

VMs provide maximum runtime control and return patching, driver compatibility, process supervision, and recovery to the team. Managed Kubernetes fits shared platforms and multi-service inference. Soperator fits queued distributed training and HPC. Serverless AI further manages container endpoint and job lifecycles.

Use an endpoint for a straightforward model API. Descend to clusters only for custom scheduling, multi-node collectives, long checkpointed work, or complex sidecars. Choosing low-level IaaS too early turns product teams into GPU platform teams.

## Data paths determine useful GPU utilization

Datasets, images, weights, checkpoints, and online caches have different lifecycles. Store durable artifacts in S3-compatible object storage, multi-node hot data on shared filesystems, and rebuildable caches on local NVMe. Benchmark real shards and restore paths; low GPU utilization may be an I/O problem.

For Kubernetes or Slurm, test topology, RDMA, node remediation, queue fairness, and checkpoint-on-preemption. For serverless endpoints, measure model loading, cold starts, queue delay, batching, maximum replicas, and output durability.

## Identity, networks, and portability

Give each workload a separate least-privilege service account and keep console or API keys out of images. Draw private subnets, public endpoints, NAT, registries, object storage, and observability paths. One cloud does not make traffic private or egress-free automatically.

OCI images, Terraform, Kubernetes manifests, portable checkpoints, and standard object layouts reduce lock-in. GPU topology, managed APIs, and performance tuning remain provider-specific. Nebius fits teams growing from research into clusters and serving on one AI cloud; compare RunPod for isolated prototypes and Replicate for model-first APIs.

Kill a GPU node, disconnect shared storage, revoke service identity, and scale an endpoint from zero. The platform is ready only when recovery, audit, quotas, and spending limits remain visible.

## References

- [Nebius AI Cloud documentation](https://docs.nebius.com/)
- [Nebius Compute](https://docs.nebius.com/compute/)
- [Nebius Managed Kubernetes](https://docs.nebius.com/kubernetes/)
- [Nebius Serverless AI](https://docs.nebius.com/serverless/)
- [Nebius Object Storage](https://docs.nebius.com/object-storage/)
