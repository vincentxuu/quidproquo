---
title: "Yjs 與 CRDT：把並行編輯變成可交換、可重放的 Document Updates"
date: 2026-08-22
category: tech
type: deep-dive
tags: [yjs, crdt, collaboration, realtime, offline-first]
lang: zh-TW
tldr: "Yjs 用 shared types 與可交換、可結合、冪等的 binary updates 收斂 concurrent edits；它不綁 transport，也不自帶 authorization、persistence 或 domain conflict resolution。"
description: "介紹 Y.Doc、shared types、updates、state vectors、providers、awareness、offline persistence、garbage collection、schema evolution 與 CRDT 邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 109
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-yjs-crdt-collaboration-en)

[Yjs](https://docs.yjs.dev/) 是 network-agnostic CRDT implementation。Application 在 `Y.Doc` 內操作 `Y.Text`、`Y.Map`、`Y.Array` 等 shared types；每次 transaction 產生 compressed binary update。Updates 具 commutative、associative、idempotent 性質：順序不同或重複套用仍能收斂，只要最終收到相同更新集合。

```ts
import * as Y from "yjs";

const doc = new Y.Doc();
const title = doc.getText("title");
doc.on("update", update => persistAndBroadcast(update));
title.insert(0, "共同編輯");
```

## State vector 只傳缺少的差異

`encodeStateVector` 描述 client 已知 clocks，另一端可用 `encodeStateAsUpdate(doc, vector)` 只編碼缺少的 updates。這是 sync efficiency，不是 authorization proof；server 必須先確認 user 能讀寫該 document，再接受 update。Opaque binary update 也可能非常大或惡意，需限制 size、rate、document growth 與 decompression/merge 資源。

Provider 負責傳輸與持久化：WebSocket、WebRTC、Liveblocks、PartyKit 或自架 server 都可；IndexedDB provider 支援 local/offline cache。Yjs core 不承諾某個 provider 的 durability、auth、multi-region 或 backup。Awareness protocol 傳 cursor、selection、user status 等 ephemeral state，不保存在 `Y.Doc`，offline client 也不應永久留在 presence。

## Convergence 不等於 business correctness

CRDT 能解決資料結構層 concurrent merge，不能決定「兩人同時核准付款」「agent 與人同時刪除同一任務」的 domain invariant。Money、inventory、approval transition 仍需 server transaction、version/precondition 或單一 coordinator。Yjs document 也要 schema version、migration、snapshot、update compaction、garbage collection、backup/restore 與 delete semantics。

長時間 document 累積 updates 與 tombstones，不能只永遠 append。Server 應定期產生 snapshot/state update、驗證 restore，再依 provider 能力 compact；若需永久 undo/history，須理解 garbage collection 與 UndoManager scope 的取捨。Subdocuments 可切大型文件，會增加 loading、permission 與 lifecycle 複雜度。

Yjs 適合 rich-text、canvas、diagram、form 等 offline/concurrent editing。Liveblocks 是 hosted collaboration product，PartyKit/Durable Objects 可承載自訂 provider/coordinator，Ably 可傳 updates 但 persistence 仍另建。採用前先用真實 document 測 update size、首次載入、離線合併、schema upgrade、惡意 client、權限撤銷與 restore time。

## 參考資料

- [Yjs documentation](https://docs.yjs.dev/)
- [Document updates](https://docs.yjs.dev/api/document-updates)
- [Y.Doc API](https://docs.yjs.dev/api/y.doc)
- [Shared types](https://docs.yjs.dev/api/shared-types)
- [Providers](https://docs.yjs.dev/ecosystem/connection-provider)
- [Awareness and presence](https://docs.yjs.dev/api/about-awareness)
- [Offline support](https://docs.yjs.dev/getting-started/allowing-offline-editing)
