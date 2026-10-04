---
title: "AI Agent Arxiv Digest — 2026-10-05"
date: 2026-10-05
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's theme is how trustworthy agent evaluation actually is — DAYJOB exposes a real capability gap on long-horizon professional work, Agent Evaluation Reliability decomposes how much of a leaderboard's ranking is signal versus noise, and KaliBench shows verifiable-reward training letting a small model catch up to a much larger one"
tldr: "DAYJOB shows the strongest model passes only 24.7%/23.9% of long-horizon healthcare/finance tasks under strict grading, with most configurations near zero; Agent Evaluation Reliability proves current leaderboards' model-ranking reliability can be as low as 0.148-0.841, far less stable than it looks; KaliBench uses SFT+RLVR to bring an 8B model to near-parity with a 685B model on cybersecurity tool use"
series:
  name: "AI Agent Arxiv Digest"
  order: 134
---

> 🌏 [中文版](/posts/daily/2026-10-05-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers all circle the same question: how do we actually know an agent can do the work? DAYJOB drops agents into real long-horizon professional tasks (healthcare, finance), grading them line-by-line against rubrics written by domain professionals — and even the strongest model passes only two or three out of ten under strict grading, with most configurations near zero. Agent Evaluation Reliability asks the question one level up: how stable are the leaderboard rankings we use to decide "which model is better" in the first place? Often, not very — model-ranking reliability can fall as low as 0.148. KaliBench doesn't stop at exposing a problem; it demonstrates a concrete fix: with verifiable-reward training, an 8B model can reach near-parity with a 685B model on cybersecurity tool use. Put together, the message is clear: evaluation numbers can point you in the right direction, but before you trust a single score, check how it was graded, how reliable the ranking actually is, and which metric you're reading.

## Terms worth knowing before reading

| Term | Plain-language explanation |
|---|---|
| Agent Harness / Scaffold | The system code wrapping a model — how it calls tools, assembles prompts, manages the execution loop. The same model can perform very differently under a different harness |
| RLVR (Reinforcement Learning from Verifiable Rewards) | Training with a reward signal that can be checked automatically (e.g. whether a command actually executes successfully) instead of human labels |
| Pass@1 / Exact Correct | The fraction of first attempts that are fully correct — a common but coarse single score that can hide the difference between "almost right" and "completely wrong" |
| LLM-as-judge | Using another LLM to grade an agent's output instead of a human — but the judge's own reliability is usually never verified |
| Reliability | Whether rankings hold up when the same evaluation is re-run on a similar batch of tasks. Low reliability means this leaderboard's ranking might flip with a different random seed |

---

## Paper One｜DAYJOB: a benchmark for long-horizon professional work — even the strongest model passes only two or three out of ten

**DAYJOB: A Benchmark for Long-Horizon Professional Work**
Stephanie Finley, Liudas Panavas, Thomas Mikkelson et al. (institution not disclosed; the dataset and a self-cited blog post appear linked to Surge AI, unconfirmed in the paper itself) · arxiv: 2610.01306

Links: [arxiv](https://arxiv.org/abs/2610.01306) · [alphaxiv](https://www.alphaxiv.org/abs/2610.01306)

### TL;DR

Across 130 long-horizon tasks designed by healthcare and finance professionals, the strongest model (Claude Opus 5.5) passes only 24.7% (healthcare) / 23.9% (finance) under strict grading, with the median configuration across 30 setups passing just 0.6% / 2.5%.

### Editorial Judgment

| Dimension | Assessment |
|---|---|
| Venue | NeurIPS 2026 AABA4ET Workshop (a workshop, not the main track; per the arXiv comments field) |
| Citation velocity | 4 days since publication, no citation data yet on Semantic Scholar |
| Institution | Not disclosed (GitHub org is surge-ai; a self-cited blog post appears to share the same origin, unconfirmed in the text) |
| Community signal | Not found on HF Daily Papers or Papers with Code within this research's scope |
| Credibility | Conditional pass — the 130 tasks went through three review layers with explicit rubrics, but the grading judge (an OpenCode agent running Claude Opus 4.8) was never validated against human expert graders |
| Evidence maturity | Preliminary — scores move in a consistent direction under relaxed thresholds (62.4%/58.3% at a 90%-of-rubric bar), but the "human-equivalent hours" figure is the task designers' own estimate, not a measured human baseline |
| Reproducibility | Partial artifacts — all 50 healthcare tasks and 50/80 finance tasks are public on HuggingFace (MIT license), the harness is open-sourced (Apache 2.0), while 30 finance tasks are available only on request |
| Why this paper | Direct — it directly tests whether agents can complete real professional long-horizon work, not abstract reasoning puzzles |
| Novelty | Substantive increment — tasks designed by domain professionals, run in containerized environments, graded all-or-nothing against binary expert rubrics |
| Today's importance | High — exposes a real capability ceiling on professional work that's far below what demo-style scores suggest |
| Practical link | Clear — these numbers are a realistic ceiling to check before deploying agents into healthcare or finance workflows |
| Editorial confidence | Medium — the directional finding ("long professional tasks remain hard") is credible, but the precise percentages rest on an unvalidated LLM judge |
| Reading recommendation | Must-read — for anyone questioning whether agents can do real professional work |
| Primary limitation | The grading judge was never checked for agreement with human expert graders; "human-equivalent hours" is a task-designer estimate, not a measured baseline |

### Field Context

Most agent benchmarks test well-defined short tasks (coding puzzles, web navigation). DAYJOB instead asks domain professionals what multi-day professional work actually looks like, replacing a single pass/fail score with expert rubrics — conceptually close to GDPval-style human-task benchmarks, but using an LLM judge instead of blinded human grading.

### Mid-level Walkthrough

- **The problem**: imagine asking a new analyst to handle a case involving hundreds of regulations, cross-checking records, and making an irreversible decision (say, whether to approve a claim). No one would hand them a simple pass/fail — they'd be graded against a checklist. DAYJOB brings that kind of work into evaluation.
- **The method**: 50 healthcare tasks and 80 finance tasks, each checked against a median of 47.5–57.5 binary rubric items (8–16% of which are explicit "do not do this" prohibitions), graded item-by-item by another agent (OpenCode running Claude Opus 4.8); a task only passes if every item does.
- **Why it matters**: many teams see "80% accuracy" and assume a model is ready to ship. DAYJOB shows that once a task becomes multi-step, has prohibitions, and requires cross-checking records like real work does, the pass rate can collapse to single digits.

### Deep-dive Points

- Claude Opus 5.5 (adaptive/max) passes 24.7% (healthcare) / 23.9% (finance) under strict grading; the median of 30 configurations is only 0.6% / 2.5%
- At a relaxed 90%-of-rubric threshold, pass rates jump to 62.4% / 58.3%, showing most failures are near-misses, not total failures ⚠️ (graded by the authors' own agentic judge, not yet checked against human expert grading)
- Of the 30 configurations, 10 score exactly zero on every healthcare task, and 7 score zero on every finance task
- The most expensive configuration costs $7.10–$11.47 per attempt, consuming 9.8–17.8 million tokens (94–95% cached)
- Deployment threshold: for real healthcare/finance workflows, no configuration reliably clears a passing bar today — human review remains necessary
- Limitation: the paper has no dedicated Limitations section, and the LLM judge used for grading was never validated against human expert agreement

### Reviewer's One-line Take

Replacing a single score with real professional rubrics is a clear step forward, but the grading itself rests on an unvalidated LLM judge, and "human-equivalent hours" is just the task designers' own estimate — until an independent human-comparison experiment exists, read 24.7% as "directionally right, but precision unverified."

### Take-aways for You

- If you're evaluating whether to deploy agents into healthcare or finance workflows: assume the real pass rate on multi-step professional work is far below demo-style scores, and don't skip human review
- If you're designing your own agent evaluation: borrow DAYJOB's approach of expert rubrics over a single score, but make sure to verify your LLM judge's agreement rate with human graders — don't assume they match

---

## Paper Two｜Is agent evaluation reliable? Decomposing a leaderboard's signal from its noise

**Agent Evaluation Reliability: More Tasks Won't (Always) Fix a Leaderboard**
Michael Hardy, Ruhana Azam, Anka Reuel et al. (institution not disclosed) · arxiv: 2610.00651

Links: [arxiv](https://arxiv.org/abs/2610.00651) · [alphaxiv](https://www.alphaxiv.org/abs/2610.00651)

### TL;DR

Using a Bayesian variance-decomposition method on 9 Holistic Agent Leaderboard benchmarks (plus a secondary, filtered 13-of-29 Harbor-Index subset as corroboration), the paper finds that fixed model-scaffold ranking reliability reaches 0.935–0.994, while underlying-model ranking reliability is only 0.148–0.841 — meaning the same leaderboard, re-run on a similar batch of tasks, can see model rankings reshuffle entirely.

### Editorial Judgment

| Dimension | Assessment |
|---|---|
| Venue | arXiv preprint |
| Citation velocity | 5 days since publication, no citation data yet on Semantic Scholar |
| Institution | Not disclosed |
| Community signal | Not found on HF Daily Papers or Papers with Code within this research's scope |
| Credibility | Conditional pass — the method is fully specified with equations and is reproducible (open-sourced on GitHub), but the headline "22 benchmarks" actually blends a 9-benchmark primary analysis with a secondary, filtered 13-benchmark corroboration |
| Evidence maturity | Substantial — the headline numbers (0.935–0.994 vs. 0.148–0.841) trace to specific sections and appendix tables, and the authors themselves flag scope limits |
| Reproducibility | Full artifacts — code and data are public on GitHub, with a dedicated Reproducibility Statement and full estimation details in the appendix |
| Why this paper | Indirect — it doesn't introduce new agent capability, but gives the framework needed to judge the numbers in other evaluation papers |
| Novelty | Substantive increment — the first to use Bayesian variance decomposition to cleanly separate how much of a ranking's variance comes from the model versus the harness |
| Today's importance | High — directly shapes how to read every agent benchmark paper today, including DAYJOB and KaliBench |
| Practical link | Clear — teams doing model selection should spread evaluation across multiple benchmarks rather than piling more tasks onto a single one |
| Editorial confidence | High — the core statistical framework and numbers are traceable, and the authors disclose their own scope-eroding factors |
| Reading recommendation | Must-read — for anyone making model-selection decisions based on leaderboards |
| Primary limitation | The authors themselves note that today's frontier models may simply be too similar to each other, which could partly explain the low model-ranking reliability rather than a flaw in benchmark design; the headline "22 benchmarks" figure is actually a mix of 9 primary + 13 filtered secondary benchmarks |

### Field Context

Agent leaderboards (like HAL and Harbor Index) are often used as the basis for model selection, but when task counts are small and models are close in ability, the statistical reliability of the ranking itself is rarely checked — this paper quantifies exactly how trustworthy a given leaderboard's ranking is.

### Mid-level Walkthrough

- **The problem**: imagine judging which of two students is stronger from two different pop quizzes — if the quizzes are too short or the students too evenly matched, this quiz's top scorer could be next quiz's last place. Agent leaderboards have the same problem, except almost no one quantifies how likely a ranking is to flip with a different batch of tasks.
- **The method**: using generalizability theory, the paper splits leaderboard scores into three sources of variance — true model differences, harness differences, and task-sampling noise — then asks: how stable is a fixed-harness comparison (very stable), versus a cross-model comparison (much less stable)?
- **Why it matters**: if you're using a leaderboard to decide whether to switch models, this paper shows that simply adding more tasks usually can't rescue the ceiling on ranking reliability — spreading across different benchmarks helps more.

### Deep-dive Points

- Across the 9 HAL benchmarks, model-ranking reliability ranges from 0.148 to 0.841, while fixed-harness comparison reliability ranges from 0.935 to 0.994
- Even with infinitely many similarly-constructed tasks, OnlineMind2Web's model-ranking reliability rises at most from 0.148 to 0.153 (the body rounds this to "at most 0.10," while the abstract states 0.097 — a minor inconsistency between the two)
- Pooling evaluation across the nine-benchmark battery raises projected model-ranking reliability from about 0.44 on a single benchmark to 0.75, at an estimated 83% lower cost (from roughly $47,000 for the full HAL battery down to about $19,000) ⚠️ (a cost projection from fitted variance components, not a freshly re-run independent replication)
- The 13 Harbor-Index benchmarks were filtered down from an original 29 by requiring at least 3 items each; the authors themselves flag that this filtering threshold affects the reliability estimate
- Deployment threshold: serious model comparisons should spread budget across at least 3–5 structurally different benchmarks rather than pouring the whole budget into adding more tasks to one benchmark
- Limitation: high reliability doesn't mean a benchmark measures the right thing (reliability ≠ validity); today's low model-ranking reliability may partly stem from current frontier models simply being too close to each other, not purely from benchmark design flaws

### Reviewer's One-line Take

A methodologically rigorous, fully open and reproducible piece — the most careful paper on this list — but the "22 benchmarks" framing risks implying a uniformly large-scale validation, when the main conclusions actually rest primarily on 9 benchmarks; that distinction should be made explicit whenever this paper is cited.

### Take-aways for You

- If you're using a leaderboard for model selection: don't rely on a single benchmark's ranking — spread your conclusion across at least 3 structurally different benchmarks first
- If you're writing or reading other agent benchmark papers (including DAYJOB and KaliBench in this digest): remember that fixed-harness comparisons are usually far more stable than cross-model comparisons — whenever you see a model ranking, ask what its reliability interval actually is

---

## Paper Three｜KaliBench: a cybersecurity tool-use benchmark where RLVR brings an 8B model to parity with a 685B one

**KaliBench: A Fine-Grained Benchmark for Cybersecurity Tool Use on Kali Linux**
Pengfei Li, Naufal Suryanto, Sicheng Zhang et al. (institution not disclosed; GitHub org is RISys-Lab) · arxiv: 2610.02206

Links: [arxiv](https://arxiv.org/abs/2610.02206) · [alphaxiv](https://www.alphaxiv.org/abs/2610.02206)

### TL;DR

Across 8,504 natural-language-instruction-to-Kali-Linux-CLI-command pairs, none of 24 open-weight model configurations exceeds 42% exact-command accuracy in unrestricted mode — but an 8B model trained with SFT+RLVR (reinforcement learning from verifiable rewards) closes to within one percentage point of a 685B MoE model on the aggregate score.

### Editorial Judgment

| Dimension | Assessment |
|---|---|
| Venue | NeurIPS 2026 Evaluations and Datasets Track (confirmed directly from the arXiv Comments field) |
| Citation velocity | 4 days since publication, citation count is 0 on Semantic Scholar |
| Institution | Not disclosed (GitHub org is RISys-Lab) |
| Community signal | 8 upvotes, 2 comments on HuggingFace Daily Papers (2026-10-01) |
| Credibility | Conditional pass — the dataset construction and training pipeline are public and the numbers trace to the paper's own tables, but human verification was done only by the authors internally, not independent annotators |
| Evidence maturity | Substantial — 24 open-weight configurations plus comparisons against several commercial systems, cross-validated across Unrestricted/Hinted/Restricted modes |
| Reproducibility | Full artifacts — the dataset and full training pipeline are open-sourced (CC BY-NC 4.0), model weights are on HuggingFace, with Croissant metadata filed |
| Why this paper | Direct — it offers a concrete training recipe for closing the gap between small and large models on a specific tool-use task |
| Novelty | Substantive increment — trains tool-use capability using verifiable rewards (whether execution actually succeeds) instead of human labels, rather than just adding another static benchmark |
| Today's importance | High — directly useful for teams who want to do domain-specific tool-calling with small or mid-sized models |
| Practical link | Clear — the RLVR reward design and training-data construction pipeline can be directly adapted to other tool-use domains |
| Editorial confidence | High — passed peer review on NeurIPS's evaluations-and-datasets track, and the core numbers trace to the paper body |
| Reading recommendation | Must-read — for anyone training or evaluating tool-calling capability |
| Primary limitation | The "8B matches 685B" claim holds only on the aggregate average score — in Hinted mode, exact-command accuracy still trails by 15 percentage points (69.4% vs. 84.5%); human verification was done only by the authors internally |

### Field Context

Operating cybersecurity tools (like the thousands available on Kali Linux) requires precise CLI syntax — get one argument wrong and the whole command fails. That's a very different error tolerance from typical chat-style tool calling. KaliBench asks whether a model genuinely understands how to issue commands, rather than merely appearing to.

### Mid-level Walkthrough

- **The problem**: imagine asking a newcomer to complete a penetration-testing task using one of 1,642 security tools — just knowing the tool's name isn't enough; they also need to remember every argument's exact spelling and order. Get one character wrong, and the command can fail outright or do the wrong thing.
- **The method**: a manuscript-grounded pipeline first generates 27,000 candidate instruction→CLI-command pairs, filtered through LLM validation, sandboxed execution, and a manual review layer, retaining 30.7% (about 8,504 pairs); these pairs then serve as a verifiable reward (whether a command actually executes successfully) to directly train an 8B model.
- **Why it matters**: this shows tool-use capability doesn't necessarily require piling on parameters — with the right reward signal, a small model can catch up to a much larger one in a specific domain, which is a concrete, actionable path for teams who want to self-host rather than depend on a giant model's API.

### Deep-dive Points

- Among the 24 open-weight configurations, the strongest (GLM-5.2, 753B) reaches only 41.3% exact-command accuracy in unrestricted mode — no model exceeds 42%
- The SFT+RLVR-trained 8B model (RedSage-K) reaches an aggregate average score of 79.2%, versus 80.2% for the 685B/37B-active MoE model DeepSeek-V3.2 — a gap of just one percentage point
- But on exact-command accuracy in Hinted mode (with tool documentation provided), RedSage-K still trails DeepSeek-V3.2 by 15 percentage points (69.4% vs. 84.5%) ⚠️ (the authors' own trained small model, pending third-party replication)
- Providing tool documentation (Hinted mode) is the single most effective intervention: Optional-Arg F1 jumps from 45.1% to 87.8%, and exact-command accuracy jumps from 22.3% to 73.1%
- Commercial systems (GPT-5.6-Sol at 61.68%, Codex at 51.68%, Claude Opus 5 at 44.02%) outperform all open-weight models on the full dataset, though Claude Opus 5's total score is dragged down by refusing 26.5% of queries
- Limitation: there is tool-level overlap between training and test data (962 of the 1,642 tools appear in both), even though the specific instruction-command pairs don't overlap — a caveat the paper doesn't explicitly flag

### Reviewer's One-line Take

Rigorous dataset construction that has passed NeurIPS's evaluations-and-datasets peer review, with a concretely replicable RLVR training recipe — but the "matches 685B overall" framing can obscure the fact that a 15-percentage-point gap remains in Hinted mode; cite the specific metric, not just the headline.

### Take-aways for You

- If you're training or fine-tuning tool-calling capability: KaliBench's SFT+RLVR recipe (rewarding whether a command actually executes) is currently the most concrete roadmap for a small model to catch up to a large one, and can be adapted directly
- If you're selecting a cybersecurity-tool agent: don't rely on the aggregate average score alone — check exact-command accuracy, the stricter metric, especially in settings without tool documentation hints

---

## Today's Takeaway

I used to think "the higher the leaderboard score, the more trustworthy the model." Today I learned that a leaderboard's own ranking can be surprisingly unstable (model-ranking reliability as low as 0.148–0.841), and that the real bar for an agent to pass on genuine professional work is far higher than demo-style scores suggest (DAYJOB: under 1% pass rate for most configurations). But it's not all bad news — KaliBench proves that with the right reward signal, an 8B model can catch up to a 685B model on a specific task.

## References

- DAYJOB paper: [arxiv](https://arxiv.org/abs/2610.01306) · [alphaxiv](https://www.alphaxiv.org/abs/2610.01306)
- DAYJOB open-source code and dataset: [GitHub](https://github.com/surge-ai/dayjob)
- Agent Evaluation Reliability paper: [arxiv](https://arxiv.org/abs/2610.00651) · [alphaxiv](https://www.alphaxiv.org/abs/2610.00651)
- Agent Evaluation Reliability open-source code: [GitHub](https://github.com/hardy-education/scaffold_eval)
- KaliBench paper: [arxiv](https://arxiv.org/abs/2610.02206) · [alphaxiv](https://www.alphaxiv.org/abs/2610.02206)
- KaliBench open-source dataset and training pipeline: [GitHub](https://github.com/RISys-Lab/KaliBench)
- KaliBench community discussion: [HuggingFace Daily Papers](https://huggingface.co/papers/2610.02206)
