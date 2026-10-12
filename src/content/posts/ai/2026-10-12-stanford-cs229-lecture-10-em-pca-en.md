---
title: "The EM Algorithm and PCA: How a Lower Bound Keeps the Likelihood from Dropping | Stanford CS229 Lecture 10"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, em-algorithm, pca, unsupervised-learning]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 10
tldr: "The first half uses Jensen's inequality to build a lower bound on the log-likelihood, the ELBO, then picks Q to be the posterior so the bound is tight at the current parameters. From that it follows that no round of EM can lower the likelihood, and plugging in a Gaussian mixture recovers last lecture's weighted-average formulas. The second half writes PCA as maximizing uᵀΣu over unit vectors; the answer is the eigenvector of the covariance matrix with the largest eigenvalue."
description: "A guide to Lecture 10 of Stanford CS229 (Spring 2026): the ELBO derivation and monotonicity of the EM algorithm, the E-step and M-step for Gaussian mixture models, and PCA's centering, maximum variance versus minimum residual, and eigendecomposition, with two numerical examples you can check by hand."
draft: false
math: true
---

> 🌏 [中文版](/posts/ai/2026-10-12-stanford-cs229-lecture-10-em-pca)

**Video status: Videos included.** This article is written from the English captions of the Spring 2026 Lecture 10 recording published by Stanford Online, with notation checked against Chapters 11 and 12 of the 2026 main lecture notes. I did not see the board, so wherever the lecturer points at it, the content is reconstructed from context and the notes.

At the end of the [previous lecture](/posts/ai/2026-10-12-stanford-cs229-lecture-09-k-means-gmm-en), the update formulas for the Gaussian mixture model (GMM) were obtained by squinting: the mean ought to be a weighted average, and the mixing proportion ought to be a weighted count. In this lecture Chris Ré turns that into a proper derivation and then moves on to PCA. He covers the link between the two topics in a single phrase at the start: PCA is the "non-probabilistic analog" of EM (00:00:05). He only finishes the thought at the end. Both assume there is structure hidden beneath the data. EM assumes probabilistic latent variables, and PCA assumes the data lies near a low-dimensional subspace.

The prerequisites are k-means and GMMs from the previous lecture, Jensen's inequality, the multivariate Gaussian, and from linear algebra, orthonormal bases and the eigendecomposition of a symmetric matrix. By the end you should be able to write down the ELBO yourself, explain why a round of EM never makes the likelihood worse, work one round of EM for a one-dimensional GMM by hand, and explain why PCA amounts to finding eigenvectors of the covariance matrix. The map of the whole course is in the [course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en).

```youtube
url: https://www.youtube.com/watch?v=sUS-eTa0l6s
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 10: GMM (EM), PCA
captions: en
```

## EM climbs a curve it cannot see clearly

(Recording 00:00–12:20)

The lecture opens by reviewing last time's setup. The data are photon hits on a photographic plate. We don't know how many sources there are, how much each contributes, or what shape each has. Every point $x^{(i)}$ comes with an unobserved latent variable $z^{(i)}$ that says which source it came from. k-means gives hard assignments and GMM gives soft ones: a point can be "50% in the first cluster, 50% in the second." After assigning, we re-estimate each cluster's mean $\mu_j$, covariance matrix $\Sigma_j$, and proportion $\phi_j$. In a picture each cluster is an ellipse, because that is a contour of equal density for a multivariate Gaussian, and the axes of the ellipse point along the eigenvectors of the covariance matrix. That remark comes back in the second half.

This lecture uses only the concave version of Jensen's inequality. $\log$ is concave, so the chord between any two points on its graph lies below the graph. In two-point form:

$$
\log\big(\lambda a+(1-\lambda)b\big)\;\ge\;\lambda\log a+(1-\lambda)\log b,\qquad 0\le\lambda\le 1
$$

Read "take $a$ with probability $\lambda$ and $b$ with probability $1-\lambda$" as a random variable $X$, and the line above says $\log \mathbb{E}[X]\ge\mathbb{E}[\log X]$. The lecturer keeps redrawing this picture for a reason: when you can't remember which way the inequality goes, recalling that the chord of $\log$ sits below the curve gives it back.

Next comes the map of the whole derivation. Collect all the parameters (for a GMM, every $\mu_j,\Sigma_j,\phi$) into one vector $\theta$. The log-likelihood $\ell(\theta)$ is a curve with several peaks, and we can't maximize it directly. EM builds a surrogate curve $L_t(\theta)$ at the current guess $\theta_t$, and the surrogate has to satisfy two things:

1. **Tight**: $L_t(\theta_t)=\ell(\theta_t)$. The two curves touch at $\theta_t$.
2. **Lower bound**: $L_t(\theta)\le\ell(\theta)$ for every $\theta$.

Then set $\theta_{t+1}=\arg\max_\theta L_t(\theta)$ and build the next curve $L_{t+1}$ at the new position. Building the curve is the E-step, and maximizing over it is the M-step.

A student asks why we don't just run gradient descent on $\ell$. The answer has two layers. First, EM is one algorithm for this problem, not the only one. Second, every term of $\ell(\theta)$ is $\log\sum_z p(x,z;\theta)$, so working on it directly means dealing with the whole marginalization over $z$. EM uses the fact that this is a latent variable model to split one hard problem into two easy ones solved in turn. It is the same kind of alternation as k-means, which goes back and forth between assigning points and computing centers.

## Building the lower bound: multiply by Q and divide it back out

(Recording 12:20–20:25)

Start with a single data point and drop every superscript $(i)$; we sum over all points at the end. The log-likelihood of this one point is

$$
\log p(x;\theta)=\log\sum_z p(x,z;\theta)
$$

The trouble is the $\log$ wrapped around a sum. The lecturer then does something he himself says looks very silly: pick any probability distribution $Q$ over $z$ (with $Q(z)\ge 0$ and $\sum_z Q(z)=1$), multiply by it, and divide it back out.

