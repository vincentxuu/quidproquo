# Admin v2 — Phase 3 實作計畫

狀態：已完成（2026-08-29）。本檔保留 Phase 3 實作計畫；待 production/preview 觀察排程與通知。
規格：`docs/admin-v2-spec.md` §4（Routine）、§4.1（Routine vs Flow）。

## 0. 目標

讓 Routine 能排程執行、API 觸發、手機收到 Discord 通知——做完後能設一個每天早上跑的 agent 任務，手機 Discord 看到結果。

---

## 1. 現有狀態

### 已有

| 項目 | 位置 | 狀態 |
|---|---|---|
| `routines` D1 表 | `migrations/0027_routines.sql` | 有 id、name、instructions、trigger_type、cron、repo、enabled、model 等欄位 |
| Routine CRUD API | `api/admin/routines/{index,\[id\]}` | GET list、POST create、GET/:id detail、PUT/:id update、DELETE/:id、POST/:id action=run |
| Routine 頁面 | `admin/routines/{index,new,\[id\]}` | 列表 + 新增表單 + 詳情頁（已切 AdminV2Layout） |
| Agent scheduler | `src/lib/agent/scheduler.ts` | `dispatchRun()` + `dispatchFromCron()` — 建立 `agent_runs` 並執行 agent loop |
| Cron registry | `src/lib/agent/scheduler/cron-registry.ts` | 空的 `scheduledAgentEntries[]`，無 routine 整合 |
| Wrangler cron | `wrangler.jsonc` | 已配 5 條 cron（*/15、週日 02:00 等），走 `src/pages/api/admin/sessions/scheduled.ts` |
| "Run now" | `api/admin/routines/[id].ts` POST | 透過 `AGENT_SESSION_DO` Durable Object 發起 session |

### 缺少

| 項目 | 說明 |
|---|---|
| **Schedule trigger 整合** | cron 觸發時要查 `routines` 表、找到期的 routine、呼叫 scheduler.dispatchRun |
| **API trigger** | fire URL + Bearer token 機制（routine 級別的獨立 API key） |
| **Paused 行為** | cron/API 觸發時檢查 `enabled`；API fire 回 400 `routine_paused`；Run now 不受限 |
| **Stagger** | UTC 儲存 + 隨機偏移避免同一秒大量觸發 |
| **通知系統** | 完全沒有——不存在 Discord webhook、ntfy、或任何 `NotificationChannel` 抽象 |
| **routine_summary 規則** | agent 決定要不要通知的邏輯 |
| **平台層失敗通知** | sandbox/setup 掛掉時 Workers 直接發通知 |
| **Schema 擴充** | 缺 api_token、stagger_seconds、notification_channels、last_run_at、next_run_at 等欄位 |
| **Routine 詳情 UI** | 缺 Active/Paused toggle、Next run、Last run、Runs 歷史列表 |

---

## 2. Schema 變更

### 2.1 `routines` 表擴充（migration 0028）

```sql
ALTER TABLE routines ADD COLUMN api_token TEXT;
ALTER TABLE routines ADD COLUMN api_token_created_at INTEGER;
ALTER TABLE routines ADD COLUMN stagger_seconds INTEGER NOT NULL DEFAULT 0;
ALTER TABLE routines ADD COLUMN notification_enabled INTEGER NOT NULL DEFAULT 0;
ALTER TABLE routines ADD COLUMN notification_channels TEXT; -- JSON: [{type:'discord',webhook_url:'...'}, ...]
ALTER TABLE routines ADD COLUMN last_run_id TEXT;
ALTER TABLE routines ADD COLUMN last_run_at INTEGER;
ALTER TABLE routines ADD COLUMN last_run_status TEXT;
ALTER TABLE routines ADD COLUMN next_run_at INTEGER;
ALTER TABLE routines ADD COLUMN behavior_auto_fix_pr INTEGER NOT NULL DEFAULT 0;
ALTER TABLE routines ADD COLUMN behavior_auto_create_pr INTEGER NOT NULL DEFAULT 0;
```

### 2.2 `notification_channels` 全域設定表（migration 0028）

