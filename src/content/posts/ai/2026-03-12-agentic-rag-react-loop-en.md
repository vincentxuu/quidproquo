---
title: "Agentic RAG: Letting the LLM Decide When to Search Again"
date: 2026-03-12
type: guide
category: ai
tags: [rag, agentic-rag, react, multi-hop, llm-agent]
lang: en
tldr: "For complex multi-hop questions, a single RAG search isn't enough. Agentic RAG lets the LLM evaluate whether retrieved results are sufficient — if not, it rewrites the query and searches again, forming a ReAct loop."
description: "A look at Agentic RAG's ReAct loop design: trigger conditions, decision logic, trade-offs versus baseline RAG, and a practical example from a climbing recommendation scenario."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-12-agentic-rag-react-loop)

Standard RAG is a single-pass pipeline: query → retrieve → generate. That works fine for most questions, but falls apart when a query requires multi-hop reasoning.

"Plan me a climbing trip leaving from Taichung — intermediate level, doable on a weekend, with routes at different grades so everyone in the group can climb."

This question spans several dimensions:
1. What climbing crags are near Taichung? (geography)
2. What grade distribution does each crag offer? (route info)
3. What grade range counts as intermediate? (skill assessment)
4. How accessible are they on weekends? (logistics)

One search can't cover all of that at once. Agentic RAG lets the LLM **evaluate whether the current context is sufficient** during execution — and if it isn't, decide what to search for next.

## The ReAct Loop

ReAct (Reasoning + Acting) is the core pattern behind Agentic RAG:

```
Reason: Evaluate current context, decide next step
Act:    Execute the decision (search / answer / broaden)
Observe: Receive search results, update context
Reason: Re-evaluate... (loop)
```

Here's how it looks in the implementation:

```typescript
async function agenticRetrieve(ctx: PipelineContext): Promise<void> {
  let step = 0;

  while (step < ctx.config.agentic_max_steps) {
    const candidates = ctx.candidateMatches;

    // Check if we have enough
    if (candidates.length >= ctx.config.agentic_min_docs_to_answer) {
      ctx.agenticDecision = 'ANSWER';
      break;
    }

    // LLM decides: rewrite query / broaden filter
    const decision = await agentDecide(ctx.currentQuery, candidates, ctx.config);

    if (decision.action === 'RETRIEVE') {
      // Re-run search with rewritten query
      ctx.currentQuery = decision.rewrittenQuery;
      const newResults = await hybridSearch(ctx);
      mergeResults(ctx, newResults);
    } else if (decision.action === 'BROADEN') {
      // Relax filter constraints
      ctx.vectorFilter = relaxFilter(ctx.vectorFilter);
      const newResults = await hybridSearch(ctx);
      mergeResults(ctx, newResults);
    } else {
      break; // ANSWER
    }

    step++;
  }
}
```

`agentic_max_steps` prevents infinite loops. The default is 3 steps and can be tuned.

## The Decision Prompt

The agent's decision LLM receives:

```
Current query: {query}
Documents found so far ({n}): {document_summaries}

Choose one:
ANSWER   — Context is sufficient; generate a response
RETRIEVE — More information needed; rewrite the query (provide new query)
BROADEN  — Filter constraints are too strict; relax the search scope
```

The LLM returns a structured decision:

```json
{
  "action": "RETRIEVE",
  "rewrittenQuery": "Taichung climbing crag transportation options",
  "reasoning": "The current documents lack transportation info; need to supplement."
}
```

## Trigger Conditions

Agentic RAG isn't on by default. It requires:
1. `rag_strategy === 'agentic'` or `rag_strategy === 'auto'` (in auto mode, the strategy is chosen based on `queryType`)
2. `queryType === 'complex'`

The reason is straightforward: Agentic RAG has significantly higher latency than standard RAG (multiple LLM calls + multiple searches), so it's not appropriate for every query.

```
Standard RAG: 5–8 s
Agentic RAG:  10–20 s (depending on number of steps)
```

Are users willing to wait longer in exchange for a more complete answer? That depends on how complex the query is. `auto` mode lets the system make that call.

## How It Differs from CRAG

CRAG is a **rule-based fallback triggered by zero results**; Agentic RAG is **LLM-driven intervention when results exist but aren't good enough**:

| | CRAG | Agentic RAG |
|---|------|-------------|
| Trigger | Zero candidate documents | LLM judges context insufficient |
| Decision | Rule-based (remove filter) | LLM (rewrite query / broaden) |
| Complexity | Low | High |
| Added latency | ~+0.5 s (one extra search) | +5–15 s (multiple LLM calls) |

The two can run together: CRAG as a baseline safety net, Agentic RAG as the high-quality path.

## Multi-Hop Reasoning in Practice

For queries that require synthesizing multiple sources, Agentic RAG clearly outperforms standard RAG:

**Standard RAG**: search "Taichung climbing trip" → retrieve a few crag writeups → LLM generates limited suggestions from that sparse context

**Agentic RAG**:
- Step 1: Search "crags near Taichung" → finds Dakeng, Guguan
- Step 2: LLM notices grade info is missing → searches "Dakeng crag route grades"
- Step 3: LLM notices logistics are missing → searches "Dakeng crag how to get there"
- Synthesizes all three passes → produces a thorough trip plan

Each step fills a specific gap in the context rather than throwing one broad search at the wall and hoping for the best.

## The Takeaway

Agentic RAG represents the evolution of RAG systems from *passive retrieval* to *active reasoning*. It's not suited for high-traffic, latency-sensitive scenarios — but for complex planning and multi-hop reasoning queries, the quality improvement is substantial.

The core design principle: **give the LLM enough information instead of making it guess**. Rather than asking the model to reason from an incomplete context, let it run a few more searches until it has what it needs. Agentic RAG hands that judgment back to the LLM.

---

## References

- [ReAct: Synergizing Reasoning and Acting in Language Models (2022)](https://arxiv.org/abs/2210.03629)
- [Toolformer: Language Models Can Teach Themselves to Use Tools (2023)](https://arxiv.org/abs/2302.04761)
- [NobodyClimb System Architecture: A Full-Stack Climbing Community on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) (zh-TW only)
- [NobodyClimb AI Architecture: A 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) (zh-TW only)
