---
title: "Maximum Likelihood and Logistic Regression: Why Least Squares Is a Reasonable Choice | Stanford CS229 Lecture 3"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, maximum-likelihood, logistic-regression, newtons-method]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 3
tldr: "Assume the errors are zero-mean, IID Gaussian noise, take the log of the likelihood, and maximum likelihood turns out to be last lecture's least squares. Run the same recipe with 0/1 labels and a sigmoid and you get logistic regression, whose gradient is still \"error times input\". The lecture closes by comparing Newton's method with SGD: far fewer steps, but each step costs n·d² + d³."
description: "A guide to Lecture 3 of Stanford CS229 Spring 2026: the probabilistic interpretation of linear regression, maximum likelihood estimation, the likelihood and gradient derivation for logistic regression, and Newton's method and the Hessian, with four worked numerical examples that were checked independently."
draft: false
math: true
---

> 🌏 [中文版](/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression)

**Video status: Videos included.** This article is written from the English captions of the Spring 2026 Lecture 3 recording published by Stanford Online, with notation matched to Section 1.3 of Chapter 1 and Chapter 2 of the 2026 main notes. I did not see the board work or the slides, so the way formulas are written follows the notes.

The [previous lecture](/posts/ai/2026-10-12-stanford-cs229-lecture-02-supervised-learning-linear-regression-en) wrote linear regression as "minimize the sum of squared errors" without saying why squares. Chris Ré teaches this lecture and fills in the reason first: assume the errors are zero-mean, independent and identically distributed Gaussian noise, and least squares is the maximum likelihood estimate. He then carries the same recipe over to classification to derive logistic regression, and ends with a short introduction to Newton's method. For where this sits in the whole course, see the [course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en).

The prerequisites are $J(\theta)$ and gradient descent from the previous lecture, the density of the normal distribution, logarithms, and partial derivatives. After reading, you should be able to derive least squares from probabilistic assumptions on your own, write down the log-likelihood and gradient of logistic regression, and explain why Newton's method takes so few steps yet never became the workhorse of machine learning.

One confusing thing up front: the YouTube title of this video is "Weighted Least Squares", but the lecture never covers weighted least squares, and it does not cover the locally weighted linear regression of Section 1.4 of the notes either. The actual content is the four parts below.

```youtube
url: https://www.youtube.com/watch?v=uJF_gL3jhxI
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 3: Weighted Least Squares
captions: en
```

## The thread of this lecture: a recipe you will reuse for weeks

(Recording 00:05–03:05)

Ré opens by saying that what you should take away from this lecture is a framework called maximum likelihood. It has three steps:

1. Write a probabilistic model that describes how you think the data was generated. He calls this the forward model.
2. Write "how likely does this set of parameters make the observed data" as a function, take the log, and get a sum.
3. Maximize it with the gradient methods from the previous lecture.

Linear regression and logistic regression are just two instances of this recipe, and next lecture's generalized linear models are a third. He also says in passing where logistic regression stands (01:05):

> "logistic regression is the last layer of every model that you've probably interacted with."

He means that the last layer of today's text and code models computes a softmax, which is the multi-class version of logistic regression.

## The probabilistic interpretation of linear regression: where the error comes from

(Recording 03:05–23:35)

### How the data is generated

The setup from the previous lecture is unchanged: each input is $x^{(i)} \in \mathbb{R}^{d+1}$ (the extra dimension is fixed at 1 to absorb the intercept), each label is $y^{(i)} \in \mathbb{R}$, and we are looking for

$$
\theta = \arg\min_\theta \frac{1}{2}\sum_{i=1}^{n}\left(y^{(i)} - \theta^\top x^{(i)}\right)^2
$$

This lecture adds one assumption: there is a true $\theta$ out in the world that we cannot see, and each label is its prediction plus an error term.

$$
y^{(i)} = \theta^\top x^{(i)} + \epsilon^{(i)}
$$

We cannot see $\epsilon^{(i)}$ either. Ré offers two ways to think about it (06:06). One is literal measurement noise, such as a jittery instrument. The other, which he prefers, is that the error is "the part we decided not to model". You may actually know some of the sources of error and simply not want a model that detailed, so you sweep them all into $\epsilon$. That is why asking whether a model is "true" is meaningless, and he quotes the line every statistics course quotes:

> "All models are wrong. Some models are useful."

### Three assumptions about the error

Ré states three assumptions out loud; the formulas below are my reconstruction from his description (08:09–10:16):

**Zero mean.** $\mathbb{E}[\epsilon^{(i)}] = 0$: the error has no systematic bias. If it did, the data would hide a fixed offset we do not know about, and regression could not recover the true $\theta$. This assumption is close to unavoidable.

**Independent and identically distributed (IID).** The errors are independent of one another and come from the same distribution. Independence means expectations factor: for $i \neq j$, $\mathbb{E}[\epsilon^{(i)}\epsilon^{(j)}] = \mathbb{E}[\epsilon^{(i)}]\,\mathbb{E}[\epsilon^{(j)}]$. That equation is only one consequence of independence. Full independence says the joint probability factors into the product of the individual probabilities, and that is the version used later when we write the likelihood. Ré says plainly that this is a strong assumption, made mostly so the later calculation goes through. His counterexample is data from two measurement stations, A and B, whose errors have different variances; pool the two and this model simply ignores the difference.