$$
\log\sum_z p(x,z;\theta)=\log\sum_z Q(z)\,\frac{p(x,z;\theta)}{Q(z)}
$$

The value hasn't changed, since $Q(z)/Q(z)=1$. What has changed is how we read it: $\sum_z Q(z)\,(\cdot)$ is exactly "the expectation when $z$ is drawn from $Q$," so the right-hand side can be rewritten as

$$
\log\,\mathbb{E}_{z\sim Q}\!\left[\frac{p(x,z;\theta)}{Q(z)}\right]
$$

Why force it into the shape of an expectation? The lecturer's reason is blunt: "We have exactly one tool to deal with expectations." (00:15:19) That tool is Jensen. $\log$ is concave, so $\log\mathbb{E}[X]\ge\mathbb{E}[\log X]$, and applying it gives:

$$
\log p(x;\theta)\;\ge\;\mathbb{E}_{z\sim Q}\!\left[\log\frac{p(x,z;\theta)}{Q(z)}\right]=\sum_z Q(z)\log\frac{p(x,z;\theta)}{Q(z)}
$$

The right-hand side is the lower bound for this one point. The notes write it as $\mathrm{ELBO}(x;Q,\theta)$. Two things to watch:

- The inequality holds for **any** $Q$ and any $\theta$. Nothing so far depends on how $Q$ is chosen.
- There is **one $Q$ per point**. Put the superscripts back and it is $Q_i(z^{(i)})$: every point has its own set of weights. The lecturer stresses this so nobody assumes the whole dataset shares a single $Q$.

An addition in this article, on a point the lecturer does not spell out but that is worth seeing clearly: after Jensen, the $\log$ has moved inside the sum and acts directly on $p(x,z;\theta)$. For a GMM, $p(x,z=j;\theta)=\phi_j\,\mathcal N(x;\mu_j,\Sigma_j)$, and its $\log$ splits into $\log\phi_j$, $-\tfrac12\log|\Sigma_j|$, and a quadratic form, all added together, with each parameter in its own term. That is why the lower bound is easier to handle than the original $\ell$. The lecture's picture draws $L_t(\theta)$ as an easy concave hill. When the lecturer asks what we care about in $L_t$, his own answer is "It's concave," and later he calls it a "nice concave function." That describes the sketch and well-behaved models like the GMM; a general latent variable model does not guarantee that the lower bound is concave in $\theta$. EM's monotonicity doesn't need concavity either. It only needs the M-step to find a point where $L_t$ is no lower than it is at $\theta_t$, as the chain of inequalities in the monotonicity section below shows.

## Making the bound tight: set Q to the posterior

(Recording 20:25–25:30)

We have a lower bound and still need tightness. The only inequality in the whole derivation is the Jensen step, so it is enough to make Jensen hold with equality. When does that happen? When the random variable inside the expectation is actually a constant. If for every $z$

$$
\frac{p(x,z;\theta)}{Q(z)}=c
$$

then the left side is $\log\mathbb{E}[c]=\log c$ and the right side is $\mathbb{E}[\log c]=\log c$, and the two are equal.

For this ratio not to depend on $z$, $Q(z)$ has to be proportional to $p(x,z;\theta)$. Add the requirement that $Q$ sums to 1, and the notes finish the normalization:

$$
Q(z)=\frac{p(x,z;\theta)}{\sum_{z'}p(x,z';\theta)}=\frac{p(x,z;\theta)}{p(x;\theta)}=p(z\mid x;\theta)
$$

That is the posterior of $z$ under the current parameters. Check the ratio: $p(x,z;\theta)/p(z\mid x;\theta)=p(x;\theta)$, which indeed contains no $z$, and the constant $c$ is exactly $p(x;\theta)$, so the value of the lower bound is $\log p(x;\theta)$.

Sum over all points, and fix $Q_i$ to the posterior computed with $\theta_t$, $Q_i^{(t)}(z)=p(z\mid x^{(i)};\theta_t)$. This gives the surrogate curve from the opening picture:

$$
L_t(\theta)=\sum_{i=1}^n\sum_{z}Q_i^{(t)}(z)\log\frac{p(x^{(i)},z;\theta)}{Q_i^{(t)}(z)}
$$

It is a lower bound because each point's inequality holds term by term and still holds after summing. It is tight at $\theta_t$ because every term holds with equality at $\theta_t$. Note that the $\theta_t$ inside $Q_i^{(t)}$ is a frozen number; $L_t(\theta)$ depends on $\theta$ only through $p(x^{(i)},z;\theta)$.

The lecturer calls this quantity the "evidence-based lower bound"; the notes call it the evidence lower bound. Either way the abbreviation is ELBO. He mentions in passing that its uses go far beyond GMMs: "If you do diffusion models, you do ELBOs underneath the covers." (00:23:26)

## Why the likelihood never drops, and what EM does not guarantee

(Recording 17:20–18:25, 24:25–32:40)

With the two properties in hand, monotonicity takes three steps. In class the lecturer argues geometrically (the lower bound touches the curve; walk to the top of the lower bound and the original curve can only be higher). Section 11.3 of the notes writes it as a chain of inequalities:

$$
\ell(\theta_{t+1})\;\ge\;L_t(\theta_{t+1})\;\ge\;L_t(\theta_t)\;=\;\ell(\theta_t)
$$

- The first inequality uses the **lower bound** property, which holds for any $\theta$ and so for $\theta_{t+1}$ in particular.
- The second inequality uses the **definition of the M-step**: $\theta_{t+1}$ maximizes $L_t$, so its value there is no smaller than at $\theta_t$.
- The final equality uses **tightness**.

So $\ell(\theta_t)$ is a sequence that never decreases. As a practical stopping rule, the notes suggest checking whether the increase in $\ell$ between consecutive rounds falls below some threshold.

