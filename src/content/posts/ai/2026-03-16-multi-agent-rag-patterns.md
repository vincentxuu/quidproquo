---
title: "Multi-Agent RAG：多個專業 Agent 協作的分散式檢索架構"
date: 2026-03-16
category: ai
tags: [rag, multi-agent, orchestration, distributed-retrieval, agent]
lang: zh-TW
tldr: "單一 RAG Agent 處理所有查詢會遇到知識邊界和效能瓶頸。Multi-Agent RAG 把檢索任務分派給多個專業化 Agent，每個 Agent 有自己的知識庫和檢索策略，由中央 Orchestrator 協調合併結果。"
description: "Multi-Agent RAG 的架構設計：Orchestrator 協調模式、專業化 Agent 設計、非同步通訊與平行處理、結果融合策略，以及與單一 Agentic RAG 的比較。"
draft: false
---

當你的 RAG 系統需要同時回答法律條文、財務報表、和技術文件的問題時，一個 Agent 做所有事情就開始出問題了。

不是模型不夠強，是架構不對。

---

## 為什麼需要 Multi-Agent RAG

單一 Agentic RAG 的設計是：一個 Agent 配一組工具，根據查詢決定要不要搜尋、搜幾次、怎麼搜。這個模式在單一領域效果很好，但一旦知識範圍變廣，三個問題會浮現。

### 1. 知識邊界模糊

一個 Agent 管理的知識庫越大，retrieval 的精準度越低。把法律文件、財報、技術文件全部塞進同一個向量資料庫，embedding space 裡的語義距離會被稀釋。「合規」這個詞在法律和財務的語境差異很大，但在同一個 embedding space 裡它們的向量距離很近。

### 2. Context Window 壓力

一個 Agent 要同時理解多個領域的 system prompt、工具定義、檢索結果、和推理狀態。當查詢涉及三個領域，context window 很快就被塞滿：

```
單一 Agent context window 分配：
┌────────────────────────────────────────────┐
│ System Prompt (所有領域的規則)     ~2,000 tokens │
│ Tool Definitions (所有工具)        ~3,000 tokens │
│ 法律檢索結果                      ~4,000 tokens │
│ 財務檢索結果                      ~4,000 tokens │
│ 技術檢索結果                      ~4,000 tokens │
│ 推理歷史                          ~3,000 tokens │
│ ─────────────────────────────────────────── │
│ 總計                             ~20,000 tokens │
│ 留給生成的空間 → 被壓縮             │
└────────────────────────────────────────────┘
```

### 3. 單一檢索策略不夠用

法律文件需要精確的條文匹配（BM25 為主），財務報表需要結構化查詢（SQL + 向量），技術文件需要語意搜尋（dense retrieval 為主）。硬把三種策略塞進一個 Agent 的決策邏輯，會讓每個領域都做得不夠好。

Multi-Agent RAG 的解法很直接：**讓每個領域有自己的專家 Agent，由一個 Orchestrator 來協調。**

---

## 架構設計

整體架構長這樣：

```
                          ┌─────────────┐
                          │  User Query │
                          └──────┬──────┘
                                 │
                                 ▼
                      ┌──────────────────┐
                      │   Orchestrator   │
                      │                  │
                      │  - Query 分析    │
                      │  - Agent 選擇    │
                      │  - 結果融合      │
                      └──┬─────┬──────┬──┘
                         │     │      │
              ┌──────────┘     │      └──────────┐
              ▼                ▼                  ▼
     ┌────────────────┐ ┌──────────────┐ ┌────────────────┐
     │  Legal Agent   │ │ Finance Agent│ │  Tech Agent    │
     │                │ │              │ │                │
     │ - 法規知識庫   │ │ - 財報知識庫 │ │ - 技術文件庫   │
     │ - BM25 為主    │ │ - SQL + 向量 │ │ - Dense + Code │
     │ - 條文比對策略 │ │ - 數值推理   │ │ - 語意搜尋     │
     └───────┬────────┘ └──────┬───────┘ └───────┬────────┘
              │                │                  │
              └──────────┐     │      ┌───────────┘
                         ▼     ▼      ▼
                    ┌──────────────────────┐
                    │   Result Fusion      │
                    │                      │
                    │  - 衝突偵測          │
                    │  - 加權合併          │
                    │  - LLM 合成          │
                    └──────────┬───────────┘
                               │
                               ▼
                        ┌─────────────┐
                        │   Answer    │
                        └─────────────┘
```

