---
title: "Agent Platform 深度解析（八）— Context/Memory 與 Cloudflare 部署：本機開發到生產環境的零縫隙遷移"
date: 2026-08-23
category: tech
type: deep-dive
tags: ["ai-agent", "cloudflare", "workers", "durable-objects", "workflows", "d1", "kv", "r2", "vectorize", "queues", "deployment", "agent-platform"]
lang: zh-TW
description: "Agent Platform Cloudflare 部署深度解析：Cloudflare-first 架構映射、Durable Objects 做 Run Coordinator、Workflows 做 Step 執行、D1/KV/R2/Vectorize/Queues 服務邊界、本機 Node 模擬同介面零感知遷移、wrangler 部署流程、CI/CD 自動化、資源佈建腳本。"
tldr: "Agent Platform 採 Cloudflare-first 架構：本機 `npm run dev` 跑 Node 模擬，生產映射到 Workers + Workers Assets + D1 + KV + R2 + Vectorize + Queues + Workflows + Durable Objects + Workers AI。Runtime 介面相同（InMemory → Cloudflare 實作），上層零感知遷移。部署只需 `wrangler login` → 建資源 → 填 ID → `wrangler secret put` → `wrangler deploy`。CI/CD 監聽 main 分支，跑 typecheck + build + dry-run + migration + deploy。"
---

> 🌏 [English version](/posts/tech/2026-08-23-agent-platform-cloudflare-deployment-en)

## TL;DR

Agent Platform **本機開發與生產部署同一套代碼、同一套介面**：

- **本機**：`npm run dev` → Node 進程，InMemory Maps 模擬 D1/KV/DO/Workflows/Queues
- **生產**：Cloudflare Workers + 完整服務套件，**Runtime 介面不變**，上層 Flow/Skill/Policy/Provider 代碼零修改
- **服務映射表**：

| 平台能力 | 本機模擬 | Cloudflare 生產服務 |
|---------|---------|-------------------|
| Web Console | Vite dev server | Workers Assets (靜態資源) |
| API Gateway | Hono on Node | Workers (Hono router) |
| Run State | InMemory Map | **Durable Object** (RunCoordinator) |
| Flow Execution | InMemory Runtime | **Workflows** (step execution, pause/resume/retry) |
| Background Jobs | setTimeout/Queue | **Queues** (eval, export, health check) |
| Relational Data | SQLite / Map | **D1** (SQLite-compatible) |
| Large Outputs | File system | **R2** (artifacts, evidence bundles) |
| Fast Cache/State | InMemory Map | **KV** (session, idempotency, health) |
| Vector Search | Local array | **Vectorize** (knowledge/RAG) |
| Native LLM | N/A | **Workers AI** (provider 選項之一) |

- **部署 5 步驟**：`wrangler login` → 建資源 → 寫入 wrangler.toml IDs → `wrangler secret put` → `wrangler deploy`
- **CI/CD**：Push main → typecheck → build → deploy-readiness → D1 migration → deploy

---

## 為什麼 Cloudflare-first？

| 需求 | 傳統方案 (K8s/VM/Serverless) | Cloudflare Workers 方案 |
|------|----------------------------|----------------------|
| **Durable Execution** | 自建 Temporal/Hatchet/Restate、需維護集群 | **Workflows + Durable Objects** 內建、零運維 |
| **Stateful Coordination** | Redis + 分布式鎖、或外部服務 | **Durable Objects** 單執行緒、強一致性、自動分片 |
| **Global Low Latency** | 多區部署、負載均衡、CDN 另配 | **Edge 網路** 300+ 節點、自動就近路由 |
| **Cost at Scale** | 按 CPU/記憶體/時間計費、冷啟動貴 | **按請求/CPU 時間** 計費、無冷啟動、免費額度大 |
| **Integrated Services** | 獨立購買/託管 D1/KV/R2/Vectorize/Queues | **原生整合**、Bindings 直接用、跨服務延遲極低 |
| **Developer Experience** | Docker/幫手腳本/本機模擬雲端 | `wrangler dev` 本機完整模擬、`wrangler deploy` 一鍵上線 |

**關鍵決策**：不自己建 orchestration 層，**直接用 Cloudflare 原生 Workflows + Durable Objects**，省去數萬行基礎設施代碼。

---

## 架構映射：本機 → 雲端

