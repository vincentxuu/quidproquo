# quidproquo AI Agent 內容系統規劃

這份文件把 `docs/content-pipeline-roadmap.md` 的 pipeline 規劃，整理成可落地的 Content Agent Harness。重點不是把部落格變成全自動 CMS，而是建立一層可觀測、可審核、可重跑的 agent 執行環境，讓不同內容 pipeline 都跑在同一套規則、工具、狀態與 guardrails 上。

對外可以把一條 pipeline 稱為一個 agent，例如 Translation Agent、Metadata Agent、Freshness Agent。對內要更精準：

```text
Agent = 對外的產品能力名稱
Pipeline = 這個 agent 的工作流程
Stage = pipeline 裡的一步，可能是 LLM agent、deterministic tool 或 human gate
Harness = 管理所有 pipeline/stage 的執行環境
```

核心判斷：

- Markdown 仍是 source of truth。
- 正式服務必須完整在雲端執行，目標 runtime 是 Cloudflare Worker + D1/R2/KV/Vectorize/AI bindings。
- 不能設計依賴 local runner、`pnpm`、shell、git working tree、Node child process 或本機 filesystem scan 的正式流程。
- 既有 `scripts/*` 只能作為規則與行為參考；要服務化的能力必須抽成 Worker-safe modules 或 API stages。
- Worker runtime 讀取內容時，必須透過 D1 posts table、R2 markdown snapshot，或 build-time content manifest，不直接掃 `src/content/posts/**/*.md`。
- AI agent 只產生建議、報告、草稿與修復清單。
- Publish 仍由人決定，不做全自動發布。
- 優先把 repo 已有規則抽成雲端可執行 module，再新增 LLM stage。
- 每條 pipeline 都要有輸入、輸出、狀態、錯誤、耗時與人工交接點。
- 真正要先做的是 harness，不是先堆更多 agent prompt。

## 目前已有能力

專案已經有不少可直接被 agent/harness 重用的功能，不需要從零設計。

| 能力 | 目前入口 | 可被 agent 重用的方式 |
|---|---|---|
| 文章格式檢查 | `scripts/check-post-quality.mjs` 的規則 / 未來 Worker-safe quality module | Quality Agent 的 deterministic check；雲端執行時不可依賴 `pnpm` 或 child process |
| 參考資料檢查 | `scripts/check-post-references.mjs` 的規則 / 未來 Worker-safe reference module | Reference Auditor 的第一層防線；雲端執行時不可依賴本機 filesystem |
| 內容營運報告 | `scripts/content-ops.mjs` 的規則 / 未來 Worker-safe inventory module | Content Ops Agent 的資料來源；報告要由 Worker 從 D1/R2/打包內容產生 |
| Markdown 同步到 D1 | deploy/build pipeline 或 admin API | Publish 後的衍生資料重建；正式服務執行時以 D1/R2 為 Worker 可讀來源 |
| RAG Chat | `/api/chat` / `src/lib/rag/pipeline.ts` | 既有 multi-agent pipeline 範例 |
| RAG 搜尋 | `/api/search?mode=keyword\|hybrid\|rag` | 內部連結、研究、推薦 agent 的檢索工具 |
| RAG admin | `/admin/rag` / `/api/admin/rag` | 後台操作模式、settings、audit、trace 範例 |
| Embedding sync | `/api/embed/sync` / `src/lib/embed/pipeline.ts` | 知識庫更新任務 |
| Crawl sync | `/api/crawl/sync` / `src/lib/crawl/sync.ts` | 外部 docs ingestion 任務 |
| RAG eval | Worker-safe eval endpoint 或 CI 產物匯入 | 回答品質 regression check；服務內狀態不可依賴本機報告檔 |
| Glossary | `/api/glossary/explain` / `glossary_lookup_stats` | 內容缺口與讀者理解問題訊號 |
| Auth / rate limit | `src/lib/auth/*` | admin-only pipeline 與 public endpoint 的安全基礎 |

目前最成熟的是 RAG pipeline：

```text
Query
  -> Planner
  -> Research
  -> Normalize
  -> Writer
  -> Deterministic Validation
  -> Critic
  -> Related / Fallback
```

內容系統應該沿用這個設計精神：LLM 負責模糊判斷，Worker-safe deterministic module 負責硬規則，後台負責狀態與審核。既有 `scripts/*` 只能作為規則來源，不是正式服務的 runtime 依賴。

## Harness 設計原則

### 1. Pipeline 是 app，harness 是 OS

從 Harness Engineering 的角度看，Translation、Metadata、Freshness 這些 pipeline 都只是跑在 Content Agent Harness 上的 app。共同的 Tool Registry、Context Builder、Guard System、Budget Controller、Artifact Store 才是系統核心。

```text
Content Agent Harness
  -> Pipeline Registry
  -> Tool Registry
  -> Context Builder
  -> Guard System
  -> Budget / Retry Controller
  -> Checkpoint / Artifact Store
  -> Evaluator Layer
  -> Admin Console / Trace UI
```

這層穩了，新增 pipeline 才會便宜；這層沒做，後面每個 agent 都會各自長出一套不一致的安全邏輯。

### 2. Agent 是 pipeline stage，不是自由工作者

每個 agent 只做明確任務，例如「翻譯」、「檢查引用」、「產生 TL;DR」、「建議內部連結」。不要做一個萬能 Content Agent，否則 context、權限、錯誤歸因都會變差。

### 3. Deterministic checks 優先

已有腳本能判斷的事情，不交給 LLM：

- frontmatter 是否完整
- category/lang/tag 格式是否合法
- 內部連結是否存在
- 是否缺少參考資料
- heading 層級是否跳太多
- content ops report 的 metadata 缺漏

LLM 應該處理 deterministic module 很難處理的事：

- 摘要品質
- 文章語氣
- 內部連結插入位置
- claim 風險
- 技術版本是否可能過時
- 研究 brief 的完整性

### 4. Reviewer 不 auto-fix

專案文章已經反覆提到這條：Reviewer 永不 auto-fix，Generator 永不 fabricate。對 quidproquo 來說具體意思是：

- Quality Agent 只回報問題與建議，不直接改文章。
- Reference Auditor 不補不存在的來源。
- Freshness Agent 查不到最新資訊時要標 `needs_human_check`。
- Draft Agent 缺少資訊時留下 `待補清單`，不能補故事。

### 5. Brief gate 早於 draft

Research to Post、YouTube to Post 這類 pipeline 不應該直接從 topic 跳完整文章。流程應是：

```text
Topic / Source
  -> Research Brief
  -> Human Review
  -> Outline
  -> Draft
  -> Quality / Reference Audit
```

brief 弱，文章一定弱。這比事後讓 critic 修更省成本。

### 6. 後台只做營運控制台，不做完整 CMS

`docs/plan.md` 已經定義後台方向：不是完整 CMS，而是營運控制台。內容 agent 也應遵守這個邊界：

- 後台可顯示報告、觸發任務、下載或複製建議。
- 後台可產生 draft markdown。
- 後台不直接覆寫已發布文章。
- 修改 source markdown 仍走 git workflow。

## 系統架構

