---
title: "CS231N L3: Regularization and Optimization, from Random Search to AdamW and Learning Rate Schedules"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, stanford, ai-course, computer-vision, deep-learning, optimization, gradient-descent]
lang: en
series:
  name: "Reading Stanford CS231N"
  order: 3
tldr: "L2 gave us a score function and a loss. L3 answers how to find a good W. The first half covers regularization: add λR(W) next to the data loss so the model does not fit the training data too well. The second half is a lineage of optimizers. SGD zigzags in narrow valleys, Momentum builds up velocity, RMSProp scales each dimension's step, Adam combines the two and adds bias correction, and AdamW moves weight decay outside the moment estimates. The slides close with practical advice: Adam(W) is a good default in many cases, and SGD+Momentum can do better but needs more tuning of the learning rate and schedule."
description: "A guide to Stanford CS231N (Spring 2026) Lecture 3: why L1/L2 regularization exists, numerical vs. analytic gradients, the three problems with minibatch SGD, the update rules for Momentum, RMSProp, Adam, and AdamW, step/cosine/linear/inverse-sqrt schedules and warmup, and why second-order methods don't fit deep learning. Includes a comparison with the optimization-1 course notes and the 2025 recording."
draft: false
glossary:
  - term: "regularization"
    definition: "A penalty λR(W) added to the training objective that looks only at the weights, not the data. It expresses a preference over weights and keeps the model from fitting noise in the training set."
    context: "CS231N L3 writes it as L(W) = data loss + λR(W), where λ is a hyperparameter."
  - term: "condition number"
    definition: "The ratio of the largest to the smallest singular value of the Hessian. A large ratio means the loss is steep in some directions and flat in others."
    context: "L3 uses it to explain why SGD jitters along steep directions and crawls along shallow ones."
  - term: "AdamW"
    definition: "A variant of Adam where weight decay is not folded into the gradient (so it never enters the first- and second-moment estimates) but subtracted separately in the final update step."
    context: "The L3 slides put it side by side with standard Adam, which computes the L2 term inside the gradient."
    links:
      - label: "fast.ai: AdamW and Super-convergence"
        url: "https://www.fast.ai/posts/2018-07-02-adam-weight-decay.html"
  - term: "learning rate warmup"
    aliases: ["linear warmup", "warmup"]
    definition: "Increasing the learning rate linearly from 0 to its target value at the start of training, so a high initial rate doesn't make the loss explode."
    context: "The L3 slides give the example of a linear ramp over roughly the first 5,000 iterations."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs231n-regularization-optimization)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

