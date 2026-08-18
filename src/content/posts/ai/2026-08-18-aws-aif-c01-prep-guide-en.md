---
title: "AWS AI Practitioner (AIF-C01): v1.1 Turned It Into an Agentic AI Exam"
date: 2026-08-18
type: guide
category: ai
tags: [certification, aws, generative-ai, career]
lang: en
series:
  name: "AI Certification Prep"
  order: 1
tldr: "The AIF-C01 exam guide moved to v1.1 on April 30, 2026, adding seven objectives at once — MCP, multi-agent patterns, context engineering, token-based pricing, and hallucination detection all became testable, and Bedrock AgentCore, Kiro, and Strands Agents joined the in-scope services. Almost every summary in circulation describes the older version. This guide builds a four-week path on the official five-domain weighting (20/24/28/14/14). Official specs: $100, 90 minutes, 65 questions (50 scored), pass at 700, valid 3 years — and it is the only exam in this series offered in Traditional Chinese."
description: "A preparation guide for AWS Certified AI Practitioner (AIF-C01) built on exam guide v1.1: domain-by-domain breakdown against the official five-domain weighting, the seven objectives and service-list changes v1.1 introduced, a four-week schedule with its derivation, retake and renewal rules, and who the certification is and isn't for."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)
>
> This is a preparation path built from official material, not an exam-day account — I have not sat this exam. Every "what it tests" points back to the [official exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html), and every "how to prepare" points to official AWS training. No leaked questions. Verified 2026-08-18 against exam guide **v1.1**.

AIF-C01 is the cheapest AI certification in the AWS catalog at $100, and **the one most likely to be misrepresented by the material you find** — because it moved to v1.1 on April 30, 2026, and nearly every summary online still describes the older outline.

For prices, validity, and gates across vendors, see [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en) — not repeated here.

## Who This Is For

**AWS is blunt: the target candidate is not an engineer.** The official exam guide states the recommended experience as:

> up to 6 months of exposure to AI/ML technologies on AWS. The target candidate uses but does not necessarily build AI/ML solutions on AWS.

Uses, does not necessarily build. The out-of-scope list is even clearer — **none** of the following is tested: coding models or algorithms, data engineering and feature engineering, hyperparameter tuning, building AI/ML pipelines or infrastructure, mathematical or statistical analysis of models, implementing security or compliance protocols, developing governance frameworks.

So:

**A fit** for PMs, sales, marketing, and compliance people who need to talk to an AI team, or for engineers new to AWS AI services who want the vocabulary in one pass. **It is the only exam in this series offered in Traditional Chinese**, which is a real advantage if you would rather not spend effort on English terminology.

**Not a fit** for proving engineering ability. Almost every item on its exclusion list is an in-scope MLA-C01 task, which makes the boundary unusually clean: **AIF tests whether you can describe it, MLA tests whether you can build it.**

**One reason an engineer might still take it**: it sits at the bottom of the AWS AI renewal graph. Passing MLA-C01 or AIP-C01 renews AIF-C01 automatically for three years, so a $100 credential here never becomes a long-term maintenance burden.

## Official Specs at a Glance

| Item | Detail |
|---|---|
| Fee | $100 |
| Length | 90 minutes (**ESL +30 minutes** available for non-native English speakers taking the English exam) |
| Questions | 65, of which **50 are scored and 15 unscored** (not identified on the exam) |
| Question types | Multiple choice, multiple response, **ordering**, **matching** |
| Passing score | Scaled **700** (range 100–1,000), compensatory — no per-domain minimum |
| Validity | 3 years |
| Languages | 12, **including Traditional Chinese** |
| Prerequisites | None |

**The question types deserve attention.** Ordering asks you to place 3–5 responses in the correct sequence; matching asks you to pair 3–7 prompts, and you must get every pair right for credit. **Both are all-or-nothing**, like multiple response. Many summaries list only multiple choice and multiple response, and walking in with that expectation is how ordering questions eat your clock.

For contrast, AIP-C01 in the same AWS AI track has multiple choice and multiple response only.

## The Five Domain Weights

