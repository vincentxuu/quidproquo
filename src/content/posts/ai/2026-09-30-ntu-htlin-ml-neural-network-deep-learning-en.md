---
title: "Neural Networks: How Backpropagation Computes Gradients | NTU Hsuan-Tien Lin Machine Learning Techniques Lecture 12"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, neural-networks, backpropagation, regularization]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 29
tldr: "A linear aggregation of perceptrons can implement AND and OR but not XOR; one more layer can, and that is the multi-layer perceptron. This lecture replaces the sign in the middle with tanh, puts linear regression at the output layer, and derives backpropagation from the chain rule: compute every layer's output x forward, then compute δ backwards from the output layer, and the gradient of each weight is the previous layer's x times this layer's δ. It ends with two troubles in training: E_in is non-convex, so the initial weights should be small and random; d_VC is roughly O(VD), so weight elimination and early stopping are needed against overfitting."
description: "A guide to Lecture 12 of NTU Hsuan-Tien Lin's Machine Learning Techniques, Neural Network: from linear aggregation of perceptrons to multi-layer perceptrons, the tanh transformation function and the network notation, the full derivation of backpropagation, with the forward pass, the backward pass, and one gradient-descent step computed by hand on a 1-2-2-1 network, followed by initialization, the VC dimension, weight elimination, and early stopping."
draft: false
glossary:
  - term: "backpropagation"
    aliases: ["backprop"]
    definition: "Compute every layer's output x forward, then compute each neuron's δ (the partial derivative of the error with respect to that neuron's score) backwards from the output layer. The gradient of a weight is the previous layer's output xᵢ times this layer's δⱼ."
    context: "Techniques Lecture 12 uses it to compute the gradient of every weight in a neural network efficiently, and then runs (mini-batch) stochastic gradient descent."
  - term: "multi-layer perceptrons"
    aliases: ["MLP"]
    definition: "A model that chains perceptrons layer after layer: the outputs of one layer are the inputs of the next. XOR, which a single layer of linear combination cannot implement, becomes possible with one more layer."
    context: "Techniques Lecture 12 uses it to show why a neural network needs more than one layer of transformation."
  - term: "weight elimination"
    aliases: ["weight-elimination regularizer"]
    definition: "A regularizer that divides each weight's w² by 1 + w² and sums the results. Every term lies between 0 and 1; on small weights it acts much like L2, and on large weights it adds almost no further penalty."
    context: "Techniques Lecture 12 uses it in place of the non-differentiable L1 so that some of the weights shrink to nearly 0."
  - term: "early stopping"
    definition: "Stopping gradient descent before it has run the planned number of steps. The fewer the steps, the fewer weight combinations are visited, and the smaller the effective VC dimension."
    context: "Techniques Lecture 12 treats it as a form of regularization, with validation deciding which step to stop at."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning)

**Video status: Videos included.** This article is written from the official MOOC handout [212_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/212_handout.pdf) and transcripts of the four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/23 to 23/23), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Techniques Lecture 12 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Techniques into three ways of handling features. The first two are embedding numerous features with kernels (Embedding Numerous Features) and combining predictive features with aggregation (Combining Predictive Features). This lecture opens the third, Distilling Implicit Features: Extraction Models, in which the model extracts hidden features from the data by itself. The previous lecture, [Techniques Lecture 11: Gradient Boosted Decision Trees](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-11-gradient-boosted-decision-tree-en), takes up a single line on that page: aggregating trees from functional gradient and steepest descent subject to any error measure.

There are four prerequisites: the perceptron from [Foundations Lecture 2](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en); the three linear models and (stochastic) gradient descent from [Foundations Lecture 9](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en) through [Lecture 11](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform-en); linear aggregation from [Techniques Lecture 7](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost-en); and the chain rule from calculus. After reading, you should be able to build AND, OR, and XOR out of perceptrons on your own, write out the forward computation of a $d^{(0)}$-$d^{(1)}$-$\cdots$-$d^{(L)}$ network, derive the recursion for $\delta$ from scratch, and compute the gradient of every weight in a small network by hand.

## Why stack a second layer: a linear aggregation of perceptrons can implement AND but not XOR

```youtube
url: https://www.youtube.com/watch?v=GwRS2YJv2Ck
title: Neural Network :: Motivation @ Machine Learning Techniques (機器學習技法)
```

(Video 00:17–04:17 reviews the previous lecture and draws the linear aggregation of perceptrons as a picture, 04:17–09:02 builds AND, 09:02–13:08 covers powerfulness and limitation, 13:08–16:21 stacks up the multi-layer perceptron, 16:21–19:56 discusses biological neurons, and Fun Time follows.)

### Drawing a linear aggregation of perceptrons as a network

Page 2 of the handout starts from what the course has already covered. A perceptron multiplies the input by a set of weights, computes a score, and takes its sign. Take $T$ perceptrons $g_t(\mathbf{x}) = \text{sign}(\mathbf{w}_t^\top\mathbf{x})$ and apply the linear aggregation of Techniques Lecture 7, giving each $g_t$ a vote of $\alpha_t$:

$$
G(\mathbf{x}) = \text{sign}\Big(\sum_{t=1}^{T}\alpha_t\,\underbrace{\text{sign}\big(\mathbf{w}_t^\top\mathbf{x}\big)}_{g_t(\mathbf{x})}\Big)
$$

The slide draws this formula as a picture. The leftmost column holds the inputs $x_0 = 1, x_1, \dots, x_d$; every input connects to each of the $T$ circles in the middle column, with $\mathbf{w}_t$ on the connections; each middle circle then connects to $G$ on the far right through a line labelled $\alpha_t$. Inside every circle is a staircase-shaped function, meaning that the sign is taken once the score is computed. In the lecture, Lin calls the circles nodes.

The handout points out that the picture has two layers of weights ($\mathbf{w}_t$ and $\boldsymbol{\alpha}$) and two layers of sign functions (in $g_t$ and in $G$). The question this section answers is written at the bottom of the page: what boundary can $G$ implement?

### Logic operations with the second layer of weights

Page 3 looks at two perceptrons first. $g_1$ and $g_2$ are each a line in the plane, with $+1$ on one side (shaded blue in the figure) and $-1$ on the other (shaded red). Treat $+1$ as TRUE and $-1$ as FALSE. The target is $\text{AND}(g_1, g_2)$: only the region where both are TRUE is blue.

The construction adds a $g_0$ that always outputs $+1$ and sets the three votes to $\alpha_0 = -1$, $\alpha_1 = +1$, $\alpha_2 = +1$:

$$
G(\mathbf{x}) = \text{sign}\big(-1 + g_1(\mathbf{x}) + g_2(\mathbf{x})\big)
$$

List all four cases:

| $g_1$ | $g_2$ | $-1 + g_1 + g_2$ | $G$ | $\text{AND}(g_1, g_2)$ |
|---|---|---|---|---|
| $+1$ | $+1$ | $+1$ | $+1$ | TRUE |
| $+1$ | $-1$ | $-1$ | $-1$ | FALSE |
| $-1$ | $+1$ | $-1$ | $-1$ | FALSE |
| $-1$ | $-1$ | $-3$ | $-1$ | FALSE |

In the lecture, Lin describes it as two votes minus one: when both are $+1$, $+1$ is still left over; as soon as one of them is $-1$, $g_1 + g_2$ is at most 0, and subtracting 1 makes it negative. So $G \equiv \text{AND}(g_1, g_2)$. Lin then points out that the boundary of $G$ is now a bent line pieced together from two straight lines, no longer a single straight line.

The handout says OR and NOT can be similarly implemented. The lecture adds how to do NOT: multiply the output by $-1$ to flip it, that is, $\text{NOT}(g_1) = \text{sign}(-g_1)$. OR is left to this section's Fun Time.

### Powerfulness: with enough perceptrons, a smooth boundary can be approximated

The figure in the upper half of page 4 has three panels. The rightmost is the target: a circle, $+1$ inside and $-1$ outside. A single perceptron cannot do it. The two panels on the left use 8 and 16 perceptrons; each perceptron is a straight line, and together they enclose a polygon with $+1$ inside. The shape enclosed by 16 lines is closer to the circle than the one enclosed by 8. In the lecture, Lin says the perceptrons are combined in the same way as the AND above.

As an addition in this article, here is how the combination is written. The AND of $T$ perceptrons is

$$
G(\mathbf{x}) = \text{sign}\Big(-(T-1) + \sum_{t=1}^{T} g_t(\mathbf{x})\Big)
$$

When all $T$ are $+1$, the bracket is $T - (T-1) = +1$; when one is $-1$, the sum drops to $T - 2$ and the bracket is $-1$; the more $-1$s there are, the more negative it gets. With $T = 2$ it is the formula above. As for how close "closer" is, the following calculation is made up for this article and is not on the slides. Suppose the target is a circle of radius 1 (area $\pi \approx 3.1416$) and it is enclosed by a circumscribed regular $T$-gon, whose area is $T\tan(\pi/T)$. For $T = 8$ that is 3.3137, 5.5% more than the circle; for $T = 16$ it is 3.1826, only 1.3% more.

