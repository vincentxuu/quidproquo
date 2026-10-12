---
title: "Bias and Variance, Regularization, and Model Selection: How Complex Should a Model Be? | Stanford CS229 Lecture 6"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, bias-variance, regularization, cross-validation]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 6
tldr: "This lecture splits test error into three terms: noise σ², squared bias, and variance. It then uses the closed-form solution of ridge regression to show how regularization moves each eigenvalue from λ to λ+ρ, trading a little bias for a large cut in variance. The second half covers double descent, ImageNet-V2, and choosing hyperparameters with a dev set, k-fold cross-validation, and successive halving."
description: "A guide to Lecture 6 of Stanford CS229 Spring 2026: overfitting and underfitting, the full derivation of the bias–variance decomposition, ridge regression and the minimum norm solution, double descent, adaptive overfitting, cross-validation, and successive halving, with worked numerical examples made up for this article."
draft: false
math: true
---

> 🌏 [中文版](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization)

**Video status: Videos included.** This article is written from the English captions of the Spring 2026 Lecture 6 recording published by Stanford Online, with notation checked against Chapters 8 and 9 of the 2026 main lecture notes. Captions do not show the board or the slides, so the way the formulas are written here is reconstructed from what the lecturer says and from the notes.

Lecture 6 is the last lecture of [Stanford CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en) before neural networks. The first five lectures (up to [Gaussian discriminant analysis in the previous lecture](/posts/ai/2026-10-12-stanford-cs229-lecture-05-gaussian-discriminant-analysis-en)) all assumed a fixed training set and asked how to fit a model to it. This lecture asks a different question: the training set is itself a sample, so if you drew a different one, how much would the learned model change? The answer to that question is bias and variance.

Chris Ré teaches this lecture. The prerequisites are the normal equation for linear regression, basic manipulation of expectations and variances, and eigendecomposition. After reading, you should be able to derive the bias–variance decomposition yourself, explain from the closed-form solution of ridge regression why regularization lowers variance, and know which data to use when choosing hyperparameters.

```youtube
url: https://www.youtube.com/watch?v=llnEgyyuYkQ
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 6: Dataset Split, ML Advice
captions: en
```

## The question this lecture answers

(Recording 00:00–03:10)

The lecturer opens by compressing the whole lecture into one sentence: given a single finite, noisy sample, how do you pick a model that also does well on new data? We train on the training set and use the model on the test set, and what we want is a procedure that looks only at the training set and still guarantees future performance as far as possible.

The order of the lecture: first look at overfitting and underfitting in pictures, then turn the pictures into math, which is the bias–variance decomposition. Next, handle variance with regularization. Then come two pieces of recent research that the lecturer says he could not resist adding, double descent and ImageNet-V2. Model selection comes last.

The video is titled "Dataset Split, ML Advice", but dataset splitting takes up only about the last five minutes. The body of the lecture is bias and variance plus ridge regression. The lecturer also says outright which half will be on the exam:

> "what's likely to be on your test is the first part of what's going on, not the second part" (00:10:14)

## Underfitting and overfitting in pictures

(Recording 03:10–19:50)

### Setup: the true function is hidden, and we only see samples

Suppose the world contains a true function $h^*$. In the lecture's example it is a quadratic curve. We never see $h^*$ itself, only the data it generates:

$$
y^{(i)} = h^*(x^{(i)}) + \epsilon^{(i)},\qquad \epsilon^{(i)}\sim\mathcal N(0,\sigma^2)
$$

This is where the lecture departs from the earlier ones: the training set is no longer fixed. The lecturer asks the class to imagine drawing three training sets $S^{(1)}, S^{(2)}, S^{(3)}$. The same curve lies underneath all of them, but each one lands on different points, and the noise on each point differs too. Then fit the same kind of model to each of the three and watch how the model changes with the data. An ideal learning procedure would return the same true model no matter which set it received. In practice it cannot, and it fails in two distinct ways.

### A straight line: no sample will make it bend

Fit a straight line first. The three datasets give three slightly different lines, but each one has a clear error. The key point is that this error has nothing to do with sampling: the true function is curved, a line cannot represent curvature, and no number of redraws changes that. The lecturer calls this high bias. The model underfits, and the fix is more degrees of freedom.

### A degree-nine polynomial: a new curve for every dataset

Now fit a high-degree polynomial. The lecturer says the plot on the slide is degree nine and mentions that the notes use degree five (Figure 8.5 in the notes does use degree five). As long as the polynomial has at least as many coefficients as there are data points, it can pass through every point, so the training error is zero. But the three curves obtained from the three datasets look nothing like the same function: at the same $x$, one predicts something huge and another something very small. In the lecturer's words, the model is fitting the noise instead of the signal. This is high variance, or overfitting. Take the function learned on $S^{(1)}$ and test it on $S^{(2)}$, and the error is enormous.

### Even the right model does not reach zero error

When you fit a quadratic, the three curves are close to one another and close to the true curve. There is still error, but it is the error in the data itself: if you are handed a badly drawn training set, the model class is not to blame.

So test-time error has three sources: noise in the data that cannot be removed, bias from a model class that cannot represent the truth, and variance from the model jumping around with the training set. The math that follows separates these three terms. Here the lecturer says:

> "Keep these pictures in your head. All the math is basically just these pictures." (00:11:15)

### The classical U-shaped curve

Put model complexity on the horizontal axis (polynomial degree, number of parameters, size of the hypothesis class). Bias falls as complexity grows, variance rises past a certain point, and their sum, the test error, is U-shaped. For polynomials, let $d^*$ be the degree of the true function. When the degree satisfies $d \ge d^*$, the bias vanishes, because setting the extra high-order coefficients to zero represents the truth. When $d < d^*$ there is bias. When $d$ is far larger than $d^*$, variance grows.

