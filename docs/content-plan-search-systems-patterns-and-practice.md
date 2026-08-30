# 搜尋系統：業界典範與專案實戰

Last updated: 2026-08-30

Status: approved by user on 2026-08-30; article production has not started.

## 決定

值得寫，但不是再開一套 BM25／向量搜尋名詞課。系列分成兩部：

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

具體案例尚未選定；先固定會改變行動結論的維度：

| 維度 | 必須覆蓋的值 | 為什麼會改變決策 |
|---|---|---|
| 搜尋介面 | site/docs、product/e-commerce、enterprise、answer/RAG | query intent、結果合約與評估方式不同 |
| 規模 | 小型 production、中型 SaaS、大規模平台 | 小站不該照抄 hyperscale 拓撲 |
| 召回路線 | lexical、dense、hybrid／多 lane | failure mode 與成本不同 |
| 排序路線 | 規則／BM25、RRF、reranker／LTR | 排序資料與延遲預算不同 |
| 核心約束 | freshness、ACL、multilingual、latency 至少各一例 | 這些約束會改變索引與 serving 架構 |
| 建置模式 | self-built／open source、managed | 控制力與維運責任不同 |
| 生命週期 | 穩定運行、replatform、失敗／回退至少一例 | 避免只看倖存架構 |

偏誤預告：公開材料通常偏英語圈、大型公司與成功案例；正式研究必須另補中小型部署、非英語搜尋與失敗／回退案例。

## 學習弧線

