---
title: "Agent Memory Systems: From RAG to Read-Write Memory Evolution"
date: 2026-03-19
type: guide
category: ai
tags: [agent, memory, procedural-memory, episodic-memory, semantic-memory, rag]
lang: en
tldr: "RAG is read-only. Agent Memory lets AI not only read but also write and persist information. Three memory types: Procedural (behavior patterns), Episodic (temporal events), and Semantic (factual knowledge) form a complete cognitive memory system."
description: "Design and implementation of three Agent Memory types: Procedural Memory for behavior pattern learning, Episodic Memory for temporal event tracking, Semantic Memory for factual knowledge management, and the evolution path from RAG to Agentic RAG to Agent Memory."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-19-agent-memory-systems)

Your AI Agent is smart, but it can't remember anything.

Every conversation starts from a blank slate. What you talked about last time, the user's preferred tone, a travel plan mentioned three days ago — all gone. You can feed it knowledge through RAG, but RAG is **read-only**: the Agent can read external data but cannot write anything it learns back.

It's like a person who can read books but can't take notes.

Agent Memory changes this. It lets AI systems not only read but also **write and persist information**. This article walks through the complete evolution path from RAG to Agent Memory, breaks down the design of three memory types, and includes TypeScript implementations.

---

## The Evolution from RAG to Agent Memory

### Stage 1: RAG (Read-Only)

RAG is the most basic form of external memory. The system retrieves relevant documents from a vector database, injects them into the context window, and lets the LLM answer questions based on that data.

```
User question → Vector search → Retrieve document chunks → LLM generates answer
```

This flow is **unidirectional**: data flows from external sources into the context, but the LLM cannot write anything back.

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

RAG's limitations are clear:

- **Cannot learn**: If a user corrects the Agent's mistake, it will make the same mistake next time
- **Cannot personalize**: Doesn't know the user's preferred format, tone, or depth
- **Cannot accumulate**: Insights from multi-turn conversations cannot be retained across sessions

### Stage 2: Agentic RAG (Read + Decide)

Agentic RAG gives the LLM decision-making power in the retrieval process — it evaluates whether results are sufficient, and if not, rewrites the query and searches again.

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

Agentic RAG reads smarter, but it's still **read-only**. It won't remember the search experience, and it won't learn what type of answers the user prefers.

### Stage 3: Agent Memory (Read + Write)

Agent Memory fills in the final piece of the puzzle: **writing**.

```
Conversation → Memory extraction → Write to memory store
                                    ↓
New conversation → Memory retrieval → Inject into context → LLM answers
                                    ↑
                              Persistent memory store
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

The differences across the three stages are clear at a glance:

```
                RAG          Agentic RAG     Agent Memory
─────────────────────────────────────────────────────────
Read             ✓              ✓               ✓
Decide           ✗              ✓               ✓
Write            ✗              ✗               ✓
Cross-session    ✗              ✗               ✓
Personalization  ✗              ✗               ✓
Continuous       ✗              ✗               ✓
learning
```

Key insight: **Read-Write Memory is the watershed between a tool and an Agent.** A system that can learn, remember, and accumulate is what truly behaves like an Agent.

---

## Three Memory Types

Cognitive science classifies human memory into several types. Agent Memory borrows this framework to define three of the most useful memory types.

### 1. Procedural Memory: Behavior Patterns

Procedural Memory stores **how to do things** — rules, preferences, and behavior patterns.

Human Procedural Memory covers skills the body remembers, like riding a bicycle or typing. For an AI Agent, it represents patterns to follow when responding to users:

- "Always use formal tone"
- "Include code examples when answering technical questions"
- "The user doesn't like lengthy introductions, get straight to the point"

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
    rule: 'User prefers Traditional Chinese responses, keep technical terms in English',
    source: 'explicit',
    confidence: 1.0,
    scope: 'global',
    active: true,
    createdAt: new Date('2026-01-15'),
  },
  {
    id: 'proc_002',
    type: 'procedural',
    rule: 'When answering code questions, give a complete runnable example first, then explain',
    source: 'inferred',
    confidence: 0.85,
    scope: 'topic',
    topic: 'programming',
    active: true,
    createdAt: new Date('2026-02-20'),
  },
];
```

