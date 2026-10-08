---
title: "Microsoft AI-300 (Machine Learning Operations Engineer): One Exam, Two Operations Disciplines, Split Evenly Between MLOps and GenAIOps"
date: 2026-10-08
type: guide
category: ai
tags: [certification, azure, mlops, machine-learning, career]
lang: en
series:
  name: "AI Certification Prep"
  order: 27
tldr: "AI-300 (Machine Learning Operations Engineer Associate) succeeds DP-100, retired June 1, 2026. The five areas weigh 15–20 / 25–30 / 20–25 / 10–15 / 10–15: the first two are classic MLOps on Azure Machine Learning at 40–50% combined, and the last three are GenAIOps on Microsoft Foundry at 40–55%. The objectives name MLflow, Bicep, Azure CLI, and GitHub Actions. Official specs: $165 in the US, $83 in Taiwan, 120 minutes, pass at 700, one-year validity, English only."
description: "A preparation guide for Microsoft AI-300 (Machine Learning Operations Engineer Associate), built on the official study guide's five weighted skill areas: what the MLOps half and the GenAIOps half each test, how the two official learning paths map to them, a six-week schedule with its derivation, and how the exam relates to the retired DP-100."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-08-microsoft-ai-300-prep-guide)
>
> This is a preparation path built from official material, not an exam-day account. I have not sat this exam. Every "what it tests" points back to the [official study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-300), and every "how to prepare" points to official Microsoft training. No leaked questions. Verified 2026-10-08.

Microsoft's Azure Data Scientist Associate (DP-100) **retired on June 1, 2026**, and per the [retirement announcement](https://techcommunity.microsoft.com/blog/skills-hub-blog/the-ai-job-boom-is-here-are-you-ready-to-showcase-your-skills/4494128) its replacement is AI-300. The certification name went from "Data Scientist" to "Machine Learning Operations Engineer", and that rename tells you the direction: the exam is about getting models into production and keeping them there, for both classic machine learning and generative AI.

For the trade-offs among Microsoft's other exams, see [Choosing among Microsoft's AI certifications](/posts/ai/2026-08-19-microsoft-ai-certifications-which-one-en).

## Who This Is For

The audience profile in the study guide asks for three backgrounds at once:

> You should have a data science background with experience in Python programming and an entry-level understanding of DevOps practices, including using tools like GitHub Actions and working with command-line interfaces (CLIs).

Data science, Python, and entry-level DevOps. It also lists four tools you should have experience with: Azure Machine Learning, Foundry, GitHub Actions, and infrastructure as code (IaC) with Bicep and Azure CLI.

**A good fit**: ML engineers, platform engineers, and data scientists moving from training models to operating them. If your company runs both classic ML models and generative AI applications, the scope matches your job.

**Not a fit**: people who only build generative AI applications; that is [AI-103](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide-en). Forty to fifty percent of this exam covers AutoML, hyperparameter tuning, distributed training, and data drift, which is hard going without classic ML experience. It also does not suit people who want to show modeling and statistics ability, since the outline has no objectives on algorithm choice or feature engineering.

The counterparts on other clouds are [Google PMLE](/posts/ai/2026-08-18-google-pmle-prep-guide-en) and AWS's MLA (see [Choosing among AWS's three AI certifications](/posts/ai/2026-08-19-aws-certifications-which-one-en)).

## Official Specs

| Item | Detail |
|---|---|
| Exam code | AI-300 (Operationalizing Machine Learning and Generative AI Solutions) |
| Certification | Microsoft Certified: Machine Learning Operations Engineer Associate |
| Price | **$165 USD** in the US, **$83 USD** in Taiwan (priced by the country where the exam is proctored) |
| Duration | 120 minutes |
| Questions | Not published per exam; the general statement is "typically contain between 40-60 questions" |
| Format | The certification page says "You may have interactive components to complete as part of this exam" |
| Passing score | **700** (scale of 1–1,000) |
| Validity | **1 year**, with free online renewal |
| Languages | **English only** |
| Prerequisites | None |

