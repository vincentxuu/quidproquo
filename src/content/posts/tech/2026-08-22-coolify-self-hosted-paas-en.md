---
title: "Coolify: Control Planes, Docker Servers, and the Self-Hosted PaaS Boundary"
date: 2026-08-22
category: tech
type: deep-dive
tags: [coolify, paas, self-hosting, docker, devops]
lang: en
tldr: "Coolify controls Docker, proxies, and resources on your servers over SSH; deployment gets easier, but OS, security, capacity, data backup, and recovery remain yours."
description: "Coolify's control plane, connected servers, resources, reverse proxy, builds, backups, availability, and self-hosting responsibility."
series:
  name: "Technology Choices in the AI Era"
  order: 80
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-coolify-self-hosted-paas)

[Coolify](https://next.coolify.io/docs/core/what-is-coolify) is an open-source, self-hostable PaaS control plane. Over SSH it builds or pulls images and manages Docker containers, networks, volumes, proxies, domains, TLS, health checks, and deployments on servers the team supplies.

## Control plane and data plane are separate

The Coolify instance stores project, environment, resource, server, and credential configuration. Connected servers run applications, databases, services, proxies, and monitoring. HTTP traffic reaches the workload server's proxy directly. Running containers usually survive a control-plane outage, but deployment and management do not.

DNS must consequently target the resource server. SSH-based multi-server control also grants broad management power. Isolate the control plane, constrain keys, disable password login, configure firewalls, patch the OS, Docker, and Coolify, and audit administrative actions.

## Resources are standard Docker, but platform state remains

[Coolify's architecture](https://next.coolify.io/docs/core/how-coolify-works) deploys Git sources, Dockerfiles, Compose files, or images. On-host builds can exhaust workload CPU, memory, and disk. Production systems should consider dedicated builders or CI and registries, immutable digests, dependency scanning, and scoped build secrets.

Traefik or Caddy automates routing and certificates while remaining a failure point. Test renewal, proxy reloads, port collisions, wildcard DNS, and host ports bypassing the proxy. Portable containers do not automatically restore platform configuration, generated files, registry artifacts, or DNS.

## Backup has two independent tracks

A Coolify instance backup covers the control-plane database, not application files, databases, volumes, or external storage on connected servers. Every stateful resource needs consistent backups, off-site retention, encryption, and restoration drills.

Multi-server scaling needs a shared registry, external load balancer, and compatible image architectures. Swarm adds quorum, overlay network, storage, and upgrade duties. Externalize state before adding replicas.

Coolify fits Linux and Docker-capable teams wanting PaaS workflows across VPS, home, or hybrid infrastructure. Choose Railway or Render to avoid host and control-plane duty; evaluate Kubernetes for mature scheduling, policy, and ecosystem depth. Test loss of Coolify, a workload host, or registry, plus volume restore, certificate renewal, and upgrade rollback.

## References

- [What is Coolify](https://next.coolify.io/docs/core/what-is-coolify)
- [How Coolify works](https://next.coolify.io/docs/core/how-coolify-works)
- [Coolify concepts](https://coolify.io/docs/get-started/concepts)
- [Coolify server introduction](https://coolify.io/docs/knowledge-base/server/introduction)
- [Coolify scalability](https://coolify.io/docs/knowledge-base/internal/scalability)
