---
title: "MIT 6.5940 L9 Knowledge Distillation: Teaching a Small Model Means Matching More Than Output Probabilities"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, knowledge-distillation, efficient-ml, ai-course, mit]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 11
tldr: "Lecture 9 of MIT 6.5940 (Fall 2024) has five parts: what knowledge distillation (KD) is and why temperature matters; six things a student can match (logits, weights, features, gradients, sparsity patterns, relations); self and online distillation, which drop the fixed large teacher; KD for detection, segmentation, GANs, NLP, and LLMs; and Network Augmentation, built for tiny models. Raising the temperature from T=1 to T=10 moves the teacher's cat-vs-dog output from 0.982/0.017 to 0.599/0.401. That shift is where KD starts passing on dark knowledge."
description: "A guide to MIT 6.5940 (Fall 2024) Lecture 9, Knowledge Distillation: Hinton KD and temperature softmax; matching logits, intermediate weights (FitNets), features (NST), attention maps, sparsity patterns, and relational information (FSP, RKD); Born-Again Networks, Deep Mutual Learning, and Be Your Own Teacher; KD for object detection and semantic segmentation; GAN Compression, MobileBERT, and Minitron; and why NetAug helps tiny models where data augmentation hurts."
draft: false
glossary:
  - term: "knowledge distillation"
    aliases: ["KD", "distillation"]
    definition: "Training a small student model with its usual label loss plus a term that matches a large teacher model's outputs (or intermediate representations), so the student inherits what the teacher learned."
    context: "The topic of MIT 6.5940 L9; the slides start from the definition in Hinton et al. 2014."
    links:
      - label: "Hinton et al., Distilling the Knowledge in a Neural Network"
        url: "https://arxiv.org/abs/1503.02531"
  - term: "softmax temperature"
    aliases: ["temperature"]
    definition: "Dividing logits by T before the softmax exponent. A larger T gives a smoother probability distribution, so the non-top classes become visible."
    context: "L9 slides 9–10; T=1 in ordinary training."
  - term: "Network Augmentation"
    aliases: ["NetAug"]
    definition: "While training a tiny model, widen it into larger models that contain it as a sub-model and add their loss as extra supervision. Only the tiny model is kept for inference, so there is no inference cost."
    context: "The last part of L9; Cai et al., ICLR 2022."
    links:
      - label: "Network Augmentation for Tiny Deep Learning"
        url: "https://arxiv.org/abs/2110.08890"
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-knowledge-distillation)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

This is part 11 of the [Reading MIT 6.5940](/posts/ai/2026-09-30-mit-65940-course-overview-en) series. It covers **Lecture 9: Knowledge Distillation** from the [Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940), taught by Song Han on October 3, 2024. Both materials are public:

- Slides: [Lec09-Knowledge-Distillation.pdf](https://www.dropbox.com/scl/fi/fjgnue7z3mi1ynxbd0y5k/Lec09-Knowledge-Distillation.pdf?rlkey=cup1qhlpx3vx0nrs7wuwj6m0d&st=jzhogqwp&dl=0) (84 pages; page numbers below are PDF pages)
- Video: [EfficientML.ai Lecture 9 - Knowledge Distillation](https://www.youtube.com/watch?v=Ubj3QXv4rjw)

The access grade from the [course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) is **A3, enough for self-study**, though this lecture has no lab. **Fall 2026 comparison**: as of 2026-09-30, the [Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) has released only L1–L6. This lecture is not up yet.

## Course video sources

Recording links have been checked against the official course page for the edition used by this article.

```youtube
url: https://www.youtube.com/watch?v=Ubj3QXv4rjw
title: EfficientML.ai Lecture 9 - Knowledge Distillation (YouTube)
```

Original videos: [EfficientML.ai Lecture 9 - Knowledge Distillation (YouTube)](https://www.youtube.com/watch?v=Ubj3QXv4rjw)

Course and recording entries:

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

## Why a course on efficiency covers distillation

The earlier tools in this course, pruning, quantization, and [NAS](/posts/ai/2026-09-30-mit-65940-nas-hardware-aware-en), all change the model itself: remove parameters, lower the bit width, or switch to a cheaper architecture. This lecture asks something else. Once the architecture is fixed and the model is small, **how do you train it better?**

Slides 3–4 lay out the gap. Cloud AI has 19.5 TFLOPS (fp32) of compute and 80GB of memory. Tiny AI has compute in the MFLOPs range and 256kB of memory. Only small networks such as MCUNet and MobileNetV2-Tiny fit on the latter. Slide 5 adds one observation: small models underfit large datasets. The slide compares training curves for ResNet50 and MobileNetV2-Tiny, then asks:

> "Can we help the training of tiny models with large models?"

The lecture plan on slide 2 gives five answers:

1. What is knowledge distillation
2. What to match
3. Self and online distillation
4. Distillation for different tasks
5. Network augmentation

## 1. What KD is: temperature makes the teacher reveal its second choice

Slide 6 shows the setup. The same input goes to the teacher (large) and the student (small). The student's loss has two terms: a classification loss against the label, and a distillation loss that matches the teacher's output. The source is [Hinton et al. (NeurIPS Workshops 2014)](https://arxiv.org/abs/1503.02531).

Slides 7–9 use a two-class example to show why the student should match probabilities and not only labels:

| | logits (cat, dog) | probabilities at T=1 | probabilities at T=10 |
|---|---|---|---|
| Teacher | 5, 1 | 0.982, 0.017 | 0.599, 0.401 |
| Student | 3, 2 | 0.731, 0.269 | — |

The student is less confident than the teacher. At T=1 the teacher's output is almost one-hot. "Dog" gets only 0.017, so the student learns little beyond the label. At T=10 the distribution flattens, and the information that "this image looks a bit like a dog" comes through. Slide 9 puts it this way:

> "A larger temperature smooths the output probability distribution."

<details>
<summary>Formal definition (slide 10)</summary>

The softmax turns logits zᵢ into class probabilities:

p(zᵢ, T) = exp(zᵢ / T) / Σⱼ exp(zⱼ / T), i, j = 0, 1, …, C − 1

C is the number of classes and T is the temperature, normally 1. KD aims to align the class probability distributions of teacher and student. Slide 13 gives two losses for matching logits: cross entropy −p_t log p_s, or the L2 loss E‖p_t − p_s‖² (the latter from [Ba and Caruana, NeurIPS 2014](https://arxiv.org/abs/1312.6184)).

</details>

## 2. What to match: six options

Slide 12 lists six things a teacher can pass to a student. This section is the core of the lecture:

| What to match | Intuition | Cited on the slides |
|---|---|---|
| 1. Output logits | Match the final probability distribution | Hinton et al.; Ba and Caruana (slide 13) |
| 2. Intermediate weights | On top of cross-entropy distillation, add an L2 loss between teacher and student weights; use a linear transform when shapes differ | [FitNets](https://arxiv.org/abs/1412.6550) (slide 16) |
| 3. Intermediate features | Feature distributions should match too, not just outputs; minimize the maximum mean discrepancy between feature maps | [Neuron Selectivity Transfer](https://arxiv.org/abs/1707.01219) (slide 18) |
| 4. Gradients (attention maps) | Define a CNN's "attention" as ∂L/∂x: a large value means a small perturbation at position (i, j) changes the output a lot; the student matches the teacher's attention maps | [Attention Transfer](https://arxiv.org/abs/1612.03928) (slides 20–22) |
| 5. Sparsity patterns | Which neurons output more than 0 after ReLU (ρ(x) = 1[x > 0]) should be similar for teacher and student | [Heo et al., AAAI 2019](https://arxiv.org/abs/1811.03233) (slide 24) |
| 6. Relational information | Match relations rather than individual outputs: between layers, or between samples | FSP, RKD (slides 26–28) |

Option 4 rests on an observation on slide 21: strong ImageNet models have similar attention maps. ResNet-34 (73%) and ResNet-101 (77.3%) look alike, while the weaker Network-In-Network (62%) looks quite different.

Option 6 comes in two forms:

- **Between layers** ([Yim et al., CVPR 2017](https://openaccess.thecvf.com/content_cvpr_2017/html/Yim_A_Gift_From_CVPR_2017_paper.html)): take the inner product of two layers' features to get a C_in × C_out matrix (the spatial dimensions drop out), and have the student's matrix match the teacher's. The teacher and student can therefore have different numbers of layers.
- **Between samples** ([Relational KD](https://arxiv.org/abs/1904.05068)): take features for n samples, compute all pairwise distances to get a vector ψ of length n(n−1)/2, and match the student's ψ to the teacher's. What transfers is which samples sit close together, not individual outputs.

## 3. Do you need a fixed large teacher?

Slide 31 states the usual KD assumption: the teacher is larger than the student and stays fixed. It then poses a discussion question. What is wrong with a fixed large teacher, and do you need one? The next three methods each relax that assumption.

**Self distillation: [Born-Again Networks](https://arxiv.org/abs/1805.04770)** (slides 32–33). The architectures are identical: T = S₁ = S₂ = … = Sₖ. The first generation trains on labels. Each later generation uses the previous one as its teacher while keeping the classification objective. The slides report accuracy T < S₁ < S₂ < … < Sₖ, and an ensemble of the generations does a little better still.

**Online distillation: [Deep Mutual Learning](https://arxiv.org/abs/1706.00384)** (slides 35–36). Two networks, the same or different, train together from scratch. Each one's loss is CrossEntropy(S(I), y) + KL(S(I), T(I)), so each is the other's teacher. In the table on slide 36, two ResNet-32s learning from each other on CIFAR-100 go from 68.99% to 71.19% and 70.75%.

**Both at once: [Be Your Own Teacher](https://arxiv.org/abs/1905.08094)** (slides 38–39). Split a ResNet into four sections by depth, attach a classifier after each, and distill the shallower classifiers from the deeper ones. The intuition is that later predictions are more reliable. At inference you keep only the classifier you need and drop the rest.

## 4. Distillation for different tasks

Beyond classification, the slides cover five kinds of task, each with its own complication:

- **Object detection: feature imitation** ([Chen et al., NeurIPS 2017](https://papers.nips.cc/paper_files/paper/2017/hash/e1e32e235eee1f970470a3a6658dfdd5-Abstract.html), slides 41–44). A 1×1 conv aligns shapes. Foreground and background get different weights to handle class imbalance. The teacher's prediction acts as an upper bound: once the student beats the teacher by some margin, that loss term goes to zero.
- **Object detection: localization distillation** ([Zheng et al., CVPR 2022](https://arxiv.org/abs/2102.12252), slides 45–48). Bounding-box regression becomes classification: each coordinate axis is split into bins (the slide draws 6), teacher and student each predict a distribution over them, and distillation acts on the distributions.
- **Semantic segmentation** ([Liu et al., CVPR 2019](https://openaccess.thecvf.com/content_CVPR_2019/html/Liu_Structured_Knowledge_Distillation_for_Semantic_Segmentation_CVPR_2019_paper.html), slides 49–50). On top of feature imitation, a discriminator is added and the student must fool it, which gives an adversarial loss.
- **GANs** ([GAN Compression](https://arxiv.org/abs/2003.08936), slides 51–54). On an NVIDIA Jetson Nano GPU, the original CycleGAN runs at 56.8G MACs, 1.6 FPS, and FID 24.2. The compressed model runs at 4.81G MACs (11.8× fewer), 3.9 FPS (2.5× faster), and FID 26.6 (lower is better).
- **NLP** ([MobileBERT](https://arxiv.org/abs/2004.02984), slides 55–56). Besides feature imitation, the student also imitates the teacher's attention maps.
- **LLMs/VLMs** (slides 57–58). The slides' view is that pruning plus distillation has become a common way to get small LLMs. They cite Meta's 2024 Llama 3.2 announcement and [Minitron (NeurIPS 2024)](https://arxiv.org/abs/2407.14679): prune first, then use KD during retraining.

## 5. Network Augmentation: tiny models need more capacity, not more regularization

The last section turns a common training habit around. Slides 60–66 review two families of anti-overfitting techniques: data augmentation (Cutout, Mixup, AutoAugment) and dropout (SpatialDropout, DropBlock).

Slides 67–69 show the contrast. These techniques help ResNet50 (4.1G MACs) on ImageNet but **hurt** MobileNetV2-Tiny (23.5M MACs). Slide 69 gives the reason: the tiny model lacks capacity. It already underfits, and more regularization only makes that worse.

[NetAug](https://arxiv.org/abs/2110.08890) (Cai et al., ICLR 2022, slides 70–80) does the opposite. During training it **widens** the tiny model into a larger model that contains it as a sub-model, which adds auxiliary supervision. Slide 75 quotes the paper's loss:

L_aug = L(W_base) + α · L([W_base, W_aug])

The first term is the tiny model's own loss. The second is its loss as part of the widened model. The paper puts the extra cost at 16.7% during training and zero at inference, because only the original tiny model is deployed.

Results on the slides:

- With NetAug, the tiny model (MobileNetV2-Tiny) improves in both training and validation accuracy. A large model like ResNet50 does not underfit to begin with, so NetAug makes its overfitting worse: training accuracy goes up and validation accuracy goes down (learning curves and captions on slides 76–77).
- NetAug and KD do not conflict and can be stacked (slide 78).
- For transfer learning, NetAug beats both KD and training for 4× the epochs, even though all three reach similar ImageNet accuracy (slide 79).
- On detection with YOLOv3 + MobileNetV2 w0.35, the figure marks 38% and 41% MACs savings on Pascal VOC and COCO (slide 80).

This section shares an idea with the two NAS lectures: a large network contains small ones that share its weights. OFA uses it to search architectures. NetAug uses it to help a small network train.

## Where to go from here

The summary on slide 81 restates the five parts and previews the next lecture, [L10 MCUNet](/posts/ai/2026-09-30-mit-65940-mcunet-tinyml-en): an algorithm-system co-design framework for running TinyML on microcontrollers.

If you want the essentials: the temperature example in part 1 (slides 7–10) and the six matching targets in part 2 (slides 12–28) are the core of KD. NetAug in part 5 (slides 67–80) is this course's own angle and directly answers why tiny models are hard to train.

If you came from [Lab 3](/posts/ai/2026-09-30-mit-65940-lab3-nas-en): the lab extracts subnets straight from the OFA super network with no retraining. This lecture offers another path: once the architecture is fixed, distillation or NetAug can still train it better.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940)
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940)
- [Lec09-Knowledge-Distillation.pdf (Fall 2024 slides)](https://www.dropbox.com/scl/fi/fjgnue7z3mi1ynxbd0y5k/Lec09-Knowledge-Distillation.pdf?rlkey=cup1qhlpx3vx0nrs7wuwj6m0d&st=jzhogqwp&dl=0)
- [EfficientML.ai Lecture 9 - Knowledge Distillation (YouTube)](https://www.youtube.com/watch?v=Ubj3QXv4rjw)
- [Hinton et al., Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531)
- [Ba and Caruana, Do Deep Nets Really Need to be Deep?](https://arxiv.org/abs/1312.6184)
- [Romero et al., FitNets (ICLR 2015)](https://arxiv.org/abs/1412.6550)
- [Huang and Wang, Like What You Like: Neuron Selectivity Transfer](https://arxiv.org/abs/1707.01219)
- [Zagoruyko and Komodakis, Attention Transfer (ICLR 2017)](https://arxiv.org/abs/1612.03928)
- [Heo et al., Distillation of Activation Boundaries (AAAI 2019)](https://arxiv.org/abs/1811.03233)
- [Yim et al., A Gift from Knowledge Distillation (CVPR 2017)](https://openaccess.thecvf.com/content_cvpr_2017/html/Yim_A_Gift_From_CVPR_2017_paper.html)
- [Park et al., Relational Knowledge Distillation](https://arxiv.org/abs/1904.05068)
- [Furlanello et al., Born-Again Neural Networks (ICML 2018)](https://arxiv.org/abs/1805.04770)
- [Zhang et al., Deep Mutual Learning (CVPR 2018)](https://arxiv.org/abs/1706.00384)
- [Zhang et al., Be Your Own Teacher (ICCV 2019)](https://arxiv.org/abs/1905.08094)
- [Chen et al., Learning Efficient Object Detection Models with Knowledge Distillation (NeurIPS 2017)](https://papers.nips.cc/paper_files/paper/2017/hash/e1e32e235eee1f970470a3a6658dfdd5-Abstract.html)
- [Zheng et al., Localization Distillation (CVPR 2022)](https://arxiv.org/abs/2102.12252)
- [Liu et al., Structured Knowledge Distillation for Semantic Segmentation (CVPR 2019)](https://openaccess.thecvf.com/content_CVPR_2019/html/Liu_Structured_Knowledge_Distillation_for_Semantic_Segmentation_CVPR_2019_paper.html)
- [Li et al., GAN Compression (CVPR 2020)](https://arxiv.org/abs/2003.08936)
- [Sun et al., MobileBERT (ACL 2020)](https://arxiv.org/abs/2004.02984)
- [Muralidharan et al., Compact Language Models via Pruning and Knowledge Distillation (Minitron, NeurIPS 2024)](https://arxiv.org/abs/2407.14679)
- [Cai et al., Network Augmentation for Tiny Deep Learning (ICLR 2022)](https://arxiv.org/abs/2110.08890)
- [Global AI/CS course map (A0–A3 grades)](/posts/learning/2026-08-21-global-ai-cs-course-map-en)
