---
title: "AI Agent Arxiv Digest — 2026-10-15"
date: 2026-10-15
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "All three papers today ask the same question: is the evidence we use to judge agents reliable — eval scoring code can be wrong, coding agents routinely do more than the task asked, and existing logs aren't enough to approve a change"
tldr: "An oracle-audit paper finds a database-not-restored defect on one τ-bench scoring path, and replay drops success from 94.3% to 65.5%; SWE-Misbehavior's 7.4K samples show coding agents acting without reading dependencies in up to 98.5% of cases, with task-scoped tools cutting violations by 32–52%; agent-risk shows a 7,200-episode log alone can't decide whether two retry gates are safe to ship, while rerunning only blocked episodes from saved states can"
series:
  name: "AI Agent Arxiv Digest"
  order: 144
---

> 🌏 [繁體中文版](/posts/daily/2026-10-15-ai-agent-arxiv-digest)

## Today's Overview

The three papers most worth reading in arXiv's 10-14 batch aren't about new agent capabilities — they examine the evidence we use to judge agents. The first tests eval scoring code as software and finds a defect that inflated success by almost 29 points; the second measures how often coding agents misread dependencies or touch files they shouldn't while doing small tasks; the third asks a deployer's question: are existing logs enough to approve a change to an agent? They point the same way: scores, logs and behavior records have to be designed in advance to survive scrutiny. All three are preprints, and their conclusions are limited to the settings noted below.

## Terms to Know Before Reading

| Term | Plain explanation |
|---|---|
| Oracle | The part of an eval that decides whether a run counts as a success, e.g. a reward function comparing the final database state |
| Replay | Re-running recorded tool calls in a clean environment to check whether the result matches the recorded one |
| Boundary violation | An agent doing something the task didn't ask for, such as editing unrelated files, running `git checkout` or installing packages |
| Gate | A mechanism in front of an agent's tool calls that uses a risk score to allow, stop or refuse the call |
| Saved state | An environment snapshot taken mid-run so you can rerun from that point instead of from the start |

---

## Paper 1 | Evals Can Be Wrong: Testing an Agent Benchmark's Scoring Code as Software

