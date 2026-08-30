---
title: "Where Should You Start Statistics If You Need Exams and ML/AI?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 1
tldr: "Do not start statistics exam prep by memorizing formulas. Start with the sequence of data, probability, sampling, inference, regression, then connect those ideas to model evaluation, A/B testing, and uncertainty in ML/AI."
description: "A beginner-friendly starting point for statistics: how to build a study order from exam recognition to data, probability, sampling, inference, regression, and ML/AI evaluation."
draft: true
---

> [Mandarin version](/posts/learning/2026-08-29-im-stat-study-guide)

If you are starting statistics because of a graduate-school entrance exam, the easiest wrong turn is to open past papers on day one and memorize whatever formula appears. A confidence interval problem gives you a confidence interval formula. A chi-square problem gives you a chi-square formula. It feels productive because the formula list grows every night. Then an actual exam question appears, and you still do not know what to decide first.

There is another common detour: treating statistics as a pure math sequence from the start. You move through counting, probability distributions, expectations, and estimator properties. Each section makes sense in isolation, but the connection to exam questions stays blurry. You can compute, but you do not know when to compute.

This series has a concrete job: help a beginner read statistics as a usable decision process. Usable means you can recognize the type of exam problem, inspect uncertainty behind a model-evaluation score, and see why an A/B test or biased dataset cannot be fixed by computing a few more averages.

## First See Statistics as Four Questions

Statistics has many chapters. At the beginning, do not see them as a row of tools. See them as four questions.

The first question is: what does the data look like? This uses data types, means, medians, variances, standard deviations, proportions, and contingency tables. You need to know whether the data is categorical, numeric, count-based, or time-ordered before you decide whether a mean, chi-square test, or train/test split makes sense.

The second question is: if the world repeated, how would the result change? This is where probability, random variables, distributions, expected values, and variances enter. Statistics cares not only that this sample produced 82%, but also whether another sample could produce 78% or 86%.

The third question is: can a sample speak about a larger population? This is where sampling, standard error, the central limit theorem, confidence intervals, and hypothesis tests enter. Many exam problems live here. You only have a sample, but the question asks about a population mean, population proportion, or real difference between groups.

The fourth question is: how does this judgment become a decision? This is where regression, model comparison, experimental design, causal inference, and A/B testing enter. A p-value is an intermediate result. The final answer still has to say whether a new method looks better, whether a model should ship, or whether an observed difference can be treated as an effect.

These four questions are the main line of the series.

## Do Not Order Your Study by Formula Difficulty

For a beginner, the study order should follow the order of judgment inside a problem. Learn what you need to decide first, then learn the formulas that support those decisions.

The first layer is data and probability. You need to distinguish means from proportions, standard deviation from standard error, independence from mutual exclusivity, and conditional probability from Bayesian reverse reasoning. If these are unstable, every later tool becomes easy to misuse.

The second layer is sampling and inference. Confidence intervals, hypothesis tests, two-sample comparisons, chi-square tests, and ANOVA look like separate formulas. Underneath, they handle the same issue: the gap between a sample result and a population truth. The point is to know which tool fits and how to write the conclusion conservatively.

The third layer is estimation and modeling. Regression, MLE, Bayesian inference, regularization, bootstrap, A/B testing, and causal inference connect statistics to ML/AI. Modern model work asks statistical questions every day: whether a score gap is stable, whether a test set represents real tasks, and whether data bias makes a model look better than it is.

This order prevents the chapters from becoming islands. A confidence interval is not a standalone trick; it follows standard error. A hypothesis test is not p-value memorization; it follows sampling distributions. Regularization is not a mysterious ML technique; it can connect back to MAP estimation and priors.

## A Model Comparison Example

Suppose a problem says: model A answers 82 out of 100 test items correctly, while model B answers 78. Can we say A is better?

The raw numbers point toward A: 82% is higher than 78%. Statistics asks you to slow down, because a four-item gap may reflect model ability or sampling fluctuation in the test items.

First classify the data. Each item is correct or incorrect, so each model's performance can start as a proportion. A's sample accuracy is 0.82. B's sample accuracy is 0.78.

Second, identify the real target. You do not only care who did better on these 100 items. You care whether A's true accuracy is higher on future tasks from the same population. The problem has moved from description to inference.

Third, inspect the comparison design. If A and B answered the same 100 items, this is a paired comparison. Each item produces both an A result and a B result. You should look at items where A is correct and B is wrong, and items where A is wrong and B is correct. You should not treat the two 100-item results as fully independent. If the models used different test sets, the comparison is closer to an independent two-proportion problem.

