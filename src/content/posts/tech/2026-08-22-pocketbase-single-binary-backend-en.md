---
title: "PocketBase: A Single-Binary Backend with SQLite, Auth, and Realtime"
date: 2026-08-22
category: tech
type: deep-dive
tags: [pocketbase, baas, sqlite, realtime, self-hosting]
lang: en
tldr: "PocketBase packages SQLite, collections, Auth, file storage, SSE realtime, and an admin UI into a small executable; deployment is easy, but single-host and pre-v1 compatibility limits matter."
description: "PocketBase collections, API rules, Auth, Realtime, Go and JavaScript hooks, backups, production, and scaling boundaries."
series:
  name: "AI 時代的技術選擇"
  order: 88
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-pocketbase-single-binary-backend)

[PocketBase](https://pocketbase.io/docs/) is a small Go executable containing SQLite, a REST-ish API, Auth, file storage, SSE realtime, and an admin dashboard. It can also be extended as a Go framework or with JavaScript hooks. A product backend collapses into one process and `pb_data`, which is excellent for prototypes and single-host services.

## Collections are API contracts over SQLite

Base collections map to SQLite tables. Auth collections add identity fields and login flows. View collections use read-only SQL `SELECT` and do not emit realtime mutations. Version schema migrations, indexes, relations, and query rules rather than leaving dashboard changes untracked.

Collection API rules govern list, view, create, update, and delete and can filter by the authenticated record. Superusers bypass rules; client tokens are bearer credentials, and logout only removes local state. Test unauthenticated and cross-tenant access, expanded filters, files, and stolen superuser tokens.

## Realtime and hooks share one process

SSE subscriptions deliver accessible record changes. Many long connections consume descriptors and memory; raising `ulimit` tunes capacity but does not provide horizontal scaling. JavaScript or Go hooks intercept request, record, mail, realtime, and backup lifecycles, while blocking work affects the same service.

SQLite excels at single-host, read-heavy systems but is not an automatic multi-primary database. Mounting one `pb_data` volume into several replicas violates its model. Cross-region HA, independent workers, or heavy concurrent writes need a different architecture, not merely a load balancer.

## The official production warning matters

Before v1, PocketBase does not promise full backward compatibility and explicitly discourages production-critical use unless teams follow changelogs and manual migrations. The [production guide](https://pocketbase.io/docs/going-to-production/) covers TLS, systemd, backup, and settings encryption without changing that contract.

Built-in backup snapshots `pb_data` and temporarily makes the app read-only. Larger datasets need a SQLite-safe strategy. Store encrypted backups off-host and restore them; a local backup lost with its server is no backup.

PocketBase fits prototypes, internal tools, personal or small single-host products, and low-friction edge or on-prem apps. Compare Firebase or Convex for managed HA, Appwrite for a full self-host stack, and Nhost or Supabase for SQL GraphQL and RLS. Test binary upgrades, migration rollback, denied rules, SSE reconnection, full disks, and clean-host recovery.

## References

- [PocketBase documentation](https://pocketbase.io/docs/)
- [PocketBase collections](https://pocketbase.io/docs/collections/)
- [PocketBase authentication](https://pocketbase.io/docs/authentication/)
- [PocketBase API rules and filters](https://pocketbase.io/docs/api-rules-and-filters/)
- [PocketBase JavaScript hooks](https://pocketbase.io/docs/js-event-hooks/)
- [PocketBase production guide](https://pocketbase.io/docs/going-to-production/)