### 程式碼結構

```
packages/
  runtime/src/           # 核心 Runtime 介面 (InMemory 實作)
    flow-runtime.ts
    skill-packages.ts
    provider-catalog.ts
    policy-runtime-controls.ts
    observability-evidence-artifacts.ts
    context-memory.ts
  cloudflare/src/        # Cloudflare 具體實作
    d1-repository.ts     # D1 存取層
    api-gateway-store.ts # API Client/Audit/Usage (D1 + KV)
    service-map.ts       # 服務綁定映射
apps/
  worker/src/index.ts    # Worker 入口 (Hono router)
  web/                   # React + Vite 前端
```

### 介面隔離：上層不依賴實作

```typescript
// 伪代碼：上層只依賴介面
interface FlowRuntime {
  createRun({ flow, presetId, inputs });
  completeStep({ flow, stepRunId, output });
  failStep(stepRunId, error);
  retryStep(stepRunId);
  resumeLatestCheckpoint(runId);
  saveCheckpoint(runId);
}

// 本機
class InMemoryFlowRuntime implements FlowRuntime { ... }

// 生產
class DurableFlowRuntime implements FlowRuntime { 
  // 內部用 DO + Workflows + D1
}
```

**遷移零成本**：環境變數或配置決定用哪個實作，業務邏輯完全不變。

---

## Cloudflare 服務詳細映射

### 1. Durable Objects：Run Coordinator

**職責**：每個 Run 一個 Coordinator 實例，維持**單一寫入者**、即時狀態、WebSocket 推送。

```toml
# wrangler.toml
[[durable_objects.bindings]]
name = "RUN_COORDINATOR"
class_name = "RunCoordinator"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["RunCoordinator"]
```

**RunCoordinator 負責**：
- 持有 Run 完整狀態（status、currentStepIds、completedStepIds、outputs、cost、tokens...）
- 處理 `createRun`、`completeStep`、`failStep`、`retryStep`、`cancelRun`、`resume` 等命令
- 定期 flush checkpoint 到 D1
- 推送實時事件到前端（WebSocket 或 SSE）

**為什麼用 DO？**
- 單執行緒模型：無競態、無需分布式鎖
- 自動分片：Run ID 分配到不同 DO 實例，水平擴展無感知
- 強一致性：同一 Run 的所有操作串行化
- 內建 SQLite：可在 DO 內直接存儲步驟輸出、checkpoint

### 2. Workflows：Flow Step Execution

**職責**：每個 Flow Step 作為一個 Workflow Step 執行，內建 **pause/resume/retry/timeout/step status**。

```toml
# wrangler.toml
[[workflows]]
name = "agent-platform-deep-research"
binding = "DEEP_RESEARCH_WORKFLOW"
class_name = "DeepResearchWorkflow"
```

**Workflow 步驟對應**：
```
DeepResearchWorkflow
  ├── step: clarify (agent + research-planner skill)
  ├── step: build_brief (transform)
  ├── step: plan (agent + research-planner skill)
  ├── step: search (tool_group + search provider)
  ├── step: rank_sources (agent + source-ranker skill)
  ├── step: read_sources (tool_group + reader provider)
  ├── step: extract_evidence (agent + citation-extractor skill)
  ├── step: synthesize (agent + report-synthesizer skill)
  ├── step: verify (verifier)
  └── step: export (artifact)
```

**Workflow 內建能力**：
- `ctx.sleep()` / `ctx.waitForEvent()`：等待外部觸發（approval、人工審核）
- `ctx.retry()`：自動重試、指數退避
- `ctx.run()`：執行子任務、隔離失敗
- 持久化狀態：Worker 重啟、部署、擴容不丟失進度
- 可見性：Dashboard 直接看 workflow 實例狀態、步驟耗時、重試次數

### 3. D1：關係型資料存儲

**Schema 遷移檔**：`packages/db/migrations/0001_flow_runtime.sql` 到 `0010_api_gateway.sql`

