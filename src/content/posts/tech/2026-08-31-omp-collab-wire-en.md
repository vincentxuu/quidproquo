---
title: "OMP Internal Design #13: collab-web & wire protocol — How Multi-User Sessions Serialize, Guest Permission Boundaries, and Composer Interrupt Broadcast"
date: 2026-08-31
category: tech
type: deep-dive
tags: ["omp", "collab", "wire-protocol", "real-time", "encryption", "web"]
lang: en
description: "Deep dive into how omp implements end-to-end encrypted real-time multi-user collaboration with a custom wire protocol: guest permission model, composer interrupt broadcast, snapshot-chunk framing, and why not CRDT/WebRTC."
tldr: "omp collab uses a hub topology (host authoritative, guests never peer) with AES-256-GCM sealed JSON frames, 4-byte envelope, and snapshot-chunk sharding. Guest permissions are bound to a 16-byte write token in the link, verified by the host via timing-safe comparison."
series:
  name: "OMP Internals Deep Dive"
  order: 13
---

## TL;DR

- **Architecture**: Hub topology — host is authoritative, guests never peer. All payloads AES-256-GCM sealed before hitting the socket; relay sees only ciphertext + 4-byte peerId.
- **Wire protocol**: `packages/wire/src/index.ts` defines the complete JSON schema (`WireFrame`, `CollabFrame`, `GuestFrame`/`HostFrame`). Version `COLLAB_PROTO = 3` introduces `ui-request`/`ui-request-end` for host→guest select/editor interactions.
- **Guest permissions**: Full link = 48 bytes (32-byte key + 16-byte write token); view-only link = 32-byte bare key. Host verifies token with `timingSafeEqual`, rejects `prompt`/`abort`/`agent-cmd`/`ui-response` from peers without a valid token.
- **Snapshot transport**: `welcome` carries only metadata + `entryCount`; actual transcript split into ≤ 512 KB `snapshot-chunk` frames. The final chunk (`final: true`) transitions guest to `live` phase, avoiding a single giant frame stalling the 30s welcome timeout.
- **Composer interrupt**: Guest sends `abort` frame; host validates permission, calls `session.abort({ reason: USER_INTERRUPT_LABEL })`, then broadcasts `event: agent_end` + `state: isStreaming=false` — all guests sync-stop their streaming indicators.
- **Why custom protocol**: CRDTs suit symmetric co-editing, not "host runs agent/tools/subagents, guests only observe + command". WebRTC adds NAT traversal, signaling, mesh complexity; relay only needs to be a blind pipe. E2E encryption compresses the trust boundary to link possession.

---

## Context

`/collab` shares a running omp session in real-time with any number of guests — another omp TUI on a different machine, or a browser opening `my.omp.sh/#<link>`. Guests see the **exact same transcript**: streaming text, thinking blocks, tool cards, footer state (cwd, model, context %, cost), ctrl+o expansions, `/dump` output. Guests can even **send prompts, press Esc to interrupt, operate the Agent Hub (chat/kill/revise/subagent transcript)**.

Key constraints:

1. **Host runs all tools** — bash, python, LSP, file I/O, subagent spawn; guests never touch the host filesystem.
2. **E2E encryption** — relay is content-blind: sees only roomId, connection count, opaque ciphertext, 4-byte routing prefix.
3. **Guest permissions determined by the link** — full link = writable, view link = read-only. Host stores no ACL; verification uses `timingSafeEqual`.
4. **Seamless reconnection** — on reconnect, host re-sends full snapshot (including new entries); guest resumes via the same replica file.

---

## Problem

In this asymmetric collaboration model, solve:

1. **How to serialize, shard, and apply session in order?** Transcript can be multi-MB; a single frame would blow relay/guest timeouts.
2. **How to enforce guest permission boundaries with "stateless relay + untrusted guests"?** Relay can't authorize; host must reject malicious frames in constant time.
3. **How to broadcast composer interrupt (Esc) so everyone stops in sync?** Must distinguish "host ended turn" vs "guest requested interrupt".
4. **Why not Yjs/Automerge (CRDT) or WebRTC?** Those solve symmetric co-editing, not "host unilaterally executes, guests unilaterally observe + command".

