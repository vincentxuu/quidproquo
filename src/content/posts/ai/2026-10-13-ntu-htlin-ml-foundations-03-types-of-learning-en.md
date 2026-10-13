---
title: "Types of Learning: Output Space, Labels, Protocol, and Input Space | NTU Hsuan-Tien Lin Machine Learning Foundations Lecture 3"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, supervised-learning, reinforcement-learning, feature-engineering]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 3
tldr: "This lecture takes the learning flow diagram from Lecture 1 and swaps one part at a time along four directions: the output space Y (binary classification, multiclass classification, regression, structured learning), the labels yₙ (supervised, unsupervised, semi-supervised, reinforcement learning), the way data reaches the algorithm (batch, online, active), and the input space X (concrete, raw, abstract features). Each direction has one core option, and together they mark the home ground for the rest of Foundations: batch, supervised binary classification and regression on concrete features."
description: "A guide to Lecture 3 of NTU Hsuan-Tien Lin's Machine Learning Foundations, Types of Learning: classifying learning problems along four axes (output space, data label, protocol, and input space), explaining the handout's coin recognition, dog training, spam filter, and handwritten digit examples, and working through small made-up data sets for the distances between coins, online PLA, active querying, and feature conversion."
draft: false
glossary:
  - term: "structured learning"
    definition: "A learning problem whose output is a whole object with internal structure (the word class of every word in a sentence, the 3D shape of a protein, a parse tree). It can be seen as multiclass classification with so many classes that they cannot be listed one by one."
    context: "The fourth kind of problem Foundations Lecture 3 gives on the output space axis; this course does not teach how to solve it."
  - term: "semi-supervised learning"
    definition: "Only part of the data (usually a small part) comes with labels yₙ and the rest has only xₙ; the algorithm uses both kinds of data."
    context: "Foundations Lecture 3 uses it to show what to do when labels are expensive; the Fun Time question of that section is this kind of problem."
  - term: "active learning"
    definition: "The algorithm may pick an xₙ itself and ask what its label yₙ is, with the goal of learning an equally good hypothesis from fewer labels."
    context: "The third option on the protocol axis in Foundations Lecture 3, alongside batch and online."
  - term: "abstract features"
    definition: "Inputs that carry almost no physical meaning, such as user IDs and item IDs. The size and order of the numbers say nothing about any property."
    context: "Foundations Lecture 3 uses the KDDCup 2011 rating prediction problem as the example."
---

> 🌏 [中文版](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-03-types-of-learning)

**Video status: Videos included.** This article is written from the official MOOC handout [03_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/03_handout.pdf) and transcripts of this lecture's four official videos, with terms and notation following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/29 to 29/29), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Foundations Lecture 3 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Foundations into four questions, and this lecture still sits under the first one, "When Can Machines Learn?". The previous lecture, [Foundations Lecture 2: Perceptrons and PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en), takes up a single line on the Roadmap: PLA takes linear separable data $\mathcal{D}$ and perceptrons $\mathcal{H}$ to get hypothesis $g$. That is one very specific kind of learning problem: the output is only yes or no, every example comes with its answer, the data arrives all at once, and the input is a handful of tidy numbers. This lecture loosens those four things one at a time and looks at what else each position in the flow diagram could hold.

The four sections listed on the Roadmap are the four positions that can be swapped:

| Section | Which part of the flow diagram is swapped | The handout's notation |
|---|---|---|
| Learning with Different Output Space | the set of outputs | $\mathcal{Y}$ |
| Learning with Different Data Label | the answer attached to each example | $y_n$ |
| Learning with Different Protocol | how information about the target function becomes data and reaches the algorithm | $f \Rightarrow (\mathbf{x}_n, y_n)$ |
| Learning with Different Input Space | the set of inputs | $\mathcal{X}$ |

This lecture has almost no formulas. Its content is a classification table and examples for each cell. A lecture like this is easy to finish feeling you understood everything, and then you meet a real problem and cannot label it. So this article makes up a small data set in every section and computes the difference that section is about. The prerequisites are the five symbols from [Foundations Lecture 1: The Learning Problem](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron-en) ($f$, $\mathcal{D}$, $\mathcal{A}$, $\mathcal{H}$, $g$) and PLA from the previous lecture. After reading, you should be able to label a learning problem once on each of the four axes, give the reason for each label, and say how far the problem is from the cell this course mainly deals with.

## Different output spaces: what kinds of questions exist beyond yes/no

