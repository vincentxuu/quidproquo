---
title: "Distributed Training: Splitting Data, Models, and Optimizer State | CMU 10-423 Lecture 17"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 25
draft: false
description: "A complete worked example and answered variations for Distributed Training: Splitting Data, Models, and Optimizer State."
---

> 🌏 [中文版](/posts/ai/2026-10-11-cmu10423-lecture-17-distributed-training)

**Video status: recordings require login or course authorization.** [Sources](#course-video-sources)

This guide follows [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 public slides. Worked examples are original teaching additions.

## More GPUs do not specify one algorithm

Data parallelism splits examples; tensor parallelism splits operations within a layer; pipeline parallelism splits layers; state sharding divides storage of optimizer state, gradients, and parameters. Review [autodiff](/posts/ai/2026-10-11-cmu10423-hw0-autodiff-en) and [Transformers](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa-en). We will calculate a two-device update and distinguish storage from computation.

Data-parallel devices typically hold identical model replicas, compute local gradients, synchronize, and update consistently. Doubling devices does not automatically halve each replica's weight memory. A model that cannot fit needs another form of splitting or sharding.

## Calculate one synchronized step

Our original scalar model is ŷ=wx, initially w=1, with per-example loss 0.5(wx−y)². Device A gets (1,3) and gradient −2. Device B gets (2,1) and gradient two. With one example each, the global mean is zero, so learning rate 0.1 leaves both weights at one.

Independent steps would produce 1.2 and 0.8, breaking replica agreement. A summed collective without correct scaling can also enlarge updates. This canceling example hides that error, so change B's target to two: g_B=0, global gradient=−1, and the correct new weight is 1.1. Forgetting to average would give 1.2.

## Unequal batches require weighting

If A has one example and B three, averaging their local mean gradients equally does not recover the four-example mean. Use (g_A+3g_B)/4. Check loss reduction, sampler behavior, synchronization conventions, and accumulation scaling together. Otherwise effective learning rates can depend accidentally on microbatch count.

Dropout, floating-point operations, and collective ordering can prevent bitwise agreement with a single-device run. A meaningful check compares gradients for the same objective within tolerance and verifies consistent replicas.

## Splitting models versus splitting state

Tensor parallelism can split output dimensions across devices, with gather or reduce operations when later computation needs combined results. Pipeline stages overlap microbatches but retain dependencies and fill/drain bubbles. Granularity and communication determine speed, not device count alone.

[ZeRO](https://arxiv.org/abs/1910.02054) progressively shards optimizer states, gradients, and parameters to reduce replicated storage. Adam moments and mixed-precision master weights can consume substantial memory, with bytes depending on implementation. State sharding changes storage and communication; it does not automatically halve every layer's arithmetic.

## Check your understanding

One example with mean gradient −2 plus three with mean gradient two yields a global mean of one, not zero. Learning rate 0.1 gives w=0.9. Four-way pure data parallelism does not turn a 10 GB weight replica into 2.5 GB per device. Large optimizer state may favor state sharding; an oversized single layer may require parameter or tensor splitting. Continue to [efficient inference](/posts/ai/2026-10-11-cmu10423-lecture-18-efficient-inference-en).

## Course video sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, anonymous retrieval returned an unloaded folder and a sign-in prompt, without playable classroom content. This establishes an access limit, not the absence of recordings. This guide uses public slides and linked primary papers; examples are original teaching additions, not a transcript. [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22).

## References

- [CMU 10-423 Spring 2026 Lecture 17 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture17-distributed.pdf)
- [Primary paper](https://arxiv.org/abs/1910.02054)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
