---
title: "AI Engineer Interview Daily — 2026-09-10: LLM & Agent Engineering"
date: 2026-09-10
category: daily
type: digest
tags: [ai-engineer-interview, daily, llm-engineering]
lang: en
description: "Today's LLM & Agent Engineering drill covers the architecture-judgment questions interviewers love in 2026: when to use RAG versus an agent, how guardrails split into offline evaluation and online interception, and how LLM-as-a-Judge and trajectory evaluation hold up production quality."
tldr: "This round of LLM & Agent Engineering focuses on the architecture decisions interviewers dig into most in 2026: RAG and agents aren't an either/or choice but a division of labor — RAG handles cited, grounded policy Q&A, while an agent only steps in when the task needs multi-step, cross-system actions. Guardrails split into offline evaluation (catching regressions before release) and online interception (blocking unsafe outputs in real time), governed by one core principle: the model proposes, and a deterministic system authorizes and executes. On evaluation, beyond standard LLM-as-a-Judge scoring, agents also need trajectory-based evaluation that checks each intermediate decision, not just the final answer. Today's practice question is a PracHub-compiled 'design an enterprise support agent' system design prompt, drilling how to separate the RAG path from the agent path and make the authorization layer the centerpiece of your answer."
series:
  name: "AI Engineer Interview Daily"
  order: 22
---

> 🌏 [中文版](/posts/daily/2026-09-10-ai-interview-daily)

## Today's Topic

Today is the LLM & Agent Engineering rotation. This round doesn't test whether you can wire up an LLM API — it tests whether you know when a task calls for RAG versus when it actually needs an agent, and whether you can keep a model's output from directly becoming a production-side action. By 2026, generative AI system design interviews rarely ask "build a chatbot" in isolation anymore. Instead you get prompts like "design a support system that answers policy questions and also helps users check orders and process refunds," and you're expected to assemble RAG, agents, guardrails, and evaluation into one system with a clear authorization boundary. This round shows up as a core onsite system design segment, and it's the line that separates "an engineer who can chain LLM calls" from "an engineer who'd actually trust an agent in production."

## Core Concepts Cheat Sheet

### The division of labor between RAG and agents

RAG and agents aren't two names for the same thing — they solve different shapes of task. RAG answers policy-type questions using retrieved, access-controlled, up-to-date documents, with citations attached. An agent only comes into play when a request genuinely needs multiple steps — checking an order status, confirming refund eligibility, then issuing the refund. Interviewers love using this question to check whether you reach for an agent by default: wrapping a simple lookup-and-answer task in an agent just adds latency and new failure points.

### Agentic RAG: treating retrieval as a callable tool

Classic RAG retrieves once and generates once. Agentic RAG treats retrieval as a tool the model can call on its own — the model decides whether it has enough evidence, and if not, issues a rewritten query and retrieves again, repeating until it's confident enough to generate a final answer. This design substantially cuts hallucinations on multi-hop questions, at the cost of more tokens and higher latency — a trade-off interviewers want to hear you reason through explicitly.

### Guardrails split into two layers: offline evaluation and online interception

Guardrails aren't a single checkpoint — they split into offline evaluation (catching regressions against a test set before release) and online interception (detecting and blocking or rewriting unsafe outputs in real time). The principle that runs through the whole system matters even more: model output is only a proposal. Authorization and execution belong to a deterministic system — the application layer validates the schema, checks the user's permissions, applies policy rules, assigns an idempotency key, and logs the result. The model itself never gets to directly trigger a state-changing action.

### LLM-as-a-Judge and trajectory-based evaluation

Human review is too slow and too expensive at scale, so production systems lean on LLM-as-a-Judge — another language model scores outputs at scale against criteria you define. But for agent systems, checking only the final answer isn't enough — you also need trajectory-based evaluation, which inspects every tool call and intermediate decision the agent made. An agent can stumble onto a correct final answer through a broken reasoning path, and that kind of "right for the wrong reason" is a landmine waiting to go off in production.

## Today's Practice Question

### The Question

Design a generative AI system for an enterprise support scenario: users can ask company policy questions (e.g. return rules, membership benefits), which the system must answer via RAG grounded in the latest, permission-controlled internal documents, with citations attached. When a user's request needs multiple steps to complete — checking order status, confirming refund eligibility, then actually issuing the refund — the system should switch into agent mode and plan and execute those steps itself. Explain: (1) what decision logic routes a request to the RAG path versus the agent path, (2) how the RAG ingestion and retrieval pipeline should be designed, (3) how guardrails and an authorization layer should be designed around the agent's tool calls (checking orders, issuing refunds) to prevent the model from directly executing unauthorized actions, and (4) how you'd evaluate the quality and safety of the overall system.

