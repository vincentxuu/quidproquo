# Admin v2 — Phase 1 實作計畫

狀態：待使用者確認後開工（2026-08-28）。
前置：`docs/admin-v2-spec.md`（定案）、`docs/admin-route-map.md`（現況）。

## 0. Phase 1 目標

一次全遷：統一 Layout、搬移所有頁面到 v2 路由、清理 5 個路由待決項、重組 lib 分層。
完成後不留兩套殼並存——舊 `AdminLayout` 和 `AdminConsoleLayout` 退役刪除。

---

## 1. 路由清理（5 個待決項）

在搬遷前先清理，減少搬運的垃圾。

### 1.1 agent-os 死端點（cleanup #1）

刪除 6 支無 UI、僅 runbook curl 使用的 API route：

```
刪除：
  src/pages/api/admin/agents/[id]/run.ts
  src/pages/api/admin/agents/[id]/enqueue.ts
  src/pages/api/admin/agents/runs/index.ts
  src/pages/api/admin/agents/runs/[runId]/index.ts
  src/pages/api/admin/agents/runs/[runId]/cancel.ts
  src/pages/api/admin/agents/runs/[runId]/events/stream.ts

保留（有前端呼叫）：
  agents/sessions/*、agents/approvals/*、agents/scheduled.ts

連帶：docs/agent-os-runbook.md 標註已刪端點為 deprecated。
```

### 1.2 evidence namespace 合併（cleanup #2）

```
搬移：
  src/pages/api/admin/console/evidence/conflicts/[conflictId]/resolve.ts
  → src/pages/api/admin/evidence/conflicts/[conflictId]/resolve.ts

修改：
  src/pages/admin/console/runs/[id]/evidence.astro — 改 fetch URL（1 行）
```

### 1.3 agent-skills 遷 D1（cleanup #3）

```
遷移腳本：把 settings-store 的 agent_skills blob parse 成 D1 skills rows
刪除：
  src/pages/admin/agent-skills.astro
  src/pages/api/admin/agent-skills/index.ts
agent-ecosystem 成為唯一 skill 管理 UI。
```

### 1.4 provider 同前綴（cleanup #4）

不動代碼。更新 `docs/admin-route-map.md` 標註：
> RAG provider store（settings KV）與 agent provider registry（D1）共用 `/api/admin/providers` 前綴，
> 兩套不同 lib、不同 DB table。待 RAG provider 設定併入 agent-providers registry 後合併。

### 1.5 死樁清理（cleanup #5）

```
刪除 _guard.ts 中的 isPageEnabled() 和 consolePhaseFor()（保留 ensureConsoleUmbrella）。
20 個 console 模板逐檔刪除：
  - import { isPageEnabled, consolePhaseFor }
  - const ready = isPageEnabled(...)
  - {!ready && <AdminState ...>} 分支
```

---

## 2. Pages 目標結構

一套 `AdminV2Layout.astro`，五個一級 tab。

```
src/pages/admin/
├── _guard.ts                              # 合併後唯一 auth guard
├── index.astro                            # Home（原位，換 layout）
│
├── sessions/                              # ← console/runs + agents/console
│   ├── index.astro                        #   ← console/runs/index
│   ├── [id].astro                         #   ← console/runs/[id]
│   ├── [id]/
│   │   ├── evidence.astro                 #   ← console/runs/[id]/evidence
│   │   └── artifacts/[artifactId].astro   #   ← console/runs/[id]/artifacts/[artifactId]
│   ├── launch.astro                       #   ← console/runs/launch
│   ├── artifacts.astro                    #   ← console/artifacts/index（獨立列表）
│   └── evidence.astro                     #   ← console/evidence/index（獨立列表）
│
├── routines/                              # 原位保留
│   ├── index.astro
│   ├── new.astro
│   └── [id].astro
│
├── flows/                                 # ← console/flows
│   ├── index.astro
│   ├── new.astro
│   └── [id]/
│       ├── index.astro
│       └── edit.astro
│
└── settings/
    ├── index.astro                        # Settings hub（卡片格，NEW）
    ├── environments.astro                 # Environments（spec §7 第一項：runner、Network、env vars、setup script，NEW 骨架）
    ├── site/
    │   ├── index.astro                    #   Site landing（NEW）
    │   ├── content.astro                  #   ← admin/content
    │   ├── pipelines.astro                #   ← admin/content-pipelines
    │   ├── jobs.astro                     #   ← admin/jobs
    │   ├── stats.astro                    #   ← admin/stats
    │   ├── rag.astro                      #   ← admin/rag
    │   ├── traces.astro                   #   ← admin/traces
    │   ├── deep-research.astro            #   ← admin/deep-research
    │   └── ops.astro                      #   ← admin/ops
    │   └── system.astro                   #   ← admin/settings
    ├── models/
    │   ├── index.astro                    #   ← console/providers/index
    │   ├── [id].astro                     #   ← console/providers/[id]
    │   └── cost.astro                     #   ← console/cost/index（費用明細）
    ├── permissions/
    │   ├── index.astro                    #   ← console/policies/index
    │   └── [policyKey].astro              #   ← console/policies/[policyKey]
    ├── access/
    │   ├── index.astro                    #   ← console/rbac/index
    │   ├── audit.astro                    #   ← console/rbac/audit
    │   ├── roles/[id].astro               #   ← console/rbac/roles/[id]
    │   └── users/[id].astro               #   ← console/rbac/users/[id]
    ├── extensions/                        # ← admin/agent-ecosystem 拆開
    │   ├── index.astro                    #   Extensions hub（四 tab）
    │   ├── skills.astro                   #   Skills CRUD
    │   ├── mcp-servers.astro              #   MCP Servers
    │   ├── plugins.astro                  #   Plugins
    │   └── marketplace.astro              #   Marketplace（NEW 骨架）
    ├── notifications.astro                # NEW 骨架
    └── behavior.astro                     # NEW 骨架
```