**核心表**：
| 表 | 用途 | 關鍵欄位 |
|----|------|---------|
| `flows` | Flow 定義 | id, name, description, status (draft/published/archived) |
| `flow_versions` | 不可變 Flow 版本 | id, flow_id, version, input_schema_json, step_graph_json, artifact_schema_json |
| `flow_presets` | Preset 配置 | id, flow_version_id, name, policy_ref, config_json |
| `flow_steps` | 步驟定義 | flow_version_id, step_key, type, skill_binding_ref, provider_role |
| `flow_edges` | DAG 邊緣 | flow_version_id, from_step_key, to_step_key, condition_expr |
| `flow_runs` | Run 實例 | id, flow_id, flow_version_id, preset_id, status, input_json, current_step_key |
| `step_runs` | 步驟執行記錄 | id, run_id, step_key, status, attempt, input_ref, output_ref |
| `checkpoints` | 恢復快照 | run_id, completed_steps_json, current_step_key, key_outputs_json, cost_usd... |
| `run_events` | 審計事件 | run_id, step_run_id, type, payload_json |

**D1Repository 負責**：
- `seedBuiltInFlows()`：啟動時植入 Deep Research 內建 flow
- `getRunnableFlow(id, version)`：取得可執行的 FlowDefinition（含 presets）
- `createRun/createStepRun`：寫入 run/step 記錄
- `updateRunStatus`：狀態轉換
- `publishFlowDraft`：驗證 → 寫入 flow_versions → 刪除 draft → 更新 presets

### 4. KV：快速狀態/快取

```toml
[[kv_namespaces]]
binding = "CACHE"
id = "608d1fb3c4424146abe50ab56e246aca"
```

**用途**：
| Key Pattern | TTL | 內容 |
|-------------|-----|------|
| `rate_limit:{client_id}:{window}` | 60s+ | API Client 速率計數器 |
| `provider_health:{provider_id}` | 5m | Provider 延遲、成功率、錯誤計數 |
| `run_snapshot:{run_id}` | 10m | UI 用的 run 快照（避免查 D1） |
| `session:{session_id}` | 24h | Web UI session 狀態 |
| `idempotency:{key}` | 1h | 冪等性 key（防重複提交） |

**ApiGatewayStore 使用 KV 做 rate limiting**：
```typescript
async incrRateWindow(windowKey, ttlSeconds) {
  const current = Number(await this.cache.get(windowKey)) || 0;
  const next = current + 1;
  await this.cache.put(windowKey, String(next), { expirationTtl: Math.max(60, Math.ceil(ttlSeconds)) });
  return next;
}
```

### 5. R2：大型產出物存儲

```toml
[[r2_buckets]]
binding = "ARTIFACTS"
bucket_name = "agent-platform-artifacts"
```

**存儲內容**：
| 物件 Key | 內容 |
|----------|------|
| `artifacts/{runId}/{artifactId}/v{version}.md` | Markdown Report |
| `artifacts/{runId}/{artifactId}/v{version}.json` | JSON Evidence Bundle |
| `evidence/{runId}/{evidenceId}.json` | Evidence Item 完整內容 |
| `step_outputs/{runId}/{stepRunId}.json` | 步驟大輸出（超過 D1 行大小限制） |
| `proposals/{proposalId}.json` | Learning Proposal diff |

**特性**：
- 無大小限制（單物件 5GB）
- 成本極低（存儲 $0.015/GB/月，Class A 操作 $4.50/百萬）
- 可直接簽署 URL 給前端下載、或 Worker 串流回傳

### 6. Vectorize：知識庫/RAG

```toml
[[vectorize]]
binding = "VECTORIZE"
index_name = "agent-platform-knowledge"
```

**用途**：
- 存儲文檔 embedding（研究報告、技術文檔、代碼庫）
- Skill 執行時檢索相關知識（`retrieval_evidence` context block）
- 支援 `cosine` 相似度、1536 維度（OpenAI embedding 相容）

**建立指令**：
```bash
wrangler vectorize create agent-platform-knowledge --dimensions=1536 --metric=cosine
```

### 7. Queues：背景任務

```toml
[[queues.producers]]
binding = "RUN_QUEUE"
queue = "agent-platform-runs"

[[queues.consumers]]
queue = "agent-platform-runs"
max_batch_size = 5
max_batch_timeout = 10
```

**消費者處理**：
| Job Type | 處理邏輯 |
|----------|---------|
| `eval.run` | 執行 Eval Suite、記錄結果、觸發 Quality Gate |
| `artifact.export` | 生成 PDF/PPT/Notion/Slack/GitHub export |
| `provider.health` | 定期探測所有 provider readiness、更新 KV |
| `skill.optimize` | 離線優化（GEPA/DSPy）生成候選 SkillVersion |
| `cleanup.expired` | 清理過期 checkpoints、舊 run events |

