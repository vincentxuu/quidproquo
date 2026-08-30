---
title: "How Should You Analyze NTU IM 114-115 Statistics Papers Without Memorizing Answers?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 19
tldr: "Past papers train question-analysis discipline, not fortune-telling. Each problem should return to data type, unknown quantity, statistical tool, calculation path, and contextual conclusion."
description: "A guide to using NTU IM 114-115 statistics past papers: how to analyze prompts, avoid overgeneralizing from two years, and connect questions back to the full statistics map."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-ntu-past-papers-walkthrough)

Past papers are useful, and they are easy to misuse. You can use them to train speed, problem recognition, formula substitution, and contextual conclusions. But if you only have the 114 and 115 papers, you cannot call them the complete future exam scope.

Two years of questions can show what has appeared. They cannot prove what will or will not appear next.

This post deliberately avoids one thing: it does not turn unverified, not-yet-checked PDF details into official solutions. Its purpose is to build a method. When you open the official past-paper PDF, you should know what to mark first, what tool to choose second, and how to write an answer that reads like statistics rather than formula memorization.

## Treat Past Papers as Training, Not Prediction

Many exam mistakes come from the gap between "I have seen this problem" and "I can solve this type." You may have seen a confidence interval and remember `xbar +/- t*SE`. But if the question changes to a proportion, two-sample comparison, paired design, or regression table, the same formula cannot be copied unchanged.

For each problem, split your work into five columns:

```text
data type -> unknown quantity -> statistical tool -> calculation path -> contextual conclusion
```

Data type tells you whether means, proportions, or count tables make sense. Unknown quantity tells you whether the target is a population mean, proportion, difference in means, coefficient, or association. The statistical tool may be a confidence interval, hypothesis test, ANOVA, regression, or chi-square. The calculation path shows substitutions and intermediate steps. The contextual conclusion returns to the object in the question.

This five-column structure prevents keyword-based formula use. On exam day, the useful skill is fast judgment: can you identify the kind of data problem within about 30 seconds?

## Walkthrough Example: Mean Confidence Interval

Suppose a question gives a sample mean, sample standard deviation, and sample size, then asks for a 95% confidence interval for the population mean. Do not rush to the formula. Use the five columns:

```text
data type: numeric sample
unknown quantity: population mean mu
statistical tool: confidence interval for a mean
calculation path: check whether sigma is known -> choose z or t -> compute SE -> compute margin -> write endpoints
contextual conclusion: based on the sample, the 95% confidence interval for the population mean is about A to B
```

If the population standard deviation is unknown, the common form is:

```text
xbar +/- t* s / sqrt(n)
```

If the problem gives `xbar = 82`, `s = 10`, and `n = 25`, then the 95% t interval can be calculated as:

```text
SE = 10 / sqrt(25) = 2
margin = 2.064 * 2 = 4.128
CI = [77.872, 86.128]
```

A complete answer also explains the interval correctly. The 95% refers to the long-run coverage of the sampling procedure, not a 95% probability that the fixed population mean lies in this one computed interval.

## Walkthrough Example: Model Accuracy Comparison

If a question asks whether two methods have different accuracy, do not stop at the word "accuracy." First inspect the data design.

```text
data type: each item is correct/incorrect, so the outcome is binary
unknown quantity: difference in method accuracies, or paired difference on the same items
statistical tool: two-proportion comparison, paired comparison, or bootstrap
calculation path: check whether both methods used the same items -> choose independent or paired design -> compute gap and uncertainty
contextual conclusion: whether the data provide evidence of a performance difference
```

If two models answer the same test items, the data should not be treated as two independent samples. Item difficulty affects both models. You should look at item-level differences or use a paired design. That judgment matters both in exams and in ML/AI evaluation.

## How to Use the 114-115 Papers

Use the 114-115 papers in three rounds.

Round 1: label problem types only. Do not solve yet. Next to each problem, write descriptive statistics, probability, confidence interval, hypothesis test, two-sample comparison, chi-square, ANOVA, regression, or PMF transformation. The goal is to build a topic map.

Round 2: write full solutions. Each answer should include formula, substitution, calculation, and contextual conclusion. If a table lookup is needed, write the degrees of freedom, tail direction, and significance level. Do not leave only the final number.

Round 3: classify mistakes. Use at least five categories: concept error, tool-choice error, substitution error, arithmetic error, and conclusion-language error. Treat conclusion-language errors as real errors, because statistics exams often test whether you can translate numbers back into the original question.

Before publishing formal solutions, each problem statement still needs to be checked against the official PDF. The prep page can be an index and practice route; it is not an official answer key.

## Where This Shows Up in ML/AI

ML/AI evaluation reports need the same discipline. When you see a benchmark table, do not only ask who has the highest score. Ask:

```text
data: where did the test data come from, and does it represent future use?
metric: is the score accuracy, F1, AUC, win rate, or human preference?
sampling: how large is the sample, and is the comparison paired?
uncertainty: is there a confidence interval, bootstrap interval, or test?
decision: is the gap large enough to change the model, product, or process?
```

This is the same workflow as past-paper analysis. Exam prompts wrap the statistical problem in words. ML reports wrap it in tables and leaderboards. In both cases, start with the data type and decision problem, then choose the statistical tool.

## Common Mistakes

Mistake 1: treating the 114-115 papers as the complete exam scope.

Mistake 2: writing formal solutions before checking the official PDF problem statements.

Mistake 3: labeling a problem only as "test" without saying whether it is about a mean, proportion, paired design, or chi-square table.

Mistake 4: giving only formulas and numbers without a contextual conclusion.

Mistake 5: reading an ML/AI benchmark only by the top score without asking about data, metric, and uncertainty.

## Practice

1. Pick one problem from the official PDF and record only year, problem number, and source. Do not solve yet.
2. Split that problem into data type, unknown quantity, tool, calculation path, and contextual conclusion.
3. Mark which post or posts in this series the problem connects to.
4. Write one limitation sentence: the two available years show appeared problem types, not the full future exam scope.

## Next

Past-paper analysis is the practical entry point for Layer One. The next post closes Layer One with a 14-day review plan: how to pick tools quickly in mixed problems and repair mistakes before the exam.

## Section-Level Source Map

- NTU Library Past Exam System: years, subject names, and official PDF entry points; formal solutions require problem-by-problem PDF verification.
- grad-exam-prep: prep page and past-paper page used as topic entry points and practice navigation.
- OpenIntro and OpenStax: formulas, definitions, assumptions, and answer-language checks after problem classification.
- Stanford CS109 and scikit-learn: the same question-analysis workflow applied to model evaluation and uncertainty reporting.

## References

- [NTU IM 114-115 statistics past-paper PDFs: NTU Library Past Exam System](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM 114-115 past-paper entry point: grad-exam-prep](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
- [NTU IM statistics prep topic index](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [OpenIntro Statistics: Inference and Regression Topics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
