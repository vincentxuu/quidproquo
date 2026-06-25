---
title: "NobodyClimb: Building a Climbing Community Platform Entirely on Cloudflare"
date: 2026-03-12
category: tech
tags: [cloudflare-workers, nextjs, hono, rag, react-native, monorepo]
lang: en
tldr: "A climbing community platform where the web app, mobile app, and AI Q&A all run on Cloudflare — no dedicated servers."
description: "A deep dive into NobodyClimb's technical architecture: Next.js 15 + Hono + D1 + RAG, why we went Cloudflare-first, and how the AI Q&A system was designed."
draft: false
type: deep-dive
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)

NobodyClimb is a community platform for climbers — a place to log ascents, write stories, share one-liner reflections, and ask an AI climbing-related questions. The entire stack, from frontend to backend to AI, runs on Cloudflare infrastructure. No EC2, no RDS, no standalone inference server. This post walks through the reasoning behind those architecture decisions.

## Why Cloudflare-First

The most direct reason: a climbing community doesn't have e-commerce-level traffic. There are no massive traffic spikes that demand elastic scaling, but there's also no budget for a server running around the clock. Cloudflare Workers' billing model is a perfect fit for the "usually quiet, occasionally someone wanders in" usage pattern — you pay per request, cold starts happen at global edge nodes, and latency is low for users in Taiwan.

Once the decision to go Cloudflare was made, the surrounding choices fell into place naturally:

- **D1** (SQLite): A relational database that runs alongside Workers, no cross-region hops needed
- **R2**: Image and video thumbnail storage with an S3-compatible API
- **KV**: Caching and temporary video data storage
- **AI**: Cloudflare Workers AI — embeddings and LLM inference on the same platform

This isn't to say the stack has no drawbacks — D1 isn't suited for write-heavy workloads, KV is eventually consistent, and Workers AI offers fewer model options than self-hosted alternatives. But for this project's scale, the tradeoffs are worth it.

## Architecture Overview

```
nobodyclimb/
├── apps/web/          # Next.js 15 + React 19 (Cloudflare Workers)
├── apps/mobile/       # React Native + Expo + Tamagui
├── backend/           # Hono API (Cloudflare Workers)
└── packages/          # Shared types, schemas, hooks, utils
```

The monorepo is managed with **pnpm workspaces + Turborepo**. The frontend and backend share a single Zod schema — types come from `packages/schemas`, the API client lives in `packages/api-client`, so there's no risk of the frontend and backend maintaining diverging type definitions.

## Web Frontend: Next.js 15 on Cloudflare

Next.js 15 (App Router) + React 19, deployed to Cloudflare Workers via the `@opennextjs/cloudflare` adapter. The adapter splits Next.js SSR and static assets apart — dynamic routes go through the Worker, static assets are served via Cloudflare Assets — with solid latency performance as a result.

State management is split into two layers:

- **Zustand**: Global client state (auth, UI state, user info)
- **TanStack Query**: Server state, handling fetching, caching, and background updates

Forms use React Hook Form + Zod, pulling the Zod schema directly from `packages/schemas` — no duplicate validation logic.

## Backend: Hono

Hono is a lightweight web framework designed for edge runtimes. Compared to Express, it has a much smaller bundle size and native support for Cloudflare Workers APIs (`ctx.waitUntil()`, `env.DB`, `env.KV`).

The backend follows a three-layer architecture:

```
routes → services → repositories
```

Routes handle OpenAPI documentation (auto-generated with `hono-openapi`) and request validation. Services contain business logic. Repositories handle D1 queries. The OpenAPI JSON is served at `/api/v1/openapi.json`, with a Scalar UI at `/api/v1/docs`.

## Mobile: React Native + Tamagui

The mobile app uses Expo 54 + React Native 0.81, with navigation handled by Expo Router (file-based routing — the same concept as Next.js App Router). UI is built with Tamagui, a cross-platform style system for iOS and Android that supports theme tokens, eliminating the need to write platform-specific styles.

