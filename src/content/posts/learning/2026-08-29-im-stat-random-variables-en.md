---
title: "How Do PMF, PDF, and CDF Turn Probability Into Computation?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 5
tldr: "Random variables turn uncertain outcomes into numbers. PMF, PDF, and CDF then let you compute discrete probabilities, continuous interval probabilities, thresholds, and model-score distributions."
description: "A beginner guide to random variables: how to distinguish PMF, PDF, and CDF, compute discrete and continuous probabilities, and connect them to ML/AI score distributions and token sampling."
draft: false
---

> [中文版](/posts/learning/2026-08-29-im-stat-random-variables)

The previous post treated probability problems as events: whether an email is truly spam, whether the model flagged it, and whether two events are independent. This post moves one step forward. Many statistics problems ask not only whether an event happens, but what numerical value appears, which interval it falls into, or how likely it is to exceed a threshold.

That is the job of a random variable. A random variable turns an uncertain outcome into a number. A die roll can become `X=1` through `X=6`. A model confidence score can become a number between 0 and 1. The number of support tickets arriving in one day can become a nonnegative integer.

Beginners often memorize PMF, PDF, and CDF as three separate terms. A better reading starts with questions: is the random variable discrete or continuous? Does the problem give probabilities for individual values, a density over a continuous range, or accumulated probability up to a threshold?

## Random Variables Encode Outcomes

An event answers whether something happened. A random variable answers which number an outcome maps to.

If you flip one coin, you can define `X=1` for heads and `X=0` for tails. `X` is a random variable. It is an encoding rule: after the experiment happens, the outcome receives a number.

For a model classification result, you can define `X=1` for correct and `X=0` for wrong. Then one model answer is a 0/1 random variable. Add many such answers and you move toward Bernoulli and Binomial models.

If you look at model confidence scores, `X` may be continuous between 0 and 1. Then you usually do not ask for `P(X=0.73)`. You ask for `P(X>0.8)` or `P(0.6<X<0.9)`.

## PMF: Discrete Values One by One

A discrete random variable has countable possible values. A PMF, or probability mass function, tells you the probability of each value.

Suppose `X` is the error type of a model answer:

| X | Meaning | Probability |
|---|---|---:|
| 0 | Correct | 0.70 |
| 1 | Conceptual error | 0.20 |
| 2 | Careless error | 0.10 |

This table is a PMF. It must satisfy two conditions: every probability is nonnegative, and all probabilities sum to 1. In exams, the first move with a PMF is to check those conditions. Many problems hide that check inside a "find constant c" question.

If the problem asks for `P(X=1)`, the answer is 0.20. If it asks for `P(X>0)`, the answer is conceptual error or careless error:

```text
0.20 + 0.10 = 0.30
```

## PDF: Continuous Probability Is Area, Not Point Height

Continuous random variables have too many possible values to list. Height, time, model confidence score, and prediction error can fall anywhere in an interval. For these variables, we use a PDF, or probability density function.

PDFs are easy to misread. The height of a PDF is not the probability at one point. For a continuous random variable, `P(X=a)` is usually 0. The meaningful quantity is area over an interval.

So when a problem gives a PDF, translate the question into area. If it gives a density `f(x)` and asks for `P(1<X<3)`, you integrate `f(x)` from 1 to 3. Graphically, it is the area under the curve between 1 and 3.

Exam PDF problems often have two tasks: use total area 1 to solve for a constant, then integrate over an interval to find a probability. Do not treat `f(2)` as `P(X=2)`.

## CDF: Accumulating Everything to the Left

The CDF, or cumulative distribution function, is:

```text
F(x) = P(X <= x)
```

It answers: how much probability has accumulated up to x?

CDFs make interval probabilities easy:

```text
P(a < X <= b) = F(b) - F(a)
```

This works for both discrete and continuous variables, though endpoints need care in discrete problems.

Suppose `X` is a model confidence score. If `F(0.6)=0.25`, then 25% of samples have confidence at most 0.6. If `F(0.9)=0.80`, then:

```text
P(0.6 < X <= 0.9) = 0.80 - 0.25 = 0.55
```

This language is useful in ML/AI. When you set a threshold, you often ask how many scores fall below it or how many examples enter a high-risk zone. That is a CDF question.

## A PMF and CDF Example

Suppose `X` is a human rating for one model answer:

| X | Meaning | Probability |
|---|---|---:|
| 0 | Wrong | 0.20 |
| 1 | Partly correct | 0.50 |
| 2 | Fully correct | 0.30 |

First, check the PMF. All probabilities are nonnegative and:

```text
0.20 + 0.50 + 0.30 = 1
```

So it is valid.

Next, compute the CDF:

```text
F(0) = P(X <= 0) = 0.20
F(1) = P(X <= 1) = 0.20 + 0.50 = 0.70
F(2) = 1
```

Now answer an interval question. If the problem asks for `P(0<X<=2)`, the score is partly correct or fully correct:

```text
0.50 + 0.30 = 0.80
```

Using the CDF:

```text
F(2) - F(0) = 1 - 0.20 = 0.80
```

A common mistake is writing `F(2)-F(1)`. That gives only `P(1<X<=2)`, so it misses `X=1`. Endpoints matter in discrete problems.

## Where This Shows Up in ML/AI

The next-token distribution of a language model can be read as a discrete distribution. Each token has a probability, and all token probabilities sum to 1. Temperature, top-k, and top-p settings modify or truncate that discrete distribution.

Classifier score distributions behave more like continuous variables. You usually do not care whether one sample has score exactly 0.731. You ask what fraction of scores exceed 0.8, or whether low-score samples are concentrated in certain task types.

Evaluation metrics can also be treated as random variables. If you change the test set, accuracy, F1, and average rating can change. Sampling distributions, confidence intervals, and bootstrap methods all grow from this idea.

## How Sources Are Used

- Official past-paper PDFs are used only for years, subject names, and problem statements; two years of questions are not treated as the full future scope.
- The grad-exam-prep pages are used for study-route, question-index, and practice-flow alignment, not as official solutions.
- OpenIntro, OpenStax, and other open textbooks are used to verify formulas, definitions, assumptions, and common derivations.
- Stanford CS109 and scikit-learn documentation are used to connect each topic to ML/AI training, evaluation, experiments, and uncertainty reporting.

## Problem Recognition Hints

- If the problem lists the probability of each possible value, think PMF.
- If the problem gives a continuous function and asks for interval probability, think PDF area.
- If the problem gives `F(x)` or asks for probability up to a value, think CDF.
- Thresholds, scores, and "below this value" questions can often be explained with CDF language.

## Common Mistakes

- Treating PDF height as point probability.
- Losing endpoints when subtracting CDF values in a discrete problem.
- Forgetting that PMF probabilities must sum to 1.
- Treating a model score as fixed, while forgetting it changes across data samples.

## Practice

1. Write one discrete and one continuous random variable, and state each support.
2. Given `P(X=0)=0.2`, `P(X=1)=0.5`, and `P(X=2)=0.3`, compute `F(1)` and `P(0<X<=2)`.
3. Explain in one sentence why a PDF is not a point probability.
4. Choose a model-score threshold and explain what practical question the CDF answers.

## Next

Random variables make probability computable. The next post covers several common distributions: Bernoulli, Binomial, Normal, and Poisson. The practice shifts to reading a problem scenario and recognizing the data-generating pattern.

## Section-Level Source Map

- OpenIntro / OpenStax: random variables, PMF, PDF, CDF, support, and interval probability.
- Stanford CS109: random variables, discrete/continuous distributions, and probabilistic-model language.
- scikit-learn: score distributions, thresholds, and classifier-evaluation context.

## References

- [OpenIntro Statistics: random variables, PMF, PDF, CDF](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: random variables and probability distributions](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: random variables and probability models](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation: score distributions and thresholds](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
