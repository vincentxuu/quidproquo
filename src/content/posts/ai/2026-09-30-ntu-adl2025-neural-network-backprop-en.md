---
title: "Neural Networks and Backpropagation | NTU Yun-Nung Chen Applied Deep Learning Lecture 2"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, deep-learning, neural-networks, backpropagation]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning"
  order: 2
tldr: "Training a model means answering three questions. What is the model: layers of neurons, each computing z = Wa + b followed by a non-linearity; one neuron draws only one boundary, so it cannot compute XOR, and stacking layers can. What does a good function mean: define a loss, and smaller is better. How to pick the best: gradient descent takes a step along the slope where it stands, and practice uses mini-batch SGD. With millions of parameters, gradients come from backpropagation: a forward pass stores every layer's output, a backward pass computes δ from the output layer back, and their product is each weight's gradient. The guide works each of these through with numbers."
description: "A guide to Lecture 2 of NTU Yun-Nung Chen's Applied Deep Learning, Fall 2025, built from the NN Basics and Backpropagation decks and the spoken content of videos 2.1–2.5: one-hot encoding, the neuron and its bias, the perceptron and XOR, ridges and bumps, non-linear activations, loss functions, gradient descent, SGD and mini-batch, learning rate, local optima, the learning recipe and overfitting, and the δ recursion of backpropagation. Includes three worked examples (an XOR network, one neuron update, and backpropagation) and a self-check with answers."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop)

