---
title: "PartyKit：把每個協作 Room 變成 Edge Stateful Server"
date: 2026-08-22
category: tech
type: deep-dive
tags: [partykit, realtime, websocket, collaboration, edge]
lang: zh-TW
tldr: "PartyKit 以 room-keyed stateful server 收斂 WebSocket coordination，適合多人協作與 presence。託管平台已在 2026-10-23 關閉，同一套模型由 PartyServer 延續，部署到自己的 Cloudflare 帳號；durable document、authorization、hibernation 與資料歸屬仍要明確設計。"
description: "介紹 PartyKit／PartyServer 的 rooms、WebSocket server、broadcast、storage、hibernation、Yjs integration、authentication，以及託管平台關閉後的部署邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 106
draft: false
---

> :globe: [English version](/posts/tech/2026-08-22-partykit-realtime-rooms-en)

[PartyKit](https://docs.partykit.io/) 是為多人與 realtime app 設計的 JavaScript 框架。核心 mental model 是：以 room ID 路由到一個 server instance，由它接受 WebSocket connections、保留 room-local coordination state、broadcast，再視需求寫 storage。這比任意多台 stateless WebSocket server 加全域 pub/sub 更接近 actor 模型。

PartyKit 在 2024-04 被 Cloudflare 收購，之後開發重心移到 [PartyServer](https://github.com/cloudflare/partykit/tree/main/packages/partyserver)。託管平台（`*.partykit.dev` 與 `npx partykit deploy`）在 2026-10-16 停止部署、2026-10-23 關閉，留在平台上的專案與 room 資料一併刪除；用 `npx partykit deploy` 部署到自己 Cloudflare 帳號的 Worker 會繼續跑，但這個指令也不能再用。現在要用這套模型，是安裝 `partyserver`，以普通 Worker 加 Durable Objects 跑在自己的 Cloudflare 帳號，用 `wrangler` 部署、直接付費給 Cloudflare；Cloudflare 的 Agents SDK 也建在 PartyServer 上。Client 端的 `partysocket` 照樣能連。

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

## Room key 是 consistency 與 scaling boundary

Document、game match 或 agent session 可映射成 room。相同 key 的 messages 由同一 coordinator 處理，簡化 ordering 與 presence；不同 rooms 可獨立擴展。這不代表 room 永遠在記憶體或永不重啟。Ephemeral connection/presence state 要能重建，durable document 要寫 storage 或使用 Yjs provider，side effect 則要 idempotent。

每次 WebSocket upgrade 都要在 server 端驗證 token，並確認 user 對該 room 的 read/write role。Room ID 不應是 authorization secret。Broadcast payload 需 schema、size/rate limits；connection metadata 不放可偽造的 user claim。AI agent 加入 room 時也應有獨立 identity、可見 presence、最小權限與 action audit。

## Stateful edge 省掉 coordination，不省掉資料模型

PartyServer 可整合 Yjs（`y-partyserver`，取代舊的 `y-partykit`）、React 與其他 realtime libraries，但 transport、presence、CRDT document 與 canonical business database 是不同層。要決定誰是 source of truth、何時 snapshot/compact、webhook 或 DB write 失敗如何重試、room delete 是否同步刪資料。

PartyServer 的每個 server class 對應一個 Durable Object binding，每個 room 是其中一個 instance，hibernation、storage、alarms 與 limits 都照 [Durable Objects](/posts/tech/2026-08-22-cloudflare-durable-objects) 的規則，wrangler 也不會像舊 PartyKit 那樣自動產生 migration，新增或改名 server class 要自己寫進 `wrangler.jsonc`。它適合自訂 room logic 與協作 server；Liveblocks 提供更完整 comments/presence/storage product primitives；Ably 是 managed pub/sub；直接寫 Durable Objects 則控制力更高、平台細節也更多。

## 更新紀錄

- 2026-11-23：PartyKit 託管平台已於 2026-10-23 關閉，改以 PartyServer 為現行做法：補上收購與關閉時程、程式範例改成 `partyserver` API、Yjs 整合改為 `y-partyserver`、部署邊界改寫成 Durable Objects 規則，並補參考資料

## 參考資料

- [PartyKit documentation](https://docs.partykit.io/)
- [PartyKit server API](https://docs.partykit.io/reference/partyserver-api/)
- [PartyKit configuration](https://docs.partykit.io/reference/partykit-configuration/)
- [PartyKit authentication guide](https://docs.partykit.io/guides/authentication/)
- [PartyServer README](https://github.com/cloudflare/partykit/blob/main/packages/partyserver/README.md)
- [The hosted PartyKit platform is shutting down](https://blog.partykit.io/posts/hosted-platform-shutdown/)
- [Migrate to PartyServer](https://docs.partykit.io/guides/migrate-to-partyserver/)
- [Cloudflare acquires PartyKit](https://blog.cloudflare.com/cloudflare-acquires-partykit/)