This guarantee leaves out three things. The lecturer raises the first himself, and the other two come from student questions:

- **No guarantee of a global optimum.** Different starting points climb to different peaks, as with k-means. Randomness enters only at initialization; every step after that is deterministic.
- **No guarantee about how "good" the lower bound is.** A student asks whether anything controls how wide or narrow $L_t$ is. The lecturer says no. It depends on the shape and curvature of the problem itself, the same way that how well gradient descent converges depends on the loss function.
- **No guarantee of small steps.** Another student points out that the $\arg\max$ might jump straight over a small dip in $\ell$. The lecturer agrees that can happen, and adds that gradient descent jumps too, because it has a step size.

One more exchange, about scope, is worth writing down. A student asks whether this works for any distribution. The lecturer turns the question around: what did we assume? We assumed the decomposition $p(x;\theta)=\sum_z p(x,z;\theta)$, and that we know what $z$ is, which values it takes, and what shape each cluster has. He says to be wary when someone writes "the probability function has the following form": "that's usually a fairly strong assumption" (00:26:32). The assumption rules out many models, but it is reasonable when you know the data really does have cluster or point-source structure.

As for the worry "$z$ can't be observed, so where does $Q$ come from," the lecturer's account is that $z$ can't be measured in the real world, but while the algorithm runs it always holds a guess about $z$. With two clusters and a point that comes out 50% to 50%, that point's $Q$ is the vector $(0.5,0.5)$. A little later he adds a line that is a good reminder not to treat soft assignments as fact: "This isn't a statement about the world. It's a statement about the algorithm's current belief." (00:39:49)

## Back to the GMM: the E-step is Bayes' rule

(Recording 32:40–39:50)

Now plug the Gaussian mixture into the general form. The E-step has to compute

$$
w_j^{(i)}:=Q_i(z^{(i)}=j)=p(z^{(i)}=j\mid x^{(i)};\phi,\mu,\Sigma)
$$

Expand with Bayes' rule:

$$
w_j^{(i)}=\frac{\phi_j\;\mathcal N(x^{(i)};\mu_j,\Sigma_j)}{\sum_{l=1}^k\phi_l\;\mathcal N(x^{(i)};\mu_l,\Sigma_l)}
$$

The numerator has two factors, and the lecturer uses one picture to explain each. Take a point that falls between two centers, a bit closer to $\mu_1$. If the two clusters are the same size, intuition gives it roughly 60% to 40%, and that comes from the ratio of the Gaussian densities. But if the second cluster has a thousand times as many points as the first, $\phi_2$ is a thousand times $\phi_1$, the second cluster's term in the numerator is multiplied by a thousand along with it, and the probability that the point belongs to the second cluster rises sharply. Density and proportion multiply, and then we divide by the total to normalize.

Some people find this unsettling: we are comparing density values, not probabilities. The lecturer says that's fine. The numbers are meaningful, and after normalizing they are probabilities. His advice for this part is practical: "code up some Python that does it once. Then it locks in your brain." (00:38:47) The numerical example below follows that advice.

## Back to the GMM: the M-step is weighted maximum likelihood

(Recording 39:50–48:05)

The M-step maximizes, over $\phi,\mu,\Sigma$,

$$
L_t(\theta)=\sum_{i=1}^n\sum_{j=1}^k w_j^{(i)}\log\frac{\phi_j\,\dfrac{1}{(2\pi)^{d/2}|\Sigma_j|^{1/2}}\exp\!\Big(-\tfrac12(x^{(i)}-\mu_j)^\top\Sigma_j^{-1}(x^{(i)}-\mu_j)\Big)}{w_j^{(i)}}
$$

Here $x^{(i)},\mu_j\in\mathbb R^d$, and $\Sigma_j\in\mathbb R^{d\times d}$ is symmetric and positive semidefinite. (That is how the lecturer puts it. To write the Gaussian density in the expression above at all, $\Sigma_j$ also has to be invertible, that is, positive definite, and that is what gets used later when $\Sigma_l^{-1}$ is cancelled.) The expression is long, but $w_j^{(i)}$ is a fixed number during the M-step, and there is only one move: take the gradient with respect to each parameter and set it to zero.

**The mean $\mu_l$.** Split the $\log$ apart. The only part that involves $\mu_l$ is the exponent for $j=l$; everything else ($\log\phi_j$, the determinant, $\log w_j^{(i)}$, the terms for other clusters) differentiates to zero:

$$
\nabla_{\mu_l}L_t=\nabla_{\mu_l}\sum_{i=1}^n w_l^{(i)}\Big(-\tfrac12(x^{(i)}-\mu_l)^\top\Sigma_l^{-1}(x^{(i)}-\mu_l)\Big)=\sum_{i=1}^n w_l^{(i)}\,\Sigma_l^{-1}(x^{(i)}-\mu_l)
$$

The second equality uses the derivative of a quadratic form with symmetric $A$, $\nabla_\mu\,(x-\mu)^\top A(x-\mu)=-2A(x-\mu)$. Pull $\Sigma_l^{-1}$ out of the sum and set the gradient to zero:

$$
\Sigma_l^{-1}\sum_{i=1}^n w_l^{(i)}(x^{(i)}-\mu_l)=0
$$

The lecturer stops here to ask: why is there no $\Sigma_l$ in the final answer? Multiply both sides by $\Sigma_l$ and it cancels. We can do this because $\Sigma_l^{-1}$ has full rank: if a full-rank matrix times some vector gives zero, the vector itself must be zero. If the matrix were rank-deficient, the bracket could have nonzero solutions. So

$$
\sum_{i=1}^n w_l^{(i)}(x^{(i)}-\mu_l)=0\quad\Longrightarrow\quad\mu_l=\frac{\sum_{i=1}^n w_l^{(i)}x^{(i)}}{\sum_{i=1}^n w_l^{(i)}}
$$