**Video status: Videos included.** [Source details](#course-video-sources)

This is Lecture 2 in [Reading NTU Yun-Nung Chen Applied Deep Learning](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en). ADL Fall 2025 (NTU term 114-1, 2025/09/01–12/15) lists these two decks, together with the Introduction from [Lecture 1](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction-en), under "self-study / prerequisite." They are HW0 material that students must finish before enrolling.

**Sources**: the [NN Basics deck](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_NNBasics.pdf) (93 pages), the [Backpropagation deck](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Backprop.pdf) (33 pages), and five videos in Mandarin:

| Video | Length | Deck pages |
|---|---|---|
| [2.1 How to Train a Model?](https://youtu.be/YfNmHxDHE-M) | 4:41 | NN Basics pp. 4–7 |
| [2.2 What is a Model?](https://youtu.be/AySPuO7vOvA) | 46:40 | NN Basics pp. 8–44 |
| [2.3 What does the "Good" Function Mean?](https://youtu.be/OjX-O9uuug8) | 8:41 | NN Basics pp. 45–52 |
| [2.4 How can we Pick the "Best" Function?](https://youtu.be/Uo3ZavxQyCs) | 57:29 | NN Basics pp. 53–93 |
| [2.5 Backpropagation](https://youtu.be/BHgssEwMxsY) | 44:06 | All of Backpropagation |

Video 2.5 is linked from the course page but is not on the [2025 Fall playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o), so watching only the playlist skips it. The page ranges in the table come from the section title slides in the deck, not from the video timelines.

After this lecture you should be able to do four things: turn an example into a fixed-length vector; say why one layer of neurons cannot compute XOR and two layers can; compute the gradient of the loss for a single neuron and update its parameters once; and compute the gradient of every layer with one forward pass and one backward pass. Examples marked "made up for this post" are not from the lecture.

## Training a model means answering three questions

[Lecture 1](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction-en) said that training picks the best function f* from a set of candidates. Page 6 of NN Basics splits this into three questions, and the lecture follows that order:

1. **What is the model?** That is, what the set of candidate functions looks like.
2. **What does a "good" function mean?** There has to be a standard that can be computed.
3. **How do we pick the "best" function?** There are infinitely many candidates, so they cannot be tried one by one.

## Question 1: what is the model?

### First turn inputs and outputs into vectors

This lecture covers classification only. Two classes is binary classification and more than two is multi-class, which Yun-Nung Chen, the instructor, says is the usual case in practice. She also notes that many tasks cannot be written as classification this cleanly (page 10).

The model is a function f: R^N → R^M. N is the input dimension and M is the number of classes, and both must be fixed: a model built for 1000 dimensions must be given 1000 dimensions, and a model trained on 10 classes can only be used with 10.

How data becomes a vector (pages 11–14):

- **Handwritten digits**: a 16×16 image has 256 pixels. Each pixel is one dimension, 1 with ink and 0 without, giving a 256-dimensional x. The output has 10 dimensions; the dimension for the correct digit is 1 and the rest are 0.
- **A word**: prepare a dictionary. If it has 1000 words, the vector has 1000 dimensions, and the dimension at the word's position in the dictionary is 1. If the output is positive, negative, or neutral, it has 3 dimensions.

A vector with a single 1 and 0 everywhere else is called **one-hot encoding**. She says this is only one way of turning data into vectors, and others come later.

### One neuron can do binary classification

A neuron takes a weighted sum of its inputs, adds a bias, and applies a sigmoid (pages 16–20):

```text
y = σ(w·x + b)
```

The output lies between 0 and 1. Put the threshold at 0.5, call y ≥ 0.5 "is a 2" and anything else "is not a 2," and one neuron performs binary classification. Adjusting w and b adjusts the y it gives for every image.

**What is the bias for?** Think of it as an input feature that is always 1, multiplied by its own weight b. Page 18 says it provides a class prior. Her explanation: z must reach 0 before y reaches 0.5. If most of the data should be judged "yes," the weighted sum alone will not easily clear the threshold every time, so the model learns a larger b to raise the starting point.

### One layer can do multi-class, with limited expressive power

To tell which digit an image shows, use 10 neurons (page 21): the first decides whether it is a 1, the second whether it is a 2, and so on. Then take the largest output. Because 1 and 7, or 7 and 9, look alike, two outputs may both exceed 0.5, which is why the largest is taken.

A model with a single such layer is a perceptron. It has two limits (pages 23–25):

- **Each output works alone.** Deciding "is it a 2" and deciding "is it a 7" are computed independently with no shared weights. If an image is clearly a 2, that information does not help the neuron responsible for 7.
- **One neuron draws only one boundary.** With two inputs, plotting y in 3D gives a slope. Adjusting the weights moves the slope's position, orientation, and steepness, and it remains a single slope.

XOR shows the second limit most clearly. For AND and OR, one straight line separates the black points from the white ones. For XOR's four points, none does:

| x1 | x2 | XOR |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

Her solution goes back to logic circuits: XOR can be written as (A AND NOT B) OR (NOT A AND B). It takes several simple operations combined, and a single operation cannot do it.

**Turning that solution into a network (made up for this post).** To keep the arithmetic easy, this uses a step function (1 if z > 0, otherwise 0) in place of the sigmoid:

```text
h1 = step( x1 − x2 − 0.5)     # A AND NOT B
h2 = step(−x1 + x2 − 0.5)     # NOT A AND B
y  = step( h1 + h2 − 0.5)     # OR
```

| x1 | x2 | h1 | h2 | y |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 1 |
| 1 | 0 | 1 | 0 | 1 |
| 1 | 1 | 0 | 0 | 0 |

The two neurons in the first layer each draw one boundary, and the second layer combines the two results. That is what the extra layer buys.

### Stacking: ridges and bumps

With one more layer, the neurons in the middle are called hidden units, because the training data never says what they should output. Pages 23 and 28 illustrate how expressive power grows:

- One layer: a slope.
- Two layers: put two slopes facing opposite ways together and get a ridge, which separates a band of points in the middle from both sides.
- Three layers: put two perpendicular ridges together and get a bump, which encloses one small region by itself.

A bump's size, height, and position can all be adjusted through the weights, and adding many bumps together covers very complex distributions. She notes the cost as well: with too many parameters, the model tries to enclose even the noise in the data and learns the wrong thing, so more parameters call for more data.

More than one hidden layer is called deep. She adds that before the term existed, only one layer could be computed.

### Notation and the one relation to remember

Pages 30–40 define the notation. The second half of the lecture rests on these two lines:

```text
z^l = W^l a^(l-1) + b^l      # previous layer's output times the weight matrix, plus the bias vector
a^l = σ(z^l)                 # activation applied elementwise
```

<details>
<summary>Notation (NN Basics pp. 30–34)</summary>

- `a_i^l`: the output of neuron i in layer l; the whole layer's output is the vector `a^l`.
- `w_ij^l`: the weight from neuron j in layer l−1 to neuron i in layer l; the weights between two layers form the matrix `W^l`.
- `b_i^l`: the bias of neuron i in layer l; the whole layer's bias is the vector `b^l`.
- `z_i^l`: the weighted sum of neuron i in layer l before the activation; the whole layer is the vector `z^l`.

The whole network applies these two lines layer by layer starting from the input x (the first layer uses x in place of a^(l−1)) up to the output layer `y = a^L` (page 39).

</details>

### Why the activation must be non-linear

The three common choices are sigmoid, tanh, and ReLU (page 43), all non-linear. She explains why: each layer multiplies by a matrix. If the activation in between were linear, the product W²(W¹x) could be multiplied out into a single matrix, two layers would act like one, and the extra parameters would be wasted. With non-linearity, the network can draw curved boundaries and is not limited to straight cuts.

As for which activation to choose, she says there is no good guideline yet. It affects performance, and you have to try.

## Question 2: what does a good function mean?

A set of values for w and b determines one function. So picking a function is picking parameters, collectively written θ (page 48).

To let the machine know which set is better, define another function that scores it (page 50):

- **Loss (also cost or error) function C(θ)**: measures how bad θ is; smaller is better. The best parameters are the ones that minimize C(θ).
- **Objective (also reward) function O(θ)**: measures how good θ is; larger is better.

A good function's predictions should be close to the answers in the data. The most direct loss sums, over all examples, the gap between prediction and answer (page 51 writes it as a norm ‖ŷ − f(x; θ)‖; she calls it the absolute difference). Other common choices are square loss, hinge loss, logistic loss, and cross entropy (page 52). She asks students to notice the reason behind each one, such as why to square: the larger the difference, the heavier the penalty should be.

## Question 3: how do we pick the best function?

### Two routes that do not work

- **Brute force**: plug in every θ and compare. Impossible, because w and b can be any decimal and there are infinitely many candidates.
- **Solve for a zero derivative directly**: the minimum of C(θ) is where the derivative is zero. But we do not know what C(θ) looks like overall, so it cannot be solved directly.

### Gradient descent: drop a ball and let it roll down

The method looks only at where you stand (pages 57–61):

1. Pick a random starting point θ⁰.
2. Compute the derivative there. A negative slope means downhill is to the right, so θ should increase; a positive slope means θ should decrease.
3. Take a step in that direction, with a size set by the learning rate η.
4. Repeat until the derivative is zero and the parameters stop changing.

As a formula:

```text
θ^(i+1) = θ^i − η · ∂C/∂θ
```

With more than one parameter, take the partial derivative for each and update each one.

### Working it out for one neuron (pages 64–69)

The model is a single neuron with two inputs, y = σ(w1·x1 + w2·x2 + b). The loss is square error. Page 65 sums it over all examples; as in the derivation on page 68, this looks at one example: C = (y − ŷ)². The chain rule plus the sigmoid's derivative σ'(z) = σ(z)(1 − σ(z)) gives:

```text
∂C/∂w1 = 2(y − ŷ) · y(1 − y) · x1
∂C/∂w2 = 2(y − ŷ) · y(1 − y) · x2
∂C/∂b  = 2(y − ŷ) · y(1 − y)
```

She points out what it means: the gradient depends on how far the prediction is from the answer, and on the input attached to that weight. The formula allows one more step (my own inference): a weight whose input is 0 has a gradient of 0 and is not updated.

**With numbers (made up for this post).** Take x = (1, 2), starting w = (0.5, −0.5), b = 0, answer ŷ = 1, and η = 1.

- z = 0.5×1 + (−0.5)×2 + 0 = −0.5, y = σ(−0.5) ≈ 0.3775
- C = (0.3775 − 1)² ≈ 0.3875
- The shared part: 2(y − ŷ)·y(1 − y) = 2 × (−0.6225) × 0.3775 × 0.6225 ≈ −0.2926
- ∂C/∂w1 ≈ −0.2926, ∂C/∂w2 ≈ −0.5851, ∂C/∂b ≈ −0.2926
- Update: w1 = 0.5 + 0.2926 = 0.7926, w2 = −0.5 + 0.5851 = 0.0851, b = 0.2926
- Compute again: z = 0.7926 + 0.1702 + 0.2926 = 1.2554, y ≈ 0.7782, C ≈ 0.0492

One step takes the loss from 0.3875 to 0.0492. All three gradients are negative, so all three parameters increase, and the output moves toward the answer 1.

That was three parameters. One layer of 100 × 100 has ten thousand weights, ten layers have a hundred thousand, and real networks start in the millions. Every step needs the partial derivative for every parameter, which is why backpropagation is needed.

### How many examples to see before each update

The loss is defined as the sum of errors over all the data. Done literally, ten thousand examples must all be processed before a single update, which is too slow.

| Method | Examples per update | Property |
|---|---|---|
| Gradient descent | All K | Slowest |
| SGD | 1, chosen at random | Updates quickly; when every example is equally likely to be chosen, the expected gradient equals the gradient over all data |
| Mini-batch SGD | B | What is used in practice |

Seeing all the data once is one **epoch**. She compares the methods with 20 examples: in one epoch, gradient descent updates once and SGD updates 20 times, so after the same pass SGD is closer to the target.

**Why is mini-batch even faster than SGD?** The charts on pages 80–81 show training speed as mini-batch > SGD > gradient descent. Intuitively SGD, which updates on every example, should be fastest, and she says this is a common question. The answer is hardware (page 82): SGD computes one vector times a matrix each time, while mini-batch stacks B examples into a matrix and computes a matrix times a matrix. Modern computers optimize matrix-matrix multiplication heavily, so it beats doing B vector computations. The chart on page 80 also plots accuracy, which is better toward the SGD end of the batch-size axis, and she says about 10 is a setting that balances speed and accuracy.

### What comes up during training

- **Local optima** (page 83). The ball stops in the first hollow it rolls into, which may not be the lowest point of the whole surface. A neural network's loss is not convex, and nothing guarantees finding the global optimum. She says this problem has not been fully solved.
- **Initialize randomly** (page 85). Starting from the same point every time means getting stuck in the same hollow.
- **Learning rate** (page 86). Too large, and one step lands somewhere with a higher cost. Somewhat smaller but still too large, and it skips past the minimum and gets stuck elsewhere, so the loss stops falling. Too small, and it descends very slowly. There is no universal setting; it takes practice.
- **Shuffle before every epoch** (page 87). Without shuffling, the model sees the same order each time and may memorize the order instead of learning the data.
- **Keep the batch size fixed.** Matrices of a consistent size compute efficiently.
- **Adjust batch size and learning rate together.** Page 87 of the deck: K times the batch size means, theoretically, √K times the learning rate. For example, 4 times the batch size goes with 2 times the learning rate. She says this is only for reference and that she has not looked into why it is the square root of K.

### The learning recipe: where to look first when results are poor

The data is split three ways (pages 88–89). Training data is used to train. Validation data is held out from the labeled data and not trained on, so you know right away how the model does on unseen examples. Real testing data has no answers, as in a competition where the score appears only after submission.

The debugging order (pages 90–91):

1. **First check results on the training set.** If they are poor there are two possibilities: no good function exists among the candidates (the model is too small, so change the architecture), or one exists and was not found (stuck in a local optimum, so change the training strategy). The two are hard to tell apart directly. Her practice is to assume the second first and adjust the learning rate and starting point, and to change the model only if the loss still will not go down.
2. **When training is good, check validation.** If validation is also good, you are done. Good on training and poor on validation is **overfitting**.

She explains overfitting with the figure on page 92, in which the true function is a curve. A degree-1 model can only draw a line, and the figure marks its MSE (mean squared error) on the training data as 1.37. Degree 2 draws a curve close to the true one, with an MSE of 0.70. A model of very high degree (degree 10 on the figure; she says 14 in the video) gets a lower training MSE still, 0.52 on the figure, but the curve swings wildly between points, and unseen examples that land there are wrong.

Ways to deal with overfitting (page 92): add training data, or use techniques such as dropout so the parameters do not simply memorize the training data.

## Backpropagation: one forward pass plus one backward pass

She first explains the purpose of this part: today's tools already implement backpropagation, and nobody needs to write it for homework or research. The purpose here is to know how gradients for so many parameters are computed quickly.

### Two directions

- **Forward propagation**: data flows from the input x layer by layer to the output y, which is compared with the answer to give the cost.
- **Backpropagation**: error information flows from the end back to the front and tells each layer's weights how to change. Page 12 of the deck notes that it is not limited to neural networks and applies to any function.

This works because of the chain rule (page 13). Suppose w affects x, x affects y, and y affects z. Then

```text
∂z/∂w = ∂z/∂y · ∂y/∂x · ∂x/∂w
```

Backpropagation computes the factor nearest the output, ∂z/∂y, first, and then multiplies on one factor at a time toward the input.

### Split one weight's gradient into two factors

We want ∂C/∂w_ij^l. This weight first affects z_i^l, and then affects C through every later layer, so split it:

```text
∂C/∂w_ij^l = ∂z_i^l/∂w_ij^l  ×  ∂C/∂z_i^l
           = a_j^(l-1)        ×  δ_i^l
```

- **The first factor is easy.** z_i^l is the sum of the previous layer's outputs times their weights. Differentiating with respect to w_ij^l leaves only its coefficient, the previous layer's output a_j^(l−1). For the first layer it is the input x_j.
- **The second factor is hard.** C sits at the very end of the network and z_i^l is in the middle, many layers apart. The deck gives it a symbol, δ_i^l, meaning the gradient propagated back to layer l.

### Computing δ: from the last layer backward

**The last layer** is closest to C, so the chain rule applies directly:

```text
δ_i^L = σ'(z_i^L) × ∂C/∂y_i
```

∂C/∂y_i depends on how the loss is defined, and σ'(z) depends on the activation. She gives its meaning: the larger the error, the larger the gradient sent back.

**Middle layers.** z_i^l first affects a_i^l of the same neuron, and a_i^l then affects every z_k^(l+1) in the next layer through the weights, so all the paths are summed:

```text
δ_i^l = σ'(z_i^l) × Σ_k  w_ki^(l+1) × δ_k^(l+1)
δ^l   = σ'(z^l) ⊙ (W^(l+1))^T δ^(l+1)        # vector form; ⊙ is elementwise multiplication
```

She asks students to look again at the shape of this formula (pages 26–27): take the next layer's δ as the input, form a weighted sum with the same weights, and multiply by a constant σ'(z). It is a network running in the opposite direction.

### The whole procedure (pages 29–32)

1. **Forward pass**: feed in the data, compute z and a for every layer, and store them.
2. **Backward pass**: compute δ^L from ∂C/∂y, then work backward layer by layer to δ^1.
3. Each weight's gradient = the output of the neuron before it × the δ of the neuron after it.

The deck derives only the weight gradients. Page 31 lists ∂C/∂b in the gradient vector but does not say how to compute it. The same split gives it (my own addition): a bias's gradient is δ itself, because ∂z/∂b = 1.

The gradient of every parameter is a product of numbers from these two passes. Intermediate results are reused, and no parameter needs its whole chain rule expanded from scratch. That is why it is efficient.

### The smallest example by hand (made up for this post)

The network is a single chain: input x, one hidden neuron, one output neuron, both sigmoid, no biases. Take x = 1, w¹ = 0.5, w² = −1, answer ŷ = 1, and C = (y − ŷ)².

**Forward:**

- z¹ = 0.5 × 1 = 0.5, a¹ = σ(0.5) ≈ 0.6225
- z² = −1 × 0.6225 = −0.6225, y = σ(−0.6225) ≈ 0.3492
- C = (0.3492 − 1)² ≈ 0.4235

**Backward:**

- δ² = σ'(z²) × ∂C/∂y = y(1 − y) × 2(y − 1) = 0.22727 × (−1.30156) ≈ −0.2958
- δ¹ = σ'(z¹) × w² × δ² = 0.6225 × 0.3775 × (−1) × (−0.2958) ≈ 0.0695

**Gradients:**

- ∂C/∂w² = a¹ × δ² = 0.6225 × (−0.2958) ≈ −0.1841
- ∂C/∂w¹ = x × δ¹ = 1 × 0.0695 = 0.0695

**Check.** Compute C with w¹ set to 0.5001 and to 0.4999, subtract, and divide by 0.0002: the result is 0.0695. The same for w² gives −0.1841. Both match the values above.

How to read the two numbers: ∂C/∂w² is negative, so w² should increase (−1 is too negative and pushes the output too low). ∂C/∂w¹ is positive, so w¹ should decrease. That looks odd at first, and the reason is that w² is negative: the smaller a¹ is, the less negative z² is, and the closer y gets to 1.

## Common misreadings

This list is my own summary, not something the lecture enumerated point by point.

- **"One layer of neurons can do any classification."** A neuron has a single boundary, and XOR cannot be separated.
- **"Stacking many layers gives great expressive power."** Without a non-linear activation in between, any number of layers equals one.
- **"SGD updates on every example, so it must be faster than mini-batch."** It updates more often, but each update is a vector computation. Mini-batch uses matrix computation and takes less wall-clock time.
- **"The lower the training loss, the better."** Good on training and poor on validation is overfitting.
- **"Backpropagation updates the parameters."** What it does is compute the gradients efficiently. Using them to update the parameters is the gradient descent step.

## Self-check

The questions were written for this post.

**1. A word is number 42 in a dictionary of 5000 words. How many dimensions does its one-hot vector have, and how many 1s?**

5000 dimensions, with a single 1 in dimension 42.

**2. With the weights of the XOR network above, what are h1, h2, and y for the input (1, 1)?**

h1 = step(1 − 1 − 0.5) = step(−0.5) = 0; h2 = step(−1 + 1 − 0.5) = 0; y = step(0 + 0 − 0.5) = 0.

**3. A neuron has x = (1, 0), w = (0, 0), b = 0, answer ŷ = 1, and square error. What are ∂C/∂w1 and ∂C/∂w2?**

z = 0 and y = 0.5. The shared part is 2 × (0.5 − 1) × 0.5 × 0.5 = −0.25. ∂C/∂w1 = −0.25 × 1 = −0.25, and ∂C/∂w2 = −0.25 × 0 = 0. Because x2 is 0, w2 does not move on this step.

**3b. Continuing, with η = 1, what are w1, w2, and b after one update? What is the new output y?**

∂C/∂b is also −0.25. w1 = 0 + 0.25 = 0.25, w2 = 0, and b = 0.25. The new z = 0.25 × 1 + 0 + 0.25 = 0.5, and y = σ(0.5) ≈ 0.622, closer to the answer 1 than the original 0.5.

**4. There are 1000 training examples and the batch size is 50. How many updates in one epoch? How many for gradient descent and for SGD?**

Mini-batch: 1000 ÷ 50 = 20. Gradient descent: 1. SGD: 1000.

**5. The training loss stays high. By her order, what do you adjust first?**

First assume a good function was not found: adjust the learning rate and change the starting point. Switch to a larger model only if the loss still will not go down.

**6. In the single-chain network above, if w² is changed to 0, what is ∂C/∂w¹, and why?**

It is 0. δ¹ = σ'(z¹) × w² × δ², and with w² at 0, δ¹ is 0. The output layer receives no signal from the hidden neuron, so changing w¹ does not affect C.

**7. Work the same single-chain network through with new numbers: x = 1, w¹ = 1, w² = 1, answer ŷ = 0. Find ∂C/∂w² and ∂C/∂w¹.**

Forward: a¹ = σ(1) ≈ 0.7311; z² = 0.7311 and y = σ(0.7311) ≈ 0.6750; C = y² ≈ 0.4557. Backward: δ² = y(1 − y) × 2(y − 0) ≈ 0.2194 × 1.3501 ≈ 0.2962; δ¹ = a¹(1 − a¹) × w² × δ² ≈ 0.1966 × 0.2962 ≈ 0.0582. Gradients: ∂C/∂w² = a¹ × δ² ≈ 0.2165 and ∂C/∂w¹ = x × δ¹ ≈ 0.0582. Both are positive, so both weights should decrease for the output to move toward 0.

## Further reading

- [CS224N Lecture 3: Matrix Calculus and Backpropagation](/posts/ai/2026-08-22-cs224n-backprop-neural-nets-en) covers the same chain rule from the angle of computation graphs and matrix shapes, and also covers gradient checking.
- [CMU 11-785 Lecture 4: Gradient Descent](/posts/ai/2026-08-22-cmu-11785-04-gradient-descent-en) and [Lecture 5: Backpropagation](/posts/ai/2026-08-22-cmu-11785-05-backpropagation-en) give fuller derivations and go on to other optimizers.
- For a PyTorch implementation, see ADL's Dev Infra recitation in [the TA recitations guide](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations-en) of this series.

Previous: [What Machine Learning and Deep Learning Are](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction-en)
Next: [Word Vectors, Language Models, and RNNs](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn-en)

## Course video sources

These videos were checked on 2026-10-10 against the official course page and official YouTube playlist (lecture numbers and titles match); no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=YfNmHxDHE-M
title: ADL 2.1: How to Train a Model? (YouTube)
```

```youtube
url: https://www.youtube.com/watch?v=AySPuO7vOvA
title: ADL 2.2: What is a Model? (YouTube)
```

Original videos: [ADL 2.1: How to Train a Model? (YouTube)](https://www.youtube.com/watch?v=YfNmHxDHE-M), [ADL 2.2: What is a Model? (YouTube)](https://www.youtube.com/watch?v=AySPuO7vOvA), [ADL 2.3: What does the "Good" Function Mean? (YouTube)](https://www.youtube.com/watch?v=OjX-O9uuug8), [ADL 2.4: How can we Pick the "Best" Function? (YouTube)](https://www.youtube.com/watch?v=Uo3ZavxQyCs), [ADL 2.5: Backpropagation (YouTube)](https://www.youtube.com/watch?v=BHgssEwMxsY)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

Checked: 2026-10-13.

Content check: verified against the video transcript (2026-10-13): 2.2, 2.3, 2.4, and 2.5 were worked from their captions; 2.1 (4:41) has no caption track and was checked against a machine transcript, whose three-question breakdown matches page 6 of the deck. 2.1 and 2.2 carry an upload date and description of 2023/09/14, so they are recordings reused from an earlier term. For the overfitting figure, the deck shows degree 10 and the video says 14; the guide notes this.

## Update Log

- 2026-10-10: Added video status and checked recording sources; 2.1 and 2.2 are older recordings dated 2023/09/14.
- 2026-10-13: Moved the verification history out of the body and switched cross-references within the series from post order to lecture numbers.
- 2026-10-13: Rewrote the whole guide from the spoken content of the videos (2.2–2.5 from captions, 2.1 checked against a machine transcript), adding three worked examples (an XOR network, one neuron update, and backpropagation), common misreadings, and a self-check with answers.

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
