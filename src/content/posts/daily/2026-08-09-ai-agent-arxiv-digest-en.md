---
title: "AI Agent Arxiv Digest — 2026-08-09"
date: 2026-08-09
category: daily
tags: [ai-agent, arxiv, daily, agent-harness, long-horizon, agent-evaluation]
lang: en
description: "Three papers converge on the same insight — what really holds back long-horizon agents isn't the model, it's the harness: OneDayAgent shows a single unified harness achieves cross-backend SOTA, Horizon Gap maps the structural roots of long-horizon failure across 1,547 papers, and Evo-Bench asks whether agents can evolve their own harnesses"
tldr: "OneDayAgent's decompose-remember-verify harness hits 0.821 new SOTA on AgentIF-OneDay and works unchanged across five backends; The Horizon Gap surveys 1,547 papers to find that six categories of long-horizon failure share a single structural pattern — outcome-only signals degrade as step count grows, driving the field toward denser process signals; Evo-Bench is the first benchmark for harness self-evolution — GPT-5.6 Sol peaks at +16.6 absolute gain, but Office tasks still need hand-crafted workflows"
series:
  name: "AI Agent Arxiv Digest"
  order: 77
---

> 🌏 [中文版](/posts/daily/2026-08-09-ai-agent-arxiv-digest)

## Overview

Three papers this weekend independently point to the same signal: model capability is no longer the bottleneck for long-horizon agents — the harness is. OneDayAgent achieves new SOTA on a single unified "decompose → remember → verify-and-fix" harness across five backend models, demonstrating that harness generalization can be decoupled from model choice. The Horizon Gap surveys 1,547 papers and paints the full picture — long-horizon failures across all six categories (planning through safety) hit the same structural wall: outcome-only signals degrade as step count grows. Evo-Bench pushes this observation to its logical extreme: if harnesses matter this much, can agents evolve their own? The answer is "in some domains yes, but not all." The combined message is clear: in H2 2026, agent competitiveness lives in harness engineering, not in swapping in a bigger model.

## Key Terms

| Term | Plain-language explanation |
|---|---|
| Harness / Scaffold | The control program wrapping the LLM — handles task decomposition, memory management, tool calls, and error recovery; excludes the model itself |
| Long-horizon task | A task requiring tens to hundreds of steps, during which context accumulates, tools change, and goals drift |
| Process signal | Feedback given *during* execution (e.g. per-step rewards), as opposed to outcome signals that only evaluate the final result |
| Execution memory | Compressed state the harness passes between subtasks so later steps know what earlier ones did, without carrying the full conversation log |
| Harness evolution | The agent modifying its own control program (prompts, tools, loop structure) to improve performance, without changing the underlying model |

---

## Paper 1 | OneDayAgent: One Harness to Rule Them All

### OneDayAgent: Towards a Long-Horizon Harness for Autonomous Agents
Jingsheng Zheng, Xinyuan Fang, Jintian Zhang et al. (Zhejiang University)　·　arxiv: 2608.05013

