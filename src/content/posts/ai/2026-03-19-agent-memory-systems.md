---
title: "Agent Memory 系統：從 RAG 到 Read-Write 記憶的演化"
date: 2026-03-19
type: guide
category: ai
tags: [agent, memory, procedural-memory, episodic-memory, semantic-memory, rag]
lang: zh-TW
tldr: "RAG 是唯讀的。Agent Memory 讓 AI 不只能讀，還能寫入和持久化資訊。三種記憶類型：Procedural（行為模式）、Episodic（時間事件）、Semantic（事實知識），構成完整的認知記憶系統。"
description: "Agent Memory 三種記憶類型的設計與實作：Procedural Memory 行為模式學習、Episodic Memory 時間事件追蹤、Semantic Memory 事實知識管理，以及從 RAG 到 Agentic RAG 到 Agent Memory 的演化路徑。"
draft: false
---

你的 AI Agent 很聰明，但它記不住任何事。

每次對話開始，它都是一張白紙。上一次聊了什麼、使用者偏好什麼語氣、三天前提過的旅行計畫——全部歸零。你可以透過 RAG 餵它知識，但 RAG 是**唯讀**的：Agent 能讀取外部資料，卻無法把新學到的東西寫回去。

這就像一個人能看書，但不能做筆記。

Agent Memory 改變了這件事。它讓 AI 系統不只能讀取，還能**寫入和持久化資訊**。這篇文章走過從 RAG 到 Agent Memory 的完整演化路徑，拆解三種記憶類型的設計，並附上 TypeScript 實作。

---

## 從 RAG 到 Agent Memory 的演化

### 階段一：RAG（Read-Only）

RAG 是最基本的外部記憶形式。系統從向量資料庫檢索相關文件，塞進 context window，讓 LLM 基於這些資料回答問題。

```
使用者問題 → 向量搜尋 → 取回文件片段 → LLM 生成回答
```

這個流程是**單向的**：資料從外部流入 context，但 LLM 無法把任何東西寫回去。

```typescript
interface RAGPipeline {
  retrieve(query: string): Promise<Document[]>;
  generate(query: string, docs: Document[]): Promise<string>;
}

async function ragAnswer(query: string, pipeline: RAGPipeline): Promise<string> {
  const docs = await pipeline.retrieve(query);
  return pipeline.generate(query, docs);
}
```

RAG 的限制很明確：

- **無法學習**：使用者糾正了 Agent 的錯誤，下次還是會犯
- **無法個人化**：不知道使用者偏好什麼格式、語氣、深度
- **無法累積**：多輪對話的洞察無法跨 session 保留

### 階段二：Agentic RAG（Read + Decide）

Agentic RAG 讓 LLM 在檢索流程中有決策權——評估結果是否充分，不夠就改寫查詢再搜一次。

```typescript
type Decision =
  | { action: 'ANSWER'; confidence: number }
  | { action: 'RETRIEVE'; rewrittenQuery: string }
  | { action: 'BROADEN'; relaxedFilters: FilterSet };

async function agenticRagAnswer(
  query: string,
  pipeline: AgenticRAGPipeline,
  maxSteps = 5,
): Promise<string> {
  let currentQuery = query;
  let allDocs: Document[] = [];

  for (let step = 0; step < maxSteps; step++) {
    const docs = await pipeline.retrieve(currentQuery);
    allDocs = mergeAndDedupe(allDocs, docs);

    const decision = await pipeline.evaluate(currentQuery, allDocs);
    if (decision.action === 'ANSWER') break;
    if (decision.action === 'RETRIEVE') currentQuery = decision.rewrittenQuery;
  }

  return pipeline.generate(query, allDocs);
}
```

Agentic RAG 讀得更聰明，但仍然是**唯讀**的。它不會記住這次搜尋的經驗、不會學到使用者偏好什麼類型的答案。

### 階段三：Agent Memory（Read + Write）

Agent Memory 補上了最後一塊拼圖：**寫入**。

```
對話 → 記憶提取 → 寫入記憶庫
                    ↓
新對話 → 記憶檢索 → 注入 context → LLM 回答
                    ↑
              持久化記憶庫
```

