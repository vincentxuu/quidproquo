# Admin v2 — Phase 5 實作計畫

狀態：草稿（2026-08-29）。前置：Phase 2（Session 引擎）、Phase 3（Routine + Schedule trigger）、Phase 4（Mode + 權限協定）。
規格：`docs/admin-v2-spec.md` §4（Trigger、Notifications）、§6（執行架構）、§7（Settings › Environments / Notifications）、§9b（待實測）。

## 0. 目標

不靠 Mac 也能跑 Session——Cloudflare Sandbox 成為預設 runner；GitHub event trigger 補齊 Routine 的第三種觸發；
通知通道齊備（Slack、Email、Telegram）且 Discord 從 webhook 升級為可互動核准。

---

## 1. Cloudflare Sandbox Provider

### 1.1 概念

Phase 2 的 Mac runner 是第一個 runner provider。Phase 5 加入 Cloudflare Sandbox 作為第二個（也是預設），
兩者共用 Phase 2 定義的 `RunnerProvider` 介面。

### 1.2 Sandbox 規格（spec §6 查證）

| 項目 | 值 |
|---|---|
| 套件 | `@cloudflare/sandbox@next`（1.0 preview） |
| 映像 | 自訂 Dockerfile，預設 Ubuntu 22.04 + Node 20 + git + pnpm |
| 規格 | standard-2（1 vCPU / 6 GiB RAM / 12 GB disk） |
| 網路 | `allowedHosts` / `deniedHosts`（glob，deny-by-default）；TLS interception |
| 憑證 | Outbound Worker 注入（沙箱發裸請求，Workers 依 host 補 token，可依 containerId 逐 session 區分） |
| 閒置 | `sleepAfter` 10 分鐘停機，停機後檔案全丟 |
| 冷啟動 | 預設等 30 秒（待實測） |
| 價格 | Workers Paid 含額，超出 CPU $0.00002/vCPU-s，台灣 egress $0.05/GB |

### 1.3 生命週期

```
provision（建映像 + 起容器，≤30s）
  → clone（git clone repo，若有掛 repo）
  → setup_script（npm install 等，Settings › Environments 定義）
  → start_agent（啟動 agent worker 連回 Workers）
  → [agent loop 跑…]
  → stop_hook（commit + push，照 stop-hook-git-check 範本）
  → 閒置停機（手動 Session）或 destroy()（Routine）
```

續聊時容器已停 → 重跑 provision → clone（同分支）→ setup → UI 顯示 Resumed。

### 1.4 Workspace 持久化

- Repo 每 Session 重新 clone（不用 R2 FUSE，git/node_modules 小檔隨機 I/O 太慢）
- Artifact / transcript 寫 R2（Phase 2 已有 R2 存儲）
- Stop hook 強制 commit + push → 容器拋棄式，git 是持久層

### 1.5 Network Mode 對照

| Mode | allowedHosts | deniedHosts | 用途 |
|---|---|---|---|
| None | 空 | `*` | 純離線，安全最高 |
| Trusted | `github.com`, `registry.npmjs.org`, 套件源 glob | 其餘 | 預設——只開 git + 套件源 |
| Full | `*` | 空 | 完全開放 |
| Custom | 使用者自訂 glob list | 使用者自訂 | 進階 |

### 1.6 檔案

```
新建：
  src/lib/agent/runners/sandbox-provider.ts       # Sandbox runner 實作：provision / exec / stop / destroy
  src/lib/agent/runners/sandbox-outbound.ts       # Outbound Worker：host → token 注入邏輯
  src/lib/agent/runners/types.ts                  # RunnerProvider 介面（Phase 2 已建；若未建，這裡定義）
  Dockerfile                                      # 沙箱映像定義（Ubuntu 22.04 + Node 20 + git + pnpm）

修改：
  wrangler.jsonc                                  # 加 containers / sandbox binding
  src/lib/agent/runners/mac-provider.ts           # 確保符合 RunnerProvider 介面（Phase 2 已建）
  src/pages/admin/settings/environments.astro     # 從骨架展開：runner 選擇、Network mode、env vars、setup script
  src/pages/api/admin/settings/environments/      # NEW：CRUD endpoints
```

