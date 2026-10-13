---
title: "Matrix Factorization: Learning User and Movie Features from a Rating Matrix | NTU Hsuan-Tien Lin Machine Learning Techniques Lecture 15"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, matrix-factorization, recommendation-system, sgd]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 32
tldr: "The only input a recommender system gets is a user ID. Apply binary vector encoding to the ID and feed it to an N-d̃-M linear network with the tanh removed, and the hypothesis is h(x) = WᵀVx, which is the same as writing the rating matrix as R ≈ VᵀW. There are two ways to learn V and W: alternating least squares solves M+N linear regressions per round, and SGD uses one rating at a time to update the vectors of one user and one movie. The lecture closes by putting boosting, neural networks, RBF networks, matrix factorization, and k nearest neighbor on one map of extraction models."
description: "A guide to Lecture 15, Matrix Factorization, of NTU Hsuan-Tien Lin's Machine Learning Techniques: categorical features and binary vector encoding, the linear network hypothesis, matrix factorization, alternating least squares, the gradient derivation and update rule of SGD, the time-ordering trick from KDD Cup 2011, and the summary of extraction models, with a 3×3 rating matrix worked by hand."
draft: false
glossary:
  - term: "matrix factorization"
    aliases: ["MF"]
    definition: "Approximating a rating matrix R, of which only some cells are known, by the product VᵀW of two matrices: column n of V is the d̃-dimensional feature vector vₙ of user n, column m of W is the d̃-dimensional feature vector wₘ of movie m, and the predicted rating is their inner product."
    context: "Techniques Lecture 15 derives it from an N-d̃-M linear network, with the error computed only on the known ratings."
    links:
      - label: "Techniques Lecture 15 handout"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/215_handout.pdf"
  - term: "alternating least squares"
    aliases: ["ALS"]
    definition: "One way to solve matrix factorization: with the user vectors fixed, run one linear regression per movie; with the movie vectors fixed, run one per user; alternate between the two until convergence. E_in never goes up in either step, so convergence is guaranteed, but only to a local optimum."
    context: "Techniques Lecture 15 solves matrix factorization with it and with SGD."
    links:
      - label: "Techniques Lecture 15 handout"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/215_handout.pdf"
  - term: "binary vector encoding"
    aliases: ["one-hot encoding"]
    definition: "Encoding a categorical feature with K possible values as a vector of length K: the entry for the value taken is 1 and all the others are 0."
    context: "Techniques Lecture 15 uses it to turn a user ID into numerical input that a neural network can take."
  - term: "extraction model"
    aliases: ["extraction models"]
    definition: "A model that treats the feature transform as hidden variables and learns it from data together with the final linear model."
    context: "The collective name for the third part of Techniques; Lecture 15 places boosting, neural networks, RBF networks, matrix factorization, and k nearest neighbor on this map."
---

> 🌏 [中文版](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-15-matrix-factorization)

**Video status: Videos included.** This article is written from the official MOOC handout [215_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/215_handout.pdf) and transcripts of the four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/22 to 22/22), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Techniques Lecture 15 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Techniques into three ways of handling features. This lecture belongs to the third, Distilling Implicit Features: Extraction Models, and is the last lecture of that part. The previous lecture, [Techniques Lecture 14: RBF Networks](/posts/ai/2026-09-30-ntu-htlin-ml-rbf-network-matrix-factorization-en), takes up two lines on that page: linear aggregation of distance-based similarities, using k-means clustering for prototype finding. This lecture moves to a more extreme setting, where the input is not even a numerical value, only a user ID.

The prerequisites are the least squares solution from [Foundations Lecture 9: Linear Regression](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en), stochastic gradient descent (SGD) from [Foundations Lecture 11: Linear Models for Classification](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform-en), the network notation of [Techniques Lecture 12: Neural Networks](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning-en), and the alternating optimization that k-means used in the previous lecture. After reading, you should be able to go from the N-d̃-M network to $\mathrm{R} \approx \mathrm{V}^\top\mathrm{W}$ on your own, work one round of alternating least squares and one step of SGD by hand on a small rating matrix, and say which situations each of the two solvers suits.

The route through the lecture is:

1. **User IDs**: a categorical feature, which has to be encoded as numbers first.
2. **Linear network**: an N-d̃-M neural network with the tanh removed.
3. **Matrix factorization**: the same hypothesis written as $\mathrm{R} \approx \mathrm{V}^\top\mathrm{W}$.
4. **Two solvers**: alternating least squares and SGD.
5. **The map of extraction models**: a review of every model in the third part of Techniques.

## The input is only a user ID: from categorical features to a linear network

```youtube
url: https://www.youtube.com/watch?v=2pX76iH_irw
title: Matrix Factorization :: Linear Network Hypothesis @ Machine Learning Techniques (機器學習技法)
```

(Video 00:19–01:00 reviews the previous lecture, 01:00–04:12 is the recommender system problem, 04:12–08:24 categorical features and encoding, 08:24–13:29 merging the data and feeding it to a neural network, 13:29–15:30 the discussion of tanh, 15:30–19:46 the linear network, and Fun Time follows.)

### What recommender system data looks like

Page 2 of the handout returns to the example used in [Foundations Lecture 1: The Learning Problem](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron-en). The data is how "many users" have rated "some movies", and the skill to learn is to predict how a user would rate an unrated movie. The handout cites the competition held by Netflix in 2006: 480,189 users gave 100,480,507 ratings to 17,770 movies, and a team that improved the predictions by 10% would win a prize of 1 million US dollars.

Split the data by movie. The data set for the $m$-th movie is

$$
\mathcal{D}_m = \big\{(\tilde{\mathbf{x}}_n = (n),\ y_n = r_{nm}) : \text{user } n \text{ rated movie } m\big\}
$$

The input $\tilde{\mathbf{x}}_n$ is just the ID $n$, and the output is the rating $r_{nm}$. The example given in the lecture: user 3 rated movie 5, so $n = 3$ and $m = 5$, and the score that user gave is written $r_{35}$.

The handout calls this kind of input an abstract feature. The lecture explains what is abstract about it: we do not know this user's gender, age, or favorite genre; all we have is an ID and the record of what that user has rated. Every earlier model received an $\mathbf{x}$ that carried at least some numerical values ready to be weighted. There are none here, which is why the lecture calls this a hard machine learning problem.

An addition in this article, to give a sense of scale: the rating matrix for this data has $480{,}189 \times 17{,}770 \approx 8.53$ billion cells, and the 100.5 million known ratings fill only 1.18% of them. What this lecture sets out to do is guess the rest of the cells from that 1% and a bit.

### Categorical features have to be encoded first

Page 3 gives this kind of input a formal name: categorical feature. User IDs look like 1126, 5566, 6211; the handout also lists blood type (A, B, AB, O) and programming languages (C, C++, Java, Python). The lecture stresses that an ID has no numerical meaning: user 6211 is not "larger" than user 1126, and at most the number has something to do with the order of registration.

Most of the models learned so far operate on numerical features. The handout lists two kinds: linear models, and extended linear models such as NNet. The reason given in the lecture is that a linear model computes a score as a weighted sum of the features, and each feature has to be a number before it can be added up; a neural network does the same thing layer after layer. The exception marked on the handout is decision trees, and the lecture adds that their extensions (random forests, gradient boosted decision trees) can also handle categorical features directly.

So the first step is to turn categories into numbers. This transform, fixed in advance, is called encoding. The handout uses the simplest kind, binary vector encoding: use a vector with as many dimensions as there are possible values, and give each possible value one position.

$$
\text{A} = [1\ 0\ 0\ 0]^\top,\quad \text{B} = [0\ 1\ 0\ 0]^\top,\quad \text{AB} = [0\ 0\ 1\ 0]^\top,\quad \text{O} = [0\ 0\ 0\ 1]^\top
$$

Applied to user IDs: with $N$ users, the encoding $\mathbf{x}_n$ of the $n$-th user is an $N$-dimensional vector whose $n$-th entry is 1 and whose other entries are all 0.

### Merging the per-movie data into one set and handing it to a neural network

Page 4 first replaces the input of $\mathcal{D}_m$ with the encoded $\mathbf{x}_n$, then merges the data of all the movies into one set, one example per user:

$$
\mathcal{D} = \Big\{\big(\mathbf{x}_n = \text{BinaryVectorEncoding}(n),\ \mathbf{y}_n = [r_{n1}\ \ ?\ \ ?\ \ r_{n4}\ \ r_{n5}\ \ \dots\ \ r_{nM}]^\top\big)\Big\}
$$

