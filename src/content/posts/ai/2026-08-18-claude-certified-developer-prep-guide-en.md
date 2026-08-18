---
title: "Claude Certified Developer (CCDV-F): A Third of It Is Ordinary Software Engineering"
date: 2026-08-18
type: guide
category: ai
tags: [certification, claude, agents, mcp, career]
lang: en
series:
  name: "AI Certification Prep"
  order: 8
tldr: "CCDV-F is the engineer's exam among Anthropic's four certifications. The official blueprint has eight domains, and the heaviest — Applications and Integration at 33.1% — is led by Claude Application Design (8.6%) and Software Engineering Foundations (7.4%), meaning a third of the exam is API mechanics and ordinary software engineering. The counterintuitive part: Claude Code is only 3.1% and Eval only 2.6%, while the sibling Architect exam gives Claude Code 20%. Official specs: $125, 53 items, 120 minutes, pass at 720, valid 12 months, registration limited to Claude Partner Network organizations."
description: "A preparation guide for Claude Certified Developer – Foundations (CCDV-F), built on the official exam guide's eight domains and sub-domain weights, covering how it differs from Architect Foundations, a five-week schedule with its derivation, the partner registration gate, and the 12-month validity and free renewal rules."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-claude-certified-developer-prep-guide)
>
> This is a preparation path built from official material, not an exam-day account — I have not sat this exam. Every "what it tests" points back to the official **Claude Certified Developer – Foundations Exam Guide**. No leaked questions. Verified 2026-08-18.

Of Anthropic's four certifications, **CCDV-F is the one aimed at engineers**. It costs the same as [Architect Foundations (CCAR-F)](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide-en) and runs the same length, but tests something quite different — the weights show how different.

For prices, validity, and gates across vendors, see [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en) — not repeated here.

## Who This Is For

The Intended Audience section of the official exam guide is specific:

> These professionals typically have one to five years of experience in software engineering, along with at least six months of hands-on experience with Claude or comparable LLM-based systems.

It lists the expected competencies: building agents and workflows with the Claude Agent SDK and agentic frameworks, integrating Claude through the API and client SDKs, operating Claude Code for codebase modernization, writing prompts and applying context engineering, designing and running evals, and building custom tools and MCP servers. Technically it expects **Python and/or TypeScript**, fluency with REST APIs and CLI tools.

**A fit** if you already ship against the Claude API. **Not a fit** if your Claude use is conversational — this exam assumes six months of building.

**Precondition**: as with all four, **registration is limited to organizations in the Claude Partner Network**; individuals cannot self-register. Details are in the [CCAR-F article](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide-en).

## Official Specs at a Glance

| Item | Detail |
|---|---|
| Exam code | CCDV-F |
| Items | **53** |
| Time | 120 minutes |
| Fee | **$125 USD** |
| Passing score | **720** (scaled 100–1,000) |
| Validity | **12 months** |
| Item types | Multiple choice and multiple response |
| Delivery | Online proctored or Pearson test center |

Across the family: CCAO-F $99 / 60 items, **CCDV-F $125 / 53 items**, CCAR-F $125 / 60 items, CCAR-P $175 / 63 items. CCDV-F has the fewest items but the same 120 minutes — 2 minutes 15 seconds per item, the most generous of the four.

## The Eight Domain Weights

| Domain | Weight |
|---|---|
| **Applications and Integration** | **33.1%** |
| Model Selection and Optimization | 16.8% |
| Agents and Workflows | 14.7% |
| Prompt and Context Engineering | 11.0% |
| Tools and MCPs | 10.6% |
| Security and Safety | 8.1% |
| Claude Code | **3.1%** |
| Eval, Testing, and Debugging | **2.6%** |

**Two numbers surprise most people**: Claude Code at 3.1% and Eval at 2.6%. Compare CCAR-F, where Claude Code Configuration & Workflows is **20%**, and Anthropic's role split becomes clear: **the architect exam asks how Claude Code enters a team's workflow; the developer exam asks how you build things with the API.**

## Domain by Domain

Anthropic breaks each domain into weighted sub-domains, which is the most useful feature of this blueprint — you can allocate study time to the percentage point.

### Applications and Integration (33.1%, the heaviest)

Sub-domains: **Claude Application Design 8.6%**, **Software Engineering Foundations 7.4%**, **Claude API Mechanics 6.8%**, Understanding Requirements 3.4%, Systems Life Cycle 2.8%, plus configuration management.

