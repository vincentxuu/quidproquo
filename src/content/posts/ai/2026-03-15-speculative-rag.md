---
title: "Speculative RAG：用小模型平行打草稿，大模型一次驗證"
date: 2026-03-15
category: ai
tags: [rag, speculative-rag, dual-model, latency-optimization, accuracy]
lang: zh-TW
tldr: "Speculative RAG 用小型專家模型從不同文件子集平行生成多個答案草稿，再由大型模型一次驗證選出最佳答案。準確度提升最高 12.97%，延遲降低最高 50.83%。"
description: "Speculative RAG 的雙模型架構設計：RAG Drafter 平行生成草稿、RAG Verifier 單次驗證，以及與標準 RAG 的效能比較和實作指南。"
draft: false
---

標準 RAG 的流程大家都熟：檢索文件 → 拼成 context → 送給 LLM 生成。這個流程簡單有效，但有一個根本性的瓶頸：**所有文件塞進同一次 LLM 呼叫，模型必須在一次生成中處理所有資訊，而且整個流程是序列的**。

文件越多，context 越長，延遲越高，而且模型在超長 context 中容易「迷路」——重要資訊被淹沒在大量文字裡。這就是 Speculative RAG 要解決的問題。

## 標準 RAG 的三個瓶頸

### 1. 序列處理的延遲問題

標準 RAG 是嚴格的序列流程：

```
Query → Retrieve → [所有文件拼接] → LLM 生成 → 回答
                                      ↑
                              單次呼叫，等很久
```

文件檢索可能快（毫秒級），但 LLM 生成是整個 pipeline 的瓶頸。Context 越長，生成時間越長。10 篇文件拼起來可能有 8,000 tokens，大型模型處理這個長度需要顯著的時間。

### 2. 長 context 的注意力稀釋

把所有檢索到的文件塞進同一個 prompt，模型需要同時處理多份可能互相矛盾的資訊。研究一再表明，LLM 在超長 context 中有「lost in the middle」問題：頭尾的資訊被記住，中間的被忽略。

如果最相關的文件剛好排在中間位置，模型可能根本沒充分利用它。

### 3. 單次生成的賭注

標準 RAG 只生成一次答案。如果這次生成的方向偏了——選錯了文件中的資訊、推理鏈走歪了——就沒有修正的機會。除非加上 Agentic RAG 的迴圈重試機制，但那又帶來更多延遲。

Speculative RAG 的核心洞察：**與其讓一個大模型苦苦處理所有文件，不如讓多個小模型各自處理一小份文件，再讓大模型從多個候選答案中選最好的**。

## Speculative RAG 架構

這個名字借用了 Speculative Decoding 的概念：用小模型做「猜測」，用大模型做「驗證」。

### 整體流程

```
                          ┌─────────────────┐
                          │     Query        │
                          └────────┬────────┘
                                   │
                          ┌────────▼────────┐
                          │    Retriever     │
                          │  (取回 N 篇文件)  │
                          └────────┬────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
              ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐
              │ Subset 1  │ │ Subset 2  │ │ Subset 3  │
              │ {D1, D3}  │ │ {D2, D5}  │ │ {D1, D4}  │
              └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
                    │              │              │
              ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐
              │  Drafter   │ │  Drafter   │ │  Drafter   │
              │  (小模型)   │ │  (小模型)   │ │  (小模型)   │
              │  Draft 1   │ │  Draft 2   │ │  Draft 3   │
              │+ Rationale │ │+ Rationale │ │+ Rationale │
              └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
                    │              │              │
                    │      ┌──────┴──────┐       │
                    └──────►             ◄───────┘
                           │  Verifier   │
                           │  (大模型)    │
                           │  評分 + 選擇  │
                           └──────┬──────┘
                                  │
                          ┌───────▼───────┐
                          │  最佳答案輸出   │
                          └───────────────┘
```

三個關鍵步驟：

1. **文件分組**：把檢索到的 N 篇文件隨機或策略性分成 K 個子集，每個子集包含部分文件
2. **平行草稿生成**：K 個小型 RAG Drafter 模型平行處理各自的文件子集，各自生成一份答案草稿和推理過程
3. **單次驗證**：一個大型 RAG Verifier 模型接收所有草稿，一次性評分並選出最佳答案

### 為什麼這樣更快？

