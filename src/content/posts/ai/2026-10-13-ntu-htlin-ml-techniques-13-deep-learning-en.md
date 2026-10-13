---
title: "Deep Learning: Pre-training, Autoencoders, and PCA | NTU Hsuan-Tien Lin Machine Learning Techniques Lecture 13"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, deep-learning, autoencoder, pca]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 30
tldr: "Once a network is stacked deep, each layer only has to do a little, but structure, model complexity, optimization, and computation all get harder. This lecture picks two of those, initialization and regularization: pre-train the weights layer by layer with a d—d̃—d autoencoder so that each layer first learns an information-preserving encoding; train on inputs with artificial noise added, as a form of regularization; and finally make the autoencoder linear and derive that the optimal W is the d̃ top eigenvectors of XᵀX, which becomes PCA once the mean is subtracted from the data."
description: "A guide to Lecture 13, Deep Learning, of NTU Hsuan-Tien Lin's Machine Learning Techniques: shallow versus deep networks, the four challenges of deep learning, layer-wise pre-training, the autoencoder and the denoising autoencoder, and a step-by-step derivation from the optimal linear autoencoder to PCA, with a four-point worked example and a Python check."
draft: false
glossary:
  - term: "autoencoder"
    aliases: ["basic autoencoder"]
    definition: "A d—d̃—d neural network trained so that its output g(x) is close to its input x. The first half of the weights encodes x into a d̃-dimensional representation, and the second half decodes it back."
    context: "Techniques Lecture 13 uses it to pre-train the weights of a deep network layer by layer, keeping only the encoding half."
  - term: "pre-training"
    aliases: ["pretraining"]
    definition: "Finding, for the weights of each layer, a starting value better than a random one before the whole network is trained with backprop."
    context: "In Techniques Lecture 13 this goes from shallow to deep, training one autoencoder per layer on the outputs of the layer before it."
  - term: "denoising autoencoder"
    aliases: ["denoising auto-encoder"]
    definition: "An autoencoder whose input is replaced by x̃, the input with artificial noise added, while the target stays the clean x."
    context: "Techniques Lecture 13 reads the artificial noise as a form of regularization, that is, a hint given to the model."
  - term: "PCA"
    aliases: ["principal component analysis"]
    definition: "Linear dimension reduction: subtract the mean from the data, then take the eigenvectors of the d̃ largest eigenvalues of XᵀX as the projection directions."
    context: "Techniques Lecture 13 derives it as the optimal solution of a linear autoencoder with tied weights and no constant term."
---

> 🌏 [中文版](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-13-deep-learning)

**Video status: Videos included.** This article is written from the official MOOC handout [213_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/213_handout.pdf) and transcripts of the four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/24 to 24/24), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Techniques Lecture 13 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Techniques into three ways of handling features, and this lecture belongs to the third, Distilling Implicit Features: Extraction Models, where the model extracts hidden features from the data by itself. The previous lecture, [Techniques Lecture 12: Neural Networks](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning-en), takes up one line on that page: automatic pattern feature extraction from layers of neurons, with backprop computing the gradient for gradient descent or stochastic gradient descent. This lecture asks what happens when the number of layers grows.

The recordings were uploaded in 2016, and page 3 of the handout says deep learning is "gaining attention in recent years". So the lecture is about the methods of that time: layer-wise pre-training and the autoencoder. Understanding why pre-training was needed then is more useful than memorizing the steps. For the training techniques common today, Lin added two slide decks in Fall 2024, which this series covers in [Techniques Lecture 16: Finale](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning-en).

There are three prerequisites. The first is the network notation of the previous lecture ($d^{(0)}$-$d^{(1)}$-…-$d^{(L)}$, $w_{ij}^{(\ell)}$, $\tanh$) and backprop. The second is the causes of overfitting from [Foundations Lecture 13: Hazard of Overfitting](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization-en) and weight decay from [Foundations Lecture 14: Regularization](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization-en). The third is linear algebra: orthogonal matrices and the eigen-decomposition of a symmetric matrix. The last section uses a Lagrange multiplier once, as in [Techniques Lecture 2: Dual SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm-en).

After reading, you should be able to say what a deep network adds over a shallow one and which four things make it hard; walk through layer-wise pre-training and say, at each step, which data trains which autoencoder and which weights are kept; explain why adding noise counts as regularization; and start from $E_{\text{in}}(\mathrm{W}) = \frac{1}{N}\sum_n \lVert \mathbf{x}_n - \mathrm{W}\mathrm{W}^\top\mathbf{x}_n\rVert^2$ and derive for yourself that the optimal $\mathrm{W}$ consists of the top few eigenvectors of $\mathrm{X}^\top\mathrm{X}$, then compute it by hand for a small data set.

## What a deeper network adds, and where it gets hard

```youtube
url: https://www.youtube.com/watch?v=H1czfox0Nog
title: Deep Learning :: Deep Neural Network @ Machine Learning Techniques (機器學習技法)
```

(In the video, 00:17–02:27 reviews the previous lecture and raises the question of structure, 02:27–05:55 compares shallow and deep, 05:55–11:42 uses handwritten digits to explain what each layer means, 11:42–18:36 covers the four challenges and the matching techniques, 18:36–20:53 is the two-step framework, and the rest is Fun Time.)

### You have to decide the structure yourself

Page 2 of the handout redraws the network of the previous lecture, reminds us that each layer is a pattern feature extracted from data, and then asks: how many neurons? How many layers? More generally, what structure? In the lecture, Lin adds that structure also includes which neuron connects to which, and whether connections may skip layers.

The handout answers in two directions: subjectively, your design; objectively, validation, maybe. The lecture has a remark on each. "Your design" is like an electrical engineering student designing a circuit: put this component here and that one there, wire them up, and see whether it works. Validation treats the structure as a kind of parameter, so every model selection method from [Foundations Lecture 15: Validation](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en) applies; the trouble is that there are too many possible structures. The handout concludes that structural decisions are the key issue for applying NNet.

### Shallow versus deep

Page 3 starts with definitions: few hidden layers is shallow, many layers is deep. In the lecture, Lin says a shallow network produces its output after only one or two layers, while a deep one goes through many steps before reaching a result. The slide puts the two side by side; the circles and crosses in parentheses are the handout's own marks:

| | Shallow NNet | Deep NNet |
|---|---|---|
| Training | more efficient to train (○) | challenging to train (×) |
| Structural decisions | simpler (○) | sophisticated (×) |
| Power | theoretically powerful enough (○) | 'arbitrarily' powerful (○) |
| Meaning | not listed | more 'meaningful'? |

The lecture goes through the cells one at a time. A shallow network has few layers, so both the forward pass for the output and the backward pass for δ are faster, and the only decision is how many neurons to put in those few layers. "Theoretically powerful enough" refers to a result mentioned in the previous lecture: with enough neurons, a network can approximate any function, so a few layers with enough neurons each can still do complicated things. In the deep column, the first two cells are the same trade-offs reversed. On the "'arbitrarily' powerful" cell, Lin says it is really about the same as the shallow case: enough neurons and weights will do it.

So in terms of power, deep networks do not win. Their real selling point is the last cell, which the handout itself marks with a question mark and then spends a whole page on.

### Each layer does a little: the handwritten digit example

The figure on page 4 is a small network that recognizes the handwritten digits 1 and 5. From bottom to top it shows:

1. At the bottom are the inputs, two digits, 1 and 5, drawn in pixels.
2. The first layer has six nodes, $\phi_1$ to $\phi_6$, each drawn as a short stroke: $\phi_1$ is a small slanted stroke at the upper left, $\phi_2$ is a vertical stroke in the middle, $\phi_3$ is a horizontal stroke at the bottom, $\phi_4$ is a corner at the upper left, $\phi_5$ is a bend in the middle, and $\phi_6$ is an arc at the lower right.
3. The second layer has two nodes: $z_1$ answers "is it a '1'?" and $z_5$ answers "is it a '5'?". Blue lines are positive weights and red lines are negative weights. $z_1$ has blue lines to $\phi_1$, $\phi_2$, $\phi_3$ and red lines to $\phi_4$, $\phi_5$, $\phi_6$; $z_5$ has blue lines to $\phi_3$, $\phi_4$, $\phi_5$, $\phi_6$ and red lines to $\phi_1$, $\phi_2$.
4. The output node at the top has a blue line to $z_1$ and a red line to $z_5$.

In the lecture, Lin puts it this way: the neuron that recognizes 1 wants the previous layer to report that these three parts are present and the other three are absent, which the right weights can express; 5 needs the curved parts, plus the horizontal stroke at the bottom.

The figure shows only signs, not values. The numbers below are made up for this article, not from the slides, to walk through the figure once. Let $\phi_i = +1$ mean the image has stroke $i$ and $-1$ mean it does not; give blue lines weight $+1$ and red lines weight $-1$, with no constant term.

| Input | $(\phi_1, \dots, \phi_6)$ | Score of $z_1$ | Score of $z_5$ | Score of the output node, $z_1 - z_5$ |
|---|---|---|---|---|
| A standard 1 | $(+,+,+,-,-,-)$ | $6$ | $-4$ | $10$ |
| A standard 5 | $(-,-,+,+,+,+)$ | $-4$ | $6$ | $-10$ |
| A 1 missing the upper-left stroke | $(-,+,+,-,-,-)$ | $4$ | $-2$ | $6$ |

Take the third row: the score of $z_1$ is $(+1)(-1) + (+1)(+1) + (+1)(+1) + (-1)(-1) + (-1)(-1) + (-1)(-1) = 4$. With one stroke missing, the score drops from 6 to 4 but stays positive, so the answer is still 1. This is what Lin describes in the lecture: when the writing is a bit sloppy and some features are unclear, the digit is still mostly recognizable.

