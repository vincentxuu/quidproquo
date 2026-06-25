---
title: "Resource Rationality for Agents: Optimal Decisions Across Tokens, Tool Calls, and Latency"
date: 2026-06-04
category: ai
type: deep-dive
tags: [ai-agent, reasoning, test-time-compute, llm, cost-optimization]
lang: en
tldr: "Agent decision-making under resource constraints is bounded rationality reborn: Rational Metareasoning uses VOC rewards to save 20-37% of tokens, BATS proves that adding budget without budget awareness is futile, FrugalGPT cascades cut costs by up to 98%, and Speculative Actions reduce latency by 20%. The three constraints ultimately converge into a single Pareto curve, and the overarching trend is moving from humans tuning knobs to models making resource-rational decisions on their own."
description: "From metareasoning and compute-optimal scaling to budget-aware planning, this post surveys the theoretical frameworks and engineering techniques for LLM agents making optimal decisions under the triple constraints of tokens, tool calls, and latency: BATS, FrugalGPT, RouteLLM, Speculative Actions, Probe&Prefill."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-06-04-agent-resource-rational-decisions)

Every step an agent takes spends three kinds of resources: thinking burns tokens, fetching information burns tool calls, and sequential loops burn wall-clock time. "Optimal decision-making" sounds abstract, but it really comes down to asking at each step: **Is the expected quality improvement from spending a little more -- thinking one more step, making one more tool call, switching to a pricier model -- worth its marginal cost?** This is not a new problem. It is the revival of the classic AI concept of **bounded rationality (resource rationality)** in the context of LLM agents. This post walks through both the theoretical foundations and engineering implementations, converging on a single Pareto diagram at the end.

## Theoretical Foundations: Metareasoning -- "Whether to Keep Computing" Is Itself a Decision

The classical roots trace back to Russell & Wefald's bounded optimality and Horvitz's value of computation (VOC): computation itself has a cost, and a rational agent should treat "whether to compute one more step" as a decision with expected value, rather than blindly computing to completion.

