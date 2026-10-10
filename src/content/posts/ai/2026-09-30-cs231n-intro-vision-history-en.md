---
title: "CS231N L1: Where Computer Vision Came From, and Where This Course Is Going"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, deep-learning, imagenet]
lang: en
series:
  name: "Reading Stanford CS231N"
  order: 1
tldr: "The first CS231N lecture of 2026 comes in two slide decks. The first tells the history of vision and deep learning on a single timeline: Hubel & Wiesel's cat experiments, Marr's stages of visual representation, then the Neocognitron, backprop, and LeNet, until ImageNet and AlexNet join the two threads. The second covers the course map, grading, and rules, and moves every assignment onto Colab. After this lecture you'll know which gap each of the remaining 17 lectures fills."
description: "A guide to the first lecture of Stanford CS231N (Spring 2026), based on lecture_1_part_1.pdf, lecture_1_part_2.pdf, and the official schedule: how the slides tie together the histories of computer vision and neural networks, why ImageNet and AlexNet are where they meet, how the course units are cut, and what the grading and Honor Code say. For a recording, see Lecture 1 of the Spring 2025 YouTube playlist."
draft: false
glossary:
  - term: "ImageNet"
    definition: "A large-scale image dataset published by Deng et al. in 2009. The CS231N slides give it as about 15 million images in 22,000 categories; the classification challenge uses 1,000 of those classes."
    context: "L1 treats it as the point where the computer vision and deep learning threads meet."
  - term: "Neocognitron"
    definition: "Fukushima's 1980 computational model of the visual system. Inspired by Hubel & Wiesel's simple and complex cells, it interleaves convolution-like and pooling-like layers, but had no practical training algorithm."
    context: "The forerunner of CNNs on the L1 timeline."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs231n-intro-vision-history)

