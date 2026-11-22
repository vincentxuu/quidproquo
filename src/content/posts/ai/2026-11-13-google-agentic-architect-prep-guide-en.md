---
title: "Preparing for Google Professional Agentic Architect (PAA): What the Hybrid Exam Tests and How to Prepare"
date: 2026-11-13
type: guide
category: ai
tags: [certification, gcp, agentic-ai, agent-architecture, career]
lang: en
series:
  name: "AI Certification Prep"
  order: 31
tldr: "Google's Professional Agentic Architect is assessed as a hybrid two-part exam: a proctored multiple-choice exam with Pearson, then hands-on labs on Google Skills. Both parts are required. The GA spec is a 2-hour exam, 50-60 multiple-choice questions, $200, English, one-year validity; the beta (Sept 8-30, 2026) was 3 hours, about 80 questions, $120."
description: "A preparation guide for the Google Professional Agentic Architect (PAA): how to prepare for each half of the hybrid exam after GA, the five exam domains and their weights, how it relates to PMLE, plus schedule and pitfalls."
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-13-google-agentic-architect-prep-guide)
>
> This is a preparation path built from official material, not an exam-day account — I have not sat this exam. Every "what it tests" points back to the [official exam guide](https://services.google.com/fh/files/misc/professional_agentic_architect_exam_guide_english.pdf), and every "how to prepare" points to an official learning path or Google Cloud documentation. No leaked questions. Verified 2026-11-13.

Google's AI portfolio grew a new credential at the end of 2026: the [Professional Agentic Architect](https://cloud.google.com/learn/certification/agentic-architect) (PAA). It is Google's newest professional-level certification, and the first official exam that treats the agentic workflow itself as the test object — it asks whether you can design, deploy, and govern autonomous agent systems, not whether you can call a model.

The exam has run on a hybrid two-part structure since the beta in September 2026 and opened for general registration on November 2, 2026 (GA). Same flow as beta: pass the Pearson-proctored multiple-choice exam, then receive hands-on labs via CM Connect on Google Skills; both parts are required to earn the credential.

## Who This Is For

**A good fit**: engineers or architects whose work spans building, deploying, and governing agentic systems on Google Cloud. Google's recommended experience is **3+ years in industry building, testing, deploying, and managing cloud solutions, including 1+ year building agentic solutions on Google Cloud**.

**Not a fit**: engineers who only write prompts. Part 1 of the exam (low-code) already tests whether you can assemble a runnable workflow with a workflow builder; Part 3 (custom agents) moves into coding. If you only want to prove you can apply an LLM, read [PMLE](/posts/ai/2026-08-18-google-pmle-prep-guide) instead.

**How it relates to PMLE**: [PMLE](/posts/ai/2026-08-18-google-pmle-prep-guide) had its exam guide rewritten in 2026 with agentic content absorbed in; PAA then promoted agents into their own certification. PMLE's skeleton is still classical ML engineering and it does not test multi-agent coordination; PAA section 3.3 does.

## Official Specs at a Glance

| Item | Content |
|---|---|
| Fee | $200 (plus tax) |
| Duration | 2 hours |
| Questions and format | 50-60 multiple-choice questions |
| Language | English only |
| Delivery | Online or onsite proctoring |
| Prereqs | None |
| Recommended experience | 3+ years plus 1 year on Google Cloud building agents |
| Validity | **One year** |

The exam assesses agentic workflow design rather than the model itself. The five capability areas Google names: building agents with low-code tools, using coding agents for application development, developing custom agents, evaluating and deploying agentic workflows, and securing and governing agentic workflows.

The exam is hybrid, two parts:

- **Part 1**: proctored multiple-choice exam via Pearson, assessing conceptual knowledge, system design choices, architectural standards, cost optimization, and security governance.
- **Part 2**: hands-on labs on Google Skills, unlocked through CM Connect after passing Part 1; both parts must be passed.

## The Five Section Weights Are Your Study Plan

| Section | Weight | Topic |
|---|---|---|
| 1. Building agents using low-code tools | ~13% | Low-code agents |
| 2. Using coding agents for application development | ~17% | Coding agents |
| 3. Developing custom agents | ~33% | Custom agents |
| 4. Evaluating and deploying agentic workflows | ~22% | Evaluation and deployment |
| 5. Securing and governing agentic workflows | ~15% | Security and governance |

The five add up to about 100%. Heaviest: section 3 (custom agents, 33%), then section 4 (evaluation and deployment, 22%).

### Section 1: Low-code agents (~13%)

**What it tests**: assembling agentic workflows with Gemini Enterprise Workflow Builder and CX Agent Studio, including state-based workflows, system instructions, in-console prompt templates, and connecting enterprise data via Gemini Enterprise and Agent Search.

**Read**: official low-code tool docs and the official learning path.

**Practice**: build a runnable agent workflow with a workflow builder rather than only writing a system prompt.

### Section 2: Coding agents (~17%)

**What it tests**: configuring coding agents (Antigravity, Claude Code on Google Cloud) with MCP servers, custom skills, and tools; using secure sandboxes such as GKE, Cloud Workstations, and Antigravity; refactoring, optimizing runtime, and patching application-layer vulnerabilities. Customization covers skills, plugins, extensions, hooks, rules, subagents, plus augmenting Antigravity with Agents CLI.

**Read**: Agents CLI and Antigravity docs.

**Practice**: bring a coding agent into an enterprise codebase workflow.

### Section 3: Custom agents (~33%, heaviest)

**What it tests**: choosing between LLM and small language model, self-hosted vs SaaS, open-source vs proprietary; building with Agent Development Kit (ADK); sessions and memory; RAG with Vector Search and Agent Retrieval; agent permissions with Agent Identity and Agent Registry; orchestration with MCP, A2A, and multi-agent handoffs (parallel, sequential, graph).

**Read**: Agent Development Kit and Agent Platform docs.

**Practice**: run the full loop of custom agent, RAG, orchestration, handoff.

### Section 4: Evaluation and deployment (~22%)

**What it tests**: test sets, golden data, continuous evaluation pipelines, eval tooling (ADK evalset, Agent Platform Gen AI evaluation service, custom autoraters); deployment runtimes (Agent Runtime, Cloud Run, GKE), troubleshooting, monitoring and optimization.

**Practice**: evaluate an agent, then deploy and monitor it.

### Section 5: Security and governance (~15%)

**What it tests**: authentication, secure tool execution (OAuth 2.0), Principal Access Boundary (Agent Identity), Agent Gateway, Agent Registry, Model Armor; safety frameworks, guardrails, human-in-the-loop, secure data access.

## A Schedule, and Why It Looks Like This

At 8-10 hours per week, plan roughly 8-10 weeks:

| Week | Content |
|---|---|
| 1 | Read the official exam guide, map to the official learning path |
| 2 | Sections 1-2 (low-code agents, coding agents) |
| 3-4 | Section 3 (custom agents, heaviest) |
| 5-6 | Section 4 (evaluation and deployment) |
| 7 | Section 5 (security and governance) |
| 8 | Full review plus sample questions |

## Three Pitfalls

**First, old study material has stale product names.** Names like Workflow Builder, Agent Runtime, and Agent Search postdate much of the material in use during 2026; older guides still use Agent Designer, Agent Engine, and Vertex AI Search. Same trap as PMLE with Vertex AI.

**Second, passing Part 1 is not the credential.** Both parts are required. After GA results (7-10 business days), pass the labs within the 2-month window to receive the credential.

**Third, respect the recommended experience.** Without 1+ year of agentic building on Google Cloud, sections 3-5 will stall.

## After the Exam: One-Year Validity and Continuing Education

PAA is valid for **one year**, not two like other Google professional certifications; Google cites the fast pace of the field and points to a continuing-education path to maintain active status.

## What May Change (Re-check Before You Register)

| Item | Current state (verified 2026-11-13) | When to re-check |
|---|---|---|
| Certification status | GA (registration opened Nov 2, 2026) | Quarterly |
| Exam structure | Hybrid two parts: Pearson MCQ + Google Skills labs | Exam guide updates |
| Duration and question count | 2 hours, 50-60 multiple-choice questions | Each exam guide update |
| Fee | $200 | Quarterly |
| Validity | One year | Google said it may expand |
| Language | English | If Chinese opens up |
| Delivery | Online or onsite proctoring; results in 7-10 business days | Policy page updates |

## Changelog

- 2026-11-13: updated official specs from the GA page and FAQ (2 hours, 50-60 multiple-choice questions, $200, English, online or onsite proctoring, one-year validity); beta specs (Sept 8-30, 3 hours, ~80 questions, $120) moved to the comparison.

## References

- [Professional Agentic Architect certification page](https://cloud.google.com/learn/certification/agentic-architect)
- [Professional Agentic Architect exam guide](https://services.google.com/fh/files/misc/professional_agentic_architect_exam_guide_english.pdf)
- [Professional Agentic Architect Certification FAQs](https://support.google.com/cloud-certification/answer/18080541?hl=en)
- [Google Cloud Agentic Architect certification (blog)](https://cloud.google.com/blog/topics/training-certifications/google-cloud-agentic-architect-certification-dont-just-prompt-ai-design-it)
- [Machine Learning Engineer official learning path (Google Skills)](https://www.cloudskillsboost.google/paths/17)

**Site-internal related**

- [2026 AI certifications for engineers](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [Google Professional Machine Learning Engineer (PMLE) prep guide](/posts/ai/2026-08-18-google-pmle-prep-guide)
- [Multi-agent architecture exam domains](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains)
- [AI governance frameworks exam domains](/posts/ai/2026-08-18-ai-governance-frameworks-exam-domains)
