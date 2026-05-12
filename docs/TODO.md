# quidproquo 任務總清單

> 整合來源：`docs/plan.md`、`docs/superpowers/plans/`、`src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md`
> 最後更新：2026-05-12（校正已實作項目，並同步 `docs/blog-improvement-plan.md`；確認 404 / 英文搜尋 / 英文首頁 about / session-start / progress / RSS author / font preload 已落地）
>
> **設計鐵律：每個加上去的技術都必須能關掉。**
> 所有進階技術（HyDE、Multi-query、Reranker、Critic...）都必須有 feature flag、有 A/B 比較機制、只為觀測到的失敗而加。

---

## 現況快照

| 指標 | 數值 |
|------|------|
| 總文章數 | 284 篇 |
| 斷連結數 | 0 個（`pnpm check:references` 已通過） |
| 草稿數 | 17 篇 |
| 缺 `type` 欄位 | 15 篇（約 5%） |
| 缺 `series` 欄位 | 242 篇（約 85%） |
| 缺 `tldr` | 0 篇 |
| Tag 不一致 | 0（`ai-agents` 已清空，現為 `ai-agent` 37 篇） |

---

## P0 立即執行（低成本、高影響）

### 內容修正

- [x] **修復 49 個內部斷連結**
  - 重災區：`ai/2026-04-01-agent-cli-guidelines.md` 有 10 個斷連結
  - 處理方式：暫時改為 plain text 標註「即將推出」
- [x] **統一 tag 命名** — `ai-agent`（21 篇）+ `ai-agents`（14 篇）→ 統一為 `ai-agent`

### CI Gate（比 pre-commit 更優先）

- [x] **`check-post-references.mjs` 加入 CI**（第一層）— `deploy.yml`、`preview.yml` 補上 `pnpm check:references`（script 已存在，workflow 只跑 `pnpm lint`，49 個斷連結因此直接上線）
- [x] **Pre-commit hook（lint + reference check）**（第二層，CI gate 完成後再做）— 用 simple-git-hooks（hook 可被略過，故為輔助層）

### Harness 基礎建設（Blog 改版前置條件）

- [x] **建立根目錄 `CLAUDE.md`**（技術棧、目錄結構、開發流程、命名規範、決策理由）— Blog 前端改版依賴此文件的目錄規範，升為 P0

### 爬蟲 Chunker 參數修正

- [x] **`MAX_CHUNK_CHARS` 降為 1500**（`src/lib/crawl/config.ts:43`）
  - 後續必做：改完參數後需重新 crawl → 重新 chunk → 重新 embed，否則 D1/Vectorize 舊資料仍是 2000-char 切法，程式碼與索引狀態分裂
  - **RAG Phase 1（P2）開始前須確認此 re-embed 已完成**

### 網站技術

- [x] **建立 404 錯誤頁面** — `/src/pages/404.astro`，含搜尋框 + 首頁連結
- [x] **英文版搜尋頁** — `src/pages/search.astro` 硬編碼 `lang="zh-TW"`，已建立 `src/pages/en/search.astro`

---

## P1 短期（1–2 週）

### 內容補強（依賴順序，不可跳步）

- [ ] **撰寫批次回填腳本 + 人工抽樣規則 + 失敗回滾方案**（前置步驟，缺此步驟直接改 schema 會讓 build 炸）
  - 回滾機制需明確：git revert（純 frontmatter 修改）或 D1 snapshot restore（若已 sync 進 DB）
  - 抽樣規則：至少抽查 10% 文章（約 20 篇）人工確認分類正確
- [ ] **補上 15 篇缺失的 `type` 欄位**（批次腳本或 LLM 自動分類，人工 review）
  - **前置依賴**：tag 統一完成後再跑，避免分類結果基於不一致 tag
- [x] **補上缺失的 `tldr`**（目前缺口已清為 0）
- [ ] **backfill 驗證通過後**，再將 `src/content.config.ts` 中 `type` 改為 required

### 網站技術