每個 Agent 是獨立的 RAG pipeline，有自己的知識庫、embedding model、檢索策略、和 system prompt。Orchestrator 不做檢索，只做三件事：分析查詢、選擇 Agent、融合結果。

這個分離帶來一個重要好處：**每個 Agent 的 context window 只需要裝自己領域的資訊。**

---

## Orchestrator 設計

Orchestrator 是整個系統的中樞，但它本身應該盡量輕薄。它的職責是路由和協調，不是推理和生成。

### Query 分析

Orchestrator 收到查詢後，第一步是分析這個查詢涉及哪些領域：

```typescript
interface QueryAnalysis {
  originalQuery: string;
  detectedDomains: DomainTag[];         // ['legal', 'finance']
  subQueries: Map<DomainTag, string>;   // 分解後的子查詢
  priority: 'latency' | 'accuracy';     // 速度優先還是精準優先
  requiresCrossReference: boolean;       // 是否需要跨領域交叉比對
}

type DomainTag = 'legal' | 'finance' | 'tech' | 'hr' | 'general';

async function analyzeQuery(query: string): Promise<QueryAnalysis> {
  const response = await llm.chat({
    model: 'claude-sonnet-4-20250514',
    system: `你是一個查詢路由器。分析使用者查詢，判斷：
1. 涉及哪些領域（可以多個）
2. 如果涉及多個領域，把查詢拆成各領域的子查詢
3. 是否需要跨領域交叉比對

回傳 JSON 格式。`,
    messages: [{ role: 'user', content: query }],
  });

  return parseAnalysis(response);
}
```

這裡有一個設計決策：**用 LLM 做路由，還是用分類器做路由？**

LLM 路由的好處是彈性高，可以處理模糊查詢和多領域交叉的情況。壞處是多一次 LLM call，增加延遲和成本。如果領域分類相對固定，用一個輕量 classifier（甚至 regex + keyword matching）做第一層過濾，不確定的再丟給 LLM，是比較務實的做法。

```typescript
function fastRoute(query: string): DomainTag[] | null {
  const keywordMap: Record<string, DomainTag> = {
    '第幾條': 'legal',
    '法規': 'legal',
    '合規': 'legal',
    '營收': 'finance',
    '毛利率': 'finance',
    'EPS': 'finance',
    'API': 'tech',
    'deploy': 'tech',
    '部署': 'tech',
  };

  const matched = Object.entries(keywordMap)
    .filter(([kw]) => query.includes(kw))
    .map(([, domain]) => domain);

  const unique = [...new Set(matched)];

  // 有明確匹配就直接路由，沒有才用 LLM
  return unique.length > 0 ? unique : null;
}
```

### Agent 選擇與分派

分析完查詢後，Orchestrator 從 Agent Registry 中選擇對應的 Agent：

```typescript
interface AgentRegistry {
  agents: Map<DomainTag, AgentConfig>;
  getAgent(domain: DomainTag): AgentConfig | undefined;
  listAvailable(): DomainTag[];
}

interface AgentConfig {
  domain: DomainTag;
  endpoint: string;             // Agent 的 API endpoint
  capabilities: string[];       // 這個 Agent 擅長什麼
  maxConcurrency: number;       // 最大並行數
  timeoutMs: number;            // 超時設定
  fallbackDomain?: DomainTag;   // 失敗時退回到哪個 Agent
}
```

### 結果聚合

Orchestrator 的最後一步是把多個 Agent 的結果合併成一個答案。這是最複雜的部分，後面會專門談。

---

## 專業化 Agent 設計

每個 Agent 是一個完整的 RAG pipeline，但針對自己的領域做了深度優化。以下用 Legal Agent 為例展示完整設計：

```typescript
const legalAgent: AgentConfig = {
  domain: 'legal',
  systemPrompt: `你是法律檢索專家。回答時必須：
1. 引用具體的法規名稱、條號
2. 區分「現行法規」和「修正草案」
3. 如果多條法規有衝突，明確指出衝突點
4. 不確定時說「需要進一步確認」，不要編造條文`,

  retrievalStrategy: {
    primary: 'bm25',           // 條文的精確匹配用 BM25 最好
    secondary: 'dense',        // 語意相近的補充搜尋
    fusion: 'rrf',             // Reciprocal Rank Fusion
    topK: 15,
    reranker: 'cross-encoder',
  },

  knowledgeBase: {
    vectorStore: 'legal-vectors',
    bm25Index: 'legal-bm25',
    metadata: {
      fields: ['law_name', 'article_number', 'effective_date', 'status'],
      filters: { status: 'active' },  // 預設只搜現行法規
    },
  },

  postProcessing: {
    addCitations: true,        // 自動加上引用格式
    crossReference: true,      // 交叉引用相關條文
    confidenceThreshold: 0.7,  // 信心度低於 0.7 就標註不確定
  },
};
```

