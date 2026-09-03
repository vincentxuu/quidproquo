---
title: "AI Agent Arxiv Digest — 2026-08-10"
date: 2026-08-10
category: daily
type: digest
tags: [ai-agent, arxiv, daily, agent-harness, self-evolution, agent-safety]
lang: en
description: "Three papers tackle the same question — agent harnesses shouldn't be static: Evo-Bench is the first benchmark to quantify LLM self-improvement of harnesses, MEGA makes optimization knowledge self-evolving, and SHE proves safety boundaries can learn and evolve from trajectories"
tldr: "Evo-Bench benchmarks nine models on self-improving harnesses — GPT-5.6 Sol tops at +16.6 but Office tasks barely move; MEGA uses a three-layer Wisdom Graph to make agent optimization infrastructure self-evolving, merging knowledge accumulation with optimization; SHE decomposes harnesses into four evolvable components that learn safety boundaries from failure trajectories, cutting ASR by 3.1x with cross-model transferability"
series:
  name: "AI Agent Arxiv Digest"
  order: 78
---

> 🌏 [中文版](/posts/daily/2026-08-10-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers answer the same core question from different angles: can an agent's harness — system prompt, tool definitions, memory modules, safety rules — improve itself? Evo-Bench is the first to treat "harness improvement" as a standalone capability to measure, finding that top models can indeed self-evolve frameworks approaching human-tuned quality, but stall on Office tasks requiring precise workflows. MEGA goes further: not only does the agent improve itself, but the knowledge generated during improvement evolves too — the optimization system and knowledge base are the same loop. SHE applies this concept specifically to safety: letting the harness learn new safety boundaries from failure trajectories, with learned rules transferable across models. The combined message is clear: in H2 2026, "harness self-evolution" has moved from paper concept to a measurable, implementable engineering direction.

## Terms to Know Before Reading

| Term | Plain Explanation |
|---|---|
| Harness | An agent's "operating system" — system prompt, toolset, memory management, permission controls, and everything beyond the model itself that determines how the agent interacts with its environment |
| Harness Evolution | An agent autonomously modifying its own harness to improve performance, without manual prompt or tool definition adjustments |
| Attack Success Rate (ASR) | The proportion of adversarial attacks that make an agent behave unsafely; lower ASR means better defense |
| Wisdom Graph | A knowledge graph structure proposed by MEGA that decomposes experience learned during agent optimization into atomic units and establishes reasoning relationships |
| Attribution-guided Evolution | SHE's core mechanism: first diagnose "which harness component caused the failure," then modify only that component, avoiding side effects from global changes |

---

## Paper 1 | Evo-Bench: Can Your Model Improve Its Own Harness?

### Evo-Bench: Can Language Models Improve Agent Harness?
Lisheng Huang, Chen Yang, Hao Zhou et al. (Renmin University of China / BOSS Zhipin)　·　arxiv: 2608.09096

Links: [arxiv](https://arxiv.org/abs/2608.09096) · [alphaxiv](https://www.alphaxiv.org/abs/2608.09096)

### TL;DR

The first benchmark specifically measuring LLMs' ability to self-improve harnesses. GPT-5.6 Sol achieves the highest overall gain of +16.6 points, approaching human-tuned levels, but Office task scores barely move.

### Read Priority

Must-read — if you're building agent frameworks or platforms, this paper directly tells you "which models can self-modify frameworks, to what extent, and where they can't," with head-to-head data across nine models.

### Background

Agent performance increasingly depends on the harness rather than the model itself. The prior approach was manual iteration of prompts and tool definitions, but that doesn't scale. Research on "letting models modify their own harnesses" has exploded in recent months, yet lacks unified evaluation — existing benchmarks can't separate "harness improvement" from "inherent model capability."

### Mid-Level Walkthrough

- **Problem**: Imagine you have an agent framework and want to know whether "letting GPT-5.6 self-modify this framework over ten rounds" beats human tuning — but how do you confirm the improvement comes from the framework getting better, not just the model being strong?
- **Method**: Evo-Bench uses "auxiliary task evolution" to first identify which tasks are genuinely sensitive to harness changes, then uses stratified sampling to ensure test and validation sets don't overlap. Nine models each evolve from the same CodeAct base harness, with gains quantified per round.
- **Why it matters**: This is the first benchmark that can isolate "harness evolution capability," letting you answer a practical engineering question: "which model should I use to auto-improve my agent framework?"

### Key Details

- GPT-5.6 Sol overall 46.3 (+16.6), Claude Opus 4.8 close behind at 45.8 (+16.1)
- Human-tuned Artificial Harness scores 47.5 — top models are close but haven't surpassed it yet ⚠️ (author-tested, external replication pending)
- Search task gains are massive (+32.8), General tasks moderate (+11.0), Office tasks barely move (+3.2)
- Open-source Qwen3.6-27b ranks sixth overall at 39.4 (+9.7), proving top-tier closed-source models aren't strictly required
- "Early saturation" phenomenon: most models stop improving after 3-5 rounds
- Evolved harnesses transfer to other policy models and continue delivering gains
- Limitation: only three domains covered; the root cause of Office task evolution bottleneck isn't deeply analyzed

### Reviewer's One-Liner

Solid experimental design with a convincing methodology for isolating harness improvement. But whether the low Office task gains reflect "a fundamental limit of harness evolution" or "these specific tasks being unsuitable" doesn't get sufficient attribution analysis.

### Your Take-away

- If you're building an agent platform: use Evo-Bench directly to test your models' harness evolution capability, pick the highest-scoring model to drive automated framework optimization — but for domains requiring precise workflows (like Office document processing), human intervention is still needed
- If you're evaluating agent frameworks: treat "harness sensitivity to tasks" as a new framework quality metric — low sensitivity may indicate an over-coupled harness that's too rigid to evolve

---

## Paper 2 | MEGA: Making Agent Optimization Knowledge Grow on Its Own

### MEGA: Self-Evolving Agent Optimization Infrastructure via Wisdom Graph
Jung Hwan Lee, Kyu Ho Lee, Gwang Hoon Yoo　·　arxiv: 2608.10504

Links: [arxiv](https://arxiv.org/abs/2608.10504) · [alphaxiv](https://www.alphaxiv.org/abs/2608.10504)

### TL;DR

Proposes a three-layer self-evolving infrastructure: distill reusable knowledge from agent trajectories, perform compositional reasoning via a Wisdom Graph, then use multi-agent collaborative optimization to attribute improvements to specific strategies — the knowledge base and optimization process become one loop.

### Read Priority

Skim — the architectural vision is ambitious but this is currently a technical report lacking head-to-head comparison data with existing frameworks (like DSPy, AFlow). Worth reading for the architecture design if you're interested in "how agents can systematically accumulate and apply experience."

### Background

Existing agent optimization methods have three disconnects: they optimize but don't accumulate knowledge (starting from scratch each time), they accumulate knowledge but don't do compositional reasoning (relying only on vector similarity retrieval), and they lack self-correction mechanisms (knowledge doesn't update based on subsequent evidence).

### Mid-Level Walkthrough

- **Problem**: Your agent team has run a thousand tasks and learned a lot about "what works and what doesn't" — but these experiences are scattered across logs and unusable in the next optimization round.
- **Method**: MEGA solves this with a three-layer architecture. Layer 1 distills reusable "wisdom assets" from agent sessions using behavioral clustering and A/B validation. Layer 2 decomposes assets into atomic PCR (Premise-Context-Result) units, builds a Wisdom Graph, and uses deductive, inductive, and abductive reasoning to discover bridging knowledge that embedding retrieval can't find. Layer 3 uses multi-agent collaborative controlled optimization, attributing effects to specific strategy changes. Layer 3 evidence feeds back to Layers 1 and 2, enabling knowledge self-evolution.
- **Why it matters**: This is the first framework that designs "optimizing the agent system" and "evolving the knowledge that guides optimization" as the same process — no more "use-and-discard" optimization, but infrastructure that gets smarter with use.

### Key Details

- Wisdom Graph uses PCR triplets for knowledge representation, adding "bridging reasoning" capability beyond pure vector retrieval
- Layer 3's attribution mechanism uses controlled experiments to eliminate data variance, preventing "thinking change A caused improvement when it was actually B"
- 29-page technical report with clear architecture but no published benchmark data ⚠️ (not yet compared against DSPy/AFlow/TextGrad)
- For agent platforms, the core innovation is "meta-level self-evolution" — not just the agent getting better, but the method of making the agent better also improving
- Limitation: entirely theoretical architecture and internal experiments, lacking open-source implementation and community replication

### Reviewer's One-Liner

Clean layered architecture design with precisely positioned "knowledge self-evolution" concept. But the absence of comparison experiments against mainstream optimization frameworks leaves practical viability unverified.

### Your Take-away

- If you're building continuous improvement pipelines for agent platforms: MEGA's Layer 1 (behavioral clustering + A/B validation distillation) is the most structured "learn from trajectories" design to date — worth referencing for its knowledge representation format
- If you're building agent memory systems: Wisdom Graph's PCR triplets plus reasoning extensions add a "why" layer beyond pure vector retrieval — this may be the next upgrade direction for memory systems

---

## Paper 3 | SHE: Teaching Safety Guardrails to Evolve from Failure

### SHE: Trajectory-driven Safety Harness Evolution for LLM Agents
Wanying Qu, Qinghua Mao, Yu Li et al. (Shanghai AI Lab / Fudan / SJTU / HKUST)　·　arxiv: 2608.09885

Links: [arxiv](https://arxiv.org/abs/2608.09885) · [alphaxiv](https://www.alphaxiv.org/abs/2608.09885)

### TL;DR

Decomposes the agent harness into four evolvable components with distinct safety responsibilities (System Prompt, Rule Bank, Safety Memory, Tool Policy), learns safety boundaries from failure trajectories, reduces ASR by 3.1x, and the evolved rules transfer across models.

### Read Priority

Must-read — safety mechanism evolution is a hard requirement for production agent deployment. SHE's four-component decomposition and attribution-guided evolution provide an actionable design template for safety harnesses.

### Background

Existing agent safety mechanisms are mostly static — write a set of rules and deploy. But risks are dynamic: when new attack patterns emerge, static guardrails can't update in time. Moreover, harness functionality is coupled (safety rules mixed with task instructions in the prompt), so changing one part breaks another.

### Mid-Level Walkthrough

- **Problem**: Imagine your agent has been live for a week and encounters attack patterns unseen during training — your only option now is manually editing the system prompt to add rules, but each edit risks affecting normal task performance.
- **Method**: SHE first decouples — decomposing the harness into four components each with independent safety responsibilities. Then it runs an evolution loop: agent executes tasks → on failure, diagnose "which component is responsible" → modify only that component's rules → validate changes against dual safety and utility metrics → adopt only if passed.
- **Why it matters**: This is the first framework to apply "harness evolution" specifically to safety. The decoupled design lets you update safety rules independently without affecting other functionality.

### Key Details

- On Agent-SafetyBench, ASR drops from ~23% (seed) to ~7% (evolved), a 3.1x reduction ⚠️ (author-tested)
- Benign utility improves simultaneously — safety isn't achieved through over-refusal
- Transfer to AgentHarm benchmark (held-out, not used in evolution): ASR drops from 37.4% to 9.8% (-10.0 percentage points vs seed)
- Cross-model testing: GPT-5.5, DeepSeek-V3.2, GLM-5.2 all benefit from the same evolved harness
- All four components contribute: Rule Bank and Safety Memory have the largest impact
- Evolution converges quickly, reaching optimal safety-utility balance in ~17 rounds
- Limitation: only text modality tested; safety evolution for multimodal agents not covered

### Reviewer's One-Liner

The four-component decoupled design is practical and engineering-minded; cross-model transfer results are the most compelling highlight. But the accuracy of the "attribution diagnosis" itself isn't quantitatively evaluated — if the diagnosis misattributes, the evolution direction drifts.

### Your Take-away

- If you're deploying production agents: directly reference SHE's four-component decomposition — design System Prompt, Rule Bank, Safety Memory, and Tool Policy as independently updatable modules, which is far easier to iterate on for safety than "everything in one prompt"
- If you're doing agent safety testing: SHE's evolution loop can serve as an automated red-teaming framework — letting the system automatically learn new defense rules from its own failures

## What I Learned Today

I used to think the "harness" was something you tune before deployment and then leave alone. Today I learned it should be a continuously evolving system — and the evolution direction isn't just performance (Evo-Bench); even safety boundaries can learn from trajectories (SHE). What surprised me most is that evolved harnesses can transfer across models — meaning a good harness isn't tied to a specific model but is an independent, accumulable asset.

## References

- [arxiv:2608.09096](https://arxiv.org/abs/2608.09096)
- [arxiv:2608.09885](https://arxiv.org/abs/2608.09885)
- [arxiv:2608.10504](https://arxiv.org/abs/2608.10504)
