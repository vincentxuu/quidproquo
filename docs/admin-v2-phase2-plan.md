# Admin v2 — Phase 2 實作計畫

狀態：草稿（2026-08-29）。
前置：Phase 1 完成（路由全遷 + lib 重組），見 `docs/admin-v2-phase1-plan.md`。

## 0. 目標

Home 打一句話讓自己的 agent 跑，在 Session 頁看即時事件流，並能執行全套 lifecycle 動作。

---

## 1. 現有基礎盤點

### 已有（可用）

| 元件 | 位置 | 能力 |
|---|---|---|
| **Agent loop** | `src/lib/agent/durable-agent.ts` `runLoop()` | 純函式 agent loop：user→LLM→tool_use→syscall→broadcast，支援 approval 阻擋，MAX_TURNS=30 |
| **Kernel** | `src/lib/agent/kernel.ts` `createKernel()` | 組裝 backends + syscall helper + scheduler + access manager + provider registration |
| **Scheduler** | `src/lib/agent/scheduler.ts` `dispatchRun()` | 建 run record → transition → timeout → cancel signal → 呼叫 `definition.run()` |
| **State machine** | `src/lib/agent/state-machine.ts` | 狀態轉換規則：pending→running→paused/done/failed/cancelled |
| **Storage backends** | `src/lib/agent/storage.ts` | D1: runs, events, tool_calls, processes, permissions, approvals, memory；KV: cancel signals；R2: blobs；Vectorize: embeddings |
| **D1 表（agent_runs 系列）** | migration `0011_agent_os.sql` | `agent_runs`、`agent_run_events`、`agent_tool_calls`、`agent_processes`、`agent_permissions`、`agent_approval_requests`、`agent_memory_items` |
| **D1 表（agent_sessions 系列）** | migration `0026_agent_sessions.sql` | `agent_sessions`（id, agent_id, trigger, status, git_ref, timestamps）、`agent_messages`（session_id, seq, role, content_json, tool_call_id）、`agent_events`（session_id, seq, type, payload_json） |
| **Durable Object** | `src/server/agents/session-do.ts` `AgentSessionDO` | WebSocket 雙工：接 prompt→呼叫 `runLoop()`→broadcast events。支援 approve。有 DO 內部 SQLite `pending` 表。但 import 路徑尚未更新（仍指 `agent-os`） |
| **Session API** | `src/pages/api/admin/sessions/index.ts` | GET 列表（D1 `agent_sessions`）、POST 建 session（proxy 到 DO）、WebSocket upgrade proxy |
| **Session detail API** | `src/pages/api/admin/sessions/[id].ts` | GET session + messages + events（D1） |
| **wrangler.jsonc** | DO binding `AGENT_SESSION_DO` → `AgentSessionDO`，已有 D1、KV、R2、Vectorize、AI bindings |

### 缺的（Phase 2 要做）

| 缺口 | 說明 |
|---|---|
| **SSE watch 端點** | 現在用 WebSocket，spec 要求 SSE `sessions/:id/watch`（帶 resume_token），對齊 Agent SDK stream-json |
| **Session 正本統一** | 兩套表並存：`agent_runs` + `agent_run_events`（scheduler 用）與 `agent_sessions` + `agent_messages` + `agent_events`（DO 用）。spec 說正本＝`agent_runs` / `agent_run_events` |
| **事件流型別** | 現在 events 是自由格式，spec §3.3 定義了 14 種事件型別（system/init, assistant, user, result, control_request/response, env_manager_log, post_turn_summary 等） |
| **Session lifecycle actions** | 只有基本的 run→done。缺 Stop（cancel + wait）、續聊（resume）、Rename、Archive、Delete、Share |
| **Home composer** | Home 頁面目前是 dashboard metrics，沒有 composer（指令框 + 控制項） |
| **Session 頁即時渲染** | `sessions/[id].astro` 顯示的是 flow_runs（舊 console runs），不是即時事件流 |
| **Mac runner provider** | agent loop 目前直接在 Worker / DO 裡跑，沒有 runner 抽象層 |
| **post_turn_summary** | 每 turn 結束後需要 LLM 生成 `{status_category, status_detail, needs_action}` 供列表顯示 |

---

## 2. 架構決策

### 2.1 Session 正本表選擇

**決定：以 `agent_sessions` / `agent_messages` / `agent_events` 為 Phase 2 正本。**

理由：
- `agent_runs` / `agent_run_events` 是 scheduler 用的 run 紀錄，跟 flow_runs 有 FK 依賴，結構偏「一次性 batch job」
- `agent_sessions` 已有 DO 配合的 messages/events，結構偏「可續聊的對話」，更符合 spec Session 定義
- 長期 `agent_runs` 降為 `agent_sessions` 的子紀錄（每個 turn 可選性建一筆 run 追蹤 token/cost）