$\mathbf{y}_n$ is an $M$-dimensional rating vector. Its $m$-th entry is the score this user gave movie $m$, and the entries for unrated movies are question marks. The lecture describes it this way: a user who has seen movie 1 has that score placed in entry 1, and since the user has not seen movies 2 and 3, those two entries are left empty.

The encoded $\mathbf{x}_n$ is numerical, but it is still abstract. The lecture says that to know a user's preferences, this vector has to be turned into features that actually describe the user, and among the models we have learned, the neural network is the typical one for feature extraction. So the handout proposes an $N$-$\tilde{d}$-$M$ neural network, with $N$ nodes in the input layer (the number of users), $\tilde{d}$ neurons in the hidden layer, and $M$ nodes in the output layer (the number of movies). The figure on page 4 of the handout draws a small network with 4 inputs, 2 tanh hidden neurons, and 3 linear outputs, with the first-layer weights labeled $w_{ni}^{(1)}$ and the second-layer weights labeled $w_{im}^{(2)}$.

Two details:

- The handout notes that this network is "without all $x_0^{(\ell)}$": no layer has a constant term. The lecture says this is only to keep the formulas simple; the constants could be added back, and that would lead to a slightly different model.
- A network with many inputs, many outputs, and one layer in between is not new. The lecture points out that the autoencoder in [Techniques Lecture 13: Deep Learning](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-13-deep-learning-en) has exactly this shape.

### The tanh in the hidden layer can be removed

At the very bottom of page 4 the handout asks: is tanh necessary? The lecture's answer is that in this application it is not really needed, and the reason comes from the shape of the input.

Only the $n$-th entry of $\mathbf{x}_n$ is 1. The weighted sum that the $i$-th hidden neuron receives is $\sum_{k=1}^{N} w_{ki}^{(1)} x_k$, in which only the $k = n$ term is nonzero, so the result is the single weight $w_{ni}^{(1)}$. As the lecture puts it, only the input that is 1 sends a signal into the hidden layer, and the other connections might as well not exist. After the tanh, the neuron outputs $\tanh(w_{ni}^{(1)})$.

So the vector the $n$-th user gets in the hidden layer is simply that user's own $\tilde{d}$ weights, each passed through tanh once. These weights are used only for this user and are not shared with anyone else. In that case we may as well treat the values after the tanh as the variables to learn, with no transformation in between; the lecture says a corresponding setting of the original weights that describes the same thing can still be found.

An addition in this article, on the details of that correspondence. When the tanh network has first-layer weights $u_{ni}$, the network without tanh only needs $v_{ni} = \tanh(u_{ni})$ to produce exactly the same output. For example, if a user's two weights are $(2.0, -0.7)$, they become $(0.964, -0.604)$ after the tanh, and the linear version just sets its weights to $(0.964, -0.604)$. The other direction takes one more step: the output of tanh always falls between $-1$ and $1$, while the weights of the linear version have no such limit; but the second-layer weights can be scaled up as a whole and the first-layer weights scaled down to match, which makes up for the range. An ordinary neural network cannot do this, because an ordinary input has a value in every entry, a hidden neuron receives a weighted sum of many terms, and the tanh cannot be absorbed into a single weight.

### The linear network hypothesis

Page 5 of the handout calls the network with the tanh removed a linear network. The lecture makes a point of saying this is a Linear Network, not a Neural Network, and that it is conceptually close to the linear autoencoder of Techniques Lecture 13. The network has only two layers, and carrying the superscripts $(1)$ and $(2)$ around is cumbersome, so the handout renames the weights:

| New name | Original weights | Size | What each column is |
|---|---|---|---|
| $\mathrm{V}^\top$ | first layer $[w_{ni}^{(1)}]$ | $N \times \tilde{d}$ | — |
| $\mathrm{V}$ | transpose of the above | $\tilde{d} \times N$ | column $n$ is $\mathbf{v}_n$: the $\tilde{d}$ weights of user $n$ |
| $\mathrm{W}$ | second layer $[w_{im}^{(2)}]$ | $\tilde{d} \times M$ | column $m$ is $\mathbf{w}_m$: the $\tilde{d}$ weights connected to output $m$ |

The hypothesis written as a matrix operation:

$$
\mathbf{h}(\mathbf{x}) = \mathrm{W}^\top\mathrm{V}\mathbf{x}
$$

The lecture walks through the dimensions once: $\mathbf{x}$ is $N \times 1$ and $\mathrm{V}$ is $\tilde{d} \times N$, so $\mathrm{V}\mathbf{x}$ is the $\tilde{d} \times 1$ hidden-layer output; $\mathrm{W}^\top$ is $M \times \tilde{d}$, and the final output is $M \times 1$, each entry being the predicted rating of one movie.

For the $n$-th user, only the $n$-th entry of $\mathbf{x}_n$ is 1, and multiplying a matrix by such a vector just takes out the $n$-th column of the matrix:

$$
\mathrm{V}\mathbf{x}_n = \mathbf{v}_n, \qquad \mathbf{h}(\mathbf{x}_n) = \mathrm{W}^\top\mathbf{v}_n
$$

The lecture says this step looks like a matrix times a vector but is really just picking one column out of the matrix. $\mathbf{v}_n$ is what the $n$-th user looks like after the feature transform, and it stands for some kind of preference of that user. The handout states the task of this page in one line: linear network for recommender system: learn $\mathrm{V}$ and $\mathrm{W}$.

**A small example you can walk through to the end (made up for this article, not from the slides).** Take the sizes in the handout's figure: $N = 4$ users, $\tilde{d} = 2$, $M = 3$ movies. Set, arbitrarily,

$$
\mathrm{V} = \begin{bmatrix} 2 & 0 & 1 & 1 \\ 1 & 2 & 0 & 2 \end{bmatrix}, \qquad \mathrm{W} = \begin{bmatrix} 1 & 0 & 2 \\ 2 & 1 & 0 \end{bmatrix}
$$

The encoding of user 3 is $\mathbf{x}_3 = [0\ 0\ 1\ 0]^\top$. The first component of $\mathrm{V}\mathbf{x}_3$ is $2 \cdot 0 + 0 \cdot 0 + 1 \cdot 1 + 1 \cdot 0 = 1$ and the second is $1 \cdot 0 + 2 \cdot 0 + 0 \cdot 1 + 2 \cdot 0 = 0$, giving $(1, 0)$, which is exactly column 3 of $\mathrm{V}$. Multiplying by $\mathrm{W}^\top$, the predictions for the three movies are $\mathbf{w}_1^\top\mathbf{v}_3 = 1 \cdot 1 + 2 \cdot 0 = 1$, $\mathbf{w}_2^\top\mathbf{v}_3 = 0$, and $\mathbf{w}_3^\top\mathbf{v}_3 = 2$. Doing this for all four users:

| User | $\mathbf{v}_n$ | Movie 1 | Movie 2 | Movie 3 |
|---|---|---|---|---|
| 1 | $(2, 1)$ | 4 | 1 | 4 |
| 2 | $(0, 2)$ | 4 | 2 | 0 |
| 3 | $(1, 0)$ | 1 | 0 | 2 |
| 4 | $(1, 2)$ | 5 | 2 | 2 |

This $4 \times 3$ table is the hypothesis's prediction for every (user, movie) pair. The whole table is determined by the 8 numbers in $\mathrm{V}$ and the 6 numbers in $\mathrm{W}$, which is exactly what the Fun Time below counts.

### Fun Time: how many variables a linear network has

**Question (page 6):** For $N$ users, $M$ movies, and $\tilde{d}$ 'features', how many variables need to be used to specify a linear network hypothesis $\mathbf{h}(\mathbf{x}) = \mathrm{W}^\top\mathrm{V}\mathbf{x}$?

1. $N + M + \tilde{d}$
2. $N \cdot M \cdot \tilde{d}$
3. $(N + M) \cdot \tilde{d}$
4. $(N \cdot M) + \tilde{d}$

**Answer: 3.** The handout's answer is $N \cdot \tilde{d}$ for $\mathrm{V}^\top$ and $\tilde{d} \cdot M$ for $\mathrm{W}$; the lecture says it is just the number of first-layer weights plus the number of second-layer weights. The small example above gives $(4 + 3) \times 2 = 14$, which matches $8 + 6$.

Where the other choices go wrong: choice 1 counts each user and each movie as a single number, when each is in fact a $\tilde{d}$-dimensional vector. Choice 2 multiplies all three quantities together, which is the count you would get only if every pair of user and movie had its own set of $\tilde{d}$ weights; in a linear network a user's vector is shared across all movies. The $N \cdot M$ in choice 4 is the number of cells in the rating matrix, not the number of variables in the model.