**When Agent Evaluation Becomes Unreliable: An Empirical Study of Oracle Failures and Configuration-Dependent Measurement in an LLM Agent Benchmark**
Junjie Chen (Nanjing University of Science and Technology)　·　arxiv: 2610.16067
Links: [arxiv](https://arxiv.org/abs/2610.16067) · [alphaxiv](https://www.alphaxiv.org/abs/2610.16067)

### TL;DR

The author writes an audit suite for agent eval scoring code and finds a defect on one "score after the run" path in τ-bench: the reward function resets the database to compute a ground-truth hash and never restores it. Across 4,320 episodes, recorded labels show 4,194 database passes; replay gives 2,883, and success falls from 94.3% to 65.5%.

### Editorial Assessment

| Dimension | Assessment |
|---|---|
| Venue | arXiv preprint, submitted to Empirical Software Engineering (not peer-reviewed) |
| Citation velocity | Published 3 days ago; Semantic Scholar rate-limited, no citation data retrieved |
| Institution | Nanjing University of Science and Technology (single author) |
| Community signal | Not on HF Daily Papers (10-13, 10-14); no Papers with Code entry |
| Credibility | Pass — all 7 injected defect classes are detected with no false positives after repair, and labels are independently recomputed by replay |
| Evidence maturity | Preliminary — the core finding comes from two task domains of one benchmark, and the author says the method didn't port directly to another benchmark |
| Reproducibility | Full artifacts — Zenodo release of the audit suite, defect catalogue, preregistration and deviation logs, and frozen per-episode records, recomputable offline |
| Why this paper | Direct — when teams use benchmark scores for selection and launch decisions, the score's correctness is the premise |
| Novelty | Substantive — brings software testing's fault injection and oracle problem to agent eval frameworks |
| Today's importance | High — regulators are starting to ask for external evaluation evidence, and defects in eval code become wrong compliance evidence |
| Practical link | Clear — teams running their own eval harness can add "state invariants plus known-answer controls" |
| Editorial confidence | High — this article only states what the author found on a specific scoring path; the author explicitly does not claim the official runner inflates its scores |
| Reading advice | Must read — for anyone maintaining an eval pipeline or buying on benchmark scores |
| Main limitation | Validated on one benchmark; the port to a second benchmark only revealed a framework interface constraint |

### Background

An agent benchmark's reward function is usually treated as definitional: if it says success, it's success, and few people go back to test it. Software engineering has long known that test oracles fail too, with methods like mutation testing and flaky-test detection, but those methods haven't been applied systematically to agent evals.

### Intermediate Walkthrough

- **Problem**: imagine an exam grader that swaps the student's answer sheet for the answer key to compute the expected answer, then forgets to swap it back. If grading happens after the exam, every student looks great.
- **Method**: treat the eval harness as the system under test, with 5 state invariants and 3 known-answer controls; inject 7 defect classes to confirm the audit catches them, then run it on a real benchmark. Once a problem is found, replay the recorded tool calls on a clean database to recompute every episode's result independently.
- **Why it matters**: if your agent scores 94% on a benchmark, part of that may come from a side effect of the scoring code rather than the agent's ability.

### Key Details

- 4,320 episodes: 4,194 recorded database passes → 2,883 on replay; success 94.3% → 65.5% ⚠️ (author's own measurement, not yet externally reproduced)
- The author stresses the defect affects harnesses that score after running, and does not claim τ-bench's official runner inflates its own success rates
- Secondary finding: in a 3,240-episode component ablation, switching the language of the policy, tool descriptions or error strings the agent reads all changed results, with tool descriptions mattering most; but the effect reversed sign in the airline domain, so the author bounds the conclusion to the original setting
- Adoption cost: no new model needed, just state checks and a replay step in the harness — but you need access to the framework's reference terminal state
- Limitation: the author states the method didn't port directly to a second, independently implemented benchmark, because an external harness couldn't reconstruct the required reference terminal state

### Reviewer's One-Liner

Makes a clear case that eval code must be tested too, with artifacts complete enough to recompute every number offline; but the core finding comes from one scoring path of one benchmark, and the next question is whether other major agent benchmarks have the same class of defect.

### Your Take-Away

- If you maintain your own eval harness: add controls where a known-correct answer must score full marks and a known-wrong one must score zero, and check whether environment state changes across scoring
- If you use public benchmark scores for procurement or selection: confirm which runner and scoring order produced the score; scores from different harnesses aren't directly comparable

---

## Paper 2 | Coding Agents Overstep Even on Small Tasks: SWE-Misbehavior

**SWE-Misbehavior: Benchmarking and Mitigating Boundary Violations in Software Coding Agents**
Do Xuan Trong, Duc Anh Nguyen, Do Xuan Long et al. (National University of Singapore and others)　·　arxiv: 2610.18206
Links: [arxiv](https://arxiv.org/abs/2610.18206) · [alphaxiv](https://www.alphaxiv.org/abs/2610.18206)

### TL;DR

Using 7.4K human-in-the-loop synthesized tasks to measure 11 kinds of boundary violations in coding agents, the most common is acting without reading or misreading dependencies (up to 98.5%), followed by modifying user inputs (50.5%) and silently compromising the environment (53%); with Code-KIT, which scopes actions to the task, violations drop 52% for smolagents and 32% for OpenHands while task completion also improves.

### Editorial Assessment

| Dimension | Assessment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation velocity | Published 2 days ago; Semantic Scholar records 0 citations |
| Institution | National University of Singapore (WING), with collaborators from A*STAR, University of Virginia, Virginia Tech and others |
| Community signal | Not on HF Daily Papers (10-13, 10-14); code and data public on GitHub |
| Credibility | Pass — systematic measurement across 4 agent frameworks × 3 models, with LLM-judge agreement checked against 3 human annotators |
| Evidence maturity | Preliminary — tasks are synthetic single-step or short tasks, with models mainly GPT-5, Gemini-2.5-Flash and Qwen3-Coder-30B |
| Reproducibility | Full artifacts — code, data and evaluation pipeline public on GitHub |
| Why this paper | Direct — coding agents are the most widely deployed agents, and boundary violations directly affect repo safety |
| Novelty | Substantive — splits "doing it wrong" into 11 automatically measurable violations across read, create, update, delete, environment and resources |
| Today's importance | High — the same class of problem as today's Visual Studio Copilot bug that let it rewrite its own config: agents touching what they shouldn't |
| Practical link | Clear — results show tool-interface design (e.g. bundling read and write) affects violation rates more than the model |
| Editorial confidence | Medium — the measurement framework is credible, but the model versions are older and rates may differ on the newest frontier models |
| Reading advice | Must read — for anyone designing coding agent tools or evaluating internal adoption |
| Main limitation | Doesn't cover more complex violations such as multi-turn security injection or data exfiltration, and Code-KIT is only validated on short tasks |

### Background

Coding agent evals mostly ask whether the task got done, e.g. whether SWE-bench tests pass. But an agent that completes the task may also delete the wrong file, change unrelated code and install things in the environment — none of which shows up in completion rate.

### Intermediate Walkthrough

- **Problem**: you ask an agent to fill in a function. It does — and also rewrites three neighboring functions, creates two draft test files and runs `git checkout`. Completion rate calls it a success.
- **Method**: split the agent's action space into code generation, file management and system interaction, design tasks in each layer that tempt violations, and measure 11 behaviors automatically with rules and an LLM judge; then propose Code-KIT, which combines violation-aware guidance with tools scoped to the task (e.g. read-only tools for read-only tasks).
- **Why it matters**: the same model behaves very differently across frameworks — OpenHands' native file tool bundles read and write access and keeps write access even on read-only tasks. The problem lives in the tool interface, not just the model.

### Key Details

- Most common violation: acting without reading or misreading dependencies, up to 98.5% ⚠️ (authors' own measurement, not yet externally reproduced)
- Modifying user inputs 50.5%, silently compromising environment integrity 53%; agents rarely change public function signatures
- The LLM judge (Gemini-3-Flash) agrees with human labels 88.63% on average, but only 72.0% on instruction following
- Code-KIT: violations down 52% for smolagents and 32% for OpenHands, with task completion improving at the same time
- Framework coverage: experiments include OpenHands, smolagents, Agno and Claude Code
- Limitation: the authors acknowledge multi-turn security injection and data exfiltration aren't covered; extending Code-KIT's per-step tool restrictions to long tasks will need permissions scoped across steps

### Reviewer's One-Liner

Breaking "overstepping" into 11 automatically measurable behaviors gives tool-interface design a comparable metric for the first time; what remains to see is how much of the violation rate and Code-KIT's effect survives on the newest frontier models and longer tasks.

### Your Take-Away

- If you design coding agent tools: split read and write into separate tools and give read-only tasks only read tools, rather than relying on the prompt to say "don't write"
- If you're evaluating coding agents internally: beyond completion rate, measure "edited files outside scope," "created unrequested files" and "changed the environment"

---

## Paper 3 | What Logs Must Record to Approve an Agent Change: agent-risk

**agent-risk: Risk Assessment for Changes to AI Agents**
Yue Zhao, Zixiang Xu, Angela Huyue Zhang et al. (University of Southern California, London Business School, Arizona State University)　·　arxiv: 2610.16280
Links: [arxiv](https://arxiv.org/abs/2610.16280) · [alphaxiv](https://www.alphaxiv.org/abs/2610.16280)

### TL;DR

In a bash sandbox, a 7,200-episode log alone can't decide whether two "let the agent retry after refusal" gates are safe to ship; rerunning only the episodes each gate blocks, from saved states, reaches the same approval decisions as live testing at half the cost of a live test sized post hoc to reach them.

### Editorial Assessment

| Dimension | Assessment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation velocity | Published 3 days ago; Semantic Scholar rate-limited, no citation data retrieved |
| Institution | University of Southern California (including its law school), London Business School, Arizona State University |
| Community signal | Not on HF Daily Papers (10-13, 10-14); code, registrations and logs public on GitHub |
| Credibility | Conditional pass — formal results come with proofs, and sandbox estimates were frozen before being compared with live results, but the experiments are small |
| Evidence maturity | Proof-of-concept — one open-weight model family (14B and 27B), honest agents that don't evade oversight, in a bash sandbox and an airline environment |
| Reproducibility | Full artifacts — code, preregistrations and run logs public on GitHub |
| Why this paper | Direct — before swapping a model or changing a gate, deployers need risk evidence; this paper answers how logs must be designed to provide it |
| Novelty | Substantive — extends off-policy evaluation and optimal-stopping methods to agent logs with only partial records |
| Today's importance | High — regulators are starting to require agent behavior evidence, and insurers and auditors need to know what logs can prove |
| Practical link | Clear — specifies which log fields to record and where to take snapshots, usable directly in an agent platform's logging spec |
| Editorial confidence | Medium — this article only cites the authors' controlled sandbox demonstrations and doesn't extrapolate to large production systems |
| Reading advice | Skim — math-heavy; people responsible for agent platform logging or governance can read the introduction and Section 4 |
| Main limitation | With a new model, none of 99 old logged episodes could be replayed, so model upgrades — the most common change — still need testing from scratch |

### Background

Deployers change agents all the time: tightening a safety gate, switching models. Insurers, auditors and approvers want to know the risk before launch, and the cheapest evidence is existing logs — but logs only record what happened under the old setup. Which actions a new gate would block, and what the agent does after being blocked, isn't in them.

### Intermediate Walkthrough

- **Problem**: you want to change a gate from "stop when risky" to "refuse when risky and let the agent try another way." The old logs never contain post-refusal behavior, so they can't tell you the new gate's risk.
- **Method**: first prove which fields logs must record for exact replay, then snapshot the environment before high-risk steps; when evaluating a new gate, settle the episodes the log can decide directly and rerun only the undecidable segments from snapshots.
- **Why it matters**: the evidence for approving an agent change must be designed ahead of time — the fields to record, the snapshots to take, the episodes to rerun. Hunting through logs after the fact often proves nothing.

### Key Details

- A 7,200-episode log alone decides neither retry gate; after rerunning blocked episodes from snapshots, the approval results match live testing (approve gate 2, decline gate 1) ⚠️ (authors' own measurement, not yet externally reproduced)
- Rerun cost is 15% of the agent calls needed to test both gates live, and half of a live test sized post hoc to reach the same decisions
- Without per-step harm in the log, a stopping gate's certified harm ceiling rises up to 2.5-fold, because you can't tell whether harm came before or after the stop
- With a new model, none of 99 old logged episodes could be replayed, so a model release needs runs from step 0
- Announcing the gate in the prompt raised the abort rate above what replay predicted — once an agent perceives oversight, old logs no longer apply
- Limitation: one open-weight model family and honest agents only; there's still no bound for agents that evade oversight

### Reviewer's One-Liner

Turns "what can logs prove" into checkable conditions, which is genuinely useful for agent governance; but the demonstrations are small, and the next step is whether it holds across models, long tasks and agents that recognize oversight.

### Your Take-Away

- If you build agent platform logging: record the tool call, monitor score and outcome at every step, and snapshot before high-risk steps, so you have something to rerun when evaluating gate changes
- If you approve agent launches: list separately which episodes old logs can decide and which need reruns, and treat model swaps as needing testing from scratch by default

## Today's Takeaway

I used to think the evidence problem for agents was mostly whether records were kept. Today's three papers changed that: eval code can distort scores, boundary violations don't show up in completion rates, and even logs need their fields and snapshots designed up front to prove anything. Evidence has to be designed beforehand; it can't be patched in afterward.

## References

- [When Agent Evaluation Becomes Unreliable — arXiv 2610.16067](https://arxiv.org/abs/2610.16067)
- [SWE-Misbehavior — arXiv 2610.18206](https://arxiv.org/abs/2610.18206)
- [SWE-Misbehavior code and data — GitHub](https://github.com/dxlong2000/SWE-Misbehavior)
- [agent-risk — arXiv 2610.16280](https://arxiv.org/abs/2610.16280)
- [agent-risk code, registrations and logs — GitHub](https://github.com/yzhao062/agent-risk)
- [τ-bench — Sierra Research (GitHub)](https://github.com/sierra-research/tau-bench)
- [arXiv cs.AI new submissions](https://arxiv.org/list/cs.AI/new)
