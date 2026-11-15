---
title: "AI Engineer Interview Daily — 2026-11-05: LLM & Agent Engineering"
date: 2026-11-05
category: daily
type: digest
tags: [ai-engineer-interview, daily, llm-engineering]
lang: en
description: "Thursday's slot is LLM & Agent Engineering: practiced on a representative question from OpenAI's public interview-prep material, on turning a tool-calling agent from a fragile \"model proposes, system executes\" loop into a reliable system with schema validation, side-effect tiering, and hard caps."
tldr: "Today's core idea is that a tool-calling agent's loop can't rely on the model to self-police — the failure modes have to be caught in code: schema validation, iteration/time/token caps, read/write tiering, persisted state, and grading on whether the task actually got done rather than whether a single call was well-formed. The practice question comes from a representative interview question synthesized from OpenAI's public hiring materials (not a leaked question): design a reliable tool-calling loop, and the point is to split the failure modes apart and solve each one, not trust the model to get it right end to end."
series:
  name: "AI Engineer Interview Daily"
  order: 78
---

> 🌏 [中文版](/posts/daily/2026-11-05-ai-interview-daily)

## Today's Focus

Still LLM & Agent Engineering today, but shifting from last week's "retrieval plus permissions" angle to another facet interviewers dig into just as hard: once an agent starts calling external tools, how does the whole loop stay under control. Most candidates picture this as "the agent proposes a tool call, the system runs it, the result gets fed back in" — simple enough to say out loud. What interviewers actually want to hear is where that loop breaks in production, and what concrete engineering fix addresses each break. It's one of the most commonly probed question shapes in FDE and applied-engineer loops.

## Core Concepts

```diagram
title: Five reliability gates in an agent's tool-calling loop
desc: A proposed tool call passes through schema validation, side-effect tiering, an irreversible-action gate, and a state/cap check, before branching into a completed answer or a partial-progress report.
caption: Simplified view — omits the model's re-proposal path and the detail of multiple iterations.
---
<svg viewBox="0 0 640 740">
  <path class="dg-line" d="M320 76V132" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 196V252" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 316V372" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 436V492" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 556V576"/>
  <path class="dg-line" d="M320 576H148Q140 576 140 584V612" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M320 576H492Q500 576 500 584V612" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="180" y="20" width="280" height="56" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">Model proposes a tool call</text>

  <rect class="dg-box dg-box--accent" x="180" y="132" width="280" height="64" rx="6"/>
  <text class="dg-label" x="320" y="156" text-anchor="middle" dominant-baseline="central">Schema validation</text>
  <text class="dg-sub" x="320" y="176" text-anchor="middle" dominant-baseline="central">JSON schema, retry capped at 3</text>

  <rect class="dg-box" x="180" y="252" width="280" height="64" rx="6"/>
  <text class="dg-label" x="320" y="276" text-anchor="middle" dominant-baseline="central">Side-effect tiering</text>
  <text class="dg-sub" x="320" y="296" text-anchor="middle" dominant-baseline="central">reads retry freely; writes need idempotency keys</text>

  <rect class="dg-box" x="180" y="372" width="280" height="64" rx="6"/>
  <text class="dg-label" x="320" y="396" text-anchor="middle" dominant-baseline="central">Irreversible-action gate</text>
  <text class="dg-sub" x="320" y="416" text-anchor="middle" dominant-baseline="central">refunds／deletes／emails need human confirmation</text>

  <rect class="dg-box dg-box--accent" x="180" y="492" width="280" height="64" rx="6"/>
  <text class="dg-label" x="320" y="516" text-anchor="middle" dominant-baseline="central">State and cap check</text>
  <text class="dg-sub" x="320" y="536" text-anchor="middle" dominant-baseline="central">persisted log + iteration／time／token budget</text>

  <rect class="dg-box" x="30" y="612" width="220" height="64" rx="6"/>
  <text class="dg-label" x="140" y="636" text-anchor="middle" dominant-baseline="central">Task complete</text>
  <text class="dg-sub" x="140" y="656" text-anchor="middle" dominant-baseline="central">return answer + trace</text>

  <rect class="dg-box" x="390" y="612" width="220" height="64" rx="6"/>
  <text class="dg-label" x="500" y="636" text-anchor="middle" dominant-baseline="central">Cap hit, unfinished</text>
  <text class="dg-sub" x="500" y="656" text-anchor="middle" dominant-baseline="central">return partial progress + reason</text>

  <line class="dg-rule" x1="20" y1="700" x2="620" y2="700"/>
  <text class="dg-tag" x="20" y="724" dominant-baseline="central">Legend</text>
  <rect class="dg-box dg-box--accent" x="100" y="716" width="16" height="16" rx="3"/>
  <text class="dg-small" x="124" y="724" dominant-baseline="central">deterministic validation／control layer</text>
  <line class="dg-line dg-line--dashed" x1="380" y1="724" x2="404" y2="724"/>
  <text class="dg-small" x="412" y="724" dominant-baseline="central">abort path on hitting a cap</text>
</svg>
```