> **Source years**: slides are from Spring 2026; for a recording, see [Spring 2025 Lecture 1](https://www.youtube.com/watch?v=2fq9wYslV0A) on YouTube. They may differ; this post follows the 2026 slides. This is post 1 of the [Reading Stanford CS231N](/posts/ai/2026-09-30-cs231n-course-overview-en) series. For the course's positioning, grading, access gaps, and the 10-week plan, see the [series overview](/posts/ai/2026-09-30-cs231n-course-overview-en).

The first [CS231N](https://cs231n.stanford.edu/) lecture of 2026 was on March 31, taught by Fei-Fei Li and Ehsan Adeli. The [schedule](https://cs231n.stanford.edu/schedule.html) links two decks for it: [part 1](https://cs231n.stanford.edu/slides/2026/lecture_1_part_1.pdf) is a short history of computer vision and deep learning, and [part 2](https://cs231n.stanford.edu/slides/2026/lecture_1_part_2.pdf) is the course overview and rules.

There are no equations in this lecture. Its job is to show why the course starts with image classification, and why it goes all the way to generative models, 3D, and world modeling.

## Course video sources

This article uses Spring 2026 materials. The public Spring 2025 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=2fq9wYslV0A
title: Spring 2025 Lecture 1: Introduction (YouTube)
```

Original videos: [Spring 2025 Lecture 1: Introduction (YouTube)](https://www.youtube.com/watch?v=2fq9wYslV0A)

Course and recording entries:

- [Official course / lecture source](https://cs231n.stanford.edu/schedule.html)

## One Venn diagram to place the course

Early in part 1, a Venn diagram grows one circle at a time (the slides credit Justin Johnson for the idea). Artificial Intelligence comes first, then Machine Learning inside it, then Computer Vision and Deep Learning. Finally the slide labels "This class": the overlap of computer vision and deep learning.

Around the edges sit mathematics, neuroscience, physics, psychology, biology, and computer science. The point is that the course borrows ideas from many fields but follows one main line: deep learning applied to vision problems.

An earlier slide shows three words, Big Data, Neural networks, and GPUs, grouped as the "Modern AI Revolution". Those three words foreshadow the whole history that follows.

## Thread one: how computer vision became a recognition problem

The slides start far back, with the Cambrian explosion 530–540 million years ago ("Evolution's Big Bang"), then the camera obscura. Computer vision proper comes next. In the order of the slide timeline:

- **1959, Hubel & Wiesel**: recordings from cat brains showed simple cells that respond to edges at particular orientations and complex cells that respond to orientation and movement, with some translation invariance
- **1963, Larry Roberts**: "Machine Perception of Three-Dimensional Solids", which went from the original picture to an edge image to selected feature points
- **1970s, David Marr**: visual representation in stages, from primal sketch to 2½-D sketch to 3-D model
- **1970s**: recognition via parts, such as generalized cylinders and pictorial structures
- **1986, Canny**, and 1987, Lowe: recognition via edge detection
- **1997, Normalized Cuts** (Shi & Malik): recognition via grouping
- **1999, SIFT** (David Lowe): recognition via matching
- **2001, Viola & Jones face detection**: the slides call it one of the first successful applications of machine learning to vision
- **PASCAL VOC and Caltech101**: standardized recognition datasets and challenges appear

An "AI winter" runs through the middle: expert systems failed to deliver, funding dried up, but subfields such as vision, NLP, and robotics kept growing. Meanwhile, cognitive science and neuroscience work continued. The slides cite rapid serial visual perception (RSVP) experiments and a 1996 Nature paper by Thorpe et al. marked "150 ms !!", and land on one conclusion: "Visual recognition is a fundamental task for visual intelligence."

That sentence explains where the course starts. After decades of vision research, the focus settled on recognition, so L2 begins with image classification.

## Thread two: how neural networks fell out of favor and came back

On the same timeline, the slides layer in the history of neural networks:

- **1958, Perceptron** (Rosenblatt)
- **1969, Minsky & Papert**: showed that perceptrons can't learn XOR, which, per the slides, caused a lot of disillusionment
- **1980, Neocognitron** (Fukushima): directly inspired by Hubel & Wiesel, it interleaves simple cells (convolution) and complex cells (pooling), but had no practical training algorithm
- **1986, Backprop** (Rumelhart, Hinton, Williams): successfully trained multi-layer perceptrons
- **1998, LeNet** (LeCun et al.): applied backprop to a Neocognitron-like architecture to recognize handwritten digits, and NEC deployed it to process checks. The slides call it "very similar to our modern convolutional networks"
- **"Deep Learning" from 2006**: people tried to train deeper and deeper networks, but the slides add one line: "No good dataset to work on"

That last line is where the threads meet. The algorithms existed. The data didn't.

## Where they meet: ImageNet and AlexNet

The slides then list dataset sizes: Caltech101 at about 9K images, LabelMe at 37K, PASCAL VOC at 30K, SUN at 131K, and then ImageNet at 15 million images in 22,000 categories (Deng et al., CVPR 2009). The ImageNet classification challenge uses 1,000 of those classes and 1,431,167 images.

The next node on the timeline is **AlexNet in 2012**. From there, the slides use two charts, ImageNet top-1 accuracy climbing year after year and submissions to the top computer vision conference exploding, to make the case for "2012 to Present: Deep Learning Explosion". Part 2 adds that the original 2009 ImageNet paper won the IEEE PAMI Longuet-Higgins Prize at CVPR 2019, an award for the most influential computer vision paper from ten years earlier.

A dozen or so "Deep Learning is Everywhere" slides follow. They roughly preview the rest of the course:

| What the slides show | Matching lecture |
|---|---|
| AlexNet (2012) → ResNet (2015) → ViT (2021) → DiT (2023) | L5, L6, L8, L14 |
| Faster R-CNN detection, Segment Anything segmentation | L9 |
| Video understanding and activity recognition | L10 |
| Early image captioning (2015) next to a detailed 2026 caption from Gemini 3 | L7, L16 |
| GANs, DALL·E, and later image generation | L13, L14 |

The last slides turn to limits and responsibility. Computer vision "still has a long way to go". It can cause harm, through stereotypes and hiring decisions, and it can save lives, through ambient sensing in hospitals and home care. The slides split visual intelligence into Understanding, Reasoning, and Generation, and close on Spatial Intelligence and World Modeling.

## The course map: the official materials don't cut it the same way

The overview slide in part 2 splits the course into four blocks:

1. Deep Learning Basics
2. Perceiving and Understanding the Visual World
3. Generative and Interactive Visual Intelligence
4. Human-Centered Applications and Implications

The closing slide of the same deck says something else: Deep Learning Basics (L2–4), Perceiving and Understanding the Visual World (L5–12), Reconstructing and Interacting with the Visual World (L13–17), and Human-Centered Artificial Intelligence (L18). The [official schedule](https://cs231n.stanford.edu/schedule.html) has only three units: L2–L4, L5–L11, and L12–L18.

The three versions differ on where L12 (self-supervised learning) belongs and whether L18 stands alone. This series follows the schedule's three units and covers L18 in the final post.

The examples part 2 gives for each block map onto the later lectures:

- **Basics**: image classification → linear classifiers → regularization and optimization → neural networks
- **Perceiving and understanding**: tasks beyond classification (semantic segmentation, object detection, instance segmentation, video, visualization), models beyond the MLP (CNNs, RNNs, Transformers), and large-scale distributed training (data parallelism, model parallelism, synchronous vs. asynchronous updates)
- **Generative and interactive**: self-supervised learning, style transfer and image generation, vision-language models (with CLIP's contrastive pre-training as the example), 3D vision, and embodied intelligence. The slides say A3 has you implement a generative model that produces emojis from text

## Course rules: Colab, the Honor Code, and a new midterm

The second half of part 2 is logistics. What matters for self-learners:

- **Every assignment runs on Google Colab.** A1 goes out 4/2 and is due 4/16. It covers kNN, a Softmax linear classifier, a two-layer network, image features, and deeper networks with optimizers
- **Every assignment has a coding part and a written part.** Code is autograded; the written part is graded by TAs
- **Grading**: three assignments at 12% + 18% + 15% = 45%, a midterm at 20% (marked "New" on the slide), the project at 35%, and up to 3% extra credit for participation
- **Four Honor Code rules**: don't look at solutions or code that aren't yours (including from AI tools), don't share your solution code, credit anyone you worked with, and "Do not submit AI-generated responses"
- **Learning objectives**: formalize vision applications as tasks; learn to code, debug, and train CNNs; use frameworks such as PyTorch and TensorFlow; understand where the field stands and what ethical questions come before deployment

The optional reading lists three free books: *Deep Learning* by Goodfellow, Bengio, and Courville; *Mathematics of Deep Learning* (the slides point to chapters 5–7 for vector calculus and continuous optimization); and *Dive into Deep Learning*.

## What to do tonight

If you plan to follow the series, do two things tonight:

1. Open the [Python/Numpy tutorial on cs231n.github.io](https://cs231n.github.io/python-numpy-tutorial/) and make sure broadcasting and vectorized operations make sense. The kNN question in A1 asks you to compute distances without loops
2. Redraw the part 1 timeline yourself, and next to each node write the later lecture it connects to. L2 immediately uses the "data-driven" idea, which is exactly what the ImageNet part of the story concludes

The 2026 recordings are on Canvas only and closed to outside readers. If you want to listen along, [Spring 2025 Lecture 1](https://www.youtube.com/watch?v=2fq9wYslV0A) is on YouTube and runs about an hour. I did not compare it slide by slide with the 2026 deck.

## Further reading

- [Reading Stanford CS231N: overview and self-study plan](/posts/ai/2026-09-30-cs231n-course-overview-en): access level, grading, how the 2025 recordings line up, and the 10-week plan
- [Reading CMU 11-785](/posts/ai/2026-08-22-cmu-11785-course-overview-en): the same neural network history, from a general deep learning course

**Series navigation**: Previous: [Overview and self-study plan](/posts/ai/2026-09-30-cs231n-course-overview-en) | Next: [L2: Image classification, kNN, and linear classifiers](/posts/ai/2026-09-30-cs231n-image-classification-linear-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS231n home page (Spring 2026)](https://cs231n.stanford.edu/)
- [CS231n schedule (Spring 2026)](https://cs231n.stanford.edu/schedule.html)
- [Lecture 1 Part 1 slides: Introduction (2026)](https://cs231n.stanford.edu/slides/2026/lecture_1_part_1.pdf)
- [Lecture 1 Part 2 slides: Overview (2026)](https://cs231n.stanford.edu/slides/2026/lecture_1_part_2.pdf)
- [Spring 2025 Lecture 1: Introduction (YouTube)](https://www.youtube.com/watch?v=2fq9wYslV0A)
- [CS231n Python/Numpy tutorial](https://cs231n.github.io/python-numpy-tutorial/)
- [Deng et al. (2009). ImageNet: A large-scale hierarchical image database. CVPR](https://www.image-net.org/static_files/papers/imagenet_cvpr09.pdf)
- [Krizhevsky, Sutskever & Hinton (2012). ImageNet Classification with Deep Convolutional Neural Networks. NeurIPS](https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html)
