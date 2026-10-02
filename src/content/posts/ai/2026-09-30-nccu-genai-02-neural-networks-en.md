---
title: "NCCU Generative AI L02: Neural Network Concepts"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, neural-networks, deep-learning, keras, homework]
lang: en
series:
  name: "Reading NCCU Yen-Lung Tsai Generative AI"
  order: 2
tldr: "Lecture 2 opens up last week's \"dopey AI robot.\" Inputs and outputs must become numbers (tensors). Classification uses one-hot labels and softmax to turn scores into probabilities. A neural network is neurons stacked layer by layer, and training means pushing the loss down with gradient descent. The lecture ends by building a first fully connected network on MNIST in Keras and wiring it to a Gradio sketchpad. Homework 2 asks you to design your own DNN, with one hard rule: it can't have three layers. The Chang Gung satellite rubric wants a screenshot of the parameters with the best validation accuracy and encourages keeping failed attempts."
description: "Guide to lecture 2 of NCCU Yen-Lung Tsai's Generative AI course (semester 1132): tensors and features, myna classification and one-hot labels, supervised learning, softmax and conditional probability, neurons and activation functions, the two design choices in a fully connected network, the universal approximation theorem, loss functions and gradient descent, the Keras MNIST notebook Demo01 with its Gradio interface, and the rubric for the \"not three layers\" homework."
draft: false
glossary:
  - term: "softmax"
    definition: "Exponentiates a set of real numbers so they are all positive, then divides by their sum. The result sums to 1 and keeps the original order. Commonly used in a classifier's output layer."
    context: "The slides turn 1.9, 1.1, 0.2 into 0.61, 0.28, 0.11 and read them as probabilities for three myna species."
  - term: "one-hot encoding"
    aliases: ["one-hot"]
    definition: "Writes class k as a vector with 1 in position k and 0 everywhere else, so a class label becomes numbers a neural network can compare against."
    context: "Demo01 uses to_categorical to turn MNIST's 10 digit classes into 10-dimensional one-hot vectors."
  - term: "universal approximation theorem"
    definition: "A mathematical result: with enough neurons, a network with one hidden layer can approximate a broad class of functions to any accuracy. It guarantees the function is learnable in principle, but says nothing about how many neurons or how to train."
    context: "GenAI02 slide 52 uses it to explain why neural networks are a \"nearly all-powerful black-box function learner.\""
---

> 🌏 [中文版](/posts/ai/2026-09-30-nccu-genai-02-neural-networks)

**Series**: previous [L01 Why study generative AI](/posts/ai/2026-09-30-nccu-genai-01-why-generative-ai-en) | next [L03 GANs, once all the rage](/posts/ai/2026-09-30-nccu-genai-03-gan-en) | [Series overview](/posts/ai/2026-09-30-nccu-genai-course-overview-en)

