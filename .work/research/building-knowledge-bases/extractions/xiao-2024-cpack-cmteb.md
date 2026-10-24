# 抽取紀錄：Xiao, Liu, Zhang, Muennighoff, Lian & Nie (2024) C-Pack: Packed Resources For General Chinese Embeddings（C-MTEB）

read_status=full（arXiv v5 全文 9 頁＋參考文獻；正文第 1–4 節全讀；本版沒有附錄、也沒有獨立的限制段）

## 書目

- Shitao Xiao、Zheng Liu（共同一作，Liu 為通訊；北京智源 BAAI）、Peitian Zhang（人大）、Niklas Muennighoff（Hugging Face）、Defu Lian（中科大）、Jian-Yun Nie（蒙特婁大學）。
- SIGIR '24（47th International ACM SIGIR Conference），2024-07-14–18，Washington DC。DOI: 10.1145/3626772.3657878。
- 預印本：arXiv:2309.07597，v1 2023-09-14 … v5 2024-09-24。
- 讀取：curl https://arxiv.org/pdf/2309.07597（v5，1,332,241 bytes）→ pdftotext -layout → scratchpad/fulltext/o16-cpack2024.txt（651 行、83,868 bytes），讀 1–530（正文與表 1–5）、530–651（參考文獻，確認無附錄）。
- 利益關係：C-MTEB 與 BGE 模型由同一團隊發表，論文同時是 benchmark 與自家模型的成績單。

## 研究設計（相關段落）

- C-MTEB（3.1 節，行 213–259；圖 2 行 133–172）：MTEB 的中文延伸，35 個公開資料集、6 類任務；其中**檢索 8 個**（CmedqaRetrieval、CovidRetrieval、DuRetrieval、EcomRetrieval、MedicalRetrieval、MMarcoRetrieval、T2Retrieval、VideoRetrieval），主指標 NDCG@10（行 266–270）。
- 資料集全是簡體中文來源（DuReader、T2Ranking、mMARCO-Zh 等）；論文沒有任何繁體中文資料集。
- 比較模型（行 365–368）：Text2Vec、Luotuo、M3E、multilingual E5、OpenAI text-embedding-ada-002、BGE small/base/large。

## 可引用結果（表 2，行 349–362）

| 模型 | 維度 | 檢索 | 平均 |
|---|---|---|---|
| OpenAI-Ada-002 | 1536 | 52.00 | 53.02 |
| Multi. E5 (large) | 1024 | 63.66 | 58.84 |
| M3E (base) | 768 | 56.91 | 57.79 |
| BGE (small) | 512 | 63.07 | 58.28 |
| BGE (large) | 1024 | 71.53 | 63.96 |

1. **在中文檢索上，模型之間差距很大**：同一套中文檢索資料，OpenAI ada-002 52.00，BGE-large 71.53，差將近 20 點 NDCG@10。BGE-small（24M 參數、512 維）63.07 也高於 ada-002。
2. 作者說最大進步在檢索類任務（行 376–382）："The biggest improvements are on the retrieval task followed by STS, pair classification, and re-ranking."
3. 消融（表 3，行 414–422）：只做弱監督預訓練（BGE-pretrain）檢索 63.90；再用標註資料微調後 71.53。批次大小 256 → 19,200，檢索 57.25 → 63.90（表 4）。
4. 腳註 1（行 126）："This situation has been substantially improved since our work."——作者自己說發表後中文 embedding 已大幅進步，表 2 的排名只代表 2023–2024 當時。

## 沒寫的事

- 沒有任何限制段，沒討論 C-MTEB 與實際 RAG 表現的落差。
- 沒有繁體中文、沒有中英混雜、沒有專有名詞或編號類查詢的分析。
- 沒有和 BM25 比較，也沒有混合檢索。
- 比較對象是當時的舊模型（ada-002 已被 text-embedding-3 取代）。

## 外部對照

- CRUD-RAG（Lyu et al. 2024，同為中文）在端到端 RAG 中發現 benchmark 排名不完全對應實際效果：m3e-base 在檢索 benchmark 最低，但在「幻覺修正」任務四個 embedding 中最好，作者寫 "the retrieval benchmark may not be fully appropriate for RAG"（見 lyu-2024-crud-rag-o16.md）。
- DAT（Hsu & Tzeng 2025）用 text-embedding-3-large 在繁中 DRCD 上輸 BM25 19 點（見 hsu-2025-dat-hybrid-drcd.md）。

## 對 order 16 的用法

- 「embedding 只講直覺」那段：可用一句「同一批中文檢索題，換 embedding 模型，分數可以差到將近 20 分（C-MTEB：ada-002 52 對 BGE-large 72）」說明「模型要挑支援中文的」。要補「這是 2024 年的比較，且出自 BGE 自家團隊；排行榜只能縮小候選，最後要用自己的題庫量」。
- 繁中缺口：C-MTEB 全是簡中；繁中要自己用題庫驗證（接 zh-tw-embedding-rag-failures 那篇）。
