---
title: "CS189 Spring 2026 Lec 4–7: K-means, Probability Review, MLE, Multivariate Gaussians and GMMs"
date: 2026-09-29
category: learning
tags: [berkeley, cs189, machine-learning, open-course, clustering, k-means, probability, unsupervised-learning]
lang: en
type: guide
difficulty: 進階
series:
  name: "Reading Berkeley CS189"
  order: 4
tldr: "Lectures 4–7 of CS189 Spring 2026 tie unsupervised learning into one thread. K-means clusters the data, then its weaknesses show up: hard assignments, no probabilistic framing, and a bias toward round clusters of similar size. The course reviews probability, introduces maximum likelihood estimation (MLE) and multivariate Gaussians, and rewrites K-means as a Gaussian mixture model (GMM). The GMM log-likelihood has no closed-form solution, and that gap leads the course to gradient descent. All four lectures have slides and video; Discussions 2–3 come with solutions and walkthroughs."
description: "A guide to Berkeley CS189 Spring 2026 Lectures 4 through the first half of 7, plus Discussions 2–3: the K-means objective and Lloyd's algorithm, the sum and product rules, the IID assumption, the MLE setup and its properties, dice MLE with Lagrange multipliers, multivariate Gaussians and covariance matrices, the GMM likelihood and its relation to K-means, and the matching Bishop sections."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-04-07-clustering-mle-gmm)