關鍵在於**平行化**。三個小模型同時跑，每個只需要處理 2-3 篇文件（短 context），生成速度快。大模型只需要看幾份草稿（而不是所有原始文件），context 也短，驗證速度也快。

整體延遲 ≈ max(Drafter 延遲) + Verifier 延遲

相比標準 RAG：

整體延遲 ≈ 大模型處理全部文件的延遲

前者通常顯著更短，因為小模型快、context 短、平行執行。

## RAG Drafter 設計

RAG Drafter 是整個架構的「勞動力」——小型、專精、可平行。

### 模型選擇

論文中使用 Mistral-7B-Instruct 作為 Drafter 模型，並針對 RAG 任務進行了特化訓練。選擇小模型的理由：

- **推理速度快**：7B 參數的模型在 GPU 上推理延遲遠低於 70B+ 的大模型
- **可平行部署**：同樣的 GPU 記憶體可以跑多個小模型實例
- **任務專精**：Drafter 不需要廣泛的世界知識，只需要從給定文件中提取和組織資訊

### 每個 Drafter 看不同的文件子集

這是 Speculative RAG 最巧妙的設計。假設檢索器取回了 6 篇文件 {D1, D2, D3, D4, D5, D6}，系統會建立多個子集：

```
Drafter 1 收到：{D1, D3, D5}
Drafter 2 收到：{D2, D4, D6}
Drafter 3 收到：{D1, D2, D4}
Drafter 4 收到：{D3, D5, D6}
```

每個 Drafter 只看部分文件，這帶來幾個好處：

1. **每個 Drafter 的 context 短**：3 篇文件 vs 6 篇文件，注意力更集中
2. **不同子集帶來多樣性**：不同文件組合可能引導出不同的答案角度
3. **冗餘容錯**：即使某個子集的文件品質差，其他子集仍可能包含正確答案所需的資訊

### 子集抽樣策略

論文提出的抽樣方式：從 N 篇檢索文件中，為每個 Drafter 隨機抽取一個子集。子集之間可以有重疊（同一篇文件可能出現在多個子集中），這增加了重要文件被利用的機會。

子集大小的選擇是一個超參數。太小（1 篇）可能資訊不足；太大（接近 N 篇）就失去了分散處理的優勢。論文實驗中通常使用 2-3 篇文件作為子集大小。

### Rationale 生成

每個 Drafter 不只生成答案，還要生成 **rationale**（推理過程）。Drafter 的輸出格式：

```
Draft: [答案內容]
Rationale: [為什麼從這些文件得出這個答案的推理過程]
```

Rationale 的作用是給 Verifier 提供判斷依據。Verifier 不只看答案對不對，還看推理過程合不合理。一個答案可能碰巧正確但推理有漏洞，另一個答案可能不太完整但推理鏈條嚴密——Verifier 可以據此做更好的判斷。

### Drafter 的訓練

論文中的 Drafter 使用知識蒸餾（Knowledge Distillation）方式訓練：

1. 用大型模型（如 GPT-4）針對 RAG 任務生成高品質的 (query, documents, draft, rationale) 訓練資料
2. 用這些資料微調小型模型（Mistral-7B-Instruct）
3. 微調後的小模型學會了「看文件 → 寫草稿 + 推理」的能力

這種訓練方式讓 7B 的小模型在特定任務上接近大模型的品質，但保持小模型的速度優勢。

## RAG Verifier 設計

RAG Verifier 是架構中的「裁判」——大型、通用、一次定勝負。

### 模型選擇

論文中使用 GPT-4 或類似的大型通用模型作為 Verifier。選擇大模型的理由：

- **廣泛的世界知識**：可以交叉驗證草稿的準確性
- **強大的推理能力**：可以評估推理鏈的邏輯一致性
- **比較判斷能力**：同時看多個候選答案，選出最好的

### 驗證流程

Verifier 收到的輸入：

```
Query: [原始問題]

Draft 1:
Answer: [草稿 1 的答案]
Rationale: [草稿 1 的推理過程]

Draft 2:
Answer: [草稿 2 的答案]
Rationale: [草稿 2 的推理過程]

Draft 3:
Answer: [草稿 3 的答案]
Rationale: [草稿 3 的推理過程]

Please evaluate each draft and select the best answer.
```

注意 Verifier **不看原始文件**。它只看 Drafter 的草稿和推理過程。這是刻意的設計：