### 刪除的頁面（不留 redirect，內部後台）

```
admin/agent-skills.astro
admin/agent-ecosystem.astro
admin/content.astro
admin/content-pipelines.astro
admin/jobs.astro
admin/stats.astro
admin/rag.astro
admin/traces.astro
admin/deep-research.astro
admin/ops.astro
admin/settings.astro
admin/providers.astro
admin/agents/console.astro
admin/console/                          # 整個目錄
```

### Layout

```
新建：  src/layouts/AdminV2Layout.astro
刪除：  src/layouts/AdminLayout.astro
刪除：  src/layouts/AdminConsoleLayout.astro
```

---

## 3. API 目標結構

```
src/pages/api/admin/
├── _guard.ts                              # 共用 auth
│
├── sessions/                              # ← agents/sessions + console/runs
│   ├── index.ts                           #   list + create
│   ├── [id].ts                            #   detail
│   ├── [id]/
│   │   ├── cancel.ts                      #   ← console/runs/[runId]/cancel
│   │   ├── events.ts                      #   ← console/runs/[runId]/events
│   │   ├── evidence/search.ts             #   ← console/runs/[runId]/evidence/search
│   │   ├── excerpts/[excerptId]/body.ts   #   ← console/runs/[runId]/excerpts/…
│   │   └── steps/[stepRunId]/retry.ts     #   ← console/runs/[runId]/steps/…
│   ├── approvals/
│   │   ├── index.ts                       #   ← agents/approvals/index
│   │   └── [approvalId]/[action].ts       #   ← agents/approvals/[id]/[action]
│   └── scheduled.ts                       #   ← agents/scheduled
│
├── routines/
│   ├── index.ts                           #   ← routines.ts（拆成目錄）
│   └── [id].ts
│
├── flows/                                 # 原位保留
│   ├── _guard.ts
│   ├── index.ts
│   ├── validate.ts
│   └── [id]/
│       ├── index.ts
│       ├── run.ts
│       ├── set-enabled.ts
│       ├── version.ts
│       └── presets/
│
├── evidence/                              # 合併後（cleanup #2）
│   ├── _guard.ts
│   ├── conflicts/
│   │   ├── index.ts
│   │   └── [conflictId]/resolve.ts
│   ├── reputation/[domain].ts
│   └── runs/[flowRunId].ts
│
├── artifacts/                             # 原位保留
│
├── settings/
│   ├── index.ts                           #   系統設定 CRUD
│   ├── models/                            #   ← providers/*
│   │   ├── _guard.ts
│   │   ├── index.ts
│   │   ├── registry.ts
│   │   ├── health.ts
│   │   ├── [providerId]/rotate-key.ts
│   │   └── sync/[provider].ts
│   ├── permissions/                       #   ← policies/*
│   │   ├── index.ts
│   │   ├── [id]/
│   │   │   ├── index.ts
│   │   │   ├── assignments.ts
│   │   │   └── bindings.ts
│   │   └── runs/[flowRunId]/effective.ts
│   ├── access/                            #   ← console/rbac/*
│   │   ├── roles/
│   │   └── users/
│   ├── cost/                              #   ← console/cost
│   │   ├── index.ts
│   │   └── backfill.ts
│   └── extensions/                        #   ← api/skills + api/mcp-servers + api/plugins
│       ├── skills/
│       │   ├── index.ts                   #     ← api/skills/index
│       │   ├── [name].ts                  #     ← api/skills/[name]
│       │   ├── export.ts                  #     ← api/skills/export
│       │   └── import.ts                  #     ← api/skills/import
│       ├── mcp-servers/
│       │   ├── index.ts                   #     ← api/mcp-servers/index
│       │   └── [name].ts                  #     ← api/mcp-servers/[name]
│       └── plugins/
│           ├── index.ts                   #     ← api/plugins/index
│           └── [name].ts                  #     ← api/plugins/[name]
│
├── site/                                  # Site Admin API
│   ├── content/
│   ├── stats/
│   ├── jobs/
│   ├── pipelines/
│   ├── rag.ts
│   ├── rag-eval.ts
│   ├── rag-smoke.ts
│   ├── traces/
│   ├── deep-research/
│   └── status.ts
│
└── agents/
    └── _guard.ts                          # 保留，被 sessions/ 引用
```

