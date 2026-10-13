---
title: "Metrized Deep Learning: Finding a Ruler That Fits the Whole Network's Weights | MIT 6.7960 Lecture 23"
date: 2026-10-13
category: tech
type: guide
tags:
  - mit-67960
  - deep-learning
  - optimization
  - modular-norm
  - spectral-norm
  - steepest-descent
  - fall-2024
lang: en
math: true
description: "MIT 6.7960 Fall 2024 OCW, Lecture 23 (Jeremy Bernstein): treat a neural network like LEGO, give every module a sensitivity, a mass and a norm, build the norm of the whole network recursively from two rules for series and parallel combination, and derive from it learning rates that do not drift with width or depth, plus modular dualization."
tldr: "Gradient descent silently assumes the weight space is Euclidean, and for neural networks it mostly is not. Bernstein's approach picks a norm for each layer (a shape-rescaled spectral norm for linear layers) and computes a norm for the whole network from two combination rules; normalize updates in it and the optimal learning rate stops drifting with width and depth. Push the same idea to duality maps and a linear layer's update becomes 'set every singular value of the gradient to 1', which is also what the nanoGPT training speed record of the time used."
draft: false
series:
  name: "Reading MIT 6.7960"
  order: 27
---

> 🌏 [中文版](/posts/tech/2026-10-13-mit-67960-l23-metrized-deep-learning)

