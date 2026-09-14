# 搜尋系統：業界典範與專案實戰

Last updated: 2026-08-30

Status: series and eight-case selection approved by user on 2026-08-30; evidence refreshed through thirteen research rounds. Order 0–5 are ready for article production.

## 決定

值得寫，但不是再開一套 BM25／向量搜尋名詞課。系列共 12 篇（order 0–11），分成兩部：

1. **業界典範**：從可驗證的 production 架構歸納搜尋系統模式。
2. **專案實戰**：用 quidproquo 的索引、檢索、回答、呈現與評估路徑落地。

既有 `RAG 技法大全` 負責單項技法，`Cloudflare AI Stack` 負責產品能力，`私有語料管線` 負責資料生命週期。本系列只處理「整套搜尋系統如何把這些責任接起來」。

## 目標讀者

- 已經做過關鍵字搜尋或 RAG demo，開始遇到召回、排序、freshness、權限與可信度問題的工程師。
- 想從一個真實小型 production 系統理解業界架構，但不想先讀完一整本 Information Retrieval 教科書的人。

## 母群定義與選案規則

母群定義：**公開、可驗證、已用於 production 的搜尋系統；至少揭露索引、候選召回、排序、權限、服務或評估其中一層。**

納入：

- 網站／文件搜尋、產品／電商搜尋、企業權限搜尋、answer engine／RAG 搜尋。
- 自建、開源與 managed service，只要有足夠的工程證據。
- 成功架構、replatform、事故或撤回案例。

排除：

- 只有功能清單的 vendor 行銷頁。
- 沒有 production 脈絡的純論文。
- 外部網頁搜尋／爬取供應商比較；那屬於 `搜尋與爬取實戰`。
- 只比較 vector database API；站內已有選型與產品專文。

後續研究一律使用 Groundlane，優先讀官方 engineering blog、架構文件、公開原始碼、正式 postmortem 與論文全文。

### 覆蓋矩陣

八個主案例經十二輪補搜後定案：GOV.UK site search、Read the Docs、Wikimedia CirrusSearch、Coupang、Assembled、Dropbox Nautilus、GOV.UK Chat、Zalando search incident。完整選案、備用案例與偏誤見 [研究紀錄](../.research/2026-08-30-search-systems-case-selection.md)。

| 維度 | 必須覆蓋的值 | 為什麼會改變決策 |
|---|---|---|
| 搜尋介面 | site/docs、product/e-commerce、enterprise、answer/RAG | query intent、結果合約與評估方式不同 |
| 規模 | 小型 production、中型 SaaS、大規模平台 | 小站不該照抄 hyperscale 拓撲 |
| 召回路線 | lexical、dense、hybrid／多 lane | failure mode 與成本不同 |
| 排序路線 | 規則／BM25、RRF、reranker／LTR | 排序資料與延遲預算不同 |
| 核心約束 | freshness、ACL、multilingual、latency 至少各一例 | 這些約束會改變索引與 serving 架構 |
| 建置模式 | self-built／open source、managed | 控制力與維運責任不同 |
| 生命週期 | 穩定運行、replatform、失敗／回退至少一例 | 避免只看倖存架構 |

十三輪研究後，RRF 證據仍分成五種：Assembled 的 commercial live workload、I-GUIDE 的 production system＋controlled ablation＋public code／row-level artifact、Gmail 的 live experiment、Airgentic 的歷史 adoption→linear migration、OpenSearch 的 controlled counterexample。Assembled 現有 2024-05-28 工程文與 2025-09-19 官方 product explainer 兩個 explicit RRF 時間點；2026-02-12 vendor case另補後段 reranker 的數週 production A/B 與 100% traffic rollout，但完全沒說 RRF 是否仍在底層，也沒有 RRF-specific outcome。I-GUIDE release notes另建立 2025-06 至 2026-03 的 Smart Search maintenance trail，但從未點名 RRF；external rerun／獨立 labels仍未找到。大型 consumer persistent RRF＋RRF-specific A/B仍是 open gap。

非英語端到端 relevance 可由 Taobao DeepBoW 與 Coupang 支撐。Yahoo NorthStar 作者 PDF 直接核實 2012 台灣 bucket test 的 CTR `+15.2%`、LDT click ratio `+18.9%`、clicks／1,000 visitors `+25.3%`；論文沒有 Taiwan-attributed zh-TW query，新 treatment 也沒有台灣 human qrels。飛比有 native zh-TW query／live SERP／人工 grading workflow，仍缺 numeric metric／exact ranking A/B。第十三輪逐層盤點第一網站公開 sitemap 與 media archive，沒有找到漏查的 deck／paper／benchmark；Yahoo-Kimo 年度熱門詞也無法連到 NorthStar 7 月 experiment buckets。兩案不能拼接。完整收束與來源邊界見 [第十三輪研究紀錄](../.research/2026-08-30-search-systems-gap-round13-closure.md)。

