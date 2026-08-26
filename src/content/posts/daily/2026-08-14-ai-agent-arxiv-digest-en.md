---
title: "AI Agent Arxiv Digest — 2026-08-14"
date: 2026-08-14
category: daily
tags: [ai-agent, arxiv, daily, agent-harness, agent-evaluation, agent-safety]
lang: en
description: "Three papers point to the same thing — the harness around the model, not the model itself, determines Agent quality: instruction following is overestimated, safety boundaries can be auto-evolved from trajectories, and decomposed verifiers make self-improvement 5x cheaper"
tldr: "Harness-IF reveals Coding Agent instruction following is overestimated by 3.6-7.4 pp because things the model would do anyway are counted as compliance; SHE decomposes the harness into four safety components and auto-evolves from trajectory failures, cutting ASR by 3.1x while improving correctness; SBCO uses a decomposed verifier bank with text gradients for harness self-improvement, matching Gödel Machine at 4-5.5x lower compute on planning tasks"
series:
  name: "AI Agent Arxiv Digest"
  order: 82
---

> 🌏 [中文版](/posts/daily/2026-08-14-ai-agent-arxiv-digest)

## Today's Overview

All three papers today point to the same emerging insight: Agent performance bottlenecks are not in the model but in the harness — the engineering glue wrapping the model (system prompt, rules, tool strategies, verification loops). Harness-IF exposes a measurement illusion from the evaluation side: existing instruction-following rates are inflated because things the model "would have done anyway" are counted as compliance. SHE approaches from the safety side, decomposing the harness into four independent components so safety boundaries can auto-evolve from trajectory failures. SBCO tackles it from the efficiency side, proving that structuring verifiers and repair strategies makes harness self-improvement 5x cheaper than recursive self-modification. Together, the three papers say the same thing: **the harness is a measurable, decomposable, and automatically optimizable engineering surface in its own right**.

## Terms to Know Before Reading

| Term | Plain Explanation |
|---|---|
| Agent Harness | All engineering components wrapping the LLM — system prompt, tool definitions, memory management, permission control, execution loop. The model is the engine; the harness is the chassis |
| ASR (Attack Success Rate) | The fraction of adversarial attacks that make the Agent behave unsafely; lower is better |
| Against-Prior Accuracy | A new metric from Harness-IF: only counts compliance on instructions the model would NOT follow by default — excluding coincidental compliance |
| TextGrad (Text Gradients) | Uses natural-language critiques instead of numerical gradients, making LLM prompts and strategies "differentiable" for optimization |
| Verifier Bank | A set of per-constraint checkers learned by SBCO, each responsible for verifying whether a single constraint is satisfied |

---

## Paper 1 | Harness-IF: Is Your Coding Agent Actually Following Instructions?

### Harness-IF: Evaluating Instruction Following Across Instruction Surfaces in Coding Agents
Zining Huang, Haoran Que, Hong Zeng et al.　·　arxiv: 2608.11727

