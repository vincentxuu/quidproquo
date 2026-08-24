# Agent Platform Cloudflare 部署運維手冊

> 版本：v0.1.0+  
> 適用環境：Cloudflare Workers + Workers Assets + D1 + KV + R2 + Vectorize + Queues + Workflows + Durable Objects + Workers AI  
> 目標讀者：平台工程師、SRE、負責部署的開發者

---

## 架構總覽

```
┌─────────────────────────────────────────────────────────────────┐
│                        Cloudflare Edge                            │
├─────────────────────────────────────────────────────────────────┤
│  Workers Assets (靜態資源)                                        │
│  └── apps/web/dist → React + Vite 前端                           │
├─────────────────────────────────────────────────────────────────┤
│  Workers (API Gateway + Hono Router)                             │
│  ├── /api/* → 管理 API (flows, runs, skills, providers, policies)│
│  ├── /v1/* → OpenAI 相容 Proxy (models, chat/completions)       │
│  └── /api/health, /api/readiness → 健康檢查                      │
├─────────────────────────────────────────────────────────────────┤
│  Durable Objects: RunCoordinator (每個 Run 一個實例)             │
│  ├── 持有 Run 完整狀態 (單寫入者、強一致性)                       │
│  ├── 處理 createRun/completeStep/failStep/retryStep/cancel/resume│
│  ├── 定期 flush checkpoint 到 D1                                 │
│  └── WebSocket 推送即時事件到前端                                │
├─────────────────────────────────────────────────────────────────┤
│  Workflows: DeepResearchWorkflow (Flow Step 執行引擎)            │
│  ├── 每個 Flow Step = 一個 Workflow Step                         │
│  ├── 內建 pause/resume/retry/timeout/step status                 │
│  └── ctx.waitForEvent() 等待外部觸發 (approval、人工審核)        │
├─────────────────────────────────────────────────────────────────┤
│  D1 (SQLite): 關係型資料                                          │
│  ├── flows, flow_versions, flow_presets, flow_steps, flow_edges │
│  ├── flow_runs, step_runs, checkpoints, run_events              │
│  ├── skills, skill_versions, skill_files                        │
│  ├── providers, policies, api_clients, api_audit_log            │
│  └── sources, evidence_items, claims, citations, conflicts      │
│  └── artifacts, artifact_versions, memory_items, eval_*         │
├─────────────────────────────────────────────────────────────────┤
│  KV (CACHE): 快速狀態/快取                                        │
│  ├── rate_limit:{client_id}:{window} → API 速率計數             │
│  ├── provider_health:{provider_id} → 延遲/成功率/錯誤計數       │
│  ├── run_snapshot:{run_id} → UI 快照 (避免查 D1)                │
│  ├── session:{session_id} → Web UI session                      │
│  └── idempotency:{key} → 冪等性 key                             │
├─────────────────────────────────────────────────────────────────┤
│  R2 (ARTIFACTS): 大型產出物                                       │
│  ├── artifacts/{runId}/{artifactId}/v{version}.md               │
│  ├── artifacts/{runId}/{artifactId}/v{version}.json             │
│  ├── evidence/{runId}/{evidenceId}.json                         │
│  ├── step_outputs/{runId}/{stepRunId}.json                      │
│  └── proposals/{proposalId}.json                                │
├─────────────────────────────────────────────────────────────────┤
│  Vectorize (VECTORIZE): 知識庫/RAG                                │
│  ├── 文檔 embedding (1536 維、cosine)                            │
│  └── Skill 執行時檢索相關知識                                    │
├─────────────────────────────────────────────────────────────────┤
│  Queues (RUN_QUEUE): 背景任務                                     │
│  ├── eval.run → Eval Suite 執行                                 │
│  ├── artifact.export → PDF/Notion/Slack/GitHub export           │
│  ├── provider.health → 定期探測 provider readiness              │
│  ├── skill.optimize → 離線優化生成候選 SkillVersion             │
│  └── cleanup.expired → 清理過期 checkpoints、舊 run events      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 部署前置需求

### 本機工具

```bash
# 必裝
node >= 22.12.0
pnpm >= 10
wrangler >= 3.80.0  # pnpm exec wrangler 或全域安裝