---

## 2. Runner Provider 介面

```typescript
interface RunnerProvider {
  id: string;                    // 'sandbox' | 'mac' | 'vps'
  label: string;

  provision(session: SessionConfig): Promise<RunnerHandle>;
  exec(handle: RunnerHandle, command: string[]): Promise<ProcessHandle>;
  stop(handle: RunnerHandle): Promise<void>;
  destroy(handle: RunnerHandle): Promise<void>;

  status(handle: RunnerHandle): Promise<RunnerStatus>;
  isAvailable(): Promise<boolean>;
}

interface RunnerHandle {
  providerId: string;
  containerId: string;
  sessionId: string;
  networkMode: NetworkMode;
}

type NetworkMode = 'none' | 'trusted' | 'full' | 'custom';
type RunnerStatus = 'provisioning' | 'running' | 'sleeping' | 'stopped' | 'destroyed';
```

Phase 2 實作 `MacProvider`；Phase 5 實作 `SandboxProvider`。VPS 為未來擴充點。

---

## 3. GitHub Event Trigger

### 3.1 概念

Routine 的第三種 trigger（Phase 3 做了 Schedule + API）。獨立 webhook 資源，quickpick 選事件類型 + filter 過濾條件。

### 3.2 流程

```
GitHub webhook → Workers endpoint /api/admin/webhooks/github
  → 驗 signature（HMAC-SHA256）
  → 查 routine_triggers WHERE type='github_event' AND repo=payload.repository.full_name
  → 過濾 event type + filter expression
  → 對每個匹配的 Routine 建 Session（帶 trigger_id + event payload）
```

### 3.3 webhook 資源

每個 webhook 資源有：
- `webhook_id`（UUID）
- `repo`（GitHub full_name）
- `secret`（HMAC secret，建立時產生）
- `events[]`（訂閱的 event type：push、pull_request、issues 等）
- `created_at`、`active`

Routine 的 trigger config 引用 `webhook_id` + filter expression（JSON path 條件）。

### 3.4 檔案

```
新建：
  src/lib/agent/triggers/github-event.ts          # webhook 驗證 + 事件分派
  src/lib/agent/triggers/github-webhook-store.ts   # D1 CRUD for webhook resources
  src/pages/api/admin/webhooks/github.ts           # webhook receiver endpoint（公開，驗 HMAC）
  src/pages/api/admin/settings/webhooks/           # webhook 資源 CRUD（admin only）
    index.ts
    [id].ts

修改：
  src/lib/agent/scheduler.ts                       # 加 github_event trigger 分派
  src/pages/admin/routines/[id].astro              # trigger config UI 加 GitHub event tab
  src/pages/admin/routines/new.astro               # 同上
```

---

## 4. 通知通道

### 4.1 介面

```typescript
interface NotificationChannel {
  id: string;                    // 'discord' | 'slack' | 'email' | 'telegram' | 'ntfy'
  label: string;

  send(summary: RoutineSummary): Promise<void>;
  renderActions?(approvals: ApprovalRequest[]): Promise<InteractiveMessage>;
}

interface RoutineSummary {
  routineId: string;
  routineName: string;
  sessionId: string;
  status: 'success' | 'failure' | 'needs_action';
  statusDetail: string;
  durationMs: number;
  tokenUsage?: { input: number; output: number };
}
```

### 4.2 通道實作

| 通道 | Phase 3（已有） | Phase 5 新增 |
|---|---|---|
| Discord | webhook（send only） | Interactions Endpoint（核准按鈕） |
| Slack | — | Incoming Webhook adapter |
| Email | — | SES / Resend adapter |
| Telegram | — | Bot API adapter |
| ntfy | 開發期除錯 | 維持 |

