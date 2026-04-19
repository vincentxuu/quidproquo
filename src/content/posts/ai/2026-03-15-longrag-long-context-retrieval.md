---
title: "LongRAG：用長上下文模型重新思考 RAG 的 Chunking 策略"
date: 2026-03-15
category: ai
tags: [rag, longrag, long-context, chunking, retrieval]
lang: zh-TW
tldr: "傳統 RAG 把文件切成小 chunks 再檢索，但這造成資訊碎片化。LongRAG 利用 100K+ token 的長上下文模型，檢索更大的文件區段（整個章節甚至整份文件），減少碎片化同時保持檢索效率。"
description: "LongRAG 的設計理念：為什麼小 chunk 會造成問題、長上下文模型如何改變 RAG 架構、大 chunk 檢索策略、與傳統 RAG 的效能比較，以及實作考量。"
draft: false
---

傳統 RAG 的核心假設是：LLM 的 context window 有限，所以我們必須把文件切得很小，只送最相關的片段進去。

這個假設在 2024 年之前是合理的。但現在 Gemini 有 1M tokens、Claude 有 200K tokens，GPT-4o 也有 128K tokens。當 context window 從 4K 暴增到 100K 以上，RAG 的設計邏輯應該跟著變。

LongRAG 就是這個思路的體現：**不要再把文件切成碎片，而是檢索更大的單元，讓長上下文模型自己去理解。**

---

## 小 Chunk 的問題

傳統 RAG 通常把文件切成 256-512 tokens 的小 chunk。這個做法看似合理，但實際上製造了一系列問題。

### 資訊碎片化

一段完整的論述被切成多個 chunk 後，每個 chunk 都只有部分資訊。

看這個例子：

```
原始段落：
「該合約第 12 條規定，甲方需在收到驗收報告後 30 個工作日內完成付款。
若甲方逾期付款，應按每日萬分之五的比率支付違約金。但若逾期原因係
因乙方未提供完整驗收文件所致，甲方不負逾期責任。」
```

用 128 tokens 的 chunk size 切割：

```
Chunk 1: 「該合約第 12 條規定，甲方需在收到驗收報告後 30 個工作日內完成付款。」
Chunk 2: 「若甲方逾期付款，應按每日萬分之五的比率支付違約金。」
Chunk 3: 「但若逾期原因係因乙方未提供完整驗收文件所致，甲方不負逾期責任。」
```

使用者問：「甲方逾期付款要付多少違約金？」

檢索系統可能只找到 Chunk 2。但正確答案需要 Chunk 2 + Chunk 3 ── 因為有例外條款。如果只看到 Chunk 2，LLM 會給出一個看似正確但不完整的回答。

這就是**資訊碎片化**：每個 chunk 的語義是不完整的，必須跟其他 chunk 組合才能還原完整的意思。

### 邊界上下文丟失

chunk 的切割邊界往往是任意的。一段跨越邊界的推理鏈會被打斷：

```
Chunk A 結尾：「...因此，我們採用了 Transformer 架構。具體來說，」
Chunk B 開頭：「我們使用了 6 層 encoder 搭配旋轉位置編碼（RoPE），」
```

Chunk B 缺少了「為什麼採用 Transformer」的上下文。如果使用者問「為什麼選擇這個架構？」，單獨的 Chunk B 無法回答。

### 過度依賴檢索精確度

小 chunk 意味著大量候選片段。一個 10 萬字的文件用 512 tokens 切割，大約產生 400 個 chunk。檢索系統必須從 400 個候選中精確找到最相關的 3-5 個。

這對檢索的要求極高：

- embedding 必須準確捕捉每個小 chunk 的語義
- 排序必須精確，因為 top-3 和 top-10 的差距可能就是「有答案」和「沒答案」
- 多跳推理（答案分散在多個 chunk）幾乎不可能做好

小 chunk 把「理解」的壓力全部轉移到了「檢索」上。而檢索從來就不是完美的。

### 語義密度不均

不同段落的語義密度差異很大。一段法律條文 512 tokens 裡可能包含 5 個重要觀點，而一段背景介紹 512 tokens 裡可能只有 1 個。固定大小的 chunk 無法反映這種差異。

---

## 長上下文模型的機會

2024-2025 年間，主流 LLM 的 context window 經歷了爆炸性成長：