**Only the variance.** $\mathbb{E}[(\epsilon^{(i)})^2] = \sigma^2$. Because the mean is zero, this quantity is the variance, and it describes how noisy the data is. Higher moments (third, fourth) are not modeled.

He then says this setup leads exactly to the Gaussian distribution (11:16), because a Gaussian is fully described by its mean and variance; he adds that a "better model" that tracks a few more moments does not exist. This passage is best read as a reason for choosing the model: if you intend to describe the noise with only a mean and a variance, the Gaussian is the family of distributions determined by exactly those two quantities.

The inference does not run the other way, a point the lecture does not separate out. Errors that are zero-mean, IID, and of fixed variance are not thereby Gaussian: a uniform distribution, or the Laplace distribution in self-check question 1, can be tuned to have zero mean and variance $\sigma^2$. So the derivation that follows needs one more assumption, which the notes write down directly: $\epsilon^{(i)} \sim \mathcal{N}(0, \sigma^2)$. From here on this article follows the notes and treats "the error is Gaussian" as a fourth assumption.

Ré's attitude toward this assumption is the part most worth remembering: do not ask whether the data "is" Gaussian; ask whether a Gaussian model is good enough for what you care about. It is a matter of degree. He also mentions the law of large numbers and the central limit theorem in passing (12:16) as reasons the Gaussian is often a decent starting point, without elaborating.

### What each piece of the Gaussian density does

$z \sim \mathcal{N}(\mu, \sigma^2)$ reads "$z$ follows a normal distribution with mean $\mu$ and variance $\sigma^2$", and its density is

$$
p(z) = \frac{1}{\sqrt{2\pi}\,\sigma}\exp\left(-\frac{(z-\mu)^2}{2\sigma^2}\right)
$$

Ré breaks it into three pieces (14:20–16:23):

- The $\frac{1}{\sqrt{2\pi}\sigma}$ in front is the normalizing constant, which makes the area under the curve equal 1. He calls it the least important part of the formula: it will drop out by itself once we take the log and maximize.
- The $(z-\mu)^2$ in the exponent is the squared distance to the mean. This is where squared error comes in.
- The $\sigma^2$ in the denominator converts distance into units of "how many standard deviations". When $\sigma$ is near 0 the curve is tall and narrow; when $\sigma$ is large it is flat and wide. Three standard deviations cover 99.7% of the probability.

A student asks whether a Gaussian can describe an asymmetric or multi-peaked distribution (17:27). A single Gaussian cannot: it is symmetric about its mean and has one peak. Several peaks call for the Gaussian mixture models taught later in the course.

### From the distribution of the error to the distribution of the label

Substitute $\epsilon^{(i)} = y^{(i)} - \theta^\top x^{(i)}$. Once $x^{(i)}$ is given, $\theta^\top x^{(i)}$ is a fixed number, and $y^{(i)}$ is just the Gaussian error shifted by that amount, so

$$
y^{(i)} \mid x^{(i)};\theta \sim \mathcal{N}\left(\theta^\top x^{(i)},\ \sigma^2\right)
$$

$$
p\left(y^{(i)} \mid x^{(i)};\theta\right) = \frac{1}{\sqrt{2\pi}\,\sigma}\exp\left(-\frac{\left(y^{(i)}-\theta^\top x^{(i)}\right)^2}{2\sigma^2}\right)
$$

Why does the variance carry over unchanged? Ré warns that this is not automatic (20:31): adding a constant only shifts a distribution and leaves its width alone; if the model multiplied $\epsilon$ by 10 instead, the variance would become 100 times larger and you would have to track that separately.

This formula uses two symbols that the rest of the course relies on:

- The bar $\mid$ means "conditioned on". $x^{(i)}$ is data we can see, and once we see it the mean of the distribution is pinned down.
- The semicolon $;$ means "parameterized by". $\theta$ is not a random variable and not an event you can condition on. Each $\theta$ corresponds to a different distribution, and our job is to pick one out of this whole family.

A student asks what to do with more than one set of parameters (23:33). The answer is to list them all after the semicolon, or bundle them into one symbol.

## Maximum likelihood: why we end up back at least squares

(Recording 23:35–34:30)

### The likelihood function

Fix a $\theta$ and you can compute the density of each data point under that model. Multiply the $n$ of them together and you get the likelihood:

$$
L(\theta) = \prod_{i=1}^{n} p\left(y^{(i)} \mid x^{(i)};\theta\right)
$$

Why a product? Ré turns the question back on the class and asks which assumption is being used here (24:36). The answer is IID. What we originally want to write is the joint probability of "all the $y$ values occurring together", a huge function involving all the data at once; the definition of independence is that the joint probability factors into the product of the individual ones.

$L(\theta)$ is a score assigned to each $\theta$. The higher the score, the better that $\theta$ explains the data in hand. The maximum likelihood principle is to pick the one with the highest score.

### Take the log to turn the product into a sum

