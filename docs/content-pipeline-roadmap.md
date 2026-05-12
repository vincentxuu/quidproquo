# Content Pipeline Roadmap

這份文件整理 quidproquo 可以做的 pipeline。目標不是一次全部自動化，而是先建立共同語言：哪些 pipeline 值得做、各自輸入輸出是什麼、適合放進後台管理到什麼程度。

核心原則：

- Pipeline 可以自動產生建議、報告或草稿。
- Publish 仍保留人工確認，不做全自動發布。
- 優先處理吃現有 Markdown 的 pipeline，降低外部依賴。
- 後台先管理狀態、設定與執行紀錄，再逐步補 runner。

## 分類

```text
內容生產
  研究 / 摘要 / 翻譯 / 影片轉文

內容維護
  品質檢查 / SEO / 內部連結 / freshness

知識基礎設施
  crawl / chunk / embed / knowledge graph

互動體驗
  RAG chat / search / recommendation

發布營運
  draft / review / publish / social repurpose
```

## 候選 Pipeline

### 1. Translation Pipeline

中文文章轉英文草稿。

```text
Source Post
  -> Translator
  -> Cultural Reviewer
  -> Native Checker
  -> Markdown Draft
```

目前狀態：

- 已有規劃文件：`docs/translation-pipeline.md`
- 已有 prompt：
  - `.github/prompts/translation-translator.prompt.md`
  - `.github/prompts/translation-cultural-reviewer.prompt.md`
  - `.github/prompts/translation-native-checker.prompt.md`
- 尚未 CLI 化或後台化。

後台能力：

- 選一篇中文文章。
- 選目標語言、provider、model。
- 執行三段式 pipeline。
- 產生 `lang: en`、`draft: true` 的 Markdown 草稿。
- 記錄每個 stage 的輸入、輸出、錯誤與耗時。

優先度：高。這條最成熟，適合第一個做 runner。

### 2. YouTube to Post Pipeline

YouTube URL 轉文章草稿。

```text
YouTube URL
  -> Transcript / NotebookLM
  -> Key Points
  -> Article Draft
  -> Personal Notes Placeholder
  -> Markdown Draft
```

目前狀態：

- 已有規劃文件：`docs/yt-to-post-pipeline.md`
- `scripts/yt_to_post.py` 尚未實作。
- NotebookLM / transcript 來源仍需確認穩定性。

後台能力：

- 輸入 YouTube URL。
- 抓字幕或來源摘要。
- 產生文章草稿。
- 保留人工補充清單，例如個人觀點、封面圖、延伸閱讀。

優先度：中。價值高，但外部依賴較不穩，建議晚於 translation。

### 3. Post Quality Pipeline

發布前品質檢查。

```text
Markdown
  -> Frontmatter Check
  -> Reference Check
  -> Link Check
  -> Structure Check
  -> Style / Claim Risk Check
  -> Report
```

目前狀態：

- 已有 `pnpm check:post-quality`
- 已有 `pnpm check:references`
- 已接近可後台化。

後台能力：

- 選一篇 draft 或最近文章。
- 執行品質檢查。
- 顯示紅綠燈、錯誤清單、修復建議。
- 不直接修改文章，除非之後明確加入 autofix。

優先度：高。風險低，能立即改善發布流程。

### 4. Content Ops Pipeline

批次內容營運報告。

```text
All Posts
  -> Missing TLDR / Description
  -> Tag Suggestions
  -> Duplicate Candidates
  -> Freshness Risks
  -> Internal Link Opportunities
  -> Content Gap Report
```

目前狀態：

- 已有 `pnpm content:ops`
- 目前偏 deterministic report，不是完整 LLM pipeline。
- 輸出 `docs/content-ops-report.json`。

後台能力：

- 觸發 content ops report。
- 顯示缺漏 metadata、tag 建議、重複候選、freshness 風險、內容缺口。
- 後續可加入 model-backed provider。

