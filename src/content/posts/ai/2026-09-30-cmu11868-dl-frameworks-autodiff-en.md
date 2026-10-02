---
title: "CMU 11-868 L05: How a Deep Learning Framework Computes Gradients from a Computation Graph"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, deep-learning, pytorch, backpropagation]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 4
tldr: "L05 follows a small sentiment classification network throughout. It expresses computation as a graph, evaluates it in topological order, sends gradients back with the chain rule and vector-Jacobian products, and then takes apart TensorFlow v1's placeholder, variable, operation, and session. One slide is labeled \"important for HW2\"."
description: "A guide to CMU 11-868 LLM Systems (Spring 2026) Lecture 5, Deep Learning Frameworks and Auto Differentiation: its four-part structure, computation graphs and topological sort, backpropagation and VJPs, finite-difference gradient checking, framework design principles and TensorFlow v1 components, plus the three assigned readings and the mini_tensorflow exercise."
draft: false
glossary:
  - term: "computation graph"
    aliases: ["dataflow graph"]
    definition: "A directed acyclic graph representing a computation: nodes are variables or operations, and directed edges show where each operation's inputs come from."
    context: "L05 draws a seven-node graph for f = x1 + exp(1.5·x1 + 2.0·x2); both the forward pass and backpropagation walk this graph."
  - term: "vector-Jacobian product"
    aliases: ["VJP"]
    definition: "In backpropagation, instead of materializing the full Jacobian, compute the product of the upstream gradient vector with the transposed Jacobian to get the gradient of a node's inputs."
    context: "L05 writes it as x̄ = Jᵀȳ and uses y = Wx to get x̄ = Wᵀȳ."
  - term: "topological sort"
    aliases: ["topological order"]
    definition: "Ordering the nodes of a DAG so every edge points from an earlier node to a later one."
    context: "The forward pass follows topological order and backpropagation follows the reverse; the first function in Assignment 2 is topological_sort."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-dl-frameworks-autodiff)

> **Version note**: This post follows the Spring 2026 offering of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/). The main source is the 1/28 [L05 slides](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-05-dlframework-fa0770d636572de3f7b48ccae0ba8848.pdf) (a 53-page PDF, downloaded and checked on 2026-09-30). The course has no public recordings, so everything below comes from the slides and the readings listed in the Syllabus. Page numbers refer to PDF page order, not the number printed in each slide's corner. Access level **A3**.

**Series navigation**: Previous [Assignment 1: CUDA Programming](/posts/ai/2026-09-30-cmu11868-hw1-cuda-programming-en) | Next [Assignment 2: MiniTorch Framework](/posts/ai/2026-09-30-cmu11868-hw2-minitorch-framework-en) | [Series overview](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en)

The first four lectures made individual operations fast on a GPU. This one moves up a level: when the network can have any shape and you assemble the loss yourself, how does a framework compute the gradient for **every parameter** automatically?

That question leads straight into Assignment 2. Slide 7 frames it with a snippet of PyTorch: call `loss(input_logits, target_labels)`, then `output.backward()`, and ask two things. How is backward implemented? Why does it work for any network?

## The lecture's four parts

Slide 3 lists the day's topics, and the lecture follows them in order:

1. The learning algorithm for neural networks
2. Computation graphs
3. Automatic differentiation
4. Putting it together: implementing a deep learning framework

Slide 2 opens by recapping four points from the previous GPU Acceleration lecture: tiling, coalesced memory access, sparse matrix representation and multiplication, and cuBLAS.

## The running example: a sentiment classifier

Slide 4 draws a simple feedforward network whose input is "It is a good movie". From bottom to top: Embedding (a lookup table), Linear, ReLU, Linear, average pooling, Softmax. This network recurs throughout the lecture and has the same kind of structure as the sentiment classifier Assignment 2 asks you to build.

Slides 5–10 fill in the learning problem: given training pairs, find parameters that make the model's outputs as accurate as possible; use cross entropy as the classification loss; derive the gradient descent update from a Taylor expansion; and write out pseudocode for (stochastic) gradient descent. Slide 11 narrows it to one question: how do you compute ∂l/∂wᵢ for every parameter of an "arbitrary network"? The answer splits into a forward computation and backpropagation.

