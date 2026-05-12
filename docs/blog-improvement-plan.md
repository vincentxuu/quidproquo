# Quidproquo 部落格改進規劃

> 根據 227 篇文章與網站架構完整分析，以及 30+ 篇 AI Agent/RAG 文章交叉審查產出。
> 進度更新：2026-05-12。此文件保留「為什麼要做」與完整設計脈絡；實際執行狀態以 `docs/TODO.md` 為主。

**設計鐵律：每個加上去的技術都必須能關掉。**

本文件是工具箱目錄，不是全部都要用的清單。所有進階技術（HyDE、Multi-query、Reranker、Semantic Cache、Critic、LangGraph...）都必須：

1. **有 feature flag** — 可在 `/admin/agent` 單獨開關
2. **有 A/B 比較機制** — 開啟 vs 關閉的品質差異可量化
3. **只為觀測到的失敗而加** — 先用最簡單方式跑，量化失敗模式，再針對性加工具
4. **隨時可拆掉** — 不引入移除成本高的耦合依賴

> 「Start simple, only add complexity for specific failure modes」— Google Multi-Agent Patterns
> 「你今天寫的 harness 邏輯，明天可能因為模型升級而過時」— Bitter Lesson

---

## 一、現況快速統計

### 2026-05-12 進度快照

| 項目 | 狀態 | 備註 |
|------|------|------|
| 內部斷連結修復 | ✅ 已完成 | 已修正既有斷連結，並加上 `pnpm check:references` 的 CI / pre-commit gate |
| 404 頁面 | ✅ 已完成 | `src/pages/404.astro` 已存在 |
| 英文搜尋頁 | ✅ 已完成 | `src/pages/en/search.astro` 已存在 |
| 英文首頁 about 區塊 | ✅ 已完成 | `src/pages/en/index.astro` 已補 |
| 字型 preload + `font-display: swap` | ✅ 已完成 | 已加在 `src/layouts/PostLayout.astro` |
| Skip Navigation / `:focus-visible` | ✅ 已完成 | 基本無障礙樣式已補 |
| RSS `<author>` | ✅ 已完成 | 中英 RSS 皆已補 |
| `CLAUDE.md` | ✅ 已完成 | 根目錄文件已建立 |
| `progress.txt` | ✅ 已完成 | 作為 session memory 使用中 |
| session-start hook | ✅ 已完成 | `scripts/session-start.mjs` + `.claude/settings.json` |
| pre-commit + references CI gate | ✅ 已完成 | `simple-git-hooks` 與 workflow 已接上 |
| 互動詞彙表 | ✅ 已完成 | hover/focus 詞彙卡、初學/進階切換、D1 查詢統計；見 `docs/interactive-glossary.md` |
| `type` backfill + required schema | ⏳ 未完成 | `src/content.config.ts` 仍為 optional |
| Post Evaluator | ✅ 已完成 | post skill 已要求跑 `pnpm check:post-quality` + `pnpm check:references` |
| 相關文章演算法升級 | ⏳ 部分完成 | series nav 已接上；related posts 權重演算法仍待升級 |

| 指標 | 數值 |
|------|------|
| 總文章數 | 227 篇 |
| 斷連結數 | 49 個（影響約 40 篇文章） |
| 草稿數 | 17 篇（全為 Claude Code deep-dive 系列） |
| 缺 type 欄位 | 213 篇（94%） |
| 缺 series 欄位 | 199 篇（88%） |
| 缺 tldr | 7 篇 |
| Tag 不一致 | ai-agent vs ai-agents（35 篇） |

---

## 二、網站基礎修復

### 2.1 內部斷連結修復

- 狀態：✅ 已完成。修復結果已納入 `pnpm check:references`，並接到 CI 與 pre-commit
- 49 個內部連結指向不存在的文章（未撰寫或仍為草稿）
- 重災區：`ai/2026-04-01-agent-cli-guidelines.md` 有 10 個斷連結
- 行動：移除或標註「即將推出」，避免讀者點擊後 404

### 2.2 建立 404 錯誤頁面

- 狀態：✅ 已完成。`/src/pages/404.astro` 已建立
- 建立 `/src/pages/404.astro`，提供搜尋框與熱門文章推薦

### 2.3 type 欄位補齊

- 狀態：⏳ 未完成。schema 仍是 optional，需先做 backfill 與抽樣驗證
- 僅約 14 篇有明確標示 type（debug / deep-dive / guide / project）
- 批次補上 type 欄位，提升內容分類導航體驗
- Frontmatter type 欄位改為 required（用 schema 強制）

### 2.4 Tag 命名統一

- 狀態：✅ 已完成
- `ai-agent`（21 篇）vs `ai-agents`（14 篇）統一為 `ai-agent`（單數形式）

### 2.5 英文版補強

- 狀態：✅ 已完成。`/src/pages/en/search.astro` 與英文首頁 about 區塊都已補
- `/src/pages/search.astro` 硬編碼 `lang="zh-TW"`，需建立 `/src/pages/en/search.astro` 或動態偵測語系
- 英文首頁缺少「關於」區塊，在 `/src/pages/en/index.astro` 補上對應的 about section

