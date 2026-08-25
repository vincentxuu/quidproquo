---
title: "WebSocket: Duplex Connections Are the Start; Protocol and Backpressure Are the Work"
date: 2026-08-22
category: tech
type: deep-dive
tags: [websocket, realtime, networking, web-standards]
lang: en
tldr: "WebSocket supplies a duplex message transport, not auth renewal, schemas, acknowledgements, replay, rooms, or backpressure policy; those layers determine production correctness."
description: "WebSocket handshakes, frames, subprotocols, origin and auth, heartbeats, backpressure, reconnects, horizontal scaling, and deployment boundaries."
series:
  name: "Technology Choices in the AI Era"
  order: 104
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-websocket-protocol)

[WebSocket](https://datatracker.ietf.org/doc/html/rfc6455) upgrades an HTTP connection into a persistent full-duplex message channel carrying text, binary, ping/pong, and close frames. The browser API is intentionally small, leaving message envelopes, versions, errors, acknowledgements, authorization, reconnects, and replay to applications.

```json
{"v":1,"id":"evt_123","type":"cursor.move","room":"doc_9","data":{"x":12,"y":30}}
```

## Connection authentication is not permanent authorization

The browser constructor cannot set an arbitrary `Authorization` header. Common patterns use secure same-site cookies, short-lived query tickets, or one-time tokens obtained over HTTPS. Servers must validate `Origin`; CORS is not WebSocket protection. Every room join and action still needs resource authorization, with revalidation or disconnect when roles change or tokens expire.

Ping/pong detects half-open connections, but browser code cannot emit protocol pings directly. Coordinate application heartbeats, proxy idle timeouts, and mobile background behavior. Reconnect with exponential backoff and jitter, then use a session cursor to replay or fetch a snapshot. A new TCP connection does not continue an old application session.

## The standard API has no backpressure

MDN notes that stable `WebSocket` does not apply backpressure. If producers outrun consumers, buffers, memory, and CPU can grow unchecked. Observe `bufferedAmount`, cap per-connection queues, coalesce cursor or presence updates, and drop explicitly disposable events; durable events belong in a log. `WebSocketStream` uses Streams backpressure but remains non-standard with limited support.

Horizontal scaling requires connection affinity, room directories, cross-node fan-out, deployment draining, and a presence consistency model. WebSocket provides no ordering across reconnects, exactly-once behavior, or durable history. Socket.IO adds event and recovery abstractions; SSE simplifies one-way push; Ably manages channels; PartyKit and Durable Objects use a room coordinator to reduce distributed-state complexity.

## References

- [RFC 6455: The WebSocket Protocol](https://datatracker.ietf.org/doc/html/rfc6455)
- [MDN WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [MDN WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [MDN Writing WebSocket client applications](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications)
- [WebSocketStream](https://developer.mozilla.org/en-US/docs/Web/API/WebSocketStream)
