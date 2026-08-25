---
title: "CoreWeave: An AI Cloud Built from Kubernetes, GPU Fabric, and Storage"
date: 2026-08-22
category: tech
type: deep-dive
tags: [coreweave, gpu-cloud, kubernetes, ai-infrastructure, inference]
lang: en
tldr: "CoreWeave is more than rented GPUs: it combines Kubernetes, GPU networking, storage, and inference into AI infrastructure, while platform engineering and capacity governance remain yours."
description: "CoreWeave Kubernetes Service, Slurm, storage, serverless and dedicated inference, and tradeoffs against hyperscalers and model APIs."
series:
  name: "Technology Choices in the AI Era"
  order: 57
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-coreweave-ai-cloud)

[CoreWeave](https://docs.coreweave.com/) is cloud infrastructure focused on AI and HPC. It is more than hourly GPUs: the platform includes CoreWeave Kubernetes Service (CKS), Slurm on Kubernetes, object/file/block storage, VPCs, and serverless or dedicated inference.

## CKS is a platform, not a model API

CKS integrates a Kubernetes control plane, GPU nodes, and high-performance networking for distributed training, self-hosted inference, and shared platforms. Teams still own workload specs, requests and limits, queues, checkpoints, autoscaling, RBAC, and rollouts. Without a Kubernetes platform owner, GPU access can still stall on scheduling and recovery.

For training, test GPU topology, collective communication, shared-filesystem throughput, and checkpoint restore—not only a single-GPU benchmark. Tier data: durable corpora in object storage, multi-node hot data on file storage, and local or ephemeral disks as cache. A bottleneck anywhere leaves expensive GPUs waiting for I/O.

## Inference has two responsibility boundaries

Serverless inference reduces idle capacity for request-driven workloads. Dedicated inference suits steady traffic, latency SLOs, specific hardware, and isolation. Measure cold and model-load time, tokens per second, batching, queue delay, errors, and cost per successful output.

Hourly GPU price is insufficient. If a serverless wrapper blocks runtime, parallelism, or observability requirements, return to CKS. If a product only calls a few foundation models, a managed model API is simpler than owning weights, runtimes, and capacity.

## Capacity, portability, and failure tests

The same GPU model does not make clusters equivalent. Regional capacity, reservations, interconnect, CPU/RAM ratios, storage egress, support, and quotas affect delivery. Terraform and Kubernetes manifests, OCI images, portable checkpoints, and S3-compatible artifacts reduce switching cost, but network and performance tuning remain provider-specific.

Fail a node, storage mount, and network path before launch. Confirm jobs resume from checkpoints and inference drains and reschedules. CoreWeave fits teams for which GPUs are production infrastructure; small experiments and API-first products may prefer RunPod, Replicate, or a general hyperscaler.

## References

- [CoreWeave documentation](https://docs.coreweave.com/)
- [CoreWeave Kubernetes Service](https://docs.coreweave.com/docs/products/cks)
- [CoreWeave storage](https://docs.coreweave.com/docs/products/storage)
- [CoreWeave Inference](https://docs.coreweave.com/docs/products/inference)