```typescript
interface AgentMemorySystem {
  // Read
  retrieve(query: string, userId: string): Promise<Memory[]>;
  // Write
  store(memory: MemoryInput, userId: string): Promise<string>;
  // Manage
  update(memoryId: string, patch: Partial<MemoryInput>): Promise<void>;
  delete(memoryId: string): Promise<void>;
  listByUser(userId: string): Promise<Memory[]>;
}

interface Memory {
  id: string;
  type: 'procedural' | 'episodic' | 'semantic';
  content: string;
  embedding: number[];
  importance: number;        // 0-1
  createdAt: Date;
  lastAccessedAt: Date;
  accessCount: number;
  metadata: Record<string, unknown>;
}
```

三個階段的差異一目瞭然：

```
                RAG          Agentic RAG     Agent Memory
─────────────────────────────────────────────────────────
讀取             ✓              ✓               ✓
決策             ✗              ✓               ✓
寫入             ✗              ✗               ✓
跨 session      ✗              ✗               ✓
個人化          ✗              ✗               ✓
持續學習         ✗              ✗               ✓
```

關鍵洞察：**Read-Write Memory 是從工具到 Agent 的分水嶺。** 一個能學習、能記住、能累積的系統，才像一個真正的 Agent。

---

## 三種記憶類型

認知科學把人類記憶分成幾種類型。Agent Memory 借用了這個框架，定義了三種最有用的記憶類型。

### 1. Procedural Memory：行為模式

Procedural Memory 存的是**如何做事**——規則、偏好、行為模式。

人類的 Procedural Memory 是騎腳踏車、打字這類「身體記住」的技能。對 AI Agent 來說，它是回應使用者時應該遵循的模式：

- 「永遠使用正式語氣」
- 「回答技術問題時附上程式碼範例」
- 「使用者不喜歡冗長的開場白，直接切入重點」

```typescript
interface ProceduralMemory {
  id: string;
  type: 'procedural';
  rule: string;
  source: 'explicit' | 'inferred';
  confidence: number;
  scope: 'global' | 'topic';
  topic?: string;
  active: boolean;
  createdAt: Date;
}

const examples: ProceduralMemory[] = [
  {
    id: 'proc_001',
    type: 'procedural',
    rule: '使用者偏好繁體中文回覆，技術術語保留英文原文',
    source: 'explicit',
    confidence: 1.0,
    scope: 'global',
    active: true,
    createdAt: new Date('2026-01-15'),
  },
  {
    id: 'proc_002',
    type: 'procedural',
    rule: '回答程式碼問題時，先給完整可執行範例，再解釋',
    source: 'inferred',
    confidence: 0.85,
    scope: 'topic',
    topic: 'programming',
    active: true,
    createdAt: new Date('2026-02-20'),
  },
];
```

Procedural Memory 的注入方式是直接放進 system prompt：