優先度：高。適合作為 `/admin/pipelines` 第一批可見 pipeline。

### 5. Summary / Metadata Pipeline

文章全文產生多層摘要與 metadata。

```text
Post
  -> Section Summary
  -> One-line TLDR
  -> SEO Description
  -> Social Snippet
```

目前狀態：

- `blog-improvement-plan.md` 中已有智慧 TL;DR 與摘要生成構想。
- 尚未獨立實作。

後台能力：

- 對單篇文章產生 `tldr`、`description`、social snippet。
- 可批次找出缺漏 metadata 的文章。
- 預設只產生建議，不直接覆寫 frontmatter。

優先度：高。範圍小、成功標準明確。

### 6. Internal Link Pipeline

為文章建議站內連結。

```text
Post
  -> Extract Concepts
  -> Search Related Posts
  -> Recommend Anchor Text
  -> Insert Suggestions
```

目前狀態：

- `content:ops` 已有 internal link opportunities 的方向。
- 尚未形成可互動審閱的 pipeline。

後台能力：

- 顯示建議連到哪些舊文章。
- 建議 anchor text 與插入位置。
- 人工確認後再修改文章。

優先度：高到中。對 SEO 和讀者導覽有價值，但需要較好的推薦品質。

### 7. Research to Post Pipeline

主題轉研究 brief，再轉文章草稿。

```text
Topic
  -> Research Questions
  -> Source Collection
  -> Claim Extraction
  -> Outline
  -> Draft
  -> Reference Audit
```

目前狀態：

- 尚未獨立規劃。
- 可借用 post skill 的寫作流程與參考資料規則。

後台能力：

- 輸入主題。
- 先產生 research brief，不直接寫完整文章。
- 列出 claims、sources、outline。
- 人工通過 brief 後再產 draft。

優先度：中。比 YouTube 更泛用，但引用準確度和來源管理要先設計清楚。

### 8. Freshness / Update Pipeline

找出應該更新的舊文章。

```text
Published Posts
  -> Detect Time-sensitive Claims
  -> Check Age / Version Mentions
  -> Mark Update Risk
  -> Suggest Refresh Tasks
```

目前狀態：

- `content:ops` 已有 freshness 候選。
- 尚未做外部事實查核或更新任務化。

後台能力：

- 顯示高風險過期文章。
- 依 category、age、版本號、產品名排序。
- 後續可接 research pipeline 產生 refresh brief。

優先度：中。AI / tech 內容很需要，但若要查最新資訊會增加外部依賴。

### 9. RAG Chat Pipeline

站內問答 pipeline。

```text
Query
  -> Planner
  -> Research
  -> Normalize
  -> Writer
  -> Validation
  -> Critic
  -> Related / Fallback
```

目前狀態：

- 已有主要實作。
- `/admin/rag` 已能管理 flags、pipeline engine、provider/model、shadow mode、trace timeline。

後台能力：

- 已部分存在。
- 未來可納入統一 pipeline registry，但不一定要重寫。

優先度：中。它是已存在的產品功能，不是第一批內容生產 pipeline 的瓶頸。

### 10. Embedding Pipeline

文章與文件 chunk 後寫入 Vectorize。

```text
Posts / Docs
  -> Chunk
  -> Embed
  -> Vectorize Upsert
```

目前狀態：

- 已有 `/api/embed/sync`。
- `/admin/rag` 已可觸發 embed batch。
- TODO 中仍標註需要 production smoke test 證據。

後台能力：

- 顯示最近 embed run。
- 手動觸發 posts/docs/custom source。
- 顯示成功/失敗數、耗時、錯誤。

優先度：中。更偏知識基礎設施。

### 11. Crawl Pipeline

外部技術文件爬取。

```text
Docs Site
  -> Crawl / Render
  -> Chunk
  -> D1 doc_chunks
  -> Embed
```

目前狀態：

- 已有 `/api/crawl/sync`。
- 已有 settings checkpoint。
- `/admin/rag` 可手動觸發 crawl sync。