需要在 `agent_sessions` 表加欄位（見 §4 schema）。

### 2.2 SSE vs WebSocket

**決定：新增 SSE 端點，保留 WebSocket 作為 DO 內部通訊。**

```
瀏覽器 ──GET SSE /sessions/:id/watch──► API route（Workers）
                                            │ 讀 D1 events（歷史）
                                            │ 長輪詢或 DO alarm 推新 events
                                            └── resume_token = last event_id
```

SSE 端點從 D1 讀 events 而不是直連 DO WebSocket，因為：
- SSE 在手機瀏覽器斷線後可自動重連（`EventSource` 內建）
- resume_token 讓斷線重連只拉差量
- DO 可能已停機（閒置 10 分鐘），SSE 仍能讀歷史
- 即時性靠 DO 每寫一筆 event 就 bump 一個 KV timestamp，SSE 端點 long-poll 該 timestamp

### 2.3 Runner provider 介面

**Phase 2 只做 Mac runner，其他 runner 留後續。**

```typescript
interface RunnerProvider {
  id: string
  provision(session: SessionRecord): Promise<RunnerHandle>
  destroy(handle: RunnerHandle): Promise<void>
}

interface RunnerHandle {
  exec(command: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }>
  readFile(path: string): Promise<string>
  writeFile(path: string, content: string): Promise<void>
  // ... 沙箱 6 工具的介面
}
```

Mac runner 實作：
- Mac 上跑一個 lightweight agent worker（Node.js process），啟動時連回 Workers 的一個長連線
- Workers 透過這條連線把 tool_use 的沙箱操作（Bash/Read/Write/Edit/Glob/Grep）發給 Mac 執行
- Web/MCP 工具仍在 Workers 端執行（現有 search/reader provider + tool-registry）
- 連線協定：WebSocket 或 SSE，Mac → Workers 回報結果

### 2.4 Agent loop 改造

`durable-agent.ts` 的 `runLoop()` 需要擴展：
1. 事件型別改為 spec §3.3 的 14 種
2. 每 turn 結束呼叫 LLM 生成 `post_turn_summary`
3. tool_use dispatch 按三層分派（沙箱→runner、Web→Workers、MCP→Workers proxy）
4. broadcast 改為寫 D1 events + bump KV timestamp（而非直接 WebSocket send）
5. 支援續聊（載入歷史 messages，接續 loop）

---

## 3. 新增 API 端點

| 方法 | 路徑 | 用途 |
|---|---|---|
| `GET` | `/api/admin/sessions/:id/watch` | **SSE 事件流**：帶 `?resume_token=` 回 `text/event-stream`，每筆 event 的 `id:` 欄位為 resume_token |
| `POST` | `/api/admin/sessions/:id/stop` | 送 cancel signal、等 loop 結束、transition → cancelled |
| `POST` | `/api/admin/sessions/:id/resume` | 續聊：載入歷史 messages，新 user message，重啟 loop |
| `PATCH` | `/api/admin/sessions/:id` | Rename（name 欄位）、Archive（status → archived）、Pin |
| `DELETE` | `/api/admin/sessions/:id` | 刪除 session + cascade messages/events |
| `POST` | `/api/admin/sessions/:id/share` | 產生 share token（UUID），存 D1，回 share URL |
| `DELETE` | `/api/admin/sessions/:id/share` | 撤回 share（刪 token，後續 404） |
| `GET` | `/api/admin/sessions/:id/diff` | 若有 repo，回 git diff --stat 摘要 |
| `GET` | `/shared/:token` | 公開 transcript 頁（不需登入，Usage Policy 警語） |

---

## 4. Schema 變更（Tier 2——需確認）

### 4.1 `agent_sessions` 加欄位

