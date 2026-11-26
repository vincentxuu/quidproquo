---
title: "Runpod: GPU Pods and Serverless Endpoints Are Different Products"
date: 2026-08-22
category: tech
type: deep-dive
tags: [runpod, gpu-cloud, serverless, inference, machine-learning]
lang: en
tldr: "Runpod Pods fit interactive and persistent GPU work, while Serverless fits queued or load-balanced inference; choosing incorrectly mixes persistence, cold starts, and retry semantics."
description: "Runpod Pods, network volumes, Serverless queue and load-balancing endpoints, worker scaling, cold starts, and production boundaries."
series:
  name: "Technology Choices in the AI Era"
  order: 59
draft: false
---

> :globe: [中文版](/posts/tech/2026-08-22-runpod-gpu-cloud)

[Runpod](https://docs.runpod.io/api-reference/overview) exposes two main abstractions. A Pod is an SSH-accessible persistent GPU instance; a Serverless endpoint starts and stops container workers around requests. Choose Pods for notebooks, training, or self-managed daemons and Serverless for inference with a clear request or job contract.

The brand has been styled Runpod, with a lowercase p, since 2025-06. Scripts that automate Pods or endpoints through the API should move to [REST API v2](https://docs.runpod.io/release-notes): v1 was retired on 2026-11-15, and the GraphQL API is scheduled to retire in early 2027.

## Pods require reproducibility and storage discipline

A Pod lets you choose an image, GPU, volume, and ports, making experiments fast. Risks include manual environment drift, data left on container disks, and discovering volume or regional constraints during shutdown. Version templates and images, store checkpoints on network or object storage, and keep API and SSH keys out of notebooks.

GPU model and regional capacity vary. Multi-GPU training depends on interconnect, shared storage, and framework behavior, not card count alone. A dedicated GPU cloud may fit better when cluster topology, SLAs, and enterprise networking must remain stable.

## Serverless splits queue and load-balancing modes

The [endpoint documentation](https://docs.runpod.io/serverless/endpoints/overview) distinguishes queue-based from load-balancing endpoints. Queues provide synchronous or asynchronous jobs, backlog, and automatic retries for batch and longer predictions. Load balancing sends HTTP directly to workers for streaming and low latency, leaving backlog, retries, and protocol behavior to the app.

Retries require idempotent handlers. Map job IDs to idempotency records and copy outputs promptly to durable storage rather than relying on temporary result retention. Execution timeout, job TTL, and client timeout are separate clocks and need separate tests.

## Cold starts are model-loading problems

Starting from zero means pulling an image, loading weights, and initializing CUDA. A model weighing tens of gigabytes cannot wake like a tiny function. [Endpoint settings](https://docs.runpod.io/serverless/endpoints/endpoint-configurations) include active and maximum workers, model caches, GPU priority, and network volumes. Warm workers reduce latency but create idle cost. Measure p95 queue plus initialization plus inference, not kernel time alone.

Runpod fits prototypes, elastic GPUs, and teams packaging their own models. Replicate offers a curated model API; CoreWeave, Lambda, and Nebius target larger fixed clusters, Kubernetes, and high-speed fabrics. Redeliver jobs, remove the preferred GPU, and time out workers to verify fallback, spending limits, and output durability.

## Update history

- 2026-11-23: Updated the brand name to Runpod; added that REST API v1 is retired and the GraphQL API will be, so automation should use REST API v2.

## References

- [Runpod product updates (release notes)](https://docs.runpod.io/release-notes)

- [Runpod API overview](https://docs.runpod.io/api-reference/overview)
- [Runpod Serverless overview](https://docs.runpod.io/serverless/overview)
- [Runpod endpoint types](https://docs.runpod.io/serverless/endpoints/overview)
- [Runpod endpoint settings](https://docs.runpod.io/serverless/endpoints/endpoint-configurations)
