---
title: "CS231N L4: Neural Networks and Backpropagation, or Upstream Times Local on a Computational Graph"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, stanford, ai-course, computer-vision, deep-learning, neural-networks, backpropagation]
lang: en
series:
  name: "Reading Stanford CS231N"
  order: 4
tldr: "The first half of L4 replaces the linear classifier f = Wx with a two-layer network f = W₂ max(0, W₁x) and shows that dropping the max activation collapses it back into a linear classifier. The second half answers how to compute gradients once the network gets deep: draw the function as a computational graph, and each node only needs its own local gradient multiplied by the upstream gradient coming back from later nodes. Add distributes, mul swaps, max routes, copy sums, and those four patterns let you trace any network. The lecture ends with matrices: dL/dx always has the same shape as x, so never build the Jacobian."
description: "A guide to Stanford CS231N (Spring 2026) Lecture 4: from linear classifiers to multi-layer perceptrons, why activation functions matter, computational graphs and the upstream × local pattern, gradient flow through four gates, the forward/backward API, and backprop with vectors and matrices. Built around the five-step worked example from Section 2, with the official derivatives and linear-backprop handouts, the Backprop Colab, and the optimization-2 course notes."
draft: false
glossary:
  - term: "computational graph"
    definition: "A function broken into a chain of basic operations (add, multiply, max, sigmoid, ...), each a node, with data flowing along edges. The forward pass computes values along the edges; the backward pass computes gradients back along them."
    context: "CS231N L4 uses it to replace deriving a whole network's gradient on paper."
  - term: "upstream gradient"
    definition: "The gradient of the loss with respect to a node's output, passed back from later nodes. The node multiplies it by its own local gradient to get the downstream gradient it passes further back."
    context: "L4 and Section 2 boil backprop down to downstream = upstream × local."
  - term: "Jacobian"
    aliases: ["Jacobian matrix"]
    definition: "The derivative of a vector with respect to a vector: one partial derivative for every pair of output and input elements, arranged in a matrix."
    context: "L4 points out that for one matrix multiply with N=64 and D=M=4096, the Jacobian takes about 256 GB, so implementations never build it."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs231n-neural-networks-backprop)

