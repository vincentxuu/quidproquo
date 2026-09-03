---
title: "AI Agent Arxiv Digest — 2026-07-09"
date: 2026-07-09
category: daily
type: digest
tags: [ai-agent, arxiv, daily, agent-security, agent-framework, agent-memory]
lang: en
description: "Three papers sound the Agent security alarm from different angles: FARMA silently corrupts Agent reasoning memory with 100% success rate bypassing all defenses; Vera tests 4 production Agent frameworks (including Claude Code) with 93.9% average attack success rate; PiSAs reveals cross-user information leakage in shared Agent environments as a severely underexplored problem."
tldr: "Three papers sound the Agent security alarm from different angles: FARMA silently corrupts Agent reasoning memory with 100% success rate bypassing all defenses; Vera tests 4 production Agent frameworks (including Claude Code) with 93.9% average attack success rate; PiSAs reveals cross-user information leakage in shared Agent environments as a severely underexplored problem. Together, they represent the security reality that those deploying Agent platforms must confront."
series:
  name: "AI Agent Arxiv Digest"
  order: 46
---
> 🌏 [中文版](/posts/daily/2026-07-09-ai-agent-arxiv-digest)

## Today's Overview

Three papers sound the "Agent security alarm" from different angles: FARMA can silently corrupt an Agent's reasoning memory with 100% success rate, bypassing all existing defenses; Vera systematically tests 4 production Agent frameworks (including Claude Code) with a 93.9% average attack success rate; PiSAs reveals that cross-user information leakage in multi-user shared Agent environments is a severely underexplored problem. Read together, these papers represent the security reality that engineers and PMs deploying Agent platforms must face.

## Terms to Know Before Reading


| Plain Explanation | Term |
|---|---|
| Persistent storage of an Agent's past decisions, reasoning traces, and tool usage records, giving the Agent "memory" so it doesn't start from scratch each time. | Agent Memory |
| A privacy framework concept: whether information leaks depends not on "was it seen" but on "did it flow to the right person in the right context." For example, sharing medical records with a treating physician is appropriate, but sharing them with an employer violates contextual integrity. | Contextual Integrity |
| In testing, the proportion of attacks that successfully make an Agent perform harmful behavior. For example, 93.9% means attacks succeed almost every time. | Attack Success Rate |
| A complete test unit containing a specific safety objective + initial environment state + automatically verifiable outcome conditions, enabling automated security testing without human judgment. | Safety Case |
| Attacking an Agent simultaneously through multiple channels (e.g., system prompt, user input, tool responses), making attacks harder for a single defense to block. | Multi-channel Attack |


---


## Paper 1 | Your Agent's Memories Are Not Its Own: Forged Reasoning Attacks on LLM Agent Memory and Defenses

