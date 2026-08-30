---
title: "How Does Monte Carlo Use Repeated Simulation to Answer Hard Statistical Questions?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 50
tldr: "Monte Carlo repeats a data-generating process many times so sampling variation, power, coverage, and evaluation instability become visible."
description: "Statistics from Exams to ML/AI, post 50: simulation, Monte Carlo error, sampling variability, power, coverage, robustness testing, and agent evaluation."
draft: false
---

> [中文版](/posts/learning/2026-08-29-im-stat-simulation-monte-carlo)

Most previous posts focused on formulas and derivations. Monte Carlo simulation changes the angle. When a problem is hard to solve by hand, an approximation is messy, or a workflow contains many random parts, you repeatedly simulate the process and inspect the distribution of outcomes.

This is not avoiding mathematics. Simulation makes sampling variation, error rates, power, risk, and evaluation instability visible. Exams often ask about simulation steps, the law of large numbers, and Monte Carlo error. ML/AI practice uses the same thinking in repeated eval runs, agent task success, robustness testing, and uncertainty propagation.

## What Problem This Solves

Monte Carlo begins with this question:

```text
If I know or can assume a data-generating process, what distribution would a statistic or decision have after repeated sampling?
```

Examples:

- With sample size 20, what is the approximate power of a t test?
- Under skewed data, does a confidence interval method still have close to 95% coverage?
- If an agent runs the same task 5 times, how much does success rate vary?
- How much does peeking during an A/B test inflate false positives?

These questions may not have simple hand calculations, but they can be approximated by generating data, running the workflow, and collecting results.

## Core Intuition

Monte Carlo has four repeated actions:

```text
1. Define the data-generating mechanism
2. Repeatedly sample
3. Compute the same statistic or make the same decision each time
4. Summarize the resulting distribution
```

The key is repeating the same workflow many times. One result is too thin. You need to see how the result changes across random samples.

Simulation also has a boundary. It answers the world you specify. If the data-generating assumption is wrong, running one million simulations only gives a precise answer to the wrong world.

## Formula and Mechanism

Suppose you repeat the simulation `R` times and obtain `theta_hat_r` each time. The Monte Carlo mean is:

```text
mean(theta_hat) = (theta_hat_1 + ... + theta_hat_R) / R
```

If you estimate an event probability, such as "reject H0," each run records 0 or 1:

```text
estimated probability = number of successes / R
```

Monte Carlo error decreases as repetitions increase. For a proportion estimate, the standard error is approximately:

```text
sqrt(p(1 - p) / R)
```

If `p=0.05` and `R=10000`:

```text
sqrt(0.05 * 0.95 / 10000) = 0.00218
```

That is about 0.22 percentage points. More repetitions reduce simulation error, but they also increase compute cost.

## Worked Example: Coin Flips and Power

Use a coin example first: what is the probability of at least 8 heads in 10 fair coin flips?

By formula, you can use the binomial distribution:

```text
P(X >= 8) = P(X=8) + P(X=9) + P(X=10)
```

Monte Carlo would do this:

```text
repeat 10000 times:
  toss a fair coin 10 times
  count heads
  record 1 if heads >= 8, else 0

answer = average(recorded indicators)
```

If 550 runs have at least 8 heads:

```text
550 / 10000 = 0.055
```

The simulated estimate is about 5.5%.

Now consider test power. Suppose a real effect exists but is small. You can simulate:

```text
repeat 10000 times:
  generate treatment group data
  generate control group data
  run the planned test
  record whether p-value < 0.05

power estimate = rejection count / 10000
```

If the test rejects in 3,200 runs:

```text
power = 3200 / 10000 = 0.32
```

Under the effect size, sample size, and distribution you assumed, the test detects the effect only about 32% of the time. That is closer to experimental design than merely remembering `p < 0.05`.

## Where This Shows Up in ML/AI

AI evaluation often contains randomness. LLM generation may sample. Agent tools depend on external state. Retrieval changes with index state and query rewriting. Human scoring has variation.

Monte Carlo thinking appears in:

- agent eval: rerun the same task many times and inspect success-rate stability.
- robustness testing: perturb prompt, data order, noise, or input length and inspect result distributions.
- uncertainty propagation: estimate how upstream classifier errors affect downstream decisions.
- offline policy simulation: test policies in an assumed environment.
- cost risk: estimate tail risk in token cost, latency, or tool-call count.

For example, suppose a support agent is evaluated on 100 tasks, with each task run 5 times. If the same task sometimes succeeds and sometimes fails, a single accuracy score hides stability problems. The report should include success-rate distribution, task-level variance, and high-risk task types, not just the best run.

## How Sources Are Used

- Official past-paper PDFs are used only for years, subject names, and problem statements; two years of questions are not treated as the full future scope.
- The grad-exam-prep pages are used for study-route, question-index, and practice-flow alignment, not as official solutions.
- OpenIntro, OpenStax, and other open textbooks are used to verify formulas, definitions, assumptions, and common derivations.
- Stanford CS109 and scikit-learn documentation are used to connect each topic to ML/AI training, evaluation, experiments, and uncertainty reporting.

## Problem Recognition Hints

- If the problem says simulation or Monte Carlo, state the data-generating rule first.
- Include the number of repetitions, what is computed each time, and what is summarized at the end.
- For event probabilities, use `successes / R`.
- When writing limitations, say that the simulation conclusion depends on the data-generating assumptions.

## Common Mistakes

- Saying "run it many times" without defining how each dataset is generated.
- Forgetting to set or record the random seed.
- Running too few simulations and treating small differences as stable.
- Treating the simulated world as the real world without checking assumptions.
- Reporting only one agent-eval run and ignoring rerun variation.

## Practice

1. Write the four steps of Monte Carlo simulation: data generation, repeated sampling, statistic calculation, result summary.
2. Describe how to estimate the probability of at least 8 heads in 10 fair coin flips by simulation.
3. If `R=10000` and there are 470 successes, what is the estimated probability?
4. Explain why simulation can check formula approximations but still depends on data and assumptions.
5. In agent evaluation, why should the same task be run multiple times, and what extra information should the report include?

## What Comes Next

Monte Carlo makes random variation visible. A reproducible workflow lets others rerun the same process. The next post connects data, code, seed, environment, and report into an auditable statistical workflow.

## Section-Level Source Map

- OpenIntro, OpenStax, and Stanford CS109 support using simulation to understand probability, sampling distributions, and uncertainty.
- scikit-learn Model Evaluation supports model-evaluation metrics; this post extends that idea to repeated trials and variation reporting in agent evaluation.
- This post connects Monte Carlo to power, coverage, robustness, uncertainty propagation, and cost risk.

## References

- [Simulation, Monte Carlo, sampling variability, power, coverage, and uncertainty: OpenIntro Statistics](https://www.openintro.org/book/os/)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
