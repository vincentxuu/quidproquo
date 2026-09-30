---
title: "CS231N L6: Training CNNs and CNN Architectures — Normalization, Initialization, Transfer Learning, and VGG to ResNet"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, deep-learning, cnn, transfer-learning]
lang: en
series:
  name: "Reading Stanford CS231N"
  order: 7
tldr: "The 2026 slides for CS231N Lecture 6 are titled \"Training CNNs and CNN Architectures\" and split into how to build and how to train. Only two architectures get case studies. VGG shows that three 3×3 convs are deeper and cheaper than one 7×7. ResNet lets layers learn the residual F(x) = H(x) − x, which fixes an optimization problem where deeper plain nets had worse training error. The most practical takeaway is transfer learning: with fewer than about a million images, start from a model pretrained on a large dataset."
description: "A guide to Lecture 6 of Stanford CS231N (Spring 2026): CNN components (normalization layers, dropout, activation functions), ILSVRC winners and the VGG and ResNet case studies, Kaiming initialization, image preprocessing, data augmentation and Cutout, the four-cell transfer learning table, and a seven-step hyperparameter recipe. Based on the 2026 lecture_6.pdf, the AlexNet, VGG, GoogLeNet, and ResNet papers on the schedule, the official notes, and the 2025 L6 recording."
draft: false
glossary:
  - term: "residual connection"
    aliases: ["skip connection"]
    definition: "Makes a block's output F(x) + x, so the layers only learn the difference (residual) between input and target. When F(x) = 0, the block is an identity mapping."
    context: "CS231N L6 uses ResNet to show why adding shortcuts makes a 152-layer network easier to train than a 20-layer plain one."
  - term: "transfer learning"
    definition: "Train a model on a large dataset first, then reuse its weights for a new task on a small dataset, retraining only the last layers or fine-tuning the whole network."
    context: "CS231N L6 advice: with fewer than about a million images, pretrain on a similar large dataset and transfer."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs231n-training-cnns-architectures)

