---
title: "Microsoft AI-901 (Azure AI Fundamentals): An Entry-Level Exam Where Over Half the Weight Is Building With Foundry"
date: 2026-10-08
type: guide
category: ai
tags: [certification, azure, microsoft-foundry, generative-ai, career]
lang: en
series:
  name: "AI Certification Prep"
  order: 25
tldr: "AI-901 replaces AI-900, retired June 30, 2026. The certification is still called Azure AI Fundamentals, but the objectives are now two areas: concepts at 40–45% and implementing with Microsoft Foundry at 55–60%. Python is an explicit requirement, and the objectives include building a lightweight chat client with the Foundry SDK and creating a single agent. Official specs: $99 in the US, $50 in Taiwan, 45 minutes, pass at 700, 13 languages including Traditional Chinese, and fundamentals certifications never expire."
description: "A preparation guide for Microsoft AI-901 (Azure AI Fundamentals), built on the official study guide's two weighted skill areas: how it differs from the retired AI-900, how the two official learning paths map to it, a three-week schedule with its derivation, and the no-expiry rule for fundamentals certifications."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-08-microsoft-ai-901-prep-guide)
>
> This is a preparation path built from official material, not an exam-day account. I have not sat this exam. Every "what it tests" points back to the [official study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-901), and every "how to prepare" points to official Microsoft training. No leaked questions. Verified 2026-10-08 against "Skills measured as of **April 15, 2026**".

The Azure AI Fundamentals certification still exists, but the exam behind it changed. **AI-900 retired on June 30, 2026**, and AI-901 is now the only way to earn it. The name is the same and the objectives are not: more than half of the new exam is about building something with Microsoft Foundry, and the study guide says outright that you need Python.

For prices, validity, and gates across vendors, see [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en). For the trade-offs among Microsoft's other exams, see [Choosing among Microsoft's AI certifications](/posts/ai/2026-08-19-microsoft-ai-certifications-which-one-en).

## Who This Is For

The audience profile in the study guide is short:

> you're at the beginning of your career in AI solution development… You also need knowledge of Python coding syntax and programming techniques, and you should be familiar with Azure resources.

**A good fit**: people who are starting to write AI applications, whose employer runs on Azure, and who want an inexpensive exam to confirm a basic grip on Foundry. It also works as a warm-up for [AI-103](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide-en): AI-901's four implementation themes (generative AI and agents, text and speech, vision, information extraction) line up with the last four of AI-103's five areas at a shallower depth, and AI-103 adds a planning and management area (25–30%) that AI-901 does not have.

**Not a fit**: people who do not write code. The old AI-900 was a pure concepts exam that sales and product people could take. AI-901 lists "Create a lightweight chat client application by using the Foundry SDK" as an objective. If you want an entry-level AI credential without coding, Microsoft has the business-track AB-730 and AB-731, which are outside this article.

## Official Specs

| Item | Detail |
|---|---|
| Exam code | AI-901 (Microsoft Azure AI Fundamentals) |
| Certification | Microsoft Certified: Azure AI Fundamentals |
| Price | **$99 USD** in the US, **$50 USD** in Taiwan (priced by the country where the exam is proctored; the certification page has a country selector) |
| Duration | **45 minutes** (the Fundamentals row of the official [exam duration table](https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience), with 65 minutes of seat time) |
| Questions | Not published per exam; the general statement is "typically contain between 40-60 questions" |
| Passing score | **700** (scale of 1–1,000) |
| Validity | **Does not expire** |
| Languages | 13, **including Traditional Chinese** |
| Prerequisites | None |

The Taiwan price is half the US price for the same exam, which is worth knowing before you register.

## The Two Skill Areas

| Skill area | Weight |
|---|---|
| Identify AI concepts and capabilities | 40–45% |
| **Implement AI solutions by using Microsoft Foundry** | **55–60%** |

The verbs in the second area are implement, create, build, and deploy. That is unusual for an entry-level exam, and it is the largest difference between AI-901 and AI-900.

## Preparing Area by Area

### Identify AI concepts and capabilities (40–45%)

**What it tests**, in three groups:

- **The six responsible AI principles**: fairness, reliability and safety, privacy and security, inclusiveness, transparency, accountability. One objective each.
- **Model components and configuration**: how generative models work, picking a model by capability, picking deployment options and configuration parameters.
- **Identifying AI workloads**: scenarios for generative and agentic AI, text analysis, speech, computer vision, and information extraction, plus common text analysis techniques (keyword extraction, entity detection, sentiment analysis, summarization); features of speech recognition and speech synthesis; features of computer vision and image-generation models; and techniques for extracting information from text, images, audio, and video.