```typescript
function buildSystemPrompt(
  basePrompt: string,
  memories: ProceduralMemory[],
): string {
  const activeRules = memories
    .filter((m) => m.active)
    .sort((a, b) => b.confidence - a.confidence);

  if (activeRules.length === 0) return basePrompt;

  const rulesBlock = activeRules
    .map((m) => {
      const prefix = m.scope === 'global' ? '[全域]' : `[${m.topic}]`;
      return `- ${prefix} ${m.rule}`;
    })
    .join('\n');

  return `${basePrompt}\n\n## 使用者偏好與行為規則\n\n${rulesBlock}`;
}
```

**特性：** 數量少、權重高、不衰減、每次對話都全部載入。

### 2. Episodic Memory：時間事件

Episodic Memory 存的是**發生了什麼事**——帶有時間戳記的具體事件。

人類的 Episodic Memory 是「昨天在咖啡廳遇到 Kevin」「上週五的會議決定用 PostgreSQL」。對 AI Agent 來說：

- 「使用者在 2026/03/15 提到下個月要去日本旅行」
- 「使用者在 2026/03/20 說專案 deadline 是四月底」
- 「使用者在 2026/03/25 抱怨回覆太長，之後調整了風格」

```typescript
interface EpisodicMemory {
  id: string;
  type: 'episodic';
  event: string;
  context: string;
  emotion?: 'positive' | 'negative' | 'neutral';
  importance: number;
  timestamp: Date;
  sessionId: string;
  embedding: number[];
}
```

Episodic Memory 的檢索需要同時考慮**語意相關性**和**時間近度**：

```typescript
async function retrieveEpisodicMemories(
  query: string,
  userId: string,
  vectorStore: VectorStore,
  options: { limit: number; recencyWeight: number; relevanceWeight: number },
): Promise<EpisodicMemory[]> {
  const candidates = await vectorStore.search({
    query,
    filter: { userId, type: 'episodic' },
    limit: options.limit * 3,
  });

  const now = Date.now();
  const scored = candidates.map((c) => {
    const relevanceScore = c.score;

    // 時間衰減：指數衰減，半衰期 7 天
    const ageDays = (now - new Date(c.metadata.timestamp).getTime()) / 86_400_000;
    const recencyScore = Math.pow(0.5, ageDays / 7);

    const finalScore =
      options.relevanceWeight * relevanceScore +
      options.recencyWeight * recencyScore +
      0.1 * c.metadata.importance;

    return { ...c, finalScore };
  });

  scored.sort((a, b) => b.finalScore - a.finalScore);
  return scored.slice(0, options.limit).map((s) => s.memory);
}
```

**特性：** 數量多、有時間維度、會衰減、用 relevance + recency 加權檢索。

### 3. Semantic Memory：事實知識

Semantic Memory 存的是**世界是什麼樣的**——去脈絡化的事實和概念。

人類的 Semantic Memory 是「巴黎是法國首都」「水的沸點是 100 度」。對 AI Agent 來說：

- 「使用者的公司使用 Next.js + TypeScript + Tailwind」
- 「使用者的名字是 Kevin，職位是前端工程師」
- 「專案資料庫是 PostgreSQL 14，部署在 AWS」

```typescript
interface SemanticMemory {
  id: string;
  type: 'semantic';
  fact: string;
  category: string;         // personal, technical, project...
  confidence: number;
  source: 'user_stated' | 'inferred' | 'verified';
  embedding: number[];
  createdAt: Date;
  updatedAt: Date;
  supersededBy?: string;    // 被更新的資訊取代時指向新 ID
}
```

Semantic Memory 的檢索主要靠向量相似度，但要排除已被取代的舊記憶：

```typescript
async function retrieveSemanticMemories(
  query: string,
  userId: string,
  vectorStore: VectorStore,
  options: { limit?: number; category?: string } = {},
): Promise<SemanticMemory[]> {
  const results = await vectorStore.search({
    query,
    filter: {
      userId,
      type: 'semantic',
      supersededBy: null,  // 排除已被取代的
      ...(options.category ? { category: options.category } : {}),
    },
    limit: options.limit ?? 10,
  });

  return results.map((r) => r.memory);
}
```

**特性：** 中等數量、不衰減但可過時、用 similarity 檢索、需要 supersede 機制。

### 三種記憶的比較

```
              Procedural        Episodic           Semantic
────────────────────────────────────────────────────────────
存什麼        行為規則           時間事件            事實知識
像什麼        肌肉記憶           個人日記            百科全書
範例          「用正式語氣」     「3/15 提到旅行」    「用 Next.js」
注入方式      system prompt      context injection   context injection
檢索策略      全部載入           relevance + recency  similarity
更新頻率      低                 高                  中
衰減          不衰減             會衰減              不衰減（但可過時）
```

---

## 記憶的寫入機制

記憶系統最關鍵的設計決策：**什麼時候該寫入記憶？** 寫太少，Agent 學不到東西；寫太多，記憶庫充斥雜訊。

### 顯式寫入 vs 隱式學習

**顯式寫入**：使用者明確要求。

```
使用者: 記住，我所有專案都用 pnpm，不要建議我用 npm
使用者: 我不喜歡你用 emoji，以後回覆不要加
```

**隱式學習**：Agent 從對話行為中推斷。

```
使用者: (連續三次把 Agent 的回覆從中文改成英文)
→ 推斷：使用者可能偏好英文回覆