The exam is English only, but the page for the instructor-led course AI-300T00-A lists 12 languages including Traditional Chinese. Training material is localized and the exam is not.

## The Five Skill Areas

| Skill area | Weight | Platform |
|---|---|---|
| Design and implement an MLOps infrastructure | 15–20% | Azure Machine Learning |
| **Implement machine learning model lifecycle and operations** | **25–30%** | Azure Machine Learning |
| Design and implement a GenAIOps infrastructure | 20–25% | Microsoft Foundry |
| Implement generative AI quality assurance and observability | 10–15% | Microsoft Foundry |
| Optimize generative AI systems and model performance | 10–15% | Microsoft Foundry |

The first two total **40–50%** and the last three total **40–55%**. Two platforms, two toolsets, and two ways of thinking, each about half the exam. Knowing only one side leaves enough points on the table to fail.

## Preparing Area by Area

### Design and implement an MLOps infrastructure (15–20%)

**What it tests**:

- **Workspace resources**: create and manage workspaces, datastores, and compute targets; configure identity and access management.
- **Workspace assets**: data assets, environments, components; **share assets across workspaces with registries**.
- **IaC**: configure secure GitHub integration with Azure Machine Learning; **deploy workspaces and resources with Bicep and Azure CLI**; automate provisioning with GitHub Actions; restrict network access to workspaces; manage source control for ML projects with Git.

**How to prepare**: the goal is to stand up a full environment without touching the portal. Write a Bicep template that creates a workspace, compute, and a datastore, then a GitHub Actions workflow that deploys it.

### Implement machine learning model lifecycle and operations (25–30%, the heaviest)

**What it tests**, in four stages of the model lifecycle:

| Stage | Objectives |
|---|---|
| Training orchestration | **Experiment tracking with MLflow**; AutoML; notebook experimentation; automated hyperparameter tuning; running training scripts; **distributed training for large and deep learning models**; training pipelines; comparing model performance across jobs |
| Registration and versioning | **Package a feature retrieval specification with the model artifact**; register an MLflow model; evaluate a model against responsible AI principles; manage the model lifecycle, including archiving |
| Deployment | Deploy as real-time or batch endpoints with managed inference options; test and troubleshoot endpoints; **progressive rollout and safe rollback** |
| Monitoring | **Detect and analyze data drift**; monitor production performance metrics; trigger retraining or alerts when thresholds are exceeded |