The handout states the point of this example in two lines. The first is 'less burden' for each layer, with features going from simple to complex. The lecture's analogy is not trying to reach the top in one step: separating 1 from 5 straight from a pile of pixels is hard, but if the first layer only has to find short strokes in the pixels and later layers combine short strokes into slightly more complex ones, the work between layers becomes simple. With a single hidden layer, that one layer has to do something very complicated.

The second line is that deep networks are natural for difficult learning tasks with raw features. In the lecture, Lin explains that the raw features of an image are pixels and those of speech are sound waves; a single feature has very limited physical meaning, people have no good way to design a feature transform, and the only option is to let the model learn it layer by layer. The page concludes that deep networks were popular at the time in areas like vision and speech.

The lecture adds one caveat: this figure is actually still shallow, with only two layers. It is only there to show that each layer can carry a different physical meaning.

### Four challenges and the matching techniques

Page 5 lists four challenges of deep learning, each paired with a kind of remedy from that time:

| Challenge | Remedy | Example in the handout |
|---|---|---|
| Difficult structural decisions | Put in what you know about the problem (domain knowledge) | convolutional NNet for images |
| High model complexity | No big worries if the data is big enough; also regularization towards noise tolerance | dropout (tolerant when the network is corrupted), denoising (tolerant when the input is corrupted) |
| Hard optimization problem | Careful initialization to avoid a bad local minimum, called pre-training | — |
| Huge computational complexity, worse with big data | Novel hardware and architecture | mini-batch with GPU |

The lecture says a little more about each row:

- **Structure.** The idea of the convolutional NNet is that the pixels of an image have positions relative to each other. So when designing the connections, let neighboring pixels connect to the same neuron in the next layer, and do not connect pixels that are far apart at all. This amounts to deciding in advance that some weights do not exist, so each neuron handles only nearby pixels.
- **Complexity.** Vision and speech usually come with a lot of data, enough to support the model's complexity, so the pressure moves to computation instead. The lecture does not go into dropout; Lin only says it simulates some neurons in the network breaking down, in the hope that the final result is still computed well. Denoising simulates the input breaking down, and the section on why adding noise counts as regularization covers it.
- **Optimization.** The previous lecture said neural networks easily get stuck at local optima, and with more layers and neurons there are more such points. Gradient descent is sensitive to its starting point, so many methods choose the starting point carefully instead of at random.
- **Computation.** In the lecture, Lin says this is where things differ a lot from thirty years earlier: a GPU has many computing units and can compute the gradients in a mini-batch in parallel.

The footer is Lin's personal opinion (the slide says IMHO): careful regularization and initialization are key techniques. In the lecture, Lin calls these the two most important breakthroughs that let networks go deeper and deeper. The remaining three sections of the lecture therefore cover only these two: the simplest pre-training technique, along with one regularization technique.

### A two-step deep learning framework

Page 6 gives a simple framework, which the handout calls Simple Deep Learning:

1. For $\ell = 1, \dots, L$, pre-train $\{w_{ij}^{(\ell)}\}$ assuming $w_*^{(1)}, \dots, w_*^{(\ell-1)}$ fixed.
2. Train with backprop on the pre-trained NNet to fine-tune all $\{w_{ij}^{(\ell)}\}$.

The page has four small figures, (a) to (d), each a network with four rows of nodes and three layers of weights, input at the bottom. In (a) only the bottom layer of weights is blue, meaning it is being pre-trained, and the rest are gray dashed lines; in (b) the bottom layer has turned black (fixed) and the second layer is blue; in (c) it is the third layer's turn; in (d) everything is black and step 2 can begin.

In the lecture, Lin gives the reasoning: deciding all the weights at once is too hard, so do it one layer at a time. Step 1 only decides the starting point, so it can be quick and need not be very accurate; once the network is in a good place, backprop can always fine-tune it to do better on the actual problem.

The framework does not yet say what "pre-train" in step 1 trains. That is the question the autoencoder answers.

### Fun Time: what the first layer extracts

**Question (page 7):** For a deep NNet for written character recognition from raw pixels, which type of features are more likely extracted after the first hidden layer?

1. pixels
2. strokes
3. parts
4. digits

**Answer: 2.** The handout's reason: simple strokes are likely the 'next-level' features that can be extracted from raw pixels. Pixels are the input itself and need no extraction, so choice 1 is wrong. Parts are made of several strokes, and digits are made of parts, which only later layers and the output can produce; in the lecture, Lin says the first layer will not give anything too complicated, nor tell us directly how to classify in the end. The figure on page 4 follows exactly this order: pixels → strokes → 1 or 5.

## Where pre-trained weights should head: an encoding that decodes back to the input

```youtube
url: https://www.youtube.com/watch?v=eBVPQ4fgs_k
title: Deep Learning ::Autoencoder @ Machine Learning Techniques (機器學習技法)
```

(In the video, 00:00–03:22 discusses information-preserving encoding, 03:22–05:30 is the autoencoder network, 05:30–09:40 explains what approximating the identity function is good for, 09:40–12:44 is the basic autoencoder, 12:44–14:39 puts it into pre-training, and the rest is Fun Time.)

### Good weights are an information-preserving encoding

Page 8 first asks what weights are. Weights determine a feature transform, or in other words an encoding: they turn the data into another representation.

When one layer is being pre-trained, the later layers are not decided yet, and nobody knows how these weights will later be fine-tuned or used. From this the lecture derives a criterion: since we do not know what the weights will be used for, this layer should at least not lose information. After the transform, later layers should not find the data scrambled and unusable; whatever information the original data carries, the new representation should carry something similar. The handout writes it as information-preserving encoding: the next layer holds the same info with a different representation.

How do we judge whether information is preserved? The handout's definition is: decode accurately after encoding. The lecture explains with the stroke example. Once the pixels of the digit 1 are turned into "which of these strokes are present", knowing that it has $\phi_1$, $\phi_2$, $\phi_3$ is enough to stack those strokes and rebuild roughly what that 1 looks like. The numbers Lin gives: suppose there were a thousand pixels to begin with, and after turning them into six features we can still turn them back into a thousand pixels; then no information loss is visible, only a change of representation.

So the direction of pre-training is settled: move the weights towards an information-preserving encoding.

### Autoencoder: a network whose output should look like its input

Page 9 turns this idea into a neural network. The inputs are $x_1, \dots, x_d$ (plus $x_0 = 1$), the middle layer has $\tilde{d}$ $\tanh$ neurons (plus the constant $+1$), and the output layer has $d$ linear nodes, with output $i$ aiming to be close to $x_i$. The handout's definitions:

- **autoencoder**: a $d$—$\tilde{d}$—$d$ NNet with goal $g_i(\mathbf{x}) \approx x_i$, that is, learning to approximate the identity function.
- $w_{ij}^{(1)}$ are the encoding weights, and $w_{ji}^{(2)}$ are the decoding weights.

In the lecture, Lin points out one difference from the previous lecture's network: there is no longer a single output but $d$ of them, one for each dimension of the input.

Then comes a natural doubt, which the handout writes in the footer: the identity function takes one line of code, so why go to the trouble of approximating it?

### What approximating the identity function is good for

Page 10 answers. The premise: if $\mathbf{g}(\mathbf{x}) \approx \mathbf{x}$ is achieved using some hidden structures on the observed data $\mathbf{x}_n$, then the learned structure is itself useful.

- **For supervised learning:** the hidden structure can be used as a reasonable transform $\boldsymbol{\Phi}(\mathbf{x})$. The handout calls this learning an 'informative' representation of data. In the lecture, Lin says the encoding half of the weights is this transform; it is a decent starting point that can be fine-tuned later, which makes it suitable for pre-training.
- **For unsupervised learning:** in density estimation, places where $\mathbf{g}(\mathbf{x}) \approx \mathbf{x}$ match the structure and have larger density; in outlier detection, those $\mathbf{x}$ where $\mathbf{g}(\mathbf{x}) \not\approx \mathbf{x}$ are the outliers. The handout calls this learning a 'typical' representation of data. The lecture's explanation: where data is dense, the encoder has seen enough and does better; on points that do not fit in, the encoder does worse.

The lecture sums the page up in one line: approximating the identity function is only the means, and what we actually want is the representation in the middle layer. The handout's wording is representation-learning through approximating identity function.

One addition in this article, to help see why the middle layer learns anything. If $\tilde{d} \ge d$, the middle layer has enough room to carry the input across unchanged, and approximating the identity function needs no structure at all. When $\tilde{d} < d$, $d$ numbers have to squeeze into $\tilde{d}$ numbers and then be restored, and that can only go well if the data itself has regularity (for example, the pixels of a digit are really made up of a few kinds of strokes).

### The basic autoencoder

Page 11 gives the formal definition. The basic autoencoder is a $d$—$\tilde{d}$—$d$ NNet whose error function for each example is

$$
\sum_{i=1}^{d}\big(g_i(\mathbf{x}) - x_i\big)^2
$$

The handout lists four properties:

- **Backprop easily applies.** It has a single hidden layer, so it is shallow and easy to train. In the lecture, Lin says it is at least much easier than a very deep network.
- **Usually $\tilde{d} < d$.** The result is a compressed representation.
- **The data is $\{(\mathbf{x}_1, \mathbf{y}_1 = \mathbf{x}_1), (\mathbf{x}_2, \mathbf{y}_2 = \mathbf{x}_2), \dots, (\mathbf{x}_N, \mathbf{y}_N = \mathbf{x}_N)\}$.** Both input and target are $\mathbf{x}_n$ and no labels are used, so it is often categorized as an unsupervised learning technique. The lecture describes this as covering up the labels for now; later, to separate 1 from 5, backprop adjusts the whole network.
- **Sometimes constrain $w_{ij}^{(1)} = w_{ji}^{(2)}$ as regularization.** Encoding and decoding share one set of weights, which cuts the number of weights roughly in half. The cost is a more complicated gradient calculation; in the lecture, Lin says the effect of this constraint has to be accounted for.