Every factor is positive, so we can take the log. The log is strictly increasing, so the $\theta$ that maximizes $L$ also maximizes $\log L$. The benefit is that the product becomes a sum, which is also far more stable numerically. Write $\ell(\theta) = \log L(\theta)$ and expand step by step:

$$
\ell(\theta) = \sum_{i=1}^{n}\log\left[\frac{1}{\sqrt{2\pi}\,\sigma}\exp\left(-\frac{\left(y^{(i)}-\theta^\top x^{(i)}\right)^2}{2\sigma^2}\right)\right]
$$

The log splits the product into two added terms, and $\log\exp(a) = a$:

$$
\ell(\theta) = \sum_{i=1}^{n}\left[\log\frac{1}{\sqrt{2\pi}\,\sigma} - \frac{\left(y^{(i)}-\theta^\top x^{(i)}\right)^2}{2\sigma^2}\right]
$$

The first term does not depend on $i$, so it is added $n$ times; in the second, pull out $\frac{1}{\sigma^2}$:

$$
\ell(\theta) = n\log\frac{1}{\sqrt{2\pi}\,\sigma} - \frac{1}{\sigma^2}\cdot\underbrace{\frac{1}{2}\sum_{i=1}^{n}\left(y^{(i)}-\theta^\top x^{(i)}\right)^2}_{J(\theta)}
$$

The first term does not contain $\theta$. The second is last lecture's $J(\theta)$ times a positive constant, with a minus sign in front. So maximizing $\ell(\theta)$ is minimizing $J(\theta)$. Last lecture minimized error and this lecture maximizes likelihood; they differ by a sign and are the same thing.

One more conclusion is hidden in the formula: $\sigma^2$ affects only the constant term and the multiplier in front of $J$, not which $\theta$ is best. You can solve for $\theta$ without knowing $\sigma^2$.

### Numerical example 1: comparing the likelihood of two values of θ

The following is an example made up for this article, not from the lecture. Use a one-parameter model with no intercept, $y = \theta x + \epsilon$, and three data points $(x,y)$: $(1,1)$, $(2,3)$, $(3,2)$. Compare $\theta = 1$ with $\theta = 0.5$.

| | Residuals $y - \theta x$ | $J(\theta)$ | $\ell(\theta)$, $\sigma=1$ | $\ell(\theta)$, $\sigma=2$ |
|---|---|---|---|---|
| $\theta = 1$ | $0,\ 1,\ -1$ | $\frac{1}{2}(0+1+1) = 1$ | $-2.757 - 1 = -3.757$ | $-4.836 - 0.25 = -5.086$ |
| $\theta = 0.5$ | $0.5,\ 2,\ 0.5$ | $\frac{1}{2}(0.25+4+0.25) = 2.25$ | $-2.757 - 2.25 = -5.007$ | $-4.836 - 0.5625 = -5.399$ |

How the constant term is computed: with $\sigma=1$, $3\log\frac{1}{\sqrt{2\pi}} = 3 \times (-0.919) = -2.757$; with $\sigma=2$, each point picks up an extra $-\log 2 = -0.693$, for a total of $-4.836$.

The table shows two things. $\theta=1$, which has the smaller $J$, also has the higher log-likelihood. Change $\sigma$ from 1 to 2 and both numbers change, but the ranking does not. The true optimum for this data is $\theta = \frac{\sum x y}{\sum x^2} = \frac{13}{14} \approx 0.929$, where $J = 0.964$, and it is the maximum likelihood solution whatever value $\sigma$ takes.

### Two questions from the class

**Why is the probability always positive?** (28:40) The Gaussian density contains an exponential, which is always greater than 0, so taking the log is safe. A discrete distribution may be exactly 0 in some places, and then you have to check the domain first. In Ré's words:

> "If you start taking logs of 0's, all bets are off."

**Where does $\sigma^2$ come from?** (32:40) There are two options: assume or estimate a value outside the model, or treat $\sigma^2$ as another unknown parameter and include it in the maximum likelihood. He uses the moment to give a test for whether a model can be trusted:

> "if your model is such that small changes in a parameter like that change your conclusions, you should be very nervous."

If you sweep the variance across two orders of magnitude and the answer stays the same, that is a good sign. In this example $\theta$ does not depend on $\sigma^2$ at all, which is the ideal case.

### How this lecture relates to "weighted least squares"

The weighted least squares of the video title never appears in the lecture. The closest moment is the two-station A/B example during the IID discussion, where Ré only says that this situation can be modeled and that he will come back to it.

The following is an addition in this article, not lecture content. Change one thing in the derivation above: the errors are still independent and still zero-mean Gaussian, but each data point has its own variance $\sigma_i^2$, and these $\sigma_i^2$ are known. The density of each point becomes $\frac{1}{\sqrt{2\pi}\,\sigma_i}\exp\left(-\frac{(y^{(i)}-\theta^\top x^{(i)})^2}{2\sigma_i^2}\right)$. After taking the log and summing, the normalizing-constant term still does not contain $\theta$, but $\frac{1}{\sigma_i^2}$ can no longer be pulled outside the sum, and the part of the log-likelihood that depends on $\theta$ becomes

$$
-\frac{1}{2}\sum_{i=1}^{n}\frac{1}{\sigma_i^2}\left(y^{(i)}-\theta^\top x^{(i)}\right)^2
$$

