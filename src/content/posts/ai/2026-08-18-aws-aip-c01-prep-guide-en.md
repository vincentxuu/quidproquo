---
title: "AWS GenAI Developer Professional (AIP-C01) Prep Guide: Exam Scope, Resources, and a Four-Step Plan"
date: 2026-08-18
type: guide
category: ai
tags: [certification, aws, generative-ai, rag, agents, career]
lang: en
series:
  name: "AI Certification Prep"
  order: 2
tldr: "AIP-C01 tests integrating foundation models into production AWS applications: RAG, agents, security, cost, and evaluation. This guide follows the five official domains with a prerequisite self-check, four-step preparation plan, resource choices, and hands-on checkpoints, plus a ten-week schedule, an AI study prompt, and exam-day guidance. Start with a diagnostic, then close gaps through one RAG-and-agent project."
description: "Prepare for AWS AIP-C01 with five-domain coverage, a four-step study plan, official and third-party resources, RAG and agent checkpoints, mistake logs, and an AI study prompt. Distinguishes beta candidate reports from current standard-exam specifications."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-aws-aip-c01-prep-guide)
>

This guide draws on official sources and named candidates' accounts. It is not a firsthand exam report; I have not taken this exam. The [official exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html) defines the scope. The study sequence, hands-on checkpoints, and schedule are my suggestions. Verified 2026-09-12.

AIP-C01 focuses on **integrating foundation models into production applications**. It lists model development and training, advanced ML, and data and feature engineering among the tasks candidates are not expected to perform. That does not mean all related knowledge is irrelevant: [domain 1](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain1.html) still includes deploying and managing fine-tuned models, LoRA and adapters, and processing GenAI input data.

Keep that boundary in mind when studying. Model research and training from scratch need not drive your preparation, but you should know when customization is appropriate, how data reaches the model, and how to validate the whole system. RAG, agents, guardrails, cost and latency, evaluation, and debugging are different parts of the same application.

For prices, validity, and requirements across vendors, see [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en).

## Who This Is For

AWS recommends at least two years of production application development on AWS or with open-source technologies, general AI/ML or data engineering experience, and one year of hands-on GenAI implementation. This describes the target candidate; **it is not an eligibility requirement**, and years of experience cannot be converted directly into study weeks.

**A fit** if you have built LLM applications, agents, or RAG and want to turn that experience into sound AWS architecture decisions. If model training and ML pipelines are your main goal, compare the MLA-C01 guide first. The exams share cloud, security, and deployment foundations, but have different priorities.

### Prerequisite Self-Check

AWS lists computing, storage, networking, security and identity, deployment and IaC, monitoring, and cost optimization as foundational knowledge. These questions make that more concrete than asking whether you already hold SAA:

| Area | Before studying, try to do this |
|---|---|
| AWS application development | Draw the data flow through API Gateway, Lambda, S3, and a database, and identify where to investigate failures |
| Identity and networking | Explain how the application role gains access to models, documents, and tools, and which requests should use private networking |
| Deployment and operations | Rebuild an environment with a familiar IaC tool, roll back a version, inspect logs, and track spending |
| GenAI implementation | Build RAG that cites its sources, and distinguish missing evidence from an incorrect answer despite relevant evidence |
| Agent integration | Connect an external tool and handle timeouts, access denials, and actions requiring human approval |

If only AWS fundamentals are missing, take the relevant cloud modules. If you mainly lack Bedrock experience, port an existing RAG application. If both are unfamiliar, use the [AIF-C01 guide](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en) to build your vocabulary and service map, then return to a project. **You do not need to collect other certifications before AIP**; the official certification page specifies no prerequisite certification.

## Official Specs at a Glance

| Item | Detail |
|---|---|
| Fee | US$300; check the booking page for currency, taxes, and discounts |
| Length | 180 minutes |
| Questions | 75, of which **65 are scored and 10 unscored** |
| Question types | Multiple choice and multiple response (**no** ordering or matching, unlike AIF-C01) |
| Passing score | Scaled **750** (range 100–1,000), compensatory |
| Guessing | Unanswered questions count as incorrect; wrong guesses incur no additional penalty. **Never leave a blank** |
| Validity | 3 years |
| Languages | English, Japanese, Korean, Simplified Chinese (**no Traditional Chinese**) |
| Prerequisites | None |

750 is a scaled score, **not 75% correct**. AWS uses overall compensatory scoring, with no separate passing requirement for each domain. Multiple-response questions require all correct choices for credit.