In practice we do not know $d^*$. The approach in the second half of this lecture is to start with a very expressive class and then use regularization to push the effective complexity down.

Along the way the lecturer defines a word that is needed later:

> "Interpolation means the ability to fit the training set with zero loss." (00:14:20)

Interpolation means fitting the training set to zero loss. A high-degree polynomial that interpolates wiggles wildly, yet very large deep networks interpolate the training set and still generalize. The lecturer says this comes from a line of papers on "rethinking generalization" whose senior author is his friend Ben (the captions render the name as "Ben Rex"; it should be Ben Recht). This sets up the double descent section later.

### Two questions from the class

A student asks whether training error reflects bias and test error reflects variance. The lecturer answers that the intuition is roughly right, but test error contains noise in addition to variance, and squared bias also shows up in test error. High training error is mainly bias, and in practice it can also mean the optimization was not done well (recording 16:24–17:24).

Classification shows the same phenomenon. If the decision boundary has many tiny islands, so that nudging a feature slightly flips the class, that is usually a warning sign of overfitting. The lecturer adds that it is only a warning sign: the true class boundary really could look like that, it is just intuitively less likely (recording 17:24–19:50).

## The bias–variance decomposition: splitting test error into three terms

(Recording 19:50–40:53)

### The four steps of the thought experiment

1. Fix a test point $x$. The point is arbitrary, and the argument must not depend on anything special about it.
2. Draw $n$ training examples to form a training set $S$.
3. Train on $S$ to get a hypothesis $h_S$. The lecturer stresses that this need not be linear regression; any hypothesis class works.
4. Draw a fresh observation at the test point, $y = h^*(x) + \epsilon$, and compute the squared error $(y - h_S(x))^2$.

The quantity to analyze is the expectation of this squared error over all the randomness:

$$
\mathrm{MSE}(x) = \mathbb E_{S,\epsilon}\big[(y - h_S(x))^2\big]
$$

There are two sources of randomness here: the draw of the training set $S$, and the noise $\epsilon$ at the test point. They are independent, because the test-point noise is drawn separately after training is finished.

The lecturer spends a good while stressing that $h_S$ is a very complicated random variable. It is the result of drawing an entire training set and then running the training algorithm once, and for a neural network you cannot write down its distribution at all. But the derivation needs only one property of it: its expectation over $S$ is well defined. By contrast, $\epsilon$ is simple, with mean zero and variance $\sigma^2$.

### Step one: split off the noise

Substitute $y = h^*(x) + \epsilon$ and expand the square:

$$
\begin{aligned}
\mathrm{MSE}(x) &= \mathbb E\big[(\epsilon + (h^*(x) - h_S(x)))^2\big] \\
&= \mathbb E[\epsilon^2] + 2\,\mathbb E\big[\epsilon\,(h^*(x) - h_S(x))\big] + \mathbb E\big[(h^*(x) - h_S(x))^2\big]
\end{aligned}
$$

Handle the three terms one at a time:

- $\mathbb E[\epsilon^2] = \sigma^2$. Because $\epsilon$ has mean zero, its second moment is its variance.
- The cross term in the middle is zero. $\epsilon$ and $h_S$ are independent, so the expectation factors into the product $\mathbb E[\epsilon]\cdot\mathbb E[h^*(x) - h_S(x)]$, and $\mathbb E[\epsilon]=0$. This step uses both conditions, independence and zero mean, and fails if either one is missing.
- The third term is left for the next step.

So

$$
\mathrm{MSE}(x) = \sigma^2 + \mathbb E_S\big[(h^*(x) - h_S(x))^2\big]
$$

$\sigma^2$ is the measurement error in the test data itself, and no model, however good, can remove it. A student asks why the test point should have noise too. The lecturer answers that the test data comes from the same process as the training data and is just as unclean. If you want the noise-free case, set $\sigma^2$ to zero and the rest of the derivation is unchanged (recording 28:43–29:43).

### Step two: bring in the average model

Define the "long-run average prediction":

$$
\bar h(x) = \mathbb E_S\big[h_S(x)\big]
$$

It means: train once on every training set of size $n$ that could possibly be drawn, and average their predictions at $x$. This quantity cannot be computed; it is purely a tool for analysis. Note that $\bar h(x)$ is what remains after taking the expectation over $S$, so it is a constant and no longer depends on $S$.

Inside the second term, add one $\bar h(x)$ and subtract one $\bar h(x)$:

$$
h^*(x) - h_S(x) = \underbrace{\big(h^*(x) - \bar h(x)\big)}_{\text{constant}} + \underbrace{\big(\bar h(x) - h_S(x)\big)}_{\text{varies with } S}
$$

Square it and take the expectation:

$$
\mathbb E_S\big[(h^* - h_S)^2\big] = (h^* - \bar h)^2 + 2\,(h^* - \bar h)\,\mathbb E_S[\bar h - h_S] + \mathbb E_S\big[(\bar h - h_S)^2\big]
$$

In the cross term, $(h^* - \bar h)$ is a constant and can be pulled out of the expectation. What is left is $\mathbb E_S[\bar h - h_S] = \bar h - \mathbb E_S[h_S] = 0$, which follows directly from the definition of $\bar h$. The last term is exactly the variance of $h_S(x)$. Putting it together:

$$
\mathrm{MSE}(x) = \underbrace{\sigma^2}_{\text{noise}} + \underbrace{\big(h^*(x) - \bar h(x)\big)^2}_{\text{bias}^2} + \underbrace{\mathbb E_S\big[(h_S(x) - \bar h(x))^2\big]}_{\text{variance}}
$$

The notes package these two "the cross term is zero" steps into one lemma (Claim 8.1.1): when $A$ and $B$ are independent and $\mathbb E[A]=0$, $\mathbb E[(A+B)^2] = \mathbb E[A^2] + \mathbb E[B^2]$. The lecture does not state it as a lemma and simply expands twice.

### What each of the three terms says

- **Squared bias**: how far the average model is from the truth. No individual training set appears in the expression. It is a property of the model class and the training procedure. A straight line that cannot fit a parabola is this term.
- **Variance**: how far a single trained model is from the average model. A high-degree polynomial that jumps around whenever the data changes is this term.
- **Noise**: the part nobody can do anything about.

The decomposition does not require $h^*$ to lie in our hypothesis class. A student asks about this, and the lecturer says the cost of choosing the wrong class is paid by the bias term, while the derivation itself is unaffected (recording 23:34–25:37).

There are three more points that are easy to misread, and someone in the class asked about each:

**$\bar h$ is not "pool all the data and train once".** It is the average of many models, each trained on $n$ examples. The two can coincide, but nothing guarantees it. The lecturer says the property that makes them coincide is called consistency (recording 37:52). The notes say that in many cases $\bar h$ approximates the model trained on infinitely many examples.

**What is $\bar h$ when you fit a line to quadratic data?** The lecturer's answer: if the truth is $ax^2 + bx + c$, the average line is roughly $bx + c$ plus a constant shift (recording 38:52). The numerical example in the next section shows this constant.

**This derivation holds only for regression with squared loss.** The lecturer says classification and other settings have similar decompositions, but none is proved in class (recording 36:51). The notes are more cautious: several bias–variance decompositions have been proposed for classification, and there is currently no agreed form.

## Working it out once: three training points, three models

The following example is made up for this article and is not from the lecture. It is here to turn the three terms above into actual numbers. To keep it computable by hand, the $x$ values of the training points are fixed and not sampled, and only the noise is random. In the lecture's setup, the $x$ values are drawn as well.

**Setup.** The true function is $h^*(x) = x^2$. The training set always uses the three points $x = -1, 0, 1$, with observations $y_i = x_i^2 + \epsilon_i$, that is, $y_1 = 1 + \epsilon_1$, $y_2 = \epsilon_2$, $y_3 = 1 + \epsilon_3$. The three noise terms are independent, each with variance $\sigma^2$. The test point is $x = 0.5$, where the true value is $h^*(0.5) = 0.25$.

**Predictions of the three models at $x=0.5$.** Every least-squares solution is a linear combination of $y_1, y_2, y_3$, so the prediction can be written as $w_1 y_1 + w_2 y_2 + w_3 y_3$.

- Constant model: the least-squares solution is the mean, so the prediction is $\tfrac13(y_1 + y_2 + y_3)$, with weights $(\tfrac13, \tfrac13, \tfrac13)$.
- Straight line: the three $x$ values are symmetric about zero, so the intercept is $\tfrac13(y_1+y_2+y_3)$ and the slope is $\tfrac12(y_3 - y_1)$. The prediction at $x=0.5$ is the intercept plus $0.5$ times the slope, with weights $(\tfrac13 - \tfrac14,\ \tfrac13,\ \tfrac13 + \tfrac14) = (\tfrac1{12}, \tfrac13, \tfrac7{12})$.
- Quadratic polynomial: three coefficients for three points, so it interpolates exactly. By the Lagrange interpolation formula, the weights at $x=0.5$ are $(-\tfrac18, \tfrac34, \tfrac38)$.

**Average model and bias.** Taking the expectation over the noise, $\mathbb E[y] = (1, 0, 1)$, so $\bar h(0.5) = w_1 + w_3$:

- Constant: $\tfrac23$, squared bias $(0.25 - 0.6667)^2 = 0.1736$.
- Line: $\tfrac1{12} + \tfrac7{12} = \tfrac23$, and the squared bias is again $0.1736$. The average line has slope zero and intercept $\tfrac23$, which is the lecturer's "$bx + c$ plus a constant": here $b = c = 0$, and the constant is the average of $x^2$ over the three training points.
- Quadratic: $-\tfrac18 + \tfrac38 = 0.25$. The bias is zero, because the truth is in the class.

**Variance.** The random part of the prediction is $w_1\epsilon_1 + w_2\epsilon_2 + w_3\epsilon_3$, with variance $\sigma^2(w_1^2 + w_2^2 + w_3^2)$:

- Constant: $\sigma^2 \cdot \tfrac13 = 0.3333\,\sigma^2$
- Line: $\sigma^2 \cdot \tfrac{1 + 16 + 49}{144} = 0.4583\,\sigma^2$
- Quadratic: $\sigma^2 \cdot \tfrac{1 + 36 + 9}{64} = 0.7188\,\sigma^2$

**Totals.**

| Model | Squared bias | Variance (σ² = 0.25) | Test error (σ² = 0.25) | Variance (σ² = 1) | Test error (σ² = 1) |
|---|---|---|---|---|---|
| Constant | 0.1736 | 0.0833 | 0.5069 | 0.3333 | 1.5069 |
| Line | 0.1736 | 0.1146 | 0.5382 | 0.4583 | 1.6319 |
| Quadratic | 0 | 0.1797 | 0.4297 | 0.7188 | 1.7188 |

