---
title: "Choosing Among the Three AWS AI Certifications: MLA-C01 Has 40 Days Left, and Only in English"
date: 2026-08-19
type: guide
category: ai
tags: [certification, aws, career, generative-ai]
lang: en
series:
  name: "AI Certification Prep"
  order: 21
tldr: "AIF-C01, MLA-C01, and AIP-C01 are not a difficulty ladder — they are three different job surfaces: AIF tests whether you can talk about it, MLA tests putting ML into production, AIP tests integrating someone else's foundation models into a system. But in August 2026 the choice is gated by time: the official certification page announces that the last day to take MLA-C01 in English is September 28, 2026 — 40 days from today — while MLA-C02 registration does not open until September 1 and its exam guide is unpublished. Non-English candidates (Japanese, Korean, Simplified Chinese) have a materially longer window. The same page also carries two codes, MLA-C02 and ME1-C02, with no stated relationship. And the renewal graph works backwards on ordering: passing AIP-C01 renews AIF-C01, MLA-C01, and Data Engineer – Associate for three years each."
description: "A selection guide for the three AWS AI certifications (AIF-C01 / MLA-C01 / AIP-C01): the real boundaries drawn from official domain weightings and out-of-scope lists, the time branch created by MLA-C01's September 28, 2026 English retirement (including the different window for non-English candidates), the unexplained MLA-C02 / ME1-C02 code conflict on the official page, and how the renewal graph determines the optimal order to take them."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-19-aws-certifications-which-one)
>
> This is a selection guide built from official material, not an exam-day account — I have not sat these exams. Every "what it tests" points back to the official exam guides and every spec points back to the official certification pages. No leaked questions. Verified 2026-08-19.

The series already covers the preparation paths for [AIF-C01](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en) and [AIP-C01](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en). This post handles the trade-off between them, plus the third exam, MLA-C01 — whose current status is peculiar enough that a standalone preparation path would be irresponsible to write.

**The conclusion first**: these three are not a beginner/intermediate/advanced ladder. Their official out-of-scope lists barely overlap, so the cost of choosing wrong is not "I picked something too easy" — it is **holding a certificate that attests to work you don't do**. And in August 2026 there is an extra constraint: one of them is counting down to retirement.

For prices and validity across vendors, see [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en) — not repeated here.

## The three, side by side