Procedural Memory is injected directly into the system prompt:

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
      const prefix = m.scope === 'global' ? '[Global]' : `[${m.topic}]`;
      return `- ${prefix} ${m.rule}`;
    })
    .join('\n');

  return `${basePrompt}\n\n## User Preferences & Behavior Rules\n\n${rulesBlock}`;
}
```

**Characteristics:** Small quantity, high weight, no decay, fully loaded on every conversation.

### 2. Episodic Memory: Temporal Events

Episodic Memory stores **what happened** — specific events with timestamps.

Human Episodic Memory includes things like "met Kevin at the cafe yesterday" or "last Friday's meeting decided to use PostgreSQL." For an AI Agent:

- "User mentioned on 2026/03/15 that they're traveling to Japan next month"
- "User said on 2026/03/20 that the project deadline is end of April"
- "User complained on 2026/03/25 that responses were too long, style was adjusted afterward"

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

Episodic Memory retrieval needs to consider both **semantic relevance** and **temporal recency**:

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

    // Temporal decay: exponential decay with 7-day half-life
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

**Characteristics:** Large quantity, has a temporal dimension, decays over time, retrieved with relevance + recency weighting.

### 3. Semantic Memory: Factual Knowledge

Semantic Memory stores **what the world is like** — decontextualized facts and concepts.

Human Semantic Memory includes things like "Paris is the capital of France" or "water boils at 100 degrees." For an AI Agent:

- "The user's company uses Next.js + TypeScript + Tailwind"
- "The user's name is Kevin, position is frontend engineer"
- "The project database is PostgreSQL 14, deployed on AWS"

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
  supersededBy?: string;    // Points to new ID when superseded by updated info
}
```

Semantic Memory retrieval relies mainly on vector similarity, but must exclude superseded old memories:

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
      supersededBy: null,  // Exclude superseded entries
      ...(options.category ? { category: options.category } : {}),
    },
    limit: options.limit ?? 10,
  });

  return results.map((r) => r.memory);
}
```

**Characteristics:** Medium quantity, doesn't decay but can become outdated, retrieved by similarity, requires a supersede mechanism.

### Comparison of Three Memory Types

```
              Procedural        Episodic           Semantic
────────────────────────────────────────────────────────────
Stores        Behavior rules     Temporal events     Factual knowledge
Analogy       Muscle memory      Personal diary      Encyclopedia
Example       "Use formal tone"  "Mentioned travel   "Uses Next.js"
                                  on 3/15"
Injection     system prompt      context injection   context injection
Retrieval     Load all           relevance + recency similarity
Update freq   Low                High                Medium
Decay         No decay           Decays              No decay (but can
                                                      become outdated)
