---
title: "AI Agent Arxiv Digest — 2026-09-25"
date: 2026-09-25
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's three papers each target one of three judgment calls a long-horizon agent has to make — when to decide what's worth remembering, what to cut when the context budget runs out, and how often frontier models actually pick the right fork"
tldr: "JitMem defers memory curation from write time to read time, beating the strongest baselines by 16.2, 16.3, and 3.9 absolute success-rate points on ALFWorld, WebShop, and tau2-bench; CliffCompaction cuts cost by up to 50% with a truncate-or-drop-only compaction strategy that never rewrites content, letting Kimi K2.6 match Opus 4.7; Taste-Bench shows the strongest frontier model gets only 59.7% of long-horizon decision forks right, and more reasoning budget doesn't help"
series:
  name: "AI Agent Arxiv Digest"
  order: 124
---

> 🌏 [中文版](/posts/daily/2026-09-25-ai-agent-arxiv-digest)

## Today's Overview

A long-horizon agent has more judgment calls to make than you'd think. Today's three papers each target one: JitMem argues memory shouldn't be decided at write time at all — curation should wait until read time, when the actual task is known. CliffCompaction shows that once the context budget runs out, truncating or dropping content is cheaper and more accurate than summarizing it, letting Kimi K2.6 match Opus 4.7's performance. Taste-Bench then punctures a common assumption from the evaluation side — even when memory and context are both managed well, the strongest frontier models still pick the right direction at a decision fork only 59.7% of the time, and throwing more reasoning budget at the problem doesn't help. At least seven or eight other papers landed the same day fighting the same battle over how to manage long-horizon agent memory, which suggests this is a problem the field is converging on right now — but the three picks here differ in evidence maturity: CliffCompaction comes with multiple public benchmarks, several production models, and open-source code, while JitMem and Taste-Bench are still confined to their own constructed or curated evaluation settings.

## Terms Worth Knowing Before Reading

| Term | Plain explanation |
|---|---|
| Agent | An AI system that plans its own steps, calls tools, and iterates toward a goal — not a one-shot chatbot |
| Long-Horizon Task | A task that takes many steps and accumulates a large interaction history along the way, where memory and context management become the main bottleneck |
| Compaction | The technique of shrinking accumulated context once it approaches what a model can handle, typically by summarizing or truncating it |
| Write-time vs. read-time curation | When a memory system decides what's worth keeping: write-time curation fixes a summary the moment a task finishes; read-time curation defers that decision until the memory is actually needed, generating it based on the current task |
| Decision Fork | A point in a trajectory where multiple directions are available and one clearly leads to a better outcome — a way to measure an agent's judgment rather than just its end-to-end success rate |
| Distillation | Transferring judgment from a "teacher" model that has seen the outcome to a "student" model that hasn't, so the student can make better decisions on new tasks |

---

## Paper 1｜JitMem: Memory shouldn't be decided at write time — wait until you see the task

**Just-in-Time Memory: Learning to Curate Task-Adaptive Memory for LLM Agents**
Yefan Zhou, Yang Li, Zeyu Leo Liu et al. (Salesforce AI Research) · arxiv: 2609.27334

Links: [arxiv](https://arxiv.org/abs/2609.27334) · [alphaxiv](https://www.alphaxiv.org/abs/2609.27334)

### TL;DR

By deferring memory curation from write time to read time and letting a curator generate a task-specific summary on the fly, JitMem beats the strongest baselines by 16.2, 16.3, and 3.9 absolute success-rate points on ALFWorld, WebShop, and tau2-bench respectively — and even an untrained curator already matches or beats existing baselines just from the architectural shift to read-time generation.

### Editorial Judgment

| Aspect | Assessment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed, primary category cs.AI, submitted 2026-09-23) |
| Citation velocity | Not obtained (Semantic Scholar has been rate-limited with 429s throughout this run); published 2 days ago, no citation data yet |
| Institution | Salesforce AI Research |
| Community signal | Has a HuggingFace Daily Papers page; indexed on Papers with Code |
| Credibility | Pass — the body includes full comparisons and ablations across three standard agent simulation benchmarks (ALFWorld, WebShop, tau2-bench) |
| Evidence maturity | Preliminary — the core results are complete and consistent, but validated only in three simulated environments, not in production traffic or non-simulated tasks |
| Reproducibility | Partial artifacts — method, prompts, and hyperparameters are in the appendix, but no public code repository was found |
| Why this paper | Direct — it reframes "when should you decide what's worth remembering" as an architectural-level question for memory curation |
| Novelty | Substantive — shifts curation from "fixed at write time" to "generated dynamically at read time," trained directly on task success via GRPO |
| Today's importance | High — appears alongside at least seven other papers on the same topic the same day, suggesting this is a problem the field is converging on |
| Practical link | Clear — any memory architecture that "writes a summary first, uses it later" can be directly compared against this framework |
| Editorial confidence | Medium — all three benchmarks are simulated environments, lacking production-environment or cross-model external replication |
| Reading recommendation | Must-read — engineers designing long-horizon agent memory architectures |
| Main limitation | The retriever is a simple BM25, which may become a bottleneck as the memory bank grows large and diverse; the curator adds one extra LLM call per task, increasing latency and cost |