Links: [arxiv](https://arxiv.org/abs/2608.05013) · [alphaxiv](https://www.alphaxiv.org/abs/2608.05013)

### TL;DR

A unified harness (task decomposition + execution memory + global verify-and-fix) achieves 0.821 new SOTA on AgentIF-OneDay's 104 daily tasks with a GLM-5.2 backend, and runs unchanged across five backend models.

### Read Priority

Must-read — if you're designing an agent execution framework, this paper delivers a complete, reproducible "decompose → remember → verify-and-fix" three-stage harness blueprint, and it's open-sourced.

### Background

Long-horizon agents face three interacting failure modes: goal drift (forgetting early requirements as execution proceeds), state loss (intermediate results vanishing during tool or environment switches), and context overflow (conversations exceeding the model's window). Previous approaches mostly tackled these individually — adding a reasoning scaffold here, a feedback loop there — but these patches remained siloed. No one had verified whether a single unified harness could handle all three simultaneously, let alone whether that same harness could generalize across backend models.

### Intermediate-Level Walkthrough

- **Problem**: Imagine asking an agent to spend a full day on a complex task spanning web search, coding, and document editing. By step 50, it has forgotten a key data point found at step 3 and dropped the formatting requirements from the original brief.
- **Approach**: OneDayAgent splits execution into three stages — (1) decompose the large task into bounded subtasks, each with a local objective; (2) pass compressed execution memory between subtasks instead of carrying the full conversation log; (3) after all subtasks finish, a global verifier checks the final deliverable against the original requirements, entering a targeted repair loop for any gaps found.
- **Why it matters**: Empirical evidence for harness generalization. The same harness runs stably across GLM-5.2, GPT-5.5 (Codex), and three other backends, while different backends exhibit different execution styles (latency, tool-call volume, repair rate) under the same harness — demonstrating that harness and model capabilities can be orthogonally separated.

### Deep Dive

- AgentIF-OneDay, 104 tasks, GLM-5.2 backend: overall score 0.821, leading across all task types, domains, and scoring dimensions ⚠️ (self-evaluated by ZJU + Zhipu; awaiting independent replication)
- Previous best: Codex (GPT-5.5 medium) at 0.799
- Five backend models from three model families; harness requires zero backend-specific tuning
- Ablation shows all three capabilities contribute independently; removing the verify-and-fix module causes the largest drop
- Deployment threshold: requires a sufficiently large context window to support subtask execution memory; open-sourced
- Limitation: validated on a single benchmark (AgentIF-OneDay) only; no cross-benchmark generalization evidence

### Reviewer's One-Line Take

Architecture is clean and reproducible; the empirical evidence for "harness generalization across backends" is valuable. But SOTA on a single benchmark has limited explanatory power — whether AgentIF-OneDay's task distribution represents real-world long-horizon workloads needs further validation.

### Your Take-Away

- If you're building an agent platform: directly reference the "decompose → remember → verify-and-fix" three-stage architecture, especially the "subtask boundary = context compression point" design — that's the most actionable engineering decision
- If you're choosing an agent backend model: this paper suggests the marginal ROI of harness quality may exceed that of model upgrades — invest in harness first, then consider upgrading the model

---

## Paper 2 | The Horizon Gap: A 1,547-Paper Panorama of Long-Horizon Agents

### The Horizon Gap: Planning, Memory, Execution, Training, and Evaluation for Long-Horizon LLM Agents
Mingguang Chen, Licheng Wang, Bo Qu　·　arxiv: 2608.06663

Links: [arxiv](https://arxiv.org/abs/2608.06663) · [alphaxiv](https://www.alphaxiv.org/abs/2608.06663)

### TL;DR

A survey of 1,547 papers from 2024–2026 reveals that long-horizon agent failures across all six categories — from planning to safety — hit the same structural problem: outcome-only signals degrade as step count grows, and the field's unified response is to manufacture denser process signals.

### Read Priority

Must-read — this is the most comprehensive long-horizon agent survey to date, covering planning, memory, execution, training, evaluation, and safety across 39 pages. Use it to calibrate your mental map of the field.

### Background

"Long-horizon," "long-context," and "long-term memory" are three independent dimensions — how many steps the task takes, how many tokens the model can see, and whether the system retains information across sessions — but the literature frequently conflates them. Previous surveys typically covered only one dimension (e.g. RAG memory or planning alone), without stitching the full lifecycle together.

### Intermediate-Level Walkthrough

- **Problem**: Why do agents excel at short tasks but collapse when stretched? Is it that models aren't powerful enough, or that some structural component of the entire system is failing?
- **Approach**: Eight search threads systematically collected 1,547 papers, filtered through two stages (excluding 26.8% off-topic papers), classified by task lifecycle into six categories (planning, memory, execution control, training, evaluation, foundations/safety), then cross-cut with a "where does the horizon live" dimension (in-context, in-harness, cross-session).
- **Why it matters**: Reveals a unified pattern across categories — whether it's process reward models, credit assignment, or trajectory diagnostics, the field's response is consistently to manufacture denser step-level signals to replace failing outcome signals. This is not coincidence; it's a structural requirement of long-horizon systems.

### Deep Dive

- Corpus of 1,547 papers spanning 2024–2026; 72% of memory/context management papers were published in 2026 — indicating this direction is exploding
- Six categories: planning (182), memory (397), execution control (584), training (167), evaluation, foundations/safety
- Core finding: "outcome signals degrade with horizon length" is a cross-category unified pattern
- Three open measurement questions: (1) how to separate model capability vs. harness capability, (2) correlation bias when process signals are used for both training and evaluation, (3) whether long-horizon reliability admits a general predictive theory
- Limitation: 26.8% bleed filter in corpus collection; some boundary areas may have been excluded

### Reviewer's One-Line Take

Exceptionally broad coverage with transparent methodology (the bleed filter ratio is disclosed). The "cross-category unified pattern" observation is genuinely illuminating. But at 39 pages, depth is necessarily limited — specialists in each subfield may feel their area was oversimplified.

### Your Take-Away

- If you're designing agent evaluation: watch for the correlation bias of using process signals for both training and evaluation — the signal you use to teach the agent shouldn't be the same one you use to judge it
- If you're doing long-horizon agent research: read this paper's classification framework first and locate which quadrant your work falls in — avoid piling onto the 584-paper execution control direction while neglecting the less-explored foundations/safety dimension

---

## Paper 3 | Evo-Bench: Can Agents Evolve Their Own Harness?

### Evo-Bench: Can Language Models Improve Agent Harness?
Lisheng Huang, Chen Yang, Hao Zhou et al. (Renmin University / BOSS Zhipin)　·　arxiv: 2608.09096

Links: [arxiv](https://arxiv.org/abs/2608.09096) · [alphaxiv](https://www.alphaxiv.org/abs/2608.09096)

### TL;DR

The first benchmark specifically measuring LLMs' ability to automatically evolve harnesses. Among nine frontier models, GPT-5.6 Sol achieves the highest absolute gain of +16.6, but Office tasks require highly specific workflows and automated evolution still can't beat hand-crafted designs.

### Read Priority

Must-read — directly answers the industry's most pressing question, "can models replace harness engineers?" The answer is "partially yes, partially no" — and where exactly that boundary falls is worth thinking about for every agent team.

### Background

Agent benchmarks have always measured a model's ability to solve tasks, but the harness itself — prompt design, tool selection, loop structure — has been treated as a fixed given. With the emergence of meta-harness and AutoHarness work, "agents modifying their own harness" has become a new frontier, but there was no standardized evaluation to isolate harness improvement from model strength.

### Intermediate-Level Walkthrough

- **Problem**: If you let an LLM modify its own execution framework (prompts, tools, loop logic), can it make itself better? Or is it just overfitting to specific tasks?
- **Approach**: Evo-Bench uses a clever "harness-guided construction" framework — first using auxiliary tasks to identify tasks that are genuinely sensitive to harness changes (filtering out tasks where "score stays the same no matter how you change the harness"), then splitting by sensitivity levels to ensure generalization. Tests nine models across Search, Office, and General domains.
- **Why it matters**: Reveals the boundary conditions of harness evolution — Search task gains are massive (+32.8), General tasks can even surpass hand-crafted designs, but Office tasks (requiring highly specific processing workflows) show almost no gain. This tells you which harness work can be delegated to AI and which still needs humans.

### Deep Dive

- GPT-5.6 Sol: Overall +16.6 (Search +32.8, Office +3.2, General +11.0)
- Claude Opus 4.8: Overall +16.1 (Search +34.8, Office +1.3, General +7.9); highest Search score of 46.5 across all models ⚠️ (self-evaluated by RUC/BOSS Zhipin; awaiting independent replication)
- Artificial Harness baseline (hand-crafted): Overall 47.5; GPT-5.6 Sol's 46.3 is approaching parity
- Key findings: (1) early saturation — models find high-quality structures in the first few rounds; further modifications are counterproductive; (2) evolved harnesses are highly transferable reasoning structures — a harness evolved by model A can directly boost model B; (3) Office task gains approach zero
- Open-source 27B model Qwen3.6-27B ranks 6th, Overall 39.4 (+9.7), outperforming several frontier models
- Limitation: only three domains tested; real-world harness evolution may face additional safety and stability challenges

### Reviewer's One-Line Take

Benchmark design is elegant; the "sensitivity-stratified split" solves a core methodological problem in harness evaluation. But the "early saturation" phenomenon deserves deeper investigation — did the model truly find optimal structure, or is it a limitation of the search strategy?

### Your Take-Away

- If you're building an agent framework product: Search and general-purpose harnesses can be candidates for AI-driven auto-tuning, but Office/structured-workflow harnesses still need manual design — that's where your moat lies
- If you're doing agent evaluation research: Evo-Bench's "sensitivity filtering" methodology is worth borrowing directly — it solves the fundamental problem of "tasks unaffected by harness changes shouldn't be in the benchmark"

---

## Today's Takeaway

I used to think "agents can't handle long tasks" was a model capability problem — just swap in a stronger model. Today's three papers together made me realize the real bottleneck is harness engineering: OneDayAgent proves the same harness works across five backends, Horizon Gap shows the entire field is manufacturing better signals for harnesses, and Evo-Bench draws the boundary between harness problems AI can solve automatically and those it can't. The model is the engine; the harness is the steering wheel.

## References

- [arxiv:2608.05013](https://arxiv.org/abs/2608.05013)
- [arxiv:2608.06663](https://arxiv.org/abs/2608.06663)
- [arxiv:2608.09096](https://arxiv.org/abs/2608.09096)