The handout makes two remarks on this figure. First, such a $G$ can implement every convex polygon, which is the convex set hypothesis set from [Foundations Lecture 5](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en); its VC dimension is infinite. Second, enough perceptrons give roughly a smooth boundary. In the lecture, Lin says an infinite VC dimension may be good news, since many perceptrons together are very powerful, and may be bad news, since a model that is too complex is in danger of overfitting. Lin also mentions that a similar phenomenon has appeared before: in the random forest figures of [Techniques Lecture 10](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-10-random-forest-en), a pile of irregular boundaries looks much smoother once combined.

### Limitation: XOR is still not linearly separable in the new space

The lower half of the same page is about what cannot be done. $\text{XOR}(g_1, g_2)$ is "TRUE exactly when one of the two is TRUE". In the figure, two lines cut the plane into four pieces; two opposite pieces are blue and the other two opposite pieces are red. In the lecture, Lin describes the blue as gathered on the two sides of a hyperbola, with the red on the other two sides.

The handout puts it this way: view $\boldsymbol{\phi}(\mathbf{x}) = (g_1(\mathbf{x}), g_2(\mathbf{x}))$ as a feature transform, and XOR is not linear separable in the transformed space. The second-layer $\boldsymbol{\alpha}$ only draws a line in that space, so no setting of it works. The lecture says only that some derivation shows it cannot be done, and that the derivation resembles what Foundations did when discussing how complex the perceptron itself is; the derivation is not carried out. This article fills it in.

After the transform there are only four points. XOR requires $(+1,+1)$ and $(-1,-1)$ to output $-1$, and $(+1,-1)$ and $(-1,+1)$ to output $+1$. Suppose some $(\alpha_0, \alpha_1, \alpha_2)$ makes $\text{sign}(\alpha_0 + \alpha_1 g_1 + \alpha_2 g_2)$ do this. Each of the four points gives one inequality:

$$
\begin{aligned}
\alpha_0 + \alpha_1 + \alpha_2 &< 0, & \alpha_0 - \alpha_1 - \alpha_2 &< 0, \\
\alpha_0 + \alpha_1 - \alpha_2 &> 0, & \alpha_0 - \alpha_1 + \alpha_2 &> 0.
\end{aligned}
$$

Adding the two inequalities in the first row gives $2\alpha_0 < 0$; adding the two in the second row gives $2\alpha_0 > 0$. These contradict each other, so no such $\boldsymbol{\alpha}$ exists. This is where the resemblance mentioned in the lecture lies: [Foundations Lecture 5](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en) counted that for four points in the plane arranged as a quadrilateral, a line cannot produce every labelling, and the one it misses is the labelling where diagonal points share a sign and adjacent points differ. XOR asks for exactly that labelling, only now it happens in the $(g_1, g_2)$ plane.

### One more layer of transformation gives the multi-layer perceptron

The data are still not separable in the transformed space. What did the course do in that situation before? The answer in the lecture is to transform once more, into a space that suits the problem better, where a line may be able to separate the data. Page 5 writes out the layer that is needed:

$$
\text{XOR}(g_1, g_2) = \text{OR}\big(\text{AND}(-g_1, g_2),\ \text{AND}(g_1, -g_2)\big)
$$

Do two ANDs first, then take the OR of the two results. From left to right, the network on the slide has the inputs, $g_1$ and $g_2$, two AND nodes, one OR node, and the output $G$. The line from $g_1$ to the first AND and the line from $g_2$ to the second AND are each labelled $-1$, meaning that $g$ is flipped first.

The handout does not write the weight on every line; the weights below are filled in by this article following the constructions for AND and OR. Let $a_1 = \text{sign}(-1 - g_1 + g_2)$, $a_2 = \text{sign}(-1 + g_1 - g_2)$, and $G = \text{sign}(+1 + a_1 + a_2)$:

| $g_1$ | $g_2$ | $-1 - g_1 + g_2$ | $a_1$ | $-1 + g_1 - g_2$ | $a_2$ | $1 + a_1 + a_2$ | $G$ |
|---|---|---|---|---|---|---|---|
| $+1$ | $+1$ | $-1$ | $-1$ | $-1$ | $-1$ | $-1$ | $-1$ |
| $+1$ | $-1$ | $-3$ | $-1$ | $+1$ | $+1$ | $+1$ | $+1$ |
| $-1$ | $+1$ | $+1$ | $+1$ | $-3$ | $-1$ | $+1$ | $+1$ |
| $-1$ | $-1$ | $-1$ | $-1$ | $-1$ | $-1$ | $-1$ | $-1$ |

The last column is exactly XOR. Put it in a concrete setting (made up for this article): take $g_1(\mathbf{x}) = \text{sign}(x_1)$ and $g_2(\mathbf{x}) = \text{sign}(x_2)$, so the two lines are the two coordinate axes. The point $(2, -1)$ has $(g_1, g_2) = (+1, -1)$, and the table gives $G = +1$; the point $(1, 2)$ has $(g_1, g_2) = (+1, +1)$, and $G = -1$. This network outputs $+1$ in the second and fourth quadrants and $-1$ in the first and third, a boundary that no single straight line can draw.

Why does one more layer work? In the $(a_1, a_2)$ space the four input cases land on only three points: $(-1,-1)$ appears twice (the two cases that should output $-1$ are folded onto each other), and the others are $(-1,+1)$ and $(+1,-1)$. One line separates these three points, and OR is that line.

The handout calls this model multi-layer perceptrons, the basic neural network, and lines up three stages in a row: perceptron (simple), aggregation of perceptrons (powerful), multi-layer perceptrons (more powerful).

### The connection to biological neurons is only inspiration

Page 6 has four pictures: a micrograph of neurons, the network diagram from before, a seagull, and an airliner. The handout's conclusion is that the neural network is a bio-inspired model.

The correspondence given in the lecture goes like this: each circle in the network diagram corresponds to a neuron, the connections between circles correspond to the links between neurons, and the size of a weight stands for the strength of the link. But neurons in a living body are not necessarily connected layer by layer, and there may be many more cross connections among them, so the diagram is a simplified approximation.

The bird and the airplane illustrate how far the "imitation" goes. People saw birds fly and built airplanes; the airplane's shape does borrow from the bird's, but its wings do not flap the way a bird's do, and it gets into the air by other means. Lin stresses in the lecture that the neural network is the same: it is inspired by biology, but from an engineering point of view we are working with a mathematical model, and it does not have to behave exactly like the neural network in a living body.

### Fun Time: which weights give OR

**Question (page 7):** Let $g_0(\mathbf{x}) = +1$. Which of the following $(\alpha_0, \alpha_1, \alpha_2)$ allows $G(\mathbf{x}) = \text{sign}\big(\sum_{t=0}^{2}\alpha_t g_t(\mathbf{x})\big)$ to implement $\text{OR}(g_1, g_2)$?

1. $(-3, +1, +1)$
2. $(-1, +1, +1)$
3. $(+1, +1, +1)$
4. $(+3, +1, +1)$

**Answer: 3.** The handout says only that you can easily verify with all four possibilities of $(g_1, g_2)$. All four choices have $\alpha_1 = \alpha_2 = +1$; they differ only in $\alpha_0$. Over the four cases $g_1 + g_2$ is $+2, 0, 0, -2$; add $\alpha_0$ and take the sign:

| $\alpha_0$ | $(+,+)$ | $(+,-)$ | $(-,+)$ | $(-,-)$ | Function implemented |
|---|---|---|---|---|---|
| $-3$ | $-1$ | $-1$ | $-1$ | $-1$ | always FALSE |
| $-1$ | $+1$ | $-1$ | $-1$ | $-1$ | AND |
| $+1$ | $+1$ | $+1$ | $+1$ | $-1$ | OR |
| $+3$ | $+1$ | $+1$ | $+1$ | $+1$ | always TRUE |

OR outputs FALSE only when both are FALSE, which is the row with $\alpha_0 = +1$. Choice 2 is the AND from before. The role of $\alpha_0$ is to decide "how many votes it takes to pass": $-1$ requires both votes, and $+1$ is satisfied with one.

## What a neural network hypothesis looks like: a linear model at the output layer, a tanh transformation at every layer in between

```youtube
url: https://www.youtube.com/watch?v=giOcWMbi1bU
title: Neural Network :: Neural Network Hypothesis @ Machine Learning Techniques (機器學習技法)
```

(Video 00:01–02:19 covers the output layer, 02:19–08:04 the transformation function in the middle, 08:04–14:45 the notation, 14:45–17:18 the physical interpretation of each layer, and Fun Time follows.)

### The output layer can be whichever linear model you like

Read the network from left to right: the input is transformed once, then once more, and the last node multiplies the transformed result by weights to compute a score. Page 8 writes this score as