### Background

Most existing agentic memory systems distill a trajectory into a fixed artifact — a reflection, workflow, skill, or reasoning strategy — the moment a task finishes, then retrieve it later by similarity. The problem is the system has to decide what's worth keeping before it knows what future queries will look like; get that decision wrong and the information is gone for good. Training such a "write-time curator" is also hard, because the value of a write decision often only becomes visible several tasks later, creating a long-horizon credit-assignment problem.

### Mid-Level Walkthrough

- **The problem**: Imagine an agent that just finished a food-ordering task and condenses the whole episode into "confirm the address before ordering," storing it in memory. Three tasks later, it hits a return-item scenario where that summary is useless — because at write time, nobody knew what future problems would look like, so the summary could only be a "generic enough" compromise.
- **The method**: JitMem keeps raw trajectories without summarizing them at write time. When a new task arrives, BM25 retrieves the most relevant raw trajectories, and a memory curator reads the current task alongside those trajectories to generate a compact summary tailored specifically to that task, on the spot. Because this payload is consumed by the same task immediately, the curator can be trained directly on task success (via GRPO reinforcement learning), avoiding the need to artificially group related tasks together to manufacture a delayed reward signal, as write-time curation requires.
- **Why it matters**: For teams designing memory architectures, this shows that "when to decide what's worth remembering" is itself an independently optimizable design choice — not something that has to be settled at write time by default.

### Deep Dive

- Evaluated comprehensively across three standard agent simulation benchmarks: ALFWorld, WebShop, and tau2-bench
- Beats the strongest write-time curation baseline by 16.2, 16.3, and 3.9 absolute success-rate points, respectively
- Even without training the curator (zero-shot), the architectural shift to read-time generation alone already matches or exceeds trained write-time baselines, showing the gain comes mainly from *when* curation happens, not just from training
- Training the curator (GRPO) compounds the improvement further
- Adoption threshold: requires a storage architecture that preserves raw trajectories (no write-time summarization) plus an extra curator LLM call — meaning one more inference round-trip of latency and cost per task
- Limitation (self-reported): the retriever (BM25) is simple and may become a bottleneck as the memory bank grows; the curator adds an extra LLM call per task; the payload format is fixed and hand-designed per benchmark

### Reviewer's One-Line Take

Moving "when to curate memory" from write time to read time is a clean, testable architectural claim, and the consistent gains across three benchmarks support it; but every comparison is against relatively simple existing baselines, so whether the advantage holds against more sophisticated production-grade write-time memory systems (ones with active consolidation and deduplication) is still an open question.

### Take-aways for You

- If you're designing an agent's long-term memory architecture: check whether your current system discards raw information the moment it's written — JitMem's experiments show that simply preserving raw data and deferring summarization to read time already yields a significant gain, even before you invest in training a curator
- If you're evaluating someone else's memory-system performance claims: ask whether the comparison baseline is write-time or read-time curation — the two may simply have different performance ceilings

---

## Paper 2｜CliffCompaction: When the context budget runs out, truncating beats summarizing

**CliffCompaction: Cost-Efficient Compaction for Long-Horizon Coding Agents**
Trang Nguyen, Eulrang Cho, Bingqing Chen, Tim Dettmers (Carnegie Mellon University + Bosch Center for AI) · arxiv: 2609.26779