**Video status: Videos included.** [Video source and notes](#lecture-video-source)

> **Edition**: based on **MIT 6.7960 Fall 2024 OCW** (OCW Lec 23, Metrized Deep Learning, taught by Jeremy Bernstein). This post is written from the official OCW transcript and slides. The transcript has no timestamps, so references point to content rather than times. The lecture presents the lecturer's own ongoing research, and he opens by asking the audience to stay skeptical.

---

## The Question This Lecture Answers

You double the width of a Transformer and the learning rate you tuned is no longer optimal. Why? Is there a way to keep the learning rate from needing retuning as the model changes size?

Lecture 23 of [MIT 6.7960](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) starts from an analogy. We build neural networks like LEGO: there is a box of bricks, and they can be assembled into a Transformer or into something else. Jeremy Bernstein asks: if that is how networks are built, why not build the theory the same way? If every brick came with its own theoretical description, plus rules for how properties change when two bricks are joined, then whatever you build would come with a theory automatically.

After this post you should be able to:

- Name the four attributes a module carries and the two conditions for being "well-normed."
- Use the composition and concatenation rules to compute a combined norm by hand and see how it apportions updates across layers.
- Explain why "weights minus learning rate times gradient" has a type problem, and what replaces it under the spectral norm.

The prerequisite is [Lecture 7](/posts/tech/2026-08-30-mit-67960-l07-scaling-rules-optimization-en), on steepest descent and the drift of learning rate with width; it has the same lecturer and this lecture continues it. You need the singular value decomposition of a matrix.

## What We Care About in a Brick

A layer has an input $x$, weights $w$ and an output $y$. Bernstein cares about one thing: **sensitivity**. If the input moves a little and the weights move a little, how much does the output move?

He argues the question is basic and yet nobody really understands it or teaches it. It matters for at least two reasons:

- **Optimization**: training is changing the weights of every layer.
- **Robustness**: an adversarial example is a small change in the input and a dramatic change in the output.

The lecture considers two ways to join bricks: in **series** (one on top of the other) and in **parallel** (side by side, with the input duplicated and sent to both). Series is harder, because the first brick's output is the second's input and the two are coupled.

If you can characterize the sensitivity of a single brick, and how the two combinations transform it, a library like PyTorch or JAX can be treated as a LEGO set that comes with a manual.

## Why a Norm Is Needed

Taylor expand the loss in the weights:

$$
L(w + \Delta w) = L(w) + \nabla_w L^\top \Delta w + \tfrac12\, \Delta w^\top \nabla_w^2 L\, \Delta w + \dots
$$

If you can find a norm $\|\cdot\|$ and a sharpness $\lambda$ such that the second-order term is bounded by $\tfrac12 \lambda \|\Delta w\|^2$, and bounded tightly, you can use that bound as a description of the loss and choose the step that minimizes it. That is steepest descent. Different norms give different optimization algorithms, so the question becomes: **what is a good norm for a neural network?**

The slides reduce the question in three steps.

**Step one.** In deep learning the loss is a composite: the error measure $\ell$ applied to the network $f$. The second-order term of such a function splits into two pieces (the Gauss-Newton decomposition), one involving the curvature of the network and one the curvature of the error measure.

**Step two.** Suppose there is a good norm on the network's **output**. That is reasonable, since the output is usually just a vector and the candidates are few (L1, L2, L∞, RMS). With it, both pieces can be bounded.

**Step three.** So it suffices to find a norm on the **weight space** under which the network satisfies two conditions:

$$
\|\nabla_w f\, \Delta w\|^2 \le \delta\, \|\Delta w\|^2
\qquad
\|\Delta w\, \nabla_w^2 f\, \Delta w\| \le \alpha\, \|\Delta w\|^2
$$

The first says the network is Lipschitz continuous in its weights, the second that it is Lipschitz smooth. The conditions are written as on the slides, with the first in terms of squared norms.

Said without reference to optimization: these two conditions bound the first- and second-order terms of the network's Taylor expansion in its weights. With such a norm, every time you change the weights you can directly predict how much the output can change at most.

A student asks whether these conditions hold for any norm. Bernstein answers that they do, because all norms are equivalent: if the conditions hold in one norm they hold in any other, but the guarantee can be far tighter in one than in another. What we want is the norm in which they hold very tightly.

## Inducing the Norm Recursively

The weight space of a whole network is complicated and finding a norm for it directly is hard. The approach works in stages:

1. First choose norms on the spaces where the **feature vectors** live (few options).
2. Once the input and output spaces have norms, the linear operator between them has an **induced operator norm**. This gives a norm on each layer's weights.
3. Then a procedure **combines** the per-layer norms into one norm on the whole network.

The third step is the heart of the lecture, and Bernstein calls it the theory of modules.

## The Theory of Modules

Programming has a pattern called the combinator pattern: define a small set of simple primitives and a few combinators, and build complex structures from them. Here the abstract type is the **module**: something with inputs, weights and an output. A single layer is a module, and so is a whole network.

### The Four Attributes of a Module

| Attribute | Meaning |
|---|---|
| `forward` | The forward function, from (weights, input) to output |
| `sensitivity` | A positive number, the Lipschitz constant of output with respect to input |
| `mass` | A positive number that sets how much this module contributes to learning |
| `norm` | A norm on the weight space |

Modules come in three kinds: **atoms** (layers with hand-declared attributes, such as Linear, Conv2d, Embed), **bonds** (those with no weights, such as ReLU), and **compounds** (anything built by combining the first two, such as an MLP).

### Well-Normed

Anything with these four attributes is a module, but the library only wants the "good" ones. A module is **well-normed** if its input and output spaces each have a norm and its first derivatives satisfy:

$$
\|\nabla_w M \diamond \Delta w\|_{\mathcal Y} \le M.\text{norm}(\Delta w)
\qquad
\|\nabla_x M \diamond \Delta x\|_{\mathcal Y} \le M.\text{sensitivity} \times \|\Delta x\|_{\mathcal X}
$$

The first: the output moves at most as much as the weights move (measured in the module's own norm), a Lipschitz constant of 1. The second: the output moves at most sensitivity times as much as the input. $\diamond$ is shorthand for tensor contraction: a dot product for two vectors, a matrix-vector product for a matrix and a vector.

### Two Atomic Examples

**The linear module.** Sensitivity 1, mass 1, and the norm is:

$$
L.\text{norm}(W) = \sqrt{\frac{\text{fan-in}}{\text{fan-out}}}\; \|W\|_{\text{spectral}}
$$

With the RMS norm on both input and output, it is well-normed as long as the input norm is at most 1 and the weight norm is at most 1.

Bernstein mentions in passing an observation he finds interesting: real networks normalize feature vectors everywhere, and people only have the intuition that this makes things more stable. This condition gives a reason: to have Lipschitz guarantees for a linear module, the inputs and the weights **must** be bounded, otherwise it can be arbitrarily sensitive.

**The embedding module.** Its forward function is also written $Wx$, but the semantics differ: the input is a one-hot vector and the effect is to pick out one column of the matrix. So its norm is different, the maximum RMS norm over the columns, and the input space gets the L1 norm, since a one-hot vector is like a probability vector.

The same "matrix times vector" gets a different norm because it is used differently. That is the point of the whole approach.

### The Two Combination Rules

These are the definitions on the slides. $M_1$ comes first and $M_2$ second.

| | Composition $M = M_2 \circ M_1$ | Concatenation $M = (M_1, M_2)$ |
|---|---|---|
| forward | The two forward functions composed | The two outputs as a tuple |
| sensitivity | $s_1 \times s_2$ | $s_1 + s_2$ |
| mass | $m_1 + m_2$ | $m_1 + m_2$ |
| norm | $\max(p\,\|w_1\|_1,\ q\,\|w_2\|_2)$ | $\max(p\,\|w_1\|_1,\ q\,\|w_2\|_2)$ |
| coefficients | $p = \dfrac{m}{m_1}\, s_2,\quad q = \dfrac{m}{m_2}$ | $p = \dfrac{m}{m_1},\quad q = \dfrac{m}{m_2}$ |

Here $m = m_1 + m_2$ and $\|w_i\|_i$ is the $i$-th module's own norm.

How to read them:

- **Sensitivities multiply** in series, which is intuitive for Lipschitz constants.
- **The norm is a max**, and a weighted one.
- **The series $p$ carries an extra $s_2$**: if the second brick is very sensitive to its input, the first brick's weights must move more carefully. This is where series is "coupled"; the parallel rule has no such factor.
- **Mass sets the proportions**: the larger a module's mass, the smaller its coefficient, so it can move more under the same total budget.

Bernstein describes the style of this work as "come up with really, really clever definitions, and then everything else is easy." With the definitions in place three things can be proven: combination is associative; combining two well-normed modules gives a well-normed module; feature learning is apportioned by mass.

These two rules are enough to build the usual structures. Addition is "concatenate, then compose with an Add module"; multiplication by a scalar is "compose with a module that multiplies by a scalar"; together they give a residual block $a \times \text{Identity} + b \times M$, and composing that with itself many times gives a residual network.

### What Mass Is

A student asks for the intuition behind mass. Bernstein answers with the Transformer: the body is many residual blocks, with one embedding layer in front and one output layer behind. Scale to a million blocks: should the embedding and output layers still be trained? Should all the learning happen in the middle, or does the embedding play a different role and deserve to keep learning however deep the network is? He says he does not know the answer, which is why a degree of freedom is left to tune.

The experiments keep it simple: all the blocks share one total mass $m$, each of $L$ blocks getting $m/L$; the input layer and the output layer have mass fixed at 1.

The theory also works to second order. A module has three sharpness coefficients, for varying only the weights, varying weights and input together, and varying only the input. He thinks of them as "generalized top eigenvalues": the usual sharpness of the Hessian looks at its largest eigenvalue, but that is a Euclidean quantity, and if you do not believe the weight space is Euclidean you need a different notion. The sharpness coefficients of combinations can also be computed automatically.

## Working the Rules

The examples below are computed for this post from the definitions on the slides; they are not from the lecture.

**1. Why the linear norm has that square root.** The RMS norm of a vector of length $n$ is $\|x\|_2 / \sqrt{n}$. So:

$$
\|Wx\|_{\text{RMS}} = \frac{\|Wx\|_2}{\sqrt{\text{fan-out}}} \le \frac{\|W\|_{\text{spectral}}\, \|x\|_2}{\sqrt{\text{fan-out}}} = \sqrt{\frac{\text{fan-in}}{\text{fan-out}}}\, \|W\|_{\text{spectral}}\, \|x\|_{\text{RMS}}
$$

The square root is simply the induced operator norm once both input and output are measured in RMS. Take $W = [1, 1, 1, 1]$ (fan-in 4, fan-out 1): the spectral norm is 2 and the norm is $\sqrt{4} \times 2 = 4$. Check: the input $x = (1,1,1,1)$ has RMS 1 and the output is 4, exactly meeting the bound.

**2. Composing two linear modules.** Both have sensitivity 1 and mass 1. The composite has mass 2 and sensitivity 1, with $p = \tfrac{2}{1} \times 1 = 2$ and $q = \tfrac{2}{1} = 2$:

$$
M.\text{norm}(\Delta W_1, \Delta W_2) = \max\big(2\, L.\text{norm}(\Delta W_1),\ 2\, L.\text{norm}(\Delta W_2)\big)
$$

If the overall update norm must not exceed $\eta$, each layer's update must not exceed $\eta/2$. Is that sensible? The first-order change in the output is $\Delta W_2 W_1 x + W_2 \Delta W_1 x$. With input and weight norms at most 1, each term is at most $\eta/2$ and the sum at most $\eta$, which is exactly what the first well-normed condition asks.

With three layers each gets $\eta/3$. The more layers, the less each may move, and this happens automatically with no hand tuning.

**3. Unequal masses.** Change the second module's mass to 3: total mass 4, $p = 4$, $q = 4/3$. The first layer's update is capped at $\eta/4$ and the second's at $3\eta/4$. Masses in ratio 1 to 3, allowed movement in ratio 1 to 3.

## Scaling: Why the Learning Rate Drifts

There are two problems: when widening, performance improves but the optimal learning rate keeps moving; when deepening, if done badly, performance can even get worse.

Bernstein's thesis (he stresses it is a thesis, not a theorem): scaling well is not difficult; it comes down to understanding the Lipschitz properties of the system. Concretely, two conditions:

1. Lipschitz constants independent of width, depth and other scale dimensions (he calls this non-dimensional).
2. Bounds that stay equally tight across scale.

If both hold, controlling $M.\text{norm}(\Delta w)$ controls the change in output $\|\Delta y\|$, and the learning rate transfers across scale. A Lipschitz constant of 1 is an example of a non-dimensional number.

They wrote these rules into a package, [Modula](https://github.com/jxbz/modula). Composing modules with `@` gives both the forward function and a normalize function computed from the architecture:

```python
from modula.atom import Linear
from modula.bond import ReLU

mlp = Linear(10, 10000) @ ReLU() @ Linear(10000, 1000)
```

The experiment on the slides trains GPT for ten thousand steps on OpenWebText with Adam as the base optimizer:

- Change the width of nanoGPT directly and the optimal learning rate drifts.
- Switch to their own Transformer, with tweaks to the architecture that make it actually Lipschitz.
- Add normalization in the modular norm on top, and the drift is fixed.

For depth, Adam already scales reasonably well, and with normalization on top things stay about the same. The slides also list a result from the paper: this normalization enables training GPT with SGD.

A student asks whether this amounts to changing the learning rate. Bernstein says that is one way to see it, but the change depends on the architecture, and different layers have their gradients rescaled by different amounts.

He is candid about one gap. A student asks what happens when the gradient pushes the weights outside the "norm at most 1" boundary. He answers that this part is not yet implemented faithfully and for now everything is simply allowed to leave the boundary; what he wants are optimization algorithms that keep the weights on the well-normed manifold. He also says these results were expected: they had the intuition for how to scale first and then built the theory in order to do it.

## Modular Duality: The Gradient Should Not Be Subtracted Directly

The steepest descent step splits into two parts:

$$
\arg\min_{\Delta w} \Big[\nabla L^\top \Delta w + \tfrac{\lambda}{2}\|\Delta w\|^2\Big]
= -\frac{\|\nabla L\|^\dagger}{\lambda} \times \arg\max_{\|t\| = 1} \nabla L^\top t
$$

The scalar in front is the step size ($\|\cdot\|^\dagger$ is the dual norm), and the argmax is the **duality map**: among steps of unit norm, the one that maximizes the linear improvement.

Bernstein's argument: the gradient is a dual vector, and the only thing it is really good for is taking a dot product with a change in weights to give the linearization of the function. The gradient has the same dimensions as the weights, so technically they can be subtracted, but that does not make it a good idea. The slide is titled "Gradient descent does not type check":

```text
weight - LR * gradient            # does not type check
weight - LR * dualize(gradient)   # map back to weight space first
```

Subtracting the gradient directly is equivalent to assuming the norm is Euclidean, and the weight space of a neural network is very unlikely to be Euclidean. His supporting observation: everyone tells you to use Adam and nobody tells you to use plain gradient descent, so intuitively we all know something is wrong with it without quite knowing what.

A student asks whether subtracting the gradient does not always improve for a small enough step. He answers that it does, but it may be very suboptimal; the duality map solves a problem with an optimality criterion.

### Solving the Duality Map Recursively

Since the norm on the whole network is built recursively, the duality map can be too:

1. For each layer, solve the duality map in that layer's norm.
2. Combine them recursively with rules for modules in series and in parallel to get the duality map of the whole network.

The rules for the second step appear on the slide as a picture without formulas, and Bernstein leaves them as something to think about.

### Linear Layers: Set the Singular Values to 1

For a linear layer under the spectral norm the duality map has a closed form. Take the singular value decomposition of the gradient, $G = U \Sigma V^\top$; then:

$$
\text{dualize}(G) = \arg\max_{\|A\| \le 1} \langle G, A \rangle = U V^\top = (G G^\top)^{-1/4}\, G\, (G^\top G)^{-1/4}
$$

That is, keep the singular vectors and set every singular value to 1.

Bernstein says he noticed this through Google's [Shampoo](https://arxiv.org/abs/1802.09568). Shampoo won an industry training-speed competition, but the method actually used differs a lot from the one in the paper. After stripping away the parts not used in practice, he found that the core operation left for linear layers is the expression above, which is steepest descent under the spectral norm, although the paper does not frame it that way.

A small example written for this post: $G = \begin{pmatrix} 3 & 0 \\ 0 & 0.1 \end{pmatrix}$.

| Update direction (spectral norm 1 in both cases) | Matrix | Linear improvement $\langle G, A \rangle$ |
|---|---|---|
| Normalized gradient $G / 3$ | $\text{diag}(1,\ 0.033)$ | 3.003 |
| Duality map $UV^\top$ | $\text{diag}(1,\ 1)$ | 3.1 |

Gradient descent moves almost only along the first singular direction. The duality map moves fully along both and gets more linear improvement for the same spectral-norm budget. 3.1 is exactly the sum of the singular values of $G$, which is the dual norm of the spectral norm.

Implementing this in Modula only takes overriding `normalize` on Linear: compute the singular value decomposition and return $U V^\top$. Bernstein checked in a notebook that it trains faster than naive spectral normalization, and both are better than plain gradient descent.

The original worry was that singular value decompositions are too expensive. In the [nanoGPT speedrun](https://github.com/KellerJordan/modded-nanogpt), Keller Jordan approximates the operation with a Newton-Schulz iteration instead; the form on the slides is $X_{t+1} = a X_t - b X_t X_t^\top X_t + c X_t X_t^\top X_t X_t^\top X_t$. Bernstein says it was the fastest way to train nanoGPT at the time.

He therefore admits the package had been doing it wrong: what should be done is not normalization but a dualization computed recursively from the architecture, and the package still needs updating.

## What He Wants to Do Next

Bernstein thinks the idea has not really spread yet but could be useful more generally:

- **Low-precision models.** Saving energy and money means lowering precision, but nobody has a theory of how precision in a network should behave; it is all trial and error. Precision and continuity are intimately related: to quantize as much as possible you need to know at what scale the space is continuous.
- **Adversarial robustness.** Also a question about continuity properties.

He casts both as questions of module sensitivity.

## Common Misunderstandings

- **"All norms are equivalent, so the choice does not matter."** Equivalence guarantees that a bound exists, not that it is tight. A loose bound is useless for designing algorithms.
- **"An embedding layer is a linear layer without a bias."** Computationally the same, but the input is one-hot, so it gets a different norm.
- **"This is settled theory."** The lecturer himself asks for skepticism; the well-normed boundary conditions are not yet enforced in the implementation, and "good scaling" is a thesis, not a theorem.
- **"Setting singular values to 1 throws information away."** It is not approximating the gradient; it finds the direction of greatest linear improvement inside the unit ball of the spectral norm.

## Check Yourself

1. A linear layer has fan-in 1024, fan-out 256 and spectral norm 0.5. What is its module norm? Does it meet the well-normed requirement on the weights?
   **Answer**: $\sqrt{1024/256} \times 0.5 = 1$, exactly the cap of 1, so yes.
2. Compose two modules with $s_1 = 1$, $s_2 = 3$ and mass 1 each. What are $p$ and $q$? Which layer's update is constrained more tightly?
   **Answer**: $p = 2 \times 3 = 6$ and $q = 2$. The first layer is constrained more tightly (capped at $\eta/6$), because the module after it amplifies the change it causes by a factor of three.
3. Concatenate two modules each with sensitivity 1. What is the combined sensitivity, and why is it not a product?
   **Answer**: $1 + 1 = 2$. In parallel the same change in input goes to both, each output changes by at most a factor of 1, and the combined bound adds; a product arises only in series, when the second brick amplifies the first one's output.
4. What does each of the two well-normed inequalities constrain, and in which one does sensitivity appear?
   **Answer**: the first bounds the change in output caused by a change in weights by the size of that change measured in the module norm, with constant 1. The second bounds the change in output caused by a change in input by sensitivity times the size of the input change. Sensitivity appears only in the second.
5. Doing "weights minus learning rate times gradient" directly assumes which norm on the weight space? For a linear layer under the spectral norm, what does the update direction become?
   **Answer**: it assumes the Euclidean norm. Under the spectral norm the direction becomes the duality map $UV^\top$: keep the gradient's singular vectors and set every singular value to 1.
6. $G$ has singular values 5, 2 and 0.01. What does the duality map under the spectral norm turn them into? What is the dual norm?
   **Answer**: all become 1. The dual norm is the sum of the singular values, 7.01.

## Lecture Video Source

Rechecked against the live MIT OCW Fall 2024 gallery on 2026-10-13: the lecture number matches and the video is public and embeddable. Lecture numbering and topics follow OCW.

```youtube
url: https://www.youtube.com/watch?v=zBvsoxC6tAo
title: MIT 6.7960 Fall 2024 — Lec 23. Metrized Deep Learning
```

Original video: [MIT 6.7960 Fall 2024 — Lec 23. Metrized Deep Learning](https://www.youtube.com/watch?v=zBvsoxC6tAo)

Course and recording links:

- [MIT OCW — Lec 23. Metrized Deep Learning](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec23_mp4/)
- [MIT 6.7960 Fall 2024 — official lecture video gallery](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/video_galleries/lecture-videos/)

Checked: 2026-10-13.

Content check: verified against the video transcript (2026-10-13): read the full official OCW transcript and the slides, and compared the combination rules and atomic module definitions with the slide images. The transcript has no timestamps and the audio was not replayed for this post. The "Working the Rules" section and the 2×2 duality-map example are computed for this post; the training speed record mentioned in class is as of late 2024, and its current status was not checked here.

## References

- [MIT 6.7960 Fall 2024 OCW course home](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- [Lec 23 official transcript (PDF)](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/mit6_7960f24_lec23_transcript.pdf)
- [Lecture 23: Metrized Deep Learning slides](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960_f24_lec23_pdf/)
- Large, Liu, Huh, Bahng, Isola, Bernstein, [Scalable Optimization in the Modular Norm](https://arxiv.org/abs/2405.14813)
- Bernstein & Newhouse, [Modular Duality in Deep Learning](https://arxiv.org/abs/2410.21265)
- Bernstein et al., [On the distance between two neural networks and the stability of learning](https://arxiv.org/abs/2002.03432)
- Gupta, Koren, Singer, [Shampoo: Preconditioned Stochastic Tensor Optimization](https://arxiv.org/abs/1802.09568)
- [The Modula package](https://github.com/jxbz/modula) and [project site](https://modula.systems/)
- Keller Jordan, [modded-nanogpt](https://github.com/KellerJordan/modded-nanogpt)