1. **Context 更短**：3 份草稿遠比 6 篇原始文件短
2. **資訊已預處理**：Drafter 已經從原始文件中提取了相關資訊
3. **聚焦比較**：Verifier 的任務是比較和判斷，不是從頭提取資訊

### 評分機制

Verifier 對每個草稿進行多維度評分：

1. **事實準確性**（Factual Accuracy）：答案是否與推理中引用的資訊一致？
2. **推理完整性**（Reasoning Completeness）：推理鏈是否完整、是否有跳躍？
3. **問題相關性**（Query Relevance）：答案是否直接回應了問題？
4. **自洽性**（Self-Consistency）：答案和推理之間是否一致？

最終 Verifier 輸出一個總分或直接選擇最佳草稿。在論文的實作中，使用條件概率的方式來評分：

```
Score(draft_k) = P_verifier(draft_k | query, all_drafts)
```

也就是在給定所有草稿的情況下，Verifier 模型生成每個草稿 token 的概率。概率越高，表示 Verifier 越「認同」這個草稿。

### 為什麼 Verifier 不需要看原始文件？

這是一個違反直覺的設計選擇。我們可能會想：Verifier 不看原始文件，怎麼判斷草稿是否準確？

答案是：**Verifier 依靠的是大模型自身的世界知識和推理能力**。

- 如果一個草稿聲稱「台灣最高的山是玉山，海拔 3,952 公尺」，Verifier 的大模型本身就知道這是否正確
- 如果一個草稿的推理有邏輯矛盾（前面說 A，後面推出 not A），Verifier 可以靠推理能力發現
- 如果多個草稿給出不同答案，Verifier 可以透過交叉比對來判斷哪個更可信

這種設計讓 Verifier 的 context window 保持簡短，進一步降低延遲。

## 效能數據

論文在五個 benchmark 上測試了 Speculative RAG，與標準 RAG 和其他方法比較。以下是主要結果。

### 準確度比較

| Benchmark | Standard RAG | Self-RAG | CRAG | Speculative RAG | vs Standard |
|-----------|-------------|----------|------|-----------------|-------------|
| TriviaQA | 68.27% | 70.41% | 69.83% | 73.59% | **+5.32%** |
| MuSiQue | 25.14% | 27.30% | 26.71% | 30.48% | **+5.34%** |
| PopQA | 43.87% | 49.06% | 47.22% | 56.84% | **+12.97%** |
| PubHealth | 72.40% | 74.10% | 73.50% | 76.20% | **+3.80%** |
| ARC-Challenge | 78.95% | 81.23% | 80.56% | 84.17% | **+5.22%** |

幾個觀察：

- **PopQA 提升最大（+12.97%）**：PopQA 是長尾知識問答，很多問題涉及不常見的實體。Speculative RAG 的多子集策略讓不同 Drafter 有機會從不同角度找到答案
- **MuSiQue 也有顯著提升（+5.34%）**：MuSiQue 是多跳推理任務，需要組合多篇文件的資訊。不同 Drafter 看不同文件組合，增加了「碰巧」組合到正確資訊的機會
- **全面超越 Self-RAG 和 CRAG**：Speculative RAG 在所有 benchmark 上都優於這兩個方法

### 延遲比較

| Benchmark | Standard RAG 延遲 | Speculative RAG 延遲 | 延遲降低 |
|-----------|-------------------|---------------------|----------|
| TriviaQA | 12.4s | 6.1s | **-50.81%** |
| MuSiQue | 14.8s | 7.8s | **-47.30%** |
| PopQA | 11.2s | 5.5s | **-50.89%** |
| PubHealth | 13.6s | 7.2s | **-47.06%** |
| ARC-Challenge | 10.8s | 5.8s | **-46.30%** |

延遲降低的來源：

1. **Drafter 平行執行**：多個小模型同時跑，總延遲取決於最慢的那個（而非加總）
2. **Context 更短**：每個 Drafter 只處理 2-3 篇文件，Verifier 只處理幾份草稿
3. **大模型呼叫次數減少**：標準 RAG 讓大模型處理所有文件，Speculative RAG 只讓大模型做驗證（context 更短）

### 準確度 vs 延遲的帕累托改善

這是 Speculative RAG 最強的地方：**它同時改善了準確度和延遲**。

通常我們面臨的取捨是：

- 想要更準確？用更大的模型、處理更多文件 → 延遲更高
- 想要更快？用更小的模型、處理更少文件 → 準確度下降