Test error is the sum of three terms: the noise $\sigma^2$, the squared bias, and the variance. I also checked these with four hundred thousand simulation runs, and all six numbers agree to within the second decimal place.

**What the result means.** When the noise is small ($\sigma^2 = 0.25$), the quadratic model is best: it has no bias, and it can afford the extra variance. When the noise is large ($\sigma^2 = 1$), the ranking flips completely, and the dumbest model, the constant, beats the "correct" quadratic. With only three points, the quadratic's variance of $0.72$ far exceeds the $0.17$ of bias it saves. The line loses to the constant in both cases: at this test point it removes no bias at all and only adds variance.

So "how complex should the model be" has no answer apart from the amount of data and the noise level. Even a model class that contains the truth is not guaranteed to be the best one. This is also why the lecturer brings in regularization next: instead of choosing among a few discrete model classes, make complexity something you can tune continuously.

## The dev set and the idea of regularization

(Recording 40:53–43:55)

The decomposition points in two directions.

First, the combined effect of bias and variance can be measured experimentally. Hold out a separate random sample of the data, do not train on it, and use it only to tune parameters and compare approaches. This is called the dev set or holdout set. It lets you estimate test error without touching the test set.

Second, variance is usually reduced with regularization, at the cost of a little more bias. Because test error is a sum of three terms, the trade pays off whenever squared bias rises by less than variance falls. The lecturer states the general rule in one sentence:

> "You trade a little bit of bias for a big variance reduction." (00:40:53)

Regularization also has a Bayesian reading: it writes prior knowledge into the problem, for example "I know this line is not very steep", which amounts to saying that the components of $\theta$ should not be too large on average.

## Ridge regression: watching the bias-for-variance trade on the eigenvalues

(Recording 43:55–57:00)

### The objective and its two extremes

Ridge regression adds a penalty term to the least-squares objective. The captions do not show the constants on the slide, so what follows uses the form that makes the derivation cleanest:

$$
J(\theta) = \tfrac12\lVert X\theta - y\rVert^2 + \tfrac{\rho}{2}\lVert\theta\rVert^2,\qquad \rho > 0
$$

The penalty term sits outside the sum over the data and is counted once. The lecture uses $\rho$ for the regularization strength because $\lambda$ is reserved for eigenvalues. Chapter 9 of the notes uses $\lambda$ as the regularization parameter, so watch for this when comparing.

The intuition: $\theta$ is allowed to grow, but only if it is worth it, meaning it must make the fit to the data much better. At $\rho = 0$ this reduces to ordinary least squares. When $\rho$ is extremely large, the objective cares only about the penalty, and the best thing to do is predict zero. Somewhere in between is the most suitable value, and it depends on the data and is hard to know in advance, so $\rho$ has to be chosen from the data. Choosing it is called hyperparameter optimization, covered in the last section.

A student asks why penalize the size of the coefficients and not something else. The lecturer says the form of the penalty is a modeling choice: you can ask for sparsity or use a different norm, and there is no right or wrong. The square is chosen because the math is cleanest and because it is common in practice: both weight decay and dropout in deep learning can be read as some form of $L_2$ regularization (recording 43:55–45:57). Section 9.1 of the notes has a one-line derivation of weight decay: run gradient descent on the regularized loss, and in the lecture's notation the update is $\theta \leftarrow (1 - \rho\eta)\theta - \eta\nabla J(\theta)$ (here $J$ is the loss without the penalty term). Each step first multiplies the weights by a factor smaller than 1, which is where the name comes from.

### Fewer examples than dimensions: the penalty picks the minimum norm solution

Let $X \in \mathbb R^{n\times d}$ with $n < d$, fewer examples than dimensions. Then $X^\top X$ is not full rank, and $X$ has a nontrivial null space. Take any vector $v$ in the null space. Then $Xv = 0$, so

$$
X(\theta + v) = X\theta + Xv = X\theta
$$

$\theta$ and $\theta + v$ make exactly the same predictions on the training data and have the same loss. There are infinitely many optimal solutions, so which one should we pick?

Split any solution into two orthogonal parts: $\theta = \theta_0 + v$, where $v$ lies in the null space and $\theta_0$ lies in the directions orthogonal to it. When two vectors are orthogonal, their squared norms simply add (expand the inner product, and the cross term $2\theta_0^\top v = 0$):

$$
\lVert\theta_0 + v\rVert^2 = \lVert\theta_0\rVert^2 + \lVert v\rVert^2
$$

$v$ contributes nothing to the fit yet costs a penalty of $\lVert v\rVert^2$, so the optimal solution sets $v$ to zero. The penalty term does not need to know which direction the null space lies in. It automatically squeezes out every useless component: within that whole family of solutions with identical predictions, the one that remains is the one with the smallest norm. In the lecturer's words, the penalty forces us to pick the minimum norm solution. He also notes that the Moore–Penrose pseudoinverse picks the minimum norm solution too, with the derivation in the appendix of the slides.

One detail to add (an addition in this article): when $\rho > 0$, the penalty also pulls $\theta_0$ a little toward zero. The lecturer's own words are "shrink theta 0 a little bit". So the ridge solution is not exactly the smallest-norm solution among the zero-error ones. The smaller $\rho$ is, the closer the two are, and only the limit $\rho \to 0$ gives it exactly. The small example below shows this.