使用者: 我下個月要去日本出差
→ 推斷：這是一個值得記住的未來事件
```

### 記憶提取器

在每次對話結束後，用一個獨立的 LLM 呼叫來分析對話、提取記憶：

```typescript
interface MemoryExtraction {
  type: 'procedural' | 'episodic' | 'semantic';
  content: string;
  importance: number;
  source: 'explicit' | 'inferred';
  confidence: number;
  category?: string;
}

const EXTRACTION_PROMPT = `你是記憶提取系統。分析對話，提取長期有價值的資訊。

分三類：
1. **Procedural**: 偏好、規則、行為模式
2. **Episodic**: 具體事件、計畫、經歷（帶有時間性）
3. **Semantic**: 事實知識（技術棧、個人資訊、專案資訊）

規則：
- 只提取有長期價值的資訊，忽略瑣碎對話
- 顯式請求（「記住...」）的 confidence 為 1.0
- 推斷記憶 confidence 在 0.5-0.9 之間
- 沒有值得記的就回傳空陣列

回傳 JSON 陣列。`;

async function extractMemories(
  conversation: Message[],
  existingMemories: Memory[],
  llm: LLMClient,
): Promise<MemoryExtraction[]> {
  const existingContext = existingMemories
    .map((m) => `- [${m.type}] ${m.content}`)
    .join('\n');

  const conversationText = conversation
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join('\n');

  const response = await llm.generate({
    system: `${EXTRACTION_PROMPT}\n\n已存在的記憶（避免重複）：\n${existingContext}`,
    user: conversationText,
    responseFormat: 'json',
  });

  const extractions: MemoryExtraction[] = JSON.parse(response);
  return extractions.filter((e) => e.confidence >= 0.5);
}
```

### 寫入流程

提取後還需要去重和衝突檢查：

```typescript
async function processMemoryWrites(
  extractions: MemoryExtraction[],
  userId: string,
  memoryStore: AgentMemorySystem,
  vectorStore: VectorStore,
): Promise<void> {
  for (const extraction of extractions) {
    // 檢查是否與既有記憶重複或衝突
    const similar = await vectorStore.search({
      query: extraction.content,
      filter: { userId },
      limit: 3,
      minScore: 0.8,
    });

    if (similar.length > 0 && similar[0].score > 0.95) {
      continue; // 幾乎相同，跳過
    }

    if (similar.length > 0 && similar[0].score > 0.8) {
      // 高度相似但不完全相同，可能是更新
      await handleMemoryUpdate(similar[0], extraction, memoryStore);
      continue;
    }

    // 建立新記憶
    const embedding = await vectorStore.embed(extraction.content);
    await memoryStore.store({
      type: extraction.type,
      content: extraction.content,
      importance: extraction.importance,
      metadata: {
        source: extraction.source,
        confidence: extraction.confidence,
        category: extraction.category,
      },
    }, userId);
  }
}
```

---

## 記憶的檢索與注入

寫入只是一半的工作。另一半是在**正確的時機**把**正確的記憶**注入 context window。

### 統一檢索介面

三種記憶用不同策略檢索，最後合併排序：

```typescript
class UnifiedMemoryRetriever {
  constructor(
    private vectorStore: VectorStore,
    private metadataStore: MetadataStore,
  ) {}

  async retrieve(query: string, userId: string, limit = 20): Promise<RetrievalResult[]> {
    // 並行檢索三種記憶
    const [procedural, episodic, semantic] = await Promise.all([
      this.loadProceduralMemories(userId),
      this.searchEpisodicMemories(query, userId, limit),
      this.searchSemanticMemories(query, userId, limit),
    ]);

    const all = [...procedural, ...episodic, ...semantic];
    all.sort((a, b) => b.score - a.score);
    return all.slice(0, limit);
  }

  private async loadProceduralMemories(userId: string): Promise<RetrievalResult[]> {
    const memories = await this.metadataStore.find({ userId, type: 'procedural', active: true });
    return memories.map((m) => ({ memory: m, score: 1.0, source: 'procedural' as const }));
  }

