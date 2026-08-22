---
title: "Liveblocks: Collaboration Backends with Presence, Storage, Comments, and Notifications"
date: 2026-08-22
category: tech
type: deep-dive
tags: [liveblocks, collaboration, realtime, crdt, react]
lang: en
tldr: "Liveblocks packages rooms, presence, conflict-free storage, comments, and notifications as managed product primitives; adoption still requires alignment with existing auth, canonical databases, and data lifecycle."
description: "Liveblocks Rooms, Presence, Broadcast, Storage, Yjs, Threads, permissions, authentication, webhooks, retention, and AI agents."
series:
  name: "AI 時代的技術選擇"
  order: 108
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-liveblocks-collaboration-platform)

[Liveblocks](https://liveblocks.io/docs/concepts) is a managed collaboration backend. Rooms commonly represent documents, whiteboards, workflows, or other artifacts and expose Presence, Broadcast, Storage, Threads, and Feeds, plus editor and Yjs integrations, comments UI, mentions, and notifications.

## Separate ephemeral Presence from durable Storage

Presence holds per-connection cursor, selection, and status JSON and resets after disconnect. It is not document content or permanent membership. Broadcast carries non-persistent room events. Storage persists conflict-free structures for shapes, nodes, or cells, while text editors can use a Yjs provider. Merge semantics differ by type: concurrent writes to one `LiveObject` property may use the last modification received by the server. “CRDT” does not mean every semantic conflict disappears.

Comments and Threads, mentions, and Notifications support asynchronous product collaboration. They retain user IDs rather than copying entire user profiles, so applications provide resolvers. Thread visibility, room permissions, and notification recipients must agree, especially for private comments and workspace isolation.

## Product boundaries still determine authorization

Production backends should use a secret key to issue ID tokens; public keys are for prototypes or public apps. ID-token mode can make room default, group, and user access the authorization source. Access-token mode leaves each issuance dependent on the application's canonical ACL. Apply least privilege across `*:read/write` and storage, comments, and feeds scopes. Room IDs are not secrets.

Liveblocks retains realtime Storage, Yjs documents, comments, and some webhook data. Verify region, retention, deletion and export, encryption, backup expectations, webhook retry, and residency. If the application database remains canonical, define Liveblocks as source, cache, or collaboration projection and handle synchronization failure through webhooks and an outbox.

Liveblocks fits products needing multiplayer cursors, shared state, comments, mentions, inboxes, and editor integrations quickly. Yjs is a CRDT engine with selectable providers; Ably is lower-level messaging; PartyKit and Durable Objects run custom room servers. AI agents need distinct IDs, expiring presence, minimal write scopes, attributable actions, and human override.

## References

- [Liveblocks concepts](https://liveblocks.io/docs/concepts)
- [Authentication](https://liveblocks.io/docs/authentication)
- [Permissions](https://liveblocks.io/docs/authentication/permissions)
- [Liveblocks client: Presence and Storage](https://liveblocks.io/docs/api-reference/liveblocks-client)
- [Liveblocks Yjs provider](https://liveblocks.io/docs/api-reference/liveblocks-yjs)
- [Data storage](https://liveblocks.io/docs/platform/data-storage)
