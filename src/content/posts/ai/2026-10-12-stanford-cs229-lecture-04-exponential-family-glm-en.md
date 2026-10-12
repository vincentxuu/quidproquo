---
title: "Exponential Families, Generalized Linear Models, and Softmax: How Many Times Do You Re-derive for a New Error Distribution? | Stanford CS229 Lecture 4"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, exponential-family, generalized-linear-models, softmax]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 4
tldr: "If the distribution of y can be written as b(y)·exp(ηᵀT(y) − a(η)), one derivative of a(η) gives the expectation and two give the variance. Set η = θᵀx, and linear regression, logistic regression, and softmax all share one update rule: θ ← θ + α(y − h(x))x. The second half of the lecture uses a four-class example to cover softmax, cross entropy, and label smoothing."
description: "A guide to Lecture 4 of Stanford CS229 Spring 2026: the four parts of an exponential family, rewriting the Bernoulli and the Gaussian, the derivative properties of the log partition function, the recipe for generalized linear models, and the derivation of softmax and cross entropy with worked numbers."
draft: false
math: true
---

> 🌏 [中文版](/posts/ai/2026-10-12-stanford-cs229-lecture-04-exponential-family-glm)

**Video status: Videos included.** This article is written from the English captions of the Spring 2026 Lecture 4 recording published by Stanford Online, with notation checked against Chapter 3 and Section 2.3 of the 2026 main notes. I did not see the board or the slides, so wherever the lecturer points at something while talking, I reconstructed it from context and the notes.

[The previous lecture](/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression-en) did two very similar things. Assume Gaussian errors, and maximum likelihood gives least squares. Assume Bernoulli labels, and maximum likelihood gives logistic regression. And the update rule for logistic regression looks exactly like the one for linear regression in [Lecture 2](/posts/ai/2026-10-12-stanford-cs229-lecture-02-supervised-learning-linear-regression-en). This lecture answers the question that follows: if y becomes a count, or one of four classes, do you have to derive everything from scratch again? No. As long as the distribution belongs to the exponential family, inference, the loss function, and the update rule have already been derived.

The prerequisites are the gradient update rule, maximum likelihood estimation, and the sigmoid from Lectures 2 and 3, plus being able to differentiate log and exp and knowing the definitions of expectation and variance. After reading, you should be able to rewrite a distribution you have not seen before in exponential family form, read off its mean and variance, write the update rule of the corresponding model, and compute softmax and cross entropy by hand. For the overall route through the course, see the [course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en).

Chris Ré teaches this lecture. He does not introduce himself here; this term he and Tengyu Ma alternate, and Lectures 2 through 6 are his.

```youtube
url: https://www.youtube.com/watch?v=8gVi4Rk21Eg
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 4: Exponential Family, GLMs Classification
captions: en
```

## The three parts of this lecture

(Recording 00:00–03:05)

The lecturer opens by laying out the order:

1. **Exponential family**: a fixed format for writing probability distributions. He calls it the bedrock of a huge number of statistical models.
2. **Generalized linear model** (GLM): connect an exponential family to data and parameters to get a model you can train.
3. **Softmax**: multi-class classification. He says this is the most widely used one today: every time a language model produces a token, the last step is a softmax that picks from the whole vocabulary. Attention, which comes later ([Lecture 14](/posts/ai/2026-10-12-stanford-cs229-lecture-14-llm-next-token-attention-en)), has a softmax inside it too.

His overall framing: data in the world comes in different types (real numbers, yes/no, counts, several classes). The exponential family gives a fixed path from "a distribution for this type" to "a model that can be learned," and the steps are the same for every type.

## Definition of the exponential family: four parts

(Recording 03:05–07:14)

A distribution belongs to the exponential family if its probability (or probability density) can be written as:

$$
p(y; \eta) = b(y)\, \exp\!\big(\eta^\top T(y) - a(\eta)\big)
$$

Each of the four parts has a name:

- $\eta$: the **natural parameter**. $\eta$ has as many dimensions as the distribution has free parameters.
- $T(y)$: the **sufficient statistic**. The lecturer describes it as "what you measured about y." It must have the same dimension as $\eta$ so the two can form an inner product. Almost every example in this lecture takes $T(y) = y$.
- $b(y)$: the **base measure**. A scalar that depends only on y; the point is that it does not contain $\eta$.
- $a(\eta)$: the **log partition function**. It depends only on $\eta$ and does not contain y.

$a(\eta)$ looks like a mere correction term, but the lecturer stresses that most of what matters later lives in it. The reason is that probabilities must sum to 1. Suppose y is discrete:

$$
\sum_y p(y;\eta) = e^{-a(\eta)} \sum_y b(y)\, e^{\eta^\top T(y)} = 1
$$

$e^{-a(\eta)}$ does not contain y, so it comes out of the sum. Rearrange and take the log:

$$
a(\eta) = \log \sum_y b(y)\, e^{\eta^\top T(y)}
$$

For continuous y, replace the sum with an integral. In other words, $a(\eta)$ is not a function you pick separately. Once $b$ and $T$ are chosen, the "sums to 1" condition determines it. The lecturer calls that sum "all the possible worlds": it sweeps over every value y can take. We will differentiate this expression shortly.

The real restriction in this format is inside the exponent. $b(y)$ can be an arbitrarily complicated function of y, and $a(\eta)$ can be an arbitrarily complicated function of $\eta$, but y and $\eta$ may interact only through the inner product $\eta^\top T(y)$. Around 13:25 the lecturer says "the interactions between them have to be linear," and previews that the generalized linear models in the second half turn this linear part into a model.

## Rewriting the Bernoulli as an exponential family

(Recording 07:14–11:19)

