---
title: "Hsuan-Tien Lin's ML Techniques T16 Finale: Three Families of Techniques, Plus Fall 2024's Modern Deep Learning Slides"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, machine-learning, ai-course, course-guide, deep-learning, optimization]
lang: en
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 16
tldr: "Techniques T16 re-sorts the whole course into three families: how to exploit features (kernels, aggregation, extraction, low-dimensional compression), how to optimize (gradients, equivalent problems, multiple steps), and how to fight overfitting (regularization, validation). It then uses four KDD Cup–winning models to show how the pieces combine in practice. The MOOC was recorded in 2016 and its deep learning stops at pre-training. The Fall 2024 on-campus course filled the gap with 302u (the ReLU family, Xavier/He initialization), 303u (momentum, RMSProp, Adam), a 2020 keynote deck, mlmai.ics, and 1126, an 11-model summary. The Fall 2026 versions of these files are scheduled for week 16 and currently return 404."
description: "A guide to Lecture 16 (Finale) of Hsuan-Tien Lin's Machine Learning Techniques (NTU): the taxonomy tables in Feature Exploitation, Error Optimization, Overfitting Elimination, and Machine Learning in Practice; plus the four decks the Fall 2024 course added — 302u (activation and initialization), 303u (deep learning optimization), mlmai.ics (the Machine Learning for Modern AI keynote), and 1126 (super short summary) — with the original papers each deck cites."
draft: false
glossary:
  - term: "He initialization"
    aliases: ["Kaiming initialization"]
    definition: "Weight initialization for ReLU networks: zero mean, variance 2/d^(ℓ−1), so the variance of each layer's scores stays roughly constant. Xavier initialization is the tanh counterpart, with variance 2/(d^(ℓ−1)+d^(ℓ))."
    context: "Derived on the last three slides of 302u, a Fall 2024 supplementary deck by Hsuan-Tien Lin."
    links:
      - label: "302u slides"
        url: "https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/302u_handout.pdf"
  - term: "Adam"
    aliases: ["Adaptive Moment Estimation"]
    definition: "A variant of SGD that moves along an exponential moving average of the gradient (momentum), scales each component's step by a moving average of squared gradients (RMSProp), and adds a global decay."
    context: "The Fall 2024 303u slides summarize it as momentum + RMSProp + global decay."
    links:
      - label: "303u slides"
        url: "https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/303u_handout.pdf"
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning)