Each squared error now carries a weight $\frac{1}{\sigma_i^2}$: the noisier a data point, the lower its weight. This is weighted least squares. The locally weighted linear regression of Section 1.4 of the notes also multiplies each squared error by a weight, but there the weight is set by "how far the point is from the query point" and has nothing to do with noise level. Neither was taught in this lecture.

## Classification: why not just use least squares

(Recording 34:30–37:44)

Next the labels become $y^{(i)} \in \{0, 1\}$, for example whether or not the image is a cat. The first question to ask is: can we treat 0 and 1 as numbers and simply run least squares?

Ré draws a picture on the spot: moving along the $x$ axis there is first a cluster of points labeled 0 and then, farther along, a cluster labeled 1. Classification cares only about where the boundary between the two clusters is. Least squares cares about how far every point is from the line, so distant points pull the line toward them. He puts it this way: least squares is finding the "center of mass" of the data, whereas classification wants a decision boundary, and those are different goals.

### Numerical example 2: one distant point drags the boundary off

The following is an example made up for this article. Six one-dimensional data points: $x = 1, 2, 3$ labeled 0 and $x = 4, 5, 6$ labeled 1. Fit a line $h(x) = \theta_0 + \theta_1 x$ by least squares and predict 1 when $h(x) \ge 0.5$.

$\bar{x} = 3.5$, $\bar{y} = 0.5$, $\sum (x-\bar{x})^2 = 17.5$, $\sum (x-\bar{x})(y-\bar{y}) = 4.5$, so $\theta_1 = 4.5 / 17.5 = 0.2571$ and $\theta_0 = 0.5 - 0.2571 \times 3.5 = -0.4$. The point where $h(x) = 0.5$ is $x = 3.5$, exactly midway between the two clusters, and all six are classified correctly.

Now add one more point, $x = -23$ with label 0. It is far from the boundary and an unambiguous negative example, so by rights it should not affect the boundary. Refitting gives $\theta_0 = 0.4359$ and $\theta_1 = 0.0256$, and the boundary moves to $x = (0.5 - 0.4359)/0.0256 \approx 2.50$. The prediction at $x = 3$ becomes $0.4359 + 0.0256 \times 3 = 0.513$, which is classified as 1, and that is wrong.

The newly added point is itself classified correctly (its prediction is $-0.153$), yet it turns a previously correct point into a mistake. The line flattens to get closer to the distant point, and the boundary moves with it.

### But it works more often than you would think

Ré does not close the door completely (36:42):

> "least squares will work more often than you think."

His reason is that high-dimensional data behaves differently from low-dimensional intuition; for instance, the nearest point and the farthest point are often about the same distance away, so a model that looks ill-suited is sometimes good enough. There is still a type problem, though: the answer is only yes or no, but the model may output 7 or −40, and you have to write extra code outside the model to turn that into 0 or 1. The cleaner approach is to make the model's output land between 0 and 1 in the first place.

## Logistic regression: squashing a linear score into 0 to 1

(Recording 37:44–47:58)

### The sigmoid and its probabilistic reading

The hypothesis keeps the linear part and wraps it in a nonlinear function $g$:

$$
h_\theta(x) = g(\theta^\top x), \qquad g(z) = \frac{1}{1+e^{-z}}
$$

$g$ is called the logistic function or the sigmoid function (the formula is taken from the notes; in the lecture it is shown as a plot). Ré first asks what properties we want $g$ to have: monotonically increasing, so that a higher score gives a larger output; and smooth. Then why not use a step function that jumps straight to 1 past a threshold? Because it is not differentiable, which is mathematically inconvenient. He adds that differentiability is not a hard requirement, since functions like ReLU are not differentiable everywhere either; this lecture simply starts with the one that is easiest to handle.

A few numbers for a feel: $g(0) = 0.5$, $g(2) = 0.881$, $g(-2) = 0.119$, and $g(100)$ is already extremely close to 1 but never exactly equal to it. The score $\theta^\top x$ before squashing is often called the logit.

The reading of the output changes too. Before, the model predicted a value; now it predicts a probability:

$$
P(y=1 \mid x;\theta) = h_\theta(x), \qquad P(y=0 \mid x;\theta) = 1 - h_\theta(x)
$$

A note on terminology: Ré calls $g$ the link function. Chapter 3 of the notes calls $g$ the response function and reserves link function for its inverse $g^{-1}$, noting that many textbooks use the names the other way around. When you meet either term, first check which direction the author means.

### Writing the likelihood

The two probability statements combine into one:

$$
p(y \mid x;\theta) = \left(h_\theta(x)\right)^{y}\left(1-h_\theta(x)\right)^{1-y}
$$

Ré says this is just an if-then written with exponents (41:53). Plug in $y=1$: the exponent of the second factor is 0, so it becomes 1 and $h_\theta(x)$ is left. Plug in $y=0$: the first factor becomes 1 and $1-h_\theta(x)$ is left.

From here the procedure is exactly as before. Assume the data points are independent, and the likelihood is a product:

$$
L(\theta) = \prod_{i=1}^{n}\left(h_\theta(x^{(i)})\right)^{y^{(i)}}\left(1-h_\theta(x^{(i)})\right)^{1-y^{(i)}}
$$

