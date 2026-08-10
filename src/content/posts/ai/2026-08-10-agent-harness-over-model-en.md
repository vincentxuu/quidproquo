---
title: "The Model Is a Component, the Harness Is the System: What Survived 60 Enterprise Agent Case Studies"
date: 2026-08-10
category: ai
type: deep-dive
tags: [ai-agent, harness-engineering, context-engineering, multi-agent, llm, security]
lang: en
tldr: "Salesforce, Microsoft, Stripe, OpenAI and Anthropic independently converge on one claim: reliability comes from the engineering around the model, not the model. And 'give the deterministic parts back to code' has now been productized four separate times. Plus five numbers you should not cite."
description: "Harness engineering distilled from 60 ByteByteGo agent articles and 19 primary sources: where seven companies converge, four productized deterministic-node designs, Salesforce's three anti-patterns, why prompt injection can only be contained at the harness layer, and which cited numbers fail verification."
draft: false
glossary:
  - term: "unattended agent"
    definition: "An agent that receives a task and runs to delivery with nobody watching or correcting it along the way."
    advanced: "The counterpart to an attended agent (Cursor, Claude Code). With no human in the loop, environment isolation, permission boundaries, feedback loops and stopping conditions all have to be designed up front."
    context: "This post uses Stripe's Minions as the example — running in a QA environment already isolated from production, which is why they can execute with full permissions and no confirmation prompts."
  - term: "containment rate"
    definition: "The share of support conversations an agent fully resolves with no human follow-up."
    advanced: "Salesforce uses it as their single KPI. Intercom argues it is insufficient — a quick FAQ and a payment dispute both count as 'resolved' despite very different workloads — and tracks automation rate instead."
    context: "Used here to illustrate the 'commit to exactly one KPI before launch' practice."
---

> 🌏 [中文版](/posts/ai/2026-08-10-agent-harness-over-model)

