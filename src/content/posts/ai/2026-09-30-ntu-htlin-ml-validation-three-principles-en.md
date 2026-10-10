---
title: "Hsuan-Tien Lin's ML Foundations L15–L16: Validation and the Three Learning Principles"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, validation, model-selection, cross-validation]
lang: en
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 8
tldr: "Lecture 15 of ML Foundations tackles model selection. Selecting by E_in overfits, and selecting by E_test is cheating. The compromise is to carve a validation set out of the training data, select by E_val, then retrain on all the data. The validation size K is a dilemma, with K = N/5 as the rule of thumb. Leave-one-out is almost unbiased but expensive and unstable, so in practice you use 5-fold or 10-fold. Lecture 16 closes with three principles, Occam's razor, sampling bias, and data snooping, and a 'Power of Three' recap: three related fields, three bounds, three linear models, three tools. Practice problems are in Fall 2024 HW5."
description: "A guide to Lectures 15–16 of Hsuan-Tien Lin's Machine Learning Foundations (NTU): the model selection problem, comparing E_in, E_test, and E_val, the validation-size dilemma and K = N/5, the near-unbiasedness and drawbacks of leave-one-out, V-fold cross validation; Occam's razor, sampling bias through the 1948 US election and the Netflix Prize, data snooping through currency data and chains of papers, and the Power of Three recap, mapped to LFD 4.3, chapter 5, and Fall 2024 HW5."
draft: false
glossary:
  - term: "data snooping"
    definition: "If a data set has affected any step of the learning process, including picking features by eye, computing normalization, or reading others' results on the same data, its ability to assess the final outcome is compromised."
    context: "The third learning principle in Lecture 16 of Hsuan-Tien Lin's ML Foundations."
  - term: "sampling bias"
    definition: "When the training distribution differs from the test scenario, the VC guarantee no longer holds, and the learned result carries the same bias."
    context: "The second learning principle in Lecture 16; the rule of thumb is to make training and validation match the test scenario as closely as possible."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles)