偏誤預告：公開材料通常偏大型公司與成功案例；目前已有簡中、繁中、韓文、日文與全球多語 production 證據，但台灣本地與低資源語言仍薄，正式寫作也必須保留中小型部署與失敗／回退案例。

### 業界案例研究閘門

Order 1–5 不得從熟悉的公司直接挑案例後開寫。研究先完成以下 artifact，再交付選案確認：

1. 用 Groundlane 系統性掃描官方 engineering blog、架構文件、正式 postmortem、公開原始碼與論文全文，建立至少 12 個候選系統的母群清單。
2. 以覆蓋矩陣篩成 6–8 個主要案例；同一案例可以出現在多篇，但每次只能負責一個可驗證的架構決定。
3. 最終案例至少覆蓋：四種搜尋介面、大／中小兩種規模、lexical／dense／hybrid、self-built／managed、非英語或多語搜尋，以及一個失敗、回退或 replatform 案例。
4. 每個案例保存來源、查證日期、production 脈絡、可支持的主張與不能外推的邊界；沒有工程證據的 vendor 功能頁只留在候選清單，不進正文。
5. 若非英語、中小型或失敗案例仍找不到，在 research note 與 order 0 開頭明列缺口，不用大型英語成功案例假裝全貌。

## 學習弧線

```
讀者看得到的搜尋框與答案
    → 不同搜尋產品承諾的結果為何不同
      → 索引如何維持新鮮且可刪除
        → 候選如何從 lexical／dense lane 被找回
          → 候選如何融合、重排並形成結果
            → 哪些顯示 gate 守住 production
              → 回到 quidproquo，看同一套責任如何落到程式碼
                → 用真實事故與 shadow rollout 驗證取捨
```

## 完整規劃

### 共用入口

| order | 主題 | 聚焦問題 | 狀態 | 對應來源 |
|---|---|---|---|---|
| 0 | 搜尋系統不是一個搜尋框：從內容同步到可信答案的七層地圖 | 一個 query 進來前後，系統到底有哪些責任？ | 待寫 | 本 repo 全資料流 |

### 第一部：業界典範

| order | 主題 | 聚焦問題 | 狀態 | 對應來源 |
|---|---|---|---|---|
| 1 | 四種搜尋產品不是同一題：Site、Product、Enterprise、Answer | 介面看起來都是搜尋框，為什麼資料與評估合約完全不同？ | 待寫 | 覆蓋矩陣的介面軸 |
| 2 | 索引生命週期：Batch、Incremental、Streaming、Delete | 怎麼讓搜尋結果跟得上來源變更，還能確實刪除？ | 待寫 | 業界 indexing／freshness 案例；連回私有語料管線 |
| 3 | 候選怎麼找回來：Lexical、Dense 與 Hybrid Lanes | 哪些 candidate lane 應並行，何時單一路線反而更好？ | 待寫 | 業界 candidate retrieval 案例；技法原理連回 RAG 技法大全 |
| 4 | 候選怎麼變成結果：Fusion、Reranker 與 LTR | fusion 與 ranking 各修正什麼錯，何時不值得再加模型？ | 待寫 | 業界 ranking／relevance 案例；公式與模型原理不在本系列重教 |
| 5 | Production 搜尋的顯示契約：ACL、Freshness、Latency、Fallback、Evaluation | 一筆結果送到畫面前，必須通過哪些不可互相抵銷的 gate？ | 待寫 | 權限搜尋、postmortem、shadow／A/B eval 案例 |

### 第二部：quidproquo 專案實戰

