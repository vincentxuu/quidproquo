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
tldr: "The AIF-C01 exam guide moved to v1.1 on April 30, 2026, adding seven objectives — MCP, multi-agent patterns, context engineering, token-based pricing, and hallucination detection all became testable, with Bedrock AgentCore, Kiro, and Strands Agents joining in-scope services. Almost every summary online describes the older version. This guide builds on the official five-domain weighting, integrating AWS's four-step prep method and field-tested advice from 10+ candidates who passed. $100, 90 minutes, 65 questions (50 scored), pass at 700, valid 3 years — the only exam in this series offered in Traditional Chinese."
description: "AWS Certified AI Practitioner (AIF-C01) preparation guide built on exam guide v1.1: domain-by-domain breakdown with community-sourced exam insights, the official four-step study method, AI-assisted study strategies, Skill Builder resource guide, and renewal rules."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)
>
> This is a preparation path built from official material and real candidate experiences, not an exam-day account. Every "what it tests" points back to the [official exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html); "how to prepare" integrates official AWS training and field-tested advice from candidates who passed. Verified 2026-08-18 against exam guide **v1.1**.

AIF-C01 is the cheapest AI certification in the AWS catalog at $100, and **the one most likely to be misrepresented by the material you find** — because it moved to v1.1 on April 30, 2026, and nearly every summary online still describes the older outline.

For prices, validity, and gates across vendors, see [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en) — not repeated here.

## Who This Is For

**The target candidate is not an engineer.** The official exam guide states:

> up to 6 months of exposure to AI/ML technologies on AWS. The target candidate uses but does not necessarily build AI/ML solutions on AWS.

**None** of the following is tested: coding models or algorithms, data engineering and feature engineering, hyperparameter tuning, building AI/ML pipelines or infrastructure, mathematical or statistical analysis of models, implementing security or compliance protocols, developing governance frameworks.

**A fit** for PMs, sales, marketing, and compliance people who need to talk to an AI team, or engineers new to AWS AI services who want the vocabulary in one pass. **It is the only exam in this series offered in Traditional Chinese** — candidates who chose it report acceptable translation quality, and the exam interface lets you switch to the English original on any question.

**Not a fit** for proving engineering ability. **AIF tests whether you can describe it, MLA tests whether you can build it** — the boundary is clean.

**One reason an engineer might still take it**: passing MLA-C01 or AIP-C01 renews AIF-C01 automatically for three years, so a $100 credential here never becomes a long-term maintenance burden. If you already have ML fundamentals from a university course, candidate changken notes that "the ML basics are universal — you only need to learn the AWS AI services (Bedrock, SageMaker, etc.), and [it should be straightforward](https://changken.org/1688/aws-aif-c01-pass/)."

### Prerequisites

The exam guide lists four recommended AWS knowledge areas — **not hard prerequisites, but they affect how fast you read questions**:

- Familiarity with core AWS services (EC2, S3, Lambda, Bedrock, SageMaker AI)
- Understanding of the AWS shared responsibility model
- Basic IAM access management
- AWS service pricing models

