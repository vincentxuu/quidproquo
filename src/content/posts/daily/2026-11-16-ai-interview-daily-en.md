---
title: "AI Engineer Interview Drill — 2026-11-16: ML Fundamentals"
date: 2026-11-16
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: en
description: "Monday's slot is ML Fundamentals: a real MeetAssist interview question anchors today's practice — breaking 'data leakage' into four distinct failure modes instead of reciting one generic line about keeping test data separate."
tldr: "Data leakage isn't one concept you can answer with 'don't let test data touch training' — it splits into target leakage (a feature secretly encodes the answer or future information), preprocessing leakage (scaling or encoding gets fit on the full dataset before the split), temporal leakage (a time-series model trains on information that wouldn't exist yet at prediction time), and group leakage (the same user or device shows up in both train and validation). Interviewers want to hear that you'd ask about the data's structure first and check each failure mode in turn, not recite a single catch-all line."
series:
  name: "AI Engineer 面試日練"
  order: 89
---

> :globe: [中文版](/posts/daily/2026-11-16-ai-interview-daily)

## Today's Focus

Monday's fixed slot is ML Fundamentals. Data leakage is one of the few topics that shows up in nearly every ML interview loop, whether as a concept question in a technical screen or as a chunk of pipeline code you're handed onsite and asked to debug. What makes it dangerous is that when leakage happens, offline metrics usually look *too good*. If your answer is just "test data can't touch training," one follow-up question is enough to expose that you don't actually know how it happens or how to catch it. Today's practice question splits leakage into four distinct mechanisms — the drill is turning a vague red flag into a concrete, checkable diagnostic process.

## Core Concepts

### Data leakage isn't one thing — it's four different mechanisms

Target leakage is when a feature itself encodes information that would only exist after you already know the answer (using "claim was already approved" as a feature to predict "will this policy file a claim"). Preprocessing leakage happens when scaling, imputation, or target encoding gets fit on the entire dataset *before* the train/validation split, letting statistics from the validation set quietly leak into training. Temporal leakage is when a time-series model trains on information that wouldn't have existed yet at prediction time. Group leakage is when records belonging to the same user, device, or account get split across train and validation, so the model learns to recognize *that entity* rather than the underlying pattern. All four share the same root cause — information showing up earlier than it should — but interviewers want to hear you diagnose them separately, not fold them into one sentence.

### Preprocessing leakage slips past because the code looks correct

Most people know not to train a model on test data, but forget that a `fit_transform` call is part of training too. If you standardize or target-encode the whole dataset before splitting, the validation set's mean, variance, or category frequencies have already seeped into the training process — even if the model training step itself is completely clean, the evaluation score still gets inflated. The fix is wrapping preprocessing in a `Pipeline`, so each cross-validation fold fits its preprocessing steps only on that fold's training data, then applies the fitted transform to the validation data.

### The time-series trap is look-ahead bias

Randomly splitting time-series data for cross-validation can put validation samples that are chronologically earlier than some training samples, which means the model effectively "sees the future" to predict the "past." The fix is a forward-only split like `TimeSeriesSplit`, with a gap between the training window and the validation window — because labels usually take time to resolve (e.g., "churned within 30 days"), and skipping that waiting period means the model trains on information it wouldn't have had access to at prediction time, even though validation gets it. Lag and rolling-window features need the same care: the window can't reach into the validation period.

### Group leakage breaks the independence assumption

If the same user appears ten times in a dataset, a random split will likely put some of those ten rows in training and some in validation. The model only needs to "memorize that user's other behavior patterns" to score well on validation — a gain that won't reproduce on a brand-new user at all. The fix is `GroupKFold`, which keeps every record from the same group — user, device, account — entirely in train or entirely in validation, never split across both.

