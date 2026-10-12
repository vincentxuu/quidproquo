---
title: "What Machine Learning Learns: Supervised, Unsupervised, and Reinforcement Learning | Stanford CS229 Lecture 1"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, supervised-learning, unsupervised-learning, reinforcement-learning]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 1
tldr: "The opening lecture of CS229 Spring 2026 runs only 37 minutes and has no derivations. It defines machine learning with Tom Mitchell's experience E, task T, and performance measure P, then splits the whole course into supervised, unsupervised, and reinforcement learning. The three differ in whether the data comes with answers and whether the model collected the data itself. Large language models show up in all three categories at once."
description: "A guide to Lecture 1 of Stanford CS229 (Spring 2026): prerequisites and the AI tools policy, two definitions of machine learning, the inputs, outputs, and feedback signal of each of the three kinds of learning, and which part of the map each of the sixteen later lectures covers."
draft: false
math: true
---

> 🌏 [中文版](/posts/ai/2026-10-12-stanford-cs229-lecture-01-introduction)

**Video status: Videos included.** This post is written from the English transcript of the Spring 2026 Lecture 1 recording published by Stanford Online. The lecture has no dedicated chapter in the lecture notes; the notation follows the introduction at the start of Part I of the 2026 main notes (pages 6–8) and the table of contents. I had only the transcript while writing and did not see the slides. The times given for each section come from the transcript's segment timestamps and are approximate.

This is the opening of the whole course. The lecturer says right away that this one is light: nothing deep, just how the course runs, which topics it will cover, and a fairly traditional way of sorting machine learning into categories. It runs 37 minutes and contains no derivations at all.

So this post has a different job from the ones that follow. Every later lecture asks you to work through the math. This one hands you a map: when you hear "supervised", "unsupervised", or "reinforcement learning", you should be able to say what the data looks like in each case, what the model outputs, what signal tells it how well it is doing, and which later lecture teaches which piece. The only prerequisites are being able to read $y = ax + b$, the mean, and the inner product of two vectors. The state of the course materials (which year the notes, recordings, and assignments each stop at) is covered in the [course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en); I recommend reading that first and then coming back.

```youtube
url: https://www.youtube.com/watch?v=DATnpGoGhM8
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 1: Introduction
captions: en
```

## How the course runs: prerequisites, math density, and the AI tools policy

(Recording 00:05–05:14)

**Who is teaching.** The lecturer says the other instructor, Chris, is not here today and will take over from the next lecture; after that each lecture is taught by one of the two. He introduces himself: his PhD was on deep learning theory, in recent years he has moved to more empirical topics, and he now works on AI for science, AI for math, and self-improving algorithms, which basically means training large language models. This quarter is co-taught by Tengyu Ma and Chris Ré, lecture by lecture. Since the lecturer refers to the other instructor as Chris, this lecture is Tengyu Ma's.

**Prerequisites.** You need a background in probability and linear algebra. He names courses like CS 109 or STAT 116, and admits the course list on the slide may be a little out of date. If you are missing a small piece, you can fill it in at Section and the Friday TA sessions. If you have never touched the material at all, he flatly recommends taking the course later.

**Math density.** He is clear about where this course sits:

> "it's still a pretty mathematically intense course. We are trying to teach the basics, in some sense the foundation of machine learning, not necessarily proving theorems, but just there are derivations, mathematical derivations, mathematical modeling formulations. We focus more on those as opposed to programming." (from about 02:07)

In other words, the course does not prove many theorems, but every lecture derives and models, and programming comes second. For a self-learner this decides how to read: you should be able to get from each line of an equation to the next on your own. Following the conclusion does not count.

**AI tools policy.** He uses AI tools every day himself, and the course allows students to use them, with limits: you cannot paste a tool's output straight into homework you hand in, and you cannot have it generate code that goes directly into your answer. You can treat it as a human collaborator or, as he puts it, a superhuman collaborator. The details are on the course website.

He then explains why the rule is this strict:

> "if you're building an agent, that the agent understands the materials, then you probably don't have to take this course. So this is more about-- not about training your own agent. It's about training yourself" (from about 03:09)

The transcript follows this sentence with "like your synopsis". From the context, and from his later comparison of the edges in a neural network to synapses, this is most likely a transcription error for "synapses": what this course trains is the connections in your own head.

A self-learner has no homework to hand in, so the rule does not bind you, but the reason behind it applies all the same. Have a model finish the derivation for you and you get a finished derivation. Get stuck for half an hour and then work it out yourself and you get the ability to follow the next lecture.

**Why still teach it the traditional way in 2026.** He offers a view that he admits may be biased:

