---
title: "Kamal: Docker Deployment Without a Resident Control Plane"
date: 2026-08-22
category: tech
type: deep-dive
tags: [kamal, deployment, docker, self-hosting, devops]
lang: en
tldr: "Kamal deploys immutable images from an operator over SSH and switches traffic through kamal-proxy; it is not a scheduler and does not operate hosts or data."
description: "Kamal deploy.yml, SSH, registries, roles, kamal-proxy, accessories, secrets, rollback, and multi-host boundaries."
series:
  name: "AI 時代的技術選擇"
  order: 84
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-kamal-deployment-tool)

[Kamal](https://kamal-deploy.org/docs/installation/) deploys Docker images from a CLI or CI runner over SSH. It is not a resident dashboard or cluster scheduler. `config/deploy.yml` declares service, image, servers, roles, registry, environment, and proxy; remote hosts run Docker, kamal-proxy, and application containers.

## Deployment is traceable image promotion

`kamal deploy` builds and Git-tags an image, pushes it, lets every server pull, and starts new containers. Kamal-proxy switches traffic only after the new version returns `200` on its health path, then stops the old version. The registry is the deployment source of truth: retain digests, scan artifacts, scope credentials, and plan outages.

Roles place web and worker commands on different hosts with separate limits. Workers lack HTTP readiness, so configure graceful stopping, sufficient `stop_timeout`, queue visibility, and idempotency. Multiple web servers still need an external load balancer. Kamal neither provisions capacity nor reschedules failed hosts.

## Zero downtime has prerequisites

Proxy handoff does not make database migrations compatible. Use expand-and-contract schemas and keep assets, sessions, and caches compatible across versions. Proxy upgrades can roll across hosts, while a single host can still experience interruption.

[Rollback](https://kamal-deploy.org/docs/commands/rollback/) starts an old image when its artifact or stopped container remains; pruning bounds that window. It does not reverse database state, so migration recovery is separate.

## Accessories are not managed services

[Accessories](https://kamal-deploy.org/docs/configuration/accessories/) can run databases or Redis, but they deploy independently and lack the main service's zero-downtime lifecycle. A mounted directory provides persistence, not replication, backup, or failover. Pin versions and test off-site restoration.

`.kamal/secrets` resolves values from the environment or a password manager. Never commit plaintext or expand it into CI logs. Because SSH may use root to install Docker, protect the runner, verify host keys, minimize key scope, and audit hooks.

Kamal fits teams wanting one less control plane while deploying Rails or other web and worker containers to owned VPS hosts. Coolify or Dokploy adds UI and catalogs; Kubernetes or managed PaaS adds scheduling and scaling. Test registry and host loss, rolling proxy reboot, worker drain, accessory restore, and schema-safe rollback.

## References

- [Kamal installation and deployment flow](https://kamal-deploy.org/docs/installation/)
- [Kamal configuration](https://kamal-deploy.org/docs/configuration/overview/)
- [Kamal roles](https://kamal-deploy.org/docs/configuration/roles/)
- [Kamal proxy](https://kamal-deploy.org/docs/commands/proxy/)
- [Kamal accessories](https://kamal-deploy.org/docs/configuration/accessories/)
- [Kamal rollback](https://kamal-deploy.org/docs/commands/rollback/)
