---
title: "k-means and Gaussian Mixture Models: How Do You Cluster Without Labels? | Stanford CS229 Lecture 9"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, unsupervised-learning, k-means, em-algorithm]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 9
tldr: "Lecture 9 starts from the two steps of k-means, assign and average, and explains why the algorithm always stops yet only reaches a local optimum. Replacing hard assignments with probabilities gives the Gaussian mixture model and the two steps of EM: an E-step that is Bayes' rule and an M-step that is a weighted average. The lecture ends with the picture behind EM, drawn with Jensen's inequality: each round builds a lower bound that touches the log-likelihood and climbs to its top. The full derivation waits for Lecture 10."
description: "A guide to Lecture 9 of Stanford CS229 (Spring 2026): the k-means algorithm and its convergence, initialization and the choice of k, the generative process and latent variables of the Gaussian mixture model, the two steps of EM, convex functions and Jensen's inequality, with two examples worked by hand."
draft: false
math: true
---

> 🌏 [中文版](/posts/ai/2026-10-12-stanford-cs229-lecture-09-k-means-gmm)

**Video status: Videos included.** This article is written from the English transcript of the Spring 2026 Lecture 9 recording published by Stanford Online, with notation checked against Chapter 10 and the first half of Chapter 11 of the 2026 main notes. I did not see the board, so the lecturer's hand-drawn figures are reconstructed from what he says about them.

This is Lecture 9 in the [Reading Stanford CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en) series, taught by Chris Ré. [The previous lecture](/posts/ai/2026-10-12-stanford-cs229-lecture-08-backpropagation-en) finished backpropagation and closed out supervised learning; this one starts taking the labels away. You need the Gaussian density, Bayes' rule, and Gaussian discriminant analysis (GDA) from Lecture 5, because the M-step here is almost exactly GDA's parameter estimation. By the end you should be able to run one round of k-means and one round of EM by hand, say what each one guarantees and does not guarantee, and see which step of EM Jensen's inequality is responsible for.

```youtube
url: https://www.youtube.com/watch?v=bSmIGBCoffA
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 9: K-Means and GMM (non-EM)
captions: en
```

The "non-EM" in the video title is easy to misread. This lecture does write out the E-step and M-step formulas for GMMs, and it draws the overall picture of EM. What it leaves out is the derivation of why those two steps perform maximum likelihood estimation, which belongs to [Lecture 10](/posts/ai/2026-10-12-stanford-cs229-lecture-10-em-pca-en).

## Without labels, the problem itself becomes ill-defined

(Recording 00:00–06:20)

The picture for supervised learning is easy to draw: positive and negative examples on a plane, and the goal is a line that separates them. Labels impose a strong structure, so "a good answer" means only one thing. Erase the labels and the same points are still there, but now you want to "describe the structure of this data": how many clumps there are and where each one sits. That goal has no single correct answer.

The lecturer states the cost plainly: unsupervised learning has to make stronger assumptions (for example, that the data really came from some generative process) and has to settle for weaker guarantees. GDA from Lecture 5 is the point of comparison. GDA also fits Gaussians to the data, but there the class of every point is known. This lecture is about what you can still do once that class label is gone.

He also says how he wants the lecture watched (around 02:00):

> The algorithms, you could just look up in five minutes. But why we think about these algorithms, why we pick them, that's what I want you thinking about during this lecture and next.

So every time a question like "how do I choose k" or "do these clusters mean anything" comes up later, his answer circles back to modeling assumptions.

## k-means: alternate between assigning and averaging

(Recording 06:20–13:55)

The input is $n$ unlabeled points $x^{(1)},\ldots,x^{(n)}\in\mathbb{R}^d$ and a positive integer $k$. The output is a cluster index $c^{(i)}\in\{1,\ldots,k\}$ for every point, where $c^{(i)}=j$ means point $i$ is assigned to cluster $j$.

The algorithm also introduces $k$ cluster centers $\mu_1,\ldots,\mu_k$, which are points in the same space. Place them at random, then repeat two steps:

**Assign**: each point picks the center closest to it.

$$
c^{(i)} := \arg\min_j \lVert x^{(i)}-\mu_j\rVert^2
$$

**Update the centers**: each center moves to the arithmetic mean of the points assigned to it.

$$
\mu_j := \frac{\sum_{i=1}^n \mathbf{1}\{c^{(i)}=j\}\,x^{(i)}}{\sum_{i=1}^n \mathbf{1}\{c^{(i)}=j\}}
$$

Squaring the distance or not makes no difference to the assignment, since you are only comparing which one is smaller; the square is there for the objective function that comes later. The stopping condition is natural: if a round produces exactly the same assignment as the round before, the centers will not move either, and running further only repeats the same state, so you can stop. The lecturer adds that in practice it is more common to run a fixed number of steps and call it done (around 20:30).

Someone in class asks: if the two centers end up in swapped positions, does it matter? It does not. Without labels, "cluster 1" and "cluster 2" are only indices. What matters is that the centers land in the right places.

