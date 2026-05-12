# 學習路徑生成規劃

> 目標：給定讀者的學習目標，例如「我想學 RAG」，自動產生站內文章閱讀順序，並提供分階段清單、先修知識、完成後收穫、總閱讀時間與進度追蹤。
>
> 狀態：規劃中。本文先定義產品範圍、資料模型、實作階段與驗收標準。

---

## 一、背景

quidproquo 已經有大量 AI、RAG、Agent、Cloudflare、產品與內容營運文章。單篇文章可以透過分類、tag、series、搜尋找到，但讀者面對「我想學 RAG」、「我想理解 AI Agent」、「我想學 Cloudflare Workers」這種目標時，仍需要自己判斷：

- 哪篇先讀？
- 哪些文章是入門，哪些是進階？
- 讀完一篇後應該接哪篇？
- 需要先懂哪些概念？
- 全部讀完大概要多久？

目前站內已有可重用基礎：

| 能力 | 現況 | 可用於學習路徑 |
|------|------|----------------|
| `readingTime` | 已由 remark plugin 產生 | 估算總閱讀時間 |
| `tags` | 文章必填 | 主題匹配 |
| `category` | 文章必填 | 限定領域 |
| `difficulty` | schema 已有 optional 欄位 | 排序與分階段 |
| `series` | schema 已有 optional 欄位 | 保留作者已定義順序 |
| Related posts | 已有基礎工具 | 補充延伸閱讀 |
| Pagefind / RAG 搜尋 | 已有搜尋頁與 API | 第二階段可用於候選召回 |

因此第一版不需要直接上 LLM。比較穩的做法是先建立文章 metadata 與 deterministic planner，等 metadata 成熟後，再讓 LLM 負責重排、解釋與個人化。

---

## 二、產品目標

### 讀者目標

讀者輸入一個學習目標後，系統回傳一條可執行的閱讀路徑：

```text
目標：我想學 RAG
背景：會寫 JavaScript，但不熟向量資料庫

路徑：
1. 入門：理解 RAG 是什麼
2. 進階：理解 retrieval、embedding、hybrid search
3. 實作：知道如何用 Cloudflare Workers / D1 / Vectorize 做一套小型 RAG
```

每篇文章至少顯示：

- 標題
- 分類 / tag
- 閱讀時間
- 所屬階段：入門 / 進階 / 實作
- 先修知識
- 完成後收穫
- 為什麼被放在這個位置
- 進度狀態：未讀 / 已讀

### 站方目標

- 讓既有文章變成可學習的知識路徑，而不是只靠時間線與分類瀏覽。
- 降低新讀者進入 AI / RAG / Agent 內容的門檻。
- 讓 `learning` metadata 成為後續推薦、內部連結、內容缺口分析的基礎。
- 保持 Markdown 為 source of truth，不讓 D1、Vectorize 或 LLM 變成不可重建的唯一資料源。

---

## 三、非目標

第一版不做：

- 使用者帳號系統與跨裝置進度同步。
- 完全由 LLM 自由產生不存在的文章或課程。
- 複雜知識圖譜 UI。
- 自動修改所有舊文章 frontmatter。
- 根據測驗結果動態改路徑。
- 外部課程、影片、論文推薦。

第一版只做站內文章路徑，且所有推薦項目必須能對應到真實存在的文章。

---

## 四、核心原則

### 4.1 Markdown 是 source of truth

學習路徑所需資料優先寫在文章 frontmatter。衍生 JSON、D1 資料、搜尋索引都可以重建。

### 4.2 先 deterministic，再 LLM

第一版用 metadata + 規則排序。LLM 只在後續階段加入，而且只能使用候選文章，不可憑空編造。

### 4.3 每個進階能力都要能關掉

若後續加入 LLM planner、personalization、semantic rerank，必須有 feature flag，並能回退到 deterministic planner。

### 4.4 人工標註優先於自動猜測

`stage`、`prerequisites`、`outcomes` 這類直接影響讀者順序的資訊，第一批由人工或半自動 review 後寫入，不依賴模型即時猜測。

---

## 五、資訊架構

### 5.1 新增頁面

```text
/learn
/en/learn
```

第一版可先只做中文 `/learn`，英文版保留路由規劃。