```sql
CREATE TABLE IF NOT EXISTS notification_channels (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL, -- 'discord' | 'email' | 'slack' | 'telegram' | 'ntfy'
  name TEXT NOT NULL,
  config TEXT NOT NULL, -- JSON: webhook_url, email, bot_token, etc.
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

---

## 3. Notification 系統

### 3.1 通道抽象

```
src/lib/notification/
├── channel.ts            # NotificationChannel interface: send(summary) + renderActions?(approvals)
├── channels/
│   ├── discord.ts        # Discord webhook adapter（Phase 3 v1）
│   └── ntfy.ts           # ntfy adapter（dev debug）
├── router.ts             # 根據 routine 設定 + 全域設定，決定送哪些通道
├── summary.ts            # routine_summary 規則：agent 回傳的摘要 → 要不要通知
└── platform-failure.ts   # 平台層失敗（sandbox/setup 掛）→ 直接通知，不經 agent
```

### 3.2 NotificationChannel 介面

```typescript
interface RoutineSummary {
  routineId: string
  routineName: string
  sessionId: string
  status: 'success' | 'failed' | 'needs_action'
  detail: string
  shouldNotify: boolean  // agent 自決
}

interface NotificationChannel {
  type: string
  send(summary: RoutineSummary): Promise<void>
  renderActions?(approvals: ApprovalAction[]): Promise<void>  // Phase 5: Discord Interactions
}
```

### 3.3 通知規則（spec §4）

| 來源 | 何時通知 | 通知者 |
|---|---|---|
| Agent 正常完成 | agent 依 `shouldNotify` 自決（沒事沉默、有問題才通知） | Workers 讀 summary |
| Agent 失敗 | 一律通知 | Workers |
| 平台層失敗 | 一律通知（sandbox/setup 掛） | Workers 直接發，不經 agent |

### 3.4 Discord webhook（v1）

- 使用 Discord Webhook URL（Settings › Notifications 頁面設定）
- POST `embeds[]` 格式：routine 名、狀態 emoji、摘要、session 連結
- 不做互動按鈕（Phase 5 再用 Discord Interactions Endpoint）

### 3.5 ntfy（dev debug）

- `POST https://ntfy.sh/{topic}` 純文字
- 只在 `NTFY_TOPIC` env var 有設時啟用

---

## 4. Trigger 實作

### 4.1 Schedule trigger

**流程：**

```
wrangler cron (*/15 * * * *) 
  → api/admin/sessions/scheduled.ts
    → 查 routines 表：enabled=1 AND trigger_type='schedule' AND next_run_at <= now()
    → 對每個到期 routine：
       1. 檢查 stagger（next_run_at + stagger_seconds）
       2. 建立 Session（透過 scheduler.dispatchRun）
       3. 更新 last_run_id、last_run_at、算出下一個 next_run_at
       4. Session 完成後 → notification router 決定要不要通知
```

**Cron 解析**：用 `cron-parser` npm 套件（或自寫簡易版）把 `routines.cron` 轉成下一個 `next_run_at`。

**Stagger**：routine 建立時產生隨機 `stagger_seconds`（0–300），每次觸發加上這個偏移。

**Schedule 類型**：
- Once：`trigger_type='schedule'`，`cron=null`，`next_run_at` 為指定時間，跑完後自動 `enabled=0`
- 週期性：`cron` 欄位有值，每次跑完重算 `next_run_at`

### 4.2 API trigger

**機制：**

```
POST /api/admin/routines/:id/fire
Headers: Authorization: Bearer <api_token>

→ 檢查 token 是否匹配 routines.api_token
→ 檢查 enabled：若 paused 回 400 { error: 'routine_paused' }
→ 建立 Session
→ 回 200 { sessionId }
```

**Token 管理：**
- `POST /api/admin/routines/:id/token` → 產生新 token（SHA-256 random），舊 token 立即失效
- `DELETE /api/admin/routines/:id/token` → 刪除 token，後續 fire 回 401
- Token 儲存：`routines.api_token` 欄位（hashed）

**Run now**（UI 按鈕）：走 `POST /api/admin/routines/:id { action: 'run' }`，不檢查 `enabled`。

---

## 5. 新檔案

| # | 路徑 | 說明 |
|---|---|---|
| 1 | `src/lib/notification/channel.ts` | NotificationChannel interface |
| 2 | `src/lib/notification/channels/discord.ts` | Discord webhook adapter |
| 3 | `src/lib/notification/channels/ntfy.ts` | ntfy adapter |
| 4 | `src/lib/notification/router.ts` | 通道路由 + 全域/routine 級設定讀取 |
| 5 | `src/lib/notification/summary.ts` | routine_summary 規則解析 |
| 6 | `src/lib/notification/platform-failure.ts` | 平台層失敗直接通知 |
| 7 | `src/pages/api/admin/routines/[id]/fire.ts` | API trigger endpoint |
| 8 | `src/pages/api/admin/routines/[id]/token.ts` | Token 管理 (POST/DELETE) |
| 9 | `src/pages/admin/settings/notifications.astro` | 通知通道設定頁（取代骨架） |
| 10 | `migrations/0028_routine_triggers_notifications.sql` | Schema 擴充 |

