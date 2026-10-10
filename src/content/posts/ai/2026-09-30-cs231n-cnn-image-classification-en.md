---
title: "CS231N L5: Image Classification with CNNs — From Hand-Crafted Features to Convolution and Pooling"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, deep-learning, cnn]
lang: en
series:
  name: "Reading Stanford CS231N"
  order: 6
tldr: "A two-layer network flattens a 32×32×3 image into a 3072-dimensional vector, and the spatial structure is gone. CS231N Lecture 5 answers with two layers. A convolution layer slides small filters across the image and reuses the same weights at every position. A pooling layer downsamples and has no learnable parameters. Both are translation equivariant. One formula gives every layer's output size: (W − K + 2P) / S + 1."
description: "A guide to Lecture 5 of Stanford CS231N (Spring 2026): the limits of linear classifiers and MLPs, color histograms and HOG as hand-crafted features, the path from LeNet to AlexNet to ViT, convolution layer shapes and parameter counts, padding, stride, receptive fields, pooling, and translation equivariance. Based on the 2026 lecture_5.pdf, the official Convolutional Networks notes, and the 2025 L5 recording."
draft: false
glossary:
  - term: "receptive field"
    definition: "The region of the input that one element of an output feature map depends on. Stacking L stride-1 convolutions with kernel size K gives a receptive field of 1 + L × (K − 1)."
    context: "CS231N L5 uses it to explain why networks need downsampling inside."
  - term: "translation equivariance"
    definition: "Translating the input and then applying convolution or pooling gives the same result as applying the operation first and then translating the output."
    context: "The CS231N L5 intuition: image features don't depend on where they appear in the image."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs231n-cnn-image-classification)

