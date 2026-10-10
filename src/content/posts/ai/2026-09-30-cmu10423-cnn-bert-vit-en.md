---
title: "CMU 10-423 L5: CNNs, Encoder-only Transformers, and ViT — Why a Generative AI Course Starts Images with Understanding"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, cnn, bert, vision-transformer, computer-vision]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 5
tldr: "CMU 10-423 Lecture 5 opens the image unit with three models built for understanding. CNNs treat the convolution kernel as parameters to learn. Encoder-only Transformers drop the causal mask so every token sees both sides and train with a masked LM objective, which means they are not generative language models. ViT is nearly BERT with image patches such as 16×16 pixels as input. The slides use a figure from the ViT paper to explain why Transformers reached vision four years after NLP: on small datasets ViT loses to large CNNs, and it only pulls ahead with enough data."
description: "A guide to Lecture 5 of CMU 10-423/623/723 Generative AI (Spring 2026): convolution, padding, stride, pooling, and CNN layers; LeNet, AlexNet, and ResNet; eight computer vision tasks; encoder-only Transformers with BERT-style masked LM pre-training and [CLS] fine-tuning; ViT's patch embeddings, 1D position embeddings, and why it needs large data, mapped to the HW2 written questions and the practice exam."
draft: false
glossary:
  - term: "encoder-only Transformer"
    aliases: ["BERT-style model"]
    definition: "A Transformer without a causal mask: every position can see all positions to its left and right. It is not an autoregressive language model; it is usually pre-trained with masked LM and fine-tuned for classification using the [CLS] token's vector."
    context: "CMU 10-423 Lecture 5 uses it as the shared backbone of BERT and ViT."
    links:
      - label: "BERT (Devlin et al., 2018)"
        url: "https://arxiv.org/abs/1810.04805"
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-cnn-bert-vit)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

**This post is based on the Spring 2026 offering of [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/).** It is part 5 of the [Reading CMU 10-423](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) series. The text unit ended with [HW1](/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa-en); this post starts the second unit, "Generative models of images," with Lecture 5 on January 28, 2026: "Computer Vision: CNNs / Encoder-only Transformers / Vision Transformers."

