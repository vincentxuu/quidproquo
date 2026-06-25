---
title: "How to Pick the Right Tool from Hundreds: The Collapse Curve of Tool Selection and Engineering Solutions"
date: 2026-06-04
category: ai
type: deep-dive
tags: [tool-use, ai-agent, mcp, llm, context-engineering]
lang: en
tldr: "As tools scale up, selection accuracy doesn't degrade gracefully — it collapses: 4 to 51 tools drops from 43% to 2%, 10 to 100+ drops from 78% to 13.62%. The root fix is to stop stuffing everything in at once — Anthropic's Tool Search Tool uses defer loading plus retrieval to cut 85% of tokens, pushing Opus 4.5 accuracy from 79.5% to 88.1%. Description quality has conditional payoff: negligible in simple scenarios, but correctness jumps from 44% to 50% in multi-tool chaining."
description: "A compilation of empirical data and engineering solutions for scaling LLM agent tool selection: the accuracy collapse curve, prompt bloat and lost-in-the-middle mechanisms, conditional payoff of description quality (Paragon / Trace-Free+), tool retrieval (RAG-MCP), Anthropic Tool Search Tool, namespacing, progressive disclosure, and decision trees."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-06-04-tool-selection-at-scale)

After MCP became widespread, hooking up 5 servers and exposing 150 tools to an agent is the norm. The real-world ecosystem is even more extreme — MCPVerse (arXiv:2508.16260) catalogs 6,565 MCP servers exposing over 550,000 tools. The problem: **as the number of tools grows, model selection accuracy doesn't degrade gracefully — it collapses**. This post compiles the empirical numbers behind that collapse, the two underlying mechanisms, the real leverage of description quality, and engineering solutions ranging from retrieval to progressive disclosure.

## The Collapse Curve: Empirical Numbers

| Setup | Small tool set | Large tool set | Decline |
|---|---|---|---|
| BFCL calendar scheduling, 4 → 51 tools | 43% | 2% | −41pt |
| RAG-MCP stress test, 10 → 100+ tools | 78% | 13.62% | −82% |
| Llama-3.1-70B (growing catalog, single-source figure) | 95% | 20% | −79% |

