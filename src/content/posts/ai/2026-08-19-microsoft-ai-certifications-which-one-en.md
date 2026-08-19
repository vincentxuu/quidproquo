---
title: "Which Microsoft AI Certification: The Forks Between AI-103, AI-500, AB-620, and AB-100"
date: 2026-08-19
type: guide
category: ai
tags: [certification, azure, agents, copilot-studio, career]
lang: en
series:
  name: "AI Certification Prep"
  order: 22
tldr: "Across Microsoft's four AI/agent certifications, only AI-103 → AI-500 is an official ladder; everything else is positioning. Three forks decide it: whether you write Python (AI-103/AI-500 vs AB-620), whether you build or judge (AB-100 vs the rest), and whether you can actually start today — AI-500's four official learning paths currently 404, AB-620 has no practice test, AB-100 has a free one. For readers who prefer Chinese there is a fourth fork: AI-103 and AB-620 offer Traditional Chinese, AI-500 and AB-100 are English only. All four cost $165, expire after one year, and renew free but only inside a six-month window."
description: "A selection guide for Microsoft's AI-103, AI-500, AB-620, and AB-100 certifications: one reconciled table of official weightings, prerequisites, languages, material readiness, and renewal rules, plus the code-first vs low-code fork, the architect track, and recommended routes for four reader profiles."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-19-microsoft-ai-certifications-which-one)
>
> This is a selection guide built from official sources, not an exam report — the author has not sat these exams. Every "what's tested" points back to the official study guides, every spec points back to Microsoft's own pages, and there are no leaked questions. Verified 2026-08-19.

Microsoft laid out four AI certifications in 2026: [AI-103](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide-en), [AI-500](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide-en), [AB-620](/posts/ai/2026-08-18-microsoft-ab-620-prep-guide-en), and [AB-100](/posts/ai/2026-08-18-microsoft-ab-100-prep-guide-en). All four cost the same ($165), expire on the same schedule (one year), and share a passing score of 700 — so price and policy will not decide this for you.

**Four things will**: whether you write Python, whether you build things or decide whether they should be built, whether you can read exam questions in English, and whether the exam has usable materials today. This post consolidates the comparison tables scattered across the four prep guides into one, and deals with the places where they disagree.

For the cross-vendor spec table (prices, validity, thresholds), see [Which AI certifications actually exist in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en); this post does not repeat it.

## The only hard rule

Exactly one ladder is written into the official pages:

> To become a Microsoft Certified: Multi-Agent AI Solutions Expert (beta), you must earn the Microsoft Certified: Azure AI Apps and Agents Developer Associate certification.

[The AI-500 certification page](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/) also carries a `Prerequisites: 1 certification` field, and PREREQUISITE OPTION 1 is AI-103. **AI-103 is the only door into AI-500 — there is no alternative path.**

The other three relationships are not rules:

