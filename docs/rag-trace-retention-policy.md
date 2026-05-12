# RAG Trace 保留政策（執行版）

本文件定義 `rag_trace_steps` 與 `native_trace` 在生產/管理操作時的保留規則，對應實作位於：

- `src/pages/api/admin/traces/retention.ts`
- `src/pages/api/admin/rag.ts`（新增保留設定欄位）
- `src/lib/rag/admin-eval.ts`
- `src/pages/api/admin/rag-smoke.ts`
- `scripts/create-cron-entry.mjs`
- `scripts/rag-trace-retention.mjs`
- `migrations/0008_rag_trace_retention.sql`

## 目標

- 追求追蹤可用性，避免 `rag_trace_steps` 無限制成長。
- 讓 production 主要保留流程摘要，並對 `native_trace` 作採樣保留。
- admin / eval 資料保留更長時間，方便排障與回放。

## 設定鍵（可在 `/api/admin/rag` 管理）

- `rag_trace_retention_prod_days`（預設：`14`）
- `rag_trace_retention_admin_days`（預設：`30`）
- `rag_trace_retention_prod_native_days`（預設：`7`）
- `rag_trace_retention_admin_native_days`（預設：`30`）
- `rag_trace_retention_native_sample_bps`（預設：`100`，基點制）
- `rag_trace_retention_error_grace_days`（預設：`3`）
- `rag_trace_retention_enabled`（預設：`1`）

## 行為規則

### Trace 分類

`/api/chat` 會把每筆 trace 寫入 `metadata_json.trace_scope`：
- `production`：未指定 scope 的一般訪客請求
- `admin`：管理員請求（未指定且有 session）
- `eval`：admin/rag-smoke 與 admin/eval 跑批

### 非 native trace (`stage != 'native_trace'`)

- `production`：超過 `rag_trace_retention_prod_days` 刪除
- `admin` / `eval`：超過 `rag_trace_retention_admin_days` 刪除

### `native_trace`（`stage = 'native_trace'`)

- `production`：只保留採樣。`trace_scope='production'` 且在
  `rag_trace_retention_prod_native_days` 視窗內，會以 `trace_scope` hash 做採樣
- `admin` / `eval`：保留到 `rag_trace_retention_admin_native_days`
- 以上規則皆受 `rag_trace_retention_enabled` 控制；若為 `0` 則不刪除

### 錯誤寬限

- `rag_trace_retention_error_grace_days` 作為保底時間，任何已產生 trace 在該天數內皆不會刪除，以避免清理時誤殺短時間內資料。

### 排程

- 每日 03:00（Cloudflare cron `0 3 * * *`）：觸發保留清理
- 週期性 Sunday 02:00（`0 2 * * SUN`）：同時觸發 crawl sync
- `scripts/create-cron-entry.mjs` 將 `scheduled` handler 內建為：
  - 每次呼叫 `POST /api/admin/traces/retention`（scope=`all`）
  - 僅 Sunday 呼叫 `POST /api/crawl/sync`

### Cron 呼叫目標設定

`scripts/create-cron-entry.mjs` 會依序讀取以下環境變數（取第一個有值）來組出 base URL：

- `APP_BASE_URL`（建議，明確指定站台入口）
- `CRAWL_BASE_URL`
- `WORKER_URL`
- `CF_PAGES_URL`
- 未設定時 fallback 為 `https://quidproquo.cc`

因此不再 hardcode 網址，跨環境（preview/dev/prod）可直接注入對應 domain。

維護任務仍需透過：

- `POST /api/admin/traces/retention`（需 `X-Crawl-Secret`）
- `POST /api/crawl/sync`（需 `X-Crawl-Secret`）

與對應 `CRAWL_SECRET` 權杖搭配使用。

## 運維執行方式

- 手動 dry-run（不實際刪除）：
  - `CRAWL_SECRET=... RAG_TRACE_RETENTION_DRY_RUN=1 node scripts/rag-trace-retention.mjs`
- 實際刪除：
  - `CRAWL_SECRET=... pnpm rag:trace-retention`

## 運行時 API（cron 與手動共用）

`POST /api/admin/traces/retention`

請求 body:

- `scope`（可選）：`production` / `admin` / `all`，預設 `all`
- `dryRun`（可選）：`true` / `false`

回應含：
- `planned`：預計刪除的 trace 筆數
- `delete`：實際或預估刪除列數
- `scope`、`settings`、`at` 時戳

## 遷移與預設

- `migrations/0008_rag_trace_retention.sql` 注入以上 retention 設定預設值
