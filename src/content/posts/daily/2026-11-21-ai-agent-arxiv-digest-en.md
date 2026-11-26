---
title: "AI Agent Arxiv Digest — 2026-11-21"
date: 2026-11-21
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Three papers today answer the same question from three angles: when agents maintain their own skills or memory without feedback, it gets worse; with the right feedback it genuinely improves; and how much to keep depends on the model, not the memory system"
tldr: "One paper shows agents rewriting their own skill files with zero feedback make the skill worse, every model losing ground after 30 rounds; another shows fine-grained, instruction-level feedback flips that result, letting self-evolution beat published baselines; a third is IBM's production deployment record showing how much memory to keep is a property of the model, not the memory system"
series:
  name: "AI Agent Arxiv Digest"
  order: 181
---

## Today's Overview

Today's three papers converge on one point: agents maintaining their own accumulated knowledge — skill documents or long-term memory — is riskier than it looks. The first paper shows, systematically, that rewriting a skill file with zero feedback degrades it round after round, with every tested model scoring worse than the original skill after 30 rounds. The second changes exactly one condition — adding fine-grained, instruction-level feedback to the same kind of self-evolution — and self-evolution not only stops degrading, it beats two published baselines. The third is IBM's deployment record for a memory system running in real production (the CUGA agent and watsonx Orchestrate), honestly listing seven lessons learned the hard way, the sharpest being: how much memory to keep is a property of the model's own capability, not of how well the memory system is designed. All three carry substantial evidence — causal tests, cross-baseline comparisons, real deployment data — and all three are explicit about where their own claims stop.

## Terms worth knowing before this one

| Term | Plain explanation |
|---|---|
| Agent skill | A document an expert writes for an agent to load, telling it what steps to take and which tools to call for a given kind of task |
| Self-evolution | An agent revising the skill file or memory content it itself uses, without retraining the underlying model |
| Feedback | Here, whether there is any objective signal after execution — a verifier pass/fail, a human label — telling the agent whether a given revision was good or bad |
| Instruction-level coverage | Breaking one run down to every single instruction inside the skill file and labeling each as followed, not followed, or not reached — finer-grained than just task-level pass/fail |
| Support | How many independent execution traces derived the same conclusion; a higher count means more common, not more correct |
| Dose-response | Here, how task performance changes as the amount of memory (number of guidelines) grows; this paper finds the shape of that curve differs by model |

---

## Paper One | How feedback-free self-evolution quietly breaks skill files

**How Feedback-Free Self-Evolution Reshapes Agent Skills: A Systematic Study**
Litao Guo, Man Chen, Xinli Xu et al. (The Hong Kong University of Science and Technology (Guangzhou) + HKUST + Knowin) · arxiv: 2611.25534