[ByteByteGo](https://blog.bytebytego.com/) has accumulated roughly sixty articles directly about AI agents across 2025 and 2026. The most valuable thread running through them is not the concept diagrams — it is the **first-hand interviews with engineering leaders**: Salesforce's Agentforce CPO, Microsoft's Core AI product VP, a LinkedIn Distinguished Engineer, OpenAI's engineering team. Read that thread horizontally and seven independent cases converge on a single sentence.

This piece covers what that sentence is, what it looks like architecturally, and — because I followed the citation chain back to nineteen primary sources — **which numbers you should not repeat**.

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

All seven share one editor, so "is this a narrative the editor imposed?" is a fair objection. I went back to Dex Horthy's [12-Factor Agents](https://github.com/humanlayer/12-factor-agents) and confirmed the framing genuinely originates with the author, not the write-up. More decisively, the OpenAI Data Platform piece is **the only one that argues itself out of a complex architecture**. Their agent is a single model plus context assembly, a curated tool set and a runtime. They **deliberately skip** routing, multi-model mixes, fine-tuning and elaborate retrieval pipelines, because each of those choices "adds cost, latency, and more ways to fail." That kind of self-restraint is hard to explain away as editorial storytelling.

## "Give the deterministic parts back to code" has been productized four times

Convergence on a slogan is cheap. What gives this weight is that four companies independently shipped the same idea as a product.

- **Salesforce's Agent Script** — TypeScript that says "if the intent matches X, skip the reasoning loop and run this tool sequence"
- **Intercom's Procedures** — natural-language reasoning wrapped in deterministic control: conditional steps at decision points, small code blocks guaranteed to produce the same output for the same input, and checkpoints that pause for human approval before sensitive actions
- **Microsoft's runtime** — only the parts that genuinely need reasoning go to the LLM
- **Stripe's blueprints** — a sequence of nodes where "implement the feature" and "fix the CI failure" get a full agentic loop, while **"run the linter" and "push the branch" are hard-coded**

Stripe gives the cleanest rationale: some things should never be left to agent judgment, and every deterministic node is **one fewer place to go wrong** — which compounds across hundreds of runs a day.

Read from the other direction, the first of Salesforce's three anti-patterns (drawn from twenty thousand enterprise deployments) is exactly the inverse:

1. **Using LLM reasoning where code belongs**
2. **Escalating the tone of a prompt instead of encoding the rule as policy** — "NEVER" and "ALWAYS" in bold with exclamation marks do not work
3. **Poor context engineering** — their example is compressing a `get_orders` response from 100K tokens down to 2K

The same principle holds at the loop level. [LinkedIn's Hiring Assistant](https://blog.bytebytego.com/p/how-linkedin-built-an-ai-powered) **explicitly rejected ReAct** in favour of plan-and-execute: a Planner decomposes the request into a structured plan, and an Executor works through it step by step, each step running its own reasoning loop. Their reason: "**LLMs become unreliable when asked to handle too many things at once.**" A side benefit is cost control — expensive models for planning, cheap ones for simple steps. ReAct is usually treated as the default answer for agent loops; this is the only substantive objection from a production system I found anywhere in the corpus.

## Why the harness beats the model: three mechanisms

This is not a vague "engineering matters" claim. Three concrete mechanisms sit underneath it.

**First, compounding error.** At 95% per-step accuracy, ten steps leave you at roughly 60% and twenty steps at roughly 36%. This also explains something widely misread: **coding agents work better than open-ended agents not because code is easier, but because test feedback raises per-step reliability — which effectively shortens the chain that has to be entirely correct.**

**Second, most failures are context failures, not intelligence failures.** [Chroma's context rot study](https://research.trychroma.com/context-rot) evaluated 18 frontier models and found all of them degrade as input grows — and the degradation is a cliff, not a slope. Add lost-in-the-middle attention and the fact that models are entirely stateless between calls, and the closing line of [ByteByteGo's context engineering guide](https://blog.bytebytego.com/p/a-guide-to-context-engineering-for) is worth copying down:

> Once models are good enough, most failures stop being intelligence failures and become context failures — the model would have done the right thing, but it didn't receive what it needed, or received too much of what it didn't.

**Third, memory failures are usually retrieval failures in disguise.** [The memory piece](https://blog.bytebytego.com/p/how-ai-agents-manage-memory-and-avoid) offers a good thought experiment: an agent with a perfect database and bad retrieval often loses to one with no memory that is honest about its own limits — because the first will confidently stack stale information as if it were ground truth. It also gives the most complete decomposition on the site, along two orthogonal axes: **tier** (context window → session → long-term store → cold archive) × **type** (working / episodic / semantic / procedural).

Relatedly, the cost structure of long context is widely misunderstood. [The KV cache piece](https://blog.bytebytego.com/p/why-an-llms-memory-gets-expensive) points out that during decoding, every generated token requires reading **the entire cache** from memory into compute — **so it is a bandwidth cost, not merely a storage cost**. That is why a request that "clearly fits" can still be slow.

## Launch is where the work starts

The most counter-intuitive number in the Salesforce piece: **90% of the work on an agent happens after launch**, the reverse of traditional software. They consider this the root cause of most enterprise agent failures — teams carry over the old rhythm and assume shipping is the finish line.

Only three things matter before launch: keep the scope small ("don't boil the ocean"), commit to one KPI (they use containment rate — the share fully resolved with no human follow-up), and stand up the trust layer. After launch, everything runs through a four-way triage loop:

| Symptom | Where to fix it |
|---|---|
| Wrong tone | Change the system prompt |
| Logic error | Check tool configuration; if it recurs, convert to a deterministic script |
| Data quality | Not an agent problem — go back to the document owner |
| Coverage gap | Extend scope, or build a clean human escalation path |

**The speed of that loop is the gate on whether you can scale.** One detail rarely discussed elsewhere: their **data masking is off by default**, because masking strips the very context the agent needs to reason.

Intercom supplies the other half of the same point — **don't use resolution rate as your KPI**. They report Fin 2 averaging 66% resolution but argue the metric is insufficient: "Answering a quick FAQ in a chat is not the same as investigating a payment dispute or verifying a refund over the phone. Both count as 'resolved,' but the work involved is very different." They track **automation rate** instead: how much of your total workload the agent handles end to end. This is the same insight as Salesforce's Agentic Work Units, arrived at separately.

## Agents nobody is watching: how Stripe does it

Stripe merges over 1,300 PRs a week with zero human-written code. The most useful contribution of that piece is a distinction: **attended versus unattended**. Cursor and Claude Code have someone watching, correcting in real time. Minions have nobody watching — they receive a task and deliver. That difference changes every downstream design requirement.

- **Environment before model**: devboxes boot in ten seconds off a pool of pre-warmed machines, running in a QA environment already isolated from production — **so the agent runs with full permissions and needs no confirmation prompts at all**. The blast radius is one disposable machine. The line worth remembering: "Stripe didn't build this for agents. They built it for humans. What's good for humans is good for agents."
- **Scope your rules, don't globalize them**: they are "very deliberate" about global rules, because global rules fill the context window before the agent has started working. Rules are bound to specific subdirectories and file patterns instead, so the agent picks them up as it moves
- **Fewer tools by default**: nearly 500 tools are hosted over MCP, but Minions get a small subset by default and engineers add more on demand
- **A hard ceiling**: at most two CI rounds, then it goes back to a human — LLMs hit diminishing returns retrying the same problem. "Knowing when to stop is as important as knowing how to start"

Two architectural patterns found nowhere else in the corpus are worth noting too. [Grab](https://blog.bytebytego.com/p/how-grab-is-using-ai-agents-to-boost) splits its system by risk profile: a read-only investigation path where four agents run freely, and a write path with a single agent where **every stage requires human approval**. Their design philosophy is "decoupling the brain from the hands," which means that when something breaks you can immediately tell reasoning errors from tool-interaction errors. They also honestly record that the system demoed well and then **six things broke in production**.

[Meta](https://blog.bytebytego.com/p/how-meta-uses-ai-agents-for-data) has data-user agents negotiate data access approval with data-owner agents. The most interesting sub-agent: when you request a sensitive table, it proposes an alternative table with similar but non-sensitive data, and will even rewrite your query to use only unrestricted columns — **knowledge that previously lived only in the heads of a few senior engineers, now synthesized by an agent**.

## Security is the one line that can only be solved in the harness

If the previous sections still leave room for "a stronger model would fix this," security closes it.

The root cause is a single sentence: **an LLM receives instructions and data as the same token stream, with nothing in the sequence marking which is which.** Parameterized queries solved this at the database boundary. Natural language has no equivalent, because instructions and information are both expressed as text.

This is not merely unsolved — it has been seriously attempted and has failed. In November 2025, joint research from OpenAI, Anthropic and Google DeepMind **broke all 12 previously proposed prompt-injection and jailbreak defenses** when attacks were allowed to adapt iteratively. Earlier, EchoLeak ([CVE-2025-32711](https://nvd.nist.gov/vuln/detail/CVE-2025-32711)) let a single email make M365 Copilot exfiltrate internal company files with zero user interaction — and **that payload passed Microsoft's own dedicated cross-prompt-injection classifier**.

So the realistic goal is not blocking every attack but **surviving the ones that land**. That is harness work:

- **The lethal trifecta** — real damage requires three things at once: access to private data, exposure to untrusted content, and an outbound channel. Removing any one reduces exposure, and **cutting the outbound channel or narrowing access is usually cheaper than strengthening filters**
- **Meta's Agents Rule of Two** — without a human in the loop, an agent should satisfy at most two of the three dangerous properties. Meta describes this as a complement to least privilege, not a complete answer
- **Move guardrails to the tool boundary** (Microsoft) — a chatbot only needs to screen user input and model output; an agent also reads tool output and retrieved documents, which is exactly where indirect injection hides
- **GitHub's agentic workflow architecture is designed on the assumption that the agent is already compromised**: three mutually independent layers of defense, a zero-secret architecture (outbound traffic through a firewall container, MCP tools through a gateway that exclusively holds the PAT, LLM calls through a proxy — the agent never touches a secret), and the distinctive piece, **safe outputs** — the MCP server gives the agent read-only access, all writes go to a separate server that **only buffers, never executes**, and the buffered changes run through a deterministic pipeline afterwards (type allowlist → count limits → content scrubbing)

That piece also leaves a line whose reach extends well beyond security: "**Every point where you can observe communication is also a point where you can later intervene. Today's observability is tomorrow's control plane.**" They also candidly note this is damage control rather than prevention, and that deterministic output review only catches patterns someone thought of in advance.

## Before you cite: five numbers to avoid

The value of this corpus is in helping you find which primary material to read, and in giving you a structure to hang things on. But **it is not a citation source**. I checked nineteen primary sources and about forty verifiable claims. Roughly 70% are clearly correct — but the failures have a very consistent shape.

| Claim | Verification |
|---|---|
| Multi-agent burns "15× the tokens of a single-agent approach" | ❌ [Anthropic's original](https://www.anthropic.com/engineering/multi-agent-research-system) says multi-agent ≈ 15× **standard chat**, single agent ≈ 4× chat. Against a single agent it is roughly **3.75×** — overstated about fourfold |
| Klarna's AI support handled 2.3M conversations in month one | ⚠️ The figure is real (Feb 2024 press release), but **Klarna's CEO publicly reversed course in May 2025** and began rehiring human agents: "cost seems to have been a too predominant evaluation factor... what you end up having is lower quality." 2026 articles still cite it as a success |
| "AI generates over 75% of new code at Google" | 🔴 No traceable source. The public official numbers are "over 25%" (Oct 2024) and "over 30%" (Apr 2025) |
| Chroma: "some models hold 95% accuracy then fall to 60% past a length threshold" | 🔴 Neither "95%" nor "60%" appears anywhere in the 62,000-character original. It looks eyeballed off a chart |
| "The METR/Anthropic RCT showed experienced developers were 19% slower" | ⚠️ The 19% is right, but [METR](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study) is an independent non-profit, not a co-author with Anthropic — and the original explicitly says the cause is uncertain. "The culprit is under-verified over-reliance" was added by the writer |

Four failure shapes are worth recording separately, because they are not unique to this one source:

1. **Caveats fall off** — "internal eval," "95% CI of [-40%, -2%]," "single agent ≈ 4× chats" all vanish. A number stripped of its comparison anchor is the easiest thing to misread
2. **Mechanism gets compressed into conclusion** — Anthropic wrote that three factors explain 95% of performance variance on BrowseComp, with token usage alone explaining 80%. That became "improvement correlates strongly with token usage." The reader gets a conclusion but loses the basis for judging whether it applies to them
3. **Causation gets supplied** — the study says the cause is unknown; the retelling says "the culprit is X"
4. **The story stops where it flatters the argument** — Klarna is the clearest case

Walking up the citation chain usually pays. Three times it led somewhere better than the retelling: Anthropic's "token usage alone explains 80% of variance," Cognition's April 2026 revision of its own June 2025 position ("keep writes single-threaded; additional agents contribute intelligence, not actions"), and UC Berkeley's [MAST paper](https://arxiv.org/abs/2503.13657) — 1,642 annotated execution traces across seven open-source multi-agent frameworks, reporting failure rates between **41% and 86.7%**. That is the most solid multi-agent dataset I hit anywhere in this corpus, and it is never cited.

## The trade-off

If you keep one line: **agent reliability comes almost entirely from outside the model** — the environment, the deterministic nodes, how context is trimmed and scoped, how fast the feedback loop runs, and knowing when to stop and hand back to a human.

That has a practical corollary: when you want to improve an agent system, **swapping the model is usually the lowest-leverage move available**. Microsoft goes further and warns that a model is not a database version — you can swap Postgres versions and expect things to keep working, but every model swap needs retuning and retesting.

As for the corpus itself, the correct use is as an index: let it tell you which primary material to read, then go read it. Once you need a specific number, the cost of going to the source is far lower than the cost of citing it wrong.

## References

- [ByteByteGo — What Salesforce Learned from 20,000 Enterprise Agent Deployments](https://blog.bytebytego.com/p/what-salesforce-learned-from-20000)
- [ByteByteGo — How Microsoft Ships AI Agents at Enterprise Scale](https://blog.bytebytego.com/p/how-microsoft-ships-ai-agents-at)
- [ByteByteGo — How Stripe's Minions Ship 1,300 PRs a Week](https://blog.bytebytego.com/p/how-stripes-minions-ship-1300-prs)
- [ByteByteGo — How OpenAI Built Its Data Agent](https://blog.bytebytego.com/p/how-openai-built-its-data-agent)
- [ByteByteGo — How OpenAI Codex Works](https://blog.bytebytego.com/p/how-openai-codex-works)
- [ByteByteGo — The Agent Loop: How AI Goes From Answering Questions to Doing Things](https://blog.bytebytego.com/p/the-agent-loop-how-ai-goes-from-answering)
- [ByteByteGo — A Guide to Context Engineering for LLMs](https://blog.bytebytego.com/p/a-guide-to-context-engineering-for)
- [ByteByteGo — How AI Agents Manage Memory and Avoid Forgetfulness](https://blog.bytebytego.com/p/how-ai-agents-manage-memory-and-avoid)
- [ByteByteGo — Why An LLM's Memory Gets Expensive and How to Fix It](https://blog.bytebytego.com/p/why-an-llms-memory-gets-expensive)
- [ByteByteGo — How Grab is Using AI Agents to Boost Team Productivity](https://blog.bytebytego.com/p/how-grab-is-using-ai-agents-to-boost)
- [ByteByteGo — How Meta Uses AI Agents for Data Warehouse Access and Security](https://blog.bytebytego.com/p/how-meta-uses-ai-agents-for-data)
- [ByteByteGo — How LinkedIn Built an AI-Powered Hiring Assistant](https://blog.bytebytego.com/p/how-linkedin-built-an-ai-powered)
- [ByteByteGo — LLM Security Basics: The Full Threat Model](https://blog.bytebytego.com/p/llm-security-basics-the-full-threat)
- [ByteByteGo — The Security Architecture of GitHub Agentic Workflow](https://blog.bytebytego.com/p/the-security-architecture-of-github)
- [NVD — CVE-2025-32711 (EchoLeak)](https://nvd.nist.gov/vuln/detail/CVE-2025-32711)
- [Anthropic — How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Anthropic — Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Dex Horthy — 12-Factor Agents](https://github.com/humanlayer/12-factor-agents)
- [Chroma Research — Context Rot](https://research.trychroma.com/context-rot)
- [METR — Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study)
- [Why Do Multi-Agent LLM Systems Fail?](https://arxiv.org/abs/2503.13657) (arXiv:2503.13657, UC Berkeley, NeurIPS 2025)
- [Cognition — Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents)
- [Intercom — What's new with Fin 3](https://www.intercom.com/blog/whats-new-with-fin-3/)
