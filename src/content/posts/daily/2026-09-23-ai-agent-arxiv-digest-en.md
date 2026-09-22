---
title: "AI Agent Arxiv Digest — 2026-09-23"
date: 2026-09-23
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's three papers each stress-test a part of the agent stack that usually gets tuned once and forgotten — harness self-improvement, skill-file correctness, and memory-system efficiency"
tldr: "RRSI finds that the strongest existing harness self-improvement method actually finishes 1.7 points below doing nothing when moved to unseen tasks, while adding regularization pushes out-of-distribution performance more than a point above the starting harness; SkillSpec uses Hoare-style specification reasoning to catch 239 out of 515 real-world agent skills with confirmed defects, at 61.2% precision; Jev-Mem offloads high-frequency memory decisions to a non-generative System-One controller, lifting LoCoMo score by 11.0%, construction speed by 6.6x, and cutting query latency by 36.7%"
series:
  name: "AI Agent Arxiv Digest"
  order: 122
---

> 🌏 [中文版](/posts/daily/2026-09-23-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers each take a scalpel to a part of the agent stack that usually gets tuned once and then left alone: the harness, the skill file, and memory. RRSI finds that letting an LLM automatically iterate on an agent's harness carries a real overfitting risk — the strongest of four existing methods actually scores 1.7 points below doing nothing at all once moved to unseen tasks, and only regularization brings that risk under control, buying an out-of-distribution average that clears the starting point by more than a point. SkillSpec turns to the rapidly expanding Agent Skill ecosystem, using Hoare-style pre/postconditions to compare what a skill's instructions claim against what its code actually does, and finds 239 out of 515 real-world skills carrying at least one confirmed defect. Jev-Mem asks a more fundamental efficiency question: does every small memory decision really need a full LLM generation call? Splitting the job between a fast System One and a deliberative System Two improves both accuracy and speed at once. The three papers differ in evidence maturity — RRSI and SkillSpec both come with large-scale benchmarks and explicit validation procedures, while Jev-Mem has so far only been validated on a single long-dialogue memory benchmark — but they share a common thread: agent capability increasingly hinges on whether the parts that look like "mere engineering detail" have actually been checked.

## Terms Worth Knowing Before Reading

| Term | Plain explanation |
|---|---|
| Agent Harness | The entire system wrapped around a frozen model's weights — prompts, tool interfaces, memory, context management, and control flow — that decides whether the same model can actually get the job done |
| Recursive Self-Improvement (RSI) | Letting a system repeatedly edit itself using feedback it generates — here it's the harness being edited, not model weights, which can keep improving in theory but can also just be memorizing the training task set |
| Overfitting | Scoring better on a specific task set while scoring worse on unseen tasks — here specifically about harness self-improvement getting too attuned to the exact tasks used for evaluation |
| Hoare logic / pre- and postconditions | A formal way of describing what a program should do: given an input state satisfying a precondition, the state after execution should satisfy a postcondition; SkillSpec repurposes this logic to check Agent Skills |
| Agent Skill | A reusable capability unit packaged for an agent, typically a SKILL.md instruction file plus scripts or other resources — increasingly the standard unit for distributing agent capabilities |
| System One / System Two cognition | A psychology framework distinguishing fast, intuitive thinking from slow, deliberate reasoning; Jev-Mem borrows it to hand high-frequency memory decisions to a non-generative System One while reserving complex reasoning for System Two |

---

## Paper 1｜RRSI: Does letting an agent rewrite its own harness just mean it's memorizing the answers?

**RRSI: Regularized Recursive Self-Improvement of Agent Harnesses**
Peng Xia, Rujun Han, Zifeng Wang et al. (Google Cloud AI Research + Stanford University + Washington University in St. Louis + UNC-Chapel Hill) · arxiv: 2609.24972

Links: [arxiv](https://arxiv.org/abs/2609.24972) · [alphaxiv](https://www.alphaxiv.org/abs/2609.24972)

### TL;DR

The strongest existing harness self-improvement method on the evolve set (TTHE) actually scores 1.7 points below the unmodified starting harness once moved to unseen tasks; the regularized RRSI trades away most of its evolve-set gains for up to 4.7 points of out-of-distribution improvement across eight benchmarks in three domains, with an overall out-of-distribution average of 43.6 versus the starting harness's 39.7.

### Editorial Judgment

| Aspect | Assessment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed; cs.LG primary, cs.AI cross-listed; submitted 2026-09-21) |
| Citation velocity | Not verified this round (Semantic Scholar rate-limited, 429 throughout); published 1 day ago, no citation data yet |
| Institution | Google Cloud AI Research, with collaborators from Stanford University, Washington University in St. Louis, and UNC-Chapel Hill |
| Community signal | Featured in HuggingFace Daily Papers' 2026-09-22 batch; code and project page publicly released |
| Credibility | Pass — full method design plus experiment tables and ablations across eight benchmarks in three domains |
| Evidence maturity | Substantial — covers both evolve and held-out splits with direct comparison against four existing methods, though the authors note it's still limited to frozen backbone models and a bounded set of evaluation benchmarks |
| Reproducibility | Full artifacts — code and project page publicly released (github.com/google-research/rrsi) |
| Why this paper | Direct — directly tests whether the currently popular harness self-improvement technique itself carries an overfitting risk |
| Novelty | Substantive — the first systematic application of machine-learning regularization principles (sparse updates, evidence-aware credit assignment, conservative selection) to the harness-evolution search process |
| Today's importance | High — any team using meta-harness-style automated harness tuning should re-examine its out-of-distribution validation pipeline |
| Practical link | Clear — provides three directly applicable rules: annealed edit budget, evidence-aware credit assignment, and a critic + pruner selection mechanism |
| Editorial confidence | High — the claim (existing methods can rank-invert out of distribution, and RRSI's regularization fixes this) is backed by complete controlled experiments |
| Reading recommendation | Must-read — engineering teams building or evaluating automated harness-optimization systems |
| Primary limitation | Only optimizes the harness layer with a frozen backbone model, not joint weight updates; effectiveness still depends on evolve-set quality and the choice of regularization hyperparameters |

### Field Background

Much recent progress in agent products has come from harness engineering rather than new model weights, but that engineering used to rely on humans manually reading failed trajectories and tweaking the scaffold, limiting progress to how many trajectories an engineer could read. Recent methods automate this with LLMs iteratively proposing and selecting component-wise harness edits — effectively recursive self-improvement at the agent-system level — but most such methods are validated only on a single evaluation set, with little systematic checking of whether evolve-set gains actually transfer.

### Mid-level Walkthrough

- **The problem**: Imagine an engineer runs an automated loop that lets an LLM repeatedly rewrite an agent's system prompt, tool interfaces, and memory-management rules, scoring each candidate against a training task set and keeping the best one. The resulting harness looks great on the training set — but move it to a similar but unseen batch of tasks, and its score drops below where it started. The model didn't get worse; the "automated harness editing" search process itself learned how to score well on that specific batch, not a genuinely better mechanism.
- **The method**: RRSI regularizes both the proposal side and the selection side without shrinking what parts of the harness can be edited. On the proposal side, an annealed edit budget caps how many coordinated edits can be bundled into one round (looser early on to explore new mechanisms, tighter later so changes become attributable); it records each candidate's hypothesis and outcome so later proposals can build on evidence rather than re-testing already-falsified directions; and it encourages exploring untouched harness components when the search stalls. On the selection side, a critic screens out benchmark-specific proposals, and a pruner removes changes that are too small, too costly, or no longer useful.
- **Why it matters**: This shows that "did harness self-improvement improve" and "does that improvement transfer to new tasks" are two separate questions that must be validated independently — this paper demonstrates that evaluating only on evolve-set scores can mistake a method that actually makes the system worse for a success.

### Deep-dive Points

- Evaluated across eight benchmarks spanning three domains — coding, agentic workspace, and engineering design — including SWE-bench Verified, JobBench, GDPval, APEX-Agents, and Frontier-Eng
- RRSI gains up to 14.1 points on the evolve split and up to 4.7 points across five out-of-distribution held-out benchmarks, while the resulting harness runs on 30% fewer policy tokens than unregularized evolution
- The strongest baseline on the evolve split (TTHE) posts the highest evolve-set score but its out-of-distribution average actually finishes 1.7 points below the unmodified starting harness (H0) ⚠️ (the authors' own experiment, not yet externally replicated); another baseline (Meta-Harness) gains only 0.9 points out of distribution
- RRSI itself posts the smallest evolve-set gain of any evaluated method, yet is the only one whose out-of-distribution average clears the starting point by more than a point: 43.6 versus 39.7
- Deployment threshold: requires an existing pipeline capable of proposing and executing harness edits (meta-harness-style tooling); RRSI adds regularization rules on top rather than being a from-scratch system
- Limitation (self-reported): only addresses harness-layer optimization with a frozen backbone; broader validation is still needed across substantially different agent architectures, tool ecosystems, and longer-running self-improvement processes

### Reviewer's One-Line Take

Systematically porting familiar machine-learning regularization principles into the harness self-improvement search process, and proving with a full evolve/OOD comparison that existing methods really can rank-invert, is this paper's most valuable contribution; but the validation still sits on a handful of carefully curated evaluation suites, some distance from the noisier, more distribution-shifting self-improvement loops of real production traffic.

### Your Take-away

- If you're doing automated harness tuning (meta-harness / self-improvement loops): treat RRSI's four rules as a checklist — annealed edit budget, evidence-aware credit assignment, critic screening, pruner trimming — especially the rule capping how many components can change in a single round, which automated tools tend to skip
- If you're evaluating someone else's published harness self-improvement results: ask for the out-of-distribution held-out numbers first, not just the pretty evolve-set score — this paper shows the two can rank in opposite order

---

## Paper 2｜SkillSpec: Does your Agent Skill's documentation actually match its code?

**SkillSpec: Intent-Masked Specification Reasoning for Agent Skill Correctness**
Yizhuo Zhang, Bo Kang, Yi Yang et al. (Beihang University) · arxiv: 2609.06052

Links: [arxiv](https://arxiv.org/abs/2609.06052) · [alphaxiv](https://www.alphaxiv.org/abs/2609.06052)

### TL;DR

Using Hoare logic to compare a skill's declared intent against what its code and instructions actually do, SkillSpec finds 239 out of 515 real-world skills (46.4%) carrying at least one manually confirmed defect, totaling 763 confirmed defects, at 61.2% precision under sandbox validation.

### Editorial Judgment

| Aspect | Assessment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed; cs.SE primary, cs.AI secondary; submitted 2026-09-05) |
| Citation velocity | Not verified this round (Semantic Scholar rate-limited, 429 throughout); published 18 days ago, no citation data yet |
| Institution | Beihang University |
| Community signal | Featured in HuggingFace Daily Papers' 2026-09-22 batch; code and defect dataset publicly released (github.com/IainZhang/SkillSpec, huggingface.co/datasets/IainZhang/SkillSpec) |
| Credibility | Pass — full method design, results on 515 real-world skills with a manual confirmation process, and explicit discussion of data-leakage risk and procedural-variation control |
| Evidence maturity | Substantial — large-scale real corpus, manually confirmed defects, node-level analysis across multiple model families, though the authors note skill-graph decomposition itself is non-unique and results can shift with decomposition choice |
| Reproducibility | Full artifacts — code and defect dataset both publicly released |
| Why this paper | Direct — directly addresses a concrete gap: the Agent Skill ecosystem is exploding while correctness checking is nearly nonexistent |
| Novelty | Substantive — the first application of Hoare-style specification reasoning to both static defect detection and dynamic sandbox validation across heterogeneous workflow and code artifacts |
| Today's importance | High — offers a currently rare automated quality-assurance method for teams publishing or maintaining Agent Skills |
| Practical link | Clear — the sandbox validation pipeline can be directly reused as an automated first-pass quality gate before publishing a skill |
| Editorial confidence | High — the claim (defects are prevalent in real skill ecosystems and can be systematically caught by specification reasoning) is backed by large-scale manually confirmed results |
| Reading recommendation | Must-read — engineering teams maintaining public or internal skill libraries |
| Primary limitation | Skill-graph decomposition is itself non-unique, so different decompositions may yield different results; remaining false positives mainly come from inaccurate inferred specifications or validator-constructed edge cases that don't occur in practice |

### Field Background

The agent skill ecosystem is expanding rapidly — the paper notes over 200,000 skills released within six months — but existing research has mostly focused on benchmarks, capability enhancement, and safety, leaving skill defects largely unexamined. Traditional software behavior is deterministically defined by code and checked via type systems, tests, and runtime failures; but agent skills rely heavily on free-form natural-language instructions, whose failure modes go beyond conventional code defects to semantic-level inconsistencies like description drift and intent conflicts — and these are often silently papered over by the underlying model's own capability, becoming invisible failures.

### Mid-level Walkthrough

- **The problem**: Imagine you install a "generate report" skill whose instructions say to output a certain format, but the accompanying script actually does something slightly different. Because the underlying model is capable, it may quietly fill in that gap itself, producing a plausible-looking result that doesn't actually match the original intent — and this defect never surfaces as an obvious execution failure; it just sits there silently until someone happens to notice.
- **The method**: SkillSpec converts an entire skill repository into a unified graph representation that aligns descriptions, instructions, and code artifacts. For each node, it derives an ExpectSpec from the surrounding declared intent, and infers a FactSpec from the implementation under a partially disclosed intent. An "intent mask" controls how much surrounding context is visible (holistic / lineage / neighborhood / local views), balancing the risk of seeing too much context (which biases toward the claimed behavior) against seeing too little (which allows unsupported inferences). Flagged candidate defects are then actually run and validated in an isolated sandbox.
- **Why it matters**: As more frameworks standardize on SKILL.md as the unit of distribution, this finally offers a formal, automatable way to answer "does what this skill says match what it does" — instead of waiting for a user to stumble onto the problem.

### Deep-dive Points

- The corpus combines 515 real-world skills from SkillsBench and the most-downloaded skills on skills.sh (SkillsTop)
- At data collection time, skills.sh hosted 884,669 skills; filtering to those with over 1,000 installs yielded 7,577 for ecosystem characterization — nearly half contain only a single SKILL.md, and 72.6% contain exclusively Markdown files
- SkillSpec finds manually confirmed defects in 239 skills (46.4%), totaling 763 confirmed defects, with an overall precision of 61.2% under sandbox validation
- Node-level analysis across multiple model families shows specification reasoning is consistently reliable for code nodes, while plain-text nodes remain the main bottleneck; most defects occur at the boundary between declared intent and implementation
- Deployment threshold: requires an environment capable of running sandbox re-execution (warm containers plus a fresh workspace per run); integration cost is relatively predictable for teams that already have CI/CD or sandbox infrastructure
- Limitation (self-reported): skill-graph decomposition is inherently non-unique — unlike code graphs, natural-language workflows admit multiple plausible abstractions; to control this variance, the paper evaluates all models against the same frozen graph; remaining false positives mainly come from inaccurate inferred specifications or validator-constructed edge cases infeasible in practice; validation is further constrained by unavailable dependencies, credentials, hardware, and execution time

### Reviewer's One-Line Take

Turning "does this skill silently misbehave" into a testable Hoare-style specification-consistency problem, backed by a download-weighted real-world corpus and sandbox validation, is a solid new angle for an artifact type with almost no existing testing culture; but 61.2% precision means more than a third of flagged candidates are false positives, and the authors' own acknowledgment that skill-graph decomposition is non-unique means results will shift somewhat depending on how SkillSpec happens to carve up a given skill.

### Your Take-away

- If you maintain or publish public Agent Skills: run through the "declared intent" versus "what the code actually does" framing yourself, paying special attention to plain-text instruction steps — this is where the paper finds defects most often hide
- If you're building a skill marketplace or internal skill library: SkillSpec's sandbox validation pipeline can be adopted directly as an automated first quality gate before publishing, instead of waiting for user reports to surface defects

---

## Paper 3｜Jev-Mem: Does every small memory decision really need a full LLM generation call?

**Jev-Mem: System-One-Controlled Agentic Memory for Efficient AI Agents**
Dongming Jiang, Yi Li, Bingzhe Li (The University of Texas at Dallas) · arxiv: 2609.23986

Links: [arxiv](https://arxiv.org/abs/2609.23986) · [alphaxiv](https://www.alphaxiv.org/abs/2609.23986)

### TL;DR

By offloading high-frequency but bounded memory decisions — typing, routing, scoring, and stopping — from a full generative LLM call to a non-generative System-One controller, Jev-Mem reaches an overall LLM-as-a-Judge score of 0.777 on LoCoMo (11.0% higher than the strongest baseline), cuts memory construction time to 158 seconds (a 6.6x speedup over the fastest baseline), and reduces average query latency to 0.93 seconds (a 36.7% reduction).

### Editorial Judgment

| Aspect | Assessment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed; cs.AI primary, cs.LG secondary; submitted 2026-09-21) |
| Citation velocity | Not verified this round (Semantic Scholar rate-limited, 429 throughout); published 1 day ago, no citation data yet |
| Institution | The University of Texas at Dallas |
| Community signal | Featured in HuggingFace Daily Papers' 2026-09-22 batch; code publicly released (github.com/libingzheren/Jev-Mem) |
| Credibility | Pass — full architecture design and direct comparison against multiple existing memory systems on the LoCoMo benchmark |
| Evidence maturity | Preliminary — performance and efficiency numbers are complete and clearly compared, but validation so far covers only a single long-dialogue memory benchmark (LoCoMo), not other task types |
| Reproducibility | Full artifacts — code publicly released |
| Why this paper | Direct — directly separates two questions that are usually conflated: how smart a memory system needs to be, and whether every one of its decisions needs a generative LLM call |
| Novelty | Substantive — systematically applies the System One/Two cognitive framework across both construction and retrieval in the memory lifecycle, rather than optimizing a single step |
| Today's importance | Medium — directly relevant to cost and latency for long-running, memory-heavy agent systems, but the validation scope is currently narrow |
| Practical link | Clear — offers a concrete architectural division of labor: hand high-frequency structured decisions to a lightweight controller, reserve complex reasoning for a general LLM |
| Editorial confidence | Medium — the performance-improvement claim is backed by complete comparison numbers under the LoCoMo setting, but generalizing to other task types currently lacks evidence |
| Reading recommendation | Skim — particularly useful for engineers building or optimizing their own agent memory modules |
| Primary limitation | Validation is currently confined to a single long-dialogue memory benchmark (LoCoMo); it's not yet shown whether the same gains hold for other task types such as coding assistants or long-horizon planning |

### Field Background

Agent memory systems have evolved from passive storage with simple semantic-similarity retrieval into active, structured subsystems that selectively retain, consolidate, and organize information into multi-relational knowledge graphs. But as memory becomes richer, controlling it grows more expensive — most systems still rely on either fixed heuristics (efficient but inflexible) or general-purpose generative LLMs (semantically flexible but paying a token-generation cost for every decision), and these decisions frequently sit on memory's critical path.

### Mid-level Walkthrough

- **The problem**: Imagine every time your agent needs to decide "is this new note related to an old one," "which memory block should I search," or "have I retrieved enough evidence, should I keep searching," it has to make a full LLM generation call just to get an answer — even when that answer is just a label or a score. For a long-running agent making thousands of such small judgments, the accumulated latency and cost can dwarf the moments that genuinely need deep reasoning.
- **The method**: Jev-Mem borrows the System One/Two cognitive framework, handing high-frequency, bounded-output decisions throughout the memory lifecycle — memory typing, relation judgment, query routing, retrieval-budget allocation, graph traversal, candidate scoring, and stopping — to a non-generative System-One controller that outputs probabilities or classifications rather than free-form text. Only genuinely open-ended reasoning and answer synthesis are routed to a general System Two. Memory itself is maintained in a multi-relational data plane, with semantic, temporal, causal, and entity relational views sharing the same underlying nodes.
- **Why it matters**: This shows that "how smart does a memory system need to be" and "does every one of its decisions need a generative LLM call" are actually separable questions — separating them yields gains in both performance and efficiency simultaneously, rather than the usual trade-off of sacrificing one for the other.

### Deep-dive Points

- On the LoCoMo benchmark, overall LLM-as-a-Judge score reaches 0.777, an 11.0% relative improvement over the strongest baseline
- Memory construction time drops to 158 seconds, a 6.6x speedup over the fastest competing memory system
- Average query latency drops to 0.93 seconds, a 36.7% reduction versus baselines
- The paper explicitly notes that the current System-One controller (Jev) is just one concrete realization; the core novelty is the architectural principle of separating memory control into its own systems layer, and other underlying decision mechanisms remain to be validated
- Deployment threshold: requires being able to replace the "LLM-judged" nodes in an existing memory system; for systems already organized around a graph structure, the scope of change is relatively contained
- Limitation (self-reported): all current performance and efficiency numbers come from a single long-dialogue memory benchmark (LoCoMo); it has not yet been validated whether the same gains hold for other task types such as coding assistants or long-horizon planning

### Reviewer's One-Line Take

Clearly articulating which memory-system decisions actually require a generative LLM — and backing it with public code and complete comparison numbers showing that cost and performance can improve together — is a solid systems contribution; but the validation currently covers a single long-dialogue benchmark, some distance from a general conclusion across different task types.

### Your Take-away

- If you're building a memory system for a long-running agent: audit how many "decisions" in your memory module are currently made via a full LLM generation call (typing, routing, when to stop retrieving) — these are usually the first candidates to swap for a lightweight controller
- If you're evaluating existing memory systems (Mem0, Zep, Letta, etc.): look at accuracy and construction/query latency separately — this paper shows both can improve together, without assuming you must trade one for the other

---

## Today's Takeaway

I used to assume that if harness self-improvement, skill files, and memory systems ran and their scores went up, that meant they were working correctly. Today's papers show the real problems tend to hide in a few checks that are easy to skip: whether you re-tested on a batch of genuinely unseen tasks, whether the documentation actually matches the code, and whether a given decision really requires a generative LLM call. The three methods are completely different, but they point at the same thing: the parts of an agent system that look like "tune it once and it's fine" actually need their own independently verifiable quality-assurance procedures — they can't just rely on the model being smart enough to quietly paper over the gaps.

## References

- [RRSI: Regularized Recursive Self-Improvement of Agent Harnesses](https://arxiv.org/abs/2609.24972)
- [RRSI — alphaxiv](https://www.alphaxiv.org/abs/2609.24972)
- [RRSI — code & project page](https://github.com/google-research/rrsi)
- [SkillSpec: Intent-Masked Specification Reasoning for Agent Skill Correctness](https://arxiv.org/abs/2609.06052)
- [SkillSpec — alphaxiv](https://www.alphaxiv.org/abs/2609.06052)
- [SkillSpec — code & defect dataset](https://github.com/IainZhang/SkillSpec)
- [Jev-Mem: System-One-Controlled Agentic Memory for Efficient AI Agents](https://arxiv.org/abs/2609.23986)
- [Jev-Mem — alphaxiv](https://www.alphaxiv.org/abs/2609.23986)
- [Jev-Mem — code](https://github.com/libingzheren/Jev-Mem)
- [arXiv cs.AI new listings](https://arxiv.org/list/cs.AI/new)
- [HuggingFace Daily Papers](https://huggingface.co/papers)
