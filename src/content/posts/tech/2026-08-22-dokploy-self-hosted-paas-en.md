---
title: "Dokploy: Self-Hosted PaaS with Applications, Compose, Remote Servers, and Swarm"
date: 2026-08-22
category: tech
type: deep-dive
tags: [dokploy, paas, self-hosting, docker-compose, devops]
lang: en
tldr: "Dokploy supports single-container Applications and Compose or Stack, while treating one host, independent remote servers, and a Swarm cluster as distinct topologies."
description: "Dokploy Applications, Docker Compose, Traefik, previews, remote and build servers, Swarm, volume backups, and security boundaries."
series:
  name: "Technology Choices in the AI Era"
  order: 81
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-dokploy-self-hosted-paas)

[Dokploy](https://docs.dokploy.com/docs/core) is a self-hosted Docker and Traefik platform for Git deployments, domains, TLS, logs, monitoring, databases, backups, and previews. First decide whether a workload is a single **Application**, multi-service **Docker Compose**, or a Swarm **Stack**.

## Application and Compose are different abstractions

An [Application](https://docs.dokploy.com/docs/core/applications) maps to one service or container with provider, build, replica, resource, volume, and domain settings. Compose preserves multi-container topology. UI variables are written to `.env` but enter containers only through explicit `env_file` or `environment` configuration.

Dokploy can inject Traefik labels into Compose, but domain changes require redeployment. Preview the final model and verify that database ports are not host-published, services do not join unintended shared networks, and secrets are not exposed in readable configuration.

## A remote server is not a cluster

[Deployment options](https://docs.dokploy.com/docs/core/deployment-options) are distinct. The single Dokploy Server is simplest. SSH-managed Remote Servers each run independent Docker and Traefik and do not form a cluster. Swarm Nodes share scheduling and load balancing. Use remotes for regional or customer isolation and Swarm only for cross-machine replicas.

A dedicated build server can build Applications, push a registry, and let deployment servers pull; Compose builds currently do not use it. The registry becomes a supply-chain and availability dependency. Pin images, scope push credentials, retain artifacts, and test registry outages.

## Volume backup is not whole-system recovery

[Compose storage](https://docs.dokploy.com/docs/core/docker-compose) supports bind mounts and named volumes, while Dokploy's volume backup supports only named volumes. A Swarm scheduler does not move local data with a container. Use database-native consistency tools, off-site storage, and restoration drills.

Previews execute pull-request code on your servers. The official docs warn against enabling them on public repositories. Isolate credentials, resources, and networks; deny Docker sockets and production access; limit counts and clean up after merges.

Dokploy fits Docker teams favoring Compose, independent VPS fleets, or gradual Swarm adoption. Coolify's resource control plane, CapRover's simplified Swarm, and Kubernetes orchestration have different complexity. Test UI-host failure, SSH loss, Traefik reload, registry outage, malicious preview builds, and volume restoration.

## References

- [Dokploy documentation](https://docs.dokploy.com/docs/core)
- [Dokploy applications](https://docs.dokploy.com/docs/core/applications)
- [Dokploy Docker Compose](https://docs.dokploy.com/docs/core/docker-compose)
- [Dokploy deployment options](https://docs.dokploy.com/docs/core/deployment-options)
- [Dokploy remote servers](https://docs.dokploy.com/docs/core/remote-servers)
- [Dokploy preview deployments](https://docs.dokploy.com/docs/core/applications/preview-deployments)