- **AB-620 has no prerequisite at all.** You can sit it directly.
- **AB-100 has no mandatory prerequisite either.** [The official exam page](https://learn.microsoft.com/en-us/credentials/certifications/exams/ab-100/) lists 15 "current possible associate certs that can be used for this expert certification" (including AI-103 and AB-620), but the wording never says *must*, and the page has no `Prerequisites` field like AI-500's. Those 15 are **usable alongside**, not **required first**.
- AB-620 → AB-100 as "the low-code ladder" is a reasonable inference from that list, **not an official rule**. Don't schedule around it as if it were.

## The four-exam table (reconciled from all four prep guides)

| | **AI-103** | **AI-500** | **AB-620** | **AB-100** |
|---|---|---|---|---|
| Certification | Azure AI Apps and Agents Developer Associate | Multi-Agent AI Solutions Expert (beta) | AI Agent Builder Associate | Agentic AI Business Solutions Architect |
| Level | associate | expert | associate | expert |
| Role | code-first developer | code-first multi-agent engineer | low-code builder | architect |
| Territory | Microsoft Foundry, Python | Agent Framework / LangGraph, MCP servers, Azure Functions | Copilot Studio, Power Platform | cross-product selection across Dynamics 365 / Copilot Studio / Foundry |
| Status | GA | **beta** | GA | GA |
| Price | $165 | $165 | $165 | $165 |
| Time | 120 minutes | not published | 120 minutes | not published |
| Pass | 700 | 700 | 700 | 700 |
| Validity | 1 year | 1 year | 1 year | 1 year |
| Languages | 10, **incl. Traditional Chinese** | **English only** | 13, **incl. Traditional Chinese** | **English only** |
| Prerequisite | none | **must hold AI-103** | none | none (15 listed as usable) |
| Practice test | moved to AI Skills Navigator; **whether it is free is not stated** | not yet available | not yet available | **yes, and free** |

Skill weightings, from each exam's official study guide (bold = heaviest block):

| AI-103 (five) | AI-500 (four) | AB-620 (three) | AB-100 (three) |
|---|---|---|---|
| Plan and manage 25–30% | Architect 15–20% | Plan and configure 30–35% | Plan 25–30% |
| **Generative AI and agentic 30–35%** | **Develop in Azure 30–35%** | **Integrate and extend 40–45%** | Design 25–30% |
| Computer vision 10–15% | Evaluate/optimize/monitor 20–25% | Test and manage 20–25% | **Deploy 40–45%** |
| Text analysis 10–15% | Secure/govern/deploy 20–25% | | |
| Information extraction 10–15% | | | |

**The two expert-level exams pull in opposite directions.** AI-500's heaviest block is *Develop* (30–35%) with architecture at only 15–20%; AB-100's heaviest is *Deploy* (40–45%), and its "deploy" covers monitoring and tuning, test strategy, ALM design, and responsible AI — with verbs that are almost entirely design/recommend/propose. Same level, but one wants you to have shipped a system and the other wants you to have driven a cross-functional adoption decision.

## Fork 1: do you write Python

This is the cleanest cut, and the two sides barely overlap.

**Code-first side (AI-103 → AI-500).** AI-103's official audience profile says outright: "you should have experience developing apps by using Python." AI-500's objectives name Agent Framework, LangChain, LangGraph, Hugging Face Transformers, and building MCP servers on Azure Functions / Logic Apps / API Management. This track is about whether you have written multi-agent systems, shipped them, and wired up tracing and guardrails.

**Low-code side (AB-620).** The official audience is a "professional developer or advanced builder," but what you need to know is Power Fx, Dataverse, Power Platform environments, and adaptive cards. Its heaviest 40–45% block is *Integrate and extend*: attaching knowledge sources, adding MCP tools and computer use, integrating Foundry agents and Fabric data agents, building multi-agent solutions with A2A. **No Python — but MCP and A2A are still on the exam.**

**How to decide**: which do you open day to day, VS Code or the Copilot Studio canvas? That is your side. The overlap is conceptual only (RAG, MCP, A2A, orchestration patterns); the implementation skills don't transfer. For the cross-certification overlap, see [where the multi-agent exam domains intersect](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains-en).

## Fork 2: build or judge

AB-100 is the only one of the four that does not test *how to do it*. Its Plan block covers ROI criteria including total cost of ownership, build/buy/extend trade-offs, the Azure Cloud Adoption Framework's AI adoption process, and the AI Center of Excellence. Its Design block covers selection boundaries: build vs extend Microsoft 365 Copilot, standard NLP vs conversational language understanding vs generative orchestration, task-based vs autonomous agents.

The official instructor-led course [AB-100T00](https://learn.microsoft.com/en-us/training/courses/ab-100t00) says of itself: "**it is not a test-preparation course**," offering architectural foundations and design reasoning instead. That sentence tells you what this exam is: **judgment comes from projects, not from reading.**

**How to decide**: if your job is "decide whether we do this, which one, and who governs it," AB-100 maps directly. If your job is to build the thing, take AI-103 or AB-620 first and leave AB-100 for later.

## Fork 3: language

This rarely matters for other vendors, but the gap on Microsoft's track is large:

| Traditional Chinese available | English only |
|---|---|
| **AI-103** (10 languages) | **AI-500** |
| **AB-620** (13 languages) | **AB-100** |

I checked the language field on all four exam pages on 2026-08-19: AI-103 and AB-620 both list Chinese (Traditional); AI-500 and AB-100 list English only.

**Which produces an awkward fact**: both localized exams are at associate level, and both expert-level exams are English only. Getting to expert means reading exam questions in English — **and for AI-500 it is not just the questions: the only preparation material available today is English official documentation** (see the next section).

**Practical advice**: if English reading speed is your bottleneck, take AB-620 or AI-103 first (a localized exam separates "I couldn't parse the question" from "I don't know the technology"), then decide whether to go for expert.

## Fork 4: which one you can actually start today

The gap in material readiness will affect this month's progress more than the gap in difficulty.

| | Official learning paths | Instructor-led course | Practice test |
|---|---|---|---|
| **AI-103** | ✅ all four live (the same material as course AI-103T00-A) | yes | moved to AI Skills Navigator; **free or not is not stated** |
| **AI-500** | ❌ the exam page lists four, but **all four public URLs return 404**; the certification page itself says "Learning paths or modules are not yet available for this certification" | [AI-500T00](https://learn.microsoft.com/en-us/training/courses/ai-500t00) marked **available 9/30/2026** | ❌ not yet available |
| **AB-620** | ✅ three live (8 hours 29 minutes of listed content) | [AB-620T00-A](https://learn.microsoft.com/en-us/training/courses/ab-620t00) marked **available 9/18/2026** | ❌ not yet available ("usually available within 8 weeks of the exam being out of beta and generally available") |
| **AB-100** | ✅ [Architect agentic AI business solutions](https://learn.microsoft.com/en-us/training/paths/architect-agentic-ai-business-solutions/) | yes, but self-described as not a test-prep course | ✅ **yes, and free** |

(I re-fetched the AI-500 certification page on 2026-08-19 and the "Learning paths or modules are not yet available" line is still there.)

**Three actionable conclusions:**

1. **AI-500 is not a good candidate for a study plan right now.** The only official material is the study guide's 22 objectives, the Microsoft Foundry docs, and the exam sandbox. If you have not shipped a multi-agent system, waiting for the 9/30 course is much cheaper than self-teaching from a checklist; if you already build them, those 22 objectives are a good gap inventory. It is also still beta — **during beta you get one attempt**, a fail means waiting for GA, and scores are held for rescoring.
2. **AB-620 can start now, if you accept there are no practice questions.** The three learning paths are self-serve today; you do not need to wait for the 9/18 course. Fill the practice-test gap with hands-on work and the exam sandbox.
3. **AB-100 is the only one with both a learning path and a free practice test.** That is a real advantage for pacing — but remember it tests judgment, and a practice test buys familiarity, not project experience.

One nuance on AI-103's practice assessment: it has **moved off Microsoft Learn** to AI Skills Navigator and requires sign-in. Microsoft's general policy says "Some exams have free Practice Assessments… delivered through Learn," but this one is no longer on Learn, so **that sentence does not apply and Microsoft does not state the price at the new location**. So the precise claim is: **AB-100 is the only one of the four confirmed to have a free practice test**; AI-103's status is unknown, and the other two have none.

## Recommended routes for four profiles

All estimates assume 5–8 hours per week; the derivations live in each exam's own prep guide.

**1. You build AI apps on Azure** → **AI-103** (six weeks, $165). It is the only one of the four combining Traditional Chinese, complete materials, and direct relevance to daily work. Watch out for the [Foundry renaming](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide-en): the objectives were rewritten wholesale, and prompt flow, Azure AI Studio, Azure OpenAI Service, and Azure AI Agent Service appear nowhere in them — material built around those names describes the pre-Foundry world.

**2. You already build multi-agent systems and want the expert title** → **AI-103 → AI-500** ($330 total). Spend six weeks on AI-103 first (it is a hard prerequisite anyway); its "Develop AI agents on Azure" path overlaps most with AI-500's second block. For AI-500 itself: four to six weeks to close gaps if you have production experience, otherwise wait for 9/30.

**3. You build enterprise agents in Copilot Studio, as a developer, consultant, or ISV partner** → **AB-620** (five weeks, $165). No prerequisite, localized, materials ready — the lowest barrier of the four. It barely overlaps AI-103, so **don't treat AB-620 as an easy stepping stone toward AI-103**; they are not the same track.

**4. You decide whether to adopt, how ROI is calculated, and who governs it** → **AB-100** (four to six weeks with enterprise architecture experience). English only, but with a free practice test. **If you have development experience but no architecture experience, don't go straight at this one**: the outline is almost entirely design/recommend/propose, and joining one cross-functional AI adoption project will do more than studying.

**If you want both sides**: finish the side you actually work in (AI-103 or AB-620) first. The other side's value is résumé breadth rather than capability — the implementation skills don't transfer, and preparing for both at once slows both down.

## One-year validity: the shared long-term cost

All four expire after **one year** — an order of magnitude tighter than AWS's three or Google's and NVIDIA's two. But the renewal rules are friendly to holders, and worth reading in full on the [official renewal page](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification):

**The good part**: renewal is **completely free**, delivered as an online, unproctored, **open-book** assessment that Microsoft says takes about 45 minutes. A fail can be retried immediately; only from the second attempt onward is there a 24-hour wait, and there is no attempt limit.

**Missing the window** (the biggest shared risk):

- The renewal assessment is **only open within the six months before expiry**, and Microsoft is explicit that you cannot start earlier: "Can I renew my certification more than six months before it expires? **No.**"
- A successful renewal adds a year **to the original expiry date**, not to the day you took it.
- **Expiry closes the renewal path**: "If your certification expires, you must earn the certification again by passing the required exam(s)." Microsoft's stance is "**There are no exceptions to this policy.**"
- Passing a beta exam or retaking the live exam **does not substitute** for the renewal assessment.

**As a cost model**: $165 once, then 45 free minutes a year. Hold both AI-103 and AI-500 and that is two assessments a year with two separate six-month windows to track. **Miss one and that certification costs $165 to re-earn from scratch** — and AI-500 additionally requires your AI-103 to still be valid at that point.

A verification detail: **AB-620's dedicated renewal page still returned 404 when checked on 2026-08-18** (`/ai-agent-builder-associate/renew/`), and AI-500's is not live either; only AB-100's is up. That usually means the first cohort has not reached its renewal window yet rather than that no renewal path exists — but re-check as you approach expiry.

**Retake rules are identical across the four**: [24 hours](https://learn.microsoft.com/en-us/credentials/support/retake-policy) after a first failure, 14 days between subsequent attempts, at most 5 attempts on the same exam within 12 months, each one paid. The sole exception is AI-500 during beta — one attempt only.

## Where the sources disagree (recorded as found)

**1. Earlier posts in this series disagree about "the only one with Traditional Chinese."** [The AI-103 post](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide-en) says AI-103 is the only exam in this series besides AWS AIF-C01 offering Traditional Chinese; [the AB-620 post](/posts/ai/2026-08-18-microsoft-ab-620-prep-guide-en) says AB-620 is the only localized one among Microsoft's three agent certifications. Checked page by page on 2026-08-19: **both AI-103 and AB-620 offer Traditional Chinese**; AI-500 and AB-100 do not. The AB-620 sentence holds within its own scope (AB-620/AI-500/AB-100); the AI-103 sentence is scoped too broadly. **Use the table in this post.**

**2. The "Microsoft's three agent certifications" framing drops AI-103.** Both the AB-620 and AB-100 posts use "three agent certifications" to mean AB-620/AI-500/AB-100 — yet AI-103's heaviest block is "Implement generative AI and agentic solutions" (30–35%), and it is the sole entrance to AI-500. **When choosing, look at all four together**, which is why this post uses a four-column table.

**3. Microsoft's own pages contradict each other in two known places.** AI-103's study guide has fully adopted Microsoft Foundry naming in its objectives, but the **"Find documentation" link block on the same page still points at Azure AI services, Azure AI Vision, and Azure OpenAI**. AB-100's [exam page intro paragraph](https://learn.microsoft.com/en-us/credentials/certifications/exams/ab-100/) is boilerplate from a compliance exam ("implement information protection; implement data loss prevention and retention…"), contradicting the "Assessed on this exam" section further down the same page. **In both cases the study guide wins.**

**4. Naming is inconsistent.** AB-100's exam page says "Azure AI Foundry," "Azure AI services," and "Azure OpenAI"; AI-103's objectives say "Microsoft Foundry" and "Foundry Tools." Same company, same product line, two vocabularies. Don't take one page's wording as the company's current state when judging whether study material is stale.

## What will go stale (check here next time)

| Item | State (verified 2026-08-19) | Recheck |
|---|---|---|
| AI-500 beta status | still beta; a Microsoft blog says GA expected 2026/10 (forward-looking, not stated on the certification page) | monthly |
| AI-500 learning paths | four listed on the exam page, all public URLs 404; certification page says not yet available | monthly |
| Course AI-500T00 | marked available 9/30/2026 | late September |
| Course AB-620T00-A | marked available 9/18/2026 | mid-September |
| AB-620 practice test | not yet available | monthly |
| Is AI-103's practice test free | moved to AI Skills Navigator, not stated | sign in to confirm |
| The four weightings | see table above | quarterly / on revision |
| Languages | AI-103 10, AB-620 13 (both incl. Traditional Chinese); AI-500 and AB-100 English only | every six months |
| AB-620 / AI-500 renewal pages | not yet live | quarterly |
| AB-100 exam page intro | still the information-protection/DLP boilerplate | quarterly |

## References

- [Azure AI Apps and Agents Developer Associate certification page (AI-103)](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/)
- [AI-103 official study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103)
- [Multi-Agent AI Solutions Expert (beta) certification page (AI-500, incl. the prerequisite)](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/)
- [Exam AI-500 page](https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-500/)
- [AI-500 official study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500)
- [Course AI-500T00 (marked available 9/30/2026)](https://learn.microsoft.com/en-us/training/courses/ai-500t00)
- [AI Agent Builder Associate certification page (AB-620)](https://learn.microsoft.com/en-us/credentials/certifications/ai-agent-builder-associate/)
- [AB-620 official study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-620)
- [Course AB-620T00-A (marked available 9/18/2026)](https://learn.microsoft.com/en-us/training/courses/ab-620t00)
- [Agentic AI Business Solutions Architect certification page (AB-100)](https://learn.microsoft.com/en-us/credentials/certifications/agentic-ai-business-solutions-architect/)
- [Exam AB-100 page (with the misplaced intro and the 15-cert list)](https://learn.microsoft.com/en-us/credentials/certifications/exams/ab-100/)
- [AB-100 official study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100)
- [Course AB-100T00 (self-described as not a test-prep course)](https://learn.microsoft.com/en-us/training/courses/ab-100t00)
- [Learning path: Architect agentic AI business solutions](https://learn.microsoft.com/en-us/training/paths/architect-agentic-ai-business-solutions/)
- [Learning path: Develop AI agents on Azure](https://learn.microsoft.com/en-us/training/paths/develop-ai-agents-azure/)
- [Microsoft certification renewal rules](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification)
- [Microsoft certification expiration policy](https://learn.microsoft.com/en-us/credentials/support/certification-expiration-policy)
- [Microsoft exam retake policy](https://learn.microsoft.com/en-us/credentials/support/retake-policy)
- [Exam duration and exam experience](https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience)

**Related on this site**

- [Which AI certifications actually exist in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)
- [Microsoft AI-103 prep guide](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide-en)
- [Microsoft AI-500 prep guide](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide-en)
- [Microsoft AB-620 prep guide](/posts/ai/2026-08-18-microsoft-ab-620-prep-guide-en)
- [Microsoft AB-100 prep guide](/posts/ai/2026-08-18-microsoft-ab-100-prep-guide-en)
- [Where the multi-agent exam domains intersect](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains-en)