```diagram
title: Where data leakage enters an ML pipeline
desc: Feature engineering, the train/validation split, and preprocessing fit each correspond to a different source of data leakage — the problem only surfaces later, as an abnormally good offline score at model training and evaluation.
caption: Simplified: upstream steps like data collection and feature selection are omitted.
step: Feature engineering can introduce target leakage — a feature secretly encodes information that only exists once the answer is known
step: The train/validation split can introduce temporal or group leakage — the split gets the time order or the grouping wrong
step: Preprocessing fit can introduce preprocessing leakage — scaling or encoding gets fit on the full dataset before the split
step: The problem surfaces at model training and evaluation, as an abnormally good offline score
---
<svg viewBox="0 0 792 232">
  <path class="dg-line" d="M164 56H196" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M364 56H396" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M564 56H596" marker-end="url(#arrow)" data-step="4"/>

  <path class="dg-line dg-line--warn dg-line--dashed" d="M92 88V140" marker-end="url(#arrow-warn)" data-step="1"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M280 88V140" marker-end="url(#arrow-warn)" data-step="2"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M480 88V140" marker-end="url(#arrow-warn)" data-step="3"/>

  <g data-step="1">
    <rect class="dg-box" x="20" y="24" width="144" height="64" rx="6"/>
    <text class="dg-label" x="92" y="47" text-anchor="middle" dominant-baseline="central">Feature eng.</text>
    <text class="dg-sub" x="92" y="67" text-anchor="middle" dominant-baseline="central">raw → features</text>
  </g>
  <g data-step="2">
    <rect class="dg-box" x="196" y="24" width="168" height="64" rx="6"/>
    <text class="dg-label" x="280" y="47" text-anchor="middle" dominant-baseline="central">Train/val split</text>
    <text class="dg-sub" x="280" y="67" text-anchor="middle" dominant-baseline="central">who goes where</text>
  </g>
  <g data-step="3">
    <rect class="dg-box" x="396" y="24" width="168" height="64" rx="6"/>
    <text class="dg-label" x="480" y="47" text-anchor="middle" dominant-baseline="central">Preprocess fit</text>
    <text class="dg-sub" x="480" y="67" text-anchor="middle" dominant-baseline="central">fits statistics</text>
  </g>
  <g data-step="4">
    <rect class="dg-box" x="596" y="24" width="176" height="64" rx="6"/>
    <text class="dg-label" x="684" y="47" text-anchor="middle" dominant-baseline="central">Train &amp; evaluate</text>
    <text class="dg-sub" x="684" y="67" text-anchor="middle" dominant-baseline="central">inflated score</text>
  </g>

  <g data-step="1">
    <rect class="dg-box dg-box--warn" x="20" y="140" width="144" height="72" rx="6"/>
    <text class="dg-label dg-text--warn" x="92" y="167" text-anchor="middle" dominant-baseline="central">target leak</text>
    <text class="dg-sub" x="92" y="187" text-anchor="middle" dominant-baseline="central">encodes answer</text>
  </g>
  <g data-step="2">
    <rect class="dg-box dg-box--warn" x="196" y="140" width="168" height="72" rx="6"/>
    <text class="dg-label dg-text--warn" x="280" y="167" text-anchor="middle" dominant-baseline="central">temporal/group</text>
    <text class="dg-sub" x="280" y="187" text-anchor="middle" dominant-baseline="central">wrong split axis</text>
  </g>
  <g data-step="3">
    <rect class="dg-box dg-box--warn" x="396" y="140" width="168" height="72" rx="6"/>
    <text class="dg-label dg-text--warn" x="480" y="167" text-anchor="middle" dominant-baseline="central">preprocessing</text>
    <text class="dg-sub" x="480" y="187" text-anchor="middle" dominant-baseline="central">fit too early</text>
  </g>
</svg>
```

## Today's Practice Question

### The question

What is data leakage, and how would you identify and prevent it in a modeling workflow?

**Source**: MeetAssist's real interview question bank (asked in 3 of 320 interviews, last asked 2026-10-18)　**Difficulty**: Intermediate　**Round**: Onsite scenario / mid-level

### How to break it down

