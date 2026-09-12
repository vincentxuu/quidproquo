---
title: "Choosing Among the Three AWS AI Certifications: Current Guidance After MLA-C02 Beta Opens"
date: 2026-08-19
type: guide
category: ai
tags: [certification, aws, career, generative-ai]
lang: en
series:
  name: "AI Certification Prep"
  order: 21
tldr: "AIF-C01, MLA-C02, and AIP-C01 are not a difficulty ladder but three job-function slices: AIF tests AI business judgment, MLA tests whether you can put traditional ML, foundation models, and agentic workflows into production, and AIP tests whether you can integrate foundation models into a GenAI system. The MLA-C02 English beta is open for registration; general-availability dates and non-English versions remain unannounced."
description: "A guide to choosing among AWS's three AI certifications (AIF-C01 / MLA-C02 / AIP-C01), using official scope and domain weights, the MLA-C02 beta status, and current renewal paths."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-19-aws-certifications-which-one)
>
> This is a selection guide built from official material, not an exam-day account — I have not sat these exams. Every "what it tests" points back to the official exam guides and every spec points back to the official certification pages. No leaked questions. Last checked 2026-09-12.

The series already covers the preparation paths for [AIF-C01](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en) and [AIP-C01](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en). This post handles the trade-off between them and Machine Learning Engineer – Associate, now updated to MLA-C02.

**The conclusion first**: these three are not a beginner/intermediate/advanced ladder. Their official job scopes barely overlap, so the cost of choosing wrong is not "I picked something too easy" — it is **holding a certificate that attests to work you don't do**. The current variable is MLA-C02's beta: English beta registration is open, while general availability and other-language dates are still unannounced.

For prices and validity across vendors, see [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en) — not repeated here.

## The three, side by side