### 2.6 效能優化

- 狀態：✅ 已完成。字型 preload、lazy loading、Markdown 圖片尺寸欄位已補
- **字型載入**：加入 `<link rel="preload">` 預載字型 + `font-display: swap`
- **圖片 CLS**：在 `astro.config.mjs` 啟用 `astro:assets`，Markdown 圖片加入 `loading="lazy"` 和尺寸屬性

### 2.7 無障礙性

- 狀態：🟡 部分完成。Skip Navigation 與 `:focus-visible` 已完成，仍待正式驗證色彩對比與 axe
- 補上「跳至主要內容」連結（Skip Navigation）
- 加入 `:focus-visible` 鍵盤導航樣式
- 驗證 `--text-muted: #999` 色彩對比是否符合 WCAG AA

### 2.8 相關文章演算法升級

- 狀態：🟡 部分完成。series nav 已經接到文章頁，但 related posts 權重計算尚未升級
- 現況：`/src/utils/relatedPosts.ts` 僅用 tag 重疊度
- 目標：加權計算（40% tag + 30% 分類 + 20% 時近性 + 10% 同系列）+ fallback

### 2.9 內容組織

- 狀態：🟡 部分完成。RSS `<author>` 已補；series、tldr backfill、草稿整理仍待處理
- 將高度相關的文章群組化為正式 series（目前 88% 無 series 欄位）
- 為所有 deep-dive 類文章補上 tldr 欄位
- RSS Feed 加入 `<author>` 標籤
- 處理 17 篇草稿文章（優先完成或暫時移除引用）

---

## 三、Harness 基礎建設

> 來自文章原則：「Intelligence without infrastructure is just a demo」

### 3.1 Repository as Single Source of Truth

> 「Repository 是 agent 唯一的真相來源。不假設外部知識。Agent 需要的一切都應該存在 repo 裡。」

| 項目 | 現況 | 行動 |
|------|------|------|
| 專案架構文件 | ✅ 已建立根目錄 `CLAUDE.md` | 持續維護，讓 agent 能快速理解專案 |
| 技術棧說明 | ❌ 散落在各 skill | Astro 6 + Cloudflare Workers + D1 等資訊沒有集中處 |
| 開發流程文件 | ⚠️ 部分在 OpenSpec skills | OpenSpec 本身需要先學習才能用 |
| RAG 設計文件 | ✅ docs/superpowers/specs/ | 完整且詳細 |
| 內容 Schema | ✅ src/content.config.ts | 型別定義清楚 |
| Agent 進度追蹤 | ✅ `progress.txt` 已建立 | 持續更新目前狀態、已完成項目、下一步 |

> 「claude-progress.txt 是整個架構中最優雅的部分... 最低成本的 episodic memory 實作——不需要 vector database，一個文字檔就夠了。」這點已補上，目前重點已從「建立機制」轉為「保持更新品質」。

### 3.2 Agent-Readable Code

> 「程式碼要 agent-readable，不只是 human-readable。Agent 沒有你腦中的隱性知識，它只看得到寫出來的東西。」

| 項目 | 現況 | 行動 |
|------|------|------|
| 程式碼註解 | ⚠️ 偏少 | 大部分 .astro 和 .ts 檔補上檔案層級說明 |
| 目錄結構說明 | ❌ 缺失 | 建立 `src/README.md` 或目錄導覽 |
| 命名一致性 | ✅ | 檔案命名規則清楚（YYYY-MM-DD-slug.md） |
| 型別定義 | ✅ | content.config.ts 提供完整 schema |
| 隱性知識外顯 | ❌ 缺失 | 設計決策理由未寫在 repo 中（為什麼 chunk size 是 2000？為什麼用 BGE-large？） |

核心問題：設計文件（rag-design.md）記錄了「做什麼」，但很少記錄「為什麼這樣做」。一個新 agent（或新開發者）看不出決策背景。應用 ADR（Architecture Decision Records）格式記錄每個重要決策的理由。

### 3.3 Architecture Constraints（Linter 是法律，不是建議）

| 項目 | 現況 | 行動 |
|------|------|------|
| Pre-commit hook | ✅ 已加入 | 目前執行 `pnpm lint` + `pnpm check:references` |
| `check-post-references.mjs` | ✅ 已在 CI | 持續當第一層品質閘門 |
| Commit message 規範 | ❌ 沒有 | 加入 commitlint 或格式驗證 |
| Frontmatter type 欄位 | ⚠️ optional | 改為 required |

### 3.4 Progressive Capability Grants（漸進授權）

> 「自主權漸進授予。設定階段和閘門，在每個階段驗證後才開放下一步。」

| 機制 | 現況 | 問題 |
|------|------|------|
| OpenSpec 工作流 | ✅ 有階段和閘門 | Proposal → Specs → Design → Tasks → Apply → Verify → Archive |
| 但... | ⚠️ 流程是「fluid, non-phase-locked」 | 可以跳過階段——這與漸進授予矛盾 |
| RAG 開發 | ❌ 沒有階段閘門 | Phase 1/2/3 只是規劃，沒有程式化的閘門控制 |
| 文章發布 | ❌ 沒有品質閘門 | Draft → 發布之間沒有自動化檢查 |

