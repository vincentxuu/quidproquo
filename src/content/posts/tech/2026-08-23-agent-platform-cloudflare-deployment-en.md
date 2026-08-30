---
title: "Agent Platform Deep Dive (8) — Context/Memory and Cloudflare Deployment: Seamless Migration from Local Development to Production"
date: 2026-08-23
category: tech
tags: ["ai-agent", "cloudflare", "workers", "durable-objects", "workflows", "d1", "kv", "r2", "vectorize", "queues", "deployment", "agent-platform"]
lang: en
description: "A deep dive into deploying Agent Platform on Cloudflare: Cloudflare-first architecture mapping, Durable Objects as Run Coordinators, Workflows for step execution, service boundaries across D1/KV/R2/Vectorize/Queues, seamless migration through matching local Node interfaces, the Wrangler deployment flow, CI/CD automation, and resource-provisioning scripts."
tldr: "Agent Platform uses a Cloudflare-first architecture: local `npm run dev` runs Node-based simulations, while production maps to Workers + Workers Assets + D1 + KV + R2 + Vectorize + Queues + Workflows + Durable Objects + Workers AI. The Runtime interfaces stay the same (InMemory → Cloudflare implementations), so upper layers migrate without noticing. Deployment requires only `wrangler login` → create resources → fill in IDs → `wrangler secret put` → `wrangler deploy`. CI/CD watches the main branch and runs typecheck + build + dry-run + migration + deploy."
---

> 🌏 [中文版](/posts/tech/2026-08-23-agent-platform-cloudflare-deployment)

## TL;DR

Agent Platform uses **the same codebase and interfaces for local development and production deployment**:

- **Local**: `npm run dev` → a Node process, with InMemory Maps simulating D1/KV/DO/Workflows/Queues
- **Production**: Cloudflare Workers plus the full service suite; the **Runtime interfaces do not change**, so the upper-layer Flow/Skill/Policy/Provider code requires no modifications
- **Service mapping**:

| Platform capability | Local simulation | Cloudflare production service |
|---------|---------|-------------------|
| Web Console | Vite dev server | Workers Assets (static assets) |
| API Gateway | Hono on Node | Workers (Hono router) |
| Run State | InMemory Map | **Durable Object** (RunCoordinator) |
| Flow Execution | InMemory Runtime | **Workflows** (step execution, pause/resume/retry) |
| Background Jobs | setTimeout/Queue | **Queues** (eval, export, health check) |
| Relational Data | SQLite / Map | **D1** (SQLite-compatible) |
| Large Outputs | File system | **R2** (artifacts, evidence bundles) |
| Fast Cache/State | InMemory Map | **KV** (session, idempotency, health) |
| Vector Search | Local array | **Vectorize** (knowledge/RAG) |
| Native LLM | N/A | **Workers AI** (one provider option) |

- **Five deployment steps**: `wrangler login` → create resources → write IDs to wrangler.toml → `wrangler secret put` → `wrangler deploy`
- **CI/CD**: Push main → typecheck → build → deploy-readiness → D1 migration → deploy

---

## Why Cloudflare-first?

| Requirement | Traditional approach (K8s/VM/Serverless) | Cloudflare Workers approach |
|------|----------------------------|----------------------|
| **Durable Execution** | Self-host Temporal/Hatchet/Restate and maintain the cluster | **Workflows + Durable Objects** are built in, with no operations burden |
| **Stateful Coordination** | Redis plus distributed locks, or an external service | **Durable Objects** provide single-threaded execution, strong consistency, and automatic sharding |
| **Global Low Latency** | Multi-region deployment, load balancing, and a separately configured CDN | An **edge network** with 300+ locations and automatic routing to the nearest location |
| **Cost at Scale** | Pay for CPU/memory/time; cold starts are expensive | Pay **per request and CPU time**, with no cold starts and a large free tier |
| **Integrated Services** | Buy or host D1/KV/R2/Vectorize/Queues separately | **Native integration**, direct access through Bindings, and extremely low cross-service latency |
| **Developer Experience** | Docker/helper scripts/local cloud simulation | `wrangler dev` fully simulates the environment locally; `wrangler deploy` ships it in one command |

**Key decision**: do not build a custom orchestration layer. **Use Cloudflare-native Workflows + Durable Objects directly**, avoiding tens of thousands of lines of infrastructure code.

---

## Architecture Mapping: Local → Cloud

### Code Structure

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

### Interface Isolation: Upper Layers Do Not Depend on Implementations

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

**Zero-cost migration**: an environment variable or configuration selects the implementation; the business logic remains entirely unchanged.

---

## Detailed Cloudflare Service Mapping

### 1. Durable Objects: Run Coordinator