An addition in this article: the number of variables being far smaller than the number of cells is the reason this model can predict cells it has not seen. At the Netflix scale with $\tilde{d} = 100$, there are $(480{,}189 + 17{,}770) \times 100 = 49{,}795{,}900$ variables, about 1/171 of the 8.53 billion cells.

## Splitting the rating matrix into two matrices: alternating least squares

```youtube
url: https://www.youtube.com/watch?v=3l5kaWkcR6s
title: Matrix Factorization :: Basic Matrix Factorization @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–03:06 is one linear model per movie and $E_{\text{in}}$, 03:06–06:50 matrix factorization, 06:50–11:12 alternating minimization, 11:12–12:48 the algorithm and convergence, 12:48–15:54 the comparison with the linear autoencoder, and Fun Time follows.)

### One linear model per movie, sharing one feature transform

Page 7 reads the same hypothesis from another angle. Write $\mathrm{V}\mathbf{x}$ as $\boldsymbol{\Phi}(\mathbf{x})$:

$$
\mathbf{h}(\mathbf{x}) = \mathrm{W}^\top \underbrace{\mathrm{V}\mathbf{x}}_{\boldsymbol{\Phi}(\mathbf{x})}
$$

Looking only at the output for the $m$-th movie, what gets used is row $m$ of $\mathrm{W}^\top$, which is $\mathbf{w}_m^\top$:

$$
h_m(\mathbf{x}) = \mathbf{w}_m^\top\boldsymbol{\Phi}(\mathbf{x})
$$

This is just a linear model on transformed features. The handout adds: subject to shared transform $\boldsymbol{\Phi}$. Each of the $M$ movies has its own $\mathbf{w}_m$, but they all share the same transform. The lecture says this transform turns the abstract features of a user into a concrete description of that user.

For every known rating we want $r_{nm} = y_n \approx \mathbf{w}_m^\top\mathbf{v}_n$. With the squared error measure, $E_{\text{in}}$ over the data of all $\mathcal{D}_m$ is:

$$
E_{\text{in}}(\{\mathbf{w}_m\}, \{\mathbf{v}_n\}) = \frac{1}{\sum_{m=1}^{M} \lvert\mathcal{D}_m\rvert} \sum_{\text{user } n \text{ rated movie } m} \big(r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n\big)^2
$$

The sum runs only over the known ratings; the question-mark cells are not counted. The coefficient in front is one over the total number of known ratings, and the handout prints it in gray. The lecture explains that in the optimization it is only a constant and does not change where the optimum is, so it gets no special attention from here on. Minimizing this $E_{\text{in}}$ learns two things at once: how to transform ($\mathrm{V}$), and the linear model of each movie after the transform ($\mathrm{W}$). In the handout's words: transform and linear models jointly learned from all $\mathcal{D}_m$.

### The same thing written as matrix factorization

Page 8 rewrites the goal. The two sides of an inner product can be swapped, so

$$
r_{nm} \approx \mathbf{w}_m^\top\mathbf{v}_n = \mathbf{v}_n^\top\mathbf{w}_m \quad\Longleftrightarrow\quad \mathrm{R} \approx \mathrm{V}^\top\mathrm{W}
$$

$\mathrm{R}$ is the $N \times M$ rating matrix, with one row per user and one column per movie. The handout's illustrative table looks like this:

| $\mathrm{R}$ | movie 1 | movie 2 | … | movie M |
|---|---|---|---|---|
| user 1 | 100 | 80 | … | ? |
| user 2 | ? | 70 | … | 90 |
| … | … | … | … | … |
| user N | ? | 60 | … | 0 |

Row $n$ of $\mathrm{V}^\top$ is $\mathbf{v}_n^\top$ and column $m$ of $\mathrm{W}$ is $\mathbf{w}_m$, so the $(n, m)$ entry of the product of the two matrices is $\mathbf{v}_n^\top\mathbf{w}_m$. The lecture's example is user 1 and movie 2: the inner product of $\mathbf{v}_1$ and $\mathbf{w}_2$ should be close to the rating in that cell of the table. Splitting one matrix into the product of two matrices is where the name matrix factorization comes from; what is special here is that we know only some of the cells of $\mathrm{R}$.

The figure on the same page reuses the drawing from Foundations Lecture 1. The top row is the viewer's factors: whether the viewer likes comedy, likes action, prefers blockbusters, likes Tom Cruise. The bottom row is the corresponding factors of the movie: comedy content, action content, whether it is a blockbuster, whether Tom Cruise is in it. The two rows are matched one to one, and the contributions from each factor add up to the predicted rating. The lecture adds what $\mathbf{w}_m$ means: it can be read as which elements this movie contains; when the user likes comedy and the movie is a comedy, the match gives a high score.

A set of numbers to try (made up for this article): take $\tilde{d} = 2$, with the first dimension as "comedy" and the second as "action". A user has $\mathbf{v} = (0.9, 0.2)$, a comedy has $\mathbf{w}_A = (4, 1)$, and an action movie has $\mathbf{w}_B = (1, 4)$. The predicted ratings are $0.9 \times 4 + 0.2 \times 1 = 3.8$ and $0.9 \times 1 + 0.2 \times 4 = 1.7$, so the comedy comes out well ahead.

The handout writes the learning flow in three steps: known rating → learned factors $\mathbf{v}_n$ and $\mathbf{w}_m$ → unknown rating prediction. The page also carries one more line: similar modeling can be used for other abstract features. The lecture says models of this kind are often used to turn abstract features such as user IDs and movie IDs into meaningful features that can be processed further.

An addition in this article, on something to be careful about when reading this figure. "This dimension is comedy" is an interpretation made after the fact. The model does not label each dimension with a name, and the factorization itself is not unique. Take an invertible $\tilde{d} \times \tilde{d}$ matrix $\mathrm{A}$, replace $\mathrm{V}$ with $\mathrm{A}\mathrm{V}$ and $\mathrm{W}$ with $(\mathrm{A}^{-1})^\top\mathrm{W}$, and the product $(\mathrm{A}\mathrm{V})^\top(\mathrm{A}^{-1})^\top\mathrm{W} = \mathrm{V}^\top\mathrm{A}^\top(\mathrm{A}^\top)^{-1}\mathrm{W} = \mathrm{V}^\top\mathrm{W}$ is unchanged, so every cell's prediction and $E_{\text{in}}$ stay the same. The simplest case is multiplying all $\mathbf{v}_n$ by 2 and dividing all $\mathbf{w}_m$ by 2.

### Two sets of variables, solved in turn

Page 9 writes down the optimization problem. Drop the gray constant and group by movie:

$$
\min_{\mathrm{W}, \mathrm{V}} E_{\text{in}}(\{\mathbf{w}_m\}, \{\mathbf{v}_n\}) \ \propto \sum_{\text{user } n \text{ rated movie } m} \big(r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n\big)^2 = \sum_{m=1}^{M} \bigg( \sum_{(\mathbf{x}_n, r_{nm}) \in \mathcal{D}_m} \big(r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n\big)^2 \bigg)
$$

There are two sets of variables, $\{\mathbf{w}_m\}$ and $\{\mathbf{v}_n\}$. The lecture says we may not know how to solve for both sets together, but the previous lecture used a trick when learning k-means: when two sets of variables cannot be solved together, solve them one set at a time, which is alternating minimization.

**Fix $\mathbf{v}_n$, solve for $\mathbf{w}_m$.** In linear network terms, the first layer is fixed and only the second layer is adjusted. Look at the double sum above: $\mathbf{w}_m$ appears only inside the $m$-th outer parenthesis. The lecture's example is that $\mathbf{w}_{1126}$ of movie 1126 appears only in term 1126 and in no other term. So the whole problem splits into $M$ unrelated small problems, the $m$-th being

$$
\min_{\mathbf{w}_m} \sum_{(\mathbf{x}_n, r_{nm}) \in \mathcal{D}_m} \big(r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n\big)^2
$$

The input is the fixed $\mathbf{v}_n$, the desired output is $r_{nm}$, the error is the squared error, and we are looking for a weight vector. This is linear regression; the handout says: simply per-movie linear regression without $w_0$. The lecture points out that the difference from the linear regression of Foundations is the missing constant term $w_0$.

The handout does not write out the solution; this article fills it in. Take the gradient with respect to $\mathbf{w}_m$ and set it to $\mathbf{0}$:

$$
-2\sum_{n \in \mathcal{D}_m} \big(r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n\big)\mathbf{v}_n = \mathbf{0} \quad\Longrightarrow\quad \Big(\sum_{n \in \mathcal{D}_m} \mathbf{v}_n\mathbf{v}_n^\top\Big)\mathbf{w}_m = \sum_{n \in \mathcal{D}_m} r_{nm}\mathbf{v}_n
$$

This uses $(\mathbf{w}_m^\top\mathbf{v}_n)\mathbf{v}_n = \mathbf{v}_n\mathbf{v}_n^\top\mathbf{w}_m$. It is the $\mathrm{X}^\top\mathrm{X}\mathbf{w} = \mathrm{X}^\top\mathbf{y}$ of Foundations Lecture 9: stack the $\mathbf{v}_n^\top$ of the users who rated this movie as the rows of $\mathrm{X}$, and stack their ratings as $\mathbf{y}$. When $\tilde{d} = 1$ the vectors all become scalars, and the solution is

$$
w_m = \frac{\sum_{n \in \mathcal{D}_m} r_{nm} v_n}{\sum_{n \in \mathcal{D}_m} v_n^2}
$$

When fewer than $\tilde{d}$ users have rated this movie, the matrix on the left is not invertible, and the pseudo-inverse has to be used instead, as in Foundations Lecture 9.

**Fix $\mathbf{w}_m$, solve for $\mathbf{v}_n$.** The lecture first voices the confusion a student would have: judging from the formula grouped by movie above, $\mathbf{v}_n$ is scattered across many parentheses, and it seems impossible to split. The answer is symmetry. Transpose every matrix in $\mathrm{R} \approx \mathrm{V}^\top\mathrm{W}$ and the roles of users and movies are swapped. The same sum regrouped by user:

$$
\sum_{\text{user } n \text{ rated movie } m} \big(r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n\big)^2 = \sum_{n=1}^{N} \bigg( \sum_{m:\ \text{user } n \text{ rated movie } m} \big(r_{nm} - \mathbf{v}_n^\top\mathbf{w}_m\big)^2 \bigg)
$$

Now $\mathbf{v}_n$ appears only inside the $n$-th parenthesis. With all $\mathbf{w}_m$ fixed, each user solves one linear regression: the inputs are the $\mathbf{w}_m$ of the movies that user rated, the outputs are the scores that user gave, and the weights to find are $\mathbf{v}_n$. The handout writes: per-user linear regression without $v_0$, by symmetry between users/movies. The solution has the same form as above with $\mathbf{v}$ and $\mathbf{w}$ swapped.

### The alternating least squares algorithm

Doing these two things in turn is what page 9 of the handout calls the alternating least squares algorithm (often abbreviated ALS). Page 10 lists the steps:

1. Initialize the $\tilde{d}$-dimensional vectors $\{\mathbf{w}_m\}$, $\{\mathbf{v}_n\}$.
2. Repeat the two steps below until convergence:
   1. Optimize $\mathbf{w}_1, \dots, \mathbf{w}_M$: update $\mathbf{w}_m$ by the $m$-th-movie linear regression on $\{(\mathbf{v}_n, r_{nm})\}$.
   2. Optimize $\mathbf{v}_1, \dots, \mathbf{v}_N$: update $\mathbf{v}_n$ by the $n$-th-user linear regression on $\{(\mathbf{w}_m, r_{nm})\}$.

Two remarks:

- **Initialization**: the handout says usually just randomly. The reason given in the lecture is that with values that are too special the optimization may not proceed properly, just as with the neural networks earlier. The Fun Time in the SGD section shows an actual case.
- **Convergence**: the handout says guaranteed as $E_{\text{in}}$ decreases during alternating minimization. The lecture supplies the other half: $E_{\text{in}}$ is a sum of squares and is bounded below by 0; each step also makes it smaller, so it converges to some value, the same argument as for k-means. An addition in this article, on why no step can make $E_{\text{in}}$ go up: the linear regression solution of each small problem is the minimum of that term with the other variables fixed, and the current value is one of the candidates, so the new value cannot be worse than it.

The handout calls this algorithm the 'tango' dance between users/movies. The picture in the lecture: users are one dancer and movies are the other, one moves and then the other moves, and the two finish the optimization together in step.

### Numerical example: alternating least squares on a 3×3 rating matrix

The following is an example made up for this article, not from the slides. Three users, three movies, ratings from 1 to 5, and six of the nine cells known:

| | Movie 1 | Movie 2 | Movie 3 |
|---|---|---|---|
| User 1 | 5 | 3 | ? |
| User 2 | 4 | ? | 1 |
| User 3 | ? | 2 | 1 |

Take $\tilde{d} = 1$, so that each user and each movie has just one number and the linear regression solution is the $\tilde{d} = 1$ formula above, which can be computed entirely by hand. $E_{\text{in}}$ here is the "proportional to" version on page 9 of the handout, that is, the sum of the six squared errors, not divided by 6. So that readers can follow the computation, the initial values are not random: take $v_1 = v_2 = v_3 = 1$.

**Round 1, update the movies.** Each movie looks only at the users who rated it:

- $w_1 = \dfrac{5 \cdot 1 + 4 \cdot 1}{1^2 + 1^2} = 4.5$ (users 1 and 2)
- $w_2 = \dfrac{3 \cdot 1 + 2 \cdot 1}{1^2 + 1^2} = 2.5$ (users 1 and 3)
- $w_3 = \dfrac{1 \cdot 1 + 1 \cdot 1}{1^2 + 1^2} = 1$ (users 2 and 3)

When every $v_n$ is 1, $w_m$ is just that movie's average score. At this point the six residuals are $5 - 4.5$, $3 - 2.5$, $4 - 4.5$, $1 - 1$, $2 - 2.5$, $1 - 1$, and $E_{\text{in}} = 4 \times 0.25 = 1$.

**Round 1, update the users.** Each user looks only at the movies that user rated:

- $v_1 = \dfrac{5 \cdot 4.5 + 3 \cdot 2.5}{4.5^2 + 2.5^2} = \dfrac{30}{26.5} = \dfrac{60}{53} \approx 1.132$
- $v_2 = \dfrac{4 \cdot 4.5 + 1 \cdot 1}{4.5^2 + 1^2} = \dfrac{19}{21.25} = \dfrac{76}{85} \approx 0.894$
- $v_3 = \dfrac{2 \cdot 2.5 + 1 \cdot 1}{2.5^2 + 1^2} = \dfrac{6}{7.25} = \dfrac{24}{29} \approx 0.828$

$E_{\text{in}}$ drops to $\dfrac{10972}{130645} \approx 0.0840$. What these three numbers mean: user 1 rates a little over ten percent above "the movie's average level", and users 2 and 3 rate below it.

**Keep going.** Continuing in Python (exact fractions for the first few rounds, floating point after that):

| Round | $E_{\text{in}}$ after updating the movies | $E_{\text{in}}$ after updating the users |
|---|---|---|
| 1 | 1 | 0.0840 |
| 2 | 0.0289 | 0.0182 |
| 3 | 0.0149 | 0.0139 |
| 5 | — | 0.013415 |
| 10 | — | 0.013411 |
| 20 onward | — | 0.013411 (no further change) |

$E_{\text{in}}$ goes down in every half round, consistent with the convergence argument. At convergence $v = (1.137, 0.903, 0.778)$ and $w = (4.409, 2.616, 1.183)$, and the nine cells of $\mathrm{V}^\top\mathrm{W}$ are:

| | Movie 1 | Movie 2 | Movie 3 |
|---|---|---|---|
| User 1 | 5.015 | 2.975 | **1.346** |
| User 2 | 3.982 | **2.363** | 1.068 |
| User 3 | **3.431** | 2.036 | 0.921 |

**What this result means.** All six known cells are reconstructed to within an error of 0.08. The three cells in bold were the question marks and now have predictions: for example, user 3 has not seen movie 1, and the model guesses a score of about 3.4, because movie 1 has the largest $w$ while user 3 has the smallest $v$ of the three. $E_{\text{in}}$ stops at 0.0134 rather than 0 because a $\tilde{d} = 1$ model cannot fit these six numbers exactly: user 1 says movie 1 to movie 2 is $5 : 3$, user 3 says movie 2 to movie 3 is $2 : 1$, which together make movie 1 to movie 3 $10 : 3$, but user 2 gives $4 : 1$.

The section on writing things as matrix factorization said the factorization is not unique, and it shows here too: multiply every $v$ by 2 and divide every $w$ by 2, and the predictions for the nine cells are exactly the same. What can be compared is which values are larger or smaller within one solution; a single number on its own has no absolute meaning.

### Comparison with the linear autoencoder

Page 11 puts matrix factorization side by side with the linear autoencoder of Techniques Lecture 13. The lecture's way in is that a matrix factorization is hidden inside the linear autoencoder as well. It writes $\mathrm{X}$ as $\mathrm{W}(\mathrm{W}^\top\mathrm{X})$; treat $\mathrm{W}^\top\mathrm{X}$ as a new matrix, and $\mathrm{X}$ has been split into the product of two matrices.

| | Linear Autoencoder | Matrix Factorization |
|---|---|---|
| Form | $\mathrm{X} \approx \mathrm{W}(\mathrm{W}^\top\mathrm{X})$ | $\mathrm{R} \approx \mathrm{V}^\top\mathrm{W}$ |
| Motivation | special $d$-$\tilde{d}$-$d$ linear NNet | $N$-$\tilde{d}$-$M$ linear NNet |
| Error measure | squared on all $x_{ni}$ | squared on known $r_{nm}$ |
| Solution | global optimal at eigenvectors of $\mathrm{X}^\top\mathrm{X}$ | local optimal via alternating least squares |
| Usefulness | extract dimension-reduced features | extract hidden user/movie features |

Here is what the lecture says row by row. "Special" in the motivation row refers to the autoencoder constraining the weights of its two layers to be related (encoding with $\mathrm{W}^\top$, decoding with the same $\mathrm{W}$). The error measure row: the autoencoder assumes every entry of $\mathrm{X}$ is known, while in matrix factorization there is no way to compute the error on the unseen cells, so they are left out. The solution row: the autoencoder gets the global optimum by computing $\mathrm{X}^\top\mathrm{X}$ and then finding its eigenvectors; matrix factorization does not get a global optimum so easily, and fixing one matrix, optimizing the other, and alternating in this way gives a local optimum.

An addition in this article, on a notational point where it is easy to get stuck when reading this table. In the derivation of Techniques Lecture 13, $\mathrm{X}$ is the $N \times d$ matrix that stacks each example $\mathbf{x}_n^\top$ as a row, so $\mathrm{X}^\top\mathrm{X} = \sum_{n=1}^{N}\mathbf{x}_n\mathbf{x}_n^\top$ is $d \times d$, and "eigenvectors of $\mathrm{X}^\top\mathrm{X}$" in the table follows that layout. But for the $\mathrm{X} \approx \mathrm{W}(\mathrm{W}^\top\mathrm{X})$ at the top of the same column to multiply out ($\mathrm{W}$ is $d \times \tilde{d}$), $\mathrm{X}$ has to become the $d \times N$ matrix that puts one $\mathbf{x}_n$ in each column; in that layout the same matrix $\sum_n \mathbf{x}_n\mathbf{x}_n^\top$ is written $\mathrm{X}\mathrm{X}^\top$. The two places refer to the same $d \times d$ matrix with $\mathrm{X}$ oriented differently, and there is no need to treat them as two different things.

The handout's conclusion is linear autoencoder ≡ special matrix factorization of complete $\mathrm{X}$. As the lecture puts it, matrix factorization can be seen as a more general way of extracting useful features from data.

### Fun Time: how many least squares problems per round

**Question (page 12):** How many least squares problems does the alternating least squares algorithm need to solve in one iteration of alternation?

1. number of movies $M$
2. number of users $N$
3. $M + N$
4. $M \cdot N$

**Answer: 3.** The handout's answer is $M$ per-movie problems and $N$ per-user problems. The lecture defines "one iteration": update the features of all the movies, then update the features of all the users.

Choices 1 and 2 each count only half an iteration. Choice 4 treats every rating cell as one regression problem; in fact all the ratings of one movie together make one regression problem, and one problem contains many examples. The 3×3 example above solves $3 + 3 = 6$ per round; at the Netflix scale it is $17{,}770 + 480{,}189 = 497{,}959$, each a small linear regression in $\tilde{d}$ variables.

## One rating at a time: matrix factorization with SGD

```youtube
url: https://www.youtube.com/watch?v=br3IzOz-xMs
title: Matrix Factorization :: Stochastic Gradient Descent @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–01:37 reviews SGD and its benefits, 01:37–06:00 derives the gradient of the per-example error, 06:00–07:48 the algorithm, 07:48–11:51 the KDD Cup 2011 approach, and Fun Time follows.)

