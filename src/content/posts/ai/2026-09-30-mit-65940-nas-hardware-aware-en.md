---
title: "MIT 6.5940 L8 NAS II: Scoring Architectures Without Training Them, and Putting Hardware in the Loop"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, neural-architecture-search, efficient-ml, ai-course, mit]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 9
tldr: "Lecture 8 of MIT 6.5940 (Fall 2024) attacks the most expensive step in NAS: evaluating candidates. Training 12,800 architectures from scratch cost 22,400 GPU-hours, so the lecture walks through inherited weights, hypernetworks, ProxylessNAS's single-path training, latency lookup tables and predictors, Once-for-All's one training run for 10^19 subnets, training-free zero-shot NAS, and NAAS, which searches the network and the accelerator together. This guide follows the 105-slide deck and cites a page for every claim."
description: "A guide to MIT 6.5940 (Fall 2024) Lecture 8, Neural Architecture Search Part II: accuracy estimation (train from scratch, inherit weights, hypernetworks), hardware-aware NAS (ProxylessNAS, why MACs are not latency, latency lookup tables and predictors, Once-for-All progressive shrinking), zero-shot NAS (Zen-NAS, GradSign), NAAS neural-accelerator co-search, and applications such as HAT, SPVNAS, Anycost GAN, and Flextron."
draft: false
glossary:
  - term: "Once-for-All network"
    aliases: ["OFA", "OFA network", "super network", "supernet"]
    definition: "A large network trained once so that it contains every candidate subnet; the subnets share its weights and can be extracted for a target device without retraining."
    context: "MIT 6.5940 L8, slides 40–73. The MCUNetV2 super network in Lab 3 is trained this way."
    links:
      - label: "Once-for-All (ICLR 2020)"
        url: "https://arxiv.org/abs/1908.09791"
  - term: "zero-shot NAS"
    definition: "Ranking architectures without training them, using a score computed at random initialization (for example sensitivity to input perturbation, or agreement of gradient signs) as a proxy for accuracy."
    context: "L8 uses Zen-NAS and GradSign as examples."
  - term: "latency lookup table"
    definition: "A table of per-operation latencies measured once on the target device; a candidate's latency is estimated by summing the table entries for its layers."
    context: "L8 slides 26–29, from ProxylessNAS."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-nas-hardware-aware)

This is part 9 of the [Reading MIT 6.5940](/posts/ai/2026-09-30-mit-65940-course-overview-en) series. It covers **Lecture 8: Neural Architecture Search (Part II)** from the [Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940), taught by Song Han on October 1, 2024. Both materials are public:

- Slides: [Lec08-Neural-Architecture-Search-II.pdf](https://www.dropbox.com/scl/fi/kaia5vvmdwb2bj0xnbihm/Lec08-Neural-Architecture-Search-II.pdf?rlkey=vkp9i12ljbk4jmdfp05j3ctdy&st=hincmob7&dl=0) (105 pages; page numbers below are PDF pages)
- Video: [EfficientML.ai Lecture 8 - Neural Architecture Search Part II](https://www.youtube.com/watch?v=5ty12mNV4Sg)

Using the access grades from the [course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en), Fall 2024 is **A3, enough for self-study**. **Fall 2026 comparison**: as of 2026-09-30, the [Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) has released only L1–L6, and the Lecture 8 slide and video links are still empty. This post uses Fall 2024 only.

## Course video sources

Recording links have been checked against the official course page for the edition used by this article.

```youtube
url: https://www.youtube.com/watch?v=5ty12mNV4Sg
title: EfficientML.ai Lecture 8 - Neural Architecture Search Part II (YouTube)
```

Original videos: [EfficientML.ai Lecture 8 - Neural Architecture Search Part II (YouTube)](https://www.youtube.com/watch?v=5ty12mNV4Sg)

Course and recording entries:

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

## Where the last lecture left off: how do you score a candidate?

The [previous post](/posts/ai/2026-09-30-mit-65940-nas-search-space-strategy-en) covered two parts of NAS: the search space (the set of candidate architectures) and the search strategy (how to move through it). Slide 5 adds the third part, the **accuracy estimation strategy**: given an architecture, how do you estimate its accuracy? The spine of this lecture is that estimation keeps getting cheaper:

| Stage | Approach | Cost |
|---|---|---|
| Train from scratch | Fully train every candidate | Highest |
| Inherit weights / hypernetwork | Borrow weights from another model or a generator | Saves part of training |
| Once-for-All | Train one big network, extract subnets directly | One training run; seconds per evaluation |
| Zero-shot | No training, just compute a score | One forward/backward pass |

The lecture plan on slide 3 follows the same order: accuracy estimation → hardware-aware NAS → zero-shot NAS → neural-hardware architecture co-search → NAS applications.

## 1. Estimating accuracy

### Training from scratch: too expensive beyond small datasets

Slide 7 cites [Zoph and Le (ICLR 2017)](https://arxiv.org/abs/1611.01578): 12,800 architectures trained on CIFAR-10, at a cost of 22,400 GPU-hours. Slide 8 then asks what happens on ImageNet or COCO. The answer is that you can't.

### Inheriting weights: don't start from zero every time

Slide 10 uses [Net2Net](https://arxiv.org/abs/1511.05641): a new architecture inherits weights from a parent model (Net2Wider widens it, Net2Deeper deepens it), which cuts training cost. Slide 11 goes one step further with [Cai et al. (AAAI 2018)](https://arxiv.org/abs/1707.04873). Instead of generating architectures, the controller generates **network transformation actions**, such as "make it wider" or "make it deeper," applied to an existing model.

### Hypernetworks: one network generates weights for others

[SMASH](https://arxiv.org/abs/1708.05344) (slide 13) works in three steps. At each training step, sample a random architecture from the search space. Let the hypernetwork generate weights for that architecture. Update the hypernetwork by gradient descent. After training, any candidate can get a set of weights for evaluation.

## 2. Hardware-aware NAS: put the target hardware in the loop

### Why search separately for each device

Slide 15 states the position plainly: one model for GPU, CPU, phone, and Raspberry Pi is inefficient; **specialized models** are efficient. The problem was cost, which pushed earlier NAS onto proxy tasks. Slide 16 gives two examples. NASNet needed 48,000 GPU hours, roughly five years on a single GPU, even on CIFAR. DARTS would need 100GB of GPU memory to search directly on ImageNet. So people searched on CIFAR-10, in smaller spaces, with fewer epochs, and used FLOPs and parameter counts as the efficiency metric. An architecture that wins on the proxy is not guaranteed to win on the real task and hardware.

### ProxylessNAS: keep only one path alive

[ProxylessNAS](https://arxiv.org/abs/1812.00332) (slides 17–19):

1. Build an over-parameterized network that holds every candidate path at each layer.
2. Reduce NAS to a single training run of that network.
3. Prune redundant paths based on architecture parameters.

The key is slide 18. Binarize the architecture parameters so that only one path's activations are in memory at a time. Memory drops from O(N) to O(1). That lets the search run directly on ImageNet, in a large space, with full training, and with measured latency instead of FLOPs as the efficiency signal (the comparison table on slide 19).

### MACs are not real latency

Slides 20–22 carry the idea from this lecture most worth keeping. The slides use measurements from [HAT](https://arxiv.org/abs/2005.14187):

- On an NVIDIA Titan Xp GPU, adding layers and widening the hidden dimension can reach similar FLOPs with very different latency (slide 21).
- Widening the hidden dimension has a large effect on Raspberry Pi ARM CPU latency and almost none on the GPU (slide 22).

The same MACs number means different latencies on different hardware. If you want the result to be fast on the target device, that device's latency has to be the feedback signal.

### Getting latency: measure, look up, or predict

[MnasNet](https://arxiv.org/abs/1807.11626) measured every candidate on a phone. Slides 23–24 call that slow and expensive. ProxylessNAS (slides 25–30) instead builds an `[architecture, latency]` dataset and fits a latency model, in one of two forms:

- **Layer-wise: a latency lookup table.** Measure each op's latency on the device once, store it, and sum the entries for a candidate's layers (slides 26–29).
- **Network-wise: a latency prediction model.** Predict latency from features of the whole architecture. Slides 31–32 use HAT as the example, with features such as layer count, embedding dim, hidden dim, and head count. On a Raspberry Pi ARM CPU, predicted and measured latency fall almost exactly on the y=x line.

Slide 33 reports the payoff: the model specialized for mobile is 1.83x faster than the non-specialized one, and the gap is larger on GPU.

### Once-for-All: train once, extract one per device

Even if each search trains only one big network, costs add up as devices multiply. Slides 37–39 illustrate this with a MnasNet-style search-train-retrain loop: design cost grows from 40K GPU hours to 160K, then to 1600K when repeated for many devices.

[Once-for-All (OFA)](https://arxiv.org/abs/1908.09791) (slides 40–73) replaces the loop:

1. Train a once-for-all network whose subnets are sparsely activated parts of it.
2. At deployment time, pick a subnet and get its accuracy and latency.
3. Repeat step 2 and keep the best.

Slide 40 puts the two flows side by side. The old flow trains once per piece of feedback (about a day each); OFA evaluates an extracted subnet in seconds. Slide 46 says one OFA network holds about 10^19 subnets that share weights and are trained jointly, which amortizes the training cost. Slide 43 extends the target list down to three microcontrollers: STM32H743 (512kB SRAM / 2MB Flash), STM32F746 (320kB / 1MB), and STM32F412 (256kB / 1MB).

<details>
<summary>Progressive shrinking: training 10^19 subnets together without them fighting (slides 47–71)</summary>

OFA trains large-to-small, opening up four elastic dimensions one at a time:

| Dimension | How |
|---|---|
| Resolution | Sample a random input image size for each batch |
| Kernel size | Start with the full 7×7; a smaller kernel takes the centered weights and multiplies them by a transformation matrix (the slides show 25×25 and 9×9) |
| Depth | Train at full depth, then gradually allow later layers in each unit to be skipped |
| Width | Train at full width, then shrink gradually; before shrinking, sort channels by importance and keep the most important ones |

</details>

Slide 72 adds a hardware observation. On Xilinx ZU9EG and ZU3EG FPGAs, OFA-designed models have higher arithmetic intensity (Ops/Byte), so they are less memory-bound and reach higher utilization and GOPS/s without changing the RTL. This connects to the efficiency metrics in [part 1](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics-en) and to the peak-memory constraints in [Lab 3](/posts/ai/2026-09-30-mit-65940-lab3-nas-en).

## 3. Zero-shot NAS: skip training entirely

Slide 75 states the goal: estimate accuracy by analyzing the architecture, without training it. The slides give two methods.

**[Zen-NAS](https://arxiv.org/abs/2102.01063)** (slide 76):

1. Draw a random input x ~ N(0,1) and perturb it to get x′ = x + ε.
2. Initialize all network weights from N(0,1).
3. Compute z₁ = log‖f(x′) − f(x)‖. The intuition: a good model should be sensitive to input perturbations.
4. Add a batch-normalization variance term z₂ over the layers. The Zen score is z₁ + z₂.

**[GradSign](https://arxiv.org/abs/2110.08616)** (slide 77) starts from the intuition that a good model has denser sample-wise local minima, so gradients from different samples are more likely to share the same sign at initialization. That sign-agreement statistic becomes the score.

The slides do not state how well zero-shot scores correlate with trained accuracy, and this post doesn't fill that in.

## 4. Searching the network and the accelerator together: NAAS

Everything so far fixes the hardware and searches the model. [NAAS](https://arxiv.org/abs/2105.13258), starting on slide 79, puts the accelerator into the search space too. Slide 80 lays out three layers:

| Layer | Searchable dimensions |
|---|---|
| Accelerator | local buffer size, global buffer size, #PEs, compute array size, PE connectivity |
| Compiler (mapping) | loop order, loop tiling size, dataflow |
| Neural network | #layers, #channels, kernel size, bypass, input/weight quantization precision |

Slide 81's claim: searching both in one optimization loop gives better-matched solutions.

There is a practical snag (slides 84–89). Parameters like loop order aren't numbers. Index-based encoding (`CRXKYS` as 0, `CXYRSK` as 1) is meaningless: adding or subtracting one from an index carries no physical information. NAAS uses **importance-based encoding** instead. Fix each dimension's position in the vector, let the optimizer assign each dimension a numerical importance, and sort by importance in decreasing order to get the loop order (or take the top two as the parallel dimensions).

Results (slides 91–92): compared with searching architectural sizing only, also searching connectivity and mapping gives considerably larger EDP (energy-delay product) reductions. NAAS plus OFA beats the baseline human design by +2.7% accuracy with 4.4x lower EDP. Slide 92 also notes that the dataflow NAAS found parallelizes output height and output channel, which is very different from the human design.

## 5. Applications: the OFA idea in other domains

Slides 94–101 are a tour, one slide per example:

- **NLP**: [HAT](https://arxiv.org/abs/2005.14187). Slide 94: for WMT'14 En-Fr on a Raspberry Pi, compared with the Evolved Transformer, 2.7x faster, 3.7x smaller, 3.2x fewer FLOPs, 10,148x lower search cost, and 0.1 higher BLEU.
- **Point clouds**: [SPVNAS](https://arxiv.org/abs/2007.16100). Slide 96: MinkowskiNet at 3.4 FPS versus SPVNAS at 9.1 FPS.
- **GANs**: [Anycost GAN](https://arxiv.org/abs/2103.03243). Train once; use a small subnet for fast previews and a large one for the final high-quality result, aimed at interactive editing on an iPad (slide 97).
- **Pose estimation**: [Lite Pose](https://arxiv.org/abs/2205.01271), on-device pose estimation via hardware-aware NAS (slide 98).
- **Quantum circuits**: [QuantumNAS](https://arxiv.org/abs/2107.10845). Slide 100: quantum noise drops accuracy from 87% to 47%. The approach trains a "super circuit," searches for a noise-robust sub-circuit, and prunes small-magnitude gates. The topic returns in Lecture 23.
- **LLMs**: [Flextron](https://arxiv.org/abs/2406.10260) (ICML 2024). Same model, same weights; at inference a router picks how much of the MLP and attention to use for a latency target. Converting a trained LLM means ranking heads and channels, grouping them, and training the router (slide 101).

## Where to go next

Slide 102 summarizes five items: performance estimation in NAS, hardware-aware NAS, zero-shot NAS, neural-hardware architecture search, and NAS applications.

These ideas land immediately in **[Lab 3](/posts/ai/2026-09-30-mit-65940-lab3-nas-en)**. You get an OFA-trained MCUNetV2 super network, implement an efficiency predictor (MACs and peak memory) and an accuracy predictor, and write random and evolutionary search. The next lecture, **[L9 Knowledge Distillation](/posts/ai/2026-09-30-mit-65940-knowledge-distillation-en)**, turns to a different question: once the architecture is fixed, how do you train a small model better?

If you have one hour: watch the ProxylessNAS-to-OFA stretch of the video (slides 16–73), which is what Lab 3 uses directly. Zero-shot NAS and NAAS can wait.

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940)
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940)
- [Lec08-Neural-Architecture-Search-II.pdf (Fall 2024 slides)](https://www.dropbox.com/scl/fi/kaia5vvmdwb2bj0xnbihm/Lec08-Neural-Architecture-Search-II.pdf?rlkey=vkp9i12ljbk4jmdfp05j3ctdy&st=hincmob7&dl=0)
- [EfficientML.ai Lecture 8 - Neural Architecture Search Part II (YouTube)](https://www.youtube.com/watch?v=5ty12mNV4Sg)
- [Zoph and Le, Neural Architecture Search with Reinforcement Learning (ICLR 2017)](https://arxiv.org/abs/1611.01578)
- [Chen et al., Net2Net (ICLR 2016)](https://arxiv.org/abs/1511.05641)
- [Cai et al., Efficient Architecture Search by Network Transformation (AAAI 2018)](https://arxiv.org/abs/1707.04873)
- [Brock et al., SMASH (ICLR 2018)](https://arxiv.org/abs/1708.05344)
- [Cai et al., ProxylessNAS (ICLR 2019)](https://arxiv.org/abs/1812.00332)
- [Tan et al., MnasNet (CVPR 2019)](https://arxiv.org/abs/1807.11626)
- [Wang et al., HAT (ACL 2020)](https://arxiv.org/abs/2005.14187)
- [Cai et al., Once-for-All (ICLR 2020)](https://arxiv.org/abs/1908.09791)
- [Lin et al., Zen-NAS (ICCV 2021)](https://arxiv.org/abs/2102.01063)
- [Zhang and Jia, GradSign (ICLR 2022)](https://arxiv.org/abs/2110.08616)
- [Lin et al., NAAS (DAC 2021)](https://arxiv.org/abs/2105.13258)
- [Tang et al., SPVNAS (ECCV 2020)](https://arxiv.org/abs/2007.16100)
- [Lin et al., Anycost GANs (CVPR 2021)](https://arxiv.org/abs/2103.03243)
- [Wang et al., Lite Pose (CVPR 2022)](https://arxiv.org/abs/2205.01271)
- [Wang et al., QuantumNAS (HPCA 2022)](https://arxiv.org/abs/2107.10845)
- [Cai et al., Flextron (ICML 2024)](https://arxiv.org/abs/2406.10260)
- [Global AI/CS course map (A0–A3 grades)](/posts/learning/2026-08-21-global-ai-cs-course-map-en)
