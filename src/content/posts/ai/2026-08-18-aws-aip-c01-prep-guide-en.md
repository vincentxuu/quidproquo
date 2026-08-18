---
title: "AWS GenAI Developer Professional (AIP-C01): The Whole Exam Is About Integrating Someone Else's Model"
date: 2026-08-18
type: guide
category: ai
tags: [certification, aws, generative-ai, rag, agents, career]
lang: en
series:
  name: "AI Certification Prep"
  order: 2
tldr: "AIP-C01 is AWS's only professional-level certification dedicated to GenAI application development, and it explicitly excludes model development, advanced ML, and feature engineering — it tests integrating someone else's foundation model into a production system. Domain weights are 31/26/20/12/11, and nearly half the skills in the heaviest domain sit in vector stores and RAG. A March 2026 refresh added Bedrock AgentCore and the beta ended March 31, so anything older is stale. Official specs: $300, 180 minutes, 75 questions (65 scored), pass at 750, valid 3 years — and passing it renews AIF-C01, MLA-C01, and Data Engineer – Associate at the same time."
description: "A preparation guide for AWS Certified Generative AI Developer – Professional (AIP-C01), built on the official exam guide's five-domain weighting: RAG, vector stores, agentic AI, guardrails, cost and latency optimization, and evaluation, with a ten-week schedule and its derivation, the services the guide names, the renewal graph, and retake rules."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-aws-aip-c01-prep-guide)
>
> This is a preparation path built from official material, not an exam-day account — I have not sat this exam. Every "what it tests" points back to the [official exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html), and every "how to prepare" points to official AWS training. No leaked questions. Verified 2026-08-18.

AIP-C01 is the odd one out in this series: it is **the only professional-level AI certification that explicitly excludes training models**. The official exam guide's out-of-scope list runs three lines, and those three lines define the exam:

> Model development and training; Advanced ML techniques; Data engineering and feature engineering.

No modeling, no advanced ML, no data or feature engineering. **What it tests is taking someone else's foundation model and turning it into a system that survives production** — RAG, vector stores, agents, guardrails, cost and latency, evaluation and debugging.

For prices, validity, and gates across vendors, see [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en) — not repeated here.

## Who This Is For

**The recommended experience is unusually specific**:

> 2 or more years of experience building production-grade applications on AWS or with open-source technologies, general AI/ML or data engineering experience, and 1 year of hands-on experience implementing GenAI solutions.

Two years of production application work plus one year of GenAI implementation. That is not boilerplate — 11 of domain 1's 27 skills sit in vector store design and retrieval mechanisms, and anyone who has not actually built a RAG system will bleed points there.

**A fit** if you already build LLM applications, agents, or RAG and want to systematize scattered experience into a credential — especially **teams on Bedrock**, since this is effectively a full-surface exam on the Bedrock ecosystem.

**Not a fit** for proving ML engineering ability (that is MLA-C01; the two barely overlap in scope), or for anyone who has not yet shipped RAG and agents. There is no shortcut path on this one.

