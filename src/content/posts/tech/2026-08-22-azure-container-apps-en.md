---
title: "Azure Container Apps: Serverless Containers with Revisions, KEDA, and Environments"
date: 2026-08-22
category: tech
type: deep-dive
tags: [azure, container-apps, serverless, containers, keda]
lang: en
tldr: "Azure Container Apps hides Kubernetes while exposing HTTP/TCP ingress, revisions, KEDA scaling, jobs, and Dapr; replica concurrency, event idempotency, VNet design, and identity remain yours."
description: "Azure Container Apps environments, revisions, traffic splitting, KEDA scaling, jobs, Dapr, networking, and AKS/App Service tradeoffs."
series:
  name: "AI 時代的技術選擇"
  order: 55
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-azure-container-apps)

[Azure Container Apps](https://learn.microsoft.com/azure/container-apps/overview) is a serverless container platform that does not expose a Kubernetes control plane. It supports HTTP/TCP ingress, background apps, event/scheduled/on-demand jobs, revisions, traffic splitting, Dapr, and KEDA scaling. It fits teams wanting containers and microservices without operating AKS.

## Environments and revisions define boundaries

Multiple container apps can share an environment's network, logging, and internal DNS. That is a blast-radius and governance choice. Separate workloads with different trust, networking, or lifecycle requirements instead of grouping everything for convenience.

A [revision](https://learn.microsoft.com/azure/container-apps/revisions) is an immutable snapshot. Single-revision mode fits ordinary replacement; multiple revisions enable blue/green, canary, and A/B traffic. Database migrations must remain forward- and backward-compatible because two revisions may serve simultaneously.

## KEDA measures signals, not business capacity

[Scaling rules](https://learn.microsoft.com/azure/container-apps/scale-app) use HTTP/TCP concurrency, CPU/memory, or KEDA scalers such as Service Bus, Event Hubs, Kafka, and Redis. Scaling to zero saves idle cost but adds cold starts; minimum replicas trade money for latency and availability.

Queue length divided by target messages is only an estimate. Processing time, prefetch, lock timeout, downstream quotas, and failure rate change safe capacity. Consumers need idempotency and maximum replicas that protect databases. Use Container Apps Jobs for run-to-completion work instead of letting a service process exit and restart.

## Dapr is optional

A Dapr sidecar provides service invocation, pub/sub, state, and other building blocks. It also adds versions, resources, latency, and debugging layers. Enable it when cross-language abstractions and its component model solve a current problem, not as a tax on a simple HTTP API.

Use managed identity for Azure resources and keep only bootstrap material in secrets. Test external and internal ingress, VNet integration, private endpoints, DNS, and egress separately. Connectivity inside an environment is not resource authorization.

## Container Apps, App Service, or AKS

Choose Container Apps for event-driven workers, multi-revision microservices, sidecars, and scale-to-zero. Choose App Service for conventional web runtimes, deployment slots, and an existing enterprise operating model. Choose AKS for Kubernetes APIs, operators, cluster extensions, or node control. Redeliver queue messages, split revision traffic, revoke managed identity, and test scale-from-zero.

## References

- [Azure Container Apps overview](https://learn.microsoft.com/azure/container-apps/overview)
- [Revisions in Azure Container Apps](https://learn.microsoft.com/azure/container-apps/revisions)
- [Set scaling rules](https://learn.microsoft.com/azure/container-apps/scale-app)
- [Jobs in Azure Container Apps](https://learn.microsoft.com/azure/container-apps/jobs)
- [Networking in Azure Container Apps](https://learn.microsoft.com/azure/container-apps/networking)
