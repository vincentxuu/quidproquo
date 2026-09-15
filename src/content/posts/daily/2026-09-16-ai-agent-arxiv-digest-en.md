---
title: "AI Agent Arxiv Digest — 2026-09-16"
date: 2026-09-16
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's three papers puncture one shared assumption -- that a good-looking agent score means a trustworthy system: LLM-judge satisfaction ratings barely correlate with whether the task actually succeeded, swapping harnesses without swapping the model shows no stable advantage yet costs more, and one-shot debugging judges quit searching too early and miss the real root cause"
tldr: "GAUGE audits the most common 'user-simulator + LLM-judge' release gate and finds 57.5% of conversations rated 'satisfied' actually failed the task, with a 31% decision-disagreement rate on close candidate pairs; Harness or Model? runs a controlled same-model, harness-swap experiment showing no stable advantage for vendor-native harnesses (Opus 4.8's 95% CI spans zero) while the neutral harness costs 1.2-1.6x more; Continual Search reframes root-cause attribution as a search problem, letting the judge keep searching unread evidence to raise GPT-5.5's F1 from 0.349 to 0.498 on MegaRCA-Mix"
series:
  name: "AI Agent Arxiv Digest"
  order: 115
---

> 🌏 [中文版](/posts/daily/2026-09-16-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers approach evaluation, harness choice, and debugging from three different angles, and together they puncture one shared assumption: that a good-looking agent score means the system is trustworthy. GAUGE audits the industry's most common "user-simulator + LLM-judge" release gate and finds that as many as 57.5% of conversations rated "satisfied" actually failed the task -- and the gate is least reliable precisely in the "close candidates" scenario that matters most. Harness or Model? runs a rare same-model, harness-swap controlled experiment and concludes that vendor-native harnesses show no defensible average advantage, while the neutral harness costs 1.2 to 1.6 times more. Continual Search argues that even "finding where the agent broke" needs to be redesigned -- a one-shot LLM judge stops searching too early and leaves the real root cause sitting in evidence it never read. The three papers differ in evidence maturity: GAUGE is peer-reviewed and the largest in scale; Harness or Model?'s main conclusion is solid, but its most eye-catching interaction result is flagged by the authors themselves as preliminary; Continual Search's gains concentrate on a small, author-built benchmark, and the method can backfire on short trajectories. Taken together, the three tools we normally use to judge whether an agent has gotten better -- release evaluation, harness selection, and failure debugging -- are all more fragile than they look.

## Terms to Know

| Term | Plain-Language Explanation |
|---|---|
| LLM-as-a-Judge | Having another large language model read a conversation transcript and score it, in place of human rating or directly measuring whether the task succeeded |
| Harness | The software layer that turns a chat model into an autonomous agent -- tool definitions, prompts, and control flow -- not the model itself |
| Verifiable Reward | An objective determination of whether a task actually succeeded, based on database state or program output rather than a language model's judgment |
| Root-Cause Attribution (RCA) | After an agent execution fails, finding the first point of divergence in a long action log, rather than just observing that the final outcome failed |
| Post-hoc Partition | Choosing how to split the data into groups after seeing the results -- this kind of split easily finds coincidental patterns and needs a pre-registered replication to confirm the effect is real |
| Contamination-Controlled Suite | A task set constructed so the test items could not have appeared in a model's training data, typically by keeping tasks private or using items published after the training cutoff |

---

## Paper One | GAUGE: Don't Rush to Trust the LLM Judge -- Satisfaction Barely Tracks Whether the Task Actually Succeeded

**GAUGE: When Not to Trust LLM-as-a-Judge in User-Simulated Evaluation of Task-Oriented Agents**
Umesh Bodhwani, Thanh Tran, Kai Wei (Amazon) · arxiv: 2609.12191

Links: [arxiv](https://arxiv.org/abs/2609.12191) · [alphaxiv](https://www.alphaxiv.org/abs/2609.12191)

### TL;DR

An audit of 25 agents from 6 providers on τ²-bench and SimulatorArena finds that 57.5% of conversations the LLM judge rated "satisfied" actually failed the task; among near-equal candidate pairs, the release gate picks the wrong agent 31% of the time (versus <1% for lopsided pairs).

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | Accepted to EMNLP 2026 (Industry Track) -- peer-reviewed and accepted |
| Citation Velocity | Published ~6 days ago; the Semantic Scholar API returned 429 rate-limit errors throughout this check, so citation count could not be retrieved -- likely still in the single digits given recency |
| Institution | Amazon (Umesh Bodhwani, Thanh Tran, and Kai Wei are all affiliated with Amazon) |
| Community Signal | Not found on HuggingFace Daily Papers or Papers with Code this round; the main endorsement is EMNLP Industry Track acceptance |
| Credibility | Pass -- 25 agents, 6 providers, two benchmarks (τ²-bench, SimulatorArena), ~3,700 transcripts, benchmarked against a verifiable non-LLM reward (database-state checks), separating ranking validity from construct validity |
| Evidence Maturity | Substantial -- covers the satisfaction-success gap, cross-provider ranking robustness, judge self-preference, and a calibrate-then-trust cadence, four mutually reinforcing analyses, and Section 4.6 actively reports a negative result |
| Reproducibility | Not provided -- no public code or data release link found this round; τ²-bench and SimulatorArena are themselves public benchmarks, but the authors' own audit protocol and transcripts are not public |
| Why This Paper | Direct -- directly tests whether the industry's most common "user-simulator + LLM-judge" release gate is actually trustworthy |
| Novelty | Substantive -- the first audit of this gate's ranking against a verifiable non-LLM reward at the release-decision unit, quantifying the satisfaction-success gap |
| Today's Importance | High -- nearly every team using an LLM-judge as a CI quality gate relies on this logic, and the paper shows it is least reliable exactly where it matters most: near-equal candidates |
| Practical Link | Clear -- the paper proposes a "calibrate-then-trust" cadence: periodically calibrate the gate's trusted region against a verifiable reward, rather than trusting the gate score on every decision |
| Editorial Confidence | High -- both core numbers (57.5% and 31%) carry consistency checks across rater populations and benchmarks, and the paper explicitly reports that recalibration does not transfer across settings |
| Reading Recommendation | Must-read -- any team using an LLM-judge or user-simulator as an agent release gate |
| Primary Limitation | The calibrated trust region does not transfer across configurations (the negative result in Section 4.6), meaning the audit protocol itself must be re-run after every configuration change rather than calibrated once and reused indefinitely |

### Field Context

The industry-standard way to compare agent quality is to have persona-driven simulated users converse with candidate agents, then have an LLM judge score the transcripts to decide which one gets promoted -- a process that runs in CI for a few cents per transcript with no human labeling required. Prior work has validated LLM-judge correlation with human preference, but rarely checks it against the objective fact of whether the task actually succeeded, especially at the unit that actually drives release decisions.

### Mid-Level Walkthrough

- **The problem**: Imagine deciding whether to promote customer-service Agent A or Agent B. You have each converse with a batch of simulated customers, then have another AI read the transcripts and score satisfaction -- the higher scorer ships. The problem: a conversation that reads pleasantly doesn't mean the customer's actual task got done.
- **The method**: GAUGE runs 25 agents from 6 providers through τ²-bench (retail, airline) and SimulatorArena (math tutoring) -- two benchmarks with objectively checkable outcomes -- while collecting four scores at once: the LLM-judge's score, an LLM playing a human proxy, a blind human panel, and a "verifiable reward" that checks database state or correctness directly, without any language model in the loop. GAUGE compares these four side by side, separately testing whether rankings agree (ranking validity) and whether the gate measures what it claims to (construct validity).
- **Why it matters**: Your CI quality gate can be "internally consistent" -- the LLM judge and human raters point the same direction -- while simultaneously measuring the wrong thing, because both humans and LLMs are easily fooled by a conversation that merely reads smoothly. And this blind spot is worst exactly where precision matters most: when two candidates are roughly equally strong.

### Deep-Dive Points

- 57.5% of conversations the blind human panel rated "satisfied" (≥5 on a 7-point scale) had objectively failed the task -- a gap that holds across five rater populations, two benchmarks, and every subjective dimension rated
- Overall ranking correlation is actually decent (ρ=0.94), but the decision-disagreement rate is <1% for lopsided candidate pairs and jumps to 31% for near-equal pairs -- exactly the scenario release decisions usually face
- Same-family judges show a +0.75/7 self-preference bonus toward their own model family ⚠️ (author-measured, not yet independently replicated)
- A zero-cost, judge-free "did the conversation complete" signal catches severe degradations like truncated models more reliably (ρ=0.87) than the satisfaction score itself (ρ=0.80)
- Adoption threshold: this kind of audit requires at least one benchmark with objectively checkable outcomes -- if your product has no verifiable ground truth at all, the method has no direct foothold
- Limitation: the calibrated trust region must be recalibrated for every new configuration; the authors themselves report this cross-setting transfer failure as a negative result in Section 4.6

### Reviewer's One-Line Take

The first audit at the release-decision unit to pit the "user-simulator + LLM-judge" industry standard against a verifiable reward, at a scale of 25 agents and nearly 3,700 transcripts with EMNLP peer review, makes this today's most solidly evidenced paper; but the calibrated trust region does not transfer across settings, meaning this audit protocol requires ongoing upkeep rather than a one-time calibration.

### Your Take-Away

- If you use an LLM-judge or user-simulator as an agent release gate: find even a partial subset with objectively checkable outcomes and periodically audit your gate against it, watching especially for cases where two candidates score close together -- that's exactly where the gate is most likely to mislead
- If you're interpreting satisfaction scores: treat satisfaction as a signal that needs independent verification, not something that automatically implies the task actually got done

---

## Paper Two | Harness or Model? A Controlled Same-Model, Harness-Swap Experiment

**Harness or Model? Isolating the Harness Effect in Agentic Coding with a Contamination-Controlled Private Suite**
Mohsen Arjmandi (evolutionID GmbH, Germany) · arxiv: 2609.11987

Links: [arxiv](https://arxiv.org/abs/2609.11987) · [alphaxiv](https://www.alphaxiv.org/abs/2609.11987)

### TL;DR

Across 256 contamination-controlled private tasks, holding the model fixed and swapping only the harness (claude-agent-sdk vs. deepagents; openai-codex SDK vs. deepagents), neither contrast establishes an average advantage for the vendor-native harness (Opus 4.8's 95% CI is [-10.0, +7.5] pp) -- yet the neutral harness costs 1.2-1.6x more per solved task.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed; ACM classification tags suggest conference-submission formatting, but no acceptance record found) |
| Citation Velocity | Revised version published ~8 days ago (the original August version was withdrawn and reissued due to a telemetry defect); the Semantic Scholar API was rate-limited throughout this check, so citation count could not be retrieved |
| Institution | evolutionID GmbH, Germany -- independent researcher Mohsen Arjmandi's solo work, not affiliated with an academic institution or major lab |
| Community Signal | Not found on HuggingFace Daily Papers or Papers with Code this round |
| Credibility | Pass -- 256 contamination-controlled tasks (179 private repository tasks + 77 post-cutoff contest problems), 792/800 planned runs graded by a Docker-isolated oracle, with task-level bootstrap confidence intervals and a mechanical, frozen-pool selection rule |
| Evidence Maturity | Preliminary -- the core "no stable average advantage" conclusion is well-supported, but the most interesting finding -- Opus trailing on repository tasks while leading on contest tasks -- is a post-hoc partition chosen after seeing the data, which the authors themselves say needs a designed replication to confirm |
| Reproducibility | Partial artifacts -- the orchestrator, Docker-isolated oracle, reanalysis code, and derived aggregates are released; the core 256 tasks themselves remain private to preserve contamination control |
| Why This Paper | Direct -- directly tests whether the widespread assumption in agent engineering that "the vendor-native harness is stronger" actually holds up |
| Novelty | Substantive -- the first paired, same-model, harness-only-swap design that measures both capability and per-solved-task cost together, and publishes a self-correction record for a telemetry defect |
| Today's Importance | High -- many teams choosing between a vendor-native SDK and a neutral, LangGraph-style harness default to assuming the native pairing is stronger; this paper's evidence directly challenges that default |
| Practical Link | Clear -- the paired cost figures (1.2-1.6x) can be fed directly into a "should we switch harnesses" procurement or architecture decision |
| Editorial Confidence | Medium -- the core "no stable average advantage" claim is well-supported; but the two more eye-catching sub-findings (the interaction effect and the billing-order question) are both flagged by the authors as unresolved, so the tone needs to be scaled down accordingly |
| Reading Recommendation | Must-read -- teams choosing or comparing agent harnesses (claude-agent-sdk, openai-codex, LangGraph-style solutions) |
| Primary Limitation | The core task suite remains private, so outside teams cannot rerun the exact same tasks; 58 runs on the Anthropic account left no usage record, leaving the billing-order question itself "unresolved" |

### Field Context

One of the most heated questions in coding-agent circles lately is whether the "harness" -- the software layer connecting a model to tools, prompts, and control flow -- actually matters. Vendors all claim their own model paired with their own harness performs best, but the field has lacked a clean, same-model, harness-only comparison; most comparisons swap both the model and the harness together, making it impossible to tell which one drove the difference.

### Mid-Level Walkthrough

- **The problem**: Imagine you've already decided to use Claude Opus 4.8, and now must choose: Anthropic's official claude-agent-sdk, or the neutral deepagents (built on LangGraph)? Vendors will tell you the native pairing "just understands its own model better" -- but that claim has never been cleanly tested.
- **The method**: The author holds the model fixed and swaps only the harness: Opus 4.8 runs under both claude-agent-sdk and deepagents; GPT-5.5 runs under both the openai-codex SDK and deepagents -- on the same 256 contamination-controlled tasks (179 private repository tasks plus 77 contest problems published after the training cutoff). Both harnesses face identical sandboxes, tasks, and prompts, and 792 runs are graded by an isolated oracle with no stake in the outcome.
- **Why it matters**: This means the common assumption that "the vendor-native harness is the safer choice" currently lacks solid evidentiary support -- both contrasts' confidence intervals include zero, meaning neither side shows a stable win. Yet the neutral harness is genuinely 1.2 to 1.6 times more expensive; if a team is paying that premium purely because "the native pairing sounds safer," this paper gives reason to redo the math.

### Deep-Dive Points

- Opus 4.8: native harness 48.8% vs. neutral harness 50.0%, a -1.25 pp gap, 95% CI [-10.0, +7.5] (includes zero)
- GPT-5.5: native harness 55.6% vs. neutral harness 54.4%, a +1.25 pp gap, 95% CI [-4.4, +6.9] (includes zero)
- Opus 4.8's average conceals two opposite-signed strata: the native harness trails by 9.0 pp on the 61 repository tasks yet leads by 23.7 pp on the 19 contest tasks (permutation test p=0.003) ⚠️ (this partition was chosen after seeing the data -- a post-hoc split the authors themselves say needs a designed replication to confirm)
- The neutral harness costs 1.2-2.1x more per solved task on Opus 4.8 (depending on pricing basis) and 1.05-1.33x more on GPT-5.5; but 58 runs on the Anthropic account left no usage record, and allocating that spend to either side would move the ratio between 0.7 and 2.3, leaving the billing order itself "unresolved"
- Adoption threshold: the core 256 tasks remain private for contamination control, so outside teams cannot rerun the exact same task set -- they can only rerun the released orchestrator and oracle against their own tasks
- Limitation: this is a revised paper -- the original August manuscript's cost conclusions rested on a usage-semantics defect in the study's own telemetry (different SDKs use different conventions for counting cache tokens, and a normalizer applied one convention to all three harnesses); this revision re-derives every cost figure from raw per-turn events and publishes the correction record

### Reviewer's One-Line Take

The paired, same-model harness-swap design, KVM microVM isolation, task-level bootstrap confidence intervals, and the author's proactive disclosure and correction of a telemetry defect from their own prior version show a rare degree of self-correcting transparency for a solo-authored study; but the most attention-grabbing finding -- the native harness reversing course on contest tasks -- is a post-hoc partition chosen after seeing the data, and 58 runs with no usage record leave the billing order unresolved, both reminders not to treat every number in this paper as settled.

### Your Take-Away

- If you're choosing an agent harness for your team: don't default to assuming the vendor-native pairing is the safe bet -- first check whether your workload looks more like "repository repair" or "closed-problem solving," since this paper shows the native harness's advantage may flip direction between the two
- If you're budgeting an agent platform's operating costs: the neutral harness isn't necessarily cheaper -- before treating "portability" as a reason to switch, do the math carefully, and especially check whether your own billing system has the same cache-token semantics trap this paper uncovered

---

## Paper Three | Root-Cause Attribution Is a Search Problem -- Don't Let the Judge Stop Searching Too Early

**Root-Cause Attribution Is a Search Problem: Continual Search for Long-Horizon Agent Failures**
Harsh Raj, David Lee, Anas Mahmoud et al. (Scale AI) · arxiv: 2609.13463

Links: [arxiv](https://arxiv.org/abs/2609.13463) · [alphaxiv](https://www.alphaxiv.org/abs/2609.13463)

### TL;DR

On the author-built MegaRCA-Mix (50 long-horizon failure trials with a median execution-log size of 286K tokens), prompting the judge to keep challenging its own standing diagnosis and search for unread evidence across multiple turns raises GPT-5.5's root-cause attribution F1 from 0.349 to 0.498 -- and within the same model family, a well-orchestrated lower-tier model can sometimes beat a higher-tier one.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (cross-listed in cs.AI/cs.HC/cs.LG/cs.SE, not peer-reviewed) |
| Citation Velocity | Published ~5 days ago; the Semantic Scholar API was rate-limited throughout this check, so citation count could not be retrieved |
| Institution | Scale AI (all 10 authors are affiliated with Scale AI) |
| Community Signal | Listed on HuggingFace Daily Papers (0 upvotes, 1 comment at time of check); not found on Papers with Code this round |
| Credibility | Pass -- evaluated across four existing benchmarks (TRAIL, TELBench, AgentRx, Who&When) plus the author-built MegaRCA-Mix, compared against existing baselines like self-consistency and heterogeneous judge panels, and explicitly reports the negative case where the method flips correct diagnoses to incorrect on short trajectories |
| Evidence Maturity | Preliminary -- the core gains concentrate on the authors' own new MegaRCA-Mix (only 50 trials) and one other long-horizon benchmark, TELBench; the effect is weak or even negative on existing short-trajectory benchmarks |
| Reproducibility | Not provided -- no public release link for the MegaRCA-Mix dataset or code found this round |
| Why This Paper | Direct -- directly addresses the debugging pain point of "the agent failed, but how much effort does it take to find the real reason" |
| Novelty | Substantive -- reframes root-cause attribution as a search problem rather than a one-shot judgment, and introduces a new benchmark purpose-built for long-horizon (million-token-scale) execution logs |
| Today's Importance | Medium -- directly useful for teams operating large-scale agent fleets that need to attribute failures after the fact, but less urgent for teams that haven't yet accumulated large volumes of long-horizon execution logs |
| Practical Link | Clear -- the paper's core recommendation is directly actionable: have the debugging judge search continually across turns rather than judge once, while explicitly flagging that this can backfire on short tasks |
| Editorial Confidence | Medium -- the evidence that "continual search helps on long horizons" is clear; but the more striking sub-finding that "lower-tier models can beat higher-tier ones" rests on a small sample (50 trials), and the paper itself admits the method can hurt performance on short trajectories |
| Reading Recommendation | Skim -- prioritize if you already operate long-horizon, large-scale agent systems and need a debugging mechanism; general readers can focus on the deep-dive points |
| Primary Limitation | MegaRCA-Mix is a new, author-built benchmark with only 50 trials and no external validation yet; on short-trajectory benchmarks (AgentRx, Who&When), forcing the judge to re-examine its existing verdict makes it more likely to flip a correct answer into an incorrect one |

### Field Context

As agent systems move toward self-improvement -- learning from failed trajectories, iteratively revising their own behavior, and even modifying their own architecture -- finding the true cause of a failure (root-cause attribution) has become a key link that feeds back into the whole system's continued improvement. But existing automated RCA methods almost all rely on a one-shot LLM judge reading the full execution log and issuing a single diagnosis -- adequate for short trajectories, but increasingly unreliable as trajectories grow longer.

### Mid-Level Walkthrough

- **The problem**: Imagine an agent runs a long task spanning thousands of steps, leaving an execution log hundreds of thousands of tokens long, and ultimately fails. The real point of failure might have occurred very early, buried under hundreds of subsequent actions that all look normal. You ask an LLM to read the whole log and tell you where it went wrong -- but partway through, it settles on "probably here" and locks in its answer, while more decisive evidence further along is never examined.
- **The method**: The authors reframe this as a search problem: alongside the original one-shot judge, they design Continual Search, which prompts the judge on every subsequent turn to actively challenge its current answer and search for unexamined evidence, rather than passively re-confirming it (Passive Continuation). They also release MegaRCA-Mix -- 50 long-horizon failure trials with a median execution-log size of 286K tokens -- to fill the gap left by existing benchmarks that skew short.
- **Why it matters**: This means "debugging" isn't just feeding the whole log to an LLM once -- it needs to be purpose-built as a continual search process. More notably, once trajectories are long enough, a well-orchestrated lower-tier model can sometimes catch up to or beat a higher-tier one -- suggesting that search strategy, not model scale, is the real bottleneck for long-horizon RCA.

### Deep-Dive Points

- On MegaRCA-Mix, Continual Search raises GPT-5.5's F1 from 0.349 to 0.498, a gain of over 40%, versus only 0.401 for the Passive Continuation control
- On another long-horizon benchmark, TRAIL, four turns of Continual Search raise GPT-5.5's Weighted F1 from 0.426 to 0.500, versus only 0.451 for Passive Continuation
- Across the same four turns, the deduplicated evidence Continual Search reads grows from 42K to 58K tokens, while Passive Continuation only grows to 48K -- the extra gain directly tracks the judge actually reading more previously-unseen evidence ⚠️ (author-measured; MegaRCA-Mix is a new benchmark built by this paper's own authors, with no external replication yet)
- On existing short-trajectory benchmarks (AgentRx, Who&When), additional search turns don't just fail to help -- they actively hurt, forcing the judge to reconsider an answer that had already covered most of the available evidence, and often flipping a correct diagnosis to an incorrect one
- Adoption threshold: the method requires no model retraining -- it's a prompt-level, multi-turn search strategy -- but it needs the judge to access the full execution log and tools, and doesn't directly apply to systems that only retain final outcomes without execution logs
- Limitation: MegaRCA-Mix has only 50 trials, curated and annotated by the authors themselves from Harbor Index execution logs; the paper itself acknowledges the method can backfire on short trajectories rather than being uniformly better than existing methods

### Reviewer's One-Line Take

Reframing root-cause attribution as a search problem, testing it against four existing benchmarks plus a self-built long-horizon benchmark, and honestly reporting the negative case where the method talks the judge into flipping a correct answer on short trajectories, shows commendable awareness of the method's boundaries; but the core gains concentrate on a self-built benchmark with only 50 trials and no external validation, so the bolder claim that "search beats model scale" needs a larger sample before it can stand on its own.

### Your Take-Away

- If you operate long-horizon, large-scale agent systems: don't run your debugging judge as a one-shot diagnosis -- consider Continual Search's design, prompting the judge on later turns to actively hunt for unread evidence rather than just re-confirming the previous turn's answer
- If your task trajectories are short (tens of steps or fewer): this paper explicitly warns that extra search turns can backfire and flip a correct answer into a wrong one -- don't apply this method indiscriminately regardless of setting

---

## Today's Takeaway

I used to think that as long as an agent system's scores looked good -- evaluation passed, harness chosen well, debugging accounted for -- the system was trustworthy. Today I learned that the measurement tools behind all three of those things are more fragile than they look: over half of the conversations an LLM judge rates "satisfied" actually failed the task; a seemingly reasonable harness-selection decision shows no stable advantage under a clean controlled experiment; and even the act of "finding where it broke" only works if you stop the judge from quitting its search too early. What deserves suspicion isn't whether the agent made a mistake -- it's whether the ruler we use to check "did it make a mistake" is accurate enough in the first place.

## References

- [GAUGE: When Not to Trust LLM-as-a-Judge in User-Simulated Evaluation of Task-Oriented Agents](https://arxiv.org/abs/2609.12191)
- [Harness or Model? Isolating the Harness Effect in Agentic Coding with a Contamination-Controlled Private Suite](https://arxiv.org/abs/2609.11987)
- [Root-Cause Attribution Is a Search Problem: Continual Search for Long-Horizon Agent Failures](https://arxiv.org/abs/2609.13463)
- [arXiv cs.AI new submissions, Tuesday 15 September 2026 (source announcement batch)](https://arxiv.org/list/cs.AI/new)
- [arXiv cs.CL new submissions, Tuesday 15 September 2026 (source announcement batch)](https://arxiv.org/list/cs.CL/new)
- [arXiv cs.MA new submissions, Tuesday 15 September 2026 (source announcement batch)](https://arxiv.org/list/cs.MA/new)
- [HuggingFace Daily Papers](https://huggingface.co/papers)