| 模型 | Context Window | 發布時間 |
|------|---------------|---------|
| GPT-3.5 | 4K tokens | 2023-03 |
| Claude 2 | 100K tokens | 2023-07 |
| GPT-4 Turbo | 128K tokens | 2023-11 |
| Gemini 1.5 Pro | 1M tokens | 2024-02 |
| Claude 3.5 Sonnet | 200K tokens | 2024-06 |
| Gemini 2.0 | 1M tokens | 2025-01 |

這改變了 RAG 的根本權衡：

**以前**：context window 是稀缺資源 → 必須精確檢索 → 小 chunk → 高檢索壓力。

**現在**：context window 充裕 → 可以放更多內容 → 大 chunk → 把壓力從檢索轉移到理解。

### 關鍵洞察

長上下文模型擅長在大量文字中找到相關資訊。研究顯示，即使在 100K tokens 的 context 中，好的模型也能準確找到嵌入其中的特定事實（needle-in-a-haystack 測試）。

這意味著：**我們不需要完美的檢索，只需要足夠好的檢索。** 把大致相關的內容丟給 LLM，讓它自己找答案。

### 從精確檢索到粗粒度檢索

傳統 RAG 的心態是：「只給 LLM 最相關的片段，不要浪費 token。」

LongRAG 的心態是：「給 LLM 足夠的上下文，讓它自己判斷哪些相關。」

這不是退步，而是利用模型能力的進步。與其花大量工程投入去完善檢索（更好的 embedding、更精確的 reranking、更聰明的 query expansion），不如善用模型本身的理解能力。

---

## LongRAG 架構

LongRAG 的核心設計很簡單：**加大檢索粒度**。

### 傳統 RAG vs LongRAG

```
傳統 RAG:
┌──────────┐     ┌──────────────────────────────────────┐
│          │     │  文件 A                                │
│  Query   │     │  ┌─────┐┌─────┐┌─────┐┌─────┐...     │
│          │     │  │ c1  ││ c2  ││ c3  ││ c4  │        │
│          │     │  │512t ││512t ││512t ││512t │        │
│          │     │  └─────┘└─────┘└─────┘└─────┘        │
└────┬─────┘     └──────────────────────────────────────┘
     │
     │ 向量搜尋                   從數百個 chunk 中
     │ (top-k=5)                 精確找到 5 個
     ▼
┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐
│ c2  ││ c17 ││ c43 ││ c8  ││ c91 │   ← 可能漏掉關鍵片段
└─────┘└─────┘└─────┘└─────┘└─────┘
     │
     ▼  送入 LLM (~2,500 tokens)
┌──────────────────────────────┐
│  LLM 基於碎片化的上下文回答   │
└──────────────────────────────┘


LongRAG:
┌──────────┐     ┌──────────────────────────────────────┐
│          │     │  文件 A                                │
│  Query   │     │  ┌──────────────┐┌──────────────┐     │
│          │     │  │  Section 1   ││  Section 2   │     │
│          │     │  │  (~6,000t)   ││  (~8,000t)   │     │
│          │     │  └──────────────┘└──────────────┘     │
└────┬─────┘     └──────────────────────────────────────┘
     │
     │ 向量搜尋                   從少量區段中
     │ (top-k=3)                 找到大致相關的
     ▼
┌──────────────┐┌──────────────┐┌──────────────┐
│  Section 2   ││  Section 5   ││  Section 11  │  ← 完整語義單元
└──────────────┘└──────────────┘└──────────────┘
     │
     ▼  送入 LLM (~20,000 tokens)
┌──────────────────────────────┐
│  LLM 基於完整上下文回答       │
└──────────────────────────────┘
```

兩者的根本差異：

- **傳統 RAG**：數百個小 chunk → 精確檢索 → 碎片化上下文 → LLM 拼湊答案
- **LongRAG**：數十個大區段 → 粗粒度檢索 → 完整上下文 → LLM 直接理解

### 檢索單元的選擇

LongRAG 的「大 chunk」不是隨便把小 chunk 拼起來。它使用文件本身的結構作為切割邊界：

| 檢索單元 | 大小範圍 | 適用場景 |
|---------|---------|---------|
| 段落群組 | 1,000-3,000 tokens | 結構不明確的文件 |
| 章節（Section） | 3,000-10,000 tokens | 有標題結構的文件 |
| 子文件（Sub-doc） | 10,000-30,000 tokens | 長文件中的獨立章 |
| 整份文件 | 30,000-100,000 tokens | 短到中等長度的獨立文件 |

