---
title: "Hierarchical Chunking + Auto-Merge：小 chunk 搜得準，大 chunk 讀得懂"
date: 2026-09-03
type: deep-dive
category: ai
tags: [hierarchical-chunking, auto-merge, rag, chunking, retrieval, llamaindex]
lang: zh-TW
tldr: "小 chunk embedding 精準但缺上下文、大 chunk 上下文完整但 embedding 被噪音稀釋——Hierarchical Chunking 用多層索引（2048→512→128 tokens）配 Auto-Merge 演算法解決這個兩難：葉節點精準命中，命中密度超過閾值就自動回傳父節點給 LLM。HiChunk 實測 evidence recall 提升 12.7%，LlamaIndex 和 Haystack 都已內建。"
description: "深入介紹 Hierarchical Chunking 與 Auto-Merging Retrieval 的設計原理、Auto-Merge 閾值邏輯、HiChunk 改進、與 Parent Document Retriever / Contextual Retrieval / Late Chunking 的比較，以及 LlamaIndex 和 Haystack 的實作。"
series:
  name: "RAG 技法大全"
  order: 50
---

> 🌏 [English version](/en/posts/ai/2026-09-03-hierarchical-chunking-auto-merge-en)

RAG 系統的 chunk 大小是一個永恆的取捨：切小了 embedding 精準但送進 LLM 的片段缺乏上下文，切大了上下文完整但 embedding 被不相關內容稀釋。依 [Firecrawl 的 2026 年 chunking 建議](https://www.firecrawl.dev/blog/best-chunking-strategies-rag)，固定 400-600 token chunk 配 15% overlap 加 cross-encoder reranking 仍然是產業基線——但這條基線在 chunk 大小上做的是折衷，不是解決。

Hierarchical Chunking + Auto-Merging Retrieval 用不同的思路：**不做折衷，兩個都要**。小 chunk 負責精準搜尋，大 chunk 負責完整上下文，用樹狀結構把它們連起來，由 Auto-Merge 演算法動態決定該回傳哪一層。

## Chunk 大小的兩難

問題不在切塊本身，而在同一個 chunk 同時要承擔兩個互相衝突的角色：

| 角色 | 需要什麼 | chunk 大小偏好 |
|-----|---------|--------------|
| **搜尋目標**（embedding match） | 語義集中、不被噪音稀釋 | 小（128-256 tokens） |
| **生成材料**（送進 LLM） | 段落完整、有前後文 | 大（1024-2048 tokens） |

用同一個 chunk 大小服務兩種角色，本質上就是在精度和完整性之間做一個固定的折衷——而最佳折衷點會隨文件類型和 query 類型變動。

[Parent Document Retriever](/posts/ai/2026-03-12-chunking-strategies) 是第一代解法：小 chunk 搜尋、命中後取出關聯的大 chunk 給 LLM。但它只有兩層，粒度固定。Hierarchical Chunking 把這個概念推到多層。

## Hierarchical Chunking 的設計

核心是把文件切成**多粒度的樹狀結構**。以三層為例：

```
Level 0（根）:  2048 tokens  ─── 送給 LLM 的完整段落
  Level 1:      512 tokens   ─── 中間層
    Level 2:    128 tokens   ─── 葉節點，做 embedding + 搜尋
```

只有**葉節點被 embed 和索引**。其餘層級以原文形式存在 document store，透過 parent-child 關係連結。搜尋時對葉節點做向量比對，命中後沿樹往上取更大的 chunk 給 LLM。

依 [LlamaIndex HierarchicalNodeParser](https://developers.llamaindex.ai/python/framework-api-reference/node_parsers/hierarchical) 的實作：

```python
from llama_index.core.node_parser import HierarchicalNodeParser

node_parser = HierarchicalNodeParser.from_defaults(
    chunk_sizes=[2048, 512, 128]
)
nodes = node_parser.get_nodes_from_documents(documents)
# nodes 包含三層，每個子節點都有 parent_node 的參照
```

每個節點帶 `relationships` 屬性，記錄它的 parent、children、prev/next sibling。這棵樹不只是索引結構——它保留了文件的段落層級關係。

## Auto-Merge 演算法

Auto-Merge 的邏輯很直覺：如果同一個父節點下有夠多的子節點被搜尋命中，就用父節點取代那些子節點。

依 [LlamaIndex AutoMergingRetriever](https://developers.llamaindex.ai/python/examples/retrievers/auto_merging_retriever/) 的說明：

> "The auto merging retriever looks at a set of leaf nodes and recursively merges subsets of leaf nodes that reference a parent node beyond a given threshold."

具體流程：

```
1. 向量搜尋命中 top-K 個葉節點
2. 依 parent 分組
3. 對每個 parent：
   如果被命中的 children 數 / 該 parent 的 children 總數 ≥ 閾值
   → 用 parent 取代所有被命中的 children
4. 遞迴往上層重複（可設定遞迴深度）
```

**閾值**預設是 0.5（50%）。直覺：如果一個段落有 4 個子 chunk，其中 3 個都被搜到了，與其送 3 個碎片，不如直接送整個段落——省 token、資訊更完整。

```python
from llama_index.core.retrievers import AutoMergingRetriever

retriever = AutoMergingRetriever(
    vector_retriever,
    storage_context,
    simple_ratio_thresh=0.5,  # merge 閾值
)
results = retriever.retrieve("B1 規範的不動產限制")
```

## HiChunk：閾值可以更聰明

固定 50% 閾值有一個問題：不同 parent 的 children 數量差異很大。一個有 8 個 children 的長段落，命中 4 個就 merge；一個只有 2 個 children 的短段落，命中 1 個就 merge——後者顯然太激進。

[HiChunk（arXiv:2509.11552）](https://arxiv.org/abs/2509.11552) 提出兩個改進：

1. **HiCBench**：第一個專門評估 hierarchical chunking 品質的 benchmark，用人工標註的多層級切點和 evidence-dense QA pairs 測試。
2. **Token budget 感知的自適應閾值**：merge 決策考慮已用 token 預算，不是只看命中比例。如果 budget 還有餘裕，降低閾值多 merge 一些；快滿了就提高閾值，避免大 chunk 把 budget 撐爆。

HiChunk 的實測結果：搭配 Auto-Merge，evidence recall 比 fixed-size chunking 提升 12.7%，且 chunk 數量反而減少——因為 merge 把重複覆蓋的碎片合併了。

## KohakuRAG：四層樹 + 底向上 Embedding 聚合

[KohakuRAG（arXiv:2603.07612）](https://arxiv.org/abs/2603.07612) 把階層推到四層（document → section → paragraph → sentence），並做了一件 LlamaIndex 預設沒做的事：**底向上聚合 embedding**。

傳統做法只 embed 葉節點。KohakuRAG 把子節點的 embedding 聚合上來，讓每一層都有自己的向量表示。搜尋時可以在不同粒度做匹配：先在高層做粗篩、再在低層精確定位。

在 WattBot 2025 挑戰賽（精準技術問答 + citation 追蹤），KohakuRAG 以 0.861 分拿下公開和私有排行榜雙料第一。

## Haystack 的實作

[Haystack 的 AutoMergingRetriever](https://haystack.deepset.ai/blog/improve-retrieval-with-auto-merging) 在 2025 年 3 月從實驗功能移入正式框架，概念與 LlamaIndex 相同但 API 不同：

```python
from haystack.components.preprocessors import HierarchicalDocumentSplitter
from haystack.components.retrievers import AutoMergingRetriever

splitter = HierarchicalDocumentSplitter(
    block_sizes=[400, 200, 100],
    split_overlap=0
)
```

Haystack 的 `HierarchicalDocumentSplitter` 用 `block_sizes` 控制層級（降序排列），產出帶 parent-child metadata 的文件結構。

## 與其他方法的比較

| 方法 | 改的階段 | 需要 LLM | 儲存倍數 | 解決什麼 |
|-----|---------|---------|---------|---------|
| **Hierarchical + Auto-Merge** | Retrieval | 否 | ~3× | chunk 大小兩難 |
| [Contextual Retrieval](/posts/ai/2026-03-12-contextual-retrieval) | Ingestion | 是（每 chunk） | ~1.1× | chunk 孤島問題 |
| [Late Chunking](/posts/ai/2026-08-25-late-chunking-contextual-retrieval) | Embedding | 否 | 1× | chunk 孤島問題 |
| Parent Document Retriever | Retrieval | 否 | ~2× | chunk 大小兩難（兩層限定） |

**vs Contextual Retrieval**：Contextual Retrieval 靠 LLM 為每個 chunk 補上下文（有成本、有延遲），Hierarchical 靠結構設計免 LLM。兩者可以疊加——先做 Contextual Retrieval 改善每個葉節點的 embedding 品質，再用 Auto-Merge 解決大小兩難。

**vs Late Chunking**：Late Chunking 改 embedding 階段（先整文 encode 再切），Hierarchical 改 retrieval 階段（切完照常 embed，取的時候合併）。Late Chunking 需要 long-context embedding model，Hierarchical 不需要。

**vs Parent Document Retriever**：概念上是同一條路線的演化。Parent Document Retriever 只有兩層，且沒有 Auto-Merge 邏輯——永遠取 parent，不管命中多少 children。Hierarchical 是多層 + 動態 merge，粒度更細。

## 限制

1. **儲存量增加**：三層索引，document store 需要存所有層級的原文（~3× baseline）。葉節點的向量索引大小不變，但文字存儲增加。
2. **Merge 閾值需要調**：50% 是合理預設，但最佳值跟文件結構和 query 類型有關。HiChunk 的自適應閾值是方向，但增加了複雜度。
3. **不解決 embedding 品質問題**：葉節點的 embedding 品質如果差（例如表格 chunk 缺表頭），Hierarchical Chunking 不會修——它只影響取回的粒度，不影響搜尋的精度。這種情況需要先搭配 [Header Propagation 或 Table-Aware Chunking](/posts/ai/2026-03-12-chunking-strategies)。
4. **需要重建索引**：從 flat chunking 遷移過來，需要重新切塊、建樹、embed 所有葉節點。

## 整體來說

Hierarchical Chunking + Auto-Merge 是 RAG 系統裡少數「不需要額外 LLM 成本、不需要換 embedding model、效果可預測」的改進方案。它解決的問題很具體——chunk 大小兩難——而且解法是確定性的，不依賴模型的隨機行為。

LlamaIndex 和 Haystack 都已內建，不需要從零寫。如果你的系統已經有 Parent Document Retriever 的兩層架構，遷移到多層 + Auto-Merge 的改動量很小。

值得考慮疊加 [Contextual Retrieval](/posts/ai/2026-03-12-contextual-retrieval) 進一步改善葉節點的 embedding 品質，或搭配 [Cross-Encoder Reranking](/posts/ai/2026-03-12-cross-encoder-reranking) 在 merge 前做更精準的篩選。但即使單獨使用，光靠結構就能拿到 HiChunk 論文報告的 12.7% evidence recall 提升——在不花額外 LLM 成本的前提下，這個報酬率很好。

## 參考資料

- [LlamaIndex — HierarchicalNodeParser](https://developers.llamaindex.ai/python/framework-api-reference/node_parsers/hierarchical)
- [LlamaIndex — AutoMergingRetriever](https://developers.llamaindex.ai/python/examples/retrievers/auto_merging_retriever/)
- [arXiv:2509.11552 — HiChunk: Evaluating and Enhancing RAG with Hierarchical Chunking (2025)](https://arxiv.org/abs/2509.11552)
- [arXiv:2603.07612 — KohakuRAG: A Simple RAG Framework with Hierarchical Document Indexing (2026)](https://arxiv.org/abs/2603.07612)
- [Haystack — Improving Retrieval with Auto-Merging](https://haystack.deepset.ai/blog/improve-retrieval-with-auto-merging)
- [Haystack — AutoMergingRetriever Documentation](https://docs.haystack.deepset.ai/docs/automergingretriever)
- [Firecrawl — Best Chunking Strategies for RAG in 2026](https://www.firecrawl.dev/blog/best-chunking-strategies-rag)
- [Chunking 策略：切塊方式決定 RAG 能不能找到答案](/posts/ai/2026-03-12-chunking-strategies)（站內）
- [Contextual Retrieval：幫每個 Chunk 加上「這段在說什麼」](/posts/ai/2026-03-12-contextual-retrieval)（站內）
- [Cross-Encoder Reranking：讓最相關的文件排到前面](/posts/ai/2026-03-12-cross-encoder-reranking)（站內）
- [Late Chunking 與 Contextual Retrieval](/posts/ai/2026-08-25-late-chunking-contextual-retrieval)（站內）
