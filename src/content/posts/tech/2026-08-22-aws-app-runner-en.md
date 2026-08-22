---
title: "AWS App Runner: The Shortest AWS Path from Source or Container to a Web Service"
date: 2026-08-22
category: tech
type: deep-dive
tags: [aws, app-runner, paas, containers, cloud-computing]
lang: en
tldr: "App Runner packages build, deployment, TLS, load balancing, and autoscaling as a web service, trading orchestration control for a simpler platform with explicit VPC, instance, and health boundaries."
description: "AWS App Runner source and image deployment, autoscaling, health checks, VPC connectivity, observability, and tradeoffs against Fargate and Lambda."
series:
  name: "AI 時代的技術選擇"
  order: 52
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-aws-app-runner)

[AWS App Runner](https://docs.aws.amazon.com/apprunner/latest/dg/architecture.html) turns a repository or ECR image into an HTTPS web service and manages build/deployment, instances, load balancing, and autoscaling. It requires much less assembly than ECS with Fargate and behaves more like an AWS-native PaaS.

## Source code and source image are separate supply chains

Source-code mode lets App Runner build the application; source-image mode deploys from ECR or ECR Public. The [image documentation](https://docs.aws.amazon.com/apprunner/latest/dg/service-source-image.html) leaves image patching to the user. Production should pin immutable digests, scan vulnerabilities, create an SBOM, and decide whether automatic deployment fits change control.

The service listens on its configured port, remains stateless, and stores uploads and durable state elsewhere. Do not assume an instance persists or use its local filesystem across deployments.

## Autoscaling centers on concurrency

App Runner scales around requests per instance plus minimum and maximum sizes. Set concurrency too high and latency, memory, or connection pools saturate first; set it too low and instance cost rises. Load-test each CPU/memory shape, choose safe concurrency, and cap maximum size to protect the database.

[Health checks](https://docs.aws.amazon.com/apprunner/latest/dg/manage-configure-healthcheck.html) can use TCP or HTTP. Production should expose a lightweight HTTP endpoint that proves the process can serve without performing expensive full dependency checks every time. Application timeouts, circuit breakers, and metrics cover dependencies that readiness cannot express.

## Separate ingress from egress

App Runner provides a public endpoint by default and can configure private ingress. A VPC connector enables outbound access to private resources such as RDS or ElastiCache. It does not make every path private or guarantee public internet egress. Draw ingress, DNS, security groups, NAT or endpoints, and database routes individually.

[Observability](https://docs.aws.amazon.com/apprunner/latest/dg/monitor.html) integrates CloudWatch logs and metrics, EventBridge, CloudTrail, and X-Ray. Monitor requests, latency, status codes, active instances, deployment events, and application saturation, and include deployment revision in logs and traces.

## When not to use App Runner

It fits a stateless HTTP API, internal tool, or prototype when the team already uses AWS. Fargate/ECS is more natural for multi-container tasks, sidecars, workers, cron, detailed load-balancer rules, service meshes, or sophisticated deployment policy. Lambda fits short event handlers. Render, Railway, or Fly.io may be better comparisons for a cross-cloud PaaS experience.

Push a broken image, fail the health endpoint, saturate concurrency, and disconnect a private dependency. Confirm deployment preserves a healthy revision and alarms distinguish application, network, and scaling failures.

## References

- [AWS App Runner architecture and concepts](https://docs.aws.amazon.com/apprunner/latest/dg/architecture.html)
- [App Runner service based on a source image](https://docs.aws.amazon.com/apprunner/latest/dg/service-source-image.html)
- [Configuring App Runner health checks](https://docs.aws.amazon.com/apprunner/latest/dg/manage-configure-healthcheck.html)
- [Observability for App Runner](https://docs.aws.amazon.com/apprunner/latest/dg/monitor.html)
- [Choosing an AWS container service](https://docs.aws.amazon.com/decision-guides/latest/containers-on-aws-how-to-choose/choosing-aws-container-service.html)