### Working it by hand

The following example was made up for this article and is not from the lecture. Take six one-dimensional points $1, 2, 4, 7, 9, 10$ with $k=2$, and deliberately start with bad centers: $\mu_1=1$, $\mu_2=2$. The $J$ in the table is the total squared distance from every point to the center of its own cluster; the next section uses it.

| Step | Cluster 1 | Cluster 2 | $\mu_1$ | $\mu_2$ | $J$ |
|---|---|---|---|---|---|
| Assign | 1 | 2, 4, 7, 9, 10 | 1 | 2 | 142 |
| Update centers | 1 | 2, 4, 7, 9, 10 | 1 | 6.4 | 45.2 |
| Assign | 1, 2 | 4, 7, 9, 10 | 1 | 6.4 | 26.84 |
| Update centers | 1, 2 | 4, 7, 9, 10 | 1.5 | 7.5 | 21.5 |
| Assign | 1, 2, 4 | 7, 9, 10 | 1.5 | 7.5 | 15.5 |
| Update centers | 1, 2, 4 | 7, 9, 10 | 2.33 | 8.67 | 9.33 |
| Assign | 1, 2, 4 | 7, 9, 10 | 2.33 | 8.67 | 9.33 |

Check the second row: $\mu_2=(2+4+7+9+10)/5=6.4$, $J=0+4.4^2+2.4^2+0.6^2+2.6^2+3.6^2=45.2$. In the third row, $x=2$ is at distance 1 from $\mu_1=1$ and at distance 4.4 from $\mu_2=6.4$, so it switches to cluster 1, and $J$ drops by $4.4^2-1^2=18.36$.

In the last assignment no point changes cluster, and the algorithm stops. Two things are worth noticing. $J$ shrinks or stays flat at every step, falling from 142 all the way to 9.33. And $x=4$, the point caught in the middle, is not pulled back into the left cluster until the third round.

## Why it must stop, and why where it stops is not necessarily the best

(Recording 13:55–21:30)

The lecturer asks the class: does this algorithm stop? One student's answer is incomplete in the transcript; as the lecturer restates it, the gist is that the clustering is deterministic and the possible partitions eventually run out. He says that is the right direction but a piece is missing: having finitely many partitions does not rule out bouncing back and forth among a few of them. What fills the gap is a quantity that decreases monotonically. He states only the conclusion and sends everyone to the argument in the notes. Here it is in full.

Define the distortion function:

$$
J(c,\mu)=\sum_{i=1}^n \lVert x^{(i)}-\mu_{c^{(i)}}\rVert^2
$$

**The assignment step cannot increase $J$.** Hold $\mu$ fixed. $J$ is a sum of $n$ terms, and term $i$ depends only on $c^{(i)}$. Minimizing each term separately gives the minimum of the whole sum over $c$ for that fixed $\mu$.

**The update step cannot increase $J$.** Hold $c$ fixed and write $S_j$ for the set of points assigned to cluster $j$. The only part of $J$ that involves $\mu_j$ is $\sum_{i\in S_j}\lVert x^{(i)}-\mu_j\rVert^2$. Take the gradient with respect to $\mu_j$ and set it to zero:

$$
\nabla_{\mu_j}\sum_{i\in S_j}\lVert x^{(i)}-\mu_j\rVert^2=-2\sum_{i\in S_j}\bigl(x^{(i)}-\mu_j\bigr)=0
\quad\Longrightarrow\quad
\mu_j=\frac{1}{|S_j|}\sum_{i\in S_j}x^{(i)}
$$

This is a quadratic in $\mu_j$ that opens upward, so the solution is a minimum. That is where "take the average" comes from: under squared distance, the mean is the point that minimizes the total within-cluster distance. The notes call the two steps together coordinate descent on $J$.

**So it stops.** The notes go as far as "$J$ decreases monotonically, so the value of $J$ converges"; the finite-step argument below is an addition in this article. Fix one detail first: if a point is equally close to two centers during assignment, it stays in its current cluster (ties do not switch), and assume no cluster ever becomes empty. Then whenever a round's assignment differs from the previous one, some point has moved to a strictly closer center, $J$ has strictly decreased, and the update step that follows cannot add it back. On the other hand, a partition determines its centers, since they are the cluster means, and so it also determines the value of $J$ after the update. Suppose the same partition appeared twice. The two values of $J$ would have to be equal, yet every round in between changed the assignment and $J$ strictly decreased throughout, a contradiction. So each partition appears at most once, there are at most $k^n$ partitions, and the algorithm must reach "assignment unchanged" and stop after finitely many steps. Drop the ties-do-not-switch rule and the argument fails: the theoretical exception the notes mention is exactly the case where several partitions have equal $J$ and the algorithm bounces among them, which the notes say almost never happens in practice.

The lecturer warns that this argument says nothing about how fast the decrease is, and it can be very slow (around 15:25). A student worries that with spread-out data the centers will get dragged back and forth by a few points at the edge. Monotonicity guarantees that this cannot go on forever, but not that it ends quickly.

