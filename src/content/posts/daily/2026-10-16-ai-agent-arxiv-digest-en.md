---
title: "AI Agent Arxiv Digest — 2026-10-16"
date: 2026-10-16
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's three papers aren't about new agent capabilities — they're about the gap between looking fine and being fine: seven in ten skill-marketplace listings carry privileges you never see at install time, a broken skill doesn't automatically mean a broken run, and the right model choice flips depending on how long the task is"
tldr: "Beyond Maliciousness measures 6,309 listings across two agent-skill marketplaces and finds seven in ten carry a privileged capability while the declaration mechanism is nearly inert; Static Skill Inconsistencies audits 575 skills and finds 1,182 defects, but repair benefit depends heavily on the model — weaker models are the real risk amplifier; When Is Smaller Greener replaces per-call with per-completed-task comparison, and a 15-model pilot shows the greenest model for short tasks and long tasks is completely different"
series:
  name: "AI Agent Arxiv Digest"
  order: 145
---

> 🌏 [繁體中文版](/posts/daily/2026-10-16-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers aren't about new agent capabilities — they're about the gap between looking fine and being fine. The first measures how much of an agent-skill marketplace's inventory carries privileges a user can't see at install time, and finds the declaration mechanism barely works. The second separates "a skill is written wrong" from "a skill causes trouble at runtime" and finds they're not the same thing — weaker models are the real risk amplifier. The third replaces "compare models per call" with "compare models per completed task," and finds the same set of models gives opposite recommendations for short versus long tasks. All three point the same way: surface signals — declarations, defect counts, leaderboard scores — aren't answers by themselves; you have to actually run it to find out. All three are preprints, and their conclusions are limited to the settings noted below.

## Terms to Know Before Reading

| Term | Plain explanation |
|---|---|
| Agent Skills | Markdown instruction packages an agent reads, bundled with scripts and resources, that give the agent new workflows or tool usage |
| Attack surface | The total set of capabilities a system gains, and that could be misused, once a component is installed |
| allowed-tools declaration | A list of "pre-approved" tools a skill author puts in frontmatter; it removes a confirmation prompt but doesn't restrict any other tool |
| Contract inconsistency | Conflicting behavioral constraints across a skill's documentation, scripts, and configuration files |
| Crossover length | The task-length point past which a model that used to be more resource-efficient stops being the better choice |

---

## Paper 1 | Seven in Ten Agent Skills Grant Privileges You Never See at Install Time

**Beyond Maliciousness: Static and Runtime Attack-Surface Profiling of Agent Skills**
Ratnesh Pandey, Japneet Singh, Harsh Akshita et al. (Metano Labs, Purdue University, VulNow)　·　arxiv: 2610.19264

Links: [arxiv](https://arxiv.org/abs/2610.19264) · [alphaxiv](https://www.alphaxiv.org/abs/2610.19264)

### TL;DR

An attack-surface measurement of 6,309 listings across two agent-skill marketplaces finds seven in ten carry at least one privileged capability (shell execution, filesystem read/write, network egress, or credential access), while the declaration mechanism barely works — only 770 of 6,061 parseable listings declare anything at all, and 59% of those that do understate what their bundle can actually do.

### Editorial Judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (cs.CR, not peer-reviewed) |
| Citation velocity | Published 3 days; Semantic Scholar queries kept hitting rate limits, no citation data obtained |
| Institution | Metano Labs (first author's affiliation), Purdue University, VulNow |
| Community signal | Not on HF Daily Papers (10-14, 10-15); no Papers with Code entry |
| Credibility | Conditional pass — methodology is thorough (static analysis + sandbox execution + model-based judging + 410-listing human review), but the paper discloses the scanner is built and run by Metano Labs, the first author's own company, with no third-party validation or external ground truth |
| Evidence maturity | Preliminary — 6,309 listings is a large sample, but the human-review tier covers only 410 listings from one marketplace, and review was still in progress at measurement time with no precision figure reported |
| Reproducibility | Not provided — the paper states raw scan outputs, the scanner, and prompt templates are not released, and even data shared on request "cannot reconstruct the complete scan results" |
| Why this paper | Direct — it answers "what authority does installing a skill actually grant," the same risk class as the Claude Skills ecosystem this site itself uses |
| Novelty | Substantive — shifts the question from "is this skill malicious" to "what can this skill do," and quantifies the gap between declared and actual capability |
| Today's relevance | High — agent-skill marketplaces are growing fast, with one marketplace going from 15,082 to 73,193 listings in a month; far more people install skills than write security rules for them |
| Practical link | Clear — shows that allowed-tools "removes a confirmation box without restricting capability," directly usable to audit your own team's skill-review process |
| Editorial confidence | Medium — the core proportions are credible, but the single, non-independently-verifiable data source means the article's tone has to stay correspondingly hedged |
| Recommended reading | Must-read — for anyone whose team allows installing third-party agent skills |
| Primary limitation | The scanner is self-built and self-operated with no external benchmark, and raw data and prompt templates aren't public, so readers can't independently re-check the numbers |

### Field Context

Static vulnerability scanning can tell you whether a skill contains suspicious code or malicious intent, but not how much an agent's capability boundary expands once it's installed. Most marketplace review stops at "is this trying to cause harm" — no one had systematically measured how much authority an ordinary, non-malicious skill actually grants.

### Mid-Level Walkthrough

- **Problem**: Imagine installing a small phone app that only asks "install?" without listing that it will read your contacts, camera, and texts. Installing an agent skill today is nearly the same situation — what you see is a documentation file, not the fact that it can call a shell, read/write files, or reach the network.
- **Method**: Across 6,309 listings from two marketplaces, the authors run a two-phase measurement: whole-bundle static analysis plus dependency-provenance checking, then instrumented sandbox execution with a separate model judging the resulting trace, cross-checked against each listing's own allowed-tools declaration.
- **Why it matters**: Existing "is this malicious" review can't answer "how much did I just authorize by installing this" — and that's the risk users actually carry.

### Deep-Dive Points

- Half the listings show evidence of shell-execution capability; 35% filesystem read, 31% each for filesystem write and network egress, 13% credential access; seven in ten carry at least one privileged capability ⚠️ (self-built, self-operated scanner at Metano Labs, no third-party validation)
- Of 6,061 listings whose frontmatter parses, only 770 declare anything at all, and the declaration vocabulary "cannot express" credential or environment access
- Among listings that do declare, 59% understate what their bundle can do; ClawHub declares roughly twice as often as skillsmp, but under-declares on 88% of its declarations against 31%
- The human-review cohort is only 410 listings (91 flagged, 319 not), drawn from a single marketplace, and review was still in progress at measurement time
- Adoption bar: requires a pipeline that can run static analysis plus sandbox execution; for most teams the bar is simply "do we have an isolated execution environment"
- Limitation: the scanner is built and operated by the authors' own company, with no external benchmark, and raw data and prompt templates aren't public

### Reviewer's One-Line Take

Swapping "does this skill want to cause harm" for "what can this skill do" is the right question, and the sample size is large enough to matter — but the scanner is the author's own company's product and the raw data can't be handed over for independent recomputation, so that conflict of interest has to sit alongside the numbers.

### Take-aways for You

- If your team allows installing third-party agent skills: add a sandbox check of "what tools does this skill actually call" to your review process, not just a read of the frontmatter declaration
- If you're writing your own skill: allowed-tools is not a security boundary, just one fewer confirmation prompt — real capability restriction belongs at the execution-environment layer

---

## Paper 2 | A Broken Skill Doesn't Automatically Mean a Broken Run — It Depends on the Model

**Why Static Skill Inconsistencies Do Not Equate to Runtime Risks: A Behavioral Analysis of LLM Agent Execution**
Fengrui Fan, Huahao Wang, Jingyi Fang et al. (Huazhong University of Science and Technology)　·　arxiv: 2610.18927

Links: [arxiv](https://arxiv.org/abs/2610.18927) · [alphaxiv](https://www.alphaxiv.org/abs/2610.18927)

### TL;DR

A large-scale audit of 575 agent skills finds 1,182 manually validated contract inconsistencies affecting 64% of skills; but running 49 operationalizable tasks shows the benefit of fixing them depends heavily on the model — weaker models follow the broken spec and carry the defect into the final result, while stronger models self-correct. Static defect counts alone can't predict real runtime risk.

### Editorial Judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint, marked as submitted to ACM FSE 2027 (DOI is a placeholder format, acceptance not confirmed) |
| Citation velocity | Published 2 days; Semantic Scholar queries rate-limited, no citation data obtained |
| Institution | Huazhong University of Science and Technology |
| Community signal | Not on HF Daily Papers (10-14, 10-15); the paper has a "Data Availability" heading, but its content was lost in HTML conversion, so release status is unconfirmed |
| Credibility | Pass — clear RQ1–RQ3 structure, 575 skills, 1,182 manually validated defects, 49 executable tasks, 441 paired trajectories, with an explicit Threats to Validity section |
| Evidence maturity | Preliminary — the authors state the 49 rerunnable tasks are a subset of the 1,182 defects selected because they could be operationalized into verifiable tasks, so results shouldn't generalize to all defect types |
| Reproducibility | Unconfirmed — a "Data Availability" heading exists but its content was dropped by HTML extraction; release scope could not be confirmed |
| Why this paper | Direct — answers "does a badly written skill actually mean trouble at runtime," the other half of the risk-measurement picture from Paper 1 |
| Novelty | Substantive — separates "static defect count" from "actual runtime behavioral impact," and shows the two are not equivalent |
| Today's relevance | High — paired with the same-day attack-surface paper, it shows "skill risk" needs both authorization scope and runtime behavior to be assessed |
| Practical link | Clear — weaker models tend to follow broken specs, stronger models self-correct; usable as input when choosing which model executes which skill |
| Editorial confidence | High — the article only states findings on 49 tasks designed to trigger the target defects, and the authors themselves note this isn't the natural exposure rate in real workloads |
| Recommended reading | Must-read — for teams maintaining an internal skill library or deciding which defects to fix first |
| Primary limitation | The 49 tasks were deliberately designed to trigger the target inconsistency, so the exposure rate doesn't represent natural occurrence in real workloads |

### Field Context

LLM agents increasingly rely on reusable skill packages to standardize tool use, but the documentation, scripts, and configuration inside a package often conflict with each other. Prior auditing methods could only count "how many conflicts," not whether those conflicts, once actually hit during execution, change the outcome.

### Mid-Level Walkthrough

- **Problem**: A skill's documentation says "check the file exists before writing," but its script just overwrites. Whether this conflict matters depends on whether the agent ever reaches that script path, and whether it follows the documentation once it does.
- **Method**: The authors first audit 575 community and benchmark skills at scale, manually validating 1,182 contract inconsistencies; they then select 49 inconsistencies that can be operationalized into verifiable tasks, running three models across NoSkill, OriginalSkill, and FixedSkill settings to produce 441 paired execution trajectories for behavioral analysis.
- **Why it matters**: The results show that whether a conflict is actually hit, and whether the model self-corrects once it is, is what determines risk size — not the raw count of conflicts in the documentation.

### Deep-Dive Points

- 64% of tested skills are affected by inconsistencies, but the benefit of repair "varies strongly by model," from substantial improvement to almost no difference
- Nearly all execution instances are exposed to the inconsistent content, ruling out exposure frequency as the source of the performance variance
- Weaker models tend to follow erroneous specifications and carry defects into final results; stronger models actively correct runtime errors
- Conclusion: a skill's practical risk is jointly determined by "whether it's reached during execution" and "how the model behaves once it is" — static inconsistency count alone is not a good proxy for risk
- Adoption bar: this kind of behavioral analysis needs a controlled task environment and multi-model testing resources; a more feasible approach for most teams is to prioritize skills with high execution-exposure rates
- Limitation: the 49 tasks were deliberately designed to trigger the target inconsistency, so the exposure rate doesn't reflect natural occurrence in real workloads; a minimal fix may also carry incidental side effects beyond the targeted inconsistency

### Reviewer's One-Line Take

Separating "defect count" from "runtime risk" is a rare, rigorous design choice in this space, and the causal chain across the RQs is clear; unfortunately the actual content of the Data Availability section was lost in the HTML conversion, so whether data or code were released couldn't be confirmed.

### Take-aways for You

- If you maintain an internal skill library: prioritize fixing inconsistencies that get hit at high frequency, not the ones with the highest raw conflict count
- If you're choosing which model executes a skill: weaker models have less tolerance for spec errors and more readily carry them into the final result — factor that into model-choice risk

---

## Paper 3 | How Big a Model Should an Agent Use? The Answer Flips With Task Length

**When Is Smaller Greener? Right-Sizing Language Models for Agentic AI**
Sajid Siraj, Maria Barbati (University of Leeds, Ca' Foscari University of Venice)　·　arxiv: 2610.19345

Links: [arxiv](https://arxiv.org/abs/2610.19345) · [alphaxiv](https://www.alphaxiv.org/abs/2610.19345)

### TL;DR

After replacing per-call with per-completed-task as the unit for comparing energy and cost, a pilot of 15 open-weight models (0.6B–27B) shows the greenest model flips entirely with task length — a 1–3B model wins for short tasks, but an 8B or 27B model wins for long ones, with observed crossover points broadly matching the formula's predictions.

### Editorial Judgment

| Dimension | Judgment |
|---|---|
| Venue | Under submission (Journal of the Operational Research Society); arXiv preprint, not peer-reviewed |
| Citation velocity | Published 2 days; Semantic Scholar queries rate-limited, no citation data obtained |
| Institution | University of Leeds, Ca' Foscari University of Venice |
| Community signal | Not on HF Daily Papers (10-14, 10-15); no Papers with Code entry |
| Credibility | Pass — the decision model has an explicit crossover-length derivation, validated structurally with 15 open-weight models, two multi-step tasks, and measured GPU energy, including three formal hypothesis tests (H1/H2/H4) |
| Evidence maturity | Preliminary — the authors explicitly call this a pilot ahead of the full study, predictions are checked against the same runs that produced them (not held out), and only GPU-board energy is measured |
| Reproducibility | Full artifacts — the authors state raw call logs, the test harness, and analysis scripts are in a public repository, and one command recreates every number, table, and figure in this section from the committed logs |
| Why this paper | Direct — answers the daily model-selection decision of "how big a model should an agent use," and shows that per-call comparison is systematically misleading |
| Novelty | Substantive — replaces "energy/cost per call" with "energy/cost per completed task" as the comparison unit, deriving three decision regimes |
| Today's relevance | Medium — multi-step agent deployment keeps growing and energy/cost shows up directly on the bill, but this is still pilot-scale |
| Practical link | Clear — gives a directly applicable crossover formula for which model to use at which task-length range |
| Editorial confidence | High — the article only cites parts the pilot actually validated (15 models, two tasks), explicitly excluding H3, which still awaits the full study |
| Recommended reading | Skim — heavy on formal derivation; anyone doing model selection or energy/cost governance can read Sections 3, 6, and 7 alone |
| Primary limitation | The pilot covers one GPU, two synthetic tasks, open-weight models up to 27B, and validates predictions on the same data that produced them — a full held-out test is still future work |

### Field Context

Choosing which LLM an agent should use is currently decided by one of two leaderboards: the most capable model, or the cheapest one that seems good enough — both per-call comparisons. But a multi-step task fails entirely if any one step fails, so small per-step reliability gaps get amplified into completely different outcomes as tasks get longer.

### Mid-Level Walkthrough

- **Problem**: Model A has 95% per-step accuracy, Model B has 99% — a small-looking gap. But over a 20-step task, A only has a 36% chance of getting everything right, while B has 82%; stretch the task to 60 steps, and A, which used a tenth of B's energy per call, ends up using more energy per completed task, because failed attempts still have to be rerun.
- **Method**: The authors propose comparing models per completed task instead of per call, building a two-stage decision model: a preference-free Pareto screen first removes models that are never competitive at any task length, and preference weights are applied only where a real trade-off remains; they show each resource (energy, cost, time) has its own "crossover" task length.
- **Why it matters**: This means "pick the greenest model" has no single answer — you first have to answer "how long is the task" and "what kind of task," and only then does an answer emerge.

### Deep-Dive Points

- The pilot measures 15 open-weight models (0.6B–27B, from Qwen, Gemma, Llama, Ministral, and GLM) on two multi-step tasks with measured GPU energy
- Order task: Llama 3.2 3B is greenest from 3 to about 100 steps, then Qwen3 8B takes over; at 20 steps the greenest model uses a tenth of the largest model's energy, but by 100 steps that relationship flips to a 4x gap the other way ⚠️ (author's own pilot, 15 runs per model)
- Tools task: the greenest model switches hands earlier (at 4, 20, 30, and 50–60 steps), and only 6 of 15 models even complete a 50-step task
- Predicted and observed crossovers broadly agree: of 88 observed crossovers, 72 fall inside the formula's 95% confidence interval
- Adoption bar: applying the framework requires a team to actually measure per-step reliability and energy, not just read a leaderboard score
- Limitation: the pilot measures only GPU-board energy, uses two synthetic tasks and open-weight models up to 27B, and validates predictions against the same data used to produce them rather than a held-out set

### Reviewer's One-Line Take

Swapping "per-call comparison" for "per-completed-task comparison" is a solid reframing, and the literature review lays out the four gaps in this space clearly; but this is still a pilot — the real held-out test, larger models, and real-benchmark validation are still to come.

### Take-aways for You

- If you're choosing a model for an agent: don't just read a per-call leaderboard score — estimate how many steps your task typically runs, then check which model is most efficient near that step count
- If you're doing energy or cost governance for agents: count the energy spent on failed reruns into the total, not just the energy of the one successful call

## Today's Takeaway

I used to think "skill-marketplace risk" mostly meant malicious code, and "model choice" mostly meant reading a leaderboard. Today's papers changed that: most of the risk isn't malice at all — it's ordinary, working authorization scope that nobody had measured; and "which model is cheapest" has no fixed answer, because it flips entirely with task length. Both questions demand you actually measure first — a glance at a declaration or a leaderboard isn't enough.

## References

- [Beyond Maliciousness: Attack-Surface Profiling of Agent Skills — arXiv 2610.19264](https://arxiv.org/abs/2610.19264)
- [Why Static Skill Inconsistencies Do Not Equate to Runtime Risks — arXiv 2610.18927](https://arxiv.org/abs/2610.18927)
- [When Is Smaller Greener? Right-Sizing Language Models for Agentic AI — arXiv 2610.19345](https://arxiv.org/abs/2610.19345)
- [Agent Skills in the Wild: An Empirical Study of Security Vulnerabilities at Scale — arXiv 2601.10338](https://arxiv.org/abs/2601.10338)
- [“Do Not Mention This to the User”: Detecting Malicious Agent Skills in the Wild — arXiv 2602.06547](https://arxiv.org/abs/2602.06547)
- [Agent Skills specification — agentskills.io](https://agentskills.io/specification)
- [Extend Claude with skills — Anthropic docs](https://code.claude.com/docs/en/skills)
- [arXiv cs.AI new submissions](https://arxiv.org/list/cs.AI/new)