| order | 主題 | 聚焦問題 | 狀態 | 對應來源 |
|---|---|---|---|---|
| 6 | 文章怎麼進索引：D1、FTS5、Vectorize 與 Delete Queue | Markdown 更新後，如何形成可重跑、可刪除、不漏向量的雙索引？ | 待寫 | `src/lib/indexing/post-sync.ts`、`src/lib/indexing/pipeline.ts` |
| 7 | Search Page 怎麼排：Keyword、Vectorize、AI Search 與 Weighted RRF | 多來源 fan-out 如何設定 visible／shadow／weight／timeout？ | 待寫 | `src/components/Search/SearchWidget.tsx`、`src/pages/api/search.ts`、`src/lib/retrieval/tools/ai-search.ts` |
| 8 | Ask AI 怎麼把搜尋變成回答：Research、Writer、Validation、Critic | 檢索、生成、引用驗證與來源顯示怎麼接成一條線？ | 待寫 | `src/pages/api/chat.ts`、`src/lib/conversation/pipeline.ts`、`src/lib/retrieval/agents/`、`src/lib/retrieval/presentation.ts` |
| 9 | 中文召回事故一：D1 FTS5 為什麼只回 10 筆 | CJK tokenizer、limit、pagination 的第一個真實失敗 | 既有，待改寫系列入口 | `src/content/posts/tech/2026-08-26-d1-fts5-hybrid-search-cjk-recall.md` |
| 10 | 中文召回事故二：為什麼 0 筆拒答卻推薦正確文章 | 分詞、metadata lane、Vectorize fallback 與證據呈現如何一起失效？ | 既有，待改寫系列入口 | `src/content/posts/tech/2026-08-28-rag-chinese-query-empty-search-results-debug.md` |
| 11 | Shadow 到 Visible：沒有 raw run 就不切搜尋後端 | 如何用繁中 qrels、per-lane 結果、latency 與失敗率決定 AI Search 是否上線？ | 阻塞：待真實 eval artifact | `.work/cloudflare-ai-search-evaluation.md` |

## 每篇範圍卡

### Order 0：七層地圖

- 講：source → sync → index → candidate → rank → answer/present → evaluate。
- 不講：BM25 公式、embedding 模型原理、特定 vendor API。
- 讀完能：看到任何搜尋架構圖時，先問哪一層缺了。

### Order 1：搜尋產品契約

- 講：site/docs、product/e-commerce、enterprise、answer/RAG 的 query intent、結果形狀與評估單位。
- 不講：產品排行榜、星數、沒有工程證據的功能比較。
- 讀完能：先寫出搜尋產品承諾，再討論索引或模型。
- 前置：order 0。

### Order 2：索引生命週期

- 講：batch、incremental、streaming、delete／tombstone 與 freshness SLA 的架構取捨。
- 不講：特定資料庫 API 或 quidproquo 實作細節；後者留給 order 6。
- 讀完能：依來源更新頻率、刪除要求與可接受延遲，選擇同步策略。
- 前置：order 0–1。

### Order 3：候選召回

- 講：lexical、dense 與 hybrid lane 的責任、失敗形狀、fan-out 與 candidate budget。
- 不講：BM25 公式、embedding 訓練、RRF 或 reranker 細節；連回 RAG 技法大全。
- 讀完能：為一種 query intent 選擇單 lane 或多 lane，並說出多一路的成本。
- 前置：order 1–2。

### Order 4：融合與排序

- 講：score 不可直接比較時的 fusion、reranker／LTR 的位置、feature 與 latency budget。
- 不講：重新教模型原理，或把離線 relevance 提升直接當成 production 成功。
- 讀完能：判斷問題出在 candidate 缺失還是排序錯誤，避免拿 reranker 修召回。
- 前置：order 3。

### Order 5：顯示契約

- 講：ACL、freshness、latency、fallback 與 evaluation 作為五個分離 gate；任何一項 hard failure 都不能被總分抵銷。
- 不講：各家 observability／A/B testing 產品功能列表。
- 讀完能：為搜尋結果寫出「可以顯示／必須降級／必須拒絕」的 decision table。
- 前置：order 1–4。

### Order 6：索引實作

- 講：stable chunk ID、source hash、desired／embedded hash、tombstone、delete queue、D1 batch。
- 不講：通用 chunking 技法；連回既有專文。
- 讀完能：追一篇文章更新／刪除時會改哪些表與向量。
- 前置：order 2。

### Order 7：Search Page

- 講：三個 source lane、設定驅動 fan-out、weighted RRF、pagination、timeout、shadow。
- 不講：Ask AI 的生成與 citation validation。
- 讀完能：判斷某個來源為何有跑、卻不影響使用者看到的排序。
- 前置：order 3、4、6。

### Order 8：Ask AI

- 講：query plan、retrieval retry、writer context、deterministic validation、critic、degrade、source gate。
- 不講：前台 Search Page pagination；不重複 Agent 通用架構。
- 讀完能：追一個問題從 `/api/chat` 到 sources／related cards。
- 前置：order 3–7。

### Order 9–10：事故

- 講：可重現輸入、錯誤資料流、修正、測試與第二輪缺口。
- 不講：再做一次全系統總覽。
- 讀完能：用同一套方法檢查自己的 CJK／mixed-script 查詢與 UI 證據語意。
- 納入方式：中英文都要新增 series metadata、前後篇連結，並在開頭標出故障位於七層圖的哪一跳；不能只改 frontmatter。
- 前置：order 6–8。

