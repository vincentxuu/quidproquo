---
title: "AI Engineer Interview Drill — 2026-11-25: ML System Design"
date: 2026-11-25
category: daily
type: digest
tags: [ai-engineer-interview, daily, system-design]
lang: en
description: "Wednesday's slot is ML System Design: breaking the A/B test for launching a new feed-ranking model into sample size, SRM, CUPED, peeking, interference and guardrail non-inferiority tests, plus why a better offline metric does not guarantee an online win."
tldr: "Before a new ranking model ships, the A/B test has to protect three things: a sample size computed with a two-proportion test (2.0% baseline CTR, 5% relative lift, about 422K users per arm), a clean split with no SRM, and decisions that are not made by peeking. CUPED uses the same metric from before the experiment as a covariate and multiplies the variance by (1−ρ²); guardrails use non-inferiority tests, so you ship only with evidence that nothing regressed beyond the tolerated margin. The trap in today's question is reciting statistics while skipping the offline/online metric gap and interference in two-sided markets."
series:
  name: "AI Engineer 面試日練"
  order: 98
---

> :globe: [中文版](/posts/daily/2026-11-25-ai-interview-daily)

## Today's Focus

Wednesday's fixed slot is ML System Design. Earlier weeks covered feature stores, model serving and monitoring. Today we cover the last mile of the system: once a new model looks better offline, how do you use an online A/B test to prove it really works and did not hurt anything else? Interviewers often use this as the closing question of a model-launch discussion. The trap is not the formulas. It is knowing which parts can make the result untrustworthy: offline metrics that do not map to online outcomes, a broken split, peeking at data mid-test, and a control group affected by the treatment group.

## Core Concepts

### Offline up, online flat: separate four kinds of gap

In February 2026 the Pinterest engineering team published a diagnosis: a new L1 conversion model cut offline LogMAE by roughly 20% to 45%, yet online CPA was neutral or slightly worse. They traced it to several causes. First, features present in training were missing at serving time. Second, the two towers' embedding versions were out of sync online (version skew). Third, funnel alignment: a better early-stage model changes little when downstream stages are already near their ceiling. Fourth, offline metrics (LogMAE, calibration) and online metrics (CPA, shaped by bids, budgets and auction logic) are simply different things. In an interview, naming these four first and then saying "offline metrics are necessary, not sufficient" shows more depth than jumping straight to "run an A/B test".

### Sample size: do the two-proportion math first

The original prompt sets baseline CTR at 2.0%, an expected 5% relative lift (2.0% to 2.1% absolute), two-sided α=0.05 and 90% power. Per-arm sample size is n = (z₁₋α/₂ + z₁₋β)² × [p₁(1−p₁) + p₂(1−p₂)] / (p₂−p₁)². With z values of 1.960 and 1.282, that is about 422K users per arm and about 844K in total. Divide by 0.95 for 5% invalid traffic and by 0.99 for a 1% SRM buffer, and the total is about 897K. These are my own calculations from the prompt's assumptions, so in the interview be ready to write out the formula and each step. If 1M new eligible users arrive every day, one day is enough on paper, but you still have to think about day-of-week and novelty effects, and in practice teams usually run a full weekly cycle. That is a design recommendation, not something the formula implies.

### SRM: check the split before looking at any metric

SRM (sample ratio mismatch) means the observed split between arms differs significantly from the designed split. The KDD 2019 paper by Fabijan et al. gives an example: expected 50/50, observed 821,588 versus 815,482 (about 50.2/49.8), a gap with less than a 1-in-500,000 chance of arising randomly; a chi-square test can detect it. The same paper reports that about 6% of experiments at Microsoft showed an SRM. Its root-cause taxonomy includes bot removal, incorrect joins and delayed log arrival, which are exactly the steps the prompt's "5% invalid traffic" touches. Once an SRM appears, no downstream metric can be trusted until you find the cause and rerun.

### Peeking: checking the p-value daily breaks the 5% false-positive rate

