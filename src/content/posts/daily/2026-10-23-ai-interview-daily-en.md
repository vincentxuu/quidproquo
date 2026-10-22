---
title: "AI Engineer Interview Daily — 2026-10-23: Coding"
date: 2026-10-23
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: en
description: "Friday's slot is ML-flavored coding — today's drill is reservoir sampling: pulling k items uniformly from a stream of unknown length, where you can't sort, can't look back, and shouldn't reach for vectorization just because last Friday said to."
tldr: "Today's practice question is 'uniformly sample k items from a stream of unknown length' (reservoir sampling), adapted from a CoPilot Interview article published 2026-10-22 on MLE onsite loops. The point isn't memorizing the algorithm — it's being able to state the inductive proof for why each item ends up in the sample with probability k/n, and why this kind of single-pass, state-dependent streaming problem shouldn't get the vectorization treatment we practiced last Friday."
series:
  name: "AI Engineer Interview Daily"
  order: 65
---

> 🌏 [中文版](/posts/daily/2026-10-23-ai-interview-daily)

## Today's Focus

Friday is still Coding day, but today's a different flavor from last week. Last Friday's k-means was a "batch data, everything fits in memory at once" problem. Today's is a "streaming data, you don't know the length ahead of time" problem — reservoir sampling. This type of question shows up in MLE onsite coding rounds right alongside "compute precision/recall/F1" and "compute each user's seven-day rolling activity count." What's being tested isn't how well you've memorized a data structure — it's whether you can derive a probabilistically sound algorithm under the constraint that memory is limited and data can only be read once, and then explain *why* it works instead of just typing out code.

## Core Concepts

### 1. The "ML flavor" in ML coding questions hides in probability and streaming assumptions

A typical LeetCode question assumes all the data is already in hand — sort it, scan it multiple times, whatever you want. MLE interviews deliberately add a "streaming" or "probabilistic sampling" constraint instead — the data source might be a user-event log, a live feature stream, or a dataset too large to fit in memory, which immediately rules out "just sort it first." The interviewer wants to see whether you notice this constraint changes the whole direction of the solution, instead of forcing the question into a template you memorized.

### 2. Reservoir sampling's core invariant: every element has to end up with probability k/n

The algorithm itself isn't hard: stuff the first k items into a "reservoir," then from item k+1 onward, use randomness to decide whether to swap each new item in and which one to kick out. The hard part is explaining *why* this is correct — proving by induction that after processing item i, every element currently in the reservoir has exactly a k/i chance of being there. That invariant is what guarantees that by the time the stream ends, every one of the n items has exactly a k/n chance of being selected — true uniform sampling, not something that merely looks random but is secretly biased.

```diagram
title: "Reservoir sampling: the swap decision for item i"
desc: When the stream reaches item i, a uniform random draw r decides whether to swap it into the reservoir and which slot it replaces, so every item ends up with probability k/n.
caption: "Simplified: only the decision from item k+1 onward is shown; the first k items go straight into the reservoir without this check."
---
<svg viewBox="0 0 640 440">
  <path class="dg-line" d="M280 34V60" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M280 116V172" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M376 216H432" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M280 260V312" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M280 360V408"/>
  <path class="dg-line" d="M512 240V400Q512 408 504 408H280"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M280 408H100Q92 408 92 400V96Q92 88 100 88H200" marker-end="url(#arrow-warn)"/>

  <circle class="dg-dot" cx="280" cy="28" r="6"/>
  <circle class="dg-dot" cx="280" cy="408" r="4"/>

  <g>
    <rect class="dg-box" x="196" y="60" width="168" height="56" rx="6"/>
    <text class="dg-label" x="280" y="77" text-anchor="middle" dominant-baseline="central">Read next item</text>
    <text class="dg-sub" x="280" y="100" text-anchor="middle" dominant-baseline="central">item i, i &gt; k</text>
  </g>

  <g>
    <path class="dg-box" d="M280 172L376 216L280 260L184 216Z"/>
    <text class="dg-label" x="280" y="206" text-anchor="middle" dominant-baseline="central">r &lt; k?</text>
    <text class="dg-sub" x="280" y="228" text-anchor="middle" dominant-baseline="central">r = rand(0, i)</text>
  </g>

  <g>
    <rect class="dg-box dg-box--accent" x="420" y="192" width="184" height="48" rx="6"/>
    <text class="dg-label" x="512" y="216" text-anchor="middle" dominant-baseline="central">Swap into slot r</text>
  </g>

  <g>
    <rect class="dg-box" x="196" y="312" width="168" height="48" rx="6"/>
    <text class="dg-label" x="280" y="336" text-anchor="middle" dominant-baseline="central">Discard item</text>
  </g>

  <text class="dg-edge" x="398" y="204" text-anchor="middle" dominant-baseline="central">yes</text>
  <text class="dg-edge" x="290" y="276" text-anchor="start" dominant-baseline="central">no</text>
  <text class="dg-edge dg-text--warn" x="102" y="250" text-anchor="start" dominant-baseline="central">next item</text>
</svg>
```