> "the methodology of training the models are still very similar to the old days, but the way we are using the models are very different." (from about 04:12)

Using machine learning in a company used to mean building a complicated pipeline: collect data, train a model, and so on down the line. Now most people write a prompt, ask a question directly, or write skills in Claude Code. This course does not teach how to use those tools. It teaches the basic techniques behind training these models, so most of the old material still applies, and the outdated parts have already been removed.

## Defining machine learning: the three parts E, T, and P

(Recording 05:14–07:45)

Going back through his old slides last week, the lecturer found that definitions from decades ago still hold up.

The first definition is from 1959: machine learning is the field of study that gives computers the ability to learn without being explicitly programmed. The lecturer does not read out an author; the line is usually attributed to Arthur Samuel. His reading is that "explicitly programmed" at the time meant writing the chess-playing code by hand, while "learning" means training a model on data and letting the model predict or decide the next move.

The second definition is from Tom Mitchell at CMU (the lecturer says 1998; the definition comes from his textbook *Machine Learning*, which was published in 1997):

> A computer program is said to learn from experience E with respect to some class of tasks T and performance measure P, if its performance at tasks in T, as measured by P, improves with experience E.

The lecturer likes this definition because it names three parts, and all three still work in 2026, only with a wider scope:

| Part | What it meant then | What the lecturer says it means now |
|---|---|---|
| Experience E | Data | Data from the internet, data from the real world, human-labeled data, and even synthetic data and thinking tokens the model generates itself |
| Task T | One very specific task, such as image classification or house price prediction | The notion of a task is still there, but one model has to solve a million kinds of tasks |
| Measure P | A metric such as accuracy | Still needed, because learning has to be driven by a goal |

He puts special weight on the "if ... improves" condition in the definition:

> "So if you have more data, it's not improving, then it's not learning." (from about 07:16)

You can use this line directly as a test. Give the system more data, train it longer, and if P does not get better, the system is not learning. The comparison he gives is a game: E is the data, P is the win rate, and T is the game itself.

The part of this definition that is easiest to overlook is P. Beginners usually focus on what the model looks like, but the first move in almost every later lecture is to write down a quantity to minimize or maximize, and that quantity is P in mathematical form. The example below works through this once.

## The three-way split, and why the three are now more like tools

(Recording 07:45–09:17)

The lecturer starts with a caveat: the field moves so fast that there is no consensus even on the taxonomy, and sometimes a consensus has only just formed when the thing stops mattering. What he gives is a split that nobody would find strange to hear:

- Supervised learning
- Unsupervised learning
- Reinforcement learning

The three overlap, and the overlap keeps growing. More important is how he positions these three terms. They used to be three kinds of tasks; now they are more like three methods or paradigms:

> "nobody has the end goal of just doing supervised learning for one task." (from about 08:16)

The end goal now is a general agent that learns automatically, and supervised learning is one of the tools for building it. His example is SFT (supervised fine-tuning), which is one form of supervised learning.

This positioning explains something that confuses self-learners: large language models appear once in each of the three parts of this lecture. They predict the next word by classification (a supervised technique), they are trained on huge amounts of unlabeled text (covered in the unsupervised part), and they are later tuned with reinforcement learning. Putting all three labels on the same model is not a contradiction, because each one describes one stage of the training process.

## Supervised learning: the data has both inputs and answers

(Recording 09:17–19:39)

### House price prediction and notation

The lecturer says that fifteen years ago, when you studied machine learning, house price prediction was about as interesting as applications got. Each entry in the dataset is a house; the horizontal axis is area (square feet) and the vertical axis is price.

Here he introduces the notation used throughout the course: $x$ is the input and $y$ is the output. You have many pairs $(x, y)$, and each pair is a point on the plot. At test time, someone gives you a new $x$ and you have to answer with the corresponding $y$. Page 7 of the main notes writes the $i$-th example as $(x^{(i)}, y^{(i)})$, where the superscript $(i)$ is an index and has nothing to do with exponents; the function to be learned is written $h$ and called the hypothesis.

The simplest approach is to fit a straight line and then read off the height of the line at $x = 800$ as the prediction. The lecturer mentions that a quadratic might fit this data better and would give a different prediction. How to fit a line or a quadratic, and what the training algorithm and loss function are, he says will be taught in Lectures 2 and 3, that is, the material starting in [Lecture 2](/posts/ai/2026-10-12-stanford-cs229-lecture-02-supervised-learning-linear-regression-en).

### A complete example: which of two lines is better

The following is an example made up for this article, not from the lecture. The numbers are not lecture content; the point is to put a concrete number into each of E, T, and P in Mitchell's definition.

**Experience E**: data on three houses, where $x$ is square feet and $y$ is price (in thousands of US dollars).

