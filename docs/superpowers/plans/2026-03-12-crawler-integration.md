# Phase 3: Crawler Integration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 每週自動爬取外部技術文件（Cloudflare Docs、Astro Docs 等），chunking 後存進 D1 `doc_chunks` 表，為 Phase 4 RAG 系統建立知識庫。

**Architecture:** 核心爬蟲邏輯放在 `src/lib/crawl/`（pure functions，可測試）。一個 POST `/api/crawl/sync` endpoint 處理手動觸發（受 secret 保護）。Cron Trigger 透過 post-build 腳本包裝 Astro 的 worker output，加入 `scheduled` handler 呼叫自身 endpoint。不引入新的部署單元。

**Tech Stack:** Cloudflare Browser Rendering REST API (`/crawl`)、D1 (`doc_chunks` table，已建好)、Cloudflare Workers Cron Triggers、TypeScript、Worker secrets (`CF_API_TOKEN`、`CF_ACCOUNT_ID`、`CRAWL_SECRET`)

---

## 注意事項

- `doc_chunks` table 已在 `migrations/0001_initial.sql` 建好，不需要新 migration
- DB 存取使用現有模式：`import { env } from 'cloudflare:workers'`
- Cloudflare Browser Rendering `/crawl` 是 REST API（需 API token），**不是** Workers binding
- Cron 設定需要在 deploy 前確認 Worker secrets 已設定

---

## 檔案結構

```
src/
├── lib/
│   └── crawl/
│       ├── config.ts          # 爬取目標清單 + 設定
│       ├── browser-rendering.ts  # 呼叫 CF BR /crawl REST API
│       ├── chunker.ts         # markdown → doc_chunks 格式
│       └── sync.ts            # 主流程：config → crawl → chunk → D1
└── pages/
    └── api/
        └── crawl/
            └── sync.ts        # POST endpoint（受 CRAWL_SECRET 保護）

scripts/
└── create-cron-entry.mjs      # post-build：產生 dist/cron-entry.js

wrangler.jsonc                 # 加入 main、triggers.crons
package.json                   # 更新 build + deploy scripts
```

---

## Chunk 1: 核心爬蟲邏輯

### Task 1: Crawl Config

**Files:**
- Create: `src/lib/crawl/config.ts`

- [ ] **Step 1: 寫 config.ts**

```typescript
// src/lib/crawl/config.ts

export interface CrawlTarget {
  name: string;                  // 顯示名稱（存入 source_name）
  url: string;                   // 爬取起始 URL
  includePatterns: string[];     // 只爬這些路徑（對應 options.includePatterns）
  limit: number;                 // 最多爬幾頁（對應 API 的 limit 欄位）
  render: boolean;               // 是否需要 JS 渲染（靜態文件設 false）
}

export const CRAWL_TARGETS: CrawlTarget[] = [
  {
    name: 'Cloudflare D1',
    url: 'https://developers.cloudflare.com/d1/',
    includePatterns: ['/d1/**'],
    limit: 50,
    render: false,
  },
  {
    name: 'Cloudflare Workers',
    url: 'https://developers.cloudflare.com/workers/',
    includePatterns: ['/workers/**'],
    limit: 100,
    render: false,
  },
  {
    name: 'Cloudflare Vectorize',
    url: 'https://developers.cloudflare.com/vectorize/',
    includePatterns: ['/vectorize/**'],
    limit: 30,
    render: false,
  },
  {
    name: 'Astro Docs',
    url: 'https://docs.astro.build/',
    includePatterns: ['/en/guides/**', '/en/reference/**'],
    limit: 80,
    render: false,
  },
];

// chunk 大小上限（約 500 tokens ≈ 2000 字元）
export const MAX_CHUNK_CHARS = 2000;
```

- [ ] **Step 2: 型別檢查**

```bash
cd /Users/xiaoxu/Projects/quidproquo
npx astro check
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/crawl/config.ts
git commit -m "feat: add crawler config with Cloudflare and Astro doc targets"
```

---

