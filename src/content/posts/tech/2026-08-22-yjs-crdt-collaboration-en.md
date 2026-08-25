---
title: "Yjs and CRDTs: Concurrent Editing as Commutative, Replayable Document Updates"
date: 2026-08-22
category: tech
type: deep-dive
tags: [yjs, crdt, collaboration, realtime, offline-first]
lang: en
tldr: "Yjs uses shared types and commutative, associative, idempotent binary updates to converge concurrent edits; it does not prescribe transport or include authorization, persistence, or domain conflict resolution."
description: "Y.Doc, shared types, updates, state vectors, providers, awareness, offline persistence, garbage collection, schema evolution, and CRDT boundaries."
series:
  name: "Technology Choices in the AI Era"
  order: 109
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-yjs-crdt-collaboration)

[Yjs](https://docs.yjs.dev/) is a network-agnostic CRDT implementation. Applications manipulate `Y.Text`, `Y.Map`, `Y.Array`, and other shared types inside a `Y.Doc`; transactions produce compressed binary updates. Updates are commutative, associative, and idempotent, so replicas converge despite ordering and duplication once they possess the same update set.

```ts
import * as Y from "yjs";

const doc = new Y.Doc();
const title = doc.getText("title");
doc.on("update", update => persistAndBroadcast(update));
title.insert(0, "Collaborative editing");
```

## State vectors transfer only missing differences

`encodeStateVector` summarizes known client clocks, letting another replica call `encodeStateAsUpdate(doc, vector)` for missing updates. This is a synchronization optimization, not authorization proof. Verify document read or write access before accepting an update. Opaque binary updates can be oversized or malicious, requiring size, rate, document-growth, and merge-resource limits.

Providers supply transport and persistence through WebSocket, WebRTC, Liveblocks, PartyKit, or custom servers; IndexedDB supports local offline caches. Yjs core does not guarantee provider durability, authentication, multi-region behavior, or backup. Awareness carries ephemeral cursors, selections, and status outside the `Y.Doc`; disconnected clients must not remain permanently present.

## Convergence is not business correctness

CRDTs merge concurrent data-structure edits but cannot decide domain invariants such as two simultaneous payment approvals or a human and agent deleting the same task. Money, inventory, and workflow transitions still need server transactions, preconditions, or a single coordinator. Documents also need schema versions, migrations, snapshots, update compaction, garbage collection, backup and restore, and deletion rules.

Long-lived documents accumulate updates and tombstones; append forever is not a plan. Periodically create snapshots, test restoration, and compact according to provider semantics. Permanent undo or history requires understanding garbage collection and UndoManager scope. Subdocuments split large content at the price of loading, permission, and lifecycle complexity.

Yjs fits rich text, canvases, diagrams, and forms with offline concurrent editing. Liveblocks is a hosted collaboration product; PartyKit and Durable Objects can host custom providers or coordinators; Ably can transport updates while persistence remains separate. Test real document sizes, initial load, offline merge, schema upgrades, hostile clients, revocation, and restoration time.

## References

- [Yjs documentation](https://docs.yjs.dev/)
- [Document updates](https://docs.yjs.dev/api/document-updates)
- [Y.Doc API](https://docs.yjs.dev/api/y.doc)
- [Shared types](https://docs.yjs.dev/api/shared-types)
- [Providers](https://docs.yjs.dev/ecosystem/connection-provider)
- [Awareness and presence](https://docs.yjs.dev/api/about-awareness)
- [Offline support](https://docs.yjs.dev/getting-started/allowing-offline-editing)