### 1. The five failure modes in an agent's tool-calling loop

The naive loop — model proposes a call, system executes, result gets appended — breaks in production on five fronts: malformed or hallucinated calls, non-termination, unhandled side effects, lost state after a restart, and judging quality from single-call accuracy instead of task-level outcomes. Breaking the answer into these five failure modes, each with its own fix, lands far better than a vague "I'd add error handling."

### 2. Keep context and memory separate: compact for the short term, store for the long term

Short-term memory is the state of one run or one conversation, usually held by a checkpointer so the loop can resume and recover. Long-term memory is information meant to outlive that run — user preferences, learned facts — and belongs in a separate store rather than being re-sent as part of context every time. When the context window fills up, the three moves are compacting (summarizing history), offloading (writing notes outside the window, to a file or database), or splitting work into a subagent with clean history. They trade fidelity against cost differently, and they're not mutually exclusive — naming which one applies to which situation is what separates a real answer from a buzzword list.

### 3. The RAG-vs-fine-tuning test: does the model need to know, or to behave differently

Before deciding whether to fine-tune, ask whether the need is for the model to *know* something new or to *behave* differently. Needing to know almost always means RAG: it handles freshness (updating an index beats retraining), can filter retrieved content by user permission, and gives citations. Behaving differently is where fine-tuning earns its place — consistent tone and format, domain jargon, or distilling a large model's behavior onto a cheaper one. The default escalation order is prompting first (if it fits in context, just stuff it), then RAG once the knowledge base outgrows context or changes often, and fine-tuning only for behavior.

### 4. "The model got worse" after an upgrade is an eval problem, not a debate to win

When a customer reports regression after a model upgrade, don't argue from impressions — turn it into something measurable. Pull production traces from before and after, run both versions against an eval set (build one now from 50-100 recent production inputs if none exists), and compare sliced by task type — aggregate parity often hides a real regression in one category. LLM-as-judge is fine for scoring, but calibrate it against a small human-labeled subset first. Also ask the customer for 5-10 concrete failing examples; specific failures surface the pattern faster than a general impression does.

### 5. Prompt injection has no complete fix — only defense in depth and a smaller blast radius

Start from the honest premise: instructions and data share one channel, and no filter fully stops prompt injection today. So the answer isn't a single defense, it's layering to reduce susceptibility plus shrinking the cost of a successful attack. Reducing susceptibility means privilege separation in the prompt (retrieved content is explicitly marked as data, never instructions) and input-side classifiers — useful, bypassable, one layer among several, never the whole defense. The real safety lives in limiting blast radius: least-privilege tool access, credentials scoped per user and per session, human confirmation gating any irreversible or exfiltrating action, and deny-by-default outbound network access. The design mindset: assume an injection will succeed sometimes, and make that event cheap.

## Today's Practice Question

### Question

You're designing the execution loop for an agent that calls external tools (function calling), and it needs to be reliable enough to ship. What failure modes does the loop need to catch, and specifically how?

**Source**: Representative question synthesized from OpenAI's public interview-prep material (`ombharatiya/AI-Engineer-Interview-Questions`, built from public role descriptions and candidate reports — not a leaked question) **Difficulty**: Advanced **Round**: Onsite system design / technical deep-dive

### How to break it down

