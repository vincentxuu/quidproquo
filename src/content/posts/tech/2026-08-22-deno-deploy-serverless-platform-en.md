---
title: "Deno Deploy Shuts Down in April 2027: Moving Existing Apps and Choosing a Replacement"
date: 2026-08-22
category: tech
type: deep-dive
tags: [deno, deno-deploy, serverless, typescript, edge-computing]
lang: en
tldr: "The Deno team joined Cloudflare in 2026-10. Deno Deploy is scheduled to shut down in April 2027, and the Deno runtime gets maintenance releases only until October 2027. Do not start new projects on it; plan to move existing apps to Cloudflare Workers or any platform that runs Node.js, inventorying revisions, contexts, cron, and KV first."
description: "Where Deno Deploy stands after its shutdown announcement: which Application, Revision, Timeline, Context, and Cron settings to carry over, and how to choose among Cloudflare Workers, Koyeb, and Railway or Render for new projects."
series:
  name: "Technology Choices in the AI Era"
  order: 78
draft: false
---

> :globe: [中文版](/posts/tech/2026-08-22-deno-deploy-serverless-platform)

[Deno Deploy](https://docs.deno.com/deploy/) is a serverless platform for JavaScript, TypeScript, and WebAssembly. “New Deploy” matters: Deno rebuilt it around a Deno 2 execution environment, `console.deno.com`, and a new control plane. Deploy Classic and subhosting v1 shut down on July 20, 2026.

## Bottom line: do not start new projects on Deno Deploy

On 2026-10-09 Deno announced that [the entire team is joining Cloudflare](https://deno.com/blog/cloudflare). Future work goes into the shared Cloudflare Workers and Durable Objects platform rather than a separate runtime and hosting service:

- **Deno Deploy** keeps operating for about six more months and then shuts down; the [official docs](https://docs.deno.com/deploy/) say April 2027. Paying customers moving to Cloudflare Workers get migration support.
- **Deno runtime** gets a [monthly 2.9.x LTS release](https://github.com/denoland/deno/issues/37030) with bug and security fixes until October 2027, after which the Deno company stops developing it; the code stays MIT-licensed for the community to continue.
- **JSR** keeps operating, with its infrastructure moving to Cloudflare.

Read the rest accordingly. If you have not used Deno Deploy, skip to the last section for replacements. If you run services on it, the sections below are the settings checklist to carry over when you move.

## Application, Revision, and Timeline form the release model

An [Application](https://docs.deno.com/deploy/reference/apps/) bounds a web service and domains. Each GitHub or `deno deploy` release produces an immutable Revision. A Timeline assigns a revision to production, branch, or preview traffic, so rollback switches the active revision rather than overwriting an artifact.

That supports previews and staged validation, but migrations must tolerate overlapping revisions. Make pre-deploy commands repeatable, use expand-and-contract schemas, and prevent previews from reaching production data.

## Context separates build, development, and production

[Environment Contexts](https://docs.deno.com/deploy/reference/env_vars_and_contexts/) separate Build, Development, and Production variables and secrets. Build secrets do not automatically enter runtime, and branch or preview timelines use Development by default. Inject secrets through contexts or cloud connections rather than bundles or logs.

The new platform supports databases, logs, metrics, tracing, and hosted or self-hosted regions. Still verify actual placement, data location, and upstream latency; “edge” does not imply globally replicated state.

## Cron is code-defined; do not assume Classic Queues

The platform discovers `Deno.cron()` at deployment and executes definitions from each registered timeline's active revision. [Cron](https://docs.deno.com/deploy/reference/cron/) uses UTC and retries, so handlers still need idempotency, locks, or unique execution keys.

The new platform is not feature-identical to Classic. Its official comparison currently lists Cron and databases but not Classic Queues. Migration requires an inventory of runtime APIs, regions, KV and queues, environments, domains, logs, and subhosting—not merely a dashboard change.

## Where to move

The designated destination is Cloudflare Workers: `Deno.cron()` maps to Cron Triggers, and KV-style data moves to Workers KV, D1, or Durable Objects. Each of these requires code changes, not just a new endpoint. If you want to keep TypeScript and Web-standard APIs without tying yourself to one platform, get the app running on Node.js first and then move it to a PaaS such as Railway or Render; for resident workers or arbitrary containers, compare Koyeb and Railway or Render. Koyeb itself was acquired by Mistral AI in 2026-02, so weigh its product direction too.

Use the original acceptance list on the new platform: revision rollback, preview-versus-production secret isolation, cron redelivery, database migrations, and regional failure.

## Update history

- 2026-11-23: The Deno team joined Cloudflare and Deno Deploy is scheduled to shut down in April 2027. Rewrote the title, summary, and opening conclusion, and turned the last section into migration destinations; the middle sections remain as the settings checklist for moving.

## References

- [Deno is joining Cloudflare](https://deno.com/blog/cloudflare)
- [The state of Deno after the Cloudflare announcement](https://github.com/denoland/deno/issues/37030)

- [About Deno Deploy](https://docs.deno.com/deploy/)
- [Deno Deploy applications](https://docs.deno.com/deploy/reference/apps/)
- [Environment variables and contexts](https://docs.deno.com/deploy/reference/env_vars_and_contexts/)
- [Deno Deploy timelines](https://docs.deno.com/deploy/reference/timelines/)
- [Deno Deploy cron](https://docs.deno.com/deploy/reference/cron/)
- [Deno Deploy CLI](https://docs.deno.com/runtime/reference/cli/deploy/)
