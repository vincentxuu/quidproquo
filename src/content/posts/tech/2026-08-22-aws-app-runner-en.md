---
title: "AWS App Runner After It Closed to New Customers: What Existing Services Should Do and What New Projects Should Use"
date: 2026-08-22
category: tech
type: deep-dive
tags: [aws, app-runner, paas, containers, cloud-computing]
lang: en
tldr: "AWS App Runner stopped accepting new customers on April 30, 2026, and will get no new features. New projects should use Amazon ECS Express Mode; existing services keep running, but should plan a move to Express Mode after recording their concurrency, health-check, and VPC boundaries."
description: "Where AWS App Runner stands after closing to new customers: operating existing services, migrating to ECS Express Mode, and choosing between ECS Express Mode, Fargate, and Lambda for new projects."
series:
  name: "Technology Choices in the AI Era"
  order: 52
draft: false
---

> :globe: [中文版](/posts/tech/2026-08-22-aws-app-runner)

[AWS App Runner](https://docs.aws.amazon.com/apprunner/latest/dg/architecture.html) turns a repository or ECR image into an HTTPS web service and manages build/deployment, instances, load balancing, and autoscaling. It requires much less assembly than ECS with Fargate and behaves like an AWS-native PaaS.

## The short answer: do not pick App Runner for new projects

Per the [AWS announcement](https://aws.amazon.com/apprunner/), App Runner stopped accepting new customers on April 30, 2026. Existing customers can keep using it as normal, including creating new resources and services; AWS continues to invest in security and availability but does not plan new features. The recommended replacement is [Amazon ECS Express Mode](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-overview.html).

That gives this post two audiences:

- **You have never used App Runner**: skip to the last section on choosing between ECS Express Mode, Fargate, and Lambda. A new account cannot start using App Runner anyway.
- **You already run App Runner services**: nothing is being shut down, so there is no emergency. But a platform that no longer gains features will eventually fall behind your requirements. The next sections are what existing services must keep right, and they double as the settings checklist for a migration.

## Source code and source image are separate supply chains

Source-code mode lets App Runner build the application; source-image mode deploys from ECR or ECR Public. The [image documentation](https://docs.aws.amazon.com/apprunner/latest/dg/service-source-image.html) leaves image patching to the user. Production should pin immutable digests, scan vulnerabilities, create an SBOM, and decide whether automatic deployment fits change control.

This distinction matters most when migrating: ECS Express Mode only deploys container images. A source-code service first needs a CI step that builds an image and pushes it to a registry.

The service listens on its configured port, remains stateless, and stores uploads and durable state elsewhere. Do not assume an instance persists or use its local filesystem across deployments.

## Autoscaling centers on concurrency

App Runner scales around requests per instance plus minimum and maximum sizes. Set concurrency too high and latency, memory, or connection pools saturate first; set it too low and instance cost rises. Load-test each CPU/memory shape, choose safe concurrency, and cap maximum size to protect the database.

[Health checks](https://docs.aws.amazon.com/apprunner/latest/dg/manage-configure-healthcheck.html) can use TCP or HTTP. Production should expose a lightweight HTTP endpoint that proves the process can serve without performing expensive full dependency checks every time. Application timeouts, circuit breakers, and metrics cover dependencies that readiness cannot express.

Carry both sets of numbers (safe concurrency, health-check path and thresholds) into the ECS auto scaling policy and ALB target group when you migrate, so defaults do not silently replace values you measured.

## Separate ingress from egress

App Runner provides a public endpoint by default and can configure private ingress. A VPC connector enables outbound access to private resources such as RDS or ElastiCache. It does not make every path private or guarantee public internet egress. Draw ingress, DNS, security groups, NAT or endpoints, and database routes individually.

[Observability](https://docs.aws.amazon.com/apprunner/latest/dg/monitor.html) integrates CloudWatch logs and metrics, EventBridge, CloudTrail, and X-Ray. Monitor requests, latency, status codes, active instances, deployment events, and application saturation, and include deployment revision in logs and traces.

## Migrating an existing service to ECS Express Mode

ECS Express Mode needs three things: a container image, a task execution role, and an infrastructure role. It then builds a full stack in your account: an ECS service on Fargate, an Application Load Balancer with TLS, auto scaling, monitoring, and networking. Express Mode itself has no extra charge; you pay for the underlying Fargate, ALB, CloudWatch, and data transfer.

The [official migration guide](https://docs.aws.amazon.com/apprunner/latest/dg/apprunner-availability-change.html) uses blue/green with both services running and DNS weights shifting traffic:

1. Record the App Runner service's image, port, environment variables, custom domain, and its ACM certificate.
2. Create an Express Mode service from the same image.
3. If you use a custom domain, attach the same domain to the Express Mode service.
4. Use weighted records in Route 53 (or your DNS provider) to move a small share of traffic first; roll back by adjusting weights.
5. Delete the App Runner service once the new one is stable.

One easily missed precondition: if the service only uses the default `*.awsapprunner.com` URL and has no custom domain, there is no shared hostname to split traffic on. Validate the Express Mode service first, then switch clients or DNS to the new endpoint in one step.

After the move you have full ECS underneath: sidecars, multi-container tasks, detailed ALB rules, and deployment circuit breakers are all available by editing the underlying resources. The cost structure differs, though: an ALB is billed while it exists (multiple Express Mode services with the same networking configuration share one ALB), so estimate the bill for small internal tools before switching.

## What new projects should use

App Runner's sweet spot was a single stateless HTTP API, internal tool, or prototype for a team already on AWS. ECS Express Mode now covers that position, and unlike App Runner it is not a closed shortcut: when you need workers, cron, sidecars, a service mesh, or complex deployment policy, you keep changing the same ECS service instead of switching platforms.

- **HTTP service with minimal setup**: ECS Express Mode.
- **Full control over task definitions, networking, and deployment**: use [Fargate/ECS](/posts/tech/2026-08-22-aws-fargate-containers-en) directly. Express Mode also creates an ECS service on Fargate; the difference is who fills in the settings first.
- **Short event handlers with very irregular traffic**: [Lambda](/posts/tech/2026-08-22-aws-lambda-compute-en).
- **A cross-cloud PaaS experience**: compare Render, Railway, or Fly.io.

Whichever you choose, acceptance testing stays the same: push a broken image, fail the health endpoint, saturate concurrency, and disconnect a private dependency. Confirm deployment preserves a healthy revision and alarms distinguish application, network, and scaling failures.

## Update history

- 2026-11-23: AWS App Runner closed to new customers on April 30, 2026, with no new features planned. Rewrote the title and conclusion: added "do not pick App Runner for new projects" and "migrating an existing service to ECS Express Mode", and turned the selection section into choosing between ECS Express Mode, Fargate, and Lambda for new projects.

## References

- [AWS App Runner (with end of support notice)](https://aws.amazon.com/apprunner/)
- [AWS App Runner availability change (migration guide to ECS Express Mode)](https://docs.aws.amazon.com/apprunner/latest/dg/apprunner-availability-change.html)
- [Amazon ECS Express Mode](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-overview.html)
- [AWS App Runner architecture and concepts](https://docs.aws.amazon.com/apprunner/latest/dg/architecture.html)
- [App Runner service based on a source image](https://docs.aws.amazon.com/apprunner/latest/dg/service-source-image.html)
- [Configuring App Runner health checks](https://docs.aws.amazon.com/apprunner/latest/dg/manage-configure-healthcheck.html)
- [Observability for App Runner](https://docs.aws.amazon.com/apprunner/latest/dg/monitor.html)
- [Choosing an AWS container service](https://docs.aws.amazon.com/decision-guides/latest/containers-on-aws-how-to-choose/choosing-aws-container-service.html)