A small example made up for this article: a single data point $x = (1, 1)$, $y = 2$, and two parameters. Every $\theta$ satisfying $\theta_1 + \theta_2 = 2$ has zero error and can be written as $(1,1) + t\,(1,-1)$, with squared norm $2 + 2t^2$, which is smallest at $t = 0$. The minimum norm solution is $(1, 1)$. The ridge solution is $\tfrac{2}{2+\rho}(1,1)$: at $\rho = 1$ it is $(0.667, 0.667)$, at $\rho = 0.1$ it is $(0.952, 0.952)$, and as $\rho \to 0$ it approaches $(1,1)$. It never picks up any component in the $(1,-1)$ direction.

### The closed-form solution and the eigenvalue shift

Take the gradient of $J(\theta)$ and set it to zero:

$$
\nabla J(\theta) = X^\top(X\theta - y) + \rho\,\theta = 0 \quad\Longrightarrow\quad (X^\top X + \rho I)\,\theta = X^\top y
$$

The gradient of the penalty term is just $\rho\theta$, and after rearranging it becomes exactly $\rho I$ added to $X^\top X$. So

$$
\hat\theta = (X^\top X + \rho I)^{-1} X^\top y
$$

Does the inverse always exist? Let the eigenvalues of $X^\top X$ be $\lambda_1, \dots, \lambda_d$. Adding $\rho I$ does not change the eigenvectors. It only shifts each eigenvalue to $\lambda_i + \rho$. Here the lecturer asks the class which property is being used, and the answer is that $X^\top X$ is positive semidefinite, so $\lambda_i \ge 0$. A nonnegative number plus a strictly positive $\rho$ is strictly positive, so the matrix is full rank and invertible.

### Variance is paid on the small eigenvalues

The lecturer covers this part verbally without writing out the full expressions (he says the eigenvalue term in the variance changes from $1/\lambda_i$ to the ridge version). The expressions below are a derivation I filled in following the lecture's setup.

Assume $y = X\theta^* + \epsilon$, where the noise components are independent with variance $\sigma^2$, and treat $X$ as fixed. Substitute into the closed-form solution:

$$
\hat\theta = (X^\top X + \rho I)^{-1}X^\top X\,\theta^* + (X^\top X + \rho I)^{-1}X^\top\epsilon
$$

The first term is deterministic. The second is the noise multiplied by a fixed matrix $A = (X^\top X + \rho I)^{-1}X^\top$. The covariance matrix of a fixed matrix times the noise vector is $\sigma^2 AA^\top$, which is the computation the lecturer describes as taking a random variable times a matrix and working out the covariance.

Next, switch to eigenvector coordinates. Write $X^\top X$ as $Q\Lambda Q^\top$, where the columns of $Q$ are mutually orthogonal unit eigenvectors and $\Lambda$ is the diagonal matrix with $\lambda_1,\dots,\lambda_d$ on its diagonal. Because $I = QQ^\top$, we have $X^\top X + \rho I = Q(\Lambda + \rho I)Q^\top$, whose inverse is $Q(\Lambda + \rho I)^{-1}Q^\top$. Substituting back:

$$
(X^\top X + \rho I)^{-1}X^\top X = Q\,(\Lambda + \rho I)^{-1}\Lambda\,Q^\top,\qquad AA^\top = Q\,(\Lambda + \rho I)^{-1}\Lambda\,(\Lambda + \rho I)^{-1}\,Q^\top
$$

Everything sandwiched in the middle is diagonal, and the $i$-th diagonal entries are $\lambda_i/(\lambda_i+\rho)$ and $\lambda_i/(\lambda_i+\rho)^2$ respectively. So once you work in eigenvector coordinates, that is, look at the $i$-th components of $Q^\top\hat\theta$ and $Q^\top\theta^*$ (written simply as $\hat\theta_i$ and $\theta^*_i$ from here on), the covariance between directions is zero and each direction can be examined on its own:

$$
\mathbb E[\hat\theta_i] = \frac{\lambda_i}{\lambda_i + \rho}\,\theta^*_i,\qquad \mathrm{Var}(\hat\theta_i) = \sigma^2\,\frac{\lambda_i}{(\lambda_i + \rho)^2}
$$

Setting $\rho = 0$ gives ordinary least squares: the expectation equals $\theta^*_i$ (unbiased), and the variance is $\sigma^2/\lambda_i$.

The trouble is with small eigenvalues. A very small $\lambda_i$ means that moving $\theta$ a long way along that eigenvector barely changes the loss, so the data places no constraint on that direction. $\lambda_i = 0$ is the worst case, where the whole direction has no effect on the loss at all. In that situation $\sigma^2/\lambda_i$ is large. The lecturer's numbers: when $\lambda_i = 10^{-10}$, solving for $\theta$ multiplies by $10^{10}$, so a tiny change in $X^\top X$ is amplified ten billion times at the output. After adding $\rho = 0.1$, $0.1 + 10^{-10}$ is effectively $0.1$, and the amplification factor becomes 10 (recording 55:16–56:19).

The effect is there even when $X^\top X$ is full rank. The lecturer asks the class: between eigenvalues that are all equal and one large with one small, which case has more variance? The answer is the one with the big gap, that is, the poorly conditioned case (recording 53:15).

**Numerical example (made up for this article).** Two parameters. The eigenvalues of $X^\top X$ are $\lambda_1 = 4$ and $\lambda_2 = 0.01$, $\sigma^2 = 1$, and the true parameter in eigenvector coordinates is $\theta^* = (1, 1)$.

Variance under ordinary least squares: direction one $1/4 = 0.25$, direction two $1/0.01 = 100$. There is no bias, so the expected squared distance from $\hat\theta$ to $\theta^*$ is $100.25$, almost all of it from direction two.

Take $\rho = 0.1$:

- Direction one: shrinkage factor $4/4.1 = 0.976$, squared bias $(0.024)^2 = 0.0006$; variance $4/4.1^2 = 0.238$.
- Direction two: shrinkage factor $0.01/0.11 = 0.091$, squared bias $(0.909)^2 = 0.826$; variance $0.01/0.11^2 = 0.826$.

Total squared bias $0.827$, total variance $1.064$, expected squared distance $1.891$.

For $0.83$ of bias, variance drops from $100.25$ to $1.06$, and the total error becomes roughly one fiftieth of what it was. The two directions are affected very differently: direction one, which the data constrains well, barely moves, while direction two, which the data cannot constrain, is squeezed to 9% of its original value. What ridge does is give up on estimating the directions the data cannot speak to and lean toward zero there. The cost is visible as well: the true value in direction two is 1, and the estimate averages only 0.09. If the true value in that direction were large, the trade would not pay, which is why $\rho$ has to be chosen from the data.

## Other regularization techniques and how to choose ρ

(Recording 57:00–1:02:23)

This part is a practical discussion strung together from several questions.

**Where the constants come from.** A student asks whether $\rho$ is like one of those small constants such as $10^{-5}$. The lecturer says many values of this kind were tuned empirically, and jokes about the "Karpathy constant" before correcting himself: that one is actually the step size for Adam, not a regularization strength. He goes on to say these small constants also have a numerical reason. When a linear system has a high condition number, small changes in the input get amplified, and the floating-point precision used in machine learning keeps getting lower, so instabilities accumulate. Adding a small constant sidesteps the precision problem and adds a little bias on the side.

**How statistics and machine learning differ in attitude.** The lecturer says statisticians set the regularization term very carefully. For example, Trevor Hastie's series of papers on the Lasso path works out precisely how the model changes under $L_1$ regularization. On the machine learning side:

> "Machine learning, we don't really care. If I'm honest, we're just like, yeah, that sounds good." (00:58:21)

**Other regularization techniques.** Randomly setting some values to zero during training (dropout), perturbing the data (data augmentation), dividing things down when the values get too large (LayerNorm). The lecturer's summary is that anything that stops the model from trusting a single data point too much can usually be read as regularization and analyzed in the same bias–variance framework. He uses his own data augmentation paper as an example: a photo of a cat rotated a little or zoomed in a little is still a cat, and these augmentations keep the model from fitting noise.

**How to choose ρ.** Rules of thumb mostly do not help, because they assume the features are all on the same scale. The lecturer says data standardization and whitening will wait for the lecture when he returns in two weeks. In practice you try several values and see which one generalizes well:

> "The existence of the dev set is much more trusted by engineers than any amount of math in this space." (01:00:21)

**Penalties with a norm below 1?** Traditionally people use the 1-norm because it is convex. What they really want is the 0-norm, which counts the nonzero entries. The lecturer says sparse recovery was a hot topic fifteen years ago and every variant has been studied thoroughly.

At this point the lecturer skips the Bayesian derivation of regularization and says it is in the notes (Section 9.4).

## Double descent: past the interpolation threshold, test error falls again

(Recording 1:02:23–1:05:40)

The classical story says test error must rise once complexity passes a certain point, and a high-degree polynomial interpolating 15 points should be a disaster. But the models trained over the last decade often have far more parameters than training examples. They memorize the training set completely and still generalize better than anything else. In the lecturer's words:

> "this puzzle for practitioners was not, how do we avoid overfitting, like I told you, but why aren't we overfitting." (01:02:23)

The lecturer presents a paper with Misha Belkin as first author, whose results were obtained in a kernel-method setting (he says kernels will be taught later and you do not need to understand them here). Put model capacity on the horizontal axis and test error on the vertical axis. The left half is the classical U shape. But as capacity keeps growing, past the threshold where the model can just barely interpolate the training set and into the heavily overparameterized regime, test error starts to fall again. The curve descends twice, hence the name double descent. The lecturer says the phenomenon is observed in neural networks and can be proved in certain settings.

The explanation given in class is short: when the model is overparameterized there are many zero-loss solutions, and the optimizer picks a smooth one among them. The lecturer calls this the implicit bias of the optimizer. It takes over the role that explicit regularization used to play, and he says you can already see it in least squares: solve with the pseudoinverse, or solve with SGD, and either one selects a particular solution (he says this while circling back to summarize after the ImageNet-V2 discussion, recording 1:09:36).

This connects back to the null space from earlier. When $n < d$ there are infinitely many zero-error solutions, and they differ only in the null-space component $v$. The minimum norm solution is the one with $v = 0$. Section 8.2 of the notes makes this more concrete: for a linear model with $n \ll d$, gradient descent initialized at zero converges to the minimum norm solution; the peak in test error appears near $n \approx d$, and tuning the regularization strength to its optimum can flatten that peak substantially. The lecture does not mention where the peak is, and it does not cover the sample-wise double descent in the notes.

The lecturer stresses that this section is not on the exam. What he wants to convey is that machine learning is still a long way from "solved": a 2018 paper was still rewriting how people understand basic questions.

## Adaptive overfitting and ImageNet-V2

(Recording 1:05:40–1:10:37)

Another worry comes from a training in statistics. A public benchmark gets tested again and again by an entire community. Nobody trains on the test set directly, yet through the choices made in paper after paper, information about the test set may leak back into the methods without anyone noticing. The lecturer draws an analogy with drug trials: he says John Ioannidis at Stanford pushed for preregistration of drug trials precisely to stop people from massaging the data toward the conclusion they want (p-hacking). In machine learning the question becomes: are the models that rank well on ImageNet actually good, or have they merely adapted to this particular test set? This is called adaptive overfitting.

