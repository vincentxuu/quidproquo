---
title: "Logistic Regression and Text Classification: From Features to Probability and Loss | Stanford CS124 Week 3"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, nlp, logistic-regression, text-classification]
lang: en
series: { name: "Reading Stanford CS124", order: 4 }
tldr: "Week 3 teaches logistic regression: turn a document into a feature vector, pass the weighted sum through a sigmoid to get a probability, measure the error with cross-entropy, and fix the weights with gradient descent. This post works the slides' movie-review example through a prediction, a loss and one weight update, and explains why evaluation looks at precision and recall."
description: "A guide to Stanford CS124 Winter 2026 Week 3: features for text classification, the sigmoid, the decision boundary, cross-entropy loss, one hand-worked step of stochastic gradient descent, mini-batches, precision/recall/F1, harms classifiers can cause, and Lab 2 and PA2. Based on the public slides and the labs repo."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs124-week3-logistic-regression)

This is Week 3 of [Reading Stanford CS124](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en). Last week cut text into tokens and counted them. This week makes a judgment about a whole piece of text: is this review positive or negative? Is this email spam?

The model is logistic regression. The slides give three reasons to learn it: it is the standard tool in the social and health sciences for analyzing a binary outcome, it is the baseline model for supervised classification, and it is the basic unit of a neural network. The neural networks in Week 6 are many logistic regressions stacked together.

**This week's material**: the [Logistic Regression slides](https://web.stanford.edu/class/cs124/lec/logreg26jan.pdf), the [Lab 2 introduction slides](https://web.stanford.edu/class/cs124/lec/lab2logreg_lecture.pdf), the [Lab 2 problems](https://github.com/cs124/labs/blob/main/Lab2_LogisticRegression.md) and [solutions](https://github.com/cs124/labs/blob/main/Lab2_LogisticRegression_Solutions.md), and [PA2](https://github.com/cs124/pa2-logistic-regression). The assigned reading is [Chapter 4](https://web.stanford.edu/~jurafsky/slp3/old_aug25/4.pdf) of the August 2025 release of the textbook. The pre-recorded videos are on Canvas, so this post follows the slides and the textbook.

## The four parts of a classifier

The slides break a machine learning classifier into four parts, and the week follows that order:

1. **A feature representation**: turn the input into a list of numbers x.
2. **A classification function**: compute the predicted probability ŷ from x. Here it is the sigmoid.
3. **An objective function**: measure how far the prediction is from the correct answer. Here it is cross-entropy loss.
4. **An optimization algorithm**: adjust the parameters to make the loss smaller. Here it is stochastic gradient descent.

## From text to a probability

### Features

The slides' example is a movie review to be classified as positive (y = 1) or negative (y = 0). Six features are defined by hand:

| Feature | Definition | Value for this review |
|---|---|---|
| x₁ | Count of positive lexicon words | 3 |
| x₂ | Count of negative lexicon words | 2 |
| x₃ | Whether "no" appears | 1 |
| x₄ | Count of first- and second-person pronouns | 3 |
| x₅ | Whether "!" appears | 0 |
| x₆ | Natural log of the word count | ln(66) = 4.19 |

Features decide what the model can see. These six ignore word order entirely. If no feature captures the "not" in "not good," the model has no way of knowing about it.

### The weighted sum and the sigmoid

Each feature has a weight w, and there is one bias term b. First compute the weighted sum:

z = w·x + b

Suppose the model has already learned these weights: w = [2.5, −5.0, −1.2, 0.5, 2.0, 0.7] and b = 0.1. The sign of a weight says which way that feature pushes the result. Positive words have weight 2.5 and push toward positive. Negative words have −5.0 and push toward negative, harder.

Plug in the review:

z = 2.5×3 + (−5.0)×2 + (−1.2)×1 + 0.5×3 + 2.0×0 + 0.7×4.19 + 0.1 = 0.833

z can be any real number, so it is not yet a probability. The **sigmoid** function squashes it into the range between 0 and 1:

σ(z) = 1 / (1 + e⁻ᶻ)

σ(0.833) ≈ 0.70. The model thinks the review is positive with probability 0.70 and negative with probability 0.30.

The sigmoid is an S-shaped curve: it outputs 0.5 at z = 0, approaches 1 as z grows and 0 as z shrinks, and flattens at both ends. Lab 2 gives a few reference values: σ(2) ≈ 0.88 and σ(4) ≈ 0.98. Going from z = 2 to z = 4 doubles the score, but the probability only rises from 0.88 to 0.98. When the score is already high, adding more barely changes the probability.

### Making the decision

With a probability in hand, set a threshold. The default is 0.5: above 0.5 the review is called positive. Since 0.70 > 0.5, this review is classified as positive.

## Measuring the error: cross-entropy loss

Training needs a number that says how bad a prediction is. Logistic regression uses cross-entropy loss:

L = −[ y·ln(ŷ) + (1 − y)·ln(1 − ŷ) ]

The formula looks complicated, but y is either 1 or 0, so only one of the two terms ever survives:

- The correct answer is positive (y = 1): L = −ln(ŷ), the negative log of the probability the model gave to the correct answer.
- The correct answer is negative (y = 0): L = −ln(1 − ŷ).

For the review above, with ŷ = 0.70:

| Correct answer | Loss | |
|---|---|---|
| Positive (y = 1) | −ln(0.70) = 0.36 | The model leans the right way, so the loss is small |
| Negative (y = 0) | −ln(0.30) = 1.20 | The model leans the wrong way, so the loss is large |

The negative log has one important property: the more confident the model is while being wrong, the heavier the penalty. If the model gives the correct answer a probability of only 0.01, the loss is −ln(0.01) = 4.6, and as that probability approaches 0 the loss goes to infinity.

## Fixing the weights: stochastic gradient descent

The goal is the w and b that make the loss over the whole training set as small as possible. The method is to compute the gradient of the loss with respect to each weight (the direction in which the loss rises fastest) and take a small step the other way:

w ← w − η × gradient

η is the learning rate, which sets the size of the step. Too large and you overshoot the minimum. Too small and learning is slow.

For logistic regression the gradient has a simple form:

∂L/∂wⱼ = (ŷ − y) × xⱼ

That is the prediction minus the correct answer, times the value of that feature. The further off the prediction, the larger (ŷ − y) and the bigger the correction. If a feature's value is 0, its weight does not move on this step. The gradient for the bias b is (ŷ − y).

### One step by hand

The slides walk through one step with a tiny example that has only two features. A positive review (y = 1) has x₁ = 3 (positive words) and x₂ = 2 (negative words). The weights and bias start at 0, and the learning rate is η = 0.1.

**Step one, predict.** z = 0×3 + 0×2 + 0 = 0, so ŷ = σ(0) = 0.5. The model has learned nothing yet, so it guesses fifty-fifty.

**Step two, compute the gradient.** ŷ − y = 0.5 − 1 = −0.5.

| Parameter | Gradient |
|---|---|
| w₁ | −0.5 × 3 = −1.5 |
| w₂ | −0.5 × 2 = −1.0 |
| b | −0.5 |

**Step three, update.** New value = old value − 0.1 × gradient.

| Parameter | Before | After |
|---|---|---|
| w₁ | 0 | 0 − 0.1×(−1.5) = 0.15 |
| w₂ | 0 | 0 − 0.1×(−1.0) = 0.10 |
| b | 0 | 0 − 0.1×(−0.5) = 0.05 |

You can check that things improved by predicting again with the new weights: z = 0.15×3 + 0.10×2 + 0.05 = 0.70, and ŷ = σ(0.70) ≈ 0.67. The loss fell from −ln(0.5) = 0.69 to −ln(0.67) ≈ 0.40.

One thing in this example goes against intuition: the weight on negative words, w₂, also became positive. The model has seen only this one review, and this positive review happens to contain two negative words, so it learned that negative words are a sign of a positive review. An update from a single example is swayed by that example's accidents. Only after many positive and negative reviews will w₂ be pulled negative.

### How many examples at a time

"Stochastic" gradient descent means picking one random example at a time to compute the gradient. The other extreme is to look at all the data before each update, which gives a more accurate direction but is slow. Practice sits in between with a **mini-batch**: look at a small batch each time (the slides mention 512 or 1024 examples) and update with the average gradient over the batch. A batch can be laid out as a matrix with one example per row and computed in one matrix multiplication, which is also how every neural network from Week 6 on is trained.

## Evaluation: why not accuracy

The slides use an example to show the problem with accuracy. A pie company wants to find the posts that talk about it among a million posts, and only 100 actually do. A classifier that says "no" to everything is 99.99% accurate and finds none of them.

With unbalanced classes you look at two other numbers. First sort the results into four cells:

| | Actually positive | Actually negative |
|---|---|---|
| **Model says positive** | true positive (tp) | false positive (fp) |
| **Model says negative** | false negative (fn) | true negative (tn) |

- **Precision** = tp ÷ (tp + fp): of the items the model called positive, how many really are.
- **Recall** = tp ÷ (tp + fn): of the items that really are positive, how many the model found.

The classifier that says "no" to everything has a recall of 0.

The two usually trade off. Lower the threshold and the model catches more positives (recall goes up) while also making more mistakes (precision goes down). To summarize both in one number, use **F1**, their harmonic mean:

F1 = 2 × P × R ÷ (P + R)

Here are some numbers made up for this post. The model calls 10 items positive, of which 8 are right and 2 are wrong, and it misses another 8 positives. Precision = 8/10 = 0.8, recall = 8/16 = 0.5, and F1 = 2×0.8×0.5 ÷ 1.3 ≈ 0.62. The harmonic mean leans toward the lower number, so F1 is below the arithmetic mean of 0.65.

With more than two classes (say urgent, normal and spam), compute precision and recall for each class and then combine them. There are two ways. The macroaverage averages the per-class scores directly, so every class has the same weight. The microaverage pools tp, fp and fn across all classes before computing, so classes with more data weigh more.