- [x] **英文首頁加上 about 區塊** — `src/pages/en/index.astro` 已補說明區塊
- [x] **字型載入優化（影響 LCP）** — `PostLayout.astro` 已加入字型 preload 與 `font-display: swap`
  - [x] **圖片尺寸 + lazy loading（影響 CLS）** — `astro.config.mjs` 統一補 `loading="lazy"` / `decoding="async"`，現有 markdown 圖片已補 `width` / `height`
- [x] **無障礙基本款** — Skip Navigation、`:focus-visible`、`--text-muted` 已在 `PostLayout.astro`；axe 驗證仍可補做
- [x] **Blog 前端改版**（詳細步驟：`docs/superpowers/plans/2026-03-12-blog-redesign.md`）
  - [x] Task 1：Icons component + CSS design tokens + PostLayout 更新（`src/components/Icons.astro`、`src/layouts/PostLayout.astro` 已完成）
  - [x] Task 2：Nav 改版（nav、theme toggle、lang switch、RSS、progress bar 已在 `PostLayout.astro`）
  - [x] Task 3：PostCard 改版（`src/components/PostCard.astro` 已有 category/type/series/reading time 卡片樣式）
  - [x] Task 4：Reading time remark plugin（`src/plugins/remarkReadingTime.ts` 已存在並接到 `astro.config.mjs`；schema 欄位可後續再收斂）
  - [x] Task 5：i18n strings 更新（`src/i18n/ui.ts` 已含 nav / TOC / series / prev-next / related 等字串）
  - [x] Task 7：Related posts + series nav utilities（`src/utils/seriesNav.ts` 已存在，且 `src/pages/posts/[...slug].astro` 已接上 series nav）
  - [x] Task 8：Article page 改版（`src/pages/posts/[...slug].astro` 已含 hero、TL;DR、TOC、copy button、prev/next、related、series nav）
  - [x] Task 10：RSS Feed（`src/pages/rss.xml.ts`、`src/pages/en/rss.xml.ts` 已存在，且 `<author>` 已補）
  - [x] Task 11：Sitemap（`astro.config.mjs` 已設定；確認輸出正確）
  - [x] Task 12：OG Image 自動產生（`scripts/generate-og-images.mjs` 已接到 `pnpm build`）
  - [x] Task 13：Pagefind 靜態搜尋（`astro.config.mjs` build hook + `/search`、`/en/search` 已存在）
  - [x] Task 14：Final build 驗證完成（`pnpm build` 已可完整結束；補上 `prerenderEnvironment: 'node'` 與 `inspectorPort: false`）

### Harness 基礎建設

- [x] **建立 `progress.txt` 機制**（最低成本的 episodic memory，不需要 vector DB）
- [x] **Session-start hook** — `scripts/session-start.mjs` + `.claude/settings.json`，自動跑 `pnpm lint` + 讀 `progress.txt`
- [x] **Post skill 加入 Evaluator 節點**（檢查：frontmatter 完整性、內部連結有效性、tag 一致性、標題結構）
- [x] **工具描述品質規範** — `search_blog_posts` / `search_abstract_index` / `search_docs` 使用時機區分明確化，每個工具加上何時使用 / 何時不使用 / 預期回傳格式

### RAG 設計修正（2026-05-12 已實作）

- [x] **Step 1：Prompt 改用「描述終態」風格**（描述「成功的回答長什麼樣」而非「按步驟做」）
- [x] **Step 2：Deterministic Validation Node（Stripe Blueprint 模式）** — 已在 Writer → Critic 間插入確定性驗證，現階段檢查 Markdown code fence、source URL 是否來自檢索結果、Mermaid fenced block 基本語法
- [x] **Step 3：Critic 失敗降級策略**（依賴 Step 2）— validation 或 critic 失敗時最多再生 2 次，第 3 次仍未通過則標註「⚠️ 此回答可能不完整」，停止後續 LLM 節點

### 文件同步