This is exactly the weighted average that last lecture guessed by intuition. The same derivation showed up in GDA and in least squares; the only difference is that each term now carries a weight.

**The proportions $\phi_j$.** The terms involving $\phi$ are $\sum_i\sum_j w_j^{(i)}\log\phi_j$. Setting the derivative to zero directly goes wrong: this expression keeps growing as $\phi_j$ grows, and it has no critical point. What's missing is the constraint $\sum_j\phi_j=1$. The lecturer only reminds the class that "constrained variables call for Lagrange multipliers" and leaves the details to the TA notes; what follows fills them in from Section 11.4 of the main notes. Let

$$
\mathcal L(\phi)=\sum_{i=1}^n\sum_{j=1}^k w_j^{(i)}\log\phi_j+\beta\Big(\sum_{j=1}^k\phi_j-1\Big)
$$

Differentiate with respect to $\phi_j$ and set to zero: $\sum_i w_j^{(i)}/\phi_j+\beta=0$, so $\phi_j=\sum_i w_j^{(i)}/(-\beta)$. Substitute into $\sum_j\phi_j=1$, and use the fact that each point's weights sum to 1 ($\sum_j w_j^{(i)}=1$):

$$
-\beta=\sum_{i=1}^n\sum_{j=1}^k w_j^{(i)}=n\quad\Longrightarrow\quad\phi_j=\frac1n\sum_{i=1}^n w_j^{(i)}
$$

**The covariance $\Sigma_j$.** The lecture does not derive it, and Section 11.4 of the notes also leaves it as an exercise. The result is listed in Section 11.1:

$$
\Sigma_j=\frac{\sum_{i=1}^n w_j^{(i)}(x^{(i)}-\mu_j)(x^{(i)}-\mu_j)^\top}{\sum_{i=1}^n w_j^{(i)}}
$$

All three formulas look just like the maximum likelihood estimates for the case where $z$ is known, with the 0/1 indicator replaced by $w_j^{(i)}$. The lecturer's summary is that EM turns last lecture's improvised algorithm back into a principled derivation, and that every step is only saying: given the current parameters, this is my best guess at the clustering.

### Numerical example: one round of EM by hand

This is an example made up for this article, not from the lecture. The numbers were checked separately in Python.

One-dimensional data with four points, $x=(0,1,2,5)$, and two Gaussians. The current parameters $\theta_t$: $\phi=(0.5,0.5)$, $\mu=(1,3)$, $\sigma^2=(1,1)$.

**E-step.** Take $x=1$: $\mathcal N(1;1,1)=0.3989$ and $\mathcal N(1;3,1)=0.0540$. Multiplying by $\phi_j=0.5$ gives joint probabilities $0.1995$ and $0.0270$, which add up to $p(x)=0.2265$. So $w_1=0.1995/0.2265=0.881$. For all four points:

| $x^{(i)}$ | $w_1^{(i)}$ | $w_2^{(i)}$ | $\log p(x^{(i)};\theta_t)$ |
|---|---|---|---|
| 0 | 0.982 | 0.018 | −2.094 |
| 1 | 0.881 | 0.119 | −1.485 |
| 2 | 0.500 | 0.500 | −1.419 |
| 5 | 0.002 | 0.998 | −3.610 |

$x=2$ sits exactly halfway between the two centers and the clusters are the same size, so it comes out 50% to 50%. If we change the proportions so the second cluster is a thousand times the first ($\phi=(1/1001,\,1000/1001)$), the same point becomes $w_1=0.001$: the densities are equal, and the proportions decide everything. The log-likelihoods sum to $\ell(\theta_t)=-8.608$.

**Is the lower bound really below?** Stay with $x=1$, where $\log p(x)=-1.4852$. Substitute three different $Q$ into $\sum_z Q(z)\log\frac{p(x,z)}{Q(z)}$:

| $Q$ | The two ratios $p(x,z)/Q(z)$ | Lower bound |
|---|---|---|
| $(0.5,\,0.5)$ | 0.399, 0.054 | −1.9189 |
| $(0.9,\,0.1)$ | 0.222, 0.270 | −1.4870 |
| $(0.881,\,0.119)$ (posterior) | 0.2265, 0.2265 | −1.4852 |

The first two are both below $-1.4852$, and the more the ratios disagree, the further the bound falls. With the posterior the two ratios are equal, both equal to $p(x)$, and the bound touches exactly.

**M-step.** The effective counts $N_j=\sum_i w_j^{(i)}$ are $(2.365,\,1.635)$.

$$
\phi=\Big(\frac{2.365}{4},\frac{1.635}{4}\Big)=(0.591,\,0.409)
$$

$$
\mu_1=\frac{0.982\cdot0+0.881\cdot1+0.5\cdot2+0.002\cdot5}{2.365}=0.800,\qquad\mu_2=3.736
$$

The variances are computed with the new means: $\sigma^2=(0.603,\,2.596)$.

**Checking the chain of inequalities.** Computing the lower bound with the new parameters $\theta_{t+1}$ and the old $w$ gives $L_t(\theta_{t+1})=-7.398$; recomputing the log-likelihood gives $\ell(\theta_{t+1})=-7.335$.

$$
\underbrace{-7.335}_{\ell(\theta_{t+1})}\;\ge\;\underbrace{-7.398}_{L_t(\theta_{t+1})}\;\ge\;\underbrace{-8.608}_{L_t(\theta_t)}\;=\;\underbrace{-8.608}_{\ell(\theta_t)}
$$

All three relations hold. What the result means: the first cluster's center moves from 1 to 0.8 and narrows to wrap around $0,1$, the second cluster's center moves toward $5$ and widens, and the log-likelihood of the data under the new model goes up by 1.27. The gap in the middle inequality, $-7.335-(-7.398)=0.063$, is how far the lower bound is from tight at the new position. The next E-step recomputes $w$ and closes it again.

