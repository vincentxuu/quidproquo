---
title: "The Supervised Learning Setup and Linear Regression: How a Line Is Learned from Data | Stanford CS229 Lecture 2"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, linear-regression, gradient-descent, supervised-learning]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 2
tldr: "Lecture 2 breaks supervised learning into three pieces: a hypothesis h, the least-squares cost J(θ), and an algorithm that drives J down. Gradient descent sweeps all n examples on every step; minibatch SGD updates after looking at a small batch, and pays for it by bouncing around near the optimum. Linear regression also has a closed-form solution, θ = (XᵀX)⁻¹Xᵀy, provided XᵀX is invertible."
description: "A guide to Lecture 2 of Stanford CS229 (Spring 2026): the notation of supervised learning, the linear hypothesis, the least-squares cost function, batch gradient descent, sampling and batch-size trade-offs in minibatch SGD, and a full derivation of the normal equations, plus a worked example on three data points."
draft: false
math: true
---

> 🌏 [中文版](/posts/ai/2026-10-12-stanford-cs229-lecture-02-supervised-learning-linear-regression)

**Video status: Videos included.** This article is written from the English transcript of the Spring 2026 Lecture 2 recording published by Stanford Online, with formula notation checked against Chapter 1, "Linear regression", of the 2026 main lecture notes. A transcript does not show the slides or the handwriting on screen, so where the lecturer points at the screen, this article covers only what the surrounding speech and the notes make it possible to reconstruct.

This is the first lecture of [Stanford CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en) with technical content. The [previous lecture](/posts/ai/2026-10-12-stanford-cs229-lecture-01-introduction-en) was the course introduction; this one has a new lecturer and starts supervised learning. The lecturer himself frames it as a notation lecture: you have probably seen linear regression before, but classification, generalized linear models, and neural networks in the coming weeks all reuse the notation fixed today.

The prerequisites are partial derivatives, the inner product of vectors, matrix multiplication, and matrix inverses. After reading, you should be able to do three things: write a prediction problem as $h_\theta$ and $J(\theta)$; compute one step of gradient descent and one step of SGD by hand; and derive the normal equations from $J(\theta)$ and say when they fail.

```youtube
url: https://www.youtube.com/watch?v=cmNIMjPYdgM
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 2: Supervised Learning Setup
captions: en
```

## What this lecture sets out to cover (recording 00:00–05:50)

Chris Ré teaches this lecture. He opens by saying that he is responsible for the next stretch of the course and will alternate with Tengyu Ma after that. He teaches from slides, and reminds the class that the slides are only a subset of Tengyu's lecture notes, so anyone who wants the rigorous version should go back to the notes.

He lays out the route for the lecture at 03:09: notation first, then linear regression, then the workhorse algorithms, batch and stochastic gradient descent, and finally the normal equations as practice in differentiating with matrices and vectors. His verdict on the two algorithms is blunt:

> "you're going to realize that these are really stupid algorithms, hopefully. They're really simple, but that simplicity is what allowed us to scale them up and run them on huge amounts of data" (04:11)

That sentence is the thread running through the whole lecture. When he later discusses step sizes, batch sizes, and when to stop training, he keeps returning to the same position: machine learning cares about whether the computation can run on large amounts of data, and estimating the parameters very precisely comes second.

He also reminds the class several times that if today's notation, partial derivatives, or linear algebra feel unfamiliar, they should go to the Friday TA sections, because later lectures will assume all of it.

## The supervised learning setup (recording 05:50–10:40)

### The hypothesis and the training set

The central object in supervised learning is a function

$$
h: \mathcal{X} \to \mathcal{Y}
$$

called the hypothesis, which is the prediction function. $\mathcal{X}$ and $\mathcal{Y}$ are just two sets, and the lecture gives three pairings:

- $\mathcal{X}$ is all images, and $\mathcal{Y}$ is a fixed set of labels (cat, dog, horse, building)
- $\mathcal{X}$ is text, and $\mathcal{Y}$ is a positive or negative review
- $\mathcal{X}$ is data about houses, and $\mathcal{Y}$ is the price, a real number

"Supervised" means we have a training set of inputs paired with their answers:

$$
\{(x^{(1)}, y^{(1)}), (x^{(2)}, y^{(2)}), \dots, (x^{(n)}, y^{(n)})\}
$$

A superscript in parentheses is the index of an example and has nothing to do with powers. $x^{(i)}$ is the $i$-th input, and $y^{(i)}$ is its label.

### What counts as a good prediction

There are uncountably many functions from $\mathcal{X}$ to $\mathcal{Y}$. Which one is good? The lecturer's answer is that it should generalize: the training set comes from some representative source, and when $h$ later sees a new input from outside the training set, it still gives the right answer. Shown a photo of a cat it has never seen, it still says cat.

