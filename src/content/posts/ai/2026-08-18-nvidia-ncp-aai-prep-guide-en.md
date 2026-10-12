---
title: "NVIDIA NCP-AAI (Agentic AI Professional): Only 7% Is NVIDIA-Specific, but Registration Isn't Open Yet"
date: 2026-08-18
type: guide
category: ai
tags: [certification, nvidia, agents, multi-agent, career]
lang: en
series:
  name: "AI Certification Prep"
  order: 10
tldr: "NCP-AAI is NVIDIA's professional-level agentic AI credential — $200, 120 minutes, 60–70 items, two-year validity. Of its ten areas the heaviest are Agent Architecture and Design at 15% and Agent Development at 15%; only NVIDIA Platform Implementation at 7% is explicitly tied to NVIDIA products, and the rest is general agentic engineering. Two things to know first: registration is not open (the Register button carries a 'Coming soon' label), and the web page and the PDF study guide differ on two weights (Deployment and Scaling 13% versus 5%, Run/Monitor/Maintain 5% versus 7%), so budget those as a range."
description: "A preparation guide for NVIDIA NCP-AAI (Agentic AI Professional), covering all ten topic areas and their weights, the not-yet-open registration status, how to budget time where the web page and PDF weights differ, how to choose among the five paid DLI courses, and the two-year retake-only recertification rule."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-nvidia-ncp-aai-prep-guide)
>
> This is a preparation path built from official material, not an exam-day account — I have not sat this exam, and at present nobody can. Every "what it tests" points back to the [official certification page](https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/) and the official Exam Study Guide. No leaked questions. Verified 2026-08-18; registration status, specs, and weights re-confirmed 2026-10-12.

NCP-AAI is one of the few **professional-level credentials dedicated to agentic AI**, a category it shares with Microsoft's AI-500. Only one of its ten areas (7%) is explicitly tied to NVIDIA products; the rest is general agentic engineering. Registration is not open yet, though, and that shapes how you should prepare.

For prices, validity, and gates across vendors, see [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en) — not repeated here.

## Registration: Not Open Yet

Next to the "Register for Exam" button on the official certification page sits the label **"(Coming soon)"**. Its sibling NCP-GENL is in the same state, while both associate exams (NCA-GENL, NCA-GENM) link straight to a Certiverse checkout.

**NVIDIA publishes no opening date.** So this article's purpose is: the objectives are public, so use them to audit your gaps and plan hands-on work — but don't put "passed" on a near-term roadmap.

## Official Specs at a Glance

| Item | Detail |
|---|---|
| Fee | **$200** |
| Length | **120 minutes** |
| Items | **60–70** |
| Passing score | **Not published** — the FAQ says "pass/fail. You won't receive a score." |
| Validity | 2 years, renewable **only by retaking** |
| Language | English only |
| Delivery | Online, remotely proctored |
| Registration | **Not open yet (Coming soon)** |

The **prerequisites** are specific:

> 1–2 years of experience in AI/ML roles and hands-on work with production-level agentic AI projects. Strong knowledge of agent development, architecture, orchestration, multi-agent frameworks, and the integration of tools and models across various platforms. Experience with evaluation, observability, deployment, user interface design, reliability guardrails, and rapid prototyping platforms is also essential…

Note "**production-level agentic AI projects**" — not a gap you can read your way out of.

## The Ten Topic Areas

NVIDIA slices this exam more finely than its others, into ten areas. The weights and descriptions both come from the table on the official web page:

| Topic area | Weight |
|---|---|
| Agent Architecture and Design | 15% |
| Agent Development | 15% |
| Evaluation and Tuning | 13% |
| **Deployment and Scaling** | **13%** |
| Cognition, Planning, and Memory | 10% |
| Knowledge Integration and Data Handling | 10% |
| NVIDIA Platform Implementation | 7% |
| **Run, Monitor, and Maintain** | **5%** |
| Safety, Ethics, and Compliance | 5% |
| Human-AI Interaction and Oversight | 5% |
| **Total** | **98%** |

**Two weights differ between the web page and the PDF.** The PDF study guide prints **Deployment and Scaling at 5%** and **Run, Monitor, and Maintain at 7%**, with the rest identical; the web page totals 98% and the PDF 92%, so neither reaches 100%. When budgeting time, treat Deployment and Scaling as a 5–13% range and plan around 10%; the other eight areas agree across both versions and can be scheduled by their numbers.

**Agent Architecture and Design (15%)** — officially, "foundational structuring and design of agentic AI systems, focusing on how agents interact, reason, and communicate within their environments." Bullets include **reasoning and action frameworks such as ReAct**, **agent-to-agent communication protocols**, short- and long-term memory management, multi-agent workflow orchestration, **logic trees and prompt chains for multi-step reasoning**, and **integrating knowledge graphs for relational reasoning**.

**Agent Development (15%)** — "practical building, integration, and enhancement of agents." Bullets include prompt and dynamic prompt chains, **integrating generative and multimodal models (text, vision, audio)**, building custom tools and APIs, **error handling with retry logic and graceful failure recovery**, and dynamic conversation flows with real-time streaming and feedback.

**Evaluation and Tuning (13%)** — "measuring, comparing, and optimizing agent performance." Bullets include evaluation pipelines and task benchmarks, cross-task and cross-dataset comparison, **collecting and integrating structured user feedback**, and **tuning for accuracy-versus-latency tradeoffs**.

**Deployment and Scaling (13% on the web page, 5% in the PDF)** — "operationalizing and scaling agentic systems." Bullets include production-scale multi-agent deployment and orchestration, **MLOps for CI/CD, monitoring, and governance**, performance profiling under distributed load, **containerized scaling with Docker and Kubernetes plus load balancing**, and cost optimization with high availability.