| House | $x$ | $y$ |
|---|---|---|
| 1 | 600 | 180 |
| 2 | 1000 | 260 |
| 3 | 1400 | 380 |

**Task T**: given $x$, predict $y$.

**Measure P**: here I use mean squared error, which squares "actual price minus predicted price" for each house and takes the average:

$$
\text{MSE}(h) = \frac{1}{n}\sum_{i=1}^{n}\left(y^{(i)} - h(x^{(i)})\right)^2
$$

Squaring does two things: overestimates and underestimates cannot cancel each other out, and the example that is far off gets penalized especially hard. This is only one of many possible choices of P; the cost function the course actually uses, and the reason for choosing the square, are left to the next two lectures.

Now take two candidate lines:

- Line A: $h_A(x) = 0.25x + 20$
- Line B: $h_B(x) = 0.2x + 70$

Compute the prediction and error for each house:

| House | $y$ | $h_A(x)$ | Error | Squared error | $h_B(x)$ | Error | Squared error |
|---|---|---|---|---|---|---|---|
| 1 | 180 | 170 | 10 | 100 | 190 | −10 | 100 |
| 2 | 260 | 270 | −10 | 100 | 270 | −10 | 100 |
| 3 | 380 | 370 | 10 | 100 | 350 | 30 | 900 |

$$
\text{MSE}(h_A) = \frac{100 + 100 + 100}{3} = 100,\qquad
\text{MSE}(h_B) = \frac{100 + 100 + 900}{3} \approx 366.7
$$

The unit of MSE is thousands of dollars squared. Taking the square root brings it back to the original unit, and that quantity is called the root mean squared error (RMSE): 10 thousand dollars for line A and about 19.1 thousand dollars for line B. Under this P, A is better. To predict the price of an 800-square-foot house, A answers $0.25 \times 800 + 20 = 220$, which is 220 thousand dollars; B would answer 230 thousand.

This result shows three things. First, "which model is better" has no answer until P is fixed, and when P changes the ranking may change with it (for example, switch to the maximum absolute error: A is 10 and B is 30, so the conclusion is the same this time, but with other data it might not be). Second, I only compared two lines here; real training searches over all possible $(a, b)$ for the pair that makes P best, and that is what Lecture 2 starts teaching. Third, the feedback signal in supervised learning is the "Error" column in the table: every example comes with the correct answer, so each time the model guesses it can tell how far off it is and in which direction.

### Features, labels, regression, and classification

Looking only at living area is too simple. At the very least you also want the lot size, so the input becomes two numbers $x_1, x_2$, and the plot becomes three-dimensional.

The lecturer sorts out some vocabulary along the way. He says almost every concept in machine learning has more than one name; it used to be a mess, and now that some terms have fallen out of use things are a bit clearer. Inputs used to be called features as well; the output to be predicted is sometimes called the label. He now tends to just say input and output. The verb "labeling" is still in use, and it means providing the desired output for some input, whether a human or a machine does it.

Outputs come in two types:

- When the output is a continuous quantity, such as a price, the problem is called **regression**.
- When the output is one of a discrete set of options, such as "detached house" or "townhouse", it is called **classification**.

A classification problem is drawn differently. The two inputs (lot size and living area) become the two axes of a plane, each house is a point, and a triangle or a circle marks its class. The classifier's job is to cut the plane in two, for example with everything above a line counted as a detached house and everything below as a townhouse. The lecturer says Lectures 3 to 5 are about classification, which corresponds to [logistic regression in Lecture 3](/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression-en), [the exponential family and GLMs in Lecture 4](/posts/ai/2026-10-12-stanford-cs229-lecture-04-exponential-family-glm-en), and [Gaussian discriminant analysis in Lecture 5](/posts/ai/2026-10-12-stanford-cs229-lecture-05-gaussian-discriminant-analysis-en).

Then comes what I think is the sentence from this lecture most worth remembering:

> "all of these large language models fundamentally is a classification problem where you're predicting the next task, next token or the next word." (from about 13:23; "next task" is a slip that he corrects himself to next token)

Words are discrete labels; there are just a lot of them. The number he gives is fifty thousand, and now possibly up to two hundred and fifty thousand distinct words or tokens; at every step the model has to pick one of these options. So the binary and multiclass classification you learn in Lectures 3 to 5 gets reused unchanged in [next-token prediction in Lecture 14](/posts/ai/2026-10-12-stanford-cs229-lecture-14-llm-next-token-attention-en), except that the number of classes goes from 2 to tens of thousands.

### High-dimensional inputs and outputs: ImageNet, bounding boxes, translation