**Responsibility**: one Coordinator instance per Run, maintaining a **single writer**, real-time state, and WebSocket updates.

```toml
# wrangler.toml
[[durable_objects.bindings]]
name = "RUN_COORDINATOR"
class_name = "RunCoordinator"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["RunCoordinator"]
```

**RunCoordinator responsibilities**:
- Hold the complete Run state (`status`, `currentStepIds`, `completedStepIds`, `outputs`, `cost`, `tokens`, and more)
- Handle commands such as `createRun`, `completeStep`, `failStep`, `retryStep`, `cancelRun`, and `resume`
- Periodically flush checkpoints to D1
- Push real-time events to the frontend through WebSocket or SSE

**Why use DO?**
- Single-threaded model: no races and no need for distributed locks
- Automatic sharding: Run IDs are assigned to different DO instances, enabling transparent horizontal scaling
- Strong consistency: all operations for the same Run are serialized
- Built-in SQLite: step outputs and checkpoints can be stored directly inside the DO

### 2. Workflows: Flow Step Execution

**Responsibility**: execute every Flow Step as a Workflow Step, with built-in **pause/resume/retry/timeout/step status**.

```toml
# wrangler.toml
[[workflows]]
name = "agent-platform-deep-research"
binding = "DEEP_RESEARCH_WORKFLOW"
class_name = "DeepResearchWorkflow"
```

**Workflow step mapping**:
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

**Built-in Workflow capabilities**:
- `ctx.sleep()` / `ctx.waitForEvent()`: wait for an external trigger such as approval or human review
- `ctx.retry()`: automatic retries with exponential backoff
- `ctx.run()`: run subtasks and isolate failures
- Durable state: Worker restarts, deployments, and scaling do not lose progress
- Visibility: inspect workflow instance status, step duration, and retry counts directly in the Dashboard

### 3. D1: Relational Data Storage

**Schema migration files**: `packages/db/migrations/0001_flow_runtime.sql` through `0010_api_gateway.sql`

**Core tables**:
| Table | Purpose | Key fields |
|----|------|---------|
| `flows` | Flow definitions | id, name, description, status (draft/published/archived) |
| `flow_versions` | Immutable Flow versions | id, flow_id, version, input_schema_json, step_graph_json, artifact_schema_json |
| `flow_presets` | Preset configuration | id, flow_version_id, name, policy_ref, config_json |
| `flow_steps` | Step definitions | flow_version_id, step_key, type, skill_binding_ref, provider_role |
| `flow_edges` | DAG edges | flow_version_id, from_step_key, to_step_key, condition_expr |
| `flow_runs` | Run instances | id, flow_id, flow_version_id, preset_id, status, input_json, current_step_key |
| `step_runs` | Step execution records | id, run_id, step_key, status, attempt, input_ref, output_ref |
| `checkpoints` | Recovery snapshots | run_id, completed_steps_json, current_step_key, key_outputs_json, cost_usd... |
| `run_events` | Audit events | run_id, step_run_id, type, payload_json |

**D1Repository responsibilities**:
- `seedBuiltInFlows()`: seed the built-in Deep Research flow at startup
- `getRunnableFlow(id, version)`: retrieve an executable FlowDefinition, including presets
- `createRun/createStepRun`: write run and step records
- `updateRunStatus`: manage state transitions
- `publishFlowDraft`: validate → write to `flow_versions` → delete the draft → update presets

### 4. KV: Fast State/Cache

```toml
[[kv_namespaces]]
binding = "CACHE"
id = "608d1fb3c4424146abe50ab56e246aca"
```

**Uses**:
| Key Pattern | TTL | Content |
|-------------|-----|------|
| `rate_limit:{client_id}:{window}` | 60s+ | API Client rate counter |
| `provider_health:{provider_id}` | 5m | Provider latency, success rate, and error count |
| `run_snapshot:{run_id}` | 10m | Run snapshot for the UI, avoiding a D1 query |
| `session:{session_id}` | 24h | Web UI session state |
| `idempotency:{key}` | 1h | Idempotency key, preventing duplicate submissions |

**ApiGatewayStore uses KV for rate limiting**:
```typescript
async incrRateWindow(windowKey, ttlSeconds) {
  const current = Number(await this.cache.get(windowKey)) || 0;
  const next = current + 1;
  await this.cache.put(windowKey, String(next), { expirationTtl: Math.max(60, Math.ceil(ttlSeconds)) });
  return next;
}
```

### 5. R2: Large Output Storage

```toml
[[r2_buckets]]
binding = "ARTIFACTS"
bucket_name = "agent-platform-artifacts"
```

