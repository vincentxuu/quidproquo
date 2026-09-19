---
title: "AI Agent Arxiv Digest — 2026-09-19"
date: 2026-09-19
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's three papers answer the same question from three angles: what actually determines coding-agent performance — the model, or the harness wrapped around it? The answer is the harness, and every component's value turns out to be conditional"
tldr: "176 matched settings show context management matters more as the budget tightens, and planning shifts from an accuracy scaffold for weak models to a cost-saver for strong ones; NVIDIA/MIT's SoL-Pi treats the harness itself as a research object for recursive auto-optimization, cutting 44.7-49.0% of token traffic and about a third of API cost; a placebo-controlled experiment shows written planning guidance lifts tau-squared-bench success by 7.17 points, while a read-only verifier blocks 61% of false-pass episodes for under a cent"
series:
  name: "AI Agent Arxiv Digest"
  order: 118
---

> 🌏 [中文版](/posts/daily/2026-09-19-ai-agent-arxiv-digest)

## Today's Overview

Today's three independent papers converge on the same question: is coding-agent performance actually determined by the model, or by the "harness" wrapped around it? The first paper decomposes the harness into three components — planning, action space, and context management — across 176 matched settings, and shows their value is entirely conditional: context management becomes lifesaving as the budget tightens, planning is an accuracy crutch for weak models but just a cost-saver for strong ones, and a predefined tool set helps weak models while a bare shell interface is actually cheaper and better for strong ones. The second, from a team spanning NVIDIA, NTU, and MIT, treats the harness itself as an object for recursive auto-research, running automated search loops to discover four mechanisms that transfer reliably, cutting token traffic by 44.7-49.0% and API cost by roughly a third — with full code released. The third isolates the effect of "planning guidance" from the confound of "having something to read at all" using a placebo (Sham) control, showing that a properly written task-specific plan does lift tau-squared-bench success by 7 percentage points, while a read-only verifier blocks six in ten false-pass episodes for under a cent. All three clear a real credibility bar (176 matched settings with McNemar significance tests; released code plus concrete dollar-cost numbers; a placebo control with bootstrap confidence intervals), but each keeps its claim narrow to "what this component is worth under these conditions" — none claims that this design makes agents universally stronger.

## Terms Worth Knowing Before Reading

| Term | Plain-language explanation |
|---|---|
| Harness / Scaffold | The code framework wrapped around a model — whether it writes a plan first, which tools it can call, how it manages conversation history — that determines whether a model's raw capability actually turns into task performance |
| Context management (elision / summarization) | The mechanism that trims or summarizes old conversation history before the context window overflows; today's first paper shows most of its value comes simply from preventing that overflow |
| tau-squared-bench (τ²-bench) | A benchmark for stateful conversational agents (e.g. customer support, booking) with a user, a policy document, and a verifiable ground-truth outcome, able to distinguish "looks done" from "actually done per policy" |
| Sham control (placebo control) | A control condition where the real planning text is word-shuffled into the same length but stripped of meaning, used to isolate whether the plan's *content* matters or whether merely "having something to read" is doing the work |
| Erroneous acceptance / false pass | When an agent or its harness marks a task as "complete" even though it did not actually satisfy the stated rules or policy |
| RSI (Recursive Self-Improvement) | A loop where a system uses its own outputs to improve the next version of itself; today's second paper applies this idea to the harness layer rather than to model weights |

---

## Paper One | The Harness Isn't One Monolith: Each Component's Value Is Conditional

**An Empirical Study of Harness Design for Coding Agents**
Run-Ze Fan, Zihao Zhang, Simin Ma et al. (UMass Amherst / Emory University / UNC Charlotte, with parts of the work done during internships at Zoom Video Communications) · arxiv: 2609.20804

