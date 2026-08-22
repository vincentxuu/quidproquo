---
title: "Google Cloud Run: Services, Jobs, and Worker Pools Have Different Container Lifecycles"
date: 2026-08-22
category: tech
type: deep-dive
tags: [google-cloud, cloud-run, serverless, containers, paas]
lang: en
tldr: "Cloud Run is more than an HTTP container platform: choose request-serving, run-to-completion, or always-on pull work first, then design concurrency, identity, and scaling."
description: "Google Cloud Run services, jobs, worker pools, container contracts, concurrency, revisions, networking, and GKE tradeoffs."
series:
  name: "AI 時代的技術選擇"
  order: 53
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-google-cloud-run)

[Cloud Run](https://cloud.google.com/run/docs/overview/what-is-cloud-run) is Google Cloud's fully managed application platform. It has three resource types: services receive HTTP or events, jobs run to completion, and worker pools handle persistent pull-based background work. They share a container foundation but not a lifecycle.

## Choose the lifecycle before scaling

A service listens on the platform port and routes traffic to revisions. It scales on requests and other signals, potentially to zero. Each instance can process concurrent requests, so load-test the setting. An async Node server may benefit from higher concurrency; CPU-heavy inference may need less. Cap instances to protect Cloud SQL and external APIs.

A [job](https://cloud.google.com/run/docs/create-jobs) does not listen on a port. One or more tasks run to completion. Scheduled migrations, media conversion, and backfills fit jobs; tasks need indexed partitioning, retries, and idempotency. A persistent Kafka consumer should not masquerade as an HTTP request. Worker pools match its pull lifecycle.

## A revision is a deployment snapshot, not a host

Image or configuration changes create immutable revisions that support gradual traffic and rollback. Containers remain stateless, handle termination, and store durable data in Cloud SQL, Firestore, Cloud Storage, or another service. Neither local files nor instance identity are durable.

The container contract defines startup, ports, signals, and filesystem behavior. Supporting OCI images does not imply privileged containers, host networking, or every Kubernetes primitive. DaemonSets, custom schedulers, special devices, or cluster policy point toward GKE.

## Identity and networking are separate boundaries

Invoker IAM controls who calls a service; its service account controls which Google APIs the workload calls. Avoid downloaded long-lived keys and use service identity. A public service still needs end-user authorization, rate limits, and input validation.

For private VPCs, Cloud SQL, and internet egress, verify direct VPC egress or connectors, routes, firewalls, NAT, and DNS separately. CPU allocation, minimum instances, startup probes, and concurrency jointly affect cold starts, background work, and cost.

## Cloud Run or GKE

Prefer Cloud Run for standard HTTP APIs, webhooks, event handlers, batch jobs, and simple workers. Pay GKE's platform cost only when Kubernetes APIs, ecosystem controllers, multi-container topology, privileges, or node control are real requirements. Saturate concurrency, deploy a broken revision, disconnect a dependency, and rerun a job to verify limits, rollback, timeouts, and idempotency.

## References

- [What is Cloud Run](https://cloud.google.com/run/docs/overview/what-is-cloud-run)
- [Cloud Run container runtime contract](https://cloud.google.com/run/docs/container-contract)
- [Create Cloud Run jobs](https://cloud.google.com/run/docs/create-jobs)
- [Configure maximum concurrency](https://cloud.google.com/run/docs/configuring/concurrency)
- [Cloud Run service identity](https://cloud.google.com/run/docs/securing/service-identity)