- [x] **`docs/blog-improvement-plan.md` 補進度註記** — 將舊版規劃改成保留設計脈絡、但用狀態標示已完成/未完成項目
- [x] **`docs/TODO.md` 校正已實作項目描述** — 避免 repo 已有實作，文件仍寫成「尚未存在」

---

## P2 中期（1–2 個月）

### Phase 1A：RAG 最小可用系統

> 詳細實作步驟：`docs/superpowers/plans/2026-03-21-rag-phase1.md`
> 驗收：可用聊天系統上線、基本 tracing 可觀測
> 2026-05-12 核對：以下狀態依現有 repo 實作與 `pnpm test`（10 files, 39 tests passed）更新

- [x] **Task 1：安裝依賴 + 環境設定**（React、vitest、Vectorize、Workers AI bindings）
- [x] **Task 2：D1 Migration**（`post_chunks`、`doc_chunks` 表）
- [x] **Task 3：Chunk ID + Contextual Retrieval（TDD）**
- [x] **Task 4：Embedding Pipeline + Hybrid Search** — embed 進 Vectorize；實作 Vectorize 語意 + D1 FTS5 BM25 + RRF 融合
  - 目前狀態：`search-posts.ts` / `search-docs.ts` 已補上 Vectorize 語意搜尋 + D1 FTS5 BM25 + RRF 融合；向量命中後也會回 D1 補 chunk 內容
  - embed model：`@cf/baai/bge-large-en-v1.5`、batch size：50 篇/次、RRF 係數：k=60（預設值）
- [x] **Task 5：Auth — Session + Rate Limit（TDD）**（訪客 IP 限額 5 次/日）
- [x] **Task 6：Login Page**
- [x] **Task 7：Langfuse Helper**（basic tracing，先有可觀測性再加複雜策略）
- [x] **Task 8：LangGraph State Definition**
- [x] **Task 9：Research Tools（TDD）** — `search-posts.ts`、`search-docs.ts`、`get-post-detail.ts`
- [x] **Task 10：`normalize_results` Node（TDD）**
- [x] **Task 11：Planner、Writer、Critic、Related Posts agents**
- [x] **Task 12：Graph Builder**
- [x] **Task 13：Chat SSE API Endpoint**
- [x] **Task 14：Chat UI**（`AgentSteps`、`QuotaIndicator`、`MessageInput`、`MessageList`、`ChatWidget`、`chat.astro`）
- [ ] **Task 15：Run Embed Pipeline + Smoke Test**
  - 目前狀態：`/api/embed/sync` 與 pipeline 已存在，但 repo 內沒有這次核對可直接佐證的實跑紀錄或 smoke test 結果

### Phase 1B：觀測先行 → 才加複雜策略

> 設計鐵律執行點：先有 flag、先有 baseline、再加複雜性

- [x] **RAGAS baseline eval + Golden Dataset**（20-25 個測試案例：精確查詢、概念解釋、跨文章綜合、不在知識庫、中英混雜；**提前至此階段，P3 太晚**）
  - 目前狀態：已新增 `docs/rag-golden-dataset.json`（20 cases）與 `pnpm eval:rag` baseline script；首次 live baseline 分數仍需在有實際 chat 環境時執行
  - 通過門檻需定義：Faithfulness ≥ 0.8、Answer Relevance ≥ 0.75、Context Recall ≥ 0.7
  - 無此 baseline 無法判斷後續 HyDE/reranker/critic 是改善還是加負擔
- [x] **RAG pipeline feature flag**（HyDE、Multi-query、Reranker、Critic 各自可開關）
  - 目前狀態：已新增 `settings` 控制與 `src/lib/rag/settings.ts`；flag 由 DB settings 載入
- [x] **Shadow Mode A/B 比較機制**（開啟 vs 關閉，比較 RAGAS 分數）
  - 目前狀態：已新增 `shadow_runs` 表與 shadow baseline config；啟用後會把 primary/shadow 結果一起落庫，供後續評估比較