(The third row is cited from vLLM's semantic router compilation — a single source. The direction is consistent with the first two rows, but treat the exact percentages with caution.)

Two mechanisms stack to produce the collapse:

**Prompt bloat.** Every tool's name + description + schema gets stuffed into the context — 150 tools' metadata alone runs 30k–60k tokens, consuming 25–30% of a 200k context window. Some teams report tool metadata eating up 40–50% of usable context.

**Decision overhead + lost in the middle.** With many tools and overlapping functionality, the act of "choosing" itself degrades. In a test with 741 tools, **tools positioned in the middle (40–60%) had a hit rate of only 22–52%**, while head and tail positions enjoyed a 31–32% relative advantage — classic long-context positional bias.

The failure mode is insidious: the model rarely says "I don't know which tool to use." Instead, it **confidently picks a plausible-sounding but wrong tool**, or calls tool B with tool A's parameters — the return format is still valid, but the semantics are wrong, making it hard to detect.

## Description Quality: Conditional Payoff

The intuition that "better descriptions mean higher accuracy" is real, but the evidence says: **it depends on the scenario**.

Paragon's [ablation experiment](https://www.useparagon.com/learn/rag-best-practices-optimizing-tool-calling/) (50 test cases — small sample, one-shot setting, treat as directional) compared generic descriptions against "extra-detailed" ones (with examples + return schema): **virtually no difference overall** (tool correctness 74.8% vs 74.5%), but **multi-tool chaining tasks showed a clear gap** — correctness 44.1% → 50%, task completion 37.5% → 50%.

Larger-scale evidence comes from Trace-Free+ (arXiv:2602.20426): in experiments with 150+ candidate tools, **rewriting tool interfaces alone** (no model changes) reduced accuracy degradation by 29.23% and improved query-level success rate by an average of 60.89%. They also found that good descriptions follow **learnable, transferable patterns** — it's not about hand-tuning each tool individually. Enterprise fine-tuning research (arXiv:2412.15660) adds a diagnostic tool: using confusion matrix analysis, they found that **low-precision tools interfere with the selection of other tools, while low-recall tools get poached** — unclear functional boundaries are the root cause of tool confusion.

Summary: few tools with clear semantic separation → description quality has low marginal benefit; **many tools, overlapping functionality, multi-step chaining → high leverage** — one of the few approaches that can significantly improve accuracy without changing models or architecture. For specifics on how to write them, see the site's articles on [hard rules for tool descriptions](/posts/tech/2026-05-18-llm-tool-description-hard-rules) and [auto-optimizing tool descriptions](/posts/ai/2026-06-04-auto-prompt-optimization-tool-descriptions).

## Root Fix: Stop Stuffing All Tools at Once

The core idea is to **decouple tool discovery from generation** — first use retrieval to pick the top-k relevant tools from an external index, then feed only those to the model.

**RAG-MCP** (arXiv:2505.03275): vectorize each tool description, then retrieve at query time. Prompt tokens cut by over 50%, tool selection accuracy **43.13% vs 13.62% (3x improvement)**; new tools just need to be added to the index — no fine-tuning required. Caveat: at the "thousands" scale, the retriever's own precision degrades, and retrieval quality is directly tied to how well descriptions are written — retrieval and description quality are complementary, not either-or.

**Anthropic Tool Search Tool** ([official docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool)): the most mature engineering implementation. All tool definitions are sent to the API but marked with `defer_loading: true`. Claude initially only sees the search tool plus a few high-frequency tools; when needed, it searches using regex or a BM25 variant, and the API returns 3–5 most relevant `tool_reference` entries that auto-expand. In practice, **token usage drops by 85%**; on large tool library benchmarks, **Opus 4 goes from 49% → 74%, Opus 4.5 from 79.5% → 88.1%**. Upper limit is 10,000 tools; the official recommended threshold: 10+ tools, tool definitions exceeding 10k tokens, or multiple MCP servers (200+ tools).

**Meta-tool / Progressive disclosure**: instead of loading all schemas, expose `find_tool` (semantic tool search) + `invoke_tool` (execution) as two meta-tools. MCP's lazy tool hydration proposal reference implementation reduces 106 tools' metadata from 54,604 → 4,899 tokens, **saving 91%** — the same philosophy as Claude Skills: load only lightweight descriptions at startup, full definitions only on hit.

**Namespacing and grouping**: use `service_resource_action` prefixes (`asana_projects_search`) to establish clear boundaries. Anthropic's tests show that **prefix vs suffix naming has non-trivial impact on benchmarks, and the effect varies by model** — run your own evals to decide. One level up is tool groups: bundle cross-server tools into scenario sets like "Development / QA / Admin," and agents only mount the groups they need.

**Routing / Multi-agent**: split tools across specialized sub-agents, each holding roughly 5 tools. A reminder from Paragon's tests: routing made almost no difference for GPT-4o (which already selects well), but pushed Claude 3.5 Sonnet's correctness from 67.6% → 75.8% — **routing isn't a silver bullet; it patches specific model weaknesses**. Eval first, then deploy.

## Decision Tree

```
Tools < ~10, semantically distinct
  └─► Just write clear descriptions / naming — no retrieval needed

Tool definitions > 10k tokens, or 10–200+ tools
  └─► Tool Search Tool / RAG retrieval + defer loading

Thousands of tools, high turnover
  └─► Retriever precision degrades → add hierarchical / grouped / metadata-driven approach, or split into multi-agent

Specific model selects poorly
  └─► Routing / reduce tools per agent (eval to confirm effectiveness first)
```

Regardless of which path you take, **whether those final 3–5 candidates get selected correctly still comes down to description quality and tool boundaries** — retrieval solves "finding it," description quality solves "picking the right one." Do both.

## Takeaways

Three points to remember: First, tool scale is a real problem — the collapse curve appears consistently across multiple independent benchmarks, and the failure mode is "confidently wrong," not "admitting uncertainty." Second, the ROI on description quality materializes only in multi-tool, overlapping-functionality scenarios — start by using confusion matrices to identify interfering tool pairs, then sharpen the boundaries. Third, beyond ten tools you should seriously consider defer loading + retrieval — an 85% token reduction and 8.6 percentage point accuracy improvement is currently the best bang for the buck.

## References

- [Anthropic — Writing effective tools for AI agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
- [Claude Docs — Tool search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool)
- [RAG-MCP: Mitigating Prompt Bloat in LLM Tool Selection (arXiv:2505.03275)](https://arxiv.org/abs/2505.03275)
- [Learning to Rewrite Tool Descriptions / Trace-Free+ (arXiv:2602.20426)](https://arxiv.org/abs/2602.20426)
- [Enterprise-Scenario Function-Calling (arXiv:2412.15660)](https://arxiv.org/abs/2412.15660)
- [MCPVerse (arXiv:2508.16260)](https://arxiv.org/abs/2508.16260)
- [Paragon — Optimizing Tool Calling](https://www.useparagon.com/learn/rag-best-practices-optimizing-tool-calling/)
- [Paragon — Optimize and Scale Your AI Agent's Tool Calling](https://www.useparagon.com/learn/optimizing-tool-performance-and-scalability-for-your-ai-agent/)
- [MCP Issue #1978 — lazy tool hydration](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1978)