Speculative RAG 打破了這個取捨。透過架構設計（而非單純堆硬體），它在兩個維度上都取得了改善。這是一個帕累托改善（Pareto Improvement）。

## 與其他 RAG 模式比較

### vs Standard RAG

```
Standard RAG:
  Query → Retrieve ALL docs → [Big Model] → Answer
  延遲：高（大模型處理長 context）
  準確度：中（注意力稀釋）

Speculative RAG:
  Query → Retrieve docs → Split into subsets
        → [Small Model 1] → Draft 1 ─┐
        → [Small Model 2] → Draft 2 ──┤→ [Big Model] → Best Answer
        → [Small Model 3] → Draft 3 ─┘
  延遲：低（平行 + 短 context）
  準確度：高（多角度 + 驗證）
```

核心差異：Standard RAG 是「一個模型做所有事」，Speculative RAG 是「分工合作」。

### vs Self-RAG

Self-RAG 讓模型在生成過程中自我反思，決定是否需要更多檢索。它的問題：

1. **序列反思**：反思-檢索-再生成 是序列流程，每次反思都增加延遲
2. **同一模型身兼多職**：同一個模型既要生成又要反思，任務衝突
3. **單一視角**：始終從同樣的文件集合出發

Speculative RAG 的優勢：

1. **平行而非序列**：多個 Drafter 同時工作
2. **專職分工**：Drafter 專注生成，Verifier 專注驗證
3. **多樣化視角**：不同文件子集帶來不同角度

| 維度 | Self-RAG | Speculative RAG |
|------|---------|-----------------|
| 架構 | 單模型 + 反思 token | 雙模型（Drafter + Verifier） |
| 執行方式 | 序列（生成→反思→再生成） | 平行（多 Drafter）+ 一次驗證 |
| 延遲 | 高（多輪迭代） | 低（平行 + 短 context） |
| 多樣性 | 低（同一視角反思） | 高（不同文件子集） |
| 訓練成本 | 需要特殊 token 訓練 | 需要 Drafter 蒸餾訓練 |

### vs CRAG（Corrective RAG）

CRAG 的核心是「檢索品質檢測 + 修正」：如果檢索結果不好，就修正查詢重新檢索。

兩者解決的問題不同：

- **CRAG 解決的是「檢索品質差」的問題**：檢索到的文件不相關，需要修正查詢
- **Speculative RAG 解決的是「生成品質差」的問題**：文件已經檢索到了，問題在於如何更好地利用它們

它們其實是互補的。你可以先用 CRAG 確保檢索品質，再用 Speculative RAG 確保生成品質：

```
Query → CRAG（確保檢索品質）→ Speculative RAG（確保生成品質）→ Answer
```

| 維度 | CRAG | Speculative RAG |
|------|------|-----------------|
| 目標 | 改善檢索品質 | 改善生成品質 |
| 修正對象 | 查詢 / 檢索結果 | 答案草稿 |
| 額外成本 | 多次檢索 | 多個 Drafter 推理 |
| 模型需求 | 單模型 | 雙模型（大 + 小） |
| 可組合性 | 可與 Speculative RAG 組合 | 可與 CRAG 組合 |

### 各方法的適用場景總覽

```
                    檢索品質
                    ↑
          高 ┃  Standard RAG    Speculative RAG
             ┃  (夠用了)         (要更準更快)
             ┃
          低 ┃  CRAG            CRAG + Speculative RAG
             ┃  (先修檢索)       (兩個都要修)
             ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━→
                    低              高
                         生成複雜度
```

## 實作指南

以下是一個 TypeScript 實作範例，展示 Speculative RAG 的雙模型模式。

### 核心類型定義

```typescript
interface Document {
  id: string;
  content: string;
  score: number; // 檢索相關性分數
}

interface Draft {
  answer: string;
  rationale: string;
  sourceDocIds: string[];
  drafterId: number;
}

interface VerificationResult {
  selectedDraft: Draft;
  scores: Map<number, number>; // drafterId → score
  confidence: number;
}

interface SpeculativeRAGConfig {
  numDrafters: number;        // Drafter 數量（預設 3-5）
  subsetSize: number;         // 每個子集的文件數（預設 2-3）
  drafterModel: string;       // 小模型 ID
  verifierModel: string;      // 大模型 ID
  maxDrafterTokens: number;   // Drafter 最大輸出 token
  maxVerifierTokens: number;  // Verifier 最大輸出 token
}
```

