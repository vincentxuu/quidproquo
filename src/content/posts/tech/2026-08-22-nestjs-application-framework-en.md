---
title: "NestJS: A Node.js Architecture Framework of Modules, Dependency Injection, and Request Lifecycles"
date: 2026-08-22
category: tech
type: deep-dive
tags: [nestjs, nodejs, typescript, backend, dependency-injection]
lang: en
tldr: "NestJS is valuable not for decorators alone, but for Modules, Providers, DI, and a predictable pipeline across HTTP, GraphQL, WebSocket, and microservice architectures."
description: "NestJS controllers, providers, modules, DI scopes, pipes, guards, interceptors, filters, adapters, testing, and selection boundaries."
series:
  name: "AI 時代的技術選擇"
  order: 94
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-nestjs-application-framework)

[NestJS](https://docs.nestjs.com/) is a TypeScript-first Node.js application framework. HTTP runs on Express by default or a Fastify adapter. Controllers, Providers, Modules, dependency injection, and decorators organize the application, with similar concepts for GraphQL, WebSockets, and message transports.

## A Module is a visibility boundary

`@Module` declares controllers, providers, imports, and exports. Providers are injectable only through the visible module graph unless explicitly exported and imported. This can express domain boundaries, while global modules and circular dependencies can erase them.

Split by business capability rather than giant controller, service, and repository layers. Dynamic modules fit configurable integrations. Explicit tokens represent ports, while providers adapt external SDKs, databases, and clocks for test replacement.

Providers are singleton-scoped by default. Request scope propagates through dependency chains and adds allocations and latency; use it only for genuine request-local instances and consider AsyncLocalStorage for trace or tenant context. Transient scope is not a general repair for mutable singletons.

## The request lifecycle is a policy pipeline

The [request lifecycle](https://docs.nestjs.com/faq/request-lifecycle) is broadly middleware → guards → interceptors → pipes → controller and service → outbound interceptors, with unhandled exceptions reaching filters:

- Middleware preprocesses framework requests.
- Guards decide authentication and authorization.
- Pipes transform and validate input.
- Interceptors wrap timeouts, metrics, or mapping.
- Filters stabilize error contracts.

Distributing authorization across every layer creates gaps. Lock global, controller, and route ordering with integration tests, especially because response interceptors unwind in reverse order.

Decorator metadata can drive validation and OpenAPI, but TypeScript types disappear at runtime. Enable ValidationPipe, whitelist or reject unknown fields, and test nesting and coercion. Contract-test generated schemas and serialization. Do not expose persistence entities as DTOs.

## Adapter abstraction is not total portability

Nest can switch Express and Fastify, but `req.raw`, plugins, streams, uploads, and middleware semantics create real coupling. Run full HTTP tests before changing adapters.

Lifecycle hooks manage initialization and shutdown, but shutdown hooks must be enabled. On termination, stop traffic, drain connections, and close databases and consumers. Message handlers still need idempotency, retries, dead letters, and telemetry; Nest does not provide exactly-once delivery.

NestJS fits medium and large TypeScript backends needing team conventions, DI and testing, and one architecture across HTTP, GraphQL, and messaging. Fastify, Hono, or Elysia is simpler for small APIs, while Express offers minimal middleware freedom. Test module boundaries, DI scopes, denied guards, DTO overposting, error contracts, adapter parity, graceful shutdown, and redelivery.

## References

- [NestJS documentation](https://docs.nestjs.com/)
- [NestJS modules](https://docs.nestjs.com/modules)
- [NestJS providers](https://docs.nestjs.com/providers)
- [NestJS injection scopes](https://docs.nestjs.com/fundamentals/injection-scopes)
- [NestJS request lifecycle](https://docs.nestjs.com/faq/request-lifecycle)
- [NestJS lifecycle events](https://docs.nestjs.com/fundamentals/lifecycle-events)