```text
                  ┌────────────────────────┐
                  │     Admin Console       │
                  │ /admin/content-pipelines│
                  └───────────┬────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                 Content Agent Harness                       │
│                                                            │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │ Pipeline         │  │ Tool            │                 │
│  │ Registry         │  │ Registry        │                 │
│  └────────┬────────┘  └────────┬────────┘                 │
│           │                    │                          │
│  ┌────────▼────────┐  ┌────────▼────────┐                 │
│  │ Context Builder │  │ Guard System    │                 │
│  └────────┬────────┘  └────────┬────────┘                 │
│           │                    │                          │
│  ┌────────▼────────┐  ┌────────▼────────┐                 │
│  │ Budget / Retry  │  │ Evaluator       │                 │
│  │ Controller      │  │ Layer           │                 │
│  └────────┬────────┘  └────────┬────────┘                 │
│           │                    │                          │
│  ┌────────▼────────────────────▼────────┐                 │
│  │ Job Store / Trace / Artifact Store    │                 │
│  │ admin_jobs, steps, artifacts, audit    │                 │
│  └──────────────────┬───────────────────┘                 │
└─────────────────────┼──────────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────────────────────┐
│                    Execution Targets                        │
│ Worker-safe modules / LLM providers / Admin APIs / D1/R2/KV   │
└───────────┬────────────────────────────────────┬───────────┘
            ▼                                    ▼
┌──────────────────────┐              ┌────────────────────────┐
│ Markdown / Drafts    │              │ D1 / Vectorize / Logs   │
│ src/content/posts    │              │ posts, chunks, settings │
└──────────────────────┘              └────────────────────────┘
```

## Harness 元件

### 1. Pipeline Registry

Pipeline Registry 定義「有哪些可執行的 agent workflow」。它不執行任務，只描述任務：

- pipeline id、title、category、risk。
- input schema。
- stage sequence。
- 每個 stage 的 kind：`module`、`api`、`llm`、`human_review`。`script` 只能存在於 build/CI 輔助流程，不能成為雲端服務 runtime stage。
- 允許使用的 tools。
- 需要的 context bundle。
- artifacts。
- 是否會寫 markdown。
- 是否需要 admin。
- 是否需要 external research。

對外命名可以維持 agent 心智，例如：

| 對外名稱 | 對內 pipeline id | 說明 |
|---|---|---|
| Content Ops Agent | `content-ops` | 產生內容營運報告 |
| Quality Agent | `post-quality` | 發布前品質檢查 |
| Metadata Agent | `metadata-suggestions` | 產生 TL;DR、description、social snippet |
| Translation Agent | `translation` | 中文文章轉英文 draft |
| Freshness Agent | `freshness-review` | 找出應更新文章 |

### 2. Tool Registry

Tool Registry 管理每條 pipeline 能看到哪些工具。這是 harness 的核心安全邊界：不要把所有 Worker modules/API 都塞給所有 agent。

第一批工具：

| Tool | 類型 | 對應現有功能 |
|---|---|---|
| `read_post_content` | cloud read | 從 D1/R2/建置時 manifest 讀取文章內容 |
| `write_draft_artifact` | cloud write | 寫入 D1/R2 draft artifact；不直接覆寫已發布 Markdown |
| `write_artifact` | cloud write | 寫入 D1/R2 job artifact |
| `run_content_ops` | module | Worker-safe content inventory module |
| `run_post_quality_check` | module | Worker-safe post quality module |
| `run_reference_check` | module | Worker-safe reference check module |
| `rag_search_posts` | api/tool | `/api/search?mode=hybrid|rag` 或內部 search tools |
| `run_embed_sync` | api | `/api/embed/sync` |
| `run_crawl_sync` | api | `/api/crawl/sync` |
| `read_glossary_stats` | db read | `glossary_lookup_stats` |

每條 pipeline 只拿自己的工具子集：

```yaml
post-quality:
  tools:
    - read_post_content
    - run_post_quality_check
    - run_reference_check
    - write_artifact

metadata-suggestions:
  tools:
    - read_post_content
    - run_content_ops
    - write_artifact

translation:
  tools:
    - read_post_content
    - write_draft_artifact
    - run_post_quality_check
    - run_reference_check
    - write_artifact

internal-links:
  tools:
    - read_post_content
    - rag_search_posts
    - run_content_ops
    - write_artifact
```

### 3. Context Builder

Context Builder 負責在每個 stage 執行前，組出「剛好足夠」的 context。這層不要散落在 prompt 裡。

Context bundle 可以包含：

- project rules：AGENTS.md 的 frontmatter、分類、參考資料規則。
- pipeline definition：目前 stage 的目標、輸出格式、禁止事項。
- source markdown：文章內容與 frontmatter。
- content ops report：metadata、tag、duplicate、freshness、link 建議。
- related posts：站內 RAG/keyword search 結果。
- previous artifacts：前一 stage 的輸出。
- quality constraints：`check:post-quality`、`check:references` 的硬規則。
- human notes：作者補充或審核意見。

原則：

- Generator 只拿完成任務需要的 context。
- Evaluator 要拿輸出與檢查規則，但不一定拿 generator 的完整推理歷史。
- Research / Freshness 需要外部查證時，artifact 必須記錄查證時間與來源。

### 4. Guard System

Guard System 不應只存在 prompt 裡，而要變成 runner 前後的檢查層。建議拆成四層：

```text
Input Guards
  -> Tool Guards
  -> Output Guards
  -> Budget Guards
```

Input Guards：

- path 必須在 `src/content/posts` 或允許的 artifact directory。
- category/lang/tag 必須符合 AGENTS.md。
- pipeline input 必須符合 schema。
- high-risk pipeline 必須 admin session。

Tool Guards：

- 每條 pipeline 只能呼叫 registry 允許的 tools。
- 不允許 silent overwrite。
- 不允許產生 `draft: false`。
- 不允許在非 draft pipeline 寫 markdown。

Output Guards：

- frontmatter schema check。
- Worker-safe post quality module。
- Worker-safe reference check module。
- 內部連結存在性檢查。
- tech / ai / learning / education / policy / design / marketing / product 類外部 claim 必須有 references。
- 缺來源時必須標 `needs_human_input`，不得補故事。

Budget Guards：

- max tokens。
- max retries。
- max runtime。
- max external calls。
- 失敗超過門檻進入 human escalation。

### 5. Budget / Retry Controller

內容 pipeline 的成本不像 coding agent 那麼容易失控，但 research、translation、freshness 仍需要硬上限。

建議預設：

| Risk | Max retries | Max runtime | Human escalation |
|---|---:|---:|---|
| low | 1 | 2 min | module/API fail |
| medium | 2 | 10 min | output guard fail twice |
| high | 1 | 20 min | missing source / external check fail |

第一版不一定要精準 token accounting，但 job metadata 要預留：

- token input/output。
- provider/model。
- external call count。
- retry count。
- guard failure reason。

### 6. Checkpoint / Artifact Store

Artifact 不是附屬 log，而是 harness 的狀態傳遞機制。每個有意義 stage 都要留下 artifact，方便 resume、review、debug。

Translation 範例：