  private async searchEpisodicMemories(
    query: string, userId: string, limit: number,
  ): Promise<RetrievalResult[]> {
    const candidates = await this.vectorStore.search({
      query, filter: { userId, type: 'episodic' }, limit: limit * 2,
    });

    const now = Date.now();
    return candidates.map((c) => {
      const ageDays = (now - new Date(c.metadata.timestamp).getTime()) / 86_400_000;
      const recencyScore = Math.pow(0.5, ageDays / 7);
      return {
        memory: c.memory,
        score: 0.6 * c.score + 0.3 * recencyScore + 0.1 * c.metadata.importance,
        source: 'episodic' as const,
      };
    });
  }

  private async searchSemanticMemories(
    query: string, userId: string, limit: number,
  ): Promise<RetrievalResult[]> {
    const results = await this.vectorStore.search({
      query, filter: { userId, type: 'semantic', supersededBy: null }, limit,
    });
    return results.map((r) => ({
      memory: r.memory, score: r.score, source: 'semantic' as const,
    }));
  }
}
```

### Context 注入

不同類型的記憶注入不同位置：

```typescript
class MemoryAwareContextBuilder {
  build(params: {
    baseSystemPrompt: string;
    memories: RetrievalResult[];
    conversation: Message[];
  }): { systemPrompt: string; messages: Message[] } {
    const { baseSystemPrompt, memories, conversation } = params;

    const procedural = memories.filter((m) => m.source === 'procedural');
    const episodic = memories.filter((m) => m.source === 'episodic');
    const semantic = memories.filter((m) => m.source === 'semantic');

    // Procedural → system prompt
    let systemPrompt = baseSystemPrompt;
    if (procedural.length > 0) {
      systemPrompt += '\n\n## 使用者偏好\n\n';
      systemPrompt += procedural.map((m) => `- ${m.memory.content}`).join('\n');
    }

    // Episodic + Semantic → 使用者訊息前的 context block
    const contextParts: string[] = [];

    if (episodic.length > 0) {
      contextParts.push('## 相關過往互動\n');
      contextParts.push(episodic.map((m) => {
        const date = new Date(m.memory.metadata.timestamp as string).toISOString().split('T')[0];
        return `- [${date}] ${m.memory.content}`;
      }).join('\n'));
    }

    if (semantic.length > 0) {
      contextParts.push('\n## 已知資訊\n');
      contextParts.push(semantic.map((m) => `- ${m.memory.content}`).join('\n'));
    }

    const messages = [...conversation];
    if (contextParts.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'user') {
        lastMsg.content = `<memory_context>\n${contextParts.join('\n')}\n</memory_context>\n\n${lastMsg.content}`;
      }
    }

    return { systemPrompt, messages };
  }
}
```

### 排序策略

三個信號的加權組合。不同場景用不同權重：

```typescript
const SCORING_PROFILES: Record<string, { relevance: number; recency: number; importance: number }> = {
  default:       { relevance: 0.5, recency: 0.3, importance: 0.2 },
  task:          { relevance: 0.7, recency: 0.1, importance: 0.2 },  // 寫程式
  casual:        { relevance: 0.3, recency: 0.5, importance: 0.2 },  // 閒聊
  retrospective: { relevance: 0.2, recency: 0.6, importance: 0.2 },  // 「上次聊什麼」
};
```

---

## 記憶管理

記憶庫不是只寫不管的。隨著時間累積，記憶會重複、衝突、過時。

### 1. 去重（Deduplication）

純向量相似度不夠——「使用者用 React」和「使用者的前端框架是 React 18」語意很接近但資訊量不同。需要 LLM 判斷：

```typescript
const DEDUP_PROMPT = `比較兩條記憶，判斷關係：

記憶 A: {memoryA}
記憶 B: {memoryB}

回傳 JSON:
- "DUPLICATE": 完全相同，保留任一即可
- "MERGE": 部分重疊，應合併（提供合併文字）
- "UPDATE": B 是 A 的更新版本，應取代 A
- "DISTINCT": 不同資訊，兩條都保留`;

