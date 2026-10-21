---
title: "AI Engineer Interview Daily — 2026-10-22: LLM & Agent Engineering"
date: 2026-10-22
category: daily
type: digest
tags: [ai-engineer-interview, daily, llm-engineering]
lang: en
description: "Today's slot practices breaking agent evaluation into multiple layers, plus when context compaction actually pays for itself."
tldr: "Once an agent chains together retrievers, sub-agents, and tool calls, checking whether the final answer is right isn't enough anymore. Today's practice is pulling evaluation apart layer by layer, worked through a multi-tool agent evaluation question."
series:
  name: "AI Engineer Interview Daily"
  order: 64
---

> 🌏 [中文版](/posts/daily/2026-10-22-ai-interview-daily)

## Today's Focus

Today's practice is LLM & Agent Engineering. The core question this round tests: once a system is no longer "prompt in, answer out" but instead chains multiple retrievers, sub-agents, and a string of tool calls before producing a result, how do you know where it broke and how much to trust it? This shows up constantly in AI Engineer phone screens and onsites, under the "how do you evaluate what you built" question. What the interviewer actually wants isn't a vague "we do evaluation" — it's a concrete answer about which layers you'd break evaluation into and what metric belongs to each one.

The other angle that comes up a lot is context engineering: when an agent runs long and context keeps piling up, when do you compress or drop old content, and when do you rely on retrieval to pull it back instead? Both get practiced today.

## Core Concepts

### 1. Agent evaluation has to be layered — you can't just check the final answer