There is a distinction worth remembering here. The course first teaches very simple $h$, simple enough that you can prove they generalize; what has changed over the last decade or so is that people started training $h$ with enormous numbers of parameters. This lecture deals with the first kind.

### Regression and classification

Last come two terms:

- When $y$ is continuous (a real number, a price), the problem is a **regression** problem
- When $y$ is discrete, the problem is a **classification** problem

Today covers only regression, because the derivatives are easier to compute. The lecturer adds that in practice people now solve more classification problems; the last layer of a language model, for example, is a classifier that guesses the next word. Classification is left for the next lecture.

## The housing data and the linear hypothesis (recording 10:40–23:50)

### One feature: a straight line

The data used in the lecture is the Ames Housing Dataset. The lecturer loads it into a Python data frame and draws a scatter plot of lot area against sale price. He makes a point of the plotting itself:

> "if you have the ability to do it, look at your data. I can't stress that enough." (11:19)

Next comes the choice of a form for the hypothesis. The most common choice is linear:

$$
h_\theta(x) = \theta_0 + \theta_1 x
$$

Strictly speaking this is an affine function, because of the constant term $\theta_0$; by habit it is still called linear. Its value at $x=0$ is $\theta_0$ and its value at $x=1$ is $\theta_0 + \theta_1$, so $\theta_0$ is the intercept and $\theta_1$ is the slope.

This step does more than it appears to. The candidates for $h$ used to be all functions from the reals to the reals, and now only the straight lines determined by two numbers are left. This is **parameterization**: however many houses you see, the only things to learn are $\theta_0$ and $\theta_1$.

Which line is good? Feed in an $x$ and the prediction lands on the line; the vertical gap between the line and the true $y$ of that training example is the error for that example. We want these errors to be small overall. The formal name for this approach is empirical risk minimization (ERM). The lecturer says there is no need to memorize the name, but that he will say ERM without thinking later on.

He also mentions another way to predict in passing: use only the training set, find the neighbors near $x$, and average them (nearest neighbors). The advantage of a line is that it is defined for every $x$ and varies smoothly, so it captures the main trend in the data.

No line passes perfectly through all the points, for two reasons. First, the model leaves things out: house prices obviously depend on more than lot size. Second, even after adding every feature that belongs there, some error usually remains. The course later spends a lot of time on the relationship between error on the training set and error in the real world (on the test set).

### Multiple features and the x₀ = 1 convention

With more features, the hypothesis becomes

$$
h_\theta(x) = \theta_0 + \theta_1 x_1 + \theta_2 x_2 + \theta_3 x_3
$$

The lecture's example has three features, so it has four weights. This hypothesis class is "richer" than the one with a single feature: set the extra weights to 0 and you are back to the original line, so it can fit at least as well.

So that $\theta_0$ is not a special case every time, the whole course adopts a convention: **always assume $x_0 = 1$**. Then

$$
h_\theta(x) = \sum_{j=0}^{d} \theta_j x_j = \theta^T x
$$

The lecturer says this is also one reason we call it "linear" and not "affine". Written with vectors, $\theta$ and every $x^{(i)}$ are vectors in $\mathbb{R}^{4}$. The first example he reads out is $x^{(1)} = (1,\ 2104,\ 4,\ 45)$: the leading 1 is $x_0$, and the other three correspond to the three features he listed earlier, the size of the house, the number of bedrooms, and the lot area. The lot is written as 45 and not 45,000, and the lecturer points out that this normalization is itself a modeling decision.

The notation is summarized below and applies to every later lecture:

| Notation | Meaning |
|---|---|
| $n$ | Number of training examples |
| $d$ | Number of features (the dimension); with $x_0$ added, the vector has $d+1$ dimensions |
| $x^{(i)}$, $y^{(i)}$ | The input and label of the $i$-th training example |
| $x_j^{(i)}$ | The $j$-th feature of the $i$-th example |
| $\theta$ | The parameters, also called the weights |

Which features to include is, for now, decided by a person: you write code that turns the raw data into numbers. The lecturer previews another idea coming in a few weeks, which is to let the model learn the features from the data.

With two features you can still draw a picture: $h$ is a plane in three-dimensional space, and the error is the vertical distance from a data point to the plane. Beyond that it can no longer be drawn, which is exactly why vector notation is needed.

## The least-squares cost function (recording 23:50–33:55)

### Definition

We want to choose $\theta$ so that $h_\theta(x^{(i)}) \approx y^{(i)}$. Turning "close" into a number gives the cost function:

$$
J(\theta) = \frac{1}{2} \sum_{i=1}^{n} \left( h_\theta(x^{(i)}) - y^{(i)} \right)^2
$$

Inside the parentheses is the prediction error on the $i$-th example. Squared, it is always nonnegative, and it is 0 exactly when the prediction is right. Then pick the parameters that minimize $J$:

$$
\theta^\star = \arg\min_\theta J(\theta)
$$