async function smartDeduplicate(
  memoryA: string,
  memoryB: string,
  llm: LLMClient,
): Promise<{ relation: 'DUPLICATE' | 'MERGE' | 'UPDATE' | 'DISTINCT'; mergedContent?: string }> {
  const prompt = DEDUP_PROMPT.replace('{memoryA}', memoryA).replace('{memoryB}', memoryB);
  const response = await llm.generate({ system: prompt, user: 'Analyze.', responseFormat: 'json' });
  return JSON.parse(response);
}
```

### 2. 衝突解決（Conflict Resolution）

當新記憶和舊記憶矛盾時，遵循優先順序：

```typescript
async function resolveConflict(
  existing: Memory,
  incoming: MemoryExtraction,
  memoryStore: AgentMemorySystem,
): Promise<void> {
  // 規則 1: 顯式 > 推斷（使用者直接說的 > Agent 猜的）
  if (incoming.source === 'explicit' && existing.metadata.source === 'inferred') {
    await supersede(existing.id, incoming, memoryStore);
    return;
  }

  // 規則 2: 新的顯式 > 舊的顯式（使用者改變了偏好）
  if (incoming.source === 'explicit' && existing.metadata.source === 'explicit') {
    await supersede(existing.id, incoming, memoryStore);
    return;
  }

  // 規則 3: 推斷 vs 推斷 → 保留既有，除非新的信心度明顯更高
  if (incoming.confidence > (existing.metadata.confidence as number) + 0.2) {
    await supersede(existing.id, incoming, memoryStore);
  }
}

async function supersede(
  oldId: string,
  incoming: MemoryExtraction,
  memoryStore: AgentMemorySystem,
): Promise<void> {
  const newId = await memoryStore.store({
    type: incoming.type,
    content: incoming.content,
    importance: incoming.importance,
    metadata: { source: incoming.source, confidence: incoming.confidence },
  }, 'current_user');

  await memoryStore.update(oldId, { metadata: { supersededBy: newId } });
}
```

### 3. 衰減與過期（Decay & Expiration）

Episodic Memory 會隨時間衰減。如果很久沒被存取且重要度不高，就該被降級或刪除：

```typescript
interface DecayConfig {
  halfLifeDays: number;
  minScore: number;
  importanceShield: number;  // 重要度高於此值不衰減
  accessBoostDays: number;   // 每次存取延壽天數
}

async function runDecayCycle(
  userId: string,
  memoryStore: AgentMemorySystem,
  config: DecayConfig = { halfLifeDays: 30, minScore: 0.1, importanceShield: 0.9, accessBoostDays: 7 },
): Promise<{ decayed: number; deleted: number }> {
  const memories = await memoryStore.listByUser(userId);
  let decayed = 0, deleted = 0;
  const now = Date.now();

  for (const memory of memories) {
    if (memory.type === 'procedural') continue;
    if (memory.importance >= config.importanceShield) continue;

    const accessBoostMs = memory.accessCount * config.accessBoostDays * 86_400_000;
    const effectiveAgeDays = Math.max(0,
      (now - memory.lastAccessedAt.getTime() - accessBoostMs) / 86_400_000,
    );

    const decayScore = Math.pow(0.5, effectiveAgeDays / config.halfLifeDays);

    if (decayScore < config.minScore) {
      await memoryStore.delete(memory.id);
      deleted++;
    } else if (decayScore < 0.5) {
      await memoryStore.update(memory.id, { metadata: { ...memory.metadata, decayScore } });
      decayed++;
    }
  }

  return { decayed, deleted };
}
```

### 4. 使用者控制（User Control）

使用者必須能查看、修改和刪除自己的記憶。這不只是功能需求，也是信任和隱私的問題：

```typescript
class MemoryDashboard {
  constructor(private memoryStore: AgentMemorySystem) {}

  async listAll(userId: string) {
    const all = await this.memoryStore.listByUser(userId);
    return {
      procedural: all.filter((m) => m.type === 'procedural'),
      episodic: all.filter((m) => m.type === 'episodic'),
      semantic: all.filter((m) => m.type === 'semantic'),
    };
  }

  async forget(memoryId: string): Promise<void> {
    await this.memoryStore.delete(memoryId);
  }

  async forgetAllByType(userId: string, type: Memory['type']): Promise<number> {
    const all = await this.memoryStore.listByUser(userId);
    const toDelete = all.filter((m) => m.type === type);
    await Promise.all(toDelete.map((m) => this.memoryStore.delete(m.id)));
    return toDelete.length;
  }