One caution the lecture doesn't cover: this dataset has only four points, and if you keep the program running, the second cluster shrinks to the single point $x=5$, its variance goes to zero, and the likelihood shoots off to infinity. This is a known degenerate case of fitting Gaussian mixtures by maximum likelihood. It doesn't conflict with EM's monotonicity (the likelihood really does rise all the way); it is only a reminder not to read the later rounds of an example this small as a sensible clustering.

## Which direction PCA is looking for

(Recording 48:05–56:15)

The second half changes topic. The lecturer positions PCA as an everyday tool: "PCA is a workhorse algorithm. I use it all the time." (00:00:05) It is often misused, and he says that is because so many people use it.

The example is two quantities for cars: city mileage and highway mileage, in miles per gallon. In a scatter plot, SUVs and trucks land at the poor-mileage end, economy cars in the middle, and hybrids at the good end, and the whole cloud stretches along a diagonal. That diagonal means "how fuel-efficient the car is overall," and it is the first principal component direction $u_1$ we are after. The direction $u_2$ perpendicular to it is roughly "the gap between highway and city performance," which the lecturer himself says is more of a story than a formal statement.

A bit more formally: we want a set of orthonormal unit vectors $u_1,u_2,\dots$, where $u_1$ captures the largest variation in the data, $u_2$ the next largest, and so on. Any point can be written in this basis as $x=\alpha_1u_1+\alpha_2u_2+\cdots$. In high dimensions, keeping only the first few terms is dimensionality reduction.

Two preprocessing steps come before anything else.

**Centering.** Subtract the overall mean from every point so the data has mean zero. PCA looks for "the direction of greatest variance," and variance is measured relative to the mean. Without centering, when the whole cloud sits far from the origin, the direction that comes out points toward the center of the cloud instead of along the direction in which the cloud itself is most spread out. In the lecturer's words: "if you don't center, it will go wrong." (00:52:09)

**Scaling.** When coordinates have different units, first divide each coordinate by its spread. The lecturer's example is feet and miles: the same distance expressed in feet is a number about five thousand times larger than in miles (1 mile is 5,280 feet), so that coordinate's variance is inflated until it swamps the others, and PCA mistakes it for the main direction. Chapter 12 of the notes says to subtract the mean from each coordinate and divide by the standard deviation, so every coordinate has variance 1. What the lecturer says aloud is "scale them by the variance"; go with the standard deviation in the notes.

Later (around 1:05:36) a student asks whether this is z-scoring and what to do with missing values. The lecturer says that strictly speaking neither step is mandatory ("technically not necessary"), but they are the basic preprocessing that real data most often needs, and other steps can be layered on top. PCA itself doesn't handle missing values. The common approach is to impute them first, the cruder one is to throw away the rows with missing values, and this course doesn't say much about missing data.

## The closest point on a line, and why maximum variance equals minimum residual

(Recording 56:15–1:02:30)

Start with a small problem. Given a unit vector $u$, the line is $\{tu:t\in\mathbb R\}$. Which point on the line is closest to $x$? Call that point $\alpha u$ and minimize

$$
\|x-\alpha u\|^2=\|x\|^2+\alpha^2\|u\|^2-2\alpha\,u^\top x=\|x\|^2+\alpha^2-2\alpha\,u^\top x
$$

The second equality uses $\|u\|=1$. This is an upward-opening quadratic in $\alpha$. Differentiate with respect to $\alpha$ and set to zero:

$$
2\alpha-2u^\top x=0\quad\Longrightarrow\quad\alpha=u^\top x
$$

So the closest point is $(u^\top x)\,u$, the orthogonal projection of $x$ onto $u$. A student asks how this differs from computing the projection directly. The lecturer says it doesn't; the derivation just lets the projection formula fall out on its own.

The same approach extends to the subspace spanned by $k$ orthonormal vectors $u_1,\dots,u_k$. When you expand $\|x-\sum_j\alpha_ju_j\|^2$, the cross terms $u_j^\top u_l$ ($j\ne l$) vanish by orthogonality, leaving a separate quadratic for each $\alpha_j$, with solution $\alpha_j=u_j^\top x$. This is where orthogonality is used; without it the coefficients would be tangled together.

The lecturer then shows a figure of data points, a line, and residuals and states the conclusion outright: maximizing the variance after projection is the same as minimizing the perpendicular residuals. The step in between is not written out in class, and what follows is added in this article. Substitute $\alpha=u^\top x$ back into the distance formula to get the residual (the squared distance from the point to the line):

$$
\|x-(u^\top x)u\|^2=\|x\|^2-(u^\top x)^2
$$

$\|x\|^2$ does not depend on the choice of $u$. Summing over all data points, $\sum_i\|x^{(i)}\|^2$ is fixed, so

$$
\min_{\|u\|=1}\sum_{i=1}^n\big\|x^{(i)}-(u^\top x^{(i)})u\big\|^2\quad\Longleftrightarrow\quad\max_{\|u\|=1}\sum_{i=1}^n(u^\top x^{(i)})^2
$$

The left side is "make the perpendicular residuals as small as possible" and the right side is "make the projected variance as large as possible." They are the same problem. Later a student gets tangled in this statement, thinking that a large residual means a large variance, so why would the two objectives agree. The lecturer clarifies: what is maximized is the part **explained** by the projection direction, what is minimized is the part **left over**, and the two add up to a constant.

The right-hand expression also shows why scale causes trouble. A point with an unusually large value in one coordinate contributes an unusually large amount to $(u^\top x^{(i)})^2$, and $u$ gets pulled toward that coordinate.

## Eigendecomposition turns the problem into allocating weight

(Recording 1:02:30–1:13:45)

Next comes a stretch of linear algebra. The lecturer first treats a general symmetric matrix $A$, and only in the next section says which matrix $A$ is in PCA.

