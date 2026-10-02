---
title: "Hsuan-Tien Lin's ML Techniques T7–T8: Blending, Bagging, and AdaBoost"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, ensemble]
lang: en
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 12
tldr: "Lectures 7 and 8 of Machine Learning Techniques open the aggregation part of the course. T7 sorts ways of combining hypotheses into uniform, linear, and any blending (stacking), shows with a few lines of algebra that uniform blending reduces variance, and then uses the bootstrap to create diverse g_t from the single dataset you have: that is bagging. T8 reinterprets the bootstrap as example weighting, then deliberately up-weights the examples the previous hypothesis got wrong so the next one is forced to differ, and votes with α_t = ln √((1−ε_t)/ε_t): that is AdaBoost. Practice with Fall 2024 HW6 Q4 and Q9, plus HW7's bootstrap and AdaBoost proofs and a 500-round AdaBoost-Stump experiment on madelon. There are no official solutions."
description: "A guide to Lecture 7 (Blending and Bagging) and Lecture 8 (Adaptive Boosting) of NTU Hsuan-Tien Lin's Machine Learning Techniques: why aggregation helps, the bias–variance decomposition of uniform blending, linear and any blending with the KDD Cup 2011 case, bootstrap aggregation, diversity by re-weighting, the AdaBoost algorithm and its VC guarantee, and AdaBoost-Stump, with the matching Fall 2024 HW6/HW7 problems and the Breiman and Freund & Schapire readings listed on the course page."
draft: false
glossary:
  - term: "blending"
    aliases: ["stacking"]
    definition: "Deciding how to combine g_1…g_T after they have already been trained: one vote each (uniform), a learned set of linear weights (linear), or any model trained on the g_t outputs as features (any blending, also called stacking)."
    context: "Lin's T7 separates blending from aggregation learning, where the g_t are learned and combined at the same time."
  - term: "bagging"
    aliases: ["bootstrap aggregation"]
    definition: "Draw several bootstrap samples from the data with replacement, train one g_t on each, and let them vote uniformly. It is a meta algorithm that wraps any base algorithm."
    context: "T7's rule of thumb: bagging works well when the base algorithm is sensitive to data randomness."
  - term: "AdaBoost"
    aliases: ["Adaptive Boosting"]
    definition: "Each round scales up the weights of examples the previous g_t got wrong and scales down the ones it got right, forcing g_{t+1} to differ; the final G is a linear vote with α_t = ln √((1−ε_t)/ε_t)."
    context: "T8 introduces it with a story about a teacher helping children recognize apples; T11 re-derives it from an optimization view."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost)

