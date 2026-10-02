---
title: "AI Agent Arxiv Digest — 2026-09-29"
date: 2026-09-29
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's three papers each puncture one part of the common assumption that adding more agents means more power, mutual checks, or more trustworthy conclusions — task structure decides whether adding agents helps at all, current models still waste most of their actions even when collaboration is genuinely needed, and the very last step of debate — converging on a conclusion — is the easiest place to quietly fabricate one"
tldr: "Testing 13 open-weight models up to 30-agent teams shows majority voting barely captures the potential gain from adding agents on disjunctive tasks like math and multiple-choice, while on compensatory tasks like Fermi estimation, adding more agents can't squeeze out the 87% of error that comes from the item itself; AgentWorld tests 100 long-horizon tasks requiring 3-20 collaborating agents and finds even the best model, Gemini 3 Flash, only reaches 52% task success with nearly two-thirds of its actions contributing nothing causally to completion; the Active Provenance Gate shows multi-agent debate synthesis drops to 0.288 provenance fidelity under high conflict, and adding a provenance gate blocks 75% of syntheses in favor of an honest divergence report — which over 70% of users preferred to a fluent but fabricated consensus"
series:
  name: "AI Agent Arxiv Digest"
  order: 128
---

> 🌏 [中文版](/posts/daily/2026-09-29-ai-agent-arxiv-digest)

## Today's Overview

When teams design multi-agent systems, three intuitions come up again and again: adding more agents makes results better; even if it doesn't reach the best possible outcome, at least agents can divide labor and check each other; and a consensus reached through debate is more trustworthy than a single agent's answer. Today's three papers each run a reality check on one of these intuitions. Multi-agent Scaling Across Disjunctive and Compensatory Tasks combines a theoretical model with large-scale experiments to show that whether adding agents helps depends entirely on task structure — majority voting barely captures the potential gain on disjunctive tasks like math and multiple-choice, and on tasks that rely on statistical averaging, adding more agents can't squeeze out the systematic bias baked into the item itself. AgentWorld tests a long-horizon benchmark requiring 3 to 20 agents to coordinate over 50+ rounds, and finds that even when a task genuinely requires multi-agent collaboration, today's strongest frontier models only reach 52% success — and once you trace the causal contribution of every action, even the best model wastes nearly two-thirds of its actions on nothing that actually helps finish the task. Towards Mitigating Fabricated Consensus turns to the very last step of multi-agent debate — the synthesis model that converges the discussion into a conclusion — and shows this is exactly where sharp disagreement gets quietly rewritten into a fluent-sounding consensus with no real evidentiary support, when what users actually want is an honest "we couldn't agree." The message across all three is consistent: multi-agent is not a silver bullet — check whether the task structure is even worth adding agents to, check whether the collaboration itself is efficient once you do, and make sure the final step of converging on a conclusion has a mechanism to stop it from being quietly dressed up.

## Terms worth knowing before reading

| Term | Plain explanation |
|---|---|
| Agent | An AI system that can plan its own steps, call tools, and execute tasks across multiple turns — not just a question-answering chatbot |
| Disjunctive Task | A task type where the team succeeds as soon as "at least one" member gets it right, such as a math problem or multiple-choice question; the team's ceiling depends on whether the correct answer can be picked out from the rest |
| Compensatory Task | A task type where the result comes from statistically averaging multiple estimates, such as guessing an order of magnitude; team performance depends on whether individual errors cancel each other out |
| Causal Collaboration Effectiveness (CCE) | A metric that traces whether each agent action actually causally contributed to completing the task, rather than simply scoring whether the task succeeded |
| Provenance Fidelity (PF) | A measure of what fraction of a synthesis's sentences can actually be traced back to the original debate record; a lower PF means more of the synthesis was fabricated |
| Divergence Report | When a synthesis fails the provenance check, the system instead issues an honest report explicitly listing where consensus failed and where the evidence conflicts, rather than forcing out a plausible-sounding conclusion |

---

## Paper One | Does a Bigger Multi-Agent Team Really Mean More Power? It Depends on the Task

**Multi-agent Scaling Across Disjunctive and Compensatory Tasks**
Carolina Fortuna, Blaž Bertalanič (Jožef Stefan Institute, Ljubljana) · arxiv: 2609.31563

