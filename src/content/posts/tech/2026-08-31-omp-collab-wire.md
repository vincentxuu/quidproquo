---
title: "OMP 內部設計導讀 #13：collab-web 與 wire protocol —— 多人協作 session 怎麼序列化？guest 權限邊界怎麼管？composer 中斷怎麼廣播？"
date: 2026-08-31
category: tech
type: deep-dive
tags: ["omp", "collab", "wire-protocol", "real-time", "encryption", "web"]
lang: zh-TW
description: "深入剖析 omp 如何用自製 wire protocol 實現端到端加密的即時多人協作：guest 權限模型、composer 中斷廣播、snapshot-chunk 分片傳輸、為什麼不用 CRDT/WebRTC。"
tldr: "omp collab 以 host 為權威、guest 從不互聯的 hub 拓撲，透過 AES-256-GCM 封裝 JSON frame、4-byte envelope、snapshot-chunk 分片，實現零中繼可見的即時協作；guest 權限靠 16-byte write token 在 link 內綁定，host 用 timing-safe comparison 驗證。"
series:
  name: "OMP 內部設計導讀"
  order: 13
---

## TL;DR

- **架構**：hub topology —— host 權威、guest 從不互聯，所有 payload AES-256-GCM 封裝後才落 socket，relay 只見 ciphertext + 4-byte peerId。
- **Wire protocol**：`packages/wire/src/index.ts` 定義完整 JSON schema（`WireFrame`、`CollabFrame`、`GuestFrame`/`HostFrame`），版本 `COLLAB_PROTO = 3` 引入 `ui-request`/`ui-request-end` 讓 host 能向 writable guest 發起 select/editor 互動。
- **Guest 權限**：link 內藏 48-byte（32-byte key + 16-byte write token）vs 32-byte（view-only）；host 用 `timingSafeEqual` 驗證 token，拒絕無 token peer 的 `prompt`/`abort`/`agent-cmd`/`ui-response`。
- **Snapshot 傳輸**：welcome 只送 metadata + `entryCount`，實際 transcript 切成 ≤ 512 KB 的 `snapshot-chunk` 逐框送，最後一框 `final: true` 才進 `live` phase，避免單一巨大 frame 卡住 guest 的 30s welcome timeout。
- **Composer 中斷**：guest 送 `abort` frame，host 收到經權限檢查後呼叫 `session.abort({ reason: USER_INTERRUPT_LABEL })`，再廣播 `event: agent_end` + `state: isStreaming=false`，所有 guest 同步停掉 streaming indicator。
- **為何自製**：CRDT 適合文本共編，不適合「host 跑 agent、tool、subagent，guest 只觀測與下指令」的非對稱模型；WebRTC 需要 NAT 穿透、信令、mesh 複雜度，relay 只要 blind pipe 即可；E2E 加密把信任邊界壓縮到 link 擁有權。

---

## 情境

`/collab` 讓一台機器跑著的 omp session 即時分享給任意數量的 guest——另一台電腦的 omp TUI、或瀏覽器打開 `my.omp.sh/#<link>`。Guest 看到的**完全一樣**的 transcript：streaming 文字、thinking block、tool card、footer 狀態（cwd、model、context %、cost）、ctrl+o 展開、`/dump` 內容。Guest 甚至能**發 prompt、按 Esc 中斷、操作 Agent Hub（chat/kill/revive/subagent transcript）**。

關鍵約束：

1. **Host 單機跑所有工具**——bash、python、LSP、file read/write、subagent spawn，guest 完全不碰 host 的 filesystem。
2. **E2E 加密**——relay 是 content-blind，只看 roomId、connection count、opaque ciphertext、4-byte routing prefix。
3. **Guest 權限由 link 決定**——full link = 可寫、view link = 唯讀，host 不存權限表，驗證靠 `timingSafeEqual`。
4. **斷線重連要無縫**——guest 掉線重連時，host 重送完整 snapshot（含新 entry），guest 以同一 replica file resume。

---

## 問題

要在這樣的非對稱協作模型下，解決：

1. **Session 怎麼序列化、分片、按序應用**？Transcript 可能數 MB，單一 frame 會撐爆 relay/guest timeout。
2. **Guest 權限邊界怎麼在「無狀態 relay + 無信任 guest」下執行**？不能靠 relay 做授權，host 要能以常數時間拒絕惡意 frame。
3. **Composer 中斷（Esc）怎麼廣播讓所有人同步停下**？要區分「host 主動結束」vs「guest 發起中斷」。
4. **為什麼不直接用 Yjs/Automerge（CRDT）或 WebRTC**？這類工具解決的是對稱共編，不適合「host 單邊執行、guest 單邊觀測+下指令」的拓撲。

---

## 嘗試過程

### 嘗試 1：把整個 transcript 存成 CRDT，guest 直接同步

