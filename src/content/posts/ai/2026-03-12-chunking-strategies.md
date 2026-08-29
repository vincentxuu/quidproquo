---
title: "Chunking 策略：切塊方式決定 RAG 能不能找到答案"
date: 2026-03-12
updated: 2026-08-19
type: guide
category: ai
tags: [rag, chunking, indexing, text-splitting, retrieval]
lang: zh-TW
tldr: "切太大找不準，切太小失去上下文。Chunking 是 RAG 最被低估的環節，策略選錯，後面再多優化都是白費。"
description: "RAG 系統的 Chunking 策略比較：Fixed-size、Sentence-based、Recursive、Semantic Chunking，各自的適用場景和實作考量。"
draft: false
series:
  name: "RAG 技法大全"
  order: 5
---

> 🌏 [English version](/posts/ai/2026-03-12-chunking-strategies-en)

RAG 系統的問題，很多時候不是搜尋演算法不好，而是一開始的切塊策略就錯了。

切塊（Chunking）是把長文件分割成可以獨立 embed 的小段。這個決策直接決定了：
- 每個向量代表多大的語義單元
- 搜尋命中時 LLM 能看到多少上下文
- 一份文件被切成幾個向量，影響索引大小和搜尋效率

沒有一個策略適合所有場景。

## Fixed-size Chunking

最簡單的做法：按固定字元數或 token 數切割。

```typescript
function fixedSizeChunk(text: string, chunkSize = 512, overlap = 50): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap; // overlap 讓前後 chunk 有重疊
  }

  return chunks;
}
```

**Overlap** 是關鍵設計：讓相鄰 chunk 有一段重疊，避免關鍵資訊剛好被切在兩個 chunk 的邊界。

**優點**：實作簡單，索引大小可預測。

**缺點**：完全不考慮語義邊界。「龍洞北壁路線難度 5.11a，保護點密集，落點清晰。最難的動作在第三個保護點之後，需要」—— 句子切一半，語義破碎。

**適合**：結構不明確的文件，或做為其他策略的 fallback。

---

## Sentence-based Chunking

按句子邊界切割，保持每個 chunk 是完整的句子。

```typescript
function sentenceChunk(text: string, maxTokens = 256): string[] {
  // 用 NLP 句子分割（支援中文斷句）
  const sentences = splitSentences(text);
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if (tokenCount(current + sentence) > maxTokens) {
      if (current) chunks.push(current.trim());
      current = sentence;
    } else {
      current += " " + sentence;
    }
  }

  if (current) chunks.push(current.trim());
  return chunks;
}
```

**優點**：保持語義完整性，每個 chunk 都是可讀的完整陳述。

**缺點**：句子長度差異大，chunk 大小不均；中文斷句比英文難處理（標點不統一）。

**適合**：段落結構清晰的敘述性文字（路線評論、攀岩故事）。

---

## Recursive Chunking

LangChain 推廣的方式：先嘗試用大的分隔符（段落、換行）切割，如果 chunk 還是太大，再用更小的分隔符（句號、逗號）繼續切。

```typescript
const separators = ["\n\n", "\n", "。", "，", " "];

function recursiveChunk(
  text: string,
  maxSize: number,
  separators: string[]
): string[] {
  if (text.length <= maxSize) return [text];

  const sep = separators[0];
  const remaining = separators.slice(1);
  const parts = text.split(sep);
  const chunks: string[] = [];
  let current = "";

  for (const part of parts) {
    if ((current + sep + part).length > maxSize) {
      if (current) chunks.push(current);

      if (part.length > maxSize && remaining.length > 0) {
        // 這段還是太長，用下一級分隔符繼續切
        chunks.push(...recursiveChunk(part, maxSize, remaining));
        current = "";
      } else {
        current = part;
      }
    } else {
      current = current ? current + sep + part : part;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}
```

**優點**：盡可能保留自然邊界（段落 > 句子 > 詞），同時控制 chunk 大小。

**缺點**：實作較複雜；不同文件的結構差異大，分隔符需要根據內容類型調整。

**適合**：有明確段落結構的技術文件、說明文字。

---

## Semantic Chunking

最複雜的方式：先 embed 每個句子，計算相鄰句子的語義距離，在語義「斷層」處切割。

先講結論再看程式碼：**這個方法聽起來最聰明，但沒有證據顯示它值得那個成本**。2024 年一篇系統性評測（arXiv:2410.13070, *Is Semantic Chunking Worth the Computational Cost?*）在文件檢索、證據檢索、檢索式問答三種任務上比較 semantic chunking 與單純的固定大小切塊，結論是「semantic chunking 的運算成本無法被穩定的效能提升所證成」。Chroma 的切塊評測技術報告也指出，參數調得好的 `RecursiveCharacterTextSplitter` 這類啟發式策略在實務上往往就夠用。

所以請把它當成「有預算、且已經量測過確實有幫助」時才上的選項，而不是預設起手式。

