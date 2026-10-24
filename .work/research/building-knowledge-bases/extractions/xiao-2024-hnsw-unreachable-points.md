# 抽取紀錄：Xiao, Zhan, Xi, Hou & Liao (2024) Enhancing HNSW Index for Real-Time Updates: Addressing Unreachable Points and Performance Degradation

read_status=full（arXiv v2 PDF 10 頁全讀，含圖說與參考文獻）

## 書目

- Wentao Xiao、Yueyang Zhan、Rui Xi（通訊作者）、Mengshu Hou、Jianming Liao（UESTC 成都）
- arXiv:2407.07871，v1 2024-07-10，v2 2024-07-15，cs.IR。abs 頁無期刊／會議資訊，視為預印本。
- 讀取：curl https://arxiv.org/pdf/2407.07871v2（1,041,283 bytes，10 頁）→ pdftotext -layout → o18-xiao2024.txt（751 行，99,388 bytes），已讀 1–751。
- 目錄：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/
- 行號指 o18-xiao2024.txt（雙欄混排）。

## 研究設計

- 對象：hnswlib 的刪除與更新（markDelete 標記刪除＋replaced update 把新點塞進已刪點的位置，行 158–186）。
- 資料：SIFT 1M（128 維）、GIST 1M（960 維）、ImageNet 2.34M（150 維）、SIFT2M（行 464–477）。都是 ANN 標準資料集，不是文字 RAG 語料。
- 情境（行 480–513）：full coverage（100 輪、每輪刪除再插回 1%）、random（200 輪、每輪 10,000 筆）、new data（SIFT2M，10 輪、每輪刪 10 萬舊插 10 萬新）。
- 硬體：Xeon E5-2678 v3、110 GB、40 threads（行 431–434）。

## 可引用結果

1. 不可達點（行 188–220）：定義為「有出邊、在所有層都沒有入邊」的點；建索引時幾乎不會出現，但 replaced update 修補連線時可能把某些點的入邊全拆掉。除非剛好是入口點，否則之後永遠搜不到。
2. 量（行 193–221；圖 3）：SIFT 每輪隨機刪 5% 再插回，約 3,000 輪後不可達點達原資料的 3%–4%，且持續增加；recall 下降約 3%；"cannot be mitigated by adjusting HNSW searching parameters, such as increasing the ef parameter."
3. 其他資料集（行 554–562）：HNSW-RU 跑 200 輪後，GIST 不可達點約 3%–4%、ImageNet 約 2%–3%。
4. 效率（行 168–177；圖 1）：在約 90% recall 時，replaced update 比查詢慢；GIST、ImageNet 插入速度慢 5–10 倍。作者的 MN-RU 更新快 2–4 倍（行 570–574）。
5. 為什麼不直接重建（行 274–282）：重建與重連可恢復連通性，但代價是運算資源、時間、服務中斷與系統複雜度；作者的折衷是另建 backup index，替換次數超過 τ=40,000 時重建（行 341–350、636–639）。
6. RAG 情境的動機（行 56–61、96–102）：使用者改內容＝插新點、刪舊點；若相關點變得不可達，檢索結果就錯，影響生成。

## 沒寫的事

- 沒測文字 embedding 或真實 RAG 問答；數字是 ANN benchmark 的 recall@K。
- 沒討論「被刪的點會不會還被搜到」——markDelete 的點不回傳，問題是活著的點變不可達。
- 沒比較其他向量庫（Pinecone、Vectorize 等託管服務的內部實作未知）。
- 只和原生 HNSW-RU 比；作者自己的方法有利益衝突。

## 限制

- 預印本、單一團隊；極端情境（同一批點反覆刪插上千輪）。
- 3% 的 recall 下降要放在高 churn 的前提下解讀；更新少的知識庫影響可能很小，論文沒測。
- 後續工作（PRO-HNSW、Wolverine VLDB 2025，只看過搜尋摘要、沒精讀）報告更大的下降（例如 50% 資料翻新後最大 recall 降 14.7%–14.9%），不在本紀錄引用範圍。

## 對 order 18 的用法

- 限制面：「增量更新永遠比全量重建好」不成立。在原地反覆刪改的圖索引，品質會慢慢變差，調查詢參數補不回來；所以「定期全量重建」不只是應付 schema 變更，也是索引保養。
- 寫法要保守：「一篇 2024 年預印本在 ANN 標準資料集上測到，HNSW 反覆刪除再插入 3,000 輪後，約 3–4% 的點再也搜不到，recall 掉約 3%」。不要寫成「向量庫刪除會壞掉」。
