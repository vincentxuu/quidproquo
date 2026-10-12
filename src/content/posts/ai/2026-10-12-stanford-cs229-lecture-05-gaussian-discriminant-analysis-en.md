---
title: "Gaussian Discriminant Analysis and Naive Bayes: Model Each Class First, Then Classify with Bayes' Rule | Stanford CS229 Lecture 5"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, generative-models, gaussian-discriminant-analysis, naive-bayes]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 5
tldr: "Lecture 5 turns classification around: instead of learning p(y|x) directly, it learns p(x|y) and p(y). GDA assumes the two classes are Gaussians with a shared covariance. Maximum likelihood then takes nothing more than counting proportions and averaging, the decision boundary comes out as a straight line, and the posterior is exactly a sigmoid. Naive Bayes uses conditional independence to squeeze 2^d parameters down to 2d+1."
description: "A guide to Lecture 5 of Stanford CS229 Spring 2026: generative versus discriminative learning, the multivariate Gaussian, maximum likelihood for GDA and the derivation of its linear decision boundary, QDA, how GDA relates to logistic regression, Naive Bayes, and Laplace smoothing, with fully worked numerical examples."
draft: false
math: true
---

> 🌏 [中文版](/posts/ai/2026-10-12-stanford-cs229-lecture-05-gaussian-discriminant-analysis)

**Video status: Videos included.** This article is written from the English transcript of the Spring 2026 Lecture 5 recording published by Stanford Online, with formula notation matched to Chapter 4, "Generative learning algorithms," of the 2026 main notes. I did not see the board or the slides, so where the lecturer points at the screen I only include what the surrounding talk lets me reconstruct.

