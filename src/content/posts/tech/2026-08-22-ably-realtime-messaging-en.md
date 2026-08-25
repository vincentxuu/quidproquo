---
title: "Ably: Global Realtime Messaging with Channels, Presence, and Recovery"
date: 2026-08-22
category: tech
type: deep-dive
tags: [ably, realtime, pubsub, websocket, messaging]
lang: en
tldr: "Ably manages global realtime connections, channels, presence, and short-window recovery; applications still own idempotency, durable business state, token capabilities, and offline resynchronization."
description: "Ably channels, message ordering and delivery, presence, history, connection recovery, token authentication, capabilities, and managed realtime selection."
series:
  name: "Technology Choices in the AI Era"
  order: 107
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-ably-realtime-messaging)

[Ably](https://ably.com/docs) is a managed realtime messaging platform. Clients maintain Realtime connections and publish or subscribe to channels while the service handles global routing, connection recovery, presence, and history. It removes WebSocket fleet and cross-region fan-out work, not the definition of business truth.

## A channel is a stream scope, not a database table

Channel names often map to tenants, documents, matches, or topics. Prevent cross-tenant collisions and never treat an unguessable name as authorization. Servers should issue short-lived tokens whose capabilities restrict publish, subscribe, presence, and history by channel. Never ship an API key to a browser.

The Realtime library preserves channel order for continuously connected subscribers. Concurrent REST requests may reach Ably in a different order than application invocation, requiring producer sequence numbers or canonical ordering. Retries can also duplicate messages. Give domain events stable IDs and make consumers idempotent; ordered does not mean exactly once.

## Recovery has a window; offline clients need snapshots

Connection state and message serials support temporary recovery. Beyond recovery or history retention, after token failure, or when continuity cannot be proven, fetch a canonical snapshot and then resume the live stream. Presence represents currently attached members and enter, update, and leave events. It fits cursors and online indicators, not accounting, locks, or permanent membership.

History supports short replay and debugging, but retention, pagination, ordering, and plan cost matter. For events that must survive for years or trigger irreversible workflows, commit a durable database or log first and notify through Ably. Resolve database/publish dual writes with an outbox.

Ably fits global fan-out, mobile reconnects, presence, and teams avoiding connection infrastructure. Socket.IO is a self-hosted Node event runtime; PartyKit and Durable Objects run per-room stateful code; Liveblocks supplies higher-level collaboration primitives. Test token renewal, denied capabilities, duplicates, gaps, slow consumers, provider outages, history expiry, ghost presence, and cost ceilings.

## References

- [Ably documentation](https://ably.com/docs)
- [Channels](https://ably.com/docs/channels)
- [Message ordering](https://ably.com/docs/platform/architecture/message-ordering)
- [Connection state recovery](https://ably.com/docs/connect/states)
- [Presence](https://ably.com/docs/presence-occupancy/presence)
- [Token authentication](https://ably.com/docs/auth/token)
- [Capabilities](https://ably.com/docs/auth/capabilities)