Official materials used: the [schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html), the [slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture5-cnn-vit.pdf) and the [inked in-class version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture5-cnn-vit-ink.pdf) (70 pages each), and three readings: [sections 9.1–9.3](http://www.deeplearningbook.org/contents/convnets.html) of Goodfellow, Bengio, and Courville's *Deep Learning*, [BERT](https://arxiv.org/pdf/1810.04805.pdf), and [ViT](https://arxiv.org/pdf/2010.11929.pdf). The course is rated **A3** (see the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)). Recordings are on Panopto behind a CMU login, so this post works from the slides.

## Course video sources

The course links Spring 2026 recordings through SCS Panopto. The anonymous page did not load the videos and prompted sign-in. This article follows the public slides and assignments; recording access is governed by course authorization.

Course and recording entries:

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## Why a generative AI course starts with understanding images

None of this lecture's three models generates images, but later units keep using them:

- In [HW2](/posts/ai/2026-09-30-cmu10423-hw2-ddpm-en), written Question 2 is on CNNs (8 points) and Question 3 is on encoder-only Transformers (4 points). The CNN question ends by asking about U-Net skip connections.
- The DDPM you implement in HW2's programming part ships with a `unet.py` starter file: a U-Net built from stacked `nn.Conv2d` layers.
- ViT's "cut the image into tokens" is the foundation for diffusion transformers and vision-language models later on.

So this lecture stocks the toolbox for the whole image unit.

The slides open with a recap of the previous lecture. RoPE rotates each 2D slice of a vector. Sliding window changes the attention mask and reduces attention from quadratic to linear time. GQA reuses key/value heads to cut computation and memory. Details are in the [L4 guide](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa-en).

## CNNs: turn the convolution kernel into parameters

### Convolution, padding, stride

The slides place CNNs back into the "recipe for machine learning": take data, choose a decision function and a loss, define the goal, train with SGD. A CNN is just a different decision function.

The key idea is on slide 11: **treat the convolution matrix as parameters and learn them.** Classic image processing hand-picks a kernel (say, edge detection); a CNN lets backpropagation decide the numbers in it.

The next few slides cover the basic operations:

- **2D convolution**: slide a small weight matrix (the kernel) over the image and take an inner product at each position. Different kernels extract different low-level features, and only the weights need to change.
- **Padding**: to keep the output the same size as the input, pad the input with zeros.
- **Stride and downsampling**: stride sets how many pixels the kernel moves each step. Downsampling by averaging is a special case of convolution with weights fixed to a uniform distribution.
- **Kernel size**: a small kernel sees only a small patch but is fast; a large kernel sees more at the expense of speed.

### CNN layers and training

The slides then define each layer through the module forward/backward interface: ReLU, softmax, a fully connected layer (flattening the 3D input first), convolution, and max-pooling.

Color images have three RGB values per pixel, so the kernel must also be three-dimensional. The slides' example is a 3×64×64 input with a 3×5×5 kernel, giving a 1×64×64 output with padding. Training works as in earlier lectures. A small conv → max-pool → conv → ReLU → linear → softmax network still gets its gradients from SGD plus autodiff.

### Classic architectures and neuroscience roots

- **LeNet-5**: the slides' first architecture example.
- **AlexNet** (Krizhevsky, Sutskever, and Hinton, 2012): five convolutional layers (with max-pooling), three fully connected layers, and a 1000-way softmax, with 15.3% error on ImageNet LSVRC-2012.
- **ResNet**: the slides borrow Kaiming He's "Revolution of Depth" figure showing networks growing ever deeper.

The slides also cover where CNNs came from. In the 1960s, Hubel and Wiesel found that certain neurons in a cat's visual cortex fired only when the cat saw a bar at a particular orientation. That selectivity is called a receptive field; a CNN's receptive field is, for example, a 3×3 patch of pixels.

[Section 9.2 of *Deep Learning*](http://www.deeplearningbook.org/contents/convnets.html) sums up what convolution buys you in three ideas: sparse interactions, parameter sharing, and equivariant representations. Section 9.3 explains that a typical convolutional layer has three stages, one of which is pooling.

### Eight computer vision tasks

The slides list eight tasks: image classification, classification plus localization, human pose estimation, semantic segmentation, object detection, instance segmentation, image captioning, and image generation. They point out that most are **structured prediction** problems, not merely classification.

## Encoder-only Transformers: what happens when you drop the causal mask

### Starting from decoder-only

The slides first recall the decoder-only Transformer (the Transformer language model) and causal attention, then ask: "Holy cow, that's a lot of new arrows… Do we always want/need all of those? No! Do we sometimes want/need all of those? Yes!"

Remove the causal mask and every token can attend to all tokens on its left and right. The slides' conclusion: **it is no longer an autoregressive language model.**

Each encoder-only Transformer layer has four sublayers: non-causal attention, a feed-forward network, layer normalization, and residual connections.

### BERT-style pre-training and fine-tuning

If it can't predict the next word, how do you train it? The slides credit BERT with popularizing both the architecture and its style of pre-training:

- **Masked LM pre-training**: rather than predicting the next word from the previous ones, mask out one or a few words and predict them from the rest. The slides' example is "[CLS] [MASK] cat [MASK]" with objective log p(w₁, w₃ | w₂).
- **Supervised fine-tuning**: predict the class label from the output vector of the special [CLS] token, e.g., label 1 for "The cat sat" and 0 for "A dog barks."

The slides' verdict: it is not a generative language model, but it can be used very effectively as a discriminator. The next lecture, on [GANs](/posts/ai/2026-09-30-cmu10423-gans-en), puts that word to work.

The [BERT abstract](https://arxiv.org/abs/1810.04805) describes pre-training deep bidirectional representations by jointly conditioning on left and right context in all layers, then fine-tuning with just one additional output layer for tasks such as question answering and language inference.

## ViT: cut the image into a grid of tokens

### Model and training

Slide 108 keeps it short:

- The model is almost identical to BERT.
- The inputs are P×P pixel image patches instead of words, P ∈ {14, 16, 32}, with no overlap.
- Each patch is linearly embedded into a 1024-dimensional vector.
- Position embeddings are 1D.
- Pre-training is image classification on a large supervised dataset (e.g., ImageNet-21K, JFT-300M), the same setup as a CNN.
- Fine-tuning learns a new classification head on a small dataset (e.g., CIFAR-100).

### How 1D position embeddings learn 2D position

The slides leave a question: how can ViT learn 2D positional information from 1D position embeddings? The public inked version leaves the answer box empty.

The [ViT paper](https://arxiv.org/abs/2010.11929) addresses this directly. The authors use standard learnable 1D position embeddings because more advanced 2D-aware embeddings brought no significant gains. Figure 7 shows that the learned embeddings encode distance within the image: closer patches have more similar position embeddings, and patches in the same row or column are similar too. The paper argues that because the embeddings learn 2D topology on their own, hand-crafted 2D variants don't help.

### Why Transformers took four years to reach computer vision

The slides set two timelines side by side. Transformers appeared in 2017 and immediately took over NLP, but ViT only arrived in 2021. Why the gap?

The slides answer with Figure 3 of the ViT paper. It compares two model families, BiT (large ResNet-based CNNs) and ViTs of various sizes, pre-trained on ImageNet, ImageNet-21k, and JFT-300M and transferred to ImageNet. The caption says large ViT models do worse than BiT ResNets when pre-trained on small datasets but shine on larger ones, and larger ViT variants overtake smaller ones as the dataset grows.

This closes the loop on a point from the first half of the previous lecture: ViT's success came largely from a much larger pre-training set. The slides add that the original ViT models were small next to the LLMs of the time, and by 2023 ViT had been scaled to 22 billion parameters.

The final slide looks at the neuroscience roots of attention, citing Hopfield networks from 1982.

## How the course checks this lecture

- **HW2 written questions**: Question 2 on CNNs (8 points) covers deriving padding and U-Net; Question 3 on encoder-only Transformers (4 points) compares the sequence distributions encoder-only and decoder-only models can express. See the [HW2 guide](/posts/ai/2026-09-30-cmu10423-hw2-ddpm-en).
- **Practice exam**: Question 5 of the [Spring 2026 practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf), "Vision Transformers," is worth 14 of 167 points.

**What to do**: tonight, take a 224×224 color image and work through the slides' setup. With P = 16, how many patches do you get, how many dimensions does each flattened patch have, and how big is the weight matrix that embeds it into 1024 dimensions? Then compare that parameter count with a 3×5×5 kernel. You'll see directly why ViT leans on data more than a CNN does.

## What this post can and cannot confirm

Confirmed: the schedule's dates and readings, the plain and inked slide content, the cited passages of the ViT and BERT papers, the section titles of *Deep Learning* chapter 9, and the point table and topics in hw2.pdf. Not confirmed: what was said in class about the two open questions (ViT's 2D positions, why Transformers came late to vision), because the recordings require a CMU login.

Further reading: the site's [Stanford CS231N guide](/posts/ai/2026-09-30-cs231n-course-overview-en) covers computer vision across a whole course. Its posts on [CNNs and image classification](/posts/ai/2026-09-30-cs231n-cnn-image-classification-en) and [attention, Transformers, and ViT](/posts/ai/2026-09-30-cs231n-attention-transformers-vit-en) pair well with this one. The prerequisite [CMU 11-785 guide](/posts/ai/2026-08-22-cmu-11785-course-overview-en) also has a full CNN unit.

Series navigation: previous [HW1: adding RoPE and GQA to minGPT](/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa-en) | next [L6: GANs and probabilistic graphical models](/posts/ai/2026-09-30-cmu10423-gans-en) | [series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CMU 10-423/623/723 Generative AI (Spring 2026) course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Course schedule (Lecture 5 and readings)](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Lecture 5 slides: CNNs / Encoder-only Transformers / Vision Transformers](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture5-cnn-vit.pdf)
- [Lecture 5 slides (inked in-class version)](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture5-cnn-vit-ink.pdf)
- [Goodfellow, Bengio & Courville 2016: Deep Learning, Chapter 9 Convolutional Networks](http://www.deeplearningbook.org/contents/convnets.html)
- [Devlin et al. 2018: BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding (NAACL)](https://arxiv.org/abs/1810.04805)
- [Dosovitskiy et al. 2021: An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale (ICLR)](https://arxiv.org/abs/2010.11929)
- [HW2 handout (hw2.zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw2.zip)
- [Spring 2026 Practice Exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