The footer states its use in this lecture: in basic deep learning, once the autoencoder is trained, $\{w_{ij}^{(1)}\}$ are taken as the pre-trained weights. An addition in this article: in other words, the decoding half is needed only while training the autoencoder and is not used after that.

### Worked example: a 2-1-2 autoencoder

The following is an example made up for this article, not from the slides. The data is four two-dimensional points with no labels:

$$
\mathbf{x}_1 = (2, 1),\quad \mathbf{x}_2 = (1, 2),\quad \mathbf{x}_3 = (-2, -1),\quad \mathbf{x}_4 = (-1, -2)
$$

The autoencoder is 2-1-2: two inputs, one $\tanh$ neuron, two linear outputs, with $d = 2$ and $\tilde{d} = 1$. The number of weights is $(2+1) \times 1 + (1+1) \times 2 = 7$, of which 3 encode and 4 decode. Suppose training produces the following weights (this article simply states them; no training was actually run):

- Encoding: $w_{01}^{(1)} = 0$, $w_{11}^{(1)} = 0.5$, $w_{21}^{(1)} = 0.5$.
- Decoding: $w_{01}^{(2)} = w_{02}^{(2)} = 0$, $w_{11}^{(2)} = w_{12}^{(2)} = 1.657$.

One forward pass for $\mathbf{x}_1 = (2, 1)$:

1. Encode: $s = 0 + 0.5 \times 2 + 0.5 \times 1 = 1.5$, and the middle layer outputs $\tanh(1.5) = 0.9051$. This single number is the new representation of $(2, 1)$.
2. Decode: $g_1 = g_2 = 1.657 \times 0.9051 = 1.4998$.
3. Error: $(1.4998 - 2)^2 + (1.4998 - 1)^2 = 0.2502 + 0.2498 = 0.5000$.

Results for six points (the first four are the training data, the last two are new points):

| $\mathbf{x}$ | Encoded value | $\mathbf{g}(\mathbf{x})$ | Error |
|---|---|---|---|
| $(2, 1)$ | $0.9051$ | $(1.4998, 1.4998)$ | $0.5$ |
| $(1, 2)$ | $0.9051$ | $(1.4998, 1.4998)$ | $0.5$ |
| $(-2, -1)$ | $-0.9051$ | $(-1.4998, -1.4998)$ | $0.5$ |
| $(-1, -2)$ | $-0.9051$ | $(-1.4998, -1.4998)$ | $0.5$ |
| $(1.5, 1.5)$ | $0.9051$ | $(1.4998, 1.4998)$ | $0.0000$ |
| $(2, -2)$ | $0$ | $(0, 0)$ | $8$ |

Three things can be read off this table.

First, compression has a cost. $(2, 1)$ and $(1, 2)$ are encoded to the same number and cannot be told apart after decoding. One number cannot hold all the information in two, and these weights choose to keep the sum of the two coordinates and let go of their difference. The four points differ a lot along the coordinate-sum direction ($\pm 3$) and little along the coordinate-difference direction ($\pm 1$), so this choice gives a small error. The section on the linear autoencoder will compute that, with a single number and a linear decoder, an average of 0.5 over the four points is already the smallest achievable error.

Second, the encoding half is the feature transform $\Phi(\mathbf{x}) = \tanh(0.5 x_1 + 0.5 x_2)$. What pre-training keeps is the three weights $(0, 0.5, 0.5)$.

Third, the size of the error can tell whether a point is typical, which matches the outlier detection on page 10. $(1.5, 1.5)$ lies along the main direction of the data and has an error of almost 0; $(2, -2)$ is perpendicular to the trend of the four examples and has an error of 8, which is 16 times that of the training data.

### Pre-training with autoencoders

Page 12 fills the autoencoder into the earlier two-step framework, and the handout calls the result Deep Learning with Autoencoders. Step 1 gains a line:

1. For $\ell = 1, \dots, L$, pre-train $\{w_{ij}^{(\ell)}\}$ assuming $w_*^{(1)}, \dots, w_*^{(\ell-1)}$ fixed, by training a basic autoencoder on $\{\mathbf{x}_n^{(\ell-1)}\}$ with $\tilde{d} = d^{(\ell)}$.
2. Train with backprop on the pre-trained NNet to fine-tune all $\{w_{ij}^{(\ell)}\}$.

$\mathbf{x}_n^{(\ell-1)}$ is the output of example $n$ at layer $\ell-1$, and $\mathbf{x}_n^{(0)}$ is the raw input. In the lecture, Lin explains that the number of neurons in the middle of the autoencoder is set by the number of neurons in the network's next layer; training yields a set of starting weights, which are then fixed before moving on to the next layer.

Let us walk through a concrete network. The network size below is made up for this article: to tell whether a 16×16 handwritten digit image is a 1 or a 5, with 256 input pixels, the network is 256-64-16-6-1, and there are $N$ images.

| Step | Training data | Autoencoder | Encoding weights kept | Decoding weights discarded |
|---|---|---|---|---|
| $\ell = 1$ | Raw pixels $\mathbf{x}_n^{(0)}$ (256 dimensions) | 256-64-256 | $257 \times 64 = 16448$, used as $w^{(1)}$ | $65 \times 256 = 16640$ |
| $\ell = 2$ | Layer 1 outputs $\mathbf{x}_n^{(1)}$ (64 dimensions) | 64-16-64 | $65 \times 16 = 1040$, used as $w^{(2)}$ | $17 \times 64 = 1088$ |
| $\ell = 3$ | Layer 2 outputs $\mathbf{x}_n^{(2)}$ (16 dimensions) | 16-6-16 | $17 \times 6 = 102$, used as $w^{(3)}$ | $7 \times 16 = 112$ |
| $\ell = 4$ | Layer 3 outputs $\mathbf{x}_n^{(3)}$ (6 dimensions) | 6-1-6 | $7 \times 1 = 7$, used as $w^{(4)}$ | $2 \times 6 = 12$ |

After each layer, all $N$ images have to be passed through the weights just fixed to produce the training data for the next step. After the four steps, all $16448 + 1040 + 102 + 7 = 17597$ weights of the network have starting values, and only then are the labels $y_n$ brought out to fine-tune every weight with backprop. The first four steps never use the labels.

The footer notes that many successful pre-training techniques take 'fancier' autoencoders with different architectures and regularization schemes. In the lecture, Lin says these methods are much alike, differing in some extra regularization or in how things are connected.

### Fun Time: how long pre-training takes

**Question (page 13):** Suppose training a $d$-$\tilde{d}$-$d$ autoencoder with backprop takes approximately $c \cdot d \cdot \tilde{d}$ seconds. Then, what is the total number of seconds needed for pre-training a $d$-$d^{(1)}$-$d^{(2)}$-$d^{(3)}$-1 deep NNet?

1. $c\left(d + d^{(1)} + d^{(2)} + d^{(3)} + 1\right)$
2. $c\left(d \cdot d^{(1)} \cdot d^{(2)} \cdot d^{(3)} \cdot 1\right)$
3. $c\left(d\,d^{(1)} + d^{(1)}d^{(2)} + d^{(2)}d^{(3)} + d^{(3)}\right)$
4. $c\left(d\,d^{(1)} \cdot d^{(1)}d^{(2)} \cdot d^{(2)}d^{(3)} \cdot d^{(3)}\right)$

**Answer: 3.** The handout's solution: each $c \cdot d^{(\ell-1)} \cdot d^{(\ell)}$ represents the time for pre-training with one autoencoder to determine one layer of the weights. Four layers of weights need four autoencoders, trained one after another, so the times add. The last term is $c \cdot d^{(3)} \cdot 1 = c\,d^{(3)}$, for the weights of the output layer.

Choice 1 treats the time of each autoencoder as depending on the size of only one side; choices 2 and 4 multiply the times, but the four autoencoders are trained in sequence, not as nested loops.

A check from this article: with the earlier 256-64-16-6-1, choice 3 gives $c(16384 + 1024 + 96 + 6) = 17510c$. The first term alone is 94%, so almost all the pre-training time goes to the widest layer. Choice 2 would give $1572864c$, off by a factor of nearly 90.

## Why adding noise counts as regularization: the denoising autoencoder

```youtube
url: https://www.youtube.com/watch?v=gx2Vfw8S--0
title: Deep Learning ::Denoising Autoencoder @ Machine Learning Techniques (機器學習技法)
```

(In the video, 00:00–01:32 looks back at the regularization already learned, 01:32–02:27 reviews the causes of overfitting, 02:27–07:19 is the idea of adding noise and the denoising autoencoder, 07:19–08:05 files it under hints, and the rest is Fun Time.)

### The regularization tools we already have

Pre-training deals with initialization; this section turns to regularization. Page 14 shows the network figure once more, with "watch out for overfitting" written beneath it: with this many weights and neurons, model complexity is high and regularization is needed. The handout lists three kinds we already know:

- **Structural decisions/constraints.** The lecture's example is the convolutional NNet: having fewer connections is itself a constraint.
- **Weight decay or weight elimination regularizers.** From the previous lecture.
- **Early stopping.** Also from the previous lecture: backprop does not have to run to the end, and stopping partway may be better.

The handout says another regularization technique comes next.

### Noise is a cause of overfitting