**優勢**：
- 非阻塞：API 回應不等背景任務
- 重試：失敗自動重試（指數退避、max retries）
- 可見性：Dashboard 看 queue depth、processing rate、dead letter

### 8. Workers AI：原生模型選項

```toml
[ai]
binding = "AI"
```

**Provider Catalog 整合**：
```typescript
// provider-catalog.ts
if (provider === "workers_ai" || provider === "cloudflare") {
  return fetchCloudflareModels(accountId, apiToken);
}
```

**可用模型**：`@cf/meta/llama-3.1-8b-instruct`、`@cf/meta/llama-3.3-70b-instruct-fp8-fast` 等

**優勢**：無外部 API key、極低延遲（同區域）、成本可預測、自動擴縮容

---

## 本機開發環境：`npm run dev`

```bash
git clone https://github.com/agent-platform/agent-platform.git
cd agent-platform
pnpm install
cp .dev.vars.example .dev.vars   # 選填：API keys
npm run dev
# → http://127.0.0.1:8787
```

**啟動流程**：
1. `wrangler dev` 啟動 Worker（模擬 D1/KV/R2/Queues/DO/Workflows）
2. Vite dev server 服務 React 前端（HMR、proxy 到 Worker）
3. 無 API keys 時：**離線模式**讀 `fixtures/local-research-sources.json`，跑完整 Deep Research

**本地模擬對照表**：
| 生產服務 | 本機模擬 |
|---------|---------|
| D1 | `@cloudflare/workers-types` 的 D1 mock / 記憶體 SQLite |
| KV | `Map<string, string>` + TTL 清理 |
| R2 | 本機檔案系統 `./.wrangler/state/r2/` |
| Vectorize | 記憶體向量索引（或跳過） |
| Queues | 同步執行 / 記憶體佇列 |
| Durable Objects | 單進程 DO 實例（`wrangler dev` 內建） |
| Workflows | 同步步驟執行器（模擬 pause/resume/retry） |

---

## 部署實戰：從零到生產

### 前置需求

- Cloudflare 帳號
- `wrangler` CLI（`pnpm exec wrangler` 或全域安裝）
- Node.js 22+、pnpm 10

### 步驟 1：認證

```bash
wrangler login
wrangler whoami
```

### 步驟 2：建立資源（僅首次）

```bash
# D1 Database
wrangler d1 create agent-platform
# 輸出: database_id = "f6d45425-7dd7-4625-8991-7142cb949712"

# KV Namespace
wrangler kv namespace create CACHE
# 輸出: id = "608d1fb3c4424146abe50ab56e246aca"

# R2 Bucket
wrangler r2 bucket create agent-platform-artifacts

# Vectorize Index
wrangler vectorize create agent-platform-knowledge --dimensions=1536 --metric=cosine

# Queue
wrangler queues create agent-platform-runs
# 注意：Workflows & Durable Objects 會在首次 deploy 時自動建立
```

### 步驟 3：更新 wrangler.toml

將上述輸出的 IDs 填入：

```toml
[[d1_databases]]
binding = "DB"
database_name = "agent-platform"
database_id = "f6d45425-7dd7-4625-8991-7142cb949712"  # ← 填這裡
migrations_dir = "packages/db/migrations"

[[kv_namespaces]]
binding = "CACHE"
id = "608d1fb3c4424146abe50ab56e246aca"  # ← 填這裡

[[r2_buckets]]
binding = "ARTIFACTS"
bucket_name = "agent-platform-artifacts"

[[vectorize]]
binding = "VECTORIZE"
index_name = "agent-platform-knowledge"

[[queues.producers]]
binding = "RUN_QUEUE"
queue = "agent-platform-runs"

[[queues.consumers]]
queue = "agent-platform-runs"
max_batch_size = 5
max_batch_timeout = 10
```

### 步驟 4：設定 Secrets（Provider Keys + Auth）