> **Source years**: slides are the Spring 2026 [lecture_6.pdf](https://cs231n.stanford.edu/slides/2026/lecture_6.pdf); the recording is the Spring 2025 [YouTube L6](https://www.youtube.com/watch?v=aVJy4O5TOk8). The two may differ, and I flag differences below. This is post 7 of the [Reading Stanford CS231N](/posts/ai/2026-09-30-cs231n-course-overview-en) series and follows [L5: Image Classification with CNNs](/posts/ai/2026-09-30-cs231n-cnn-image-classification-en).

The [previous lecture](/posts/ai/2026-09-30-cs231n-cnn-image-classification-en) handed us two building blocks, convolution and pooling. This one answers the next two questions: **how do you stack them, and once stacked, how do you train them?**

The [official schedule](https://cs231n.stanford.edu/schedule.html) calls this lecture "CNN Architectures" and lists Batch Normalization, Transfer learning, and AlexNet/VGG/ResNet, with four papers: [AlexNet](https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf), [VGGNet](https://arxiv.org/abs/1409.1556), [GoogLeNet](https://arxiv.org/abs/1409.4842), and [ResNet](https://arxiv.org/abs/1512.03385). The 2026 deck the schedule links to has a different cover title, **"Training CNNs and CNN Architectures,"** and covers more ground than the schedule suggests.

Official materials used here:

- The 2026 slides, lecture_6.pdf, 98 pages, footer dated April 16, 2026 (page numbers below are PDF pages)
- The four papers on the schedule
- The case studies in the official [Convolutional Networks](https://cs231n.github.io/convolutional-networks/) notes, and the Batch Normalization paragraph in [Neural Networks Part 2](https://cs231n.github.io/neural-networks-2/)
- The Spring 2025 L6 recording. The 2025 schedule lists Zane Durante as the lecturer

Access level is **A3**. The 2026 class recordings are on Canvas only.

First, one mismatch with the schedule: **the 2026 slides have no dedicated BatchNorm section.** The normalization example is LayerNorm. BatchNorm appears only in a figure on page 13 comparing four normalization schemes, captioned "You will implement some of these in assignment 2!" Implementing BatchNorm is left to [A2](/posts/ai/2026-09-30-cs231n-a2-batchnorm-cnn-pytorch-rnn-en) Q1. The [2025 lecture_6.pdf](https://cs231n.stanford.edu/slides/2025/lecture_6.pdf) has almost the same sections as the 2026 deck, so the 2025 recording likely follows this structure, but I did not check the video minute by minute.

## Map of the lecture

Page 4 splits the lecture into two groups:

| How to build CNNs | How to train CNNs |
|---|---|
| Layers in CNNs | Weight initialization |
| Activation functions | Data preprocessing |
| CNN architectures | Data augmentation |
| | Transfer learning |
| | Hyperparameter selection |

The summary on page 97 says "We reviewed 8 topics at a high level." It's a survey lecture that hits the key points of each topic.

## Building: CNN components

### Normalization layers

Page 9 lists the components of a CNN: conv layers, pooling layers, fully connected layers, plus normalization layers, dropout (sometimes), and activation functions.

The idea behind normalization layers (page 11): **learn parameters that let the model scale and shift the input data.** Two steps: normalize, then scale and shift with learned parameters.

The example is LayerNorm (Ba, Kiros, Hinton 2016). Input x has shape N × D. The mean and standard deviation μ, σ have shape N × 1, one pair per sample. The learned γ and β have shape 1 × D and apply to every sample:

```
y = γ (x − μ) / σ + β
```

Page 13 reuses the figure from Wu and He's "Group Normalization" (ECCV 2018), which compares which dimensions Batch Norm, Layer Norm, Instance Norm, and Group Norm compute statistics over.

Since the schedule lists BatchNorm, here is what the official notes say. BatchNorm, from Ioffe and Szegedy, forces activations throughout the network toward a unit Gaussian at the start of training. It usually goes right after fully connected or conv layers and before the nonlinearity. The notes say networks with BatchNorm are "significantly more robust to bad initialization" and describe it as preprocessing at every layer, built into the network in a differentiable way.

### Dropout

Pages 16–20. On each forward pass, randomly set some neurons to zero. The drop probability is a hyperparameter, and **0.5 is common**.

Why would that help? The slides give two explanations:

1. It forces the network to learn a **redundant representation** and prevents co-adaptation of features. In the cat example, some features like "has an ear," "has a tail," and "is furry" get dropped, and the network still has to decide.
2. Dropout trains a **large ensemble of models that share parameters**. Each binary mask is one model. An FC layer with 4096 units has 2^4096 possible masks.

At test time every neuron is on, so activations are scaled so that each neuron's test output equals its expected training output. Page 20 sums it up: drop at train time, scale at test time.

### Activation functions

Pages 24–31.

- **Sigmoid**: squashes values into [0, 1] and was historically popular as a neuron's saturating "firing rate." The key problem is that the gradient is nearly zero for large positive or negative inputs. Stack many sigmoids and gradients keep shrinking.
- **ReLU**: f(x) = max(0, x). Doesn't saturate in the positive region, is cheap, and in practice converges much faster than sigmoid (the slide cites "e.g. 6x" from the AlexNet paper). Downsides: outputs aren't zero-centered, and "dead ReLUs" appear when x < 0.
- **GELU** (Hendrycks et al. 2016): f(x) = x·Φ(x). Smooth around 0, which helps training in practice. It costs more than ReLU, and large negative values can still have gradients near 0.

Where do activations go? Page 31: generally after linear operators, such as fully connected and conv layers.

## Building: architecture history through ILSVRC winners

Pages 33 and 45 show the classic chart of top-5 error for ImageNet Large Scale Visual Recognition Challenge (ILSVRC) winners.

| Year | Model | Top-5 error (%) | Layers |
|---|---|---|---|
| 2010 | Lin et al. | 28.2 | shallow |
| 2011 | Sanchez & Perronnin | 25.8 | shallow |
| 2012 | AlexNet | 16.4 | 8 |
| 2013 | ZFNet (Zeiler & Fergus) | 11.7 | 8 |
| 2014 | VGG | 7.3 | 19 |
| 2014 | GoogLeNet | 6.7 | 22 |
| 2015 | ResNet | 3.6 | 152 |
| 2016 | Shao et al. | 3 | 152 |
| 2017 | SENet | 2.3 | 152 |

The chart also marks human performance at 5.1 (Russakovsky et al.) and boxes everything from 2015 on as the "Revolution of Depth."

The 2026 slides give case studies only for **VGG** and **ResNet**. AlexNet and GoogLeNet appear only in this chart and the comparison figures. The official notes fill the gap. AlexNet won in 2012 with 16% top-5 error against 26% for the runner-up. It resembled LeNet but was deeper and bigger, and it stacked conv layers directly on each other. GoogLeNet won in 2014. Its main contribution was the Inception module, which cut parameters from AlexNet's 60M to 4M, and it replaced the top fully connected layers with average pooling.

### VGG: small filters, deeper networks

Pages 36–44. VGG (Simonyan and Zisserman 2014) has a simple rule: **only 3×3 conv with stride 1 and pad 1, and 2×2 max pooling with stride 2.** Depth goes from AlexNet's 8 layers to 16–19 (VGG16, VGG19). The slides note ZFNet at 11.7% in ILSVRC'13 and VGG at 7.3% in ILSVRC'14.

Why small filters? The slides ask: what is the effective receptive field of three stacked 3×3 convs at stride 1? **7×7**, the same as one 7×7 conv. But three 3×3 layers are:

- Deeper, with more nonlinearities
- Cheaper: with C channels per layer, 3 × (3²C²) = 27C² parameters versus 7²C² = 49C²

You can check this with the receptive field formula from [L5](/posts/ai/2026-09-30-cs231n-cnn-image-classification-en): 1 + 3 × (3 − 1) = 7.

The official notes add VGG's cost. A forward pass takes about 93MB of memory per image (24M activations × 4 bytes, roughly double for the backward pass). Total parameters are about 138M, mostly in the final fully connected layers; the first FC layer alone holds about 100M.

### ResNet: let the layers learn a residual

Pages 46–58 are the most important part of the lecture. The question: **what happens if you keep stacking layers on a "plain" conv net?**

The slide's plot: a 56-layer network has **worse training and test error than a 20-layer one.** Training error is worse too, so this isn't overfitting.

The argument goes like this:

1. Fact: deeper models have more representational power (more parameters) than shallower ones.
2. Hypothesis: the problem is optimization. Deeper models are harder to optimize.
3. A deeper model should do at least as well as a shallower one. One solution by construction: copy the shallower model's learned layers and set the extra layers to **identity**.
4. So instead of having layers fit the desired mapping H(x) directly, have them fit the **residual** F(x) = H(x) − x, and output H(x) = F(x) + x. When F(x) = 0, the block is an identity mapping.

The full ResNet:

- Stack residual blocks, each with two 3×3 conv layers
- Periodically double the number of filters and downsample spatially with stride 2 (divide each dimension by 2)
- An extra conv layer at the start as a stem (7×7 conv, 64, /2)
- Total depths of 18, 34, 50, 101, or 152 layers on ImageNet

Results: the 152-layer model won ILSVRC'15 classification with 3.57% top-5 error and swept all classification and detection competitions at ILSVRC'15 and COCO'15.

The official notes also say ResNet uses BatchNorm heavily and has no fully connected layers at the end.

**What to do**: take the VGG16 and ResNet diagrams and track only where spatial size halves and where channel count doubles. Write down each stage's output shape on paper. That shows the difference between the two designs better than memorizing layer counts.

## Training: initialization, preprocessing, and regularization

### Weight initialization

Pages 60–66 run an experiment on a 6-layer net with hidden size 4096:

- Weights too small: activations in deeper layers all go to zero.
- Raise the initial weight std from 0.01 to 0.05: activations blow up fast.

The right scale depends on layer width. The slides' fix is **Kaiming/MSRA initialization** (He et al., ICCV 2015), with a ReLU correction: std = sqrt(2 / D_in). Activations then stay nicely scaled in every layer.

### Image preprocessing

Page 68's TLDR: subtract the per-channel mean and divide by the per-channel std. Almost all modern models do this. Statistics are per channel, so RGB means 3 numbers, precomputed on your dataset.

### A common pattern in regularization

Pages 70–76. Regularization shares a pattern: **add randomness at training time, average it out at test time** (sometimes approximately). Dropout is one example; data augmentation is another:

- Horizontal flips
- Random crops and scales. ResNet's recipe: pick a random L in [256, 480], resize the short side to L, and sample a random 224×224 patch. At test time, resize to 5 scales {224, 256, 384, 480, 640}, take ten 224×224 crops at each (4 corners plus center, plus flips), and average.
- Color jitter: randomize contrast and brightness.
- **Cutout** (DeVries and Taylor 2017): set random image regions to zero during training and use the full image at test time. The slides say it works very well on small datasets like CIFAR and is less common on large ones like ImageNet.

## Training: transfer learning

Pages 78–87 answer a practical question: **can you still train a CNN without much data?**

The slides first cite two 2014 papers, Donahue et al.'s DeCAF and Razavian et al.'s "CNN Features Off-the-Shelf," to show that features from an ImageNet-trained CNN are useful on their own. L2 nearest neighbors in AlexNet's feature space return semantically similar images.

Three scenarios:

1. Train on ImageNet (or internet-scale data).
2. **Small dataset (C classes)**: replace the final FC-1000 with a freshly initialized FC-C, train only that layer, and freeze the rest.
3. **Bigger dataset**: initialize from the pretrained model and fine-tune everything. The more data you have, the more layers are worth training.

The four-cell table on page 86:

| | Very similar dataset | Very different dataset |
|---|---|---|
| **Very little data** | Linear classifier on the final layer | Try another pretrained model, or collect more data |
| **Quite a lot of data** | Fine-tune all layers | Fine-tune all layers, or train from scratch |

Page 87 is advice for projects: **if your dataset has fewer than about a million images, find a very large dataset with similar data, train a big model there, then transfer to your dataset.** Frameworks provide "Model Zoos" of pretrained models; the slides list [PyTorch vision](https://github.com/pytorch/vision) and [pytorch-image-models](https://github.com/huggingface/pytorch-image-models).

## Training: seven steps for choosing hyperparameters

Pages 89–96:

1. Check the initial loss.
2. Overfit a small sample.
3. Find a learning rate that makes the loss go down. Use the architecture from step 2, all the training data, and a small weight decay, and find a rate that drops the loss significantly within about 100 iterations. Good values to try: 1e-1, 1e-2, 1e-3, 1e-4, 1e-5.
4. Run a coarse grid of hyperparameters, training each for about 1–5 epochs.
5. Refine the grid and train longer.
6. Read the loss and accuracy curves. Accuracy still rising means train longer. A big train/val gap means overfitting: add regularization or get more data. No gap often means underfitting: train longer or try a bigger model.
7. Go back to step 5.

Page 96 cites Bergstra and Bengio (2012): **random search beats grid search.** When one hyperparameter matters and another doesn't, a grid only tries a few values of the important one, while random search tries a new value every time.

**What to do**: before your next training run, do steps 1 and 2. If the initial loss doesn't match its expected value, or you can't overfit a tiny batch, every later tuning step is wasted.

## What this post can and can't confirm

Confirmed: the 2026 schedule's topics and paper list, the content and title of the 2026 slides, the official notes' AlexNet/GoogLeNet/VGG/ResNet case studies and BatchNorm paragraph, and the existence and lecturer of the 2025 L6 recording (per the 2025 schedule).

Not confirmed: who taught this lecture in 2026 (the lecturer column on the 2026 schedule is commented out), and whether BatchNorm was covered verbally in the 2026 class. The 2025 and 2026 decks have nearly identical sections, but I did not check the 2025 recording's narration section by section.

Further reading on this site: the [CMU 11-785 CNN lectures](/posts/ai/2026-08-22-cmu-11785-10-cnn-two-en) derive CNN training and architecture a different way.

Series navigation: previous [L5: Image Classification with CNNs](/posts/ai/2026-09-30-cs231n-cnn-image-classification-en) | next [L7: Recurrent Neural Networks and Image Captioning](/posts/ai/2026-09-30-cs231n-recurrent-neural-networks-en) | [series overview](/posts/ai/2026-09-30-cs231n-course-overview-en)

## References

- [CS231n: Deep Learning for Computer Vision (Spring 2026 course site)](https://cs231n.stanford.edu/)
- [CS231n Spring 2026 schedule](https://cs231n.stanford.edu/schedule.html)
- [Lecture 6: Training CNNs and CNN Architectures slides (Spring 2026)](https://cs231n.stanford.edu/slides/2026/lecture_6.pdf)
- [Lecture 6 slides (Spring 2025, for comparison)](https://cs231n.stanford.edu/slides/2025/lecture_6.pdf)
- [CS231n official notes: Convolutional Neural Networks (case studies)](https://cs231n.github.io/convolutional-networks/)
- [CS231n official notes: Neural Networks Part 2 (Batch Normalization)](https://cs231n.github.io/neural-networks-2/)
- [Stanford CS231N Spring 2025 Lecture 6: CNN Architectures (YouTube)](https://www.youtube.com/watch?v=aVJy4O5TOk8)
- [CS231n Spring 2025 schedule](https://cs231n.stanford.edu/2025/schedule.html)
- [Krizhevsky, Sutskever, Hinton 2012: ImageNet Classification with Deep Convolutional Neural Networks (AlexNet)](https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf)
- [Simonyan and Zisserman 2014: Very Deep Convolutional Networks for Large-Scale Image Recognition (VGG)](https://arxiv.org/abs/1409.1556)
- [Szegedy et al. 2014: Going Deeper with Convolutions (GoogLeNet)](https://arxiv.org/abs/1409.4842)
- [He et al. 2015: Deep Residual Learning for Image Recognition (ResNet)](https://arxiv.org/abs/1512.03385)
- [CS231n Assignment 2 (Spring 2026)](https://cs231n.github.io/assignments2026/assignment2/)