**What it tests**: Claude API behavior and mechanics — messages, tools, streaming, vision, thinking, **caching**, invoking Claude through third-party vendors, Messages API data access patterns, **batch API use and the realtime-versus-batch tradeoff**; core software engineering — REST APIs, JSON, async programming, version control, SDLC integration, code review, small- and large-scale refactoring; Claude application design — **how Claude interprets instructions across interfaces (Claude Code, Desktop, claude.ai, API, SDKs)**, content boundaries, schema design, session hygiene, plugin management; configuration management — **CLAUDE.md, settings.json, model version pinning, prompt versioning, plugin dependencies**.

**How to prepare**: roughly 13.6% of this domain is **ordinary software engineering** (Software Engineering Foundations 7.4% + Systems Life Cycle 2.8% + Understanding Requirements 3.4%), which experienced engineers can skip. What actually needs work is the **6.8% of API mechanics** — especially the batch-versus-realtime tradeoff and prompt caching behavior. Read the official API documentation directly for these.

### Model Selection and Optimization (16.8%)

Sub-domains: **Technical Fundamentals 6.1%**, **LLM Fundamentals 5.2%**, Model Selection and Tradeoffs 2.7%, plus optimization.

**What it tests**: LLM fundamentals (tokens, context windows, sampling, non-determinism, next-token generation), **model options (fast mode, extended thinking, adaptive thinking, effort levels)**, basic prompting; **Opus versus Sonnet versus Haiku use cases and adaptive thinking support**, quality/latency/cost tradeoffs, and **breaking behavior changes across model releases**.

**How to prepare**: "breaking behavior changes across model releases" is both a real-world pain point and an objective — note it. Be able to state the three models' tradeoffs in a sentence rather than memorizing specs.

### Agents and Workflows (14.7%)

**What it tests**: **the decision criteria for using a workflow versus an agent**; manager/supervisor hierarchies; the role of subagents; **Agent Construction with Claude (5.3%)** — custom agent loops and harnesses, managed deployment models (**self-hosted versus Anthropic-hosted**), and hooks for deterministic actions; common design patterns (tool-use loops, subagents, memory, context-window management) and agentic abstraction frameworks (**Strands, LangGraph, PydanticAI**).

**How to prepare**: Anthropic names three third-party frameworks, so questions are not confined to its own SDK. [The harness layer of agent security](/posts/ai/2026-08-10-agent-security-harness-layer-en) on this site covers harnesses and hooks in practice.

### Prompt and Context Engineering (11.0%)

**What it tests**: **token budgeting and cost management** (usage tracking, cost modeling, prompt caching and cache check-pointing); **preventing context drift and bloat** (tool output pruning, compaction); **context isolation through subagents or multi-step workflows**; prompt principles (instruction clarity, few-shot examples, system versus user placement, output constraints, placement across components, iterative refinement, input sanitization).

**How to prepare**: the center of gravity here is **cost and context management**, not "writing elegant prompts." Be able to map compaction and context isolation to concrete techniques.

### Tools and MCPs (10.6%)

Sub-domains: **Tool Implementation 4.4%**, **Agentic Customization 4.1%**, plus MCP server development.

**What it tests**: **MCP server development** — authoring, deployment, integration with Claude applications, MCP resources/tools/prompts, and **communication patterns (stdio, sockets, client versus server)**; tool implementation — configuration for external system interaction, **writing tool descriptions**, error handling, tool usage; **the tradeoffs among built-in Tools, custom Tools, Skills, and MCPs**.

**How to prepare**: that last item is the domain's core judgment question. Practically: write one MCP server over stdio and wire it into Claude Code — one exercise covers both communication patterns and tool descriptions.

### Security and Safety (8.1%)

Sub-domains: **AI Application Security 3.2%**, Guardrails and Safe Deployment 2.3%, **Identity, Secrets, and Key Management 1.6%**, **Claude Hooks 1.0%**.

**What it tests**: **prompt injection awareness and mitigation**, jailbreak defense, untrusted input handling, data leakage prevention, PII handling; content policy and **guardrail layering**, secure-by-design (privacy, IAM, least privilege); managing secrets and API keys across development and production; **using hooks as guardrails to prevent destructive actions**.

**How to prepare**: Claude Hooks is only 1.0% but very concrete — Anthropic's wording is "prevent destructive actions," i.e. the stop-before-it-deletes use case.

### Claude Code (3.1%) and Eval, Testing, and Debugging (2.6%)

Together 5.7% — small, but don't skip them entirely.

**Claude Code**: core components (**Rules, Skills, Commands, Agents, Agent Memory**), features (session management, built-in and custom slash commands, **headless mode, streaming mode, auto-mode**), the **CLAUDE.md hierarchy**, repository initialization, settings.json.