Finance Agent 和 Tech Agent 的結構相同，但各維度的設計選擇不同：

| 維度 | Legal Agent | Finance Agent | Tech Agent |
|------|------------|--------------|------------|
| 主要檢索 | BM25 精確比對 | Text-to-SQL | Dense Retrieval |
| 補充檢索 | Dense | Dense | Code Search |
| 精排 | Cross-encoder | Cross-encoder | Cross-encoder |
| 關鍵需求 | 條文精確性 | 數字精確性 | 版本相容性 |
| 後處理 | 引用格式化 | 計算驗證 | 程式碼語法檢查 |

---

## 通訊模式

多個 Agent 之間的通訊模式直接影響系統的延遲和可靠性。三種基本模式：

### 平行扇出（Parallel Fan-out）

Orchestrator 同時對所有相關 Agent 發出請求，用 `Promise.allSettled` 等全部回來後合併。延遲等於最慢的 Agent，而不是所有 Agent 延遲的加總。每個 Agent 都設 timeout 和 fallback，單一 Agent 失敗不影響其他。

```typescript
// 核心邏輯：對每個 domain 平行呼叫，失敗的走 fallback
const tasks = domains.map(async (domain) => {
  try {
    return await withTimeout(callAgent(registry.getAgent(domain)!, subQuery), timeoutMs);
  } catch {
    return agent.fallbackDomain
      ? callAgent(registry.getAgent(agent.fallbackDomain)!, subQuery)
      : { domain, status: 'failed' };
  }
});
const results = await Promise.allSettled(tasks);
```

### 循序委派（Sequential Delegation）

一個 Agent 的輸出是另一個 Agent 的輸入。例如「這個合約條款是否符合個資法？如果不符合，修正的財務成本是多少？」先問 Legal Agent，再把結果傳給 Finance Agent。延遲是所有 Agent 的加總，一個失敗會阻塞整個鏈。

### 混合模式

實務上最常用。能平行的就平行，有依賴的才循序：先用 `Promise.allSettled` 跑獨立的 Agent，等結果回來後，再把結果傳給有依賴關係的 Agent 循序執行。

### 何時用哪種

```
查詢類型                              → 通訊模式
─────────────────────────────────────────────────────
「比較法律和財務觀點」                → 平行扇出
「法律合規 → 財務影響」              → 循序委派
「法律 + 技術並行，然後財務評估」    → 混合模式
「只問一個領域」                      → 單一 Agent，不需要 multi-agent
```

---

## 結果融合策略

多個 Agent 回來的結果要怎麼合併成一個答案？這是 Multi-Agent RAG 最關鍵的設計問題。

### 策略一：投票法（Voting）

如果多個 Agent 對同一個事實給出不同答案，用多數決。

```typescript
function majorityVoting(results: AgentResult[]): string {
  const answers = results
    .filter((r) => r.status === 'success')
    .map((r) => r.answer);

  // 用 LLM 判斷哪些答案在語義上等價
  const groups = groupBySemantic(answers);

  // 回傳最大群組的答案
  return groups.sort((a, b) => b.length - a.length)[0][0];
}
```

**適用**：事實性問題（有唯一正確答案）。
**不適用**：多觀點的分析性問題。

### 策略二：加權評分（Weighted Scoring）

每個 Agent 的結果帶有信心分數，按權重合併。

```typescript
interface AgentResult {
  domain: DomainTag;
  answer: string;
  confidence: number;        // 0-1，Agent 自評的信心度
  sources: SourceReference[];
  status: 'success' | 'partial' | 'failed';
}

function weightedFusion(
  results: AgentResult[],
  domainWeights: Map<DomainTag, number>
): FusedResult {
  const scoredResults = results
    .filter((r) => r.status !== 'failed')
    .map((r) => ({
      ...r,
      finalScore:
        r.confidence * (domainWeights.get(r.domain) ?? 1.0),
    }))
    .sort((a, b) => b.finalScore - a.finalScore);

  return {
    primaryAnswer: scoredResults[0],
    supplementary: scoredResults.slice(1),
    allSources: scoredResults.flatMap((r) => r.sources),
  };
}
```