行動：
- RAG 開發加入程式化閘門（每個 Phase 完成後跑自動化驗證才能進入下一階段）
- 文章發布加入品質閘門（Draft 通過 Evaluator 才能設為 `draft: false`）

### 3.5 Lifecycle Hooks（啟動儀式）

Anthropic 的啟動儀式包含 6 步：

1. 跑 `pwd` 確認目錄
2. 讀 `git log` 和 `claude-progress.txt`
3. 選最高優先級任務
4. 跑 `init.sh` 啟動 dev server
5. 做 smoke test
6. 才開始寫新功能

專案現況：🟡 已有 `session-start hook`。目前 `scripts/session-start.mjs` 會顯示最新 commit、讀 `progress.txt`、並跑 `pnpm lint`；smoke test 仍未補。

行動：建立 session-start hook：
1. 自動跑 `pnpm lint` 驗證環境
2. 讀取 `progress.txt` 了解目前狀態
3. Smoke test 確認開發環境正常

### 3.6 Generator-Evaluator（內容品質閘門）

> 「讓一個 agent 同時當運動員和裁判，它會傾向對自己寬容。調教一個獨立的 evaluator 讓它嚴格挑剔，遠比讓 generator 自我批判來得容易。」

RAG 設計：✅ Writer + Critic 是兩個獨立節點。
內容生產流程：🟡 已有 Evaluator 腳本與 skill 流程，但尚未強制成 pre-commit gate。

行動：Post skill 加入獨立 Evaluator 步驟，發文前自動檢查：

- Frontmatter 完整性（type、tldr、description）
- 內部連結有效性（避免再增加斷連結）
- Tag 一致性（ai-agent vs ai-agents）
- 標題結構（H2/H3 層級）
- 閱讀時間估算

目前實作：

- post skill 明確要求先跑 `pnpm check:post-quality <file>`
- 再跑 `pnpm check:references <file>`
- `scripts/check-post-quality.mjs` 會檢查 frontmatter、內部連結、tag 一致性、標題結構

待補強：

- 若要變成真正的「強制閘門」，仍可再接到 commit 或發布流程

### 3.7 Context Durability（Context 耐久性）

> 「隨著 agent 運行時間越長，context 的品質會逐漸退化——不是 context window 不夠大，而是累積的資訊開始干擾決策。」

專案現況：❌ 沒有 context 健康管理。

| 問題 | 說明 |
|------|------|
| 沒有自動壓縮觸發 | 長 session 的 context 持續膨脹 |
| 沒有 checkpoint 機制 | 無法回到已知良好狀態 |
| 長 session context rot 無法偵測 | Agent 可能在品質退化的 context 中做決策 |

行動：
- RAG Chat 的 Progressive Summarization 用動態門檻（`model_context_window * 0.7`），而非固定 8000 tokens
- 對話超過 threshold 時自動摘要舊訊息
- 長 session 自動存檔 checkpoint

### 3.8 Model Drift Detection（模型漂移偵測）

> 「模型在第 100 步之後開始偏離初始指令，harness 需要偵測 drift。」
> 「Harness 會成為偵測 drift 的主要工具——在每個階段檢查模型是否還在遵循原始意圖。」

專案現況：❌ 完全沒有。

- RAG 設計的 Research Agent 有 `max_iterations: 5`，但沒有 drift 偵測
- 如果 Agent 在第 3-4 次工具呼叫後偏離意圖，目前無法發現
- 沒有階段性意圖對齊檢查、沒有 drift 指標

行動：
- Critic 節點增加「與原始查詢意圖對齊度」檢查（不只驗證 grounding）
- 建立 drift 偵測指標，長期追蹤

### 3.9 Harness 改進優先級時程表

#### 立即（本週）

| # | 項目 | 狀態 | 理由 |
|---|------|------|------|
| H1 | 建立根目錄 CLAUDE.md | ✅ 已完成 | 「Repository as Truth」原則。專案概覽、技術棧、開發流程、命名規範 |
| H2 | 建立 progress.txt | ✅ 已完成 | 最推崇的機制。記錄目前狀態、已完成項目、下一步 |
| H3 | 加 pre-commit hook（lint + reference check） | ✅ 已完成 | 「Linter 是法律」原則。不讓斷連結和 lint 錯誤進入 repo |
| H4 | 把 `check-post-references.mjs` 加入 CI | ✅ 已完成 | 49 個斷連結是「prompt 是建議」的直接後果 |

#### 短期（1-2 週）

| # | 項目 | 狀態 | 理由 |
|---|------|------|------|
| H5 | Session-start hook：自動跑 `pnpm lint` + 讀 `progress.txt` | ✅ 已完成 | Anthropic 啟動儀式 |
| H6 | Post skill 加 Evaluator 步驟 | ✅ 已完成 | post skill + `scripts/check-post-quality.mjs` / `pnpm check:references` 已接上手動流程 |
| H7 | 記錄設計決策理由（ADR 格式） | ⏳ 未完成 | Agent-readable 原則。為什麼用 BGE-large？為什麼 chunk 1500？ |
| H8 | Frontmatter type 欄位改為 required | ⏳ 未完成 | 用 schema 強制，不用 prompt 請求 |