Links: [arxiv](https://arxiv.org/abs/2609.26779) · [alphaxiv](https://www.alphaxiv.org/abs/2609.26779)

### TL;DR

CliffCompaction, an autocompaction technique that only truncates or drops content and never rewrites it, cuts cost by up to 50% under a bounded context budget while maintaining or improving Terminal-Bench performance and reaching state-of-the-art results on KernelBench; combined with parallel test-time scaling, it lets Kimi K2.6 match Opus 4.7 and beat Opus 4.6 and GPT-5.3 Codex at lower cost.

### Editorial Judgment

| Aspect | Assessment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed, primary category cs.AI, cross-listed to cs.LG/cs.SE, submitted 2026-09-22) |
| Citation velocity | Retrieved from Semantic Scholar — citationCount 0 (published 2 days ago, no citations yet) |
| Institution | Carnegie Mellon University + Bosch Center for AI |
| Community signal | Not featured on HuggingFace Daily Papers; promoted directly by the author on X/Twitter and picked up by third-party tool-tracking sites (ai-tldr.dev, jjakimoto/research-issues) |
| Credibility | Pass — the body has concrete numbers across three public benchmarks (SWE-bench Verified, Terminal-Bench 2.0, KernelBench) and direct comparisons against several production models |
| Evidence maturity | Substantial — covers multiple scaffolds (Claude Code, Codex, OpenHands), multiple models, and ablations, and explicitly states in a Limitations section when the method doesn't help |
| Reproducibility | Full artifacts — open-sourced a scaffold-agnostic API-proxy implementation on GitHub |
| Why this paper | Direct — it directly answers "what do you drop when the context budget runs out," a fundamental engineering problem for long-horizon agents |
| Novelty | Adaptation — the core idea of "only delete, never rewrite" isn't entirely new, but turning it into a production-grade tool that plugs into any harness and validating it systematically is this paper's contribution |
| Today's importance | High — the author is Tim Dettmers, known for QLoRA/bitsandbytes, and the tool already works with Claude Code and Codex |
| Practical link | Clear — the open-source API-proxy can be plugged directly into existing coding agents without rewriting agent logic |
| Editorial confidence | High — multiple benchmarks, multiple models, and open-source code support the claim (conservative truncation beats summarization-based compaction) |
| Reading recommendation | Must-read — any team running production coding agents or long-horizon harnesses |
| Main limitation | The benefit depends on the scaffold and task complexity — fixed components like system prompts and tool definitions eat into the budget first, and different scaffolds need different minimum thresholds; the paper doesn't compare against methods that train the model to manage its own context or maintain an external memory store, which the authors attribute to resource constraints rather than a deliberate exclusion |

### Background

Coding agents often work with contexts spanning millions of tokens, and once that exceeds the model's context window, the agent has to compact history or start a new session. Existing approaches mostly rely on summarizing or rewriting old content to fit the budget, but summaries lose detail and rewrites can introduce content that no longer matches the original facts — and over time this accumulation can cause an agent to drift off track (context drift).

### Mid-Level Walkthrough

- **The problem**: Imagine a coding agent that has already run up 500,000 tokens of tool calls and file contents, approaching the context window limit. The usual approach is to have another LLM summarize all of it down to a few thousand words — but a summary inevitably drops details, and if you later have to summarize an already-summarized summary again, the error snowballs.
- **The method**: CliffCompaction does the opposite — it only truncates or drops content during compaction, never rewriting or re-summarizing, so every piece of text that survives stays exactly faithful to the original. It also "never compacts a compaction": every pass operates only on the original content, and the previous pass's compacted output is discarded, preventing compaction error from accumulating across rounds. This is wrapped into a scaffold-agnostic API-proxy that plugs directly into existing harnesses like Claude Code and Codex without modifying the agent's own code.
- **Why it matters**: For any team running long-horizon coding agents, this shows that managing the context budget doesn't necessarily require a smarter summarization model — sometimes a "conservative but faithful" truncation strategy is more reliable and cheaper than a "clever but potentially lossy" summary.

### Deep Dive

