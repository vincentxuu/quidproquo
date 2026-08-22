---
title: "CapRover: Self-Hosted PaaS with Docker Swarm, Nginx, and Persistent Apps"
date: 2026-08-22
category: tech
type: deep-dive
tags: [caprover, paas, self-hosting, docker-swarm, devops]
lang: en
tldr: "CapRover wraps Docker Swarm, Nginx, and captain-definition in a simpler PaaS; stateless apps scale, while local persistent apps remain pinned to one node."
description: "CapRover deployment, Docker Swarm, Nginx, scaling, persistent apps, registries, backups, and recovery limitations."
series:
  name: "AI 時代的技術選擇"
  order: 82
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-caprover-self-hosted-paas)

[CapRover](https://caprover.com/docs/get-started.html) is a self-hosted PaaS built on Docker Swarm, with a dashboard and CLI, Nginx, Let's Encrypt, and one-click apps. Applications deploy from source, Dockerfiles, or images, while `captain-definition` records the build and deployment recipe.

## Swarm exists beneath the wrapper

Docker Swarm supplies replicas, placement, service updates, and node failure handling. A [cluster](https://caprover.com/docs/app-scaling-and-cluster.html) adds manager or worker nodes, with Nginx balancing stateless replicas. A simpler UI does not remove manager quorum, overlay network, registry, capacity, OS patching, or upgrade duties.

Push production images to an external registry with immutable references so new nodes, rollback, and recovery do not depend on the build host. Deployments need termination handling, connection draining, compatible migrations, and health—not merely a started container.

## Persistent Apps lose scheduling freedom

[Persistent Apps](https://caprover.com/docs/persistent-apps.html) mount Docker volumes or host paths so data survives restarts and updates. They become pinned to a server and cannot scale to multiple instances; data does not follow a rescheduled service after node failure.

Keep web and API layers stateless, put uploads in object storage, and use replication-aware databases. A necessary single-node volume needs disk monitoring, off-site backup, and joint data-and-placement restoration. Shared filesystems and plugins introduce their own consistency and failure semantics.

## A CapRover backup is not everything

The [Backup/Restore](https://caprover.com/docs/backup-and-restore.html) feature is documented as experimental. A normal backup preserves control configuration and certificates but excludes container images and persistent directories. Full recovery includes CapRover state, registry images, volumes or databases, DNS, secrets, and node labels.

CapRover fits small teams starting on one VPS and later scaling stateless services with Swarm. Consider Dokploy for Compose and independent remotes, Coolify for a broader resource control plane, and Kubernetes for deeper policy and operator ecosystems. Test worker and manager loss, image reconstruction, volume restore, certificate renewal, and schema-safe rollback.

## References

- [CapRover getting started](https://caprover.com/docs/get-started.html)
- [CapRover deployment methods](https://caprover.com/docs/deployment-methods.html)
- [App scaling and cluster](https://caprover.com/docs/app-scaling-and-cluster.html)
- [Persistent apps](https://caprover.com/docs/persistent-apps.html)
- [Backup and restore](https://caprover.com/docs/backup-and-restore.html)
