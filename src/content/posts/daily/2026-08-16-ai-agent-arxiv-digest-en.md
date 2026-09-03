---
title: "AI Agent Arxiv Digest — 2026-08-16"
date: 2026-08-16
category: daily
type: digest
tags: [ai-agent, arxiv, daily, agent-security, prompt-injection, agent-skills]
lang: en
description: "Three papers converge on the same issue — agent skills and extensions are becoming a new attack surface: red-team systems can breach defenses at minimal cost, seemingly benign skills cause task failures on their own, and theoretical analysis shows individually harmless mechanisms can compound into systemic risk"
tldr: "PIMiner uses a transferable strategy library to push prompt injection ASR to 76–87% at ~$20 query cost; Agent Skills Can Be Harmful finds that seemingly relevant skills are more likely to derail tasks than obviously unrelated ones, with excessive procedures accounting for 62.6% of efficiency degradation; Order 66 scenario analysis uses a compositional threat model to show that dormant implants, post-hoc memory poisoning, and peer-to-peer diffusion are individually non-fatal but can sustain self-propagation when combined"
series:
  name: "AI Agent Arxiv Digest"
  order: 84
---

> 🌏 [中文版](/posts/daily/2026-08-16-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers point at the same thing from three different angles: agent "skills" and "extensions" are becoming a new attack surface. PIMiner shows that attackers don't need expensive RL training — a transferable strategy library plus ~$20 in query costs achieves 60–80% prompt injection success rates across major models. Agent Skills Can Be Harmful adds the defender's perspective — even without a malicious attacker, a "seemingly relevant" skill can cause task failures or cost blowups, usually not because it's irrelevant but because it's "relevant in the wrong way." The Order 66 scenario analysis zooms out, using a compositional threat model to show that even when each mechanism (dormant instructions, post-hoc memory implants, peer-to-peer diffusion) is individually non-fatal, combining them with the execution and recovery privileges granted by agent harnesses can theoretically create systemic risk. The message from all three is clear: the trust boundary around skill/extension systems is now more urgent than model alignment itself.

## Terms to Know Before Reading

| Term | Plain-language explanation |
|---|---|
| Agent Skill | A reusable instruction package (like SKILL.md) that gives an agent domain-specific methods without changing model weights |
| Prompt Injection | An attack where malicious instructions are hidden in external content the agent reads (web pages, tool responses), tricking it into performing unintended actions |
| Attack Success Rate (ASR) | The proportion of adversarial attacks that make the agent produce harmful or unintended behavior; ASR 76% means three out of four attempts succeed |
| Red-teaming | Proactive security testing that simulates attackers to find system vulnerabilities, used for risk assessment and collecting defense training data |
| Memory Poisoning | Writing malicious content into an agent's persistent memory or workspace so it gets re-read and triggers harmful behavior later |
| Defense Cut Set | A defense design method that decomposes an attack chain into required paths — blocking any complete set of paths breaks the entire chain |

---

## Paper 1 — Agent Against Agent: Red-teaming Agents at $20 a Pop

### Agent Against Agent: An Agentic System for Automatic Prompt Injection Red Teaming
Yanting Wang, Chenlong Yin, Runpeng Geng, Jinyuan Jia (Pennsylvania State University) · arxiv: 2608.05108

Links: [arxiv](https://arxiv.org/abs/2608.05108) · [alphaxiv](https://www.alphaxiv.org/abs/2608.05108)

### TL;DR

PIMiner distills past attack experience into a readable, cross-model transferable strategy library. With only ~10 queries per test sample, it achieves 76.2% ASR against Gemini-2.5-Pro, 61.9% against GPT-5.1, and 42.9% against Claude-Sonnet-4.5 on IPIArena (86.7%/53.3%/40.0% on AgentDojo).

### Read Priority

Must-read — directly usable for teams doing agent security evaluation or red-teaming, and it reveals the real defense waterline of current mainstream models against prompt injection.

### Background

Existing red-team methods fall into two camps: RL-trained attacker models (e.g., RL-Hammer, PISmith) that work well but require tens of thousands of queries per target model with poor cross-model transfer; and per-sample search methods (e.g., TAP, PAIR) that need no training but are significantly weaker. What's missing is a "low training cost, high cross-model transfer" approach.

### Mid-level Walkthrough

- **Problem**: Imagine having to spend tens of thousands of queries and hundreds of dollars training a dedicated attacker model every time you want to test a new agent — that's too expensive and too slow for teams wanting a quick security sweep before deployment.
- **Method**: PIMiner replaces retraining with a hierarchical memory system: a long-term strategy library records "what injection techniques work in what contexts," a mid-level memory tracks experience within a dataset, and short-term memory handles individual samples; a router compresses the attacker's context to manageable size. During training, (dataset, target model) pairs are fed sequentially to build the strategy library from scratch. At test time, facing a never-before-seen target model, the learned library is used directly — no retraining needed.
- **Why it matters**: This means prompt injection "attack knowledge" can be distilled, documented, and reused — the bottleneck for security testing shifts from "compute" to "knowledge management."

### Key Details

- IPIArena: Gemini-2.5-Pro 76.2%, GPT-5.1 61.9%, Claude-Sonnet-4.5 42.9%
- AgentDojo: Gemini-2.5-Pro 86.7%, GPT-5.1 53.3%, Claude-Sonnet-4.5 40.0%
- Training phase uses the authors' Claude Code subscription to drive three agents (attacker/router/summarizer), with additional target model query costs of ~$20; compare to RL methods requiring tens of thousands of queries at $100+
- Testing requires only black-box access (final output + success/failure); training assumes gray-box with observable intermediate tool calls
- Ablation shows: removing the strategy library causes a sharp drop in cross-dataset transfer ASR, proving effectiveness comes from reusable attack knowledge rather than model-specific overfitting
- Limitation: Primarily uses Claude Code series models as the attacker backbone; performance with other backbones and their transferability await broader validation

### Reviewer's One-liner

Methodologically solid with remarkable cost-effectiveness, but the authors note they primarily use Claude Code series models as the attacker backbone — whether the same results hold with other models remains to be broadly validated.

### Your Take-away

- If you're doing agent security evaluation: PIMiner's hierarchical memory design (long-term strategy library + router context compression) is worth direct reference and can cut red-teaming costs to 10–20% of the original
- If you're deploying agents that read untrusted content (web pages, tool responses): the paper's data shows mainstream models have a 40–90% chance of being breached within just 10 queries — this risk should be treated as a real-world scenario for defense design, not a theoretical edge case

---

## Paper 2 — Agent Skills Can Be Harmful: A "Seemingly Relevant" Skill Is More Dangerous Than an Obviously Unrelated One

### Agent Skills Can Be Harmful: An Empirical Study of Skill-Induced Failures in LLM Agents
Gen Dong, Yanjie Gao, Liqun Li et al. (Microsoft Research; Gen Dong completed this work during internship) · arxiv: 2608.11888

Links: [arxiv](https://arxiv.org/abs/2608.11888) · [alphaxiv](https://www.alphaxiv.org/abs/2608.11888)

### TL;DR

Using a differential testing framework (comparing "with skill" vs. "without skill / semantically similar skill" reference runs) on SkillsBench and SWE-Skills-Bench, the study identifies 307 skill-induced failures, with "Excessive Procedure" accounting for 62.6% (114/182) of efficiency degradation — primarily from excessive verification (67 cases) and heavyweight implementation pipelines (30 cases).

### Read Priority

Must-read — virtually every team using Claude Code Skills, Custom Instructions, or similar extension mechanisms should read this, because the findings directly challenge the intuition that "more relevant skills are always better."

### Background

Agent skills (like SKILL.md) have become the standard way to extend agent capabilities, but prior research reports mixed results: some improve success rates, some make no difference, some actually slow execution and reduce success rates. The problem is that existing skill benchmarks only measure "did it help," without tools to attribute a specific failure to a specific skill and pinpoint exactly what went wrong.

### Mid-level Walkthrough

- **Problem**: Imagine a coding agent loads a "testing framework" skill that's topically relevant, but its required verification procedures far exceed what the task actually needs — the agent spends excessive tokens and time on unnecessary verification, or even gets the task wrong because it misinterprets the skill's instructions. Post-mortem, you can't tell whether this was base agent inability or the skill leading it astray.
- **Method**: Inspired by differential testing, the researchers construct paired comparisons of "target run (with test skill loaded)" vs. "reference run (no skill, or semantically similar alternative skill)" for each task. A failure is attributed to the skill only when the reference group can solve the same task or solve it at lower cost. They build SkillTriage, an automated attribution and classification tool, based on this approach.
- **Why it matters**: This shows that what the skill ecosystem needs isn't more skills, but a mechanism to continuously screen "which skills are quietly dragging down tasks" — especially as skill marketplaces grow and manual review becomes infeasible.

### Key Details

- 307 skill-induced failures: 125 functional failures + 182 efficiency degradations
- Among functional failures, Task-Implementation Fault (skill misdirects task implementation) accounts for 86/125 (68.8%), far exceeding path misplacement (24 cases) and environment mismatch (13 cases) — most failures aren't from the skill being irrelevant, but from it being "relevant in the wrong way"
- Among efficiency degradations, Excessive Procedure accounts for 114/182 (62.6%), broken down into excessive verification (67 cases) and heavyweight implementation pipelines (30 cases)
- For context-overhead degradation, 43/46 cases stem from "mandatory skill body text" rather than simply longer prompts
- Practical tool: SkillTriage automates attribution + classification reports, usable for continuous skill quality screening
- Limitation: Both benchmarks (SkillsBench, SWE-Skills-Bench) skew toward coding tasks; whether conclusions generalize to writing, data analysis, and other non-coding skill types remains unvalidated

### Reviewer's One-liner

The differential testing framework is rigorously designed, and 307 cases provide sufficient scale for the classification findings, but both benchmarks skew toward coding tasks — whether the conclusions hold for skills in other domains remains unknown.

### Your Take-away

- If you maintain a skill/extension library: use "no skill" or "semantically similar alternative skill" as control groups to verify each skill provides net benefit, rather than just checking if it's topically "relevant"
- If you're writing SKILL.md files: avoid making "verification checklists" and "heavyweight implementation pipelines" mandatory procedures — these are the two highest sources of efficiency degradation found in this paper

---

## Paper 3 — Order 66 Scenario Analysis: No Single Mechanism Is Fatal — But What About Their Combination?

### Compositional Threat Analysis of Latent Compromise in LLM Agent Systems: The Order 66 Scenario
Satoshi Matsuoka (single author, no institutional affiliation listed) · arxiv: 2608.08131

Links: [arxiv](https://arxiv.org/abs/2608.08131) · [alphaxiv](https://www.alphaxiv.org/abs/2608.08131)

### TL;DR

The paper uses a compositional threat model to analyze the "dormant implant + post-hoc activation + harness authorization" compound attack chain: within each of two propagation classes, intra-class replication rates are below 1 (won't self-spread), but cross-class feedback can push the effective propagation coefficient to ρ=1.092 (self-sustaining spread); adding isolation and persistence controls brings it back down to 0.381.

### Read Priority

Skim — purely theoretical modeling with no tested systems or penetration tests, but it provides a rare threat framework that considers distributed risks in combination, useful as a reference checklist for architecture design.

### Background

Previous research has mostly addressed agent security mechanisms in isolation: weight-level backdoors (Sleeper Agents, BadAgent), post-hoc memory poisoning (AgentPoison, MINJA), text-driven worm-like propagation (Morris-II, AgentWorm). This paper's contribution is assembling these independently studied pieces into a single picture and asking a question no one has systematically answered: what happens when you chain them together.

### Mid-level Walkthrough

- **Problem**: Suppose a widely deployed agent extension or shared memory contains a rule that normally never triggers; one day a single sentence in an email, document, or peer message activates it; and the agent's harness happens to hold permissions over the filesystem, cloud, codebase, or recovery processes. Each link is individually minor, but what about all three together?
- **Method**: The paper decomposes the "fatal common core" into five necessary conditions: dormancy, activation, authority, reachable targets, and failed recovery. It then distinguishes three "population reach" pathways — pre-deployment embedding, post-deployment persistent implanting, and peer-to-peer replication. From this necessary-condition graph, it derives "defense cut sets": blocking just one pathway (e.g., only prompt filtering) leaves the others open — you must cover a complete cut set simultaneously.
- **Why it matters**: This provides a computable answer to "can threat combinations be worse than individual threats" instead of relying on intuition — the paper's propagation coefficient calculations show that individually safe-looking components can, when combined, cross the threshold for self-sustaining spread.

### Key Details

- Two-class propagation matrix: baseline scenario effective propagation coefficient ρ(B)=1.092 (>1, meaning early-stage spread is self-sustaining in expectation); with message isolation, import quarantine, immutable state, and faster removal controls, drops to ρ(B)=0.381 (<1, naturally decays)
- Three population reach pathways: pre-deployment embedding, post-deployment persistent implanting, peer-to-peer replication — each requires different defense cut set combinations; no single control covers all
- As of August 5, 2026, no publicly recorded incident has traversed the complete Order 66 chain end-to-end, but each constituent mechanism has real-world precedent (an official extension once distributed destructive instructions that caused failures, a package worm once carried conditional home-directory wipe logic, another package worm planted persistent hooks in coding agent configurations)
- Most critical shared defenses: capability arbitration independent of the system, protected recovery mechanisms, provenance tracking for persistent state, propagation isolation
- Limitation: Entirely literature synthesis and mathematical modeling with no end-to-end attack reproduction on real agent systems; the paper self-describes its conclusions as "componentwise credible" rather than "has occurred" or "will inevitably occur"

### Reviewer's One-liner

The analytical framework is thorough and the defense cut set derivation is persuasive, but it's entirely based on literature synthesis and theoretical modeling with no reproduction experiments on real systems — "componentwise credible" as a qualitative judgment doesn't equate to confirmed real-world risk levels.

### Your Take-away

- If you're designing agent permission models: don't defend only one pathway (e.g., only prompt filtering or only checkpoint scanning) — the paper's cut set analysis shows you must simultaneously cover pre-deployment, post-deployment, and peer-to-peer replication pathways for completeness
- If you're doing security planning for agent fleets: prioritize "recovery mechanisms independent of the main system" as an investment target — this is what the paper identifies as the most critical and most commonly overlooked line of defense

---

## Today's Takeaway

I used to think the main attack surface for agents was "external inputs" — web pages, tool responses, and other obviously untrusted sources. Today I realized what actually deserves the most attention is what agents actively load or even generate themselves: skills, memories, extensions. These are treated by agents as "already trusted" context, and that makes them the hardest layer to defend — existing protections mostly assume threats come from outside, yet rarely inspect the content agents "invite in" themselves.

## References

- [Agent Against Agent: An Agentic System for Automatic Prompt Injection Red Teaming](https://arxiv.org/abs/2608.05108)
- [PIMiner code repository](https://github.com/wang-yanting/PIMiner)
- [Agent Skills Can Be Harmful: An Empirical Study of Skill-Induced Failures in LLM Agents](https://arxiv.org/abs/2608.11888)
- [Compositional Threat Analysis of Latent Compromise in LLM Agent Systems: The Order 66 Scenario](https://arxiv.org/abs/2608.08131)
