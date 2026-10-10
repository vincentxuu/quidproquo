---
title: "CS231N L12: Self-Supervised Learning — Learning Good Representations Without Labels"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, self-supervised-learning, contrastive-learning, representation-learning]
lang: en
series:
  name: "Reading Stanford CS231N"
  order: 14
tldr: "CS231N Lecture 12 asks whether we can learn good representations without huge manually labeled datasets. The answer comes in three parts. First, pretext tasks that generate labels from image transformations: predicting rotation, solving jigsaw puzzles, inpainting, colorization, and MAE with a 75% mask ratio. Second, the more general contrastive learning: the InfoNCE loss, SimCLR with its large batches, MoCo, which decouples batch size from the number of negatives with a queue, and sequence-level CPC. Third, DINO, which needs no negatives: a student predicts the output of a momentum teacher, and centering plus sharpening prevent collapse. The core evaluation is linear probing: freeze the encoder and train only a linear classifier."
description: "A guide to Stanford CS231N Spring 2026 Lecture 12 (Self-Supervised Learning): the split between pretext and downstream tasks, rotation, relative position, jigsaw, inpainting, colorization, and video colorization, MAE, evaluation methods such as linear probing, contrastive learning and InfoNCE, SimCLR, MoCo v1/v2, CPC, and DINO's self-distillation. Slides from Spring 2026, recordings from Spring 2025, checked against the DINO paper."
draft: false
glossary:
  - term: "pretext task"
    definition: "A training task whose labels are generated from the data itself, such as predicting how far an image was rotated. What matters is not how well the model does on it, but how useful the features it forces are on downstream tasks."
    context: "The first family of self-supervised methods."
  - term: "linear probing"
    aliases: ["linear evaluation protocol"]
    definition: "Freeze a pretrained encoder, train only a linear layer on top, and use its performance to measure representation quality."
    context: "SimCLR, MAE, and DINO all use it as a main evaluation."
  - term: "InfoNCE"
    definition: "The contrastive loss: put one positive and N−1 negatives together as an N-way classification and ask the model to pick the positive. It is a lower bound on the mutual information between f(x) and f(x+)."
    context: "Introduced in the CPC paper (van den Oord et al. 2018); used by SimCLR and MoCo."
  - term: "momentum encoder"
    definition: "An encoder whose parameters are not updated by gradients but set to an exponential moving average (EMA) of another network's parameters."
    context: "MoCo uses it to encode keys; DINO uses it as the teacher."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs231n-self-supervised-learning)

