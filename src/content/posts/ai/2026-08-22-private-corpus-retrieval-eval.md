---
title: "私有語料 Retrieval Eval 實測：先把繁中題庫變成可重跑的 benchmark"
date: 2026-08-22
category: ai
type: guide
tags: [rag, retrieval, evaluation, benchmark, search]
lang: zh-TW
tldr: "Repo 已有 20 題繁中／英文 golden dataset，但缺少文件層級 qrels、retrieval run、延遲原始值與執行 script；目前不能誠實報 Recall@k、MRR 或 nDCG 實測分數。本文把缺口整理成可重跑的評估契約。"
description: "用繁中私有語料設計 Retrieval Eval：定義 qrels、Recall@k、MRR、nDCG、p50/p95 延遲、錯誤分類，以及必須保存的 dataset、raw result 與 script。"
draft: false
series:
  name: "私有語料管線"
  order: 4
---

> 🌏 [English version](/posts/ai/2026-08-22-private-corpus-retrieval-eval-en)

這篇原本要用一份實際繁中 corpus，比較 lexical、vector 與 hybrid retrieval。檢查 repo 後，能確認的是：`docs/rag-golden-dataset.json` 有 20 題查詢，`docs/rag-golden-fixture.json` 有 4 題候選答案；目前沒有 benchmark script、逐題排名結果、延遲原始值，或能把結果連回固定 corpus snapshot 的 manifest。

所以這裡不會出現一張看似完整的勝負表。**現階段是題庫盤點與可重跑評估設計，benchmark 尚未執行。** 要稱為「實測」，至少要能保存 dataset、raw result 與 script，讓另一個人用同一份索引重算一次。

## 現有題庫能做什麼，不能做什麼

20 題資料涵蓋精準查找、概念解釋、跨文章整理、英語查詢與知識庫外問題。這是繁中私有語料很需要的形狀：專有名詞會中英混寫，使用者也常用英文問中文內容。

不過目前 `expected_sources` 多半只標到 `posts/ai`、`posts/tech` 這種目錄層級。Retrieval Eval 需要的是文件或 chunk 層級 relevance judgment，也就是 qrels。若不知道每題有哪些相關文件，就無法判斷「找回幾篇」、第一篇相關結果排第幾，或高相關文件是否排在前面。fixture 裡的 `candidate_answer` 也不是 retriever 的排名輸出，不能反推檢索分數。

先把每題補成這種最小格式：

```json
{
  "query_id": "q06",
  "query": "BM25 跟 vector search 怎麼搭配？",
  "relevance": {
    "post:rag-patterns#hybrid-search": 3,
    "post:meilisearch-complete-guide#hybrid": 2,
    "post:vector-database-comparison": 1
  },
  "acl_context": { "tenant_id": "site", "principal_id": "eval-reader" },
  "query_type": "cross-post"
}
```

`0` 代表不相關，`1` 到 `3` 代表由弱到強。文件 ID 必須是 ingestion pipeline 的 canonical ID，不要用搜尋引擎每次重建都可能改變的內部 ID。若實際回傳單位是 chunk，qrels 也要標 chunk；若產品畫面最後合併成文章，則另存 document-level 聚合結果，不能在算分時臨時換單位。

## 五個指標回答五個不同問題

[Stanford《Introduction to Information Retrieval》](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-unranked-retrieval-sets-1.html)把 recall 定義為「被找回的相關文件占全部相關文件的比例」。實際排名只看有限頁面，因此使用 `Recall@k`：前 `k` 筆找回多少應找回的文件。跨文章整理題最需要它。

