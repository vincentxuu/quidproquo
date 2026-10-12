---
title: "RNN Language Models: Sequence Probabilities and Gradient Paths | CMU 10-423 Lecture 1"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, cmu, ai-course, rnn, language-model, n-gram, backpropagation, pytorch]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 1
tldr: "A sequence such as “I like cats” is not a bag of independent words."
description: "A teaching guide based on public Spring 2026 materials: RNN Language Models: Sequence Probabilities and Gradient Paths | CMU 10-423 Lecture 1"
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff)

**Video status: recordings require sign-in or course authorization.** This guide uses public slides and assignments; numerical examples are site-authored, not a lecture transcript.

A sequence such as “I like cats” is not a bag of independent words. After “I,” the probability of “like” changes; after “I like,” the next-token distribution changes again. This guide connects that observation to a sequence likelihood and then follows the gradient from a later prediction back into an earlier state.

You need conditional probability, vectors, and basic derivatives. We assume three already-tokenized items. Tokens need not correspond to whole words: the architecture does not determine the tokenizer.

## Follow one sequence all the way through

This is an original teaching example. Suppose the model assigns probability 0.5 to “I” after the start symbol, 0.4 to “like” after “I,” and 0.25 to “cats” after “I like.” The probability of this three-token prefix is 0.5 × 0.4 × 0.25 = 0.05. A complete sentence likelihood would also include the conditional probability of an end symbol; we are deliberately calculating only the prefix.

Using natural logarithms, its negative log likelihood is −ln 0.5 − ln 0.4 − ln 0.25 = 2.9957. The mean per token is 0.9986. Logs convert a potentially tiny product into a sum; they do not create a different probability distribution.

The factorization p(x₁,x₂,x₃) = p(x₁)p(x₂|x₁)p(x₃|x₁,x₂) follows from the probability chain rule. It belongs neither exclusively to RNNs nor to neural networks. An autoregressive Transformer can optimize the same objective. The architecture determines how the prefix is represented.

## A hidden state summarizes the prefix

An RNN updates hₜ = tanh(Wₕhₜ₋₁ + Wₓeₜ + b), where eₜ is the current token embedding. An output projection maps hₜ to next-token logits, and softmax turns these into probabilities. The parameters are shared across timesteps; unrolling the network does not create separately trained weights at each position.

For a scalar example, set h₀=0, Wₕ=0.5, Wₓ=1, and b=0. Feed embeddings 1 and then 0. We obtain h₁=tanh(1)=0.7616 and h₂=tanh(0.5×0.7616)=0.3634. The second input contributes zero directly, yet its resulting state is nonzero because information from the first input survives.

Reverse the inputs and the first state is zero; the second is tanh(1)=0.7616. The same values in a different order produce a different result. This sensitivity is useful, but the finite state remains a lossy summary rather than an exact archive of the prefix.

## Gradients follow the temporal edges

Even if we consider only the loss at the second step, it can influence the first step through the chain rule. In our example, ∂h₂/∂h₁ = 0.5(1−h₂²) ≈ 0.4340, while ∂h₁/∂e₁ = 1−h₁² ≈ 0.4200. Therefore ∂h₂/∂e₁ ≈ 0.1823. A loss gradient also includes ∂L/∂h₂; this calculation isolates the path carrying information from the past.

Across a long sequence, these Jacobians multiply. Their product may shrink or grow, producing vanishing or exploding gradients. A scalar recurrent weight below one does not characterize every direction in a multidimensional network: matrices, nonlinearities, and losses at multiple timesteps matter. LSTM gates and gradient clipping address different issues. Clipping limits large gradients; it does not restore a historical signal that has already vanished.

Automatic differentiation records operations and accumulates derivatives, including contributions to parameters shared across time. It is not a symbolic closed-form solution for the whole model, nor does it perturb each parameter to estimate a finite difference. Detaching a state removes a gradient edge. Its forward value can stay identical while the learning computation changes.

## Training prefixes and generated prefixes differ

With teacher forcing, the training example supplies the correct prefix. During generation, a selected token becomes the next input. An RNN still has sequential state dependencies even when the entire training sentence is available; at generation time it must additionally wait for each token choice.

A low training loss does not guarantee robust generation. The dataset may be narrow, and errors can take the model into prefixes unlike those encountered during training. Separate the objective, the data distribution, and the decoding policy before diagnosing a failure.

## Check your understanding

Change only the third correct-token probability from 0.25 to 0.5. The new prefix probability is 0.1 and total loss is 2.3026. The reduction is ln 2, rather than a linear reduction of 0.25.

If h₁ is detached before computing h₂, does h₂ remain 0.3634? Yes. The forward arithmetic is unchanged, but the second-step loss no longer travels through this edge into the first-step computation. Distinguishing forward values from gradient paths is the main test of this lesson.

Next, use the Assignment 0 teaching exercise to match a hand-derived gradient to autograd. Attention will retain the same sequence objective while changing how the model accesses its history.

[Previous](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) | [Next](/posts/ai/2026-10-11-cmu10423-hw0-autodiff-en) | [Series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## Course Video Sources

The official recording index is on SCS Panopto. The anonymous folder view is unloaded and requests sign-in; this is an access limitation, not evidence that recordings do not exist. Original audio and subtitles require the appropriate course access.

- [Official Panopto recording index](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [Official course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## References

- [Lecture 1 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture1-overview.pdf)
- [Deep Learning: Sequence Modeling](https://www.deeplearningbook.org/contents/rnn.html)
- [PyTorch autograd tutorial](https://docs.pytorch.org/tutorials/beginner/blitz/autograd_tutorial.html)
- [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture1-overview-ink.pdf)
- [HW0 recitation Colab](https://colab.research.google.com/drive/1F-ik4J0hf8kUdQAH_1HdlpBufuF9j9ny?usp=sharing)
- [The Pile](https://arxiv.org/abs/2101.00027)
- [InstructGPT](https://arxiv.org/abs/2203.02155)
- [Paszke et al. 2019, the PyTorch paper](https://proceedings.neurips.cc/paper/2019/file/bdbca288fee7f92f2bfa9f7012727740-Paper.pdf)
- [Bottou & Gallinari 1991](https://papers.nips.cc/paper/1990/file/a8c88a0055f636e4a163a5e3d16adab7-Paper.pdf)
- [Karpathy's RNN example](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)
- [practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
- [solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
- [Schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Lecture 2 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture2-transformer.pdf)
- [Coursework](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)
- [Goodfellow, Bengio & Courville, Deep Learning, Chapter 10: Sequence Modeling](http://www.deeplearningbook.org/contents/rnn.html)