**Cognition, Planning, and Memory (10%)** — "core cognitive processes underlying intelligent agent behavior." Bullets include memory mechanisms for short- and long-term context, **reasoning frameworks (chain-of-thought, task decomposition)**, planning for sequential and multi-step decisions, **stateful orchestration**, and adapting reasoning from prior experience.

**Knowledge Integration and Data Handling (10%)** — bullets include **retrieval pipelines (RAG, embedded search, hybrid)**, **configuring and optimizing vector databases**, enterprise ETL, data quality checks and augmentation, and real-time reasoning over structured and unstructured knowledge.

**NVIDIA Platform Implementation (7%)** — the only NVIDIA-specific area: **integrating NeMo Guardrails** for compliance and safety, **deploying NIM microservices** for high-performance inference, **optimizing workflows with the NeMo Agent Toolkit**, **using TensorRT-LLM and Triton Inference Server to cut latency**, and managing multimodal input pipelines on NVIDIA hardware.

**Run, Monitor, and Maintain (5% on the web page, 7% in the PDF)** — monitoring dashboards and reliability metrics, log and anomaly tracking, **continuous benchmarking against prior versions**, automated tuning, retraining, and versioning.

**Safety, Ethics, and Compliance (5%)** — system security and audit trails, compliance guardrails, bias and toxicity mitigation, **layered safety frameworks (filters, escalation protocols)**, and licensing and regulatory compliance.

**Human-AI Interaction and Oversight (5%)** — user-in-the-loop interfaces, structured feedback loops, **transparency mechanisms (explainable reasoning, decision traceability)**, and human oversight and intervention.

## How It Differs From Microsoft's AI-500

Both are professional-level agentic AI exams, so they belong side by side:

| | NCP-AAI | Microsoft AI-500 |
|---|---|---|
| Fee | $200 | $165 (plus the required $165 AI-103 first) |
| Status | **Registration not open** | Open; the page no longer carries a beta label |
| Heaviest areas | Architecture 15% + Development 15% | Development 30–35% |
| Platform lock-in | **Only 7%** is explicitly NVIDIA product content | The whole exam revolves around Microsoft Foundry |
| Prerequisites | 1–2 years AI/ML with production agentic work | **Must hold the AI-103 certification** |
| Official training | Five DLI courses, **all paid** | Learning paths not live |

**NCP-AAI's platform lock-in is surprisingly low** — one area out of ten (7%) explicitly tests NVIDIA products; the other nine are general agentic engineering. That makes it closer to vendor-neutral than most vendor certifications, and it means **preparing for it transfers better to your actual work**.

## The Five Recommended Courses

NVIDIA lists recommended training on the page with a price on each; none is free:

| Course | Format | Price | Hours |
|---|---|---|---|
| [Building RAG Agents With LLMs](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-FX-15+V1) | Self-paced | $90 | 8 |
| [Evaluating RAG and Semantic Search Systems](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-FX-32+V1) | Self-paced | **$30** | 3 |
| [Building Agentic AI Applications With LLMs](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-FX-41+V1) | Self-paced | $90 | 8 |
| [Adding New Knowledge to LLMs](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+C-FX-26+V1) | Instructor-led | **$500** | 8 |
| [Introduction to Deploying RAG Pipelines for Production at Scale](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-FX-19+V1) | Self-paced | $90 | 8 |

The four self-paced courses total **$300**; adding the instructor-led one takes it to $800.

**Selection advice**: **Building Agentic AI Applications With LLMs ($90)** maps most directly onto the 15% of Agent Development, and **Evaluating RAG and Semantic Search Systems ($30)** covers Evaluation and Tuning's 13% at the lowest price. Those two, at $120, are the best-value combination. The **$500 instructor-led Adding New Knowledge to LLMs** maps to relatively little of the blueprint — skip it unless your employer is paying.

## What to Do Now

Since you cannot register, the right move is not a study plan but a **gap audit against the objectives**:

1. **Use the ten areas as a checklist** and ask, for each, "have I done this in production?" — that is precisely what the stated prerequisites demand
2. **Close the platform 7%**: NeMo Guardrails, NIM microservices, the NeMo Agent Toolkit, TensorRT-LLM, and Triton are the only things general agent experience will not transfer to
3. **Wait to buy courses until registration opens**: DLI courses have no expiry pressure, but the blueprint may shift when the exam opens, and buying early risks learning material that gets cut

On this site, [the harness layer of agent security](/posts/ai/2026-08-10-agent-security-harness-layer-en) and [RAG evaluation frameworks](/posts/ai/2026-03-12-rag-evaluation-frameworks-en) map directly onto the Safety 5% and Evaluation 13%.

## What May Change (Re-check Before You Register)

| Item | Status as of 2026-08-18 | When to re-check |
|---|---|---|
| Registration | **Coming soon, not open** | Monthly |
| Two weights that differ | Web totals 98%, PDF totals 92% | When registration opens |
| Fee and item count | $200, 60–70 items, 120 minutes | When registration opens |
| DLI courses and prices | Five, $30–$500 | Quarterly |
| Language | English only | Every six months |

## References

- [NCP-AAI certification page (specs, blueprint, recommended training)](https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/)
- [NVIDIA certification overview and FAQ (scoring, retakes, recertification)](https://www.nvidia.com/en-us/learn/certification/)

**Related on this site**

- [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)
- [NVIDIA NCA-GENL preparation path](/posts/ai/2026-08-18-nvidia-nca-genl-prep-guide-en)
- [Microsoft AI-500 preparation path (the other agentic professional exam)](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide-en)