> **Source years**: The slides are the Spring 2026 [Lecture 12 slides](https://cs231n.stanford.edu/slides/2026/lecture_12.pdf) from [CS231N](https://cs231n.stanford.edu/) (104 pages, cover date 2026-05-07). The recording is the [Spring 2025 Lecture 12](https://www.youtube.com/watch?v=4howBU7THbM) on YouTube (about 1 hour 14 minutes; the 2025 schedule lists Ehsan Adeli as lecturer). The 2026 recordings are on Canvas for enrolled students only, so the two years may differ.
>
> This is part 14 of the [Reading Stanford CS231N](/posts/ai/2026-09-30-cs231n-course-overview-en) series and the first lecture of the course's third unit, "Generative and Interactive Visual Intelligence."

The lecture starts from something the course already showed. In the 4096-dimensional features from AlexNet's last layer, nearest neighbors are semantically similar images, while nearest neighbors in pixel space are not. **Learned representations are useful, but they need a lot of labeled data.** Can we train such representations without huge manually labeled datasets?

## Course video sources

This article uses Spring 2026 materials. The public Spring 2025 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=4howBU7THbM
title: Stanford CS231N 2025 Lecture 12: Self-Supervised Learning (YouTube)
```

Original videos: [Stanford CS231N 2025 Lecture 12: Self-Supervised Learning (YouTube)](https://www.youtube.com/watch?v=4howBU7THbM)

Course and recording entries:

- [Stanford CS231N 2025 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [Official course / lecture source](https://cs231n.stanford.edu/schedule.html)

## The framework: pretext and downstream tasks

The slides split self-supervised learning into two stages:

1. **Pretext task**: a task defined from the data itself, with no manual annotation (arguably a form of unsupervised learning). Labels are generated automatically. Training yields an encoder
2. **Downstream task**: attach the encoder to the task you actually care about and train it with a small amount of labeled data (supervised or semi-supervised)

We usually don't care how well the pretext task goes. We care how useful the learned features are for downstream classification, detection, and segmentation.

**How to evaluate.** The slides list several angles: performance on the pretext task itself; representation quality, including the **linear evaluation protocol** (freeze the encoder, train a linear classifier), clustering, and t-SNE visualization; robustness and generalization to other datasets; computational efficiency; and transfer to downstream tasks.

The slides also zoom out: the same idea shows up in language modeling (GPT-4), speech synthesis (WaveNet), and robot learning.

## Part 1: labels from image transformations

| Pretext task | What the model does | Source (as cited on the slides) |
|---|---|---|
| Rotation prediction | Rotate the whole image by 0/90/180/270 degrees; 4-way classification | [Gidaris et al. 2018](https://arxiv.org/abs/1803.07728) |
| Relative patch location | Given two patches, predict where the second sits relative to the first | Doersch et al. 2015 |
| Jigsaw puzzles | Put shuffled patches back in order | Noroozi & Favaro 2016 |
| Inpainting | Remove a region and reconstruct the missing pixels with an encoder-decoder | [Pathak et al. 2016 (Context Encoders)](https://arxiv.org/abs/1604.07379) |
| Colorization | Predict color from grayscale; the split-brain autoencoder uses two sub-networks | Zhang et al. |
| Video colorization | Color the other frames to match a colored reference frame | Vondrick et al. 2018 |

A few details worth keeping:

- **The rotation hypothesis**: a model can recognize the correct rotation only if it has the "visual commonsense" of what the object should look like unperturbed. The evaluation freezes the first two conv layers on CIFAR-10 and trains the later layers on a subset of labels.
- **The inpainting loss is reconstruction plus an adversarial term**: the slides compare results side by side for reconstruction only, adversarial only, and both (adversarial learning is the topic of the [next lecture](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan-en)).
- **Tracking emerges from video colorization**: the task relies on colors staying consistent over time. The slides show that the learned attention can propagate segmentation masks across frames, even though nobody taught the model to track.

### MAE: push the mask ratio to 75%

[Masked Autoencoders](https://arxiv.org/abs/2111.06377) (He et al., 2021) are the representative reconstruction method:

- Split the image into non-overlapping patches as in ViT and uniformly mask a very large fraction (75%)
- **The encoder sees only the unmasked 25%**: linear projection, positional embeddings, Transformer blocks. Because its input is small, the encoder can be very large, with over 9× the computation per token of the decoder
- **The decoder** merges the encoder output with a shared mask token in the masked positions, adds positional encodings, runs Transformer blocks, and projects back to pixels
- The loss is MSE in pixel space, **computed only on masked patches**

A high mask ratio makes the task hard enough to be meaningful. The slides list MAE's long list of ablations: mask ratio, decoder depth and width, whether the encoder uses mask tokens, reconstruction target, data augmentation, mask sampling, and training schedule.

**The limitation of this part**: the learned representation may be tied to one specific pretext task. Is there a more general one?

## Part 2: contrastive learning

The more general idea: **different versions of the same object should have nearby representations, and different objects should be pushed apart** (attract and repel).

Formally, x is a reference sample, x⁺ a positive, and x⁻ a negative. Choose a score function and learn an encoder f that scores positive pairs (x, x⁺) high and negative pairs (x, x⁻) low.

<details>
<summary>The InfoNCE loss (standard form)</summary>

With one positive and N−1 negatives:

$$\mathcal{L} = -\mathbb{E}\left[\log \frac{\exp(s(f(x), f(x^+)))}{\exp(s(f(x), f(x^+))) + \sum_{j=1}^{N-1} \exp(s(f(x), f(x_j^-)))}\right]$$

This is an N-way cross-entropy: pick the positive out of N candidates. The slides' summary notes that it is a lower bound on the mutual information between f(x) and f(x⁺).

</details>

### SimCLR

[SimCLR](https://arxiv.org/abs/2002.05709) (Chen et al., 2020):

- Cosine similarity as the score function
- **Positives come from data augmentation**: augment the same image twice at random (random cropping, color distortion, blur) to get a positive pair; the other images in the batch are negatives
- A projection network g(·) sits on top of the features, and the contrastive loss is computed in the projected space

The slides add a note: **the assignment uses a slightly different SimCLR formulation, so follow the assignment instructions.**

Two key design choices:

- **A non-linear projection head helps.** The slides' possible explanation: the contrastive objective makes the representation invariant to augmentations, which may discard information useful downstream. The projection head lets the z space carry that invariance, so the h space before it keeps more information
- **Large batches are crucial.** But they have a large memory footprint during backprop, and the ImageNet experiments needed distributed training on TPUs (the subject of the [previous lecture](/posts/ai/2026-09-30-cs231n-distributed-training-en))

For evaluation, the slides show a linear classifier trained on frozen SimCLR features from ImageNet, and semi-supervised results from fine-tuning the encoder with only 1% or 10% of ImageNet labels.

### MoCo and MoCo v2

[MoCo](https://arxiv.org/abs/1911.05722) (He et al., 2020) removes SimCLR's dependence on huge batches. The key differences:

- Keep a **FIFO queue of keys** as negatives
- Compute gradients and update the encoder only through the queries; the key encoder gets no gradient and is updated by **momentum**
- As a result, minibatch size is decoupled from the number of negatives, so you can use many negatives

**MoCo v2** is a hybrid: the non-linear projection head and strong augmentation from SimCLR, plus MoCo's momentum-updated queue, which allows many negatives **without TPUs**. The slides' takeaway is that a non-linear projection head and strong data augmentation are crucial for contrastive learning.

### CPC: contrast at the sequence level

SimCLR and MoCo are **instance-level** methods (positives and negatives are different instances). [CPC](https://arxiv.org/abs/1807.03748) (Contrastive Predictive Coding, van den Oord et al., 2018) works at the **sequence level**:

- **Contrastive**: contrast the "right" sequence with "wrong" ones
- **Predictive**: predict future patterns from the current context
- **Coding**: first encode each sample in the sequence into a vector z_t

The slides show an audio example (linear classification on LibriSpeech) and an image example: split an image into patches, treat rows of patches as a top-to-bottom sequence, and use the upper rows to predict the lower ones. The summary slide's verdict: CPC applies to many problems, but it is less effective for image representations than instance-level methods.

## Part 3: DINO, self-distillation with no labels

The slides end with [DINO](https://arxiv.org/abs/2104.14294) (Caron et al., 2021, *Emerging Properties in Self-Supervised Vision Transformers*), which is also a suggested reading on the schedule. The slides are mostly figures, so the mechanism below follows the original paper:

- **Two networks, one architecture**: a student g_s and a teacher g_t. The student is updated with SGD. The teacher receives no gradient (stop-gradient); its parameters are an exponential moving average of the student's, which makes it a momentum encoder
- **Objective**: pass both outputs through a softmax to get probability distributions, and use cross-entropy to make the student match the teacher. The paper interprets this as knowledge distillation with no labels
- **Multi-crop**: each image yields 2 global views at 224² and several local views at 96². The student sees every view; the teacher sees only the global ones, which encourages local-to-global correspondence
- **Avoiding collapse**: DINO uses no negatives, only **centering** and **sharpening** of the teacher's output. The paper explains that centering stops one dimension from dominating but pushes toward a uniform output, while sharpening does the opposite; balancing the two, together with a momentum teacher, is enough to avoid collapse

<details>
<summary>The DINO paper's pseudocode skeleton (without multi-crop)</summary>

```python
# gs, gt: student and teacher networks
# C: center (K)
# tps, tpt: student and teacher temperatures
# l, m: network and center momentum rates
gt.params = gs.params
for x in loader:  # load a minibatch x with n samples
    x1, x2 = augment(x), augment(x)  # random views
    s1, s2 = gs(x1), gs(x2)  # student output n-by-K
    t1, t2 = gt(x1), gt(x2)  # teacher output n-by-K
    loss = H(t1, s2)/2 + H(t2, s1)/2
    loss.backward()  # back-propagate
    # student, teacher and center updates
    update(gs)  # SGD
    gt.params = l*gt.params + (1-l)*gs.params
    C = m*C + (1-m)*cat([t1, t2]).mean(dim=0)

def H(t, s):
    t = t.detach()  # stop gradient
    s = softmax(s / tps, dim=1)
    t = softmax((t - C) / tpt, dim=1)  # center + sharpen
    return - (t * log(s)).sum(dim=1).mean()
```

</details>

The paper's abstract lists two main findings: self-supervised ViT features explicitly contain the semantic segmentation of an image, which is much less clear in supervised ViTs and convnets; and these features are also excellent k-NN classifiers. It also stresses the importance of the momentum encoder, multi-crop training, and small patches. The last DINO slide is titled "DINO v2," but it is figures only, so this post does not describe it.

## How to study it

- **Get the pretext/downstream split straight before the methods.** For every new method, ask two things: where do the labels come from automatically, and how is the representation evaluated?
- **InfoNCE is just cross-entropy.** Think of it as a pick-1-of-N classification, and SimCLR, MoCo, and CPC differ only in where positives and negatives come from.
- **Do A3.** In the Spring 2026 assignment covered in the [A3 guide](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip-en), Q2 is Self-Supervised Learning (the starter code has a `simclr/` folder) and Q4 is CLIP & DINO. Remember the slides' warning that the assignment's SimCLR formulation differs slightly from the slides.
- **Gaps**: the schedule lists this lecture's topics as pretext tasks, contrastive learning, and multisensory supervision, but neither the 2026 nor the 2025 slide agenda has a separate multisensory section; the CPC audio example is the closest. For audio-visual self-supervision, go back to the audio-visual part of [L10](/posts/ai/2026-09-30-cs231n-video-understanding-en). The 2026 recording is not public.

## Further reading

- Contrastive learning extended to image-text pairs (CLIP): [L16: Vision and Language](/posts/ai/2026-09-30-cs231n-vision-language-en) in this series
- ViT and patch basics: [L8: Attention, Transformers, and ViT](/posts/ai/2026-09-30-cs231n-attention-transformers-vit-en) in this series
- Suggested reading from the schedule: [Lilian Weng's Self-Supervised Representation Learning](https://lilianweng.github.io/lil-log/2019/11/10/self-supervised-learning.html)

**Series navigation**: Previous: [L11: Large-Scale Distributed Training](/posts/ai/2026-09-30-cs231n-distributed-training-en) | Next: [L13: Generative Models I: VAEs, GANs, and Autoregressive Models](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan-en) | [Series overview](/posts/ai/2026-09-30-cs231n-course-overview-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS231N course homepage (Spring 2026)](https://cs231n.stanford.edu/)
- [CS231N Spring 2026 schedule](https://cs231n.stanford.edu/schedule.html)
- [Lecture 12: Self-Supervised Learning slides (Spring 2026, PDF)](https://cs231n.stanford.edu/slides/2026/lecture_12.pdf)
- [Lecture 12 slides (Spring 2025, PDF)](https://cs231n.stanford.edu/slides/2025/lecture_12.pdf)
- [CS231N Spring 2025 schedule](https://cs231n.stanford.edu/2025/schedule.html)
- [Stanford CS231N 2025 Lecture 12: Self-Supervised Learning (YouTube)](https://www.youtube.com/watch?v=4howBU7THbM)
- [Stanford CS231N 2025 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [CS231N Assignment 3 (Spring 2026)](https://cs231n.github.io/assignments2026/assignment3/)
- [Caron et al. (2021). Emerging Properties in Self-Supervised Vision Transformers (DINO)](https://arxiv.org/abs/2104.14294)
- [Meta AI blog: DINO and PAWS](https://ai.facebook.com/blog/dino-paws-computer-vision-with-self-supervised-transformers-and-10x-more-efficient-training)
- [Lilian Weng (2019). Self-Supervised Representation Learning](https://lilianweng.github.io/lil-log/2019/11/10/self-supervised-learning.html)
- [Gidaris et al. (2018). Unsupervised Representation Learning by Predicting Image Rotations](https://arxiv.org/abs/1803.07728)
- [Pathak et al. (2016). Context Encoders: Feature Learning by Inpainting](https://arxiv.org/abs/1604.07379)
- [He et al. (2021). Masked Autoencoders Are Scalable Vision Learners](https://arxiv.org/abs/2111.06377)
- [Chen et al. (2020). A Simple Framework for Contrastive Learning of Visual Representations (SimCLR)](https://arxiv.org/abs/2002.05709)
- [He et al. (2020). Momentum Contrast for Unsupervised Visual Representation Learning (MoCo)](https://arxiv.org/abs/1911.05722)
- [van den Oord et al. (2018). Representation Learning with Contrastive Predictive Coding](https://arxiv.org/abs/1807.03748)