### Task 2: Browser Rendering Client

**Files:**
- Create: `src/lib/crawl/browser-rendering.ts`

呼叫 Cloudflare Browser Rendering REST API `/crawl` endpoint。

- [ ] **Step 1: 寫 browser-rendering.ts**

```typescript
// src/lib/crawl/browser-rendering.ts
// /crawl API 是非同步的：POST 取得 job_id → 輪詢 GET 直到完成

import type { CrawlTarget } from './config';

export interface CrawledPage {
  url: string;
  markdown: string;
  title?: string;
}

interface BRCrawlRequest {
  url: string;
  formats: string[];
  limit: number;
  render: boolean;
  source: string;
  maxAge: number;
  options: {
    includePatterns: string[];
  };
}

interface BRJobPage {
  url: string;
  status: string;
  markdown?: string;
  metadata?: {
    title?: string;
    status_code?: number;
  };
}

interface BRJobStatusResponse {
  success: boolean;
  result: {
    id: string;
    status: 'running' | 'completed' | 'cancelled_due_to_timeout' | 'cancelled_due_to_limits' | 'cancelled_by_user' | 'errored';
    pages?: BRJobPage[];
  };
}

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000; // 5 分鐘上限

export async function crawlTarget(
  target: CrawlTarget,
  accountId: string,
  apiToken: string
): Promise<CrawledPage[]> {
  const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/browser-rendering`;
  const headers = {
    'Authorization': `Bearer ${apiToken}`,
    'Content-Type': 'application/json',
  };

  // Step 1: 送出 crawl job
  const body: BRCrawlRequest = {
    url: target.url,
    formats: ['markdown'],
    limit: target.limit,
    render: target.render,
    source: 'sitemaps',
    maxAge: 604800, // 7 天快取
    options: {
      includePatterns: target.includePatterns,
    },
  };

  const submitRes = await fetch(`${baseUrl}/crawl`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!submitRes.ok) {
    const text = await submitRes.text();
    throw new Error(`Crawl submit error ${submitRes.status}: ${text}`);
  }

  const submitData = (await submitRes.json()) as { success: boolean; result: string };
  if (!submitData.success) throw new Error(`Crawl submit failed`);

  const jobId = submitData.result;
  console.log(`[crawl] Job submitted: ${jobId}`);

  // Step 2: 輪詢直到完成
  const deadline = Date.now() + POLL_TIMEOUT_MS;

  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));

    const statusRes = await fetch(`${baseUrl}/crawl/${jobId}`, { headers });
    if (!statusRes.ok) {
      const text = await statusRes.text();
      throw new Error(`Crawl status error ${statusRes.status}: ${text}`);
    }

    const statusData = (await statusRes.json()) as BRJobStatusResponse;
    const { status, pages } = statusData.result;

    if (status === 'completed') {
      return (pages ?? [])
        .filter(p => p.markdown && p.markdown.trim().length > 0)
        .map(p => ({
          url: p.url,
          markdown: p.markdown!,
          title: p.metadata?.title,
        }));
    }

    if (status !== 'running') {
      throw new Error(`Crawl job ended with status: ${status}`);
    }

    console.log(`[crawl] Job ${jobId} still running...`);
  }

  throw new Error(`Crawl job ${jobId} timed out after ${POLL_TIMEOUT_MS / 1000}s`);
}
```

- [ ] **Step 2: 型別檢查**

```bash
npx astro check
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/crawl/browser-rendering.ts
git commit -m "feat: add Cloudflare Browser Rendering crawl client"
```

---

### Task 3: Markdown Chunker

**Files:**
- Create: `src/lib/crawl/chunker.ts`

將爬到的 markdown 依標題切成適合 embedding 的 chunks。

- [ ] **Step 1: 寫 chunker.ts**

```typescript
// src/lib/crawl/chunker.ts

import { MAX_CHUNK_CHARS } from './config';
import { createHash } from 'node:crypto';

export interface DocChunk {
  id: string;           // sha256(source_url + chunk_index)[:16]
  source_url: string;
  source_name: string;
  chunk_index: number;
  content: string;
}

