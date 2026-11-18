---
title: "AI Engineer Interview Drill — 2026-11-19: LLM & Agent Engineering"
date: 2026-11-19
category: daily
type: digest
tags: [ai-engineer-interview, daily, llm-engineering]
lang: en
description: "Thursday's topic is LLM & Agent Engineering: starting from a prompt about a coding agent that has to resume unfinished patch work in a new session, this drill practices separating an agent's durable context from its per-call context, and keeping tool execution inside a strict authorization boundary."
tldr: "Today's core idea is that resuming is not replaying the transcript: an agent picking up work in a new session has to re-validate whether its earlier assumptions still hold, not just trust what got saved. Tool-execution authorization has to stay in the application layer — retrieved text or user input must never be able to grant itself permission to call a tool — which is the key line that keeps prompt injection from turning into an action."
series:
  name: "AI Engineer 面試日練"
  order: 92
---

> 🌏 [中文版](/posts/daily/2026-11-19-ai-interview-daily)

## Today's Focus

Thursday is the fixed slot for LLM & Agent Engineering, and today narrows in on a scenario that comes up more and more but is rarely drilled properly: an agent isn't a one-shot run that finishes and disappears — it has to pick up unfinished work in a later, separate session. This isn't just a "how do you wire up RAG" question. It's about how you design the agent's context so that, when it resumes, it can tell which of its earlier decisions are still valid and which have gone stale.

What the interviewer is actually probing is whether you've thought through when a model should be allowed to decide its own next step versus when a fixed workflow is enough, whether you separate the agent's durable knowledge from the fresh context injected on each call, and — most critically — whether tool-call authorization stays firmly in the application layer instead of being bypassed by retrieved text or user input.

## Core Concepts, Fast

### Decide up front whether the model should pick its own next step

If a fixed workflow can solve the task, you don't need to escalate to a model deciding its own next step. Anthropic draws a clean line here: a predefined workflow fits tasks with predictable steps and bounded branching; model-directed execution is worth it only when the task genuinely needs dynamic judgment about what to do next. The point that scores well in interviews is explaining *why* this particular task needs agent autonomy, instead of defaulting to "agent" for everything.

### Separate durable project knowledge from per-call context

What an agent needs to remember long-term — repo state, decisions already made, task progress — is a different kind of thing from the fresh information injected into the prompt on a given call, and the two should be managed separately. More importantly: a saved conclusion is not proof that it still holds. On resume, you re-check the current repository state and the original decision sources to confirm last time's assumptions are still valid, instead of trusting whatever the transcript says. This is exactly what Anthropic's context-engineering writing emphasizes: context selection and revalidation, not just context storage.

### Tool-execution authorization can't be delegated to retrieved text

Retrieved content — documents, code, user input — is untrusted input. Even if it literally says "run this command," it still must not be able to grant itself permission to call a tool. This is the core of what OWASP defines as prompt-injection risk: authorization logic belongs in application and tool-execution code, and the decision to execute can never be outsourced to the content of a prompt. A common way to lose points here is saying "I'd add prompt guardrails" without being able to name which layer of code actually enforces the boundary.

### Evaluate RAG in two separate layers: retrieval and generation

A wrong RAG answer doesn't automatically mean the generation step is at fault. Check first whether the required evidence was even retrieved (evidence recall), then check whether the generated answer is faithful to what was retrieved. An answer can be completely faithful to a retrieved document that's simply the wrong one — and still be wrong. That failure belongs back in retrieval, not in prompt tuning. When using a model as judge, calibrate it against human-labeled examples first, and inspect the disagreements one by one.

### Bound the agent's steps, and make tool calls safe to retry

Every step the agent takes needs an upper bound — a step limit, a tool-call budget — so it can't spiral into an infinite loop or a runaway chain of calls. For actions that can be retried, use an idempotency mechanism, and after a timeout, check the authoritative outcome instead of blindly retrying a side effect that may have already succeeded. Checkpoints need to live outside the conversation history, so that even if the agent is interrupted right after a tool call succeeds but before the checkpoint is saved, the next session can correctly tell whether that step actually completed.