```sql
-- Migration 0028_session_v2.sql
ALTER TABLE agent_sessions ADD COLUMN name TEXT;
ALTER TABLE agent_sessions ADD COLUMN model TEXT;
ALTER TABLE agent_sessions ADD COLUMN mode TEXT DEFAULT 'auto';  -- auto | default | plan
ALTER TABLE agent_sessions ADD COLUMN repo TEXT;
ALTER TABLE agent_sessions ADD COLUMN runner_provider TEXT DEFAULT 'mac';
ALTER TABLE agent_sessions ADD COLUMN pinned INTEGER DEFAULT 0;
ALTER TABLE agent_sessions ADD COLUMN archived INTEGER DEFAULT 0;
ALTER TABLE agent_sessions ADD COLUMN share_token TEXT;
ALTER TABLE agent_sessions ADD COLUMN routine_id TEXT;
ALTER TABLE agent_sessions ADD COLUMN total_tokens INTEGER DEFAULT 0;
ALTER TABLE agent_sessions ADD COLUMN total_cost_usd REAL DEFAULT 0;
ALTER TABLE agent_sessions ADD COLUMN summary_category TEXT;   -- post_turn_summary
ALTER TABLE agent_sessions ADD COLUMN summary_detail TEXT;
ALTER TABLE agent_sessions ADD COLUMN needs_action INTEGER DEFAULT 0;
ALTER TABLE agent_sessions ADD COLUMN finished_at INTEGER;

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_sessions_share ON agent_sessions(share_token) WHERE share_token IS NOT NULL;
```

### 4.2 `agent_events` 加 event_id

```sql
-- 既有的 agent_events 用 (session_id, seq) 作 PK，沒有全局遞增 ID
-- SSE resume_token 需要全局可排序的 ID
ALTER TABLE agent_events ADD COLUMN event_id INTEGER;
-- 回填
UPDATE agent_events SET event_id = rowid WHERE event_id IS NULL;
```

### 4.3 Mac runner 狀態表（新）

```sql
CREATE TABLE IF NOT EXISTS runner_connections (
  runner_id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,   -- 'mac' | 'sandbox' | 'vps'
  hostname TEXT,
  status TEXT NOT NULL DEFAULT 'disconnected',  -- connected | disconnected
  last_heartbeat INTEGER,
  created_at INTEGER NOT NULL
);
```

---

## 5. 新檔案

| # | 路徑 | 說明 |
|---|---|---|
| 1 | `src/lib/agent/runner/types.ts` | RunnerProvider + RunnerHandle 介面定義 |
| 2 | `src/lib/agent/runner/mac.ts` | Mac runner provider 實作（WebSocket client → Workers） |
| 3 | `src/lib/agent/runner/registry.ts` | Runner 註冊表（Mac / Sandbox / VPS） |
| 4 | `src/lib/agent/events.ts` | 事件型別定義（spec §3.3 的 14 種），encode/decode helpers |
| 5 | `src/lib/agent/session-manager.ts` | Session CRUD + lifecycle actions（stop, resume, rename, archive, delete, share）高階 API |
| 6 | `src/lib/agent/post-turn-summary.ts` | 呼叫 LLM 生成 `{status_category, status_detail, needs_action}` |
| 7 | `src/pages/api/admin/sessions/[id]/watch.ts` | SSE 端點 |
| 8 | `src/pages/api/admin/sessions/[id]/stop.ts` | Stop action |
| 9 | `src/pages/api/admin/sessions/[id]/resume.ts` | 續聊 action |
| 10 | `src/pages/api/admin/sessions/[id]/share.ts` | Share token 建立/撤回 |
| 11 | `src/pages/api/admin/sessions/[id]/diff.ts` | Git diff 摘要 |
| 12 | `src/pages/shared/[token].astro` | 公開 transcript 頁 |
| 13 | `migrations/0028_session_v2.sql` | Schema migration |
| 14 | `scripts/mac-runner.mjs` | Mac 端的 agent worker 程式（連回 Workers，接收 tool 指令） |

---

## 6. 修改的檔案

| # | 路徑 | 改什麼 |
|---|---|---|
| 1 | `src/lib/agent/durable-agent.ts` | 改事件型別為 spec §3.3、加 post_turn_summary、tool dispatch 三層分派、寫 D1 events、支援續聊 |
| 2 | `src/server/agents/session-do.ts` | 修 import 路徑（agent-os → agent）、改 broadcast 為寫 D1 + bump KV、加 stop/resume 處理 |
| 3 | `src/pages/api/admin/sessions/index.ts` | POST 改為建 session record + 透過 runner provider 啟動（不再直接 proxy DO） |
| 4 | `src/pages/api/admin/sessions/[id].ts` | GET 加 summary 欄位、PATCH 支援 rename/archive/pin、DELETE 支援刪除 |
| 5 | `src/pages/admin/index.astro` | 加 composer（指令框 + Mode/模型 selector）、加「需要你」區、加 Recents 列表（用 post_turn_summary.status_detail）、加 Usage 一行 |
| 6 | `src/pages/admin/sessions/[id].astro` | 改為即時事件流渲染（SSE EventSource）、加 lifecycle action 按鈕（Stop/Resume/Rename/Archive/Delete/Share/Diff） |
| 7 | `src/pages/admin/sessions/index.astro` | 改為從 `agent_sessions` 讀列表（不再讀 flow_runs），加 Pinned/Archived tab、tag 區分 manual/routine/API |