**Eval and debugging**: error type identification, recovery strategy selection, **trace analysis to identify failure modes**, and **isolating whether a problem originates in the integration layer or the model output**.

**How to prepare**: half a day each. That last item — separating integration-layer bugs from model-output bugs — is everyday debugging work anyway.

## A Five-Week Schedule and Its Derivation

**Derivation**: Anthropic assumes 1–5 years of software engineering plus six months with Claude, which means **about 13.6% of the heaviest domain is general software engineering you already have**. Netting that out leaves roughly 70% of the content to actually prepare, so this runs slightly shorter than the equally priced CCAR-F.

At 6–8 hours a week over five weeks:

| Week | Content | Reasoning |
|---|---|---|
| 1 | Read the exam guide; work the official sample questions in Section 8 | Find which sub-domains are blank for you |
| 2 | The Claude half of Applications and Integration (API mechanics 6.8% + application design 8.6%) | Heaviest domain, minus the parts you already know |
| 3 | Model Selection (16.8%) + Prompt and Context (11.0%) | Both revolve around tokens and cost; they read better together |
| 4 | Agents and Workflows (14.7%) + Tools and MCPs (10.6%) | Build week: write an MCP server and wire it into an agent |
| 5 | Security (8.1%) + Claude Code (3.1%) + Eval (2.6%) + review | The remaining 13.8% |

**Anthropic is explicit about preparation**, in Section 7 of the guide:

> There is no single required course. Anthropic does not guarantee that any particular resource ensures a passing result.

Its central recommendation is to **build a real Claude application** that exercises the API, integrates one or more tools, applies basic prompt and context engineering, and includes simple security and evaluation practices. That sentence is the study plan — weeks 2 through 4 above are just that exercise, sequenced.

Anthropic Academy also offers a free **Claude Certified Developer – Foundations Prep Course**, plus Building with the Claude API, Claude Code in Action, and Introduction to Model Context Protocol.

## 12-Month Validity and Renewal

Section 14 of the guide is unambiguous:

> The Claude Certified Developer – Foundations credential is valid for 12 months from the date it is awarded… To renew on time, you review what has changed since you certified and complete a free, non-proctored assessment on the Anthropic Partner Academy. There is no fee for on-time renewal. If your credential lapses, you must retake the full exam at the full fee to regain certified status.

**On-time renewal is free and unproctored; lapsing costs a full $125 retake.** Structurally this matches Microsoft — cheap to maintain, unforgiving if you forget.

Retake rules (the [Pearson VUE page](https://www.pearsonvue.com/us/en/anthropic.html)): 14 days after a first failure, 30 after a second, 90 after a third, with **at most 4 attempts per exam in any rolling 12 months**.

## Choosing Between This and Architect Foundations

| | CCDV-F (this article) | CCAR-F |
|---|---|---|
| Fee / items | $125 / 53 | $125 / 60 |
| Heaviest domain | Applications and Integration 33.1% | Agentic Architecture & Orchestration 27% |
| Claude Code weight | **3.1%** | **20%** |
| Structure | Standard items | **Four scenarios drawn from six** |
| Suits | Engineers integrating Claude in code | People designing solutions and team workflows |

**Neither is a prerequisite for the other** — Anthropic has not made the Foundations exams a ladder. Choose on your actual work: **call the API daily, take CCDV-F; design solutions for clients, take CCAR-F.**

## Things That Will Go Stale (Check These Next Time)

| Item | Status as of 2026-08-18 | When to re-check |
|---|---|---|
| Eight domain weights | 33.1 / 16.8 / 14.7 / 11.0 / 10.6 / 8.1 / 3.1 / 2.6 | Quarterly |
| Specs | $125, 53 items, 120 minutes, pass 720, 12 months | Quarterly |
| Registration gate | Claude Partner Network organizations only | Every six months |
| Named frameworks | Strands, LangGraph, PydanticAI | On each guide revision |

## References

- [Claude Certified Developer – Foundations certification page (exam guide download)](https://anthropic-partners.skilljar.com/claude-certified-developer-foundations-certification)
- [Pearson VUE — Claude Certification Program (registration and retake rules)](https://www.pearsonvue.com/us/en/anthropic.html)
- [Anthropic: four role-based Claude certifications](https://claude.com/blog/four-role-based-claude-certifications)
- [Claude Academy FAQ (free completion badges versus proctored certification)](https://academy.claude.com/help/faq)

**Related on this site**

- [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)
- [Claude Certified Architect Foundations exam guide](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide-en)
- [Microsoft AI-103 preparation path](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide-en)
