# 抽取紀錄：Amanbayev, Tsan, Dang & Rusu (2026) Filtered Approximate Nearest Neighbor Search in Vector Databases: System Design and Performance Analysis

read_status=full（arXiv v1 PDF 35 頁全文，含附錄 A 圖 14–17）

## 書目

- Abylay Amanbayev, Brian Tsan, Tri Dang, Florin Rusu（University of California Merced）。
- arXiv:2602.11443 **v1**（2026-02-11，cs.DB；arXiv 只有 v1）。未見正式發表資訊。
- 程式與資料：https://github.com/aabylay/ANN-benchmark-HQ（文中 [3]）。
- 讀取方式與全文檔：curl https://arxiv.org/pdf/2602.11443（1,210,493 bytes）→ pdftotext -layout → scratchpad/fulltext/o17-fann2026.txt（1,971 行、158,456 bytes）；加行號去空行版 o17raw/fann-numbered.txt（1,619 行），已讀全部（正文行 1–1556、參考文獻 1560–1778、附錄 1784–1966）。圖多為 QPS–Recall 曲線，pdftotext 只取到軸標，**曲線數值無法從文字讀出**；以下數字只取自正文文字。
- scratchpad 完整路徑：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/
- 下文「行」為 o17-fann2026.txt 原始行號（fann-numbered.txt 保留原行號）。

## 研究設計

- 系統：FAISS 1.12.0、Milvus v2.6.6、pgvector 0.8.1（PostgreSQL 16）（行 957–960）。索引 HNSW 與 IVFFlat（行 965–980）。
- 資料：自建 MoReVec（IMDb 電影與影評），gte-base-en-v1.5 768 維；三種規模，最大 Movies 551,155、Reviews 2,598,267（行 770–784）。
- 過濾：**只用純量不等式**（如 rating >= threshold），不測類別、字串、多屬性組合（行 1047–1049）。選擇性 σg 從 0.0003 到 0.5（行 893–895）。
- 查詢：每資料集 1,000 個查詢向量 × 7 種過濾 × k∈{1,10,40,100} = 28,000 次（行 922–926）。單執行緒、in-memory（行 1029–1038）。
- 真值：先套過濾再做精確 k-NN（行 1039–1042）。

## 可引用結果（原文）

1. **過濾一般會降低召回**（行 1053–1059）："an increase in filter selectivity consistently exerts negative pressure on recall for both HNSW and IVFFlat implementations. This degradation occurs regardless of whether a pre-filtering or post-filtering strategy is employed ... Milvus is the notable exception, maintaining higher recall at low selectivity due to its hybrid architecture"。（注意：原文「increase in filter selectivity」用語與其自訂定義相反，上下文意思是過濾越嚴、召回越低。）
2. 結論句（行 1082）："Filter selectivity acts as a universal constraint on recall."；實務建議 2（行 1473–1475）："Filtered ANNS inherently degrades recall as selectivity decreases—regardless of system or index. Treat recall loss as a budgeted resource. For critical queries, expose search-parameter overrides or allow fallback to exact search when candidate exhaustion is detected."
3. **後過濾的機制**（行 587–597）："It often performs well in terms of search latency but may suffer from reduced recall."；"For low selectivity predicates uncorrelated with vector similarities, this can lead to incomplete top-k results (fewer than k survivors)."
4. pgvector 後過濾在 k 變大時召回陡降（行 1098–1103）："many true neighbors are never examined because they were not among the top-efSearch candidates in the unfiltered vector space, causing a precipitous drop in recall."
5. **Milvus 例外的原因**（行 1313–1326）：Dual-Pool 佇列讓被過濾掉的節點不佔搜尋預算；"At high filter rates (e.g., 90% filtered out), the search beam becomes saturated with invalid navigation nodes, causing recall to plummet"（指標準 FAISS HNSW）；Milvus 在被過濾比例超過 **93%**（程式碼門檻）時直接改暴力搜尋，"1–5ms for typical segments" 且 "guaranteeing 100% recall"。
6. pgvector 最佳化器選錯計畫（行 1422–1431）：屬性索引＋精確 k-NN 的計畫 "consistently yields perfect recall"，但最佳化器常選近似索引掃描；建議 7（行 1495–1497）"Do not blindly trust query optimizers. Verify query plans manually (EXPLAIN ANALYZE)"。
7. 選索引的門檻建議（行 1469–1472）："For workloads where expected selectivity σg ≲ 5%, consider IVFFlat; for σg ≳ 20% or predominantly unfiltered queries, HNSW remains preferable."
8. 過濾本身的成本很小（行 1076–1079）：FAISS 產生 bitset "negligible overhead (< 1 ms on the large datasets)"；HNSW 的 QPS 對選擇性幾乎不敏感（行 1063–1066）。
9. 同樣選擇性下個別查詢差很多（行 1300–1303）：GLS 相關性低（ρq < −0.3）的查詢召回較低；"while σg determines the average system behavior, GLS correlation explains the per-query variance that individual users may experience."

## 限制（作者自述，行 1515–1526）

- 結果依所測參數範圍；只測 in-memory、單執行緒；不一定推廣到其他嵌入模型、非正規化向量、**與嵌入空間高度相關的 metadata**、分散式部署；不適用 ACORN 等融合方法。
- 本紀錄另加：實驗的過濾欄位是電影評分與影評票數，**不是權限 ACL**。權限過濾的選擇性取決於組織（一般員工能看到的比例可能很低），這段推論本文沒有驗證。
- 正文沒有給「召回從多少掉到多少」的數字表；數值只在圖上。

## 與範圍卡說法的核對

- 範圍卡「過濾會降低向量搜尋召回，要量過濾後召回（Filtered ANN 2026）」：**大致正確，要加條件**：
  1. 召回下降發生在「近似索引＋嚴格過濾」，而且**依引擎而定**：Milvus 會自動退回精確搜尋，在嚴格過濾下反而 100% 召回（行 1321–1326）；pgvector 有屬性索引時可走精確計畫拿到完美召回（行 1422）。
  2. 本研究的過濾是純量欄位，不是權限；寫成「權限過濾會降低召回」是推論，要寫「這類過濾」。
  3. 「量過濾後召回」：本文的做法是「先過濾、再精確 k-NN」當真值，和近似結果比對（行 1039–1042）——讀者可照做：同一查詢、同一使用者權限，比較精確搜尋與實際系統回傳的前 k 筆。
- 反證／限制來源互補：pgvector README（pgvector-readme-filtering.md）給了具體數字「條件命中 10% 的列、ef_search 40 → 平均只剩 4 筆」。

## 對 order 17 的用法

- 「過濾放在哪」的取捨：前過濾（索引內）召回較穩，後過濾（先搜再刪）延遲低但可能回不滿 k 筆；選擇性很低時直接精確搜尋最可靠。
- 給讀者的檢查：用一個權限很窄的帳號問問題，看回傳筆數是否少於設定的 k、是否漏掉該帳號看得到的正確文件。
