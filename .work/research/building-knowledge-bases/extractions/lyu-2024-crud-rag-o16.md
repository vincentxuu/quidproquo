# 抽取紀錄：Lyu et al. (2024) CRUD-RAG: A Comprehensive Chinese Benchmark for Retrieval-Augmented Generation of Large Language Models（order 16 用：overlap、檢索器、embedding 段）

read_status=full（arXiv v3 全文 31 頁；第 1–5 節與參考文獻讀完；第 3.2–3.3 節資料建構與圖 3 範例表略讀；沒有附錄）

## 書目

- Yuanjie Lyu、Zhiyu Li（共同一作）、Simin Niu、Feiyu Xiong、Bo Tang、Wenjin Wang、Hao Wu、Huanyong Liu、Tong Xu（通訊）、Enhong Chen。中科大、上海算法創新研究院、人大、360 AI 研究院。
- 正式版：ACM Transactions on Information Systems（TOIS），DOI: 10.1145/3701228，2024-10 線上刊出（Exa 檢索結果核對 DOI 與刊名）。
- 預印本：arXiv:2401.17043，v1 2024-01-30、v2 2024-02-19、v3 2024-07-15（"40 Pages"）。
- 讀取：curl https://arxiv.org/pdf/2401.17043（v3，2,115,072 bytes）→ pdftotext -layout → scratchpad/fulltext/o16-crudrag2024.txt（1,856 行、155,888 bytes）。已讀行 1–506、700–1700（含表 3–9、建議段、結論）；行 507–700（摘要與續寫資料集建構）略讀；1700–1856 為參考文獻。
- 注意：v3 PDF 頁首仍是 ACM 範本殘留的「J. ACM, Vol. 37, No. 4, Article 111, August 2018」，不是真實出處；引用用 TOIS DOI。
- 本站既有文章 zh-tw-embedding-rag-failures 已引用此論文（簡中 RAG 全組件評測）。

## 研究設計（order 16 相關）

- 語料：2023 年 7 月後的中文新聞約 30 萬篇，去重過濾後 8 萬多篇；檢索庫 86,834 篇（表 2，行 447–503）。簡體中文。
- 題目：GPT-4 生成；多文件 QA 由三位母語者人工檢查五分之一，5.8% 需修改（行 747–803）。
- 基準設定（行 926–935）：chunk 128、overlap 0%、bge-base、dense 檢索、top-k 8、GPT-3.5。一次只改一個元件。overlap 測 0/10/30/50/70%；檢索器 dense／BM25／hybrid／hybrid+rerank（bge-reranker）。
- 為省成本只跑 1/5 資料（行 941–942）。
- 指標：BLEU、ROUGE-L、BERTScore、RAGQuestEval（以參考答案生成問題，量關鍵資訊的 precision 與 recall）；檢索另算 MRR。

## 可引用結果（數字照原文）

1. **overlap（表 4，行 1035–1069；4.3 節行 1080–1136）**：單文件 QA 的 RAGQuestEval recall 從 overlap 0% 的 70.82 升到 70% 的 73.94，precision 52.67 → 54.06；雙文件 QA recall 56.73 → 59.53。三文件 QA 與幻覺修正幾乎不變。作者原句（行 1125–1130）："as chunk overlap increases, the accuracy and recall of key information in single-document question answering tasks improve substantially."
2. 作者建議（表 9 與行 1606–1611）：創作、摘要、問答 "a large chunk overlap value should be maintained"；改錯任務可用小 overlap。
3. **檢索器（表 5，行 1146–1184；圖 7）**：單文件 QA 的 RAGQuestEval recall：BM25 69.17、Dense 70.82、Hybrid 70.83、Hybrid+Rerank 73.92；MRR（圖 7）單文件 QA BM25 49.1、Dense 49.8、Hybrid+Rerank 52.5。幻覺修正任務 BM25 ≥ dense。
4. 作者結論（行 1629–1634）："the hybrid algorithm that combines dense and BM25 retriever has very limited improvement on the overall quality of the generated results. However, by using a rerank model ... the performance of almost all tasks improved". 註：本文的 hybrid 是「兩邊結果合併後**隨機抽 k 個**」（行 1195–1198），不是 RRF 或加權融合，這可能是 hybrid 沒效的原因之一。
5. **embedding 排名不等於 RAG 表現（4.5 節，行 1334–1355）**：依 MTEB 檢索應為 GTE > STELLA > BGE > M3E；但 m3e-base 在幻覺修正任務四個模型中各指標最好，"These results further show that the retrieval benchmark may not be fully appropriate for RAG." MRR 上四個模型 "relatively close ... with no single method outperforming the others in all tasks"。
6. chunk 大小（表 3，行 970–1010）：單文件 QA 128 或 256 最好，512 下降；多文件 QA 越大越好（3 文件 recall 64 塊 47.95 → 512 塊 57.38）。不同任務的最佳值不同。

## 沒寫的事

- 沒有任何統計檢定或變異數；overlap 的提升多在 1–3 點，無法判斷是否超出雜訊（只跑 1/5 資料、單次）。
- overlap 實驗中塊大小固定 128、top-k 固定 8：overlap 越大，8 個塊涵蓋的不重複內容越少，作者在三文件 QA 自己提到這點（行 1130–1132）。
- 沒報 overlap 造成的索引成本。
- 題目由 GPT-4 從新聞生成，偏抽取式事實題。

## 作為反證的分量

- 這是目前讀到「overlap 有幫助」中，唯一的同儕審查、中文、端到端研究；方向與 Bennani 2026、Qu 2025 相反。
- 但證據弱：效果 1–3 點、無檢定、單次、塊很小（128 token）。可以寫成「也有研究在中文新聞上看到 overlap 提升單文件問答的關鍵資訊召回約 3 個百分點」，不宜寫成「overlap 有效」。
- 三篇合起來的穩妥說法：overlap 的效果小而且依設定而定，要用自己的題庫量，量不出差別就不要開（它一定讓索引變大）。

## 對 order 16 的用法

- 反證段落：overlap（第 1、2 點）。
- 「關鍵字或向量」：中文新聞上 BM25 與 dense 差不多，混合本身沒什麼提升，加 rerank 才有——提醒讀者「混合」實作方式很重要（本文是隨機抽樣合併）。
- 「embedding 只講直覺」：排行榜順序與實際 RAG 任務不一致（第 5 點）。