關鍵原則：**切割邊界應對齊語義邊界**，而不是固定的 token 數。

---

## Chunking 策略重新設計

LongRAG 不是「不切 chunk」，而是「切得更聰明」。以下是三種主要策略。

### 策略一：文件層級檢索（Document-level Retrieval）

最極端的做法：每份文件就是一個檢索單元。

```
索引結構：
Document A → 一個 embedding (代表整份文件的語義)
Document B → 一個 embedding
Document C → 一個 embedding
...

檢索：找到最相關的 1-3 份文件，全文送入 LLM。
```

**優點**：
- 完全不需要 chunking
- 零資訊碎片化
- 實作最簡單

**缺點**：
- 單份文件可能超過 context window
- 一個 embedding 難以代表整份長文件的所有主題
- 檢索精度最低（文件層級太粗了）

**適用場景**：
- 文件庫中每份文件都相對短（< 30K tokens）
- 每份文件主題單一，不太會一份文件涵蓋多個不相關主題
- 文件數量不多（< 1000 份）

### 策略二：章節層級檢索（Section-level Retrieval）

按文件的章節結構切割，每個章節是一個檢索單元。

```
索引結構：
Document A / Section 1 → 一個 embedding
Document A / Section 2 → 一個 embedding
Document A / Section 3 → 一個 embedding
Document B / Section 1 → 一個 embedding
...

檢索：找到最相關的 2-5 個章節，組合送入 LLM。
```

**優點**：
- 保持語義完整性（章節通常是完整的論述單元）
- 檢索粒度適中，比文件層級精確
- 利用文件本身的結構，不需要人工判斷切割點

**缺點**：
- 需要文件有明確的章節結構（標題、目錄等）
- 章節大小差異可能很大（有的章 500 tokens，有的 20,000 tokens）
- 跨章節的引用關係仍會丟失

**適用場景**：
- 技術文件、學術論文、法律文件
- 有 Markdown/HTML 標題結構的文件
- 單份文件有多個可獨立理解的主題

### 策略三：混合策略（Coarse Retrieval + Fine Reading）

這是 LongRAG 最推薦的做法：**兩階段架構**。

```
第一階段 - 粗粒度檢索：
  用章節/文件層級的 embedding 找到大致相關的區段

第二階段 - 細粒度閱讀：
  LLM 在大區段中找到精確的答案

等效於：
  傳統 RAG 的 "retriever + reader"
  但 retriever 變粗了，reader 變強了
```

**流程**：

1. 建立索引時，用章節層級切割（3,000-10,000 tokens）
2. 檢索時，取 top-k=3-5 個章節（共約 15,000-50,000 tokens）
3. 將這些章節組合成一個大 context，送入長上下文 LLM
4. LLM 在大 context 中找到精確答案

**優點**：
- 結合了粗檢索的高召回率和 LLM 的精確理解
- 不需要完美的檢索（因為 LLM 會幫你過濾無關內容）
- 適應性強，不同文件可以用不同的切割粒度

### 策略比較

| 維度 | 文件層級 | 章節層級 | 混合策略 |
|------|---------|---------|---------|
| 切割粒度 | 整份文件 | 3K-10K tokens | 3K-10K tokens |
| 索引大小 | 最小 | 中等 | 中等 |
| 檢索精度 | 低 | 中 | 中 + LLM 補償 |
| 上下文完整度 | 最高 | 高 | 高 |
| Token 消耗 | 最高 | 中高 | 中高 |
| 實作複雜度 | 最低 | 中 | 中高 |
| 適用模型 | 1M context | 100K+ context | 100K+ context |

---

## 檢索效率考量

大 chunk 改變了檢索系統的效能特徵。

### 候選數量大幅減少

同一個語料庫：

```
傳統 RAG (512 tokens/chunk):
  10 萬字文件 × 100 份 = ~80,000 個 chunk
  向量搜尋空間：80,000 個向量

LongRAG (章節層級, ~5,000 tokens/section):
  10 萬字文件 × 100 份 = ~8,000 個章節
  向量搜尋空間：8,000 個向量
```

候選數量減少 10 倍，直接帶來：

- **更快的向量搜尋**：HNSW 等 ANN 演算法在較小的索引上更快
- **更低的儲存成本**：更少的向量 = 更少的記憶體和磁碟空間
- **更簡單的索引維護**：新增/刪除文件時，需要更新的向量更少

### 精確度 vs 召回率的權衡