Shared logic is pulled from `packages/` — mobile and web share the same API client and Zustand hooks.

## AI Q&A System (RAG)

This is the part of the project that took the most design effort. Users can ask climbing-related questions in natural language, and the system retrieves answers from community data and a climbing knowledge base.

### Model Selection

Everything runs on Cloudflare Workers AI:

- **Embedding**: `@cf/baai/bge-m3`, 1024 dimensions, multilingual, works well with Traditional Chinese
- **LLM**: `@cf/google/gemma-3-12b-it`

The reason for not using OpenAI or other external APIs: predictable costs, no API key rate limit management, and lower latency (same platform).

### Pipeline Design

```
User question
  ↓
QueryClassifier (classify: general knowledge / community data / SQL query)
  ↓
Retriever (vector search + keyword filtering)
  ↓
CorrectiveRAG (evaluate retrieval quality, decide whether to supplement search)
  ↓
Generator (LLM generates response)
  ↓
LLM Judge (quality evaluation)
```

On the query side, three NLP filters run before vector search to narrow scope: `extractLocationFilter` (location), `extractGradeFilter` (difficulty), and `extractTypeFilter` (route type).

### Streaming Responses

SSE (Server-Sent Events) is supported via `POST /api/v1/ai/ask?stream=true`. Event format:

```
event: token
data: {"text": "..."}

event: done
data: {"usage": {...}}

event: error
data: {"message": "..."}
```

### Quota System

Each user has a daily limit on AI queries and token usage, determined by their **Climber Rank**:

| Rank | Threshold (points) | Daily queries | Daily tokens |
|------|-------------------|---------------|--------------|
| 麓 (Foothill) | 0 | 2 | 5,000 |
| 壁 (Wall) | 20 | 6 | 15,000 |
| 稜 (Ridge) | 70 | 12 | 30,000 |
| 巔 (Summit) | 100 | 24 | 60,000 |

Points accumulate from profile completeness, public stories, and logged ascents — the more you fill in and share, the higher your AI quota. This design directly ties community engagement to AI access.

Quota deductions use atomic SQL `UPDATE` with dual conditions to avoid race conditions. Quotas are refunded on disconnection, and token balances are reconciled after LLM completion.

## In Summary

The core tradeoff of this architecture is: **trading Cloudflare's ecosystem for zero infra management overhead**. D1 isn't the most powerful database, Workers AI isn't the richest AI platform, but for a side project, not having to manage VPCs, configure auto-scaling, or monitor server uptime makes that trade worthwhile.

This approach suits projects of similar scale: meaningful complexity (monorepo, multi-platform, AI features) but not yet at a volume that demands dedicated infrastructure. If DAU reaches tens of thousands or write volume grows significantly, D1 and Workers limitations will start to hurt — that's the point to reconsider the architecture, not before.

## References

- [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 documentation](https://developers.cloudflare.com/d1/)
- [Cloudflare R2 documentation](https://developers.cloudflare.com/r2/)
- [Cloudflare Workers AI documentation](https://developers.cloudflare.com/workers-ai/)
- [Hono framework documentation](https://hono.dev/)
- [Next.js 15 documentation](https://nextjs.org/docs)
- [@opennextjs/cloudflare adapter](https://opennext.js.org/cloudflare)
- [Zustand state management](https://zustand-demo.pmnd.rs/)
- [TanStack Query documentation](https://tanstack.com/query/latest)
- [Tamagui documentation](https://tamagui.dev/)
- [Expo documentation](https://docs.expo.dev/)
- [BAAI/bge-m3 model](https://huggingface.co/BAAI/bge-m3)
- [NobodyClimb RAG Pipeline Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) — Full design details of the AI Q&A system
- [Island Island (島島) Tech Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — An architecture comparison with another learning platform
