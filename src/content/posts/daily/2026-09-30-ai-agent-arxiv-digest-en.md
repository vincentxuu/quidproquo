---
title: "AI Agent Arxiv Digest — 2026-09-30"
date: 2026-09-30
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's three papers each target one link in the chain from planning to execution — GRASP makes planning itself more accurate, PlanGuard catches physically unsafe plans before execution, and LIMBO reveals that even after both checks pass, agents often don't know whether they duplicated a write — and still report success"
tldr: "GRASP splits planning into three isolated modules and beats direct planning by 30.8 points on ZebraLogic; PlanGuard detects physical risk in multi-step plans with a 2B model, beating the strongest safety-guardrail baseline by 31.27 F1 points; LIMBO runs 25,930 episodes and finds that without idempotency keys, even frontier models duplicate 56-74% of writes under unresolvable faults, and in 90% of episodes that produced a duplicate the agent reported the task as completed"
series:
  name: "AI Agent Arxiv Digest"
  order: 129
---

> 🌏 [中文版](/posts/daily/2026-09-30-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers together pull apart an agent's full chain from planning to execution and check each link separately. GRASP tries to make planning itself more accurate — it splits generation, revision, and verification into three modules that don't share context, and its ablation proves that doing this in reverse order (explore first, constrain later) collapses performance outright. PlanGuard handles the next link: a plan may have been generated, but a multi-step plan whose individual steps each look safe can still be dangerous once combined, and it's the first detector to evaluate a complete plan at once rather than step by step. LIMBO exposes something more fundamental — even when planning is correct and safety has been checked, agents often don't know whether they duplicated the same write operation. Across 25,930 experimental episodes, 90% of episodes that produced a duplicate still had the agent report the task as completed. All three papers back their claims with concrete numbers, ablations, and stated limitations. Together they make one point: accurate planning doesn't guarantee safety, passing a safety check doesn't guarantee correct execution, and execution that looks fine doesn't mean it actually was.

## Terms worth knowing before reading

| Term | Plain explanation |
|---|---|
| Context Isolation | Splitting an agent's reasoning into separate blocks that don't share conversation memory, so information from different stages doesn't interfere with each other |
| Ablation Study | Removing part of a system and re-testing it, to prove whether a specific module actually contributes — not just looking at overall performance |
| Guardrail | A check that intercepts an agent's action before execution, judging whether that action or plan is safe |
| Idempotency Key | A unique identifier attached to every write request, letting the server recognize "this is a retry of the same request" instead of executing it twice |
| Exactly-once (semantics) | The guarantee that an operation takes effect exactly one time — no more, no less — a classic hard problem in distributed systems design |
| Held-out | A category of data deliberately withheld during training, used to test whether a model can generalize to situations it hasn't seen |

---

## Paper One | GRASP: Split Planning Into Three Modules That Don't Interfere, So Agents Stop Collapsing Mid-Thought

**GRASP: Generating, Revising, and Assessing for Strategic Planning with Agentic AI**
Arunabh Srivastava, Mohammad A. (Amir) Khojastepour, Srimat Chakradhar et al. (NEC Laboratories America + University of Maryland) · arxiv: 2609.30147

Links: [arxiv](https://arxiv.org/abs/2609.30147) · [alphaxiv](https://www.alphaxiv.org/abs/2609.30147)

### TL;DR

By splitting planning into three context-isolated modules for generation, revision, and verification, GRASP beats direct planning by 12.4 points on Natural Plan Calendar Scheduling and 30.8 points on ZebraLogic, and under dual-task settings GPT-4o-mini running GRASP beats the frontier reasoning model GPT-5-mini by 14.5 points.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | Accepted at REALM workshop @ EMNLP 2026 (self-reported in arXiv comments; Semantic Scholar has not yet indexed venue metadata) |
| Citation velocity | Published 6 days ago, Semantic Scholar shows 0 citations (too new) |
| Institution | NEC Laboratories America + University of Maryland |
| Community signal | Not on HF Daily Papers / no Papers with Code reproduction repo |
| Credibility | Pass — the body provides full comparison tables across 4 benchmarks and 3 baseline classes (direct LLM / baseline planner / SOTA methods like PlanGEN, ToT, BoN), plus a module-level ablation matrix |
| Evidence maturity | Substantial — covers both single-task and multi-task experiments, ablations, and token/cost analysis; the authors honestly report no statistical significance on GPQA |
| Reproducibility | Partial artifacts — full prompts and pseudocode are in the appendix, but the abstract makes no code-release commitment |
| Why selected | Direct — planning is the most upstream link before agent execution, directly affecting downstream tool-call correctness |
| Novelty | Substantive — splitting generation/revision/verification into three context-isolated modules is a structural change from existing frameworks like PlanGEN, not a prompt tweak |
| Today's importance | High — planning collapse under multi-task load is a common pain point in real agent platforms |
| Practical link | Clear — the ablation shows adding the exploration module without global constraints crashes accuracy from 40.8% to 10.9%, directly informing the "should we add a planning module" architecture decision |
| Editorial confidence | High — sufficient to support the bounded claim that "structured planning beats direct planning on these specific benchmarks" |
| Reading recommendation | Must-read — teams building multi-step scheduling/planning agents |
| Primary limitation | GRASP(GPT-4o)'s accuracy gain comes at roughly 13.5x the compute cost; no statistically significant improvement on GPQA |

### Field Background

LLM agents handling multi-step tasks commonly either think and act as they go (ReAct, Reflexion), or stuff all constraints, variables, and steps into one monolithic context. As task complexity rises, this triggers a "Curse of Instructions" — constraints collide with each other, and the model starts hallucinating or missing constraints. Methods like PlanGEN and Tree-of-Thoughts try to ease this through search or multi-agent division of labor, but usually still stack information within the same context.

### Mid-Level Walkthrough

- **The problem**: Imagine asking an agent to schedule a week of meetings while also handling a separate travel-request approval. As tasks multiply, agents often mix up constraints between the two — not realizing a time it promised on one side conflicts with the other.
- **The method**: GRASP works in three steps. GenPlan first reads the task, extracts "hard constraints" and "soft guidelines" into a shared knowledge base — without looking at the specific instance yet; RevPlan then plugs in the instance and explores different strategies across separate, isolated contexts (the ablation shows 3 strategies is the sweet spot; 4 performs worse); VerPlan is an independent judge that picks the best version using multiple criteria. The three modules don't share reasoning traces — only the structured knowledge-base content.
- **Why it matters**: The ablation proves that adding "exploration" without "global constraints" is a disaster (10.9%) — planning quality isn't improved by thinking more, it's improved by fixing the boundaries first. That's a concrete architectural signal for teams designing an agent's planning layer.

### Key Findings

- Natural Plan Calendar Scheduling: GRASP(GPT-4o) hits 74.3%, 12.4 points above the direct GPT-4o planner; GRASP(GPT-4o-mini) even beats the direct GPT-4o planner by 11.3 points
- ZebraLogic: GRASP(GPT-4o) reaches 61.4% vs. 30.6% for the direct planner (+30.8 points)
- Under dual-task settings, standard planners collapse (GPT-4o drops from 45.8% single-task to 30.5% dual-task); GRASP(GPT-4o) holds at 45.7% and rises to 46.6% under triple tasks
- GRASP(GPT-4o-mini) beats GPT-5-mini — an actual reasoning model — by 14.5 points on dual tasks
- Deployment threshold: GRASP(GPT-4o) costs about 13.5x direct planning in tokens; switching to GPT-4o-mini gets an 11.3% accuracy gain at roughly 0.95x cost — a more practical deployment choice
- Limitation: On GPQA (knowledge-intensive QA), GRASP shows no significant advantage over direct planning, which the authors acknowledge themselves

### Reviewer's One-Liner

The ablation study is honest and unflinching — even reporting its own null result on GPQA, which is more trustworthy than papers that only cherry-pick flattering numbers; but note the GPT-4o version's 13.5x compute cost isn't worth it in every setting.

### Your Take-Away

- If you're building multi-step scheduling/planning agents: adopt GRASP's ordering directly — fix global constraints first, then explore locally; the ablation proves doing it backwards collapses performance
- If you're evaluating whether to add a planning module: benchmark against the GPT-4o-mini version's cost-benefit (0.95x cost, 11.3% accuracy gain) as the floor, not the most expensive GPT-4o configuration

---

## Paper Two | PlanGuard: Check Whether the Whole Plan Is Safe Before the Agent Acts

**PlanGuard: A Guardrail for Multi-Step Plan Safety in Embodied Agents**
Junchi Chen, Changtao Miao, Yuxiao Xiang et al. (Anhui Province Key Laboratory of Digital Security + The University of Hong Kong + Ant Group) · arxiv: 2609.32801

Links: [arxiv](https://arxiv.org/abs/2609.32801) · [alphaxiv](https://www.alphaxiv.org/abs/2609.32801)

### TL;DR

Existing safety guardrails only judge whether a single step is safe. PlanGuard instead evaluates a complete multi-step plan at once, and a 2B model reaches 87.15% accuracy and 87.21% F1 averaged across four test subsets — 31.27 F1 points above the strongest general-purpose safety-guardrail baseline.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (not yet peer-reviewed) |
| Citation velocity | Published 4 days ago, Semantic Scholar shows 0 citations (too new) |
| Institution | Anhui Province Key Laboratory of Digital Security + The University of Hong Kong + Ant Group (Ant Digital Technologies) |
| Community signal | Not on HF Daily Papers / no Papers with Code repo (search surfaced an unrelated same-titled paper from May 2026 — worth not confusing the two) |
| Credibility | Pass — the body provides a full dataset-construction pipeline (13,692 train / 1,992 test), comparisons against three baseline classes, training ablations, and a full-vs-stepwise controlled experiment |
| Evidence maturity | Substantial — tested on In-Domain plus three held-out subsets (scene/hazard/planner), with an independent 100-pair diagnostic set validating the core hypothesis |
| Reproducibility | Partial artifacts — the abstract explicitly states "Code and dataset will be publicly released," but no link was available at time of writing |
| Why selected | Direct — a concrete engineering solution for the last safety gate before embodied agents are deployed |
| Novelty | Substantive — the first physical-risk detector that evaluates a complete multi-step plan rather than step by step, with a diagnostic set directly proving step-wise methods miss cross-step risk |
| Today's importance | High — embodied/manipulation agents are rolling out fast, and the general-purpose guardrail LLaMA-Guard-4 scores only 29.55% F1 on this kind of risk, a clear safety gap |
| Practical link | Clear — Full-plan mode beats Stepwise mode by 6.48-15.04 F1 points and needs only one model call, directly informing pipeline architecture decisions |
| Editorial confidence | High — cross-validation across four subsets plus an independent diagnostic set is enough to support the specific claim that "full-plan evaluation beats stepwise evaluation" |
| Reading recommendation | Must-read for teams building robotics/embodied manipulation agents; skim for text-only agents (the risk model doesn't directly apply) |
| Primary limitation | Safety labels rely on consensus among three judge models rather than expert human review; no real-robot deployment validation yet |

### Field Background

When embodied agents (robots/home assistants that manipulate the physical world) use a VLM to plan tasks, a multi-step plan can look safe at every individual step yet still be dangerous once combined — turning on a gas burner and placing napkins beside the stove are each fine on their own, but together create a fire risk. Prior safety mechanisms were either general content moderation, or step-by-step checks like EMBGuard — neither can catch risk arising from the interaction between steps.

### Mid-Level Walkthrough

- **The problem**: Imagine your home robot gets the instruction "heat up dinner for me," and plans "turn on the burner" → "set napkins beside the stove for later." Each step looks reasonable alone, but their combined execution order puts napkins next to an open flame.
- **The method**: PlanGuard built a 16K-plan annotated dataset (MSP-Safe), where each item pairs a safe and a risky version of the same scenario, judged by a panel of three models. Training starts with ordinary supervised fine-tuning, then "Strong-Teacher Adaptive Compensation for On-Policy Distillation" (STAC-OPD) transfers judgment from a large model (27B) into compact models (0.8B/2B) — the key design is probability routing: if the small model already leans toward the correct answer, training continues on its own generated output; only when it drifts from the correct decision does training switch to a teacher-reconstructed target.
- **Why it matters**: The authors used an independent 100-pair diagnostic set to directly validate that evaluating the whole plan at once beats piecing it together step by step — not an abstract architectural claim, but a concrete engineering conclusion backed by a controlled experiment.

### Key Findings

- PlanGuard-2B averages 87.15% ACC / 87.21% F1 across four test subsets; PlanGuard-0.8B averages 82.18% ACC / 82.25% F1
- Beats the strongest general-purpose VLM baseline (Qwen3.5-Plus) by 5.73 F1 points; beats the strongest safety-guardrail baseline (GuardTrace-VL-3B) by 31.27 F1 points; beats the stepwise guardrail EMBGuard-2B by 18.25 F1 points
- The general-purpose guardrail LLaMA-Guard-4-12B scores only 29.55% F1 on this kind of physical risk — semantic safety and physical safety are not the same thing
- Full-plan evaluation beats Stepwise evaluation by 6.48-15.04 F1 points on the diagnostic set; EMBGuard shows no improvement under Full mode, proving the gap comes from the method, not the data
- Training ablation: plain SFT alone lifts F1 from a 64.38% base to 78.96% — the single largest contribution; STAC-OPD adds 2.5 more points, Hard Compensation another 0.78
- Deployment threshold: requires building paired safe/risky annotated data like MSP-Safe, and training needs roughly 8x A800-class GPUs
- Limitation: safety labels come from consensus among three judge models rather than item-by-item expert human review; no real-robot deployment data provided yet

### Reviewer's One-Liner

Using a paired (same-scenario safe/risky) dataset plus an independent diagnostic set to directly test the core "full-plan vs. stepwise" hypothesis is the strongest part of this paper; but the safety labels rely entirely on model judges without expert human review or real-robot testing, so large-scale deployment still needs more validation.

### Your Take-Away

- If you're building embodied/robotics agents: move safety checking from stepwise filtering to full-plan evaluation before execution — the ablation proves this architectural choice alone is worth 6-15 F1 points
- If you're evaluating a general-purpose safety model as a guardrail: this paper's baseline comparison is a ready-made warning — LLaMA-Guard-4 scores only 29.55% F1 on physical risk, and general content moderation doesn't transfer to physical action scenarios

---

## Paper Three | LIMBO: Don't Ask the Model Whether It Double-Charged You — Ask the Contract

**Where Does Exactly-Once Live? Model, Harness, and Tool-Contract Effects on Duplicate Side Effects in LLM Agents**
Jiapeng Li (Microsoft) · arxiv: 2609.29095

Links: [arxiv](https://arxiv.org/abs/2609.29095) · [alphaxiv](https://www.alphaxiv.org/abs/2609.29095)

### TL;DR

Across 25,930 controlled episodes testing 9 models and 3 production harnesses: when a read-back can reveal the outcome, models avoid duplication on their own (top models duplicate only 0.5% of the time); when it can't (the request is still in flight, or gets redelivered), even the strongest models duplicate 56-74% of operations — only giving tools an idempotency key drops the duplicate rate from 28% to 4%. And in 90% of episodes that produced a duplicate, the agent still reported the task as completed.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (not yet peer-reviewed) |
| Citation velocity | Published 6 days ago, Semantic Scholar shows 0 citations (too new) |
| Institution | Microsoft (sole author) |
| Community signal | No HF Daily Papers / Papers with Code appearance; a third-party GitHub research digest (jjakimoto/research-issues) reposted a summary the day after publication |
| Credibility | Pass — a factorial experiment design across 25,930 episodes, 9 models, 3 production harnesses, and 12 fault modes, plus formal propositions with proofs and preregistered statistical tests |
| Evidence maturity | Substantial — full cross-experiment coverage of the model, harness, and contract layers, and honestly flags which preregistered hypotheses (e.g. harness share ≥10%) were not supported |
| Reproducibility | Full artifacts — explicitly commits to "Code and data will be made available upon publication," releasing every episode's complete trace |
| Why selected | Direct — the correctness of tool-call side effects is something every production agent deployment has to face |
| Novelty | Substantive — the first paper to causally attribute "who is responsible for exactly-once" across model/harness/contract layers via Shapley decomposition, rather than just re-measuring duplicate rates |
| Today's importance | High — directly actionable engineering conclusions (add idempotency keys, avoid transparent retries) with immediate value for any team building tool-calling agents |
| Practical link | Clear — the conclusion converts directly into a product checklist: "does every write-type tool of yours have an idempotency key?" |
| Editorial confidence | High — a large-scale factorial experiment plus formal proofs is enough to support the paper's specific claims, and the author is candid about which hypotheses weren't supported |
| Reading recommendation | Must-read for every engineering team building tool-calling/write-operation agents |
| Primary limitation | Sole author, not yet peer-reviewed; the sandbox is six simulated services rather than real production systems, so external validity against real environments is still pending |

### Field Background

When an agent calls an external tool to write data (charge a card, send an email, trigger a deployment), the network request can time out or error — but that doesn't mean the action didn't actually happen. The usual response is to retry, but retrying when the request already took effect duplicates the side effect. Distributed systems solved this same ambiguity years ago with interface-layer mechanisms like idempotency keys, but agents inherit the ambiguity by default without inheriting those remedies.

### Mid-Level Walkthrough

- **The problem**: Imagine an agent sending an announcement email on your behalf, and the request times out. Did the email actually go out? The agent can't tell — this looks identical to "the request truly never arrived." Retrying might send it twice; not retrying might send nothing at all.
- **The method**: The author built a sandbox called LIMBO with six services and twelve fault modes — including "the request is still in flight" and "redelivered twice," two cases prior research hadn't tested — with every operation graded against a ground-truth ledger of what actually committed. The same models and tasks were run once under a minimal scaffold and once under three production harnesses (GitHub Copilot CLI, Hermes, Codex CLI), then statistically decomposed to attribute the "duplicate" outcome across the model, the harness, and the tool contract.
- **Why it matters**: The breakdown is counterintuitive — people often assume a smarter model or a stricter harness solves reliability, but the data shows: when a read-back can resolve the fault, the model does carry 53% of the responsibility; once it can't, no amount of model or harness quality helps, and 81% of the blame falls on the contract layer (whether an idempotency key exists).

### Key Findings

- Faults an immediate read-back can resolve (lost acknowledgement, misleading 500 errors): top models duplicate only 0.5% of the time, with the model explaining 53% of the variance
- Faults a read-back cannot resolve (late commits still in flight, redelivered messages): the same top models duplicate 56% of late-commit and 74% of redelivery episodes, with the contract explaining 81% of the variance
- The paper proves (Proposition 1): without a known bound on how late a request can still commit, verify-then-retry alone can never be exactly-once
- Once idempotency keys are offered, the duplicate rate drops from 28% to 4% (agents attach keys in 98% of opportunities even without being told to)
- Switching harnesses barely matters: three production harnesses plus a minimal scaffold behave almost identically; but "transparent client-side retry," a common engineering pattern, is actively harmful — it cuts exactly-once success from 72% to 50%
- Waiting as a substitute for keys: works under a fixed short delay (waiting 120 seconds reaches 99% success), but real-world delays are heavy-tailed — even waiting an hour only covers 82% of cases, far worse than simply adding idempotency keys
- Limitation: sole author, a sandbox of six simulated services rather than a re-run against real production systems, so external validity is still unverified

### Reviewer's One-Liner

25,930 episodes of factorial design plus formal proofs turn "agent reliability" — often treated as a soft problem — into hard engineering research with causal attribution; but it's still a simulated sandbox, and real production services may behave more complexly than six simulated ones, so how far the conclusions generalize is worth watching.

### Your Take-Away

- If you're designing write operations for a tool-calling agent: first check whether every external API you call has an idempotency key — if not, this paper's numbers (28% → 4% duplicate-rate gap) are the quantified case for adding one
- If your framework/SDK has built-in automatic retries: re-examine that transparent-retry logic — this paper shows it drags exactly-once success from 72% down to 50%, because deciding for the model behind the scenes backfires

---

## Today's Takeaway

I used to think "unreliable agents" was mainly a model-capability problem — not thinking far enough ahead, not planning carefully enough. Today's three papers together show otherwise: even when the planning logic is correct (GRASP) and dangerous plans get blocked (PlanGuard), an agent can still duplicate an action after execution without knowing it (LIMBO's 90% self-reported completion rate). The last mile of reliability is often not about how smart the model is, but about whether the tool contract gives it an interface-layer guarantee like an idempotency key.

## References

- [GRASP: Generating, Revising, and Assessing for Strategic Planning with Agentic AI](https://arxiv.org/abs/2609.30147)
- [GRASP — alphaxiv](https://www.alphaxiv.org/abs/2609.30147)
- [PlanGuard: A Guardrail for Multi-Step Plan Safety in Embodied Agents](https://arxiv.org/abs/2609.32801)
- [PlanGuard — alphaxiv](https://www.alphaxiv.org/abs/2609.32801)
- [Where Does Exactly-Once Live? Model, Harness, and Tool-Contract Effects on Duplicate Side Effects in LLM Agents](https://arxiv.org/abs/2609.29095)
- [LIMBO — alphaxiv](https://www.alphaxiv.org/abs/2609.29095)
- [LIMBO — third-party research digest](https://github.com/jjakimoto/research-issues/issues/1755)
- [Semantic Scholar API](https://api.semanticscholar.org/graph/v1/paper/ARXIV:2609.29095)
- [HuggingFace Daily Papers](https://huggingface.co/papers)