> **Sources**: The core material is the [MOOC version](https://www.csie.ntu.edu.tw/~htlin/mooc/) of Machine Learning Techniques: [207_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/207_handout.pdf) (Blending and Bagging), [208_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/208_handout.pdf) (Adaptive Boosting), and videos 26–33 of the [Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2). Homework references come from HW6 and HW7 on the [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/). All facts were checked against the originals on 2026-09-30. The lectures are taught in Mandarin; the slides are in English. Access level: the MOOC alone is **A2**; adding the Fall 2024 homework PDFs brings it to **A3 (minus the grading chain)**. There are no official solutions, and Gradescope and NTU COOL are for enrolled students only.

**Series**: Previous: [Kernel Logistic Regression and Support Vector Regression](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression-en) | Next: [Decision Trees, Random Forests, and Gradient Boosted Trees](/posts/ai/2026-09-30-ntu-htlin-ml-decision-tree-random-forest-gbdt-en) | [Series overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en)

The first six lectures of Techniques all do one thing: use kernels to pack a huge number of features into a model. Lecture 7 changes the question and opens the second part, "Combining Predictive Features: Aggregation Models." You have many hypotheses, some strong and some weak. Can you combine them into a G that beats every one of them?

These two lectures answer two questions. First, why does combining help? Diversity, plus the fact that voting cancels out variance. Second, where does diversity come from? T7 gets it from random resampling of the data (bagging). T8 gets it from deliberate re-weighting (AdaBoost).

## Where these lectures sit

| Version | Week | Slides | Extended reading (as listed on the course page) |
|---|---|---|---|
| MOOC | Techniques T7, T8 | 207, 208 | — |
| [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) | T7 in W11 (11/11); T8–T11 in W12 (11/18) | [207u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/207u_handout.pdf), [208u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/208u_handout.pdf) | Chen et al., Breiman, Freund & Schapire |
| [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) | T7–T8 in W11 (11/18) | 207u and 208u currently return 404 (not released yet) | Same |

The course page lists no LFD chapters for these two lectures, so this post relies on the slides and videos only.

## T7 Blending and Bagging

Videos: [Motivation of Aggregation](https://www.youtube.com/watch?v=mjUKsp0MvMI), [Uniform Blending](https://www.youtube.com/watch?v=DAFkKJYTMW4), [Linear and Any Blending](https://www.youtube.com/watch?v=i03s1g7X_m4), [Bagging (Bootstrap Aggregation)](https://www.youtube.com/watch?v=3T1mdvzRAF0)

### From picking one friend to letting friends vote

The slides open with a story. You have T friends, and each predicts whether a stock will go up. How could you use them?

- Pick the one with the best track record. That is validation from Foundations L15.
- Give everyone one vote.
- Let them vote, but give more ballots to the more trustworthy ones.
- Decide whom to listen to depending on the situation.

All four are special cases of G(x) = sign(Σ q_t(x)·g_t(x)). Selection keeps a single nonzero q_t, uniform sets q_t = 1, non-uniform sets q_t = α_t, and conditional lets q_t depend on x. This whole family is called aggregation models.

The weakness of selection is that it needs **one** strong g_t. Aggregation asks whether many weaker hypotheses can do better. The slides give two intuitions:

- A few horizontal and vertical lines (very weak hypotheses) voting together can form a boundary with corners. G gets stronger, which acts like a **feature transform**.
- Averaging many random PLA lines gives a more central line. G gets more stable, which acts like **regularization**.

One effect fights underfitting and the other fights overfitting. Both come back in the T11 summary.

### Uniform blending: why it helps, in one derivation

Classification votes; regression averages: G(x) = (1/T) Σ g_t(x). If all g_t are the same, averaging changes nothing. If they differ enough, some overestimate and some underestimate, and the average can beat any single one.

The slides then split "the average error of the g_t" into two terms:

<details>
<summary>Derivation: avg E_out(g_t) = avg ε(g_t − G)² + E_out(G)</summary>

Fix an x and let G = avg g_t:

avg (g_t − f)² = avg(g_t² − 2g_t f + f²) = avg(g_t²) − 2Gf + f²
= avg(g_t²) − G² + (G − f)²
= avg(g_t − G)² + (G − f)²

Taking expectation over x gives avg E_out(g_t) = avg ε(g_t − G)² + E_out(G) ≥ E_out(G).

</details>

So **G's error is never worse than the average error of the g_t**, and the gap depends on how spread out the g_t are.

The slides take one more step. Imagine drawing a fresh size-N dataset D_t from P each time, training g_t on it, and letting T go to infinity; call the limit of the average the consensus ḡ. The equation now reads: expected performance of the algorithm = expected deviation from the consensus + performance of the consensus. The second term is the **bias** and the first is the **variance**. Uniform blending shrinks the variance term, which makes performance more stable.

### Linear and any blending: hypotheses as a feature transform

How do you compute a different number of ballots α_t for each g_t? The slides point out that this is just a linear model whose feature transform is Φ(x) = (g_1(x), …, g_T(x)). Linear blending = linear model + hypotheses as the transform + the constraint α_t ≥ 0.

In practice the constraint α_t ≥ 0 is often dropped. The slides' reason is easy to remember: a negative α_t just means using −g_t with a positive weight. If you have a stock classifier with 99% error, flip it and it is 99% accurate.

Two things need care:

1. **Don't choose α by E_in.** Linear blending includes selection as a special case, so learning α on E_in costs at least as much VC complexity as picking from the union of all H_t. The practical recipe is to train g_t⁻ on D_train and learn α on D_val.
2. **Any blending (stacking)** transforms D_val into (Φ⁻(x_n), y_n) and fits any model on top, not just a linear one. It achieves conditional blending, but like any more powerful model it risks overfitting.

The slides cite NTU's own [KDD Cup 2011 Track 1 winning solution (Chen et al.)](https://www.csie.ntu.edu.tw/~htlin/paper/doc/wskdd11cup_one.pdf). Validation-set blending cut the squared test error from 519.45 to 456.24 and kept the team in the lead for the last two weeks. Test-set blending in the final hour cut it to 442.06 and turned the tables. The slides conclude that blending is computationally heavy but useful in practice.

### Bagging: diversity from the one dataset you have

So far the g_t were trained first. The next question: if you want to **learn the g_t and combine them at the same time**, where does diversity come from? The slides list four sources: different models, different parameters for the same model (such as different learning rates η), algorithmic randomness (PLA with different random seeds), and data randomness (the g_v⁻ inside cross-validation).

Bagging takes the last route without carving out a validation set. Back to bias–variance: the consensus ḡ needs infinitely many independent D_t, and you only have one D. The **bootstrap** is a statistical tool that resamples N examples from D uniformly with replacement (N′ also works) and pretends the result is a new D_t.

The bootstrap aggregation (BAGging) algorithm is two lines: in each round, draw D̃_t by bootstrapping and train g_t = A(D̃_t); at the end, vote uniformly. It is a meta algorithm that wraps any base algorithm A.

The slides demonstrate it with the pocket algorithm (1000 iterations) and 25 bagged copies. Each g_t looks very different, and the vote gives a sensible non-linear boundary. The conclusion: **bagging works well when the base algorithm is sensitive to data randomness**. That line sets up random forests in the next post, because a fully grown decision tree is exactly such an algorithm.

## T8 Adaptive Boosting

Videos: [Motivation of Boosting](https://www.youtube.com/watch?v=hL8DjIHAzZY), [Diversity by Re-weighting](https://www.youtube.com/watch?v=pTNKUj_1Dw8), [Adaptive Boosting Algorithm](https://www.youtube.com/watch?v=vqTXLTYqbbw), [Adaptive Boosting in Action](https://www.youtube.com/watch?v=5wPN87bwoaE)

### A teacher and a class of six-year-olds

T8 opens with a fruit class for six-year-olds. The teacher shows pictures of apples and non-apples and asks what an apple looks like. Michael says circular. The teacher points out that "circular" alone makes mistakes, and Tina adds red. The teacher points out there are still mistakes, and Joey says apples can also be green. Finally Jessica adds that apples have stems at the top. The class concludes that apples are somewhat circular, somewhat red, possibly green, and may have stems at the top.

The slides map the roles onto the algorithm. Each student is a simple hypothesis g_t (like a horizontal or vertical line). The class's conclusion is the sophisticated G. The teacher is a learning algorithm that directs the students to **focus on the examples just answered wrongly**.

### Bootstrap as weighting, then weighting on purpose

Step one is to look at bagging differently. In a bootstrap sample D̃_t, some examples appear twice and some not at all, which is the same as putting weights u_n = 2, 1, 0, … on the original D. So each g_t in bagging is really minimizing a weighted E_in^u.

Most algorithms can take weights. SVM changes the upper bound to 0 ≤ α_n ≤ C·u_n; logistic regression with SGD can sample examples in proportion to u_n. The slides call this an extension of class-weighted learning from Foundations L8.

Step two asks how to set the weights so that g_{t+1} differs from g_t as much as possible. The idea is to make g_t **look like random guessing** under the new weights u^(t+1), with a weighted error rate of exactly 1/2. An algorithm minimizing the new weighted error then won't return anything like g_t.

The fix is multiplicative rescaling. If g_t has weighted error rate ε_t, multiply the incorrect examples by something proportional to (1 − ε_t) and the correct ones by something proportional to ε_t; the two totals become equal. Defining the scaling factor ♦_t = √((1 − ε_t)/ε_t), multiplying incorrect examples by ♦_t and dividing correct ones by ♦_t does the same thing. Whenever ε_t ≤ 1/2, ♦_t ≥ 1, which means **scale up the incorrect and scale down the correct**, just like the teacher.

### The AdaBoost algorithm

Two questions remain: the first round's weights and how to combine at the end.

- In the first round you want g_1 to be the E_in minimizer, so u^(1) = 1/N.
- The final vote can't be uniform: g_2 was chosen specifically where g_1 fails and may be bad on the original E_in. The slides instead **combine linearly on the fly**, giving good g_t large weights: α_t = ln(♦_t). When ε_t = 1/2, α_t = 0 (a hypothesis no better than guessing gets no vote); when ε_t = 0, α_t = ∞.

The slides split AdaBoost into three roles: a weak base algorithm A (Student), the optimal re-weighting factor ♦_t (Teacher), and the "magic" linear aggregation α_t (Class).

The theoretical guarantee comes from the VC bound: E_out(G) ≤ E_in(G) + O(√(O(d_vc(H)·T log T)·log N / N)). According to the slides, if ε_t ≤ ε < 1/2 holds in every round, E_in(G) reaches 0 after T = O(log N) rounds, and the overall d_vc grows "slowly" with T. That is what boosting means: **if the base algorithm is always slightly better than random, AdaBoost makes it strong**.

### AdaBoost-Stump and real-time face detection

In practice you need an A that is weak but can minimize E_in^u efficiently. A popular choice is the decision stump: h(x) = s·sign(x_i − θ), with three parameters (feature i, threshold θ, direction s). In 2D it is a horizontal or vertical line, and optimizing it takes O(d·N log N). Fall 2024 HW2 already had you implement the one-dimensional version.

The slides step through AdaBoost-Stump adding one line per round on a simple dataset, then show a non-linear boundary on a complicated one. The verdict: "non-linear yet efficient."

The application example is what the slides call "the world's first 'real-time' face detection program." Its core model is AdaBoost-Stump: a linear combination of key patches selected from 162,336 possibilities in 24×24 images, which doubles as feature selection. A modified linear aggregation then rules out non-face regions early, which buys speed.

## Practice with the Fall 2024 homework

The problems in [HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf) (released 2024-11-18, due 12-02) and [HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf) (released 12-02, due 12-16) that map directly to these two lectures:

| Problem | Type | What it practices |
|---|---|---|
| HW6 Q4 | Auto-graded | Uniformly blend 5 classifiers with independent errors and E_out = 0.25 each; roughly what is E_out(G)? (The problem cites page 7 of Lecture 207.) |
| HW6 Q9 | Human-graded | Combine linear blending's Φ(x) = (g_1(x), …, g_T(x)) with kernels: using scaled decision stumps on integer inputs as the g_t, derive the kernel K_ds(x, x′) |
| HW7 Q1 | Auto-graded | With N = 1126, how many bootstrap draws make the chance of at least one duplicate exceed 70%? |
| HW7 Q3 | Auto-graded | With 87% negative examples and g_1 returning the constant −1, the ratio of positive to negative weights in round two |
| HW7 Q5 | Human-graded | The tightest upper bound on E_out(G) for a uniform vote of 2M+1 classifiers |
| HW7 Q6 | Human-graded | Prove U_{t+1}/U_t = 2√(ε_t(1 − ε_t)), the backbone of the proof that AdaBoost converges within O(log N) rounds |
| HW7 Q10–12 | Human-graded | Implement AdaBoost-Stump on LIBSVM's [madelon](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/madelon) (train) and madelon.t (test), run all T = 500 rounds, and plot E_in(g_t) with ε_t, E_in(G_t) with E_out(G_t), and U_t |

Q10 asks you to extend the HW2 decision stump to a multi-dimensional, weight-aware version; the simplest approach is to find the best stump per dimension and then take the best across dimensions. The hint in HW6 Q9 also links Lin's own early paper, [infkernel.pdf](https://www.csie.ntu.edu.tw/~htlin/paper/doc/infkernel.pdf), for readers curious about turning perceptrons and decision trees into kernels.

There are no official solutions, so set up your own checks. For Q10–12, compare against scikit-learn's `AdaBoostClassifier` with depth-1 trees and see whether the E_in(G_t) trend matches. For Q1, check your analytic answer with a Monte Carlo simulation. The series' [Techniques homework and final project](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en) post walks through HW6 and HW7 in full.

## How to use these two lectures for self-study

1. Start with the [Uniform Blending](https://www.youtube.com/watch?v=DAFkKJYTMW4) video and derive the avg E_out(g_t) decomposition yourself. That bias–variance split is the foundation for the whole aggregation part.
2. Watch T8's [Diversity by Re-weighting](https://www.youtube.com/watch?v=pTNKUj_1Dw8). The key is the design goal of making g_t look random under the new weights; the α_t formula follows from it rather than being the starting point.
3. One thing to do tonight: implement AdaBoost-Stump in about 20 lines on a 2D toy dataset and plot the five highest-weight points each round. They keep being the few points near the boundary. That is the "teacher" at work.

## Further reading

Extended reading listed on the course page:

- [Breiman, Bagging Predictors (UC Berkeley Technical Report 421)](https://statistics.berkeley.edu/sites/default/files/tech-reports/421.pdf): the original bagging paper.
- [Freund & Schapire, A Short Introduction to Boosting](https://cseweb.ucsd.edu/~yfreund/papers/IntroToBoosting.pdf): an introduction written by AdaBoost's authors.
- [Chen et al., A linear ensemble of individual and blended models for music rating prediction](https://www.csie.ntu.edu.tw/~htlin/paper/doc/wskdd11cup_one.pdf): the KDD Cup 2011 winning solution cited in T7.

How other courses on this site cover the same topics (this post does not skip anything because of them):

- [Harvard CS181 HW4: Decision Trees, Random Forests, and MoE](/posts/tech/2026-09-29-harvard-cs181-hw4-trees-forests-moe-en)
- [Reading Stanford CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en)

## References

- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/) — section titles and slides for Techniques T7 and T8
- [Lecture 7: Blending and Bagging (207_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/207_handout.pdf) — four forms of aggregation, bias–variance decomposition, linear/any blending, KDD Cup 2011 numbers, bagging pocket demo
- [Lecture 8: Adaptive Boosting (208_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/208_handout.pdf) — apple story, optimal re-weighting, AdaBoost algorithm, VC guarantee, AdaBoost-Stump and face detection
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2) — videos 26–33 (lectures in Mandarin)
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) — weekly schedule, 207u/208u slides, and reading list
- [Fall 2024 Homework 6 (hw6_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)
- [Fall 2024 Homework 7 (hw7.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) — W11 schedule
- [LIBSVM Data: madelon](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/madelon)
- [Breiman, Bagging Predictors](https://statistics.berkeley.edu/sites/default/files/tech-reports/421.pdf)
- [Freund & Schapire, A Short Introduction to Boosting](https://cseweb.ucsd.edu/~yfreund/papers/IntroToBoosting.pdf)
- [Chen et al., KDD Cup 2011 Track 1 solution](https://www.csie.ntu.edu.tw/~htlin/paper/doc/wskdd11cup_one.pdf)
- On this site: [Series overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en)