- [x] **設計決策 ADR**（為什麼用 BGE-large？為什麼 chunk 1500？為什麼 cache 0.95？）
  - 目前狀態：已新增 `docs/adr/0001-rag-phase1b-decisions.md`
- [x] **Semantic Cache threshold 設為 `0.95`**（`semantic-caching.md` 指出 0.90–0.94 是「相關但不同」的危險區間）
  - 目前狀態：已新增 `0003_rag_phase1b.sql` 與 runtime settings 預設 `0.95`
  - 驗收：監控 cache hit rate，目標 > 20%；若 < 5% 表示 threshold 過高需下調
- [x] **Reranker 加入 `min_keep: 3`**（`cross-encoder-reranking.md` 明確建議的安全網）
  - 目前狀態：`normalize-results.ts` 已加入 rerank step，並以 settings 控制 `min_keep = 3`
- [x] **MMR 多樣性重排**（λ = 0.7，在 reranker 後、Writer 前插入）
  - 目前狀態：`normalize-results.ts` 已加入 MMR ordering，預設 `0.7`
- [x] **Adaptive RAG queryType 路由**（`complexity: simple | medium | complex`，simple 跳過 HyDE/Multi-query）
  - 目前狀態：Planner 已輸出 `complexity`，Research 會依複雜度決定是否走 abstract / HyDE / Multi-query
- [x] **CRAG filter 放寬策略**（零結果時漸進放寬次要 filter → 仍低分 → web search fallback）
  - 目前狀態：`search-posts.ts` / `search-docs.ts` 已在 filter 命中為零時放寬次要 filter；`needs_web_search` 仍沿用低分觸發
- [x] **Critic 加 answer-relevance 檢查**（不只 grounding，也檢查真的回答了問題）
- [x] **Critic 加 drift 偵測**（檢查 Research 過程是否偏離原始查詢意圖）
- [x] **Context Checkpoint 系統**（動態壓縮門檻：`threshold = model_context_window * 0.7`）
  - 目前狀態：已新增 checkpoints table、summary load/save helper，API 以 `0.7` ratio 觸發 checkpoint
- [ ] **Query Router：新增 recommendation/discovery intent（產品路由）**
  - 驗收：
    - Planner 可辨識「找文章 / 推薦文章 / 閱讀路線」查詢並輸出 recommendation intent
    - 回答格式優先回傳結構化清單（標題、分類、連結、推薦理由）
    - 對照舊流程，至少 10 筆測試查詢中主觀可用性提升（人工評估）
- [ ] **Pipeline Engine 抽象：支援 `langgraph` / `manual` / `llamaindex` 選擇**
  - 驗收：
    - 設定新增 `pipeline_engine`
    - `/api/chat` 可依設定切換 engine，且輸出契約一致（`final_response`、`search_results`、`critique`、`token_usage`）
    - 既有 LangGraph 路徑不回歸（現有測試全綠）
- [ ] **RAG Eval 自動化（RAGAS / DeepEval）**
  - 驗收：
    - 每次策略或 prompt 變更可自動重跑 baseline
    - 輸出固定報表：faithfulness、answer_relevance、context_recall、latency
    - 變更未達門檻時可阻擋升級（或標記為實驗）
- [ ] **Reranker A/B（complex-only）**
  - 驗收：
    - complex query 可獨立開關 reranker
    - shadow mode 可比較 primary/shadow 品質與延遲
    - 產出「何時開 reranker 比較划算」的門檻建議
- [ ] **站內搜尋 RAG 化（Search + Chat 共用檢索能力）**
  - 目標：讓 `/search` 不只關鍵字比對，支援語意查詢與「先找文、再決定要不要開對話」流程
  - 驗收：
    - 新增搜尋模式切換：`keyword` / `hybrid` / `rag`
    - `rag` 模式可回傳：文章清單、每篇命中理由（evidence）、可追蹤來源 URL
    - Search 與 Chat 共用同一套 retrieval 設定（feature flags、reranker、MMR）避免結果分裂
    - 至少 20 筆「找文章」查詢評估：`rag` 模式在相關性主觀評分優於純 keyword
  - 備註：UI 維持「先清單後對話」，避免搜尋頁直接變聊天頁