權重怎麼設？可以根據查詢類型動態調整。問法律問題時，Legal Agent 的權重高；問財務問題時，Finance Agent 的權重高。Orchestrator 在 Query 分析階段就可以決定權重。

### 策略三：LLM 合成（LLM-based Synthesis）

把所有 Agent 的結果丟給一個 LLM，讓它綜合出一個連貫的答案。

```typescript
async function llmSynthesis(
  originalQuery: string,
  results: AgentResult[]
): Promise<string> {
  const agentOutputs = results
    .filter((r) => r.status !== 'failed')
    .map((r) => `## ${r.domain} Agent 的回答\n信心度：${r.confidence}\n\n${r.answer}`)
    .join('\n\n---\n\n');

  const response = await llm.chat({
    model: 'claude-sonnet-4-20250514',
    system: `你是一個結果融合專家。多個專業 Agent 已經針對使用者的問題提供了各自的回答。
你的任務是：
1. 綜合所有 Agent 的回答，產生一個連貫的最終答案
2. 如果 Agent 之間有矛盾，明確指出矛盾點和各方的立場
3. 保留每個 Agent 的引用來源
4. 不要添加 Agent 沒有提到的資訊`,
    messages: [
      {
        role: 'user',
        content: `原始查詢：${originalQuery}\n\n各 Agent 的回答：\n${agentOutputs}`,
      },
    ],
  });

  return response.content;
}
```

**這是最常用的策略**，因為它能處理最複雜的情況：部分重疊、互補資訊、和衝突觀點。代價是多一次 LLM call。

### 策略四：衝突偵測

在合成之前，先檢查各 Agent 的結果是否有矛盾：

```typescript
interface ConflictReport {
  hasConflict: boolean;
  conflicts: Array<{
    topic: string;
    agentA: { domain: DomainTag; claim: string };
    agentB: { domain: DomainTag; claim: string };
    severity: 'low' | 'medium' | 'high';
  }>;
}

async function detectConflicts(
  results: AgentResult[]
): Promise<ConflictReport> {
  // 兩兩比對
  const pairs: [AgentResult, AgentResult][] = [];
  for (let i = 0; i < results.length; i++) {
    for (let j = i + 1; j < results.length; j++) {
      pairs.push([results[i], results[j]]);
    }
  }

  const conflicts = await Promise.all(
    pairs.map(([a, b]) => checkPairConflict(a, b))
  );

  return {
    hasConflict: conflicts.some((c) => c !== null),
    conflicts: conflicts.filter((c): c is NonNullable<typeof c> => c !== null),
  };
}
```

偵測到衝突後，Orchestrator 可以：
1. 把衝突明確呈現給使用者
2. 根據領域權重決定採信哪一方
3. 請相關 Agent 提供更多證據

---

## 實作範例

把以上元件組合成一個完整的 Orchestrator。前面已經展示過各個元件的實作，這裡看整合後的主流程：

```typescript
class MultiAgentOrchestrator {
  private registry: AgentRegistry;
  private analyzer: QueryAnalyzer;
  private fusionEngine: FusionEngine;

  async process(query: string): Promise<OrchestratorResponse> {
    const startTime = Date.now();

    // Step 1: 分析查詢 → 決定涉及哪些領域
    const analysis = await this.analyzer.analyze(query);

    // Step 2: 單一領域 → 直接轉發，省掉協調開銷
    if (analysis.detectedDomains.length === 1) {
      return this.dispatchSingle(analysis, startTime);
    }

    // Step 3: 多領域 → 根據依賴關係選擇通訊模式
    const results = analysis.dependencyGraph.size > 0
      ? await this.hybridDispatch(analysis)   // 有依賴：混合模式
      : await this.parallelFanOut(analysis);  // 無依賴：平行扇出

    // Step 4: 衝突偵測 + 結果融合
    const conflicts = await this.fusionEngine.detectConflicts(results);
    const answer = await this.fusionEngine.synthesize(
      query, results, conflicts, analysis.domainWeights
    );

    return {
      answer,
      sources: results.flatMap((r) => r.sources),
      agentResults: results,
      conflicts,
      totalLatencyMs: Date.now() - startTime,
    };
  }
}
```

使用方式：

```typescript
const orchestrator = new MultiAgentOrchestrator({
  analyzerModel: 'claude-sonnet-4-20250514',
  fusionModel: 'claude-sonnet-4-20250514',
  agents: [
    { domain: 'legal',   endpoint: 'https://agents.internal/legal',   timeoutMs: 10_000 },
    { domain: 'finance', endpoint: 'https://agents.internal/finance', timeoutMs: 8_000  },
    { domain: 'tech',    endpoint: 'https://agents.internal/tech',    timeoutMs: 6_000  },
  ],
});