function generateChunkId(sourceUrl: string, chunkIndex: number): string {
  return createHash('sha256')
    .update(`${sourceUrl}::${chunkIndex}`)
    .digest('hex')
    .slice(0, 16);
}

/**
 * 將 markdown 按 ## / ### 標題切成 chunks。
 * 若單一 section 超過 MAX_CHUNK_CHARS，進一步按段落切。
 */
export function chunkMarkdown(
  markdown: string,
  sourceUrl: string,
  sourceName: string
): DocChunk[] {
  // 按 ## 或 ### 標題切割
  const sections = markdown.split(/(?=^#{1,3} )/m).filter(s => s.trim().length > 0);

  const chunks: DocChunk[] = [];

  for (const section of sections) {
    if (section.length <= MAX_CHUNK_CHARS) {
      const idx = chunks.length;
      chunks.push({
        id: generateChunkId(sourceUrl, idx),
        source_url: sourceUrl,
        source_name: sourceName,
        chunk_index: idx,
        content: section.trim(),
      });
    } else {
      // 超長 section 按段落進一步切
      const paragraphs = section.split(/\n\n+/).filter(p => p.trim().length > 0);
      let buffer = '';

      for (const para of paragraphs) {
        if (buffer.length + para.length + 2 > MAX_CHUNK_CHARS && buffer.length > 0) {
          const idx = chunks.length;
          chunks.push({
            id: generateChunkId(sourceUrl, idx),
            source_url: sourceUrl,
            source_name: sourceName,
            chunk_index: idx,
            content: buffer.trim(),
          });
          buffer = '';
        }
        buffer += (buffer ? '\n\n' : '') + para;
      }

      if (buffer.trim().length > 0) {
        const idx = chunks.length;
        chunks.push({
          id: generateChunkId(sourceUrl, idx),
          source_url: sourceUrl,
          source_name: sourceName,
          chunk_index: idx,
          content: buffer.trim(),
        });
      }
    }
  }

  return chunks;
}
```

- [ ] **Step 2: 手動驗證 chunker（Node.js script）**

```bash
node --input-type=module <<'EOF'
import { chunkMarkdown } from './src/lib/crawl/chunker.ts'
// 無法直接跑 TypeScript，用 tsx
EOF
```

改用 tsx：

```bash
tsx -e "
import { chunkMarkdown } from './src/lib/crawl/chunker.ts'
const chunks = chunkMarkdown('## Hello\n\nWorld\n\n## Section 2\n\nContent here.', 'https://example.com', 'Test')
console.log('chunks:', chunks.length)
chunks.forEach(c => console.log(c.chunk_index, c.content.slice(0, 50)))
"
```

Expected: 2 chunks，各對應一個標題 section

- [ ] **Step 3: 型別檢查**

```bash
npx astro check
```

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/crawl/chunker.ts
git commit -m "feat: add markdown chunker (split by heading sections)"
```

---

### Task 4: Sync Orchestrator

**Files:**
- Create: `src/lib/crawl/sync.ts`

主流程：對每個 target 呼叫 crawl → chunk → upsert D1。

- [ ] **Step 1: 寫 sync.ts**

```typescript
// src/lib/crawl/sync.ts

import { env } from 'cloudflare:workers';
import { CRAWL_TARGETS } from './config';
import { crawlTarget } from './browser-rendering';
import { chunkMarkdown, type DocChunk } from './chunker';

function getDB(): D1Database {
  return (env as unknown as { DB: D1Database }).DB;
}

function getEnvVars(): { accountId: string; apiToken: string } {
  const e = env as unknown as { CF_ACCOUNT_ID?: string; CF_API_TOKEN?: string };
  if (!e.CF_ACCOUNT_ID) throw new Error('CF_ACCOUNT_ID secret not set');
  if (!e.CF_API_TOKEN) throw new Error('CF_API_TOKEN secret not set');
  return { accountId: e.CF_ACCOUNT_ID, apiToken: e.CF_API_TOKEN };
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

async function upsertChunks(db: D1Database, chunks: DocChunk[]): Promise<void> {
  const stmt = db.prepare(
    `INSERT INTO doc_chunks (id, source_url, source_name, chunk_index, content)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       content = excluded.content,
       source_name = excluded.source_name,
       updated_at = datetime('now')`
  );

  const batches = chunkArray(chunks, 100);
  for (const batch of batches) {
    await db.batch(batch.map(c =>
      stmt.bind(c.id, c.source_url, c.source_name, c.chunk_index, c.content)
    ));
  }
}

export interface SyncResult {
  target: string;
  pages: number;
  chunks: number;
  error?: string;
}

export async function runCrawlSync(): Promise<SyncResult[]> {
  const db = getDB();
  const { accountId, apiToken } = getEnvVars();
  const results: SyncResult[] = [];

  for (const target of CRAWL_TARGETS) {
    try {
      console.log(`[crawl] Starting: ${target.name} (${target.url})`);

      const pages = await crawlTarget(target, accountId, apiToken);
      console.log(`[crawl] Got ${pages.length} pages from ${target.name}`);

      const allChunks: DocChunk[] = [];
      for (const page of pages) {
        const chunks = chunkMarkdown(page.markdown, page.url, target.name);
        allChunks.push(...chunks);
      }

      await upsertChunks(db, allChunks);
      console.log(`[crawl] Upserted ${allChunks.length} chunks for ${target.name}`);

      results.push({ target: target.name, pages: pages.length, chunks: allChunks.length });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[crawl] Error for ${target.name}:`, message);
      results.push({ target: target.name, pages: 0, chunks: 0, error: message });
    }
  }

  return results;
}
```

- [ ] **Step 2: 型別檢查**

```bash
npx astro check
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/crawl/sync.ts
git commit -m "feat: add crawl sync orchestrator (crawl → chunk → D1 upsert)"
```

---

## Chunk 2: API Endpoint + Cron

### Task 5: POST /api/crawl/sync Endpoint

**Files:**
- Create: `src/pages/api/crawl/sync.ts`

受 `CRAWL_SECRET` header 保護的手動觸發 endpoint。

- [ ] **Step 1: 寫 sync endpoint**

```typescript
// src/pages/api/crawl/sync.ts
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { runCrawlSync } from '../../../lib/crawl/sync';