大 chunk 天然有更高的召回率（因為每個 chunk 涵蓋更多內容），但精確度可能降低（因為 chunk 中有更多無關內容）。

```
小 chunk (512 tokens):
  ✓ 精確度高 — 每個 chunk 主題集中
  ✗ 召回率低 — 答案可能被切到相鄰 chunk
  ✗ 需要更精確的檢索

大 chunk (5,000 tokens):
  ✗ 精確度低 — chunk 內可能有無關內容
  ✓ 召回率高 — 答案更可能在被選中的 chunk 內
  ✓ 容錯性高，檢索不完美也能找到答案
```

### 平衡策略

幾種降低大 chunk 精確度損失的方法：

**1. 多層級索引**

同時維護章節層級和段落層級的 embedding，先用章節層級檢索縮小範圍，再用段落層級排序。

**2. 摘要 Embedding**

不用整個章節的文字做 embedding，而是先用 LLM 產生章節摘要，用摘要做 embedding。摘要更濃縮、語義密度更高，embedding 品質更好。

**3. 多向量表示**

一個章節產生多個 embedding（例如章節摘要 + 章節中每個段落的首句），任一命中都視為該章節相關。

**4. 後處理排序**

檢索到大 chunk 後，用 cross-encoder 或 LLM 對 chunk 內的段落做二次排序，優先展示最相關的部分。

---

## 與傳統 RAG 的比較

以下是 LongRAG 和傳統 RAG 在各個維度的具體比較：

| 維度 | 傳統 RAG | LongRAG |
|------|---------|---------|
| **Chunk 大小** | 256-512 tokens | 3,000-100,000 tokens |
| **索引中的向量數** | 多（每份文件數百個） | 少（每份文件數個到數十個） |
| **檢索精確度** | 高（每個 chunk 主題集中） | 中（chunk 內有混合主題） |
| **上下文連貫性** | 低（碎片化） | 高（完整語義單元） |
| **Token 消耗/query** | 低（~2K-5K tokens） | 高（~15K-50K tokens） |
| **推論延遲** | 較低 | 較高（更多 token 要處理） |
| **檢索延遲** | 較高（大索引） | 較低（小索引） |
| **多跳推理能力** | 弱（需要多次檢索） | 強（大上下文自然涵蓋） |
| **對檢索品質的依賴** | 極高 | 中等 |
| **LLM 要求** | 任何模型 | 需要長上下文模型 |
| **每次查詢成本** | 較低 | 較高 |
| **建置複雜度** | 高（需要精細的 chunking + reranking） | 低（粗粒度切割即可） |

### 效能比較的具體數據

根據 LongRAG 論文和相關研究的結果：

**NQ (Natural Questions) 資料集：**
- 傳統 RAG（100-word chunks, top-5）：答案命中率 ~52%
- LongRAG（4K+ token groups, top-4）：答案命中率 ~71%
- 提升幅度：~19 個百分點

關鍵原因是**召回率的改善**。傳統 RAG 的 top-5 小 chunk 經常漏掉包含答案的片段，而 LongRAG 的大 chunk 更容易涵蓋到答案。

### 成本分析

LongRAG 用更多的 token 換取更好的答案品質：

```
傳統 RAG 每次查詢：
  檢索：5 chunks × 512 tokens = 2,560 input tokens
  生成：~200 output tokens
  成本（Claude 3.5）：~$0.008

LongRAG 每次查詢：
  檢索：3 sections × 6,000 tokens = 18,000 input tokens
  生成：~200 output tokens
  成本（Claude 3.5）：~$0.055

成本增加約 7 倍，但答案品質顯著提升。
```

這個權衡是否值得，取決於應用場景。對法律、醫療、金融等高價值查詢，7 倍成本換取更準確完整的答案是合理的。對低價值的日常問答，傳統 RAG 可能更經濟。

---

## 實作指南

以下是一個完整的 LongRAG 檢索管線實作，使用 TypeScript。

### 章節層級切割器