## The Five Domain Weights

| Domain | Weight |
|---|---|
| 1. Foundation Model Integration, Data Management, and Compliance | **31%** |
| 2. Implementation and Integration | 26% |
| 3. AI Safety, Security, and Governance | 20% |
| 4. Operational Efficiency and Optimization for GenAI Applications | 12% |
| 5. Testing, Validation, and Troubleshooting | 11% |

**Domains 1 and 2 total 57%**, making RAG and integration a useful starting point. Practice domain 3's security and governance and domains 4–5's operations and evaluation alongside that work. AWS publishes domain weights only; **task and skill counts cannot establish their share of exam questions**.

## Domain by Domain

### Domain 1: FM Integration, Data Management, and Compliance (31%, the heaviest)

This domain contains six tasks, covered below in order. Start the hands-on work with vector storage and retrieval.

**1.1 Analyze requirements and design solutions**: architectural designs, technical PoC with Bedrock, standardized components via the AWS Well-Architected Framework and its **Generative AI Lens**.

**1.2 Select and configure FMs**: selection by benchmarks, capability, and limitations; **dynamic model-switching architecture** (Lambda, API Gateway, AppConfig); resilience (Step Functions circuit breakers, **Bedrock Cross-Region Inference**, cross-Region deployment, graceful degradation); the customization lifecycle (SageMaker AI fine-tuned deployments, **LoRA and adapters**, Model Registry versioning, rollback, model retirement).

**1.3 Data validation and processing pipelines**: Glue Data Quality, SageMaker Data Wrangler, Lambda, CloudWatch; multimodal handling (Bedrock multimodal models, SageMaker Processing, Transcribe); model-specific input formatting (JSON for the Bedrock API, conversation formatting).

**1.4 Vector store design**: hierarchical organization in Bedrock Knowledge Bases; OpenSearch Service with the Neural plugin; RDS with S3 document repositories; DynamoDB alongside vector databases; metadata frameworks (S3 object metadata, custom attributes, tagging); **high-performance indexing (OpenSearch sharding, multi-index, hierarchical indexing)**; integration with document management systems; data maintenance (incremental updates, real-time change detection, sync workflows, scheduled refresh).

**1.5 Retrieval mechanisms and RAG**: chunking (Bedrock native, fixed-size via Lambda, hierarchical); embedding selection (**Amazon Titan embeddings**, dimensionality and domain fit, batch embedding via Lambda); vector search deployment (OpenSearch, **Aurora pgvector**, Bedrock Knowledge Bases managed store); **advanced search (hybrid keyword plus vector, Bedrock reranker models)**; query handling (expansion, decomposition, transformation); access mechanisms (function calling, **MCP clients for vector queries**, standardized retrieval APIs).

**1.6 Prompt engineering and governance**: role definitions in Bedrock Prompt Management, Bedrock Guardrails; interactive context (Step Functions clarification, Comprehend intent, DynamoDB conversation history); **prompt governance** (parameterized templates, approval workflows, S3 repositories, CloudTrail, CloudWatch Logs); prompt QA and regression testing; **Bedrock Prompt Flows** for chains, conditional branching, and reusable components.

**How to prepare**: build enough of a RAG system to compare design tradeoffs. Start with Bedrock Knowledge Bases, then implement part of the retrieval path yourself with Aurora pgvector. Compare metadata filtering, incremental updates, and operational responsibilities. Use the same questions to compare chunking, hybrid search, and reranking; change one variable at a time and retain the retrieved passages and answers. These are practice suggestions, not a claim that each skill receives equal exam weight.

### Domain 2: Implementation and Integration (26%)

**2.1 Agentic AI and tool integration** (multi-agent systems, tools, and state management): **Strands Agents** and **AWS Agent Squad** for multi-agent systems; **MCP** for agent-to-tool interaction; memory and state management; ReAct and chain-of-thought via Step Functions; **safeguards** (stopping conditions, Lambda timeouts, IAM resource boundaries, circuit breakers); model ensembles and coordination; human-in-the-loop (Step Functions review and approval, API Gateway feedback); **MCP servers on Lambda for lightweight stateless tools and on ECS for complex ones**.

**2.2 Deployment strategies**: Lambda on-demand invocation, **Bedrock provisioned throughput**, hybrid SageMaker AI endpoints; container deployments tuned for memory, GPU, and token throughput; **model cascading** and smaller task-specific models.