| | [AIF-C01](https://aws.amazon.com/certification/certified-ai-practitioner/) | [MLA-C01](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/) | [AIP-C01](https://aws.amazon.com/certification/certified-generative-ai-developer-professional) |
|---|---|---|---|
| Level | Foundational | Associate | Professional |
| Price | $100 | $150 | $300 |
| Duration | 90 min | 130 min | 180 min |
| Questions | 65 (50 scored) | 65 (50 scored) | 75 (65 scored) |
| Passing score | 700 | **720** | **750** |
| Question types | Multiple choice, multiple response, ordering, matching | Multiple choice, multiple response, **ordering, matching** | Multiple choice and multiple response only |
| Validity | 3 years | 3 years | 3 years |
| Languages | 12, **including Traditional Chinese** | English, Japanese, Korean, Simplified Chinese | English, Japanese, Korean, Simplified Chinese |
| Recommended experience | Up to 6 months of exposure; "uses but does not necessarily build" | **1 year with SageMaker + 1 year in a related role** (backend dev, DevOps, data engineer, data scientist) | 2 years production development + 1 year GenAI implementation |
| Current status | Exam guide v1.1 (2026-04-30) | **English version retires 2026-09-28** | Refreshed 2026-03, includes AgentCore |

Passing scores climb 700 / 720 / 750. All three use compensatory scoring — no per-domain minimum.

**One question-type boundary is easy to miss.** AIF-C01 and MLA-C01 both include ordering (arrange 3–5 steps) and matching (3–7 pairs), and both are all-or-nothing — partial credit does not exist. The [AIP-C01 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html) lists only multiple choice and multiple response. **The highest-level exam has the simplest question formats**, so pacing practice does not transfer across all three.

## The time branch: can you still take MLA-C01?

This is the section that actually needs a decision today. The [MLA-C01 certification page](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/) carries this notice at the top:

> This exam is being updated. Registration for the updated version (MLA-C02) opens September 1, 2026. The last day to take the current exam (MLA-C01) in English is September 28, 2026. The current exam in other languages (Korean, Japanese, and Simplified Chinese) will remain available until general availability of MLA-C02.

Counted from today, 2026-08-19:

| Event | Date | From today |
|---|---|---|
| MLA-C02 registration opens | 2026-09-01 | **13 days** |
| Last day for MLA-C01 in English | 2026-09-28 | **40 days** (5 weeks 5 days) |
| Last day for MLA-C01 in Japanese / Korean / Simplified Chinese | Until MLA-C02 general availability | **No date published** |

### English candidates: 40 days is not enough, so this path is closed for most

The four domains in the [MLA-C01 exam guide](https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01.html) weigh 28 / 26 / 22 / 24 — an unusually flat distribution, so there is no low-weight domain you can safely skip. And it is not a knowledge exam: data preparation, model development, deployment and CI/CD orchestration, monitoring and security all require hands-on work.

Using this series' method — **schedule is determined by content volume and experience gap, not by a deadline** — MLA-C01 sits between the two already published: [AIF-C01 is four weeks](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en) (knowledge-only, no hands-on domains, six months of exposure assumed), [AIP-C01 is ten weeks](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en) (professional, heavy hands-on chapters, three years of experience assumed). MLA-C01 is associate-level, hands-on across all four domains, with two years of relevant experience assumed — **a reasonable range is six to eight weeks at 6–8 hours per week**.

Forty days is about 5 weeks and 5 days, and those 40 days also have to absorb scheduling the test, travel, and slack. **The schedule doesn't fit, so for most people the answer is: do not start preparing for MLA-C01 in English now.**

**The one exception** is someone already doing SageMaker ML engineering whose experience matches the official target candidate description exactly (1 year SageMaker + 1 year backend/DevOps/data engineering/data science). That person doesn't need six to eight weeks of learning — they need two or three weeks of mapping their experience onto the exam guide and adapting to the question formats, and booking now still works. The test is simple: read all four domains in the exam guide; if more than a third of the task statements are things you have never done, you are not the exception.

Note the logic here: **the schedule is not being compressed because the exam is retiring — the path is closed because the schedule cannot be compressed.** The deadline is a branch condition, never a reason to hand you a plan you can't finish.

### Japanese / Korean / Simplified Chinese candidates: the window really is longer

This is a genuine difference and rarely stated. The official notice says the Japanese, Korean, and Simplified Chinese versions "will remain available until general availability of MLA-C02" — those candidates are **not bound by the September 28 line** and can go up to C02's general availability.

Three limits on that, though:

- **AWS has not published a GA date for C02.** September 1 is when registration opens, which is not the same as availability. So the window is "longer than 40 days," not "another six months."
- Treat "GA could be announced at any time" as a scheduling risk. A six-to-eight-week plan is fine, but **book the exam date as early in the plan as you can** rather than at the end.
- **Traditional Chinese is not on that list.** MLA-C01 is offered in English, Japanese, Korean, and Simplified Chinese only; the sole exam of the three with Traditional Chinese is AIF-C01.

### Two codes in conflict: MLA-C02 or ME1-C02

**The same page carries two new codes, and AWS does not state how they relate.** The notice above says MLA-C02. A separate line on that page says:

> The beta exam (ME1-C02) will be available in English only. At general availability, the exam will be offered in English, Korean, Japanese, and Simplified Chinese.

So MLA-C02 and ME1-C02 sit on one page, and **the GA language lists in the two passages match** (English, Korean, Japanese, Simplified Chinese), which looks like two names for one exam — beta as ME1-C02, GA as MLA-C02, perhaps. But **no sentence on the official page connects them.**

This series' rule for conflicting or under-specified official sources is to cite both and mark it uncertain rather than pick one and present it as fact. So:

- **Certain**: something opens for registration on September 1; the beta is English-only; GA covers four languages.
- **Uncertain**: whether MLA-C02 and ME1-C02 are the same exam; whether what opens on September 1 is the beta or the standard version; when GA is.
- **Practical effect**: check the exam code on the registration page before you pay. Do not assume "it's just the new ML one." Beta exams typically have more questions, longer duration, and delayed score reports; the registration page will state those.

### C02's exam guide is unpublished

The official exam guide URL for `machine-learning-engineer-associate-02` still returns 404 as of today (checked 2026-08-19). **No exam guide means no preparation path** — any "MLA-C02 study guide" circulating right now has no official basis.

So if you want the associate tier, the rational move is to **wait for September 1**. The certification page says so itself: "Check back here on September 1 for more information about the MLA-C02 exam and exam preparation resources." Thirteen days for a published outline beats forty days gambling on an exam that is about to retire.

## What the three actually test

Retirement aside, the boundaries between these three are unusually clean, because each publishes an out-of-scope list and the three lists barely conflict.

| | AIF-C01 | MLA-C01 | AIP-C01 |
|---|---|---|---|
| In one line | Can you talk about it | Can you put ML into production | Can you integrate someone else's models |
| Domain weights | 20 / 24 / 28 / 14 / 14 | 28 / 26 / 22 / 24 | 31 / 26 / 20 / 12 / 11 |
| Heaviest domain | Applications of foundation models (28%) | Data preparation for ML (28%) | FM integration, data management, compliance (31%) |
| Explicitly **not** tested | Writing models or algorithms; data and feature engineering; hyperparameter tuning; building AI/ML pipelines or infrastructure; mathematical or statistical analysis of models; implementing security and compliance protocols; developing governance frameworks | Designing and architecting end-to-end ML solutions; setting best practices and guiding ML strategy; integrating a wide array of services or new tools; working deeply in two or more ML domains; quantizing models and analyzing accuracy impact | Model development and training; advanced ML techniques; data engineering and feature engineering |

Read the three exclusion lists together and the boundaries fall out:

- **Nearly every item AIF-C01 excludes is an MLA-C01 in-scope task.** Hyperparameter tuning, pipelines, feature engineering — AIF doesn't test them, MLA tests all of them.
- **Nearly every item AIP-C01 excludes is MLA-C01's core.** Model development and training, advanced ML, data and feature engineering — AIP excludes them outright, MLA is built on them.
- **So MLA and AIP are not senior and junior; they are left and right.** MLA is "train and operate your own models"; AIP is "integrate someone else's foundation models." Take MLA to prove GenAI application skill and what you hold certifies SageMaker training and deployment instead. Take AIP to prove ML engineering skill and the guide explicitly says training is out of scope.
- **AIF's relationship to the other two genuinely is hierarchical**: its exclusion list is their job description, which is why it's the one exam all three audiences can start with.

A quick heuristic: "I want to prove I can build RAG / agents / LLM applications" → AIP. "I want to prove I can train models and ship ML pipelines" → MLA. "I want to hold my own in conversations with the AI team" → AIF. **No two of those sentences point at the same exam.**

## The renewal graph decides the order

This is the least-written and most money-saving part. Per the [official recertification page](https://aws.amazon.com/certification/recertification/):

| What you hold | How to renew (all +3 years) |
|---|---|
| AIF-C01 | Retake AIF-C01, **or pass MLA-C01**, **or pass AIP-C01** |
| MLA-C01 | Retake MLA-C01, **or pass AIP-C01** |
| AIP-C01 | Retake AIP-C01 only |

And [passing AIP-C01 renews AIF-C01, MLA-C01, and Data Engineer – Associate](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en) for three years each. That graph has three directional consequences:

**One: if AIP-C01 is in your future, take AIF-C01 early.** The $100 exam never becomes a maintenance burden — pass AIP within three years and AIF renews itself. Conversely, "I'll hold off on AIF and do them together" saves nothing; it just delays the credential by three years.

**Two: AIP-C01 is the only one with no upstream exam.** It renews three certifications and can only be renewed by retaking it (at 50% off via the voucher in your AWS Certification Account, so $150). In long-run cost terms, AIP is the recurring three-year expense and the others are its byproducts.

**Three: "take MLA to renew AIF" no longer works.** The path exists on the graph, but MLA-C01 in English retires September 28, and MLA-C02's renewal rules have not been published — renewal tables usually change when a code changes, and that won't be knowable until after September 1. Rushing an MLA-C01 in 40 days purely for renewal value does not pencil out.

Two global rules worth repeating: **none of the three offers a "take a course instead" renewal** (AWS's maintain option covers only SAA, Developer, CloudOps, SAP, and DOP), and **you cannot retake the same exam within two years of passing it**, so early renewal by retaking is also out.

## Decision paths, as of late August 2026

**You build GenAI applications (RAG, agents, LLM integration)**
→ AIP-C01. Unaffected by the retirement, and the exam guide already includes AgentCore. If your experience falls short, build first; the [ten-week schedule](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en) explains its derivation. Adding AIF-C01 as a cheap first credential is fine — AIP renews it anyway.

**You do ML engineering (training, deployment, pipelines, monitoring)**
→ **Wait for September 1**, unless your experience matches the official target candidate description exactly and you can book a seat before September 28. Once C02's guide is published you can plan six to eight weeks properly, which beats gambling on 40 days.

**You are testing in Japanese, Korean, or Simplified Chinese**
→ The MLA-C01 window is still open, but GA has no announced date. If you take this path, **plan now and book the exam early in your schedule**, not at the end.

**You are a PM, in sales, or in compliance — or an engineer building vocabulary first**
→ AIF-C01. The only one of the three in Traditional Chinese, $100, and since v1.1 the outline includes MCP and agentic AI (see the v1.1 change table in the [preparation path](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en)).

**Your goal is to prove multi-agent system skill**
→ None of these three is the direct answer. The closest thing in the AWS line is the agentic AI content in AIP-C01's domain 2 (7 skill statements inside that 26%); for the cross-vendor comparison see [what multi-agent architecture certifications actually share](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains-en).

**Your company isn't primarily on AWS**
→ Pick the cloud first, then the certification. Google's ecosystem has exactly one relevant exam, [PMLE](/posts/ai/2026-08-18-google-pmle-prep-guide-en), and its rules — especially the retake penalties — differ sharply from AWS's.

## What will go stale (check here next time)

| Item | Status (verified 2026-08-19) | When to recheck |
|---|---|---|
| MLA-C01 English retirement date | 2026-09-28 | After the September 1 update |
| MLA-C02 registration opening | 2026-09-01 | On September 1 |
| MLA-C02 / ME1-C02 code relationship | Both on one page, unexplained | After September 1 |
| MLA-C02 exam guide | URL returns 404 | After September 1 |
| MLA-C02 GA date and languages | No GA date; four languages at GA | After September 1 |
| Renewal graph | AIP renews AIF / MLA / DEA | Must recheck once C02 ships |
| Prices | $100 / $150 / $300 | Quarterly |
| Passing scores | 700 / 720 / 750 | Each revision |

## References

- [AWS Certified Machine Learning Engineer – Associate certification page (carries both the MLA-C02 and ME1-C02 notices)](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/)
- [MLA-C01 official exam guide (four domain weights, 720 passing score, question types)](https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01.html)
- [AWS Certified AI Practitioner certification page](https://aws.amazon.com/certification/certified-ai-practitioner/)
- [AIF-C01 official exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html)
- [AWS Certified Generative AI Developer – Professional certification page](https://aws.amazon.com/certification/certified-generative-ai-developer-professional)
- [AIP-C01 official exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html)
- [AWS Recertification (renewal paths and the 50% voucher)](https://aws.amazon.com/certification/recertification/)
- [AWS Certification — After Testing (retake policy)](https://aws.amazon.com/certification/policies/after-testing/)
- [AWS Skill Builder — MLA-C01 Exam Prep](https://skillbuilder.aws/category/exam-prep/machine-learning-engineer-associate-MLA-C01)

**Related on this site**

- [AWS AI Practitioner (AIF-C01) preparation path](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en)
- [AWS GenAI Developer Professional (AIP-C01) preparation path](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en)
- [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)
- [Multi-agent architecture across exam domains](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains-en)
- [Google PMLE preparation path](/posts/ai/2026-08-18-google-pmle-prep-guide-en)