### Order 11：Shadow eval

- 講：固定 corpus manifest、query set、qrels、raw ranked lists、Recall@k／MRR／nDCG、p50／p95、fallback rate、promotion gate。
- 不講：沒有 raw run 的漂亮結果表；不把 adapter 存在寫成 production 成功。
- 讀完能：做出可稽核的 shadow → visible 決策。
- 前置：order 5、7–10。

## 斷崖報告

| 位置 | 問題 | 處理 |
|---|---|---|
| 0 → 1 | 從本站畫面跳到業界分類 | order 0 先用同一 query 畫出七層，再比較哪些產品省略／強化哪一層 |
| 2 → 3 | 從資料生命週期跳到 query-time | order 3 開頭先固定「索引已存在」，只問候選怎麼找回來 |
| 3 → 4 | 召回與排序容易混成一層 | order 4 先用「候選裡有／沒有正解」分流，沒有正解回 order 3，不拿 reranker 補召回 |
| 5 → 6 | 從業界模式回到 repo 細節 | order 6 用同一張七層圖標出 quidproquo 元件，不重新發明術語 |
| 8 → 9 | 完整架構突然變成事故文 | 每篇事故開頭標出壞掉的是七層圖的哪一跳 |
| 10 → 11 | 單一事故跳到正式評估 | order 11 先把單一 query 變成 query set，再引入 ranking metrics |

## 既有文章邊界

- `RAG 技法大全`：教 BM25、vector、RRF、reranking 等單項技法；本系列只引用。
- `私有語料管線`：教同步、ACL、freshness、evaluation 的通用契約；本系列寫 quidproquo 實作。
- `Cloudflare AI Search`／`Vectorize` 專文：教產品能力；本系列寫 adapter、shadow 與 rollout 決策。
- `Pagefind` 專文：當系統史前傳；order 0 簡述為何離開純靜態搜尋，不重教 Pagefind。

## 分批產出與驗收

### Batch A：入口與業界典範（order 0–5）

- 先完成案例母群、覆蓋矩陣與偏誤說明，再寫中文稿；不邊搜邊選。
- Order 0 交付一張七層責任圖與一張「四種搜尋產品」對照表。
- Order 1–5 每篇至少使用 2 個可驗證 production 案例；整批共同覆蓋 6–8 個主要案例，不要求每篇塞滿所有案例。
- 架構與事故主張優先使用官方 engineering material、原始碼、postmortem 或論文全文；vendor 功能頁只能支持產品介面，不能支持 production 成效。

### Batch B：quidproquo 實作（order 6–8）

- 每篇記錄分析基準 commit，從入口一路追到處理、儲存／外呼與回應；所有程式結論附實際檔案與行號。
- 明確分開 production visible、shadow、disabled 與本機實驗，不能把 adapter 存在或 dry-run 寫成已上線。
- 每篇至少交付一張資料流、一個可執行或可檢查的範例，以及一節 failure boundary。

### Batch C：事故整編（order 9–10）

- 保留既有 slug、date、證據與除錯敘事；只補系列入口、七層定位、前後文與必要的現況更新。
- 先用目前程式碼與測試重新核對舊文路徑，已漂移的行號與狀態不得原樣搬入系列。

### Batch D：評估收尾（order 11）

- 必備 artifact：corpus manifest、query set、document-level qrels、per-lane raw ranked lists、runner commit、provider/config fingerprint、p50／p95 latency、失敗分類與計算腳本。
- 缺任何必備 artifact 時可保留規格與阻塞說明，但不得發布結果表、勝負或 visible promotion 結論。

### 全系列共同驗收

- 中英成對、series order 對稱、互鏈完整；metadata 變更後跑 series order 與 language parity checks。
- 每篇只回答一個聚焦問題；BM25、embedding、RRF、reranker 等原理連回既有文章，不在本系列重寫。
- 每篇有 `## 參考資料`，來源覆蓋核心主張；全批完成後執行 `pnpm verify`。
- Order 0–10 可先形成可讀主線；order 11 在 raw eval 完成前明確標為阻塞，不用虛構結果湊齊系列。

## 寫作前確認（已確認）

2026-08-30 使用者已確認：

1. 兩部順序維持「業界典範 → quidproquo 實戰」。
2. Order 1 的四種介面母群符合「業界典範」範圍。
3. 原 order 3 拆成「候選召回」與「融合排序」，總篇數調整為 12 篇（order 0–11）。
4. Order 11 維持阻塞，等 raw eval artifact 齊了再寫正式結果。