```bash
# LLM Providers
wrangler secret put OPENAI_API_KEY
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put GEMINI_API_KEY
wrangler secret put OPENROUTER_API_KEY
wrangler secret put GROQ_API_KEY
wrangler secret put CEREBRAS_API_KEY
wrangler secret put NVIDIA_API_KEY

# Search Providers
wrangler secret put TAVILY_API_KEY
wrangler secret put EXA_API_KEY
wrangler secret put BRAVE_SEARCH_API_KEY
# ... 其他 search keys

# Auth
wrangler secret put AUTH_SECRET   # API key 簽章用（至少 32 字元隨機字串）
```

### 步驟 5：部署

```bash
# 1. 建置前端
npm run build:web

# 2. 應用 D1 Migration（遠端）
wrangler d1 migrations apply agent-platform --remote

# 3. 部署 Worker
wrangler deploy
```

### 驗證部署

```bash
curl https://<your-worker>.workers.dev/api/health
curl https://<your-worker>.workers.dev/api/readiness
```

預期回應：
```json
// /api/health
{"status":"ok","timestamp":"2026-08-23T..."}

// /api/readiness
{"ready":true,"checks":{"db":true,"kv":true,"r2":true,"vectorize":true,"queues":true,"workflows":true,"durable_objects":true}}
```

---

## CI/CD：GitHub Actions 自動部署

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: deploy-cloudflare
  cancel-in-progress: true

env:
  CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
  CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Typecheck
        run: pnpm run check:types

      - name: Build web + ts
        run: pnpm run build:web && pnpm run build:ts

      - name: Deploy readiness (incl. wrangler deploy --dry-run)
        run: pnpm run check:deploy-readiness

      - name: Apply D1 migrations
        run: pnpm exec wrangler d1 migrations apply agent-platform --remote

      - name: Deploy
        run: pnpm exec wrangler deploy
```

**關鍵點**：
- `check:types`：TypeScript 型別檢查
- `build:web` → `apps/web/dist`（Workers Assets 服務）
- `build:ts` → 編譯 Worker 代碼
- `check:deploy-readiness`：包含 `wrangler deploy --dry-run` 驗證配置
- **D1 Migration 先於 Deploy**：確保 schema 同步
- **Secrets 在 GitHub Settings 設定**：`CLOUDFLARE_ACCOUNT_ID`、`CLOUDFLARE_API_TOKEN`、所有 provider keys

---

## 環境變數與配置管理

### .dev.vars（本機）

```bash
# .dev.vars
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
TAVILY_API_KEY=tvly-...
AUTH_SECRET=local-dev-secret-32chars-minimum
```

### wrangler.toml `[vars]`（生產非敏感配置）

```toml
[vars]
ENVIRONMENT = "production"
LOG_LEVEL = "info"
DEFAULT_PRESET = "standard"
```

### Secrets（敏感值）

```bash
wrangler secret put OPENAI_API_KEY
# 輸入值，不會顯示在日誌、代碼、wrangler.toml
```

**存取方式**：
```typescript
// Worker 代碼
const apiKey = env.OPENAI_API_KEY;  // Secret
const envName = env.ENVIRONMENT;    // Vars
```

---

## 常見部署問題與解決

| 問題 | 原因 | 解決 |
|------|------|------|
| `wrangler deploy` 失敗：D1 binding not found | `wrangler.toml` database_id 錯誤或未建立 | 確認 `wrangler d1 create` 輸出的 ID、已填入 toml |
| `wrangler d1 migrations apply` 卡住 | 遠端 D1 鎖、或 migration 檔案語法錯 | 先 `wrangler d1 migrations list` 確認狀態、檢查 SQL 語法 |
| Worker 啟動報錯：`AI binding not found` | `[ai] binding = "AI"` 缺少或未啟用 Workers AI | 確認 wrangler.toml 有 `[ai]` 區塊、帳號有 Workers AI 權限 |
| Queue consumer 不處理訊息 | `[[queues.consumers]]` 未正確綁定、或 handler 未 export | 檢查 `class_name` 對應 Worker 內的 Queue Consumer class |
| Durable Object 無法儲存狀態 | `[[migrations]]` 缺少 `new_sqlite_classes` | 加入 `new_sqlite_classes = ["RunCoordinator"]` 並重新 deploy |
| 前端靜態資源 404 | `assets.directory` 路徑錯誤、或 `build:web` 未跑 | 確認 `apps/web/dist` 存在、`assets = { directory = "apps/web/dist" }` |
| 本機 `npm run dev` 無法連接 D1 | `.dev.vars` 缺少、或 `wrangler dev` 未正確掛載 | 確認 `.dev.vars` 有 `DATABASE_URL` 或使用本機 SQLite |

---

## 成本估算（粗略）

| 服務 | 免費額度 | 付費估算（月） |
|------|---------|--------------|
| Workers | 100,000 requests/day | $5/百萬 requests + $0.50/百萬 CPU ms |
| Workers Assets | 無限靜態資源 | 免費 |
| D1 | 5 GB storage, 5M row reads, 100k row writes | $0.75/GB storage, $0.001/M reads, $1.00/M writes |
| KV | 1 GB storage, 100k reads/day, 1k writes/day | $0.50/GB storage, $0.50/M reads, $5.00/M writes |
| R2 | 10 GB storage, 無限 Class B 操作 | $0.015/GB storage, $4.50/M Class A |
| Vectorize | 30M vectors, 100k queries/month | $0.05/M vectors, $0.50/M queries |
| Queues | 1M messages/month | $0.40/M messages |
| Workflows | 100k steps/month | $0.50/M steps |
| Durable Objects | 1M requests/month | 含在 Workers requests |
| Workers AI | 10M neurons/day | $0.011/M neurons (Llama-3.1-8B) |

**典型 Deep Research 跑一次**：
- 10 steps、~50 tool calls、~500k tokens、~30 秒
- 成本：~$0.10-0.50（視模型選擇）
- 免費模型（Nemotron-3-Ultra、GPT-OSS、GLM-5.2 等）可降至 ~$0

---

## 總結：Cloudflare 部署核心契約

```
Local Dev (npm run dev)
    → wrangler dev 模擬完整 Cloudflare 服務套件
    → InMemory Runtime 實作所有介面
    → 離線模式無需任何 API Key
    
