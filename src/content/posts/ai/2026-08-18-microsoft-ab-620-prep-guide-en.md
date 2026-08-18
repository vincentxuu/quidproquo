---
title: "Microsoft AB-620: The Low-Code Agent Track on Copilot Studio"
date: 2026-08-18
type: guide
category: ai
tags: [certification, azure, copilot-studio, agents, career]
lang: en
series:
  name: "AI Certification Prep"
  order: 6
tldr: "AB-620 is the low-code branch of Microsoft's agent certification line — it tests agent flows, adaptive cards, computer use, MCP tools, A2A, and Fabric data agents in Copilot Studio, not Python. The three skill areas weigh 30-35 / 40-45 / 20-25, with integration the heaviest. Official specs: $165, 120 minutes, pass at 700, one-year validity, and 13 languages including Traditional Chinese — the only localized exam of Microsoft's three agent credentials. It is generally available, but the practice assessment is not out yet."
description: "A preparation guide for Microsoft AB-620 (AI Agent Builder Associate), built on the official study guide's three weighted skill areas covering Copilot Studio agent building, enterprise integration, and ALM, with a five-week schedule and its derivation, how it divides from AI-103 and AB-100, and the one-year validity and free renewal rules."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-microsoft-ab-620-prep-guide)
>
> This is a preparation path built from official material, not an exam-day account — I have not sat this exam. Every "what it tests" points back to the [official study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-620), and every "how to prepare" points to official Microsoft training. No leaked questions. Verified 2026-08-18.

Microsoft now has three agent-related certifications, and AB-620 is **the only one that does not expect you to write Python**. Its ground is Copilot Studio: agent flows, adaptive cards, computer use, MCP tools, the A2A protocol, and Fabric data agents.

For prices, validity, and gates across vendors, see [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en) — not repeated here.

## Who This Is For

The certification page describes the candidate as a "professional developer or advanced builder" and lists what you should already know: Power Fx, Microsoft Dataverse, Power Platform environments and components, Microsoft 365 Copilot, Microsoft Foundry, and adaptive cards; intermediate generative AI concepts including **models, orchestration, RAG, MCP, and the A2A protocol**; plus prompt engineering and REST API integration experience.

The same page states plainly what you do in the role: integrate agents with Foundry, with MCP servers, with custom connectors, with APIs, with Microsoft Fabric, and automate tasks using **computer use**.

**A fit** for developers, consultants, and ISV partners building enterprise agents in Copilot Studio. One practical advantage: **it is offered in Traditional Chinese, the only localized exam of Microsoft's three agent credentials** — AI-500 and AB-100 are English-only.

**Not a fit** if you want to prove code-first ability. That track is [AI-103](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide-en) and AI-500 above it, which test Python, Agent Framework, LangGraph, and CI/CD — barely overlapping with this exam.

## Official Specs at a Glance

| Item | Detail |
|---|---|
| Exam code | AB-620 |
| Certification | AI Agent Builder Associate |
| Status | **Generally available** (no beta label on the page) |
| Fee | **$165 USD** (priced by country or region) |
| Length | **120 minutes** |
| Question count | Not published |
| Question types | Not disclosed in advance; the page says "You may have interactive components to complete as part of this exam" |
| Passing score | **700** (this figure appears in the study guide, not on the certification page) |
| Validity | **1 year** (free online renewal assessment) |
| Languages | **13**, including Traditional Chinese |
| Prerequisites | **None** |
| Practice assessment | **Not yet available** — "usually available within 8 weeks of the exam being out of beta and generally available" |

**Plan around the missing practice assessment**: there is no official mock exam for this one yet, so the learning-path labs and the exam sandbox are all you have for familiarizing yourself with the interface.

## The Three Weighted Skill Areas

| Skill area | Weight |
|---|---|
| Plan and configure agent solutions | 30–35% |
| **Integrate and extend agents in Copilot Studio** | **40–45%** |
| Test and manage agents | 20–25% |

**Integration alone is nearly half the exam**, which sets the strategy: rather than reading about planning, connect each integration type once by hand.

## Area by Area

### Plan and Configure Agent Solutions (30–35%)

**What it tests**: planning enterprise system integration, identity strategy, channels and deployment, and responsible AI strategy; evaluating security and governance considerations; planning **reusable agent components**; designing agents for internal versus external audiences.

The agent-flow half is concrete: create an agent flow, create a **human-in-the-loop agent flow**, configure actions and connectors, monitor agent flows, add input and output parameters, and **implement error handling in agent flows**.

The topics half: add agent flows to a topic, configure response formatting, add tools to a topic, configure advanced responses with **custom prompts**, **custom knowledge sources**, and **APIs and Send HTTP requests**, configure the generative answers node, configure **adaptive cards**, and manage variables.

**How to prepare**: this is the hands-on surface of Copilot Studio, and **building it once through the official learning path covers most of it**. Focus on human-in-the-loop and error handling — the line between a demo and something that survives production, and both are called out explicitly.

### Integrate and Extend Agents in Copilot Studio (40–45%, the heaviest)

**What it tests**, in four directions:

**Knowledge sources** — Copilot connectors, Power Platform connectors, Azure AI Search.

**Tools** — configuring and monitoring **computer use** for an agent, configuring **MCP tools**, adding a tool via an existing custom connector, adding REST APIs to an agent.