```flow-diagram
{
  "title": "Context validation and authorization flow when an agent resumes",
  "lang": "en",
  "width": 560,
  "height": 760,
  "nodes": [
    {"id": "resume", "label": "Resume starts\nLoad durable knowledge: repo state, past decisions, task state", "x": 280, "y": 50, "w": 260},
    {"id": "revalidate", "label": "Re-validate assumptions\nCheck against current repository state; flag stale decisions", "x": 280, "y": 200, "w": 260, "tone": "accent"},
    {"id": "propose", "label": "Model proposes next step\nWithin a predefined authorization boundary", "x": 280, "y": 350, "w": 260},
    {"id": "execute", "label": "Application authorizes and executes the bounded tool call\nWith an idempotency key; retrieved text never grants execution rights", "x": 280, "y": 500, "w": 260},
    {"id": "checkpoint", "label": "Validate the result\nOnly checkpoint (outside the transcript) on success; otherwise stop", "x": 280, "y": 650, "w": 260}
  ],
  "edges": [
    {"from": "resume", "to": "revalidate", "step": 1, "label": "Resuming is not trusting last time's conclusion"},
    {"from": "revalidate", "to": "propose", "step": 2, "label": "Only let the model decide once context is confirmed valid"},
    {"from": "propose", "to": "execute", "step": 3, "label": "Authorization logic stays in the app / tool-execution layer"},
    {"from": "execute", "to": "checkpoint", "step": 4, "label": "Checkpointing outside the transcript makes progress correctly recoverable"}
  ],
  "steps": [
    "On resume, first load the durable project knowledge — current repo state, the decision record left by earlier sessions, and task progress. This long-lived knowledge is managed separately from the fresh context injected on each individual call.",
    "Don't trust last time's saved conclusion directly: re-check the current repository state and the original decision sources to confirm whether the earlier assumptions still hold, and flag any that have gone stale.",
    "Only once the context is confirmed trustworthy does the model get to propose its next step, within a predefined authorization boundary (reading a file, editing a branch, and deploying are different authorization tiers).",
    "The application is responsible for checking authorization and executing this bounded tool call, using an idempotency key to make retryable actions safe. Retrieved code or document content never gets to grant itself execution rights, no matter what instructions it contains; only a validated success gets checkpointed, otherwise the agent stops and waits for a human call."
  ],
  "caption": "Simplified for clarity: retry limits and exception-handling details are omitted. The two boundaries that matter are \"resuming means re-validating, not replaying\" and \"authorization stays in the application layer.\""
}
```

## Today's Practice Question

### The Question

Atlas is a support software product. The team wants to add a coding assistant that investigates integration-test failures, proposes patches, and needs to be able to resume unfinished work in a later session. Describe how you'd design its context architecture so that, on resume, it can correctly tell which earlier decisions are still valid and which have expired, and explain how you'd bound what it's allowed to do.

**Source**: Rany ElHousieny — AI System Design Interview Questions (the author is a senior hiring manager; all six scenarios in the piece are explicitly labeled practice material, not verbatim candidate transcripts) **Difficulty**: Advanced **Round**: Onsite AI system design, agent-architecture deep-dive follow-up

### How to Break It Down

1. **Clarify the problem first**: Where does this agent's authority end — are reading files, committing to a branch, and triggering a deployment the same authorization tier or different ones? Does this task genuinely need a model deciding its own next step, or would a fixed workflow suffice? And does "resuming work" mean replaying the previous transcript, or re-validating the previous conclusions?
2. **Build a framework**: Separate the agent's durable knowledge (repo, existing decisions, task state) from the fresh context injected on each call (latest tool output). Once the model proposes a next step, the application is responsible for authorizing and executing it, validating the result, and only then deciding whether to checkpoint or stop.
3. **Go deep on the core**: On resume, don't trust the saved conclusion directly — reload the relevant files and decision sources and check them against the current repository state to confirm the assumption still holds. Authorization logic lives in the tool-execution layer's code; retrieved code or document content can never acquire execution rights. Steps and tool calls need hard limits, retryable actions need an idempotency key, and checkpoints live outside the transcript so the "tool call succeeded but wasn't checkpointed yet" interruption case resolves correctly.
4. **Close strong**: Collapse the whole answer into one line — "resuming means re-validating, not replaying" — then add one more: "relevance scoring alone can't guarantee that genuinely required context gets selected; the rules that must always hold (like 'this file must never be dropped') should be hard-coded, not left to a relevance score to decide."