If you really wanted to predict house prices, you would want to know the living area, the lot size, the number of floors, the condition, the zip code, and so on, and the input ends up high-dimensional. The output can be high-dimensional too. The lecturer gives three applications:

**Image classification.** The input $x$ is the raw pixels of an image and the output $y$ is the class of the main object in it, which is discrete. He places this task at the starting point of the current wave of AI: Fei-Fei Li and her team at Stanford collected ImageNet, which the lecturer says has one million image-label pairs, when the second-largest dataset at the time had about fifty thousand, a factor of twenty. Then Geoff Hinton, Alex Krizhevsky, and Ilya Sutskever published AlexNet, training a neural network on this data to very good results. From memory, he says the accuracy in the first paper was around 50%, and it is now 95% to 97%. These numbers were recalled on the spot by the lecturer and this article has not checked them independently; verify them against the original papers before citing them.

He also points out how limited this task looks from 2026: one model does one thing. It can only attach a class to an image, and you cannot ask it anything else about the image.

**Bounding-box localization.** An image can contain more than one object, and you can draw a box around each. The output is then a bounding box, described by four numbers: the two coordinates of the bottom-left corner and the two coordinates of the top-right corner, since two corners uniquely determine a rectangle. The input is still raw pixels. This is an example where the output is several continuous values.

**Machine translation.** The input is English and the output is Chinese or some other language, or the other way around.

Here the lecturer inserts a remark about what the course is: it does not say much about applications. It mainly teaches the basic techniques behind the applications and demonstrates them on toy examples. For people who want to learn applications, other courses on campus are a better fit.

### Deep learning: the technique that makes all this work

What makes the applications above feasible is deep learning. The lecturer first says a network has millions or billions of neurons, then immediately corrects himself: there may not be billions of neurons, but there are billions of parameters, and each parameter corresponds to an edge in the network. He uses the brain as an analogy, with nodes as neurons and edges as synapses, and adds the qualifier "to some degree" to signal that this is only a simulation up to a point.

Two things will be taught later: how a network is defined and what to watch out for when defining it; and, most important, how to train it. Training starts by defining a loss function and then computing the gradient of the loss with respect to every parameter, and backpropagation is the method that computes gradients automatically for a function this complicated. He says this is the content of Lectures 7 and 8, which corresponds to [network architecture in Lecture 7](/posts/ai/2026-10-12-stanford-cs229-lecture-07-neural-network-architecture-en) and [backpropagation in Lecture 8](/posts/ai/2026-10-12-stanford-cs229-lecture-08-backpropagation-en).

## Unsupervised learning: inputs only, no answers

(Recording 19:39–28:30)

### The setup and clustering

An unsupervised dataset has only inputs and no outputs, so there is no clearly defined task, because you do not know what you are supposed to predict. Go back to the housing plot: in the supervised version each point carries a triangle or a circle. In the unsupervised version all the points look the same, just a cloud of points on a plane.

Even so, the eye can still see patterns in the plot. The lecturer describes the goal as getting as much as you can out of the data without labels. He also admits this goal is vaguely defined: what "interesting structure" means actually depends on the method you use, and different methods give you different structure.

The most typical method is clustering, which finds data points that are similar to each other. On a two-dimensional plane this is intuitive, and a person asked to do it would probably get about the same result, although the same data may also have another reasonable grouping. How clustering algorithms are designed and what the objective function is, he says, will be taught in Lectures 9 and 10, which corresponds to [k-means and Gaussian mixture models in Lecture 9](/posts/ai/2026-10-12-stanford-cs229-lecture-09-k-means-gmm-en) and [EM and PCA in Lecture 10](/posts/ai/2026-10-12-stanford-cs229-lecture-10-em-pca-en).

### Two classic applications, and a small example you can compute

**Clustering genes.** Picture a table in which each column is one person's gene expression. There are many people and their genes all differ, but once the columns are arranged in a suitable order, you can clearly see that one group of people has one kind of gene and another group has another. After clustering, you can study which genes are related to which diseases or symptoms.

**Clustering documents and words.** Another table: documents run across, words run down, and each cell holds the number of times the word appears in the document, with a darker color for a higher count. The raw table shows no pattern; after rearranging, a few dark blocks emerge. In the lecturer's example, three documents all mention shuttle, space, launch, and booster heavily and look like they are about space; the block in the top-left corner is about air pollution and the environment. This finds similar words and similar documents at the same time. He says this kind of technique is called LSA, and that Lecture 9 will touch on part of how it is done.

"Rearrange and the pattern appears" sounds like magic, but computing it once on a small table removes the mystery. The following is an example made up for this article, not from the lecture. Four documents, four words, and each cell is a count:

| | D0 | D1 | D2 | D3 |
|---|---|---|---|---|
| pollution | 5 | 0 | 3 | 0 |
| shuttle | 0 | 6 | 0 | 4 |
| air | 4 | 0 | 5 | 0 |
| launch | 0 | 3 | 0 | 5 |

In this order the numbers alternate like a checkerboard. Treat each document as a four-dimensional vector (read top to bottom): D0 is $(5, 0, 4, 0)$, D2 is $(3, 0, 5, 0)$, and D1 is $(0, 6, 0, 3)$. Measure how alike two documents are with cosine similarity, which is the inner product of the two vectors divided by their lengths:

$$
\cos(D_0, D_2) = \frac{5\cdot 3 + 4\cdot 5}{\sqrt{5^2+4^2}\,\sqrt{3^2+5^2}} = \frac{35}{\sqrt{41}\sqrt{34}} \approx \frac{35}{37.34} \approx 0.94
$$

$$
\cos(D_0, D_1) = \frac{5\cdot 0 + 0\cdot 6 + 4\cdot 0 + 0\cdot 3}{\sqrt{41}\sqrt{45}} = 0
$$

D0 and D2 point in almost the same direction, and D0 and D1 do not overlap at all. Put similar documents next to each other (D0, D2, D1, D3), reorder the words by the same reasoning (pollution, air, shuttle, launch), and the table becomes:

| | D0 | D2 | D1 | D3 |
|---|---|---|---|---|
| pollution | 5 | 3 | 0 | 0 |
| air | 4 | 5 | 0 | 0 |
| shuttle | 0 | 0 | 6 | 4 |
| launch | 0 | 0 | 3 | 5 |

One block in the top left and one in the bottom right: this is what the dark blocks that appear on the lecturer's slide after sorting look like. At no point did anyone tell the algorithm which document was about the environment and which was about space; all it used was the numbers in the input itself. The feedback signal in unsupervised learning comes from this kind of internal consistency: whether similar things ended up together. As for how "similar" is defined, that is what the lecturer means when he says it depends on the method.

### Word vectors: directions that correspond to relations

The lecturer then turns to what came after deep learning: encode each word as a numeric vector, often a thousand dimensions or longer. These vectors carry meaning. Similar words have nearby vectors; Rome, Paris, and Berlin, for example, sit close together in the vector space. More interesting still, a direction sometimes corresponds to a relation: the left-to-right direction on the slide corresponds to "country to capital". If you know where Italy is but not its capital, walk in that direction, and the word you run into is most likely the capital of Italy; the same direction works for France and Germany.

To illustrate with made-up two-dimensional numbers: suppose France is at $(2, 3)$ and Paris is at $(5, 4)$; subtracting gives the direction $(3, 1)$. Italy is at $(1, 1)$, and adding $(3, 1)$ gives $(4, 2)$; if the vector for Rome happens to be near $(4, 2)$, then this direction encodes the relation "capital of". Real word vectors have over a thousand dimensions, but the operation is exactly this subtraction and addition.

These vectors are trained on unlabeled data. The lecturer says this was around 2014 and 2015, and the data was basically Wikipedia; by today's standards Wikipedia is a very small corpus, perhaps only 1% or 0.1% of the total corpus now. For how embeddings are learned, the closest connection in this series is [contrastive learning and semantic search in Lecture 13](/posts/ai/2026-10-12-stanford-cs229-lecture-13-representation-learning-semantic-search-en).

### Large language models and diffusion models

The lecturer puts these two in the unsupervised part as well, on the grounds that the training data has no human labels.

**Large language models**: general-purpose models trained on large amounts of unlabeled data. The earlier LSA and word vectors each solve only one or two tasks (which words are similar, which documents are similar); the ChatGPT input box says "Ask anything", and you can ask anything. He previews three things to be taught: which network architecture the pretrained model uses, which loss function it is trained with, and more advanced topics, including how to prompt and how to train models to follow instructions better. He mentions an observation: most models today follow instructions well, whereas two years ago not every model did and the result still depended a lot on how you phrased the instruction; the change came about because frontier labs like OpenAI and Anthropic trained their models to be better at following instructions. These pieces correspond to [Lecture 14](/posts/ai/2026-10-12-stanford-cs229-lecture-14-llm-next-token-attention-en) and [Lecture 16](/posts/ai/2026-10-12-stanford-cs229-lecture-16-attention-variants-in-context-learning-en).