**2.3 Enterprise integration**: legacy API integration, event-driven loose coupling; API Gateway microservices, Lambda webhooks, EventBridge; identity federation, RBAC, least-privilege API access to FMs; **AWS Outposts and Wavelength** for data residency and edge; **CI/CD and GenAI gateway architectures** (CodePipeline, CodeBuild, automated tests, security scans, rollback, centralized abstraction layers).

**2.4 FM API integration**: Bedrock synchronous APIs, SDKs with SQS for async; **Bedrock streaming APIs**, WebSockets and SSE, chunked transfer encoding; resilience (SDK exponential backoff, API Gateway rate limiting, fallbacks, **X-Ray**); **intelligent model routing** (static, content-based via Step Functions, metric-based).

**2.5 Application integration and developer tools**: API Gateway handling for streaming, token limits, retries; **AWS Amplify** UI components, OpenAPI, no-code Bedrock Prompt Flows; **Bedrock Data Automation**; **Amazon Q Developer** for code generation and refactoring; CloudWatch Logs Insights with X-Ray for troubleshooting.

**How to prepare**: the agent material overlaps conceptually with [the agent series](/posts/ai/2026-08-10-agent-security-harness-layer-en) on this site, but **the exam wants the AWS-specific mapping** — knowing "you need multi-agent orchestration" is not enough; know how Strands Agents and Agent Squad differ in positioning, and when an MCP server belongs on Lambda versus ECS.

**Understand how AgentCore components divide responsibilities.** The [official overview](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html) provides a starting map: Runtime for execution and isolation, Gateway for connecting tools, Identity for identities and credentials, Memory for context across interactions, and Observability for tracing and debugging. Place these capabilities in your agent's data flow and explain which responsibilities the managed service takes on and which remain with your application. New service features do not automatically become exam topics; use the exam guide to establish scope.

### Domain 3: AI Safety, Security, and Governance (20%)

**3.1 Input and output safety controls**: Bedrock Guardrails for input and response filtering; custom moderation via Step Functions and Lambda; **hallucination reduction** (Knowledge Base grounding plus fact-checking, confidence scoring, semantic similarity, **JSON Schema structured outputs**); defense in depth (Comprehend pre-filters, model-side guardrails, Lambda post-processing, API Gateway response filtering); **prompt injection and jailbreak detection**, input sanitization, safety classifiers, automated adversarial testing.

**3.2 Data security and privacy**: VPC endpoints, IAM, **Lake Formation**, CloudWatch; PII detection with **Comprehend and Macie**, Bedrock native privacy features, S3 Lifecycle retention; masking and anonymization.

**3.3 Governance and compliance**: programmatic **model cards** in SageMaker AI, Glue data lineage, metadata tagging, CloudWatch decision logs; Glue Data Catalog source registration, CloudTrail audit logging; continuous monitoring (misuse, drift, policy-violation detection, **bias drift monitoring**, token-level redaction, response logging, output policy filters).

**3.4 Responsible AI**: transparency (reasoning displays, confidence metrics, source attribution, **Bedrock agent tracing**); fairness (CloudWatch fairness metrics, A/B testing through Prompt Management and Prompt Flows, **LLM-as-a-judge automated evaluation**); policy compliance (guardrails derived from policy, model cards documenting limitations, Lambda compliance checks).

**How to prepare**: add harmful-content, personal-data, and unauthorized-query cases to the same RAG application. Check content filtering, data authorization, and audit records separately. JSON Schema checks structure, not factual accuracy; grounding and fact-checking still need their own validation. A model's self-reported confidence is not an accuracy measure either.

### Domain 4: Operational Efficiency and Optimization (12%)

**4.1 Cost optimization**: token estimation and tracking, context window optimization, response size controls, **prompt compression and context pruning**; cost-capability tradeoffs, **tiered FM usage by query complexity**, price-to-performance ratio; batching, capacity planning, auto-scaling, provisioned throughput optimization; **semantic caching, result fingerprinting, edge caching, deterministic request hashing, prompt caching**.

**4.2 Performance and latency**: pre-computation, **latency-optimized Bedrock models**, parallel requests, response streaming, benchmarking; retrieval speed (index optimization, query preprocessing, hybrid search with custom scoring); throughput (token processing optimization, batch inference, concurrency management); **temperature and top-k/top-p selection**, A/B testing; API call profiling and vector database query optimization.

