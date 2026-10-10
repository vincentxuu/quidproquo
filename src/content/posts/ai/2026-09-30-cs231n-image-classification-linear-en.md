---
title: "CS231N L2: Image Classification, kNN, and Linear Classifiers"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, deep-learning, image-classification]
lang: en
series:
  name: "Reading Stanford CS231N"
  order: 2
tldr: "L2 starts from one question: a computer sees a grid of numbers between 0 and 255, so how does it recognize a cat? Hand-written rules don't scale, so the course switches to a data-driven approach: collect data, train, evaluate on new images. The first classifier, kNN, teaches how to split train/val/test, but pixel distances carry no meaning. The second, the linear classifier f(x,W)=Wx+b, can be read three ways (algebraic, visual as templates, geometric as hyperplanes). Softmax turns its scores into probabilities, and the loss is the negative log probability of the correct class."
description: "A guide to the second lecture of Stanford CS231N (Spring 2026), based on lecture_2.pdf and the official notes on classification and linear classification: the semantic gap and the challenges that make classification hard, the data-driven approach, kNN distances and how to pick hyperparameters, the algebraic, visual, and geometric views of a linear classifier, and how the softmax loss is computed. For a recording, see Lecture 2 of the Spring 2025 YouTube playlist."
draft: false
glossary:
  - term: "semantic gap"
    definition: "The gap between what a person sees (a cat) and what a computer sees (an array of pixel values)."
    context: "CS231N L2 uses it to explain why image classification can't be solved with hand-written rules."
  - term: "hyperparameter"
    definition: "A choice about the algorithm itself, such as k and the distance function in kNN. It isn't learned directly from training data and should be chosen on a validation set."
    context: "L2 walks through four ways to pick kNN hyperparameters; only the validation set and cross-validation are sound."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs231n-image-classification-linear)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