$\arg\min$ returns the $\theta$ that makes the function smallest, not the smallest value itself. This is the method of least squares.

### Three questions from the class

The substance of this part is in the students' questions, and the three of them happen to be the ones a self-learner would ask too.

**Why the square? Could it be another power?** It could, and the absolute value works too. The reason the lecturer gives is computational: the gradient of the square has an especially clean form, clean enough that you can solve for the answer directly. He mentions in passing that historically Gauss also used least squares because it was easy to compute. He also previews that the next lecture will derive how least squares corresponds to the statistical assumption that the errors are approximately normally distributed.

**What is the $\frac{1}{2}$ in front for?** Pure convention. $\arg\min$ is insensitive to constant multiples: multiply $J$ by any positive number and the location of the minimum does not move. The $\frac{1}{2}$ is there to cancel the 2 that comes down from the square when you differentiate. As the lecturer puts it:

> "It's kind of like the cooking show view of math, where we set it up so that it looks nice." (27:46)

**Is $\theta$ continuous or discrete?** Continuous, so this is continuous optimization. Discrete optimization (integer linear programming, for example) is usually hard. The lecturer adds that even models that handle discrete data such as text almost always have a continuous parameter space underneath, which is what makes it possible to compute gradients.

Another student asks whether squaring penalizes large errors more heavily. The lecturer answers that how much one error costs is exactly what the cost function decides; the square was chosen here, and another form would also work. He does not want to make too much of it. In his words, with enough data the form of the cost function matters less than you might think; the other form really worth knowing is the softmax, which he says he will teach when he gets to classification.

### A doubt worth having

Wrapping up this part, the lecturer names the belief behind the whole approach: if we fit well on the training set, we trust that we will do well in the real world. He calls it a leap of faith, and also the bedrock of statistical estimation, and previews that he will later spend a whole lecture on how it goes wrong, including examples from his own research where the training data and the test setting do not match. This is the lecture's **first statistical assumption**: the training set reflects the real world.

## Gradient descent (recording 33:55–42:15)

### The picture and the update rule

Picture a bowl-shaped quadratic function. Draw a tangent line at the starting point $\theta^{(0)}$. It is the best linear approximation of the function at that point, which is the first-order Taylor expansion:

$$
f(\theta) \approx f(\theta^{(0)}) + f'(\theta^{(0)})\,(\theta - \theta^{(0)})
$$

The derivative (the gradient, with several variables) points in the direction in which the function increases fastest, so to make the function smaller you move the opposite way. For each parameter component $j$:

$$
\theta_j^{(t+1)} = \theta_j^{(t)} - \alpha \frac{\partial}{\partial \theta_j} J(\theta^{(t)})
$$

$\alpha$ is the step size, also called the learning rate; the lecturer says he will use the two interchangeably. $J$ has many variables, so this is a partial derivative, and every step updates all $j$ simultaneously.

Keep the two kinds of superscript apart: the $(i)$ in $x^{(i)}$ is the index of an example, and the $(t)$ in $\theta^{(t)}$ is the index of an update. Subscripts are components: $\theta_0$ is the intercept parameter, while $\theta^{(0)}$ is the starting point of the whole parameter vector.

To see why moving the opposite way goes downhill, substitute into the Taylor expansion (this short argument is an addition in this article; the lecture only drew the picture). Let $\theta = \theta^{(0)} - \alpha f'(\theta^{(0)})$. Then