**Multi-agent collaboration** — designing multi-agent solutions in Copilot Studio, **integrating a Foundry agent**, integrating an existing agent, **integrating a Fabric data agent**, and building a multi-agent solution using the **A2A protocol**.

**Azure integration** — configuring generative answers with Azure AI Search plus Foundry, pointing custom prompts at the **Foundry model catalog**, and monitoring agents with **Application Insights**.

**How to prepare**: no shortcut — wire up each of the four once. **MCP tools and A2A are the newest objectives here**; [the harness layer of agent security](/posts/ai/2026-08-10-agent-security-harness-layer-en) on this site covers the protocol layer in practical terms. For computer use, run it once and then open the monitoring view — Microsoft writes "configure **and monitor** computer use" as a single skill.

### Test and Manage Agents (20–25%)

**What it tests**: creating a test set, choosing an evaluation method, reviewing test results; and ALM — creating a solution, adding existing agents to a solution, creating and using environment variables, and **implementing and extending Power Platform Pipelines**.

**How to prepare**: this is classic Power Platform ALM and has little to do with agents as such. With a Power Platform background it needs almost no preparation; without one, budget real time, because solutions and pipelines are concepts from outside Copilot Studio.

## A Five-Week Schedule and Its Derivation

**Derivation**: the three official learning paths total **8 hours 29 minutes** of stated content, but that is content time, excluding hands-on work and absorption. Allocating by weight and doubling the heaviest area gives five weeks.

At 5–7 hours a week over five weeks:

| Week | Content | Reasoning |
|---|---|---|
| 1 | Read the study guide, run the exam sandbox, and take [Design agent conversations and responses using topics](https://learn.microsoft.com/en-us/training/paths/design-agent-conversations-responses-topics-copilot-studio/) (2h 17m, 3 modules) | With no practice assessment, the sandbox is the only way to meet the interface early |
| 2 | The rest of Plan and configure: agent flows and human-in-the-loop | 30–35% of the exam, and the base the integration work sits on |
| 3–4 | **Integrate and extend (40–45%)**: [multi-agent solutions](https://learn.microsoft.com/en-us/training/paths/design-build-multi-agent-solutions-copilot-studio/) (2h 54m) and [enterprise system integration](https://learn.microsoft.com/en-us/training/paths/integrate-agents-enterprise-systems-copilot-studio/) (3h 18m) | The heaviest area, split into "multi-agent" and "external integration" |
| 5 | Test and manage (20–25%) + full review | ALM concepts close it out |

**The instructor-led course is not out yet**: [AB-620T00-A](https://learn.microsoft.com/en-us/training/courses/ab-620t00) (three days) carries the notice "**This course will be available on 9/18/2026**" — but the three learning paths above are self-serve today, so there is nothing to wait for.

**Failure cost**: Microsoft's [retake policy](https://learn.microsoft.com/en-us/credentials/support/retake-policy) is 24 hours after a first failure, then 14 days between subsequent attempts, with at most five attempts per 12 months, paying each time.

## Where It Sits Among Microsoft's Three Agent Credentials

| Certification | Position | Heaviest area | Languages |
|---|---|---|---|
| **AB-620** (this article) | Low-code builder, Copilot Studio | Integration 40–45% | 13, incl. Traditional Chinese |
| **AI-500** (beta) | Code-first engineer: Python, Agent Framework, LangGraph | Development 30–35% | English only |
| **AB-100** | Architect: ROI and cross-product governance | Deploy and govern 40–45% | English only |

**Exactly one official ladder exists**: AI-103 → AI-500, where the latter's Certification prerequisites section requires the former. **AB-620 has no prerequisite** and can be taken directly.

AB-620 does appear in AB-100's list of "current possible associate certs that can be used for this expert certification," which suggests an intended Copilot-Studio-side path of AB-620 → AB-100 — but official text stops short of making it a requirement, so don't treat it as one.

## One-Year Validity and Renewal

The same as AI-103: **one-year validity, free renewal**, taken online, unproctored and open book, available only in the six months before expiry, with a lapse forcing a full retake. The full rules are in [the last section of the AI-103 article](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide-en).

One small oddity worth knowing: **AB-620's dedicated renewal page does not exist yet** (`/ai-agent-builder-associate/renew/` returns 404) — only the general renewal policy page. That normally means the first cohort has not reached its renewal window, not that there is no renewal path.

## Things That Will Go Stale (Check These Next Time)

| Item | Status as of 2026-08-18 | When to re-check |
|---|---|---|
| The three weights | 30-35 / 40-45 / 20-25 | Quarterly |
| Study guide version | No "Skills measured as of" date, no change log | Quarterly |
| Practice assessment | **Not yet available** | Monthly |
| Dedicated renewal page | Not live yet (404) | Quarterly |
| Languages | 13, including Traditional Chinese | Every six months |

## References

- [AI Agent Builder Associate certification page](https://learn.microsoft.com/en-us/credentials/certifications/ai-agent-builder-associate/)
- [AB-620 official study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-620)
- [Course AB-620T00-A](https://learn.microsoft.com/en-us/training/courses/ab-620t00)
- [Microsoft certification renewal](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification)
- [Microsoft exam retake policy](https://learn.microsoft.com/en-us/credentials/support/retake-policy)
- [Exam duration and experience](https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience)

**Related on this site**

- [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)
- [Microsoft AI-103 preparation path](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide-en)
- [AWS AI Practitioner (AIF-C01) preparation path](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en)