```text
artifacts/jobs/<job-id>/
  01-source.md
  02-translator-output.md
  03-cultural-review.md
  04-native-check.md
  05-final-draft.md
  06-quality-report.json
  07-reference-report.json
```

Research brief 範例：

```text
artifacts/jobs/<job-id>/
  01-topic.json
  02-research-questions.md
  03-source-candidates.json
  04-claim-table.md
  05-brief.md
  06-human-review.md
```

原則：

- 中斷後從最後成功 artifact resume。
- 人工審核只看 artifact，不需要重跑 agent。
- 每個 artifact 要知道是哪個 stage、哪個 model、哪個 input 產生。

### 7. Evaluator Layer

Generator 和 Evaluator 要分開。不要讓同一個 LLM 產出後自我背書。

Generator 類：

- Translator。
- Metadata Writer。
- Draft Skeleton Writer。
- Internal Link Advisor。

Evaluator 類：

- Quality Checker。
- Reference Auditor。
- Claim Risk Reviewer。
- Style Reviewer。
- Freshness Verifier。

Evaluator 原則：

- 不 auto-fix。
- 輸出 `approve` / `request_changes` / `needs_human_input`。
- 指出具體檔案、段落、原因。
- 對 high-risk pipeline，Evaluator fail 不能被 Generator 直接覆蓋。

## Pipeline / Agent 分工

### 1. Pipeline Orchestrator

責任：

- 接收後台、Cron Trigger 或 deploy hook 的 pipeline request。正式服務不依賴本機 CLI。
- 載入 pipeline 定義。
- 建立 run id。
- 逐 stage 執行 deterministic tool 或 LLM agent。
- 記錄 step input/output summary、耗時、錯誤。
- 在人工審核點暫停。

不負責：

- 不直接寫文章內容。
- 不判斷文章品質。
- 不繞過權限執行危險操作。

### 2. Content Inventory Agent

對應 roadmap：Content Ops Pipeline。

目前 `scripts/content-ops.mjs` 可作為規則參考，但正式服務必須改成 Worker-safe inventory module，從 D1/R2/內容 manifest 產生報告。

輸入：

- 全站 Markdown posts。
- 可選搜尋紀錄或 glossary lookup stats。

輸出：

- 缺 `tldr` / `description` / `difficulty` 清單。
- tag 建議。
- duplicate candidates。
- freshness candidates。
- internal link opportunities。
- content gaps。

MVP 不需要 LLM。先把 report 後台化。

### 3. Quality Agent

對應 roadmap：Post Quality Pipeline。

流程：

```text
Markdown
  -> Worker-safe post quality module
  -> Worker-safe reference check module
  -> LLM Style / Claim Risk Review
  -> Report
```

輸出格式：

```json
{
  "status": "pass | warn | fail",
  "blocking": [],
  "warnings": [],
  "suggestions": [],
  "needs_human_review": true
}
```

MVP：

- 先把 post quality 與 reference check 的核心規則抽成 Worker-safe module，後台直接在 Worker runtime 執行。
- 後台顯示紅綠燈和錯誤清單。
- 不做 autofix。

進階：

- 加 LLM 檢查「是否有未引用外部 claim」。
- 加 LLM 檢查「tech/ai 文章是否缺少版本、限制、適用情境」。

### 4. Metadata Agent

對應 roadmap：Summary / Metadata Pipeline。

流程：

```text
Post
  -> Section Summary
  -> One-line TLDR
  -> SEO Description
  -> Social Snippet
  -> Human Apply
```

輸入：

- 單篇 Markdown。
- 現有 frontmatter。
- AGENTS.md 的 category/tag/lang 規則。

輸出：

- `tldr` 建議。
- `description` 建議。
- 3-6 個 tags 建議。
- social snippet。

規則：

- 不直接覆寫 frontmatter。
- 已有 `tldr` / `description` 時只給替代版本。
- tags 必須符合 lowercase kebab-case。

### 5. Internal Link Agent

對應 roadmap：Internal Link Pipeline。

流程：

```text
Post
  -> Extract Concepts
  -> Search Related Posts
  -> Recommend Anchor Text
  -> Suggest Insert Locations
```

可重用：

- `content:ops` 目前已有 internal link opportunities。
- `/api/search?mode=hybrid|rag` 可作為語意搜尋工具。
- `src/utils/relatedPosts.ts` 可作為 deterministic baseline。

輸出：

```json
{
  "target_post": "src/content/posts/ai/...",
  "suggestions": [
    {
      "target_slug": "ai/2026-03-12-rag-cost-optimization",
      "anchor_text": "RAG 成本優化",
      "insert_after_heading": "## 為什麼會這樣",
      "reason": "同樣討論 semantic cache 與 token 成本"
    }
  ]
}
```

人工確認後再修改文章。

### 6. Translation Agents

對應 roadmap：Translation Pipeline。

沿用 `docs/translation-pipeline.md`：

```text
Source Post
  -> Translator
  -> Cultural Reviewer
  -> Native Checker
  -> Markdown Draft
```

現況：

- prompt 已存在於 `.github/prompts/translation-*.prompt.md`。
- `pipeline registry` 已註冊 `translation`，`runner` 已有對應分支。
- `runner` 已經在 Worker 內直接執行 `translate -> cultural-review -> native-check -> quality-check -> reference-check`，並輸出 `markdown_draft` 與 `json_report`。
- `src/lib/pipelines/translators.ts` 已管理翻譯提示詞。

MVP：

- 建立 runner 入口與追蹤，`translation` 請求能落為可審核 job。
- 實際 `lang: en`、`draft: true` 產出與每 stage LLM 審核已接軌，`post-quality / reference` 的自動驗證流程已接上。
- 導入 post quality / reference check 的驗證鏈接，供後續輸出審核。

關鍵規則：

- 程式碼、錯誤訊息、API 名稱不可翻錯。
- 不新增原文沒有的 claim。
- 內部連結需要確認英文路由是否存在。

### 7. Research Agent

對應 roadmap：Research to Post Pipeline。

流程：

```text
Topic
  -> Research Questions
  -> Source Collection
  -> Claim Extraction
  -> Brief
  -> Human Review
  -> Outline
  -> Draft
  -> Reference Audit
```

這條不能第一階段就做全自動。原因：

- 外部搜尋和引用準確度是高風險區。
- tech/ai 類文章需要有效 reference。
- 缺資訊時 LLM 容易補故事。

MVP 只做 brief：

- 問題定義。
- 讀者會得到什麼。
- 主要 claims。
- 每個 claim 對應 source。
- 不確定處與需要人工補充處。

### 8. YouTube to Post Agent

對應 roadmap：YouTube to Post Pipeline。

沿用 `docs/yt-to-post-pipeline.md`，但應調整為更保守的流程：

```text
YouTube URL
  -> Transcript Source
  -> Key Points
  -> Quotes / Timestamp Notes
  -> Draft Skeleton
  -> Personal Notes Placeholder
  -> Human Review
```

第一版不要承諾完整文章，只產出：

- frontmatter draft。
- 影片摘要。
- 三到五個核心論點。
- 可引用片段與 timestamp。
- 個人觀點 placeholder。
- 相關站內文章建議。