There is a spot here where it is easy to get stuck: the previous section just said a language model is a classification problem, and isn't classification supervised? The lecturer does not address this head-on; what follows is an addition in this article. The two statements describe different levels. In terms of where the data comes from, nobody labels the text with answers, so it counts as unlabeled data. In terms of the mathematical form of training, treat the next word of a passage as the "answer" for the words before it, and every position automatically becomes a pair $(x, y)$ to which the classification loss applies directly. The answers are cut out of the data itself.

**Diffusion models**: generate realistic images from noise or from instructions. This is also unsupervised, because all you have is a large pile of real images with no labels, and the job is to build a model that can produce more realistic images. The lecturer mentions that this line of research often uses datasets of celebrity faces. He says there will be one lecture on this topic; in this series it actually corresponds to [Lecture 11](/posts/ai/2026-10-12-stanford-cs229-lecture-11-diffusion-models-en) and the first half of [Lecture 12](/posts/ai/2026-10-12-stanford-cs229-lecture-12-diffusion-loss-foundation-models-lora-en).

## Reinforcement learning: the model collects its own data

(Recording 28:30–35:08)

The lecturer says the first bullet on the slide has been there for three years and the second is new this time. The two bullets look at the same thing from two angles.

### The traditional view: sequential decision-making

The task in reinforcement learning is to make a sequence of decisions. The classic applications are AlphaGo and robots learning to walk. He plays a video: at training iteration 10 the robot can barely walk; at iteration 20 there is still not much happening; by iteration 80 it starts to walk a little, and later it walks quite well.

This task has two features. One is **actions**: at every moment you have to decide how to move the arms and the legs. The other is **sequential dependence**: the action now affects the future. One wrong step may be unrecoverable; after a fall the robot can never move again.

### The new view: a tool for dealing with random sampling

People now also treat reinforcement learning as a tool for training models, especially when the model has random outputs. The lecturer explains with the generation process of a language model:

1. The model computes a probability distribution over the next word.
2. It **samples** a word from that distribution.
3. It feeds the word back into the model, generates the next word, and repeats.

When you ask a question, the model generates many tokens, some of which are not shown to you (the part the interface labels "thinking"), but those are generated tokens too. Every step is a random sample.

> "It's not a differentiable operation. So that's why to deal with this kind of generation you cannot really backprop through it easily." (about 29:56–31:00)

The lecture does not expand on why sampling is not differentiable; what follows is an addition in this article. Suppose the vocabulary has only three words, the model gives probabilities $(0.5, 0.3, 0.2)$, and sampling draws the first word. Backpropagation needs an answer to "if 0.5 is nudged to 0.51, how does the output change continuously", but the output of sampling is the discrete choice "the first word". After the probabilities are nudged, the draw is most often the same word (the output does not change at all and the derivative is zero), and once in a while it jumps to a different word altogether (there is no smooth transition in between and the derivative does not exist). In either case, the gradient carries back no information about which way to adjust. Backpropagation in Lecture 8 requires every step in the computational graph to be differentiable; when this step is blocked, the gradient cannot pass back through it.

The lecturer says that in some cases you can still backpropagate through and in some you cannot, and when you cannot, you need reinforcement learning. This connects to the traditional view: generating each word is a decision, and the first word affects the second, so this too is sequential decision-making. A student asks whether the first bullet is the original RL and the second is how it is used now. The lecturer answers that this is roughly right; the two are not fundamentally different and do not contradict each other, and the perspective is just slightly different.

### A third feature: the data is collected through interaction

The lecturer says he had not stressed this point earlier. In supervised and unsupervised learning, the dataset is given to you. You can find ways to collect more, but that happens at another level; the model itself only sees the data it is given and does not produce data of its own.

Reinforcement learning is trial and error, going back and forth between "collecting data" and "training": try a policy, collect feedback. The robot tries to walk and falls, and the fall is data too. You get a trajectory, that is, the sequence of actions and observations from this attempt, and it becomes new data for the next round of training. The model improves on data it collected itself.

He gives the example of automated theorem proving, which he now spends a lot of his time on:

1. You have a set of statements and no proofs.
2. Let the model generate some proofs itself.
3. Verify these proofs and pick out the correct ones.
4. The correct proofs become new training data, used to train (reinforce) the language model.
5. The hope is that the next round produces more correct proofs, which means more data and more training, forming a loop that lifts itself up (his word is bootstrapping).

Robots work the same way: collect more trajectories and train on the good ones.

Checking this loop against E, T, and P shows how it differs from the first two categories. T is "given a statement, write a proof"; P is the fraction that passes verification; E starts out empty and is generated by the model round after round, then filtered by the verifier. In the first two kinds of learning, E is fixed before training starts.

### Applied to language models: rewards and policy gradient