| | [AIF-C01](https://aws.amazon.com/certification/certified-ai-practitioner/) | [MLA-C02](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/) | [AIP-C01](https://aws.amazon.com/certification/certified-generative-ai-developer-professional) |
|---|---|---|---|
| Level | Foundational | Associate | Professional |
| Price | $100 | $75 beta; $150 GA | $300 |
| Duration | 90 min | 170 min beta; see guide for GA specification | 180 min |
| Questions | 65 (50 scored) | 85 beta; 65 (50 scored) GA | 75 (65 scored) |
| Passing score | 700 | **720** at GA; not applicable to beta | **750** |
| Question types | Multiple choice, multiple response, ordering, matching | Multiple choice and multiple response | Multiple choice and multiple response only |
| Validity | 3 years | 3 years | 3 years |
| Languages | 12, **including Traditional Chinese** | English-only beta; English, Japanese, Korean, Simplified Chinese at GA | English, Japanese, Korean, Simplified Chinese |
| Recommended experience | Up to 6 months of exposure; "uses but does not necessarily build" | **1 year with SageMaker AI, Bedrock, and other ML services + 1 year in a related role** | 2 years production development + 1 year GenAI implementation |
| Current status | Exam guide v1.1 (2026-04-30) | English beta registration open; delivery starts 2026-09-29 | Refreshed 2026-03, includes AgentCore |

The GA passing scores climb 700 / 720 / 750. All three use compensatory scoring with no per-domain minimum; MLA-C02 beta does not use the GA passing score.

**The question-type boundary has changed.** AIF-C01 retains ordering and matching, both all-or-nothing. [MLA-C02](https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-02/machine-learning-engineer-associate-02.html) and [AIP-C01](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html) list multiple choice and multiple response only. Pacing practice still does not transfer across all three, but MLA is no longer the more complex format.

## The time branch: can you take MLA-C02 now?

The [official certification page](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/) now makes the status clear: the English MLA-C02 beta is open for registration under exam code **ME1-C02**, with delivery beginning September 29. It costs $75, runs 170 minutes, and has 85 questions. General-availability registration and delivery dates remain TBD; Japanese, Korean, and Simplified Chinese arrive at GA.

That resolves the old code question: **MLA-C02 is the updated certification and ME1-C02 is the current beta exam code.** The exam guide is published. Its four domains remain, but the scope now includes foundation models, Bedrock, RAG, agentic workflows, and observability for those workflows.

English candidates no longer need to compress a study plan around the C01 deadline. If you already meet AWS's recommended experience and accept the beta's 85-question format and score process, assess ME1-C02 beta. Otherwise prepare against the published C02 guide and wait for GA. Japanese, Korean, and Simplified Chinese candidates can still choose C01 until C02 GA, but an unannounced date is not an unlimited window.

MLA-C02 remains a hands-on associate exam. AWS targets candidates with at least one year using SageMaker AI, Bedrock, and other ML engineering services plus one year in a related role; it also expects both traditional ML and GenAI experience. Build that experience before scheduling if you do not have it.

## What the three actually test

MLA-C02 adds GenAI overlap to the MLA/AIP boundary, but their job functions remain different: MLA operationalizes models, foundation models, and agentic workflows in an ML system; AIP integrates existing foundation models into GenAI applications.

| | AIF-C01 | MLA-C02 | AIP-C01 |
|---|---|---|---|
| In one line | Can you talk about it | Can you put ML into production | Can you integrate someone else's models |
| Domain weights | 20 / 24 / 28 / 14 / 14 | 28 / 24 / 24 / 24 | 31 / 26 / 20 / 12 / 11 |
| Heaviest domain | Applications of foundation models (28%) | Data preparation for ML and AI (28%) | FM integration, data management, compliance (31%) |
| Explicitly **not** tested | Writing models or algorithms; data and feature engineering; hyperparameter tuning; building AI/ML pipelines or infrastructure; mathematical or statistical analysis of models; implementing security and compliance protocols; developing governance frameworks | Designing full end-to-end AI/ML architectures; setting best practices and guiding ML strategies; broad service integration; working deeply in two or more ML domains | Model development and training; advanced ML techniques; data engineering and feature engineering |

Read the three exclusion lists together and the boundaries fall out:

- **Nearly every item AIF-C01 excludes is an MLA-C02 in-scope task.** Hyperparameter tuning, pipelines, feature engineering — AIF does not test them; MLA does.
- **AIP-C01 excludes model development, training, and data and feature engineering, all still core MLA-C02 work.** MLA-C02 now also includes Bedrock, RAG, and agentic workflows, so it is no longer only a SageMaker exam.
- **MLA and AIP are not senior and junior; they are left and right.** MLA builds, deploys, and operates AI/ML workflows; AIP integrates foundation models into GenAI applications. Both touch GenAI, but MLA still demands model-lifecycle, data, and MLOps skills.
- **AIF's relationship to the other two genuinely is hierarchical**: its exclusion list is their job description, which is why it's the one exam all three audiences can start with.

A quick heuristic: "I want to prove I can build RAG / agents / LLM applications" → AIP. "I want to prove I can train models and ship ML pipelines" → MLA. "I want to hold my own in conversations with the AI team" → AIF. **No two of those sentences point at the same exam.**

## The renewal graph decides the order

This is the least-written and most money-saving part. Per the [official recertification page](https://aws.amazon.com/certification/recertification/):

| What you hold | How to renew (all +3 years) |
|---|---|
| AIF-C01 | Retake AIF-C01, **or pass the latest MLA exam**, **or pass AIP-C01** |
| MLA | Retake the latest MLA exam, **or pass AIP-C01** |
| AIP-C01 | Retake AIP-C01 only |

And [passing AIP-C01 renews AIF-C01, MLA, and Data Engineer – Associate](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en) for three years each. That graph has three directional consequences:

**One: if AIP-C01 is in your future, take AIF-C01 early.** The $100 exam never becomes a maintenance burden — pass AIP within three years and AIF renews itself. Conversely, "I'll hold off on AIF and do them together" saves nothing; it just delays the credential by three years.

**Two: AIP-C01 is the only one with no upstream exam.** It renews three certifications and can only be renewed by retaking it (at 50% off via the voucher in your AWS Certification Account, so $150). In long-run cost terms, AIP is the recurring three-year expense and the others are its byproducts.

**Three: MLA still renews AIF.** AWS now says to pass the latest Machine Learning Engineer – Associate exam, so the C02 general release follows the same route. Do not rush C01 for renewal alone; treat MLA as proof of ML engineering work you already need.

Two global rules worth repeating: **none of the three offers a "take a course instead" renewal** (AWS's maintain option covers only SAA, Developer, CloudOps, SAP, and DOP), and **you cannot retake the same exam within two years of passing it**, so early renewal by retaking is also out.

## Decision paths, as of September 2026

**You build GenAI applications (RAG, agents, LLM integration)**
→ AIP-C01. Unaffected by the retirement, and the exam guide already includes AgentCore. If your experience falls short, build first; the [ten-week schedule](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en) explains its derivation. Adding AIF-C01 as a cheap first credential is fine — AIP renews it anyway.

**You do ML engineering (training, deployment, pipelines, monitoring)**
→ MLA-C02. English readers who meet AWS's experience target can assess ME1-C02 beta; everyone else should prepare against the current guide and wait for GA. It now includes traditional ML, foundation models, and agentic workflows, so it is not just the old SageMaker exam.

**You are testing in Japanese, Korean, or Simplified Chinese**
→ C01 remains available until C02 GA, but GA has no announced date. Book early in the plan; taking the updated exam requires waiting for the relevant language at GA.

**You are a PM, in sales, or in compliance — or an engineer building vocabulary first**
→ AIF-C01. The only one of the three in Traditional Chinese, $100, and since v1.1 the outline includes MCP and agentic AI (see the v1.1 change table in the [preparation path](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en)).

**Your goal is to prove multi-agent system skill**
→ None of these three is the direct answer. The closest thing in the AWS line is the agentic AI content in AIP-C01's domain 2 (7 skill statements inside that 26%); for the cross-vendor comparison see [what multi-agent architecture certifications actually share](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains-en).

**Your company isn't primarily on AWS**
→ Pick the cloud first, then the certification. Google's ecosystem has exactly one relevant exam, [PMLE](/posts/ai/2026-08-18-google-pmle-prep-guide-en), and its rules — especially the retake penalties — differ sharply from AWS's.

## What will go stale (check here next time)

| Item | Status (verified 2026-09-12) | When to recheck |
|---|---|---|
| MLA-C01 English retirement date | 2026-09-28 | Remove after September 28 |
| MLA-C02 beta | Registration open; ME1-C02, English, $75 | Beta close and GA announcement |
| MLA-C02 general availability | Registration and delivery both TBD | AWS announcement |
| MLA-C02 exam guide | Published; four domains at 28 / 24 / 24 / 24 | Each revision |
| MLA-C02 GA languages | English, Japanese, Korean, Simplified Chinese; date unannounced | AWS announcement |
| Renewal graph | AIP renews AIF / latest MLA / DEA | Each certification revision |
| Prices | $100 / $150 / $300 | Quarterly |
| Passing scores | 700 / 720 / 750 | Each revision |

## Update history

- 2026-09-12: Updated MLA specifications, exam scope, code relationship, renewal table, and decision paths after English MLA-C02 beta registration opened.

## References

- [AWS Certified Machine Learning Engineer – Associate certification page (MLA-C02 beta and GA status)](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/)
- [MLA-C02 official exam guide (new scope, domain weights, question types, and passing score)](https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-02/machine-learning-engineer-associate-02.html)
- [AWS Certified AI Practitioner certification page](https://aws.amazon.com/certification/certified-ai-practitioner/)
- [AIF-C01 official exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html)
- [AWS Certified Generative AI Developer – Professional certification page](https://aws.amazon.com/certification/certified-generative-ai-developer-professional)
- [AIP-C01 official exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html)
- [AWS Recertification (renewal paths and the 50% voucher)](https://aws.amazon.com/certification/recertification/)
- [AWS Certification — After Testing (retake policy)](https://aws.amazon.com/certification/policies/after-testing/)
- [AWS Skill Builder — MLA-C02 Exam Prep](https://skillbuilder.aws/category/exam-prep/machine-learning-engineer-associate-MLA-C02)

**Related on this site**

- [AWS AI Practitioner (AIF-C01) preparation path](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en)
- [AWS GenAI Developer Professional (AIP-C01) preparation path](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en)
- [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)
- [Multi-agent architecture across exam domains](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains-en)
- [Google PMLE preparation path](/posts/ai/2026-08-18-google-pmle-prep-guide-en)