#### 中期（月度）

| # | 項目 | 理由 |
|---|------|------|
| H9 | RAG pipeline 每個技術加 feature flag | Bitter Lesson。允許拆掉「聰明」的部分 |
| H10 | A/B 比較機制（Shadow Mode 提前到 P2） | 壓力測試每個「模型做不到」的假設 |
| H11 | Context checkpoint 系統 | Context Durability。長 session 自動摘要存檔 |
| H12 | 工具描述品質標準化 | Tool Registry 原則。每個工具有 when/when-not/format 說明 |

---

## 四、AI Agent 應用於部落格

### 已有基礎設施

| 已就緒 | 尚未實作 |
|--------|----------|
| Crawl Pipeline（Browser Rendering → D1） | Hybrid Search 的 BM25 + RRF 融合 |
| D1 posts + post_chunks + doc_chunks 表 | 語意快取 / Reranker |
| Vectorize Index 已建立（1024 維） | Shadow A/B / feature flags |
| Workers AI 綁定（BGE-large） | Critic 的 answer-relevance / drift 偵測 |
| `/api/chat` SSE 端點、Graph、Planner/Research/Writer/Validation/Critic/Fallback/Related 節點已存在 | 多輪對話 checkpointer |
| Chat UI 元件（`/chat` + React islands）已存在 | |
| Embedding Pipeline 已存在，仍需確認 re-embed / production 驗證 | |
| 完整 RAG 設計文件 | |

### 4.1 智慧語意搜尋

```
使用者查詢 → Query Rewriting → 並行搜尋
                                 ├─ Vectorize (語意)
                                 └─ D1 FTS5 (關鍵字)
                              → RRF 融合排序
                              → BGE-Reranker 重排
                              → 回傳結果
```

- 現有資源：Vectorize index、embedding pipeline、`/api/chat` SSE、blog/docs search tools 均已存在
- 仍缺：D1 FTS5 BM25 查詢、RRF 融合、reranker

### 4.2 AI 驅動的相關文章推薦

取代純 Tag 匹配：

```
當前文章 embedding → Vectorize 最近鄰查詢
                   → 過濾同篇 + 同 series
                   → 結合 tag 權重 + 時間衰減
                   → 回傳 top 5
```

最低成本、最高可見度的改善。

### 4.3 自動內容品質檢查（Generator-Evaluator 模式）

```
新文章 markdown → Evaluator Agent 檢查：
  ├─ Frontmatter 完整性
  ├─ 內部連結有效性
  ├─ Tag 一致性
  ├─ 標題結構
  └─ 閱讀時間估算
→ 產出品質報告 + 自動修復建議
```

2026-05-12 狀態：已部分落地。post skill 會要求跑 `check-post-quality` + `check:references`；若要完全自動化，下一步是把它接到 commit / publish gate。

### 4.4 多語言翻譯工作流

```
中文原文 → Translator Agent（Claude Sonnet）
        → Cultural Reviewer Agent（慣用語、語境調整）
        → Native Checker Agent（語法、自然度）
        → 輸出英文版 + 翻譯品質評分
```

### 4.5 智慧 TL;DR 與摘要生成

```
全文 → Section Summarizer（各段摘要）
     → Progressive Compressor（漸進壓縮）
     → 輸出三層摘要：
       ├─ tldr（一句話）
       ├─ description（2-3 句）
       └─ executive summary（一段）
```

---

## 五、對話式部落格助手（RAG Chat）

### 5.1 架構全貌

2026-05-12 實際狀態：上線版本已有 Planner → Research → Normalize → Writer → Deterministic Validation → Critic → Fallback/Related 的基本圖；圖中的 D1 FTS5、RRF、answer-relevance、drift 偵測仍屬設計目標。

```
讀者提問
  │
  ▼
┌─────────┐
│ Planner  │ ← 意圖偵測 / 語言偵測 / 複雜度判斷
└────┬─────┘
     ▼
┌──────────┐    並行執行
│ Research  │───┬── search_blog_posts（Vectorize 語意搜尋）
│          │   ├── search_docs（外部文件搜尋）
│          │   ├── D1 FTS5（BM25 關鍵字搜尋）
│          │   └── get_post_detail（取完整文章）
└────┬─────┘
     ▼
┌────────────────┐
│ Normalize      │ ← metadata 解析 / 相關度評分 / lost-in-the-middle 重排
└────┬───────────┘
     ▼
┌─────────────────────┐
│ Deterministic        │ ← Markdown 語法 / Source URL 驗證 / 長度檢查
│ Validation           │   （Blueprint 模式，非 AI 節點）
└────┬────────────────┘
     ▼
┌─────────┐
│ Writer   │ ← 組合最終回答，每個論點附來源連結
└────┬─────┘
     ▼
┌─────────┐
│ Critic   │ ← grounding check + answer-relevance check + drift 偵測
│          │   信心 < 門檻 → Research 重試（max 2 次）
│          │   2 次仍不通過 → 降級：標註可能不完整，不再呼叫 LLM
└────┬─────┘
     ▼
┌──────────────┐
│ Related Posts │
└──────┬───────┘
       ▼
     回覆讀者（SSE 串流）
```

