---
title: "The Model Is a Component, the Harness Is the System"
date: 2026-08-10
category: ai
type: deep-dive
tags: [ai-agent, harness-engineering, llm, agentic-ai, orchestration]
lang: en
series:
  name: "The Agent Production Line"
  order: 2
tldr: "Microsoft, OpenAI, Salesforce, Stripe and three others independently say the same thing: reliability comes from the engineering around the model. And 'give the deterministic parts back to code' has been shipped as a product four separate times — Agent Script, Procedures, runtime, blueprints."
description: "Where seven companies converge on agent reliability, four productized designs for deterministic nodes, Salesforce's three anti-patterns from 20,000 deployments, and why LinkedIn rejected ReAct for plan-and-execute."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-10-model-component-harness-system)

[Part 1](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries-en) drew the workflow/agent line and left one thread hanging: compounding error means "a few more steps" is not linearly harder. This part covers the industry's shared answer to that.

Line up seven companies' own words and the convergence is hard to ignore.

## Seven companies, one sentence

| Source | In their words |
|---|---|
| [Microsoft](https://blog.bytebytego.com/p/how-microsoft-ships-ai-agents-at) | "harness matters as much as the model" |
| [OpenAI Codex](https://blog.bytebytego.com/p/how-openai-codex-works) | "the model is a component and the agent is the system" |
| [Salesforce](https://blog.bytebytego.com/p/what-salesforce-learned-from-20000) | "If you can draw it as a flowchart, it should be code, not a prompt" |
| [Stripe](https://blog.bytebytego.com/p/how-stripes-minions-ship-1300-prs) | "Don't start with model selection. Start with your dev environment, test infrastructure, feedback loops" |
| [OpenAI Data Platform](https://blog.bytebytego.com/p/how-openai-built-its-data-agent) | "Our agent is pretty vanilla — the reliability comes from the engineering around it" |
| [Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system) | Prompt design is the single largest lever in the system |
| [12-Factor Agents](https://github.com/humanlayer/12-factor-agents) | "Most products branding themselves as AI agents are not actually that agentic. A lot of them are mostly deterministic code, with LLM steps sprinkled in at just the right points" |

All seven share one editor, so "is this a narrative the editor imposed?" is a fair objection. Two things make it hard to sustain.

First, I went back to Dex Horthy's [12-Factor Agents](https://github.com/humanlayer/12-factor-agents). The framing genuinely originates with the author; it was not applied during the retelling.

Second, and more decisively — **the OpenAI Data Platform piece is the only one that argues itself out of a complex architecture**. Their agent is a single model plus context assembly, a curated tool set and a runtime. They **deliberately skip** routing, multi-model mixes, fine-tuning and elaborate retrieval pipelines, because each of those "adds cost, latency, and more ways to fail." And the scale this deliberately plain system carries is 1.5 EB of data, 90,000 datasets, around 4,000 internal users. A team volunteering "we didn't build any of the cool stuff" is hard to explain away as editorial storytelling.

## "Give the deterministic parts back to code," productized four times

Convergence on a slogan is worth little. What carries weight is that four companies each shipped the same idea as a product.

- **Salesforce's Agent Script** — TypeScript that says "if the intent matches X, skip the reasoning loop and run this tool sequence"
- **Intercom's Procedures** — natural-language reasoning wrapped in deterministic control: conditional steps at decision points, small code blocks guaranteed to produce identical output for identical input, and checkpoints that pause for human approval before sensitive actions
- **Microsoft's runtime** — only the parts that genuinely need reasoning reach the LLM
- **Stripe's blueprints** — a sequence of nodes where "implement the feature" and "fix the CI failure" get a full agentic loop, while **"run the linter" and "push the branch" are hard-coded**

Stripe's rationale is the most direct: some things should never be left to agent judgment, and every deterministic node is **one fewer place to go wrong**. Back to Part 1's compounding error — that directly shortens the chain that has to be entirely correct, and it compounds across hundreds of runs a day.

Four companies independently building structurally identical things is stronger evidence than seven quotes agreeing. Opinions can converge because people read each other. Products require engineering budget.

## Salesforce's three anti-patterns

From twenty thousand enterprise deployments. The first is the inverse of the previous section:

1. **Using LLM reasoning where code belongs**
2. **Escalating the tone of a prompt instead of encoding the rule as policy** — "NEVER" and "ALWAYS" in bold with exclamation marks do not work
3. **Poor context engineering** — their example is compressing a `get_orders` response from 100K tokens down to 2K

The second deserves an extra sentence. Shouting at a prompt is a natural instinct: the model ignored the rule, so say it louder. The failure mode is that it **appears to work** — the test passes afterwards, the rule stays in the prompt, and then some edge case comes along and the model ignores it again. Writing the same rule as a policy check in code costs about the same, and code doesn't have moods.

## The same principle at the loop layer: LinkedIn rejected ReAct

ReAct (thought → action → observation) is close to the default answer for agent loops. But [LinkedIn's Hiring Assistant](https://blog.bytebytego.com/p/how-linkedin-built-an-ai-powered) **explicitly rejected it** in favour of plan-and-execute: a Planner decomposes the request into a structured plan, and an Executor works through it step by step, each step running its own reasoning loop.

Their reason is blunt: "**LLMs become unreliable when asked to handle too many things at once.**"

That is the same principle as Agent Script and blueprints, applied one layer up — shrinking how much the model has to decide at once. A side benefit is cost control: expensive models for planning, cheap ones for simple steps.

This is the only substantive objection to ReAct from a production system I found anywhere in the corpus, which is worth recording, since most write-ups present ReAct as the general answer.

## So how do you improve an agent system

The convergence has a practical corollary: **swapping the model is usually the lowest-leverage move available.**

Microsoft puts it more bluntly — a model is not a database version. You can swap Postgres versions and expect things to keep working; you cannot do that with a model. Every model behaves differently and the harness needs retuning. Their example: when a new frontier model shipped, the GitHub Copilot CLI team had to retune and retest before they could ship it.

The leverage is elsewhere: the environment (Stripe, in Part 4), how context and memory are trimmed (Part 3), the speed of the feedback loop (Salesforce, in Part 4), and knowing when to stop and hand back to a human.

## The series

1. [Drawing the Lines: Agent, Workflow, RAG, and MCP](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries-en)
2. **The Model Is a Component, the Harness Is the System** (this post)
3. [Context and Memory: Where Agents Actually Fail](/posts/ai/2026-08-10-agent-context-memory-failure-en)
4. [Launch Is Where the Work Starts: Enterprise Cases Read Sideways](/posts/ai/2026-08-10-enterprise-agent-case-studies-en)
5. [Security: Prompt Injection Can Only Be Contained in the Harness](/posts/ai/2026-08-10-agent-security-harness-layer-en)
6. [The Protocol Layer: MCP, A2A, ACP, Skills](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer-en)
7. [Three Shapes of RAG and the Evaluator Paradox](/posts/ai/2026-08-10-rag-graph-agentic-variants-en)

## References

- [ByteByteGo — How Microsoft Ships AI Agents at Enterprise Scale](https://blog.bytebytego.com/p/how-microsoft-ships-ai-agents-at)
- [ByteByteGo — What Salesforce Learned from 20,000 Enterprise Agent Deployments](https://blog.bytebytego.com/p/what-salesforce-learned-from-20000)
- [ByteByteGo — How Stripe's Minions Ship 1,300 PRs a Week](https://blog.bytebytego.com/p/how-stripes-minions-ship-1300-prs)
- [ByteByteGo — How OpenAI Built Its Data Agent](https://blog.bytebytego.com/p/how-openai-built-its-data-agent)
- [ByteByteGo — How OpenAI Codex Works](https://blog.bytebytego.com/p/how-openai-codex-works)
- [ByteByteGo — How LinkedIn Built an AI-Powered Hiring Assistant](https://blog.bytebytego.com/p/how-linkedin-built-an-ai-powered)
- [ByteByteGo — Best Practices for Building AI Agents That Work in Production](https://blog.bytebytego.com/p/best-practices-for-building-ai-agents)
- [Anthropic — How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Dex Horthy — 12-Factor Agents](https://github.com/humanlayer/12-factor-agents)
- [Intercom — What's new with Fin 3](https://www.intercom.com/blog/whats-new-with-fin-3/)