**How to prepare**: take the first official learning path, [Operationalize machine learning models (MLOps)](https://learn.microsoft.com/en-us/training/paths/build-first-machine-operations-workflow/) (7 modules, listed at about 5.7 hours). The most effective exercise is to take one model through the whole loop: track training with MLflow, register it, deploy it to a managed online endpoint, split traffic across two deployments and roll back, then set up a data drift monitor. Skip any of the four stages and a whole group of questions becomes unanswerable.

### Design and implement a GenAIOps infrastructure (20–25%)

**What it tests**:

- **Foundry environments**: create and configure Foundry resources and projects; identity with managed identities and RBAC; network security and private networking; deployment with Bicep templates and Azure CLI.
- **Deploying and managing foundation models**: serverless API endpoints and managed compute; choosing a model for a use case; model versioning and production deployment strategies; **provisioned throughput units for high-volume workloads**.
- **Prompt versioning**: design and develop prompts; create prompt variants and compare their performance; **version prompts in Git repositories**.

The third group stands out: this exam treats prompts as engineering artifacts that need version control and variant comparison. For how other certifications test the same topic, see [How exams test prompt and context engineering](/posts/ai/2026-08-18-prompt-context-engineering-exam-domains-en).

**How to prepare**: the second official learning path, [Operationalize generative AI applications (GenAIOps)](https://learn.microsoft.com/en-us/training/paths/operationalize-gen-ai-apps/) (6 modules, about 6.1 hours), covers only part of this area. Its six modules are planning, prompt management, evaluation experiments, automated evaluation, monitoring, and tracing. Prompt versioning is taught there, but Foundry identity and network configuration, foundation model deployment options, and provisioned throughput have to come from the Microsoft Foundry documentation. Turn the deployment options into your own comparison table: how serverless API, managed compute, and provisioned throughput are each billed and what traffic each suits.

### Implement generative AI quality assurance and observability (10–15%)

**What it tests**:

- **Evaluation**: build test datasets and data mappings; implement AI quality metrics, naming **groundedness, relevance, coherence, and fluency**; configure risk and safety evaluations for harmful content; build automated evaluation workflows with built-in and custom metrics.
- **Observability**: continuous monitoring in Foundry; latency, throughput, and response times; **tracking and optimizing cost for token consumption and resource usage**; logging, tracing, and debugging.

**How to prepare**: for each of the four quality metrics, be able to say what it measures and what a low score points to. Exercise: run the built-in evaluation on a RAG application, then write one custom metric.

### Optimize generative AI systems and model performance (10–15%)

**What it tests**:

- **RAG optimization**: tune similarity thresholds, chunk sizes, and retrieval strategies; select and fine-tune embedding models for a domain; hybrid search combining semantic and keyword retrieval; evaluate and improve with relevance metrics and **A/B testing frameworks**.
- **Fine-tuning**: design and implement advanced fine-tuning methods; **create and manage synthetic data for fine-tuning**; monitor and optimize fine-tuned model performance; manage a fine-tuned model from development through production.

**How to prepare**: the RAG half overlaps heavily with [Where RAG and retrieval evaluation overlap across exams](/posts/ai/2026-08-18-rag-evaluation-exam-domains-en), and the cost and latency trade-offs are in [Where cost, latency, and availability overlap across exams](/posts/ai/2026-08-18-genai-cost-latency-exam-domains-en). For fine-tuning, run the full process at least once, including the data preparation step. The official learning path has almost no modules on RAG optimization or hands-on fine-tuning, so this area depends on the documentation and your own practice.

## A Six-Week Schedule and How It Was Derived

**Derivation**: the two official learning paths hold 13 modules, and the durations in the Microsoft Learn catalog add up to about 11.8 hours. The instructor-led course [AI-300T00-A](https://learn.microsoft.com/en-us/training/courses/ai-300t00) runs four days. Reading time is modest, but both platforms need hands-on work, so 6–8 hours a week gives six weeks.

| Week | Content | Basis |
|---|---|---|
| 1 | Read the study guide, MLOps infrastructure (15–20%) | Bicep and GitHub Actions underpin both halves |
| 2–3 | **ML model lifecycle (25–30%)** | Heaviest area; walk all four stages once |
| 4 | GenAIOps infrastructure (20–25%) | Deployment options and prompt versioning |
| 5 | Evaluation, observability, and optimization (20–30% combined) | The learning path covers the first; the second needs the documentation |
| 6 | Practice assessment and gap-filling | See below |

If you only know one half, reallocate. Classic ML people can compress weeks 2–3 into one and give Foundry an extra week; generative AI people do the reverse.

**Failure cost is moderate**: under Microsoft's [retake policy](https://learn.microsoft.com/en-us/credentials/support/retake-policy), you wait 24 hours after a first failure, 14 days between later attempts, and can sit the same exam at most 5 times in 12 months, paying each time.

**Practice assessment**: the certification page says the practice assessment is on AI Skills Navigator and requires sign-in. The page does not say whether it is free. Microsoft's [practice assessment policy page](https://learn.microsoft.com/en-us/credentials/certifications/practice-assessments-for-microsoft-certifications) says practice assessments are "available at no cost", but it describes the ones hosted on Microsoft Learn and has not been restated for the new platform.

## Known Traps

1. **DP-100 material covers a little over half.** The old certification was called Data Scientist and the new one MLOps Engineer. Older material touches only a small part of the three Foundry areas (40–55%): the scope listed on the [DP-100 certification page](https://learn.microsoft.com/en-us/credentials/certifications/azure-data-scientist/) has a single related area, "Optimize language models for AI applications".
2. **The study guide's documentation links are wrong.** "Find documentation" has four links: the Copilot section of a compliance page, a generative AI technology guidance page, Microsoft 365 Copilot documentation, and Microsoft 365 documentation. The community links point to the Microsoft 365 Copilot community. None of the four leads to Azure Machine Learning or Foundry documentation, which looks like the wrong template. **Go straight to the Azure Machine Learning and Microsoft Foundry documentation.**
3. **"AIOps" means something different here.** Microsoft uses AI operations (AIOps) for MLOps plus GenAIOps. In the industry, AIOps usually means using AI for IT operations, which is a different subject and will pollute your search results.
4. **The exam is English only.** Course material is localized, the exam is not. Under Microsoft's rules, you can request an extra 30 minutes when an exam is not offered in your preferred language.

## After the Exam: One-Year Validity and Free Renewal

Associate certifications are valid for one year. Per the [official renewal page](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification), renewal is a free, online, unproctored, open-book assessment that opens only in the six months before expiry. Per the [renewal FAQ](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification-faq), once the certification lapses you must pass the full exam again. The complete rules are covered in the [renewal section of the AI-103 guide](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide-en).

If you already hold DP-100: the warning on the [DP-100 certification page](https://learn.microsoft.com/en-us/credentials/certifications/azure-data-scientist/) states that both the certification and its renewal assessment are retired. When the old certification expires there is no renewal path, and keeping an active credential means passing AI-300.

## Things That Will Go Stale

| Item | Status (verified 2026-10-08) | When to recheck |
|---|---|---|
| Weights | 15–20 / 25–30 / 20–25 / 10–15 / 10–15 | On each revision |
| Price | $165 US, $83 Taiwan | Every six months |
| Exam languages | English only | Quarterly |
| Whether the practice assessment is free | Not stated (on AI Skills Navigator) | Sign in to confirm |
| Study guide documentation links | Point to Microsoft 365 Copilot | When Microsoft fixes it |

## References

- [Machine Learning Operations Engineer Associate certification page](https://learn.microsoft.com/en-us/credentials/certifications/operationalizing-machine-learning-and-generative-ai-solutions/)
- [AI-300 official study guide (full objectives and weights)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-300)
- [AI-300T00-A instructor-led course page](https://learn.microsoft.com/en-us/training/courses/ai-300t00)
- [Learning path: Operationalize machine learning models (MLOps)](https://learn.microsoft.com/en-us/training/paths/build-first-machine-operations-workflow/)
- [Learning path: Operationalize generative AI applications (GenAIOps)](https://learn.microsoft.com/en-us/training/paths/operationalize-gen-ai-apps/)
- [Azure Data Scientist Associate (DP-100) certification page, marked retired](https://learn.microsoft.com/en-us/credentials/certifications/azure-data-scientist/)
- [Microsoft retirement announcement (DP-100 → AI-300 mapping table)](https://techcommunity.microsoft.com/blog/skills-hub-blog/the-ai-job-boom-is-here-are-you-ready-to-showcase-your-skills/4494128)
- [Renewing a Microsoft certification](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification)
- [Microsoft exam retake policy](https://learn.microsoft.com/en-us/credentials/support/retake-policy)

**Related on this site**

- [Microsoft AI-103 preparation path](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide-en)
- [Microsoft AI-200 preparation path](/posts/ai/2026-10-08-microsoft-ai-200-prep-guide-en)
- [Google PMLE preparation path](/posts/ai/2026-08-18-google-pmle-prep-guide-en)
- [Where RAG and retrieval evaluation overlap across exams](/posts/ai/2026-08-18-rag-evaluation-exam-domains-en)
- [Choosing among Microsoft's AI certifications](/posts/ai/2026-08-19-microsoft-ai-certifications-which-one-en)