# 選裝（方便除錯）
cloudflared  # Tunnel 測試
sqlite3      # 本機 D1 檢查
```

### Cloudflare 帳號權限

- Workers 部署權限
- D1/KV/R2/Vectorize/Queues/Workflows/Durable Objects 建立權限
- Workers AI 啟用（可選，用於原生模型）
- Custom Domain + SSL（生產環境）

### GitHub Secrets（CI/CD 用）

| Secret | 說明 | 來源 |
|--------|------|------|
| `CLOUDFLARE_ACCOUNT_ID` | 帳號 ID | `wrangler whoami` 或 Dashboard |
| `CLOUDFLARE_API_TOKEN` | API Token (Zone:Workers:Edit, D1:Edit, KV:Edit, R2:Edit, Vectorize:Edit, Queues:Edit, Workflows:Edit, Durable Objects:Edit) | Dashboard → My Profile → API Tokens |

---

## 部署步驟（首次部署）

### 1. 認證與檢查

```bash
# 登入 Cloudflare
wrangler login
wrangler whoami  # 確認帳號正確

# 檢查 wrangler.toml 存在
cat wrangler.toml
```

### 2. 建立所有資源（僅首次）

```bash
# D1 Database
wrangler d1 create agent-platform
# 輸出範例：
# ┌────────────────────────────────────────────────────────────┐
# │ Created database 'agent-platform'                         │
# │ Database ID: f6d45425-7dd7-4625-8991-7142cb949712         │
# └────────────────────────────────────────────────────────────┘
# → 複製 Database ID 待填入 wrangler.toml

# KV Namespace
wrangler kv namespace create CACHE
# 輸出範例：
# { "binding": "CACHE", "id": "608d1fb3c4424146abe50ab56e246aca" }
# → 複製 id 待填入

# R2 Bucket
wrangler r2 bucket create agent-platform-artifacts

# Vectorize Index (1536 維、cosine 相似度)
wrangler vectorize create agent-platform-knowledge --dimensions=1536 --metric=cosine

# Queue
wrangler queues create agent-platform-runs

# 注意：Workflows & Durable Objects 會在首次 deploy 時自動建立
# 無需手動建立
```

### 3. 更新 wrangler.toml

將步驟 2 的輸出 ID 填入：

```toml
# wrangler.toml 關鍵區塊
[[d1_databases]]
binding = "DB"
database_name = "agent-platform"
database_id = "f6d45425-7dd7-4625-8991-7142cb949712"  # ← 你的 Database ID
migrations_dir = "packages/db/migrations"

[[kv_namespaces]]
binding = "CACHE"
id = "608d1fb3c4424146abe50ab56e246aca"  # ← 你的 KV ID

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

[[workflows]]
name = "agent-platform-deep-research"
binding = "DEEP_RESEARCH_WORKFLOW"
class_name = "DeepResearchWorkflow"

[[durable_objects.bindings]]
name = "RUN_COORDINATOR"
class_name = "RunCoordinator"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["RunCoordinator"]

[ai]
binding = "AI"

[vars]
ENVIRONMENT = "production"
LOG_LEVEL = "info"
```

### 4. 設定 Secrets（敏感值）

```bash
# LLM Providers (依需求設定，至少要一個)
wrangler secret put OPENAI_API_KEY
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put GEMINI_API_KEY
wrangler secret put OPENROUTER_API_KEY
wrangler secret put GROQ_API_KEY
wrangler secret put CEREBRAS_API_KEY
wrangler secret put NVIDIA_API_KEY

# Search Providers (依需求)
wrangler secret put TAVILY_API_KEY
wrangler secret put EXA_API_KEY
wrangler secret put BRAVE_SEARCH_API_KEY
wrangler secret put SERPER_API_KEY
wrangler secret put FIRECRAWL_API_KEY
wrangler secret put JINA_API_KEY

# Auth (必填，至少 32 字元隨機字串)
wrangler secret put AUTH_SECRET

# 可選：其他服務
wrangler secret put SENDGRID_API_KEY      # Email
wrangler secret put GITHUB_TOKEN          # GitHub action
wrangler secret put SLACK_BOT_TOKEN       # Slack
wrangler secret put NOTION_API_KEY        # Notion
```

> **注意**：Secrets 不會顯示在日誌、代碼、wrangler.toml 中。每次設定後會自動加密儲存。

### 5. 本機驗證（部署前）

```bash
# 1. 安裝依賴
pnpm install --frozen-lockfile