頁面區塊：

1. 目標輸入區
2. 背景輸入區（選填）
3. 推薦路徑結果
4. 進度摘要
5. 文章階段清單
6. 空狀態 / 無結果狀態

### 5.2 URL 狀態

支援 query string，方便分享：

```text
/learn?goal=RAG
/learn?goal=AI%20Agent&background=frontend
```

第一版不需要把已讀進度放進 URL。

### 5.3 進度追蹤

第一版使用 `localStorage`：

```text
learning-path-progress:v1
```

資料格式：

```json
{
  "ai/2026-03-14-rag-patterns-complete-guide": {
    "read": true,
    "updatedAt": "2026-05-13T12:00:00.000Z"
  }
}
```

進度只存在使用者瀏覽器。若清除瀏覽器資料，進度消失，這是第一版可接受的限制。

---

## 六、資料模型

### 6.1 Frontmatter schema

在 `src/content.config.ts` 的 posts schema 新增 optional `learning` 欄位：

```ts
learning: z.object({
  topics: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
  outcomes: z.array(z.string()).optional(),
  stage: z.enum(['入門', '進階', '實作']).optional(),
}).optional()
```

### 6.2 Frontmatter 範例

```yaml
---
title: "Hybrid Search：BM25 + 向量搜尋 + RRF"
date: 2026-03-12
category: ai
tags: [rag, hybrid-search, bm25, vector-search, rrf]
lang: zh-TW
difficulty: 進階
readingTime: 12
learning:
  topics: [rag, retrieval, hybrid-search]
  prerequisites:
    - llm-basic
    - embedding
    - full-text-search
  outcomes:
    - 理解為什麼單純向量搜尋不夠
    - 知道 BM25 與向量搜尋如何用 RRF 融合
  stage: 進階
---
```

### 6.3 topic 命名規則

`learning.topics` 使用英文 kebab-case，避免中英混用造成查詢困難。

範例：

```text
rag
embedding
vector-search
hybrid-search
reranker
context-engineering
prompt-engineering
ai-agent
cloudflare-workers
cloudflare-d1
cloudflare-vectorize
```

### 6.4 prerequisite 命名規則

`learning.prerequisites` 也是英文 kebab-case，代表概念，而不是文章 slug。

範例：

```text
llm-basic
javascript-basic
http-basic
embedding
sql-basic
cloudflare-workers
```

後續若要把 prerequisite 連到站內詞彙表或文章，可以再建立 mapping，不要一開始就把它綁死在文章 URL。

---

## 七、衍生索引

### 7.1 新增 script

新增：

```text
scripts/generate-learning-index.mjs
```

產出：

```text
public/learning-index.json
```

### 7.2 JSON 格式

```json
[
  {
    "id": "ai/2026-03-14-rag-patterns-complete-guide",
    "title": "RAG Patterns 完整指南",
    "url": "/posts/ai/2026-03-14-rag-patterns-complete-guide",
    "category": "ai",
    "tags": ["rag", "retrieval", "embedding"],
    "topics": ["rag", "retrieval"],
    "stage": "入門",
    "difficulty": "入門",
    "prerequisites": ["llm-basic"],
    "outcomes": ["理解 RAG 常見架構與適用情境"],
    "readingTime": 18,
    "date": "2026-03-14",
    "series": {
      "name": "RAG 系列",
      "order": 1
    }
  }
]
```

### 7.3 產生規則

只收錄：

- `draft !== true`
- `lang === 'zh-TW'`，英文版日後可另產 `learning-index.en.json`
- 有 `learning.topics` 或文章屬於 `ai` / `tech` / `learning` / `education` / `product` 且有相關 tag

第一版可以收錄所有已發布中文文章，但推薦時優先使用有 `learning` metadata 的文章。

### 7.4 build 整合

可在 `package.json` 新增：

```json
{
  "scripts": {
    "generate:learning-index": "node scripts/generate-learning-index.mjs"
  }
}
```

後續再決定是否接進 `build`。MVP 期間建議先手動跑，避免 schema 或資料品質還不穩時影響部署。

---

## 八、路徑生成邏輯

### 8.1 輸入

```ts
type LearningPathInput = {
  goal: string;
  background?: string;
  lang?: 'zh-TW' | 'en';
};
```