$$
s = \mathbf{w}^\top\boldsymbol{\phi}^{(2)}\big(\boldsymbol{\phi}^{(1)}(\mathbf{x})\big)
$$

So the output node is simply a linear model, applied to features that have been transformed several times. The handout says that every linear model from Foundations can be used here, and puts three side by side:

| Output layer | Output | Error |
|---|---|---|
| linear classification | $h(\mathbf{x}) = \text{sign}(s)$ | 0/1 |
| linear regression | $h(\mathbf{x}) = s$ | squared |
| logistic regression | $h(\mathbf{x}) = \theta(s)$ | cross-entropy |

The handout picks the middle one: from here on it discusses regression with squared error, and the output layer passes the score straight out. In the lecture, Lin says this is for ease of explanation, and that the classification and soft-classification versions can be worked out along the same lines.

### Which transformation function the middle nodes should use

Page 9 gives a name to the staircase drawn inside the middle nodes: the transformation function, which turns the incoming score $s$ into the node's output. A staircase means every middle node is a perceptron. Can it be replaced by something else? The handout first rules out two choices:

- **A linear function.** If every node is a linear operation, the whole network is still a linear operation, which the handout calls less useful. The lecture asks more bluntly: then why use so many nodes, when a single linear model would do.
- **A staircase function (sign).** The output is only $\pm 1$, which is discrete, and the handout says that makes it hard to optimize for $\mathbf{w}$. The lecture takes pocket from Foundations Lecture 2 as an example: optimizing linear classification is hard to begin with, and only rather heuristic methods are available.

The popular choice is the hyperbolic tangent $\tanh$:

$$
\tanh(s) = \frac{\exp(s) - \exp(-s)}{\exp(s) + \exp(-s)}
$$

The slide plots three curves together: sign is a staircase, linear is a slanted straight line, and $\tanh$ is an S shape between them. As the lecture describes it, $\tanh$ is close to the staircase function when $s$ is far from 0 and close to the linear function when $s$ is near 0. The handout lists three reasons for choosing it:

- It is an 'analog' approximation of sign and is easier to optimize. In the lecture, Lin says sign is like the digital version and $\tanh$ is its analog version; the formula is made entirely of exponential functions, so it is smooth and differentiable.
- It is somewhat closer to the biological neuron. The lecture explains that what goes on in a living body is by and large continuous, not discrete.
- It is not that new. This refers to the identity below.

$$
\tanh(s) = 2\theta(2s) - 1
$$

$\theta(s) = \frac{1}{1 + \exp(-s)}$ is the logistic function from [Foundations Lecture 10](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-10-logistic-regression-en). The handout writes only the result; the check goes as follows:

$$
2\theta(2s) - 1 = \frac{2}{1 + \exp(-2s)} - 1 = \frac{1 - \exp(-2s)}{1 + \exp(-2s)} = \frac{\exp(s) - \exp(-s)}{\exp(s) + \exp(-s)}
$$

The last step multiplies the numerator and the denominator by $\exp(s)$. So $\tanh$ is the logistic function with its input scaled up by two and its output stretched and shifted from $(0, 1)$ to $(-1, 1)$. Two of its properties are used later: $\tanh(0) = 0$, and its output always lies between $-1$ and $+1$.

The handout says the rest of the lecture uses $\tanh$ as the transformation function. The lecture adds that using another function is your choice, but the derivation and its meaning change with it.

### Notation: layers, scores, and outputs

Page 10 fixes the notation. In the network diagram the three groups of weights are labelled $w_{ij}^{(1)}$, $w_{jk}^{(2)}$, and $w_{kq}^{(3)}$, and next to the third node of the second layer the diagram marks $s_3^{(2)}$ (before $\tanh$) and $x_3^{(2)}$ (after $\tanh$).

| Symbol | Meaning |
|---|---|
| $\ell$ | The layer index, $1 \le \ell \le L$. The input counts as layer 0, and $L$ is the output layer |
| $d^{(\ell)}$ | The number of nodes in layer $\ell$ (not counting the constant node). $d^{(0)} = d$ |
| $w_{ij}^{(\ell)}$ | The weight from node $i$ of layer $\ell - 1$ to node $j$ of layer $\ell$, with $0 \le i \le d^{(\ell-1)}$ and $1 \le j \le d^{(\ell)}$ |
| $s_j^{(\ell)}$ | The score of node $j$ in layer $\ell$, the value before it enters the transformation function |
| $x_j^{(\ell)}$ | The output of node $j$ in layer $\ell$, which is also an input to the next layer |

$i$ starts from 0 because every layer has one extra constant node $x_0^{(\ell-1)} = 1$, which the lecture compares to the bias term from before. $j$ starts from 1 because nobody has to compute the constant node. The two formulas are

$$
s_j^{(\ell)} = \sum_{i=0}^{d^{(\ell-1)}} w_{ij}^{(\ell)}\,x_i^{(\ell-1)}, \qquad
x_j^{(\ell)} = \begin{cases} \tanh\big(s_j^{(\ell)}\big) & \text{if } \ell < L \\ s_j^{(\ell)} & \text{if } \ell = L \end{cases}
$$

The lecture explains one choice of notation: by the earlier convention the transformed quantity should be called $\mathbf{z}$, but here it is still called $\mathbf{x}$ so that integer layer indices can tell the layers apart.

The shape of a network is named by the number of nodes in each layer, written as a $d^{(0)}$-$d^{(1)}$-$d^{(2)}$-$\cdots$-$d^{(L)}$ NNet. Once the shape is fixed, every set of weights is a hypothesis, and all possible weights together form the hypothesis set. The prediction procedure is at the bottom of the page: apply $\mathbf{x}$ as the input layer $\mathbf{x}^{(0)}$, go through the hidden layers to get $\mathbf{x}^{(\ell)}$ layer by layer, and predict at the output layer with $x_1^{(L)}$.

The total number of weights follows directly from the shape. Layer $\ell$ has $d^{(\ell)}$ nodes, and each node takes the $d^{(\ell-1)} + 1$ outputs of the previous layer (the extra 1 is the constant node), so the total is $\sum_{\ell=1}^{L}\big(d^{(\ell-1)} + 1\big)\,d^{(\ell)}$. This section's Fun Time uses it.

### Numerical example: the forward computation of a 1-2-2-1 network

The following example is made up for this article and is not on the slides; all the numbers were computed separately in Python. The same network is used again when backpropagation comes up. The shape is 1-2-2-1: one input, two hidden layers of two nodes each, and one output, for $(1+1)\times 2 + (2+1)\times 2 + (2+1)\times 1 = 13$ weights in total:

| Layer | Into node 1 | Into node 2 |
|---|---|---|
| $\ell = 1$ | $w_{01}^{(1)} = 0.2$, $w_{11}^{(1)} = 0.4$ | $w_{02}^{(1)} = -0.3$, $w_{12}^{(1)} = 0.8$ |
| $\ell = 2$ | $w_{01}^{(2)} = 0.1$, $w_{11}^{(2)} = 1.0$, $w_{21}^{(2)} = -1.0$ | $w_{02}^{(2)} = -0.2$, $w_{12}^{(2)} = 0.5$, $w_{22}^{(2)} = 0.5$ |
| $\ell = 3$ | $w_{01}^{(3)} = 0.3$, $w_{11}^{(3)} = 1.0$, $w_{21}^{(3)} = -2.0$ | (only one output node) |

The input is $x_1 = 1$, so $\mathbf{x}^{(0)} = (1, 1)$, where the first 1 is the constant node.

**Layer 1.** $s_1^{(1)} = 0.2 \times 1 + 0.4 \times 1 = 0.6$ and $s_2^{(1)} = -0.3 + 0.8 = 0.5$. Taking $\tanh$: $x_1^{(1)} = \tanh(0.6) = 0.5370$ and $x_2^{(1)} = \tanh(0.5) = 0.4621$.

**Layer 2.** $s_1^{(2)} = 0.1 + 1.0 \times 0.5370 - 1.0 \times 0.4621 = 0.1749$ and $s_2^{(2)} = -0.2 + 0.5 \times 0.5370 + 0.5 \times 0.4621 = 0.2996$. Taking $\tanh$: $x_1^{(2)} = 0.1732$ and $x_2^{(2)} = 0.2909$.

**Layer 3 (the output layer).** $s_1^{(3)} = 0.3 + 1.0 \times 0.1732 - 2.0 \times 0.2909 = -0.1087$. The output layer takes no $\tanh$, so the prediction is $x_1^{(3)} = -0.1087$.

If the label of this example is $y = 1$, the squared error is $(1 - (-0.1087))^2 = 1.2292$. The network predicts badly at this point, and what learning has to do is adjust those 13 weights to make the error smaller.

### What each layer does: checking whether the input matches the weights

Page 11 gives these computations an interpretation. Each layer is a transformation, and the transformation is to be learned from data:

$$
\boldsymbol{\phi}^{(\ell)}(\mathbf{x}) = \tanh\left(\begin{bmatrix} \sum_{i=0}^{d^{(\ell-1)}} w_{i1}^{(\ell)}\,x_i^{(\ell-1)} \\ \vdots \end{bmatrix}\right)
$$

Every node takes the inner product of the previous layer's output vector with its own weight vector and then applies $\tanh$. The lecture explains: the closer two vectors are to parallel, the larger the inner product and the closer the output is to $+1$; so each node checks whether the $\mathbf{x}$ handed to it by the previous layer fits its own weight vector, and a fit amounts to confirming some pattern. The handout's wording is whether $\mathbf{x}$ 'matches' weight vectors in pattern.

Here is a set of numbers from this article. Some node has weights $(w_0, w_1, w_2) = (0, 3, 4)$. The input $(x_1, x_2) = (0.6, 0.8)$ points the same way as the weights; the score is $3 \times 0.6 + 4 \times 0.8 = 5$ and $\tanh(5) = 0.9999$. The input $(-0.6, -0.8)$ points the opposite way; the score is $-5$ and the output is $-0.9999$. The input $(0.8, -0.6)$ is perpendicular to the weights; the score is 0 and the output is 0. For three inputs of the same length, the node's response depends only on whether the direction fits.

The handout sums it up: NNet is pattern extraction with layers of connection weights. The lecture supplies the second half: the patterns hidden in the data are transformed out layer by layer, until the last layer has to make the decision. This is also what the name Extraction Models on the Roadmap means.

### Fun Time: how many weights a 3-5-1 network has

**Question (page 12):** How many weights $w_{ij}^{(\ell)}$ are there in a 3-5-1 NNet?

1. 9
2. 15
3. 20
4. 26

**Answer: 4.** The handout's solution is that there are $(3+1) \times 5 = 20$ weights in layer 1 and $(5+1) \times 1 = 6$ in layer 2, 26 in total. The "plus 1" in each layer is the weights coming out of the constant node.

Each of the other choices leaves something out: 9 adds up the node counts of the three layers ($3 + 5 + 1$) and so counts nodes; 15 is $3 \times 5$, layer 1 only and without the constant node; 20 is layer 1 only, or both layers with the constant node left out of each ($3 \times 5 + 5 \times 1$).

## How the weights are learned: backpropagation computes the gradient of every weight