### Why look for another solver

Page 13 reads $E_{\text{in}}$ as a sum of many terms, one for each known rating:

$$
E_{\text{in}}(\{\mathbf{w}_m\}, \{\mathbf{v}_n\}) \ \propto \sum_{\text{user } n \text{ rated movie } m} \underbrace{\big(r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n\big)^2}_{\text{err}(\text{user } n,\ \text{movie } m,\ \text{rating } r_{nm})}
$$

The objective is one big sum, which is exactly the situation SGD from Foundations Lecture 11 applies to. The lecture reviews how it works: rather than computing the gradient of the whole sum every time, pick one example at random, compute the gradient only on the error related to that example, and take one step downhill. The handout lists three benefits, and the lecture goes through them one by one:

- **Efficient per iteration** (the handout puts 'efficient' in quotation marks): each iteration computes only what relates to one example. The lecture adds that it may have to run for very many iterations, but that is another matter.
- **Simple to implement**: the code involves only a single example.
- **Easily extends to other error functions**: the lecture contrasts this with alternating least squares, an algorithm essentially built on the squared error.

### The gradient of the per-example error

Page 14 derives the gradient of $\text{err} = (r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n)^2$ with respect to all the variables. The variables of the model are $N$ vectors $\mathbf{v}$ and $M$ vectors $\mathbf{w}$.