Links: [arxiv](https://arxiv.org/abs/2608.11727) · [alphaxiv](https://www.alphaxiv.org/abs/2608.11727)

### TL;DR

Coding Agent instruction-following rates are systematically overestimated — things the model "would have done anyway" account for 3.6-7.4 percentage points of false compliance, and instruction priority across placement surfaces (system prompt vs. tool description) does not follow prompt depth.

### Read Priority

Must-read — if you deploy Coding Agents and rely on instruction-following rates for decisions, this directly impacts your evaluation methodology.

### Domain Background

Existing instruction-following benchmarks stuff all rules into the user turn, but Coding Agent rules are spread across five surfaces (system prompt, project files, user turn, tool descriptions, skill descriptions). When the model happens to "do the right thing anyway," compliance rates are artificially inflated. No prior method distinguished "actually listening" from "coincidentally correct."

### Mid-Level Walkthrough

- **Problem**: Imagine telling a colleague "remember to save when you're done" — they save, but they always save anyway. You think they followed your instruction, but it had zero impact on their behavior. Harness-IF targets exactly this gap.
- **Method**: Built a 642-rule library, sampled 256 rules placed across five instruction surfaces, and scored them on 60 multi-turn coding tasks. The core metric is Against-Prior Accuracy: remove each rule and re-run to check whether the model's default behavior would have done the same thing. Only instructions the model would NOT follow by default count toward AP-Acc.
- **Why it matters**: Agent platforms need to know which instruction surfaces are most effective and which rules actually change behavior. Blindly stacking rules without knowing which are "truly followed" creates a false sense of security.

### Deep Dive

- Compliance rates across 12 frontier models: 72.1-85.9%, but AP-Acc drops to 66.1-78.6%
- Inflation magnitude varies by model (3.6-7.4 pp), meaning model rankings could shift
- Instruction priority does not follow prompt depth: system prompt, project files, and user instructions outrank tool and skill descriptions ⚠️ (authors' own evaluation, 9-build pilot)
- Adoption barrier: requires building a "remove-and-rerun" probe for each rule — not cheap
- Directly relevant to Claude Code's CLAUDE.md architecture: project files rank higher than tool descriptions
- Limitation: the 642-rule library is currently limited to coding scenarios; generalization to other agent types is unverified

### Reviewer's One-Liner

Methodologically solid — AP-Acc is an elegant causal-inference-style design. But probe build cost (9 reruns per rule) may limit practical adoption.

### Your Take-away

- If you're evaluating Coding Agent instruction following: adopt the AP-Acc concept directly — at minimum, sample a few rules and do "remove-and-rerun" to see how much of your compliance rate is illusory
- If you're designing an Agent's instruction architecture: placing rules in system prompt and project files is more effective than tool descriptions — don't hide critical rules inside tool definitions

---

## Paper 2 | SHE: Auto-Evolving Safety Harnesses from Failures

### SHE: Trajectory-driven Safety Harness Evolution for LLM Agents
Wanying Qu, Qinghua Mao, Yu Li et al. (Shanghai AI Lab / Fudan / SJTU / HKUST)　·　arxiv: 2608.09885

Links: [arxiv](https://arxiv.org/abs/2608.09885) · [alphaxiv](https://www.alphaxiv.org/abs/2608.09885)

### TL;DR

Decomposes the Agent harness into four safety components (System Prompt, Rule Bank, Safety Memory, Tool Policy) and uses an attribution-driven evolution loop to learn boundary corrections from trajectory failures, cutting ASR by 3.1x with no loss in correctness.

### Read Priority

Must-read — Agent safety practitioners finally have a concrete architecture where "safety is not one blob of prompt but four independently evolvable components."

### Domain Background

Existing Agent safety mechanisms treat the harness as a static deployment artifact: write one version of the system prompt plus a set of tool restrictions and ship it. The problem is that new risks keep emerging while the harness's safety responsibilities are tangled together — changing one part can break another. The prior SafeHarness was static and could not learn from failures.

### Mid-Level Walkthrough

- **Problem**: Imagine a security system where the cameras, access control, and alarms are all wired onto a single circuit board. Upgrading the alarm means tearing out the whole board. SHE's approach is to separate them into four independent modules, each upgradeable on its own.
- **Method**: SHE splits the harness into four components, each with a clear safety responsibility. The evolution loop has three steps: ① structured diagnosis from trajectory failures (attributed to the specific component), ② boundary correction on that component, ③ validation with dual safety-utility metrics. Runs 20 evolution rounds, each covering 15 tasks × 6 attack conditions.
- **Why it matters**: Safety is no longer "write a stricter prompt" — it becomes a continuously iterable engineering process. The four-component decomposition tells you "was this failure a Tool Policy problem or a Rule Bank problem."

### Deep Dive

- Baseline: Agent-SafetyBench (6 attack conditions), ASR drops from 17.1% to 5.5% (vs. static SafeHarness)
- Correctness (UA) simultaneously rises from 31.6% to 47.6% — safety and utility are not zero-sum
- Held-out AgentHarm: Harm Score drops from 19.8% to 9.8%, refusal rate rises from 78.4% to 86.4% ⚠️ (SHE team's own evaluation)
- Evolution model is swappable: GPT-5.5 (best at R17), DeepSeek-V3.2 (best at R03), GLM-5.2 (best at R05) each have different safety-utility tradeoffs
- Adoption barrier: requires a replayable trajectory environment and structured scoring; 20 rounds × 90 rollouts is not cheap
- Integrates with MCP / LangGraph architectures: four components map to existing harness system prompt, middleware, memory, and tool permissions
- Limitation: validated only in simulated benchmark environments; real deployment risk distributions may differ

### Reviewer's One-Liner

The four-component decomposition and attribution-driven evolution design is clear and useful — an important step toward engineering Agent safety. But the 20-round evolution compute cost and benchmark representativeness still need validation.

### Your Take-away

- If you're working on Agent safety: decompose the harness into System Prompt / Rule Bank / Safety Memory / Tool Policy, each with independent version control and regression testing
- If you're building an Agent platform: SHE's "attribute to component → correct boundary → dual-metric validation" three-step loop can plug directly into a CI/CD pipeline

---

## Paper 3 | SBCO: Making Planning Agent Harnesses Self-Improve at 5x Lower Cost

### SBCO: Self-Supervised, Verifier-Grounded Harness Optimization For Planning Agents
Vivek Kulkarni, Sudipta Paul, Aounon Kumar et al.　·　arxiv: 2608.10157

Links: [arxiv](https://arxiv.org/abs/2608.10157) · [alphaxiv](https://www.alphaxiv.org/abs/2608.10157)

### TL;DR

Uses a decomposed verifier bank + text gradients for harness self-improvement, matching the Gödel Machine variant (HGM-C) that requires 4,000 plan generations with just 733-989, and surpassing it on shopping tasks by +3 Match / +9 Case Accuracy.

### Read Priority

Must-read — if your Agent handles planning tasks with explicit constraints (itineraries, shopping, scheduling), SBCO's verifier decomposition approach is directly applicable.

### Domain Background

Agent self-improvement has two paths: one is Gödel Machine-style recursive self-modification (the Agent edits its own code), which requires "code-editing ability" and "task ability" to be aligned and is computationally expensive (thousands of candidate searches). The other is having a fixed meta-agent optimize the harness, but prior work optimized the harness monolithically without structural decomposition.

### Mid-Level Walkthrough

- **Problem**: Imagine tuning a machine with 20 knobs. Recursive self-modification has the machine randomly turning knobs and checking results (evolutionary search). SBCO's approach: first figure out what each knob controls (learn verifiers), then turn them one at a time (block coordinate ascent).
- **Method**: Two phases alternate — ① learn a verifier for each constraint (quality-gated by precision/recall, precision ≥ 0.80 to enter the bank), ② with verifiers fixed, optimize prompts and repair strategies using text gradients. The outer loop runs 3 epochs, with each block getting up to 5 tactical corrections + 2 strategic pivots.
- **Why it matters**: Proves that "structured verification + decomposed optimization" is 4-5.5x cheaper than "monolithic evolutionary search" with comparable or better results. For any planning task with explicit constraints, this is a directly replicable improvement framework.

### Deep Dive

- Travel: Composite 84 vs. HGM-C 83, Budget 733 vs. 4,000 (5.5x more efficient)
- Shopping: Match 94 vs. HGM-C 91, Case Accuracy 79 vs. 70 (+9), Budget 989 vs. 4,000 (4x more efficient)
- 86% of performance gains come from verifiers with F1 ≥ 0.80 — poorly learned verifiers are worse than none ⚠️ (authors' own evaluation, averaged over 2 runs)
- Verifiers and repair strategies transfer across models: strategies learned on GPT-5.4-mini give +9.9 improvement when applied directly to Mistral
- Shopping task repair strategies barely call the LLM, instead using code to directly modify the cart — the optimizer discovered this shortcut on its own
- The optimizer also found a flaw in the Shopping scoring metric: adding items is never penalized (pure recall), so the strategy learned to only add, never remove
- Limitation: tested only on planning tasks with explicitly verifiable constraints; constraints the verifier cannot learn (e.g., geographic distance) remain unimprovable

### Reviewer's One-Liner

Block coordinate ascent + text gradients is an elegant and efficient design; the verifier quality gate is a highlight. But the scope is limited to tasks with formalizable constraints — readers need to judge this precondition for themselves.

### Your Take-away

- If your Agent handles itinerary/shopping/scheduling with constraints: directly borrow SBCO's three-piece toolkit of "per-constraint verifier + quality gate + repair strategy" — no need to reinvent the wheel
- If you're working on Agent self-improvement: don't rush to recursive self-modification — try structured decomposition first. SBCO proves this path is both cheaper and better on constrained tasks

---

## Today's Takeaway

I used to think the harness was just "glue code wrapping the model." Today's papers show it is becoming an independent engineering discipline — measurable (Harness-IF's AP-Acc), decomposable into components with clear responsibilities (SHE's four components), and automatically optimizable with structured methods (SBCO's block coordinate ascent). The ceiling on model capability is hard to raise in the near term, but the room for harness improvement is nearly unlimited — and far cheaper.

## References

- [arxiv:2608.09885](https://arxiv.org/abs/2608.09885)
- [arxiv:2608.10157](https://arxiv.org/abs/2608.10157)
- [arxiv:2608.11727](https://arxiv.org/abs/2608.11727)
