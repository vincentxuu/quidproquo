---
title: "AI Agent Arxiv Digest — 2026-11-20"
date: 2026-11-20
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Three papers today make the same case from different angles: agent evaluation is too noisy to see real progress, whether the loop is self-improvement, enterprise procurement, or an agent that runs its own experiments"
tldr: "The Resolution Hypothesis runs over ten million LLM calls to show that mainstream agent self-evolution methods select candidates barely better than a coin flip; a ten-vendor agentic-AI bakeoff at a global bank finds rater scores are dominated by a halo effect (Cronbach's alpha=0.98); a governed ledger from KIT shows an ungoverned autonomous ML-experimentation loop silently drops more than half its failure records"
series:
  name: "AI Agent Arxiv Digest"
  order: 180
---

## Today's Overview

Three papers today come from completely different settings but converge on the same point: the tools we use to evaluate agents often lack the resolution to tell real progress from noise. The Resolution Hypothesis runs the largest reproducibility study of agent self-evolution to date (over ten million LLM calls) and shows that the step where these methods pick candidates and rank methods is barely better than chance. A Capability Framework for Evaluating Agentic AI Platforms reports a real ten-vendor bakeoff run by a global bank's innovation lab, where nine supposedly independent capability scores turn out to be highly correlated -- mostly measuring presentation, not capability. Evaluating Governed LLM-Driven ML Experimentation demonstrates that an autonomous ML-experimentation agent loop without enforced record-keeping quietly erases its own failed trials, making results look far smoother than they really are. Put together: whether the selector is a machine, a human review panel, or a task score, when the evaluation itself lacks resolution, noise eats whatever the method actually achieved.

## Terms Worth Knowing Before You Read

| Term | Plain explanation |
|---|---|
| Agent evolution | A loop where an agent edits its own prompt, skills, or memory, and a score decides whether to keep the change -- the model weights never change |
| Resolution (of an evaluation) | The smallest true improvement an evaluation pipeline can reliably tell apart from noise; below that threshold, selection degrades to chance |
| Halo effect | Raters anchor on overall impression (polish, fluency) so dimensions that should be independent end up highly correlated, measuring presentation rather than distinct capabilities |
| Append-only ledger | A record store where every attempt must be written, and nothing can be deleted or overwritten afterward -- built to stop failures from being silently dropped |
| Bootstrap confidence interval | A way to estimate the uncertainty of a statistic by repeated resampling, rather than reporting a single point estimate |
| LLM-as-judge | Using another language model to score or choose between outputs, instead of a human or a fixed rule |

---

## Paper 1 | The Resolution Hypothesis: Agent Evolution's Key Is Identifying Improvements

**The Resolution Hypothesis: Agent Evolution's Key Is Identifying Improvements**
Yuanhao Zeng, Shaocheng Lan, Ao Lu et al. (ShanghaiTech University + ByteDance + BIGAI + SUSTech) · arxiv: 2611.23068

