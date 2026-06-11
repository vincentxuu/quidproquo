---
title: "Multi-Agent RAG: Distributed Retrieval Architecture with Specialized Agent Collaboration"
date: 2026-03-16
type: guide
category: ai
tags: [rag, multi-agent, orchestration, distributed-retrieval, agent]
lang: en
tldr: "A single RAG Agent handling all queries hits knowledge boundaries and performance bottlenecks. Multi-Agent RAG dispatches retrieval tasks to multiple specialized Agents, each with its own knowledge base and retrieval strategy, coordinated by a central Orchestrator that merges results."
description: "Architecture design for Multi-Agent RAG: Orchestrator coordination patterns, specialized Agent design, asynchronous communication and parallel processing, result fusion strategies, and comparison with single Agentic RAG."
draft: false
series:
  name: "RAG 系統實戰"
  order: 4
---

> 🌏 [中文版](/posts/ai/2026-03-16-multi-agent-rag-patterns)

When your RAG system needs to simultaneously answer questions about legal statutes, financial reports, and technical documentation, having a single Agent do everything starts to break down.

It's not that the model isn't powerful enough -- the architecture is wrong.

---

## Why You Need Multi-Agent RAG

The design of a single Agentic RAG is: one Agent with a set of tools, deciding based on the query whether to search, how many times, and how to search. This pattern works great within a single domain, but once the knowledge scope expands, three problems emerge.

### 1. Blurred Knowledge Boundaries

The larger the knowledge base an Agent manages, the lower the retrieval precision. Stuffing legal documents, financial reports, and technical documentation all into the same vector database dilutes the semantic distances in the embedding space. The word "compliance" has vastly different meanings in legal and financial contexts, but their vectors end up close together in a shared embedding space.

### 2. Context Window Pressure

A single Agent must simultaneously understand system prompts for multiple domains, tool definitions, retrieval results, and reasoning state. When a query spans three domains, the context window fills up fast:

```
Single Agent context window allocation:
┌────────────────────────────────────────────┐
│ System Prompt (rules for all domains) ~2,000 tokens │
│ Tool Definitions (all tools)          ~3,000 tokens │
│ Legal retrieval results               ~4,000 tokens │
│ Financial retrieval results           ~4,000 tokens │
│ Technical retrieval results           ~4,000 tokens │
│ Reasoning history                     ~3,000 tokens │
│ ─────────────────────────────────────────── │
│ Total                                ~20,000 tokens │
│ Space left for generation → compressed      │
└────────────────────────────────────────────┘
```

### 3. A Single Retrieval Strategy Isn't Enough

Legal documents need precise clause matching (primarily BM25), financial reports need structured queries (SQL + vector), and technical documentation needs semantic search (primarily dense retrieval). Cramming three strategies into a single Agent's decision logic means none of them work well enough.

The Multi-Agent RAG solution is straightforward: **give each domain its own expert Agent, coordinated by an Orchestrator.**

---

## Architecture Design

The overall architecture looks like this:

```
                          ┌─────────────┐
                          │  User Query │
                          └──────┬──────┘
                                 │
                                 ▼
                      ┌──────────────────┐
                      │   Orchestrator   │
                      │                  │
                      │  - Query analysis│
                      │  - Agent select  │
                      │  - Result fusion │
                      └──┬─────┬──────┬──┘
                         │     │      │
              ┌──────────┘     │      └──────────┐
              ▼                ▼                  ▼
     ┌────────────────┐ ┌──────────────┐ ┌────────────────┐
     │  Legal Agent   │ │ Finance Agent│ │  Tech Agent    │
     │                │ │              │ │                │
     │ - Legal KB     │ │ - Financial  │ │ - Tech docs KB │
     │ - BM25 primary │ │   reports KB │ │ - Dense + Code │
     │ - Clause match │ │ - SQL+vector │ │ - Semantic     │
     │   strategy     │ │ - Numerical  │ │   search       │
     │                │ │   reasoning  │ │                │
     └───────┬────────┘ └──────┬───────┘ └───────┬────────┘
              │                │                  │
              └──────────┐     │      ┌───────────┘
                         ▼     ▼      ▼
                    ┌──────────────────────┐
                    │   Result Fusion      │
                    │                      │
                    │  - Conflict detect   │
                    │  - Weighted merge    │
                    │  - LLM synthesis     │
                    └──────────┬───────────┘
                               │
                               ▼
                        ┌─────────────┐
                        │   Answer    │
                        └─────────────┘
```

