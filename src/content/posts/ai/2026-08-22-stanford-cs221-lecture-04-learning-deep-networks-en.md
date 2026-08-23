---
title: "CS221 Lecture 4: Learning III: Deep Networks as Composable Computation Graphs"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: en
series:
  name: "Reading Stanford CS221"
  order: 5
tldr: "Lecture 4 of Stanford CS221 Autumn 2025 develops operational representations and algorithmic intuition through Learning III: Deep Networks as Composable Computation Graphs."
description: "A lecture-by-lecture reading of Stanford CS221 Autumn 2025 Lecture 4, following the official executable artifact, examples, and limitations."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs221-lecture-04-learning-deep-networks)

This article covers **Stanford CS221, Autumn 2025, Lecture 4**, taught by Percy Liang on 2025-10-01. The [course site](https://stanford-cs221.github.io/autumn2025/) provides the schedule and assignments; the primary artifact is [deep_learning](https://stanford-cs221.github.io/autumn2025-lectures/?trace=deep_learning).

> Material gap: Executable PyTorch examples are public; the recording is available separately in the official playlist.

## The route through the lecture

The executable artifact follows `main()`: it reviews NumPy and a hand-built computation graph, moves to PyTorch, then proceeds through the motivation for nonlinearity, a linear MLP, an MLP with an activation, and deeper networks. It finishes with residual connections, layer normalization, initialization, and optimizers. The order matters: first make explicit how one value is computed from another; then address why increasing depth makes training difficult and how the artifact keeps it stable.

This article follows only the executable agenda in `.work/stanford-cs221-notes/source/deep_learning.py`. Classroom explanations not expanded there, a recording transcript, hidden assignment tests, and official solutions are material gaps rather than claims to fill from inference.

## 1. From a manual graph to PyTorch

The preceding unit used NumPy and a small computation-graph library. The lecture begins with a minimal comparison. Let `x = [1, 2, 3]`, `y = [4, 5, 6]`, and `z = x · y`. An `Input` is a node, while `DotProduct` connects two upstream nodes through an operation; the forward value is `z = 32`. After the hand-written `backpropagation(z)`, gradients travel backward through the graph: the gradient with respect to `x` is `y`, and the gradient with respect to `y` is `x`, namely `[4,5,6]` and `[1,2,3]`. The traversal does not guess these values: each operation supplies its local derivative, and traversal composes those local rules.

The PyTorch version is `x = torch.tensor([1.,2,3], requires_grad=True)`, `y = torch.tensor([4.,5,6], requires_grad=True)`, `z = x @ y`, and `z.backward()`. In this program a PyTorch tensor is both a value and a node in the computation graph. The `@` operation parallels the NumPy dot-product operation; values are computed eagerly while nodes are constructed, so there is no separate `forward()` call. `backward()` recursively propagates gradients, which are stored in leaf tensors' `.grad`; `requires_grad=True` says which values should have gradients computed, as with parameters. This is the artifact's compact description of PyTorch: NumPy-like operations, automatic differentiation, and pre-defined modules.

Node semantics are the foundation. The hand-written library has two ways to use a node: connect the node itself to a new operation, in which case the new result can backpropagate through the old node; or use the node's value, in which case the new graph has only a number and does not know the old node. The artifact uses `x=1`, `y=x²`, `z=y²`, and `u=3`, then constructs `l2 = (value(y))² + u`. Backpropagating from `l2` computes `u.grad` but not `x.grad`, because taking `y`'s value starts a separate graph segment.

PyTorch normally references tensors as nodes. To request the value-only behavior explicitly, use `y.detach()`. Thus, after `l2 = y.detach() ** 2 + u`, `l2.backward()` produces a gradient for `u` but not for `x`. `detach()` is not a different kind of number; it cuts the gradient path from that result to its upstream graph. The other mechanism is `with torch.no_grad()`: the artifact computes `y=x²` and `z=y²` inside that block, so the results have no tracked gradient graph at all. Calling `backward()` on `z` then raises a RuntimeError. The first is a local graph break; the second disables gradient tracking for the block.

## 2. Linear models, logits, and the complete update

PyTorch supplies `nn.Linear`, `nn.CrossEntropyLoss`, and `torch.optim.SGD`. The artifact uses an input `x` with shape `[4]` and a one-hot-style `target_y` `[0.,1,0]`, then creates `nn.Linear(4,3)`: the weight maps four input features to three outputs, so `logits = model(x)` has shape `[3]`. These outputs are logits, not normalized probabilities; cross-entropy compares logits with the target, corresponding to the class distribution after softmax, and returns a scalar `loss`. After `loss.backward()`, both `model.weight.grad` and `model.bias.grad` can be inspected.

The next line creates `torch.optim.SGD(model.parameters(), lr=0.1)`, and `optimizer.step()` updates the model's weight and bias using their current gradients. The relevant state is concrete: parameters live in the model, gradients live in each parameter's `.grad`, and the optimizer object knows which parameters to update and the learning rate. Before the full loop, the artifact calls `optimizer.zero_grad()`, because the previous gradients must be cleared before backpropagating the next loss; otherwise gradients accumulate across iterations. The artifact only points to Adam as a fancier alternative and does not expand its internal state here.

`get_training_data()` returns three examples, each with a four-dimensional input: `[1,2,0,1]` targets `[0,1,0]`, `[-1,0,2,0]` targets `[1,0,0]`, and `[0,3,1,0]` targets `[0,0,1]`. `train_model` stacks them into `x` with shape `[3,4]` and `target_y` with shape `[3,3]`. Every step follows the same closed loop: `logits = model(x)` (shape `[3,3]`) → `loss = cross_entropy(logits,target_y)` → record `loss.item()` → `optimizer.zero_grad()` → `loss.backward()` → `optimizer.step()`. The defaults are 80 steps and learning rate `0.1`; the result is a line chart of loss against step. Forward, loss, backward, gradient clearing, and parameter update are all visible in one executable loop.

## 3. Why nonlinearity is necessary

The artifact first revisits linear classifiers: their decision boundaries are straight cuts through input space, and linear regression expresses the corresponding linear relationship. Data can instead have a nonlinear shape, such as a circular boundary. Its `quadratic_classifier` computes `(x[0]-1)^2 + (x[1]-1)^2 - 2`, predicts `1` when the result is positive and `-1` otherwise, and executes examples `[1,1]` and `[3,0]`; the boundary is a circle.

A direct construction is a fixed nonlinear feature map, `phi(x)=[x0,x1,x0²+x1²]`, followed by a linear predictor in `phi` space with logit `-2*phi[0]-2*phi[1]+phi[2]`. Thus “linear” can mean linear in a higher-dimensional feature representation; mapped back to the original input, the decision boundary can be nonlinear. The artifact states the algorithm in two steps: preprocess with `feature_map`, then learn a linear predictor. Its limitation is equally explicit: the feature map is fixed, so the next question is whether it can be learned too.

The artifact then tries two linear layers. `LinearMLP` maps a four-dimensional input to hidden size 5 with `nn.Linear(input_dim,5)`, then maps hidden size 5 to three logits with `nn.Linear(5,3)`. For one input, the shapes are `[4] → [5] → [3]`; for the three-example batch, they are `[3,4] → [3,5] → [3,3]`. Yet this is still equivalent to one linear classifier: ignoring the bias detail, `(x @ w1) @ w2 = x @ (w1 @ w2)`, so associativity lets the two weights collapse into `w=w1@w2`. The artifact evaluates `x` of shape `[2,3]`, `w1` of shape `[3,2]`, and `w2` of shape `[2,3]`, then compares `logits` with `logits2`; they agree. Adding linear layers alone does not add expressivity.

This counterexample separates “more parameters” from “a more expressive function class.” Two linear maps use a different parameterization but still draw only linear decision boundaries; changing hidden dimension changes the computation path without changing the basic family of representable functions. Architecture cannot be judged by layer or parameter count alone. One must ask whether the operation between layers actually changes the function class. The activation in the next section is that operation.

## 4. MLPs, depth, and gradients

To go beyond linear classifiers, insert a nonlinear activation between layers. The artifact lists sigmoid, tanh, ReLU, GeLU, and Swish, and uses ReLU: `relu(x)=max(x,0)`, which maps `[-1,0,1]` to `[0,0,1]`. `MultiLayerPerceptron` follows `x → w1(x) → ReLU → w2(hidden) → logits`; hidden units are also called activations or neurons. ReLU's limitation is a zero gradient when `x <= 0`, which can produce dead neurons. The listed alternatives are Leaky ReLU, GeLU, and Swish. The stated tradeoff is between the better gradient behavior of linear regions and the greater expressivity supplied by nonlinearity.

A single MLP layer may still be insufficient, so `DeepNeuralNetwork` stacks three linear maps: input to hidden size 5, hidden size 5 to hidden size 5, and hidden size 5 to three logits; the first two maps are followed by ReLU. The artifact trains it on the same three examples and notes that training is slower with more layers, especially at the beginning. Its intuition is that each layer learns more abstract features of the input. The source demonstrates the composition and loss curve but gives no quantitative feature analysis; that is another material gap.

The difficulty is the vanishing/exploding-gradient problem. The artifact uses a scalar example: start with `x=1` and multiply by a trainable `w` 20 times. With `w=0.5`, backpropagation makes the gradient very small; with `w=2`, it makes it very large. Matrices have the same issue. The source's stability intuition is that `w` should be close to 1; in the matrix case, the eigenvalues of `w` should be close to 1. It does not turn these examples into a general convergence theorem, and this article does not add a numerical table absent from the artifact.

## 5. Stabilizing deeper networks

The first method is a residual or skip connection, also called a highway network. Without a residual path, a layer computes `x → f(x)`; with one, it computes `x → x + f(x)`. If `f(x)=wx`, each layer becomes `(1+w)x`. The source's intuition is that this keeps the multiplier away from zero, although a large `w` can still explode. Its demonstration keeps three linear maps but changes the second hidden update to `x = x + ReLU(w2(x))` before the third layer; the source observes that training is much faster. Its historical examples, in order, are McCulloch/Pitts 1943, Rosenblatt 1961, LSTMs 1997, and residual networks 2015. This article does not turn those dates into a broader historical narrative.

The second method is layer normalization: avoid activations whose magnitude becomes too large or too small. A simplified version computes the mean and variance, then `(x-mean)/sqrt(var)`; the artifact compares `[1,2,3]` with `[100,200,300]`. Its fuller demonstration adds `epsilon=1e-5` to avoid division by zero, then learnable `gamma` for scaling and `beta` for shifting. The PyTorch equivalent is `nn.LayerNorm(3)`, whose parameters can be inspected with `named_parameters()`. The source summarizes the goal as keeping activation magnitude away from zero and infinity. The simplified function is a conceptual illustration, not a replacement for the complete module definition.

The third method is proper initialization. The artifact sets `input_dim=16384` and `output_dim=32`, draws normal weights and inputs, and computes `y=x@w`; each element of `y` scales with `sqrt(input_dim)`, and large values can blow up gradients and destabilize training. Dividing the weights by `sqrt(input_dim)` aims to make the scale invariant to input dimension. The source connects this idea, up to a constant, to Xavier initialization and uses a normal distribution truncated to `[-3,3]` to avoid outliers. It cites Glorot and Bengio 2010; this article does not present the simplified construction as a complete rule for every initialization method.

The fourth method is a stochastic optimizer. A full-data gradient sums contributions from all training examples; on a large dataset, that is too much work for one update. Each step can instead sample a subset and use an unbiased gradient estimate. The artifact uses four gradients `[1,2]`, `[3,4]`, `[5,6]`, and `[7,8]`, computes their full mean, then fixes seed 1, samples a batch of size 2, and computes the sampled mean. In practice it does not independently sample forever: it permutes examples each epoch and takes consecutive chunks, then compares the mean of the batch gradients with the full gradient. The source ends by pointing to Adam as a more sophisticated alternative to SGD.

## References

- [CS221 Autumn 2025 course site](https://stanford-cs221.github.io/autumn2025/)
- [Official lecture artifact: deep_learning](https://stanford-cs221.github.io/autumn2025-lectures/?trace=deep_learning)
- [CS221 Autumn 2025 executable lecture repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Official Stanford Online CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