The study the lecturer presents (he mentions Ben and Ludwig Schmidt among the authors, Ben being the same person as before) went back ten years later and, following the original procedure as closely as possible, recollected and cleaned a new ImageNet test set, then retested the models from over the years. The result was that every model's accuracy dropped, by 11 percentage points according to the lecturer, and by almost the same amount for each. Plot original test accuracy against new test accuracy as a scatter plot, and the models fall on a line with their relative ranking unchanged.

The lecturer reads this at two levels. The overall drop is not mysterious; building the two test sets differently is enough to cause it. What matters is that the ranking did not change. Competition on ImageNet was so intense that, he says, people even at large companies were banned for cheating (his words are "getting banned for cheating"). Even so, the conclusions about which model is better than which still hold, and adaptive overfitting turned out to be less severe in this case than feared. He also cautions that this does not mean you can do whatever you like with the data: adaptive overfitting does happen elsewhere.

## Model selection: the dev set, k-fold cross-validation, and successive halving

(Recording 1:10:37–1:15:50)

With less than six minutes of class left, this part goes by quickly. There is no time for the analysis of k-fold cross-validation promised at the start.

### Why you cannot choose by training error

The basic procedure: you have a set of candidate models (for example, different values of $\rho$). Train each one on the training set, score it on the dev set, and pick the one with the best dev score. The lecturer says he cares about only one question: why not just pick the one with the lowest training error? A student gets it right: the most expressive model can drive training error to zero, so choosing by training error always picks the most complex one. For ridge, that means always picking $\rho = 0$.

How to split the data is a trade-off. The test set has to be large enough to trust the final number, and the dev set has to be large enough to pick the right hyperparameters. But empirically, the larger the training set the better the model, so people push as much data into the training set as they can. The test set should be treated as something you are not allowed to peek at: every look can leak information and overstate performance.

### k-fold cross-validation

Cross-validation is the data-saving approach. Instead of carving out a large separate dev set, split the training data into several parts, say five, and take turns training on four and predicting the remaining one. Because the data used for scoring never took part in that round of training, the procedure does not lopsidedly pick the most complex model.

The lecture stops there. Section 9.3 of the notes has the full procedure: each of the $k$ parts takes a turn as the validation set, the $k$ validation errors are averaged, the model with the lowest average is chosen, and it is then retrained once on all the data. $k = 10$ is a common choice, and when data is extremely scarce you can use leave-one-out, where $k = n$. The cost is that every candidate model has to be trained $k$ times.

### Successive halving: spend compute on the promising candidates

Cross-validation saves data; successive halving saves compute. At the start of the lecture the lecturer says he will cover Hyperband, but the procedure he actually describes is successive halving (Hyperband is built on top of it):

1. Lay out a set of candidate values for $\rho$, for example spaced by a constant multiplicative factor.
2. Run every candidate for only a small number of steps, score them, and eliminate the worst half.
3. The survivors continue from where they stopped, with the number of steps doubled, then get scored again and halved again.
4. Repeat until one is left.

The animation in class has eight configurations, A through H. After the first round A, C, E, and G remain. The second round runs twice as long, so A's cumulative compute is three times that of B, which was eliminated in the first round. After that A and C remain, and it continues. The total compute in each round is roughly the same, but the share going to the good candidates grows exponentially.

Finishing the arithmetic for the lecture's example (the arithmetic below is added by this article): let each configuration run for 1 unit in the first round. The three rounds cost $8\times1$, $4\times2$, and $2\times4$, for 24 units in total, and the eventual winner has run for $1+2+4 = 7$ units cumulatively. Running all eight configurations for the full 7 units would take 56 units, so successive halving uses only 43% of that. The winner's 7 units can be trained further from there and account for 29% of the total spend. The other 17 units were spent on configurations that were eliminated. When the lecturer mentions this ratio he says "you compute the exact fraction", and the answer is 7/24.

The method rests on the assumption that early scores predict later performance. The lecturer says it has theoretical backing: when the scores satisfy certain properties, this is close to the optimal strategy. His verdict on the method:

> "that simple trick is one that I use all the time" (01:15:49)

## Self-check

**1. In the first step of the bias–variance decomposition, why is the cross term $2\,\mathbb E[\epsilon\,(h^*(x) - h_S(x))]$ zero? If the test point happens to be one of the training examples (with the same noise value), does this step still hold?**

Criteria: you should name two conditions, that $\epsilon$ and $h_S$ are independent (so the expectation factors into a product), and that $\mathbb E[\epsilon] = 0$. If the test observation is the very example that was trained on, $h_S$ was trained using the same $\epsilon$, the two are not independent, and the cross term is not zero. This is exactly why training error underestimates test error.

**2. Using the three-training-point example again ($h^*(x) = x^2$, training points $-1, 0, 1$, $\sigma^2 = 0.25$), change the test point to $x = 0$. Compute the squared bias, variance, and test error of the constant model and of the quadratic model.**

Answer: the true value is $h^*(0) = 0$. The constant model's prediction is still the mean of the three points, $\bar h = \tfrac23$, squared bias $\tfrac49 = 0.444$, variance $0.25/3 = 0.083$, test error $0.25 + 0.444 + 0.083 = 0.778$. The quadratic model interpolates the three points, and $x=0$ is itself a training point, so the prediction is $y_2 = \epsilon_2$, with zero bias, variance $0.25$, and test error $0.5$. The same model has different bias at different test points: the constant model's squared bias at $x=0.5$ is only $0.174$.