- [ ] **RAG 後台管理頁（Admin Console）**
  - 目標：集中管理策略開關、實驗、資料重建與品質檢查，不再靠手動改 DB setting
  - 驗收：
    - 可視化管理 flags（HyDE、Multi-query、Reranker、Critic、PageIndex、pipeline_engine）
    - 可發起/停止 shadow run，並查看 primary vs shadow 差異摘要
    - 可操作 embed/crawl/smoke test 任務（含最近執行紀錄、成功率、錯誤摘要）
    - 具備角色權限（至少 admin-only）與操作審計紀錄
- [ ] **每筆查詢 Observability Timeline（逐階段可視化）**
  - 目標：每一筆 query 都能看到 Planner/Research/Writer/Validation/Critic 各階段耗時、輸入輸出摘要與決策路徑
  - 驗收：
    - trace 詳情頁可顯示每階段 timeline（開始時間、耗時、token、是否重試）
    - 可查看關鍵中介產物（plan intent/complexity、檢索命中數、validation errors、critic 分數）
    - 可比對同一 query 的 primary/shadow 執行差異（步驟、品質分數、延遲）
    - 可依日期、query 類型、錯誤類型篩選，支援回放最近失敗案例

### Phase 1C：內容營運自動化

- [ ] **AI 驅動相關文章推薦**（取代純 tag 匹配：40% tag + 30% 分類 + 20% 時近性 + 10% 同系列；**前置依賴**：P2 Series 系列化完成）
- [ ] **自動 TL;DR 與 description 生成**
- [ ] **自動 tag 建議** — 新文章發布時，根據內容 embedding 推薦應加的 tag（**前置依賴**：P0 tag 統一完成）
- [ ] **難度分級** — 自動標記文章為「入門 / 進階 / 深度」，寫入 frontmatter
- [ ] **重複主題偵測** — 找出語意相似度高的文章對，提示合併或區隔
- [ ] **文章新鮮度偵測** — 比對爬蟲資料，標記引用了過時 API / 已淘汰工具的文章
- [ ] **內容缺口分析** — 分析站內搜尋紀錄，找出讀者在搜但你還沒寫的主題
- [ ] **SEO 優化 agent** — 建議更好的標題、description、內部連結機會
- [ ] **Ollama 本地模型整合** — 批次任務（自動 tag、難度分級、TL;DR 生成）改用本地模型，API 成本歸零；研究筆記：`docs/research/ollama-research.md`
- [ ] **PageIndex 作為 Tool（單文件深挖）**
  - 策略：先廣搜（hybrid）再深挖（PageIndex），僅在「長文件 + complex query」啟用
  - 驗收：
    - 新增 `rag_flag_pageindex` 與基本參數（如 `max_steps`）
    - `research` 節點可條件性呼叫 PageIndex tool，回傳格式對齊 `SearchResult`
    - 章節定位型問題（至少 20 題）比 baseline 提升 answer relevance

### Harness 基礎建設

- [x] **RSS Feed 補 `<author>` 標籤**（中英 RSS item 均已補 metadata）
- [x] **Series 系列化**（RAG 系列、Claude Code 系列、AI Agent 系列正式組織）
- [x] **排程發布** — 87% 文章集中 2026 年 3 月，設定 `date` 未來日期搭配 CI 定時發布，維持穩定節奏
- [x] **多語言翻譯 Pipeline（Multi-Agent）** — Translator → Cultural Reviewer → Native Checker

### 爬蟲整合（驗證與補強，非重新實作）— 升至 P1，避免髒資料污染 RAG

> 詳細設計：`docs/plan.md` Phase 3、`docs/superpowers/plans/2026-03-12-crawler-integration.md`
> 注意：`/api/crawl/sync` endpoint 已存在（`src/pages/api/crawl/sync.ts`），Cron Trigger 已設定（`wrangler.jsonc`）