> **Version note**: The slides are the [lecture_4.pdf](https://cs231n.stanford.edu/slides/2026/lecture_4.pdf) (139 pages) linked from the [CS231N](https://cs231n.stanford.edu/) Spring 2026 schedule. Its admin slides carry 2026 dates (A1 due 4/16, project proposal due 4/23), but the content slides' footer reads "April 9, 2025". I'm recording that as-is and not inferring how much changed. The recording is the [Spring 2025 Lecture 4](https://www.youtube.com/watch?v=25zD5qJHYsk); 2026 recordings are Canvas-only. I also use the [slides](https://cs231n.stanford.edu/slides/2026/section_2_backprop.pdf) and [Colab](https://colab.research.google.com/github/cs231n/cs231n.github.io/blob/master/backprop.ipynb) from the April 10, 2026 Backprop Review Session. All facts were checked against official materials on 2026-09-30. Access level **A3** (defined in the [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)).

**Series**: Previous [L3: Regularization and Optimization](/posts/ai/2026-09-30-cs231n-regularization-optimization-en) | Next [A1 Guide: kNN, Softmax, Two-Layer and Fully Connected Networks](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet-en) | [Series overview](/posts/ai/2026-09-30-cs231n-course-overview-en)

[L3](/posts/ai/2026-09-30-cs231n-regularization-optimization-en) taught you how to walk downhill with a gradient, assuming you can compute one. For a linear classifier you can still derive it on paper. Make the network deeper or swap the loss, and paper derivations fall apart.

The [2026 schedule](https://cs231n.stanford.edu/schedule.html) gives L4 just two topics: Multi-layer Perceptron and Backpropagation. It's the last lecture of the "Deep Learning Basics" unit, and the series plan flags it as the first mathematical peak.

This post follows five layers: the setting, the intuition, the mechanics (formulas in collapsible blocks), the connection back to models, and where to go deeper. The mechanics layer uses the Section 2 five-step example as its backbone, because it goes more step by step than the handouts.

## Course video sources

This article uses Spring 2026 materials. The public Spring 2025 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=25zD5qJHYsk
title: Stanford CS231N Spring 2025 Lecture 4 recording
```

Original videos: [Stanford CS231N Spring 2025 Lecture 4 recording](https://www.youtube.com/watch?v=25zD5qJHYsk)

Course and recording entries:

- [Official course / lecture source](https://cs231n.stanford.edu/schedule.html)

## The setting: linear classifiers aren't enough

L3 ended with a picture: red points inside a ring of blue points, which no straight line can separate. Switch to polar coordinates (r, θ) and the red and blue points each line up in a column, separable by a line.

L4 picks up from there and replaces the score function f = Wx with two layers:

$$
f = W_2 \max(0, W_1 x)
$$

The slides draw it with CIFAR-10 sizes: the input x has 3,072 dimensions, the hidden h has 100, and the output s has 10 class scores. L2's linear classifier learns **one** template per class. A two-layer network learns 100 templates first and lets the classes share and combine them.

More layers work the same way; the slides go on to draw a three-layer network. The more precise name for these networks is "fully-connected network", also called "multi-layer perceptron" (MLP).

## Intuition 1: remove the max and the network turns linear again

The slides ask: what if you skip the activation function and just stack W₂W₁x? You get a linear classifier again, because the product of two matrices is still a matrix. **The max(0, ·) nonlinearity is where the extra expressive power comes from.** The slides call it the activation function and say ReLU is a good default for most problems.

A few practical points from the slides:

- **Naming**: a network with two weight layers is a "2-layer Neural Net" or "1-hidden-layer Neural Net", and so on.
- **Training a two-layer network takes about 20 lines of numpy**: define the network, run the forward pass, compute analytic gradients, do gradient descent. The slides show the full code.
- **More neurons means more capacity. But don't shrink the network as a regularizer**; use stronger regularization instead.
- **Be careful with brain analogies.** Biological neurons come in many types, dendrites can do complex nonlinear computation, and synapses aren't a single weight. The slides also cite [Xie et al. (ICCV 2019)](https://arxiv.org/abs/1904.01569), where randomly wired networks work too, to make the point that regular layers are there for computational efficiency, not to imitate the brain.

## Intuition 2: why a computational graph

Plug the two-layer network into L2's hinge loss and L3's regularization, and the slides write the full loss:

$$
L = \frac{1}{N}\sum_{i=1}^{N} L_i + \lambda R(W_1) + \lambda R(W_2)
$$

Then they list three problems with deriving ∇W₁L and ∇W₂L on paper: it's tedious and needs lots of matrix calculus; switching the loss (say, from hinge to softmax) means re-deriving everything; and it's infeasible for complex models. The slides show computational graphs for AlexNet and a Neural Turing Machine to make the point.

The fix is **computational graphs plus backpropagation**. Break the function into basic operations. Each node does two things: compute its output on the forward pass, and on the backward pass multiply the incoming gradient by its own local gradient and pass it on. The Section 2 slides put the payoff in one sentence: each node only needs to know its own operation and the upstream gradient, nothing else, and that's what makes backprop modular and scalable.

## Intuition 3: four gates, four gradient flows

The slides group the gradient behavior of common nodes into four patterns, which Section 2 calls a "visual toolkit for tracing gradients":

| Gate | How the gradient flows | Nickname |
|---|---|---|
| add | Both inputs get the same upstream gradient | Distributor |
| mul | Each input gets the upstream gradient times the **other** input's value | Swap multiplier |
| max | Only the larger input gets the gradient; the other gets 0 | Router |
| copy (branch) | Gradients coming back along several paths are summed | Adder |

ReLU is a max gate: the gradient passes through where the input was positive and dies where it was zero or below. With these four in hand, you can sketch most of the backward functions in [A1](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet-en) on paper before writing them.

## Mechanics: from scalars to matrices

<details>
<summary>Warm-up: f(x, y, z) = (x + y) · z</summary>

The slides and Section 2 use the same example: x = −2, y = 5, z = −4.

Forward: q = x + y = 3, f = q · z = −12.

Backward, starting from f (∂f/∂f = 1):

- mul gate: ∂f/∂z = q = 3, ∂f/∂q = z = −4.
- add gate: both local gradients are 1, so ∂f/∂x = ∂f/∂y = −4 × 1 = −4.

That's the core formula of the whole method:

$$
\text{downstream gradient} = \underbrace{\frac{\partial L}{\partial \text{output}}}_{\text{upstream}} \times \underbrace{\frac{\partial\,\text{output}}{\partial\,\text{input}}}_{\text{local}}
$$

</details>

<details>
<summary>Sigmoid: the same function can be drawn as different graphs</summary>

The slides' second example is a sigmoid neuron. They first break it into many small nodes and multiply by each local gradient on the way back, then point out that **the graph representation isn't unique**; choose one where the local gradients are easy to write. Treat the whole sigmoid as one node and its local gradient is:

$$
\frac{d\sigma(x)}{dx} = (1-\sigma(x))\,\sigma(x)
$$

Section 2 calls this the sigmoid trick: the local gradient only needs the output you already computed and cached on the forward pass.

</details>

<details>
<summary>Implementation: the forward / backward API</summary>

The slides first show "flat" code (compute the forward pass line by line, then the backward pass line by line in reverse), then a modular version: each gate is an object with `forward()` and `backward()` methods, and `forward` caches whatever `backward` will need. They then show the source of PyTorch's sigmoid layer to make the point that real frameworks have exactly this structure.

The last three bullets of the summary slide are the spec for this API:

- Implementations maintain a graph structure, where the nodes implement forward()/backward().
- forward: compute the result of an operation and save any intermediates needed for gradient computation in memory.
- backward: apply the chain rule to compute the gradient of the loss with respect to the inputs.

</details>

<details>
<summary>Vectors and matrices: the gradient always has the variable's shape</summary>

The slides start with three kinds of derivatives:

| Mapping | Derivative is | Meaning |
|---|---|---|
| scalar → scalar | Regular derivative | If x changes a little, how much does y change |
| vector → scalar | Gradient | If each element of x changes a little, how much does y change |
| vector → vector | Jacobian | If each element of x changes a little, how much does each element of y change |

The loss is always a scalar, so **dL/dx always has the same shape as x**. Section 2 treats this as a "shape rule" for checking your own derivations.

The slides use elementwise ReLU as an example. Its Jacobian is zero everywhere off the diagonal, so you never build the Jacobian explicitly. You use implicit multiplication instead (zero out the upstream gradient where the input was ≤ 0).

Matrix multiply y = xw is more extreme. With N = 64 and D = M = 4,096, the slides note each Jacobian takes about 256 GB of memory. Reasoning element by element gives:

$$
\frac{\partial L}{\partial x} = \frac{\partial L}{\partial y}\, w^{\top} \qquad \frac{\partial L}{\partial w} = x^{\top} \frac{\partial L}{\partial y}
$$

The slides' mnemonic: **it's the only way to make the shapes match up**. The full elementwise derivation is in the official handout [linear-backprop.pdf](https://cs231n.stanford.edu/handouts/linear-backprop.pdf) (Justin Johnson, 7 pages), which expands every term for a small N = 2, D = 2, M = 3 case.

</details>

<details>
<summary>Section 2's five-step example: a real binary classifier</summary>

The [Section 2 slides](https://cs231n.stanford.edu/slides/2026/section_2_backprop.pdf) (Favour Nerrise, Spring 2026, 22 pages) apply all of this to a complete network:

$$
f_\theta(x) = \sigma\big(\max(0, x w_1)\, w_2 + b\big), \quad w_1 \in \mathbb{R}^{2\times 3},\ w_2 \in \mathbb{R}^{3\times 1},\ b \in \mathbb{R}
$$

The data is X ∈ ℝ^{N×2} with labels y ∈ {0, 1}, and the loss is binary cross-entropy. The graph is X → ×w₁ → ReLU → ×w₂ → +b → σ → BCE. Backprop goes right to left in five steps:

1. **BCE node**: it's the root, so the upstream gradient is 1; differentiate directly with respect to y_pred.
2. **Sigmoid node**: local gradient y_pred(1 − y_pred), using the value cached on the forward pass.
3. **Linear layer z = h w₂ + b**: ∂ℓ/∂w₂ = hᵀ ∂ℓ/∂z; b is broadcast across the batch, so ∂ℓ/∂b sums ∂ℓ/∂z over the batch; pass back ∂ℓ/∂h = ∂ℓ/∂z · w₂ᵀ.
4. **ReLU node**: a max gate; multiply the upstream gradient by 1[Xw₁ > 0].
5. **Linear layer Xw₁**: the same pattern as step 3, ∂ℓ/∂w₁ = Xᵀ ∂ℓ/∂(Xw₁).

Each step comes with a shape check, e.g. ∂ℓ/∂w₂ is ℝ^{3×1} = ℝ^{3×N} · ℝ^{N×1}. The last line is L3's gradient descent: θ ← θ − α∇θℓ. The appendix also derives the elementwise gradients of a batched linear layer Y = XW.

</details>

## Back to the models: the Colab runs the five-step example

The [Backprop Colab](https://colab.research.google.com/github/cs231n/cs231n.github.io/blob/master/backprop.ipynb) that goes with Section 2 says up front that Favour Nerrise revised it for Spring 2026, and it pins Python 3.11.13 to match the assignments. It maps one-to-one onto the five-step example:

1. Generate a 1,000-point concentric-circles dataset with `sklearn.datasets.make_circles`: the inner circle is class 1, the outer is class 0, not linearly separable.
2. Define `relu`, `sigmoid`, and an `MLPClassifier` with `forward()` and `backward()` (3 hidden neurons).
3. Run a training loop of forward, BCE, backward, update, and plot the loss curve and accuracy.
4. **Gradient check**: verify `backward()` with the central difference (f(x+h) − f(x−h)) / 2h, echoing L3's "train with analytic gradients, check with numerical ones".
5. Interpret the learned weights geometrically: each column of w₁, through the ReLU, defines a half-plane, and the three hidden neurons together cut the input space into regions.
6. **Exercise**: `MLPClassifierExercise` leaves blanks in `backward()` for you to fill in following Steps 1–5, then verify with a gradient check.

This Colab is the best warm-up before [A1](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet-en). A1's Q3 has you write affine and ReLU forward/backward in `cs231n/layers.py` and assemble a two-layer network; Q5 generalizes it to any depth. The style is this lecture's forward/backward API: each function returns a cache for the backward pass.

The last slide of L4 says "Next Time: Convolutional Neural Networks!". A fully connected network flattens a 32×32×3 image into a 3,072-dimensional vector and throws away the spatial structure. [L5](/posts/ai/2026-09-30-cs231n-cnn-image-classification-en) brings it back.

### What each material is good for

| Material | Contents | Best for |
|---|---|---|
| [lecture_4.pdf](https://cs231n.stanford.edu/slides/2026/lecture_4.pdf) | MLPs, computational graphs, the four gates, vector and matrix backprop | Getting the full picture the first time |
| [optimization-2 notes](https://cs231n.github.io/optimization-2/) | Scalar examples, chain rule, modular sigmoid, "staged computation", patterns in backward flow, gradients of vectorized operations | A written step-by-step explanation; the notes stress breaking functions into modules with easy local gradients and caching forward intermediates |
| [derivatives.pdf](https://cs231n.stanford.edu/handouts/derivatives.pdf) | Justin Johnson's 4-page handout: derivatives from scalars through gradients and Jacobians to tensors, plus vectorization | Anyone unsure about differentiating vectors with respect to matrices |
| [linear-backprop.pdf](https://cs231n.stanford.edu/handouts/linear-backprop.pdf) | Elementwise derivation of minibatch backprop through a linear layer | Confirming why xᵀ and wᵀ go where they do |
| [section_2_backprop.pdf](https://cs231n.stanford.edu/slides/2026/section_2_backprop.pdf) + [Colab](https://colab.research.google.com/github/cs231n/cs231n.github.io/blob/master/backprop.ipynb) | Five-step example and runnable code | Checking it yourself |

## Going deeper

The schedule lists these suggested readings under L4:

- [LeCun et al., Efficient BackProp](https://cs231n.stanford.edu/papers/lecun-98b.pdf), a PDF hosted on cs231n.stanford.edu.
- [colah: Calculus on Computational Graphs: Backpropagation](http://colah.github.io/posts/2015-08-Backprop/)
- [Nielsen, Neural Networks and Deep Learning, Chapter 2](http://neuralnetworksanddeeplearning.com/chap2.html)
- [Why Momentum Really Works](https://distill.pub/2017/momentum/) (more relevant to L3's optimizers)

Posts on this site that cover the same ground from other angles:

- [CMU 11-785 Lecture 5: Backpropagation](/posts/ai/2026-08-22-cmu-11785-05-backpropagation-en)
- [CS224N: Backpropagation and Neural Networks](/posts/ai/2026-08-22-cs224n-backprop-neural-nets-en)
- [MIT 6.7960 guide](/posts/ai/2026-08-26-mit-67960-deep-learning-guide-en)
- Calculus and probability prerequisites: [Stanford CS229 guide](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en), [Stanford CS109 guide](/posts/learning/2026-08-21-stanford-cs109-probability-en)

## How to self-study it

1. Watch the [2025 Lecture 4 recording](https://www.youtube.com/watch?v=25zD5qJHYsk) alongside the [slides linked from the 2026 schedule](https://cs231n.stanford.edu/slides/2026/lecture_4.pdf).
2. Read the [Section 2 slides](https://cs231n.stanford.edu/slides/2026/section_2_backprop.pdf), and at every step write down the shapes yourself before reading on.
3. Open the [Backprop Colab](https://colab.research.google.com/github/cs231n/cs231n.github.io/blob/master/backprop.ipynb), run the demo, then do the final `MLPClassifierExercise` and confirm it with a gradient check.
4. When matrix derivatives trip you up, go back to the 2×2×3 example in [linear-backprop.pdf](https://cs231n.stanford.edu/handouts/linear-backprop.pdf).

One thing you can do tonight: draw the computational graph for f(x, y, z) = (x + y) · z on paper, plug in x = −2, y = 5, z = −4, write out the three gradients using only "add distributes, mul swaps", and check them against a numpy numerical gradient.

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS231N course home (Spring 2026)](https://cs231n.stanford.edu/) — instructors, grading, Canvas-only recordings
- [CS231N Spring 2026 schedule](https://cs231n.stanford.edu/schedule.html) — L4 topics, notes and handout links, suggested readings, the 4/10 Backprop Review Session
- [Lecture 4 slides: Neural Networks and Backpropagation (as linked from the 2026 schedule)](https://cs231n.stanford.edu/slides/2026/lecture_4.pdf) — MLPs, computational graphs, gate patterns, matrix backprop, the 256 GB example
- [Section 2 slides: An Exercise in Backpropagation (Spring 2026)](https://cs231n.stanford.edu/slides/2026/section_2_backprop.pdf) — five-step example and the shape rule
- [CS231N Backpropagation Review Colab](https://colab.research.google.com/github/cs231n/cs231n.github.io/blob/master/backprop.ipynb) — concentric circles, MLPClassifier, gradient check, exercise
- [Justin Johnson, Derivatives, Backpropagation, and Vectorization](https://cs231n.stanford.edu/handouts/derivatives.pdf)
- [Justin Johnson, Backpropagation for a Linear Layer](https://cs231n.stanford.edu/handouts/linear-backprop.pdf)
- [CS231N notes: Backpropagation, Intuitions](https://cs231n.github.io/optimization-2/)
- [Stanford CS231N Spring 2025 Lecture 4 recording](https://www.youtube.com/watch?v=25zD5qJHYsk)
- [Assignment 1 (2026)](https://cs231n.github.io/assignments2026/assignment1/) — Q3 two-layer network, Q5 fully connected networks
- [Xie et al., Exploring Randomly Wired Neural Networks for Image Recognition (ICCV 2019)](https://arxiv.org/abs/1904.01569)
- [LeCun et al., Efficient BackProp](https://cs231n.stanford.edu/papers/lecun-98b.pdf)