## 6. 修改的檔案

| # | 路徑 | 變更 |
|---|---|---|
| 1 | `src/pages/api/admin/sessions/scheduled.ts` | 加入 routine schedule trigger 掃描邏輯 |
| 2 | `src/pages/api/admin/routines/index.ts` | POST 時產生 stagger_seconds、算 next_run_at |
| 3 | `src/pages/api/admin/routines/[id].ts` | PUT 支援新欄位；Run now 完成後觸發通知 |
| 4 | `src/pages/admin/routines/[id].astro` | 詳情 UI：Active/Paused toggle、Next run、Last run、Runs 歷史、API fire URL 顯示 |
| 5 | `src/pages/admin/routines/new.astro` | 表單擴充：trigger 類型選擇、cron 輸入、通知開關 |
| 6 | `src/pages/admin/routines/index.astro` | 列表顯示 Next run、Last run status |
| 7 | `wrangler.jsonc` | env var: `DISCORD_WEBHOOK_URL`、`NTFY_TOPIC` |

---

## 7. API 端點

| Method | 路徑 | 用途 |
|---|---|---|
| POST | `/api/admin/routines/:id/fire` | API trigger（Bearer token） |
| POST | `/api/admin/routines/:id/token` | 產生新 API token |
| DELETE | `/api/admin/routines/:id/token` | 刪除 API token |
| GET | `/api/admin/settings/notifications` | 列出全域通知通道（Settings 頁用） |
| POST | `/api/admin/settings/notifications` | 新增/更新通知通道 |

現有 routines API（GET/POST/PUT/DELETE）保留，擴充支援新欄位。

---

## 8. 實作順序

1. **Schema migration**：新增欄位 + notification_channels 表
2. **Notification 系統**：channel interface → Discord adapter → ntfy adapter → router
3. **Schedule trigger**：修改 `sessions/scheduled.ts` 掃描 routines，cron 解析，stagger
4. **API trigger**：fire endpoint + token 管理
5. **Routine UI 擴充**：詳情頁 toggle/next run/runs history + new 表單 trigger/通知
6. **Settings › Notifications 頁面**：取代骨架，通道 CRUD
7. **平台層失敗通知**：Session/runner 失敗時直接通知
8. **測試**：手動建 routine → 等 cron 觸發 → 確認 Discord 收到

---

## 9. 風險評估

| 風險 | 嚴重度 | 緩解 |
|---|---|---|
| Cron 精度（Workers cron 最小粒度 1 分鐘） | 低 | 夠用；需要秒級用 Durable Object alarm |
| Stagger 跨 cron 週期 | 低 | stagger 上限 300s < 最小 cron 間隔 15 分鐘 |
| API token 洩漏 | 中 | Token hash 儲存 + regenerate 廢舊 + HTTPS only |
| Discord webhook URL 洩漏 | 中 | 存 D1 不落代碼；Settings 頁面 mask 顯示 |
| 大量 routine 同時到期 | 中 | 靠 stagger 分散；Workers CPU 時間有限，超過佇列化 |
| Phase 2 Session 引擎 API 可能變 | 高 | Phase 3 嚴格依賴 Phase 2 的 session 建立介面，開工前確認 Phase 2 穩定 |

---

## 10. 開放問題

1. **Cron 解析用第三方套件還是自寫？** `cron-parser` 套件 ~5KB，支援完整 cron 語法含 timezone。自寫只需 5 種 preset（Once/Hourly/Daily/Weekdays/Weekly）+ Custom。
2. **API token 要不要加 rate limit？** 防止外部濫打 fire endpoint。
3. **通知通道要不要支援多 Discord webhook？** 例如不同 routine 送不同 channel。Spec 說通道設定在 Settings 全域，但 routine 可選要不要通知。
4. **Once schedule 跑完自動 disable 的 UX？** 列表上要不要特殊標記「已執行的一次性排程」vs「手動暫停」？

---

## 11. Routine 與 Flow 共用 trigger（§4.1）

Spec 明確指出 Routine 和 Flow 的 trigger（Schedule/GitHub event/API）**共用同一套實作**。Phase 3 先為 Routine 建 trigger 系統，設計時要讓 Flow 能直接接入：

- `src/lib/notification/` 不綁 routine，接受通用的 `{ type, id, name, sessionId, status, detail }` 結構
- API trigger 的 token 機制可以抽象成 `TriggerToken { entityType: 'routine' | 'flow', entityId: string, token: string }`
- Schedule trigger 的 cron 掃描可以查兩張表（routines + flows），或抽成通用的 `scheduled_triggers` 中間表

Phase 3 先只接 Routine；Phase 5+ 接 Flow 時不用重寫。
