# /admin 路由地圖

更新：2026-08-27。這份是 `/admin/**` 與 `/api/admin/**` 的唯一總表；新增或搬移路由時同步改這裡。

## 兩個殼

| 殼 | 路徑 | Layout | 登入 | 旗標 |
|---|---|---|---|---|
| Site Admin（內容／RAG／系統） | `/admin/*` | `src/layouts/AdminLayout.astro` | layout 內檢查 session → `/login?next=` | 無 |
| Agent Console（flow／run／治理） | `/admin/console/**` | `src/layouts/AdminConsoleLayout.astro` | 同上 | `AGENT_CONSOLE_ENABLED`（umbrella；各頁旗標已退役） |

`/api/admin/**` 沒有 middleware，每支路由各自 `requireAdmin(cookies)`；cron 入口改用 `requireScheduledAuth`（`X-Crawl-Secret`）：`pipelines/scheduled`、`agents/scheduled`、`traces/retention`。

## 頁面

### Site Admin 導覽（`AdminLayout.astro` navItems 順序）

| 群組 | 頁面 | 用途 | 主要 API |
|---|---|---|---|
| Monitor | `/admin` | 總覽 | `status`、`jobs`、`rag` |
| Content | `/admin/content` | 內容盤點／草稿／新鮮度／壞連結 | `content/*` |
| Content | `/admin/content-pipelines` | 內容 pipeline 啟動 | `pipelines`、`jobs/:id` |
| Content | `/admin/jobs` | pipeline job 列表 | `jobs`、`jobs/:id` |
| Content | `/admin/stats` | 站台統計 | `stats/*` |
| AI | `/admin/console` | → Agent Console 殼 | — |
| AI | `/admin/console/providers` | 模型供應商（`/admin/providers` 301 至此） | `providers*` |
| AI | `/admin/rag` | RAG flags／engine／shadow／smoke | `rag`、`rag-eval`、`rag-smoke` |
| AI | `/admin/traces` | RAG 追蹤（Langfuse，與 console runs 無關） | `traces*` |
| AI | `/admin/deep-research` | Deep Research 報告歷史 | `deep-research*` |
| AI | `/admin/agent-skills` | Deep Research 用 skill 文字（settings-store） | `agent-skills` |
| AI | `/admin/agent-ecosystem` | Skills／MCP Servers／Plugins（D1） | `/api/skills`、`/api/mcp-servers`、`/api/plugins`（非 admin 前綴，但都 `requireAdmin`） |
| System | `/admin/ops` | 手動觸發 jobs | `jobs`、`pipelines/run` |
| System | `/admin/settings` | 系統設定 | `settings` |

### Agent Console 導覽（`AdminConsoleLayout.astro`）

| 群組 | 頁面 | 主要 API |
|---|---|---|
| Operate | `/admin/console`（flow selector）、`/runs`、`/runs/:id`、`/runs/launch` | `flows/:id/run`、`console/runs/:id/*`、`agents/approvals/:id/:action` |
| Inspect | `/evidence`、`/runs/:id/evidence`、`/artifacts`、`/runs/:id/artifacts/:aid` | `console/evidence/conflicts/:id/resolve`、`artifacts/:vid/{status,export/:dest}` |
| Manage | `/flows`（+ `/new`、`/:id`、`/:id/edit`）、`/providers`（+ `/:id`）、`/policies`（+ `/:key`） | `flows*`、`providers*`、`policies*` |
| Observe | `/cost` | `console/cost`、`console/cost/backfill` |
| Admin | `/rbac`（+ `/audit`、`/roles/:id`、`/users/:id`） | `console/rbac/**` |

`/admin/console/dashboard` 只做 302 → `/cost`（規格相容導向，保留）。

## API 命名規則（整理後）

| 前綴 | 意義 |
|---|---|
| `/api/admin/console/*` | 只給 Console 頁面用的 BFF（runs 事件／excerpt、cost、rbac、evidence resolve） |
| `/api/admin/{flows,policies,providers,artifacts,evidence,agents}/*` | 各子系統的資源 API；頁面與 runbook curl 共用 |
| `/api/admin/{content,stats,jobs,pipelines,rag*,traces,deep-research,agent-skills,settings,status}` | Site Admin 用 |

## 2026-08-27 已整理

- 刪除死路由（無頁面、腳本、文件引用）：`flows/:id/runs/**`（5 支，與 `console/runs/:id/*` 讀同一組 `flow_runs` 表）、`flows/test-llm`、`agents/health`、`artifacts/runs/:flowRunId`、`deep-research/agent-skills`（純 re-export）。
- `/admin/providers.astro` 改 301 → `/admin/console/providers`（兩頁本來就渲染同一個 `ProviderManagement` 元件，console 版多了詳情頁）。
- Site Admin 導覽重排：統計併入 Content；AI 群組依「Console → 供應商 → RAG → 追蹤 → Deep Research → Skills」排；孤兒頁 `/admin/agent-ecosystem` 補進導覽。
- `docs/agent-console-runbook.md` 標註各頁旗標已退役。

## 仍待決定（未動）

| 項目 | 現況 | 建議 |
|---|---|---|
| `/api/admin/agents/*`（agent-os：`agents`、`:id/run`、`:id/enqueue`、`approvals` GET、`runs*`、`events/stream`） | 沒有任何頁面用，只有 `docs/agent-os-runbook.md` 的 curl；資料表是 `agent_runs`，與 console 的 `flow_runs` 是兩套 | 若 agent-os 已被 flow runtime 取代，整組連 runbook 一起退；否則在 console 補一個 agent-os runs 頁。要人拍板 |
| `/api/admin/evidence/*`（GET conflicts、reputation、runs/:id） vs `/api/admin/console/evidence/*`（resolve） | 讀寫分在兩個 namespace，同一個 lib | 把 `console/evidence/conflicts/:id/resolve` 搬到 `evidence/conflicts/:id/resolve`，改一處 fetch |
| `/admin/agent-skills` vs `/admin/agent-ecosystem` | 兩個 skill 管理頁、兩個資料來源（settings-store 純文字 vs D1 skills 表） | 把 deep-research 的 skill 文字遷到 D1 skills 後刪 `agent-skills` 頁與 API |
| `/api/admin/providers`（RAG provider store）與 `/providers/registry`、`/health`（agent-providers） | 同前綴、不同 lib | 等 RAG provider 設定併入 agent-providers registry 後合併 |
| console 各頁 `isPageEnabled()`／`consolePhaseFor()` | 永遠回 true／'enabled' 的死樁，20 頁模板還留著 `{!ready && …}` 分支 | 逐頁拔掉；純機械但要動 20 個模板，另開一輪 |
| `/admin/traces` 與 `/admin/console/runs` | 兩套可觀測性（Langfuse vs D1 flow_runs） | 導覽已改名「RAG 追蹤」區分；長期看 flow runtime 是否也送 Langfuse |