**How to prepare**: this area is conceptual. The first official learning path, [AI concepts for developers and technology professionals](https://learn.microsoft.com/en-us/training/paths/ai-concepts/) (7 modules, listed at about 3.9 hours), covers it. For the six principles, come up with one counterexample of your own for each. The objectives are worded as "describe considerations for" each principle in an AI solution, and an example serves that better than a memorized definition.

### Implement AI solutions by using Microsoft Foundry (55–60%)

**What it tests**, in four groups, one per workload:

| Subtopic | Objectives |
|---|---|
| Generative AI apps and agents | Write effective system and user prompts; deploy a model and interact with it in the Foundry portal; **build a lightweight chat client with the Foundry SDK**; **create and test a single-agent solution in the portal**; build a lightweight client for an agent |
| Text and speech | Build a lightweight app with text analysis; respond to spoken prompts with a deployed multimodal model; build a lightweight app with Azure Speech in Foundry Tools |
| Vision and image generation | Interpret visual input in prompts with a multimodal model; create new visual output with generative models; build a lightweight app with vision capabilities |
| Information extraction | Extract information from documents and forms, images, and audio and video with Azure Content Understanding in Foundry Tools; build a lightweight app with information extraction |

"Lightweight application" recurs throughout. The wording of the objectives points away from architecture design and toward having wired the SDK up and run it.

**How to prepare**: take the second official learning path, [Get started with AI applications and agents on Azure](https://learn.microsoft.com/en-us/training/paths/get-started-ai-apps-agents/) (7 modules, about 5.6 hours), and finish every exercise by hand. The most effective check is to build one minimal program per row of the table above: a chat client, a speech response, an image interpretation, a document extraction. If all four run, you have this area.

## A Three-Week Schedule and How It Was Derived

**Derivation**: the two official learning paths total about 9.5 hours (231 plus 337 minutes, from the Microsoft Learn catalog), and the instructor-led course [AI-901T00-A](https://learn.microsoft.com/en-us/training/courses/ai-901t00) is one day. Adding hands-on practice and review at 5–6 hours a week gives three weeks. Anyone who has already shipped something on Foundry can do it in one.

| Week | Content | Basis |
|---|---|---|
| 1 | Read the study guide, take the first learning path (concepts) | Concepts are 40–45%; build vocabulary first |
| 2 | Second learning path plus the four minimal programs | Implementation is 55–60% and the objectives ask for working apps |
| 3 | Practice assessment and gap-filling | See the note on the practice assessment below |

**Failure is cheap**: under Microsoft's [retake policy](https://learn.microsoft.com/en-us/credentials/support/retake-policy), you wait 24 hours after a first failure, 14 days between later attempts, and can sit the same exam at most 5 times in 12 months. Every attempt is paid, but at $50 in Taiwan this ties with GitHub's GH-300 for the lowest failure cost in the series.

**Practice assessment**: the official practice assessment has moved to AI Skills Navigator and requires sign-in. The study guide's useful links table has a row reading "Take a free Practice Assessment", but it is plain text with no link, and the retired AI-900 guide carries the same row. The pointer to the actual assessment does not say whether it is free; signing in is the only way to confirm.

## Known Traps

1. **AI-900 material does not transfer.** The old five areas (AI workloads, machine learning fundamentals, computer vision, NLP, generative AI) were reorganized into two, with implementation added. Study material without Foundry SDK code is for the old exam.
2. **The certification page summary is stale.** On the [certification page](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/), the AI-901 exam blurb still reads "fundamental principles of machine learning on Azure… features of computer vision workloads…", which is the AI-900 structure. The "Assessed on this exam" list further down the same page shows the new two areas. Trust the study guide.
3. **The study guide's documentation links are stale too.** "Find documentation" lists Anomaly Detector, Language Understanding (LUIS), and Azure Bot Service, none of which appear in the objectives. The AI-103 study guide has the same problem.
4. **Localized versions lag.** Microsoft says localized versions are usually updated about eight weeks after the English one, without guaranteeing it. If you sit a non-English version, product names in the questions may trail the current English documentation.

## After the Exam: No Renewal

Microsoft's [expiration policy](https://learn.microsoft.com/en-us/credentials/support/certification-expiration-policy) is blunt:

> Microsoft fundamentals Certifications do not expire.

Associate, expert, and specialty certifications need a renewal assessment every year. Fundamentals certifications do not. The credential will not lapse when the objectives change, but its weight on a resume fades on its own: an interviewer two years from now reads a 2026 AI-901 as "studied this back then".

The usual next step is [AI-103](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide-en). The four implementation themes carry over, and the four minimal programs from AI-901 can grow into the agent that AI-103's second skill area asks for.

## Things That Will Go Stale

| Item | Status (verified 2026-10-08) | When to recheck |
|---|---|---|
| Objectives version | Skills measured as of 2026-04-15 | Quarterly |
| Weights | 40–45 / 55–60 | On each revision |
| Price | $99 US, $50 Taiwan | Every six months |
| Certification page summary | Still the AI-900 five-area description | When Microsoft fixes it |
| Practice assessment | On AI Skills Navigator, sign-in required; whether it is free is unconfirmed | Every six months |

## References

- [Azure AI Fundamentals certification page](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/)
- [AI-901 exam page](https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-901/)
- [AI-901 official study guide (full objectives and weights)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-901)
- [AI-901T00-A instructor-led course page](https://learn.microsoft.com/en-us/training/courses/ai-901t00)
- [Learning path: AI concepts for developers and technology professionals](https://learn.microsoft.com/en-us/training/paths/ai-concepts/)
- [Learning path: Get started with AI applications and agents on Azure](https://learn.microsoft.com/en-us/training/paths/get-started-ai-apps-agents/)
- [Microsoft certification expiration policy](https://learn.microsoft.com/en-us/credentials/support/certification-expiration-policy)
- [Microsoft exam retake policy](https://learn.microsoft.com/en-us/credentials/support/retake-policy)
- [Exam duration and exam experience](https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience)
- [Microsoft retirement announcement (AI-900 → AI-901 mapping table)](https://techcommunity.microsoft.com/blog/skills-hub-blog/the-ai-job-boom-is-here-are-you-ready-to-showcase-your-skills/4494128)

**Related on this site**

- [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)
- [Microsoft AI-103 preparation path](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide-en)
- [Choosing among Microsoft's AI certifications](/posts/ai/2026-08-19-microsoft-ai-certifications-which-one-en)
- [AWS AI Practitioner (AIF-C01) preparation path](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en)
