---
title: "Multi-Agent Architecture Across Five Exams: The Shared Core and What Doesn't Transfer"
date: 2026-08-18
type: deep-dive
category: ai
tags: [certification, multi-agent, orchestration, mcp, career]
lang: en
series:
  name: "AI Certification Prep"
  order: 16
tldr: "Microsoft AI-500, AB-620, AB-100, NVIDIA NCP-AAI, and Claude CCAR-F all test multi-agent architecture, and they overlap on seven things: orchestration topologies, A2A and MCP, per-agent identity boundaries, three-layer memory, observability and agent replay, human-in-the-loop, and guardrails at four intervention points. But four vendors use four vocabularies for the same ideas, and each exam has objectives that don't transfer — Microsoft names four context-window failure modes nobody else names, 7% of NVIDIA's is locked to NeMo and NIM, and Claude tests SDK-level details like stop_reason. One correction along the way: Google PMLE's wall-to-wall 'Agent Platform' is a Vertex AI rename, not a multi-agent domain."
description: "A cross-certification breakdown of multi-agent system architecture: where Microsoft AI-500 / AB-620 / AB-100, NVIDIA NCP-AAI, and Claude CCAR-F overlap and where they diverge, with a four-vendor terminology map, a list of non-transferable objectives, and one practice project that covers the shared core."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains)
>
> This is preparation material built from official sources, not an exam-day account — I have not sat these exams. Every "what it tests" points back to a vendor's official exam or study guide, all listed at the end. Verified 2026-08-18.

This is the technical deep-dive track of the [AI Certification Prep series](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide-en). The first fifteen posts were one certification each; this one inverts that: **it takes "multi-agent system architecture" — a topic five certifications test in parallel — and covers the shared core once, then marks what each vendor tests that nobody else does.**

Reading the shared core first is the time-efficient move, because it accounts for most of the multi-agent content on every one of these exams. But **the shared core alone won't pass any of them**, which is why the fourth section matters just as much.

## Which five, and where the objectives sit

| Certification | Multi-agent domain | Weight | Angle |
|---|---|---|---|
| [Microsoft AI-500](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide-en) (beta) | Architect multi-agent solutions | 15–20% | Code-first, Agent Framework / LangGraph |
| (same) | Develop multi-agent solutions in Azure | **30–35%** | Orchestration patterns and MCP server work live here |
| [NVIDIA NCP-AAI](/posts/ai/2026-08-18-nvidia-ncp-aai-prep-guide-en) | Agent Architecture and Design | 15% | Only 7% of the whole exam is NVIDIA-specific |
| (same) | Cognition, Planning, and Memory | 10% | Reasoning frameworks and stateful orchestration |
| [Microsoft AB-620](/posts/ai/2026-08-18-microsoft-ab-620-prep-guide-en) | Integrate and extend agents in Copilot Studio | **40–45%** | Low-code; "multi-agent collaboration" is one of its four strands |
| [Microsoft AB-100](/posts/ai/2026-08-18-microsoft-ab-100-prep-guide-en) | Design AI-powered business solutions | 25–30% | Architect's view: selection boundaries and ROI |
| [Claude CCAR-F](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide-en) | Agentic Architecture & Orchestration | **27%** (highest single domain) | Bound to the Claude Agent SDK, down to API-level detail |

**One misconception to clear first**: Google PMLE's objectives say "Agent Platform" from top to bottom, which makes it look like a multi-agent exam. **It isn't.** Those words come from Vertex AI being renamed Gemini Enterprise Agent Platform in 2026 — Agent Platform Feature Store, Agent Platform Pipelines, and Agent Platform Inference are the former Feature Store, Pipelines, and Prediction. PMLE's skeleton is still classical ML engineering (feature engineering, distributed training, training-serving skew), and the [official exam guide](https://cloud.google.com/learn/certification/guides/machine-learning-engineer) has no objective about coordinating agents with each other. Using PMLE to demonstrate multi-agent skill is aiming at the wrong target.

**One access gate up front**: the four Claude certifications are open only to organizations in the Claude Partner Network — individuals cannot register. CCAR-F appears below because **its Domain 1 is the most concrete treatment of orchestration in these five sources** (concrete down to `stop_reason` and `allowedTools`), which helps in understanding the other four. It is not a recommendation to go sit it.

