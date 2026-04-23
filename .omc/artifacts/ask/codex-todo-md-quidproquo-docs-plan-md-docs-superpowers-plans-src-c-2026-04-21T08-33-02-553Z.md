# codex advisor artifact

- Provider: codex
- Exit code: 0
- Created at: 2026-04-21T08:33:02.555Z

## Original task

請審查以下 TODO.md 的合理性，從優先順序、技術可行性、任務依賴關係、遺漏風險等面向給出意見：

# quidproquo 任務總清單

> 整合來源：`docs/plan.md`、`docs/superpowers/plans/`、`src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md`
> 最後更新：2026-04-19
>
> **設計鐵律：每個加上去的技術都必須能關掉。**
> 所有進階技術（HyDE、Multi-query、Reranker、Critic...）都必須有 feature flag、有 A/B 比較機制、只為觀測到的失敗而加。

---

## 現況快照

| 指標 | 數值 |
|------|------|
| 總文章數 | 227 篇 |
| 斷連結數 | 49 個（影響約 40 篇文章） |
| 草稿數 | 17 篇 |
| 缺 `type` 欄位 | 213 篇（94%） |
| 缺 `series` 欄位 | 199 篇（88%） |
| 缺 `tldr` | 7 篇 |
| Tag 不一致 | `ai-agent` vs `ai-agents`（35 篇） |

---

## P0 立即執行（低成本、高影響）

### 內容修正

- [x] **修復 49 個內部斷連結**
  - 重災區：`ai/2026-04-01-agent-cli-guidelines.md` 有 10 個斷連結
  - 處理方式：暫時改為 plain text 標註「即將推出」
- [ ] **統一 tag 命名** — `ai-agent`（21 篇）+ `ai-agents`（14 篇）→ 統一為 `ai-agent`

### 爬蟲 Chunker 參數修正

- [ ] **`MAX_CHUNK_CHARS` 降為 1500**（`src/lib/crawl/config.ts:43`；中文 2000 chars ≈ 800–1000 tokens，超出建議範圍；`chunking-strategies.md` 建議上限）

### Harness 基礎建設

- [ ] **建立根目錄 `CLAUDE.md`**（技術棧、目錄結構、開發流程、命名規範、決策理由）
- [ ] **Pre-commit hook（lint + reference check）** — 用 husky 或 simple-git-hooks；「Linter 是法律，prompt 是建議」
- [ ] **`check-post-references.mjs` 加入 CI**（script 已存在但沒跑，導致 49 個斷連結直接上線）

### 網站技術

- [ ] **建立 404 錯誤頁面** — `/src/pages/404.astro`，含搜尋框 + 熱門文章推薦

---

## P1 短期（1–2 週）

### 內容補強

- [ ] **補上 213 篇缺失的 `type` 欄位**（批次腳本或 LLM 自動分類，人工 review）
- [ ] **補上 7 篇缺失的 `tldr`**（Claude 批量生成，人工 review）

### 網站技術

- [ ] **英文版搜尋頁** — `/src/pages/search.astro` 硬編碼 `lang="zh-TW"`，需建立 `/src/pages/en/search.astro`
- [ ] **英文首頁加上 about 區塊**（英文讀者看不懂「Quid Pro Quo」是什麼）
- [ ] **字型載入優化（影響 LCP）** — `<link rel="preload" as="font">` + `font-display: swap`
- [ ] **圖片尺寸 + lazy loading（影響 CLS）** — 啟用 `astro:assets`，markdown 圖片補 `loading="lazy"` 與 width/height
- [ ] **無障礙基本款** — Skip Navigation 連結、`:focus-visible` 鍵盤樣式、驗證 `--text-muted: #999` 對比度
- [ ] **Blog 前端改版**（詳細步驟：`docs/superpowers/plans/2026-03-12-blog-redesign.md`）
  - [ ] Task 1：Icons component + CSS design tokens + PostLayout 更新
  - [ ] Task 2：Nav 改版
  - [ ] Task 3：PostCard 改版
  - [ ] Task 4：Reading time remark plugin + schema 欄位
  - [ ] Task 5：i18n strings 更新
  - [ ] Task 7：Related posts + series nav utilities
  - [ ] Task 8：Article page 改版
  - [ ] Task 10：RSS Feed
  - [ ] Task 11：Sitemap
  - [ ] Task 12：OG Image 自動產生
  - [ ] Task 13：Pagefind 靜態搜尋
  - [ ] Task 14：Final build 驗證

### Harness 基礎建設

- [ ] **Frontmatter `type` 改為 required**（更新 `src/content.config.ts` schema；用 schema 強制，不靠 prompt 請求）
- [ ] **建立 `progress.txt` 機制**（最低成本的 episodic memory，不需要 vector DB）
- [ ] **Session-start hook** — 自動跑 `pnpm lint` + 讀 `progress.txt`
- [ ] **Post skill 加入 Evaluator 節點**（檢查：frontmatter 完整性、內部連結有效性、tag 一致性、標題結構）
- [ ] **工具描述品質規範** — `search_blog_posts` / `search_abstract_index` / `search_docs` 使用時機區分明確化，每個工具加上何時使用 / 何時不使用 / 預期回傳格式

### RAG 設計修正

- [ ] **Deterministic Validation Node（Stripe Blueprint 模式）** — 在 Writer → Critic 之間插入確定性驗證（Markdown 語法、source URL、Mermaid 語法）
- [ ] **Critic 失敗降級策略** — 重試 2 次仍低於門檻 → 標註「⚠️ 此回答可能不完整」，停止呼叫 LLM
- [ ] **Prompt 改用「描述終態」風格**（描述「成功的回答長什麼樣」而非「按步驟做」）

---

## P2 中期（1–2 個月）

### AI Agent 應用實作

> 詳細實作步驟：`docs/superpowers/plans/2026-03-21-rag-phase1.md`

- [ ] **Task 1：安裝依賴 + 環境設定**（React、vitest、Vectorize、Workers AI bindings）
- [ ] **Task 2：D1 Migration**（`post_chunks`、`doc_chunks` 表）
- [ ] **Task 3：Chunk ID + Contextual Retrieval（TDD）**
- [ ] **Task 4：Embedding Pipeline + Hybrid Search** — 197 篇文章 embed 進 Vectorize；實作 Vectorize 語意 + D1 FTS5 BM25 + RRF 融合
- [ ] **Task 5：Auth — Session + Rate Limit（TDD）**（訪客 IP 限額 5 次/日）
- [ ] **Task 6：Login Page**
- [ ] **Task 7：Langfuse Helper**
- [ ] **Task 8：LangGraph State Definition**
- [ ] **Task 9：Research Tools（TDD）** — `search-posts.ts`、`search-docs.ts`、`get-post-detail.ts`
- [ ] **Task 10：`normalize_results` Node（TDD）**
- [ ] **Task 11：Planner、Writer、Critic、Related Posts agents**
- [ ] **Task 12：Graph Builder**
- [ ] **Task 13：Chat SSE API Endpoint**
- [ ] **Task 14：Chat UI**（`AgentSteps`、`QuotaIndicator`、`MessageInput`、`MessageList`、`ChatWidget`、`chat.astro`）
- [ ] **Task 15：Run Embed Pipeline + Smoke Test**
- [ ] **AI 驅動相關文章推薦**（取代純 tag 匹配：40% tag + 30% 分類 + 20% 時近性 + 10% 同系列）
- [ ] **自動 TL;DR 與 description 生成**
- [ ] **自動 tag 建議** — 新文章發布時，根據內容 embedding 推薦應加的 tag
- [ ] **難度分級** — 自動標記文章為「入門 / 進階 / 深度」，寫入 frontmatter
- [ ] **重複主題偵測** — 找出語意相似度高的文章對，提示合併或區隔
- [ ] **文章新鮮度偵測** — 比對爬蟲資料，標記引用了過時 API / 已淘汰工具的文章
- [ ] **互動詞彙表** — hover 技術名詞時 AI 即時解釋，不離開頁面
- [ ] **內容缺口分析** — 分析站內搜尋紀錄，找出讀者在搜但你還沒寫的主題
- [ ] **SEO 優化 agent** — 建議更好的標題、description、內部連結機會

### RAG 設計補強

- [ ] **Semantic Cache threshold 設為 `0.95`**（實作時即設定；`semantic-caching.md` 指出 0.90–0.94 是「相關但不同」的危險區間）
- [ ] **Reranker 加入 `min_keep: 3`**（實作時即設定；`cross-encoder-reranking.md` 明確建議的安全網）
- [ ] **MMR 多樣性重排**（λ = 0.7，在 reranker 後、Writer 前插入）
- [ ] **Adaptive RAG queryType 路由**（`complexity: simple | medium | complex`，simple 跳過 HyDE/Multi-query）
- [ ] **CRAG filter 放寬策略**（零結果時漸進放寬次要 filter → 仍低分 → web search fallback）
- [ ] **Critic 加 answer-relevance 檢查**（不只 grounding，也檢查真的回答了問題）
- [ ] **Critic 加 drift 偵測**（檢查 Research 過程是否偏離原始查詢意圖）

### Harness 基礎建設

- [ ] **Ollama 本地模型整合** — 批次任務（自動 tag、難度分級、TL;DR 生成）改用本地模型，API 成本歸零；研究筆記：`docs/research/ollama-research.md`
- [ ] **設計決策 ADR**（為什麼用 BGE-large？為什麼 chunk 2000？為什麼 cache 0.95？）
- [ ] **RAG pipeline feature flag**（HyDE、Multi-query、Reranker、Critic 各自可開關）
- [ ] **Shadow Mode A/B 比較機制**（開啟 vs 關閉，比較 RAGAS 分數）
- [ ] **Context Checkpoint 系統**（動態壓縮門檻：`threshold = model_context_window * 0.7`，非硬編碼 8000 tokens）

### 網站技術

- [ ] **RSS Feed 加 `<author>` 標籤**
- [ ] **Series 系列化**（RAG 系列、Claude Code 系列、AI Agent 系列正式組織）
- [ ] **排程發布** — 87% 文章集中 2026 年 3 月，設定 `date` 未來日期搭配 CI 定時發布，維持穩定節奏
- [ ] **多語言翻譯 Pipeline（Multi-Agent）** — Translator → Cultural Reviewer → Native Checker

### 爬蟲整合

> 詳細設計：`docs/plan.md` Phase 3、`docs/superpowers/plans/2026-03-12-crawler-integration.md`

- [ ] **實作 `/api/crawl/sync` endpoint**
- [ ] **設定要爬取的技術文件站清單**
- [ ] **實作 Markdown → chunking pipeline**
- [ ] **設定 Cron Trigger 定期爬取**
- [ ] **增量更新機制（modifiedSince）**

---

## P3 長期（3 個月以上）

### AI 進階功能

- [ ] **站長端 episodic memory**（記住寫作偏好、常用範本；參考 Hermes Agent 的 user profile dialectic）
- [ ] **Judge sampling 30%**（簡單查詢跳過 Critic，預期省 20-30% 成本）
- [ ] **BM25 短路邏輯**（BM25 回傳 ≥ 5 結果時跳過向量搜尋）
- [ ] **RAGAS 評估 pipeline + Golden Dataset**（20-25 個測試案例，涵蓋精確查詢、概念解釋、跨文章綜合、不在知識庫、中英混雜五類）
- [ ] **GraphRAG**（從文章中抽取實體與關係，適合跨文章查詢）
- [ ] **自訂文件上傳功能**（PDF / Markdown / URL 三種來源）
- [ ] **學習路徑生成** — 給定目標（如「我想學 RAG」），自動規劃文章閱讀順序
- [ ] **知識地圖** — 視覺化文章之間的概念關係圖

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

## Final prompt

請審查以下 TODO.md 的合理性，從優先順序、技術可行性、任務依賴關係、遺漏風險等面向給出意見：

# quidproquo 任務總清單

> 整合來源：`docs/plan.md`、`docs/superpowers/plans/`、`src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md`
> 最後更新：2026-04-19
>
> **設計鐵律：每個加上去的技術都必須能關掉。**
> 所有進階技術（HyDE、Multi-query、Reranker、Critic...）都必須有 feature flag、有 A/B 比較機制、只為觀測到的失敗而加。

---

## 現況快照

| 指標 | 數值 |
|------|------|
| 總文章數 | 227 篇 |
| 斷連結數 | 49 個（影響約 40 篇文章） |
| 草稿數 | 17 篇 |
| 缺 `type` 欄位 | 213 篇（94%） |
| 缺 `series` 欄位 | 199 篇（88%） |
| 缺 `tldr` | 7 篇 |
| Tag 不一致 | `ai-agent` vs `ai-agents`（35 篇） |

---

## P0 立即執行（低成本、高影響）

### 內容修正

- [x] **修復 49 個內部斷連結**
  - 重災區：`ai/2026-04-01-agent-cli-guidelines.md` 有 10 個斷連結
  - 處理方式：暫時改為 plain text 標註「即將推出」
- [ ] **統一 tag 命名** — `ai-agent`（21 篇）+ `ai-agents`（14 篇）→ 統一為 `ai-agent`

### 爬蟲 Chunker 參數修正

- [ ] **`MAX_CHUNK_CHARS` 降為 1500**（`src/lib/crawl/config.ts:43`；中文 2000 chars ≈ 800–1000 tokens，超出建議範圍；`chunking-strategies.md` 建議上限）

### Harness 基礎建設

- [ ] **建立根目錄 `CLAUDE.md`**（技術棧、目錄結構、開發流程、命名規範、決策理由）
- [ ] **Pre-commit hook（lint + reference check）** — 用 husky 或 simple-git-hooks；「Linter 是法律，prompt 是建議」
- [ ] **`check-post-references.mjs` 加入 CI**（script 已存在但沒跑，導致 49 個斷連結直接上線）

### 網站技術

- [ ] **建立 404 錯誤頁面** — `/src/pages/404.astro`，含搜尋框 + 熱門文章推薦

---

## P1 短期（1–2 週）

### 內容補強

- [ ] **補上 213 篇缺失的 `type` 欄位**（批次腳本或 LLM 自動分類，人工 review）
- [ ] **補上 7 篇缺失的 `tldr`**（Claude 批量生成，人工 review）

### 網站技術

- [ ] **英文版搜尋頁** — `/src/pages/search.astro` 硬編碼 `lang="zh-TW"`，需建立 `/src/pages/en/search.astro`
- [ ] **英文首頁加上 about 區塊**（英文讀者看不懂「Quid Pro Quo」是什麼）
- [ ] **字型載入優化（影響 LCP）** — `<link rel="preload" as="font">` + `font-display: swap`
- [ ] **圖片尺寸 + lazy loading（影響 CLS）** — 啟用 `astro:assets`，markdown 圖片補 `loading="lazy"` 與 width/height
- [ ] **無障礙基本款** — Skip Navigation 連結、`:focus-visible` 鍵盤樣式、驗證 `--text-muted: #999` 對比度
- [ ] **Blog 前端改版**（詳細步驟：`docs/superpowers/plans/2026-03-12-blog-redesign.md`）
  - [ ] Task 1：Icons component + CSS design tokens + PostLayout 更新
  - [ ] Task 2：Nav 改版
  - [ ] Task 3：PostCard 改版
  - [ ] Task 4：Reading time remark plugin + schema 欄位
  - [ ] Task 5：i18n strings 更新
  - [ ] Task 7：Related posts + series nav utilities
  - [ ] Task 8：Article page 改版
  - [ ] Task 10：RSS Feed
  - [ ] Task 11：Sitemap
  - [ ] Task 12：OG Image 自動產生
  - [ ] Task 13：Pagefind 靜態搜尋
  - [ ] Task 14：Final build 驗證

### Harness 基礎建設

- [ ] **Frontmatter `type` 改為 required**（更新 `src/content.config.ts` schema；用 schema 強制，不靠 prompt 請求）
- [ ] **建立 `progress.txt` 機制**（最低成本的 episodic memory，不需要 vector DB）
- [ ] **Session-start hook** — 自動跑 `pnpm lint` + 讀 `progress.txt`
- [ ] **Post skill 加入 Evaluator 節點**（檢查：frontmatter 完整性、內部連結有效性、tag 一致性、標題結構）
- [ ] **工具描述品質規範** — `search_blog_posts` / `search_abstract_index` / `search_docs` 使用時機區分明確化，每個工具加上何時使用 / 何時不使用 / 預期回傳格式

### RAG 設計修正

- [ ] **Deterministic Validation Node（Stripe Blueprint 模式）** — 在 Writer → Critic 之間插入確定性驗證（Markdown 語法、source URL、Mermaid 語法）
- [ ] **Critic 失敗降級策略** — 重試 2 次仍低於門檻 → 標註「⚠️ 此回答可能不完整」，停止呼叫 LLM
- [ ] **Prompt 改用「描述終態」風格**（描述「成功的回答長什麼樣」而非「按步驟做」）

---

## P2 中期（1–2 個月）

### AI Agent 應用實作

> 詳細實作步驟：`docs/superpowers/plans/2026-03-21-rag-phase1.md`

- [ ] **Task 1：安裝依賴 + 環境設定**（React、vitest、Vectorize、Workers AI bindings）
- [ ] **Task 2：D1 Migration**（`post_chunks`、`doc_chunks` 表）
- [ ] **Task 3：Chunk ID + Contextual Retrieval（TDD）**
- [ ] **Task 4：Embedding Pipeline + Hybrid Search** — 197 篇文章 embed 進 Vectorize；實作 Vectorize 語意 + D1 FTS5 BM25 + RRF 融合
- [ ] **Task 5：Auth — Session + Rate Limit（TDD）**（訪客 IP 限額 5 次/日）
- [ ] **Task 6：Login Page**
- [ ] **Task 7：Langfuse Helper**
- [ ] **Task 8：LangGraph State Definition**
- [ ] **Task 9：Research Tools（TDD）** — `search-posts.ts`、`search-docs.ts`、`get-post-detail.ts`
- [ ] **Task 10：`normalize_results` Node（TDD）**
- [ ] **Task 11：Planner、Writer、Critic、Related Posts agents**
- [ ] **Task 12：Graph Builder**
- [ ] **Task 13：Chat SSE API Endpoint**
- [ ] **Task 14：Chat UI**（`AgentSteps`、`QuotaIndicator`、`MessageInput`、`MessageList`、`ChatWidget`、`chat.astro`）
- [ ] **Task 15：Run Embed Pipeline + Smoke Test**
- [ ] **AI 驅動相關文章推薦**（取代純 tag 匹配：40% tag + 30% 分類 + 20% 時近性 + 10% 同系列）
- [ ] **自動 TL;DR 與 description 生成**
- [ ] **自動 tag 建議** — 新文章發布時，根據內容 embedding 推薦應加的 tag
- [ ] **難度分級** — 自動標記文章為「入門 / 進階 / 深度」，寫入 frontmatter
- [ ] **重複主題偵測** — 找出語意相似度高的文章對，提示合併或區隔
- [ ] **文章新鮮度偵測** — 比對爬蟲資料，標記引用了過時 API / 已淘汰工具的文章
- [ ] **互動詞彙表** — hover 技術名詞時 AI 即時解釋，不離開頁面
- [ ] **內容缺口分析** — 分析站內搜尋紀錄，找出讀者在搜但你還沒寫的主題
- [ ] **SEO 優化 agent** — 建議更好的標題、description、內部連結機會

### RAG 設計補強

- [ ] **Semantic Cache threshold 設為 `0.95`**（實作時即設定；`semantic-caching.md` 指出 0.90–0.94 是「相關但不同」的危險區間）
- [ ] **Reranker 加入 `min_keep: 3`**（實作時即設定；`cross-encoder-reranking.md` 明確建議的安全網）
- [ ] **MMR 多樣性重排**（λ = 0.7，在 reranker 後、Writer 前插入）
- [ ] **Adaptive RAG queryType 路由**（`complexity: simple | medium | complex`，simple 跳過 HyDE/Multi-query）
- [ ] **CRAG filter 放寬策略**（零結果時漸進放寬次要 filter → 仍低分 → web search fallback）
- [ ] **Critic 加 answer-relevance 檢查**（不只 grounding，也檢查真的回答了問題）
- [ ] **Critic 加 drift 偵測**（檢查 Research 過程是否偏離原始查詢意圖）

### Harness 基礎建設

- [ ] **Ollama 本地模型整合** — 批次任務（自動 tag、難度分級、TL;DR 生成）改用本地模型，API 成本歸零；研究筆記：`docs/research/ollama-research.md`
- [ ] **設計決策 ADR**（為什麼用 BGE-large？為什麼 chunk 2000？為什麼 cache 0.95？）
- [ ] **RAG pipeline feature flag**（HyDE、Multi-query、Reranker、Critic 各自可開關）
- [ ] **Shadow Mode A/B 比較機制**（開啟 vs 關閉，比較 RAGAS 分數）
- [ ] **Context Checkpoint 系統**（動態壓縮門檻：`threshold = model_context_window * 0.7`，非硬編碼 8000 tokens）

### 網站技術

- [ ] **RSS Feed 加 `<author>` 標籤**
- [ ] **Series 系列化**（RAG 系列、Claude Code 系列、AI Agent 系列正式組織）
- [ ] **排程發布** — 87% 文章集中 2026 年 3 月，設定 `date` 未來日期搭配 CI 定時發布，維持穩定節奏
- [ ] **多語言翻譯 Pipeline（Multi-Agent）** — Translator → Cultural Reviewer → Native Checker

### 爬蟲整合

> 詳細設計：`docs/plan.md` Phase 3、`docs/superpowers/plans/2026-03-12-crawler-integration.md`

- [ ] **實作 `/api/crawl/sync` endpoint**
- [ ] **設定要爬取的技術文件站清單**
- [ ] **實作 Markdown → chunking pipeline**
- [ ] **設定 Cron Trigger 定期爬取**
- [ ] **增量更新機制（modifiedSince）**

---

## P3 長期（3 個月以上）

### AI 進階功能

- [ ] **站長端 episodic memory**（記住寫作偏好、常用範本；參考 Hermes Agent 的 user profile dialectic）
- [ ] **Judge sampling 30%**（簡單查詢跳過 Critic，預期省 20-30% 成本）
- [ ] **BM25 短路邏輯**（BM25 回傳 ≥ 5 結果時跳過向量搜尋）
- [ ] **RAGAS 評估 pipeline + Golden Dataset**（20-25 個測試案例，涵蓋精確查詢、概念解釋、跨文章綜合、不在知識庫、中英混雜五類）
- [ ] **GraphRAG**（從文章中抽取實體與關係，適合跨文章查詢）
- [ ] **自訂文件上傳功能**（PDF / Markdown / URL 三種來源）
- [ ] **學習路徑生成** — 給定目標（如「我想學 RAG」），自動規劃文章閱讀順序
- [ ] **知識地圖** — 視覺化文章之間的概念關係圖

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

## Raw output

```text
**主要問題**

1. 高優先度：TODO 有不少「已做過或已半完成」的項目還被列成待辦，會直接扭曲排序。[docs/TODO.md](/Users/xiaoxu/Projects/quidproquo/docs/TODO.md:64) 把 reading time、series nav、RSS、sitemap、OG、Pagefind 都列在 blog redesign 未完成清單，但 repo 內已有 [astro.config.mjs](/Users/xiaoxu/Projects/quidproquo/astro.config.mjs:12)、[src/plugins/remarkReadingTime.ts](/Users/xiaoxu/Projects/quidproquo/src/plugins/remarkReadingTime.ts:1)、[src/utils/seriesNav.ts](/Users/xiaoxu/Projects/quidproquo/src/utils/seriesNav.ts:1)、[src/pages/rss.xml.ts](/Users/xiaoxu/Projects/quidproquo/src/pages/rss.xml.ts:1)、[src/pages/posts/[...slug].astro](/Users/xiaoxu/Projects/quidproquo/src/pages/posts/%5B...slug%5D.astro:32)。這份清單應先做一次「去重與改狀態」，不然執行時會重工。

2. 高優先度：爬蟲整合也有過時項目。[docs/TODO.md](/Users/xiaoxu/Projects/quidproquo/docs/TODO.md:154) 還列「實作 `/api/crawl/sync` endpoint」與「設定 Cron Trigger」，但 [src/pages/api/crawl/sync.ts](/Users/xiaoxu/Projects/quidproquo/src/pages/api/crawl/sync.ts:1) 已存在，且 [wrangler.jsonc](/Users/xiaoxu/Projects/quidproquo/wrangler.jsonc:10) 已有 cron。這類項目應改成「驗證穩定性 / 補增量更新 / 補監控」，不是再列成 implementation。

3. 高優先度：依賴順序有一處明顯反了。你把「補 213 篇 `type`」放在 [docs/TODO.md](/Users/xiaoxu/Projects/quidproquo/docs/TODO.md:54)，又把「`type` 改 required」放在 [docs/TODO.md](/Users/xiaoxu/Projects/quidproquo/docs/TODO.md:80)，方向是對的，但還缺一個中間步驟：批次回填腳本、人工抽樣規則、失敗回滾方案。因為目前 schema 還是 optional，[src/content.config.ts](/Users/xiaoxu/Projects/quidproquo/src/content.config.ts:17)，一旦直接改 required，build 會先炸。

4. 高優先度：文件開頭說「所有進階技術都必須能關掉、要有 A/B 比較」，但 feature flag 與 shadow mode 被排到 P2，[docs/TODO.md](/Users/xiaoxu/Projects/quidproquo/docs/TODO.md:6)、[docs/TODO.md](/Users/xiaoxu/Projects/quidproquo/docs/TODO.md:139)。同時前面已經排了 deterministic validator、critic 降級、adaptive routing、reranker、MMR 等。這違反你自己的設計鐵律。正確順序應該是：先做 baseline、先做 flag、先做觀測，再加複雜策略。

5. 中高優先度：`MAX_CHUNK_CHARS` 改 1500 不是單點改設定而已。[docs/TODO.md](/Users/xiaoxu/Projects/quidproquo/docs/TODO.md:36) 指向 [src/lib/crawl/config.ts](/Users/xiaoxu/Projects/quidproquo/src/lib/crawl/config.ts:42)，但 TODO 沒寫到後續必須重新 crawl、重新 chunk、重新 embed；否則 D1 / Vectorize 裡舊資料還是 2000-char 切法，程式碼與索引狀態會分裂。

6. 中高優先度：CI 守門應該比 pre-commit 更前面。現在 `check:references` script 確實存在於 [package.json](/Users/xiaoxu/Projects/quidproquo/package.json:15)，但 deploy/preview workflow 都只跑 `pnpm lint`，[.github/workflows/deploy.yml](/Users/xiaoxu/Projects/quidproquo/.github/workflows/deploy.yml:24)、[.github/workflows/preview.yml](/Users/xiaoxu/Projects/quidproquo/.github/workflows/preview.yml:26)。所以 P0 裡真正該先做的是 CI gate；pre-commit 只是第二層，因為 hook 可被略過。

7. 中優先度：`CLAUDE.md` 被放進 P0，我覺得偏高。它對 agent 協作有價值，但對目前最實際的線上風險沒有直接止血效果；相較之下，404、CI、tag 統一、英搜頁都更直接。這項應降到 P1，除非你最近的主要痛點真的是 agent 反覆迷路。

8. 中優先度：RAG Phase 1 被塞進太多「產品功能」與「研究功能」。從 [docs/TODO.md](/Users/xiaoxu/Projects/quidproquo/docs/TODO.md:100) 到 [docs/TODO.md](/Users/xiaoxu/Projects/quidproquo/docs/TODO.md:123) 混著基礎聊天、推薦、TL;DR、自動 tag、新鮮度偵測、互動詞彙表、SEO agent。這些不是同一波。建議拆成：
   - Phase 1A：可用聊天系統
   - Phase 1B：檢索品質改善
   - Phase 1C：內容營運自動化
   否則驗收標準會失焦。

9. 中優先度：TODO 缺少「最小驗收基線」。目前有 RAGAS / Golden Dataset，但放到 P3，[docs/TODO.md](/Users/xiaoxu/Projects/quidproquo/docs/TODO.md:169)。這太晚了。沒有 baseline query set、延遲預算、成本預算、錯誤率預算，就無法判斷 HyDE / reranker / critic 到底是在改善還是在加負擔。

10. 中優先度：效能與無障礙項目缺少量化驗收。像 LCP、CLS、對比度、focus-visible 都是對的方向，但 TODO 沒寫「用哪個工具量、目標值是多少、在哪個頁面驗」。這會讓它們很容易長期停留在「感覺有做」。

11. 低到中優先度：英文搜尋頁是合理且應該保留在前段。因為 [src/pages/search.astro](/Users/xiaoxu/Projects/quidproquo/src/pages/search.astro:6) 確實硬編碼 `zh-TW`，且 `src/pages/en/search.astro` 目前不存在，這項是低成本真缺口。

12. 低到中優先度：RSS `<author>` 是真缺口，但不該跟「RSS Feed 建立」混在一起。RSS 已存在，[src/pages/rss.xml.ts](/Users/xiaoxu/Projects/quidproquo/src/pages/rss.xml.ts:13) 只是 items 沒 author。這類項目應標成「補 metadata」，不是「做 RSS」。

**建議重排**

我會改成這樣：

1. 新的 P0：`check:references` 進 CI、tag 統一、404、英文搜尋頁、chunk 參數調整加上全量重建計畫、把 TODO 已完成項目清掉或改狀態。
2. 新的 P1：批次補 `type`、補 `tldr`、完成 `type` backfill 驗證後再改 schema required、字型/圖片/a11y 的量化修正。
3. 新的 P2：RAG 最小可用版，只做 embed pipeline、search tools、`normalize_results`、SSE chat、最基本 tracing。
4. 新的 P2.5：先補 feature flag、baseline eval、shadow mode，再加 critic、reranker、adaptive routing、MMR。
5. 新的 P3：內容營運型 AI 功能與 GraphRAG、知識地圖、學習路徑。

**遺漏風險**

- 缺 bulk frontmatter 修改的回滾策略。
- 缺 RAG 成本/延遲/品質 baseline。
- 缺「重新 chunk / re-embed」這種資料重建任務。
- 缺 production smoke test 清單，現在只有 build gate，沒有明確的 post-deploy 驗證。
- 缺每個大型 epic 的 definition of done，尤其是 blog redesign 與 RAG。

整體判斷：方向大致正確，但目前這份 TODO 比較像「議題池」不是可執行的 roadmap。先去重、補依賴、把觀測與回退前移，才會變成能真的照著做的清單。


OpenAI Codex v0.121.0 (research preview)
--------
workdir: /Users/xiaoxu/Projects/quidproquo
model: gpt-5.4
provider: openai
approval: never
sandbox: danger-full-access
reasoning effort: medium
reasoning summaries: none
session id: 019daf29-dcf2-7762-83af-4d61009f7481
--------
user
請審查以下 TODO.md 的合理性，從優先順序、技術可行性、任務依賴關係、遺漏風險等面向給出意見：

# quidproquo 任務總清單

> 整合來源：`docs/plan.md`、`docs/superpowers/plans/`、`src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md`
> 最後更新：2026-04-19
>
> **設計鐵律：每個加上去的技術都必須能關掉。**
> 所有進階技術（HyDE、Multi-query、Reranker、Critic...）都必須有 feature flag、有 A/B 比較機制、只為觀測到的失敗而加。

---

## 現況快照

| 指標 | 數值 |
|------|------|
| 總文章數 | 227 篇 |
| 斷連結數 | 49 個（影響約 40 篇文章） |
| 草稿數 | 17 篇 |
| 缺 `type` 欄位 | 213 篇（94%） |
| 缺 `series` 欄位 | 199 篇（88%） |
| 缺 `tldr` | 7 篇 |
| Tag 不一致 | `ai-agent` vs `ai-agents`（35 篇） |

---

## P0 立即執行（低成本、高影響）

### 內容修正

- [x] **修復 49 個內部斷連結**
  - 重災區：`ai/2026-04-01-agent-cli-guidelines.md` 有 10 個斷連結
  - 處理方式：暫時改為 plain text 標註「即將推出」
- [ ] **統一 tag 命名** — `ai-agent`（21 篇）+ `ai-agents`（14 篇）→ 統一為 `ai-agent`

### 爬蟲 Chunker 參數修正

- [ ] **`MAX_CHUNK_CHARS` 降為 1500**（`src/lib/crawl/config.ts:43`；中文 2000 chars ≈ 800–1000 tokens，超出建議範圍；`chunking-strategies.md` 建議上限）

### Harness 基礎建設

- [ ] **建立根目錄 `CLAUDE.md`**（技術棧、目錄結構、開發流程、命名規範、決策理由）
- [ ] **Pre-commit hook（lint + reference check）** — 用 husky 或 simple-git-hooks；「Linter 是法律，prompt 是建議」
- [ ] **`check-post-references.mjs` 加入 CI**（script 已存在但沒跑，導致 49 個斷連結直接上線）

### 網站技術

- [ ] **建立 404 錯誤頁面** — `/src/pages/404.astro`，含搜尋框 + 熱門文章推薦

---

## P1 短期（1–2 週）

### 內容補強

- [ ] **補上 213 篇缺失的 `type` 欄位**（批次腳本或 LLM 自動分類，人工 review）
- [ ] **補上 7 篇缺失的 `tldr`**（Claude 批量生成，人工 review）

### 網站技術

- [ ] **英文版搜尋頁** — `/src/pages/search.astro` 硬編碼 `lang="zh-TW"`，需建立 `/src/pages/en/search.astro`
- [ ] **英文首頁加上 about 區塊**（英文讀者看不懂「Quid Pro Quo」是什麼）
- [ ] **字型載入優化（影響 LCP）** — `<link rel="preload" as="font">` + `font-display: swap`
- [ ] **圖片尺寸 + lazy loading（影響 CLS）** — 啟用 `astro:assets`，markdown 圖片補 `loading="lazy"` 與 width/height
- [ ] **無障礙基本款** — Skip Navigation 連結、`:focus-visible` 鍵盤樣式、驗證 `--text-muted: #999` 對比度
- [ ] **Blog 前端改版**（詳細步驟：`docs/superpowers/plans/2026-03-12-blog-redesign.md`）
  - [ ] Task 1：Icons component + CSS design tokens + PostLayout 更新
  - [ ] Task 2：Nav 改版
  - [ ] Task 3：PostCard 改版
  - [ ] Task 4：Reading time remark plugin + schema 欄位
  - [ ] Task 5：i18n strings 更新
  - [ ] Task 7：Related posts + series nav utilities
  - [ ] Task 8：Article page 改版
  - [ ] Task 10：RSS Feed
  - [ ] Task 11：Sitemap
  - [ ] Task 12：OG Image 自動產生
  - [ ] Task 13：Pagefind 靜態搜尋
  - [ ] Task 14：Final build 驗證

### Harness 基礎建設

- [ ] **Frontmatter `type` 改為 required**（更新 `src/content.config.ts` schema；用 schema 強制，不靠 prompt 請求）
- [ ] **建立 `progress.txt` 機制**（最低成本的 episodic memory，不需要 vector DB）
- [ ] **Session-start hook** — 自動跑 `pnpm lint` + 讀 `progress.txt`
- [ ] **Post skill 加入 Evaluator 節點**（檢查：frontmatter 完整性、內部連結有效性、tag 一致性、標題結構）
- [ ] **工具描述品質規範** — `search_blog_posts` / `search_abstract_index` / `search_docs` 使用時機區分明確化，每個工具加上何時使用 / 何時不使用 / 預期回傳格式

### RAG 設計修正

- [ ] **Deterministic Validation Node（Stripe Blueprint 模式）** — 在 Writer → Critic 之間插入確定性驗證（Markdown 語法、source URL、Mermaid 語法）
- [ ] **Critic 失敗降級策略** — 重試 2 次仍低於門檻 → 標註「⚠️ 此回答可能不完整」，停止呼叫 LLM
- [ ] **Prompt 改用「描述終態」風格**（描述「成功的回答長什麼樣」而非「按步驟做」）

---

## P2 中期（1–2 個月）

### AI Agent 應用實作

> 詳細實作步驟：`docs/superpowers/plans/2026-03-21-rag-phase1.md`

- [ ] **Task 1：安裝依賴 + 環境設定**（React、vitest、Vectorize、Workers AI bindings）
- [ ] **Task 2：D1 Migration**（`post_chunks`、`doc_chunks` 表）
- [ ] **Task 3：Chunk ID + Contextual Retrieval（TDD）**
- [ ] **Task 4：Embedding Pipeline + Hybrid Search** — 197 篇文章 embed 進 Vectorize；實作 Vectorize 語意 + D1 FTS5 BM25 + RRF 融合
- [ ] **Task 5：Auth — Session + Rate Limit（TDD）**（訪客 IP 限額 5 次/日）
- [ ] **Task 6：Login Page**
- [ ] **Task 7：Langfuse Helper**
- [ ] **Task 8：LangGraph State Definition**
- [ ] **Task 9：Research Tools（TDD）** — `search-posts.ts`、`search-docs.ts`、`get-post-detail.ts`
- [ ] **Task 10：`normalize_results` Node（TDD）**
- [ ] **Task 11：Planner、Writer、Critic、Related Posts agents**
- [ ] **Task 12：Graph Builder**
- [ ] **Task 13：Chat SSE API Endpoint**
- [ ] **Task 14：Chat UI**（`AgentSteps`、`QuotaIndicator`、`MessageInput`、`MessageList`、`ChatWidget`、`chat.astro`）
- [ ] **Task 15：Run Embed Pipeline + Smoke Test**
- [ ] **AI 驅動相關文章推薦**（取代純 tag 匹配：40% tag + 30% 分類 + 20% 時近性 + 10% 同系列）
- [ ] **自動 TL;DR 與 description 生成**
- [ ] **自動 tag 建議** — 新文章發布時，根據內容 embedding 推薦應加的 tag
- [ ] **難度分級** — 自動標記文章為「入門 / 進階 / 深度」，寫入 frontmatter
- [ ] **重複主題偵測** — 找出語意相似度高的文章對，提示合併或區隔
- [ ] **文章新鮮度偵測** — 比對爬蟲資料，標記引用了過時 API / 已淘汰工具的文章
- [ ] **互動詞彙表** — hover 技術名詞時 AI 即時解釋，不離開頁面
- [ ] **內容缺口分析** — 分析站內搜尋紀錄，找出讀者在搜但你還沒寫的主題
- [ ] **SEO 優化 agent** — 建議更好的標題、description、內部連結機會

### RAG 設計補強

- [ ] **Semantic Cache threshold 設為 `0.95`**（實作時即設定；`semantic-caching.md` 指出 0.90–0.94 是「相關但不同」的危險區間）
- [ ] **Reranker 加入 `min_keep: 3`**（實作時即設定；`cross-encoder-reranking.md` 明確建議的安全網）
- [ ] **MMR 多樣性重排**（λ = 0.7，在 reranker 後、Writer 前插入）
- [ ] **Adaptive RAG queryType 路由**（`complexity: simple | medium | complex`，simple 跳過 HyDE/Multi-query）
- [ ] **CRAG filter 放寬策略**（零結果時漸進放寬次要 filter → 仍低分 → web search fallback）
- [ ] **Critic 加 answer-relevance 檢查**（不只 grounding，也檢查真的回答了問題）
- [ ] **Critic 加 drift 偵測**（檢查 Research 過程是否偏離原始查詢意圖）

### Harness 基礎建設

- [ ] **Ollama 本地模型整合** — 批次任務（自動 tag、難度分級、TL;DR 生成）改用本地模型，API 成本歸零；研究筆記：`docs/research/ollama-research.md`
- [ ] **設計決策 ADR**（為什麼用 BGE-large？為什麼 chunk 2000？為什麼 cache 0.95？）
- [ ] **RAG pipeline feature flag**（HyDE、Multi-query、Reranker、Critic 各自可開關）
- [ ] **Shadow Mode A/B 比較機制**（開啟 vs 關閉，比較 RAGAS 分數）
- [ ] **Context Checkpoint 系統**（動態壓縮門檻：`threshold = model_context_window * 0.7`，非硬編碼 8000 tokens）

### 網站技術

- [ ] **RSS Feed 加 `<author>` 標籤**
- [ ] **Series 系列化**（RAG 系列、Claude Code 系列、AI Agent 系列正式組織）
- [ ] **排程發布** — 87% 文章集中 2026 年 3 月，設定 `date` 未來日期搭配 CI 定時發布，維持穩定節奏
- [ ] **多語言翻譯 Pipeline（Multi-Agent）** — Translator → Cultural Reviewer → Native Checker

### 爬蟲整合

> 詳細設計：`docs/plan.md` Phase 3、`docs/superpowers/plans/2026-03-12-crawler-integration.md`

- [ ] **實作 `/api/crawl/sync` endpoint**
- [ ] **設定要爬取的技術文件站清單**
- [ ] **實作 Markdown → chunking pipeline**
- [ ] **設定 Cron Trigger 定期爬取**
- [ ] **增量更新機制（modifiedSince）**

---

## P3 長期（3 個月以上）

### AI 進階功能

- [ ] **站長端 episodic memory**（記住寫作偏好、常用範本；參考 Hermes Agent 的 user profile dialectic）
- [ ] **Judge sampling 30%**（簡單查詢跳過 Critic，預期省 20-30% 成本）
- [ ] **BM25 短路邏輯**（BM25 回傳 ≥ 5 結果時跳過向量搜尋）
- [ ] **RAGAS 評估 pipeline + Golden Dataset**（20-25 個測試案例，涵蓋精確查詢、概念解釋、跨文章綜合、不在知識庫、中英混雜五類）
- [ ] **GraphRAG**（從文章中抽取實體與關係，適合跨文章查詢）
- [ ] **自訂文件上傳功能**（PDF / Markdown / URL 三種來源）
- [ ] **學習路徑生成** — 給定目標（如「我想學 RAG」），自動規劃文章閱讀順序
- [ ] **知識地圖** — 視覺化文章之間的概念關係圖

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
codex
我先對照 repo 現況與被引用的規劃文件，確認這份 TODO 跟實際程式結構、已有腳本、可落地順序是否一致，再整理成優先順序與風險審查。
exec
/bin/zsh -lc "pwd && rg --files | rg '"'^(docs/plan'"\\.md|docs/superpowers/plans/2026-03-12-blog-redesign\\.md|docs/superpowers/plans/2026-03-21-rag-phase1\\.md|docs/superpowers/plans/2026-03-12-crawler-integration\\.md|src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap\\.md|src/lib/crawl/config\\.ts|src/content\\.config\\.ts|package\\.json|scripts/|src/pages/search\\.astro|src/pages/en/search\\.astro|src/pages/404\\.astro)')" in /Users/xiaoxu/Projects/quidproquo
 exited 1 in 0ms:
zsh:1: parse error near `)'

exec
/bin/zsh -lc "rg -n \"check-post-references|reference check|simple-git-hooks|husky|pagefind|Vectorize|LangGraph|Langfuse|404|search\\.astro|type:|series:|tldr:\" -S ." in /Users/xiaoxu/Projects/quidproquo
 succeeded in 163ms:
./src/content.config.ts:14:    tldr: z.string().optional(),
./src/content.config.ts:17:    type: z.enum(['debug', 'deep-dive', 'guide', 'project']).optional(),
./src/content.config.ts:19:    series: z.object({
./src/pages/api/posts.ts:14:  tldr: string | null;
./src/pages/search.astro:2:// src/pages/search.astro
./src/pages/search.astro:10:    <link href="/pagefind/pagefind-ui.css" rel="stylesheet" />
./src/pages/search.astro:16:<script src="/pagefind/pagefind-ui.js" is:inline></script>
./pnpm-lock.yaml:60:      pagefind:
./pnpm-lock.yaml:688:  '@pagefind/darwin-arm64@1.4.0':
./pnpm-lock.yaml:693:  '@pagefind/darwin-x64@1.4.0':
./pnpm-lock.yaml:698:  '@pagefind/freebsd-x64@1.4.0':
./pnpm-lock.yaml:703:  '@pagefind/linux-arm64@1.4.0':
./pnpm-lock.yaml:708:  '@pagefind/linux-x64@1.4.0':
./pnpm-lock.yaml:713:  '@pagefind/windows-x64@1.4.0':
./pnpm-lock.yaml:1938:  pagefind@1.4.0:
./pnpm-lock.yaml:3215:  '@pagefind/darwin-arm64@1.4.0':
./pnpm-lock.yaml:3218:  '@pagefind/darwin-x64@1.4.0':
./pnpm-lock.yaml:3221:  '@pagefind/freebsd-x64@1.4.0':
./pnpm-lock.yaml:3224:  '@pagefind/linux-arm64@1.4.0':
./pnpm-lock.yaml:3227:  '@pagefind/linux-x64@1.4.0':
./pnpm-lock.yaml:3230:  '@pagefind/windows-x64@1.4.0':
./pnpm-lock.yaml:3811:      domelementtype: 2.3.0
./pnpm-lock.yaml:3819:      domelementtype: 2.3.0
./pnpm-lock.yaml:3824:      domelementtype: 2.3.0
./pnpm-lock.yaml:4818:  pagefind@1.4.0:
./pnpm-lock.yaml:4820:      '@pagefind/darwin-arm64': 1.4.0
./pnpm-lock.yaml:4821:      '@pagefind/darwin-x64': 1.4.0
./pnpm-lock.yaml:4822:      '@pagefind/freebsd-x64': 1.4.0
./pnpm-lock.yaml:4823:      '@pagefind/linux-arm64': 1.4.0
./pnpm-lock.yaml:4824:      '@pagefind/linux-x64': 1.4.0
./pnpm-lock.yaml:4825:      '@pagefind/windows-x64': 1.4.0
./README.md:57:| `VECTORIZE_INDEX` | Vectorize | 向量搜尋 |
./package-lock.json:29:        "pagefind": "^1.4.0",
./package-lock.json:1819:    "node_modules/@pagefind/darwin-arm64": {
./package-lock.json:1821:      "resolved": "https://registry.npmjs.org/@pagefind/darwin-arm64/-/darwin-arm64-1.4.0.tgz",
./package-lock.json:1833:    "node_modules/@pagefind/darwin-x64": {
./package-lock.json:1835:      "resolved": "https://registry.npmjs.org/@pagefind/darwin-x64/-/darwin-x64-1.4.0.tgz",
./package-lock.json:1847:    "node_modules/@pagefind/freebsd-x64": {
./package-lock.json:1849:      "resolved": "https://registry.npmjs.org/@pagefind/freebsd-x64/-/freebsd-x64-1.4.0.tgz",
./package-lock.json:1861:    "node_modules/@pagefind/linux-arm64": {
./package-lock.json:1863:      "resolved": "https://registry.npmjs.org/@pagefind/linux-arm64/-/linux-arm64-1.4.0.tgz",
./package-lock.json:1875:    "node_modules/@pagefind/linux-x64": {
./package-lock.json:1877:      "resolved": "https://registry.npmjs.org/@pagefind/linux-x64/-/linux-x64-1.4.0.tgz",
./package-lock.json:1889:    "node_modules/@pagefind/windows-x64": {
./package-lock.json:1891:      "resolved": "https://registry.npmjs.org/@pagefind/windows-x64/-/windows-x64-1.4.0.tgz",
./package-lock.json:6186:    "node_modules/pagefind": {
./package-lock.json:6188:      "resolved": "https://registry.npmjs.org/pagefind/-/pagefind-1.4.0.tgz",
./package-lock.json:6193:        "pagefind": "lib/runner/bin.cjs"
./package-lock.json:6196:        "@pagefind/darwin-arm64": "1.4.0",
./package-lock.json:6197:        "@pagefind/darwin-x64": "1.4.0",
./package-lock.json:6198:        "@pagefind/freebsd-x64": "1.4.0",
./package-lock.json:6199:        "@pagefind/linux-arm64": "1.4.0",
./package-lock.json:6200:        "@pagefind/linux-x64": "1.4.0",
./package-lock.json:6201:        "@pagefind/windows-x64": "1.4.0"
./src/lib/crawl/config.ts:27:    name: 'Cloudflare Vectorize',
./astro.config.mjs:16:      name: 'pagefind',
./astro.config.mjs:20:          execSync(`npx pagefind --site ${dir.pathname}`, { stdio: 'inherit' });
./docs/superpowers/specs/2026-03-20-rag-design.md:6:**Stack:** LangGraph.js (`@langchain/langgraph ^0.2`) + Cloudflare Workers (nodejs_compat) + Langfuse Cloud
./docs/superpowers/specs/2026-03-20-rag-design.md:53:| Source | Table | Vectorize type |
./docs/superpowers/specs/2026-03-20-rag-design.md:55:| Blog posts (Markdown) | `posts` → `post_chunks` | `type: 'post'` |
./docs/superpowers/specs/2026-03-20-rag-design.md:56:| External crawled docs | `doc_chunks` | `type: 'doc'` |
./docs/superpowers/specs/2026-03-20-rag-design.md:57:| Custom uploaded docs | `custom_docs` | `type: 'custom'` |
./docs/superpowers/specs/2026-03-20-rag-design.md:95:5. Store `image_url` in Vectorize metadata
./docs/superpowers/specs/2026-03-20-rag-design.md:103:2. Store as `links: ["{\"text\":\"...\",\"url\":\"...\"}"]` (JSON-stringified array) in Vectorize metadata
./docs/superpowers/specs/2026-03-20-rag-design.md:106:### 4.4 Vectorize Metadata Schema
./docs/superpowers/specs/2026-03-20-rag-design.md:110:  type: 'post' | 'doc' | 'custom',
./docs/superpowers/specs/2026-03-20-rag-design.md:123:  // NOTE: Vectorize metadata only supports string|number|boolean values.
./docs/superpowers/specs/2026-03-20-rag-design.md:132:### 4.5 Vectorize Update Strategy
./docs/superpowers/specs/2026-03-20-rag-design.md:134:Vectorize has no true upsert. On every sync:
./docs/superpowers/specs/2026-03-20-rag-design.md:138:**`chunk_id` formula by source type:**
./docs/superpowers/specs/2026-03-20-rag-design.md:158:Maintain a separate Vectorize namespace (`VECTORIZE_ABSTRACT`) for document summaries only.
./docs/superpowers/specs/2026-03-20-rag-design.md:170:## 5. LangGraph Agentic Pipeline
./docs/superpowers/specs/2026-03-20-rag-design.md:203:- Streams question to user via SSE, then calls `interrupt()` (LangGraph human-in-the-loop)
./docs/superpowers/specs/2026-03-20-rag-design.md:215:- `search_blog_posts(query, filters?)` — Vectorize, type=post, optional metadata filters (category, lang, date_range)
./docs/superpowers/specs/2026-03-20-rag-design.md:216:- `search_docs(query, filters?)` — Vectorize, type=doc|custom
./docs/superpowers/specs/2026-03-20-rag-design.md:219:- `find_images(query)` — Vectorize metadata image search
./docs/superpowers/specs/2026-03-20-rag-design.md:227:**Per-session tool result caching:** Same query within session hits cache, not Vectorize.
./docs/superpowers/specs/2026-03-20-rag-design.md:232:Implemented as a dedicated LangGraph node (`normalize_results`) placed between Research and the specialist nodes — not a LangChain callback. Wired as: `graph.addEdge('research', 'normalize_results')`.
./docs/superpowers/specs/2026-03-20-rag-design.md:234:1. Parse JSON-stringified `images` and `links` from Vectorize metadata back to typed arrays
./docs/superpowers/specs/2026-03-20-rag-design.md:240:7. Writes normalized results to `state.search_results` using LangGraph Annotation reducer: `{ reducer: (a, b) => [...a, ...b] }` (required for parallel Research + Abstract-Search fan-in)
./docs/superpowers/specs/2026-03-20-rag-design.md:285:- Queries Vectorize with conversation summary
./docs/superpowers/specs/2026-03-20-rag-design.md:289:### 5.3 Graph Structure (LangGraph.js wiring)
./docs/superpowers/specs/2026-03-20-rag-design.md:319:### 5.4 LangGraph State Definition
./docs/superpowers/specs/2026-03-20-rag-design.md:341:  diagram: Annotation<{ type: 'mermaid' | 'image'; content: string } | undefined>(),
./docs/superpowers/specs/2026-03-20-rag-design.md:360:// Conceptual shape only — see StateAnnotation above for LangGraph-compatible definition
./docs/superpowers/specs/2026-03-20-rag-design.md:391:  diagram?: { type: 'mermaid' | 'image'; content: string }
./docs/superpowers/specs/2026-03-20-rag-design.md:429:| **HyDE** | Planner generates hypothetical answer → embed it → use for Vectorize search |
./docs/superpowers/specs/2026-03-20-rag-design.md:432:| **Hybrid Search** | Vectorize (semantic) + D1 FTS/fts5 (BM25 keyword) → combined ranking. Requires `CREATE VIRTUAL TABLE` in Section 13. |
./docs/superpowers/specs/2026-03-20-rag-design.md:434:| **Semantic Cache** | Query embedding compared to cached queries (Vectorize); cosine > 0.92 → return cached response |
./docs/superpowers/specs/2026-03-20-rag-design.md:447:Uses a dedicated Vectorize namespace (`VECTORIZE_CACHE`):
./docs/superpowers/specs/2026-03-20-rag-design.md:453:5. Cache TTL: 24 hours. Store `created_at` (Unix timestamp) in Vectorize metadata. Scheduled Worker cron (reuse existing or add `0 3 * * *` daily) queries `VECTORIZE_CACHE` for vectors with `created_at < now - 86400`, then calls `vectorize.deleteByIds([...])` in batches of 100.
./docs/superpowers/specs/2026-03-20-rag-design.md:466:| **Circuit breaker** | If Vectorize or Workers AI errors > 3 in 60s → graceful degradation mode (text-only, no retrieval) |
./docs/superpowers/specs/2026-03-20-rag-design.md:530:- 👍👎 feedback: stored in D1 `feedback` table, linked to Langfuse trace
./docs/superpowers/specs/2026-03-20-rag-design.md:549:- Vectorize index status: vector count by type, last updated
./docs/superpowers/specs/2026-03-20-rag-design.md:564:- Langfuse trace link per conversation
./docs/superpowers/specs/2026-03-20-rag-design.md:589:## 12. Langfuse Integration
./docs/superpowers/specs/2026-03-20-rag-design.md:641:  chunk_id UNINDEXED,   -- sha256 ID, used to join Vectorize results
./docs/superpowers/specs/2026-03-20-rag-design.md:653:-- migration 0003 (Phase 2) — LangGraph D1 checkpointer
./docs/superpowers/specs/2026-03-20-rag-design.md:761:| `VECTORIZE_INDEX` | Vectorize | Main knowledge index |
./docs/superpowers/specs/2026-03-20-rag-design.md:762:| `VECTORIZE_CACHE` | Vectorize | Semantic cache |
./docs/superpowers/specs/2026-03-20-rag-design.md:763:| `VECTORIZE_ABSTRACT` | Vectorize | Document summary index |
./docs/superpowers/specs/2026-03-20-rag-design.md:778:- Basic LangGraph: Planner → Research → Writer → Critic
./docs/superpowers/specs/2026-03-20-rag-design.md:782:- Langfuse integration
./docs/superpowers/specs/2026-03-20-rag-design.md:810:│   │   ├── graph.ts              # LangGraph graph definition
./docs/superpowers/specs/2026-03-12-blog-redesign-design.md:189:| **Search** | Pagefind (static search, zero server cost on Cloudflare Pages) — index at build time, UI via `@pagefind/default-ui` |
./docs/superpowers/specs/2026-03-12-blog-redesign-design.md:192:| **Series** | New optional frontmatter field `series: { name, order }` — series nav box rendered when present (see §5.7) |
./docs/superpowers/specs/2026-03-12-blog-redesign-design.md:203:Rendered only when the post has `series: { name: string, order: number }` in frontmatter.
./docs/superpowers/plans/2026-03-21-rag-phase1.md:5:**Goal:** Build a working end-to-end RAG chat system on quidproquo — embed blog posts + crawled docs into Vectorize, expose a streaming chat API backed by a basic LangGraph agent (Planner→Research→normalize_results→Writer→Critic→Related Posts), add session auth, and wire up a minimal `/chat` page.
./docs/superpowers/plans/2026-03-21-rag-phase1.md:7:**Architecture:** Astro SSR + Cloudflare Workers (nodejs_compat). LangGraph.js graph compiled with `MemorySaver` (single-turn in Phase 1). All Cloudflare bindings accessed via `env` from `cloudflare:workers`. React island for chat UI.
./docs/superpowers/plans/2026-03-21-rag-phase1.md:24:| `src/lib/langfuse.ts` | Thin Langfuse HTTP trace/span helper |
./docs/superpowers/plans/2026-03-21-rag-phase1.md:26:| `src/lib/embed/pipeline.ts` | Orchestrate chunk→embed→Vectorize upsert for all source types |
./docs/superpowers/plans/2026-03-21-rag-phase1.md:28:| `src/lib/rag/tools/search-posts.ts` | `search_blog_posts` tool — Vectorize query, type=post |
./docs/superpowers/plans/2026-03-21-rag-phase1.md:29:| `src/lib/rag/tools/search-docs.ts` | `search_docs` tool — Vectorize query, type=doc\|custom |
./docs/superpowers/plans/2026-03-21-rag-phase1.md:36:| `src/lib/rag/agents/related-posts.ts` | Related Posts node — Vectorize query on conversation |
./docs/superpowers/plans/2026-03-21-rag-phase1.md:150:# Vectorize indexes
./docs/superpowers/plans/2026-03-21-rag-phase1.md:172:git commit -m "chore(setup): add LangGraph, React, Langfuse deps and CF bindings"
./docs/superpowers/plans/2026-03-21-rag-phase1.md:195:-- post_chunks.id = sha256 chunk_id (source of truth for Vectorize join)
./docs/superpowers/plans/2026-03-21-rag-phase1.md:330:  type: SourceType,
./docs/superpowers/plans/2026-03-21-rag-phase1.md:362:        type: 'post',
./docs/superpowers/plans/2026-03-21-rag-phase1.md:376:      type: 'doc',
./docs/superpowers/plans/2026-03-21-rag-phase1.md:385:    const result = buildContextualChunk('Raw content.', { type: 'post' })
./docs/superpowers/plans/2026-03-21-rag-phase1.md:403:  type: 'post'
./docs/superpowers/plans/2026-03-21-rag-phase1.md:410:  type: 'doc' | 'custom'
./docs/superpowers/plans/2026-03-21-rag-phase1.md:458:The pipeline embeds chunks into Vectorize. No unit tests here (requires Workers bindings) — tested manually via `wrangler dev`.
./docs/superpowers/plans/2026-03-21-rag-phase1.md:471:  VECTORIZE_INDEX: VectorizeIndex
./docs/superpowers/plans/2026-03-21-rag-phase1.md:507:  const vectors: VectorizeVector[] = []
./docs/superpowers/plans/2026-03-21-rag-phase1.md:512:        type: 'post',
./docs/superpowers/plans/2026-03-21-rag-phase1.md:525:          type: 'post',
./docs/superpowers/plans/2026-03-21-rag-phase1.md:562:  const vectors: VectorizeVector[] = []
./docs/superpowers/plans/2026-03-21-rag-phase1.md:567:        type: 'doc',
./docs/superpowers/plans/2026-03-21-rag-phase1.md:579:          type: 'doc',
./docs/superpowers/plans/2026-03-21-rag-phase1.md:962:## Task 7: Langfuse Helper
./docs/superpowers/plans/2026-03-21-rag-phase1.md:967:No unit tests — Langfuse is a side-effect (HTTP call). Verified by checking Langfuse dashboard.
./docs/superpowers/plans/2026-03-21-rag-phase1.md:975:interface LangfuseEnv {
./docs/superpowers/plans/2026-03-21-rag-phase1.md:982:  const e = env as unknown as LangfuseEnv
./docs/superpowers/plans/2026-03-21-rag-phase1.md:1070:## Task 8: LangGraph State Definition
./docs/superpowers/plans/2026-03-21-rag-phase1.md:1091:  type: 'post' | 'doc' | 'custom'
./docs/superpowers/plans/2026-03-21-rag-phase1.md:1130:  diagram: Annotation<{ type: 'mermaid' | 'image'; content: string } | undefined>({
./docs/superpowers/plans/2026-03-21-rag-phase1.md:1157:git commit -m "feat(rag): LangGraph state annotation definition"
./docs/superpowers/plans/2026-03-21-rag-phase1.md:1178:interface Env { VECTORIZE_INDEX: VectorizeIndex; AI: Ai }
./docs/superpowers/plans/2026-03-21-rag-phase1.md:1191:    const filter: VectorizeVectorMetadataFilter = { type: { $eq: 'post' } }
./docs/superpowers/plans/2026-03-21-rag-phase1.md:1213:        type: 'post',
./docs/superpowers/plans/2026-03-21-rag-phase1.md:1241:interface Env { VECTORIZE_INDEX: VectorizeIndex; AI: Ai }
./docs/superpowers/plans/2026-03-21-rag-phase1.md:1254:    const filter: VectorizeVectorMetadataFilter = { type: { $in: ['doc', 'custom'] } }
./docs/superpowers/plans/2026-03-21-rag-phase1.md:1275:        type: String(meta.type ?? 'doc') as 'doc' | 'custom',
./docs/superpowers/plans/2026-03-21-rag-phase1.md:1281:    description: 'Search external technical documentation (Cloudflare D1, Workers, Vectorize, Astro). Use this for technical questions about these platforms.',
./docs/superpowers/plans/2026-03-21-rag-phase1.md:1733:interface Env { VECTORIZE_INDEX: VectorizeIndex; AI: Ai; DB: D1Database }
./docs/superpowers/plans/2026-03-21-rag-phase1.md:1746:    filter: { type: { $eq: 'post' } },
./docs/superpowers/plans/2026-03-21-rag-phase1.md:1874:git commit -m "feat(rag): LangGraph Phase 1 graph — Planner→Research→Writer→Critic→RelatedPosts"
./docs/superpowers/plans/2026-03-21-rag-phase1.md:1905:function sseEvent(type: string, data: unknown): string {
./docs/superpowers/plans/2026-03-21-rag-phase1.md:1947:      const send = (type: string, data: unknown) => {
./docs/superpowers/plans/2026-03-21-rag-phase1.md:2037:        send('error', { type: 'internal', message })
./docs/superpowers/plans/2026-03-21-rag-phase1.md:2070:git commit -m "feat(api): SSE chat endpoint with auth, rate limiting, and Langfuse tracing"
./docs/superpowers/plans/2026-03-21-rag-phase1.md:2396:In `src/pages/search.astro`, add a link:
./docs/superpowers/plans/2026-03-21-rag-phase1.md:2441:- [ ] **Step 15.3: Verify vectors in Vectorize**
./docs/superpowers/plans/2026-03-21-rag-phase1.md:2469:git commit -m "feat(rag): Phase 1 complete — end-to-end RAG chat with LangGraph on CF Workers"
./docs/superpowers/plans/2026-03-21-rag-phase1.md:2477:- ✅ Blog posts + crawled docs embedded in Vectorize with contextual retrieval
./docs/superpowers/plans/2026-03-21-rag-phase1.md:2478:- ✅ LangGraph agent (Planner→Research→Writer→Critic→RelatedPosts) running on CF Workers
./docs/superpowers/plans/2026-03-21-rag-phase1.md:2482:- ✅ Langfuse traces for every conversation
./docs/data.md:9:建議：移除或標註「即將推出」，避免讀者點擊後 404
./docs/data.md:10:2. 缺少 404 錯誤頁面
./docs/data.md:11:目前沒有自訂 404 頁面，使用者遇到斷連結會看到預設錯誤畫面
./docs/data.md:12:建議：建立 /src/pages/404.astro，提供搜尋框與熱門文章推薦
./docs/data.md:22:/src/pages/search.astro 硬編碼 lang="zh-TW"，無英文版本
./docs/data.md:23:建議：建立 /src/pages/en/search.astro 或動態偵測語系
./docs/data.md:85:你的部落格已經寫了 30+ 篇 AI Agent 文章，而且基礎設施（D1、Vectorize、Workers AI、Crawl Pipeline）都已配置好。以下是如何把「自己寫的東西」實際用在「自己的平台」上：
./docs/data.md:89:Crawl Pipeline（Browser Rendering → D1） LangGraph Agent 節點（9 個已設計）
./docs/data.md:90:D1 posts + post_chunks + doc_chunks 表 Vectorize 嵌入寫入/查詢
./docs/data.md:91:Vectorize Index 已建立（1024 維） /api/chat 對話端點
./docs/data.md:101:                                 ├─ Vectorize (語意)
./docs/data.md:107:現有資源：Vectorize index 已建、D1 已有 post_chunks 表、BGE 模型已綁定
./docs/data.md:113:當前文章 embedding → Vectorize 最近鄰查詢
./docs/data.md:154:你的 RAG 設計文件已經規劃了完整的 9 節點 LangGraph pipeline：
./docs/data.md:166:Month 2 Chat UI + RAG 對話 高 高 LangGraph Agent Pipeline
./docs/data.md:211:│ Research  │───┬── search_blog_posts（Vectorize 語意搜尋）
./docs/data.md:252:語意搜尋 Vectorize + BGE-large（1024 維） 理解「意思相近」的查詢
./docs/data.md:253:關鍵字搜尋 D1 FTS5 / BM25 精確匹配專有名詞如 LangGraph
./docs/data.md:330:D1 post_chunks / doc_chunks 表 Embedding Pipeline（chunk → embed → Vectorize）
./docs/data.md:331:Vectorize Index（1024 維，已建） LangGraph 6 個 Agent 節點
./docs/data.md:339:Task 1：安裝依賴（LangGraph、React、Langfuse）
./docs/data.md:342:Task 4：Embedding Pipeline（contextual chunk → Vectorize upsert）
./docs/data.md:343:Task 5：LangGraph Agent 節點（Planner → Research → Normalize → Writer → Critic → Related）
./docs/data.md:367:Clarifier Planner 判斷問題模糊時 反問使用者以澄清需求，使用 LangGraph interrupt() 暫停等待回覆
./docs/data.md:371:Related Posts 每次回覆結束時 用對話摘要向 Vectorize 查詢相關文章推薦
./docs/data.md:390:Hybrid Search Vectorize（語意）+ D1 FTS5（BM25 關鍵字）→ 合併排序 專有名詞不漏、語意相近也抓得到
./docs/data.md:406:  data TEXT NOT NULL,          -- 序列化的 LangGraph state
./docs/data.md:413:讀者可以多輪追問（「那 LangGraph 呢？」→ 系統記得前面在聊 Agent 框架）
./docs/data.md:431:/admin/embed 查看 Vectorize 狀態、調整 chunking 參數、預覽分 chunk 結果、手動觸發 re-embed
./docs/data.md:563:設計文件中 Hybrid Search 永遠兩路並行。對於像「LangGraph 是什麼？」這種精確名詞查詢，BM25 已經足夠。
./docs/data.md:565:建議：加入 BM25 短路條件，減少不必要的 embedding + Vectorize 呼叫。
./docs/data.md:608:LangGraph 狀態管理 TypedDict StateAnnotation ✅
./docs/data.md:609:Langfuse 可觀測性 Section 12 完整 trace 結構 ✅
./docs/data.md:641:結論：設計文件的整體架構與文章高度一致（LangGraph 圖結構、Generator-Evaluator、Hybrid Search、Contextual Retrieval 等核心模式都正確實作），但在 具體參數（cache 門檻、chunk 大小）和 防禦性機制（min-keep、MMR、filter 放寬、drift 偵測）上有遺漏。前 3 項是改個數字就能修的，建議在 Phase 1 實作前先更新設計文件。
./docs/data.md:659:你的設計文件中 LangGraph pipeline 全部是 agentic 節點（Planner → Research → Writer → Critic），沒有任何確定性驗證步驟。
./docs/data.md:684:記錄到 Langfuse 供後續分析
./docs/data.md:749:19. 框架選擇風險：LangGraph 的 Dependency 成本
./docs/data.md:756:「如果只需要『品質差就重試一次』，LangGraph 是殺雞用牛刀」
./docs/data.md:762:問題：Phase 1 可能不需要 LangGraph 的完整圖結構。引入 @langchain/langgraph + @langchain/anthropic 會大幅增加 bundle size 和 Workers 冷啟動時間。
./docs/data.md:767:Phase 2 再引入 LangGraph（真正需要條件分支、並行、Clarifier interrupt 時）
./docs/data.md:768:或者接受 LangGraph 的成本，但要測量 Workers 冷啟動影響
./docs/data.md:776:可觀測性（Langfuse） Section 12 完整 trace 結構 ✅
./docs/data.md:777:使用者回饋（👍👎） D1 feedback 表 + Langfuse 連動 ✅
./docs/data.md:801:19 評估 Phase 1 是否真需要 LangGraph langgraph-agent-orchestration.md + agent-frameworks-2026.md 🟡 P1
./docs/data.md:803:你的設計文件在 大架構層面 與文章高度一致（Generator-Evaluator、Hybrid Search、Contextual Retrieval、LangGraph 圖結構、Langfuse 觀測性）。
./docs/data.md:861:內部連結驗證 ⚠️ 有 check-post-references.mjs 但不在 CI 中執行，49 個斷連結照樣通過
./docs/data.md:935:「需要 Reranker 才能排好」 BGE-Reranker Vectorize 本身的 cosine 排序可能夠
./docs/data.md:937:「需要 LangGraph 才能管理流程」 整個 pipeline Phase 1 可能純函數就夠
./docs/data.md:947:H3 加 pre-commit hook（lint + reference check） 你的「Linter 是法律」原則。不讓斷連結和 lint 錯誤進入 repo
./docs/data.md:948:H4 把 check-post-references.mjs 加入 CI 49 個斷連結是「prompt 是建議」的直接後果
./src/content/posts/tech/2026-03-27-cloudflare-r2-object-storage.md:7:tldr: "R2 是 Cloudflare 的物件儲存，S3 相容 API、零 egress 費用、Workers 原生 binding。媒體密集的應用不用再擔心流量帳單。"
./src/content/posts/tech/2026-03-27-cloudflare-r2-object-storage.md:59:      if (!object) return new Response('Not Found', { status: 404 });
./references/chatbot-development.md:75:### Langfuse
./references/chatbot-development.md:99:- Cloudflare Vectorize + D1 + Workers AI
./docs/yt-to-post-pipeline.md:67:tldr: "一句話摘要"
./docs/yt-to-post-pipeline.md:114:tldr: "{tldr}"
./src/content/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness.md:7:tldr: "Pi 是 Mario Zechner 用 TypeScript 打造的極簡 coding agent，只有 4 個核心工具（read、write、edit、bash）和 300 字 system prompt。透過 Extensions、Skills、Prompt Templates 擴充，跑在 Bun runtime 上。Ollama 已內建 `ollama launch pi` 一鍵啟動。"
./docs/superpowers/plans/2026-03-12-blog-d1-devlog-skill.md:21:├── wrangler.jsonc                        # D1, Vectorize, AI, R2 bindings
./docs/superpowers/plans/2026-03-12-blog-d1-devlog-skill.md:218:    tldr: z.string().optional(),
./docs/superpowers/plans/2026-03-12-blog-d1-devlog-skill.md:234:tldr: "D1 batch 單次上限 100 筆，用 chunkArray + Promise.all 分批送"
./docs/superpowers/plans/2026-03-12-blog-d1-devlog-skill.md:958:tldr: ""
./docs/superpowers/plans/2026-03-12-blog-d1-devlog-skill.md:1339:  tldr: string | null;
./src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:14:tldr: "用自己寫的 30+ 篇 RAG/Agent 文章交叉檢視部落格現狀，整理出橫跨內容品質、網站技術、RAG 設計修正、Harness 基礎建設、AI Agent 應用的完整改進清單，按優先級排列、不分階段。"
./src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:28:- **基礎設施**：Vectorize、D1、Workers AI 都已綁定，但 Embedding Pipeline、Chat API、Agent 節點全部未實作
./src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:46:- 處理方式：暫時改為 plain text 標註「即將推出」，避免讀者點 404
./src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:64:**建立 404 錯誤頁面**
./src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:65:- 目前沒有自訂 404，使用者遇到斷連結看到的是預設錯誤畫面
./src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:68:**`check-post-references.mjs` 加入 CI**
./src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:72:**Pre-commit hook（lint + reference check）**
./src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:73:- 用 husky 或 simple-git-hooks
./src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:96:- `/src/pages/search.astro` 硬編碼 `lang="zh-TW"`
./src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:97:- 建立 `/src/pages/en/search.astro` 或動態偵測語系
./src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:158:- 把 197 篇文章 embed 進 Vectorize（已綁定但未使用）
./src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:159:- 實作 Hybrid Search：Vectorize 語意 + D1 FTS5 BM25 + RRF 融合
./src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:173:- LangGraph Pipeline：Planner → Research → Normalize → Writer → Critic → Related Posts
./src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:176:- 但要重新評估是否真需要 LangGraph——你的 `langgraph-agent-orchestration.md` 也警告：「如果只需要簡單重試，LangGraph 是殺雞用牛刀」
./src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:253:- 對於精確名詞查詢（如「LangGraph 是什麼？」）特別有效
./src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:278:| 7 | 建立 404 頁 | P0 | 網站檢查 |
./src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:279:| 8 | check-post-references 加入 CI | P0 | harness 原則 |
./src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:323:- **P0 是把柄問題**：使用者已經能看到 broken 狀態（404、斷連結、錯誤的 cache 結果），不修就是讓品牌持續受損
./src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:336:- [LangGraph Agent Orchestration](/posts/ai/2026-03-27-langgraph-agent-orchestration)
./references/agent-patterns.md:97:### LangGraph 工作流程
./references/agent-patterns.md:108:3. **可觀察性**：每一步都要可追蹤，用 Langfuse 等工具
./AGENTS.md:27:tldr: ""            # 選填，一句話摘要（tech 類強烈建議）
./src/content/posts/tech/2026-03-27-hono-web-framework.md:7:tldr: "Hono 是專為 Cloudflare Workers、Deno、Bun 等 edge runtime 設計的 Web framework，比 Express 輕一個數量級，原生支援 Web Standard API，是 edge 環境下的首選。"
./package.json:15:    "check:references": "node scripts/check-post-references.mjs",
./package.json:38:    "pagefind": "^1.4.0",
./docs/superpowers/plans/2026-03-12-crawler-integration.md:82:    name: 'Cloudflare Vectorize',
./docs/superpowers/plans/2026-03-12-crawler-integration.md:859:- [x] 爬取 Cloudflare D1、Workers、Vectorize、Astro Docs
./src/layouts/PostLayout.astro:521:  .content ul { list-style-type: disc; }
./src/layouts/PostLayout.astro:522:  .content ol { list-style-type: decimal; }
./src/content/posts/product/2026-03-12-quidproquo-blog-from-scratch.md:102:- Phase 4：Vectorize + Workers AI 做 RAG 搜尋
./src/content/posts/product/2026-03-12-nobodyclimb-product.md:7:tldr: "攀岩社群不缺分享的意願，缺的是一個能串連和延續文化的地方。"
./src/content/posts/tech/2026-04-02-nvidia-dgx-spark-intro.md:7:tldr: "NVIDIA DGX Spark 搭載 GB10 Grace Blackwell Superchip，128GB 統一記憶體，提供 1 petaFLOP FP4 算力，售價約 $3,999 美元起。適合開發者在本地跑 200B 參數模型、fine-tune 70B 模型，是目前最容易入手的 NVIDIA AI 開發平台。"
./references/harness-engineering.md:179:- **Langfuse**：開源，追蹤 LLM 呼叫、成本、品質
./docs/blog-improvement-plan.md:7:本文件是工具箱目錄，不是全部都要用的清單。所有進階技術（HyDE、Multi-query、Reranker、Semantic Cache、Critic、LangGraph...）都必須：
./docs/blog-improvement-plan.md:39:- 行動：移除或標註「即將推出」，避免讀者點擊後 404
./docs/blog-improvement-plan.md:41:### 2.2 建立 404 錯誤頁面
./docs/blog-improvement-plan.md:43:- 建立 `/src/pages/404.astro`，提供搜尋框與熱門文章推薦
./docs/blog-improvement-plan.md:57:- `/src/pages/search.astro` 硬編碼 `lang="zh-TW"`，需建立 `/src/pages/en/search.astro` 或動態偵測語系
./docs/blog-improvement-plan.md:122:| Pre-commit hook | ❌ 完全沒有 | 加入 lint + reference check |
./docs/blog-improvement-plan.md:123:| `check-post-references.mjs` | ⚠️ 存在但不在 CI | 加入 CI pipeline |
./docs/blog-improvement-plan.md:217:| H3 | 加 pre-commit hook（lint + reference check） | 「Linter 是法律」原則。不讓斷連結和 lint 錯誤進入 repo |
./docs/blog-improvement-plan.md:218:| H4 | 把 `check-post-references.mjs` 加入 CI | 49 個斷連結是「prompt 是建議」的直接後果 |
./docs/blog-improvement-plan.md:246:| Crawl Pipeline（Browser Rendering → D1） | LangGraph Agent 節點 |
./docs/blog-improvement-plan.md:247:| D1 posts + post_chunks + doc_chunks 表 | Vectorize 嵌入寫入/查詢 |
./docs/blog-improvement-plan.md:248:| Vectorize Index 已建立（1024 維） | `/api/chat` 對話端點 |
./docs/blog-improvement-plan.md:257:                                 ├─ Vectorize (語意)
./docs/blog-improvement-plan.md:264:- 現有資源：Vectorize index 已建、D1 已有 post_chunks 表、BGE 模型已綁定
./docs/blog-improvement-plan.md:272:當前文章 embedding → Vectorize 最近鄰查詢
./docs/blog-improvement-plan.md:329:│ Research  │───┬── search_blog_posts（Vectorize 語意搜尋）
./docs/blog-improvement-plan.md:367:| 語意搜尋 | Vectorize + BGE-large（1024 維） | 理解「意思相近」的查詢 |
./docs/blog-improvement-plan.md:389:    → 重試 2 次仍不足 → 標註「此主題超出部落格涵蓋範圍」+ 記錄到 Langfuse
./docs/blog-improvement-plan.md:481:| Clarifier | Planner 判斷問題模糊 | 反問使用者以澄清需求（LangGraph interrupt） |
./docs/blog-improvement-plan.md:538:| `/admin/embed` | Vectorize 狀態、chunking 參數、預覽、手動 re-embed |
./docs/blog-improvement-plan.md:591:> 「如果只需要『品質差就重試一次』，LangGraph 是殺雞用牛刀。」
./docs/blog-improvement-plan.md:598:| LangGraph 從頭用 | Phase 2 無縫升級、條件分支 / 並行 / interrupt 內建 | 依賴重（@langchain/langgraph + @langchain/anthropic）、Workers 冷啟動變慢、API 版本不穩定 |
./docs/blog-improvement-plan.md:602:- Phase 2 再引入 LangGraph（真正需要 Clarifier interrupt、條件分支、並行時）
./docs/blog-improvement-plan.md:603:- 或接受 LangGraph 成本，但必須測量 Workers 冷啟動影響
./docs/blog-improvement-plan.md:648:| 10 | Critic 失敗無降級策略 | Stripe 2-attempt cap | 重試 2 次仍不通過 → 標註可能不完整 + 記錄 Langfuse + 不再呼叫 LLM |
./docs/blog-improvement-plan.md:666:| 18 | Phase 1 可能不需要完整 LangGraph | langgraph-agent-orchestration.md | 評估純函數 pipeline 方案，Phase 2 再引入 LangGraph |
./docs/blog-improvement-plan.md:684:| LangGraph 狀態管理 | TypedDict StateAnnotation |
./docs/blog-improvement-plan.md:685:| Langfuse 可觀測性 | Section 12 完整 trace 結構 |
./docs/blog-improvement-plan.md:694:| 使用者回饋（👍👎） | D1 feedback 表 + Langfuse 連動 |
./docs/blog-improvement-plan.md:705:| 1 | 安裝依賴（LangGraph、React、Langfuse） | — |
./docs/blog-improvement-plan.md:708:| 4 | Embedding Pipeline（contextual chunk → Vectorize upsert） | Task 2 |
./docs/blog-improvement-plan.md:709:| 5 | LangGraph Agent 節點（Planner → Research → Normalize → Validation → Writer → Critic → Related） | Task 1, 4 |
./docs/blog-improvement-plan.md:725:| 需要 Reranker 才能排好 | BGE-Reranker | A/B：Vectorize cosine 排序 vs cross-encoder |
./docs/blog-improvement-plan.md:727:| 需要 LangGraph 才能管理流程 | 整個 pipeline | Phase 1 先用純函數評估 |
./src/content/posts/tech/2026-04-02-ai-agent-global-skills-paths.md:8:tldr: "Skill 路徑通常是 runtime-specific，跨 agent 真正穩的是 AGENTS.md；個人共用能力放各自 agent 支援的全域目錄，專案 workflow 放 repo 內。"
./src/content/posts/tech/2026-03-27-cloudflare-d1-sqlite-database.md:7:tldr: "D1 是 Cloudflare 的 serverless SQLite 資料庫，直接綁定 Workers，支援完整 SQL（JOIN、transaction）、自動備份。適合中小規模的關聯式資料需求，NobodyClimb 把它當主資料庫用。"
./src/content/posts/tech/2026-03-27-cloudflare-d1-sqlite-database.md:154:- **embeddings metadata**：向量索引的 metadata（向量本身存在 Vectorize）
./references/rag-patterns.md:267:- 實作：SQLite FTS5 + Vectorize，或 Weaviate 原生 hybrid
./references/rag-patterns.md:296:| Cloudflare Vectorize | 邊緣部署 | 低延遲、平台整合 |
./scripts/anti-cf/mcp-server/index.mjs:78:        content.push({ type: "text", text: `[HTML]\n${result.html}` });
./scripts/anti-cf/mcp-server/index.mjs:83:        content.push({ type: "text", text: result.text });
./scripts/anti-cf/mcp-server/index.mjs:89:        content.push({ type: "image", data: b64, mimeType: "image/png" });
./scripts/anti-cf/mcp-server/index.mjs:97:        content: [{ type: "text", text: `Error: ${err.message}` }],
./docs/superpowers/plans/2026-03-12-blog-redesign.md:567:    tldr: z.string().optional(),
./docs/superpowers/plans/2026-03-12-blog-redesign.md:570:    series: z.object({
./docs/superpowers/plans/2026-03-12-blog-redesign.md:1340:      type: 'div',
./docs/superpowers/plans/2026-03-12-blog-redesign.md:1355:            type: 'span',
./docs/superpowers/plans/2026-03-12-blog-redesign.md:1371:            type: 'div',
./docs/superpowers/plans/2026-03-12-blog-redesign.md:1383:            type: 'div',
./docs/superpowers/plans/2026-03-12-blog-redesign.md:1434:- Create: `src/pages/search.astro`
./docs/superpowers/plans/2026-03-12-blog-redesign.md:1439:npm install -D pagefind
./docs/superpowers/plans/2026-03-12-blog-redesign.md:1447:  name: 'pagefind',
./docs/superpowers/plans/2026-03-12-blog-redesign.md:1451:      execSync(`npx pagefind --site ${dir.pathname}`, { stdio: 'inherit' });
./docs/superpowers/plans/2026-03-12-blog-redesign.md:1470:// src/pages/search.astro
./docs/superpowers/plans/2026-03-12-blog-redesign.md:1478:    <link href="/pagefind/pagefind-ui.css" rel="stylesheet" />
./docs/superpowers/plans/2026-03-12-blog-redesign.md:1484:<script src="/pagefind/pagefind-ui.js" is:inline></script>
./docs/superpowers/plans/2026-03-12-blog-redesign.md:1495:npm run build && ls dist/pagefind/
./docs/superpowers/plans/2026-03-12-blog-redesign.md:1497:Expected: `pagefind.js`, `pagefind-ui.js`, `pagefind-ui.css`, and index files.
./docs/superpowers/plans/2026-03-12-blog-redesign.md:1502:git add astro.config.mjs src/layouts/PostLayout.astro src/pages/search.astro package.json package-lock.json
./src/content/posts/tech/2026-03-27-bullmq-job-queue-nodejs.md:7:tldr: "BullMQ 是 Node.js 生態裡最成熟的任務佇列，底層用 Redis，支援優先級、重試、排程、延遲任務。島島用它處理通知發送和實踐自動完成排程。"
./src/content/posts/tech/2026-03-27-bullmq-job-queue-nodejs.md:59:  type: 'mention',
./src/content/posts/tech/2026-03-27-bullmq-job-queue-nodejs.md:114:    type: 'exponential',
./src/content/posts/tech/2026-03-27-docker-container-basics.md:7:tldr: "Docker 讓你把應用程式和它的環境打包在一起，消除「在我電腦上可以跑」的問題。搭配 multi-stage build 和 Compose，是現代後端部署的基本配備。"
./docs/TODO.md:41:- [ ] **Pre-commit hook（lint + reference check）** — 用 husky 或 simple-git-hooks；「Linter 是法律，prompt 是建議」
./docs/TODO.md:42:- [ ] **`check-post-references.mjs` 加入 CI**（script 已存在但沒跑，導致 49 個斷連結直接上線）
./docs/TODO.md:46:- [ ] **建立 404 錯誤頁面** — `/src/pages/404.astro`，含搜尋框 + 熱門文章推薦
./docs/TODO.md:59:- [ ] **英文版搜尋頁** — `/src/pages/search.astro` 硬編碼 `lang="zh-TW"`，需建立 `/src/pages/en/search.astro`
./docs/TODO.md:100:- [ ] **Task 1：安裝依賴 + 環境設定**（React、vitest、Vectorize、Workers AI bindings）
./docs/TODO.md:103:- [ ] **Task 4：Embedding Pipeline + Hybrid Search** — 197 篇文章 embed 進 Vectorize；實作 Vectorize 語意 + D1 FTS5 BM25 + RRF 融合
./docs/TODO.md:106:- [ ] **Task 7：Langfuse Helper**
./docs/TODO.md:107:- [ ] **Task 8：LangGraph State Definition**
./docs/TODO.md:183:| `docs/superpowers/plans/2026-03-21-rag-phase1.md` | RAG Phase 1 詳細實作步驟（含 TDD、LangGraph） |
./src/content/posts/tech/debug/2026-03-13-astro-scoped-css-mdx.md:7:tldr: "Astro scoped CSS 會加 scope hash，但 <Content /> 渲染的 MDX 元素沒有這個 hash，導致所有 prose 樣式失效。"
./src/content/posts/tech/debug/2026-03-13-astro-scoped-css-mdx.md:10:type: debug
./src/content/posts/tech/2026-03-16-claude-code-loop-scheduling.md:7:tldr: "/loop 是 Claude Code 的原生 cron 功能，自然語言設定排程，讓 Claude 在背景持續監控、自動修 PR、定期執行任務。"
./src/content/posts/tech/2026-03-16-claude-code-loop-scheduling.md:10:series:
./src/content/posts/tech/2026-03-27-expo-react-native-cross-platform.md:7:tldr: "Expo 讓 React Native 開發從「環境設定地獄」變成可以直接寫邏輯的狀態。Expo Router 帶來 file-based routing，讓 web 開發者轉移成本更低。島島和 NobodyClimb 都用它跨 iOS/Android。"
./src/content/posts/tech/2026-03-27-zod-schema-validation.md:7:tldr: "TypeScript 的型別只存在編譯期，執行時消失。Zod 讓你在 runtime 驗證外部資料，同時推斷出 TypeScript 型別，一個 schema 兩件事都搞定。"
./src/content/posts/tech/2026-03-27-zod-schema-validation.md:111:  z.object({ type: z.literal('mention'), mentionedBy: z.string() }),
./src/content/posts/tech/2026-03-27-zod-schema-validation.md:112:  z.object({ type: z.literal('follow'), followedBy: z.string() }),
./src/content/posts/tech/2026-03-27-zod-schema-validation.md:113:  z.object({ type: z.literal('reaction'), emoji: z.string() }),
./src/content/posts/tech/2026-04-13-better-agent-terminal-intro.md:7:tldr: "Better Agent Terminal (BAT) 是一個 Electron 桌面 app，把多個專案的 workspace、terminal、以及 Claude Code Agent 整合到同一個視窗，解決開一堆 iTerm 分頁、Agent 沒有好 GUI 容器的日常痛點。MIT License，macOS / Windows / Linux 都能裝。"
./docs/plan.md:25:| 向量搜尋 | Cloudflare Vectorize | RAG 向量索引（Phase 4） |
./docs/plan.md:52:                 │                    D1 (原文) + Vectorize (向量)
./docs/plan.md:80:                │  │ Vectorize │  │
./docs/plan.md:127:tldr: "D1 batch 單次上限 100 筆，用 chunkArray + Promise.all 分批送"
./docs/plan.md:239:    tldr: z.string().optional(),
./docs/plan.md:331:2. Vectorize 搜尋 top-K 相關 chunks
./docs/plan.md:414:| 向量索引 | 共用一個 Vectorize index | 用 metadata.type 區分來源 |
./docs/plan.md:448:- [ ] 建立 Vectorize index
./docs/plan.md:460:- [ ] Langfuse observability 串接
./docs/plan.md:493:- [Cloudflare Vectorize 文件](https://developers.cloudflare.com/vectorize/)
./src/content/posts/tech/debug/2026-03-13-astro-cloudflare-native-module.md:7:tldr: "即使 route 有 prerender = true，Cloudflare Workers 的 Rollup 還是會嘗試打包 native module，導致 build 失敗。把需要 native module 的工作移到 postbuild script 才是正解。"
./src/content/posts/tech/debug/2026-03-13-astro-cloudflare-native-module.md:10:type: debug
./src/content/posts/tech/2026-03-16-docker-cross-compose-nginx-502.md:7:tldr: "跨 Compose 專案時 service name 不可解析，要加 network alias 才能讓 nginx 找到容器。"
./src/content/posts/tech/2026-03-15-scp-ssh-config-alias.md:7:tldr: "設定好 SSH config 後，scp 可以直接用 alias，不用打完整 IP"
./src/content/posts/tech/2026-03-20-docker-image-vulnerability-scan-packages-vs-npm.md:7:tldr: "Node.js image 的弱掃結果不能只看套件名稱，先分清楚是專案依賴，還是 base image 內建 npm 自己帶的相依套件，才不會修錯地方。"
./src/content/posts/tech/guide/2026-03-12-astro-blog-template-guide.md:7:tldr: "換模板 = 換整個專案底層；先搞清楚自己要什麼，再選 AstroPaper / Cactus / AstroWind"
./src/content/posts/tech/guide/2026-03-12-astro-blog-template-guide.md:10:type: guide
./src/content/posts/tech/guide/2026-03-12-astro-blog-template-guide.md:43:內建 [Pagefind](https://pagefind.app/) 全文檢索，比 Fuse.js 快得多，適合文章累積到一定量之後。
./src/content/posts/tech/guide/2026-03-12-astro-blog-template-guide.md:121:- [Pagefind 全文檢索](https://pagefind.app/)
./src/content/posts/tech/2026-03-27-pm2-node-process-manager.md:7:tldr: "PM2 讓 Node.js 應用在 server 上持續跑，掛掉自動重啟，可以開 cluster 模式用滿 CPU，Log 也幫你管好。部署在 VM 或 VPS 的 Node.js 應用幾乎都需要它。"
./src/content/posts/tech/2026-03-27-turborepo-monorepo-build.md:7:tldr: "Turborepo 解決 monorepo 的 build 速度問題，pnpm workspaces 解決依賴共用問題。兩者搭配是目前 JS/TS monorepo 的最佳選擇。"
./src/content/posts/tech/debug/2026-03-12-cloudflare-workers-custom-domain.md:7:tldr: "wrangler.jsonc 的 routes 用 custom_domain: true，pattern 只填 hostname，不加 /*"
./src/content/posts/tech/debug/2026-03-12-cloudflare-workers-custom-domain.md:10:type: debug
./src/content/posts/tech/2026-03-27-claude-code-global-skills-not-found.md:7:tldr: "Global skills 放在 ~/.claude/skills/ 但新 session 或 Desktop App 看不到？問題通常不是檔案不存在，而是 skill 描述沒被載入 context。本文釐清 CLI vs Desktop App 的差異、settings.json 的角色，以及最穩定的解法。"
./src/content/posts/tech/2026-03-27-claude-code-global-skills-not-found.md:10:series:
./src/content/posts/tech/2026-03-17-docker-bind-mount-restart-not-reapplied.md:7:tldr: "docker restart 不會重建容器，volumes 設定改了必須用 docker-compose down && up 才會生效。"
./src/content/posts/tech/guide/2026-03-13-conversation-as-documentation.md:7:tldr: "Debug 完直接說「把錯誤寫成文章」，Claude Code 會從對話裡萃取內容，套用模板、生成 frontmatter、commit 到 repo。不需要額外寫任何東西。"
./src/content/posts/tech/guide/2026-03-13-conversation-as-documentation.md:10:type: guide
./src/content/posts/tech/2026-03-27-cloudflare-workers-edge-compute.md:7:tldr: "Cloudflare Workers 用 V8 Isolate 取代容器，沒有 cold start，全球邊緣部署，透過 Bindings 接 D1、R2、KV、AI。適合 API、SSR、輕量後端，不適合長時間執行的任務。"
./src/content/posts/tech/2026-03-27-cloudflare-workers-edge-compute.md:45:    return new Response("Not found", { status: 404 });
./src/content/posts/tech/guide/2026-04-02-documentation-platform-guide.md:7:tldr: "九個主流文件平台的定位、優缺點、適用場景和實際使用案例。選擇邏輯：開源專案選 Docusaurus/VitePress，API docs 選 Mintlify/ReadMe，企業內部選 Confluence，快速上手選 GitBook。"
./src/content/posts/tech/guide/2026-04-02-documentation-platform-guide.md:10:type: guide
./src/content/posts/tech/guide/2026-03-12-tools-behind-this-blog.md:8:tldr: Astro + Cloudflare 全家桶，靜態優先、邊緣運算、零維運成本
./src/content/posts/tech/guide/2026-03-12-tools-behind-this-blog.md:10:type: guide
./src/content/posts/tech/guide/2026-03-12-tools-behind-this-blog.md:14:這個部落格跑在 Astro + Cloudflare Workers 上，搭配 D1、R2、KV、Vectorize、Workers AI。選這套組合的核心邏輯是：內容網站不需要複雜的 server，但需要夠靈活的基礎設施在對的時候做對的事。
./src/content/posts/tech/guide/2026-03-12-tools-behind-this-blog.md:37:    tldr: z.string().optional(),
./src/content/posts/tech/guide/2026-03-12-tools-behind-this-blog.md:75:## 向量搜尋：Cloudflare Vectorize
./src/content/posts/tech/guide/2026-03-12-tools-behind-this-blog.md:77:Vectorize 是 Cloudflare 的向量資料庫，用來儲存文字的 embedding（語意向量）。
./src/content/posts/tech/guide/2026-03-12-tools-behind-this-blog.md:79:這個網站預計用它做 RAG 搜尋：使用者輸入問題 → 把問題轉成 embedding → 在 Vectorize 找最相近的文章段落 → 把段落交給 AI 生成回答。目前功能還沒啟用，但 index 和 binding 已經設定好了。
./src/content/posts/tech/guide/2026-03-12-tools-behind-this-blog.md:81:Vectorize 是托管服務，不需要自己維護向量資料庫（比如 Pinecone 或自架 Qdrant），對個人專案來說省去很多維運工作。
./src/content/posts/tech/guide/2026-03-12-tools-behind-this-blog.md:89:可用模型涵蓋 embedding（`@cf/baai/bge-base-en-v1.5`）、文字生成（Llama、Mistral 系列）、圖片生成（Stable Diffusion）等。對這個網站來說，主要用途是把文章內容轉成 embedding 存進 Vectorize，以及之後的 AI 問答。
./src/content/posts/tech/guide/2026-03-12-tools-behind-this-blog.md:126:                         Vectorize（embedding）
./src/content/posts/tech/guide/2026-03-12-tools-behind-this-blog.md:150:- [Cloudflare Vectorize 官方文件](https://developers.cloudflare.com/vectorize/)
./src/content/posts/marketing/2026-04-18-ai-search-engine-aeo-geo-strategy.md:7:tldr: "不同 AI 引擎讀網頁的方式差異很大。有的只看 body、有的靠預建索引。JSON-LD 和 schema 不是萬能的，正文品質和結構才是跨平台有效的基礎。"
./src/content/posts/tech/2026-03-27-tailwindcss-utility-first-css.md:7:tldr: "TailwindCSS 解決的核心問題是 CSS 的全域命名汙染和死碼問題。utility class 讓樣式跟元件放在一起，build 時自動移除沒用到的 class，生產環境的 CSS bundle 通常只有幾十 KB。島島和 NobodyClimb 都用它做 web 端樣式。"
./src/content/posts/tech/debug/2026-04-19-ai-backend-auth-cookie-cross-domain.md:7:tldr: "主後端跑在遠端 HTTPS，auth_token cookie 的 domain 是遠端，瀏覽器不會把它送到本機 AI backend，導致 API 認為未登入。"
./src/content/posts/tech/2026-03-13-git-conditional-includes.md:7:tldr: "用 includeIf + SSH Host alias，讓 git 自動依路徑切換帳號，不再手動切換。"
./src/content/posts/tech/2026-03-14-ghostty-vs-cmux.md:7:tldr: "Ghostty 是快速、原生的通用終端機；cmux 是基於 Ghostty、專為 AI coding agents 設計的終端機。不是競品，是不同層級的工具。"
./src/content/posts/tech/2026-03-15-nginx-first-request-502.md:7:tldr: "nginx 用 set $variable 做動態 upstream 時，DNS 快取每 30 秒過期，第一個請求因無可用 IP 而 502。升到 nginx 1.27.3 改用 upstream + resolve 參數，DNS 在背景非同步更新，根治問題。"
./src/content/posts/tech/2026-03-30-claude-code-spinner-verbs.md:7:tldr: "Claude Code 處理請求時會從 185 個預設動詞中隨機顯示（如 Thinking、Brewing、Clauding），完成時從 8 個動詞中選一個搭配耗時。可透過 settings.json 的 spinnerVerbs 設定自訂，支援 replace 和 append 兩種模式。本文所有資料來自 cli.js 原始碼實際驗證。"
./src/content/posts/tech/2026-03-30-claude-code-spinner-verbs.md:10:series:
./scripts/generate-og-images.mjs:47:      type: 'div',
./scripts/generate-og-images.mjs:62:            type: 'span',
./scripts/generate-og-images.mjs:78:            type: 'div',
./scripts/generate-og-images.mjs:90:            type: 'div',
./scripts/generate-og-images.mjs:126:      type: 'div',
./scripts/generate-og-images.mjs:141:            type: 'img',
./scripts/generate-og-images.mjs:145:            type: 'div',
./scripts/generate-og-images.mjs:152:            type: 'div',
./src/content/posts/tech/2026-03-20-mcp-server-job-scraper.md:7:tldr: "用 FastMCP 把本地 Python 腳本包成 MCP Server，讓 Claude Code 可以直接呼叫，不再需要手動跑 pipeline。"
./src/content/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent.md:7:tldr: "OpenCode 是用 Go 打造的開源 AI coding agent（95K+ GitHub stars），內建 TUI 介面、支援 75+ LLM、LSP 整合、Vim 風格編輯器、SQLite session 管理。免費、不需訂閱，可接本地或雲端模型。"
./src/content/posts/tech/2026-03-27-cloudflare-kv-key-value-store.md:7:tldr: "KV 是 Cloudflare 的全球分散式 key-value store，讀取從最近的邊緣節點回應，延遲極低。適合快取、feature flag、暫態資料，但寫入是最終一致性。"
./src/content/posts/tech/2026-03-27-cloudflare-kv-key-value-store.md:43:    if (!raw) return new Response('Not found', { status: 404 });
./src/content/posts/tech/deep-dive/2026-03-28-rag-multi-field-retrieval-attribute-conflation.md:7:tldr: "查詢「美人照鏡 5.11b，推薦類似難度路線」，結果回來的全是名字像的路線而不是難度像的。根因是 dense embedding 把多個屬性壓進同一個向量，名稱的稀有性壓過了難度信號。解法：metadata pre-filter + query rewriting + score fusion 三層防線。"
./src/content/posts/tech/deep-dive/2026-03-28-rag-multi-field-retrieval-attribute-conflation.md:10:type: deep-dive
./src/content/posts/tech/deep-dive/2026-03-28-rag-multi-field-retrieval-attribute-conflation.md:19:系統背景：Cloudflare Workers 上跑 Hono，用 `@cf/baai/bge-m3` 做 embedding（1024 維），Cloudflare Vectorize 做向量搜尋，加上 BM25 做 hybrid search。
./src/content/posts/tech/deep-dive/2026-03-28-rag-multi-field-retrieval-attribute-conflation.md:31:這些欄位被拼接成一段文字後 embed 進 Vectorize。使用者查「推薦類似 5.11b 難度的路線」，期望拿到 5.11a ~ 5.11c 的路線。實際結果？排名前幾的都是名字裡有「鏡」「美人」之類字的路線，難度從 5.8 到 5.12 都有。
./src/content/posts/tech/deep-dive/2026-03-28-rag-multi-field-retrieval-attribute-conflation.md:69:Pinecone 的文件直接寫了：「對於精確匹配的屬性（如分類、等級），優先使用 metadata filter 而非依賴 embedding 相似度」。Weaviate 的 hybrid search 也是 filter-first 架構。Cloudflare Vectorize 同樣支援。
./src/content/posts/tech/deep-dive/2026-03-28-rag-multi-field-retrieval-attribute-conflation.md:140:│  Vectorize filter: grade IN [5.11a..5.11c]   │
./src/content/posts/tech/deep-dive/2026-03-28-rag-multi-field-retrieval-attribute-conflation.md:153:成本最低、效果最好的一刀。在 Vectorize query 加上 grade filter：
./src/content/posts/tech/deep-dive/2026-03-28-rag-multi-field-retrieval-attribute-conflation.md:234:- [From Local to Global: A Graph RAG Approach to Query-Focused Summarization](https://arxiv.org/abs/2404.16130) — Edge et al. (Microsoft GraphRAG), 2024
./src/content/posts/marketing/2026-04-21-aeo-geo-tracking-tools-landscape.md:7:tldr: "AEO/GEO 工具不是單一類別，而是三個面向：輸入面（網站有沒有準備好給 AI 讀）、流量面（AI bot 實際爬了多少）、輸出面（品牌在答案裡怎麼被提到）。這篇把三面向、從開源自架到商業 SaaS 的工具一次攤開。"
./src/content/posts/tech/2026-03-15-nginx-confd-multi-service.md:7:tldr: "單一 nginx.conf 隨服務增加變得難以維護，用 include conf.d/*.conf 按服務拆分是標準解法。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-settings-json-guide.md:7:tldr: "settings.json 是 Claude Code 所有行為的控制中心。Hook、權限、模型選擇、MCP server、工具黑名單全部在這裡設定。本文整理所有可用欄位、全域 vs 專案層級的差異，以及常見設定組合。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-settings-json-guide.md:10:series:
./src/content/posts/tech/2026-03-28-claude-code-troubleshooting-collection.md:7:tldr: "整理 Claude Code 使用中最常遇到的問題：Skills 找不到、Hook 不觸發、設定不生效、權限卡住、MCP 連不上。每個問題附原因分析和解法，省下你翻文件的時間。"
./src/content/posts/tech/2026-03-28-claude-code-troubleshooting-collection.md:10:series:
./src/content/posts/tech/2026-03-31-claude-code-overview-anthropic-coding-agent.md:7:tldr: "Claude Code 是 Anthropic 的 agentic coding 工具，跑在終端機、IDE、Slack、GitHub 和 Web 上。核心擴充機制有六層：CLAUDE.md（永駐 context）、Skills（按需工作流程）、Hooks（確定性自動化）、Subagents（隔離委派）、MCP（外部工具連接）、Agent Teams（多 agent 協作）。"
./src/content/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md.md:7:tldr: "Hook 是自動化安全網（擋住壞 commit），Skill 是互動式工作流程（跑檢查 + 自動修），指令檔（CLAUDE.md / AGENTS.md）是行為指引。三層各自獨立，組合起來讓 AI agent 在 commit 前自動完成 lint、typecheck、build 檢查。"
./src/content/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md.md:10:series:
./src/content/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md.md:258:| **husky + lint-staged** | git pre-commit hook 跑 lint | 能 | 能跑 `--fix`，僅限格式問題 |
./src/content/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md.md:259:| **lefthook** | 類似 husky，設定更簡潔 | 能 | 同上 |
./src/content/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md.md:272:遇到這種錯誤，husky 只能擋住 commit，然後你要自己去看錯誤訊息、找到對應檔案、理解上下文、改 code、再跑一次。如果改完又觸發連鎖的 type error，再來一輪。
./src/content/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md.md:306:## 那 husky 呢？
./src/content/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md.md:308:聊到 commit 前檢查，很多人第一反應是 husky + lint-staged。這是 JavaScript 生態的標準做法，但不是銀彈。
./src/content/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md.md:310:### husky 有用的情境
./src/content/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md.md:316:### husky 不一定有用的情境
./src/content/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md.md:320:**Monorepo 設定複雜。** 如果你的 repo 有 Node.js（ESLint / Biome）、Python（ruff）、Go 混在一起，husky 裝在哪？lint-staged 要怎麼知道跑哪個 linter？設定複雜度很高，維護成本也高。
./src/content/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md.md:324:**安裝不一定成功。** husky 靠 `postinstall` script 裝 git hook。CI 環境、Docker build、`--ignore-scripts` 安裝都可能讓它沒裝到，靜默失效。
./src/content/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md.md:328:| | husky (git hook) | Claude Code Hook |
./src/content/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md.md:331:| 對誰有效 | 所有人（裝了 husky 就生效） | 只對 Claude Code 有效 |
./src/content/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md.md:336:兩者不衝突。如果已經有 husky 且運作良好，留著。如果沒有，也不一定要為了 AI 工作流去裝——CI 是最終防線，Claude Code Hook + Skill 已經覆蓋了 AI 協作場景。
./src/content/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md.md:356:- [husky 官方文件](https://typicode.github.io/husky/)
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-checkpointing-guide.md:7:tldr: "Claude Code 內建 git checkpoint 機制——每次重大操作前自動建立 commit，出問題可以一鍵還原。搭配 /undo 指令和 git worktree 隔離，讓 AI 的修改永遠可逆。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-checkpointing-guide.md:10:series:
./src/content/posts/tech/deep-dive/2026-03-28-bypass-cloudflare-anti-bot-for-ai-agent.md:7:tldr: "標準 Playwright 無法通過 Cloudflare 驗證。playwright-extra + stealth 和 nodriver 都能繞過，最終包成 MCP server 讓 AI agent 自動使用。"
./src/content/posts/tech/deep-dive/2026-03-28-bypass-cloudflare-anti-bot-for-ai-agent.md:137:    return { content: [{ type: "text", text }] };
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-channels-guide.md:7:tldr: "Channels 把外部事件推送到正在跑的 Claude Code session——從手機用 Telegram 問問題、CI webhook 通知失敗、Discord 接收指令。雙向溝通：Claude 讀取事件後直接在同一個 channel 回覆。目前是 Research Preview。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-channels-guide.md:10:series:
./src/content/posts/tech/deep-dive/2026-03-16-docker-dns-container-name-vs-network-alias.md:7:tldr: "跨 Compose 專案只能靠 container_name 或 network alias 解析，而 alias 才支援 scale。"
./src/content/posts/tech/2026-03-27-clickhouse-analytics-database.md:7:tldr: "ClickHouse 是欄導向 OLAP 資料庫，掃幾億行只要幾秒，島島用它記錄使用行為事件，供 AI 推薦引擎的特徵工程使用，讓 PostgreSQL 專心處理交易型資料。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-remote-control-guide.md:7:tldr: "Remote Control 讓你從手機、平板或任何瀏覽器繼續本地跑的 Claude Code session。程式碼在你的電腦上執行，MCP servers 和本地工具全都可用。支援 QR code 快速連線，多裝置同步對話。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-remote-control-guide.md:10:series:
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management.md:7:tldr: "Claude Code 每個功能消耗不同的 context：CLAUDE.md 每次請求都在、Skills 按需載入、MCP 只載 tool name、Sub-agent 完全隔離、Hooks 零消耗。理解這些差異才能有效管理你的 context window，避免 AI 行為異常。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management.md:10:series:
./src/content/posts/tech/2026-03-27-tamagui-react-native-ui.md:7:tldr: "Tamagui 是針對 React Native 設計的 UI framework，有完整的 design token 系統和 theme 支援，編譯時期優化讓樣式計算移到 build time。NobodyClimb 選它而不是 NativeWind，主要是因為跨平台的 token 系統更完整。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide.md:7:tldr: "Agent Teams 讓你啟動多個 Claude Code 實例同時工作——一個當 team lead 分配任務，其他 teammates 各自獨立執行、互相溝通、共享任務清單。適合平行 code review、競爭假設除錯、跨層開發。目前是實驗性功能。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide.md:10:series:
./src/content/posts/tech/deep-dive/2026-03-27-claude-code-hooks-guide.md:7:tldr: "Hook 是 Claude Code 的事件系統。在 AI 執行工具前後、送出 prompt 時、結束任務時自動觸發 shell command、HTTP 請求或 LLM 判斷。用來擋住危險操作、自動審核、注入上下文、記錄 audit log。"
./src/content/posts/tech/deep-dive/2026-03-27-claude-code-hooks-guide.md:10:series:
./src/content/posts/tech/deep-dive/2026-03-27-claude-code-hooks-guide.md:402:        - type: command
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-slack-integration.md:7:tldr: "在 Slack 裡 @Claude 描述任務，自動啟動 Claude Code web session → 分析 code → 開 PR。不用離開 Slack 就能把 bug report 變成修復。支援 Code only 和 Code + Chat 兩種路由模式。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-slack-integration.md:10:series:
./src/content/posts/tech/deep-dive/2026-03-27-claude-code-scheduled-tasks-guide.md:7:tldr: "Scheduled Task 是 Claude Code 的雲端排程系統。設定 cron、指定 repo、寫好 prompt，AI 就會定時自動執行——掃 issue、審 PR、跑檢查、開 PR，電腦關了也會跑。"
./src/content/posts/tech/deep-dive/2026-03-27-claude-code-scheduled-tasks-guide.md:10:series:
./src/content/posts/tech/2026-03-27-blog-seo-optimization-guide.md:7:tldr: "SEO 不只是關鍵字，結構化資料（JSON-LD）、Open Graph、hreflang、robots.txt 這些技術面優化才是讓搜尋引擎真正理解你內容的關鍵。本文以 Astro 部落格為例，完整走一遍實作。"
./src/content/posts/tech/2026-03-27-blog-seo-optimization-guide.md:10:type: guide
./src/content/posts/tech/2026-03-27-blog-seo-optimization-guide.md:91:  { type: 'div', props: { children: post.title, style: { fontSize: 48 } } },
./src/content/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide.md:7:tldr: "Skill 是寫給 AI 看的 SOP。一個 markdown 檔案定義步驟，Claude 照著執行。不用寫程式，不用學框架，只要把「有經驗的人會怎麼做」寫成步驟就好。"
./src/content/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide.md:10:series:
./src/content/posts/tech/2026-03-27-fastapi-python-backend.md:7:tldr: "FastAPI 是基於 Python type hint 的現代 Web framework，自動生成 OpenAPI 文件、原生 async 支援、效能接近 Node.js。AI/ML 服務的首選，也是 Python 後端裡最值得學的框架。"
./src/content/posts/tech/2026-03-27-fastapi-python-backend.md:69:    content_type: Optional[ContentType] = None
./src/content/posts/tech/2026-04-05-symlink-agents-md-claude-md.md:7:tldr: "Claude Code 不認 AGENTS.md，Codex 不認 CLAUDE.md，多人協作項目被迫維護兩份一樣的設定。解法：把 CLAUDE.md 做成 AGENTS.md 的 symlink，只維護一份。"
./src/content/posts/tech/deep-dive/2026-04-20-youtube-to-notebooklm-extension-internals.md:7:tldr: "NotebookLM 沒有官方 API，這個擴充套件靠的是逆向工程 Google 內部 batchexecute RPC + DOM scraping + 跨 Tab 訊息傳遞，三者組合完成整個流程。"
./src/content/posts/tech/deep-dive/2026-03-28-rag-multi-entity-query-processing.md:7:tldr: "RAG 系統的 extractRouteReference() 用 for...return 只抓第一個匹配，使用者給了五條完攀紀錄卻只用到一條。解法從 rule-based 多實體擷取、user profile aggregation 到 embedding centroid，分三層遞進實作。"
./src/content/posts/tech/deep-dive/2026-03-28-rag-multi-entity-query-processing.md:106:跟現有 LangGraph 架構的 `multi_tool` 路徑有關聯，但差異在於 Plan-and-Execute 的 plan 階段更結構化（不只決定用哪些 tool，還決定如何聚合中間結果），execute 階段有 feedback loop。Wang et al. (2023) 的 Plan-and-Solve Prompting、Yao et al. (2023) 的 ReAct 都是這個方向。
./src/content/posts/tech/deep-dive/2026-03-28-rag-multi-entity-query-processing.md:147:在 Cloudflare Workers runtime、D1 SQLite、現有 LangGraph 架構的限制下，不可能一步到位。分三層：
./src/content/posts/tech/deep-dive/2026-03-28-rag-multi-entity-query-processing.md:159:如果多條路線都有 embedding，計算 centroid vector 作為查詢向量。搜尋結果再經過 re-ranking：排除已提及路線、難度適當性加權、多樣性加權。前提是 Cloudflare Vectorize API 支援自訂查詢向量。
./src/content/posts/tech/deep-dive/2026-03-28-rag-multi-entity-query-processing.md:175:Query Decomposition 和 Collaborative Filtering 先放著。前者在已有 LangGraph multi-tool 路徑的前提下有重疊，後者需要更多使用者資料。等 P0-P2 上線，再看推薦品質的瓶頸在哪裡決定下一步。
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-headless-mode-guide.md:7:tldr: "claude -p 是 Claude Code 的程式化執行模式。一行指令跑完任務、pipe 資料進去、拿 JSON 結構化輸出。搭配 --bare 跳過所有自動載入，適合 CI/CD 和腳本。也可以用 --json-schema 強制輸出符合 schema 的結構化資料。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-headless-mode-guide.md:10:series:
./src/content/posts/ai/2026-04-20-agentic-engineering-memory.md:7:tldr: "Agent 的記憶不是一個插件，而是 harness 本身的一部分。選對記憶類型、估算資料量、再決定用什麼技術——最後，也要搞清楚你是否真的擁有那份記憶。"
./src/content/posts/ai/2026-04-20-agentic-engineering-memory.md:12:Cisco 工程師今年四月在 LangChain blog 發了一篇文章，描述他們如何用多 agent 協作系統把 debug 工作流的 time-to-root-cause 縮短 93%，一個月省下 200 多人工小時。他們用的技術棧：LangGraph + LangSmith + LangMem。
./src/content/posts/ai/2026-04-20-agentic-engineering-memory.md:14:其中最常被略過的是 **LangMem**。大家看到漂亮的數字就直接衝去看 LangGraph，但記憶系統才是讓 agent 能跨 session 積累知識的關鍵。沒有它，每次呼叫都是失憶的開始。
./src/content/posts/ai/2026-04-20-agentic-engineering-memory.md:156:- 用**開源 harness**（LangGraph + 自建 store）→ 記憶完全在你手上
./src/content/posts/tech/deep-dive/2026-03-28-rag-intent-disambiguation-recommendation.md:7:tldr: "攀岩 RAG 系統中「推薦下一條路線」（progression）和「推薦類似路線」（similarity）被同一個 hasSimilarRouteIntent() 函式混為一談，導致推薦品質崩壞。解法是 Regex Fast Path + LLM Fallback 的兩階段意圖分類。"
./src/content/posts/tech/2026-03-16-claude-code-dangerously-skip-permissions.md:7:tldr: "Claude Code 有五種權限模式：default（逐步確認）、acceptEdits（自動接受編輯）、plan（唯讀規劃）、auto（AI classifier 背景審查）、bypassPermissions（YOLO 全跳過）。用 Shift+Tab 切換，搭配 settings.json 精細控制。auto mode 是最佳平衡點——既不用每步確認，又有安全防護。"
./src/content/posts/tech/2026-03-16-claude-code-dangerously-skip-permissions.md:10:series:
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing.md:7:tldr: "DevContainer 讓 Claude Code 跑在標準化的容器環境中——依賴、工具、設定全部一致。Sandboxing 限制 Bash 指令的檔案系統和網路存取。兩者搭配是 YOLO 模式最安全的用法。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing.md:10:series:
./src/content/posts/tech/2026-04-02-code-review-graph-knowledge-graph-ai-review.md:7:tldr: "code-review-graph 用 Tree-sitter 解析 codebase 建立持久化知識圖譜，追蹤變更的爆炸半徑，只把真正相關的 context 餵給 AI，號稱平均省下 8.2 倍 token。"
./src/content/posts/tech/deep-dive/2026-03-27-ai-driven-dev-workflow-openspec-to-deploy.md:7:tldr: "用 OpenSpec 把需求拆成工程任務，Claude Code 實作，hooks 自動格式化和保護，commit 前本地 review，PR 上三個 AI reviewer 平行審查，merge 後自動部署。整套流程讓一個人能維護六個子專案的品質。"
./src/content/posts/tech/deep-dive/2026-03-27-ai-driven-dev-workflow-openspec-to-deploy.md:10:series:
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-best-practices-workflows.md:7:tldr: "整理 Claude Code 官方推薦的使用模式：如何寫好 prompt、善用 plan mode 規劃、用 git worktree 平行開發、管理 context window、處理大型 codebase，以及從初學到進階的成長路徑。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-best-practices-workflows.md:10:series:
./src/content/posts/tech/2026-03-27-zustand-state-management.md:7:tldr: "不需要 Provider、不需要 reducer，幾行就能設定好全域狀態。NobodyClimb 用它管 auth 和 UI 狀態，搭配 TanStack Query 處理 server state。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-ci-cd-github-actions.md:7:tldr: "用 claude-code-action 在 GitHub Actions 中跑 Claude Code——@claude 在 PR/Issue 留言自動回應、開 PR 觸發 AI code review、merge 後自動產生 release notes。支援 Anthropic API、AWS Bedrock、Google Vertex AI。搭配 CLAUDE.md 定義團隊標準。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-ci-cd-github-actions.md:10:series:
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-mcp-server-integration.md:7:tldr: "MCP（Model Context Protocol）讓 Claude Code 透過標準協議連上外部工具——GitHub、Slack、資料庫、自製 API 都行。本文介紹 MCP 的運作原理、如何設定 server、實際串接案例，以及安全考量。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-mcp-server-integration.md:10:series:
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-plugins-marketplaces-guide.md:7:tldr: "Plugin 把 skills、agents、hooks、MCP servers 打包成一個可安裝的單位。透過 Marketplace 分發給團隊或社群。從 .claude/ 單檔設定到 plugin 只需要搬目錄加 manifest。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-plugins-marketplaces-guide.md:10:series:
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-chrome-integration.md:7:tldr: "claude --chrome 讓 Claude Code 連上你的 Chrome 瀏覽器——讀 console log、點按鈕、填表單、截圖、錄 GIF。寫完 code 直接在瀏覽器驗證，不用切換 context。共享你的登入狀態，能操作 Google Docs、Notion 等已登入的 app。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-chrome-integration.md:10:series:
./src/content/posts/tech/2026-03-20-mcp-tool-token-overflow-search-jobs.md:7:tldr: "MCP tool 回傳 description 欄位導致 1033 筆職缺超過 token 上限，改成預設不回傳 description 並加上分頁就解決了。"
./src/content/posts/tech/deep-dive/2026-03-27-remote-agent-auto-dev-pipeline.md:7:tldr: "用 Claude Code 的 Scheduled Remote Agent，每 2 小時自動掃描 GitHub issues、實作功能、開 PR、修 review feedback。人類只需要寫 issue 和按 merge。搭配自製的 /publish-tasks skill，把 OpenSpec 的工程任務一鍵發成 GitHub issues。"
./src/content/posts/tech/deep-dive/2026-03-27-remote-agent-auto-dev-pipeline.md:10:series:
./src/content/posts/tech/deep-dive/2026-03-27-file-bug-issue-skill-remote-agent.md:7:tldr: "Debug 到一半發現修不了？用 /file-bug-issue 直接把對話中的錯誤分析、重現步驟、已嘗試的方案打包成一個結構完整的 GitHub issue。搭配 Remote Agent，還能讓 AI 自動接手修復。"
./src/content/posts/tech/deep-dive/2026-03-27-file-bug-issue-skill-remote-agent.md:10:series:
./src/content/posts/tech/2026-03-31-gemini-cli-google-terminal-agent.md:7:tldr: "Gemini CLI 是 Google 開源的終端機 AI agent（Apache 2.0），免費帳號每分鐘 60 次、每天 1,000 次請求。支援 1M token context window、Google Search grounding、MCP 擴充，並整合 Gemini Code Assist 與 VS Code。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-claude-md-agents-md-guide.md:7:tldr: "CLAUDE.md 是專案層級的 AI 行為指引，AGENTS.md 是給子代理的任務範本。兩者都是 markdown，不用寫程式，但能大幅改變 AI 的行為品質。本文介紹語法、放置位置、繼承規則，以及實際案例。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-claude-md-agents-md-guide.md:10:series:
./src/content/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture.md:7:tldr: "Next.js + Expo 前端、Node.js + Python 雙後端、PostgreSQL + Redis 核心架構，加上社交通知系統與 LLM 推薦引擎，島島如何用現代技術棧打造學習社群平台。"
./src/content/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture.md:10:type: deep-dive
./src/content/posts/tech/2026-04-17-cloudflare-workers-ai-binding-utilities.md:7:tldr: "env.AI 這個 binding 不是只有 run()。它還掛了 toMarkdown（文件轉 Markdown）、autorag（託管 RAG）、gateway（外部 provider 代理）、models（metadata 查詢）。認識這四組方法，才能在 Workers 上把 Cloudflare 當完整的 AI 平台用。"
./src/content/posts/tech/2026-04-17-cloudflare-workers-ai-binding-utilities.md:133:AutoRAG（現在叫 **AI Search**）是 Cloudflare 把這整條 pipeline 託管起來：你把文件丟 R2，它自動 chunk、embed、存進 Vectorize，查詢一行。
./src/content/posts/tech/2026-03-27-celery-python-task-queue.md:7:tldr: "Celery 是 Python 最主流的分散式任務佇列，用 Redis 或 RabbitMQ 當 broker，讓耗時工作跑在背景。島島的 AI 服務用它處理 LLM 回饋生成等非同步任務。"
./src/content/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture.md:7:tldr: "一個攀岩社群平台，從 Web、Mobile 到 AI 問答全部跑在 Cloudflare 上，沒有獨立伺服器。"
./src/content/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture.md:10:type: deep-dive
./src/content/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture.md:8:tldr: "用 Cloudflare Workers AI（gemma-3-12b-it + bge-m3）打造可動態組裝的 RAG pipeline，14 個基礎 step + 6 個 LangGraph 專屬節點，三種策略圖（Baseline / Agentic / Plan-Execute）動態切換。"
./src/content/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture.md:9:description: "NobodyClimb AI 問答系統的完整架構筆記：模型選擇、20 節點 pipeline 設計（含三種 LangGraph 策略圖）、PipelineEngine 實作、條件路由、self-reflection 迴圈與 Cloudflare Workers 上的部署取捨。"
./src/content/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture.md:11:type: deep-dive
./src/content/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture.md:32:整個查詢流程設計成模組化的 pipeline。基礎 pipeline engine 有 14 個 step 分 5 個 phase，加上 LangGraph 層的 6 個專屬節點，共計 **20 個 unique 節點**，依查詢複雜度動態選擇策略：
./src/content/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture.md:128:## LangGraph 策略層
./src/content/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture.md:130:基礎 pipeline engine 處理的是「一條直線」的查詢流程。但不同複雜度的查詢需要不同的檢索策略——簡單問題不需要跑完 14 步，複雜問題可能需要多輪迭代。LangGraph 在 pipeline engine 之上提供了三種策略圖：
./src/content/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture.md:162:| 15 | memoryExtractor | LangGraph | 對話記憶萃取 |
./src/content/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture.md:163:| 16 | agenticDecision | LangGraph | 多輪檢索決策 |
./src/content/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture.md:164:| 17 | agenticRetrieve | LangGraph | 自適應重檢索 |
./src/content/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture.md:165:| 18 | planning | LangGraph | 子任務拆解 |
./src/content/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture.md:166:| 19 | executePlanStep | LangGraph | 子任務執行 |
./src/content/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture.md:167:| 20 | synthesis | LangGraph | 多結果合併 |
./src/content/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture.md:214:- [LangGraph 官方文件](https://langchain-ai.github.io/langgraph/)
./src/content/posts/tech/2026-03-27-blog-aeo-answer-engine-optimization-guide.md:7:tldr: "AEO（Answer Engine Optimization）是針對 AI 搜尋引擎（Perplexity、ChatGPT Search、Google AI Overview）的內容優化策略。核心是讓你的內容成為 AI 最容易引用的「答案來源」，而不只是搜尋結果中的一個連結。"
./src/content/posts/tech/2026-03-27-blog-aeo-answer-engine-optimization-guide.md:10:type: guide
./src/content/posts/tech/2026-03-27-blog-aeo-answer-engine-optimization-guide.md:106:tldr: "AEO 是針對 AI 搜尋引擎的內容優化策略，核心是讓內容成為 AI 最容易引用的答案來源。"
./src/content/posts/tech/2026-03-27-github-actions-ci-cd.md:7:tldr: "GitHub Actions 是目前最省設定成本的 CI/CD 工具，適合中小型專案。Monorepo 的關鍵是用 path filter 讓只有受影響的 app 觸發 build。"
./src/content/posts/ai/2026-03-30-harness-engineering-patterns.md:7:tldr: "Harness 不只是呼叫 LLM 的 wrapper。Tool Registry 管理工具的動態載入與選擇、Guard System 建立四層防護網、Checkpoint-Resume 讓長時間任務可以中斷恢復。這三個模式是生產級 Agent 系統的關鍵基礎設施。"
./src/content/posts/ai/2026-03-30-harness-engineering-patterns.md:310:  type: 'input' | 'output' | 'tool' | 'budget';
./src/content/posts/ai/2026-03-30-harness-engineering-patterns.md:342:    type: Guard['type'],
./src/content/posts/ai/2026-03-30-harness-engineering-patterns.md:368:  type: 'input',
./src/content/posts/ai/2026-03-30-harness-engineering-patterns.md:386:  type: 'budget',
./src/content/posts/ai/2026-03-30-harness-engineering-patterns.md:403:  type: 'tool',
./src/content/posts/ai/2026-03-30-harness-engineering-patterns.md:957:這些指標用 [Langfuse](/posts/ai/2026-03-26-langfuse-llm-observability-guide) 或類似的 LLM observability 平台追蹤最方便。每個 Agent 步驟作為一個 span，整個任務作為一個 trace，Guard 結果和 Checkpoint 事件作為 event 附加上去。
./src/content/posts/ai/2026-03-30-harness-engineering-patterns.md:1005:- [LangGraph GitHub Repository](https://github.com/langchain-ai/langgraph) — 內建 durable execution 和 checkpointing 的主流 agent 框架
./src/content/posts/ai/2026-03-26-glm5-model-intro.md:7:tldr: "GLM-5 是智譜 AI（Z.ai）於 2026 年 2 月發布的 744B MoE 開源模型，完全在華為昇騰晶片上訓練，以 MIT 授權開源。它是目前開源模型中排名最高的，在 Humanity's Last Exam 等基準上甚至超越 Claude 和 GPT-5，而 API 定價只有它們的 1/5 到 1/8。"
./src/content/posts/tech/2026-03-31-codex-cli-openai-coding-agent.md:7:tldr: "Codex CLI 是 OpenAI 的開源終端機 coding agent，用 Rust 打造，支援 MCP、subagents、圖片輸入、code review。搭配 codex-1（o3 優化版）或 GPT-5-Codex 模型，可在本地端直接讀寫、執行程式碼。"
./src/content/posts/tech/deep-dive/2026-03-26-code-review-comment-classification.md:7:tldr: "主流分類系統有三種路線：Conventional Comments（標籤制）、Google 嚴重度前綴（Nit/Optional/FYI）、SonarQube 四象限（Bug/Vulnerability/Code Smell/Hotspot）。AI review 工具各自發展出不同分類，但核心維度收斂在正確性、安全、效能、可維護性四大塊。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution.md:7:tldr: "Sub-agent 是在獨立 context window 中執行的專業 AI 助手。用 markdown 檔案定義 system prompt、工具權限、模型選擇，Claude 自動在適當時機委派任務。內建 Explore、Plan、general-purpose 三種，也可以自訂。搭配 persistent memory 跨 session 累積知識。"
./src/content/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution.md:10:series:
./src/content/posts/tech/2026-03-27-prisma-orm-typescript.md:7:tldr: "Prisma 用 schema-first 設計讓資料庫 migration 有版本控制、查詢有完整 TypeScript 型別、關聯查詢直覺。代價是學習曲線和 ORM 的固有限制，但對多數 TypeScript 專案是值得的換法。"
./src/content/posts/tech/2026-03-15-cloudflare-origin-health-check-502.md:7:tldr: "nginx 重啟期間短暫出錯，Cloudflare 偵測到 origin 不健康後停止轉發請求，自己回傳 502。localhost 打 origin 是 200，nginx access log 空白是關鍵線索。等 Cloudflare 自動 re-check 即可恢復。"
./src/content/posts/tech/2026-03-15-cloudflare-origin-health-check-502.md:72:content-type: text/plain; charset=UTF-8
./src/content/posts/tech/2026-03-15-cloudflare-origin-health-check-502.md:82:- `content-type: text/plain`，nginx 的 502 頁面是 HTML
./src/content/posts/tech/2026-03-27-biome-linter-formatter.md:7:tldr: "Biome 一個工具做 ESLint + Prettier 兩個工具的事，速度快 10-20 倍，設定簡單很多。DaoDAO 在整個 monorepo 用它，lint + format 一次過。"
./src/content/posts/tech/2026-03-27-shadcn-ui-component-library.md:7:tldr: "shadcn/ui 不是 npm 套件，它把元件原始碼複製到你的專案，你完全擁有這些程式碼。島島用它建立 packages/ui 元件庫，讓三個 Next.js app 共用同一套 UI。"
./src/content/posts/tech/2026-03-27-react-hook-form-zod-validation.md:7:tldr: "React Hook Form 處理表單效能，Zod 定義驗證 schema，兩者搭配讓表單開發幾乎不需要寫樣板程式碼。在 monorepo 裡共用 Zod schema，前後端驗證邏輯一份就夠。"
./src/content/posts/tech/2026-03-27-expressjs-node-backend.md:7:tldr: "Express 是 Node.js 最成熟的 Web framework，middleware 生態完整、學習資源豐富。搭配 TypeScript 和清楚的分層架構，在 2026 年仍然是有理由選的選項。"
./src/content/posts/tech/2026-03-16-install-verify-superpowers-copilot-cli.md:7:tldr: "紀錄在本機為 Copilot CLI 安裝 Superpowers（DwainTR 打包）、遇到安裝後看不到技能的診斷流程，以及最終解法和實用建議。"
./src/content/posts/tech/2026-03-13-cloudflare-worker-maintenance-page-free-plan.md:7:tldr: "Cloudflare Custom Error Pages 需要付費方案，Free Plan 可改用 Worker inline HTML 攔截 5xx。"
./src/content/posts/tech/2026-03-24-action-maker-ai-integration.md:7:tldr: "把 action-maker 從假資料升級為 Cloudflare Workers AI 即時生成，架構拆成 Worker（純 AI）、Server（存資料）、Frontend（串接），踩了 Qwen3 thinking block 和 Workers AI response 格式兩個坑。"
./src/content/posts/tech/2026-03-24-action-maker-ai-integration.md:45:  ├─ Langfuse → 追蹤每次 AI call
./src/content/posts/tech/2026-03-24-action-maker-ai-integration.md:275:- [Langfuse - LLM Observability](https://langfuse.com/)
./src/content/posts/tech/2026-03-27-redis-cache-queue-overview.md:7:tldr: "Redis 是 in-memory key-value store，快到不像話，島島用它同時扛快取、Session、BullMQ 任務佇列三個職責，一台 Redis 幹三件事。"
./src/content/posts/tech/2026-03-27-redis-cache-queue-overview.md:100:await pub.publish('notifications', JSON.stringify({ type: 'mention', userId: '123' }));
./src/content/posts/tech/2026-03-27-tanstack-query-server-state.md:7:tldr: "自己用 useState + useEffect 管 API 資料，等於重造輪子還造得比較差。TanStack Query 處理快取、背景更新、loading/error 狀態，讓你專注在 UI 邏輯。"
./src/content/posts/tech/2026-03-20-intro-vulnerability-scanning-and-trivy.md:7:tldr: "弱掃不是只為了交報告，而是幫你提早知道系統裡有哪些已知風險。這篇用 Trivy 當例子，快速介紹弱掃在掃什麼、常見結果怎麼看，以及該怎麼開始。"
./src/content/posts/ai/2026-04-12-claude-managed-agents-intro.md:7:tldr: "Claude Managed Agents 是 Anthropic 2026/04/08 推出的 beta 服務，提供 agent harness 加雲端容器沙箱，按 token 加 $0.08/session-hour 計費，適合長時間非同步任務，不想自己寫 agent loop 和跑沙箱的人值得看。"
./src/content/posts/ai/2026-04-12-claude-managed-agents-intro.md:85:        match event.type:
./src/content/posts/tech/2026-04-02-gitbook-documentation-platform.md:7:tldr: "GitBook 是一個以 Git 為底層的文件平台，支援 Markdown 編輯、版本控制、多人協作。適合技術文件、API docs、內部知識庫。免費方案對個人和小團隊夠用。"
./src/content/posts/tech/2026-03-27-nextjs-15-app-router-overview.md:7:tldr: "Next.js 15 + React 19 的 App Router 把渲染責任從客戶端移到伺服器，use cache 讓快取邏輯直接跟資料綁在一起而不是散在 fetch 選項裡。島島和 NobodyClimb 都選它，原因很務實。"
./src/content/posts/ai/2026-03-12-agentic-rag-react-loop.md:7:tldr: "複雜多跳問題，RAG 一次搜尋不夠。Agentic RAG 讓 LLM 評估結果是否充分，不夠就改寫查詢再搜一次，形成 ReAct 迴圈。"
./src/content/posts/ai/2026-04-05-notebooklm-py-unofficial-api.md:7:tldr: "notebooklm-py 透過逆向工程 Google 的 batchexecute RPC 協議，讓你用 Python / CLI / AI Agent 程式化操作 NotebookLM，包含音訊、影片、投影片、測驗等生成功能。"
./src/content/posts/ai/2026-04-05-clawhip-event-notification-router.md:7:tldr: "clawhip 是一個 Rust 寫的 daemon，專門把 AI coding agent 的事件（commit、PR、session 狀態）路由到 Discord / Slack，解決多 Agent 並行時「不知道誰在做什麼」的可觀測性問題。"
./src/content/posts/ai/2026-04-05-oh-my-openagent-multi-model-orchestration.md:7:tldr: "oh-my-openagent（OmO）把 OpenCode 從單一 LLM 工具變成多模型 Agent 團隊——Opus 當主力、GPT-5.2 當架構師、Gemini 做前端、Sonnet 查文件，一個 ultrawork 關鍵字觸發全員並行。48K stars，UltraWorkers 生態系中最早建立多 Agent 編碼模式的專案。"
./src/content/posts/ai/2026-03-16-multi-agent-rag-patterns.md:7:tldr: "單一 RAG Agent 處理所有查詢會遇到知識邊界和效能瓶頸。Multi-Agent RAG 把檢索任務分派給多個專業化 Agent，每個 Agent 有自己的知識庫和檢索策略，由中央 Orchestrator 協調合併結果。"
./src/content/posts/tech/2026-03-29-gstack-linux-stack-trace-tool.md:7:tldr: "gstack 是 Garry Tan 開源的 Claude Code skills 工具集，用 20 個專業 skill 把一個人變成一整個工程團隊——從產品規劃、設計審查、code review、QA 到部署，全部自動化。"
./src/content/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai.md:7:tldr: "在 Cloudflare Workers AI 上跑 LLM，gemma-3-12b-it 的繁體中文指令跟隨比 llama-3.1-8b-instruct 明顯更好，12B 參數對 RAG 問答這個 use case 夠用。"
./src/content/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai.md:32:相比自己架推論服務，好處是明顯的：不需要管 GPU、不需要 model serving 的 ops 工作、跟 Workers 的其他 binding（D1、KV、Vectorize）在同一個環境。
./src/content/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai.md:91:  response_format: { type: "json_object" },
./src/content/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai.md:146:- JSON 輸出模式穩定，`response_format: { type: "json_object" }` 很少回傳格式錯誤的東西
./src/content/posts/ai/2026-03-12-text-to-sql-router.md:7:tldr: "「我今年完攀幾條」這種問題，RAG 語義搜尋永遠不如直接查資料庫。讓 LLM 識別意圖、提取參數，執行預定義 SQL 模板。"
./src/content/posts/ai/2026-03-12-text-to-sql-router.md:74:→ query_type: 'sql'
./src/content/posts/ai/2026-03-28-harness-engineering-evolution.md:7:tldr: "AI 工程經歷三個階段：Prompt Engineering（寫好指令）→ Context Engineering（餵對資訊）→ Harness Engineering（設計整個工作環境）。每一次演化不是取代前者，而是在更高的抽象層級上操作。"
./src/content/posts/ai/2026-03-28-harness-engineering-evolution.md:128:- [LangGraph GitHub Repository](https://github.com/langchain-ai/langgraph) — 實作 harness 編排層的代表性框架
./src/content/posts/ai/2026-03-28-openclaw-tools-exec-thinking.md:7:tldr: "Exec 支援前景/背景/PTY 執行 + 三種安全等級（deny/allowlist/full），Thinking 有 7 個層級（off 到 adaptive），Slash Commands 分指令和 directive 兩類。"
./src/content/posts/ai/2026-03-12-hyde-hypothetical-document-embeddings.md:7:tldr: "用 LLM 先生成一份「理想答案」，再把這份假設文件 embed 去搜尋，比直接搜尋查詢本身效果更好。"
./src/content/posts/ai/2026-03-12-hyde-hypothetical-document-embeddings.md:64:  searchVectorize(queryEmbedding, filter, topK),
./src/content/posts/ai/2026-03-12-hyde-hypothetical-document-embeddings.md:65:  searchVectorize(hydeEmbedding, filter, topK),
./src/content/posts/tech/2026-03-27-opennextjs-cloudflare-adapter.md:7:tldr: "@opennextjs/cloudflare 讓 Next.js 15 App Router 部署到 Cloudflare Workers，動態 SSR 走 Worker，靜態資源走 Cloudflare Assets。沒有 server 管理成本，但有明確的功能限制。"
./src/content/posts/ai/2026-03-30-ticketing-dead-review-new-planning.md:7:tldr: "當 AI agent 能在幾分鐘內把 intent 變成 PR，軟體工程的瓶頸就從「規劃該做什麼」翻轉成「評估做出來的東西對不對」。Ticketing 時代的產物（sprint、story point、backlog grooming）正在壓縮歸零，取而代之的核心實踐是 review。"
./src/content/posts/ai/2026-04-01-llama-cpp-local-llm-inference.md:7:tldr: "llama.cpp 是目前最廣泛使用的本地 LLM 推論引擎，用純 C/C++ 實作，支援 CPU、Metal、CUDA、Vulkan 等多後端，搭配 GGUF 量化格式讓消費級硬體能跑數十億參數的模型。"
./src/content/posts/ai/2026-03-28-openclaw-threat-model.md:7:tldr: "OpenClaw 用 MITRE ATLAS 框架分析 AI 系統威脅，有三個 Critical 風險（prompt injection、惡意 skill、憑證竊取），並用 TLA+ 形式驗證安全屬性。"
./src/content/posts/ai/2026-03-28-anthropic-harness-design.md:7:tldr: "同一個模型在不同的 harness 設計下會產生截然不同的結果。Anthropic 用雙 Agent 架構、跨 session 狀態檔、GAN 式 generator-evaluator 迴圈，讓 Claude 能自主完成數小時的軟體開發任務。"
./src/content/posts/ai/2026-04-02-agent-cli-claude-code.md:7:tldr: "Claude Code 從 $20/mo Pro 到 $200/mo Max 20x，Opus 4.6 推理深度業界最強，Max 方案吃到飽定價讓重度使用者省下 90%+ 的 API 費用。"
./src/content/posts/ai/2026-04-02-multi-model-routing-opensource-tools.md:7:tldr: "透過多模型路由，將 70% 的簡單任務導向便宜模型，只讓 10-15% 的複雜任務使用旗艦模型，實測節省 40-85% 推論成本。本文介紹五個主要開源工具的架構與實作。"
./src/content/posts/ai/2026-04-04-internal-ai-coding-agents.md:7:tldr: "矽谷一線公司各自獨立打造內部 AI coding agent，從 Slack 訊息到 merged PR 全程自動化。深入拆解 Stripe、Ramp、Coinbase、Spotify 四家的架構，再擴展到 Google、Meta、Amazon、Uber、Goldman Sachs、Walmart 等十多家公司的做法與指標。"
./src/content/posts/ai/2026-03-28-openclaw-model-providers.md:7:tldr: "OpenClaw 支援 35+ 模型供應商，最低需求是模型支援 tool use + streaming，內建 auth 輪替和 model failover 機制。"
./src/content/posts/ai/2026-03-12-bge-m3-embedding-model-selection.md:7:tldr: "Embedding 模型的選擇直接影響 RAG 的搜尋品質。BGE-M3 的多語言訓練、1024 維向量、同系列 Reranker，是繁中 RAG 的實用選擇。"
./src/content/posts/ai/2026-03-12-bge-m3-embedding-model-selection.md:41:- Vectorize 的查詢速度：維度越高越慢
./src/content/posts/ai/2026-03-12-rag-cost-optimization.md:7:tldr: "RAG 系統的成本來自 LLM token、Embedding API、向量搜尋。每個環節都有可以壓成本的地方，但要確認優化沒有犧牲太多品質。"
./src/content/posts/ai/2026-03-12-rag-cost-optimization.md:35:在 Cloudflare Workers AI 的環境，LLM 生成通常佔 70-80%，Embedding 佔 10-15%，其餘是資料庫和 Vectorize。
./src/content/posts/ai/2026-03-12-rag-cost-optimization.md:120:const queryResults = await searchVectorize(ctx.queryEmbedding, filter);
./src/content/posts/ai/2026-04-03-chemistry-times-analysis.md:7:tldr: "GitHub 上已有 6,400+ 個 .claude/agents/*.md 檔案。我們拆解了 4 個代表性專案——ChemistryTimes（內容生產 pipeline）、claude-sub-agent（document-driven 開發流水線）、agentic（Temporal.io DAG 平行執行）、vs-copilot-multi-agent（Hook 強制記憶寫入）——加上 ruflo 的企業級 swarm 架構，歸納出 6 種設計模式和 5 個實戰趨勢。"
./src/content/posts/ai/2026-04-03-chemistry-times-analysis.md:289:`validate-write-note.sh` Hook 還會驗證合約的 tag 格式（必須有 `type:contract` + `app:` tag），格式不對直接 block。
./src/content/posts/ai/2026-03-28-openclaw-gateway-network.md:7:tldr: "Gateway 預設只綁 loopback，遠端存取用 SSH tunnel 或 Tailscale Serve/Funnel，多 Gateway 可以分散負載。"
./src/content/posts/ai/2026-03-12-plan-and-execute-rag.md:7:tldr: "對複雜問題，先讓 LLM 規劃出需要哪些資訊、分幾步取得，再按計畫執行，比邊搜邊想更系統化。"
./src/content/posts/ai/2026-03-28-openclaw-install-local.md:7:tldr: "OpenClaw 提供 6 種本機安裝方式：installer script、npm、Docker、Podman、Nix、Bun，加上 Raspberry Pi 部署和 source 編譯。"
./src/content/posts/ai/2026-03-28-openclaw-multi-agent.md:7:tldr: "OpenClaw 支援在一個 Gateway 內跑多個隔離 agent，透過 binding 路由訊息，還能用 Delegate 架構讓 AI 以代理人身份行動。"
./src/content/posts/ai/2026-04-18-github-copilot-coding-agent-guide.md:7:tldr: "GitHub Copilot Coding Agent 讓你把 Issue 指派給 Copilot，它在雲端沙箱裡自動開 branch、寫程式、跑 CI、開 PR。成功關鍵是設好 AGENTS.md，沒設定的話 agent 容易跑偏。適合定義清楚的中型任務，需 Pro+（每月 1,500 premium requests）或 Enterprise 方案。"
./src/content/posts/ai/2026-03-12-cross-encoder-reranking.md:7:tldr: "向量搜尋的相似度分數不等於相關性，Cross-Encoder 用成對比較重新排序，把真正相關的文件推上來。"
./src/content/posts/ai/2026-03-28-openclaw-session-memory.md:7:tldr: "OpenClaw 的 session 支援 4 種 DM 隔離層級，Memory 是 Markdown 檔案，Compaction 在 context 快滿時自動摘要壓縮。"
./src/content/posts/ai/2026-03-12-memory-personalization.md:7:tldr: "每次對話後，異步提取用戶可能的偏好和程度，下次查詢時自動個性化搜尋條件，不需要使用者手動設定。"
./src/content/posts/ai/2026-03-12-naive-advanced-modular-rag-evolution.md:7:tldr: "Naive RAG 夠用但有很多問題，Advanced RAG 針對性修補，Modular RAG 重新架構讓系統可組合、可配置。了解三個世代，才能理解現代 RAG 系統為什麼長這樣。"
./src/content/posts/ai/2026-03-12-query-classification-adaptive-routing.md:7:tldr: "不是所有問題都需要 RAG。用 LLM 先分類查詢類型，再決定執行路徑，節省成本又提升準確度。"
./src/content/posts/ai/2026-03-12-query-classification-adaptive-routing.md:38:    query_type: {
./src/content/posts/ai/2026-04-10-agent-skills-engineering-workflows.md:7:tldr: "Agent Skills 是 Addy Osmani 開源的 19 個生產級工程技能，透過 /spec → /plan → /build → /test → /review → /ship 的指令驅動 AI 代理遵循資深工程師的開發紀律，而不是走捷徑。"
./src/content/posts/ai/2026-04-18-mcp-vs-cli-vs-api-agent-tool-interface.md:7:tldr: "MCP 不會退場，但有效範圍比想像中窄。本機開發場景 CLI 和 raw API 幾乎都贏過 MCP；MCP 真正不可替代的，是「跨 agent 共享的本機工具層」這條窄縫。"
./src/content/posts/ai/2026-03-28-openclaw-agent-runtime.md:7:tldr: "OpenClaw 的 agent 有自己的「家」（Workspace），靠 AGENTS.md、SOUL.md 等 bootstrap 檔案定義人格和行為，System Prompt 每次動態組裝。"
./src/content/posts/ai/2026-03-12-self-reflection-llm-as-judge.md:7:tldr: "用另一個 LLM 評估回答的準確度和品質，分數太低就重新生成，並自動加上適當的免責聲明。"
./src/content/posts/ai/2026-03-28-openclaw-auth-secrets.md:7:tldr: "API Key 最穩、OAuth 用 PKCE + token sink 模式、SecretRef 支援 env/file/exec 三種來源、Trusted Proxy 可以委託 reverse proxy 做認證。"
./src/content/posts/ai/2026-04-18-agentic-ai-sdlc-workflow.md:7:tldr: "Agentic AI 不只是 autocomplete，而是能自主執行多步驟任務的 AI 系統。這篇文章拆解 SDLC 的五大階段，說明每個階段能從哪裡切入、怎麼從 CLI 工具走到全流程自動化，以及目前最值得追蹤的外部資源。"
./src/content/posts/ai/2026-03-28-openclaw-gateway-config.md:7:tldr: "openclaw.json 用 JSON5 格式，嚴格 schema 驗證，支援 hybrid hot reload（安全變更即時生效，關鍵變更自動重啟）。"
./src/content/posts/ai/2026-03-28-google-multi-agent-patterns.md:7:tldr: "Google 整理了八種 multi-agent 設計模式：從最簡單的 Sequential Pipeline 到可組合的 Composite Pattern。不是越複雜越好——選對模式比堆 agent 重要。"
./src/content/posts/ai/2026-03-28-google-multi-agent-patterns.md:180:- [LangGraph GitHub Repository](https://github.com/langchain-ai/langgraph) — 實作 orchestrator-workers 和 sequential pipeline 模式的主流框架
./src/content/posts/ai/2026-03-14-vllm-inference-engine.md:7:tldr: "vLLM 用 PagedAttention 解決 KV cache 記憶體浪費問題，搭配 continuous batching 和 prefix caching，成為目前最主流的開源 LLM 推論引擎。"
./src/content/posts/ai/2026-04-05-hermes-agent-intro.md:7:tldr: "Hermes Agent 是 Nous Research 開源的自我改進 AI 代理，具備持久記憶、技能學習、40+ 工具、多平台閘道，支援 200+ 模型供應商，是 OpenClaw 的正式繼承者。"
./src/content/posts/ai/2026-04-05-hermes-agent-intro.md:171:| 面向 | Hermes Agent | LangGraph | Claude Code |
./src/content/posts/ai/2026-03-12-rag-observability-tracing.md:7:tldr: "RAG 系統最難的不是建起來，是搞清楚為什麼這次回答不好。Pipeline Tracing 把每個步驟的決策和數據記下來，讓除錯有跡可循。"
./src/content/posts/ai/2026-03-12-rag-observability-tracing.md:210:- [Langfuse - Open Source LLM Observability](https://langfuse.com/docs)
./src/content/posts/ai/2026-04-17-vercel-open-agents-intro.md:7:tldr: "Vercel Labs 開源的 coding agent 參考實作。三層架構分離 web UI、agent workflow、sandbox VM，設計給想自建 Claude Code / Cursor Background Agent 的團隊當起手。"
./src/content/posts/ai/2026-03-28-openclaw-automation-cron-webhook.md:7:tldr: "Heartbeat 定期巡檢（30 分鐘批次），Cron 精確排程（支援隔離 session 和模型覆寫），Webhook 接收外部事件觸發 agent。"
./src/content/posts/ai/2026-03-31-mobile-small-models.md:7:tldr: "2026 年行動端 LLM 主力是 Gemma 3n、Qwen 3.5 Small、Llama 3.2、Phi-4-mini、Ministral 3 和 SmolLM3。3B 以下量化模型在 8GB RAM 手機上能跑到 30–50 tokens/sec，但 RAM、散熱和 context window 仍是硬限制。"
./src/content/posts/ai/2026-03-12-rag-streaming-sse.md:7:tldr: "LLM 生成需要 3-5 秒，等全部生成完再顯示體驗很差。SSE 讓 token 一邊生成一邊推送，首個字元出現時間從 5 秒縮到 1 秒以內。"
./src/content/posts/ai/2026-03-12-rag-streaming-sse.md:153:    sendEvent({ type: "done", queryId, sources, quotaRemaining });
./src/content/posts/ai/2026-03-12-rag-streaming-sse.md:163:    sendEvent({ type: "error", message: error.message });
./src/content/posts/ai/2026-03-17-ai-agents-context-cognition-action.md:7:tldr: "AI Agent 不是黑盒子——它由三層構成：知道什麼（Context）、怎麼想（Cognition）、能做什麼（Action）。搞清楚這三層，才能理解 agent 為什麼有時聰明、有時失控，以及怎麼設計一個真正好用的 agent 系統。"
./src/content/posts/ai/2026-03-17-ai-agents-context-cognition-action.md:85:記錄具體發生過的事件：「上週三用戶說他不喜歡 bullet point 格式」、「昨天這個 API 回傳了 404」。這類記憶通常用 vector database 實作，透過語意相似度來檢索相關的過去經驗，在需要的時候注入 context。
./src/content/posts/ai/2026-03-12-rag-cold-start.md:7:tldr: "RAG 系統需要資料才能回答問題，但一開始就沒有資料。冷啟動策略決定了系統從空到可用的路徑。"
./src/content/posts/ai/2026-03-12-rag-cold-start.md:37:          type: 'route',
./src/content/posts/ai/2026-03-12-rag-cold-start.md:40:          route_type: route.routeType,
./src/content/posts/ai/2026-04-03-react-agent-cache-design.md:7:tldr: "拆解 Claude Code 的 18+ 種快取機制後發現：provider-level prompt cache 你做不了，但 embedding cache、tool result cache、entity cache 你不但做得了，效果還更好。附完整的 AgentCache 介面設計與 per-tool TTL 策略。"
./src/content/posts/ai/2026-04-13-llm-council-karpathy-intro.md:7:tldr: "LLM Council 是 Andrej Karpathy 花一個週末做的本地 Web App，把一個問題同時丟給多個 LLM，再讓它們匿名互評，最後由 Chairman 模型綜合出一份答案。定位是讀書時比較模型用的小工具，99% vibe coded、不打算長期維護，但架構本身就是一份值得參考的 ensemble LLM 最小實作。"
./src/content/posts/ai/2026-04-02-agent-cli-kiro.md:7:tldr: "Kiro 免費方案含 50 credits，Auto 模式自動混合多模型省成本，Spec-Driven 開發流程將 vibe coding 升級為可追蹤的結構化開發，Agent Hooks 實現本地 CI/CD 自動化。"
./src/content/posts/ai/2026-03-12-rag-vs-fine-tuning.md:7:tldr: "RAG 和 Fine-tuning 解決的是不同問題。RAG 給模型新知識，Fine-tuning 改變模型的行為風格。大多數情況是兩者都用，而不是選一個。"
./src/content/posts/ai/2026-03-28-openclaw-install-cloud.md:7:tldr: "OpenClaw 支援部署到 9 個雲平台、K8s、Ansible 自動化佈建，最低每月 $5 就能跑 24/7 Gateway。"
./src/content/posts/ai/2026-03-28-openclaw-platforms-mobile.md:7:tldr: "OpenClaw 的 iOS 和 Android app 不是 Gateway，而是 Node——讓手機的相機、螢幕、位置、語音成為 AI agent 的感官延伸。"
./src/content/posts/ai/2026-03-28-openclaw-overview.md:7:tldr: "OpenClaw 有 200+ 份文件，這篇幫你搞懂全貌、知道每塊在講什麼、依你的角色決定從哪讀起。"
./src/content/posts/ai/2026-04-03-react-agent-dynamic-tool-prompt.md:7:tldr: "Claude Code 的 45 個 tool 中，每個 prompt() 都會根據用戶類型、feature flags、系統能力動態調整。將這個模式套用到 ReAct Agent，根據 orchestrator 模型能力、locale、可用 tools 三個維度動態生成 tool description，小模型自動補 few-shot，大模型省 token。"
./src/content/posts/ai/2026-03-13-prompt-engineering-iteration-guide.md:7:tldr: "好的 Prompt 不是一次寫出來的，而是迭代出來的。從最簡單的 prompt 開始，用真實 case 測試，分類錯誤類型，針對性修改。本文涵蓋 System Prompt 三段式結構、推理框架選擇、Few-shot 最佳化、Token 預算管理和六個常見錯誤。"
./src/content/posts/ai/2026-04-05-oh-my-claudecode-multi-agent-claude.md:7:tldr: "oh-my-claudecode（OMC）在 Claude Code 上加了 8 種協作模式、19 個專業 Agent、跨模型調度（Claude + Codex + Gemini），讓單人 CLI 工具變成多 Agent 開發平台。支援 Deep Interview 需求釐清、Smart Model Routing 省 30-50% token、rate limit 自動恢復。"
./src/content/posts/ai/2026-03-12-vector-database-comparison.md:2:title: "Vector Database 選型：Pinecone、Weaviate、Qdrant、Vectorize 怎麼選"
./src/content/posts/ai/2026-03-12-vector-database-comparison.md:7:tldr: "向量資料庫的選型比 LLM 選型更受部署平台限制。先確認平台和規模需求，再看功能特性，不要只看 benchmark。"
./src/content/posts/ai/2026-03-12-vector-database-comparison.md:8:description: "主流向量資料庫的比較：Pinecone、Weaviate、Qdrant、Chroma、Cloudflare Vectorize，各自的強項、限制，以及選型決策框架。"
./src/content/posts/ai/2026-03-12-vector-database-comparison.md:103:## Cloudflare Vectorize
./src/content/posts/ai/2026-03-12-vector-database-comparison.md:137:| | Pinecone | Weaviate | Qdrant | Chroma | Vectorize |
./src/content/posts/ai/2026-03-12-vector-database-comparison.md:151:  → 是 → Vectorize（架構最簡單）
./src/content/posts/ai/2026-03-12-vector-database-comparison.md:165:NobodyClimb 選擇 Cloudflare Vectorize 的原因很簡單：系統部署在 Cloudflare Workers，用 Vectorize 讓 embed + search 都在同一個 Cloudflare 網路內，沒有跨服務的網路延遲，架構也最簡單。
./src/content/posts/ai/2026-03-12-vector-database-comparison.md:169:向量資料庫的選型，70% 是由**部署平台和規模**決定的，30% 才是功能特性的比較。在 Cloudflare Workers 上，Vectorize 是自然選擇；在 AWS 上，Pinecone 有地利優勢；需要自架完全控制，Qdrant 是最成熟的開源選項。
./src/content/posts/ai/2026-03-12-vector-database-comparison.md:183:- [Cloudflare Vectorize Documentation](https://developers.cloudflare.com/vectorize/)
./src/content/posts/ai/2026-03-15-longrag-long-context-retrieval.md:7:tldr: "傳統 RAG 把文件切成小 chunks 再檢索，但這造成資訊碎片化。LongRAG 利用 100K+ token 的長上下文模型，檢索更大的文件區段（整個章節甚至整份文件），減少碎片化同時保持檢索效率。"
./src/content/posts/ai/2026-03-12-contextual-retrieval.md:7:tldr: "文件切塊後，每個 chunk 失去了它在原文件中的上下文。Contextual Retrieval 在索引時為每個 chunk 注入文件級別摘要，解決 chunk 孤島問題。"
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:2:title: "Langfuse 完整指南：LLM 應用的可觀測性從零開始"
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:7:tldr: "Langfuse 是目前最成熟的開源 LLM Observability 平台。這篇從 Tracing、Prompt 管理、評估、Dataset 四個核心功能切入，帶你搞清楚它在實際專案中怎麼用。"
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:8:description: "Langfuse 完整使用指南：從安裝設定到 Tracing、Prompt 版本管理、Evaluation 評估框架、Dataset 回歸測試，涵蓋 TypeScript/Python SDK 整合與實戰範例。"
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:16:Langfuse 就是解決這件事的工具。
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:20:## Langfuse 是什麼
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:22:Langfuse 是一個**開源的 LLM Observability 平台**，專門為 LLM 應用設計的監控和分析工具。它不是通用的 APM（像 Datadog 或 New Relic），而是針對 LLM 應用的特殊需求：追蹤 prompt 的輸入輸出、計算 token 成本、管理 prompt 版本、評估回答品質。
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:31:可以用 Langfuse Cloud（免費方案就能用），也可以完全自架（Docker Compose 或 Kubernetes）。
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:56:# 啟動（包含 PostgreSQL 和 Langfuse server）
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:82:Tracing 是 Langfuse 最核心的功能。每次用戶發送一個請求，你的 LLM 應用背後可能做了很多事：查資料庫、呼叫 embedding API、做 retrieval、呼叫 LLM 生成回答。Tracing 把這些步驟全部記錄下來，讓你事後可以逐步檢視。
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:86:Langfuse 的 trace 由三種元素組成：
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:97:import Langfuse from "langfuse";
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:99:const langfuse = new Langfuse({
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:171:在 Langfuse Dashboard 裡，你可以點開任何一個 trace，看到完整的呼叫樹：每個步驟花了多久、LLM 收到什麼 prompt、回了什麼、用了多少 token。
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:175:如果你的應用主要就是呼叫 OpenAI API，Langfuse 提供了一個 wrapper，幾乎不用改程式碼：
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:245:Langfuse 的 Prompt Management 把 prompt 從程式碼中抽離出來，在 Dashboard 上管理。
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:249:在 Langfuse Dashboard 上建立一個 prompt，例如叫做 `rag-system-prompt`：
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:265:// 從 Langfuse 取得最新的 prompt
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:283:每次在 Dashboard 上修改 prompt，Langfuse 會自動建立新版本。你可以：
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:322:知道 LLM 回了什麼是第一步，知道它回答得**好不好**才是關鍵。Langfuse 提供三種評估方式：
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:336:把用戶的回饋（按讚/倒讚、評分）回傳給 Langfuse：
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:355:// 在 Langfuse Dashboard 設定 Evaluator
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:381:    response_format: { type: "json_object" },
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:386:  // 把分數送回 Langfuse
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:397:Langfuse 也有內建的 Evaluator 功能，可以在 Dashboard 上設定評估模板，針對新的 trace 自動執行評估，不需要在應用程式碼裡寫評估邏輯。
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:403:每次改 prompt、換模型、調整 retrieval 參數，你需要知道「改完之後有沒有變好」。Langfuse Datasets 讓你建立一組標準測試集，每次修改後重跑，比較結果。
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:490:Langfuse 會根據 generation 記錄的 model 和 token usage 自動計算費用。Dashboard 上可以看到：
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:497:不需要額外設定，只要 generation 裡有記錄 model 和 token usage，費用就會自動算出來。Langfuse 內建主流模型（OpenAI、Anthropic、Gemini 等）的定價資料，如果你用的是自架模型或 fine-tuned 模型，也可以在 Dashboard 上自訂定價。
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:505:Langfuse 不只有低階 SDK，也和主流框架有現成的整合：
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:533:// 啟用 telemetry，Langfuse 透過 OTEL exporter 接收
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:549:搭配 `@langfuse/vercel` 的 `LangfuseExporter` 設定 OpenTelemetry，就能自動把所有 Vercel AI SDK 呼叫送到 Langfuse。支援所有 AI SDK provider（OpenAI、Anthropic、Google、Mistral 等）。
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:568:把上面的功能串起來，一個典型的 Langfuse 使用流程是這樣的：
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:578:1. 收集用戶回饋（讚/倒讚），送到 Langfuse
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:591:## 該用 Langfuse 嗎？
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:609:如果你正在認真做一個 LLM 應用，Langfuse 值得花一個下午設定起來。看得見問題，才能修好問題。
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:615:- [Langfuse 官方文件](https://langfuse.com/docs)
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:616:- [Langfuse GitHub](https://github.com/langfuse/langfuse)
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:617:- [Langfuse Cloud](https://cloud.langfuse.com)
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:618:- [Langfuse Cookbook（整合範例集）](https://langfuse.com/guides/cookbook)
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:619:- [Langfuse TypeScript SDK](https://www.npmjs.com/package/langfuse)
./src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:620:- [Langfuse Python SDK](https://pypi.org/project/langfuse/)
./src/content/posts/ai/2026-03-28-openclaw-nodes-deep.md:7:tldr: "Node 是 Gateway 的周邊裝置——iOS/Android 提供相機/位置/通知，macOS 提供 Canvas/system.run，Node Host 讓遠端主機跑 exec。"
./src/content/posts/ai/2026-04-21-openai-codex-app-server.md:7:tldr: "OpenAI 把 Codex harness 包裝成 JSON-RPC over stdio 的 App Server，讓 VS Code、JetBrains、Web、桌面 App 都能共用同一套 agent loop，三個核心 primitive：Item、Turn、Thread。"
./src/content/posts/ai/2026-04-02-agent-cli-opencode.md:7:tldr: "OpenCode 是免費開源的 Go 語言 CLI agent，95K+ GitHub stars，支援 75+ 模型供應商含本地 Ollama，可用 Copilot/ChatGPT 帳號認證，session 中途切換模型不丟上下文。"
./src/content/posts/ai/2026-03-28-openclaw-channels-overview.md:7:tldr: "OpenClaw 支援 24+ 頻道同時運行，用 Pairing 控制誰能聊、用 Group Policy 控制群組行為、用 Routing 決定訊息送到哪個 agent。"
./src/content/posts/ai/2026-03-12-chunking-strategies.md:7:tldr: "切太大找不準，切太小失去上下文。Chunking 是 RAG 最被低估的環節，策略選錯，後面再多優化都是白費。"
./src/content/posts/ai/2026-04-01-agent-cli-guidelines.md:7:tldr: "Agent CLI 不是更聰明的補全工具，而是能讀懂 codebase、執行多步驟任務、操作真實環境的 AI 代理。Claude Code、Codex CLI、Gemini CLI、OpenCode、Aider、Pi、Kiro、Amp、Cursor CLI... 工具越來越多，但底層共享一套設計邏輯——理解這套邏輯，才能真正用好它們。"
./src/content/posts/ai/2026-04-21-openai-codex-agent-loop.md:7:tldr: "OpenAI 詳解 Codex 的 agent loop 設計：prompt 如何建構、multi-turn 對話如何管理、prompt caching 如何避免成本爆炸，以及 context window 自動壓縮的實作。"
./src/content/posts/ai/2026-04-05-openharness-agent-infrastructure.md:7:tldr: "香港大學 HKUDS 開源的 Agent Harness 框架，實作了工具呼叫、技能載入、記憶、權限、多代理協作等完整基礎設施，支援 Anthropic / OpenAI / GitHub Copilot 三種 API 格式。"
./src/content/posts/ai/2026-04-01-ig-carousel-automation-pipeline.md:7:tldr: "用 Claude Code 當 orchestrator，串接 Playwright 截圖、catbox.moe 圖床、Meta Graph API 發布、Telegram 通知，一句話完成 IG 輪播圖文的生成與發布。"
./src/content/posts/ai/2026-04-01-ig-carousel-automation-pipeline.md:10:type: guide
./src/content/posts/ai/2026-04-01-ig-carousel-automation-pipeline.md:374:      media_type: 'CAROUSEL',
./src/content/posts/ai/2026-04-21-ai-code-review-multi-agent-orchestration.md:7:tldr: "Cloudflare 內部跑了 30 天 Multi-Agent Code Review，131K 次 Review、中位數 3 分鐘。這篇整理他們的架構，以及 Anthropic、GitHub、CodeRabbit、Greptile 等業界方案怎麼做同一件事。"
./src/content/posts/ai/2026-03-12-rag-token-quota-system.md:7:tldr: "只限制請求次數不夠，一個超長的查詢可能消耗掉十個普通查詢的 token。雙重配額（請求數 + token 數）才能真正控制成本。"
./src/content/posts/ai/2026-04-03-llm-knowledge-vault.md:7:tldr: "Andrej Karpathy 提出用 LLM 編譯個人知識 wiki 的框架——收集原始資料、LLM 編譯成 .md wiki、對 wiki 做 Q&A、輸出歸檔回 wiki。本文比較三種實踐路線：Karpathy 的知識庫模式、社群的經驗庫模式、以及 quidproquo 的部落格模式。"
./src/content/posts/ai/2026-04-03-llm-knowledge-vault.md:72:| 索引方式 | LLM 自維護 index，不需 RAG | 未特別說明 | Cloudflare Vectorize 語義索引 |
./src/content/posts/ai/2026-04-03-llm-knowledge-vault.md:83:| 基礎設施 | 本地檔案系統 | 本地 + CLI hooks | Cloudflare Workers + D1 + Vectorize + KV |
./src/content/posts/ai/2026-03-12-multimodal-rag.md:7:tldr: "攀岩路線有大量圖片資訊（路線圖、岩壁照片），純文字 RAG 遺漏了這些。Multimodal RAG 讓圖片也能被搜尋和理解。"
./src/content/posts/ai/2026-03-12-multimodal-rag.md:47:  await vectorize.upsert([{ id: imageUrl, values: embedding, metadata: { type: 'image', url: imageUrl } }]);
./src/content/posts/ai/2026-03-12-multimodal-rag.md:107:      { type: "text", text: query },
./src/content/posts/ai/2026-03-12-multimodal-rag.md:108:      { type: "image_url", url: relevantImage.url },
./src/content/posts/ai/2026-04-01-turboquant-plus-kv-cache-compression.md:7:tldr: "TurboQuant+ 是 Google Research ICLR 2026 論文的開源實作，用 PolarQuant + QJL 兩階段量化壓縮 KV cache 達 3.8-6.4x，讓消費級硬體跑更大模型和更長上下文。"
./src/content/posts/ai/2026-03-28-openclaw-automation-standing-orders.md:7:tldr: "Standing Orders 給 agent 永久授權執行定義好的程式——有明確的範圍、觸發條件、approval gate 和升級規則，搭配 Cron 做時間控制。"
./src/content/posts/ai/2026-03-28-openclaw-channels-main.md:7:tldr: "WhatsApp 用 QR 配對 + Baileys、Telegram 用 Bot Token 最快上手、Discord 支援 guild/thread/button 互動元件。"
./src/content/posts/ai/2026-03-12-rag-evaluation-frameworks.md:7:tldr: "RAG 系統的品質很難用直覺評估。RAGAS、DeepEval、TruLens 提供了系統化的指標框架，讓你知道是哪個環節出問題。"
./src/content/posts/ai/2026-03-12-corrective-rag-crag.md:7:tldr: "過濾條件太嚴格導致零結果？CRAG 自動放寬過濾條件重試，比讓 LLM 用通用知識瞎猜好多了。"
./src/content/posts/ai/2026-03-12-corrective-rag-crag.md:28:原始過濾：{ crag_id: 'longtung', grade_numeric: { gte: 140 }, route_type: 'sport' }
./src/content/posts/ai/2026-03-12-corrective-rag-crag.md:31:    { crag_id: 'longtung', route_type: 'sport' }
./src/content/posts/ai/2026-03-12-rag-prompt-engineering.md:7:tldr: "搜尋找到了正確的文件，但 LLM 的回答還是不好——很多時候問題在 Prompt 設計。System prompt 結構、context 排版、指令語言都會影響輸出品質。"
./src/content/posts/ai/2026-03-28-openclaw-tools-skills-subagents.md:7:tldr: "Skills 是 AgentSkills 相容的 SKILL.md 資料夾，有 6 層載入優先順序。ClawHub 是公開市場。Sub-agent 最多巢狀 5 層。"
./src/content/posts/ai/2026-03-12-multi-query-expansion.md:7:tldr: "複雜查詢只用一個向量搜尋容易漏掉相關文件，讓 LLM 改寫成 3-5 個子查詢並行搜尋，召回率顯著提升。"
./src/content/posts/ai/2026-03-28-openclaw-channels-enterprise.md:7:tldr: "Slack 有最完整的企業功能（native streaming、slash commands），Teams 需 Azure Bot 設定，Matrix 支援 E2EE 加密。"
./src/content/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf.md:7:tldr: "向量搜尋抓語義，BM25 抓關鍵字，兩者用 RRF 融合才能同時照顧模糊查詢和精確術語。"
./src/content/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf.md:53:Query → Embedding（BGE-M3）→ 向量 → Vectorize（cosine search）→ Top-K 候選
./src/content/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf.md:56:Cloudflare Vectorize 管理向量索引，支援 `namespace` 區隔和 metadata 過濾，避免全表掃描。
./src/content/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf.md:64:  searchVectorize(queryVector, filter, topK),
./src/content/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf.md:113:Filter 同時套用到向量搜尋（Vectorize 原生支援）和 BM25（WHERE clause），保持兩路的結果集一致。
./src/content/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf.md:131:    ├→ [BGE-M3 Embedding] → [Vectorize] → Vector Results
./src/content/posts/ai/2026-04-17-autoreason-self-refinement-knows-when-to-stop.md:7:tldr: "Autoreason 用競爭式多版本評估（A/B/AB + 盲測 Borda count）取代傳統的「批評→改寫」迴圈，解決 LLM 自我修正中的提示偏差、範疇蔓延和缺乏克制三大問題。"
./src/content/posts/ai/2026-03-28-openclaw-pi-reference.md:7:tldr: "Pi 是 OpenClaw 內嵌的 coding agent runtime，OpenClaw 是 Pi 的 Gateway 殼。設定參考覆蓋 16 個頂層區塊、335 個文件。"
./src/content/posts/ai/2026-03-30-ai-ready-content.md:7:tldr: "2025–2026 年，網站不只要給人看，還要給 AI 看。從 llms.txt、Schema Markup、GEO 到 RAG ingestion pipeline，這篇整理了讓你的網站變成 AI 可用資料來源的完整技術地圖。"
./src/content/posts/ai/2026-03-30-ai-ready-content.md:116:  parameters: { query: { type: "string" } }
./src/content/posts/ai/2026-03-30-ai-ready-content.md:399:□ Embedding + 向量資料庫（Pinecone / Weaviate / Qdrant / Cloudflare Vectorize）
./src/content/posts/ai/2026-04-17-ai-native-team-practices.md:7:tldr: "不是每個人都該直接用 coding agent 改 code。AI Native 團隊要搞定 interface 規格、測試先行、monorepo、security guardrail、human-in-the-loop 與 token 預算管控，在 coding agent 上面再建一層 agent platform 並明確開發者角色轉型才是正途。"
./src/content/posts/ai/2026-04-17-ai-native-team-practices.md:134:工具生態已經很成熟：[Braintrust](https://www.braintrust.dev/articles/best-ai-agent-observability-tools-2026)、Langfuse、Arize、[Confident AI](https://www.confident-ai.com/knowledge-base/compare/best-ai-observability-tools-2026) 都提供完整的 tracing、evaluation、production monitoring。
./src/content/posts/ai/2026-04-01-agent-frameworks-2026.md:7:tldr: "按 GitHub Stars 排序，盤點 2026 年 15 個主流 AI Agent 框架的定位、特色與適用場景。不是排名，是地圖。"
./src/content/posts/ai/2026-04-01-agent-frameworks-2026.md:88:**跟 LangGraph 的關係：** LangChain 是元件庫，LangGraph 是編排引擎。需要複雜工作流用 LangGraph，簡單 agent 用 LangChain 就夠。
./src/content/posts/ai/2026-04-01-agent-frameworks-2026.md:124:**跟 LangGraph 的差別：** CrewAI 上手快、適合角色分工明確的場景；LangGraph 更適合需要精細狀態控制的複雜工作流。
./src/content/posts/ai/2026-04-01-agent-frameworks-2026.md:165:## 9. LangGraph — ~24.6k ⭐
./src/content/posts/ai/2026-04-01-agent-frameworks-2026.md:241:原名 Phidata，2025 年 1 月更名為 Agno（希臘文「純粹」）。設計哲學是「no graphs, chains, or convoluted patterns——just pure Python」。Agent 實例化 <5μs，記憶體用量比 LangGraph 低 50 倍。
./src/content/posts/ai/2026-04-01-agent-frameworks-2026.md:300:| 需要複雜狀態工作流 | LangGraph |
./src/content/posts/ai/2026-04-01-agent-frameworks-2026.md:311:OpenAI Agents SDK 綁 OpenAI，Claude Agent SDK 綁 Claude，Google ADK 對 Gemini 最佳化。LangGraph、CrewAI、Pydantic AI、Mastra 是模型無關的。如果你預期會換模型，選後者。
./src/content/posts/ai/2026-04-01-agent-frameworks-2026.md:323:- [LangGraph GitHub Repository](https://github.com/langchain-ai/langgraph) — 月下載量 38M+ 的 agent 編排框架，stateful workflow 與 durable execution 的代表
./src/content/posts/ai/2026-03-15-speculative-rag.md:7:tldr: "Speculative RAG 用小型專家模型從不同文件子集平行生成多個答案草稿，再由大型模型一次驗證選出最佳答案。準確度提升最高 12.97%，延遲降低最高 50.83%。"
./src/content/posts/ai/2026-03-28-openclaw-platforms-desktop.md:7:tldr: "OpenClaw 在 macOS 有選單列 app、Linux 用 systemd 跑服務、Windows 建議走 WSL2。三個平台的差異與注意事項。"
./src/content/posts/ai/2026-03-12-modular-rag-pipeline-architecture.md:7:tldr: "RAG 不是固定的三步流程，而是一組可以動態啟用、跳過、重排的步驟。Pipeline as Code 讓系統在不重新部署的情況下調整行為。"
./src/content/posts/ai/2026-03-31-open-source-llm-landscape.md:7:tldr: "2026 Q1 開源模型全面爆發：LLM 方面 GLM-5、Kimi K2.5、Qwen3.5 追上閉源；Embedding 和 Reranker 由 Qwen3 和 BGE 主導；語音有 Voxtral TTS 和 Whisper V3；圖像有 FLUX.2；影片有 Wan 2.2 追平 Sora。這篇是完整導覽地圖。"
./src/content/posts/ai/2026-03-12-rrf-multi-source-fusion.md:7:tldr: "BM25、向量搜尋、HyDE、Multi-Query 各出一份結果，怎麼合理地合成一份？RRF 用名次而不用分數，規避了跨系統分數無法比較的根本問題。"
./src/content/posts/ai/2026-03-28-openclaw-plugins.md:7:tldr: "Plugin 用 TypeScript ESM 開發，支援 12 種能力註冊（頻道/模型/工具/TTS/圖片等），發布到 ClawHub 或 npm。"
./src/content/posts/ai/2026-03-28-openclaw-plugins.md:79:        return { content: [{ type: "text", text: `Got: ${params.input}` }] };
./src/content/posts/ai/2026-04-05-oh-my-codex-workflow-layer.md:7:tldr: "oh-my-codex（OMX）不是取代 Codex CLI，而是在它上面加一層結構化工作流——從需求釐清、計畫產出到多 Agent 並行執行，用 4 個核心 Skill 把散亂的 prompt 對話變成可追蹤的開發流程。"
./src/content/posts/ai/2026-03-12-rag-ab-testing.md:7:tldr: "「加了 Cross-Encoder 之後感覺好多了」不是科學的評估。A/B 測試讓你知道改動是否真的有效，效果多大，在哪類查詢上有效。"
./src/content/posts/ai/2026-03-14-ollama-local-llm-guide.md:7:tldr: "Ollama 把 llama.cpp 包裝成 Docker 風格的 CLI + REST API，一行指令就能在本地跑 LLM。這篇從核心概念、安裝、API、硬體需求到 Modelfile 自訂，完整介紹這個工具適合什麼、不適合什麼。"
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:7:tldr: "聊天機器人不只是接 API。對話狀態管理、記憶機制、Streaming、Guardrails、可觀測性、技術棧選型，每一層都影響使用者體驗。"
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:8:description: "從對話狀態架構（Session/User/Global State）、記憶策略（Sliding Window/Summary+Recent/Selective）、SSE Streaming、三層 Guardrails、Langfuse 可觀測性到 TypeScript vs Python 技術棧選型的完整開發指南。"
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:452:  type: 'fact' | 'preference' | 'decision' | 'general';
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:457:  private vectorStore: VectorStore; // Qdrant / Pinecone / Cloudflare Vectorize
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:476:        type: fact.type,
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:499:  ): Promise<{ content: string; type: MemoryEntry['type'] }[]> {
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:522:      response_format: { type: 'json_object' },
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:704:              type: 'content',
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:715:          type: 'done',
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:725:          type: 'error',
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1314:### Langfuse 整合
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1316:[Langfuse](https://langfuse.com) 是開源的 LLM 可觀測性平台。它可以追蹤每一次 LLM 呼叫的 input/output、token 用量、延遲、成本。
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1319:import { Langfuse } from 'langfuse';
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1321:const langfuse = new Langfuse({
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1430:| **Token Cost** | 每次對話成本 | 依預算 | Langfuse 自動追蹤 |
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1439:  const langfuse = new Langfuse({ /* ... */ });
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1441:  // 用 Langfuse API 撈資料
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1542:│  Vector DB:  Cloudflare Vectorize        │
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1551:│  ✓ 基礎設施即平台（KV + D1 + Vectorize） │
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1568:  VECTORIZE: VectorizeIndex;
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1586:  // 2. Recall memories from Vectorize
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1637:| **向量搜尋** | Vectorize（整合平台） | Qdrant/Weaviate（更多選擇） |
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1686:│  │  PostgreSQL + pgvector  |  Redis  |  Langfuse  │  │
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1737:         │      Observability (Langfuse)    │
./src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1750:- [Langfuse Documentation — Tracing](https://langfuse.com/docs/tracing) — Langfuse 官方文件，LLM 可觀測性與 trace 追蹤實作指南
./src/content/posts/ai/2026-04-10-graphify-knowledge-graph-codebase.md:7:tldr: "Graphify 用 tree-sitter AST 提取程式碼結構，再用 LLM 語意分析文件與圖片，把整個專案壓縮成一張可查詢的知識圖譜。號稱每次查詢比讀原始檔案省 71.5 倍 token。"
./src/content/posts/ai/2026-04-02-agent-cli-openai-codex.md:7:tldr: "Codex 綁定 ChatGPT 訂閱（$20-200/mo），GPT-5.4 + mini 自動路由是亮點，CLI 支援 Plan 模式與 API Key 模式雙軌計費。"
./src/content/posts/ai/2026-03-28-openclaw-tools-browser-search.md:7:tldr: "OpenClaw 的瀏覽器用 managed profile 隔離、支援遠端 CDP（Browserless/Browserbase）、Deep Research 結合搜尋和瀏覽做多步驟研究。"
./src/content/posts/ai/2026-03-28-openclaw-ui.md:7:tldr: "Control UI 是瀏覽器 dashboard（http://127.0.0.1:18789），TUI 是終端互動介面，Web Chat 是 WebSocket 即時聊天。"
./src/content/posts/ai/2026-03-28-phil-schmid-agent-harness.md:7:tldr: "模型是 CPU，harness 是作業系統，agent 是應用程式。模型能力再強，沒有好的 harness 就只是 demo。Phil Schmid 認為 harness 是 2026 年 AI 工程最關鍵的基礎設施。"
./src/content/posts/ai/2026-03-28-phil-schmid-agent-harness.md:111:- [LangGraph GitHub Repository](https://github.com/langchain-ai/langgraph) — LangChain DeepAgents 的底層引擎，Phil 提及的 harness 標準化嘗試之一
./src/content/posts/ai/2026-03-12-splade-sparse-vectors.md:7:tldr: "BM25 只認識查詢裡出現的詞，SPLADE 能推斷相關詞彙並加入搜尋，在保持關鍵字搜尋精確性的同時獲得部分語義能力。"
./src/content/posts/ai/2026-04-18-markitdown-intro.md:7:tldr: "Microsoft 開源的輕量工具，把 PDF、Office、圖片、音訊等格式統一轉成 Markdown，專門為 LLM pipeline 設計。"
./src/content/posts/ai/2026-04-14-claude-octopus-plugin-intro.md:7:tldr: "Claude Octopus 是一個 Claude Code plugin，能同時叫 Codex、Gemini、Copilot、Qwen、Ollama、Perplexity、OpenRouter 和 Claude 一起看同一份 code，用 75% 共識門檻找單模型的盲點。內建 32 個 persona、48 個 /octo:* slash commands、51 個 skill、以及 Dark Factory 全自動 spec-to-code 管線。"
./src/content/posts/ai/2026-03-12-colbert-late-interaction.md:7:tldr: "Bi-Encoder 太粗糙，Cross-Encoder 太慢，ColBERT 的 Late Interaction 在兩者之間找到平衡：token 級別的相互比較，但可以預先計算文件向量。"
./src/content/posts/ai/2026-03-12-rag-guardrails.md:7:tldr: "RAG 系統面對的攻擊不只是技術層面的，Prompt Injection 和 Jailbreak 是真實威脅。輸入輸出都需要獨立的防護層。"
./src/content/posts/ai/2026-03-12-graph-rag.md:7:tldr: "向量搜尋找相似，圖搜尋走關係。當問題需要跨多個實體的推理（岩場→路線→完攀者→難度分布），GraphRAG 比標準 RAG 更有優勢。"
./src/content/posts/ai/2026-03-12-graph-rag.md:78:  graph.addNode({ id: crag.id, type: 'Crag', properties: crag });
./src/content/posts/ai/2026-03-12-graph-rag.md:83:  graph.addNode({ id: route.id, type: 'Route', properties: route });
./src/content/posts/ai/2026-03-12-graph-rag.md:141:- [From Local to Global: A Graph RAG Approach to Query-Focused Summarization (2024)](https://arxiv.org/abs/2404.16130)
./src/content/posts/ai/2026-04-02-agent-cli-gemini-cli.md:7:tldr: "Gemini CLI 免費提供 60 req/min、1,000 req/day，含 Gemini 2.5 Pro 和 1M token context window。Google 開源專案，多數開發者完全不需要付費。"
./src/content/posts/ai/2026-04-18-knowledge-pipeline-rag-quality-control.md:7:tldr: "一個六層確定性管線，從 URL 擷取到向量嵌入全自動處理，透過八維度評分系統在資料進 RAG 之前就篩掉垃圾。"
./src/content/posts/ai/2026-03-12-mmr-diversity-reranking.md:7:tldr: "只看相關性會讓結果都是同一條路線的不同描述，MMR 在相關性和多樣性之間取平衡，再疊加熱門度讓結果更實用。"
./src/content/posts/ai/2026-04-02-agent-cli-subscription-multi-model-routing.md:7:tldr: "比較 2026 年六大 Agent CLI 訂閱方案（Claude Code、Cursor CLI、Codex、Kiro、Gemini CLI、OpenCode），並研究多模型路由模式——簡單任務給便宜模型、複雜任務給強模型，實測可省 40-85% 成本。"
./src/content/posts/ai/2026-04-02-agent-cli-cursor.md:7:tldr: "Cursor CLI 將 IDE 的 Agent 帶入終端，支援 interactive TUI 與 headless 模式、Plan/Ask/Agent 三種模式、Cloud Handoff 雲端接力、CI/CD 整合，$20-200/mo。"
./src/content/posts/ai/2026-03-19-agent-memory-systems.md:7:tldr: "RAG 是唯讀的。Agent Memory 讓 AI 不只能讀，還能寫入和持久化資訊。三種記憶類型：Procedural（行為模式）、Episodic（時間事件）、Semantic（事實知識），構成完整的認知記憶系統。"
./src/content/posts/ai/2026-03-19-agent-memory-systems.md:111:  type: 'procedural' | 'episodic' | 'semantic';
./src/content/posts/ai/2026-03-19-agent-memory-systems.md:156:  type: 'procedural';
./src/content/posts/ai/2026-03-19-agent-memory-systems.md:169:    type: 'procedural',
./src/content/posts/ai/2026-03-19-agent-memory-systems.md:179:    type: 'procedural',
./src/content/posts/ai/2026-03-19-agent-memory-systems.md:230:  type: 'episodic';
./src/content/posts/ai/2026-03-19-agent-memory-systems.md:252:    filter: { userId, type: 'episodic' },
./src/content/posts/ai/2026-03-19-agent-memory-systems.md:292:  type: 'semantic';
./src/content/posts/ai/2026-03-19-agent-memory-systems.md:317:      type: 'semantic',
./src/content/posts/ai/2026-03-19-agent-memory-systems.md:375:  type: 'procedural' | 'episodic' | 'semantic';
./src/content/posts/ai/2026-03-19-agent-memory-systems.md:455:      type: extraction.type,
./src/content/posts/ai/2026-03-19-agent-memory-systems.md:499:    const memories = await this.metadataStore.find({ userId, type: 'procedural', active: true });
./src/content/posts/ai/2026-03-19-agent-memory-systems.md:507:      query, filter: { userId, type: 'episodic' }, limit: limit * 2,
./src/content/posts/ai/2026-03-19-agent-memory-systems.md:526:      query, filter: { userId, type: 'semantic', supersededBy: null }, limit,
./src/content/posts/ai/2026-03-19-agent-memory-systems.md:668:    type: incoming.type,
./src/content/posts/ai/2026-03-19-agent-memory-systems.md:744:  async forgetAllByType(userId: string, type: Memory['type']): Promise<number> {
./src/content/posts/ai/2026-03-12-semantic-caching.md:7:tldr: "快取不只能比對完全一樣的查詢，語義相近的問題也能命中快取，省下整個 RAG pipeline 的執行。"
./src/content/posts/ai/2026-03-30-skill-vs-subagent-comparison.md:7:tldr: "Skill 是你手動呼叫的 prompt 模板，Subagent 是 Claude 自動 routing 的獨立 agent。看起來很像，但觸發方式、工具隔離、context 管理完全不同。"
./src/content/posts/ai/2026-03-12-rag-observability-tools.md:7:tldr: "自己寫 trace 夠用，但開源工具讓你少做很多事。Langfuse、Phoenix、LangSmith 各有定位，選哪個取決於你對自架、開源、整合複雜度的取捨。"
./src/content/posts/ai/2026-03-12-rag-observability-tools.md:8:description: "2026 年 RAG 可觀測性工具的比較：Langfuse、Phoenix（Arize）、LangSmith、Helicone，各自的強項、弱點，以及如何選擇。"
./src/content/posts/ai/2026-03-12-rag-observability-tools.md:18:## Langfuse
./src/content/posts/ai/2026-03-12-rag-observability-tools.md:32:import Langfuse from "langfuse";
./src/content/posts/ai/2026-03-12-rag-observability-tools.md:34:const langfuse = new Langfuse({
./src/content/posts/ai/2026-03-12-rag-observability-tools.md:93:- Trace 視圖（類似 Langfuse）
./src/content/posts/ai/2026-03-12-rag-observability-tools.md:116:- 相較 Langfuse，Prompt 管理功能較弱
./src/content/posts/ai/2026-03-12-rag-observability-tools.md:124:**定位**：LangChain 官方的 Observability 平台，與 LangChain / LangGraph 深度整合。
./src/content/posts/ai/2026-03-12-rag-observability-tools.md:196:| | Langfuse | Phoenix | LangSmith | Helicone |
./src/content/posts/ai/2026-03-12-rag-observability-tools.md:209:**自架 + 完整功能** → Langfuse。目前最成熟的開源選項，評估框架完整，Prompt 版本管理是加分項。
./src/content/posts/ai/2026-03-12-rag-observability-tools.md:219:NobodyClimb 的系統選擇了自訂 trace，主要原因是部署在 Cloudflare Workers（不能輕易跑外部 SDK 的 flush 機制），且 trace 資料需要和業務資料（攀岩路線、用戶資料）緊密整合。但如果是重新開始且沒有平台限制，Langfuse 會是第一個試的選項。
./src/content/posts/ai/2026-03-12-rag-observability-tools.md:225:- [Langfuse Documentation](https://langfuse.com/docs)
./src/content/posts/ai/2026-03-12-rag-observability-tools.md:226:- [Langfuse GitHub Repository](https://github.com/langfuse/langfuse)
./src/content/posts/ai/2026-04-20-agentic-engineering-intro.md:7:tldr: "Agentic Engineering 不是讓 AI 寫更快的程式碼，而是讓軟體更快走完整個交付流程——透過多 agent 協作，壓縮跨團隊的協作摩擦。"
./src/content/posts/ai/2026-04-20-agentic-engineering-intro.md:8:description: "Cisco 工程師的實戰報告：用 LangGraph + LangSmith + LangMem 建出 multi-agent 系統，debug 工作流縮短 93%、開發流程加速 65%。拆解 Worker Agent、Leader Agent 的架構設計，以及 A2A、MCP、CLI 的接入選擇。"
./src/content/posts/ai/2026-04-20-agentic-engineering-intro.md:62:Cisco 評估了多個框架後選擇 LangGraph + LangSmith + LangMem，理由是它們把三個對 production 最重要的事情當作一等公民：
./src/content/posts/ai/2026-04-20-agentic-engineering-intro.md:64:**LangGraph**——狀態管理和流程編排
./src/content/posts/ai/2026-04-20-agentic-engineering-intro.md:87:   → Worker Agent 用 LangGraph 分析意圖
./src/content/posts/ai/2026-04-20-agentic-engineering-intro.md:96:   → LangGraph checkpoint 追蹤每一步的執行狀態
./src/content/posts/ai/2026-03-26-kimi-model-intro.md:7:tldr: "Kimi 是中國 AI 新創月之暗面（Moonshot AI）推出的大型語言模型，以超長 context window、開源策略和極具競爭力的定價聞名。從 2023 年的 200K context 到 2026 年的 K2.5 Agent Swarm，Kimi 已成為全球 AI 市場不可忽視的力量。"
./src/content/posts/ai/2026-03-12-rag-failure-modes.md:7:tldr: "RAG 系統出問題，90% 的情況是這 10 種之一。先識別是哪種失敗模式，再找對應的解法，比盲目優化有效很多。"
./src/content/posts/ai/2026-03-28-openclaw-sandbox.md:7:tldr: "OpenClaw 沙箱有三層控制：Sandbox 決定在哪跑（Docker/SSH/OpenShell）、Tool Policy 決定能用什麼工具、Elevated 是 exec 的主機逃生門。"
./src/content/posts/ai/2026-03-28-openclaw-more-providers.md:7:tldr: "除了 Anthropic/OpenAI/Google 三大家，OpenClaw 還支援 30+ 供應商，從 DeepSeek 到本地 Ollama 都有。"
./src/content/posts/ai/2026-04-05-claw-code-rust-claude-code-reimplementation.md:7:tldr: "Claw Code 是用 Rust 從零重寫的 Claude Code CLI 替代品，48K 行程式碼、40 個工具、MIT 授權。最驚人的是整個專案在 5 天內由多個 AI Agent 協作完成，上線不到一週就突破 170K stars。"
./src/content/posts/ai/2026-03-28-openclaw-agent-loop.md:7:tldr: "一次 agent 執行：收到訊息 → context 組裝 → 模型推理 → tool 執行 → 串流回覆 → 持久化。每個 session 串行、支援 5 種佇列模式。"
./src/content/posts/ai/2026-03-27-langgraph-agent-orchestration.md:2:title: "LangGraph：用圖結構管理 Agent 工作流程"
./src/content/posts/ai/2026-03-27-langgraph-agent-orchestration.md:7:tldr: "LangGraph 把 LLM 工作流程建模成有向圖，解決多輪迭代、條件分支、平行執行這些用線性 pipeline 做很痛的問題。"
./src/content/posts/ai/2026-03-27-langgraph-agent-orchestration.md:8:description: "LangGraph 是什麼、為什麼比 plain pipeline 好用、nobodyclimb 怎麼用它管理三種 RAG 策略圖（Baseline / Agentic / Plan-Execute），以及什麼時候用它反而是 overkill。"
./src/content/posts/ai/2026-03-27-langgraph-agent-orchestration.md:14:線性 pipeline 加這些邏輯，最終變成一堆 if/else 散落在各處。LangGraph 的核心主張是：把這些流程控制結構明確建模成圖。
./src/content/posts/ai/2026-03-27-langgraph-agent-orchestration.md:16:## LangGraph 是什麼
./src/content/posts/ai/2026-03-27-langgraph-agent-orchestration.md:18:LangGraph 是 LangChain 生態系的一個子框架，核心概念是把 LLM 工作流程表示成 **有向圖（directed graph）**，節點是執行單元（可以是 LLM 呼叫、工具呼叫、任何 function），邊是節點之間的轉移，支援條件邊（conditional edges）決定要走哪條路。
./src/content/posts/ai/2026-03-27-langgraph-agent-orchestration.md:63:**條件路由**：線性 pipeline 裡要跳過某些 step，通常靠 step 內部判斷或在 engine 層加 `skipWhen` 條件。當條件多起來，哪個 step 會跑、哪個不跑，光看程式碼很難一眼看出。LangGraph 把路由邏輯集中在 edges，圖的結構即是文件。
./src/content/posts/ai/2026-03-27-langgraph-agent-orchestration.md:65:**迴圈**：pipeline 通常假設單次執行。要加重試迴圈，要麼在 engine 層加全域 loop 控制，要麼讓 step 自己呼叫回去，兩種都是 workaround。LangGraph 的 cyclic graph 是一等公民。
./src/content/posts/ai/2026-03-27-langgraph-agent-orchestration.md:67:**平行執行**：LangGraph 支援 `Send` API 做 map-reduce，可以把一個任務拆成多個並行分支再合併，不需要手寫 `Promise.all`。
./src/content/posts/ai/2026-03-27-langgraph-agent-orchestration.md:71:nobodyclimb 的 AI 問答系統在 pipeline engine（14 個基礎 step）之上，用 LangGraph 加了一層策略選擇。根據查詢複雜度自動路由到三種圖：
./src/content/posts/ai/2026-03-27-langgraph-agent-orchestration.md:99:這三種圖共享同一組基礎 step 實作，差異只在圖的結構和幾個 LangGraph 專屬節點。
./src/content/posts/ai/2026-03-27-langgraph-agent-orchestration.md:101:## 什麼時候用 LangGraph，什麼時候 overkill
./src/content/posts/ai/2026-03-27-langgraph-agent-orchestration.md:115:- 在意 dependency 大小（LangGraph 拉進來的依賴不小）
./src/content/posts/ai/2026-03-27-langgraph-agent-orchestration.md:117:判斷標準很直接：如果你的 pipeline 有超過一個條件分支，或需要任何形式的迴圈，LangGraph 值得考慮。如果你的流程可以用一張線性清單描述完，不需要它。
./src/content/posts/ai/2026-03-27-langgraph-agent-orchestration.md:131:- 如果只用 LangGraph 不用 LangChain 其他部分，單純為了圖結構引入整個生態系的成本要考慮
./src/content/posts/ai/2026-03-27-langgraph-agent-orchestration.md:135:- [LangGraph 官方文件](https://langchain-ai.github.io/langgraph/)
./src/content/posts/ai/2026-03-27-langgraph-agent-orchestration.md:136:- [LangGraph 概念：Graphs](https://langchain-ai.github.io/langgraph/concepts/low_level/)
./src/content/posts/ai/2026-03-27-langgraph-agent-orchestration.md:137:- [LangGraph 概念：State Management](https://langchain-ai.github.io/langgraph/concepts/low_level/#state)
./src/content/posts/ai/2026-03-27-langgraph-agent-orchestration.md:138:- [LangGraph How-to Guides](https://langchain-ai.github.io/langgraph/how-tos/)
./src/content/posts/ai/2026-03-28-openclaw-model-advanced.md:7:tldr: "OpenClaw 內建 Auth 輪替 + Model Fallback 兩階段容錯，加上 Prompt Caching 省錢和完整的 Token 追蹤機制。"
./src/content/posts/ai/2026-03-28-openclaw-troubleshooting.md:7:tldr: "openclaw doctor 是一站式診斷工具，openclaw sandbox explain 排查沙箱問題，openclaw channels status --probe 檢查頻道連線。"
./src/content/posts/ai/2026-04-21-openai-harness-engineering-codex-agent-first.md:7:tldr: "OpenAI 內部團隊 5 個月、3 人、0 行手寫程式碼，用 Codex 交付了一個完整產品。這篇整理他們在 AGENTS.md 設計、repo-local 知識庫、架構強制執行、entropy 管理上的核心心得。"
./src/content/posts/ai/2026-03-28-openclaw-channels-others.md:7:tldr: "Signal 用 signal-cli 注重隱私、iMessage 推薦走 BlueBubbles、LINE 用 webhook、IRC/Nostr/Twitch 各有特色。"
./src/content/posts/ai/2026-04-02-ai-hardware-local-inference-guide.md:7:tldr: "比較 NVIDIA DGX Spark、Apple Mac Studio M4 Ultra、ASUS Ascent GX10、MSI AI Edge 等個人 AI 工作站，幫你找到適合的本地推論硬體。"
./src/content/posts/ai/2026-03-28-openclaw-tools-tts-pdf-lobster.md:7:tldr: "TTS 支援 ElevenLabs/Microsoft/OpenAI 三家，PDF 有 native 和 extraction 兩種模式，Lobster 是確定性工作流 runtime，MCP 支援外部工具擴展。"
./src/content/posts/ai/2026-03-14-rag-patterns-complete-guide.md:7:tldr: "RAG 已經從簡單的「搜尋+生成」演化成涵蓋十個世代的技術體系。本文是系統化導航：從 Naive RAG 到 Multi-Agent RAG 的十代演化、檢索策略、Chunking、Embedding、Reranking、評估框架、可觀測性、成本優化。每個主題都有對應專文深入。"
./src/content/posts/ai/2026-03-14-rag-patterns-complete-guide.md:429:Pinecone（全託管、最省事）、Weaviate（開源、hybrid search 內建）、Qdrant（Rust 寫的、效能好）、Cloudflare Vectorize（邊緣部署）——每個都有不同的取捨。選型要考慮：部署模式、規模、hybrid search 支持、metadata filtering、成本。
./src/content/posts/ai/2026-03-14-rag-patterns-complete-guide.md:431:→ [Vector Database 選型：Pinecone、Weaviate、Qdrant、Vectorize 怎麼選](/posts/ai/2026-03-12-vector-database-comparison)
./src/content/posts/ai/2026-03-14-rag-patterns-complete-guide.md:625:- [From Local to Global: A Graph RAG Approach to Query-Focused Summarization](https://arxiv.org/abs/2404.16130) — Edge et al. (2024)，Microsoft GraphRAG 原始論文，知識圖譜加強全域查詢
./src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:7:tldr: "AI Agent 不是一個技術，是一整個架構體系。本文是系統化導航：從 Agent 三支柱（Context/Cognition/Action）出發，穿過 AI 工程三階段演化（Prompt → Context → Harness），到八種 Multi-Agent 設計模式和生產級 Harness 基礎設施。每個主題都有對應專文深入。"
./src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:8:description: "AI Agent 架構的系統化導航指南：Agent 三支柱模型、AI 工程三階段演化、Context Engineering、Prompt Engineering、Google 八種 Multi-Agent 模式、Anthropic Harness 設計、LangGraph 工作流、MCP 標準化協定、Agent Memory、聊天機器人開發，以及可觀測性。"
./src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:66:    │  • LangGraph       │   │  • Coordinator    │   │  • Guardrails     │
./src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:85:| 7 | LangGraph | 圖結構的 Agent 工作流框架 | 執行框架 |
./src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:244:## 7. LangGraph 工作流程
./src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:246:LangGraph 是 LangChain 團隊推出的 Agent 工作流框架，核心理念是：**用圖結構來定義 Agent 的控制流程。**
./src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:248:傳統的 Agent 框架（像 LangChain 的 AgentExecutor）是把 Agent 包在一個 while loop 裡，讓 LLM 自己決定每一步要做什麼。LangGraph 不一樣——它要求你明確定義節點（node）和邊（edge），把 Agent 的行為變成一個有向圖。
./src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:257:LangGraph 特別適合那些需要「有結構的自由度」的場景——Agent 在某些步驟有固定流程，在某些步驟可以自主決策。
./src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:279:上面是一個簡化的 Corrective RAG 圖——LangGraph 的典型用例。每個方框是一個 node，箭頭是 edge，分支邏輯由 conditional edge 決定。整個流程是確定性的框架，但每個 node 內部可以是非確定性的 LLM 呼叫。
./src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:281:LangGraph 和前面提到的 Multi-Agent 設計模式不是互斥的——LangGraph 是實作層的框架，Multi-Agent 模式是設計層的概念。你可以用 LangGraph 來實作 Sequential、Coordinator、或 Hierarchical 模式。
./src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:283:→ **專文深入**：[LangGraph：用圖結構管理 Agent 工作流程](/posts/ai/2026-03-27-langgraph-agent-orchestration)
./src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:365:Langfuse 是目前最流行的開源 LLM 可觀測性平台，它提供：
./src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:388:→ **專文深入**：[Langfuse 完整指南：LLM 應用的可觀測性從零開始](/posts/ai/2026-03-26-langfuse-llm-observability-guide)
./src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:439:Harness Engineering → Multi-Agent 設計模式 → LangGraph → MCP
./src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:442:當你的 Agent 已經能基本運作，這條路線幫你建造更複雜、更可靠的系統。Harness 給你控制層，Multi-Agent 給你架構模式，LangGraph 給你執行框架，MCP 給你標準化的工具整合。這條路線大約需要 1.5 小時。
./src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:456:→ Multi-Agent → LangGraph → MCP → Memory → 聊天機器人 → 可觀測性
./src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:467:| Agent 陷入無限迴圈 | Agent 設計原則（停止條件）→ LangGraph（結構化控制流） |
./src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:468:| 不知道 Agent 為什麼出錯 | 可觀測性（Langfuse） |
./src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:469:| 單一 Agent 不夠用 | Multi-Agent 設計模式 → LangGraph |
./src/content/posts/ai/2026-03-24-context-engineering-guide.md:7:tldr: "Context Engineering 是 2025 年取代 Prompt Engineering 的核心概念：重點不再是「怎麼問」，而是「給什麼資訊」。把對的資訊在對的時機送進 context window，比換更強的模型更有效。這篇整理了定義、四大策略、實作技巧和常見失敗模式。"
./src/content/posts/ai/2026-03-24-context-engineering-guide.md:155:LangGraph 的做法：用 typed state fields 把不同類型的 context 分開管理，只在需要的節點才注入特定的 state。
./src/content/posts/ai/2026-03-24-context-engineering-guide.md:317:- [LangChain — Context Engineering for Agents](https://blog.langchain.com/context-engineering-for-agents/) — LangChain，Write/Select/Compress/Isolate 四大策略的完整分析與 LangGraph 整合方式
./src/content/posts/ai/2026-04-20-multi-model-ai-code-review-pipeline.md:7:tldr: "AI 模型審查自己的程式碼時會自我合理化，用三個不同 CLI 做獨立 review 可以有效捕捉盲點——這篇介紹背後的設計哲學與實際的工作流程模式。"
./src/content/posts/ai/2026-03-22-mcp-model-context-protocol.md:7:tldr: "每個 AI 工具都有自己的呼叫格式，整合成本高。MCP（Model Context Protocol）是 Anthropic 提出的開放標準，統一 AI Agent 與外部工具、資料源的通訊協定，讓工具可以跨 Agent 重用。"
./src/content/posts/ai/2026-03-22-mcp-model-context-protocol.md:699:            type: "text" as const,
./src/content/posts/ai/2026-03-22-mcp-model-context-protocol.md:709:          type: "text" as const,
./src/content/posts/ai/2026-03-22-mcp-model-context-protocol.md:738:            type: "text" as const,
./src/content/posts/ai/2026-03-22-mcp-model-context-protocol.md:751:          type: "text" as const,
./src/content/posts/ai/2026-03-22-mcp-model-context-protocol.md:796:          type: "text" as const,
./src/content/posts/ai/2026-03-20-claude-certified-architect-foundations-guide.md:7:tldr: "Claude 官方架構師認證的完整備考指南：五大領域重點、六大考試情境、常見反模式與實際演練建議。"
./src/content/posts/ai/2026-04-18-encyclopedia-of-agentic-coding-patterns.md:7:tldr: "Encyclopedia of Agentic Coding Patterns 收錄 190 個 pattern，幫你在 AI 代寫程式的時代做出正確的軟體決策——而這本書本身就是由 AI agent 自主撰寫和維護的。"

codex
我已確認這份清單不是憑空寫的，很多項目在 repo 裡都有對應文件或半成品。但也看到了幾個明顯的排程與依賴問題，接著會把它們對到實際檔案逐一指出。
exec
/bin/zsh -lc "sed -n '1,220p' package.json" in /Users/xiaoxu/Projects/quidproquo
exec
/bin/zsh -lc "sed -n '1,220p' src/content.config.ts" in /Users/xiaoxu/Projects/quidproquo
 succeeded in 0ms:
{
  "name": "quidproquo",
  "type": "module",
  "version": "0.0.1",
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "node scripts/create-cron-stub.mjs && astro build && node scripts/create-cron-entry.mjs && node scripts/generate-og-images.mjs",
    "deploy": "pnpm build && wrangler deploy --config dist/server/wrangler.json",
    "preview": "astro preview",
    "astro": "astro",
    "lint": "oxlint src/ --ignore-pattern '*.astro'",
    "check:references": "node scripts/check-post-references.mjs",
    "sync": "tsx scripts/sync-to-d1.ts",
    "sync:prod": "tsx scripts/sync-to-d1.ts --prod"
  },
  "dependencies": {
    "@astrojs/cloudflare": "^13.1.0",
    "@astrojs/mdx": "^5.0.0",
    "@astrojs/rss": "^4.0.17",
    "@astrojs/sitemap": "^3.7.1",
    "@playwright/test": "^1.58.2",
    "astro": "^6.0.3",
    "mdast-util-to-string": "^4.0.0",
    "playwright-extra": "^4.3.6",
    "puppeteer-extra-plugin-stealth": "^2.11.2",
    "typescript": "^5.9.3"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.7",
    "@fontsource/noto-sans-tc": "^5.2.9",
    "@resvg/resvg-js": "^2.6.2",
    "@types/node": "^25.4.0",
    "gray-matter": "^4.0.3",
    "oxlint": "^1.54.0",
    "pagefind": "^1.4.0",
    "satori": "^0.25.0",
    "tsx": "^4.21.0"
  }
}

 succeeded in 0ms:
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()),
    lang: z.enum(['zh-TW', 'en']).default('zh-TW'),
    description: z.string().optional(),
    tldr: z.string().optional(),
    draft: z.boolean().default(false),
    pinned: z.boolean().default(false),
    type: z.enum(['debug', 'deep-dive', 'guide', 'project']).optional(),
    readingTime: z.number().optional(),
    series: z.object({
      name: z.string(),
      order: z.number(),
    }).optional(),
  }),
});

export const collections = { posts };

exec
/bin/zsh -lc "test -f src/pages/404.astro && sed -n '1,220p' src/pages/404.astro || echo 'MISSING: src/pages/404.astro'" in /Users/xiaoxu/Projects/quidproquo
exec
/bin/zsh -lc "test -f src/pages/en/search.astro && sed -n '1,220p' src/pages/en/search.astro || echo 'MISSING: src/pages/en/search.astro'" in /Users/xiaoxu/Projects/quidproquo
exec
/bin/zsh -lc "sed -n '1,220p' src/pages/search.astro" in /Users/xiaoxu/Projects/quidproquo
exec
/bin/zsh -lc "sed -n '1,220p' src/lib/crawl/config.ts" in /Users/xiaoxu/Projects/quidproquo
 succeeded in 0ms:
---
// src/pages/search.astro
export const prerender = true;
import PostLayout from '../layouts/PostLayout.astro';
import { useTranslations } from '../i18n/utils';
const t = useTranslations('zh-TW');
---
<PostLayout title={t('nav.search')} lang="zh-TW">
  <Fragment slot="head">
    <link href="/pagefind/pagefind-ui.css" rel="stylesheet" />
  </Fragment>
  <h1>{t('nav.search')}</h1>
  <div id="search"></div>
</PostLayout>

<script src="/pagefind/pagefind-ui.js" is:inline></script>
<script is:inline>
  window.addEventListener('DOMContentLoaded', () => {
    new PagefindUI({ element: '#search', showImages: false });
  });
</script>

 succeeded in 0ms:
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

 succeeded in 0ms:
MISSING: src/pages/en/search.astro

 succeeded in 0ms:
MISSING: src/pages/404.astro

exec
/bin/zsh -lc 'rg -n "check-post-references|check:references|pre-commit|husky|simple-git-hooks|lint" package.json .github scripts -S' in /Users/xiaoxu/Projects/quidproquo
 succeeded in 0ms:
package.json:14:    "lint": "oxlint src/ --ignore-pattern '*.astro'",
package.json:15:    "check:references": "node scripts/check-post-references.mjs",
package.json:37:    "oxlint": "^1.54.0",
scripts/check-post-references.mjs:214:function lintPost(file) {
scripts/check-post-references.mjs:259:  const reports = files.map(lintPost).filter((report) => report.findings.length > 0);
.github/workflows/preview.yml:26:      - name: Lint
.github/workflows/preview.yml:27:        run: pnpm lint
.github/workflows/deploy.yml:24:      - name: Lint
.github/workflows/deploy.yml:25:        run: pnpm lint

codex
已確認幾個 TODO 項目其實不是「未開始」而是「已半完成但描述錯了」：例如 `pagefind`、RSS、sitemap 相關基礎已經在 repo 裡。這種項目如果不拆成「驗證/補缺」而是直接列為新建，執行時很容易重工。
exec
/bin/zsh -lc "sed -n '1,220p' astro.config.mjs" in /Users/xiaoxu/Projects/quidproquo
 succeeded in 0ms:
// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { remarkReadingTime } from './src/plugins/remarkReadingTime.ts';

export default defineConfig({
  site: 'https://quidproquo.cc',
  output: 'server',
  adapter: cloudflare({ platformProxy: { enabled: true }, remoteBindings: false }),
  integrations: [
    mdx(),
    sitemap(),
    {
      name: 'pagefind',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          const { execSync } = await import('child_process');
          execSync(`npx pagefind --site ${dir.pathname}`, { stdio: 'inherit' });
        },
      },
    },
  ],
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  i18n: {
    defaultLocale: 'zh-TW',
    locales: ['zh-TW', 'en'],
    routing: { prefixDefaultLocale: false },
  }
});

exec
/bin/zsh -lc "test -f progress.txt && sed -n '1,120p' progress.txt || echo 'MISSING: progress.txt'" in /Users/xiaoxu/Projects/quidproquo
exec
/bin/zsh -lc "sed -n '1,220p' .github/workflows/preview.yml" in /Users/xiaoxu/Projects/quidproquo
exec
/bin/zsh -lc "test -f CLAUDE.md && sed -n '1,220p' CLAUDE.md || echo 'MISSING: CLAUDE.md'" in /Users/xiaoxu/Projects/quidproquo
exec
/bin/zsh -lc "sed -n '1,220p' .github/workflows/deploy.yml" in /Users/xiaoxu/Projects/quidproquo
 succeeded in 0ms:
MISSING: progress.txt

 succeeded in 0ms:
name: Preview

on:
  pull_request:
    branches: [main]

jobs:
  preview:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: latest

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install

      - name: Lint
        run: pnpm lint

      - name: Build
        run: pnpm build
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}

      - name: Deploy preview
        id: deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          wranglerVersion: "4"
          command: deploy --config dist/server/wrangler.json --env preview

      - name: Comment preview URL
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🔍 Preview: ${{ steps.deploy.outputs.deployment-url }}`
            })

 succeeded in 0ms:
MISSING: CLAUDE.md

 succeeded in 0ms:
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: latest

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install

      - name: Lint
        run: pnpm lint

      - name: Build
        run: pnpm build
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}

      - name: Deploy to production
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          wranglerVersion: "4"
          command: deploy --config dist/server/wrangler.json

exec
/bin/zsh -lc 'rg -n "<author>|@astrojs/rss|sitemap|generate-og-images|og image|pagefind|readingTime|series" src scripts docs -S' in /Users/xiaoxu/Projects/quidproquo
 succeeded in 0ms:
scripts/generate-og-images.mjs:1:// scripts/generate-og-images.mjs
src/pages/categories/[category].astro:52:      readingTime={post.data.readingTime}
src/i18n/ui.ts:24:    'post.series': '系列',
src/i18n/ui.ts:43:    'post.series': 'Series',
docs/superpowers/specs/2026-03-12-blog-redesign-design.md:189:| **Search** | Pagefind (static search, zero server cost on Cloudflare Pages) — index at build time, UI via `@pagefind/default-ui` |
docs/superpowers/specs/2026-03-12-blog-redesign-design.md:192:| **Series** | New optional frontmatter field `series: { name, order }` — series nav box rendered when present (see §5.7) |
docs/superpowers/specs/2026-03-12-blog-redesign-design.md:197:| **RSS feed** | Astro `@astrojs/rss` package → `/rss.xml` |
docs/superpowers/specs/2026-03-12-blog-redesign-design.md:198:| **Sitemap** | `@astrojs/sitemap` integration → auto-generated `sitemap-index.xml` |
docs/superpowers/specs/2026-03-12-blog-redesign-design.md:203:Rendered only when the post has `series: { name: string, order: number }` in frontmatter.
docs/superpowers/specs/2026-03-12-blog-redesign-design.md:217:- Previous/next links within the series only (different from global prev/next in §5.5)
docs/superpowers/specs/2026-03-12-blog-redesign-design.md:218:- If first in series, no prev link; if last, no next link
docs/superpowers/specs/2026-03-12-blog-redesign-design.md:234:| `src/layouts/PostLayout.astro` | Add CSS tokens (light + dark), nav progress bar script, dark mode toggle (sun/moon icon + localStorage), OG meta tags, RSS/sitemap links |
docs/superpowers/specs/2026-03-12-blog-redesign-design.md:239:| `src/utils/readingTime.ts` | New utility: `getReadingTime(body: string): number` |
docs/superpowers/specs/2026-03-12-blog-redesign-design.md:241:| `astro.config.mjs` | Add `@astrojs/sitemap`, `@astrojs/rss`, Pagefind integration |
src/pages/en/categories/[category].astro:52:      readingTime={post.data.readingTime}
docs/superpowers/specs/2026-03-20-rag-design.md:767:| `R2_IMAGES` | R2 | Blog images + AI-generated diagrams |
src/pages/en/rss.xml.ts:4:import rss from '@astrojs/rss';
src/lib/crawl/browser-rendering.ts:63:    source: 'sitemaps',
src/content.config.ts:18:    readingTime: z.number().optional(),
src/content.config.ts:19:    series: z.object({
src/pages/en/index.astro:47:      readingTime={post.data.readingTime}
src/pages/search.astro:10:    <link href="/pagefind/pagefind-ui.css" rel="stylesheet" />
src/pages/search.astro:16:<script src="/pagefind/pagefind-ui.js" is:inline></script>
docs/TODO.md:19:| 缺 `series` 欄位 | 199 篇（88%） |
docs/TODO.md:70:  - [ ] Task 7：Related posts + series nav utilities
docs/TODO.md:145:- [ ] **RSS Feed 加 `<author>` 標籤**
docs/superpowers/plans/2026-03-12-crawler-integration.md:191:    source: 'sitemaps',
src/utils/seriesNav.ts:1:// src/utils/seriesNav.ts
src/utils/seriesNav.ts:15: * Returns series navigation data if the post belongs to a series.
src/utils/seriesNav.ts:16: * Returns undefined if post has no series frontmatter.
src/utils/seriesNav.ts:19:  if (!post.data.series) return undefined;
src/utils/seriesNav.ts:20:  const { name, order } = post.data.series;
src/utils/seriesNav.ts:21:  const seriesPosts = allPosts
src/utils/seriesNav.ts:22:    .filter(p => p.data.series?.name === name)
src/utils/seriesNav.ts:23:    .sort((a, b) => a.data.series!.order - b.data.series!.order);
src/utils/seriesNav.ts:24:  const total = seriesPosts.length;
src/utils/seriesNav.ts:25:  const prevPost = seriesPosts.find(p => p.data.series!.order === order - 1);
src/utils/seriesNav.ts:26:  const nextPost = seriesPosts.find(p => p.data.series!.order === order + 1);
src/plugins/remarkReadingTime.ts:10: * `readingTime` (number of minutes) into frontmatter data.
src/plugins/remarkReadingTime.ts:11: * Accessible as `post.data.readingTime` via Content Layer.
src/plugins/remarkReadingTime.ts:23:      readingTime: minutes,
src/pages/rss.xml.ts:4:import rss from '@astrojs/rss';
src/components/PostCard.astro:15:  readingTime?: number;
src/components/PostCard.astro:20:const { slug, title, date, category, tags, description, tldr, readingTime, lang = 'zh-TW', type, pinned } = Astro.props;
src/components/PostCard.astro:32:    {readingTime && (
src/components/PostCard.astro:35:        {readingTime} min
docs/superpowers/plans/2026-03-12-blog-redesign.md:7:**Architecture:** CSS design tokens defined in PostLayout's global style provide light/dark theming. Build-time utilities (reading time, related posts) are pure functions in `src/utils/`. All new article-page features are composed in `[...slug].astro` using data from Astro's `render()` API. Infrastructure features (RSS, sitemap, OG, search) are standalone Astro endpoints/integrations.
docs/superpowers/plans/2026-03-12-blog-redesign.md:9:**Tech Stack:** Astro 6.x, @astrojs/cloudflare (SSR hybrid), MDX, Pagefind, @astrojs/rss, @astrojs/sitemap, Satori + @resvg/resvg-js
docs/superpowers/plans/2026-03-12-blog-redesign.md:20:| `src/utils/readingTime.ts` | Create | `getReadingTime(body: string): number` — words / 200 |
docs/superpowers/plans/2026-03-12-blog-redesign.md:22:| `src/utils/seriesNav.ts` | Create | `getSeriesNav(post, allPosts)` — prev/next within same series |
docs/superpowers/plans/2026-03-12-blog-redesign.md:23:| `src/pages/posts/[...slug].astro` | Modify | Article header, TOC, TL;DR, code copy script, progress bar, prev/next, related, series nav |
docs/superpowers/plans/2026-03-12-blog-redesign.md:28:| `src/i18n/ui.ts` | Modify | Add TOC, reading time, related articles, series, dark mode strings |
docs/superpowers/plans/2026-03-12-blog-redesign.md:31:| `astro.config.mjs` | Modify | Add @astrojs/sitemap, Pagefind postbuild integration |
docs/superpowers/plans/2026-03-12-blog-redesign.md:32:| `src/content.config.ts` | Modify | Add optional `series` field to post schema |
docs/superpowers/plans/2026-03-12-blog-redesign.md:409:  readingTime?: number;
docs/superpowers/plans/2026-03-12-blog-redesign.md:412:const { slug, title, date, category, tags, description, tldr, readingTime, lang = 'zh-TW' } = Astro.props;
docs/superpowers/plans/2026-03-12-blog-redesign.md:422:    {readingTime && (
docs/superpowers/plans/2026-03-12-blog-redesign.md:425:        {readingTime} min
docs/superpowers/plans/2026-03-12-blog-redesign.md:507:**Context:** This project uses Astro 5's Content Layer API (`loader: glob()`). `post.body` is not available at runtime. The correct approach is a remark plugin that computes word count at parse time and injects `readingTime` into frontmatter data, making it available as `post.data.readingTime`.
docs/superpowers/plans/2026-03-12-blog-redesign.md:530: * `readingTime` (number of minutes) into frontmatter data.
docs/superpowers/plans/2026-03-12-blog-redesign.md:531: * Accessible as `post.data.readingTime` via Content Layer.
docs/superpowers/plans/2026-03-12-blog-redesign.md:543:      readingTime: minutes,
docs/superpowers/plans/2026-03-12-blog-redesign.md:549:- [ ] **Step 2: Add readingTime to content schema**
docs/superpowers/plans/2026-03-12-blog-redesign.md:551:In `src/content.config.ts`, add `readingTime` to the posts schema:
docs/superpowers/plans/2026-03-12-blog-redesign.md:569:    readingTime: z.number().optional(),
docs/superpowers/plans/2026-03-12-blog-redesign.md:570:    series: z.object({
docs/superpowers/plans/2026-03-12-blog-redesign.md:635:      readingTime={post.data.readingTime}
docs/superpowers/plans/2026-03-12-blog-redesign.md:653:In `src/pages/categories/[category].astro` and `src/pages/en/categories/[category].astro`, replace `readingTime={getReadingTime(post.body ?? '')}` with `readingTime={post.data.readingTime}` (no import needed).
docs/superpowers/plans/2026-03-12-blog-redesign.md:666:git commit -m "feat: reading time via remark plugin, injected into post.data.readingTime"
docs/superpowers/plans/2026-03-12-blog-redesign.md:702:    'post.series': '系列',
docs/superpowers/plans/2026-03-12-blog-redesign.md:721:    'post.series': 'Series',
docs/superpowers/plans/2026-03-12-blog-redesign.md:744:git commit -m "feat: i18n strings for nav, reading time, TOC, series, prev/next, related"
docs/superpowers/plans/2026-03-12-blog-redesign.md:752:### Task 7: Related posts and series nav utilities
docs/superpowers/plans/2026-03-12-blog-redesign.md:756:- Create: `src/utils/seriesNav.ts`
docs/superpowers/plans/2026-03-12-blog-redesign.md:787:- [ ] **Step 2: Create series nav utility**
docs/superpowers/plans/2026-03-12-blog-redesign.md:790:// src/utils/seriesNav.ts
docs/superpowers/plans/2026-03-12-blog-redesign.md:804: * Returns series navigation data if the post belongs to a series.
docs/superpowers/plans/2026-03-12-blog-redesign.md:805: * Returns undefined if post has no series frontmatter.
docs/superpowers/plans/2026-03-12-blog-redesign.md:808:  if (!post.data.series) return undefined;
docs/superpowers/plans/2026-03-12-blog-redesign.md:809:  const { name, order } = post.data.series;
docs/superpowers/plans/2026-03-12-blog-redesign.md:810:  const seriesPosts = allPosts
docs/superpowers/plans/2026-03-12-blog-redesign.md:811:    .filter(p => p.data.series?.name === name)
docs/superpowers/plans/2026-03-12-blog-redesign.md:812:    .sort((a, b) => a.data.series!.order - b.data.series!.order);
docs/superpowers/plans/2026-03-12-blog-redesign.md:813:  const total = seriesPosts.length;
docs/superpowers/plans/2026-03-12-blog-redesign.md:814:  const prevPost = seriesPosts.find(p => p.data.series!.order === order - 1);
docs/superpowers/plans/2026-03-12-blog-redesign.md:815:  const nextPost = seriesPosts.find(p => p.data.series!.order === order + 1);
docs/superpowers/plans/2026-03-12-blog-redesign.md:829:git add src/utils/relatedPosts.ts src/utils/seriesNav.ts
docs/superpowers/plans/2026-03-12-blog-redesign.md:830:git commit -m "feat: related posts and series nav utilities"
docs/superpowers/plans/2026-03-12-blog-redesign.md:851:import { getSeriesNav } from '../../utils/seriesNav';
docs/superpowers/plans/2026-03-12-blog-redesign.md:875:const seriesNav = getSeriesNav(post, allPosts);
docs/superpowers/plans/2026-03-12-blog-redesign.md:876:const readingTime = post.data.readingTime ?? 1;
docs/superpowers/plans/2026-03-12-blog-redesign.md:912:          {readingTime} {t('post.reading-time')}
docs/superpowers/plans/2026-03-12-blog-redesign.md:965:      {seriesNav && (
docs/superpowers/plans/2026-03-12-blog-redesign.md:966:        <div class="series-box">
docs/superpowers/plans/2026-03-12-blog-redesign.md:967:          <div class="series-header">
docs/superpowers/plans/2026-03-12-blog-redesign.md:969:            <span>{t('post.series')}: {seriesNav.name} ({seriesNav.current} / {seriesNav.total})</span>
docs/superpowers/plans/2026-03-12-blog-redesign.md:971:          <div class="series-nav">
docs/superpowers/plans/2026-03-12-blog-redesign.md:972:            {seriesNav.prev ? (
docs/superpowers/plans/2026-03-12-blog-redesign.md:973:              <a href={`/posts/${seriesNav.prev.slug}`} class="series-prev">
docs/superpowers/plans/2026-03-12-blog-redesign.md:975:                {seriesNav.prev.title}
docs/superpowers/plans/2026-03-12-blog-redesign.md:978:            {seriesNav.next && (
docs/superpowers/plans/2026-03-12-blog-redesign.md:979:              <a href={`/posts/${seriesNav.next.slug}`} class="series-next">
docs/superpowers/plans/2026-03-12-blog-redesign.md:980:                {seriesNav.next.title}
docs/superpowers/plans/2026-03-12-blog-redesign.md:1031:                {p.data.readingTime ?? 1} min
docs/superpowers/plans/2026-03-12-blog-redesign.md:1075:  .series-box { border: 1px solid var(--border); border-radius: 6px; padding: 0.85rem 1rem; background: var(--bg-subtle); margin-bottom: 1.5rem; }
docs/superpowers/plans/2026-03-12-blog-redesign.md:1076:  .series-header { display: flex; align-items: center; gap: 0.4rem; font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.5rem; }
docs/superpowers/plans/2026-03-12-blog-redesign.md:1077:  .series-nav { display: flex; justify-content: space-between; font-size: 0.8rem; }
docs/superpowers/plans/2026-03-12-blog-redesign.md:1078:  .series-prev, .series-next { display: flex; align-items: center; gap: 0.25rem; color: var(--brand-500); text-decoration: none; }
docs/superpowers/plans/2026-03-12-blog-redesign.md:1079:  .series-prev:hover, .series-next:hover { color: var(--brand-900); }
docs/superpowers/plans/2026-03-12-blog-redesign.md:1164:git add src/pages/posts/[...slug].astro src/utils/relatedPosts.ts src/utils/seriesNav.ts
docs/superpowers/plans/2026-03-12-blog-redesign.md:1165:git commit -m "feat: article page redesign — TOC, TL;DR, code copy, prev/next, related articles, series nav"
docs/superpowers/plans/2026-03-12-blog-redesign.md:1178:- [ ] **Step 1: Install @astrojs/rss**
docs/superpowers/plans/2026-03-12-blog-redesign.md:1181:npm install @astrojs/rss
docs/superpowers/plans/2026-03-12-blog-redesign.md:1190:import rss from '@astrojs/rss';
docs/superpowers/plans/2026-03-12-blog-redesign.md:1235:- [ ] **Step 1: Install @astrojs/sitemap**
docs/superpowers/plans/2026-03-12-blog-redesign.md:1238:npm install @astrojs/sitemap
docs/superpowers/plans/2026-03-12-blog-redesign.md:1241:- [ ] **Step 2: Add sitemap integration to existing astro.config.mjs**
docs/superpowers/plans/2026-03-12-blog-redesign.md:1245:1. Add import at top: `import sitemap from '@astrojs/sitemap';`
docs/superpowers/plans/2026-03-12-blog-redesign.md:1246:2. Add `sitemap()` to the `integrations` array alongside the existing `mdx()` entry
docs/superpowers/plans/2026-03-12-blog-redesign.md:1252:  sitemap(),
docs/superpowers/plans/2026-03-12-blog-redesign.md:1257:- [ ] **Step 3: Build and verify sitemap**
docs/superpowers/plans/2026-03-12-blog-redesign.md:1260:npm run build && ls dist/sitemap*.xml
docs/superpowers/plans/2026-03-12-blog-redesign.md:1262:Expected: `dist/sitemap-index.xml` and `dist/sitemap-0.xml`.
docs/superpowers/plans/2026-03-12-blog-redesign.md:1268:git commit -m "feat: sitemap via @astrojs/sitemap, add site URL to config"
docs/superpowers/plans/2026-03-12-blog-redesign.md:1439:npm install -D pagefind
docs/superpowers/plans/2026-03-12-blog-redesign.md:1447:  name: 'pagefind',
docs/superpowers/plans/2026-03-12-blog-redesign.md:1451:      execSync(`npx pagefind --site ${dir.pathname}`, { stdio: 'inherit' });
docs/superpowers/plans/2026-03-12-blog-redesign.md:1478:    <link href="/pagefind/pagefind-ui.css" rel="stylesheet" />
docs/superpowers/plans/2026-03-12-blog-redesign.md:1484:<script src="/pagefind/pagefind-ui.js" is:inline></script>
docs/superpowers/plans/2026-03-12-blog-redesign.md:1495:npm run build && ls dist/pagefind/
docs/superpowers/plans/2026-03-12-blog-redesign.md:1497:Expected: `pagefind.js`, `pagefind-ui.js`, `pagefind-ui.css`, and index files.
docs/superpowers/plans/2026-03-12-blog-redesign.md:1515:Expected: Build completes with no errors. Summary shows pages for `/`, `/search`, `/rss.xml`, `/sitemap-index.xml`, `/og/*.png`.
src/pages/index.astro:59:      readingTime={post.data.readingTime}
docs/blog-improvement-plan.md:27:| 缺 series 欄位 | 199 篇（88%） |
docs/blog-improvement-plan.md:78:- 將高度相關的文章群組化為正式 series（目前 88% 無 series 欄位）
docs/blog-improvement-plan.md:80:- RSS Feed 加入 `<author>` 標籤
docs/blog-improvement-plan.md:273:                   → 過濾同篇 + 同 series
docs/data.md:48:88% 文章沒有 series 欄位
docs/data.md:50:建議：將高度相關的文章群組化為正式 series
docs/data.md:55:/src/pages/rss.xml.ts 未包含 <author> 標籤
docs/data.md:70:缺 series 欄位 199 篇（88%）
docs/data.md:114:                   → 過濾同篇 + 同 series
docs/plan.md:365:  source: "sitemaps"
docs/plan.md:457:- [ ] RSS feed（`@astrojs/rss`）
src/pages/posts/[...slug].astro:9:import { getSeriesNav } from '../../utils/seriesNav';
src/pages/posts/[...slug].astro:33:const seriesNav = getSeriesNav(post, allPosts);
src/pages/posts/[...slug].astro:34:const readingTime = post.data.readingTime ?? 1;
src/pages/posts/[...slug].astro:116:          {readingTime} {t('post.reading-time')}
src/pages/posts/[...slug].astro:196:    {seriesNav && (
src/pages/posts/[...slug].astro:197:      <div class="series-box">
src/pages/posts/[...slug].astro:198:        <div class="series-header">
src/pages/posts/[...slug].astro:200:          <span>{t('post.series')}: {seriesNav.name} ({seriesNav.current} / {seriesNav.total})</span>
src/pages/posts/[...slug].astro:202:        <div class="series-nav">
src/pages/posts/[...slug].astro:203:          {seriesNav.prev ? (
src/pages/posts/[...slug].astro:204:            <a href={`/posts/${seriesNav.prev.slug}`} class="series-prev">
src/pages/posts/[...slug].astro:206:              {seriesNav.prev.title}
src/pages/posts/[...slug].astro:209:          {seriesNav.next && (
src/pages/posts/[...slug].astro:210:            <a href={`/posts/${seriesNav.next.slug}`} class="series-next">
src/pages/posts/[...slug].astro:211:              {seriesNav.next.title}
src/pages/posts/[...slug].astro:261:                {p.data.readingTime ?? 1} min
src/pages/posts/[...slug].astro:374:  .series-box { border: 1px solid var(--border); border-radius: 8px; padding: 0.85rem 1rem; background: var(--bg-subtle); margin-bottom: 1.5rem; }
src/pages/posts/[...slug].astro:375:  .series-header { display: flex; align-items: center; gap: 0.4rem; font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.5rem; }
src/pages/posts/[...slug].astro:376:  .series-nav { display: flex; justify-content: space-between; font-size: 0.8rem; }
src/pages/posts/[...slug].astro:377:  .series-prev, .series-next { display: flex; align-items: center; gap: 0.25rem; color: var(--brand-500); text-decoration: none; }
src/pages/posts/[...slug].astro:378:  .series-prev:hover, .series-next:hover { color: var(--brand-900); }
src/content/posts/marketing/2026-04-21-aeo-geo-tracking-tools-landscape.md:30:- **Discoverability**：robots.txt、sitemap、llms.txt
src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:25:- **缺欄位**：213 篇缺 `type`（94%）、199 篇缺 `series`（88%）、7 篇缺 `tldr`
src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:226:- 補 `<author>` 標籤
src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:230:- 88% 文章沒有 `series` 欄位
src/content/posts/tech/guide/2026-03-12-astro-blog-template-guide.md:35:這個模板的取捨是：功能精準，但不多。深色模式、模糊搜尋（Fuse.js）、RSS、sitemap，夠用了。
src/content/posts/tech/guide/2026-03-12-astro-blog-template-guide.md:43:內建 [Pagefind](https://pagefind.app/) 全文檢索，比 Fuse.js 快得多，適合文章累積到一定量之後。
src/content/posts/tech/guide/2026-03-12-astro-blog-template-guide.md:121:- [Pagefind 全文檢索](https://pagefind.app/)
src/content/posts/ai/2026-03-31-mobile-small-models.md:189:- [Qwen 3.5 Small Model Series（阿里巴巴）](https://medium.com/data-science-in-your-pocket/qwen-3-5-small-model-series-released-7a5ed34fcbb3)
src/content/posts/tech/debug/2026-03-13-astro-cloudflare-native-module.md:80:// scripts/generate-og-images.mjs
src/content/posts/tech/debug/2026-03-13-astro-cloudflare-native-module.md:92:"build": "astro build && node scripts/generate-og-images.mjs"
src/content/posts/ai/2026-04-03-llm-knowledge-vault.md:139:- [ZenBrain — 7-Layer Memory Architecture](https://www.tdcommons.org/dpubs_series/9683/)
src/content/posts/tech/2026-03-27-claude-code-global-skills-not-found.md:10:series:
src/content/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management.md:10:series:
src/content/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing.md:10:series:
src/content/posts/tech/2026-03-27-blog-seo-optimization-guide.md:86:// scripts/generate-og-images.mjs
src/content/posts/tech/2026-03-27-blog-seo-optimization-guide.md:227:Sitemap: https://quidproquo.cc/sitemap-index.xml
src/content/posts/tech/2026-03-27-blog-seo-optimization-guide.md:234:Astro 的 `@astrojs/sitemap` 整合會自動產生 sitemap。確保在 `astro.config.mjs` 中設定 `site`：
src/content/posts/tech/2026-03-27-blog-seo-optimization-guide.md:239:  integrations: [sitemap()],
src/content/posts/tech/2026-03-27-blog-seo-optimization-guide.md:255:- [ ] `robots.txt` 存在且指向 sitemap
src/content/posts/tech/2026-03-27-blog-seo-optimization-guide.md:273:- [Astro Sitemap Integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
src/content/posts/tech/deep-dive/2026-03-27-remote-agent-auto-dev-pipeline.md:10:series:
src/content/posts/tech/2026-03-16-claude-code-dangerously-skip-permissions.md:10:series:
src/content/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution.md:10:series:
src/content/posts/tech/deep-dive/2026-03-27-file-bug-issue-skill-remote-agent.md:10:series:
src/content/posts/tech/deep-dive/2026-03-28-claude-code-headless-mode-guide.md:10:series:
src/content/posts/tech/deep-dive/2026-03-27-claude-code-scheduled-tasks-guide.md:10:series:
src/content/posts/tech/deep-dive/2026-03-28-claude-code-channels-guide.md:10:series:
src/content/posts/tech/deep-dive/2026-03-28-claude-code-slack-integration.md:10:series:
src/content/posts/tech/deep-dive/2026-03-28-claude-code-chrome-integration.md:10:series:
src/content/posts/tech/deep-dive/2026-03-27-claude-code-skill-design-guide.md:10:series:
src/content/posts/tech/deep-dive/2026-03-28-claude-code-ci-cd-github-actions.md:10:series:
src/content/posts/tech/deep-dive/2026-03-28-claude-code-mcp-server-integration.md:10:series:
src/content/posts/ai/2026-03-30-ai-ready-content.md:198:sitemap.xml      → 列出所有頁面
src/content/posts/ai/2026-03-30-ai-ready-content.md:233:| **特色** | Map endpoint 可秒生成 sitemap | Adaptive crawling 省 ~40% 爬取時間 | `r.jina.ai/URL` 即用 |
src/content/posts/ai/2026-03-30-ai-ready-content.md:387:□ sitemap.xml 保持更新
src/content/posts/tech/deep-dive/2026-03-28-claude-code-plugins-marketplaces-guide.md:10:series:
src/content/posts/tech/deep-dive/2026-03-27-claude-code-hooks-guide.md:10:series:
src/content/posts/tech/2026-03-30-claude-code-spinner-verbs.md:10:series:
src/content/posts/tech/deep-dive/2026-03-28-claude-code-remote-control-guide.md:10:series:
src/content/posts/tech/deep-dive/2026-03-28-claude-code-settings-json-guide.md:10:series:
src/content/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md.md:10:series:
src/content/posts/tech/deep-dive/2026-03-28-claude-code-claude-md-agents-md-guide.md:10:series:
src/content/posts/tech/deep-dive/2026-03-27-ai-driven-dev-workflow-openspec-to-deploy.md:10:series:
src/content/posts/tech/deep-dive/2026-03-28-claude-code-best-practices-workflows.md:10:series:
src/content/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide.md:10:series:
src/content/posts/tech/deep-dive/2026-03-28-claude-code-checkpointing-guide.md:10:series:
src/content/posts/tech/2026-03-28-claude-code-troubleshooting-collection.md:10:series:
src/content/posts/tech/2026-03-16-claude-code-loop-scheduling.md:10:series:

codex
我也確認了 blog redesign 與搜尋基礎很多已經落地：`readingTime`、`seriesNav`、`pagefind`、RSS、sitemap 都已存在。TODO 現在最大的問題不是「做太少」，而是把「補完現有能力」和「新功能建設」混在一起，優先順序會失真。
exec
/bin/zsh -lc "sed -n '1,220p' src/pages/en/rss.xml.ts" in /Users/xiaoxu/Projects/quidproquo
exec
/bin/zsh -lc "sed -n '1,220p' src/pages/rss.xml.ts" in /Users/xiaoxu/Projects/quidproquo
exec
/bin/zsh -lc "sed -n '1,260p' docs/TODO.md" in /Users/xiaoxu/Projects/quidproquo
 succeeded in 0ms:
// src/pages/en/rss.xml.ts
export const prerender = true;

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts', ({ data }) =>
    !data.draft && data.lang === 'en'
  );
  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return rss({
    title: 'quidproquo',
    description: 'Tech, climbing, surfing, coffee, and everything else.',
    site: context.site ?? 'https://quidproquo.cc',
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.tldr ?? post.data.description,
      link: `/posts/${post.id}/`,
    })),
    customData: '<language>en</language>',
  });
}

 succeeded in 0ms:
// src/pages/rss.xml.ts
export const prerender = true;

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts', ({ data }) =>
    !data.draft && data.lang === 'zh-TW'
  );
  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return rss({
    title: 'quidproquo',
    description: '技術、攀岩、衝浪、咖啡，以及其他一切。',
    site: context.site ?? 'https://quidproquo.cc',
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.tldr ?? post.data.description,
      link: `/posts/${post.id}/`,
    })),
    customData: '<language>zh-TW</language>',
  });
}

 succeeded in 0ms:
# quidproquo 任務總清單

> 整合來源：`docs/plan.md`、`docs/superpowers/plans/`、`src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md`
> 最後更新：2026-04-19
>
> **設計鐵律：每個加上去的技術都必須能關掉。**
> 所有進階技術（HyDE、Multi-query、Reranker、Critic...）都必須有 feature flag、有 A/B 比較機制、只為觀測到的失敗而加。

---

## 現況快照

| 指標 | 數值 |
|------|------|
| 總文章數 | 227 篇 |
| 斷連結數 | 49 個（影響約 40 篇文章） |
| 草稿數 | 17 篇 |
| 缺 `type` 欄位 | 213 篇（94%） |
| 缺 `series` 欄位 | 199 篇（88%） |
| 缺 `tldr` | 7 篇 |
| Tag 不一致 | `ai-agent` vs `ai-agents`（35 篇） |

---

## P0 立即執行（低成本、高影響）

### 內容修正

- [x] **修復 49 個內部斷連結**
  - 重災區：`ai/2026-04-01-agent-cli-guidelines.md` 有 10 個斷連結
  - 處理方式：暫時改為 plain text 標註「即將推出」
- [ ] **統一 tag 命名** — `ai-agent`（21 篇）+ `ai-agents`（14 篇）→ 統一為 `ai-agent`

### 爬蟲 Chunker 參數修正

- [ ] **`MAX_CHUNK_CHARS` 降為 1500**（`src/lib/crawl/config.ts:43`；中文 2000 chars ≈ 800–1000 tokens，超出建議範圍；`chunking-strategies.md` 建議上限）

### Harness 基礎建設

- [ ] **建立根目錄 `CLAUDE.md`**（技術棧、目錄結構、開發流程、命名規範、決策理由）
- [ ] **Pre-commit hook（lint + reference check）** — 用 husky 或 simple-git-hooks；「Linter 是法律，prompt 是建議」
- [ ] **`check-post-references.mjs` 加入 CI**（script 已存在但沒跑，導致 49 個斷連結直接上線）

### 網站技術

- [ ] **建立 404 錯誤頁面** — `/src/pages/404.astro`，含搜尋框 + 熱門文章推薦

---

## P1 短期（1–2 週）

### 內容補強

- [ ] **補上 213 篇缺失的 `type` 欄位**（批次腳本或 LLM 自動分類，人工 review）
- [ ] **補上 7 篇缺失的 `tldr`**（Claude 批量生成，人工 review）

### 網站技術

- [ ] **英文版搜尋頁** — `/src/pages/search.astro` 硬編碼 `lang="zh-TW"`，需建立 `/src/pages/en/search.astro`
- [ ] **英文首頁加上 about 區塊**（英文讀者看不懂「Quid Pro Quo」是什麼）
- [ ] **字型載入優化（影響 LCP）** — `<link rel="preload" as="font">` + `font-display: swap`
- [ ] **圖片尺寸 + lazy loading（影響 CLS）** — 啟用 `astro:assets`，markdown 圖片補 `loading="lazy"` 與 width/height
- [ ] **無障礙基本款** — Skip Navigation 連結、`:focus-visible` 鍵盤樣式、驗證 `--text-muted: #999` 對比度
- [ ] **Blog 前端改版**（詳細步驟：`docs/superpowers/plans/2026-03-12-blog-redesign.md`）
  - [ ] Task 1：Icons component + CSS design tokens + PostLayout 更新
  - [ ] Task 2：Nav 改版
  - [ ] Task 3：PostCard 改版
  - [ ] Task 4：Reading time remark plugin + schema 欄位
  - [ ] Task 5：i18n strings 更新
  - [ ] Task 7：Related posts + series nav utilities
  - [ ] Task 8：Article page 改版
  - [ ] Task 10：RSS Feed
  - [ ] Task 11：Sitemap
  - [ ] Task 12：OG Image 自動產生
  - [ ] Task 13：Pagefind 靜態搜尋
  - [ ] Task 14：Final build 驗證

### Harness 基礎建設

- [ ] **Frontmatter `type` 改為 required**（更新 `src/content.config.ts` schema；用 schema 強制，不靠 prompt 請求）
- [ ] **建立 `progress.txt` 機制**（最低成本的 episodic memory，不需要 vector DB）
- [ ] **Session-start hook** — 自動跑 `pnpm lint` + 讀 `progress.txt`
- [ ] **Post skill 加入 Evaluator 節點**（檢查：frontmatter 完整性、內部連結有效性、tag 一致性、標題結構）
- [ ] **工具描述品質規範** — `search_blog_posts` / `search_abstract_index` / `search_docs` 使用時機區分明確化，每個工具加上何時使用 / 何時不使用 / 預期回傳格式

### RAG 設計修正

- [ ] **Deterministic Validation Node（Stripe Blueprint 模式）** — 在 Writer → Critic 之間插入確定性驗證（Markdown 語法、source URL、Mermaid 語法）
- [ ] **Critic 失敗降級策略** — 重試 2 次仍低於門檻 → 標註「⚠️ 此回答可能不完整」，停止呼叫 LLM
- [ ] **Prompt 改用「描述終態」風格**（描述「成功的回答長什麼樣」而非「按步驟做」）

---

## P2 中期（1–2 個月）

### AI Agent 應用實作

> 詳細實作步驟：`docs/superpowers/plans/2026-03-21-rag-phase1.md`

- [ ] **Task 1：安裝依賴 + 環境設定**（React、vitest、Vectorize、Workers AI bindings）
- [ ] **Task 2：D1 Migration**（`post_chunks`、`doc_chunks` 表）
- [ ] **Task 3：Chunk ID + Contextual Retrieval（TDD）**
- [ ] **Task 4：Embedding Pipeline + Hybrid Search** — 197 篇文章 embed 進 Vectorize；實作 Vectorize 語意 + D1 FTS5 BM25 + RRF 融合
- [ ] **Task 5：Auth — Session + Rate Limit（TDD）**（訪客 IP 限額 5 次/日）
- [ ] **Task 6：Login Page**
- [ ] **Task 7：Langfuse Helper**
- [ ] **Task 8：LangGraph State Definition**
- [ ] **Task 9：Research Tools（TDD）** — `search-posts.ts`、`search-docs.ts`、`get-post-detail.ts`
- [ ] **Task 10：`normalize_results` Node（TDD）**
- [ ] **Task 11：Planner、Writer、Critic、Related Posts agents**
- [ ] **Task 12：Graph Builder**
- [ ] **Task 13：Chat SSE API Endpoint**
- [ ] **Task 14：Chat UI**（`AgentSteps`、`QuotaIndicator`、`MessageInput`、`MessageList`、`ChatWidget`、`chat.astro`）
- [ ] **Task 15：Run Embed Pipeline + Smoke Test**
- [ ] **AI 驅動相關文章推薦**（取代純 tag 匹配：40% tag + 30% 分類 + 20% 時近性 + 10% 同系列）
- [ ] **自動 TL;DR 與 description 生成**
- [ ] **自動 tag 建議** — 新文章發布時，根據內容 embedding 推薦應加的 tag
- [ ] **難度分級** — 自動標記文章為「入門 / 進階 / 深度」，寫入 frontmatter
- [ ] **重複主題偵測** — 找出語意相似度高的文章對，提示合併或區隔
- [ ] **文章新鮮度偵測** — 比對爬蟲資料，標記引用了過時 API / 已淘汰工具的文章
- [ ] **互動詞彙表** — hover 技術名詞時 AI 即時解釋，不離開頁面
- [ ] **內容缺口分析** — 分析站內搜尋紀錄，找出讀者在搜但你還沒寫的主題
- [ ] **SEO 優化 agent** — 建議更好的標題、description、內部連結機會

### RAG 設計補強

- [ ] **Semantic Cache threshold 設為 `0.95`**（實作時即設定；`semantic-caching.md` 指出 0.90–0.94 是「相關但不同」的危險區間）
- [ ] **Reranker 加入 `min_keep: 3`**（實作時即設定；`cross-encoder-reranking.md` 明確建議的安全網）
- [ ] **MMR 多樣性重排**（λ = 0.7，在 reranker 後、Writer 前插入）
- [ ] **Adaptive RAG queryType 路由**（`complexity: simple | medium | complex`，simple 跳過 HyDE/Multi-query）
- [ ] **CRAG filter 放寬策略**（零結果時漸進放寬次要 filter → 仍低分 → web search fallback）
- [ ] **Critic 加 answer-relevance 檢查**（不只 grounding，也檢查真的回答了問題）
- [ ] **Critic 加 drift 偵測**（檢查 Research 過程是否偏離原始查詢意圖）

### Harness 基礎建設

- [ ] **Ollama 本地模型整合** — 批次任務（自動 tag、難度分級、TL;DR 生成）改用本地模型，API 成本歸零；研究筆記：`docs/research/ollama-research.md`
- [ ] **設計決策 ADR**（為什麼用 BGE-large？為什麼 chunk 2000？為什麼 cache 0.95？）
- [ ] **RAG pipeline feature flag**（HyDE、Multi-query、Reranker、Critic 各自可開關）
- [ ] **Shadow Mode A/B 比較機制**（開啟 vs 關閉，比較 RAGAS 分數）
- [ ] **Context Checkpoint 系統**（動態壓縮門檻：`threshold = model_context_window * 0.7`，非硬編碼 8000 tokens）

### 網站技術

- [ ] **RSS Feed 加 `<author>` 標籤**
- [ ] **Series 系列化**（RAG 系列、Claude Code 系列、AI Agent 系列正式組織）
- [ ] **排程發布** — 87% 文章集中 2026 年 3 月，設定 `date` 未來日期搭配 CI 定時發布，維持穩定節奏
- [ ] **多語言翻譯 Pipeline（Multi-Agent）** — Translator → Cultural Reviewer → Native Checker

### 爬蟲整合

> 詳細設計：`docs/plan.md` Phase 3、`docs/superpowers/plans/2026-03-12-crawler-integration.md`

- [ ] **實作 `/api/crawl/sync` endpoint**
- [ ] **設定要爬取的技術文件站清單**
- [ ] **實作 Markdown → chunking pipeline**
- [ ] **設定 Cron Trigger 定期爬取**
- [ ] **增量更新機制（modifiedSince）**

---

## P3 長期（3 個月以上）

### AI 進階功能

- [ ] **站長端 episodic memory**（記住寫作偏好、常用範本；參考 Hermes Agent 的 user profile dialectic）
- [ ] **Judge sampling 30%**（簡單查詢跳過 Critic，預期省 20-30% 成本）
- [ ] **BM25 短路邏輯**（BM25 回傳 ≥ 5 結果時跳過向量搜尋）
- [ ] **RAGAS 評估 pipeline + Golden Dataset**（20-25 個測試案例，涵蓋精確查詢、概念解釋、跨文章綜合、不在知識庫、中英混雜五類）
- [ ] **GraphRAG**（從文章中抽取實體與關係，適合跨文章查詢）
- [ ] **自訂文件上傳功能**（PDF / Markdown / URL 三種來源）
- [ ] **學習路徑生成** — 給定目標（如「我想學 RAG」），自動規劃文章閱讀順序
- [ ] **知識地圖** — 視覺化文章之間的概念關係圖

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

exec
/bin/zsh -lc "rg -n \"search_blog_posts|search_docs|search_abstract_index|normalize_results|Langfuse|VECTORIZE_INDEX|post_chunks|doc_chunks|MemorySaver|chat\\.astro|/api/chat|/api/crawl/sync|crawl/sync\" src docs scripts wrangler* -S" in /Users/xiaoxu/Projects/quidproquo
 succeeded in 0ms:
wrangler.jsonc:27:    "binding": "VECTORIZE_INDEX",
docs/superpowers/specs/2026-03-20-rag-design.md:6:**Stack:** LangGraph.js (`@langchain/langgraph ^0.2`) + Cloudflare Workers (nodejs_compat) + Langfuse Cloud
docs/superpowers/specs/2026-03-20-rag-design.md:45:- Programmatic hook on every `/api/chat` request, before agent invocation
docs/superpowers/specs/2026-03-20-rag-design.md:55:| Blog posts (Markdown) | `posts` → `post_chunks` | `type: 'post'` |
docs/superpowers/specs/2026-03-20-rag-design.md:56:| External crawled docs | `doc_chunks` | `type: 'doc'` |
docs/superpowers/specs/2026-03-20-rag-design.md:96:6. Cache description in `post_chunks.image_description` (D1) — Vision model not re-called on re-embed
docs/superpowers/specs/2026-03-20-rag-design.md:162:2. For doc_chunks: use the first 500 chars of the first chunk per `source_url`.
docs/superpowers/specs/2026-03-20-rag-design.md:166:**Usage at query time:** Research first searches `VECTORIZE_ABSTRACT` → if relevant hits found, fetch full chunks from `VECTORIZE_INDEX` by those `chunk_id`s.
docs/superpowers/specs/2026-03-20-rag-design.md:215:- `search_blog_posts(query, filters?)` — Vectorize, type=post, optional metadata filters (category, lang, date_range)
docs/superpowers/specs/2026-03-20-rag-design.md:216:- `search_docs(query, filters?)` — Vectorize, type=doc|custom
docs/superpowers/specs/2026-03-20-rag-design.md:217:- `search_abstract_index(query)` — summary-level search first
docs/superpowers/specs/2026-03-20-rag-design.md:232:Implemented as a dedicated LangGraph node (`normalize_results`) placed between Research and the specialist nodes — not a LangChain callback. Wired as: `graph.addEdge('research', 'normalize_results')`.
docs/superpowers/specs/2026-03-20-rag-design.md:292:// Phase 1 graph (no abstract_search, MemorySaver)
docs/superpowers/specs/2026-03-20-rag-design.md:296:graph.addEdge('research', 'normalize_results')
docs/superpowers/specs/2026-03-20-rag-design.md:302:const graph = builder.compile({ checkpointer: new MemorySaver() })
docs/superpowers/specs/2026-03-20-rag-design.md:308:graph.addEdge(['research', 'abstract_search'], 'normalize_results') // fan-in join
docs/superpowers/specs/2026-03-20-rag-design.md:375:  needs_web_search: boolean  // set by normalize_results when max relevance < 0.4
docs/superpowers/specs/2026-03-20-rag-design.md:419:**Phase 1 note:** Phase 1 uses `MemorySaver` (in-memory, single-turn only). D1 checkpointer and `thread_id`-based multi-turn conversation moves to Phase 2. Phase 1 `thread_id` in request body is accepted but not persisted.
docs/superpowers/specs/2026-03-20-rag-design.md:472:**Endpoint:** `POST /api/chat`
docs/superpowers/specs/2026-03-20-rag-design.md:530:- 👍👎 feedback: stored in D1 `feedback` table, linked to Langfuse trace
docs/superpowers/specs/2026-03-20-rag-design.md:564:- Langfuse trace link per conversation
docs/superpowers/specs/2026-03-20-rag-design.md:589:## 12. Langfuse Integration
docs/superpowers/specs/2026-03-20-rag-design.md:591:**Traces per `/api/chat` call:**
docs/superpowers/specs/2026-03-20-rag-design.md:597:│   ├── tool_call: search_blog_posts
docs/superpowers/specs/2026-03-20-rag-design.md:598:│   ├── tool_call: search_docs
docs/superpowers/specs/2026-03-20-rag-design.md:630:ALTER TABLE post_chunks ADD COLUMN image_description TEXT;
docs/superpowers/specs/2026-03-20-rag-design.md:631:ALTER TABLE post_chunks ADD COLUMN sentence_window TEXT;
docs/superpowers/specs/2026-03-20-rag-design.md:632:ALTER TABLE doc_chunks ADD COLUMN image_description TEXT;
docs/superpowers/specs/2026-03-20-rag-design.md:633:ALTER TABLE doc_chunks ADD COLUMN sentence_window TEXT;
docs/superpowers/specs/2026-03-20-rag-design.md:634:-- Note: post_chunks.id and doc_chunks.id must equal the sha256 chunk_id (see Section 4.5).
docs/superpowers/specs/2026-03-20-rag-design.md:638:-- chunk_id = sha256 hash (same as post_chunks.id / doc_chunks.id — verified above)
docs/superpowers/specs/2026-03-20-rag-design.md:646:-- post_chunks.id IS the sha256 chunk_id
docs/superpowers/specs/2026-03-20-rag-design.md:648:  SELECT content, id, 'post' FROM post_chunks;
docs/superpowers/specs/2026-03-20-rag-design.md:650:  SELECT content, id, 'doc' FROM doc_chunks;
docs/superpowers/specs/2026-03-20-rag-design.md:761:| `VECTORIZE_INDEX` | Vectorize | Main knowledge index |
docs/superpowers/specs/2026-03-20-rag-design.md:777:- Embedding pipeline (posts + doc_chunks, with contextual retrieval)
docs/superpowers/specs/2026-03-20-rag-design.md:779:- `/api/chat` SSE endpoint
docs/superpowers/specs/2026-03-20-rag-design.md:782:- Langfuse integration
docs/superpowers/specs/2026-03-20-rag-design.md:834:│   │   │   └── normalize-results.ts  # dedicated graph node (normalize_results)
docs/superpowers/specs/2026-03-20-rag-design.md:856:│   ├── chat.astro
scripts/create-cron-entry.mjs:35:      fetch('https://quidproquo.cc/api/crawl/sync', {
docs/superpowers/plans/2026-03-21-rag-phase1.md:5:**Goal:** Build a working end-to-end RAG chat system on quidproquo — embed blog posts + crawled docs into Vectorize, expose a streaming chat API backed by a basic LangGraph agent (Planner→Research→normalize_results→Writer→Critic→Related Posts), add session auth, and wire up a minimal `/chat` page.
docs/superpowers/plans/2026-03-21-rag-phase1.md:7:**Architecture:** Astro SSR + Cloudflare Workers (nodejs_compat). LangGraph.js graph compiled with `MemorySaver` (single-turn in Phase 1). All Cloudflare bindings accessed via `env` from `cloudflare:workers`. React island for chat UI.
docs/superpowers/plans/2026-03-21-rag-phase1.md:21:| `migrations/0002_rag_phase1.sql` | ALTER TABLE post_chunks/doc_chunks, FTS5, chat_logs, feedback, settings |
docs/superpowers/plans/2026-03-21-rag-phase1.md:24:| `src/lib/langfuse.ts` | Thin Langfuse HTTP trace/span helper |
docs/superpowers/plans/2026-03-21-rag-phase1.md:28:| `src/lib/rag/tools/search-posts.ts` | `search_blog_posts` tool — Vectorize query, type=post |
docs/superpowers/plans/2026-03-21-rag-phase1.md:29:| `src/lib/rag/tools/search-docs.ts` | `search_docs` tool — Vectorize query, type=doc\|custom |
docs/superpowers/plans/2026-03-21-rag-phase1.md:37:| `src/lib/rag/graph.ts` | Compile Phase 1 graph with MemorySaver |
docs/superpowers/plans/2026-03-21-rag-phase1.md:38:| `src/pages/api/chat.ts` | POST SSE endpoint — auth middleware + graph stream |
docs/superpowers/plans/2026-03-21-rag-phase1.md:41:| `src/pages/chat.astro` | Chat page — mounts ChatWidget React island |
docs/superpowers/plans/2026-03-21-rag-phase1.md:53:| `wrangler.jsonc` | Add `SESSION` KV, `RATE` KV, `VECTORIZE_INDEX` (main embeddings), `VECTORIZE_CACHE` (semantic cache, Phase 2 active), `ANTHROPIC_API_KEY` in secrets comment |
docs/superpowers/plans/2026-03-21-rag-phase1.md:133:{ "binding": "VECTORIZE_INDEX", "index_name": "quidproquo-embeddings" },
docs/superpowers/plans/2026-03-21-rag-phase1.md:172:git commit -m "chore(setup): add LangGraph, React, Langfuse deps and CF bindings"
docs/superpowers/plans/2026-03-21-rag-phase1.md:189:ALTER TABLE post_chunks ADD COLUMN image_description TEXT;
docs/superpowers/plans/2026-03-21-rag-phase1.md:190:ALTER TABLE post_chunks ADD COLUMN sentence_window TEXT;
docs/superpowers/plans/2026-03-21-rag-phase1.md:191:ALTER TABLE doc_chunks ADD COLUMN image_description TEXT;
docs/superpowers/plans/2026-03-21-rag-phase1.md:192:ALTER TABLE doc_chunks ADD COLUMN sentence_window TEXT;
docs/superpowers/plans/2026-03-21-rag-phase1.md:195:-- post_chunks.id = sha256 chunk_id (source of truth for Vectorize join)
docs/superpowers/plans/2026-03-21-rag-phase1.md:204:  SELECT content, id, 'post' FROM post_chunks;
docs/superpowers/plans/2026-03-21-rag-phase1.md:206:  SELECT content, id, 'doc' FROM doc_chunks;
docs/superpowers/plans/2026-03-21-rag-phase1.md:471:  VECTORIZE_INDEX: VectorizeIndex
docs/superpowers/plans/2026-03-21-rag-phase1.md:497:  const { DB, VECTORIZE_INDEX } = getEnv()
docs/superpowers/plans/2026-03-21-rag-phase1.md:501:    'SELECT p.id, p.slug, p.title, p.category, p.lang, p.created_at, pc.id as chunk_id, pc.content, pc.chunk_index FROM post_chunks pc JOIN posts p ON p.id = pc.post_id'
docs/superpowers/plans/2026-03-21-rag-phase1.md:545:    await VECTORIZE_INDEX.deleteByIds(ids).catch(() => {}) // ignore if not exist
docs/superpowers/plans/2026-03-21-rag-phase1.md:546:    await VECTORIZE_INDEX.upsert(batch)
docs/superpowers/plans/2026-03-21-rag-phase1.md:553:  const { DB, VECTORIZE_INDEX } = getEnv()
docs/superpowers/plans/2026-03-21-rag-phase1.md:557:    'SELECT id, source_url, source_name, chunk_index, content FROM doc_chunks'
docs/superpowers/plans/2026-03-21-rag-phase1.md:595:    await VECTORIZE_INDEX.deleteByIds(ids).catch(() => {})
docs/superpowers/plans/2026-03-21-rag-phase1.md:596:    await VECTORIZE_INDEX.upsert(batch)
docs/superpowers/plans/2026-03-21-rag-phase1.md:962:## Task 7: Langfuse Helper
docs/superpowers/plans/2026-03-21-rag-phase1.md:967:No unit tests — Langfuse is a side-effect (HTTP call). Verified by checking Langfuse dashboard.
docs/superpowers/plans/2026-03-21-rag-phase1.md:975:interface LangfuseEnv {
docs/superpowers/plans/2026-03-21-rag-phase1.md:982:  const e = env as unknown as LangfuseEnv
docs/superpowers/plans/2026-03-21-rag-phase1.md:1178:interface Env { VECTORIZE_INDEX: VectorizeIndex; AI: Ai }
docs/superpowers/plans/2026-03-21-rag-phase1.md:1186:    const { VECTORIZE_INDEX, AI } = env as unknown as Env
docs/superpowers/plans/2026-03-21-rag-phase1.md:1195:    const results = await VECTORIZE_INDEX.query(queryVector, {
docs/superpowers/plans/2026-03-21-rag-phase1.md:1220:    name: 'search_blog_posts',
docs/superpowers/plans/2026-03-21-rag-phase1.md:1241:interface Env { VECTORIZE_INDEX: VectorizeIndex; AI: Ai }
docs/superpowers/plans/2026-03-21-rag-phase1.md:1249:    const { VECTORIZE_INDEX, AI } = env as unknown as Env
docs/superpowers/plans/2026-03-21-rag-phase1.md:1257:    const results = await VECTORIZE_INDEX.query(queryVector, {
docs/superpowers/plans/2026-03-21-rag-phase1.md:1280:    name: 'search_docs',
docs/superpowers/plans/2026-03-21-rag-phase1.md:1325:git commit -m "feat(rag): search_blog_posts, search_docs, get_post_detail tools"
docs/superpowers/plans/2026-03-21-rag-phase1.md:1330:## Task 10: normalize_results Node (TDD)
docs/superpowers/plans/2026-03-21-rag-phase1.md:1434:git commit -m "feat(rag): normalize_results node with metadata parsing and relevance ordering"
docs/superpowers/plans/2026-03-21-rag-phase1.md:1566:Use search_blog_posts for questions about the author's own articles.
docs/superpowers/plans/2026-03-21-rag-phase1.md:1567:Use search_docs for technical questions about Cloudflare, Astro, or Workers.
docs/superpowers/plans/2026-03-21-rag-phase1.md:1733:interface Env { VECTORIZE_INDEX: VectorizeIndex; AI: Ai; DB: D1Database }
docs/superpowers/plans/2026-03-21-rag-phase1.md:1736:  const { VECTORIZE_INDEX, AI, DB } = env as unknown as Env
docs/superpowers/plans/2026-03-21-rag-phase1.md:1744:  const results = await VECTORIZE_INDEX.query(embResult.data[0], {
docs/superpowers/plans/2026-03-21-rag-phase1.md:1799:import { StateGraph, MemorySaver, END } from '@langchain/langgraph'
docs/superpowers/plans/2026-03-21-rag-phase1.md:1816:    .addNode('normalize_results', normalizeResultsNode)
docs/superpowers/plans/2026-03-21-rag-phase1.md:1830:  graph.addEdge('research', 'normalize_results')
docs/superpowers/plans/2026-03-21-rag-phase1.md:1831:  graph.addEdge('normalize_results', 'writer')
docs/superpowers/plans/2026-03-21-rag-phase1.md:1840:  return graph.compile({ checkpointer: new MemorySaver() })
docs/superpowers/plans/2026-03-21-rag-phase1.md:1882:- Create: `src/pages/api/chat.ts`
docs/superpowers/plans/2026-03-21-rag-phase1.md:1886:Create `src/pages/api/chat.ts`:
docs/superpowers/plans/2026-03-21-rag-phase1.md:1969:          } else if (nodeName === 'normalize_results') {
docs/superpowers/plans/2026-03-21-rag-phase1.md:2059:curl -X POST http://localhost:4321/api/chat \
docs/superpowers/plans/2026-03-21-rag-phase1.md:2069:git add src/pages/api/chat.ts
docs/superpowers/plans/2026-03-21-rag-phase1.md:2070:git commit -m "feat(api): SSE chat endpoint with auth, rate limiting, and Langfuse tracing"
docs/superpowers/plans/2026-03-21-rag-phase1.md:2083:- Create: `src/pages/chat.astro`
docs/superpowers/plans/2026-03-21-rag-phase1.md:2280:      const resp = await fetch('/api/chat', {
docs/superpowers/plans/2026-03-21-rag-phase1.md:2377:- [ ] **Step 14.6: Create chat.astro**
docs/superpowers/plans/2026-03-21-rag-phase1.md:2379:Create `src/pages/chat.astro`:
docs/superpowers/plans/2026-03-21-rag-phase1.md:2412:git add src/components/Chat/ src/pages/chat.astro
docs/superpowers/plans/2026-03-21-rag-phase1.md:2444:# quidproquo-embeddings is the main VECTORIZE_INDEX created in Step 1.6
docs/superpowers/plans/2026-03-21-rag-phase1.md:2480:- ✅ SSE streaming chat API at `/api/chat`
docs/superpowers/plans/2026-03-21-rag-phase1.md:2482:- ✅ Langfuse traces for every conversation
docs/TODO.md:84:- [ ] **工具描述品質規範** — `search_blog_posts` / `search_abstract_index` / `search_docs` 使用時機區分明確化，每個工具加上何時使用 / 何時不使用 / 預期回傳格式
docs/TODO.md:101:- [ ] **Task 2：D1 Migration**（`post_chunks`、`doc_chunks` 表）
docs/TODO.md:106:- [ ] **Task 7：Langfuse Helper**
docs/TODO.md:109:- [ ] **Task 10：`normalize_results` Node（TDD）**
docs/TODO.md:113:- [ ] **Task 14：Chat UI**（`AgentSteps`、`QuotaIndicator`、`MessageInput`、`MessageList`、`ChatWidget`、`chat.astro`）
docs/TODO.md:154:- [ ] **實作 `/api/crawl/sync` endpoint**
docs/superpowers/plans/2026-03-12-blog-d1-devlog-skill.md:139:    "binding": "VECTORIZE_INDEX",
docs/superpowers/plans/2026-03-12-blog-d1-devlog-skill.md:1119:CREATE TABLE post_chunks (
docs/superpowers/plans/2026-03-12-blog-d1-devlog-skill.md:1128:CREATE INDEX idx_chunks_post ON post_chunks(post_id);
docs/superpowers/plans/2026-03-12-blog-d1-devlog-skill.md:1131:CREATE TABLE doc_chunks (
docs/superpowers/plans/2026-03-12-blog-d1-devlog-skill.md:1140:CREATE INDEX idx_doc_source ON doc_chunks(source_url);
docs/superpowers/plans/2026-03-12-blog-d1-devlog-skill.md:1157:Expected: 看到 `posts`、`post_chunks`、`doc_chunks`
docs/superpowers/plans/2026-03-12-blog-d1-devlog-skill.md:1163:git commit -m "feat: add D1 schema migration for posts, post_chunks, doc_chunks"
docs/data.md:90:D1 posts + post_chunks + doc_chunks 表 Vectorize 嵌入寫入/查詢
docs/data.md:91:Vectorize Index 已建立（1024 維） /api/chat 對話端點
docs/data.md:107:現有資源：Vectorize index 已建、D1 已有 post_chunks 表、BGE 模型已綁定
docs/data.md:211:│ Research  │───┬── search_blog_posts（Vectorize 語意搜尋）
docs/data.md:212:│          │   ├── search_docs（外部文件搜尋）
docs/data.md:330:D1 post_chunks / doc_chunks 表 Embedding Pipeline（chunk → embed → Vectorize）
docs/data.md:332:Workers AI BGE 模型已綁定 /api/chat SSE 端點
docs/data.md:339:Task 1：安裝依賴（LangGraph、React、Langfuse）
docs/data.md:344:Task 6：/api/chat SSE 端點
docs/data.md:400:Phase 1 用 MemorySaver（記憶體，頁面重整就消失）。Phase 2 切換到 D1 Checkpointer：
docs/data.md:494:建議：在 normalize_results 節點加入 min_keep: 3 參數。
docs/data.md:526:search_blog_posts
docs/data.md:527:search_docs
docs/data.md:528:search_abstract_index
docs/data.md:535:但文章還建議：「工具之間功能不要重疊」。search_blog_posts 和 search_abstract_index 有語意重疊——兩者都搜尋部落格內容，只是粒度不同。
docs/data.md:537:建議：將 search_abstract_index 改為 Research 節點的內部策略（先搜摘要 → 找到後取完整 chunk），而非暴露為獨立工具讓 LLM 選擇。
docs/data.md:545:設計文件的 normalize_results 做了 lost-in-the-middle 重排，但 沒有 MMR。這會導致推薦結果中多篇文章講同一件事（重複資訊）。
docs/data.md:594:設計文件沒有任何 episodic memory 機制。Phase 1 用 MemorySaver（頁面重整即消失），Phase 2 用 D1 Checkpointer（保留對話但非跨 session 偏好）。
docs/data.md:609:Langfuse 可觀測性 Section 12 完整 trace 結構 ✅
docs/data.md:633:5 search_abstract_index 改為內部策略，非獨立工具 🟡 減少工具選擇混淆 重構一個節點
docs/data.md:634:6 normalize_results 加入 MMR（λ=0.7） 🟡 避免重複推薦 新增一個步驟
docs/data.md:684:記錄到 Langfuse 供後續分析
docs/data.md:697:問題：search_blog_posts vs search_abstract_index vs search_docs 的使用時機區分不明確。LLM 可能在該搜摘要時搜全文、在該搜文件時搜部落格。
docs/data.md:776:可觀測性（Langfuse） Section 12 完整 trace 結構 ✅
docs/data.md:777:使用者回饋（👍👎） D1 feedback 表 + Langfuse 連動 ✅
docs/data.md:787:5 search_abstract_index 改為內部策略 context-engineering-guide.md 🟡 P2
docs/data.md:803:你的設計文件在 大架構層面 與文章高度一致（Generator-Evaluator、Hybrid Search、Contextual Retrieval、LangGraph 圖結構、Langfuse 觀測性）。
src/pages/api/crawl/sync.ts:5:import { runCrawlSync } from '../../../lib/crawl/sync';
docs/superpowers/plans/2026-03-12-crawler-integration.md:5:**Goal:** 每週自動爬取外部技術文件（Cloudflare Docs、Astro Docs 等），chunking 後存進 D1 `doc_chunks` 表，為 Phase 4 RAG 系統建立知識庫。
docs/superpowers/plans/2026-03-12-crawler-integration.md:7:**Architecture:** 核心爬蟲邏輯放在 `src/lib/crawl/`（pure functions，可測試）。一個 POST `/api/crawl/sync` endpoint 處理手動觸發（受 secret 保護）。Cron Trigger 透過 post-build 腳本包裝 Astro 的 worker output，加入 `scheduled` handler 呼叫自身 endpoint。不引入新的部署單元。
docs/superpowers/plans/2026-03-12-crawler-integration.md:9:**Tech Stack:** Cloudflare Browser Rendering REST API (`/crawl`)、D1 (`doc_chunks` table，已建好)、Cloudflare Workers Cron Triggers、TypeScript、Worker secrets (`CF_API_TOKEN`、`CF_ACCOUNT_ID`、`CRAWL_SECRET`)
docs/superpowers/plans/2026-03-12-crawler-integration.md:15:- `doc_chunks` table 已在 `migrations/0001_initial.sql` 建好，不需要新 migration
docs/superpowers/plans/2026-03-12-crawler-integration.md:30:│       ├── chunker.ts         # markdown → doc_chunks 格式
docs/superpowers/plans/2026-03-12-crawler-integration.md:401:- Create: `src/lib/crawl/sync.ts`
docs/superpowers/plans/2026-03-12-crawler-integration.md:408:// src/lib/crawl/sync.ts
docs/superpowers/plans/2026-03-12-crawler-integration.md:434:    `INSERT INTO doc_chunks (id, source_url, source_name, chunk_index, content)
docs/superpowers/plans/2026-03-12-crawler-integration.md:501:git add src/lib/crawl/sync.ts
docs/superpowers/plans/2026-03-12-crawler-integration.md:509:### Task 5: POST /api/crawl/sync Endpoint
docs/superpowers/plans/2026-03-12-crawler-integration.md:512:- Create: `src/pages/api/crawl/sync.ts`
docs/superpowers/plans/2026-03-12-crawler-integration.md:519:// src/pages/api/crawl/sync.ts
docs/superpowers/plans/2026-03-12-crawler-integration.md:522:import { runCrawlSync } from '../../../lib/crawl/sync';
docs/superpowers/plans/2026-03-12-crawler-integration.md:580:git add src/pages/api/crawl/sync.ts
docs/superpowers/plans/2026-03-12-crawler-integration.md:581:git commit -m "feat: add POST /api/crawl/sync endpoint with secret auth"
docs/superpowers/plans/2026-03-12-crawler-integration.md:633:      fetch('https://quidproquo.cc/api/crawl/sync', {
docs/superpowers/plans/2026-03-12-crawler-integration.md:684:    "binding": "VECTORIZE_INDEX",
docs/superpowers/plans/2026-03-12-crawler-integration.md:808:curl -X POST https://quidproquo.cc/api/crawl/sync \
docs/superpowers/plans/2026-03-12-crawler-integration.md:829:  --command="SELECT source_name, COUNT(*) as chunks FROM doc_chunks GROUP BY source_name"
docs/superpowers/plans/2026-03-12-crawler-integration.md:837:curl -X POST https://quidproquo.cc/api/crawl/sync \
docs/superpowers/plans/2026-03-12-crawler-integration.md:858:- [x] POST `/api/crawl/sync` 可手動觸發爬蟲，受 secret 保護
docs/superpowers/plans/2026-03-12-crawler-integration.md:860:- [x] markdown 自動 chunk 並 upsert 到 D1 `doc_chunks`
docs/blog-improvement-plan.md:247:| D1 posts + post_chunks + doc_chunks 表 | Vectorize 嵌入寫入/查詢 |
docs/blog-improvement-plan.md:248:| Vectorize Index 已建立（1024 維） | `/api/chat` 對話端點 |
docs/blog-improvement-plan.md:264:- 現有資源：Vectorize index 已建、D1 已有 post_chunks 表、BGE 模型已綁定
docs/blog-improvement-plan.md:329:│ Research  │───┬── search_blog_posts（Vectorize 語意搜尋）
docs/blog-improvement-plan.md:330:│          │   ├── search_docs（外部文件搜尋）
docs/blog-improvement-plan.md:389:    → 重試 2 次仍不足 → 標註「此主題超出部落格涵蓋範圍」+ 記錄到 Langfuse
docs/blog-improvement-plan.md:638:| 5 | `search_abstract_index` 與 `search_blog_posts` 語意重疊 | context-engineering-guide.md：避免功能重疊工具 | 改為 Research 節點內部策略 |
docs/blog-improvement-plan.md:648:| 10 | Critic 失敗無降級策略 | Stripe 2-attempt cap | 重試 2 次仍不通過 → 標註可能不完整 + 記錄 Langfuse + 不再呼叫 LLM |
docs/blog-improvement-plan.md:685:| Langfuse 可觀測性 | Section 12 完整 trace 結構 |
docs/blog-improvement-plan.md:694:| 使用者回饋（👍👎） | D1 feedback 表 + Langfuse 連動 |
docs/blog-improvement-plan.md:705:| 1 | 安裝依賴（LangGraph、React、Langfuse） | — |
docs/blog-improvement-plan.md:710:| 6 | `/api/chat` SSE 端點 | Task 3, 5 |
docs/plan.md:274:CREATE TABLE post_chunks (
docs/plan.md:283:CREATE INDEX idx_chunks_post ON post_chunks(post_id);
docs/plan.md:286:CREATE TABLE doc_chunks (
docs/plan.md:295:CREATE INDEX idx_doc_source ON doc_chunks(source_url);
docs/plan.md:317:| 自己的文章 | D1 `post_chunks` | `post` | 每次 push |
docs/plan.md:318:| Cloudflare Docs | D1 `doc_chunks` | `docs` | 每週 |
docs/plan.md:319:| Astro Docs | D1 `doc_chunks` | `docs` | 每週 |
docs/plan.md:320:| 其他常用文件 | D1 `doc_chunks` | `docs` | 每週 |
docs/plan.md:389:    "binding": "VECTORIZE_INDEX",
docs/plan.md:438:- [ ] 實作 `/api/crawl/sync` endpoint
docs/plan.md:460:- [ ] Langfuse observability 串接
docs/research/ollama-research.md:131:| `POST /api/chat` | 多輪對話 |
src/lib/crawl/sync.ts:25:    `INSERT INTO doc_chunks (id, source_url, source_name, chunk_index, content)
src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:140:- `search_blog_posts` vs `search_abstract_index` vs `search_docs` 使用時機區分不明確
src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md:142:- `search_abstract_index` 改為 Research 節點的內部策略，不暴露為獨立工具
src/content/posts/tech/2026-03-24-action-maker-ai-integration.md:45:  ├─ Langfuse → 追蹤每次 AI call
src/content/posts/tech/2026-03-24-action-maker-ai-integration.md:275:- [Langfuse - LLM Observability](https://langfuse.com/)
src/content/posts/tech/2026-04-17-cloudflare-workers-ai-binding-utilities.md:214:我在這個 [quidproquo 部落格](/posts/product/2026-03-12-quidproquo-blog-from-scratch) 的 `wrangler.jsonc` 已經宣告了 `AI` + `VECTORIZE_INDEX` + `R2_IMAGES` 三個 binding。目前只用 `run()` 做 embedding 和文章語義搜尋，其他三組方法都還沒動。
src/content/posts/ai/2026-03-30-harness-engineering-patterns.md:957:這些指標用 [Langfuse](/posts/ai/2026-03-26-langfuse-llm-observability-guide) 或類似的 LLM observability 平台追蹤最方便。每個 Agent 步驟作為一個 span，整個任務作為一個 trace，Guard 結果和 Checkpoint 事件作為 event 附加上去。
src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:365:Langfuse 是目前最流行的開源 LLM 可觀測性平台，它提供：
src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:388:→ **專文深入**：[Langfuse 完整指南：LLM 應用的可觀測性從零開始](/posts/ai/2026-03-26-langfuse-llm-observability-guide)
src/content/posts/ai/2026-03-18-ai-agent-patterns-guide.md:468:| 不知道 Agent 為什麼出錯 | 可觀測性（Langfuse） |
src/content/posts/ai/2026-03-14-ollama-local-llm-guide.md:309:curl http://localhost:11434/api/chat -d '{
src/content/posts/ai/2026-03-14-ollama-local-llm-guide.md:343:`/api/chat` 和 `/api/generate` 都支援 `options` 物件，可以在每次請求層級覆蓋模型參數：
src/content/posts/ai/2026-03-14-ollama-local-llm-guide.md:346:curl http://localhost:11434/api/chat -d '{
src/content/posts/ai/2026-03-14-ollama-local-llm-guide.md:424:curl http://localhost:11434/api/chat -d '{
src/content/posts/ai/2026-03-12-rag-observability-tools.md:7:tldr: "自己寫 trace 夠用，但開源工具讓你少做很多事。Langfuse、Phoenix、LangSmith 各有定位，選哪個取決於你對自架、開源、整合複雜度的取捨。"
src/content/posts/ai/2026-03-12-rag-observability-tools.md:8:description: "2026 年 RAG 可觀測性工具的比較：Langfuse、Phoenix（Arize）、LangSmith、Helicone，各自的強項、弱點，以及如何選擇。"
src/content/posts/ai/2026-03-12-rag-observability-tools.md:18:## Langfuse
src/content/posts/ai/2026-03-12-rag-observability-tools.md:32:import Langfuse from "langfuse";
src/content/posts/ai/2026-03-12-rag-observability-tools.md:34:const langfuse = new Langfuse({
src/content/posts/ai/2026-03-12-rag-observability-tools.md:93:- Trace 視圖（類似 Langfuse）
src/content/posts/ai/2026-03-12-rag-observability-tools.md:116:- 相較 Langfuse，Prompt 管理功能較弱
src/content/posts/ai/2026-03-12-rag-observability-tools.md:196:| | Langfuse | Phoenix | LangSmith | Helicone |
src/content/posts/ai/2026-03-12-rag-observability-tools.md:209:**自架 + 完整功能** → Langfuse。目前最成熟的開源選項，評估框架完整，Prompt 版本管理是加分項。
src/content/posts/ai/2026-03-12-rag-observability-tools.md:219:NobodyClimb 的系統選擇了自訂 trace，主要原因是部署在 Cloudflare Workers（不能輕易跑外部 SDK 的 flush 機制），且 trace 資料需要和業務資料（攀岩路線、用戶資料）緊密整合。但如果是重新開始且沒有平台限制，Langfuse 會是第一個試的選項。
src/content/posts/ai/2026-03-12-rag-observability-tools.md:225:- [Langfuse Documentation](https://langfuse.com/docs)
src/content/posts/ai/2026-03-12-rag-observability-tools.md:226:- [Langfuse GitHub Repository](https://github.com/langfuse/langfuse)
src/content/posts/ai/2026-04-17-ai-native-team-practices.md:134:工具生態已經很成熟：[Braintrust](https://www.braintrust.dev/articles/best-ai-agent-observability-tools-2026)、Langfuse、Arize、[Confident AI](https://www.confident-ai.com/knowledge-base/compare/best-ai-observability-tools-2026) 都提供完整的 tracing、evaluation、production monitoring。
src/content/posts/ai/2026-03-12-rag-observability-tracing.md:210:- [Langfuse - Open Source LLM Observability](https://langfuse.com/docs)
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:2:title: "Langfuse 完整指南：LLM 應用的可觀測性從零開始"
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:7:tldr: "Langfuse 是目前最成熟的開源 LLM Observability 平台。這篇從 Tracing、Prompt 管理、評估、Dataset 四個核心功能切入，帶你搞清楚它在實際專案中怎麼用。"
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:8:description: "Langfuse 完整使用指南：從安裝設定到 Tracing、Prompt 版本管理、Evaluation 評估框架、Dataset 回歸測試，涵蓋 TypeScript/Python SDK 整合與實戰範例。"
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:16:Langfuse 就是解決這件事的工具。
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:20:## Langfuse 是什麼
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:22:Langfuse 是一個**開源的 LLM Observability 平台**，專門為 LLM 應用設計的監控和分析工具。它不是通用的 APM（像 Datadog 或 New Relic），而是針對 LLM 應用的特殊需求：追蹤 prompt 的輸入輸出、計算 token 成本、管理 prompt 版本、評估回答品質。
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:31:可以用 Langfuse Cloud（免費方案就能用），也可以完全自架（Docker Compose 或 Kubernetes）。
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:56:# 啟動（包含 PostgreSQL 和 Langfuse server）
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:82:Tracing 是 Langfuse 最核心的功能。每次用戶發送一個請求，你的 LLM 應用背後可能做了很多事：查資料庫、呼叫 embedding API、做 retrieval、呼叫 LLM 生成回答。Tracing 把這些步驟全部記錄下來，讓你事後可以逐步檢視。
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:86:Langfuse 的 trace 由三種元素組成：
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:97:import Langfuse from "langfuse";
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:99:const langfuse = new Langfuse({
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:171:在 Langfuse Dashboard 裡，你可以點開任何一個 trace，看到完整的呼叫樹：每個步驟花了多久、LLM 收到什麼 prompt、回了什麼、用了多少 token。
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:175:如果你的應用主要就是呼叫 OpenAI API，Langfuse 提供了一個 wrapper，幾乎不用改程式碼：
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:245:Langfuse 的 Prompt Management 把 prompt 從程式碼中抽離出來，在 Dashboard 上管理。
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:249:在 Langfuse Dashboard 上建立一個 prompt，例如叫做 `rag-system-prompt`：
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:265:// 從 Langfuse 取得最新的 prompt
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:283:每次在 Dashboard 上修改 prompt，Langfuse 會自動建立新版本。你可以：
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:322:知道 LLM 回了什麼是第一步，知道它回答得**好不好**才是關鍵。Langfuse 提供三種評估方式：
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:336:把用戶的回饋（按讚/倒讚、評分）回傳給 Langfuse：
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:355:// 在 Langfuse Dashboard 設定 Evaluator
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:386:  // 把分數送回 Langfuse
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:397:Langfuse 也有內建的 Evaluator 功能，可以在 Dashboard 上設定評估模板，針對新的 trace 自動執行評估，不需要在應用程式碼裡寫評估邏輯。
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:403:每次改 prompt、換模型、調整 retrieval 參數，你需要知道「改完之後有沒有變好」。Langfuse Datasets 讓你建立一組標準測試集，每次修改後重跑，比較結果。
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:490:Langfuse 會根據 generation 記錄的 model 和 token usage 自動計算費用。Dashboard 上可以看到：
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:497:不需要額外設定，只要 generation 裡有記錄 model 和 token usage，費用就會自動算出來。Langfuse 內建主流模型（OpenAI、Anthropic、Gemini 等）的定價資料，如果你用的是自架模型或 fine-tuned 模型，也可以在 Dashboard 上自訂定價。
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:505:Langfuse 不只有低階 SDK，也和主流框架有現成的整合：
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:533:// 啟用 telemetry，Langfuse 透過 OTEL exporter 接收
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:549:搭配 `@langfuse/vercel` 的 `LangfuseExporter` 設定 OpenTelemetry，就能自動把所有 Vercel AI SDK 呼叫送到 Langfuse。支援所有 AI SDK provider（OpenAI、Anthropic、Google、Mistral 等）。
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:568:把上面的功能串起來，一個典型的 Langfuse 使用流程是這樣的：
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:578:1. 收集用戶回饋（讚/倒讚），送到 Langfuse
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:591:## 該用 Langfuse 嗎？
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:609:如果你正在認真做一個 LLM 應用，Langfuse 值得花一個下午設定起來。看得見問題，才能修好問題。
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:615:- [Langfuse 官方文件](https://langfuse.com/docs)
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:616:- [Langfuse GitHub](https://github.com/langfuse/langfuse)
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:617:- [Langfuse Cloud](https://cloud.langfuse.com)
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:618:- [Langfuse Cookbook（整合範例集）](https://langfuse.com/guides/cookbook)
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:619:- [Langfuse TypeScript SDK](https://www.npmjs.com/package/langfuse)
src/content/posts/ai/2026-03-26-langfuse-llm-observability-guide.md:620:- [Langfuse Python SDK](https://pypi.org/project/langfuse/)
src/content/posts/ai/2026-03-13-chatbot-development-guide.md:8:description: "從對話狀態架構（Session/User/Global State）、記憶策略（Sliding Window/Summary+Recent/Selective）、SSE Streaming、三層 Guardrails、Langfuse 可觀測性到 TypeScript vs Python 技術棧選型的完整開發指南。"
src/content/posts/ai/2026-03-13-chatbot-development-guide.md:682:app.post('/api/chat', async (c) => {
src/content/posts/ai/2026-03-13-chatbot-development-guide.md:752:    const response = await fetch(`${this.baseUrl}/api/chat`, {
src/content/posts/ai/2026-03-13-chatbot-development-guide.md:865:fetch('/api/chat', {
src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1314:### Langfuse 整合
src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1316:[Langfuse](https://langfuse.com) 是開源的 LLM 可觀測性平台。它可以追蹤每一次 LLM 呼叫的 input/output、token 用量、延遲、成本。
src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1319:import { Langfuse } from 'langfuse';
src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1321:const langfuse = new Langfuse({
src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1430:| **Token Cost** | 每次對話成本 | 依預算 | Langfuse 自動追蹤 |
src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1439:  const langfuse = new Langfuse({ /* ... */ });
src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1441:  // 用 Langfuse API 撈資料
src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1575:app.post('/api/chat', async (c) => {
src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1686:│  │  PostgreSQL + pgvector  |  Redis  |  Langfuse  │  │
src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1737:         │      Observability (Langfuse)    │
src/content/posts/ai/2026-03-13-chatbot-development-guide.md:1750:- [Langfuse Documentation — Tracing](https://langfuse.com/docs/tracing) — Langfuse 官方文件，LLM 可觀測性與 trace 追蹤實作指南

codex
關鍵問題已浮出來了：這份 TODO 同時有「過時項目」和「跳步項目」。像 `/api/crawl/sync` 已經存在，但 `RAG 評估 / feature flag / shadow mode` 卻被放到基礎可用聊天系統之後，這會讓你先把複雜度加上去，再補回退機制，順序是反的。
exec
/bin/zsh -lc "sed -n '1,220p' src/pages/api/crawl/sync.ts" in /Users/xiaoxu/Projects/quidproquo
 succeeded in 0ms:
export const prerender = false;

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

exec
/bin/zsh -lc "sed -n '1,220p' wrangler.jsonc" in /Users/xiaoxu/Projects/quidproquo
exec
/bin/zsh -lc "sed -n '1,240p' src/lib/crawl/sync.ts" in /Users/xiaoxu/Projects/quidproquo
 succeeded in 0ms:
{
  "name": "quidproquo",
  "account_id": "1ff43f0d4c3ad3bd98ce5ab767546a68",
  "compatibility_date": "2026-03-10",
  "routes": [
    { "pattern": "quidproquo.cc", "custom_domain": true },
    { "pattern": "www.quidproquo.cc", "custom_domain": true }
  ],
  "compatibility_flags": ["nodejs_compat"],
  "triggers": {
    "crons": ["0 2 * * SUN"]
  },
  "assets": {
    "binding": "ASSETS",
    "directory": "./dist"
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
  }],
  "env": {
    "preview": {
      "name": "quidproquo-preview"
    }
  }
}

 succeeded in 0ms:
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

exec
/bin/zsh -lc 'rg -n "CREATE TABLE (post_chunks|doc_chunks)|0001|0002_rag_phase1|feedback|fts5|chat_logs" migrations docs/plan.md docs/superpowers/plans -S' in /Users/xiaoxu/Projects/quidproquo
 succeeded in 0ms:
docs/plan.md:184:│   └── 0001_initial.sql              # D1 schema
docs/plan.md:274:CREATE TABLE post_chunks (
docs/plan.md:286:CREATE TABLE doc_chunks (
migrations/0001_initial.sql:1:-- migrations/0001_initial.sql
migrations/0001_initial.sql:24:CREATE TABLE post_chunks (
migrations/0001_initial.sql:36:CREATE TABLE doc_chunks (
docs/superpowers/plans/2026-03-21-rag-phase1.md:21:| `migrations/0002_rag_phase1.sql` | ALTER TABLE post_chunks/doc_chunks, FTS5, chat_logs, feedback, settings |
docs/superpowers/plans/2026-03-21-rag-phase1.md:180:- Create: `migrations/0002_rag_phase1.sql`
docs/superpowers/plans/2026-03-21-rag-phase1.md:184:Create `migrations/0002_rag_phase1.sql`:
docs/superpowers/plans/2026-03-21-rag-phase1.md:197:CREATE VIRTUAL TABLE chunks_fts USING fts5(
docs/superpowers/plans/2026-03-21-rag-phase1.md:209:CREATE TABLE IF NOT EXISTS chat_logs (
docs/superpowers/plans/2026-03-21-rag-phase1.md:220:CREATE INDEX IF NOT EXISTS idx_chat_logs_thread ON chat_logs(thread_id);
docs/superpowers/plans/2026-03-21-rag-phase1.md:221:CREATE INDEX IF NOT EXISTS idx_chat_logs_ip ON chat_logs(ip);
docs/superpowers/plans/2026-03-21-rag-phase1.md:223:-- User feedback
docs/superpowers/plans/2026-03-21-rag-phase1.md:224:CREATE TABLE IF NOT EXISTS feedback (
docs/superpowers/plans/2026-03-21-rag-phase1.md:229:  FOREIGN KEY (chat_log_id) REFERENCES chat_logs(id)
docs/superpowers/plans/2026-03-21-rag-phase1.md:254:wrangler d1 execute quidproquo-db --local --file=migrations/0002_rag_phase1.sql
docs/superpowers/plans/2026-03-21-rag-phase1.md:263:Expected: includes `chunks_fts`, `chat_logs`, `feedback`, `settings`
docs/superpowers/plans/2026-03-21-rag-phase1.md:268:git add migrations/0002_rag_phase1.sql
docs/superpowers/plans/2026-03-21-rag-phase1.md:2021:          'INSERT INTO chat_logs (id, thread_id, ip, is_admin, query, response, confidence, langfuse_trace_id) VALUES (?,?,?,?,?,?,?,?)'
docs/superpowers/plans/2026-03-12-blog-d1-devlog-skill.md:25:│   └── 0001_initial.sql                  # D1 schema
docs/superpowers/plans/2026-03-12-blog-d1-devlog-skill.md:1092:- Create: `migrations/0001_initial.sql`
docs/superpowers/plans/2026-03-12-blog-d1-devlog-skill.md:1097:-- migrations/0001_initial.sql
docs/superpowers/plans/2026-03-12-blog-d1-devlog-skill.md:1119:CREATE TABLE post_chunks (
docs/superpowers/plans/2026-03-12-blog-d1-devlog-skill.md:1131:CREATE TABLE doc_chunks (
docs/superpowers/plans/2026-03-12-blog-d1-devlog-skill.md:1146:npx wrangler d1 execute quidproquo-db --local --file=migrations/0001_initial.sql
docs/superpowers/plans/2026-03-12-blog-d1-devlog-skill.md:1463:npx wrangler d1 execute quidproquo-db --file=migrations/0001_initial.sql
docs/superpowers/plans/2026-03-12-crawler-integration.md:15:- `doc_chunks` table 已在 `migrations/0001_initial.sql` 建好，不需要新 migration

codex
我準備把結論收斂成「哪幾項優先順序錯了、哪些項目已過時、哪些依賴沒寫清楚、哪些風險缺守門」。先補精確行號，避免只給抽象意見。
exec
/bin/zsh -lc "nl -ba docs/TODO.md | sed -n '1,240p'" in /Users/xiaoxu/Projects/quidproquo
exec
/bin/zsh -lc "nl -ba src/content.config.ts | sed -n '1,120p'" in /Users/xiaoxu/Projects/quidproquo
 succeeded in 0ms:
     1	// src/content.config.ts
     2	import { defineCollection, z } from 'astro:content';
     3	import { glob } from 'astro/loaders';
     4	
     5	const posts = defineCollection({
     6	  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
     7	  schema: z.object({
     8	    title: z.string(),
     9	    date: z.coerce.date(),
    10	    category: z.string(),
    11	    tags: z.array(z.string()),
    12	    lang: z.enum(['zh-TW', 'en']).default('zh-TW'),
    13	    description: z.string().optional(),
    14	    tldr: z.string().optional(),
    15	    draft: z.boolean().default(false),
    16	    pinned: z.boolean().default(false),
    17	    type: z.enum(['debug', 'deep-dive', 'guide', 'project']).optional(),
    18	    readingTime: z.number().optional(),
    19	    series: z.object({
    20	      name: z.string(),
    21	      order: z.number(),
    22	    }).optional(),
    23	  }),
    24	});
    25	
    26	export const collections = { posts };

 succeeded in 0ms:
     1	# quidproquo 任務總清單
     2	
     3	> 整合來源：`docs/plan.md`、`docs/superpowers/plans/`、`src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md`
     4	> 最後更新：2026-04-19
     5	>
     6	> **設計鐵律：每個加上去的技術都必須能關掉。**
     7	> 所有進階技術（HyDE、Multi-query、Reranker、Critic...）都必須有 feature flag、有 A/B 比較機制、只為觀測到的失敗而加。
     8	
     9	---
    10	
    11	## 現況快照
    12	
    13	| 指標 | 數值 |
    14	|------|------|
    15	| 總文章數 | 227 篇 |
    16	| 斷連結數 | 49 個（影響約 40 篇文章） |
    17	| 草稿數 | 17 篇 |
    18	| 缺 `type` 欄位 | 213 篇（94%） |
    19	| 缺 `series` 欄位 | 199 篇（88%） |
    20	| 缺 `tldr` | 7 篇 |
    21	| Tag 不一致 | `ai-agent` vs `ai-agents`（35 篇） |
    22	
    23	---
    24	
    25	## P0 立即執行（低成本、高影響）
    26	
    27	### 內容修正
    28	
    29	- [x] **修復 49 個內部斷連結**
    30	  - 重災區：`ai/2026-04-01-agent-cli-guidelines.md` 有 10 個斷連結
    31	  - 處理方式：暫時改為 plain text 標註「即將推出」
    32	- [ ] **統一 tag 命名** — `ai-agent`（21 篇）+ `ai-agents`（14 篇）→ 統一為 `ai-agent`
    33	
    34	### 爬蟲 Chunker 參數修正
    35	
    36	- [ ] **`MAX_CHUNK_CHARS` 降為 1500**（`src/lib/crawl/config.ts:43`；中文 2000 chars ≈ 800–1000 tokens，超出建議範圍；`chunking-strategies.md` 建議上限）
    37	
    38	### Harness 基礎建設
    39	
    40	- [ ] **建立根目錄 `CLAUDE.md`**（技術棧、目錄結構、開發流程、命名規範、決策理由）
    41	- [ ] **Pre-commit hook（lint + reference check）** — 用 husky 或 simple-git-hooks；「Linter 是法律，prompt 是建議」
    42	- [ ] **`check-post-references.mjs` 加入 CI**（script 已存在但沒跑，導致 49 個斷連結直接上線）
    43	
    44	### 網站技術
    45	
    46	- [ ] **建立 404 錯誤頁面** — `/src/pages/404.astro`，含搜尋框 + 熱門文章推薦
    47	
    48	---
    49	
    50	## P1 短期（1–2 週）
    51	
    52	### 內容補強
    53	
    54	- [ ] **補上 213 篇缺失的 `type` 欄位**（批次腳本或 LLM 自動分類，人工 review）
    55	- [ ] **補上 7 篇缺失的 `tldr`**（Claude 批量生成，人工 review）
    56	
    57	### 網站技術
    58	
    59	- [ ] **英文版搜尋頁** — `/src/pages/search.astro` 硬編碼 `lang="zh-TW"`，需建立 `/src/pages/en/search.astro`
    60	- [ ] **英文首頁加上 about 區塊**（英文讀者看不懂「Quid Pro Quo」是什麼）
    61	- [ ] **字型載入優化（影響 LCP）** — `<link rel="preload" as="font">` + `font-display: swap`
    62	- [ ] **圖片尺寸 + lazy loading（影響 CLS）** — 啟用 `astro:assets`，markdown 圖片補 `loading="lazy"` 與 width/height
    63	- [ ] **無障礙基本款** — Skip Navigation 連結、`:focus-visible` 鍵盤樣式、驗證 `--text-muted: #999` 對比度
    64	- [ ] **Blog 前端改版**（詳細步驟：`docs/superpowers/plans/2026-03-12-blog-redesign.md`）
    65	  - [ ] Task 1：Icons component + CSS design tokens + PostLayout 更新
    66	  - [ ] Task 2：Nav 改版
    67	  - [ ] Task 3：PostCard 改版
    68	  - [ ] Task 4：Reading time remark plugin + schema 欄位
    69	  - [ ] Task 5：i18n strings 更新
    70	  - [ ] Task 7：Related posts + series nav utilities
    71	  - [ ] Task 8：Article page 改版
    72	  - [ ] Task 10：RSS Feed
    73	  - [ ] Task 11：Sitemap
    74	  - [ ] Task 12：OG Image 自動產生
    75	  - [ ] Task 13：Pagefind 靜態搜尋
    76	  - [ ] Task 14：Final build 驗證
    77	
    78	### Harness 基礎建設
    79	
    80	- [ ] **Frontmatter `type` 改為 required**（更新 `src/content.config.ts` schema；用 schema 強制，不靠 prompt 請求）
    81	- [ ] **建立 `progress.txt` 機制**（最低成本的 episodic memory，不需要 vector DB）
    82	- [ ] **Session-start hook** — 自動跑 `pnpm lint` + 讀 `progress.txt`
    83	- [ ] **Post skill 加入 Evaluator 節點**（檢查：frontmatter 完整性、內部連結有效性、tag 一致性、標題結構）
    84	- [ ] **工具描述品質規範** — `search_blog_posts` / `search_abstract_index` / `search_docs` 使用時機區分明確化，每個工具加上何時使用 / 何時不使用 / 預期回傳格式
    85	
    86	### RAG 設計修正
    87	
    88	- [ ] **Deterministic Validation Node（Stripe Blueprint 模式）** — 在 Writer → Critic 之間插入確定性驗證（Markdown 語法、source URL、Mermaid 語法）
    89	- [ ] **Critic 失敗降級策略** — 重試 2 次仍低於門檻 → 標註「⚠️ 此回答可能不完整」，停止呼叫 LLM
    90	- [ ] **Prompt 改用「描述終態」風格**（描述「成功的回答長什麼樣」而非「按步驟做」）
    91	
    92	---
    93	
    94	## P2 中期（1–2 個月）
    95	
    96	### AI Agent 應用實作
    97	
    98	> 詳細實作步驟：`docs/superpowers/plans/2026-03-21-rag-phase1.md`
    99	
   100	- [ ] **Task 1：安裝依賴 + 環境設定**（React、vitest、Vectorize、Workers AI bindings）
   101	- [ ] **Task 2：D1 Migration**（`post_chunks`、`doc_chunks` 表）
   102	- [ ] **Task 3：Chunk ID + Contextual Retrieval（TDD）**
   103	- [ ] **Task 4：Embedding Pipeline + Hybrid Search** — 197 篇文章 embed 進 Vectorize；實作 Vectorize 語意 + D1 FTS5 BM25 + RRF 融合
   104	- [ ] **Task 5：Auth — Session + Rate Limit（TDD）**（訪客 IP 限額 5 次/日）
   105	- [ ] **Task 6：Login Page**
   106	- [ ] **Task 7：Langfuse Helper**
   107	- [ ] **Task 8：LangGraph State Definition**
   108	- [ ] **Task 9：Research Tools（TDD）** — `search-posts.ts`、`search-docs.ts`、`get-post-detail.ts`
   109	- [ ] **Task 10：`normalize_results` Node（TDD）**
   110	- [ ] **Task 11：Planner、Writer、Critic、Related Posts agents**
   111	- [ ] **Task 12：Graph Builder**
   112	- [ ] **Task 13：Chat SSE API Endpoint**
   113	- [ ] **Task 14：Chat UI**（`AgentSteps`、`QuotaIndicator`、`MessageInput`、`MessageList`、`ChatWidget`、`chat.astro`）
   114	- [ ] **Task 15：Run Embed Pipeline + Smoke Test**
   115	- [ ] **AI 驅動相關文章推薦**（取代純 tag 匹配：40% tag + 30% 分類 + 20% 時近性 + 10% 同系列）
   116	- [ ] **自動 TL;DR 與 description 生成**
   117	- [ ] **自動 tag 建議** — 新文章發布時，根據內容 embedding 推薦應加的 tag
   118	- [ ] **難度分級** — 自動標記文章為「入門 / 進階 / 深度」，寫入 frontmatter
   119	- [ ] **重複主題偵測** — 找出語意相似度高的文章對，提示合併或區隔
   120	- [ ] **文章新鮮度偵測** — 比對爬蟲資料，標記引用了過時 API / 已淘汰工具的文章
   121	- [ ] **互動詞彙表** — hover 技術名詞時 AI 即時解釋，不離開頁面
   122	- [ ] **內容缺口分析** — 分析站內搜尋紀錄，找出讀者在搜但你還沒寫的主題
   123	- [ ] **SEO 優化 agent** — 建議更好的標題、description、內部連結機會
   124	
   125	### RAG 設計補強
   126	
   127	- [ ] **Semantic Cache threshold 設為 `0.95`**（實作時即設定；`semantic-caching.md` 指出 0.90–0.94 是「相關但不同」的危險區間）
   128	- [ ] **Reranker 加入 `min_keep: 3`**（實作時即設定；`cross-encoder-reranking.md` 明確建議的安全網）
   129	- [ ] **MMR 多樣性重排**（λ = 0.7，在 reranker 後、Writer 前插入）
   130	- [ ] **Adaptive RAG queryType 路由**（`complexity: simple | medium | complex`，simple 跳過 HyDE/Multi-query）
   131	- [ ] **CRAG filter 放寬策略**（零結果時漸進放寬次要 filter → 仍低分 → web search fallback）
   132	- [ ] **Critic 加 answer-relevance 檢查**（不只 grounding，也檢查真的回答了問題）
   133	- [ ] **Critic 加 drift 偵測**（檢查 Research 過程是否偏離原始查詢意圖）
   134	
   135	### Harness 基礎建設
   136	
   137	- [ ] **Ollama 本地模型整合** — 批次任務（自動 tag、難度分級、TL;DR 生成）改用本地模型，API 成本歸零；研究筆記：`docs/research/ollama-research.md`
   138	- [ ] **設計決策 ADR**（為什麼用 BGE-large？為什麼 chunk 2000？為什麼 cache 0.95？）
   139	- [ ] **RAG pipeline feature flag**（HyDE、Multi-query、Reranker、Critic 各自可開關）
   140	- [ ] **Shadow Mode A/B 比較機制**（開啟 vs 關閉，比較 RAGAS 分數）
   141	- [ ] **Context Checkpoint 系統**（動態壓縮門檻：`threshold = model_context_window * 0.7`，非硬編碼 8000 tokens）
   142	
   143	### 網站技術
   144	
   145	- [ ] **RSS Feed 加 `<author>` 標籤**
   146	- [ ] **Series 系列化**（RAG 系列、Claude Code 系列、AI Agent 系列正式組織）
   147	- [ ] **排程發布** — 87% 文章集中 2026 年 3 月，設定 `date` 未來日期搭配 CI 定時發布，維持穩定節奏
   148	- [ ] **多語言翻譯 Pipeline（Multi-Agent）** — Translator → Cultural Reviewer → Native Checker
   149	
   150	### 爬蟲整合
   151	
   152	> 詳細設計：`docs/plan.md` Phase 3、`docs/superpowers/plans/2026-03-12-crawler-integration.md`
   153	
   154	- [ ] **實作 `/api/crawl/sync` endpoint**
   155	- [ ] **設定要爬取的技術文件站清單**
   156	- [ ] **實作 Markdown → chunking pipeline**
   157	- [ ] **設定 Cron Trigger 定期爬取**
   158	- [ ] **增量更新機制（modifiedSince）**
   159	
   160	---
   161	
   162	## P3 長期（3 個月以上）
   163	
   164	### AI 進階功能
   165	
   166	- [ ] **站長端 episodic memory**（記住寫作偏好、常用範本；參考 Hermes Agent 的 user profile dialectic）
   167	- [ ] **Judge sampling 30%**（簡單查詢跳過 Critic，預期省 20-30% 成本）
   168	- [ ] **BM25 短路邏輯**（BM25 回傳 ≥ 5 結果時跳過向量搜尋）
   169	- [ ] **RAGAS 評估 pipeline + Golden Dataset**（20-25 個測試案例，涵蓋精確查詢、概念解釋、跨文章綜合、不在知識庫、中英混雜五類）
   170	- [ ] **GraphRAG**（從文章中抽取實體與關係，適合跨文章查詢）
   171	- [ ] **自訂文件上傳功能**（PDF / Markdown / URL 三種來源）
   172	- [ ] **學習路徑生成** — 給定目標（如「我想學 RAG」），自動規劃文章閱讀順序
   173	- [ ] **知識地圖** — 視覺化文章之間的概念關係圖
   174	
   175	---
   176	
   177	## 參考資料
   178	
   179	| 文件 | 用途 |
   180	|------|------|
   181	| `docs/plan.md` | 專案架構設計、技術棧決策、資料流說明 |
   182	| `docs/superpowers/plans/2026-03-12-blog-redesign.md` | Blog 前端改版詳細步驟（含完整程式碼） |
   183	| `docs/superpowers/plans/2026-03-21-rag-phase1.md` | RAG Phase 1 詳細實作步驟（含 TDD、LangGraph） |
   184	| `docs/superpowers/plans/2026-03-12-crawler-integration.md` | 爬蟲整合詳細設計 |
   185	| `docs/blog-improvement-plan.md` | 舊版規劃（已整合至本文件，可封存） |
   186	| `src/content/posts/product/2026-04-18-quidproquo-improvement-roadmap.md` | 公開發表的 roadmap 文章（含設計理念說明） |

exec
/bin/zsh -lc "nl -ba src/pages/search.astro | sed -n '1,120p'" in /Users/xiaoxu/Projects/quidproquo
exec
/bin/zsh -lc "nl -ba .github/workflows/deploy.yml | sed -n '1,120p'" in /Users/xiaoxu/Projects/quidproquo
exec
/bin/zsh -lc "nl -ba astro.config.mjs | sed -n '1,160p'" in /Users/xiaoxu/Projects/quidproquo
 succeeded in 0ms:
     1	---
     2	// src/pages/search.astro
     3	export const prerender = true;
     4	import PostLayout from '../layouts/PostLayout.astro';
     5	import { useTranslations } from '../i18n/utils';
     6	const t = useTranslations('zh-TW');
     7	---
     8	<PostLayout title={t('nav.search')} lang="zh-TW">
     9	  <Fragment slot="head">
    10	    <link href="/pagefind/pagefind-ui.css" rel="stylesheet" />
    11	  </Fragment>
    12	  <h1>{t('nav.search')}</h1>
    13	  <div id="search"></div>
    14	</PostLayout>
    15	
    16	<script src="/pagefind/pagefind-ui.js" is:inline></script>
    17	<script is:inline>
    18	  window.addEventListener('DOMContentLoaded', () => {
    19	    new PagefindUI({ element: '#search', showImages: false });
    20	  });
    21	</script>

 succeeded in 0ms:
     1	name: Deploy
     2	
     3	on:
     4	  push:
     5	    branches: [main]
     6	
     7	jobs:
     8	  deploy:
     9	    runs-on: ubuntu-latest
    10	    steps:
    11	      - uses: actions/checkout@v4
    12	
    13	      - uses: pnpm/action-setup@v4
    14	        with:
    15	          version: latest
    16	
    17	      - uses: actions/setup-node@v4
    18	        with:
    19	          node-version: 22
    20	          cache: pnpm
    21	
    22	      - run: pnpm install
    23	
    24	      - name: Lint
    25	        run: pnpm lint
    26	
    27	      - name: Build
    28	        run: pnpm build
    29	        env:
    30	          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    31	
    32	      - name: Deploy to production
    33	        uses: cloudflare/wrangler-action@v3
    34	        with:
    35	          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    36	          wranglerVersion: "4"
    37	          command: deploy --config dist/server/wrangler.json

 succeeded in 0ms:
     1	// astro.config.mjs
     2	import { defineConfig } from 'astro/config';
     3	import cloudflare from '@astrojs/cloudflare';
     4	import mdx from '@astrojs/mdx';
     5	import sitemap from '@astrojs/sitemap';
     6	import { remarkReadingTime } from './src/plugins/remarkReadingTime.ts';
     7	
     8	export default defineConfig({
     9	  site: 'https://quidproquo.cc',
    10	  output: 'server',
    11	  adapter: cloudflare({ platformProxy: { enabled: true }, remoteBindings: false }),
    12	  integrations: [
    13	    mdx(),
    14	    sitemap(),
    15	    {
    16	      name: 'pagefind',
    17	      hooks: {
    18	        'astro:build:done': async ({ dir }) => {
    19	          const { execSync } = await import('child_process');
    20	          execSync(`npx pagefind --site ${dir.pathname}`, { stdio: 'inherit' });
    21	        },
    22	      },
    23	    },
    24	  ],
    25	  markdown: {
    26	    remarkPlugins: [remarkReadingTime],
    27	  },
    28	  i18n: {
    29	    defaultLocale: 'zh-TW',
    30	    locales: ['zh-TW', 'en'],
    31	    routing: { prefixDefaultLocale: false },
    32	  }
    33	});

exec
/bin/zsh -lc "nl -ba .github/workflows/preview.yml | sed -n '1,120p'" in /Users/xiaoxu/Projects/quidproquo
exec
/bin/zsh -lc "nl -ba src/pages/api/crawl/sync.ts | sed -n '1,160p'" in /Users/xiaoxu/Projects/quidproquo
 succeeded in 0ms:
     1	name: Preview
     2	
     3	on:
     4	  pull_request:
     5	    branches: [main]
     6	
     7	jobs:
     8	  preview:
     9	    runs-on: ubuntu-latest
    10	    permissions:
    11	      pull-requests: write
    12	    steps:
    13	      - uses: actions/checkout@v4
    14	
    15	      - uses: pnpm/action-setup@v4
    16	        with:
    17	          version: latest
    18	
    19	      - uses: actions/setup-node@v4
    20	        with:
    21	          node-version: 22
    22	          cache: pnpm
    23	
    24	      - run: pnpm install
    25	
    26	      - name: Lint
    27	        run: pnpm lint
    28	
    29	      - name: Build
    30	        run: pnpm build
    31	        env:
    32	          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    33	
    34	      - name: Deploy preview
    35	        id: deploy
    36	        uses: cloudflare/wrangler-action@v3
    37	        with:
    38	          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    39	          wranglerVersion: "4"
    40	          command: deploy --config dist/server/wrangler.json --env preview
    41	
    42	      - name: Comment preview URL
    43	        uses: actions/github-script@v7
    44	        with:
    45	          script: |
    46	            github.rest.issues.createComment({
    47	              issue_number: context.issue.number,
    48	              owner: context.repo.owner,
    49	              repo: context.repo.repo,
    50	              body: `🔍 Preview: ${{ steps.deploy.outputs.deployment-url }}`
    51	            })

 succeeded in 0ms:
     1	export const prerender = false;
     2	
     3	import type { APIRoute } from 'astro';
     4	import { env } from 'cloudflare:workers';
     5	import { runCrawlSync } from '../../../lib/crawl/sync';
     6	
     7	export const POST: APIRoute = async ({ request }) => {
     8	  // 驗證 secret
     9	  const secret = (env as unknown as { CRAWL_SECRET?: string }).CRAWL_SECRET;
    10	  if (!secret) {
    11	    return new Response(JSON.stringify({ error: 'CRAWL_SECRET not configured' }), {
    12	      status: 500,
    13	      headers: { 'Content-Type': 'application/json' },
    14	    });
    15	  }
    16	
    17	  const provided = request.headers.get('X-Crawl-Secret');
    18	  if (provided !== secret) {
    19	    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    20	      status: 401,
    21	      headers: { 'Content-Type': 'application/json' },
    22	    });
    23	  }
    24	
    25	  try {
    26	    const results = await runCrawlSync();
    27	    const totalChunks = results.reduce((sum, r) => sum + r.chunks, 0);
    28	    const errors = results.filter(r => r.error);
    29	
    30	    return new Response(
    31	      JSON.stringify({ ok: true, results, totalChunks, errors: errors.length }),
    32	      { headers: { 'Content-Type': 'application/json' } }
    33	    );
    34	  } catch (err) {
    35	    const message = err instanceof Error ? err.message : String(err);
    36	    return new Response(JSON.stringify({ ok: false, error: message }), {
    37	      status: 500,
    38	      headers: { 'Content-Type': 'application/json' },
    39	    });
    40	  }
    41	};

exec
/bin/zsh -lc "nl -ba package.json | sed -n '1,120p'" in /Users/xiaoxu/Projects/quidproquo
 succeeded in 0ms:
     1	{
     2	  "name": "quidproquo",
     3	  "type": "module",
     4	  "version": "0.0.1",
     5	  "engines": {
     6	    "node": ">=22.12.0"
     7	  },
     8	  "scripts": {
     9	    "dev": "astro dev",
    10	    "build": "node scripts/create-cron-stub.mjs && astro build && node scripts/create-cron-entry.mjs && node scripts/generate-og-images.mjs",
    11	    "deploy": "pnpm build && wrangler deploy --config dist/server/wrangler.json",
    12	    "preview": "astro preview",
    13	    "astro": "astro",
    14	    "lint": "oxlint src/ --ignore-pattern '*.astro'",
    15	    "check:references": "node scripts/check-post-references.mjs",
    16	    "sync": "tsx scripts/sync-to-d1.ts",
    17	    "sync:prod": "tsx scripts/sync-to-d1.ts --prod"
    18	  },
    19	  "dependencies": {
    20	    "@astrojs/cloudflare": "^13.1.0",
    21	    "@astrojs/mdx": "^5.0.0",
    22	    "@astrojs/rss": "^4.0.17",
    23	    "@astrojs/sitemap": "^3.7.1",
    24	    "@playwright/test": "^1.58.2",
    25	    "astro": "^6.0.3",
    26	    "mdast-util-to-string": "^4.0.0",
    27	    "playwright-extra": "^4.3.6",
    28	    "puppeteer-extra-plugin-stealth": "^2.11.2",
    29	    "typescript": "^5.9.3"
    30	  },
    31	  "devDependencies": {
    32	    "@astrojs/check": "^0.9.7",
    33	    "@fontsource/noto-sans-tc": "^5.2.9",
    34	    "@resvg/resvg-js": "^2.6.2",
    35	    "@types/node": "^25.4.0",
    36	    "gray-matter": "^4.0.3",
    37	    "oxlint": "^1.54.0",
    38	    "pagefind": "^1.4.0",
    39	    "satori": "^0.25.0",
    40	    "tsx": "^4.21.0"
    41	  }
    42	}

exec
/bin/zsh -lc "nl -ba src/lib/crawl/config.ts | sed -n '1,120p'" in /Users/xiaoxu/Projects/quidproquo
 succeeded in 0ms:
     1	// src/lib/crawl/config.ts
     2	
     3	export interface CrawlTarget {
     4	  name: string;                  // 顯示名稱（存入 source_name）
     5	  url: string;                   // 爬取起始 URL
     6	  includePatterns: string[];     // 只爬這些路徑（對應 options.includePatterns）
     7	  limit: number;                 // 最多爬幾頁（對應 API 的 limit 欄位）
     8	  render: boolean;               // 是否需要 JS 渲染（靜態文件設 false）
     9	}
    10	
    11	export const CRAWL_TARGETS: CrawlTarget[] = [
    12	  {
    13	    name: 'Cloudflare D1',
    14	    url: 'https://developers.cloudflare.com/d1/',
    15	    includePatterns: ['/d1/**'],
    16	    limit: 50,
    17	    render: false,
    18	  },
    19	  {
    20	    name: 'Cloudflare Workers',
    21	    url: 'https://developers.cloudflare.com/workers/',
    22	    includePatterns: ['/workers/**'],
    23	    limit: 100,
    24	    render: false,
    25	  },
    26	  {
    27	    name: 'Cloudflare Vectorize',
    28	    url: 'https://developers.cloudflare.com/vectorize/',
    29	    includePatterns: ['/vectorize/**'],
    30	    limit: 30,
    31	    render: false,
    32	  },
    33	  {
    34	    name: 'Astro Docs',
    35	    url: 'https://docs.astro.build/',
    36	    includePatterns: ['/en/guides/**', '/en/reference/**'],
    37	    limit: 80,
    38	    render: false,
    39	  },
    40	];
    41	
    42	// chunk 大小上限（約 500 tokens ≈ 2000 字元）
    43	export const MAX_CHUNK_CHARS = 2000;

exec
/bin/zsh -lc "nl -ba src/pages/rss.xml.ts | sed -n '1,120p'" in /Users/xiaoxu/Projects/quidproquo
 succeeded in 0ms:
     1	// src/pages/rss.xml.ts
     2	export const prerender = true;
     3	
     4	import rss from '@astrojs/rss';
     5	import { getCollection } from 'astro:content';
     6	import type { APIContext } from 'astro';
     7	
     8	export async function GET(context: APIContext) {
     9	  const posts = await getCollection('posts', ({ data }) =>
    10	    !data.draft && data.lang === 'zh-TW'
    11	  );
    12	  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
    13	  return rss({
    14	    title: 'quidproquo',
    15	    description: '技術、攀岩、衝浪、咖啡，以及其他一切。',
    16	    site: context.site ?? 'https://quidproquo.cc',
    17	    items: posts.map(post => ({
    18	      title: post.data.title,
    19	      pubDate: post.data.date,
    20	      description: post.data.tldr ?? post.data.description,
    21	      link: `/posts/${post.id}/`,
    22	    })),
    23	    customData: '<language>zh-TW</language>',
    24	  });
    25	}

exec
/bin/zsh -lc "nl -ba src/pages/posts/[...slug].astro | sed -n '1,260p'" in /Users/xiaoxu/Projects/quidproquo
 succeeded in 0ms:
zsh:1: no matches found: src/pages/posts/[...slug].astro

exec
/bin/zsh -lc "nl -ba wrangler.jsonc | sed -n '1,160p'" in /Users/xiaoxu/Projects/quidproquo
 succeeded in 0ms:
     1	{
     2	  "name": "quidproquo",
     3	  "account_id": "1ff43f0d4c3ad3bd98ce5ab767546a68",
     4	  "compatibility_date": "2026-03-10",
     5	  "routes": [
     6	    { "pattern": "quidproquo.cc", "custom_domain": true },
     7	    { "pattern": "www.quidproquo.cc", "custom_domain": true }
     8	  ],
     9	  "compatibility_flags": ["nodejs_compat"],
    10	  "triggers": {
    11	    "crons": ["0 2 * * SUN"]
    12	  },
    13	  "assets": {
    14	    "binding": "ASSETS",
    15	    "directory": "./dist"
    16	  },
    17	  "kv_namespaces": [{
    18	    "binding": "SESSION",
    19	    "id": "98171882182147d0b340b0b127c1e1cd"
    20	  }],
    21	  "d1_databases": [{
    22	    "binding": "DB",
    23	    "database_name": "quidproquo-db",
    24	    "database_id": "c6ae78f5-3d07-44b9-854d-eb439c6902b1"
    25	  }],
    26	  "vectorize": [{
    27	    "binding": "VECTORIZE_INDEX",
    28	    "index_name": "quidproquo-embeddings"
    29	  }],
    30	  "ai": {
    31	    "binding": "AI"
    32	  },
    33	  "r2_buckets": [{
    34	    "binding": "R2_IMAGES",
    35	    "bucket_name": "quidproquo-images"
    36	  }],
    37	  "env": {
    38	    "preview": {
    39	      "name": "quidproquo-preview"
    40	    }
    41	  }
    42	}

exec
/bin/zsh -lc "nl -ba src/utils/seriesNav.ts | sed -n '1,120p'" in /Users/xiaoxu/Projects/quidproquo
exec
/bin/zsh -lc "nl -ba src/plugins/remarkReadingTime.ts | sed -n '1,120p'" in /Users/xiaoxu/Projects/quidproquo
 succeeded in 0ms:
     1	// src/plugins/remarkReadingTime.ts
     2	import { toString } from 'mdast-util-to-string';
     3	import type { Root } from 'mdast';
     4	import type { VFile } from 'vfile';
     5	
     6	const WPM = 200;
     7	
     8	/**
     9	 * Remark plugin: counts words in markdown and injects
    10	 * `readingTime` (number of minutes) into frontmatter data.
    11	 * Accessible as `post.data.readingTime` via Content Layer.
    12	 */
    13	export function remarkReadingTime() {
    14	  return function (tree: Root, file: VFile) {
    15	    const text = toString(tree);
    16	    const words = text.trim().split(/\s+/).filter(Boolean).length;
    17	    const minutes = Math.max(1, Math.ceil(words / WPM));
    18	    // Astro Content Layer reads from file.data.astro.frontmatter
    19	    const fm = (file.data as Record<string, unknown>);
    20	    if (!fm.astro) fm.astro = {};
    21	    (fm.astro as Record<string, unknown>).frontmatter = {
    22	      ...((fm.astro as Record<string, unknown>).frontmatter as object),
    23	      readingTime: minutes,
    24	    };
    25	  };
    26	}

 succeeded in 0ms:
     1	// src/utils/seriesNav.ts
     2	import type { CollectionEntry } from 'astro:content';
     3	
     4	type Post = CollectionEntry<'posts'>;
     5	
     6	export interface SeriesNav {
     7	  name: string;
     8	  current: number;
     9	  total: number;
    10	  prev?: { slug: string; title: string };
    11	  next?: { slug: string; title: string };
    12	}
    13	
    14	/**
    15	 * Returns series navigation data if the post belongs to a series.
    16	 * Returns undefined if post has no series frontmatter.
    17	 */
    18	export function getSeriesNav(post: Post, allPosts: Post[]): SeriesNav | undefined {
    19	  if (!post.data.series) return undefined;
    20	  const { name, order } = post.data.series;
    21	  const seriesPosts = allPosts
    22	    .filter(p => p.data.series?.name === name)
    23	    .sort((a, b) => a.data.series!.order - b.data.series!.order);
    24	  const total = seriesPosts.length;
    25	  const prevPost = seriesPosts.find(p => p.data.series!.order === order - 1);
    26	  const nextPost = seriesPosts.find(p => p.data.series!.order === order + 1);
    27	  return {
    28	    name,
    29	    current: order,
    30	    total,
    31	    prev: prevPost ? { slug: prevPost.id, title: prevPost.data.title } : undefined,
    32	    next: nextPost ? { slug: nextPost.id, title: nextPost.data.title } : undefined,
    33	  };
    34	}

exec
/bin/zsh -lc "nl -ba 'src/pages/posts/[...slug].astro' | sed -n '1,260p'" in /Users/xiaoxu/Projects/quidproquo
 succeeded in 0ms:
     1	---
     2	// src/pages/posts/[...slug].astro
     3	export const prerender = true;
     4	
     5	import { getCollection, render } from 'astro:content';
     6	import PostLayout from '../../layouts/PostLayout.astro';
     7	import Icons from '../../components/Icons.astro';
     8	import { getRelatedPosts } from '../../utils/relatedPosts';
     9	import { getSeriesNav } from '../../utils/seriesNav';
    10	import { useTranslations, type Lang } from '../../i18n/utils';
    11	
    12	export async function getStaticPaths() {
    13	  const allPosts = await getCollection('posts', ({ data }) => !data.draft);
    14	  return allPosts.map(post => ({
    15	    params: { slug: post.id },
    16	    props: { post, allPosts },
    17	  }));
    18	}
    19	
    20	const { post, allPosts } = Astro.props;
    21	const { Content, headings } = await render(post);
    22	const lang = post.data.lang as Lang;
    23	const t = useTranslations(lang);
    24	
    25	const sortedPosts = allPosts
    26	  .filter(p => !p.data.draft && p.data.lang === lang)
    27	  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
    28	const currentIndex = sortedPosts.findIndex(p => p.id === post.id);
    29	const prevPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : undefined;
    30	const nextPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : undefined;
    31	
    32	const relatedPosts = getRelatedPosts(post, allPosts);
    33	const seriesNav = getSeriesNav(post, allPosts);
    34	const readingTime = post.data.readingTime ?? 1;
    35	const categoriesBase = lang === 'en' ? '/en/categories' : '/categories';
    36	const tagsBase = lang === 'en' ? '/en/tags' : '/tags';
    37	const dateStr = post.data.date.toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-TW', { year: 'numeric', month: 'short', day: 'numeric' });
    38	
    39	const ogImage = `${Astro.site ?? 'https://quidproquo.cc'}/og/${post.id}.png`;
    40	const siteUrl = Astro.site?.toString().replace(/\/$/, '') ?? 'https://quidproquo.cc';
    41	const postUrl = `${siteUrl}/posts/${post.id}`;
    42	
    43	const blogPostingLD = {
    44	  '@context': 'https://schema.org',
    45	  '@type': 'BlogPosting',
    46	  headline: post.data.title,
    47	  description: post.data.description ?? post.data.tldr ?? '',
    48	  image: ogImage,
    49	  datePublished: post.data.date.toISOString(),
    50	  author: {
    51	    '@type': 'Person',
    52	    name: 'xiaoxu',
    53	    url: siteUrl,
    54	  },
    55	  publisher: {
    56	    '@type': 'Organization',
    57	    name: 'quidproquo',
    58	    url: siteUrl,
    59	  },
    60	  mainEntityOfPage: {
    61	    '@type': 'WebPage',
    62	    '@id': postUrl,
    63	  },
    64	  keywords: post.data.tags.join(', '),
    65	};
    66	
    67	const breadcrumbLD = {
    68	  '@context': 'https://schema.org',
    69	  '@type': 'BreadcrumbList',
    70	  itemListElement: [
    71	    {
    72	      '@type': 'ListItem',
    73	      position: 1,
    74	      name: lang === 'en' ? 'Home' : '首頁',
    75	      item: lang === 'en' ? `${siteUrl}/en` : siteUrl,
    76	    },
    77	    {
    78	      '@type': 'ListItem',
    79	      position: 2,
    80	      name: post.data.category,
    81	      item: `${siteUrl}${categoriesBase}/${post.data.category}`,
    82	    },
    83	    {
    84	      '@type': 'ListItem',
    85	      position: 3,
    86	      name: post.data.title,
    87	      item: postUrl,
    88	    },
    89	  ],
    90	};
    91	---
    92	<PostLayout
    93	  title={post.data.title}
    94	  description={post.data.description ?? post.data.tldr}
    95	  lang={lang}
    96	  ogImage={ogImage}
    97	  articleDate={post.data.date}
    98	  articleTags={post.data.tags}
    99	>
   100	  <Fragment slot="head">
   101	    <script type="application/ld+json" set:html={JSON.stringify(blogPostingLD).replace(/</g, '\\u003c')} />
   102	    <script type="application/ld+json" set:html={JSON.stringify(breadcrumbLD).replace(/</g, '\\u003c')} />
   103	  </Fragment>
   104	
   105	  <!-- Hero Section (like DJ MYG) -->
   106	  <div class="hero">
   107	    <div class="hero-content">
   108	      <h1>{post.data.title}</h1>
   109	      <div class="hero-meta">
   110	        <span class="hero-meta-item">
   111	          <Icons name="clock" size={14} />
   112	          {dateStr}
   113	        </span>
   114	        <span class="hero-meta-item">
   115	          <Icons name="clock" size={14} />
   116	          {readingTime} {t('post.reading-time')}
   117	        </span>
   118	      </div>
   119	    </div>
   120	    <div class="hero-wave">
   121	      <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
   122	        <path d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z" fill="var(--bg-page)"/>
   123	      </svg>
   124	    </div>
   125	  </div>
   126	
   127	  <article>
   128	    <!-- Breadcrumb (like DJ MYG) -->
   129	    <div class="breadcrumb">
   130	      <a href={lang === 'en' ? '/en' : '/'} class="breadcrumb-link">
   131	        <Icons name="chevron-left" size={11} />
   132	        {t('nav.home')}
   133	      </a>
   134	      <span class="breadcrumb-sep">&rsaquo;</span>
   135	      <a href={`${categoriesBase}/${post.data.category}`} class="breadcrumb-cat">
   136	        {post.data.category}
   137	      </a>
   138	    </div>
   139	
   140	    <!-- TL;DR -->
   141	    {post.data.tldr && (
   142	      <div class="tldr">
   143	        <span class="tldr-label">TL;DR</span>
   144	        {post.data.tldr}
   145	      </div>
   146	    )}
   147	
   148	    <!-- Tags -->
   149	    {post.data.tags.length > 0 && (
   150	      <div class="tags">
   151	        {post.data.tags.map(tag => (
   152	          <a href={`${tagsBase}/${tag}`} class="tag-pill">#{tag}</a>
   153	        ))}
   154	      </div>
   155	    )}
   156	
   157	    <!-- TOC -->
   158	    {headings.length > 0 && (
   159	      <div class="toc">
   160	        <div class="toc-header">
   161	          <Icons name="list" size={14} />
   162	          <span>{t('post.toc')}</span>
   163	        </div>
   164	        <ol>
   165	          {headings.filter(h => h.depth === 2).map(h => (
   166	            <li>
   167	              <a href={`#${h.slug}`}>{h.text}</a>
   168	              {headings.filter(sub => {
   169	                if (sub.depth !== 3) return false;
   170	                const h2idx = headings.findIndex(x => x.slug === h.slug);
   171	                const subidx = headings.findIndex(x => x.slug === sub.slug);
   172	                if (subidx < h2idx) return false;
   173	                const nextH2 = headings.findIndex((x, i) => x.depth === 2 && i > h2idx);
   174	                return nextH2 === -1 || subidx < nextH2;
   175	              }).length > 0 && (
   176	                <ol>
   177	                  {headings.filter(sub => {
   178	                    if (sub.depth !== 3) return false;
   179	                    const h2idx = headings.findIndex(x => x.slug === h.slug);
   180	                    const subidx = headings.findIndex(x => x.slug === sub.slug);
   181	                    if (subidx < h2idx) return false;
   182	                    const nextH2 = headings.findIndex((x, i) => x.depth === 2 && i > h2idx);
   183	                    return nextH2 === -1 || subidx < nextH2;
   184	                  }).map(sub => (
   185	                    <li><a href={`#${sub.slug}`}>{sub.text}</a></li>
   186	                  ))}
   187	                </ol>
   188	              )}
   189	            </li>
   190	          ))}
   191	        </ol>
   192	      </div>
   193	    )}
   194	
   195	    <!-- Series nav -->
   196	    {seriesNav && (
   197	      <div class="series-box">
   198	        <div class="series-header">
   199	          <Icons name="book-open" size={14} />
   200	          <span>{t('post.series')}: {seriesNav.name} ({seriesNav.current} / {seriesNav.total})</span>
   201	        </div>
   202	        <div class="series-nav">
   203	          {seriesNav.prev ? (
   204	            <a href={`/posts/${seriesNav.prev.slug}`} class="series-prev">
   205	              <Icons name="chevron-left" size={12} />
   206	              {seriesNav.prev.title}
   207	            </a>
   208	          ) : <span />}
   209	          {seriesNav.next && (
   210	            <a href={`/posts/${seriesNav.next.slug}`} class="series-next">
   211	              {seriesNav.next.title}
   212	              <Icons name="chevron-right" size={12} />
   213	            </a>
   214	          )}
   215	        </div>
   216	      </div>
   217	    )}
   218	
   219	    <!-- Content -->
   220	    <div class="content">
   221	      <Content />
   222	    </div>
   223	
   224	    <!-- Prev / Next -->
   225	    {(prevPost || nextPost) && (
   226	      <nav class="post-nav">
   227	        {prevPost ? (
   228	          <a href={`/posts/${prevPost.id}`} class="post-nav-prev">
   229	            <span class="post-nav-label">
   230	              <Icons name="chevron-left" size={13} />
   231	              {t('post.prev')}
   232	            </span>
   233	            <span class="post-nav-title">{prevPost.data.title}</span>
   234	          </a>
   235	        ) : <span />}
   236	        {nextPost && (
   237	          <a href={`/posts/${nextPost.id}`} class="post-nav-next">
   238	            <span class="post-nav-label">
   239	              {t('post.next')}
   240	              <Icons name="chevron-right" size={13} />
   241	            </span>
   242	            <span class="post-nav-title">{nextPost.data.title}</span>
   243	          </a>
   244	        )}
   245	      </nav>
   246	    )}
   247	
   248	    <!-- Related articles -->
   249	    {relatedPosts.length > 0 && (
   250	      <section class="related">
   251	        <h3>
   252	          <Icons name="link" size={14} />
   253	          {t('post.related')} · #{post.data.tags[0]}
   254	        </h3>
   255	        <div class="related-list">
   256	          {relatedPosts.map(p => (
   257	            <a href={`/posts/${p.id}`} class="related-item">
   258	              <span class="related-title">{p.data.title}</span>
   259	              <span class="related-time">
   260	                <Icons name="clock" size={11} />

codex
**主要問題**

1. 高優先度：TODO 有不少「已做過或已半完成」的項目還被列成待辦，會直接扭曲排序。[docs/TODO.md](/Users/xiaoxu/Projects/quidproquo/docs/TODO.md:64) 把 reading time、series nav、RSS、sitemap、OG、Pagefind 都列在 blog redesign 未完成清單，但 repo 內已有 [astro.config.mjs](/Users/xiaoxu/Projects/quidproquo/astro.config.mjs:12)、[src/plugins/remarkReadingTime.ts](/Users/xiaoxu/Projects/quidproquo/src/plugins/remarkReadingTime.ts:1)、[src/utils/seriesNav.ts](/Users/xiaoxu/Projects/quidproquo/src/utils/seriesNav.ts:1)、[src/pages/rss.xml.ts](/Users/xiaoxu/Projects/quidproquo/src/pages/rss.xml.ts:1)、[src/pages/posts/[...slug].astro](/Users/xiaoxu/Projects/quidproquo/src/pages/posts/%5B...slug%5D.astro:32)。這份清單應先做一次「去重與改狀態」，不然執行時會重工。

2. 高優先度：爬蟲整合也有過時項目。[docs/TODO.md](/Users/xiaoxu/Projects/quidproquo/docs/TODO.md:154) 還列「實作 `/api/crawl/sync` endpoint」與「設定 Cron Trigger」，但 [src/pages/api/crawl/sync.ts](/Users/xiaoxu/Projects/quidproquo/src/pages/api/crawl/sync.ts:1) 已存在，且 [wrangler.jsonc](/Users/xiaoxu/Projects/quidproquo/wrangler.jsonc:10) 已有 cron。這類項目應改成「驗證穩定性 / 補增量更新 / 補監控」，不是再列成 implementation。

3. 高優先度：依賴順序有一處明顯反了。你把「補 213 篇 `type`」放在 [docs/TODO.md](/Users/xiaoxu/Projects/quidproquo/docs/TODO.md:54)，又把「`type` 改 required」放在 [docs/TODO.md](/Users/xiaoxu/Projects/quidproquo/docs/TODO.md:80)，方向是對的，但還缺一個中間步驟：批次回填腳本、人工抽樣規則、失敗回滾方案。因為目前 schema 還是 optional，[src/content.config.ts](/Users/xiaoxu/Projects/quidproquo/src/content.config.ts:17)，一旦直接改 required，build 會先炸。

4. 高優先度：文件開頭說「所有進階技術都必須能關掉、要有 A/B 比較」，但 feature flag 與 shadow mode 被排到 P2，[docs/TODO.md](/Users/xiaoxu/Projects/quidproquo/docs/TODO.md:6)、[docs/TODO.md](/Users/xiaoxu/Projects/quidproquo/docs/TODO.md:139)。同時前面已經排了 deterministic validator、critic 降級、adaptive routing、reranker、MMR 等。這違反你自己的設計鐵律。正確順序應該是：先做 baseline、先做 flag、先做觀測，再加複雜策略。

5. 中高優先度：`MAX_CHUNK_CHARS` 改 1500 不是單點改設定而已。[docs/TODO.md](/Users/xiaoxu/Projects/quidproquo/docs/TODO.md:36) 指向 [src/lib/crawl/config.ts](/Users/xiaoxu/Projects/quidproquo/src/lib/crawl/config.ts:42)，但 TODO 沒寫到後續必須重新 crawl、重新 chunk、重新 embed；否則 D1 / Vectorize 裡舊資料還是 2000-char 切法，程式碼與索引狀態會分裂。

6. 中高優先度：CI 守門應該比 pre-commit 更前面。現在 `check:references` script 確實存在於 [package.json](/Users/xiaoxu/Projects/quidproquo/package.json:15)，但 deploy/preview workflow 都只跑 `pnpm lint`，[.github/workflows/deploy.yml](/Users/xiaoxu/Projects/quidproquo/.github/workflows/deploy.yml:24)、[.github/workflows/preview.yml](/Users/xiaoxu/Projects/quidproquo/.github/workflows/preview.yml:26)。所以 P0 裡真正該先做的是 CI gate；pre-commit 只是第二層，因為 hook 可被略過。

7. 中優先度：`CLAUDE.md` 被放進 P0，我覺得偏高。它對 agent 協作有價值，但對目前最實際的線上風險沒有直接止血效果；相較之下，404、CI、tag 統一、英搜頁都更直接。這項應降到 P1，除非你最近的主要痛點真的是 agent 反覆迷路。

8. 中優先度：RAG Phase 1 被塞進太多「產品功能」與「研究功能」。從 [docs/TODO.md](/Users/xiaoxu/Projects/quidproquo/docs/TODO.md:100) 到 [docs/TODO.md](/Users/xiaoxu/Projects/quidproquo/docs/TODO.md:123) 混著基礎聊天、推薦、TL;DR、自動 tag、新鮮度偵測、互動詞彙表、SEO agent。這些不是同一波。建議拆成：
   - Phase 1A：可用聊天系統
   - Phase 1B：檢索品質改善
   - Phase 1C：內容營運自動化
   否則驗收標準會失焦。

9. 中優先度：TODO 缺少「最小驗收基線」。目前有 RAGAS / Golden Dataset，但放到 P3，[docs/TODO.md](/Users/xiaoxu/Projects/quidproquo/docs/TODO.md:169)。這太晚了。沒有 baseline query set、延遲預算、成本預算、錯誤率預算，就無法判斷 HyDE / reranker / critic 到底是在改善還是在加負擔。

10. 中優先度：效能與無障礙項目缺少量化驗收。像 LCP、CLS、對比度、focus-visible 都是對的方向，但 TODO 沒寫「用哪個工具量、目標值是多少、在哪個頁面驗」。這會讓它們很容易長期停留在「感覺有做」。

11. 低到中優先度：英文搜尋頁是合理且應該保留在前段。因為 [src/pages/search.astro](/Users/xiaoxu/Projects/quidproquo/src/pages/search.astro:6) 確實硬編碼 `zh-TW`，且 `src/pages/en/search.astro` 目前不存在，這項是低成本真缺口。

12. 低到中優先度：RSS `<author>` 是真缺口，但不該跟「RSS Feed 建立」混在一起。RSS 已存在，[src/pages/rss.xml.ts](/Users/xiaoxu/Projects/quidproquo/src/pages/rss.xml.ts:13) 只是 items 沒 author。這類項目應標成「補 metadata」，不是「做 RSS」。

**建議重排**

我會改成這樣：

1. 新的 P0：`check:references` 進 CI、tag 統一、404、英文搜尋頁、chunk 參數調整加上全量重建計畫、把 TODO 已完成項目清掉或改狀態。
2. 新的 P1：批次補 `type`、補 `tldr`、完成 `type` backfill 驗證後再改 schema required、字型/圖片/a11y 的量化修正。
3. 新的 P2：RAG 最小可用版，只做 embed pipeline、search tools、`normalize_results`、SSE chat、最基本 tracing。
4. 新的 P2.5：先補 feature flag、baseline eval、shadow mode，再加 critic、reranker、adaptive routing、MMR。
5. 新的 P3：內容營運型 AI 功能與 GraphRAG、知識地圖、學習路徑。

**遺漏風險**

- 缺 bulk frontmatter 修改的回滾策略。
- 缺 RAG 成本/延遲/品質 baseline。
- 缺「重新 chunk / re-embed」這種資料重建任務。
- 缺 production smoke test 清單，現在只有 build gate，沒有明確的 post-deploy 驗證。
- 缺每個大型 epic 的 definition of done，尤其是 blog redesign 與 RAG。

整體判斷：方向大致正確，但目前這份 TODO 比較像「議題池」不是可執行的 roadmap。先去重、補依賴、把觀測與回退前移，才會變成能真的照著做的清單。
tokens used
69,280

```

## Concise summary

Provider completed successfully. Review the raw output for details.

## Action items

- Review the response and extract decisions you want to apply.
- Capture follow-up implementation tasks if needed.