> **Source years**: slides are from Spring 2026; for a recording, see [Spring 2025 Lecture 2](https://www.youtube.com/watch?v=pdqofxJeBN8) on YouTube. They may differ; this post follows the 2026 slides and marks anything taken from the official notes. This is post 2 of the [Reading Stanford CS231N](/posts/ai/2026-09-30-cs231n-course-overview-en) series.

The second [CS231N](https://cs231n.stanford.edu/) lecture was on April 2, the same day A1 went out. The [schedule](https://cs231n.stanford.edu/schedule.html) lists its topics as the data-driven approach, k-nearest neighbor, the algebraic, visual, and geometric viewpoints of linear classifiers, and the softmax loss. The matching official notes are [Image Classification](https://cs231n.github.io/classification/) and [Linear Classification](https://cs231n.github.io/linear-classify/).

The lecture introduces the two simplest classifiers. Neither is good enough in practice, but every later lecture builds on the framework they leave behind: how to split the data, how to compute scores, and how to define a loss.

## Course video sources

This article uses Spring 2026 materials. The official Spring 2026 schedule (checked live on 2026-10-10) lists no recording links, and no public Spring 2026 playlist was found. The Spring 2025 recordings below come from the public Stanford Online playlist and share the lecture title, but their content may differ from the 2026 lecture, and the original recording has not been verified. Checked: 2026-10-10.

```youtube
url: https://www.youtube.com/watch?v=pdqofxJeBN8
title: Stanford CS231N | Spring 2025 | Lecture 2: Image Classification with Linear Classifiers
```

Original videos: [Stanford CS231N | Spring 2025 | Lecture 2: Image Classification with Linear Classifiers](https://www.youtube.com/watch?v=pdqofxJeBN8)

Course and recording entries:

- [Official course / lecture source](https://cs231n.stanford.edu/schedule.html)

## The problem: a computer only sees numbers

The [slides](https://cs231n.stanford.edu/slides/2026/lecture_2.pdf) define the task first: given an image and a set of possible labels (dog, cat, truck, plane, …), output one of them.

The difficulty lives in what the slides call the **semantic gap**. You see a cat. The computer sees an array of numbers with three channels (RGB), each between 0 and 255. The slides then list what makes the problem hard:

- **Viewpoint variation**: move the camera and every pixel changes
- **Illumination**
- **Background clutter**
- **Occlusion**
- **Deformation**: cats bend into all kinds of poses
- **Intraclass variation**: cats in the same class look very different
- **Context**: the surroundings can mislead

So unlike sorting numbers, there's no obvious algorithm you can hard-code to recognize a cat. The slides mention past attempts to find edges, then corners, and assemble a cat from rules (citing Canny's 1986 edge detector), but that approach doesn't extend to other classes.

## The data-driven approach in three steps

The slides' alternative is the machine learning **data-driven approach**:

1. Collect a dataset of images and labels
2. Use a machine learning algorithm to train a classifier
3. Evaluate the classifier on new images

The official notes write this as a class with two methods: `train` takes training images and labels, and `predict` outputs labels for new images. Both classifiers in L2 fit this interface.

## The first classifier: Nearest Neighbor and kNN

**Nearest Neighbor** is as direct as it gets. At training time, memorize all the data and labels. At prediction time, find the most similar training image and copy its label.

"Most similar" needs a distance function. The slides start with **L1 distance**: subtract two images pixel by pixel, take absolute values, and sum.

Then the slides ask: with N examples, how fast are training and prediction? Training is O(1) and prediction is O(N). The slides call this bad, since we want fast prediction and don't mind slow training. Fast and approximate nearest neighbor search is outside CS231N's scope; the slides point to [Faiss](https://github.com/facebookresearch/faiss).

**kNN** replaces "copy the nearest one" with "take a majority vote among the K nearest". With K=1, outliers carve the decision boundary into small islands; larger K smooths it. You can also swap in **L2 (Euclidean) distance**. The slides link an official [interactive demo](http://vision.stanford.edu/teaching/cs231n-demos/knn/) where you can change K and the distance and watch the boundaries move.

The official notes add numbers. On CIFAR-10, a nearest neighbor classifier with L1 distance gets 38.6% accuracy; with L2 it gets 35.4%. Random guessing gets 10%, and the notes estimate human performance at about 94%.

## Hyperparameters: four ways to choose, two that work

What K to use, and whether to use L1 or L2, are **hyperparameters**: choices about the algorithm itself, and very dataset-dependent. The slides check four ways to choose them:

| Approach | Problem |
|---|---|
| 1. Pick what works best on the training data | K=1 always works perfectly on training data |
| 2. Pick what works best on the test data | No idea how the algorithm does on new data; the slides say "Never do this!" |
| 3. Split into train / validation / test, choose on validation, run test at the end | Better |
| 4. Cross-validation: split training data into folds, rotate which fold validates, average | Useful for small datasets, but not used much in deep learning |

The slides demonstrate 5-fold cross-validation on CIFAR-10 (10 classes, 50,000 training images, 10,000 test images). For that data, k around 7 works best.

This is the rule the course reuses most often: **run the test set once, at the very end.**

The slides' verdict is blunt: "k-Nearest Neighbor with pixel distance is never used." Pixel distances carry no meaning. The slides show an original image next to three variants (partly occluded, shifted by one pixel, and tinted). All three sit at the same pixel distance from the original, yet to a person they look nothing alike.

## The second classifier: linear classifiers

The linear classifier is a **parametric approach**. Instead of memorizing the training set, it learns weights W that map an image to a score for each class.

For CIFAR-10, a 32×32×3 image flattens into 3,072 numbers:

```text
f(x, W) = W x + b
x: 3072 × 1    W: 10 × 3072    b: 10 × 1    f: 10 × 1 (scores for 10 classes)
```

The slides place linear classifiers inside neural networks: networks such as AlexNet and ResNet contain linear layers.

Here are the "three viewpoints" from the schedule:

- **Algebraic**: take a tiny image with 4 pixels and 3 classes (cat/dog/ship), flatten the pixels into a vector, multiply by W, add b, and get three scores. In the slides' example, cat scores −96.8, dog 437.9, and ship 61.95
- **Visual**: each row of W can be reshaped into an image that looks like a "template" for its class. The official notes point out that the horse template learned on CIFAR-10 looks like a two-headed horse, because the data has horses facing both left and right and a linear classifier can only merge them into one template. The car template is red, which hints that red cars are the most common in the dataset
- **Geometric**: each image is a point in 3,072-dimensional space, each class score is a linear function over that space, and the class boundaries are hyperplanes

The geometric view exposes the limits right away. The slides show three cases a linear classifier can't handle: first and third quadrants against second and fourth (XOR-like), a ring where the L2 norm is between 1 and 2, and a class with three separate modes. These limits are why L4 brings in neural networks.

## Choosing a good W: the loss function

Scores alone don't tell you whether W is any good. The slides split the next job in two:

1. Define a **loss function** that measures how unhappy we are with the scores on the training data
2. Find the parameters that minimize the loss, which is optimization (the topic of L3)

The loss over the dataset is the average of the per-example losses.

## Softmax: turning scores into probabilities

The 2026 slides cover a single loss: the **softmax classifier**, also called multinomial logistic regression. The goal is to read raw scores as probabilities.

The slides compute a three-class example step by step:

| Class | Score (logit) | After exp | Normalized probability |
|---|---|---|---|
| cat (correct) | 3.2 | 24.5 | 0.13 |
| car | 5.1 | 164.0 | 0.87 |
| frog | −1.7 | 0.18 | 0.00 |

The exp keeps probabilities non-negative, and dividing by the sum makes them add to 1. The loss for this example is the negative log of the correct class's probability: Li = −log(0.13) ≈ 2.04. The slides note that this amounts to maximum likelihood estimation and leave the details to CS229.

<details>
<summary>The formula and two sanity checks</summary>

For example i with score vector s = f(xᵢ, W) and correct class yᵢ:

```text
P(Y = k | X = xᵢ) = exp(s_k) / Σⱼ exp(s_j)
Lᵢ = −log P(Y = yᵢ | X = xᵢ)
```

The slides leave two questions:

- **Q1: What are the min and max of Lᵢ?** As the correct class's probability approaches 1, the loss approaches 0; as it approaches 0, the loss goes to infinity. So the range is 0 to ∞.
- **Q2: At initialization, when all scores are about equal, what is the loss?** Each class gets probability about 1/C, so the loss is −log(1/C) = log(C). With C = 10, that's about 2.3.

Q2 is practical: if the loss at the start of training is clearly not log(C), there's usually a bug.

</details>

Besides softmax, the official [Linear Classification](https://cs231n.github.io/linear-classify/) notes have a full section on the multiclass SVM (hinge) loss, a comparison of SVM vs. Softmax, and an [interactive demo](https://cs231n.github.io/assets/linear-classify-demo/index.html). The 2026 L2 slides don't cover the SVM loss, and A1 only asks for a Softmax classifier, so treat that section of the notes as extra reading.

## What to do tonight

1. Open the [interactive kNN demo](http://vision.stanford.edu/teaching/cs231n-demos/knn/), move K from 1 to 7, and watch the small islands in the decision boundary disappear
2. Recompute the softmax table above in numpy: start from `s = np.array([3.2, 5.1, -1.7])`, get 0.13 and 2.04 yourself, then try `s = np.zeros(10)` and confirm the loss is log(10)
3. If you've downloaded the [A1 starter code](https://cs231n.github.io/assignments2026/assignment1/), Q1 (knn.ipynb) and Q2 (softmax.ipynb) cover exactly this lecture, so you can start writing them

## Further reading

- [Reading Stanford CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): the full derivation of softmax regression and maximum likelihood
- [Reading Stanford CS231N: overview and self-study plan](/posts/ai/2026-09-30-cs231n-course-overview-en)

**Series navigation**: Previous: [L1: Where computer vision came from, and where this course is going](/posts/ai/2026-09-30-cs231n-intro-vision-history-en) | Next: [L3: Regularization and optimization](/posts/ai/2026-09-30-cs231n-regularization-optimization-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Official sources only have Spring 2025 recordings, so the status is now related supplementary video only, and video titles use the original titles.

## References

- [CS231n schedule (Spring 2026)](https://cs231n.stanford.edu/schedule.html)
- [Lecture 2 slides: Image Classification with Linear Classifiers (2026)](https://cs231n.stanford.edu/slides/2026/lecture_2.pdf)
- [CS231n notes: Image Classification](https://cs231n.github.io/classification/)
- [CS231n notes: Linear Classification](https://cs231n.github.io/linear-classify/)
- [CS231n interactive kNN demo](http://vision.stanford.edu/teaching/cs231n-demos/knn/)
- [CS231n interactive linear classification demo](https://cs231n.github.io/assets/linear-classify-demo/index.html)
- [Assignment 1 (2026)](https://cs231n.github.io/assignments2026/assignment1/)
- [Spring 2025 Lecture 2: Image Classification with Linear Classifiers (YouTube)](https://www.youtube.com/watch?v=pdqofxJeBN8)
- [Faiss (facebookresearch/faiss)](https://github.com/facebookresearch/faiss)
- [Krizhevsky (2009). Learning Multiple Layers of Features from Tiny Images (CIFAR-10 technical report)](https://www.cs.toronto.edu/~kriz/learning-features-2009-TR.pdf)