A symmetric square matrix $A\in\mathbb R^{d\times d}$ can be decomposed as

$$
A=U\Lambda U^\top,\qquad U^\top U=I,\qquad\Lambda=\mathrm{diag}(\lambda_1,\dots,\lambda_d),\quad\lambda_1\ge\lambda_2\ge\cdots\ge\lambda_d
$$

The columns $u_1,\dots,u_d$ of $U$ are orthonormal eigenvectors, and the $\lambda_i$ are the corresponding eigenvalues, sorted from largest to smallest by convention. To verify: $U^\top u_i=e_i$ (the $i$-th standard basis vector), so

$$
Au_i=U\Lambda U^\top u_i=U\Lambda e_i=\lambda_i\,Ue_i=\lambda_iu_i
$$

The problem to solve now is $\max_{\|v\|=1}v^\top Av$. In class the vector being maximized over is written $x$; to avoid a clash with the data points, it is called $v$ here. Because $u_1,\dots,u_d$ form a basis, $v$ can be written $v=\sum_j\alpha_ju_j=U\alpha$. Substituting:

$$
v^\top Av=\alpha^\top U^\top\,U\Lambda U^\top\,U\alpha=\alpha^\top\Lambda\alpha=\sum_{j=1}^d\lambda_j\alpha_j^2
$$

This uses $U^\top U=I$ twice. Likewise $\|v\|^2=\alpha^\top U^\top U\alpha=\sum_j\alpha_j^2$. So the original problem becomes

$$
\max_{\alpha}\;\sum_{j=1}^d\lambda_j\alpha_j^2\qquad\text{subject to}\quad\sum_{j=1}^d\alpha_j^2=1
$$

This is allocating one unit of weight: each share of weight placed on direction $j$ pays back $\lambda_j$. $\lambda_1$ is the largest, so put all the weight on the first direction: $\alpha=e_1$, $v=u_1$, and the maximum is $\lambda_1$. As an inequality, $\sum_j\lambda_j\alpha_j^2\le\lambda_1\sum_j\alpha_j^2=\lambda_1$.

The lecturer presses further: what if $\lambda_1=\lambda_2$? $u_1$ is still a solution, but every unit vector in the plane spanned by $u_1,u_2$ is just as good, and "the first principal component" is no longer a direction but a whole subspace. The worse case is when two eigenvalues are close. In theory there is a unique solution; in practice a small change in the data can rotate the computed direction somewhere else in that plane. This comes back below in the discussion of PCA's risks.

## That matrix is the covariance matrix

(Recording 1:13:45–1:14:55)

Back to the PCA objective. Dividing by $n$ doesn't move the location of the maximum:

$$
\frac1n\sum_{i=1}^n(u^\top x^{(i)})^2=\frac1n\sum_{i=1}^nu^\top x^{(i)}x^{(i)\top}u=u^\top\Big(\frac1n\sum_{i=1}^nx^{(i)}x^{(i)\top}\Big)u=u^\top\Sigma u
$$

The first equality writes the scalar $(u^\top x)^2$ as $(u^\top x)(x^\top u)$, and the second pulls $u$, which doesn't depend on $i$, outside the sum. The matrix in the middle, $\Sigma=\frac1n\sum_ix^{(i)}x^{(i)\top}$, is the empirical covariance matrix when the data has mean zero. The definition of covariance has $(x-\mu)(x-\mu)^\top$; there is no $\mu$ here because it has already been subtracted. That is the mathematical reason for centering: without subtracting the mean, this matrix can't be read as a covariance.

$\Sigma$ is symmetric, so the previous section's conclusion applies: the unit vector that maximizes $u^\top\Sigma u$ is the eigenvector of $\Sigma$ with the largest eigenvalue. For $k$ directions, take the top $k$ eigenvectors. The lecturer says the multi-dimensional case is the same argument with vectors replaced by matrices, and skips it in class. This also ties back to the remark at the start: the axes of a GMM's ellipse are eigenvectors of the covariance matrix, and PCA is looking for the same kind of object.

The lecturer refers to centering here as "whiten." In common usage, whitening means going one step further and making the covariance the identity matrix, which is more than subtracting the mean. Here he only means subtracting the mean.

### Numerical example: PCA on four cars

This is an example made up for this article, not from the lecture. The numbers were checked separately in Python.

Four cars with (city, highway) mileage: $(27,32)$, $(26,33)$, $(23,30)$, $(24,29)$.

**Centering.** The mean is $(25,31)$. Subtracting it gives $(2,1)$, $(1,2)$, $(-2,-1)$, $(-1,-2)$.

**Covariance matrix.** The sum of squares of the first coordinate is $4+1+4+1=10$, the second is also 10, and the sum of cross products is $2+2+2+2=8$. Divide each by 4:

$$
\Sigma=\begin{pmatrix}2.5&2\\2&2.5\end{pmatrix}
$$

**Eigendecomposition.** $\Sigma\begin{pmatrix}1\\1\end{pmatrix}=\begin{pmatrix}4.5\\4.5\end{pmatrix}$ and $\Sigma\begin{pmatrix}1\\-1\end{pmatrix}=\begin{pmatrix}0.5\\-0.5\end{pmatrix}$, so $\lambda_1=4.5$ with $u_1=\frac{1}{\sqrt2}(1,1)$, and $\lambda_2=0.5$ with $u_2=\frac{1}{\sqrt2}(1,-1)$.

**Checking the objective.** The projections of the four points onto $u_1$ are $\pm3/\sqrt2$, each with square 4.5, so the average is 4.5, equal to $\lambda_1$. Along the coordinate axis $(1,0)$ the average squared projection is only 2.5; along the 30-degree direction it is 4.23. Both are smaller than 4.5.

**Residuals.** Every point has $\|x\|^2=5$, of which 4.5 is explained along $u_1$, leaving a residual of $5-4.5=0.5$, which is exactly the square of its projection onto $u_2$.