> **Version note**: This post is based on the Lecture 15 and Lecture 16 slides of the [Machine Learning Foundations MOOC](https://www.csie.ntu.edu.tw/~htlin/mooc/) ([15_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/15_handout.pdf), [16_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/16_handout.pdf)) and videos 58–65 of the [YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf) (lectures in Mandarin, slides in English). Practice problems come from [HW5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/) of [Machine Learning, Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/). Everything was checked against the official materials on 2026-09-30. Access level: the MOOC alone is **A2**; with the Fall 2024 homework it is **A3 (minus the grading chain)**. There are no official solutions.

**Series**: previous: [Overfitting and Regularization](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization-en) | next: [Linear SVM and Dual SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm-en) | [Series overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en)

The [previous post](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization-en) left a question open. More noise calls for stronger regularization, but you don't know the noise level in advance, so how do you pick λ? Lecture 15 answers with validation. Lecture 16, the last lecture of ML Foundations, introduces no new algorithm. It uses three principles to warn you when the guarantees from the first fifteen lectures quietly stop holding.

After reading, you should be able to explain why selecting models by E_in fails, how big a validation set should be, why you retrain on all the data after selecting, and what sampling bias and data snooping each guard against.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=BRLGPnrcel8
title: Model Selection Problem
```

```youtube
url: https://www.youtube.com/watch?v=RvkCaAwRP8A
title: Validation
```

Original videos: [Model Selection Problem](https://www.youtube.com/watch?v=BRLGPnrcel8)、[Validation](https://www.youtube.com/watch?v=RvkCaAwRP8A)、[Leave-One-Out Cross Validation](https://www.youtube.com/watch?v=iToz5t0J6WU)、[V-Fold Cross Validation](https://www.youtube.com/watch?v=Y8PaLsYm0Ac)、[Occam's Razor](https://www.youtube.com/watch?v=Oj6j98ceUz8)、[Sampling Bias](https://www.youtube.com/watch?v=8QZZiIAdTUU)、[Data Snooping](https://www.youtube.com/watch?v=7nP5zWMQmxM)、[Power of Three](https://www.youtube.com/watch?v=29jgHPeRAqI)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## Course materials

| Lecture | YouTube sections (playlist number) | Slides | LFD sections |
|---|---|---|---|
| L15 Validation | [Model Selection Problem](https://www.youtube.com/watch?v=BRLGPnrcel8) (58), [Validation](https://www.youtube.com/watch?v=RvkCaAwRP8A) (59), [Leave-One-Out Cross Validation](https://www.youtube.com/watch?v=iToz5t0J6WU) (60), [V-Fold Cross Validation](https://www.youtube.com/watch?v=Y8PaLsYm0Ac) (61) | [15_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/15_handout.pdf) | 4.3 |
| L16 Three Learning Principles | [Occam's Razor](https://www.youtube.com/watch?v=Oj6j98ceUz8) (62), [Sampling Bias](https://www.youtube.com/watch?v=8QZZiIAdTUU) (63), [Data Snooping](https://www.youtube.com/watch?v=7nP5zWMQmxM) (64), [Power of Three](https://www.youtube.com/watch?v=29jgHPeRAqI) (65) | [16_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/16_handout.pdf) | Chapter 5 |

LFD sections follow the Fall 2024 and Fall 2026 course pages. Fall 2024 covered these lectures in W8 (10/21), linking to [15u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/15u_handout.pdf) and [16u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/16u_handout.pdf). [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) schedules them for W8 (10/28); as of today those slide links still return 404. Video 65 is the last one in the whole Foundations playlist.

## L15: selecting models without peeking

### Model selection is the most important practical problem

Slide 2 lists a combination table. Even for plain binary classification you choose along six axes: the algorithm (PLA, pocket, linear regression, logistic regression), number of iterations, learning rate, feature transform, regularizer, and λ. Slide 3 states the problem formally. Given M models H_m with algorithms A_m, pick the one whose g_m* has the lowest E_out. E_out is still unknown, and the slides call this "arguably the most important practical problem of ML".

Pick by eye? The slides say no and point back to picking Φ by eye in [L12](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform-en).

### E_in, E_test, and E_val

Three ways to select are compared next:

| Select by | Problem |
|---|---|
| E_in | Φ₁₁₂₆ always beats Φ₁, and λ = 0 always beats λ = 0.1. "Model selection + learning" also pays for d_vc(H₁ ∪ H₂), so generalization gets worse |
| E_test | There's a clean finite-bin Hoeffding guarantee, E_out ≤ E_test + O(√(log M / N_test)). But the test data sits "in your boss's safe": you can't get it, and selecting with it would be cheating |
| E_val | Carve D_val out of the D you have. As long as A_m never used it, it's clean. The slides call this "legal cheating" |

### The full validation procedure

1. Randomly take K examples from D as D_val; the remaining N − K form D_train. Random selection keeps D_val i.i.d. from P(x, y).
2. Train each model on D_train only, getting g_m⁻ = A_m(D_train).
3. Select m* by E_val(g_m⁻). The guarantee is E_out(g_m⁻) ≤ E_val(g_m⁻) + O(√(log M / K)).
4. **Retrain on all of D** and return g_m* = A_m*(D).

Step 4 is justified by the learning curve: going from N − K examples to N usually lowers E_out. The experiment on slide 10 confirms it. When choosing between H_Φ5 and H_Φ10, "retrain on all data after selecting" beats returning g_m*⁻ directly. The plot also shows something else: for some K, returning g⁻ directly is even worse than selecting by E_in.

### The K dilemma

Validation rests on a chain of approximations: E_out(g) ≈ E_out(g⁻) ≈ E_val(g⁻).

- The first ≈ needs a small K, so that g⁻ stays close to g.
- The second ≈ needs a large K, so that E_val stays close to E_out.

The slides' rule of thumb is **K = N/5**. The Fun Time quiz on slide 12 works out the cost. If a model takes N² seconds to train on N examples, then with K = N/5 and 25 models, the total is (16/25)N²×25 + N² = 17N² seconds.

### Leave-one-out and V-fold

Push K to the extreme K = 1: leave out each example in turn as the validation set, then average.

E_loocv(H, A) = (1/N) Σ err(g_n⁻(x_n), y_n)

Slide 15 proves that its expected value equals the average E_out of training on N − 1 examples, which is why it's often called an "almost unbiased estimate" of E_out. In the handwritten-digit experiment on slide 16, selecting the number of features by E_loocv works much better than selecting by E_in.

The slides then list two drawbacks. Each model needs N extra training runs, which is usually unaffordable unless there's an analytic solution as with linear regression. And each single-point estimate has high variance, so the curve is unstable. The conclusion: LOOCV isn't often used in practice.

The compromise is V-fold. Randomly split D into V equal parts, validate on each part in turn while training on the rest, and average the V values of E_val. The rule of thumb is V = 10.

The "final words" on slide 20 are worth remembering in full:

- When computation allows, V-fold is generally preferred over a single validation set.
- 5-fold or 10-fold generally works well; there's no need to pay for LOOCV.
- Training selects among hypotheses, validation selects among finalists, and testing just evaluates.
- Validation is still more optimistic than testing. **Report the test result, not the best validation result.**

## L16: three learning principles

### Occam's razor: simple is good

The slides state the principle as: the simplest model that fits the data is also the most plausible. Then they answer two questions.

**What does simple mean?** A single hypothesis h is simple if it looks simple and has few parameters. A model H is simple if it contains few hypotheses. The two are linked: if H has only 2^ℓ hypotheses, each h can be described in ℓ bits.

**Why is simple better?** Beyond the math you've already seen, the slides give a philosophical argument. A simple H has a small growth function m_H(N), so it's unlikely to fit an arbitrary labeling perfectly. When it does fit, the fit means more. The Fun Time quiz on slide 6 puts a number on it: decision stumps on 10 points have m_H(N) = 2N = 20, so the chance that random labels are separable is 20/1024.

The direct action: try linear first, and always ask whether the data has been over-modeled.

### Sampling bias: the class must match the exam

The slides open with the 1948 US presidential election. A newspaper, going by a phone poll, ran the headline "Dewey Defeats Truman". Truman won. The cause wasn't an editorial bug or bad luck in polling. The hint: phones were expensive back then.

The principle: **if the data is sampled in a biased way, learning will produce a similarly biased outcome.** Technically, if the data comes from P₁ but testing happens under P₂ ≠ P₁, the VC guarantee fails. VC theory carries a "minor" assumption that training and testing data are both i.i.d. from the same P.

Then comes Lin's own story. The Netflix Prize paid one million US dollars for a 10% improvement in the recommender system. On his first shot, E_val showed a 13% improvement. The slide jokes: "why am I still teaching here?" The reason: his validation set was drawn at random from within D, but the test data was each user's last records *after* D.

The rule of thumb: **match the test scenario as much as possible**. If the test is "later" records, emphasize later examples in training (the slides cite KDDCup 2011), and validate on late records too. The slides end with a puzzle: what's dangerous about learning credit card approval from a bank's existing records?

### Data snooping: honesty is the best policy

The principle: **if a data set has affected any step in the learning process, its ability to assess the outcome has been compromised.**

The slides give three kinds of snooping:

1. **Visual snooping**: the L12 example of picking Φ after looking at a plot.
2. **Mere shifting and scaling**: 8 years of currency trading data, the first 6 for training and the last 2 for testing, predicting day 21 from the previous 20 days. If normalization is computed over training plus test data, the cumulative profit curve looks clearly better than when it's computed on training data only. That edge comes from peeking at the test period.
3. **Data reuse**: on one benchmark, paper 2 reads paper 1 and publishes only if it wins; paper 3 reads both and does the same, and so on. Treat all the papers as one big paper by one author and you pay for d_vc(∪H_m). On top of that, every step has "snooped" on earlier results, and "publish only if better" makes it worse. The slides quote: "if you torture the data long enough, it will confess".

What can you do? The slides admit that snooping is very hard to avoid unless you're extremely honest. From strictest to loosest: lock your test data in a safe; reserve validation data and use it cautiously; avoid making modeling decisions from the data; and read research results, your own included, with a proper sense of contamination. Lin adds that one secret to winning KDDCups is a careful balance between data-driven modeling (snooping) and validation (no snooping).

### Power of Three: the whole course in a few tables

The last section reorganizes the whole course around the number three:

| Three… | Content |
|---|---|
| Related fields | Data Mining, Artificial Intelligence, Statistics |
| Theoretical bounds | Hoeffding (one hypothesis, for testing), multi-bin Hoeffding (M hypotheses, for validation), VC (all of H, for training) |
| Linear models | PLA/pocket (0/1, minimized specially), linear regression (squared, analytically), logistic regression (CE, iteratively) |
| Key tools | Feature transform (lower E_in, higher d_vc), regularization (lower d_EFF, higher E_in), validation (fewer choices, fewer training examples) |
| Learning principles | Occam's razor (simple is good), sampling bias (class matches exam), data snooping (honesty is best policy) |

Slide 23, "Three Future Directions", lists More Transform, More Regularization, and Less Label, scattered with terms like SVM, kernel, AdaBoost, random forest, GBDT, neural network, autoencoder, and matrix factorization. It's nearly the table of contents of the 16 ML Techniques lectures. The sign-off: "ready for the jungle!" The last Fun Time asks about the magic numbers that kept showing up in the course: 3 and 1126.

## Related problems in Fall 2024 HW5

[HW5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf) was released on 2024-11-04 and due 11/18. It has 12 problems plus a bonus. Q1–4 are auto-graded; Q5–12 are graded by TAs. Problems related to this post:

| Problem | Content | Maps to |
|---|---|---|
| Q2 | For a decision stump on linearly separable data that places its threshold at the midpoint between the closest positive and negative points, find the tightest upper bound on the leave-one-out error | L15 LOOCV |
| Q3 | Explicitly "In Lecture 16": the expected minimum E_in of decision stumps on 5 points with random labels; the note says 1 minus twice this value is the empirical Rademacher complexity | L16 Occam's razor |
| Q7 | Estimate the mean from the first N − K labels, validate on the last K, and find the expected validation error | L15 validation |
| Q8 | Prove that constant regression has E_loocv = (N/(N−1))² E_in, showing E_in is more optimistic than E_loocv | L15 LOOCV |
| Q9 | When a classifier is deployed on a test distribution with a different class ratio, when does it do as badly as a constant classifier? | L16 test scenario differs from training |
| Q11 | mnist.scale 2 vs 6: split off 8000 examples as sub-training, select λ by E_val, retrain on all training data, repeat 1126 times, and compare the E_out distribution with Q10 (selection by E_in) | L15 validation + retraining |
| Q12 | Same, but select λ by 3-fold CV and compare with Q11 | L15 V-fold |

HW5 Q4 is already the hard-margin SVM from ML Techniques T1, left for the [next post](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm-en). Q10's L1 regularization is in the [previous post](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization-en). The coding problems use the public [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) and [mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2). All three share the same λ candidates (log₁₀λ ∈ {−2, …, 3}) and the "break ties by picking the largest λ" rule, so write Q10–12 as one program that only swaps the selection criterion.

Without official solutions, here's a self-check. Test the Q8 identity by hand on three numbers first. The Fun Time quiz on slide 17 of L15 (y = 1, 5, 7, answer 14) is a ready-made test case.

## How to study this part

1. While watching video 59, write down the four steps of validation and circle "retrain on all of D".
2. After videos 60–61, run 5-fold and LOOCV on the same small dataset in a framework you know (scikit-learn, say), and compare runtime and how much the estimates move.
3. While watching videos 63–64, check a recent project of yours line by line. Does the validation set match real usage? Were normalization parameters computed on training data only?
4. Do HW5 Q10–12 and see how far apart the E_out distributions of the three selection methods are.

One thing to try tonight: open the code from your last model evaluation and make sure the scaler or normalizer's `fit` is called on training data only. If it isn't, you've just found a case of data snooping.

## Further reading

- Another take on the same topic: [CS229 notes chapter 9: regularization and model selection](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-09-regularization-model-selection-en)
- ML Foundations ends here. ML Techniques starts from the problem that feature transforms are expensive; first stop: [Linear SVM and Dual SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm-en)
- Homework overview: [Foundations homework guide](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en)
- Intro ML at other schools: [Stanford CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en), [Berkeley CS189](/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [Machine Learning Foundations / Techniques MOOC page](https://www.csie.ntu.edu.tw/~htlin/mooc/) — section titles and slide downloads for every lecture
- [Lecture 15: Validation (handout)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/15_handout.pdf) — model selection, E_in / E_test / E_val, K = N/5, the LOOCV unbiasedness proof, V-fold, final words
- [Lecture 16: Three Learning Principles (handout)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/16_handout.pdf) — Occam's razor, the 1948 election and Netflix examples, snooping via currency data and paper chains, Power of Three
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf) — videos 58–65 (in Mandarin)
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) — W8 schedule and LFD sections
- [Fall 2024 Homework 5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf) — Q2–3, Q7–9, Q11–12
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) — W8 (10/28) schedule
- [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) and [LIBSVM datasets: mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2) — tool and data for the HW5 coding problems
- [Learning from Data (AMLbook)](http://amlbook.com) — textbook section 4.3 and chapter 5
