---
title: "State Space Models: From Recurrence to Convolution | CMU 10-423 Lecture 21"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 29
description: "State Space Models: From Recurrence to Convolution | CMU 10-423 Lecture 21"
draft: false
---

> [繁體中文版](/posts/ai/2026-10-11-cmu10423-lecture-21-state-space-models)

**Video status: recordings require login or course authorization.** This guide uses the public slides for Lecture 21 of CMU 10-423 Spring 2026. Worked examples and variations are teaching additions.

Attention can directly revisit stored tokens, but its KV cache grows with history. An alternative compresses the past into a fixed-size state and updates it for each input. This saves storage while raising a new question: what information survives? Lecture 21 covers linear state spaces, S4, selective Mamba, and hybrids.

Start with [RNN state](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff-en). Here A transforms the old state, B writes input, and C reads output. Matrix powers mean repeated composition, not elementwise powers.

## Discrete and continuous systems

A discrete linear SSM is `h_t=A h_(t−1)+B x_t`, `y_t=C h_t`, omitting direct feedthrough. A d-dimensional state does not grow with consumed token count, but batch, layers, and training activations still cost memory.

Continuous systems start with `dh/dt=A_c h+B_c x`. A sampling interval and input assumption determine discrete A and B. Under zero-order hold, A relates to a matrix exponential. Continuous and discrete matrices are not interchangeable. S4 uses structured state matrices and efficient kernel computation; an arbitrary large matrix does not inherit its properties.

## Recurrence becomes convolution

For an illustrative scalar system, initial state0, A=.5, B=C=1, and inputs `[1,2,0]`:

```text
h1 = .5×0 + 1 = 1
h2 = .5×1 + 2 = 2.5
h3 = .5×2.5 + 0 = 1.25
```

Outputs equal states. A zero final input still gives 1.25 because earlier inputs remain. Expanding gives `h3=.25×1+.5×2+1×0=1.25`. Generally, with zero initial state, `y_t=Σ C A^(t−i) B x_i`. The fixed kernel is `CB,CAB,CA²B,...`, here `[1,.5,.25,...]`.

Convolution yields y1=1, y2=2+.5, y3=0+1+.25, matching recurrence. Whole-sequence training can exploit convolution; streaming inference can update state. These are computation paths for the same linear time-invariant system.

## Selection breaks the fixed kernel

A fixed system applies the same rule regardless of whether input is an important name or filler. Selective SSMs make some parameters input-dependent, including B, C, or the discretization step delta.

In a simplified illustration, let A vary as `.5,.1,.9`, retaining B=C=1 and inputs `[1,2,0]`. States become1,2.1,1.89. At step3 the first input has coefficient `.9×.1=.09` and the second `.9`, rather than the fixed kernel's `.25,.5`. This is not full Mamba, but shows how selection changes historical weights.

Losing a fixed convolution kernel does not force a slow Python loop. Mamba uses a hardware-aware scan; parallel scan and fixed convolution are different algorithms.

## Variation and tradeoffs

Add x4=1 to the fixed system. Recurrence gives `.5×1.25+1=1.625`; convolution gives `1×1+.5×0+.25×2+.125×1=1.625`. With A=B=C=1, the output is a prefix sum, so swapping1 and 2 preserves the final total. This illustrates possible loss of order in this particular state, not a property of every SSM.

Compression can be tested directly. In the scalar A=.5 system, sequences `[1,0]` and `[0,.5]` both end with state .5. A decoder reading only that state cannot answer whether the first input was1: its input is identical. More explanation cannot recover lost information. One must change the representation, retain extra information, or narrow the task. Larger states and selection may mitigate such failures, but task-specific collision and interference tests remain necessary.

Attention stores historical K/V for query-dependent access; SSMs compress history into state. Memory advantages do not establish exact retrieval quality. Hybrids mix the two mechanisms without automatically combining every advantage. Compare matched data, parameter counts, lengths, and tasks; report throughput, cache size, and information-use accuracy separately.


## Continue reading

- [Previous](/posts/ai/2026-09-30-cmu10423-reasoning-models-en)
- [Next](/posts/ai/2026-10-11-cmu10423-lecture-22-real-world-risks-en)

## Course video sources

The official [course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/) provides a Panopto recording link; access requires login or course authorization. This is a slide-based guide; it does not include a recording transcript, captions, or original-audio shadowing material.

## References

- [CMU Lecture 21 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture21-ssm.pdf)
- [S4](https://arxiv.org/abs/2111.00396)
- [Mamba](https://arxiv.org/abs/2312.00752)
