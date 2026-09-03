---
title: "Contextual Retrieval：幫每個 Chunk 加上「這段在說什麼」"
date: 2026-03-12
updated: 2026-09-03
type: guide
category: ai
tags: [rag, contextual-retrieval, chunking, indexing, embedding]
lang: zh-TW
tldr: "文件切塊後，每個 chunk 失去了它在原文件中的上下文。Contextual Retrieval 在索引時，用整份文件為每個 chunk 各自生成一段上下文再前綴進去，解決 chunk 孤島問題。"
description: "Contextual Retrieval 的設計：chunk 孤島問題、逐 chunk 上下文生成、索引時的處理流程，以及對搜尋品質的影響。"
draft: false
series:
  name: "RAG 技法大全"
  order: 6
---

> 🌏 [English version](/posts/ai/2026-03-12-contextual-retrieval-en)

RAG 系統的索引通常是把長文件切成小段（chunk），分別 embedding 後存入向量資料庫。這個做法有個根本問題：**切塊之後，每個 chunk 失去了它在原文件中的脈絡**。

一個路線描述文件可能包含：

- 第一段：路線概述（位置、難度、類型）
- 第二段：攀爬技術重點
- 第三段：注意事項和建議裝備

如果只存第二段的 chunk：「此路線關鍵動作在第三個保護點之後，需要平衡動作配合腳法」，脫離了上下文之後，這個 chunk 完全不知道在說哪條路線、哪個岩場、什麼難度。搜尋時命中這個 chunk，LLM 拿到的 context 缺乏關鍵資訊。

Contextual Retrieval（Anthropic 於 2024 年 9 月提出）的解法：**在 indexing 索引時，為每個 chunk 補上一段「這段在整份文件裡的位置與背景」的文字，再送去 embedding**。

這裡要先把一件事講清楚，因為很多二手介紹（包括本文最初的版本）都搞混了：

- **Anthropic 原版做法是「逐 chunk 生成上下文」**——把整份文件連同該 chunk 一起餵給 LLM，請它為「這一個 chunk」寫一段簡短的定位說明。每個 chunk 拿到的上下文都不一樣。
- **「生成一段文件摘要、貼在所有 chunk 前面」是它的簡化版**，成本低很多（每份文件一次 LLM 呼叫，而不是每個 chunk 一次），但效果不等同原版，Anthropic 公布的數字**不適用**於這個簡化版。

下面兩種都會介紹，但請不要把簡化版的效果直接對齊官方數字。

## 設計

索引流程不只是 chunk → embedding，而是：

原版（逐 chunk 上下文）：

```text
Document
    ↓
[Chunk Splitting]        ← 先切成小段
    ↓
對每個 chunk：
  LLM(整份文件 + 這個 chunk) → 該 chunk 專屬的上下文說明
  contextualized = "{chunk_context}\n\n{chunk_content}"
    ↓
[Embedding] +（建議同時建）[BM25 索引]
    ↓
[Vector Store]
```

簡化版（單一文件摘要重複注入）：

```text
Document
    ↓
[Document Summary]  ← LLM 生成 2-3 句摘要（每份文件只呼叫一次）
    ↓
[Chunk Splitting]
    ↓
每個 chunk 注入同一段 summary：
  context = "[文件摘要：{summary}]\n\n{chunk_content}"
    ↓
[Embedding]
    ↓
[Vector Store]
```