### 刪除的 API

```
api/admin/agents/[id]/run.ts               # cleanup #1
api/admin/agents/[id]/enqueue.ts           # cleanup #1
api/admin/agents/runs/                     # cleanup #1（整個目錄）
api/admin/agent-skills/                    # cleanup #3
api/admin/console/                         # 搬完後整個目錄刪
api/admin/providers*                       # 搬到 settings/models/
api/admin/policies/                        # 搬到 settings/permissions/
api/admin/content/                         # 搬到 site/content/
api/admin/stats/                           # 搬到 site/stats/
api/admin/jobs/                            # 搬到 site/jobs/
api/admin/pipelines*                       # 搬到 site/pipelines/
api/admin/rag*.ts                          # 搬到 site/
api/admin/traces/                          # 搬到 site/traces/
api/admin/deep-research/                   # 搬到 site/deep-research/
api/admin/status.ts                        # 搬到 site/
api/admin/routines.ts                      # 拆成 routines/index.ts
api/admin/routines/[id].ts                 # 搬到 routines/[id].ts（路徑不變，只拆目錄）
api/skills/                                # 搬到 settings/extensions/skills/
api/mcp-servers/                           # 搬到 settings/extensions/mcp-servers/
api/plugins/                               # 搬到 settings/extensions/plugins/
```

---

## 4. Lib 目標結構

平鋪，對齊業界（Codex agent/ + session/ 分離模式）。

```
src/lib/
├── agent/                   # LLM 推理迴圈（← agent-os 的 kernel、context、memory）
├── session/                 # 生命週期容器（← agent-os 的 state-machine、storage、scheduler）
├── flow/                    # 多節點編排（← agent-flow）
├── pipeline/                # 通用 staged job（← pipelines）；legacy，長期併入 flow
│   └── modules/
├── tool-registry/           # 工具定義 + dispatch（← tools）
├── providers/               # 模型 registry、credential、routing（← agent-providers）
├── extensions/              # Skills / MCP / Plugins（← agent-skills）
├── policy/                  # 權限、approval gates（← agent-policy）
├── conversation/            # 公開對話 pipeline（← chat）
├── retrieval/               # 搜尋、ranking（← rag）
├── indexing/                # chunking、embedding pipeline（← embed）
├── crawl/                   # 網頁爬取（← crawl，獨立能力）
├── research/                # 深度研究 orchestrator（← research）
├── artifact/                # ← agent-artifact
├── evidence/                # ← agent-evidence
├── console/                 # BFF 膠水（← agent-console + admin-console 合併）
└── infra/                   # 基礎設施
    ├── auth/                #   ← auth
    ├── config/              #   ← config
    ├── db/                  #   ← db
    ├── glossary/            #   ← glossary
    └── translations/        #   ← translations
```

### agent-os 拆分

