---
title: "Hsuan-Tien Lin's ML Techniques T14–T15: RBF Networks, k-Means, and Matrix Factorization"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, machine-learning, ai-course, course-guide, k-means, clustering, recommendation-system]
lang: en
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 15
tldr: "Techniques T14 reinterprets the Gaussian SVM as a linear vote over distance-based similarities, which gives the RBF network. Too many centers overfit, so k-means picks a few prototypes, and k-means itself is alternating optimization. T15 starts from the Netflix ratings data: one-hot encode user IDs, feed them into a linear network with the tanh removed, and you get matrix factorization R ≈ VᵀW, learned by alternating least squares or SGD. The lecture closes with a map of extraction models: boosting, neural nets, RBF networks, matrix factorization, and k-NN. These two lectures exist only as MOOC material. Neither the Fall 2024 nor the Fall 2026 schedule covers them, and no public homework problem does either."
description: "A guide to lectures 14–15 of Hsuan-Tien Lin's Machine Learning Techniques (NTU): the RBF network hypothesis and learning (full RBF, nearest neighbor, regularization), k-means as alternating optimization, RBF networks with k-means centers; the linear network, matrix factorization, alternating least squares, SGD and the KDD Cup 2011 time-ordering trick, plus the summary of extraction models. Includes the 8 videos, slide references, and self-practice ideas for a topic with no homework."
draft: false
glossary:
  - term: "RBF network"
    aliases: ["radial basis function network"]
    definition: "A model whose hidden layer computes a similarity from the distance between the input and a center (for example a Gaussian), and whose output layer takes a linear weighted vote over those similarities. The variables to learn are the centers μ_m and the votes β_m."
    context: "Lecture T14 of Hsuan-Tien Lin's Machine Learning Techniques derives it from the Gaussian SVM and notes that it is historically a kind of neural network."
    links:
      - label: "T14 slides"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/214_handout.pdf"
  - term: "alternating least squares"
    aliases: ["ALS"]
    definition: "One way to solve matrix factorization. With the user vectors fixed, run one linear regression per movie; with the movie vectors fixed, run one per user; alternate until convergence. E_in never increases, so it converges, but only to a local optimum."
    context: "Lecture T15 of Hsuan-Tien Lin's Machine Learning Techniques solves matrix factorization with ALS and with SGD."
    links:
      - label: "T15 slides"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/215_handout.pdf"
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-rbf-network-matrix-factorization)