# 2. TypeScript 型別檢查
pnpm run check:types

# 3. 建置前端 + Worker
pnpm run build:web && pnpm run build:ts

# 4. 部署就緒檢查 (包含 wrangler deploy --dry-run)
pnpm run check:deploy-readiness

# 5. 本機完整測試
npm run dev
# → http://127.0.0.1:8787
# 驗證：健康檢查、Run 建立、Deep Research 離線模式跑通
```

### 6. 部署到生產

```bash
# 1. 應用 D1 Migration (遠端)
wrangler d1 migrations apply agent-platform --remote

# 2. 部署 Worker
wrangler deploy

# 3. 驗證部署
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

## CI/CD 自動化部署

### GitHub Actions 工作流

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

### 關鍵點

- `check:types` → TypeScript 型別檢查
- `build:web` → `apps/web/dist` (Workers Assets 服務)
- `build:ts` → 編譯 Worker 代碼
- `check:deploy-readiness` → 包含 `wrangler deploy --dry-run`
- **D1 Migration 先於 Deploy** → 確保 schema 同步
- **Secrets 在 GitHub Settings 設定**，不在代碼倉庫

---

## 環境管理

### 多環境配置策略

| 環境 | 用途 | 配置方式 |
|------|------|---------|
| **local** | 開發 | `.dev.vars` + `wrangler dev` |
| **staging** | 整合測試 | `wrangler.toml` + 環境專用 secrets |
| **production** | 正式服務 | `wrangler.toml` + 生產 secrets |

### 建議：使用環境專用 wrangler 配置

```toml
# wrangler.toml (共用)
# ...
[vars]
ENVIRONMENT = "production"

# wrangler.staging.toml (覆蓋)
name = "agent-platform-staging"
[vars]
ENVIRONMENT = "staging"

# 部署指令
wrangler deploy --config wrangler.staging.toml  # staging
wrangler deploy  # production
```

### 環境專用 Secrets

```bash
# Staging
wrangler secret put OPENAI_API_KEY --config wrangler.staging.toml
wrangler secret put AUTH_SECRET --config wrangler.staging.toml

# Production
wrangler secret put OPENAI_API_KEY
wrangler secret put AUTH_SECRET
```

---

## 常用運維指令

### D1 資料庫操作

```bash
# 列出 migrations
wrangler d1 migrations list agent-platform

# 應用 migration (本機)
wrangler d1 migrations apply agent-platform --local

# 應用 migration (遠端)
wrangler d1 migrations apply agent-platform --remote

# 建立新 migration
wrangler d1 migrations create agent-platform "add_new_table"

# 查詢資料 (遠端)
wrangler d1 execute agent-platform --remote --command "SELECT * FROM flows LIMIT 5"

# 查詢資料 (本機)
wrangler d1 execute agent-platform --local --command "SELECT * FROM flow_runs ORDER BY created_at DESC LIMIT 10"

# 匯出資料庫 (備份)
wrangler d1 export agent-platform --output backup.sql

# 匯入資料庫
wrangler d1 import agent-platform --file backup.sql
```

### KV 操作

```bash
# 列出所有 keys
wrangler kv key list --binding CACHE

# 讀取特定 key
wrangler kv key get "provider_health:tavily" --binding CACHE

# 寫入 key (TTL 3600 秒)
wrangler kv key put "test_key" "test_value" --binding CACHE --expiration-ttl 3600

# 刪除 key
wrangler kv key delete "test_key" --binding CACHE

# 批次匯入 (JSON 格式)
wrangler kv bulk put --binding CACHE data.json
```

### R2 操作

```bash
# 列出 objects
wrangler r2 object list agent-platform-artifacts

# 上傳檔案
wrangler r2 object put agent-platform-artifacts/artifacts/run_123/report.md --file ./report.md

# 下載檔案
wrangler r2 object get agent-platform-artifacts/artifacts/run_123/report.md --file ./downloaded.md

# 刪除檔案
wrangler r2 object delete agent-platform-artifacts/artifacts/run_123/report.md

# 產生簽署 URL (供前端直接下載)
wrangler r2 object sign agent-platform-artifacts/artifacts/run_123/report.md --expiration 3600
```

### Queue 操作

