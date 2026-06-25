---
title: "Stop Hand-Tuning Prompts: From GEPA to Tool Descriptions, Automating Agent Behavior Optimization"
date: 2026-06-04
category: ai
type: deep-dive
tags: [prompt-engineering, tool-use, ai-agent, llm, optimization]
lang: en
tldr: "Automatic prompt optimization (APO) has evolved from APE/OPRO to GEPA: replacing sparse rewards with linguistic reflection, winning over GRPO by ~6pp with 4-35x fewer rollouts. Meanwhile, tool descriptions are the overlooked prompt -- small wording changes can shift tool selection rates by 10x, and Anthropic's experiments show Claude self-rewriting tool descriptions outperforms human experts. These two lines are converging: eval-driven automatic optimization is eating hand-tuned prompts."
description: "A survey of four automatic prompt optimization algorithm families (APE/OPRO, ProTeGi/TextGrad, DSPy MIPROv2, GEPA), why GEPA's linguistic reflection beats RL, and how tool description wording systematically affects agent behavior: selection scope, 10x selection-rate fragility, Anthropic's automatic rewriting workflow, and a writing checklist."
draft: false
glossary:
  - term: "GEPA"
    definition: "An automatic prompt optimization algorithm proposed in 2025 that uses linguistic reflection (reading execution traces and writing improvement suggestions) plus genetic evolution instead of sparse rewards, achieving 4-35x higher sample efficiency than RL methods."
    context: "This article treats GEPA as the inflection point in APO evolution."
  - term: "Pareto frontier"
    aliases: ["Pareto front"]
    definition: "In multi-objective optimization, the set of solutions where no single solution can improve on all objectives simultaneously; preserving the entire frontier rather than a single best solution maintains candidate diversity and prevents premature convergence."
    context: "GEPA uses the Pareto frontier to retain candidate prompts that each excel on different subsets of problems."
---

> 🌏 [中文版](/posts/ai/2026-06-04-auto-prompt-optimization-tool-descriptions)

You spend three days hand-tuning a prompt, push accuracy from 55% to 58%, and still can't explain which sentence made the difference -- that's the reality of hand-crafted prompt engineering not scaling. This article traces two converging lines: **automatic prompt optimization (APO)** turns prompt engineering into an optimization problem with metrics; **tool description wording** is the overlooked prompt of the agent era -- and the latter is now being consumed by the former's techniques.

## Treating Prompts as Parameters: A Unified APO Framework

Since 2025, at least three systematic surveys (arXiv:2502.16923, accepted at EMNLP 2025; arXiv:2502.18746, etc.) have formalized APO as an optimization problem with three components: **search space** (candidate prompts / instructions / few-shot examples), **objective function** (a quantifiable score on an eval set), and **update direction** (how to move from the current prompt toward a better one). All methods differ only in "how the update direction is derived," yielding four families:

| Family | Representatives | Mechanism | Trade-offs |
|---|---|---|---|
| Sampling / coordinate | APE (2023), OPRO (2023) | Optimizer LLM directly generates candidate prompts, iterates based on scores | Simple and general, but relies on blind trial; low sample efficiency |
| Text-gradient | ProTeGi, TextGrad (2024) | LLM reflects on failure cases -> produces natural-language "gradients" -> targeted edits | Directional, but reflection quality is everything |
| Compilation / structural | DSPy (MIPROv2) | Treats prompts as learnable parameters of a program, jointly optimizes instructions + examples via Bayesian search | Suited for multi-stage pipelines; requires metrics and a training set |
| Reflective evolution | GEPA (2025) | Reflection + genetic evolution + Pareto frontier preservation | Extremely high sample efficiency; the 2026 front-runner |

Two foundational papers are worth remembering by the numbers: OPRO (ICLR 2024) has an optimizer LLM observe "past solutions + scores" and generate new prompts, beating human-written prompts by 8% on GSM8K and up to 50% on BBH. APE (ICLR 2023) treats instructions as "programs" -- the LLM generates a candidate instruction pool and a score function selects the best. MIPROv2 (arXiv:2406.11695) is DSPy's primary optimizer -- it jointly optimizes instructions and few-shot examples for multi-stage LM programs without requiring module-level labels or gradients.

## Why GEPA Is the Inflection Point

GEPA (**G**enetic-**Pa**reto, arXiv:2507.19457, ICLR 2026 Oral) builds on a core critique of RL: methods like GRPO compress an entire agent execution trace into a single sparse scalar reward, discarding massive amounts of information. GEPA argues that **language itself is a richer learning signal** -- let the LLM read its own reasoning, tool calls, and tool outputs, then use natural language to diagnose what went wrong, propose fixes, and test them.

The second design choice is the **Pareto frontier**: instead of returning a single best prompt, GEPA preserves a set of prompts that are complementary across different sub-objectives, preventing premature convergence to a local optimum.

The numbers (per arXiv v2 / OpenReview final version): across six tasks, GEPA wins over GRPO by an average of ~6 percentage points, up to ~19pp at its peak, with **4-35x fewer rollouts**; it also beats MIPROv2 by over 10 percentage points. For production agent teams calling expensive APIs with limited eval budgets, this means GEPA is more practically viable than RL -- no GPUs needed, no tens of thousands of samples, just reflective iteration to match or exceed RL performance.