**4.3 Monitoring and observability**: CloudWatch for token usage, prompt effectiveness, **hallucination rates**, response quality; anomaly detection for token bursts and response drift; **Bedrock Model Invocation Logs**; cost anomaly detection; **tool-calling observability and multi-agent coordination tracking**; vector store operational monitoring; golden datasets for hallucination detection, output diffing, reasoning path tracing.

**How to prepare**: distinguish **semantic caching from [prompt caching](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html)**. The former reuses results for similar requests; the latter reuses the model computation for a shared prompt prefix. Test repeated questions and repeated prefixes separately. Record token usage, latency, and answer quality, and check cache invalidation and isolation between users' data.

### Domain 5: Testing, Validation, and Troubleshooting (11%)

**5.1 Evaluation** (9 skills): quality metrics (relevance, factual accuracy, consistency, fluency); **Bedrock Model Evaluations**, A/B and canary testing, multi-model evaluation, token efficiency and latency-to-quality ratios; user feedback interfaces, rating systems, annotation workflows; continuous evaluation, regression testing, **automated quality gates**; **RAG evaluation and LLM-as-a-Judge**, human feedback; retrieval quality testing (relevance scoring, context matching, retrieval latency); **Bedrock Agent evaluations**, task completion rate, tool usage effectiveness, multi-step reasoning quality; deployment validation (synthetic user workflows, hallucination rate and semantic drift checks).

**5.2 Troubleshooting**: context window overflow, dynamic chunking, truncation errors; FM API integration failures; prompt testing frameworks and version comparison; retrieval issues (embedding quality diagnostics, drift monitoring, vectorization and chunking remediation); prompt maintenance (CloudWatch Logs for prompt confusion, X-Ray prompt observability, schema validation).

**How to prepare**: this overlaps heavily with [RAG evaluation frameworks](/posts/ai/2026-03-12-rag-evaluation-frameworks-en) on this site — read that for the methodology, then map it onto Bedrock's specific tooling.

## How to Prepare

