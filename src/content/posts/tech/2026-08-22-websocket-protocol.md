---
title: "WebSocket：雙向長連線只是起點，Protocol 與 Backpressure 才是工程"
date: 2026-08-22
category: tech
type: deep-dive
tags: [websocket, realtime, networking, web-standards]
lang: zh-TW
tldr: "WebSocket 提供一條雙向 message transport，不包含 auth renewal、schema、ack、replay、rooms 或 backpressure policy；這些才決定 production correctness。"
description: "介紹 WebSocket handshake、frames、subprotocol、origin/auth、heartbeat、backpressure、reconnect、horizontal scaling 與部署邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 104
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-websocket-protocol-en)

[WebSocket](https://datatracker.ietf.org/doc/html/rfc6455) 透過 HTTP Upgrade 建立長期、全雙工的 message connection，之後可傳 text、binary、ping/pong 與 close frames。瀏覽器 API 很小，這表示 application 必須自己定義 message envelope、version、error、ack、authorization、reconnect 與 replay。

```json
{"v":1,"id":"evt_123","type":"cursor.move","room":"doc_9","data":{"x":12,"y":30}}
```

## 連線驗證不是永久授權

Browser WebSocket constructor 不能任意設定 `Authorization` header，常見做法是 secure same-site cookie、短效 query ticket 或先以 HTTPS 交換一次性 token。Server 必須驗證 `Origin`，不能把 CORS 當 WebSocket 防護。連線建立後，每個 join/action 還要做 resource authorization；role 被撤銷或 token 過期時要重新驗證或主動斷線。

Ping/pong 可偵測 half-open connection，但 browser API 不直接暴露 protocol ping；application heartbeat、proxy idle timeout 與 mobile background 行為需一起設計。Reconnect 應使用 exponential backoff + jitter，並以 session cursor 決定 replay 或 snapshot resync，不能假設 TCP reconnect 延續舊 session。

## 標準 WebSocket API 沒有 backpressure

MDN 明確指出穩定的 `WebSocket` interface 不會自動 backpressure；若 producer 比 consumer 快，buffer、記憶體與 CPU 可能失控。要監看 `bufferedAmount`、限制 per-connection queue、合併 cursor/presence updates、drop 可丟事件，對不可丟事件則落 durable log。`WebSocketStream` 能利用 Streams backpressure，但仍是 non-standard、支援有限，不能當通用解法。

水平擴展要決定 connection affinity、room directory、cross-node fan-out、deploy drain 與 presence consistency。WebSocket 本身沒有 ordering across reconnect、exactly-once 或 durable history。Socket.IO 加入 event/recovery abstractions；SSE 簡化單向 push；Ably 提供 managed channels；PartyKit/Durable Objects 以單一 room coordinator 降低分散式狀態複雜度。

## 參考資料

- [RFC 6455: The WebSocket Protocol](https://datatracker.ietf.org/doc/html/rfc6455)
- [MDN WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [MDN WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [MDN Writing WebSocket client applications](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications)
- [WebSocketStream](https://developer.mozilla.org/en-US/docs/Web/API/WebSocketStream)
