---
title: "Turborepo + pnpm Workspaces: The Standard Approach to Monorepos"
date: 2026-03-27
type: guide
category: tech
tags: [turborepo, monorepo, pnpm, build-system]
lang: en
tldr: "Turborepo solves monorepo build speed problems; pnpm workspaces solves dependency sharing. Together they are the best choice for JS/TS monorepos today."
description: "A practical guide to Turborepo and pnpm workspaces — covering pipeline configuration, task caching, and build order management. Illustrated with real usage from DaoDao and NobodyClimb to explain when this setup is worth adopting."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-03-27-turborepo-monorepo-build)

The problem with monorepos isn't "putting multiple projects in one place" — it's that once you do, builds get slow and dependencies become a mess. Turborepo solves build efficiency; pnpm workspaces solves dependency management. Together they are the standard answer for JS/TS monorepos today.

## What are pnpm Workspaces

pnpm's workspaces feature lets you manage multiple packages in a single repo, sharing a `node_modules` directory so you don't need to install the same dependencies over and over.

Place a `pnpm-workspace.yaml` in the repo root:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

Then a single `pnpm install` installs all dependencies across every package. Packages can reference each other:

```json
// apps/product/package.json
{
  "dependencies": {
    "@myproject/ui": "workspace:*",
    "@myproject/shared": "workspace:*"
  }
}
```

`workspace:*` means resolve from the local `packages/ui` and `packages/shared` inside the monorepo, not from the npm registry.

## What is Turborepo

Turborepo is a build orchestration tool for monorepos. It does two things:

1. **Task dependency management**: defines which tasks must finish first and which can run in parallel
2. **Output caching**: if inputs haven't changed, reuse the previous output instead of re-running the task

Configure the pipeline in `turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "lint": {
      "dependsOn": []
    },
    "type-check": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

The `^` in `^build` means "run the dependency package's build first." Since `apps/product` depends on `packages/ui`, Turborepo ensures `packages/ui` builds before `apps/product` starts.

## Caching

Turborepo uses a hash of inputs as the cache key:

- **Inputs**: source files, environment variables, `turbo.json` configuration
- **Outputs**: build artifacts (`.next/`, `dist/`)

First build:

```
$ pnpm turbo build
• Packages in scope: website, product, ui, shared
• Running build in 4 packages
Tasks:    4 successful, 4 total
Cached:   0 cached, 4 total
Time:     45.2s
```

Second build (no files changed):

```
$ pnpm turbo build
Tasks:    4 successful, 4 total
Cached:   4 cached, 4 total
Time:     312ms
```

45 seconds down to 312ms — because everything was a cache hit. On CI, you can configure Remote Cache (Turborepo's cloud cache or self-hosted) so different machines share build caches.

## Usage in DaoDao and NobodyClimb

Both projects use a similar monorepo structure:

**DaoDao:**
```
apps/
  website/     # Marketing site (Next.js)
  product/     # Main application (Next.js)
  mobile/      # Expo / React Native
packages/
  shared/      # Shared types, utils
  ui/          # shadcn/ui component library
  i18n/        # Internationalization
  api/         # OpenAPI client
```

**NobodyClimb:**
```
apps/
  web/         # Next.js 15
  mobile/      # React Native + Expo
packages/
  schemas/     # Zod schemas (shared between frontend and backend)
  api-client/  # API client
```

The common pattern: everything in `packages/` must build before `apps/` can build. Turborepo's `^build` handles this ordering automatically — no manual coordination needed.

NobodyClimb also places a Hono backend in `backend/`, managed through the same pnpm workspaces. Types are shared from `packages/schemas` — the request body the frontend sends and the schema the backend validates against are the same Zod definition, eliminating frontend/backend type mismatches entirely.

## Common Commands

```bash
# Build all packages
pnpm turbo build

# Build only a specific app
pnpm turbo build --filter=product

# Build only affected packages (compared to main branch)
pnpm turbo build --filter=...[main]

# Dev mode, start all apps simultaneously
pnpm turbo dev

# Run a command in a specific workspace
pnpm --filter product add react-query
```

`--filter` is the most frequently used flag in monorepos — it lets you run tasks only on the packages you care about.

## When Is It Worth Adopting

Monorepo is not the default choice. It makes sense when:

- **Multiple apps share code**: UI component libraries, type definitions, utils, API clients
- **Frontend and backend share types**: Zod schemas serving as both request/response validation and type sources
- **You want a unified lint / type-check / test pipeline**: one command runs across the entire repo

It's not the right fit when:

- You only have one app with no real code-sharing needs
- The team isn't familiar with workspace link mechanics, making debugging costly
- The repo mixes wildly different tech stacks (e.g., Python and JS together)

## Trade-offs

**Benefits:**
- Code sharing becomes straightforward; type safety extends across packages
- Build caching significantly reduces CI time
- Unified toolchain (lint, format, type-check)

**Drawbacks:**
- Initial setup has a learning curve; workspace link resolution can be unintuitive to debug
- Remote Cache requires extra configuration (Vercel's offering is a commercial service)
- `pnpm install` on large monorepos is still not fast

For multi-app projects like DaoDao and NobodyClimb, Turborepo + pnpm workspaces is a worthwhile investment — the development experience is significantly better than maintaining multiple separate repos.

## References

- [Turborepo official docs](https://turbo.build/repo/docs)
- [pnpm workspaces official docs](https://pnpm.io/workspaces)
- [Turborepo pipeline configuration](https://turbo.build/repo/docs/crafting-your-repository/configuring-tasks)
- [DaoDao technical architecture overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — DaoDao's monorepo structure and Turborepo usage
- [NobodyClimb: Building a climbing community platform on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) — NobodyClimb's monorepo structure and shared schema design