**Source**: PracHub Knowledge Hub (Generative AI System Design question compilation)　**Difficulty**: Intermediate　**Round**: onsite system design

### How to Break It Down

1. **Clarify first**: Confirm how often the internal documents update and what the access-control model looks like (do different users see different policy documents), whether the agent's action list has a cap on amount or risk, whether refunds need human review, and the overall latency and cost budget.
2. **Build a framework**: Split the system into two paths — a RAG path (retrieve + cited generation) and an agent path (plan + tool calls) — with a shared guardrails/authorization layer in between. Every state-changing action must pass through this layer before it's actually allowed to execute.
3. **Go deep on the core**: The key trade-off in this question is the design of the authorization layer — the model's output is only a "proposal." The deterministic system must validate the schema, check whether the user has permission to act on this order, apply policy rules (e.g. a refund amount cap), assign an idempotency key to prevent duplicate refunds, and log the full decision chain for later audit — rather than letting the LLM's output call the refund API directly.
4. **Close strong**: Wrap up with "how does this system prove it's safe" — an offline eval suite catching regressions, online guardrails intercepting in real time, trajectory-based evaluation checking whether each of the agent's tool calls made sense, plus full audit logging. This is exactly the "how do you know it isn't quietly doing something wrong" follow-up interviewers tend to ask.

### Sample Answer (What You'd Actually Say)

> **Framing the problem**: Before sketching the architecture, I'd confirm a few assumptions — internal policy documents update in near real time, and different user roles see different document scopes; the agent is limited to checking order status, confirming refund eligibility, and issuing refunds, with refunds above a certain threshold routed to human review. Given that scope, I'd split the system into a RAG path and an agent path, sharing one guardrails/authorization layer.
>
> **Core architecture**: Policy Q&A goes through RAG — documents are tagged with permissions during ingestion, chunked, embedded, and stored in a vector database that supports metadata filtering; queries are filtered by the user's permissions first, then retrieved and answered with citations. Requests needing multiple steps go to the agent — the LLM plans steps, calls tools to check the order, and determines refund eligibility, but every tool call first passes through the authorization layer: validate the input schema, check the user's permission on this specific order, apply policy rules (amount cap, frequency limit), assign an idempotency key, and only then actually call the refund API. If it fails validation, it's returned to the agent to re-plan or escalated to a human.
>
> **Evaluation and safeguards**: Before launch, I'd run an offline eval suite against the policy Q&A path for accuracy and citation rate to catch regressions, and add trajectory-based evaluation for the agent path, checking each tool call's parameters and ordering — not just whether the refund eventually went through. On top of that, real-time online guardrails would intercept clearly unreasonable outputs (e.g. an attempt to execute a refund outside the allowed amount range), and every decision that passes through the authorization layer gets logged in full, so it can be audited later or reviewed if a user appeals.

### Self-Check List

Use this table to check whether your answer covered the key points:

| Check item | Covered? |
|---------|---------|
| Clear decision logic routing between the RAG path and the agent path | |
| RAG ingestion, permission filtering, and cited generation design | |
| The authorization layer: model proposes vs. deterministic system executes (schema validation, permission checks, idempotency keys) | |
| Failure and escalation path for agent tool calls (e.g. routing to human review) | |
| Evaluation design: offline evals + online guardrails + trajectory-based evaluation | |
| Bonus: audit logging and user appeal mechanisms | |

## Further Reading

- [RAG Architecture in 2026: Patterns + Eval — FutureAGI](https://futureagi.com/blogs/rag-architecture-llm-2025) — A concrete breakdown of classic vs. agentic RAG and the trade-offs of multi-hop retrieval, useful for reinforcing the second core concept above.
- [AI System Design Interview Questions: ChatGPT, RAG, LLM Inference, and Agents — DEV Community](https://dev.to/arslan_ah/ai-system-design-interview-questions-chatgpt-rag-llm-inference-and-agents-1doi) — Covers additional system design prompts for LLM inference platforms and agent platforms, good for extra practice beyond today's question.

## References

- [Generative AI System Design Interview Questions: RAG, Agents, Evals, and Guardrails — PracHub Knowledge Hub](https://prachub.com/resources/generative-ai-system-design-interview-questions-rag-agents-evals-and-guardrails) — Source of today's practice question and the "model proposes, deterministic system executes" core principle.
- [AI Engineer Interview Questions 2026: RAG, Agents, Evals, and Production Systems — PracHub Knowledge Hub](https://prachub.com/resources/ai-engineer-interview-questions-2026-rag-agents-evals-and-production-systems) — Source for the discussion of LLM-as-a-Judge trust and release-gate design.
- [RAG Architecture in 2026: Patterns + Eval — FutureAGI](https://futureagi.com/blogs/rag-architecture-llm-2025) — Source for the definition of agentic RAG and the multi-hop retrieval trade-off.