Page 15 returns to the figure from [Foundations Lecture 13: Hazard of Overfitting](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization-en): the horizontal axis is the number of data points $N$ (the ticks run from 80 to 120), the vertical axis is the stochastic noise level $\sigma^2$ (0 to 2), and color shows the amount of overfitting, redder being worse. The upper left, with little data and much noise, is solid dark red; the lower right, with much data and little noise, is blue. Beside the figure the reasons are arranged in three lines:

| Situation | Overfitting |
|---|---|
| Data size $N$ goes down | gets worse |
| Noise goes up | gets worse |
| Excessive power | gets worse |

The lecture's inference: if the model and the data size are already fixed, the only thing left to deal with is the noise.

### Adding noise to the data

Page 16 first lists the direct possibility: data cleaning/pruning, mentioned in Foundations Lecture 13. Then comes what the handout itself calls a "wild" possibility: adding noise to data. In the lecture, Lin voices the students' doubt for them: there is already too much noise in the data, so why add more?

The idea starts from what a good autoencoder should be like. The handout writes: a robust autoencoder should not only let $\mathbf{g}(\mathbf{x}) \approx \mathbf{x}$ but also allow $\mathbf{g}(\tilde{\mathbf{x}}) \approx \mathbf{x}$ even when $\tilde{\mathbf{x}}$ is slightly different from $\mathbf{x}$. The lecture's example is a handwritten digit: if the same character is written a bit uglier or more crooked, or the paper is a bit dirty, the decoded result should still be about the same as the original clean character. An encoder that takes in dirty and puts out dirty, or even dirtier, is not much use.

The method leaves the network alone and changes only the data fed in. The handout's definition:

- **denoising autoencoder**: run the basic autoencoder with the data

$$
\{(\tilde{\mathbf{x}}_1, \mathbf{y}_1 = \mathbf{x}_1), (\tilde{\mathbf{x}}_2, \mathbf{y}_2 = \mathbf{x}_2), \dots, (\tilde{\mathbf{x}}_N, \mathbf{y}_N = \mathbf{x}_N)\},\qquad \tilde{\mathbf{x}}_n = \mathbf{x}_n + \text{artificial noise}
$$

The input is $\tilde{\mathbf{x}}_n$, with artificial noise added, and the target is still the clean $\mathbf{x}_n$. The handout then lists three points:

- In deep learning, it is often used instead of the basic autoencoder.
- It is useful for data/image processing: $\mathbf{g}(\tilde{\mathbf{x}})$ is a denoised version of $\tilde{\mathbf{x}}$. The lecture's example is a scanned image that carries a little noise.
- Its effect is to 'constrain/regularize' $\mathbf{g}$ towards a noise-tolerant, denoising function.

Why does this count as regularization? The lecture's analogy is telling the encoder: child, the world is messy, but I am telling you what the right answer is, and however messy the input, there is a lamp pointing the right way. Feeding noisy inputs with clean targets tells the algorithm what property we want $\mathbf{g}$ to have and steers it that way, which is what regularization does.

The footer generalizes the idea: artificial noise/hint as regularization, practically also useful for other NNet and models. In the lecture, Lin recalls that Foundations called adding artificially designed data a hint, which likewise tells the machine what kind of data to handle better.

### Worked example: in the simplest model, noise becomes a penalty on the weight

The following is an example made up for this article, not from the slides. It handles only the simplest case, to make clear how "adding noise" relates to the weight decay of Foundations Lecture 14.

The data is four one-dimensional numbers, $x \in \{-2, -1, 1, 2\}$. The model is a one-dimensional linear autoencoder $g(\tilde{x}) = a\tilde{x}$, where $a$ is the product of the encoding weight and the decoding weight. On clean data, $a = 1$ makes the error 0.

Now give every $x$ two noisy versions, $\tilde{x} = x + 1$ and $\tilde{x} = x - 1$, for eight training examples $(\tilde{x}, x)$ in all:

$$
(-3, -2),\ (-1, -2),\ (-2, -1),\ (0, -1),\ (0, 1),\ (2, 1),\ (1, 2),\ (3, 2)
$$

**Solving directly.** We minimize $\sum (a\tilde{x} - x)^2$. Differentiating with respect to $a$ and setting the result to 0 gives $a = \sum \tilde{x}x \big/ \sum \tilde{x}^2$. The numerator is $6 + 2 + 2 + 0 + 0 + 2 + 2 + 6 = 20$ and the denominator is $9 + 1 + 4 + 0 + 0 + 4 + 1 + 9 = 28$, so

$$
a = \frac{20}{28} = \frac{5}{7} \approx 0.714
$$

**Seeing the penalty term.** Put the two versions of one $x$ together. Writing the noise as $\varepsilon = \pm 1$, the error is

$$
\big(a(x + \varepsilon) - x\big)^2 = \big((a-1)x + a\varepsilon\big)^2 = (a-1)^2x^2 + 2a(a-1)x\varepsilon + a^2\varepsilon^2
$$

Averaging over $\varepsilon = +1$ and $\varepsilon = -1$, the middle term cancels and $\varepsilon^2$ is 1 both times. Averaging again over the four $x$, the mean of $x^2$ is $(4 + 1 + 1 + 4)/4 = 2.5$:

$$
\text{average error} = \underbrace{2.5\,(a-1)^2}_{\text{error on clean data}} + \underbrace{1 \cdot a^2}_{\text{term from the noise}}
$$

The first term is the $E_{\text{in}}$ without noise. The second is the square of $a$ times the variance of the noise (here 1); viewing $a$ as a weight, it has the same form as the $\lambda w^2$ of weight decay, with the noise variance playing the role of $\lambda$. Differentiating with respect to $a$: $5(a - 1) + 2a = 0$, which gives $a = 5/7$, in agreement with the direct solution.

| $a$ | Error on clean data, $2.5(a-1)^2$ | Term from the noise, $a^2$ | Sum |
|---|---|---|---|
| $1$ | $0$ | $1$ | $1$ |
| $0.9$ | $0.025$ | $0.81$ | $0.835$ |
| $5/7$ | $0.204$ | $0.510$ | $0.714$ |
| $0.5$ | $0.625$ | $0.25$ | $0.875$ |

**What this result means.** With noise added, the optimal $a$ shrinks from 1 to $5/7$: the model learns that the input has been inflated by noise and the output should pull back a little. Its error on clean data goes from 0 to 0.204, the usual price of regularization, a slightly worse $E_{\text{in}}$ in exchange for a $g$ less sensitive to perturbations of the input. The stronger the noise, the more $a$ shrinks in this example.

This identity was derived under the conditions of this example: the model is linear, the error is squared error, and the noise is symmetric in sign so the cross term cancels. It is not a conclusion of the handout and cannot be carried over directly to a network with $\tanh$. The handout only says the effect of denoising is to constrain $\mathbf{g}$ towards noise tolerance.

### Fun Time: which one is not regularization

**Question (page 17):** Which of the following cannot be viewed as a regularization technique?

1. hint the model with artificially-generated noisy data
2. stop gradient descent early
3. add a weight elimination regularizer
4. all the above are regularization techniques

**Answer: 4.** The handout's solution: choice 1 is our new friend for regularization, while choices 2 and 3 are old friends. Choice 1 is the denoising of this section; choice 2 is early stopping and choice 3 is weight elimination, both from the previous lecture. All three are regularization, and none of them fits the "cannot be viewed as" the question asks for, so the answer is 4.

In the lecture, Lin reads choice 4 aloud as "none of the above", which means the same thing: none of the first three is the one the question is looking for. On the handout, choice 4 reads "all the above are regularization techniques".

## Making the autoencoder linear: the optimal solution is the top eigenvectors of XᵀX

```youtube
url: https://www.youtube.com/watch?v=Bgc4UY8567A
title: Deep Learning :: Principal Component Analysis @ Machine Learning Techniques (機器學習技法)
```

(In the video, 00:01–05:58 writes out the linear autoencoder hypothesis, 05:58–07:47 is the error function, 07:47–14:11 does the eigen-decomposition and gives its geometric meaning, 14:11–18:15 finds the optimal Γ, 18:15–24:48 finds the optimal V, 24:48–28:50 is PCA, 28:50–29:38 is Fun Time, and the rest summarizes the whole lecture.)

### The linear autoencoder hypothesis

The autoencoder so far has $\tanh$ in the middle and is nonlinear. Page 18 goes back to ask about the linear version, with the reasons written on the page: linear may be more efficient and overfit less, and this course has always been linear first. In the lecture, Lin explains why it was skipped earlier: every layer in deep learning has to make a nonlinear transform anyway, so the nonlinear autoencoder is more useful in that architecture; the linear version can be used to process data and need not be used in deep learning.

Take out $\tanh$, and output $k$ is just two layers of weights multiplied together. The handout adds three special conditions:

- **Exclude $x_0$.** This makes the range of $i$ the same as the range of $k$. The lecture's reason: if the input had a dimension 0, the output would also need a dimension 0 to compare against the constant, which makes little sense.
- **Constrain $w_{ij}^{(1)} = w_{ji}^{(2)} = w_{ij}$.** This is the regularization mentioned on the basic autoencoder page, with encoding and decoding sharing weights. Collect these weights into a $d \times \tilde{d}$ matrix $\mathrm{W} = [w_{ij}]$.
- **Assume $\tilde{d} < d$.** This ensures a non-trivial solution.

Under these conditions, the handout writes the hypothesis for the $k$-th component as

$$
h_k(\mathbf{x}) = \sum_{j} w_{kj}\left(\sum_{i=1}^{d} w_{ij}x_i\right)
$$

