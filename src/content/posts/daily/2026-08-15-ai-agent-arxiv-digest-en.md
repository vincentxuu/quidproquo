---
title: "AI Agent Arxiv Digest — 2026-08-15"
date: 2026-08-15
category: daily
type: digest
tags: [ai-agent, arxiv, daily, agent-skill, agent-memory, agent-evaluation]
lang: en
description: "Three papers today orbit the same question — how do Agent skills auto-evolve? SkillEvo uses multi-turn interaction feedback to produce non-decaying evolution gradients; SkillShapley applies game-theoretic attribution to reveal which steps in a skill actually matter; MindMemOS turns memory and skill evolution into a portable OS layer"
tldr: "SkillEvo replaces single-turn QA evaluation with multi-turn interaction feedback so skill evolution doesn't stall after the first round, outperforming self-reflection by 23 points; SkillShapley brings Shapley values to skill step attribution — 99 evaluations approximate the exact ranking, revealing that 'decision-bridging steps' are the high-value ones; MindMemOS unifies memory management with an entity-property-time structure, hitting 94% on LOCOMO and lifting SpreadsheetBench success rate by 9.2 percentage points through skill evolution"
series:
  name: "AI Agent Arxiv Digest"
  order: 83
---

> 🌏 [中文版](/posts/daily/2026-08-15-ai-agent-arxiv-digest)

## Today's Overview

Agent skills are evolving from "write once and forget" to "self-evolving living documents," but the evolution itself raises three unsolved problems: feedback signals decay, you can't tell which steps in a skill actually matter, and memory and skills lack shared evolution infrastructure. Today's three papers each tackle one of these: SkillEvo shows that multi-turn interaction feedback keeps the evolution gradient alive instead of zeroing out after the first round of patches; SkillShapley uses Shapley values to quantify each step's marginal contribution, turning skill editing from blind trimming into evidence-based decisions; MindMemOS puts memory and skills in the same portable OS layer so they co-evolve. Together, the three sketch a picture: the future of Agent skills isn't "better initial versions" but "systems that keep evolving."

## Key Terms

| Term | Plain-language explanation |
|---|---|
| Agent Skill | A natural-language step-by-step guide plugged into an Agent's harness so it knows how to execute a specific task — no model weights changed, only behavior |
| Evolution Gradient | The feedback signal telling a skill "which direction to change"; if feedback only catches surface issues, one round of fixes exhausts the signal |
| Shapley Value | A game-theory measure of each player's marginal contribution — applied to skills, it quantifies how much each step contributes to overall success |
| Coalition | A subset combination in Shapley computation — in the skill context, a skill variant that keeps only certain steps |
| Memory OS Layer | An abstraction layer for managing Agent long-term memory — handling storage, retrieval, merging, and conflict resolution the way an OS manages files |

---

## Paper 1 | SkillEvo: Multi-Turn Interaction Feedback to Keep Skill Evolution from Stalling

### SkillEvo: Self-Renewing Evolution Gradients from Multi-Turn Interaction Feedback
Qianxi Yan, Chunrong Chen, Jiuzhou Zhao et al. (Tencent Cloud Andon / Zhejiang University) · arxiv: 2608.13120