```
讀者看得到的搜尋框與答案
  → 業界把責任拆成哪些層
    → 索引如何維持新鮮且可刪除
      → 候選如何召回、融合與排序
        → 權限、信心與評估如何守住 production
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
| 1 | 四種搜尋產品不是同一題：Site、Product、Enterprise、Answer | 介面看起來都是搜尋框，為什麼資料與評估合約完全不同？ | 待研究 | 覆蓋矩陣的介面軸 |
| 2 | 索引生命週期：Batch、Incremental、Streaming、Delete | 怎麼讓搜尋結果跟得上來源變更，還能確實刪除？ | 待研究 | 業界 indexing／freshness 案例；連回私有語料管線 |
| 3 | 候選到排序：Lexical、Dense、Hybrid、RRF、Reranker、LTR | 每一層解哪種錯，什麼時候不該再加一個模型？ | 待研究 | 業界 retrieval／ranking 案例；連回 RAG 技法大全 |
| 4 | Production 搜尋的信任邊界：ACL、Latency、Fallback、Evaluation | 找得到還不夠，什麼條件下結果才可以顯示？ | 待研究 | 權限搜尋、postmortem、shadow／A/B eval 案例 |

### 第二部：quidproquo 專案實戰

| order | 主題 | 聚焦問題 | 狀態 | 對應來源 |
|---|---|---|---|---|
| 5 | 文章怎麼進索引：D1、FTS5、Vectorize 與 Delete Queue | Markdown 更新後，如何形成可重跑、可刪除、不漏向量的雙索引？ | 待寫 | `src/lib/indexing/post-sync.ts`、`pipeline.ts` |
| 6 | Search Page 怎麼排：Keyword、Vectorize、AI Search 與 Weighted RRF | 多來源 fan-out 如何設定 visible／shadow／weight／timeout？ | 待寫 | `SearchWidget.tsx`、`pages/api/search.ts`、`ai-search.ts` |
| 7 | Ask AI 怎麼把搜尋變成回答：Research、Writer、Validation、Critic | 檢索、生成、引用驗證與來源顯示怎麼接成一條線？ | 待寫 | `/api/chat`、conversation pipeline、retrieval agents |
| 8 | 中文召回事故一：D1 FTS5 為什麼只回 10 筆 | CJK tokenizer、limit、pagination 的第一個真實失敗 | 既有，待納入系列 | `2026-08-26-d1-fts5-hybrid-search-cjk-recall` |
| 9 | 中文召回事故二：為什麼 0 筆拒答卻推薦正確文章 | 分詞、metadata lane、Vectorize fallback 與證據呈現如何一起失效？ | 既有，已更新雙語 | `2026-08-28-rag-chinese-query-empty-search-results-debug` |
| 10 | Shadow 到 Visible：沒有 raw run 就不切搜尋後端 | 如何用繁中 qrels、per-lane 結果、latency 與失敗率決定 AI Search 是否上線？ | 阻塞：待真實 eval artifact | `.work/cloudflare-ai-search-evaluation.md` |

## 每篇範圍卡

### Order 0：七層地圖

- 講：source → sync → index → candidate → rank → answer/present → evaluate。
- 不講：BM25 公式、embedding 模型原理、特定 vendor API。
- 讀完能：看到任何搜尋架構圖時，先問哪一層缺了。

### Order 1–4：業界典範

- 講：同一責任的幾種 production 模式、代表案例、選擇條件與失敗。
- 不講：產品排行榜、星數、沒有工程證據的功能比較。
- 讀完能：依自己的介面、規模與約束選架構，不照抄單一大公司。
- 前置：order 0。

### Order 5：索引實作

- 講：stable chunk ID、source hash、desired／embedded hash、tombstone、delete queue、D1 batch。
- 不講：通用 chunking 技法；連回既有專文。
- 讀完能：追一篇文章更新／刪除時會改哪些表與向量。
- 前置：order 2。

### Order 6：Search Page

- 講：三個 source lane、設定驅動 fan-out、weighted RRF、pagination、timeout、shadow。
- 不講：Ask AI 的生成與 citation validation。
- 讀完能：判斷某個來源為何有跑、卻不影響使用者看到的排序。
- 前置：order 3、5。

### Order 7：Ask AI

- 講：query plan、retrieval retry、writer context、deterministic validation、critic、degrade、source gate。
- 不講：前台 Search Page pagination；不重複 Agent 通用架構。
- 讀完能：追一個問題從 `/api/chat` 到 sources／related cards。
- 前置：order 3、4、5。

### Order 8–9：事故

- 講：可重現輸入、錯誤資料流、修正、測試與第二輪缺口。
- 不講：再做一次全系統總覽。
- 讀完能：用同一套方法檢查自己的 CJK／mixed-script 查詢與 UI 證據語意。
- 前置：order 5–7。

### Order 10：Shadow eval

- 講：固定 corpus manifest、query set、qrels、raw ranked lists、Recall@k／MRR／nDCG、p50／p95、fallback rate、promotion gate。
- 不講：沒有 raw run 的漂亮結果表；不把 adapter 存在寫成 production 成功。
- 讀完能：做出可稽核的 shadow → visible 決策。
- 前置：order 4、6–9。

## 斷崖報告

| 位置 | 問題 | 處理 |
|---|---|---|
| 0 → 1 | 從本站畫面跳到業界分類 | order 0 先用同一 query 畫出七層，再比較哪些產品省略／強化哪一層 |
| 2 → 3 | 從資料生命週期跳到 ranking | order 3 開頭先固定「索引已經存在」，只討論 query-time pipeline |
| 4 → 5 | 從業界模式回到 repo 細節 | order 5 用同一張七層圖標出 quidproquo 元件，不重新發明術語 |
| 7 → 8 | 完整架構突然變成事故文 | 每篇事故開頭標出壞掉的是七層圖的哪一跳 |
| 9 → 10 | 除錯經驗跳到正式評估 | order 10 先把單一 query 變成 query set，再引入 ranking metrics |

## 既有文章邊界

- `RAG 技法大全`：教 BM25、vector、RRF、reranking 等單項技法；本系列只引用。
- `私有語料管線`：教同步、ACL、freshness、evaluation 的通用契約；本系列寫 quidproquo 實作。
- `Cloudflare AI Search`／`Vectorize` 專文：教產品能力；本系列寫 adapter、shadow 與 rollout 決策。
- `Pagefind` 專文：當系統史前傳；order 0 簡述為何離開純靜態搜尋，不重教 Pagefind。

## 寫作前確認（已確認）

2026-08-30 使用者已確認：

1. 兩部順序維持「業界典範 → quidproquo 實戰」。
2. order 1 的四種介面母群符合「業界典範」範圍。
3. order 10 維持阻塞，等 raw eval artifact 齊了再寫正式結果。
