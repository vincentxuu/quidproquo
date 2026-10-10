---
title: "Hsuan-Tien Lin's ML Techniques T12–T13: Neural Networks and Deep Learning (Autoencoders, PCA)"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, neural-networks, backpropagation, pca, dimensionality-reduction]
lang: en
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 14
tldr: "Lectures 12 and 13 of Machine Learning Techniques open the third part, distilling hidden features. T12 starts from a linear combination of perceptrons: two layers can build AND and OR but not XOR, and one more layer fixes that, which is the multi-layer perceptron. It then replaces sign with tanh, derives backprop, and covers non-convex optimization, d_vc = O(VD), weight elimination, and early stopping. T13 discusses the challenges of deep networks, uses autoencoders as information-preserving encodings for layer-wise pre-training, treats denoising as regularization, and proves that the optimal linear autoencoder is spanned by the top eigenvectors of XᵀX, which is PCA. The videos date from 2016; modern deep learning is covered by the Fall 2024 302u/303u slides. Practice: Fall 2024 HW7 Q4, Q9, and bonus Q13."
description: "A guide to Lecture 12 (Neural Network) and Lecture 13 (Deep Learning) of NTU Hsuan-Tien Lin's Machine Learning Techniques: from aggregation of perceptrons to multi-layer perceptrons, the NNet hypothesis with tanh, the backprop derivation, optimization and VC dimension, weight decay, weight elimination, and early stopping, the challenges of deep networks and pre-training, basic and denoising autoencoders, and linear autoencoders and PCA, with LFD e-Chapter 7 sections, the matching Fall 2024 HW7 problems, and links to this site's 11-785, CS230, and MIT 6.7960 guides."
draft: false
glossary:
  - term: "backpropagation"
    aliases: ["backprop"]
    definition: "Compute every layer's output x^(ℓ) in a forward pass, then compute each neuron's δ_j^(ℓ) = ∂e_n/∂s_j^(ℓ) backward from the output layer; the gradient is x_i^(ℓ−1)·δ_j^(ℓ)."
    context: "T12 uses it to compute gradients for all NNet weights efficiently before running (mini-batch) SGD."
  - term: "autoencoder"
    aliases: ["denoising autoencoder"]
    definition: "A d—d̃—d neural network trained so that g(x) ≈ x. The middle layer is an information-preserving representation; the denoising version uses a noisy x̃ as input and the clean x as the target."
    context: "T13 uses it for layer-wise pre-training of deep networks and reads denoising as regularization through artificial noise."
  - term: "PCA"
    aliases: ["principal component analysis"]
    definition: "Subtract the mean from the data, then project onto the eigenvectors of XᵀX with the d̃ largest eigenvalues for linear dimension reduction."
    context: "T13 derives it as the optimal solution of a linear autoencoder with tied weights and no bias term."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning)

