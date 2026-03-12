---
title: "Contextual Retrieval：幫每個 Chunk 加上「這段在說什麼」"
date: 2026-03-12
category: ai
tags: [rag, contextual-retrieval, chunking, indexing, embedding]
lang: zh-TW
tldr: "文件切塊後，每個 chunk 失去了它在原文件中的上下文。Contextual Retrieval 在索引時為每個 chunk 注入文件級別摘要，解決 chunk 孤島問題。"
description: "Contextual Retrieval 的設計：chunk 孤島問題、文件級別上下文注入、索引時的處理流程，以及對搜尋品質的影響。"
draft: false
---

RAG 系統的索引通常是把長文件切成小段（chunk），分別 embedding 後存入向量資料庫。這個做法有個根本問題：**切塊之後，每個 chunk 失去了它在原文件中的脈絡**。

一個路線描述文件可能包含：
- 第一段：路線概述（位置、難度、類型）
- 第二段：攀爬技術重點
- 第三段：注意事項和建議裝備

如果只存第二段的 chunk：「此路線關鍵動作在第三個保護點之後，需要平衡動作配合腳法」，脫離了上下文之後，這個 chunk 完全不知道在說哪條路線、哪個岩場、什麼難度。搜尋時命中這個 chunk，LLM 拿到的 context 缺乏關鍵資訊。

Contextual Retrieval（由 Anthropic 提出）的解法：**在索引時為每個 chunk 注入文件級別的上下文摘要**。

## 設計

索引流程不只是 chunk → embedding，而是：

```
Document
    ↓
[Document Summary]  ← LLM 生成 2-3 句摘要
    ↓
[Chunk Splitting]   ← 切成小段
    ↓
每個 chunk 注入 summary：
  context = "[文件摘要：{summary}]\n\n{chunk_content}"
    ↓
[Embedding]
    ↓
[Vector Store]
```

搜尋時命中的是帶有文件上下文的 chunk，LLM 就算只看到一個小段落，也能知道這段來自哪裡、說的是什麼背景下的事。

## Prompt 設計

文件摘要生成：

```
請為以下攀岩內容生成 2-3 句精簡摘要，包含最重要的資訊（岩場、難度、類型等）。
摘要會附加在文件的每個段落前，幫助搜尋時的語義理解。

內容：{document_content}

摘要（2-3 句）：
```

生成的摘要例子：
```
龍洞北壁路線，難度 5.11a，運動攀登類型，位於台灣瑞芳。
此路線以技術難度聞名，需要良好的腳法和平衡能力。
適合中高級攀岩者，保護點充足但間距較大。
```

注入後的 chunk：

```
[文件摘要：龍洞北壁路線，難度 5.11a，運動攀登類型，位於台灣瑞芳。
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

Anthropic 的研究顯示，Contextual Retrieval 把 chunk 搜尋的 top-20 recall 提升了 49%（配合 BM25），在某些測試集上甚至達到 67%。

在攀岩這個場景，效益特別明顯：許多路線資訊的 chunk 本身很短（「第三段的技術關鍵是...」），脫離上下文幾乎沒有意義。注入岩場名稱、難度、類型之後，同樣的 chunk 搜尋相關性大幅提升。

## 成本考量

每個文件需要一次額外的 LLM 呼叫（生成摘要）。如果文件庫很大，索引成本會上升。幾個緩解方式：

1. **增量索引**：只對新增/修改的文件重新生成摘要
2. **批次處理**：夜間離峰時段批次更新
3. **摘要快取**：文件沒變的話，摘要可以重用

對搜尋品質的顯著提升，這個索引成本是值得的。

## 整體來說

Contextual Retrieval 解決的是 RAG 系統的一個底層問題：chunk 切割損失了上下文。這個問題在索引設計階段解決比在搜尋或生成階段補救更有效——資料品質的提升遠比演算法技巧更根本。

「垃圾進，垃圾出」是 RAG 系統最常見的失敗原因。Contextual Retrieval 確保進去的每個 chunk 都是「有意義的資訊單元」，而不只是被截斷的文字片段。
