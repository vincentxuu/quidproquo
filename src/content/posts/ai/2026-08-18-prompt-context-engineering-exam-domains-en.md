---
title: "How Ten Certifications Actually Test Prompting: Exam Framing vs. Practice"
date: 2026-08-18
type: deep-dive
category: ai
tags: [certification, prompt-engineering, context-engineering, career]
lang: en
series:
  name: "AI Certification Prep"
  order: 19
tldr: "Most people assume GenAI certifications are built around prompt writing. CCAO-F gives Prompting 14% while Output Evaluation gets 21%; CCDV-F gives Prompt and Context Engineering 11.0%. What actually gets tested is structured output, injection-resistant prompting, dynamic context injection, context compression and caching, prompt lifecycle governance, and proving a prompt change helped — closer to context engineering and software engineering than to writing craft. None of the ten asks you to write a prompt on the spot; they are all multiple choice, so explaining why beats having a feel for it. The single most useful line comes from CCAR-F: when business logic must be guaranteed, 'change the prompt first' is usually the wrong answer."
description: "A cross-certification breakdown of how prompting and context engineering are tested: AWS AIF-C01 / AIP-C01, Microsoft AI-500 / AB-100 / AB-620, NVIDIA NCA-GENL / NCP-GENL, and Claude CCAO-F / CCAR-F / CCDV-F, with six shared themes, a four-vendor terminology map, where exam framing diverges from practice, and what doesn't transfer."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-prompt-context-engineering-exam-domains)
>
> This is preparation material built from official sources, not an exam-day account — I have not sat these exams. Every "what it tests" points back to a vendor's official exam or study guide, all listed at the end. Verified 2026-08-18.

This is the technical deep-dive track of the [AI Certification Prep series](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide-en), following [the multi-agent architecture crossover](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains-en).

Start with the counter-intuitive part: **prompting is a smaller slice of these exams than almost anyone expects.**

[CCAO-F](/posts/ai/2026-08-18-claude-certified-associate-prep-guide-en) is the one Claude certification that requires no coding, so intuition says it should be the "prompt exam." Instead, **Prompting and Task Execution is 14%, while Output Evaluation and Validation is 21%**. [CCDV-F](/posts/ai/2026-08-18-claude-certified-developer-prep-guide-en) gives **Prompt and Context Engineering 11.0%** — a third of what Applications and Integration gets at 33.1%.

What matters more is **what sits inside that 11–20%**. Read the official objectives and there is almost nothing about writing better sentences: it is token budgets, compaction, context isolation, JSON schemas, version control, and injection defense. **That is context engineering and software engineering, not writing.**

## Ten certifications, and where prompting sits

| Certification | Relevant domain / objective | Weight |
|---|---|---|
| [Claude CCAR-F](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide-en) | Domain 4 Prompt Engineering & Structured Output | **20%** |
| (same) | Domain 5 Context Management & Reliability | 15% |
| [Claude CCAO-F](/posts/ai/2026-08-18-claude-certified-associate-prep-guide-en) | Prompting and Task Execution | **14%** |
| (same) | Output Evaluation and Validation (includes "iterate on prompts to improve quality") | 21% |
| [Claude CCDV-F](/posts/ai/2026-08-18-claude-certified-developer-prep-guide-en) | Prompt and Context Engineering | **11.0%** |
| [Microsoft AI-500](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide-en) (beta) | "Advanced prompt engineering" and "memory, context management, knowledge integration" inside Develop | that block is **30–35%** |
| (same) | Context-window failure diagnosis and prompt evaluation inside Evaluate | that block is 20–25% |
| [NVIDIA NCP-GENL](/posts/ai/2026-08-18-nvidia-ncp-genl-prep-guide-en) | Prompt Engineering (the only domain anywhere named that) | **13%** |
| [NVIDIA NCA-GENL](/posts/ai/2026-08-18-nvidia-nca-genl-prep-guide-en) | No dedicated domain; "write prompts using prompt engineering principles" sits at item level under Core ML | that block is 30% |
| [AWS AIF-C01](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en) | 2.1.5 context engineering (added in v1.1) | Chapter 2, 24% |
| (same) | 3.x prompt techniques and risks, 3.2.5 Bedrock Prompt Management | Chapter 3, **28%** |
| [AWS AIP-C01](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en) | 1.6 Prompt engineering and governance | Chapter 1, **31%** |
| (same) | 4.1 prompt compression and context pruning; 5.2 context-window overflow and prompt version comparison | 12% / 11% |
| [Microsoft AB-100](/posts/ai/2026-08-18-microsoft-ab-100-prep-guide-en) | "Provide guidelines for building a prompt library" inside Plan | that block is 25–30% |
| (same) | "Prompt and response agents", "agent flows and prompt actions" inside Design | that block is 25–30% |
| [Microsoft AB-620](/posts/ai/2026-08-18-microsoft-ab-620-prep-guide-en) | Configuring advanced responses with a **custom prompt** inside topics | that block is 30–35% |
| (same) | Making a custom prompt use the Foundry model catalog | that block is 40–45% |