- On SWE-bench Verified, CliffCompaction lets GLM-5.1 and Kimi K2.6 preserve full-context success rates at context thresholds of only 32K and 16K tokens respectively
- On Terminal-Bench 2.0, it achieves a higher success rate while cutting cost by 50%
- Under parallel test-time scaling, CliffCompaction lets Kimi K2.6 match Opus 4.7's performance and beat Opus 4.6 and GPT-5.3 Codex at lower cost; on Terminal-Bench it adds over 10 percentage points of success rate for less than the cost of two full-context runs
- On KernelBench, it sustains continual learning across sessions exceeding a million tokens: CUDA kernel speedups reach 2.23x after 200 steps and 3.58x after 400 steps, surpassing specialized search algorithms and trained specialist agents ⚠️ (the authors' own tests, not yet externally replicated)
- Adoption threshold: the authors have open-sourced a scaffold-agnostic API-proxy implementation that plugs directly into existing harnesses like Claude Code and Codex without rewriting agent logic
- Limitation (self-reported): the benefit varies by scaffold and task complexity, with fixed components like system prompts and tool definitions consuming part of the budget first, so different scaffolds need different minimum thresholds; the benefit is meaningful only for medium-to-long-horizon tasks; the comparison is limited to methods that act on conversation history at inference time, excluding methods that train the model to manage its own context or maintain an external memory store

### Reviewer's One-Line Take

"Only delete, never rewrite, and never compact a compaction" is a design principle simple to the point of being conservative, but the authors back it with direct comparisons against several production-grade models across three public benchmarks (SWE-bench Verified, Terminal-Bench 2.0, KernelBench), solidly demonstrating that this conservative strategy outperforms more elaborate summarization-based compaction — and it's already open-sourced to plug straight into existing harnesses. What remains to be seen is whether the same advantage holds for lightweight scaffolds where the system prompt and tool definitions alone already consume most of the budget.

### Take-aways for You

- If you run long-horizon coding agents that hit the context limit: try CliffCompaction's open-source proxy directly, especially if you're currently using summarization-based compaction — the results here show "only delete, never rewrite" is cheaper across multiple benchmarks
- If you're designing your own compaction strategy: remember the rule "never compact a compaction" — operating each round only on original content avoids compounding compaction error across rounds

---

## Paper 3｜Taste-Bench: The strongest frontier model only picks the right fork 60% of the time

**The Tasteful Agent: Measuring and Improving Taste in Long-Horizon Tasks**
Wenbo Pan, Zhichao Liu, Shujie Liu et al. (Microsoft) · arxiv: 2609.25804

Links: [arxiv](https://arxiv.org/abs/2609.25804) · [alphaxiv](https://www.alphaxiv.org/abs/2609.25804)

### TL;DR

Taste-Bench mines 502 decision forks from real agent execution logs to test whether an agent can pick the right direction before the outcome is visible; the strongest frontier model gets only 59.7% right, and more reasoning budget doesn't help — but distilling the judgment of a teacher model that has seen the outcome into a student model improves the student's judgment on unseen tasks, and also lifts end-to-end success on held-out SWE-bench Pro tasks.

### Editorial Judgment

| Aspect | Assessment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed, primary category cs.AI, submitted 2026-09-21) |
| Citation velocity | Not obtained (Semantic Scholar has been rate-limited with 429s throughout this run); published 4 days ago, no citation data yet |
| Institution | Microsoft |
| Community signal | 117 upvotes on HuggingFace Daily Papers (featured 2026-09-23); open-sourced on GitHub, 2 stars (just released) |
| Credibility | Pass — the 502 fork questions are mined from real agent execution logs, with human review verifying the construction process, and a full reproducibility statement |
| Evidence maturity | Preliminary — the claim is scoped to "forks mined from trajectories with already-known outcomes," and hasn't yet been validated on real-time decisions for entirely unknown tasks |
| Reproducibility | Full artifacts — the benchmark is released on HuggingFace Datasets, with evaluation code and every evaluated model's results released on GitHub |
| Why this paper | Indirect — it doesn't propose a new architecture, but exposes a blind spot in current agent evaluation: nobody measures "picking the right direction" in isolation |
| Novelty | Substantive — the first to isolate "taste" (judgment) from end-to-end success rate as its own measurable capability, and shows it can be distilled |
| Today's importance | High — the strongest model gets only 59.7% right, and "more reasoning budget doesn't help" directly challenges the assumption that throwing more compute at a problem makes it better |
| Practical link | Speculative — useful as an evaluation reference for teams building research- or engineering-oriented agent platforms, but no production case study has surfaced yet |
| Editorial confidence | Medium — the claim itself has clear supporting evidence, but the entire benchmark is built from trajectories the authors collected themselves, and external replication hasn't happened yet |
| Reading recommendation | Must-read — teams building agent evaluation or research-oriented agents; skim — general developers |
| Main limitation | The paper has no standalone "Limitations" section; every fork comes from two trajectory pools the authors collected themselves, so training and test data share some provenance, and replication by outside tasks or other labs hasn't happened yet |

### Background

Most existing long-horizon agent benchmarks only look at the end-to-end metric of "did it succeed in the end," with nobody separately measuring an agent's judgment at each "which direction should I take" moment along the way — but a long-horizon task is often made up of a chain of exactly these forks, and getting just one wrong can decide the whole outcome, while an end-to-end success rate can't tell you which fork was the problem.

### Mid-Level Walkthrough

- **The problem**: Imagine two engineers given the same debugging task, both making most of the right calls along the way, but at one critical moment one chooses to keep digging into a hypothesis while the other switches to a different diagnostic approach — the one who chose right succeeds, the one who chose wrong ultimately fails. In hindsight the correct choice is obvious, but at the moment of deciding, both directions looked reasonable.
- **The method**: Taste-Bench mines these forks retroactively from completed, outcome-known real agent execution logs — one type comes from two attempts at the same task, one passing and one failing, taking the step where they diverge; another comes from within a single trajectory, where the agent first takes a direction it later abandons before switching to another that succeeds (a "detour"). After mining a fork, the trajectory before it becomes the question and the two directions become the options, and the model being tested picks one without knowing the outcome — the correct answer is whichever direction actually led to success.
- **Why it matters**: This means "exactly where is an agent's judgment falling short" can now be measured in isolation, instead of only being guessed at retroactively from a single end-to-end failure — a new diagnostic tool for teams that want to improve agent judgment in a targeted way.

### Deep Dive

- 502 fork questions, drawn from 2,677 graded engineering trajectories from SWE-bench Pro (517 tasks across 11 repositories) and 1,132 publicly released research trajectories from METR's MALT (subsets of RE-Bench and HCAST)
- The strongest frontier model currently answers only 59.7% of the questions correctly
- When a fork's deciding evidence appears later in the trajectory, every tested model's accuracy drops noticeably
- A larger reasoning budget does not improve accuracy ⚠️ (the authors' own tests, not yet externally replicated)
- Distilling the judgment of a teacher model that has seen the outcome into a student model improves the student's judgment on unseen tasks; injecting that judgment as advice into the agent also raises end-to-end success on held-out SWE-bench Pro tasks
- Adoption threshold: the benchmark, evaluation code, and every evaluated model's results are fully released, but constructing the forks relies heavily on the authors' own collected agent execution pool — applying it to other task types or scaffolds requires remining forks from scratch
- Limitation: the paper has no standalone "Limitations" section; every fork comes from two trajectory pools the authors collected themselves (a SWE-bench Pro subset and METR's MALT), so training and test data share some provenance to some degree

### Reviewer's One-Line Take

Isolating an agent's "judgment" from its end-to-end success rate is a rare but sharply targeted angle in current evaluation methodology, and the finding that "more compute doesn't help" directly challenges a common assumption; but the entire benchmark is built on trajectory pools the authors collected themselves, with training and test data sharing some provenance, so independent replication across tasks and labs still has a way to go.

### Take-aways for You

- If you're evaluating a research- or engineering-oriented agent platform: separate "judgment" from "end-to-end success rate" — Taste-Bench's fork-construction methods (comparing two attempts at the same task, detecting detours within a single trajectory) can be directly borrowed to build a similar diagnostic tool
- If you're responsible for improving an agent's long-horizon performance: don't assume that a larger reasoning budget will fix poor judgment — this paper shows the two may be unrelated, and distillation training on judgment is the direction this paper actually validates

---

## What I Learned Today

I used to think the performance bottleneck for long-horizon agents was mainly "not enough memory capacity" or "not enough context budget"; today I found the real scarcity is three more fundamental judgment calls — when to decide what's worth remembering (JitMem defers it to read time), what to cut when the budget runs out (CliffCompaction chooses to only delete, never rewrite, and never compact a compaction), and which direction to take at a fork (Taste-Bench shows even frontier models only get it right 60% of the time, and more compute doesn't help). At least seven or eight papers landed the same day fighting the same battle over how to manage agent memory — which means this isn't just one team's preference, but a core problem the entire field is converging on right now.

## References

- [Just-in-Time Memory: Learning to Curate Task-Adaptive Memory for LLM Agents](https://arxiv.org/abs/2609.27334)
- [JitMem — alphaxiv](https://www.alphaxiv.org/abs/2609.27334)
- [JitMem — Papers with Code](https://paperswithcode.co/paper/2609.27334)
- [CliffCompaction: Cost-Efficient Compaction for Long-Horizon Coding Agents](https://arxiv.org/abs/2609.26779)
- [CliffCompaction — alphaxiv](https://www.alphaxiv.org/abs/2609.26779)
- [CliffCompaction — code](https://github.com/nguyenvuthientrang/cliffcompaction)
- [The Tasteful Agent: Measuring and Improving Taste in Long-Horizon Tasks](https://arxiv.org/abs/2609.25804)
- [Taste-Bench — alphaxiv](https://www.alphaxiv.org/abs/2609.25804)
- [Taste-Bench — dataset](https://huggingface.co/datasets/wenbopan/taste-bench)
- [Taste-Bench — code](https://github.com/wbopan/tastebench)
- [arXiv cs.AI new listings](https://arxiv.org/list/cs.AI/new)
- [HuggingFace Daily Papers](https://huggingface.co/papers)
