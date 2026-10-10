---
title: "MIT 6.5940 Lab 1: Nine Questions on Fine-Grained and Channel Pruning"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, pruning, homework, pytorch]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 4
tldr: "MIT 6.5940 Fall 2024 Lab 1 is one Colab notebook with 9 questions worth 100 points. Questions 1–5 apply magnitude-based fine-grained pruning and a sensitivity scan to a VGG on CIFAR-10, and require a model at 25% of its original size with over 92.5% accuracy after fine-tuning. Questions 6–8 cover channel pruning, Frobenius-norm channel ranking, and measured speedup; Question 9 compares the two. Fall 2026 has no pruning lab."
description: "A guide to MIT 6.5940 EfficientML (Fall 2024) Lab 1 Pruning: setup, the structure and point values of Q1–Q9, what fine-grained and channel pruning each teach, the limits of self-study (no official solutions, submission through Canvas), and the Fall 2026 switch to GPU Basics. No solutions included."
draft: false
glossary:
  - term: "fine-grained pruning"
    aliases: ["unstructured pruning"]
    definition: "Pruning individual weights: a 0/1 mask with the same shape as the weight tensor zeroes out unimportant weights. The tensor keeps its shape and just becomes sparse."
    context: "The first half of 6.5940 Lab 1 uses magnitude (|W|) as importance and kthvalue to find the threshold."
  - term: "channel pruning"
    definition: "Removing whole channels, so a convolution layer ends up with fewer output channels. The pruned weights stay dense, so ordinary hardware runs faster without special formats."
    context: "The second half of 6.5940 Lab 1 compares it with fine-grained pruning on model size, MACs, and latency."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-lab1-pruning)