> **Source years**: slides are the [lecture_5.pdf](https://cs231n.stanford.edu/slides/2026/lecture_5.pdf) linked from the Spring 2026 schedule; the recording is the Spring 2025 [YouTube L5](https://www.youtube.com/watch?v=f3g1zGdxptI). The two may differ, and I flag differences below. This is post 6 of the [Reading Stanford CS231N](/posts/ai/2026-09-30-cs231n-course-overview-en) series and follows the [A1 guide](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet-en).

The first four lectures of [CS231N](https://cs231n.stanford.edu/) build a classification pipeline: linear classifiers, losses, optimization, two-layer networks, and backprop. Lecture 5 opens the second unit, "Perceiving and Understanding the Visual World." The [official schedule](https://cs231n.stanford.edu/schedule.html) lists three topics: history, higher-level representations and image features, and convolution and pooling.

The lecture answers one question: **images have spatial structure, so why can't the earlier models use it, and what operation can?**

Official materials used here:

- The 2026 slides, lecture_5.pdf, 107 pages (page numbers below are PDF pages)
- The official notes, [Convolutional Networks](https://cs231n.github.io/convolutional-networks/), listed on the schedule as this lecture's reading
- The Spring 2025 L5 recording. The 2025 schedule lists Justin Johnson as the lecturer

Access level is **A3**. Slides, notes, and a recording are public, but the 2026 recordings are on Canvas for enrolled students only.

One detail first. Every page footer of the 2026 slides reads "April 14, 2025," yet the admin slide on page 2 says A1 is due "Wednesday 4/16," which matches the 2026 schedule. I treat this deck as the version the 2026 schedule links to and don't infer how much it changed. Compared with the [2025 lecture_5.pdf](https://cs231n.stanford.edu/slides/2025/lecture_5.pdf), the section order is nearly identical. The 2025 deck adds one Bag of Words slide and an appendix of slides from earlier years.

## Course video sources

This article uses Spring 2026 materials. The public Spring 2025 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=f3g1zGdxptI
title: Stanford CS231N Spring 2025 Lecture 5: Image Classification with CNNs (YouTube)
```

Original videos: [Stanford CS231N Spring 2025 Lecture 5: Image Classification with CNNs (YouTube)](https://www.youtube.com/watch?v=f3g1zGdxptI)

Course and recording entries:

- [Stanford CS231N Spring 2025 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [Official course / lecture source](https://cs231n.stanford.edu/schedule.html)

## Start with the limits of linear classifiers

Pages 6–14 are a recap. Page 9 states the problem with linear classifiers from two viewpoints:

- **Visual**: they learn only one template per class.
- **Geometric**: they can only draw linear decision boundaries.

Two-layer networks fix expressiveness, but page 27 names a new problem. A 32×32×3 image has to be stretched into a 3072-dimensional vector before it can be multiplied by W1. **The spatial structure of the image is destroyed.** Neighboring pixels and far-apart pixels are treated exactly the same.

### Before CNNs: turn images into features first

Pages 21–25 cover the pre-ConvNet approach. Instead of feeding pixels into a linear classifier, first extract a feature representation, then train the classifier on the features. Two examples:

- **Color histogram**: count how often each color appears.
- **HOG (Histogram of Oriented Gradients)**: split the image into 8×8-pixel regions and quantize edge direction in each region into 9 bins. A 320×240 image becomes 40×30 bins, so the feature vector has 30 × 40 × 9 = 10,800 numbers.

Page 25 compares the two routes. With hand-crafted features, extraction is fixed and only the final classifier is trained. A ConvNet trains the whole path from pixels to scores. These two features are exactly what [A1](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet-en) Q4 Image Features asks you to implement.

## A bit of history: where CNNs came from, and what replaced them

Pages 28–40 give the context:

1. **LeNet, 1998** (LeCun, Bottou, Bengio, Haffner, "Gradient-based learning applied to document recognition") already had today's basic shape. Convolution and pooling extract features while respecting 2D structure, a few fully connected layers at the end predict scores, and the whole thing is trained end to end with backprop and gradient descent.
2. **[AlexNet](https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf), 2012** (Krizhevsky, Sutskever, Hinton).
3. **About 2012–2020**: ConvNets dominate every vision task. The slides show detection, segmentation, image captioning, and text-to-image generation. Page 37 says: "This class used to be focused on ConvNets!"
4. **2021 onward**: Transformers take over. First language in 2017 ("Attention is all you need"), then vision in 2021 (ViT, "An Image is Worth 16x16 Words"). The slide says "Wait until Lecture 8!", which is this series' [L8: Attention, Transformers, and ViT](/posts/ai/2026-09-30-cs231n-attention-transformers-vit-en).

That history explains why a 2026 course still spends a full lecture on convolution. It is the shared vocabulary for every later architecture, and convolution and pooling, which page 18 calls "image-specific operators," are still inside many models.

## The convolution layer: small filters sliding over the image

### From fully connected to convolution

Pages 45–46 redraw the fully connected layer. A 32×32×3 image is stretched to 3072×1 and multiplied by 10×3072 weights. Each output is a 3072-dimensional dot product between one row of W and the whole image.

A convolution layer keeps the image's shape (page 47). Take a 5×5×3 filter, slide it spatially over the image, and compute dot products. Each position yields one number: a 75-dimensional dot product between the filter and a 5×5×3 chunk of the image, plus a bias. One rule to remember: **filters always extend the full depth of the input** (page 49). A 3-channel input means a 3-deep filter.

Sliding a 5×5 filter over a 32×32 image gives a 28×28 **activation map**. Six filters give six maps, stacked into a 6×28×28 output, plus a 6-dimensional bias vector (pages 57–58). You can also read the output as a 28×28 grid with a 6-dimensional vector at each point.

Page 61 gives the general form:

| Tensor | Shape |
|---|---|
| Input (a batch) | N × C_in × H × W |
| Filters | C_out × C_in × K_h × K_w |
| Bias | C_out |
| Output | N × C_out × H' × W' |

A ConvNet is a stack of conv layers with activation functions in between (page 64 shows CONV→ReLU repeated, with channels going 3→6→10).

### What do filters learn?

Pages 65–68 line up three models:

- Linear classifier: one template per class.
- MLP: a bank of whole-image templates.
- First-layer conv filters: **local** image templates, often oriented edges and opposing colors. The example is AlexNet's first layer, 64 filters of size 3×11×11.
- Deeper conv layers are harder to visualize and tend to learn larger structures such as eyes and letters (visualization from Springenberg et al., ICLR 2015).

The official notes explain why this is cheap with parameter sharing. AlexNet's first layer has 55×55×96 = 290,400 neurons. If each had its own 11×11×3 weights plus a bias, that layer alone would need 105,705,600 parameters. Convolution assumes a feature useful at one position is useful at others, so all neurons in one activation map share the same weights.

## Output size, padding, stride, and receptive fields

### One formula

Pages 70–86 build it step by step. A 7×7 input with a 3×3 filter gives a 5×5 output; in general, W − K + 1. The problem: **feature maps shrink with every layer.** The fix is zero padding around the input. Add stride and you get:

```
output size = (W − K + 2P) / S + 1
```

A common setting is P = (K − 1) / 2, which keeps the output the same size as the input ("same" padding).

### Exercise: slides pages 87–92

Input 3×32×32, ten 5×5 filters, stride 1, pad 2:

- **Output size**: (32 + 2×2 − 5) / 1 + 1 = 32, so 10×32×32.
- **Learnable parameters**: each filter has 3×5×5 + 1 (bias) = 76, and ten filters give **760**.
- **Multiply-adds**: 10×32×32 = 10,240 outputs, each a dot product of two 3×5×5 tensors (75 elements), so 75 × 10,240 = **768,000**.

**What to do**: cover the answers and work all three yourself. Then change the input to 3×64×64 with stride 2 and redo them. If you get these right on paper, the conv layers in [A2](/posts/ai/2026-09-30-cs231n-a2-batchnorm-cnn-pytorch-rnn-en) Q3 are just this formula written as loops.

### Receptive fields: why downsample

Pages 79–82 introduce receptive fields. With kernel size K, each output element depends on a K×K region of the input. Each extra layer adds K − 1, so L layers give 1 + L × (K − 1). The slides warn you to keep "receptive field in the input" and "receptive field in the previous layer" apart.

The catch: for a large image you need many layers before each output can "see" the whole image. The fix is to **downsample inside the network**. Stride is the first tool. A 7×7 input with a 3×3 filter at stride 2 gives a 3×3 output.

### Common settings

The summary on page 93 is worth copying down:

- Small square filters (K_h = K_w)
- Channel counts in powers of 2: 32, 64, 128, 256
- K = 3, P = 1, S = 1: a regular 3×3 conv
- K = 5, P = 2, S = 1: a 5×5 conv
- K = 1, P = 0, S = 1: a 1×1 conv
- K = 3, P = 1, S = 2: downsample by 2

Pages 94–97 add that PyTorch's conv layer also has groups and dilation, which the lecture skips. Besides 2D convolution there are 1D (input C_in × W) and 3D (input C_in × H × W × D) versions. 3D convolution returns in [L10 on video understanding](/posts/ai/2026-09-30-cs231n-video-understanding-en).

## Pooling: another way to downsample

Pages 100–102. Pooling downsamples each 1×H×W plane on its own. Its hyperparameters are kernel size, stride, and the pooling function (max or average). The usual setting is max with K = 2 and S = 2, which halves the size: 64×224×224 becomes 64×112×112.

The slide's example is 2×2 max pooling with stride 2 on a 4×4 slice:

```
1 1 2 4
5 6 7 8     →    6 8
3 2 1 0          3 4
1 2 3 4
```

Output size is (H − K) / S + 1. Pooling has two properties: **invariance to small spatial shifts, and no learnable parameters.**

## Translation equivariance ties it together

Page 103 closes the lecture. Convolution and pooling both satisfy:

```
Conv(Translate(X)) = Translate(Conv(X))
```

Translate then convolve equals convolve then translate. The slide's intuition: **features of images don't depend on their location in the image.** A cat in the top-left corner and a cat in the bottom-right should be recognized by the same filters. A fully connected layer can't do this; a conv layer has it built in. That answers the opening question about using spatial structure.

The last slide previews the next lecture: CNN architectures.

## What this post can and can't confirm

Confirmed: the 2026 schedule's topics and reading, the 2026 slide content, the parameter-sharing example in the official notes, and the existence and lecturer of the 2025 L5 recording (per the 2025 schedule).

Not confirmed: who actually taught this lecture in 2026 (the lecturer column on the 2026 schedule is commented out) and what the 2026 class recording contains (Canvas only). The 2025 recording is a different term's lecture, and slide details may differ; the 2025 deck has the extra Bag of Words slide, for example.

Further reading on this site: [CMU 11-785's first CNN lecture](/posts/ai/2026-08-22-cmu-11785-09-cnn-one-en) derives convolution from scanning MLPs, a different route in. [CMU 07-280 Lecture 14](/posts/ai/2026-08-22-cmu-07280-lecture-14-computer-vision-cnns-en) is a gentler introduction to computer vision and CNNs.

Series navigation: previous [A1 guide: kNN, Softmax, Two-Layer Net, and Fully-Connected Nets](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet-en) | next [L6: Training CNNs and CNN Architectures](/posts/ai/2026-09-30-cs231n-training-cnns-architectures-en) | [series overview](/posts/ai/2026-09-30-cs231n-course-overview-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS231n: Deep Learning for Computer Vision (Spring 2026 course site)](https://cs231n.stanford.edu/)
- [CS231n Spring 2026 schedule](https://cs231n.stanford.edu/schedule.html)
- [Lecture 5: Image Classification with CNNs slides (as linked from the 2026 schedule)](https://cs231n.stanford.edu/slides/2026/lecture_5.pdf)
- [Lecture 5 slides (Spring 2025, for comparison)](https://cs231n.stanford.edu/slides/2025/lecture_5.pdf)
- [CS231n official notes: Convolutional Neural Networks](https://cs231n.github.io/convolutional-networks/)
- [Stanford CS231N Spring 2025 Lecture 5: Image Classification with CNNs (YouTube)](https://www.youtube.com/watch?v=f3g1zGdxptI)
- [Stanford CS231N Spring 2025 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [CS231n Spring 2025 schedule](https://cs231n.stanford.edu/2025/schedule.html)
- [Krizhevsky, Sutskever, Hinton 2012: ImageNet Classification with Deep Convolutional Neural Networks](https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf)
- [CS231n Assignment 2 (Spring 2026)](https://cs231n.github.io/assignments2026/assignment2/)