### Local optima and initialization

The second question: is the stopping point the global minimum of $J$? No. The lecturer's argument is that finding the optimal k-means solution is NP-hard, so an algorithm whose every step is cheap would be suspicious if it always found the optimum. What actually happens is that $J$ has several local minima and the algorithm gets stuck in one of them.

Here is an example made up for this article: four points $(0,0)$, $(0,1)$, $(4,0)$, $(4,1)$ with $k=2$. Splitting left and right gives centers $(0,0.5)$ and $(4,0.5)$; every point is 0.5 from its center, so $J=4\times0.25=1$. Splitting top and bottom gives centers $(2,0)$ and $(2,1)$; every point is 2 from its own center and $\sqrt{5}\approx2.24$ from the other one, so no point wants to switch, the algorithm stops here, and $J=4\times4=16$. Both are fixed points of the algorithm, and the second has 16 times the $J$ of the first.

Since both steps of the algorithm are deterministic, different outcomes can come from only one place: the step at the start that places the centers at random. That is why initialization matters, and it is the origin of the common practice of running several times from different starting points and keeping the run with the smallest $J$.

The lecturer then introduces k-means++ (around 18:30): Stanford graduate students proposed a way of choosing starting points that provably achieves a certain approximation ratio on any data, meaning the ratio of the solution's cost to the optimal cost is bounded above. He says this method is now the default in the Python package scikit-learn. In the [scikit-learn KMeans documentation](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html), the default value of `init` is indeed `'k-means++'`. An addition in this article: the authors of k-means++ are David Arthur and Sergei Vassilvitskii, and the paper was published in 2007; the "Vasily" that appears in the transcript here is the lecturer saying the second author's surname.

The lecturer's own conclusion for this segment is not about the cost itself, which he thinks is not necessarily a meaningful structure. His point is that initialization matters, and that there are clever ways to do it.

## When running k-means makes sense, and how to choose k

(Recording 21:30–29:40)

This segment is driven almost entirely by student questions. It has no formulas, and it is the part of the lecture closest to practice.

**When the data has no structure.** A student steers the discussion toward high-dimensional spaces. The lecturer first warns that high-dimensional intuition is strange: for random points, the nearest neighbor and the farthest neighbor are about the same distance away. Then he answers the core question: running k-means on a cloud of random, structureless points is a weird thing to do (around 22:33).

> If you have a spray of points that have no structure to them, k-means will return something, but it won't be meaningful.

k-means always returns $k$ clusters, and it will not tell you whether those clusters are real. The lecturer uses a talk he heard that day as an example: clustering gene expression is meaningful because biology gives reasons to believe homologous genes should cluster together, and because there are other methods to check it. He boils it down to two legitimate uses: getting a descriptive feel for the data, or cases where you know from elsewhere that clusters really exist.

**How to choose k.** The lecturer draws a figure which, judging from his description, is four small clumps of points that sit close together in pairs. Saying there are two clusters is fine, and so is saying there are four, while three leaves you unsure where to cut. Choosing $k$ is making a judgment about the world: "where the event happened and where it did not" is two clusters, and "I know there are five data sources" is five.

A student proposes comparing different values of $k$ by average cost. The lecturer asks the class what is wrong with that comparison, then says that a larger $k$ cuts the clusters finer, but that is not necessarily better. In terms of the $J$ from the previous section (an addition in this article): the optimal $J$ can only go down as $k$ grows, and in the extreme every point is its own cluster and $J=0$, so cost alone will always pick the largest $k$. Another student asks whether you can look for the bend in the cost curve. The lecturer acknowledges that the literature has tests of this kind, but in his own experience they do not help much (around 29:00):

> I'm just telling you intuitively I haven't found them to be particularly useful in my own work.

He puts more trust in side information beyond the model parameters, such as knowing in advance what shape the clusters should have. He also previews that PCA in the next lecture has a goodness-of-fit measure that really is useful, tied to how much variance the eigenvalues explain. One sentence of his from this segment works as a summary (around 24:34): "Machine learning only works under assumptions."

## Gaussian mixture models: turn "which cluster" into a probability

(Recording 29:40–36:20)

The lecturer introduces the second topic this way (29:38):

> This is basically going to be k-means with a little bit of annoying math and Bayes' rule.

His example comes from a friend at the University of Washington. A telescope photographs a patch of sky, and each × on the plate is one recorded photon at a position $(x,y)$ on the plane. There are several light sources in the sky. Some (he calls them quasars for the sake of argument) send photons that are numerous and tightly concentrated; others are spread out, shaped like a flattened disk, and lower in intensity. The goal is to attribute each photon to a source.

The difference from k-means lies in the points near a boundary. k-means forces a hard assignment: this point is cluster 1, and that is all there is to say. A Gaussian mixture model (GMM) lets you say "this point is 60% from source 1 and 40% from source 2", which amounts to computing a probability vector of length $k$, $P(z^{(i)}=j)$, for every point. This is called soft assignment.