- [ ] **驗證 `/api/crawl/sync` 穩定性**（補錯誤處理、補監控；非重新實作）
- [x] **設定要爬取的技術文件站清單**（`src/lib/crawl/config.ts` 已含 D1 / Workers / Vectorize / Astro Docs）
- [x] **實作 Markdown → chunking pipeline**（`src/lib/crawl/chunker.ts` 已存在，且採 `MAX_CHUNK_CHARS = 1500`）
- [ ] **增量更新機制（modifiedSince）**
- [ ] **補 production smoke test 清單**（post-deploy 驗證步驟，目前只有 build gate）

---

## P3 長期（3 個月以上）

### AI 進階功能

- [ ] **站長端 episodic memory**（記住寫作偏好、常用範本；參考 Hermes Agent 的 user profile dialectic）
  - 內容：
    - 儲存站長偏好（語氣、段落長度、偏好結構）
    - 追蹤近期連續任務脈絡（本週主題、未完成草稿、待補資料）
    - 支援手動修正記憶，避免錯誤偏好長期污染
- [ ] **Judge sampling 30%**（簡單查詢跳過 Critic，預期省 20-30% 成本）
  - 內容：
    - simple query 預設不跑 Critic，complex query 維持全量
    - 抽樣失敗自動回補（抽中低分即提升抽樣率）
    - 每週輸出成本節省 vs 品質變化報表
- [ ] **BM25 短路邏輯**（BM25 回傳 ≥ 5 結果時跳過向量搜尋）
  - 內容：
    - 對精確名詞/型號/錯誤碼查詢先跑 BM25
    - 命中門檻達標即跳過 embedding + vectorize
    - 紀錄短路命中率與延遲改善幅度
- [ ] **GraphRAG**（從文章中抽取實體與關係，適合跨文章查詢）
  - 內容：
    - 建立 entity/relation pipeline（人名、工具、框架、概念）
    - 支援跨文章關聯查詢（例如「A 技術與 B 策略關係」）
    - 提供關係圖查詢與來源可追溯連結
- [ ] **自訂文件上傳功能**（PDF / Markdown / URL 三種來源）
  - 內容：
    - 上傳後自動切 chunk、抽 metadata、建立索引
    - 支援文件版本更新與刪除（避免舊版污染）
    - 每份文件顯示處理狀態與錯誤原因
- [ ] **學習路徑生成** — 給定目標（如「我想學 RAG」），自動規劃文章閱讀順序
  - 內容：
    - 依目標與背景輸出分階段閱讀清單（入門→進階→實作）
    - 每篇附「先修知識」與「完成後收穫」
    - 支援估算總閱讀時間與進度追蹤
- [ ] **知識地圖** — 視覺化文章之間的概念關係圖
  - 內容：
    - 以 tag + entity + 共現關係產生概念圖
    - 可從任一節點回跳文章列表與重點段落
    - 支援依主題/時間篩選，避免圖過度擁擠
- [ ] **互動詞彙表** — hover 技術名詞時 AI 即時解釋，不離開頁面
  - 內容：
    - 詞彙卡顯示定義、上下文、延伸閱讀
    - 依讀者程度切換解釋深度（初學/進階）
    - 記錄高頻不理解詞彙，回饋給內容規劃

---

## 參考資料

| 文件 | 用途 |
|------|------|
| `docs/plan.md` | 專案架構設計、技術棧決策、資料流說明 |
| `docs/superpowers/plans/2026-03-12-blog-redesign.md` | Blog 前端改版詳細步驟（含完整程式碼） |
| `docs/superpowers/plans/2026-03-21-rag-phase1.md` | RAG Phase 1 詳細實作步驟（含 TDD、LangGraph） |
| `docs/superpowers/plans/2026-03-12-crawler-integration.md` | 爬蟲整合詳細設計 |
| `docs/blog-improvement-plan.md` | 舊版規劃（已整合至本文件，可封存） |
| `src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md` | 公開發表的 roadmap 文章（含設計理念說明） |
