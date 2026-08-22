---
title: "Scaleway: European Cloud Instances, Kapsule, Serverless, and Managed Data"
date: 2026-08-22
category: tech
type: deep-dive
tags: [scaleway, cloud-computing, kubernetes, serverless, european-cloud]
lang: en
tldr: "Scaleway now spans compute, Kapsule, serverless, databases, storage, AI, and IAM rather than only low-cost VMs; maturity and integration still require per-region verification."
description: "Scaleway Instances, Elastic Metal, Kapsule and Kosmos, Serverless Containers and Jobs, databases, VPCs, IAM, and European data governance."
series:
  name: "AI 時代的技術選擇"
  order: 67
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-scaleway-cloud-platform)

[Scaleway](https://www.scaleway.com/en/docs/) is a European public cloud spanning CPU and GPU Instances, Elastic Metal, Kubernetes, serverless containers, functions and jobs, managed and serverless databases, object/block/file storage, VPCs, IAM, secret and key management, queues, events, and generative APIs.

## Compute choices select responsibility

Instances and bare metal expose runtime or host control and leave OS patches, deployments, capacity, monitoring, and recovery to the team. Kapsule manages the Kubernetes control plane for platforms and controllers; Kosmos targets multi-cloud nodes. Neither removes workload policy, RBAC, upgrade compatibility, backups, or SLOs.

[Serverless Containers](https://www.scaleway.com/en/docs/serverless-containers/reference-content/serverless-overview/) fit stateless HTTP and event workloads; Jobs run to completion. Do not force a daemon into a request container or make retried jobs non-idempotent. Determine cold-start, timeout, concurrency, scaling, and downstream connection limits through load tests.

## A broad catalog is not identical in every region

Scaleway's regions are primarily European, with products arriving incrementally. Build a product-by-region matrix for instances and GPUs, Kapsule, databases, storage, KMS, audit, and support. Data sovereignty requires more than headquarters: inspect actual regions, subprocessors, support access, backup and replica locations, and deletion workflows.

[VPC](https://www.scaleway.com/en/docs/vpc/) connects resources through Private Networks, but serverless, databases, and Kubernetes differ in attachment, ingress, and egress. Verify gateways, NAT, ACLs, DNS, load balancers, and private endpoints by direction rather than treating VPC support as one switch.

## Managed data retains shared responsibility

Managed PostgreSQL/MySQL and Serverless SQL own parts of patching, backups, HA, and scaling. Applications own schemas, indexes and queries, connections, tenant authorization, and restore drills. Test idle/resume behavior and PostgreSQL compatibility with real ORM, migration, and latency workloads.

Scaleway fits teams prioritizing European regions and one path from VMs to Kubernetes, serverless, data, and AI. Hyperscaler-specific dependencies and deeper global footprints require replacement analysis. Deploy a bad revision, restore a database, revoke an IAM application, and break a Private Network to validate Cockpit, alerts, and runbooks.

## References

- [Scaleway documentation](https://www.scaleway.com/en/docs/)
- [Scaleway Kubernetes](https://www.scaleway.com/en/docs/containers/kubernetes/)
- [Scaleway Serverless Containers](https://www.scaleway.com/en/docs/serverless-containers/reference-content/serverless-overview/)
- [Scaleway VPC](https://www.scaleway.com/en/docs/vpc/)
- [Scaleway Managed Databases](https://www.scaleway.com/en/docs/managed-databases-for-postgresql-and-mysql/)