Each Agent is an independent RAG pipeline with its own knowledge base, embedding model, retrieval strategy, and system prompt. The Orchestrator doesn't do retrieval -- it does only three things: analyze queries, select Agents, and fuse results.

This separation brings an important benefit: **each Agent's context window only needs to hold information from its own domain.**

---

## Orchestrator Design

The Orchestrator is the nerve center of the entire system, but it should be as thin as possible. Its responsibility is routing and coordination, not reasoning and generation.

### Query Analysis

When the Orchestrator receives a query, the first step is analyzing which domains it involves:

```typescript
interface QueryAnalysis {
  originalQuery: string;
  detectedDomains: DomainTag[];         // ['legal', 'finance']
  subQueries: Map<DomainTag, string>;   // Decomposed sub-queries
  priority: 'latency' | 'accuracy';     // Speed-first or accuracy-first
  requiresCrossReference: boolean;       // Whether cross-domain comparison is needed
}

type DomainTag = 'legal' | 'finance' | 'tech' | 'hr' | 'general';

async function analyzeQuery(query: string): Promise<QueryAnalysis> {
  const response = await llm.chat({
    model: 'claude-sonnet-4-20250514',
    system: `You are a query router. Analyze user queries and determine:
1. Which domains are involved (can be multiple)
2. If multiple domains are involved, split the query into sub-queries for each domain
3. Whether cross-domain comparison is needed

Return in JSON format.`,
    messages: [{ role: 'user', content: query }],
  });

  return parseAnalysis(response);
}
```

There's a design decision here: **use an LLM for routing, or use a classifier?**

The advantage of LLM routing is high flexibility -- it can handle ambiguous queries and multi-domain crossovers. The downside is an extra LLM call, adding latency and cost. If domain classification is relatively fixed, using a lightweight classifier (or even regex + keyword matching) as a first-pass filter, falling back to LLM only for uncertain cases, is a more pragmatic approach.

```typescript
function fastRoute(query: string): DomainTag[] | null {
  const keywordMap: Record<string, DomainTag> = {
    'article': 'legal',
    'regulation': 'legal',
    'compliance': 'legal',
    'revenue': 'finance',
    'gross margin': 'finance',
    'EPS': 'finance',
    'API': 'tech',
    'deploy': 'tech',
    'deployment': 'tech',
  };

  const matched = Object.entries(keywordMap)
    .filter(([kw]) => query.includes(kw))
    .map(([, domain]) => domain);

  const unique = [...new Set(matched)];

  // Route directly if there's a clear match; use LLM otherwise
  return unique.length > 0 ? unique : null;
}
```

### Agent Selection and Dispatch

After analyzing the query, the Orchestrator selects the corresponding Agents from the Agent Registry:

```typescript
interface AgentRegistry {
  agents: Map<DomainTag, AgentConfig>;
  getAgent(domain: DomainTag): AgentConfig | undefined;
  listAvailable(): DomainTag[];
}

interface AgentConfig {
  domain: DomainTag;
  endpoint: string;             // Agent's API endpoint
  capabilities: string[];       // What this Agent excels at
  maxConcurrency: number;       // Maximum concurrency
  timeoutMs: number;            // Timeout setting
  fallbackDomain?: DomainTag;   // Which Agent to fall back to on failure
}
```

### Result Aggregation

The Orchestrator's final step is merging results from multiple Agents into a single answer. This is the most complex part and will be discussed in detail later.

---