```youtube
url: https://www.youtube.com/watch?v=XyJQm4mvVUA
title: Types of Learning :: Learning with Different Output Space @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–04:19 reviews the previous lecture and binary classification, 04:19–08:21 multiclass classification, 08:24–11:02 regression, 11:05–15:28 structured learning, 15:28–16:35 the mini summary, followed by Fun Time.)

### Binary classification: the yes/no question we can already answer

Page 2 of the handout shows the credit approval flow diagram again and adds just one row under the applicant's table: credit? $\{\text{no}(-1), \text{yes}(+1)\}$. The bottom of the page reads:

$$
\mathcal{Y} = \{-1, +1\}: \text{binary classification}
$$

The output has only two possible values, which is called binary classification; in the lecture, Lin's plain-language name for it is a yes/no question. Page 3 shows three figures, each with blue circles and red crosses on a plane, split by a boundary into a blue region and a red one. In the left figure the boundary is a straight line and the split is clean. In the middle figure it is also a straight line, but a few points fall on the wrong side. In the right figure the boundary is a circle with the blue circles inside it. In the lecture, Lin says that later on we will learn to separate the two regions with curves other than straight lines.

The same page lists five examples of binary classification: credit approve/disapprove, email spam/non-spam, patient sick/not sick, ad profitable/not profitable, and answer correct/incorrect. The last one is marked KDDCup 2010. In the lecture, Lin says this is the problem mentioned earlier that Lin's team had to solve in the KDD Cup competition: predicting whether a student in an online tutoring system will answer the next question correctly.

The handout's remark on binary classification is: core and important problem with many tools as building block of other tools. In the lecture, Lin explains that much of the theory and many practical algorithms in machine learning start from binary classification, a bit like having to answer yes/no questions before you can answer more complicated ones.

### Multiclass classification: how a vending machine recognizes coins

The example on page 4 is recognizing US coins. In the lecture, Lin says most people have probably used this application: a vending machine has to decide which coin you just put in. There are four common US coins, 1 cent, 5 cents, 10 cents, and 25 cents (the handout writes 1c, 5c, 10c, 25c). The handout's figure is a scatter plot with size (Size) on the horizontal axis and weight (Mass) on the vertical axis. The four coins each form a cluster, marked in four colors:

| Position | Coin | Note |
|---|---|---|
| Lower left | 10c | the smallest and lightest |
| Just to the upper right of 10c | 1c | very close to 10c |
| Middle, toward the upper right | 5c | |
| Upper right | 25c | the largest and heaviest |

In the lecture, Lin makes a point of noting that US coins are not sized by face value: the 10-cent coin is the smallest and lightest of them all. This detail comes back in the section on labels.

The output now has four possible values. The handout writes $\mathcal{Y} = \{1c, 5c, 10c, 25c\}$, or more abstractly

$$
\mathcal{Y} = \{1, 2, \cdots, K\}
$$

Here $K = 4$. Binary classification is the special case with $K = 2$. In the lecture, Lin's plain-language name is a multiple-choice question: a yes/no question has only two options, circle or cross, and now there are four or five options from which to pick the one correct answer.

An addition in this article, which will be needed later to tell multiclass classification from regression: the numbers in $\{1, 2, \cdots, K\}$ are only names for the classes. Coding 10c as 1, 1c as 2, and 5c as 3 does not mean 1c lies "between" 10c and 5c, and you certainly cannot average the codes of two classes.

Other examples in the handout: recognizing written digits as 0 to 9 (in the lecture, Lin says zip code recognition uses this), deciding whether a picture shows an apple, an orange, or a strawberry, and sorting emails into spam, primary, social, promotion, and update (the handout marks this Google; in the lecture, Lin says Google's mail service was rolling out this kind of automatic sorting at the time). The remark at the bottom of the page is: many applications in practice, especially for 'recognition'. In the lecture, Lin says this means visual or auditory recognition.

### Regression: the output is a real number

Page 5 uses three questions from a hospital to put three kinds of output side by side:

- binary classification: patient features ⇒ sick or not
- multiclass classification: patient features ⇒ which type of cancer
- regression: patient features ⇒ how many days before recovery

In the lecture, Lin makes the third question more concrete: a patient has just had surgery, and we want to know how long until discharge, a number of days, or even days, hours, and seconds. The output space becomes the whole real line, or an interval of it:

$$
\mathcal{Y} = \mathbb{R} \qquad \text{or} \qquad \mathcal{Y} = [\text{lower}, \text{upper}] \subset \mathbb{R}
$$

The handout calls the latter bounded regression. The bounded example in the lecture is grading: a score lies between 0 and 100, so you cannot give more than 100 points or deduct below 0.

The handout adds a line here: deeply studied in statistics. In the lecture, Lin says this problem has been studied in statistics for decades, and anyone who has learned linear regression has seen a typical regression problem; this course will cover it again later from the machine learning point of view. Other examples: company data ⇒ stock price, climate data ⇒ temperature. The remark at the bottom of the page is almost the same as the one for binary classification: also core and important with many 'statistical' tools as building block of other tools.

The difference between regression and multiclass classification is whether the size of the output number means anything. If the recovery time is 6 days or 7 days, the two answers differ by one day, and guessing 6.5 makes sense too. Coin classes 2 and 3 have no such thing as "differing by one".

### Structured learning: the output is a whole structure

The example on page 6 comes from natural language processing: given a sentence, tag the word class of every word. The sentence drawn in the handout is I love ML, with pronoun, verb, and noun marked under the three words.

There are two ways to look at this problem, and the handout writes them side by side:

- multiclass classification: word ⇒ word class. Look at one word at a time and output its word class.
- structured learning: sentence ⇒ structure (class of each word). Look at the whole sentence at once and output the whole sequence of word classes.

Why look at the whole sentence together? In the lecture, Lin explains that a sentence has structure. The word love may be a verb or a noun, and that is hard to decide from the word alone. With the whole sentence as input, its position in the sentence can be used: if it follows a noun, for example, it is more likely to be a verb.

When the whole sentence is considered together, the output space is "all grammatical sequences of word classes". The handout uses P, V, N for pronoun, verb, and noun:

$$
\mathcal{Y} = \{PVN, PVP, NVN, PV, \cdots\}, \quad \text{not including } VVVVV
$$

In the lecture, Lin goes through them one by one: pronoun, verb, noun is a correct English sentence; so is pronoun, verb, pronoun; and if the verb is intransitive, pronoun plus verb works as well. Five verbs in a row can never be grammatical, so $VVVVV$ is not in $\mathcal{Y}$.

The handout describes this kind of problem as a huge multiclass classification problem (structure ≡ hyperclass) without 'explicit' class definition: treat each structure as one class, and you get a multiclass classification problem with a very large number of classes that cannot be listed one by one. In the lecture, Lin says the classes are hidden underneath and are related to one another structurally; all the correct sentences are hard to enumerate, because that also depends on the length of the sentence.

### Numerical example: how many word-class sequences there are

The following calculation is made up for this article and is not on the slides; it shows how big huge is. Suppose there are only the three word classes the handout uses, P, V, and N. For a sentence of $L$ words, each word can be tagged in 3 ways, so there are $3^L$ candidate sequences:

| Sentence length $L$ | Candidate sequences $3^L$ | Mentioned in the handout |
|---|---|---|
| 1 | 3 | |
| 2 | 9 | $PV$ |
| 3 | 27 | $PVN$, $PVP$, $NVN$ |
| 4 | 81 | |
| 5 | 243 | $VVVVV$ (ungrammatical, excluded) |

Lengths 1 to 5 add up to $3 + 9 + 27 + 81 + 243 = 363$ candidates, and $\mathcal{Y}$ is the grammatical part of them. That is with only three word classes and at most five words. With $K$ word classes and a sentence of $L$ words, the number of candidates is $K^L$; taking $K = 10$ and $L = 20$ gives $10^{20}$.

**What this result means.** For coin recognition you can collect a few dozen samples of every class. With $10^{20}$ "classes" it is impossible to have samples of every class, or even to write the classes down, and that is what the handout means by without 'explicit' class definition. In the other direction, if you split the problem into multiclass classification word by word, a three-word sentence is just 3 small problems with 3 classes each, and the number of classes is no issue at all. But each word is decided independently, so there is no mechanism to rule out an answer like $VVV$ that is unreasonable as a whole. Structured learning wants the benefit of both sides: output the whole structure, and use the regularity of the structure itself to narrow down the candidates.

Other examples in the handout: protein data ⇒ protein folding, speech data ⇒ speech parse tree. In the lecture, Lin says that where a protein's 3D shape bends and folds affects how it acts in a living organism. The remark at the bottom of the page is: a fancy but complicated learning problem. In the lecture, Lin explains how this course relates to it: its solutions mostly extend from multiclass classification, and this course will not teach the specific methods. It is mentioned so that everyone knows machine learning is not only yes/no and multiple-choice questions, and so that when you do run into such a problem you will see how it connects to the others.

### Mini summary of this section: the core is binary classification and regression

Page 7 lists the four output spaces next to the flow diagram:

| Problem | Output space $\mathcal{Y}$ |
|---|---|
| binary classification | $\{-1, +1\}$ |
| multiclass classification | $\{1, 2, \cdots, K\}$ |
| regression | $\mathbb{R}$ |
| structured learning | structures |

The last line of the list is . . . and a lot more!!, so these four are only the more important ones. The bottom of the page reads: core tools: binary classification and regression. In the lecture, Lin says later lectures will spend more time on tools for these two problems, and those tools can be used to build more complicated tools that solve other kinds of problems.

### Fun Time: the entrance system of the school gym

**Question (page 8):** The entrance system of the school gym, which does automatic face recognition based on machine learning, is built to charge four different groups of users differently: Staff, Student, Professor, Other. What type of learning problem best fits the need of the system?

1. binary classification
2. multiclass classification
3. regression
4. structured learning

**Answer: 2.** The handout's explanation is one sentence: There is an 'explicit' $\mathcal{Y}$ that contains four classes. The output is four classes that can be written down, $K = 4$. In the lecture, Lin adds that these four classes really can be written out and there is no hidden structure in them.

The other options (the following is this article's reasoning): option 1 has only two classes, which cannot hold four groups. Option 3 is the tempting one, because the system ends up "charging different amounts" and money is a number. But what the system has to decide from the face is the group, and the fee is only the result of a table lookup. The four groups have no order of size, and "between Student and Professor" means nothing, which is exactly the earlier point that class codes cannot be used as real numbers. Option 4 needs an output with internally related structure, and here each output is a single group.

## How many labels are given: does every example have an answer

```youtube
url: https://www.youtube.com/watch?v=8w1lDGaoFTI
title: Types of Learning :: Learning with Different Data Label @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–01:21 supervised, 01:21–04:34 clustering, 04:34–07:35 other unsupervised problems, 07:38–10:32 semi-supervised, 10:35–16:04 reinforcement learning, 16:04–17:24 the mini summary, followed by Fun Time.)

This section sticks with coin recognition as the example and changes only one thing: how many of the $y_n$ in the training data are given.

### Supervised: every xₙ comes with a yₙ

Page 9 puts the colored scatter plot of the coins back into the flow diagram, and the bottom of the page reads: supervised learning: every $\mathbf{x}_n$ comes with corresponding $y_n$. Besides its size and weight, each coin comes with which kind it is. The credit card problem and PLA in the first two lectures were both in this setting; it just had not been given a name yet.

In the lecture, Lin explains the word "supervised": supervision is like a teacher. The teacher hands the coins to the student and says this one is 10 cents and that one is 1 cent, for every single coin. It is a complete form of teaching.

### One coin data set used throughout this section

The data below is made up for this article and is not on the slides. There are eight coins, two of each kind. Size and weight are each converted to a scale from 1 to 11; the numbers were chosen to make the arithmetic easy and are not the specifications of real coins. The relative positions of the four kinds follow the handout's figure: 10c at the lower left, 1c right next to it, 25c at the upper right.

| Coin | $\mathbf{x}_n$ = (size, weight) | $y_n$ |
|---|---|---|
| 1 | $(1, 1)$ | 10c |
| 2 | $(2, 2)$ | 10c |
| 3 | $(4, 2)$ | 1c |
| 4 | $(4, 3)$ | 1c |
| 5 | $(7, 5)$ | 5c |
| 6 | $(8, 6)$ | 5c |
| 7 | $(10, 9)$ | 25c |
| 8 | $(11, 9)$ | 25c |

**The supervised approach.** The handout does not specify an algorithm here, so this article picks the one that is easiest to compute by hand: compute a center for each class (the average of the points in that class), and assign a new coin to the class whose center is nearest. The four centers are

$$
\text{10c}: (1.5, 1.5), \quad \text{1c}: (4, 2.5), \quad \text{5c}: (7.5, 5.5), \quad \text{25c}: (10.5, 9)
$$

A coin at $(3, 2)$ is put into the vending machine. Its squared distances to the four centers are

$$
\begin{aligned}
\text{10c}: \ & (3 - 1.5)^2 + (2 - 1.5)^2 = 2.5 \\
\text{1c}: \ & (3 - 4)^2 + (2 - 2.5)^2 = 1.25 \\
\text{5c}: \ & (3 - 7.5)^2 + (2 - 5.5)^2 = 32.5 \\
\text{25c}: \ & (3 - 10.5)^2 + (2 - 9)^2 = 105.25
\end{aligned}
$$

The nearest is 1c, so $g((3, 2)) = \text{1c}$. This approach used all eight $y_n$: without labels, there is no way to know which coins should be grouped together to compute a center.

### Unsupervised: take away all the yₙ

Page 10 asks: if the machine is not told what each coin is, can it still learn something? The handout draws the same scatter plot twice. The left one is in color and labeled supervised multiclass classification. In the right one every point is painted the same blue, so all the machine sees is positions. This page comes in two versions, and the second version draws three circles on the right figure that group the points into three clusters. The handout's label is