後台能力：

- 管理 crawl targets。
- 查看最近成功時間、失敗紀錄、chunk 數量。
- 手動觸發同步。

優先度：中。適合之後從 `/admin/rag` 拆出 `/admin/crawl`。

### 12. Knowledge Graph Pipeline

文章庫抽取 entity 與 relation。

```text
Posts
  -> Entity Extraction
  -> Relation Extraction
  -> Graph Storage
  -> Related Concepts / Series Suggestions
```

目前狀態：

- TODO 中有概念。
- 尚未設計資料模型。

後台能力：

- 顯示 entities、relations、孤立概念。
- 建議 series、相關文章、內部連結。

優先度：低。長期有價值，但短期成本較高。

### 13. Social Repurpose Pipeline

文章轉社群素材。

```text
Post
  -> Key Ideas
  -> Thread / LinkedIn / IG Carousel Copy
  -> Visual Brief
  -> Draft Assets
```

目前狀態：

- 有 IG carousel automation 相關文章，但 repo 中未作為站內 pipeline。

後台能力：

- 選文章產社群文案。
- 產生 carousel 大綱或短文。
- 保留人工發布。

優先度：低到中。適合內容量穩定後放大分發。

### 14. Deep Research Pipeline

主題轉深度研究包，作為文章、簡報、影片或文件的上游素材。

```text
Topic / Question
  -> Research Plan
  -> Source Collection
  -> Claim Extraction
  -> Evidence Table
  -> Synthesis Brief
  -> Open Questions
```

目前狀態：

- 尚未獨立實作。
- 可作為 `research-to-post`、簡報、文件、podcast、影片 pipeline 的共同前置階段。

後台能力：

- 輸入主題與目標讀者。
- 管理來源、claims、引用、未確認問題。
- 產生可被其他 pipeline 消費的 research artifact。

優先度：高到中。它不是最小功能，但一旦做好，可以成為多數內容生成 pipeline 的共同底座。

### 15. Presentation Pipeline

研究 brief 或文章轉簡報。

```text
Post / Research Brief
  -> Slide Outline
  -> Slide Copy
  -> Visual Direction
  -> Speaker Notes
  -> PPTX / Markdown Deck Draft
```

目前狀態：

- 尚未規劃。

後台能力：

- 選文章或 research brief。
- 選用途：演講、課程、sales deck、內部分享。
- 產生簡報大綱、逐頁內容、講者備註。

優先度：中。需要決定輸出格式：PowerPoint、Markdown slides，或 HTML deck。

### 16. Document Pipeline

文章或研究素材轉長文件，例如白皮書、教學文件、SOP、規格書。

```text
Post / Research Brief / Notes
  -> Document Brief
  -> Structure
  -> Draft Sections
  -> Reference Audit
  -> Document Draft
```

目前狀態：

- 尚未規劃。

後台能力：

- 選文件類型。
- 產生文件結構與完整草稿。
- 保留引用與待補證據清單。

優先度：中。適合把部落格內容沉澱成可重用文件。

### 17. Card / Carousel Pipeline

文章或研究素材轉圖卡、IG 輪播、LinkedIn carousel。

```text
Post / Brief
  -> Key Points
  -> Card Sequence
  -> Short Copy
  -> Visual Brief
  -> Exportable Draft
```

目前狀態：

- 有 IG carousel automation 相關文章作為參考。
- 尚未納入站內 pipeline registry。

後台能力：

- 選文章。
- 產生 5-10 張圖卡內容。
- 輸出文案與視覺 brief，後續可接 HTML/CSS 截圖或設計工具。

優先度：中。比影片簡單，適合作為內容分發第一步。

### 18. Podcast Pipeline

文章或研究素材轉 podcast 腳本。

```text
Post / Research Brief
  -> Episode Angle
  -> Host Script
  -> Segment Outline
  -> Show Notes
  -> Optional TTS Audio
```

目前狀態：

- 尚未規劃。

後台能力：