### 5.2 關鍵技術

#### Hybrid Search

| 路徑 | 技術 | 優勢 |
|------|------|------|
| 語意搜尋 | Vectorize + BGE-large（1024 維） | 理解「意思相近」的查詢 |
| 關鍵字搜尋 | D1 FTS5 / BM25 | 精確匹配專有名詞 |
| 融合 | RRF（Reciprocal Rank Fusion） | 結合兩者優勢 |
| 重排 | BGE-Reranker（Workers AI） | Cross-encoder 精排 |

#### Contextual Retrieval

嵌入前每個 chunk 前加文件脈絡：

```
"This chunk is from a blog post titled 'Multi-Agent RAG 協作架構'
 in category 'ai', published 2026-03-16."
+ 原始 chunk 內容
```

#### Critic 自我修正（CRAG 模式）

```
Writer 產出答案
  → Deterministic Validation 檢查 Markdown / URL / Mermaid
    → 通過後 Critic 驗證每個論點是否有 chunk 支撐
    → 信心 ≥ 門檻 → 放行
    → 信心 < 門檻 → Research 重試（更精確的 query）
    → 重試 2 次仍不足 → 標註「此主題超出部落格涵蓋範圍」+ 記錄到 Langfuse
```

#### SSE 串流回覆

```
event: agent_step    → "正在搜尋相關文章..."
event: agent_step    → "找到 8 個相關段落，組織回答中..."
event: token         → 逐字輸出回答
event: sources       → [{title, url, relevance}]
event: related       → [{title, url}]
event: done          → 結束
```

### 5.3 Normalize Results 節點（PostToolUse Hook）

Research 回傳原始 chunk 後，進入專門的後處理節點：

```
Research 回傳 chunks
  → 解析 JSON metadata（images、links）
  → 計算每個 chunk 的相關度分數（cosine similarity）
  → Lost-in-the-middle 重排（top-3 移到前後端）
  → 最高分 < 0.4 → 設定 needs_web_search = true（CRAG 觸發）
  → 寫入 state.search_results
```

CRAG 完整觸發邏輯（交叉審查修正後）：

```
零結果 → 漸進放寬 metadata filter（先移除次要 filter，保留核心）
       → 仍然零結果 → 擴大搜尋範圍
低分數 < 0.4 → Web search fallback
順序：先放寬 filter 重試 → 仍低分 → web search
```

### 5.4 Chat UI 介面設計

```
┌─────────────────────────────────────┐
│  quidproquo.cc/chat                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Bot: 你好！可以問我關於 RAG、│   │
│  │      AI Agent、技術開發的問題 │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ User: Context Engineering 跟 │   │
│  │       Prompt Engineering     │   │
│  │       差在哪？               │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Bot: 根據部落格文章分析...    │   │
│  │                              │   │
│  │ Prompt Engineering 專注在     │   │
│  │ 「措辭優化」，而 Context      │   │
│  │ Engineering 專注在「資訊管理」│   │
│  │ [來源 1]                     │   │
│  │                              │   │
│  │ 來源：                        │   │
│  │ 1. Context Engineering 指南   │   │
│  │ 2. 從 Prompt 到 Harness 演化  │   │
│  │                              │   │
│  │ 相關文章：                    │   │
│  │ - AI Agent 的三個核心支柱     │   │
│  │ - Phil Schmid: Agent Harness  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌──────────────────────┐ [Send]   │
│  │ 輸入你的問題...        │         │
│  └──────────────────────┘          │
│                                     │
│  訪客額度：3/5 次                   │
└─────────────────────────────────────┘
```

### 5.5 安全與限流

| 角色 | 驗證方式 | 額度 |
|------|----------|------|
| 站長 | Session Cookie（KV 存，7 天 TTL） | 無限 |
| 訪客 | IP 識別 | 每日 5 次 |
| 濫用偵測 | 尚未實作自動封鎖 | 目前只有每日配額限制 |

### 5.6 Agentic Enhancements（進階增強）

#### 新增 5 個專業 Agent 節點

| Agent | 觸發條件 | 功能 |
|-------|----------|------|
| Clarifier | Planner 判斷問題模糊 | 反問使用者以澄清需求（LangGraph interrupt） |
| Summarizer | 查詢含「摘要」「什麼是」 | 取完整文章做漸進式摘要 |
| Code Explainer | 查詢含程式碼區塊 | 偵測語言、逐步解釋、連結原文 |
| Diagram Agent | Planner 判斷需視覺化 | Mermaid 即時渲染 或 AI 圖片（Flux-1 → R2） |
| Related Posts | 每次回覆結束 | 用對話摘要查詢相關文章 |

#### 升級後的 Pipeline