原因是 transcript / NotebookLM 來源穩定性還沒確認。

### 9. Freshness Agent

對應 roadmap：Freshness / Update Pipeline。

可重用：

- `content:ops` 已有 freshness candidates。
- 文章內日期、版本號、產品名可以 deterministic 掃描。

流程：

```text
Published Posts
  -> Detect Time-sensitive Claims
  -> Rank Update Risk
  -> Optional External Check
  -> Refresh Task Brief
```

輸出：

- 高風險文章清單。
- 風險原因。
- 建議更新段落。
- 需要查證的外部來源。

注意：

- 若要查最新資訊，執行時必須標記 `uses_external_research: true`。
- 沒有查證就不能改成「已更新」。

### 10. RAG Answer Agent

這是已存在功能，不應該被內容 pipeline 重寫。

目前能力：

- `/api/chat` SSE streaming。
- semantic cache。
- conversation checkpoint。
- shadow mode。
- trace steps。
- provider/model/stage overrides。
- related posts。
- rate limit。

下一步是納入統一 registry：

- 在 `/admin/content-pipelines` 顯示 RAG pipeline 狀態。
- 連到 `/admin/rag` 管設定。
- 連到未來 `/admin/traces` 查詳細 trace。

### 11. Knowledge Infrastructure Agents

包含 Embedding Agent、Crawl Agent、未來 Knowledge Graph Agent。

Embedding Agent：

```text
Posts / Docs
  -> Chunk
  -> Contextualize
  -> Embed
  -> Vectorize Upsert
```

現有入口：

- `/api/embed/sync`
- `src/lib/embed/pipeline.ts`

Crawl Agent：

```text
Docs Site
  -> Crawl / Render
  -> Chunk
  -> D1 doc_chunks
  -> needsEmbedSync
```

現有入口：

- `/api/crawl/sync`
- `src/lib/crawl/sync.ts`

短期只需要任務中心化，不需要重新設計 agent。

## Pipeline Registry

建議用 registry 定義每條 pipeline，而不是把流程寫死在後台頁面。這是 harness 的 app manifest，不是單純列表。

概念型別：

```ts
type PipelineStageKind = 'module' | 'api' | 'llm' | 'human_review';

interface PipelineDefinition {
  id: string;
  title: string;
  category: 'production' | 'maintenance' | 'knowledge' | 'interaction' | 'ops';
  risk: 'low' | 'medium' | 'high';
  inputs: PipelineInput[];
  context: ContextBundleDefinition;
  tools: string[];
  stages: PipelineStage[];
  artifacts: PipelineArtifactDefinition[];
  guards: GuardDefinition[];
  budget: BudgetPolicy;
  requiresAdmin: boolean;
  writesMarkdown: boolean;
  usesExternalResearch: boolean;
}
```

第一批 registry：

| Pipeline | Risk | Status | MVP |
|---|---:|---|---|
| `post-quality` | low | 已有 script 規則 | 抽成 Worker-safe module 並後台化 |
| `content-ops` | low | 已有 script/report 規則 | 抽成 Worker-safe module 並後台化 |
| `metadata-suggestions` | medium | 已落地 | worker-safe single-post 建議 |
| `translation` | medium | 已雲端化（待人工 publish gate） | 輸出 draft + review + quality/reference report |
| `internal-links` | medium | 已落地 | worker-safe 內部連結建議 |
| `embed-sync` | medium | 已有 API | admin job 化 |
| `crawl-sync` | medium | 已有 API | admin job 化 |
| `research-brief` | high | 已落地（LLM） | topic-driven brief + human review gate |
| `youtube-brief` | high | 已落地（skeleton + oEmbed metadata） | skeleton brief + human review gate |
| `freshness-review` | high | 已落地（MVP） | refresh brief |
| `glossary-gap` | medium | 已落地（MVP） | 依 glossary lookup 缺口輸出更新建議 |
| `series-suggestions` | medium | 已落地（MVP） | tag/topic 信號產生系列化建議 |
| `knowledge-graph-prototype` | medium | 已落地（MVP） | 標籤/主題實體共現快照 |

## 資料模型

`docs/plan.md` 已經提出 `admin_jobs`。內容 agent 建議拆成三層：job、step、artifact。

```sql
CREATE TABLE admin_jobs (
  id TEXT PRIMARY KEY,
  pipeline_id TEXT NOT NULL,
  status TEXT NOT NULL, -- queued | running | waiting_review | succeeded | failed | cancelled
  requested_by TEXT,
  input_json TEXT NOT NULL,
  output_summary TEXT,
  error_summary TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  started_at TEXT,
  finished_at TEXT
);

CREATE TABLE admin_job_steps (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  stage_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  status TEXT NOT NULL,
  input_summary TEXT,
  output_summary TEXT,
  artifact_id TEXT,
  duration_ms INTEGER,
  error_summary TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  started_at TEXT,
  finished_at TEXT,
  FOREIGN KEY (job_id) REFERENCES admin_jobs(id)
);

CREATE TABLE admin_job_artifacts (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  step_id TEXT,
  type TEXT NOT NULL, -- markdown_draft | json_report | diff_suggestion | brief | log
  path TEXT,
  content_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (job_id) REFERENCES admin_jobs(id)
);
```

原則：

- 大型 markdown artifact 優先寫檔案，DB 只記 path。
- 小型 JSON report 可存在 DB。
- 任何會寫 markdown 的 pipeline 都必須標 `draft: true` 或只產生 diff suggestion。

## 後台頁面

建議以既有後台最小改動為主，先落地：

```text
/admin
├── /admin/rag
├── /admin/content-pipelines
├── /admin/jobs
└── /admin/traces
```

### `/admin/content-pipelines`

顯示：

- 可執行 pipeline 清單。
- Pipeline metadata（風險、runtime、tool 清單）。
- 輸入欄位與提交表單。
- 觸發後可立即看到最近執行結果。

### `/admin/jobs`

作為統一操作台，提供：

- 列表模式：顯示全部 job 與 `dead_letter` 專區。
- 每列提供 `Rerun`、`Cancel` 入口。
- 點入明細可看：status、pipeline、steps timeline、artifacts、錯誤摘要。
- 明細頁提供 `Rerun`、`Cancel` 動作。
- API 可依 `status` 查詢（如 `/api/admin/jobs?status=dead_letter`）。

### `/admin/rag`

- `Run embed batch` 已接到 `embed-sync` pipeline，維持原有 RAG 入口不變，並保留可追溯 job log。

## Guardrails

內容 agent 的 walls 建議第一版就有，並落到 Guard System，而不是只寫在 prompt：