Links: [arxiv](https://arxiv.org/abs/2609.20804) · [alphaxiv](https://www.alphaxiv.org/abs/2609.20804)

### TL;DR

With the execution loop fixed and only planning, action space, and context management varied, across 4 models and 2 long-horizon coding benchmarks the team runs 176 matched settings: context management's value explodes as the budget tightens (Nemotron-3 120B at a 32K budget jumps from 11.40% to 43.00% success once context management is added), and planning is an accuracy scaffold for weak models but only a cost-saver for strong ones.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed; submitted 2026-09-17) |
| Citation velocity | 2 days since submission; Semantic Scholar reports citationCount = 0 (expected for a paper this fresh) |
| Institution | UMass Amherst, Emory University, UNC Charlotte (parts of the work done during internships at Zoom Video Communications) |
| Community signal | HF Daily Papers 2026-09-18 batch, #24 by upvotes (40 upvotes); no Papers with Code entry found |
| Credibility | Pass — 176 matched settings with McNemar significance testing, plus trajectory-level analysis tying each statistical result back to a concrete behavioral mechanism |
| Evidence maturity | Substantial — 4 models (3 Nemotron-3 sizes + Mistral-3.5-128B), 5 context strategies, 4 budgets, with full ablations and significance testing |
| Reproducibility | Partial artifacts — the 43-page paper details methods and settings in full, but no public code or data release was found as of this check |
| Why selected | Direct — the first component-level causal attribution study of a coding harness, rather than treating the harness as a monolithic black box |
| Novelty | Substantive — 176 matched settings demonstrate that harness-component value is conditional, not that any single component is "just better" |
| Today's importance | High — directly maps onto the three decisions engineering teams most often face when designing a coding-agent harness |
| Practical link | Clear — the tabulated "which context strategy under which budget" findings can be applied directly to Claude Code- or Codex-style harness design |
| Editorial confidence | High — 176 results with significance testing and trajectory-level mechanism explanations keep the claim scoped to "this component's effect under these conditions" |
| Reading recommendation | Must-read — for engineering teams designing or selecting a coding-agent harness |
| Primary limitation | Conclusions apply only to the specific component implementations studied (one particular context-management policy, one planning-prompt mechanism); the authors explicitly say they are not identifying a universally optimal harness |

### Background

Coding-harness evaluations have traditionally treated the harness as one monolithic black box — comparing overall success rates between, say, SWE-agent and another system — without asking what happens if you swap out just the planning mechanism or just the context-management strategy. That has left engineering teams copying whole framework designs wholesale, without knowing which component is actually doing the work.

### Mid-Level Walkthrough

- **The problem**: Imagine choosing harness settings for a coding agent — whether to have it write a plan first, whether to give it a fixed tool set or bare shell access, how to handle a conversation that's grown too long. The usual approach is to copy an entire well-known framework's design, without knowing what changes if you swap out one piece.
- **The method**: With the execution loop fixed, the team varies only planning, action space, and context management across 4 models (3 Nemotron-3 sizes plus Mistral-3.5-128B) on SWE-Bench Verified and Terminal-Bench 2.1 — 176 matched settings in total, each compared to its baseline with a McNemar significance test.
- **Why it matters**: The finding isn't "which component is better" but "under what conditions each component has value" — meaning harness design shouldn't have a one-size-fits-all default, but should depend on your model's capability, your context budget, and your task type.

### Key Findings

- At a 32K context budget, Nemotron-3 120B's success rate goes from 11.40% with no context management (T0) to 43.00% once elision is added (T1); Nemotron-3 550B jumps from 6.40% to 51.40% at the same budget — most of the benefit comes from preventing overflow failures, not from summarization quality itself
- Ablating planning (T4 w/o plan) at a 128K budget drops the weakest model, Nemotron-3 30B, from 25.20% to 13.60% success; but the strongest, Nemotron-3 550B, actually rises slightly from 65.80% to 67.80% — planning is a "scaffold" for weak models and a "cost-saver" for strong ones
- Ablating the action space (bash-only) at the same 128K setting drops the bash-weak Nemotron-3 30B to 10.20%, while the bash-capable Nemotron-3 550B rises from 65.80% to 69.40% at lower cost
- Staging rule-based elision before LLM-based summarization (T3/T4) gives the best efficiency in most settings, while making elided content recoverable (T2) adds essentially no accuracy — models rarely actually use the recovery mechanism
- Most contrasts on Terminal-Bench (only 89 tasks) fail to reach statistical significance due to limited power; the authors are explicit that those conclusions rest on directional consistency across models and budgets rather than individually significant cells
- Limitation: the action-space ablation is a bundled interface change (tool count, interface-specific prompts, file-state tracking, and auto-diagnostics all change together), so the effect of tool count alone cannot be isolated

### Reviewer's One-Line Take

176 matched settings combined with trajectory-level mechanism explanations make this one of the few component-level harness studies with real rigor about which component matters under which condition; but the authors' own admissions — a bundled action-space ablation and underpowered Terminal-Bench contrasts — clearly bound the claim, and readers shouldn't extrapolate the 4-model results to other model families.

### Your Take-away

- If you're designing a coding-agent harness: first check how tight your context budget is — the tighter it is, the higher the ROI on context management; assign planning's role by model strength (an accuracy safety net for weak models, a cost-saver for strong ones) rather than copying a fixed default
- If you're designing tools for a weaker model: prefer a structured, predefined tool set over bare shell access — this paper's numbers show models with weak bash proficiency lose significant accuracy when switched to shell-only

---

## Paper Two | Treating the Harness Itself as a Research Object: An NVIDIA/MIT Team Cuts Token Use by Up to 49% via Recursive Automation

**SoL-Pi: Recursively Scaling Auto-Research Loops for Efficient Agent Harness**
Haozhe Liu, Tian Ye, Sensen Gao et al. (NVIDIA / Nanyang Technological University / MIT) · arxiv: 2609.20519

Links: [arxiv](https://arxiv.org/abs/2609.20519) · [alphaxiv](https://www.alphaxiv.org/abs/2609.20519)

### TL;DR

Treating the harness itself as an object for recursive auto-optimization, the team runs automated research loops across numerous diverse environments and selects four mechanisms that transfer reliably (action fusion, online context compaction, observation packing, and an evidence-preserving reducer), matching native Codex/Claude Code-style harness performance on the 51-task public EdgeBench subset while cutting token traffic by 44.7-49.0% and API cost by roughly a third.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed; submitted 2026-09-17) |
| Citation velocity | 2 days since submission; Semantic Scholar reports citationCount = 0 (expected for a paper this fresh) |
| Institution | NVIDIA, Nanyang Technological University, MIT (co-authors include Song Han) |
| Community signal | HF Daily Papers 2026-09-18 batch, #10 by upvotes (53 upvotes); public code (github.com/NVlabs/SoL-Pi) and project page released alongside the paper |
| Credibility | Pass — each of the four mechanisms has an independent ablation, cross-validated across two backends (GPT-5.6 Sol and Opus 5) plus Terminal-Bench 4 and IMO 2026 |
| Evidence maturity | Substantial — concrete token/cost-reduction numbers backed by ablations, though the authors' own Limitations section notes the mechanisms were mainly trained on a single backend |
| Reproducibility | Full artifacts — code and a project page were released alongside the paper |
| Why selected | Direct — turns "the harness can be optimized by automated research" into a reproducible engineering system rather than leaving it a concept |
| Novelty | Substantive — the first application of an RSI (recursive self-improvement) framework at the harness layer rather than the model-weight layer |
| Today's importance | High — from a named engineering team with released code, this has immediate cost implications for any team already running coding agents at scale |
| Practical link | Clear — the four mechanisms can be directly referenced or ported to cut token and API cost in an existing coding-agent harness |
| Editorial confidence | High — the token/cost savings are backed by released code, but "cross-backend transfer" and "recursive efficient improvement" are explicitly flagged by the authors as preliminary or future-facing claims |
| Reading recommendation | Must-read — for teams optimizing agent-platform cost, or evaluating whether to build an automated harness-research pipeline |
| Primary limitation | The four mechanisms were mainly trained on trajectories from a single LLM backend and trigger less often and less intensely on a second backend; "recursive efficient improvement" is explicitly framed by the authors as a future research direction, not an effect demonstrated in this paper |

### Background

Harness optimization has historically been manual trial-and-error — engineers testing different context-compression strategies or observing which tool interface saves more tokens. As coding agents move from passive code completion to unattended, long-running exploration, manual trial-and-error can no longer keep up with the complexity of the harness design space, and automated research at the harness layer (as opposed to automated training at the model-weight layer) has lacked a systematic methodology.

### Mid-Level Walkthrough

- **The problem**: Imagine you have a coding-agent harness and want to know how to tune it to cut token cost while keeping performance — but manually testing every combination of tweaks is too slow and too expensive.
- **The method**: SoL-Pi borrows the spirit of RSI (recursive self-improvement), letting an automated research loop run harness variants (rollouts) across increasingly numerous and diverse environments, keeping only changes that transfer reliably rather than ones that merely happen to work in one development setting. The four surviving mechanisms span action execution, context compaction, observation handling, and delegated reading.
- **Why it matters**: This shows that "optimizing the harness" can itself be engineered and scaled automatically, rather than relying solely on individual engineer intuition — for teams already running coding agents at scale in production, this translates directly into hourly cost savings.

### Key Findings

- On the 51-task public subset of EdgeBench, SoL-Pi matches native Pi's performance across both GPT-5.6 Sol and Opus 5 backends while cutting recorded token traffic by 44.7-49.0% and API cost by about a third
- In hourly terms: an estimated $8.75-$13.50 saved per hour relative to native Codex and Claude Code-style harnesses, and $4.36-$5.71 relative to Pi ⚠️ (the authors' own measurement; EdgeBench currently releases only 51 of its 134 tasks publicly, and external replication is still pending)
- Beyond EdgeBench, the team also validates on Terminal-Bench 4 and IMO 2026 (Lean 4-verified problems), plus a coordinated agent-swarm setting, to confirm the four mechanisms aren't a coincidence of one benchmark
- Limitation (self-reported): the mechanisms were mainly trained on trajectories from a single LLM backend and trigger less often and less intensely on the second evaluated backend; "multi-backend training" is listed as future work, and "recursive efficient improvement" (using a cheaper harness to lower the cost of the next round of auto-research) is explicitly named as a long-term vision rather than a compounding effect demonstrated in this paper
- Adoption barrier: running full auto-research loops requires substantial automated-evaluation infrastructure (repository-derived and verifier-driven environments); teams without that infrastructure face a real barrier to reproducing the full pipeline, though the four mechanisms themselves are individually portable design references
- Framework relevance: the paper explicitly positions itself as harness-layer, not model-layer, optimization — in principle portable into the context-management and action-execution logic of any Claude Code, Codex, or custom coding-agent harness

### Reviewer's One-Line Take

Released code plus cross-backend, cross-benchmark validation gives this a rigor that's rare among "harness auto-optimization" papers, and the four mechanisms are concretely portable; but the authors themselves acknowledge the mechanisms' transferability currently skews toward a single backend, and "recursive efficient improvement" is explicitly labeled a not-yet-demonstrated future direction — readers shouldn't treat that aspirational framing as an already-verified result.

### Your Take-away

- If you're operating a platform running coding agents at scale and care about hourly API cost: SoL-Pi's four released mechanisms (especially context compaction and observation packing) are among the few cost-reduction designs in this space that ship with full code — worth porting directly
- If you're evaluating whether to build your own automated harness-research pipeline: note the authors' own stated boundary — mechanisms trained on one backend see diminished effect on another, so don't expect an "auto-researched harness" to transfer painlessly across models

---

## Paper Three | Does Planning Guidance Actually Help, or Is It Just "Having Something to Read"? A Placebo Experiment Gives the Answer

**How Do Agent Harnesses Create Value? Planning Information and Release Control in Stateful LLM Agents**
Yukun Zhang, Kemu Xu, Yishen Chen (The Chinese University of Hong Kong / CUHK-Shenzhen / University of Edinburgh) · arxiv: 2609.20474

Links: [arxiv](https://arxiv.org/abs/2609.20474) · [alphaxiv](https://www.alphaxiv.org/abs/2609.20474)

### TL;DR

Using a word-shuffled, length-matched "Sham" plan as a placebo control, across 265 matched cells on tau-squared-bench the team shows a properly written task-specific plan lifts success by 7.17 percentage points (90% CI 1.15-13.36), while a read-only terminal verifier blocks 61% of false-pass episodes for less than a cent of added cost.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed; submitted 2026-09-17) |
| Citation velocity | 2 days since submission; some Semantic Scholar requests for this ID were rate-limited during this check, so citationCount is inferred near 0 based on same-batch sibling papers |
| Institution | The Chinese University of Hong Kong, CUHK-Shenzhen, University of Edinburgh |
| Community signal | No HF Daily Papers listing found; no Papers with Code entry found |
| Credibility | Pass — a Sham placebo control isolates the effect of "plan content" from "having something to read," with task-clustered bootstrap confidence intervals quantifying uncertainty |
| Evidence maturity | Preliminary — the core effect size is precisely reported, but the authors themselves acknowledge the lack of an independently timestamped preregistration, and both evaluation environments are public benchmarks the models may have seen during training |
| Reproducibility | Partial artifacts — no public code or data release found; runtime details are listed only in an appendix |
| Why selected | Direct — uses a causal-inference design to answer which harness component actually creates value, rather than lumping planning and verification into one score |
| Novelty | Substantive — the first use of a placebo control to separate "plan content" from "having a plan at all," layered with a liability-cost framework for deciding whether to prioritize planning or verification |
| Today's importance | High — offers a directly applicable decision rule: prioritize planning when false-pass cost is low, prioritize a verifier when it's high |
| Practical link | Clear — "a standalone verifier captures nearly all the false-pass benefit of the full planning-plus-verification stack at a twelfth of its cost" is a conclusion that can be applied directly to prioritization decisions |
| Editorial confidence | Medium — the placebo design is rigorous, but the paper's own admissions (no preregistration, public-benchmark contamination risk) mean the effect size should be read as directional evidence, not a precise population estimate |
| Reading recommendation | Must-read — for agent-platform teams deciding whether to invest first in planning or in a verifier |
| Primary limitation | No independently timestamped preregistration, and tau-squared-bench is a public benchmark the evaluated models may have encountered during training — the 7.17-point effect size should be read as directional evidence, not a precise estimate |

### Background

Research on "does the harness improve agent performance" has typically lumped the effects of planning, execution, and verification together into one overall score, making it hard to answer the attribution question of whether a good plan or a tight verifier is doing the work. This paper's angle is to separate the two by experimental design itself, rather than guessing statistically after the fact.

### Mid-Level Walkthrough

- **The problem**: Imagine a customer-support agent given a task-specific operating plan, and its performance improves — but how do you know whether the plan's *content* actually helped, or whether performance simply improves whenever there's "something to reference," a placebo-like effect?
- **The method**: The team designs a "Sham" control condition — the original plan text word-shuffled into the same length, but stripped of coherent meaning. Across two tau-squared-bench Retail experiments and an Airline pilot, they compare "Fixed" (the real plan) against "Sham" (the shuffled version) on identical tasks and models. Across 265 matched cells, Fixed significantly outperforms Sham by 7.17 points, confirming it's the plan's *content* doing the work, not a placebo effect. They also test a read-only terminal verifier (checking outcomes without intervening in execution) to see how many "claimed done but actually wrong" cases it can catch.
- **Why it matters**: This gives a genuinely practical prioritization rule — if false-pass cost is low in your setting, investing in a well-written plan pays off clearly; if false-pass cost is high (e.g. finance, healthcare), a cheap read-only verifier can capture nearly all the protective benefit of the full stack at a fraction of the cost.

### Key Findings

- Across 265 matched cells, Fixed improves oracle-verified success over the Sham control by 7.17 percentage points (90% task-clustered bootstrap interval, 1.15-13.36), with gains concentrated in higher-complexity tasks
- The read-only terminal verifier rejects 61% of Retail oracle-invalid episodes while withholding only 17% of correct ones, at under a cent of additional cost per episode
- Which component is worth investing in depends on the cost of a false pass: at low liability, the planning gain dominates; at high liability, the verifier's avoided false-pass benefit dominates — and a standalone verifier alone captures nearly all the false-pass-avoidance benefit of the full planning-plus-verification stack at about a twelfth of its cost
- The Airline setting has only 6 tasks, a small sample the paper explicitly frames as "pilot-scale" evidence rather than a primary result
- Both evaluation environments are public benchmarks, and the paper acknowledges the evaluated models "may have encountered" these tasks during training — a factor to weigh when interpreting the effect size
- Limitation (self-reported, Section 8.4): lacks an independently timestamped preregistration; exact hosted-endpoint versions and some request settings are missing, with only limited runtime metadata provided in an appendix

### Reviewer's One-Line Take

Using a placebo control to separate "plan content" from "having something to read" — two effects routinely conflated in harness research — is this paper's strongest design choice, and the liability-cost decision framework built on top of it is directly usable; but the authors' own listed limitations (no preregistration, public-benchmark contamination risk) mean the 7.17-point figure is better read as directional evidence that planning helps, not a number to plug into a precise cost-benefit calculation.

### Your Take-away

- If you're deciding whether to invest first in a planning mechanism or a verifier: ask how costly a false pass is in your setting first — low cost means write a good task-specific plan; high cost means prioritize a cheap read-only verifier, which this paper shows can capture most of the full stack's benefit at a fraction of the cost
- If you already have a planning mechanism but its impact is unclear: replicate this paper's placebo test yourself — shuffle the plan's content while keeping its length, and compare — that's the only way to confirm whether the content is actually helping or whether it's just a "having something to read" placebo effect

---

## Today's Takeaway

I used to think what determined coding-agent performance was mainly the model's capability, and the harness was just the "plumbing" connecting the model to its tools. Today's three papers show that's the same insight at three different levels: every harness component (planning, context management, action space) has value that's entirely conditional, with no universally optimal default; the harness itself can be treated as a research object independent of model weights, and systematically optimized by automated loops; and a question as seemingly obvious as "does planning actually help" can't be answered without a placebo control, because otherwise you can't tell whether the content is doing the work or it's just an artifact of "having something to read." The question worth asking isn't "is this model strong enough" — it's "has the harness wrapped around this model been conditionally designed for my context budget, my false-pass cost, and my task complexity."

## References

- [An Empirical Study of Harness Design for Coding Agents](https://arxiv.org/abs/2609.20804)
- [An Empirical Study of Harness Design for Coding Agents — alphaxiv](https://www.alphaxiv.org/abs/2609.20804)
- [SoL-Pi: Recursively Scaling Auto-Research Loops for Efficient Agent Harness](https://arxiv.org/abs/2609.20519)
- [SoL-Pi — alphaxiv](https://www.alphaxiv.org/abs/2609.20519)
- [SoL-Pi — code repository](https://github.com/NVlabs/SoL-Pi)
- [SoL-Pi — project page](https://nvlabs.github.io/SoL-Pi/)
- [How Do Agent Harnesses Create Value? Planning Information and Release Control in Stateful LLM Agents](https://arxiv.org/abs/2609.20474)
- [How Do Agent Harnesses Create Value? — alphaxiv](https://www.alphaxiv.org/abs/2609.20474)
- [arXiv cs.AI new listings, 2026-09-18](https://arxiv.org/list/cs.AI/new)
- [HuggingFace Daily Papers](https://huggingface.co/papers)