## Specialized Agent Design

Each Agent is a complete RAG pipeline, deeply optimized for its own domain. Here's a full design using the Legal Agent as an example:

```typescript
const legalAgent: AgentConfig = {
  domain: 'legal',
  systemPrompt: `You are a legal retrieval expert. When answering, you must:
1. Cite specific law names and article numbers
2. Distinguish between "current regulations" and "draft amendments"
3. If multiple regulations conflict, explicitly identify the conflict points
4. When uncertain, say "further verification needed" -- never fabricate legal provisions`,

  retrievalStrategy: {
    primary: 'bm25',           // BM25 works best for precise clause matching
    secondary: 'dense',        // Supplementary semantic search
    fusion: 'rrf',             // Reciprocal Rank Fusion
    topK: 15,
    reranker: 'cross-encoder',
  },

  knowledgeBase: {
    vectorStore: 'legal-vectors',
    bm25Index: 'legal-bm25',
    metadata: {
      fields: ['law_name', 'article_number', 'effective_date', 'status'],
      filters: { status: 'active' },  // Default to searching only current regulations
    },
  },

  postProcessing: {
    addCitations: true,        // Automatically add citation formatting
    crossReference: true,      // Cross-reference related provisions
    confidenceThreshold: 0.7,  // Mark as uncertain if confidence is below 0.7
  },
};
```

The Finance Agent and Tech Agent share the same structure, but with different design choices along each dimension:

| Dimension | Legal Agent | Finance Agent | Tech Agent |
|-----------|------------|--------------|------------|
| Primary retrieval | BM25 exact match | Text-to-SQL | Dense Retrieval |
| Secondary retrieval | Dense | Dense | Code Search |
| Reranking | Cross-encoder | Cross-encoder | Cross-encoder |
| Key requirement | Clause precision | Numerical accuracy | Version compatibility |
| Post-processing | Citation formatting | Calculation verification | Code syntax checking |

---

## Communication Patterns

The communication pattern between multiple Agents directly impacts system latency and reliability. Three basic patterns:

### Parallel Fan-out

The Orchestrator sends requests to all relevant Agents simultaneously, using `Promise.allSettled` to wait for all responses before merging. Latency equals that of the slowest Agent, not the sum of all Agent latencies. Each Agent has a timeout and fallback -- a single Agent failure doesn't affect the others.

```typescript
// Core logic: call each domain in parallel, failed ones use fallback
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

### Sequential Delegation

One Agent's output becomes another Agent's input. For example: "Does this contract clause comply with the Personal Data Protection Act? If not, what's the financial cost of remediation?" First ask the Legal Agent, then pass the result to the Finance Agent. Latency is the sum of all Agents, and a single failure blocks the entire chain.

### Hybrid Mode

The most commonly used in practice. Parallelize what can be parallelized, sequence only what has dependencies: use `Promise.allSettled` for independent Agents first, then pass the results sequentially to Agents with dependency relationships.

### When to Use Which

```
Query type                                     → Communication pattern
───────────────────────────────────────────────────────────────────────
"Compare legal and financial perspectives"      → Parallel fan-out
"Legal compliance → financial impact"           → Sequential delegation
"Legal + Tech in parallel, then Finance eval"   → Hybrid mode
"Question about a single domain"                → Single Agent, no multi-agent needed
```

---

## Result Fusion Strategies

How do you merge results from multiple Agents into a single answer? This is the most critical design question in Multi-Agent RAG.

### Strategy 1: Voting

If multiple Agents give different answers to the same factual question, use majority vote.

```typescript
function majorityVoting(results: AgentResult[]): string {
  const answers = results
    .filter((r) => r.status === 'success')
    .map((r) => r.answer);

  // Use LLM to determine which answers are semantically equivalent
  const groups = groupBySemantic(answers);

  // Return the answer from the largest group
  return groups.sort((a, b) => b.length - a.length)[0][0];
}
```

**Suitable for**: Factual questions (with a single correct answer).
**Not suitable for**: Analytical questions with multiple perspectives.

### Strategy 2: Weighted Scoring

Each Agent's result carries a confidence score, merged by weight.

```typescript
interface AgentResult {
  domain: DomainTag;
  answer: string;
  confidence: number;        // 0-1, Agent's self-assessed confidence
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

How do you set the weights? They can be dynamically adjusted based on the query type. When asking legal questions, the Legal Agent gets a higher weight; when asking financial questions, the Finance Agent gets a higher weight. The Orchestrator can determine the weights during the query analysis phase.

### Strategy 3: LLM-based Synthesis

Feed all Agent results to an LLM and let it synthesize a coherent answer.

```typescript
async function llmSynthesis(
  originalQuery: string,
  results: AgentResult[]
): Promise<string> {
  const agentOutputs = results
    .filter((r) => r.status !== 'failed')
    .map((r) => `## ${r.domain} Agent's response\nConfidence: ${r.confidence}\n\n${r.answer}`)
    .join('\n\n---\n\n');