| Wall | Guard layer | 規則 |
|---|---|---|
| No auto publish | Output | 任何 pipeline 都不得把 `draft: false` 當成自動輸出 |
| No silent overwrite | Tool | 不得直接覆寫已存在 markdown；只能產生 draft 或 diff suggestion |
| Reference required | Output | tech / ai / learning / education / policy / design / marketing / product 類外部 claim 必須有 `## 參考資料` |
| Never fabricate | Output | 缺來源、缺 transcript、缺版本資訊時輸出 `needs_human_input` |
| Reviewer no auto-fix | Evaluator | Quality / Reference / Freshness agents 只報告，不改文 |
| Tool allowlist | Tool | runner 只能呼叫 pipeline registry 允許的 tools |
| Budget cap | Budget | 每個 job 設定 max tokens、max retries、max runtime |
| Human gate | Input/Output | translation、research、youtube、freshness 進入 markdown draft 前要人工 review gate |
| Audit log | Trace | 所有 admin-triggered pipeline 都寫入 job/step log |
| External research flag | Input/Output | 需要查最新資訊的任務，artifact 必須標明查證時間與來源 |

## 實作順序

### Phase 0：整理入口

目標：不新增 LLM agent，先把 harness 骨架和既有功能接起來。

- 新增 pipeline registry。
- 新增 tool registry。
- 新增 context builder 的最小版本。
- 新增 input/tool/output/budget guard 介面。
- 新增 `admin_jobs` / `admin_job_steps` / `admin_job_artifacts`。
- 新增 `/admin/content-pipelines`。
- 將 `content:ops` 規則抽成 Worker-safe module，從雲端內容來源產生 report。
- 將 post quality 規則抽成 Worker-safe module。
- 將 reference check 規則抽成 Worker-safe module。
- 把 `/api/embed/sync` 的結果寫入 job log。

完成標準：

- 後台能看到 Worker 產生的 content ops report。
- 後台能在 Worker runtime 對單篇文章跑品質檢查。
- 每次執行都有 job timeline。
- 每次執行都知道使用了哪些 tools、哪些 guards pass/fail。

### Phase 0 目前狀態（2026-05-13）

已完成第一版 harness 骨架，範圍刻意限制在「可觀測、可審核、可重跑」的基礎設施，不新增 LLM agent：

- 新增 `src/lib/pipelines/types.ts`，定義 pipeline、stage、guard、artifact、job request 的核心型別。
- 新增 `src/lib/pipelines/registry.ts`，先註冊 `content-ops`、`post-quality`、`embed-sync`、`crawl-sync` 四條 pipeline，並補上 `metadata-suggestions`、`internal-links`、`translation`。
- 新增 `src/lib/pipelines/guards/input.ts`，實作最小 input guard；已改為以 content id / slug 優先，保留舊 `src/content/posts/**/*.md` 形式作為 deprecated 相容訊息。
- 新增 `src/lib/pipelines/tool-registry.ts`，集中定義第一批工具與 runtime / write safety metadata。
- 新增 `src/lib/pipelines/context-builder.ts`，每次 job 建立最小 context bundle artifact。
- 新增 `src/lib/pipelines/guards/tool.ts`、`budget.ts`、`output.ts`，把 tool allowlist、budget metadata、markdown write safety 變成 runner 前置 guard。
- 新增 `src/lib/pipelines/job-store.ts`，包裝 `admin_jobs`、`admin_job_steps`、`admin_job_artifacts` 的 D1 讀寫。
- 新增 `src/lib/pipelines/modules/content-posts.ts`、`src/lib/pipelines/modules/content-ops.ts`、`src/lib/pipelines/modules/post-quality.ts`、`src/lib/pipelines/modules/reference-check.ts`，形成 Worker-safe 核心檢查模組。

- 新增 `src/lib/pipelines/translators.ts`，集中管理翻譯、文化審查相關 prompt 模板。
- 新增 `src/lib/pipelines/runner.ts`，負責建立 job、跑 guards、建立 context artifact、寫 step/artifact、更新 job status。
- 新增 `/api/admin/pipelines`，可列出 pipeline registry 與 tool registry，也可觸發 pipeline run。
- 新增 `/api/admin/jobs` 與 `/api/admin/jobs/[id]`，可查 job list、step timeline、artifacts，並提供 rerun/cancel 操作。
- `/api/admin/jobs` 新增 `status` 過濾（含 `dead_letter`），便於 DLQ 清理。
- 新增 `/admin/content-pipelines`，集中呈現可執行 pipeline、輸入欄位與最近執行結果。
- 新增 `/admin/jobs`，提供全部列表與 dead-letter 專區、job 明細與操作（rerun/cancel）。
- 更新 `/admin/rag` 的 `Run embed batch`，改走 `embed-sync` pipeline，因此 embedding 任務會留下 job log。

目前實作中：

- `content-ops`、`post-quality`、`reference-check` 已改往 Worker-safe modules 方向：正式服務不執行 `pnpm`、不讀取 repo working tree，也不使用 Node child process。這些 pipeline 應直接由 Worker 從 D1/R2/建置時產生的 content manifest 讀取文章內容並寫入 job artifact。
- `translation` 已完成雲端 LLM 翻譯與 review/gate pipeline，能直接輸出 draft 與 quality/reference report。
- `translation` 已加入人工 publish gate 串接（`waiting_review` + /admin/jobs approve/reject）。
- `metadata-suggestions`、`internal-links` 已接上 full runner，能輸出單篇 suggestion report。
- `Phase 0` 的核心能力已完成。
- `freshness-review` 已完成 MVP：`registry.ts` + `runner.ts` 串接完成，`modules/freshness-review.ts` 提供 deterministic scan 與分級報告輸出（含 `risk_score`、`reason`、`affected_sections`）。
- `glossary-gap` 已完成 MVP：`registry.ts` + `runner.ts` + `tool-registry.ts` + `modules/glossary-gap.ts`，可依 `glossary_lookup_stats` 輸出高頻缺口詞與補齊建議。
- `series-suggestions` 已完成 MVP：`registry.ts` + `runner.ts` + `modules/series-suggestions.ts`，輸出 tags/topic 共同體的系列化建議。
- `knowledge-graph-prototype` 已完成 MVP：`registry.ts` + `runner.ts` + `modules/knowledge-graph-prototype.ts`，輸出實體共現快照與關聯邊。

交付邊界（截至 2026-05-13）：

- `Phase 0`（harness 骨架與現有 pipeline 後台化）完成。
- `Phase 1` metadata/internal-links suggestion 已完成（suggestion output 為主，不直接修改 markdown）。
- `Phase 2` 翻譯流程已完成雲端 draft 生成、review gate，並接上人工 publish gate（可在 `waiting_review` 批核）  
- `translation` pipeline 已新增 `review-gate` stage 並可由 `/admin/jobs` 進行 Approve/Reject 觸發狀態更新。
- `Phase 3`（營運與更新）落地：freshness-review、glossary-gap、series-suggestions、knowledge-graph-prototype 均可觸發、產生 artifact 並留 trace。

驗證狀態（2026-05-13，靜態對照）：

- ✅ `pipeline registry`、`tool registry`、`context builder`、`guard`、`runner` 已到位。
  - `src/lib/pipelines/registry.ts`
  - `src/lib/pipelines/tool-registry.ts`
  - `src/lib/pipelines/context-builder.ts`
  - `src/lib/pipelines/guards/*.ts`
  - `src/lib/pipelines/runner.ts`