**What the result means.** $u_1$ is the direction in which "city and highway improve together," and it accounts for $4.5/(4.5+0.5)=90\%$ of the total variance. If you keep only one number per car, $u_1^\top x$ preserves ninety percent of the variance.

**What happens without centering.** Computing $\frac1n\sum_ix^{(i)}x^{(i)\top}$ straight from the raw data gives $\begin{pmatrix}627.5&777\\777&963.5\end{pmatrix}$, whose first eigenvector is $(0.628,0.778)$. Normalizing the mean $(25,31)$ gives $(0.628,0.778)$, almost identical. The reason is that this matrix equals $\Sigma+\mu\mu^\top$, and $\mu\mu^\top$ is far larger in magnitude than $\Sigma$, so the computed "principal component" is only pointing at where the cloud is. In this example both directions are close to 45 degrees and look about the same, because city and highway mileage happen to be similar numbers. With data whose mean is at $(25,3)$ the difference would be obvious at a glance.

**What happens with different scales.** Multiply the first centered coordinate by 10 (as if the unit had changed) and $\Sigma$ becomes $\begin{pmatrix}250&20\\20&2.5\end{pmatrix}$, with first eigenvector $(0.997,0.080)$, lying almost along the first coordinate axis. The relationship in the data is unchanged and only the unit is different, yet the principal component gets dragged away.

## When PCA is unreliable, and how many directions to keep

(Recording 1:11:40–1:19:20)

With the derivation done, the places where PCA goes wrong can be listed. The lecturer names three: no centering, coordinates on different scales, and eigenvalues that are not separated. The first two appeared above. The third is the one he spends the most time on.

If the third eigenvalue is clearly larger than the fourth, the first three directions can be identified stably. If the leading eigenvalues are bunched together, PCA returns some basis of that subspace, and a different batch of data may return a different one. The subspace is stable; the coordinates are not. Suppose you run PCA on the training data and train a linear classifier on the reduced coordinates, and later new data arrives and you redo PCA. The same "first dimension" may no longer be the same direction, and the weights the classifier learned per coordinate no longer line up. So he says: "So using it for dimensionality reduction, I'm not a super fan of. You have to be careful about that if you do it." (01:14:56) This has to be read together with what came before. When he started on PCA he had called it "a very good dimensionality reduction technique" (00:48:06), and he often uses it himself to look at data. His reservation is about one use: handing the reduced coordinates to a downstream model when the eigenvalues are not separated. The conclusion is to be careful, not to avoid it.

How many directions should you keep? Look at the share of the sum of all eigenvalues taken by the top $k$. The lecturer asks the class: given a matrix, how do you compute the sum of all its eigenvalues efficiently? The answer is the trace, the sum of the diagonal entries, with no need for a full eigendecomposition. So it is enough to compute the top $k$ directions, multiply each by the matrix once to get $\lambda_i$ (since $\Sigma u_i=\lambda_iu_i$), and divide by $\mathrm{tr}(\Sigma)$ to see how much is explained. In the example above, $\mathrm{tr}(\Sigma)=2.5+2.5=5$ and $\lambda_1/5=90\%$. He also mentions that with large data, a "thin PCA" that computes only the first few directions can be quite cheap.

At the end a student asks why reduce dimensions at all; what's wrong with keeping them all? The answer has two layers. The everyday one: city mileage and highway mileage are really the same thing, and what you care about is whether the car is fuel-efficient. The general one: if the data nominally lives in a very high-dimensional space but actually lies close to a low-dimensional subspace, finding that subspace lets you make stronger inferences. A common pattern is that explained variance levels off quickly as the number of principal components grows, and the first few components explain most of the data.

In closing he looks at the two topics side by side. EM assumes probabilistic hidden structure behind the data (a few Gaussian light sources), and PCA assumes the subspaces in the covariance matrix are well separated. He says that for him these assumptions are the point: before you start, ask whether your data fits them. The slides also include a figure on denoising with PCA, which the lecture skips. This is also Chris Ré's last lecture of the term.

The [next lecture](/posts/ai/2026-10-12-stanford-cs229-lecture-11-diffusion-models-en) covers diffusion models and uses this lecture's ELBO directly: it treats the noised intermediate states as the latent variable $z$ and builds a lower bound on the likelihood with the same "multiply by $Q$, divide by $Q$, apply Jensen" move.

## Self-check

**1. A point has two possible values of $z$, with joint probabilities $p(x,z=1)=0.03$ and $p(x,z=2)=0.01$. Compute $\log p(x)$, the lower bound for $Q=(0.5,0.5)$, and the $Q$ that makes the bound tight.**

Answer: $p(x)=0.04$ and $\log p(x)=-3.219$. For $Q=(0.5,0.5)$ the lower bound is $0.5\log 0.06+0.5\log 0.02=-3.363$, which is below $-3.219$. The tight $Q$ is the posterior $(0.75,0.25)$, where the two ratios $0.03/0.75$ and $0.01/0.25$ are both $0.04$.

**2. Write the chain of inequalities that proves $\ell(\theta_{t+1})\ge\ell(\theta_t)$, and say which step uses tightness, which uses the lower bound, and which uses the M-step. If the M-step doesn't find the maximum and only finds a $\theta$ where $L_t$ is higher than at $\theta_t$, does the conclusion still hold?**

