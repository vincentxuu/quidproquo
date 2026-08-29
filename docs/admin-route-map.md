# /admin 路由地圖

更新：2026-08-29（Phase 1 全遷完成）。這份是 `/admin/**` 與 `/api/admin/**` 的唯一總表；新增或搬移路由時同步改這裡。

## Layout

統一使用 `src/layouts/AdminV2Layout.astro`，五個一級 tab：Home / Sessions / Routines / Flows / Settings。
舊 `AdminLayout.astro` 與 `AdminConsoleLayout.astro` 已退役刪除。

Auth：layout 內 `verifySession` cookie check → `/login?next=`。
Guard：`src/pages/admin/_guard.ts` 提供 `ensureConsoleUmbrella()`。

## 頁面

### Home

| 頁面 | 用途 | 主要 API |
|---|---|---|
| `/admin` | 總覽（composer + 需要你 + recents + usage） | `site/status` |

### Sessions

| 頁面 | 用途 | 主要 API |
|---|---|---|
| `/admin/sessions` | Session 列表 | `sessions` |
| `/admin/sessions/:id` | Session 詳情（事件流、步驟、Diff、權限卡） | `sessions/:id/*` |
| `/admin/sessions/:id/evidence` | Session 的 evidence | `evidence/*` |
| `/admin/sessions/:id/artifacts/:aid` | Session 的 artifact 詳情 | `artifacts/:vid/*` |
| `/admin/sessions/launch` | 新 Session | `sessions` |
| `/admin/sessions/evidence` | Evidence 獨立列表 | `evidence/*` |
| `/admin/sessions/artifacts` | Artifact 獨立列表 | `artifacts/*` |

### Routines

| 頁面 | 用途 | 主要 API |
|---|---|---|
| `/admin/routines` | Routine 列表 | `routines` |
| `/admin/routines/new` | 新增 Routine | `routines` |
| `/admin/routines/:id` | Routine 詳情 | `routines/:id` |

### Flows

| 頁面 | 用途 | 主要 API |
|---|---|---|
| `/admin/flows` | Flow 列表 | `flows` |
| `/admin/flows/new` | 新增 Flow | `flows` |
| `/admin/flows/:id` | Flow 詳情 | `flows/:id/*` |
| `/admin/flows/:id/edit` | Flow 編輯器 | `flows/:id/*` |

### Settings

| 頁面 | 用途 | 主要 API |
|---|---|---|
| `/admin/settings` | Settings hub（卡片格） | — |
| `/admin/settings/environments` | 執行環境（骨架，Phase 5） | — |
| `/admin/settings/site` | Site Admin landing | — |
| `/admin/settings/site/content` | 內容盤點 | `site/content/*` |
| `/admin/settings/site/pipelines` | 內容 pipeline | `site/pipelines/*` |
| `/admin/settings/site/jobs` | Pipeline job 列表 | `site/jobs/*` |
| `/admin/settings/site/stats` | 站台統計 | `site/stats/*` |
| `/admin/settings/site/rag` | RAG flags／engine | `site/rag*` |
| `/admin/settings/site/traces` | RAG 追蹤（Langfuse） | `site/traces/*` |
| `/admin/settings/site/deep-research` | Deep Research 歷史 | `site/deep-research/*` |
| `/admin/settings/site/extensions` | Skills / MCP / Plugins（舊 agent-ecosystem） | `settings/extensions/*` |
| `/admin/settings/site/ops` | 手動觸發 jobs | `site/pipelines/run` |
| `/admin/settings/site/system` | 系統設定 | `settings` |
| `/admin/settings/models` | 模型供應商 | `settings/models/*` |
| `/admin/settings/models/:id` | 供應商詳情 | `settings/models/*` |
| `/admin/settings/models/cost` | 費用明細 | `settings/cost/*` |
| `/admin/settings/extensions` | Extensions hub | — |
| `/admin/settings/extensions/skills` | Skills CRUD | `settings/extensions/skills/*` |
| `/admin/settings/extensions/mcp-servers` | MCP Servers | `settings/extensions/mcp-servers/*` |
| `/admin/settings/extensions/plugins` | Plugins | `settings/extensions/plugins/*` |
| `/admin/settings/extensions/marketplace` | Marketplace（骨架） | — |
| `/admin/settings/permissions` | 權限規則 | `settings/permissions/*` |
| `/admin/settings/permissions/:key` | 規則詳情 | `settings/permissions/:id/*` |
| `/admin/settings/access` | RBAC 使用者／角色 | `settings/access/*` |
| `/admin/settings/access/audit` | 稽核日誌 | `settings/access/*` |
| `/admin/settings/access/roles/:id` | 角色詳情 | `settings/access/roles/:id/*` |
| `/admin/settings/access/users/:id` | 使用者詳情 | `settings/access/users/:id/*` |
| `/admin/settings/notifications` | 通知通道（骨架，Phase 3） | — |
| `/admin/settings/behavior` | 全域行為（骨架，Phase 3） | — |

## API

`/api/admin/**` 每支路由各自 `requireAdmin(cookies)`。
Cron 入口用 `requireScheduledAuth`（`X-Crawl-Secret`）：`site/pipelines/scheduled`、`sessions/scheduled`、`site/traces/retention`。

| 前綴 | 用途 |
|---|---|
| `/api/admin/sessions/*` | Session 生命週期、approvals、排程 |
| `/api/admin/routines/*` | Routine CRUD |
| `/api/admin/flows/*` | Flow CRUD、執行、preset |
| `/api/admin/evidence/*` | Evidence 衝突、reputation |
| `/api/admin/artifacts/*` | Artifact 狀態、匯出、regeneration |
| `/api/admin/settings/` | 系統設定 CRUD |
| `/api/admin/settings/models/*` | 模型 registry、health、credential |
| `/api/admin/settings/cost/*` | 費用 rollup、backfill |
| `/api/admin/settings/permissions/*` | 權限定義、binding |
| `/api/admin/settings/access/*` | RBAC roles、users |
| `/api/admin/settings/extensions/{skills,mcp-servers,plugins}/*` | 擴充管理 |
| `/api/admin/site/*` | Site Admin：content、stats、jobs、pipelines、rag、traces、deep-research、status |

## 異動紀錄

### 2026-08-29 Phase 1 全遷

- 統一 Layout → `AdminV2Layout.astro`，退役兩套舊殼。
- Lib 重組：14 個 rename（agent-os→agent、agent-flow→flow、rag→retrieval 等），見 `docs/admin-v2-phase1-plan.md` §4。
- 清理 5 項路由待決：agent-os 死端點、evidence 合併、agent-skills 刪除、provider 標註、死樁清理。
- 全部頁面和 API 搬至 v2 路由結構。
- Provider 同前綴共存狀態：RAG provider store（settings KV）與 agent provider registry（D1）已合併到 `settings/models/`，但底層仍是兩套 lib，待長期合併。

### 2026-08-27 已整理

- 刪除死路由 5 支、providers 301 redirect、導覽重排、旗標退役標註。