**Two things to notice.**

First, **only NCP-GENL has a standalone domain called "Prompt Engineering"** (13%). The other nine scatter prompting across other domains — so failing to find "prompt" in a table of contents does not mean it isn't tested.

Second, **CCAO-F's 14% badly understates the real share**. Prompt-related ability is split across four places: Prompting (14%) has only two objectives — write effective prompts for business and technical tasks, and apply task-decomposition techniques to structure complex requests. But Output Evaluation (21%) contains "iterate on prompts to improve quality" and "adapt strategy by task type," Configuration and Knowledge Management (12%) contains "write effective system-level instructions," and Product and Model Selection (12%) contains "understand and manage context limits and memory considerations (when to restart, summarize, or persist)." **Together that is well past 14% — and none of it is about sentence craft.**

**Maps back to**: CCAR-F Domain 4 (20%) + Domain 5 (15%), CCAO-F Prompting (14%), CCDV-F Prompt and Context Engineering (11.0%), NCP-GENL Prompt Engineering (13%), AI-500 Develop (30–35%), AIF-C01 Chapters 2–3 (24% + 28%), AIP-C01 Chapter 1 (31%).

## The shared core: six things every guide asks about

### 1. Structured output, not "please reply in JSON"

**CCAR-F puts Structured Output in the domain title**, and gives the most concrete answer: use `tool_use` with a JSON schema rather than asking Claude to emit a JSON string. The three `tool_choice` options each have a use — `"auto"` lets the model decide (plain text is possible), `"any"` guarantees some tool is called, and `{"type": "tool", "name": ...}` forces a specific one.

