# 抽取紀錄：Poliakov & Shvai (2024) Multi-Meta-RAG: Improving RAG for Multi-Hop Queries using Database Filtering with LLM-Extracted Metadata

read_status=full（arXiv v2 PDF 10 頁全讀，含附錄 prompt 範本）

## 書目

- Mykhailo Poliakov、Nadiya Shvai（National University of Kyiv-Mohyla Academy）。
- arXiv:2406.13213 v2（2024-08-19）。正式版：ICTERI 2024，Springer CCIS vol. 2359，pp. 334–342，DOI 10.1007/978-3-031-81372-6_25（出處取自同作者 2026 論文的參考文獻 [3]，見 poliakov-2026-probe.md）。
- 讀取：curl https://arxiv.org/pdf/2406.13213 → pdftotext -layout。
- 全文檔：scratchpad/fulltext/o15-poliakov2024-multimetarag.txt（514 行，28,544 bytes）。已讀 1–514 全部。

## 研究設計

- 基準：MultiHop-RAG（新聞文章，2023-09-26 至 2023-12-26；題型 inference、comparison、temporal、null，行 48–65）。問題常點名來源（"Did Engadget report … before The Verge reported …"）。
- 方法（行 146–283）：用 gpt-3.5-turbo-1106 few-shot 從問題抽出過濾條件——來源（source）與發布日期（published_at），寫成 `{"source": {"$in": [...]}}`；向量庫 Neo4j，文章 metadata 存成節點屬性；先以向量相似度＋metadata 過濾取 20 個 chunk，再用 bge-reranker-large 取 top-K。chunk 256 tokens、overlap 32。
- 抽取一次平均 0.7 秒（行 155）。

## 可引用結果

1. 檢索（Table 2，行 307–322；排除 null 題）：
   - bge-large-en-v1.5：MRR@10 0.6029 → 0.6574；MAP@10 0.2687 → 0.3293；Hits@10 0.7490 → 0.8909；Hits@4 0.6661 → 0.7672。
   - voyage-02：MRR@10 0.6016 → 0.6748；Hits@10 0.7419 → 0.9042；Hits@4 0.6630 → 0.792。
2. 生成（Table 3，行 331–338）：GPT-4 0.56 → 0.606；PaLM 0.47 → 0.608；用 ground-truth 證據時 GPT-4 0.89、PaLM 0.74。
3. **日期條件抽不到**（行 204–206）："the publishing date filter was extracted in 15.57% of queries, while 22.81% of queries of the MultiHop-RAG dataset are temporal."
4. 日期格式妥協（行 161–165）：LLM 對日期偶爾用 $lt/$gt，作者因數量少，**只採 $in/$nin 與單一字串格式 "%B %-d, %Y"**——日期存成字串，只能精確比對，不能做區間。
5. 作者限制（行 385–390）：要特定領域與題型的題目才寫得出抽取 prompt；要手工寫 prompt；結果仍遠低於直接給正確證據。
6. 依題型（Table 4，行 351–361）：temporal 題 GPT-4 只有 0.256、PaLM 0.4545。

## 原文內部不一致

- 行 303 "for voyage-02, Hits@4 enhanced by 17.2%"：表中 0.6630 → 0.792 相對提升約 19.5%、絕對 +12.9 個百分點，都不是 17.2%（本紀錄自算）。
- 行 346–347 "GPT-4 results also show a 7.89% increase from 0.56 to 0.63"：Table 3 寫 0.606；0.56 → 0.606 約 +8.2%，0.56 → 0.63 是 +12.5%。三個數字對不上。引用時以表格為準。

## 限制

- 基準題目是模板化生成、明確點名來源，跟真實使用者問題差很多；作者也承認過濾「specific to a set of questions from a particular domain and format」（行 24–25）。
- 49 個來源全寫在 prompt 的允許清單裡（附錄行 410–424）。
- 同作者 2026 年後續論文指出 GPT-3.5 抽出的來源有大量不在清單內（見 poliakov-2026-probe.md）。

## 對 order 15 的用法

- 支持「來源單獨成欄才能過濾」：問題點名來源時，用來源欄過濾讓 Hits@10 從約 0.75 到約 0.90。
- 支持「日期要存成數字」：作者把日期存成 "December 12, 2023" 字串，只能 $in 精確比對，temporal 題仍是最弱的一類。
- 反證素材：日期條件只在 15.57% 的題目抽出（實際 22.81% 是時間題）。