This post follows [CS189 Spring 2026](https://eecs189.org/sp26/) (Jennifer Listgarten / Alex Dimakis). For the choice of semester, see the [version map](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-course-map-en). The previous stretch is [Lec 1–3](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-01-03-framing-data-mechanics-en).

The first three lectures covered tools and workflow. Lecture 4 is where the course first needs probability, and the jump is steep. In two weeks you go from clustering to maximum likelihood estimation, multivariate Gaussians and mixture models. The thread through these four lectures is clear, though, because each step fixes a weakness of the one before:

**K-means can cluster → but it has no probabilistic framing → so review probability → estimate a distribution's parameters with MLE → which needs multivariate Gaussians → combine them into a GMM, a probabilistic K-means → the GMM has no closed-form solution → so you need gradient descent (in later lectures).**

Read the lectures along this line and they stop feeling like a pile of unrelated formulas.

| Lecture | Date | Materials | Recommended Bishop reading |
|---|---|---|---|
| Lec 4 Clustering, Probability Review | 1/29 | [PDF](https://drive.google.com/file/d/1wTPpXlfveaC1oOYA7Bohyea1WcBSDboS/view?usp=drive_link) / [video](https://www.youtube.com/watch?v=STdR9OyulZE&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE&index=4) | 2.1, 2.1.2, 2.1.3, 2.1.6, 2.2, 15.1 |
| Lec 5 Intro to MLE, Multivariate Gaussians, Mixture of Gaussians | 2/3 | [PDF](https://drive.google.com/file/d/1ma6N454MTVTgr5i5Ke8KHpVqc2OvFuX_/view?usp=drive_link) / [video](https://www.youtube.com/watch?v=kU7a1K3PX10&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE&index=4) | 2.3.2, 3.1.3, 3.2, 3.2.1, 3.2.7, Appendix C; optional 2.2.2, 3.2.9 |
| Lec 6 Multivariate Gaussians & Mixture of Gaussians | 2/5 | [PDF](https://drive.google.com/file/d/17KG62IaaWaIrAR_CyxABRAFfSVkmjHNU/view?usp=drive_link) / [video](https://www.youtube.com/watch?v=JzlMrqaa_-A&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE&index=5) | 2.2.2, 3.1.3, 3.2, 3.2.1, 3.2.9, 15.2, 15.3, Appendix C |
| Lec 7 Mixture of Gaussians & Linear Regression (first half only here) | 2/10 | [PDF](https://drive.google.com/file/d/1AWAHBb3kuA8qdYm5mIaCk8a8DVN4c1f5/view?usp=drive_link) / [video](https://www.youtube.com/watch?v=0YLmbbERr0g&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE&index=6) | 3.2.9, 15.2, 15.2.1 (linear regression is in the next post) |
| Discussion 2 | Week 3 | [Worksheet](https://drive.google.com/file/d/1MZs3r4ZOMhKUTAXjvLU9lxeCvGCUq1ND/view?usp=drive_link) / [Solutions](https://drive.google.com/file/d/1rGh1__n8Q7q9ScAJvSQWFsygwwsChh5V/view?usp=drive_link) / [Walkthrough](https://www.youtube.com/watch?v=Mf4deCkjUkQ&list=PL-ysCubq-Sa9uYDjsrzfmPCLLbjfOKVPd&index=3) | — |
| Discussion 3 | Week 4 | [Worksheet](https://drive.google.com/file/d/1PAxeqyZj4QAEW4tc7MBPKhhjMcz0rBoZ/view?usp=drive_link) / [Solutions](https://drive.google.com/file/d/11YV3yrkNRU5VclX8xDaAM5xX__gHMiK8/view?usp=drive_link) / [Walkthrough](https://www.youtube.com/playlist?list=PL-ysCubq-Sa-bRfFhYJkcJ-TDF3oTAWQj) | — |

## Course video sources

These recordings correspond to the material discussed here. No unverified timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=STdR9OyulZE
title: video
```

```youtube
url: https://www.youtube.com/watch?v=kU7a1K3PX10
title: video
```

Original videos: [video](https://www.youtube.com/watch?v=STdR9OyulZE)、[video](https://www.youtube.com/watch?v=kU7a1K3PX10)、[video](https://www.youtube.com/watch?v=JzlMrqaa_-A)、[video](https://www.youtube.com/watch?v=0YLmbbERr0g)

Course and recording entries:

- [Official course and recording entry](https://eecs189.org/sp26/)

## Lec 4, first half: K-means clustering

Lecture 4 sets unsupervised learning next to supervised learning. Supervised data comes as (xᵢ, yᵢ) pairs, while unsupervised data has only xᵢ. The slides list five unsupervised tasks: clustering, dimensionality reduction, representation learning, generative modeling and density estimation. The clustering examples include geyser eruption patterns, customer segments, disease subtypes, cell types in single-cell data and ancestry groups in genetic data.

Clustering has three goals: high similarity within clusters, low similarity across clusters, and the understanding that "similar" is in the eye of the beholder.

**K-means** is the most common centroid-based method. Each cluster is represented by a centroid cₖ, and the goal is to minimize the total squared distance from each point to its assigned centroid. The slides split this optimization into two sub-problems:

- If you know the clusters, the best centroid is the mean of the points in each cluster.
- If you know the centroids, the best clustering assigns each point to its nearest centroid.

Alternating these two steps is **Lloyd's algorithm**. Each step lowers the objective or leaves it unchanged, so the algorithm converges, but only to a local minimum. The slides then cover the four properties of a distance metric, including symmetry and the triangle inequality, and note in passing that KL divergence isn't symmetric and so isn't a distance. They also show an application: treat each pixel of an image as a vector in RGB space, run K-means to find a few representative colors, and repaint the image with them.

The weaknesses of K-means are the turning point of these four lectures. The slides list four: it can land in bad local minima; it isn't probabilistically framed, so its assumptions are hard to see; it implicitly assumes clusters of similar volume in a "blobby tessellation"; and every step makes a "hard" assignment, which is brittle. The slides preview the fix: **the Gaussian mixture model is a probabilistic version of K-means.**

**One thing to do tonight**: run `sklearn.cluster.KMeans` with K = 8 on the pixels of a photo, repaint the image with the centroid colors, then try three different `random_state` values and see whether the local-minimum problem shows up.

## Lec 4, second half: probability review

This part matches Bishop 2.1–2.2. The slides cover, in order:

- **Frequentist and Bayesian views**: the first treats probability as the long-run frequency of repeatable events; the second treats it as a degree of belief about uncertainty. The slides conclude that both are useful.
- **Joint distributions**: non-negative and summing to 1.
- **The sum rule (marginalization)**: sum over the other variables to get the distribution of a subset.
- **Conditional distributions and the product rule**: p(X, Y) = p(Y | X) p(X), which chains to factor any joint distribution into conditionals.
- **Independence**: p(X, Y) = p(X) p(Y).
- **The IID assumption**: when data are independent and identically distributed, the joint probability is the product of each point's probability. The slides ask a good question here: did K-means make this assumption?

An extra section uses wake-word detection to demonstrate Bayes' theorem. The wake word appears in only 0.01% of segments, and the detector has 99% recall and a 0.1% false-positive rate. Even so, when the detector fires, the chance someone actually said the wake word is only about 9%. The example makes prior, likelihood and posterior concrete in one go.

If this part feels hard, shore up your probability before moving on, because every lecture after this builds on it.

## Lec 5: maximum likelihood estimation

Lecture 5 opens with a problem: to estimate a GMM's parameters, we need multivariate Gaussians and an estimation method.

The slides first put supervised and unsupervised learning in one frame. Both have training data, a model class and a search for "good" parameters. Linear regression defines "good" with squared loss. What loss should a Gaussian's parameters use? The answer is the log-likelihood, which gives **MLE**. The slides point out that ChatGPT's pre-training is essentially MLE too: maximize the log probability of every word in every document on the internet.

The MLE setup assumes the data are IID samples from one member of a family of distributions, and finds the parameter θ that makes the observed data most probable. The slides list its properties. With more data it converges to the true value (consistency). It is statistically efficient. It is invariant to re-parameterization. And it still gives an estimate even when the data didn't come from the family, which is both a relief and a warning.

Two examples follow:

1. **A univariate Gaussian**: write the likelihood, take the log to turn the product into a sum, set the partial derivatives with respect to μ and σ² to zero, then check that it's a maximum.
2. **A six-sided die (multinomial)**: the face probabilities must sum to 1, so this is a constrained optimization that needs Lagrange multipliers. The answer is intuitive: each face's probability estimate is its count divided by the total number of rolls.

<details>
<summary>Deriving the dice MLE with a Lagrange multiplier (Bishop Appendix C)</summary>

Let nₖ be the number of times face k came up and N the total number of rolls. The log-likelihood is Σₖ nₖ log θₖ, subject to Σₖ θₖ = 1.

Form the Lagrangian: J(θ, λ) = Σₖ nₖ log θₖ + λ(1 − Σₖ θₖ).

- Setting the derivative with respect to λ to zero gives back the constraint.
- Setting the derivative with respect to θⱼ to zero: nⱼ / θⱼ − λ = 0, so θⱼ = nⱼ / λ.
- Substituting into the constraint: Σₖ nₖ / λ = 1, so λ = N.

Result: θₖ = nₖ / N.

</details>

The slides close with two points. First, the MLE for Gaussians, multinomials and linear regression has a closed form, but a neural network doesn't, so it needs iterative gradient descent. Second, squared loss itself can be derived from MLE, a thread picked up again in the linear regression lectures.

MLE gives a single point estimate, not a distribution over the parameter. Bayesian statistics instead produces a posterior distribution p(θ | D). The slides say a later lecture will come back to this.

## Lec 6: multivariate Gaussians and GMMs

The **multivariate Gaussian** extends the univariate Gaussian to d dimensions. The mean becomes a vector μ and the variance becomes a d×d covariance matrix Σ, which must be positive semi-definite. The slides note that multivariate Gaussians run through classical and modern ML: generative versus discriminative classification, PCA and autoencoders, and Gaussian process regression.

A height-and-weight example builds the intuition. Each variable is Gaussian on its own, but what about their joint distribution? If they're independent, the joint density is the product of two univariate densities. If not, imagine rotating the coordinate system until it's axis-aligned, after which the two dimensions separate into independent ones. The covariance matrix holds the covariance between each pair of variables.

Two facts to remember:

- Under a multivariate Gaussian, zero covariance holds if and only if the two components are independent. In general it only goes one way: independence implies zero covariance, but not the reverse.
- At its core the multivariate Gaussian is a quadratic form, so its contour lines are ellipses.

A **GMM** is a weighted sum of K Gaussians: p(x) = Σₖ πₖ 𝒩(x | μₖ, Σₖ), where the weights πₖ sum to 1 and are called mixing weights. Each cluster is now a Gaussian with two sets of parameters, a mean and a covariance.

For a single data point, its cluster zᵢ is a hidden variable, so you marginalize (sum) it out: p(xᵢ | θ) = Σₖ 𝒩(xᵢ | μₖ, Σₖ) αₖ. The log-likelihood of the whole dataset is Σᵢ log Σₖ(…). Because there's a sum inside the log, **there's no closed-form solution**, and you need iterative optimization.

Beyond clustering, a GMM has two more uses. Once you've estimated the parameters, you can compute p(x) for any point, which is density estimation. You can also sample a cluster by its weight and then sample from that cluster's Gaussian, which makes it a generative model.

## Lec 7, first half: wrapping up GMMs and a preview of gradient descent

The first half of Lecture 7 recaps the GMM likelihood and gives a quick sketch of gradient descent: initialize the parameters, pick a step size, and repeatedly update along the gradient until convergence. The slides say the full treatment comes later.

It then compares K-means and GMMs side by side:

- In the limit where the variances go to zero, a GMM becomes K-means.
- A separate covariance per cluster usually helps, since it can represent elliptical or elongated clusters.
- A GMM states its assumptions explicitly as statistical distributions, which makes it easier to generalize and easier to see what it assumes.
- There's a special form of MLE for latent variables called Expectation-Maximization, which the slides list as optional reading in Bishop 15.3–15.3.2.

The second half of Lecture 7 turns to linear regression, which the next post covers.

## Discussions 2 and 3

**[Discussion 2](https://drive.google.com/file/d/1MZs3r4ZOMhKUTAXjvLU9lxeCvGCUq1ND/view?usp=drive_link)** asks you to:

- Prove that a symmetric matrix is positive semi-definite if and only if all its eigenvalues are non-negative.
- Find the PDF of the minimum of three independent Unif[0, 1] random variables.
- Interpret what several matrices do as linear transformations, then write matrices for a rotation, two rotations in a row, and "add 1 to every coordinate".
- Place four deployed ML systems in the taxonomy: PayPal fraud protection, Amazon SageMaker customer grouping, Zillow Zestimate home valuation, and UCLA Health's Epic risk model.

**[Discussion 3](https://drive.google.com/file/d/1PAxeqyZj4QAEW4tc7MBPKhhjMcz0rBoZ/view?usp=drive_link)** asks you to:

- Prove that a symmetric matrix is positive definite if and only if it can be written as AAᵀ with A invertible.
- Prove that X is multivariate Gaussian if and only if every linear combination aᵀX is univariate Gaussian, using moment generating functions.
- Derive the MLE for μ and Σ of a multivariate Gaussian. The Lecture 7 slides say explicitly that this is left for discussion.
- Write down the K-means objective and prove that the algorithm converges in a finite number of iterations.

The MLE problem in Discussion 3 is the most important exercise in these four lectures. It applies the MLE recipe from Lecture 5 to the multivariate Gaussian from Lecture 6. The worksheet supplies the matrix-derivative identities, so you don't need to memorize them. Check your work against the [solutions](https://drive.google.com/file/d/11YV3yrkNRU5VclX8xDaAM5xX__gHMiK8/view?usp=drive_link), and watch the [walkthrough](https://www.youtube.com/playlist?list=PL-ysCubq-Sa-bRfFhYJkcJ-TDF3oTAWQj) if you get stuck.

## Self-study checklist

1. Watch Lecture 4 and run one round of Lloyd's algorithm by hand (five 1-D points, K = 2).
2. Read Bishop 2.1–2.2 until you can reproduce the 9% in the wake-word example yourself.
3. Watch Lecture 5, then derive the univariate Gaussian MLE without looking at the slides.
4. Watch Lecture 6. Use NumPy to draw 1,000 points from a 2-D Gaussian with three different covariance matrices and plot them to see how the ellipse turns.
5. Do Discussions 2 and 3, then check the solutions.
6. Cluster the same elongated dataset with `sklearn.mixture.GaussianMixture` and with `KMeans` and compare the results.

**Fall 2026 counterpart**: [Fall 2026](https://eecs189.org/fa26/) Lec 2 (KNN, ML Vocabulary, and K-Means), Lec 4 (Probability and Density Estimation), Lec 5 (Density Estimation and GMM), and Discussions 2 and 3.

## Series navigation

- Previous: [Lec 1–3: ML problem framing, data tools, terminology and techniques](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-01-03-framing-data-mechanics-en)
- Next: [Lec 7–10: linear regression, the geometry of least squares, regularization](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-07-10-linear-regression-en)
- Series entry: [version map](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-course-map-en)

## Further reading

- [Stanford CS109 L19: maximum likelihood estimation](/en/posts/learning/2026-08-22-stanford-cs109-lecture-19-maximum-likelihood-estimation-en): another take on MLE
- [Stanford CS109 L9: the normal distribution](/en/posts/learning/2026-08-22-stanford-cs109-lecture-09-normal-distribution-en): background on the univariate Gaussian
- [Stanford CS229 notes Ch. 4: generative learning algorithms](/en/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-04-generative-learning-algorithms-en): multivariate Gaussians used for classification

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS 189/289A Spring 2026 home page and schedule](https://eecs189.org/sp26/)
- [Spring 2026 Lecture 4: Clustering, Probability Review (PDF)](https://drive.google.com/file/d/1wTPpXlfveaC1oOYA7Bohyea1WcBSDboS/view?usp=drive_link), [video](https://www.youtube.com/watch?v=STdR9OyulZE&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE&index=4)
- [Spring 2026 Lecture 5: MLE and Multivariate Gaussians (PDF)](https://drive.google.com/file/d/1ma6N454MTVTgr5i5Ke8KHpVqc2OvFuX_/view?usp=drive_link), [video](https://www.youtube.com/watch?v=kU7a1K3PX10&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE&index=4)
- [Spring 2026 Lecture 6: Multivariate Gaussians & Mixture of Gaussians (PDF)](https://drive.google.com/file/d/17KG62IaaWaIrAR_CyxABRAFfSVkmjHNU/view?usp=drive_link), [video](https://www.youtube.com/watch?v=JzlMrqaa_-A&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE&index=5)
- [Spring 2026 Lecture 7: Mixture of Gaussians & Linear Regression (PDF)](https://drive.google.com/file/d/1AWAHBb3kuA8qdYm5mIaCk8a8DVN4c1f5/view?usp=drive_link), [video](https://www.youtube.com/watch?v=0YLmbbERr0g&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE&index=6)
- [Spring 2026 Discussion 2 worksheet](https://drive.google.com/file/d/1MZs3r4ZOMhKUTAXjvLU9lxeCvGCUq1ND/view?usp=drive_link), [solutions](https://drive.google.com/file/d/1rGh1__n8Q7q9ScAJvSQWFsygwwsChh5V/view?usp=drive_link), [walkthrough](https://www.youtube.com/watch?v=Mf4deCkjUkQ&list=PL-ysCubq-Sa9uYDjsrzfmPCLLbjfOKVPd&index=3)
- [Spring 2026 Discussion 3 worksheet](https://drive.google.com/file/d/1PAxeqyZj4QAEW4tc7MBPKhhjMcz0rBoZ/view?usp=drive_link), [solutions](https://drive.google.com/file/d/11YV3yrkNRU5VclX8xDaAM5xX__gHMiK8/view?usp=drive_link), [walkthrough](https://www.youtube.com/playlist?list=PL-ysCubq-Sa-bRfFhYJkcJ-TDF3oTAWQj)
- [Bishop & Bishop, Deep Learning: Foundations and Concepts](https://www.bishopbook.com)
- [CS 189 Fall 2026 site](https://eecs189.org/fa26/)