> **Version note**: The slides are [CS231N](https://cs231n.stanford.edu/) Spring 2026 [lecture_3.pdf](https://cs231n.stanford.edu/slides/2026/lecture_3.pdf) (121 pages, footer dated April 7, 2026). The recording is the [Spring 2025 Lecture 3](https://www.youtube.com/watch?v=dyNGd06MWn4), because 2026 recordings are on Canvas for enrolled students only. The two may differ. The 2025 deck has 119 pages, and the keywords I spot-checked (AdaGrad, AdamW, L-BFGS, warmup) appear in both, but I did not compare them page by page. All facts were checked against official materials on 2026-09-30. Access level **A3** (defined in the [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)).

**Series**: Previous [L2: Image Classification, kNN, and Linear Classifiers](/posts/ai/2026-09-30-cs231n-image-classification-linear-en) | Next [L4: Neural Networks and Backpropagation](/posts/ai/2026-09-30-cs231n-neural-networks-backprop-en) | [Series overview](/posts/ai/2026-09-30-cs231n-course-overview-en)

Lecture 2 of [CS231N](https://cs231n.stanford.edu/) handed us three things: a dataset of (x, y) pairs, a score function f(x, W) = Wx + b, and a softmax loss that says how good the scores are. Lecture 3 asks the next question: **given a loss, how do we find a W that makes it small?**

The [2026 schedule](https://cs231n.stanford.edu/schedule.html) lists four topics for this lecture: regularization, stochastic gradient descent, Momentum/AdaGrad/Adam, and learning rate schedules. It sits in the "Deep Learning Basics" unit. Every model later in the course (CNNs, RNNs, Transformers, diffusion) reuses this toolbox.

This is the first hard post in the series, so it follows five layers: the setting, the intuition, the mechanics (formulas in collapsible blocks), how it connects to the course's models, and where to go deeper.

## Course video sources

This article uses Spring 2026 materials. The official Spring 2026 schedule (checked live on 2026-10-10) lists no recording links, and no public Spring 2026 playlist was found. The Spring 2025 recordings below come from the public Stanford Online playlist and share the lecture title, but their content may differ from the 2026 lecture, and the original recording has not been verified. Checked: 2026-10-10.

```youtube
url: https://www.youtube.com/watch?v=dyNGd06MWn4
title: Stanford CS231N | Spring 2025 | Lecture 3: Regularization and Optimization
```

Original videos: [Stanford CS231N | Spring 2025 | Lecture 3: Regularization and Optimization](https://www.youtube.com/watch?v=dyNGd06MWn4)

Course and recording entries:

- [Official course / lecture source](https://cs231n.stanford.edu/schedule.html)

## The setting: walking downhill without a map

At the start of the optimization section, the slides show a photo of a valley and a walking figure. One way to read it: the loss is altitude, W is where you stand, and the goal is the valley floor. With tens of thousands of parameters you can't see the whole terrain. You can only compute the slope under your feet.

The first strategy is deliberately bad: **try random Ws and keep the one with the lowest loss**. The slides report 15.5% test accuracy this way, with a note that the state of the art is about 99.7%. The [optimization-1 course notes](https://cs231n.github.io/optimization-1/) use the same example and add that CIFAR-10 has ten classes, so random guessing gets 10%, and 15.5% isn't that bad.

The second strategy is to follow the slope. That's the thread of the whole lecture.

Before it gets there, L3 deals with a different question: **there's more than one valley floor, so which one do you want?**

## Intuition 1: regularization writes your preferences into the loss

The full objective on the slides is:

$$
L(W) = \frac{1}{N}\sum_{i=1}^{N} L_i(f(x_i, W), y_i) + \lambda R(W)
$$

The first term is the data loss, which asks the predictions to match the training data. The second is regularization, which **keeps the model from doing too well on the training data**. λ is the regularization strength, a hyperparameter.

Why stop a model from doing well? The slides use a toy example: a wiggly curve f1 that passes through every training point, and a smooth line f2. When new data arrives, f2 usually does better. The slide cites Occam's razor: among competing hypotheses that explain the data, prefer the simplest.

The slides give three reasons to regularize:

1. **Express preferences over weights.** L2 regularization, for example, likes to "spread out" the weights instead of concentrating them in a few dimensions.
2. **Keep the model simple so it works on test data.**
3. **Improve optimization by adding curvature.**

The common forms come in two groups. The simple ones are L2, L1, and elastic net (L1 + L2). The more complex ones are dropout, batch normalization, stochastic depth, and fractional pooling. This lecture only names the second group. You implement dropout and batch norm in [A2](/posts/ai/2026-09-30-cs231n-a2-batchnorm-cnn-pytorch-rnn-en).

The slides leave you a question. With input x = [1, 1, 1, 1], two weight vectors, w1 = [1, 0, 0, 0] and w2 = [0.25, 0.25, 0.25, 0.25], both give a score of 1. Which one does L2 regularization, R(W) = ΣΣ W², prefer? The slide boxes w2 and says L2 likes to spread out the weights. Which one L1 prefers is left as an open question on the slide.

## Intuition 2: the gradient tells you which way to walk

In one dimension the derivative is a slope. In many dimensions the gradient is the vector of partial derivatives. Three lines from the slides are worth keeping: the slope in any direction is the dot product of that direction with the gradient, and the direction of steepest descent is the negative gradient.

There are two ways to compute it:

| Method | How | The slides' verdict |
|---|---|---|
| Numerical gradient | Nudge each dimension by a small h and see how the loss changes | Approximate, slow, easy to write |
| Analytic gradient | Use calculus to write ∇W L directly | Exact, fast, error-prone |

In practice you use both: **always train with the analytic gradient, and check your implementation with the numerical one**. This is called a gradient check. Every place in [A1](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet-en) where you write a gradient comes with a gradient-check cell.

Once you have a gradient, gradient descent repeatedly takes a small step in the negative gradient direction. When N is large, computing the full loss for every step is too expensive, so you estimate the gradient from a small batch. The slides list 32, 64, and 128 as common sizes. That's SGD.

## Intuition 3: three problems with SGD, and the fixes

The slides sort SGD's failure cases into three problems.

**Problem 1: steep in one direction, shallow in another.** SGD jitters back and forth along the steep direction and makes slow progress along the shallow one. The slide notes that such a loss has a high condition number, meaning the ratio of the Hessian's largest to smallest singular value is large.

**Problem 2: local minima and saddle points.** The gradient is zero, so gradient descent gets stuck. Citing [Dauphin et al. (NIPS 2014)](https://arxiv.org/abs/1406.2572), the slides point out that saddle points are much more common than local minima in high dimensions.

**Problem 3: noisy gradients.** The gradient comes from a minibatch, so it's an estimate.

Each optimizer that follows responds to some of these:

| Optimizer | What it does | Which problem |
|---|---|---|
| SGD + Momentum | Accumulates past gradients into a "velocity" and keeps moving in the general direction | Jitter, saddle points, noise |
| RMSProp | Scales each dimension's step by its history of squared gradients | Damps steep directions, speeds up flat ones |
| Adam | Momentum + RMSProp, plus bias correction | Both |
| AdamW | Adam, but weight decay stays out of the moment estimates | How regularization interacts with the optimizer |

AdaGrad is on the schedule, but in the 2026 slides its full treatment sits in "Appendix / Enrichment Material (Slides from Previous Years)". The main deck only labels the second-moment line on the Adam slide as "AdaGrad / RMSProp". The key question in the appendix is what happens to AdaGrad's step size over a long time. The answer: **it decays to zero**, because AdaGrad sums every squared gradient it has ever seen. That's why RMSProp is called "leaky AdaGrad": it lets the old sum decay.

## Mechanics: what the updates look like

The code and numbers below are copied from the slides.

<details>
<summary>SGD and SGD + Momentum</summary>

SGD:

$$x_{t+1} = x_t - \alpha \nabla f(x_t)$$

SGD + Momentum:

$$v_{t+1} = \rho v_t + \nabla f(x_t), \qquad x_{t+1} = x_t - \alpha v_{t+1}$$

From the slides: the velocity is a running mean of gradients, ρ gives "friction", and typical values are 0.9 or 0.99. The source is [Sutskever et al. (ICML 2013)](https://proceedings.mlr.press/v28/sutskever13.html). The slides also warn that you'll see other formulations, but they're equivalent and produce the same sequence of x.

</details>

<details>
<summary>RMSProp</summary>

```python
grad_squared = 0
while True:
  dx = compute_gradient(x)
  grad_squared = decay_rate * grad_squared + (1 - decay_rate) * dx * dx
  x -= learning_rate * dx / (np.sqrt(grad_squared) + 1e-7)
```

Attributed to Tieleman and Hinton, 2012. Steep directions (large grad_squared) get smaller steps and flat directions get relatively larger ones. This is what "per-parameter learning rates" means.

</details>

<details>
<summary>Adam (full form)</summary>

```python
first_moment = 0
second_moment = 0
for t in range(1, num_iterations):
  dx = compute_gradient(x)
  first_moment = beta1 * first_moment + (1 - beta1) * dx          # Momentum
  second_moment = beta2 * second_moment + (1 - beta2) * dx * dx   # AdaGrad / RMSProp
  first_unbias = first_moment / (1 - beta1 ** t)                  # Bias correction
  second_unbias = second_moment / (1 - beta2 ** t)
  x -= learning_rate * first_unbias / (np.sqrt(second_unbias) + 1e-7)
```

Why bias correction? The slides first show an "almost Adam" version and ask what happens at the first timestep. Both moments start at zero, so the second moment is tiny for the first few steps. Dividing by it makes the first step huge. Bias correction compensates for estimates that start at zero. The source is [Kingma and Ba (ICLR 2015)](https://arxiv.org/abs/1412.6980).

The slides' starting values: beta1 = 0.9, beta2 = 0.999, learning_rate = 1e-3 or 5e-4, "a great starting point for many models".

</details>

<details>
<summary>AdamW: where weight decay goes</summary>

The slides ask how regularization (e.g., L2) interacts with the optimizer. The answer: it depends.

- Standard Adam: the L2 term is part of the gradient dx, so it **enters** the first- and second-moment estimates and gets rescaled by the RMSProp term.
- AdamW: the weight decay term is added **after the moments are computed**, directly on the final update line.

The slide includes a plot of ImageNet accuracy vs. training epoch from a [2018 fast.ai post](https://www.fast.ai/posts/2018-07-02-adam-weight-decay.html).

</details>

<details>
<summary>Learning rate schedules and warmup</summary>

SGD, Momentum, RMSProp, Adam, and AdamW all have a learning rate. The slides show several learning rate curves and ask which one is best. The answer: in reality, any of them could be a good learning rate. What differs is when you use it.

| Schedule | Formula | Example on the slides |
|---|---|---|
| Step | Drop at a few fixed points | ResNets multiply the LR by 0.1 after epochs 30, 60, and 90 |
| Cosine | $\alpha_t = \frac{1}{2}\alpha_0(1+\cos(t\pi/T))$ | Cites SGDR, GPT, SlowFast, Sparse Transformers |
| Linear | $\alpha_t = \alpha_0(1 - t/T)$ | Cites BERT |
| Inverse sqrt | $\alpha_t = \alpha_0/\sqrt{t}$ | Cites Attention Is All You Need |

α₀ is the initial learning rate, α_t the rate at epoch t, and T the total number of epochs.

**Linear warmup**: a high initial learning rate can make the loss explode, so increase it linearly from 0 over roughly the first 5,000 iterations. The same slide gives a rule of thumb: if you increase the batch size by N, scale the initial learning rate by N too, citing [Goyal et al. (2017)](https://arxiv.org/abs/1706.02677).

</details>

<details>
<summary>Why second-order optimization doesn't fit deep learning</summary>

First-order methods build a linear approximation from the gradient and step toward its minimum. Second-order methods add the Hessian to build a quadratic approximation and jump straight to its minimum (Newton's method).

The slides' answer is blunt: the Hessian has O(N²) entries, inverting it takes O(N³), and N is tens or hundreds of millions of parameters. The appendix adds BFGS and L-BFGS. L-BFGS usually works very well in full-batch, deterministic settings, but it doesn't transfer well to minibatches. The slides call adapting second-order methods to large-scale stochastic settings an active research area.

</details>

## Back to the models: how the course uses this

The slides' "In practice" list has three items:

1. **Adam(W) is a good default choice in many cases**, and it often works fine even with a constant learning rate.
2. **SGD + Momentum can outperform Adam**, but it may need more tuning of the learning rate and schedule.
3. If you can afford full-batch updates, look beyond first-order methods.

These carry through to the final project. Q5 of [A1](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet-en) has you implement `sgd_momentum`, `rmsprop`, and `adam` in `cs231n/optim.py` and use them to train multi-layer fully connected networks. The starter code's Adam defaults match the slides exactly: beta1 = 0.9, beta2 = 0.999, learning_rate = 1e-3. The same notebook has an inline question on why AdaGrad's updates keep shrinking and whether Adam has the same issue. That's the appendix material.

The end of L3 already sets up the next lecture. A linear classifier can't separate data where red points sit inside a ring of blue points. Switch to polar coordinates and a line separates them. Rather than hand-design such transforms, let the model learn them: that's a two-layer neural network. But once the network gets deeper, how do you compute the gradient? That's [L4](/posts/ai/2026-09-30-cs231n-neural-networks-backprop-en).

### Slides vs. course notes

The schedule links this lecture to the [optimization-1](https://cs231n.github.io/optimization-1/) notes. They cover a different range than the slides:

- The notes use the **multiclass SVM loss**; the slides use softmax. The notes visualize the SVM loss landscape and point out that it's convex, then warn that with neural networks the objective becomes non-convex, a bumpy terrain.
- Between random search and following the gradient, the notes add a "random local search" strategy.
- The notes stop at minibatch gradient descent. They have **no** Momentum, Adam, or learning rate schedules. Those live in the "Parameter updates" section of another set of notes, [neural-networks-3](https://cs231n.github.io/neural-networks-3/), which is also where the Nesterov slides in the appendix point.

## Going deeper

- **Intuition for momentum**: the schedule lists Distill's [Why Momentum Really Works](https://distill.pub/2017/momentum/) as a suggested reading for L4, but it's most relevant here. You can drag ρ and the learning rate and watch the oscillation change.
- **Fuller notes on parameter updates**: [neural-networks-3](https://cs231n.github.io/neural-networks-3/) covers Nesterov momentum, learning rate annealing, AdaGrad/RMSProp, hyperparameter search, and practical gradient checking.
- **The same topic from another angle**: [CMU 11-785 Lecture 8: Optimizers and Regularization](/posts/ai/2026-08-22-cmu-11785-08-optimizers-regularization-en) and the [MIT 6.7960 guide](/posts/ai/2026-08-26-mit-67960-deep-learning-guide-en).
- **Shaky on vector calculus or probability**: [Stanford CS229 guide](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en), [Stanford CS109 guide](/posts/learning/2026-08-21-stanford-cs109-probability-en).

## How to self-study it

1. Watch the [2025 Lecture 3 recording](https://www.youtube.com/watch?v=dyNGd06MWn4) with the [2026 slides](https://cs231n.stanford.edu/slides/2026/lecture_3.pdf) open. Where they disagree, go with the slides.
2. Read the numerical gradient and gradient check sections of [optimization-1](https://cs231n.github.io/optimization-1/). That's where A1 most often goes wrong.
3. Copy the RMSProp and Adam code from the slides into a notebook, run them on a narrow 2-D bowl, and plot the trajectories.

One thing you can do tonight: in numpy, define f(x, y) = x² + 20y², run SGD and SGD + Momentum (ρ = 0.9) from the same starting point for 50 steps, and plot both paths. You'll see what "jitter along the steep direction, crawl along the shallow one" actually looks like.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Official sources only have Spring 2025 recordings, so the status is now related supplementary video only, and video titles use the original titles.

## References

- [CS231N course home (Spring 2026)](https://cs231n.stanford.edu/) — instructors, grading, Canvas-only recordings
- [CS231N Spring 2026 schedule](https://cs231n.stanford.edu/schedule.html) — L3 topics, optimization-1 link, L4 suggested readings
- [Lecture 3 slides: Regularization and Optimization (2026)](https://cs231n.stanford.edu/slides/2026/lecture_3.pdf) — source of every formula, code snippet, and number in this post
- [Lecture 3 slides (2025)](https://cs231n.stanford.edu/slides/2025/lecture_3.pdf) — same year as the recording, for comparison
- [Stanford CS231N Spring 2025 Lecture 3 recording](https://www.youtube.com/watch?v=dyNGd06MWn4) — public Stanford Online recording
- [CS231N notes: Optimization: Stochastic Gradient Descent](https://cs231n.github.io/optimization-1/) — SVM loss landscape, three search strategies, minibatch GD
- [CS231N notes: Neural Networks Part 3](https://cs231n.github.io/neural-networks-3/) — the Parameter updates section
- [Assignment 1 (2026)](https://cs231n.github.io/assignments2026/assignment1/) — Q5 implements SGD+Momentum, RMSProp, Adam
- [Kingma & Ba, Adam: A Method for Stochastic Optimization](https://arxiv.org/abs/1412.6980)
- [Sutskever et al., On the importance of initialization and momentum in deep learning (ICML 2013)](https://proceedings.mlr.press/v28/sutskever13.html)
- [Dauphin et al., Identifying and attacking the saddle point problem (NIPS 2014)](https://arxiv.org/abs/1406.2572)
- [Goyal et al., Accurate, Large Minibatch SGD: Training ImageNet in 1 Hour](https://arxiv.org/abs/1706.02677)
- [fast.ai, AdamW and Super-convergence is now the fastest way to train neural nets](https://www.fast.ai/posts/2018-07-02-adam-weight-decay.html)
- [Goh, Why Momentum Really Works (Distill, 2017)](https://distill.pub/2017/momentum/)