The model makes three assumptions:

- The number of sources $k$ is known, as in k-means.
- Each source has a Gaussian shape, described by a mean $\mu_j$ and a covariance $\Sigma_j$; each source can have its own shape. The contours of a Gaussian are circles or ellipses that may be rotated, and the lecturer mentions three kinds: spherical, diagonal, and full covariance.
- How many points each source produces is unknown and has to be learned from the data.

## The generative model in one dimension and the latent variable

(Recording 36:20–49:30)

To write fewer symbols, the lecturer switches to one dimension. The model first says "how the data came about":

1. Flip an unfair coin to decide the source: $z^{(i)}\sim\text{Multinomial}(\phi)$, $\phi_j\ge0$, $\sum_j\phi_j=1$, $P(z^{(i)}=j)=\phi_j$. For example, $\phi=(0.6,0.4)$.
2. Draw a point from that source's Gaussian: $x^{(i)}\mid z^{(i)}=j\sim\mathcal{N}(\mu_j,\sigma_j^2)$.

The two steps together give the joint probability:

$$
P(x^{(i)},z^{(i)})=P(x^{(i)}\mid z^{(i)})\,P(z^{(i)})
$$

We see only the points $x^{(i)}$ on the number line, not which source each one was drawn from. That makes $z^{(i)}$ a latent variable: assumed to exist but never observed directly. The lecturer says that assuming there is a $z$ is morally the same as assuming there are $k$ clusters (around 45:00; "morally" is his word, used the way mathematicians use it informally, to say two statements amount to the same thing in spirit). The parameters to estimate are $\phi$, $\mu$, $\sigma^2$.

**If you could see $z$.** Then every point would have a color and the problem would fall back to GDA: collect the points of each color and compute their proportion, mean, and variance. The lecturer stresses that only one thing in this lecture is truly new, the absence of labels, and that every other part has been covered before. A student asks whether the sources have to share one variance as in GDA. They do not; each source can have a different shape.

**What to do without $z$.** The lecturer asks the class to guess. The plan they piece together is: start with a guess about the clusters, use it to compute the probability that each point belongs to each cluster, use those probabilities to re-estimate the cluster parameters, and go back and forth. The skeleton is the same as k-means, with "which center is closer" replaced by "under which source is this point more likely".

**What $\phi$ does.** A student asks how $\phi$ affects the estimates. The lecturer runs a thought experiment (around 47:00): a point falls exactly where the two Gaussian curves cross, so on density alone it is a toss-up. If you knew that source 2 produces 100 times as much data as source 1, where would you guess it came from? The class answers source 2. The inference you just made, he says, is Bayes' rule.

This article puts numbers on the thought experiment (made up here): $\mu_1=0$, $\mu_2=4$, $\sigma^2=1$ on both sides, the crossing point is $x=2$, and both densities are $\mathcal{N}(2;0,1)=\mathcal{N}(2;4,1)\approx0.054$. If $\phi=(0.5,0.5)$, the probability of coming from source 2 is 0.5. If $\phi=(1/101,\,100/101)$:

$$
P(z=2\mid x=2)=\frac{\frac{100}{101}\times0.054}{\frac{1}{101}\times0.054+\frac{100}{101}\times0.054}=\frac{100}{101}\approx0.990
$$

When the densities are equal, the decision rests entirely on $\phi$.

Earlier (around 43:00), answering another question about $\phi$, the lecturer clarifies in passing that $\phi$ does not count as a prior here: if someone simply told you 90/10, that would be prior knowledge; here $\phi$ is a parameter to be estimated from the data.

## EM for GMMs: the E-step is Bayes' rule, the M-step is a weighted average

(Recording 49:30–59:20)

The algorithm's name goes on the board first; why the steps are called Expectation and Maximization only becomes clear in the next lecture.

**E-step: guess the latent variables.** Given the current parameters $\phi,\mu,\sigma^2$, for every point $i$ and every source $j$, compute

$$
w_j^{(i)} := P\bigl(z^{(i)}=j\mid x^{(i)};\phi,\mu,\sigma^2\bigr)
$$

The model gives the forward direction $P(x\mid z)$, but what we need is the reverse, $P(z\mid x)$. Break it into three lines:

$$
\begin{aligned}
P(z^{(i)}=j\mid x^{(i)})
&=\frac{P(x^{(i)},z^{(i)}=j)}{P(x^{(i)})} \\
&=\frac{P(x^{(i)}\mid z^{(i)}=j)\,P(z^{(i)}=j)}{\sum_{l=1}^{k}P(x^{(i)}\mid z^{(i)}=l)\,P(z^{(i)}=l)} \\
&=\frac{\phi_j\,\mathcal{N}(x^{(i)};\mu_j,\sigma_j^2)}{\sum_{l=1}^{k}\phi_l\,\mathcal{N}(x^{(i)};\mu_l,\sigma_l^2)}
\end{aligned}
$$

