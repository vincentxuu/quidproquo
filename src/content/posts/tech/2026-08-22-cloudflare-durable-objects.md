---
title: "Cloudflare Durable Objects：讓 Workers 有狀態、協調與 WebSocket 的那塊拼圖"
date: 2026-08-22
category: tech
type: deep-dive
tags: [cloudflare, durable-objects, edge, websocket, distributed-systems]
lang: zh-TW
tldr: "Durable Objects 把一個 name 或 ID 對到全球唯一、單執行緒、帶私有 SQLite storage 的 actor。它適合 per-room、per-user、per-tenant、per-run 這種需要強一致協調的邊界；真正的設計題是 object key 要切在哪裡。"
description: "介紹 Cloudflare Durable Objects 的 actor 模型、SQLite storage、RPC、WebSocket hibernation、alarms、sharding、control/data plane 與 AI app 裡的角色。"
series:
  name: "AI 時代的技術選擇"
  order: 110
additionalSeries:
  - name: "Cloudflare Edge Platform"
    order: 7
  - name: "Cloudflare AI Stack"
    order: 14
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-cloudflare-durable-objects-en)

[Cloudflare Workers](https://developers.cloudflare.com/workers/) 很適合處理 stateless request：驗證、轉發、渲染、API handler、輕量資料轉換。問題出在下一步：聊天室要廣播、多人文件要協調、booking 不能重複扣位、agent run 要保證同一個 session 的 budget 不被並發扣錯。這些情境需要一個「同一個 key 的操作可以排隊決定」的地方。[Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)（DO）就是 Cloudflare 在 serverless 裡補上的狀態與協調原語。

官方的定位很直接：Durable Object 是一種特殊 Worker，把 compute 和 storage 綁在同一個全球唯一的 object instance 上。每個 object 有唯一 name/ID、單執行緒執行環境、私有 durable storage；請求可以從世界任何地方打進同一個 object，讓它替某個房間、文件、使用者、租戶或 job 做一致性決策。從 distributed systems 的角度看，它把一部分分散式鎖與共享記憶體問題，收斂成 per-key actor。

## DO 解的是協調，不是一般儲存

Cloudflare 平台上已經有很多資料服務：[D1](https://developers.cloudflare.com/d1/) 是 SQL database，[KV](https://developers.cloudflare.com/kv/) 是全球讀取快的 key-value store，[R2](https://developers.cloudflare.com/r2/) 是 object storage。Durable Objects 的位置不同。它不是讓你查很多資料表、存大檔案或當 CDN cache；它讓「同一個邏輯實體」的操作進到同一個執行點。

可以先用這張表判斷：

| 需求 | 優先看 |
|---|---|
| 查詢、報表、關聯式資料 | D1 |
| 全球讀多寫少的設定、session cache | KV |
| 檔案、圖片、產物、資料集 | R2 |
| 同一個 room/user/tenant/run 要 serializable 協調 | Durable Objects |
| 慢工作、批次處理、重試 | Queues / Workflows |

DO 最常被誤用的地方，是把它當成「小資料庫」。如果只是要存 profile，不需要所有 profile update 都排隊，D1 或 KV 可能更簡單。DO 變得合理的訊號，是你講得出一個 invariant：同一張票不能賣兩次、同一個房間訊息順序要一致、同一份文件 patch 要序列化、同一個 agent run 的狀態只能由一個 coordinator 推進。

## Object key 是真正的設計決策

Durable Objects 的核心在 object identity，不在 class 名稱。`getByName("room:123")` 或 `idFromName("room:123")` 會把同一個 name 穩定路由到同一個 object。這個 name 就是你的 concurrency boundary。

```ts
import { DurableObject } from "cloudflare:workers";

export interface Env {
  ROOMS: DurableObjectNamespace<Room>;
}

export class Room extends DurableObject<Env> {
  async send(userId: string, message: string) {
    this.ctx.storage.sql.exec(
      "INSERT INTO messages (user_id, body, created_at) VALUES (?, ?, ?)",
      userId,
      message,
      Date.now(),
    );

    return { ok: true };
  }
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const roomId = url.searchParams.get("room");
    if (!roomId) return new Response("missing room", { status: 400 });

    const room = env.ROOMS.getByName(`room:${roomId}`);
    const body = await request.json<{ userId: string; message: string }>();
    return Response.json(await room.send(body.userId, body.message));
  },
};
```

切太粗會變成 hot object。所有聊天室都進 `getByName("global")`，流量再大也卡在同一個 object。切太細又會失去協調意義。每一則 message 一個 object，房間內順序就沒人負責。官方 [Rules of Durable Objects](https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/) 的建議很務實：圍繞 coordination atom 建模。聊天室就是 room，協作文件就是 document，booking 可以是 event 或 seat group，agent 可以是 session/run。

官方 limits 頁也提醒單一 object 是單執行緒，簡單操作有約 `1,000 requests / second` 的 soft limit；複雜 JSON、storage writes、外部呼叫會更低。DO 的擴展方式靠資料模型拆成很多 self-contained objects，而不是把單一 object 調大。

## SQLite-backed storage：新 namespace 就用這個

Durable Objects 有自己的 storage，而且只能從該 object 內部存取。2026 年的重點是 [SQLite-backed Durable Object Storage](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/) 已成為新 namespace 的推薦路線；官方文件也說新 Durable Object class 應使用 `exports` 設定宣告 SQLite storage。Free plan 現在也能用 SQLite-backed Durable Objects，只是不能建立 legacy KV-backed namespace。

新寫法重點在兩個地方：Worker code 要 export DO class，`wrangler.jsonc` 要同時宣告 binding 與 `exports`。

```jsonc
{
  "durable_objects": {
    "bindings": [
      {
        "name": "ROOMS",
        "class_name": "Room"
      }
    ]
  },
  "exports": {
    "Room": {
      "type": "durable-object",
      "storage": "sqlite"
    }
  }
}
```

SQLite storage 支援 SQL API、point-in-time recovery、同步/非同步 KV API 與 alarms。它不是完整外部 SQLite server；它是每個 object 私有的 embedded database。適合存該 object 自己要協調的狀態，例如 room messages、presence snapshot、document metadata、rate-limit counters、run steps。跨 object 查詢、全站搜尋、報表分析仍然應該流向 D1、R2、Analytics Engine 或外部 warehouse。

一個容易踩的細節：`sql.exec()` 回傳 cursor，官方文件提醒不要把 cursor 留到 `await` 之後再讀。要穩定就先 `.toArray()` 或 `Array.from(cursor)` 消耗掉，再做外部 I/O。

```ts
const rows = this.ctx.storage.sql
  .exec("SELECT * FROM messages ORDER BY created_at DESC LIMIT 50")
  .toArray();

await fetch("https://example.com/audit", {
  method: "POST",
  body: JSON.stringify(rows),
});
```

## 記憶體負責加速，真相仍要落到 storage

DO instance 在一段時間沒事做後會被 evict 或 hibernate；下一次請求進來，constructor 會再跑一次。[In-memory state](https://developers.cloudflare.com/durable-objects/reference/in-memory-state/) 的價值是快取與批次聚合，不是 durable source of truth。

合理用法：

- 啟動時從 storage 載入 room metadata，後續請求先讀 `this.roomConfig`。
- 把短時間內的 presence change 聚合起來，稍後寫回 storage。
- 記住最近讀過的設定或小型索引，減少 storage access。

危險用法：

- 把尚未寫入 storage 的付款狀態只放在 memory。
- 用 module-level global variable 存 per-object 狀態，導致同一 isolate 內不同 object 互相污染。
- 在 constructor 做大量網路請求，讓 hibernated object 每次醒來都變慢。

需要初始化時，用 `ctx.blockConcurrencyWhile()` 擋住第一批 request，等 state 載完再開始處理。但初始化流程仍要短，並且能重跑。

## WebSocket hibernation：長連線才不會燒掉 duration

Durable Objects 很適合做 WebSocket server，因為同一個 room 的連線都能聚到同一個 coordinator。[WebSocket Hibernation API](https://developers.cloudflare.com/durable-objects/best-practices/websockets/) 是 production 成本的關鍵：client 可以保持連線，DO 的 JavaScript instance 在 idle 時休眠；有 message 進來再醒來。

差別在 API：

- `ctx.acceptWebSocket(server)`：支援 hibernation，官方建議使用。
- `server.accept()`：標準 WebSocket API，熟悉但不休眠，連線期間可能持續計 duration。

休眠會清掉記憶體，所以每條 connection 需要恢復的 metadata 要放在 `serializeAttachment()`，或把 durable 資料存在 storage，再用 attachment 存 key。官方限制 attachment 最大 16,384 bytes；更大的東西不要塞在 connection 上。

也不要期待 hibernation 替你解所有 realtime 問題。慢 client、broadcast batching、重連後補資料、權限續期、部署 drain、房間過熱，仍然是應用程式責任。高頻小訊息會被 context switch 成本打爆；官方建議把多個 logical messages 包成較少、較大的 WebSocket frames。

## Alarms：每個 object 自己的細粒度排程

[Durable Objects Alarms](https://developers.cloudflare.com/durable-objects/api/alarms/) 讓 object 設定未來某個時間醒來執行 `alarm()`。它比 Cron Trigger 細，因為每個 object 都可以有自己的 alarm。用法像：

- 房間閒置一小時後清 presence。
- booking hold 十分鐘後釋放座位。
- agent run 超時後標記失敗。
- 每個 tenant 自己批次 flush usage counter。

每個 object 同時間只能有一個 alarm；如果你有多個 scheduled events，要把 schedule 存在 storage，alarm handler 處理到期事件後再設下一個。Alarms 是 at-least-once，handler 失敗會用 exponential backoff retry，最多 6 次。這代表 handler 必須 idempotent，外部副作用要有去重 key。

```ts
export class AgentRun extends DurableObject<Env> {
  async start(runId: string) {
    this.ctx.storage.sql.exec(
      "INSERT OR IGNORE INTO runs (id, status, started_at) VALUES (?, ?, ?)",
      runId,
      "running",
      Date.now(),
    );
    await this.ctx.storage.setAlarm(Date.now() + 15 * 60 * 1000);
  }

  async alarm() {
    this.ctx.storage.sql.exec(
      "UPDATE runs SET status = ? WHERE status = ?",
      "timed_out",
      "running",
    );
  }
}
```

## Control plane / data plane：不要讓一個 DO 扛全部

Cloudflare 的 [Durable Objects reference architecture](https://developers.cloudflare.com/reference-architecture/diagrams/storage/durable-object-control-data-plane-pattern/) 建議把 control plane 和 data plane 拆開。Control plane 管 resource metadata：建立、刪除、列表、權限。Data plane 處理高流量主路徑：讀寫某份文件、某個 room、某個 user workspace。

```txt
Worker
  |
  +--> Control DO: workspace registry, permissions, resource list
  |
  +--> Data DO: document:abc
  +--> Data DO: document:def
  +--> Data DO: room:123
```

這個拆法可以避免「所有 request 都先過 registry DO」的瓶頸。建立資源時走 control DO；真正讀寫時，Worker 直接依 resource ID 找到 data DO。當資料模型能以 resource 切開，就能靠很多 DO 水平擴展，而不是把單一 object 推到極限。

## 在 AI app 裡的角色

Durable Objects 在 AI Stack 裡通常扮演三種角色。

第一是 **session coordinator**。一個 agent run、一個 chat session、一個 browser automation task 對到一個 DO。它負責目前 step、tool call 狀態、取消旗標、budget、WebSocket/SSE 推送與最後結果。模型呼叫可以經 [AI Gateway](https://developers.cloudflare.com/ai-gateway/)，長期文件丟 [AI Search](https://developers.cloudflare.com/ai-search/) 或 [Vectorize](https://developers.cloudflare.com/vectorize/)，但 session 的強一致進度由 DO 管。

第二是 **per-tenant control point**。每個 tenant 一個 DO，管理 API quota、plan limits、feature flags cache、tenant-specific route policy。全域資料仍放 D1；DO 只管需要 serial decision 的那部分。

第三是 **realtime bridge**。Agent 做事時前端需要看 stream、取消、重試、接人工 override。DO 可以把 WebSocket clients、run state 和 durable storage 放在同一個 object 裡，讓 UI 不必輪詢 D1。

別把 DO 當成所有 AI 記憶的地方。長期可搜尋知識放 RAG；大型 artifact 放 R2；分析與 eval traces 可流到 Analytics Engine 或 R2；DO 管的是「這個 key 目前到底處於什麼狀態，下一步能不能做」。

## 什麼時候不要用

幾種情況先別用 Durable Objects：

- Request 完全 stateless，只是轉 API 或 render HTML。
- 你需要全域查詢、join、報表，而不是 per-entity coordination。
- 單一 key 會吃極高流量，卻沒有辦法再 shard。
- 資料很大，接近 per-object 10 GB 限制，或每次操作要掃大量 rows。
- 外部副作用才是真正瓶頸，DO 只能排隊，不能讓第三方 API 變快。

Durable Objects 很強，但它不是逃避資料建模的工具。它逼你先回答一個問題：哪個東西必須被同一個執行點序列化？答案清楚時，DO 會讓 serverless app 多一塊很難用 D1、KV、R2 取代的能力；答案模糊時，它只會變成一個比較貴、比較難查的 singleton。

## 更新紀錄

- 2026-08-30：依 Cloudflare Edge Platform / AI Stack 內容線重寫本文，補上 SQLite-backed storage、`exports` 設定、WebSocket hibernation、alarms、control/data plane 與 AI app 架構角色。

## 參考資料

- [Cloudflare Durable Objects — Overview](https://developers.cloudflare.com/durable-objects/)
- [Cloudflare Durable Objects — What are Durable Objects?](https://developers.cloudflare.com/durable-objects/concepts/what-are-durable-objects/)
- [Cloudflare Durable Objects — Rules of Durable Objects](https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/)
- [Cloudflare Durable Objects — Getting started](https://developers.cloudflare.com/durable-objects/get-started/)
- [Cloudflare Durable Objects — SQLite-backed Durable Object Storage](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/)
- [Cloudflare Durable Objects — In-memory state](https://developers.cloudflare.com/durable-objects/reference/in-memory-state/)
- [Cloudflare Durable Objects — WebSockets and hibernation](https://developers.cloudflare.com/durable-objects/best-practices/websockets/)
- [Cloudflare Durable Objects — Alarms](https://developers.cloudflare.com/durable-objects/api/alarms/)
- [Cloudflare Durable Objects — Limits](https://developers.cloudflare.com/durable-objects/platform/limits/)
- [Cloudflare Durable Objects — Pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)
- [Cloudflare Reference Architecture — Durable Object control/data plane pattern](https://developers.cloudflare.com/reference-architecture/diagrams/storage/durable-object-control-data-plane-pattern/)
- [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/)