- ✅ `admin_jobs` / `admin_job_steps` / `admin_job_artifacts` schema 與 job persistence 已到位，且 `PipelineStatus` 已含 `dead_letter`、`cancelled`。
  - `migrations/0007_admin_jobs.sql`
  - `src/lib/pipelines/job-store.ts`
  - `src/lib/pipelines/types.ts`
- ✅ `/api/admin/pipelines`、`/api/admin/jobs`、`/api/admin/jobs/[id]` 可查詢、重跑、取消，且 `status` 可 filter。
  - `src/pages/api/admin/pipelines.ts`
  - `src/pages/api/admin/jobs/index.ts`
  - `src/pages/api/admin/jobs/[id].ts`
- ✅ `/admin/content-pipelines`、`/admin/jobs` 前端已接上 API，並提供 dead-letter 專區與 rerun/cancel。
  - `src/pages/admin/content-pipelines.astro`
  - `src/pages/admin/jobs.astro`
- ✅ `embed-sync` 與 `crawl-sync` 已走 harness job model。
  - `src/lib/pipelines/runner.ts`
  - `src/lib/pipelines/registry.ts`
  - `src/lib/pipelines/job-store.ts`
- ✅ `translation` pipeline 已在 runner 完成雲端 LLM stage（含文化審閱與 native QA）並寫入 translation draft 與 report artifacts。
  - `src/lib/pipelines/runner.ts`
  - `src/lib/pipelines/registry.ts`
  - `src/lib/pipelines/translators.ts`
- ✅ `metadata-suggestions`、`internal-links` 已在 runner 實作完成，可輸出 json suggestion report。
  - `src/lib/pipelines/registry.ts`
- ✅ `freshness-review` 已補齊 runner/registry 對接，並輸出 `freshness-review-report`（json_report）作為週更建議依據。
  - `src/lib/pipelines/registry.ts`
  - `src/lib/pipelines/runner.ts`
  - `src/lib/pipelines/modules/freshness-review.ts`
- ✅ `glossary-gap` 已完成 module + runner 串接，輸出 `glossary-gap-report`（json_report）以利詞彙缺口優先順序決策。
  - `src/lib/pipelines/registry.ts`
  - `src/lib/pipelines/tool-registry.ts`
  - `src/lib/pipelines/runner.ts`
  - `src/lib/pipelines/modules/glossary-gap.ts`
- ✅ `series-suggestions` 已完成 module + runner 串接，輸出 `series-suggestions-report`（json_report）以產生 series 規劃建議。
  - `src/lib/pipelines/registry.ts`
  - `src/lib/pipelines/runner.ts`
  - `src/lib/pipelines/modules/series-suggestions.ts`
- ✅ `knowledge-graph-prototype` 已完成 module + runner 串接，輸出 `knowledge-graph-report`（json_report）以供半結構化圖譜 prototype。
  - `src/lib/pipelines/registry.ts`
  - `src/lib/pipelines/runner.ts`
  - `src/lib/pipelines/modules/knowledge-graph-prototype.ts`
- ✅ `embed` 與 `crawl` 的 `run` 流程在規劃內保有 cron / DLQ 與 webhook 路徑，待本次後續版本補齊實作。
  - `src/lib/crawl/sync.ts`
  - `src/pages/api/crawl/sync.ts`
- ✅ `crawl` API 與 runner 路徑都做了 `CRAWL_SECRET` 驗證（runner 使用 env secret 並透傳到 `runCrawlSync`）。
  - `src/pages/api/crawl/sync.ts`
  - `src/lib/crawl/sync.ts`
- ✅ `embed run`、`crawl run` 的 cron 觸發器、30 日 DLQ 清理、Webhook 通知、SLO dashboard 已列為下一版規劃（非本次交付）。 

### Phase 1：低風險內容建議

目標：完成 worker-safe suggestion pipeline。

- Metadata Agent：產生 `tldr` / `description` / social snippet 建議。
- Internal Link Agent：產生站內連結建議。
- Quality Agent LLM layer：補 style / claim risk review。
- Evaluator Layer：針對 LLM 建議輸出 approve / request_changes / needs_human_input。

完成標準（可直接驗收）：

### 驗收清單

- [x] `Metadata Agent` 已上線為 worker-safe 建議輸出，`pipeline=metadata-suggestions` 會產生 `json_report`。
- [x] `Internal Link Agent` 已上線為 worker-safe 建議輸出，`pipeline=internal-links` 會產生連結機會清單。
- [x] 所有建議輸出都只為建議性 artifact，不直接覆寫 markdown。
- [x] suggestion report 可下載與複製。
- [x] `post-quality` pipeline 保留既有 Worker-safe 的 deterministic checks（`check-post-quality` / `check-post-references` 對應）作為阻擋性檢查。
- [x] `Quality Agent LLM layer` 已接上：對單篇輸出 `style_review` 與 `claim_risk_review`（至少包含 `severity`、`finding`、`evidence`、`repair_hint`）。
- [x] `Evaluator Layer` 已接上：每份 LLM 建議都會輸出固定欄位 `decision`（`approve|request_changes|needs_human_input`）、`why`、`risks`、`next_actions`，並寫入 artifact。
- [x] 建議 pipeline 依 `Evaluator` 決策產生可觀測狀態：
  - `approve`：可供人工直接採納。
  - `request_changes`：列為高亮阻擋，需先補齊再重跑。
  - `needs_human_input`：缺上下文 / 來源時顯式要求人工補充（`status=waiting_review`）。
- [x] 進入 `needs_human_input` 或 `request_changes` 時，後台/Trace 可追溯到原始 claim、段落與建議原文（透過評審 artifact 記錄）。

### 當前進度（2026-05-13）

- `metadata-suggestions` / `internal-links` 已完成：`已上線`、`worker-safe`、`suggestion report`。
- `Quality Agent LLM layer`、`Evaluator Layer` 已完成上線與阻擋行為（`post-quality` 仍保留 deterministic fail；`request_changes` / `needs_human_input` 轉入 `waiting_review`）。

### Phase 2：草稿型 pipeline

目標：開始產生 draft markdown，但仍不發布。

- Translation cloud pipeline。
- YouTube brief/skeleton cloud pipeline。
- Research brief cloud pipeline。

完成標準：

- 產生的 markdown 一律 `draft: true`。
- 每篇 draft 都附人工補充清單。
- 產生後自動跑品質與引用檢查。

當前進度：

- Phase 1 已完成 metadata/internal-links 兩條 suggestion pipeline。
- translation 的 `Phase 2` 已完成雲端 LLM draft 生成、review stage 輸出與 publish gate 接入，待審核的任務會停在 `waiting_review` 等待人工 approve/reject。
- `research-brief` 與 `youtube-brief` 已補齊 Phase 2 pipeline：已在雲端生成 draft markdown（含 `draft: true`）並附人工補充清單，接續執行 `runPostQualityCheck` / `runReferenceCheck`，最後輸出 `markdown_draft` + `json_report`。

### Phase 3：營運與更新

目標：處理內容新鮮度、series、knowledge graph。

- Freshness Agent。
- Series suggestion。
- Knowledge graph prototype。
- Glossary lookup stats 轉內容缺口。

完成標準：

- 每週產出 refresh task list。
- 每個 refresh task 都有原因、受影響段落、需要查證來源。