```bash
# 查看 queue 狀態
wrangler queues list
wrangler queues get agent-platform-runs

# 手動發送訊息 (測試 consumer)
wrangler queues send agent-platform-runs --message '{"type":"eval.run","payload":{"suiteId":"deep_research_regression"}}'

# 查看 consumer 狀態
wrangler queues consumer list agent-platform-runs
```

### Vectorize 操作

```bash
# 查看 index 資訊
wrangler vectorize get agent-platform-knowledge

# 插入向量 (測試)
wrangler vectorize insert agent-platform-knowledge --vectors '{"id":"test_1","values":[0.1,0.2,...],"metadata":{"source":"test"}}'

# 查詢向量
wrangler vectorize query agent-platform-knowledge --vector "[0.1,0.2,...]" --top-k 5

# 刪除向量
wrangler vectorize delete agent-platform-knowledge --ids "test_1"
```

### Workflows / Durable Objects

```bash
# 列出 Workflows
wrangler workflows list

# 查看特定 workflow 實例
wrangler workflows get agent-platform-deep-research --instance-id <instance-id>

# 列出 DO 類別
wrangler durable-objects list

# 查看 DO 實例 (需知道 ID)
# 注意：DO 實例 ID 由平台產生，通常不直接查詢
```

### Logs / 除錯

```bash
# 即時 log tail (生產)
wrangler tail --format=pretty

# 過濾特定 run
wrangler tail --format=pretty --filter "run_abc123"

# 過濾錯誤
wrangler tail --format=pretty --status error

# 本機開發 log
npm run dev  # 整合在終端機顯示
```

---

## 健康檢查與監控

### 健康檢查端點

```bash
# 基礎健康檢查
curl https://<your-worker>.workers.dev/api/health
# {"status":"ok","timestamp":"..."}

# 就緒檢查 (所有服務 binding 正常)
curl https://<your-worker>.workers.dev/api/readiness
# {"ready":true,"checks":{"db":true,"kv":true,"r2":true,"vectorize":true,"queues":true,"workflows":true,"durable_objects":true}}

# Provider readiness
curl https://<your-worker>.workers.dev/api/providers/readiness
```

### 關鍵指標監控

| 指標 | 正常範圍 | 告警閾值 | 查看方式 |
|------|---------|---------|---------|
| Worker 錯誤率 | < 0.1% | > 1% | Cloudflare Dashboard → Workers → Metrics |
| Worker p99 延遲 | < 2s | > 10s | 同上 |
| D1 查詢延遲 p99 | < 100ms | > 500ms | D1 Dashboard |
| KV 讀取錯誤率 | 0% | > 0.1% | KV Dashboard |
| Queue 消費延遲 | < 30s | > 5min | Queues Dashboard |
| Workflow 成功率 | > 99% | < 95% | Workflows Dashboard |
| DO CPU 時間 | < 50ms/req | > 200ms | DO Dashboard |
| R2 錯誤率 | 0% | > 0.1% | R2 Dashboard |

### 設定告警 (Cloudflare Dashboard)

1. Workers → Observability → Alerts → Create Alert
2. 選擇指標、閾值、通知頻道 (Email/Slack/PagerDuty)
3. 建議告警：
   - Worker Error Rate > 1% for 5m
   - D1 Query Duration p99 > 500ms for 10m
   - Queue Backlog > 1000 for 15m
   - Workflow Failure Rate > 5% for 15m

---

## 常見問題與排查

### 部署失敗

| 錯誤 | 原因 | 解決 |
|------|------|------|
| `D1 binding not found` | `database_id` 錯誤或未建立 | 確認 `wrangler d1 create` 輸出、已填入 toml |
| `KV namespace not found` | `id` 錯誤 | 確認 `wrangler kv namespace create` 輸出 |
| `Queue not found` | Queue 未建立 | `wrangler queues create agent-platform-runs` |
| `Vectorize index not found` | Index 未建立或名稱錯誤 | `wrangler vectorize create ...`、確認 `index_name` |
| `Workflows binding not found` | 首次 deploy 未完成 | 重新 `wrangler deploy`，Workflows 會自動建立 |
| `Durable Object migration error` | `new_sqlite_classes` 缺少 | 加入 `["RunCoordinator"]` 並重新 deploy |
| `Secret not found` | Secret 未設定 | `wrangler secret put KEY_NAME` |
| `Assets not found` | `build:web` 未跑或路徑錯 | 確認 `apps/web/dist` 存在、`assets.directory` 正確 |