If none of these are familiar, run through [Cloud Practitioner Essentials](https://skillbuilder.aws/course/cloud-practitioner-essentials) or [Technical Essentials](https://skillbuilder.aws/course/aws-technical-essentials) first (both free). A Japanese candidate also recommends: "If you have no AWS experience, taking Cloud Practitioner before AIF-C01 is the safer path" ([Zenn](https://zenn.dev/ryno33/articles/7151754dbc769d)).

## Official Specs

| Item | Detail |
|---|---|
| Fee | $100 |
| Length | 90 minutes (**ESL +30 minutes** available for non-native English speakers) |
| Questions | 65, of which **50 are scored and 15 unscored** (not identified) |
| Question types | Multiple choice, multiple response, **ordering**, **matching** |
| Passing score | Scaled **700** (range 100–1,000), compensatory — no per-domain minimum |
| Validity | 3 years |
| Languages | 12, **including Traditional Chinese** (Italian and German retiring after 2026-10-15) |
| Prerequisites | None |

**The question types deserve attention.** Ordering asks you to place 3–5 responses in the correct sequence; matching asks you to pair 3–7 prompts — **both are all-or-nothing**, like multiple response. Many summaries list only multiple choice and multiple response. Multiple candidates report that ordering and matching questions take more time than expected. A Japanese candidate specifically noted a matching format "where the question has multiple blanks, each with its own set of answer choices" — something that never appeared in Udemy practice exams ([Zenn](https://zenn.dev/ryno33/articles/7151754dbc769d)).

**Exam day tips** (consolidated from multiple candidates):

- **Request ESL +30 minutes** even if taking the exam in your native language. Taiwanese candidate KyleLu: "I finished with 40 minutes to spare, enough time to review every answer"
- **Bring two photo IDs** with English names matching your registration — passport is the safest bet
- **Scores are not immediate**: unlike Cloud Practitioner, AIF-C01 results take **6–8 hours** or even the next day. changken's timeline: finished at 9:30 → score posted at 19:00 → Credly badge at 19:22 → congratulations email at 04:26 the next day. Official SLA is 5 business days
- **Test centers run cold**: multiple candidates warn "about 18–20°C, bring a light jacket"
- **Online proctoring works**: Eason took it from home — needs a clean desk and extra monitors unplugged. He [finished in one hour](https://easontechtalk.com/tw/aws-ai-practitioner-exam-in-24-hours/)
- **You get a whiteboard**: the test center provides a plastic sheet and marker. Confusion Matrix is the one topic worth writing out

## Domain Weights and Preparation

| Domain | Weight |
|---|---|
| 1. Fundamentals of AI and ML | 20% |
| 2. Fundamentals of GenAI | 24% |
| 3. Applications of Foundation Models | **28%** |
| 4. Guidelines for Responsible AI | 14% |
| 5. Security, Compliance, and Governance for AI Solutions | 14% |

**Domains 2 and 3 total 52%.** Multiple candidates confirm: when time is limited, prioritize `GenAI → FM Applications → Bedrock → Prompt → RAG → Responsible AI → Security`.

### Domain 1: Fundamentals of AI and ML (20%)

**What it tests**: defining and differentiating AI, ML, deep learning, neural networks, CV, NLP, model, algorithm, training and inferencing, bias, fairness, fit, LLM, GenAI, and **agentic AI**; inferencing types (batch, real-time, **asynchronous, serverless**); data and learning types; where AI adds value and where it doesn't; **traditional ML versus FMs**; capabilities of AWS managed AI services (SageMaker AI, Transcribe, Translate, Comprehend, Lex, Polly); services per AI/ML pipeline stage (Bedrock, Amazon Q, Amazon Quick, **Kiro**, SageMaker AI); MLOps concepts; model metrics (accuracy, **precision, recall**, F1) and business metrics.

**How to prepare**: pure concepts — one sentence per term is enough. But the TechCerted candidate warns: "Domain 1 goes deeper on ML theory than the word practitioner implies." The exam doesn't ask definitions — it asks you to **pick the right metric for a specific scenario**: "False negatives are far more costly than false positives — which metric should the team optimize?" → recall. "A text summarization model needs quality evaluation — which metric?" → ROUGE. Knowing the definition of F1 alone will not get you through.

**Community insight**: the exam tests **"scenario → match the service"**, not "definition → fill the blank." rasee anwar: "I stopped trying to remember what each service IS and started learning what problem each service SOLVES. That's all the exam tests."

### Domain 2: Fundamentals of GenAI (24%)

**What it tests**: tokens, chunking, embeddings, vectors, prompt engineering, transformers, FMs, multi-modal and diffusion models; GenAI use cases; the **FM lifecycle** (data selection → model selection → pre-training → fine-tuning → evaluation → deployment → feedback); **token-based pricing and cost/performance effects**; **context engineering**; **agentic AI concepts and MCP**; advantages and limitations (hallucination, interpretability, nondeterminism); model selection factors including **cost, latency, model complexity**; AWS GenAI services (Bedrock, SageMaker AI, JumpStart, Amazon Quick, Kiro, **Strands Agents**, **Bedrock AgentCore**).

**How to prepare**: half of v1.1's new content lands here. For MCP and multi-agent (objective 2.1.6), watch MCP actually work once — [the harness layer of agent security](/posts/ai/2026-08-10-agent-security-harness-layer-en) on this site gives practical context. For token pricing, be able to do the arithmetic: how does cost change when you switch models or compress the prompt.

**Community insight**: compare confusable concepts **side by side** rather than studying each in isolation. CCChen's approach was to rewrite content as "decision rules": latest enterprise knowledge → RAG, fast FM integration → Bedrock, train and manage your own ML model → SageMaker, text splitting → Tokenization, semantic vectors → Embedding. This maps closer to how exam questions actually work than memorizing definitions.

### Domain 3: Applications of Foundation Models (28%, the heaviest)

**What it tests**: FM selection criteria (cost, modality, latency, multi-lingual, model size, complexity, customization, input/output length, **prompt caching**); inference parameters; **RAG and Bedrock Knowledge Bases**; vector store services (OpenSearch Service, Aurora, Neptune, RDS for PostgreSQL); cost tradeoffs across customization approaches (pre-training, fine-tuning, in-context learning, RAG, **model distillation**); AI agents and their business applications; prompt techniques (chain-of-thought, zero/single/few-shot, templates) and risks (exposure, poisoning, hijacking, jailbreaking); **prompt versioning with Bedrock Prompt Management**; training and fine-tuning methods including **RLHF**; FM evaluation (**human-in-the-loop**, benchmark datasets, Bedrock Model Evaluation, ROUGE/BLEU/BERTScore/**LLM-as-a-judge**), **evaluating FM-built applications (RAG, agents, workflows)**, and **business alignment metrics**.

**How to prepare**: rank the four customization approaches (pre-training, fine-tuning, in-context learning, RAG) by cost and by fit — that comparison is the domain's highest-frequency question shape. For evaluation metrics, [RAG evaluation frameworks](/posts/ai/2026-03-12-rag-evaluation-frameworks-en) on this site separates what ROUGE, BLEU, BERTScore, and LLM-as-a-judge each measure.

**Community consensus: this is the most underestimated domain.** The TechCerted candidate: "If you walk in treating AIF-C01 as a terminology quiz, Domain 3 will punish that assumption." Questions give a business scenario and ask "RAG, fine-tuning, or continued pre-training?" — you need to judge by cost, data freshness, and customization depth. KodeKloud's guide emphasizes: "The exam almost always prefers Bedrock (fast integration, no model management) unless the question explicitly requires custom training — then it's SageMaker." Also: Bedrock Guardrails' ApplyGuardrail API works against **any** model endpoint, not just Bedrock models — most prep materials miss this.

### Domain 4: Guidelines for Responsible AI (14%)

**What it tests**: responsible AI dimensions (bias, fairness, inclusivity, robustness, safety, veracity); **Bedrock Guardrails**; environmental and sustainability considerations; GenAI legal risks (IP infringement, biased outputs, trust erosion, hallucinations); dataset characteristics; effects of bias and variance (overfitting, underfitting); detection tooling (label-quality analysis, human audits, subgroup analysis); transparency and explainability (SageMaker Model Cards, **SageMaker Clarify**, Bedrock Model Evaluations); the interpretability-vs-performance tradeoff; **human-centered design (user-feedback mechanisms, AI decision transparency)**.

**How to prepare**: mostly conceptual, but be precise about bias, variance, overfitting, and underfitting — the most commonly conflated quartet.

**Community insight**: Fairness, Transparency, Explainability, and Safety each have precise boundaries on the exam. rasee anwar: "They sound related, but the exam draws sharp lines between them. Read the scenario carefully and match the principle to what's actually described." KodeKloud's shortcut: bias detection → almost always **SageMaker Clarify**; harmful content filtering → almost always **Bedrock Guardrails**.

### Domain 5: Security, Compliance, and Governance (14%)

**What it tests**: IAM roles and policies, encryption, Macie, PrivateLink, the shared responsibility model, **Bedrock AgentCore Identity and Policy in AgentCore**, **Bedrock Guardrails**; source citation and data provenance (lineage, cataloging, Model Cards); secure data engineering; security and privacy considerations (application security, threat detection, vulnerability management, **prompt injection**, encryption in transit and at rest, **data leakage prevention, output filtering and validation, audit trails and logging, toxicity**); **hallucination detection and grounding**; governance and compliance (AWS Config, Inspector, Artifact, CloudTrail, Trusted Advisor, data lifecycle and residency, the **Generative AI Security Scoping Matrix**).

**How to prepare**: domains 4 and 5 together are 28% — as heavy as domain 3 — and are where most candidates under-prepare. The **Generative AI Security Scoping Matrix** is an AWS framework named directly in the guide and worth dedicated reading. Bharat Singh notes that in Stephane Maarek's Udemy course, AWS Security Systems gets two hours and Bedrock gets two hours, versus 25 minutes for prompt engineering — security and Bedrock have the highest study-time ROI.

## What v1.1 Changed (This Decides Whether Your Material Is Usable)

The [official revisions page](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html) gives the change history: v1.0 on March 26, 2026, **v1.1 on April 30, 2026**. The same page notes that updates are reflected on the exam roughly one month later — so from late May onward, questions follow v1.1.

**Seven objectives were added**, none of which existed in the 2024 outline:

| Objective | Content |
|---|---|
| 1.2.6 | When traditional ML versus foundation models is appropriate (regulatory, explainability, operational constraints) |
| 2.1.4 | The **token-based pricing model** and its cost/performance effects |
| 2.1.5 | The role of **context engineering** in FM applications |
| 2.1.6 | **Foundational agentic AI concepts**: multi-agent system patterns, **MCP** and its role connecting agents to external systems, multi-agent communication, memory management, tool usage, workflow orchestration |
| 3.2.5 | Prompt versioning with **Bedrock Prompt Management** |
| 3.4.5 | Business objective alignment metrics (task completion rate, user satisfaction, cost per interaction) |
| 5.1.5 | **Hallucination detection and grounding** (RAG grounding, output validation, confidence scoring) |

**The service list moved too.** Added to in-scope: Amazon Aurora, **Bedrock AgentCore**, **Kiro**, **Strands Agents**, Amazon Q, SageMaker JumpStart, AWS Transform. Removed: Amazon MemoryDB. Objective 2.3.1 used to name Bedrock PartyRock and Bedrock Data Automation — **v1.1 replaced both**.

One detail that quietly costs points: objective 1.3.6 listed **AUC** in v1.0 and now lists **precision and recall**. Flashcard decks are still drilling AUC.

**Fastest way to check if your material is current**: search its table of contents for MCP, AgentCore, Kiro, Strands Agents, context engineering. If none appear, it predates v1.1. The TechCerted candidate confirms: "prep courses last updated before mid-2026 have gaps across all of these."

## Preparation

AWS's official certification page recommends four steps: understand the exam → build knowledge → review and practice → assess readiness. The framework below follows that structure, with candidate-tested specifics at each step.

### How Long Does It Take?

| Background | Study time | Score | Source |
|---|---|---|---|
| 5 years AWS, holds SAA | One weekend (10–15 hours) | 734 | [Zenn](https://zenn.dev/ryno33/articles/7151754dbc769d) |
| Cloud engineer, 1 year Bedrock experience | 2 weeks | Not disclosed | [TechCerted](https://www.techcerted.com/learn/aws-ai-practitioner-field-report-2026) |
| Cloud + ML hands-on experience | 24 hours intensive | Passed | [Eason Tech Talk](https://easontechtalk.com/tw/aws-ai-practitioner-exam-in-24-hours/) |
| Habitual test-taker, free voucher | ~2 weeks | 828 | [changken](https://changken.org/1688/aws-aif-c01-pass/) |
| Non-technical, with AWS mentoring program | ~3–4 weeks | Not disclosed | [KyleLu](https://kylelu.com/aws-aif-preparation/) |
| AWS Community Builder | 1 hour/day for 4 weeks | Not disclosed | [rasee anwar](https://medium.com/@raseanwar/how-i-passed-the-aws-ai-practitioner-exam-aif-c01-tips-from-someone-who-just-did-it-4e20cf3bdd69) |
| Solutions architect, four-layer method | 6 weeks | **1000 (perfect)** | [DEV Community](https://dev.to/dale-rose/i-scored-10001000-on-aws-certified-ai-practitioner-aif-c01-heres-every-resource-i-used-4alf) |
| Software dev + AI learner | 8 weeks | Passed | [Bharat Singh](https://bharat-singh-06.medium.com/how-to-pass-aws-certified-ai-practitioner-in-2026-using-ai-for-smarter-preparation-6f22723704bf) |
| AI learner, AI-assisted study | 4-day sprint | 721 (barely passed) | [CCChen](https://vocus.cc/article/6a991abefd897800011bfecd) |

With AWS experience → one to two weeks. Starting from zero → three to four weeks. The 721-point near-miss shows a 4-day sprint is possible but risky; the perfect-score candidate used six weeks with a four-layer system. Retake policy: 14-day wait, **no limit on attempts** ($100 each) — failure is affordable.

### Step 1: Understand the Exam

- Read the [official exam guide v1.1](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html) end to end — confirm your material is not outdated
- Take the **Official Practice Question Set** (free, 20 questions, AWS-authored). GitHub candidate vicsz: "The official practice questions are about the same difficulty as the real exam, maybe slightly harder"
- Optionally take the **Official Pretest** to identify weak areas ([Skill Builder subscription](https://skillbuilder.aws/category/exam-prep/ai-practitioner-AIF-C01) required, $29/month)
- Eason's reverse-learning method: skip reading material first, go straight to practice questions to find gaps, then backfill knowledge. "More effective than reading page one through page last"

### Step 2: Build Knowledge

**Free resources**:

- [AI Practitioner Learning Plan](https://skillbuilder.aws/category/exam-prep/ai-practitioner-AIF-C01) (free, ~8 hours) — official course, non-negotiable
- [ExamPro Andrew Brown (FreeCodeCamp YouTube)](https://www.youtube.com/results?search_query=freecodecamp+aws+aif-c01) — 15-hour full free video, the perfect-score candidate's first layer
- [vicsz/aif-c01-study-notes (GitHub)](https://github.com/vicsz/aif-c01-study-notes) — open-source notes, 211 stars, organized by domain
- [KodeKloud AIF-C01 Study Guide](https://kodekloud.com/blog/the-complete-aws-certified-ai-practitioner-aif-c01-study-guide/) — free domain-by-domain breakdown

**Paid but high-ROI**:

- [Stephane Maarek AIF-C01 (Udemy)](https://www.udemy.com/course/aws-ai-practitioner-certified/) — **the most recommended course across all candidates**, teaches from AWS account registration through hands-on Bedrock and SageMaker. Multiple candidates report his practice questions are harder than the real exam — use that as positive pressure. Money-saving tip: get a Udemy monthly subscription ($35/month) instead of buying the course outright ($95), finish within a month, then cancel
- **Jayendra Patil Learning Path** — recommended by the perfect-score candidate, covers technical nuances most courses skip
- **Exam Prep Plan** (Skill Builder, 19 items, 22h 50m) — AWS's own recommended full path

**Get hands-on**: open Amazon Bedrock on AWS Free Tier, run a few prompts, browse SageMaker JumpStart's model catalog. You don't need to build a model, but **touching the interface beats memorizing service names**. The perfect-score candidate: "Even one hour on PartyRock or an AWS Workshop gives you intuitive understanding that reading can't replicate — scenario questions become significantly easier." Skill Builder offers **Builder Labs, Cloud Quest, and Jam** for guided hands-on practice.

### Step 3: Review and Practice

Focus on **Domains 2 + 3** (52% combined):

- Practice **"business scenario → which technology/service"** judgment questions — the core question pattern across all five domains
- Rank the four FM customization approaches (pre-training, fine-tuning, in-context learning, RAG) by **cost and fit**
- Use **SimuLearn** (simulated customer conversations + hands-on building), **Escape Room**, and **flashcards** for review
- Domains 4 + 5 are easy to neglect but together they're 28% — don't skip them

**Practice exam recommendations**: [Tutorials Dojo](https://portal.tutorialsdojo.com/courses/aws-certified-ai-practitioner-aif-c01-practice-exams/) (rated closest to actual exam style), Stephane Maarek's Udemy practice exams (harder than the real thing). changken's strategy: "drill questions relentlessly" — he supplemented with YouTube videos tagged AIF-C01.

**Long-stem reading technique**: multiple candidates report that questions have long scenarios but the actual question is in the last two sentences. wAlobdulla's advice: "Start reading from the second-to-last sentence to figure out what's being asked, then scan the context — you'll often find those last two sentences contain enough information to answer."

### Step 4: Assess Readiness

- Take the **Official Practice Exam** (subscription required, closest to real exam difficulty)
- The perfect-score candidate's threshold: "Don't sit the real exam until you're consistently scoring 85%+ across multiple practice sets under timed conditions." His principle: "Reviewing wrong answers matters more than the score — every missed question is a study opportunity, and even questions you guessed right deserve an explanation read"
- rasee anwar's wrong-answer habit: after every mistake, don't just note the answer — ask "why did I pick the wrong one?" This single habit improves scores faster than reading any study guide

### AI-Assisted Study Strategies (2026 Candidate Trend)

Multiple candidates shared methods for using AI tools to accelerate preparation:

- **ChatGPT / Claude for practice questions**: prompt "Give me ten AIF-C01 practice questions" to find blind spots faster than flipping through a textbook. Bharat Singh's example prompts: `"Explain AWS Textract vs Polly with examples"` / `"Give me scenario-based AIF-C01 questions around Bedrock"` / `"AWS Audit Manager vs Artifacts vs Trusted Advisor"`
- **NotebookLM for notes**: upload the official Student Guide (200+ page PDF) and get auto-generated summaries, audio review, and quiz questions. Works even on screenshot-based PDFs via OCR
- **HeptaBase for mind maps**: paired with Zettelkasten note-taking, review on your phone during commute. KyleLu: "Reviewing my mind map one hour before the exam was more effective than re-watching the course"
- **Knowledge distillation** (CCChen): compress full material to A4 → compress to flash cards → compress to a single knowledge chain: `AI/ML → GenAI → FM → Bedrock → Prompt → RAG → Responsible AI → Security`. His problem-solving chain: `Requirement → AI type → AWS service → Constraints → Cost/ops → Security/Governance`
- A Japanese candidate used **Claude** to build [domain-organized cheatsheets](https://zenn.dev/ryno33/articles/7151754dbc769d) from questions he got wrong

### Skill Builder Resource Guide

All resources below are on [AWS Skill Builder](https://skillbuilder.aws). Free accounts get partial access; full access requires a paid subscription ($29/month or $449/year).

| Resource | What it is | Best for |
|---|---|---|
| **Official Practice Question Set** | 20 free AWS-authored questions matching real exam style | Step 1: familiarize with question types |
| **Official Pretest** | Diagnostic test to identify weak domains (paid) | Step 1: find gaps |
| **Exam Prep Plan** | 19 items, 22h 50m — AWS's recommended full study path | Step 2: systematic learning |
| **Builder Labs** | 200+ guided hands-on exercises in a sandboxed AWS Console with an AI assistant for real-time help (paid) | Step 2: hands-on service familiarity |
| **Cloud Quest** | 3D city scenario-based learning across cloud roles, with digital badges (partially free) | Step 2: contextual learning |
| **Jam** | Open-ended challenges with no step-by-step guidance — troubleshoot and solve directly in the AWS Console, with scoring and leaderboards (paid) | Step 3: test practical ability |
| **SimuLearn** | Simulated customer conversations followed by hands-on solution building — trains "hear the problem → pick the service" judgment (paid) | Step 3: scenario judgment practice |
| **Escape Room** | Timed puzzle-based exercises, solo or team (paid) | Step 3: review sprint |
| **Flashcards** | Domain-level terminology cards for quick review | Step 3: spare-time review |
| **Official Practice Exam** | Full simulated exam experience, closest to real difficulty (paid) | Step 4: final assessment |

## Renewal and Retakes

**Three years, three renewal paths** per the [official recertification page](https://aws.amazon.com/certification/recertification/): retake AIF-C01, pass MLA-C01, or pass AIP-C01. Each adds 3 years, and each can use the **50% discount voucher** in your AWS Certification Account.

AIF-C01 **has no "take a course instead" path** (the maintain mechanism only covers SAA, Developer, etc.), and **you cannot retake the same exam within two years of passing**.

## Things That Will Go Stale (Check These Next Time)

| Item | Status as of 2026-08-18 | When to re-check |
|---|---|---|
| Exam guide version | v1.1, published 2026-04-30 | Whenever the revisions page updates |
| Domain weights | 20 / 24 / 28 / 14 / 14 | On every revision |
| In-scope services | Added AgentCore, Kiro, Strands Agents, Aurora, Amazon Q, JumpStart, AWS Transform | On every revision |
| Fee and item count | $100, 65 questions (50 scored), 90 minutes | Quarterly |
| Renewal paths | Three, all voucher-eligible | Every six months |
| Languages | 12, including Traditional Chinese (Italian, German retiring 2026-10-15) | Every six months |

## Changelog

- 2026-09-10: Full rewrite — restructured around the official four-step prep method, integrated field-tested advice from 10+ candidates across all sections (study materials, AI-assisted strategies, the perfect-score four-layer method, exam-day tips, common pitfalls), added Skill Builder resource guide, prerequisites, and language retirement note

## References

- [AWS Certified AI Practitioner certification page](https://aws.amazon.com/certification/certified-ai-practitioner/)
- [AIF-C01 official exam guide (HTML)](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html)
- [AIF-C01 exam guide revisions (v1.0 → v1.1, objective by objective)](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html)
- [AWS Skill Builder — AIF-C01 Exam Prep](https://skillbuilder.aws/category/exam-prep/ai-practitioner-AIF-C01)
- [AWS Recertification (renewal paths and 50% voucher)](https://aws.amazon.com/certification/recertification/)
- [AWS Certification — After Testing (retake policy)](https://aws.amazon.com/certification/policies/after-testing/)
- [AWS Certification — Before Testing (ESL +30 and registration rules)](https://aws.amazon.com/certification/policies/before-testing/)
- [AWS Cloud Practitioner Essentials (free foundational course)](https://skillbuilder.aws/course/cloud-practitioner-essentials)

**Candidate experiences and third-party materials**

- [I Passed AIF-C01 in 2 Weeks — TechCerted](https://www.techcerted.com/learn/aws-ai-practitioner-field-report-2026) — detailed post-v1.1 field report
- [I Scored 1000/1000 — DEV Community](https://dev.to/dale-rose/i-scored-10001000-on-aws-certified-ai-practitioner-aif-c01-heres-every-resource-i-used-4alf) — perfect-score four-layer method with full free/paid resource list
- [Passed in 24 Hours — Eason Tech Talk](https://easontechtalk.com/tw/aws-ai-practitioner-exam-in-24-hours/) — reverse learning method (questions first, then knowledge)
- [4-Day Challenge — CCChen](https://vocus.cc/article/6a991abefd897800011bfecd) — AI knowledge distillation and pre-exam compression
- [KyleLu exam prep notes](https://kylelu.com/aws-aif-preparation/) — non-technical candidate's full resource guide
- [changken pass record](https://changken.org/1688/aws-aif-c01-pass/) — drill strategy and exam-day timeline
- [Japanese candidate experience — Zenn](https://zenn.dev/ryno33/articles/7151754dbc769d) — Claude-assisted study + domain-organized cheatsheet
- [How I Passed — rasee anwar](https://medium.com/@raseanwar/how-i-passed-the-aws-ai-practitioner-exam-aif-c01-tips-from-someone-who-just-did-it-4e20cf3bdd69) — 1 hour/day, 4-week time allocation method
- [How I studied and passed — wAlobdulla](https://blog.newmathdata.com/how-i-studied-for-and-passed-the-aws-ai-practitioner-aif-c01-exam-b7abf471fa0f) — Udemy cost-saving tips and long-stem reading strategy
- [8 Weeks Using AI — Bharat Singh](https://bharat-singh-06.medium.com/how-to-pass-aws-certified-ai-practitioner-in-2026-using-ai-for-smarter-preparation-6f22723704bf) — AI-assisted study prompt examples
- [vicsz/aif-c01-study-notes (GitHub)](https://github.com/vicsz/aif-c01-study-notes) — open-source exam notes, 211 stars
- [ExamLab Chinese practice exams](https://examlab.net/zh-tw/certs/aws/aif-c01) — Traditional Chinese timed mock exam
- [Stephane Maarek AIF-C01 Udemy course](https://www.udemy.com/course/aws-ai-practitioner-certified/) — most-recommended course across candidates
- [ExamPro Andrew Brown FreeCodeCamp (YouTube)](https://www.youtube.com/results?search_query=freecodecamp+aws+aif-c01) — full free video course
- [Tutorials Dojo AIF-C01 practice exams](https://portal.tutorialsdojo.com/courses/aws-certified-ai-practitioner-aif-c01-practice-exams/) — rated closest to real exam style
- [KodeKloud AIF-C01 Study Guide](https://kodekloud.com/blog/the-complete-aws-certified-ai-practitioner-aif-c01-study-guide/) — free domain-by-domain study guide

**Related on this site**

- [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)
- [Preparing for Google PMLE](/posts/ai/2026-08-18-google-pmle-prep-guide-en)
- [Claude Certified Architect Foundations exam guide](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide-en)
