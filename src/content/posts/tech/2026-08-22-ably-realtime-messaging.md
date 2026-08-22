---
title: "Ably：Channels、Presence 與 Recovery 的全球即時訊息平台"
date: 2026-08-22
category: tech
type: deep-dive
tags: [ably, realtime, pubsub, websocket, messaging]
lang: zh-TW
tldr: "Ably 管理全球 realtime connections、channels、presence 與短期 recovery；application 仍要定義 idempotency、durable business state、token capability 與 offline resync。"
description: "介紹 Ably channels、message ordering、delivery、presence、history、connection recovery、token auth、capabilities 與 managed realtime 選型。"
series:
  name: "AI 時代的技術選擇"
  order: 107
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-ably-realtime-messaging-en)

[Ably](https://ably.com/docs) 是 managed realtime messaging platform。Client 維持 Realtime connection，對 channel publish/subscribe，平台處理全球 routing、connection recovery、presence 與 history。它省掉 WebSocket fleet 和跨區 fan-out，不會替 application 定義哪一筆事件是 business truth。

## Channel 是 stream scope，不是 database table

Channel name 常映射 tenant、document、match 或 topic。命名必須避免跨租戶碰撞，也不能把不可猜的名稱當 authorization。Server 應簽發短效 token，透過 capabilities 限定 client 可對哪些 channels 執行 publish、subscribe、presence 或 history；API key 不可放 browser。

Realtime library 對持續連線 subscriber 提供 channel ordering。REST concurrent requests 到達 Ably 的順序可能與 application 發送順序不同，因此需要 producer sequence 或 canonical ordering。Network retry 也可能造成重複：每個 domain event 應帶 stable ID，consumer 做 idempotency，不能把「ordered」誤寫成 exactly-once。

## Recovery 有時間窗，離線仍需 snapshot

Ably connection state 與 message serial 能支援暫時斷線恢復；超出 recovery/history retention、token 失效或 continuity 無法保證時，client 要從 canonical API 取得 snapshot，再接續 live stream。Presence 是目前附著 channel 的 members 與 enter/update/leave events，適合游標和 online indicator，不適合帳務、鎖或永久 membership。

History 可供短期 replay 與除錯，但 retention、pagination、ordering 和費用要核對 plan。若事件必須多年保存或驅動不可逆 workflow，先寫 durable database/log，再以 Ably 發通知；publish 成功也要處理 DB write 與 event publish 的 dual-write，通常用 outbox。

Ably 適合全球 fan-out、device/mobile reconnect、presence 與不想自營 connection infrastructure 的團隊。Socket.IO 適合自架 Node event runtime；PartyKit/Durable Objects 適合 per-room code 與 state；Liveblocks 提供更高階 collaboration primitives。驗收包含 token renewal、capability deny、duplicate、gap、slow consumer、region/provider outage、history expiry、presence ghost 與成本上限。

## 參考資料

- [Ably documentation](https://ably.com/docs)
- [Channels](https://ably.com/docs/channels)
- [Message ordering](https://ably.com/docs/platform/architecture/message-ordering)
- [Connection state recovery](https://ably.com/docs/connect/states)
- [Presence](https://ably.com/docs/presence-occupancy/presence)
- [Token authentication](https://ably.com/docs/auth/token)
- [Capabilities](https://ably.com/docs/auth/capabilities)