Criteria: the chain is $\ell(\theta_{t+1})\ge L_t(\theta_{t+1})\ge L_t(\theta_t)=\ell(\theta_t)$, using the lower bound, the M-step, and tightness, in that order. The answer to the second part is yes, because the middle step only needs $L_t(\theta_{t+1})\ge L_t(\theta_t)$, not a maximum. (The second part is an extension in this article; the lecture doesn't cover it.)

**3. In a one-dimensional GMM with two clusters, a point has Gaussian densities 0.3 and 0.1 under the two clusters, and $\phi=(0.2,0.8)$. What is its $w_1$ for the first cluster? How does that differ from the intuition you get from the densities alone?**

Answer: $w_1=\frac{0.2\times0.3}{0.2\times0.3+0.8\times0.1}=\frac{0.06}{0.14}=0.429$. From the densities alone you would say it is 75% in the first cluster, but the second cluster is four times as large, and the result leans slightly toward the second cluster instead.

**4. The covariance matrix of centered data is $\begin{pmatrix}5&3\\3&5\end{pmatrix}$. What is the first principal component direction? What share of the variance does it explain? What if the matrix is $\begin{pmatrix}4&0\\0&4\end{pmatrix}$?**

Answer: the eigenvalues are 8 and 2, $u_1=\frac1{\sqrt2}(1,1)$, and it explains $8/\mathrm{tr}=8/10=80\%$. The second matrix has two equal eigenvalues, every unit vector has $u^\top\Sigma u$ equal to 4, there is no unique first principal component, and which direction PCA returns depends on implementation details and numerical error.

**5. Explain in one sentence: why can $\Sigma_l^{-1}$ be cancelled when deriving $\mu_l$ in the M-step, while for $\phi_j$ you can't simply set the derivative to zero?**

Criteria: the first half should mention that $\Sigma_l^{-1}$ has full rank (is invertible), so if it times a vector is zero the vector must be zero; the second half should mention that $\phi$ is constrained to sum to 1, that without the constraint the objective has no critical point, and that Lagrange multipliers are needed.

## Corresponding reading

Main lecture notes (August 2026 version):

- Section 11.1, EM for mixture of Gaussians (pp.150–153): the GMM model setup and the E-step and M-step formulas. The update for $\Sigma_j$ is here.
- Section 11.2, Jensen's inequality (pp.153–154): the notes first give the convex version $\mathbb E[f(X)]\ge f(\mathbb E X)$ and then say in a Remark that the direction flips for concave functions. The lecture covers only the concave version.
- Section 11.3, General EM algorithms (pp.154–160): the single-point derivation, the definition of the ELBO, setting $Q$ to the posterior, and the chain of inequalities for monotonicity.
- Section 11.4, Mixture of Gaussians revisited (pp.160–162): the M-step derivations for $\mu_l$ and $\phi_j$.
- Chapter 12, Principal components analysis (pp.167–172).

Where the lecture and the notes differ:

- **Other forms of the ELBO are not covered.** Section 11.3.1 of the notes rewrites the ELBO as $\log p(x)-D_{KL}(Q\,\|\,p_{z\mid x})$, which shows directly that the bound is tight when $Q$ is the posterior. The lecture uses only the equality condition of Jensen.
- **VAEs are not covered.** Variational inference and the variational auto-encoder in Section 11.5 of the notes (pp.162–166) are outside this lecture.
- **The PCA proof takes a different route.** The notes use a footnote that asks the reader to solve $\max u^\top\Sigma u$ with Lagrange multipliers, giving $\Sigma u=\lambda u$. The lecture expands in the eigenbasis to get $\sum_j\lambda_j\alpha_j^2$ instead. The lecture's route has an extra payoff: you can see at once what happens when eigenvalues are equal or close.
- **The minimum-residual view.** The notes only say PCA can also be derived by minimizing approximation error and leave it to the homework. The lecture derives the projection formula for the closest point on a line and states verbally that the two objectives are the same; this article fills in the algebra for a single direction.
- **Different examples.** The notes use two readings of the same speed, in miles and in kilometers, and the skill and enjoyment of RC helicopter pilots. The lecture uses city and highway mileage.
- **Different attitudes toward dimensionality reduction.** The notes list "reduce dimensions with PCA, then do supervised learning" as a standard use. The lecturer has reservations about that use, because the coordinates are unstable when the eigenvalues are not separated.
- **An application in the notes but not the lecture.** The notes mention eigenfaces (reducing 100×100 face images and then matching them); the lecture doesn't.

**Series navigation**: Previous: [Lecture 9: k-means and Gaussian mixture models](/posts/ai/2026-10-12-stanford-cs229-lecture-09-k-means-gmm-en) | Next: [Lecture 11: diffusion models](/posts/ai/2026-10-12-stanford-cs229-lecture-11-diffusion-models-en)

## Course video sources

Original video: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 10: GMM (EM), PCA](https://www.youtube.com/watch?v=sUS-eTa0l6s)

- [Stanford CS229 Machine Learning | Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 course website](https://cs229.stanford.edu/)
- [CS229 main lecture notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

Checked: 2026-10-12.

Content check: verified against the video transcript (2026-10-12): the whole article was written against the full English captions of this video, and every quoted English sentence comes from the captions and carries a timestamp. I did not look at the board or the slides; the formulas are reconstructed from what is said in the captions and from Chapters 11 and 12 of the main notes. The Lagrange derivation for $\phi_j$ in the M-step and the update for $\Sigma_j$ are taken from the notes, and the two numerical examples were made up for this article.

## References

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 10: GMM (EM), PCA (YouTube)](https://www.youtube.com/watch?v=sUS-eTa0l6s): the main source for this article. The order of the lecture, the lecturer's wording, and the student questions all follow its English captions.
- [CS229 main lecture notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf): Chapter 11 (pp.150–166) supplies the ELBO notation, the chain of inequalities for monotonicity, and the M-step formulas for $\phi_j$ and $\Sigma_j$; Chapter 12 (pp.167–172) is used to compare PCA's preprocessing and proof route.
- [Stanford CS229 Machine Learning | Spring 2026 playlist](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw): to confirm the lecture number and the order of the neighboring lectures.
- [CS229 course website](https://cs229.stanford.edu/): course identity and the entry point to the notes.
- [Reading Stanford CS229: Course Overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): the overview and reading route for this series.
