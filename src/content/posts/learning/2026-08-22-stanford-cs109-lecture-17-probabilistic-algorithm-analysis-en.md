---
title: "Stanford CS109 Lecture 17 | Algorithmic Analysis: Conditional expectation, indicators, and recursion"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 18
tldr: "Expected cost in randomized code can be conditioned on the first random choice; counting problems become indicator sums, often avoiding the full distribution entirely."
description: "A problem-by-problem guide to Stanford CS109 Summer 2026 Lecture 17: conditional expectation, total expectation, recursive code, indicators, hash collisions, and coupon collection."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-17-probabilistic-algorithm-analysis)

This is article 18 in [Reading Stanford CS109](/series/stanford-cs109), covering **Summer 2026 Lecture 17: Algorithmic Analysis** on July 21 with Chris Gregg. It follows the current [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture17-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture17-AnswerKey.pdf), [LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture17-LLMPrompts.pdf), and the reader's [algorithmic analysis](https://probabilitycoders.stanford.edu/spr26/algorithmic_analysis) chapter. Current slides are unavailable and Canvas video is gated, preserving the L2 boundary.

All three artifacts have three pages. The formal agenda is complete P1–P7 plus challenge. Rather than derive every randomized runtime's full distribution, this lecture uses conditional expectation, linearity, and indicators to obtain expected values directly.

## P1: Read a bootstrap p-value

Among 10,000 null differences, 140 are at least as extreme as observed `2.1` minutes:

```text
p=140/10000=0.014
```

If the UI change had no effect, about 1.4% of similar experiments would show such an extreme gap. That is reasonably strong evidence against the null, not the probability that the null is true.

## P2: Conditional expectation from a joint table

Row masses are `P(Y=1)=0.30` and `P(Y=2)=0.70`. Renormalize each row before weighting `X`:

```text
E[X|Y=1]=(0×.15+1×.10+2×.05)/.30=2/3
E[X|Y=2]=(0×.10+1×.30+2×.30)/.70=9/7
```

Total expectation gives

```text
E[X]=(2/3)(.30)+(9/7)(.70)=1.1
```

The marginal `P(X=0,1,2)=(.25,.40,.35)` independently verifies `.40+2(.35)=1.1`. `E[X|Y=y]` is a number for fixed `y`; `E[X|Y]` is a random variable as a function of `Y`, and `E[E[X|Y]]=E[X]`.

## P3: Cache Hierarchy averages and tails

Browser cache, CDN, and origin have probability/cost pairs `(.5,1)`, `(.35,40)`, and `(.15,300)`:

```text
E[T]=.5(1)+.35(40)+.15(300)=59.5 ms
```

Given a browser-cache miss, remaining mass is `.5`:

```text
E[T|miss]=[.35(40)+.15(300)]/.5=118 ms
```

The 59.5-ms mean hides that 15% of users wait 300 ms. For bimodal system latency, percentiles or the full distribution may describe user experience better than expectation alone.

## P4: A self-referential Roll Until Big equation

Rolls one or two add their value and recurse; three through six stop. Let `μ=E[X]` and condition on the first roll:

```text
μ=(1/6)(1+μ)+(1/6)(2+μ)
  +(1/6)(3+4+5+6)
=3.5+(1/3)μ

μ=5.25
```

The expected value of each fresh recursive call is the same `μ`. P4 is a pset5 item omitted from the public key; the equation follows only from worksheet code.

## P5: Analyze recursive code

`mystery()` has four equally likely branches: one returns two, one returns `1+mystery()`, and two return `3+mystery()`:

```text
E[Y]=(1/4)2+(1/4)(1+E[Y])+(2/4)(3+E[Y])
    =2.25+.75E[Y]

E[Y]=9
```

Expected recursive calls per invocation are `.75<1`, consistent with a finite answer. If expected recursive offspring reach at least one, the linear equation may have no finite expectation; termination or mean work needs separate scrutiny.

## P6: Hash Table indicators

Twenty keys hash independently and uniformly into ten buckets. Let `Bi` indicate that bucket `i` is empty. Every key avoids it with probability `9/10`:

```text
E[number empty]=Σ(i=1..10)E[Bi]
               =10(9/10)^20≈1.22
```

For every key pair `(j,k)`, define collision indicator `Ijk`. The second key matches the first key's bucket with probability `1/10`, and there are `C(20,2)=190` pairs:

```text
E[colliding pairs]=190/10=19
```

Dependent indicators do not obstruct expectation because `E[ΣIi]=ΣE[Ii]` requires no independence. Independence matters for quantities such as variance or joint probabilities.

## P7: The final coupons dominate collection cost

After owning `i` of eight heroes, a new hero arrives with probability `(8-i)/8`. Therefore

```text
Xi~Geo((8-i)/8),  E[Xi]=8/(8-i)
```

Collecting all eight takes

```text
E[X]=Σ(i=0..7)8/(8-i)
    =8(1+1/2+...+1/8)
    =761/35≈21.7
```

Reaching four heroes requires only `1+8/7+8/6+8/5≈5.08` packs. Early packs are usually new; the last missing hero succeeds with probability `1/8` and alone costs eight packs on average, so the tail dominates total cost.

## Challenge: Llama-Flu branching recursion

`num_infected()` returns zero with immune probability `.99`. Otherwise, that person counts as one infection and contacts `K~Bin(100,.25)` people, recursively calling once per contact. Let `μ` be expected total infections:

```text
E[K]=25
μ=.99(0)+.01(1+E[K]μ)
 =.01+.25μ

μ=.01/.75=1/75≈0.0133
```

This is subcritical branching: each invocation creates `.01×25=.25` effective recursive descendants on average, below one, so expectation is finite. The challenge is a pset5 item omitted from the public key; this equation uses only prompt code.

## How to use the LLM Learning Guide

The six concepts are conditional expectation, total expectation, expected runtime, recursive code, indicators, and coupon collection. For code, condition on the first random choice, replace a fresh recursive call with the unknown mean, and solve. For counts, define one 0/1 indicator per object or pair; do not assume independence merely to compute an expectation.

## Material boundaries

- This guide covers P1–P7, the optional challenge, and all six guide concepts; all three pages are complete.
- P4 and the challenge are pset5 items omitted from the public key and are derived only from worksheet code.
- Current slides are unavailable and video is gated; this L2 guide does not reconstruct missing lecture content.
- The limited artifact scope qualifies for the short-material exception; the article remains `draft: true` pending independent review.

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 17: Algorithmic Analysis](https://web.stanford.edu/class/cs109/lectures/17-AlgorithmAnalysis)
- [Lecture 17 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture17-Worksheet.pdf)
- [Lecture 17 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture17-AnswerKey.pdf)
- [Lecture 17 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture17-LLMPrompts.pdf)
- [Probability for Computer Science: Algorithmic analysis](https://probabilitycoders.stanford.edu/spr26/algorithmic_analysis)
