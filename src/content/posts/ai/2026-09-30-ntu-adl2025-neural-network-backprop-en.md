---
title: "NTU ADL 2025 Lecture 2: Neural Networks and Backpropagation"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, deep-learning, neural-networks, backpropagation]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall"
  order: 2
tldr: "ADL Fall 2025's NN Basics and Backpropagation decks break model training into three questions. What is the model? Layers of neurons, each computing z = Wa + b and then a nonlinearity. What makes a function good? A smaller loss. How do we pick the best one? Gradient descent, in practice mini-batch SGD. Backpropagation computes gradients for millions of parameters efficiently: the forward pass stores each layer's output, the backward pass sends an error signal δ back from the output layer, and multiplying the two gives each weight's gradient."
description: "A guide to the NN Basics (93 pages) and Backpropagation (33 pages) decks and videos 2.1–2.5 of NTU Yun-Nung Chen's ADL Fall 2025: the three training questions, single neurons and bias, the perceptron and XOR, multi-layer perceptrons, why activations must be nonlinear, loss functions, gradient descent, SGD and mini-batches, training tips, the learning recipe, and backpropagation derived from the chain rule."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop)

This is post 2 of [Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en). ADL Fall 2025 (NTU term 114-1, 2025/09/01–12/15) lists these two decks, together with the Introduction from [post 1](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction-en), under "self-study / prerequisite." They are HW0 material that students must finish before enrolling.

**Sources**: the [NN Basics deck](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_NNBasics.pdf) (93 pages), the [Backpropagation deck](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Backprop.pdf) (33 pages), and five videos in Mandarin:

| Video | Length | Deck pages |
|---|---|---|
| [2.1 How to Train a Model?](https://youtu.be/YfNmHxDHE-M) | 4:41 | NN Basics pp. 4–7 |
| [2.2 What is a Model?](https://youtu.be/AySPuO7vOvA) | 46:40 | NN Basics pp. 8–44 |
| [2.3 What does the "Good" Function Mean?](https://youtu.be/OjX-O9uuug8) | 8:41 | NN Basics pp. 45–52 |
| [2.4 How can we Pick the "Best" Function?](https://youtu.be/Uo3ZavxQyCs) | 57:29 | NN Basics pp. 53–93 |
| [2.5 Backpropagation](https://youtu.be/BHgssEwMxsY) | — | All of Backpropagation |

The decks were checked on 2026-09-30. Video 2.5 is linked from the course page but is not on the [2025 Fall playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o), so watching only the playlist skips it. The page ranges in the table come from the section title slides in the deck, not from the video timelines.

## Training a model means answering three questions

Post 1's framework says training means picking the best function f* from a set of candidates. NN Basics p. 6 splits that into three questions, and the whole deck follows them:

1. **Q1: What is the model?** (What does the set of candidate functions look like?) → model architecture
2. **Q2: What does a "good" function mean?** → loss function design
3. **Q3: How do we pick the "best" function?** → optimization

## Q1: What is the model?

### Turn inputs and outputs into vectors

Pages 10–14 narrow the scope to classification and assume both input x and output y can be written as fixed-size vectors, f: R^N → R^M. Two examples:

- **Handwritten digits**: a 16×16 image with one dimension per pixel (1 for ink, 0 otherwise), 256 dimensions in all. The output has 10 dimensions, each meaning "is it this digit?"
- **Sentiment analysis**: the input is one word, as a vector the size of the vocabulary with a 1 only in that word's slot. The output has 3 dimensions: positive, negative, neutral.

Page 10 also warns that some tasks are hard to formulate as classification.

### One neuron, one layer of neurons

Pages 16–21 start from a single neuron. Inputs x1…xN are multiplied by weights w1…wN and added to a bias b to get z, which passes through a sigmoid σ(z) = 1 / (1 + e^(−z)) to give y. The weights and the bias are the neuron's parameters.

- **The bias** is an "always on" feature. Page 18 says it gives a class prior.
- **A single neuron only does binary classification**: y > 0.5 means "is a 2," otherwise "not a 2."
- **A layer of neurons handles multiple classes**: for digits, 10 neurons each judge "is it a 1," "is it a 2," and so on, and the largest wins.

### The perceptron's limit: XOR

Pages 23–25 cover the perceptron, a single layer of neurons. Each output unit works separately with no shared weights. Adjusting the weights moves the location, orientation, and steepness of a "cliff." A perceptron can represent AND, OR, and NOT, **but not XOR**, because at heart it is a linear separator.

The fix is to stack. A xor B = AB' + A'B: compute intermediate results with a few units, then combine them. **Chaining several operations produces more complex outputs.**

### Multi-layer perceptrons and notation

Pages 27–29 extend the single layer to a multi-layer perceptron (MLP). Page 28 shows where the expressive power comes from. With two layers you can combine two opposite-facing threshold functions into a ridge. With three layers you can combine two perpendicular ridges into a bump, and adding bumps of different sizes and positions can fit any surface. A fully connected feedforward network with several hidden layers is a DNN.

Pages 30–40 define notation and end with one relation that backpropagation will reuse:

```text
z^l = W^l a^(l-1) + b^l      # previous layer's output times the weight matrix, plus the bias vector
a^l = σ(z^l)                 # apply the activation element-wise
```

<details>
<summary>Notation (NN Basics pp. 30–34)</summary>

- `a_i^l`: output of neuron i in layer l; the layer's output is the vector `a^l`.
- `w_ij^l`: weight from neuron j in layer l−1 to neuron i in layer l; the weights between two layers form the matrix `W^l`.
- `b_i^l`: bias of neuron i in layer l; the layer's biases form the vector `b^l`.
- `z_i^l`: activation input of neuron i in layer l; the layer's inputs form the vector `z^l`.

The whole network applies these two equations layer by layer, starting from `x = a^0` and ending at the output `y = a^L`.

</details>

### Why activations must be nonlinear

Page 43 lists three common choices: sigmoid, tanh, and ReLU. Page 44 gives the reason: **without nonlinearity, any number of stacked layers collapses into one linear function**. With it, more layers can approximate more complex functions.

## Q2: What makes a function good?

Page 48 swaps "pick a function" for "pick parameters." Different W and b give different functions, so choosing a function f means choosing a parameter set θ.

Page 50 defines two ways to score θ. A loss (or cost, or error) function C(θ) measures how bad θ is, to be minimized. An objective or reward function O(θ) measures how good it is, to be maximized. Page 51 gives an example that sums the error over all training samples. Page 52 lists common losses: square loss, hinge loss, logistic loss, and cross-entropy loss.

## Q3: How do we pick the best function?

### Gradient descent

Page 55 rules out two approaches. Enumerating every θ is impossible. Solving directly with calculus fails because we don't know what C(θ) looks like over the whole space.

Pages 57–61 use gradient descent, pictured as "drop a ball and see where it stops rolling." Start from a random θ⁰, compute the gradient there, and step in the opposite direction by an amount set by the learning rate η. Repeat until the parameters stop changing. With more than one parameter, take the partial derivative along each dimension to form the gradient vector.

Pages 64–69 work through a single neuron with three parameters (w1, w2, b) and a square error loss by hand. Page 71 names the real problem: a neural network's gradient involves millions of parameters, and **computing it efficiently requires backpropagation**.

### SGD and mini-batches

Page 72 points out another problem with gradient descent: you must see every training sample before each update, which is slow.

| Method | Samples per update | What the deck says |
|---|---|---|
| Gradient descent | All K | Updates only after seeing everything; slow |
| SGD | 1 | Updates after one sample; approaches the target faster than gradient descent |
| Mini-batch SGD | B (batch size) | Training speed: mini-batch > SGD > gradient descent |

Page 75 defines an epoch as one pass over all training data. Page 82 explains why mini-batch beats SGD: modern hardware runs matrix-matrix multiplication faster than matrix-vector multiplication, so processing B samples at once beats B single-sample steps.

### Practical tips and the learning recipe

Pages 83–87 make several points:

- Neural networks have no guarantee of reaching the global optimum (local optima).
- Different initializations give different trained models. Don't set parameters equal; initialize them randomly.
- Set the learning rate carefully; too large and training diverges.
- For mini-batch training, shuffle samples before every epoch so the network doesn't memorize the order, use a fixed batch size per epoch, and when you multiply the batch size by K, you can in theory multiply the learning rate by K.

Pages 88–92 give a learning recipe, which is really a debugging order. First check performance on the training set. If it is poor, either no good function exists in your hypothesis set (change the architecture) or you can't find it (change the training strategy). If training is good but validation is poor, you are overfitting, and more training data or tricks such as dropout can help.

## Backpropagation: computing gradients efficiently

Backpropagation p. 12 separates two directions:

- **Forward propagation**: information flows from input x to output y. During training it continues until it produces a scalar cost C(θ).
- **Back-propagation**: lets information from the cost flow backward to compute the gradient. The deck notes that it applies to any function, not just neural networks.

The core tool on p. 13 is the chain rule: forward to compute the cost, backward to compute the gradient.

Here is the intuition. A weight `w_ij^l` affects the cost first through its `z_i^l` and then through every later layer. The deck splits that chain into two factors:

```text
∂C/∂w_ij^l = ∂z_i^l/∂w_ij^l  ×  ∂C/∂z_i^l
           = a_j^(l-1)        ×  δ_i^l
```

- The first factor is just the previous layer's output `a_j^(l-1)` (the input `x_j` for the first layer), **which the forward pass already computed**.
- The second factor `δ_i^l` is the error signal that reaches layer l. The key observation on p. 20: **computing δ layer by layer, from δ^L back to δ^1, is far more efficient than expanding the whole chain for each parameter**, because layer l's δ follows directly from layer l+1's.

The concluding slide on p. 32 makes the same point in one line: every gradient is built from two precomputed terms, one from the backward pass and one from the forward pass.

<details>
<summary>The δ recursion (Backpropagation pp. 20–30)</summary>

**Initialization: the output layer's δ^L.** For output neuron n:

```text
δ_n^L = ∂C/∂z_n^L = σ'(z_n^L) × ∂C/∂y_n
```

where `∂C/∂y_n` depends on which loss function you use. In vector form: `δ^L = σ'(z^L) ⊙ ∇_y C` (⊙ is element-wise multiplication).

**Recursion: δ^l from δ^(l+1).** A change in `z_i^l` changes `a_i^l`, which reaches every `z_k^(l+1)` in the next layer through the weights, so you sum over all paths:

```text
δ_i^l = σ'(z_i^l) × Σ_k  w_ki^(l+1) × δ_k^(l+1)
δ^l   = σ'(z^l) ⊙ (W^(l+1))^T δ^(l+1)
```

Pages 26–27 draw this as a "reversed network": δ^(l+1) is the input, it is multiplied by the transposed weight matrix (W^(l+1))^T, and then by a constant σ'(z_i^l). Because the forward pass already computed z, σ'(z) is a known constant during the backward pass.

**Unrolled** (p. 28):

```text
δ^l = σ'(z^l) ⊙ (W^(l+1))^T [ σ'(z^(l+1)) ⊙ … (W^L)^T [ σ'(z^L) ⊙ ∇_y C ] ]
```

**Putting it together** (pp. 29–31):

1. Forward pass: compute z^l and a^l for every layer from the input, and store them.
2. Backward pass: compute δ^L from ∇_y C, then work back to δ^1.
3. Each weight's gradient is a_j^(l-1) × δ_i^l; each bias's gradient is δ_i^l (since ∂z/∂b = 1).
4. Use these gradients for one gradient descent update.

</details>

**Something to try tonight**: take a network with 2 layers of 2 neurons each, pick any weights and one input, and do a forward pass by hand, writing down z and a for every layer. Then use the recursion above to get δ² and δ¹, and from them every weight's gradient. Finally, nudge one weight up and down by 0.0001 and check whether the change in loss divided by 0.0002 is close to your computed gradient. If it matches, you actually understand backprop.

## Further reading

- [CS224N Lecture 3: Matrix Calculus and Backpropagation](/posts/ai/2026-08-22-cs224n-backprop-neural-nets-en) covers the same chain rule from the angle of computation graphs and matrix shapes, and also covers gradient checking.
- [CMU 11-785 Lecture 4: Gradient Descent](/posts/ai/2026-08-22-cmu-11785-04-gradient-descent-en) and [Lecture 5: Backpropagation](/posts/ai/2026-08-22-cmu-11785-05-backpropagation-en) give fuller derivations and go on to other optimizers.
- For a PyTorch implementation, see ADL's Dev Infra recitation in [post 18](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations-en) of this series.

Previous: [What Machine Learning and Deep Learning Are](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction-en)
Next: [Word Vectors, Language Models, and RNNs](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn-en)

## References

- [ADL Fall 2025 NN Basics slides (250901_NNBasics.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_NNBasics.pdf)
- [ADL Fall 2025 Backpropagation slides (250901_Backprop.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Backprop.pdf)
- [ADL 2.1: How to Train a Model? (YouTube)](https://youtu.be/YfNmHxDHE-M) (in Mandarin)
- [ADL 2.2: What is a Model? (YouTube)](https://youtu.be/AySPuO7vOvA) (in Mandarin)
- [ADL 2.3: What does the "Good" Function Mean? (YouTube)](https://youtu.be/OjX-O9uuug8) (in Mandarin)
- [ADL 2.4: How can we Pick the "Best" Function? (YouTube)](https://youtu.be/Uo3ZavxQyCs) (in Mandarin)
- [ADL 2.5: Backpropagation (YouTube)](https://youtu.be/BHgssEwMxsY) (in Mandarin)
- [ADL Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [2025 Fall playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