> **Version note**: This post is based on the [Lab 1 Colab notebook](https://colab.research.google.com/drive/1Fagq3JQBzCizodyxpHKvWDzfCC7F1RWN) from [MIT 6.5940 Fall 2024](https://hanlab.mit.edu/courses/2024-fall-65940). I downloaded the raw notebook on 2026-09-30 and checked question numbers, points, and setup cell by cell. Access level **A3**: the notebook, pretrained weights, and dataset download are all public. What's missing is official solutions and grading feedback (submission goes through MIT Canvas). **This post contains no solutions.**

**Series**: previous [Lecture 4: per-layer pruning ratios, fine-tuning, and hardware support](/posts/ai/2026-09-30-mit-65940-pruning-ratio-system-support-en) | next [Lecture 5: number formats, K-means, and linear quantization](/posts/ai/2026-09-30-mit-65940-quantization-basics-en) | [Series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en)

[Lecture 3](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria-en) and [Lecture 4](/posts/ai/2026-09-30-mit-65940-pruning-ratio-system-support-en) turn pruning into a pipeline: pick a granularity, pick a criterion, set per-layer ratios, fine-tune, and check whether the hardware can use the result. Lab 1 walks the whole pipeline on a small model, and it deliberately compares the two extremes. One prunes as finely as possible (single weights); the other prunes as coarsely as possible (whole channels).

The notebook opens with five goals. The last two matter most: get a basic understanding of the performance gains from pruning (such as speedup), and understand the differences and trade-offs between the two approaches.

## Course video sources

Use the official course entry to check the lecture covered by this article; a directly embeddable public recording for this article has not been verified in this update.

Course and recording entries:

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

## When it runs and what you need

According to the [Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940), Lab 1 went out on September 17 (Lecture 4) and was due September 26 (Lecture 7), with the two quantization lectures in between. The collaboration policy: you may discuss answers, but each student hands in their own work and names who they collaborated with.

The notebook's setup does the following:

- `pip install torchprofile` (for counting MACs).
- Checks `torch.cuda.is_available()` and stops if there's no GPU, telling you to switch the Colab runtime to GPU.
- Downloads a VGG pretrained on CIFAR-10 (the same model as [Lab 0](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics-en)) from `hanlab18.mit.edu`. That URL still returned HTTP 200 when I tested it on 2026-09-30.
- Downloads CIFAR-10 with batch size 512.

The notebook says the model is about 35 MiB, and uses that as its opening point: classifying 32×32 images into 10 classes already takes a model this big, which is too heavy for phones and embedded devices.

## The nine questions

The notebook has 9 questions worth 100 points, in two sections plus a comparison:

| Q | Points | Section | What you do |
|---|---|---|---|
| Q1 | 10 | Fine-grained | Read per-layer weight histograms; describe common traits and how they help pruning |
| Q2 | 15 | Fine-grained | Implement `fine_grained_prune`: count zeros, use \|W\| as importance, find the threshold with `kthvalue`, build the mask |
| Q3 | 5 | Fine-grained | Set `target_sparsity` so the test tensor keeps exactly 10 nonzeros |
| Q4 | 15 | Fine-grained | Read the sensitivity scan curves: sparsity vs. accuracy, whether all layers are equally sensitive, which layer is most sensitive |
| Q5 | 10 | Fine-grained | Choose a sparsity for each layer from the sensitivity curves and per-layer parameter counts |
| Q6 | 10 | Channel | Implement `get_num_channels_to_keep` and `channel_prune` |
| Q7 | 15 | Channel | Implement input-channel importance by Frobenius norm and sort channels by it |
| Q8 | 10 | Channel | Explain why pruning 30% of channels cuts computation by about half, and why latency drops slightly less than computation |
| Q9 | 10 | Comparison | Pros and cons of each method; which one you'd pick to speed up a model on a smartphone, and why |

Only Q2, Q3, Q5, Q6, and Q7 involve code. The rest are short answers based on plots or numbers.

## First half: what fine-grained pruning teaches

### Q1–Q3: from weight distributions to a mask

The notebook plots a weight histogram for each layer, then moves to magnitude-based pruning. Its definition matches [Lecture 3](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria-en): importance is $|W|$. Given a target sparsity $s$, `kthvalue` finds the $(\#W \cdot s)$-th smallest importance as the threshold, and everything above it stays. The hints for Q2 break this into four steps and even name the PyTorch APIs to use.

Q3 is a quick check. You need the definition of sparsity ($\#\text{zeros} / \#W$) to find the ratio that leaves exactly 10 nonzeros.

### Q4–Q5: be AMC for a day

Next the notebook wraps the pruning function in `FineGrainedPruner`, which stores each layer's mask so it can be reapplied after weight updates to keep the model sparse.

The sensitivity scan is the procedure from page 16 of [Lecture 4](/posts/ai/2026-09-30-mit-65940-pruning-ratio-system-support-en): prune one layer at a time, sweep sparsity from 0.4 to 0.9 in steps of 0.1, and record accuracy. The notebook says the cell takes about 2 minutes.

Q5 is the question closest to real work. The notebook also plots the parameter count of each layer and asks you to combine both plots into a `sparsity_dict`, with a clear pass condition: **the pruned model must be 25% of the dense model's size, with validation accuracy above 92.5 after fine-tuning**. The hints are two sentences: layers with more parameters should get higher sparsity, and sensitive layers should get lower sparsity.

Then comes fine-tuning: 5 epochs of SGD (lr 0.01, momentum 0.9, weight decay 1e-4) with a cosine schedule, about 3 minutes by the notebook's estimate. This is Lecture 4's point in practice: you need fine-tuning to win the accuracy back.

## Second half: what channel pruning teaches

### Q6–Q7: prune naively, then learn to choose

The notebook states the selling point of channel pruning: removing whole channels speeds up inference on existing hardware such as GPUs. The pruned weights stay dense, and the output channel count becomes $(1 - \text{sparsity})$ times the original, so this section calls it the prune ratio instead.

Q6 starts with the crudest approach on purpose: prune every layer by 30% and keep the first channels. The notebook says the target is a 2x computation reduction and asks you to think about why 30% gets you roughly there. After running it, you'll see accuracy drop sharply.

Q7 sorts first. Importance is the Frobenius norm of the weights for each input channel; sort, then keep the top $k$. The notebook says sorting improves accuracy only slightly, and fine-tuning (again 5 epochs) does the real recovery.

### Q8: measure the real speedup

The final cells compare model size, MACs, and latency before and after pruning. Note the latency setup: the notebook moves the models to the **CPU** and uses one 1×3×32×32 dummy input, with 20 warm-up runs and 100 timed runs. Q8's two questions ask you to explain the numbers with Lecture 4's ideas, not to recite an answer.

## Q9: tie the two halves together

Q9.1 asks you to compare the methods on compression ratio, accuracy, latency, and hardware support (whether they need a specialized accelerator). Q9.2 asks which one you'd use on a smartphone. Neither involves code, but a good answer draws on EIE's pros and cons from Lecture 4 (page 80) and the motivation for M:N sparsity.

## Limits of self-study

- **No official solutions** and no public autograder. The sanity checks in the notebook (such as `test_fine_grained_prune` and the channel-sorting check) test function behavior only; nobody grades your short answers.
- Submission goes through [MIT Canvas](https://canvas.mit.edu/courses/28126), so outside learners get no grading feedback. Piazza is limited to enrolled students.
- The 92.5% bar in Q5 is your only objective checkpoint. For short answers, write against specific slide pages, then check whether you actually used the lecture's concepts.

## Fall 2026 comparison

The [Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) released Lab 1 with the same Lecture 4 (September 22), but it's `lab1_gpu_basics.zip`, a lab on GPUs and efficiency fundamentals with **no pruning**. The Fall 2026 lab list is GPU Basics, Quantization, NAS, Quantization, and LLM deployment on laptop. For pruning practice, this Fall 2024 notebook is the only official material.

## What to do after reading

1. Do Q1–Q5 first. Once Q5 passes, stop and put your `sparsity_dict` next to the sensitivity curves. Make sure you can justify every number.
2. After Q8, rerun the latency measurement on the GPU instead of the CPU (the measurement cell already moves the models back to CUDA at the end). Compare the two results, then answer Q9.2.
3. One thing you can do tonight: run only up to the sensitivity scan, screenshot the curves, mark the layer you think is most sensitive, and check it against Lecture 4's page 12 claim that the first layer is usually the sensitive one.

## Further reading

- The two lectures this lab uses: [Lecture 3](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria-en), [Lecture 4](/posts/ai/2026-09-30-mit-65940-pruning-ratio-system-support-en)
- PyTorch and CNN basics: [Reading CMU 11-785](/posts/ai/2026-08-22-cmu-11785-course-overview-en), [Reading MIT 6.7960](/posts/ai/2026-08-26-mit-67960-deep-learning-guide-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [MIT 6.5940 Fall 2024 Lab 1 Pruning (Colab notebook)](https://colab.research.google.com/drive/1Fagq3JQBzCizodyxpHKvWDzfCC7F1RWN) — questions, points, setup, pass conditions, fine-tuning and latency settings
- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940) — release and due dates, collaboration and late policy, Canvas submission
- [Lec04-Pruning-II.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/w5baiyci5cxl1ozpy6lsr/Lec04-Pruning-II.pdf?rlkey=6qxc1nz20isy9izwnqfebtukg&st=59gy1eal&dl=0) — sensitivity analysis procedure (page 16), EIE pros and cons (page 80)
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) — Lab 1 changed to GPU Basics, lab list
- [Han et al., Learning both Weights and Connections for Efficient Neural Networks (NeurIPS 2015)](https://arxiv.org/abs/1506.02626) — the magnitude-based pruning and sensitivity curves the notebook cites
- [torchprofile (GitHub)](https://github.com/zhijian-liu/torchprofile) — the package the notebook uses to count MACs