The rough pipeline when applied to a language model: the input is the user's prompt and the model generates a long piece of text. A separate module reads this text and outputs something called a **reward**, which says how good the text is. This module can be a human, a reward model, or another language model; the lecturer says that is a separate topic. The reward is then used to guide the model update so that the next round produces better text.

The reason reinforcement learning is needed is the same as before: generation involves random sampling, so the whole pipeline cannot be differentiated end to end. The technique for handling this situation is called policy gradient. He rattles off a few terms: RLVR (RL with verifiable rewards), RLHF (RL with human feedback), and using these methods to train long chains of thought, and then says these are just buzzwords you do not need to understand yet. This part corresponds to [RL basics and policy gradient in Lecture 18](/posts/ai/2026-10-12-stanford-cs229-lecture-18-rl-basics-policy-gradient-en) and [PPO and verifiable rewards in Lecture 20](/posts/ai/2026-10-12-stanford-cs229-lecture-20-ppo-rl-for-reasoning-en).

## The three kinds of learning side by side

This table was compiled for this article; it puts together what the lecture says across three separate parts:

| | Supervised | Unsupervised | Reinforcement learning |
|---|---|---|---|
| What the data looks like | Pairs $(x, y)$ | Only $x$ | Trajectories the model produces by trying: actions, observations, plus rewards |
| Where the data comes from | Given in advance | Given in advance | Collected through interaction during training |
| Model output | A prediction of $y$ for a new $x$ | Structure: clusters, vector representations, or new samples | A sequence of decisions |
| Feedback signal | Every example has a correct answer to compare against | No answers; the objective is defined by the method | A reward that scores the outcome of an attempt, with no step-by-step correct answer |
| Lecture examples | House prices, detached house or townhouse, ImageNet, bounding boxes, translation | Clustering, the gene table, LSA, word vectors, LLM pretraining, diffusion models | Robot walking, AlphaGo, theorem proving, RLVR / RLHF for LLMs |
| Lectures in this series | Lectures 2–8 | Lectures 9–14, 16 | Lectures 18, 20 |

## The course map and two topics outside the regular lectures

(Recording 35:08–36:59)

At the end the lecturer shows a screenshot of the schedule. He says it is his own internal version; he had hoped Claude Code would lay it out more nicely for him, that did not work, and so he is showing the ugly version. The schedule itself is linked from the course website.

He adds two topics:

**ML systems.** One lecture is planned on how software and hardware work together. He explains why this matters: an algorithm that is twice as fast could save OpenAI billions of dollars, and it does not even have to be twice; 20% faster is already substantial. But saving money is still the lesser point:

> "think about if I have algorithm that's 2x faster than you, then it's one year for me and two years for you, and one year versus two years, that's day and night for these days." (about 35:08–36:10)

**Fairness and societal impact.** They are looking for a guest lecturer for this part, the reason being that AI is replacing many jobs and its social impact has to be thought through.

Neither topic has a matching recording in the public playlist. The [course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en) checked this: two guest lectures this quarter were not put on YouTube, and one of them is on systems for ML.

## Self-check

**1. A spam filter is trained on ten thousand emails labeled "spam / not spam". Write down its E, T, and P, and say whether it is regression or classification.**

Criteria: E is those ten thousand labeled emails; T is deciding whether a new email is spam; P can be accuracy on emails it has not seen. The output is one of two discrete options, so it is classification. If the P you wrote is accuracy on the ten thousand training emails, you should be able to say what is wrong with measuring it that way (the model may simply have memorized them), which is the topic of Lecture 6.

**2. Using the three houses in this article, compute the MSE of line C: $h_C(x) = 0.25x + 30$, and compare it with line A.**

Answer: the predictions are 180, 280, 380; the errors (actual minus predicted) are 0, −20, 0; the squares are 0, 400, 0; and the MSE is $400/3 \approx 133.3$, worse than A's 100. C gets two houses exactly right and A gets none exactly right, yet A has the lower MSE. This shows that squared error cares about the overall size of the deviations, not about how many examples are hit exactly. As an aside, if you change P to the mean absolute error, A is $(10+10+10)/3 = 10$ and C is $(0+20+0)/3 \approx 6.7$, and the ranking flips: this is a concrete case of the statement in the main text that when P changes, the ranking may change with it.

**3. The lecturer says a language model "fundamentally is a classification problem", and also puts it in the unsupervised learning part. How can both be true?**

Criteria: you need to separate "whether the data has human labels" from "the mathematical form during training". A text corpus has no human annotation; but the next word at each position can serve as the answer for the preceding text, so each step is a classification that picks one out of tens of thousands of classes. Answering only "because LLMs are complicated" does not count.

**4. Why can't you rely on backpropagation alone when training a language model to produce long reasoning, and need reinforcement learning?**