Yjs/Automerge 會把每個 entry 當作可並發編輯的資料結構。但 omp session 不是「多人共筆」——**只有一個 writer（host agent）**，guest 的 prompt 只是「插入一筆 user message 給 host 的 LLM 看」，guest 自己的 local edit 不會衝突。CRDT 的 GC、版本向量、merge logic 反而增加複雜度，且無法原生表達「tool call → tool result」這類有強順序依賴的 event 鏈。

### 嘗試 2：WebRTC mesh，guest 直連 host

WebRTC 需要 ICE/STUN/TURN、信令伺服器、connection management。對「host 最多帶幾個 guest、relay 只要 blind pipe」的場景，mesh 帶來的 NAT 穿透、重連邏輯、peer 發現成本遠超收益。且 E2E 加密在 mesh 裡要做 pairwise key agreement，比「link 內直接帶 32-byte key」複雜得多。

### 嘗試 3：單一巨大 welcome frame 帶全 transcript

早期 protocol v1 這樣做。但 10 MB transcript 經 AES-GCM 封裝後 > 10 MB，relay 的 `maxPayloadLength`、guest 的 30s welcome timeout 都會噴。改成 v2：welcome 只送 `entryCount` + metadata，後續用 `snapshot-chunk` 分片，每片 ≤ 512 KB，guest 每收一片就 reset 30s progress timeout。

---

## 解法

### 1. Wire protocol：`packages/wire/src/index.ts` 為單一真理來源

雙端（TUI guest、browser collab-web）與 host 共享同一組 TypeScript 介面。關鍵型別：

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

**版本演進**：

| 版本 | 關鍵變更 |
|------|----------|
| 1 (legacy) | `welcome` 內嵌完整 `entries` 陣列 |
| 2 | `welcome` 只帶 `entryCount`，transcript 改用 `snapshot-chunk` 分片 |
| 3 (current) | 新增 `ui-request`/`ui-request-end`/`ui-response`，支援 host 向 writable guest 發起 select/editor 互動 |

`COLLAB_PROTO = 3` 在 `hello` 時交換，host 拒絕舊版 guest（會掛在 `ui-request` 永遠不回應）。

### 2. Envelope：`[4B uint32 BE peerId][sealed payload]`

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

- **Host → relay**：`peerId = 0` 代表 broadcast 給所有 guest；`peerId = N` 定向給 guest N（如 `ui-request`、`transcript` 回覆）。
- **Guest → relay**：永遠送 `peerId = 0`，relay 收到後 **in-place rewrite** 成該 guest 的實際 peerId，再轉發給 host。
- **Relay 只做**：WebSocket upgrade、peer 計數、envelope rewrite、control message（`peer-joined`/`peer-left`/`room-closed`）用 TEXT JSON 明文傳。

### 3. Link 格式與權限綁定

```
<roomId>.<base64url(key || key+writeToken)>     → default relay (wss://my.omp.sh)
host[:port]/r/<roomId>.<key>                    → custom relay
https://web.example/collab/#<relay-link>        → browser deep link，fragment 帶 relay-specific link
```

- **Full link (48 bytes)**：`key(32) || writeToken(16)` → `base64url`。擁有者可 prompt、abort、agent-cmd、ui-response。
- **View link (32 bytes)**：bare key。僅可讀。

Host 端驗證：

```typescript
// packages/coding-agent/src/collab/host.ts#verifyWriteToken
#verifyWriteToken(token: string | undefined): boolean {
  const expected = this.#writeToken;
  if (!expected || !token) return false;
  const bytes = Buffer.from(token, "base64url");
  return bytes.byteLength === expected.byteLength && timingSafeEqual(bytes, expected);
}
```

用 `timingSafeEqual` 避免 timing attack。無效 token 的 peer 進來時 `canWrite = false`，host 對其 mutating frame 直接回 `error: "prompting is disabled on a read-only link"`。

### 4. Session 序列化與 Snapshot-chunk 分片

**Host 端** `packages/coding-agent/src/collab/host.ts#sendSnapshotChunks`：

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
      const shrunk = shrinkForReplication(entry); // 縮減 oversized tool result
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

- `shrinkForReplication`：把超大 tool result（如巨大 grep output、base64 圖片）截斷或移除，避免單一 entry 撐爆 chunk。
- 每個 chunk 獨立 AES-GCM 封裝，guest 收到即可 append 到 replica，不需等全部分片。
- 最後一片 `final: true` 觸發 guest 進入 `live` phase，開始接收即時 `event`/`entry`/`state`。

**Guest 端（TUI）** `packages/coding-agent/src/collab/guest.ts#accumulateSnapshotChunk`：

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

**Guest 端（Web）** `packages/collab-web/src/lib/client.ts#applyFrame`：

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

### 5. 即時 Event/Entry/State 廣播

Host 透過三條管道同步：