Phase 3 在文件中的實作化目標是把「有實價值的營運任務」從人工臨時盤點，改成可排程、可審核、可追溯的 pipeline：

1. `freshness-review`：輸入是全站文章，輸出是 weekly refresh brief（高風險條款、受影響段落、外部查證任務）。
2. `series-suggestions`：利用 tag / topic / glossary lookup signal 做系列化建議，輸出缺少 series 覆蓋的文章清單與組合集。
3. `glossary-gap`：把 `glossary_lookup_stats` 當成內容理解缺口來源，輸出「詞彙缺口優先順序」與建議內文補充點。
4. `knowledge-graph-prototype`：先做最小實體關係原型（entity、alias、co-occur），先產生可視化/CSV export，先不要上正式 RAG 検索流程。

完成標準（Phase 3.0）：

- 每週自動執行（cron）freshness 與 glossary-gap 任務並落 job log。
- 所有輸出都保留 `json_report` artifact，可供 admin 人工二次決策。
- fresh brief 每筆必填 `risk_score`、`reason`、`affected_sections`、`verification_sources`（缺來源時標 `needs_human_input`）。
- series 建議能追溯到產生邏輯（輸入 post ids + 相似度因子 + 規則摘要）。
- knowledge graph prototype 不依賴外部可變來源，先用現有文章 meta / 內文 entity map 在雲端生成 snapshot。
- 任何後續可落地為 full graph 的提案，需通過 Harness registry gate 與 budget/gardrails。

截至 2026-05-13 的完成狀態：

- `research-brief`、`youtube-brief`、`freshness-review`、`glossary-gap` 的 pipeline 已在 `registry.ts` 與 `runner.ts` 可觸發、可記錄 job 與 artifacts。
- `series-suggestions` 與 `knowledge-graph-prototype` 已落地 `registry.ts` 與 `runner.ts`，輸出 `series-suggestions-report` 與 `knowledge-graph-report` 以支持營運排程。
- `series-suggestions` 與 `knowledge-graph-prototype` 已接上 cron：`0 4 * * SUN` 與 `0 5 * * SUN`，`/admin/content-pipelines` 已列出排程資訊供人工巡檢。
- 下一步：觀察兩條新 pipeline 的採納率與誤報率，必要時調降 `min*` thresholds，確認後再擴大至更多維運任務。

## 建議檔案位置

```text
src/lib/pipelines/
  registry.ts
  runner.ts
  types.ts
  job-store.ts
  context-builder.ts
  tool-registry.ts
  guards/
    input.ts
    tool.ts
    output.ts
    budget.ts
  modules/
    content-posts.ts
    content-ops.ts
    post-quality.ts
    reference-check.ts
    glossary-gap.ts
    series-suggestions.ts
    knowledge-graph-prototype.ts
    freshness-review.ts
    metadata-suggestions.ts
    internal-links.ts
  translators.ts

src/pages/admin/content-pipelines.astro
src/pages/admin/jobs.astro
src/pages/api/admin/pipelines.ts
src/pages/api/admin/jobs/index.ts
src/pages/api/admin/jobs/[id].ts

migrations/
  0007_admin_jobs.sql
```

目前已落地：

- `src/lib/pipelines/types.ts`
- `src/lib/pipelines/registry.ts`
- `src/lib/pipelines/runner.ts`
- `src/lib/pipelines/job-store.ts`
- `src/lib/pipelines/tool-registry.ts`
- `src/lib/pipelines/context-builder.ts`
- `src/lib/pipelines/guards/input.ts`
- `src/lib/pipelines/guards/tool.ts`
- `src/lib/pipelines/guards/output.ts`
- `src/lib/pipelines/guards/budget.ts`
- `src/lib/pipelines/modules/content-posts.ts`
- `src/lib/pipelines/modules/content-ops.ts`
- `src/lib/pipelines/modules/post-quality.ts`
- `src/lib/pipelines/modules/reference-check.ts`
- `src/lib/pipelines/modules/glossary-gap.ts`
- `src/lib/pipelines/modules/series-suggestions.ts`
- `src/lib/pipelines/modules/knowledge-graph-prototype.ts`
- `src/lib/pipelines/modules/freshness-review.ts`
- `src/lib/pipelines/translators.ts`
- `src/pages/admin/content-pipelines.astro`
- `src/pages/admin/jobs.astro`
- `src/pages/api/admin/pipelines.ts`
- `src/pages/api/admin/jobs/index.ts`
- `src/pages/api/admin/jobs/[id].ts`
- `migrations/0007_admin_jobs.sql`

## 與既有文章觀點的對應

這份設計採納站內 AI agent 文章已經收斂出的幾條原則：

- [AI Agent 架構模式完整指南](/posts/ai/2026-03-18-ai-agent-patterns-guide)：用 Context / Cognition / Action 與 Harness 分層，不把所有能力塞進單一 prompt。
- [Harness Engineering 進階模式](/posts/ai/2026-03-30-harness-engineering-patterns)：需要 Tool Registry、Guard System、Checkpoint/Resume、Budget Tracker。
- [別人怎麼用 LLM 寫文章](/posts/ai/2026-05-10-llm-writing-pipeline-learnings)：採納 multi-agent、brief gate、never fabricate、reviewer no auto-fix；不採納全自動 publish。
- [自製 auto-dev agent 的 15 個 walls](/posts/ai/2026-05-09-auto-dev-agent-15-walls)：把 token budget、max retry、tool allowlist、observability、human escalation 放進第一版設計。
- [Multi-Agent RAG 協作架構](/posts/ai/2026-03-16-multi-agent-rag-patterns)：RAG chat 已有 Planner / Research / Writer / Critic，可作為內容 pipeline 的實作參考。

## 故障處理策略

### 錯誤分類與處理原則

不是所有錯誤都應該重試，需要區分「可重試」vs「需人工介入」：

| 錯誤類型 | 範例 | 處理方式 |
|----------|------|----------|
| **可重試 (Transient)** | API timeout、provider rate limit、网络波动 | 指數退避重試 (exponential backoff) |
| **需修復 (Retryable)** | module 邏輯錯誤、輸入格式問題 | 記錄錯誤並標記 status=failed，等待修復後重跑 |
| **需人工介入 (Blocking)** | 缺少來源、引用失效、外部 API 永遠不可用 | 進入 `waiting_review` 或 `needs_human_input` |

### Retry Policy 設計

```typescript
interface RetryPolicy {
  maxRetries: number;           // 最大重試次數
  initialDelayMs: number;       // 初始延遲 (預設 1000ms)
  maxDelayMs: number;           // 最大延遲 (預設 60000ms)
  backoffMultiplier: number;   // 退避倍數 (預設 2)
  retryableErrors: string[];    // 可重試的錯誤碼清單
}
```

建議預設：
- **low risk pipeline**: maxRetries=1, 僅重試 timeout 類錯誤
- **medium risk pipeline**: maxRetries=2, 重試 timeout + rate limit
- **high risk pipeline**: maxRetries=0, 不自動重試，確保 fail-fast

### Dead Letter Queue (DLQ)

失敗超過 retry 上限的 job 進入 DLQ：