**For vectors unrelated to this example, the gradient is $\mathbf{0}$.** The handout writes it with concrete IDs:

$$
\nabla_{\mathbf{v}_{1126}}\,\text{err}(\text{user } n, \text{movie } m, \text{rating } r_{nm}) = \mathbf{0} \ \ \text{unless } n = 1126
$$

$$
\nabla_{\mathbf{w}_{6211}}\,\text{err}(\text{user } n, \text{movie } m, \text{rating } r_{nm}) = \mathbf{0} \ \ \text{unless } m = 6211
$$

The lecture's way of saying it: the expression contains only $\mathbf{v}_n$, and unless $n$ happens to be 1126 it has nothing at all to do with $\mathbf{v}_{1126}$, so the partial derivative is of course 0. So we only need to concentrate on the two vectors $\mathbf{v}_n$ and $\mathbf{w}_m$.

**The gradient with respect to $\mathbf{v}_n$.** The handout gives the result directly; here the chain rule is written out step by step. Let $s = r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n = r_{nm} - \sum_{j=1}^{\tilde{d}} w_{m,j}\,v_{n,j}$, so the error is $s^2$. For the $i$-th component of $\mathbf{v}_n$:

$$
\frac{\partial\,\text{err}}{\partial v_{n,i}} = 2s \cdot \frac{\partial s}{\partial v_{n,i}} = 2s \cdot (-w_{m,i})
$$

The first equality is "differentiate the outer square first to get $2s$, then multiply by the derivative of the inside"; the second holds because the only term of $s$ containing $v_{n,i}$ is $-w_{m,i}v_{n,i}$. The lecture says the same thing: the 2 of the quadratic comes down and leaves a first-order expression, then look at the coefficient multiplying $\mathbf{v}_n$, which is $\mathbf{w}_m$, with a minus sign. Arranging the $\tilde{d}$ components into a vector:

$$
\nabla_{\mathbf{v}_n}\,\text{err} = -2\big(r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n\big)\mathbf{w}_m
$$

**The gradient with respect to $\mathbf{w}_m$.** The derivative of $s$ with respect to $w_{m,i}$ is $-v_{n,i}$, and the rest is completely symmetric:

$$
\nabla_{\mathbf{w}_m}\,\text{err} = -2\big(r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n\big)\mathbf{v}_n
$$

The handout condenses the two formulas into one line: per-example gradient ∝ −(residual)(the other feature vector). The lecture explains the two factors separately. The first is the residual: the desired score minus the model's current prediction, a word that appeared in [Techniques Lecture 11: Gradient Boosted Decision Trees](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-11-gradient-boosted-decision-tree-en). The second is the feature vector of "the other side": updating a user uses the movie's vector, and updating a movie uses the user's vector; for this one example, the other side acts as if temporarily held fixed and helps complete the update.

### The algorithm

Page 15 writes out the gradient descent update. Gradient descent moves in the direction of the negative gradient, which cancels the minus sign in the gradient, so the update "adds" the residual times the other side's vector:

- Initialize the $\tilde{d}$-dimensional vectors $\{\mathbf{w}_m\}$, $\{\mathbf{v}_n\}$ randomly.
- For $t = 0, 1, \dots, T$:
  1. Randomly pick $(n, m)$ within all known $r_{nm}$.
  2. Calculate the residual $\tilde{r}_{nm} = r_{nm} - \mathbf{w}_m^\top\mathbf{v}_n$.
  3. SGD-update:

$$
\mathbf{v}_n^{\text{new}} \leftarrow \mathbf{v}_n^{\text{old}} + \eta \cdot \tilde{r}_{nm}\,\mathbf{w}_m^{\text{old}}, \qquad \mathbf{w}_m^{\text{new}} \leftarrow \mathbf{w}_m^{\text{old}} + \eta \cdot \tilde{r}_{nm}\,\mathbf{v}_n^{\text{old}}
$$

Two additions in this article, on points that are easy to miss. First, the gradient has a coefficient of 2 and the update does not: taken literally it should be $2\eta$, but the handout absorbs the 2 into the step size $\eta$, and $\eta$ is a number you tune yourself anyway. Second, the right-hand sides of both updates use the old values. If your code overwrites $\mathbf{v}_n$ first and then uses the new $\mathbf{v}_n$ to update $\mathbf{w}_m$, it is not computing the handout's algorithm; compute both new values first and then write them back together.

Each step touches only $2\tilde{d}$ numbers, regardless of the number of users, the number of movies, or the number of ratings. The handout's verdict on it is perhaps most popular large-scale matrix factorization algorithm; the lecture says that on large matrix factorization problems it is one of the methods most people like best.

### Numerical example: two SGD steps on the same 3×3 matrix

The following is again made up for this article. Keep the rating table above and $\tilde{d} = 1$. To allow hand computation, take initial values $v_1 = v_2 = v_3 = 1$ and $w_1 = w_2 = w_3 = 1$, $\eta = 0.1$, and specify which examples are picked (in an actual run they are picked at random). At the start every cell's prediction is 1, and $E_{\text{in}} = 4^2 + 2^2 + 3^2 + 0^2 + 1^2 + 0^2 = 30$.

**Step 1, picking $(n, m) = (1, 1)$, $r_{11} = 5$.**

- Residual: $\tilde{r}_{11} = 5 - 1 \times 1 = 4$
- $v_1 \leftarrow 1 + 0.1 \times 4 \times 1 = 1.4$
- $w_1 \leftarrow 1 + 0.1 \times 4 \times 1 = 1.4$ (using the old $v_1 = 1$)

The prediction for this cell goes from 1 to $1.4 \times 1.4 = 1.96$, and the residual drops from 4 to 3.04. $E_{\text{in}}$ drops from 30 to 19.56. The other four vectors have not moved at all.

**Step 2, picking $(1, 2)$, $r_{12} = 3$.**

- Residual: $\tilde{r}_{12} = 3 - 1 \times 1.4 = 1.6$ ($w_2$ is still 1, and $v_1$ is already 1.4)
- $v_1 \leftarrow 1.4 + 0.1 \times 1.6 \times 1 = 1.56$
- $w_2 \leftarrow 1 + 0.1 \times 1.6 \times 1.4 = 1.224$

The prediction for this cell becomes $1.56 \times 1.224 \approx 1.909$. $E_{\text{in}}$ drops to 16.48.

**What these two steps show.**

- Step 2 did not pick $(1, 1)$, yet the prediction for that cell changed too: $v_1$ went from 1.4 to 1.56, and the prediction from 1.96 to $1.56 \times 1.4 = 2.184$. All the ratings of one user share one $\mathbf{v}_n$, so an update from one example moves the predictions for that user's other cells, the unrated ones included. This sharing is what lets the model predict the question marks.
- The step size cannot be chosen carelessly. If step 1 used $\eta = 1$, then $v_1 = w_1 = 5$, the prediction becomes 25, and the squared error of this cell goes from 16 to $(5 - 25)^2 = 400$. Alternating least squares guarantees that $E_{\text{in}}$ does not go up in any step; SGD has no such guarantee.
- Running on ends up in about the same place. Using Python with $\eta = 0.01$ for 200,000 randomly picked steps, repeated with a few different random seeds, $E_{\text{in}}$ at the end falls between 0.0135 and 0.0138, and the predictions for the three question-mark cells are about 1.34, 2.36, and 3.43 (varying slightly in the second decimal place from run to run), very close to the 1.346, 2.363, and 3.431 of alternating least squares. With a fixed step size, SGD keeps wobbling slightly around the optimum rather than stopping at one fixed number the way alternating least squares does.

### The two solvers side by side

The handout does not put the two solvers in one table; the table below is this article's summary of the material above:

| | Alternating least squares | SGD |
|---|---|---|
| Data used in one update | all the ratings of one movie (or one user) | one rating |
| What one update changes | one $\mathbf{w}_m$ or $\mathbf{v}_n$, replaced outright by the least squares solution of that subproblem | one $\mathbf{v}_n$ and one $\mathbf{w}_m$, each moved a small step |
| Numbers to tune yourself | no step size | step size $\eta$, number of steps $T$ |
| How $E_{\text{in}}$ moves | never goes up in a half round | a single step may go up (the $\eta = 1$ example above) |
| Error function | tied to the squared error, which is what makes the subproblems linear regressions | another error function only needs the per-example gradient recomputed |
| When you want to modify it | the update is solved as a whole batch, with little room to step in | the visiting order and the step size are yours to arrange (the KDD Cup example that follows) |

How to choose: with a small amount of data, when you want every step to go down steadily and do not want to tune a step size, use alternating least squares; when the number of ratings is very large, or you want another error function, or you want to adapt the algorithm to what the application needs, use SGD. The handout's verdict on SGD is about exactly the large-scale case.

### A modification in practice: the time-ordered SGD of KDD Cup 2011

Page 16 covers a real example, under the heading KDDCup 2011 Track 1: World Champion Solution by NTU. The lecture says the NTU team won another world championship in 2011, and this was part of the solution at the time.

**The specialty of the data.** The handout says: per-user training ratings earlier than test ratings in time. The lecture explains that the organizers wanted to use the ratings a user gave when first starting to use the system to predict the ratings that user would give in the future. Training data and test data are no longer drawn at random from the same distribution; there is a clear gap in time, so the distributions may differ. This is the sampling bias of [Foundations Lecture 16: Three Learning Principles](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-16-three-learning-principles-en): the training data at hand cannot fully represent the test environment.

**What is wanted.** The handout says want: emphasize latter examples. Later data is closer to the user's state at test time. The lecture's analogy is that a song you liked three years ago is not necessarily one you still like three years later, so the early data need not be weighted as heavily.

**An observation about SGD.** The handout says: last $T'$ iterations of SGD: only those $T'$ examples considered, and the learned $\{\mathbf{w}_m\}$, $\{\mathbf{v}_n\}$ favor those. The lecture puts it in numbers: SGD picks one point and updates each time, so the last 100 iterations see only those 100 points, and the final solution leans toward doing well on those 100 points; even if 20,000 points were seen earlier, those 20,000 points are not treated equally, and the algorithm gives more weight to the ones it has just seen.

**The approach.** The handout says our idea: time-deterministic SGD that visits latter examples last, with the S of SGD struck through on the slide. The lecture explains that it is no longer stochastic and the order is fixed: the last iterations are deliberately shown the data that is later in time. The result recorded on the handout is consistent improvements of test performance; the lecture says this improved almost all of their SGD-family methods in that competition.

**A tiny example of "leaning toward the last examples seen" (made up for this article).** Look at one user with four ratings, which in time order are 1, 1, 5, 5; the user's taste changed midway. To leave a single variable, assume the $w_m$ of these four movies are all fixed at 1 and not updated (the real algorithm updates both sides together; this is only an illustration). The update simplifies to $v \leftarrow v + \eta(r - v)$. Take $\eta = 0.5$ and start from $v = 3$:

| Visiting order | How $v$ changes | Final $v$ |
|---|---|---|
| Time order (1, 1, 5, 5) | $3 \to 2 \to 1.5 \to 3.25 \to 4.125$ | 4.125 |
| Reversed (5, 5, 1, 1) | $3 \to 4 \to 4.5 \to 2.75 \to 1.875$ | 1.875 |

The four examples are the same, and the $v$ that minimizes the sum of the four squared errors is the average, 3, yet the two orders stop at 4.125 and 1.875, each close to the last two examples seen. If the test data is this user's later ratings, the taste is more likely to be near 5, and the result of visiting in time order will be more accurate.