---

## 7. 執行流程（Home → 跑 agent → 看結果）

```
1. 使用者在 Home composer 輸入指令、選模型
2. POST /api/admin/sessions → 建 session record（D1）、選 runner provider
3. Runner provider 啟動 agent worker：
   - Mac：透過 WebSocket 連線發 { type: 'start', sessionId, prompt, model }
   - （Phase 5）Sandbox：provision container → clone repo → start agent
4. Agent worker 啟動 runLoop()：
   a. 寫 system/init event（D1）
   b. 寫 user event（使用者指令）
   c. 呼叫 LLM
   d. 寫 assistant event
   e. 若 tool_use：分派到 runner（沙箱）或 Workers（Web/MCP）
   f. 寫 tool_result event
   g. 回到 c 直到 stop_reason != tool_use 或 MAX_TURNS
   h. 呼叫 post_turn_summary LLM → 寫 post_turn_summary event → 更新 session record
5. 瀏覽器 EventSource 連 /sessions/:id/watch，收到 events 逐條渲染
6. 跑完後 Session 頁顯示完整 transcript，可執行 lifecycle actions
```

---

## 8. 實作順序

1. **Schema migration**（0028_session_v2.sql）→ 跑 `wrangler d1 migrations apply`
2. **事件型別定義**（`agent/events.ts`）→ 14 種事件的 TypeScript 型別
3. **Session manager**（`agent/session-manager.ts`）→ CRUD + lifecycle（先不含 runner 整合）
4. **SSE watch 端點**（`sessions/[id]/watch.ts`）→ 讀 D1 events、long-poll KV timestamp
5. **改造 durable-agent.ts**：新事件型別、寫 D1、bump KV
6. **修 session-do.ts**：修 import、改 broadcast 行為
7. **Session 頁改造**：EventSource 即時渲染 + lifecycle action 按鈕
8. **Lifecycle API**：stop、resume、rename/archive/delete、share、diff
9. **Runner provider 介面**（`agent/runner/`）
10. **Mac runner 實作**（`scripts/mac-runner.mjs` + `agent/runner/mac.ts`）
11. **Home composer**：指令框 + 模型選擇 + Recents + 需要你 + Usage
12. **Session 列表改造**：Pinned/Archived tab、tag、summary
13. **Share 公開頁**（`/shared/[token].astro`）
14. **post_turn_summary**：LLM 生成 + 寫入 session record
15. **整合測試**：從 Home 打字 → agent 跑 → Session 頁看即時事件 → 執行 lifecycle action

---

## 9. 風險評估

| 風險 | 嚴重度 | 緩解 |
|---|---|---|
| SSE 長連線在 Cloudflare Workers 有 30 秒 CPU 上限 | 高 | SSE 端點做 long-poll（30 秒內回應），client 自動重連帶 resume_token；或改用 DO 的 WebSocket（不受 CPU 限制） |
| Mac runner 的 WebSocket 連線斷線時 session 卡在 running | 中 | heartbeat 機制 + timeout 自動 cancel |
| 兩套表並存期間 schema 複雜 | 中 | Phase 2 只用 agent_sessions 系列；agent_runs 保留給 scheduler 的 RAG agents，不混用 |
| LLM 呼叫費用（每 turn post_turn_summary 額外一次呼叫） | 低 | 用最便宜的模型（haiku）、可關閉 |
| DO import 路徑已過時（指向 agent-os） | 低 | Phase 2 第一步修正 |

---

## 10. Tier 2 確認清單

以下事項需使用者逐項確認再執行：

- [ ] Migration 0028_session_v2.sql 的欄位設計（§4.1）
- [ ] agent_events 加 event_id 的回填方式（§4.2）
- [ ] runner_connections 新表（§4.3）
- [ ] Mac runner 連線協定選擇（WebSocket vs SSE）
- [ ] SSE vs DO WebSocket 作為瀏覽器連線方式（§2.2）
- [ ] post_turn_summary 使用的模型（建議 haiku）

---

## 11. 不在 Phase 2 範圍

- Mode 三檔 + 權限協定（Phase 4）——Phase 2 的 agent 全部以 Auto mode 跑
- Routine trigger（Phase 3）——Session 可手動建、無排程
- Cloudflare Sandbox（Phase 5）——只有 Mac runner
- MCP proxy（Phase 6）
- Diff（Phase 2 做骨架 API，但真正走 GitHub compare 要等 Phase 5 有 sandbox repo push）
- env_manager_log 事件（provision→clone→setup_script→start_agent 四步）——Phase 5 sandbox 才有