On the slide the outer sum runs from $j = 0$ to $\tilde{d}$; in the lecture, Lin says $j$ ranges from 1 to $\tilde{d}$, and $\mathrm{W}$, of size $d \times \tilde{d}$, only has room for these $\tilde{d}$ columns, so the matrix form below has no $j = 0$ term.

Read it as matrix operations. Row $i$, column $j$ of $\mathrm{W}$ is $w_{ij}$, so the inner parenthesis $\sum_i w_{ij}x_i$ is component $j$ of the vector $\mathrm{W}^\top\mathbf{x}$; this is the encoding, and the result has $\tilde{d}$ dimensions. The outer $\sum_j w_{kj}(\cdot)_j$ is component $k$ after multiplying by $\mathrm{W}$ again; this is the decoding, and the result is back in $d$ dimensions. The handout's conclusion:

$$
\mathbf{h}(\mathbf{x}) = \mathrm{W}\mathrm{W}^\top\mathbf{x}
$$

An addition in this article, on the reason for the third condition. If $\tilde{d} = d$, let $\mathrm{W}$ be whichever $d \times d$ orthogonal matrix you like (the identity matrix, for example), and then $\mathrm{W}\mathrm{W}^\top = \mathrm{I}$, $\mathbf{h}(\mathbf{x}) = \mathbf{x}$, and the error is 0, yet no structure has been learned. In the lecture, Lin only says this case has a very trivial solution, which is not what we want.

### The error function is a fourth-order polynomial in the weights

Page 19 writes down the quantity to minimize. The error is still squared error, averaged over all the data:

$$
E_{\text{in}}(\mathbf{h}) = E_{\text{in}}(\mathrm{W}) = \frac{1}{N}\sum_{n=1}^{N}\left\lVert \mathbf{x}_n - \mathrm{W}\mathrm{W}^\top\mathbf{x}_n \right\rVert^2
$$

A linear model with squared error has a one-step analytic solution in [Foundations Lecture 9: Linear Regression](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en). Can there be one here too? Under the formula the handout writes only one remark: this is a 4-th order polynomial of $w_{ij}$. In the lecture, Lin says that is why it does not look easy at first sight.

An addition in this article: write the fourth-order polynomial out for $\tilde{d} = 1$. Then $\mathrm{W}$ has a single column, written as the vector $\mathbf{w}$, and $\mathrm{W}\mathrm{W}^\top\mathbf{x} = \mathbf{w}(\mathbf{w}^\top\mathbf{x})$:

$$
\left\lVert \mathbf{x} - \mathbf{w}(\mathbf{w}^\top\mathbf{x}) \right\rVert^2 = \mathbf{x}^\top\mathbf{x} - 2(\mathbf{w}^\top\mathbf{x})^2 + (\mathbf{w}^\top\mathbf{w})(\mathbf{w}^\top\mathbf{x})^2
$$

The three terms are of order zero, two, and four in $\mathbf{w}$. Differentiating with respect to $\mathbf{w}$ gives cubic equations, without the luck of linear regression, where solving one linear system finishes the job. The handout's route is a change of variables. In the lecture, Lin says the problem still has an analytic solution; it is just not easy to see at a glance.

### A change of variables: eigen-decompose WWᵀ

Here the handout writes "be brave", because linear algebra comes next. Look at the formula for $E_{\text{in}}$: $\mathrm{W}$ appears only in the form $\mathrm{W}\mathrm{W}^\top$. In the lecture, Lin points out that $\mathrm{W}\mathrm{W}^\top$ is a positive semi-definite matrix (it is also symmetric), so it can be eigen-decomposed:

$$
\mathrm{W}\mathrm{W}^\top = \mathrm{V}\Gamma\mathrm{V}^\top
$$

The handout lists the properties of the two matrices:

- $\mathrm{V}$ is a $d \times d$ orthogonal matrix, $\mathrm{V}\mathrm{V}^\top = \mathrm{V}^\top\mathrm{V} = \mathrm{I}_d$. Each of its columns $\mathbf{v}_j$ has length 1, and the columns are perpendicular to one another.
- $\Gamma$ is a $d \times d$ diagonal matrix with at most $\tilde{d}$ non-zero values on its diagonal.

The second point comes from rank. $\mathrm{W}$ has only $\tilde{d}$ columns, and $\mathrm{W}\mathrm{W}^\top\mathbf{x}$ is always a linear combination of those $\tilde{d}$ columns, so the rank of $\mathrm{W}\mathrm{W}^\top$ is at most $\tilde{d}$, and there are at most $\tilde{d}$ non-zero eigenvalues. The numbers in the lecture are $d = 200$ and $\tilde{d} = 50$: at most 50 entries on the diagonal are non-zero, and the other 150 must be 0. The original restriction on the size of $\mathrm{W}$ thus turns into a restriction on $\Gamma$.

So $\mathrm{W}\mathrm{W}^\top\mathbf{x}_n = \mathrm{V}\Gamma\mathrm{V}^\top\mathbf{x}_n$ splits into three actions, which the handout explains one by one:

1. $\mathrm{V}^\top\mathbf{x}_n$: a change of orthonormal basis, geometrically a rotation or reflection. In the lecture, Lin stresses that a vector rotated around in space or reflected in a mirror keeps its length.
2. $\Gamma(\cdots)$: set at least $d - \tilde{d}$ components to 0, and scale each of the others.
3. $\mathrm{V}(\cdots)$: reconstruct by coefficients and basis, that is, rotate back to the original coordinates.

The original $\mathbf{x}_n$ can be written in the same form: $\mathbf{x}_n = \mathrm{V}\mathrm{I}\mathrm{V}^\top\mathbf{x}_n$, rotate, do nothing, rotate back. The two terms subtracted in $E_{\text{in}}$ then differ only in whether the middle is $\mathrm{I}$ or $\Gamma$. The problem changes from "find $\mathrm{W}$" to "find $\Gamma$ and $\mathrm{V}$", and the handout does it in two steps, $\Gamma$ first and $\mathrm{V}$ second.

### The optimal Γ: put d̃ ones on the diagonal

The problem on page 20 is

$$
\min_{\mathrm{V}}\min_{\Gamma}\ \frac{1}{N}\sum_{n=1}^{N}\left\lVert \mathrm{V}\mathrm{I}\mathrm{V}^\top\mathbf{x}_n - \mathrm{V}\Gamma\mathrm{V}^\top\mathbf{x}_n \right\rVert^2
$$

Treat $\mathrm{V}$ as fixed for now and look only at $\Gamma$. Factoring out what the two terms share, the inside of the norm is $\mathrm{V}(\mathrm{I} - \Gamma)\mathrm{V}^\top\mathbf{x}_n$. The leading $\mathrm{V}$ is the back-rotation and does not change length: for any vector $\mathbf{u}$, $\lVert\mathrm{V}\mathbf{u}\rVert^2 = \mathbf{u}^\top\mathrm{V}^\top\mathrm{V}\mathbf{u} = \mathbf{u}^\top\mathbf{u}$. The slide therefore crosses out that leading $\mathrm{V}$, leaving

$$
\min_{\Gamma}\ \sum_{n=1}^{N}\left\lVert (\mathrm{I} - \Gamma)\,\mathrm{V}^\top\mathbf{x}_n \right\rVert^2
$$

The handout's wording: we want many 0 within $\mathrm{I} - \Gamma$. In the lecture, Lin says the more zeros the better, and the only things we can move are the diagonal values of $\Gamma$; to get a 0 on the diagonal of $\mathrm{I} - \Gamma$, put a 1 on the diagonal of $\Gamma$, and at most $\tilde{d}$ of them can be placed.

This article writes that sentence as a formula. Component $j$ of $\mathrm{V}^\top\mathbf{x}_n$ is $\mathbf{v}_j^\top\mathbf{x}_n$, and $\mathrm{I} - \Gamma$ is a diagonal matrix that multiplies component $j$ by $1 - \gamma_j$. So

$$
\sum_{n=1}^{N}\left\lVert (\mathrm{I} - \Gamma)\,\mathrm{V}^\top\mathbf{x}_n \right\rVert^2 = \sum_{j=1}^{d}(1 - \gamma_j)^2\,c_j,\qquad c_j = \sum_{n=1}^{N}(\mathbf{v}_j^\top\mathbf{x}_n)^2 \ge 0
$$

Each $\gamma_j$ controls its own term. If $\gamma_j$ has to be 0, that term is $c_j$; if it may be non-zero, taking $\gamma_j = 1$ makes the term 0, and nothing is smaller than that. At most $\tilde{d}$ of them may be non-zero, so the optimal $\Gamma$ has $\tilde{d}$ diagonal components equal to 1 and the other components 0. The handout then says that, without loss of generality, the ones can be placed first:

$$
\Gamma = \begin{bmatrix} \mathrm{I}_{\tilde{d}} & 0 \\ 0 & 0 \end{bmatrix}
$$

This ordering is allowed because $\mathrm{V}$ is not decided yet, and which direction goes in which column is arranged in the next step. In the lecture, Lin puts it as leaving the rest for $\mathrm{V}$ to worry about.

This $\Gamma$ also says what the optimal linear autoencoder does: rotate to new coordinates, keep the first $\tilde{d}$ components unchanged, drop the rest, and rotate back. That is projection onto the subspace spanned by $\mathbf{v}_1, \dots, \mathbf{v}_{\tilde{d}}$.

### The optimal V: from minimizing what is dropped to maximizing what is kept

Substitute the optimal $\Gamma$ back in, and $\mathrm{I} - \Gamma$ has 0 in its first $\tilde{d}$ diagonal components and 1 in the last $d - \tilde{d}$. The problem on page 21 is

