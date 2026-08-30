---
title: "Cloudflare Edge Platform Guide: Running Websites and Apps on Cloudflare"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, edge-platform, workers, architecture, deployment]
lang: en
tldr: "The Cloudflare Edge Platform series answers one product question: how do Workers, D1, KV, R2, Durable Objects, Queues, Workflows, Cache, Images, Email, Turnstile, Observability, Browser Run, and Containers help you run a website or app cheaply and reliably?"
description: "A guide to the Cloudflare Edge Platform series, covering Workers compute, app frameworks, data, state, async work, cache, origin protection, media, email, security, observability, browser automation, and containers."
draft: true
series:
  name: "Cloudflare Edge Platform"
  order: 0
---

> 🌏 [中文版](/posts/tech/2026-08-30-cloudflare-edge-platform-overview)

Cloudflare is easy to describe as a CDN or DNS provider. But once you move a product onto it, it starts looking like an app platform: [Workers](https://developers.cloudflare.com/workers/) runs code, [D1](https://developers.cloudflare.com/d1/) stores SQL data, [KV](https://developers.cloudflare.com/kv/) handles global key-value state, [R2](https://developers.cloudflare.com/r2/) stores objects, [Durable Objects](https://developers.cloudflare.com/durable-objects/) handles state and coordination, and the platform continues through Queues, Workflows, Cache Rules, Smart Shield, Images, Email Service, Turnstile, Observability, Browser Run, and Containers.

This series is called Cloudflare Edge Platform. It is an architecture and deployment guide, not a product catalog. The central question is: how do I run a website or app on Cloudflare, keep it stable, and avoid unnecessary infrastructure?

## Who This Series Is For

This path fits readers who:

- Want to run Astro, Next.js, Hono APIs, or a small SaaS on Cloudflare.
- Already use Workers but are unsure how D1, KV, R2, and Durable Objects should split responsibilities.
- Need to design background jobs, durable workflows, cache, origin protection, email, and form protection together.
- Want to know when Workers is not enough and Browser Run or Containers becomes useful.

If the main question is LLMs, RAG, agents, memory, sandboxes, or model gateways, read the [Cloudflare AI Stack](/en/posts/ai/2026-08-30-cloudflare-ai-stack-overview-en) path instead.

## Reading Order

I would read it in product-building order:

1. **Compute**: Workers is the entry point; Hono and OpenNext connect app frameworks to it.
2. **Data**: D1, KV, and R2 define data shape.
3. **State and async work**: Durable Objects coordinate, Queues move work out of requests, and Workflows run durable multi-step processes.
4. **Origin and delivery**: Hyperdrive, Cache Rules, Smart Shield, and Images make databases, origins, and media delivery steadier.
5. **Product surface**: Email Service and Turnstile handle notifications, inbound email, and form protection.
6. **Production control**: Observability / Analytics Engine makes the system inspectable; Browser Run and Containers cover work outside the normal Workers runtime.
7. **Appendix**: Custom Domains, maintenance pages, limits, and build/runtime boundaries before launch.

This is not Cloudflare's product taxonomy. It is the order a product usually needs these pieces: receive requests, decide where data lives, then add background work, performance, security, observability, and escape hatches.

## Each Service's Job

| Topic | What you should know after reading |
|---|---|
| Workers | How edge runtime differs from ordinary serverless functions |
| D1 | Which data fits SQLite-style SQL |
| KV | Which data can accept eventual consistency |
| R2 | The tradeoff around object storage and zero egress |
| Durable Objects | Per-key state, coordination, and WebSocket behavior |
| Queues | How to move slow work out of requests |
| Workflows | How durable steps differ from background jobs |
| Hyperdrive | How Workers connects to existing Postgres/MySQL |
| Cache Rules / Smart Shield | How cache policy and origin protection differ |
| Images | Image transformation, variants, and delivery pipelines |
| Email Service | Transactional email, inbound routing, and Worker email handlers |
| Turnstile | Bot protection for forms and public endpoints |
| Observability | Logs, traces, metrics, and custom analytics |
| Browser Run | Managed headless Chrome |
| Containers | Linux runtime beyond Workers |

## When Not to Force the Move

Cloudflare is a strong fit for edge entry points, serverless APIs, small-to-medium products, global cache, R2 object workflows, and AI app glue code. It is not the right home for every workload:

- Long-running TCP services.
- Large VMs, GPUs, or persistent block storage.
- Databases that depend on complex transactions, extensions, or stored procedures.
- Teams with mature Kubernetes / cloud ops where Cloudflare would only add another layer.

The point of this series is not to put everything on Cloudflare. It is to show which product pieces become simpler when they move there.

## References

- [Cloudflare Developer Platform docs](https://developers.cloudflare.com/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare storage options](https://developers.cloudflare.com/workers/platform/storage-options/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [Cloudflare Browser Run](https://developers.cloudflare.com/browser-run/)
- [Cloudflare Containers](https://developers.cloudflare.com/containers/)