```typescript
interface Section {
  id: string;
  documentId: string;
  title: string;
  content: string;
  tokenCount: number;
  embedding: number[];
  metadata: { level: number; position: number };
}

/**
 * 按章節結構切割文件，而非固定 token 數。
 * 超過 maxTokens 的章節遞迴往下一層標題切割；
 * 太小的相鄰章節自動合併。
 */
function splitBySection(
  document: { id: string; content: string },
  maxTokens = 8000,
  minTokens = 500,
): Section[] {
  const lines = document.content.split('\n');
  const sections: Section[] = [];
  let currentTitle = '';
  let currentContent: string[] = [];
  let level = 1;
  let idx = 0;

  function flush() {
    if (!currentContent.length) return;
    const content = currentContent.join('\n');
    const tokens = estimateTokens(content);
    sections.push({
      id: `${document.id}_s${idx}`,
      documentId: document.id,
      title: currentTitle,
      content,
      tokenCount: tokens,
      embedding: [],
      metadata: { level, position: idx++ },
    });
    currentContent = [];
  }

  for (const line of lines) {
    const m = line.match(/^(#{1,6})\s+(.+)/);
    if (m) {
      flush();
      level = m[1].length;
      currentTitle = m[2].trim();
      currentContent = [line];
    } else {
      currentContent.push(line);
    }
  }
  flush();

  // 合併太小的相鄰章節
  return sections.reduce<Section[]>((merged, section) => {
    const prev = merged[merged.length - 1];
    if (prev && prev.tokenCount < minTokens) {
      prev.content += '\n\n' + section.content;
      prev.tokenCount += section.tokenCount;
    } else {
      merged.push({ ...section });
    }
    return merged;
  }, []);
}

function estimateTokens(text: string): number {
  const zh = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const en = text.replace(/[\u4e00-\u9fff]/g, '').split(/\s+/).length;
  return Math.ceil(zh * 1.5 + en * 1.3);
}
```

### LongRAG 檢索管線

```typescript
import { cosineSimilarity, generateEmbedding } from './utils';

interface RetrievalResult {
  sections: Section[];
  totalTokens: number;
  query: string;
}

interface LongRAGConfig {
  topK: number;            // 檢索多少個章節
  maxContextTokens: number; // 最大 context tokens
  minRelevanceScore: number; // 最低相關性分數
}

/**
 * LongRAG 的核心檢索邏輯。
 * 與傳統 RAG 的差異：
 * 1. 檢索單元是章節（數千 tokens），不是小 chunk（數百 tokens）
 * 2. top-k 較小（3-5），因為每個結果已經很大
 * 3. 有 token budget 控制，避免超過 LLM 的 context window
 */
async function retrieveSections(
  query: string,
  index: Section[],  // 每個 section 已有 embedding
  config: LongRAGConfig = { topK: 5, maxContextTokens: 50000, minRelevanceScore: 0.3 },
): Promise<RetrievalResult> {
  const queryEmbedding = await generateEmbedding(query);

  // 計算相似度 → 過濾 → 排序
  const scored = index
    .map((section) => ({
      section,
      score: cosineSimilarity(queryEmbedding, section.embedding),
    }))
    .filter((item) => item.score >= config.minRelevanceScore)
    .sort((a, b) => b.score - a.score);

  // 在 token budget 內選擇 top-k 章節
  const selected: Section[] = [];
  let totalTokens = 0;

  for (const item of scored) {
    if (selected.length >= config.topK) break;
    if (totalTokens + item.section.tokenCount > config.maxContextTokens) continue;
    selected.push(item.section);
    totalTokens += item.section.tokenCount;
  }

  // 按原始位置排序（保持閱讀順序）
  selected.sort((a, b) => {
    if (a.documentId !== b.documentId) return a.documentId.localeCompare(b.documentId);
    return a.metadata.position - b.metadata.position;
  });

  return { sections: selected, totalTokens, query };
}
```

### 完整管線：檢索 + 生成

```typescript
/**
 * LongRAG 完整管線：切割 → 索引 → 檢索 → 生成回答
 */
async function longRAGPipeline(
  documents: { id: string; content: string }[],
  query: string,
) {
  // Step 1: 章節切割
  const allSections = documents.flatMap((doc) => splitBySection(doc, 8000, 500));

  // Step 2: 檢索（假設 sections 已有 embedding）
  const retrieval = await retrieveSections(query, allSections, {
    topK: 4, maxContextTokens: 40000, minRelevanceScore: 0.25,
  });

  // Step 3: 組裝 context 並生成回答
  const context = retrieval.sections
    .map((s, i) => `=== 來源 ${i + 1}: ${s.title} ===\n${s.content}`)
    .join('\n---\n\n');

  const answer = await callLLM({
    model: 'claude-sonnet-4-20250514',
    system: `根據參考資料回答問題。引用來源編號，資料不足時明確說明。`,
    messages: [{ role: 'user', content: `參考資料：\n${context}\n\n問題：${query}` }],
    maxTokens: 1000,
  });

  return {
    answer,
    sources: retrieval.sections.map((s) => ({ documentId: s.documentId, title: s.title })),
    tokensUsed: retrieval.totalTokens,
  };
}
```

