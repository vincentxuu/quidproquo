---
title: "Socket.IO: Realtime Events with Rooms, Acknowledgements, and Recovery"
date: 2026-08-22
category: tech
type: deep-dive
tags: [socketio, websocket, realtime, nodejs]
lang: en
tldr: "Socket.IO is an event protocol and runtime over WebSocket or long-polling, not a native WebSocket compatibility layer; ordering, arrival, recovery, and horizontal scaling need separate designs."
description: "Socket.IO events, acknowledgements, rooms, namespaces, delivery guarantees, connection recovery, adapters, and production scaling."
series:
  name: "Technology Choices in the AI Era"
  order: 103
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-socketio-realtime-events)

[Socket.IO](https://socket.io/docs/v4/) provides named events, automatic reconnection, acknowledgements, rooms, namespaces, and adapters above Engine.IO transports. It commonly uses WebSocket and can upgrade from HTTP long-polling. A Socket.IO client cannot connect directly to a plain WebSocket server because the wire protocols differ.

## Ordering is not delivery

Socket.IO preserves the order of messages that arrive, including across a transport upgrade, but default arrival is at-most-once. An event in flight during failure can disappear, and servers do not retain every event for disconnected clients. Client retries plus acknowledgements can approximate client-to-server at-least-once, but browser refresh loses in-memory pending work and retries create duplicates. Handlers therefore need event IDs and idempotency.

Server-to-client replay requires persisted events, a client offset, and a missed-event query after reconnect. Connection state recovery temporarily stores IDs, rooms, data, and packets, yet the documentation warns that recovery can fail; clients still need full-state synchronization. `skipMiddlewares` may let a user disabled during disconnection bypass renewed checks and deserves security review.

## A room is not a database

Rooms are server-side memberships and fan-out targets for documents, tenants, or matches. Namespaces divide larger protocol surfaces. Membership disappears on disconnect and is not durable authorization or authoritative presence. Validate resource access whenever joining, then apply runtime schemas, rate limits, and payload limits to events.

Multiple instances broadcast through adapters. Recovery support varies: plain Redis Pub/Sub cannot retain packets, whereas a durable adapter such as Redis Streams may support it. Test load balancing, sticky sessions, polling, and adapter failure against the selected transport configuration.

Socket.IO fits browser and app event APIs needing fallback, rooms, and a mature Node ecosystem. Native WebSocket leaves protocol design to the application; SSE handles one-way push; Ably manages messaging; PartyKit places room state in edge servers. Acceptance should cover offline replay, fan-out, slow consumers, auth renewal, deployment draining, and adapter outages—not only a working chat demo.

## References

- [Socket.IO documentation](https://socket.io/docs/v4/)
- [How Socket.IO works](https://socket.io/docs/v4/how-it-works/)
- [Delivery guarantees](https://socket.io/docs/v4/delivery-guarantees)
- [Connection state recovery](https://socket.io/docs/v4/connection-state-recovery)
- [Rooms](https://socket.io/docs/v4/rooms/)
- [Adapters](https://socket.io/docs/v4/adapter/)