**Renewal efficiency is its unique advantage**: per the [official recertification page](https://aws.amazon.com/certification/recertification/), passing AIP-C01 renews **AIF-C01, MLA-C01, and Data Engineer – Associate** for three years each. AIP-C01 itself can only be renewed by retaking it. Across the AWS AI track, nothing else renews as much at once.

## Official Specs at a Glance

| Item | Detail |
|---|---|
| Fee | $300 |
| Length | 180 minutes |
| Questions | 75, of which **65 are scored and 10 unscored** |
| Question types | Multiple choice and multiple response (**no** ordering or matching, unlike AIF-C01) |
| Passing score | Scaled **750** (range 100–1,000), compensatory |
| Guessing | The guide states "Unanswered questions are scored as incorrect. There is no penalty for guessing." — **never leave a blank** |
| Validity | 3 years |
| Languages | English, Japanese, Korean, Simplified Chinese (**no Traditional Chinese**) |
| Prerequisites | None |

750 is the highest cut score of the three AWS AI exams (AIF 700, MLA 720, AIP 750).

## The Five Domain Weights

| Domain | Weight |
|---|---|
| 1. Foundation Model Integration, Data Management, and Compliance | **31%** |
| 2. Implementation and Integration | 26% |
| 3. AI Safety, Security, and Governance | 20% |
| 4. Operational Efficiency and Optimization for GenAI Applications | 12% |
| 5. Testing, Validation, and Troubleshooting | 11% |

**Domains 1 and 2 total 57%.** Allocate against that. Domain 3's 20% is not small, but domain 1 alone outweighs it by half again.

## Domain by Domain

### Domain 1: FM Integration, Data Management, and Compliance (31%, the heaviest)

Six tasks, two of which are the core of the entire exam.

**1.1 Analyze requirements and design solutions**: architectural designs, technical PoC with Bedrock, standardized components via the AWS Well-Architected Framework and its **Generative AI Lens**.

**1.2 Select and configure FMs**: selection by benchmarks, capability, and limitations; **dynamic model-switching architecture** (Lambda, API Gateway, AppConfig); resilience (Step Functions circuit breakers, **Bedrock Cross-Region Inference**, cross-Region deployment, graceful degradation); the customization lifecycle (SageMaker AI fine-tuned deployments, **LoRA and adapters**, Model Registry versioning, rollback, model retirement).

**1.3 Data validation and processing pipelines**: Glue Data Quality, SageMaker Data Wrangler, Lambda, CloudWatch; multimodal handling (Bedrock multimodal models, SageMaker Processing, Transcribe); model-specific input formatting (JSON for the Bedrock API, conversation formatting).

**1.4 Vector store design**: hierarchical organization in Bedrock Knowledge Bases; OpenSearch Service with the Neural plugin; RDS with S3 document repositories; DynamoDB alongside vector databases; metadata frameworks (S3 object metadata, custom attributes, tagging); **high-performance indexing (OpenSearch sharding, multi-index, hierarchical indexing)**; integration with document management systems; data maintenance (incremental updates, real-time change detection, sync workflows, scheduled refresh).

**1.5 Retrieval mechanisms and RAG**: chunking (Bedrock native, fixed-size via Lambda, hierarchical); embedding selection (**Amazon Titan embeddings**, dimensionality and domain fit, batch embedding via Lambda); vector search deployment (OpenSearch, **Aurora pgvector**, Bedrock Knowledge Bases managed store); **advanced search (hybrid keyword plus vector, Bedrock reranker models)**; query handling (expansion, decomposition, transformation); access mechanisms (function calling, **MCP clients for vector queries**, standardized retrieval APIs).

**1.6 Prompt engineering and governance**: role definitions in Bedrock Prompt Management, Bedrock Guardrails; interactive context (Step Functions clarification, Comprehend intent, DynamoDB conversation history); **prompt governance** (parameterized templates, approval workflows, S3 repositories, CloudTrail, CloudWatch Logs); prompt QA and regression testing; **Bedrock Prompt Flows** for chains, conditional branching, and reusable components.

**How to prepare**: tasks 1.4 and 1.5 are 11 of the domain's 27 skills — **which works out to roughly 15–18% of the whole exam** (my arithmetic from the skill counts; AWS publishes domain weights only). Build one RAG system end to end, twice: once on Bedrock Knowledge Bases, once on Aurora pgvector, and compare metadata filtering and incremental updates directly. **Hybrid search and rerankers are the newer material** and produce no intuition from reading.

### Domain 2: Implementation and Integration (26%)

**2.1 Agentic AI and tool integration** (7 skills, the heaviest task in the domain): **Strands Agents** and **AWS Agent Squad** for multi-agent systems; **MCP** for agent-to-tool interaction; memory and state management; ReAct and chain-of-thought via Step Functions; **safeguards** (stopping conditions, Lambda timeouts, IAM resource boundaries, circuit breakers); model ensembles and coordination; human-in-the-loop (Step Functions review and approval, API Gateway feedback); **MCP servers on Lambda for lightweight stateless tools and on ECS for complex ones**.

**2.2 Deployment strategies**: Lambda on-demand invocation, **Bedrock provisioned throughput**, hybrid SageMaker AI endpoints; container deployments tuned for memory, GPU, and token throughput; **model cascading** and smaller task-specific models.

**2.3 Enterprise integration**: legacy API integration, event-driven loose coupling; API Gateway microservices, Lambda webhooks, EventBridge; identity federation, RBAC, least-privilege API access to FMs; **AWS Outposts and Wavelength** for data residency and edge; **CI/CD and GenAI gateway architectures** (CodePipeline, CodeBuild, automated tests, security scans, rollback, centralized abstraction layers).

**2.4 FM API integration**: Bedrock synchronous APIs, SDKs with SQS for async; **Bedrock streaming APIs**, WebSockets and SSE, chunked transfer encoding; resilience (SDK exponential backoff, API Gateway rate limiting, fallbacks, **X-Ray**); **intelligent model routing** (static, content-based via Step Functions, metric-based).

**2.5 Application integration and developer tools**: API Gateway handling for streaming, token limits, retries; **AWS Amplify** UI components, OpenAPI, no-code Bedrock Prompt Flows; **Bedrock Data Automation**; **Amazon Q Developer** for code generation and refactoring; CloudWatch Logs Insights with X-Ray for troubleshooting.

**How to prepare**: the agent material overlaps conceptually with [the agent series](/posts/ai/2026-08-10-agent-security-harness-layer-en) on this site, but **the exam wants the AWS-specific mapping** — knowing "you need multi-agent orchestration" is not enough; know how Strands Agents and Agent Squad differ in positioning, and when an MCP server belongs on Lambda versus ECS.

### Domain 3: AI Safety, Security, and Governance (20%)

**3.1 Input and output safety controls**: Bedrock Guardrails for input and response filtering; custom moderation via Step Functions and Lambda; **hallucination reduction** (Knowledge Base grounding plus fact-checking, confidence scoring, semantic similarity, **JSON Schema structured outputs**); defense in depth (Comprehend pre-filters, model-side guardrails, Lambda post-processing, API Gateway response filtering); **prompt injection and jailbreak detection**, input sanitization, safety classifiers, automated adversarial testing.

**3.2 Data security and privacy**: VPC endpoints, IAM, **Lake Formation**, CloudWatch; PII detection with **Comprehend and Macie**, Bedrock native privacy features, S3 Lifecycle retention; masking and anonymization.

**3.3 Governance and compliance**: programmatic **model cards** in SageMaker AI, Glue data lineage, metadata tagging, CloudWatch decision logs; Glue Data Catalog source registration, CloudTrail audit logging; continuous monitoring (misuse, drift, policy-violation detection, **bias drift monitoring**, token-level redaction, response logging, output policy filters).

**3.4 Responsible AI**: transparency (reasoning displays, confidence metrics, source attribution, **Bedrock agent tracing**); fairness (CloudWatch fairness metrics, A/B testing through Prompt Management and Prompt Flows, **LLM-as-a-judge automated evaluation**); policy compliance (guardrails derived from policy, model cards documenting limitations, Lambda compliance checks).

**How to prepare**: **Bedrock Guardrails is named six times in this domain** (3.1.1, 3.1.2, 3.1.4, 3.2.2, 3.2.3, 3.4.3) — the densest single product in the guide, worth one full hands-on pass. Note also that hallucination handling is framed as a **combination** (grounding + fact-checking + confidence scoring + structured output), not a single technique.

### Domain 4: Operational Efficiency and Optimization (12%)

**4.1 Cost optimization**: token estimation and tracking, context window optimization, response size controls, **prompt compression and context pruning**; cost-capability tradeoffs, **tiered FM usage by query complexity**, price-to-performance ratio; batching, capacity planning, auto-scaling, provisioned throughput optimization; **semantic caching, result fingerprinting, edge caching, deterministic request hashing, prompt caching**.

**4.2 Performance and latency**: pre-computation, **latency-optimized Bedrock models**, parallel requests, response streaming, benchmarking; retrieval speed (index optimization, query preprocessing, hybrid search with custom scoring); throughput (token processing optimization, batch inference, concurrency management); **temperature and top-k/top-p selection**, A/B testing; API call profiling and vector database query optimization.

**4.3 Monitoring and observability**: CloudWatch for token usage, prompt effectiveness, **hallucination rates**, response quality; anomaly detection for token bursts and response drift; **Bedrock Model Invocation Logs**; cost anomaly detection; **tool-calling observability and multi-agent coordination tracking**; vector store operational monitoring; golden datasets for hallucination detection, output diffing, reasoning path tracing.

**How to prepare**: only 12%, but the highest practical value in the exam — and **semantic caching and prompt caching are things most people have never implemented**. They determine the cost structure of an LLM application; build each at least once.

### Domain 5: Testing, Validation, and Troubleshooting (11%)

**5.1 Evaluation** (9 skills): quality metrics (relevance, factual accuracy, consistency, fluency); **Bedrock Model Evaluations**, A/B and canary testing, multi-model evaluation, token efficiency and latency-to-quality ratios; user feedback interfaces, rating systems, annotation workflows; continuous evaluation, regression testing, **automated quality gates**; **RAG evaluation and LLM-as-a-Judge**, human feedback; retrieval quality testing (relevance scoring, context matching, retrieval latency); **Bedrock Agent evaluations**, task completion rate, tool usage effectiveness, multi-step reasoning quality; deployment validation (synthetic user workflows, hallucination rate and semantic drift checks).

**5.2 Troubleshooting**: context window overflow, dynamic chunking, truncation errors; FM API integration failures; prompt testing frameworks and version comparison; retrieval issues (embedding quality diagnostics, drift monitoring, vectorization and chunking remediation); prompt maintenance (CloudWatch Logs for prompt confusion, X-Ray prompt observability, schema validation).

**How to prepare**: this overlaps heavily with [RAG evaluation frameworks](/posts/ai/2026-03-12-rag-evaluation-frameworks-en) on this site — read that for the methodology, then map it onto Bedrock's specific tooling.

## A Ten-Week Schedule and Its Derivation

**Derivation**: professional level, and domains 1 and 2 contain a great deal that only sticks through building (a full RAG chain, multi-agent systems, MCP server deployment). Time follows the weights, with extra allocated to the hands-on domains. Against [AIF-C01's four weeks](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en) — a knowledge exam with no hands-on domain — this one carries more than double the content and the implementation load.

At 8–10 hours a week over ten weeks:

| Week | Content | Reasoning |
|---|---|---|
| 1 | Read the exam guide end to end + the official practice question set | Find out which part you are missing |
| 2–4 | **Domain 1 (31%)** — week 2 FM selection and data pipelines, week 3 vector stores, week 4 RAG and prompt governance | Heaviest domain, and 1.4/1.5 require actually building RAG |
| 5–6 | **Domain 2 (26%)** — week 5 agentic AI and MCP, week 6 deployment and API integration | Task 2.1 alone carries 7 skills |
| 7–8 | Domain 3 (20%) | One hands-on pass on Guardrails plus the governance concepts |
| 9 | Domain 4 (12%) + Domain 5 (11%) | 23% combined and thematically adjacent (monitoring and evaluation) |
| 10 | Full review + practice questions again | The close |

**Without a year of hands-on GenAI work, this schedule does not hold.** The recommended experience is real here: domains 1 and 2 test what you have built and broken, not what you have read. In that situation, shipping an actual RAG-plus-agent project beats scheduling ten weeks of study.

**Cost of failure**: the AWS [retake policy](https://aws.amazon.com/certification/policies/after-testing/) is a 14-day wait with no attempt limit — but at **$300** this is the most expensive exam in the series, three times AIF-C01. Take the full schedule; do not treat a sitting as reconnaissance.

**Priority of official material**: the [Exam Prep Plan (AIP-C01)](https://skillbuilder.aws/category/exam-prep/generative-ai-developer-professional-AIP-C01) — 16 items, 14h 43m → the **Official Practice Question Set** (48m) → the **AWS Generative AI Developer Advanced Learning Plan (includes Labs)** — 22 items, 45h 20m, the heaviest hands-on option. The Official Pretest (3h) is badged Subscription. AWS also runs a three-day instructor-led course, *Advanced Generative AI Development on AWS*, covering Bedrock Knowledge Bases retrieval augmentation and agentic AI with AgentCore.

## Telling Whether Your Material Is Stale

This exam was refreshed in March 2026. The [official announcement](https://aws.amazon.com/blogs/training-and-certification/big-news-aws-expands-ai-certification-portfolio-and-updates-security-certification/) (published 2025-10-14, edited 2026-03-17) states:

> To align with the rapid pace of AI innovation, the standard version of the exam has been refreshed to reflect changes in AWS services, including the addition of Amazon Bedrock AgentCore. The last day to take the beta version of the exam is March 31, 2026.

**The test**: search your material's contents for **Bedrock AgentCore, Strands Agents, AWS Agent Squad, MCP, Bedrock reranker, Kiro**. If none appear, it predates March 2026. Another signal is "Amazon SageMaker" where the current name is "Amazon SageMaker AI."

## After You Pass

**Three years, one renewal path**: retake AIP-C01. The **50% voucher** applies, so $150.

**But it renews three others.** Passing AIP-C01 pushes AIF-C01, MLA-C01, and Data Engineer – Associate out by three years each — if you hold those, the real value of this exam is more than one more badge.

**You cannot retake the same exam within two years of passing it.**

## Things That Will Go Stale (Check These Next Time)

| Item | Status as of 2026-08-18 | When to re-check |
|---|---|---|
| Guide content | Includes Bedrock AgentCore (March 2026 refresh) | After each re:Invent |
| Domain weights | 31 / 26 / 20 / 12 / 11 | On every revision |
| Fee and item count | $300, 75 questions (65 scored), 180 minutes | Quarterly |
| Renewal path | Retake only, but renews AIF / MLA / DEA | Every six months |
| Languages | English, Japanese, Korean, Simplified Chinese | Every six months |

## References

- [AWS Certified Generative AI Developer – Professional certification page](https://aws.amazon.com/certification/certified-generative-ai-developer-professional)
- [AIP-C01 official exam guide (HTML)](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html)
- [AWS announcement: expanded AI certification portfolio (AgentCore refresh, beta end date)](https://aws.amazon.com/blogs/training-and-certification/big-news-aws-expands-ai-certification-portfolio-and-updates-security-certification/)
- [AWS Skill Builder — AIP-C01 Exam Prep](https://skillbuilder.aws/category/exam-prep/generative-ai-developer-professional-AIP-C01)
- [AWS Recertification (renewal paths and the 50% voucher)](https://aws.amazon.com/certification/recertification/)
- [AWS Certification — After Testing (retake policy)](https://aws.amazon.com/certification/policies/after-testing/)

**Related on this site**

- [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)
- [AWS AI Practitioner (AIF-C01) preparation path](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en)
- [Preparing for Google PMLE](/posts/ai/2026-08-18-google-pmle-prep-guide-en)
- [RAG evaluation frameworks](/posts/ai/2026-03-12-rag-evaluation-frameworks-en)
