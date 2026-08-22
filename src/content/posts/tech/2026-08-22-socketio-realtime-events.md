---
title: "Socket.IO：Rooms、Acknowledgements 與斷線恢復的即時事件層"
date: 2026-08-22
category: tech
type: deep-dive
tags: [socketio, websocket, realtime, nodejs]
lang: zh-TW
tldr: "Socket.IO 是建立在 WebSocket／long-polling 上的事件協定與 runtime，不是原生 WebSocket 相容層；ordering、arrival、recovery 與水平擴展要分開設計。"
description: "介紹 Socket.IO events、acknowledgements、rooms、namespaces、delivery guarantees、connection recovery、adapters 與 production scaling。"
series:
  name: "AI 時代的技術選擇"
  order: 103
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-socketio-realtime-events-en)

[Socket.IO](https://socket.io/docs/v4/) 在 Engine.IO transport 上提供具名稱的 events、automatic reconnection、acknowledgements、rooms、namespaces 與 adapters。它通常使用 WebSocket，也能從 HTTP long-polling upgrade；Socket.IO client 不能直接連原生 WebSocket server，wire protocol 不相同。

## Ordering 不等於 delivery

Socket.IO 保證已到達的 messages 維持送出順序，即使 transport upgrade；預設 arrival guarantee 卻是 at-most-once。斷線當下的 event 可能遺失，server 也不會自動為 disconnected client 保存全部事件。Client `retries` + acknowledgement 可近似 client-to-server at-least-once，但 browser refresh 仍會清掉 pending memory，而且重試會產生 duplicate，因此 handler 要以 event ID 做 idempotency。

Server-to-client replay 需要持久化 event、保存 client offset，重連後查回 missed events。Connection state recovery 可暫存 socket ID、rooms、data 與 packets，但官方明確指出 recovery 不保證成功；失敗時仍需 full state resync。`skipMiddlewares` 可能讓斷線期間被停權的 user 跳過重新驗證，安全上應審慎使用。

## Room 不是資料庫

Room 是 server-side membership 與 fan-out target，適合 document、tenant 或 match；namespace 則分隔較大的 protocol surface。Room membership 在 disconnect 後消失，不能當 durable authorization 或 presence truth。每次 join 都要依 authenticated identity 驗證 resource access，event payload 也要 runtime validation、rate limit 與 size limit。

多 instance 透過 adapter 廣播。不同 adapter 對 recovery 支援不同：plain Redis Pub/Sub adapter 無法保存 packets，Redis Streams 等 durable adapter 才可能支援。Load balancer、sticky session、long-polling 與 adapter failure mode 要依實際 transport 設定測試。

Socket.IO 適合 browser/app event API、需要 fallback、rooms 與成熟 Node ecosystem 的產品。原生 WebSocket 適合自行定義 protocol；SSE 適合單向 server push；Ably 是 managed messaging；PartyKit 把 room state 放到 edge server。選型應以 offline/replay contract、最大 fan-out、slow consumer、auth renewal、deploy drain 與 adapter outage 驗收，而不是只確認聊天 demo 能動。

## 參考資料

- [Socket.IO documentation](https://socket.io/docs/v4/)
- [How Socket.IO works](https://socket.io/docs/v4/how-it-works/)
- [Delivery guarantees](https://socket.io/docs/v4/delivery-guarantees)
- [Connection state recovery](https://socket.io/docs/v4/connection-state-recovery)
- [Rooms](https://socket.io/docs/v4/rooms/)
- [Adapters](https://socket.io/docs/v4/adapter/)
