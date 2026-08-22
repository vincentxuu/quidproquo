---
title: "Koyeb: A Global Serverless Model of Apps, Services, and Instances"
date: 2026-08-22
category: tech
type: deep-dive
tags: [koyeb, paas, serverless, cloud-computing, devops]
lang: en
tldr: "Koyeb groups Services in Apps, runs revisions as Instances in selected regions, and integrates global routing, autoscaling, private discovery, and CPU or GPU compute."
description: "Koyeb Apps, Services, Instances, deployments, regions, autoscaling, scale-to-zero, networking, and storage boundaries."
series:
  name: "AI 時代的技術選擇"
  order: 77
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-koyeb-serverless-platform)

[Koyeb](https://www.koyeb.com/docs) deploys Git repositories or container images across selectable regions. CPU and GPU Instances, edge routing, TLS, a service mesh, autoscaling, and scale-to-zero place it between repository-first PaaS and regional container platforms.

## Do not conflate App, Service, and Instance

An App namespaces related Services. A Service declares source, build, command, ports, environment, regions, instance type, and scaling policy; a configuration change creates a new deployment revision. An Instance is the microVM actually running that revision in a region.

“One global App” therefore does not make one process exist everywhere. Choose regions and counts explicitly, and design Services to be stateless, replaceable, and termination-aware. Web Services accept traffic; worker workloads need queue semantics, retries, idempotency, and graceful shutdown.

## Routing and the private mesh solve connectivity

Koyeb's edge network routes public requests to healthy Service Instances and manages TLS. The [service mesh](https://www.koyeb.com/docs/reference/service-mesh) provides private discovery and encrypted connections for internal APIs, workers, and database proxies.

Global load balancing does not make sessions, caches, or databases consistent across regions. Externalize mutable state and choose regions by latency and residency. If the primary database is regional, distant compute can merely add round trips. Private endpoints still require application authentication and least privilege.

## Understand autoscaling signals and cold starts

[Autoscaling](https://www.koyeb.com/docs/run-and-scale/autoscaling) adjusts Instances between configured bounds using CPU, memory, or request-rate targets. With multiple factors, capacity satisfies the largest computed requirement. It is a capacity controller, not application backpressure: queue depth, third-party limits, and database connection budgets need separate controls.

[Scale-to-Zero](https://www.koyeb.com/docs/run-and-scale/scale-to-zero) can stop a public Service and wake it on traffic, but it remains a public preview with cold-start, protocol, and long-lived-connection limits. Keep a minimum Instance for latency-sensitive APIs or measure first. A worker cannot infer “no work” from absent HTTP traffic.

Treat Instance filesystems as ephemeral. Use platform volumes or external managed storage for persistence, checking regional, instance, replica, and deployment compatibility. One attached disk is not a replicated database; test backup and restore.

Koyeb fits teams wanting global APIs, CPU/GPU inference, previews, and scaling without operating a cluster. Compare Vercel or Netlify for frontend-only work, Railway or Render for multi-service developer experience, and Fly.io for programmable VM lifecycles. Test wake-from-zero, regional outage, maximum-replica exhaustion, dependency saturation, rollback, and state restore.

## References

- [Koyeb documentation](https://www.koyeb.com/docs)
- [Koyeb applications](https://www.koyeb.com/docs/reference/apps)
- [Koyeb services](https://www.koyeb.com/docs/reference/services)
- [Koyeb service mesh](https://www.koyeb.com/docs/reference/service-mesh)
- [Koyeb autoscaling](https://www.koyeb.com/docs/run-and-scale/autoscaling)
- [Koyeb scale-to-zero](https://www.koyeb.com/docs/run-and-scale/scale-to-zero)