| Domain | Weight |
|---|---|
| 1. Fundamentals of AI and ML | 20% |
| 2. Fundamentals of GenAI | 24% |
| 3. Applications of Foundation Models | **28%** |
| 4. Guidelines for Responsible AI | 14% |
| 5. Security, Compliance, and Governance for AI Solutions | 14% |

**Domains 2 and 3 total 52%.** More than half the exam is GenAI and foundation-model application; classical ML concepts are only 20%. Time spent on RAG, prompt engineering, FM evaluation, and customization tradeoffs pays better than memorizing ML algorithms.

## What v1.1 Changed (This Section Decides Whether Your Material Is Usable)

The [official revisions page](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html) gives the change history: v1.0 on March 26, 2026, **v1.1 on April 30, 2026**. The same page notes that "Exam guide updates will be published approximately one month before updates will be reflected on your exam" — so from roughly the end of May, questions follow v1.1.

**Seven objectives were added**, none of which existed in the 2024 outline:

| Objective | Content |
|---|---|
| 1.2.6 | When traditional ML versus foundation models is appropriate (regulatory concerns, explainability, operational constraints) |
| 2.1.4 | The **token-based pricing model** and its effect on cost and inference performance |
| 2.1.5 | The role of **context engineering** in FM applications |
| 2.1.6 | **Foundational agentic AI concepts**: multi-agent system patterns, **MCP** and its role connecting agents to external systems, multi-agent communication patterns, memory management, tool usage, workflow orchestration |
| 3.2.5 | Prompt versioning and management with **Bedrock Prompt Management** |
| 3.4.5 | Business objective alignment metrics (task completion rate, user satisfaction, cost per interaction) |
| 5.1.5 | **Hallucination detection and grounding** (RAG grounding, output validation, confidence scoring) |

**The service list moved too.** Added to in-scope: Amazon Aurora, **Bedrock AgentCore**, **Kiro**, **Strands Agents**, Amazon Q, SageMaker JumpStart, AWS Transform. Removed: Amazon MemoryDB. Objective 2.3.1 used to name Bedrock PartyRock and Bedrock Data Automation — **v1.1 replaced both**.

One more detail that quietly costs points: objective 1.3.6 listed **AUC** in v1.0 and now lists **precision and recall**. Flashcard decks are still drilling AUC.

**Fastest way to test whether your material is current**: search its table of contents for MCP, AgentCore, Kiro, Strands Agents, context engineering. If none appear, it predates v1.1.

## Domain by Domain

### Domain 1: Fundamentals of AI and ML (20%)

**What it tests**: defining and differentiating AI, ML, deep learning, neural networks, CV, NLP, model, algorithm, training and inferencing, bias, fairness, fit, LLM, GenAI, and **agentic AI**; inferencing types (batch, real-time, **asynchronous, serverless**); data and learning types; where AI does and does not add value; **traditional ML versus FMs**; capabilities of AWS managed AI services (SageMaker AI, Transcribe, Translate, Comprehend, Lex, Polly); services per AI/ML pipeline stage (Bedrock, Amazon Q, Amazon Quick, **Kiro**, SageMaker AI); MLOps concepts; model metrics (accuracy, **precision, recall**, F1) and business metrics.

**How to prepare**: pure concepts — being able to explain each term in one sentence is enough. **The point is boundaries, not depth**: questions ask "should this use AI at all" and "traditional ML or an FM," and the answer turns on regulation, explainability, and operational constraints rather than on which technology is newer.

### Domain 2: Fundamentals of GenAI (24%)

**What it tests**: tokens, chunking, embeddings, vectors, prompt engineering, transformers, FMs, multi-modal and diffusion models; GenAI use cases; the **FM lifecycle** (data selection → model selection → pre-training → fine-tuning → evaluation → deployment → feedback); **token-based pricing and its cost/performance effects**; **context engineering**; **agentic AI concepts and MCP**; advantages and limitations (hallucination, interpretability, nondeterminism); model selection factors including **cost, latency, model complexity**; AWS GenAI services (Bedrock, SageMaker AI, JumpStart, Amazon Quick, Kiro, **Strands Agents**, **Bedrock AgentCore**).

