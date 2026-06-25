---
title: "Managing Multi-Service Reverse Proxy with nginx conf.d: A Daodao Case Study"
date: 2026-03-15
type: guide
category: tech
tags: [nginx, devops, docker, reverse-proxy]
lang: en
tldr: "A monolithic nginx.conf becomes unwieldy as services grow. Splitting it into per-service files under conf.d/ via include is the standard solution."
description: "An introduction to nginx as a reverse proxy, and a practical guide to managing multi-service configurations using the conf.d include pattern — illustrated with Daodao's multi-environment architecture."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-15-nginx-confd-multi-service)

When deploying multiple services, nginx is almost always the go-to entry layer. But as services multiply, a single `nginx.conf` quickly balloons into hundreds of lines that are hard to review or maintain. This post introduces nginx's `include` mechanism and how Daodao uses a `conf.d/` structure to manage routing for over a dozen subdomains.

## What Is nginx

nginx is a high-performance HTTP server that most commonly appears in web architectures as a **reverse proxy**: it receives incoming requests and forwards them to the appropriate backend service based on domain or path.

```
User → nginx → prod_website:3000
             → api_server:3000
             → ai_backend:8000
```

Compared to exposing a port on every individual service, putting nginx in front brings several advantages:
- Centralized management of HTTPS, security headers, and logging
- Backend services don't need to expose ports externally
- Enables WebSocket upgrades, request buffering, and static asset caching

## The Problem with a Single nginx.conf

By default, all nginx configuration lives in `/etc/nginx/nginx.conf`. One `server` block per service — five services means five blocks, ten means ten.

When Daodao consolidated everything into a single file, `nginx.conf` swelled past 500 lines covering the main frontend, product app, Node backend, AI backend, admin panel, blog, n8n, and more. Every time a new route was added, you had to hunt for the right spot in the same file, and `git diff` made it nearly impossible to tell which service was actually changed.

## The conf.d Include Pattern

nginx supports loading additional config files inside the `http {}` block using `include`:

```nginx
http {
    # ... global settings ...
    include /etc/nginx/conf.d/*.conf;
}
```

This lets you split each service's `server {}` block into its own file under the `conf.d/` directory. nginx automatically loads all `.conf` files on startup.

## How Daodao Splits Its Config

Daodao organizes its configuration into seven files by service type:

```
nginx/
├── nginx.conf          # Global settings (Cloudflare IPs, DNS resolver)
└── conf.d/
    ├── website.conf    # daodao.so, dev.daodao.so, feat.daodao.so
    ├── product.conf    # app.daodao.so, app-dev, app-feat
    ├── server.conf     # server.daodao.so, server-dev (Node backend)
    ├── ai.conf         # ai.daodao.so, ai-dev (Python AI backend)
    ├── admin.conf      # admin.daodao.so (htpasswd-protected)
    ├── content.conf    # blog, docs, status
    └── n8n.conf        # n8n.daoedu.tw
```

`nginx.conf` contains only global settings — no `server {}` blocks at all:

```nginx
http {
    include /etc/nginx/mime.types;
    sendfile on;
    keepalive_timeout 65;

    # Cloudflare real IP passthrough
    set_real_ip_from 103.21.244.0/22;
    # ... other Cloudflare CIDRs ...
    real_ip_header CF-Connecting-IP;

    # Docker internal DNS (for dynamic upstream resolution)
    resolver 127.0.0.11 valid=30s ipv6=off;

    include /etc/nginx/conf.d/*.conf;
}
```

Each conf file is responsible for exactly one service. For example, `ai.conf`:

```nginx
# AI backend (production)
server {
    listen 80;
    server_name ai.daodao.so;

    location / {
        set $upstream_ai_prod backend-prod:8000;
        proxy_pass http://$upstream_ai_prod;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 60s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;

        # SSE / streaming
        proxy_buffering off;
        proxy_cache off;
    }

    location /api/v1/health {
        set $upstream_ai_prod_health backend-prod:8000;
        proxy_pass http://$upstream_ai_prod_health/api/v1/health;
        access_log off;
    }
}
```

## Docker Mounting

When running nginx in Docker, you need to mount both `nginx.conf` and the `conf.d/` directory:

```yaml
services:
  nginx:
    image: nginx:latest
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
```

## CI/CD: Automatic Syntax Check Before Reload

Daodao keeps its nginx configuration in a separate repo (`daodao-infra`). When changes are pushed to the main branch, GitHub Actions automatically validates the syntax and SSHes into the VPS to reload:

```yaml
- name: Syntax check (local docker)
  run: |
    docker run --rm \
      -v ${{ github.workspace }}/nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
      -v ${{ github.workspace }}/nginx/conf.d:/etc/nginx/conf.d:ro \
      nginx:latest nginx -t
```

The syntax check must pass before the workflow SSHes into the VPS and runs `nginx -s reload`. A failure halts the pipeline, preventing a broken config from ever reaching the server.

## Summary

The `conf.d` split has zero technical overhead — it's just one `include` line and a directory structure. The real value for multi-service projects is:

- **Clean git diffs**: changing an AI backend route only touches `ai.conf`, keeping other services out of the diff
- **Zero-friction service additions**: just add a `new-service.conf` — no need to touch existing files
- **Easier debugging**: when nginx reports an error, it points to the exact conf file and line number

This pattern works well for any single-server VPS deployment running multiple subdomains or services.

## References

- [nginx - Beginner's Guide](https://nginx.org/en/docs/beginners_guide.html)
- [nginx - Module ngx_http_proxy_module](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [nginx - Core functionality (include directive)](https://nginx.org/en/docs/ngx_core_module.html#include)
- [Docker Compose volumes](https://docs.docker.com/compose/how-tos/volumes/)
- [Daodao Technical Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