| 現有檔案 | 去向 | 理由 |
|---|---|---|
| kernel.ts, context.ts, context-pruner.ts, memory.ts, memory-fusion.ts, memory.test.ts, langgraph-adapter.ts | `agent/` | LLM 推理迴圈 |
| state-machine.ts, storage.ts, durable-agent.ts, errors.ts, access.ts | `session/` | 生命週期容器 |
| scheduler.ts, scheduler/ | `session/` | Session 排程（Routine trigger） |
| approval-queue.ts | `session/` | 屬於 session lifecycle（暫停等核准） |
| registry.ts | `session/` | agent 定義 registry |
| tools/ | `agent/tools/` | 沙箱內建工具，agent 迴圈直接呼叫 |
| observability/ | `session/observability/` | trace 掛在 session 上 |
| storage/ | `session/storage/` | D1 持久化 |

---

## 5. 三層對照總表

| 領域 | Page | API | Lib |
|---|---|---|---|
| Home | `/admin` | — | — |
| Sessions | `/admin/sessions/*` | `/api/admin/sessions/*` | `agent/` + `session/` |
| Routines | `/admin/routines/*` | `/api/admin/routines/*` | `session/` |
| Flows | `/admin/flows/*` | `/api/admin/flows/*` | `flow/` |
| Evidence | sessions 子頁 + 獨立列表 | `/api/admin/evidence/*` | `evidence/` |
| Artifacts | sessions 子頁 + 獨立列表 | `/api/admin/artifacts/*` | `artifact/` |
| Settings › Environments | `/admin/settings/environments` | — (Phase 5) | — |
| Settings › Site | `/admin/settings/site/*` | `/api/admin/site/*` | `pipeline/`, `retrieval/`, `indexing/`, `crawl/`, `research/` |
| Settings › Models + Cost | `/admin/settings/models/*` | `/api/admin/settings/models/*`, `settings/cost/*` | `providers/`, `console/` (cost) |
| Settings › Extensions | `/admin/settings/extensions/*` | `/api/admin/settings/extensions/*` | `extensions/` |
| Settings › Permissions | `/admin/settings/permissions/*` | `/api/admin/settings/permissions/*` | `policy/` |
| Settings › Access | `/admin/settings/access/*` | `/api/admin/settings/access/*` | `console/` (rbac) |

---

## 6. Components

不搬目錄。搬完 pages 後更新 import 路徑即可。

```
保留不動：
  src/components/admin/Admin*.astro          # 共用元件
  src/components/admin/console/              # React islands
  src/components/admin/ConsoleFlowCard.astro
  src/components/admin/ProviderManagement.astro
```

---

## 7. 實作順序

1. **cleanup #1–#5**：路由清理（先減少搬運量）
2. **lib 重組**：建新目錄、搬檔案、更新 import（全站 grep + sed）
3. **AdminV2Layout.astro**：建新 layout
4. **Pages 搬遷**：所有頁面切到新路徑 + 新 layout + breadcrumb
5. **API 搬遷**：搬 route 檔 + 更新頁面 fetch URL
6. **骨架頁**：Settings hub、Site landing、notifications、behavior
7. **退役**：刪舊 layout、刪舊路由目錄、刪殘留 redirect
8. **文件**：更新 admin-route-map.md
9. **驗證**：`pnpm build` + `pnpm verify` + 手動巡覽全部頁面

---

## 8. 風險評估

| 風險 | 嚴重度 | 緩解 |
|---|---|---|
| lib import 全站改（~300 處） | 中 | grep + sed 批次，build 驗證 |
| agent-os 拆分切錯邊界 | 中 | 先列出每個檔案的 import/export，畫依賴圖再切 |
| API 搬遷後 fetch URL 漏改 | 中 | grep 所有 fetch/axios 呼叫，逐一比對 |
| 全域 CSS 依賴舊 layout | 低 | 新 layout 攜帶所有 :global() 規則 |
| cron endpoint 路徑改了 | 高 | scheduled.ts 搬到 sessions/scheduled.ts 後要同步改 wrangler.toml 的 cron route |

---

## 9. Tier 2 確認清單

以下事項需要使用者逐項確認：

- [ ] agent-skills settings-store → D1 遷移腳本（cleanup #3）
- [ ] agent-os 拆分邊界（§4）
- [ ] cron route 路徑變更（wrangler.toml）
- [ ] 舊 layout 直接刪除（不保留 fallback）

---

## 10. 不在 Phase 1 範圍

- Session 事件流 + SSE（Phase 2）
- Routine trigger（Phase 3）
- Mode 三檔 + 權限協定（Phase 4）
- Cloudflare Sandbox（Phase 5）
- MCP 代理 + Marketplace（Phase 6）
- Flow 細部規劃（另案）