## Computation graphs: the forward pass

Slide 13 defines a computation graph: each node is a variable or an operation, and directed edges connect an operation to its inputs.

A small function then serves as the running example: x1 = 3, x2 = 0.5, f = x1 + exp(1.5·x1 + 2.0·x2). It breaks into five intermediate nodes, x3 through x7. Slide 14 says computing the result takes two steps: topologically sort all nodes, then compute each node's value from its inputs in that order.

Slide 15 gives the sorting procedure: put every node in an unprocessed queue, repeatedly find a node with no incoming edges from unprocessed nodes, evaluate it, and move it to the processed queue.

## Backpropagation: sending gradients back

Slide 17 makes the key observation: parameters are variables too, and they are nodes in the graph, so the chain rule carries gradients all the way back. Slides 18–19 define x̄ᵢ = ∂y/∂xᵢ and, starting from x̄7 = 1, work backward through the same graph to w2.

The next three slides extend the scalar case to what real networks need:

- **A node with multiple outgoing edges** (slide 20) gets the sum of the contributions flowing back along each edge.
- **Partial derivatives of vectors with respect to vectors** (slide 21) form the Jacobian matrix.
- **Vector-Jacobian products** (slides 22–23): each node's gradient is x̄ = Jᵀȳ. For y = Wx, x̄ = Wᵀȳ.

Slide 24 defines automatic differentiation for this lecture: rather than manually deriving gradients backward for each data sample, **build a computation graph for the gradient computation itself**, one that works for any input. Slide 26 draws the forward graph for the running example side by side with its backward graph.

### The slide marked "important for HW2"

Slide 27 is titled "Implementing Backward Pass (important for HW2)". It shows a `backward_pass` function that visits nodes in reverse topological order, looks up the VJP function for each node, computes its gradient contribution to each parent, and sums multiple contributions with `add_outgrads`. Slide 28 shows how `make_vjp` and `grad` wrap this machinery into a gradient function you can call directly.

These two slides turn the math into program structure. Assignment 2's `topological_sort` and `backpropagate` are simplified versions of it.

### Checking that gradients are right

Slide 30 gives the check: approximate a partial derivative with the central difference [f(x1 + h, x2) − f(x1 − h, x2)] / 2h and compare it with autodiff's result. It stresses precision: use double precision (fp64) and pick h = 0.000001. Slide 31 is a small computation-graph quiz for practice.

## Frameworks: wrapping it all up

Slide 33 lists three goals for deep learning frameworks (for LLMs too):

| Goal | What the slide says |
|---|---|
| Expressive | Can specify any neural network and support future custom operators and layers |
| Productive | Hide low-level details (no CUDA to write) and differentiate automatically (no hand-derived gradients) |
| Efficient | Efficient in large-scale training and inference, scaling automatically to data and model size with automatic hardware acceleration |

Slide 34 compares PyTorch, TensorFlow, JAX, and NumPy. The row most relevant to this lecture is autograd: PyTorch uses a dynamic computation graph, TensorFlow a static one, JAX provides it through functional transformations (grad/jit), and NumPy has none.

Slide 35 sums up the design principles: a dataflow graph of primitive operators, plus deferred execution in two phases. Phase one defines the program, building a symbolic computation graph with placeholders. Phase two executes an optimized version on the available devices.

### TensorFlow v1 as a worked example

Slides 36–45 take apart a framework's basic components following TensorFlow's design:

- **Placeholder**: holds input data, fed at execution time (the slides note TensorFlow v2 no longer requires defining it explicitly)
- **Variable**: holds network parameters; a stateful node whose value persists across executions
- **Constant**: static data
- **Operation**: the math for each layer; every operation defines forward and backward
- **Session**: the execution environment, which computes nodes in topological order

