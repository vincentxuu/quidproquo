---
title: "Neural Networks — Backpropagation, TensorFlow/Keras, CNN & Traffic Sign Classification | Harvard CS50 AI Week 5"
date: 2026-08-30
category: tech
type: guide
tags: [harvard-cs50ai, ai, neural-networks, backpropagation, tensorflow, keras, cnn, traffic, python, cs50]
lang: en
series:
  name: "Reading Harvard CS50 AI"
  order: 6
tldr: "Week 5 is about neural networks: a unit multiplies its inputs by weights, adds a bias and applies an activation function; gradient descent adjusts the weights one small step at a time, and backpropagation passes the error back so hidden layers can be trained; for images, convolution and pooling come first and an ordinary network follows, which is a CNN; for sequences, an RNN feeds its output back into itself. With time links for every section, plus the approach, common mistakes and checks for the Traffic project."
description: "Guide to Harvard CS50 AI Week 5 Neural Networks, written section by section from the captions of the 2020 lecture recording: units and activation functions, computing OR and AND with one unit, gradient descent and mini-batches, the linear-separability limit of the perceptron, hidden layers and backpropagation, dropout, TensorFlow Playground and the Keras examples, image convolution, max-pooling, CNNs and RNNs, each with a clickable time link and a self-check, plus the spec, approach, pseudocode, common mistakes and checks for the Traffic project, with the full reference implementation folded at the end. Project specs current as of 2026."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks)

**Video status: Videos included.** The lecture runs 1:41:19. The "Lecture walkthrough" below is written section by section from the recording's English captions, and each section opens with a time link that moves the player on this page to that point. The lecture does not cover this week's project; that section follows the course website. The project's full reference implementation is hidden by default, folded at the end of the project section. [Jump to the player](#lecture-video--timestamps) | [Source details](#course-video-sources)

> ⚠️ **Version note**: This week's lecture videos were **recorded in Spring 2020**; project specs, distribution code, and check50 slugs follow the course website as of 2026 (i.e., `ai50/projects/2024/x/...`).

## TL;DR

Week 5 picks up from last week's linear classifier: draw "multiply the inputs by weights, add a bias, apply an activation function" as one unit, and many units wired together make a neural network. The weights are adjusted by gradient descent. A single unit can only draw a straight line as its boundary, so hidden layers go in the middle, and their weights are trained with backpropagation. The second half of the lecture handles two special kinds of input: for images, convolution and pooling extract features first (a CNN); for sequences of varying length, a recurrent neural network (RNN) feeds its output back into itself. The Traffic project has you train a CNN to recognize 43 kinds of traffic signs.

The article has two halves. The first, "Lecture walkthrough", follows the recording; the second covers the Traffic project, which the lecture does not mention.

## Lecture Video & Timestamps

The recording runs 1 hour 41 minutes, and the ten sections of "Lecture walkthrough" below cover all of it in order. Every time link, at the top of a section or inside the text, moves the player on this page to that point, so when a section does not make sense you can go straight back and listen.

```youtube
url: https://www.youtube.com/watch?v=J1QD9hLDEDY
title: Neural Networks - Lecture 5 - CS50's Introduction to Artificial Intelligence with Python 2020
```