```

---

## Memory Write Mechanisms

The most critical design decision for a memory system: **when should memories be written?** Write too little and the Agent learns nothing; write too much and the memory store fills with noise.

### Explicit Writes vs Implicit Learning

**Explicit writes**: The user explicitly requests it.

```
User: Remember, all my projects use pnpm, don't suggest npm
User: I don't like you using emoji, stop adding them in responses
```

**Implicit learning**: The Agent infers from conversational behavior.

```
User: (Changes Agent's response from Chinese to English three consecutive times)
→ Inference: User may prefer English responses

User: I'm going to Japan for a business trip next month
→ Inference: This is a future event worth remembering
```

### Memory Extractor

After each conversation ends, use a separate LLM call to analyze the conversation and extract memories:

```typescript
interface MemoryExtraction {
  type: 'procedural' | 'episodic' | 'semantic';
  content: string;
  importance: number;
  source: 'explicit' | 'inferred';
  confidence: number;
  category?: string;
}

const EXTRACTION_PROMPT = `You are a memory extraction system. Analyze the conversation and extract information with long-term value.

Classify into three categories:
1. **Procedural**: Preferences, rules, behavior patterns
2. **Episodic**: Specific events, plans, experiences (with temporal nature)
3. **Semantic**: Factual knowledge (tech stack, personal info, project info)

Rules:
- Only extract information with long-term value, ignore trivial conversation
- Explicit requests ("Remember...") get confidence of 1.0
- Inferred memories get confidence between 0.5-0.9
- Return an empty array if nothing is worth remembering

Return a JSON array.`;

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
    system: `${EXTRACTION_PROMPT}\n\nExisting memories (avoid duplicates):\n${existingContext}`,
    user: conversationText,
    responseFormat: 'json',
  });

  const extractions: MemoryExtraction[] = JSON.parse(response);
  return extractions.filter((e) => e.confidence >= 0.5);
}
```

### Write Flow

After extraction, deduplication and conflict checking are still needed:

```typescript
async function processMemoryWrites(
  extractions: MemoryExtraction[],
  userId: string,
  memoryStore: AgentMemorySystem,
  vectorStore: VectorStore,
): Promise<void> {
  for (const extraction of extractions) {
    // Check for duplicates or conflicts with existing memories
    const similar = await vectorStore.search({
      query: extraction.content,
      filter: { userId },
      limit: 3,
      minScore: 0.8,
    });

    if (similar.length > 0 && similar[0].score > 0.95) {
      continue; // Nearly identical, skip
    }

    if (similar.length > 0 && similar[0].score > 0.8) {
      // Highly similar but not identical, likely an update
      await handleMemoryUpdate(similar[0], extraction, memoryStore);
      continue;
    }

    // Create new memory
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

## Memory Retrieval and Injection

Writing is only half the job. The other half is injecting the **right memories** at the **right time** into the context window.

### Unified Retrieval Interface

The three memory types use different retrieval strategies, then get merged and sorted:

```typescript
class UnifiedMemoryRetriever {
  constructor(
    private vectorStore: VectorStore,
    private metadataStore: MetadataStore,
  ) {}

  async retrieve(query: string, userId: string, limit = 20): Promise<RetrievalResult[]> {
    // Retrieve three memory types in parallel
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

### Context Injection

Different memory types are injected at different positions:

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
      systemPrompt += '\n\n## User Preferences\n\n';
      systemPrompt += procedural.map((m) => `- ${m.memory.content}`).join('\n');
    }

    // Episodic + Semantic → context block before user message
    const contextParts: string[] = [];

    if (episodic.length > 0) {
      contextParts.push('## Relevant Past Interactions\n');
      contextParts.push(episodic.map((m) => {
        const date = new Date(m.memory.metadata.timestamp as string).toISOString().split('T')[0];
        return `- [${date}] ${m.memory.content}`;
      }).join('\n'));
    }

    if (semantic.length > 0) {
      contextParts.push('\n## Known Information\n');
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

### Scoring Strategy

A weighted combination of three signals. Different scenarios use different weights:

```typescript
const SCORING_PROFILES: Record<string, { relevance: number; recency: number; importance: number }> = {
  default:       { relevance: 0.5, recency: 0.3, importance: 0.2 },
  task:          { relevance: 0.7, recency: 0.1, importance: 0.2 },  // Coding
  casual:        { relevance: 0.3, recency: 0.5, importance: 0.2 },  // Casual chat
  retrospective: { relevance: 0.2, recency: 0.6, importance: 0.2 },  // "What did we talk about last time"
};
```

---

## Memory Management

A memory store isn't write-and-forget. Over time, memories become duplicated, conflicting, or outdated.

### 1. Deduplication

Pure vector similarity isn't enough — "user uses React" and "user's frontend framework is React 18" are semantically close but carry different amounts of information. LLM judgment is needed:

```typescript
const DEDUP_PROMPT = `Compare two memories and determine their relationship:

Memory A: {memoryA}
Memory B: {memoryB}

Return JSON:
- "DUPLICATE": Exactly the same, keep either one
- "MERGE": Partially overlapping, should be merged (provide merged text)
- "UPDATE": B is an updated version of A, should replace A
- "DISTINCT": Different information, keep both`;

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

### 2. Conflict Resolution

When a new memory contradicts an old one, follow the priority order:

```typescript
async function resolveConflict(
  existing: Memory,
  incoming: MemoryExtraction,
  memoryStore: AgentMemorySystem,
): Promise<void> {
  // Rule 1: Explicit > Inferred (what user directly said > what Agent guessed)
  if (incoming.source === 'explicit' && existing.metadata.source === 'inferred') {
    await supersede(existing.id, incoming, memoryStore);
    return;
  }

  // Rule 2: New explicit > Old explicit (user changed their preference)
  if (incoming.source === 'explicit' && existing.metadata.source === 'explicit') {
    await supersede(existing.id, incoming, memoryStore);
    return;
  }

  // Rule 3: Inferred vs Inferred → Keep existing, unless new one has significantly higher confidence
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

### 3. Decay & Expiration

Episodic Memory decays over time. If it hasn't been accessed for a long time and its importance isn't high, it should be downgraded or deleted:

```typescript
interface DecayConfig {
  halfLifeDays: number;
  minScore: number;
  importanceShield: number;  // Memories above this importance level don't decay
  accessBoostDays: number;   // Each access extends lifespan by this many days
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

### 4. User Control

Users must be able to view, modify, and delete their own memories. This is not just a feature requirement but also a matter of trust and privacy:

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

## Implementation Architecture

Let's put all the components together.

### Architecture Overview

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

### Agent Main Loop Integration

```typescript
class MemoryEnabledAgent {
  constructor(
    private memory: AgentMemory,
    private contextBuilder: MemoryAwareContextBuilder,
    private llm: LLMClient,
  ) {}

  async chat(userId: string, conversation: Message[], userMessage: string): Promise<string> {
    // 1. Retrieve relevant memories
    const memories = await this.memory.retrieve(userMessage, userId);

    const retrievalResults: RetrievalResult[] = memories.map((m) => ({
      memory: m, score: 1.0, source: m.type,
    }));

    // 2. Build memory-aware context
    const updatedConversation = [...conversation, { role: 'user' as const, content: userMessage }];
    const context = this.contextBuilder.build({
      baseSystemPrompt: 'You are a helpful assistant with persistent memory.',
      memories: retrievalResults,
      conversation: updatedConversation,
    });

    // 3. Call LLM
    const response = await this.llm.generate({
      system: context.systemPrompt,
      user: context.messages.filter((m) => m.role === 'user').pop()?.content ?? userMessage,
    });

    // 4. Asynchronously extract and store new memories (non-blocking)
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

### Usage Example

```typescript
// Initialization
const vectorStore = new QdrantVectorStore({ url: 'http://localhost:6333' });
const metadataStore = new PostgresMetadataStore({ connectionString: '...' });
const llm = new AnthropicClient({ apiKey: process.env.ANTHROPIC_API_KEY });

const memory = new AgentMemory(vectorStore, metadataStore, llm);
const contextBuilder = new MemoryAwareContextBuilder();
const agent = new MemoryEnabledAgent(memory, contextBuilder, llm);

// First conversation
await agent.chat('user_123', [], "I'm Kevin, my tech stack is Next.js + TypeScript");
// → Agent responds, while in the background it remembers:
//   [semantic] User's name is Kevin
//   [semantic] Tech stack: Next.js + TypeScript

// Second conversation (new session)
await agent.chat('user_123', [], 'Help me write an API route');
// → Agent already knows you use Next.js + TypeScript, generates matching code directly

// Third conversation
await agent.chat('user_123', [], "I'm going to Tokyo on a business trip next Tuesday");
// → Background remembers: [episodic] User going to Tokyo on business trip next Tuesday

// Fourth conversation
await agent.chat('user_123', [], 'Help me prepare for the business trip');
// → Agent remembers you're going to Tokyo, directly provides Tokyo-specific suggestions
```

---

## Design Trade-offs

### When Is Agent Memory Not Needed?

- **One-off tool-type Agents**: Each task is independent (translation, format conversion)
- **High-sensitivity scenarios**: Medical, legal, and other domains where inferred memories should not be relied upon
- **Cost-sensitive**: Memory extraction and retrieval add latency and expense

### Risks of Memory

| Risk | Description | Solution |
|------|-------------|----------|
| Hallucinated memories | LLM infers incorrect preferences | Confidence threshold + proactive confirmation |
| Outdated information | User switched tech stacks | Decay mechanism + supersede |
| Privacy concerns | Remembering things it shouldn't | User control dashboard |
| Bias amplification | Incorrect inferences self-reinforce | Periodic review + don't store low-confidence |

### Token Budget

Context windows are limited, so memory injection needs caps:

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

## Summary

The core transformation of Agent Memory is from **read-only** to **read-write**.

RAG lets Agents read external knowledge, Agentic RAG lets them read smarter, but Agent Memory lets them **learn and accumulate**. Three memory types — Procedural (how to do things), Episodic (what happened), and Semantic (what the world is like) — form a complete cognitive memory system.

Four key implementation decisions:

1. **When to write**: Always write for explicit requests; implicit inferences need a confidence threshold
2. **Retrieval strategy**: Load all Procedural memories, use relevance + recency for Episodic, use similarity for Semantic
3. **Memory management**: Deduplication, conflict resolution, decay, and user control are all indispensable
4. **Token budget**: Context windows are limited, so memory injection needs caps

One final thought: memory is not just a technical problem but also a product problem. Users are very sensitive about "what the AI remembers." Getting transparency and control right matters more than getting the retrieval algorithm right.

## References

- [Agentic Retrieval-Augmented Generation: A Survey on Agentic RAG](https://arxiv.org/abs/2501.09136) — Singh et al. (2025), covering the role of Agent Memory in Agentic RAG systems and the classification of three memory types
- [LangChain — Context Engineering for Agents](https://blog.langchain.com/context-engineering-for-agents/) — LangChain tech blog, explaining Write/Select strategies for episodic/semantic/procedural memory
- [Anthropic — Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic engineering blog, implementation recommendations for structured note-taking and cross-session memory
- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560) — Packer et al. (2023), analogizing LLM memory management to operating system virtual memory, the theoretical foundation of Letta
- [Retrieval-Augmented Generation for Large Language Models: A Survey](https://arxiv.org/abs/2312.10997) — Gao et al. (2024), evolution from RAG to Agentic RAG, serving as the precursor context for Agent Memory development
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) — Yao et al. (2023), an early framework for Agents recording intermediate states during reasoning, closely related to the scratchpad concept
- [Letta (MemGPT) GitHub Repository](https://github.com/letta-ai/letta) — Open-source Agent Memory implementation supporting three-layer Procedural/Episodic/Semantic memory architecture