But don't overlook the barrier: **APO fundamentally requires a quantifiable metric plus an eval set**, and that's the biggest cost. Practical workarounds when labeled data isn't available: use LLM-as-judge as a verifier (beware overly strict verifiers that reject correct answers over formatting or punctuation), maintain a held-out test set to prevent overfitting, and generate eval tasks from real usage scenarios rather than overly simple sandboxes.

## Tool Descriptions: The Overlooked Prompt

Now for the second line. Tool definitions (name + description + schema) **are loaded into the agent's context**, so the description is literally part of the prompt. Agents are non-deterministic -- the same query might trigger a tool call, a direct answer, or a clarifying question, and the description's wording heavily influences this probability distribution.

Anthropic says explicitly in [Writing effective tools for AI agents](https://www.anthropic.com/engineering/writing-tools-for-agents) that tool descriptions are "one of the most effective ways to improve tool performance," and reveals that one of the key moves behind Claude Sonnet 3.5 achieving SOTA on SWE-bench Verified was refining tool descriptions (internal Anthropic eval results; no public academic reproduction yet).

Empirical research quantifies the leverage of wording in alarming terms:

- **Selection rates can differ by 10x.** arXiv:2505.18135 validates across 17 models: editing a tool description can increase GPT-4.1 and Qwen2.5-7B's selection rate for a specific tool by more than 10x -- this is both an optimization lever and a security risk exploitable via "tool SEO."
- **The most critical description component is selection scope.** arXiv:2602.20426 shows that what most influences tool selection is "when to use, when not to use, and differences from similar tools" plus parameter constraints -- yet in practice, original descriptions cover less than 12% of these two categories.
- **Description quality is generally poor.** arXiv:2602.14878 scanned 103 MCP servers and 856 tools, finding pervasive quality "smells" in descriptions; auto-completing descriptions improves agent performance but increases token overhead -- semantic completeness and token efficiency cannot be maximized simultaneously, so you need to find the minimal effective description set.
- **More tools means worse selection**: overlapping functionality, similar naming causes confusion, compounded by lost-in-the-middle effects and parameter hallucination.

A practical checklist (compiled from Anthropic's [define tools docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) plus the papers above): each tool description should be **at least 3-4 sentences**; must state what it does, **when to use / when not to use**, each parameter's meaning and impact, and important caveats; explain implicit context as if onboarding a new colleague; use namespacing (`asana_search`, `jira_search`) to draw boundaries; name parameters unambiguously (`user` -> `user_id`); even error messages should be prompt-engineered -- provide actionable fix suggestions instead of raw tracebacks. For more complete wording rules, there's a dedicated article on this site: [LLM tool description hard rules](/posts/tech/2026-05-18-llm-tool-description-hard-rules).

## The Two Lines Converge: Automatically Optimizing Tool Descriptions

Since tool descriptions are prompts, the entire APO toolkit can be applied directly. Anthropic's approach is a textbook eval-driven workflow:

1. Build evals (real tasks + verifier)
2. Run agentic loops to collect transcripts
3. Feed transcripts to Claude Code, letting it analyze failure modes and **rewrite the tool descriptions itself**
4. Validate on a held-out test set

Result: **Claude's self-optimized version outperformed human expert-written versions** (internal Slack / Asana tool eval; same caveat about single official source). The academic counterparts -- arXiv:2602.20426's "learning to rewrite tool descriptions" and 2602.14878's automatic description smell completion -- follow the exact same logic.

## The Big Picture

When it's worth investing in automation: the pipeline is stable, metrics are well-defined, the system needs long-term maintenance, and prompts get revised repeatedly -- investing in DSPy / GEPA pays off. When to skip it: one-off tasks, hard-to-define metrics, prompts that are set once and never touched -- hand-tuning is faster. Three hidden costs to watch: the human effort to build eval sets (the real bottleneck), tokens burned by the optimizer, and reduced readability of optimized prompts (harder to debug).

One-line takeaway: prompt engineering is evolving from "writing craft" to "optimization engineering" -- and the eval set is the new moat. Whoever's eval best mirrors real usage is the one whose automatic optimization actually matters.

## References

- [GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (arXiv:2507.19457)](https://arxiv.org/abs/2507.19457)
- [GEPA GitHub](https://github.com/gepa-ai/gepa)
- [OPRO: Large Language Models as Optimizers (arXiv:2309.03409)](https://arxiv.org/abs/2309.03409)
- [APE: Large Language Models Are Human-Level Prompt Engineers (arXiv:2211.01910)](https://arxiv.org/abs/2211.01910)
- [MIPROv2 / Optimizing Instructions and Demonstrations for Multi-Stage LM Programs (arXiv:2406.11695)](https://arxiv.org/abs/2406.11695)
- [TextGrad (arXiv:2406.07496)](https://arxiv.org/abs/2406.07496)
- [A Systematic Survey of Automatic Prompt Optimization Techniques (arXiv:2502.16923)](https://arxiv.org/abs/2502.16923)
- [A Survey of Automatic Prompt Optimization (arXiv:2502.18746)](https://arxiv.org/abs/2502.18746)
- [Tool Preferences in Agentic LLMs are Unreliable (arXiv:2505.18135)](https://arxiv.org/abs/2505.18135)
- [Learning to Rewrite Tool Descriptions (arXiv:2602.20426)](https://arxiv.org/abs/2602.20426)
- [MCP Tool Descriptions Are Smelly (arXiv:2602.14878)](https://arxiv.org/abs/2602.14878)
- [Anthropic — Writing effective tools for AI agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
- [Anthropic Docs — Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)
- [DSPy](https://dspy.ai/)