## Harms a classifier can cause

The last section of the slides is not mathematics. It lists three problems that have been observed in text classifiers:

- **Reproducing stereotypes.** A 2018 study tested 200 sentiment analysis systems on sentences that differed only in a name (for example "I talked to Shaniqua yesterday" versus "I talked to Stephanie yesterday"). Sentences with common African American names were assigned more negative sentiment.
- **Over-censorship.** Toxicity classifiers flag sentences that merely mention a minority identity (words like "blind" or "gay") as toxic. As a result, posts in which these groups talk about themselves are more likely to be removed.
- **Performance disparities.** Classifiers do worse on languages with little data, and on varieties of English as well.

Part of this can be understood through the mechanism above. A model learns statistical associations between features and labels in its training data. If a name or a word happens to co-occur with the negative label in that data, it gets a negative weight whether or not there is any causal link. One advantage of logistic regression is that the weights can be laid out and inspected, which makes this kind of problem easier to find.

## Lab 2 and PA2

**[Lab 2](https://github.com/cs124/labs/blob/main/Lab2_LogisticRegression.md)** is a pencil-and-paper exercise done in groups, with both the problems and the [solutions](https://github.com/cs124/labs/blob/main/Lab2_LogisticRegression_Solutions.md) public. The first part builds intuition for the sigmoid. For example, given the scores z = 0.2, 2 and 6, you rank the probabilities from the shape of the curve alone, without a calculator, and say which two are closer together. One question previews "temperature," which comes back later: divide z by a number between 0 and 1 before the sigmoid and the probabilities become more extreme. You meet it again in Week 6 when sampling from a language model, and PA6a in Week 7 has you actually adjust it.

**[PA2](https://github.com/cs124/pa2-logistic-regression)** is called Triage, the disaster-message classification task previewed in Week 1. In a notebook you write the sigmoid, the loss, gradient descent and the classifier yourself, in that order, then evaluate it, and finish with a set of ethics questions. Each step corresponds to a section above.

## Self-check

1. With the weights from the movie-review example, if the review gains an exclamation mark (x₅ goes from 0 to 1), what does z become? Does the model lean more positive or more negative? Answer: the weight on x₅ is 2.0, so z goes from 0.833 to 2.833 and σ(2.833) ≈ 0.94, more positive.
2. One model outputs ŷ = 0.9 for a positive review and another outputs ŷ = 0.1. What are the two losses? Answer: −ln(0.9) ≈ 0.11 and −ln(0.1) ≈ 2.30. The second is more than twenty times the first.
3. In the hand-worked example, if the correct answer for that review were negative (y = 0), what would w₁ be after the first update? Answer: ŷ − y = 0.5 − 0 = 0.5, the gradient is 0.5×3 = 1.5, and w₁ = 0 − 0.1×1.5 = −0.15. The direction flips.
4. A spam classifier's threshold is raised from 0.5 to 0.9. What happens to precision and recall? Answer: the model must be more confident before calling something spam, so fewer messages are flagged and those are more often right, and precision goes up. More spam is missed, so recall goes down.

## How this week connects to later ones

- The neuron in Week 6 is this week's z = w·x + b followed by a nonlinear function. The only difference is the extra layers in between.
- With more than two classes, the sigmoid is replaced by the softmax and the loss is still the negative log of the probability given to the correct answer. Every time a language model predicts a token it performs a classification with as many classes as the vocabulary.
- Precision and recall are used next week to evaluate search results.

**Series navigation**: previous, [Week 2: Words, Tokens, Edit Distance, and N-grams](/posts/ai/2026-08-22-cs124-week2-tokens-ngram-en) | next, [Week 4: Information Retrieval](/posts/ai/2026-08-22-cs124-week4-information-retrieval-en)

## Update Log

- 2026-10-13: Rewritten from the public slides. Added the prediction and loss calculation for the movie-review example, one hand-worked step of gradient descent, a precision/recall/F1 example and a self-check; added the slides' section on classifier harms; removed extensions the slides do not cover.

## References

- [CS124 Winter 2026 course site and schedule](https://web.stanford.edu/class/cs124/)
- [Logistic Regression slides](https://web.stanford.edu/class/cs124/lec/logreg26jan.pdf) — the four parts of a classifier, the movie-review example, the gradient-descent walkthrough, the pie-company example, harms of classification
- [Lab 2 introduction slides](https://web.stanford.edu/class/cs124/lec/lab2logreg_lecture.pdf) — the three reasons to learn logistic regression
- [CS124 Lab 2](https://github.com/cs124/labs/blob/main/Lab2_LogisticRegression.md) and [solutions](https://github.com/cs124/labs/blob/main/Lab2_LogisticRegression_Solutions.md)
- [CS124 PA2](https://github.com/cs124/pa2-logistic-regression)
- [Speech and Language Processing, August 2025 release, Chapter 4](https://web.stanford.edu/~jurafsky/slp3/old_aug25/4.pdf)