Links: [arxiv](https://arxiv.org/abs/2609.31563) · [alphaxiv](https://www.alphaxiv.org/abs/2609.31563)

### TL;DR

Testing 13 open-weight models with teams up to 30 agents, majority voting barely captures the potential gain from adding agents on "disjunctive" tasks like math and multiple-choice (pass@30 can reach 54.4%, yet majority voting stays almost flat), while on "compensatory" tasks like Fermi estimation, adding more agents can't squeeze out the 87% of squared error that comes from item-level bias in the question itself.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (not yet peer reviewed; cs.AI primary, cs.MA cross-list) |
| Citation velocity | Persistently 429 rate-limited on Semantic Scholar this round, no data obtained; submitted 2026-09-25, 4 days old, near-zero is the reasonable inference |
| Institution | Jožef Stefan Institute (Ljubljana, Slovenia); the same author pair published a directly related conference paper on multi-agent debate consensus this past May, so this is not their first work on the topic |
| Community signal | Not found in sampled HuggingFace Daily Papers; the paper's own abstract explicitly marks code as an "Open code placeholder," not yet public; no Papers with Code entry found |
| Credibility | Pass — 13 open-weight models (3B-20B), team sizes 1-30, 5 disjunctive benchmarks + 1 compensatory benchmark, roughly 6.8×10^7 total generations |
| Evidence maturity | Substantial — the theoretical prediction matches observed data to within 0.48 points on average across 650 configurations (Pearson r=0.999); the compensatory-task error decomposition matches to within 0.6% average error (r=0.997) |
| Reproducibility | Not provided — the abstract explicitly states "Open code placeholder"; code is not yet public, so independent verification is not currently possible |
| Why this one | Direct — directly answers "should this task get more agents," the most basic question in multi-agent architecture design |
| Direction novelty | Substantive — first to systematically map Steiner's group-task taxonomy onto LLM multi-agent settings, with a verifiable predictive theoretical model |
| Today's importance | High — directly challenges the common design assumption that "adding more agents is always better" |
| Practical link | Clear — gives a concrete framework for deciding in advance whether a given task is even worth adding agents to |
| Editorial confidence | High — the extremely tight fit between theoretical prediction and observed data supports the scoped claim that task structure determines whether adding agents helps |
| Reading recommendation | Must-read — for any team deciding whether to move from a single agent to a multi-agent architecture |
| Primary limitation | Only tests open-weight models from 3B-20B, not the frontier closed models (GPT/Claude/Gemini) most commonly used in production; code is not yet public, so independent verification isn't currently possible |

### Field Background

LLM multi-agent frameworks (debate, sample-and-aggregate, voting) generally carry an implicit assumption: the bigger the team size N, the better the system performs. This assumption maps directly onto two contradictory classic observations from cognitive science — Galton's "wisdom of crowds" (a group's median estimate beats most individuals) and the Ringelmann effect (individual output drops as team size grows). Steiner's 1972 taxonomy of group tasks explains the contradiction as a matter of task structure; prior LLM multi-agent research has rarely tested its own results explicitly against this taxonomy.

### Mid-level Walkthrough

- **The problem**: Imagine deciding whether a task should get more agents. This paper asks: on which kinds of tasks does "adding more agents" genuinely help, and on which is it just wasted compute?
- **The method**: The researchers split tasks into two types. "Disjunctive" tasks succeed as soon as one team member gets it right (e.g., a math problem), aggregated by majority voting. "Compensatory" tasks rely on statistically averaging multiple estimates (e.g., guessing an order of magnitude). They first derive a theoretical ceiling for each task type, then validate the prediction empirically with 13 models and teams up to 30 agents.
- **Why it matters**: If majority voting barely captures the potential gain on disjunctive tasks, then "have more agents vote" — a common design pattern — is just burning compute. If a compensatory task's error mostly comes from the item itself rather than random noise, then "average multiple agents' estimates" — another common pattern — is equally useless.

### Deep Dive

- Disjunctive tasks: pass@30 (probability at least one agent is correct) rises from 34.3% (single agent) to 54.4% on GSM8K — real potential — but Round-1 majority voting only gains 0.3-1.3 points from N=2 to N=30, capturing almost none of it
- Multi-round revision does bring large gains (GSM8K nearly doubles from 34.1% to 61.9%), but the gain is almost independent of team size — one peer (N=2) yields 26.5 points, 29 peers yield 26.6 points, a difference of just -0.1
- More counterintuitively, 6 of 13 models actually see accuracy significantly decline under multi-round revision as team size grows from 5 to 30 (by up to -3.01 points) — a clear "more agents makes it worse" case
- Compensatory tasks (Fermi estimation): item-level bias accounts for 87% of the squared error; even an infinite homogeneous team could remove at most the remaining 13%, so N=30 accuracy (33.4%) barely beats a single agent (31.6%)
- Heterogeneous teams (mixing model families) behave differently across the two regimes: on disjunctive tasks, a 5-model pool (83.2%) substantially beats its own members' average but still falls short of its single strongest member (86.8%); on compensatory tasks, a 5-model heterogeneous pool of 7B-8B models (error 1.45) actually beats its own strongest single member (error 1.80), a roughly 25.8% error reduction
- Limitation (author-stated, plus editorial note): only tests open-weight models 3B-20B, not frontier closed models' real team behavior; code is currently only a placeholder and not yet public

