---
title: "DaoDao Tech Architecture: Monorepo, Multi-Language Backend, and AI Recommendation System"
date: 2026-03-12
category: tech
tags: [turborepo, nextjs, fastapi, postgresql, qdrant, monorepo, typescript, bullmq, notification, celery]
lang: en
tldr: "Next.js + Expo frontend, Node.js + Python dual backend, PostgreSQL + Redis core — plus a social notification system and LLM recommendation engine. Here's how DaoDao builds a learning community platform with a modern tech stack."
description: "A deep dive into DaoDao's learning platform architecture: Turborepo monorepo, Node.js TypeScript backend, social system with BullMQ notification pipeline, Python FastAPI + Celery AI services, and a multi-database strategy spanning PostgreSQL, Redis, Qdrant, and ClickHouse."
draft: false
type: deep-dive
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)

DaoDao is a learning platform where users set goals, track daily practice, and build study communities. Its technical architecture is more complex than most products at a similar scale: the frontend is a Turborepo monorepo managing three apps, the backend is split into Node.js and Python services, and the data layer spans four different databases. This post breaks down the design rationale behind each layer and the trade-offs involved.

## Monorepo Architecture

The frontend uses **Turborepo** to manage the entire monorepo, built on top of pnpm workspaces.

```
daodao-f2e/
├── apps/
│   ├── website/        # Next.js, port 3000 (marketing / landing pages)
│   ├── product/        # Next.js, port 3001 (main application)
│   └── mobile/         # Expo / React Native
└── packages/
    ├── shared/         # Shared types and utils
    ├── ui/             # shadcn/ui component library
    ├── i18n/           # Internationalization
    ├── api/            # OpenAPI client (auto-generated)
    └── features/quiz/  # Quiz feature module
```

Separating `website` from `product` is a common but deliberate decision: marketing pages and the application itself have different deployment cadences, caching strategies, and SEO requirements. Keeping them separate allows independent optimization while sharing `packages/ui` to maintain visual consistency.

Turborepo's `pipeline` configuration lets `build`, `lint`, and `type-check` run in parallel — only tasks with genuine dependencies wait for each other. The `product` build doesn't need to wait for `website`, but both need `packages/` to build first.

## Frontend Technology Choices

Each of the three apps is built on:

- **website / product**: Next.js 15 App Router + React 19, TypeScript 5.7+
- **mobile**: Expo + React Native (cross-platform iOS / Android)
- **UI**: shadcn/ui + TailwindCSS, components live in `packages/ui` and are shared across all apps
- **Linter / Formatter**: **Biome**, replacing ESLint + Prettier

Biome is worth calling out specifically. Written in Rust, it combines linting and formatting in a single tool and runs 10–20x faster than the ESLint + Prettier combination with far simpler configuration. The speed advantage is even more pronounced in a monorepo — what used to be three separate ESLint passes is now a single Biome run. The trade-off is that some ESLint plugins don't yet have equivalent Biome rules, but for most projects this isn't a real concern.

The Next.js 15 + React 19 combination brings Server Components and the `use cache` directive, enabling fine-grained control over what data is cached on the server versus fetched client-side — a more intuitive model than the `fetch` cache options in Next.js 13/14.

## Backend Architecture Layers

The Node.js backend (`daodao-server`) uses Express.js + TypeScript with clear layering:

```
routes → controllers → services → Prisma ORM
                ↕
           middleware (auth, rate limit, validation)
```

Each layer has a single responsibility: routes handle path mapping and middleware mounting, controllers handle HTTP request/response, services contain business logic (with no knowledge of HTTP), and services call the database directly through the Prisma client — no additional repository abstraction layer. For the current team size, removing this indirection layer actually makes things easier to reason about.

All API responses follow a unified format:

```typescript
{
  success: boolean,
  data: T | null,
  timestamp: string,
  meta?: { page?: number, total?: number, ... }
}
```

This allows the frontend API client to handle errors uniformly without inspecting the response structure on a per-endpoint basis.

Authentication uses **JWT + Passport.js** with Google OAuth support. One notable design detail: all externally exposed IDs use **External UUIDs** rather than auto-incrementing database IDs. This prevents attackers from enumerating resources by guessing sequential IDs — URLs like `/api/posts/1`, `/api/posts/2` are a security vulnerability, and UUID-format IDs make guessing computationally infeasible.

Data validation is handled uniformly by **Zod**. Schemas are defined at the service layer and serve simultaneously as TypeScript type sources and runtime validators — no need to maintain type definitions and validation logic separately.

## Multi-Database Strategy

DaoDao's data layer centers on PostgreSQL + Redis, each with well-defined responsibilities:

**PostgreSQL (primary database, via Prisma ORM)**
Single source of truth for all structured data: users, goals, practice records, social relationships, posts, and comments. Prisma provides type-safe queries with versioned schema migrations, well-suited for operations requiring ACID guarantees.

**Redis (cache + task queue + session)**
Serves three purposes: API response caching and session storage to reduce database query load; backend broker for **BullMQ** handling async tasks (sending notifications, scheduled checks to auto-complete expired practices); and OAuth state store for CSRF prevention during the login flow.

The advantage of this combination is conceptual clarity — PostgreSQL owns all persistent data, Redis owns all transient and asynchronous work. There's never any ambiguity about where a piece of data belongs.

## Social System and Notification System

DaoDao added a full social and notification feature set in 2025, marking the platform's transition from "tool" to "community."

### Social System

Social features include follow, bidirectional connection, buddy request (practice partner applications), reactions, and comment mentions. The data models for these all live in PostgreSQL, with schema migrations managed through Prisma.

A few design decisions worth highlighting:

- **Reactions use upsert semantics**: Each user can have only one reaction per target object. Repeated actions update rather than insert, preventing duplicate data.
- **Comment mentions**: The frontend sends `mentionedUserIds`; the backend synchronously triggers P1 (immediate) notifications when creating the comment, so mentioned users are notified right away.
- **Privacy controls**: Social features include built-in privacy mechanisms letting users control visibility of their practice records and learning content.

### Notification System

The notification system is the infrastructure layer for social features, built on **BullMQ + Redis**:

```
User action (like, comment, follow, mention)
        │
        ▼
  Notification Service (determines type and priority)
        │
        ├── In-App Worker ──▶ P1 individual notifications / P2 aggregated notifications
        ├── Email Worker (every 4 hours batch) ──▶ merged P1 + P2 delivery
        └── Weekly Worker (weekly schedule) ──▶ weekly digest email
```

Notifications are classified into two priority levels:

| Priority | Trigger | In-App Handling | Email Handling |
|----------|---------|-----------------|----------------|
| **P1** | Mention, buddy request, buddy check-in activity | Immediate individual notification | Batched every 4 hours, not aggregated |
| **P2** | Follow, like, comment, practice progress | Immediate aggregated notification | Batched every 4 hours, same-type merged |

Email uses batched delivery rather than real-time sending to avoid inbox flooding from high-frequency interactions. A separate weekly digest worker sends a weekly summary including completed practice items, received interaction stats, and personalized CTA links. Email templates use an HTML template engine with multiple versions (e.g., welcome emails with different referral group variants).

The design principle behind this social + notification architecture is: **balance immediacy against resource consumption**. Not every interaction warrants an instant notification. P1/P2 prioritization ensures important notifications aren't buried while preventing notification fatigue from excessive emails.

## AI Backend

AI services are extracted into a separate Python FastAPI application (`daodao-ai-backend`), deployed independently from the Node.js backend. The reasoning is straightforward: Python's ML ecosystem toolchain is vastly superior to Node.js's, and an independent service means AI capabilities can be scaled separately.

The architecture:

- **LLM integration**: Recommendation engine that suggests relevant learning resources or community members based on a user's learning history and goals
- **Qdrant**: Vector database storing content embeddings for semantic search — not keyword matching for "TypeScript tutorial," but finding "content semantically similar to your learning goals"
- **ClickHouse**: Analytics database recording behavioral events (page views, interactions, learning progress) used for feature engineering in the recommendation engine
- **Redis**: Cache for LLM responses and search results, avoiding redundant inference on repeated queries
- **Celery**: Redis-based task queue handling time-consuming async tasks like AI feedback generation

The Node.js backend calls the FastAPI service via HTTP; each maintains its own data sources.

## CI/CD Highlights

Deployment uses Docker + PM2 + GitHub Actions, with one particularly noteworthy design: **TypeScript type-aware Docker layer caching**.

A standard Dockerfile places `npm install` and `tsc build` in separate layers, only re-running install when `package.json` changes. DaoDao's CI goes further by monitoring TypeScript type changes: when type definitions in `packages/shared` or `packages/api` are modified, it automatically triggers Docker layer rebuilds for the affected apps, ensuring type changes aren't masked by stale build caches.

After deployment, a webhook sends Discord notifications including which service was deployed, at what version, along with build time and test results. For a small team, Discord notifications have lower setup overhead than Slack and are more than sufficient.

## Overall Architecture

```
Browser / Mobile App
        │
        ├── website (Next.js :3000)
        └── product (Next.js :3001)
                │
                ▼
        daodao-server (Node.js / Express)
         │                    │
         ▼                    ▼
    PostgreSQL              Redis
    (Prisma)           │    │    │
    ├─ Users         BullMQ Cache Session
    ├─ Social graph      │
    ├─ Practice logs     ├── Notification Workers (P1/P2 + Email batch + Weekly digest)
    └─ Notifications     └── Scheduled tasks (practice auto-completion)

        daodao-server ──HTTP──▶ daodao-ai-backend
                                (Python FastAPI + Celery)
                                 │       │      │
                                 ▼       ▼      ▼
                              Qdrant  ClickHouse Redis
                           (semantic  (analytics) (cache + Celery broker)
                            search)
```

GitHub Actions handles CI/CD; Discord receives deployment notifications. The frontend monorepo uses Turborepo pipelines to manage build dependency order.

## Overall Assessment

The core trade-off in DaoDao's architecture is: **trading higher technical complexity for optimization headroom at every layer**. Two backend services (Node.js + Python), multiple databases (PostgreSQL, Redis, Qdrant, ClickHouse), three frontend apps — for a small team, this is a costly choice.

It makes sense given these premises:
1. The team has sufficient familiarity with each technology, keeping maintenance costs manageable
2. Each database has clearly defined responsibilities, eliminating "where does this data go?" confusion
3. AI features are a core differentiator, justifying dedicated investment

If you were starting a greenfield MVP from scratch, this architecture would likely be overkill — a single PostgreSQL database with a simple Node.js API can typically scale quite far. But for a learning platform that has clearly established needs for semantic search, behavioral analytics, and multi-platform support, these architecture choices are reasonable.

Turborepo + Biome genuinely delivers a better developer experience — fast linting, convenient type sharing, and clear build pipelines for multiple apps. This part is worth borrowing regardless of what backend architecture you choose.

## References

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Biome Official Site](https://biomejs.dev/)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Prisma ORM Documentation](https://www.prisma.io/docs)
- [BullMQ Documentation](https://docs.bullmq.io/)
- [Zod Documentation](https://zod.dev/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Qdrant Vector Database](https://qdrant.tech/documentation/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Expo Documentation](https://docs.expo.dev/)
- [NobodyClimb Tech Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) — Another monorepo-based project for comparison
