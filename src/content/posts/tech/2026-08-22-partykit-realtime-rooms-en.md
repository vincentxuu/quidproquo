---
title: "PartyKit: Turning Collaboration Rooms into Stateful Edge Servers"
date: 2026-08-22
category: tech
type: deep-dive
tags: [partykit, realtime, websocket, collaboration, edge]
lang: en
tldr: "PartyKit concentrates WebSocket coordination in room-keyed stateful servers for multiplayer and presence. The hosted platform shut down on 2026-10-23, and PartyServer carries the same model into your own Cloudflare account; durable documents, authorization, hibernation, and data ownership still need explicit design."
description: "PartyKit and PartyServer rooms, WebSocket servers, broadcast, storage, hibernation, Yjs integration, authentication, and deployment boundaries after the hosted platform shutdown."
series:
  name: "Technology Choices in the AI Era"
  order: 106
draft: false
---

> :globe: [中文版](/posts/tech/2026-08-22-partykit-realtime-rooms)

[PartyKit](https://docs.partykit.io/) is a JavaScript framework for multiplayer and realtime applications. Its core model routes a room ID to one server instance that accepts WebSocket connections, keeps room-local coordination state, broadcasts, and optionally writes storage. This resembles an actor more than a fleet of stateless WebSocket servers plus global pub/sub.

Cloudflare acquired PartyKit in 2024-04, and development then moved to [PartyServer](https://github.com/cloudflare/partykit/tree/main/packages/partyserver). The hosted platform (`*.partykit.dev` and `npx partykit deploy`) stopped accepting deploys on 2026-10-16 and shut down on 2026-10-23, deleting the projects and room data still on it; Workers deployed to your own Cloudflare account with `npx partykit deploy` keep running, but that command no longer works either. Using this model today means installing `partyserver` and running it as an ordinary Worker with Durable Objects in your own Cloudflare account, deployed with `wrangler` and billed by Cloudflare directly; Cloudflare's Agents SDK is also built on PartyServer. Clients using `partysocket` still connect.

```ts
import { Server, routePartykitRequest, type Connection } from "partyserver";

export class Room extends Server {
  onMessage(sender: Connection, message: string) {
    this.broadcast(message, [sender.id]);
  }
}

export default {
  async fetch(request: Request, env: Env) {
    return (await routePartykitRequest(request, env)) ??
      new Response("Not Found", { status: 404 });
  },
};
```

## The room key is a consistency and scaling boundary

A document, game match, or agent session maps naturally to a room. One coordinator handles messages for the same key, simplifying ordering and presence, while different rooms scale independently. This does not mean a room remains in memory forever or never restarts. Rebuild ephemeral connection state, persist durable documents or use a Yjs provider, and make side effects idempotent.

Authenticate every WebSocket upgrade and authorize read or write access to that room. A room ID is not a secret. Apply schemas and size and rate limits to broadcasts, and never trust user claims copied into connection metadata. AI agents need distinct identities, visible presence, least privilege, and action audit too.

## Stateful edge removes coordination, not data modeling

PartyServer integrates with Yjs (`y-partyserver`, replacing the old `y-partykit`), React, and other realtime libraries, but transport, presence, CRDT documents, and the canonical business database remain separate layers. Decide the source of truth, snapshot and compaction rules, retry behavior for webhook or database failures, and room-deletion semantics.

Each PartyServer server class maps to one Durable Object binding and each room is one instance of it, so hibernation, storage, alarms, and limits follow [Durable Objects](/posts/tech/2026-08-22-cloudflare-durable-objects-en) rules; wrangler also does not generate migrations the way PartyKit did, so adding or renaming a server class means editing `wrangler.jsonc` yourself. PartyServer fits custom room logic; Liveblocks supplies a broader comments, presence, and storage product; Ably manages pub/sub; writing Durable Objects directly offers more control and more platform detail.

## Update Log

- 2026-11-23: The hosted PartyKit platform shut down on 2026-10-23, so PartyServer is now the current path: added the acquisition and shutdown timeline, switched the code sample to the `partyserver` API, changed the Yjs integration to `y-partyserver`, rewrote the deployment boundary in terms of Durable Objects, and added references.

## References

- [PartyKit documentation](https://docs.partykit.io/)
- [PartyKit server API](https://docs.partykit.io/reference/partyserver-api/)
- [PartyKit configuration](https://docs.partykit.io/reference/partykit-configuration/)
- [PartyKit authentication guide](https://docs.partykit.io/guides/authentication/)
- [PartyServer README](https://github.com/cloudflare/partykit/blob/main/packages/partyserver/README.md)
- [The hosted PartyKit platform is shutting down](https://blog.partykit.io/posts/hosted-platform-shutdown/)
- [Migrate to PartyServer](https://docs.partykit.io/guides/migrate-to-partyserver/)
- [Cloudflare acquires PartyKit](https://blog.cloudflare.com/cloudflare-acquires-partykit/)