Flip a biased coin, $y \in \{0, 1\}$, where $y=1$ has probability $\phi$:

$$
p(y; \phi) = \phi^{y} (1-\phi)^{1-y}
$$

This packs "take $\phi$ if y=1, otherwise take $1-\phi$" into one expression. When y is 1, the exponent of the second factor is 0 and that factor becomes 1. When y is 0, the first factor becomes 1.

**Step 1: write the whole thing as exp(log(·)).** Any positive number $c$ equals $e^{\log c}$:

$$
p(y;\phi) = \exp\!\big( y \log \phi + (1-y)\log(1-\phi) \big)
$$

The lecturer reminds you to check that taking the log is legal: $\phi$ cannot be exactly 0 or 1, or you get $\log 0$.

**Step 2: collect the terms that contain y.** Expand $(1-y)\log(1-\phi) = \log(1-\phi) - y\log(1-\phi)$, so

$$
p(y;\phi) = \exp\!\Big( y \log\frac{\phi}{1-\phi} + \log(1-\phi) \Big)
$$

At 09:16 the lecturer makes a point of saying there is no cleverness in this step: "it's not like some mysterious mathematical insight. It's just mechanical." You just gather the terms that multiply y.

**Step 3: read off the parts against the definition.** Take $T(y) = y$ and $b(y) = 1$. Whatever multiplies y is the natural parameter:

$$
\eta = \log\frac{\phi}{1-\phi}
$$

This quantity is the log odds. The leftover $\log(1-\phi)$ should correspond to $-a(\eta)$, but right now it is written in terms of $\phi$. $a$ has to be a function of $\eta$, so we need $\phi$ in terms of $\eta$, which means inverting the expression above.

**Step 4: invert.** Exponentiating both sides gives $e^{\eta} = \phi/(1-\phi)$, so $e^{\eta}(1-\phi) = \phi$, which rearranges to $e^{\eta} = \phi(1+e^{\eta})$:

$$
\phi = \frac{e^{\eta}}{1+e^{\eta}} = \frac{1}{1+e^{-\eta}}
$$

This is exactly the sigmoid. In earlier lectures it was a function we simply used. Here it is the conversion between the Bernoulli's natural parameter and its mean, and it falls out on its own.

**Step 5: write $a(\eta)$.** From the expression above, $1-\phi = 1/(1+e^{\eta})$, so

$$
a(\eta) = -\log(1-\phi) = \log(1+e^{\eta})
$$

The four parts of the Bernoulli: $T(y)=y$, $b(y)=1$, $\eta=\log\frac{\phi}{1-\phi}$, $a(\eta)=\log(1+e^{\eta})$.

## Rewriting the Gaussian as an exponential family

(Recording 11:19–14:27)

Before the Gaussian, the lecturer clears up a common confusion: so far we are only talking about the distribution of y. There is no model and no data yet. He asks everyone to think of these distributions as "distributions of the error." The linear models from before produce a prediction, and y sits near that prediction with some error. The Bernoulli and the Gaussian describe what that error looks like.

The Gaussian density is $\frac{1}{\sqrt{2\pi}\sigma}\exp\!\big(-\frac{(y-\mu)^2}{2\sigma^2}\big)$. There is one setting the lecture does not spell out: the notes set $\sigma^2$ to 1, on the grounds that the derivation of linear regression already showed $\sigma^2$ has no effect on the resulting $\theta$. The lecturer works straight from the expression on the slide, and he later says the Gaussian's $a$ is $\eta^2/2$, which is precisely the $\sigma^2=1$ result, so this article follows the notes. With $\sigma^2=1$, expand the square, $(y-\mu)^2 = y^2 - 2\mu y + \mu^2$:

$$
p(y;\mu) = \frac{1}{\sqrt{2\pi}} \exp\!\Big(-\frac{y^2}{2}\Big) \cdot \exp\!\Big(\mu y - \frac{\mu^2}{2}\Big)
$$

Each of the three terms has a place to go:

- $-y^2/2$, which contains only y, merges with the constant in front to become $b(y) = \frac{1}{\sqrt{2\pi}} e^{-y^2/2}$.
- $\mu y$ is the interaction between y and the parameter, and it is linear in y, so $T(y)=y$ and $\eta = \mu$.
- $\mu^2/2$, which contains only the parameter, is $a(\eta) = \eta^2/2$.

The lecturer says that seeing a square before expanding, you might worry that the inner product form will not work out. After expanding, the nonlinear pieces $y^2$ and $\mu^2$ each involve only one side, so they can go to $b$ and $a$ respectively, and the interaction term $\mu y$ happens to be linear.

At this point both error distributions the course has used so far fit the same format.

## Differentiating a(η): expectation, variance, and convexity

(Recording 14:27–20:40)

The Gaussian's $a(\eta) = \eta^2/2$ differentiates once to $\eta$, which is the mean $\mu$. The lecturer says this looks like a coincidence but holds for the entire exponential family. The derivation below carries it through, taking $T(y)$ and $\eta$ to be scalars and y discrete (for continuous y, replace sums with integrals).

Start from $a(\eta) = \log \sum_y b(y) e^{\eta T(y)}$. Differentiating a log puts its argument in the denominator and the derivative of the argument in the numerator:

$$
\frac{da}{d\eta} = \frac{\sum_y b(y)\, T(y)\, e^{\eta T(y)}}{\sum_y b(y)\, e^{\eta T(y)}}
$$

The denominator equals $e^{a(\eta)}$. Move it inside the sum in the numerator:

$$
\frac{da}{d\eta} = \sum_y T(y)\; \underbrace{b(y)\, e^{\eta T(y) - a(\eta)}}_{p(y;\eta)} = \mathbb{E}[T(y)]
$$