- 選 podcast 格式：單人、訪談、雙人對話。
- 產生逐段腳本、開場、結尾、show notes。
- 後續可接 TTS，但第一版只產腳本。

優先度：低到中。音訊生成牽涉聲音品質與授權，建議先做 script-only。

### 19. Quiz Pipeline

文章或學習素材轉測驗。

```text
Post / Document
  -> Learning Objectives
  -> Question Generation
  -> Answer Key
  -> Explanation
  -> Difficulty Tags
```

目前狀態：

- 尚未規劃。

後台能力：

- 產生選擇題、是非題、簡答題。
- 標記難度與對應段落。
- 可作為 learning card pipeline 的下游。

優先度：中。適合教育類與技術教學文章。

### 20. Learning Card Pipeline

文章轉學習卡、概念卡或 spaced repetition cards。

```text
Post / Document
  -> Concept Extraction
  -> Q/A Cards
  -> Cloze Cards
  -> Examples
  -> Review Deck
```

目前狀態：

- 尚未規劃。

後台能力：

- 產生概念卡、Q/A 卡、填空卡。
- 可輸出 JSON、CSV 或 Anki-compatible 格式。
- 可按 category 或 series 批次生成。

優先度：中。與 learning / education 類內容高度契合。

### 21. Infographic Pipeline

文章或研究素材轉資訊圖表 brief。

```text
Post / Research Brief
  -> Key Data / Concepts
  -> Narrative Flow
  -> Chart / Diagram Suggestions
  -> Layout Brief
  -> Asset Draft
```

目前狀態：

- 尚未規劃。

後台能力：

- 產生資訊圖表結構。
- 建議圖表類型、區塊順序、文案。
- 第一版不必直接生成最終圖，可先產設計 brief。

優先度：低到中。視覺品質要求高，建議晚於圖卡。

### 22. Data Table Pipeline

文章或研究素材轉結構化資料表。

```text
Post / Sources
  -> Entity Extraction
  -> Attribute Extraction
  -> Table Schema
  -> CSV / Markdown Table
  -> Validation Notes
```

目前狀態：

- 尚未規劃。

後台能力：

- 從比較型文章抽出工具、模型、框架、指標。
- 產生 Markdown table、CSV、JSON。
- 標記不確定欄位與缺漏來源。

優先度：高到中。它能改善文章、簡報、資訊圖表與研究 brief 的資料基礎。

### 23. Mind Map Pipeline

文章、系列或研究素材轉心智圖。

```text
Post / Series / Research Brief
  -> Concept Hierarchy
  -> Relationship Mapping
  -> Mermaid Mindmap / JSON
  -> Review Notes
```

目前狀態：

- 尚未規劃。

後台能力：

- 對單篇文章或整個 series 產生心智圖。
- 輸出 Mermaid mindmap 或可視化 JSON。
- 可接 knowledge graph pipeline。

優先度：中。實作比 knowledge graph 輕，能先提供可視化價值。

### 24. Category Article Generation Pipeline

指定 category 或 series，自動產生文章候選與草稿。

```text
Category / Series
  -> Gap Analysis
  -> Topic Candidates
  -> Brief
  -> Draft
  -> Reference Audit
```

目前狀態：

- `content:ops` 已有 content gap report。
- 尚未接到文章產生。

後台能力：

- 選 category，例如 `ai`、`tech`、`education`。
- 找內容缺口與候選題目。
- 先產 brief，人工確認後再產草稿。

優先度：中。適合建立內容集群，但需要防止大量低品質草稿。

### 25. Article to HyperFrames Video Pipeline

文章串接 HyperFrames 產生影片。

```text
Post / Brief
  -> Video Angle
  -> Scene Outline
  -> Script
  -> Visual Plan
  -> HyperFrames Composition
  -> Rendered Video
```

目前狀態：

- 尚未規劃為站內 pipeline。
- HyperFrames 可作為 HTML-based video composition 與 render runtime。

後台能力：