Fourth, write the conclusion. A stronger exam answer sounds like this: "A's sample accuracy is 4 percentage points higher than B's, but the correct comparison depends on whether the test design is paired or independent. The raw sample accuracies alone are not enough to claim that A is better on the population of future tasks."

That is the statistical reading. Formulas matter, but they are not the first move.

## Exams Test Problem Recognition First

Exam questions rarely test only whether you can substitute numbers into a formula. They test whether you can see the structure of the problem.

If a question asks whether an average score is above 70, think about a one-population mean. If it asks whether two teaching methods differ, check whether the groups are independent or the same students measured before and after. If it gives a category table and asks whether gender and course choice are related, think of a chi-square test of independence. If it asks whether multiple group means differ, ANOVA matters because repeated pairwise testing inflates error.

These decisions happen before formulas. A wrong formula can lose points, but a wrong problem type sends the whole answer in the wrong direction. Early study should train the habit of naming the problem type before calculating.

That is why each post in this series keeps three recurring tasks: identify the kind of problem, walk through a worked example, and show where the concept appears in ML/AI. The concepts land in workflows such as model evaluation, data inspection, online experiments, and monitoring reports.

## How This Statistics Base Connects to ML/AI

The most common statistical mistake in ML/AI is trusting one score too quickly.

If a model wins a benchmark by 1 percentage point, is it truly better? You need test-set size, task distribution, sampling fluctuation, and repeated evaluation. If a recommender increases click-through rate after launch, did the model cause the lift? You need random assignment, seasonality checks, and subgroup analysis. If a dataset is missing labels for some groups, is mean imputation enough? You need the missing-data mechanism, because missingness itself may be a bias source.

Most of these questions use basic statistics. Descriptive statistics checks data. Probability explains precision, recall, and base rates. Sampling distributions explain benchmark fluctuation. Confidence intervals and tests compare models. Regression and experimental design explain product changes. Bayesian methods and bootstrap help when data is limited or formulas are hard to write down.

After this series, you will not be a statistician, and 53 posts do not replace a full textbook. But you should have a stable frame: where to start on exam problems, and which ML/AI report scores should not be accepted at face value.

## How to Use This Series

If you are starting from zero, read posts 1 through 20 in order. This section builds data, probability, distributions, sampling, confidence intervals, tests, regression, and basic exam recognition. Do not only highlight passages. After each post, write one short answer: what is the problem asking, what is the data, what is the unknown, and what tool fits?

If you have taken statistics before but still feel unstable on exam questions, start from post 9 on confidence intervals and post 10 on hypothesis testing. Then move through two-sample comparisons, chi-square, ANOVA, regression, and mixed-problem recognition. This route is better for exam review.

If you want the ML/AI bridge, do not skip the inference layer. After post 30, the series covers asymptotic normality, delta method, bootstrap, Bayesian inference, regularization, A/B testing, causal inference, and evaluation reports. These topics are common in ML/AI, but without sampling and uncertainty, they become another list of terms to memorize.

## How Sources Are Used

- Official past-paper PDFs are used only for years, subject names, and problem statements; two years of questions are not treated as the full future scope.
- The grad-exam-prep pages are used for study-route, question-index, and practice-flow alignment, not as official solutions.
- OpenIntro, OpenStax, and other open textbooks are used to verify formulas, definitions, assumptions, and common derivations.
- Stanford CS109 and scikit-learn documentation are used to connect each topic to ML/AI training, evaluation, experiments, and uncertainty reporting.

## Problem Recognition Hints

- First decide whether the task asks for study strategy, concept recognition, calculation, or written-answer format.
- Past papers are practice entry points; verify years and problem statements against official PDFs.
- After each post, state where the concept appears in an ML/AI workflow.

## Common Mistakes

- Applying formulas by keyword without checking data type and assumptions.
- Treating sample statistics as population parameters.
- Treating two years of past papers as the complete future scope.
- Treating the ML/AI connection as a claim that the exam will directly test AI terms.

## Practice

1. Spend 10 minutes sorting the 53 posts into exam foundations, inference reasons, and ML/AI applications.
2. Take one model-accuracy comparison and write data, statistic, unknown quantity, and decision.
3. Rewrite "use only two years of past papers" as a conservative study strategy: what it can train and what it cannot infer.
4. List your five weakest topics and map them to series order.

## Next

The next post asks a more basic question: what is statistics actually deciding for you? It separates description, estimation, comparison, association, and decision, so formulas later have a clear job.

## Section-Level Source Map

- OpenIntro / OpenStax: foundation sequence and terminology.
- grad-exam-prep: NTU IM study-route and practice-flow alignment only.
- Stanford CS109 / scikit-learn: model evaluation, metrics, and uncertainty connections.

## References

- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
