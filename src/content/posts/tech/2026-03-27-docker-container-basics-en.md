---
title: "Docker in Practice: Containerizing from Development to Deployment"
date: 2026-03-27
type: guide
category: tech
tags: [docker, container, devops, deployment]
lang: en
tldr: "Docker lets you bundle your application together with its environment, eliminating the 'works on my machine' problem. Combined with multi-stage builds and Compose, it's an essential tool for modern backend deployment."
description: "A practical look at Docker's core concepts, multi-stage Dockerfile builds, and Docker Compose — using DaoDao's deployment architecture as a real-world example of Docker's role in production projects."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-docker-container-basics)

Docker solves a fundamental problem: applications depend on too many environmental factors — Node.js versions, OS libraries, environment variables — and Docker packages all of them into a single image so every environment runs the exact same thing.

## Core Concepts

**Image**: A read-only template that describes what environment and files an application needs. Defined via a `Dockerfile`.

**Container**: A running instance of an image. A single image can run as multiple containers simultaneously.

**Dockerfile**: A set of instructions that describes how to build an image — which base image to start from, what to install, which files to copy, and what commands to run.

**Registry**: Where images are stored. Docker Hub is the public option; private deployments typically use GitHub Container Registry or AWS ECR.

## Dockerfile Basics

A minimal Dockerfile for a Node.js application:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

This works, but there's a problem: the final image includes all `node_modules`, including development devDependencies, making the image unnecessarily large.

## Multi-stage Builds

Multi-stage builds let you install all dependencies and compile during a build stage, then copy only the result into a clean image:

```dockerfile
# ---- Stage 1: Builder ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Stage 2: Production ----
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

`--from=builder` copies `dist/` from the first stage. The production image contains only what's needed at runtime — often more than half the size of the build image.

## Docker Compose

A single container doesn't solve the "multiple services running together" problem. A development environment typically needs an app + database + Redis, and that's exactly what Docker Compose is for:

```yaml
# docker-compose.yml
version: "3.9"

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

`depends_on` ensures `db` and `redis` start before `api`. `volumes` persist data across container restarts.

Common commands:

```bash
# Start all services (in the background)
docker compose up -d

# Start specific services only
docker compose up -d db redis

# View logs
docker compose logs -f api

# Stop and remove containers
docker compose down

# Rebuild an image
docker compose build api
```

## How DaoDao Uses Docker

DaoDao's backend (`daodao-server`) and AI service (`daodao-ai-backend`) are both containerized, with deployments triggered via GitHub Actions that run a Docker build and push to a registry.

One design worth studying: **TypeScript-aware Docker layer cache invalidation**.

A typical Dockerfile separates `npm install` and `tsc build` into different layers so that only `package.json` changes trigger a reinstall. But in a monorepo, when type definitions in `packages/shared` or `packages/api` change, the dependent app's build also needs to re-run — and a `package.json`-based cache key alone isn't enough.

Their CI solution: monitor the hash of type-related packages, and force-invalidate the corresponding app's Docker layer cache when those hashes change. This ensures type changes aren't silently hidden behind a stale build cache.

```dockerfile
# Copy separately for finer-grained layer caching
COPY packages/shared/package.json ./packages/shared/
COPY packages/api/package.json ./packages/api/
COPY apps/product/package.json ./apps/product/
RUN pnpm install --frozen-lockfile

# Build shared packages first
COPY packages/ ./packages/
RUN pnpm turbo build --filter=@myproject/shared --filter=@myproject/api

# Then build the app
COPY apps/product/ ./apps/product/
RUN pnpm turbo build --filter=product
```

## The Layer Cache Mental Model

Docker's layer cache is sequential: if one layer is invalidated, every subsequent layer must re-run. So the order of `COPY` instructions matters:

1. `COPY` low-change files first (`package.json`, `package-lock.json`)
2. `RUN npm install` (dependencies only re-run when packages change)
3. `COPY` high-change files (source code)
4. `RUN npm run build`

By placing the source code `COPY` after `npm install`, each build only re-runs `npm run build` — `npm install` hits the cache every time.

## When to Use Docker (and When Not To)

**Good fit:**
- Backend services that require a specific Node.js version or OS library
- Deployment targets are VMs or bare metal (not serverless)
- Consistent dev environments matter (especially when the stack includes databases, Redis, etc.)

**Not necessarily needed:**
- Deploying to serverless platforms like Vercel or Cloudflare Workers (they have their own bundling mechanisms)
- Frontend-only static sites
- Very small teams with low deployment frequency, where the added complexity outweighs the benefits

NobodyClimb runs on Cloudflare Workers and doesn't need Docker at all — Cloudflare handles the infrastructure, and you just upload a Worker bundle. Docker is for scenarios where you're managing your own server.

## Trade-offs

**Advantages:**
- Environment consistency: development, CI, and production all run the same image
- Dependency isolation: different projects don't interfere with each other
- Reproducible deployments: the same image tag behaves identically on any machine

**Disadvantages:**
- Learning curve: Dockerfiles, networking, and volumes all take time to get comfortable with
- Image management: registries, tags, and cleaning up old images require ongoing maintenance
- Not suited for serverless: Cloudflare Workers and Lambda have their own packaging — Docker doesn't apply

## References

- [Docker Official Documentation](https://docs.docker.com/)
- [Dockerfile best practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker Compose Official Documentation](https://docs.docker.com/compose/)
- [DaoDao Tech Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — DaoDao's Docker deployment strategy and type-aware cache design