## The shared core: seven things all five test

### 1. Orchestration topologies

AI-500 is the only one that names the topologies outright: **hub-and-spoke, sequential, parallel, peer-to-peer, orchestrator-subagent**. Those five are worth memorizing as a shared vocabulary, because the other four test the same set without listing them:

- NCP-AAI says "multi-agent workflow orchestration", and in the same domain lists **reasoning-and-acting frameworks such as ReAct** and **multi-step reasoning with logic trees and prompt chains**
- AB-620 says "design multi-agent solutions in Copilot Studio", "integrate Foundry agents", "integrate existing agents"
- AB-100 says "design multi-agent solutions using Microsoft 365 Copilot, Copilot Studio, and Microsoft Foundry" — note that what it tests is **selection across three products**, not wiring inside one
- CCAR-F tests only hub-and-spoke, but deepest: the coordinator owns all subagent communication, error handling, and information routing, and **the correct way to parallelize is to emit multiple Task tool calls in a single coordinator response, not across several turns**

**Maps back to**: AI-500 Develop (30–35%), CCAR-F Domain 1 (27%), NCP-AAI Agent Architecture (15%), part of AB-620 Integrate (40–45%).

### 2. A2A and MCP

All three Microsoft certifications name **A2A** (the [Agent2Agent protocol](https://a2a-protocol.org/latest/)), which is a genuinely new 2026 objective:

- AI-500: "securely incorporate existing agents using A2A or MCP"
- AB-620: "build multi-agent solutions using the A2A protocol", and its certification page lists MCP and A2A among the generative AI concepts you should already know
- AB-100: "design agent extensions for Copilot Studio using MCP"

[MCP](https://modelcontextprotocol.io/) is where the four diverge most. **Microsoft tests which Azure service you host it on** — AI-500's objective literally reads "design and build MCP servers and clients, including Azure Functions, Azure Logic Apps, Azure API Management", which is an implementation objective, not a conceptual one. **Claude tests how the tool itself is designed** (Domain 2, Tool Design & MCP Integration, 18%). NCP-AAI says only "agent-to-agent communication protocols" and **names no protocol at all** — a side effect of its platform neutrality, and it means you have to pick which spec to read yourself.

**Maps back to**: AI-500 Develop, AB-620 Integrate, AB-100 Design, CCAR-F Domain 2.

### 3. Per-agent identity and permission boundaries

This is where the wording diverges most while describing the same failure: **one compromised agent must not be able to spread its privileges to the others.**

AI-500 has the most complete framing — "**Zero Trust multi-agent solutions**: identity scoping per agent, **preventing lateral movement**, mapping compliance controls for regulated deployments." "Lateral movement" is security vocabulary, and Microsoft is the only one of the five to move it straight into an agent exam.

The equivalents elsewhere: AB-620's "identity strategy" and tool permissions; AI-500's architecture block also requires "specify tool scope, permission boundaries, and validation approach"; and CCAR-F reaches the same place from reliability — **giving one agent 18 tools produces markedly worse selection reliability than giving it 4–5 related ones, so each subagent should hold only the tools its role needs**.

**Hold both framings at once**: least privilege is an accuracy control as much as a security control. For practical context, see [The harness layer of agent security](/posts/ai/2026-08-10-agent-security-harness-layer-en) and [Agent security: prompt injection and trust boundaries](/posts/ai/2026-06-04-agent-security-prompt-injection-trust-boundaries-en).

**Maps back to**: AI-500 Architect + Secure (20–25%), AB-620 Plan (30–35%), CCAR-F Domain 2.

### 4. Three layers of memory, and how context breaks

AI-500 splits state into three layers, which is the most usable mental model here: **session state, shared team state, long-term semantic memory**, with "lifecycle and tenant isolation" attached. NCP-AAI phrases it as "memory mechanisms for short- and long-term context" plus **stateful orchestration**. CCAR-F contributes an implementation fact that is easy to miss: **a subagent does not inherit the coordinator's conversation history — the context it needs must be passed explicitly in its prompt.**

AI-500 goes further and **names four context-window failure modes**:

| Failure mode | Symptom |
|---|---|
| sliding-window amnesia | The window slides and pushes early key facts out |
| summary drift | Repeated summarization walks the meaning away from the original |
| vector-only recall | Retrieval relies on vectors alone and misses content needing exact matching |
| entity continuity | Entity references stop lining up across turns |

**None of those four terms appear in the other four exam guides.** Naming them individually suggests questions will give you a symptom and ask which one it is. Conversely, the same four ailments show up in CCAR-F as operational advice — "when integrating results from multiple subagents, don't concatenate 15 full subagent outputs" — **same symptom, different way of testing it**.

**Maps back to**: AI-500 Architect + Evaluate (20–25%), NCP-AAI Cognition/Planning/Memory (10%), CCAR-F Domain 5, Context Management & Reliability (15%).

### 5. Observability: trace correlation and agent replay

What separates multi-agent observability from ordinary service observability is **correlation across agents**:

- **AI-500**: trace correlation across services, structured logging of agent reasoning paths, **agent replay capture for reproducing bugs**; implementation-side it names tracing in Foundry (tokens, prompts, correlation IDs, alerts, run tracking)
- **NCP-AAI**: monitoring dashboards and reliability metrics, logging and anomaly tracking, **continuous benchmarking against prior versions** (the Run, Monitor, and Maintain block)
- **AB-620**: monitor agents with **Application Insights**
- **AB-100**: **interpret telemetry** to tune performance and models

**Agent replay is AI-500's own wording** and the one most worth understanding separately — it asks you to be able to replay a full run, not merely read logs afterwards.

**One verification trap worth flagging**: for NCP-AAI's Run, Monitor, and Maintain block, **the official web page says 5% and the official PDF study guide says 7%** — both on nvidia.com. Deployment and Scaling in the same table also disagrees (13% on the page, 5% in the PDF). Treat these as uncertainty ranges; don't pick one and call it fact.

**Maps back to**: AI-500 Evaluate (20–25%), NCP-AAI Run/Monitor/Maintain (5–7%, sources conflict), AB-620 Integrate, AB-100 Deploy (40–45%).

### 6. Human-in-the-loop

All four vendors test it, and none of them means "add a confirm button":

- **AI-500**: the architecture block asks for workflows with subagents, control loops, and **human-in-the-loop**, plus controls supporting **HAX (human-AI experience)**; the orchestration block asks for human-in-the-loop **approval flows, overrides, and edge cases**
- **AB-620**: "create an agent flow with **human-in-the-loop**" is a named skill, listed alongside error handling in agent flows
- **NCP-AAI**: an entire 5% domain (Human-AI Interaction and Oversight), including **transparency mechanisms — explainable reasoning and traceable decisions**
- **CCAR-F**: no separate domain, but Domain 1's core idea is the extreme version — **when a tool-call order is a business-logic requirement, enforce it in code rather than relying on the prompt**

That last one is worth memorizing on its own: **"change the prompt first" is usually the wrong answer to this class of question.**

**Maps back to**: AI-500 Architect + Develop, AB-620 Plan, NCP-AAI Human-AI Interaction (5%), CCAR-F Domain 1.

### 7. Guardrails have four intervention points; deployment has three release styles

AI-500's guardrail framing is the most structured of the five: "**a multi-intervention guardrail strategy spanning user input, tool calls, tool responses, and output**", plus **guardrail testing and validation using synthetic data** and shift-left security via Foundry's AI Red Teaming Agent.

**That four-point split is worth taking straight into your own work** — most teams instrument input and output only, and skip tool calls and tool responses, which is precisely where multi-agent systems get broken in practice.

On deployment: AI-500 names **DTAP, blue/green, and canary**; NCP-AAI has **containerized scaling (Docker, Kubernetes) with load balancing** plus MLOps CI/CD; AB-100 requires **separate ALM designs** for Copilot Studio agents/connectors/actions, the Foundry Agents service, and custom models, along with **audit trails for model and data changes**.

**Maps back to**: AI-500 Secure/Govern/Deploy (20–25%), NCP-AAI Deployment and Scaling (5–13%, sources conflict) plus Safety/Ethics/Compliance (5%), AB-100 Deploy (40–45%).

## One idea, four vendor names

The expensive part of preparing across exams isn't understanding the concepts — it's noticing that two terms are the same thing. This table is the most practical part of this post:

| Concept | Microsoft (AI-500 / AB-620 / AB-100) | NVIDIA (NCP-AAI) | Anthropic (CCAR-F) |
|---|---|---|---|
| Lead/follower orchestration | orchestrator-subagent, hub-and-spoke | multi-agent workflow orchestration | hub-and-spoke coordinator |
| State management | multi-tier state persistence (session / shared team / long-term semantic) | memory mechanisms for short- and long-term context, stateful orchestration | context management; subagents need context passed explicitly |
| Agent-to-agent comms | A2A, MCP (named hosts: Functions / Logic Apps / APIM) | "agent-to-agent communication protocols" (unnamed) | MCP (Domain 2, 18%) |
| Security boundary | Zero Trust, preventing lateral movement, Key Vault | layered safety frameworks (filters, escalation protocols), NeMo Guardrails | each subagent holds only its role's tools |
| Reliability control | multi-intervention guardrails, AI Red Teaming Agent | compliance guardrails, audit trails | enforce tool order in code; terminate loops on `stop_reason` |
| Observability | Foundry tracing, correlation IDs, agent replay | monitoring dashboards, reliability metrics, benchmarking vs prior versions | Domain 5, context management and reliability |
| Evaluation | evaluate memory, knowledge, tools, and prompts separately; LLM-as-a-judge | evaluation pipelines and task benchmarks; accuracy/latency trade-offs | anti-pattern catalogue (tested as scenario questions) |

**How to use it**: after finishing one vendor's material, translate the terms across and you can skip re-reading the same block for the other three — only the vendor-specific parts remain.

## What doesn't transfer

This is the list outside the shared core. **Every line here can only come from that exam's own official material**; general agent experience will not carry you.

**AI-500 only**: the four named context-window failure modes, agent replay, mapping compliance controls onto Zero Trust multi-agent designs, MCP servers on Azure Functions / Logic Apps / API Management, Foundry's AI Red Teaming Agent, DTAP, and **implementing advanced multi-agent capabilities with Hugging Face Transformers** (which appears nowhere else).

**NCP-AAI only**: the 7% NVIDIA Platform Implementation block — **NeMo Guardrails, NIM microservices, the NeMo Agent Toolkit, TensorRT-LLM, Triton Inference Server** — plus **knowledge-graph-based relational reasoning** in the architecture block. Outside that 7%, this is **the most vendor-neutral of the five sources**, and the one whose preparation transfers best to actual work.

**AB-620 only**: Copilot Studio **agent flows**, **computer use** (the official skill reads "configure **and monitor** computer use" — monitoring is part of the same objective), the **Fabric data agent**, adaptive cards, and Power Platform solution and Pipelines ALM.

**AB-100 only**: **ROI criteria including total cost of ownership**, **build vs buy vs extend trade-offs**, a **model router** directing requests to the most suitable model, the Microsoft AI Center of Excellence, and three selection boundaries (build vs extend Copilot, standard NLP vs generative orchestration, task agent vs autonomous agent). This exam tests judgment rather than implementation, and reading won't close that gap.

**CCAR-F only**: terminating an agentic loop on `stop_reason` instead of parsing response text, the coordinator's `allowedTools` needing to include `Task`, parallel subagents requiring multiple tool calls in a single response, and where `fork_session` beats `--resume`. **These are SDK-level details** and stop being true on another platform.

## How much one practice project covers

If you're preparing for two or more of these, building one system beats reading two guides. This checklist maps onto the seven items above — **finishing it covers the shared core and none of the vendor-specific section**:

1. Build an **orchestrator-subagent** system with at least three subagents, two of which run in parallel → (1)
2. Expose one tool as an **MCP server** and have another agent reach it over the protocol instead of a direct function call → (2)
3. Give each subagent **its own credentials and tool allowlist**, then actually test whether compromising A reaches B's resources → (3)
4. Implement all three state layers explicitly — single-turn session, cross-agent shared, cross-session long-term — and write down a TTL for each → (4)
5. Thread a **correlation ID** through every agent's traces and store one full run as a replayable record → (5)
6. Put an approval gate in front of an **irreversible action**, enforced in code rather than by a "please confirm first" line in the prompt → (6)
7. Place a guardrail at each of the **four intervention points** (input, tool call, tool response, output) and test them against synthetic data for false blocks → (7)
8. Finish with a **blue/green or canary** cutover and confirm traffic rolls back → (7)

Shortest paths for the non-transferable parts: for the Microsoft line, the [Foundry documentation](https://learn.microsoft.com/en-us/azure/foundry/) and the [multi-agent workflow automation architecture note](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/idea/multiple-agent-workflow-automation); for NVIDIA, the paid DLI courses or the product docs; for Claude, the [Agent SDK documentation](https://platform.claude.com/docs/en/agent-sdk/overview).

## If you read only one

**[The AI-500 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500).** Three reasons: its 22 sub-objectives are the most complete multi-agent checklist of the five; it is a free public web page requiring neither registration nor partner status; and it names things nobody else names (the four context failure modes, the four guardrail intervention points, agent replay).

**Know its bias, though**: the whole document orbits Microsoft Foundry, and the vocabulary is Microsoft's. For a neutral version, read [NCP-AAI's ten domain descriptions](https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/) — only 7% is tied to NVIDIA products, and the wording of the other nine domains works as a general-purpose glossary.

## What will go stale (check here next time)

| Item | Status (verified 2026-08-18) | Recheck when |
|---|---|---|
| AI-500 status | Still beta; the official blog says GA is expected 2026-10 | Monthly |
| AI-500 four weights | 15-20 / 30-35 / 20-25 / 20-25 | After GA |
| NCP-AAI registration | Coming soon; not yet open | Monthly |
| NCP-AAI weight conflict | Web page totals 98%, PDF totals 92%; two entries differ | When registration opens |
| AB-620 / AB-100 weights | 30-35 / 40-45 / 20-25; 25-30 / 25-30 / 40-45 | Quarterly |
| CCAR-F weights | 27 / 18 / 20 / 20 / 15 (Exam Guide v1.0, effective July 2026) | Quarterly |
| How A2A and MCP are tested | Three Microsoft exams name A2A; NCP-AAI names no protocol | Quarterly |

## References

- [AI-500 official study guide (four weighted areas, 22 sub-objectives)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500)
- [AB-620 official study guide (three weighted areas, including the four multi-agent objectives)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-620)
- [AB-100 official study guide (three weighted areas and change log)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100)
- [NCP-AAI official certification page (ten domains and the weight table)](https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/)
- [Claude Certified Architect – Foundations certification page (exam guide download)](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification)
- [Google Professional ML Engineer exam guide (used to confirm it does not test agent coordination)](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)
- [Model Context Protocol documentation](https://modelcontextprotocol.io/)
- [Agent2Agent (A2A) protocol documentation](https://a2a-protocol.org/latest/)
- [Multi-agent workflow automation with Agent Framework (Microsoft architecture note)](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/idea/multiple-agent-workflow-automation)
- [Microsoft Foundry documentation](https://learn.microsoft.com/en-us/azure/foundry/)
- [Claude Agent SDK documentation](https://platform.claude.com/docs/en/agent-sdk/overview)

**Related on this site**

- [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)
- [Microsoft AI-500 preparation path](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide-en)
- [NVIDIA NCP-AAI preparation path](/posts/ai/2026-08-18-nvidia-ncp-aai-prep-guide-en)
- [Microsoft AB-620 preparation path](/posts/ai/2026-08-18-microsoft-ab-620-prep-guide-en)
- [Microsoft AB-100 preparation path](/posts/ai/2026-08-18-microsoft-ab-100-prep-guide-en)
- [Claude Certified Architect Foundations guide](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide-en)
- [Google PMLE preparation path](/posts/ai/2026-08-18-google-pmle-prep-guide-en)
- [The harness layer of agent security](/posts/ai/2026-08-10-agent-security-harness-layer-en)
- [Agent security: prompt injection and trust boundaries](/posts/ai/2026-06-04-agent-security-prompt-injection-trust-boundaries-en)
- [Multi-agent error propagation and recovery](/posts/ai/2026-06-04-multi-agent-error-propagation-recovery-en)
- [LangGraph agent orchestration](/posts/ai/2026-03-27-langgraph-agent-orchestration-en)