原版的重點是「每個 chunk 的上下文都是為它量身生成的」；簡化版則是用一段共用摘要換取成本。這裡不必自己猜差距：[Anthropic 原文](https://www.anthropic.com/engineering/contextual-retrieval)直接寫了他們試過把通用的文件摘要加到 chunk 上，*saw very limited gains*。所以簡化版省的是成本，換掉的是主要效果。

搜尋時命中的是帶有文件上下文的 chunk，LLM 就算只看到一個小段落，也能知道這段來自哪裡、說的是什麼背景下的事。

## Prompt 設計

Anthropic 公布的原版 prompt（逐 chunk 生成，原文為英文，以下為對照翻譯）：

```text
<document>
{{WHOLE_DOCUMENT}}
</document>
這是我們想在整份文件中定位的片段：
<chunk>
{{CHUNK_CONTENT}}
</chunk>
請給出一段簡短扼要的上下文，說明這個片段在整份文件中的位置與背景，
目的是提升這個片段被檢索到的機率。只回答這段上下文，不要有其他內容。
```

關鍵細節是最後一句「只回答這段上下文」——沒有這句，模型很容易回一段「這個片段描述了……」的贅述，把噪音也 embed 進去。

簡化版（本站攀岩場景實際採用）的文件摘要 prompt：

```text
請為以下攀岩內容生成 2-3 句精簡摘要，包含最重要的資訊（岩場、難度、類型等）。
摘要會附加在文件的每個段落前，幫助搜尋時的語義理解。

內容：{document_content}

摘要（2-3 句）：
```

生成的摘要例子：

```text
龍洞北壁路線，難度 5.11a，運動攀登類型，位於新北市貢寮區。
此路線以技術難度聞名，需要良好的腳法和平衡能力。
適合中高級攀岩者，保護點充足但間距較大。
```

注入後的 chunk：

```text
[文件摘要：龍洞北壁路線，難度 5.11a，運動攀登類型，位於新北市貢寮區。
此路線以技術難度聞名，需要良好的腳法和平衡能力。適合中高級攀岩者，保護點充足但間距較大。]

關鍵動作在第三個保護點之後，需要平衡動作配合腳法，建議在此前充分休息...
```

現在這個 chunk 即使單獨出現，搜尋引擎和 LLM 都能理解它的背景。

## 異步執行

文件摘要生成不在主查詢路徑上，而是在文件被加入索引時進行，使用 Cloudflare Workers 的 `ctx.waitUntil()`：

```typescript
async function indexDocument(doc: Document, env: Env, ctx: ExecutionContext) {

  // 同步：基礎文件 embedding（立即可搜尋）
  await embedAndStore(doc);

  // 異步：生成上下文摘要並重建索引（不阻塞回應）
  ctx.waitUntil(
    generateContextualEmbeddings(doc, env)
  );
}
```

這樣文件可以立即被搜尋到（基礎 embedding），Contextual 版本在背景生成後無縫升級，不需要停機或重建索引。

## 效果

先更正一個到處被轉錄錯的數字：Anthropic 公布的是**「top-20 chunk 檢索失敗率的相對下降幅度」**，不是 recall 提升幅度。原文的三組數字是：

| 做法 | top-20 檢索失敗率 | 相對降幅 |
|---|---|---|
| 基準（一般 embedding） | 5.7% | — |
| Contextual Embeddings | 3.7% | 35% |
| Contextual Embeddings + Contextual BM25 | 2.9% | 49% |
| 上述再加 Reranking | 1.9% | 67% |

所以「49%」需要搭配 BM25 混合檢索才成立，「67%」需要再加上 Reranker，兩者都不是單靠注入上下文就能拿到。而且這是 Anthropic 自己的評測集（涵蓋 codebases、小說、arXiv 論文與科學論文），換個語料結果不一定相同。

另外，2025 年有一篇比較研究（arXiv:2504.19754）把 Contextual Retrieval 和 Jina 的 Late Chunking 放在一起測，結論是：Contextual Retrieval 保留語義連貫性的效果較好，但運算成本較高；Late Chunking 效率高很多，但在相關性與完整性上有所犧牲。如果索引成本是硬限制，Late Chunking（用長上下文 embedding 模型先編碼全文、再切 chunk 做 pooling）值得評估。

在攀岩這個場景，效益特別明顯：許多路線資訊的 chunk 本身很短（「第三段的技術關鍵是...」），脫離上下文幾乎沒有意義。注入岩場名稱、難度、類型之後，同樣的 chunk 搜尋相關性大幅提升。

## Chunk 增強的成本階梯

上面用了「原版 vs 簡化版」的二分法，但實務上 chunk 增強有更細的成本梯度。按 LLM 呼叫次數排列：

| 層級 | 做法 | LLM 呼叫 | 效果 |
|---|---|---|---|
| Level 0 | Metadata Prepend — 把檔案名稱、章節標題路徑、頁碼等既有結構化資訊 prepend 到 chunk 前 | 零 | 中 |
| Level 1 | 文件摘要 — 每份文件生成一段摘要，注入所有 chunk | 每份文件一次 | 中低（Anthropic 稱 *very limited gains*） |
| Level 2 | 逐 chunk 上下文 — Anthropic Contextual Retrieval 原版 | 每個 chunk 一次 | 高 |

Level 0 值得注意的是，它的成本是零但效果不差。arXiv:2601.11863 研究了各類 metadata 對檢索的影響，發現**公司名稱 + 年份**提供最強的區分信號；章節標題則主要幫助 chunk 級別的定位。Microsoft Azure 的 [RAG Enrichment Phase 指南](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-enrichment-phase)推薦的增強欄位是 Title、Summary、Keywords、Questions——前兩個不需 LLM，後兩個需要。

實際場景通常是疊加使用：先做 Level 0（零成本），效果不足再加 Level 1 或直接跳到 Level 2。arXiv:2512.05411 的企業知識檢索框架也建議分階段導入，而不是一步到位。

## 成本考量

Level 2（原版）是**每個 chunk** 一次 LLM 呼叫，成本高一個量級。

Anthropic 指出，原版之所以在成本上可行，關鍵是 **prompt caching**：每個 chunk 的 prompt 都包含整份文件，但整份文件那段是共用前綴，可以被快取，不必每次重算。實作原版時務必啟用，否則帳單會非常難看（具體單價會變動，以官方定價頁為準）。

其他緩解方式：

1. **增量索引**：只對新增/修改的文件重新生成上下文
2. **批次處理**：夜間離峰時段批次更新
3. **快取**：文件沒變的話，既有的上下文可以重用

對搜尋品質的提升幅度，這個索引成本通常是值得的——但請用自己的語料量測，不要直接引用別人的數字。

## 整體來說

Contextual Retrieval 解決的是 RAG 系統的一個底層問題：chunk 切割損失了上下文。這個問題在索引設計階段解決比在搜尋或生成階段補救更有效——資料品質的提升遠比演算法技巧更根本。

「垃圾進，垃圾出」是 RAG 系統最常見的失敗原因。Contextual Retrieval 確保進去的每個 chunk 都是「有意義的資訊單元」，而不只是被截斷的文字片段。

另一個不需 LLM 成本的替代思路是 [Hierarchical Chunking + Auto-Merge](/posts/ai/2026-09-03-hierarchical-chunking-auto-merge)：用結構設計（多粒度索引 + 自動合併）而非 LLM 來補回上下文。

## 更新紀錄

- 2026-09-03：新增「Chunk 增強的成本階梯」段落，補充 metadata enrichment 作為零成本替代方案的研究（arXiv:2601.11863、Microsoft Azure RAG Enrichment Phase、arXiv:2512.05411）
- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [Introducing Contextual Retrieval（Anthropic Engineering，2024-09）](https://www.anthropic.com/engineering/contextual-retrieval)
- [Contextual Retrieval — Anthropic News](https://www.anthropic.com/news/contextual-retrieval)
- [Anthropic Cookbook — Contextual Embeddings 實作 notebook](https://github.com/anthropics/claude-cookbooks/blob/main/capabilities/contextual-embeddings/guide.ipynb)
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks（arXiv:2005.11401，RAG 原始論文）](https://arxiv.org/abs/2005.11401)
- [Reconstructing Context: Evaluating Advanced Chunking Strategies for RAG（arXiv:2504.19754）](https://arxiv.org/abs/2504.19754)
- [Late Chunking: Contextual Chunk Embeddings Using Long-Context Embedding Models（arXiv:2409.04701）](https://arxiv.org/abs/2409.04701)
- [Full text queries（Elasticsearch / BM25 混合檢索）](https://www.elastic.co/docs/reference/query-languages/query-dsl/full-text-queries)
- [iThome 鐵人賽 — Contextual Retrieval 相關文章](https://ithelp.ithome.com.tw/articles/10389779)
- [NobodyClimb 系統架構：Cloudflare 全端攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [Utilizing Metadata for Better RAG（arXiv:2601.11863，2025）](https://arxiv.org/abs/2601.11863)
- [RAG Enrichment Phase（Microsoft Azure Architecture Guide）](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-enrichment-phase)
- [A Systematic Framework for Enterprise Knowledge Retrieval（arXiv:2512.05411，2025）](https://arxiv.org/abs/2512.05411)
- [How to Use Metadata in RAG for Better Contextual Results（Unstructured）](https://unstructured.io/insights/how-to-use-metadata-in-rag-for-better-contextual-results)
- [NobodyClimb AI 架構：20 節點 RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
