# 抽取紀錄：Hsu & Tzeng (2025) DAT: Dynamic Alpha Tuning for Hybrid Retrieval in Retrieval-Augmented Generation

read_status=full（arXiv v1 全文 12 頁，含附錄 A prompt、附錄 B 限制）

## 書目

- Hsin-Ling Hsu、Jengnan Tzeng（通訊），國立政治大學（臺北）。
- arXiv:2503.23013 v1（2025-03-29），cs.IR。PDF 首頁標「Preprint. Under review.」；截至 2026-10-22 arXiv 只有 v1，未查到正式刊登版本。
- 讀取：curl https://arxiv.org/pdf/2503.23013（461,448 bytes）→ pdftotext -layout → scratchpad/fulltext/o16-dat2025.txt（715 行、42,096 bytes），已讀 1–715 全部。

## 研究設計

- 資料（行 296–335，表 1）：SQuAD（英文）與 **DRCD（台達閱讀理解資料集，繁體中文）**。隨機抽文章直到題數近 3,000：SQuAD 13 篇／585 段／2,976 題；DRCD 318 篇／908 段／3,000 題。任務是找出含答案的那一段。
- 另取「hybrid-sensitive」子集：BM25 與 dense 排名不同、且 α 值會影響正解是否排第一的題目（SQuAD 1,111 題、DRCD 1,523 題）（行 320–329）。
- 基準（行 351–371）：
  - BM25 Only：中文用 ckiplab/albert-base-chinese 的 tokenizer 斷詞。
  - Dense Only：OpenAI text-embedding-3-large。
  - Fixed Hybrid：min-max 正規化後線性加權，α 從 0 到 1 每 0.1 網格搜尋，兩個資料集都是 α* = 0.6 最好。
- DAT：讓 LLM 給 BM25 與 dense 的 top-1 結果各打 0–5 分，依分數算每題的 α（行 209–279）。
- 指標：Precision@1、MRR@20。

## 可引用結果（數字照原文）

1. **繁中 DRCD 上 BM25 明顯勝過 dense 向量**（表 3，行 414–424）：Precision@1 BM25 0.7630、Dense 0.5743；MRR@20 0.8134 vs 0.6708。英文 SQuAD 兩者接近（P@1 0.7594 vs 0.7396）。作者原句（行 398–400）："while dense retrieval performs relatively well on the SQuAD dataset, BM25 shows stronger performance on the DRCD dataset, suggesting different retrieval dynamics across datasets."
2. **固定權重混合檢索比任一單法高**（表 3）：DRCD P@1 0.8113（比 BM25 +4.8 點、比 dense +23.7 點）；SQuAD 0.8461。
3. hybrid-sensitive 子集（表 5，行 454–464）：DRCD 上 Dense Only P@1 只有 0.1838，BM25 0.5555，Fixed Hybrid 0.6507，DAT（GPT-4o）0.7150。
4. DAT 比固定權重再高：全資料 DRCD P@1 +3.3 點（GPT-4o，0.8440），hybrid-sensitive 子集 +6.4 點（行 392–397、479–485）。
5. 很多題 α 怎麼調都一樣（行 320–324）："for many queries ... retrieval performance remained identical regardless of the α value used—suggesting these queries were too simple to benefit from hybrid approaches"。DRCD 3,000 題中 1,523 題屬於會受 α 影響的子集。
6. 繁中例子（6.2 節，行 523–541）：「水分子中的質子在高溫中與鋯進行無氧性氧化反應後什麼物質會產生?」dense top-1 是講氫離子的段落（3 分），BM25 top-1 是「在無氧條件下，鐵和合成鋼會被水分子中的質子緩慢氧化」（4 分）——BM25 抓到「無氧」「水分子中的質子」這些字面詞。

## 沒寫的事

- 沒解釋 DRCD 上 dense 為何落後這麼多。（本紀錄推測：DRCD 與 SQuAD 一樣是標註者看著段落出題，題目與段落共用大量字詞，對 BM25 有利；這是資料集構造的偏誤，不是原文主張。）
- 只測一個 embedding（text-embedding-3-large）；沒測中文專用模型（如 bge 系列），所以「繁中 dense 輸 BM25」可能部分是模型選擇造成的。
- 語料只有 908 段（DRCD），規模很小；也沒有切塊這一步，檢索單位就是原始段落。
- 沒報 DAT 的延遲與成本（每題多兩次 LLM 呼叫）。附錄 B（行 702–710）只說「may increase latency and cost」。
- 沒做統計檢定，文中「significant」沒有 p 值。

## 與範圍卡的關係

- 支持自我檢查「繁中語料只用向量搜會漏掉什麼」：在繁中閱讀理解題上，只用 text-embedding-3-large 的 P@1 比 BM25 低 19 個百分點，加 BM25 混合後回到 0.81。
- 範圍卡的答案「專有名詞、編號、代碼」：本文的例子是化學名詞與條件（無氧、質子、鋯），沒有測編號或代碼。編號／代碼這部分要靠 KAP（財報 OCR 數字）或其他來源。

## 對 order 16 的用法

- 「關鍵字、向量還是兩者」：引 DRCD 三個數字（0.76 / 0.57 / 0.81），講「繁中題目只用向量搜，第一名答對率掉兩成；混合後比兩者都好」。要標明是單一 embedding、單一資料集、預印本。
