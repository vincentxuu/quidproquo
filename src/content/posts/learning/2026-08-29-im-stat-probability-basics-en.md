---
title: "Conditional Probability, Independence, and Bayes: What Viewpoint Is the Problem Switching?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 4
tldr: "Probability problems are often hard because the viewpoint changes. Define events first, then distinguish conditioning, independence, mutual exclusivity, and Bayes' rule."
description: "A beginner guide to probability basics: events, conditional probability, independence, mutual exclusivity, Bayes' rule, and their link to precision, recall, and base rates."
draft: true
---

> [Mandarin version](/posts/learning/2026-08-29-im-stat-probability-basics)

The most common error in probability problems is reading the direction backward. You think the problem asks, "What is the probability that the model catches a spam email?" It actually asks, "Given that the model flagged an email as spam, what is the probability that the email truly is spam?" The first direction starts from the true state and looks at the model output. The second starts from the model output and works back to the true state.

That difference is fatal in exams because the symbols look almost identical: `P(A|B)` and `P(B|A)`. They are usually not the same number and cannot be swapped.

ML/AI has the same problem. Many people confuse recall and precision because they confuse conditional-probability directions. How many true positives the model catches, and how many predicted positives are truly positive, are two different questions. When the positive class is rare, even a small false-positive rate can fill the alert list with false alarms.

## Define Events Before Touching Formulas

The first step in a probability problem is always defining events. Do not start with Bayes. Do not start with counting. Turn the states in the problem into events.

For the spam example, define:

- S: the email is truly spam.
- N: the email is normal.
- F: the model flags the email as spam.

After defining events, ask which direction the problem wants. `P(F|S)` means: among true spam emails, how many are flagged as spam? `P(S|F)` means: among flagged emails, how many are truly spam? The first resembles recall. The second resembles precision.

Writing events is not busywork. It protects you from swapping directions.

## Conditional Probability Shrinks the World

`P(A|B)` means: after restricting the world to cases where B happened, what fraction also have A? The denominator becomes the B group.

For `P(truly spam | flagged as spam)`, the denominator is all flagged emails. Inside that group, we ask how many are truly spam. This is completely different from `P(flagged as spam | truly spam)`, where the denominator is true spam emails.

That is why conditional-probability problems always require you to inspect the denominator. If you can say in words what group sits in the denominator, you are much less likely to substitute into the wrong formula.

The formula is:

```text
P(A|B) = P(A ∩ B) / P(B)
```

The symbol reminds you that once the condition happens, the sample space has already shrunk to B.

## Do Not Confuse Independence and Mutual Exclusivity

Another common error is mixing independence with mutual exclusivity.

Mutually exclusive events cannot happen together. In one die roll, rolling a 1 and rolling a 6 are mutually exclusive.

Independent events do not change each other's probabilities. In two fair coin flips, the first flip being heads does not change the probability that the second flip is heads.

The concepts point in different directions. Mutual exclusivity asks whether two events can occur together. Independence asks whether knowing one event happened changes the probability of the other. Except for special zero-probability cases, two positive-probability mutually exclusive events are usually not independent. Once you know A happened, you know B did not happen, so the probability of B changed.

When a problem asks whether events are independent, do not guess. Check whether:

```text
P(A|B) = P(A)
```

or:

```text
P(A ∩ B) = P(A)P(B)
```

## Bayes' Rule Reverses from Result to Cause

Bayes' rule is useful when the problem gives probabilities from causes to results, but asks you to reason from an observed result back to a possible cause.

The spam problem has this structure. It may give:

- Spam prevalence: `P(S)`
- Probability that true spam is flagged: `P(F|S)`
- Probability that normal email is falsely flagged: `P(F|N)`

But the question asks for `P(S|F)`. You observe result F and want to infer cause S.

Bayes' rule says:

```text
P(S|F) = P(F|S)P(S) / P(F)
```

The denominator `P(F)` must include every path that produces the observed result: true spam that gets flagged, plus normal email that gets falsely flagged.

## A Complete Worked Example

Suppose 1% of emails are truly spam. A model flags 90% of true spam as spam. It falsely flags 5% of normal emails as spam. Given that an email was flagged as spam, what is the probability that it is truly spam?

Define events. S means true spam, N means normal, and F means flagged as spam.

The question asks for:

```text
P(S|F)
```

not:

```text
P(F|S)
```

The numerator is "true spam and flagged":

```text
P(F|S)P(S) = 0.90 * 0.01 = 0.009
```

The denominator is all flagged emails. There are two paths:

```text
P(F) = P(F|S)P(S) + P(F|N)P(N)
```

Substitute:

```text
P(F) = 0.90 * 0.01 + 0.05 * 0.99 = 0.0585
```

Therefore:

```text
P(S|F) = 0.009 / 0.0585 ≈ 0.154
```

The answer is about 15.4%. Many people answer 90% because the model catches 90% of spam. But 90% is `P(F|S)`, not `P(S|F)`. Spam is rare, and normal email is common. Even a 5% false-positive rate can create many false alarms.

The key skill is the direction of conditioning. Decimal precision matters less than getting that direction right.

## Where This Shows Up in ML/AI

Classifier evaluation is everyday conditional probability.

Recall asks: among true positives, how many did the model catch? That is the direction `P(predicted positive | truly positive)`. Precision asks: among predicted positives, how many are truly positive? That is the direction `P(truly positive | predicted positive)`.

When the positive class is rare, the base rate strongly affects precision. Fraud detection, medical screening, and content moderation all face this issue. A model can have high recall while individual alerts are still unreliable. A false-positive rate can look small and still produce many false alarms because the negative class is huge.

So when reading a classification report, do not look only at accuracy. Ask: what is the positive-class prevalence? What are precision and recall? Is the cost of false positives or false negatives higher? These questions are all conditional probability.

## How Sources Are Used

- Official past-paper PDFs are used only for years, subject names, and problem statements; two years of questions are not treated as the full future scope.
- The grad-exam-prep pages are used for study-route, question-index, and practice-flow alignment, not as official solutions.
- OpenIntro, OpenStax, and other open textbooks are used to verify formulas, definitions, assumptions, and common derivations.
- Stanford CS109 and scikit-learn documentation are used to connect each topic to ML/AI training, evaluation, experiments, and uncertainty reporting.

## Problem Recognition Hints

- When the problem says "given," write conditional probability first.
- When it asks for "at least one," consider the complement.
- When it infers a cause from an observed effect, think Bayes.

## Common Mistakes

- Applying formulas by keyword without checking data type and assumptions.
- Treating sample statistics as population parameters.
- Treating two years of past papers as the complete future scope.
- Treating the ML/AI connection as a claim that the exam will directly test AI terms.

## Practice

1. Derive conditional probability once from P(A|B)=P(A and B)/P(B), not only by memorizing it.
2. For the disease-test example, explain the numerator, denominator, and posterior in words.
3. Change prevalence from 1% to 10% and recompute the probability of disease after a positive test.
4. Write a Naive Bayes example and mark where conditional independence is assumed.

## Next

Probability problems handle events. The next post turns events into random variables and introduces PMF, PDF, and CDF. That step moves from "whether something happens" to "where a numerical value falls."

## Section-Level Source Map

- OpenIntro / OpenStax: conditional probability, independence, and Bayes formula.
- Stanford CS109: Bayesian intuition and probabilistic modeling.
- scikit-learn: classifier probabilities and Naive Bayes applications.

## References

- [OpenIntro Statistics: probability, conditional probability, independence, Bayes' rule](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: probability topics](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: probability and Bayes](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation: precision, recall, and classifier metrics](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