**3. $X^\top X$ has an eigenvalue $\lambda = 10^{-4}$, and $\sigma^2 = 1$. Compare the variance and the shrinkage factor in that direction for $\rho = 0$ and $\rho = 0.01$. When is adding this $\rho$ a bad trade?**

Answer: at $\rho = 0$ the variance is $1/10^{-4} = 10^4$, unbiased. At $\rho = 0.01$ the shrinkage factor is $10^{-4}/0.0101 = 0.0099$ and the variance is $10^{-4}/0.0101^2 = 0.98$; the squared bias is $(0.99\,\theta^*)^2 \approx 0.98\,(\theta^*)^2$. Only when $(\theta^*)^2$ is large enough to approach $10^4$ (a true value of roughly 100 or more) does the bias eat up the variance saved.

**4. Someone argues: "Just choose ρ by training error; there is no need to waste data on a dev set." Use the ridge objective to explain why this always selects $\rho = 0$.**

Criteria: the solution at $\rho = 0$ has the smallest training squared error of any $\theta$. Any solution with $\rho > 0$ gives up some fit in order to reduce the norm, so its training error cannot be lower, and choosing by training error always picks $\rho = 0$. (A stronger statement also holds: training error is monotonically nondecreasing in $\rho$, which you can prove by adding the two inequalities saying that each of two different $\rho$ values gives "the minimizer of its own objective".) Training error cannot measure the benefit of reduced variance, so you have to score on data that took no part in training.

**5. You screen 16 configurations with successive halving, running each for 1 unit in the first round and doubling the number of steps each round. How many units are spent in total? How many has the winner run cumulatively? What kind of configuration does this method eliminate by mistake?**

Answer: the four rounds are $16\times1$, $8\times2$, $4\times4$, and $2\times8$, for 64 units in total; the winner has run $1+2+4+8 = 15$ units cumulatively. Running everything for the full 15 units would take 240 units, so only 27% was spent. The configurations eliminated by mistake are the slow starters that catch up late, for example a candidate with a smaller learning rate, which is cut after scoring poorly in the first round.

## Corresponding reading

[CS229 main lecture notes](https://cs229.stanford.edu/main_notes.pdf) (August 2026 version):

- **Chapter 8, Section 8.1 (pp.117–123)**: the bias–variance tradeoff and the mathematical decomposition in 8.1.1, matching the first half of the lecture. The notes use $\xi$ for the noise and $h_{\text{avg}}$ for the average model, where the lecture uses $\epsilon$ and $\bar h$. The overfitting example in the notes is a degree-five polynomial, while the lecture slide is degree nine. The notes organize the two zero cross terms into Claim 8.1.1.
- **Chapter 8, Section 8.2 (pp.123–127)**: double descent. Beyond the lecture, the notes cover sample-wise double descent, the peak appearing at $n \approx d$, optimal regularization flattening the peak substantially, and the discussion of how double descent disappears when complexity is measured by the norm instead of the number of parameters.
- **Chapter 8, Section 8.3 (pp.128–136)**: sample complexity bounds, including the union bound and Hoeffding's inequality for finite hypothesis classes, uniform convergence, and VC dimension. This lecture does not cover this section at all.
- **Chapter 9, Section 9.1 (pp.137–139)**: the general form of regularization $J_\lambda(\theta) = J(\theta) + \lambda R(\theta)$, weight decay, $L_1$ and sparsity. The lecture's ridge closed-form solution, null space, and eigenvalue analysis are not in this section of the notes; they are extra material from the lecture.
- **Chapter 9, Section 9.2 (pp.139–141)**: implicit regularization. The lecture mentions it only in one sentence when wrapping up double descent.
- **Chapter 9, Section 9.3 (pp.141–144)**: the full procedures for hold-out, k-fold, and leave-one-out cross-validation. The lecture gives only the concepts; successive halving, on the other hand, is not in the notes.
- **Chapter 9, Section 9.4 (pp.144–145)**: Bayesian statistics and MAP estimation. The lecturer says explicitly that he is skipping it.

ImageNet-V2 and adaptive overfitting are not in these two chapters of the notes.

**Series navigation**: previous, [Lecture 5: Gaussian discriminant analysis and Naive Bayes](/posts/ai/2026-10-12-stanford-cs229-lecture-05-gaussian-discriminant-analysis-en) | next, [Lecture 7: neural network architecture](/posts/ai/2026-10-12-stanford-cs229-lecture-07-neural-network-architecture-en) | [Course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en)

## Course video sources

Original video: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 6: Dataset Split, ML Advice](https://www.youtube.com/watch?v=llnEgyyuYkQ)

- [Stanford CS229 Machine Learning | Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 course website](https://cs229.stanford.edu/)
- [CS229 main lecture notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

Checked: 2026-10-12.

Content check: verified against the video transcript (2026-10-12): the whole article is written from the complete English captions of this recording, and the time range of each section and every quotation were checked against the captions. The board and the slides were not viewed. The constants in the ridge objective and the variance expressions were reconstructed or filled in from the spoken explanation and the notes, as marked in the text.

## References

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 6: Dataset Split, ML Advice (YouTube)](https://www.youtube.com/watch?v=llnEgyyuYkQ): the primary source for this article. What was said in class, the quotations, and the timestamps all come from the English captions of this video.
- [CS229 main lecture notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf): Chapter 8 (pp.115–136) and Chapter 9 (pp.137–145), used to check notation, to fill in weight decay and the cross-validation procedure, and to write "Corresponding reading".
- [Stanford CS229 Machine Learning | Spring 2026 playlist](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw): used to confirm lecture numbers and video titles.
- [Reading Stanford CS229: course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): the entry point to this series.