### 3. Streaming constraints change your entire toolbox

Batch problems let you sort, scan multiple times, or lay out the whole dataset to compute a distance matrix at once. Streaming problems only let you look once, never backtrack, and only hold O(k) memory instead of O(n). That rules out some of your usual tricks (sort-for-median, multi-pass convergence) outright, and forces a single-pass, update-state-as-you-go approach instead. When an interviewer deliberately says "data stream" and "unknown length," they're testing whether you check the constraints first and pick the algorithm second, instead of hearing "sampling" and reflexively reaching for `random.sample`.

### 4. Not every ML coding question deserves vectorization

Last Friday's k-means practice stressed "use broadcasting instead of nested loops." Reservoir sampling is the counterexample — whether each item gets swapped into the reservoir, and the outcome, depend on the state from the previous step; it's fundamentally a sequentially dependent chain of random decisions, and it can't be vectorized all at once. Forcing vectorization onto it tends to plant subtle bugs around "sharing a random seed" or "pretending steps are independent when they aren't." What the interviewer wants to hear is that you can tell the difference between "this problem should be vectorized" and "this problem is structurally sequential, and forcing vectorization just creates new bugs."

### 5. Precision/recall/F1's zero-division edge case is a recurring trap in the same question bank

The same article lists another question from this set — "write a function that computes precision, recall, and F1, and handles the case where the model predicts no positives at all." It's testing the same mindset: edge cases decide whether you pass. When the denominator is zero, you need to explicitly define the return value (usually 0, documented as a deliberate choice), not let the function throw a `ZeroDivisionError` or silently return `nan`.

## Today's Practice Question

### The Question

You have a data source whose length you don't know in advance — it could be a live event stream, or a file too large to even count the total number of rows beforehand. Implement a function that uniformly samples k items from this stream, scanning it exactly once, using extra memory proportional only to k (not to the total length n). Explain why your method produces a uniform sample.

**Source**: Adapted from the MLE coding-round examples listed in CoPilot Interview's "Machine Learning Engineer Onsite Interview: Round by Round" (published 2026-10-22) **Difficulty**: Intermediate **Round**: Onsite coding round

### Breaking It Down

1. **Clarify the problem first**: is the length genuinely unknown, or just known-but-large with an upper bound? Does the sample need to preserve original order? If the stream might repeat the same item, does that need deduplication? These decide whether you need anything beyond the basic version.
2. **Build the framework**: split the problem into two phases — the first k items go straight into the reservoir, no probability check needed; from item k+1 onward, every item requires a decision about "should this swap out something already in the reservoir," and the probability formula behind that decision is the whole core of the question.
3. **Go deep on the core trade-offs**: item i (1-indexed, i > k) must stay in the reservoir with probability k/i, so you generate a uniform random draw over [0, i) (or [1, i], depending on your indexing convention), and if that draw lands inside the reservoir's size range, you swap the new item into that slot; otherwise you discard it. The key is being able to prove this out loud: assuming every item has probability k/(i-1) of being in the reservoir after processing i-1 items, once you add item i, the old items' probability of staying needs a conditional correction for "wasn't swapped out," and the new item's probability of staying needs to come out to k/i — both have to check out algebraically for the induction chain to hold.
4. **Close it out**: state the complexity — O(n) time, O(k) extra space — and proactively name the practical caveat: if n is actually known and small, plain uniform sampling without replacement (e.g. `np.random.choice`) is more intuitive and easier to test. Reservoir sampling earns its keep specifically when n is genuinely unknown or too large to compute up front.