**How to prepare**: half of v1.1's new content lands here. For the MCP and multi-agent objective (2.1.6), watch MCP actually work once — [the harness layer of agent security](/posts/ai/2026-08-10-agent-security-harness-layer-en) on this site gives the practical context. For token pricing, be able to do the arithmetic: how much does the same task cost after switching models or compressing the prompt.

### Domain 3: Applications of Foundation Models (28%, the heaviest)

**What it tests**: FM selection criteria (cost, modality, latency, multi-lingual, model size, complexity, customization, input/output length, **prompt caching**); inference parameters; **RAG and Bedrock Knowledge Bases**; vector store services (OpenSearch Service, Aurora, Neptune, RDS for PostgreSQL); cost tradeoffs across customization approaches (pre-training, fine-tuning, in-context learning, RAG, **model distillation**); the role and business applications of AI agents; prompt techniques (chain-of-thought, zero/single/few-shot, templates) and risks (exposure, poisoning, hijacking, jailbreaking); **prompt versioning with Bedrock Prompt Management**; training and fine-tuning methods including **RLHF**; FM evaluation (**human-in-the-loop**, benchmark datasets, Bedrock Model Evaluation, ROUGE/BLEU/BERTScore/**LLM-as-a-judge**), **evaluating applications built with FMs (RAG, agents, workflows)**, and **business alignment metrics**.

**How to prepare**: the heaviest domain and the best investment. Be able to rank the four customization approaches (pre-training, fine-tuning, in-context learning, RAG) by cost and by fit — that comparison is the domain's highest-frequency question shape. For the evaluation objectives, [RAG evaluation frameworks](/posts/ai/2026-03-12-rag-evaluation-frameworks-en) on this site separates what ROUGE, BLEU, BERTScore, and LLM-as-a-judge each actually measure.

### Domain 4: Guidelines for Responsible AI (14%)

**What it tests**: features of responsible AI (bias, fairness, inclusivity, robustness, safety, veracity); **Bedrock Guardrails**; environmental and sustainability considerations in model selection; legal risks of GenAI (IP infringement, biased outputs, loss of trust, hallucinations); dataset characteristics; effects of bias and variance (overfitting, underfitting); detection tooling (label-quality analysis, human audits, subgroup analysis); transparency and explainability (SageMaker Model Cards, **SageMaker Clarify**, Bedrock Model Evaluations); the interpretability-versus-performance tradeoff; **human-centered design (user-feedback mechanisms, AI decision transparency)**.

**How to prepare**: mostly conceptual, but be precise about bias, variance, overfitting, and underfitting — that quartet is the most commonly conflated set in the domain.

### Domain 5: Security, Compliance, and Governance (14%)

**What it tests**: IAM roles and policies, encryption, Macie, PrivateLink, the shared responsibility model, **Bedrock AgentCore Identity and Policy in AgentCore**, **Bedrock Guardrails**; source citation and data provenance (lineage, cataloging, Model Cards); secure data engineering; security and privacy considerations (application security, threat detection, vulnerability management, **prompt injection**, encryption in transit and at rest, **data leakage prevention, output filtering and validation, audit trails and logging for AI interactions, toxicity**); **hallucination detection and grounding**; governance and compliance (AWS Config, Inspector, Artifact, CloudTrail, Trusted Advisor, data lifecycle and residency, the **Generative AI Security Scoping Matrix**).

**How to prepare**: domains 4 and 5 together are 28% — as heavy as domain 3 — and are where most candidates under-prepare. The **Generative AI Security Scoping Matrix** is an AWS framework named directly in the guide and worth reading on its own.

## A Four-Week Schedule and Its Derivation

**Derivation**: this is a knowledge exam. AWS assumes a candidate who uses rather than builds, and no domain requires training or deploying anything, so the schedule follows **content volume** rather than hands-on time. Weights set the allocation; domain 3 gets the most, and domains 4 and 5 combine.

At 5–8 hours a week over four weeks:

| Week | Content | Reasoning |
|---|---|---|
| 1 | Read exam guide v1.1 end to end + Domain 1 (20%) | First confirm your existing mental model isn't the old version |
| 2 | Domain 2 (24%), focused on v1.1's four additions (token pricing, context engineering, agentic AI/MCP, FM lifecycle) | Highest density of new objectives |
| 3 | **Domain 3 (28%)** | Heaviest domain, its own week |
| 4 | Domains 4 + 5 (28% combined) + the official practice question set + review | Both are conceptual and combine cleanly |

**Why four weeks rather than eight**: compare the [PMLE path](/posts/ai/2026-08-18-google-pmle-prep-guide-en) on this site — professional level, three years of recommended experience, and three domains requiring real training and deployment, hence eight weeks. AIF-C01 assumes six months of exposure, has no hands-on domain, and carries roughly half the content volume.

**Failure is cheap here, so the schedule can be aggressive.** The AWS [retake policy](https://aws.amazon.com/certification/policies/after-testing/) is a 14-day wait with **no limit on attempts** (full fee each time). That is a completely different risk structure from Google's four-attempts-per-two-years with a 365-day wait before a fourth try — at $100 a sitting, trial and error is affordable on AWS.

**Priority of official material**: the [Exam Prep Plan (AIF-C01)](https://skillbuilder.aws/category/exam-prep/ai-practitioner-AIF-C01) — 19 items, 22h 50m, AWS's own recommended path → the **Official Practice Question Set**, free, 20 questions, described by AWS as "developed by AWS, demonstrate the style of our certification exams" → the AI Practitioner Learning Plan (8h). The Official Pretest and Official Practice Exam are badged **Subscription**; AWS states "The Individual subscription starts at $29 USD per month."

## After You Pass: Renewal and Retakes

**Three years, three renewal paths** per the [official recertification page](https://aws.amazon.com/certification/recertification/): retake AIF-C01, **or pass MLA-C01**, **or pass AIP-C01**. Each adds 3 years, and each can use the **50% discount voucher** in your AWS Certification Account.

**There is no "take a course instead" path.** AWS does offer maintain (+1 year via a paid Skill Builder subscription), but only for SAA, Developer, CloudOps, SAP, and DOP — the AIF-C01 row lists exams only.

**You cannot retake the same exam within two years of passing it**, so pre-emptive renewal by re-sitting is not an option unless the exam is reissued under a new code.

## Things That Will Go Stale (Check These Next Time)

| Item | Status as of 2026-08-18 | When to re-check |
|---|---|---|
| Exam guide version | v1.1, published 2026-04-30 | Whenever the revisions page updates |
| Domain weights | 20 / 24 / 28 / 14 / 14 | On every revision |
| In-scope services | Added AgentCore, Kiro, Strands Agents, Aurora, Amazon Q, JumpStart, AWS Transform | On every revision |
| Fee and item count | $100, 65 questions (50 scored), 90 minutes | Quarterly |
| Renewal paths | Three, all voucher-eligible | Every six months |
| Languages | 12, including Traditional Chinese | Every six months |

## References

- [AWS Certified AI Practitioner certification page](https://aws.amazon.com/certification/certified-ai-practitioner/)
- [AIF-C01 official exam guide (HTML)](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html)
- [AIF-C01 exam guide revisions (v1.0 → v1.1, objective by objective)](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html)
- [AWS Skill Builder — AIF-C01 Exam Prep](https://skillbuilder.aws/category/exam-prep/ai-practitioner-AIF-C01)
- [AWS Recertification (renewal paths and the 50% voucher)](https://aws.amazon.com/certification/recertification/)
- [AWS Certification — After Testing (retake policy)](https://aws.amazon.com/certification/policies/after-testing/)
- [AWS Certification — Before Testing (ESL +30 and registration rules)](https://aws.amazon.com/certification/policies/before-testing/)

**Related on this site**

- [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)
- [Preparing for Google PMLE](/posts/ai/2026-08-18-google-pmle-prep-guide-en)
- [Claude Certified Architect Foundations exam guide](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide-en)
