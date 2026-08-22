---
title: "Azure App Service: The App Service Plan Matters More Than the Container"
date: 2026-08-22
category: tech
type: deep-dive
tags: [azure, app-service, paas, web-development, cloud-computing]
lang: en
tldr: "App Service manages web runtimes, TLS, deployment, and scaling, while capacity, cost, and isolation live in the shared App Service Plan rather than one app."
description: "Azure App Service runtimes and containers, plans, deployment slots, scaling, networking, and Container Apps tradeoffs."
series:
  name: "AI 時代的技術選擇"
  order: 56
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-azure-app-service)

[Azure App Service](https://learn.microsoft.com/azure/app-service/overview) is a PaaS for web apps, REST APIs, and mobile backends. It supports .NET, Java, Node.js, Python, PHP, and Windows or Linux custom containers. Its abstraction is a hosted website platform, not a general container orchestrator.

## The plan owns capacity and isolation

An app belongs to an App Service Plan. The [hosting-plan documentation](https://learn.microsoft.com/azure/app-service/overview-hosting-plans) says apps, slots, WebJobs, and some diagnostics in a plan share VM CPU and memory, and scale out together. One noisy app can affect its neighbors. Looking only at app resources also misstates cost.

Group apps with matching environments, load, and trust boundaries. Give critical or irregular workloads dedicated plans. Autoscaling should observe CPU, memory, request queues, response time, and downstream capacity. More instances do not fix a database bottleneck.

## Deployment slots are a core strength

[Deployment guidance](https://learn.microsoft.com/azure/app-service/deploy-best-practices) recommends deploying to staging, warming and smoke-testing it, then swapping to production. Mark slot-specific settings correctly or a swap can move the wrong production secrets, connections, or flags. Database migrations still use expand and contract because a rollback must read the new schema.

The platform patches built-in runtime stacks; teams patch custom-container base images and dependencies. In both cases, deploy immutable artifacts from reproducible pipelines rather than editing production state through a console or RDP.

## Networking is not one VNet switch

[Networking features](https://learn.microsoft.com/azure/app-service/networking-features) separate inbound private endpoints and access restrictions from outbound VNet integration. Each direction requires its own design, plus DNS, routes, NAT, and service or private endpoints. Use managed identity for Key Vault, Storage, SQL, and other Azure resources instead of long-lived client secrets.

Application Insights, platform logs, health checks, backups, and certificate renewal belong in operations. Always On, instance warmup, and slot swaps reduce startup effects but do not replace readiness and dependency timeouts.

## App Service or Container Apps

App Service is mature for existing web applications, supported runtimes, Windows/IIS compatibility, slots, and enterprise PaaS workflows. Container Apps is more natural for scale-to-zero, KEDA workers, sidecars, multi-revision traffic, and jobs. Move to AKS only for Kubernetes APIs.

Saturate a neighboring app in the same plan, swap a slot missing configuration, revoke managed identity, and break private DNS. Verify isolation, rollback, alarms, and runbooks reveal the real plan and network boundaries.

## References

- [Azure App Service overview](https://learn.microsoft.com/azure/app-service/overview)
- [Azure App Service plans](https://learn.microsoft.com/azure/app-service/overview-hosting-plans)
- [App Service deployment best practices](https://learn.microsoft.com/azure/app-service/deploy-best-practices)
- [Set up staging environments](https://learn.microsoft.com/azure/app-service/deploy-staging-slots)
- [App Service networking features](https://learn.microsoft.com/azure/app-service/networking-features)
