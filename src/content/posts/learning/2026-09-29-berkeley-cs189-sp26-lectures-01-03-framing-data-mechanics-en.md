---
title: "CS189 Spring 2026 Lec 1–3: ML Problem Framing, Data Tools, Terminology and Techniques"
date: 2026-09-29
category: learning
tags: [berkeley, cs189, machine-learning, open-course, scikit-learn, pandas]
lang: en
type: guide
difficulty: 進階
series:
  name: "Reading Berkeley CS189"
  order: 3
tldr: "The first three lectures of CS189 Spring 2026 hold off on derivations. They teach you how to tell whether a problem calls for ML, how to look at data with pandas and Plotly, and how to run one full train/validate/test cycle in scikit-learn. Lecture 1 has slides but no recording; Lectures 2–3 have slides and video; Discussion 1 is a calculus, linear algebra and probability warm-up with solutions and a walkthrough. Together they set you up directly for HW1."
description: "A guide to Berkeley CS189 Spring 2026 Lectures 1–3 and Discussion 1: the three kinds of problems and the learning settings, pandas and Plotly, train/validation/test splits, feature engineering, inductive bias and no free lunch, hyperparameter tuning, plus the Bishop sections and where to find each lecture."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-01-03-framing-data-mechanics)

**Video status: Videos included.** [Source details](#course-video-sources)

This post follows [CS189 Spring 2026](https://eecs189.org/sp26/) (Jennifer Listgarten / Alex Dimakis). For why this semester, see the previous post, the [version map](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-course-map-en).

Most machine learning courses start deriving algorithms in week one. CS189 Spring 2026 does the opposite. One slide in [Lecture 1](https://drive.google.com/file/d/1dGqaqLlUbR6eW81MOIpW3U2JueI_dspt/view?usp=sharing) says it outright: "Teach ML Backwards". First you learn when to use ML, how to frame the problem, how to prepare data, and how to train and evaluate. The algorithmic details come later. The first three lectures open the course this way, and by the end you'll have the tools HW1 needs.

| Lecture | Date | Materials | Recommended Bishop reading |
|---|---|---|---|
| Lec 1 Introduction + ML problem framing | 1/20 | [PDF](https://drive.google.com/file/d/1dGqaqLlUbR6eW81MOIpW3U2JueI_dspt/view?usp=sharing) (no recording) | 1.1–1.3 |
| Lec 2 Data Tools | 1/22 | [PDF](https://drive.google.com/file/d/1ShsOM4DwEE1xkML4Zu5JlJFJjibu55xP/view?usp=sharing) / [video](https://www.youtube.com/watch?v=IzfaWKuxThw&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE) | Not covered in the textbook |
| Lec 3 ML Mechanics: Terminology and Techniques | 1/27 | [PDF](https://drive.google.com/file/d/1COKRZ917r0pTQUFaYA-xO-ZDfN1nuTbn/view?usp=drive_link) / [video](https://www.youtube.com/watch?v=oVo_RajZ3aE&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE&index=1) | 1.1–1.2.6, 3.5.3, 4.1, 4.1.1, 5.4.3, 9.1, 9.1.2 |
| Discussion 1 | Week 2 | [Worksheet](https://drive.google.com/file/d/13TjzfhCv8lbf8pxoQjOx4RoEY0oS5-9b/view?usp=sharing) / [Solutions](https://drive.google.com/file/d/1rvdrRJ6YBEDrIhxeulEjq80H1iI2qwVR/view?usp=sharing) / [Walkthrough](https://www.youtube.com/watch?v=dTdHuJEHOsM&list=PL-ysCubq-Sa8_GGY5otoIkzjneKo-qfW3) | — |

The textbook is Bishop and Bishop's *Deep Learning: Foundations and Concepts*. [bishopbook.com](https://www.bishopbook.com) hosts a free online reading version.

## Course video sources

The official Spring 2026 schedule and the official YouTube playlist (Spring 2026 Lectures, 25 videos) were checked live on 2026-10-10; the lecture recordings embedded here are listed there. The official schedule lists no recording for Lecture 1. No unverified timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=IzfaWKuxThw
title: Lecture 2 recording: Data Tools
```

```youtube
url: https://www.youtube.com/watch?v=oVo_RajZ3aE
title: Lecture 3 recording: Machine Learning Mechanics - Terminology and Techniques
```

Original videos: [Lecture 2 recording: Data Tools](https://www.youtube.com/watch?v=IzfaWKuxThw)、[Lecture 3 recording: Machine Learning Mechanics - Terminology and Techniques](https://www.youtube.com/watch?v=oVo_RajZ3aE)

Course and recording entries:

- [Official course and recording entry](https://eecs189.org/sp26/)
- [CS189 Spring 2026 Lectures — official YouTube playlist (25 videos)](https://www.youtube.com/playlist?list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE)

Checked: 2026-10-10.

Content check: verified against the video transcripts (2026-10-10; mostly spot samples and keyword searches, not word by word): the Lecture 2 video (IzfaWKuxThw, about 80 minutes) is indeed Data Tools: it opens by recapping Lec 1's three-way split (engineering, ML, and human problems) and generalization, then spends most of its time on pandas (selection, joins, group by, and so on); visualization gets only a brief mention of Matplotlib and Plotly, and Weights & Biases does not appear. The Lecture 3 video (oVo_RajZ3aE, about 76 minutes) is indeed ML Mechanics: the FashionHub example, train/validation/test, one-hot encoding and log transforms, standardization, the COVID accuracy example, no free lunch, underfitting and overfitting, and an announcement that HW1 is released on Friday. The instructor stops with a few slides left, so the homework pages, grid search, predict_proba, and ImageNetV2 appear only on the slides, not in the transcript. Statements in this post that are attributed to "the slides" were not compared page by page, and the transcripts do not name the speakers, so speaker attribution is not verified.

## Lec 1: which problems belong to ML

Lecture 1's definition is short: machine learning is software systems that improve (learn) through data. Two classic examples show why we need it. Spam is hard to define but easy to demonstrate. Face detection is hard to program but easy to demonstrate.

It then sorts problems into three kinds:

- **Engineering problems**: you can write a direct algorithm or a set of rules.
- **ML problems**: the solution is easy to demonstrate or evaluate but hard to implement directly.
- **Human problems**: the problem can't be specified well, or it needs human judgement.

The slides add that real systems usually need all three. Chatbots serve as the example. [ELIZA](https://en.wikipedia.org/wiki/ELIZA), from 1966, was written as rules. You can't write rules for good conversation, but you can demonstrate it and judge it, which makes it an ML problem.

The learning settings split by what you observe. Supervised learning sees (X, Y) pairs. Unsupervised learning sees only X. Reinforcement learning sees X and a reward. The slides state that reinforcement learning is out of scope for this course.

Lecture 1 walks through the vocabulary with a beverage taste-test dataset: two features (acidity and sweetness) and a binary label (tastes great or not). It partitions the feature space first with a decision stump, then a depth-2 tree, then a linear classifier. The key point is a "very bad model" that always exists: memorize the training set, get it perfectly right, and predict nothing useful about new data. That's where the generalization problem begins.

Finally it draws the ML lifecycle that runs through the whole semester: **Learning Problem → Model Design → Optimization → Predict & Evaluate**. The slides also list the course tools: pandas, Plotly, Matplotlib, scikit-learn, PyTorch, Hugging Face and Weights & Biases, with Google Colab as the default environment.

**One thing to do tonight**: pick a problem from your own work and decide whether it's an engineering, ML or human problem. If it's an ML problem, write three lines: what you want to predict, how you'd judge success, and what data you have.

## Lec 2: pandas and visualization

Lecture 2 is purely about tools, and its last slide says the topic isn't covered in the textbook. The reasoning is that every model starts with data and is evaluated on data. Whether you join a lab or industry, wrangling and visualizing data is a core skill.

The pandas part covers, in order:

- **Data structures**: a Series is a one-dimensional labeled array; a DataFrame is a table made of Series.
- **Exploring**: `head()`, `tail()`, `info()`, `describe()`, `sample()`, `value_counts()`, `unique()`.
- **Selecting**: `iloc` by position, `loc` by label, `[]` by context. The slides flag the slicing difference: `iloc` excludes the right endpoint, `loc` includes it.
- **Filtering**: Boolean arrays, combined with `&` and `|`.
- **Modifying**: adding columns, `drop` (not in place by default), `sort_values`, and missing values (`isnull`, `dropna`, `fillna`).
- **Aggregating and joining**: `groupby().agg()`, `pivot_table`, and inner/outer/left/right joins.

For visualization, the course picks Plotly and Weights & Biases over Matplotlib. The slides explain that interactive plots are easier to slice, and getting to insights faster is a focus of the course. They also admit most paper figures are still made with Matplotlib. Plotly is taught three ways: pandas' built-in `.plot` (after setting `plotting.backend` to `plotly`), Plotly Express, and graphics objects.

**One thing to do tonight**: grab any CSV, compute one grouped statistic with `df.groupby(...).agg(...)`, and draw a hoverable scatter plot with `px.scatter`.

## Lec 3: one pass through the ML lifecycle

Lecture 3 states its goals on the second slide. It introduces the major concepts at a high level, not rigorously, and says they'll be revisited formally later. It shows how to do basic machine learning in Python, visits each step of the lifecycle, and prepares you for HW1. The main tool is [scikit-learn](https://scikit-learn.org/stable/).

The running example is FashionHub, a clothing-trading site that wants to tag uploaded photos with clothing categories automatically. It's a multi-class classification problem.

### Look at the data first

The slides list what to ask when you look at data. How many examples (N)? How many feature dimensions (D)? What's the distribution? Is everything numeric? Are values missing? Are labels discrete? Are some labels missing or wrong?

### The accuracy trap

Accuracy is correct predictions divided by total examples. The slides warn with an example: a COVID photo classifier claiming 99% accuracy. Accuracy blends two kinds of error, false positives (Type 1) and missed detections (Type 2), and their costs usually differ a lot. The example is a car part where 1 in 100 steering-wheel fasteners is faulty. Throwing away some good parts is far cheaper than shipping a faulty one.

### Train, validation, test

Generalization means performing well on new, unseen data from the same distribution as the training data. To measure it, shuffle the data and split it into about 80% training and 20% test. Use the test set only once, at the end. Tune on it and it no longer measures generalization. To evaluate during development, split off a validation set too.

The slides use an exam analogy. The training set is practice questions, the validation set is a practice exam, and the test set is the real exam. They also cite the ImageNetV2 study, where a test set re-collected the same way still produced lower model accuracy than the original.

### Feature engineering

Feature engineering means selecting input features from the raw data and encoding them. The encodings covered:

- Categorical features (ZIP codes, product SKUs) use **one-hot encoding**.
- Heavily skewed features (click counts, prices) often get a log transform.
- Features on different scales get **standardized**: compute the mean and variance on the training set and transform to zero mean and unit variance. At test time you must reuse the training statistics.
- Text can use one-hot, bag-of-words, or vectors from a large language model.
- The simplest option for images is to flatten the tensor, which the slides note HW1 will use.

One line stands out: the core innovation in deep learning is learning the feature encodings.

### Model families, inductive bias, no free lunch

The model family determines the form of the function, and the hypothesis space is every model in that family. For linear regression, each weight vector gives a different line, and all those lines form the hypothesis space.

**Inductive bias** is the set of assumptions that lets a model generalize beyond its training data. The slides' example has two training points, (−1, 1) and (1, 1), and asks for y at x = 0. Infinitely many models fit the training data. Choosing the linear family introduces an inductive bias. The **no free lunch theorem** says no model is best for every problem, so you need to pick one with the right inductive bias. This matches Bishop 9.1 and 9.1.2.

More concepts follow. Non-linear models are more expressive, but more complex isn't always better: there's underfitting, a sweet spot, and overfitting. Regularization adds constraints or penalties during learning to improve generalization. Parametric models have a fixed number of parameters. Non-parametric models have "parameters" that grow with the data. The nearest-neighbour model is the example, since its parameters are the entire training set (Bishop 3.5.3). Logistic regression first appears here as a linear classification model, with details deferred to later lectures.

### Hyperparameters and evaluation

Hyperparameters stay fixed during training, such as the regularization strength λ. You choose them by validation performance, often with a grid search. The slides describe a common plot. As regularization changes, training accuracy keeps rising, while validation accuracy rises and then falls, with a sweet spot in between.

Predictions come in two forms. `model.predict()` gives a label only. `model.predict_proba()` gives a probability distribution, which keeps the uncertainty. Errors also come in kinds, and decision theory is how you put costs on them.

### Homework notes

The last slides of Lecture 3 cover homework. Part 1 applies lecture material through written questions and coding. Part 2 involves reading and implementing papers. Both parts of HW1 are due February 20. The Part 1 written questions review the linear algebra, calculus and probability prerequisites, and the slides recommend not using AI for them. The coding uses pandas, Plotly, scikit-learn and image transformations, with a warning that later problems are much harder than the early ones. HW1 Part 2 has no paper. The task is to make your Part 1 model do better on a secret test set.

**One thing to do tonight**: load any built-in scikit-learn dataset, split it into train/validation/test, grid-search one hyperparameter over three values, and touch the test set only once at the end.

## Discussion 1: prerequisite warm-up

[Discussion 1](https://drive.google.com/file/d/13TjzfhCv8lbf8pxoQjOx4RoEY0oS5-9b/view?usp=sharing) says up front that the worksheet is deliberately longer than an hour's work so you can keep practising with it. It has three parts:

- **Calculus**: prove that the sigmoid satisfies σ′(t) = σ(t)(1 − σ(t)), then use the chain rule for the partial derivatives of σ(ax + by); compute partial derivatives of a sum of squares and of the inner product wᵀx.
- **Linear algebra**: prove AᵀA is symmetric; find the singular values of a 3×2 matrix.
- **Probability**: two spam filters that are conditionally independent given the class. Find the probability that both flag an email, and the posterior probability that an email flagged by both is spam.

These map almost one-to-one onto the prerequisites behind the HW1 written questions. Try them yourself, then check the [solutions](https://drive.google.com/file/d/1rvdrRJ6YBEDrIhxeulEjq80H1iI2qwVR/view?usp=sharing), and watch the [walkthrough](https://www.youtube.com/watch?v=dTdHuJEHOsM&list=PL-ysCubq-Sa8_GGY5otoIkzjneKo-qfW3) if you get stuck. If the probability question stumps you, review Bayes' theorem first.

## Self-study checklist

1. Read the Lecture 1 slides (no recording, about 86 pages).
2. Watch Lecture 2 with a notebook open and type along with the pandas commands.
3. Watch Lecture 3 and map each FashionHub step onto the four lifecycle stages.
4. Do Discussion 1 under a time limit, then check the solutions.
5. Open the [HW1 Part 1 folder](https://drive.google.com/drive/folders/1gnC68dyq-QKJ5qFc-wKPJ4bCn1Q-YV8C). These three lectures are enough to start the written questions.

**Fall 2026 counterpart**: [Fall 2026](https://eecs189.org/fa26/) Lec 1 (Introduction + ML Problem Framing), Lec 2 (KNN, ML Vocabulary, and K-Means), and Discussion 1 (ML Problem Framing).

## Series navigation

- Previous: [Three versions of CS189: Spring 2026 as the base, Spring 2025 as the classic, Fall 2026 in progress](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-course-map-en)
- Next: [Lec 4–7: K-means, probability review, MLE, multivariate Gaussians and GMMs](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-04-07-clustering-mle-gmm-en)

## Further reading

- [Stanford CS109 L3: Bayes' theorem](/en/posts/learning/2026-08-22-stanford-cs109-lecture-03-bayes-theorem-en): background for the Discussion 1 probability question
- [Stanford CS229 notes Ch. 1: linear regression](/en/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-01-linear-regression-en): how another course starts from linear models
- [CMU 11-785 L1: introduction](/en/posts/ai/2026-08-22-cmu-11785-01-introduction-en): the same basics from a deep learning angle

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official Spring 2026 schedule and YouTube playlist were checked live and list the embedded lecture recordings, so the status is now Videos included.
- 2026-10-10: Checked the video content against its transcript. Both videos match their lecture topics; the Lec 2 video says little about visualization and the Lec 3 video ends before the homework pages, which is now noted in the video sources section.

## References

- [CS 189/289A Spring 2026 home page and schedule](https://eecs189.org/sp26/)
- [Spring 2026 Lecture 1: Introduction + ML problem framing (PDF)](https://drive.google.com/file/d/1dGqaqLlUbR6eW81MOIpW3U2JueI_dspt/view?usp=sharing)
- [Spring 2026 Lecture 2: Data Tools (PDF)](https://drive.google.com/file/d/1ShsOM4DwEE1xkML4Zu5JlJFJjibu55xP/view?usp=sharing), [video](https://www.youtube.com/watch?v=IzfaWKuxThw&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE)
- [Spring 2026 Lecture 3: Machine Learning Mechanics (PDF)](https://drive.google.com/file/d/1COKRZ917r0pTQUFaYA-xO-ZDfN1nuTbn/view?usp=drive_link), [video](https://www.youtube.com/watch?v=oVo_RajZ3aE&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE&index=1)
- [Spring 2026 Discussion 1 worksheet](https://drive.google.com/file/d/13TjzfhCv8lbf8pxoQjOx4RoEY0oS5-9b/view?usp=sharing), [solutions](https://drive.google.com/file/d/1rvdrRJ6YBEDrIhxeulEjq80H1iI2qwVR/view?usp=sharing), [walkthrough](https://www.youtube.com/watch?v=dTdHuJEHOsM&list=PL-ysCubq-Sa8_GGY5otoIkzjneKo-qfW3)
- [Spring 2026 HW1 Part 1 folder](https://drive.google.com/drive/folders/1gnC68dyq-QKJ5qFc-wKPJ4bCn1Q-YV8C)
- [Bishop & Bishop, Deep Learning: Foundations and Concepts](https://www.bishopbook.com)
- [scikit-learn documentation](https://scikit-learn.org/stable/)
- [CS 189 Fall 2026 site](https://eecs189.org/fa26/)