$$
\text{unsupervised multiclass classification} \iff \text{'clustering'}
$$

Multiclass classification without labels amounts to clustering. Lin's analogy in the lecture is tossing a pile of coins to a child and letting the child play and decide how to sort them into piles, with nobody saying which coin is worth how much. Even without answers, the points are not scattered at random on the plane: on the left there are some that are smaller and lighter, and on the right some that are larger and heavier.

In the lecture, Lin then points out what makes clustering hard; the handout's figure only draws three circles and does not spell out the reasons:

- Everyone knows there are four kinds of coins, but looking only at the right figure you may well think there are just three clusters, because the 10-cent and 1-cent coins look much the same.
- In classification you at least know there are four classes; in clustering you do not even know how many clusters there are.
- If someone says everything is one cluster, that is not really wrong either. So the quality of a clustering is harder to measure than that of a classification.

Look at these three points with the eight coins above (the following observation is made up for this article and is not on the slides). Cover the $y_n$ column, keep only the eight points, and measure how far apart the coins are:

| The two coins compared | Distance |
|---|---|
| The two coins of the same kind (all four kinds) | $1$ to $\sqrt{2} \approx 1.41$ |
| Coin 2 and coin 3 (the closest pair between 10c and 1c) | $2$ |
| Coin 4 and coin 5 (the closest pair between 1c and 5c) | $\sqrt{13} \approx 3.61$ |
| Coin 6 and coin 7 (the closest pair between 5c and 25c) | $\sqrt{13} \approx 3.61$ |

**What this table means.** The gap between 10c and 1c is 2, only slightly larger than the spacing inside a single kind of coin, while the other two gaps are 3.61. For someone who sees only positions, circling coins 1 to 4 as one group and drawing three clusters is a perfectly natural result, and this is what Lin means in the lecture by the 10-cent and 1-cent coins looking much the same. Drawing four clusters is defensible too, and nobody can call a single cluster of everything wrong, because there are no answers on hand to check against. In a supervised problem you can count how many coins were misclassified. An unsupervised problem has no such ready-made standard: to compare two ways of grouping, you first have to define separately what counts as "grouped well", and that criterion itself can be defined in many ways.

The handout lists two applications of clustering: articles ⇒ topics, and consumer profiles ⇒ consumer groups. In the lecture, Lin says the latter lets you run different promotions for different groups. The remark at the bottom of the page is: clustering: a challenging but useful problem.

Page 11 explains that clustering is only one kind of unsupervised learning, and matches three problems each to a supervised one:

| Unsupervised problem | Input ⇒ output | The handout's analogy | The handout's example |
|---|---|---|---|
| clustering | $\{\mathbf{x}_n\} \Rightarrow \text{cluster}(\mathbf{x})$ | ≈ unsupervised multiclass classification | articles ⇒ topics |
| density estimation | $\{\mathbf{x}_n\} \Rightarrow \text{density}(\mathbf{x})$ | ≈ unsupervised bounded regression | traffic reports with location ⇒ dangerous areas |
| outlier detection | $\{\mathbf{x}_n\} \Rightarrow \text{unusual}(\mathbf{x})$ | ≈ extreme unsupervised binary classification | Internet logs ⇒ intrusion alert |

What Lin says about the latter two in the lecture: density estimation gives the machine a set of points and asks where they are dense and where they are sparse, for example handing it the accident records of every intersection and asking where accidents happen more often. It resembles bounded regression because what we want to know is what the underlying function, something like a density or a probability, looks like. Outlier detection is for data that is mostly normal with a small strange part; for example, strange data in network traffic may indicate an intruder, or a machine that is not working properly. It resembles a very extreme yes/no question because the "yes" cases are very rare, and precisely because they are rare, labeled data is hard to obtain.

The remark at the bottom of the page is: unsupervised learning: diverse, with possibly very different performance goals. In the lecture, Lin says that with supervised learning the labels are there, so the goal is more or less clear; the goals of unsupervised learning are more scattered, and how good an algorithm is tends to be harder to measure.

### Semi-supervised: only a few yₙ

Page 12 lines up three situations in a row: the left figure is all in color (supervised), the right figure is all blue (unsupervised, clustering), and the middle one is mostly blue points with only a few colored ones, labeled semi-supervised. In the lecture, Lin says this is the situation in between: the machine is told the answer for a few points and not for most of them.

The handout's two examples:

- face images with a few labeled ⇒ face identifier (the handout marks this Facebook)
- medicine data with a few labeled ⇒ medicine effect predictor

In the lecture, Lin explains that what the two examples share is that labels are expensive. For the photos, someone has to sit down and label whose face is in each picture, and after ten pictures nobody wants to go on; a given person may have only two labeled photos, and we hope the machine will recognize that person in the many unlabeled ones by itself. For the medicines, animal experiments and human trials are both costly, so only a small share of the drugs can be tested to find out whether they work. The summary at the bottom of the page is: semi-supervised learning: leverage unlabeled data to avoid 'expensive' labeling. In the lecture, Lin describes it as somewhat like supervised learning, but using a large amount of not-yet-labeled data to push performance further.

Back to the eight coins (the following demonstration is made up for this article; the handout does not specify a semi-supervised method, and the "cluster first, then name" approach used here is only the one that is easiest to do by hand). Suppose paying someone to look at coins costs money, and only four were labeled:

- Labeled: coin 1 is 10c, coin 4 is 1c, coin 5 is 5c, coin 8 is 25c.
- Unlabeled: coins 2, 3, 6, 7, for which only size and weight are known.

The approach has three steps:

1. Ignore the labels for now and split the eight points into four clusters: circle each coin together with the one nearest to it, which gives $\{1, 2\}$, $\{3, 4\}$, $\{5, 6\}$, $\{7, 8\}$. Here the algorithm is simply told to make four clusters; as said above, the number of clusters is itself the hardest thing to decide in clustering. This step used all eight $\mathbf{x}_n$, so the four unlabeled coins contribute too.
2. Each cluster happens to contain exactly one labeled coin, which is used to name the whole cluster: $\{1, 2\}$ is 10c, $\{3, 4\}$ is 1c, $\{5, 6\}$ is 5c, $\{7, 8\}$ is 25c.
3. All eight coins now have a class. Computing centers the supervised way gives exactly the same four centers as before, and $(3, 2)$ is again classified as 1c.

**What this result means.** For the cost of only four labels we got the same $g$ as with eight labels. The unlabeled data supplies "which points belong together", and the few labels supply "what this group is called". An addition in this article is the condition under which this works: the clusters the data forms on its own must line up with the true classes. If the same coins were split into only three clusters, coin 1 and coin 4 would land in the same cluster, one saying 10c and the other saying 1c, and that cluster could not be named. A cluster with no labeled coin in it could not be named either.

### Reinforcement learning: no answer, only whether what you just did was good

The subtitle on page 13 is: a 'very different' but natural way of learning. The handout uses training a dog as the example, under the heading Teach Your Dog: Say 'Sit Down', and the page comes in two versions.

**Version one.** You say "sit down", and the dog pees on the ground (The dog pees on the ground). You scold it: BAD DOG. THAT'S A VERY WRONG ACTION. The two lines below it in the handout are:

- cannot easily show the dog that $y_n$ = sit when $\mathbf{x}_n$ = 'sit down'
- but can 'punish' to say $\tilde{y}_n$ = pee is wrong

**Version two.** You say "sit down", and the dog really does sit down. You say Good Dog and give it cookies.

- still cannot show $y_n$ = sit when $\mathbf{x}_n$ = 'sit down'
- but can 'reward' to say $\tilde{y}_n$ = sit is good

There are two symbols to keep apart here. $y_n$ is the correct output you have in mind. $\tilde{y}_n$ is the output the learner actually produced. Supervised learning hands $(\mathbf{x}_n, y_n)$ straight to the machine. When training a dog, you cannot directly hand over the fact that "sitting is the right thing"; all you can give is an evaluation of $\tilde{y}_n$, good or not good. The handout writes this kind of data as a triple:

$$
(\mathbf{x}, \tilde{y}, \text{goodness})
$$

In the lecture, Lin stresses that being rewarded does not mean the most correct thing was done. You say sit down and the dog shakes hands with you instead; you may still be pleased and still give it a cookie. The reward only says this action was good, not that it was the one you were hoping for most.

The handout's two applications:

- (customer, ad choice, ad click earning) ⇒ ad system
- (cards, strategy, winning amount) ⇒ black jack agent

Lin's explanation in the lecture: an ad system is, in effect, being trained by its customers. The input is the customer's data, the system chooses an ad to show, which is $\tilde{y}$, and whether the customer clicks and earns you money is how good that choice was. In blackjack, you hold a certain hand, decide not to draw another card, and then lose or win. That only tells you whether not drawing was good this one time; it does not tell you which of drawing and not drawing was the best.

The following small example is made up for this article and writes "only knowing how good the choice you made was" as data. An ad system has three ads, A, B, and C, and has recorded six impressions:

| Impression | $\mathbf{x}$ (customer) | $\tilde{y}$ (ad shown) | goodness (earning) |
|---|---|---|---|
| 1 | student | A | 0 |
| 2 | student | B | 5 |
| 3 | office worker | A | 8 |
| 4 | student | B | 3 |
| 5 | office worker | C | 0 |
| 6 | office worker | A | 6 |

Average the earnings for the same kind of customer and the same ad: students shown A average 0 (1 time) and shown B average 4 (2 times); office workers shown A average 7 (2 times) and shown C average 0 (1 time). The two cells for students shown C and office workers shown B were never tried. Each of the six impressions could have shown any of three ads, so there are 18 questions of the form "what would happen if this customer saw this ad", and the data answers only 6 of them.

**What this result means.** In supervised data, each row would state directly "which ad should be shown to this customer", that is, $y_n$. No row here says that. Showing B to students earned a positive amount, but nobody knows whether C would do better, because C was never shown to a student. This is what the handout's footer means by learn with 'partial/implicit information'; as for the often sequentially in the parentheses after it, Lin says in the lecture that the explanation is left for the discussion of protocol.

### Mini summary of this section: the core is supervised learning

The list on page 14:

| Type | State of the labels |
|---|---|
| supervised | all $y_n$ |
| unsupervised | no $y_n$ |
| semi-supervised | some $y_n$ |
| reinforcement | implicit $y_n$ by goodness($\tilde{y}_n$) |

The last line is again . . . and more!!. The bottom of the page reads: core tool: supervised learning. In the lecture, Lin says many other methods grew out of supervised methods, so supervised learning is the focus of this course.

### Fun Time: the tree recognition system

**Question (page 15):** To build a tree recognition system, a company decides to gather one million of pictures on the Internet. Then, it asks each of the 10 company members to view 100 pictures and record whether each picture contains a tree. The pictures and records are then fed to a learning algorithm to build the system. What type of learning problem does the algorithm need to solve?

1. supervised
2. unsupervised
3. semi-supervised
4. reinforcement

**Answer: 3.** The handout's explanation: The 1,000 records are the labeled $(\mathbf{x}_n, y_n)$; the other 999,000 pictures are the unlabeled $\mathbf{x}_n$. Do the arithmetic: $10 \times 100 = 1{,}000$ pictures are labeled and $1{,}000{,}000 - 1{,}000 = 999{,}000$ are not, so the labeled ones make up only $0.1\%$. In the lecture, Lin says this is a typical semi-supervised problem: hand the machine the labeled and the unlabeled pictures together and hope it does better.