  async exportAll(userId: string): Promise<string> {
    const all = await this.memoryStore.listByUser(userId);
    return JSON.stringify(all, null, 2);
  }

  async purgeAll(userId: string): Promise<void> {
    const all = await this.memoryStore.listByUser(userId);
    await Promise.all(all.map((m) => this.memoryStore.delete(m.id)));
  }
}
```

---

## 實作架構

把所有元件組合起來。

### 架構概覽

```
┌─────────────────────────────────────────────────────┐
│                   Agent Runtime                      │
│                                                     │
│  ┌─────────────┐     ┌──────────────────────────┐  │
│  │ LLM Engine  │◄────│ Memory-Aware Context     │  │
│  │             │     │ Builder                   │  │
│  └─────────────┘     └──────────┬───────────────┘  │
│                                  │                   │
│                        ┌─────────┴──────────┐       │
│                        │                    │       │
│                ┌───────▼──────┐    ┌────────▼────┐  │
│                │ Memory       │    │ Memory      │  │
│                │ Retriever    │    │ Extractor   │  │
│                │ (Read Path)  │    │ (Write Path)│  │
│                └───────┬──────┘    └────────┬────┘  │
│                        │                    │       │
└────────────────────────┼────────────────────┼───────┘
                         │                    │
              ┌──────────▼────────────────────▼──────┐
              │          Memory Store                 │
              │                                      │
              │  ┌────────────┐  ┌────────────────┐  │
              │  │ Vector DB  │  │ Metadata Store │  │
              │  │ (Qdrant /  │  │ (PostgreSQL /  │  │
              │  │  Pinecone) │  │  Redis)        │  │
              │  └────────────┘  └────────────────┘  │
              └──────────────────────────────────────┘
```

### Agent 主迴圈整合

```typescript
class MemoryEnabledAgent {
  constructor(
    private memory: AgentMemory,
    private contextBuilder: MemoryAwareContextBuilder,
    private llm: LLMClient,
  ) {}

  async chat(userId: string, conversation: Message[], userMessage: string): Promise<string> {
    // 1. 檢索相關記憶
    const memories = await this.memory.retrieve(userMessage, userId);

    const retrievalResults: RetrievalResult[] = memories.map((m) => ({
      memory: m, score: 1.0, source: m.type,
    }));

    // 2. 建構 memory-aware context
    const updatedConversation = [...conversation, { role: 'user' as const, content: userMessage }];
    const context = this.contextBuilder.build({
      baseSystemPrompt: 'You are a helpful assistant with persistent memory.',
      memories: retrievalResults,
      conversation: updatedConversation,
    });

    // 3. 呼叫 LLM
    const response = await this.llm.generate({
      system: context.systemPrompt,
      user: context.messages.filter((m) => m.role === 'user').pop()?.content ?? userMessage,
    });

    // 4. 非同步提取並儲存新記憶（不阻塞回應）
    const fullConversation = [
      ...updatedConversation,
      { role: 'assistant' as const, content: response },
    ];

    this.memory
      .extractAndStore(fullConversation, userId)
      .catch((err) => console.error('Memory extraction failed:', err));

    return response;
  }
}
```

### 使用範例

```typescript
// 初始化
const vectorStore = new QdrantVectorStore({ url: 'http://localhost:6333' });
const metadataStore = new PostgresMetadataStore({ connectionString: '...' });
const llm = new AnthropicClient({ apiKey: process.env.ANTHROPIC_API_KEY });

const memory = new AgentMemory(vectorStore, metadataStore, llm);
const contextBuilder = new MemoryAwareContextBuilder();
const agent = new MemoryEnabledAgent(memory, contextBuilder, llm);

// 第一次對話
await agent.chat('user_123', [], '我是 Kevin，技術棧是 Next.js + TypeScript');
// → Agent 回覆，同時背景記住：
//   [semantic] 使用者名字是 Kevin
//   [semantic] 技術棧：Next.js + TypeScript

// 第二次對話（新 session）
await agent.chat('user_123', [], '幫我寫一個 API route');
// → Agent 已知道你用 Next.js + TypeScript，直接生成對應程式碼