Links: [arxiv](https://arxiv.org/abs/2611.25534) · [alphaxiv](https://www.alphaxiv.org/abs/2611.25534)

### TL;DR

Letting six models rewrite a skill file for 30 rounds with zero task, execution, or judgment feedback makes every model perform worse on SkillsBench than with the original skill, 15 points on average; tracing the cause shows rewriting first discards the content that models can't come up with on their own — content only the original expert supplied — and putting it back recovers most of the lost pass rate.

### Editorial judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation velocity | Published 2 days ago; Semantic Scholar returned 404 (not yet indexed, common for same-day preprints), citation count is almost certainly 0 |
| Institution | HKUST (Guangzhou) + HKUST + Knowin |
| Community signal | Not found on HF Daily Papers / Papers with Code (this round's full HF ranking could not be checked due to output truncation) |
| Credibility | Pass — 6 models x 3 benchmarks x 30 rewriting rounds, plus a causal "restore the content" experiment and a cross-model swap test |
| Evidence maturity | Substantial — first systematic study of this failure mode, with causal (not just correlational) validation, though still a single unreplicated paper |
| Reproducibility | Full artifacts — public GitHub repo with the rewriting pipeline and SkillDiff implementation; all three benchmarks are public third-party benchmarks |
| Why this one | Direct — agents rewriting their own skill files is already common practice; this is the first systematic check of whether that's safe |
| Novelty | Substantive — not just a diagnosis, but a causal mechanism plus a zero-cost fix (SkillDiff) |
| Today's importance | High — the other two papers today complete this finding from the "add feedback" and "real deployment" angles |
| Practical link | Clear — any team letting an agent auto-maintain a SKILL.md or prompt library should read this first |
| Editorial confidence | High — the claim is tightly scoped to feedback-free rewriting specifically, and every number traces to a stated experiment |
| Recommended | Must-read — for teams using or planning self-evolution to maintain skill/prompt libraries |
| Main limitation | All three benchmarks (SkillsBench, LogicBench, MedCalc-Bench) pair tasks with pre-existing, research-curated expert skills; whether messier real-world skill libraries degrade the same way is untested |

### Field context

Skill documents let an agent load expert-written steps and tool guidance for a given task; SkillsBench data shows the right skill raises the average pass rate of 18 agent configurations by 16.6 points. But skills go stale, don't transfer, and don't always suit a new model, so more and more maintenance is delegated to the model itself. The question — what happens when there's no task outcome, no verifier, no human judge, which is the reality of most practical settings — had never been systematically tested.

### Mid-level walkthrough

- **The problem**: imagine handing a new chef a recipe passed down three generations, but never letting them cook it or letting anyone taste the result — only letting them "polish" it by instinct. After thirty rounds, the recipe may be unrecognizable, not because the chef meant to ruin it, but because they keep pulling it toward what feels familiar to them, and the original recipe's most valuable, least obvious details — the ones they'd never have thought of themselves — are exactly what goes first.
- **The method**: the team had six models rewrite the same skill document for 30 rounds with no task, no execution, no judgment at all, then ran real agent tasks with the rewritten skills. In parallel, they had each model write ten skills from a one-sentence topic alone, with no access to the expert's original text, as a baseline for "what this model already knows." Comparing the two showed rewriting pulls the text toward what the model can write on its own, and content from the expert's original that none of the ten self-written skills mentioned survived only 23.1% of the time after 30 rounds, versus 84.2% for content all ten self-written skills mentioned.
- **Why it matters**: this means a big part of an expert skill's real value is exactly the part a model can't come up with on its own — and that's precisely what feedback-free self-evolution discards first. The team's proposed SkillDiff needs no feedback and changes no wording; it just flags this model-external content in place so the agent is reminded to follow it, raising SkillsBench pass rate by 4.8 points.

### Deeper details

- On SkillsBench, every agent scores below the original skill after 30 rounds, by 10.3 to 23.0 points across the six models
- The first rewrite alone already costs 7.1 points on average; 10.9 points after five rounds; 14.6 points after thirty — degradation is fastest early on
- LogicBench accuracy falls from 86.2% with the original skill to 71.4%, matching no-skill level; MedCalc-Bench falls from 89.7% to 78.7%, below the 81.1% achieved with no skill at all
- Causal test: restoring the lost "model-external" content after 30 rounds recovers roughly twice as much pass rate as restoring other lost content
- SkillDiff needs no rewriting and no feedback signal at all — just marking and a reminder — yet raises SkillsBench pass rate by 4.8 points
- Deployment bar: requires first building a "model prior" baseline (having the model self-write from topic alone), one extra round of model calls, far cheaper than continuously supervising rewrite outcomes
- Limitation: all three benchmarks pair tasks with research-curated expert skills; whether messier real-world skill libraries degrade the same way is untested

### Reviewer's one-line take

The causal chain — rewriting pulls toward the model's prior, prior-external content is lost first, restoring it recovers performance — is tightly built, and SkillDiff is a convincing free fix; the next question is whether the way "model prior" is measured here (TF-IDF textual distance) holds up when skill content is more conversational and less terminology-heavy.

### Takeaways for you

- If you're building a system that lets an agent auto-maintain a SKILL.md or prompt library: first check whether your rewriting loop has any feedback signal at all — if it has none, treat this result as a warning sign, and either add even minimal verification or adopt SkillDiff's "flag model-external content" approach instead of letting the model rewrite freely
- If you're evaluating whether to adopt a self-evolving skill system: use the "model prior baseline" (having the model self-write a version from topic alone) as a pre-launch health check — the sections where the gap from your real skill is largest are your highest-risk spots

---

## Paper Two | Add the right feedback to self-evolution, and it beats existing methods

**Evolve Where It Matters: Coverage-Guided Self-Evolution of Agent Skills**
Boyin Tan, Jiadong Zhang, Xiaosong Ma et al. (Mohamed bin Zayed University of Artificial Intelligence + University of Liverpool) · arxiv: 2611.25429

Links: [arxiv](https://arxiv.org/abs/2611.25429) · [alphaxiv](https://www.alphaxiv.org/abs/2611.25429)

### TL;DR

Breaking one run down to every instruction in the skill file and labeling each as followed / not-followed / not-covered, then driving self-evolution with this fine-grained signal, lets SkillPlumber solve the most tasks across three benchmarks and three agent frameworks (64.7% to 70.5%), 8.7 to 14.0 points above the strongest published baseline; removing the coverage signal alone cuts the recovered failures on SkillsBench by 20.8%.

### Editorial judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (cross-listed cs.CL/cs.AI, not peer-reviewed) |
| Citation velocity | Published 2 days ago; Semantic Scholar 429 rate-limited; almost certainly 0 citations for a just-published preprint |
| Institution | Mohamed bin Zayed University of Artificial Intelligence (MBZUAI) + University of Liverpool |
| Community signal | Not found on HF Daily Papers / Papers with Code (confirmed via web_search; only arXiv listing pages and auto-summary mirrors found) |
| Credibility | Pass — 3 benchmarks x 3 agent frameworks, two published baselines re-run under a shared protocol, with an ablation isolating the proposed mechanism |
| Evidence maturity | Substantial — the ablation separates the coverage signal's contribution from generic trajectory analysis, and token cost is disclosed honestly |
| Reproducibility | Partial artifacts — all three benchmarks are public with full protocols described, but no public code repository for SkillPlumber itself was found this round |
| Why this one | Direct — it directly answers the question Paper One leaves open: does self-evolution actually improve once the right feedback is added |
| Novelty | Substantive — brings the code-coverage concept from software debugging into skill self-evolution, with a root-cause layer and a cross-task strategy library |
| Today's importance | High — together with Papers One and Three, it completes the picture of when self-maintained knowledge works and when it fails |
| Practical link | Clear — tested across three mainstream agent frameworks (Codex, Claude Code, OpenHands), low porting cost |
| Editorial confidence | High — every number ties to a stated benchmark/executor/baseline combination, and the paper openly admits where it doesn't lead |
| Recommended | Must-read — for teams wanting a genuinely reliable self-evolving skill system |
| Main limitation | Both root-cause analysis and coverage labeling depend on an LLM judge; the paper's own Limitations section names this and cites an external validation of the labeling task's reliability, without re-validating it here |

### Field context

Existing skill self-evolution methods mostly only look at whether a task succeeded or failed overall, with no way to tell whether a failure came from a wrong instruction in the skill or from a correct instruction the agent simply didn't follow — two situations that need completely different fixes. This paper borrows the "code coverage" idea from software debugging: knowing exactly which lines a failing run executed narrows down where the bug is.

### Mid-level walkthrough

- **The problem**: imagine a refund-process skill document that says "price in USD," but the agent got stuck for an entirely different reason before ever reaching that step. If you only look at "this task failed," you might wrongly blame and rewrite the USD instruction when the real problem is elsewhere.
- **The method**: SkillPlumber first labels every run at the instruction level as followed, not-followed, or not-covered, then uses a persistent root-cause-analysis agent to turn each label into a concrete revision question, checking the next run to see whether the revision actually fixed it. A separate "maintainer" role distills lessons learned across different tasks into a shared strategy library.
- **Why it matters**: this shows Paper One's finding isn't "self-evolution is doomed" but "self-evolution without feedback is doomed" — once the feedback signal is fine enough (down to the instruction level), self-evolution doesn't just stop degrading, it can outperform carefully hand-designed existing methods.

```diagram
title: SkillPlumber's coverage-guided self-evolution loop
desc: Each run is labeled by instruction into three states to locate the bad step, the fix is written back into the skill file, and findings accumulate in a shared playbook across tasks.
caption: Simplified, redrawn from the process described in arXiv:2611.25429 Sec 3-4.
step: Run the task with the current skill; the verifier marks it pass or fail
step: Label every instruction follow / not-follow / not-covered to localize the fault
step: Root-cause analysis turns the label into a revision question, written back into the skill
step: The revised skill runs again next round, and the finding is added to the shared playbook
---
<svg viewBox="0 0 440 392">
  <path class="dg-line" d="M280 56.3A152 152 0 0 1 368.8 165.1" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M369.4 224A152 152 0 0 1 282.7 334.4" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M160 335.7A152 152 0 0 1 71.2 226.9" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M70.6 168A152 152 0 0 1 157.3 57.6" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--dashed" d="M312 196H276" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--dashed" d="M220 224V316" marker-end="url(#arrow)" data-step="3"/>

  <g data-step="1">
    <rect class="dg-box" x="160" y="16" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="35" text-anchor="middle" dominant-baseline="central">Run task</text>
    <text class="dg-sub" x="220" y="55" text-anchor="middle" dominant-baseline="central">Pass / fail</text>
  </g>

  <g data-step="2">
    <rect class="dg-box dg-box--accent" x="312" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="372" y="187" text-anchor="middle" dominant-baseline="central">Coverage</text>
    <text class="dg-sub" x="372" y="207" text-anchor="middle" dominant-baseline="central">Find the cause</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="160" y="320" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="339" text-anchor="middle" dominant-baseline="central">Revise skill</text>
    <text class="dg-sub" x="220" y="359" text-anchor="middle" dominant-baseline="central">Edit the file</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="8" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="68" y="187" text-anchor="middle" dominant-baseline="central">Re-run</text>
    <text class="dg-sub" x="68" y="207" text-anchor="middle" dominant-baseline="central">New skill runs</text>
  </g>

  <rect class="dg-box dg-box--store" x="168" y="168" width="104" height="56" rx="6"/>
  <text class="dg-label" x="220" y="187" text-anchor="middle" dominant-baseline="central">Playbook</text>
  <text class="dg-sub" x="220" y="207" text-anchor="middle" dominant-baseline="central">All tasks</text>

  <text class="dg-edge" x="292" y="182" text-anchor="middle" dominant-baseline="central" data-step="2">Write</text>
  <text class="dg-edge" x="230" y="270" text-anchor="start" dominant-baseline="central" data-step="3">Read</text>
</svg>
```

### Deeper details

- Leads on all combinations of 3 benchmarks (SkillsBench 87 tasks, SkillLearnBench 50 task families, SWE-Skills-Bench-Hard 70 tasks) x 3 agent frameworks (GPT-5.5/Codex, Opus 4.8/Claude Code, DeepSeek-V4-Pro/OpenHands)
- With GPT-5.5, SkillPlumber recovers 30 of the 34 failures SkillRevise itself recovers, and 25 of the 33 CoEvoSkills recovers — not swapping which tasks get solved, genuinely wider coverage
- Removing the coverage signal alone (same RCA agent, same trajectories, same round budget) drops recovered failures on SkillsBench from 24 to 19
- Averages only 3.4 revisions per recovered failure, versus 4.1 for SkillRevise and 11.6 for CoEvoSkills — because its RCA agent stops on its own once it finds nothing worth fixing
- Token cost: roughly 2x the baselines' tokens, but the extra mostly goes into producing the coverage record itself, not a longer analysis
- Deployment bar: validated across three mainstream agent frameworks; porting to others like LangGraph or CrewAI mainly means wiring instruction-level coverage labeling into the existing execution trace
- Limitation: both root-cause analysis and coverage labeling rely on an LLM judge, which the paper's own Limitations section acknowledges, noting the framework itself wouldn't need to change with a stronger judge

### Reviewer's one-line take

The three-benchmark, three-framework ablation is solid, and the task-overlap analysis rules out "just solving a different batch of the same size"; but the whole method leans heavily on an LLM judge, and the next thing to check is whether a systematic mislabeling of one instruction type would systematically bias the root-cause attribution too.

### Takeaways for you

- If you're designing a skill/prompt self-revision system: replace "only look at overall task success/failure" with "label each instruction's followed status" — this paper's ablation already shows that fine-grained signal is the main source of the gain, not a nice-to-have
- If you already have a root-cause-style revision agent: evaluate adding a cross-task "playbook" role that distills lessons from different tasks into shared knowledge, instead of letting each task rediscover the same problem independently

---

## Paper Three | IBM's most expensive lesson from deploying memory in production

**How Much Should an Agent Remember? Deployment Lessons from Self-Distilled Memory for LLM Agents**
K. R. Jayaram, Vatche Isahagian, Aswath Vaithinathan Aravindan et al. (IBM Research) · arxiv: 2611.26361

Links: [arxiv](https://arxiv.org/abs/2611.26361) · [alphaxiv](https://www.alphaxiv.org/abs/2611.26361)

### TL;DR

IBM deployed a system (altk-evolve) that distills memory from an agent's own execution history into the CUGA agent and watsonx Orchestrate production platform; testing 8 models found how much memory to keep is a property of the model's capability — a strong model (DeepSeek-V3.2) gains up to 9.5 points with its full set of 191 guidelines, while a weak model (gpt-oss-120b) does worse with all 199 guidelines than with a selected subset of just 29 (55.4% vs. 51.2%).

### Editorial judgment

| Aspect | Judgment |
|---|---|
| Venue | Accepted to IAAI 2027 (Oral) — peer-reviewed, accepted applications track with oral presentation |
| Citation velocity | Published 2 days ago; Semantic Scholar 429 rate-limited; accepted but just posted to arXiv, citation count almost certainly 0 |
| Institution | IBM Research |
| Community signal | Not found on HF Daily Papers / Papers with Code this round, but the same altk-evolve project has had an official IBM Research Hugging Face blog post since April 2026, confirming it's an existing, established system rather than a one-off |
| Credibility | Pass — 8-model benchmark with an explicit noise floor, a self-caught and corrected baseline confound, and real deployment data from two production products |
| Evidence maturity | Substantial — combines controlled benchmark evaluation with production deployment evidence, and the paper clearly labels which parts are "descriptive" rather than "controlled estimates" |
| Reproducibility | Full artifacts — altk-evolve is a public open-source library; AppWorld and tau-bench are public benchmarks with deterministic verifiers |
| Why this one | Direct — tests the "feedback and dose matter" lesson from Papers One and Two against a real production deployment |
| Novelty | Substantive — the method itself builds on prior memory-distillation work, but the "seven lessons learned after deployment" are a rare degree of honest disclosure |
| Today's importance | High — the only one of the three backed by real production deployment, and the only one with a peer-reviewed venue |
| Practical link | Clear — seven concrete recommendations (treat dose as a first-class parameter, don't compress, preserve provenance on every field, etc.) translate directly into an engineering checklist |
| Editorial confidence | High — the paper repeatedly downgrades its own apparent wins into more conservative conclusions (e.g. reframing a "win" over a baseline as "a tie at one-seventh the token cost") |
| Recommended | Must-read — for any team planning to put an agent memory system into production |
| Main limitation | Whether a memory guideline is kept depends on "support" — how many independent trajectories derived the same conclusion — not on whether the conclusion is correct; the paper itself catches a high-support guideline that anchored a wrong API pagination assumption and caused a real task regression, and admits there is currently no correctness or recency signal |

### Field context

Letting agents learn lessons from their own execution history (ExpeL, Agentic Context Engineering, Reflexion, and others) is already common in research, but most such methods are only validated on research benchmarks. This paper asks a plainer, less often answered question: what actually goes wrong once such a system ships and gets used daily, across different models and tasks?

### Mid-level walkthrough

- **The problem**: imagine a new hire who reads a hundred old case files and derives the rule "always ask the customer for an invoice first" — a rule independently confirmed by ten different cases, which sounds reliable. But if those ten cases happen to be the same type of customer, the rule could be completely wrong in a different situation, and nobody would notice, because it looks well-validated.
- **The method**: altk-evolve runs in three stages — mining one to three short lessons from each execution trace, consolidating similar lessons into "guidelines" (each recording how many lessons it merged), and deciding at inference time whether to give the agent all guidelines or a selected subset. Testing 8 models on the AppWorld benchmark revealed a clear split: a capable model (DeepSeek-V3.2) keeps improving as more guidelines are added, while a weak model (gpt-oss-120b) gets dragged down past a certain point, with a small, selected subset performing better.
- **Why it matters**: this means "the memory system is well designed" and "this memory system works for your model" are two different claims, and the second depends on which model you're running, not which memory framework you chose. The team also lists seven pitfalls hit during deployment, the worst being three operational failures (a swallowed HTTP 400, a truncated JSON response, and a write path that was never actually invoked) that cost more time than every research question combined.

### Deeper details

- DeepSeek-V3.2 climbs from 79.8% to 89.3% task completion (+9.5 points) as guidelines grow from 0 to the full set of 191; scenario completion rises from 64.3% to 80.4%
- gpt-oss-120b scores only 51.2% with all 199 guidelines, below the 53.6% it gets from a 24-guideline core; its best result, 55.4% (mean of two runs), comes from a selected subset of about 29, at near-zero extra token cost
- The first consolidation attempt compressed lessons into a tidy 12-item list, which gave DeepSeek only +2.9 points; switching to lossless consolidation that kept all 144 single-occurrence "situational" lessons raised the gain to +9.5 — most of the value was hiding in exactly the content that looked unimportant
- Noise floor: running the identical configuration twice gave gpt-oss-120b 56.0% and 54.8%; across identical DeepSeek runs, roughly 32 of 168 tasks flip outcome, so the team now treats any gap under about 5 tasks as noise rather than a claimed win
- Compared against a prior method (ACE), an early "big win" turned out to be partly due to the two agents having different baseline scaffolds (different prompt templates); once corrected, the two methods' actual memory contributions were comparable, but altk-evolve used only one-quarter to one-seventh of ACE's tokens
- Limitation: support (how many independent trajectories derived the same guideline) measures how common a rule is, not whether it's correct — the paper catches exactly this kind of wrong-but-popular guideline causing a real regression, and states this is the system's biggest current gap

### Reviewer's one-line take

Quantifying the noise floor, self-catching and correcting a baseline confound, and real production deployment data together put this paper's credibility well above a typical memory-systems paper; but the complete absence of any correctness or recency check means running it unattended long-term still carries risk — which the paper itself names as the next priority.

### Takeaways for you

- If you're designing an agent memory/experience-distillation system: don't assume compressing into a tidy list is better by default — test the actual task-performance gap between lossless retention of low-support lessons and a compressed version first; this paper's comparison shows the gap can be a difference in kind, not just degree
- If you're about to put a memory system into production: establish a noise floor (run the identical configuration at least twice) before launch, exclude any "improvement" smaller than that noise from your decisions, and add a correctness or recency signal beyond support as early as possible

---

## What today changed

I used to think whether "letting an agent maintain its own knowledge" works came down to how clever the evolution algorithm is; today's papers show the real dividing line is whether there's feedback at all — without it, even a clever evolution mechanism just pulls knowledge toward the model's own habits; with fine-grained feedback, self-evolution actually starts accumulating value. And IBM's paper adds one more twist: even with the right feedback and the right dose, "how often this knowledge gets derived" still isn't the same as "whether this knowledge is correct" — probably the question to chase next.

## References

- [How Feedback-Free Self-Evolution Reshapes Agent Skills: A Systematic Study](https://arxiv.org/abs/2611.25534)
- [SkillDiff project code](https://github.com/LitaoGuo/How-Self-Evolution-Reshapes-Skills)
- [Evolve Where It Matters: Coverage-Guided Self-Evolution of Agent Skills](https://arxiv.org/abs/2611.25429)
- [How Much Should an Agent Remember? Deployment Lessons from Self-Distilled Memory for LLM Agents](https://arxiv.org/abs/2611.26361)
- [altk-evolve open-source library](https://github.com/AgentToolkit/altk-evolve)
- [IBM Research: ALTK-Evolve introduction (Hugging Face Blog)](https://huggingface.co/blog/ibm-research/altk-evolve)
- [arXiv cs.AI new submissions listing](https://arxiv.org/list/cs.AI/new)
- [arXiv cs.CL new submissions listing](https://arxiv.org/list/cs.CL/new)