  const response = await llm.chat({
    model: 'claude-sonnet-4-20250514',
    system: `You are a result fusion expert. Multiple specialized Agents have provided their responses to the user's question.
Your task is:
1. Synthesize all Agent responses into a coherent final answer
2. If there are contradictions between Agents, explicitly identify the conflict points and each side's position
3. Preserve citation sources from each Agent
4. Do not add information that no Agent mentioned`,
    messages: [
      {
        role: 'user',
        content: `Original query: ${originalQuery}\n\nAgent responses:\n${agentOutputs}`,
      },
    ],
  });

  return response.content;
}
```

**This is the most commonly used strategy** because it can handle the most complex scenarios: partial overlaps, complementary information, and conflicting viewpoints. The tradeoff is an extra LLM call.

### Strategy 4: Conflict Detection

Before synthesis, check whether the Agent results contain contradictions:

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
  // Pairwise comparison
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

After detecting conflicts, the Orchestrator can:
1. Present the conflicts explicitly to the user
2. Decide which side to trust based on domain weights
3. Ask the relevant Agents for additional evidence

---

## Implementation Example

Combining all the components above into a complete Orchestrator. The individual components have been demonstrated in previous sections -- here's the integrated main flow:

```typescript
class MultiAgentOrchestrator {
  private registry: AgentRegistry;
  private analyzer: QueryAnalyzer;
  private fusionEngine: FusionEngine;