The closing line at the bottom of this page of the handout is: if you understand the behavior of techniques, easier to modify for your real-world use. The lecture stresses that the point is not how remarkable their work was, but that only by knowing what the optimization method behind a model is actually doing can you change the algorithm into the form you need; Lin hopes this is an ability students take away after finishing Foundations and Techniques.

### Fun Time: what happens with all-zero initialization

**Question (page 17):** If all $\mathbf{w}_m$ and $\mathbf{v}_n$ are initialized to the $\mathbf{0}$ vector, what will NOT happen in SGD for matrix factorization?

1. all $\mathbf{w}_m$ are always $\mathbf{0}$
2. all $\mathbf{v}_n$ are always $\mathbf{0}$
3. every residual $\tilde{r}_{nm}$ = the original rating $r_{nm}$
4. $E_{\text{in}}$ decreases after each SGD update

**Answer: 4.** The handout's answer: the $\mathbf{0}$ feature vectors provide a per-example gradient of $\mathbf{0}$ for every example, so $E_{\text{in}}$ cannot be further decreased. The lecture says that no matter how you update, the gradient is still 0 and nothing ever moves.

Substitute into the update to verify. Whichever $(n, m)$ is picked: the residual is $\tilde{r}_{nm} = r_{nm} - \mathbf{0}^\top\mathbf{0} = r_{nm}$ (choice 3 happens); $\mathbf{v}_n \leftarrow \mathbf{0} + \eta\,r_{nm}\,\mathbf{0} = \mathbf{0}$ (choice 2 happens); $\mathbf{w}_m \leftarrow \mathbf{0} + \eta\,r_{nm}\,\mathbf{0} = \mathbf{0}$ (choice 1 happens). However large the residual is, it does no good, because the "other side's vector" it multiplies is $\mathbf{0}$. After the update all vectors are the same as before it, and the next step is in exactly the same situation. This was confirmed by running 1,000 steps on the 3×3 example above: all vectors stay at 0 throughout, and $E_{\text{in}}$ stays at $5^2 + 3^2 + 4^2 + 1^2 + 2^2 + 1^2 = 56$.

An addition in this article: the condition for getting stuck is that both sides are $\mathbf{0}$. If only $\mathbf{v}_n = \mathbf{0}$ while $\mathbf{w}_m \ne \mathbf{0}$, the first update turns $\mathbf{v}_n$ into $\eta\,r_{nm}\,\mathbf{w}_m$, and things can move from there. This question is the smallest counterexample behind "usually initialize randomly", and it echoes what the lecture said in the alternating least squares part, that with values that are too special the optimization may not proceed properly.

## The summary of extraction models: the models and techniques of four lectures

