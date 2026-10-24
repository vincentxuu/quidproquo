# 抽取紀錄：Xu et al. (2024) Retrieval-Augmented Generation with Knowledge Graphs for Customer Service Question Answering（LinkedIn，SIGIR '24）

read_status=full（arXiv v2 PDF 5 頁全讀，含圖說、表、參考文獻）

## 書目

- Zhentao Xu、Mark Jerome Cruz、Matthew Guevara、Tie Wang、Manasi Deshpande、Xiaofeng Wang、Zheng Li（全部 LinkedIn Corporation）。
- SIGIR '24（Washington DC，2024-07-14–18），5 頁，DOI 10.1145/3626772.3661370。產業短文（文末有 Company Portrait 與 Presenter Bio 段）。
- arXiv:2404.17723 v2（2024-05-06）。curl https://arxiv.org/pdf/2404.17723（794,291 bytes）→ pdftotext -layout。
- 全文檔：scratchpad/fulltext/o15-xu2024-linkedin-kgrag.txt（333 行，42,315 bytes）。已讀 1–333 全部。

## 研究設計

- 語料：LinkedIn 客服的歷史 issue tickets（Jira 這類，有 Summary、Description、Priority、Root Cause、Steps to Reproduce 等欄位，行 60–84）。
- 方法兩段（行 68–126、203–261）：
  1. 建圖：每張 ticket 解析成樹（節點＝ticket 的一個區段），先用規則抽預定欄位，剩下用 LLM 依 YAML 範本解析；ticket 之間連「明確連結」（Jira 的 clone/related 欄）與「隱含連結」（標題 embedding 相似度超過門檻）。
  2. 查詢：LLM 從問題抽出 entity（對應範本的欄位，例如 "issue summary"→"login issue"）與意圖；**每個 entity 只和同一欄位的節點比相似度**（行 213–219 公式），加總到 ticket 層級取 top-K；再用 LLM 把問題改寫成 Cypher 查圖取出要的欄位（如 steps to reproduce）。圖 1 的步驟 5 還有依 Priority、Root Cause 的 Filtering。
- 對照組（行 267–272）：傳統文字式 EBR（把 ticket 當純文字切塊）；兩組用同一個 LLM（GPT-4）和同一個 embedding（E5）。
- 評估資料：「curated "golden" dataset comprising typical queries, support tickets, and their authoritative solutions」（行 267）——**沒說題數**。

## 可引用結果

1. 檢索（Table 1，行 223–231）：MRR 0.522 → 0.927；Recall@1 0.400 → 0.860；Recall@3 0.640 → 1.000；NDCG@1 0.400 → 0.860；NDCG@3 0.520 → 0.946。摘要的「MRR +77.6%」是 0.927/0.522 的相對值。
2. 生成（Table 2，行 235–241）：BLEU 0.057 → 0.377（摘要說 "by 0.32 in BLEU"）、METEOR 0.279 → 0.613、ROUGE 0.183 → 0.546。
3. 上線（Section 5、Table 3，行 245–260）：客服團隊隨機分兩組，一組用系統、一組照舊；解決時間 mean 40 小時 → 15 小時、**P50 7 → 5 小時（即摘要的 28.6%）**、P90 87 → 47 小時。摘要說部署約六個月。
4. 保留結構的理由（行 60–84）：Limitation 1 "Compromised Retrieval Accuracy from Ignoring Structures"；Limitation 2 固定長度切塊會把「問題描述在開頭、解法在結尾」的 ticket 切斷。
5. 依欄位切的好處（行 122–126）："for certain lengthy texts, we can safely divide the text into smaller chunks … without worrying about quality since the text all belong to the same section."
6. 失敗退路（行 258–260）：查圖失敗時退回文字式檢索。

## 沒寫的事／限制

- **golden set 題數沒報**；Recall@3 = 1.000、數字都是 0.x00 或 0.x60 這種整齊值，推測題數很少（本紀錄推測，原文沒說）。
- 上線實驗沒報人數、ticket 數、顯著性；兩組是否處理同類 ticket 也沒說。只有 mean／P50／P90 三個數。
- 沒有消融：「保留 ticket 結構」「欄位對欄位比對」「圖連結」「LLM 改寫成 Cypher」四件事同時加入，**無法分出保留結構本身貢獻多少**。
- 對照組是最陽春的固定長度切塊＋純文字 EBR，沒有和「按欄位切塊＋metadata 過濾」這種較便宜的做法比。
- 單一公司自評，作者全是 LinkedIn 員工。
- 語料是欄位固定的工單，不是一般文件；可外推到「本來就有欄位的資料」，不一定能外推到 PDF 手冊。

## 對 order 15 的用法

- 可支持：「原始資料已經有欄位（工單、表單）時，保留欄位、讓查詢對準欄位比對，比攤平成文字好」——LinkedIn 檢索 MRR 0.52 → 0.93，上線後中位解決時間 7 → 5 小時。
- 寫法要加限定：「題數未公開、沒有拆開哪一步的貢獻、單一公司自評」。
- 範圍卡寫「保留文件結構的企業實證」可保留，但要改成「保留**工單欄位**結構」，並避免寫成「metadata 讓檢索提升 77.6%」——77.6% 是整套 KG＋LLM 查詢解析的結果。