The other options (this article's reasoning): option 1 needs a label on every picture, and here the vast majority have none. Option 2 needs no labels at all, and here there are 1,000 of them, with a clear goal, tree or no tree. For option 4 the data would have to look like "the system made a judgment and someone said whether that judgment was good"; the records in the question are people writing down the correct answer directly. The key is that the question says both the pictures and the records are fed to the algorithm. If the company trained only on the 1,000 labeled pictures and threw the rest away, the same data would become a supervised problem. While we are at it, label the output space axis too: the output is tree or no tree, which is binary classification.

## How data reaches the algorithm: all at once, one at a time, or let the machine ask

```youtube
url: https://www.youtube.com/watch?v=emLW7jLh-n0
title: Types of Learning :: Learning with Different Protocol @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–01:55 batch, 01:55–05:58 online, 05:58–09:11 active, 09:13–09:54 the mini summary, followed by Fun Time.)

This section is called Learning with Different Protocol, and the Roadmap writes it as $f \Rightarrow (\mathbf{x}_n, y_n)$: how information about the target function $f$ turns into individual examples and reaches the algorithm. In the lecture, Lin describes protocol as the way people and machines communicate, that is, how the data is fed to the machine.

### Batch: the whole batch at once

Page 16 shows the coin flow diagram once more, and the bottom of the page reads: batch supervised multiclass classification: learn from all known data. This one line labels three axes at once: the protocol is batch, the label is supervised, and the output is multiclass classification.

In the lecture, Lin describes the practice that the first two lectures never stated outright: first collect a pile of coins, say 200 of them, measure their size and weight and label which kind each is, then hand these 200 examples to the algorithm as one batch and get a $g$. This $g$ goes into the vending machine, and every coin put in afterwards is judged by the same $g$. Lin's analogy is tossing a book to the machine and letting it read and learn on its own.

Page 17 shows the colored and all-blue scatter plots again and lists three batch examples:

- batch of (email, spam?) ⇒ spam filter
- batch of (patient, cancer) ⇒ cancer classifier
- batch of patient data ⇒ group of patients

The third example has no labels and is unsupervised, yet it can still be batch. Protocol and label are two independent axes. The remark at the bottom of the page is: batch learning: a very common protocol.

### Online: data comes one example at a time and the hypothesis changes with it

The title of page 18 is Online: Spam Filter that 'Improves'. In the lecture, Lin starts from a question: is a spam filter really fed one batch of data, trained to a $g$, and then left untouched? The ones we use every day do not quite work like that. Emails come in one by one, the filter makes its call first, and when it is wrong you tell it. The handout puts the two kinds of filter side by side:

- batch spam filter: learn with known (email, spam?) pairs, and predict with fixed $g$.
- online spam filter, which sequentially repeats three things:
  1. observe an email $\mathbf{x}_t$
  2. predict spam status with current $g_t$, that is, compute $g_t(\mathbf{x}_t)$
  3. receive 'desired label' $y_t$ from user, and then update $g_t$ with $(\mathbf{x}_t, y_t)$

The subscript changes from $n$ to $t$ because the data now has an order in time. In the lecture, Lin points out two differences from batch: the hypothesis keeps changing, one per round, $g_1, g_2, g_3, \dots$; and the data is told to the machine one example at a time, not collected into a thousand emails first and handed over as a batch. The goal changes with it: batch hopes the one $g$ that comes out at the end is good, while online hopes the $g$ of each round keeps getting better. The footer puts it as: online: hypothesis 'improves' through receiving data instances sequentially.

The same page has a small box, Connection to What We Have Learned, containing two questions.

**PLA can be easily adapted to online protocol (how?)** Lin's answer in the lecture: what PLA does in each round is already to pick one example and check whether it is right, leave things alone if it is, and correct if it is wrong. Moving to online, every new email gets a prediction; if the prediction is right nothing happens, and if it is wrong the same correction as in PLA is made. Lin also says it can be proved that this variant of PLA works under the online protocol as well.

**reinforcement learning is often done online (why?)** Lin's answer in the lecture: reinforcement learning gets only partial information each time. We cannot tell the dog three things at once, whether sitting is right, whether relieving itself is right, whether shaking hands is right; each time we only learn whether the one action it took in that situation was good. So reinforcement learning data usually comes in one example at a time, which is closer to online. This is the answer to the often sequentially left over from the section on labels.

### An addition in this article: how many mistakes online PLA makes

The handout leaves only the question (how?) here, and in the lecture Lin only says it can be proved; neither writes out a proof. This whole subsection is a derivation added by this article with a numerical example made up for it, and is not content from the handout or the lecture. Everything it uses comes from [Foundations Lecture 2: Perceptrons and PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en).

First write the online version of PLA out clearly. Start from $\mathbf{w}_1 = \mathbf{0}$ (the previous lecture counted from $\mathbf{w}_0$; here the count starts from 1 so that the weights of round $t$ line up with email $t$, and nothing else changes). In round $t$:

1. Receive $\mathbf{x}_t$ (with $x_0 = 1$ already added), compute the score $\mathbf{w}_t^\top\mathbf{x}_t$, and predict $\text{sign}(\mathbf{w}_t^\top\mathbf{x}_t)$.
2. Receive $y_t$. If the prediction is wrong, that is, $y_t\mathbf{w}_t^\top\mathbf{x}_t \le 0$ (as in the previous lecture, a score of exactly 0 also counts as wrong), correct with $\mathbf{w}_{t+1} = \mathbf{w}_t + y_t\mathbf{x}_t$; if the prediction is right, $\mathbf{w}_{t+1} = \mathbf{w}_t$.

The batch version asks "will it halt". Online, emails keep coming and halting is not the issue; the question to ask is: how many mistakes will there be in total?

Assume the whole stream of data is linearly separable: there is some $\mathbf{w}_f$ with $y_t\mathbf{w}_f^\top\mathbf{x}_t > 0$ in every round. Following the previous lecture's notation, define

$$
R^2 = \max_{t}\lVert\mathbf{x}_t\rVert^2, \qquad \rho = \min_{t} y_t\frac{\mathbf{w}_f^\top}{\lVert\mathbf{w}_f\rVert}\mathbf{x}_t
$$

With linearly separable data, $\rho > 0$. The two facts proved in the previous lecture each describe only what happens before and after "one correction":

$$
\mathbf{w}_f^\top\mathbf{w}_{t+1} \ \ge\ \mathbf{w}_f^\top\mathbf{w}_t + \rho\lVert\mathbf{w}_f\rVert, \qquad \lVert\mathbf{w}_{t+1}\rVert^2 \ \le\ \lVert\mathbf{w}_t\rVert^2 + R^2
$$

The first uses the update rule and the definition of $\rho$; the second uses "correct only when $y_t\mathbf{w}_t^\top\mathbf{x}_t \le 0$". Neither uses whether the example was picked from a batch of old data or is new data that has just arrived, so both hold for online corrections just the same. In the rounds without a mistake, $\mathbf{w}$ does not change and neither quantity moves.

Suppose there are $M$ mistakes in total in the first $T$ rounds. Starting from $\mathbf{0}$, accumulate each inequality $M$ times:

$$
\mathbf{w}_f^\top\mathbf{w}_{T+1} \ \ge\ M\rho\lVert\mathbf{w}_f\rVert, \qquad \lVert\mathbf{w}_{T+1}\rVert \ \le\ \sqrt{M}R
$$

The cosine of the angle between two vectors is at most 1; use the lower bound in the numerator and the upper bound in the denominator:

$$
1 \ \ge\ \frac{\mathbf{w}_f^\top\mathbf{w}_{T+1}}{\lVert\mathbf{w}_f\rVert\lVert\mathbf{w}_{T+1}\rVert} \ \ge\ \frac{M\rho\lVert\mathbf{w}_f\rVert}{\lVert\mathbf{w}_f\rVert\cdot\sqrt{M}R} = \sqrt{M}\cdot\frac{\rho}{R} \quad\Longrightarrow\quad M \le \frac{R^2}{\rho^2}
$$

The right-hand side does not depend on $T$. Whether a thousand emails arrive or a million, as long as the whole stream is separable and $R$ and $\rho$ stay the same, the total number of mistakes never exceeds $R^2/\rho^2$. The previous lecture's "the number of corrections is bounded" reads, in the online setting, as "the number of mistakes is bounded".

**Numerical example (made up for this article, not on the slides).** A spam filter looks at only two features: how many times each of two keywords appears per hundred words, written $(x_1, x_2)$. The rule in the user's mind is that $x_1 + x_2 > 2$ means spam ($y = +1$), and the filter does not know this rule. Ten emails arrive in order:

| $t$ | Email $(x_1, x_2)$ | $\mathbf{w}_t$ in this round | Score | Prediction | $y_t$ | Mistake? | $\mathbf{w}_{t+1}$ |
|---|---|---|---|---|---|---|---|
| 1 | $(3, 0)$ | $(0, 0, 0)$ | $0$ | cannot decide | $+1$ | yes | $(1, 3, 0)$ |
| 2 | $(1, 0)$ | $(1, 3, 0)$ | $4$ | $+1$ | $-1$ | yes | $(0, 2, 0)$ |
| 3 | $(0, 3)$ | $(0, 2, 0)$ | $0$ | cannot decide | $+1$ | yes | $(1, 2, 3)$ |
| 4 | $(0, 1)$ | $(1, 2, 3)$ | $4$ | $+1$ | $-1$ | yes | $(0, 2, 2)$ |
| 5 | $(2, 2)$ | $(0, 2, 2)$ | $8$ | $+1$ | $+1$ | no | unchanged |
| 6 | $(1, 0.5)$ | $(0, 2, 2)$ | $3$ | $+1$ | $-1$ | yes | $(-1, 1, 1.5)$ |
| 7 | $(0.5, 0.5)$ | $(-1, 1, 1.5)$ | $0.25$ | $+1$ | $-1$ | yes | $(-2, 0.5, 1)$ |
| 8 | $(4, 1)$ | $(-2, 0.5, 1)$ | $1$ | $+1$ | $+1$ | no | unchanged |
| 9 | $(0, 2.5)$ | $(-2, 0.5, 1)$ | $0.5$ | $+1$ | $+1$ | no | unchanged |
| 10 | $(1.5, 0)$ | $(-2, 0.5, 1)$ | $-1.25$ | $-1$ | $-1$ | no | unchanged |

Take email 6 to show how one row is computed: $\mathbf{x}_6 = (1, 1, 0.5)$, the score is $0 \cdot 1 + 2 \cdot 1 + 2 \cdot 0.5 = 3$, and the prediction is spam; the user says it is not ($y_6 = -1$), so it is a mistake, and $\mathbf{w}_7 = (0, 2, 2) - (1, 1, 0.5) = (-1, 1, 1.5)$.

Ten emails, 6 mistakes, all within the first 7 emails; the last 3 are all predicted correctly. Compare with the bound: the longest vector is email 8, $\lVert\mathbf{x}_8\rVert^2 = 1 + 16 + 1 = 18$, so $R^2 = 18$. Take $\mathbf{w}_f = (-2, 1, 1)$ (which is the line $x_1 + x_2 = 2$). The smallest $y_t\mathbf{w}_f^\top\mathbf{x}_t$ over the ten emails is $0.5$ and $\lVert\mathbf{w}_f\rVert = \sqrt{6}$, so $\rho^2 = 0.25/6 = 1/24$ and the bound is $18 \times 24 = 432$. The actual 6 is far below it.

**What this example means.** Take the $\mathbf{w}$ at the end of each round and score all ten emails with it: the number of emails it gets wrong is, in order, 5, 7, 5, 5, 5, 5, 1, 1, 1, 1 (before starting it is 10). The overall trend is improvement, with one round that slips from 5 back to 7: correcting for one email can break others, the same phenomenon seen in the previous lecture. The final $\mathbf{w} = (-2, 0.5, 1)$ still gets 1 email wrong, the very first one to arrive: $-2 + 0.5 \times 3 = -0.5$, which has the opposite sign from $y_1 = +1$. Online does not go back and check old emails, so what the bound guarantees is "the total number of mistakes along the way", not that the final $g$ is right on every email it has seen. If that email came again, the filter would be wrong once more and correct once more, and that time would count against the same budget of 432. The batch version of PLA keeps cycling through the same batch of data and stops only when everything is classified correctly; this is where the difference between the two protocols shows most clearly.

### Active: let the machine pick the questions to ask

The title of page 19 is Active Learning: Learning by 'Asking'. The handout adds an orange arrow to the flow diagram, pointing from the algorithm $\mathcal{A}$ back to the target function $f$: data no longer flows only one way from $f$ to $\mathcal{A}$, and $\mathcal{A}$ can turn around and put questions to $f$. The box beside it matches the three protocols to three ways of learning (Protocol ⇔ Learning Philosophy):

| protocol | The handout's wording | The analogy in the lecture |
|---|---|---|
| batch | 'duck feeding' | cramming: you are tossed a book with all the answers written in and told to study it yourself |
| online | 'passive sequential' | a teacher teaching: gives one example, tells you the answer, then gives the next |
| active | 'question asking' (sequentially), query the $y_n$ of the chosen $\mathbf{x}_n$ | a student asking questions |

In the lecture, Lin points out what the first two have in common: from the machine's point of view both are passive, doing whatever it can with whatever data it is fed. Active learning gives the algorithm a new ability: it can put forward an $\mathbf{x}$ and ask what the $y$ of this input is. Lin's example is handwriting recognition: the machine can write a character itself, or pick one it cannot yet recognize, and ask you whether this is a 9 or a 7. Lin says that at the time this was a relatively new and widely studied setting in machine learning.

The reason for doing this is in the footer: active: improve hypothesis with fewer labels (hopefully) by asking questions strategically. In the lecture, Lin says there is a skill to asking questions, and by asking skillfully the machine may learn quickly from very few questions; it is used where labels are expensive, a starting point similar to that of semi-supervised learning. The hopefully in parentheses is the handout's own, marking this as a hope and not a guarantee.

### Numerical example: ask 4 times, or label 16 times

The following example is made up for this article and is not on the slides; it shows how much strategically can save. There are 16 coins on the table, of only two kinds, 1c and 5c, already lined up from lightest to heaviest and numbered 1 to 16. Assume a 1c is always lighter than a 5c, so the front part of the row is all 1c and the back part is all 5c; we just do not know at which coin the change happens. Having a person identify one coin costs one label. The truth is that the first 11 coins are 1c (the algorithm does not know this).

The batch approach has a person label all 16 coins and spends 16 labels. The active approach asks each time about the coin in the exact middle of "the range that is still uncertain":

| Query | Uncertain range before asking | Coin picked | Answer received | What is settled after asking |
|---|---|---|---|---|
| 1 | 1 to 16 | 8 | 1c | 1 to 8 are all 1c |
| 2 | 9 to 16 | 12 | 5c | 12 to 16 are all 5c |
| 3 | 9 to 11 | 10 | 1c | 9 and 10 are 1c |
| 4 | 11 | 11 | 1c | 11 is 1c, everything is settled |

After 4 queries, the classes of all 16 coins are known. Nobody looked at the other 12; they were inferred from "the order by weight" plus "the answers already obtained".

The count varies slightly when the change point falls elsewhere: 16 coins have 17 possible change points (including all 1c and all 5c), and this way of asking takes at least 4 queries and at most 5. Each query roughly halves the uncertain range, so $N$ coins need about $\log_2 N$ queries; a million coins need about 20 ($\log_2 10^6 \approx 19.9$), while labeling them all takes a million.

**What this example means.** The labels saved come from "picking": each time, ask about the coin you are least sure of at that moment, and do not ask about the ones you are already sure of. Pick badly and the effect is gone: asking in order from coin 1, you would not see the first 5c until coin 12. This article should also point out that the example was deliberately made very clean: the data has a single dimension and no noise at all. Real problems are rarely this ideal, which is why the handout writes hopefully.

### Mini summary of this section: the core is batch

The list on page 20:

| protocol | How the data arrives |
|---|---|
| batch | all known data |
| online | sequential (passive) data |
| active | strategically-observed data |

The last line is . . . and more!!. The bottom of the page reads: core protocol: batch. In the lecture, Lin says this course will focus on batch, because once many batch algorithms are learned, extending them to online or other settings is fairly easy, and PLA is one example.

### Fun Time: sorting baseball photos

**Question (page 21):** A photographer has 100,000 pictures, each containing one baseball player. He wants to automatically categorize the pictures by its player inside. He starts by categorizing 1,000 pictures by himself, and then writes an algorithm that tries to categorize the other pictures if it is 'confident' on the category while pausing for (& learning from) human input if not. What protocol best describes the nature of the algorithm?

1. batch
2. online
3. active
4. random

**Answer: 3.** The handout's explanation: The algorithm takes a active but naïve strategy: ask when 'confused'. You should probably do the same when taking a class :-). The algorithm decides for itself which pictures to ask a person about, and the moment it asks is when it is confused. In the lecture, Lin says the keyword is "ask" and that this is a typical approach in active learning; Lin also takes the opportunity to say that questions are welcome whenever something in the lecture is confusing.

This strategy is the same thing as the 16-coin example above: there, "the range that is still uncertain" is the set of coins the algorithm is not confident about, and it classifies the coins outside that range itself without asking anyone.

The other options (this article's reasoning): for option 1, it would be batch only if the photographer learned a fixed $g$ from those 1,000 pictures and never asked a person for another label; in the question the algorithm stops to ask for labels and keeps learning. Option 2, online, is passive: data shows up in the order it comes, and the answer for each example is given by the other side; here the algorithm singles out particular pictures to ask about. Option 4, random, is not a protocol introduced in this lecture, and the algorithm picks pictures by whether it is confident, not at random. One small difference: the handout's question has concrete numbers (1,000 labeled first out of 100,000, that is, 1%), and when reading the question aloud in the lecture Lin leaves the numbers out and only says there are many pictures and they cannot all be labeled by hand.

## What the input looks like: how much meaning the features carry

```youtube
url: https://www.youtube.com/watch?v=cIsgI7tktQM
title: Types of Learning :: Learning with Different Input Space @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–02:43 concrete features, 02:45–07:42 raw features, 07:45–10:23 abstract features, 10:26–10:59 the mini summary, 10:59–11:59 Fun Time, followed by the summary of the whole lecture and a preview of the next one.)

