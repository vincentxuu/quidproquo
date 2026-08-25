---
title: "PartyKit: Turning Collaboration Rooms into Stateful Edge Servers"
date: 2026-08-22
category: tech
type: deep-dive
tags: [partykit, realtime, websocket, collaboration, edge]
lang: en
tldr: "PartyKit concentrates WebSocket coordination in room-keyed stateful servers for multiplayer and presence, while durable documents, authorization, hibernation, and platform ownership still need explicit design."
description: "PartyKit parties, rooms, WebSocket servers, broadcast, storage, hibernation, Yjs integration, authentication, and deployment boundaries."
series:
  name: "Technology Choices in the AI Era"
  order: 106
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-partykit-realtime-rooms)

[PartyKit](https://docs.partykit.io/) is a JavaScript platform for multiplayer and realtime applications. Its core model routes a room ID to one `Party.Server` instance that accepts WebSocket connections, keeps room-local coordination state, broadcasts, and optionally writes storage. This resembles an actor more than a fleet of stateless WebSocket servers plus global pub/sub.

```ts
import type * as Party from "partykit/server";

export default class Room implements Party.Server {
  constructor(readonly room: Party.Room) {}
  onMessage(message: string, sender: Party.Connection) {
    this.room.broadcast(message, [sender.id]);
  }
}
```

## The room key is a consistency and scaling boundary

A document, game match, or agent session maps naturally to a room. One coordinator handles messages for the same key, simplifying ordering and presence, while different rooms scale independently. This does not mean a room remains in memory forever or never restarts. Rebuild ephemeral connection state, persist durable documents or use a Yjs provider, and make side effects idempotent.

Authenticate every WebSocket upgrade and authorize read or write access to that room. A room ID is not a secret. Apply schemas and size and rate limits to broadcasts, and never trust user claims copied into connection metadata. AI agents need distinct identities, visible presence, least privilege, and action audit too.

## Stateful edge removes coordination, not data modeling

PartyKit integrates with Yjs, React, and other realtime libraries, but transport, presence, CRDT documents, and the canonical business database remain separate layers. Decide the source of truth, snapshot and compaction rules, retry behavior for webhook or database failures, and room-deletion semantics.

PartyKit originated around edge primitives including Cloudflare Durable Objects. Verify current hosting, limits, regions, hibernation, storage, and export paths rather than inferring from old posts. PartyKit fits custom room logic; Liveblocks supplies a broader comments, presence, and storage product; Ably manages pub/sub; direct Durable Objects offer more control and more platform detail.

## References

- [PartyKit documentation](https://docs.partykit.io/)
- [PartyKit server API](https://docs.partykit.io/reference/partyserver-api/)
- [PartyKit configuration](https://docs.partykit.io/reference/partykit-configuration/)
- [PartyKit authentication guide](https://docs.partykit.io/guides/authentication/)
- [PartyKit with Yjs](https://docs.partykit.io/guides/y-partykit/)
