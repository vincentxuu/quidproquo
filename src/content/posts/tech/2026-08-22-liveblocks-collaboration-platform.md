---
title: "Liveblocks：Presence、Storage、Comments 與 Notifications 的協作後端"
date: 2026-08-22
category: tech
type: deep-dive
tags: [liveblocks, collaboration, realtime, crdt, react]
lang: zh-TW
tldr: "Liveblocks 把 room、presence、conflict-free storage、comments 與 notifications 做成 managed product primitives；導入時仍須對齊既有 auth、canonical DB 與 data lifecycle。"
description: "介紹 Liveblocks Rooms、Presence、Broadcast、Storage、Yjs、Threads、permissions、authentication、webhooks、資料保存與 AI agents。"
series:
  name: "AI 時代的技術選擇"
  order: 108
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-liveblocks-collaboration-platform-en)

[Liveblocks](https://liveblocks.io/docs/concepts) 是 managed collaboration backend。Room 通常對應 document、whiteboard、workflow 或其他 artifact，內含 Presence、Broadcast、Storage、Threads、Feeds 等 primitives，另提供 editor/Yjs integrations、comments UI、mentions 與 notifications。

## Ephemeral Presence 與 durable Storage 要分開

Presence 保存 cursor、selection、status 等每個連線的暫時 JSON，disconnect 後重設；不能拿來放文件內容或永久 membership。Broadcast 適合不需持久化的 room event。Storage 使用 conflict-free structures 保存 shapes、nodes 或 cells；文字編輯可接 Yjs provider。每個資料型別的 merge 規則不同，例如同一 `LiveObject` property 的 concurrent write 可能採 server 收到的最後修改，不能籠統稱為「CRDT 就不會衝突」。

Comments/Threads、mentions 與 Notifications 是 product-level asynchronous collaboration。它們保存 user ID 而非自動複製完整 user profile，application 要提供 resolver；thread visibility、room permissions 與 notification recipient 必須一致，尤其 private comments 與 workspace isolation。

## Authentication 與 permissions 仍由產品邊界決定

Production 應由 backend 使用 secret key 簽 ID token，public key 只適合 prototype/public app。ID token 可讓 room 的 default/group/user access 成為 authorization source；若使用 access token 自行決策，必須確保每次簽發都查 canonical ACL。`*:read/write`、storage/comments/feeds scopes 要採 least privilege，room ID 不能當 secret。

Liveblocks 會保存 realtime storage、Yjs documents、comments 與 webhook payload 等資料。導入前要核對 region、retention、delete/export、encryption、backup expectation、webhook retry 與 data residency。若主資料仍在 application DB，需定義 Liveblocks 是 source of truth、cache 還是協作 projection，並透過 webhook/outbox 處理同步失敗。

Liveblocks 適合要快速加入多人游標、shared state、comments、mentions、inbox 與 editor integration 的產品。Yjs 是可自選 provider 的 CRDT engine；Ably 是較底層 messaging；PartyKit/Durable Objects 適合自訂 room server。AI agent 加入 room 時需獨立 user ID、短效 presence、最小 write scope、可回溯 action 與 human override。

## 參考資料

- [Liveblocks concepts](https://liveblocks.io/docs/concepts)
- [Authentication](https://liveblocks.io/docs/authentication)
- [Permissions](https://liveblocks.io/docs/authentication/permissions)
- [Liveblocks client: Presence and Storage](https://liveblocks.io/docs/api-reference/liveblocks-client)
- [Liveblocks Yjs provider](https://liveblocks.io/docs/api-reference/liveblocks-yjs)
- [Data storage](https://liveblocks.io/docs/platform/data-storage)
