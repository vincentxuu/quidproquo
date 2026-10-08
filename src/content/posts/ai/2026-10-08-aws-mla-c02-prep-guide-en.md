---
title: "AWS Machine Learning Engineer Associate (MLA-C02): 45 of Its 107 Skills Are New"
date: 2026-10-08
type: guide
category: ai
tags: [certification, aws, mlops, machine-learning, rag, career]
lang: en
series:
  name: "AI Certification Prep"
  order: 30
tldr: "MLA-C02 replaced MLA-C01 on September 29, 2026. The four domains weigh 28 / 24 / 24 / 24, and each domain name now carries AI or FM: the official comparison lists 45 added skills covering vector databases, embeddings, RAG, selecting and fine-tuning foundation models, and deploying and monitoring agents, with 7 removed. It is currently an English-only beta (exam code ME1-C02, 170 minutes, 85 questions, $75). The standard version per the exam guide is 65 questions, pass at 720, valid 3 years, with Japanese, Korean, and Simplified Chinese arriving at general availability."
description: "A preparation guide for AWS Certified Machine Learning Engineer – Associate (MLA-C02), built on the official exam guide's four weighted domains: what was added and removed from MLA-C01, how the beta differs from the standard version, an eight-week schedule with its derivation, and how much older study material still applies."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-08-aws-mla-c02-prep-guide)
>
> This is a preparation path built from official material, not an exam-day account. I have not sat this exam. Every "what it tests" points back to the [official AWS exam guide](https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-02/machine-learning-engineer-associate-02.html). No leaked questions. Verified 2026-10-08.

AWS's ML Engineer Associate has a new version. Per the official [comparison page](https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-02/mla-02-comparison.html), MLA-C01 was in use until September 28, 2026 and MLA-C02 began on September 29. The domain weights barely moved, but every domain name gained the word "AI" or "FM", and that is where the revision went: this is no longer only a classic ML exam on SageMaker.

