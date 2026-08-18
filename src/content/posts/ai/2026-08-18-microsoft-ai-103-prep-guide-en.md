---
title: "Microsoft AI-103: After the Foundry Rename, Every Older Azure AI Study Guide Is Void"
date: 2026-08-18
type: guide
category: ai
tags: [certification, azure, generative-ai, agents, career]
lang: en
series:
  name: "AI Certification Prep"
  order: 5
tldr: "AI-103 replaces AI-102, retired June 30, 2026, and the objectives were rewritten around Microsoft Foundry — prompt flow, Azure AI Studio, Azure OpenAI Service, and Azure AI Agent Service appear nowhere in them. The five skill areas weigh 25-30 / 30-35 / 10-15 / 10-15 / 10-15, with generative AI and agents the largest. Official specs: $165, 120 minutes, pass at 700, offered in Traditional Chinese, may include interactive components — and it is valid for only one year, though renewal is a free, open-book, unproctored online assessment."
description: "A preparation guide for Microsoft AI-103 (Azure AI Apps and Agents Developer Associate), built on the official study guide's five weighted skill areas, covering what the Foundry rename invalidates, a six-week schedule with its derivation, the one-year validity and free renewal assessment rules, and how it relates to the retired AI-102."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide)
>
> This is a preparation path built from official material, not an exam-day account — I have not sat this exam. Every "what it tests" points back to the [official study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103), and every "how to prepare" points to official Microsoft training. No leaked questions. Verified 2026-08-18 against "Skills measured as of **April 16, 2026**."

If you are looking for the "Azure AI Engineer" certification, it no longer exists — **AI-102 retired on June 30, 2026** and AI-103 took its place. This is not a code change: **the objectives were rewritten**, and the platform they name is Microsoft Foundry.

For prices, validity, and gates across vendors, see [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en) — not repeated here.

## Who This Is For

The audience profile in the official study guide is specific:

> you're an Azure AI engineer who builds, manages, and deploys agents and AI solutions that take advantage of Microsoft Foundry… you should have experience developing apps by using Python, and you need to be familiar with the capabilities of general AI, generative AI, and Azure services.

**Python is assumed**, and so is actually building on Foundry. That is a different posture from AWS's AIF-C01, which states outright that its candidate "uses but does not necessarily build."

**A fit** if your company runs on Azure and you write AI applications or agents. **It is offered in Traditional Chinese** — one of only two exams in this series that is, alongside AWS AIF-C01.

**Not a fit** if you are not on Azure, or if you want to prove modeling ability: there is no model training or feature engineering here. This exam is about assembling, deploying, and governing on Foundry.

## Official Specs at a Glance

| Item | Detail |
|---|---|
| Exam code | AI-103 (Developing AI Apps and Agents on Azure) |
| Certification | Azure AI Apps and Agents Developer Associate |
| Fee | **$165 USD** (Microsoft prices by country or region) |
| Length | 120 minutes |
| Question count | **Not published per exam**; the generic note says exams "typically contain between 40-60 questions" |
| Question types | **Not disclosed in advance**; the certification page says only "You may have interactive components to complete as part of this exam" |
| Passing score | **700** on a 1–1,000 scale, and Microsoft notes "it may not equal 70% of the points" |
| Validity | **1 year** |
| Languages | 10, **including Traditional Chinese** |

**The one-year validity is the thing to plan around** — an order of magnitude tighter than AWS's three years or Google's and NVIDIA's two. Renewal rules are in the last section; the summary is: **free, open book, unproctored, but only inside a six-month window, and missing it means re-earning the whole certification.**

## The Five Weighted Skill Areas

| Skill area | Weight |
|---|---|
| Plan and manage an Azure AI solution | 25–30% |
| **Implement generative AI and agentic solutions** | **30–35%** |
| Implement computer vision solutions | 10–15% |
| Implement text analysis solutions | 10–15% |
| Implement information extraction solutions | 10–15% |

**The first two total 55–65%.** Planning plus generative and agentic work is two thirds of the exam. The remaining three areas — vision, text analysis, information extraction — are 10–15% each and are what remains of the classic Azure AI services.

## The Foundry Rename Decides Whether Your Material Is Usable

Microsoft did not add objectives here; it **replaced the platform vocabulary**. What appears in the objectives:

- **Microsoft Foundry** — the platform itself (Foundry projects, Foundry SDKs and connectors, Foundry services)
- **Foundry Tools** — where individual cognitive services used to be named
- **Azure Content Understanding in Foundry Tools** — including "single-task and pro-mode Content Understanding pipelines" and analyzers
- **Azure Translator in Foundry Tools**

And what appears **nowhere in the skills measured**: prompt flow, Azure AI Studio, Azure OpenAI Service, Azure AI Agent Service, Azure Cognitive Services, LUIS, Semantic Kernel.