Take the log, and the exponents come down as coefficients:

$$
\ell(\theta) = \sum_{i=1}^{n}\left[y^{(i)}\log h_\theta(x^{(i)}) + \left(1-y^{(i)}\right)\log\left(1-h_\theta(x^{(i)})\right)\right]
$$

This is equation (2.1) in the notes. It is a sum over data points, so last lecture's gradient descent, stochastic gradient descent, and minibatches all apply directly. A student points out that we are maximizing here, so it should be called gradient ascent (43:56), and Ré agrees: the sign in the update rule changes from minus to plus, or equivalently you run gradient descent on $-\ell(\theta)$.

### Deriving the gradient

In the lecture Ré only shows a slide for this part, says it is pure algebra, and asks everyone to work it out after class (44:56). Here we go through it following Section 2.1 of the notes.

First the derivative of the sigmoid. Differentiate $g(z) = (1+e^{-z})^{-1}$ with the chain rule:

$$
g'(z) = \frac{e^{-z}}{(1+e^{-z})^2} = \frac{1}{1+e^{-z}}\cdot\frac{e^{-z}}{1+e^{-z}} = g(z)\left(1-g(z)\right)
$$

The last step uses $\frac{e^{-z}}{1+e^{-z}} = 1 - \frac{1}{1+e^{-z}}$.

Now take the log-likelihood of a single data point $(x, y)$ and write $z = \theta^\top x$. Differentiating with respect to $\theta_j$, the chain rule has three layers: the derivative of the log, the derivative of $g$, and the derivative of $z$ with respect to $\theta_j$, which is $x_j$.

$$
\frac{\partial \ell}{\partial \theta_j} = \left(\frac{y}{g(z)} - \frac{1-y}{1-g(z)}\right) g(z)\left(1-g(z)\right) x_j
$$

Multiply $g(z)(1-g(z))$ into the parentheses, and each denominator cancels one factor:

$$
\frac{\partial \ell}{\partial \theta_j} = \Big(y\left(1-g(z)\right) - (1-y)\,g(z)\Big)\, x_j
$$

Expand the parentheses, and $-y\,g(z)$ and $+y\,g(z)$ cancel:

$$
\frac{\partial \ell}{\partial \theta_j} = \left(y - h_\theta(x)\right) x_j
$$

This is equation (2.2) in the notes. The stochastic gradient ascent update is therefore

$$
\theta_j := \theta_j + \alpha\left(y^{(i)} - h_\theta(x^{(i)})\right)x_j^{(i)}
$$

Last lecture's update for linear regression on a single data point was $\theta_j := \theta_j - \alpha\left(h_\theta(x^{(i)}) - y^{(i)}\right)x_j^{(i)}$ (the notes call it the LMS rule); multiply the minus sign into the parentheses and it is the same formula. The two look identical: predict, see how far off you are, then correct in the direction of this data point's $x$. The only difference is that $h_\theta$ is now wrapped in a sigmoid. Ré says this "error times input" form is not obvious, yet it is the general rule: almost every model in the first part of the course looks like this, and next lecture's generalized linear models explain why.

### Numerical example 3: one step of stochastic gradient ascent

The following is an example made up for this article. Take $\theta = (-1, 1)$, one data point $x = (1, 2)$ (the first coordinate is the fixed 1), and learning rate $\alpha = 0.1$.

$z = -1 \times 1 + 1 \times 2 = 1$, $h = g(1) = 0.731$. The model believes this point is a positive example with probability 73.1%.

| | Log-likelihood of this point | Error $y - h$ | Gradient $(y-h)\,x$ | Updated $\theta$ | New $h$ |
|---|---|---|---|---|---|
| True label $y = 1$ | $\log 0.731 = -0.313$ | $0.269$ | $(0.269,\ 0.538)$ | $(-0.973,\ 1.054)$ | $g(1.134) = 0.757$ |
| True label $y = 0$ | $\log 0.269 = -1.313$ | $-0.731$ | $(-0.731,\ -1.462)$ | $(-1.073,\ 0.854)$ | $g(0.634) = 0.654$ |

When the model leans the right way ($y=1$), the error is small, the parameters are only nudged, and the probability rises from 0.731 to 0.757. When it leans the wrong way ($y=0$), the log-likelihood is lower by 1, the error is nearly three times as large, the correction is larger too, and the probability falls from 0.731 to 0.654. The size of the update is automatically proportional to "how wrong" the model is, with no extra rule needed.

This also answers the problem in example 2 (an addition in this article). Suppose logistic regression has already learned $\theta = (-7, 2)$, with the boundary at $x = 3.5$. For the distant negative example at $x = -23$, $z = -7 + 2 \times (-23) = -53$ and $h = g(-53) \approx 10^{-23}$, so the error $y - h$ is almost 0, and even after multiplying by $x$ the gradient is still negligibly small. A point that is already classified correctly, and confidently so, exerts almost no pull on the parameters; least squares, by contrast, drags the line toward it precisely because it is far from the line.

## Newton's method: another way to solve the problem

(Recording 47:58–1:02:14)

### Logistic regression in the days before PyTorch