In the lecture, Lin first places this section: most of what came before had to do with the output side, and now we finally turn back to see how the input $\mathbf{x}$ can vary. Lin also introduces a word that will keep appearing from here on: each dimension of the input is often called a feature.

### Concrete features: every dimension has a carefully chosen meaning

Page 22 shows the credit card flow diagram once more, this time focusing on the applicant's table: age 23 years, gender female, annual salary NTD 1,000,000, year in residence 1 year, year in job 0.5 year, current debt 200,000. The bottom of the page reads:

$$
\text{concrete features: each dimension of } \mathcal{X} \subseteq \mathbb{R}^d \text{ represents 'sophisticated physical meaning'}
$$

Every dimension has a concrete meaning that has already been worked out. In the lecture, Lin explains that these fields represent fairly complex, already processed information that we believe is related to the output we want; that is exactly why the linear hypothesis of the previous lecture could weight these dimensions directly and add them up into a total score.

Page 23 lists examples used earlier: (size, mass) for coin classification, customer info for credit approval, patient info for cancer diagnosis, and adds a line: often including 'human intelligence' on the learning task. In the lecture, Lin calls this domain knowledge, a person's expertise about the problem: these features have been through a round of preprocessing in someone's head before being handed to the machine. The remark at the bottom of the page is: concrete features: the 'easy' ones for ML. In the lecture, Lin adds that easy is not really easy; it is easy relative to the two kinds that follow.

### Raw features: nothing but pixels

Page 24 is a grid of handwritten digit images, 6 rows by 9 columns, 54 digits in all, each in different handwriting. The handout says this is the digit recognition problem: features ⇒ meaning of digit, a typical supervised multiclass classification problem. In the lecture, Lin asks: to work on this problem, what would you hand to the machine as $\mathbf{x}$?

Page 25 puts two answers side by side.

**by Concrete Features.** Compute two numbers from each image, $\mathbf{x} = (\text{symmetry}, \text{density})$, the degree of symmetry and the density of the strokes. In the lecture, Lin simplifies the problem to telling 1 from 5 to show why these two features help: a 1 is more symmetric than a 5, and a 1 also has lower density than a 5 (its strokes cover fewer black cells). The handout's figure is a scatter plot with blue circles gathered at the upper left and red crosses spread over the lower right, and next to it a few actual digit images connected by lines to their positions in the plot. In the lecture, Lin explains that the vertical axis is symmetry and the horizontal axis is density, so 1s fall toward the upper left and 5s toward the lower right; digits that are badly written or badly scanned fall in places that are not quite right.

**by Raw Features.** Unroll the image directly. The handout writes:

$$
\text{16 by 16 gray image } \mathbf{x} \equiv (0, 0, 0.9, 0.6, \cdots) \in \mathbb{R}^{256}
$$

16 by 16 is 256 cells, and the gray level of each cell is one dimension (in the lecture, Lin says it can first be normalized to between 0 and 1), so each digit is a 256-dimensional vector. The handout's remark is: 'simple physical meaning'; thus more difficult for ML than concrete features. In the lecture, Lin explains that each dimension does have a physical meaning, but a very simple one, just how dark that one point is; the digits we write do not depend on any single point but on relations such as whether this point and the points next to it have ink.

Other raw features in the handout: image pixels, speech signal. The footer says: raw features: often need human or machines to convert to concrete ones. In the lecture, Lin gives both routes a name. The one done by people often goes by the nice-sounding name feature engineering. For the one the machine does itself, Lin's example is deep learning, which was very popular at the time: very roughly, it learns from large amounts of data, even in an unsupervised way, how to extract concrete features. Lin says these feature extraction methods will be introduced in the later part of the next course, Machine Learning Techniques. He also points out that switching to raw features leaves the machine learning setup unchanged: the input is still a vector, now with 256 dimensions. What changes is how hard it is for the machine to learn something, which usually goes up.

There is a small difference in wording. In the lecture, Lin describes the 256-dimensional representation as somewhat more abstract than (symmetry, density), and says the more abstract the input, the harder it is for the machine. The handout's wording is stricter: it calls this kind raw (simple meaning) and reserves abstract for the next kind of input, which has almost no meaning.

### Numerical example: two representations of the same digit

The following example is made up for this article and is not on the slides. Shrink 16 by 16 to 5 by 5, with only two values, black (`#`, written 1) and white (`.`, written 0). Three digits:

```text
"1"             "5"             slanted "1"
. . # . .       # # # # #       . # # . .
. . # . .       # . . . .       . . # . .
. . # . .       # # # # #       . . # . .
. . # . .       . . . . #       . . # . .
. . # . .       # # # # #       . # # # .
```

**Raw features.** Unrolled row by row, each digit is a 25-dimensional vector containing only 0s and 1s. The "1" is $(0,0,1,0,0,\ 0,0,1,0,0,\ \cdots)$ and the "5" is $(1,1,1,1,1,\ 1,0,0,0,0,\ \cdots)$.

**Concrete features.** The handout gives no formulas for symmetry and density, so the two definitions below are set by this article for this example:

- density: the number of black cells divided by 25.
- symmetry: flip the image left to right, count how many cells differ from the original, divide by 25, and take the negative. Perfect symmetry is 0, and the less symmetric, the more negative.

Compute them one by one. The "1" has 5 black cells and is unchanged by the left-right flip. The "5" has 17 black cells; row 2, `# . . . .`, becomes `. . . . #` when flipped, so the leftmost and rightmost cells differ, row 4 likewise has 2 differing cells, and the other three rows are symmetric, for 4 cells in total. The slanted "1" has 8 black cells; row 1, `. # # . .`, becomes `. . # # .` when flipped, so cell 2 and cell 4 differ, and all other rows are symmetric, for 2 cells in total.

| Digit | density | symmetry | $\mathbf{x} = (\text{symmetry}, \text{density})$ |
|---|---|---|---|
| "1" | $5/25 = 0.20$ | $0$ | $(0, 0.20)$ |
| "5" | $17/25 = 0.68$ | $-4/25 = -0.16$ | $(-0.16, 0.68)$ |
| slanted "1" | $8/25 = 0.32$ | $-2/25 = -0.08$ | $(-0.08, 0.32)$ |