> **Sources**: The core material is the [MOOC version](https://www.csie.ntu.edu.tw/~htlin/mooc/) of Machine Learning Techniques: [212_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/212_handout.pdf) (Neural Network), [213_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/213_handout.pdf) (Deep Learning), and videos 46–53 of the [Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2). Textbook sections follow the [LFD](http://amlbook.com) e-Chapter 7 sections listed on the [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/). Homework references come from [Fall 2024 HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf). All facts were checked against the originals on 2026-09-30. The lectures are taught in Mandarin; the slides are in English. Access level: the MOOC alone is **A2**; adding the Fall 2024 homework PDFs brings it to **A3 (minus the grading chain)**. There are no official solutions, and Gradescope and NTU COOL are for enrolled students only.

**Series**: Previous: [Decision Trees, Random Forests, and Gradient Boosted Trees](/posts/ai/2026-09-30-ntu-htlin-ml-decision-tree-random-forest-gbdt-en) | Next: [RBF Networks, k-Means, and Matrix Factorization](/posts/ai/2026-09-30-ntu-htlin-ml-rbf-network-matrix-factorization-en) | [Series overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en)

The first part of Techniques packs many features in with kernels; the second combines predictive features with aggregation. The third part, "Distilling Implicit Features: Extraction Models," goes in a different direction. Instead of people choosing features, the model **extracts** hidden features from the data itself. The four models in T12–T15 (neural networks, deep learning, RBF networks, matrix factorization) are all variations on this theme.

One piece of context matters for these two lectures. The videos were uploaded in 2016, when deep learning was "gaining attention in recent years" (the slides' words). So T13 centers on layer-wise pre-training and autoencoders, not the ReLU, Adam, or Transformers common today. In Fall 2024 Lin added two modern deep learning slide decks, 302u and 303u, which this series covers in [post 16](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning-en).

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=GwRS2YJv2Ck
title: Motivation
```

```youtube
url: https://www.youtube.com/watch?v=giOcWMbi1bU
title: Neural Network Hypothesis
```

Original videos: [Motivation](https://www.youtube.com/watch?v=GwRS2YJv2Ck)、[Neural Network Hypothesis](https://www.youtube.com/watch?v=giOcWMbi1bU)、[Neural Network Learning](https://www.youtube.com/watch?v=Z26n4YGNWvQ)、[Optimization and Regularization](https://www.youtube.com/watch?v=z2tHzMzoOOs)、[Deep Neural Network](https://www.youtube.com/watch?v=H1czfox0Nog)、[Autoencoder](https://www.youtube.com/watch?v=eBVPQ4fgs_k)、[Denoising Autoencoder](https://www.youtube.com/watch?v=gx2Vfw8S--0)、[Principal Component Analysis](https://www.youtube.com/watch?v=Bgc4UY8567A)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## Where these lectures sit

| Version | Week | Slides | LFD (as listed on the course page) |
|---|---|---|---|
| MOOC | Techniques T12, T13 | 212, 213 | — |
| [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) | W13 (11/25) | [212u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/212u_handout.pdf), [213u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/213u_handout.pdf) | 212u: e-7.1, e-7.2, e-7.3, e-7.4 (selected parts); 213u: e-7.6 |
| [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) | W15 (12/16), after the W14 final exam | 212u and 213u currently return 404 (not released yet) | Same |

LFD's e-Chapters are online chapters covering topics not in the printed book; see [amlbook.com](http://amlbook.com) for access.

## T12 Neural Network

Videos: [Motivation](https://www.youtube.com/watch?v=GwRS2YJv2Ck), [Neural Network Hypothesis](https://www.youtube.com/watch?v=giOcWMbi1bU), [Neural Network Learning](https://www.youtube.com/watch?v=Z26n4YGNWvQ), [Optimization and Regularization](https://www.youtube.com/watch?v=z2tHzMzoOOs)

### Starting from a linear combination of perceptrons

T12 continues in the language of the previous part: G(x) = sign(Σ α_t·sign(w_tᵀx)) is linear aggregation with perceptrons as the g_t. It has two layers of weights (w_t and α) and two layers of sign functions.

What boundaries can this G draw? The slides start with logic operations. G(x) = sign(−1 + g_1(x) + g_2(x)) outputs +1 only when both g_1 and g_2 are +1, which is AND; OR and NOT can be built similarly.

Then come power and limits. The slides approximate a smooth target boundary with 8 and then 16 perceptrons; with enough perceptrons you can approximate any smooth boundary, and Foundations already showed that convex-set hypotheses have infinite d_vc. But it can't build XOR(g_1, g_2), because XOR is not linearly separable in the space φ(x) = (g_1(x), g_2(x)).

The fix is one more layer of transforms: XOR(g_1, g_2) = OR(AND(−g_1, g_2), AND(g_1, −g_2)). That is the multi-layer perceptron. The slides' progression: perceptron (simple) → aggregation of perceptrons (powerful) → multi-layer perceptrons (more powerful). They also note that neural networks are bio-inspired models, and inspired is all.

### The NNet hypothesis: a linear output, tanh in the hidden layers

The output layer is just a linear model, s = wᵀφ^(2)(φ^(1)(x)). Any of the three linear models from Foundations fits: sign with 0/1 error, identity with squared error, logistic with cross-entropy. From here T12 uses regression with squared error.

What transformation should the hidden layers use? All-linear makes the whole network linear and not very useful; sign is discrete and hard to optimize over w. The popular choice is **tanh**. It is an "analog" approximation of sign, easier to optimize, and somewhat closer to biological neurons. tanh(s) = (exp(s) − exp(−s))/(exp(s) + exp(−s)) = 2θ(2s) − 1, where θ is the logistic function from Foundations.

In a d^(0)-d^(1)-…-d^(L) network, each layer ℓ computes scores s_j^(ℓ) = Σ_i w_ij^(ℓ) x_i^(ℓ−1); hidden outputs are x_j^(ℓ) = tanh(s_j^(ℓ)), and the output layer takes s directly. Physically, each layer is a transform learned from data that checks whether x "matches" the patterns in its weight vectors. The slides sum it up as pattern extraction with layers of connection weights.

### Backprop: computing gradients efficiently

The goal is to find all w_ij that minimize E_in. With a single hidden layer the network is just aggregation of perceptrons, and gradient boosting could add hidden neurons one at a time; with multiple layers that gets hard. So run (stochastic) gradient descent on each example's error e_n = (y_n − NNet(x_n))². The key is computing ∂e_n/∂w_ij^(ℓ).

<details>
<summary>Derivation: δ propagates backward from the output layer</summary>

**Output layer** (ℓ = L): e_n = (y_n − s_1^(L))², so

∂e_n/∂w_i1^(L) = −2(y_n − s_1^(L))·x_i^(L−1)

**General layer**: the chain rule gives ∂e_n/∂w_ij^(ℓ) = δ_j^(ℓ)·x_i^(ℓ−1), where δ_j^(ℓ) = ∂e_n/∂s_j^(ℓ). At the output layer, δ_1^(L) = −2(y_n − s_1^(L)).

**Computing δ backward**: s_j^(ℓ) passes through tanh to become x_j^(ℓ), which then affects every s_k^(ℓ+1) in the next layer through w_jk^(ℓ+1). So

δ_j^(ℓ) = Σ_k δ_k^(ℓ+1)·w_jk^(ℓ+1)·tanh′(s_j^(ℓ))

Every layer's δ can be computed from the next layer's δ.

</details>

The backprop algorithm has four steps: pick a random n; compute all x_i^(ℓ) forward; compute all δ_j^(ℓ) backward; update by gradient descent w_ij^(ℓ) ← w_ij^(ℓ) − η·x_i^(ℓ−1)·δ_j^(ℓ). The slides add that the first three steps are sometimes done many times (in parallel) and the update uses the average of x_i^(ℓ−1)δ_j^(ℓ). That is called mini-batch.

### Optimization and regularization

**Optimization is hard but works in practice.** With multiple hidden layers, E_in is generally non-convex. GD/SGD with backprop only reaches a local minimum, and different initial weights lead to different local minima. Large weights saturate tanh and shrink the gradient. The slides' advice: try some random and small initial values.

**VC dimension.** With tanh-like transfer functions, roughly d_vc = O(VD), where V is the number of neurons and D the number of weights. With enough neurons the network can approximate "anything," but it can also overfit.

**Regularization options:**

- **Weight decay (L2)**: shrinks large weights a lot and small weights a little, but never quite to zero.
- **L1**: can drive weights to zero and effectively lower d_vc, but isn't differentiable.
- **Weight elimination**: a scaled L2, Σ (w_ij)² / (1 + (w_ij)²), which gives both large and small weights a medium shrink.
- **Early stopping**: the more steps GD/SGD takes, the more weight combinations it visits, and the larger the effective d_vc. Stopping in the middle controls model complexity. When to stop? Use validation.

## T13 Deep Learning

Videos: [Deep Neural Network](https://www.youtube.com/watch?v=H1czfox0Nog), [Autoencoder](https://www.youtube.com/watch?v=eBVPQ4fgs_k), [Denoising Autoencoder](https://www.youtube.com/watch?v=gx2Vfw8S--0), [Principal Component Analysis](https://www.youtube.com/watch?v=Bgc4UY8567A)

### Shallow versus deep

Each layer extracts pattern features, so how many neurons and how many layers? The slides' answer: subjectively, your design; objectively, maybe validation. Structural decisions are the key issue in applying NNets.

The slides' comparison:

| Shallow NNet | Deep NNet |
|---|---|
| More efficient to train | Challenging to train |
| Simpler structural decisions | Sophisticated structural decisions |
| Theoretically powerful enough | "Arbitrarily" powerful |
| — | Maybe more "meaningful" |

The "meaningful" example is handwritten digit recognition: the first layer extracts strokes from pixels, and later layers combine them into parts and digits. Each layer carries less of the burden, moving from simple to complex features, which suits tasks like vision and speech where raw features are hard to use.

Four challenges of deep learning and the techniques for each:

- **Difficult structural decisions**: use domain knowledge, such as convolutional NNets for images.
- **High model complexity**: less of a worry with big enough data; also use regularization that makes the model noise-tolerant, such as dropout (tolerant when the network is corrupted) and denoising (tolerant when the input is corrupted).
- **Hard optimization**: careful initialization to avoid bad local minima, called pre-training.
- **Huge computation**: new hardware and architectures, such as mini-batch on GPUs.

Lin's personal view (the slides say IMHO) is that careful regularization and initialization are the key techniques. So the rest of T13 covers the simplest pre-training technique plus one regularization technique.

### Autoencoders: learning an approximate identity function

A two-step deep learning framework: first pre-train weights layer by layer from shallow to deep (with earlier layers fixed), then fine-tune the whole network with backprop.

What should pre-training aim for? Good weights should be an **information-preserving encoding**: the next layer represents the same information differently, so you can decode accurately after encoding.

That is an autoencoder: a d—d̃—d network trained so that g_i(x) ≈ x_i, with w_ij as encoding weights and w_ji as decoding weights. Why learn an approximate identity function?

- For supervised learning: the hidden structure of the data can serve as a reasonable transform Φ(x), an "informative" representation.
- For unsupervised learning: where g(x) ≈ x the structure matches, which supports density estimation; points where g(x) is far from x are outliers.

A basic autoencoder uses squared error Σ_i (g_i(x) − x_i)², so backprop applies directly; it is shallow and easy to train. Usually d̃ < d, giving a compressed representation. The data are {(x_n, y_n = x_n)}, so it is often categorized as unsupervised learning. Sometimes the weights are tied, w_ij^(1) = w_ji^(2), as regularization.

Pre-training with autoencoders: layer ℓ's weights come from training a basic autoencoder with d̃ = d^(ℓ) on the previous layer's outputs x_n^(ℓ−1). The slides also note that many successful pre-training techniques use fancier autoencoders with different architectures and regularization.

### Denoising autoencoders: noise as a hint

Deep networks have high model complexity and need regularization: structural constraints, weight decay or weight elimination, early stopping. These are old friends. T13 adds a new one.

Back to the causes of overfitting in Foundations L13: little data, lots of noise, and excessive model power each make overfitting worse. How do you deal with noise? The direct option is data cleaning. The slides propose a "wild" option: **add noise to the data on purpose**.

The idea is that a robust autoencoder should not only give g(x) ≈ x but also g(x̃) ≈ x when x̃ is slightly different from x. So a denoising autoencoder trains a basic autoencoder on {(x̃_n, y_n = x_n)}, with x̃_n = x_n + artificial noise. It often replaces the basic autoencoder in deep learning and is useful for image denoising. The slides' conclusion: artificial noise (a hint) is itself regularization, and it is practically useful for other NNets and models too.

### A linear autoencoder is PCA

The last section asks: what if the autoencoder is linear? The slides' reasoning is "linear first": it may be more efficient and less prone to overfitting.

Add three conditions: drop x_0 (so input and output dimensions match), tie the weights w_ij^(1) = w_ji^(2), and require d̃ < d (so the solution isn't trivial). The hypothesis becomes h(x) = WWᵀx with W a d × d̃ matrix, and E_in(W) = (1/N) Σ_n ‖x_n − WWᵀx_n‖².

This is a fourth-order polynomial in w and hard to solve directly. The slides reframe it with linear algebra:

<details>
<summary>Derivation: the optimal W is the top d̃ eigenvectors of XᵀX</summary>

Eigendecompose WWᵀ = VΓVᵀ: V is a d × d orthogonal matrix, and Γ is diagonal with at most d̃ nonzero entries. So WWᵀx_n reads in three steps: Vᵀ rotates (or reflects) into a new basis, Γ zeros out at least d − d̃ components and scales the others, and V rotates back. Meanwhile x_n = VIVᵀx_n.

**Optimal Γ**: rotation doesn't change length, so you minimize ‖(I − Γ)(some vector)‖² and want as many zeros in I − Γ as possible. Under rank ≤ d̃, the optimal Γ has d̃ diagonal entries equal to 1 and the rest 0.

**Optimal V**: the problem becomes maximizing the length kept after projection. For d̃ = 1, only the first row v of Vᵀ matters:

max_v Σ_n vᵀx_n x_nᵀv subject to vᵀv = 1

A Lagrange multiplier gives Σ_n x_n x_nᵀ v = λv, so the optimal v is the eigenvector of XᵀX with the largest eigenvalue. For general d̃, take the top d̃ eigenvectors.

</details>

The full algorithm: compute the mean x̄, subtract it from every x_n, compute the top d̃ eigenvectors w_1…w_d̃ of XᵀX, and return the feature transform Φ(x) = W(x − x̄).

The slides end by separating the two. A linear autoencoder maximizes the squared magnitude after projection; principal component analysis (PCA) from statistics maximizes the variance after projection, which is what the mean-subtraction step in the algorithm is for. Both are useful for linear dimension reduction, and PCA is more popular.

## Practice with the Fall 2024 homework

The problems in [HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf) (released 2024-12-02, due 12-16) that map to these two lectures:

| Problem | Type | What it practices |
|---|---|---|
| Q4 | Auto-graded | With 20 input units, 3 output units, and 50 hidden units (counting each x_0), hidden units arranged in any number of fully connected layers: what is the maximum possible number of weights? |
| Q9 | Human-graded | For a one-hidden-layer network with tanh on every neuron (including the output) and all initial weights set to 0.5, prove that after backprop (mini-batch GD) the first-layer weights satisfy w_ij^(1) = w_i,j+1^(1) |
| Q13 (bonus) | Human-graded | The problem links a chatGPT answer claiming a d-(d−1)-1 feed-forward network with sign units can implement d-dimensional XOR; point out where it diverges from the 2023 fall bonus homework and prove mathematically that it's impossible |

Q9 is worth thinking about alongside T12's advice to "try some random and small initial values." For Q4, a small script that enumerates every layer arrangement makes a good check. There are no official solutions. Q13 requires you to judge for yourself which step of chatGPT's argument breaks, which is a problem type the Fall 2024 homework uses deliberately. The full homework walkthrough is in [Techniques homework and final project](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en).

## How to use these two lectures for self-study

1. Start with T12's [Neural Network Learning](https://www.youtube.com/watch?v=Z26n4YGNWvQ). Work through the δ recursion in the collapsed derivation, then write a d-3-1 tanh network in numpy and check its gradients against numerical differentiation.
2. T13's autoencoders and pre-training were mainstream practice in 2016. Understanding why pre-training was needed then matters more than memorizing the steps. For modern training techniques, continue with [post 16](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning-en) of this series.
3. One thing to do tonight: on any small dataset, compute the top two principal components with numpy's `np.linalg.eigh(X.T @ X)` and with scikit-learn's `PCA`, and see how much subtracting the mean changes the result. That is the difference on the slides' last page.

## Further reading

These series on this site overlap with this post, but this post stands on its own; they are links only:

- [Reading CMU 11-785 Deep Learning](/posts/ai/2026-08-22-cmu-11785-course-overview-en), especially [Lecture 5: Backpropagation](/posts/ai/2026-08-22-cmu-11785-05-backpropagation-en): a full course on deep learning.
- [Reading Stanford CS230](/en/series/cs230): focused on deep learning project practice.
- [Reading MIT 6.7960](/posts/ai/2026-08-26-mit-67960-deep-learning-guide-en): graduate-level deep learning.
- [Reading NTU Hung-yi Lee Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en): NTU's parallel track, leaning toward deep learning and generative AI.
- [Harvard CS181 HW4: Autoencoders and VAEs](/posts/tech/2026-09-29-harvard-cs181-hw4-autoencoder-vae-en) and [CMU 10-301 HW5: Neural Networks](/posts/learning/2026-08-22-cmu-10301-hw5-neural-networks-en): homework on the same topics from other schools.

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/) — section titles and slides for Techniques T12 and T13
- [Lecture 12: Neural Network (212_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/212_handout.pdf) — perceptron aggregation, XOR, tanh, backprop, d_vc = O(VD), weight elimination, early stopping
- [Lecture 13: Deep Learning (213_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/213_handout.pdf) — shallow vs. deep, four challenges, autoencoder pre-training, denoising, linear autoencoders and PCA
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2) — videos 46–53 (lectures in Mandarin)
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) — W13 schedule, 212u/213u slides, and LFD e-7 sections
- [Fall 2024 Homework 7 (hw7.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) — W14 final exam and W15 schedule
- [Learning from Data textbook site](http://amlbook.com)
- On this site: [Series overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en)