### 文件子集抽樣

```typescript
function sampleDocumentSubsets(
  documents: Document[],
  numSubsets: number,
  subsetSize: number,
): Document[][] {
  const subsets: Document[][] = [];

  for (let i = 0; i < numSubsets; i++) {
    // 加權隨機抽樣：相關性分數越高的文件越容易被選中
    const subset = weightedSample(documents, subsetSize);
    subsets.push(subset);
  }

  return subsets;
}

function weightedSample(
  documents: Document[],
  size: number,
): Document[] {
  const totalScore = documents.reduce((sum, doc) => sum + doc.score, 0);
  const selected: Document[] = [];
  const remaining = [...documents];

  for (let i = 0; i < Math.min(size, remaining.length); i++) {
    // 根據檢索分數加權抽樣
    const weights = remaining.map((doc) => doc.score / totalScore);
    const idx = weightedRandomIndex(weights);
    selected.push(remaining[idx]);
    remaining.splice(idx, 1);
  }

  return selected;
}

function weightedRandomIndex(weights: number[]): number {
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (r <= cumulative) return i;
  }
  return weights.length - 1;
}
```

### RAG Drafter 實作

```typescript
async function generateDraft(
  query: string,
  documents: Document[],
  drafterId: number,
  config: SpeculativeRAGConfig,
): Promise<Draft> {
  const docContext = documents
    .map((doc, i) => `[Document ${i + 1}] (ID: ${doc.id})\n${doc.content}`)
    .join('\n\n');

  const prompt = `You are a RAG specialist. Given the following documents, answer the query.
You MUST also provide your reasoning process (rationale).

Query: ${query}

Documents:
${docContext}

Respond in this exact format:
Answer: [Your answer based on the documents]
Rationale: [Step-by-step reasoning for how you arrived at this answer from the documents]`;

  const response = await callLLM({
    model: config.drafterModel,
    prompt,
    maxTokens: config.maxDrafterTokens,
    temperature: 0.7, // 稍高的 temperature 增加多樣性
  });

  const { answer, rationale } = parseDraftResponse(response);

  return {
    answer,
    rationale,
    sourceDocIds: documents.map((d) => d.id),
    drafterId,
  };
}

function parseDraftResponse(
  response: string,
): { answer: string; rationale: string } {
  const answerMatch = response.match(/Answer:\s*([\s\S]*?)(?=Rationale:)/i);
  const rationaleMatch = response.match(/Rationale:\s*([\s\S]*)/i);

  return {
    answer: answerMatch?.[1]?.trim() ?? response,
    rationale: rationaleMatch?.[1]?.trim() ?? 'No rationale provided',
  };
}
```

### RAG Verifier 實作