**Stored content**:
| Object Key | Content |
|----------|------|
| `artifacts/{runId}/{artifactId}/v{version}.md` | Markdown Report |
| `artifacts/{runId}/{artifactId}/v{version}.json` | JSON Evidence Bundle |
| `evidence/{runId}/{evidenceId}.json` | Complete Evidence Item content |
| `step_outputs/{runId}/{stepRunId}.json` | Large step output exceeding the D1 row-size limit |
| `proposals/{proposalId}.json` | Learning Proposal diff |

**Characteristics**:
- No size limit (5 GB per object)
- Extremely low cost (storage at $0.015/GB/month and Class A operations at $4.50/million)
- Can provide signed URLs directly to the frontend or stream responses through the Worker

### 6. Vectorize: Knowledge Base/RAG

```toml
[[vectorize]]
binding = "VECTORIZE"
index_name = "agent-platform-knowledge"
```

**Uses**:
- Store document embeddings for research reports, technical documentation, and codebases
- Retrieve relevant knowledge during Skill execution through a `retrieval_evidence` context block
- Support `cosine` similarity and 1,536 dimensions, compatible with OpenAI embeddings

**Creation command**:
```bash
wrangler vectorize create agent-platform-knowledge --dimensions=1536 --metric=cosine
```

### 7. Queues: Background Jobs

```toml
[[queues.producers]]
binding = "RUN_QUEUE"
queue = "agent-platform-runs"

[[queues.consumers]]
queue = "agent-platform-runs"
max_batch_size = 5
max_batch_timeout = 10
```

**Consumer processing**:
| Job Type | Processing logic |
|----------|---------|
| `eval.run` | Run the Eval Suite, record results, and trigger the Quality Gate |
| `artifact.export` | Generate PDF/PPT/Notion/Slack/GitHub exports |
| `provider.health` | Periodically probe readiness for all providers and update KV |
| `skill.optimize` | Run offline optimization (GEPA/DSPy) to generate candidate SkillVersions |
| `cleanup.expired` | Clean up expired checkpoints and old run events |

**Advantages**:
- Non-blocking: the API response does not wait for background jobs
- Retries: automatic retry after failure, with exponential backoff and max retries
- Visibility: inspect queue depth, processing rate, and dead letters in the Dashboard

### 8. Workers AI: Native Model Option

```toml
[ai]
binding = "AI"
```

**Provider Catalog integration**:
```typescript
// provider-catalog.ts
if (provider === "workers_ai" || provider === "cloudflare") {
  return fetchCloudflareModels(accountId, apiToken);
}
```

**Available models**: `@cf/meta/llama-3.1-8b-instruct`, `@cf/meta/llama-3.3-70b-instruct-fp8-fast`, and others

**Advantages**: no external API key, extremely low latency within the same region, predictable cost, and automatic scaling

---

## Local Development Environment: `npm run dev`

```bash
git clone https://github.com/agent-platform/agent-platform.git
cd agent-platform
pnpm install
cp .dev.vars.example .dev.vars   # 選填：API keys
npm run dev
# → http://127.0.0.1:8787
```

**Startup flow**:
1. `wrangler dev` starts the Worker and simulates D1/KV/R2/Queues/DO/Workflows
2. The Vite dev server serves the React frontend with HMR and proxies to the Worker
3. Without API keys, **offline mode** reads `fixtures/local-research-sources.json` and runs the complete Deep Research flow

**Local simulation mapping**:
| Production service | Local simulation |
|---------|---------|
| D1 | D1 mock from `@cloudflare/workers-types` / in-memory SQLite |
| KV | `Map<string, string>` + TTL cleanup |
| R2 | Local file system at `./.wrangler/state/r2/` |
| Vectorize | In-memory vector index, or skipped |
| Queues | Synchronous execution / in-memory queue |
| Durable Objects | Single-process DO instances, built into `wrangler dev` |
| Workflows | Synchronous step executor simulating pause/resume/retry |

---

## Deployment Walkthrough: From Zero to Production

### Prerequisites

- A Cloudflare account
- The `wrangler` CLI, through `pnpm exec wrangler` or a global installation
- Node.js 22+ and pnpm 10

### Step 1: Authenticate

```bash
wrangler login
wrangler whoami
```

### Step 2: Create Resources (First Time Only)

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

### Step 3: Update wrangler.toml

Insert the IDs returned above:

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

### Step 4: Configure Secrets (Provider Keys + Auth)

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

### Step 5: Deploy

```bash
# 1. 建置前端
npm run build:web

# 2. 應用 D1 Migration（遠端）
wrangler d1 migrations apply agent-platform --remote

# 3. 部署 Worker
wrangler deploy
```

### Verify the Deployment

```bash
curl https://<your-worker>.workers.dev/api/health
curl https://<your-worker>.workers.dev/api/readiness
```

