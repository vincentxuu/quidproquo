---
title: "GitHub Actions: A CI/CD Primer and Monorepo Strategy"
date: 2026-03-27
type: guide
category: tech
tags: [github-actions, ci-cd, automation, devops]
lang: en
tldr: "GitHub Actions is the lowest-friction CI/CD tool available today, ideal for small-to-medium projects. The key to monorepos is using path filters so only affected apps trigger a build."
description: "GitHub Actions workflow syntax, common patterns, secrets management, and trigger strategies for monorepos. Uses DaoDao's CI/CD setup as a real-world example of automated deployment."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-github-actions-ci-cd)

The goal of CI/CD is simple: automate every manual step between "writing code" and "running in production." GitHub Actions is the lowest-setup-cost option available today — no standalone Jenkins server, no CircleCI account management. Your workflow config lives right in the repo, version-controlled alongside your code.

## Basic Workflow Structure

A workflow is a YAML file placed under `.github/workflows/`:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm turbo lint

      - name: Type check
        run: pnpm turbo type-check
```

Key concepts:

- **on**: Trigger conditions — which events and which branches
- **jobs**: What to run; multiple jobs can run in parallel
- **steps**: Sequential steps within each job
- **uses**: References a pre-built action (`actions/checkout` is the standard action for checking out code)

## Common CI Patterns

**Build + Test:**

```yaml
build-and-test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v4
    - uses: actions/setup-node@v4
      with:
        node-version: "20"
        cache: "pnpm"

    - run: pnpm install --frozen-lockfile
    - run: pnpm turbo build
    - run: pnpm turbo test
```

**Steps with Environment Variables:**

```yaml
- name: Run tests
  run: pnpm test
  env:
    DATABASE_URL: postgresql://user:pass@localhost:5432/testdb
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

`${{ secrets.JWT_SECRET }}` reads from the repo's Secrets store and never appears in logs.

**Secrets Management:**

Configure secrets at GitHub repo → Settings → Secrets and variables → Actions. Common secrets include:

- `DATABASE_URL`, `REDIS_URL`
- SSH keys or cloud credentials for deployments
- Discord / Slack webhook URLs for deploy notifications

## Deployment Workflow

CI that only runs tests isn't enough — you also need to push to production. A complete deployment workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: |
          docker build -t my-app:${{ github.sha }} .

      - name: Push to registry
        run: |
          echo ${{ secrets.REGISTRY_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin
          docker push ghcr.io/myorg/my-app:${{ github.sha }}

      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            docker pull ghcr.io/myorg/my-app:${{ github.sha }}
            docker stop my-app || true
            docker run -d --name my-app \
              -e DATABASE_URL=${{ secrets.DATABASE_URL }} \
              -p 3000:3000 \
              ghcr.io/myorg/my-app:${{ github.sha }}

      - name: Notify Discord
        if: always()
        uses: Ilshidur/action-discord@master
        env:
          DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK }}
        with:
          args: "Deploy ${{ job.status }}: ${{ github.repository }}@${{ github.sha }}"
```

## Monorepo Trigger Strategy

In a monorepo, changing `apps/website` shouldn't trigger a rebuild of `apps/product`. Use `paths` filters to achieve this:

```yaml
on:
  push:
    branches: [main]
    paths:
      - "apps/product/**"
      - "packages/**"  # shared package changes should also trigger
```

However, managing separate workflow files for each app gets unwieldy. A better approach is combining Turborepo's `--filter` flag with the `dorny/paths-filter` action to dynamically determine which apps to build:

```yaml
- uses: dorny/paths-filter@v3
  id: changes
  with:
    filters: |
      product:
        - 'apps/product/**'
        - 'packages/**'
      website:
        - 'apps/website/**'
        - 'packages/**'

- name: Build product
  if: steps.changes.outputs.product == 'true'
  run: pnpm turbo build --filter=product

- name: Build website
  if: steps.changes.outputs.website == 'true'
  run: pnpm turbo build --filter=website
```

## DaoDao's CI/CD Design

DaoDao's CI/CD has a few notable design decisions worth highlighting:

**TypeScript type-aware cache invalidation:** Beyond triggering app builds on `packages/` changes, the CI also tracks the hash of TypeScript type definitions. When types in `packages/shared` or `packages/api` change, the Docker layer cache for affected apps is forcibly invalidated — ensuring type changes are properly recompiled rather than silently served from a stale cache.

**Discord deploy notifications:** After each deployment, a Discord webhook fires with:
- Which service was deployed and at what version
- Build duration
- Test results

For small teams, Discord webhooks are cheaper to set up than Slack and more than sufficient.

**Separate deployment for two backend services:** The Node.js backend (`daodao-server`) and the Python AI backend (`daodao-ai-backend`) each have their own workflow, triggered only when their respective directories change — preventing frontend changes from unnecessarily redeploying backend services.

## Job Dependencies

Multiple jobs can run in parallel, or you can chain them with explicit dependencies:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: pnpm test

  build:
    needs: test  # only runs if test passes
    runs-on: ubuntu-latest
    steps:
      - run: pnpm build

  deploy:
    needs: build  # only runs after build completes
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

`needs` creates a dependency chain between jobs — execution only continues if the preceding job succeeds.

## Trade-offs

**Advantages:**
- Config lives in the repo, version-controlled with your code
- GitHub's free tier is sufficient for open-source or small projects (2,000 minutes/month)
- The Marketplace has a large selection of ready-made actions covering nearly every common use case
- Native integration with GitHub PRs and issues

**Disadvantages:**
- Complex workflows produce verbose YAML that's unintuitive to debug
- Private repos incur charges beyond the free tier; large monorepos can burn through CI minutes quickly
- Compared to GitLab CI or CircleCI, some advanced features (dynamic pipelines, DAG-style workflows) are more limited
- Secrets management requires discipline — be careful not to accidentally commit sensitive values

## References

- [GitHub Actions Official Docs](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [dorny/paths-filter](https://github.com/dorny/paths-filter) — Monorepo path filter action
- [appleboy/ssh-action](https://github.com/appleboy/ssh-action) — SSH deployment action
- [Turborepo Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) — Build cache for CI
- [DaoDao Tech Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — DaoDao's CI/CD architecture and Discord notification design
