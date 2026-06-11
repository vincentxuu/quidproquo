---
title: "Plan-and-Execute: A RAG Pattern That Plans Before It Acts"
date: 2026-03-12
type: guide
category: ai
tags: [rag, plan-execute, agentic, multi-step, reasoning]
lang: en
tldr: "For complex queries, have the LLM map out what information is needed and in how many steps — then execute that plan. More systematic than thinking on the fly."
description: "How Plan-and-Execute RAG works: the LLM generates an execution plan first, then retrieves and integrates information step by step. Covers the difference from ReAct loops and when each approach fits best."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-12-plan-and-execute-rag)

The ReAct loop in Agentic RAG is a "think-as-you-go" approach — take a step, evaluate the result, decide what's next. It's flexible, but for highly complex problems, each decision is made without a full picture, which can lead to roundabout paths.

Plan-and-Execute takes a different approach: **let the LLM think through the entire plan upfront, then carry it out**. It's like drawing a map before you set off, rather than asking for directions as you walk.

## Two Phases

**Phase 1: Planner**

The LLM analyzes the query and generates a structured execution plan:

```json
{
  "goal": "Recommend beginner climbing routes in Taipei",
  "steps": [
    {
      "step": 1,
      "action": "retrieve",
      "query": "climbing crags near Taipei",
      "purpose": "Get a list of accessible crags around Taipei"
    },
    {
      "step": 2,
      "action": "retrieve",
      "query": "difficulty range and characteristics suitable for beginners",
      "purpose": "Clarify what counts as beginner-level"
    },
    {
      "step": 3,
      "action": "retrieve_conditional",
      "query": "{crag name} beginner routes",
      "depends_on": "step_1",
      "purpose": "Query beginner routes for each crag found in step 1"
    },
    {
      "step": 4,
      "action": "synthesize",
      "purpose": "Integrate everything and generate recommendations"
    }
  ]
}
```

**Phase 2: Executor**

Execute the plan step by step. Each `retrieve` step runs a search, `retrieve_conditional` waits for its dependency before executing, and `synthesize` aggregates all context to produce the final answer.

## How It Differs from ReAct

| | ReAct | Plan-and-Execute |
|---|------|-----------------|
| Thinking mode | Real-time decisions | Plan first, then execute |
| Global visibility | Local (only sees current step) | Full (knows the whole picture from the start) |
| Flexibility | High (can change direction anytime) | Low (hard to pivot once the plan is set) |
| Best for | Queries where the number of steps is unknown | Complex but structurally clear problems |
| Latency | Variable (depends on step count) | More predictable (plan is explicit) |

ReAct is better for exploratory questions ("what's interesting about this crag"), while Plan-and-Execute fits goal-oriented complex queries ("plan a climbing trip for me").

## Planning Prompt

```
You are the planner for a climbing knowledge assistant. Analyze the query below and produce a structured execution plan.
Break the plan into 2–5 concrete steps, explaining what information each step retrieves and why.

Query: {query}

Output the execution plan as JSON with a goal field and a steps array.
```

## Handling Dependencies

Steps in the plan may depend on earlier results (`depends_on`):

```typescript
async function executePlan(plan: ExecutionPlan): Promise<string[]> {
  const results: Map<number, string> = new Map();

  for (const step of plan.steps) {
    if (step.depends_on) {
      // Wait for the dependency result
      const depResult = results.get(step.depends_on);
      step.query = step.query.replace('{結果}', depResult ?? '');
    }

    if (step.action === 'retrieve') {
      const docs = await hybridSearch(step.query);
      results.set(step.step, formatDocs(docs));
    } else if (step.action === 'synthesize') {
      // Aggregate all results and generate the final answer
      const allContext = [...results.values()].join('\n\n');
      return generateAnswer(plan.goal, allContext);
    }
  }
}
```

Steps without dependencies can run in parallel; steps with dependencies must wait. This design keeps execution close to optimal — independent searches run concurrently.

## When to Use It

Plan-and-Execute delivers the most value in these scenarios:

1. **Trip planning**: "Plan a climbing trip from Taipei to Hualien"
2. **Comparative analysis**: "Compare Longdong and Xindian for beginner suitability"
3. **Multi-dimensional recommendations**: "Find a crag that matches my level, has great scenery, and is easy to get to"
4. **Structured reports**: "Give me a complete beginner's guide to bouldering"

For these kinds of questions, planning ahead produces far more systematic and complete answers than making it up as you go.

## Configuration in the System

```typescript
// Enabled when rag_strategy === 'plan-execute'
const effectiveStrategy =
  config.rag_strategy === 'auto'
    ? detectStrategy(queryType, queryComplexity)
    : config.rag_strategy;

if (effectiveStrategy === 'plan-execute') {
  await planAndExecute(ctx);
} else if (effectiveStrategy === 'agentic') {
  await agenticRetrieve(ctx);
} else {
  await standardRetrieve(ctx);
}
```

All three strategies can be switched dynamically through the Admin UI without redeploying. `auto` mode selects the strategy based on query characteristics.

## The Big Picture

Plan-and-Execute separates thinking from doing. The Planner handles global reasoning; the Executor focuses on carrying things out. This division of roles makes complex queries more tractable.

The tradeoff is an extra LLM call to generate the plan, plus reduced adaptability once the plan is set. For complex queries with clear structure, that cost is worth it. For open-ended exploratory queries, ReAct's flexibility is the better fit. Which strategy to choose depends on the nature of the problem — there's no universal answer.

---

## References

- [Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning by Large Language Models (2023)](https://arxiv.org/abs/2305.04091)
- [ReAct: Synergizing Reasoning and Acting in Language Models (2022)](https://arxiv.org/abs/2210.03629)
- [NobodyClimb System Architecture: A Full-Stack Climbing Community on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) (zh-TW only)
- [NobodyClimb AI Architecture: A 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) (zh-TW only)
