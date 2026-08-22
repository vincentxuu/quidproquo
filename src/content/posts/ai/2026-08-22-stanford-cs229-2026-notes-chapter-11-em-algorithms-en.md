---
title: "EM Algorithms: From Gaussian Mixtures to VAEs"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, unsupervised-learning, em-algorithm, variational-inference, vae]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 12
tldr: "Chapter 11 starts from soft assignments in Gaussian mixtures, uses Jensen's inequality to construct the ELBO, interprets EM as alternating maximization over a variational distribution and model parameters, and extends the idea to VAEs through approximate posteriors and reparameterization."
description: "A reading of Chapter 11 in the 2026 CS229 notes: Gaussian mixtures, E- and M-steps, Jensen's inequality, the ELBO, monotone likelihood, variational inference, and VAEs."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-11-em-algorithms)

This is a chapter-by-chapter reading of Chapter 11, printed pages 150–166, in the 2026 [CS229 Lecture Notes](https://cs229.stanford.edu/main_notes.pdf) by Tengyu Ma and Andrew Ng. It is **not a reconstruction of any quarter's recordings**. The chapter's spine is simple: latent variables make direct maximum likelihood difficult; EM alternates posterior inference and parameter updates; VAEs extend that pattern to neural networks and continuous latent variables.

## Gaussian mixtures hide the component labels

A Gaussian mixture first samples $z\sim\operatorname{Multinomial}(\phi)$, then samples $x\sim\mathcal N(\mu_j,\Sigma_j)$ conditional on $z=j$. If every $z^{(i)}$ were observed, $\phi_j$ would be the fraction in component $j$, while $\mu_j$ and $\Sigma_j$ would be that component's empirical mean and covariance. With latent labels, however, the marginal likelihood contains a sum over components inside a logarithm, coupling the parameters and eliminating those simple closed forms.

EM alternates two operations:

$$
w_j^{(i)}=p(z^{(i)}=j\mid x^{(i)};\phi,\mu,\Sigma),
$$

$$
\phi_j\leftarrow\frac1n\sum_iw_j^{(i)},\qquad
\mu_j\leftarrow\frac{\sum_iw_j^{(i)}x^{(i)}}{\sum_iw_j^{(i)}}.
$$

The E-step computes posterior responsibilities. The M-step replaces the observed-label indicators with those fractional counts. This is a soft counterpart to Chapter 10's k-means: an observation can remain partly assigned to several components.

## Jensen's inequality constructs the ELBO

For a general latent-variable model, $p(x;\theta)=\sum_zp(x,z;\theta)$. Insert any distribution $Q(z)$ and apply Jensen's inequality to the concave logarithm:

$$
\log p(x;\theta)
=\log\sum_zQ(z)\frac{p(x,z;\theta)}{Q(z)}
\ge \sum_zQ(z)\log\frac{p(x,z;\theta)}{Q(z)}.
$$

The right side is the evidence lower bound. It becomes tight when $Q(z)=p(z\mid x;\theta)$ because $p(x,z;\theta)/Q(z)$ is then constant in $z$. The E-step tightens the bound at the current parameters; the M-step holds $Q$ fixed and raises the bound by changing $\theta$.

Giving every observation its own $Q_i$ makes EM alternating maximization of a dataset-level ELBO over $Q$ and $\theta$. Since the bound touches the old observed-data log-likelihood and the M-step cannot lower it, the likelihood is monotonically non-decreasing.

## Monotone improvement is not global optimality

The proof guarantees only that the likelihood sequence does not fall. Latent-variable objectives are usually non-convex, so different initializations can reach different local optima or stationary points. Gaussian mixtures can also develop degenerate components whose covariance approaches zero. Practical implementations use multiple starts, covariance floors, or priors.

EM also assumes that its posterior update is tractable. Gaussian mixtures permit an analytic $p(z\mid x)$; neural generative models generally do not. This limitation motivates variational inference.

## Variational inference restricts the posterior family

The ELBO also has the forms

$$
\operatorname{ELBO}(x;Q,\theta)
=\mathbb E_Q[\log p(x\mid z;\theta)]
-D_{KL}(Q\|p(z)),
$$

and $\log p(x)-D_{KL}(Q\|p(z\mid x))$. The latter shows that unrestricted ELBO maximization recovers the true posterior. When that posterior is intractable, we instead optimize over a manageable family $\mathcal Q$.

The VAE example uses $z\sim\mathcal N(0,I)$ and a neural decoder $g(z;\theta)$ for the Gaussian mean of $x$. An encoder maps $x$ to the mean and diagonal standard deviation of an approximate posterior. A diagonal Gaussian is an assumption chosen for tractability: it supports efficient density evaluation and sampling but may be far from the true posterior.

## Reparameterization lets gradients pass through sampling

Sampling directly from a distribution that depends on encoder parameters prevents us from naively moving the derivative inside the expectation. The VAE rewrites the sample as

$$
z^{(i)}=q(x^{(i)};\phi)+v(x^{(i)};\psi)\odot\xi^{(i)},
\qquad \xi^{(i)}\sim\mathcal N(0,I).
$$

Randomness now lives in parameter-independent $\xi$, while $z$ is differentiable in $\phi$ and $\psi$. Monte Carlo samples can estimate ELBO gradients for joint encoder and decoder training. Reparameterization does not make the posterior exact; it makes the chosen approximation trainable.

## Connections to adjacent chapters

This chapter generalizes the alternating updates of k-means, replacing hard labels with posterior responsibilities and grounding the procedure in the ELBO. Chapters 12 and 13 seek low-dimensional structure through linear algebra and independence. Chapter 14 reuses this chapter's variational machinery by treating an entire noising path as latent and deriving a diffusion denoising objective.

## Self-study exercise

Work through one EM iteration for a one-dimensional, two-component Gaussian mixture. Choose initial weights, means, and variances; compute responsibilities for four observations; then update means and mixture weights. Evaluate the observed-data log-likelihood before and after. Repeat from different initial means and compare the final solutions.

## References

- [CS229 Lecture Notes (2026), Chapter 11.1: Gaussian mixtures and EM](https://cs229.stanford.edu/main_notes.pdf#page=151)
- [CS229 Lecture Notes (2026), Chapters 11.2–11.4: Jensen's inequality, the ELBO, and general EM](https://cs229.stanford.edu/main_notes.pdf#page=154)
- [CS229 Lecture Notes (2026), Chapter 11.5: Variational inference, VAEs, and reparameterization](https://cs229.stanford.edu/main_notes.pdf#page=163)