Classical p-values assume the sample size is fixed in advance. Johari, Pekelis and Walsh show that these inferences are "wholly unreliable" if users decide when to stop by continuously monitoring. There are two fixes: plan α-spending up front (the prompt names Pocock and O'Brien-Fleming, implemented via Lan-DeMets) so early stopping does not inflate Type I error, or use the paper's always-valid p-values and confidence intervals, which stay valid whenever you look. The interview point is that early stopping is designed in, not "stop when it looks significant".

### CUPED: use pre-experiment data to shrink variance

CUPED was introduced by Deng, Xu, Kohavi and Walker at Microsoft (WSDM 2013) and is essentially control variates: the adjusted estimator is Ŷ_cv = Ȳ − θX̄ + θE(X), the optimal θ is cov(Y,X)/var(X), and the adjusted variance is (1−ρ²) times the original, where ρ is the correlation between Y and X. The covariate must not be affected by the treatment, so pre-experiment data is the safe choice. On Bing the paper reduced variance by about 50%, equivalent to half the users or half the duration at the same power. It also found that, among single covariates, the same metric from the pre-experiment period works best (for example, queries per user), and that a longer pre-period gives a higher reduction. For this question the covariate is each user's CTR over a pre-experiment window. To validate it, check how large ρ is and confirm the covariate means do not differ between arms, which doubles as a check that randomization worked.

### Interference and guardrails: the control group is not clean, and "no regression" must be proven

Blake and Coey analyzed marketing-campaign experiments in an online marketplace and showed that changing demand in the test group affects the supply available to the control group (general equilibrium effects); ignoring this inflated the estimated campaign effect by a factor of about two. A feed ranker with shared creators, advertisers or inventory deserves the same suspicion. Options include cluster or geo randomization and a holdout. For guardrails, Spotify's engineering team tests for regressions with non-inferiority tests: you define a tolerated deterioration (the non-inferiority margin) and pass only with evidence that the metric did not worsen by more than that. They also note that requiring every guardrail to pass lowers overall power, so account for that in the sample size.

```flow-diagram
{
  "title": "Six steps to design the A/B test for a new ranking model",
  "lang": "en",
  "width": 560,
  "height": 700,
  "nodes": [
    {"id": "metric", "label": "Define primary metric\nand guardrails", "x": 280, "y": 40, "w": 260},
    {"id": "size", "label": "Compute sample size\nand duration", "x": 280, "y": 150, "w": 260},
    {"id": "split", "label": "Randomize, check SRM first", "x": 280, "y": 260, "w": 260, "tone": "accent"},
    {"id": "run", "label": "Run full cycles,\nsequential monitoring", "x": 280, "y": 370, "w": 260},
    {"id": "analyze", "label": "CUPED on primary metric,\nguardrail non-inferiority", "x": 280, "y": 480, "w": 260},
    {"id": "decide", "label": "Decide: ramp, extend\nor roll back", "x": 280, "y": 600, "w": 260, "tone": "accent"}
  ],
  "edges": [
    {"from": "metric", "to": "size", "step": 1, "label": "Fix the minimum effect"},
    {"from": "size", "to": "split", "step": 2, "label": "Add invalid-traffic buffer"},
    {"from": "split", "to": "run", "step": 3, "label": "Proceed only if SRM passes"},
    {"from": "run", "to": "analyze", "step": 4, "label": "Look at planned points only"},
    {"from": "analyze", "to": "decide", "step": 5, "label": "Primary wins, guardrails pass"}
  ],
  "steps": [
    "Decide the primary metric (for example CTR), the minimum effect to detect and the tolerated margin for each guardrail.",
    "Compute per-arm sample size with a two-proportion test, inflate it for invalid traffic and an SRM buffer, then convert it into minimum days.",
    "After user-level randomization, the first step is a chi-square check on arm sizes. If SRM fails, do not read any metric.",
    "Run full weekly cycles and check only at pre-planned points using α-spending, rather than stopping on a daily p-value.",
    "Use pre-experiment user CTR for CUPED variance reduction, and non-inferiority tests to confirm guardrails did not regress beyond the margin."
  ],
  "caption": "A design flow summarized for this article; see the matching sections above for each step's source."
}
```

## Today's Practice Question

### Question

You are replacing the feed's ranking model with a new one. Baseline CTR is 2.0% and you expect a 5% relative lift, with 90% power, α=0.05 and 50/50 user-level assignment. Design the A/B test: compute sample size and minimum duration, plan guardrails and mid-test monitoring, explain CUPED and interference, and say how you would decide to ramp after the test.

**Source**: Snowflake interview question "Design an A/B test for ML model launch" (collected by PracHub, tagged Data Scientist / Technical Screen; reframed here as an ML system design scenario)　**Difficulty**: Advanced　**Round**: technical screen / system design

### How to Break It Down

1. **Clarify first**: How is CTR defined (did the user click at least once, or per impression)? Is the unit of randomization the user? Are the 1M daily users new and unique, or the same people returning? Are there shared resources such as creators or advertisers that let the two arms affect each other?
2. **Build a frame**: organize in three layers: show the measurement is trustworthy (sample size, SRM, invalid traffic), show the effect is real (CUPED, sequential monitoring), and show nothing else was hurt (guardrails, ramp).
3. **Go to the core**: the key trade-off is speed versus rigor. Early stopping saves time but needs α-spending or always-valid inference; CUPED saves sample but the covariate must be pre-experiment data; guardrails need power reserved in the sample size.
4. **Close**: end with one decision rule: ramp gradually only when the primary metric shows evidence of improvement, every guardrail proves no regression beyond its margin, and SRM passes, keeping a holdout to watch long-term effects.

### Sample Answer (how you could say it in an interview)

> **First, make sure we can measure**: I start with a two-proportion power calculation. 2.0% to 2.1%, two-sided α=0.05, 90% power gives about 422K users per arm, roughly 844K total. Dividing by 0.95 for invalid traffic and by 0.99 for an SRM buffer brings it to about 900K. On paper one day of traffic is enough, but I would still run at least one full weekly cycle to get past day-of-week and novelty effects. Right after randomization I run a chi-square check on arm sizes, and if SRM fails I investigate before reading any metric.
>
> **Then, show the effect is real**: for mid-test monitoring I would use a pre-planned α-spending function such as O'Brien-Fleming, checking only at fixed points rather than reading the p-value daily. For analysis I would use CUPED with each user's pre-experiment CTR as the covariate, because the paper shows the same metric from before the experiment is the best single covariate and the treatment cannot affect it. I would estimate how much variance ρ buys us and confirm the covariate means match across arms.
>
> **Finally, confirm nothing else got hurt**: bounce rate, crash rate, p95 latency and revenue per user each get a tolerated margin and a non-inferiority test showing no regression beyond it. If feed content or creators are shared, I would suspect control contamination and, if needed, switch to cluster or geo randomization or keep a holdout. After the test I would check the power actually achieved and effect differences across cohorts, then ramp in stages.

### Self-Check List

Use this table to see whether your answer missed any key point:

| Check item | Mentioned? |
|---------|---------|
| Two-proportion formula with the actual numbers, plus invalid-traffic and SRM buffers | |
| SRM check before reading any metric | |
| Sequential monitoring (α-spending or always-valid) and why peeking is wrong | |
| CUPED covariate must be pre-experiment data, and how to validate it | |
| Guardrails tested with non-inferiority and a predefined margin | |
| Bonus: the offline/online metric gap and interference in two-sided markets | |

## Further Reading

- [Bridging the Gap: Diagnosing Online-Offline Discrepancy in Pinterest's L1 Conversion Models — Pinterest Engineering](https://medium.com/pinterest-engineering/bridging-the-gap-diagnosing-online-offline-discrepancy-in-pinterests-l1-conversion-models-1320faaaeefe) — a real case of offline gains that did not become online wins, good practice for root-cause breakdowns in an interview.
- [Risk-Aware Product Decisions in A/B Tests with Multiple Metrics — Spotify Engineering](https://engineering.atspotify.com/2024/03/risk-aware-product-decisions-in-a-b-tests-with-multiple-metrics) — explains which tests to use for success metrics versus guardrails and how a decision rule controls error rates.

## References

- [Design an A/B test for ML model launch — PracHub (Snowflake)](https://prachub.com/interview-questions/design-an-a-b-test-for-ml-model-launch) — the original question and its assumptions (2.0% baseline CTR, 5% relative lift, 90% power, 5% invalid traffic, 1% SRM).
- [Improving the Sensitivity of Online Controlled Experiments by Utilizing Pre-Experiment Data — Deng, Xu, Kohavi, Walker (WSDM 2013)](https://www.exp-platform.com/Documents/2013-02-CUPED-ImprovingSensitivityOfControlledExperiments.pdf) — the CUPED formulas, (1−ρ²) variance reduction, the roughly 50% Bing result and covariate choice.
- [Diagnosing Sample Ratio Mismatch in Online Controlled Experiments — Fabijan et al. (KDD 2019)](https://exp-platform.com/Documents/2019_KDDFabijanGupchupFuptaOmhoverVermeerDmitriev.pdf) — the SRM definition, the 50.2/49.8 example, the roughly 6% prevalence and the root-cause taxonomy.
- [Always Valid Inference: Bringing Sequential Analysis to A/B Testing — Johari, Pekelis, Walsh (arXiv:1512.04922)](https://arxiv.org/abs/1512.04922) — why continuous monitoring invalidates ordinary p-values, and always-valid inference.
- [Why Marketplace Experimentation Is Harder than it Seems — Blake, Coey (EC 2014)](https://dl.acm.org/doi/10.1145/2600057.2602837) — test-control interference in marketplaces and the roughly two-fold overestimate.
- [Risk-Aware Product Decisions in A/B Tests with Multiple Metrics — Spotify Engineering](https://engineering.atspotify.com/2024/03/risk-aware-product-decisions-in-a-b-tests-with-multiple-metrics) — non-inferiority tests for guardrails and the power cost of requiring several guardrails to pass.
- [Bridging the Gap: Diagnosing Online-Offline Discrepancy in Pinterest's L1 Conversion Models — Pinterest Engineering](https://medium.com/pinterest-engineering/bridging-the-gap-diagnosing-online-offline-discrepancy-in-pinterests-l1-conversion-models-1320faaaeefe) — the four causes of the offline/online gap.