```typescript
async function semanticChunk(
  sentences: string[],
  threshold = 0.8,
  env: Env
): Promise<string[]> {
  // 每個句子 embed
  const embeddings = await Promise.all(
    sentences.map(s => embed(s, env))
  );

  const chunks: string[] = [];
  let currentChunk = [sentences[0]];

  for (let i = 1; i < sentences.length; i++) {
    const similarity = cosineSimilarity(embeddings[i - 1], embeddings[i]);

    if (similarity < threshold) {
      // 語義斷層：開始新的 chunk
      chunks.push(currentChunk.join(" "));
      currentChunk = [sentences[i]];
    } else {
      currentChunk.push(sentences[i]);
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }

  return chunks;
}
```

**優點**：切割點在語義真正轉換的地方，每個 chunk 主題聚焦。

**缺點**：
- 每個句子都要 embed，索引成本高（N 個句子 = N 次 embedding）
- Threshold 需要根據內容調整，沒有通用值
- 可能產生過長或過短的 chunk
- 上述評測顯示，這些成本換不到穩定的檢索品質提升

**適合**：內容結構不固定、主題轉換頻繁的文件；而且**你已經用自己的語料量測過它確實比 Recursive 好**。

---

## Late Chunking

Jina AI 在 2024 年提出的另一條路（arXiv:2409.04701）：不是「切完再各自 embed」，而是**先用長上下文 embedding 模型把整份文件的所有 token 編碼完，再在 transformer 之後、mean pooling 之前才切**。因為切割發生在模型看完全文之後，每個 chunk 的向量天然帶有前後文資訊。

它和 Contextual Retrieval 解的是同一個問題（chunk 失去上下文），但走的是完全不同的路：Contextual Retrieval 用 LLM 生成文字再 embed，Late Chunking 只改 pooling 的時機、不需要額外的 LLM 呼叫。

2025 年一篇比較研究（arXiv:2504.19754）把兩者放在一起測：Contextual Retrieval 在保留語義連貫性上較好，但運算成本高；Late Chunking 效率高得多，代價是相關性與完整性有所犧牲。

**限制**：需要一個 context window 夠長的 embedding 模型，而且平台實際允許的輸入長度可能遠低於模型宣稱值——上線前先確認自己用的推論平台真正吃得下多長的輸入。

---

## Chunk 大小的取捨

| chunk 大小 | 搜尋精度 | 上下文完整性 | 索引大小 |
|-----------|---------|------------|---------|
| 小（128 tokens） | 高（精確命中） | 低（片段） | 大 |
| 中（512 tokens） | 中 | 中 | 中 |
| 大（1024 tokens） | 低（模糊） | 高（完整） | 小 |

表中的數字是說明用的量級，不是建議值。實際上限由你用的 embedding 模型（以及推論平台）能吃多長的輸入決定——很多託管平台對單次輸入的 token 上限比模型本身的規格低很多，切塊前先查清楚該模型在你的平台上的實際上限。

解法：**Parent Document Retriever**（兩級架構）

- 小 chunk 用來搜尋（精確命中）
- 命中後取出它所屬的大 chunk（完整上下文）給 LLM

```
索引：
  小 chunk（128 tokens）→ embedding
  大 chunk（512 tokens）→ 存文字，與小 chunk 關聯

搜尋：
  query → 找到最相關的小 chunk
  → 取出對應的大 chunk
  → 送給 LLM 生成
```

這個設計讓搜尋精度和上下文完整性不互相妥協。

## 在攀岩場景的選擇

路線描述的結構很固定（名稱、難度、類型、描述、注意事項），適合 Recursive Chunking，按段落邊界切割，每個 chunk 是一個語義完整的描述段。

再搭配 Contextual Retrieval（注入文件摘要），彌補小 chunk 失去上下文的問題。

## 整體來說

Chunking 是 RAG 系統裡最底層也最影響全局的決策。後面加多少 HyDE、Multi-Query、Reranker，都建立在「indexing 索引裡有正確的語義單元」這個前提上。索引本身有問題，搜尋再好也找不到正確答案。

最務實的建議：從 Recursive Chunking + Contextual Retrieval 開始，然後根據實際的搜尋品質（查看 trace 裡命中的 chunk 是否有意義）決定要不要換策略。

---

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [Anthropic - Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval)
- [LangChain Text Splitters Documentation](https://docs.langchain.com/oss/python/integrations/splitters/)
- [LlamaIndex - Node Parsers / Text Splitters](https://developers.llamaindex.ai/python/framework/module_guides/loading/node_parsers/)
- [Evaluating Chunking Strategies for Retrieval（Chroma 技術報告，2024-07）](https://research.trychroma.com/evaluating-chunking)
- [Is Semantic Chunking Worth the Computational Cost?（arXiv:2410.13070）](https://arxiv.org/abs/2410.13070)
- [Late Chunking: Contextual Chunk Embeddings Using Long-Context Embedding Models（arXiv:2409.04701）](https://arxiv.org/abs/2409.04701)
- [Reconstructing Context: Evaluating Advanced Chunking Strategies for RAG（arXiv:2504.19754）](https://arxiv.org/abs/2504.19754)
- [Unstructured.io - Chunking Best Practices](https://docs.unstructured.io/open-source/core-functionality/chunking)
- [NobodyClimb 系統架構：Cloudflare 全端攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI 架構：20 節點 RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