| Frame | 觸發時機 | Guest 行為 |
|-------|----------|------------|
| `entry` | `SessionManager.onEntryAppended` | 寫入 replica file、`agent.replaceMessages` 更新 message array（供 `/dump`、context 估算） |
| `event` | `AgentSessionEvent` 發射 | 直接餵給 `EventController.handleEvent`，**只走事件渲染**，不重複渲染 entry |
| `state` | `STATE_TRIGGER_EVENTS` 觸發，100ms debounce + JSON diff 去重 | 更新 footer（streaming flag、model、thinking level、context %、participants） |

關鍵細節：`message_update` event **攜帶完整累積的 partial message**，guest 不需要做 delta tracking，直接覆蓋 `stream` ghost。

```typescript
// packages/wire/src/index.ts#AgentEvent
| { type: "message_update"; message: WireMessage } // Carries the FULL accumulating partial message — no delta tracking needed.
```

### 6. Composer 中斷（Esc）廣播機制

**Guest 發起**：

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

**Host 接收與處理** `packages/coding-agent/src/collab/host.ts#handleAbort`：

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

**後續廣播**：

1. `session.abort()` 內部發射 `agent_end` event → host 的 event subscription 收到 → `#broadcast({ t: "event", event: ... })` → 所有 guest 收到 `event: { type: "agent_end" }`。
2. `agent_end` 觸發 `STATE_TRIGGER_EVENTS` → `#scheduleStateBroadcast()` → 100ms 後送 `state: { isStreaming: false, ... }` → 所有 guest 同步更新 footer、停掉 spinner。

**權限隔離**：view-only guest 送 `abort` 會被 `#rejectReadOnly` 攔截，收到 targeted `error` frame，不影響 host 與其他 guest。

### 7. UI Request（select/editor）雙向互動

Host 遇到 `ask`（select/editor）時：

```typescript
// packages/coding-agent/src/collab/host.ts#requestGuestUi
requestGuestUi(request: CollabUiRequestDraft, signal?: AbortSignal): Promise<CollabGuestUiResult> | null {
  if (!this.#socket || !this.#hasWritablePeers()) return null;
  const reqId = ++this.#uiReqSeq;
  const fullRequest: CollabUiRequest = { ...request, reqId };
  this.#pendingUi.set(reqId, { request: fullRequest, settle });
  this.#sendWritablePeers({ t: "ui-request", request: fullRequest }); // 只送給可寫 guest
  return promise;
}
```

Guest（Web）在 Composer 區塊渲染 select options 或 editor textarea：

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

**先到先贏**：第一個送 `ui-response` 的 guest 贏，host `#pendingUi.get(reqId)?.settle({ kind: "answered", value })`，隨即對所有 writable guest 廣播 `ui-request-end`，其他 guest 的 dialog 自動 dismiss。

### 8. Subagent 透視：Agent Hub + EventBus Mirror

Host 把兩條 EventBus channel 完整 mirror 給 guest：

```typescript
// packages/coding-agent/src/collab/host.ts
const COLLAB_BUS_CHANNELS = [
  TASK_SUBAGENT_LIFECYCLE_CHANNEL, // "task:subagent:lifecycle"
  TASK_SUBAGENT_PROGRESS_CHANNEL,  // "task:subagent:progress"
] as const;

observabilityBus.on(channel, data => this.#broadcast({ t: "bus", channel, data }));
```

Guest 端（TUI/Web）把這些 frame 重發到**本地同名 EventBus**，observer HUD、Agent Hub progress columns、status-line running badge 就能**原生運作**，不需要寫專屬渲染邏輯。

```typescript
// packages/coding-agent/src/collab/guest.ts#applyFrame
case "bus":
  emitSubagentFrame(this.#ctx.eventBus, this.#ctx.subagentEventBus, frame.channel, frame.data);
  break;
```

### 9. 加密細節：AES-256-GCM + WebCrypto

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

- **IV 每框隨機**，同一 key 重複使用安全（GCM 要求 IV 不重複，12B 隨機空間足夠大）。
- **Key 只存在 link fragment**，browser 端 `crypto.subtle.importKey("raw", key, "AES-GCM", false, ["encrypt", "decrypt"])`，記憶體中只佔 `CryptoKey` handle，不會落地到 localStorage。
- **Relay 完全看不見明文**，只能做流量分析（frame size、頻率、peer count）。

### 10. 斷線重連：同一 replica file、同一 apply chain

Guest 斷線時：

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

重連時 `socket.onOpen` 再送一次 `hello`，host 當成新 peer 送新 welcome + 全量 snapshot-chunk。Guest 端 `#applyChain` 保證**嚴格到序應用**，不會出現 event 跑在 entry 前面的 race。

