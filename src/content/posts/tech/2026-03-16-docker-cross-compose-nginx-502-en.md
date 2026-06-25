---
title: "nginx 502: Debugging Cross-Compose Container DNS Resolution"
date: 2026-03-16
type: guide
category: tech
tags: [docker, nginx, dns, docker-compose]
lang: en
tldr: "Service names aren't resolvable across Compose projects — you need to add a network alias so nginx can find the container."
description: "A walkthrough of the root cause and fix for nginx upstream resolution failures (502) when targeting containers in a separate Docker Compose project."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-16-docker-cross-compose-nginx-502)

## TL;DR

When working across Docker Compose projects, nginx cannot resolve containers by their service name. You need to add a network alias so nginx can find the target container.

## Context

nginx runs in the `daodao-infra` project; the AI backend runs in `daodao-ai-backend`. Both are independent Compose projects that communicate over an external network called `dev-daodao-network`.

nginx upstream config:

```nginx
upstream backend_dev {
    server backend-dev:8000 resolve;
}
```

## Problem

Persistent 502 errors — nginx logs showed it could not resolve `backend-dev`.

## Root Cause

The ai-backend `docker-compose.yml` looked like this:

```yaml
services:
  backend-dev:
    container_name: daodao-ai-backend-dev
    networks:
      - dev-daodao-network
```

The DNS for service name `backend-dev` is only valid **within the same Compose project**. Since nginx belongs to a different project, it cannot look up `backend-dev`.

The `container_name` (`daodao-ai-backend-dev`) is resolvable across projects, but the name doesn't match what nginx expects (`backend-dev`).

## Fix

Remove `container_name` and use a network alias instead:

```yaml
services:
  backend-dev:
    networks:
      dev-daodao-network:
        aliases:
          - backend-dev
```

Network aliases are visible to all containers on the same network, regardless of which Compose project they belong to. nginx queries `backend-dev` → resolves successfully → 502 gone.

## Key Takeaway

For cross-Compose container communication, don't rely on service names — explicitly configure network aliases.

## References

- [Docker Compose networking](https://docs.docker.com/compose/how-tos/networking/)
- [Docker network aliases](https://docs.docker.com/reference/cli/docker/network/connect/#aliases)
- [nginx - Module ngx_http_upstream_module](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)
- [Island Learning Technical Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