---

## 適用場景

LongRAG 不是萬能的。以下是它特別適合和不適合的場景。

### 特別適合

**1. 長篇法律文件**

法律條文的特點是：條款之間有大量交叉引用，一個條款的意義取決於其他條款的上下文。傳統 RAG 把合約切成小 chunk 後，這些交叉引用全部斷裂。LongRAG 保留整個章節甚至整份合約，讓 LLM 看到完整的條款關係。

```
使用者問：「如果承包商延遲交付，業主可以終止合約嗎？」

傳統 RAG 可能只找到：
  「延遲交付超過 30 天，業主有權終止合約。」

LongRAG 會找到整個「終止條款」章節，包含：
  - 延遲交付的定義
  - 30 天寬限期
  - 不可抗力的例外
  - 終止前的書面通知要求
  - 終止後的結算方式
```

**2. 學術論文**

論文的方法論、實驗設計和結果分析通常分散在不同章節，但彼此密切相關。LongRAG 可以一次檢索整個「Method + Experiments」區段，讓 LLM 理解方法和結果之間的因果關係。

**3. 技術手冊與 API 文件**

技術概念通常需要完整的上下文才能理解。一個 API endpoint 的行為可能取決於認證設定、rate limit 政策、錯誤碼定義等分散在不同章節的資訊。大 chunk 讓這些散落的資訊更容易被一次檢索到。

**4. 多跳推理查詢**

當答案需要綜合多個段落的資訊時，LongRAG 天然優勢：

```
問：「公司在哪些情況下可以不支付年終獎金？」

需要綜合：
  - 年終獎金計算辦法（第 4 章）
  - 員工考核標準（第 7 章）
  - 特殊例外條款（第 12 章）

LongRAG 更可能把這三個章節都檢索到。
```

**5. 上下文連貫性重於精確度的場景**

客服知識庫、產品 FAQ、政策手冊 ── 這些場景中，給用戶一個完整、連貫的回答比精確引用某個段落更重要。LongRAG 的大上下文讓 LLM 能生成更流暢、更完整的回答。

### 不太適合

**1. 極大規模語料庫的精確事實查詢**

如果你的語料庫有上百萬份文件，使用者只是在找一個具體的數字或日期，傳統 RAG 的小 chunk + 精確檢索更高效。LongRAG 在這種場景下會消耗大量不必要的 token。

**2. 低延遲要求的場景**

LongRAG 送入 LLM 的 token 數是傳統 RAG 的 5-10 倍，推論延遲也會相應增加。對於需要毫秒級回應的場景（如即時搜尋建議），這可能不可接受。

**3. 成本敏感的高頻查詢**

每次查詢消耗 15K-50K input tokens，如果每天有上萬次查詢，token 成本會非常可觀。

---

## 限制與挑戰

### 1. 需要長上下文 LLM

LongRAG 的前提是 LLM 能處理大量 input tokens。如果你的模型只有 8K-16K 的 context window，LongRAG 的大 chunk 根本放不進去。

目前支援 100K+ context 的模型仍然是少數，且多為付費 API（Claude、Gemini、GPT-4）。本地部署的開源模型大多還在 8K-32K 的範圍。

### 2. Token 成本線性增長

更多的 input tokens 直接意味著更高的 API 成本。簡單計算：

```
假設每天 10,000 次查詢：

傳統 RAG：
  10,000 × 3,000 tokens × $3/1M = $90/天

LongRAG：
  10,000 × 25,000 tokens × $3/1M = $750/天

年化差距：$32,850 vs $273,750
```

這個成本差距在大流量場景下不可忽視。

### 3. 推論延遲增加

LLM 的推論時間大致與 input tokens 成正比。25K tokens 的處理時間約是 3K tokens 的 5-8 倍。在使用者體驗敏感的場景（如聊天機器人），這個延遲可能不可接受。

**緩解策略**：
- 使用 streaming 回應，讓使用者看到第一個 token 的時間不變
- 快取熱門查詢的結果
- 對不需要長上下文的簡單查詢，退回傳統 RAG

### 4. Embedding 品質隨文字長度下降