> **Version note**: This post is based on the [recording](https://www.youtube.com/watch?v=s1QqujRMEUk) (3 h 4 min, in Mandarin) of lecture 2 from NCCU semester 1132 (2025-02-25) and the [GenAI02 slides](https://yenlung.me/1132GenAI) (122 slides, in Chinese). The demo notebook is `【Demo01】設計你的神經網路.ipynb` from [AI-Demo](https://github.com/yenlung/AI-Demo). It is cited as the **current repo version** (last commit 2026-03-17), which may differ from what 1132 used. The homework spec and rubric come from the [Chang Gung satellite page](https://yangchihyuan.github.io/courses/GenerativeAI2025). All facts were checked on 2026-09-30.

Last lecture said an AI model is a "dopey AI robot": you only need to know what its input and output look like. This lecture answers the next question. What's inside the machine, and how does it "learn"?

The slides come in five parts: building the dopey AI robot, neural networks, our distance from the truth, gradient descent, and building a first neural network. The first four are concepts. The last is hands-on, and the homework starts from it.

## Part 1: inputs and outputs have to be numbers

The dopey robot only eats numbers. The slides show what "numbers" can look like with three examples:

| Data | Shape | How the slides put it |
|---|---|---|
| An iris's sepal length/width and petal length/width, `[5.1, 3.5, 1.4, 0.2]` | Vector | 4 features |
| A stock's open, high, close, etc. over the past 20 days | Matrix | One row per day |
| A color photo | 3D matrix (R, G, B layers) | "And then we run out of words..." |

The precise term is **tensor**: a scalar is rank 0, a vector rank 1, a matrix rank 2. Sound and text can also become numbers, which is the premise for the later LLM and image-generation lectures.

### Myna classification: what a classification problem looks like

Back to last week's birdwatching example. Taiwan has three common mynas: the crested myna, the white-vented (javan) myna, and the common myna. So the output is three numbers, each a "score" for one species.

The correct answer has to become numbers too. The usual trick is **one-hot encoding**: the first species is `[1, 0, 0]`, the second `[0, 1, 0]`, the third `[0, 0, 1]`.

Next you prepare lots of "data with correct answers," split in two:

- **Training data**: used to adjust the machine
- **Test data**: kept out of training, used to confirm the computer isn't just "memorizing answers," that is, not **overfitting**

Training on data with correct answers is **supervised learning**. When the training data doesn't come with answers we prepared, it's unsupervised learning.

### Softmax: turning scores into probabilities

After training, the model gives a photo three scores, `1.9, 1.1, 0.2`, meaning it thinks the first species is most likely. To "look more scholarly" (the slides' words), we want the three numbers split proportionally so they sum to 1, with big staying big and small staying small.

The catch is that scores can be negative, so you can't just divide by the total. **Softmax** exponentiates first so every number is positive, then splits proportionally. The scores above become `0.61, 0.28, 0.11`: 61% crested myna, 28% white-vented myna, only 11% common myna.

<details>
<summary>The softmax formula and the conditional-probability notation</summary>

For three scores $a, b, c$, exponentiate and let $S = e^a + e^b + e^c$. Then

$$
p_1 = \frac{e^a}{S},\quad p_2 = \frac{e^b}{S},\quad p_3 = \frac{e^c}{S}
$$

Because the results sum to 1, people often say a neural network learns a **probability distribution**. The slides go further and write it as a conditional probability: given photo $x$, the probability that the answer is class $i$ is

$$
P_\theta(y = y_i \mid x) = p_i
$$

The slides also joke that this phrasing is "mostly there to scare people."

</details>

The part closes with three reminders. The most important thing in deep learning is "asking a good question," meaning choosing the input and output. The computer makes the whole judgment, so it needs a lot of data; on the slide, the computer says it needs roughly 1,000 photos per class. And the computer has no idea that it's looking at a "common myna." It only knows it's class 3.

## Part 2: how a neural network is put together

The core of deep learning is the neural network. Building a dopey robot basically means stacking **hidden layers**, each holding some number of **neurons**. There are roughly "3+1" ways to arrange them:

| Architecture | How the slides describe it |
|---|---|
| DNN (fully connected, Dense) | The standard, all-round basic type |
| CNN (convolutional, Conv) | The king of image recognition |
| RNN (LSTM, GRU) | A network with memory |
| Transformers | The "+1" |

Whatever the type, the basic computing unit is the neuron. Only the wiring differs.

### What a single neuron does

Each neuron takes several inputs and sends out one output. It does three things:

1. Compute the total stimulus: $w_1x_1 + w_2x_2 + w_3x_3$, where the $w$ are **weights**
2. Add a **bias** $b$ to shift the baseline
3. Pass the result through an **activation function** $\varphi$ before sending it on

Step 3 is the key. The first two steps are linear, and no matter how many neurons you chain, the result stays linear. So you need a nonlinear transformation. Weights and biases are all learned, and together they're written as $\theta$.

The slides show three well-known activation functions: **ReLU** ("this century's favorite"), **Sigmoid** ("feels like it should be close to how human neurons behave"), and **Gaussian** ("nostalgia for the old days, rarely used now").

### Designing a fully connected network takes two decisions

For a DNN, building a function-learning machine only requires two sets of numbers:

1. How many hidden layers
2. How many neurons per layer

Neurons in adjacent layers are fully connected. Once those two numbers are fixed, the positions of all weights and biases $\theta$ are fixed. Give $\theta$ values, and any input produces an output.

Each layer turns its input into another tensor, and one layer's output is the next layer's input. The recording calls this AI's second-level use: **each layer's output can be read as the computer's understanding of the input**. This idea comes back later with VAEs and latents.

### Why neural networks are so powerful

The slides call neural networks a "nearly all-powerful black-box function learner," citing the **universal approximation theorem**: a theorem proves that a network with one hidden layer can learn the function you want.

So why didn't it work last century? The slides recall a stretch when neural networks were so out of favor that a grant proposal mentioning them was doomed before it was even submitted. Yann LeCun's explanation is that three things were missing then: lots of data, computing power, and sophisticated software. All three exist now, and writing a deep learning program is far easier than it was last century.

## Parts 3 and 4: training means pushing the loss down

A freshly built network "initializes" its parameters first. At that point it runs, but it's not accurate. Feed it a myna photo and it might confidently say 72% common myna.

To make it accurate, you first need a way to measure "how far off." A **loss function** measures how far the machine's answers are from the correct answers on the training data; smaller is better. The goal of training is to find, among infinitely many possible $\theta$, the $\theta^*$ with the smallest loss.

The method is **gradient descent**. Because of how neural networks are structured, it's also called **backpropagation** here.

The slides build intuition by pretending there's only one parameter $w$:

- Draw the tangent at the current point. If the slope is negative, step right; if positive, step left. In other words, move against the slope.
- A big step can overshoot, so you multiply by a small number called the **learning rate** $\eta$.
- With more than one parameter, look at one at a time and treat the others as constants. That's a **partial derivative**. Stack all the partial derivatives into a vector and you have the **gradient** $\nabla L$.

<details>
<summary>The loss function and gradient descent formulas</summary>

A common loss function listed on the slides (mean squared error), for $k$ training examples:

$$
L(\theta) = \frac{1}{2k}\sum_{i=1}^{k} \lVert y_i - f_\theta(x_i) \rVert^2
$$

Update for a single parameter:

$$
w \leftarrow w - \eta \frac{dL}{dw}
$$

With several parameters, stack each partial derivative into the gradient and update all at once:

$$
\begin{bmatrix} w_1 \\ w_2 \\ b_1 \end{bmatrix} \leftarrow \begin{bmatrix} w_1 \\ w_2 \\ b_1 \end{bmatrix} - \eta \nabla L
$$

The slides' punchline is the last line: however you build the function-learning machine and whatever loss you pick, you can train it with gradient descent.

</details>

The slides end with an advanced topic. Many people say AI is just curve fitting, interpolating between points it has seen. But the 2021 paper by Balestriero, Pesenti, and LeCun, [Learning in High Dimension Always Amounts to Extrapolation](https://arxiv.org/abs/2110.09485), argues that in high dimensions it is really extrapolation.

## Part 5: building a first neural network

The hands-on part uses the [MNIST](https://keras.io/api/datasets/mnist/) handwritten digit dataset and Keras in TensorFlow. First, turn the problem into a function:

- The input is a 28×28 image, "flattened" into a 784-dimensional vector
- The output is 10 classes, as a 10-dimensional one-hot vector

The example on slide 118 has two hidden layers of 100 neurons each, both with ReLU, and a 10-dimensional softmax output.

### The Demo01 notebook (current repo version)

The course notebook is [`【Demo01】設計你的神經網路.ipynb`](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo01%E3%80%91%E8%A8%AD%E8%A8%88%E4%BD%A0%E7%9A%84%E7%A5%9E%E7%B6%93%E7%B6%B2%E8%B7%AF.ipynb) (short link on the slides: yenlung.me/AI01). The current version runs like this:

1. Import packages, including `Sequential`, `Dense`, `SGD`, and Gradio
2. Load MNIST from Keras: 60,000 training and 10,000 test examples
3. `reshape` to 784 dimensions and divide by 255; convert labels to one-hot with `to_categorical`
4. Build the model: **three hidden layers of 20 neurons each**, ReLU, and a 10-neuron softmax output layer
5. `compile` with `mse` loss and `SGD(learning_rate=0.087)`
6. Check the parameter count with `model.summary()`, then `fit` for 10 epochs
7. `evaluate` on the test data and step through predictions with `interact_manual`
8. Build a sketchpad with Gradio's `Sketchpad`: draw a digit, see the top 3 predictions

Note that step 4 differs from slide 118: the notebook has three hidden layers, the slide has two. That's where the homework's "not three layers" rule comes from. The example you start from has three.

The compile cell also leaves suggestions. For classification, `loss='categorical_crossentropy'` is actually the more sensible choice ("ask an AI why"), and you can try `'adam'` as the optimizer.

## Week 2 homework: build your own DNN digit classifier

This is the Chang Gung satellite version (due 3/10, 23:59). The spec has six points:

- Build your own DNN (fully connected) handwriting classifier
- **The network can't have three layers** (more is fine, fewer is fine, just not three)
- Make it your own; it shouldn't look like the instructor's example at a glance
- Remove the excess explanations and rewrite the text
- Screenshot the parameters and results with the highest accuracy on your "validation data"; you may add observations about bad results and their parameters
- If you use Gradio, you must screenshot the Gradio result

The page specifically encourages **keeping your experiments**. If parameter A at 5 gave mediocre results and raising it to 10 improved things by some amount, leave that in Colab or write it up in Markdown. The reason given: when you look back you'll know what you tried, and the TA can see you went through the process.

The rubric:

| Points | Condition |
|---|---|
| 0 | Link won't open, and no screenshots |
| 1 | Notebook only imports the basic packages |
| 2 | Link won't open, but some screenshots |
| 3 | ChatGPT-level work, or unrelated to this week's topic |
| 6 | Base score: very close to the class demo, e.g. only a few numbers changed |
| 8 | The architecture is clearly changed a lot, but the content is still mostly the instructor's template |
| 10 | Meets the spec above |

The notes add three rules beyond week 1. Anywhere generative AI helped, you must say so, explain what you understood, and attach screenshots (the prompt and the output); otherwise it counts as copying from AI. Confirmed plagiarism means 0 for that assignment plus 10 points off the course total, repeated for each offense. And if there isn't much to submit, don't upload a PDF.

One practical tip: the homework asks for *validation* accuracy, but the notebook's current `fit` doesn't hold out a validation set. The commented-out `validation_split=0.1` version just below is there for this. Turn it on and you can plot training and validation accuracy curves.

## Self-check

- You can explain why an activation function is required (without it, any number of layers stays linear)
- You can compute softmax by hand once: roughly what does `[2, 1, 0]` become?
- You can count the parameters in Demo01's first hidden layer (784 × 20 weights plus 20 biases)
- You can explain what happens when the learning rate is too large (it overshoots)
- Your homework network doesn't have three layers, and it keeps a comparison of at least two parameter settings

One thing to do tonight: change Demo01 to two hidden layers, turn on `validation_split=0.1`, switch the loss to `categorical_crossentropy`, compare how validation accuracy changes, and keep the screenshots.

## Lecture 2 in Fall 2026

The Fall 2026 syllabus describes week 2 as core neural network concepts (perceptrons, multilayer perceptrons), activation functions and backpropagation, and a simple MNIST digit classifier. The 1151 [lecture 2 recording](https://www.youtube.com/watch?v=RijejOES8K8) is retitled "The dopey AI robot." Its chapters roughly match 1132, with a new segment, "Five AI thinking questions: hallucination, AI agents, and domain experts," and a stock up/down prediction example for defining inputs and outputs.

## Further reading

- The full version of neural networks, backpropagation, and CNNs/RNNs: [Reading CMU 11-785](/posts/ai/2026-08-22-cmu-11785-course-overview-en)
- Course ownership and the full homework table: [Series overview](/posts/ai/2026-09-30-nccu-genai-course-overview-en)

## References

- [Generative AI 02: Neural network concepts](https://www.youtube.com/watch?v=s1QqujRMEUk) (in Mandarin) — 1132 lecture 2 recording with chapter timeline (2025-02-25)
- [1132 slide folder (yenlung.me/1132GenAI)](https://yenlung.me/1132GenAI) (in Chinese) — GenAI02 neural network concepts, 122 slides
- [【Demo01】設計你的神經網路.ipynb](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo01%E3%80%91%E8%A8%AD%E8%A8%88%E4%BD%A0%E7%9A%84%E7%A5%9E%E7%B6%93%E7%B6%B2%E8%B7%AF.ipynb) (notes in Chinese) — Keras MNIST example and Gradio sketchpad (current repo version)
- [Chang Gung satellite course page](https://yangchihyuan.github.io/courses/GenerativeAI2025) (in Chinese) — week 2 homework spec and rubric
- [Balestriero, Pesenti & LeCun, Learning in High Dimension Always Amounts to Extrapolation (2021)](https://arxiv.org/abs/2110.09485) — the paper cited in the slides' advanced topic
- [Keras MNIST dataset docs](https://keras.io/api/datasets/mnist/) — documentation for `mnist.load_data()`
- [Fall 2026 syllabus PDF](https://drive.google.com/file/d/1hhigEPT9SdhJgtIpevACzSJsSNA0mw6T/view) (in Chinese) — 1151 week 2 description
- [1151 lecture 2: The dopey AI robot](https://www.youtube.com/watch?v=RijejOES8K8) (in Mandarin) — chapter timeline for the Fall 2026 version