$$
f(\theta) \approx f(\theta^{(0)}) - \alpha \left( f'(\theta^{(0)}) \right)^2
$$

The squared term is nonnegative, so as long as $\alpha$ is small enough for the linear approximation to stay accurate, the function value goes down. When $\alpha$ is too large the approximation breaks down, and the guarantee goes with it.

The starting point can be 0 or random. The lecturer notes that the starting point makes no difference for least squares but does for modern models. The reason is convexity: a bowl-shaped (convex) function has a single valley floor, and you get there from anywhere; a non-convex function has many local low points, and going downhill may leave you stuck in one of them.

### Working out the partial derivative

Now substitute $J$. Start with the term for a single example and apply the chain rule:

$$
\frac{\partial}{\partial \theta_j} \frac{1}{2}\left(h_\theta(x) - y\right)^2
= 2 \cdot \frac{1}{2}\left(h_\theta(x) - y\right) \cdot \frac{\partial}{\partial \theta_j}\left(h_\theta(x) - y\right)
$$

The 2 and the $\frac{1}{2}$ cancel, which is what the $\frac{1}{2}$ was for. In the remaining partial derivative, $y$ does not contain $\theta$, and differentiating $h_\theta(x) = \sum_k \theta_k x_k$ with respect to $\theta_j$ leaves only $x_j$. So

$$
\frac{\partial}{\partial \theta_j} \frac{1}{2}\left(h_\theta(x) - y\right)^2 = \left(h_\theta(x) - y\right) x_j
$$

Differentiation passes through the sum, so adding up over the $n$ examples gives:

$$
\frac{\partial}{\partial \theta_j} J(\theta) = \sum_{i=1}^{n} \left(h_\theta(x^{(i)}) - y^{(i)}\right) x_j^{(i)}
$$

The lecturer wants everyone to remember this shape: **an error times something**. In a linear model that something is the feature $x_j$; a nonlinear model brings in other factors, but the "error × gradient" structure keeps coming back.

Stack all the components into a vector and the update rule is

$$
\theta^{(t+1)} = \theta^{(t)} - \alpha \sum_{i=1}^{n} \left(h_{\theta^{(t)}}(x^{(i)}) - y^{(i)}\right) x^{(i)}
$$

The lecturer describes this as just "erasing all the $j$". Every step uses all $n$ examples, hence the name batch gradient descent. The notes write the same rule as $\theta := \theta + \alpha \sum (y^{(i)} - h_\theta(x^{(i)}))\,x^{(i)}$, which only moves the minus sign inside the parentheses.

### Setting the step size

The step size expresses how much you trust the gradient you have. A bowl-shaped function is usually steep far from the optimum, so you can take big steps there; machine learning often faces functions whose shape is unknown, so it leans toward small step sizes.

- Too small: you keep heading the right way, but it takes a long time to arrive
- Too large: one step overshoots the minimum, and you bounce back and forth between the sides of the bowl

The homework includes an exercise on tuning the step size: if convergence is slow, try another value.

### How statistics and machine learning differ on "how accurately to solve"

Here the lecturer digresses to state a position. Statistics cares about recovering the parameters (a recovery guarantee) and has rigorous tests for convergence. Machine learning does not care about that: there may be many $\theta$ that predict well enough, and close is good enough. As for when to stop:

> "In AI we're like, we ran out of compute credits. We'll stop." (40:54)

His summary is that machine learning prefers to push more data through bigger models, and estimating the parameters to ten significant digits is not the goal.

## Minibatch stochastic gradient descent (recording 42:15–1:10:40)

### Motivation and the update rule

Batch gradient descent sweeps the entire training set for every single update. If the training set is all the text on the internet, that is too slow to use. The fix is an even simpler algorithm: take only a small batch of data on each step.

At step $t$, randomly pick a subset $B$ (a minibatch) and compute the gradient on that batch alone:

$$
\theta^{(t+1)} = \theta^{(t)} - \alpha_B \sum_{i \in B} \left(h_{\theta^{(t)}}(x^{(i)}) - y^{(i)}\right) x^{(i)}
$$

Only two things change from the batch version: the sum runs over $B$ and no longer over all $n$ examples, and the step size is written $\alpha_B$ as a reminder that it usually differs from the value used with the full data. A student asks where the $\frac{1}{|B|}$ for averaging went. The lecturer answers that it is folded into $\alpha_B$, which is a number you have to tune anyway. Another student points out that the slide does not make clear which $\theta$ appears in $h_\theta$; the lecturer confirms that it is $\theta^{(t)}$ from the previous step and says it is a typo on the slide.

A new batch has to be drawn on every step. You cannot keep feeding the same batch, or all the model learns is that batch.

The algorithm is called stochastic gradient descent (SGD) or minibatch SGD, and early on it was also called incremental gradient. The lecturer says it goes back at least to Robbins and Monro in the 1950s, and that it gets rediscovered every decade or so. Anyone who has run backpropagation in PyTorch has used it; the whole system is designed around minibatches.

### How to sample: the second statistical assumption

The lecturer poses a question: what happens if you feed all the cat photos first, batch by batch, and then all the dog photos? The students get it right: the model first learns to call everything a cat, and after seeing the dogs it swings all the way to the other side.

So each batch should look like a miniature of the data as a whole. This is the lecture's **second statistical assumption**: the minibatch reflects the whole training set (the first was that the training set reflects the real world).

In practice there are two ways to draw batches:

- **Sampling with replacement**: draw independently at random on every step. This is textbook SGD
- **Sampling without replacement**: shuffle the data randomly once, then walk through it in order, one batch at a time

The lecturer says both theory and experiments increasingly show little difference between the two, and that sampling without replacement is far easier to implement. He also mentions an observed phenomenon: random reshuffling often converges faster. He gives the intuition with the coupon collector problem. To collect all 10 kinds of coupon by taking one at random each time, most of the time goes into waiting for the last kind, because nine draws in ten give you one you already have. Sampling with replacement behaves the same way: rare examples in the data take a long time to come up, and common ones are seen too many times; one pass over shuffled data guarantees that every example is seen exactly once. He attaches a caveat: the claim can be proved under some conditions, but there are clear counterexamples.

### How large the batch should be

A student asks whether there is a scientific way to choose the batch size. The lecturer's answer comes in two parts, history and the present.

About fifteen years ago, the mainstream view was that smaller batches were better. The argument for it was redundancy in the data: if 90 of the images in a batch are the same cat, the whole batch supplies the information of one photo yet produces only one update; split up, it could produce 90 updates. On problems with few, well-separated classes, this argument can be proved.

Later a friend sent him a preprint in which larger batches gave a worse training loss and yet generalized better. That contradicts the intuition that doing well on the training set means doing well on the test set. The lecturer says it changed how he understands the relationship between optimization and generalization, and that it shows the role of batch size is still not fully understood.

The current convention favors larger batches, because they have lower variance and are a better estimate of the gradient. How is it set in practice?

> "Set the batch size according to what you can do." (51:11)

That is, by how much fits in GPU memory. The computation is very much faster when all of it fits in memory on the chip, so this is a systems decision. In addition, some loss functions want positive and negative examples in the same batch, preferably ones that are close to each other and easy to confuse, and then the composition of a batch is designed on purpose.

The lecturer also gives a sense of proportion: tuning the batch size or the step size often matters far less than making the model bigger or training it longer.

> "sometimes tweaking the batch size or tweaking these rates doesn't matter nearly as much as making your model get bigger or running it for longer." (1:04:25)

He says outright that this whole stretch is supplementary, and that for this course it is enough to know "draw a random batch".

### The step size and the batch

The step size usually has to be chosen by hand. The lecturer mentions that the adaptive optimizers in common use today (he names Adam, AdamW, and AdaGrad) adjust it for you within some range, but in the plainest setting $\alpha_B$ is supplied manually. A student reasons that since $\frac{1}{|B|}$ is folded into the step size, a larger batch should usually mean a smaller step size; the lecturer says that is indeed what you would expect intuitively. Another student asks whether these settings can change during training. The lecturer says yes, such methods are called schedules, but most researchers fill in the defaults and start the run.

### What the trajectory looks like, and when to stop

A slide compares the trajectories of the two algorithms on a smooth quadratic function. The ellipses in the figure are contour lines, with the same loss everywhere on one ring; the contours of a quadratic are ellipses. Batch gradient descent moves smoothly all the way to the center. SGD zigzags, sometimes in the right direction and sometimes in the wrong one, and ends up bouncing inside a ball-shaped region around the optimum. If $\alpha$ is set too large, that region is large and you never get close. If you see the loss start jumping up and down during training, suspect a step size that is too large. One remedy is to average the values of $\theta$ along the bouncing path (averaging the iterates).

A student asks how you know when to stop while bouncing around near the optimum. The lecturer's answer: in general, you don't. The models taught in the next two weeks (generalized linear models) are all convex, and in that case you can compute how far you are from the optimum; he recommends Stephen Boyd's course to anyone who wants to go deeper. With neural networks no such tool exists, and what people actually do is watch the loss curve until it has come down far enough, or until the compute runs out.

## Normal equations: solving for θ directly (recording 1:10:40–1:17:40)

What is special about least squares is that it can be solved directly, with no iteration. The lecturer says the main purpose of this part is to get everyone comfortable with matrix notation.

### Stacking the data into a matrix

Stack each example's feature vector as a row to get the **design matrix**:

$$
X = \begin{bmatrix} (x^{(1)})^T \\ (x^{(2)})^T \\ \vdots \\ (x^{(n)})^T \end{bmatrix} \in \mathbb{R}^{n \times (d+1)}, \qquad
y = \begin{bmatrix} y^{(1)} \\ y^{(2)} \\ \vdots \\ y^{(n)} \end{bmatrix} \in \mathbb{R}^{n}
$$

The $i$-th component of $X\theta$ is $(x^{(i)})^T\theta = h_\theta(x^{(i)})$, so $X\theta - y$ is the $n$ errors arranged as a vector. The inner product of a vector with itself equals the sum of the squares of its components, and therefore

$$
J(\theta) = \frac{1}{2}(X\theta - y)^T(X\theta - y)
$$

The lecturer says that if this step is not obvious at a glance, you should expand the inner product by hand once.

### Taking the gradient with respect to θ

Taking a gradient with respect to a vector means computing the partial derivative for each component and arranging the results in a vector of the same shape. First multiply $J$ out:

$$
J(\theta) = \frac{1}{2}\left( \theta^T X^T X \theta - \theta^T X^T y - y^T X \theta + y^T y \right)
$$

The two middle terms are scalars, and a scalar equals its own transpose, so $\theta^T X^T y = y^T X\theta$ and they can be combined:

$$
J(\theta) = \frac{1}{2}\theta^T X^T X \theta - (X^T y)^T \theta + \frac{1}{2} y^T y
$$

Differentiating term by term takes two facts. The lecture uses them directly, and the notes cite the linear algebra review notes as the source; the component-wise checks below are an addition in this article.

First, $\nabla_\theta\, b^T\theta = b$. Since $b^T\theta = \sum_k b_k\theta_k$, differentiating with respect to $\theta_j$ leaves only $b_j$.

Second, when $A$ is symmetric, $\nabla_\theta\, \theta^T A\theta = 2A\theta$. Since $\theta^T A\theta = \sum_k\sum_l \theta_k A_{kl}\theta_l$, $\theta_j$ appears in two positions, $k=j$ and $l=j$, and differentiating gives $\sum_l A_{jl}\theta_l + \sum_k \theta_k A_{kj}$; $A$ is symmetric, so the two terms are equal and together they are $2(A\theta)_j$.

$X^TX$ is a symmetric matrix (it is its own transpose), so:

- The gradient of the first term is $\frac{1}{2}\cdot 2X^TX\theta = X^TX\theta$. The lecturer's way of saying it is that it shows up once on each side, but it is symmetric, and then there is the $\frac{1}{2}$
- The gradient of the second term is $-X^Ty$
- The third term does not contain $\theta$, so its gradient is 0

Putting them together:

$$
\nabla_\theta J(\theta) = X^T X\theta - X^T y
$$

This is the same result as in the previous section: the $j$-th component of $X^T(X\theta - y)$ is exactly $\sum_i (h_\theta(x^{(i)}) - y^{(i)})\,x_j^{(i)}$.

### Setting the gradient to zero

$J$ is a bowl-shaped convex function, and its lowest point is where the gradient is zero, for the same reason you set the derivative to zero to find an extremum of a one-dimensional function. So

$$
X^T X\theta = X^T y
$$

This system is called the normal equations. Multiply both sides on the left by $(X^TX)^{-1}$:

$$
\theta^\star = (X^T X)^{-1} X^T y
$$

### The smuggled assumption: XᵀX is invertible

The lecturer asks the class where he cheated, and the students find it: the last step assumes $X^TX$ is invertible. When there are far more examples than parameters, you can usually expect the inverse to exist; conversely, with little data and high dimension it does not.

What happens when it is not invertible? $X^TX$ then has a nonzero null space, and

> "So anything in the null space of XTX, I can add that to theta. And it doesn't change the answer at all." (1:15:36)

The solution goes from a single $\theta^\star$ to a whole subspace. The statement can be checked as follows (an addition in this article): if $X^TXv = 0$, then $v^TX^TXv = \|Xv\|^2 = 0$, so $Xv = 0$. Then $X(\theta + v) = X\theta$, no prediction changes, and so $J$ does not change either.

At the end the lecturer mentions that $X^TX$ is a positive semidefinite (PSD) matrix, without elaborating. The same expression shows it (an addition in this article): for any vector $z$, $z^TX^TXz = \|Xz\|^2 \ge 0$. This is also why $J$ is bowl-shaped, because differentiating $\nabla_\theta J = X^TX\theta - X^Ty$ once more with respect to $\theta$ gives the matrix of second derivatives (the Hessian), which is $X^TX$; it is positive semidefinite, so $J$ does not curve downward in any direction.

## Working through the whole lecture with three data points

**What follows is an example made up for this article, not from the lecture.** The lecture did no numerical computation, so here the smallest possible dataset is used to run each of the four formulas once.

Three examples, one feature, units unimportant:

| $i$ | $x^{(i)}$ | $y^{(i)}$ |
|---|---|---|
| 1 | 1 | 2 |
| 2 | 2 | 3 |
| 3 | 3 | 5 |

With $x_0 = 1$ added:

$$
X = \begin{bmatrix} 1 & 1 \\ 1 & 2 \\ 1 & 3 \end{bmatrix}, \quad y = \begin{bmatrix} 2 \\ 3 \\ 5 \end{bmatrix}
$$

### Normal equations

$$
X^TX = \begin{bmatrix} 3 & 6 \\ 6 & 14 \end{bmatrix}, \quad X^Ty = \begin{bmatrix} 2+3+5 \\ 2+6+15 \end{bmatrix} = \begin{bmatrix} 10 \\ 23 \end{bmatrix}
$$

The determinant is $3 \times 14 - 6 \times 6 = 6$, which is nonzero, so the matrix is invertible:

$$
(X^TX)^{-1} = \frac{1}{6}\begin{bmatrix} 14 & -6 \\ -6 & 3 \end{bmatrix}, \quad
\theta^\star = \frac{1}{6}\begin{bmatrix} 140 - 138 \\ -60 + 69 \end{bmatrix} = \begin{bmatrix} 1/3 \\ 3/2 \end{bmatrix}
$$

The best line is $h(x) = \frac{1}{3} + \frac{3}{2}x$. The three predictions are 1.833, 3.333, and 4.833, and the errors $h - y$ are $-\frac{1}{6}$, $\frac{1}{3}$, and $-\frac{1}{6}$, so

$$
J(\theta^\star) = \frac{1}{2}\left(\frac{1}{36} + \frac{1}{9} + \frac{1}{36}\right) = \frac{1}{12} \approx 0.0833
$$

The minimum of $J$ is not 0, because the three points are not collinear. This is what the lecture meant by no line being perfect.

### Batch gradient descent

Start from $\theta^{(0)} = (0, 0)$ and take $\alpha = 0.05$.

At the start every prediction is 0, the errors are $(-2, -3, -5)$, and $J = \frac{1}{2}(4 + 9 + 25) = 19$. The two components of the gradient:

- $j=0$ (every $x_0$ is 1): $-2 - 3 - 5 = -10$
- $j=1$: $(-2)(1) + (-3)(2) + (-5)(3) = -23$

The update: $\theta^{(1)} = (0, 0) - 0.05 \times (-10, -23) = (0.5,\ 1.15)$.

Second step: the predictions are 1.65, 2.8, and 3.95, the errors are $(-0.35, -0.2, -1.05)$, and $J = 0.6325$. The gradient is $(-1.6,\ -3.9)$, so $\theta^{(2)} = (0.58,\ 1.345)$, at which point $J = 0.1134$.

Within two steps $J$ drops from 19 to 0.6325 and then to 0.1134, already close to the lower bound of 0.0833. But the parameters themselves are still some way from $(0.333, 1.5)$, and with the same step size it takes until step 77 for $J$ to come within 0.001 of the lower bound. The lecture said that far from the optimum the slope is steep and you can take big steps; what shows here is the other side of that: once you are close the gradient shrinks, and the progress made by each step shrinks with it.

### A step size that is too large

From the same starting point, use $\alpha = 0.2$: $\theta^{(1)} = (2,\ 4.6)$, the predictions become 6.6, 11.2, and 15.8, and $J = 102.52$; one more step gives $J = 555.13$. Every step jumps over the valley floor and lands higher up on the opposite side, which is the "too large" case from the lecture. For this dataset the upper limit on the step size is about 0.12. This bound is an addition in this article and was not given in the lecture: decompose $\theta - \theta^\star$ along the eigenvectors of $X^TX$; the component with eigenvalue $\lambda$ is multiplied by $(1 - \alpha\lambda)$ on every step, and for it to shrink you need $|1 - \alpha\lambda| < 1$, that is, $\alpha < 2/\lambda$. The tightest constraint comes from the largest eigenvalue, 16.64, so $\alpha < 2/16.64 \approx 0.12$.

### One step of SGD

Take a batch size of 1 and $\alpha_B = 0.05$, again starting from $(0, 0)$. The result depends heavily on which example is drawn:

| Example drawn | Single-example gradient | $\theta$ after the update | $J$ after the update |
|---|---|---|---|
| Example 1 | $(-2, -2)$ | $(0.1,\ 0.1)$ | 15.845 |
| Example 2 | $(-3, -6)$ | $(0.15,\ 0.3)$ | 11.534 |
| Example 3 | $(-5, -15)$ | $(0.25,\ 0.75)$ | 4.406 |

Each step uses only a third of the computation, and in all three cases $J$ comes down from 19, but the direction and the size of the move differ every time.

Now look at what happens at the optimum $\theta^\star = (\frac{1}{3}, \frac{3}{2})$. The gradient over the full data is zero, but the single-example gradients are $(-\frac{1}{6}, -\frac{1}{6})$, $(\frac{1}{3}, \frac{2}{3})$, and $(-\frac{1}{6}, -\frac{1}{2})$. The three sum to zero, and none of them is zero on its own. So even if you happen to be standing exactly on the optimum, the next SGD step still pushes you away. This is why SGD with a fixed step size bounces around near the optimum and does not come to rest, and the distance it pushes you is proportional to $\alpha_B$.

## Self-check

**1. Continuing the example above, take one more step of batch gradient descent from $\theta^{(2)} = (0.58,\ 1.345)$ (with $\alpha = 0.05$). What is $\theta^{(3)}$?**

Answer: the errors are $(-0.075,\ 0.27,\ -0.385)$ and the gradient is $(-0.19,\ -0.69)$, so $\theta^{(3)} = (0.5895,\ 1.3795)$. You have this down only if you can compute both components of the gradient (one is the errors added up directly, the other is the errors multiplied by $x$ and then added up).

**2. Replace the $\frac{1}{2}$ in front of the cost function with 25. Does $\theta^\star$ change? Does the behavior of gradient descent change?**

Answer: $\theta^\star$ does not change, since a positive multiple does not move the location of the minimum. But the gradient becomes 50 times as large, so the same $\alpha$ takes steps 50 times as large, and a step size that used to converge may now diverge. Constants get absorbed into the step size, which is the same point as the lecture's remark that $\frac{1}{|B|}$ is folded into $\alpha_B$.

**3. Add one more feature, $x_2 = 2x_1$, to the example above (say, the same area in a different unit). Is $X^TX$ still invertible? Write down two different $\theta$ that give exactly the same predictions.**

Answer: it is not invertible, because the third column of $X$ is twice the second, and $v = (0, 2, -1)$ satisfies $Xv = 0$. $(\frac{1}{3}, \frac{3}{2}, 0)$ and $(\frac{1}{3}, \frac{7}{2}, -1)$ give the same predictions, and they differ by exactly $v$. You understand this only if you can name a direction in the null space.

**4. You are standing at $\theta^\star = (\frac{1}{3}, \frac{3}{2})$ and take one SGD step with batch size 1 and $\alpha_B = 0.05$, drawing example 3. Where does $\theta$ go? Does $J$ go up or down?**

Answer: the single-example gradient is $(-\frac{1}{6}, -\frac{1}{2})$, $\theta$ becomes roughly $(0.3417,\ 1.525)$, and $J$ rises from 0.0833 to about 0.0891. At the optimum, any move makes $J$ larger.

**5. Sort the training data by label and cut it into minibatches in order, without shuffling. Which assumption from the lecture does that violate, and what would you see?**

Answer: it violates the second statistical assumption, since a batch is no longer a miniature of the data as a whole. The model first leans toward the labels in the early part of the data, then swings back hard when it reaches the later part.

## Corresponding reading

Chapter 1 of the main lecture notes, "Linear regression", pages 9–16:

- **Chapter opening (pages 9–10)**: the linear hypothesis, the $x_0 = 1$ convention, and the cost function $J(\theta)$. The definitions of the supervised learning terms are in the Part I introduction that precedes Chapter 1 (pages 7–8)
- **1.1 LMS algorithm (pages 10–14)**: gradient descent, the derivation of the partial derivative for a single example, batch gradient descent, and stochastic gradient descent
- **1.2 The normal equations (pages 14–16)**: the definition of matrix derivatives, the design matrix, the derivation of $\nabla_\theta J$, and the closed-form solution

Where the lecture and the notes differ:

- **Dataset**: the notes use 47 houses from Portland, and the lecture uses the Ames Housing Dataset. The notes report parameter values from an actual run (with area alone, $\theta_0 = 71.27$ and $\theta_1 = 0.1345$); the lecture reports no numbers
- **The definition of SGD**: stochastic gradient descent in Chapter 1 of the notes looks at one example at a time and walks through the training set in order (equation 1.2), and the word minibatch does not appear in that chapter. The lecture teaches the version that draws a batch $B$ at a time, with its own step size $\alpha_B$. How to sample, the batch-size trade-offs, and when to stop all appear only in the lecture
- **Terminology**: the notes call the single-example update rule the LMS (least mean squares) rule or the Widrow-Hoff rule, and the lecture uses neither name. Chapter 1 of the notes says only learning rate, while the lecture uses step size and learning rate interchangeably
- **Whether SGD converges**: a footnote in the notes mentions that slowly letting $\alpha$ decrease to zero can guarantee convergence to the minimum; the lecture instead mentions averaging the values of $\theta$ along the way
- **$X^TX$ not invertible**: the notes say only, in a footnote, that other techniques can handle this and skip it; the lecture uses the null space to explain that the solution is then a whole subspace

The lecture did not get to the last two sections of Chapter 1. The probabilistic interpretation in 1.3 is left for the [next lecture](/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression-en), and the lecturer previews it twice in class; the locally weighted linear regression in 1.4 is not mentioned at all in this lecture.

## Course video sources

Original video: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 2: Supervised Learning Setup](https://www.youtube.com/watch?v=cmNIMjPYdgM)

- [Stanford CS229 Machine Learning | Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 course website](https://cs229.stanford.edu/)
- [CS229 main lecture notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

Checked: 2026-10-12.

Content check: verified against the video transcript (2026-10-12): the whole article is written from the roughly 78-minute English transcript of this video, and the quotations and timestamps are taken from the transcript; the slides and the handwriting on screen were not viewed, and the formulas are reconstructed from what the lecturer says aloud, checked against Chapter 1 of the main lecture notes. The lecturer does not give his own name in the transcript. This article identifies him as Chris Ré because he refers to Tengyu in the third person and says the two of them alternate lectures.

## References

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 2: Supervised Learning Setup (YouTube)](https://www.youtube.com/watch?v=cmNIMjPYdgM): the main source for this article; the lecture's claims, the quotations, and the time ranges all come from its English transcript
- [CS229 main lecture notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf): Chapter 1 (pages 9–16) and the Part I introduction (pages 7–8), used to check the formula notation, the definition of the design matrix, and the page numbers in "Corresponding reading"
- [Stanford CS229 Machine Learning | Spring 2026 playlist](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw): to confirm this video's lecture number within the series
- [Reading Stanford CS229: Course Overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): the entry point to the series