This is part 15 of the [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en) series, following [Neural Networks and Deep Learning](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning-en). It covers Lecture 14, Radial Basis Function Network, and Lecture 15, Matrix Factorization, of [Machine Learning Techniques](https://www.csie.ntu.edu.tw/~htlin/mooc/). Together they finish the third part of the course, "Distilling Implicit Features: Extraction Models." The lectures are taught in Mandarin; the slides are in English.

Official material used:

- MOOC slides [214_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/214_handout.pdf) (T14) and [215_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/215_handout.pdf) (T15).
- Videos 54–61 of the [Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2), listed at the end.

**Access level: A2, with no practice material.** The videos and slides are free. The [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) and [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) schedules both skip T14–T15: each goes straight from NN and deep learning (212u, 213u) to modern deep learning (302u, 303u). So these two lectures have no updated `u` slides and no textbook chapters marked on a course page. I went through Fall 2024 HW0–HW7 and the final project handout; none of them asks about RBF networks, k-means, or matrix factorization. The only self-checks are the Fun Time quizzes in the slides. The access levels are defined in the [Global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en).

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=7lHhnpdPVr0
title: RBF Network Hypothesis
```

```youtube
url: https://www.youtube.com/watch?v=dEYdx2rS66c
title: RBF Network Learning
```

Original videos: [RBF Network Hypothesis](https://www.youtube.com/watch?v=7lHhnpdPVr0)、[RBF Network Learning](https://www.youtube.com/watch?v=dEYdx2rS66c)、[k-Means Algorithm](https://www.youtube.com/watch?v=ker9RF2TDUU)、[k-Means and RBFNet in Action](https://www.youtube.com/watch?v=D5elADTz1vk)、[Linear Network Hypothesis](https://www.youtube.com/watch?v=2pX76iH_irw)、[Basic Matrix Factorization](https://www.youtube.com/watch?v=3l5kaWkcR6s)、[Stochastic Gradient Descent](https://www.youtube.com/watch?v=br3IzOz-xMs)、[Summary of Extraction Models](https://www.youtube.com/watch?v=xKZMB4T2a2s)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## Where these lectures sit

Techniques organizes the course around three ways to handle features. Kernel models embed many features inside a kernel (T1–T6). Aggregation models treat hypotheses as features and combine them (T7–T11). Extraction models learn the features as hidden variables (T12–T15). T12–T13 cover neural networks and autoencoders. This post adds two more extraction models:

- **T14**: the hidden layer uses distance to a center as its transform, and unsupervised k-means picks the centers.
- **T15**: the input is not numeric at all. It is an abstract feature like a user ID. How do you extract hidden user and movie features from ratings?

Both lectures end on the same question: what are the different ways to do the "extraction" in an extraction model?

## T14: the RBF network

### Seeing an RBF network inside the Gaussian SVM

T14 opens with the Gaussian SVM from T3 (slide 2):

g<sub>SVM</sub>(x) = sign( Σ<sub>SV</sub> α<sub>n</sub> y<sub>n</sub> exp(−γ‖x − x<sub>n</sub>‖²) + b )

The Gaussian kernel is also called the Radial Basis Function (RBF) kernel. "Radial" means it depends only on the distance between x and a "center" x<sub>n</sub>. "Basis function" means it gets combined with others. Write each term as g<sub>n</sub>(x) = y<sub>n</sub> exp(−γ‖x − x<sub>n</sub>‖²), and the Gaussian SVM is just a linear combination of selected radial hypotheses.

Generalize that and you get the **RBF network** (slide 4):

h(x) = Output( Σ<sub>m=1</sub><sup>M</sup> β<sub>m</sub> RBF(x, μ<sub>m</sub>) + b )

The variables are the centers μ<sub>m</sub> and the signed votes β<sub>m</sub>. The Gaussian SVM is one special case: the RBF is Gaussian, M is the number of support vectors, μ<sub>m</sub> are the support vectors, and β<sub>m</sub> = α<sub>m</sub>y<sub>m</sub> from the dual solution.

Compare this with the neural network from the previous post (slide 3). The output layer is the same linear aggregation. Only the hidden layer differs: an NN neuron computes an inner product and applies tanh, while an RBF unit computes a distance and applies a Gaussian. The slides note that RBF networks are historically a kind of neural network.

Slide 5 separates two kinds of similarity. A kernel measures similarity through an inner product in Z-space and must satisfy Mercer's condition. An RBF measures similarity through distance in X-space and usually does not increase as distance grows. **An RBF network uses similarity-to-centers as its feature transform.**

### Learning: from a full RBF network to a few centers

The laziest option is the **full RBF network** (slide 7): M = N, with every training example as a center. For binary classification with β<sub>m</sub> = y<sub>m</sub>, every example votes on a new input, weighted by similarity.

Lazier still (slide 8): exp(−γ‖x − x<sub>m</sub>‖²) is largest when x is closest to x<sub>m</sub>, and that largest term often dominates the sum. Take only the closest example's label. That turns aggregation into selection, and it is **nearest neighbor**. A uniform vote over k neighbors is k-nearest neighbor.

For squared-error regression (slides 9–10), a full RBF network is linear regression on RBF-transformed data. Here Z is an N×N symmetric matrix. If all x<sub>n</sub> are distinct, a Gaussian Z is always invertible, so β = Z<sup>−1</sup>y. Plug it back in and every training example is fit exactly, so E<sub>in</sub> = 0. Function approximation calls this exact interpolation. For learning, it is overfitting.

Two fixes:

1. **Regularize.** Ridge regression on β gives β = (ZᵀZ + λI)<sup>−1</sup>Zᵀy. Slide 10 points out that Z is the Gaussian kernel matrix K, and compares this with T6's kernel ridge regression, β = (K + λI)<sup>−1</sup>y. The two regularize in different spaces.
2. **Use fewer centers.** The SVM needs far fewer than N support vectors. Taking M ≪ N limits the number of centers and votes, which is itself regularization (slide 11). The centers become **prototypes**.

That leaves one question: how do you find the prototypes?

### k-means: finding prototypes by alternating optimization

If x<sub>1</sub> ≈ x<sub>2</sub>, the network does not need two nearly identical RBFs. One prototype μ will do. That is a clustering problem (slide 13): split the data into disjoint sets S<sub>1</sub>…S<sub>M</sub>, pick one μ<sub>m</sub> per set, and minimize

E<sub>in</sub> = (1/N) Σ<sub>n</sub> Σ<sub>m</sub> [x<sub>n</sub> ∈ S<sub>m</sub>] ‖x<sub>n</sub> − μ<sub>m</sub>‖²

The problem mixes combinatorial variables (the partition) with numerical ones (the centers), so it is hard to solve jointly. The slides optimize the two sets of variables in turn:

- **Fix the centers, optimize the partition** (slide 14): assign each example to its closest μ<sub>m</sub>.
- **Fix the partition, optimize the centers** (slide 15): set the gradient with respect to μ<sub>m</sub> to zero, and the best center is the mean of its cluster.

Alternate until the partition stops changing. That is **k-means** (slide 16). Initialization usually picks k random examples. Convergence is guaranteed because E<sub>in</sub> only decreases. The slides point out that this k counts prototypes and has nothing to do with the k in k-nearest neighbor.

An **RBF network using k-means** takes four steps (slide 17):

1. Run k-means with k = M to get {μ<sub>m</sub>}.
2. Build the transform Φ(x) = [RBF(x, μ<sub>1</sub>), …, RBF(x, μ<sub>M</sub>)] from some RBF, for example a Gaussian.
3. Run a linear model on {(Φ(x<sub>n</sub>), y<sub>n</sub>)} to get β.
4. Return LinearHypothesis(β, Φ(x)).

The slides compare step 1 to an autoencoder: both use unsupervised learning to help with the feature transform. There are two parameters, the number of prototypes M and the RBF's own parameter (such as the Gaussian's γ). The slides call it "a simple (old-fashioned) model."

### In action

Slides 19–22 are a series of plots:

- With a good k and a good initialization, k-means usually works well.
- It is sensitive to both. The same data with k = 2, 4, 7 gives very different clusters.
- With reasonable centers, the RBF network performs reasonably.
- The full RBF network (k = N, λ = 0.001) and nearest neighbor both produce ragged boundaries. The slides conclude that full RBF networks are "generally less useful."

The last Fun Time ties T14 back to regularization. Paired with ridge linear regression, the RBF network with **small M and large λ** is the most regularized. Small M means fewer weights; large λ means a shorter β.

**Try this:** take centers from sklearn's `KMeans`, write the Gaussian transform yourself, and fit `Ridge` on top. On a 2-D toy dataset, sweep M ∈ {2, 4, 8, 32, N} and a few values of λ, and plot the decision boundaries. You will see the ragged full-RBF boundary from slide 22 for yourself.

## T15: matrix factorization

### The problem: the input is just an ID

T15 goes back to the recommender system example from Foundations L1 (slide 2). The Netflix competition, held in 2006, released 100,480,507 ratings that 480,189 users gave to 17,770 movies, and offered a million dollars for a 10% improvement.

The data for movie m, D<sub>m</sub>, is a set of pairs (x̃<sub>n</sub> = (n), y<sub>n</sub> = r<sub>nm</sub>). The input is only the user number n. This is a **categorical feature**; blood types and programming languages are other examples (slide 3). Most models, including linear models and NNs, need numerical features. Decision trees are a rare exception. So you encode first, and the simplest encoding is a binary vector: type A = [1 0 0 0]ᵀ, type B = [0 1 0 0]ᵀ, and so on.

### A linear network is matrix factorization

Encode each user as an N-dimensional binary vector, stack all of that user's movie ratings into an output vector (with "?" for unrated movies), and you can try extracting features with an N-d̃-M neural network (slide 4). The slides ask: is the tanh necessary?

With one-hot inputs, only one input unit is active at a time, so dropping the tanh costs nothing. Slide 5 renames the two weight layers Vᵀ and W and gets a **linear network**:

h(x) = WᵀVx, which for user n is h(x<sub>n</sub>) = Wᵀv<sub>n</sub>

where v<sub>n</sub> is column n of V. Specifying such a hypothesis takes (N + M)·d̃ variables (the Fun Time on slide 6).

Another view (slide 7): Φ(x) = Vx is a feature transform shared by all movies, and each movie has its own linear model w<sub>m</sub> on top. With squared error over the known ratings only, the goal is r<sub>nm</sub> ≈ w<sub>m</sub>ᵀv<sub>n</sub>. In matrix form:

R ≈ VᵀW

That is **matrix factorization** (slide 8). The rating matrix splits into user factors and movie factors, and each factor can be read as a hidden feature like "likes comedy" or "likes action." The pipeline is: known ratings → learned v<sub>n</sub> and w<sub>m</sub> → predicted unknown ratings. The slides note that the same modeling works for other abstract features.

### Solution 1: alternating least squares

Two sets of variables again, so alternate again (slides 9–10):

- Fix every v<sub>n</sub> and optimize w<sub>m</sub>: that is one linear regression on D<sub>m</sub>, without w<sub>0</sub>.
- Fix every w<sub>m</sub> and optimize v<sub>n</sub>: by symmetry between users and movies, that is one linear regression per user.

Alternating until convergence is **alternating least squares**, which the slides describe as a "tango" between users and movies. Initialization is usually random, and convergence is guaranteed for the same reason as k-means: E<sub>in</sub> decreases at every step. Each round solves M + N least-squares problems.

Slide 11 compares it with the **linear autoencoder** from T13:

| | Linear autoencoder | Matrix factorization |
|---|---|---|
| Form | X ≈ W(WᵀX), a d-d̃-d linear network | R ≈ VᵀW, an N-d̃-M linear network |
| Error | Squared error on every x<sub>ni</sub> | Squared error on known r<sub>nm</sub> only |
| Solution | Global optimum: eigenvectors of XᵀX | Local optimum via alternating least squares |
| Use | Dimension-reduced features | Hidden user and movie features |

The conclusion: a linear autoencoder is a special matrix factorization of a *complete* matrix X.

### Solution 2: SGD

The other route is SGD from Foundations L11 (slides 13–15). Pick one known rating (n, m) at random. The per-example error is (r<sub>nm</sub> − w<sub>m</sub>ᵀv<sub>n</sub>)². Its gradient is zero for every other user and movie vector, so only v<sub>n</sub> and w<sub>m</sub> change:

- Compute the residual r̃<sub>nm</sub> = r<sub>nm</sub> − w<sub>m</sub>ᵀv<sub>n</sub>
- v<sub>n</sub> ← v<sub>n</sub> + η · r̃<sub>nm</sub> · w<sub>m</sub>
- w<sub>m</sub> ← w<sub>m</sub> + η · r̃<sub>nm</sub> · v<sub>n</sub>

The intuition is "residual times the other side's feature vector." Each SGD step is cheap, the code is simple, and it adapts easily to other error functions. The slides call it perhaps the most popular algorithm for large-scale matrix factorization.

The Fun Time on slide 17 is worth remembering. If every vector starts at 0, every per-example gradient is 0 and E<sub>in</sub> never moves. That is the smallest counterexample for "initialize randomly," and the 302u slides in the next post revisit it for deep networks.

### In practice: time-ordered SGD at KDD Cup 2011

Slide 16 describes one trick from NTU's winning solution to KDD Cup 2011 Track 1. In that data, each user's training ratings came earlier in time than the test ratings. Training and test distributions did not match, which is the sampling bias from Foundations L16.

The team noticed that the last T′ SGD iterations see only those T′ examples, so the learned vectors lean toward them. They changed SGD to visit the later examples last, and test performance improved consistently. The lesson on the slide: if you understand how a technique behaves, it is easier to modify it for real-world use.

**Try this:** take the smallest [MovieLens](https://grouplens.org/datasets/movielens/) dataset and write the three SGD update lines above in numpy (d̃ = 10, η = 0.01). Run once with all-zero initialization and once with small random values, and compare training RMSE. With no official homework, this is the most direct self-check.

### Summary of extraction models

The last two content slides of T15 turn part three of the course into a map (slides 18–19):

| Model | Extracted hidden variables | The linear layer | Extraction technique |
|---|---|---|---|
| Adaptive/Gradient Boosting | hypotheses g<sub>t</sub> | weights α<sub>t</sub> | functional gradient descent |
| Neural Network/Deep Learning | layer weights w<sub>ij</sub><sup>(ℓ)</sup> | last-layer weights w<sub>ij</sub><sup>(L)</sup> | SGD (backprop), autoencoder |
| RBF Network | centers μ<sub>m</sub> | votes β<sub>m</sub> | k-means |
| Matrix Factorization | user features v<sub>n</sub> | movie features w<sub>m</sub> | SGD, alternating least squares |
| k Nearest Neighbor | neighbor RBFs centered at x<sub>n</sub> | y<sub>n</sub> | lazy learning |

Slide 20 lists pros and cons. On the plus side, extraction reduces the human effort of designing features, and with enough hidden variables it is powerful. On the minus side, the optimization is non-convex in general, and the models overfit easily, so they need regularization and validation. The slide's advice: "be careful when applying extraction models."

## Videos

T14 Radial Basis Function Network:

- [RBF Network Hypothesis](https://www.youtube.com/watch?v=7lHhnpdPVr0)
- [RBF Network Learning](https://www.youtube.com/watch?v=dEYdx2rS66c)
- [k-Means Algorithm](https://www.youtube.com/watch?v=ker9RF2TDUU)
- [k-Means and RBFNet in Action](https://www.youtube.com/watch?v=D5elADTz1vk)

T15 Matrix Factorization:

- [Linear Network Hypothesis](https://www.youtube.com/watch?v=2pX76iH_irw)
- [Basic Matrix Factorization](https://www.youtube.com/watch?v=3l5kaWkcR6s)
- [Stochastic Gradient Descent](https://www.youtube.com/watch?v=br3IzOz-xMs)
- [Summary of Extraction Models](https://www.youtube.com/watch?v=xKZMB4T2a2s)

## Practicing without homework

T14–T15 have no Fall 2024 or Fall 2026 homework and no official solutions. What you have:

1. **The 8 Fun Time quizzes in the slides** (four each in T14 and T15). The answer and explanation are on the following page, so cover it first.
2. **The two "try this" experiments above**: sweep M and λ for the RBF network, and compare zero and random initialization for matrix factorization. Check your hand-written versions against sklearn's `KMeans` and `Ridge`; if the numbers match, your understanding is on track.
3. **Write k-means and alternating least squares side by side.** The code skeletons are almost identical: fix one set, solve the other, repeat until nothing changes. Once you see that, it is clear why the next lecture, Finale, lists alternating optimization as its own category of technique.

## Next

The next post, [Finale: Three Families of Techniques, Plus Fall 2024's Modern Deep Learning Slides](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning-en), uses T16 to sort the whole course into feature, optimization, and overfitting techniques, then adds the Fall 2024 material on ReLU, He initialization, momentum, and Adam.

Further reading: the [Stanford CS224W guide](/posts/ai/2026-08-21-stanford-cs224w-ml-with-graphs-en) treats recommendation from a graph perspective, a useful contrast with matrix factorization.

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [Machine Learning Foundations / Techniques MOOC page (Hsuan-Tien Lin)](https://www.csie.ntu.edu.tw/~htlin/mooc/)
- [T14 Radial Basis Function Network slides](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/214_handout.pdf)
- [T15 Matrix Factorization slides](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/215_handout.pdf)
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2) (lectures in Mandarin)
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) (T14–T15 not scheduled)
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) (T14–T15 not scheduled)
- [A linear ensemble of individual and blended models for music rating prediction (Chen et al., KDD Cup 2011)](http://www.csie.ntu.edu.tw/~htlin/paper/doc/wskdd11cup_one.pdf) — suggested reading on the course page for the blending lecture, and the winning team mentioned on T15 slide 16
- [MOOC slide errata](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php)
- [MovieLens datasets (GroupLens)](https://grouplens.org/datasets/movielens/) — for self-practice, not assigned by the course
