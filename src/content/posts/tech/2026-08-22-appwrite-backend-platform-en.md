---
title: "Appwrite: A Self-Hostable BaaS for Auth, Databases, Storage, Functions, and Realtime"
date: 2026-08-22
category: tech
type: deep-dive
tags: [appwrite, baas, authentication, serverless, self-hosting]
lang: en
tldr: "Appwrite combines Auth, TablesDB, Storage, Functions, Realtime, and Messaging behind consistent APIs; Cloud and self-hosted products resemble each other but have different operational ownership."
description: "Appwrite Auth, permissions, TablesDB, Storage, Functions, Realtime, Cloud, and self-hosting boundaries."
series:
  name: "Technology Choices in the AI Era"
  order: 86
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-appwrite-backend-platform)

[Appwrite](https://appwrite.io/docs) is an open-source BaaS for Auth, Databases or TablesDB, Storage, Functions, Realtime, Messaging, and Sites through client and server SDKs, REST, GraphQL, and WebSockets. Teams can use Appwrite Cloud or deploy the same product line themselves.

## Client and server APIs have different authority

Client SDKs use user sessions, and resource [permissions](https://appwrite.io/docs/advanced/security/permissions) govern rows and files. Grants can target users, teams and roles, labels, authenticated users, or guests. Client-created resources receive creator defaults, while Console or Server SDK resources without explicit permissions are inaccessible to clients.

Server SDKs use scoped API keys and can bypass resource permissions. That enables administration and magnifies key leaks. When a backend acts for a user, prefer a short-lived JWT preserving user permissions; reserve minimally scoped API keys for genuine administration.

## Realtime inherits the session at subscription time

Realtime sends only events the subscriber can read. Authenticate before subscribing and recreate subscriptions after session changes; the existing connection does not gain a new identity automatically. `Role.any()` exposes updates to every client, even if transport is WebSocket.

Design TablesDB rows, relationships, queries, indexes, and transactions around access patterns; Storage has separate bucket and file permissions. Workflows spanning data, files, messages, and external APIs are not one transaction, so use status records, outboxes, idempotency keys, and compensation.

## Functions are a trusted boundary, not infinite workers

[Functions](https://appwrite.io/docs/products/functions) run from SDK or HTTP calls, platform events, webhooks, or schedules. Code updates create deployments and one becomes active. Minimize execute access, dynamic API-key scopes, and environment variables. Deduplicate payments, email, and transformations because asynchronous events can retry.

Appwrite operates Cloud. With [self-hosting](https://appwrite.io/docs/advanced/self-hosting), the team owns databases, storage backends, workers, runtimes, SMTP or SMS, proxies, TLS, migrations, monitoring, capacity, and backups. A running Compose stack is not production readiness; rehearse restoration of data and platform state.

Appwrite fits web and mobile teams wanting a complete BaaS API with cloud and self-host choices. Compare Supabase or Nhost for SQL and RLS, Firebase for Google's mobile ecosystem, and PocketBase for a smaller single-host system. Test permission denial, session changes, function redelivery, migration, database and file restoration, and upgrade rollback.

## References

- [Appwrite documentation](https://appwrite.io/docs)
- [Appwrite authentication](https://appwrite.io/docs/products/auth)
- [Appwrite permissions](https://appwrite.io/docs/advanced/security/permissions)
- [Appwrite databases](https://appwrite.io/docs/products/databases)
- [Appwrite Functions](https://appwrite.io/docs/products/functions)
- [Appwrite self-hosting](https://appwrite.io/docs/advanced/self-hosting)