$$
\min_{\mathrm{V}}\ \sum_{n=1}^{N}\left\lVert \begin{bmatrix} 0 & 0 \\ 0 & \mathrm{I}_{d - \tilde{d}} \end{bmatrix}\mathrm{V}^\top\mathbf{x}_n \right\rVert^2 = \min_{\mathrm{V}}\ \sum_{j > \tilde{d}} c_j
$$

It minimizes the sum of squares of the components that are dropped, which is the reconstruction error. The handout replaces it with an equivalent maximization problem:

$$
\max_{\mathrm{V}}\ \sum_{n=1}^{N}\left\lVert \begin{bmatrix} \mathrm{I}_{\tilde{d}} & 0 \\ 0 & 0 \end{bmatrix}\mathrm{V}^\top\mathbf{x}_n \right\rVert^2 = \max_{\mathrm{V}}\ \sum_{j \le \tilde{d}} c_j
$$

The lecture passes over the reason for the equivalence in one sentence: the length of the whole vector is fixed, so more on one side means less on the other. As a formula, $\sum_{j=1}^{d} c_j = \sum_n \lVert\mathrm{V}^\top\mathbf{x}_n\rVert^2 = \sum_n \lVert\mathbf{x}_n\rVert^2$, and this total does not depend on $\mathrm{V}$. The dropped part plus the kept part is a constant, so making the dropped part smallest makes the kept part largest. In the lecture, Lin says the switch to maximization is only because the formula is cleaner.

**First, $\tilde{d} = 1$.** Now only the first row $\mathbf{v}^\top$ of $\mathrm{V}^\top$ matters, and every other row is multiplied by 0. The kept quantity is $(\mathbf{v}^\top\mathbf{x}_n)^2 = \mathbf{v}^\top\mathbf{x}_n\mathbf{x}_n^\top\mathbf{v}$, and the problem becomes

$$
\max_{\mathbf{v}}\ \sum_{n=1}^{N}\mathbf{v}^\top\mathbf{x}_n\mathbf{x}_n^\top\mathbf{v}\qquad \text{subject to}\quad \mathbf{v}^\top\mathbf{v} = 1
$$

The constraint cannot be dropped. In the lecture, Lin says that if $\mathbf{v}$ could be chosen freely, scaling it up 10 times or 100 times would raise the objective along with it, which is meaningless; $\mathbf{v}$ is a row of an orthogonal matrix, so its length is 1 to begin with.

Arrange the data as an $N \times d$ matrix $\mathrm{X}$ whose row $n$ is $\mathbf{x}_n^\top$; then $\sum_n \mathbf{x}_n\mathbf{x}_n^\top = \mathrm{X}^\top\mathrm{X}$, and the objective function is $\mathbf{v}^\top\mathrm{X}^\top\mathrm{X}\mathbf{v}$. This is optimization with an equality constraint, and the handout uses a Lagrange multiplier. The lecture's explanation: at the optimal solution, the gradient of the objective function and the gradient of the constraint must be parallel. The gradient of the objective with respect to $\mathbf{v}$ is $2\mathrm{X}^\top\mathrm{X}\mathbf{v}$ ($\mathrm{X}^\top\mathrm{X}$ is a symmetric matrix), the gradient of $\mathbf{v}^\top\mathbf{v}$ is $2\mathbf{v}$, and parallel means they differ by a multiple $\lambda$:

$$
\sum_{n=1}^{N}\mathbf{x}_n\mathbf{x}_n^\top\mathbf{v} = \lambda\mathbf{v}
$$

A matrix times $\mathbf{v}$ equal to $\lambda$ times $\mathbf{v}$ is exactly the definition of an eigenvector. So the optimal $\mathbf{v}$ must be some eigenvector of $\mathrm{X}^\top\mathrm{X}$, with $\lambda$ the corresponding eigenvalue. Which one? Substitute this condition back into the objective function:

$$
\mathbf{v}^\top\mathrm{X}^\top\mathrm{X}\mathbf{v} = \mathbf{v}^\top(\lambda\mathbf{v}) = \lambda\,\mathbf{v}^\top\mathbf{v} = \lambda
$$

The value of the objective function is $\lambda$. To maximize it, choose the eigenvector with the largest eigenvalue, which the handout calls the 'topmost' eigenvector. This step is also the content of this section's Fun Time.

**General $\tilde{d}$.** The handout's conclusion is that $\{\mathbf{v}_j\}_{j=1}^{\tilde{d}}$ are the eigenvectors of the $\tilde{d}$ largest eigenvalues of $\mathrm{X}^\top\mathrm{X}$. In the lecture, Lin says the proof is similar to $\tilde{d} = 1$ but more complicated, does not go into it, and gives only the result. This article does not prove it either.

**Back to $\mathrm{W}$.** $\Gamma$ is 1 only in the first $\tilde{d}$ positions, so $\mathrm{V}\Gamma\mathrm{V}^\top = \sum_{j \le \tilde{d}}\mathbf{v}_j\mathbf{v}_j^\top$. Taking the columns of $\mathrm{W}$ to be $\mathbf{w}_j = \mathbf{v}_j$ gives $\mathrm{W}\mathrm{W}^\top = \mathrm{V}\Gamma\mathrm{V}^\top$. The handout writes it as: the optimal $\{\mathbf{w}_j\}$ are the $\mathbf{v}_j$ with $\gamma_j = 1$, that is, the top eigenvectors. The original fourth-order polynomial has an analytic solution.

The handout sums up the whole derivation in one line: the linear autoencoder projects the data onto the orthogonal patterns $\mathbf{w}_j$ that 'match' $\{\mathbf{x}_n\}$ most.

An addition in this article, a result that comes for free. When $\mathbf{v}_j$ is an eigenvector, $c_j = \mathbf{v}_j^\top\mathrm{X}^\top\mathrm{X}\mathbf{v}_j = \lambda_j$. So the error of the optimal solution is the sum of the dropped eigenvalues divided by $N$:

$$
E_{\text{in}}(\mathrm{W}) = \frac{1}{N}\sum_{j > \tilde{d}}\lambda_j
$$

### Worked example: four points by hand

The following is an example made up for this article, not from the slides. The data is the four points of the earlier 2-1-2 autoencoder, with $d = 2$ and $\tilde{d} = 1$:

$$
\mathrm{X} = \begin{bmatrix} 2 & 1 \\ 1 & 2 \\ -2 & -1 \\ -1 & -2 \end{bmatrix}
$$

**Step 1: compute $\mathrm{X}^\top\mathrm{X}$.** The upper left is the sum of squares of the first coordinate, $4 + 1 + 4 + 1 = 10$; the lower right is the sum of squares of the second coordinate, $1 + 4 + 1 + 4 = 10$; the off-diagonal is the sum of products of the two coordinates, $2 + 2 + 2 + 2 = 8$:

$$
\mathrm{X}^\top\mathrm{X} = \begin{bmatrix} 10 & 8 \\ 8 & 10 \end{bmatrix}
$$

**Step 2: find the eigenvalues and eigenvectors.** Solving $(10 - \lambda)^2 - 64 = 0$ gives $10 - \lambda = \pm 8$, so $\lambda_1 = 18$ and $\lambda_2 = 2$. $\lambda_1 = 18$ goes with $\mathbf{v}_1 = \frac{1}{\sqrt{2}}(1, 1)$; check: $\mathrm{X}^\top\mathrm{X}(1, 1)^\top = (18, 18)^\top$. $\lambda_2 = 2$ goes with $\mathbf{v}_2 = \frac{1}{\sqrt{2}}(1, -1)$; check: $\mathrm{X}^\top\mathrm{X}(1, -1)^\top = (2, -2)^\top$.

**Step 3: the optimal $\mathrm{W}$.** With $\tilde{d} = 1$, take the largest one: $\mathbf{w} = \frac{1}{\sqrt{2}}(1, 1)$.

**Step 4: apply the three actions to $\mathbf{x}_1 = (2, 1)$.**

1. Rotate: $\mathrm{V}^\top\mathbf{x}_1 = (\mathbf{v}_1^\top\mathbf{x}_1,\ \mathbf{v}_2^\top\mathbf{x}_1) = \left(\frac{3}{\sqrt{2}},\ \frac{1}{\sqrt{2}}\right)$.
2. Multiply by $\Gamma = \text{diag}(1, 0)$: keep the first component and set the second to 0, giving $\left(\frac{3}{\sqrt{2}},\ 0\right)$. The encoding is the single number $\frac{3}{\sqrt{2}} \approx 2.121$.
3. Rotate back: $\frac{3}{\sqrt{2}}\mathbf{v}_1 = (1.5, 1.5)$.

The error is $\lVert(2, 1) - (1.5, 1.5)\rVert^2 = 0.25 + 0.25 = 0.5$, exactly the square of the dropped component, $\left(\frac{1}{\sqrt{2}}\right)^2$.

**Step 5: all four points.**

| $\mathbf{x}_n$ | $\mathbf{v}_1^\top\mathbf{x}_n$ (kept) | $\mathbf{v}_2^\top\mathbf{x}_n$ (dropped) | Reconstruction $\mathrm{W}\mathrm{W}^\top\mathbf{x}_n$ | Error |
|---|---|---|---|---|
| $(2, 1)$ | $3/\sqrt{2}$ | $1/\sqrt{2}$ | $(1.5, 1.5)$ | $0.5$ |
| $(1, 2)$ | $3/\sqrt{2}$ | $-1/\sqrt{2}$ | $(1.5, 1.5)$ | $0.5$ |
| $(-2, -1)$ | $-3/\sqrt{2}$ | $-1/\sqrt{2}$ | $(-1.5, -1.5)$ | $0.5$ |
| $(-1, -2)$ | $-3/\sqrt{2}$ | $1/\sqrt{2}$ | $(-1.5, -1.5)$ | $0.5$ |

