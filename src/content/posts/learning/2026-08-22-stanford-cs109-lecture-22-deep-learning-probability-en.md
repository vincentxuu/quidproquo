---
title: "Stanford CS109 Lecture 22 | Deep Learning: Derive backpropagation with the chain rule"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, deep-learning]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 23
tldr: "A neural network stacks logistic units; a forward pass computes probabilities, while backpropagation reuses output error to obtain every gradient."
description: "A problem-by-problem guide to Stanford CS109 Summer 2026 Lecture 22: softmax, forward passes, backpropagation, and multi-class likelihood."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-22-deep-learning-probability)

This is article 23 in [Reading Stanford CS109](/series/stanford-cs109), covering **Summer 2026 Lecture 22: Deep Learning** (Jul 30), taught by Chris Gregg. It follows the official [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture22-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture22-AnswerKey.pdf), and [LLM guide](https://web.stanford.edu/class/cs109/worksheets/Lecture22-LLMPrompts.pdf).

This remains **L2**. The four-page worksheet has P1–P7 plus an optional multi-class challenge; the five-page key answers every problem with no pset omission. The three-page guide has six concepts. Current slides are unavailable and video is Canvas-gated.

## P1: Calibration and baselines

Among 60 predictions near 0.8, only 36 are positive, an observed fraction of 0.60. The bucket is uncalibrated and overconfident. Since 70% of the dataset is label 1, the always-positive baseline scores 0.70. Calibration constrains what a probability means, not whether thresholded decisions beat a baseline.

## P2: Softmax

Softmax is softmax(z)ₖ=e^zₖ/Σⱼe^zⱼ. It maps [7,7,7,7] to [0.25,0.25,0.25,0.25], and [1,3,0] to approximately [0.114,0.844,0.042]. Positive exponentials make every output positive and the common denominator makes them sum to one; the largest score gets the largest probability and no finite score receives exact zero.

For two classes, dividing by e^z₁ gives e^z₁/(e^z₁+e^z₂)=1/(1+e^{-(z₁-z₂)})=σ(z₁-z₂). Sigmoid is to Bernoulli as softmax is to Categorical. Renormalized sigmoids also yield probabilities, but lose the log-likelihood concavity used by the course.

## P3: Counting parameters

With 40 inputs, 20 hidden units, and one output, excluding bias, the first layer has 40×20=800 weights and the second has 20, totaling 820. Adding another 20-unit layer gives 800+400+20=1220. Biases for the original network add 21 parameters, totaling 841; each is the logistic-regression intercept weight on a constant input.

## P4: A forward pass

For bias-prepended x=[1,1,0], the hidden weighted sums are 2 and 0, hence h₁=0.8808 and h₂=0.5. The output sees h=[1,0.8808,0.5], giving z⁽²⁾=1.2616 and ŷ=0.7793. With y=1, LL=ln(0.7793)≈-0.2494.

The pass evaluates three logistic regressions: two hidden neurons using x, and one output neuron using hidden activations. “Learning features” means outputs from one layer become inputs to the next.

## P5: Output-layer backpropagation

The Bernoulli likelihood is unchanged from Lecture 20. Chain-rule sigmoid factors cancel:

    ∂LL/∂θⱼ⁽²⁾ = hⱼ(y-ŷ)

Here y-ŷ=0.2207, so bias-inclusive gradients are [0.2207,0.1944,0.1103]. An η=1 update raises ŷ to about 0.8467 and LL from -0.2494 to about -0.1664. The output layer only sees h, making this the logistic gradient with xⱼ replaced by hⱼ.

## P6: Hidden-layer backpropagation

A buried weight affects zⱼ⁽¹⁾→hⱼ→z⁽²⁾→ŷ→LL. Multiplying four local derivatives yields:

    ∂LL/∂θⱼ,ₖ⁽¹⁾ = (y-ŷ)θⱼ⁽²⁾hⱼ(1-hⱼ)xₖ

For x₁=1, the two requested gradients are approximately 0.0463 and 0.0552. Although h₂ has a smaller outgoing weight, h₂=0.5 lies at sigmoid's most sensitive point; h₁ is partly saturated. When x₂=0, its corresponding gradient is zero.

Backpropagation computes error at the output and sends it leftward through local derivatives. Reusing that signal avoids restarting differentiation for every weight. Tiny derivatives near saturated activations also reveal the source of vanishing gradients.

## P7: Deep learning is MLE

The lecture's conclusion is: **Deep learning is maximum likelihood estimation with neural networks.** The steps remain: state a probability model, write all-data log-likelihood, then differentiate with respect to every parameter and optimize by gradient ascent.

A binary network and logistic regression both assume Y|X=x~Bern(ŷ); only the function computing ŷ changes from one layer to a composition. Neural-network objectives are non-concave, with local optima and saddle points, so initialization matters. Removing hidden nonlinearities collapses the composition of linear maps into one linear map and reduces the network to an elaborate logistic regression.

## Optional challenge: Multi-class log-likelihood

For softmax outputs and a one-hot label:

    LL = Σₖyₖlog ŷₖ = log ŷ_c

Only the correct class remains. At K=2 this is exactly Bernoulli log-likelihood. For the correct score, ∂LL/∂z_c=(1/ŷ_c)ŷ_c(1-ŷ_c)=y_c-ŷ_c; other classes also yield yₖ-ŷₖ. The recurring error-times-input form across Bernoulli, Categorical, and deep networks is structural rather than accidental.

## Guide unit: Six concepts

The guide covers softmax, stacked logistic units, deep-learning likelihood, output backpropagation, hidden backpropagation, and non-concave optimization. Compute a forward pass first, then write every partial derivative along the dependency chain. Stay at the CS109 MLE and chain-rule level rather than jumping to frameworks or transformers.

Finally compare logistic regression and networks by expressive power, parameter count, concavity, interpretability, and data demand. More parameters are not automatically better; deployment still requires Lecture 21's held-out evaluation, calibration, and fairness audit.

## Material boundaries

- The worksheet has P1–P7 plus a challenge; the five-page key answers all of them.
- The three-page guide has six concepts and no extra numbered unit.
- Current slides are unavailable and video is Canvas-gated; only public artifacts are used.

## References

- [Schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 22 page](https://web.stanford.edu/class/cs109/lectures/22-DeepLearning)
- [Worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture22-Worksheet.pdf)
- [Answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture22-AnswerKey.pdf)
- [LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture22-LLMPrompts.pdf)
- [Course reader](https://probabilitycoders.stanford.edu/spr26)