Criteria: mention two points. One, every step of generation samples from a probability distribution, the result of sampling is a discrete choice, it is not differentiable, and the gradient cannot pass through. Two, the signal of good or bad (the reward) is given only after the whole text has been generated; there is no correct answer for each word. Better still if you say that policy gradient is the technique for handling this situation.

**5. In the automated theorem proving loop, what happens if you remove the "verify whether the proof is correct" step and add every proof the model generates back into the training data?**

Criteria: the lecture does not answer this directly; you have to reason it out. The verifier is the only source of feedback signal in this loop. Without it, wrong proofs and right proofs are treated the same, the model is only learning what it would have generated anyway, and P (the fraction that passes verification) has no reason to go up. By Mitchell's definition, if P does not improve with E, it is not learning.

## Corresponding reading

This lecture has no dedicated chapter in the lecture notes. The closest material is the introduction at the start of Part I of the main notes, before Chapter 1 (pages 6–8): it also uses house prices as the example (the notes use data on 47 houses from Portland) and defines $x^{(i)}$, $y^{(i)}$, the training set, the hypothesis $h$, and the distinction between regression and classification. The lecture only mentions $x$ and $y$ out loud; the superscript notation and $h$ come from the notes.

How the six parts of the notes map to the lectures in this series (compiled from the notes' table of contents and the topic of each lecture):

| Notes | Chapters and pages | This series |
|---|---|---|
| Part I: Supervised learning | Chapters 1–6, pages 6–78 | Lectures 2–5 (linear regression, logistic regression, GLM, GDA) |
| Part II: Deep learning | Chapter 7, pages 79–113 | Lectures 7, 8 |
| Part III: Generalization and regularization | Chapters 8–9, pages 114–145 | Lecture 6 |
| Part IV: Unsupervised learning | Chapters 10–13, pages 146–178 | Lectures 9, 10 |
| Part V: Generative models and foundation models | Chapters 14–18, pages 179–225 | Lectures 11–14, 16; RLVR from Chapter 18 is in Lecture 20 |
| Part VI: Reinforcement learning and control | Chapters 19–21, pages 226–265 | Lectures 18, 20 |

A few places where the lecture and the notes disagree, or where the lecture covers something the notes do not:

- The two definitions of machine learning (the 1959 line and Mitchell's E, T, P) are not in the main notes; they appear only in the lecture.
- The lecture numbers the lecturer gives out loud are the plan at the start of the quarter: "one lecture" on diffusion models, and LSA in "Lecture 9". Going by the topics of the lectures in this series, diffusion models run into Lecture 12, and contrastive learning and semantic search, which learn vector representations, are in Lecture 13. The notes' table of contents has no chapter named after LSA.
- The lecture files language models and diffusion models under unsupervised learning; the notes give them their own Part V, "Generative models and foundation models", rather than putting them in Part IV.
- Chapter 5 (kernels), Chapter 6 (SVMs), Chapter 13 (ICA), and Chapters 19–20 (MDPs, LQR) of the notes are not mentioned anywhere in this lecture's preview of the course.
- SFT is in Section 17.8 of the notes (page 218); RLVR is in Section 18.2 (page 221); policy gradient is in Chapter 21 (from page 258).

**Series navigation**: Previous: [Course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en) | Next: [Lecture 2: the supervised learning setup and linear regression](/posts/ai/2026-10-12-stanford-cs229-lecture-02-supervised-learning-linear-regression-en)

## Course video sources

Original video: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 1: Introduction](https://www.youtube.com/watch?v=DATnpGoGhM8)

- [Stanford CS229 Machine Learning | Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 course website](https://cs229.stanford.edu/)
- [CS229 main lecture notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

Checked: 2026-10-12.

Content check: verified against the video transcript (2026-10-12): the whole post was written section by section from this video's English transcript (about 37 minutes), and every quoted English sentence comes from the transcript. I did not watch the slides or the demo video, so for things the lecturer says while pointing at the screen (the points on the plot, the gene table, the word vector figure) the post covers only what he describes out loud. Numbers the lecturer gives from memory (the size of ImageNet, AlexNet's accuracy, the vocabulary size) are recorded as stated and were not checked independently.

## References

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 1: Introduction (YouTube)](https://www.youtube.com/watch?v=DATnpGoGhM8): the source for the whole post; the lecture content and quotes all come from its English transcript.
- [CS229 main lecture notes, main_notes.pdf (August 2026 version)](https://cs229.stanford.edu/main_notes.pdf): the notation and house price example on pages 6–8, and the six parts and page numbers from the table of contents.
- [Stanford CS229 course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): the instructors this quarter, and the finding that the playlist is missing two guest lectures.