The sum of squares of the kept column is $c_1 = 4 \times 4.5 = 18 = \lambda_1$, and that of the dropped column is $c_2 = 4 \times 0.5 = 2 = \lambda_2$; together they make 20, equal to the total squared length of the four points, $5 + 5 + 5 + 5$. $E_{\text{in}} = 2/4 = 0.5$, in agreement with the formula $\frac{1}{N}\sum_{j > \tilde{d}}\lambda_j$.

**Step 6: compare with other $\mathbf{w}$.** Use the earlier fourth-order polynomial, $E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\big[20 - 2q + (\mathbf{w}^\top\mathbf{w})\,q\big]$, where $q = \mathbf{w}^\top\mathrm{X}^\top\mathrm{X}\mathbf{w}$:

| $\mathbf{w}$ | $\mathbf{w}^\top\mathbf{w}$ | $q$ | $E_{\text{in}}$ |
|---|---|---|---|
| $\frac{1}{\sqrt{2}}(1, 1)$ | $1$ | $18$ | $0.5$ |
| $(1, 0)$ | $1$ | $10$ | $2.5$ |
| $\frac{1}{\sqrt{2}}(1, -1)$ | $1$ | $2$ | $4.5$ |
| $(0.5, 0.5)$ | $0.5$ | $9$ | $1.625$ |
| $(1, 1)$ | $2$ | $36$ | $5$ |

A wrong direction (rows two and three) or a wrong length (rows four and five) both give a larger error. $(1, 1)$ has the right direction, but its length is $\sqrt{2}$, so the reconstructed vector is scaled up to twice the size, and its error of 5 is as bad as not reconstructing at all ($\mathbf{w} = \mathbf{0}$).

**What this result means.** The optimal linear autoencoder projects every point onto the line along $(1, 1)$, keeping the coordinate sum and letting go of the coordinate difference, with an error of 0.5 per point. The earlier 2-1-2 autoencoder with $\tanh$ uses the same direction and also has an error of 0.5. Its decoder is linear, so its reconstructed points can only fall on one straight line, and it cannot do better than the best line found here.

Projection also has a denoising effect, echoing the handout's remark in the denoising section that $\mathbf{g}(\tilde{\mathbf{x}})$ is a denoised version. Take the point $\mathbf{x} = (1.5, 1.5)$ on the line and add noise perpendicular to the line to get $\tilde{\mathbf{x}} = (1.8, 1.2)$; then $\mathrm{W}\mathrm{W}^\top\tilde{\mathbf{x}} = (1.5, 1.5)$, and the noise is removed completely. Noise along the line cannot be removed: $(1.8, 1.8)$ is still $(1.8, 1.8)$ after projection.

A check with numpy (`np.linalg.eigh` returns the eigenvalues in ascending order):

```python
import numpy as np

X = np.array([[2, 1], [1, 2], [-2, -1], [-1, -2]], dtype=float)

eigval, eigvec = np.linalg.eigh(X.T @ X)
W = eigvec[:, [-1]]                       # the column for the largest eigenvalue
E_in = np.mean(np.sum((X - X @ W @ W.T) ** 2, axis=1))

print(eigval)           # [ 2. 18.]
print(np.abs(W.T))      # [[0.70710678 0.70710678]]
print(X @ W @ W.T)      # the four rows are (1.5, 1.5), (1.5, 1.5), (-1.5, -1.5), (-1.5, -1.5)
print(E_in)             # 0.5 (up to floating-point error)
```

The sign of an eigenvector is not unique, and $\mathbf{w}$ and $-\mathbf{w}$ give the same $\mathrm{W}\mathrm{W}^\top$, so the code takes absolute values before printing.

### PCA: subtract the mean, then do the same thing

Page 22 writes out the algorithm under the title Linear Autoencoder or PCA. On the slide, the formula in step 1 and the $-\bar{\mathbf{x}}$ in step 3 are marked in red, the same color as PCA in the title, meaning these two places belong to PCA only:

1. Let $\bar{\mathbf{x}} = \frac{1}{N}\sum_{n=1}^{N}\mathbf{x}_n$, and replace each $\mathbf{x}_n$ with $\mathbf{x}_n - \bar{\mathbf{x}}$.
2. Calculate the $\tilde{d}$ top eigenvectors $\mathbf{w}_1, \mathbf{w}_2, \dots, \mathbf{w}_{\tilde{d}}$ of $\mathrm{X}^\top\mathrm{X}$.
3. Return the feature transform $\boldsymbol{\Phi}(\mathbf{x}) = \mathrm{W}(\mathbf{x} - \bar{\mathbf{x}})$.

Without the red parts (no mean subtraction) it is the linear autoencoder; with them it is principal component analysis (PCA) from statistics.

One thing to watch in how step 3 is written. By the definition on page 18, $\mathrm{W}$ is a $d \times \tilde{d}$ matrix, and what encodes a $d$-dimensional $\mathbf{x}$ into $\tilde{d}$ dimensions is $\mathrm{W}^\top\mathbf{x}$. What Lin says aloud in the lecture is also that the data is transformed through the transpose of $\mathrm{W}$ before being sent out. So the $\mathrm{W}(\mathbf{x} - \bar{\mathbf{x}})$ of page 22 has to be read as the matrix whose rows are the $\mathbf{w}_j$; in the notation of page 18 it is $\boldsymbol{\Phi}(\mathbf{x}) = \mathrm{W}^\top(\mathbf{x} - \bar{\mathbf{x}})$.

The handout then contrasts the objectives of the two:

- Linear autoencoder: maximize $\sum(\text{magnitude after projection})^2$.
- PCA: maximize $\sum(\text{variance after projection})$.

The lecture's explanation: variance is the squared gap from the mean, so shifting the data to have the zero vector as its mean and then applying the linear autoencoder naturally gives the directions with the largest variance after projection. Once the directions are found, Lin says there are two ways to use them: project the raw data onto these directions directly, or return the result of subtracting the mean and then projecting, which amounts to shifting the data first and projecting second. The red $-\bar{\mathbf{x}}$ in step 3 writes the latter.

This article writes the relation between those two lines as a formula. For any unit vector $\mathbf{v}$, write the projected value as $p_n = \mathbf{v}^\top\mathbf{x}_n$, whose mean is $\bar{p} = \mathbf{v}^\top\bar{\mathbf{x}}$. Write $p_n$ as $(p_n - \bar{p}) + \bar{p}$, square, and sum; the cross term $2\bar{p}\sum_n(p_n - \bar{p})$ is 0:

$$
\sum_{n=1}^{N}(\mathbf{v}^\top\mathbf{x}_n)^2 = \underbrace{\sum_{n=1}^{N}\big(\mathbf{v}^\top(\mathbf{x}_n - \bar{\mathbf{x}})\big)^2}_{N \times \text{variance after projection}} + \underbrace{N\,(\mathbf{v}^\top\bar{\mathbf{x}})^2}_{\text{part due to the mean}}
$$

The linear autoencoder maximizes the whole left side, and PCA maximizes only the first term on the right. When the mean of the data is the zero vector the second term vanishes and the two coincide; when the mean is far from the origin the second term dominates, and the direction the linear autoencoder picks is pulled towards where the mean lies.

**Worked example (made up for this article).** Add $(2, -2)$ to each of the four points above:

$$
(4, -1),\quad (3, 0),\quad (0, -3),\quad (1, -4)
$$

The points keep their positions relative to one another, and the mean becomes $\bar{\mathbf{x}} = (2, -2)$.

- **Without subtracting the mean (linear autoencoder).** $\mathrm{X}^\top\mathrm{X} = \begin{bmatrix} 26 & -8 \\ -8 & 26 \end{bmatrix}$, the eigenvalues are 34 and 18, and the largest goes with $\frac{1}{\sqrt{2}}(1, -1)$. The projected values of the four points along this direction are $\frac{5}{\sqrt{2}}, \frac{3}{\sqrt{2}}, \frac{3}{\sqrt{2}}, \frac{5}{\sqrt{2}}$, whose squares sum to 34, with a variance of only 0.5. The reconstruction error is 4.5 per point.
- **Subtracting the mean first (PCA).** After subtraction these are the original four points, the direction is $\frac{1}{\sqrt{2}}(1, 1)$, the projected values are $\pm\frac{3}{\sqrt{2}}$, and the variance is 4.5. Reconstructing with $\bar{\mathbf{x}} + \mathbf{w}\mathbf{w}^\top(\mathbf{x} - \bar{\mathbf{x}})$, the error is 0.5 per point.

Check the first case with the identity above: $34 = 4 \times 0.5 + 4 \times (\mathbf{v}^\top\bar{\mathbf{x}})^2 = 2 + 4 \times 8$. Of the 34, 32 comes from the mean and only 2 from the variation in the data itself. Without mean subtraction, the chosen direction points at the mean of the data, and the direction along which the data actually spreads, $(1, 1)$, is not chosen.

The handout closes by saying both are useful for linear dimension reduction, which is useful for data processing, though PCA is more popular. In the lecture, Lin says PCA has a statistical background, which is why it is better known, and gives a use: when data in 10,000 dimensions is too heavy to compute with, reduce it linearly to 300 dimensions first and then do the rest.

### Fun Time: what the optimal objective value is

**Question (page 23):** When solving the optimization problem

$$
\max_{\mathbf{v}}\ \sum_{n=1}^{N}\mathbf{v}^\top\mathbf{x}_n\mathbf{x}_n^\top\mathbf{v}\qquad \text{subject to}\quad \mathbf{v}^\top\mathbf{v} = 1
$$