Follow the [four steps on the AWS certification page](https://aws.amazon.com/certification/certified-generative-ai-developer-professional/): understand the exam → build knowledge → review and practice → assess readiness. For AIP, connect all four to a working project. Otherwise, finishing a course may leave you unable to judge architecture choices.

### How Much Time Do You Need?

The original ten-week plan is a scheduling example, not evidence of how long passing takes. **Assess your gaps before choosing a timeline**:

| Current background | Preparation priority |
|---|---|
| Already operate RAG and agents on Bedrock | Diagnose gaps, then cover unfamiliar tasks, governance, and long scenario questions |
| Have built GenAI applications on another platform | Map your designs to AWS and fill gaps in IAM, deployment, monitoring, and service limits |
| Know AWS but have only built prompt demos | Complete the project below before choosing an exam date |
| New to both AWS and GenAI | Build the foundations before starting a ten-week countdown |

The early [Christian Greciano beta report](https://christiangreciano.com/blog/posts/2026/1/0013_how-i-passed-aws-aip-genai-dev-pro-beta/) remains useful context: despite already holding four AWS certifications, insufficient preparation and practice left him short on time, though he passed with 760. The beta used a different item count and duration, however, so **it cannot describe the standard-exam experience**.

### How Standard-Exam Candidates Prepared and Found It

The four first-person accounts below were published after the standard exam became available. The first three state an exam or pass date; the fourth states that its author earned AIP. They are a small, clearly contextualized sample: useful for seeing differences, but not for estimating an average study duration or a resource's pass rate.

| Candidate and timing | Background and approach | Lesson worth carrying forward |
|---|---|---|
| [motuneko253, exam on 2026-04-18](https://qiita.com/motuneko253/items/01c898cf9627b33143c4) | Held many AWS certifications, including SAP; studied for under a week with CloudLicense questions and passed with 805 | This is a lower-bound case for an experienced AWS test taker, not a one-week plan for newcomers. The author credits existing architecture judgment with ruling out plainly unsuitable choices. |
| [Mamezou, 2026-04-20](https://developer.mamezou-tech.com/blogs/2026/04/20/aws_certified_generative_ai_developer/) | Failed the beta, then passed after preparing again for the standard exam; focused on the guide, Bedrock-adjacent services, and extracting requirements and constraints from long scenarios | Existing certifications do not prevent long prompts or scalability/security/cost tradeoffs from becoming the bottleneck. Listing constraints before choosing an architecture is more dependable than memorizing service names. |
| [ohway_death, 2026-06-22](https://qiita.com/ohway_death/items/f8994cf316b212f4c2b1) | Four years of AWS work and currently builds with CDK, GenAI, and Step Functions; used SimuLearn, official questions, a course, two practice sets, and source-document review | Planned two minutes per item plus a 30-minute review buffer, but needed 160 minutes to answer everything and flagged 25 items. Timed standard-exam practice belongs in the plan, not only untimed questions. |
| [AsiaQuest's Sakurai, 2026-07-24](https://techblog.asia-quest.jp/202607/aws-generative-ai-developer-aip-exam-guide) | Has AI/infrastructure experience and an AWS all-certifications background; used Skill Builder questions, mock exams, and Black Belt materials for service behavior | Work experience can shorten the path from service names to system behavior, but this author also started with strong AWS foundations. Pair official practice with study of services you have not used at work. |

The backgrounds differ sharply, but two patterns recur. First, **the standard exam still asks for architecture tradeoffs inside long scenarios**: identify constraints such as data residency, authorization, cost, latency, and operational ownership before comparing options. Second, **hands-on experience does not replace study**; it helps turn a service choice into a data flow, a failure response, and an observability plan. That is why “passed in a week” and “needed several rounds of timed practice” can both be true.

Apply the practices, not their schedules: first use a timed set to find gaps; verify each gap against the guide or official documentation; then close it with one project that retains logs, cost data, and security-denial evidence. Treat personal descriptions of the live exam only as study leads. The official exam guide remains the source of truth for scope.

### Step 1: Understand the Exam and Record a Baseline

Read the [exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html), marking each task as “have implemented,” “can explain,” or “unfamiliar.” Then attempt the official **Practice Question Set** without opening the explanations. Record guesses as well as wrong answers: a correct guess still represents a gap.

Map each gap to a task such as “1.5 retrieval,” “2.1 tool integration,” or “5.2 troubleshooting.” If an IAM condition is confusing, study IAM. If you cannot diagnose a retrieval failure, inspect your application logs. One wrong answer is not a reason to restart an entire course.

### Step 2: Build Knowledge Around One Main Resource

**Official route**: use the [AIP-C01 Exam Prep Plan](https://skillbuilder.aws/category/exam-prep/generative-ai-developer-professional-AIP-C01) as a coverage checklist. AWS's announcement confirms domain lessons, practice assessments, and SimuLearn exercises. If you need more guided instruction, consider [Advanced Generative AI Development on AWS](https://skillbuilder.aws/learn/YACQQYH17K/advanced-generative-ai-development-on-aws/1QJSMSPUVB), covering Knowledge Bases, AgentCore, and enterprise integration.

**For videos and demonstrations**: compare the [Frank Kane / Stéphane Maarek AIP-C01 course](https://www.udemy.com/course/ultimate-aws-certified-generative-ai-developer-professional/). Its current page lists AgentCore, Strands, Agent Squad, RAG, evaluation, and a full practice exam. These are the provider's descriptions; I have not completed and reviewed the course. Preview a topic you need before buying. You do not need several main courses at once.

**Project: build an enterprise assistant that retrieves documents and calls tools.** These exercises are my suggestions based on the exam guide, not official AWS labs or real exam questions:

| Exercise | What to build | Evidence to retain |
|---|---|---|
| RAG and data updates | Import documents into Knowledge Bases, compare chunking and retrieval settings, and test updated and deleted documents | Questions, expected sources, retrieved passages, answers, and sync results; explain missed retrievals |
| Agents and tools | Connect a read-only query tool, then a write action requiring approval; simulate timeouts, denials, and duplicate requests | Tool inputs and outputs, permission boundaries, and stopping conditions; retries must not duplicate writes |
| Security and governance | Test personal data, harmful content, malicious instructions in documents, and cross-user queries | Records of each layer's filtering or denial; confirm that other users' data is not exposed |
| Cost and evaluation | Compare models, prompts, or cache settings on a fixed question set, changing one thing at a time | Task success, source support, token usage, latency, and regression results |

Start with a minimal reproducible version and expand it. If using your own AWS account, configure [AWS Budgets alerts](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html) first and remove unused endpoints, vector stores, and storage afterward. Budget alerts do not automatically stop charges.

### Step 3: Turn Service Names Into Decision Rules

AIF's scenario-to-service matching becomes a deeper exercise in AIP: explain **why another plausible option fails a requirement**. Use the following as starting points for reasoning, not keyword rules with fixed answers:

| Scenario | Tradeoff to investigate first |
|---|---|
| Enterprise knowledge changes frequently and answers must cite sources | Check retrieval, synchronization, and permissions before deciding whether model customization is also needed |
| An agent will use a tool with side effects | Enforce authorization, approval, and duplicate-request handling where the tool executes; a cautious prompt is insufficient |
| Answers are getting slower | Measure retrieval, model, and tool time separately before changing indexes, models, streaming, or concurrency |
| The API works but answers are unreliable | Inspect retrieved evidence, prompts, model outputs, and evaluation criteria; HTTP success is not task success |
| An anomalous action or answer needs investigation | Distinguish what API audits, application logs, model interaction records, and end-to-end traces can establish |

For more practice, [Tutorials Dojo AIP-C01](https://portal.tutorialsdojo.com/courses/aws-certified-generative-ai-developer-professional-aip-c01-practice-exams/) offers review, timed, domain-based, and randomized modes with explanations and reference links. Start in review mode to find gaps, then switch to timed mode. These are vendor-described features; I have not verified claims about similarity to real exam questions.

A mistake log need not reproduce the whole question:

| Task | Constraint I missed | Why my choice failed | Rule for next time | Official source / retest result |
|---|---|---|---|---|
| 2.1 Tool integration | Approval is required before writing | Content filtering did not prevent tool execution | Locate authorization and approval at the action boundary | Check the documentation and rerun the denial case |

For long questions, read the final requirement first. Identify constraints such as lowest cost, least operational effort, or data remaining in a specified region, then read the complete scenario. For multiple-response questions, evaluate every option rather than stopping at the first plausible answer.

### Step 4: Assess Readiness

The current AIP certification page lists **Official Pretest** in step four. Do not copy AIF's resource table and assume the two exams use identical course and assessment names. Also complete an unseen full question set under timed conditions to check your reading pace.

Before booking, I suggest confirming that:

- You can explain both the correct answer and the constraint each rejected option violates.
- You can derive a design for an unfamiliar scenario without remembering an option's position.
- You have addressed gaps in all five domains, including more than a last-minute skim of domains 4 and 5.
- Your project can reproduce retrieval failures, tool timeouts, and security denials, with records that help you investigate them.
- You finish timed practice with time to revisit uncertain answers.

A high score on familiar questions may only show that you remember the answers. Third-party accuracy percentages cannot be converted directly into AWS's scaled score of 750.

### Studying With AI: Question Your Reasoning, Verify the Answers

Give an AI tool verified official material and your own mistake summaries, and ask it to quiz you. This is a suggested workflow, not a claim about score improvements. For example:

```text
Using only the AWS official material I provide, create one original scenario
question for task 1.5 and one for task 2.1.
Ask one question at a time without revealing the answer. After I respond:
1. Identify any requirement or constraint I missed.
2. Explain when each option applies and why it does not fit this scenario.
3. Cite the source passage supporting the judgment. If the material is
   insufficient, say so; do not invent service capabilities.
4. Change one constraint and ask again to test whether I can reason afresh.
Do not reconstruct or claim to provide real exam questions.
```

Check AI-generated claims about service limits and API behavior against official documentation. Keep your study cards to your own concept summaries and original examples; do not upload company data or full restricted question banks. Before the exam, being quizzed on confusing design choices is more likely to expose gaps than asking for another long summary.

### Resource Overview: Give Each Tool a Purpose

| Resource | Purpose | Selection note |
|---|---|---|
| Official exam guide | Scope and task checklist | Public document; use it to check every other resource |
| Official Practice Question Set | First exposure to official question style | Enter through AIP Exam Prep; it is not a full exam |
| AIP Exam Prep Plan | Main route for learning and domain review | Check free/subscription labels after signing in |
| Builder Labs, Cloud Quest, Jam | Guided implementation or challenges | Listed as practice options by AWS; choose activities that address your gaps |
| SimuLearn | Scenario judgment and hands-on practice | AWS's announcement confirms its inclusion in the AIP preparation path |
| Official Pretest | Final readiness check | The assessment currently listed in step four of the AIP certification page |
| Kane / Maarek course | Videos, demonstrations, and a practice exam | Paid option; preview it and check the current syllabus and price |
| Tutorials Dojo | Domain review and timed practice | Paid option; follow explanation links to verify claims instead of memorizing answers |

The Skill Builder category page did not return readable course details during this check. I therefore removed the old exact durations, item counts, and subscription prices. Official resource purposes above come from the AWS certification page and announcement. Confirm the actual contents and charges after signing in before purchasing.

### A Ten-Week Schedule Example

At roughly 8–10 hours per week, this is a study plan for someone with existing foundations, **not an AWS recommendation or candidate average**. Alongside each week's focus, retain logs, cost data, and evaluation results from your first lab onward:

| Week | Focus | Completion checkpoint |
|---|---|---|
| 1 | Exam guide, official questions, prerequisite gaps | A task-based list of weak areas |
| 2–3 | Domain 1: models, data, RAG, and prompts | A retrieval-design comparison and data-update records |
| 4–5 | Domain 2: agents, tools, deployment, and APIs | Reproducible timeout, access-denial, and approval cases |
| 6–7 | Domain 3: security, privacy, and governance | Rerun malicious-input, personal-data, and unauthorized-access cases |
| 8 | Domain 4: cost, latency, and monitoring | Compare cost and quality after configuration changes; identify bottlenecks |
| 9 | Domain 5: evaluation, regression, and debugging | A fixed evaluation set that catches a worse version and helps locate failures |
| 10 | Pretest, full timed practice, and gap review | Revisit mistake causes and identify remaining unfamiliar tasks |

Extend a phase if its implementation checkpoints remain incomplete. Giving domains 4 and 5 a week each prevents monitoring and debugging from being squeezed into the last evening. They should also run through the earlier project work.

## Before the Exam and on Exam Day

- **Language and extra time**: AIP currently has no Traditional Chinese option. Non-native English speakers taking the English exam can request ESL +30 before booking under the [Before Testing policy](https://aws.amazon.com/certification/policies/before-testing/). Do not assume it applies to other exam languages.
- **Identity checks**: your booking name must match your identification. Check the requirements for your location and delivery method. AWS has additional passport and secondary-ID rules when you do not have qualifying government-issued identification from the testing country; follow your appointment instructions.
- **Test center or online proctoring**: AWS offers Pearson VUE test centers and online delivery. For online testing, complete the required system and environment checks in your appointment instructions. For a test center, plan transport and check-in time.
- **Time allocation**: standard-exam specifications allow an average of about 2.4 minutes per question before reserving review time. If stuck, choose the most plausible answer and flag it rather than leaving later questions unanswered.
- **Results**: AWS normally provides results within five business days, with exceptions for security or technical reviews. Someone else's same-evening badge arrival is not a guarantee.

## Telling Whether Your Material Is Stale

The 2026-03-17 update to the [AWS announcement](https://aws.amazon.com/blogs/training-and-certification/big-news-aws-expands-ai-certification-portfolio-and-updates-security-certification/) confirms that the standard exam added Bedrock AgentCore and that March 31, 2026 was the final beta testing day.

**Older material is not automatically unusable.** RAG, IAM, evaluation, and cost tradeoffs can remain useful; fill the gaps against the current guide. When choosing resources:

- Map coverage to the five domains. Check whether AgentCore, Strands Agents, Agent Squad, MCP, and tool security receive substantive treatment rather than merely appearing in promotional headings.
- Check whether examples still match service limits, model support, and deployment options. Return to official documentation when uncertain.
- Label beta reports' question counts, timings, and topic impressions separately; they do not replace standard-exam specifications.

A resource that says SageMaker without “AI” may simply have older naming. **The name alone cannot establish that the whole course is outdated.** Preview your weakest topic and look for demonstrations of failure handling, evaluation, and tradeoffs.

## After You Pass

Under the [AWS recertification rules](https://aws.amazon.com/certification/recertification/), AIP-C01 is valid for three years and renews by passing the latest version of the same certification exam. If your account has an available 50% discount voucher, the current US-dollar base fee becomes US$150; the booking page determines the actual checkout amount.

Passing AIP-C01 can also renew **existing, active** AIF-C01, MLA-C01, and Data Engineer – Associate certifications. Their new three-year validity starts on the date of the recertification action, not three years after the previous expiry date. It does not award certifications you have never earned.

The [retake policy](https://aws.amazon.com/certification/policies/after-testing/) requires a fourteen-calendar-day wait after a failed attempt and a new payment for each retake. After passing, you cannot retake the same exam for two years. A new exam guide **and a new exam code** allow you to take the new version; a minor guide update alone is not that exception.

## Things That Will Go Stale (Check These Next Time)

| Item | Status as of 2026-09-12 | When to re-check |
|---|---|---|
| Guide content | Includes Bedrock AgentCore (March 2026 refresh) | After each re:Invent |
| Domain weights | 31 / 26 / 20 / 12 / 11 | On every revision |
| Fee and item count | $300, 75 questions (65 scored), 180 minutes | Quarterly |
| Renewal path | Retake only, but renews AIF / MLA / DEA | Every six months |
| Languages | English, Japanese, Korean, Simplified Chinese | Every six months |

## Update Log

- 2026-09-12: Added four independent, post-standard-release candidate reports. Separated beta from standard experience and restored one-week passes to their AWS background and test conditions instead of presenting them as a general schedule.
- 2026-09-12: Used the AIF-C01 guide as a structure reference to add a prerequisite self-check, four-step preparation plan, resource comparisons, hands-on checkpoints, mistake log, AI study prompt, and exam-day guidance. Revised the ten-week schedule, removed inferred skill-level weights and blanket claims that older resources are obsolete, clarified fine-tuning scope and recertification, and synchronized both languages.

## References

- [AWS Certified Generative AI Developer – Professional certification page](https://aws.amazon.com/certification/certified-generative-ai-developer-professional)
- [AIP-C01 official exam guide (HTML)](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html)
- [AWS announcement: expanded AI certification portfolio (AgentCore refresh, beta end date)](https://aws.amazon.com/blogs/training-and-certification/big-news-aws-expands-ai-certification-portfolio-and-updates-security-certification/)
- [AWS Skill Builder — AIP-C01 Exam Prep](https://skillbuilder.aws/category/exam-prep/generative-ai-developer-professional-AIP-C01)
- [AWS Recertification (renewal paths and the 50% voucher)](https://aws.amazon.com/certification/recertification/)
- [AWS Certification — After Testing (retake policy)](https://aws.amazon.com/certification/policies/after-testing/)

- [AIP-C01 Domain 1: FMs, data, and retrieval](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain1.html)
- [AIP-C01 Domain 2: agents and application integration](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain2.html)
- [AIP-C01 Domain 3: security and governance](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain3.html)
- [AIP-C01 Domain 4: efficiency and monitoring](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain4.html)
- [AIP-C01 Domain 5: evaluation and troubleshooting](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain5.html)
- [Bedrock AgentCore official overview](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html)
- [Bedrock prompt caching: prefix reuse and model support](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html)
- [AWS Budgets: notifications and actions](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html)
- [AWS Before Testing: ESL and identity verification](https://aws.amazon.com/certification/policies/before-testing/)
- [Frank Kane / Stéphane Maarek AIP-C01 course](https://www.udemy.com/course/ultimate-aws-certified-generative-ai-developer-professional/) — provider-described content, not a completed-course review
- [Tutorials Dojo AIP-C01 practice exams](https://portal.tutorialsdojo.com/courses/aws-certified-generative-ai-developer-professional-aip-c01-practice-exams/) — practice modes as described by the vendor
- [Christian Greciano: AIP-C01 beta exam report](https://christiangreciano.com/blog/posts/2026/1/0013_how-i-passed-aws-aip-genai-dev-pro-beta/) — personal experience, not evidence of standard-exam topic weights

**Standard-exam candidate reports**

- [motuneko253: AIP-C01 pass report](https://qiita.com/motuneko253/items/01c898cf9627b33143c4) — exam on 2026-04-18, 805 score; experienced AWS certification background
- [Mamezou: AWS Generative AI Developer pass and dual-cloud all-certifications](https://developer.mamezou-tech.com/blogs/2026/04/20/aws_certified_generative_ai_developer/) — standard-exam pass in April 2026 after a beta failure
- [ohway_death: AIP-C01 exam report](https://qiita.com/ohway_death/items/f8994cf316b212f4c2b1) — standard-exam preparation, timing, and pass record from June 2026
- [AsiaQuest: AIP-C01 preparation method](https://techblog.asia-quest.jp/202607/aws-generative-ai-developer-aip-exam-guide) — credential holder's July 2026 account and Skill Builder / Black Belt preparation

**Related on this site**

- [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)
- [AWS AI Practitioner (AIF-C01) preparation path](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en)
- [Preparing for Google PMLE](/posts/ai/2026-08-18-google-pmle-prep-guide-en)
- [RAG evaluation frameworks](/posts/ai/2026-03-12-rag-evaluation-frameworks-en)
