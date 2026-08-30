---
title: "Statistics Is Not Formula Memorization: What Is It Deciding?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 2
tldr: "The core of statistics is judgment: describe data, estimate unknowns, compare differences, inspect associations, and make decisions under uncertainty."
description: "A beginner guide to what statistics actually does: how exam questions and ML/AI evaluation both depend on data, unknown quantities, uncertainty, and decisions."
draft: true
---

> [Mandarin version](/posts/learning/2026-08-29-im-stat-what-statistics-solves)

Many people first read statistics as a list of formulas: one formula for the mean, one for variance, one for confidence intervals, one for p-values. That style has a serious flaw. The formula list gets longer, but the problems do not become clearer.

An exam will not label the chapter for you. It gives a short scenario, a few numbers, and asks whether there is a difference, whether two variables are related, whether you can generalize, or how to interpret a result. Your first job is to decide which statistical task the question belongs to.

Without that layer, you fall into keyword reflexes. You compute a mean whenever you see "average," look for a p-value whenever you see "significant," run a t-test whenever you see two groups, or report accuracy whenever you see classification. These actions may be useful later, but they are too early. Statistics first asks: where did the data come from, what unknown quantity matters, and how far can the conclusion travel?

## Statistics Handles the Distance Between Data and Truth

The data in front of you is usually not the full world you care about. You see scores from 40 students, but you care whether a teaching method helps future students. You see model scores on 100 test items, but you care whether the model will be stable on future tasks. You see higher retention among users of a feature, but you care whether the feature caused that retention.

These problems share one structure: the data is in front of you; the truth you care about is outside the data. Statistics helps prevent you from treating the observed data as the whole truth.

Data has sampling error. If you sampled different students, items, or users, the result could change. Data has measurement error. Different instruments or scoring rules can give different values. Data can also be biased. Survey responders, already-active users, and underrepresented error groups can make the result look simpler than reality.

So a statistical answer is rarely just one number. It also says where the number came from, what it represents, how much it can fluctuate, and whether it supports the conclusion being asked for.

## Five Common Tasks

At the beginning, sort statistics problems into five tasks.

The first is description. The question only asks what the current data looks like. You use means, medians, standard deviations, proportions, plots, or contingency tables. A descriptive conclusion should stay inside the observed data.

The second is estimation. The question gives a sample and asks about a population mean, population proportion, regression coefficient, or true model performance. A sample statistic is only the starting point; standard error and confidence intervals enter next.

The third is comparison. Are two group means different? Are two proportions different? Do multiple group means differ? These are comparison problems. The common mistake is looking only at the size of the difference without asking whether it is large relative to noise.

The fourth is association. Do two variables move together? Are two categorical variables independent? Is a feature related to an outcome? Association problems need one warning attached: association does not by itself prove a causal effect.

The fifth is decision. Should you reject a null hypothesis, adopt a new teaching method, ship a model, or trust an A/B test? These problems use the previous four tasks, but the answer has to become an action or judgment.

The same exam question can mix several tasks. A mature answer separates them before choosing formulas.

## A Teaching-Method Example

Suppose a problem says: after using a new teaching method, 40 students have a mean score of 72 and a standard deviation of 12. The historical average for similar exams is 68. Did the new method improve scores?

First, check whether this is only a description problem. If the question asks how these 40 students performed, the answer can stop at mean 72 and standard deviation 12, perhaps with a comment on distribution shape. That describes the observed class.

But the question asks whether the method improved scores. That goes beyond description. You need to define the population mean: the long-run mean score of similar students under the new method, and whether it is higher than 68.

Second, identify the sample statistic. The sample mean is 72, so the observed gap from the benchmark is 4 points.

Third, handle fluctuation. The standard deviation is 12 and the sample size is 40, so the sample mean will not equal the population mean every time. You need the standard error before using either a confidence interval or a one-sample test.

Fourth, write the limitation. A stronger answer says: "The sample mean is higher than the historical average, but the 4-point gap should be evaluated against the standard error. If the sample is representative and the inference supports the difference, the result suggests the new method may improve average scores." That is much better than "72 is greater than 68, so it works."

This example is really about task decomposition: describe the observed data, decide whether inference is needed, compare against a target, then write a decision carefully.

## The Same Logic in Model Evaluation

Replace the teaching method with a new model and the problem is almost the same.

Model A scores 72 on a test set; the old model scores 68. That describes the current test set. What you actually care about is whether the new model will be better on future tasks of the same kind.

Then the questions become: does the test set represent real use? How large is the score fluctuation? Is a 4-point gap stable? Are errors concentrated in certain task types? If the new model improves only on easy cases, the average may hide risk.

An ML/AI evaluation report that says only "the new model improves by 4 points" is statistically incomplete. A better report includes the test-set source, sample size, score distribution, confidence interval or resampling result, and the conditions under which the model should not ship.

This is the role of statistics in ML/AI. A metric is the starting point. A decision also needs data provenance, fluctuation, limits, and error distribution.

## What to Practice While Reading This Series

For each post, do not ask "what is the formula?" first. Ask four questions:

1. What data is in the problem?
2. What unknown quantity does the question really care about?
3. How much could the sample result fluctuate because of sampling or noise?
4. Is the final task description, estimation, comparison, association, or decision?

Use any statistics problem to practice these four lines. If you cannot write them, you are not ready to plug numbers into a formula. Once you can write them, the formula has a place.

## How Sources Are Used

- Official past-paper PDFs are used only for years, subject names, and problem statements; two years of questions are not treated as the full future scope.
- The grad-exam-prep pages are used for study-route, question-index, and practice-flow alignment, not as official solutions.
- OpenIntro, OpenStax, and other open textbooks are used to verify formulas, definitions, assumptions, and common derivations.
- Stanford CS109 and scikit-learn documentation are used to connect each topic to ML/AI training, evaluation, experiments, and uncertainty reporting.

## Problem Recognition Hints

- If the question only summarizes observed data, it is descriptive.
- If it generalizes from a sample to a population, future, or unknown parameter, it is inferential.
- Treat model scores as sample statistics before treating them as true capability.

## Common Mistakes

- Applying formulas by keyword without checking data type and assumptions.
- Treating sample statistics as population parameters.
- Treating two years of past papers as the complete future scope.
- Treating the ML/AI connection as a claim that the exam will directly test AI terms.

## Practice

1. Rewrite "a class mean is 78" as a description problem, inference problem, and decision problem.
2. Give one example each of population, sample, parameter, and statistic.
3. Explain the difference between noise and bias with one ML/AI example each.
4. Write an 80-word answer: why statistics is not formula memorization.

## Next

The next post returns to the data itself. You need to know whether a variable is categorical, numeric, count-based, or time-ordered before deciding whether to use a mean, proportion, chi-square test, regression, or time-aware split.

## Section-Level Source Map

- OpenIntro / OpenStax: definitions of population, sample, parameter, and statistic.
- Stanford CS109: uncertainty and data-generating perspective.
- scikit-learn: generalization and model-evaluation context.

## References

- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