- **Recall@k**：有沒有把相關資料帶進候選集。至少固定報 `@5` 與產品實際傳給下一階段的 `@k`。
- **MRR**：第一筆相關結果出現得多早。精準查找題最敏感；若第一篇相關文件在第 4 名，該題 reciprocal rank 是 `1/4`。
- **nDCG@k**：同時考慮位置與分級 relevance。高度相關文件越早出現越好，並用理想排序正規化到 `0–1`；[scikit-learn 文件](https://scikit-learn.org/stable/modules/model_evaluation.html#discounted-cumulative-gain)也提醒，DCG 需要有意義的 graded relevance。
- **延遲**：保存每次 query 的 end-to-end wall time，彙整 p50 與 p95。只報平均值會藏掉慢查詢；embedding、搜尋與 rerank 最好另存分段時間。
- **ACL violation count**：不是品質加分題，而是硬性失敗。任何 unauthorized document 出現在 raw result，都應讓該次 run 判定失敗，即使其他 ranking 指標更高。

MRR 只看第一篇相關文件，無法取代 Recall；Recall 不在乎排序，無法取代 nDCG。這幾個數字應並排保存，不要壓成自訂總分。

## 可比較的配置與尚未執行的結果

第一輪只改 retrieval 配置，固定 corpus snapshot、query set、ACL、top-k、機器與預熱方式：

| Run | 配置 | Recall@5 | MRR | nDCG@5 | p50 / p95 | 狀態 |
|---|---|---:|---:|---:|---:|---|
| A | BM25 / lexical | — | — | — | — | 尚未執行 |
| B | dense vector | — | — | — | — | 尚未執行 |
| C | hybrid fusion | — | — | — | — | 尚未執行 |
| D | hybrid + reranker | — | — | — | — | 尚未執行 |

破折號不是零分。它表示 repo 沒有足以重算的 raw result。真正執行時，每個 run 都要有不可變的 `run_id`，並記錄 commit SHA、corpus checksum、index build ID、embedding model 與版本、搜尋參數、reranker、硬體／區域、執行時間和 warm-up 規則。

每一題的 raw result 至少要保存：

```json
{
  "run_id": "2026-08-22-hybrid-rerank-001",
  "query_id": "q06",
  "latency_ms": { "total": 0, "embed": 0, "retrieve": 0, "rerank": 0 },
  "results": [
    { "canonical_id": "...", "rank": 1, "score": 0.0, "acl_allowed": true }
  ],
  "error": null
}
```

不要只保存彙整 CSV。彙整分數有 bug 時，逐題排名才是能重算、能做 error analysis 的證據。[NIST 的 `trec_eval`](https://github.com/usnistgov/trec_eval)採用 qrels 與 run 分離的做法；若要一次計算多種排名指標，也可使用公開原始碼的 [ranx](https://github.com/AmenRa/ranx)，但 script 仍須鎖定版本與參數。

## 繁中 corpus 要刻意設計的切片

整體平均分數很容易掩蓋繁中搜尋的失敗。20 題規模適合先做 smoke test，不適合宣稱穩定的產品結論；擴充時至少保留以下 query slice：

- 繁中自然語句，以及 `BM25`、`Vectorize`、`LangGraph` 這類英文術語。
- 繁簡字形、全形／半形標點、大小寫、連字號與空白差異。
- 精準標題、錯誤訊息、跨文件綜合，以及「知識庫沒有答案」。
- 同義詞與縮寫，例如「向量搜尋／vector search」和「檢索增強生成／RAG」。
- 權限切片：同一句 query 在不同 tenant、群組與使用者身分下，gold set 可以不同。

macro average 應讓每題權重相同；另外再按 query type 與語言切片報分。若某類只有一兩題，先列逐題結果，不要讓小樣本百分比看起來比證據更成熟。

## 錯誤分類比總分更接近修正動作

每個 miss 只先標一個主要原因，另留 secondary tags。這樣下一輪才知道改哪一層：

| 類型 | 觀察方式 | 優先修正 |
|---|---|---|
| annotation gap | 找到合理文件，但 qrels 未標 | 雙人複核 relevance judgment |
| lexical miss | 專有名詞或錯誤碼未進候選集 | tokenizer、同義詞、欄位權重 |
| semantic miss | 改寫後意思接近，vector 仍漏找 | chunk 邊界、embedding、語言切片 |
| ranking miss | 相關文件有進 top-k，但位置太後 | fusion 權重或 reranker |
| stale hit | 排到已被取代或刪除的版本 | freshness、tombstone、rebuild |
| ACL leak | 回傳 principal 無權讀的文件 | 立即停止 rollout，修正 pre-filter |
| corpus gap | 來源根本沒同步進 snapshot | connector 與 ingestion 監控 |

「知識庫外」題不能用 Recall@k 硬算成一般 miss。它應檢查系統是否拒絕捏造來源、是否能回報未找到；這屬於 retrieval abstention 或回答層評估，需和有答案題分開報。

## 一次可重跑的執行順序

1. 凍結 corpus manifest，記下每個 canonical ID、checksum、ACL 與索引版本。
2. 由兩位標註者獨立補 document／chunk qrels，解決歧見後封版 dataset。
3. 用同一批 query 依序跑 A–D；每個配置先 warm-up，再保存逐題 ranking 與分段延遲。
4. script 從 qrels 與 raw run 計算 Recall@k、MRR、nDCG@k、p50/p95，並把 ACL leak 當成獨立 gate。
5. 逐題標 error type，修正後建立新 run；不要覆寫舊結果。

目前 repo 只完成了第 2 步之前的一部分：題目存在，但 relevance judgment 還不夠細。下一個誠實的交付不是填上幾個漂亮數字，而是補齊 qrels、runner 與 raw result。完成這三件事後，這張表才有資格從「尚未執行」改成「實測結果」。

## 參考資料

- [Stanford IR Book：Evaluation of unranked retrieval sets](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-unranked-retrieval-sets-1.html)
- [scikit-learn：Discounted cumulative gain](https://scikit-learn.org/stable/modules/model_evaluation.html#discounted-cumulative-gain)
- [NIST trec_eval](https://github.com/usnistgov/trec_eval)
- [ranx：ranking evaluation library](https://github.com/AmenRa/ranx)