The landmark work that transplants this cognitive science framework to LLMs is **Rational Metareasoning for LLMs** (arXiv:2410.05563, Griffiths' group): they design a reward function incorporating VOC that **penalizes unnecessary reasoning steps** and train with Expert Iteration. The result is **20-37% fewer generated tokens compared to few-shot CoT / STaR, while maintaining task performance**. This is currently the cleanest, most cognitively grounded answer to "when should we stop thinking."

The cautionary counterpart has also become well established: **overthinking**. Multiple surveys (arXiv:2503.16419, 2507.02076) point out that "thinking longer" does not necessarily improve accuracy and can instead waste tokens -- an optimal agent lacks not capability but the meta-judgment of "knowing when to stop."

## How Much Compute to Spend on Thinking: Compute-Optimal Scaling

Snell et al.'s landmark paper **Scaling LLM Test-Time Compute Optimally** (arXiv:2408.03314) delivers the core finding: **the optimal strategy depends on problem difficulty**. Compute-optimal scaling that adaptively allocates compute per problem is **over 4x more efficient than best-of-N**; with FLOPs held constant, **a small model plus test-time compute can beat a model 14x larger** (provided the small model already has a non-trivial success rate).

Two axes for amplifying compute recur throughout the literature: **width (parallel)** -- parallel sampling, best-of-N, majority voting; **depth (sequential)** -- sequential revision, self-refine. These two knobs will reappear later: they directly determine latency.

## Making Resources an Explicit Constraint: Budget-Aware Planning

Google's **BATS (Budget-Aware Tool-Use Enables Effective Agent Scaling**, arXiv:2511.17006) is the keystone of this line of work and self-describes as the first systematic study of budget-constrained agents. Its **critical negative finding** is worth remembering first: **simply giving an agent a larger tool-call budget does not improve performance** -- because the agent lacks "budget awareness" and quickly hits a ceiling.

The solution has two layers: first, a **Budget Tracker**, a lightweight plug-in that continuously feeds "remaining budget" back to the agent; second, the BATS framework itself -- dynamically deciding based on remaining resources whether to **dig deeper** (pursue promising leads) or **pivot** (switch paths). It also **merges token consumption and tool consumption into a single cost metric**, systematically studying cost-performance and pushing the Pareto frontier.

Related approaches along the control-token route include: BudgetThinker (arXiv:2508.17196), which periodically inserts special tokens to inform the model of remaining budget; and SelfBudgeter (arXiv:2505.11274), which lets the model first **estimate** the minimum token budget needed for completion. The formal foundation is the Constrained MDP -- the standard RL framework for "maximizing reward under cost constraints."

## Engineering Layer 1: Token Budget Management

Anthropic defines context engineering in [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) as "curating and maintaining the optimal set of tokens at LLM inference time" -- the context window is **a budget to be actively managed**, not a space to fill as full as possible. Techniques include compaction, summarization, and retaining only essential information.

A noteworthy evolution: the Claude API initially allowed explicit setting of thinking budgets via `thinking.budget_tokens`, but by Opus 4.7 / 4.8, the official documentation has shifted to **adaptive thinking -- manual extended thinking budgets are no longer supported, and the model decides its own thinking allocation**. This is essentially metareasoning's "decide for yourself when to stop" being productized: VOC judgment internalized into the model.

## Engineering Layer 2: Tool-Call Economics and Router / Cascade

**The logic of model cascades is "cheap first, expensive later -- stop when good enough."** The seminal work FrugalGPT (arXiv:2305.05176) arranges LLMs from cheapest to most expensive in a cascade, querying sequentially and stopping once the answer is reliable enough -- **matching GPT-4 performance while cutting costs by up to 98%**. RouteLLM (arXiv:2406.18665) uses preference data to learn a router that dispatches queries to either a strong or weak model. Anthropic's corresponding pattern in [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) is also routing: simple questions go to Haiku, difficult ones to Sonnet / Opus.

**Reducing redundant tool calls** yields a counterintuitive finding: "LLM Agents Already Know When to Call Tools" (arXiv:2605.09252) demonstrates that **"whether to call a tool" can be linearly decoded from the model's pre-generation hidden states with AUROC 0.89-0.96** -- more accurate than the model's own verbalized reasoning. This means the model already knows when to call tools; it just does not follow through during generation. The resulting Probe&Prefill approach (lightweight linear probe + prefill steering) **reduces tool calls by 48% with only a 1.7% accuracy drop**, compared to the best baseline which saves only 6% at the same accuracy level.

Parallelism is not free either. Anthropic acknowledges in its [multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) article that multi-agent architectures **burn far more tokens than a single conversation** -- cost is a real trade-off, not free acceleration.

## Engineering Layer 3: Latency Constraints and Speculative Execution

**Sequential dependencies are the number-one enemy of latency**: the reasoning -> tool -> reasoning interleaving loop cannot be parallelized within a single request. **The Cost of Dynamic Reasoning** (arXiv:2506.04301), accepted at HPCA-32 2026, is the first system-level cost analysis of agent systems. Its quantified conclusion: while adding compute improves agent accuracy, there are **rapidly diminishing returns, widening latency variance, and unsustainable infrastructure costs** -- the most compelling system-level evidence that "throwing resources at accuracy is not linear."

Borrowing from CPU branch prediction, **Speculative Actions** (arXiv:2510.04371) offers a lossless solution: use a fast model to predict future actions and **execute them in parallel, committing only when predictions are correct**. In practice, next-action prediction accuracy reaches up to 55%, **reducing latency by up to 20%**, and the work formalizes the "speculation width vs. time savings" trade-off, supporting selective branch launching to avoid cost explosions.

## Coupling of the Three Constraints: Ultimately a Pareto Curve

Formulate the problem as constrained optimization: `maximize task utility s.t. tokens <= B_tok, tool_calls <= B_tool, latency <= L`. The key insight is that **the three constraints are coupled but not equivalent**:

```
        Cost dimension (fungible, reducible to money)
   token <--------------> tool call
      \                     /
       \   alpha*tok + beta*tool
        \                 /
         v               v
      -- Pareto frontier --
              ^
              | Can trade "more parallelism/tokens" for "less time"
              v
        latency (wall-clock time, determined by sequential depth)
```

Tokens and tool calls both belong to the "cost" dimension and can be folded into a single monetary axis; latency is wall-clock time, primarily determined by **sequential depth**, and can be traded for by "spending more tokens, running more in parallel" -- so it is **partially orthogonal** to the cost dimension. Together, the three have no single optimum, only "the optimum given a particular preference weighting."

## Overall Takeaways

Whether in theory or engineering, three design pillars are inescapable:

1. **Adapt to difficulty** -- do not spread compute uniformly (Snell's compute-optimal).
2. **Budget awareness** -- the model must know "how much is left" for behavior to converge (BATS, BudgetThinker, SelfBudgeter).
3. **Use confidence / verification as stopping signals** -- VOC, verifiers, and cascade "stop when good enough."

The applicability boundaries should be stated honestly: this entire toolkit of budget-aware / multi-agent / test-time compute mechanisms is best suited for open-ended, difficult, verifiable tasks with parallelizable subtasks (coding, deep research, web search). It is not suited for simple tasks -- Anthropic explicitly states that "in most cases, optimizing a single LLM call + retrieval + in-context examples is enough," and complexity should only be added when it demonstrably improves results. Unsolved challenges: VOC is hard to estimate accurately (stopping too early vs. overthinking), confidence calibration is unreliable and can cause cascade gates to misjudge, and parallelism generates redundant tool calls.

"Optimal" is never a single point but a Pareto curve. From Snell's compute-optimal scaling in 2024, to BATS's unified cost metric in 2025, to Anthropic folding thinking budgets into adaptive thinking in 2026 where the model decides for itself -- the three-year arc has a single throughline: **moving from humans tuning knobs to models making resource-rational decisions on their own.**

## References

- [Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters (arXiv:2408.03314)](https://arxiv.org/abs/2408.03314)
- [Rational Metareasoning for Large Language Models (arXiv:2410.05563)](https://arxiv.org/abs/2410.05563)
- [Budget-Aware Tool-Use Enables Effective Agent Scaling / BATS (arXiv:2511.17006)](https://arxiv.org/abs/2511.17006)
- [FrugalGPT (arXiv:2305.05176)](https://arxiv.org/abs/2305.05176)
- [RouteLLM (arXiv:2406.18665)](https://arxiv.org/abs/2406.18665)
- [Speculative Actions (arXiv:2510.04371)](https://arxiv.org/abs/2510.04371)
- [The Cost of Dynamic Reasoning (arXiv:2506.04301, HPCA-32 2026)](https://arxiv.org/abs/2506.04301)
- [LLM Agents Already Know When to Call Tools (arXiv:2605.09252)](https://arxiv.org/abs/2605.09252)
- [A Survey on Efficient Reasoning for LLMs (arXiv:2503.16419)](https://arxiv.org/abs/2503.16419)
- [BudgetThinker (arXiv:2508.17196)](https://arxiv.org/abs/2508.17196)
- [SelfBudgeter (arXiv:2505.11274)](https://arxiv.org/abs/2505.11274)
- [Anthropic: Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)
- [Anthropic: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Anthropic: How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Anthropic Docs: Building with extended thinking](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking)