// 第三次對話
await agent.chat('user_123', [], '下週二要去東京出差');
// → 背景記住：[episodic] 使用者下週二要去東京出差

// 第四次對話
await agent.chat('user_123', [], '幫我準備一下出差的東西');
// → Agent 記得你要去東京，直接提供東京相關建議
```

---

## 設計取捨

### 什麼時候不需要 Agent Memory？

- **一次性工具型 Agent**：每次都是獨立任務（翻譯、格式轉換）
- **高敏感場景**：醫療、法律等不應依賴推斷記憶的領域
- **成本敏感**：記憶提取和檢索會增加延遲和費用

### Memory 的風險

| 風險 | 說明 | 解法 |
|------|------|------|
| 幻覺記憶 | LLM 推斷出錯誤偏好 | Confidence 門檻 + 主動確認 |
| 過時資訊 | 使用者換了技術棧 | 衰減機制 + supersede |
| 隱私問題 | 記住不該記的 | 使用者控制面板 |
| 偏見放大 | 錯誤推斷自我強化 | 定期審查 + 低信心度不儲存 |

### Token 預算

Context window 有限，記憶注入需要上限：

```typescript
const TOKEN_BUDGET = { procedural: 500, episodic: 1000, semantic: 1000 };

function trimMemoriesToBudget(
  memories: RetrievalResult[],
  budget: Record<string, number>,
  tokenCounter: (text: string) => number,
): RetrievalResult[] {
  const result: RetrievalResult[] = [];
  const used: Record<string, number> = { procedural: 0, episodic: 0, semantic: 0 };

  for (const memory of memories) {
    const tokens = tokenCounter(memory.memory.content);
    const type = memory.source;
    if (used[type] + tokens <= (budget[type] ?? 500)) {
      result.push(memory);
      used[type] += tokens;
    }
  }
  return result;
}
```

---

## 總結

Agent Memory 的核心轉變是從 **read-only** 到 **read-write**。

RAG 讓 Agent 能讀取外部知識，Agentic RAG 讓它讀得更聰明，但 Agent Memory 讓它能**學習和累積**。三種記憶類型——Procedural（怎麼做）、Episodic（發生了什麼）、Semantic（世界是什麼樣的）——構成了一個完整的認知記憶系統。

實作上的四個關鍵決策：

1. **寫入時機**：顯式請求一定寫，隱式推斷要有信心度門檻
2. **檢索策略**：Procedural 全載入，Episodic 用 relevance + recency，Semantic 用 similarity
3. **記憶管理**：去重、衝突解決、衰減、使用者控制缺一不可
4. **Token 預算**：Context window 有限，記憶注入需要有上限

最後一個想法：記憶不只是技術問題，也是產品問題。使用者對「AI 記住了什麼」這件事非常敏感。做好透明度和控制權，比做好檢索演算法更重要。

## 參考資料

- [Agentic Retrieval-Augmented Generation: A Survey on Agentic RAG](https://arxiv.org/abs/2501.09136) — Singh et al. (2025)，涵蓋 Agent Memory 在 Agentic RAG 系統中的角色與三種記憶類型的分類
- [LangChain — Context Engineering for Agents](https://blog.langchain.com/context-engineering-for-agents/) — LangChain 技術部落格，episodic/semantic/procedural memory 的 Write/Select 策略說明
- [Anthropic — Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic 工程部落格，structured note-taking 與跨 session 記憶的實作建議
- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560) — Packer et al. (2023)，將 LLM 的記憶管理類比作業系統的虛擬記憶體，Letta 的理論基礎
- [Retrieval-Augmented Generation for Large Language Models: A Survey](https://arxiv.org/abs/2312.10997) — Gao et al. (2024)，RAG 到 Agentic RAG 演化，是 Agent Memory 發展的前序背景
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) — Yao et al. (2023)，Agent 在推理過程中記錄中間狀態的早期框架，與 scratchpad 概念相近
- [Letta（MemGPT）GitHub 儲存庫](https://github.com/letta-ai/letta) — Agent Memory 開源實作，支援 Procedural/Episodic/Semantic 三層記憶架構
