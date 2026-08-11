---
title: "Launch Is Where the Work Starts: Enterprise Agent Cases Read Sideways"
date: 2026-08-10
category: ai
type: deep-dive
tags: [ai-agent, harness-engineering, agentic-ai, orchestration, evaluation]
lang: en
series:
  name: "The Agent Production Line"
  order: 4
tldr: "Salesforce's number from 20,000 deployments: 90% of the work on an agent happens after launch, the reverse of traditional software. Stripe merges 1,300 PRs a week with no human-written code, and credits the environment rather than the model."
description: "Cross-reading six enterprise agent case studies — Salesforce, Stripe, Microsoft, Grab, Meta, OpenAI: the post-launch triage loop, unattended agent environment design, splitting read and write paths by risk profile, and rubric-based evaluation."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-10-enterprise-agent-case-studies)

The first three parts covered principles. This one looks at teams that actually pushed agents into production — [Salesforce](https://blog.bytebytego.com/p/what-salesforce-learned-from-20000) (20,000 enterprise deployments), [Stripe](https://blog.bytebytego.com/p/how-stripes-minions-ship-1300-prs), [Microsoft](https://blog.bytebytego.com/p/how-microsoft-ships-ai-agents-at), [Grab](https://blog.bytebytego.com/p/how-grab-is-using-ai-agents-to-boost), [Meta](https://blog.bytebytego.com/p/how-meta-uses-ai-agents-for-data), and [OpenAI's data platform](https://blog.bytebytego.com/p/how-openai-built-its-data-agent).

## Salesforce: 90% of the work happens after launch

This is the most counter-intuitive number in the corpus, and they consider it the root cause of most enterprise agent failures — teams carry over the traditional software rhythm and assume shipping is the finish line.

**Only three things matter before launch**: keep the scope small ("don't boil the ocean"), commit to one KPI (they use containment rate — the share fully resolved with no human follow-up), and stand up the trust layer (input guardrails covering safe retrieval and data-residency boundaries; output guardrails covering tool validation, grounding checks and content filtering).

**After launch it runs on a four-way triage loop:**

| Symptom | Where to fix it |
|---|---|
| Wrong tone | Change the system prompt |
| Logic error | Check tool configuration; if it recurs, convert to a deterministic script |
| Data quality | Not an agent problem — go back to the document owner |
| Coverage gap | Extend scope, or build a clean human escalation path |

**The speed of that loop is the gate on whether you can scale.** Worth recording on its own: what limits how big you can go is not model capability but the cycle time from noticing a problem to fixing it.

One detail rarely discussed elsewhere: their **data masking is off by default**, because masking strips the very context the agent needs to reason. That is a genuine security/usability conflict, and most write-ups avoid it.

### Intercom supplies the other half: don't use resolution rate

[Intercom](https://www.intercom.com/blog/whats-new-with-fin-3/) reports Fin 2 averaging 66% resolution across 6,000+ customers, with over 20% of customers above 80%. And then says the metric is insufficient:

> Answering a quick FAQ in a chat is not the same as investigating a payment dispute or verifying a refund over the phone. Both count as "resolved," but the work involved is very different.

They track **automation rate** instead — how much of your total workload the agent handles end to end. This is the same insight as Salesforce's Agentic Work Units, reached separately: **don't measure interactions or resolutions, measure work actually completed.**

## Stripe: agents nobody is watching

Over 1,300 PRs merged per week with zero human-written code. The most valuable contribution of the piece is a distinction: **attended versus unattended**. Cursor and Claude Code have someone watching and correcting in real time. Minions have nobody watching — they receive a task and deliver. That difference changes every downstream design requirement.

The difficulty is not trivial: hundreds of millions of lines of code, Ruby plus Sorbet (a combination rare in LLM training data), heavy internal library use, and a production environment handling over a trillion dollars a year.

- **Environment before model**: devboxes boot in ten seconds off a pool of pre-warmed machines, running in a QA environment already isolated from production — **so the agent executes with full permissions and needs no confirmation prompts at all**. The blast radius is one disposable machine. The key line: "Stripe didn't build this for agents. They built it for humans. What's good for humans is good for agents."
- **Scope your rules, don't globalize them**: they are "very deliberate" about global rules, because global rules fill the context window before the agent starts working. Rules are bound to specific subdirectories and file patterns instead, so the agent picks them up as it moves — and the same rule files serve both Cursor and Claude Code, with no duplicated maintenance
- **Fewer tools by default**: nearly 500 tools hosted over MCP, but Minions get a small subset by default and engineers add more on demand
- **Layered feedback**: local lint under five seconds (a background daemon pre-computes applicable rules and caches them) → CI selectively runs from over three million tests, auto-fixing known failure patterns → still failing, give the agent one more shot
- **A hard ceiling**: **at most two CI rounds, then it goes back to a human.** LLMs hit diminishing returns retrying the same problem. "Knowing when to stop is as important as knowing how to start"

That scoped-rules recommendation is the corpus's most direct answer to "is a longer `CLAUDE.md` better?" — no, and the problem is not content quality but that it occupies budget unconditionally.

## Grab and Meta: two architectures found nowhere else

**Grab splits by risk profile** — the only case I found that explicitly divides the architecture along read versus write:

- **Investigation path (read-only, 4 agents)**: Classifier (parses the question, extracts entities, detects guardrail violations like PII, decides which specialist agents in which order, **and emits its routing rationale for debugging**) → Data Agent → Code Search Agent → On-call Agent → Summarizer
- **Enhancement path (write, 1 agent)**: **every stage requires human approval**, because it touches production pipelines

The design philosophy is "decoupling the brain from the hands," which means that when something breaks you can immediately separate reasoning errors from tool-interaction errors. They also honestly record that the system demoed well and then **six things broke in production**.

**Meta has data-user agents negotiate data access approval with data-owner agents.** The data-user agent has three sub-agents behind a triage layer, and the most interesting is **alternative-suggestion**: when you request a sensitive table, it proposes a table with similar but non-sensitive data, and will even rewrite your query to use only unrestricted columns. Their observation is good — **this kind of tribal knowledge previously lived only in the heads of a few senior engineers, and an agent now synthesizes it.**

Another sub-agent handles low-risk exploration: most people don't need full permissions on a whole dataset while exploring, so temporary partial sample access will do.

## Microsoft: the harness dissected

Five layers: Inference (11,000+ swappable models) → Runtime (framework-neutral) → Observability & Governance → Identity → Context.

Three points worth recording separately:

- **Retrieval-as-a-subagent** — wrap retrieval in a small agent: plan which sources → execute → evaluate against the original question → decide whether to return, rewrite the query, or switch sources. The notable part is that **when iterations run out it returns a structured "I don't know"** rather than a plausible-sounding wrong answer
- **Agents need their own identity** — a class of principal in Entra, with role assignments and an audit trail. Otherwise your logs just say "the AI did it," and there is nothing to trace
- **Move guardrails to the tool boundary** — a chatbot only screens user input and model output; an agent also reads tool output and retrieved documents, which is where indirect injection hides (expanded in [Part 5](/posts/ai/2026-08-10-agent-security-harness-layer-en))

## Knowing whether it got better

Microsoft's **rubric-based eval** solves a real problem: generic metrics (groundedness, coherence) tell you whether the agent works, not whether it did the right thing. Their example is a restaurant-booking agent — it successfully made a reservation, but did it confirm the time? Did it check availability first? So they use yes/no rubric items, then hand off to an Agent Optimizer that automatically adjusts prompts, swaps models and tunes tools, generating several candidate versions in parallel, scoring them against the rubric, and promoting the best.

[DoorDash](https://blog.bytebytego.com/p/how-doordash-built-a-testing-system) offers a full **simulation and evaluation flywheel**: an offline simulator **generates realistic multi-turn support conversations from historical transcripts** (never touching real customers), paired with an automatic scoring framework. The cycle is — find a problem → write an eval capturing that failure mode → one job triggers the whole pipeline → change the prompt or architecture → re-run and check whether the pass rate moved → deploy only above threshold.

Their framing of the underlying problem is worth keeping: **hallucination here is not dramatic fabrication, it is "the source data was right there in the context, but there was so much of it the model read it wrong"** — which loops straight back to [Part 3](/posts/ai/2026-08-10-agent-context-memory-failure-en)'s "most failures are context failures."

## What converges

Six cases, six industries, and only a few things in common: **environment before model, more deterministic nodes is better, separate write paths from read paths, feedback-loop speed sets the ceiling on scale, and know when to stop.**

Not one of them puts the emphasis on model selection.

## The series

1. [Drawing the Lines: Agent, Workflow, RAG, and MCP](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries-en)
2. [The Model Is a Component, the Harness Is the System](/posts/ai/2026-08-10-model-component-harness-system-en)
3. [Context and Memory: Where Agents Actually Fail](/posts/ai/2026-08-10-agent-context-memory-failure-en)
4. **Launch Is Where the Work Starts: Enterprise Cases Read Sideways** (this post)
5. [Security: Prompt Injection Can Only Be Contained in the Harness](/posts/ai/2026-08-10-agent-security-harness-layer-en)
6. [The Protocol Layer: MCP, A2A, ACP, Skills](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer-en)
7. [Three Shapes of RAG and the Evaluator Paradox](/posts/ai/2026-08-10-rag-graph-agentic-variants-en)

## References

- [ByteByteGo — What Salesforce Learned from 20,000 Enterprise Agent Deployments](https://blog.bytebytego.com/p/what-salesforce-learned-from-20000)
- [ByteByteGo — How Stripe's Minions Ship 1,300 PRs a Week](https://blog.bytebytego.com/p/how-stripes-minions-ship-1300-prs)
- [ByteByteGo — How Microsoft Ships AI Agents at Enterprise Scale](https://blog.bytebytego.com/p/how-microsoft-ships-ai-agents-at)
- [ByteByteGo — How Grab is Using AI Agents to Boost Team Productivity](https://blog.bytebytego.com/p/how-grab-is-using-ai-agents-to-boost)
- [ByteByteGo — How Meta Uses AI Agents for Data Warehouse Access and Security](https://blog.bytebytego.com/p/how-meta-uses-ai-agents-for-data)
- [ByteByteGo — How OpenAI Built Its Data Agent](https://blog.bytebytego.com/p/how-openai-built-its-data-agent)
- [ByteByteGo — How DoorDash Built a Testing System to Evaluate LLMs](https://blog.bytebytego.com/p/how-doordash-built-a-testing-system)
- [ByteByteGo — A Guide to LLM Evals](https://blog.bytebytego.com/p/a-guide-to-llm-evals)
- [ByteByteGo — How Pinterest Built a Production MCP Ecosystem](https://blog.bytebytego.com/p/how-pinterest-built-a-production)
- [Intercom — What's new with Fin 3](https://www.intercom.com/blog/whats-new-with-fin-3/)