**What this result means.** On the plane of concrete features, both "1"s sit in the corner with higher symmetry and lower density and the "5" sits in the other corner, the same direction as in the handout's scatter plot. The perceptron from the previous lecture can be used right away: take $h(\mathbf{x}) = \text{sign}(0.5 - \text{density})$. The values of $0.5 - \text{density}$ for the three digits are $+0.30$, $-0.18$, and $+0.18$, and after taking signs the two "1"s get $+1$ and the "5" gets $-1$. The slanted "1" is closer to the boundary than the standard "1", which matches what Lin says in the lecture about badly written digits falling in places that are not quite right.

On the raw feature side, a single dimension shows almost no difference. The cell in the exact center (row 3, column 3) is black in both the "1" and the "5"; out of 25 cells, these two digits have exactly the same value in 9. To tell the two digits apart from 25 such dimensions, you have to rely on how many cells look when taken together. A person who glances at the image and thinks of "symmetry" and "density" has done that combining for the machine, and this is what including 'human intelligence' means; without it, the machine has to learn similar combinations from the data on its own.

### Abstract features: nothing but IDs

The example on page 26 is rating prediction from KDDCup 2011:

- given previous (userid, itemid, rating) tuples, predict the rating that some userid would give to itemid.
- This is a regression problem with $\mathcal{Y} \subseteq \mathbb{R}$ as rating and $\mathcal{X} \subseteq \mathbb{N} \times \mathbb{N}$ as (userid, itemid).
- 'no physical meaning'; thus even more difficult for ML.

In the lecture, Lin says that year's competition task was to predict how each user would rate each song; if ratings run from 0 to 100, the output is a typical bounded regression. The input is just two IDs, for example what rating user 257 gives to song 1126. A two-dimensional vector sounds easy to handle, but it is completely different from a two-dimensional vector like (symmetry, density): these two numbers are only the IDs the system issued to the user and the song.

Other examples in the handout: student ID in online tutoring system (KDDCup 2010), advertisement ID in online ad system. The footer says: abstract: again need 'feature conversion/extraction/construction'. In the lecture, Lin describes what the team did: extract each user's real features, such as a vector describing the user's preferences over songs; extract features for each song, such as its genre or its composer; then learn from these features. Some of these features were thought up by people and some were learned by the machine itself. What Lin wants everyone to remember: the more abstract the input, the more effort the machine has to spend finding something concrete it can use, and the harder the problem usually is.

### Numerical example: renumber the users and the prediction changes

The following example is made up for this article and is not on the slides; it shows what "IDs have no physical meaning" leads to. There are three users, Alice, Bob, and Carol, and two songs (Song 1, Song 2). Five ratings are known, and we want to predict Carol's rating of Song 2:

| | Song 1 | Song 2 |
|---|---|---|
| Alice | 90 | 70 |
| Bob | 50 | 30 |
| Carol | 80 | ? |

Pretend the IDs are concrete features and do the simplest possible thing: look only at the Song 2 column, where Alice gave 70 and Bob gave 30. Put userid on the horizontal axis and rating on the vertical axis, draw the straight line through these two points, $h(\text{userid}) = w_0 + w_1 \cdot \text{userid}$, and read off the value at Carol's ID. What ID should each user get? The system numbers whoever registers first, which is arbitrary to begin with. Try three numberings:

| IDs (Alice, Bob, Carol) | Line through the points for Alice and Bob | Prediction for Carol, Song 2 |
|---|---|---|
| $(1, 2, 3)$ | $110 - 40 \cdot \text{userid}$ | $-10$ |
| $(2, 1, 3)$ | $-10 + 40 \cdot \text{userid}$ | $110$ |
| $(1, 3, 2)$ | $90 - 20 \cdot \text{userid}$ | $50$ |

Check the first row: Alice is number 1 and Bob is number 2; the ID goes up by 1 and the rating drops from 70 to 30, so the slope is $-40$. The line passes through $(1, 70)$, so $w_0 = 70 + 40 = 110$. Carol is number 3, and $110 - 40 \times 3 = -10$.

**What this result means.** The three numberings describe the same people and the same ratings, yet the predictions are $-10$, 110, and 50, and two of them are even outside the range of 0 to 100. The cause is that this hypothesis does arithmetic on userid: $w_1 \cdot \text{userid}$ means "every time the ID goes up by 1, the rating changes by a fixed $w_1$", and numbering Bob as 2 amounts to claiming that Bob's taste lies between Alice's and Carol's. All of this is false information brought in by the numbering. Concrete features do not have this problem: a weight of 6 really is between 5 and 7.

Switch to another representation (the simplest approach, an addition in this article): do not use the size of the ID; let each user have one number for how high that user tends to rate, let each song have one number for how well liked it is, and take the rating to be the sum of the two. Judging from Alice and Bob, Song 2 is rated 20 points lower than Song 1 by both, so the prediction for Carol on Song 2 is $80 - 20 = 60$, and it is 60 no matter how the users are numbered. "One number per user, one number per song" is the most bare-bones feature extraction; what Lin says is extracted for each user in the lecture is a vector describing preferences, which replaces the single number here with a vector. One lecture late in Machine Learning Techniques deals with exactly this problem: the example in [Techniques Lecture 15: Matrix Factorization](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-15-matrix-factorization-en) is users rating movies, the handout there likewise calls the user ID an abstract feature, and the method is to learn one vector for each user and one for each movie and predict the rating with the inner product of the two vectors.

### Mini summary of this section: the easy input is concrete features

The list on page 27:

| Feature | Physical meaning |
|---|---|
| concrete | sophisticated (and related) physical meaning |
| raw | simple physical meaning |
| abstract | no (or little) physical meaning |

The last line is . . . and more!!. The bottom of the page reads: 'easy' input: concrete. In the lecture, Lin says this more basic course will assume concrete features are already in hand; when the input is raw or abstract data, a person or a machine usually has to find a way to extract concrete features, and that part belongs to more advanced material.

### Fun Time: an online image advertisement system

**Question (page 28):** Consider a problem of building an online image advertisement system that shows the users the most relevant images. What features can you choose to use?

1. concrete
2. concrete, raw
3. concrete, abstract
4. concrete, raw, abstract

**Answer: 4.** The handout's explanation: concrete user features, raw image features, and maybe abstract user/image IDs. The users' data is concrete, like customer data; the images themselves have pixels, which are raw; and the IDs of users and images in the system are abstract.

