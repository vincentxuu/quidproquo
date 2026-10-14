---
title: "Learning — Supervised Learning, k-NN, SVM, Reinforcement Learning Q-learning & Nim | Harvard CS50 AI Week 4"
date: 2026-08-30
category: tech
type: guide
tags: [harvard-cs50ai, ai, machine-learning, supervised-learning, knn, svm, reinforcement-learning, q-learning, nim, shopping, python, cs50]
lang: en
series:
  name: "Reading Harvard CS50 AI"
  order: 5
tldr: "Week 4 covers three forms of machine learning. Supervised learning fits a hypothesis function to labeled data: classify by the k nearest neighbors, or draw a decision boundary with a set of weights (perceptron learning rule, logistic regression, support vector machines), then use loss functions, regularization and cross-validation against overfitting. Reinforcement learning uses Q-learning to update the estimated value of each state and action from rewards, with ε-greedy keeping some probability of random exploration. Unsupervised learning clusters with k-means. With time links for every section, plus the approach and ways to check your work for the Shopping and Nim projects."
description: "Guide to Harvard CS50 AI Week 4 Learning, written section by section from the captions of the 2020 lecture recording: nearest neighbor and k-NN, weights and the perceptron learning rule, hard and soft thresholds, support vector machines, regression, 0-1/L1/L2 loss, overfitting and regularization, holdout and k-fold cross-validation, a scikit-learn run on banknote data, Markov decision processes, Q-learning, ε-greedy, Nim and k-means, each with a clickable time link and a self-check, plus specs, the approach, pseudocode, common mistakes and ways to check your work for the Shopping and Nim projects, with the full reference implementations folded by default. Project specs current as of 2026."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning)

