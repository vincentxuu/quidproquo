---
title: "Microsoft AI-200 (Azure AI Cloud Developer): AI Is in the Name, but It Tests the Backend That Keeps AI Apps Running"
date: 2026-10-08
type: guide
category: ai
tags: [certification, azure, rag, career]
lang: en
series:
  name: "AI Certification Prep"
  order: 26
tldr: "AI-200 (Azure AI Cloud Developer Associate) succeeds AZ-204, retired July 31, 2026. Its four areas weigh 20–25 / 25–30 / 20–25 / 20–25: containers, data services, messaging and serverless, security and monitoring. Nothing in the objectives covers model deployment, prompts, or agents; the closest it gets to AI is vector search on Cosmos DB, PostgreSQL pgvector, and Managed Redis. Official specs: $165 in the US, $83 in Taiwan, 120 minutes, pass at 700, 13 languages including Traditional Chinese, one-year validity, and no practice assessment yet."
description: "A preparation guide for Microsoft AI-200 (Azure AI Cloud Developer Associate), built on the official study guide's four weighted skill areas: how it divides the work with AI-103, how the nine official learning paths map to it, an eight-week schedule with its derivation, and the AZ-204 leftovers still in the study guide."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-08-microsoft-ai-200-prep-guide)
>
> This is a preparation path built from official material, not an exam-day account. I have not sat this exam. Every "what it tests" points back to the [official study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200), and every "how to prepare" points to official Microsoft training. No leaked questions. Verified 2026-10-08.

Most people reading "Azure AI Cloud Developer" expect an exam about calling models, writing prompts, and building agents. The objectives say otherwise: the four areas are containers, databases, message queues and serverless, and security and monitoring. It tests the backend layer underneath an AI application.