### Sample Answer (How You'd Actually Say This in an Interview)

> **Confirm the constraints first.** I'd ask whether the source is really unknown-length or just "large," because if n actually has a known bound, plain uniform sampling without replacement is simpler and easier to test. Assuming it's confirmed to be a genuinely unknown-length stream, I'd go with reservoir sampling.
>
> **Write the core logic.** I'd put the first k items straight into a fixed-size array as the reservoir, no probability check at all. From item k+1 onward, for each new item, I'd generate a uniform random integer between 0 and the count of items seen so far minus one; if that number is less than k, I swap the new item into the reservoir slot at that index, otherwise I discard the item and move on. The whole pass scans the stream exactly once, and the only extra memory is the reservoir itself at O(k) — completely independent of n.
>
> **Prove why it's correct.** This is the part the interviewer actually wants to hear — by induction: assume that after processing item i-1, every item in the reservoir has probability k/(i-1) of being there. When you process item i, the new item's probability of staying is exactly the random range I chose, which works out to k/i; an old item staying requires it "wasn't swapped out this round" times "was already in the reservoir," and multiplying those out and simplifying also gives k/i. The induction holds, which means by the time you reach the last item, every one of the n items ends up in the reservoir with exactly k/n probability — that's the actual definition of "uniform sampling," not just "feels random enough."

### Self-Check

Use this table to check whether your answer hit the key points:

| Checklist item | Covered? |
|---|---|
| Confirmed whether the stream is genuinely unknown-length vs. known-but-large | |
| Clearly separated the two phases: first k items go straight in, items k+1 onward use the probability check | |
| Could state out loud the inductive proof that every element ends up with probability k/n, not just recite the algorithm steps | |
| Clearly stated O(n) time, O(k) extra space, independent of n | |
| Bonus: explained why this problem doesn't suit vectorization, contrasting with a batch problem like k-means | |

## Further Reading

- [Machine Learning Engineer Onsite Interview: Round by Round — CoPilot Interview](https://copilotinterview.com/blog/machine-learning-engineer-onsite-interview) — source for today's practice question; the same question bank also lists precision/recall/F1 and rolling-window activity-count as ML-flavored coding examples
- [LinkedIn Interview Questions (Updated 2026) — PracHub](https://prachub.com/companies/linkedin) — a 217-question real LinkedIn interview bank; its MLE category explicitly names "probabilistic sampling" and "weighted-index sampling" as recurring themes, good for cross-practice
- [Machine Learning Interview Questions and Answers (2026) — goodspace.ai](https://goodspace.ai/interview-questions/machine-learning) — a complete vectorized NumPy implementation of mini-batch SGD, useful as a contrast for today's discussion of "which problems deserve vectorization"

## References

- [Machine Learning Engineer Onsite Interview: Round by Round — CoPilot Interview](https://copilotinterview.com/blog/machine-learning-engineer-onsite-interview) — source for today's practice question (reservoir sampling) and the precision/recall/F1 zero-division trap
- [LinkedIn Interview Questions (Updated 2026) — PracHub](https://prachub.com/companies/linkedin) — supporting source for "probabilistic sampling" and "weighted-index sampling" as recurring MLE interview themes
- [Machine Learning Interview Questions and Answers (2026) — goodspace.ai](https://goodspace.ai/interview-questions/machine-learning) — vectorized NumPy implementation example, used as the contrast case for "which problems should be vectorized"