This is part 16 of the [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en) series, following [RBF Networks, k-Means, and Matrix Factorization](/posts/ai/2026-09-30-ntu-htlin-ml-rbf-network-matrix-factorization-en). It has two parts: Lecture 16, Finale, of [Machine Learning Techniques](https://www.csie.ntu.edu.tw/~htlin/mooc/), and the four decks the [Fall 2024 on-campus course](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) added in its last three weeks.

Official material used:

- MOOC slides [216_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/216_handout.pdf) (T16) and the last 4 videos of the [Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2).
- Fall 2024's [302u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/302u_handout.pdf), [303u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/303u_handout.pdf), [mlmai.ics.handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/mlmai.ics.handout.pdf), and [1126_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/1126_handout.pdf).

**Access level:** all four Fall 2024 decks download freely, but they are slides only, with no recordings. Fall 2024 HW7 was released in week 14 and goes up to the neural networks of T12; it does not test 302u or 303u. So this stretch is A2. The access levels are defined in the [Global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en).

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=WeLobtIDBzI
title: Feature Exploitation Techniques
```

```youtube
url: https://www.youtube.com/watch?v=En-EyzFipaw
title: Error Optimization Techniques
```

Original videos: [Feature Exploitation Techniques](https://www.youtube.com/watch?v=WeLobtIDBzI)、[Error Optimization Techniques](https://www.youtube.com/watch?v=En-EyzFipaw)、[Overfitting Elimination Techniques](https://www.youtube.com/watch?v=b6t22jVVC0s)、[Machine Learning in Practice](https://www.youtube.com/watch?v=jIpwy-mPvIA)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## Three versions, three different endings

The three versions of the course end differently, so start by laying them out:

| Version | Final weeks |
|---|---|
| MOOC (2016) | T13 deep learning (pre-training, autoencoders) → T14 RBF → T15 matrix factorization → T16 Finale |
| [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) | W13 (11/25) 212u, 213u → W14 (12/02) modern deep learning: 302u, 303u → W15 (12/09) no class, mlmai.ics posted → W16 (12/16) finale: 1126 |
| [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) | W13 (12/02) no class, mlmai.ics → W14 (12/09) final exam → W15 (12/16) 212u, 213u → W16 (12/23) modern deep learning and finale: 302u, 303u, 1126 |

Two things stand out. First, neither on-campus semester uses the MOOC's 216 slides; finale week uses 1126 instead. Second, the Fall 2026 paths for 302u, 303u, 1126, and mlmai.ics all returned 404 on 2026-09-30. They go up in their scheduled weeks. This post therefore follows the Fall 2024 versions.

## MOOC T16: three families of techniques

T16 teaches nothing new. It re-sorts the first 15 lectures along a different axis. The final summary slide has three lines: kernel, aggregation, extraction, low-dimensional; gradient, equivalence, stages; (lots of) regularization, validation.

### Family 1: exploiting features

Slides 2–5 use four tables to answer "where does the feature transform Φ live?"

- **Kernel**: many features are embedded in the kernel's inner product. The polynomial kernel is a scaled polynomial transform, the Gaussian kernel an infinite-dimensional one, and the stump kernel uses decision stumps as the transform. Adding kernels takes the union of transforms; multiplying them combines transforms. Models that use them: SVM, SVR, kernel ridge regression, kernel logistic regression, probabilistic SVM.
- **Aggregation**: each g<sub>t</sub> is itself a predictive feature φ<sub>t</sub>(x). The base unit can be a decision stump, a decision tree, or a Gaussian RBF. The combination is uniform (bagging, random forest), non-uniform (AdaBoost, gradient boost), or conditional (decision tree, nearest neighbor).
- **Extraction**: features are hidden variables learned jointly with the usual weights, often with help from unsupervised learning. NNs extract neuron weights, RBF networks extract centers, and matrix factorization extracts user and movie factors; k-means supplies cluster centers, and autoencoders and PCA supply basis directions.
- **Low-dimensional compression**: compress the original features into fewer. Autoencoders and PCA compress while preserving information. Decision stumps and tree branches are the "best" naive projection to one dimension. Random forest branching is a "random" low-dimensional projection. Matrix factorization projects abstract features into concrete ones. Feature selection is the "most helpful" low-dimensional projection.

### Family 2: optimizing

Slides 7–9 name three strategies:

1. **Gradient descent**: whenever ∇E is roughly defined, use the first-order update "new variables = old variables − η∇E." SGD, minibatch, and full GD handle kernel logistic regression, NNs (backprop), and matrix factorization. Steepest descent and functional GD handle AdaBoost and gradient boost.
2. **Solve an equivalent problem**: when the original is hard, find an equivalent one. The dual SVM relies on convex QP, kernel logistic and kernel ridge regression rely on the representer theorem, and PCA is equivalent to an eigenproblem.
3. **Split into steps**: break the hard problem into easier sub-problems. Multi-stage: probabilistic SVM, linear blending, stacking, RBF networks, DeepNet pre-training. Alternating optimization: k-means, alternating least squares. Divide and conquer: decision trees.

The Fun Time on slide 10 ties all three together. Running T13's DeepNet on PCA-preprocessed data uses every strategy: minibatch GD for training, an equivalent eigenproblem for PCA, and multiple stages for pre-training.

### Family 3: eliminating overfitting

Slides 11–12 split this into two kinds:

- **Regularization**, which the slides call "arguably the most important technique": large margin (SVM, and AdaBoost indirectly), L2 (SVR, kernel models, weight decay in NNs), voting and averaging (uniform blending, bagging, random forest), denoising (autoencoders), weight elimination and early stopping (NNs), constraining (tied autoencoder weights, the number of RBF centers), and pruning (decision trees).
- **Validation**, "simple but necessary": the number of support vectors for SVM/SVR, the OOB error for random forests, and internal validation for blending and decision tree pruning.

### Section 4: combining them in practice

Slides 14–17 walk through four KDD Cup titles won by NTU teams:

| Competition | Model highlights (as summarized on the slides) |
|---|---|
| KDD Cup 2010 (Yu et al.) | Logistic regression on many raw-encoded features plus random forest on human-designed features, linearly blended |
| KDD Cup 2011 Track 1 (Chen et al.) | Matrix factorization variants, RBMs, k-NN, PLSA, linear regression, NNs, GBDT, combined with NNs, decision-tree-like models, and linear blending |
| KDD Cup 2012 Track 2 (Wu et al.) | Variants of linear regression, logistic regression, and matrix factorization, combined with NNs, GBDT-like models, and linear blending; the key is to blend without overfitting |
| KDD Cup 2013 Track 1 (Li et al.) | Random forests with very many trees and GBDT variants, plus a large effort on features built from domain knowledge |

For the 2010 entry the slide says, "yes, you've learned everything!" Slide 18 lists the ICDM 2006 top 10 data mining algorithms (C4.5, k-means, SVM, Apriori, EM, PageRank, AdaBoost, k-NN, Naive Bayes, C&RT), then adds five ML methods Lin personally thinks are missing: linear regression, logistic regression, random forest, GBDT, and NNs. Slide 19 is a word cloud titled "welcome to the jungle."

**Try this:** on a sheet of paper, make the three families the columns and write in every model you remember. The empty cells tell you which lectures to rewatch. This table checks whether you connected the course better than any set of notes.

## Fall 2024 supplement 1: 302u, activation and initialization

The 302u title slide reads "Machine Learning Soundings (機器學習深測), Lecture 2: Activation and Initialization." The course page labels it "deep learning activation." It follows 212u/213u and starts from backprop in a tanh network.

**Vanishing gradients** (slides 3–6): in backprop, δ<sup>(1)</sup> is δ<sup>(L)</sup> multiplied by a long chain of weights and ϕ′(s) terms. tanh saturates when |s| is large, so ϕ′(s) = 1 − tanh²(s) goes to 0. The early layers get gradients too small to update, and deep networks stop training. Slide 6 lists six remedies: skip connections, small random initialization, layer-wise pre-training (Techniques T13), internal normalization, gradient normalization, and better activation functions.

**The ReLU family** (slides 7–10):

- **ReLU**, ϕ(s) = max(s, 0): the derivative is 1 on the positive side, so gradients avoid vanishing about half the time. Each example activates only part of the network, and the arithmetic is fast. The slides call it arguably the most widely used activation in deep learning.
- **Dead neurons**: if a neuron's s is negative for every example, its output and gradient are both 0 and it never updates again. One very large gradient step can push the bias far negative; so can all-positive inputs (unshifted images) paired with negative weights.
- **Leaky ReLU**, ϕ(s) = max(s, 0.01s): a small slope on the negative side makes dead neurons less likely. The slide itself asks: why 0.01?
- **Parametric ReLU**, ϕ(α, s) = max(s, α·s): learn α with backprop too. The slide's takeaway: "anything (loosely) differentiable is learnable."

**Initialization** (slides 11–14): all zeros is too symmetric for tanh and not differentiable for ReLU; a shared constant clones the neurons; values that are too large saturate tanh and kill or overfit ReLU units. So you want **small, zero-mean random values**. The slides then derive the variance:

- For a tanh forward pass that keeps each layer's output variance constant, var(w) = 1/d<sup>(ℓ−1)</sup>; the backward pass wants 1/d<sup>(ℓ)</sup>. **Xavier initialization** compromises with var(w) = 2/(d<sup>(ℓ−1)</sup> + d<sup>(ℓ)</sup>).
- ReLU keeps only half, so E(x²) is half the variance of s, and you multiply back by 2: **He initialization**, var(w) = 2/d<sup>(ℓ−1)</sup>.

Original papers listed on the course page: ReLU, [Glorot, Bordes & Bengio](http://jmlr.org/proceedings/papers/v15/glorot11a/glorot11a.pdf); Leaky ReLU, [Maas, Hannun & Ng](https://ai.stanford.edu/~amaas/papers/relu_hybrid_icml2013_final.pdf); Parametric ReLU, [He, Zhang, Ren & Sun](https://arxiv.org/abs/1502.01852).

## Fall 2024 supplement 2: 303u, optimization in deep learning

303u is Lecture 3 of the same series, Optimization in Deep Learning, and it is short.

Slide 2 describes the error surface: local minima are not as bad as imagined; saddle points and local maxima are easy to escape, especially with SGD; plateaus need a larger η; ravines need protection against oscillation. Backprop makes gradients slow to compute, so you use minibatch SGD, and the price is a noisy gradient estimate. To stabilize it, average.

- **Momentum** (slides 3–5): averaging M minibatches costs M times the computation, but reusing past gradients does not. A uniformly weighted moving window is not ideal, so use an exponentially decaying average, v<sub>t</sub> = βv<sub>t−1</sub> + (1 − β)Δ<sub>t</sub>; β = 0 recovers plain SGD. It cancels some variance, damps oscillation across ravines, and escapes shallow local optima and saddle points.
- **RMSProp** (slides 6–8): take smaller steps along components with larger gradients. With only stochastic gradients available, keep a moving average u<sub>t</sub> of Δ<sub>t</sub> ⊙ Δ<sub>t</sub>, and set each component's step to η · (u<sub>t</sub> + ϵ)<sup>−1/2</sup>.
- **Adam** (slide 9): roughly momentum plus RMSProp plus a global decay. The slide warns that Adam is usually more aggressive than plain SGD, but it can also overfit faster.

Papers listed on the course page: backprop by [Rumelhart, Hinton & Williams](https://rdcu.be/b4ocH), momentum by [Qian](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.57.5612&rep=rep1&type=pdf), and [Adam by Kingma & Ba](https://arxiv.org/pdf/1412.6980.pdf).

**Try this:** write a two-layer ReLU network in numpy. On one dataset, compare three initializations (all zeros, standard normal, He) against three optimizers (SGD, momentum, Adam), and plot one training-loss curve per combination. Nine curves on one chart is the full experimental version of 302u plus 303u.

## Fall 2024 supplement 3: the mlmai.ics keynote

In week 15 of Fall 2024, class was cancelled because the instructor was attending ACML 2024 and NeurIPS 2024, and the course page posted mlmai.ics instead. It is not a lecture handout. It is Lin's keynote "Machine Learning for Modern Artificial Intelligence," given on 2020-12-17 at the International Computer Symposium 2020, held jointly with a Taiwan Ministry of Education AI talent program showcase.

The talk has three parts:

1. **ML for (Modern) AI**: Lin defines modern AI as "intelligently ≈ easily," or application intelligence. Machine learning is the tool that "cooks" big data into AI, and early on it often has to lean on human domain knowledge. The example is estimating tropical cyclone intensity with a CNN.
2. **ML Research for Modern AI**: three research cases. Cost-sensitive multiclass classification (mistakes have different costs, such as predicting COVID-19 as healthy); active learning by learning, which uses a bandit to pick among active learning strategies and was released as [libact](https://github.com/ntucllab/libact); and cyclone intensity estimation. Each case ends with a "have we made it more realistic?" reflection. For libact, the most-reported issue was that it is hard to install on Windows and Mac.
3. **ML for Future AI**: more creative, more explainable, more interactive, mapped to winning human respect, trust, and heart.

The deck is worth reading as a demonstration of how textbook ideas, like cost-sensitive error (Foundations L8) and bandits (the slot machine problem in Foundations HW2), turn into research questions.

## Fall 2024 supplement 4: the 1126 super short summary

The 1126 title slide reads "Machine Learning Foundations, Lecture 1126: Super Short Summary." (1126 is "the official lucky number of this class," per the last Fun Time in T16.) It condenses the semester into 11 models, each described with the same fields: err, the error the algorithm actually optimizes, optimization method, Φ, regularization/validation, parameters, and practical use.

| # | Model | Practical use, per the slides |
|---|---|---|
| 1 | PLA | online learning, and "teaching" |
| 2 | ridge linear regression | a decent baseline |
| 3 | logistic regression | baseline for hard and soft classification |
| 4 | ridge polynomial regression | often for 1-D regression |
| 5 | soft-margin linear SVM | large-scale classification |
| 6 | soft-margin kernel SVM | mid-sized classification |
| 7 | AdaBoost | "boosting" decision trees or stumps |
| 8 | decision tree | an explainable nonlinear model |
| 9 | bagging/random forest | stabilizing any model or tree |
| 10 | GBDT | information retrieval and competitions |
| 11 | neural networks/deep learning | vision and speech |

The entry for model 11 pulls in 302u and 303u directly: GD/SGD with Adam, Xavier/He initialization, ReLU or tanh neurons, and regularization by early stopping, L1/L2, and dropout.

**Try this:** read this table next to the T16 taxonomy. 1126 is organized by model and T16 by technique; cross the two and you have an index to the whole course.

## Videos

T16 Finale (MOOC; the four Fall 2024 supplementary decks have no matching recordings):

- [Feature Exploitation Techniques](https://www.youtube.com/watch?v=WeLobtIDBzI)
- [Error Optimization Techniques](https://www.youtube.com/watch?v=En-EyzFipaw)
- [Overfitting Elimination Techniques](https://www.youtube.com/watch?v=b6t22jVVC0s)
- [Machine Learning in Practice](https://www.youtube.com/watch?v=jIpwy-mPvIA)

The Fall 2026 course page advertises a public live stream, but I did not check whether complete recordings stay up afterward.

## Next

The course content ends here. The next post, [Foundations Homework Guide: Fall 2024 HW0–HW5](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en), goes back over the Foundations homework, followed by [Techniques Homework and the Final Project](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en).

Further reading: 302u and 303u are only a doorway into deep learning. To go further, this site has [CMU 11-785](/posts/ai/2026-08-22-cmu-11785-course-overview-en) (its lectures on [loss surfaces and momentum](/posts/ai/2026-08-22-cmu-11785-06-loss-surfaces-momentum-en) and [optimizers and regularization](/posts/ai/2026-08-22-cmu-11785-08-optimizers-regularization-en) pick up right where 303u stops), [MIT 6.7960](/posts/ai/2026-08-26-mit-67960-deep-learning-guide-en), and NTU's other track, [Hung-yi Lee's ML 2026](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en).

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [Machine Learning Foundations / Techniques MOOC page (Hsuan-Tien Lin)](https://www.csie.ntu.edu.tw/~htlin/mooc/)
- [T16 Finale slides](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/216_handout.pdf)
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2) (lectures in Mandarin)
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)
- [Fall 2024 302u: Activation and Initialization](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/302u_handout.pdf)
- [Fall 2024 303u: Optimization in Deep Learning](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/303u_handout.pdf)
- [Fall 2024 mlmai.ics: Machine Learning for Modern Artificial Intelligence](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/mlmai.ics.handout.pdf)
- [Fall 2024 1126: Super Short Summary](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/1126_handout.pdf)
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)
- [Deep Sparse Rectifier Neural Networks (Glorot, Bordes & Bengio)](http://jmlr.org/proceedings/papers/v15/glorot11a/glorot11a.pdf)
- [Rectifier Nonlinearities Improve Neural Network Acoustic Models (Maas, Hannun & Ng)](https://ai.stanford.edu/~amaas/papers/relu_hybrid_icml2013_final.pdf)
- [Delving Deep into Rectifiers (He, Zhang, Ren & Sun)](https://arxiv.org/abs/1502.01852)
- [Learning representations by back-propagating errors (Rumelhart, Hinton & Williams)](https://rdcu.be/b4ocH)
- [On the Momentum Term in Gradient Descent Learning Algorithms (Qian)](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.57.5612&rep=rep1&type=pdf)
- [Adam: A Method for Stochastic Optimization (Kingma & Ba)](https://arxiv.org/pdf/1412.6980.pdf)
- [libact](https://github.com/ntucllab/libact)
- [MOOC slide errata](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php)