```
Planner ─┬─→ Clarifier → [等使用者回答] → 重新 Plan
         └─→ Research ──┬─→ Normalize → Summarizer (條件)
              │         ├─→ Code Explainer (條件)
              │         └─→ Diagram Agent (條件)
              └── Abstract Search (並行)
                          → Writer → Critic ─┬─→ 重試 Research (max 2x)
                                             └─→ Related Posts → END
```

#### 進階 RAG 技術

| 技術 | 原理 | 效果 |
|------|------|------|
| HyDE | 先生成「假設性答案」→ 用它做 embedding 搜尋 | 模糊查詢檢索品質提升 |
| Multi-query | 一個問題改寫成 3 個變體 → 並行搜尋 → RRF 融合 | 覆蓋更多語意角度 |
| Reranker | Workers AI cross-encoder 重排 top-20 → top-5 | 精準度顯著提升 |
| Semantic Cache | cosine > 0.95 → 直接回傳快取答案 | 重複問題秒回，省 token |
| MMR | λ = 0.7 多樣性重排 | 避免重複資訊推薦 |
| Adaptive RAG | queryType 分類 → 條件性跳步 | 簡單查詢省資源 |

#### Semantic Cache 機制

```
新查詢 → embedding → 搜尋 VECTORIZE_CACHE
  → cosine > 0.95 → 命中！直接回傳（UI 標示 ⚡ cached）
  → cosine < 0.95 → 走完整 Pipeline → 完成後存入（TTL 24 小時）
```

#### D1 Checkpointer（多輪對話）

```sql
CREATE TABLE checkpoints (
  thread_id TEXT NOT NULL,
  checkpoint_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (thread_id, checkpoint_id)
);
```

- 多輪追問（系統記得前面聊什麼）
- thread_id 存 localStorage，重整不丟失
- Progressive Summarization：對話超過 70% context window 時自動摘要

#### Admin 管理後台

| 頁面 | 功能 |
|------|------|
| `/admin/embed` | Vectorize 狀態、chunking 參數、預覽、手動 re-embed |
| `/admin/crawl` | 爬取目標管理、觸發爬取、統計 |
| `/admin/settings` | 訪客額度、快取門檻、Agent 迭代上限、Critic 重試次數 |
| `/admin/agent` | 個別 Agent 開關、進階技術開關（HyDE、Reranker 等） |

### 5.7 Adaptive RAG queryType 路由

Planner 應將查詢分為 6 種類型，各自走不同執行路徑：

| queryType | 執行路徑 | 說明 |
|-----------|----------|------|
| simple | 輕量搜尋 → 輕量 LLM | 簡單事實查詢，跳過 HyDE/Multi-Query |
| complex | HyDE + Multi-Query → Rerank → 完整 Pipeline | 需要深度分析的複雜問題 |
| general-knowledge | 跳過檢索 → 直接 LLM | 與部落格內容無關的通識問題 |
| clarification | 生成選項 → 回傳使用者 | 問題模糊，需要澄清 |
| summary | 完整文章 → Summarizer Agent | 要求某篇文章的摘要 |
| code | 完整文章 → Code Explainer Agent | 要求解釋程式碼 |

Planner 輸出應增加 `complexity: 'simple' | 'medium' | 'complex'`，驅動條件性跳步，避免簡單查詢走完整 pipeline 浪費資源。

### 5.8 Prompt 風格指引（描述終態模式）

> Spotify 發現：「用描述終態（description-of-terminal-state）風格的 prompt，取代逐步指令（step-by-step instructions）。過度嚴格的逐步指令會導致 agent 在複雜多步驟任務上卡住。」

Agent prompt 應描述「成功的回答長什麼樣」而非「按步驟做」：

```
# 不好（逐步指令）
"First search for relevant posts. Then extract key claims.
 Then write response with citations."

# 好（描述終態）
"A successful response directly answers the user's question
 with 2-5 key points, each backed by a specific source from
 the blog. It reads naturally, not like a list of search results."
```

### 5.9 Verification Loop（三層品質保證）

> Spotify 的三層品質：(1) Agent 沒產出結果（重試）(2) 結果通過格式檢查但功能錯誤（侵蝕信任）(3) 不可預測的輸出。

2026-05-12 狀態：Deterministic Validation 與失敗降級已實作；Critic 的 answer-relevance / intent alignment 尚未補上。

Critic 當前只做 grounding check，應擴展為三層：

| 層級 | 檢查項目 | 實作方式 |
|------|----------|----------|
| 格式驗證 | Markdown 語法、Source URL 存在性、回覆長度 | Deterministic Validation 節點（非 AI） |
| Grounding 驗證 | 每個論點是否有 chunk 支撐 | Critic 的 LLM-as-Judge |
| Answer-Relevance 驗證 | 回答是否真的切中問題（不只相關） | Critic 增加 RAGAS Answer Relevancy 指標 |
| Intent Alignment | 回答是否與原始查詢意圖對齊（drift 偵測） | Critic 增加意圖對齊度分數 |

### 5.10 框架選擇評估