### 8.2 輸出

```ts
type LearningPath = {
  goal: string;
  totalReadingTime: number;
  stages: LearningPathStage[];
};

type LearningPathStage = {
  stage: '入門' | '進階' | '實作';
  posts: LearningPathPost[];
};

type LearningPathPost = {
  id: string;
  title: string;
  url: string;
  readingTime: number;
  prerequisites: string[];
  outcomes: string[];
  reason: string;
};
```

### 8.3 候選召回

第一版不用 embedding，先用字串與 metadata 比對：

1. normalize `goal`
2. 比對 `learning.topics`
3. 比對 `tags`
4. 比對 `title`
5. 比對 `description` / `tldr`

分數範例：

| 條件 | 分數 |
|------|------|
| goal 命中 `learning.topics` | +10 |
| goal 命中 `tags` | +6 |
| goal 命中 title | +5 |
| goal 命中 description / tldr | +3 |
| category 是 `ai` 且 goal 包含 RAG / Agent / LLM | +2 |
| 有完整 `learning` metadata | +3 |
| draft 或未發布 | 排除 |

### 8.4 排序

排序優先順序：

1. `stage`：入門 → 進階 → 實作
2. 同 series 時使用 `series.order`
3. `difficulty`：入門 → 進階 → 深度
4. relevance score 高者優先
5. 較新的文章優先，但不覆蓋明確 series order

### 8.5 階段補齊

如果某個階段沒有文章：

- 不硬塞低相關文章。
- 顯示「目前沒有明確的入門文章」或「目前缺少實作篇」。
- 這個缺口可以回寫到 content ops report，作為後續寫作題目。

### 8.6 結果限制

第一版預設：

- 每階段最多 5 篇
- 全路徑最多 12 篇
- 總閱讀時間顯示分鐘數

若候選文章太多，優先保留：

1. 有 `learning` metadata
2. 有 `series`
3. `type` 是 `guide` 或 `deep-dive`
4. `readingTime` 不過長的入門文章

---

## 九、UI 規劃

### 9.1 頁面狀態

| 狀態 | 說明 |
|------|------|
| 初始狀態 | 顯示輸入框與常見目標 chip |
| 產生中 | 前端 local generation 可即時完成；若未來接 API 才需要 loading |
| 成功 | 顯示路徑摘要與分階段清單 |
| 無結果 | 提供站內搜尋 fallback |
| metadata 不足 | 顯示少量結果，並避免假裝完整 |

### 9.2 常見目標

第一版可硬編碼一些入口：

```text
RAG
AI Agent
Prompt Engineering
Context Engineering
Cloudflare Workers
Cloudflare D1
Vector Database
內容營運
```

### 9.3 結果摘要

摘要資訊：

- 目標
- 文章數
- 總閱讀時間
- 已完成篇數
- 完成百分比

### 9.4 文章卡片

每篇文章卡片包含：

- checkbox：標記已讀
- title
- category / tags
- reading time
- prerequisites
- outcomes
- reason

### 9.5 localStorage 進度

使用者勾選文章後即時更新：

- 單篇已讀
- 階段完成度
- 全路徑完成度

第一版不需要登入，也不需要同步到後端。

---

## 十、實作方案

### Phase 0：資料盤點

目標：確認最適合第一批支援的主題。

工作：

- 盤點 `ai`、`tech`、`learning` 類文章的 tag 分布。
- 找出 RAG / AI Agent / Prompt Engineering / Cloudflare 相關文章。
- 選 2 個主題做 MVP：建議先選 `rag` 與 `ai-agent`。

產出：

- 第一批 topic 清單。
- 第一批文章清單。
- 明確標出缺入門、缺實作、缺進階的地方。

### Phase 1：Metadata MVP

目標：讓少量文章可以被穩定組成路徑。

工作：

- 更新 `src/content.config.ts`，新增 `learning` schema。
- 為 15-30 篇核心文章補 `learning` metadata。
- 寫 `scripts/generate-learning-index.mjs`。
- 產生 `public/learning-index.json`。

驗收：

- `pnpm astro check` 通過。
- `public/learning-index.json` 可被前端載入。
- `rag` 至少能產生 3 個階段中的 2 個階段。
- 每篇推薦文章都有先修知識與完成後收穫。

