---
title: "PartyKit：把每個協作 Room 變成 Edge Stateful Server"
date: 2026-08-22
category: tech
type: deep-dive
tags: [partykit, realtime, websocket, collaboration, edge]
lang: zh-TW
tldr: "PartyKit 以 room-keyed stateful server 收斂 WebSocket coordination，適合多人協作與 presence；但 durable document、authorization、hibernation 與 platform ownership 仍要明確設計。"
description: "介紹 PartyKit parties、rooms、WebSocket server、broadcast、storage、hibernation、Yjs integration、authentication 與部署邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 106
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-partykit-realtime-rooms-en)

[PartyKit](https://docs.partykit.io/) 是為多人與 realtime app 設計的 JavaScript platform。核心 mental model 是：以 room ID 路由到一個 `Party.Server` instance，由它接受 WebSocket connections、保留 room-local coordination state、broadcast，再視需求寫 storage。這比任意多台 stateless WebSocket server 加全域 pub/sub 更接近 actor 模型。

```ts
import type * as Party from "partykit/server";

export default class Room implements Party.Server {
  constructor(readonly room: Party.Room) {}
  onMessage(message: string, sender: Party.Connection) {
    this.room.broadcast(message, [sender.id]);
  }
}
```

## Room key 是 consistency 與 scaling boundary

Document、game match 或 agent session 可映射成 room。相同 key 的 messages 由同一 coordinator 處理，簡化 ordering 與 presence；不同 rooms 可獨立擴展。這不代表 room 永遠在記憶體或永不重啟。Ephemeral connection/presence state 要能重建，durable document 要寫 storage 或使用 Yjs provider，side effect 則要 idempotent。

每次 WebSocket upgrade 都要在 server 端驗證 token，並確認 user 對該 room 的 read/write role。Room ID 不應是 authorization secret。Broadcast payload 需 schema、size/rate limits；connection metadata 不放可偽造的 user claim。AI agent 加入 room 時也應有獨立 identity、可見 presence、最小權限與 action audit。

## Stateful edge 省掉 coordination，不省掉資料模型

PartyKit 可整合 Yjs、React 與其他 realtime libraries，但 transport、presence、CRDT document 與 canonical business database 是不同層。要決定誰是 source of truth、何時 snapshot/compact、webhook 或 DB write 失敗如何重試、room delete 是否同步刪資料。

PartyKit 最初以 Cloudflare Durable Objects 等 edge primitive 實作，選型時應核對目前 hosting、limits、region、hibernation、storage 與 export path，而不是只依舊文章推論。它適合自訂 room logic 與協作 server；Liveblocks 提供更完整 comments/presence/storage product primitives；Ably 是 managed pub/sub；直接 Durable Objects 則控制力更高、平台細節也更多。

## 參考資料

- [PartyKit documentation](https://docs.partykit.io/)
- [PartyKit server API](https://docs.partykit.io/reference/partyserver-api/)
- [PartyKit configuration](https://docs.partykit.io/reference/partykit-configuration/)
- [PartyKit authentication guide](https://docs.partykit.io/guides/authentication/)
- [PartyKit with Yjs](https://docs.partykit.io/guides/y-partykit/)