YouTube: [Week 5 Neural Networks (2020 recording)](https://www.youtube.com/watch?v=J1QD9hLDEDY)

> Timing note: the times below were checked against the timecoded English captions (2026-10-13) and mark where the lecturer starts each topic; they are not official chapters. This table describes only the 2020 recording; the current course version may differ in content and order, and the video itself does not introduce this week's project.

| Time (click to play from there) | Content |
|---|---|
| [0:00–15:24](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=0s) | From biological neurons to units: weights, bias, activation functions, and computing OR and AND with one unit |
| [15:24–21:27](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=924s) | Gradient descent and its stochastic and mini-batch variants |
| [21:27–30:00](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=1287s) | Networks with several outputs; a perceptron can only learn a linearly separable boundary |
| [30:00–38:52](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=1800s) | Hidden layers, backpropagation, deep neural networks, overfitting and dropout |
| [38:52–45:50](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=2332s) | TensorFlow Playground: each hidden unit learns one boundary |
| [45:50–53:01](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=2750s) | `banknotes.py`: training a counterfeit-detecting network with Keras |
| [53:01–1:05:51](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=3181s) | Computer vision: the problems with images as input, image convolution and kernels |
| [1:05:51–1:14:28](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=3951s) | Pooling and the structure of a convolutional neural network (CNN) |
| [1:14:28–1:26:03](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=4468s) | `handwriting.py`: recognizing MNIST handwritten digits with a CNN |
| [1:26:03–1:41:19](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=5163s) | The limits of feed-forward networks, recurrent neural networks and the wrap-up |

> Official notes and slides: [Week 5 Notes](https://cs50.harvard.edu/ai/2020/notes/5/)

## Lecture walkthrough

What follows is written section by section from the recording's English captions. Captions alone do not show the slides, so this article does not reconstruct the network diagrams, the scatter of data points or the Playground screen; it reports only the numbers and reasoning the lecturer says aloud. The figures for convolution, pooling and the CNN structure are in the [official notes](https://cs50.harvard.edu/ai/2020/notes/5/). The two Keras excerpts come from the lecture source code on the course website, and anything in them the lecturer does not read out is flagged. The self-check at the end of each section is my own question, not lecture content. Where a question reuses a lecture example it says so; where it is marked "my own", the example is mine as well.

On wording: the lecturer calls the small building block of a network a unit, a node and a neuron interchangeably. This article says unit throughout.

### What one unit computes

[Recording 0:00–15:24](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=0s)

The lecturer, Brian Yu, starts with where neural networks come from: as early as the 1940s, researchers were asking whether the way the human brain learns could be carried over to computers. He mentions two properties scientists observed in biological neural networks: neurons are connected to each other and pass electrical signals along; and a neuron processes the signals it receives, becomes activated at some point, and then propagates signals onward. An artificial neural network is a mathematical model inspired by that structure. Its building blocks are called **units**, and units are connected by edges. The lecturer says every neural network is really just a mathematical function mapping inputs to outputs, and learning means finding that function's parameters.

He then ties this back to last week. Last week's task was to predict rain from two weather variables `x₁` and `x₂`, and the hypothesis function was a linear combination of the inputs:

```text
h(x₁, x₂) = w₀ + w₁·x₁ + w₂·x₂
```

`w₁` and `w₂` are **weights**, each multiplied by one input. `w₀` is not multiplied by any input; it moves the whole result up or down. You can think of it as multiplied by a constant 1, and the literature often calls it the **bias**. The lecturer says you will run into both names.

The resulting number still has to become "rain" or "no rain", and that step belongs to the **activation function**. The lecture mentions three:

| Name | What it does |
|---|---|
| Step function | Outputs 1 if the weighted result is at least 0, otherwise 0 |
| Logistic sigmoid | An S-shaped curve that outputs a real number between 0 and 1, readable as a probability (0.5 or 0.8, say) |
| ReLU (rectified linear unit) | Takes the larger of the input and 0: positive values pass through, negative values become 0 |

The whole thing in one sentence: compute a linear combination of the inputs, then apply some function `g`. Drawn as a picture, it is the simplest neural network: two input units, each connected by a weighted edge to one output unit; the output unit multiplies each input by its weight, adds the bias and applies the activation function.

The lecturer uses logic operations to show the structure really computes something ([9:26](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=566s)). For OR, set both weights to 1, the bias to −1, and use the step function:

| `x₁` | `x₂` | Weighted sum plus bias | Output |
|---|---|---|---|
| 0 | 0 | 0 + 0 − 1 = −1 | 0 (short of the threshold) |
| 1 | 0 | 1 + 0 − 1 = 0 | 1 (exactly at the threshold) |
| 1 | 1 | 1 + 1 − 1 = 1 | 1 |

All three rows match the truth table of OR. For AND ([12:09](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=729s)), keep the weights and change only the bias to −2: with inputs 1 and 1, 1 + 1 − 2 = 0, exactly at the threshold, so the output is 1; with inputs 1 and 0, 1 + 0 − 2 = −1, so the output is 0.

Give the inputs and output a different meaning and the same structure applies to other problems: from humidity and pressure, compute the probability of rain; from advertising spend and the month, predict that month's sales (a regression). Nor are inputs limited to two. With five inputs, multiply each of `x₁` through `x₅` by its own weight, add them all up, and add the bias at the end.

**Check yourself. Write your answer down before opening the fold.** Keep both weights at 1 and the step function as the activation function, and change the bias to −1.5. What is the output for each of the four inputs? Does this unit compute OR or AND? (my own)

<details>
<summary>Answer</summary>

(0, 0): 0 + 0 − 1.5 = −1.5, output 0. (1, 0) and (0, 1): 1 − 1.5 = −0.5, output 0. (1, 1): 2 − 1.5 = 0.5, output 1. The output is 1 only when both inputs are 1, so this is AND.

The lecture's AND uses a bias of −2, and −1.5 works too, so more than one set of weights computes the same function. Any bias from −2 (inclusive) up to −1 (exclusive) computes AND: (1, 1) must output 1, which needs `2 + b ≥ 0`, and (1, 0) must output 0, which needs `1 + b < 0`. That last sentence is my own inference.

</details>

### Gradient descent: letting the computer find the weights

[Recording 15:24–21:27](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=924s)

OR and AND are simple enough that the weights can just be stated. Predicting sales or rainfall cannot be done by thinking it through; the computer has to work out what the weights should be. The method the lecturer introduces is **gradient descent**, an algorithm for minimizing loss when training a neural network.

Loss is last week's idea: a number saying how badly a hypothesis performs on the data. A loss function is a mathematical function, so you can compute its **gradient**. The lecturer says to think of the gradient as a slope: it tells you which way the loss is moving at the current setting of the weights, and therefore which way to move the weights to make the loss smaller. He says outright that he will not go into the calculus.

The procedure:

1. Start with a random choice of weights.
2. Repeat these two steps:
   - Calculate the gradient based on **all data points**.
   - Update the weights by a small step according to the gradient.

How big a step to take is yours to choose; the lecturer does not give that quantity a name. Repeat enough times and the weights gradually get better, or in his words, "at least that's what we would hope to happen".

Then he asks which part of this algorithm is expensive. The answer is the words "all data points". With a lot of data, every small step requires a pass over all of it, and there are many steps. Hence two faster variants:

- **Stochastic gradient descent** ([19:33](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=1173s)): pick one data point at random each time, and compute the gradient and update the weights from that one point. The gradient estimate is less accurate, but far faster to compute.
- **Mini-batch gradient descent** ([20:39](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=1239s)): the middle ground. Divide the data into small batches and compute the gradient from one batch at a time. You decide the batch size. It is more accurate than a single point without needing all the data every time.

**Check yourself. Write your answer down before opening the fold.** You have 10,000 training examples. In one pass over all of them, how many times are the weights updated by standard gradient descent, by stochastic gradient descent, and by mini-batch gradient descent with batches of 100? (my own)

<details>
<summary>Answer</summary>

Standard gradient descent updates once, after seeing all 10,000. Stochastic updates after every example, 10,000 times. Mini-batch updates once per 100 examples, 10,000 ÷ 100 = 100 times.

For the same single pass over the data the update counts differ by a factor of ten thousand, and the price is that each update rests on a rougher gradient. That is how the lecture describes mini-batch: some of each, more accurate than a single point and faster than the full data set.

</details>

### Several outputs, and the limit of one unit

[Recording 21:27–30:00](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=1287s)

Every network so far has had a single output. Units can be added to the output layer just as they can to the input layer. To keep the two layers "fully connected" (every input connected to every output), more weights are needed: with four outputs, each input unit carries four weights.

Several outputs are what multi-class classification needs. Weather is not just rain or no rain; it can be split into rain, sun, cloud and snow, with each of the four outputs standing for the probability of one category. The lecturer's example outputs are 10% (rain), 60% (sun), 20% (cloud) and 10% (snow); the highest is sun, so the prediction is sunny.

The same structure works for reinforcement learning: the inputs carry information about the current state, the four outputs correspond to the four available actions, and you take the action with the best value. The lecturer's summary is that anything that can be framed as a mathematical function is something this structure can attempt to model.

How is such a network trained? The lecturer says that when the inputs are connected directly to the outputs, four outputs can be treated as four independent networks: each output has its own set of weights and shares the same three inputs, so they can be trained separately. There may be one extra step at the end to turn the four values into a probability distribution.

Then the limitation ([28:18](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=1698s)). A single unit making a binary classification is called a **perceptron**. It compares a linear combination of the inputs with a threshold, so its decision boundary can only be a straight line, and it can only handle data that is **linearly separable**. The lecturer's counterexample is one class of points surrounded by the other inside a circle: no straight line separates the two. A perceptron can give probabilities according to how close a point is to the boundary, but the boundary itself is still a line. Real-world data is often not linearly separable.

**Check yourself. Write your answer down before opening the fold.** XOR outputs 1 when exactly one of its two inputs is 1, and 0 otherwise. Can the kind of unit from the first section (two weights `w₁` and `w₂`, a bias `b`, the step function) compute XOR? (my own)

<details>
<summary>Answer</summary>

No. Write down what the four inputs require:

- (0, 0) must output 0: `b < 0`
- (1, 0) must output 1: `w₁ + b ≥ 0`
- (0, 1) must output 1: `w₂ + b ≥ 0`
- (1, 1) must output 0: `w₁ + w₂ + b < 0`

Adding the second and third gives `w₁ + w₂ + 2b ≥ 0`, that is, `w₁ + w₂ + b ≥ −b`. The first says `−b > 0`, so `w₁ + w₂ + b > 0`, which contradicts the fourth. No set of weights satisfies all four conditions, and that is what "not linearly separable" means: the two points that should output 1 and the two that should output 0 cannot be split by one straight line. The lecture does not mention XOR; its example is the points inside and outside a circle.

</details>

### Hidden layers, backpropagation and dropout

[Recording 30:00–38:52](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=1800s)

The solution is the **multilayer neural network**: besides the input layer and the output layer, one or more **hidden layers** in between. The lecturer's example has three inputs and one output, with a hidden layer of four units inserted in the middle. The inputs are no longer connected directly to the output. They connect to every unit in the hidden layer, and the hidden units connect to the output.

The computation happens in two stages. Each hidden unit computes its own value from a linear combination of the inputs (the lecturer says this value is also called its activation); the output unit then multiplies those four values by their weights to get the final result. The benefit is that each hidden unit can learn a different decision boundary, and the boundaries can then be combined.

The problem is how to train it. The training data says what the inputs are and what the output should be, but not what the values of the units in the middle should be, so there is no way to compute how far off each one is. The lecturer says this is where the name "hidden" comes from.

The idea that solves it ([32:58](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=1978s)): the error at the output unit is known. From the sizes of the weights leading into the output, you can estimate how much of that error is due to each unit in the hidden layer. Passing the error back this way is **backpropagation**. Again the lecturer skips the calculus and gives only the procedure:

1. Start with a random choice of weights.
2. Repeat:
   - Calculate the error for the output layer.
   - Starting with the output layer and moving back, layer by layer, to the earliest hidden layer: propagate the error back one layer, then update that layer's weights.

The lecturer calls backpropagation the key algorithm that makes neural networks possible. There can be more than one hidden layer, and a network with several is a **deep neural network**; "deep learning" means using multiple layers to learn higher-level features of the input.

The more complex the model, the greater the risk of **overfitting**: fitting the training data too closely and failing on other data. The lecturer says that in a network with many units, what typically happens is over-reliance on a few of them. A popular technique against it is **dropout** ([37:18](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=2238s)): during training, temporarily remove a randomly chosen fraction of the units, as though they and their weights were not there; at the next weight update, drop a different set. A network trained this way does not rely too heavily on any one unit.

**Check yourself. Write your answer down before opening the fold.** The lecture's network has three inputs, one hidden layer of four units and one output, with adjacent layers fully connected. Not counting biases, how many weights are there? For which units does the training data directly give the correct value?

<details>
<summary>Answer</summary>

Input to hidden is 3 × 4 = 12, hidden to output is 4 × 1 = 4, so 16 in all. If each hidden unit and the output unit also has a bias, that is 5 more, 21 in total; the lecture does not mention biases in this passage, so that part follows the definition from the first section.

The training data gives the values of the three inputs and the value the one output should have. What the four hidden units should be is not in the data, so their error can only be estimated back from the output's error through the weights, which is what backpropagation does.

</details>

### TensorFlow Playground: each hidden unit learns one boundary

[Recording 38:52–45:50](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=2332s)

Turning these ideas into code does not require implementing backpropagation yourself; there are libraries for it. The lecturer uses TensorFlow, developed by Google. Before writing any code he opens TensorFlow Playground, a web page where you can change a network's structure in the browser and watch it train. The task is to separate orange points from blue points on a plane, and the input features are each point's x and y coordinates. He tries three data sets in turn.

**First: two groups of points that a single straight line can separate.** With no hidden layer, he presses Play and the network quickly learns a line as the boundary; the training loss drops to 0.

**Second: blue points in two quadrants, orange points in the other two** ([40:58](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=2458s)). No single straight line separates them.

| Units in the hidden layer | What the lecturer sees |
|---|---|
| 0 (no hidden layer) | No usable separation |
| 2 | Somewhat better: some regions are definitely blue and some definitely orange, but the points at the top are still unclear |
| 3 | Better than with two |
| 4 | Better still |

With two units, the lecturer looks at each one in turn to see what it has learned: the first has learned a line that separates some of the blue points from the rest, and the second a line that separates the orange points in the lower right. The output then combines these boundaries. The thickness of the connecting lines on screen shows how large the weights are.

**Third: blue points inside a circle, orange points outside** ([44:01](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=2641s)). This is exactly the case the perceptron of the previous section cannot handle. With no hidden layer nothing can be classified. Two units learn two lines (the lecturer points out that one is on the right-hand side), and the network's verdict is "blue between the two lines, orange outside them"; the lecturer says it is not great but better than before. With three units, three boundaries combined, the inside and outside of the circle are separated quite accurately.

The lecturer's conclusion: the more units in the hidden layer, the more structure in the data the network can learn, and backpropagation finds what the weights for each boundary should be.

**Check yourself. Write your answer down before opening the fold.** On the third data set, why can two hidden units only give "blue between the two lines" and not enclose a circular region? Why does adding a third make it possible?

<details>
<summary>Answer</summary>

What follows is my own inference; the lecture only shows the result. Each hidden unit, like the unit in the first section, can learn only one straight-line boundary. Two straight lines cannot enclose a closed region: parallel lines bound a strip open at both ends, and non-parallel lines bound a wedge that opens outward, so some orange points outside the circle always fall inside and get counted as blue.

Three straight lines can enclose a closed triangle with the blue points inside. A triangle is not a circle, but it is far closer than an open region.

</details>

### `banknotes.py`: writing the network in Keras

[Recording 45:50–53:01](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=2750s)

The first program uses the banknote data seen last week: four numeric values per banknote and a label saying whether it is authentic or counterfeit. The first half reads the data and splits it into a training set and a testing set, as last week. The second half builds the network, and the excerpt below comes from the lecture source code the course provides:

```python
# Excerpt from banknotes.py (lecture source code, src5.zip)
model = tf.keras.models.Sequential()

# Add a hidden layer with 8 units, with ReLU activation
model.add(tf.keras.layers.Dense(8, input_shape=(4,), activation="relu"))

# Add output layer with 1 unit, with sigmoid activation
model.add(tf.keras.layers.Dense(1, activation="sigmoid"))

# Train neural network
model.compile(
    optimizer="adam",
    loss="binary_crossentropy",
    metrics=["accuracy"]
)
model.fit(X_training, y_training, epochs=20)

# Evaluate how well model performs
model.evaluate(X_testing, y_testing, verbose=2)
```

The lecturer explains it line by line:

- `tf` is the abbreviation from `import tensorflow as tf`. Keras is an API, a set of functions for manipulating neural networks inside TensorFlow.
- `Sequential` means a network of one layer after another.
- `Dense` is a fully connected layer: every unit in it is connected to every unit in the previous layer. The first `Dense` is the hidden layer, with 8 units. The lecturer says he chose 8 arbitrarily.
- `input_shape=(4,)` says the input has four values. The hidden layer's activation function is ReLU.
- The output layer needs only 1 unit, because the only question is authentic or counterfeit; its activation function is the sigmoid, so the output can be read as a probability.
- `compile` asks for three things: which algorithm optimizes the weights, which loss function to use, and which metric to evaluate with. The lecturer says only that he cares about accuracy here and that the first two each have many options; the `adam` and `binary_crossentropy` written in the code are not read out or explained.
- In `fit`, `epochs=20` means going through all the training data 20 times.
- `evaluate` measures performance on the testing data.

When he gets to how many units the hidden layer should have, he adds a paragraph on the trade-off: more units can learn more complex functions, but there are more weights to update, which costs more, and overfitting becomes more likely. In practice you set aside another portion of the data as a **validation set** and use it to compare which number of layers and units works best. Settings like these that you choose yourself are called **hyperparameters**.

The run ([51:13](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=3073s)): accuracy on the training data is about 79% in the first epoch, climbs steadily, and is above 99% after 20 epochs; on the testing data it is 99.8%. The lecturer adds that this is the figure on this particular testing data, and to be confident he would want to test with more.

His summary: the author only defined the structure of the network and the data to pass in, and TensorFlow ran backpropagation.

**Check yourself. Write your answer down before opening the fold.** The network above has four inputs, one hidden layer of 8 units and one output unit. Counting biases as well, how many numbers does training have to learn? (my own)

<details>
<summary>Answer</summary>

Hidden layer: each unit has 4 weights and 1 bias, so 8 × (4 + 1) = 40. Output layer: 1 unit with 8 weights and 1 bias, 9 in all. Total 49.

I built a model with the same structure in TensorFlow 2.21 and `count_params()` also reports 49 (40 and 9 for the two layers). The lecture does not compute this number.

</details>

### Images as input: convolution and kernels

[Recording 53:01–1:05:51](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=3181s)

The second half of the lecture turns to **computer vision**: computational methods for analyzing and understanding images. The lecturer gives three applications: social media sites tagging the faces in a photo with names, self-driving cars working out the color of the light and the cars around them from camera images, and recognizing handwritten digits. The handwritten-digit data set is called MNIST.

A neural network's input can only be numbers, so the first question is how an image becomes numbers. An image is a grid of pixels. In a black-and-white image each pixel is a number from 0 to 255, where 0 is entirely black, 255 is entirely white and the values between are shades of gray, which fits in 8 bits. In a color image each pixel has three numbers: how much red, green and blue.

The most direct approach is to treat every pixel as an input (three for color), connect them to a deep neural network, and have 10 output units for 0 through 9. The lecturer points out two drawbacks ([56:57](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=3417s)):

1. Too many inputs. A big image means many inputs and correspondingly many weights to calculate.
2. Flattening the pixels into one long row throws away the image's structure. A person looking at an image sees curves, shapes and what is in each region, not individual pixels one by one.

The first remedy is **image convolution** ([58:09](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=3489s)): apply a filter to the image that adds each pixel's value to the values of its neighbors, weighted according to a **kernel** matrix, with the aim of extracting useful features from the image.

In practice you place a 3×3 kernel over some 3×3 region of the image, multiply each of the nine pixels by the number in the corresponding position of the kernel, and add everything up to get one number; then slide the kernel one pixel over and do it again. The lecturer demonstrates on a 4×4 image: the top-left 3×3 region gives 10, sliding one to the right gives 20, the next region gives 40, and he does not say the number for the last region aloud. The original numbers of the image and of this kernel are on the slides and in the figure in the [official notes](https://cs50.harvard.edu/ai/2020/notes/5/); they cannot be checked from this text alone. Sweeping a 3×3 kernel over a 4×4 image gives a 2×2 result, and that result is called a **feature map**. He mentions in passing that the kernel could be larger (5×5, for example) and that you could slide by more than one pixel at a time.

Why does this extract features? The lecturer switches to a kernel he calls quite famous ([1:01:35](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=3695s)): 8 in the middle and −1 in all eight surrounding positions.

- All nine pixels in the 3×3 region are 20: 20 × 8 minus eight 20s gives 0.
- The first row is three 20s and the second and third rows are all 50s: the lecturer says the result is 90. The arithmetic is 50 × 8 = 400, minus the three 20s above (60) and the five surrounding 50s (250), 400 − 60 − 250 = 90. That arithmetic is mine; the lecturer only gives the result.

So this kernel outputs something close to 0 when the middle pixel is about the same as its neighbors, and a large number when the middle pixel is very different from them. The edge of an object is exactly where the color changes abruptly, so this filter can be used to detect edges.

He runs it for real with `filter.py` ([1:03:30](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=3810s)): Python's image library, PIL, opens a photo of a bridge, `bridge.png`, the 3×3 kernel is applied, and the output image keeps only the boundaries between the parts of the original. The lecturer says an algorithm trying to tell what an image shows may not care about all the details, and outlines like these could be quite useful. A filter for color images can have a separate kernel each for red, green and blue, with the results summed at the end.

**Check yourself. Write your answer down before opening the fold.** With the lecture's "8 in the middle, −1 around" kernel, compute these two 3×3 regions: (a) 50 in the middle with all eight neighbors 20; (b) all nine pixels 50. Which looks more like a point on an edge? (my own)

<details>
<summary>Answer</summary>

(a) 50 × 8 − 8 × 20 = 400 − 160 = 240. (b) 50 × 8 − 8 × 50 = 0.

In (b) the whole block is equally bright, and whether that is 20 or 50 the result is 0; the kernel does not care how bright the region is. In (a) the middle pixel differs from its neighbors by 30, and the output is 8 × 30 = 240. The size of the output reflects how much the middle differs from its surroundings, so (a) looks more like an edge. In the lecture's example only the neighbors on one side are darker, and the output is 90, smaller than in (a).

</details>

### Pooling and the structure of a convolutional neural network

[Recording 1:05:51–1:14:28](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=3951s)

After convolution the image is still big. Besides the number of inputs, the lecturer points to another problem: we do not really care whether a feature sits in this pixel or the one immediately to its right, only whether it is somewhere in this area.

The remedy is **pooling**: reduce the size of the input by sampling from regions of it. One of the most popular kinds is **max-pooling**, which keeps only the maximum value in each region. The lecturer's example applies a 2×2 max pool to a 4×4 image: the maximum values of the four 2×2 regions are, in order, 50, 110, 20 and 40, so the 4×4 shrinks to 2×2 (the original numbers of that 4×4 image are likewise only on the slides and in the figure in the official notes). There are two benefits: fewer inputs; and it makes no difference which cell of its region the 50 was in, so the analysis is less affected by small shifts in position.

Connect convolution, pooling and the networks from before, and you have a **convolutional neural network** (CNN) ([1:08:18](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=4098s)). The pipeline is:

1. **Convolution**: apply a number of different filters to the input image; each filter produces one feature map.
2. **Pooling**: shrink each feature map. Besides max-pooling there is average-pooling, which takes the average value instead.
3. **Flatten**: lay all the shrunken values out in a single row.
4. Feed them into an ordinary neural network, one input per value, possibly with hidden layers in between.

One point matters here: the numbers in the filters do not have to be specified by hand. Just as the network learns the weights between units, the values in the kernels can be trained the same way, with the same goal of minimizing the loss.

Convolution and pooling can also be applied more than once ([1:11:46](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=4306s)). The division of labor the lecturer describes: the first round learns low-level features such as edges, curves and shapes; the second round looks in those results for higher-level features such as objects, the eyes in facial recognition, or the curves of a handwritten digit.

He ends by saying a CNN is not strictly required for analyzing images; an ordinary layer-after-layer network could do it. What makes CNNs helpful is that they are closer to how a person looks at an image: a person does not stare at every pixel at once, and convolution likewise looks at regions of the image, extracts features from them and combines them.

**Check yourself. Write your answer down before opening the fold.** Apply 2×2 max-pooling to the 4×4 image below. What is the result? If the 9 in the bottom-left region moves up one cell (swapping with the 0 above it), does the result change? (my own)

```text
1 3 2 0
5 2 4 8
7 0 1 1
6 9 3 2
```

<details>
<summary>Answer</summary>

The four regions are top-left (1, 3, 5, 2), top-right (2, 0, 4, 8), bottom-left (7, 0, 6, 9) and bottom-right (1, 1, 3, 2), with maximum values 5, 8, 9 and 3, so the result is:

```text
5 8
9 3
```

Moving the 9 up one cell makes the bottom-left region 7, 9, 6, 0, whose maximum is still 9, so the result is exactly the same. This is the second benefit the lecture describes: a feature that shifts by one cell within a region looks no different after pooling. If it moved out of its 2×2 region, the result would change.

</details>

### `handwriting.py`: recognizing handwritten digits with a CNN

[Recording 1:14:28–1:26:03](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=4468s)

The second program writes the previous section's structure as code, using the MNIST data set built into TensorFlow. After loading the data it does some reshaping, of which the lecturer mentions only one item: dividing the pixel values by 255 to go from the 0-to-255 range to 0-to-1, which is easier to train on. Below is the part that builds the model, taken from the lecture source code:

```python
# Excerpt from handwriting.py (lecture source code, src5.zip)
model = tf.keras.models.Sequential([

    # Convolutional layer. Learn 32 filters using a 3x3 kernel
    tf.keras.layers.Conv2D(
        32, (3, 3), activation="relu", input_shape=(28, 28, 1)
    ),

    # Max-pooling layer, using 2x2 pool size
    tf.keras.layers.MaxPooling2D(pool_size=(2, 2)),

    # Flatten units
    tf.keras.layers.Flatten(),

    # Add a hidden layer with dropout
    tf.keras.layers.Dense(128, activation="relu"),
    tf.keras.layers.Dropout(0.5),

    # Add an output layer with output units for all 10 digits
    tf.keras.layers.Dense(10, activation="softmax")
])
```

Unlike `banknotes.py`, there is no `model.add` layer by layer; all the layers go into a list handed to `Sequential`. What each layer means:

- `Conv2D(32, (3, 3), ...)`: a convolutional layer that learns 32 filters, each a 3×3 kernel. (The lecturer first says 13 by mistake and corrects himself to 32 at once.)
- `input_shape=(28, 28, 1)`: every MNIST image is 28×28 pixels with a single channel, because it is black and white. A color image would have three channels: red, green and blue.
- `MaxPooling2D(pool_size=(2, 2))`: 2×2 max-pooling.
- `Flatten()`: flatten.
- `Dense(128, ...)`: a hidden layer of 128 units.
- `Dropout(0.5)`: during training, randomly drop half the units in this layer to prevent overfitting. The lecturer says adding dropout in TensorFlow takes a single line.
- `Dense(10, activation="softmax")`: an output layer of 10 units, one per digit. The **softmax** activation function turns the output into a probability distribution.

Then come `compile`, `fit` and `evaluate` as before. This program has one extra step: if a filename is given on the command line, `model.save` writes the trained model to a file. Training takes time, and saving the values of the weights and filters means later predictions do not need retraining.

The run ([1:20:28](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=4828s)): the training data has 60,000 handwritten digits, gone through 10 times. Training accuracy is about 92% after the first pass, then 96% or 97%, about 98% around the eighth pass, and levels out after that. On the 10,000 testing samples it ends at 98.8%. While waiting, the lecturer makes two remarks: training neural networks takes a lot of computational power, which is why people use GPUs; and more data generally means better training. He also reminds the audience that this training learns the kernels for the convolution step as well as the weights.

Finally he uses another program written with PyGame, `recognition.py`, to load a model trained in advance ([1:23:34](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=5014s)). He draws a 2 on screen, presses Classify, and the program answers 2; he draws an 8 and it answers 8. His point is that handling these pixels with a pile of if-then rules would be close to impossible to write, since everyone draws an 8 differently; here the network was given only its structure and the training data, and learned the rest itself.

**Check yourself. Write your answer down before opening the fold.** A 28×28×1 image goes through the model above. What shape does it have after `Conv2D`, after `MaxPooling2D` and after `Flatten`? Hint: two sections back, sweeping a 3×3 kernel over a 4×4 image gave 2×2. (my own)

<details>
<summary>Answer</summary>

`Conv2D`: across a width of 28 a 3×3 kernel has 28 − 3 + 1 = 26 positions (the same formula as 4 − 3 + 1 = 2), and the height is 26 as well. There are 32 filters, so there are 32 feature maps and the shape is 26×26×32.

`MaxPooling2D`: one value per 2×2 region halves the width and the height, giving 13×13×32.

`Flatten`: 13 × 13 × 32 = 5,408 numbers in a row, and those 5,408 numbers are the inputs to the 128-unit layer that follows.

I built the same model in TensorFlow 2.21, and the output shapes it reports for these layers are (26, 26, 32), (13, 13, 32) and (5408). The lecture does not work out these shapes.

</details>

### The limits of feed-forward networks, and recurrent neural networks

[Recording 1:26:03–1:41:19](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=5163s)

In the last part the lecturer first redraws every network so far in a more abstract form: input goes in, the network computes, output comes out. This kind of network is a **feed-forward neural network**, with connections in one direction only, from the input through the hidden layers to the output. Its limitation is that the shapes of the input and the output are both fixed: how many units in the input layer and how many in the output layer cannot change once the structure is set.

A **recurrent neural network** (RNN) adds a path back: the network's output is fed into the same network again as input for its next run. That lets the network maintain some kind of state, carrying information from what it has already processed forward, which suits sequences of data. The lecturer sorts the uses by whether the input and the output are each one thing or many. The feed-forward networks above are one-to-one: one set of inputs, one set of outputs.

**One-to-many: one image in, a sentence out** ([1:29:21](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=5361s)). The lecturer demonstrates Microsoft's CaptionBot: he pastes in a photo of Harvard Square and it answers "I think it's a group of people walking in front of a building". The input is an image and the output is a string of words whose length varies with the photo, which a fixed number of output units cannot represent. The RNN approach is to output one word at a time: on the first run the image goes into the network and the first word comes out; the same network then runs again, this time taking input from its own previous output, and produces the second word; and so on. The lecturer makes a point of saying that every run uses the same network with the same weights, only with different input.

**Many-to-one: a sequence in, one classification out** ([1:34:57](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=5697s)). The example is YouTube needing to analyze videos. A video is a sequence of images of no fixed length and cannot be treated as one fixed-size input. The approach is to pass in one frame at a time, with the network outputting nothing yet and only handing information to the next run; at the fourth frame the network gets the fourth frame plus the information computed from the first three. Once everything has been seen it outputs a classification, such as whether this is an educational video or a music video. The same structure applies to deciding whether a movie review is positive or negative (the input is a sequence of words), or to cutting speech into chunks to recognize who is speaking.

**Many-to-many: a sequence in, another sequence out** ([1:37:55](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=5875s)). The example is Google Translate. Translating word by word does not work, because languages order their words differently and one language may use two words where another uses one. The approach is to feed the input words into the network one at a time, and only after all of them are in does the network start producing the translation, one word at a time. The lecturer says doing this with neural networks has been one of the big advances in automated translation and has improved accuracy dramatically.

There are many kinds of RNN, and the lecturer names just one of the most popular: long short-term memory (LSTM) ([1:39:44](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=5984s)), without describing how it is built. In closing he mentions other types of network, such as adversarial networks, in which networks compete with each other to generate new data, and previews natural language for next week.

**Check yourself. Write your answer down before opening the fold.** Which of one-to-one, one-to-many, many-to-one and many-to-many does each of these four tasks belong to? (a) Recognizing one handwritten digit; (b) writing a one-sentence caption for a photo; (c) deciding whether a movie review is positive or negative; (d) translating an English sentence into Chinese.

<details>
<summary>Answer</summary>

(a) One-to-one: one fixed-size image in, one fixed-size output (probabilities for the ten digits) out, and a feed-forward network is enough. (b) One-to-many: one image in, a string of words of varying length out. (c) Many-to-one: a string of words in, one classification out. (d) Many-to-many: a string of words in, another string of words out, and the two need not be the same length.

All four are examples from the lecture. The way to tell them apart is to ask whether the input and the output are each "a sequence whose length varies"; if either one is, a fixed-shape feed-forward network is not enough.

</details>

## Project 5: Traffic — CNN Training for Traffic Sign Classification

The course's [academic honesty policy](https://cs50.harvard.edu/ai/honesty/) does not allow looking at someone else's solution before you submit, so by default this section gives only the task, the code the course provides, the approach, pseudocode, common mistakes and ways to check your work; the full reference implementation is folded at the end, to be opened only after you have written and submitted your own.

### Task

Train a neural network on the German Traffic Sign Recognition Benchmark (GTSRB) data set to identify which of 43 kinds of traffic sign appears in a photograph. Two functions in `traffic.py` are yours to complete:

- `load_data(data_dir)`: read every image, resize each to `IMG_WIDTH` × `IMG_HEIGHT`, and return `(images, labels)`.
- `get_model()`: return a compiled model. The input shape is `(IMG_WIDTH, IMG_HEIGHT, 3)` and the output layer must have `NUM_CATEGORIES` units. How many layers and which kinds go in between is up to you.

You also hand in a `README.md` documenting, in at least a paragraph or two, which architectures you tried, what worked and what did not. The spec is explicit that nothing else in `traffic.py` should be modified apart from these two functions (you may add functions and import standard-library modules, plus `numpy` or `pandas`); the global variables at the top of the file may be changed for testing. The spec page also opens with a note that the latest Python you should use for the course is 3.12, particularly for this project because of TensorFlow.

The data set is a separate download (the commands are under "How to check your own work" below). Unzip it and move the `gtsrb` directory inside the `traffic` directory. It holds 43 subdirectories named `0` through `42`, one per kind of sign, each containing images of that sign:

```text
gtsrb/
├── 0/     # images of category 0
├── 1/
├── ...
└── 42/
```

There are no separate training and testing directories; `main` does the split. The copy I downloaded (2026-10-13) has 26,640 `.ppm` files; the smallest category has 150 images and the largest 1,500. The spec page also offers a small data set with only 3 kinds of sign, `gtsrb-small`, for practicing first.

### Code the course provides

The top of the official `traffic.py` and the two functions to implement look like this (verbatim apart from the docstrings). Both functions contain only `raise NotImplementedError`, and both are yours to write; until you do, running the program raises that exception straight away.

```python
import cv2
import numpy as np
import os
import sys
import tensorflow as tf

from sklearn.model_selection import train_test_split

EPOCHS = 10
IMG_WIDTH = 30
IMG_HEIGHT = 30
NUM_CATEGORIES = 43
TEST_SIZE = 0.4


def load_data(data_dir):
    """(docstring omitted)"""
    raise NotImplementedError


def get_model():
    """(docstring omitted)"""
    raise NotImplementedError
```

`main` is already written and should be left alone. In order, it:

1. Checks the command-line arguments: `python traffic.py data_directory [model.h5]`, where the second argument is optional.
2. Calls `load_data(sys.argv[1])` to get `images` and `labels`.
3. Converts the integer labels to one-hot vectors with `tf.keras.utils.to_categorical(labels)`, then holds out 40% as the testing set with `train_test_split(..., test_size=TEST_SIZE)`.
4. Calls `get_model()` and trains for 10 epochs with `model.fit(x_train, y_train, epochs=EPOCHS)`.
5. Evaluates on the testing set with `model.evaluate(x_test, y_test, verbose=2)`.
6. Saves the model with `model.save(filename)` when a second argument was given.

This flow is almost identical to the lecture's `handwriting.py`, and the spec's hints say the lecture source code may be useful.

### Approach

**`load_data` is a walk over the directory.** The category number is the name of the subdirectory, so the outer loop goes through the numbers from 0 to `NUM_CATEGORIES − 1` and the inner loop through every file in that subdirectory. Each file is read into an array of pixels with OpenCV (`cv2`), as the spec requires, resized to the given width and height, and added to the list of images; at the same time the category's number is added to the list of labels, and the two lists have to stay in the same order. The spec requires that paths not hard-code a separator, so build them with something like `os.path.join`. What you return is two lists; converting to numpy arrays and one-hot vectors is `main`'s job.

**`get_model` is the lecture's CNN structure carried over and then tuned.** The skeleton is the four steps in ["Pooling and the structure of a convolutional neural network"](#pooling-and-the-structure-of-a-convolutional-neural-network) ([Recording 1:08:18](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=4098s)): convolution, pooling, flatten, then an ordinary network. The lecturer writes it as Keras layers in [`handwriting.py`](#handwritingpy-recognizing-handwritten-digits-with-a-cnn) ([Recording 1:14:28](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=4468s)), and this project differs from it in three places:

- The input goes from a 28×28×1 black-and-white image to an `IMG_WIDTH` × `IMG_HEIGHT` × 3 color image.
- The output goes from 10 categories to `NUM_CATEGORIES`, and the last layer still has to output a probability distribution (softmax in the lecture, [1:19:08](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=4748s)).
- Rescaling the pixel values. `handwriting.py` divides the pixel values by 255 before building the model ([1:15:33](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=4533s)); this project's `main` does not, and `main` cannot be changed, so it is yours to handle: do it in `load_data`, or put it inside the model as the first layer. Inside the model, the saved model carries its own rescaling, so later predictions on raw images cannot skip the step; that comparison is mine.

For what goes in the middle, the spec lists directions to experiment with: how many rounds of convolution and pooling, the number and size of filters, the pool size, the number and size of hidden layers, and whether to use dropout. The lecture's matching remarks are that convolution and pooling can be applied more than once, with earlier rounds learning low-level features and later ones higher-level features ([1:11:46](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=4306s)), and that dropout reduces overfitting (["Hidden layers, backpropagation and dropout"](#hidden-layers-backpropagation-and-dropout), [37:18](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=2238s)). A sensible way to proceed is to start from the lecture's one-round structure, change one thing at a time, and write down the testing accuracy each time; that record is what `README.md` asks for.

Last comes `compile`. `main` has already turned the labels into one-hot vectors, so choose the loss that takes one-hot labels; the metric is accuracy.

### Pseudocode

```text
function Load-Data(data_dir):
    images = empty list
    labels = empty list
    for each category number c, from 0 to NUM_CATEGORIES − 1:
        for each image file in the directory named c under data_dir:
            read the file as an array of pixels
            resize the array to width IMG_WIDTH, height IMG_HEIGHT
            add the array to images, add c to labels
    return images, labels

function Get-Model():
    model = layers in sequence:
        input: IMG_WIDTH × IMG_HEIGHT × 3
        (if pixel values are still 0–255, rescale them to 0–1 first)
        one or more rounds of: convolution, then pooling
        flatten
        one or more hidden layers, with dropout if needed
        output: NUM_CATEGORIES units, turned into a probability distribution
    set the optimizer, a loss that matches one-hot labels, and accuracy as the metric
    return model
```

### Common mistakes

For the items below that quote an error message or a number, that is what I actually saw when I attached the folded implementation (as is, or broken in one place) to the official `main` and ran it on Python 3.11 and TensorFlow 2.21 (CPU); the wording may differ in other versions. The last few items are reminders of rules in the spec.

- **Pixel values not rescaled, and training sometimes never learns.** The symptom is training accuracy stuck around 0.055 for all ten epochs, with testing accuracy also about 0.055. That number amounts to guessing one category for everything: the largest category has 1,500 images, 5.6% of the 26,640. The trouble is that it does not happen every time; the same program sometimes reaches 0.97, so it is easy to blame luck or the architecture. The runs and numbers are in the table in the next section.
- **Loss and label format do not match.** `main` has already turned the labels into one-hot vectors with `to_categorical`. If the loss is `sparse_categorical_crossentropy`, which takes integer labels, `model.fit` raises a `ValueError` at once, and the message reads "Argument `output` must have rank (ndim) `target.ndim - 1`. Received: target.shape=(None, 43), output.shape=(None, 43)". When you see that message, the problem is the loss, not the shapes of the layers.
- **The output layer does not have `NUM_CATEGORIES` units.** `model.fit` raises a `ValueError`: "Arguments `target` and `output` must have the same shape", followed by the two shapes; with one unit too few, for example, it is `target.shape=(None, 43), output.shape=(None, 42)`.
- **Using the small data set `gtsrb-small` without changing `NUM_CATEGORIES` to 3.** The official `gtsrb-small` has only the three subdirectories `0`, `1` and `2`. Written the way the pseudocode above goes, walking the numbers from 0 to `NUM_CATEGORIES − 1`, and with `NUM_CATEGORIES` still 43, `load_data` raises a `FileNotFoundError` when it reaches number 3; the message points at the nonexistent directory `gtsrb-small/3`, and the program never gets to training. After changing it to 3 the run completes normally. Once unzipped, the `gtsrb-small` directory also contains a `.DS_Store` file next to the three subdirectories; walking by number never touches it.
- **Images not resized to one size.** The original images in the data set vary in size. `main` calls `np.array` on `images`, and with mixed sizes that raises a `ValueError` whose message contains "inhomogeneous shape". The spec's hint is to print `img.shape`, which should be `(30, 30, 3)`.
- **Looking for `train/` and `test/` directories out of habit from other data sets.** This data set has only the forty-three subdirectories `0` through `42`, and `main` does the split. The `gtsrb` directory also has to sit inside the `traffic` directory for the first argument to be `gtsrb`.
- **Changing `main` to rescale, split or print more.** The spec does not allow changes outside the two functions. Whatever you need goes into `load_data`, `get_model` or extra functions of your own.
- **Thinking something is wrong because the accuracy printed during training is lower than on the testing set.** This is common for a model that uses dropout. The folded implementation prints about 0.90 to 0.95 for the last epoch and scores above 0.98 on the testing set. There are two reasons, both mine: dropout removes some of the units during training and not during evaluation; and the number printed for an epoch is a running average over the epoch, whose early batches used worse weights.
- **The warning on saving.** Saving to `model.h5` with a second argument works; TensorFlow 2.21 prints one warning that HDF5 is a legacy format, which does not affect the result, and is no reason to change `main`.
- **Forgetting `README.md`.** It is part of what the spec asks you to submit, at least a paragraph or two.

### How to check your own work

First set up the environment and the data:

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/5/traffic.zip
unzip traffic.zip && cd traffic

# The data set is a separate download; gtsrb/ must end up inside traffic/
wget https://cdn.cs50.net/ai/2023/x/projects/5/gtsrb.zip
unzip gtsrb.zip

pip3 install -r requirements.txt  # opencv-python, scikit-learn, tensorflow

# Train and evaluate; a second argument saves the model to a file
python traffic.py gtsrb
python traffic.py gtsrb model.h5
```

**Checking `load_data`** (no training needed; call it directly in Python):

- The two lists have the same length. With the full data set it is 26,640.
- Every image's `shape` is `(30, 30, 3)`.
- The labels are integers from 0 to 42 and all 43 values occur; the least frequent occurs 150 times and the most frequent 1,500.

**Checking `get_model`** (again no training): call it and print `model.input_shape`, which should be `(None, 30, 30, 3)`, and `model.output_shape`, which should be `(None, 43)`. The table from `model.summary()` lists only each layer's output shape and has no column for the input shape; its last row should also be `(None, 43)`.

**Checking the whole flow**: run `python traffic.py gtsrb`.

- The progress bar for each epoch should show 500 steps, and the final evaluation 333. 60% of 26,640 images is 15,984 and 40% is 10,656; at 32 per batch that is 500 and 333 batches. The sample output on the spec page also shows `500/500` and `333/333`.
- In the sample output on the spec page, training accuracy rises from 0.1545 to 0.9256 over ten epochs and testing accuracy is 0.9535. That is one run shown by the course, not a threshold; the spec sets no required accuracy.
- This site's own runs are in the table below, using the folded implementation and a version of it with the pixel-rescaling line removed; official `main` untouched, the full data set, TensorFlow 2.21 (CPU), about 2 to 3 seconds per epoch. The author's and the independent reviewer's results are listed separately.

| Setting | Who ran it | Runs | Testing accuracy |
|---|---|---|---|
| Pixels rescaled to 0–1 | Author (Python 3.11) | 6 | 0.9809, 0.9821, 0.9842, 0.9850, 0.9852, 0.9886 |
| Pixels rescaled to 0–1 | Reviewer (Python 3.11 five times, 3.12 once) | 6 | 0.9808, 0.9850, 0.9853, 0.9855, 0.9897; the Python 3.12 run 0.9873 |
| Not rescaled (pixels 0–255) | Author (Python 3.11) | 7 | 0.9746, 0.9552, 0.9310, 0.5697, 0.0565, 0.0544, 0.0543 |
| Not rescaled (pixels 0–255) | Reviewer (Python 3.11) | 6 | 0.9745, 0.9698, 0.9683, 0.8453, 0.0569, 0.0566 |

All 12 rescaled runs landed between 0.981 and 0.990. Of the 13 runs without rescaling, 5 (3 by the author, 2 by the reviewer) never learned, with testing accuracy about 0.055; 2 more reached only 0.57 and 0.85; the remaining 6 fell between 0.93 and 0.975, and none beat the lowest rescaled score. With pixel values left at 0 to 255, the numbers entering the network are 255 times larger than after rescaling, and training easily goes wrong from the start; that explanation is mine. `train_test_split` splits differently every time, the initial weights are random, and your architecture differs from this one, so your numbers will not be the same; what to look for is whether you are stuck at 0.055, and whether the same program is stable over several runs.

**The course's own checks**:

```bash
check50 ai50/projects/2024/x/traffic
style50 traffic.py
```

I did not run `check50` and have not verified what it actually checks. The small data set with only 3 kinds of sign is at `https://cdn.cs50.net/ai/2023/x/projects/5/gtsrb-small.zip` (840 images); when using it, temporarily change `NUM_CATEGORIES` to 3. I ran the folded implementation that way once: 16 steps per epoch, 11 for evaluation, testing accuracy 0.9970. The testing set has only 336 images, so one image is 0.3 percentage points and the number shifts a little from run to run: the reviewer's three separate runs gave 0.9970, 0.9970 and 0.9821.

### Full reference implementation

<details>
<summary>Full reference implementation (open only after you have written and submitted your own)</summary>

> ⚠️ If you are taking this course, or plan to apply for a CS50 certificate: the course's [academic honesty policy](https://cs50.harvard.edu/ai/honesty/) says you may not look at someone else's solution before submitting your own work. Finish and submit first, then use this part to compare. This implementation was only run in the environments listed on this site and has not been through check50.

This is one way to write it, not an official solution. The structure follows the lecture's `handwriting.py` with one more round of convolution and pooling.

```python
def load_data(data_dir):
    images = []
    labels = []
    for category in range(NUM_CATEGORIES):
        category_dir = os.path.join(data_dir, str(category))
        for filename in os.listdir(category_dir):
            image = cv2.imread(os.path.join(category_dir, filename))
            if image is None:
                continue
            images.append(cv2.resize(image, (IMG_WIDTH, IMG_HEIGHT)))
            labels.append(category)
    return images, labels


def get_model():
    model = tf.keras.models.Sequential([
        tf.keras.Input(shape=(IMG_WIDTH, IMG_HEIGHT, 3)),
        tf.keras.layers.Rescaling(1 / 255),

        tf.keras.layers.Conv2D(32, (3, 3), activation="relu"),
        tf.keras.layers.MaxPooling2D(pool_size=(2, 2)),

        tf.keras.layers.Conv2D(64, (3, 3), activation="relu"),
        tf.keras.layers.MaxPooling2D(pool_size=(2, 2)),

        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation="relu"),
        tf.keras.layers.Dropout(0.5),

        tf.keras.layers.Dense(NUM_CATEGORIES, activation="softmax")
    ])
    model.compile(
        optimizer="adam",
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    return model
```

A few things to note:

- Paths are built with `os.path.join`; the spec requires the program to work on any operating system.
- `cv2.imread` returns `None` for a file it cannot read, and such files are skipped (the official data set has none; this is defensive).
- `load_data` returns two lists, and `main` converts them to numpy arrays itself.
- `Rescaling(1 / 255)` takes the pixel values from 0–255 to 0–1, matching the divide-by-255 step in the lecture's `handwriting.py`. `tf.keras.Input` and `Rescaling` do not appear in the lecture.

The actual runs are the 12 "Pixels rescaled to 0–1" runs in the table in the previous section (6 by the author, 6 by the reviewer), with testing accuracy from 0.981 to 0.990.

</details>

---

## Learning Checklist

- [ ] Can compute one unit's output by hand: inputs times weights, plus bias, through the step function, and can say which numbers give OR and AND
- [ ] Can explain how much data gradient descent, stochastic and mini-batch each look at per update, and the trade-off
- [ ] Can explain why a single perceptron cannot learn data that is not linearly separable, and how hidden layers solve it
- [ ] Can say in your own words what backpropagation does, and why dropout reduces overfitting
- [ ] Can write the lecture's two models with Keras `Sequential` and say what each layer does
- [ ] Can compute a 3×3 kernel convolution and 2×2 max-pooling by hand, and work out each layer's output shape
- [ ] Can tell which tasks one-to-one, one-to-many, many-to-one and many-to-many each correspond to
- [ ] Traffic project: `load_data` returns 26,640 items, each of shape `(30, 30, 3)`; the model's last layer outputs `(None, 43)`; over several runs testing accuracy never gets stuck at 0.055; `README.md` written; `check50` clean

## Course video sources

The official CS50 YouTube playlist (CS50’s Introduction to Artificial Intelligence with Python, 8 videos) was checked live on 2026-10-10; the Week 5 lecture recording is listed there.

Original videos: [Neural Networks - Lecture 5 - CS50's Introduction to Artificial Intelligence with Python 2020](https://www.youtube.com/watch?v=J1QD9hLDEDY)

Course and recording entries:

- [CS50 AI Week 5 — official video, slides and notes](https://cs50.harvard.edu/ai/weeks/5/)
- [CS50's Introduction to AI with Python — official YouTube playlist (8 videos)](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-13): the timecoded English captions (human-written) were fetched with yt-dlp and read in full (1:41:19) before "Lecture walkthrough" was rewritten. Section start times and the numbers quoted (the weights and biases for OR and AND, the probabilities for the four weather categories, the unit counts in each Playground trial, the accuracy of the two programs, the values in the convolution and pooling examples) come from the captions; the slides and the screen were not viewed, and the network diagrams, the scatter of data points and the Playground screen are not reconstructed. At 1:02:03 the captions read "subtracted 28 times", which from the surrounding arithmetic should be "subtracted 20 eight times", and this article follows the arithmetic. At 1:16:22 the lecturer says 13 filters and corrects himself to 32 at once, and at 51:24 corrects "eight hidden layers" to "eight hidden units inside my layer"; this article uses the corrected versions. The two Keras excerpts come from the lecture source code `src5.zip` on the course website; `adam`, `binary_crossentropy` and `categorical_crossentropy` in them are not read out by the lecturer, as noted in the text. The transcript never mentions this week's project, Traffic; the project description comes from the course site, not the video.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official CS50 YouTube playlist was checked live and lists this week’s lecture recording, so the status is now Videos included.
- 2026-10-10: Checked the video content against its transcript. Removed topics and the project introduction not found in the video, added the RNN segment, and made timecodes approximate.
- 2026-10-13: Moved the player from the source section to "Lecture Video & Timestamps" and added the running time to the opening.
- 2026-10-13: Rewrote the "Core Concepts Cheat Sheet" from the timecoded captions as a ten-section "Lecture walkthrough", each section with a time link and one self-check question; the timeline went from approximate minutes to actual start times, and the running time was corrected to 1:41:19. Content in the old cheat sheet that the lecture does not cover was removed: the chain-rule and error-term δ formulas, the table of activation-function derivatives (including Leaky ReLU and Tanh), the MSE and cross-entropy loss-function table, the `EarlyStopping` and `validation_split` example, and the notes on the `strides` and `padding` parameters of `Conv2D`.
- 2026-10-13: Rewrote the Traffic project section from the official `traffic.zip` and the spec page. The earlier text presented `load_data` as provided, when both `load_data` and `get_model` are yours to write; the data set has no `train/` and `test/` directories; the earlier reference implementation rewrote `main`, which the spec says not to modify, and used `sparse_categorical_crossentropy`, which does not match the one-hot labels in the official `main`. It is now a version that implements only the two functions, with the results of an actual run. The earlier claim that "check50 loads `traffic_model.h5` and evaluates on a hidden test set" has no basis on the spec page and was removed; the `README.md` the spec requires was added.
- 2026-10-13: Revised after independent review. The actual-run results in the project section were rewritten: after more runs with and without `Rescaling`, the author's and the reviewer's results are tabulated separately; 5 of the 13 runs without `Rescaling` never learned, and the earlier statement that the gap was "not enough to say which is better" is withdrawn. Added that rescaling can also go in `load_data`, the second reason training accuracy is lower, and the warning on saving; `README.md` now reads "at least a paragraph or two". In the walkthrough: max-pooling is now "one of the most popular kinds", two descriptions of on-screen actions that captions cannot show were reworded, the lecture's convolution and pooling examples now note that the original numbers are in the figures in the official notes, and the bias range for AND and the answer to the two-lines question were rewritten. The GTSRB reference now points to the authors' ERDA archive page, since the original site's domain no longer resolves. Wording aligned across the series: "OCW site" is now "course website".
- 2026-10-13: Restructured the project section: task, code the course provides, approach, pseudocode, common mistakes and ways to check come first, and the full reference implementation is folded at the end with a warning and a link to the course's [academic honesty policy](https://cs50.harvard.edu/ai/honesty/). The reference code itself is unchanged; the table of actual runs moved to "How to check your own work", "Dataset Structure" was merged into the task, and the commands from "Run & Verify" into the checks.
- 2026-10-13: Revised after the review of the project section. The shapes in the two error messages now read `(None, 43)`, as seen when running through the official `main` (the earlier `(32, 43)` came from a small test whose sample count happened to be a multiple of 32); the consequence of not changing `NUM_CATEGORIES` for `gtsrb-small` now reports an actual run on the official small data set (`load_data` raises `FileNotFoundError`), replacing an inference that did not hold; the `get_model` check now looks at `model.input_shape` and `model.output_shape`; the tldr and description were updated to match the project section as it now stands.
- 2026-10-14: Three additions after the second review of the project section: the `gtsrb-small` testing accuracy now notes that the testing set has only 336 images and gives the reviewer's three runs; the opening sentence of "Common mistakes" now covers only the items that quote an error message or a number; and the `.DS_Store` file inside the official `gtsrb-small.zip` is noted.

## References

- [Week 5 Neural Networks lecture page](https://cs50.harvard.edu/ai/weeks/5/) — video, slides, transcript, quiz
- [Neural Networks - Lecture 5 (YouTube)](https://www.youtube.com/watch?v=J1QD9hLDEDY) — the basis of "Lecture walkthrough"; content, numbers and time links come from its English captions
- [Week 5 Notes (2020 edition)](https://cs50.harvard.edu/ai/2020/notes/5/) — the official notes, useful for the figures on the slides
- [Lecture source code src5.zip](https://cdn.cs50.net/ai/2020/spring/lectures/5/src5.zip) — `banknotes.py`, `handwriting.py`, `recognition.py`, `filter.py`
- [Traffic project spec](https://cs50.harvard.edu/ai/projects/5/traffic/) — Distribution `2023/x`, check50 slug `ai50/projects/2024/x/traffic`
- [TensorFlow/Keras official docs](https://www.tensorflow.org/api_docs/python/tf/keras)
- [GTSRB public data archive](https://sid.erda.dk/public/archives/daaeac0d7ce1152aea9b61d9f1e19370/published-archive.html) — the archive page the data set's authors (Stallkamp et al.) keep on ERDA, with the data set description and the original files. The original INI Benchmark site `benchmark.ini.rub.de` (which the spec page also links to) did not resolve when checked on 2026-10-13
- [CS50 AI YouTube playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 documentation](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- On this site: [Harvard CS50 AI Overview](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en) — series entry & version notes
- On this site: [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) — A3 tier definition