Production Deploy
    → wrangler.toml 定義所有 Bindings (DB, CACHE, ARTIFACTS, VECTORIZE, RUN_QUEUE, AI, RUN_COORDINATOR, DEEP_RESEARCH_WORKFLOW)
    → wrangler secret put 設定所有敏感值
    → wrangler d1 migrations apply --remote 同步 Schema
    → wrangler deploy 發布到全球 Edge
    
Runtime Mapping (Interface → Implementation)
    FlowRuntime          → DurableFlowRuntime (DO + Workflows + D1)
    SkillRegistry        → D1SkillRepository (D1)
    ProviderCatalog      → CloudflareProviderCatalog (KV cache + Provider Config)
    PolicyRuntimeControls→ PolicyRuntimeControls (純邏輯，無狀態)
    Observability        → D1 + KV + R2 (trace/events/metrics/evidence/artifacts)
    ContextMemory        → D1 + KV (snapshots + memory items)
    ApiGateway           → WorkerApiGatewayStore (D1 + KV)
    
CI/CD Pipeline
    Push main → Typecheck → Build → Deploy Readiness → D1 Migration → Deploy
    → 失敗即阻擋，成功即上線
```

**三大不變量**：
1. **介面不變，實作可換** —— 本機/生產同一套 Runtime 介面，上層零感知
2. **Cloudflare 原生服務優先** —— 不自建 orchestration、queue、vector DB，直接用 Workers 生態
3. **配置驅動部署** —— `wrangler.toml` + Secrets 定義一切，無手動點擊儀表板

---

## 參考資料

- [Agent Platform GitHub - Cloudflare Package](https://github.com/vincentxuu/agent-platform/tree/main/packages/cloudflare)
- [Agent Platform - wrangler.toml](https://github.com/vincentxuu/agent-platform/blob/main/wrangler.toml)
- [Agent Platform - DB Migrations](https://github.com/vincentxuu/agent-platform/tree/main/packages/db/migrations)
- [Agent Platform - Deploy Workflow](https://github.com/vincentxuu/agent-platform/blob/main/.github/workflows/deploy.yml)
- [Agent Gateway Plan - Cloudflare-first Deployment](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#40-cloudflare-first-deployment-mapping)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Workflows Documentation](https://developers.cloudflare.com/workflows/)
- [Cloudflare Durable Objects Documentation](https://developers.cloudflare.com/durable-objects/)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Cloudflare Vectorize Documentation](https://developers.cloudflare.com/vectorize/)
- [Cloudflare Queues Documentation](https://developers.cloudflare.com/queues/)