Before getting into Newton's method, Ré gives some history (47:58). Before PyTorch, TensorFlow, and JAX, logistic regression was the most widely used model in machine learning, and the practice was to expand the input features into a very high dimension and feed them in. The problem is convex (he says the lecture will not prove it), so the optimal $\theta$ can be found.

He also returns to the earlier $\sigma^2$ discussion: people used to be very uneasy when two solvers produced two different values of $\theta$. Later the machine learning field worked out that what it really cares about is not $\theta$ itself but the predictions $h_\theta$ makes, so today stability is mostly discussed in terms of predictions. Newton's method comes from the tradition that cares about the parameters themselves, and he says he introduces it mainly because of its historical importance.

### The one-dimensional derivation

The problem Newton's method solves is: given a function $f$, find where $f(\theta) = 0$. For maximum likelihood, take $f = \ell'$, because the maximum occurs where the derivative is zero.

Start from a guess $\theta_0$ and approximate $f$ at that point by its tangent line, that is, a first-order Taylor expansion:

$$
t(\theta) = f(\theta_0) + f'(\theta_0)\,(\theta - \theta_0)
$$

We do not know where the zero of $f$ is, but the zero of the tangent line can be computed. Set $t(\theta) = 0$ and rearrange:

$$
\theta - \theta_0 = -\frac{f(\theta_0)}{f'(\theta_0)} \quad\Longrightarrow\quad \theta_1 = \theta_0 - \frac{f(\theta_0)}{f'(\theta_0)}
$$

Treat $\theta_1$ as the new guess and repeat. Substituting $f = \ell'$, the update is