### 運行時問題

| 現象 | 可能原因 | 排查步驟 |
|------|---------|---------|
| Run 卡在 `active` 狀態 | DO/Workflow 未正確處理 | `wrangler tail` 看錯誤、檢查 DO log |
| Provider readiness 全 false | Secrets 未設定/錯誤 | `wrangler secret list` 確認、檢查 key 格式 |
| Queue consumer 不處理訊息 | Consumer class 未 export | 確認 `class_name` 對應、handler 正確 export |
| Artifact 下載 404 | R2 binding 錯誤/物件不存在 | `wrangler r2 object list` 確認、檢查 binding name |
| Vectorize 查詢無結果 | Index 為空/維度不符 | 確認 `--dimensions=1536`、embedding 模型一致 |
| WebSocket 斷線 | DO 重啟/超時 | 實作重連邏輯、檢查 DO CPU 時間 |

### 效能調優

| 瓶頸 | 調優方向 |
|------|---------|
| D1 寫入慢 | 批次寫入 (`db.batch`)、避免單筆 INSERT |
| KV 讀取熱點 | 縮短 TTL、增加本機快取層 |
| DO CPU 超時 | 移出複雜計算到 Workflow/Queue、優化演算法 |
| Workflow 步驟慢 | 並行化獨立步驟、使用 `ctx.run()` 隔離 |
| R2 上傳大檔案 | 分片上傳、預簽名 URL 直傳 |

---

## 災難恢復

### 備份策略

| 資料類型 | 備份頻率 | 保留期限 | 方式 |
|---------|---------|---------|------|
| D1 資料庫 | 每日 | 30 天 | `wrangler d1 export` 自動化 |
| R2 Artifacts | 即時複製 | 永久 | R2 異地複製 (設定 replication) |
| KV | 不備份 (可重建) | - | 從 D1 重建 |
| Vectorize | 每週 | 4 週 | 匯出 vectors + metadata |
| Worker 代碼 | 每次 deploy | 永久 | Git 版本控制 |

### 恢復演練 (每季)

```bash
# 1. 建立測試環境
wrangler d1 create agent-platform-dr
# 2. 匯入最新備份
wrangler d1 import agent-platform-dr --file latest_backup.sql
# 3. 部署測試版本
wrangler deploy --config wrangler.dr.toml --env dr
# 4. 驗證關鍵流程
curl https://dr.your-domain.com/api/health
# 跑一個 Deep Research 測試
# 5. 記錄 RTO/RPO
```

### RTO/RPO 目標

| 服務 | RTO (恢復時間目標) | RPO (恢復點目標) |
|------|-------------------|-----------------|
| API Gateway (Worker) | 5 分鐘 | 0 (無狀態) |
| D1 資料庫 | 30 分鐘 | 24 小時 (每日備份) |
| R2 Artifacts | 0 分鐘 (即時複製) | 0 |
| KV Cache | 5 分鐘 | 可接受遺失 |
| Queue 訊息 | 15 分鐘 | 依訊息保留設定 |

---

## 成本監控與優化

### 月成本估算 (參考)

| 服務 | 免費額度 | 付費單價 | 典型月用量 | 估算成本 |
|------|---------|---------|-----------|---------|
| Workers | 100k req/day | $5/M req + $0.50/M CPU ms | 500k req, 50M CPU ms | ~$5 |
| Workers Assets | 無限 | 免費 | - | $0 |
| D1 | 5 GB, 5M reads, 100k writes | $0.75/GB, $0.001/M reads, $1/M writes | 2 GB, 2M reads, 50k writes | ~$1.5 |
| KV | 1 GB, 100k reads/day, 1k writes/day | $0.50/GB, $0.50/M reads, $5/M writes | 500 MB, 1M reads, 10k writes | ~$0.5 |
| R2 | 10 GB, 無限 Class B | $0.015/GB, $4.50/M Class A | 5 GB, 100k Class A | ~$0.5 |
| Vectorize | 30M vectors, 100k queries | $0.05/M vectors, $0.50/M queries | 1M vectors, 50k queries | ~$0.1 |
| Queues | 1M msgs | $0.40/M msgs | 200k msgs | ~$0.08 |
| Workflows | 100k steps | $0.50/M steps | 50k steps | ~$0.03 |
| Durable Objects | 含在 Workers | - | - | - |
| Workers AI | 10M neurons/day | $0.011/M neurons (Llama-3.1-8B) | 視用量 | 變動 |