Links: [arxiv](https://arxiv.org/abs/2611.23068) · [alphaxiv](https://www.alphaxiv.org/abs/2611.23068)

### TL;DR

Across seven agent self-evolution methods and six models, over ten million LLM calls, selection -- whether by execution score or by an LLM judge -- picks the better of two candidates only 49.7% of the time, and a single reported run picks the truly best of four methods on Terminal-Bench only 33% of the time.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (not yet peer-reviewed; project page is live, authors state full code and trajectory data will be released only upon acceptance) |
| Citation velocity | Published 3 days ago; Semantic Scholar API was persistently rate-limited this round (a brand-new preprint's actual citation count is almost certainly 0 regardless) |
| Institution | ShanghaiTech University, ByteDance, BIGAI, SUSTech |
| Community signal | HuggingFace Daily Papers, 2026-11-19: 33 upvotes |
| Credibility | Pass -- uses a formal variance decomposition (within-evaluation noise sigma, run-to-run true-quality variance tau) to separate "genuinely better" from "got lucky this time," validated with an equal-quality null model and a statistical power calculation |
| Evidence maturity | Substantial -- 1,030 independent evolution runs, 2.1 million test trajectories, 10 million LLM calls, across 7 methods, 6 models, and 13 benchmarks |
| Reproducibility | Partial artifacts -- project page is live, but full code and trajectory data are withheld until paper acceptance |
| Why this paper | Direct -- tests the one step nobody has verified in the entire "agents can get better on their own" story: whether the selection step is reliable |
| Direction novelty | Substantive -- the first large-scale rerun study to separate "the method really won" from "evaluation noise made it look like it won" |
| Today's importance | High -- directly undermines the basis on which a whole class of agent self-evolution papers (GEPA, ReasoningBank, and similar methods) claim to beat their competitors |
| Practical link | Clear -- any team that automatically keeps or discards prompt, skill, or memory edits based on a score is sitting right in the trap this paper describes |
| Editorial confidence | High -- the claim is scoped precisely to "current evaluation resolution is insufficient," and every number traces to a clearly described experiment |
| Recommended reading | Must-read -- anyone building or relying on agent self-evolution / RSI systems |
| Primary limitation | Full code and trajectory data are not yet public (withheld until acceptance), so the headline numbers cannot yet be independently reproduced |

### Field Context

Agent evolution methods -- GEPA rewriting prompts, ReasoningBank storing memories, assorted skill optimizers -- have claimed for the past couple of years to make frozen models steadily better across benchmarks. But practitioners keep hitting a strange pattern: the same method wins in one paper and loses in another. That's usually blamed on task differences or prompt-engineering skill; almost nobody has systematically checked whether the evaluation itself is accurate enough to tell.

### Mid-level Walkthrough

- **The problem**: imagine a game of "tweak the recipe, then taste-test it" -- you make 100 small variations, and each gets tasted by one judge, once, to decide whether to keep it. If the judge's palate itself has 10-20% random error (say, a stuffy nose that day), a change that's genuinely 10% tastier and one that's genuinely 10% worse become indistinguishable -- what gets kept is just whichever one happened to score high that particular tasting.
- **The method**: the paper splits every evaluation score into two parts -- "how good the change really is" (tau, the true run-to-run difference) and "the evaluation's own random noise" (sigma, how much the same artifact's score bounces around on repeated tests). On Terminal-Bench, sigma reaches 4.5 percentage points, while the typical reported method margin in the literature is a median of only 3.4 points -- meaning a single evaluation simply cannot tell who actually won. They also test the selection step directly: given a pool of 100 candidate skills, whether using execution scores or another LLM as judge, the accuracy of picking the better one sits around 49-50%, indistinguishable from a coin flip.
- **Why it matters**: this suggests that a share of the progress claimed by agent self-evolution papers over the past few years may simply reflect evaluation noise landing in the method's favor that particular time, rather than the method actually getting stronger.

### Key Details

- On Terminal-Bench, a single reported run picks the true best of 4 text-artifact methods only 33% of the time (random guessing gets 25%)
- Execution-score selectors pick the better candidate 49.7% of the time; LLM-as-judge selectors do 48.6% -- both statistically indistinguishable from chance
- Regressions make up only 30.5% of the candidate pool but 62.1% of what gets accepted into the next round
- The largest gains commonly reported in the literature (median 17.6 percentage points) fall to a median of 0.8 points after repairing evaluation shortcuts such as grading only one answer format :warning: (the authors' own audit; independent replication still pending)
- In-loop validation scores climbed 6.9 to 9.0 percentage points over the course of evolution, but independently re-evaluating the same artifacts left gains between only +0.4 and -3.2 points
- Practical threshold: teams who want to use self-evolution / RSI systems in real projects should first measure their own evaluation's sigma and tau, or risk keeping edits that are pure noise

### Reviewer's One-Line Take

Statistically rigorous and run at a scale rarely seen (tens of millions of LLM calls), giving an unusually honest answer to "does agent self-evolution actually work." But the full code and trajectory data aren't public yet, so independent reproduction has to wait for the paper's acceptance.

### Takeaways for You

- If you're building an agent self-evolution / RSI system: measure your evaluation's sigma (noise from repeated testing of the same edit) and tau (true difference between runs) first, and decide how many runs you need before trusting a kept edit -- don't accept it after a single run
- If you're reading agent papers to pick a method to adopt: when you see "method X beats the baseline by 2-5 percentage points" from a single run, be suspicious -- this paper's numbers suggest that gap is often too small to tell from luck

---

## Paper 2 | What Are Enterprises Actually Measuring When They Buy an Agent Platform: A Ten-Vendor Bakeoff Exposes a Halo Effect

**A Capability Framework for Evaluating Agentic AI Platforms in Regulated Enterprises**
Abbas Raza Ali, Muhammad Ajmal Siddiqui, Moona Zahid (Citigroup Inc. + Ernst & Young LLP + NVIDIA Corporation, London) · arxiv: 2611.24039

Links: [arxiv](https://arxiv.org/abs/2611.24039) · [alphaxiv](https://www.alphaxiv.org/abs/2611.24039)

### TL;DR

A global bank's innovation lab scored ten agentic AI platforms (H2O.ai, Google, Microsoft, Writer, Letta, and others) across nine capability dimensions, and found those nine "supposedly distinct" dimensions correlate at Cronbach's alpha=0.98 -- meaning raters were largely driven by overall demonstration impression rather than independently judging memory, tool use, multi-agent coordination, and the rest.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | Proceedings of the 10th MLSys Conference, 2027 (accepted, peer-reviewed systems venue) |
| Citation velocity | Published 2 days ago; Semantic Scholar API was rate-limited this round (a just-accepted paper's actual citation count is almost certainly 0) |
| Institution | Citigroup Inc., Ernst & Young LLP, NVIDIA Corporation (all London) |
| Community signal | Not seen on HuggingFace Daily Papers / Papers with Code |
| Credibility | Pass -- runs a direct statistical test (Cronbach's alpha, rank correlations) on real data from a ten-vendor bakeoff, rather than asserting a halo effect anecdotally |
| Evidence maturity | Substantial -- but the paper itself stresses this is demonstration-based scoring, not hands-on controlled evaluation, and only covers capability (Layer 1); execution reliability, governance gates, and business value remain proposals |
| Reproducibility | Partial artifacts -- scoring methodology, the nine-dimension taxonomy, and the aggregate score table are published; per-rater raw scores were not retained, so inter-rater reliability cannot be recomputed (an acknowledged gap) |
| Why this paper | Direct -- examines the reliability of the very evaluation method enterprises rely on to decide which agent platform to buy |
| Direction novelty | Substantive -- the first application of the psychometric "halo effect" concept, with a formal statistical test, to enterprise agentic-platform procurement |
| Today's importance | High -- any team running its own bakeoff to pick an agent platform beyond public benchmarks is exactly who this paper is warning |
| Practical link | Clear -- the paper proposes concrete fixes (score dimensions separately, require evidence artifacts rather than verbal assurance, retain rater-level data) |
| Editorial confidence | High -- the alpha=0.98 finding is a statistic computed directly on the paper's own data, not an inference stretched beyond what was measured |
| Recommended reading | Must-read -- anyone responsible for technology procurement / platform selection |
| Primary limitation | Single institution, vendor-assisted demonstration conditions (not blind testing), and cost/latency figures (D8) are vendor-reported rather than independently measured |

### Field Context

Public agent benchmarks (AgentBench, GAIA, WebArena, tau-bench) score a model's behavior in a fixed harness, but enterprises actually buy an integrated platform -- its orchestration, memory, governance, and tooling layers are what determine the outcome, and there's almost no public, comparable way to evaluate those layers, so buyers mostly fall back on vendor demonstrations.

### Mid-level Walkthrough

- **The problem**: imagine your company is choosing a system and invites five vendors to each give a demo, with the same panel scoring "how usable is the interface," "how strong are the features," "is it secure enough." If one vendor's demo day happens to go unusually smoothly with a polished pitch, raters tend to score it high across every dimension -- even if some particular feature is actually mediocre. This paper quantifies exactly that: nine dimensions that should be independent end up looking like nine copies of the same score.
- **The method**: the authors define nine dimensions (reflection, tool use, memory, planning, multi-agent coordination, ease of use, protocol support, quantitative performance, evaluation and explainability), and have a cross-functional panel score ten platforms across three financial-services scenarios (counterparty credit risk, RAG, process automation). After tallying totals, they run a statistical test of how independent the nine dimensions actually are -- and get alpha=0.98, suggesting the rubric as administered measured something closer to one-and-a-half constructs rather than nine.
- **Why it matters**: for any team planning to run its own bakeoff to select an agent platform, this paper flags the trap up front: demonstration-based scoring mostly measures polish, not real capability, unless you switch to requiring evidence artifacts -- trace logs, evaluation reports -- instead of verbal assurance.

### Key Details

- The ten platforms split into three tiers: Tier 1 (H2O.ai, Google, Microsoft, Writer, Letta) at 61.7-69.2, versus Tier 2 (Glean, CrewAI, UiPath) at 41.4-43.0 -- an 18.7-point gap far larger than the spread within either tier
- Eight of the nine dimensions correlate with the total score at rho >= 0.93; only "ease of use" sits at 0.66 -- raters could in fact separate "usable" from "capable," but every other dimension is essentially measuring the same thing
- Letta (built on MemGPT) scored highest on the memory dimension specifically, despite landing mid-Tier-1 overall -- proof that breaking capability into dimensions can surface a specialist strength that an aggregate score hides
- Recomputing totals under a "governance-first" and a "developer-first" weighting profile left the three-tier structure unchanged, with only modest within-tier reordering -- the tiering is robust, but individual rankings are sensitive to weighting
- Per-rater raw scores were never retained, so inter-rater reliability simply cannot be computed -- the authors list this themselves as a required fix
- Practical threshold: the paper's proposed remedy is to score dimensions separately, require trace logs and evaluation reports rather than demo impressions as evidence, and use different sub-panels or sessions per dimension to break the shared-impression contamination

### Reviewer's One-Line Take

A rare case of a paper running a statistical test on its own bakeoff and admitting the result is problematic -- alpha=0.98 isn't a flaw the authors are hiding, it's the paper's central finding. But it's still one institution, one round of demonstration-based scoring; the next step is a genuinely blind, hands-on controlled evaluation to see whether rankings survive once the halo effect is removed.

### Takeaways for You

- If your team is running an agent-platform bakeoff: score the nine dimensions separately, with different people or different sessions per dimension rather than one panel scoring everything after a single demo, and require trace logs or evaluation reports instead of demos alone
- If you're reading someone else's agent-platform comparison report: ask whether the dimensions are actually independent -- if every dimension consistently favors the same vendor, you're likely looking at polish, not capability

---

## Paper 3 | The Governed Ledger: When an Agent Runs Its Own ML Experiments, It Gets to Decide What Counts as a Failure

**Evaluating Governed LLM-Driven ML Experimentation: Lifecycle, Provenance, and Failure Metrics**
Dowling Wong (Karlsruhe Institute of Technology) · arxiv: 2611.23678

Links: [arxiv](https://arxiv.org/abs/2611.23678) · [alphaxiv](https://www.alphaxiv.org/abs/2611.23678)

### TL;DR

Forcing every step of 1,445 automated ML experiment trials into an append-only ledger reveals that, under the same conditions, an ungoverned loop silently drops "the failed half": in one matched comparison, 43 of 50 attempts' failure records vanish entirely, leaving only the 7 successes on record and making the whole experiment look far smoother than it was.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | KDD 2026 Workshop on Evaluation and Trustworthiness of Agentic AI (ETAAI), Jeju, Korea -- workshop presentation, non-archival but reviewed for the session |
| Citation velocity | Published 2 days ago; Semantic Scholar API was rate-limited this round (a just-presented workshop paper's actual citation count is almost certainly 0) |
| Institution | Karlsruhe Institute of Technology (KIT), Germany |
| Community signal | Not seen on HF Daily Papers, but code and all 1,445 trial ledgers are public on GitHub with a registered Zenodo DOI |
| Credibility | Pass -- uses a genuinely independent matched "governed vs. ungoverned" counterfactual experiment (not reconstructed from the same log), with bootstrap confidence intervals |
| Evidence maturity | Substantial -- the core governance/silent-dropping claim rests on a solid matched counterfactual; the secondary memory-effect analysis is repeatedly and explicitly flagged by the author as descriptive rather than a significance test, and one replicate was self-disqualified as "not independent" |
| Reproducibility | Full artifacts -- code and all 1,445 trial ledgers are public, with the author stating every governance metric can be recomputed directly from the ledgers without rerunning training |
| Why this paper | Direct -- proposes an independent governance mechanism, not reliant on the agent's own self-reporting, for agents that autonomously run ML experiments |
| Direction novelty | Substantive -- turns "evaluate the process, not just the outcome score" into operational, recomputable governance metrics |
| Today's importance | High -- any team using an agent to automatically run ML experiments or hyperparameter sweeps sits squarely in the "failures silently disappear" risk this paper describes |
| Practical link | Clear -- the control-plane design (scope validation, pending-trial guard, append-only ledger) can be directly applied to other agent experimentation loops |
| Editorial confidence | High -- the core claim (43/50 vs. 0/50 completeness) is backed by a genuinely independent control group, and the author tightens the language around the weaker secondary claim |
| Recommended reading | Must-read -- anyone building or operating an automated ML-experimentation / hyperparameter-tuning agent |
| Primary limitation | Single author, research-scale tasks (not validated in a real enterprise production environment), and the secondary memory-effect finding does not reproduce cleanly across replicates |

### Field Context

Benchmarks like MLAgentBench and MLE-bench ask "did the agent push the task score up," while systems like AIDE keep their search state inside the agent's own loop -- neither answers "how was that score actually reached": did the agent touch files it shouldn't have, were failed attempts silently dropped, and can every keep-or-discard decision be traced back to evidence.

### Mid-level Walkthrough

- **The problem**: imagine a lab assistant who runs its own experiments and decides what's worth writing into the notebook -- if it only records the successes and tears out the failed pages without a trace, the report looks like a success story, but you never see how many tries it took to stumble onto that one win.
- **The method**: the paper takes the power to decide what gets recorded away from the agent and hands it to an independent control plane -- the manager (typically an LLM) can only propose a change; the control plane checks its edit scope, runs the training, decides whether to keep or discard it, and writes one ledger record regardless of the outcome. Tested on the same contract across six ML tasks and 1,445 trials, including one extreme case where all 120 trials failed, provenance completeness stayed at 100% in every single case.
- **Why it matters**: the author runs a direct matched counterfactual -- same task, with governance stripped out, leaving only a bare "log successes only" loop -- and finds that on a task with a 55% failure rate, the ungoverned ledger retains only 7 success records while 13 failed attempts vanish entirely; on a task where everything failed, the ungoverned ledger is simply empty, indistinguishable from a campaign that never ran.

### Key Details

- Matched counterfactual: of 50 attempts, the ungoverned ledger loses 43 (all of the failures), the governed ledger loses 0, with a 95% bootstrap confidence interval (10,000 resamples) clearly showing ungoverned completeness below 1.00
- Across six nodes and 1,445 trials, provenance completeness was 100% everywhere, including one 120-trial arm where every single trial failed
- Secondary memory-effect analysis: across a large-scale 225-trial rerun (5 seeds x 3 memory modes), mean best accuracy with memory was 0.939-0.941 versus 0.899 without :warning: (the author explicitly labels this a diagnostic, descriptive comparison, not a formal significance test)
- One small-scale replicate was self-disqualified by the author after discovering that a later rerun arm had actually continued from the final state of a previous arm rather than starting fresh -- actively discarding one's own imperfect data is unusually disciplined for a single-author paper
- Practical threshold: adopting this governance model requires rewriting the agent harness's execution loop to explicitly hand the "keep or discard" authority from the LLM manager to an independent control plane
- Limitation: validated only on research-scale tasks across six nodes so far, with no real enterprise production case study yet

```diagram
title: Governed vs. ungoverned: do failure records survive?
desc: On the same tasks, the governed ledger keeps 100% of records on both nodes. The ungoverned loop's ledger is completely empty (0%) on the all-failure node autoresearch_linux, and keeps only 35% on openml_bank_mkt, whose 55% failure rate is the source of the 43-of-50 vs. 0-of-50 completeness comparison.
caption: Data from the paper's Table 9 (Governed vs. Ungoverned counterfactual). Conversion: baseline y=300, plot top y=60, value domain 0-100%, k=(300-60)/100=2.4, bar top y=300-value*2.4. The 95% bootstrap CI for openml_bank_mkt's ungoverned completeness is [15%, 55%]; only the point estimate of 35% is plotted.
---
<svg viewBox="0 0 640 340">
  <text class="dg-text--series dg-c-accent" x="76" y="20" dominant-baseline="central">Governed</text>
  <text class="dg-text--series dg-c-s1" x="190" y="20" dominant-baseline="central">Ungoverned</text>
  <text class="dg-small" x="608" y="20" text-anchor="end" dominant-baseline="central">Ledger completeness</text>

  <line class="dg-grid" x1="72" y1="60" x2="612" y2="60"/>
  <line class="dg-grid" x1="72" y1="180" x2="612" y2="180"/>
  <text class="dg-small" x="64" y="60" text-anchor="end" dominant-baseline="central">100%</text>
  <text class="dg-small" x="64" y="180" text-anchor="end" dominant-baseline="central">50%</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0%</text>

  <rect class="dg-bar dg-c-accent" x="140" y="60" width="56" height="240"/>
  <rect class="dg-bar dg-c-s1" x="204" y="298" width="56" height="2"/>
  <rect class="dg-bar dg-c-accent" x="380" y="60" width="56" height="240"/>
  <rect class="dg-bar dg-c-s1" x="444" y="216" width="56" height="84"/>

  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="168" y="50" text-anchor="middle" dominant-baseline="central">100%</text>
  <text class="dg-sub dg-text--accent" x="232" y="288" text-anchor="middle" dominant-baseline="central">0%</text>
  <text class="dg-sub" x="408" y="50" text-anchor="middle" dominant-baseline="central">100%</text>
  <text class="dg-sub" x="472" y="206" text-anchor="middle" dominant-baseline="central">35%</text>

  <text class="dg-sub" x="200" y="320" text-anchor="middle" dominant-baseline="central">autoresearch_linux</text>
  <text class="dg-sub" x="440" y="320" text-anchor="middle" dominant-baseline="central">openml_bank_mkt</text>
</svg>
```

### Reviewer's One-Line Take

Unusually disciplined for a single-author paper -- the core claim rests on a genuinely independent control group and bootstrap confidence intervals, and the author proactively excludes their own imperfect replicate while releasing all 1,445 raw trial ledgers. Still, this is research-scale validation, well short of a formal enterprise ML pipeline governance standard.

### Takeaways for You

- If you're using an agent to automatically run ML experiments or hyperparameter sweeps: move the authority to decide what gets kept out of the agent's hands and into an independent recording layer that forces an immutable record for every attempt, success or failure, or the success rate you see may just be survivorship bias
- If you're evaluating someone else's "agent automatically discovered X" result: ask whether the failed attempts were fully recorded -- if all they can show you is success cases, this paper suggests that's less likely because the method is especially stable, and more likely because the failure records were quietly dropped

---

## Today's Takeaway

I used to think "can an agent get better on its own" was a method-design problem -- whose prompt optimizer is smarter, whose memory architecture is more elegant. Today I learned the more fundamental bottleneck is "can you actually tell" -- whether it's the selector inside a self-evolution loop, the review panel in an enterprise bakeoff, or the record-keeping of an ML-experimentation agent, when the evaluation itself lacks resolution, even the best method gets eaten by noise.

## References

- [The Resolution Hypothesis: Agent Evolution's Key Is Identifying Improvements (arXiv:2611.23068)](https://arxiv.org/abs/2611.23068)
- [Resolution Hypothesis project page](https://lineshogan.github.io/resolution-hypothesis/)
- [A Capability Framework for Evaluating Agentic AI Platforms in Regulated Enterprises (arXiv:2611.24039)](https://arxiv.org/abs/2611.24039)
- [Evaluating Governed LLM-Driven ML Experimentation: Lifecycle, Provenance, and Failure Metrics (arXiv:2611.23678)](https://arxiv.org/abs/2611.23678)
- [Governed ML Experimentation code and 1,445 trial ledgers (GitHub)](https://github.com/dowlingwong/autoresearch_harness)
- [arXiv cs.AI new submissions, 2026-11-19 announcement batch](https://arxiv.org/list/cs.AI/new)
- [arXiv cs.CL new submissions, 2026-11-19 announcement batch](https://arxiv.org/list/cs.CL/new)
- [arXiv cs.MA new submissions, 2026-11-19 announcement batch](https://arxiv.org/list/cs.MA/new)