- 選文章。
- 選影片型態：短影音、教學解說、產品導覽、文章摘要。
- 產生 scene plan、旁白稿、字幕、視覺節奏。
- 後續接 HyperFrames project scaffold / preview / render。

優先度：低到中。價值高，但牽涉腳本、視覺、音訊、render pipeline，建議在圖卡與簡報之後做。

### 26. Canvas Render Pipeline

把結構化內容渲染成圖片。這條是 render pipeline，不是內容生成 pipeline。

```text
Post / Brief / Table / Quote
  -> Visual Spec JSON
  -> HTML / CSS / Canvas Template
  -> Screenshot / Canvas Render
  -> PNG / JPG / WebP
```

可產出：

- 文章封面圖。
- OG image。
- IG / Threads / LinkedIn 圖卡。
- 資訊圖表。
- Quote card。
- Comparison table image。
- 學習卡圖片。
- Podcast cover。
- YouTube thumbnail。
- HyperFrames 影片中的靜態場景素材。

目前狀態：

- 尚未作為獨立 pipeline 規劃。
- repo 已有 Playwright dependency，適合先用 HTML/CSS screenshot，而不是直接手寫 `<canvas>`。

後台能力：

- 選 template。
- 輸入或接收 `visual_spec` JSON。
- 選尺寸，例如 `1200x630`、`1080x1080`、`1080x1920`。
- 預覽圖片。
- 匯出 PNG / JPG / WebP。
- 記錄 artifact path。

優先度：中。它可以支援圖卡、資訊圖表、學習卡、podcast cover、YouTube thumbnail、HyperFrames 靜態素材。第一版建議用 HTML/CSS + Playwright screenshot，真正 `<canvas>` 留給需要精準繪圖、chart 或特殊視覺時再用。

## 建議優先順序

### 第一批

```text
1. translation
2. post-quality
3. content-ops
4. summary / metadata
5. internal-link
6. data-table
```

理由：

- 都主要依賴現有 Markdown。
- 不需要先解決外部資料源穩定性。
- 後台價值明確。
- 可以先產生草稿或建議，不碰自動發布。

### 第二批

```text
7. deep-research
8. research-to-post
9. freshness-update
10. mind-map
11. quiz
12. learning-card
13. card-carousel
14. canvas-render
```

理由：

- 開始牽涉更完整的來源管理、學習設計或衍生內容審閱。
- 其中 deep research 和 data table 會成為後續簡報、文件、影片的上游基礎。

### 第三批

```text
15. presentation
16. document
17. yt-to-post
18. infographic
19. podcast
20. article-to-hyperframes-video
21. knowledge-graph
22. social-repurpose
23. newsletter / digest
```

理由：

- 屬於內容價值放大、跨媒體製作或知識產品化。
- 視覺、音訊、影片與外部 URL 來源都有更高的品質與審閱成本。
- 不應阻塞第一階段後台與 runner 基礎設施。

## 後台管理模型

建議新增統一頁面：

```text
/admin/pipelines
```

每條 pipeline 都有共同欄位：

```text
id
name
status: enabled / disabled / planned
category: production / maintenance / infrastructure / interaction / distribution
trigger: manual / scheduled / on-publish
input_type: post / url / topic / all-posts / query / category / series / research-brief
stages
provider
model
last_run
last_status
output_artifacts
```

概念畫面：

```text
Pipeline Registry

translation        enabled   manual      post       last run: success
post-quality       enabled   on-publish  post       last run: success
content-ops        enabled   manual      all-posts  last run: warning
summary            planned   manual      post       -
internal-link      planned   manual      post       -
data-table         planned   manual      post       -
deep-research      planned   manual      topic      -
mind-map           planned   manual      post       -
quiz               planned   manual      post       -
learning-card      planned   manual      post       -
card-carousel      planned   manual      post       -
canvas-render      planned   manual      visual     -
yt-to-post         planned   manual      url        -
hyperframes-video  planned   manual      post       -
rag-chat           enabled   runtime     query      managed in /admin/rag
embedding          enabled   manual      all-posts  managed in /admin/rag
crawl              enabled   scheduled   docs-site  managed in /admin/rag
```