### Phase 2：前端 `/learn`

目標：讓讀者能實際使用。

工作：

- 新增 `src/pages/learn.astro`。
- 新增前端 planner script 或獨立 util。
- 支援目標輸入、常見目標 chip、結果顯示。
- 支援 localStorage 進度追蹤。
- 支援無結果 fallback 到 `/search?q=...&mode=rag`。

驗收：

- `/learn?goal=RAG` 能直接顯示路徑。
- 勾選已讀後 reload 仍保留進度。
- 總閱讀時間等於路徑文章 `readingTime` 加總。
- 手機版不發生文字溢出或卡片重疊。

### Phase 3：站內搜尋整合

目標：讓 metadata 不完整時也能召回候選文章。

工作：

- 在候選召回中加入 `/api/search?mode=hybrid` 或現有 RAG search API。
- 把搜尋結果限制為候選補充，不取代 metadata planner。
- 搜尋結果若缺 `learning` metadata，顯示較保守的 reason。

驗收：

- metadata 不完整的 goal 仍能回傳合理候選文章。
- 搜尋候選不會打亂有明確 `series.order` 的文章順序。
- API 失敗時仍可回退到 local JSON planner。

### Phase 4：LLM Planner

目標：讓路徑更個人化，但不犧牲可靠性。

工作：

- 新增 `POST /api/learning-path`。
- Request 包含 `goal`、`background`、`lang`。
- API 先 retrieval 候選文章，再把候選傳給 LLM 做排序與說明。
- LLM 必須輸出 JSON，且文章 id 必須存在於候選列表。
- 加 feature flag：`learning_path_llm_planner`。

LLM 約束：

```text
你只能使用候選文章產生學習路徑。
不可新增不存在的文章。
不可修改文章標題與 URL。
每篇必須包含 stage、prerequisites、outcomes、reason。
若候選不足，明確輸出 missing_stages。
輸出 JSON。
```

驗收：

- 關閉 feature flag 後可回到 deterministic planner。
- LLM 回傳不存在文章 id 時會被 validator 擋下。
- 至少 10 筆人工測試 goal 中，LLM 版本排序品質優於 deterministic 或至少不退步。

---

## 十一、內容維護流程

### 11.1 寫新文章時

若文章屬於 `tech`、`ai`、`learning`、`education`、`product`，作者應評估是否補 `learning` metadata。

建議規則：

- 教學型、概念型、架構型文章：應補。
- 純日記、短心得、新聞評論：可不補。
- 若文章是某個系列的一部分，優先補 `series` 與 `learning.stage`。

### 11.2 回填舊文章時

分批做，不一次改全站：

1. RAG 主題
2. AI Agent 主題
3. Prompt / Context Engineering 主題
4. Cloudflare 主題
5. 內容營運 / AEO / GEO 主題

每批回填後抽樣檢查：

- stage 是否合理
- prerequisites 是否過度嚴格
- outcomes 是否具體
- 路徑排序是否像人會推薦的順序

### 11.3 Content Ops 整合

後續 `pnpm content:ops` 可加入學習路徑檢查：

- 有 `learning.topics` 但缺 `learning.stage`
- 有 `learning.stage` 但缺 `outcomes`
- 某 topic 只有進階文章，缺入門文章
- 某 topic 文章過多但沒有整理成 series
- 同 topic 多篇文章的 prerequisite 命名不一致

---

## 十二、品質與風險

### 12.1 主要風險

| 風險 | 影響 | 緩解 |
|------|------|------|
| metadata 不足 | 路徑結果空或排序差 | 先只支援少數主題 |
| LLM 幻覺文章 | 讀者點到不存在內容 | LLM 只能從候選 id 選，並做 validator |
| prerequisites 太抽象 | 讀者看不懂門檻 | 使用固定 kebab-case 詞表，日後接 glossary |
| 路徑過長 | 讀者不會開始 | 每階段最多 5 篇，全路徑最多 12 篇 |
| 進度只存在本機 | 跨裝置不一致 | 第一版明確接受，帳號同步留到後續 |
| 舊文章品質不一 | 推薦出過時內容 | metadata 回填時人工 review |

### 12.2 成功指標

第一版可以先用低成本指標：