> 「框架選擇不是學習曲線問題——所有框架都能一天 demo。真正的成本是遷移成本。」
> 「如果只需要『品質差就重試一次』，LangGraph 是殺雞用牛刀。」

Phase 1 pipeline（Planner → Research → Normalize → Writer → Critic）本質上是接近線性的 pipeline，只有 Critic → Research 有一個重試循環。

| 方案 | 優點 | 缺點 |
|------|------|------|
| 純函數 pipeline（Phase 1） | 零依賴、快冷啟動、易 debug | Phase 2 需要重寫 |
| LangGraph 從頭用 | Phase 2 無縫升級、條件分支 / 並行 / interrupt 內建 | 依賴重（@langchain/langgraph + @langchain/anthropic）、Workers 冷啟動變慢、API 版本不穩定 |

建議：
- Phase 1 用純 async 函數 pipeline，降低依賴和冷啟動
- Phase 2 再引入 LangGraph（真正需要 Clarifier interrupt、條件分支、並行時）
- 或接受 LangGraph 成本，但必須測量 Workers 冷啟動影響

### 5.11 Phase 演進對照表

| 面向 | Phase 1 | Phase 2 | Phase 3 |
|------|---------|---------|---------|
| Agent 節點 | 4 個（基礎） | 9 個（完整） | 9 個 + GraphRAG |
| 對話 | 單輪 | 多輪（D1 Checkpointer） | + 長期記憶 |
| 搜尋 | 純語意 | Hybrid + HyDE + Reranker | + CRAG + Adaptive RAG |
| 快取 | 無 | Semantic Cache + Abstract-first Index | |
| 後台 | 無 | 4 個管理頁 | + Eval Dashboard + Shadow A/B |
| 安全 | Auth + Rate Limit | 同上 | + Injection 防護 + PII 過濾 + Circuit Breaker |
| 文件來源 | 部落格 + 爬取文件 | 同上 | + 自訂上傳（PDF/URL/文字） |

> Phase 1 是「能回答」，Phase 2 是「回答得好」，Phase 3 是「穩定可靠地回答得好」。

---

## 六、RAG 設計交叉審查修正清單

> 用 30+ 篇 RAG/Agent 文章的具體建議，逐一對照設計文件找出的矛盾、遺漏。

### 6.1 參數修正（改數字即可）

| # | 問題 | 來源 | 修正 |
|---|------|------|------|
| 1 | Semantic Cache 門檻 0.92 太低 | semantic-caching.md：0.90-0.94 = 「相關但不同」 | 改為 **0.95** |
| 2 | Chunk size 2000 chars 在中文下 ≈ 800-1000 tokens，超出建議 | chunking-strategies.md：最佳平衡 512 tokens | 改為 **1500 chars** 或改用 token 計算 |
| 3 | Reranker 缺少 min-keep 安全網 | cross-encoder-reranking.md | 加入 **min_keep: 3** |

### 6.2 邏輯修正

| # | 問題 | 來源 | 修正 |
|---|------|------|------|
| 4 | CRAG 只有 web search，缺 filter 放寬 | corrective-rag-crag.md | 零結果 → 先放寬 metadata filter → 仍低分 → web search |
| 5 | `search_abstract_index` 與 `search_blog_posts` 語意重疊 | context-engineering-guide.md：避免功能重疊工具 | 改為 Research 節點內部策略 |
| 6 | 缺少 MMR 多樣性重排 | mmr-diversity-reranking.md | Reranker 之後、Writer 之前加入 MMR（λ=0.7） |
| 7 | Planner 缺少 queryType 路由 | query-classification-adaptive-routing.md | 加入 complexity 分類，驅動條件性跳步 |
| 8 | Progressive summarization 用固定 8000 tokens | context-engineering-guide.md：reserve 30%+ for generation | 改為 `model_context_window * 0.7` 動態計算 |

### 6.3 防禦性機制補強

| # | 問題 | 來源 | 修正 |
|---|------|------|------|
| 9 | 缺少 Deterministic Validation 節點 | Stripe Blueprint 模式 | 已完成：Writer → Critic 間插入確定性驗證，現階段檢查 Markdown code fence、URL 存在性、Mermaid fenced block |
| 10 | Critic 失敗無降級策略 | Stripe 2-attempt cap | 已完成：重試 2 次仍不通過 → 標註可能不完整 + 不再呼叫後續 LLM |
| 11 | Critic 只檢查 grounding，不檢查 drift | phil-schmid-agent-harness.md | 增加「與原始查詢意圖對齊度」檢查 |
| 12 | Critic 只檢查 grounding，不檢查 answer-relevance | RAGAS + Spotify verification | 增加 answer-relevance check |

### 6.4 成本控制

| # | 問題 | 來源 | 修正 |
|---|------|------|------|
| 13 | Critic 每次都執行完整 LLM 呼叫 | rag-cost-optimization.md | Judge sampling：簡單查詢跳過 Critic，只對 complex 執行 |
| 14 | Hybrid Search 永遠兩路並行 | rag-cost-optimization.md | BM25 短路：精確名詞查詢 BM25 ≥ 5 結果 → 跳過向量搜尋 |

