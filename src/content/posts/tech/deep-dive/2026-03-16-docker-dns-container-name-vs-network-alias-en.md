---
title: "Docker DNS Resolution: container_name vs network alias"
date: 2026-03-16
type: guide
category: tech
tags: [docker, dns, docker-compose, networking]
lang: en
tldr: "Cross-project DNS resolution requires container_name or a network alias — and only aliases support horizontal scaling."
description: "Explains how Docker DNS resolution behaves within a single Compose project versus across projects, and when to use container_name versus network aliases."
draft: false
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-16-docker-dns-container-name-vs-network-alias)

In Docker, containers discover each other through DNS. But which names are resolvable depends on the relationship between containers — whether they belong to the same Compose project or span across projects sharing an external network.

## Docker DNS Resolution Rules

| Scenario | Resolvable Names |
|----------|-----------------|
| Within the same Compose project | service name, container_name, network alias |
| Across Compose projects (shared external network) | container_name, network alias |

Service name DNS is scoped to the Compose project level — it's invisible outside the project boundary.

## The Problem with container_name

`container_name` is resolvable across projects, but it has two hard limitations:

**Global uniqueness constraint**: Docker does not allow two containers to share the same `container_name`. If you run `docker compose up` while a previous container hasn't been cleaned up yet, you'll get:

```
Error: container name "/my-container" is already in use
```

**No horizontal scaling**: When starting a second replica with `--scale`, the second container cannot use the same `container_name` — it will fail outright.

## The Advantages of network alias

```yaml
services:
  backend-dev:
    networks:
      dev-daodao-network:
        aliases:
          - backend-dev
```

Aliases are configured at the network level, not the container level. Every container on the same network can resolve the alias — regardless of which Compose project they belong to.

**Scaling support**: Multiple replicas can share the same alias.

```bash
docker compose up --scale backend-dev=2
```

Both containers are registered under the `backend-dev` alias. DNS queries return both IPs, so nginx or any other service automatically round-robins between them — no additional load balancer configuration needed.

## When to Use Which

**Use network alias**: For cross-project service communication, or any service that might need to scale in the future. This should be the default choice in almost every case.

**Use container_name**: When you need to operate on a specific container directly from the host (`docker exec`, `docker logs`). This is an operational convenience, not a DNS mechanism.

The two are not mutually exclusive — you can configure both: `container_name` for human readability and CLI use, and the alias for inter-container DNS resolution.

## References

- [Docker official docs: Networking overview](https://docs.docker.com/network/)
- [Docker Compose official docs: Networking in Compose](https://docs.docker.com/compose/how-tos/networking/)
- [Docker official docs: docker compose up --scale](https://docs.docker.com/reference/cli/docker/compose/up/)
- [nginx 502: Debugging cross-Compose container DNS resolution](/posts/tech/2026-03-16-docker-cross-compose-nginx-502)
- [Daodao Technical Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