TUI guest 更進一步：replica file 寫在 `~/.omp/collab/<roomId>.jsonl`，**leave 時不刪除**，下次 `/join` 同一 roomId 可直接 resume（或改 join 其他 session 時自動恢復原本 session）。

---

## 為什麼會這樣

| 設計決策 | 理由 |
|----------|------|
| **自製 wire protocol + JSON** | 結構簡單、TypeScript 共享型別、debug 容易（`console.log` 即可看）、無 schema registry 依賴。 |
| **AES-GCM 而非 TLS/DTLS** | TLS 終結在 relay，relay 仍可見明文。E2E 加密把信任邊界壓到「擁有 link」——具備 link 即可解密、加入、互動。 |
| **Hub topology（host 權威）** | 避免 CRDT 的 causal ordering 複雜度；host 單邊執行 tool/subagent，guest 只是「觀測 + 下指令」，天然非對稱。 |
| **Relay 只做 blind pipe + envelope rewrite** | Relay 可極度輕量（Go、~500 LOC）、無狀態、水平擴展容易；所有商業邏輯在 host/guest 端。 |
| **Snapshot-chunk 而非單一 frame** | 適應 relay 的 `maxPayloadLength`、guest 的 timeout、網路抖動；512 KB chunk 在預設 relay 約 1.5s 內送達，遠小於 30s timeout。 |
| **Write token 在 link 內、不用簽名/證書** | Link 本身就是 bearer token，擁有即信任；`timingSafeEqual` 防 timing attack，無需 PKI、cert rotation。 |
| **`message_update` 送 full message 而非 delta** | 簡化 guest 端邏輯（無需累積 buffer），代價是稍大的 frame size，但文字累積通常 < 10 KB，可接受。 |
| **`ui-request` 只送給 writable guest** | view-only guest 不應看到 host 的機敏提問（如確認刪除檔案）；host 端 `#sendWritablePeers` 過濾。 |
| **Subagent transcript 走 `fetch-transcript` 拉取而非 push** | Transcript 可能數 MB，push 會塞滿主 channel；guest 按需分頁拉取（`fromByte` + `TRANSCRIPT_READ_CAP=4MB`），host 讀檔切 JSONL 行回覆。 |

---

## 學到的事

1. **非對稱協作不需要 CRDT**——當寫入者只有單一權威來源，單向 event stream + 偶發的 guest→host command 就足夠，架構簡潔得多。
2. **Bearer token 在 URL fragment 是實用的信任模型**——不需要 OAuth、JWT、mTLS；link 分享即授權，撤銷只能換 room（生成新 key），符合「臨時協作」場景。
3. **分片傳輸要配合 timeout 設計**——`welcome` 30s、`snapshot-chunk` 30s per chunk，只要 relay 不完全卡死，任意大小 session 都能同步完成。
4. **Relay 想得越簡單、部署越穩**——blind pipe + envelope rewrite + TEXT control message，Go 版本 < 500 行，生產環境跑得極穩。
5. **同一組 wire types 同時服務 TUI + Web**——`packages/wire` 為單一真理來源，`collab-web` 只是另一個渲染器，host 端完全不用改。
6. **E2E 加密不等於零洩漏**——frame size、送出頻率、peer 進出時機仍可流量分析；但對「協作內容機密」已足夠。

---

## 參考資料

- [oh-my-pi/collab.md](https://github.com/oh-my-pi/oh-my-pi/blob/main/docs/collab.md) —— 官方使用者文件，含 link 格式、權限模型、self-hosting 說明
- `packages/wire/src/index.ts` —— Wire protocol 完整型別定義（`WireFrame`、`GuestFrame`/`HostFrame`、`SessionEntry`、`AgentEvent`、`CollabUiRequest`、envelope、link constants）
- `packages/coding-agent/src/collab/protocol.ts` —— Host 端 wire types、link parse/format、envelope pack/unpack
- `packages/coding-agent/src/collab/host.ts` — Host 邏輯：welcome、snapshot-chunk、event/entry/state broadcast、guest 權限驗證、ui-request、agent-cmd、fetch-transcript
- `packages/coding-agent/src/collab/guest.ts` — TUI Guest 邏輯：join、resume replica、apply chain、event/entry/state 應用、ui-request presentation、agent hub remote
- `packages/collab-web/src/lib/client.ts` — Web GuestClient：socket 管理、snapshot 累積、frame apply、React snapshot store
- `packages/collab-web/src/lib/socket.ts` — Web CollabSocket：WebSocket wrapper、seal/open chain、backoff reconnect、backpressure drain
- `packages/collab-web/src/lib/codec.ts` — AES-256-GCM seal/open（WebCrypto）
- `packages/collab-web/src/components/shell/Composer.tsx` — Web composer：prompt、abort、ui-request select/editor 渲染
- `packages/browser-relay/extension/background.ts` — Browser Relay MV3 service worker：CDP RPC 執行、tab/group 管理、event streaming