```typescript
async function verifyDrafts(
  query: string,
  drafts: Draft[],
  config: SpeculativeRAGConfig,
): Promise<VerificationResult> {
  const draftsContext = drafts
    .map(
      (draft, i) =>
        `[Draft ${i + 1}] (Drafter #${draft.drafterId})
Answer: ${draft.answer}
Rationale: ${draft.rationale}
Source Documents: ${draft.sourceDocIds.join(', ')}`,
    )
    .join('\n\n---\n\n');

  const prompt = `You are an expert answer verifier. Given a query and multiple draft answers,
evaluate each draft and select the best one.

Evaluation criteria:
1. Factual Accuracy: Is the answer factually correct?
2. Reasoning Quality: Is the rationale logical and complete?
3. Query Relevance: Does the answer directly address the query?
4. Self-Consistency: Are the answer and rationale consistent?

Query: ${query}

Drafts:
${draftsContext}

Respond in this exact format:
Selected: [draft number]
Confidence: [0.0-1.0]
Scores: [draft1_score, draft2_score, ...]
Justification: [Why you selected this draft]`;

  const response = await callLLM({
    model: config.verifierModel,
    prompt,
    maxTokens: config.maxVerifierTokens,
    temperature: 0.0, // 驗證用低 temperature，確保一致性
  });

  return parseVerificationResponse(response, drafts);
}

function parseVerificationResponse(
  response: string,
  drafts: Draft[],
): VerificationResult {
  const selectedMatch = response.match(/Selected:\s*(\d+)/i);
  const confidenceMatch = response.match(/Confidence:\s*([\d.]+)/i);
  const scoresMatch = response.match(/Scores:\s*\[([\d.,\s]+)\]/i);

  const selectedIdx = (parseInt(selectedMatch?.[1] ?? '1') - 1);
  const confidence = parseFloat(confidenceMatch?.[1] ?? '0.5');
  const scoreValues = scoresMatch?.[1]?.split(',').map((s) => parseFloat(s.trim())) ?? [];

  const scores = new Map<number, number>();
  drafts.forEach((draft, i) => {
    scores.set(draft.drafterId, scoreValues[i] ?? 0);
  });

  return {
    selectedDraft: drafts[selectedIdx] ?? drafts[0],
    scores,
    confidence,
  };
}
```

### 完整 Pipeline

```typescript
async function speculativeRAG(
  query: string,
  config: SpeculativeRAGConfig,
): Promise<{
  answer: string;
  confidence: number;
  selectedDrafterId: number;
  allDrafts: Draft[];
  verification: VerificationResult;
}> {
  // Step 1: 檢索文件
  const documents = await retrieve(query);

  // Step 2: 建立文件子集
  const subsets = sampleDocumentSubsets(
    documents,
    config.numDrafters,
    config.subsetSize,
  );

  // Step 3: 平行生成草稿（關鍵！）
  const draftPromises = subsets.map((subset, i) =>
    generateDraft(query, subset, i, config),
  );
  const drafts = await Promise.all(draftPromises);

  // Step 4: 大模型驗證
  const verification = await verifyDrafts(query, drafts, config);

  return {
    answer: verification.selectedDraft.answer,
    confidence: verification.confidence,
    selectedDrafterId: verification.selectedDraft.drafterId,
    allDrafts: drafts,
    verification,
  };
}
```

### 使用範例

```typescript
const config: SpeculativeRAGConfig = {
  numDrafters: 4,
  subsetSize: 2,
  drafterModel: 'mistral-7b-instruct',   // 小模型
  verifierModel: 'gpt-4',                 // 大模型
  maxDrafterTokens: 512,
  maxVerifierTokens: 256,
};

const result = await speculativeRAG(
  '台灣哪個岩場最適合初學者？',
  config,
);

console.log(`Answer: ${result.answer}`);
console.log(`Confidence: ${result.confidence}`);
console.log(`Selected Drafter: #${result.selectedDrafterId}`);
console.log(`All drafts: ${result.allDrafts.length}`);
```

### 實作注意事項

**Drafter 模型的選擇**

不一定要用論文中的 Mistral-7B。任何支持 instruction following 的小模型都可以：

- Mistral 7B / Mixtral 8x7B
- Llama 3.1 8B
- Phi-3 Mini (3.8B)
- Gemma 2 9B

關鍵是模型要足夠小以支持平行部署，又要足夠聰明以從文件中提取資訊。

**Verifier 模型的選擇**

大型通用模型最適合：

- GPT-4 / GPT-4o
- Claude 3.5 Sonnet / Claude 3 Opus
- Gemini 1.5 Pro

Verifier 需要的是廣泛知識和強大的判斷力，而不是速度。

**超參數調整**

```typescript
// 保守配置（低延遲，適合簡單問題）
const conservativeConfig: SpeculativeRAGConfig = {
  numDrafters: 3,
  subsetSize: 2,
  drafterModel: 'phi-3-mini',
  verifierModel: 'gpt-4o-mini',
  maxDrafterTokens: 256,
  maxVerifierTokens: 128,
};

// 積極配置（高準確度，適合複雜問題）
const aggressiveConfig: SpeculativeRAGConfig = {
  numDrafters: 5,
  subsetSize: 3,
  drafterModel: 'mistral-7b-instruct',
  verifierModel: 'gpt-4',
  maxDrafterTokens: 1024,
  maxVerifierTokens: 512,
};
```

## 適用場景與限制

### 適合使用 Speculative RAG 的場景

**1. 高延遲敏感的知識問答**

如果你的應用對回應時間有嚴格要求（例如客服聊天機器人、即時搜尋引擎），Speculative RAG 可以在不犧牲準確度的前提下顯著降低延遲。

**2. 文件集合大且多樣**

當檢索器回傳的文件數量多（10+ 篇）且涵蓋不同面向時，Speculative RAG 的子集分散策略特別有效。不同 Drafter 看不同子集，更容易捕捉到不同面向的資訊。

**3. 需要高準確度的場景**

醫療問答（PubHealth benchmark）、科學推理（ARC-Challenge）等需要高準確度的場景。多個 Drafter 的多樣性 + Verifier 的嚴格驗證，比單次生成更可靠。

**4. 有 GPU 資源支持平行推理**

Speculative RAG 需要同時跑多個 Drafter 實例。如果你有足夠的 GPU 資源（或使用支持 batch inference 的 API），這個架構才能發揮平行化的優勢。

### 不適合使用的場景

**1. 簡單的事實查詢**

「台灣的首都是什麼？」這種問題，標準 RAG 甚至直接讓 LLM 回答就行了，不需要多 Drafter 驗證。過度架構化反而浪費資源。

**2. GPU 資源有限**

如果你只有一個 GPU 或使用的 API 不支持 batch/concurrent 呼叫，Drafter 的平行化優勢就沒了。序列跑 4 個 Drafter + 1 個 Verifier，延遲反而比標準 RAG 更高。

**3. 文件品質一致且高**

如果你的知識庫品質很高、文件之間不矛盾，標準 RAG 的單次生成通常就足夠好。Speculative RAG 的多樣性優勢在這種情況下不明顯。

**4. 需要即時串流的場景**

Speculative RAG 需要等所有 Drafter 完成 + Verifier 驗證才能輸出。如果你的應用需要 token-by-token 串流（例如 ChatGPT 式的漸進顯示），這個架構需要額外的改造。

一種可能的串流方案：先串流 confidence 最高的 Drafter 的草稿，同時在背景跑 Verifier。如果 Verifier 選了不同的草稿，再替換顯示。但這增加了 UX 複雜度。

**5. 文件數量很少**

如果只檢索到 2-3 篇文件，分成多個子集意義不大（每個子集可能只有 1 篇文件）。這時候標準 RAG 直接處理就好。

### 成本考量

Speculative RAG 的成本結構跟標準 RAG 不同：

| 項目 | Standard RAG | Speculative RAG |
|------|-------------|-----------------|
| 大模型呼叫次數 | 1 次（長 context） | 1 次（短 context） |
| 小模型呼叫次數 | 0 | K 次（平行） |
| 大模型 input tokens | 多（所有文件） | 少（只有草稿） |
| 小模型 input tokens | 0 | K × 子集文件 tokens |
| 總 token 成本 | 中 | 中偏高 |
| GPU 需求 | 低 | 中偏高 |

Token 成本方面，Speculative RAG 可能略高（因為多了 K 次 Drafter 呼叫），但大模型的 input tokens 減少了（草稿 vs 原始文件）。如果大小模型的價格差距大（例如 GPT-4 vs Mistral-7B），總成本可能持平甚至更低。

延遲成本方面，Speculative RAG 明顯更低，這在延遲敏感的場景中價值很高。

## 未來展望

Speculative RAG 在 2024 年 7 月發表，2025 年被 ICLR 接收。這個架構的核心思想——**分工與平行化**——很有可能被更廣泛地應用在其他 LLM pipeline 中。

幾個可能的發展方向：

1. **自適應 Drafter 數量**：根據問題的複雜度動態調整 Drafter 數量。簡單問題用 2 個，複雜問題用 5 個。
2. **智慧子集分配**：不是隨機分配文件子集，而是根據文件的主題、類型進行策略性分組。
3. **Drafter 特化**：不同 Drafter 專精不同類型的問題（事實型、推理型、比較型），根據問題類型路由。
4. **與其他 RAG 技術組合**：CRAG + Speculative RAG、Graph RAG + Speculative RAG 等組合。

## 參考資料

- Wang, Z., et al. (2024). "Speculative RAG: Enhancing Retrieval Augmented Generation through Drafting." *ICLR 2025*. [arXiv:2407.08223](https://arxiv.org/abs/2407.08223)
- Leviathan, Y., et al. (2023). "Fast Inference from Transformers via Speculative Decoding." *ICML 2023*. — Speculative Decoding 的原始論文，Speculative RAG 借鑑了它的核心概念
- Asai, A., et al. (2024). "Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection." *ICLR 2024*. — Self-RAG 對比方法
- Yan, S., et al. (2024). "Corrective Retrieval Augmented Generation." *AAAI 2024*. — CRAG 對比方法