Links: [arxiv](https://arxiv.org/abs/2608.13120) · [alphaxiv](https://www.alphaxiv.org/abs/2608.13120)

### TL;DR

Repurposes multi-turn user simulation from "evaluation endpoint" to "feedback generator" so that each revision round both consumes existing feedback and produces new feedback, paired with an independent governance layer that prevents structural degradation. On 9 production skills it beats self-reflection evolution by 23 points and single-turn QA-driven evolution by 15.4 points.

### Read Priority

Must-read — if you're doing skill automation or continuous Agent improvement, this paper directly answers "why does my skill evolution stall after two rounds."

### Background

Existing skill evolution methods (self-reflection, single-turn QA evaluation) all hit the same wall: feedback signal decay. After the first round patches surface defects, single-turn evaluation can no longer surface deeper issues — the ones that only emerge in multi-turn conversations never get fixed. On top of that, governance mechanisms rely on a single scalar score as a gate, which can block obvious regressions but can't locate or fix structural causes.

### Mid-Level Walkthrough

- **Problem**: Imagine you wrote a customer-service SOP. Testing each Q&A pair in isolation looks fine, but three rounds of follow-up questions expose the cracks — tone contradictions, repeated information, missing context. The issue is that your testing is single-turn, so improvements can only reach as far as single-turn tests can reveal.
- **Method**: SkillEvo has two core components. The first repositions multi-turn user simulation as a "feedback generator" — follow-up questions peel back defects layer by layer, with each revision round consuming old feedback while producing new feedback, forming a self-renewing evolution gradient. The second is an independent governance layer that doesn't passively gate out degraded versions with scores, but actively repairs factual degradation and structural bloat.
- **Why it matters**: For Agent platforms, skills aren't static documents written once and left alone. SkillEvo proves that "feedback quality determines the evolution ceiling" — replace single-turn QA with multi-turn interaction and the ceiling goes up significantly.

### Deep Dive

- Tested on 6 categories of cloud services, 9 production skills, 98 skill reference files
- Outperforms self-reflection baseline by 23.0 points, single-turn QA evolution by 15.4 points ⚠️ (Tencent self-evaluated; awaiting external replication)
- Core insight on evolution gradients: single-turn feedback information drops sharply after the first round; multi-turn follow-ups sustain new signal
- Governance layer actively repairs two issue types: factual degradation (incorrect information introduced during evolution) and structural bloat (skills growing longer and more redundant with each edit)
- Adoption threshold: requires building a multi-turn user simulation pipeline; smaller teams can start by mining follow-up patterns from existing conversation logs
- Limitation: tested only on cloud-service scenarios; effectiveness on coding or open-ended reasoning tasks remains unverified

### Reviewer's One-Liner

The problem definition is sharp — "evolution gradient decay" is a real and widespread bottleneck, and the multi-turn feedback solution is intuitive and effective. But 9 skills is a small test set, and all skills are internal Tencent Cloud scenarios, so generalizability needs more evidence.

### Your Take-Away

- If you maintain an Agent skill library: upgrade your single-turn evaluation pipeline to multi-turn follow-up mode — use "how would a user follow up?" as a stress test for skill quality
- If you're building skill auto-evolution: upgrade governance from "score gate" to "active repair layer," distinguishing factual degradation from structural bloat and handling each separately

---

## Paper 2 | SkillShapley: Game Theory Tells You Which Skill Steps Are Worth Keeping

### SkillShapley: Boundary-Adaptive Shapley Valuation for Skill Step Attribution in LLM Agents
Chang Liu, Yuqi Zhang, Yiman Zhong et al. (Beihang University / Shandong University) · arxiv: 2608.13173

Links: [arxiv](https://arxiv.org/abs/2608.13173) · [alphaxiv](https://www.alphaxiv.org/abs/2608.13173)

### TL;DR

Treats each step in an Agent skill as a player in a cooperative game and uses Shapley values to quantify each step's marginal contribution to task success. The proposed BAES algorithm approximates the exact Shapley ranking within 99 skill-variant evaluations and reveals that "decision-bridging steps" are far more valuable than "background-information steps."

### Read Priority

Must-read — this paper solves a very practical problem: a typical skill.md has 10+ instruction blocks and you don't know which are essential, which are safe to remove, and which will break everything if deleted. SkillShapley gives a quantifiable answer.

### Background

Skill design is still trial and error. End-to-end benchmarks give you an overall score but can't say "this step is helping vs. dragging you down." Prompt compression operates at the token level, workflow optimization targets execution structure — neither attributes at the step-semantics level.

### Mid-Level Walkthrough

- **Problem**: You have a 10-step skill document that scores 80 on a benchmark. You want to trim it to 6 steps but don't know which 4 to cut — removing the wrong step might drop 30 points, removing the right one might change nothing.
- **Method**: Each skill step becomes a player in a cooperative game; a "coalition" is a skill variant that keeps only certain steps; the utility is benchmark success rate. BAES runs in two phases: a warm-up phase uses a cache-aware greedy strategy for broad coverage, then an adaptive phase concentrates evaluations on high-uncertainty step-size layers, using cached one-flip marginals to maximize information per evaluation.
- **Why it matters**: This turns skill editing from "blind trial and error" into "evidence-based decisions." The pattern of high-value steps is "connecting conditions to executable decision rules" — a finding with direct implications for skill authoring.

### Deep Dive

- Tested on 3 tasks from SkillsBench with 10, 9, and 11 steps respectively
- Exact Shapley is feasible for low-step skills (10 steps = 1024 coalition combinations); BAES achieves good approximation within 99 evaluations
- BAES cache efficiency: with the same 99-evaluation budget, BAES produces 206 reusable one-flip marginal edges vs. MC sampling's 130 (115 unique)
- Key finding: high-value steps are "procedural bridges" — steps that connect task conditions to API operations, repair decisions, or verification instructions. Low-value steps are "information islands" — they provide background facts but don't change the Agent's next decision
- Compared against SHAP, Leave-One-Out, and LeastCore; Shapley produces the steepest performance decay curve in top-ranked removal validation
- Limitation: tightly coupled pipeline-style skills don't fit well — removing a middle step crashes the entire pipeline, so Shapley values reflect structural necessity rather than step quality

### Reviewer's One-Liner

Moving Shapley values from feature attribution to skill-step attribution is a natural and effective extension, and BAES's cache-aware design does reduce evaluation cost. But exact reference values exist only for low-step skills; approximation quality for high-step skills needs more validation.

### Your Take-Away

- If you're writing skill documents: make every step a "decision bridge" — connect conditions to executable actions instead of piling up background explanations. Put background info in reference files, not in skill steps
- If you're managing skill library quality: use the removal curve as a skill health metric — if removing any single step doesn't affect success rate, the skill likely has significant redundancy

---

## Paper 3 | MindMemOS: Memory and Skills Co-Evolving in One OS Layer

### MindMemOS: A Portable and Self-Evolving Memory Operating Layer for AI Agents
Kaichao Liang, Yuqi Cui, Hao Kong et al. (Noah's Ark Lab, Huawei Technologies) · arxiv: 2608.12428

Links: [arxiv](https://arxiv.org/abs/2608.12428) · [alphaxiv](https://www.alphaxiv.org/abs/2608.12428)

### TL;DR

Turns Agent memory management into a portable, self-evolving OS layer — organizes memory with an "entity-property-time" unified structure, combined with evolutionary memory schema optimization and "dreaming"-style memory consolidation. Achieves 94.03% accuracy on LOCOMO, with skill evolution lifting SpreadsheetBench success rate by 9.2 percentage points.

### Read Priority

Skim — the architecture is comprehensive but reads like a systems paper; best suited for teams building Agent memory infrastructure. For pure application developers, the core insight is "memory and skills should evolve within the same mechanism."

### Background

Most existing Agent memory systems freeze after development — memory schema, organization strategy, and retrieval methods don't improve with use. This is like giving an Agent a fixed filesystem to handle ever-changing use cases. Prior work (Mem0, MemGPT, etc.) each tackles one aspect of memory but lacks a unified "memory OS" concept.

### Mid-Level Walkthrough

- **Problem**: Imagine giving an Agent a memory system that records user preferences and past operation experience. But the categorization scheme, merging strategy, and skill associations all freeze after deployment. Three months later the use cases have shifted dramatically, but the memory system is still storing new things under the old schema.
- **Method**: MindMemOS has three self-evolution mechanisms. MindMemEvolve uses validation-driven evolutionary search to optimize memory schema — automatically evolving the best-fit memory model for target scenarios. The "dreaming" mechanism consolidates accumulated memories offline, merging redundancies and resolving conflicts. MindSkillEvolve converts Agent execution traces into reusable, continuously refined skills.
- **Why it matters**: Putting memory and skills in the same evolution framework, rather than evolving each independently, lets them reinforce each other — better memory makes skill execution more precise, better skills generate more valuable memories.

### Deep Dive

- LOCOMO conversational memory accuracy 94.03%, PersonaMem persona memory 70.63%
- MindSkillEvolve improves SpreadsheetBench by 9.2 percentage points over the initial skill baseline ⚠️ (Huawei self-evaluated; awaiting external replication)
- Unified memory structure: entity-property-time, covering four memory types: events, preferences, facts, and experiences
- "Dreaming" mechanism: scans all memories offline, merges redundant records, and flags conflicting ones — analogous to memory consolidation during human sleep
- Implicit correction feedback: when users correct the Agent, the system automatically traces back and fixes the corresponding memory entries
- Portability: the memory OS layer can be transplanted across Agent frameworks (LangGraph, CrewAI, etc.)
- Limitation: computational cost and quality control details of the "dreaming" process are not sufficiently discussed

### Reviewer's One-Liner

Elevating memory management to an "OS" abstraction layer is the right direction, and MindMemEvolve's evolutionary search design is novel. But a 35-page systems paper with this many components needs deeper ablation studies per component — it's hard to tell which design decisions are truly indispensable.

### Your Take-Away

- If you're building an Agent memory system: consider memory and skills within the same evolution framework rather than evolving them separately. The entity-property-time unified structure is a worthwhile starting point
- If your Agent has long-running requirements: the "dreaming" mechanism (offline memory consolidation) is a low-cost quality maintenance tool — periodically merging redundancies and resolving conflicts beats letting memory grow unbounded

---

## Today's Takeaway

I used to think the bottleneck for skill evolution was "the model's editing capability isn't good enough" or "not enough iterations." SkillEvo made me realize the real bottleneck is feedback signal quality — single-turn feedback exhausts its information in the first round, and subsequent iterations just spin in place. Meanwhile SkillShapley changed how I think about skill steps: it's not "the more detailed the better" — each step must be a "decision bridge" connecting conditions to actions, or it's wasting context.

## References

- [arxiv:2608.12428](https://arxiv.org/abs/2608.12428)
- [arxiv:2608.13120](https://arxiv.org/abs/2608.13120)
- [arxiv:2608.13173](https://arxiv.org/abs/2608.13173)