The first line is the definition of conditional probability. In the second line the numerator uses the model's factorization, and the denominator writes the probability of $x^{(i)}$ as a sum over all possible sources, which marginalizes out the latent variable. The third line plugs in the model's two parts: $P(z=j)=\phi_j$, and $P(x\mid z=j)$ is the Gaussian density. Every term in the final expression can be computed directly from the current parameters.

**M-step: update the parameters using the guesses.** Read $w_j^{(i)}$ as "what fraction of point $i$ counts toward source $j$":

$$
\phi_j := \frac{1}{n}\sum_{i=1}^n w_j^{(i)},\qquad
\mu_j := \frac{\sum_{i=1}^n w_j^{(i)}x^{(i)}}{\sum_{i=1}^n w_j^{(i)}}
$$

The lecturer reads it this way: if $w$ took only the values 0 and 1, $\phi_j$ would be the share of all points in cluster $j$ and $\mu_j$ would be the k-means cluster center. Now a point can count half here and half there, so the proportion becomes the expected number of points divided by $n$, and the mean becomes a weighted mean. k-means does not need to estimate $\phi$; a GMM does.

A student points out that he left out the variance. He says it works the same way, as a weighted empirical estimate, and does not write the formula in class. From Section 11.1 of the main notes (in one dimension $\Sigma_j$ is just $\sigma_j^2$):

$$
\Sigma_j := \frac{\sum_{i=1}^n w_j^{(i)}\bigl(x^{(i)}-\mu_j\bigr)\bigl(x^{(i)}-\mu_j\bigr)^{\top}}{\sum_{i=1}^n w_j^{(i)}}
$$

Then go back to the E-step and repeat. The lecturer says these three update rules look for now as if they were written down on intuition, and that the next lecture derives why they are correct.

### One round of EM by hand

The following example was made up for this article. Use the same six points $1,2,4,7,9,10$ with $k=2$ and initial parameters $\phi=(0.5,0.5)$, $\mu=(2,8)$, $\sigma_1^2=\sigma_2^2=4$.

**E-step.** Because $\phi$ and $\sigma^2$ are the same on both sides, they cancel between numerator and denominator and only the exponential terms remain. Take $x=4$:

$$
w_1=\frac{e^{-(4-2)^2/8}}{e^{-(4-2)^2/8}+e^{-(4-8)^2/8}}=\frac{e^{-0.5}}{e^{-0.5}+e^{-2}}=\frac{1}{1+e^{-1.5}}\approx0.818
$$

All six points:

| $x$ | $w_1$ | $w_2$ |
|---|---|---|
| 1 | 0.998 | 0.002 |
| 2 | 0.989 | 0.011 |
| 4 | 0.818 | 0.182 |
| 7 | 0.047 | 0.953 |
| 9 | 0.002 | 0.998 |
| 10 | 0.001 | 0.999 |

**M-step.** The two columns sum to $2.855$ and $3.145$, so $\phi=(0.476,\,0.524)$. The mean is

$$
\mu_1=\frac{0.998\times1+0.989\times2+0.818\times4+0.047\times7+0.002\times9+0.001\times10}{2.855}\approx2.314
$$

The same calculation gives $\mu_2\approx8.391$, and the variance formula then gives $\sigma_1^2\approx1.87$ and $\sigma_2^2\approx2.83$. (The numbers in the table are rounded; working by hand from the table will differ in the third decimal place. The results above were computed from the unrounded values.)

**What this result means.** On the same data k-means stops at $\mu=(2.33,\,8.67)$. EM's $\mu_2$ sits further left at 8.39 because $x=4$ has 18% of its weight counted toward source 2 and pulls it left; in k-means that point belongs entirely to the left cluster. Both variances also come down from 4: the model finds that the data is more concentrated than the initial guess. Running further, the log-likelihood (defined in the last section) goes $-14.94$ (initial), $-14.22$, $-14.03$, $-13.99$, rising every round. Here that monotone rise is only something we observe; the reason for it is the subject of the last section.

The lecturer also describes aloud a phenomenon that k-means does not have (around 58:30): because the shapes are being updated too, if a source is estimated as a very narrow ellipse, the density falls off quickly with distance along the narrow direction, and a point that did not look far away gets pushed, in probability, to another source. In a GMM, near and far depend on the covariance and cannot be judged by Euclidean distance alone.