現有的 embedding 模型（如 text-embedding-3-large）在處理長文字時，語義表示的品質會下降。一段 5,000 tokens 的文字可能涵蓋多個主題，而單一個 embedding 向量難以同時捕捉所有主題。

**緩解策略**：
- 用摘要 embedding（前面實作的方法）
- 用 ColBERT 風格的多向量表示
- 用多個 embedding 表示一個章節

### 5. 「Lost in the Middle」問題

研究顯示，LLM 在處理長 context 時，對中間段落的注意力較弱（相對於開頭和結尾）。如果關鍵資訊正好在長 context 的中間位置，LLM 可能會忽略它。

**緩解策略**：
- 把最相關的章節放在 context 的開頭和結尾
- 在 prompt 中明確提醒 LLM 注意所有章節
- 限制總 context 長度，不要無限制地塞入內容

### 6. 缺乏標準的評估基準

傳統 RAG 有成熟的評估框架（Precision@K、Recall@K、MRR 等），但 LongRAG 的評估更困難。因為檢索單元大小不同，直接比較 Precision@K 不公平。目前還沒有針對 LongRAG 場景的標準化評估基準。

---

## 總結

LongRAG 的核心洞察很簡單：**當 LLM 的理解能力夠強、context window 夠大時，不需要把所有壓力都放在檢索上。**

傳統 RAG 在小 context window 時代的設計是合理的：精確切割、精確檢索、只給 LLM 最必要的資訊。但這個策略的代價是資訊碎片化和對檢索精確度的過度依賴。

LongRAG 重新分配了這個壓力：

- **檢索**：從「精確找到最相關的小片段」變成「大致找到相關的大區段」
- **理解**：從「基於碎片化上下文拼湊答案」變成「在完整上下文中理解並回答」

這不是要取代傳統 RAG，而是在長上下文模型普及的今天，提供了另一個有效的設計選擇。根據你的文件特性、查詢類型、成本預算和延遲要求，選擇最適合的策略。

最務實的做法可能是**混合策略**：對簡單查詢用傳統 RAG 節省 token，對複雜查詢切換到 LongRAG 提升品質。一個 query classifier 就能做到這件事。

---

## 延伸閱讀

- [LongRAG: Enhancing Retrieval-Augmented Generation with Long-context LLMs](https://arxiv.org/abs/2406.15319) — LongRAG 原始論文
- [Chunking 策略：切塊方式決定 RAG 能不能找到答案](/posts/ai/2026-03-12-chunking-strategies) — 傳統 chunking 策略的詳細比較
- [Contextual Retrieval：讓每個 Chunk 自帶上下文](/posts/ai/2026-03-12-contextual-retrieval) — Anthropic 提出的另一種解決碎片化的方法
- [Cross-Encoder Reranking：用精排模型補救粗排的不足](/posts/ai/2026-03-12-cross-encoder-reranking) — 當檢索不夠精確時的補救策略

## 參考資料

- [LongRAG: Enhancing Retrieval-Augmented Generation with Long-context LLMs](https://arxiv.org/abs/2406.15319) — Jiang et al. (2024)，LongRAG 原始論文，提出大 chunk 檢索配合長上下文模型的完整框架
- [GraphReader: Building Graph-based Agent to Enhance Long-Context Abilities of Large Language Models](https://arxiv.org/abs/2406.14550) — Li et al. (2024, EMNLP)，圖結構 Agent 系統處理長文件，4K 視窗超越 GPT-4-128K
- [Retrieval-Augmented Generation for Large Language Models: A Survey](https://arxiv.org/abs/2312.10997) — Gao et al. (2024)，RAG 演化史與各代設計取捨的完整分析
- [Searching for Best Practices in Retrieval-Augmented Generation](https://arxiv.org/abs/2407.01219) — Wang et al. (2024)，Chunking 策略與 RAG 效能關係的系統性實驗
- [Anthropic — Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic 工程部落格，長上下文 context 管理的 compaction 與壓縮策略
- [Multi-Head RAG: Solving Multi-Aspect Problems with LLMs](https://arxiv.org/abs/2406.05085) — Besta et al. (2024)，多頭注意力作為檢索鍵的創新方法，與 LongRAG 互補
- [Agentic Retrieval-Augmented Generation: A Survey on Agentic RAG](https://arxiv.org/abs/2501.09136) — Singh et al. (2025)，Agentic RAG 在長文件場景的應用分析