Expected responses:
```json
// /api/health
{"status":"ok","timestamp":"2026-08-23T..."}

// /api/readiness
{"ready":true,"checks":{"db":true,"kv":true,"r2":true,"vectorize":true,"queues":true,"workflows":true,"durable_objects":true}}
```

---

## CI/CD: Automated Deployment with GitHub Actions

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

**Key points**:
- `check:types`: TypeScript type checking
- `build:web` → `apps/web/dist`, served through Workers Assets
- `build:ts` → compile the Worker code
- `check:deploy-readiness`: includes `wrangler deploy --dry-run` to validate the configuration
- **D1 Migration before Deploy**: keeps the schema in sync
- **Secrets configured in GitHub Settings**: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, and all provider keys

---

## Environment Variables and Configuration Management

### .dev.vars (Local)

```bash
# .dev.vars
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
TAVILY_API_KEY=tvly-...
AUTH_SECRET=local-dev-secret-32chars-minimum
```

### wrangler.toml `[vars]` (Non-sensitive Production Configuration)

```toml
[vars]
ENVIRONMENT = "production"
LOG_LEVEL = "info"
DEFAULT_PRESET = "standard"
```

### Secrets (Sensitive Values)

```bash
wrangler secret put OPENAI_API_KEY
# 輸入值，不會顯示在日誌、代碼、wrangler.toml
```

**Access pattern**:
```typescript
// Worker 代碼
const apiKey = env.OPENAI_API_KEY;  // Secret
const envName = env.ENVIRONMENT;    // Vars
```

---

## Common Deployment Problems and Solutions

| Problem | Cause | Solution |
|------|------|------|
| `wrangler deploy` fails: D1 binding not found | The `database_id` in `wrangler.toml` is wrong, or the database has not been created | Check the ID returned by `wrangler d1 create` and confirm that it is in the TOML file |
| `wrangler d1 migrations apply` hangs | The remote D1 database is locked, or a migration file contains invalid syntax | Run `wrangler d1 migrations list` first to inspect the state, then check the SQL syntax |
| Worker startup error: `AI binding not found` | `[ai] binding = "AI"` is missing, or Workers AI is not enabled | Confirm that wrangler.toml contains an `[ai]` section and that the account has Workers AI access |
| Queue consumer does not process messages | `[[queues.consumers]]` is not bound correctly, or the handler was not exported | Check that `class_name` matches the Queue Consumer class in the Worker |
| Durable Object cannot persist state | `new_sqlite_classes` is missing from `[[migrations]]` | Add `new_sqlite_classes = ["RunCoordinator"]` and deploy again |
| Frontend static assets return 404 | The `assets.directory` path is wrong, or `build:web` was not run | Confirm that `apps/web/dist` exists and that `assets = { directory = "apps/web/dist" }` is configured |
| Local `npm run dev` cannot connect to D1 | `.dev.vars` is missing, or `wrangler dev` did not mount the binding correctly | Confirm that `.dev.vars` contains `DATABASE_URL`, or use local SQLite |

---

## Cost Estimate (Approximate)

| Service | Free tier | Estimated paid cost per month |
|------|---------|--------------|
| Workers | 100,000 requests/day | $5/million requests + $0.50/million CPU ms |
| Workers Assets | Unlimited static assets | Free |
| D1 | 5 GB storage, 5M row reads, 100k row writes | $0.75/GB storage, $0.001/M reads, $1.00/M writes |
| KV | 1 GB storage, 100k reads/day, 1k writes/day | $0.50/GB storage, $0.50/M reads, $5.00/M writes |
| R2 | 10 GB storage, unlimited Class B operations | $0.015/GB storage, $4.50/M Class A |
| Vectorize | 30M vectors, 100k queries/month | $0.05/M vectors, $0.50/M queries |
| Queues | 1M messages/month | $0.40/M messages |
| Workflows | 100k steps/month | $0.50/M steps |
| Durable Objects | 1M requests/month | Included in Workers requests |
| Workers AI | 10M neurons/day | $0.011/M neurons (Llama-3.1-8B) |

**One typical Deep Research run**:
- 10 steps, ~50 tool calls, ~500k tokens, ~30 seconds
- Cost: ~$0.10–0.50, depending on the model selection
- Free models such as Nemotron-3-Ultra, GPT-OSS, and GLM-5.2 can reduce the cost to ~$0

---

## Summary: Core Cloudflare Deployment Contracts

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

**Three invariants**:
1. **Interfaces remain stable; implementations are replaceable** — local and production environments use the same Runtime interfaces, so upper layers do not notice the change
2. **Prefer Cloudflare-native services** — do not build custom orchestration, queues, or a vector database; use the Workers ecosystem directly
3. **Configuration-driven deployment** — `wrangler.toml` + Secrets define everything, with no manual clicking in the Dashboard

---

## References

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