```youtube
url: https://www.youtube.com/watch?v=xKZMB4T2a2s
title: Matrix Factorization :: Summary of Extraction Models @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–03:08 is the map of models, 03:08–05:11 the map of techniques, 05:11–07:21 pros and cons, 07:21–07:52 Fun Time, followed by the summary of the whole lecture.)

### What an extraction model is

The lecture begins by admitting that after four lectures on extraction models, the term has never been given a clear definition. Page 18 of the handout supplies it here: feature transform $\boldsymbol{\Phi}$ as hidden variables in addition to linear model. A linear model still comes at the end, but before it the feature transform itself is also learned, and the parameters inside the transform are the hidden variables.

### The map of models

Page 18 lays out the models learned so far, listing for each one the "hidden variables (transform)" and the "weights of the linear model". The table below follows the handout and adds the lecture where each is taught:

| Model | Transform treated as hidden variables | Weights of the final linear model | Which lecture |
|---|---|---|---|
| Adaptive/Gradient Boosting | hypotheses $g_t$ | $\alpha_t$ | [Techniques Lecture 8: AdaBoost](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-08-adaptive-boosting-en), [Techniques Lecture 11: Gradient Boosted Decision Trees](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-11-gradient-boosted-decision-tree-en) |
| Neural Network/Deep Learning | weights of the earlier layers $w_{ij}^{(\ell)}$ | weights of the last layer $w_{ij}^{(L)}$ | [Techniques Lecture 12: Neural Networks](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning-en), [Techniques Lecture 13: Deep Learning](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-13-deep-learning-en) |
| RBF Network | RBF centers $\boldsymbol{\mu}_m$ | $\beta_m$ | [Techniques Lecture 14: RBF Networks](/posts/ai/2026-09-30-ntu-htlin-ml-rbf-network-matrix-factorization-en) |
| Matrix Factorization | user features $\mathbf{v}_n$ | movie features $\mathbf{w}_m$ | this lecture |
| k Nearest Neighbor | $\mathbf{x}_n$-neighbor RBF | $y_n$ | Techniques Lecture 14: RBF Networks |

The lecture says a little more about three of the rows:

- **Matrix factorization**: in the other boxes the upper line is blue (the transform) and the lower line is red (the weights of the linear model), but in this box the two lines, user features and movie features, alternate blue and red, and both symbols $\mathbf{v}_n$ and $\mathbf{w}_m$ are printed in purple. The lecture says purple is used here on purpose, because users and movies are symmetric in this application: one can say the features of users and the features of movies are being extracted at the same time, and there is no need to designate one as the features and the other as the weights of the linear model.
- **Boosting**: it was taught in the lectures on aggregation models, but it can also be thought of as an extraction model. The transform it finds is the hypotheses $g_t$, and the weights of the final linear combination are the votes $\alpha_t$ of each $g_t$.
- **k nearest neighbor**: the transform is "the neighborhood around some point that has been seen", and the combination weights come from those $k$ points voting, so the weights are their original labels.

The handout's closing line is extraction models: a rich family.

### The map of techniques

Page 19 is the same map, with the boxes now showing which technique extracts the transform. The lecture says this is a page it especially wants to stress: these techniques can be combined with other models.

| Model | Extraction technique | What the lecture says |
|---|---|---|
| Adaptive/Gradient Boosting | functional gradient descent | used to derive how each $g_t$ should be extracted |
| Neural Network/Deep Learning | SGD (backprop), autoencoder | backprop helps compute the gradient efficiently; the autoencoder gets better initial weights in an unsupervised way |
| RBF Network | k-means clustering | also an unsupervised way, using only unlabeled data |
| Matrix Factorization | SGD, alternating leastSQR | seen as alternating linear regressions, it can use alternating least squares |
| k Nearest Neighbor | lazy learning | does almost nothing in training, and uses the training data for inference only at test time |

Autoencoder and k-means are both marked in bold green on the slide. The lecture discusses them together: both are unsupervised methods, which shows that unsupervised learning is useful for learning representations of data. The handout draws a smiley after lazy learning, and the lecture makes a point of clarifying that this is not a joke; the method really is called lazy learning. The handout's closing line is extraction techniques: quite diverse.

### Pros and cons

Page 20 lists pros and cons for three families: neural network/deep learning, RBF network, and matrix factorization.

**Pros:**

- **'easy'**: reduces human burden in designing features. The lecture's examples are computer vision and speech: a person looks at an image and knows what it is, hears a sentence and knows what is being said, but is not good at designing features by hand from the raw pixels or the audio signal; a machine that does the feature transform automatically is a big help.
- **powerful**: if enough hidden variables are considered. The lecture's examples are an RBF network with enough centers and a neural network with enough neurons or weights, which can then do very complicated things.

**Cons:**

- **'hard'**: non-convex optimization problems in general. The lecture says non-convex means it is easy to get stuck in odd places and fail to find a better solution, which is why so many different techniques are needed to help. An addition in this article: the matrix factorization of this lecture is an example. Page 11 of the handout says alternating least squares reaches only a local optimum, and the all-zero initialization in the Fun Time is stuck at a place where the gradient is 0 and cannot get out.
- **overfitting**: needs proper regularization/validation. As the lecture puts it, a model this powerful has to be used with care so that the power does not go into overfitting, so the mechanisms of regularization and validation matter even more.

The handout sums up this page in one line: be careful when applying extraction models.

### Fun Time: which model is this

**Question (page 21):** Which of the following extraction models extracts Gaussian centers by k-means and aggregates the Gaussians linearly?

1. RBF Network
2. Deep Learning
3. Adaptive Boosting
4. Matrix Factorization

**Answer: 1.** This is the standard description of the RBF network from the previous lecture: find the centers $\boldsymbol{\mu}_m$ with k-means, compute similarity with Gaussians, and combine linearly with $\beta_m$. The handout's answer is a single line of congratulations: Congratulations on being an expert in extraction models!

The other choices checked against the map: the transform of deep learning is the weights of the layers and its techniques are SGD and autoencoders, with no Gaussian centers. The transform of AdaBoost is the hypotheses $g_t$ found one at a time. The transform of matrix factorization is the vectors of users and movies, and its techniques are alternating least squares and SGD.

The summary on page 22 gives each of the four sections one line: the linear network is feature extraction from binary vector encoding; basic matrix factorization is alternating least squares between user/movie; SGD is efficient and easily modified for practical use; extraction models are powerful and thus need careful use. The preview of the next lecture is closing remarks of techniques.

## Self-check

**1. Take $\tilde{d} = 2$. Three users have rated a movie, and their current vectors and ratings are: $\mathbf{v}_1 = (1, 0)$ with a rating of 4, $\mathbf{v}_2 = (1, 1)$ with a rating of 5, $\mathbf{v}_3 = (0, 1)$ with a rating of 2. When alternating least squares updates this movie, what is $\mathbf{w}$? What are the three residuals after the update?**

Answer: $\sum_n \mathbf{v}_n\mathbf{v}_n^\top = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$ and $\sum_n r_n\mathbf{v}_n = 4(1,0) + 5(1,1) + 2(0,1) = (9, 7)$. Solving $2w_1 + w_2 = 9$ and $w_1 + 2w_2 = 7$ gives $\mathbf{w} = (\frac{11}{3}, \frac{5}{3})$. The three predictions are $\frac{11}{3}$, $\frac{16}{3}$, $\frac{5}{3}$, the residuals are $\frac{1}{3}$, $-\frac{1}{3}$, $\frac{1}{3}$, and the sum of squares is $\frac{1}{3}$. With three examples and two variables, an exact fit to all of them is usually impossible.

**2. $\mathbf{v}_n = (1, 2)$, $\mathbf{w}_m = (0.5, 1)$, $r_{nm} = 4$, $\eta = 0.1$. Take one SGD step and write the new $\mathbf{v}_n$, the new $\mathbf{w}_m$, and the new prediction.**

Answer: the prediction is $0.5 + 2 = 2.5$ and the residual is $1.5$. $\mathbf{v}_n \leftarrow (1, 2) + 0.15 \times (0.5, 1) = (1.075, 2.15)$; $\mathbf{w}_m \leftarrow (0.5, 1) + 0.15 \times (1, 2) = (0.65, 1.3)$. The new prediction is $1.075 \times 0.65 + 2.15 \times 1.3 = 3.49375$, closer to 4. If your $\mathbf{w}_m$ came out as $(0.66125, 1.3225)$, you used the updated $\mathbf{v}_n$, which differs from the handout's update.

**3. $N = 1{,}000$ users, $M = 200$ movies, $\tilde{d} = 10$. How many variables does the model have? How many least squares problems does one round of alternating least squares solve? How many numbers does one SGD step change?**

Answer: $(1{,}000 + 200) \times 10 = 12{,}000$ variables. One round of alternating least squares is $200 + 1{,}000 = 1{,}200$ problems, each with 10 variables. One SGD step changes only one $\mathbf{v}_n$ and one $\mathbf{w}_m$, 20 numbers in all.

**4. Why can the $\mathbf{w}_m$ of the $M$ movies each be solved separately once all $\mathbf{v}_n$ are fixed? And why can the $\mathbf{v}_n$ also be solved separately once the $\mathbf{w}_m$ are fixed?**

Criteria: the answer should point out that $E_{\text{in}}$ is a sum over the known ratings and can be grouped by movie, that $\mathbf{w}_m$ appears only in the $m$-th group so the groups do not affect one another, and that each group is a linear regression with $\mathbf{v}_n$ as input, $r_{nm}$ as output, and no constant term; the same sum can also be regrouped by user, with $\mathbf{v}_n$ appearing only in the $n$-th group. An answer that says only "because of symmetry" without stating the regrouping is not complete.

**5. A new user has no ratings at all. After training with SGD, what is this user's $\mathbf{v}_n$? Can the model's predictions for this user be trusted?**

Criteria: the answer should say that SGD picks examples only from the known ratings, so this user is never picked, the gradient of this user's $\mathbf{v}_n$ is always $\mathbf{0}$, and $\mathbf{v}_n$ stays at its random initial value; the prediction $\mathbf{w}_m^\top\mathbf{v}_n$ reflects only those random numbers and uses no information about the user. Alternating least squares is the same, since this user's regression problem contains no data. The model of this lecture can learn features only for users and movies that have left at least some ratings.

## Exercises and corresponding reading

**This lecture is not scheduled in the current semester courses.** The course plans on the [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) and the [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) both skip Techniques Lectures 14 and 15: in both semesters, neural networks and deep learning (slides `212u`, `213u`) are followed directly by modern deep learning (`302u`, `303u`). So this lecture has no updated `u` version of the slides, and the course pages do not assign it a chapter of [Learning from Data](http://amlbook.com). All of this was checked on 2026-09-30.

**Homework.** None of the problems in Fall 2024 HW0–HW7 or the final project description tests matrix factorization. The only official material available for self-checking is the four Fun Time questions in the handout; corrections to the handout are in the [MOOC slide errata](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php).

**Hands-on.** With no homework, the most direct exercise is to write the two algorithms yourself:

1. First write alternating least squares on this article's 3×3 rating table with $\tilde{d} = 1$, and confirm that round 1 gives $w = (4.5, 2.5, 1)$ and $v = (\frac{60}{53}, \frac{76}{85}, \frac{24}{29})$, and that $E_{\text{in}}$ converges to about 0.0134.
2. Switch to the smallest [MovieLens](https://grouplens.org/datasets/movielens/) data set (this is data for self-practice, not assigned by the course) and write the few lines of SGD update from page 15 in numpy, for example with $\tilde{d} = 10$ and $\eta = 0.01$. Run once with all-zero initialization and once with small random numbers, compare the training RMSE of the two, and see the Fun Time phenomenon for yourself.
3. Write k-means and alternating least squares side by side. The skeletons of the two programs are nearly identical: fix one set, solve the other, repeat until nothing changes.

**Further reading.** The champion team on page 16 of the handout wrote up its approach as the paper [A linear ensemble of individual and blended models for music rating prediction](http://www.csie.ntu.edu.tw/~htlin/paper/doc/wskdd11cup_one.pdf) (Chen et al., KDD Cup 2011). The [Stanford CS224W guide](/posts/ai/2026-08-21-stanford-cs224w-ml-with-graphs-en) handles the recommendation problem from the viewpoint of graphs and makes a useful comparison with this lecture.

**Next lecture.** [Techniques Lecture 16: Finale](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning-en) gathers the whole of Techniques into three families of techniques: feature exploitation, error optimization, and overfitting elimination. Both solvers of this lecture reappear in the optimization family: page 7 of the handout `216_handout.pdf` lists Matrix Factorization under SGD, and page 9 lists alternating LeastSqr together with k-means under Alternating Optim.

## Course video sources

Original videos: [Linear Network Hypothesis](https://www.youtube.com/watch?v=2pX76iH_irw), [Basic Matrix Factorization](https://www.youtube.com/watch?v=3l5kaWkcR6s), [Stochastic Gradient Descent](https://www.youtube.com/watch?v=br3IzOz-xMs), [Summary of Extraction Models](https://www.youtube.com/watch?v=xKZMB4T2a2s)

- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-13: Techniques Lecture 15 became its own article (it used to share one article with Techniques Lecture 14) and was rewritten from the handout and the video transcripts.

## References

- [Techniques Lecture 15 handout, 215_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/215_handout.pdf): the main source for this article. The content of the four sections, the four Fun Time questions, the rating table and factor figure on page 8, and the maps on pages 18–20 all come from this handout.
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [MOOC slide errata](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php): the official list of corrections to the handouts.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the course plan does not schedule this lecture, and the homework has no matrix factorization problems.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the course plan does not schedule this lecture.
- [Learning from Data textbook website](http://amlbook.com): the textbook the course pages use when marking chapters; this lecture has no corresponding chapter.
- [A linear ensemble of individual and blended models for music rating prediction (Chen et al., KDD Cup 2011)](http://www.csie.ntu.edu.tw/~htlin/paper/doc/wskdd11cup_one.pdf): the paper by the champion team mentioned on page 16 of the handout, listed as further reading.
- [MovieLens data sets (GroupLens)](https://grouplens.org/datasets/movielens/): data for self-practice, not assigned by the course.
- [Stanford CS224W guide](/posts/ai/2026-08-21-stanford-cs224w-ml-with-graphs-en): further reading, the recommendation problem from the viewpoint of graphs.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