we know that the optimal $\mathbf{v}$ is the 'topmost' eigenvector that corresponds to the 'topmost' eigenvalue $\lambda$ of $\mathrm{X}^\top\mathrm{X}$. Then, what is the optimal objective value of the optimization problem?

1. $\lambda^1$
2. $\lambda^2$
3. $\lambda^3$
4. $\lambda^4$

**Answer: 1.** The handout's solution: the objective value is simply $\mathbf{v}^\top\mathrm{X}^\top\mathrm{X}\mathbf{v}$, which is $\lambda\mathbf{v}^\top\mathbf{v}$, and $\mathbf{v}^\top\mathbf{v}$ is 1. Written out in full: $\mathrm{X}^\top\mathrm{X}\mathbf{v} = \lambda\mathbf{v}$, and multiplying both sides on the left by $\mathbf{v}^\top$ gives $\mathbf{v}^\top\mathrm{X}^\top\mathrm{X}\mathbf{v} = \lambda\mathbf{v}^\top\mathbf{v} = \lambda$. In the lecture, Lin adds that this is why we choose the $\mathbf{v}$ with the largest $\lambda$.

The other choices all multiply in extra factors of $\lambda$. A check from this article with the four-point example: for $\mathbf{v} = \frac{1}{\sqrt{2}}(1, 1)$ the objective value is the sum of squares of the four projected values, $4 \times 4.5 = 18$, which is $\lambda_1 = 18$ and not $18^2 = 324$.

The summary on page 24 gives each of the four sections one line: the deep neural network is a difficult hierarchical feature extraction problem; the autoencoder is unsupervised NNet learning of representation; the denoising autoencoder uses noise as hints for regularization; PCA is a linear autoencoder variant for data processing. The preview of the next lecture is extracting 'prototype' instead of pattern. In the lecture, Lin says these two lectures were about extracting features layer by layer, and the next one takes a different approach, finding some representatives in the data.

## Self-check

**1. Four two-dimensional examples $(3, 1)$, $(1, 3)$, $(-1, -3)$, $(-3, -1)$ have the zero vector as their mean. With $\tilde{d} = 1$, compute by hand the optimal $\mathbf{w}$, the encoding and reconstruction of $(3, 1)$, and $E_{\text{in}}$.**

Answer: $\mathrm{X}^\top\mathrm{X} = \begin{bmatrix} 20 & 12 \\ 12 & 20 \end{bmatrix}$, and the eigenvalues are $20 \pm 12$, that is, 32 and 8. The largest goes with $\mathbf{w} = \frac{1}{\sqrt{2}}(1, 1)$. The encoding of $(3, 1)$ is $\mathbf{w}^\top\mathbf{x} = \frac{4}{\sqrt{2}} = 2\sqrt{2} \approx 2.828$, the reconstruction is $(2, 2)$, and the error is $1 + 1 = 2$. $E_{\text{in}} = \lambda_2 / N = 8/4 = 2$.

**2. A 400-50-10-1 network is to be pre-trained layer by layer with autoencoders. What is the training data of the second autoencoder? What is its structure, how many weights does it have, and how many are kept? Under the Fun Time assumption, how many seconds does pre-training take in total?**

Answer: the training data is the outputs $\mathbf{x}_n^{(1)}$ of the $N$ examples after passing through the first layer (already pre-trained and fixed), 50 dimensions each, with no labels needed. The structure is 50-10-50, with $51 \times 10 = 510$ encoding weights and $11 \times 50 = 550$ decoding weights, 1060 in all, of which 510 are kept as $w^{(2)}$. The total time is $c(400 \times 50 + 50 \times 10 + 10 \times 1) = 20510c$ seconds.

**3. Why does the linear autoencoder assume $\tilde{d} < d$? If $\tilde{d} = d$, what is the optimal $E_{\text{in}}$, and what has been learned?**

Criterion: the answer should say that when $\tilde{d} = d$ one can take $\mathrm{W}$ to be an orthogonal matrix (for example $\mathrm{I}$), so that $\mathrm{W}\mathrm{W}^\top = \mathrm{I}$ and $E_{\text{in}} = 0$; in the language of $\Gamma$, all $d$ positions on the diagonal can hold a 1, and $\mathrm{I} - \Gamma$ is all 0. This solution holds for any data and uses no structure in the data, so nothing has been learned.

**4. One-dimensional data $x \in \{-1, 1\}$; give each example two noisy versions $\tilde{x} = x \pm 0.5$, and use $g(\tilde{x}) = a\tilde{x}$ as a denoising autoencoder. What is the optimal $a$? How does it differ from the case without noise?**

Answer: the four training examples are $(-1.5, -1)$, $(-0.5, -1)$, $(0.5, 1)$, $(1.5, 1)$. $\sum\tilde{x}x = 1.5 + 0.5 + 0.5 + 1.5 = 4$, $\sum\tilde{x}^2 = 2.25 + 0.25 + 0.25 + 2.25 = 5$, and $a = 4/5 = 0.8$. Checking with the penalty form: the mean of $x^2$ is 1, the noise variance is 0.25, the average error is $(a-1)^2 + 0.25a^2$, and differentiating gives $a = 1/1.25 = 0.8$. Without noise, $a = 1$; with noise the weight shrinks, by an amount set by the variance of the noise.

**5. $d = 3$, $\tilde{d} = 2$, and some fixed $\mathrm{V}$ gives $c_1 = 7$, $c_2 = 5$, $c_3 = 1$. What is the optimal $\Gamma$? What is $\sum_n \lVert\mathbf{x}_n - \mathrm{W}\mathrm{W}^\top\mathbf{x}_n\rVert^2$ then? What if $\Gamma = \text{diag}(0.5, 1, 0)$ is used instead?**

Answer: at most two positions may be non-zero; put them where $c_j$ is largest and set them to 1, so $\Gamma = \text{diag}(1, 1, 0)$. The total error is $\sum_j (1 - \gamma_j)^2 c_j = 0 + 0 + 1 = 1$. With $\text{diag}(0.5, 1, 0)$ it is $0.25 \times 7 + 0 + 1 = 2.75$, which is worse: as soon as a kept component is scaled, extra error appears.

## Exercises and corresponding reading

**The corresponding weeks in two semesters.**

| Edition | Week | Slides | LFD (as marked on the course page) |
|---|---|---|---|
| MOOC | Techniques Lecture 13 | 213 | not marked |
| [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) | W13 (11/25), the same week as Techniques Lecture 12 | [213u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/213u_handout.pdf) | e-7.6 |
| [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) | W15 (12/16), scheduled after the final exam in W14 | 213u still returned 404 on 2026-09-30 and was not yet public | same as above |

**Textbook.** e-Chapter 7 of [Learning from Data](http://amlbook.com) (LFD) is an online chapter of the textbook and is not in the printed book; see amlbook.com for how to get it.

**Homework.** The homework for this week is [Fall 2024 HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf) (released 2024-12-02, due 12-16). The related problems this series has written up are Q4, Q9, and bonus Q13, all three of which practice the previous lecture's content (number of weights, initial values, XOR); the explanation is in [Techniques Lecture 12: Neural Networks](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning-en). The guide to the whole assignment is in [Techniques Homework and Final Project](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en).

**Hands-on.** Take a small data set and compute the first two principal components with both numpy's `np.linalg.eigh(X.T @ X)` and scikit-learn's `PCA`, and see how much subtracting the mean or not changes the result. That is the difference made by step 1 on page 22 of the handout, and this article's example shifted by $(2, -2)$ can serve as test data for checking your answer.

**What came after this lecture.** Layer-wise pre-training was the practice at the time of these recordings. Lin added two modern deep learning slide decks, 302u and 303u, in Fall 2024, which this series covers in [Techniques Lecture 16: Finale](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning-en).

**Further reading.** The following articles on this site overlap with this lecture and offer another way of explaining it:

- [Harvard CS181 HW4: Autoencoders and VAEs](/posts/tech/2026-09-29-harvard-cs181-hw4-autoencoder-vae-en): an assignment from another school with the autoencoder as its topic.
- [Reading CMU 11-785 Deep Learning](/posts/ai/2026-08-22-cmu-11785-course-overview-en): a whole course devoted to deep learning.
- [Reading Stanford CS230](/series/cs230): leans toward the practice of deep learning projects.
- [Reading MIT 6.7960](/posts/ai/2026-08-26-mit-67960-deep-learning-guide-en): graduate-level deep learning.
- [Reading NTU Hung-yi Lee Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en): the parallel track at NTU, leaning toward deep learning and generative AI.

**Next lecture.** [Techniques Lecture 14: RBF Networks](/posts/ai/2026-09-30-ntu-htlin-ml-rbf-network-matrix-factorization-en) extracts features in a different way, finding representative points (prototypes) in the data and using "how close to a prototype" as the feature.

## Course video sources

Original videos: [Deep Neural Network](https://www.youtube.com/watch?v=H1czfox0Nog), [Autoencoder](https://www.youtube.com/watch?v=eBVPQ4fgs_k), [Denoising Autoencoder](https://www.youtube.com/watch?v=gx2Vfw8S--0), [Principal Component Analysis](https://www.youtube.com/watch?v=Bgc4UY8567A)

- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-13: Split out from the combined article and rewritten from the handout and the video transcripts.

## References

- [Techniques Lecture 13 handout, 213_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/213_handout.pdf): the main source for this article. The content of the four sections, the derivation of the linear autoencoder, the four Fun Time questions, and the figures on each page all come from this handout.
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the W13 schedule, the 213u slides, and the LFD e-7.6 marking.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the W14 final exam and the W15 schedule.
- [Fall 2024 Homework 7 (hw7.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf): the homework for this week.
- [Learning from Data textbook website](http://amlbook.com): the source of e-Chapter 7.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