This is Lecture 5 of [Reading Stanford CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en), taught by Chris Ré. The first four lectures, from linear regression and logistic regression through [last lecture's exponential family and GLMs](/posts/ai/2026-10-12-stanford-cs229-lecture-04-exponential-family-glm-en), all learned the same kind of object: the conditional distribution $p(y\mid x)$ of $y$ given $x$. This lecture changes direction for the first time. It models the data of each class first and only then comes back to classify. The prerequisites are Bayes' rule, maximum likelihood estimation, and matrix transposes, inverses, and eigenvalues. By the end you should be able to take a small two-dimensional dataset and compute GDA's four sets of parameters by hand, write down the equation of the decision boundary, and explain why it looks the same as logistic regression and where the two differ.

```youtube
url: https://www.youtube.com/watch?v=zRdE8A4UZes
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 5: Gaussian Discriminant Analysis
captions: en
```

## Discriminative and generative: two ways to tell cats from elephants

(Recording 00:05–09:30)

The lecture's example uses two features, height and weight, to tell cats ($y=0$) from elephants ($y=1$). The lecturer says himself that the data is entirely made up: the plot shows very heavy cats and very light elephants.

Every algorithm so far has been **discriminative**: it models $p(y\mid x)$ directly, which amounts to finding a dividing line in feature space. The advantage is that it saves effort. Whatever odd subgroups the elephants in the upper right have, and however the cats in the lower left are spread out, the model doesn't have to care. It only deals with the region where the two classes come close. In the lecturer's words (06:11):

> If you have two classes that are difficult to distinguish, you're devoting all your horsepower right to that decision boundary.

A **generative** approach takes a different route, in three steps:

1. Look only at cats and learn a distribution $p(x\mid y=0)$ for what a cat's features look like.
2. Look only at elephants and learn $p(x\mid y=1)$.
3. Learn how common each class is in the first place, that is, the prior $p(y)$.

When a new animal $x$ arrives, compare how likely it is under each of the two models and use Bayes' rule to get back to $p(y\mid x)$:

$$
p(y\mid x)=\frac{p(x\mid y)\,p(y)}{p(x)},\qquad p(x)=p(x\mid y=1)p(y=1)+p(x\mid y=0)p(y=0)
$$

If all you want is the most probable class, the denominator $p(x)$ is the same for both classes and can be dropped:

$$
\hat y=\arg\max_y\; p(x\mid y)\,p(y)
$$

It is easy to drop the wrong thing here. At 46:05 the lecturer notices that the slide marks the wrong term as "doesn't depend on $y$, so it cancels" and corrects it on the spot: the term that cancels is $p(x)$. $p(y)$ cannot be dropped, because when there are more cats you should lean toward guessing cat to begin with.

The lecturer also opens by explaining why this seemingly roundabout method is worth learning. He says that when he taught this lecture six or seven years ago, students weren't much interested in generative models because they didn't get the best scores. Now the G in GPT stands for generative, and this route is what has carried most of AI's growth in recent years. This lecture's GDA is the simplest generative model that is still useful.

## From the one-dimensional Gaussian to the multivariate Gaussian

(Recording 09:30–23:40)

GDA describes the features of each class with a Gaussian, so the lecture takes a detour to review Gaussians first.

### One dimension

The density of $z\sim\mathcal N(\mu,\sigma^2)$ is

$$
p(z)=\frac{1}{\sqrt{2\pi}\,\sigma}\exp\!\left(-\frac{(z-\mu)^2}{2\sigma^2}\right)
$$

$\mu$ sets the center and $\sigma$ sets the width. The slide draws three curves for $\sigma=0.5,1,2$; the smaller $\sigma$ is, the sharper the peak. A student explains why the three have different heights: the density has to integrate to 1, so the area is fixed, and a narrower curve has to be taller.

With weight as the only feature, generative classification already works: cats have a low mean weight and elephants a high one, and each gets its own bell curve. Whichever curve is higher at the new animal's weight is the class it looks more like.

### Many dimensions

With $d$ features, $x\in\mathbb R^d$, and the density of $x\sim\mathcal N(\mu,\Sigma)$ is

$$
p(x;\mu,\Sigma)=\frac{1}{(2\pi)^{d/2}\,|\Sigma|^{1/2}}\exp\!\left(-\frac12(x-\mu)^\top\Sigma^{-1}(x-\mu)\right)
$$

$\mu\in\mathbb R^d$ is the mean vector, the center of the distribution. $\Sigma\in\mathbb R^{d\times d}$ is the covariance matrix, and it must be **symmetric** and **positive definite**. The lecture spends a few minutes getting students to state several equivalent ways of saying positive definite:

- For every nonzero vector $z$, $z^\top\Sigma z>0$ (relaxing $>$ to $\ge$ gives positive semidefinite).
- All eigenvalues are positive. Symmetry guarantees that the eigendecomposition exists, and it takes both properties together to make the later steps work.
- Geometrically, the elliptical contours have thickness in every direction; no direction has variance 0. This is the counterpart of "the variance is positive" in one dimension.

Positive definiteness is used in two places in the formula. $|\Sigma|$ is the determinant, equal to the product of all the eigenvalues. Only when every eigenvalue is positive is the product positive, so that you can take its square root. And for $\Sigma^{-1}$ to exist, no eigenvalue can be 0. The lecturer's summary: a zero breaks both places at once.

The $(x-\mu)^\top\Sigma^{-1}(x-\mu)$ in the exponent can be read as a squared distance. It measures how far $x$ is from the center, but scales each direction by how much the data varies in that direction. The lecturer says this quantity has a name you don't need to memorize; it is usually called the Mahalanobis distance (the name is an addition in this article).

### How Σ sets the shape

A one-dimensional Gaussian can only get fatter or thinner. In two or more dimensions there are many more degrees of freedom. The lecture explains this with contour plots, where the density is the same everywhere along each contour:

- $\Sigma=I$: the contours are perfect circles and the dimensions are independent. This is the standard Gaussian.
- $\Sigma$ diagonal: the axes of the ellipse line up with the coordinate axes, and the diagonal entries set how much each direction is stretched. The lecture's example has 3 and 0.5 on the diagonal.
- $\Sigma$ with nonzero off-diagonal entries: the ellipse is rotated. In two dimensions, a positive off-diagonal entry means the two features are positively correlated and the ellipse tilts toward the upper right; a negative one tilts it toward the lower right.
- Changing $\mu$ only translates the distribution; the shape stays the same.

The lecturer calls out one common confusion (20:29):

> Entries can be negative, but the eigenvalues are positive. Positive eigenvalues do not mean that all the entries are positive.

The diagonal entries are each feature's own variance, so they are always nonnegative. The off-diagonal entries can be negative.

The lecturer also goes off on a tangent about something that "won't be on the exam": zeros in the inverse $\Sigma^{-1}$ carry information about independence, and this structure is the foundation of graphical models. He mentions the name of the relevant theorem (usually written Hammersley–Clifford). The lecture puts it loosely, saying only that "two variables are independent." The more precise version is an addition in this article: for a Gaussian, the $(i,j)$ entry of $\Sigma^{-1}$ being 0 is equivalent to $x_i$ and $x_j$ being conditionally independent given all the other variables, while a zero entry in $\Sigma$ itself corresponds to independence when you ignore the other variables.

## The GDA model: two means, one shared covariance

(Recording 23:40–34:45)

The training data is $\{(x^{(i)},y^{(i)})\}_{i=1}^n$ with $x^{(i)}\in\mathbb R^d$ and $y^{(i)}\in\{0,1\}$. GDA assumes the data is generated like this:

$$
y\sim\mathrm{Bernoulli}(\phi),\qquad x\mid y=0\sim\mathcal N(\mu_0,\Sigma),\qquad x\mid y=1\sim\mathcal N(\mu_1,\Sigma)
$$

First flip a biased coin to decide whether this animal is a cat or an elephant (elephant with probability $\phi$), then draw the features from the Gaussian for that class. As densities:

$$
p(y)=\phi^{y}(1-\phi)^{1-y},\qquad
p(x\mid y=k)=\frac{1}{(2\pi)^{d/2}|\Sigma|^{1/2}}\exp\!\left(-\frac12(x-\mu_k)^\top\Sigma^{-1}(x-\mu_k)\right)
$$

There are four sets of parameters to learn: $\phi$, $\mu_0$, $\mu_1$, $\Sigma$. The two classes differ only in their means, and $\Sigma$ is shared, so the two sets of contours have exactly the same shape and orientation, as if one set of ellipses had been copied and pasted onto two centers.

A student objects right away: elephants obviously vary differently from cats, so isn't this assumption unreasonable? The lecturer agrees, and then says it is a modeling choice (27:35):

> But it's a modeling choice. You may decide it's not worth it.

The reason is that covariance matrices are expensive. A symmetric $d\times d$ matrix has $d(d+1)/2$ free parameters, on the order of $d^2$ once $d$ is large, and estimating one per class doubles that. Counting the totals (this article's calculation): logistic regression has $d+1$ parameters and GDA has $1+2d+d(d+1)/2$. For $d=2$ that is 3 versus 8; for $d=100$ it is 101 versus 5,251.

Another student asks: the prior $\phi$ is estimated from the training data, so doesn't this assume the class proportions at test time match those at training time? The lecturer says yes. If the training set has a million cats and one elephant, the model learns to "guess cat for anything near the boundary." If the two classes are half and half at test time, it will label a lot of small elephants as cats. His attitude toward assumptions like this (29:36):

> But again, remember, they're not true or false. They're like, how bad are they?

He uses the moment to point out two questions you should ask every time: what am I assuming stays the same between training and test? How much model capacity am I using, and why?

## Maximum likelihood: count proportions, take averages, and you're done

(Recording 34:45–45:10)

### Writing down the likelihood

A discriminative model maximizes $\prod_i p(y^{(i)}\mid x^{(i)})$. A generative model models the whole world, so it maximizes the **joint** likelihood:

$$
L(\phi,\mu_0,\mu_1,\Sigma)=\prod_{i=1}^n p(x^{(i)},y^{(i)})=\prod_{i=1}^n p(x^{(i)}\mid y^{(i)})\,p(y^{(i)})
$$

The first equality can be written as a product because of the assumption that the data is independent and identically distributed (IID). The second equality is just the product rule of probability; it always holds and needs no extra assumption. Taking the log turns the product into a sum:

$$
\ell=\sum_{i=1}^n\log p(x^{(i)}\mid y^{(i)};\mu_0,\mu_1,\Sigma)+\sum_{i=1}^n\log p(y^{(i)};\phi)
$$

Each sum handles its own parameters: $\phi$ appears only in the second term, and $\mu_0,\mu_1,\Sigma$ appear only in the first. Because of this separable structure, you can differentiate $\ell$ with respect to each set of parameters on its own, set the derivative to 0, and solve directly, with no gradient descent. The lecturer says this is not a general property of Gaussian models, but GDA happens to have it, and in the past people often chose generative models precisely because they were cheap to compute.

### The four answers

$$
\phi=\frac1n\sum_{i=1}^n 1\{y^{(i)}=1\},\qquad
\mu_k=\frac{\sum_{i=1}^n 1\{y^{(i)}=k\}\,x^{(i)}}{\sum_{i=1}^n 1\{y^{(i)}=k\}}\quad(k=0,1)
$$

$$
\Sigma=\frac1n\sum_{i=1}^n\bigl(x^{(i)}-\mu_{y^{(i)}}\bigr)\bigl(x^{(i)}-\mu_{y^{(i)}}\bigr)^\top
$$

$1\{\cdot\}$ is the indicator function, 1 when the condition holds and 0 otherwise. In plain words: $\phi$ is the fraction of elephants; $\mu_0$ is the average of all the cats' features and $\mu_1$ the average of all the elephants'; $\Sigma$ takes each data point minus the mean of **its own class**, sums up all the outer products, and divides by $n$. Data from both classes is combined to estimate a single $\Sigma$, which is what "pooling" means. The lecturer's comment on the formula for $\mu_k$ (37:51):

> This is a most obfuscated way you've ever seen to compute the average.

### Walking through the derivation of μ₁

The lecture derives only $\mu_1$ and explains why: you could guess the answer, but the routine of "write the likelihood, differentiate, set to 0, solve" gets used again and again in more complicated models later, and the homework will ask you to do it.

The only part of $\ell$ that involves $\mu_1$ is the Gaussian exponent for the data points with $y^{(i)}=1$ (the normalization constant and the $\phi$ term both have zero derivative with respect to $\mu_1$):

$$
\ell(\mu_1)=\sum_{i=1}^n 1\{y^{(i)}=1\}\left(-\frac12\bigl(x^{(i)}-\mu_1\bigr)^\top\Sigma^{-1}\bigl(x^{(i)}-\mu_1\bigr)\right)+\text{terms that do not depend on }\mu_1
$$

Taking the gradient with respect to $\mu_1$ needs one identity: when $A$ is symmetric, $\nabla_u(u^\top Au)=2Au$. Let $u=x^{(i)}-\mu_1$. Differentiating $u$ with respect to $\mu_1$ brings out a minus sign, which multiplies the $-\tfrac12$ in front and cancels both the 2 and the minus sign:

$$
\nabla_{\mu_1}\ell=\sum_{i=1}^n 1\{y^{(i)}=1\}\,\Sigma^{-1}\bigl(x^{(i)}-\mu_1\bigr)=\Sigma^{-1}\sum_{i=1}^n 1\{y^{(i)}=1\}\bigl(x^{(i)}-\mu_1\bigr)=0
$$

$\Sigma^{-1}$ doesn't depend on $i$, so it can be pulled outside the sum. Next comes the step the lecture stresses: $\Sigma^{-1}$ is invertible, and if an invertible matrix times some vector equals 0, that vector has to be 0. So

$$
\sum_{i=1}^n 1\{y^{(i)}=1\}\,x^{(i)}=\mu_1\sum_{i=1}^n 1\{y^{(i)}=1\}
$$

Dividing both sides by the number of elephants gives the formula for $\mu_1$. The lecturer asks in return: what if $\Sigma$ were not invertible? A student gets it right: the vector in the parentheses could sit in the null space without being 0, and a whole direction of $\mu_1$ would be left undetermined. This ties back to why $\Sigma$ was required to be positive definite earlier.

### The other three parameters (not derived in lecture; added in this article)

$\phi$: the second term is $\sum_i\bigl[y^{(i)}\log\phi+(1-y^{(i)})\log(1-\phi)\bigr]$. Let $n_1=\sum_i y^{(i)}$. Differentiating with respect to $\phi$ gives $n_1/\phi-(n-n_1)/(1-\phi)=0$, which solves to $\phi=n_1/n$.

$\mu_0$: replace every 1 in the derivation above with 0.

$\Sigma$: it is cleaner to differentiate with respect to $S=\Sigma^{-1}$ instead. Let $a_i=x^{(i)}-\mu_{y^{(i)}}$. The part that involves $S$ is $\frac n2\log|S|-\frac12\sum_i a_i^\top S a_i$ (using $|\Sigma|^{-1/2}=|S|^{1/2}$). Applying two matrix-calculus identities, $\nabla_S\log|S|=S^{-1}$ (for symmetric $S$) and $\nabla_S(a^\top Sa)=aa^\top$, gives $\frac n2\Sigma-\frac12\sum_i a_ia_i^\top=0$, which is the formula above.

### Without gradient descent, is it still learning?

A student asks exactly this, and the lecturer says it is one of his favorite questions (40:58):

> The fact that we can solve it in one step doesn't negate its ability to learn.

His definition: learning is inferring from data something you can use to predict the future. Every parameter here could be found by gradient descent; it would just be far slower than plugging into the formula. Make the model a little more complicated and there is no one-step solution anymore.

## Working it by hand: GDA on six data points

The following is an example made up for this article, not from the lecture. The numbers have been recomputed separately in code.

Four cats ($y=0$): $(1,2),(2,1),(2,3),(3,2)$. Two elephants ($y=1$): $(5,5),(7,7)$.

**Prior and means**: $\phi=2/6=1/3$, $\mu_0=(2,2)$, $\mu_1=(6,6)$.

**Covariance**: the cats minus $\mu_0$ are $(-1,0),(0,-1),(0,1),(1,0)$, and their outer products sum to $\begin{pmatrix}2&0\\0&2\end{pmatrix}$. The elephants minus $\mu_1$ are $(-1,-1),(1,1)$, and their outer products sum to $\begin{pmatrix}2&2\\2&2\end{pmatrix}$. Add them and divide by 6:

$$
\Sigma=\frac16\begin{pmatrix}4&2\\2&4\end{pmatrix}=\begin{pmatrix}2/3&1/3\\1/3&2/3\end{pmatrix},\qquad|\Sigma|=\frac13,\qquad\Sigma^{-1}=\begin{pmatrix}2&-1\\-1&2\end{pmatrix}
$$

The eigenvalues of $\Sigma$ are $1/3$ and $1$, both positive, so it is positive definite. Notice that the cat class on its own is round and the elephant class on its own is a diagonal line; the shared $\Sigma$ is a tilted ellipse that compromises between the two.

**Classifying a new animal** $x=(4.5,4)$. First compute its weighted squared distance to each center:

- To the cats: $x-\mu_0=(2.5,2)$, $\Sigma^{-1}(x-\mu_0)=(3,1.5)$, and the inner product is $2.5\times3+2\times1.5=10.5$.
- To the elephants: $x-\mu_1=(-1.5,-2)$, $\Sigma^{-1}(x-\mu_1)=(-1,-2.5)$, and the inner product is $1.5+5=6.5$.

The two Gaussians have the same normalization constant, so comparing $\log\bigl[p(x\mid y)p(y)\bigr]$ only requires $-\tfrac12\times$ the squared distance $+\log$ of the prior:

$$
\log\frac{p(x\mid y=1)\,\phi}{p(x\mid y=0)\,(1-\phi)}=-\frac{6.5}{2}+\frac{10.5}{2}+\log\frac{1/3}{2/3}=2-0.693=1.307
$$

Back to a probability: $p(y=1\mid x)=1/(1+e^{-1.307})\approx0.787$. The model decides it is an elephant.

**What this result means**: by distance, this animal is much closer to the elephants, and on likelihood alone elephant is $e^{2}\approx7.4$ times as likely as cat. But the training data has twice as many cats as elephants, so the prior cuts that ratio in half to $3.7$, which works out to $0.787$. Replace $x$ with the exact midpoint of the two centers, $(4,4)$: the squared distance to each side is 8, the likelihoods tie, and the posterior falls back to the prior $1/3$, so the model guesses cat.

## Why the decision boundary is a straight line

(Recording 45:10–57:45)

The decision boundary is where the two classes' scores tie. The lecture moves through this derivation quickly, and the lecturer himself apologizes for skipping too many steps. Below, every step is written out in the notation of the main notes.

Set the two sides equal and take logs (the shared normalization constant cancels immediately):

$$
-\frac12(x-\mu_1)^\top\Sigma^{-1}(x-\mu_1)+\log\phi=-\frac12(x-\mu_0)^\top\Sigma^{-1}(x-\mu_0)+\log(1-\phi)
$$

Expand the quadratic form. The lecture writes this step out at a student's request:

$$
(x-\mu_1)^\top\Sigma^{-1}(x-\mu_1)=x^\top\Sigma^{-1}x-\mu_1^\top\Sigma^{-1}x-x^\top\Sigma^{-1}\mu_1+\mu_1^\top\Sigma^{-1}\mu_1
$$

The two middle terms are both scalars, and because $\Sigma^{-1}$ is symmetric they are equal. They combine into $-2\mu_1^\top\Sigma^{-1}x$, and after multiplying by the $\tfrac12$ in front the coefficient is exactly 1. The last term has no $x$ in it and is a constant.

The key is the first term, $x^\top\Sigma^{-1}x$. It is quadratic in $x$, but **there is one on each side of the equation, and because $\Sigma$ is shared the two are identical**, so they cancel. Rearranging what is left:

$$
(\mu_1-\mu_0)^\top\Sigma^{-1}x=\frac12\bigl(\mu_1^\top\Sigma^{-1}\mu_1-\mu_0^\top\Sigma^{-1}\mu_0\bigr)-\log\frac{\phi}{1-\phi}
$$

The left side is the inner product of a fixed vector with $x$ and the right side is a constant, which is the equation of a hyperplane. So for GDA with a shared $\Sigma$, the decision boundary is necessarily linear. The $\log\frac{\phi}{1-\phi}$ on the right is the log odds of the prior: it only moves the boundary's position and does not change its direction.

Plugging in the numbers from the previous section: $\Sigma^{-1}(\mu_1-\mu_0)=(4,4)$, $\mu_1^\top\Sigma^{-1}\mu_1=72$, $\mu_0^\top\Sigma^{-1}\mu_0=8$, and the boundary is $4x_1+4x_2=32+0.693$, that is, $x_1+x_2\approx8.17$. The midpoint of the two centers lies on $x_1+x_2=8$. There are more cats, so the boundary is pushed a little toward the elephants and the midpoint ends up in cat territory, consistent with the previous section.

### Without a shared Σ: QDA

A student asks: if each class has its own covariance matrix, does this method still work? It does. $x^\top\Sigma_1^{-1}x$ and $x^\top\Sigma_0^{-1}x$ are no longer equal, the quadratic terms don't cancel, and the boundary becomes a quadratic curve. This model is called QDA (quadratic discriminant analysis). Estimation barely changes: the means are as before, and each class computes its own covariance from its own data. The lecturer says he added this part and its figure himself; it isn't in the notes, because someone asks every time he teaches it.

Another student notices that in the QDA figure, a region assigned to the other class suddenly appears far away from all the data, and finds that unreasonable. The lecturer says linear models have the same problem, only less visibly: far from the data, a linear boundary also keeps extending with no evidence behind it. Once you leave the data, any model can do strange things.

## GDA and logistic regression

(Recording 57:45–1:05:45)

### The posterior is a sigmoid

The lecture says this algebra "can be done, maybe as a homework problem" and skips it; Section 4.1.3 of the main notes also gives only the conclusion. The derivation above has in fact already done most of the work, and this section fills in the rest.

Divide the numerator and denominator of the Bayes' rule expression by the numerator:

$$
p(y=1\mid x)=\frac{p(x\mid y=1)\phi}{p(x\mid y=1)\phi+p(x\mid y=0)(1-\phi)}=\frac{1}{1+\exp(-a)},\qquad a=\log\frac{p(x\mid y=1)\,\phi}{p(x\mid y=0)\,(1-\phi)}
$$

$a$ is exactly the "left side minus right side" quantity from the previous section, which we already found to be a linear function of $x$:

$$
a=\theta^\top x+\theta_0,\qquad\theta=\Sigma^{-1}(\mu_1-\mu_0),\qquad\theta_0=-\frac12\mu_1^\top\Sigma^{-1}\mu_1+\frac12\mu_0^\top\Sigma^{-1}\mu_0+\log\frac{\phi}{1-\phi}
$$

So $p(y=1\mid x)=1/(1+e^{-(\theta^\top x+\theta_0)})$, the very same functional form as logistic regression. In the numerical example $\theta=(4,4)$ and $\theta_0\approx-32.69$; plugging in $x=(4.5,4)$ gives $a=1.307$, the same as the direct Bayes' rule calculation.

The lecturer points out how to read this statement. That the boundary is a straight line is nothing special; that was already derived. The real content is that **the probability values on the two sides match as well**, not just the location of the boundary.

### It only goes one way

The logistic form follows from GDA's assumptions, but not the other way around. The lecturer says this holds beyond Gaussians: many exponential family distributions (he mentions Poisson) with shared parameters also lead to a posterior of logistic form. The main notes' example is $x\mid y=0\sim\mathrm{Poisson}(\lambda_0)$ and $x\mid y=1\sim\mathrm{Poisson}(\lambda_1)$. This is the same fact as last lecture's GLMs: for the exponential family, the log odds are a linear function of the parameters. In other words, logistic regression assumes only that "the log odds are a linear function of $x$," and many different data-generating processes satisfy that (1:03:36):

> Logistic regression does not mean it's GDA. They are not equivalent models. GDA is making more assumptions.

The conclusion in traditional textbooks, and in the main notes: GDA makes strong assumptions, learns well from less data when they hold, and is unreliable when they don't. Logistic regression makes weak assumptions and needs somewhat more data, but holds up better when the model is misspecified. That is why logistic regression is used more in practice.

### The lecturer doesn't fully agree

The lecturer says the passage above is "what I'm supposed to tell you," but that it is somewhat misleading. Someone sitting in this classroom ten years ago would have come away thinking "logistic regression is all you need to know," while the progress of the past decade came from precisely the other side: modeling the data itself. His examples are diffusion models (recovering an image from Gaussian noise by denoising step by step), large language models (predicting the next token on huge amounts of unlabeled text), and GANs. These models share GDA's probabilistic framework: first describe how the data is generated, then put that model to use. GDA is the simplest of them.

The Q&A (1:05:45–1:13:55) extends the topic. A student asks whether a generative model can be used as a discriminator, and the lecturer brings up how pretrained models like BERT are used: train a good representation generatively, then attach a classifier on top. The course will come back to this when it covers fine-tuning. You don't need to remember this part for GDA's sake, but it shows why a course in 2026 still starts from a model that "ends up with nothing but a straight line."

## Naive Bayes: when the features are discrete

(Recording 1:13:55–1:21:25)

GDA handles continuous features. For discrete features, such as deciding whether an email is spam, the lecture spends its last seven minutes on Naive Bayes. The recipe is still the same three things: model $p(x\mid y)$, model $p(y)$, classify with Bayes' rule.

### Features and the parameter explosion

Start by picking $d$ words from the training corpus as a dictionary. The lecturer says to pick informative words; stop words that show up everywhere, like the, a, and and, carry no signal and are usually left out. Each email is represented as $x\in\{0,1\}^d$, where the entry for the $j$-th word is 1 if that word appears. The lecture's example uses five words: buy, free, meeting, 229, homework.

The problem is that $x$ has $2^d$ possible values. If you assigned a separate probability to each one, then for $d=10{,}000$ you would need $2^{10000}\approx10^{3010}$ parameters (this conversion is this article's calculation, and it differs from the number the lecturer tosses out in class), more than you could even write down.

### The conditional independence assumption

The chain rule of probability always holds:

$$
p(x_1,\dots,x_d\mid y)=p(x_1\mid y)\,p(x_2\mid y,x_1)\cdots p(x_d\mid y,x_1,\dots,x_{d-1})
$$

Naive Bayes assumes that **given the class, whether each word appears is independent of the others**, so the conditioning on other words can be removed from every factor:

$$
p(x_1,\dots,x_d\mid y)=\prod_{j=1}^d p(x_j\mid y)
$$

This assumption is obviously false, and the lecturer gives his own counterexample: in "not the worst," not and worst are treated as two independent negative signals and multiplied together, and the negation is lost entirely. But it brings the parameter count down to $2d+1$: one $\phi_{j\mid y=k}=p(x_j=1\mid y=k)$ for each word in each class, $2d$ in all, plus one prior $\phi_y=p(y=1)$. From exponential down to linear.

### Estimation and prediction

Maximum likelihood estimation is, as with GDA, just counting (the lecture does not derive it; the lecturer says the procedure is exactly the same: write the log-likelihood, differentiate, solve):

$$
\phi_y=\frac{\sum_i 1\{y^{(i)}=1\}}{n},\qquad
\phi_{j\mid y=k}=\frac{\sum_i 1\{x_j^{(i)}=1\wedge y^{(i)}=k\}}{\sum_i 1\{y^{(i)}=k\}}
$$

The second formula says: among the emails in class $k$, what fraction contain the $j$-th word. To predict, look up the corresponding probabilities and multiply them; in an implementation you add logs instead and compare the two classes' totals. Both training and inference are extremely cheap. The lecturer's comment on old models like this (1:14:59):

> One of the things that's amazing about the models of the ancients is that they work pretty well.

### Laplace smoothing

On Laplace smoothing the lecture says only "add some ones." The purpose is to avoid probabilities of 0 and to make the model less sure of its own estimates. The lecturer classes it as a kind of regularization, which the next lecture covers in detail. The formula in Section 4.2.1 of the main notes adds 1 to the numerator and 2 to the denominator (because $x_j$ takes two values):

$$
\phi_{j\mid y=k}=\frac{1+\sum_i 1\{x_j^{(i)}=1\wedge y^{(i)}=k\}}{2+\sum_i 1\{y^{(i)}=k\}}
$$

A small example shows most clearly why it is needed (the following is an example made up for this article, not from the lecture). Out of 10 emails, 4 are spam and 6 are legitimate, and the five words appear in the following numbers of emails:

| Word | buy | free | meeting | 229 | homework |
|---|---|---|---|---|---|
| Spam (4 emails) | 3 | 4 | 0 | 0 | 1 |
| Legitimate (6 emails) | 1 | 1 | 4 | 3 | 3 |

A new email contains only buy and meeting, that is, $x=(1,0,1,0,0)$.

Without smoothing, on the spam side $p(\text{meeting}=1\mid\text{spam})=0/4=0$, and also $p(\text{free}=0\mid\text{spam})=1-4/4=0$. A single 0 in the product makes the whole $p(x\mid\text{spam})$ equal to 0, no matter how much evidence the other words provide.

With smoothing, the five probabilities for spam become $4/6,5/6,1/6,1/6,2/6$ and those for legitimate email become $2/8,2/8,5/8,4/8,4/8$:

$$
p(x\mid\text{spam})=\frac46\cdot\frac16\cdot\frac16\cdot\frac56\cdot\frac46=\frac{80}{7776}\approx0.0103,\qquad
p(x\mid\text{legit})=\frac28\cdot\frac68\cdot\frac58\cdot\frac48\cdot\frac48=\frac{960}{32768}\approx0.0293
$$

Multiplying by the priors $0.4$ and $0.6$ gives $0.00412$ and $0.01758$, so $p(\text{spam}\mid x)=0.00412/(0.00412+0.01758)\approx0.19$. The model still classifies the email as legitimate, but no longer with a flat, categorical 0: not having seen meeting in just four spam emails is not enough to conclude that spam will never mention it.

## Self-check

**1. Use the model from the hand-worked example to classify $x=(5,3)$, and explain why the answer is the same as for $(4,4)$.**
$a=4\times5+4\times3-32.693=-0.693$, $p(y=1\mid x)=1/(1+e^{0.693})=1/3$, classified as cat. $(5,3)$ and $(4,4)$ both lie on the line $x_1+x_2=8$, and $\theta=(4,4)$ only looks at $x_1+x_2$: moving parallel to the boundary leaves the posterior unchanged.

**2. Suppose two more elephants are added to the same dataset so that each class has four, and $\mu_0,\mu_1,\Sigma^{-1}$ all happen to stay the same. Where does the decision boundary move?**
$\phi=1/2$, $\log\frac{\phi}{1-\phi}=0$, and the boundary becomes $x_1+x_2=8$, passing exactly through the midpoint of the two centers. The answer only counts as correct if you can say "the prior only translates the boundary and does not change its direction."

**3. In the derivation of $\mu_1$, what property takes you from $\Sigma^{-1}\sum_i 1\{y^{(i)}=1\}(x^{(i)}-\mu_1)=0$ to $\sum_i 1\{y^{(i)}=1\}(x^{(i)}-\mu_1)=0$? What happens if that property fails?**
It uses the invertibility of $\Sigma^{-1}$: the null space of an invertible matrix contains only the zero vector. If it were not invertible, the vector in the parentheses could be any nonzero vector in the null space, and $\mu_1$ could not be uniquely determined in that direction.

**4. Why is the boundary a straight line with a shared $\Sigma$ but a quadratic curve when each class has its own $\Sigma$?**
After expanding the exponents on both sides, each has a term quadratic in $x$. With a shared covariance both terms are $x^\top\Sigma^{-1}x$ and their difference is 0. Without sharing, $x^\top(\Sigma_1^{-1}-\Sigma_0^{-1})x$ is left over and does not cancel.

**5. Your features are event counts per hour, which look more Poisson than Gaussian. Do you choose GDA or logistic regression, and why?**
Logistic regression. When both classes are Poisson, the posterior is still of logistic form, so logistic regression's assumption holds. GDA would be fitting Gaussians to non-Gaussian data, with unpredictable results. The answer should mention that "many generative assumptions lead to the logistic form, but not the reverse."

## Corresponding reading

[CS229 main notes](https://cs229.stanford.edu/main_notes.pdf), Chapter 4, Generative learning algorithms, pages 35–48:

- 4.1.1 The multivariate normal distribution (pages 36–39), 4.1.2 The GDA model (pages 39–40), 4.1.3 GDA and logistic regression (pages 41–42).
- 4.2 Naive Bayes (pages 42–45, marked Optional Reading in the notes), 4.2.1 Laplace smoothing (pages 45–47), 4.2.2 Event models for text classification (pages 47–48).

How the lecture differs from the notes:

- The notes' example is dogs and elephants; the lecture switches to cats and elephants.
- The notes only require $\Sigma$ to be symmetric positive semidefinite. The lecture states outright that it must be positive definite and explains why the square root of the determinant and the inverse need it.
- The notes leave the maximum likelihood estimates of the parameters to Problem Set 1; the lecture derives $\mu_1$. The expansion of the decision boundary, QDA, and the figure of a quadratic boundary are not in the notes.
- In the notes but skipped or only touched on in lecture: the statement that GDA is "asymptotically efficient" when its assumptions hold; the motivating example for Laplace smoothing (an unseen word turns the posterior into 0/0) and its formula; features that take several discrete values, and discretizing continuous features before applying Naive Bayes; and the multinomial event model of 4.2.2, which the lecture does not mention at all.
- In the lecture but not in the notes: the reservations about the traditional conclusion that "logistic regression is more practical," and the context of generative models such as diffusion models and language models.

**Series navigation**: Previous: [Lecture 4: the exponential family, generalized linear models, and softmax](/posts/ai/2026-10-12-stanford-cs229-lecture-04-exponential-family-glm-en) | Next: [Lecture 6: bias and variance, regularization, and model selection](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization-en)

## Course video sources

Original video: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 5: Gaussian Discriminant Analysis](https://www.youtube.com/watch?v=zRdE8A4UZes)

- [Stanford CS229 Machine Learning | Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 course website](https://cs229.stanford.edu/)
- [CS229 main notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

Checked: 2026-10-12.

Content check: verified against the video transcript (2026-10-12): the order of the lecture, the quotations, and the timestamps throughout were checked section by section against this video's English transcript. I did not see the board or the slides; the formulas are filled in from Chapter 4 of the main notes, and the full algebra for the decision boundary and the sigmoid, the derivations of $\phi$ and $\Sigma$, and the two numerical examples were written and computed for this article.

## References

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 5: Gaussian Discriminant Analysis (YouTube)](https://www.youtube.com/watch?v=zRdE8A4UZes): the main source for this article. The order of the lecture, what the lecturer says, and the quotations all come from its English transcript.
- [CS229 main notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf): Chapter 4 (pages 35–48) supplies the formula notation, the maximum likelihood results, the Laplace smoothing formula, and the page numbers in "Corresponding reading."
- [Reading Stanford CS229: Course Overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): the course positioning and reading route for this series.