1. **Clarify first**: Ask what tools the agent has access to, whether any are irreversible (refunds, deletions, emails), whether the task is single-turn or a multi-step tool chain, what observability/tracing already exists, and whether partial task completion is acceptable to the user. The answers decide how much weight to put on human-confirmation gates versus graceful partial failure.
2. **Build a framework**: Split the loop into five gates — schema validation, side-effect tiering, an irreversible-action gate, state persistence, and a cap-plus-quality check — and explain which failure mode each one catches, without blurring them together.
3. **Go deep on the core trade-off**: The sharpest trade-off is permissive validation (smoother flow) versus strict validation (more reliable) — a malformed call should return a structured error so the model can retry, rather than crashing the loop, but the retry count needs a hard cap so it can't loop forever on the same mistake. The second trade-off: tool-selection accuracy degrades as the toolset grows, so the agent's starting loadout should be trimmed to exactly what the current task needs, not every tool it might ever use.
4. **Close**: Close on "classify the failure modes, then solve each one" being more reliable than trusting the model to self-police. Add one more point: every step needs to leave a trace — that's the only way to know which step broke after deployment, and it's also the foundation for later debugging and evaluation.

### Sample answer (how to actually say this in an interview)

> I'd first ask whether any of this agent's tools are irreversible — refunds, deletions, emails — because that decides whether the write path needs a human-confirmation gate. **Architecturally**, I'd split the loop into a few gates: every proposed tool call goes through JSON schema validation first, and a malformed call gets a structured error back to the model so it can self-correct, with the retry count capped — say at three — so it can't get stuck looping on the same mistake. Validated calls then split by read versus write: reads can retry freely, writes always require an idempotency key, and irreversible actions get an extra human-confirmation or policy check so the agent never decides on its own to issue a refund.
>
> On **reliability**, I'd persist every step's messages and tool results so the loop can resume from where it stopped instead of replaying side effects that already happened — which is also the only way to actually debug which step failed. I'd set hard caps on iteration count, wall-clock time, and tokens, and hitting a cap returns the current progress and a reason rather than silently hanging. For **evaluation**, I wouldn't just check whether individual calls were well-formed — I'd measure task-level success, whether the end state was actually achieved — paired with a per-tool error-rate dashboard, because a degrading tool is usually the real reason an agent suddenly "gets dumber."

### Self-check

Use this table to check whether your answer covered the key points:

| Checklist item | Covered? |
|---------|---------|
| Tool calls validated against a schema first, not trusted at face value from the model's output | |
| Iteration/time/token caps set explicitly to prevent infinite loops, instead of relying on the model to stop itself | |
| Write-tier tools require idempotency keys, and irreversible actions require human confirmation or a policy check | |
| Each step's state is persisted so the loop can resume from where it stopped, not replay the whole run | |
| Evaluation measures task-level success (did the end state get achieved), not just whether a single call was well-formed | |
| Bonus: noted that the starting tool loadout should be trimmed — more tools degrade selection accuracy | |

## Further Reading

- [AI-Engineer-Interview-Questions: OpenAI company interview guide](https://github.com/ombharatiya/AI-Engineer-Interview-Questions/blob/main/14-company-interview-questions/openai.md) — source for today's question plus the RAG-vs-fine-tuning, eval-regression, and prompt-injection concepts, with full walkthroughs and follow-up questions
- [Top 30 AI Agent Developer Interview Questions and Answers (2026) — Second Talent](https://www.secondtalent.com/interview-guide/ai-agent-developers) — the short-term/long-term memory split and the three moves for a full context window, with concrete framing
- [AI Agent Memory: How LLM Agents Manage State in Production — n8n Blog](https://blog.n8n.io/ai-agent-memory-how-llm-agents-manage-state-in-production) — grounds the short-term/long-term memory distinction in implementation detail

## References

- [AI-Engineer-Interview-Questions: OpenAI company interview guide](https://github.com/ombharatiya/AI-Engineer-Interview-Questions/blob/main/14-company-interview-questions/openai.md) — this engineer interview-prep guide is the source for today's practice question ("design a reliable tool-calling agent") and the RAG-vs-fine-tuning decision test, eval-as-regression-gate, and prompt-injection defense-in-depth concepts
- [Top 30 AI Agent Developer Interview Questions and Answers (2026) — Second Talent](https://www.secondtalent.com/interview-guide/ai-agent-developers) — source for the "short-term memory via checkpointer, long-term memory via store" separation
- [AI Agent Memory: How LLM Agents Manage State in Production — n8n Blog](https://blog.n8n.io/ai-agent-memory-how-llm-agents-manage-state-in-production) — supporting detail on the compact/offload/subagent moves for a full context window
- [50 LLM Interview Questions and Answers for 2026 — StrataScratch](https://www.stratascratch.com/blog/50-llm-interview-questions-and-answers) — background on context window and KV-cache memory constraints