### A Sample Answer (how you'd actually say this in an interview)

> **First I'd pin down the authorization boundary.** I'd ask exactly what this assistant is allowed to do — reading files, branching and editing code, versus actually triggering a deployment, are three very different authorization tiers, and I wouldn't assume they share one permission model. Then I'd figure out whether this task genuinely needs the model choosing its own next step, or whether a fixed workflow handles most of it, only handing control to the model where dynamic judgment is actually required.
>
> **For the core of the design, I'd handle context and authorization together.** I'd keep long-lived knowledge — current repo state, past decisions, task progress — separate from the fresh context injected on each call, and on resume I wouldn't trust the last saved conclusion directly: I'd reload the relevant files and check them against the current repository state to confirm the assumptions haven't gone stale. Tool-execution authorization lives in application and tool-execution code — even if a file or a PR description literally contains a command, it can't acquire execution rights from that. That's the core line that keeps prompt injection from becoming an action.
>
> **To close, I'd handle interruption and recovery.** Steps and tool calls get hard limits, retryable actions use an idempotency key, and checkpoints live outside the transcript. I'd specifically test the case where a tool call succeeds but the checkpoint hasn't been saved yet when the agent is interrupted, to confirm the next session doesn't re-run the same action. I'd also keep an explicit hard-coded list for context that must always be loaded regardless of relevance score, so genuinely critical information doesn't get dropped just because it scores low on keyword relevance.

### Self-Check

Use this table to check whether your answer covered the key points:

| Checklist item | Covered? |
|---|---|
| Decided up front whether this task needs a model-directed next step or a fixed workflow is enough | |
| Separated durable project knowledge from the fresh per-call context | |
| Explained that resuming means re-validating assumptions, not trusting the saved conclusion | |
| Explained that tool authorization stays in the app / tool-execution layer and retrieved content can't grant execution rights | |
| Covered step/tool-call budget limits, idempotent retries, and checkpoints stored outside the transcript | |
| Bonus: distinguished "context selected by relevance score" from "context that must be included by rule" | |

## Further Reading

- [AI System Design Interview Questions: Explain the Decisions Behind the Diagram — Rany ElHousieny](https://ranyel.medium.com/ai-system-design-interview-questions-with-examples-1da61fa425e8) — the full scenario this drill is drawn from; the other five scenarios cover enterprise RAG, secure multi-tenant retrieval, exact-ID lookups, and pre/post-deployment evaluation
- [Anthropic: Effective context engineering for AI agents](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents) — concrete practices for context selection, compaction, and structured notes in long-running tasks
- [LangChain Interview Questions (2026) — CoPilot Interview](https://copilotinterview.com/blog/langchain-interview-questions) — 30 questions on LangChain 1.x's `create_agent`, checkpointers, and human-in-the-loop, useful for the implementation side of agent frameworks

## References

- [AI System Design Interview Questions: Explain the Decisions Behind the Diagram — Rany ElHousieny](https://ranyel.medium.com/ai-system-design-interview-questions-with-examples-1da61fa425e8) — source of today's practice question (scenario 6, an agent resuming unfinished work), explicitly labeled practice material by the author
- [Anthropic: Building effective agents](https://www.anthropic.com/research/building-effective-agents) — source for the predefined-workflow vs. model-directed-execution distinction in "decide up front whether the model should pick its own next step"
- [Anthropic: Effective context engineering for AI agents](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents) — source for the context selection and revalidation discussion in "separate durable project knowledge from per-call context"
- [OWASP: LLM01 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) — source for the indirect prompt-injection risk definition in "tool-execution authorization can't be delegated to retrieved text"
- [Ragas: Faithfulness metric](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/) — source for the faithfulness definition in "evaluate RAG in two separate layers"