  async process(query: string): Promise<OrchestratorResponse> {
    const startTime = Date.now();

    // Step 1: Analyze query → determine which domains are involved
    const analysis = await this.analyzer.analyze(query);

    // Step 2: Single domain → forward directly, skip coordination overhead
    if (analysis.detectedDomains.length === 1) {
      return this.dispatchSingle(analysis, startTime);
    }

    // Step 3: Multiple domains → choose communication mode based on dependencies
    const results = analysis.dependencyGraph.size > 0
      ? await this.hybridDispatch(analysis)   // Has dependencies: hybrid mode
      : await this.parallelFanOut(analysis);  // No dependencies: parallel fan-out

    // Step 4: Conflict detection + result fusion
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

Usage:

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

// Single domain query → forwarded directly to Legal Agent
const r1 = await orchestrator.process('What types of sensitive personal data are defined in Article 6 of the Personal Data Protection Act?');

// Multi-domain query → parallel fan-out + LLM synthesis
const r2 = await orchestrator.process(
  'Our AI product collects user behavioral data -- analyze the risks from both legal compliance and technical architecture perspectives'
);

// Dependent query → Legal runs first, results passed to Finance
const r3 = await orchestrator.process(
  'Check whether our data processing complies with GDPR -- if not, estimate the financial cost of remediation'
);
```

The five-line `process()` method contains the core logic of the entire system: analyze, route, dispatch, detect, fuse. The implementation details of each step were demonstrated in the preceding sections.

---

## Comparison with Other Patterns

### vs Single Agentic RAG

```
Dimension              Single Agentic RAG          Multi-Agent RAG
──────────────────────────────────────────────────────────────────────
Knowledge scope        One Agent manages all        Each Agent manages one domain
Retrieval strategy     One strategy                 Custom strategy per domain
Context Window         All info crammed together    Each Agent has independent context
Latency                One Agent's latency          Slowest Agent + fusion latency
Complexity             Low                          High (requires Orchestrator)
Consistency            Naturally consistent         Requires conflict detection
Suitable scale         Small-to-medium KBs          Large multi-domain KBs
```

**When should you use Multi-Agent RAG?** When your knowledge base spans three or more clearly distinct domains, and each domain has a different optimal retrieval strategy. If your knowledge base is primarily documents from a single domain, a single Agentic RAG with good chunking and routing is sufficient.

### vs Modular RAG

Modular RAG decomposes the RAG pipeline into composable modules (chunking, embedding, retrieval, reranking, generation), but all modules share the same pipeline context.

Multi-Agent RAG goes further: each Agent is a complete pipeline with its own context. The difference lies in the **degree of isolation**:

```
Modular RAG:
  One Pipeline → [Module A] → [Module B] → [Module C] → Output
  (Modules share the same PipelineContext)

Multi-Agent RAG:
  Orchestrator → ┌ Pipeline 1 (independent context) → Result 1 ┐
                 ├ Pipeline 2 (independent context) → Result 2 ├→ Fusion → Output
                 └ Pipeline 3 (independent context) → Result 3 ┘
```

The two are not mutually exclusive. Each Agent's internals can use Modular RAG design -- Multi-Agent is an architectural layer on top.

### vs Google's Multi-Agent Patterns

Google's 2025 Agent whitepaper proposed several multi-agent patterns:

1. **Hierarchical**: A supervisor agent manages multiple worker agents. Similar to the Orchestrator pattern in this article, but Google emphasizes that the supervisor itself can also be an agent (with its own reasoning capabilities), not just a router.

2. **Peer-to-peer**: Agents communicate directly with each other, with no central Orchestrator. Suitable for scenarios requiring frequent inter-Agent communication, but less common in RAG since retrieval tasks are usually independent.

3. **Mixture of Experts (MoE)**: Borrowed from ML's MoE concept, using a gating function to decide which Agents are activated. Similar to the fast routing concept in this article.

This article's architecture is closest to a **Hierarchical + MoE hybrid**: the Orchestrator plays the supervisor role, using routing logic (gating) to determine which Agents to activate.

---

## Challenges and Limitations

Multi-Agent RAG is not a silver bullet. Here are the pain points you'll encounter in practice.

### 1. Coordination Overhead

Every LLM call the Orchestrator makes (query analysis, result fusion) adds latency and cost. A query going through the full Multi-Agent RAG pipeline:

```
Query analysis LLM call        ~500ms
Agent parallel execution        ~2,000ms (the slowest one)
Conflict detection LLM call     ~400ms
Result fusion LLM call          ~800ms
─────────────────────────────────────────
Total latency                   ~3,700ms
```

By comparison, a single Agentic RAG might only need ~2,000ms. The extra 1,700ms is entirely coordination overhead.

**Mitigations**:
- Use a lightweight model or classifier for query analysis -- it doesn't have to be an LLM
- Skip conflict detection if there are no conflicts
- Use template concatenation for result fusion -- it doesn't have to be LLM synthesis

### 2. Multi-Agent Latency

Parallel fan-out latency equals the slowest Agent. If one Agent is particularly slow (e.g., Finance Agent running complex SQL queries), it drags down overall latency.

**Mitigations**:
- Set strict timeouts -- use partial results or fallback on timeout
- Use streaming: return completed Agent results first, append slow Agent results later
- Async mode: give the user a quick answer first, continue processing in the background, update when more results arrive

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

    // Return immediately as each Agent completes
    onPartialResult(result);
  });

  await Promise.allSettled(tasks);
  return allResults;
}
```

### 3. Consistency Issues

Multiple Agents operate independently -- they don't share state. This can lead to:

- **Factual contradictions**: Legal Agent says compliant, Finance Agent assumes non-compliance to estimate costs.
- **Temporal inconsistency**: Legal Agent cites the latest regulations, Finance Agent uses last quarter's data.
- **Terminology differences**: Different Agents use different terms to refer to the same thing.

**Mitigations**:
- Conflict detection is mandatory, not optional
- Share a metadata store to ensure all Agents use consistent data versions
- The Orchestrator attaches common context when dispatching (e.g., "data reference date: 2026-03-30")

### 4. Debugging Complexity

When the answer is wrong, you need to trace:
1. Was the Orchestrator's query analysis correct?
2. Which Agents were dispatched to? Were the sub-queries correct?
3. What was the retrieval quality of each Agent?
4. Did the fusion step omit or distort anything?

That's four layers of debugging, far more complex than the single layer in a single Agent setup.

**Mitigation**: Observability is a necessary investment for Multi-Agent systems.

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

Every query should produce a complete trace, stored somewhere queryable after the fact (e.g., OpenTelemetry + Jaeger). When answer quality degrades, the trace is your only debugging tool.

### 5. Agent Boundary Definition

Deciding how many Agents to have and what each Agent is responsible for is the hardest design decision. Too fine-grained increases coordination costs; too coarse-grained loses the benefits of specialization.

A rule of thumb: **if two domains have different optimal retrieval strategies, they're worth separating.** If they use the same embedding model, the same retrieval approach, and only differ in knowledge base content, metadata filters are sufficient -- you don't need another Agent.

---

## Conclusion

The core insight of Multi-Agent RAG is simple: **specialization is more effective than being a generalist.**

But the value of this architecture isn't in "having multiple Agents" per se -- it's in three design decisions:

1. **Isolation**: Each Agent has an independent context window and retrieval strategy, preventing interference.
2. **Routing**: The Orchestrator sends queries to the right Agent, avoiding every Agent processing every query.
3. **Fusion**: Results from multiple Agents need to be strategically merged, not simply concatenated.

If your RAG system is experiencing the problem of "adding more documents actually degrades answer quality," the Multi-Agent architecture is worth considering. But before jumping in, make sure you've tuned your single Agent's retrieval quality well enough first -- often the problem isn't that the architecture isn't complex enough, but that basic chunking and retrieval haven't been done right.

## References

- [Agentic Retrieval-Augmented Generation: A Survey on Agentic RAG](https://arxiv.org/abs/2501.09136) -- Singh et al. (2025), covering Multi-Agent RAG architecture taxonomy, design tradeoffs, and practical use cases
- [AgentVerse: Facilitating Multi-Agent Collaboration and Exploring Emergent Behaviors](https://arxiv.org/abs/2308.10848) -- Chen et al. (2023), experimental research on multi-Agent collaboration frameworks and social behaviors
- [HuggingGPT: Solving AI Tasks with ChatGPT and its Friends in Hugging Face](https://arxiv.org/abs/2303.17580) -- Shen et al. (2023), an early architectural example of using LLM as a controller to coordinate multiple specialized models
- [Retrieval-Augmented Generation for Large Language Models: A Survey](https://arxiv.org/abs/2312.10997) -- Gao et al. (2024), the theoretical foundation for Modular RAG componentized design and Multi-Agent evolution
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) -- Yao et al. (2023), core reference paper for the Orchestrator's interleaved reasoning and action pattern
- [Multi-Head RAG: Solving Multi-Aspect Problems with LLMs](https://arxiv.org/abs/2406.05085) -- Besta et al. (2024), retrieval architecture for multi-aspect queries, complementary to Multi-Agent domain partitioning
- [LangChain — Context Engineering for Agents](https://blog.langchain.com/context-engineering-for-agents/) -- LangChain tech blog, strategies for context isolation and result fusion across multiple Agents