**The line most people skip**: `tool_use` eliminates JSON *syntax* errors but **not semantic** ones (line items that don't sum to the total). Semantic validation is separate, paired with a validation-retry loop.

Equivalents elsewhere:

- **AIP-C01** files "JSON Schema structured output" under 3.1 as one element of a **hallucination-reduction combination** — the official objective wants Knowledge Base grounding plus fact-checking plus confidence scores plus structured output together, not one technique
- **NCP-GENL** uses entirely different words: **design modules wrapping the LLM with built-in validation and constrained decoding** for consistency and fewer hallucinations. "Constrained decoding" appears only on this exam
- **AI-500** has no "structured output" phrasing at all; the nearest objective is **tool result validation and quality checks** in the tool ecosystem block

**Maps back to**: CCAR-F Domain 4 (20%), AIP-C01 Chapter 3 (20%), NCP-GENL Prompt Engineering (13%), AI-500 Develop (30–35%).

### 2. Defensive prompting: injection, jailbreak, input sanitization

All four vendors test it, each with its own vocabulary, all pointing at the same trust-boundary problem.

- **AWS AIF-C01** names the prompt risks individually: **exposure, poisoning, hijacking, jailbreaking** — that four-word set appears in no other guide
- **AIP-C01** goes further: 3.1 requires **prompt injection and jailbreak detection, input sanitization, safety classifiers, automated adversarial testing**, plus four layers of defense in depth (Comprehend pre-filtering, model-side guardrail, Lambda post-processing, API Gateway response filtering)
- **AI-500** says only **defensive guidelines** inside advanced prompt engineering — one phrase, though the same block also carries shift-left security and the AI Red Teaming Agent
- **AB-100** takes the architect's angle: **analyze vulnerabilities and mitigations for the solution and AI, including prompt manipulation**
- **CCDV-F** puts **prompt injection awareness and mitigation, jailbreak defense, untrusted input handling** in Security and Safety (8.1%), while **input sanitization sits inside the 11% Prompt and Context Engineering domain** as a prompt principle

**That CCDV-F split is worth remembering**: sanitization is classified as a *prompt principle*, not a security control — the guide treats "how you assemble a prompt" and "how you resist injection" as two sides of one thing. [Agent security: prompt injection and trust boundaries](/posts/ai/2026-06-04-agent-security-prompt-injection-trust-boundaries-en) covers the practical side.

**Maps back to**: AIF-C01 Chapters 3 (28%) and 5 (14%), AIP-C01 Chapter 3 (20%), AI-500 Develop (30–35%) and Secure (20–25%), AB-100 Deploy (40–45%), CCDV-F Security and Safety (8.1%).

### 3. Dynamic context injection and grounding

**AI-500 is the most direct**: advanced prompt engineering explicitly lists **dynamic context injection**, and the memory/context block in the same domain requires the four context actions — **accumulation, retrieval, injection, compression** — plus knowledge integration for multi-agent consumption (search, RAG, MCP-reachable sources, semantic search).

Elsewhere:

- **AIP-C01** 1.6 gives concrete mechanics for interactive context: Step Functions clarification flows, Comprehend intent detection, DynamoDB conversation history
- **CCAR-F** supplies the cautionary version — **a subagent does not inherit the coordinator's conversation history; required context must be passed explicitly in the prompt** — plus Domain 5's **structured facts block**: in a support scenario, dates, amounts, order numbers, and status must not be summarized away, and should ride along uncompressed on every prompt
- **AIF-C01** is the only guide that makes **context engineering its own objective** (2.1.5), added in the v1.1 revision effective 2026-04-30 — **any study material whose contents lack that term is pre-v1.1**

[The context engineering guide](/posts/ai/2026-03-24-context-engineering-guide-en) and [Stanford CS146S on context engineering](/posts/ai/2026-08-16-cs146s-context-engineering-en) are the closest background reading on site.

**Maps back to**: AI-500 Develop (30–35%), AIP-C01 Chapter 1 (31%), CCAR-F Domain 5 (15%), AIF-C01 Chapter 2 (24%).

### 4. Compression, pruning, and caching — which is really a cost domain

**This is the section worth internalizing**: most people treat context management as a quality problem, but the guides treat it as a **cost and reliability** problem.

- **CCDV-F**'s 11% opens with **token budgeting and cost management** (usage tracking, cost modeling, **prompt caching and cache check-pointing**), then **preventing context drift and bloat** (tool output trimming, **compaction**), then **context isolation via subagents or multi-step flows**. Two and a half of three objectives are about cost
- **AIP-C01** 4.1 is explicit: token estimation and tracking, **context-window optimization, response length control, prompt compression and context pruning**, plus **semantic caching, result fingerprinting, edge caching, deterministic request hashing, and prompt caching**
- **AI-500** lists three caching strategies in the orchestration block — **prompt caching, semantic caching, response caching** — and **token usage optimization (token caps, loop control, tool calls)** in observability
- **AIF-C01** lists **prompt caching** among FM selection criteria and adds **token pricing and the cost-performance relationship** in v1.1
- **CCAR-F** is operational: `/compact`, saving key findings to a scratchpad file, using subagents for exploration and returning only summaries

**Three vendors, three words for one thing**: Anthropic says compaction, AWS says prompt compression and context pruning, Microsoft says compression. Learn any one and you can skip the other two.

**Maps back to**: CCDV-F Prompt and Context Engineering (11.0%), AIP-C01 Chapter 4 (12%), AI-500 Develop (30–35%) and Evaluate (20–25%), AIF-C01 Chapters 2–3.

### 5. Prompt lifecycle: versioning, libraries, review

**This is where the exam guides are ahead of most teams.** They treat a prompt as a versioned, reviewed, stored asset — not a string constant in the codebase.

- **AIP-C01** 1.6 has the fullest list: **parameterized templates, review processes, an S3 repository, CloudTrail, CloudWatch Logs**, plus **Bedrock Prompt Flows** for prompt chaining, conditional branching, and reusable components
- **AIF-C01** tests **prompt version management with Bedrock Prompt Management** (3.2.5)
- **AI-500** phrases it as **prompt lifecycle management**
- **AB-100** takes the governance angle: **provide guidelines for building a prompt library** (Plan)
- **CCDV-F** places **prompt version control** in configuration management, next to CLAUDE.md, settings.json, and model version pinning

**AB-620's angle is different** and worth flagging separately: its custom prompt is **a configurable object inside a product** — used to configure advanced responses inside a topic, and pointed at the Foundry model catalog. The low-code track tests *which UI configures it*, not how its versions are managed.

**Maps back to**: AIP-C01 Chapter 1 (31%), AIF-C01 Chapter 3 (28%), AI-500 Develop (30–35%), AB-100 Plan (25–30%), CCDV-F Applications and Integration (33.1%), AB-620 Plan and configure (30–35%) and Integrate (40–45%).

### 6. Proving a prompt change helped

All four vendors want you to answer "did this prompt change work," and none of them accepts "it looks better."

- **AI-500** has the cleanest phrasing: **evaluate memory, knowledge, tools, and prompts separately** — four dimensions, not one blended score
- **AIP-C01**: **prompt QA and regression testing** (1.6), **prompt testing frameworks and version comparison** (5.2), **A/B testing via Prompt Management and Prompt Flows** and **LLM-as-a-judge automated evaluation** (3.4), and CloudWatch tracking of **prompt effectiveness** and **hallucination rate**
- **CCAO-F** files "**iterate on prompts to improve quality**" under the highest-weighted domain, Output Evaluation (21%), rather than Prompting (14%) — **that classification is itself the hint**
- **CCDV-F** gives Eval, Testing, and Debugging just **2.6%**, the smallest of its eight domains

Read that last one carefully: **a low eval weight is not Anthropic saying eval doesn't matter** — the same guide's Intended Audience lists "design and run evals" among expected abilities. It just isn't where this exam puts its scoring weight.

[Prompt engineering iteration](/posts/ai/2026-03-13-prompt-engineering-iteration-guide-en) covers the workflow side.

**Maps back to**: AI-500 Evaluate (20–25%), AIP-C01 Chapter 1 (31%) / Chapter 3 (20%) / Chapter 5 (11%), CCAO-F Output Evaluation (21%), CCDV-F Eval, Testing, and Debugging (2.6%).

## One idea, four vocabularies

| Concept | AWS (AIF / AIP) | Microsoft (AI-500 / AB-100 / AB-620) | NVIDIA (NCP-GENL) | Anthropic (CCAR-F / CCDV-F / CCAO-F) |
|---|---|---|---|---|
| Structured output | JSON Schema structured output (part of the hallucination combination) | Tool result validation and quality checks | Constrained decoding, validation modules wrapping the LLM | `tool_use` + JSON schema, `tool_choice` |
| Few-shot and templates | Prompt techniques (CoT, zero/single/few-shot, templates) | "Examples" under advanced prompt engineering | zero/one/few-shot, prompt learning, CoT | Few-shot (named in the prompt principles) |
| Dynamic context | Interactive context (Step Functions / Comprehend / DynamoDB), Knowledge Base grounding | **Dynamic context injection**; accumulation / retrieval / injection / compression | Not named | Explicit context passing to subagents, structured facts block |
| Compression and pruning | Prompt compression and context pruning, context-window optimization | Compression (one of four context actions) | Not named | Compaction, tool output trimming, `/compact` |
| Caching | Prompt caching, semantic caching, result fingerprinting, edge caching | Prompt caching, semantic caching, response caching | Not named | Prompt caching and cache check-pointing |
| Versioning and governance | Bedrock Prompt Management, Prompt Flows, S3 repository and review process | **Prompt lifecycle management**, **prompt library guidelines**, prompt actions | Not named | Prompt version control (alongside CLAUDE.md, settings.json) |
| Defense | Exposure / poisoning / hijacking / jailbreaking, sanitization, safety classifiers | Defensive guidelines, prompt manipulation | Not named | Prompt injection mitigation, input sanitization (as a prompt principle) |
| Context failure diagnosis | Context-window overflow, dynamic chunking, truncation errors | **sliding-window amnesia / summary drift / vector-only recall / entity continuity** | Not named | Lost-in-the-middle, long-session context degradation |
| Validating a change | Prompt QA and regression testing, version comparison, A/B, LLM-as-a-judge | Evaluate memory / knowledge / tools / prompts separately | Not named (Evaluation is its own 7% domain) | "Iterate on prompts to improve quality" (inside CCAO-F's 21%) |

**All those "not named" cells in the NVIDIA column are not an oversight**: NCP-GENL's Prompt Engineering domain has only three published objectives — template design (with CoT and prompt learning), zero/one/few-shot, and the constrained-decoding wrapper module. The official PDF also skips numbering 2.3 in that block and publishes nothing for it. **This is an incomplete blueprint, and preparation should assume that.**

## How the exam asks vs. what actually works

This section is the point of the post. All six themes above hold up in practice — but **the way exams ask about them is not the way you work.**

**1. Exams give you a symptom and ask for the diagnosis; they never hand you a prompt to fix.** AI-500 names four context-window failure modes (sliding-window amnesia, summary drift, vector-only recall, entity continuity), and naming them is what makes them examinable: given "entity references don't carry across turns," answer entity continuity. **That format rewards vocabulary, not feel.**

**2. "Change the prompt first" is usually the wrong option.** This is CCAR-F's most important line and the most counter-intuitive one for engineers: **when a tool-call ordering is a business-logic requirement, the correct answer is to enforce it in code, not to add more instructions to the prompt.** The official example is verifying customer identity before a refund — writing "please call `get_customer` first" in the prompt will be skipped some fraction of the time; the fix is a hook on `lookup_order` and `process_refund` that checks whether `get_customer` already ran.

**This holds in practice too, and it is the single line here most worth carrying into work.** Prompts are probabilistic; business rules need determinism. Anything code can guarantee should not be delegated to a prompt.

**3. Vague instructions don't work; explicit criteria do.** CCAR-F states outright that "only report high-confidence issues" or "be conservative" won't lower the false-positive rate. It has to be enumerated: what to REPORT, what to SKIP, what counts as HIGH, what counts as MEDIUM. Exam and practice fully agree here.

**4. The root cause of wrong tool selection is a weak description, not a missing routing classifier.** This trap recurs in CCAR-F's sample questions — when the scenario is "the agent picked the wrong tool," look at the tool description before adding a classification layer. [Auto-optimizing tool descriptions](/posts/ai/2026-06-04-auto-prompt-optimization-tool-descriptions-en) is the implementation-side version of the same idea.

**5. The guides treat prompts as governed assets; most teams still treat them as string constants.** AIP-C01 wants an S3 repository, a review process, CloudTrail audit trails, and regression tests; AB-100 wants you to be able to define guidelines for a prompt library. **This is where the exams run ahead of practice** — if your team's prompts are scattered through code with no versioning, the exam will ask about work you have never done.

**6. None of these exams asks you to write a prompt.** All ten are multiple choice (CCAR-F mixes single- and multiple-answer items, labeling how many to pick each time). **So "writes good prompts" earns nothing; "can explain why it's written that way" earns everything.** Prepare accordingly: instead of collecting prompt templates, ask of each technique which failure mode it addresses and when it is the wrong tool.

**Maps back to**: AI-500 Evaluate (20–25%), CCAR-F Domain 1 (27%) and Domain 4 (20%), AIP-C01 Chapter 1 (31%), AB-100 Plan (25–30%).

## What doesn't transfer

**AI-500 only**: the four named context-window failure modes, the phrase "prompt lifecycle management," the prompt / semantic / response caching taxonomy, and the four-way split of "evaluate memory, knowledge, tools, and prompts separately."

**AWS only**: **Bedrock Prompt Management** and **Bedrock Prompt Flows** as products (version management, prompt chains, conditional branching, reusable components), the four prompt risks (exposure / poisoning / hijacking / jailbreaking), the "prompt compression and context pruning" objective, and making **context engineering an exam objective in its own right** (AIF-C01 2.1.5, added in v1.1).

**NVIDIA only**: **constrained decoding**, **prompt learning** for small or specialized datasets, and the very fact of Prompt Engineering being a standalone 13% domain.

**Anthropic only**: the three `tool_choice` options and their semantics, "`tool_use` removes syntax errors but not semantic errors," the validation-retry loop, the structured facts block (facts that must never be summarized), `/compact`, `context: fork`, and the provenance rule — **when two sources give conflicting numbers, keep both with attribution rather than choosing one**. These are mostly SDK- and product-level details that stop being true elsewhere.

**Microsoft's low-code line only**: **prompt actions**, the **prompt-and-response agent** category (alongside task agents and autonomous agents), and binding a custom prompt to the **Foundry model catalog**.

## A practice checklist

This maps onto the six themes above. **Finishing it covers the shared core and none of the vendor-specific section**:

1. Take an extraction task and force structured output with a **JSON schema**, then deliberately feed data whose totals don't add up — confirm you can get syntactically valid, semantically wrong output → (1)
2. Wrap that extractor in a **validation-retry loop** capped at three attempts, logging why each attempt failed → (1)
3. Run an injection test on your own agent: hide a malicious instruction inside a tool response and see whether it complies; then test input sanitization and output filtering separately → (2)
4. Split a long conversation into an **un-summarizable facts block** and a compressible history, and compare factual accuracy at turn 20 under both designs → (3)
5. Measure the same workload three ways — no cache, prompt caching, semantic caching — and write down the conditions under which each stops helping → (4)
6. Move every prompt out of code into a versioned repository with reviewed changes, and keep at least one recorded rollback to a previous version → (5)
7. Build a **10–20 item regression set** for one prompt, run it before and after a change, and produce evidence of improvement via LLM-as-a-judge plus a manual spot check → (6)
8. Finish with the inverse exercise: find one place where you currently **tell the model in a prompt to always do X first**, and enforce it in code instead → (item 2 of the previous section)

Shortest paths for the non-transferable parts: for AWS, the [AIF-C01](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html) and [AIP-C01 exam guides](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html); for Microsoft, the [AI-500 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500); for NVIDIA, only the [certification page and its PDF](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-professional/); for Claude, the [Agent SDK documentation](https://platform.claude.com/docs/en/agent-sdk/overview).

## If you read only one

**[The AIP-C01 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html).** It has the most complete treatment of the *governance* side: section 1.6 alone covers parameterized templates, review processes, repositories, audit logs, QA and regression testing, and prompt chaining — items that appear as one or two scattered words in every other guide. It is also a free public web page.

**Its bias is equally clear**: the whole thing orbits Bedrock product names. For the product-independent version, read CCAR-F's Domains 4 and 5 — structured output, lost-in-the-middle, facts blocks, and provenance all survive a platform change; only the API names have to be swapped.

## What will go stale (check here next time)

| Item | Status (verified 2026-08-18) | Recheck when |
|---|---|---|
| AIF-C01 guide version | v1.1, effective 2026-04-30, adding context engineering among seven new objectives | Quarterly |
| CCAO-F seven-domain weights | 21 / 16 / 15 / 14 / 12 / 12 / 10 | Quarterly |
| CCAR-F five-domain weights | 27 / 18 / 20 / 20 / 15 (Exam Guide v1.0, effective July 2026) | Quarterly |
| CCDV-F eight-domain weights | 33.1 / 16.8 / 14.7 / 11.0 / 10.6 / 8.1 / 3.1 / 2.6 | Quarterly |
| AI-500 status and weights | Still beta; 15-20 / 30-35 / 20-25 / 20-25 | Monthly |
| NCP-GENL blueprint completeness | The official PDF skips objective 2.3 under Prompt Engineering with no published content | When registration opens |
| AWS prompt product names | Bedrock Prompt Management, Bedrock Prompt Flows | Quarterly |
| AB-100 / AB-620 weights | 25-30 / 25-30 / 40-45; 30-35 / 40-45 / 20-25 | Quarterly |

## References

- [AWS AIF-C01 official exam guide (five chapters and per-objective detail)](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html)
- [AWS AIF-C01 exam guide revision history (v1.1 additions)](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html)
- [AWS AIP-C01 official exam guide (including 1.6 prompt engineering and governance)](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html)
- [Microsoft AI-500 official study guide (advanced prompt engineering and context management objectives)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500)
- [Microsoft AB-100 official study guide (prompt library guidelines)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100)
- [Microsoft AB-620 official study guide (custom prompts and the Foundry model catalog)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-620)
- [NVIDIA NCP-GENL official certification page (ten domains, Prompt Engineering at 13%)](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-professional/)
- [NVIDIA NCA-GENL official certification page (five weighted areas)](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/)
- [Claude Certified Associate – Foundations certification page (exam guide download)](https://anthropic-partners.skilljar.com/claude-certified-associate-foundations-certification)
- [Claude Certified Architect – Foundations certification page (exam guide download)](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification)
- [Claude Certified Developer – Foundations certification page (exam guide download)](https://anthropic-partners.skilljar.com/claude-certified-developer-foundations-certification)
- [Claude Agent SDK documentation](https://platform.claude.com/docs/en/agent-sdk/overview)

**Related on this site**

- [Multi-agent architecture across five exams](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains-en)
- [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)
- [Claude Certified Associate (CCAO-F) preparation path](/posts/ai/2026-08-18-claude-certified-associate-prep-guide-en)
- [Claude Certified Architect Foundations guide](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide-en)
- [Claude Certified Developer (CCDV-F) preparation path](/posts/ai/2026-08-18-claude-certified-developer-prep-guide-en)
- [Microsoft AI-500 preparation path](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide-en)
- [AWS AIF-C01 preparation path](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en)
- [AWS AIP-C01 preparation path](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en)
- [NVIDIA NCP-GENL preparation path](/posts/ai/2026-08-18-nvidia-ncp-genl-prep-guide-en)
- [The context engineering guide](/posts/ai/2026-03-24-context-engineering-guide-en)
- [Prompt engineering iteration](/posts/ai/2026-03-13-prompt-engineering-iteration-guide-en)
- [Stanford CS146S: context engineering](/posts/ai/2026-08-16-cs146s-context-engineering-en)
- [When prompting stops working](/posts/ai/2026-08-16-cs230-when-prompting-stops-working-en)
- [Agent security: prompt injection and trust boundaries](/posts/ai/2026-06-04-agent-security-prompt-injection-trust-boundaries-en)
- [Auto-optimizing tool descriptions](/posts/ai/2026-06-04-auto-prompt-optimization-tool-descriptions-en)
- [Agent context and memory failure](/posts/ai/2026-08-10-agent-context-memory-failure-en)