## 建議 OpenSpec 拆分

不要用一個大型 OpenSpec 同時完成所有 runner。建議拆成：

### 1. `content-pipeline-admin`

範圍：

- Pipeline registry
- `/admin/pipelines`
- `/api/admin/pipelines`
- D1 tables for pipeline definitions / runs / stage logs
- 先顯示與管理設定，不要求所有 pipeline 都能完整執行

### 2. `translation-pipeline-runner`

範圍：

- 自動化現有三段 prompt。
- 從後台選文章執行。
- 產生英文 Markdown 草稿。
- 記錄 stage output。

### 3. `post-quality-admin-runner`

範圍：

- 後台觸發 `check:post-quality` / `check:references` 等同等邏輯。
- 顯示 report。
- 形成發布前檢查入口。

### 4. `yt-to-post-pipeline-runner`

範圍：

- YouTube URL input。
- Transcript / NotebookLM integration。
- Draft post generation。
- 人工補充與引用檢查。

這條建議晚一點做，因為外部依賴最不穩。

### 5. `deep-research-pipeline-runner`

範圍：

- Topic input。
- Research plan、source collection、claim extraction、evidence table。
- 產生可供文章、簡報、文件、影片共用的 research artifact。

### 6. `derived-learning-assets-runner`

範圍：

- Quiz、learning cards、mind map。
- 從文章或文件生成學習素材。
- 輸出 JSON / Markdown / CSV 等可重用格式。

### 7. `article-to-video-hyperframes-runner`

範圍：

- 文章轉 scene outline、script、subtitle plan。
- 產生 HyperFrames composition。
- Preview / render / artifact tracking。

這條應等 pipeline registry、圖卡或簡報類衍生內容穩定後再做。

### 8. `canvas-render-pipeline-runner`

範圍：

- 接收 `visual_spec` JSON。
- 管理 template、尺寸、theme。
- 用 HTML/CSS + Playwright screenshot 產圖片。
- 後續再視需要加入真正 `<canvas>` renderer。

## 開放問題

- 後台 pipeline runner 要跑在 Cloudflare Workers，還是先只做 local CLI + 後台顯示紀錄？
- 長任務如何處理 Workers timeout？需要 queue / background job 嗎？
- LLM provider key 放哪裡？是否沿用既有 RAG model routing settings？
- stage prompt 是存在 repo 檔案、D1 settings，還是兩者混合？
- pipeline output 要直接寫入 git workspace，還是先存成 D1 artifact 由人工複製/套用？
- 是否需要 run diff viewer，讓使用者審閱自動修改前後差異？
- 哪些 pipeline 可以 scheduled，哪些只能 manual？
- 衍生內容之間是否共用同一個 research artifact，避免每條 pipeline 重複研究？
- 簡報、圖卡、資訊圖表、影片的視覺輸出要先做 brief，還是直接產可渲染資產？
- 學習卡與測驗是否需要題庫資料模型？
- HyperFrames 影片要跑在本機 CLI，還是後台只負責建立 render job？
- Canvas Render Pipeline 的 template 要放在 repo、D1，還是以 registry 形式管理？

## 初步建議

第一個 OpenSpec 應該只做 `content-pipeline-admin`，建立 registry、run record、admin UI 與 API。Runner 先接既有已穩定的 deterministic pipeline，例如 content-ops 或 post-quality。

第二個 OpenSpec 再做 `translation-pipeline-runner`。這條已經有 prompt，且輸出是 draft，不會影響已發布內容。

第三個方向建議不要直接做影片或 podcast，而是先做 `deep-research` + `data-table` + `mind-map` 這種上游結構化 artifact。它們會讓簡報、文件、圖卡、資訊圖表、測驗和 HyperFrames 影片的品質更穩。
