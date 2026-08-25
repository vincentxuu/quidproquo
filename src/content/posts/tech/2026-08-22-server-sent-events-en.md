---
title: "Server-Sent Events: Recoverable One-Way Push over HTTP Event Streams"
date: 2026-08-22
category: tech
type: deep-dive
tags: [sse, realtime, http, streaming, web-standards]
lang: en
tldr: "SSE sends text/event-stream over ordinary HTTP, with browser reconnection and Last-Event-ID; simple transport is not durable unless the server retains events behind that cursor."
description: "EventSource, text/event-stream, event IDs, retry, replay, authentication, proxy buffering, heartbeats, and SSE versus WebSocket."
series:
  name: "Technology Choices in the AI Era"
  order: 105
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-server-sent-events)

[Server-Sent Events](https://html.spec.whatwg.org/multipage/server-sent-events.html) lets a server push UTF-8 events through a long-running HTTP response. Browser `EventSource` handles parsing and reconnecting, fitting notifications, job progress, LLM token streams, and dashboard updates. Client commands continue over ordinary HTTP.

```text
event: job.progress
id: 1842
retry: 3000
data: {"jobId":"j_9","percent":42}

```

Responses use `text/event-stream`, and a blank line terminates each event. Multiple `data:` lines join with newlines. `event` names the event, `id` updates the client cursor, and `retry` changes reconnection delay. HTTP 204 tells the client not to reconnect.

## Last-Event-ID is a cursor, not history

Browsers send `Last-Event-ID` when reconnecting, but a server without a durable event log cannot replay anything. IDs need a queryable, monotonic meaning within the stream scope. Reauthorize every event after the supplied cursor rather than trusting an arbitrary client ID. When retention has expired, require snapshot resynchronization instead of silently jumping forward.

Native `EventSource` accepts a URL and `withCredentials`, not arbitrary bearer headers. Use secure cookies and same-origin endpoints, or consume a streaming `fetch()` response with a parser. Avoid long-lived access tokens in query strings recorded by logs and history.

## Proxy buffering turns realtime into batches

Reverse proxies, CDNs, compression middleware, and serverless limits may buffer chunks or terminate long responses. Disable inappropriate buffering and compression, send comment heartbeats, detect disconnects, cap per-user connections, and drain during deployment. HTTP/1.x per-origin connection limits are also more visible than HTTP/2 multiplexing.

SSE fits primarily server-to-browser text events and existing HTTP authentication and proxies. Use WebSocket for frequent duplex binary traffic, Socket.IO for rooms and fallback, or Ably for managed global channels. Choose SSE because direction and operations fit, not merely because its first implementation is short.

## References

- [WHATWG Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [MDN Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [MDN EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