A complex agent might combine multiple retrieval engines, several LLM generation steps, sub-agents, and a chain of tool calls. Looking only at "was the final output right" tells you whether the system broke somewhere, not where. The right breakdown looks at task completion, step efficiency, tool correctness, argument correctness, plan adherence (does the agent stay aligned with the user's goal), and safety metrics (bias, toxicity, harmful content) all at once. RAG-specific metrics — answer relevancy, faithfulness, contextual precision and recall — are actually a subset of agent evaluation, not a separate thing.

### 2. RAG's core mental model: an open-book exam, but the exam quality depends on question quality

Think of RAG as giving the LLM an open-book exam instead of a closed-book one: the model has real, relevant retrieved content in front of it, so it's less likely to hallucinate, and when it can't find the answer it should say so honestly. But the 2026 consensus is that "should we use RAG" is no longer the question — the hard part is running it well. That means interviewers won't ask you to define RAG anymore; they'll push into how you prioritize improvements and how you quantify the gains.

### 3. Context engineering: compaction only pays off when the compression ratio is high enough

Cached tokens can cost up to 50x less than regular tokens on some APIs, which means compressing context (compaction) only makes sense when it clears that threshold without losing quality — otherwise you're better off letting cache hits keep working. The more important architectural decision is making retrieval a tool call inside the agent loop, letting the agent decide whether and what to query, rather than stuffing everything into the prompt before the loop even starts. That lets the agent narrow scope dynamically instead of processing the whole bundle every time.

### 4. Guardrail tuning: both missed harmful content and over-blocking are failures

Interviewers often use "how do you tune guardrails" to test whether you've actually run something in production. The right answer names both failure directions: letting harmful content through is a safety failure, but over-blocking legitimate requests (declining normal questions too) is just as much a product failure — excessive caution isn't "safety," it's lost experience and trust. Once live, you monitor both error rates, not just the miss rate.

### 5. SFT, RLHF, and DPO split the work differently — interviewers test whether you can state the difference cleanly

Supervised fine-tuning (SFT) teaches format and behavior by imitation — training on human-labeled question-to-ideal-answer pairs. RLHF first trains a reward model on human preference data, then uses reinforcement learning to optimize the policy so outputs better match human preferences. DPO (Direct Preference Optimization) skips training a separate reward model entirely and optimizes the policy directly from preference data. One-line version: SFT teaches format, RLHF/DPO teach preference.

## Today's Practice Question

### The Question

Your team built a customer support agent that calls multiple tools — looking up the order system, retrieving the return policy via RAG, and calling a refund API — and sometimes hands sub-questions off to a sub-agent. After launch, users complain that "the answer is sometimes wrong," but all you have is the final answer and whether users complained. Explain how you'd design an evaluation method that pinpoints which layer the problem is actually in.

**Source**: Adapted from the evaluation framework in Confident AI's "LLM Agent Evaluation Metrics in 2026" blog post (published 2026-10-15) **Difficulty**: Intermediate **Round**: Phone screen / onsite LLM engineering

### Breaking It Down

1. **Clarify the problem first**: ask what the agent's typical task flow looks like (how many tool calls, is there sub-agent delegation), whether complete execution traces are currently being retained, and the scale and density of complaints (isolated incidents or a systemic failure in one flow).
2. **Build the framework**: emphasize that "is the final answer right" is only an aggregate signal. The real work is breaking evaluation down to every step in the flow — did retrieval find the right return-policy passage, were the tool-call arguments correct (did it look up the right order number), did the sub-agent's returned sub-result match the main agent's intent, and is the final generated answer faithful to the retrieved content.
3. **Go deep on the core trade-offs**: the key technical trade-off is evaluation granularity versus cost — manually labeling every step isn't realistic, so you layer it. High-frequency, cheap automated metrics (does the tool call's arguments match the schema, RAG's contextual precision/recall run automatically via LLM-as-judge) sit in CI and gate version updates; expensive manual spot-checks go to traces that actually triggered complaints and to periodic quality audits. The other key piece is attribution — if the final answer is wrong, you need to be able to trace back whether retrieval missed the right document, the tool call queried the wrong order, or generation failed to faithfully use the retrieved content. That requires logging every step's input and output as a complete trace, not just the final output.
4. **Close it out**: close with a concrete number, e.g. "after splitting evaluation into retrieval precision, tool-call correctness, and generation faithfulness, we found 80% of error cases traced back to the tool call looking up the wrong order number — not retrieval or generation" — that's what makes the interviewer feel you've actually used this framework to localize a problem, not just described it on paper.

### Sample Answer (How You'd Actually Say This in an Interview)

> I'd start by splitting the agent's execution flow into three observable stages: retrieval (looking up the return policy), tool calls (checking the order, calling the refund API), and generation (combining this information into the final answer) — and have the system log a complete trace for every step, not just the final answer, but the intermediate retrieval results, tool-call arguments, and return values too. **Just having "did the user complain" isn't enough**, because it can't tell me which layer the error happened in.
>
> **On metrics**, I'd layer it: at the retrieval layer, contextual precision and recall measure whether the retrieved policy passages are accurate and complete enough; at the tool-call layer, I'd check whether the call arguments match the schema and whether the right order number was looked up — that's cheap, rule-based checking; at the generation layer, I'd check whether the final answer is faithful to the retrieved content, so the model isn't inventing policy details on its own. These automated metrics go into CI, so every prompt or model-version change runs a regression pass first.
>
> **Attribution is the hard part of this question**: for traces that actually drew a user complaint, I'd do manual spot-checks to find which layer failed first. In practice you often find the problem isn't generation at all — it's the tool call looking up the wrong order number, or retrieval failing to find the right return-policy passage, and the generation model is just faithfully turning bad inputs into a plausible-sounding wrong answer. Once you've found the bottleneck layer, the fix priority becomes obvious instead of spending all your effort tweaking prompts.

### Self-Check

Use this table to check whether your answer hit the key points:

| Checklist item | Covered? |
|---|---|
| Pointed out that checking the final answer alone can't localize which layer failed | |
| Split evaluation into at least three layers — retrieval, tool calls, generation — measured separately | |
| Mentioned logging complete execution traces (not just final output) | |
| Distinguished high-frequency automated metrics (CI gating) from low-frequency manual review (sampled audits) | |
| Bonus: mentioned that finding the bottleneck layer makes fix priority obvious | |

## Further Reading

- [LLM Agent Evaluation Metrics in 2026: Tool Calling, Task Completion, ...](https://www.confident-ai.com/blog/llm-agent-evaluation-complete-guide) — today's main source for the core concepts and practice question, with a full list of a dozen-plus agent evaluation metrics and their layering logic
- [Context Engineering in 2026](https://daily.dev/posts/context-engineering-in-2026-louis-fran-ois-bouchard-omar-solano-samridhi-vaid-towards-ai-psjpeinog) — a cost-benefit breakdown of compaction, plus hands-on comparisons of RAG vs. GraphRAG vs. long context
- [GenAI & LLM System Design Interview Guide (2026)](https://prachub.com/resources/genai-llm-system-design-interview-guide-2026) — a layer-by-layer breakdown of the RAG pipeline questions common in GenAI system design rounds, good for extending into architecture-style practice

## References

- [LLM Agent Evaluation Metrics in 2026: Tool Calling, Task Completion, ...](https://www.confident-ai.com/blog/llm-agent-evaluation-complete-guide) — source for the "agent evaluation must be layered" concept and today's adapted practice question
- [RAG Explained Simply and Why Every Engineer Should Understand It](https://dglearning.substack.com/p/rag-explained-simply-and-why-every) — source for the "RAG as open-book exam" mental model and the 2026 trend toward "running RAG well"
- [Context Engineering in 2026](https://daily.dev/posts/context-engineering-in-2026-louis-fran-ois-bouchard-omar-solano-samridhi-vaid-towards-ai-psjpeinog) — source for compaction cost-benefit and the architectural decision to make retrieval an agent-loop tool call
- [AI Engineer Interview Questions (40, With Answer Outlines)](https://copilotinterview.com/blog/ai-engineer-interview-questions) — source for the guardrail-tuning (missed content vs. over-blocking) and SFT/RLHF/DPO comparison concepts