Slide 42 shows how to implement an `AddOperation`. Slides 43–44 explain that the loss is just another node in the graph, and that `GradientDescentOptimizer(lr).minimize(...)` adds the optimization operation to the graph, with gradients computed by autodiff. Slides 47–48 cover implementing topological sort and the session: sort from the final operation node; placeholders take values from feed_dict; variables and constants use their own values; operations fetch their input nodes and apply forward.

Slide 49 is an in-class exercise: fill in the code in the notebook under [mini_tensorflow in llmsys_code_examples](https://github.com/llmsystem/llmsys_code_examples/tree/main/mini_tensorflow). The folder has the fill-in `mini_tensorflow.ipynb` and the completed `mini_tensorflow_full.ipynb`.

## Assigned readings

The [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) lists three readings for this lecture, and slide 51's Additional Reading lists the same three:

- [TensorFlow: A System for Large-Scale Machine Learning](https://www.usenix.org/system/files/conference/osdi16/osdi16-abadi.pdf) (Abadi et al., OSDI 2016): the abstract says TensorFlow uses dataflow graphs to represent computation, shared state, and the operations that mutate that state, mapping graph nodes across machines in a cluster and across devices within a machine. The TensorFlow v1 components in this lecture come from this design.
- [Automatic differentiation in machine learning: a survey](https://arxiv.org/abs/1502.05767) (Baydin, Pearlmutter, Radul, Siskind): the abstract frames AD as a family of techniques more general than backpropagation and notes that the ML and AD communities were long largely unaware of each other.
- [The Elements of Differentiable Programming](https://arxiv.org/abs/2403.14606) (Blondel, Roulet): a book reviewing the fundamentals of differentiable programming from two perspectives, optimization and probability.

## What this lecture leaves out

The slides stop at the abstract structure of a framework: graphs, autodiff, execution. They do not cover how operators map to the GPU kernels from the previous lectures, memory management, or compiler optimizations. Slide 53 hands off to Assignment 2 and asks students to come to that Friday's recitation, laptops in hand, to learn the MiniTorch framework. That Recitation 2 appears in the Syllabus as "HW2, MiniTorch, More GPU", with no public slides linked.

If you want the "how is a framework built" story in full, CMU's [10-414/714 Deep Learning Systems](https://dlsyscourse.org/) spends an entire course on it. This site does not have a series for it yet; it is covered in the [CMU AI/ML course map](/posts/learning/2026-08-21-cmu-ai-ml-course-map-en).

## How to self-study it

1. Read slides 13–26 and compute, on paper, the forward values and every x̄ᵢ for f = x1 + exp(1.5·x1 + 2.0·x2).
2. Open the mini_tensorflow notebook and fill in just the topological sort and session parts.
3. Check your gradients with the central difference from slide 30.

One thing you can do tonight: look only at the `backward_pass` on slide 27 and write two sentences in your own words: why nodes are visited in reverse topological order, and why multiple contributions are summed.

## Further reading

- [CMU 11-785 Lecture 5: Backpropagation](/posts/ai/2026-08-22-cmu-11785-05-backpropagation-en): the same chain rule, derived from a deep learning course's angle
- [Stanford CS336: Resource accounting](/posts/ai/2026-08-22-cs336-resource-accounting-en): how much compute the forward and backward passes each cost in training

## References

- [CMU 11-868 Spring 2026 L05 slides: Deep Learning Framework and Auto Differentiation](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-05-dlframework-fa0770d636572de3f7b48ccae0ba8848.pdf)
- [CMU 11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)
- [llmsys_code_examples: mini_tensorflow](https://github.com/llmsystem/llmsys_code_examples/tree/main/mini_tensorflow)
- [Abadi et al., TensorFlow: A System for Large-Scale Machine Learning (OSDI 2016)](https://www.usenix.org/system/files/conference/osdi16/osdi16-abadi.pdf)
- [Baydin et al., Automatic differentiation in machine learning: a survey (arXiv:1502.05767)](https://arxiv.org/abs/1502.05767)
- [Blondel & Roulet, The Elements of Differentiable Programming (arXiv:2403.14606)](https://arxiv.org/abs/2403.14606)
- [CMU 10-414/714 Deep Learning Systems](https://dlsyscourse.org/)