**The test**: if your material is organized around Azure AI Studio, prompt flow, or Azure AI Agent Service, it describes the world before Foundry.

One irony worth knowing: **the "Find documentation" block on that same study guide page has not been updated** — it still links to Azure AI services, Azure AI Vision, Azure AI Language (the link actually points at `/azure/cognitive-services/luis/`), Azure OpenAI, and the rest. **The objectives block and the documentation block on one page disagree**; treat the doc links as the stale half.

Also note this study guide currently has **only one version** (Skills measured as of April 16, 2026) and no change log — the page's boilerplate line about "two versions of the Skills Measured objectives" is template text, not a missing section. So you cannot date material by comparing versions; date it by which product names it uses.

## Area by Area

### Plan and Manage an Azure AI Solution (25–30%)

**What it tests**: choosing the right model per task (LLMs, small language models, multimodal models, Foundry Tools); choosing Foundry services for generation, grounding, vector search, agent workflows, or multimodal processing; choosing retrieval and indexing approaches; choosing memory, tool, and knowledge integration services for agents; designing Azure infrastructure and deployment options; **integrating Foundry projects with CI/CD**; managing quotas, scaling, rate limits, and cost footprints; monitoring model performance, drift, safety events, and grounding quality; monitoring ingestion quality and index health; configuring managed identity, private networking, **keyless credentials**, and role policies; responsible AI (safety filters, guardrails, risk detection, content moderation, evaluators, trace logging, provenance metadata, approval workflows, and **governing agent behavior with oversight modes and tool-access controls**).

**How to prepare**: this reads as "planning" but tests **selection judgment**. Build your own decision table for which Foundry service fits which scenario, especially the retrieval-and-indexing boundaries.

### Implement Generative AI and Agentic Solutions (30–35%, the heaviest)

**What it tests**: deploying and consuming LLMs, small models, code models, and multimodal models; **implementing RAG in an application**; designing workflows, tool-augmented flows, and multistep reasoning pipelines; evaluating models and apps for fabrications, relevance, quality, and safety; integrating generative workflows through Foundry SDKs and connectors.

The agent half is more concrete: defining agent roles, goals, conversation-tracking approach, and **tool schemas**; building agents that combine retrieval, function calling, and conversation memory; integrating agent tools (APIs, knowledge stores, search, content understanding, custom functions); **implementing orchestrated multi-agent solutions**; building autonomous or semiautonomous workflows with safeguards and approval controls; integrating monitoring into deployed agents, evaluating behavior, and performing error analysis.

Then optimization and operations: tuning generation behavior; **model reflection, chain-of-thought evaluations, self-critique loops**; observability through tracing, token analytics, safety signals, and latency breakdowns; orchestrating multiple models or hybrid LLM-and-rules architectures.

**How to prepare**: this area demands hands-on work. The highest-yield exercise is **building one tool-using agent on Foundry and then opening its traces and token analytics** — "integrate monitoring into deployed agents" is an explicit objective, and reading about it does nothing.

### Vision, Text Analysis, Information Extraction (10–15% each)

**Vision** is generation-oriented here: text-and-reference-media to image and to video, **inpainting and mask-based edits**, multimodal understanding and visually grounded question answering, **alt-text aligned to accessibility guidelines**, video analysis, and extracting visual characteristics with Content Understanding. It also carries multimodal responsible AI — including **detecting indirect prompt injection embedded as text inside images**.

**Text analysis**: extracting entities, topics, summaries, and structured JSON via generative prompting and Foundry Tools; detecting sentiment, tone, safety issues, and sensitive content; translation via Azure Translator or LLM flows; speech (STT, TTS, custom speech models, **speech as an agent modality**, multimodal reasoning from audio).

**Information extraction**: ingesting and indexing documents, images, audio, and video; semantic, hybrid, and vector search; enrichment with built-in or custom skills; **RAG ingestion including OCR**; connecting retrieval pipelines to workflows and agent tools; multimodal document extraction (OCR plus layout analysis plus field extraction); structured or markdown output via Content Understanding.

**How to prepare**: these three total 30–45%, but individually they are 10–15% each, a worse return than the first two areas. The efficient strategy is **clearing the bar in each rather than mastering any**: run the official learning paths and, for each service, know what problem it solves and what its inputs and outputs are.

## A Six-Week Schedule and Its Derivation

**Derivation**: associate level, but it **assumes Python and hands-on work**, and the second area (30–35%) requires actually building an agent. So it runs longer than the purely knowledge-based [AWS AIF-C01 at four weeks](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en) and shorter than professional-level [AIP-C01 at ten](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en).

At 6–8 hours a week over six weeks:

| Week | Content | Reasoning |
|---|---|---|
| 1 | Read the study guide; run the exam sandbox to meet the interactive question types | Microsoft won't disclose formats, but the sandbox is free and needs no sign-in |
| 2 | Plan and manage (25–30%): selection and governance | Build the selection framework first; later material hangs off it |
| 3–4 | **Implement generative AI and agentic (30–35%)** | Heaviest and hands-on; two weeks |
| 5 | Vision + text analysis (20–30% combined) | Both are covered by the official learning paths |
| 6 | Information extraction (10–15%) + full review | RAG and OCR close the loop with weeks 3–4 |

**Failure cost is moderate**: Microsoft's [retake policy](https://learn.microsoft.com/en-us/credentials/support/retake-policy) is a **24-hour** wait after the first failure — far gentler than AWS's 14 days — then **14 days** between subsequent attempts, with a maximum of **five attempts per 12-month period**. The low first-retry barrier is not a licence to treat a sitting as reconnaissance; you pay every time.

**Official material**: the four free Microsoft Learn paths *are* the curriculum of the instructor-led course **AI-103T00-A (four days)**, so self-study means working through them — [Develop generative AI apps in Azure](https://learn.microsoft.com/en-us/training/paths/develop-generative-ai-apps/) (6 modules), [Develop AI agents on Azure](https://learn.microsoft.com/en-us/training/paths/develop-ai-agents-azure/) (9), [Develop natural language solutions in Azure](https://learn.microsoft.com/en-us/training/paths/develop-language-solutions-azure-ai/) (7), and [Extract insights from visual data on Azure](https://learn.microsoft.com/en-us/training/paths/insight-visual-data/) (8).

**One caveat on the practice assessment**: AI-103's has **moved off Microsoft Learn** to AI Skills Navigator and requires sign-in to launch. **Whether it is free is not stated on any official page** — Microsoft's general line that "Some exams have free Practice Assessments… delivered through Learn" does not apply, because this one is no longer delivered through Learn. Sign in to find out.

## One-Year Validity and Free Renewal

This is Microsoft's biggest structural difference from the other vendors, and the [official renewal documentation](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification) is worth reading in full:

**The good part**: renewal is **free**, taken online, unproctored and **open book**, and Microsoft says it takes about **45 minutes**. Fail and you can retry immediately; only after the second attempt is there a 24-hour wait, and there is **no limit** on attempts.

**The parts to plan around**:

- **Validity is one year**, and the renewal assessment only opens **in the six months before expiry**. Microsoft is explicit: "Can I renew my certification more than six months before it expires? **No.**"
- A successful renewal **adds one year to the expiration date**, not to the day you passed — so renewing early costs you nothing, but you cannot start early either.
- **Lapse and the renewal path closes**: "If your certification expires, you must earn the certification again by passing the required exam(s)," and on this Microsoft states "**There are no exceptions to this policy.**"
- Passing a beta exam or retaking the full exam **does not substitute** for the renewal assessment.

**The cost model in practice**: $165 once, then 45 free minutes a year keeps it alive indefinitely. Against AWS (three years, retake with a 50% voucher) or Google (two years, retake at $200), **Microsoft has the lowest long-term maintenance cost — conditional on remembering to do it every year.** Forget once and you are paying $165 again.

## Things That Will Go Stale (Check These Next Time)

| Item | Status as of 2026-08-18 | When to re-check |
|---|---|---|
| Objectives version | Skills measured as of 2026-04-16, no change log yet | Quarterly |
| The five weights | 25-30 / 30-35 / 10-15 / 10-15 / 10-15 | On every revision |
| Fee | $165 USD (United States) | Every six months |
| Whether the practice assessment is free | **Not published** (moved to AI Skills Navigator) | Sign in to confirm |
| Foundry naming | Objectives fully migrated; the doc-links block on the same page is not | When Microsoft fixes it |

## References

- [Azure AI Apps and Agents Developer Associate certification page](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/)
- [AI-103 official study guide (full objectives and weights)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103)
- [AI-103T00-A instructor-led course outline](https://learn.microsoft.com/en-us/training/courses/ai-103t00)
- [Microsoft certification renewal](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification)
- [Microsoft certification expiration policy](https://learn.microsoft.com/en-us/credentials/support/certification-expiration-policy)
- [Microsoft exam retake policy](https://learn.microsoft.com/en-us/credentials/support/retake-policy)
- [Exam duration and experience (the generic question-count and format guidance)](https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience)
- [Microsoft credential retirement announcement (AI-102 → AI-103 mapping)](https://techcommunity.microsoft.com/blog/skills-hub-blog/the-ai-job-boom-is-here-are-you-ready-to-showcase-your-skills/4494128)

**Related on this site**

- [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)
- [AWS AI Practitioner (AIF-C01) preparation path](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en)
- [AWS GenAI Developer Professional (AIP-C01) preparation path](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en)
- [Preparing for Google PMLE](/posts/ai/2026-08-18-google-pmle-prep-guide-en)