---

## Attempts

### Attempt 1: Store entire transcript as CRDT, guests sync directly

Yjs/Automerge treat each entry as a concurrently editable data structure. But omp session isn't "multi-user editing" — **only one writer (host agent)**. A guest's prompt is just "insert a user message for host's LLM"; guest local edits never conflict. CRDT's GC, version vectors, merge logic add complexity and can't natively express the strict ordering of "tool call → tool result" event chains.

### Attempt 2: WebRTC mesh, guests connect directly to host

WebRTC requires ICE/STUN/TURN, signaling server, connection management. For "host carries a few guests, relay just blind pipes", mesh brings NAT traversal, reconnection logic, peer discovery costs that far outweigh benefits. E2E encryption in mesh needs pairwise key agreement — far more complex than "link carries 32-byte key directly".

### Attempt 3: Single giant welcome frame with full transcript

Early protocol v1 did this. But 10 MB transcript → > 10 MB after AES-GCM, exceeding relay `maxPayloadLength` and guest 30s welcome timeout. Evolved to v2: `welcome` carries only `entryCount` + metadata; transcript streams via `snapshot-chunk` shards (≤ 512 KB each). Guest resets 30s progress timeout on each chunk arrival.

---

## Solution

### 1. Wire Protocol: `packages/wire/src/index.ts` as Single Source of Truth

Both ends (TUI guest, browser collab-web) and host share the same TypeScript interfaces. Key types:

```typescript
// packages/wire/src/index.ts#WireFrame
export type WireFrame = GuestFrame | HostFrame;

// Guest → Host
export type GuestFrame =
  | { t: "hello"; proto: number; name: string; writeToken?: string }
  | { t: "prompt"; text: string; images?: ImageContent[] }
  | { t: "ui-response"; reqId: number; value?: CollabUiResponseValue }
  | { t: "abort" }
  | { t: "agent-cmd"; cmd: "chat" | "kill" | "revive"; agentId: string; text?: string }
  | { t: "fetch-transcript"; reqId: number; agentId: string; fromByte: number };

// Host → Guest
export type HostFrame =
  | { t: "welcome"; proto: number; header: SessionHeader; state: SessionState; agents: AgentSnapshot[]; entryCount: number; readOnly?: boolean }
  | { t: "snapshot-chunk"; entries: SessionEntry[]; final: boolean }
  | { t: "entry"; entry: SessionEntry }
  | { t: "event"; event: AgentEvent }
  | { t: "state"; state: SessionState }
  | { t: "bus"; channel: BusChannel; data: unknown }
  | { t: "agents"; agents: AgentSnapshot[] }
  | { t: "ui-request"; request: CollabUiRequest }
  | { t: "ui-request-end"; reqId: number }
  | { t: "transcript"; reqId: number; text: string; newSize: number; error?: string }
  | { t: "bye"; reason: string }
  | { t: "error"; message: string };
```

**Version evolution**:

| Version | Key Change |
|---------|------------|
| 1 (legacy) | `welcome` inlined full `entries` array |
| 2 | `welcome` carries only `entryCount`; transcript via `snapshot-chunk` shards |
| 3 (current) | Added `ui-request`/`ui-request-end`/`ui-response` for host→writable-guest select/editor interactions |

