---
title: "Deno Deploy: Deno 2, Revisions, Timelines, and Global TypeScript Serverless"
date: 2026-08-22
category: tech
type: deep-dive
tags: [deno, deno-deploy, serverless, typescript, edge-computing]
lang: en
tldr: "The new Deno Deploy runs application revisions on Deno 2; understand it through timelines, contexts, databases, and telemetry rather than Deploy Classic assumptions."
description: "The new Deno Deploy Application, Revision, Timeline, Context, Cron, database, region model, and Classic migration boundary."
series:
  name: "Technology Choices in the AI Era"
  order: 78
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-deno-deploy-serverless-platform)

[Deno Deploy](https://docs.deno.com/deploy/) is a serverless platform for JavaScript, TypeScript, and WebAssembly. “New Deploy” matters: Deno rebuilt it around a Deno 2 execution environment, `console.deno.com`, and a new control plane. Deploy Classic and subhosting v1 shut down on July 20, 2026.

## Application, Revision, and Timeline form the release model

An [Application](https://docs.deno.com/deploy/reference/apps/) bounds a web service and domains. Each GitHub or `deno deploy` release produces an immutable Revision. A Timeline assigns a revision to production, branch, or preview traffic, so rollback switches the active revision rather than overwriting an artifact.

That supports previews and staged validation, but migrations must tolerate overlapping revisions. Make pre-deploy commands repeatable, use expand-and-contract schemas, and prevent previews from reaching production data.

## Context separates build, development, and production

[Environment Contexts](https://docs.deno.com/deploy/reference/env_vars_and_contexts/) separate Build, Development, and Production variables and secrets. Build secrets do not automatically enter runtime, and branch or preview timelines use Development by default. Inject secrets through contexts or cloud connections rather than bundles or logs.

The new platform supports databases, logs, metrics, tracing, and hosted or self-hosted regions. Still verify actual placement, data location, and upstream latency; “edge” does not imply globally replicated state.

## Cron is code-defined; do not assume Classic Queues

The platform discovers `Deno.cron()` at deployment and executes definitions from each registered timeline's active revision. [Cron](https://docs.deno.com/deploy/reference/cron/) uses UTC and retries, so handlers still need idempotency, locks, or unique execution keys.

The new platform is not feature-identical to Classic. Its official comparison currently lists Cron and databases but not Classic Queues. Migration requires an inventory of runtime APIs, regions, KV and queues, environments, domains, logs, and subhosting—not merely a dashboard change.

Deno Deploy fits Deno or TypeScript APIs, Fresh and Astro applications, code-defined cron, and teams sharing one Deno runtime locally and in production. Compare Cloudflare Workers, Koyeb, or Railway and Render for resident workers, arbitrary containers, or mature queue topologies. Test revision rollback, preview-secret isolation, cron redelivery, database migrations, and regional failure.

## References

- [About Deno Deploy](https://docs.deno.com/deploy/)
- [Deno Deploy applications](https://docs.deno.com/deploy/reference/apps/)
- [Environment variables and contexts](https://docs.deno.com/deploy/reference/env_vars_and_contexts/)
- [Deno Deploy timelines](https://docs.deno.com/deploy/reference/timelines/)
- [Deno Deploy cron](https://docs.deno.com/deploy/reference/cron/)
- [Deno Deploy CLI](https://docs.deno.com/runtime/reference/cli/deploy/)