- `/learn` 頁面訪問數
- 常見 goal 點擊數
- 產生路徑次數
- 已讀 checkbox 使用率
- 路徑內文章點擊率
- 無結果 goal 次數

若未來有 D1 事件紀錄，可新增：

- topic coverage
- path completion rate
- stage drop-off
- most missing prerequisites

---

## 十三、測試計畫

### 13.1 單元測試

建議測：

- goal normalization
- candidate scoring
- stage sorting
- series order preservation
- total reading time aggregation
- max posts per stage
- missing stage handling

### 13.2 整合測試

建議測：

- `generate-learning-index.mjs` 能讀取 content collection 並產出合法 JSON。
- `/learn?goal=RAG` 能渲染出至少一個階段。
- localStorage 進度能保存與恢復。

### 13.3 人工 smoke test

至少測這些 goal：

```text
RAG
AI Agent
Prompt Engineering
Context Engineering
Cloudflare Workers
Vector Database
```

每個 goal 檢查：

- 是否有明顯不相關文章
- 入門文章是否真的能先讀
- 進階文章是否需要未列出的背景知識
- 實作文章是否太早出現
- 總閱讀時間是否合理

---

## 十四、建議檔案變更

MVP 可能涉及：

```text
src/content.config.ts
scripts/generate-learning-index.mjs
src/pages/learn.astro
src/utils/learningPath.ts
src/utils/learningPath.test.ts
public/learning-index.json
```

若後續加入 API：

```text
src/pages/api/learning-path.ts
src/lib/learning/planner.ts
src/lib/learning/validate.ts
```

若後續加入內容營運檢查：

```text
scripts/content-ops.mjs
docs/content-ops-report.json
```

---

## 十五、MVP 任務清單

- [ ] 盤點 RAG / AI Agent 相關文章，選出第一批 15-30 篇。
- [ ] 新增 `learning` frontmatter schema。
- [ ] 為第一批文章補 `learning.topics`、`stage`、`prerequisites`、`outcomes`。
- [ ] 實作 `scripts/generate-learning-index.mjs`。
- [ ] 產出 `public/learning-index.json`。
- [ ] 實作 deterministic planner util。
- [ ] 新增 `/learn` 頁面。
- [ ] 加入 localStorage 進度追蹤。
- [ ] 加入無結果 fallback 到站內搜尋。
- [ ] 為 planner 補單元測試。
- [ ] 手機與桌面 smoke test。
- [ ] 更新 `docs/TODO.md`，把學習路徑功能加入 P2 或 P3。

---

## 十六、建議切入點

第一個可交付版本建議只支援：

```text
goal = RAG
goal = AI Agent
```

原因：

- 這兩個主題文章數最多。
- 站內已有 RAG / Agent / Harness 相關系列文章。
- 讀者需求明確，容易人工判斷排序品質。
- 可快速暴露 metadata 缺口，反過來指導內容整理。

完成後再擴到：

```text
Prompt Engineering
Context Engineering
Cloudflare Workers
Vector Database
內容營運 / AEO / GEO
```

---

## 十七、開放問題

1. `learning.stage` 要使用中文 enum，還是改成英文 `beginner | intermediate | practice` 再由 i18n 顯示？
2. `prerequisites` 要不要接到 glossary terms？
3. `learning-index.json` 要手動生成，還是接進 `pnpm build`？
4. `/learn` 第一版是否只做中文？
5. 已讀進度是否需要提供「清除本路徑進度」按鈕？
6. 未來若登入系統存在，進度要不要同步到 D1？

---

## 十八、推薦決策

建議 MVP 決策如下：

| 問題 | 建議 |
|------|------|
| stage enum | schema 先用中文，降低現有內容維護成本；若做 i18n 再改英文 internal enum |
| 第一批語言 | 只做 `zh-TW` |
| 第一批主題 | `rag`、`ai-agent` |
| 進度儲存 | localStorage |
| 索引生成 | 先手動 script，穩定後接 build |
| LLM | 不進 MVP |
| 搜尋整合 | Phase 3 再加 |

最小可行版本的重點不是「看起來很聰明」，而是讓讀者真的能照著讀。只要 RAG 與 AI Agent 兩條路徑品質夠好，這個功能就有價值。