At 17:30 a student asks why this is an expectation, and the lecturer's answer is this very step: the denominator is the normalizing constant, and once you put it back, each term is exactly a probability times $T(y)$.

Differentiate once more. Differentiating $e^{\eta T(y) - a(\eta)}$ in the expression above brings out a factor $T(y) - a'(\eta)$:

$$
\frac{d^2a}{d\eta^2} = \sum_y T(y)\,\big(T(y) - a'(\eta)\big)\, p(y;\eta) = \mathbb{E}[T(y)^2] - \big(\mathbb{E}[T(y)]\big)^2 = \mathrm{Var}[T(y)]
$$

The second equality uses $a'(\eta) = \mathbb{E}[T(y)]$, which we just obtained. In the lecture, the lecturer says of this step "You can check, I won't"; the above fills it in following the approach he describes. When $\eta$ is a vector, the first derivative becomes a gradient and the result is the vector $\mathbb{E}[T(y)]$; the second derivative becomes a Hessian and the result is the covariance matrix.

Check against the two distributions from before:

| Distribution | $a(\eta)$ | $a'(\eta)$ | $a''(\eta)$ |
|---|---|---|---|
| Bernoulli | $\log(1+e^{\eta})$ | $\frac{e^{\eta}}{1+e^{\eta}} = \phi$ | $\phi(1-\phi)$ |
| Gaussian ($\sigma^2=1$) | $\eta^2/2$ | $\eta = \mu$ | $1$ |

The Bernoulli has mean $\phi$ and variance $\phi(1-\phi)$, and the Gaussian has variance 1, so everything matches. Plug in a number: with $\phi = 0.8$, $\eta = \log 4 \approx 1.386$, $a(\eta) = \log 5 \approx 1.609$, $a'(\eta) = 4/5 = 0.8$, $a''(\eta) = 0.8 \times 0.2 = 0.16$.

This derivation used no property specific to the Bernoulli or the Gaussian, only the exponential family format. That is what the lecturer means by "inference comes for free": once a distribution is in this format, you do not need a separate integral for the mean and variance. Differentiating $a$ gives them.

**An aside on cumulants (17:30–19:38).** The lecturer then points out that $a(\eta)$ is the cumulant generating function, not the moment generating function. The low-order terms of the two agree; he says the first three match and higher orders differ. He also says you do not need to understand this for the course, it is just something people often mix up. (An addition in this article: differentiating $a(\eta)$ $n$ times gives the $n$-th cumulant of $T(y)$. The first is the mean, the second is the variance, and the third is the third central moment $\mathbb{E}[(T-\mathbb{E}T)^3]$; "match" here means matching these moments centered at the mean. The fourth cumulant is the fourth central moment minus $3\,\mathrm{Var}^2$, and from there the two part ways.)

**Convexity (19:38–20:40).** The lecturer says that in earlier lectures people asked "what is convex," and here he gives the general answer: the second derivative of $a$ is a variance (a covariance matrix in several dimensions). A variance is never negative and a covariance matrix is positive semidefinite, so $a$ is a convex function of $\eta$. The Gaussian's $a(\eta) = \eta^2/2$ is the bowl shape of least squares. The benefit of convexity is that gradient descent does not get stuck in a local minimum.

## Why the lecturer keeps saying "think in terms of errors"

(Recording 20:40–27:43)

If there were only the Bernoulli and the Gaussian, spending twenty minutes rewriting them in a stranger format would not pay off. The lecturer next puts up a table showing how many data types the same format covers:

| Type of y | Distribution |
|---|---|
| Binary | Bernoulli |
| Several classes | multinomial |
| Real number | Gaussian |
| Count | Poisson |
| Positive real number (e.g., a waiting time) | gamma, exponential |
| A probability distribution itself | Dirichlet |

He also notes that this course only uses $T(y) = y$, while books devoted to GLMs use more complicated $T$.

The next few minutes are Q&A. Three answers are worth writing down.

**What "think in terms of errors" means (22:40).** The statistical view is that a true model generates the data, plus whatever the model does not capture, such as measurement error or miscounts. The procedure in the previous two lectures was actually the same; the only difference was the type of y, and therefore the loss function. The piece "what does the remaining error look like after the linear prediction" is now handed entirely to the exponential family. The type of y determines the error distribution, and the error distribution determines everything else.

**Do people derive these by hand in practice (23:40).** No, you use the softmax that ships with your framework. The lecturer says this lecture is a look under the hood. He gives an example: one of his students has a moderately well-known model, and someone who reimplemented it got the weight initialization wrong, even though the paper described the correct way. Diagnosing a mistake like that takes someone who understands how expectations propagate forward through a model. So this theory is a tool for understanding models, not a step in day-to-day coding.

**What "inference is free" refers to (25:41).** In this lecture, "inference" means: given a data point, the model outputs an estimate, and the error distribution then gives the probability of each outcome. Logistic regression outputting "the probability of belonging to this class" is inference in this sense, and so is a language model outputting "the probability that the next word is a given word." The lecturer specifically warns against getting the causality backwards. These distributions did not become easy to compute because of the exponential family. These error distributions were already easy to compute, and in the same way; the exponential family organizes that fact into one format. In his words: "It's more compression in your head rather than compression in code" (26:42).

## Generalized linear models: connecting a distribution to data

(Recording 27:43–37:00)

So far there are only distributions. The supervised learning setup has features $x \in \mathbb{R}^{d+1}$ (the extra dimension is the appended constant 1), a target y, and a need for a model. The GLM approach comes down to three decisions, which the notes list as three assumptions:

1. **Pick an exponential family distribution based on the type of y.** Bernoulli for binary, Gaussian for real numbers, Poisson for counts.
2. **The model's output is the expectation.** $h_\theta(x) = \mathbb{E}[y \mid x; \theta]$.
3. **The natural parameter is a linear function of the input.** $\eta = \theta^\top x$.

The third is a design choice. The notes say it looks like the least justified of the three, and that rather than an assumption it is better thought of as a design choice in the recipe. We saw earlier that y and $\eta$ may interact only linearly inside the exponent. Now make $\eta$ linear in x as well, and the only thing left to learn in the whole model is $\theta$.

### Don't mix up the three kinds of parameters

The lecturer says this is the most confusing spot in the whole lecture (from 32:55). There are three sets of names:

- **Model parameters** $\theta$: the weights learned from data.
- **Natural parameter** $\eta = \theta^\top x$: the number you get when $\theta$ meets one x. It is the parameter of the error distribution.
- **Canonical parameter**: the parameter you would see if you looked the distribution up on Wikipedia, such as $\phi$ for the Bernoulli or $\mu$ for the Gaussian.

Watch for a terminology clash when reading the notes: Section 3.1 of the notes uses canonical parameter as another name for the natural parameter $\eta$, the opposite of how the lecture uses it. This article follows the lecture, so "canonical parameter" means things like $\phi$ and $\mu$.

A function converts between $\eta$ and the canonical parameter. The notes define it this way: the function that maps the natural parameter to the mean, $g(\eta) = \mathbb{E}[T(y);\eta]$, is the canonical response function, and its inverse $g^{-1}$ is the canonical link function. In the lecture, the lecturer refers to this conversion collectively as "link function or response function" without distinguishing the direction. By the result of the previous section, $g$ is just $a'$.

The lecturer's summary of this pile of names comes at 33:57: "These are the only ones you learn. The rest of this is modeling the noise." The only thing to learn is $\theta$.

### Inference and learning

**Inference** is reading off the expectation directly:

$$
h_\theta(x) = \mathbb{E}[y \mid x;\theta] = a'(\eta) = a'(\theta^\top x)
$$

**Learning** is maximum likelihood. Assume the n training examples are IID, so the joint probability factors into a product, and taking the log turns it into a sum:

$$
\ell(\theta) = \log \prod_{j=1}^{n} p\big(y^{(j)} \mid x^{(j)};\theta\big) = \sum_{j=1}^{n} \log p\big(y^{(j)} \mid x^{(j)};\theta\big)
$$

At 34:57 a student asks whether this quietly assumes zero-mean errors and IID. The lecturer answers that IID is indeed an assumption implicit in the whole setup; without it you cannot factor the joint probability into a product. "Zero mean" is not stated explicitly, but intuitively something like it should hold.

Someone in class asks where the loss function comes from. The answer is the $\log p$ in this expression: once you choose the distribution, the form of $\log p$ is fixed, and so is the loss function.

### One update rule for everything

The lecturer then says the algorithm always has the same form and that you can verify it yourself. Here is that verification written out. Take one example $(x, y)$ with $T(y)=y$, and substitute $\eta = \theta^\top x$ into the log of the exponential family:

$$
\log p(y \mid x;\theta) = \log b(y) + (\theta^\top x)\, y - a(\theta^\top x)
$$

Take the gradient with respect to $\theta$. The first term does not contain $\theta$. The gradient of the second term is $y\,x$. The third term uses the chain rule: differentiating $a$ with respect to $\eta$ gives $a'(\theta^\top x)$, and the gradient of $\eta$ with respect to $\theta$ is $x$:

$$
\nabla_\theta \log p(y \mid x;\theta) = y\,x - a'(\theta^\top x)\, x = \big(y - h_\theta(x)\big)\, x
$$

So one step of stochastic gradient ascent is:

$$
\theta \leftarrow \theta + \alpha\, \big(y - h_\theta(x)\big)\, x
$$

Prediction error times the input, and step in that direction. This rule uses no specific distribution. Changing the distribution only changes the $a'$ inside $h_\theta$.

This article adds one passage the lecture does not develop, tying the convexity from before to training. The negative log-likelihood of one example is

$$
-\log p(y \mid x;\theta) = a(\theta^\top x) - y\,\theta^\top x - \log b(y)
$$

View it as a function of $\theta$. $a$ is convex in $\eta$, $\eta = \theta^\top x$ is linear in $\theta$, and a convex function composed with a linear function is still convex. The second term is linear in $\theta$, and the third does not contain $\theta$. So the negative log-likelihood of each example is convex in $\theta$, and so is the sum over n examples. For any GLM built with this lecture's recipe ($T(y)=y$, $\eta=\theta^\top x$), the training problem is convex. That statement has two limits. Convexity only guarantees there are no worse local minima; it does not guarantee the minimum is unique or that it exists. And if you do not let $\eta$ equal $\theta^\top x$ directly and use a different link function instead, the guarantee may no longer hold.

### Plugging back in: linear regression and logistic regression

This subsection is an addition in this article, based on Sections 3.2.1 and 3.2.2 of the notes; in the lecture, the lecturer says only "There's some examples there" at this point. The notes go directly through $\mathbb{E}[y]=\mu=\eta$ and $\mathbb{E}[y]=\phi=1/(1+e^{-\eta})$. Here I read the result off $h_\theta(x)=a'(\theta^\top x)$ from the previous section instead, and the outcome is the same.

- **Gaussian**: $a'(\eta) = \eta$, so $h_\theta(x) = \theta^\top x$. This is linear regression, and the update rule is $\theta \leftarrow \theta + \alpha (y - \theta^\top x)x$, the same one we got earlier when deriving least squares.
- **Bernoulli**: $a'(\eta) = 1/(1+e^{-\eta})$, so $h_\theta(x) = 1/(1+e^{-\theta^\top x})$. This is logistic regression. If you wondered before why the sigmoid has that shape, here is one answer: assume y is Bernoulli, follow the three GLM decisions, and the sigmoid is a result rather than a choice.

### Following the recipe once: Poisson regression

What follows is an example made up for this article, not from the lecture. The lecture only mentions that the Poisson suits count data and says the homework will have everyone try different distributions. The scenario is borrowed from the opening of Section 3.2 of the notes; the numbers are invented for this article.

Suppose you want to predict how many customers come into a store in a given hour. y is a nonnegative integer, so pick the Poisson:

$$
p(y;\lambda) = \frac{e^{-\lambda}\lambda^{y}}{y!} = \frac{1}{y!}\exp\!\big(y\log\lambda - \lambda\big)
$$

Against the definition: $b(y) = 1/y!$, $T(y)=y$, $\eta = \log\lambda$, $a(\eta) = \lambda = e^{\eta}$. One derivative gives $a'(\eta) = e^{\eta} = \lambda$, the Poisson mean; a second derivative is still $\lambda$, the Poisson variance. Both are right.

So the model is $h_\theta(x) = e^{\theta^\top x}$, and the update rule carries over as is. One step with numbers:

- Current parameters $\theta = (0.5,\ 0.2)$, one example $x = (1,\ 2)$ (the first dimension is the constant term), $y = 4$ customers actually came, learning rate $\alpha = 0.05$.
- $\eta = 0.5 \times 1 + 0.2 \times 2 = 0.9$, prediction $h = e^{0.9} \approx 2.460$.
- Error $y - h \approx 1.540$.
- Update: $\theta \leftarrow (0.5 + 0.05 \times 1.540 \times 1,\ 0.2 + 0.05 \times 1.540 \times 2) = (0.577,\ 0.354)$.
- New $\eta = 0.577 + 2 \times 0.354 = 1.285$, new prediction $e^{1.285} \approx 3.615$.

The prediction moves from 2.46 customers to 3.62, closer to the actual 4. The log-likelihood of this example, $y\eta - e^{\eta} - \log y!$, also rises from $-2.038$ to $-1.653$ (the ceiling, when the prediction is exactly 4, is $-1.633$). Nothing new was derived for the Poisson along the way. We only looked up its $a(\eta)$.

## Multi-class classification: softmax

(Recording 37:00–57:27)

### Representing labels and predictions

The task is to choose among k discrete values. The lecturer uses four short words as classes: cat, dog, car, bus. Labels are encoded as one-hot vectors: cat is $e_1 = (1,0,0,0)$, dog is $e_2$, car is $e_3$, bus is $e_4$.

A prediction is a probability distribution over these four classes. Because one-hot vectors are mutually orthogonal, a distribution can be written as a weighted sum of them. The lecturer's example is $(0.5,\ 0.3,\ 0.1,\ 0.1)$: cat with probability 0.5, dog 0.3, car and bus 0.1 each. Logistic regression does the same thing, except that with two classes the probabilities sum to 1, so writing one number is enough.

### The softmax formula

Each class has its own set of parameters $\theta_j \in \mathbb{R}^{d+1}$, the same dimension as x. The inner product $\theta_j^\top x$ is a scalar; the lecturer calls it the raw score, and the notes call it the logit. The probability is:

$$
p(y = i \mid x;\theta) = \frac{\exp(\theta_i^\top x)}{\sum_{j=1}^{k} \exp(\theta_j^\top x)}
$$

Why not use the scores as probabilities directly? Section 2.3 of the notes names two problems: scores do not necessarily fall between 0 and 1, and they do not necessarily sum to 1. Taking exp makes every term positive, and dividing by the total makes them sum to 1. The lecturer calls this process a bake off: every class brings its own score to the comparison.

A student asks about dimensions (54:24). The lecturer spells out the types: x is the feature vector of one example, not the whole data matrix; each $\theta_j$ has the same dimension as x; $\theta_j^\top x$ is a scalar. The more features there are, the more parameters each class has to learn.

### The geometric picture: one hyperplane per class

(Recording 41:01–45:08, 50:13–52:18)

The lecturer draws four clusters of points in the plane, well separated, and says real data is never this clean. For the cat class, draw the line $\theta_1^\top x = 0$. In a high-dimensional space this line is a hyperplane. A few things that are easy to get wrong:

- $\theta_1$ does not lie on this line. It is the line's normal vector, pointing toward the "more cat-like" side.
- Moving along the direction of $\theta_1$, you cross the parallel lines $\theta_1^\top x = 1$, $\theta_1^\top x = 2$, and so on, in order. The lecturer calls them level sets: points on the same line have the same cat score.
- Every class has one such line and one direction. A point's score for a class is which of that class's level sets it falls on.

The lecturer's example point: a certain cat falls on the line $\theta_1^\top x = 1$, so its cat score is 1; it is on the negative side of the dog line, with a dog score of $-2$.

In some regions two classes both give positive scores, and softmax has to settle which is higher. The lecturer explains what exp buys here (47:09): if a point is far from some class and its score is $-5$, then $e^{-5}$ is a tiny number (about 0.0067), and that class takes almost no probability. The exponential crushes far-away classes, and only nearby classes end up sharing probability in any meaningful way.

A student asks (46:09): is each line its own logistic regression? The lecturer says that is the right direction but not quite, because each class's probability is normalized together with all the other classes.

### A numerical example

At 53:21 the lecture has a slide with a numerical example. The lecturer moves through it quickly and does not read out all the numbers. The following is an example made up for this article: the cat and dog scores reuse the 1 and $-2$ the lecturer gives verbally, and the car and bus scores are added by this article.

| Class | Score $\theta_j^\top x$ | exp | Probability |
|---|---|---|---|
| cat | 1 | 2.7183 | 0.628 |
| dog | −2 | 0.1353 | 0.031 |
| car | 0.1 | 1.1052 | 0.255 |
| bus | −1 | 0.3679 | 0.085 |
| Total | | 4.3267 | 1.000 |

The computation: take exp of each score, add the four to get 4.3267, and divide each by that total. For cat: $2.7183 / 4.3267 \approx 0.628$.

Two things to notice in this table. First, the relationship between score gaps and probability ratios is exponential: cat scores 0.9 higher than car, and the probability ratio is $e^{0.9} \approx 2.46$; cat scores 3 higher than dog, and the ratio is $e^{3} \approx 20$. Second, no class has probability 0. Even dog, with a score of $-2$, still has 3%. This matters later when we get to training.

### A few questions

**Only linearly separable data can be separated, so isn't this model weak (45:08).** The lecturer restates the student's point more bluntly: "You brought me candy, but you told me nonsense." His answer: that is true in two dimensions, but high-dimensional spaces behave differently. There is far more room, and data is more easily separated linearly. He uses 768 dimensions as an example, saying that as he recalls it is the token vector dimension of GPT-2. He also mentions the idea of kernels: put the data into a higher-dimensional, even infinite-dimensional, space and it is still the same linear story (the public recordings have no lecture devoted to kernels; to read about them, see Chapter 5 of the main notes).

**If I only want one answer, do I have to compute all the probabilities (48:10).** "Inference" in this lecture means computing the whole probability vector. If you only want one output, you can take the class with the highest score. But language models do not actually work that way: they sample from the distribution, which is why asking the same question twice usually gives different answers. The lecturer mentions that the Large Language Monkeys paper he wrote with his students is built on this: if the model were deterministic, asking repeatedly would be pointless. So in multi-class problems, the whole distribution matters more than "the single most likely one."

**What if one image has both a cat and a dog (52:18).** This model cannot handle it, because the classes are mutually exclusive and the output is one distribution over classes. The lecturer says that is a different task and usually calls for a different error model, for example detectors that each answer "is there a cat in this image."

## At k = 2 it reduces to logistic regression

(Recording 57:27–59:30)

It would be odd if the multi-class model did something different from logistic regression at k=2. The lecturer checks this with one slide. With two classes:

$$
p(y=1 \mid x) = \frac{e^{\theta_1^\top x}}{e^{\theta_1^\top x} + e^{\theta_2^\top x}}
$$

Divide the numerator and denominator by $e^{\theta_1^\top x}$ (the same as multiplying by 1, so the value does not change):

$$
p(y=1 \mid x) = \frac{1}{1 + e^{-(\theta_1 - \theta_2)^\top x}}
$$

Let $\theta = \theta_1 - \theta_2$, and this is $1/(1+e^{-\theta^\top x})$. The two hyperplanes merge into one, and the two models give the same probability at every point.

The same thing happens for general k: the probabilities sum to 1, so k classes have only $k-1$ free probability values, and knowing the others tells you the last. An addition in this article, as a direct consequence: add the same vector $c$ to every $\theta_j$, and the numerator and denominator are both multiplied by $e^{c^\top x}$, leaving the probabilities completely unchanged. So one of softmax's k sets of parameters is redundant, and the k=2 case just makes that explicit.

## Training: cross entropy and label smoothing

(Recording 59:30–1:11:45)

### Cross entropy is maximum likelihood

Training is maximum likelihood as before: make the probability of the correct class as large as possible. The lecturer's intuitive version: given an image labeled cat that the model calls a dog, adjust the parameters to pull the cat probability up and push the dog probability down.

Written as a loss function, this is cross entropy. Let the label distribution be $q$ and the model output be $p$:

$$
\ell = -\sum_{i=1}^{k} q_i \log p_i
$$

When the label is one-hot, $q$ is 1 only in the entry for the correct class and the sum has a single term left: $\ell = -\log p_{y}$, the negative log of the correct class's probability. The lecturer says nothing is hidden here. Take the log of the softmax probability and you have it, and it is the thing called cross entropy in libraries such as PyTorch.

With the earlier example: if the correct answer is cat, $\ell = -\log 0.628 \approx 0.465$. If the correct answer is actually dog, $\ell = -\log 0.03128 \approx 3.465$. The lower the probability the model gives the correct answer, the larger the loss. (Losses and gradients in this section are computed from unrounded probabilities and then rounded to three decimals; plugging in the three-decimal values from the table gives slightly different results.)

Although the loss looks only at the correct class's entry, the denominator of that entry contains every class's score, so the gradient flows to every set of parameters. The lecture does not derive the gradient; Section 2.3 of the notes does. Here is the derivation for a general $q$, writing $t_i = \theta_i^\top x$. Substitute $\log p_i = t_i - \log\sum_j e^{t_j}$ and use $\sum_i q_i = 1$:

$$
\ell = -\sum_i q_i t_i + \log \sum_j e^{t_j}
$$

Differentiate with respect to $t_i$. The first term gives $-q_i$, and the second gives $e^{t_i}/\sum_j e^{t_j} = p_i$:

$$
\frac{\partial \ell}{\partial t_i} = p_i - q_i, \qquad \nabla_{\theta_i}\, \ell = (p_i - q_i)\, x
$$

One step of gradient descent is $\theta_i \leftarrow \theta_i + \alpha (q_i - p_i)x$, once again "label minus prediction, times the input," the same shape as the GLM update rule. In the one-hot case $q = e_y$, and this is equations (2.17) and (2.18) of the notes.

The matching shape is no coincidence; what follows is an addition in this article. With a one-hot label, the loss above can be written as $-\eta^\top T(y) + a(\eta)$: take $\eta = (t_1,\dots,t_k)$, let $T(y)$ be the one-hot vector of y, $b(y)=1$, and $a(\eta) = \log\sum_j e^{\eta_j}$. That is, the class distribution softmax produces is itself a member of the exponential family, and the gradient of $a$, $\partial a/\partial \eta_i = p_i$, is exactly the i-th component of $\mathbb{E}[T(y)]$. It is the same fact as "differentiating $a$ gives the expectation" from the first half. The lecture says the multinomial belongs to the exponential family and the whole procedure carries over, but does not carry out this rewriting.

In the example, with the one-hot label cat, $p - q = (-0.372,\ 0.031,\ 0.255,\ 0.085)$. The cat score gets pushed up and the other three get pushed down, each with a force proportional to the probability it currently holds, so car gets pushed down the most.

### Label smoothing

The lecturer then introduces a technique he calls a "surprisingly good idea" (from 1:03:33). Take three classes A, B, C, with A the correct answer. The original label distribution is $(1, 0, 0)$. Label smoothing changes it to $(1-2\varepsilon,\ \varepsilon,\ \varepsilon)$, handing a little probability to the other classes, and then plugs it into the $q$ of cross entropy as usual.

A student answers that this is to avoid overfitting. The lecturer agrees and says it is a form of regularization, a word that will only be taught formally later ([Lecture 6](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization-en)). He gives two reasons:

- Labels can be wrong. Some portion of any dataset is mislabeled, and leaving a little slack in the labels makes the model more honest about that.
- From the training dynamics side, if you train on the same example over and over, the model gets pushed toward whatever is peculiar to that one example. Leaving some uncertainty amounts to keeping it within a small neighborhood of that class.

Back to the four-class example. Take $\varepsilon = 0.05$, so the label becomes $q = (0.85,\ 0.05,\ 0.05,\ 0.05)$ (the numbers below are computed by this article):

$$
\ell = -\big(0.85\log 0.628 + 0.05\log 0.031 + 0.05\log 0.255 + 0.05\log 0.085\big) \approx 0.760
$$

The gradient is $p - q = (-0.222,\ -0.019,\ 0.205,\ 0.035)$. Compared with the one-hot version, two things differ. The upward push on cat is weaker. And the dog entry turns negative, meaning the dog score gets nudged up slightly, because the 3.1% the model gives it is below the 5% the label asks for.

This also shows why it blocks overconfidence. What follows is this article's own reading, and it looks at this one example only. With a one-hot label, the gradient $p - q$ is zero only at $p_{\text{cat}} = 1$, and with finite scores a softmax probability never reaches 1. So as long as you keep training on this example, the score gap between cat and the other classes keeps getting pushed wider. With a smoothed label, the gradient is zero at $p = q$. The loss is convex in the scores ($\log\sum_j e^{t_j}$ is a convex function and the rest is linear), so the point where the gradient is zero is the minimum. There, $p_{\text{cat}}/p_{\text{dog}} = e^{t_{\text{cat}} - t_{\text{dog}}} = 0.85/0.05$, the score gap is a finite $\log 17 \approx 2.83$, and nothing pushes it further out. The loss at that point is not 0 either; it is $-\sum_i q_i \log q_i \approx 0.588$.

The lecturer adds that if you really do have extra information, say you are sure it is a cat or a dog but definitely not a car, you can put that distribution straight into $q$. Label smoothing uses the least informative version, a little for every class, and it already helps. As he puts it: "It's not like it's oh this is the right thing to do. Just a thing you can do."

### Why softmax

A student asks why the exponential: is it to guarantee positive numbers and make the distribution peakier (1:07:43)? The lecturer answers in three layers:

1. It has the properties you want: it varies smoothly between 0 and 1 and lets all the classes compete together.
2. One school of statisticians likes to justify the choice of distribution by maximum entropy, and distributions of this exponential form are the maximum entropy distributions in the discrete case, that is, the ones that assume the least. The lecturer says he does not really buy this argument philosophically.
3. The point he considers most important is numerical convenience. If the loss picked only the top class and gave no signal to the others, those weights would get no gradient, which amounts to throwing information away. Softmax gives every class a nonzero probability; the 3% for dog in the earlier example is what this means.

His conclusion is that softmax is not the only correct choice, but it is convenient and numerically stable, and "you kind of have to justify doing something else instead of it."

## The lecturer's wrap-up

(Recording 1:11:45–1:14:40)

In the last few minutes the lecturer compresses the lecture into three points:

- What we have learned so far is basically a special case of two slides from this lecture: as long as the error distribution can be written as an exponential family, how to do inference and learning is settled.
- Softmax plus cross entropy is the last layer of every large language model today, and most of you have probably used it within the past hour.
- He brings up label smoothing to stress one thing: "your data and model are always a little bit wrong." Machine learning is often about finding approaches that are more robust to noise and mistakes.

## Self-check

**1. Write the exponential distribution $p(y;\lambda) = \lambda e^{-\lambda y}$ ($y \ge 0$) as an exponential family, and use $a(\eta)$ to find its mean.**

Answer: $p = \exp(-\lambda y + \log\lambda)$, so $T(y)=y$, $b(y)=1$, $\eta = -\lambda$, $a(\eta) = -\log\lambda = -\log(-\eta)$. $a'(\eta) = -1/\eta = 1/\lambda$, which is the mean of the exponential distribution. Differentiating again gives $1/\eta^2 = 1/\lambda^2$, the variance. Criterion: $a$ must be written as a function of $\eta$ before you can differentiate it; stopping at $-\log\lambda$ does not count as done.

**2. Why is the stochastic gradient update of every GLM $\theta \leftarrow \theta + \alpha(y - h_\theta(x))x$? Name the two properties of the exponential family the derivation uses.**

Answer: First, y and $\eta$ interact only linearly in the exponent, so differentiating $\log p$ with respect to $\eta$ gives $y - a'(\eta)$. Second, $a'(\eta) = \mathbb{E}[y]$, and a GLM requires the output to be the expectation, so $a'(\theta^\top x) = h_\theta(x)$. On top of that, the chain rule through $\eta = \theta^\top x$ contributes the extra $x$.

**3. Three classes have scores $(2, 0, -1)$ and the correct class is the second. Compute the softmax probabilities and the cross entropy.**

Answer: After exp the values are $(7.389,\ 1,\ 0.368)$, the total is 8.757, and the probabilities are about $(0.844,\ 0.114,\ 0.042)$. Cross entropy is $-\log 0.114 \approx 2.17$. The gradient is $p - q = (0.844,\ -0.886,\ 0.042)$, so the first class's score gets pushed down hard.

**4. Someone says "softmax with two classes has two sets of parameters and logistic regression has only one, so softmax is more expressive." What is wrong with this?**

Answer: The two sets of parameters affect the probability only through the difference $\theta_1 - \theta_2$. After dividing through by $e^{\theta_1^\top x}$ you get the sigmoid. The two models can represent exactly the same probability functions, and the extra set of parameters is redundant.

**5. After switching the label to $(1-2\varepsilon, \varepsilon, \varepsilon)$ and training to the minimum loss, what is the score gap between the correct class and the others? How does this differ from a one-hot label?**

Answer: The minimum is where the gradient $p - q$ is zero, that is, $p = q$. The score gap is $\log\frac{p_1}{p_2} = \log\frac{1-2\varepsilon}{\varepsilon}$; for $\varepsilon = 0.1$, for instance, it is $\log 8 \approx 2.08$. With a one-hot label (looking at this one example only) there is no finite optimal score gap: the wider the gap, the smaller the loss.

## Corresponding reading

- **Main notes Chapter 3, Generalized linear models, pp.30–34**. Section 3.1 (pp.30–32) covers the definition of the exponential family and the Bernoulli and Gaussian rewrites. Section 3.2 (pp.32–34) covers the three GLM assumptions and derives least squares (3.2.1) and logistic regression (3.2.2) from them.
- **Main notes Section 2.3, Multi-class classification, pp.25–27**. The definition of softmax, the cross-entropy loss and its gradient, equations (2.9) through (2.19).

Differences between the lecture and the notes:

- **In the lecture but not in these two parts of the notes**: the first and second derivatives of $a(\eta)$ being the expectation and variance, and the convexity that follows; the aside on the cumulant generating function; the "one update rule for all GLMs" claim; the hyperplane picture of softmax; the check that k=2 reduces to logistic regression; label smoothing; the discussion of why softmax.
- **In the notes but not covered in detail in the lecture**: the reason for setting $\sigma^2 = 1$ for the Gaussian and the dispersion parameter of the general case (p.31, footnote 2); the step-by-step derivations of least squares and logistic regression as GLMs; the formula for the cross-entropy gradient; the distinction between the canonical response function and the canonical link function.
- **Different entry point**: the notes define softmax directly in Section 2.3 without going through the exponential family. The lecture places it after GLMs and says the multinomial is also a member of the exponential family and the whole procedure carries over, but never actually rewrites the multinomial in exponential family form. Neither one does that rewriting.
- **Terminology**: the notes call the three items "assumptions" and say the third is more of a design choice. The lecture does not number them and simply presents them as picking a distribution, setting $\eta = \theta^\top x$, and outputting the expectation. For the term canonical parameter, the lecture means parameters like $\phi$ and $\mu$, and the notes mean $\eta$.

**Series navigation**: Previous: [Lecture 3: maximum likelihood and logistic regression](/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression-en) | Next: [Lecture 5: Gaussian discriminant analysis and Naive Bayes](/posts/ai/2026-10-12-stanford-cs229-lecture-05-gaussian-discriminant-analysis-en)

## Course video sources

Original video: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 4: Exponential Family, GLMs Classification](https://www.youtube.com/watch?v=8gVi4Rk21Eg)

- [Stanford CS229 Machine Learning | Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 course website](https://cs229.stanford.edu/)
- [CS229 main notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

Checked: 2026-10-12.

Content check: verified against the video transcript (2026-10-12): the whole article follows the order and timestamps of the English captions, and every quoted English sentence comes from the captions. I did not see the board or the slides, so the numerical example on the slide (around 53:21) could not be reconstructed and is replaced with numbers made up for this article; the formulas are written following the main notes.

## References

- [Stanford CS229 Spring 2026 Lecture 4 recording (YouTube)](https://www.youtube.com/watch?v=8gVi4Rk21Eg): the basis for the whole article. The order of the lecture, the lecturer's statements, and the Q&A all follow this video's English captions.
- [CS229 main notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf): Chapter 3 (pp.30–34) was used to check the notation for the exponential family and GLMs, the three assumptions, and the definitions of the canonical response and link functions; Section 2.3 (pp.25–27) was used to check the formulas for softmax and the cross-entropy gradient.
- [Stanford CS229 Spring 2026 playlist (Stanford Online)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw): to confirm lecture numbers and video titles.
- [Reading Stanford CS229: course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): the series' positioning of the course and its reading route.