// 單一領域查詢 → 直接轉發給 Legal Agent
const r1 = await orchestrator.process('個資法第 6 條的敏感性個資有哪些？');

// 多領域查詢 → 平行扇出 + LLM 合成
const r2 = await orchestrator.process(
  '我們的 AI 產品收集使用者行為數據，從法律合規和技術架構兩個角度分析風險'
);

// 有依賴的查詢 → Legal 先跑，結果傳給 Finance
const r3 = await orchestrator.process(
  '檢查我們的資料處理是否符合 GDPR，如果不符合，評估修正的財務成本'
);
```

五行 `process()` 方法包含了整個系統的核心邏輯：分析、路由、分派、偵測、融合。每個步驟的實作細節已經在前面各節展示過。

---

## 與其他模式比較

### vs 單一 Agentic RAG

```
維度              單一 Agentic RAG          Multi-Agent RAG
─────────────────────────────────────────────────────────────
知識範圍          一個 Agent 管所有知識      每個 Agent 管一個領域
檢索策略          一套策略                   每個領域客製策略
Context Window    所有資訊擠在一起           各 Agent 獨立 context
延遲              一個 Agent 的延遲          最慢 Agent + 融合延遲
複雜度            低                         高（需要 Orchestrator）
一致性            天然一致                   需要衝突偵測
適用規模          中小型知識庫               大型多領域知識庫
```

**什麼時候該用 Multi-Agent RAG？** 當你的知識庫跨越三個以上明顯不同的領域，且每個領域有不同的最佳檢索策略時。如果你的知識庫主要是同一個領域的文件，單一 Agentic RAG 加上好的 chunking 和 routing 就夠了。

### vs Modular RAG

Modular RAG 把 RAG pipeline 拆成可組合的模組（chunking、embedding、retrieval、reranking、generation），但所有模組共享同一個 pipeline context。

Multi-Agent RAG 更進一步：每個 Agent 是一個完整的 pipeline，有自己的 context。差異在於 **隔離程度**：

```
Modular RAG:
  一個 Pipeline → [Module A] → [Module B] → [Module C] → Output
  （模組共享同一個 PipelineContext）

Multi-Agent RAG:
  Orchestrator → ┌ Pipeline 1 (獨立 context) → Result 1 ┐
                 ├ Pipeline 2 (獨立 context) → Result 2 ├→ Fusion → Output
                 └ Pipeline 3 (獨立 context) → Result 3 ┘