export const POST: APIRoute = async ({ request }) => {
  // 驗證 secret
  const secret = (env as unknown as { CRAWL_SECRET?: string }).CRAWL_SECRET;
  if (!secret) {
    return new Response(JSON.stringify({ error: 'CRAWL_SECRET not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const provided = request.headers.get('X-Crawl-Secret');
  if (provided !== secret) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const results = await runCrawlSync();
    const totalChunks = results.reduce((sum, r) => sum + r.chunks, 0);
    const errors = results.filter(r => r.error);

    return new Response(
      JSON.stringify({ ok: true, results, totalChunks, errors: errors.length }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
```

- [ ] **Step 2: 型別檢查**

```bash
npx astro check
```

Expected: No errors

- [ ] **Step 3: Build 驗證**

```bash
pnpm build
```

Expected: Build success，`dist/` 正常產生

- [ ] **Step 4: Commit**

```bash
git add src/pages/api/crawl/sync.ts
git commit -m "feat: add POST /api/crawl/sync endpoint with secret auth"
```

---

### Task 6: Cron Trigger + Post-Build Worker Wrapper

讓 Cloudflare Cron Trigger 每週自動呼叫 crawl sync。

策略：post-build 腳本產生 `dist/cron-entry.js`，re-export Astro worker 的 fetch handler 並加入 `scheduled` handler。`wrangler.jsonc` 改用 `main: dist/cron-entry.js`。

**Files:**
- Create: `scripts/create-cron-entry.mjs`
- Modify: `wrangler.jsonc`
- Modify: `package.json`

- [ ] **Step 1: 寫 create-cron-entry.mjs**

```javascript
// scripts/create-cron-entry.mjs
// post-build：產生 dist/cron-entry.js，讓 wrangler 用這個 entry，
// 同時保留 Astro 的 fetch handler 並加入 scheduled handler

import { writeFileSync, existsSync } from 'node:fs'

const ASTRO_WORKER = './dist/_worker.js/index.js'
const OUTPUT = './dist/cron-entry.js'

if (!existsSync(ASTRO_WORKER)) {
  console.error('Astro worker not found. Run astro build first.')
  process.exit(1)
}

const content = `
// Auto-generated by scripts/create-cron-entry.mjs
// Do not edit manually.
import astroWorker from './_worker.js/index.js';

export default {
  // 保留 Astro 的所有 handlers
  ...astroWorker,

  // 加入 Cron scheduled handler
  async scheduled(event, env, ctx) {
    const secret = env.CRAWL_SECRET
    if (!secret) {
      console.error('[cron] CRAWL_SECRET not set, skipping crawl sync')
      return
    }

    console.log('[cron] Triggering crawl sync...')
    ctx.waitUntil(
      fetch('https://quidproquo.cc/api/crawl/sync', {
        method: 'POST',
        headers: {
          'X-Crawl-Secret': secret,
          'Content-Type': 'application/json',
        },
      }).then(async (res) => {
        const body = await res.json()
        console.log('[cron] Crawl sync result:', res.status, JSON.stringify(body))
      }).catch((err) => {
        console.error('[cron] Crawl sync failed:', err)
      })
    )
  },
}
`.trimStart()

writeFileSync(OUTPUT, content)
console.log('✅ Created', OUTPUT)
```

- [ ] **Step 2: 更新 wrangler.jsonc（加入 main + cron triggers）**

```jsonc
{
  "name": "quidproquo",
  "account_id": "1ff43f0d4c3ad3bd98ce5ab767546a68",
  "main": "./dist/cron-entry.js",
  "compatibility_date": "2026-03-10",
  "routes": [
    { "pattern": "quidproquo.cc", "custom_domain": true },
    { "pattern": "www.quidproquo.cc", "custom_domain": true }
  ],
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "binding": "ASSETS",
    "directory": "./dist"
  },
  "triggers": {
    "crons": ["0 2 * * 0"]
  },
  "kv_namespaces": [{
    "binding": "SESSION",
    "id": "98171882182147d0b340b0b127c1e1cd"
  }],
  "d1_databases": [{
    "binding": "DB",
    "database_name": "quidproquo-db",
    "database_id": "c6ae78f5-3d07-44b9-854d-eb439c6902b1"
  }],
  "vectorize": [{
    "binding": "VECTORIZE_INDEX",
    "index_name": "quidproquo-embeddings"
  }],
  "ai": {
    "binding": "AI"
  },
  "r2_buckets": [{
    "binding": "R2_IMAGES",
    "bucket_name": "quidproquo-images"
  }]
}
```

Cron 設定：每週日 UTC 02:00（台灣時間週日上午 10:00）執行。

- [ ] **Step 3: 更新 package.json build + deploy scripts**

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build && node scripts/create-cron-entry.mjs",
  "preview": "astro preview",
  "astro": "astro",
  "lint": "oxlint src/",
  "deploy": "pnpm build && wrangler deploy",
  "sync": "tsx scripts/sync-to-d1.ts",
  "sync:prod": "tsx scripts/sync-to-d1.ts --prod"
}
```

- [ ] **Step 4: Build 驗證**

```bash
pnpm build
```

Expected:
```
▶ Building client and server...
...（Astro build output）...
✅ Created ./dist/cron-entry.js
```

- [ ] **Step 5: 確認 cron-entry.js 內容正確**

```bash
head -5 dist/cron-entry.js
```

Expected: 看到 `import astroWorker from './_worker.js/index.js'`

- [ ] **Step 6: Commit**

```bash
git add scripts/create-cron-entry.mjs wrangler.jsonc package.json
git commit -m "feat: add Cron Trigger with post-build worker wrapper (weekly crawl sync)"
```

---

## Chunk 3: Secrets 設定 + 端對端測試

### Task 7: 設定 Worker Secrets

**注意：** Secrets 不進 git，用 wrangler secret 指令設定。

- [ ] **Step 1: 設定三個必要 secrets**

```bash
# Cloudflare API Token（需要 Browser Rendering 權限）
wrangler secret put CF_API_TOKEN

# Cloudflare Account ID（在 Cloudflare dashboard 右上角可找到）
wrangler secret put CF_ACCOUNT_ID

# Crawl endpoint 保護用的隨機 secret
wrangler secret put CRAWL_SECRET
```

每個指令會提示輸入值（不會顯示在螢幕上）。

`CF_API_TOKEN` 需要有 `Account > Browser Rendering > Edit` 權限。

- [ ] **Step 2: 確認 secrets 列表**

```bash
wrangler secret list
```

Expected: 看到 `CF_API_TOKEN`、`CF_ACCOUNT_ID`、`CRAWL_SECRET` 三個 secrets

- [ ] **Step 3: 本地開發設定（`.dev.vars`）**

建立 `.dev.vars`（已在 `.gitignore` 不會進 git）：

```bash
cat > .dev.vars << 'EOF'
CF_API_TOKEN=your_token_here
CF_ACCOUNT_ID=1ff43f0d4c3ad3bd98ce5ab767546a68
CRAWL_SECRET=dev-secret-for-local-testing
EOF
```

---

### Task 8: 端對端測試

- [ ] **Step 1: Deploy 到 production**

```bash
pnpm deploy
```

Expected: 部署成功，看到 cron trigger 被設定：
```
✅ Uploaded quidproquo
▶ Adding cron trigger: 0 2 * * 0
```

- [ ] **Step 2: 手動觸發 crawl sync（先測單一 target）**

暫時把 `config.ts` 的 CRAWL_TARGETS 只保留一個（例如 Cloudflare D1）再 deploy，然後測試：

```bash
curl -X POST https://quidproquo.cc/api/crawl/sync \
  -H "X-Crawl-Secret: <your-crawl-secret>" \
  -H "Content-Type: application/json"
```

Expected（約 10-30 秒後回應）：
```json
{
  "ok": true,
  "results": [
    { "target": "Cloudflare D1", "pages": 45, "chunks": 312 }
  ],
  "totalChunks": 312,
  "errors": 0
}
```

- [ ] **Step 3: 驗證 D1 資料寫入**

```bash
wrangler d1 execute quidproquo-db --remote \
  --command="SELECT source_name, COUNT(*) as chunks FROM doc_chunks GROUP BY source_name"
```

Expected: 看到 `Cloudflare D1 | 312`（數字會不同）

- [ ] **Step 4: 測試未授權請求**

```bash
curl -X POST https://quidproquo.cc/api/crawl/sync \
  -H "X-Crawl-Secret: wrong-secret"
```

Expected: `{"error":"Unauthorized"}` + HTTP 401

- [ ] **Step 5: 恢復完整 CRAWL_TARGETS 並 deploy**

把 `config.ts` 改回所有 targets，再次 `pnpm deploy`。

- [ ] **Step 6: Commit 最終狀態**

```bash
git add -A
git commit -m "chore: complete Phase 3 crawler integration"
```

---

## 交付物確認

- [ ] POST `/api/crawl/sync` 可手動觸發爬蟲，受 secret 保護
- [ ] 爬取 Cloudflare D1、Workers、Vectorize、Astro Docs
- [ ] markdown 自動 chunk 並 upsert 到 D1 `doc_chunks`
- [ ] Cron Trigger 每週日 UTC 02:00 自動執行
- [ ] Worker secrets 設定完成（不進 git）

---

## 後續計畫

- **Plan C** (`2026-03-12-rag-system.md`)：Phase 4 — embedding pipeline + `/api/rag/query` + 前端搜尋 UI