It succeeds **AZ-204 (Azure Developer Associate), retired July 31, 2026**, according to Microsoft's [retirement announcement](https://techcommunity.microsoft.com/blog/skills-hub-blog/the-ai-job-boom-is-here-are-you-ready-to-showcase-your-skills/4494128). For the trade-offs among Microsoft's other exams, see [Choosing among Microsoft's AI certifications](/posts/ai/2026-08-19-microsoft-ai-certifications-which-one-en).

## Who This Is For

The audience profile in the study guide:

> you're responsible for contributing to all phases of implementing AI solutions on Azure, with an emphasis on back-end services and components.

It then lists seven things to be proficient in: Azure SDKs and third-party SDKs used in Azure, data management services, monitoring and troubleshooting, messaging and eventing, **vector databases**, **Python**, and containerized applications.

**A good fit**: backend engineers on Azure whose team is putting RAG or agents into production. Your job is to keep it stable, keep retrieval fast, and make failures visible, not to tune prompts. If you were planning to take AZ-204, this is the exam to look at now.

**Not a fit**: people who want to show they can build applications with models. That is [AI-103](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide-en). The two barely overlap at the service level: AI-103's objectives have no AKS, Service Bus, or KQL, and AI-200's have no Foundry, agents, or model evaluation. RAG and vector search appear in both, approached from Foundry in AI-103 and from the database in AI-200.

## Official Specs

| Item | Detail |
|---|---|
| Exam code | AI-200 |
| Certification | Microsoft Certified: Azure AI Cloud Developer Associate |
| Price | **$165 USD** in the US, **$83 USD** in Taiwan (priced by the country where the exam is proctored) |
| Duration | 120 minutes |
| Questions | Not published per exam; the general statement is "typically contain between 40-60 questions" |
| Format | The certification page says "You may have interactive components to complete as part of this exam" |
| Passing score | **700** (scale of 1–1,000) |
| Validity | **1 year**, with free online renewal |
| Languages | 13, **including Traditional Chinese** |
| Prerequisites | None |

In Microsoft's [exam duration table](https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience), 120 minutes is the row for associate and expert exams "that may contain labs". Microsoft does not say in advance whether this exam has labs, but the time allowance is the one given to exams that can.

## The Four Skill Areas

| Skill area | Weight |
|---|---|
| Develop containerized solutions on Azure | 20–25% |
| **Develop AI solutions by using Azure data management services** | **25–30%** |
| Connect to and consume Azure services | 20–25% |
| Secure, monitor, and troubleshoot Azure solutions | 20–25% |

The four are close to equal, so none of them can be skipped.

## Preparing Area by Area

### Develop containerized solutions on Azure (20–25%)

**What it tests**:

- **Images and hosting**: build, store, version, and manage images in Azure Container Registry; build and run with ACR Tasks; deploy containers to App Service, including supplying environment variables and secrets.
- **Orchestration**: deploy to Azure Container Apps (environment configuration and revision management); event-driven scaling with **KEDA** in Container Apps; deploy to **AKS** with manifest files; monitor and troubleshoot solutions on AKS and Container Apps by inspecting logs, events, and end-to-end connectivity.

**How to prepare**: three official learning paths, one per topic: [Implement container application hosting on Azure](https://learn.microsoft.com/en-us/training/paths/implement-container-app-hosting-azure/), [Deploy and manage apps on Azure Container Apps](https://learn.microsoft.com/en-us/training/paths/deploy-manage-apps-azure-container-apps/), and [Deploy and monitor applications on Azure Kubernetes Service](https://learn.microsoft.com/en-us/training/paths/deploy-monitor-apps-azure-kubernetes-service/). A minimal exercise: deploy the same API service to App Service, Container Apps, and AKS, then add a KEDA rule on Container Apps that scales on queue length.

### Develop AI solutions by using Azure data management services (25–30%, the heaviest)

This is the only area that touches AI directly, and it does so through vector search on three data services:

| Service | Objectives |
|---|---|
| **Azure Cosmos DB for NoSQL** | Connect and query with the SDK; optimize query performance and RU consumption with indexing policies and consistency levels; **store embeddings and run vector similarity search**; implement a change feed processor |
| **Azure Database for PostgreSQL** | Connect and query with SDKs; schema and indexing strategies; **reduce pgvector compute overhead**; configure compute, memory, and storage for vector workloads; **vector similarity search, including RAG patterns with a metadata filter**; connection optimization |
| **Azure Managed Redis** | Caching, expiration, and invalidation; **vector indexing for similarity search** |

PostgreSQL has six objectives, the most detailed of the three, and it is the only place in the whole outline where the term "RAG" appears.

**How to prepare**: three learning paths: [Cosmos DB for NoSQL](https://learn.microsoft.com/en-us/training/paths/develop-ai-solutions-azure-cosmos-db/), [Azure Database for PostgreSQL](https://learn.microsoft.com/en-us/training/paths/develop-ai-solutions-azure-database-postgresql/), and [Azure Managed Redis](https://learn.microsoft.com/en-us/training/paths/enhance-ai-solutions-azure-managed-redis/). The most effective exercise is to **load the same set of embeddings into all three services and run a similarity search on each**, then answer three questions: how the index is built, how the query changes with a metadata filter, and what the unit of cost is (RUs, compute tier, memory). The outline lists the three services as separate groups of objectives. Having worked with all three is the safer preparation for questions that span them; that is my inference, and Microsoft does not say the exam has comparison questions.

How to evaluate retrieval quality is not tested here. For that, see [Where RAG and retrieval evaluation overlap across exams](/posts/ai/2026-08-18-rag-evaluation-exam-domains-en).

### Connect to and consume Azure services (20–25%)

**What it tests**:

- **Messaging and events**: queue and process backend operations with Azure Service Bus, including dead-letter queues, messages, topics, and subscriptions; event-driven workflows with Azure Event Grid, including filters, custom events, and retries.
- **Azure Functions**: build serverless APIs with triggers and bindings; configure and deploy function apps.

**How to prepare**: one learning path, [Integrate backend services for AI solutions](https://learn.microsoft.com/en-us/training/paths/integrate-backend-services-ai-solutions/) (4 modules). Build one complete asynchronous flow: an HTTP-triggered Function puts work on Service Bus, a second Function consumes it, three failures send the message to the dead-letter queue, and completion raises an Event Grid event. Slow AI jobs such as document ingestion and embedding generation are queued this way in practice.

### Secure, monitor, and troubleshoot Azure solutions (20–25%)

**What it tests**, in just four objectives:

- Secure secrets with **Azure Key Vault**, including rotation and retrieval
- Store and retrieve configuration with **Azure App Configuration**
- Trace distributed systems with **OpenTelemetry SDKs**
- Write **KQL** queries to analyze logs and metrics

Like the previous area, this one lists only four objectives for 20–25% of the exam, the fewest of any area. Microsoft says the bullets are illustrative and related topics may be covered, so do not prepare from the literal four alone.

**How to prepare**: two learning paths: [Manage application secrets and configuration for AI solutions](https://learn.microsoft.com/en-us/training/paths/manage-app-secrets-configuration/) and [Observe and troubleshoot apps on Azure](https://learn.microsoft.com/en-us/training/paths/observe-troubleshoot-apps/). Write KQL yourself: instrument the asynchronous flow from the previous area with OpenTelemetry, then use KQL to find the slowest step and the failed requests.

## An Eight-Week Schedule and How It Was Derived

**Derivation**: the nine official learning paths hold 27 modules, and the durations in the Microsoft Learn catalog add up to about 36 hours. The matching instructor-led course, [AI-200T00-A](https://learn.microsoft.com/en-us/training/courses/ai-200t00), runs five days (the AI-103 course is four). Every area needs hands-on work, so 6–8 hours a week gives eight weeks.

| Week | Content | Basis |
|---|---|---|
| 1 | Read the study guide, try the exam sandbox | See the interactive question interface first |
| 2–3 | Containers (20–25%): three paths | Do each of the three hosting options once |
| 4–5 | **Data services (25–30%)**: three paths | Heaviest area, and the three vector searches need side-by-side comparison |
| 6 | Messaging and Functions (20–25%) | One path; build one complete asynchronous flow |
| 7 | Security and monitoring (20–25%) | Two paths; write real KQL |
| 8 | Full review | No practice assessment yet, so self-assess against the study guide line by line |

If you already operate containerized services on Azure, the container and monitoring areas compress and five to six weeks is realistic.

**Failure cost is moderate**: under Microsoft's [retake policy](https://learn.microsoft.com/en-us/credentials/support/retake-policy), you wait 24 hours after a first failure, 14 days between later attempts, and can sit the same exam at most 5 times in 12 months, paying each time.

## Known Traps

1. **There is no practice assessment.** The certification page says "The Practice Assessment for this exam is not currently available" and adds that one usually arrives within eight weeks of an exam leaving beta. Microsoft's [introduction post from May 2026](https://techcommunity.microsoft.com/blog/skills-hub-blog/new-microsoft-certified-azure-ai-cloud-developer-associate-certification/4494116) describes the exam as in beta at the time, with general availability expected in July. It should be generally available now, on two grounds. Microsoft marks exams in beta with "(beta)" in the page title and a beta scoring notice (the AB-650 page is an example), and the AI-200 page has neither. And in [a Microsoft Q&A thread from mid-July 2026](https://learn.microsoft.com/en-us/answers/questions/5947859/missing-verified-credential-for-ai-200-cert), both the candidate and the responder refer to the exam having gone live after its beta. Microsoft published no separate general availability announcement, and the practice assessment has not appeared.
2. **The study guide still contains AZ-204 material.** "Get trained" links to the AZ-204 exam page. "Find documentation" lists Container Instances, Blob Storage, Microsoft Entra ID, API Management, Event Hubs, and Queue Storage, none of which appear in the objectives, and the Redis link still uses the old name Azure Cache for Redis. **The objectives are the outline; the documentation links are not.**
3. **AZ-204 material is only partly usable.** The leftover links show what the old exam covered. Services missing from the new objectives can be skipped, and the three vector searches will not be in older material.
4. **Do not treat it as a substitute for AI-103.** When a job posting says "Azure AI", it usually means AI-103's skills. This certification shows backend and platform ability, and a resume should say so.

## After the Exam: One-Year Validity and Free Renewal

Associate certifications are valid for one year. Per the [official renewal page](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification), renewal is a free, online, unproctored, open-book assessment that opens only in the six months before expiry. Per the [renewal FAQ](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification-faq), once the certification lapses you must pass the full exam again. The complete rules are covered in the [renewal section of the AI-103 guide](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide-en) and are not repeated here.

AI-200 and AI-103 are separate certifications, each with its own one-year clock and its own renewal. If you hold both, you take two renewal assessments a year.

## Things That Will Go Stale

| Item | Status (verified 2026-10-08) | When to recheck |
|---|---|---|
| Weights | 20–25 / 25–30 / 20–25 / 20–25 | On each revision |
| Price | $165 US, $83 Taiwan | Every six months |
| Practice assessment | Not yet available | Monthly |
| Leftover links in the study guide | Training link points to AZ-204; documentation list shows old services | When Microsoft fixes it |
| Learning paths | Nine paths, 27 modules | Quarterly |

## References

- [Azure AI Cloud Developer Associate certification page](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-cloud-developer-associate/)
- [AI-200 official study guide (full objectives and weights)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
- [AI-200T00-A instructor-led course page (source of the nine learning paths)](https://learn.microsoft.com/en-us/training/courses/ai-200t00)
- [Azure Developer Associate (AZ-204) certification page, marked retired](https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/)
- [Microsoft retirement announcement (AZ-204 → AI-200 mapping table)](https://techcommunity.microsoft.com/blog/skills-hub-blog/the-ai-job-boom-is-here-are-you-ready-to-showcase-your-skills/4494128)
- [Renewing a Microsoft certification](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification)
- [Microsoft exam retake policy](https://learn.microsoft.com/en-us/credentials/support/retake-policy)
- [Exam duration and exam experience](https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience)

**Related on this site**

- [Microsoft AI-103 preparation path](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide-en)
- [Microsoft AI-901 preparation path](/posts/ai/2026-10-08-microsoft-ai-901-prep-guide-en)
- [Choosing among Microsoft's AI certifications](/posts/ai/2026-08-19-microsoft-ai-certifications-which-one-en)
- [Where RAG and retrieval evaluation overlap across exams](/posts/ai/2026-08-18-rag-evaluation-exam-domains-en)