```

兩者不互斥。每個 Agent 內部可以用 Modular RAG 的設計，Multi-Agent 是更上一層的架構。

### vs Google 的 Multi-Agent 模式

Google 在 2025 年發佈的 Agent 白皮書中提出了幾種 multi-agent 模式：

1. **Hierarchical**：一個 supervisor agent 管理多個 worker agents。跟本文的 Orchestrator 模式類似，但 Google 強調 supervisor 本身也可以是一個 agent（有自己的推理能力），而不只是一個路由器。

2. **Peer-to-peer**：Agent 之間直接通訊，沒有中央 Orchestrator。適合 Agent 之間需要頻繁溝通的場景，但在 RAG 中比較少用，因為檢索任務通常是獨立的。

3. **Mixture of Experts (MoE)**：從 ML 的 MoE 概念借鑑，用 gating function 決定哪些 Agent 被啟動。跟本文的 fast routing 概念類似。

本文的架構比較接近 **Hierarchical + MoE 的混合**：Orchestrator 扮演 supervisor 的角色，用 routing logic（gating）決定啟動哪些 Agent。

---

## 挑戰與限制

Multi-Agent RAG 不是銀彈。以下是實務上會遇到的痛點。

### 1. 協調開銷

Orchestrator 的每次 LLM call（query 分析、結果融合）都是額外的延遲和成本。一個查詢經過 Multi-Agent RAG 的完整流程：

```
Query 分析 LLM call      ~500ms
Agent 平行執行            ~2,000ms（最慢的那個）
衝突偵測 LLM call         ~400ms
結果融合 LLM call         ~800ms
─────────────────────────────────
總延遲                    ~3,700ms
```

相比之下，單一 Agentic RAG 可能只需要 ~2,000ms。多出來的 1,700ms 全是協調開銷。

**緩解方式**：
- Query 分析用輕量模型或 classifier，不一定要 LLM
- 如果沒有衝突，跳過衝突偵測步驟
- 結果融合可以用 template 拼接，不一定要 LLM 合成

### 2. 多 Agent 延遲

平行扇出的延遲等於最慢的 Agent。如果一個 Agent 特別慢（例如 Finance Agent 需要跑複雜的 SQL 查詢），整體延遲就被它拖住。

**緩解方式**：
- 設定嚴格的 timeout，超時就用 partial result 或 fallback
- 用 streaming：先回傳已經完成的 Agent 結果，慢的 Agent 結果後面補上
- 非同步模式：先給使用者快速回答，背景繼續跑，有更多結果時更新

```typescript
async function streamingFanOut(
  analysis: QueryAnalysis,
  registry: AgentRegistry,
  onPartialResult: (result: AgentResult) => void
): Promise<AgentResult[]> {
  const allResults: AgentResult[] = [];

  const tasks = analysis.detectedDomains.map(async (domain) => {
    const agent = registry.getAgent(domain);
    if (!agent) return;

    const result = await callAgent(agent, analysis.subQueries.get(domain)!);
    allResults.push(result);

    // 每個 Agent 完成就立即回傳
    onPartialResult(result);
  });

  await Promise.allSettled(tasks);
  return allResults;
}
```

### 3. 一致性問題

多個 Agent 是獨立運作的，它們不共享狀態。這會導致：

- **事實矛盾**：Legal Agent 說合規，Finance Agent 假設不合規來估成本。
- **時間不一致**：Legal Agent 引用最新法規，Finance Agent 用的是上一季的數據。
- **術語差異**：不同 Agent 用不同的名詞指涉同一件事。

**緩解方式**：
- 衝突偵測是必要的，不是可選的
- 共享一個 metadata store，確保各 Agent 用的資料版本一致
- Orchestrator 在分派時附上共同的上下文（例如「資料基準日期：2026-03-30」）

### 4. 除錯複雜度

當答案有問題時，你需要追蹤：
1. Orchestrator 的 query 分析對不對？
2. 分派到哪些 Agent？子查詢對不對？
3. 每個 Agent 的檢索結果品質如何？
4. 融合的結果有沒有遺漏或扭曲？

這是四層的除錯，比單一 Agent 的一層除錯複雜得多。

**緩解方式**：Observability 是 Multi-Agent 系統的必要投資。

```typescript
interface AgentTrace {
  traceId: string;
  timestamp: number;
  orchestrator: {
    queryAnalysis: QueryAnalysis;
    routingDecision: DomainTag[];
    communicationMode: 'parallel' | 'sequential' | 'hybrid';
  };
  agents: Array<{
    domain: DomainTag;
    subQuery: string;
    retrievedDocs: number;
    topDocScores: number[];
    confidence: number;
    latencyMs: number;
    status: string;
  }>;
  fusion: {
    conflictsDetected: number;
    strategy: 'voting' | 'weighted' | 'llm-synthesis';
    latencyMs: number;
  };
  totalLatencyMs: number;
}
```

每個查詢都要產生完整的 trace，存到可以事後查詢的地方（例如 OpenTelemetry + Jaeger）。當答案品質下降時，trace 是你唯一的除錯工具。

### 5. Agent 邊界劃分

決定要分幾個 Agent、每個 Agent 負責什麼，是最難的設計決策。分太細會增加協調成本，分太粗會失去專業化的好處。

一個經驗法則：**如果兩個領域的最佳檢索策略不同，就值得分開。** 如果它們用同樣的 embedding model、同樣的 retrieval 方式、只是知識庫不同，那用 metadata filter 區分就好，不需要另一個 Agent。

---

## 結語

Multi-Agent RAG 的核心洞察很簡單：**專業分工比萬能通才更有效。**

但這個架構的價值不是在「多個 Agent」本身，而是在三個設計決策：

1. **隔離**：每個 Agent 有獨立的 context window 和檢索策略，不會互相干擾。
2. **路由**：Orchestrator 把查詢送到對的 Agent，避免所有 Agent 都處理每個查詢。
3. **融合**：多個 Agent 的結果需要有策略地合併，而不是簡單拼接。

如果你的 RAG 系統正在經歷「加更多文件反而讓回答品質下降」的問題，Multi-Agent 架構值得考慮。但在跳進來之前，先確認你已經把單一 Agent 的 retrieval quality 調到夠好了——很多時候，問題不是架構不夠複雜，而是基礎的 chunking 和 retrieval 還沒做好。