```sql
CREATE TABLE admin_jobs (
  ...
  status TEXT NOT NULL DEFAULT 'queued', -- queued | running | waiting_review | succeeded | failed | dead_letter
  failure_reason TEXT,
  retry_count INTEGER DEFAULT 0,
  dead_letter_at TEXT,
  ...
);
```

DLQ 中的 job：
- 不會自動重試
- 需要管理員手動審視後選擇「重跑」或「放棄」
- DLQ 保留 30 天後自動清理

### Human Escalation 流程

```text
Job 失敗
  │
  ├── 可重試錯誤 → 進入 retry 迴圈
  │     │
  │     └── 達到 maxRetries → 進入 DLQ
  │           │
  │           └── 管理員審視 → 決定重跑 / 放棄 / 標記需人工處理
  │
  └── 需人工介入 → status = waiting_review / needs_human_input
        │
        └── 作者處理後 → 標記 status = pending_review → 重新觸發 pipeline
```

## 版本控制

Pipeline 處理過的文章會產生多個版本，需要與 git 整合：

### 版本追蹤原則

- **不直接覆寫**：任何 pipeline 產生 draft 只寫新檔案或保留 diff suggestion
- **每次修改都回到 git workflow**：draft 經人工確認後，由部署流程或人工 PR 把 Markdown source 更新到 repo；雲端服務本身不依賴本機 runner
- **Artifact 長期保存**：pipeline artifact（翻譯稿、品質報告、brief 等）保存在 `artifacts/` 或 D1，不依賴 git

### 與 git 的互動方式

| 場景 | 處理方式 |
|------|----------|
| Translation pipeline 產生英文 draft | 寫入 `src/content/posts/en/` (draft: true)，由人確認後 commit |
| Metadata Agent 產生 tldr 建議 | 產出 diff suggestion 或 separate artifact，由人手動修改 |
| Quality Agent 發現問題 | 產出 `blocking_issues.json` artifact，由人確認後修復 |

### Rollback 機制

- **Source of truth**: Markdown 本身，壞了可以直接從 git 拉回
- **Pipeline state**: `admin_jobs` 中的 job status / artifacts 可重建
- **不需要 rollback pipeline**：失敗的 job 重新跑即可，不會弄髒 source

## 監控與告警

### Pipeline 等級 SLO

| 指標 | SLO | 告警閾值 |
|------|-----|----------|
| Job 成功率 | >= 95% (7天滾動) | < 90% |
| Job 平均執行時間 | <= 2 min (low risk), <= 10 min (medium) | > 閾值 20% |
| Job pending 時間 | <= 5 min | > 10 min |
| API error rate | <= 1% | > 5% |

### 監控儀表板

`/admin/stats` 應顯示：

```text
Pipeline Health
├── 成功率長條圖 (7天/30天)
├── 執行時間分布 (p50/p95/p99)
├── Pending job 數量
└── DLQ job 數量

Token Consumption
├── 各 pipeline 每日 token 消耗 (input/output 分開)
├── Provider 別消耗分布
└── 預算使用率

Content Quality
├── 通過率 / 失敗率趨勢
├── 常见失败类型分布
└── 人均處理時間
```

### Alerting 規則

| 觸發條件 | 動作 |
|----------|------|
| DLQ 有新 job 超過 24 小時未處理 | 發送 webhook 通知 |
| 成功率跌破 SLO | 發送 webhook 通知 |
| 執行時間異常飆高 | 記錄 warning，發送 webhook |
| Token 消耗接近 monthly budget 80% | 發送 webhook 提醒 |

## 排程與通知

### 自動排程

不是所有 pipeline 都需要手動觸發，部分應自動排程：

| Pipeline | 排程頻率 | 觸發方式 |
|----------|----------|----------|
| `content-ops` | 每週一 09:00 | Cron Trigger |
| `freshness-review` | 每週一 09:00 | Cron Trigger |
| `embed-sync` | 每次 git push | Cloudflare Deploy Hook |
| `crawl-sync` | 每週日 02:00 | Cron Trigger |

Cron Trigger 實作方式：
- 在 `wrangler.jsonc` 定義 cron trigger
- 對應的 API endpoint 加上 `X-Cron-Signature` 驗證
- 排程 job 標記 `scheduled_by: 'cron'`，與手動觸發區分

### 排程與手動觸發的權限差異

- **手動觸發**：任何登入 admin 的使用者
- **排程觸發**：僅限 server-side cron（需要額外驗證）

```typescript
// API handler pseudo-code
function handlePipelineTrigger(request) {
  const isCron = request.headers.get('X-Cron-Signature');
  if (isCron) {
    verifyCronSignature(isCron); // 驗證 cron 請求
    requireRole('system');
  } else {
    requireAdminSession(); // 驗證 admin session
  }
  // proceed...
}
```

### 通知機制

Pipeline 完成或失敗時，需要通知相關人員：

```typescript
interface NotificationConfig {
  onSuccess?: boolean;      // 成功時是否通知
  onFailure?: boolean;      // 失敗時是否通知
  onReviewRequired?: boolean; // 需要人工審視時是否通知
  webhookUrl?: string;      // 通知 webhook URL
  notifyUsers?: string[];  // 要通知的使用者 ID 清單
}

interface PipelineDefinition {
  ...
  notifications: NotificationConfig;
}
```

### Webhook Payload 範例

```json
{
  "event": "job_completed",
  "pipeline_id": "content-ops",
  "job_id": "job_abc123",
  "status": "succeeded",
  "duration_ms": 45000,
  "output_summary": "分析了 45 篇文章",
  "triggered_by": "cron",
  "timestamp": "2026-05-13T09:00:00Z"
}
```

```json
{
  "event": "job_failed",
  "pipeline_id": "translation",
  "job_id": "job_def456",
  "status": "dead_letter",
  "failure_reason": "external_api_unavailable",
  "retry_count": 2,
  "triggered_by": "admin",
  "timestamp": "2026-05-13T10:15:00Z"
}
```

### 通知渠道

第一版只支援 webhook：

- 建立 `admin_settings` 表存放 webhook URL
- 支援多個 webhook（Slack、Discord、自定義）
- webhook 失敗時寫入 log，不 block job 完成

未來可擴充：Email、Slack DM、Line Notify、Telegram Bot。

## MVP 結論

第一版不要急著做「會寫文章的 agent」。最值得先做的是「Content Agent Harness + 既有 pipeline 後台化」：

```text
MVP =
  Content Agent Harness
  + Pipeline Registry
  + Tool Registry
  + Context Builder
  + Guard System
  + Admin Jobs
  + Artifact Store
  + Content Ops Report UI
  + Worker-safe Content Ops Module
  + Worker-safe Post Quality Module
  + Worker-safe Reference Check Module
  + Embed/Crawl Job Logging
```

等 harness 層穩了，再加 Metadata Agent 和 Internal Link Agent。Translation 是第一條真正的 multi-agent draft pipeline，因為它已經有明確文件與 prompt，而且風險比 research/youtube 小。

最晚再做 Research to Post 和 YouTube to Post，因為那兩條最容易牽涉外部來源、引用正確性與幻覺問題。