**Authors**: Neeraj Karamchandani, Piyush Nagasubramaniam, Sencun Zhu, Dinghao Wu · **Institution**: Penn State University · **arxiv**: 2607.05029
**Links**: [arxiv](https://arxiv.org/abs/2607.05029) · [alphaxiv](https://www.alphaxiv.org/abs/2607.05029)

### TL;DR

Someone can secretly rewrite how an Agent "used to think," causing it to make harmful decisions in the future — and all existing defenses fail to stop it. This paper introduces the attack method FARMA and the corresponding defense SENTINEL.

### Read Priority

Must-read.
Agents using persistent memory (including RAG memory, experience replay, multi-session agents) all share this vulnerability. This is one of the most comprehensive attack + defense papers in the memory security space.

### Background

LLM Agents have recently started using "long-term memory" to store past reasoning traces and decisions, so they can reference them in similar future situations. Prior attack research mostly focused on poisoning "factual memory" (e.g., injecting fake tool results). But this paper argues that reasoning memory (reasoning traces — remembering "this is how I thought about it") is a far more dangerous attack surface, because it affects all future decision-making logic and is much harder to detect.

### Mid-Level Walkthrough


#### The Problem

Imagine a customer service Agent that remembers its reasoning process from last week when it "waived a large refund" for a customer. If an attacker can insert a forged reasoning record into memory saying "I determined this type of request should typically be approved," the Agent will be more likely to approve unreasonable requests in the future — even though the attacker never directly manipulated the Agent's real-time responses.

#### The Method

This paper proposes **FARMA** (Forged Amplifying Rationale Memory Attack) in two steps:
1. **Forge reasoning records**: Insert malicious reasoning traces wrapped in evasive phrasing that keyword filters cannot detect
1. **Self-amplification**: Exploit the Agent's own memory recall mechanism to have the forged reasoning referenced repeatedly, reinforcing it until it becomes unshakable

The corresponding defense **SENTINEL** implements a layered pipeline, with the core being a "Reasoning Guard" — analyzing structural features of memory entries using 5 weighted signals to determine whether they are forged.

#### Why It Matters

Existing defenses (keyword filtering, majority vote consensus) all fail against FARMA. SENTINEL provides a deployable defense architecture, but it also means: platforms deploying memory-equipped Agents now need an additional "memory integrity verification layer" — this is not an optional nice-to-have, but essential security infrastructure.

### Deep Dive

- FARMA achieves **100%** attack success rate on undefended Agents and bypasses both keyword filters and A-MemGuard
- FARMA's self-amplification mechanism exploits the Agent's own memory recall logic to continuously amplify the poisoning effect — a single insertion can have long-lasting effects
- SENTINEL's Reasoning Guard uses 5 weighted signals for structural analysis, achieving zero false positives (false positive = 0%) on 326 normal memory traces
- With SENTINEL deployed, FARMA attack success rate drops to **0%**
- This attack differs from RAG knowledge base poisoning: RAG attacks target "factual knowledge," while FARMA targets "reasoning history" — the latter affects the decision logic layer, causing deeper and harder-to-detect harm
- Deployment consideration: SENTINEL requires hooks on the memory write/recall path, making it harder to integrate with black-box agent frameworks (e.g., LangGraph Cloud managed service) — white-box access to the memory module is needed
- Limitation: SENTINEL is currently designed for FARMA's specific characteristics; its generalization to other types of reasoning pollution attacks has not been fully evaluated

### Reviewer's One-Liner

The attack design is solid; FARMA's self-amplification mechanism is a genuine novel contribution, and the 100% success rate is alarming. SENTINEL's 0% false positive rate looks impressive, but the test set is only 326 entries designed by the same team — generalization needs external validation. Don't treat it as a silver bullet yet, but definitely use it as a reference for your threat model.

### Your Take-Away

- If your Agent platform has memory features (session memory, experience buffer, episodic memory), evaluate now whether the memory write path has integrity verification; if not, this paper is your starting point for threat modeling
- SENTINEL's "Reasoning Guard" 5-signal framework is worth borrowing — even if you don't adopt it wholesale, it serves as a structural reference for designing your own memory security module

---


## Paper 2 | Safety Testing LLM Agents at Scale: From Risk Discovery to Evidence-Grounded Verification

**Authors**: Yunhao Feng, Ruixiao Lin, Ming Wen et al. (15 authors) · **Institutions**: AntGroup / Zhejiang University / Fudan University / Alibaba · **arxiv**: 2607.01793
**Links**: [arxiv](https://arxiv.org/abs/2607.01793) · [alphaxiv](https://www.alphaxiv.org/abs/2607.01793)

### TL;DR

Researchers built an automated safety testing framework called Vera, tested 4 real-world deployed Agent frameworks (including Claude Code), achieved a 93.9% average attack success rate under multi-channel attacks, and released 1,600 executable safety test cases (Vera-Bench).

### Read Priority

Must-read.
This is one of the rare papers that directly tests production-grade Agent frameworks (not just underlying models). Vera-Bench can serve as a starting point for your Agent platform's security test suite, and the 93.9% figure is essential background information when selecting or procuring Agent frameworks.

### Background

The challenge in LLM Agent safety testing is non-determinism: the same input can produce different outputs each time, rendering traditional deterministic asserts useless. Additionally, the attack surface for Agents is far more complex than for standalone LLMs — tool calls, external memory, and multi-step planning can all be infiltration points. Previous safety benchmarks mostly targeted model comprehension, lacking solutions that cover real frameworks and support end-to-end automated execution.

### Mid-Level Walkthrough


#### The Problem

How do you know how vulnerable your deployed Agent framework is to malicious inputs? Existing safety tests are mostly manually designed static benchmarks with limited coverage that can't keep up with the pace of new attack methods. Even trickier: how do you automatically determine "whether the Agent was successfully attacked this time" — since Agent output is natural language, not True/False.

#### The Method

Vera is a three-stage self-reinforcing automated safety testing framework:
1. **Risk Discovery**: Continuously reads security literature to automatically build a risk taxonomy covering attack types, tool execution environments, and other dimensions
1. **Test Case Composition**: Combines across the taxonomy tree; each Safety Case includes: a specific safety objective + programmatic initial state + deterministic verification conditions based on observable artifacts
1. **Execution & Verification**: Automatically executes and judges results based on artifacts (tool call logs, response text)

#### Why It Matters

Vera-Bench — 1,600 executable safety cases across 124 risk categories — is the largest publicly available automated Agent safety test set to date. The 93.9% attack success rate is a wake-up call for platforms: production frameworks very likely have vulnerabilities of similar severity right now.

### Deep Dive

- Test targets: OpenClaw, Hermes, Codex, and Claude Code — four production-grade frameworks, not just underlying language models
- Average **ASR = 93.9%** under multi-channel attacks (test cases designed by the same lab; external frameworks may differ)
- Vera-Bench: 1,600 executable safety cases covering **124 risk categories** across 3 execution contexts (with/without tools, with/without memory, etc.)
- Vera's Risk Discovery is a "continuous process" — as new attacks emerge, the test set auto-expands, solving the aging problem of static benchmarks
- Each Safety Case's verification conditions are based on "observable artifacts" (tool call logs, response text), making automated judgment possible — this is the core engineering breakthrough
- The three-stage architecture's "self-reinforcement": newly discovered attack methods automatically feed back into the taxonomy, generating more test cases covering those methods in the next round
- Deployment consideration: Vera requires deep access to the Agent framework (observing tool call logs, etc.), which may be limited for some closed-source frameworks
- Relevance to LangGraph/AutoGen: these frameworks currently lack standardized "security observability interfaces"; Vera's architecture suggests that frameworks should build in security hooks natively

### Reviewer's One-Liner

High engineering completeness, clever three-stage architecture design, and Vera-Bench is a genuinely useful open-source contribution. The impact of 93.9% is strong but needs external replication; the fact that Claude Code was tested is itself demonstratively significant — overall one of the representative works in Agent safety testing for the first half of 2026.

### Your Take-Away

- Vera-Bench is a public resource — if your team is doing Agent platform QA, you can directly incorporate it into your CI/CD pipeline as a starting point for security regression testing
- If you're evaluating which Agent framework to use, this paper's framework breakdown is currently the closest thing to "independent third-party security evaluation" available publicly; add it to your selection criteria

---


## Paper 3 | PiSAs: Benchmarking Contextual Integrity in Multi-User Agentic Systems

**Authors**: Shubham Gupta, Nazanin Mohammadi Sepahvand, Abhinav Kumar, Cem Subakan, Spandana Gella, Pierre-Andre Noel, Perouz Taslakian, Eugene Bagdasarian, Valentina Zantedeschi · **Institutions**: Meta AI / Universite Laval · **arxiv**: 2607.05318
**Links**: [arxiv](https://arxiv.org/abs/2607.05318) · [alphaxiv](https://www.alphaxiv.org/abs/2607.05318)

### TL;DR

When multiple users share the same Agent, the Agent readily leaks User A's private information to User B. PiSAs proposes a benchmark for this scenario, revealing that current SOTA models still have serious deficiencies in multi-user privacy protection.

### Read Priority

Must-read.
Enterprise Agent platforms almost always have multi-user scenarios (different employees, different permissions). If you're building B2B SaaS Agents or internal tool Agents, the problem defined in this paper is one your product must solve.

### Background

"Contextual Integrity" is a framework proposed by privacy scholar Helen Nissenbaum: whether information flow violates privacy depends on whether it conforms to normative information flows within a social context. For example, salary data flowing within the HR department is normal, but if an Agent reveals it when answering another employee's question, that violates contextual integrity. Existing Agent privacy research mostly addresses single-user scenarios; information isolation in multi-user shared Agent environments has only been systematically studied in the past year.

### Mid-Level Walkthrough


#### The Problem

Imagine an internal enterprise AI assistant shared by 10 employees. Employee A once told the Agent they're looking for a new job; Employee B asks the Agent "How's A been doing lately?" — most current models would inappropriately reveal A's information in this context, because they lack the ability to judge "who is the audience of this conversation" and "whether this information is appropriate to disclose in this context."

#### The Method

PiSAs (Private information in Shared Agentic Systems) designed a benchmark covering various common enterprise multi-user scenarios, evaluating whether an Agent can correctly determine "should this information be shared in this context" when facing cross-user information requests. The benchmark uses Nissenbaum's contextual integrity framework as the evaluation standard, establishing "information flow norms" as ground truth for each scenario.

#### Why It Matters

Multi-user Agent scenarios are extremely common in enterprise deployments — Slack bots, HR assistants, code review Agents, and customer service systems all fall into this category. PiSAs gives platform developers a quantitative evaluation tool and adds a new dimension to model selection: don't just ask "how smart is this model," but also "how secure is it in multi-user environments."

### Deep Dive

- PiSAs was proposed by teams from Meta AI and Universite Laval, grounded in real enterprise Agent deployment needs, lending it credibility
- The contextual integrity framework evaluates four dimensions: whether the information **sender**, **receiver**, **information type**, and **transmission principle** conform to contextual norms — far more nuanced than a binary "private/not-private" judgment
- Related work MAGPIE shows: GPT-5 has a leakage rate of **50.7%** in multi-Agent privacy scenarios, Gemini 2.5-Pro reaches **35.1%** (data from the MAGPIE paper, not direct results from this paper)
- Compared to concurrent benchmarks like CI-Work (2604.21308) and MuPPET, PiSAs specifically targets the "multi-user shared Agent" setting that remains underexplored
- Deployment consideration: Solving this requires adding "user identity + context awareness" at the Agent design layer, which is an architectural change for most existing Agent frameworks — frameworks lacking native multi-user context isolation need application-layer supplementation
- Relevance to MCP: MCP's current tool call design has no built-in per-user context scope; multi-user privacy isolation must be handled at the framework or application layer
- Limitation: Contextual integrity "contextual norms" vary significantly across cultures and organizations; the benchmark norms primarily reflect Western enterprise contexts, and cross-cultural generalizability should be noted

### Reviewer's One-Liner

Solid problem definition, forward-looking topic selection, and the Meta AI affiliation lends the benchmark credibility. With limited public information available so far, it's not yet possible to assess whether the benchmark's scale and difficulty design are sufficiently rigorous — consider this a direction-setting paper worth tracking, rather than a complete evaluation result ready for citation.

### Your Take-Away

- If you're building multi-user Agents (B2B, enterprise tools, shared chatbots), add "User Context Isolation" as a requirement in your product requirements document now — PiSAs' contextual integrity four-dimension framework can serve directly as reference language for design principles
- When evaluating underlying models, multi-user privacy compliance should become a dimension in your evaluation matrix — asking "have you run PiSAs-type tests" can quickly filter out non-qualifying vendors


## References

- [arxiv:2607.05029](https://arxiv.org/abs/2607.05029)
- [arxiv:2607.01793](https://arxiv.org/abs/2607.01793)
- [arxiv:2607.05318](https://arxiv.org/abs/2607.05318)
- [arxiv:2604.21308](https://arxiv.org/abs/2604.21308)