### 6.5 可演化性

| # | 問題 | 來源 | 修正 |
|---|------|------|------|
| 15 | 工具描述無品質規範 | Stripe Toolshed | 每個工具寫明 when/when-not/format |
| 16 | Prompt 用逐步指令風格 | Spotify 描述終態模式 | 改為描述「成功的回答長什麼樣」 |
| 17 | Shadow A/B 排在 Phase 3 太晚 | phil-schmid + anthropic-harness | 提前到 Phase 2 |
| 18 | Phase 1 可能不需要完整 LangGraph | langgraph-agent-orchestration.md | 評估純函數 pipeline 方案，Phase 2 再引入 LangGraph |
| 19 | 每個進階技術都應可開關 | Bitter Lesson | 加 feature flag，能 A/B 測試「有 vs 沒有」 |
| 20 | 站長端缺少 episodic memory | ai-agents-context-cognition-action.md | 加入使用者偏好記憶 |

---

## 七、設計與文章一致的部分（已驗證正確）

> 2026-05-12 校對：下表只保留 repo 內已能找到對應實作的項目；其餘設計目標留在前文，不再標成「已驗證」。

| 文章建議 | 設計文件對應 |
|----------|-------------|
| Contextual Retrieval（chunk 前加文件脈絡） | Section 4.1 完整實作 |
| Generator-Evaluator（Writer + Critic） | Section 5.2 Writer + Critic 節點 |
| Deterministic Validation | Writer 後、Critic 前的 validation 節點 |
| Parallel Fan-out | Research 並行工具呼叫 |
| LangGraph 狀態管理 | `StateAnnotation` 狀態定義與 graph compile 流程 |
| Langfuse 可觀測性 | Section 12 完整 trace 結構 |
| 結構化 System Prompt | Planner / Critic 節點使用 JSON-only 結構化輸出 |
| Circuit breaker | Critic/validation 失敗後的 fallback 降級模式 |
| 隔離沙盒 | Cloudflare Workers 本身就是隔離環境 |
| 精選工具子集（<20 個） | 目前為少量專用檢索工具，範圍仍可控 |
| 使用者回饋（👍👎） | D1 `feedback` 表 schema 已建立，互動流程尚待接線 |
| Rate limiting | IP + KV 每日配額 |

---

## 八、RAG 實作 Task 清單

> 對應 `docs/superpowers/plans/2026-03-21-rag-phase1.md` 的任務拆解。

| Task | 內容 | 依賴 |
|------|------|------|
| 1 | 安裝依賴（LangGraph、React、Langfuse） | — |
| 2 | D1 Migration（FTS5、chat_logs、feedback、settings 表） | — |
| 3 | Auth + Rate Limit | Task 2 |
| 4 | Embedding Pipeline（contextual chunk → Vectorize upsert） | Task 2 |
| 5 | LangGraph Agent 節點（Planner → Research → Normalize → Validation → Writer → Critic → Related） | Task 1, 4 |
| 6 | `/api/chat` SSE 端點 | Task 3, 5 |
| 7 | Chat UI React 元件 | Task 6 |
| 8 | 測試 + 上線 | All |

---

## 九、Bitter Lesson 壓力測試清單

> 每個組件都編碼了一個「模型做不到」的假設，需要持續驗證。

| 假設 | 編碼在 | 測試方式 |
|------|--------|----------|
| LLM 不會自己判斷查詢類型 | Planner 節點 | 關閉 Planner，直接讓 LLM 處理 |
| 需要 HyDE 才能搜好 | Phase 2 HyDE | A/B：直接 embedding vs HyDE embedding |
| 需要 Multi-query 才能涵蓋語意 | Phase 2 Multi-query | A/B：單一 query vs 3 個變體 |
| 需要 Reranker 才能排好 | BGE-Reranker | A/B：Vectorize cosine 排序 vs cross-encoder |
| Critic 需要獨立 LLM 呼叫 | Critic 節點 | A/B：有 Critic vs 無 Critic |
| 需要 LangGraph 才能管理流程 | 整個 pipeline | Phase 1 先用純函數評估 |

---

## 十、核心原則

> 來自自己的文章，用來指導所有實作決策。

1. **「The walls matter more than the model」** — Stripe Minions
   基礎設施的約束設計比模型選擇更重要

2. **「大部分 Agent 失敗是 Context 失敗，不是模型失敗」** — Context Engineering Guide
   先把 embedding + retrieval 做好，比換更貴的模型有效

3. **「Start simple, only add complexity for specific failure modes」** — Google Multi-Agent Patterns
   先做單 Agent 語意搜尋，驗證後再加 Multi-Agent

4. **「Prompt 是建議，Linter 是法律」** — Harness Engineering
   用確定性約束取代 prompt 請求

5. **「Intelligence without infrastructure is just a demo」** — Harness Engineering
   CLAUDE.md、progress.txt、pre-commit hook 是基礎建設

6. **「你今天寫的 harness 邏輯，明天可能因為模型升級而過時」** — Bitter Lesson
   每個組件都要可開關、可 A/B 測試