$$
\theta := \theta - \frac{\ell'(\theta)}{\ell''(\theta)}
$$

Ré stresses how this differs from gradient descent (51:00): gradient descent knows only the direction, and how far to go depends on the learning rate you supply; the tangent line in Newton's method tells you directly how far to go.

> "This is telling me exactly how far to go. So it doesn't have a step size."

### Several dimensions: the Hessian

When $\theta$ is a vector, $f = \nabla_\theta \ell$ is a function from $\mathbb{R}^{d+1}$ to $\mathbb{R}^{d+1}$, and its derivative is the square matrix of second partial derivatives, called the Hessian:

$$
H_{jk} = \frac{\partial^2 \ell(\theta)}{\partial\theta_j\,\partial\theta_k}, \qquad \theta := \theta - H^{-1}\nabla_\theta \ell(\theta)
$$

The one-dimensional "divide by $\ell''$" becomes "multiply by $H^{-1}$".

The lecture also takes a detour into a more general case (53:02–55:03): if $f$ outputs a single scalar while $\theta$ has $d$ dimensions, setting the tangent to zero gives you only one equation in $d$ unknowns, with infinitely many solutions. What is used then is the Moore–Penrose pseudo-inverse. Ré goes on to ask what to do when there are more equations than unknowns, and a student gets it right: do least squares, the same algorithm as in the previous lecture. This detour has no direct bearing on logistic regression, whose Hessian is a square matrix.

The following is an addition in this article. The Hessian of logistic regression can be obtained by differentiating the gradient once more. In $\frac{\partial \ell}{\partial\theta_j} = \sum_i (y^{(i)} - h^{(i)})\,x_j^{(i)}$ only $h^{(i)} = g(\theta^\top x^{(i)})$ contains $\theta$; using $g' = g(1-g)$:

$$
H_{jk} = -\sum_{i=1}^{n} h^{(i)}\left(1-h^{(i)}\right)x_j^{(i)}x_k^{(i)}
$$

In matrix form this is $H = -\sum_i h^{(i)}(1-h^{(i)})\,x^{(i)}x^{(i)\top}$, with each data point contributing a $(d+1)\times(d+1)$ matrix. To determine which way the function curves, sandwich it between any vector $v$ on both sides:

$$
v^\top H v = -\sum_{i=1}^{n} h^{(i)}\left(1-h^{(i)}\right)\left(v^\top x^{(i)}\right)^2 \le 0
$$

The coefficient $h(1-h)$ is always positive and the squared term is never negative, so whichever direction you look in, $\ell$ curves downward. In other words it is a concave function, with no local-maximum traps. $\ell$ being concave is the same as $-\ell$ being convex, and that is what Ré means when he says the problem is convex underneath.

### Numerical example 4: Newton's method versus gradient ascent

The following is an example made up for this article. Four data points have only the intercept term ($x = 1$), three labeled 1 and one labeled 0. The model has a single parameter $\theta$, and the predicted probability is $g(\theta)$.

$$
\ell(\theta) = 3\log g(\theta) + \log\left(1-g(\theta)\right), \quad \ell'(\theta) = 3\left(1-g\right) - g = 3 - 4g(\theta), \quad \ell''(\theta) = -4\,g(\theta)\left(1-g(\theta)\right)
$$

Setting $\ell' = 0$ gives $g(\theta) = 0.75$, meaning the model's probability equals the fraction of positive examples in the data, and $\theta^\ast = \ln 3 = 1.098612$. This problem has a closed-form solution, which makes it handy for measuring error.

Run Newton's method starting from $\theta = 0$:

| Step | $\theta$ | $g(\theta)$ | $\ell'$ | $\ell''$ | Gap to $\ln 3$ |
|---|---|---|---|---|---|
| 0 | $0$ | $0.5$ | $1$ | $-1$ | $1.10$ |
| 1 | $1$ | $0.7311$ | $0.0758$ | $-0.7864$ | $9.9\times10^{-2}$ |
| 2 | $1.096339$ | $0.7496$ | $0.0017$ | $-0.7509$ | $2.3\times10^{-3}$ |
| 3 | $1.098611$ | $0.7500$ | $9.7\times10^{-7}$ | $-0.7500$ | $1.3\times10^{-6}$ |
| 4 | $1.098612$ | $0.7500$ | | | $4\times10^{-13}$ |

How the first step is computed: $\theta_1 = 0 - \frac{1}{-1} = 1$. The second step: $\theta_2 = 1 - \frac{0.0758}{-0.7864} = 1.0963$.

The same problem with gradient ascent and learning rate 0.1: step 1 reaches $0.1$, step 10 reaches $0.657$, at step 100 the error is still $3.5\times10^{-4}$, and only at step 200 does it get down to $1.5\times10^{-7}$. Newton's method reaches $10^{-6}$ in three steps, and the number of correct digits roughly doubles with each step. This is what Ré means when he says (55:03):

> "it gives you many digits of precision every time it runs."

### So why does everyone still use SGD

The answer is the price of each step (55:03–57:05). $n$ is the number of data points and $d$ is the parameter dimension. The table below gives the per-step costs Ré states; for the gradient descent row he only says it has to look at all the data, and the $O(nd)$ is filled in by this article using the same accounting:

| Method | Cost per step | Character |
|---|---|---|
| SGD | $O(d)$ | Looks at one point; the direction is a rough estimate and it takes many steps |
| Minibatch SGD | $O(Bd)$ | Looks at $B$ points; the direction is somewhat better |
| Gradient descent | $O(nd)$ | Computes the true gradient but has to sweep all the data |
| Newton's method | $O(nd^2 + d^3)$ | Very few steps, each one extremely expensive |

$nd^2$ is the cost of assembling the Hessian: by the formula above, each of the $n$ data points contributes a $d\times d$ matrix. $d^3$ is the cost of solving that $d\times d$ linear system, which Ré attributes to inverting the matrix.

Machine learning cares about the case where $n$ and $d$ are both enormous. Ré's example is training a model with ten billion to a trillion parameters on all the text on the internet, where even one full gradient is unaffordable, let alone $d^3$. So his conclusion is:

> "minibatch SGD is the workhorse of ML."

He says a later homework will have everyone compare these methods in practice.

### Two questions from the class

**Does anyone actually use Newton's method?** (57:05) Yes, it is everywhere in classical statistics. When there are only twenty to a few hundred features and you really care about the parameters themselves, statistics packages or SciPy use Newton's method, or what he calls a variant, L-BFGS (a memory-saving quasi-Newton method that never forms the full Hessian). Ré says social scientists would not want SGD: it is too noisy and hard to tune, whereas Newton's method has no learning rate to tune and just runs to completion when you press the button.

**Can it be cheaper when the Hessian has structure?** (59:08) Yes. You do not have to form the whole Hessian; being able to compute Hessian-times-vector is enough. You can also assume it is diagonal, or diagonal plus low rank. Ré's plain-language account of the Hessian is that it tells you how much to trust a step in each direction: directions that change sharply and directions that change gently should not be stepped the same distance. He says algorithms like AdaGrad use exactly this kind of diagonally approximated curvature information, and that Adam, the most widely used today, combines such ideas with momentum. So vanilla Newton's method is rare in machine learning, but the idea behind it has never gone away.

### Wrapping up

Ré closes by summarizing three things from the lecture: the difference between classification and regression, the principle of maximum likelihood, and logistic regression together with Newton's method. Then he adds (1:01:10):

> "I think I accidentally cut off and threw away the multi-class stuff, so I will make sure to bring that back."

Multi-class classification (softmax, Section 2.3 of the notes) was scheduled for this lecture but was not reached. The [next lecture](/posts/ai/2026-10-12-stanford-cs229-lecture-04-exponential-family-glm-en) moves on to the exponential family and generalized linear models, and softmax is made up there.

## Self-check

**1. If the error distribution is changed from Gaussian to Laplace, with density $p(\epsilon) = \frac{1}{2b}\exp\left(-\frac{|\epsilon|}{b}\right)$, what loss function does maximum likelihood lead to?**

Answer: following the same steps, $\ell(\theta) = n\log\frac{1}{2b} - \frac{1}{b}\sum_i \left|y^{(i)} - \theta^\top x^{(i)}\right|$, and maximizing it is the same as minimizing the sum of absolute errors. Criterion: you should be able to point out that the square comes from the $(z-\mu)^2$ in the exponent of the Gaussian density, and that changing the noise assumption changes the loss function with it.

**2. In example 1, change $\sigma$ to 10. By how much do the log-likelihoods of $\theta = 1$ and $\theta = 0.5$ differ, and which is larger?**

Answer: the constant terms are equal and cancel, so the gap is $\frac{J(0.5) - J(1)}{\sigma^2} = \frac{2.25 - 1}{100} = 0.0125$, and $\theta = 1$ is still the larger. The larger $\sigma$ is, the less the model can tell the two values of $\theta$ apart, but the ranking does not change.

**3. $\theta = (0, 0)$, one data point $x = (1, 3)$ with $y = 1$, and $\alpha = 0.5$. Take one step of stochastic gradient ascent. What are the new $\theta$ and the new predicted probability?**

Answer: $z = 0$, $h = 0.5$, error $0.5$, gradient $(0.5, 1.5)$, new $\theta = (0.25, 0.75)$. The new $z = 0.25 + 2.25 = 2.5$, and $h = g(2.5) \approx 0.924$.

**4. In $p(y \mid x;\theta)$, why is there a bar before $x$ and a semicolon before $\theta$?**

Criterion: the answer should include two points. $x$ is observed data and can serve as a condition in this model; $\theta$ is not a random variable but a parameter that indicates "which member of a family of distributions", and maximum likelihood chooses within that family.

**5. A model has $d = 10^6$ parameters and $n = 10^8$ data points. Roughly how many times more does one step of Newton's method cost than one step of SGD?**

Answer: SGD costs $d = 10^6$. Newton's method costs $nd^2 + d^3 = 10^{20} + 10^{18} \approx 10^{20}$. The ratio is about $10^{14}$. Even if Newton's method needed only ten steps, it would be nowhere near worth it; just storing a $10^6 \times 10^6$ Hessian takes $10^{12}$ numbers.

## Corresponding reading

The parts of the [CS229 main notes](https://cs229.stanford.edu/main_notes.pdf) (August 2026 version) that correspond to this lecture:

- **Chapter 1, Section 1.3, Probabilistic interpretation (pp.16–18)**: the error model, the likelihood function, and the derivation from the log-likelihood to $J(\theta)$. The formulas in this article's "Maximum likelihood" section match the notes.
- **Chapter 2, Section 2.1, Logistic regression (pp.21–24)**: the sigmoid, $g' = g(1-g)$, the log-likelihood in equation (2.1), and the gradient in equation (2.2). The gradient algebra skipped in the lecture is here.
- **Chapter 2, Section 2.4, Another algorithm for maximizing $\ell(\theta)$ (pp.28–29)**: Newton's method and the Hessian. The notes have a three-panel figure showing the tangent-line approximation and mention that, applied to logistic regression, the method is also called Fisher scoring.

Where the lecture and the notes differ:

- The lecture first lists zero mean, IID, and fixed variance, then says this setup leads to the Gaussian; the notes directly assume the error follows $\mathcal{N}(0, \sigma^2)$. The derivation actually uses the notes' formulation.
- The lecture spends a lot of time on attitudes toward modeling (models are abstractions, sensitivity to parameters, machine learning caring about predictions while statistics cares about parameters); the notes have none of this.
- The lecture discusses the per-step cost of various optimization methods, L-BFGS, how AdaGrad and Adam relate, and the pseudo-inverse for a scalar-valued function; Section 2.4 of the notes only says that each step of Newton's method requires finding and inverting a Hessian and that it is usually faster overall when $d$ is not too large.
- The lecture calls $g$ the link function; Chapter 3 of the notes calls it the response function.

Not covered in the lecture, but present in the notes within this range:

- **Section 1.4, Locally weighted linear regression (pp.18–20)**: the content the video title most likely refers to, which does not appear in this lecture.
- **Section 2.2, the perceptron (pp.24–25)**: the lecture only mentions that the step function is not differentiable and does not introduce the perceptron algorithm.
- **Section 2.3, multi-class classification and softmax (pp.25–27)**: Ré says he cut it by accident and will bring it back later.
- **The logistic loss form in Remark 2.1.1 (p.24)**: writes the negative log-likelihood as a function of the logit; Chapter 7 on neural networks uses it.

## Course video sources

Original video: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 3: Weighted Least Squares](https://www.youtube.com/watch?v=uJF_gL3jhxI)

- [Stanford CS229 Machine Learning | Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 course website](https://cs229.stanford.edu/)
- [CS229 main notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

Checked: 2026-10-12.

Content check: verified against the video transcript (2026-10-12): the full English transcript (about 62 minutes) was read section by section, and the lecture quotes and timestamps in this article all come from it. The board work and slides were not viewed; formulas are reconstructed from the main notes, and formulas the lecture only stated verbally are marked as such in the text. The four numerical examples were all made up for this article and checked separately; they are not lecture content.

## References

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 3: Weighted Least Squares (YouTube)](https://www.youtube.com/watch?v=uJF_gL3jhxI): the main source for this article. The lecture order, quotes, Q&A, and timestamps all come from the English captions of this video.
- [CS229 main notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf): Section 1.3 of Chapter 1 and Sections 2.1 and 2.4 of Chapter 2, used to reconstruct formulas, complete the gradient derivation, and compare the lecture with the notes.
- [Stanford CS229 Machine Learning | Spring 2026 playlist](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw): used to confirm the lecture numbering and video titles.
- [Reading Stanford CS229: course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): the entry point to this series and the place of this lecture in the whole course.