`COLLAB_PROTO = 3` exchanged at `hello`; host rejects legacy guests (they'd hang on `ui-request` forever).

### 2. Envelope: `[4B uint32 BE peerId][sealed payload]`

```typescript
// packages/wire/src/index.ts#ENVELOPE_HEADER_LENGTH
export const ENVELOPE_HEADER_LENGTH = 4;

export function packEnvelope(peerId: number, sealed: Uint8Array): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(ENVELOPE_HEADER_LENGTH + sealed.byteLength);
  new DataView(out.buffer).setUint32(0, peerId, false); // big-endian
  out.set(sealed, ENVELOPE_HEADER_LENGTH);
  return out;
}
```

- **Host → relay**: `peerId = 0` = broadcast to all guests; `peerId = N` = targeted to guest N (e.g., `ui-request`, `transcript` replies).
- **Guest → relay**: Always sends `peerId = 0`; relay **in-place rewrites** to the sender's actual peerId before forwarding to host.
- **Relay only does**: WebSocket upgrade, peer counting, envelope rewrite, control messages (`peer-joined`/`peer-left`/`room-closed`) as plain TEXT JSON.

### 3. Link Format & Permission Binding

```
<roomId>.<base64url(key || key+writeToken)>     → default relay (wss://my.omp.sh)
host[:port]/r/<roomId>.<key>                    → custom relay
https://web.example/collab/#<relay-link>        → browser deep link, fragment carries relay-specific link
```

- **Full link (48 bytes)**: `key(32) || writeToken(16)` → `base64url`. Holder can prompt, abort, agent-cmd, ui-response.
- **View link (32 bytes)**: bare key. Read-only.

Host verification:

```typescript
// packages/coding-agent/src/collab/host.ts#verifyWriteToken
#verifyWriteToken(token: string | undefined): boolean {
  const expected = this.#writeToken;
  if (!expected || !token) return false;
  const bytes = Buffer.from(token, "base64url");
  return bytes.byteLength === expected.byteLength && timingSafeEqual(bytes, expected);
}
```

`timingSafeEqual` prevents timing attacks. Invalid-token peers get `canWrite = false`; host rejects their mutating frames with targeted `error: "prompting is disabled on a read-only link"`.

### 4. Session Serialization & Snapshot-Chunk Sharding

**Host side** `packages/coding-agent/src/collab/host.ts#sendSnapshotChunks`:

```typescript
const SNAPSHOT_CHUNK_BYTES = 512 * 1024;

#sendSnapshotChunks(entries: WireSessionEntry[], fromPeer: number): void {
  if (entries.length === 0) {
    socket.send({ t: "snapshot-chunk", entries: [], final: true }, fromPeer);
    return;
  }
  let i = 0;
  while (i < entries.length) {
    const batch: WireSessionEntry[] = [];
    let batchBytes = 0;
    while (i < entries.length) {
      const entry = entries[i];
      const shrunk = shrinkForReplication(entry); // truncate oversized tool results
      const entryBytes = JSON.stringify(shrunk).length;
      if (batch.length > 0 && batchBytes + entryBytes > SNAPSHOT_CHUNK_BYTES) break;
      batch.push(shrunk);
      batchBytes += entryBytes;
      i++;
    }
    socket.send({ t: "snapshot-chunk", entries: batch, final: i >= entries.length }, fromPeer);
  }
}
```

- `shrinkForReplication`: truncates/removes oversized tool results (huge grep output, base64 images) so no single entry blows the chunk.
- Each chunk independently AES-GCM sealed; guest appends to replica immediately, no need to wait for all shards.
- Final chunk `final: true` triggers guest transition to `live` phase, starts receiving live `event`/`entry`/`state`.

**Guest (TUI)** `packages/coding-agent/src/collab/guest.ts#accumulateSnapshotChunk`:

```typescript
#accumulateSnapshotChunk(frame: SnapshotChunkFrame): boolean {
  const pending = this.#pendingSnapshot;
  pending.entries.push(...frame.entries);
  const complete = frame.final || pending.entries.length >= pending.entryCount;
  if (complete) this.#clearSnapshotProgressTimer();
  else this.#armSnapshotProgressTimer(); // reset 30s timeout
  return complete;
}
```

**Guest (Web)** `packages/collab-web/src/lib/client.ts#applyFrame`:

```typescript
case "snapshot-chunk":
  this.#entries = [...this.#entries, ...frame.entries];
  if (frame.final) {
    this.#clearSnapshotProgressTimer();
    this.#phase = "live";
  } else {
    this.#armSnapshotProgressTimer();
  }
  break;
```

### 5. Live Event/Entry/State Broadcast

Host syncs via three channels:

| Frame | Trigger | Guest Behavior |
|-------|---------|----------------|
| `entry` | `SessionManager.onEntryAppended` | Write to replica file, `agent.replaceMessages` updates message array (for `/dump`, context estimation) |
| `event` | `AgentSessionEvent` emitted | Feed directly to `EventController.handleEvent` — **event-only rendering**, no double-render with entry |
| `state` | `STATE_TRIGGER_EVENTS` fires, 100ms debounce + JSON diff dedupe | Updates footer (streaming flag, model, thinking level, context %, participants) |

Key detail: `message_update` event **carries the full accumulating partial message** — guest needs no delta tracking, just overwrites the `stream` ghost.

```typescript
// packages/wire/src/index.ts#AgentEvent
| { type: "message_update"; message: WireMessage } // Carries the FULL accumulating partial message — no delta tracking needed.
```

### 6. Composer Interrupt (Esc) Broadcast Mechanism

**Guest initiates**:

```typescript
// packages/collab-web/src/components/shell/Composer.tsx
<button onClick={() => client.sendAbort()}>
  <Square size={11} /> Stop
</button>

// packages/collab-web/src/lib/client.ts#sendAbort
sendAbort(): void {
  this.#socket.send({ t: "abort" });
}
```

**Host receives & handles** `packages/coding-agent/src/collab/host.ts#handleAbort`:

```typescript
#handleAbort(fromPeer: number): void {
  const peer = this.#peers.get(fromPeer);
  if (!peer?.canWrite) {
    this.#rejectReadOnly("interrupting", fromPeer);
    return;
  }
  const name = peer.name;
  void this.#ctx.session
    .abort({ reason: USER_INTERRUPT_LABEL })
    .then(() => this.#ctx.session.emitNotice("info", `${name} interrupted`, "collab"))
    .catch(err => logger.warn("collab guest abort failed", { error: String(err) }));
}
```

**Subsequent broadcast**:

1. `session.abort()` emits `agent_end` event → host's event subscription receives → `#broadcast({ t: "event", event: ... })` → all guests receive `event: { type: "agent_end" }`.
2. `agent_end` triggers `STATE_TRIGGER_EVENTS` → `#scheduleStateBroadcast()` → 100ms later sends `state: { isStreaming: false, ... }` → all guests sync-update footer, stop spinner.

**Permission isolation**: View-only guest sending `abort` gets intercepted by `#rejectReadOnly`, receives targeted `error` frame, no effect on host or other guests.

### 7. UI Request (select/editor) Bidirectional Interaction

When host encounters `ask` (select/editor):

```typescript
// packages/coding-agent/src/collab/host.ts#requestGuestUi
requestGuestUi(request: CollabUiRequestDraft, signal?: AbortSignal): Promise<CollabGuestUiResult> | null {
  if (!this.#socket || !this.#hasWritablePeers()) return null;
  const reqId = ++this.#uiReqSeq;
  const fullRequest: CollabUiRequest = { ...request, reqId };
  this.#pendingUi.set(reqId, { request: fullRequest, settle });
  this.#sendWritablePeers({ t: "ui-request", request: fullRequest }); // only to writable guests
  return promise;
}
```

Guest (Web) renders select options or editor textarea in Composer area:

```typescript
// packages/collab-web/src/components/shell/Composer.tsx
if (uiRequest && canPrompt) {
  return uiRequest.kind === "select" ? (
    <div className="sh-ask-options">
      {uiRequest.options.map((option, index) => (
        <button onClick={() => client.sendUiResponse(uiRequest.reqId, label)}>...</button>
      ))}
    </div>
  ) : (
    <AskEditor onSubmit={value => client.sendUiResponse(uiRequest.reqId, value)} />
  );
}
```

**First-come-first-served**: First guest sending `ui-response` wins; host `#pendingUi.get(reqId)?.settle({ kind: "answered", value })`, immediately broadcasts `ui-request-end` to all writable guests — other guests' dialogs auto-dismiss.

### 8. Subagent Visibility: Agent Hub + EventBus Mirror

Host mirrors two EventBus channels verbatim to guests:

```typescript
// packages/coding-agent/src/collab/host.ts
const COLLAB_BUS_CHANNELS = [
  TASK_SUBAGENT_LIFECYCLE_CHANNEL, // "task:subagent:lifecycle"
  TASK_SUBAGENT_PROGRESS_CHANNEL,  // "task:subagent:progress"
] as const;

observabilityBus.on(channel, data => this.#broadcast({ t: "bus", channel, data }));
```

Guest (TUI/Web) re-emits these frames to **local same-named EventBus** — observer HUD, Agent Hub progress columns, status-line running badge work **natively**, no custom render logic needed.

```typescript
// packages/coding-agent/src/collab/guest.ts#applyFrame
case "bus":
  emitSubagentFrame(this.#ctx.eventBus, this.#ctx.subagentEventBus, frame.channel, frame.data);
  break;
```

### 9. Encryption Details: AES-256-GCM + WebCrypto

```typescript
// packages/collab-web/src/lib/codec.ts
const AES_ALGORITHM = "AES-GCM";
const IV_LENGTH = 12;

export async function seal(key: CryptoKey, frame: WireFrame): Promise<Uint8Array> {
  const iv = new Uint8Array(IV_LENGTH);
  crypto.getRandomValues(iv);
  const plaintext = TEXT_ENCODER.encode(JSON.stringify(frame));
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: AES_ALGORITHM, iv }, key, plaintext));
  const out = new Uint8Array(IV_LENGTH + ciphertext.byteLength);
  out.set(iv, 0);
  out.set(ciphertext, IV_LENGTH);
  return out; // [12B IV][ciphertext+tag]
}

export async function open(key: CryptoKey, data: Uint8Array): Promise<WireFrame> {
  const iv = asStrict(data.subarray(0, IV_LENGTH));
  const ciphertext = asStrict(data.subarray(IV_LENGTH));
  const plaintext = new Uint8Array(await crypto.subtle.decrypt({ name: AES_ALGORITHM, iv }, key, ciphertext));
  return JSON.parse(TEXT_DECODER.decode(plaintext)) as WireFrame;
}
```

- **Per-frame random IV**, safe key reuse (GCM requires IV uniqueness; 12B random space is ample).
- **Key lives only in link fragment**; browser `crypto.subtle.importKey("raw", key, "AES-GCM", false, ["encrypt", "decrypt"])` — only `CryptoKey` handle in memory, never persisted to localStorage.
- **Relay sees zero plaintext** — only frame sizes, frequencies, peer join/leave timing.

### 10. Reconnection: Same Replica File, Same Apply Chain

Guest on disconnect:

```typescript
// packages/collab-web/src/lib/client.ts#handleClose
#handleClose(reason: string, willReconnect: boolean): void {
  if (this.#phase === "ended") return;
  if (willReconnect) {
    this.#phase = "reconnecting";
    this.#commit();
    return;
  }
  this.#end(reason);
}
```

On reconnect, `socket.onOpen` sends `hello` again; host treats as new peer, sends fresh welcome + full snapshot-chunk train. Guest `#applyChain` guarantees **strict in-order application** — no race where event arrives before its entry.

TUI guest goes further: replica file at `~/.omp/collab/<roomId>.jsonl` **persists on leave**; next `/join` same roomId resumes directly (or auto-restores previous session when joining a different one).

---

## Why This Design

| Decision | Rationale |
|----------|-----------|
| **Custom wire protocol + JSON** | Simple structure, shared TS types, easy debug (`console.log`), no schema registry dependency. |
| **AES-GCM not TLS/DTLS** | TLS terminates at relay → relay sees plaintext. E2E encryption pushes trust boundary to "link possession" — holder can decrypt, join, interact. |
| **Hub topology (host authoritative)** | Avoids CRDT causal ordering complexity; host unilaterally runs tools/subagents, guests are "observe + command" — naturally asymmetric. |
| **Relay = blind pipe + envelope rewrite** | Relay stays tiny (Go, ~500 LOC), stateless, horizontally scalable; all business logic in host/guest. |
| **Snapshot-chunk not single frame** | Fits relay `maxPayloadLength`, guest timeout, network jitter; 512 KB chunk ~1.5s on default relay ≪ 30s timeout. |
| **Write token in link, no signatures/certs** | Link = bearer token; possession = trust; `timingSafeEqual` prevents timing attacks; no PKI, cert rotation needed. |
| **`message_update` sends full message not delta** | Simplifies guest logic (no accumulation buffer); cost = slightly larger frames, but text accumulation typically < 10 KB — acceptable. |
| **`ui-request` only to writable guests** | View-only guests shouldn't see host's sensitive prompts (e.g., confirm file delete); host `#sendWritablePeers` filters. |
| **Subagent transcript via `fetch-transcript` pull not push** | Transcripts can be MBs; push would saturate main channel. Guests pull on-demand (paginated by `fromByte` + `TRANSCRIPT_READ_CAP=4MB`); host reads file, splits at JSONL line boundaries. |

---

## Lessons Learned

1. **Asymmetric collaboration doesn't need CRDT** — When there's a single authoritative writer, unidirectional event stream + occasional guest→host commands suffice; architecture is far simpler.
2. **Bearer token in URL fragment is a practical trust model** — No OAuth, JWT, mTLS needed; sharing link = granting access; revocation = new room (new key), fits "ad-hoc collaboration".
3. **Sharded transport must co-design with timeouts** — `welcome` 30s, `snapshot-chunk` 30s per chunk; as long as relay doesn't hard-stall, arbitrarily large sessions sync completely.
4. **Simpler relay = more stable deployment** — Blind pipe + envelope rewrite + TEXT control messages; Go version < 500 lines, runs rock-solid in production.
5. **Same wire types serve TUI + Web simultaneously** — `packages/wire` as single source of truth; `collab-web` is just another renderer; host unchanged.
6. **E2E encryption ≠ zero leakage** — Frame sizes, emission frequencies, peer join/leave timing still leak via traffic analysis; but sufficient for "collaboration content confidentiality".

---

## References

- [oh-my-pi/collab.md](https://github.com/oh-my-pi/oh-my-pi/blob/main/docs/collab.md) — Official user docs: link format, permission model, self-hosting notes
- `packages/wire/src/index.ts` — Complete wire protocol types (`WireFrame`, `GuestFrame`/`HostFrame`, `SessionEntry`, `AgentEvent`, `CollabUiRequest`, envelope, link constants)
- `packages/coding-agent/src/collab/protocol.ts` — Host-side wire types, link parse/format, envelope pack/unpack
- `packages/coding-agent/src/collab/host.ts` — Host logic: welcome, snapshot-chunk, event/entry/state broadcast, guest permission verification, ui-request, agent-cmd, fetch-transcript
- `packages/coding-agent/src/collab/guest.ts` — TUI Guest logic: join, resume replica, apply chain, event/entry/state application, ui-request presentation, agent hub remote
- `packages/collab-web/src/lib/client.ts` — Web GuestClient: socket management, snapshot accumulation, frame apply, React snapshot store
- `packages/collab-web/src/lib/socket.ts` — Web CollabSocket: WebSocket wrapper, seal/open chain, backoff reconnect, backpressure drain
- `packages/collab-web/src/lib/codec.ts` — AES-256-GCM seal/open (WebCrypto)
- `packages/collab-web/src/components/shell/Composer.tsx` — Web composer: prompt, abort, ui-request select/editor rendering
- `packages/browser-relay/extension/background.ts` — Browser Relay MV3 service worker: CDP RPC execution, tab/group management, event streaming