For how it compares with the other two AWS AI certifications, see [Choosing among AWS's three AI certifications](/posts/ai/2026-08-19-aws-certifications-which-one-en).

## Who This Is For

The target candidate description in the exam guide:

> The target candidate should have at least 1 year of experience using Amazon SageMaker AI, Amazon Bedrock, and other AWS services for ML engineering… The candidate should have experience with both traditional ML and generative AI (GenAI).

It also asks for a year in a related role such as backend software developer, DevOps developer, data engineer, or data scientist.

**A good fit**: engineers on AWS who put models into production and keep them running, with both classic ML models and generative AI applications on their plate.

**Not a fit**: people who only build generative AI applications and never train models; that is closer to [AIP-C01](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en). The guide also lists four job tasks outside the target candidate's scope: designing full end-to-end AI and ML solutions, setting best practices and guiding ML strategy, integrating a wide array of services or new tools, and working deeply in two or more ML domains. It tests execution, not architecture decisions.

The counterparts on other clouds are Microsoft's [AI-300](/posts/ai/2026-10-08-microsoft-ai-300-prep-guide-en) and [Google PMLE](/posts/ai/2026-08-18-google-pmle-prep-guide-en).

## Official Specs

The beta and the standard version differ, so they are listed separately:

| Item | Beta (open for registration now) | Standard version (per the exam guide) |
|---|---|---|
| Exam code | ME1-C02 | MLA-C02 |
| Duration | 170 minutes | Not yet published |
| Questions | 85 | **65** (50 scored + 15 unscored) |
| Price | **$75 USD** (beta pricing) | Not yet published; MLA-C01 was $150 |
| Passing score | The standard passing rule does not apply | **720** (scale of 100–1,000) |
| Languages | English only | English, plus Japanese, Korean, and Simplified Chinese |
| Question types | Multiple choice, multiple response | Multiple choice, multiple response |
| Validity | 3 years | 3 years |

The beta column comes from the [certification page](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/) and the standard column from the exam guide. **There is no Traditional Chinese version**; among the AWS certifications in this series only AIF-C01 has one.

Scoring is compensatory. The exam guide says "you do not need to achieve a passing score in each section", so there is no per-domain threshold and only the overall score counts. Multiple-response questions need every correct option selected, and there is no penalty for guessing.

## The Four Domains

| Domain | MLA-C02 | MLA-C01 |
|---|---|---|
| 1. Data Preparation for ML and AI | **28%** | 28% |
| 2. ML Model and Foundation Model (FM) Development | 24% | 26% |
| 3. Deployment and Orchestration of ML and AI Workflows | 24% | 22% |
| 4. Operating, Monitoring, and Securing ML and AI Solutions | 24% | 24% |

Domain 2 lost two points and Domain 3 gained two. The real change is in the skills under each domain.

## C01 to C02: What Was Added and Removed

The comparison page lists it skill by skill. The four domains now hold **107 skills**, of which **45 are new in C02**:

| Domain | Skills now | Of which new |
|---|---|---|
| Domain 1 | 25 | 10 |
| Domain 2 | 27 | 11 |
| Domain 3 | 30 | **15** |
| Domain 4 | 25 | 9 |

Domain 3 (deployment and orchestration) gained the most.

**The 7 removed items**: configuring data to load into the training resource (EFS, FSx); the older wording on fine-tuning pre-trained models with custom datasets; reducing model size (pruning, compression); optimizing models on edge devices with SageMaker Neo; bring your own container (BYOC); monitoring infrastructure with EventBridge; troubleshooting capacity concerns.

**How much older material still applies**: C01 material covers roughly 60% of the skills (62 of 107 are not new), but the missing 40% is concentrated in generative AI, and older material still teaches the removed SageMaker Neo and BYOC.

## Preparing Domain by Domain

### Domain 1: Data Preparation for ML and AI (28%, the heaviest)

**What it tests**, in three tasks:

- **Collect and store data**: extract from S3, RDS, DynamoDB, OpenSearch, and other sources; choose storage by cost, performance, and compliance; streaming ingestion (Kinesis, Flink, Kafka); data formats (Parquet, JSON, CSV, ORC); **configure scalable vector databases** (OpenSearch Service, RDS with pgvector, S3); ingest text, images, and audio; ingest into SageMaker Feature Store.
- **Transform and engineer features**: Glue, DataBrew, Spark on EMR, Data Wrangler; feature engineering (standardization, binning, log transformation); **configure and use embedding models**; **prepare documents for RAG** (chunking strategies, metadata extraction); masking and anonymization; **prepare data for FM fine-tuning, continuous pre-training, and model distillation**.
- **Data quality and bias**: validate data quality; labeling; identify and mitigate bias; resolve class imbalance; **validate AI training data integrity** (prompt-response pair validation, content safety screening); clean data.

**How to prepare**: half of this domain is classic data engineering and half is RAG preprocessing. Exercise: take one set of documents down both routes, Glue to Feature Store on one side and chunking to embeddings to a vector database on the other.

### Domain 2: ML Model and Foundation Model (FM) Development (24%)

**What it tests**:

- **Choosing models and approaches**: **select foundation models from Amazon Bedrock by task requirements**; identify fine-tuning strategies; **weigh custom solutions, managed services, pre-trained models, and FMs**; **select RAG architecture patterns**; tradeoffs among performance, training time, latency, and cost; apply AWS AI services (Textract, Rekognition, Comprehend, Transcribe) to specific problems.
- **Training and customization**: SageMaker AI built-in algorithms and script mode; hyperparameter optimization (automatic model tuning); reducing training time (early stopping, distributed training); **preventing overfitting, underfitting, and catastrophic forgetting**; **customization techniques (task-specific prompt engineering, fine-tuning)**; optimizing retrieval components and embedding models.
- **Evaluation**: reproducible experiments (MLflow on SageMaker AI, Bedrock evaluations, Bedrock Prompt Management); baselines and drift detection; shadow variants; explaining model outputs; **human evaluation frameworks**; **NLP evaluation metrics (BLEU, ROUGE, BERTScore, semantic similarity)**; **LLM-as-a-judge**; **RAG system monitoring, including retrieval accuracy assessment**.

**How to prepare**: the evaluation group is where the new material is densest. For each of the four NLP metrics, be able to say what it measures and when it misleads. RAG evaluation methods are covered in [Where RAG and retrieval evaluation overlap across exams](/posts/ai/2026-08-18-rag-evaluation-exam-domains-en).

### Domain 3: Deployment and Orchestration of ML and AI Workflows (24%)

**What it tests**:

- **Deployment infrastructure**: compute environments and deployment targets; multi-model or multi-container deployment; real-time and batch inference; **FM deployment options**; deploying models built outside AWS (Bedrock Custom Model Import); **deploying and configuring agents, including integration with other services and agent communication protocols**; RAG retrieval strategies and reranking.
- **Provisioning and configuring resources**: on-demand versus provisioned resources; containers; SageMaker AI endpoints inside a VPC; choosing auto scaling metrics; **creating and managing Bedrock knowledge bases**; retrieval pipelines; **agent state management**; scaling for GPU workloads; **deploying agentic workflow infrastructure**.
- **CI/CD and orchestration**: automated deployment and rollback; CodeBuild, CodeCommit, CodeDeploy, CodePipeline, CodeConnections; retraining mechanisms; model versioning (SageMaker Model Registry); **managing prompts (Bedrock Prompt Management)**; **automated agent deployment pipelines and agent version management**; **prompt testing**; **pipeline orchestration for RAG system updates and knowledge base refresh cycles**.

**How to prepare**: this domain gained 15 skills and holds most of the agent objectives. Exercise: build an agent backed by a Bedrock knowledge base, deploy it with CodePipeline, then change a prompt, ship a new version, and roll back.

### Domain 4: Operating, Monitoring, and Securing ML and AI Solutions (24%)

**What it tests**:

- **Monitoring**: CloudWatch generative AI observability, Bedrock Model Evaluation, drift detection; changes in data distribution; A/B testing; **monitoring agent performance and coordination** (coordination failure detection, truncated streaming, tool failures).
- **Cost and performance**: choosing inference instance families; CloudWatch, **Bedrock AgentCore Observability**, X-Ray; dashboards; purchasing options; **cost of FM inference**; **agent resource consumption**; **AI-specific cost patterns** (token usage, embedding computation costs, vector database storage).
- **Security**: scanning code and images in CI/CD; least privilege; IAM policies and roles; CloudTrail and Config; VPC isolation; **credential types for accessing FMs** (Bedrock API keys, IAM credentials); **Bedrock Guardrails**.

**How to prepare**: the cost group overlaps with [Where cost, latency, and availability overlap across exams](/posts/ai/2026-08-18-genai-cost-latency-exam-domains-en). Exercise: connect the agent from Domain 3 to CloudWatch and AgentCore Observability, then find the token usage and the slowest step of one complete invocation.

## An Eight-Week Schedule and How It Was Derived

**Derivation**: 107 skills, with 25 to 30 in each domain, so each domain gets about the same time. The exam expects hands-on experience in both classic ML and generative AI, and both need practice, so 6–8 hours a week gives eight weeks.

| Week | Content | Basis |
|---|---|---|
| 1 | Read the exam guide and the comparison page; mark the new skills you do not know | The 45 additions are what older experience will not cover |
| 2–3 | Domain 1 (28%) | Heaviest; half classic data engineering, half RAG preprocessing |
| 4–5 | Domain 2 (24%) | The evaluation group has the densest new material |
| 6 | Domain 3 (24%) | Build an agent and deploy it through a pipeline |
| 7 | Domain 4 (24%) | Monitoring, cost, and security on the same project |
| 8 | Official practice questions and gap-filling | The certification page lists an official practice question set, pretest, and practice exam |

If you have only done classic ML, shift time toward the agent and foundation model skills in Domains 3 and 4. If you have only done generative AI, shift it toward feature engineering and training in Domains 1 and 2.

The official preparation entry point is the [MLA-C02 exam prep page on AWS Skill Builder](https://skillbuilder.aws/category/exam-prep/machine-learning-engineer-associate-MLA-C02).

**Failure cost**: under AWS's [retake policy](https://aws.amazon.com/certification/policies/after-testing/), you wait 14 calendar days after failing and pay again for each attempt. Beta exams have their own rules; read the beta section of the AWS Certification policies page before registering.

## Known Traps

1. **The beta and the standard version have different specs.** The beta is 85 questions in 170 minutes; the exam guide describes a 65-question standard version. The certification page explains that the extra beta items are for statistical evaluation and are unscored, with time added to match. The outline is the same for both, and the exam guide is the reference.
2. **Two codes, one exam.** MLA-C02 is the name of the new version and ME1-C02 is the code of the current beta. The certification page shows both.
3. **Beta results are not immediate.** The certification page says beta results are typically available within 5 business days of completing the exam, and the exam guide notes that the standard pass or fail rule does not apply to the beta.
4. **Non-English candidates have no new version yet.** MLA-C01 in Japanese, Korean, and Simplified Chinese stays available until C02 reaches general availability, and C02 in those languages arrives only then.
5. **Older material teaches removed content.** SageMaker Neo, BYOC, and model compression are gone from the outline, while vector databases, Bedrock, and agents are not in older material at all.

## After the Exam: Three-Year Validity

The certification is valid for three years. You can recertify by retaking the latest MLA or by passing AIP-C01, and passing the latest MLA also renews AIF-C01. The full renewal graph is in [Choosing among AWS's three AI certifications](/posts/ai/2026-08-19-aws-certifications-which-one-en).

## Things That Will Go Stale

| Item | Status (verified 2026-10-08) | When to recheck |
|---|---|---|
| Exam status | English beta, code ME1-C02 | Monthly, until general availability |
| Standard price and duration | Not yet published | At general availability |
| Domain weights | 28 / 24 / 24 / 24 | On each revision |
| Skill count | 107, of which 45 are new | On each revision |
| Other languages | Japanese, Korean, Simplified Chinese at general availability; no Traditional Chinese | At general availability |

## References

- [AWS Certified Machine Learning Engineer – Associate certification page](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/)
- [MLA-C02 official exam guide](https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-02/machine-learning-engineer-associate-02.html)
- [Comparison of MLA-C01 and MLA-C02 (additions, deletions, recategorizations)](https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-02/mla-02-comparison.html)
- [AWS Skill Builder: MLA-C02 exam prep](https://skillbuilder.aws/category/exam-prep/machine-learning-engineer-associate-MLA-C02)
- [AWS Certification: after-testing policies (retakes)](https://aws.amazon.com/certification/policies/after-testing/)

**Related on this site**

- [Choosing among AWS's three AI certifications](/posts/ai/2026-08-19-aws-certifications-which-one-en)
- [AWS GenAI Developer Professional (AIP-C01) preparation guide](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en)
- [AWS AI Practitioner (AIF-C01) preparation path](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en)
- [Microsoft AI-300 preparation path](/posts/ai/2026-10-08-microsoft-ai-300-prep-guide-en)
- [Where RAG and retrieval evaluation overlap across exams](/posts/ai/2026-08-18-rag-evaluation-exam-domains-en)
