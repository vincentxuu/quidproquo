---
title: "AI Agent Arxiv Digest — 2026-10-02"
date: 2026-10-02
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's three papers cover design details of agent systems that are easy to overlook — a deep research agent's plan should grow incrementally instead of being committed all at once, a coding agent can borrow out-of-order execution from hardware to stop idling, and letting agents see each other's model family may be quietly degrading your multi-agent system"
tldr: "DAGent's Evaluate-then-Grow planning beats the strongest open-source baseline on BrowseComp-Plus, GAIA, and xbench-DeepSearch and is accepted at NeurIPS 2026; TomasuLLM borrows out-of-order speculative execution from hardware to speed up coding agents by 1.27x-1.35x across three benchmarks with zero false accepts across 4,010 audited records; a Sapienza University study finds that letting agents see each other's model family drops a cooperative task's success rate from 96% to 81%, costing 30% more rounds and 55% more tokens"
series:
  name: "AI Agent Arxiv Digest"
  order: 131
---

> 🌏 [中文版](/posts/daily/2026-10-02-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers look at the same underlying issue from three different angles: the next gains in agent performance and reliability may not come from a stronger model, but from design details that are easy to overlook — how an agent plans, how it schedules execution, and how agents interact with each other. DAGent tackles how a deep research agent should plan: rather than committing to a full task graph up front and patching it later, it grows the graph incrementally, and the paper has already passed peer review at NeurIPS 2026. TomasuLLM tackles why coding agents keep idling: it borrows the old idea of out-of-order execution from processors, letting an agent prepare later steps while a tool call is still running. Prompted Identity Degrades Cooperation offers a warning for anyone building multi-agent systems that mix models from different providers: simply letting agents know each other's model family measurably hurts cooperation, even when the task gives them no incentive to split into groups. Put together, the three suggest that the next round of gains in agent systems may sit in these overlooked design details — planning, scheduling, and interaction surfaces — rather than in swapping in a bigger model.

## Terms worth knowing before reading

| Term | Plain explanation |
|---|---|
| Agent | An AI system that plans its own steps, calls tools, and iterates toward a goal — not a single-turn question-and-answer chatbot |
| Deep research agent | An agent that must search across many sources, synthesize evidence, and adjust its plan as findings emerge — e.g. automated literature review or market research |
| DAG-based multi-agent system | A system that uses a directed acyclic graph to describe dependencies between sub-tasks, so independent sub-tasks can run in parallel while keeping separate contexts |
| Speculative execution | Guessing and starting work on a result before it's confirmed to be needed, then deciding whether to keep or discard it once the real result is known — the same idea behind out-of-order execution in CPUs |
| Factionalism | The paper's term for agents spontaneously forming "in-group" clusters once they know each other's identity labels (e.g. model family), even when nothing in the task calls for it |
| GRPO | A reinforcement learning algorithm that has the model generate several answers to the same problem, compares them against each other, and updates weights based on relative performance — commonly used recently to train multi-step agent reasoning |

---

## Paper One | DAGent: A Deep Research Agent's Plan Shouldn't Be Committed All at Once

**DAGent: Evaluate-then-Grow Planning for Deep Research Agents**
Hanwen Liu, Yuanfu Sun, Qiaoyu Tan (New York University Shanghai) · arxiv: 2609.39154

Links: [arxiv](https://arxiv.org/abs/2609.39154) · [alphaxiv](https://www.alphaxiv.org/abs/2609.39154)

### TL;DR

Instead of planning out a full task graph up front and patching it when things go wrong, DAGent has an Orchestrator grow the graph one batch at a time, conditioned on confidence and uncertainty signals from completed nodes; across BrowseComp-Plus, GAIA, and xbench-DeepSearch it beats the strongest open-source baseline by 5.3 / 5.8 / 2.0 points at the Qwen3-235B-A22B scale, and the paper is accepted at NeurIPS 2026.

### Editorial Assessment

| Dimension | Judgment |
|---|---|
| Venue | NeurIPS 2026 (accepted — explicitly noted in the paper's Comments field) |
| Citation velocity | Published 2 days ago; Semantic Scholar API returned 429 (rate limited) on every retry this round, so no citation count could be obtained |
| Institution | New York University (Shanghai campus) |
| Community signal | 2 upvotes on HuggingFace Daily Papers; official GitHub repo is public (1 star, only 2 days old) |
| Credibility | Pass — five baseline agent comparisons (ReAct, Summary, Fold, Flash-Searcher, FlowSearch), three benchmarks, four open-source backbones plus an extension to GPT-5, with full Pass@1 tables |
| Evidence maturity | Substantial — main-result tables across multiple benchmarks and backbones are complete, but the RL component is only validated at small scale on a single backbone (Qwen3-8B) |
| Reproducibility | Partial artifacts — official code is public, but RL training used only 3 seeds and 21 update steps, so reproducing results at larger scale still requires extending the setup |
| Why this paper | Direct — it tackles the central planning question for deep research agents head-on and proposes a testable alternative |
| Novelty | Substantive — replaces the existing Plan-then-Patch DAG multi-agent paradigm with incremental, evidence-conditioned planning, plus a matching topology-aware RL signal |
| Today's importance | High — deep research products are growing fast, and the choice of planning strategy directly affects both accuracy and compute cost |
| Practical link | Clear — gives any team building DAG-based multi-agent orchestration (automated market research, literature review tools) a directly comparable alternative planning strategy |
| Editorial confidence | High — sufficient to support the scoped claim that "incremental planning outperforms the existing Plan-then-Patch paradigm on the three retrieval-heavy benchmarks tested" |
| Recommended reading | Must-read — teams designing or evaluating deep research agent architectures |
| Primary limitation | RL training only ran on Qwen3-8B with LoRA for 21 steps across 3 seeds; the paper itself notes the link between structural compliance and accuracy is correlational, not causal |

### Background

Deep research tasks require an agent to move across many information sources, synthesize evidence, and revise its plan as findings emerge. DAG (directed acyclic graph)-based multi-agent systems fit this setting well because they support parallel execution and isolate each sub-task in its own dependency context. But existing approaches are mostly "Plan-then-Patch": the full task graph is instantiated before execution begins, and only repaired later when failures or missing evidence appear. The problem is that evidence is weakest right at the start of deep research — exactly when the system is forced to make its most committed planning decisions — and later patches often just clean up branches that should never have been planned in the first place.

### Mid-level Walkthrough

- **The problem**: imagine doing market research where, at the very start when you have almost no data, you're required to lock in the full outline and exactly which sources each section will draw on. Once you realize the direction is wrong, fixing it costs far more than if you had adjusted as you went.
- **The method**: DAGent has an Orchestrator role grow the task graph one batch of new nodes at a time, deciding what to look into next based on confidence and uncertainty signals returned by already-completed nodes, rather than planning everything up front. To keep long task contexts manageable, the system propagates compact QueryDocs summaries by default while keeping the full execution trace available for on-demand recall. The paper also introduces DAGRPO, a reinforcement learning signal that is aware of the task graph's topology — the executor's learning signal accounts for its position in the graph, and the orchestrator's training adds a structural-compliance regularization term.
- **Why it matters**: for any product doing automated research, market analysis, or literature review that requires multi-step retrieval and synthesis, the choice of planning strategy directly shapes both accuracy and compute cost. DAGent shows that "deciding later, but on more evidence" outperforms the existing approach across three independent benchmarks.

### Deep Dive

- Using the Qwen3-8B backbone as a concrete example (from the paper's published results table): BrowseComp-Plus average Pass@1 is 40.0% vs. the strongest baseline Flash-Searcher's 34.7%; GAIA average is 46.6% vs. 38.8%; xbench-DeepSearch average is 60.0% vs. 55.0%
- The paper's headline claim is measured at the Qwen3-235B-A22B scale, where DAGent beats the strongest open-source baseline by 5.3 / 5.8 / 2.0 points across the three benchmarks respectively, and this margin reproduces across four open-source backbones and extends to GPT-5 at 327K context
- At the Qwen3-8B scale, DAGRPO improves over a same-budget outcome-only GRPO baseline by 3.0 average Pass@1 points
- A same-architecture comparison shows evidence-conditioned planning reaches higher accuracy than the Plan-then-Patch version at matched per-task token, tool-call, and step counts — the gain isn't bought with more compute
- Baselines include two existing DAG-based systems, Flash-Searcher and FlowSearch (the latter reproduced from the authors' own released implementation, but only tested at Qwen3-32B due to when that code became available)
- Limitations (from the paper's Appendix F): DAGent is text-native, so multi-modal attachments must be converted to text before planning; the link between structural compliance and accuracy is correlational rather than causal; RL was only trained at small scale on a single backbone, so whether gains hold at larger training scale remains untested

### Reviewer's One-Line Take

Replacing "plan then patch" with "grow as you go" is an intuitively sound idea that few papers have paired with this level of topology-aware RL detail, and the five-baseline, four-backbone reproducibility work is solid; but the RL component was only validated on one small backbone with very few training steps, and the paper itself is careful to call the link between structural compliance and accuracy correlational rather than causal — that part needs validation at larger training scale.

### Takeaways for You

- If you're building DAG-based multi-agent orchestration (automated research, market analysis, literature review tools): evaluate having the Orchestrator grow the task graph dynamically based on confidence signals from completed nodes, rather than planning everything up front — especially for tasks where evidence starts out thin
- If you're designing the RL training signal for multi-step agents: DAGRPO folds the task graph's topology into credit assignment, which is worth validating at small scale on your own DAG-based system before committing to a larger training budget

---

## Paper Two | TomasuLLM: Borrowing Out-of-Order Execution from Hardware to Stop Coding Agents From Idling

**TomasuLLM: Out-of-Order Speculative Execution for LLM Agents**
Jiangnan Yu, Ceyu Xu, Mengming Li et al. (The Hong Kong University of Science and Technology, with co-authors from Nanjing University, King Abdullah University of Science and Technology, and Zhejiang Lab) · arxiv: 2609.38201

Links: [arxiv](https://arxiv.org/abs/2609.38201) · [alphaxiv](https://www.alphaxiv.org/abs/2609.38201)

### TL;DR

Borrowing the design of out-of-order CPU execution for coding agents: before a tool call finishes, TomasuLLM speculatively starts later steps and validates them afterward; across three benchmarks spanning sub-second to minutes-long tool latency it speeds things up by 1.31x, 1.35x, and 1.27x respectively, with zero false accepts across 4,010 audited records.

### Editorial Assessment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (not yet peer reviewed) |
| Citation velocity | Published 10 days ago; Semantic Scholar API returned 429 (rate limited) on every retry this round, so no citation count could be obtained |
| Institution | The Hong Kong University of Science and Technology (majority of authors); with co-authors from Nanjing University, King Abdullah University of Science and Technology, and Zhejiang Lab |
| Community signal | Not found on HuggingFace Daily Papers or Papers with Code; no clear community signal yet |
| Credibility | Pass — three independent benchmarks, a correctness audit across 4,010 commit-validation records, and an explicit distinction between "measured" and "trace-replay estimated" numbers |
| Evidence maturity | Substantial — multiple benchmarks plus a sensitivity analysis, but sample sizes are modest (100/28/18 tasks), and some sandbox-concurrency settings are replay estimates rather than actual measured runs |
| Reproducibility | Not provided — the system is built on top of Pi (v0.84.2), an open-source coding-agent harness, but no code release link for TomasuLLM's own runtime was found in the paper |
| Why this paper | Direct — it tackles one of the most common pain points in deployed coding agents: waiting on long tool calls like compilation and tests |
| Novelty | Substantive — systematically ports the mature idea of out-of-order execution from processor architecture to LLM agent tool-call scheduling, with a matching correctness-validation mechanism |
| Today's importance | Medium — relevant to any coding agent running long tool chains, but the validation scale is still limited, short of "adopt this now" |
| Practical link | Clear — offers a quantifiable speedup path specifically for tool calls with sub-second to minutes-long latency, like compilation, tests, and repo commands |
| Editorial confidence | Medium — sufficient to support the scoped claim that "out-of-order speculative execution delivers a measurable speedup without sacrificing correctness on the three benchmarks and limited samples tested," but the sample size limits confidence in extrapolating further |
| Recommended reading | Skim — useful reference for engineering teams optimizing coding-agent execution efficiency; general readers can just grasp the core mechanism |
| Primary limitation | Only 100 SWE-bench Verified tasks, 28 Terminal-Bench 2.0 tasks, and 18 SWE-Marathon sessions were tested — modest sample sizes; some sandbox-concurrency speedup numbers (16, 32 slots) are trace-replay estimates, not actually measured re-runs |

### Background

Coding agent latency is often not bottlenecked by the LLM's own generation, but by waiting on compilers, test suites, and repo commands to finish — tool calls that can take seconds to minutes, during which the agent sits completely idle. This echoes the problem early single-core processors faced: a sequential interface hides work that could have started earlier. Processor design later solved this with out-of-order execution, but porting the same idea to agents raises a key question: how do you validate that a speculative result hasn't broken the task's correctness?

### Mid-level Walkthrough

- **The problem**: imagine a coding agent fixes a bug and then needs to run a test suite that takes 2 minutes. The old approach has the model sit idle the whole time, waiting for the result before deciding what to do next. But many later steps — checking another file, preparing the next edit — often don't actually depend on this test's outcome, and could be started early.
- **The method**: TomasuLLM has two speculation steps. An Action Drafter guesses the next tool call to make without waiting for the current one to finish, and an Observation Drafter then guesses what that tool call will return — the guessed result becomes the provisional basis for drafting even further ahead, letting several steps chain speculatively. Each guess runs in its own isolated copy-on-write sandbox. An "operand rule" decides scheduling: a tool call can run immediately if everything it reads is already settled, or it's prepared early but held until a pending dependency settles if not. All results are finally validated and committed in the original execution order, checked against stale state — if validation fails, that branch is simply re-run from scratch rather than letting a wrong result through.
- **Why it matters**: this means a coding agent doesn't need its decision logic redesigned at all — just adding a scheduling layer at the execution level turns previously idle waiting time into useful early work, which is relevant to any agent system running long tool chains.

### Deep Dive

- Speedup across three benchmarks (vs. a sequential baseline): 1.31x on 100 SWE-bench Verified tasks, 1.35x on 28 Terminal-Bench 2.0 tasks, 1.27x matched progress across 18 SWE-Marathon sessions
- Correctness validation: zero false accepts across 4,010 audited commit-validation records — the safety of speculative execution comes entirely from post-hoc validation, not from guessing correctly
- The paper is explicit about which numbers are measured vs. estimated: at the configuration actually used in the reported runs (chain depth K=6, 8 sandbox slots), the SWE-Marathon sensitivity analysis measures a real 2.05x speedup; the 16- and 32-slot numbers are trace-replay estimates computed from the recorded dependency graph, with the authors stating plainly that only the 8-slot point was actually run, because that's the maximum their E2B account allows
- The system is built on top of Pi (v0.84.2), an open-source coding-agent harness; setting the speculation chain depth to 0 recovers the paper's "Serial Pi" baseline, giving a clean, fair comparison
- Which actions count as "speculation barriers" that must run serially is clearly defined: file edits whose content depends on something not yet read, service restarts, checkpoints, and final submissions
- Limitations: all three benchmarks use modest task counts (100/28/18), and the authors themselves acknowledge that some concurrency-setting speedup numbers are replay estimates from the dependency graph rather than actual re-run measurements

### Reviewer's One-Line Take

Cleanly separating "speculation" from "validation," with correctness resting entirely on post-hoc validation rather than on how good the speculation is, is a solid safety boundary; but all three benchmarks use small sample sizes, and the authors themselves admit some speedup numbers are dependency-graph replay estimates rather than measured runs — worth waiting for larger-sample follow-up before extrapolating to bigger deployments.

### Takeaways for You

- If you're optimizing coding-agent execution latency: first map out which of your tool calls are "seconds-to-minutes" long-latency calls (compilation, tests, repo commands) — that's where the theoretical speedup is largest; TomasuLLM's "operand rule" (only run ahead on reads that are already settled) is a scheduling logic you can borrow directly
- If you're designing a speculative-execution-style system: this paper demonstrates a key principle — a speculative result can never be its own proof of correctness; safety requires an independent post-hoc validation mechanism (here, Trace IR validation), and that boundary is worth copying

---

## Paper Three | Exposing Model Identity Degrades Multi-Agent Cooperation

**Prompted Identity Degrades Cooperation in Multi-Agent LLM Systems**
Xavier Del Giudice, Alessio Palma, Matteo Migliarini et al. (Sapienza University of Rome) · arxiv: 2609.35928

Links: [arxiv](https://arxiv.org/abs/2609.35928) · [alphaxiv](https://www.alphaxiv.org/abs/2609.35928)

### TL;DR

Letting agents in a multi-agent system see each other's model family causes the group to spontaneously split into "in-group" clusters, even when the task gives them no incentive to do so; in purely cooperative tasks, groups aware of identity spend 30% more rounds and 55% more tokens on average, and their success rate drops from 96% to 81%.

### Editorial Assessment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (not yet peer reviewed) |
| Citation velocity | Published 4 days ago; Semantic Scholar API returned 429 (rate limited) on every retry this round, so no citation count could be obtained |
| Institution | Sapienza University of Rome |
| Community signal | Not found on HuggingFace Daily Papers or Papers with Code; no clear community signal yet |
| Credibility | Pass — an unlabeled permutation baseline, a shuffled/mislabeled causal control, replication across tasks and model families, 50 runs per configuration with 95% bootstrap confidence intervals |
| Evidence maturity | Substantial — two custom-designed cooperative games plus a ground-truth reasoning benchmark (GPQA-Diamond) for cross-validation, with a generalized linear model used to rule out roster-size confounds |
| Reproducibility | Not provided — no code or dataset release link was found in the paper |
| Why this paper | Direct — it tackles a real design decision anyone building multi-provider, multi-agent systems has to make |
| Novelty | Substantive — the first systematic quantification of how the identity label itself, independent of underlying model capability differences, drives cooperation cost in multi-agent systems |
| Today's importance | High — multi-agent architectures mixing models from different providers are spreading quickly, and this finding bears directly on a common design choice: whether to expose agents' identity metadata to each other |
| Practical link | Clear — the paper's own mitigation (don't expose model identity into the agents' interaction context) can be applied immediately to a multi-agent system already being designed |
| Editorial confidence | High — sufficient to support the scoped claim that "exposing identity labels, independent of model capability, drives cooperation cost in the cooperative games and reasoning benchmark tested" |
| Recommended reading | Must-read — any team designing multi-agent orchestration that mixes models from different providers |
| Primary limitation | Tested only with up to 5 open-weight model families, text-only, in cooperative games designed by the research team itself; whether the effect replicates with larger rosters, closed models, and real-world agentic workflows remains untested |

### Background

As multi-agent systems increasingly mix models from different providers — say, a coordinator from one provider and executors from another open-weight family — the usual focus is whether the underlying models are capable enough. Few have carefully examined whether the seemingly incidental metadata choice of letting agents know each other's model identity carries its own cost. Sociology has long described homophily — the tendency to interact more with similar others — but whether this emerges spontaneously in purely text-based LLM-agent groups with no identity-driven incentive had not been tested under controlled experiments before.

### Mid-level Walkthrough

- **The problem**: imagine assembling a team of nine to twenty-five agents drawn from five different open-weight model families, tasked with cooperating toward a shared, purely group-level reward with no individual incentive. What happens if every agent can see its teammates' model-family label during interaction?
- **The method**: the researchers designed two purely cooperative games and used a ground-truth reasoning benchmark, systematically manipulating whether agents could see each other's identity labels: no labels at all (control), true labels, or labels that were shuffled or replaced with arbitrary tags unrelated to the real architecture. They used Adjusted Mutual Information (AMI) to quantify how closely the clusters that actually formed through interaction matched the label-based grouping, and a statistical model to compare rounds, token consumption, and success rate across conditions.
- **Why it matters**: the results show that as long as agents can see an identity label — even a shuffled, arbitrary one with no connection to the real architecture — the clustering still follows that label, and the effect disappears once the label is removed. This proves the cooperation cost comes from the label itself, not real differences in model capability — a cost that any team planning to mix models from multiple providers in a multi-agent system can avoid outright.

### Deep Dive

- Core statistic, AMI (Adjusted Mutual Information, measuring how closely the clusters that form through actual interaction match the label-based grouping — 0 means unrelated, 1 means perfectly matched): across 12 fully unlabeled experiments, AMI stayed between 0.02-0.08, close to random; across 24 truly labeled experiments, all were significant, with AMI between 0.55-0.76 in the Exclusion game and 0.24-0.53 in Leader Election
- Key causal evidence: after shuffling labels or replacing them with arbitrary tags unrelated to the real model architecture, clustering still significantly followed the shuffled labels (Leader Election AMI 0.18-0.35, Exclusion 0.55-0.69), proving it's the label itself — not underlying capability differences — driving the split
- Quantified cost: in purely cooperative tasks, groups aware of identity spend 30% more rounds and 55% more tokens on average to reach a decision; specifically in the Leader Election game, rounds are 1.4x and tokens 1.8x those of the unlabeled version
- Impact on success: the purely cooperative game's success rate drops from 96% in the unlabeled version to 81% in the labeled version
- The strength of the factionalism effect is similar under both balanced and unbalanced model-family roster compositions, showing that being a numerical majority isn't the main driver
- Cross-validated with the ground-truth GPQA-Diamond reasoning benchmark (paired with the Leader Election interaction protocol), where the same label-induced coordination cost was observed, showing the effect isn't confined to the researchers' own custom games
- Limitations (from the paper's Section 5): the study is scoped to up to 5 open-weight model families, text-only, and cooperative games designed by the research team itself (since no existing benchmark satisfies both "no individual incentive" and controlled evaluation); whether the effect replicates at larger roster sizes, with closed models, under different decoding regimes, or in richer real-world agentic workflows remains untested

### Reviewer's One-Line Take

The causal manipulation showing that shuffled labels still induce clustering, and that clustering disappears once labels are removed, rules out the alternative explanation that underlying model-capability differences are doing the work — the strongest part of this paper's causal reasoning; but the scope is limited to open-weight models, text-only, custom-designed cooperative games, and there's real distance to "this holds in all real-world multi-agent products," which the authors are honest about.

### Takeaways for You

- If you're designing a multi-agent system that mixes models from different providers: check whether your current prompts or system architecture expose identity metadata — model provider, model name — into the context agents can see of each other. The paper's recommendation is direct: this metadata can stay with an upper-level orchestrator for routing and auditing, without being visible to the agents themselves
- If you're evaluating performance bottlenecks in a multi-agent system: beyond checking individual model capability, also check whether some other seemingly unrelated piece of metadata is quietly dragging down cooperation — this paper offers a directly applicable test (remove a given piece of metadata and see whether cooperation cost drops)

---

## Today's Takeaway

I used to think poor multi-agent performance mostly came down to weak models or bad prompts; today's Sapienza study made clear that even a seemingly unrelated metadata choice — whether agents can see each other's model family — can quietly decide whether cooperation succeeds. DAGent and TomasuLLM drive home the same lesson from two other angles: planning should grow as you go rather than being committed all at once, and execution should sneak in useful work during idle waits — these gains in performance and reliability often sit not in a bigger model, but in the design details of how agents interact with each other and with their tools.

## References

- [DAGent: Evaluate-then-Grow Planning for Deep Research Agents](https://arxiv.org/abs/2609.39154)
- [DAGent — alphaxiv](https://www.alphaxiv.org/abs/2609.39154)
- [DAGent — official code](https://github.com/hanwenliu6825/DAGent)
- [TomasuLLM: Out-of-Order Speculative Execution for LLM Agents](https://arxiv.org/abs/2609.38201)
- [TomasuLLM — alphaxiv](https://www.alphaxiv.org/abs/2609.38201)
- [Prompted Identity Degrades Cooperation in Multi-Agent LLM Systems](https://arxiv.org/abs/2609.35928)
- [Prompted Identity Degrades Cooperation — alphaxiv](https://www.alphaxiv.org/abs/2609.35928)
- [HuggingFace Daily Papers](https://huggingface.co/papers)