```youtube
url: https://www.youtube.com/watch?v=Z26n4YGNWvQ
title: Neural Network :: Neural Network Learning @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–03:43 sets the goal, 03:43–11:18 derives the gradients for the output layer and for a general layer, 11:18–16:45 derives the recursion for δ, 16:45–21:19 covers the backpropagation algorithm and mini-batch, and Fun Time follows.)

### The goal: the partial derivative of the error with respect to every weight

The goal on page 13 is to learn all the $w_{ij}^{(\ell)}$ so that $E_{\text{in}}$ is minimized. The handout first separates two cases:

- **One hidden layer.** This is simply aggregation of perceptrons, and the handout says gradient boosting can determine the hidden neurons one by one. As the lecture describes it, one neuron is added at a time until the result seems good enough; it also notes that the perceptrons here are the soft version that uses $\tanh$, and the idea is similar.
- **Multiple hidden layers.** The handout writes only "not easy"; the lecture says the add-one-at-a-time approach above may no longer work.

Take a different route. Define the error on a single example

$$
e_n = \big(y_n - \text{NNet}(\mathbf{x}_n)\big)^2
$$

Once $\frac{\partial e_n}{\partial w_{ij}^{(\ell)}}$ can be computed, the gradient descent or stochastic gradient descent (SGD) of Foundations Lectures 10 and 11 applies. The lecture draws the distinction: gradient descent adds up the changes over all the data points, while SGD picks one point at random each time and looks only at that point. So only one key question remains: how to compute this partial derivative efficiently. Lin first states the difficulty on the students' behalf: the weight carries an $i$, a $j$, and an $\ell$, and it is hard to keep them straight at first. So start with the easy part, from the last layer.

### The gradient at the output layer

Page 14 looks at the output layer first ($\ell = L$). The output layer has only one neuron and applies no transformation, so the network's output is its score $s_1^{(L)}$:

$$
e_n = \big(y_n - s_1^{(L)}\big)^2 = \Big(y_n - \sum_{i=0}^{d^{(L-1)}} w_{i1}^{(L)}\,x_i^{(L-1)}\Big)^2
$$

The path from the weight to the error is a chain: $w_{i1}^{(L)}$ determines $s_1^{(L)}$, and $s_1^{(L)}$ determines $e_n$. In the lecture, Lin says that when a derivative is hard to compute, find a go-between and use the chain rule. Here the go-between is $s_1^{(L)}$:

$$
\frac{\partial e_n}{\partial w_{i1}^{(L)}} = \frac{\partial e_n}{\partial s_1^{(L)}} \cdot \frac{\partial s_1^{(L)}}{\partial w_{i1}^{(L)}}
$$

Compute the two factors separately. The first is the derivative of $(y_n - s)^2$ with respect to $s$: the 2 from the square comes down, the coefficient of $s$ inside the bracket is $-1$, and the result is $-2\big(y_n - s_1^{(L)}\big)$. For the second, $s_1^{(L)}$ is a sum of terms $w_{i1}^{(L)} x_i^{(L-1)}$, only one of which contains the $w_{i1}^{(L)}$ we want, and differentiating leaves its coefficient $x_i^{(L-1)}$. So

$$
\frac{\partial e_n}{\partial w_{i1}^{(L)}} = -2\big(y_n - s_1^{(L)}\big) \cdot x_i^{(L-1)}, \qquad 0 \le i \le d^{(L-1)}
$$

### The gradient at a general layer: give the hard factor the name δ

The right half of the same page is the general layer ($1 \le \ell < L$, $0 \le i \le d^{(\ell-1)}$, $1 \le j \le d^{(\ell)}$). In the same way, choose as the go-between the score $s_j^{(\ell)}$ that $w_{ij}^{(\ell)}$ feeds directly:

$$
\frac{\partial e_n}{\partial w_{ij}^{(\ell)}} = \frac{\partial e_n}{\partial s_j^{(\ell)}} \cdot \frac{\partial s_j^{(\ell)}}{\partial w_{ij}^{(\ell)}}
$$

The second factor is as easy as at the output layer: $s_j^{(\ell)} = \sum_i w_{ij}^{(\ell)} x_i^{(\ell-1)}$, and its derivative with respect to $w_{ij}^{(\ell)}$ is $x_i^{(\ell-1)}$. The first factor is the partial derivative of the error with respect to a score in some middle layer; several layers lie in between, and it cannot be written down directly. The lecture sets it aside for now and gives it a name:

$$
\delta_j^{(\ell)} = \frac{\partial e_n}{\partial s_j^{(\ell)}}
$$

The gradient at every layer then has the same form:

$$
\frac{\partial e_n}{\partial w_{ij}^{(\ell)}} = \delta_j^{(\ell)} \cdot x_i^{(\ell-1)}
$$

The output layer is a special case of it, and the $\delta$ there has already been computed:

$$
\delta_1^{(L)} = -2\big(y_n - s_1^{(L)}\big)
$$

The handout asks at the bottom of the page: how about others?

### δ can be computed backwards from the next layer

Page 15 first draws the path by which $s_j^{(\ell)}$ affects $e_n$:

1. $s_j^{(\ell)}$ goes through $\tanh$ and becomes $x_j^{(\ell)}$.
2. $x_j^{(\ell)}$ is multiplied by $w_{jk}^{(\ell+1)}$ and enters the score of **every** neuron in the next layer, $s_1^{(\ell+1)}, \dots, s_k^{(\ell+1)}, \dots$.
3. Those scores travel on through the rest of the network and finally reach $e_n$.

In the lecture, Lin says there are more go-betweens this time: besides the single $x_j^{(\ell)}$ there is the whole row of scores in the next layer, and each one is a go-between. A change in $s_j^{(\ell)}$ travels to $e_n$ along each path separately, and the multivariate chain rule adds up the contributions of all the paths:

$$
\delta_j^{(\ell)} = \frac{\partial e_n}{\partial s_j^{(\ell)}} = \sum_{k=1}^{d^{(\ell+1)}} \frac{\partial e_n}{\partial s_k^{(\ell+1)}} \cdot \frac{\partial s_k^{(\ell+1)}}{\partial x_j^{(\ell)}} \cdot \frac{\partial x_j^{(\ell)}}{\partial s_j^{(\ell)}}
$$

What each of the three factors is:

- $\frac{\partial e_n}{\partial s_k^{(\ell+1)}}$ is, by definition, the next layer's $\delta_k^{(\ell+1)}$. The lecture stresses that this factor needs no computing, since it was defined a moment ago.
- $\frac{\partial s_k^{(\ell+1)}}{\partial x_j^{(\ell)}}$: $s_k^{(\ell+1)} = \sum_j w_{jk}^{(\ell+1)} x_j^{(\ell)}$ is a linear combination of the $x$s, and its derivative with respect to $x_j^{(\ell)}$ is the coefficient $w_{jk}^{(\ell+1)}$.
- $\frac{\partial x_j^{(\ell)}}{\partial s_j^{(\ell)}}$: $x_j^{(\ell)} = \tanh\big(s_j^{(\ell)}\big)$, so this is $\tanh'\big(s_j^{(\ell)}\big)$.

Substitute them in. The last factor does not depend on $k$ and can be pulled outside the sum:

$$
\delta_j^{(\ell)} = \sum_{k}\Big(\delta_k^{(\ell+1)}\Big)\Big(w_{jk}^{(\ell+1)}\Big)\Big(\tanh'\big(s_j^{(\ell)}\big)\Big)
$$

This is the sentence at the bottom of the handout page: $\delta_j^{(\ell)}$ can be computed backwards from $\delta_k^{(\ell+1)}$. What is known is $\delta_1^{(L)}$ in the last layer; from it comes every $\delta$ in layer $L-1$, then layer $L-2$, all the way down to layer 1. Here $j$ starts from 1: the constant node has no score, and so no $\delta$.

The handout does not write what $\tanh'$ is; the lecture says the formula has been given and you can derive it yourself. This article derives it once. Let $u = \exp(s) - \exp(-s)$ and $v = \exp(s) + \exp(-s)$, so that $u' = v$ and $v' = u$, and use the quotient rule:

$$
\tanh'(s) = \frac{u'v - uv'}{v^2} = \frac{v^2 - u^2}{v^2} = 1 - \tanh^2(s)
$$

So $\tanh'\big(s_j^{(\ell)}\big) = 1 - \big(x_j^{(\ell)}\big)^2$, which can be computed from the $x_j^{(\ell)}$ left behind by the forward pass, with no need to evaluate exponential functions again.

### The backpropagation algorithm

The gradient needs two things: $x$ and $\delta$. $x$ comes from feeding the data in and computing forward layer by layer; $\delta$ comes from computing backwards layer by layer from the last one. Page 16 assembles them into an algorithm named backpropagation, backprop for short, and the lecture says the name describes exactly the fact that $\delta$ can be computed backwards:

Initialize all weights $w_{ij}^{(\ell)}$, then repeat for $t = 0, 1, \dots, T$:

1. **Stochastic:** randomly pick $n$ from $\{1, 2, \dots, N\}$.
2. **Forward:** compute all $x_i^{(\ell)}$ with $\mathbf{x}^{(0)} = \mathbf{x}_n$.
3. **Backward:** compute all $\delta_j^{(\ell)}$ subject to the same $\mathbf{x}^{(0)} = \mathbf{x}_n$.
4. **Gradient descent:** $w_{ij}^{(\ell)} \leftarrow w_{ij}^{(\ell)} - \eta\,x_i^{(\ell-1)}\delta_j^{(\ell)}$.

Finally return $g_{\text{NNET}}(\mathbf{x}) = \Big(\cdots\tanh\Big(\sum_j w_{jk}^{(2)} \cdot \tanh\Big(\sum_i w_{ij}^{(1)} x_i\Big)\Big)\Big)$.

The handout adds a practical variation: sometimes steps 1 to 3 are done many times (in parallel) and step 4 updates with the average of these $x_i^{(\ell-1)}\delta_j^{(\ell)}$, which is called mini-batch. The lecture explains the motivation: looking at a single point requires a complete forward and backward pass before moving one small step, and the direction given by a single point is not very stable. So instead a batch is drawn at random each time, 20 points in the lecture's example; each point computes its own $x$ and $\delta$, and the update uses the averaged gradient. It sits between gradient descent on all the data and SGD on a single point, and Lin says it usually works better in practice.

The handout's summary of this page is: basic NNet algorithm: backprop to compute the gradient efficiently. The handout does not spell out where the efficiency lies, so this article adds a rough count. In the backward step, each $w_{jk}^{(\ell+1)}$ is multiplied only once in the recursion for $\delta$; assembling the gradient takes one more multiplication per weight. So one forward pass plus one backward pass costs an amount proportional to the number of weights $D$ and yields all $D$ partial derivatives. With numerical differentiation instead, every weight has to be nudged a little and the forward pass rerun for each, $D$ forward passes in all, a cost proportional to $D^2$.

The lecture closes by saying that replacing the output layer with classification or logistic regression, or replacing $\tanh$ with another function, changes the algorithm somewhat, but the changes are minor; as long as the gradient can be computed this way, gradient descent, SGD, and mini-batch all apply.

### Numerical example: finishing the backward computation on the same network

Now continue with the network from "Numerical example: the forward computation of a 1-2-2-1 network" (made up for this article), with the data $x_1 = 1$ and $y = 1$. The forward pass has already given:

| Layer | $s_1^{(\ell)}$ | $s_2^{(\ell)}$ | $x_1^{(\ell)}$ | $x_2^{(\ell)}$ |
|---|---|---|---|---|
| 0 | | | $1$ | |
| 1 | $0.6$ | $0.5$ | $0.5370$ | $0.4621$ |
| 2 | $0.1749$ | $0.2996$ | $0.1732$ | $0.2909$ |
| 3 | $-0.1087$ | | $-0.1087$ | |

**Layer 3.** $\delta_1^{(3)} = -2\big(y - s_1^{(3)}\big) = -2 \times (1 + 0.1087) = -2.2174$.

**Layer 2.** The next layer has only one neuron, so the sum has just the one term $k = 1$.

$$
\delta_1^{(2)} = \delta_1^{(3)}\,w_{11}^{(3)}\,\big(1 - (x_1^{(2)})^2\big) = (-2.2174)(1.0)(1 - 0.1732^2) = (-2.2174)(0.9700) = -2.1509
$$

$$
\delta_2^{(2)} = \delta_1^{(3)}\,w_{21}^{(3)}\,\big(1 - (x_2^{(2)})^2\big) = (-2.2174)(-2.0)(1 - 0.2909^2) = (4.4348)(0.9154) = 4.0594
$$

**Layer 1.** The next layer has two neurons, so the sum has two terms; this is where the $\sum_k$ in the recursion really comes into play.

$$
\delta_1^{(1)} = \big(\delta_1^{(2)} w_{11}^{(2)} + \delta_2^{(2)} w_{12}^{(2)}\big)\big(1 - (x_1^{(1)})^2\big) = \big((-2.1509)(1.0) + (4.0594)(0.5)\big)(0.7116) = (-0.1212)(0.7116) = -0.0862
$$

$$
\delta_2^{(1)} = \big(\delta_1^{(2)} w_{21}^{(2)} + \delta_2^{(2)} w_{22}^{(2)}\big)\big(1 - (x_2^{(1)})^2\big) = \big((-2.1509)(-1.0) + (4.0594)(0.5)\big)(0.7864) = (4.1806)(0.7864) = 3.2878
$$

**Assembling the gradient and updating.** The gradient of each weight is $x_i^{(\ell-1)}\delta_j^{(\ell)}$. Take $\eta = 0.01$ and do one update step:

| Weight | Current value | $x_i^{(\ell-1)}$ | $\delta_j^{(\ell)}$ | Gradient | After the update |
|---|---|---|---|---|---|
| $w_{01}^{(1)}$ | $0.2$ | $1$ | $-0.0862$ | $-0.0862$ | $0.2009$ |
| $w_{11}^{(1)}$ | $0.4$ | $1$ | $-0.0862$ | $-0.0862$ | $0.4009$ |
| $w_{02}^{(1)}$ | $-0.3$ | $1$ | $3.2878$ | $3.2878$ | $-0.3329$ |
| $w_{12}^{(1)}$ | $0.8$ | $1$ | $3.2878$ | $3.2878$ | $0.7671$ |
| $w_{01}^{(2)}$ | $0.1$ | $1$ | $-2.1509$ | $-2.1509$ | $0.1215$ |
| $w_{11}^{(2)}$ | $1.0$ | $0.5370$ | $-2.1509$ | $-1.1551$ | $1.0116$ |
| $w_{21}^{(2)}$ | $-1.0$ | $0.4621$ | $-2.1509$ | $-0.9940$ | $-0.9901$ |
| $w_{02}^{(2)}$ | $-0.2$ | $1$ | $4.0594$ | $4.0594$ | $-0.2406$ |
| $w_{12}^{(2)}$ | $0.5$ | $0.5370$ | $4.0594$ | $2.1801$ | $0.4782$ |
| $w_{22}^{(2)}$ | $0.5$ | $0.4621$ | $4.0594$ | $1.8759$ | $0.4812$ |
| $w_{01}^{(3)}$ | $0.3$ | $1$ | $-2.2174$ | $-2.2174$ | $0.3222$ |
| $w_{11}^{(3)}$ | $1.0$ | $0.1732$ | $-2.2174$ | $-0.3840$ | $1.0038$ |
| $w_{21}^{(3)}$ | $-2.0$ | $0.2909$ | $-2.2174$ | $-0.6451$ | $-1.9935$ |

The numbers in the table and in the formulas above were all computed from unrounded values and then rounded to four decimal places; working by hand from the printed four-decimal values may differ by 1 or 2 in the last digit (for example, $4.4348 \times 0.9154$ comes to $4.0596$ by hand, while the unrounded values give $4.0594$).

**Checking.** Whether the gradient is right can be checked by numerical differentiation: add and subtract $10^{-6}$ on one weight, run the forward pass once for each, subtract the two $e_n$ values, and divide by $2 \times 10^{-6}$. The values obtained this way for the 13 weights agree with the table to the sixth decimal place; for example, both methods give $3.287820$ for $w_{12}^{(1)}$.

**What this result means.** Run the forward pass again with the 13 updated weights: the output moves from $-0.1087$ to $0.1592$, toward $y = 1$, and $e_n$ falls from $1.2292$ to $0.7070$. The sign of the gradient tells each weight which way to move: the gradient of $w_{02}^{(1)}$ is positive, so it is decreased; the gradient of $w_{01}^{(3)}$ is negative, so it is increased.

The step size cannot be chosen carelessly. With the same gradients and $\eta = 0.05$, the output becomes $1.2116$ and $e_n = 0.0448$; with $\eta = 0.1$, the output shoots to $2.2352$ and $e_n$ rises to $1.5257$, worse than before the update. The gradient only says which direction goes downhill near the current position, and too large a step overshoots the bottom of the valley, the same conclusion as when Foundations Lecture 10 discussed $\eta$.

### Fun Time: when the output-layer gradient is 0

**Question (page 17):** According to $\frac{\partial e_n}{\partial w_{i1}^{(L)}} = -2\big(y_n - s_1^{(L)}\big) \cdot \big(x_i^{(L-1)}\big)$, when would $\frac{\partial e_n}{\partial w_{i1}^{(L)}} = 0$?

1. $y_n = s_1^{(L)}$
2. $x_i^{(L-1)} = 0$
3. $s_i^{(L-1)} = 0$
4. all of the above

**Answer: 4.** The gradient is a product of two factors, and it is 0 as soon as either one is 0. Choice 1 makes the first factor 0: the network's output on this example equals $y_n$ exactly, there is no error, and nothing needs adjusting. Choice 2 makes the second factor 0: the value coming in along this connection is 0, so the score is the same whatever this weight is changed to. Choice 3 is the one the handout's solution singles out: $x_i^{(L-1)} = \tanh\big(s_i^{(L-1)}\big)$, and $\tanh$ is 0 only at 0, so $s_i^{(L-1)} = 0$ and $x_i^{(L-1)} = 0$ are the same thing (if and only if). In the lecture, Lin says choices 1 and 2 should be easy and choice 3 is the one to think about; when the gradient is 0, the SGD update leaves this weight where it is.

This article adds two points. First, choices 2 and 3 are about the nodes with $i \ge 1$; the constant node $x_0^{(L-1)} = 1$ with $i = 0$ is never 0 and has no score. Second, a gradient of 0 only means that this weight does not move on this step, not that the network has finished learning: the error can still be large when choice 2 or 3 holds. The discussion of initial values below shows that setting all the weights to 0 runs straight into this situation.

## Learning that both moves and generalizes: initial values, the VC dimension, regularization, and early stopping

```youtube
url: https://www.youtube.com/watch?v=z2tHzMzoOOs
title: Neural Network :: Optimization and Regularization @ Machine Learning Techniques (機器學習技法)
```

(Video 00:01–05:12 covers optimization and initial values, 05:12–06:56 the VC dimension, 06:56–11:08 regularizers, 11:08–15:16 early stopping, followed by Fun Time and the summary of the whole lecture.)

### The error function is not a single valley

Page 18 writes out in full what is being minimized:

$$
E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\sum_{n=1}^{N}\text{err}\Bigg(\bigg(\cdots\tanh\Big(\sum_j w_{jk}^{(2)} \cdot \tanh\Big(\sum_i w_{ij}^{(1)}x_{n,i}\Big)\Big)\bigg),\ y_n\Bigg)
$$

The handout's assessment is that this function is generally non-convex when there are multiple hidden layers. In the lecture, Lin says the point is not which error is used but the many layers of $\tanh$ in between. The earlier $E_{\text{in}}$ was like one valley, where a ball rolls down to the lowest point; now there may be peaks stretching to the horizon with many valleys, the ball only rolls into the one nearest to it, and even inside a valley there is no telling whether it is the lowest one globally. The handout lists two consequences:

- It is not easy to reach the global minimum. Gradient descent or SGD with backprop only gives a local minimum.
- Different initial weights lead to different local minima, so the result is somewhat 'sensitive' to the initial weights.

How should the initial values be chosen, then? The lecture is frank about it: nobody knows, because we do not know where the good valleys are. But there are places to avoid. The handout writes: large weights ⟹ saturate (small gradient). The lecture explains: with large weights the score is large (or very negative) and falls in the flat regions at the two ends of $\tanh$; this is called saturation, and Lin compares it to an amplifier already turned all the way up, in the region where little gain is left. Where the curve is flat the derivative is small, the gradient is small, and each step covers only a little ground, like being stuck on a plain and unable to move.

How severe saturation is can be read directly from $\tanh'(s) = 1 - \tanh^2(s)$ (computed by this article):

| $s$ | $\tanh(s)$ | $\tanh'(s)$ |
|---|---|---|
| $0$ | $0$ | $1$ |
| $0.5$ | $0.4621$ | $0.7864$ |
| $2$ | $0.9640$ | $0.0707$ |
| $5$ | $0.99991$ | $0.00018$ |
| $10$ | $0.999999996$ | $0.000000008$ |

The recursion for $\delta$ multiplies by $\tanh'$ once for every layer it goes back. A neuron whose score is 5 shrinks the $\delta$ passed back to roughly two ten-thousandths of its size, and the gradients of the weights in front of it shrink along with it.

The handout's advice is: try some random & small ones. The lecture gives a reason for each word: small, so that training does not start out stuck on the plain; random, so that each run has a chance of reaching a different valley, and some valleys are bound to be better than others.

This article adds one more reason for "random", which can be verified on the 1-2-2-1 network from before. If all 13 weights are set to 0.5, the two neurons in the same layer compute exactly the same thing: $x_1^{(1)} = x_2^{(1)} = 0.7616$, $\delta_1^{(1)} = \delta_2^{(1)} = 0.0406$, $\delta_1^{(2)} = \delta_2^{(2)} = 0.0966$. Their gradients are the same too, so after the update the two neurons are still the same, and so on at every later step. The two neurons do the same job forever, which amounts to having only one. If everything is set to 0, things are worse: $\tanh(0) = 0$, so every hidden neuron outputs 0; the output-layer weights attached to them have gradient 0 (this is exactly choice 3 of "Fun Time: when the output-layer gradient is 0"), and the output-layer weights being 0 in turn makes every $\delta$ in the earlier layers 0. The only weight with a nonzero gradient is $w_{01}^{(3)}$. This article ran it for 200 steps: the other 12 weights never moved, and the network learned only a constant. Problem 9 of Fall 2024 HW7, listed under "Exercises and corresponding reading", asks for a proof of a phenomenon of the same kind as the first one (the network in that problem has only one hidden layer, and its output also takes $\tanh$).

The handout's conclusion for this page is that NNet is difficult to optimize, but practically works. As Lin puts it in the lecture, although its optimization properties are not good, it does not perform too badly if you do carefully what ought to be done.

### The VC dimension: power grows with the number of neurons and the number of weights

Page 19 gives a result without proof: with $\tanh$-like transfer functions, roughly

$$
d_{\text{VC}} = O(VD)
$$

$V$ is the number of neurons and $D$ is the number of weights. In the lecture, Lin says the detailed proof is skipped and only the rough result is given, and points out that more neurons bring more connections, so when $V$ is large $D$ is large too. Take the 3-5-1 network from Fun Time: $D = 26$; counting 5 hidden neurons plus 1 output neuron, $V = 6$ and $VD = 156$. $O(\cdot)$ hides a constant, so this number is only an order of magnitude; this article uses it to get a feel for one thing: doubling the width of the hidden layer roughly doubles both $V$ and $D$ and quadruples their product.

The handout splits the meaning into two sides. The pros: with enough neurons ($V$ large) the network can approximate 'anything'. The cons: with too many neurons it can overfit. The lecture puts it vividly: with too many nodes and too many weights, the model has enough power to fixate on tiny details and does well only on the data it has seen. The handout's reminder is to watch out for overfitting.

### Regularization: making some of the weights 0

Page 20 deals with overfitting. In the lecture, Lin speaks of stepping on the brakes, and one way of doing that is regularization. The basic choice is the old friend from [Foundations Lecture 14](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization-en), the weight-decay (L2) regularizer:

$$
\Omega(\mathbf{w}) = \sum\big(w_{ij}^{(\ell)}\big)^2
$$

The handout describes its effect as shrinking the weights: a large weight gets a large shrink and a small weight a small shrink. The numbers in the lecture are a 10 shrinking to 8 and a 5 shrinking to 4, roughly a proportional shrink. The gradient shows why: the derivative of $w^2$ with respect to $w$ is $2w$, so the push back is proportional to the weight itself. The trouble is that a proportional shrink makes large and small weights all a bit smaller, yet never brings them to 0.

We would like some weights to be exactly 0 (sparse). The lecture gives two reasons: computationally, a weight that is 0 needs no computing; in terms of complexity, $d_{\text{VC}} = O(VD)$ contains the number of weights, and a weight becoming 0 amounts to a smaller $D$. The handout's wording is to effectively decrease $d_{\text{VC}}$.

How can that be achieved? The handout lists two choices:

- **The L1 regularizer** $\sum\big\lvert w_{ij}^{(\ell)}\big\rvert$. It does push weights to 0, but the absolute value function is not differentiable at 0. The lecture explains why that is a nuisance: backprop is at heart a method built on differentiation, and bringing in a non-differentiable function breaks the framework.
- **The weight-elimination regularizer**, which the handout calls a 'scaled' L2:

$$
\sum\frac{\big(w_{ij}^{(\ell)}\big)^2}{1 + \big(w_{ij}^{(\ell)}\big)^2}
$$

The handout's description of it is: large weight → median shrink; small weight → median shrink. The inference drawn in the lecture is that a weight that was small to begin with, once shrunk by a medium amount, disappears; the construction divides each L2 term by $1 + w^2$ as a scaling factor. Lin says the details are not covered here and asks everyone to think about why.

This article works it out. This section's Fun Time finds that the partial derivative of a single term with respect to $w$ is $\frac{2w}{(1+w^2)^2}$. Side by side with the $2w$ of L2:

| $w$ | $\frac{w^2}{1+w^2}$ | L2 gradient $2w$ | weight elimination gradient |
|---|---|---|---|
| $0.1$ | $0.0099$ | $0.2$ | $0.1961$ |
| $0.5$ | $0.2$ | $1$ | $0.64$ |
| $1$ | $0.5$ | $2$ | $0.5$ |
| $3$ | $0.9$ | $6$ | $0.06$ |
| $10$ | $0.9901$ | $20$ | $0.0020$ |

Three things can be read off the table. First, when $w$ is small, $1 + w^2 \approx 1$ and weight elimination is nearly the same as L2, so small weights are still pushed toward 0. Second, the push of L2 on large weights keeps growing with $w$, while the push of weight elimination is bounded: differentiating $\frac{2w}{(1+w^2)^2}$ once more shows that it is largest at $w = 1/\sqrt{3} \approx 0.577$, with a maximum of about 0.65. Third, past that point the push gets smaller, and at $w = 10$ only 0.002 is left.

Put the handout's words next to this table. The handout writes that large weights and small weights both get a median shrink. What the formula gives is this: the push on small weights is comparable to that of L2, and the push on large weights does not grow with the weight and tends to 0 for very large weights. Neither the handout nor the lecture spells out how these two descriptions fit together. The effect the formula produces is consistent with the purpose of this page: compared with L2, large weights stay almost untouched, and small weights are still pushed toward 0. The table above and the reading in this paragraph are computed by this article from the formula and are not content of the handout.

There is one more reading (an addition in this article): the second column of the table shows that every term $\frac{w^2}{1+w^2}$ lies between 0 and 1, close to 0 for small weights and close to 1 for large ones. Summed up, the whole regularizer roughly counts "how many weights are large enough", and pressing it down reduces the number of weights that matter, which lines up with the $D$ in $O(VD)$.

### Early stopping: taking fewer steps is also a kind of regularization

Page 21 introduces another mechanism, one the lecture says has been used very widely in the history of neural networks. The starting point is how gradient descent moves: taking one small step from a point can be seen as choosing among the weights in a small circle around the current position; at the new point, it chooses again within a new small circle. The figure on the left of the slide draws four points $\mathbf{w}_0, \mathbf{w}_1, \mathbf{w}_2, \mathbf{w}_3$, each with a circle around it, and labels the region covered by the circles $\mathcal{H}_3$. The handout says: GD/SGD (backprop) visits more weight combinations as $t$ increases.

Fewer steps mean fewer hypotheses considered. The lecture speaks of an "effective VC dimension": measure complexity by the weights actually visited, and the longer the optimization runs, the larger the effective VC dimension. The handout writes it as smaller $t$ effectively decrease $d_{\text{VC}}$.

The figure at the upper right is the one from [Foundations Lecture 7](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en): the horizontal axis is $d_{\text{VC}}$, the in-sample error keeps falling, the model complexity keeps rising, the out-of-sample error falls and then rises, and the best $d_{\text{VC}}^*$ is in the middle. Since the number of steps controls the effective $d_{\text{VC}}$, replacing the horizontal axis with the step count $t$ should show the same shape. The figure at the lower right is one actual result of that kind: the horizontal axis is the iteration $t$ (on a log scale, from $10^2$ to $10^4$) and the vertical axis is $\log_{10}(\text{error})$; $E_{\text{in}}$ keeps falling with $t$, $E_{\text{test}}$ falls and then rises, and the lowest point $t^*$ lies between $10^2$ and $10^3$.

So the better approach is to stop in the middle, which is called early stopping. The example in the lecture: the plan is to run 20,000 steps, and at 200 steps it seems good enough, so you stop. Lin also says that just about every gradient-based algorithm can adopt this mechanism for some form of regularization.

Which step to stop at? The handout's answer is validation, and the lecture says to treat "when to stop" as a parameter to be chosen, using the validation of [Foundations Lecture 15](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en). The handout does not write out the procedure. The three steps below are not on the slides; they are one common practice put together by this article, built on the idea from Foundations Lecture 15 of holding out part of the data as a validation set:

1. Before training, hold out part of the data as a validation set that is not used for computing gradients.
2. Run backprop on the remaining data; every fixed number of steps, compute the error on the validation set, $E_{\text{val}}$, and save the weights at that moment.
3. After the planned number of steps, go back and take the weights saved at the lowest $E_{\text{val}}$ as the result.

$E_{\text{in}}$ cannot be used for this decision: in the lower-right figure of the handout it goes down all the way with the step count, and choosing by it would only tell you to run to the last step.

### Fun Time: the partial derivative of weight elimination

**Question (page 22):** For the weight elimination regularizer $\sum\frac{(w_{ij}^{(\ell)})^2}{1 + (w_{ij}^{(\ell)})^2}$, what is $\frac{\partial\,\text{regularizer}}{\partial w_{ij}^{(\ell)}}$?

1. $2w_{ij}^{(\ell)} \Big/ \Big(1 + \big(w_{ij}^{(\ell)}\big)^2\Big)^1$
2. $2w_{ij}^{(\ell)} \Big/ \Big(1 + \big(w_{ij}^{(\ell)}\big)^2\Big)^2$
3. $2w_{ij}^{(\ell)} \Big/ \Big(1 + \big(w_{ij}^{(\ell)}\big)^2\Big)^3$
4. $2w_{ij}^{(\ell)} \Big/ \Big(1 + \big(w_{ij}^{(\ell)}\big)^2\Big)^4$

**Answer: 2.** The handout's solution is a single joke: Too much calculus in this class, huh? The derivation is as follows. Only one term of the sum contains this weight; abbreviate it as $w$ and use the quotient rule, where the derivative of the numerator $w^2$ is $2w$ and the derivative of the denominator $1 + w^2$ is also $2w$:

$$
\frac{\partial}{\partial w}\,\frac{w^2}{1 + w^2} = \frac{2w(1 + w^2) - w^2 \cdot 2w}{(1 + w^2)^2} = \frac{2w + 2w^3 - 2w^3}{(1 + w^2)^2} = \frac{2w}{(1 + w^2)^2}
$$

The four choices differ only in the power of the denominator. In the quotient rule the denominator is always the square of the original denominator, so the power is 2. Choice 1 forgets the term subtracted in the numerator; choices 3 and 4 correspond to no calculation at all. This article checked with numerical differentiation: at $w = 0.5$ the formula gives $\frac{1}{1.5625} = 0.64$ and numerical differentiation also gives $0.64$; at $w = 3$ both give $0.06$.

The lecture explains the point of this question: to put weight elimination into backprop, you need its partial derivative with respect to every weight. This article adds a sentence on how to use it: at update time, multiply this term by the regularization strength and add it to the original gradient $x_i^{(\ell-1)}\delta_j^{(\ell)}$.

The summary on page 23 reduces the four sections to one line each: multi-layer for power with biological inspirations; layered pattern extraction until linear hypothesis; backprop to compute gradient efficiently; tricks on initialization, regularizer, early stopping. The preview of the next lecture is making neural network 'deeper'.

## Self-check

**1. How many weights does a 2-4-3-1 network have? For one backprop pass on a single example, how many δ values have to be computed?**

Answer: $(2+1)\times 4 + (4+1)\times 3 + (3+1)\times 1 = 12 + 15 + 4 = 31$ weights. There is one $\delta$ for every neuron that has a score, and none for the constant nodes, for $4 + 3 + 1 = 8$ in total.

**2. Let $g_0 = +1$. Write a set of $(\alpha_0, \alpha_1, \alpha_2)$ that makes $\text{sign}(\alpha_0 + \alpha_1 g_1 + \alpha_2 g_2)$ implement NAND (FALSE when both are TRUE, TRUE in every other case), and verify it with a table.**

Answer: flip the sign of all three AND weights, $(+1, -1, -1)$. Over the four cases $1 - g_1 - g_2$ is $-1$ (both $+1$), $+1$, $+1$, $+3$, and taking the sign gives $-1, +1, +1, +1$. This also shows that a NOT placed after an AND needs no extra layer: $\text{sign}(-s)$ just flips the sign of the whole set of weights.

**3. A 1-1-1 network: $w_{01}^{(1)} = 0$, $w_{11}^{(1)} = 0.5$, $w_{01}^{(2)} = 0.5$, $w_{11}^{(2)} = 2$. The data are $x_1 = 2$ and $y = 1$. Compute the output, $e_n$, the two δ values, and the gradients of the four weights.**

Answer: forward, $s_1^{(1)} = 0.5 \times 2 = 1$ and $x_1^{(1)} = \tanh(1) = 0.7616$; $s_1^{(2)} = 0.5 + 2 \times 0.7616 = 2.0232$, which is the output; $e_n = (1 - 2.0232)^2 = 1.0469$. Backward, $\delta_1^{(2)} = -2(1 - 2.0232) = 2.0464$; $\delta_1^{(1)} = \delta_1^{(2)} \times w_{11}^{(2)} \times (1 - 0.7616^2) = 2.0464 \times 2 \times 0.4200 = 1.7189$. Gradients: for $w_{01}^{(2)}$ it is $1 \times 2.0464 = 2.0464$; for $w_{11}^{(2)}$ it is $0.7616 \times 2.0464 = 1.5585$; for $w_{01}^{(1)}$ it is $1 \times 1.7189 = 1.7189$; for $w_{11}^{(1)}$ it is $2 \times 1.7189 = 3.4377$. All four gradients are positive, so all four weights should be decreased, which agrees with "the output 2.02 is larger than the target 1". (This article checked these four values with numerical differentiation.)

**4. One person sets all the initial weights to 10, and another sets all the initial weights to 0.01. What problem does each run into?**

What a correct answer needs: for the first person, it has to mention that the scores are large, $\tanh$ saturates, and $\tanh'$ is close to 0, so the gradient is tiny and training hardly moves. The second person's weights are small, so there is no saturation, but all the weights are identical: the neurons in the same layer compute the same outputs and the same $\delta$ and are still identical after the update, which amounts to one neuron per layer; the weights should be small and random. Answering only "it gets stuck in a local minimum" for both does not count as correct.

**5. For the two weights $w = 0.1$ and $w = 3$, what gradients do L2 and weight elimination give them? Which regularizer is more inclined to keep the large one and eliminate the small one?**

Answer: L2 gives $2w$, which is $0.2$ and $6$; the push on the large weight is 30 times the push on the small one. Weight elimination gives $\frac{2w}{(1+w^2)^2}$, which is $\frac{0.2}{1.0201} = 0.196$ and $\frac{6}{100} = 0.06$; the small weight gets the larger push. So weight elimination is the one more inclined to keep large weights and eliminate small ones.

## Exercises and corresponding reading

**The corresponding weeks in two semesters.**

| Edition | Week | Slides | LFD (as marked on the course page) |
|---|---|---|---|
| MOOC | Techniques Lecture 12 | 212 | not marked |
| [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) | W13 (11/25), the same week as Techniques Lecture 13 | [212u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/212u_handout.pdf) | e-7.1, e-7.2, e-7.3, e-7.4 (selected parts) |
| [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) | W15 (12/16), scheduled after the final exam in W14 | 212u was still a 404 on 2026-09-30 and has not been released | same as above |

**Textbook.** e-Chapter 7 of [Learning from Data](http://amlbook.com) (LFD) is an online chapter of the textbook and is not in the printed book; see amlbook.com for how to get it.

**Homework.** [Fall 2024 HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf) (released 2024-12-02, due 12-16) has three problems directly related to this lecture, with no official solutions:

| Problem | Type | What it practises |
|---|---|---|
| Q4 | auto-graded | With 20 input units, 3 output units, and 50 hidden units (the $x_0$ units count too), where the hidden units can be arranged into layers freely and adjacent layers are fully connected, what is the maximum number of weights |
| Q9 | human-graded | With one hidden layer, all neurons (the output included) using $\tanh$, and all initial weights set to 0.5, prove that after backprop (mini-batch GD) the first-layer weights satisfy $w_{ij}^{(1)} = w_{i,j+1}^{(1)}$ |
| Q13 (bonus) | human-graded | The problem attaches an answer from chatGPT claiming that a $d$-$(d-1)$-1 feed-forward network with sign as the transformation function can implement the $d$-dimensional XOR; you are asked to point out where it departs from the conclusion of the Fall 2023 bonus homework and to prove mathematically that this is impossible |

Q4 is a scaled-up version of the Fun Time "how many weights a 3-5-1 network has", and you can first write a small program that enumerates every way of layering to check your answer. Q9 should be thought about together with the advice to try some random and small initial values. The symmetry this article observed on the 1-2-2-1 network is a phenomenon of the same kind, but the network's shape differs from that problem's (which has only one hidden layer, with an output that also takes $\tanh$), and it is only one set of numbers, not a proof. Q13 asks you to judge for yourself which step of that argument goes wrong, and the proof in this article's "Limitation: XOR is still not linearly separable in the new space" is a place to start. The guide to the whole assignment is in [Techniques Homework and Final Project](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en).

**Hands-on.** Derive the recursion for δ yourself once, then write a $d$-3-1 $\tanh$ network in numpy and compare the gradient from backprop against numerical differentiation. The 1-2-2-1 example in this article can serve as test data to check your answers against.

**What came after this lecture.** The recording of this lecture was uploaded in 2016 and uses $\tanh$ and basic SGD. In Fall 2024 Lin added two decks of modern deep learning slides, 302u and 303u, which this series places in the article for [Techniques Lecture 16](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning-en).

**Further reading.** The following articles on this site overlap with this lecture and offer another way of explaining the same material:

- [Reading CMU 11-785 Deep Learning](/posts/ai/2026-08-22-cmu-11785-course-overview-en), especially [Lecture 5: Backpropagation](/posts/ai/2026-08-22-cmu-11785-05-backpropagation-en): a whole course devoted to deep learning.
- [Reading Stanford CS230](/series/cs230): leans toward the practice of deep learning projects.
- [Reading MIT 6.7960](/posts/ai/2026-08-26-mit-67960-deep-learning-guide-en): graduate-level deep learning.
- [Reading NTU Hung-yi Lee Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en): the parallel track at NTU, leaning toward deep learning and generative AI.
- [CMU 10-301 HW5: Neural Networks](/posts/learning/2026-08-22-cmu-10301-hw5-neural-networks-en): an assignment on the same topic from another school.

**Next lecture.** [Techniques Lecture 13: Deep Learning](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-13-deep-learning-en) stacks this lecture's network deeper and deals with how much harder initial values and regularization become once there are more layers.

## Course video sources

Original videos: [Motivation](https://www.youtube.com/watch?v=GwRS2YJv2Ck), [Neural Network Hypothesis](https://www.youtube.com/watch?v=giOcWMbi1bU), [Neural Network Learning](https://www.youtube.com/watch?v=Z26n4YGNWvQ), [Optimization and Regularization](https://www.youtube.com/watch?v=z2tHzMzoOOs)

- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-10: Marked the video status and checked the recording sources and how to access them.
- 2026-10-10: Rechecked the video status. The embedded videos match the lectures in the official playlist.
- 2026-10-13: Previously combined with Lecture 13 in one article; changed to one article per lecture and rewritten from the handout and the video transcripts.

## References

- [Techniques Lecture 12 handout, 212_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/212_handout.pdf): the main source for this article. The derivations in the four sections, the four Fun Time questions, and the figures on each page all come from this handout.
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the W13 schedule, the 212u slides, and the LFD e-7 chapter marking.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the W14 final exam and the W15 schedule.
- [Fall 2024 Homework 7 (hw7.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf): the content of Q4, Q9, and Q13.
- [Learning from Data textbook website](http://amlbook.com): the source of e-Chapter 7.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
