---
title: "AI Agent Arxiv Digest — 2026-09-06"
date: 2026-09-06
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Three infrastructure gaps for deploying agents: training without verifiers, detecting silent failures at runtime, and the instability of LLM-judge measurements"
tldr: "DRACO improves AppWorld TGC by 15.9 points without ground-truth rewards and zero-shot transfers beyond outcome-reward training; CURA detects 42.3% of agent failures a median of 31 steps early using read-only telemetry on 361 OSWorld tasks; Clean Engineering's preregistered audit reveals same-endpoint repeat ranking agreement of just Spearman 0.40 (threshold 0.90)"
series:
  name: "AI Agent Arxiv Digest"
  order: 105
---

> 🌏 [中文版](/posts/daily/2026-09-06-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers cover three infrastructure gaps for deploying agents. DRACO addresses "how to train agents on long-horizon tasks without programmatic verifiers," using dynamically generated rubrics to distribute credit per-step — beating even ground-truth-reward training on AppWorld. CURA tackles "90% of agent failures end with a success claim," using CUSUM statistical alarms on read-only telemetry to detect failures 31 steps before termination with certified false-alarm control. Clean Engineering asks a more fundamental question: "is the LLM judge you use for scoring even a stable measuring instrument?" — the answer is no, with same-endpoint byte-identical replays yielding ranking agreement of just 0.40. Together, they're a sobering reminder: for agents to go to production, the training signal, runtime monitoring, and evaluation instrument layers all have unresolved foundational problems.

## Terms to Know

| Term | Plain-Language Explanation |
|---|---|
| Credit Assignment | A long-horizon task runs 50 steps before you know if it succeeded — how do you figure out whether step 3 or step 27 was responsible? |
| GRPO | Group Relative Policy Optimization — updates policy using relative quality within a batch of trajectories, no value network needed |
| CUSUM | Cumulative Sum control chart — a decades-old statistical alarm method from industrial quality control for detecting process shifts |
| FPR Control | Guaranteeing that false positives stay below your budget — e.g., α=0.10 means at most 10% of alarms are false |
| LLM-as-a-Judge | Using a large language model to score or rank outputs instead of humans — now standard in training data filtering, leaderboards, and agent evaluation |
| Preregistration | Publicly declaring hypotheses, thresholds, and analysis methods before running an experiment — prevents post-hoc adjustment to get favorable results |

---

## Paper 1 | DRACO: Teaching Agents to Get Each Step Right Without Answer Keys

**DRACO: Fine-Grained Credit Assignment with Dynamic Rubrics for Long-Horizon Agent Training**
Shubham Gandhi et al. (IBM Research) · arxiv: 2609.04094

Links: [arxiv](https://arxiv.org/abs/2609.04094) · [alphaxiv](https://www.alphaxiv.org/abs/2609.04094)

### TL;DR

In the outcome-blind setting (no programmatic verifier), dynamically generated rubrics redistribute trajectory-level rewards into per-step credit, pushing Qwen3.6-27B to 85.3 TGC on AppWorld — 5.3 points above ground-truth-reward training (80.0) — and zero-shot transferring to τ-bench Banking.

### Editorial Judgment

| Dimension | Assessment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation Velocity | Published 3 days ago; Semantic Scholar data unavailable (API rate-limited) |
| Institution | IBM Research |
| Community Signals | GitHub repo public (github.com/IBM/draco); not on HF Daily Papers |
| Credibility | Pass — four-way ablation, two base models (Qwen3.6-27B / Qwen2.5-32B-Instruct), two benchmarks including zero-shot transfer |
| Evidence Maturity | Substantial — ablations, multi-model, multi-benchmark, consistency metrics (pass^k), full hyperparameters and prompts |
| Reproducibility | Full artifacts — public code repo, complete training config, evaluation prompts |
| Why This Paper | Direct — most real agent tasks lack programmatic verifiers; this is a practical training method for the outcome-blind setting |
| Novelty | Substantive — first to combine dynamic rubrics + closed-form per-step credit allocation with GRPO without any trained attribution module |
| Today's Importance | High — agent training is shifting from SFT to RL; credit assignment without ground-truth rewards is the biggest bottleneck |
| Practical Link | Clear — any team training tool-use agents via GRPO/PPO without unit tests can directly adopt this |
| Editorial Confidence | High — clean ablations, traceable numbers, public code |
| Reading Recommendation | Must-read — agent training engineers, RL practitioners |
| Primary Limitation | Training depends on GPT-5.4 as judge; self-judge variant drops ~4 points (p1 81.1 vs 85.3), creating a cost barrier for fully open-source deployment |

### Domain Context

The standard for agent RL training is "use RLVR if you have a programmatic verifier," but most real tasks — customer service, research workflows, cross-application orchestration — have no program that can determine success. Falling back to trajectory-level LLM judge scores means a 50-step trajectory gets a single number, and the model doesn't know which steps helped or hurt.

### Mid-Level Walkthrough

- **Problem**: Imagine submitting a 50-page report and getting only a total score of 72. You don't know which pages were strong and which dragged the score down. Page-level feedback would accelerate improvement dramatically — that's credit assignment.
- **Method**: DRACO has the judge LLM dynamically generate rubrics each training round that track the current policy's capability frontier. After a trajectory completes, the rubrics are scored, and a closed-form formula distributes scores back to the steps responsible for each criterion. Rubrics evolve with training — early rounds focus on basic operations, later rounds on strategic decisions.
- **Why It Matters**: If your agent deploys in environments without unit tests (most real scenarios), DRACO provides a path to "good training with just an LLM judge" — and it doesn't require training an additional attribution module.

### Key Details

- AppWorld TGC: DRACO 85.3 vs Outcome reward 80.0 vs Base 69.4 (Qwen3.6-27B)
- Ablation: dynamic rubrics contribute +3.2, per-step credit +2.4; combined +14.5 over static+no-credit
- Zero-shot transfer τ-bench Banking: DRACO 20.4% vs Base 15.8%, trained only on AppWorld
- Consistency (pass^3): DRACO 72.8% vs Outcome 63.3% — not just better on average, better every run
- Self-judge variant (no GPT-5.4): p1 drops ~4 points (81.1 vs 85.3); judge quality is the bottleneck
- Training cost: 8 H100s, 100 steps, LoRA adapter — feasible for mid-size teams

### Reviewer One-Liner

Ablation design is rigorous and the zero-shot transfer result is compelling. The open question is judge dependency — self-judge degradation shows method quality is capped by judge capability; open-source deployment needs stronger open-source judges.

### Your Take-Away

- If you're training tool-use agents without programmatic verifiers: DRACO's dynamic rubric + closed-form credit is currently the most concrete alternative; start from GRPO and retrofit
- If you're designing agent training pipelines: track "judge quality" and "credit granularity" separately — DRACO proves that improving credit granularity alone yields 14+ point gains even with the same judge

---

## Paper 2 | CURA: When the Agent Says "Done" — Should You Believe It?

**CURA: Certified Runtime Alarms for Computer-Use Agents**
Divake Kumar et al. · arxiv: 2608.27808

Links: [arxiv](https://arxiv.org/abs/2608.27808) · [alphaxiv](https://www.alphaxiv.org/abs/2608.27808)

### TL;DR

Across 361 OSWorld tasks, 64 of 71 agent failures (90%) end with a success claim; CURA uses read-only telemetry + CUSUM statistical alarms to detect 42.3% of failures a median of 31 steps before termination, with certified false-alarm rate ≤ α=0.10 — no model internals, no extra LLM calls.

### Editorial Judgment

| Dimension | Assessment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation Velocity | Published 9 days ago; Semantic Scholar API rate-limited, no confirmed data |
| Institution | Not explicitly stated in abstract page |
| Community Signals | Not on HF Daily Papers / no Papers with Code repo |
| Credibility | Pass — 361 OSWorld tasks, ~9,100 calls, CUSUM with mathematical guarantees, retrospective AUROC 0.828 with fold-internal floor |
| Evidence Maturity | Substantial — covers online detection, retrospective analysis, hybrid cascade deployment simulation, and reports method failure boundaries |
| Reproducibility | Partial artifacts — method details complete, OSWorld is public, but no independent code repo found |
| Why This Paper | Direct — agent "self-report failure" is the first trust crisis for deployment |
| Novelty | Substantive — first application of statistical process control (CUSUM + certified FPR) to agent runtime monitoring, zero LLM calls |
| Today's Importance | High — computer-use agents are entering production; deployers need monitoring that doesn't rely on model self-report |
| Practical Link | Clear — any CUA deployment pipeline can add CURA as an external monitoring layer without changing prompts or adding model calls |
| Editorial Confidence | High — mathematical guarantees + real benchmark validation; claim scope matches evidence |
| Reading Recommendation | Must-read — agent deployment engineers, MLOps, product safety |
| Primary Limitation | Only catches 42.3% of failures (57.7% slip through); the paper explicitly reports where behavioral monitoring is uninformative |

### Domain Context

Computer-use agents execute tasks in real desktop environments. The problem is they don't tell you when they fail. Self-report is the cheapest monitoring channel, but on OSWorld 90% of failures end with "success" — agents prefer to report good news. Existing alternatives either use another LLM as overseer (doubling cost) or rely on human spot-checks (not scalable).

### Mid-Level Walkthrough

- **Problem**: You have an agent configure OS preferences, manipulate spreadsheets, install software. It finishes and says "done." But in 90% of failure cases, it also says "done." How do you know when to intervene?
- **Method**: CURA doesn't ask the model "did you succeed?" — it reads harness-visible telemetry (token counts, step counts, operation types) from the outside and treats the execution trajectory like an industrial process time series, using CUSUM control charts to detect "process shifts." The statistical guarantee: if you set α=0.10, at most 10% of correctly completed tasks will be falsely flagged as failures.
- **Why It Matters**: This is the first "zero LLM calls, mathematically guaranteed" agent runtime monitoring method. It doesn't touch model internals, doesn't change prompts, reads only telemetry — meaning it can serve as a plug-in safety layer for any CUA pipeline.

### Key Details

- 90% of failures end with success claims: 64/71 failures claim success, 61 acknowledge no blockers
- CUSUM online detection: at α=0.10, recalls 42.3%, median 31 steps early, actual FPR 0.066 (below budget)
- Retrospective AUROC: 0.828 (fold-internal floor 0.802); margin over total-token baseline +0.026, not significant
- Hybrid cascade: CURA alarm → call frontier overseer for review → recovers 23/70 failures, final task score 86.8 (from 82.9)
- Explicitly reports failure boundaries: behavioral monitoring is uninformative for certain failure types (listed in paper)

### Reviewer One-Liner

Cross-domain transfer of industrial quality control (CUSUM) to agent monitoring is clever and rigorous. The open question is whether 42.3% recall is sufficient — over half of failures still slip through; production deployment needs complementary mechanisms.

### Your Take-Away

- If you're deploying computer-use agents: add CURA's "read-only telemetry + CUSUM" to your harness as baseline monitoring — zero cost, guaranteed bounds, far better than trusting agent self-report
- If you're designing agent evaluation frameworks: remember that 90% of failures end with success claims — if your evaluation pipeline relies on agent-reported status, you may be severely underestimating failure rates

---

## Paper 3 | Is Your LLM Judge a Stable Measuring Instrument?

**Clean Engineering, Unstable Measurement: A Preregistered Reliability Failure of Black-Box LLM Observers on Shared Endpoints**
Haoyuan Zhu et al. · arxiv: 2609.04198

Links: [arxiv](https://arxiv.org/abs/2609.04198) · [alphaxiv](https://www.alphaxiv.org/abs/2609.04198)

### TL;DR

A preregistered audit of 52,988 requests reveals that the same API endpoint, same byte-identical input, same day, yields ranking agreement of just Spearman 0.40 (threshold 0.90); next-day replays hit 0.78 (threshold 0.99). LLM judges as measuring instruments are far less stable than anyone assumes.

### Editorial Judgment

| Dimension | Assessment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation Velocity | Published 3 days ago; Semantic Scholar: 0 citations |
| Institution | Not explicitly stated in abstract page |
| Community Signals | Not on HF Daily Papers / no Papers with Code repo |
| Credibility | Pass — dual preregistered campaigns, 52,988 audited requests, byte-level audit trail, 4-provider cross-validation |
| Evidence Maturity | Substantial — preregistered thresholds enforced to terminal negative verdict, mechanism decomposition (bias/separation/platform), prospective supplementary experiments |
| Reproducibility | Partial artifacts — full audit trail published, design rules and checklist in paper, but no independent code repo |
| Why This Paper | Indirect (but extremely broad impact) — not an agent architecture paper, but agent training (DRACO's judge) and evaluation pipelines all depend on LLM-as-a-Judge |
| Novelty | Substantive — first to apply preregistered + enforced-threshold "instrument audit" framework to LLM judge stability; prescriptive negative result, not descriptive observation |
| Today's Importance | High — directly relevant to DRACO's judge dependency and CURA's evaluation pipeline; reveals systemic risk at the infrastructure layer |
| Practical Link | Clear — any team using API-hosted LLM judges should run their pilot calibration (paper estimates 2% call volume suffices) |
| Editorial Confidence | High — preregistration enforced, byte-level audit, clear mechanism decomposition |
| Reading Recommendation | Must-read — any team depending on LLM-as-a-Judge (training, evaluation, leaderboards) |
| Primary Limitation | Only tests shared endpoints; self-hosted batch-invariant kernels improve results but "only while the server was quiet" |

### Domain Context

LLM-as-a-Judge is the de facto standard: training data filtering, leaderboards, agent evaluation, RLHF reward models — all assume "same model, same input, stable output." But shared API endpoints run batched inference, kernels aren't batch-size-invariant, and greedy decoding on drifting logits diverges. This isn't new, but no one has formally treated it as a measurement instrument problem with preregistered thresholds until now.

### Mid-Level Walkthrough

- **Problem**: You use GPT-5.4 to score two agent outputs — A > B. Tomorrow you rerun with the same input, same model name, same temperature=0. The result flips to B > A. This isn't a hallucination problem — it's instrument instability.
- **Method**: The authors ran two preregistered experiments, publicly declaring thresholds in advance (Spearman ≥ 0.90 for same-window, ≥ 0.99 for next-day). Both failed. They decomposed instability into three mechanisms: (1) label-to-meaning mapping bias, (2) candidate gaps seven orders of magnitude below instrument noise floor, (3) byte-identical inputs returning different rankings.
- **Why It Matters**: If your agent training uses LLM judges for rewards (like DRACO), or your eval pipeline uses LLM scoring, this paper says: calibrate your instrument before trusting your results. The paper estimates just 2% of call volume as pilot calibration would expose the problem.

### Key Details

- Same-window Spearman: 0.40 (threshold 0.90 — massive gap)
- Next-day Spearman: 0.78 (threshold 0.99)
- All 4 providers show the same problem: medians 0.74–0.88, none meet threshold
- Self-hosting with batch-invariant kernels helps, but "only while the server was quiet"
- Waiting days doesn't help (0.805 vs 0.800 over 5 additional days)
- Switching providers doesn't help (4 providers share the noise floor)
- Paper proposes 8 design rules + reporting checklist + 3-level snapshot-identity ladder

### Reviewer One-Liner

A rigorously uncomfortable negative result — preregistration, byte-level audit, and mechanism decomposition are all present. The open question is whether the community will actually adopt those 8 design rules or continue pretending the problem doesn't exist.

### Your Take-Away

- If you're using LLM-as-a-Judge for evaluation or training: run a pilot calibration today — send the same input three times and check if rankings are consistent. The paper estimates 2% of call volume suffices
- If you're designing leaderboards or agent eval frameworks: add "instrument stability" to reporting requirements — report your measuring instrument's test-retest reliability before reporting results

---

## Today's Takeaway

Previously thought the three gates for deploying agents (training, monitoring, evaluation) were independent problems. Today shows they're interconnected: DRACO's training depends on LLM judges; Clean Engineering says those judges are unstable instruments; CURA's monitoring deliberately avoids LLM calls, neatly sidestepping the judge stability problem. Together they map out where you can trust the infrastructure and where you can't.

## References

- [DRACO: Fine-Grained Credit Assignment with Dynamic Rubrics for Long-Horizon Agent Training](https://arxiv.org/abs/2609.04094)
- [DRACO GitHub repo](https://github.com/IBM/draco)
- [CURA: Certified Runtime Alarms for Computer-Use Agents](https://arxiv.org/abs/2608.27808)
- [Clean Engineering, Unstable Measurement: A Preregistered Reliability Failure of Black-Box LLM Observers on Shared Endpoints](https://arxiv.org/abs/2609.04198)
- [OSWorld benchmark](https://os-world.github.io/)
- [AppWorld benchmark](https://appworld.dev/)