**典型月成本：$8-15 (視用量)**，遠低於自建同級基礎設施。

### 成本優化建議

1. **啟用免費模型**：Policy 設定 `max_cost_usd: 0` 強制走 Nemotron-3-Ultra/GPT-OSS/GLM-5.2
2. **調整 KV TTL**：非關鍵快取縮短 TTL 減少存儲
3. **D1 索引優化**：為高頻查詢欄位加索引 (`idx_flow_runs_status` 等已建立)
4. **Queue 批次處理**：`max_batch_size: 5` → 視負載調大至 10-20
5. **Vectorize 維度**：如精度允許，考慮 768 維降低成本

---

## 安全強化清單

- [ ] **WAF 規則**：封鎖已知惡意 IP、SQL injection、XSS payload
- [ ] **Rate Limiting**：Worker 層級 + KV 層級雙重防護
- [ ] **Secrets 管理**：所有敏感值用 `wrangler secret`、無明文在代碼
- [ ] **API Key Scoping**：每個 client 只能存取授權的 flows、有預算上限
- [ ] **Audit Log 完整性**：所有管理操作、外部寫入、政策變更留痕
- [ ] **資料加密**：D1/KV/R2 靜態加密 (Cloudflare 預設)、傳輸 TLS 1.3
- [ ] **最小權限部署**：CI/CD token 只給必要權限
- [ ] **依賴掃描**：`pnpm audit`、GitHub Dependabot 自動更新
- [ ] **定期滲透測試**：每半年一次

---

## 版本升級檢查清單

### Worker 代碼升級

```bash
# 1. 拉取最新代碼
git pull origin main

# 2. 檢查 migration 變更
cat packages/db/migrations/00XX_new_migration.sql

# 3. 本機測試 migration
wrangler d1 migrations apply agent-platform --local

# 4. 跑測試
pnpm test

# 5. 建置
pnpm run build:web && pnpm run build:ts

# 6. Deploy readiness
pnpm run check:deploy-readiness

# 7. 遠端 migration
wrangler d1 migrations apply agent-platform --remote

# 8. 部署
wrangler deploy

# 9. 驗證
curl https://<worker>/api/health
curl https://<worker>/api/readiness
```

### 破壞性變更處理

| 變更類型 | 處理方式 |
|---------|---------|
| D1 Schema 破壞性 (drop column、rename table) | 建立新 migration、提供遷移腳本、藍綠部署 |
| API 介面破壞性 | 版本化 `/v1/` → `/v2/`、雙版本並行 30 天 |
| Provider config 格式變更 | 提供遷移腳本自動轉換、舊格式相容期 |
| Skill package 格式變更 | 版本化 skill.yaml、提供升級指南 |

---

## 聯絡資訊與升級管道

| 問題類型 | 管道 | SLA |
|---------|------|-----|
| 生產環境嚴重故障 (P0) | PagerDuty / On-call 電話 | 15 分鐘回應 |
| 功能異常 (P1) | Slack #agent-platform-alerts | 1 小時回應 |
| 效能問題 (P2) | GitHub Issue + Slack | 4 小時回應 |
| 功能需求 / 改善 (P3) | GitHub Issue / Discussion | 下一個 Sprint 評估 |

---

## 參考資料

- [Agent Platform GitHub](https://github.com/vincentxuu/agent-platform)
- [Cloudflare Workers 文件](https://developers.cloudflare.com/workers/)
- [Cloudflare Workflows 文件](https://developers.cloudflare.com/workflows/)
- [Cloudflare Durable Objects 文件](https://developers.cloudflare.com/durable-objects/)
- [Cloudflare D1 文件](https://developers.cloudflare.com/d1/)
- [Cloudflare Vectorize 文件](https://developers.cloudflare.com/vectorize/)
- [Cloudflare Queues 文件](https://developers.cloudflare.com/queues/)
- [Wrangler CLI 文件](https://developers.cloudflare.com/workers/wrangler/)
- [Agent Gateway Plan](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md)
- [OpenSpec Specs](https://github.com/vincentxuu/agent-platform/tree/main/openspec/specs)