**Video status: Videos included.** The lecture runs 1:45:48. The "Lecture walkthrough" below is written section by section from the recording's English captions, and each section opens with a time link that moves the player on this page to that point. The lecture uses Nim to demonstrate Q-learning but does not introduce this week's two project assignments; the project sections follow the course website and the official distribution code. [Jump to the player](#lecture-video--timestamps) | [Source details](#course-video-sources)

> ⚠️ **Version note**: This week's lecture videos were **recorded in Spring 2020**; project specs, distribution code, and check50 slugs follow the 2026 course website (i.e., `ai50/projects/2024/x/...`).

## TL;DR

Week 4 moves from "write the method down for the computer" to "give the computer data and let it find the pattern", and goes through three forms of machine learning in order:

- **Supervised learning**: the data is a set of inputs paired with answers, and the goal is a function that guesses the answer from the input. The lecture compares three ways to classify (look at the nearest neighbors, draw a line with weights, support vector machines), then covers how to score the function you learned (loss functions) and what goes wrong when the score is too good (overfitting).
- **Reinforcement learning**: there are no ready answers. The agent acts, gets a reward or a punishment, and Q-learning uses those numbers to keep correcting its estimate of what taking this action in this state is worth.
- **Unsupervised learning**: the data has no labels. k-means splits it into k groups by assigning each point to the nearest center and then moving each center to the average of its points.

The article has two halves. The first, "Lecture walkthrough", follows the recording; the second covers the two projects, Shopping (k-NN classification) and Nim (Q-learning): the approach, pseudocode, common mistakes and ways to check your work come first, and the full reference implementation is folded at the end of each project.

## Lecture Video & Timestamps

The recording runs 1 hour 46 minutes, and the ten sections of "Lecture walkthrough" below cover all of it in order. Every time link, at the top of a section or inside the text, moves the player on this page to that point, so when a section does not make sense you can go straight back and listen.

```youtube
url: https://www.youtube.com/watch?v=-g0iJjnO2_w
title: Learning - Lecture 4 - CS50's Introduction to Artificial Intelligence with Python 2020
```

YouTube: [Week 4 Learning (2020 recording)](https://www.youtube.com/watch?v=-g0iJjnO2_w)

> Timing note: the times below were checked against the timecoded English captions (2026-10-13) and mark where the lecturer starts each topic; they are not official chapters. This table describes only the 2020 recording; the current course version may differ in content and order, and the video itself does not introduce this week's project assignments.

| Time (click to play from there) | Content |
|---|---|
| [0:00–12:56](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=0s) | Machine learning, supervised learning and classification; the hypothesis function; nearest neighbor and k-NN |
| [12:56–33:19](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=776s) | Decision boundaries, weights and the dot product, the perceptron learning rule, hard thresholds and logistic regression |
| [33:19–39:16](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=1999s) | Support vector machines and the maximum margin separator |
| [39:16–49:33](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=2356s) | Regression; loss functions (0-1, L1, L2) |
| [49:33–59:43](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=2973s) | Overfitting, regularization, holdout and k-fold cross-validation |
| [59:43–1:09:47](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=3583s) | scikit-learn demo: comparing perceptron, SVM and k-NN on banknote authentication data |
| [1:09:47–1:19:47](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=4187s) | Reinforcement learning and Markov decision processes, with a grid-world example |
| [1:19:47–1:31:37](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=4787s) | The Q-learning update, the problem with greedy, ε-greedy |
| [1:31:37–1:38:43](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5497s) | Self-play training demonstrated on Nim; function approximation |
| [1:38:43–1:45:48](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5923s) | Unsupervised learning, clustering and k-means; wrap-up |

> Official notes: [Week 4 Notes](https://cs50.harvard.edu/ai/2020/notes/4/)

## Lecture walkthrough

What follows is written section by section from the recording's English captions. Captions alone do not show the slides, so this article does not reconstruct the scatter plots, the various decision boundaries or the grid world; it reports only what the lecturer says aloud, numbers included. Those figures are in the [official notes](https://cs50.harvard.edu/ai/2020/notes/4/). Formulas are written from what the lecturer says and checked against the text and formula images of the official notes; where the two differ, the text says so. The self-check at the end of each section is my own question, not lecture content. Where a question reuses a lecture example it says so; where it is marked "my own", the example is mine as well.

### Supervised learning, classification and nearest neighbor

[Recording 0:00–12:56](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=0s)

The lecturer, Brian Yu, starts by marking the line between this week and the earlier ones. Until now a person wrote down for the computer how to search or how to satisfy constraints. **Machine learning** gives no explicit method, only data, and lets the computer find the patterns in it and perform the task on its own.

The first form is **supervised learning**: the data set consists of input-output pairs, and the computer has to learn a function that maps inputs to outputs. Within supervised learning the lecture starts with **classification**, mapping inputs to discrete categories. Two examples: given information about a banknote, decide whether it is authentic or counterfeit; given weather data for a day, decide whether it will rain. [Week 2](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en) handled the rain question by assuming the probabilities were known, but in practice you often do not have those probabilities. What you do have is a lot of historical data.

The data can be laid out as a table. Each row is a day, with that day's humidity and pressure, and a **label** that a human filled in: it rained or it did not. "Supervised" refers to exactly that, the labels come from a person.

In function terms: the real world has some function `f(humidity, pressure)` that outputs rain or no rain. Nobody knows what `f` really looks like, so we look for a **hypothesis function** `h` that approximates it, taking the same humidity and pressure and outputting rain or no rain, and we want `h` and `f` to agree as much as possible. The goal of a classification task is to find that `h`.

With only two numbers as input, each day can be drawn as a point on a plane: humidity on the x-axis, pressure on the y-axis, rainy days as blue dots and dry days as red dots. The lecturer adds that more inputs just mean more dimensions. People cannot picture more than three, but for a computer each dimension is just one more number to keep track of, so 10 or 100 dimensions are no problem.

Now a new point with no label arrives (a white dot). Blue or red? If the closest dot to it is blue, most people would guess blue. Turning that intuition into an algorithm gives **nearest-neighbor classification** ([8:15](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=495s)): given an input, find the data point nearest to it and use that point's class.

Then the case where it goes wrong. The lecturer points to another white dot: its nearest neighbor is a red dot, but it is surrounded by a whole group of blue dots. By the nearest-neighbor rule it is red, yet looking at the bigger picture there is an argument for blue. With only this data you cannot know which is right, but considering more than one neighbor can often give a better result, with no guarantee.

Hence **k-nearest-neighbor classification** (k-NN, [10:27](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=627s)): `k` is a number you choose, such as 3, 5 or 7; find the `k` data points nearest to the input and use the most common class among them. The lecturer's example looks at the 5 nearest points: 3 say rain and 2 say no rain, so the answer is rain. Each neighbor effectively gets one vote.

Here the lecturer gives an early warning: no one algorithm is always better than the others. Each has trade-offs and it depends on the data, and a lot of machine learning research consists of trying several and seeing which gives the best results. The drawback of k-NN ([12:25](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=745s)) is that a naive version is slow, because it measures the distance from the new point to every single data point. He mentions that there are data structures that speed up finding neighbors, and that you can prune data points you do not need, without going into either.

**Check yourself. Write your answer down before opening the fold.** A new point's distances to five labeled data points, nearest first, are: 0.5 (red), 0.8 (blue), 0.9 (blue), 1.5 (red), 1.6 (red). Which class does k-NN give for `k` = 1, 3 and 5? (My own question.)

<details>
<summary>Answer</summary>

`k` = 1: only the nearest point counts, and it is red, so red. `k` = 3: the three nearest are red, blue, blue; blue wins 2 votes to 1, so blue. `k` = 5: red, blue, blue, red, red; red wins 3 votes to 2, so red.

Same point, same data, and the answer changes with `k`. The lecture does not say which `k` is right, only that looking at more neighbors can often give a better result, with no guarantee. `k` is a parameter you choose and test yourself.

</details>

### Classifying with a line: weights, the perceptron learning rule and two kinds of threshold

[Recording 12:56–33:19](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=776s)

Nearest neighbor looks only at the data around the new point. Another approach looks at all the data and finds a **decision boundary** that separates the rainy days from the dry ones; in two dimensions that boundary can be a straight line. The lecturer calls this technique of finding the line linear regression. (Most textbooks keep "regression" for predicting numeric values and call a line used for classification, as in this section, a linear classifier; that remark is mine.)

If a straight line can separate the two classes perfectly, the data is **linearly separable**. Real data is rarely that clean. There are outliers and noise, and often no perfect line exists, but you can still look for a line that does a pretty good job. What "good" means is defined later, with loss functions.

**Writing the line as an expression** ([14:56](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=896s)). Call the two inputs `x₁` (humidity) and `x₂` (pressure). The boundary is a linear combination of the inputs: multiply each input by a number called a **weight**, add a constant, and check whether the result is greater than or equal to 0.

```text
h(x₁, x₂) = Rain       if w₀ + w₁x₁ + w₂x₂ ≥ 0
          = No Rain    otherwise
```

`x₁` and `x₂` are the inputs; the slope and position of the line are set by `w₀`, `w₁` and `w₂`. Learning means choosing a good set of weights. To make the math easier, the categories become numbers: 1 for rain, 0 for no rain.

**Vector notation** ([18:48](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=1128s)). A vector is a sequence of numbers; in Python you could represent it as a list or a tuple. Put the three weights into a weight vector **w** = (w₀, w₁, w₂) and the input into **x** = (1, x₁, x₂). The extra 1 makes the two vectors the same length: `w₀` has no input to go with, so it is treated as multiplied by 1. The **dot product** of two vectors ([21:04](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=1264s)) multiplies the terms position by position and adds everything up, which gives exactly `w₀ + w₁x₁ + w₂x₂`. So the hypothesis is usually written:

```text
h_w(x) = 1    if w · x ≥ 0
       = 0    otherwise
```

The subscript **w** says the hypothesis is parameterized by the weights: different weights, different hypothesis.

**The perceptron learning rule** ([23:29](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=1409s)). How do you find the weights? The lecturer introduces one of the most common methods and says he will present it conceptually without going deep into the mathematics. Start with random weights, then take the data points (x, y) one at a time, where y is the actual answer (1 or 0), and update every weight by this rule:

```text
wᵢ ← wᵢ + α × (y − h_w(x)) × xᵢ
```

The lecturer explains it by putting the bracket into words: `y` is the actual value, `h_w(x)` is the current estimate, and one is subtracted from the other.

- **The estimate was right**: actual minus estimate is 0, the whole added term is 0, and the weight does not change.
- **Actual 1, estimated 0**: the difference is positive, so the weight gets a positive number added. The dot product gets bigger and next time it is more likely to come out as 1.
- **Actual 0, estimated 1** (it did not rain but we predicted rain): the difference is negative, so the weight goes down. The dot product gets smaller and rain is less likely to be predicted again.

While explaining these two cases he adds that, for now, we assume these x's are positive values. In the captions he does not read the whole formula out; he only says the original weight plus some additional expression. The `× xᵢ` factor comes from the formula in the official notes, whose text also says the weight increases by the value of `xᵢ` scaled by `α`.

`α` is the **learning rate**, a number you choose that controls how much each update moves the weights: a bigger `α` changes them a lot, a smaller one changes them less. Repeat this data point after data point and, hopefully, the weights converge to values that separate the data well.

**The limits of a hard threshold** ([27:55](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=1675s)). What you end up with is a threshold function: while the dot product is below the threshold the output stays at 0, and the moment it crosses, the output jumps to 1, with nothing in between. The lecturer first shows the limitation with two new points: both fall on the "rain" side, one far from the line and one right next to it; a person feels much surer about the first, but the function says only "rain" for both. He then sums it up as two problems. One, a function with a jump is awkward mathematically, and things get hard once you go deeper into machine learning and need to take derivatives of these curves. Two, it has no notion of gradation: it cannot express the difference between "very sure it will rain" and "probably rain, but not so sure".

**Logistic regression and the soft threshold** ([31:37](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=1897s)). The fix is to replace the threshold function with a logistic function, a smooth curve. The output is no longer just 0 or 1 but any real number between 0 and 1: close to 0 far out on one side, close to 1 far out on the other, and in between a value like 0.7, meaning "more likely rain than not, but not as confident". That output can be read as the probability of belonging to the class.

**Check yourself. Write your answer down before opening the fold.** The current weights are **w** = (−3, 2, 1) and the learning rate is `α` = 0.1. A data point arrives with `x₁` = 1, `x₂` = 2 and actual answer `y` = 0. Apply the rule above once. What are the new weights? Does the updated model now get this data point right? (My own question.)

<details>
<summary>Answer</summary>

First the current prediction: **x** = (1, 1, 2), and the dot product is −3 × 1 + 2 × 1 + 1 × 2 = 1, which is greater than or equal to 0, so `h` = 1. The actual value is 0, so the estimate is wrong and `y − h` = −1.

Update each of the three weights:

- `w₀` ← −3 + 0.1 × (−1) × 1 = −3.1
- `w₁` ← 2 + 0.1 × (−1) × 1 = 1.9
- `w₂` ← 1 + 0.1 × (−1) × 2 = 0.8

The new dot product is −3.1 + 1.9 + 0.8 × 2 = 0.4, still greater than or equal to 0, so the prediction is still 1 and still wrong. But the dot product dropped from 1 to 0.4, which is the right direction. One more update on the same data point gives (−3.2, 1.8, 0.6) and a dot product of −3.2 + 1.8 + 0.6 × 2 = −0.2, below 0, and the prediction flips to 0. On this data point each update lowers the dot product by a fixed 0.1 × (1² + 1² + 2²) = 0.6. One update is not always enough, which is why the lecturer says to repeat the process data point after data point.

</details>

### Support vector machines: pick the line farthest from both sides

[Recording 33:19–39:16](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=1999s)

The third approach is the **support vector machine** (SVM). Again the lecturer skips the mathematics and motivates it with pictures: there are many lines that separate two groups of points, and they are not equally good.

He looks at three lines in turn. The first separates the red points from the blue points perfectly but sits right next to some of them. A line like that should make you nervous, because a new point that is only slightly off lands on the other side of it, and something that plainly looks red gets classified as blue. The second is a diagonal line that also classifies every point correctly but runs very close to the red points, with the same problem. If all you want is a setting of weights that gets the training data right, you cannot tell these lines apart, because all of them are perfect on the training data. The third is the line intuition would draw: as far as possible from both the red and the blue data, so that points a little different from the training data are still classified correctly.

That line is what an SVM looks for, the **maximum margin separator** ([36:12](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=2172s)): the boundary that maximizes the distance to the two groups of points. It does so by finding the **support vectors**, the points closest to the boundary, and making the distance between the boundary and those points as large as possible.

In two dimensions that means a line; in higher dimensions it means a hyperplane. Working in higher dimensions brings another benefit ([37:28](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=2248s)): handling data that is not linearly separable. The lecturer's example is a cluster of red points surrounded by blue points, where any straight line misclassifies a lot of points. By operating in higher dimensions, an SVM can find a decision boundary like a circle that separates the two sets. The lecturer does not explain how; he gives only the conclusion.

That makes three classification methods so far: nearest neighbor, weights with the perceptron learning rule, and SVMs. The lecturer repeats that none is necessarily better than the others; it depends on the data and takes experimentation.

**Check yourself. Write your answer down before opening the fold.** The data has a single input. Red points are at 1 and 2, blue points at 6 and 8. The boundaries "below 2.5 is red" and "below 4 is red" both classify all four points correctly. Which one is the maximum margin separator? Which points are the support vectors? A new point arrives at 3; how does each boundary classify it? (My own question.)

<details>
<summary>Answer</summary>

It is 4. The two closest points across the groups are the red point at 2 and the blue point at 6, and 4 is exactly halfway, leaving a distance of 2 on each side, which cannot be improved. Those two points nearest the boundary (2 and 6) are the support vectors; 1 and 8 are farther away and do not affect where the boundary goes.

The new point at 3: with 2.5 as the boundary it is classified blue, even though it is only 1 away from the red point at 2 and 3 away from the blue point at 6. With 4 as the boundary it is classified red. Both boundaries are perfect on the training data, and the difference only shows on new data. That is what the lecturer means when he says the first line should make you nervous.

</details>

### Regression and loss functions: how to score a hypothesis

[Recording 39:16–49:33](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=2356s)

Classification predicts a discrete category. Sometimes the thing to predict is a real number, and that supervised learning problem is called **regression**. The lecturer's example is a company that wants to know how advertising spending relates to sales: the input is the money spent on advertising, the output is sales, and the company has the advertising spend and sales for every past month. Plot the data (advertising on the x-axis, sales on the y-axis) and find a straight line that fits the points closely. This time the line is used for estimating: to find the expected sales for a given advertising budget, look it up on the line.

**How to evaluate** ([41:59](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=2519s)). Every method so far produces a hypothesis, and we need a way to measure how good it is. The lecturer ties this back to optimization from earlier in the course ([Week 3](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en) in this series): there you either maximized an objective function or minimized a cost function. Here the thing to minimize is a **loss function**, which measures how poorly the hypothesis performs; every wrong prediction is a loss of utility. You can define any loss function you like, and the lecturer presents three common ones.

**0-1 loss** ([43:30](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=2610s)) is for discrete categories: if the actual value equals the prediction the loss is 0, otherwise it is 1. Adding up the loss over all data points gives the hypothesis's empirical loss. The lecturer demonstrates on the decision boundary for rain: points on the correct side each have a loss of 0; four points are misclassified (some were rainy but predicted dry, others the reverse), each counting 1, for a total loss of 4. If every straight line through this data gets at least four points wrong, this line is the best a straight line can do.

**L1 loss** ([47:08](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=2828s)) is for predicting numeric values. Now you care not only whether you were right but how far off you were: if actual sales were $2,800, a prediction of $2,900 is pretty good and a prediction of $1,000 is much worse. L1 loss takes the absolute value of actual minus predicted and sums it over all data points. On the advertising and sales plot, it is the vertical distance from each data point to the line.

**L2 loss** ([48:28](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=2908s)) uses the square of the difference instead, so the farther off a prediction is, the more harshly it is penalized. The lecturer's comparison: two data points each off by 1, versus one data point off by 2; L2 penalizes the second more. Which to choose depends on what you care about. If you care a lot about getting outlier cases right, use something like L2; if the data has many outliers and you do not particularly want to model them, L1 may be preferable.

**Check yourself. Write your answer down before opening the fold.** Using the lecture's numbers: actual sales are 2,800 and the two predictions are 2,900 and 1,000. What are the L1 loss and the L2 loss of each? How many times the loss of predicting 2,900 is the loss of predicting 1,000? Work it out once with L1 and once with L2.

<details>
<summary>Answer</summary>

Predicting 2,900: off by 100, so L1 is 100 and L2 is 100² = 10,000. Predicting 1,000: off by 1,800, so L1 is 1,800 and L2 is 1,800² = 3,240,000.

Measured with L1, the second prediction's loss is 18 times the first; with L2 it is 324 times (18 squared). Squaring magnifies large errors, so with L2 as the objective the model works hardest on the points that are farthest off. The lecturer's "two points off by 1" versus "one point off by 2" is the same thing: L1 gives 2 for both, L2 gives 2 versus 4. The figures 18 times, 324 times and 2 versus 4 are my own arithmetic; the lecture does not state them.

</details>

### Overfitting, regularization and cross-validation

[Recording 49:33–59:43](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=2973s)

Whichever loss function you use, there is one risk in common: **overfitting**, where the model fits the training data so closely that it fails to generalize to data it has not seen. The point of training a model is to use past data to predict the future, for example using the past year's rain records to predict whether it will rain later on. Accuracy on the training data is only a means to that.

The lecturer gives two examples. For classification: a straight line separates red from blue fairly well, with one outlying red point on the blue side, so the empirical loss is not 0. If all you want is to drive the loss to 0, you can draw a wiggly boundary that swerves to fence that red point in. It gets every training point right, but if new points turn up near there we would still mostly want to call them rainy days, because that red point was probably just an outlier. For regression: instead of a straight line, draw a line that connects every single data point. The loss is 0, and it is just as unlikely to generalize.

**Counting complexity as part of the cost** ([53:09](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=3189s)). So far the cost of a hypothesis has been defined as its loss, and minimizing only that number leads to overfitting. The remedy is to add a term to the cost:

```text
cost(h) = loss(h) + λ × complexity(h)
```

`complexity(h)` measures how complicated the hypothesis is, and you have to define how to measure it. The lecturer calls this an Occam's razor style approach: prefer a simpler decision boundary, such as a straight line, because a simpler solution is more likely to generalize to other inputs. `λ` is a parameter you choose: with a larger `λ`, complex hypotheses are penalized heavily; with a smaller `λ`, only a little. Considering complexity as well as loss in this way is called **regularization**.

**Holding out some data for testing** ([56:21](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=3381s)). Another way to guard against overfitting is to run an experiment and see directly whether the model generalizes. **Holdout cross-validation** splits the data in two: the **training set** is used to train the model, and the **testing set** is used to see how well the trained model performs. The model has not seen the testing set, so if it merely memorized the training set, it will do poorly there.

The downside of holdout is that a large part of the data is not used for training (50% with an even split), and using it might have produced a better model. **k-fold cross-validation** ([58:19](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=3499s)) divides the data into `k` sets and runs `k` experiments instead. The lecturer uses 10 sets: each time hold out one set for testing, train on the other nine, and see how the model does on the one held out. The ten experiments each hold out a different set and give ten results, which are usually averaged to estimate how well the model performs overall.

**Check yourself. Write your answer down before opening the fold.** There are two hypotheses: straight line A has loss 4 and complexity 1; wiggly boundary B has loss 0 and complexity 10. Under `cost(h) = loss(h) + λ × complexity(h)`, which one is chosen at `λ` = 0.1 and at `λ` = 1? Also, with 1,000 data points and 10-fold cross-validation, how many points does each experiment train on and test on? (My own question.)

<details>
<summary>Answer</summary>

`λ` = 0.1: A costs 4 + 0.1 × 1 = 4.1 and B costs 0 + 0.1 × 10 = 1. B is lower, so B. `λ` = 1: A costs 4 + 1 = 5 and B costs 0 + 10 = 10, so A. The crossover is at 4 + λ = 10λ, about `λ` = 0.44; above that, B's extra complexity outweighs the loss it saves. `λ` sets how much training loss you are willing to trade for a simpler hypothesis.

10-fold: 1,000 points make 10 sets of 100. Each experiment trains on 900 points and tests on 100, ten times over, and every data point is used for testing exactly once. Compared with an even holdout split, each training run uses 900 points instead of 500.

</details>

### Trying it with scikit-learn: banknote authentication data

[Recording 59:43–1:09:47](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=3583s)

You could write these algorithms from scratch, but Python has a ready-made library, scikit-learn, in which nearest-neighbor classification, perceptron learning and more are already implemented. The lecturer uses it to compare the models from the earlier sections on a real data set.

The data is `banknotes.csv`, provided by UC Irvine. People photographed many banknotes and measured several properties of each. Every row is one banknote, with four input values and a label assigned by a human: 0 for authentic, 1 for counterfeit. The lecturer says what the four measurements are matters less than having the data and the labels.

`banknotes0.py` ([1:02:17](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=3737s)) walks through the whole process by hand:

1. Choose the model: `model = Perceptron()`.
2. Read the file: the first four values of each row are the evidence; if the last column is 0 the label is recorded as authentic, otherwise counterfeit.
3. Split: count the data points and store half that number as `holdout`; shuffle the data randomly; the first `holdout` rows are the testing set and the rest are the training set.
4. Train: split the training set into `X_training` (each row's evidence, a vector of four numbers) and `y_training` (the matching labels), then call `model.fit(X_training, y_training)`.
5. Test: build `X_testing` and `y_testing` the same way, get predictions from `model.predict(X_testing)`, then use `zip` to compare actual and predicted values pair by pair and count how many were right and how many wrong.

Swapping models means changing only the line in step 1. The results the lecturer gets on the spot ([1:06:21](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=3981s)):

| Model | Correct | Incorrect | Accuracy as stated |
|---|---|---|---|
| `Perceptron()` | 679 | 7 | close to 99% |
| `svm.SVC()` | 682 | 4 | 99.4% |
| `KNeighborsClassifier(n_neighbors=1)` | 685 | 1 | not stated |
| `KNeighborsClassifier(n_neighbors=3)` | all | 0 | 100% |

He then points out that every run reshuffles the data, so each run trains on a slightly different set, and you need to run several experiments to see how the models really perform. All of them do very well on this data, but the ranking may not hold for another data set.

Last comes `banknotes1.py` ([1:08:46](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=4126s)). Splitting into training and testing sets is so common that scikit-learn has `train_test_split` built in: you give the proportion that should go to the testing set (the lecturer says 0.5) and it does the split. Counting right and wrong also has a ready-made form. The whole program is about 40 lines. The `main` function of the Shopping project uses `train_test_split` too; see Project 4A below.

The published lecture source differs from what happens in the lecture in three places: `banknotes0.py` selects `GaussianNB()` as the model by default and holds out a proportion of 0.40; and `train_test_split` in `banknotes1.py` also uses `test_size=0.4`, not the 0.5 the lecturer says. I saw this after downloading the source; it is not lecture content. With the proportion changed back to one half, each of the four models was run 12 times (2 of mine, 10 by the independent reviewer), and the errors out of 686 were: Perceptron 6 to 26, SVC 1 to 4, `n_neighbors=1` 0 to 1, `n_neighbors=3` 0 to 11. Perceptron varies the most, and the 7 errors in the lecture's run sit at the low end.

**Check yourself. Write your answer down before opening the fold.** Using the lecture's numbers: how many rows are in the testing set? Roughly how many in the whole data set? What is the accuracy for `n_neighbors=1`? `n_neighbors=3` scored 100%; can you conclude it is the best model for this problem?

<details>
<summary>Answer</summary>

The testing set has 679 + 7 = 686 rows (682 + 4 and 685 + 1 also give 686). The testing set is half the data, so the whole set is 686 × 2 = 1,372 rows; the published `banknotes.csv` has exactly 1,372 rows besides the header. The accuracy for `n_neighbors=1` is 685 ÷ 686, about 99.85%.

No. The four models differ by 7, 4, 1 and 0 errors out of 686, each was run only once, and every split is random. The lecturer himself says to run multiple experiments and that the ranking may differ on another data set. This one run shows only that all four models are very accurate on this data.

</details>

### Reinforcement learning and Markov decision processes

[Recording 1:09:47–1:19:47](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=4187s)

**Reinforcement learning** does not start with a whole data set of inputs and answers. It learns from experience. An agent (a physical robot, or just a program) is placed in an environment:

1. The environment puts the agent in a **state**, such as the current position of a game or a location on a grid map.
2. The agent chooses an **action** in that state.
3. The environment returns two things: a new state, and a number called the **reward**. Positive means it did something good; negative means it did something bad and is being punished.

That is all the agent knows, and from it the agent has to learn what to do in the future. The lecturer's example is teaching a robot to walk. Programming a robot to walk the way humans do would be very hard, but you can give it a reward every time it takes a step forward and a punishment every time it falls over, and let it learn.

**Describing this world precisely** ([1:13:03](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=4383s)). The usual model is the **Markov decision process** (MDP). The lecturer starts from the Markov chain covered earlier ([Week 2](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en) in this series): a set of states, each transitioning to the next according to a probability distribution, for example if today is sunny, with some probability tomorrow is sunny and with some other probability rainy. That model has no agent; everything is decided by probability. An MDP adds two things:

- **Actions**: in each state the agent can choose from several actions, each with its own probability distribution over which state comes next.
- **Rewards**: going from one state, taking an action, and arriving in another state comes with a reward `r`, positive for a reward and negative for a punishment.

So an MDP has four parts: a set of states `S`; the actions available in each state, `Actions(s)`; a transition model `P(s' | s, a)`, the probability of ending up in `s'` after taking action `a` in state `s`; and a reward function `R(s, a, s')`, the reward for being in `s`, taking `a` and getting to `s'`. The world may be fully deterministic (an action in a state always leads to the same next state) or may involve randomness; an MDP can represent both.

**The grid-world example** ([1:16:53](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=4613s)). The lecturer demonstrates with a grid map: the agent is trying to reach a goal square, where it gets a reward, and some squares give a punishment. At the start the agent knows none of this and can only try things.

- It takes a step and gets punished. It learns: in this state, do not move right.
- It moves up instead and gets nothing right away; it tries other things and hits another punishment. It learns: in that square, do not move down.
- It keeps trying, and eventually, in some state, moving up earns a reward. It learns: in this state, move up.
- Then it can also learn: in the square before, move left, because that leads to the state from which the reward can be reached.

Nobody told it where the goal was or where the punishments were. From experience it learned a sequence of actions that leads to the reward, and from then on it can just follow them.

**Check yourself. Write your answer down before opening the fold.** Which two things separate a Markov chain from a Markov decision process? Because of them, what extra do the transition model and the reward function each have to look at?

<details>
<summary>Answer</summary>

Actions and rewards. A Markov chain has no agent, and the next state depends only on the current state and the probabilities. An MDP lets the agent choose an action in each state and attaches a reward to every transition.

So the transition model goes from "given the current state, the probability of the next state" to `P(s' | s, a)`, conditioned on an action as well; and the reward function is written `R(s, a, s')`, depending on which state you were in, which action you took and which state you reached. In the grid world the agent learns "in this state, do not move right", not "do not be in this state", exactly because the reward is tied to the action; knowing the state alone is not enough.

</details>

### Q-learning and ε-greedy

[Recording 1:19:47–1:31:37](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=4787s)

There are many methods for reinforcement learning, and the lecture covers one: **Q-learning**. It learns a function `Q(s, a)` that takes a state and an action taken in that state and outputs an estimate of the value: roughly how much reward doing this will bring.

At the start there is no experience at all, so every `Q(s, a)` is set to 0. After that, each time an action is taken and a reward received, the corresponding estimate is corrected. The correction takes two things into account: the reward from this step, and the reward expected in the future. The second matters because some actions bring no immediate reward and still lead to rewards later.

**The update** ([1:22:50](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=4970s)). Each time you take action `a` in state `s`, observe reward `r` and arrive in a new state `s'`:

```text
Q(s, a) ← Q(s, a) + α × (new value estimate − old value estimate)

old value estimate = Q(s, a)
new value estimate = r + max Q(s', a')    (maximum over all actions a' available in s')
```

The lecturer explains the bracket with numbers: suppose we currently think this action is worth 10, and this experience gives a new estimate of 20, so the two differ by 10. How far to move the existing estimate toward the new one is set by `α`. It is again called the learning rate, and here it represents how much new information is valued compared with old information:

- `α` = 1: the old value plus 1 × (new − old) is just the new estimate; the old one is discarded entirely.
- `α` = 0: new information is ignored and the Q value stays the same.
- Somewhere in between: keep some of each. The lecturer's reason is that you may already have tried this action nine times, and the tenth experience should not wipe out the first nine.

The new estimate has two parts: the reward `r` from this step, plus an estimate of future rewards. The future part is another call to the Q function: of all the actions available in the new state, take the one with the highest Q value.

The lecturer mentions that you can add one more parameter ([1:27:07](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5227s)) that discounts future rewards, meaning a reward now is worth more than a reward later; whether to add it, and how heavy the discount, is up to the programmer. He does not name the parameter aloud. The formula in the official notes writes it as γ, multiplying the max term; the formula above follows what the lecturer says and leaves γ out.

**Choosing actions once you have Q values** ([1:27:47](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5267s)). The most direct way is greedy: in the current state, look at `Q(s, a)` for every action and pick the highest.

The problem is that it can get stuck on a route that works but is not the best. Back in the grid world, the agent has found a path that reaches the reward, but there is a faster path it has never taken. At the square where the paths split, it knows that going down eventually leads to the reward and knows nothing about the other direction, so it goes down every time and never discovers the faster way.

This is the tension in reinforcement learning between **exploration** and **exploitation**. Exploitation means using what the AI already knows; exploration means trying actions it has not tried enough, which might reach the reward faster or bring more of it. An agent that only exploits and never explores can get reward, but may not get the most.

**ε-greedy** ([1:30:24](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5424s)) is a compromise. Set `ε` to how often you want to make a random move; then each time an action has to be chosen,

- with probability 1 − ε, choose the estimated best move;
- with probability ε, choose a random move.

The lecturer adds that you can explore more early in training and then decrease `ε` over time, choosing the best move more and more often as you become more confident that the possibilities have been explored.

**Check yourself. Write your answer down before opening the fold.** Using the lecture's numbers: `Q(s, a)` is currently 10 and the new estimate from this experience is 20. What is it after the update for `α` = 1, 0 and 0.5? Then: if the reward for this step is 0 and the three actions available in the new state have Q values 4, 20 and −3, how does the new estimate come out as 20? (`α` = 0.5 and the second half are my own.)

<details>
<summary>Answer</summary>

`α` = 1: 10 + 1 × (20 − 10) = 20, replaced by the new estimate. `α` = 0: 10 + 0 × 10 = 10, unchanged. `α` = 0.5: 10 + 0.5 × 10 = 15, halfway to the new estimate.

New estimate = r + the largest Q value in the new state = 0 + max(4, 20, −3) = 20. The step itself earns nothing, but it takes the agent to a state that has an action with Q value 20, so the step becomes valuable too. This is how reward travels backward from the goal one step at a time: in the grid world the agent first learns to move up in the square before the goal, and only afterwards learns to move left in the square before that.

</details>

### Letting an AI teach itself Nim, and function approximation

[Recording 1:31:37–1:38:43](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5497s)

Reinforcement learning is very often applied to game playing. To teach an agent a game, let it play the game a great many times, with the reward arriving only when each game ends: 1 for winning, −1 for losing. You do not tell it which moves are good or bad; it works that out from winning and losing.

The game the lecturer uses is **Nim** ([1:32:16](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5536s)). There are several piles of objects; the lecture starts with four piles of 1, 3, 5 and 7. Two players take turns, and on each turn a player removes any number of objects from **exactly one pile**, at least 1. **Whoever takes the last object loses.**

He talks through one game (the piles below are written out from the numbers he states, and left blank where he states none):

| Who | Move | Piles left |
|---|---|---|
| Start | | 1, 3, 5, 7 |
| Player 1, Player 2 | each removes 4 from one pile (the lecturer only says "this pile"; from the result these are the piles of 5 and 7, and the captions do not show who took which) | 1, 3, 1, 3 |
| Player 1 | removes the entire second pile | 1, 0, 1, 3 |
| Player 2 | removes 2 from the pile that has 3 | 1, 0, 1, 1 |
| Player 1 | removes 1 | two piles of 1 left |
| Player 2 | removes 1 | one pile of 1 left |
| Player 1 | has to take the last object | Player 1 loses |

In the fourth row from the bottom, the lecturer says aloud that player 2 removes 2 "from the third pile", but the numbers he states before and after (four piles of 1, 3, 1 and 3, then three piles with one object each) only work if it is the pile that has 3. I follow the numbers.

This game is easy to pose as a reinforcement learning problem: the state is just four numbers, how many objects remain in each pile; an action is how many to remove from which pile; and the reward comes only at the end, a punishment for the player forced to take the last object and a reward for the other.

**The demonstration** ([1:34:08](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5648s)). The lecturer has implemented an AI that plays Nim. It is trained by playing some number of games against itself and learning from each, and then a human plays against it.

The first time it trains on 0 games. The lecturer removes 5 from pile 3 and the AI takes 1 from pile 0; the lecturer removes all 5 from pile 2 and the AI takes 2 from pile 1, leaving one pile with 1 object and one pile with 2; the lecturer removes the 2 from pile 3, the AI has to take the last one, and the lecturer wins. An untrained AI is just playing randomly.

The second time it first plays 10,000 games against itself ([1:35:32](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5732s)). The lecturer removes 1 from pile 3 and the AI takes everything left in pile 3, leaving three piles; the lecturer removes 3 from pile 2 and the AI takes 1 from pile 0. The lecturer says he is now left with two piles of 2 each; he removes 1 from pile 1, the AI takes the 2 from pile 2, and he is left with no choice but to take the last object in pile 1, and loses. (Working forward from the moves as he states them, the piles facing him should be 3 and 2, which does not match the "two each" he says. Without the screen I cannot tell which spoken line is the slip; the last three moves are consistent with "two each".) The lecturer's conclusion is that after 10,000 games against itself, the AI has learned which actions tend to be good in which states.

The Nim project asks for the same thing: `play.py` likewise trains for 10,000 games before letting a human play, and the starting piles are likewise 1, 3, 5, 7. The lecturer demonstrates with a program he has already written, and the lecture does not mention the assignment.

**When there are too many states** ([1:36:59](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5819s)). Nim suits a demonstration because it has so few states. In a game like chess, with far more states and actions, you cannot learn a value for every action in every state. There you can use **function approximation**: instead of recording each `Q(s, a)` separately, use a function that estimates it from various features of the state, features you have to choose. What is learned this way generalizes to states never seen: if another state looks a lot like this one, the actions that worked here will probably work there too. The lecturer compares it with the depth-limited Minimax seen earlier ([Week 0](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en) in this series): both switch to an estimate when the full calculation is out of reach.

**Check yourself. Write your answer down before opening the fold.** Nim is down to a single pile of 2 objects and it is your turn. What does each of the two possible actions lead to? If all Q values start at 0 and `α` = 0.5 (the default in the project's `NimAI`), what is the Q value of "take 2" after its first update? After its second? (My own question.)

<details>
<summary>Answer</summary>

Take 1: one object is left, your opponent is forced to take it, the opponent loses and you win. Take 2: you took the last object yourself, so you lose.

"Take 2" loses on the spot, so its reward is −1, and the game is over, so there is no future reward: the new estimate is −1 + 0 = −1. First update: 0 + 0.5 × (−1 − 0) = −0.5. Second: −0.5 + 0.5 × (−1 − (−0.5)) = −0.75. Each update closes half the remaining gap to −1, and with enough tries it ends up right next to −1.

By the same reasoning the Q value of "take 1" climbs toward 1. I trained the reference implementation from Project 4B below for 10,000 games and looked up these two values: 1.0 and a number extremely close to −1, so in this state the AI takes 1.

</details>

### Unsupervised learning: k-means clustering

[Recording 1:38:43–1:45:48](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5923s)

The third major category is **unsupervised learning**, which the lecturer says he will touch on only briefly. It deals with data that has no labels. In supervised learning every data point was labeled as rainy or not, counterfeit or not; here there is none of that, but we would still like to learn some patterns from the data.

One such task is **clustering**: organizing a set of objects into groups whose members are similar to one another. The lecturer gives three applications: in genetic research, clustering similar genes; clustering the pixels of an image into different parts of the image; and in market research, dividing consumers into groups to decide which group to target with which advertisements.

**k-means** ([1:40:20](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=6020s)) is a clustering algorithm that divides the data into `k` clusters. Each cluster is represented by its **center**, and the algorithm repeats two steps:

1. **Assign**: give every point to the cluster whose center is nearest to it.
2. **Recenter** ([1:42:28](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=6148s)): move each center to the average position of the points assigned to it.

The lecturer's demonstration uses `k` = 3 (you have to choose `k`, and you can try several values and compare), with a blue, a red and a green cluster. The three centers start in random places. The first assignment is not great: the points in the red cluster are far apart, and so are the points in the green cluster. Then the centers move, each pulled toward the points assigned to it and leaning toward whichever side has more points. After the centers move, the points are reassigned and some change cluster: two points that were closest to the red center are now closer to the blue center, and three points that belonged to green are now closer to the red center. Recenter again, assign again, and so on.

The stopping condition: after an assignment, no point has changed cluster. At that point an equilibrium has been reached, the algorithm ends, and there are three clusters. No labels were used anywhere in the process.

The lecturer closes by saying that supervised, reinforcement and unsupervised learning each contain many more algorithms, and that this week covered the foundational ideas behind them; next week continues with other machine learning techniques.

**Check yourself. Write your answer down before opening the fold.** Six points lie on a number line: 1, 2, 3, 10, 11, 12, to be divided into `k` = 2 clusters. The two centers start at 1 and 4. Following the two steps of k-means, where do the centers end up? How many rounds of assignment does it take before stopping? (My own question.)

<details>
<summary>Answer</summary>

First assignment: 1 and 2 are closer to the center at 1; 3 is closer to the center at 4 (distance 1 versus 2); 10, 11 and 12 are also closer to 4. The clusters are {1, 2} and {3, 10, 11, 12}. Recenter: the first moves to (1 + 2) ÷ 2 = 1.5 and the second to (3 + 10 + 11 + 12) ÷ 4 = 9.

Second assignment: 3 is 1.5 away from 1.5 and 6 away from 9, so it switches to the first cluster. The clusters become {1, 2, 3} and {10, 11, 12}. Recenter: 2 and 11.

Third assignment: no point changes cluster, so stop. The centers end at 2 and 11 after three rounds of assignment. It does not matter that 3 started in the wrong cluster; once the centers moved it switched by itself, which is the "some points change cluster" step in the lecture's demonstration.

</details>

## Project 4A: Shopping — k-NN Purchase Intent Prediction

> How this site handles project solutions: by default each project shows only the approach, pseudocode, common mistakes and ways to check your work, and the full reference implementation is folded at the end of the project. The course's [academic honesty policy](https://cs50.harvard.edu/ai/honesty/) does not allow looking at someone else's solution before you submit your own.

### Task

`shopping.csv` records about 12,000 user sessions on a shopping website (12,330 rows in fact, 1,908 of which ended in a purchase). Write a nearest-neighbor classifier that predicts, from information such as how many pages the user visited, whether it is a weekend and which browser they use, whether the session will end in a purchase.

The spec does not look at accuracy alone. Its example: if about 15% of users go through with a purchase, a classifier that always predicts "no purchase" is 85% accurate and entirely useless. So two numbers are reported:

- **sensitivity** (true positive rate): of the users who did purchase, the proportion correctly identified.
- **specificity** (true negative rate): of the users who did not purchase, the proportion correctly identified.

The "always guess no" classifier has a specificity of 1.0 and a sensitivity of 0.0.

What you hand in is three functions in `shopping.py`: `load_data`, `train_model` and `evaluate`. The spec says not to modify anything outside those three functions, and not to modify `shopping.csv`.

### What the official code already provides

The `main` function of `shopping.py` is already written: it calls `load_data` to read the data, uses `train_test_split` to hold out 40% as the testing set, calls `train_model` to train, calls `model.predict(X_test)` directly on the returned model, then uses `evaluate` to compute the two proportions and prints four lines of results. Below are the imports at the top of the official file and the three functions left to implement, copied verbatim from the official zip (`main`, in between, is omitted):

```python
import csv
import sys

from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

TEST_SIZE = 0.4


def load_data(filename):
    """
    Load shopping data from a CSV file `filename` and convert into a list of
    evidence lists and a list of labels. Return a tuple (evidence, labels).

    evidence should be a list of lists, where each list contains the
    following values, in order:
        - Administrative, an integer
        - Administrative_Duration, a floating point number
        - Informational, an integer
        - Informational_Duration, a floating point number
        - ProductRelated, an integer
        - ProductRelated_Duration, a floating point number
        - BounceRates, a floating point number
        - ExitRates, a floating point number
        - PageValues, a floating point number
        - SpecialDay, a floating point number
        - Month, an index from 0 (January) to 11 (December)
        - OperatingSystems, an integer
        - Browser, an integer
        - Region, an integer
        - TrafficType, an integer
        - VisitorType, an integer 0 (not returning) or 1 (returning)
        - Weekend, an integer 0 (if false) or 1 (if true)

    labels should be the corresponding list of labels, where each label
    is 1 if Revenue is true, and 0 otherwise.
    """
    raise NotImplementedError


def train_model(evidence, labels):
    """
    Given a list of evidence lists and a list of labels, return a
    fitted k-nearest neighbor model (k=1) trained on the data.
    """
    raise NotImplementedError


def evaluate(labels, predictions):
    """
    Given a list of actual labels and a list of predicted labels,
    return a tuple (sensitivity, specificity).

    Assume each label is either a 1 (positive) or 0 (negative).

    `sensitivity` should be a floating-point value from 0 to 1
    representing the "true positive rate": the proportion of
    actual positive labels that were accurately identified.

    `specificity` should be a floating-point value from 0 to 1
    representing the "true negative rate": the proportion of
    actual negative labels that were accurately identified.
    """
    raise NotImplementedError
```

Additional requirements from the spec page:

- Each row's evidence is in the same order as the CSV columns; the last column, `Revenue`, is the label and is not included.
- `VisitorType` is 1 only when the value is `Returning_Visitor`; any other string is 0.
- The checkpoint the spec gives: the first evidence list should be `[0, 0.0, 0, 0.0, 1, 0.0, 0.2, 0.2, 0.0, 0.0, 1, 1, 1, 1, 1, 1, 0]`, with label 0.
- The true labels used for testing are guaranteed to contain at least one positive and one negative label.

### Approach

Each of the three functions does one thing and they are independent, so you can write and test them one at a time.

**`load_data`: turn one row of text into 17 numbers.** Nearest-neighbor classification works by measuring distance (see [Supervised learning, classification and nearest neighbor](#supervised-learning-classification-and-nearest-neighbor)), so every column has to be a number. Everything read from a CSV is a string, and the job is to convert column by column: columns the docstring calls integers become integers, and those it calls floating point numbers become floats; the month abbreviation becomes an index from 0 to 11; `VisitorType`, `Weekend` and the label `Revenue` are text, so you compare the string yourself and turn it into 1 or 0. The lecture's `banknotes0.py` does a simpler version of the same thing: the first four values of each row are the evidence and the last column is the label ([1:02:17](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=3737s)). The only difference is that that data was all numbers to begin with.

**`train_model`: build a classifier that looks at 1 neighbor, and train it.** This is the lecture's k-NN ([10:27](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=627s)) with `k` = 1. You do not write the classifier yourself; the official file already imports scikit-learn's `KNeighborsClassifier`, and the lecture shows how to create a model and train it with `fit` in [Trying it with scikit-learn](#trying-it-with-scikit-learn-banknote-authentication-data). Splitting into training and testing sets is not your job; `main` already does it with `train_test_split` ([1:08:46](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=4126s)).

**`evaluate`: count four kinds of rows and compute two proportions.** Line up the actual labels and the predictions pair by pair. The denominator of sensitivity is the number of rows that are actually 1, and its numerator is how many of those were also predicted 1; the denominator of specificity is the number of rows that are actually 0, and its numerator is how many of those were also predicted 0. The two proportions have different denominators, and neither is the total number of rows.

### Pseudocode

```text
load the data:
    for every row below the header:
        build 17 numbers in column order
            page counts and category codes → integers
            durations and rates → decimals
            month → 0 (January) to 11 (December)
            returning visitor, weekend → 1 or 0
        label ← 1 if a purchase was made, otherwise 0
    return (the numbers for all rows, the labels for all rows)

train:
    create a nearest-neighbor classifier that looks at 1 neighbor
    have it remember the training data and the matching labels
    return that classifier

evaluate:
    positives ← number of rows whose actual label is 1
    negatives ← number of rows whose actual label is 0
    positives found ← rows that are actually 1 and also predicted 1
    negatives found ← rows that are actually 0 and also predicted 0
    return (positives found ÷ positives, negatives found ÷ negatives)
```

### Common mistakes

Each item below is something this site confirmed while running an implementation inside the official directory.

- **June is spelled `June`.** The months in the data are `Feb`, `Mar`, `May`, `June`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`. Only June is not three letters, and there are no rows for January or April. If your lookup table spells June as `Jun`, the first June row raises an exception (`ValueError` with a list lookup, `KeyError` with a dict). The absence of January and April does not mean you can drop them from the table; the indexes still run from 0 to 11.
- **`TRUE` and `FALSE` are strings.** Converting any non-empty string to a boolean gives true, `"FALSE"` included. Written that way, every label and every `Weekend` value becomes 1 and nothing raises an error. How to notice: the labels should sum to 1,908, not 12,330.
- **`VisitorType` has three values.** The data contains `Returning_Visitor`, `New_Visitor` and `Other`; only the first is 1.
- **Keep integer columns and float columns apart.** In Python `0 == 0.0` is true, so comparing a whole row for equality with the spec's checkpoint will not reveal a wrong type; check the types column by column as well.
- **`train_model` must return the classifier itself.** `main` calls `predict` directly on the return value. If you return a tuple or some other wrapper (the model together with another object, say), `main` raises an `AttributeError` saying a tuple has no `predict`.
- **Do not add standardization on your own.** The spec asks for a `k` = 1 classifier fitted on the data passed in; it does not ask for the features to be standardized first. `main` feeds raw values to `predict`, so if you scale the training data only inside `train_model`, the training data the model saw and the testing data are on different scales. This site tried it with `StandardScaler` applied to the training data only (303 runs of mine, and a separate 48 by the independent reviewer). In 295 of my 303 runs the true positive rate dropped to between 0% and 2.6% while the true negative rate was between 87% and 99.8%: the model guesses "no purchase" almost every time. All 48 of the reviewer's runs were of this kind (0.13% to 2.52%, and 88.73% to 99.50%). The true negative rate then looks normal, even higher than without scaling, so you have to look at the true positive rate to notice. My other 8 runs flipped the other way and guessed "purchase" almost every time: a true positive rate of 88% to 98% and a true negative rate of 10% to 21%.
- **Swapping the two proportions, or computing accuracy.** Symmetric test data will not reveal this; the check below deliberately uses an example where the two answers differ.
- **A true positive rate of only about 40% is normal.** The sample output on the spec page is 41.02%. Do not go back and "fix" the classifier when you see that number.

### How to check your own work

**`load_data`**: in an interactive Python session, call `load_data("shopping.csv")`:

- evidence and labels both have length 12,330.
- Every row has length 17.
- The first row equals the spec's checkpoint `[0, 0.0, 0, 0.0, 1, 0.0, 0.2, 0.2, 0.0, 0.0, 1, 1, 1, 1, 1, 1, 0]` and the first label is 0. Then check the types column by column: the 2nd, 4th and 6th through 10th values are `float`, the rest are `int`.
- The labels sum to 1,908.

**`evaluate`**: a small case you can work out by hand, `evaluate([1, 1, 0, 0, 0], [1, 0, 0, 0, 1])`. Two rows are actually 1 and one of them is predicted correctly, so sensitivity is 1 ÷ 2 = 0.5; three rows are actually 0 and two of them are predicted correctly, so specificity is 2 ÷ 3, about 0.667. Getting `(0.667, 0.5)` means the two proportions are swapped; getting 0.6 twice means you computed accuracy (three right out of five).

**The whole program**:

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/4/shopping.zip
unzip shopping.zip && cd shopping
pip3 install scikit-learn

python shopping.py shopping.csv
# Prints four lines: Correct, Incorrect, True Positive Rate, True Negative Rate
```

- `Correct` plus `Incorrect` should be 4,932 (40% of 12,330).
- The sample output on the spec page is `Correct: 4088`, `Incorrect: 844`, `True Positive Rate: 41.02%`, `True Negative Rate: 90.55%`.
- This site's reference implementation was run 15 times in total (2026-10-13; 7 runs of mine on Python 3.15 and 8 by the independent reviewer on Python 3.13, all with scikit-learn 1.9.1): the true positive rate was roughly 37% to 42% and the true negative rate roughly 90% to 91% (the actual extremes were 36.86% and 41.97%, and 89.69% and 91.34%). The split is random each time, so anything near that range is normal; if you are far off (one proportion down in single digits, for example), go back to the list above.

**Official checks**:

```bash
check50 ai50/projects/2024/x/shopping
style50 shopping.py
```

### Full reference implementation

<details>
<summary>Full reference implementation (open only after you have written and submitted your own)</summary>

> ⚠️ If you are taking this course, or plan to apply for a CS50 certificate: the course's [academic honesty policy](https://cs50.harvard.edu/ai/honesty/) says you may not look at someone else's solution before submitting your own work. Finish and submit first, then use this section to compare. This implementation was run only in the environments listed on this site and has not been through check50.

```python
def load_data(filename):
    months = ["Jan", "Feb", "Mar", "Apr", "May", "June",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    evidence = []
    labels = []
    with open(filename) as f:
        for row in csv.DictReader(f):
            evidence.append([
                int(row["Administrative"]),
                float(row["Administrative_Duration"]),
                int(row["Informational"]),
                float(row["Informational_Duration"]),
                int(row["ProductRelated"]),
                float(row["ProductRelated_Duration"]),
                float(row["BounceRates"]),
                float(row["ExitRates"]),
                float(row["PageValues"]),
                float(row["SpecialDay"]),
                months.index(row["Month"]),
                int(row["OperatingSystems"]),
                int(row["Browser"]),
                int(row["Region"]),
                int(row["TrafficType"]),
                1 if row["VisitorType"] == "Returning_Visitor" else 0,
                1 if row["Weekend"] == "TRUE" else 0,
            ])
            labels.append(1 if row["Revenue"] == "TRUE" else 0)
    return evidence, labels


def train_model(evidence, labels):
    model = KNeighborsClassifier(n_neighbors=1)
    model.fit(evidence, labels)
    return model


def evaluate(labels, predictions):
    positives = sum(1 for label in labels if label == 1)
    negatives = sum(1 for label in labels if label == 0)
    true_positives = sum(
        1 for label, prediction in zip(labels, predictions)
        if label == 1 and prediction == 1
    )
    true_negatives = sum(
        1 for label, prediction in zip(labels, predictions)
        if label == 0 and prediction == 0
    )
    return true_positives / positives, true_negatives / negatives
```

This implementation was run inside the official `shopping` directory (Python 3.15, scikit-learn 1.9.1): `load_data` reads 12,330 rows and the first row matches the spec's checkpoint; the runs of `python shopping.py shopping.csv` are the range given under "How to check your own work" above.

</details>

---

## Project 4B: Nim — Q-learning Learns to Play

> The full reference implementation is likewise folded at the end of this section; write and submit your own before opening it.

### Task

Have an AI teach itself Nim through self-play. The rules are the same as in the lecture: several piles of objects, players take turns removing any number of objects (at least 1) from one non-empty pile, and **whoever removes the last object loses**.

The rewards the spec gives: an action that loses the game is −1; an action that results in the other player losing is 1; an action after which the game continues has an immediate reward of 0 but will also have some future reward.

What you hand in is four methods of `NimAI` in `nim.py`: `get_q_value`, `update_q_value`, `best_future_reward` and `choose_action`. The spec says not to modify the rest of `nim.py`; you may modify `play.py` to test on your own.

### What the official code already provides

`nim.py` has two classes and two functions, and `Nim`, `train` and `play` are already implemented.

- **`Nim`**: `piles` is a list of how many objects remain in each pile, starting at `[1, 3, 5, 7]` by default; `player` is 0 or 1; `winner` starts as `None`. `Nim.available_actions(piles)` returns the set of all legal actions, where an action `(i, j)` means removing `j` objects from pile `i` (0-indexed); for example, `Nim.available_actions([2, 1, 0, 0])` returns `{(0, 1), (1, 1), (0, 2)}`. `move(action)` performs the action and switches player; if every pile is now empty it sets `winner` to the player after the switch, that is, the one who did not take the last object.
- **`train(n)`**: has one `NimAI` play `n` games against itself, remembering each side's last move. When a move ends the game, it updates that move with reward −1 and then updates the opponent's last move with reward 1; when the game continues, it updates the last move of the player now to move with reward 0, where the new state is the position after the opponent's reply. The rewards come from `train`; you do not decide who won.
- **`play.py`**: three lines, `train(10000)` followed by `play(ai)` so a human can play.

Below is the `NimAI` class, copied verbatim from the official zip. `__init__` and `update` are written for you, and the four `raise NotImplementedError` lines are what you fill in:

```python
class NimAI():

    def __init__(self, alpha=0.5, epsilon=0.1):
        """
        Initialize AI with an empty Q-learning dictionary,
        an alpha (learning) rate, and an epsilon rate.

        The Q-learning dictionary maps `(state, action)`
        pairs to a Q-value (a number).
         - `state` is a tuple of remaining piles, e.g. (1, 1, 4, 4)
         - `action` is a tuple `(i, j)` for an action
        """
        self.q = dict()
        self.alpha = alpha
        self.epsilon = epsilon

    def update(self, old_state, action, new_state, reward):
        """
        Update Q-learning model, given an old state, an action taken
        in that state, a new resulting state, and the reward received
        from taking that action.
        """
        old = self.get_q_value(old_state, action)
        best_future = self.best_future_reward(new_state)
        self.update_q_value(old_state, action, old, reward, best_future)

    def get_q_value(self, state, action):
        """
        Return the Q-value for the state `state` and the action `action`.
        If no Q-value exists yet in `self.q`, return 0.
        """
        raise NotImplementedError

    def update_q_value(self, state, action, old_q, reward, future_rewards):
        """
        Update the Q-value for the state `state` and the action `action`
        given the previous Q-value `old_q`, a current reward `reward`,
        and an estiamte of future rewards `future_rewards`.

        Use the formula:

        Q(s, a) <- old value estimate
                   + alpha * (new value estimate - old value estimate)

        where `old value estimate` is the previous Q-value,
        `alpha` is the learning rate, and `new value estimate`
        is the sum of the current reward and estimated future rewards.
        """
        raise NotImplementedError

    def best_future_reward(self, state):
        """
        Given a state `state`, consider all possible `(state, action)`
        pairs available in that state and return the maximum of all
        of their Q-values.

        Use 0 as the Q-value if a `(state, action)` pair has no
        Q-value in `self.q`. If there are no available actions in
        `state`, return 0.
        """
        raise NotImplementedError

    def choose_action(self, state, epsilon=True):
        """
        Given a state `state`, return an action `(i, j)` to take.

        If `epsilon` is `False`, then return the best action
        available in the state (the one with the highest Q-value,
        using 0 for pairs that have no Q-values).

        If `epsilon` is `True`, then with probability
        `self.epsilon` choose a random available action,
        otherwise choose the best action available.

        If multiple actions have the same Q-value, any of those
        options is an acceptable return value.
        """
        raise NotImplementedError
```

The spec page adds: the state passed to these methods is a list of integers and an action is `(i, j)`; the keys of `self.q` use the tuple version of the state, for example `self.q[(0, 0, 0, 2), (3, 2)] = -1`.

### Approach

Together the four methods are the content of [Q-learning and ε-greedy](#q-learning-and-ε-greedy) in the lecture, and `update` already strings them together: look up the old estimate, ask what the most future reward in the new state is, then apply the update.

**`get_q_value`: look it up, and count a miss as 0.** The lecture says every `Q(s, a)` starts at 0. You do not have to fill in a 0 for every pair in advance; treating anything not in the table as 0 is enough.

**`update_q_value`: apply the update.** It is the lecture's formula ([1:22:50](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=4970s)): the old estimate plus `α` times "the new estimate minus the old estimate". In terms of the parameters: `old_q` is the old estimate, the new estimate is `reward` plus `future_rewards`, and `α` is `self.alpha`. The discount parameter mentioned in the lecture is not used in this assignment.

**`best_future_reward`: the largest Q value in the new state.** This is the "maximum over all available actions" term of the update. Ask the `Nim` class which actions are legal in this state, look up the Q value of each, and take the largest; actions never recorded count as 0. When the game is over every pile is empty and there is no action at all, and in that case you return 0.

**`choose_action`: greedy or ε-greedy.** With the `epsilon` argument `False` it is the lecture's greedy ([1:27:47](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5267s)): pick the action with the highest Q value. With `True` it is ε-greedy ([1:30:24](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5424s)): with probability `self.epsilon` pick a random legal action, and otherwise the best one. `train` calls it without this argument, so it uses the default `True` and explores during training; `play` passes `False`, so in a match the AI always picks the best.

For how the game itself runs and why the AI gets stronger after self-play, see [Letting an AI teach itself Nim](#letting-an-ai-teach-itself-nim-and-function-approximation) ([1:32:16](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5536s)).

### Pseudocode

```text
look up a Q value (state, action):
    the pair is in the table → return it
    it is not → return 0

update a Q value (state, action, old estimate, reward, future estimate):
    new estimate ← reward + future estimate
    this pair in the table ← old estimate + α × (new estimate − old estimate)

best future reward (state):
    no action is available in this state → return 0
    otherwise → return the largest Q value among the available actions (unrecorded ones count as 0)

choose an action (state, whether to explore):
    list every action available in this state
    if exploring, and this draw falls within probability ε:
        return any available action at random
    otherwise:
        return the action with the largest Q value (any one of them on a tie)
```

### Common mistakes

- **Whoever takes the last object loses.** Many descriptions of Nim say the player who takes the last object wins; this assignment is the opposite (an earlier version of this page had it backwards). Winning, losing and the rewards are all handled by the official `Nim.move` and `train`, so your four methods never decide them. But when you check whether the AI plays well, use the right rule: with a single pile of 2 left, the good move is to take 1, not to take both.
- **The state has to become a tuple before it can be a key.** The state passed in is a list. Building a dictionary key directly from a list raises a `TypeError` on both reads and writes (lists are not hashable). Every one of the four methods that touches `self.q` needs the tuple version of the state.
- **When every pile is empty.** On the move that ends the game, `train` asks for the best future reward of the all-empty position. There are no actions then, and taking the maximum of an empty collection raises a `ValueError`, which happens as soon as the first training game ends. Handle the "no actions" case first.
- **Unrecorded actions count as 0; they are not skipped.** If the maximum is taken only over pairs already in the table, it goes wrong: when a state has just one recorded action and its Q value is negative, the right answer is 0 (the untried actions count as 0), while looking only at the table gives that negative number.
- **The `epsilon` argument is a boolean; `self.epsilon` is the probability.** The two names differ only by `self.`. If you compare a random number with the argument `epsilon` (`True`), `True` is treated as 1 and every move is random. Nothing raises an error; the AI just never uses what it has learned during training.
- **With `epsilon=False` there must be no randomness at all** (apart from choosing among ties). Otherwise the AI will occasionally make an obviously bad move in a match.
- **The file to run is `play.py`.** `nim.py` has no main program, and running it directly prints nothing.

### How to check your own work

**Small cases you can verify without training**: in an interactive Python session run `from nim import Nim, NimAI`, create `ai = NimAI()` (`alpha` defaults to 0.5), and do the following in order:

| Step | What you should see |
|---|---|
| `ai.get_q_value([0, 0, 0, 2], (3, 2))` | 0 (nothing recorded yet) |
| `ai.update_q_value([0, 0, 0, 2], (3, 2), 0, -1, 0)`, then look up the same pair | −0.5, that is 0 + 0.5 × (−1 − 0) |
| `ai.update_q_value([0, 0, 0, 2], (3, 2), -0.5, -1, 0)`, then look it up again | −0.75, that is −0.5 + 0.5 × (−1 − (−0.5)) |
| `ai.best_future_reward([0, 0, 0, 0])` | 0 (no action available) |
| `ai.best_future_reward([0, 0, 0, 2])` | 0 (`(3, 2)` is −0.75, the unrecorded `(3, 1)` counts as 0, take the larger) |
| `ai.choose_action([0, 0, 0, 2], epsilon=False)` | `(3, 1)` |

The numbers in the first three rows are the ones worked out by hand in [the self-check of the Nim section of the walkthrough](#letting-an-ai-teach-itself-nim-and-function-approximation). This site's reference implementation gives exactly the values in the table for these six steps.

**After training**:

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/4/nim.zip
unzip nim.zip && cd nim

python play.py  # trains for 10,000 games, then you play the AI
```

After 10,000 training games (add a few lines after `train(10000)` in `play.py` to inspect, or call `train` in an interactive session), this site's reference implementation gave the following (2026-10-13; 1 run of mine and 3 by the independent reviewer with three different random seeds, 4 runs in all):

- State `[0, 0, 0, 2]`: the Q value of `(3, 1)` is 1.0, the Q value of `(3, 2)` is right next to −1 (within one hundred-millionth), and `choose_action(..., epsilon=False)` picks `(3, 1)`.
- `self.q` holds between 2,375 and 2,452 Q values.
- Against an opponent that moves at random on every turn, 2,000 games as first player and 2,000 as second: 3 of the 4 runs won every game, and 1 run won 1,995 as first player.
- The reviewer also tested an opponent that follows the optimal strategy: the AI won all 200 games as second player and lost all 200 as first player. Losing every game as first player is not a flaw in the implementation; with both sides playing correctly, the 1, 3, 5, 7 opening is a loss for whoever moves first.

So when you play the AI yourself, it is very hard to beat when you move first; when it moves first, beating it by playing well enough is normal.

**Official checks**:

```bash
check50 ai50/projects/2024/x/nim
style50 nim.py
```

### Full reference implementation

<details>
<summary>Full reference implementation (open only after you have written and submitted your own)</summary>

> ⚠️ If you are taking this course, or plan to apply for a CS50 certificate: the course's [academic honesty policy](https://cs50.harvard.edu/ai/honesty/) says you may not look at someone else's solution before submitting your own work. Finish and submit first, then use this section to compare. This implementation was run only in the environments listed on this site and has not been through check50.

```python
    def get_q_value(self, state, action):
        return self.q.get((tuple(state), action), 0)

    def update_q_value(self, state, action, old_q, reward, future_rewards):
        new_estimate = reward + future_rewards
        self.q[tuple(state), action] = old_q + self.alpha * (new_estimate - old_q)

    def best_future_reward(self, state):
        actions = Nim.available_actions(state)
        if not actions:
            return 0
        return max(self.get_q_value(state, action) for action in actions)

    def choose_action(self, state, epsilon=True):
        actions = list(Nim.available_actions(state))
        if epsilon and random.random() < self.epsilon:
            return random.choice(actions)
        return max(actions, key=lambda action: self.get_q_value(state, action))
```

This implementation was run inside the official `nim.py` (Python 3.15), and the results are the numbers given under "How to check your own work" above. The items against a random opponent do not show that it never loses to any opponent.

</details>

---

## Learning Checklist

- [ ] Can state the difference between nearest neighbor and k-NN, and classify by hand from a list of distances for different `k`
- [ ] Can write the perceptron learning rule and say how the weights change when the estimate is right, too high or too low
- [ ] Can explain where 0-1, L1 and L2 loss are each used, and why L2 penalizes large errors more
- [ ] Can explain overfitting, and how regularization, holdout and k-fold cross-validation each deal with it
- [ ] Can write the Q-learning update by hand and say what `α` and `ε` each control
- [ ] Understand why sensitivity and specificity are more useful than a single accuracy figure (Shopping project)
- [ ] Shopping: your own `load_data` reads 12,330 rows, the first row equals the spec's checkpoint and the labels sum to 1,908; `evaluate([1, 1, 0, 0, 0], [1, 0, 0, 0, 1])` gives (0.5, about 0.667)
- [ ] Nim: all six steps of the no-training case match (0, −0.5, −0.75, 0, 0, `(3, 1)`); after 10,000 training games the state `[0, 0, 0, 2]` picks `(3, 1)`
- [ ] Understand why Nim's `self.q` needs the state converted to a tuple before it can be a key
- [ ] Understand how `choose_action` behaves differently in training (`epsilon=True`) and in a match (`epsilon=False`)
- [ ] Both projects pass `check50` clean

## Course video sources

The official CS50 YouTube playlist (CS50’s Introduction to Artificial Intelligence with Python, 8 videos) was checked live on 2026-10-10; the Week 4 lecture recording is listed there.

Original videos: [Learning - Lecture 4 - CS50's Introduction to Artificial Intelligence with Python 2020](https://www.youtube.com/watch?v=-g0iJjnO2_w)

Course and recording entries:

- [CS50 AI Week 4 — official video, slides and notes](https://cs50.harvard.edu/ai/weeks/4/)
- [CS50's Introduction to AI with Python — official YouTube playlist (8 videos)](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-13): the timecoded, human-written English captions were fetched with yt-dlp and read in full (1:45:48) before "Lecture walkthrough" was rewritten. Section start times and the numbers quoted (the 3-to-2 vote in k-NN, the 0-1 loss of 4, sales of 2,800/2,900/1,000, ten folds, the banknote results 679/7, 682/4 and 685/1, the Q values 10 and 20, Nim's 1-3-5-7 and 10,000 games) come from the captions; formulas were also checked against the text of the official notes and its two formula images (`perceptronlearning.png` and `qlearning.png`, downloaded and viewed on 2026-10-13): the `× xᵢ` factor in the perceptron update, which the captions do not read out, comes from the formula in the official notes; the Q-learning formula in the official notes has γ in front of the max term, while the lecturer only says aloud that a discounting parameter can be added, without naming it, so the article's formula follows what he says and leaves γ out. The slides were not viewed, and the scatter plots, decision boundaries and grid world on screen are not reconstructed. Around 25:57 the human-written captions read "these is are positive values", which from the automatic captions and context is "these x's". In the sample Nim game at 1:32:57 the lecturer says only "this pile here" for the first two moves, so the captions cannot show who removed from which pile, and the article gives only the piles he states after both moves. The captions and the demonstrations disagree in four places: in the sample Nim game at 1:33 the lecturer says player 2 removes 2 "from the third pile", but the numbers he states before and after require the pile that has 3, and the article follows the numbers; in the second demo game at 1:36 the moves as stated should leave him facing piles of 3 and 2, while he says two piles of 2 each, and without the screen it is impossible to tell which line is the slip, so the article reports what he says and notes it in the text; at 1:38:43 he refers to the three categories as "two of the main categories of reinforcement learning", which from context means categories of machine learning; and at 1:37:31 the phrase the captions mark as unclear, "min and max… death limiting", is from context Minimax's depth-limiting. The published lecture source `banknotes0.py` defaults to `GaussianNB()` and a test proportion of 0.40, and `banknotes1.py` also has `test_size=0.4`, unlike the lecture (starting from Perceptron, holding out half); the article follows the lecture. Nim appears in the video as a demonstration of Q-learning, and the captions never mention the Shopping or Nim project assignments; the project descriptions come from the course website and the official zip files.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official CS50 YouTube playlist was checked live and lists this week’s lecture recording, so the status is now Videos included.
- 2026-10-10: Checked the video content against its transcript. Reordered the video timeline to match the transcript, removed topics not found in it, and made timecodes approximate.
- 2026-10-13: Moved the player from the source section to "Lecture Video & Timestamps" and added the running time to the opening.
- 2026-10-13: Rewrote the "Core Concepts Cheat Sheet" from the timecoded captions as a ten-section "Lecture walkthrough", each section with a time link and one self-check question; the timeline went from approximate minutes to actual start times, and the running time is now 1:45:48 as reported by yt-dlp. Content in the old cheat sheet that the lecture does not cover was removed: the table comparing the three classifiers' complexity, pros and cons, standardizing features before k-NN, the hard-margin/soft-margin SVM objectives and kernel formulas, the Bellman equation, the formula with discount factor γ, and the convergence conditions for Q-learning.
- 2026-10-13: Rewrote both project sections from the official zip files and spec pages. Shopping: `train_model` used to return `(model, scaler)`, which fails because the official `main` calls `predict` directly on the return value; it now returns the `KNeighborsClassifier(n_neighbors=1)` itself, and the standardization the spec does not ask for is gone. Nim: the text used to say the player who takes the last object wins, while the official rule is that whoever takes the last object loses; the `Nim`, `NimAI`, `train` and `play` code shown did not match the classes and methods in the official `nim.py`, and is replaced by the official structure and the four methods to implement (`get_q_value`, `update_q_value`, `best_future_reward`, `choose_action`); the no-op `python nim.py` was dropped from the run commands. Both reference implementations were run inside the official directories. The learning checklist was rewritten to match.
- 2026-10-13: Corrections after independent review. The first two moves of the sample Nim game are merged into one row, no longer stating who removed from which pile, which the captions cannot show; the discount parameter is now described as unnamed aloud and written as γ in the official notes' formula; the answer to the perceptron self-check now says one more update flips the prediction, with the arithmetic; the source of `× xᵢ` is now the formula in the official notes; the two problems with the hard threshold follow the lecturer's order; `test_size=0.4` in `banknotes1.py` is noted; the rerun results for the banknote demo and Shopping now give the combined number of runs and ranges from the author and the reviewer; the sentence on SVMs and non-linearly-separable data notes that the lecturer does not explain how; cross-week links no longer attribute week numbers to the lecturer. Wording: "OCW site" is now "course website".
- 2026-10-13: Project sections now put the task, what the official code provides, the approach, pseudocode, common mistakes and ways to check your work first, with the full reference implementation folded at the end of each project behind a notice that links to the course's [academic honesty policy](https://cs50.harvard.edu/ai/honesty/). The distribution code excerpts are now verbatim from the official files, docstrings included. The reference implementation code is unchanged. The learning checklist gained verifiable conditions for both projects.
- 2026-10-13: Corrections after the project-section re-review. The "do not add standardization" item was rewritten: it now names `StandardScaler`, gives the author's and the reviewer's run counts and ranges separately, and describes the usual symptom as a true positive rate near 0 with a true negative rate that is even higher; the earlier "88% and 20%" was one of the few runs that flip the other way. The Shopping run ranges are now approximate with updated run counts; the checklist's six steps gained the first value; the frontmatter tldr and description no longer announce project implementations.

## References

- [Week 4 Learning lecture page](https://cs50.harvard.edu/ai/weeks/4/) — video, slides, transcript, quiz
- [Learning - Lecture 4 (YouTube)](https://www.youtube.com/watch?v=-g0iJjnO2_w) — the basis of "Lecture walkthrough"; content, numbers and time links come from its English captions
- [Week 4 Notes (2020 edition)](https://cs50.harvard.edu/ai/2020/notes/4/) — official notes, for the figures and formulas on the slides
- [Shopping project spec](https://cs50.harvard.edu/ai/projects/4/shopping/) — Distribution code `2023/x`, check50 slug `ai50/projects/2024/x/shopping`
- [Nim project spec](https://cs50.harvard.edu/ai/projects/4/nim/) — Distribution code `2023/x`, check50 slug `ai50/projects/2024/x/nim`
- [CS50 AI academic honesty policy](https://cs50.harvard.edu/ai/honesty/) — the reason project solutions are folded by default
- [CS50 AI YouTube playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 documentation](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- On this site: [Harvard CS50 AI Overview](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en) — series entry & version notes
- On this site: [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) — A3 tier definition