### 4.3 Discord Interactions Endpoint

Phase 3 的 Discord webhook 只能送訊息。Phase 5 加 Interactions Endpoint：
1. 建一個 Discord Application，設 Interactions Endpoint URL = `/api/admin/webhooks/discord-interactions`
2. 通知訊息附帶 Action Row（Approve / Deny 按鈕），button `custom_id` 編碼 `approval:{approvalId}:{action}`
3. 收到 interaction → 驗 signature → 解碼 custom_id → 呼叫 approval API → 回 deferred update
4. 按鈕按過後 disable + 顯示結果

### 4.4 平台層失敗通知

sandbox / setup 掛掉時，Workers 直接發通知（不經 agent），內容固定：
- routine 名
- 失敗步驟（provision / clone / setup_script）
- stderr 前 500 字元

### 4.5 檔案

```
新建：
  src/lib/notifications/                           # 通知子系統
    channel.ts                                     # NotificationChannel 介面
    registry.ts                                    # 通道 registry + 分派
    adapters/
      discord-webhook.ts                           # Phase 3 已有，搬入此處
      discord-interactions.ts                      # Interactions Endpoint adapter
      slack-webhook.ts                             # Slack Incoming Webhook
      email-ses.ts                                 # SES / Resend adapter
      telegram-bot.ts                              # Telegram Bot API
      ntfy.ts                                      # ntfy（開發期）
    platform-failure.ts                            # 平台層失敗通知（不經 agent）

  src/pages/api/admin/webhooks/
    discord-interactions.ts                        # Discord Interactions Endpoint receiver

  src/pages/admin/settings/notifications.astro     # 從骨架展開：通道設定 UI

  src/pages/api/admin/settings/notifications/      # 通道設定 CRUD
    index.ts
    [channelId].ts
    test.ts                                        # 測試發送

修改：
  src/lib/agent/scheduler.ts                       # 整合 notification registry
```

---

## 5. Settings › Environments 頁面

### 5.1 UI 結構

```
┌─────────────────────────────────────────────┐
│ Runner 後端                                   │
│  ○ Cloudflare Sandbox（預設）                  │
│  ○ Mac（本機）                                 │
│  ○ VPS（自訂 SSH）                             │
├─────────────────────────────────────────────┤
│ Network                                       │
│  ○ None  ○ Trusted（預設）  ○ Full  ○ Custom  │
│  [Custom: allowed hosts textarea]             │
├─────────────────────────────────────────────┤
│ Environment Variables                          │
│  KEY=VALUE 列表（加密儲存，顯示 ••••••）        │
│  [+ Add] [Import .env]                        │
├─────────────────────────────────────────────┤
│ Setup Script                                   │
│  [textarea: npm install / custom commands]     │
│  Runs after clone, before agent starts.        │
└─────────────────────────────────────────────┘
```

### 5.2 API

```
GET/PUT  /api/admin/settings/environments          # 讀取/更新環境設定
POST     /api/admin/settings/environments/test     # 測試 provision（建容器 + 跑 setup script + 回結果）
```

---

## 6. Schema 變更

```sql
-- GitHub webhook 資源
CREATE TABLE github_webhooks (
  webhook_id TEXT PRIMARY KEY,
  repo TEXT NOT NULL,
  secret TEXT NOT NULL,            -- HMAC secret
  events TEXT NOT NULL DEFAULT '[]', -- JSON array of event types
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 通知通道設定
CREATE TABLE notification_channels (
  channel_id TEXT PRIMARY KEY,     -- 'discord-main', 'slack-ops', etc.
  type TEXT NOT NULL,              -- 'discord' | 'slack' | 'email' | 'telegram' | 'ntfy'
  config TEXT NOT NULL DEFAULT '{}', -- JSON: webhook_url, bot_token, chat_id, etc.
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 環境設定
CREATE TABLE environment_config (
  key TEXT PRIMARY KEY,            -- 'runner_provider', 'network_mode', 'setup_script', etc.
  value TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 環境變數（加密）
CREATE TABLE environment_variables (
  name TEXT PRIMARY KEY,
  encrypted_value TEXT NOT NULL,   -- AES-256-GCM encrypted
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- routine_triggers 擴充（Phase 3 已有 schedule + api，加 github_event）
-- 可能在現有 routine_triggers 表加一筆 type='github_event' 的 row，
-- config 欄位存 { webhook_id, event_type, filter }
```