1. **Clarify first**: Ask about the data's structure before answering — is it time-series, is there a grouping structure where the same entity appears repeatedly, and at what stage does preprocessing currently happen in the pipeline. Jumping straight to "test data can't touch training" throws away the chance to show you know leakage has more than one source.
2. **Build a framework**: Organize leakage by where it originates — feature level (target leakage), preprocessing level (preprocessing leakage), time level (temporal leakage), and group level (group leakage) — pairing each with one sentence on how it happens and one on how to prevent it. A clear structure matters more than piling on examples.
3. **Go deep on one or two**: Name concrete, checkable diagnostic signals — a single feature with abnormally high importance, a train/validation gap that's suspiciously small, or a score that visibly drops once you switch to `GroupKFold` or `TimeSeriesSplit`. Being able to say that a lower score is the *correct* outcome here is the detail that separates a strong answer from a memorized one.
4. **Close it out**: Add that these checks belong in the pipeline's code review checklist, not something you discover from production monitoring after the fact. That moves the answer from "I know the definition" to "here's how my team builds the habit."

### Sample answer (say this out loud in the interview)

> **I'd start by splitting leakage into its sources.** I'd first ask whether this is time-series data and whether the same user shows up more than once. Data leakage at its core is "information that wouldn't be available at prediction time, but shows up during training anyway," and it takes four concrete shapes: a feature that secretly encodes the answer or future information (target leakage), preprocessing that gets fit on the whole dataset before the split (preprocessing leakage), a time-series model trained on information that wouldn't exist yet at prediction time (temporal leakage), and records from the same user split across train and validation (group leakage).
>
> **For diagnosis, I'd look for three signals.** A single feature with importance far higher than everything else usually means it's secretly encoding the answer; a train/validation gap that's almost nonexistent is suspicious rather than reassuring for ordinary supervised learning, and should make you ask where the leak is; and switching to the correct split — `TimeSeriesSplit` with a gap for time-series, `GroupKFold` for grouped data — and watching the score drop noticeably tells you the earlier high score was inflated by leakage. That drop is closer to the real production number.
>
> **For prevention, I'd wrap preprocessing in a `Pipeline`**, so scaling, imputation, and target encoding each get fit independently on that fold's training data, then applied to validation — never fit on the full dataset before the split. For time-series data, I'd add the waiting period the label actually needs to resolve; for grouped data, I'd always use `GroupKFold`. And I'd put these checks into the pipeline's code review checklist rather than waiting for production metrics to collapse, because by then the cost is retraining plus explaining to stakeholders why the offline numbers were never trustworthy.

### Self-check

Use this table to check whether your answer hit the key points:

| Check item | Covered? |
|---|---|
| Split data leakage into at least three distinct sources (target / preprocessing / temporal / group) | |
| Named concrete, checkable diagnostic signals (abnormal feature importance, too-small train/val gap) | |
| Explained why a score drop after switching to the correct split is the expected, healthy outcome | |
| Mentioned wrapping preprocessing in a Pipeline, fit independently within each CV fold | |
| Named the matching split strategy for time-series or grouped data (TimeSeriesSplit / GroupKFold) | |
| Bonus: turned the checks into an engineering process (code review checklist) instead of relying on production monitoring to catch it | |

## Further Reading

- [Machine Learning Interviews and How to Spot Data Leakage — DEV Community](https://dev.to/henry123/machine-learning-interviews-and-how-to-spot-data-leakage-20g5) — walks through concrete examples of identifying leakage in an interview setting, filling out today's "diagnostic signals" section.
- [How to Discuss Data Leakage, Drift, and Model Monitoring in ML Interviews — Interview Node](https://www.interviewnode.com/post/how-to-discuss-data-leakage-drift-and-model-monitoring-in-ml-interviews) — extends data leakage into post-deployment drift and monitoring, a good follow-up alongside the drift-diagnosis question from 10/26.

## References

- [41 Cross-validation and Data Leakage Interview Questions — MeetAssist](https://meetassist.io/interview-questions/machine-learning/validation) — original source and frequency stats for today's practice question, "What is data leakage, and how would you identify and prevent it in a modeling workflow?"
- [12. Common pitfalls and recommended practices — scikit-learn documentation](https://scikit-learn.org/stable/common_pitfalls.html) — corresponds to the "preprocessing leakage" section; the official docs explain why Pipelines prevent validation statistics from leaking into training.
- [8.1. Pipelines and composite estimators — scikit-learn documentation](https://scikit-learn.org/stable/modules/compose.html) — corresponds to "wrap preprocessing in a Pipeline"; the official docs explain how Pipelines ensure each fold fits preprocessing only on its own training data.
