---
title: "CS221 Lecture 2: Learning I: From Computation Graphs to Linear Regression"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: en
series:
  name: "Reading Stanford CS221"
  order: 3
tldr: "Lecture 2 of Stanford CS221 Autumn 2025 develops operational representations and algorithmic intuition through Learning I: From Computation Graphs to Linear Regression."
description: "A lecture-by-lecture reading of Stanford CS221 Autumn 2025 Lecture 2, following the official executable artifact, examples, and limitations."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs221-lecture-02-learning-backprop-regression)

This article uses only two executable artifacts: [`backpropagation.py`](https://stanford-cs221.github.io/autumn2025-lectures/?trace=backpropagation) and [`linear_regression.py`](https://stanford-cs221.github.io/autumn2025-lectures/?trace=linear_regression). The agenda is deliberately narrow: use tensors and `einsum` to make axes explicit, turn a scalar loss into a computation graph, then connect the same differentiation and update steps to linear regression. Every value, name, shape, and algorithmic step below follows what those two files actually contain.

> Material gap: the source files provide executable lecture artifacts and code, but not classroom Q&A, a complete spoken explanation, additional experimental results, or assignment solutions. This article does not fill those gaps with plausible-sounding claims.

## Agenda: from tensor operations to a learning loop

`backpropagation.py` opens with a review of tensors and then states three goals: compose tensor operations into objective functions, use gradients to determine how to improve an objective, and use computation graphs to compute gradients efficiently. `linear_regression.py` connects that technical line to a machine-learning pipeline: inputs and outputs, training data, predictors, a hypothesis class, a loss function, and an optimization algorithm.

The order is useful in practice. If “train a model” is treated as a black box, weights, residuals, and loss blur together. If each operation becomes a node first, we can ask three concrete questions: where did this value come from, how does it affect the objective, and which quantity should change next?

## Warm-up: `einsum` as axis bookkeeping

The source first reviews tensor order, meaning the number of axes: order 0 is a scalar, order 1 a vector, and order 2 a matrix. For a matrix, axis 0 corresponds to rows and axis 1 to columns. The important point is not the vocabulary by itself, but the meaning assigned to an axis. If rows are data points and columns are features, naming the axes `example` and `feature` makes later expressions less dependent on positional guessing.

With `x = np.array([0, 1, 10])`, the program demonstrates several `einsum` forms. `"i -> i"` preserves the axis and gives an identity operation; `"i ->"` removes the output axis and sums all elements. `"i, i -> i"` is elementwise multiplication, while `"i, i ->"` sums those products and acts as a dot product. Giving the two inputs different axis names, `"i, j -> i j"`, creates an outer product. Three inputs can express elementwise cubing with `"i, i, i -> i"`, or a triple outer product with `"i, j, k -> i j k"`.

The matrix examples make the choice of retained axes visible. `"i j ->"` sums every entry of `m`; `"i j -> i"` sums over columns `j` and keeps one result per row; `"i j -> j"` keeps one result per column. `"i j -> j i"` swaps the axes and transposes the matrix. Matrix-vector multiplication is `"i j, j -> i"`: `j` appears in the matrix and vector but not the output, so it is summed out and only `i` remains. The forms `"i k, j k -> i j"` and `"k i, k j -> i j"` show two matrix products related to transposition.

The source’s general rule is: take tensors with named input axes, produce a tensor whose axes are a subset of those inputs, multiply the corresponding elements for each assignment of input indices, and add contributions whose indices are not retained in the output. `einsum` therefore puts addition, multiplication, and axis bookkeeping into one readable notation. The artifact does not claim that every operation must be rewritten as `einsum`; the warm-up builds intuition for shapes and contraction axes.

## Objective: compress many operations into a scalar

The first motivating example uses linear-regression tensor mechanics. `x` is an `n × d` matrix, concretely `[[1, 2, 0], [0, -1, 1]]`; `y` is a length-`n` target vector, `[0, 3]`; and `w` is a length-`d` weight vector, `[1, 0, 1]`. The program computes `predictions = x @ w`, then `residuals = predictions - y`, then elementwise-squared `losses`, and finally `total_loss = np.sum(losses)`.

Those operations are wrapped in `objective(w)`: a function that accepts a weight vector and returns a scalar loss. The source evaluates it for two different `w` values and states the eventual goal as finding a `w` that minimizes `objective(w)`. The scalar matters. Once the objective is one number, we can ask how much that number changes when one input element changes, and collect those changes into a single gradient.

It is useful to distinguish the function from one parameter setting. `objective` describes how parameters receive a score; the current `w` is the concrete input used for one evaluation. In this stage, `x` and `y` are fixed and only `w` changes, so the question is how to adjust parameters for a defined objective—not how to redefine the task or the data.

## Local derivatives: first check the direction with finite differences

For the one-dimensional function `f(x) = x ** 2`, the source changes `x = 1` to `x + dx`, with `dx = 1e-4`, and estimates `dy / dx` as `(f(x + dx) - f(x)) / dx`. As `dx` approaches zero, this ratio is the derivative; for this example the analytic expression is `df(x) = 2 * x`. Geometrically, it is the slope of the tangent line at `x`.

Finite differences provide an operational check here: push the input a small amount, observe the output change, and compare it with an analytic derivative. The source does not present this as a complete automatic-differentiation system, nor does it measure error across different values of `dx`. That gap matters: we can explain how the artifact estimates a local change, but cannot infer numerical-stability or extra accuracy guarantees from this snippet.

The multivariable version splits the same question into partial derivatives. The source uses `f(x1, x2) = (x1 + x2) ** 2` and computes the derivatives with respect to `x1` and `x2` at `(1, 2)`. Both are `2 * (x1 + x2) * 1`. The vector of partial derivatives points in the direction of greatest local increase, while its negative points toward local decrease. That is a local gradient statement, not a claim that every training run reaches a global optimum.

For a vector input, the source uses `f(x) = np.sum(x) ** 2`. There is one partial derivative per dimension, and the gradient has the same shape as the input. The analytic expression is `2 * np.sum(x) * np.ones_like(x)`, so the same function handles `[1, 2]` and `[1, 3, 0, -1]`. This becomes the interface for parameter updates: a gradient is not only an abstract direction, but a tensor aligned with the parameter tensor and usable element by element.

## Computation graphs: each node keeps a value and a gradient

Manually differentiating a complicated function term by term is tedious and error-prone. The source decomposes functions into primitive operations such as addition, multiplication, `exp`, and `log`, then describes autodiff—specifically reverse-mode automatic differentiation—as building an explicit computation graph and recursively computing partial derivatives. The text mentions PyTorch, JAX, and a Werbos 1974 link; this article does not add version, performance, or API comparisons that are absent from the artifacts.

The demonstration again uses `f(x1, x2) = (x1 + x2) ** 2`. The leaf nodes are `Input("x1", 2)` and `Input("x2", 3)`. `Add("sum", x1, x2)` represents addition, and `Squared("y", sum)` represents squaring. Every non-input node is a primitive computation over its dependencies. `forward()` computes a node’s `value`, and the root node `y` holds the result of the full function. This forward pass computes values; it has not yet sent influence back to the inputs.

The next task is `dy/dx1`. The program initializes the root `y.grad` to ones with the shape of `y.value`, and initializes the intermediate and input gradients to zeros, then calls `y.backward()` and `sum.backward()`. For a square node, the local derivative is `2 * x.value`, so the upstream gradient is multiplied by that local quantity and accumulated into `x.grad`. For an addition node, both local derivatives are 1, so the same upstream gradient is accumulated into both dependencies.

Accumulation is essential. A graph may use one node in more than one downstream operation; each path sends back a contribution, and the node’s `grad` must add them. The source’s `Node` stores `name`, `dependencies`, `value`, and `grad` separately, and provides `asdict()` plus a Graphviz representation so forward values and backward derivatives can be inspected.

## Chain rule and reverse-mode backpropagation

The mathematics of the graph is the chain rule. When an output depends on an intermediate value and that intermediate depends on an input, the input’s influence on the output is the product of local derivatives along the path. If there are several paths, their contributions are summed. The `backward()` contract is concrete: the node’s own `grad` must already be available and all `value`s must have been computed; calling it updates the partial derivatives of its dependencies.

The full algorithm has two traversals. First, traverse from inputs to the root in topological order and call `forward()`. Second, traverse from the root back to the inputs in reverse order and call `backward()`. `topological_sort` recursively gathers dependencies and ensures that a node follows the nodes it depends on. `backpropagation(root)` obtains that order, runs forward again, initializes every gradient to zeros, sets only the root gradient to ones, and performs the reverse traversal.

`Input.backward()` does nothing because an input has no dependencies. `Add` and `Subtract` add the upstream gradient to both sides, with a negative sign for the second side of subtraction. `Squared` multiplies by `2 * x.value`. Matrix `Multiply` sends derivatives back with `x.grad += self.grad @ y.value.T` and `y.grad += x.value.T @ self.grad`. These classes are not a complete tensor-operator framework; they are the finite set of primitives implemented by the source to demonstrate the process.

The same `backpropagation` function is then applied to a linear-regression graph: `x` and `w` enter `Multiply` to produce predictions, `y` is subtracted to produce residuals, residuals are squared into losses, and an all-ones matrix aggregates them into `total_loss`. This connects the scalar objective, local derivatives, chain rule, and reverse traversal in one traceable graph. It does not automatically update parameters; that update is made explicit in the next artifact.

## Linear regression: from task to hypothesis class

`linear_regression.py` opens with a prediction task: predict an exam score from the number of hours studied. The input is study time and the output is a score. A predictor is a function from input to output. The file first demonstrates a fixed function, `fixed_f(x) = 2 * x + 1`, and plots it over a range of inputs. But where does that fixed rule come from? The answer is not to choose a magical formula first; training data lets a learning algorithm produce a predictor.

The artifact’s training data has three `Example1D` records: `(1, 4)`, `(2, 6)`, and `(4, 7)`. Each example is an input-output pair. The next three design questions are: which predictors are possible—the hypothesis class; how good is a predictor—the loss function; and how do we find better parameters—the optimization algorithm.

For a one-dimensional linear predictor, `Parameters1D(weight, bias)` stores the parameters and `y = params.weight * x + params.bias` defines the predictor. `weight=3, bias=1` and `weight=2, bias=0.2` are two different predictors in the hypothesis class. The class is the set of weight-and-bias choices; selecting one parameter setting gives one concrete predictor. The source then connects this idea to deep learning: the hypothesis class corresponds to a model architecture, the predictor to a model, and general model parameters to a collection of tensors.

## Squared loss: define what “bad” means

Given `Parameters1D` and one example, `compute_loss` computes `residual = f(params, example.input) - example.output`, then returns `residual ** 2`. The prediction-target difference is squared, so the loss for one example is a scalar. For the full training data, `compute_train_loss` computes each per-example loss and returns `np.mean(losses)`. The source compares two parameter settings and describes the one with higher training loss as worse.

Training loss and generalization must be kept separate. The program only computes mean squared loss on the supplied training examples; it has no validation set, test set, held-out evaluation, or reported generalization result. Therefore the artifact supports the statement that one setting has lower training loss on these three examples, not the statement that it will be more accurate on unseen data. The linear hypothesis class, feature choice, squared loss, and data distribution jointly determine what can be learned; with only study hours as input, the model cannot see other factors that might affect a score.

The source also writes the analytic gradient for one example. Let `r = weight * input + bias - output`; the loss is `r ** 2`, and the gradient with respect to `[weight, bias]` is `2 * r * [input, 1]`. The input appears in the weight derivative and 1 appears in the bias derivative. This is the computation-graph story in a compact parameter representation: form a residual, square it, and multiply local derivatives by the chain rule.

## Gradient descent: turn a gradient into training

Once every example has a gradient, `compute_gradient_train_loss` collects the results of `compute_grad_loss` and averages them across examples. Its structure matches `compute_train_loss`: the former averages gradients, while the latter averages losses. `optimization_algorithm` starts from `Parameters1D(weight=0, bias=1)`, computes the training loss and gradient, sets `learning_rate = 0.01`, and updates with

```text
weight = weight - learning_rate * grad[0]
bias   = bias   - learning_rate * grad[1]
```

Because the gradient points toward the direction of greatest local increase, the negative gradient is the local descent direction. The source recomputes the training loss after the update and observes that it is lower in this demonstration.

`gradient_descent()` puts the action in a loop. It obtains the training data, initializes parameters and the learning rate, then repeats ten steps; each step computes train loss, computes the gradient, and constructs a new `Parameters1D`. This is the minimal training-loop skeleton: evaluate, differentiate, update, repeat. The source does not save a loss history, draw a convergence chart, or claim that ten steps is a sufficient training schedule.

The source ends with boundaries and alternatives. The learning rate controls update speed and involves a speed-versus-stability tradeoff. For convex functions, the source says convergence is guaranteed; for deep learning, it explicitly says this is not the case. It also names stochastic gradient descent and Adam, but neither is implemented or compared in these two files. The ten-step full-batch update here should therefore not be treated as a recipe for every model or dataset.

## Shapes, representation, and limits

When the two artifacts are read together, shape checking is one of the most reusable habits. In `backpropagation.py`, the matrix example uses `x` with two examples and three features, a `2 × 3` matrix; `w` is a `3 × 1` weight matrix, so `x @ w` is `2 × 1` predictions; `y` is also `2 × 1`, so subtraction is elementwise. In `linear_regression.py`, `Parameters1D` stores the one-feature weight and bias as two scalar fields, and the gradient is a length-2 NumPy array. These are not contradictory representations; they are two demonstrations of the same requirement that parameter shapes match the operations.

The three layers should also remain distinct. A forward pass computes values through a graph or predictor. A loss turns predictions and targets into an optimizable scalar. Backward propagation and gradient descent turn the loss’s sensitivity to parameters into an update. Missing any one layer cannot be repaired by recognizing the vocabulary. Exact gradients do not make a model appropriate: the hypothesis class may be too narrow, features may discard information, and training loss may fail to represent performance on unseen data.

The lecture’s concrete deliverable is a representation that can be checked step by step. Verify `einsum` axes; verify that the objective is scalar; use finite differences to build local-change intuition; put primitive operations in a graph; use local derivatives and the chain rule for reverse-mode backpropagation; then connect residuals, squared loss, averaged gradients, and an update loop in linear regression. Larger models, different data distributions, generalization guarantees, practical optimizer comparisons, and unpublished classroom material are deliberate gaps.

## References

- [Stanford CS221 Autumn 2025 course site](https://stanford-cs221.github.io/autumn2025/)
- [Official executable artifact: backpropagation](https://stanford-cs221.github.io/autumn2025-lectures/?trace=backpropagation)
- [Official executable artifact: linear_regression](https://stanford-cs221.github.io/autumn2025-lectures/?trace=linear_regression)
- [CS221 Autumn 2025 executable lecture repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Official Stanford Online CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