Earlier, a student asks what happens if a source gets no points assigned to it. The lecturer says you would see it by running through the formulas, but he does not come back to it in this lecture. Reading it off the M-step formulas (this article's interpretation): that source's $\sum_i w_j^{(i)}$ goes to zero, $\phi_j$ goes to zero with it, and the denominator of $\mu_j$ also goes to zero, so the estimate becomes unstable.

## Convex functions and Jensen's inequality

(Recording 59:20–1:09:30)

The lecturer takes a detour here. His reason is that one step of the next lecture's derivation "moves" an expectation inside a function, that step is Jensen's inequality, and he wants the picture to be clear beforehand.

**Convex sets.** A set $\Omega$ is convex if, for any two points $a,b$ in it, the whole segment joining them lies in $\Omega$: for all $\lambda\in[0,1]$, $\lambda a+(1-\lambda)b\in\Omega$. A disk is convex; a shape with a notch is not. The condition has to hold for all pairs of points, so a single pair whose segment leaves the set is enough to make it non-convex.

**Convex functions.** Shade the region above the graph of the function, $\{(x,y):y\ge f(x)\}$ (textbooks call it the epigraph; the lecturer just calls it the graph when speaking). If that set is convex, $f$ is a convex function. The standard example is the bowl-shaped $x^2$. Two points on the graph, $(a,f(a))$ and $(b,f(b))$, are both in this set, the definition of a convex set says the segment joining them is in it as well, and "in it" means the $y$ coordinate is no lower than the function value:

$$
\lambda f(a)+(1-\lambda)f(b)\ \ge\ f\bigl(\lambda a+(1-\lambda)b\bigr)
$$

In other words, the chord lies above the graph of the function. If the chord dips below the graph at even one $z$, the function is not convex.

**The second-derivative test.** If $f$ is twice differentiable and $f''(x)\ge0$ everywhere, then $f$ is convex. (In the transcript the lecturer says "f prime"; from the Taylor expansion that follows and from the notes, he means the second derivative.) The transcript does not recover the details of what was on the board in this part, so the version below is this article's reconstruction from the three ingredients he states aloud: Taylor's theorem with remainder, the first-order terms canceling, and a nonnegative $c$ left over.

Let $z=\lambda a+(1-\lambda)b$. Expand to second order around $z$; there exist $\xi_a$, $\xi_b$ such that

$$
\begin{aligned}
f(a)&=f(z)+f'(z)(a-z)+\tfrac12 f''(\xi_a)(a-z)^2\\
f(b)&=f(z)+f'(z)(b-z)+\tfrac12 f''(\xi_b)(b-z)^2
\end{aligned}
$$

Multiply the first equation by $\lambda$ and the second by $1-\lambda$, then add. The coefficient of the first-order term is $\lambda(a-z)+(1-\lambda)(b-z)=\lambda a+(1-\lambda)b-z=0$, so it cancels exactly. What remains is

$$
\lambda f(a)+(1-\lambda)f(b)=f(z)+\underbrace{\tfrac12\Bigl[\lambda f''(\xi_a)(a-z)^2+(1-\lambda)f''(\xi_b)(b-z)^2\Bigr]}_{c\ \ge\ 0}
$$

$c$ is nonnegative because $f''\ge0$ is multiplied by squared terms. In class a student points out that the slide is missing the $\tfrac12$, and the lecturer acknowledges it on the spot. The lecturer calls the case $f''>0$ strongly convex; Section 11.2 of the main notes uses the term strictly convex and states the equality condition with it, so go by that term when reading the notes.

**Jensen's inequality.** For a convex function $f$ and a random variable $X$:

$$
\mathbb{E}[f(X)]\ \ge\ f(\mathbb{E}[X])
$$

Take the simplest $X$: it equals $a$ with probability $\lambda$ and $b$ with probability $1-\lambda$. Then $\mathbb{E}[X]=\lambda a+(1-\lambda)b$ and $\mathbb{E}[f(X)]=\lambda f(a)+(1-\lambda)f(b)$, and Jensen's inequality is word for word the chord inequality above. In the lecturer's words (around 1:07:40):

> Jensen's inequality is the definition of convexity. Sometimes it's presented as some mysterious consequence.

Going from two points to finitely many is by induction, and from there to the continuous case.

**Concave functions go the other way.** $f$ being concave means $-f$ is convex, and the inequality flips: $\mathbb{E}[f(X)]\le f(\mathbb{E}[X])$. The concave function this course uses most is $\log$, because what it works with is the logarithm of a probability. A linear function is both convex and concave, so both directions hold and you get equality, which is exactly linearity of expectation.

Check it once with numbers (made up for this article): $X$ takes the values 1 and 4 with probability one half each, so $\mathbb{E}[X]=2.5$.

- $f(x)=x^2$ (convex): $\mathbb{E}[f(X)]=(1+16)/2=8.5$, $f(\mathbb{E}[X])=6.25$, $8.5\ge6.25$.
- $f(x)=\log x$ (concave): $\mathbb{E}[\log X]=(0+1.386)/2=0.693$, $\log2.5=0.916$, $0.693\le0.916$.

A way to remember it: averaging first and then taking $\log$ gives the larger number; moving the $\log$ inside the expectation gives a smaller number, which is a lower bound.

## EM as maximum likelihood: a lower bound that touches

(Recording 1:09:30–1:16:20)

The last seven minutes put EM back into a familiar framework. Pack all the parameters into $\theta$; the log-likelihood of the data is

$$
\ell(\theta)=\sum_{i=1}^n\log p(x^{(i)};\theta),\qquad
p(x;\theta)=\sum_z p(x,z;\theta)
$$

The lecturer asks why this can be written as a sum. The student's answer is inaudible in the transcript; according to Section 11.3 of the main notes, the premise is that the $n$ data points are independent, so the joint probability is a product, and taking the log turns it into a sum. The second formula sums out the latent variable. The lecturer deliberately assumes $z$ is discrete here, and the notes remark that in the continuous case the sum becomes an integral.

The difficulty is that the $\log$ wraps a sum over $z$, so maximizing $\ell(\theta)$ directly is awkward. The picture the lecturer draws goes like this:

1. The horizontal axis is $\theta$; draw the wiggly curve $\ell(\theta)$. Start from a guess $\theta^{(t)}$.
2. Build a surrogate curve $L_t(\theta)$ with two properties: it is nowhere above $\ell$, and it touches $\ell$ at the current position.

$$
L_t(\theta)\le\ell(\theta)\ \ \text{for all}\ \theta,\qquad L_t(\theta^{(t)})=\ell(\theta^{(t)})
$$

3. $L_t$ has a downward-opening shape that is easier to optimize. Find its peak and take that as the next guess: $\theta^{(t+1)}=\arg\max_\theta L_t(\theta)$.
4. Build a new $L_{t+1}$ at $\theta^{(t+1)}$ and repeat.

This maps onto the two steps: the **E-step** builds $L_t$ given $\theta^{(t)}$; the **M-step** finds $\theta^{(t+1)}$ given $L_t$. The lecturer stresses that "$L_t$ is easier to maximize" is only a hope at this point and is not made good until the next lecture.

These two properties are already enough to show that the log-likelihood cannot go down. The chain below is this article's addition based on those two properties; the lecturer says only that the picture climbs upward, and the notes give the same argument in Section 11.3:

$$
\ell(\theta^{(t+1)})\ \ge\ L_t(\theta^{(t+1)})\ \ge\ L_t(\theta^{(t)})\ =\ \ell(\theta^{(t)})
$$

The first inequality uses "lower bound", the second uses "$\theta^{(t+1)}$ maximizes $L_t$", and the equality uses "touches at $\theta^{(t)}$". The rise $-14.94\to-14.22\to-14.03\to-13.99$ in the hand-worked example earlier is this chain at work.

**Does it reach the global maximum?** There is no guarantee. The lecturer gives two reasons: in the picture $\ell$ may be much higher somewhere else, and climbing locally cannot see that; and when $w$ is restricted to 0 and 1, EM degenerates into k-means, which already has the local-optimum problem, so EM cannot escape it either.

**Where Jensen comes in.** Up to this point the lecture has not said what $L_t$ actually looks like. As a preview, following Section 11.3 of the main notes (equations 11.6–11.7), for any probability distribution $Q$ over $z$:

$$
\log\sum_z p(x,z;\theta)=\log\sum_z Q(z)\frac{p(x,z;\theta)}{Q(z)}\ \ge\ \sum_z Q(z)\log\frac{p(x,z;\theta)}{Q(z)}
$$

The middle expression is "a $\log$ wrapping an expectation under $Q$", and the inequality is the concave version of Jensen: move the $\log$ inside the expectation and you get a lower bound. The notes call the right-hand side the ELBO (evidence lower bound). At the start of the lecture the lecturer mentions that his graduate students are writing an ELBO for a diffusion-style estimator (the transcript has "elbow"), and that is the same thing. How to choose $Q$ so that the bound touches, and why the choice turns out to be exactly the E-step's $w_j^{(i)}$, is the content of Lecture 10.

## Self-check

**1. k-means by hand.** Four one-dimensional points $0,2,3,10$ with $k=2$ and initial $\mu_1=0$, $\mu_2=3$. Run until it stops, and write down the clusters and centers in each round and the final $J$.

Answer: round one splits into $\{0\}$ and $\{2,3,10\}$ with centers $(0,5)$; round two gives $\{0,2\}$ and $\{3,10\}$ with centers $(1,6.5)$; round three gives $\{0,2,3\}$ and $\{10\}$ with centers $(1.67,10)$; in round four the assignment does not change, so it stops. $J=1.67^2+0.33^2+1.33^2+0\approx4.67$. $x=3$ does not switch until round three: it is at distance 2 from 1 and at distance 3.5 from 6.5.

**2. Explain convergence.** In your own words, explain why $J$ cannot increase in either the assignment step or the update step, and why that does not mean the best clustering has been found.

Criteria: for the assignment step, the answer should reach "with the centers fixed, each point picks its nearest one, so each term is minimized separately"; for the update step, "with the clusters fixed, the mean is the point that minimizes the sum of squared distances" (ideally with the gradient-equals-zero line written out). For the second part, you should be able to give two different fixed points, such as the four rectangle points in this article, and say that the difference comes from initialization.

**3. The E-step by hand.** $\mu_1=0$, $\mu_2=4$, $\sigma_1^2=\sigma_2^2=1$, and you observe $x=1$. Compute $w_1$ under $\phi=(0.5,0.5)$ and under $\phi=(0.1,0.9)$.

Answer: the density ratio is $e^{-0.5}:e^{-4.5}$. With equal $\phi$, $w_1=1/(1+e^{-4})\approx0.982$. With $\phi=(0.1,0.9)$, $w_1=1/(1+9e^{-4})\approx0.858$. Raising source 2's share to 90% pulls the probability that $x=1$ belongs to source 1 from 98% down to 86%; the point is much closer to $\mu_1$, so it still leans toward source 1.

**4. The direction of Jensen.** $X$ takes the values 2 and 8 with probability one half each. Compare $\mathbb{E}[\log X]$ and $\log\mathbb{E}[X]$, and explain why EM therefore gets a lower bound and not an upper bound.

Answer: $\mathbb{E}[\log X]=(\log2+\log8)/2=\log4\approx1.386$ and $\log\mathbb{E}[X]=\log5\approx1.609$. $\log$ is concave, so $\mathbb{E}[\log X]\le\log\mathbb{E}[X]$. The log-likelihood has the form "a $\log$ wrapping an expectation", and moving the $\log$ inside can only make it smaller, so you get a lower bound. Maximizing a lower bound is what makes sense, because it pushes the real objective up from below.

**5. Back to k-means.** If every $w_j^{(i)}$ computed in the E-step is 0 or 1, what does the M-step's $\mu_j$ become? What does a GMM estimate that k-means does not?

Answer: $\mu_j$ becomes the arithmetic mean of all points in cluster $j$, the same as the k-means update step. A GMM additionally estimates each source's share $\phi_j$ and shape $\Sigma_j$.

## Corresponding reading

- **Main notes, Chapter 10, Clustering and the k-means algorithm (pp. 147–149)**: the algorithm, the distortion function $J$, the coordinate descent argument, local optima and multiple restarts. In class the monotone decrease of $J$ is only mentioned aloud; the argument is in the notes. The notes do not have the discussions of k-means++, NP-hardness, how to choose $k$, or high-dimensional and structureless data; those are only in the lecture.
- **Section 11.1, EM for mixture of Gaussians (pp. 150–153)**: the definition of the GMM, the maximum likelihood solution when $z$ is known, and the complete E-step and M-step formulas (including $\Sigma_j$). The notes start from general $d$ dimensions; the lecture simplifies to a one-dimensional $\sigma^2$ and motivates the model with the photons-and-sources example, which is not in the notes.
- **Section 11.2, Jensen's inequality (pp. 153–154)**: the notes take $f''\ge0$ directly as the definition of a convex function and state the theorem, with one two-point figure. The lecture starts from convex sets and chords and shows how a Taylor expansion gets from $f''\ge0$ to convexity, which is not in the notes. The notes add the equality condition (under strict convexity, if and only if $X$ is constant); that condition is used in the next lecture when choosing $Q$, and the lecture does not mention it this time.
- **Section 11.3, General EM algorithms (from p. 154)**: the lecture gets only as far as the definition of the log-likelihood and the lower-bound picture, corresponding to equations (11.1)–(11.4) and the passage about repeatedly building a lower bound and then optimizing it. The derivation of the ELBO, the choice of $Q$, and the convergence proof are all in [Lecture 10](/posts/ai/2026-10-12-stanford-cs229-lecture-10-em-pca-en).

Series navigation: previous [Lecture 8: backpropagation](/posts/ai/2026-10-12-stanford-cs229-lecture-08-backpropagation-en) | next [Lecture 10: the EM algorithm and PCA](/posts/ai/2026-10-12-stanford-cs229-lecture-10-em-pca-en) | [course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en)

## Course video sources

Original video: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 9: K-Means and GMM (non-EM)](https://www.youtube.com/watch?v=bSmIGBCoffA)

- [Stanford CS229 Machine Learning | Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 course website](https://cs229.stanford.edu/)
- [CS229 main notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

Checked: 2026-10-12.

Content check: verified against the video transcript (2026-10-12): the whole article was compared section by section with this video's English transcript (about 77 minutes), and every quoted English sentence comes from the transcript. I did not see the board or the slides, so the lecturer's hand-drawn figures, the exact wording of the Taylor expansion slide, and a few student remarks the transcript marks as inaudible could not be confirmed.

## References

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 9: K-Means and GMM (non-EM)](https://www.youtube.com/watch?v=bSmIGBCoffA): the basis of this article; the order of the lecture, the lecturer's statements, and the quotations all come from its English transcript.
- [CS229 main notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf): Chapter 10 supplies the distortion function and the coordinate descent argument, Section 11.1 supplies the update rule for $\Sigma_j$, and Sections 11.2–11.3 supply the statement of Jensen's inequality and the preview of the next lecture.
- [scikit-learn: sklearn.cluster.KMeans](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html): confirms that the default value of `init` is `'k-means++'` (checked 2026-10-12).
- [Reading Stanford CS229: course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): the entry point to the series and where each lecture sits.