The question asks which features you "can" use, and each of the first three options leaves out one kind that is in fact available, so none of them is complete (this article's reasoning). The handout puts maybe before abstract, meaning whether to use the IDs depends on the situation, but they certainly can be used. In the lecture, Lin draws an observation from this question: in most real applications all three kinds of features are usually present, and how to find a good representation out of these different $\mathbf{x}$ is often what decides whether machine learning succeeds.

### Summary of the lecture: the four axes together

Page 29 gathers the four sections into one table, with square brackets marking the core option on each axis:

| Axis | Options listed in the handout (square brackets mark the core) |
|---|---|
| Output Space $\mathcal{Y}$ | [classification], [regression], structured |
| Data Label $y_n$ | [supervised], un/semi-supervised, reinforcement |
| Protocol $f \Rightarrow (\mathbf{x}_n, y_n)$ | [batch], online, active |
| Input Space $\mathcal{X}$ | [concrete], raw, abstract |

The four axes are independent of one another, and a problem has to pick one cell on each. The handout itself labels problems this way: page 16 writes coin recognition as batch supervised multiclass classification, and page 23 then says its (size, mass) are concrete features, which fills in all four axes. Here are several problems from this lecture arranged the same way (where the handout says so explicitly the table follows the handout; entries in parentheses are this article's judgment from the problem description):

| Problem | Output | Label | protocol | Input |
|---|---|---|---|---|
| Credit approval | binary classification | (supervised) | (batch) | concrete |
| Coin recognition | multiclass classification | supervised | batch | concrete |
| Handwritten digit recognition | multiclass classification | supervised | (batch) | raw, or converted to concrete |
| KDDCup 2011 rating prediction | regression | (supervised) | (batch) | abstract |
| The spam filter that improves | binary classification | (supervised) | online | not stated in the handout |
| The tree recognition system in Fun Time | (binary classification) | semi-supervised | (batch) | (raw) |
| The baseball photos in Fun Time | (multiclass classification) | partly labeled, the rest queried as the algorithm chooses | active | (raw) |

An addition in this article is one number: the options listed on the handout's four mini summary pages alone give $4 \times 4 \times 3 \times 3 = 144$ combinations, and every one of those pages also says and more. What Foundations mainly deals with from here on is two of those cells: batch, supervised binary classification on concrete features, and batch, supervised regression on concrete features. Lin's summary in the lecture is that the other, more complicated cases mostly require finding more concrete features first and reducing them to the concrete-feature case before handling them. The earlier sections each said as much in their own terms: multiclass and structured problems are built on the tools of binary classification and regression, unsupervised and semi-supervised methods borrow ideas from supervised learning, and batch algorithms extend easily to online. These two cells are learned thoroughly first because the methods for the other cells mostly grow out of them.

The last line of the handout previews the next lecture: next: learning is impossible?!. In the lecture, Lin says next time will start with a piece of bad news, that machine learning may well be impossible, and then look at whether there is a way around it.

## Self-check

**1. A chain of drink shops wants to predict how many cups each branch will sell tomorrow. It has three years of daily sales for every branch, along with that day's temperature, whether it was a holiday, and whether there was a promotion, all stored in a database. Everything is used for training at once, and the formula learned is then used unchanged. What is this problem on each of the four axes? If instead the actual sales of the day are handed to the system after closing every day and it adjusts the formula, which axis changes?**

Answer: the output is a number of cups, and the size of the number is meaningful, so it is regression (cups cannot be negative, so it can be seen as regression with a lower bound). Every past record has the actual sales, so it is supervised. The data is given all at once and a fixed $g$ is learned, so it is batch. Temperature, holiday, and promotion are fields picked by people with a clear meaning, so they are concrete features. If the system adjusts every day as it receives the answer, only the protocol changes, from batch to online; the other three axes stay the same. Criterion: the four axes must be answered separately, each with a reason. Answering only "supervised learning" labels just one axis.

**2. There are 4 word classes and every sentence has exactly 6 words. Treating "the word-class sequence of the whole sentence" as one class, how many candidate classes are there? If instead each word gets its own multiclass classification, how many problems are there and how many classes in each? What does the latter lose?**

Answer: there are $4^6 = 4096$ candidates. Split up, there are 6 problems with 4 classes each. What is lost is the relation between words: when each word is decided independently, nothing rules out combinations that are ungrammatical as a whole (for example, tagging all six words as verbs). Criterion: you should be able to say that the output space of structured learning is "the grammatical part", and that this part cannot be listed item by item.

**3. 32 coins are lined up by weight, of only two kinds, 1c and 5c, with the front part 1c and the back part 5c. The truth is that the first 5 coins are 1c. Using "ask about the exact middle of the uncertain range each time" (write the uncertain range as an interval extended by one position at each end, starting as 0 to 33, and each time ask about the coin at the sum of the two ends divided by 2, rounded down), which coins are asked about, in order? How many queries in total?**

Answer: the interval starts as $(0, 33)$; ask about coin 16, the answer is 5c, and the interval becomes $(0, 16)$. Ask about coin 8, 5c, and it becomes $(0, 8)$. Ask about coin 4, 1c, and it becomes $(4, 8)$. Ask about coin 6, 5c, and it becomes $(4, 6)$. Ask about coin 5, 1c, and it becomes $(5, 6)$; the two ends are adjacent, so the change point is settled between coin 5 and coin 6. The coins asked about are 16, 8, 4, 6, 5 in order, 5 queries in total, and the other 27 coins need not be asked about. With 32 coins this way of asking takes at most 6 queries.

**4. An online spam filter currently has weights (−2, 0.5, 1) (including dimension 0). Three more emails arrive; their features and the labels the user gives afterwards are, in order, (3, 0) labeled +1, (0, 3) labeled +1, and (1, 0) labeled −1. Following online PLA, what is the prediction for each email? How many mistakes are made? What are the final weights?**

Answer: the first email with $x_0$ added is $(1, 3, 0)$, the score is $-2 + 1.5 + 0 = -0.5$, the prediction is $-1$, and the label is $+1$, a mistake; correct to $(-2, 0.5, 1) + (1, 3, 0) = (-1, 3.5, 1)$. The second email is $(1, 0, 3)$, the score is $-1 + 0 + 3 = 2$, the prediction is $+1$, which is right, and the weights do not change. The third email is $(1, 1, 0)$, the score is $-1 + 3.5 + 0 = 2.5$, the prediction is $+1$, and the label is $-1$, a mistake; correct to $(-1, 3.5, 1) - (1, 1, 0) = (-2, 2.5, 1)$. There are 2 mistakes in total, and the final weights are $(-2, 2.5, 1)$. Mind the order: the prediction is made before the label is seen, and you cannot look at the label first and then go back and change the prediction.

**5. Using the definitions of density and symmetry that this article set in the main text, compute the two features of the 5 by 5 "7" below. Hand it to the perceptron from the main text that only tells 1 from 5, h(x) = sign(0.5 − density): how is it classified? What does this show?**

```text
# # # # #
. . . . #
. . . # .
. . # . .
. . # . .
```

Answer: there are $5 + 1 + 1 + 1 + 1 = 9$ black cells, so density is $9/25 = 0.36$. After the left-right flip, row 2, `. . . . #`, becomes `# . . . .`, with 2 differing cells; row 3, `. . . # .`, becomes `. # . . .`, with 2 differing cells; the other three rows are symmetric. Symmetry is $-4/25 = -0.16$. The perceptron computes $0.5 - 0.36 = +0.14$ and classifies it as "1". This shows that concrete features are picked for a specific task: density and symmetry are enough to tell 1 from 5, but for the ten-digit problem they fall short, since the "7" has a density like the "1" and yet the same degree of symmetry as the "5". Features picked by people carry those people's knowledge of that task, and a different task means picking again.

## Exercises and corresponding reading

**Corresponding textbook sections.** The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) maps this lecture to Sections 1.2 and 1.3 of [Learning from Data](http://amlbook.com) (LFD). The same course page puts this lecture's first video (output space) on the W2 list of videos to watch before class, and the other three on W3.

**What the Fall 2026 extended slides (03e) add.** [03e_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/03e_handout.pdf) on the same course page adds more recent examples to each axis beyond the MOOC handout:

- Output space: multilabel classification (which kinds of fruit are in a picture), splitting it into several yes/no questions with binary relevance, and image generation (style transfer, denoising, super-resolution).
- Label: self-supervised (a jigsaw puzzle task) and weakly-supervised (complementary labels that only say "which class it is not"); the reinforcement learning examples are replaced with AlphaGo and GPT-3.
- protocol: the practical approach of online plus daily batch retraining, and [libact](https://github.com/ntucllab/libact), the active learning tool from NTU's CLLab.

**Homework.** The first homework of each of the two semesters has questions on this lecture. There are no official solutions, and grading is limited to enrolled students.

- Q5–6 of [Fall 2024 HW1](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw1/hw1_red.pdf): first ask a chatGPT-like agent "where can active learning be used" and "can ML predict earthquakes", then criticize its answers from the position of a "boss" in 10 to 20 English sentences. The first of the two draws directly on this lecture's protocol section.
- Q5 of [Fall 2026 hw1](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf): which type of learning problem predicting Taiwan's rainfall maps belongs to, which practices exactly this lecture's four axes. Self-check question 1 is a warm-up.

The guide to the whole set of homework is in the [Foundations homework guide](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en).

**Hands-on.** Pick three problems from your work or your daily life, label each once on this lecture's four axes, and write one sentence of reasoning per cell. The cell you cannot label is usually where that problem is really hard: there are no labels, the labels are expensive, or the input is nothing but IDs.

**Things this lecture mentions that are taught later.** In the lecture, Lin says the feature extraction methods come in the later part of Machine Learning Techniques. Matching this against the lectures of this series, deep learning is in [Techniques Lecture 13: Deep Learning](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-13-deep-learning-en), and matrix factorization, which handles abstract features like user IDs, is in [Techniques Lecture 15: Matrix Factorization](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-15-matrix-factorization-en). The closest thing within Foundations is [Foundations Lecture 12: Nonlinear Transformation](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation-en), which teaches transforming features that are already concrete, not extracting features from raw or abstract input.

**Further reading.** [Caltech Learning from Data](https://work.caltech.edu/telecourse) is the course Abu-Mostafa teaches in English from the same textbook.

**Next lecture.** [Foundations Lecture 4: Feasibility of Learning](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning-en) starts from the bad news this lecture ends on: having seen only a finite amount of data, on what grounds can we say $g$ is close to $f$ on data it has not seen.

## Course video sources

Original videos: [Learning with Different Output Space](https://www.youtube.com/watch?v=XyJQm4mvVUA), [Learning with Different Data Label](https://www.youtube.com/watch?v=8w1lDGaoFTI), [Learning with Different Protocol](https://www.youtube.com/watch?v=emLW7jLh-n0), [Learning with Different Input Space](https://www.youtube.com/watch?v=cIsgI7tktQM)

- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-13: The series now has one article per lecture; this lecture is a newly split-out article, written from the handout and the video transcripts.

## References

- [Foundations Lecture 3 handout, 03_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/03_handout.pdf): the main source for this article. The classification in the four sections, the examples for each type, the four Fun Time questions, and the summary on page 29 all come from this handout.
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Foundations Lecture 2 guide](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en): the mistake bound for online PLA reuses the two facts and the notation from that lecture.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the W2 and W3 lists of videos to watch before class and the LFD sections.
- [Lecture 3 extended slides (03e_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/03e_handout.pdf): the recent examples on the four axes.
- [Fall 2024 Homework 1 (hw1_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw1/hw1_red.pdf): the content of Q5–6.
- [Fall 2026 Homework 1 (hw1.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf): the content of Q5.
- [libact: Pool-based Active Learning in Python](https://github.com/ntucllab/libact): the active learning tool mentioned in 03e.
- [Learning from Data textbook website](http://amlbook.com): the source of Sections 1.2 and 1.3.
- [Caltech Learning from Data](https://work.caltech.edu/telecourse): further reading, the English-language course on the same textbook.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