### Reviewer's One-Line Take

The theoretical model fits the large-scale experimental data extremely tightly, and the conclusion that "task structure determines whether adding agents helps" is well supported; but it's only been validated on small-to-mid open-weight models — whether frontier closed models follow the same pattern, and when the code will be released for independent replication, both remain open.

### Take-aways for You

- If you're deciding whether to turn a single agent into a multi-agent voting architecture: first check whether the task is "one correct answer wins" or "averaging cancels out error" — the former barely benefits from majority voting, and the latter won't be saved by adding agents if the item-level bias is large
- If you're already running multi-agent voting or sampling: this paper's "effective team capacity" framework can estimate how many independent agents your current design is actually equivalent to — you may find it's far fewer than the raw headcount suggests

---

## Paper Two | AgentWorld: 20 Agents Building a Fort Together, and the Best Model Only Finishes 52% of the Time

**AgentWorld: Benchmarking Long-Horizon Collaboration of Multi-agent LLMs**
Yusen Zhang, Young Min Cho, Jin Mo Yang et al. (Columbia University + University of Pennsylvania + Seoul National University + Penn State University) · arxiv: 2609.31590

Links: [arxiv](https://arxiv.org/abs/2609.31590) · [alphaxiv](https://www.alphaxiv.org/abs/2609.31590)

### TL;DR

AgentWorld tests four frontier models on 100 long-horizon tasks (50+ rounds, MMORPG sandbox) that require 3-20 agents to coordinate, and even the best, Gemini 3 Flash, only reaches 52.0% task success — and once you trace the causal contribution of every action, nearly two-thirds of even its actions turn out to contribute nothing to actually finishing the task.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (not yet peer reviewed; cs.MA) |
| Citation velocity | citationCount 0 confirmed via Semantic Scholar; published 1 day ago, no citation data yet |
| Institution | Columbia University + University of Pennsylvania + Seoul National University + Penn State University, with task annotation and evaluation help credited to the OpenAgents open-source community |
| Community signal | Not found in sampled HuggingFace Daily Papers; fully open-source — full code and data published on GitHub (github.com/openagents-org/agentworld, confirmed live via GitHub API), plus a dedicated project site at agentworld.io |
| Credibility | Pass — 100 human-annotated tasks + 100 LLM-augmented variants, 3-20 agents, 25-55 round budgets, 4 frontier models, with 5 explicit baselines (random / single-agent-does-everything / no-communication / shared-plan-no-communication / oracle-communication) isolating what collaboration itself contributes |
| Evidence maturity | Substantial — beyond the main results, there's a design-component ablation on a 35-task subset (removing role info, shortening the horizon, randomizing spawn points, withholding documentation) and a 3-seed run-to-run variance check |
| Reproducibility | Full artifacts — GitHub publishes the complete sandbox environment, task definitions with verifiers, evaluation scripts, and the annotation platform |
| Why this one | Direct — the first long-horizon multi-agent benchmark that isolates genuine collaboration ability from both task difficulty and low-level action-control burden |
| Direction novelty | Substantive — a new environment (MMORPG sandbox + blackbox interaction) paired with a new metric (Causal Collaboration Effectiveness, CCE), validated against human judgments |
| Today's importance | High — provides a concrete, quantified ceiling for just how immature multi-agent collaboration currently is |
| Practical link | Clear — findings like "communication volume doesn't predict success" and "a 40% residual failure rate persists even with oracle communication" map directly onto systems designing multi-agent communication protocols today |
| Editorial confidence | High — the baselines rule out simpler explanations (task is just hard, low-level control burden is too heavy), and the CCE metric is human-validated, supporting the claim that current frontier models collaborate inefficiently |
| Reading recommendation | Must-read — for any team building a system that requires multiple agents to divide labor and collaborate |
| Primary limitation | Only 4 frontier models tested, and DeepSeek R1-70B is notably older/smaller than the other three, which weakens the cross-model comparison; every model's success rate roughly halves on the harder augmented variants, suggesting some headline numbers may still be sensitive to exact task phrasing |

### Field Background

Multi-agent collaboration (agents with different roles working together toward a shared goal in a shared environment) has long had three evaluation gaps: most benchmarks cap task length under 20 steps, not enough to test sustained coordination; many conflate low-level action control (precise 3D navigation, block placement) with collaboration itself, diluting how much collaboration ability actually drives the score; and large-scale simulations like Project Sid focus on emergent social behavior without concrete, measurable task outcomes.

### Mid-level Walkthrough

- **The problem**: Imagine a 10-person team in a game world that has to jointly forge a weapon — miners extract ore, a smelter processes it into bars, and a blacksmith forges the final item — where nobody's individual resources or skills are enough alone. Can today's frontier-model-based agent teams actually complete this kind of division-of-labor task?
- **The method**: AgentWorld builds a sandbox on an open-source MMORPG engine, wrapping low-level actions (combat, gathering, movement) into 13 high-level APIs so that scores reflect collaborative decision-making rather than fine-grained control. Each round, agents can only coordinate through chat messages, with no visibility into each other's internal state (a "blackbox" setting). The researchers also designed Causal Collaboration Effectiveness (CCE), which has an LLM trace backward round by round to check whether each action actually causally contributed to success, instead of the common practice of having an LLM subjectively score "collaboration quality" on a 1-5 scale.
- **Why it matters**: If even the strongest frontier model only reaches 52% success, with nearly two-thirds of its actions wasted, that means multi-agent collaboration is still far from a capability you can just scale up by adding headcount — it's an independent, still-unsolved problem.

### Deep Dive

- Main results: Gemini 3 Flash leads at 52.0% success, followed by Claude Haiku 4.5 (45.0%), GPT-5 Mini (36.0%), and DeepSeek R1-70B (20.0%)
- The waste CCE reveals: even the best model, Gemini, has a CCE of only 0.320 (less than a third of actions causally contribute to success); DeepSeek's CCE is just 0.125, meaning nearly 88% of its actions are wasted
- Baseline breakdown: random actions solve only 5.7%, single-agent-does-everything reaches 28.6%, confirming the tasks genuinely require multi-agent collaboration; oracle communication (one agent sees all messages) raises success to 60.0%, but a 40% residual failure rate remains, showing difficulty isn't purely a communication shortfall
- Communication volume doesn't equal collaboration quality: GPT-5 Mini sends the most chat messages (44.1 average) but ranks third; DeepSeek sends the fewest (7.5) yet ranks last, and delays its first message to round 5 on average, missing the critical early-coordination window
- CCE metric validated: agrees with human causal judgments at Cohen's kappa=0.64 ("substantial"), nearly matching the kappa=0.66 between two different judge models; re-computing CCE with three different judge models leaves the model ranking completely unchanged
- On the harder augmented variants, every model's success rate roughly halves (Gemini 52%→24%, DeepSeek 20%→10%) ⚠️ (self-reported by the authors, pending external replication)
- Limitation (author-stated): only 4 frontier models evaluated, and DeepSeek R1-70B is relatively older, limiting how representative the cross-model comparison is

### Reviewer's One-Line Take

The baseline design is rigorous enough to rule out simpler explanations like "the task is just hard" or "control overhead is too heavy," and the CCE metric is human-validated, so the conclusion that current frontier models collaborate inefficiently holds up; but with only 4 models tested and numbers that swing substantially on the augmented variants, readers shouldn't treat 52% as a fixed, stable ceiling.

### Take-aways for You

- If you're designing a system that requires multiple agents to divide labor: assume collaboration itself will waste most of your execution actions, and budget for cost and retries accordingly rather than estimating from single-agent baselines
- If you're evaluating your own system's multi-agent collaboration quality: instead of just looking at task success rate, try a causal-contribution breakdown like CCE, so you can tell whether the team is "actually collaborating" or "one agent doing the work while the others ride along"

---

## Paper Three | The Moment a Multi-Agent Debate Converges on a Conclusion Is Exactly Where It's Easiest to Fake

**Towards Mitigating Fabricated Consensus: The Active Provenance Gate for Multi-Agent Debate Synthesis**
Jakub Masłowski, Jarosław A. Chudziak (Warsaw University of Technology) · arxiv: 2609.31422

Links: [arxiv](https://arxiv.org/abs/2609.31422) · [alphaxiv](https://www.alphaxiv.org/abs/2609.31422)

### TL;DR

The model responsible for synthesizing a conclusion after multi-agent debate drops to a provenance fidelity of just 0.288 under high conflict; adding an "Active Provenance Gate" blocks 75% of syntheses that fail to meet the bar, replacing them with an explicit divergence report — and in a human study, over 75% of participants said they'd rather see an honest "no consensus" report than a fluent but fabricated one.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | Accepted at the 38th IEEE International Conference on Tools with Artificial Intelligence (ICTAI 2026) — peer reviewed |
| Citation velocity | Persistently 429 rate-limited on Semantic Scholar this round, no data obtained; submitted 2026-09-25, 4 days old, near-zero is the reasonable inference |
| Institution | Institute of Computer Science, Warsaw University of Technology, Poland |
| Community signal | Not found in sampled HuggingFace Daily Papers; no Papers with Code entry found; a dedicated GitHub repo with a full reproducibility bundle for this paper is public (github.com/m-Jakub/resilient-mas-framework, confirmed live via GitHub API) |
| Credibility | Conditional pass — 90 adversarial runs with before/after provenance-fidelity numbers, a validator-symmetry ablation, and a blind N=33 human A/B study; the evidence form matches the claim, but the scale is modest |
| Evidence maturity | Preliminary — the core mechanism (provenance-fidelity measurement, self-healing, hard gate) is tested reasonably and peer reviewed, but confined to a single synthetic crisis-simulation testbed and a 33-person convenience-sample study; generalization to real production multi-agent debate systems isn't yet demonstrated |
| Reproducibility | Full artifacts — GitHub publishes the debate corpus, full prompt templates, the complete verification codebase, and the human-study survey data |
| Why this one | Direct — multi-agent debate/voting is one of the most common "add more agents to cross-check the answer" design patterns, and this paper directly tests the trustworthiness of the step that converges it into a conclusion |
| Direction novelty | Adaptation — active verification gates and self-healing aren't new concepts on their own, but applying them precisely to the often-overlooked debate-to-synthesis boundary, with a quantified provenance-fidelity metric, is a meaningful new framing |
| Today's importance | High — directly challenges the common assumption that a consensus reached through multi-agent debate is more trustworthy than a single agent's answer |
| Practical link | Clear — the validator-symmetry ablation (a model reviewing its own output is nearly useless) maps directly onto systems designing LLM-as-judge or self-review architectures |
| Editorial confidence | Medium — a statistically significant, peer-reviewed result supports the core claim, but the small human-study sample and single domain mean the practical magnitude in real deployments is still open |
| Reading recommendation | Must-read — for any team using multi-agent debate or voting for decision aggregation or decision-support systems |
| Primary limitation | The human study is only 33 people from a convenience sample of non-professional operators, tested on a single fictional crisis simulation; the provenance check only verifies internal consistency against the debate record, not against external reality |

### Field Background

Multi-Agent Debate (MAD) is often used to improve the robustness and factuality of LLM reasoning, under the general assumption that as long as the full debate log is preserved, the final synthesis model will compress the discussion faithfully. Existing provenance frameworks (like PROV, PROV-AGENT) mostly treat system logs as passive artifacts for post-hoc diagnosis rather than as active control mechanisms, and self-correction methods (self-refine, reflexion) rarely enforce hard, verifiable constraints right at the synthesis boundary itself.

### Mid-level Walkthrough

- **The problem**: Imagine a crisis-management committee of expert agents debating, after which a report-writing model compresses the discussion into a recommendation. If the experts never actually reached consensus, will that report-writing model fabricate a plausible-sounding conclusion nobody actually agreed to, just to sound coherent?
- **The method**: The Active Provenance Gate (APG) is a verification layer inserted between the end of debate and formal publication. It first freezes the entire debate's public statements, knowledge-graph evidence, and private strategic records into a closed evidentiary world, then has a high-capability auditor model check, sentence by sentence, whether each claim in the synthesis is actually supported by that evidence (Provenance Fidelity, PF). If PF doesn't clear a hard threshold of 0.95, the system triggers up to 3 rounds of self-healing; if it still fails after repair, instead of forcing out a conclusion, it issues an explicit Divergence Report listing where consensus failed and where the evidence conflicts.
- **Why it matters**: If the very last step of a multi-agent system — converging debate into a conclusion — turns out to be the easiest place to quietly dress it up, then the assumption "debate among more agents produces a more trustworthy answer" needs a question mark. And the study finds users actually prefer being told honestly "there's no consensus" over being handed a fluent but fabricated one.

### Deep Dive

- Under high conflict, the ungated baseline synthesis has a provenance fidelity of just 0.288, and only 0.183 under low conflict — showing that whenever the debate contains unresolved disagreement, the synthesis model tends to smooth it into a plausible-sounding conclusion
- With active auditing and self-healing, terminal provenance fidelity rises to 0.617 (high conflict) and 0.586 (low conflict), still below the 0.95 hard threshold — so 75.0% of high-conflict syntheses and 60.0% of low-conflict syntheses get blocked by the gate and replaced with a divergence report
- Validator-symmetry ablation: using the same model as both generator and auditor wrongly approves unsafe compromises 85.6% of the time; switching to a stronger, independent validator model drops the same text's measured provenance fidelity to 0.300 and correctly rejects 63.3% of irreconcilable outputs
- Human A/B study (N=33): 66.7% found the baseline more "fluent and diplomatic," but in the high-conflict scenario, 75.8% judged the APG output more faithful to the evidence; in the zero-sum stalemate scenario, APG's divergence report scored significantly higher trust (3.27) than the baseline's fabricated compromise (2.45, paired t-test p=0.0039) ⚠️ (N=33 convenience sample, pending validation at larger scale and with professional operators)
- Self-healing is efficient: repaired outputs retain 97.3% of their text length, showing the system achieves compliance by restructuring the argument rather than crudely deleting content
- Limitation (author-stated): evaluation limited to synthetic simulations and hard-coded conflict scenarios; the provenance check operates under a closed-world assumption, checked only against the debate corpus rather than external reality; the 33-person convenience sample doesn't distinguish domain experts from general users; the LLM auditor itself is subject to linguistic bias and prompt sensitivity, creating a circularity risk of "using an LLM to verify an LLM"

### Reviewer's One-Line Take

The provenance-fidelity measurement is clearly designed, and a peer-reviewed venue plus a statistically significant human-preference result support the core claim that an active verification gate reduces fabricated consensus in debate synthesis; but it's only been validated on one synthetic crisis-simulation domain with a 33-person convenience sample, and whether it generalizes to real production scale and diverse scenarios is honestly flagged by the authors themselves as the next open step.

### Take-aways for You

- If you're designing the final output of a multi-agent debate or voting system: don't assume a complete debate log means the synthesis is faithful — add an independent audit at the synthesis boundary rather than letting the same model be both player and referee; this paper's symmetry ablation shows self-review is nearly useless
- If you're designing the interface for a decision-support system: consider making an "honest divergence report" a formal output option, not just a binary of "successfully produced a recommendation" or "system error" — this paper's human study shows users trust an honest failure more in high-stakes situations

---

## What I Learned Today

I used to think the main problem with multi-agent systems was how well the collaboration mechanism was designed. Today I learned the more fundamental problem is that task structure itself often determines whether adding agents helps at all — and even when a task genuinely needs collaboration, today's frontier models are still far from actually dividing labor well. More surprisingly, the very last step of a multi-agent system — converging on a conclusion — turns out to be exactly where it's easiest to quietly dress things up, and also the step that most needs independent oversight. The fix isn't adding more layers of review; it's making sure no layer is reviewing itself.

## References

- [Multi-agent Scaling Across Disjunctive and Compensatory Tasks](https://arxiv.org/abs/2609.31563)
- [Multi-agent Scaling Across Disjunctive and Compensatory Tasks — alphaxiv](https://www.alphaxiv.org/abs/2609.31563)
- [AgentWorld: Benchmarking Long-Horizon Collaboration of Multi-agent LLMs](https://arxiv.org/abs/2609.31590)
- [AgentWorld — alphaxiv](https://www.alphaxiv.org/abs/2609.31590)
- [AgentWorld — GitHub](https://github.com/openagents-org/agentworld)
- [Towards Mitigating Fabricated Consensus: The Active Provenance Gate for Multi-Agent Debate Synthesis](https://arxiv.org/abs/2609.31422)
- [Active Provenance Gate — alphaxiv](https://www.alphaxiv.org/abs/2609.31422)
- [Active Provenance Gate — GitHub reproducibility bundle](https://github.com/m-Jakub/resilient-mas-framework)
- [arXiv cs.MA new listings](https://arxiv.org/list/cs.MA/new)
- [HuggingFace Daily Papers](https://huggingface.co/papers)