---

## 7. 實作順序

1. **RunnerProvider 介面確認**：Review Phase 2 建的介面，確保 Sandbox 需要的 provision/exec/stop/destroy/status 都有
2. **Dockerfile + Sandbox Provider**：寫映像 + 實作 `SandboxProvider`，本地用 `wrangler dev` 測試 provision → exec → stop
3. **Outbound Worker**：credential 注入邏輯，測試沙箱內的 git clone（需 GitHub token）
4. **Settings › Environments**：展開骨架頁，接 API，測試切換 runner
5. **NotificationChannel 介面 + registry**：搬 Phase 3 的 Discord webhook adapter 進來
6. **Slack / Email / Telegram adapters**：逐通道實作 + 測試發送
7. **Discord Interactions Endpoint**：核准按鈕，測試 approve/deny flow
8. **Settings › Notifications**：展開骨架頁，接 API，測試通道設定
9. **GitHub Event Trigger**：webhook receiver + 資源 CRUD + Routine UI 整合
10. **平台層失敗通知**：sandbox/setup 掛掉時 Workers 直接發
11. **整合測試**：Routine 用 Sandbox runner 跑 → 完成 → Discord 按鈕核准 → 通知到 Slack/Email
12. **冷啟動實測**：量測 Sandbox provision 時間，調整 UI loading 提示

---

## 8. 風險評估

| 風險 | 嚴重度 | 緩解 |
|---|---|---|
| `@cloudflare/sandbox@next` API 在 1.0 前變動 | 高 | SandboxProvider 封裝層隔離；定期追蹤 changelog |
| 冷啟動超過 30 秒 | 中 | UI 顯示 provisioning 進度條（env_manager_log 四步事件）；考慮 warm pool |
| 停機後檔案全丟，續聊重跑 clone + setup | 中 | setup_script 應冪等且快；node_modules 可用全域 cache |
| Discord Interactions Endpoint 驗證複雜 | 低 | 用 `discord-interactions` npm package 處理 Ed25519 |
| 環境變數加密金鑰管理 | 中 | 用 Workers Secrets 存 AES key，不落 D1 |
| GitHub webhook secret 外洩 | 中 | HMAC 驗證 + IP 白名單（GitHub Meta API） |

---

## 9. 開放問題

| # | 問題 | 建議 |
|---|---|---|
| 1 | Sandbox warm pool：要不要預起 1-2 個容器減少冷啟動？ | 先不做，看實測數字再決定 |
| 2 | Email 用 SES 還是 Resend？ | Resend 開發體驗好、免設 SES identity；但 SES 已在 AWS |
| 3 | Telegram 用 Bot API polling 還是 webhook？ | Webhook（Workers 本來就有公開 endpoint） |
| 4 | 環境變數加密：AES-256-GCM 還是用 Workers Secret + KV？ | AES-256-GCM + Workers Secret 存 key |
| 5 | GitHub webhook IP 白名單是否必要？ | 有 HMAC 就夠，IP 白名單是加分但要維護 meta API 輪詢 |
| 6 | 冷啟動期間使用者可以取消嗎？ | 應該可以——Stop 會呼叫 destroy() |

---

## 10. 不在 Phase 5 範圍

- VPS runner provider（介面已定義，實作留待需要時）
- MCP 代理（Phase 6）
- Marketplace（Phase 6）
- Flow 的 GitHub event trigger（用同一套 trigger 實作，但 Flow 細部另案）
