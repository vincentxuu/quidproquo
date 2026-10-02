---
title: "Hsuan-Tien Lin's ML Foundations L7–L8: How the VC Dimension Measures Model Complexity, and What Noise and Error Measures Change"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, machine-learning, learning-theory, ai-course, course-guide]
lang: en
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 4
tldr: "L7 names the largest non-break point the VC dimension d_VC, proves that d-dimensional perceptrons have d_VC = d + 1, and rewrites the VC bound as E_out ≤ E_in + a model-complexity penalty, so both too large and too small a d_VC hurt. Theory asks for N ≈ 10,000·d_VC examples; in practice 10·d_VC is often enough. L8 swaps the fixed target function for a distribution P(y|x) and shows the VC theory still holds under noise. The error measure should come from the application: a CIA fingerprint check that penalizes admitting an intruder 1000 times more can be reduced to plain classification by copying examples."
description: "A guide to Lectures 7–8 of Hsuan-Tien Lin's Machine Learning Foundations (NTU): the definition of the VC dimension, d_VC for the four running examples, the two-part proof that d-D perceptrons have d_VC = d+1, the degrees-of-freedom intuition, reading the VC bound as model complexity and sample complexity, and why it is loose; then noise and probabilistic targets, pointwise errors, the ideal mini-target, choosing errors by application (supermarket vs CIA fingerprint checks), weighted classification and the weighted pocket algorithm. Includes the Fall 2026 extended slides on the deep learning era and the matching Fall 2024 HW3 problems."
draft: false
glossary:
  - term: "VC dimension"
    aliases: ["d_VC", "Vapnik–Chervonenkis dimension"]
    definition: "The largest number of points a hypothesis set H can shatter, i.e. the largest N with m_H(N) = 2^N. It equals the minimum break point minus 1."
    context: "Lecture 7 of Hsuan-Tien Lin's Machine Learning Foundations uses it as the yardstick for model complexity; d-D perceptrons have d_VC = d + 1."
    links:
      - label: "L7 slides"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/07_handout.pdf"
  - term: "ideal mini-target"
    aliases: ["mini-target"]
    definition: "Under noise, the prediction for a given input x that minimizes the average error. It depends on both P(y|x) and the error measure: the most probable y under 0/1 error, the expected value of y under squared error."
    context: "Terminology from Lecture 8 of Hsuan-Tien Lin's Machine Learning Foundations."
    links:
      - label: "L8 slides"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/08_handout.pdf"
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error)

This is part 4 of the [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en) series, following [Training versus Testing: Growth Functions and Break Points](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en). It covers Lecture 7, The VC Dimension, and Lecture 8, Noise and Error, from [Machine Learning Foundations](https://www.csie.ntu.edu.tw/~htlin/mooc/). These two lectures close out "Why Can Machines Learn?"

The post has two core ideas, so it has two main parts. L7 condenses the previous post's theory into one number, d<sub>VC</sub>. L8 extends the theory to noisy data and arbitrary error definitions, and sets up the squared error and cross-entropy of the next post.

Official materials used:

- MOOC slides [07_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/07_handout.pdf) and [08_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/08_handout.pdf), plus the Fall 2026 [07e_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/07e_handout.pdf) (5 pages of extended slides for L7).
- Videos 26–33 of the [Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf). Lectures are in Mandarin; slides are in English.
- Textbook [Learning from Data](http://amlbook.com) (LFD): 2.2 for L7 and 1.4 for L8, per the [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) and [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) course pages.
- Practice: Q1 and Q5–7 of [Fall 2024 HW3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf).

**Access level**: videos and slides alone are A2. With the Fall 2024 homework PDFs it reaches A3, but there are no official solutions and grading is for enrolled students only. The grading scale is defined in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en).

**Version differences**: the Fall 2024 [08u slides](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/08u_handout.pdf) have only three sections; the MOOC section on Weighted Classification is gone. Fall 2026's required-before-class list for W4 (09/30) likewise includes only the first three L8 videos. This post keeps weighted classification because the MOOC still has it, and the same idea returns in the Techniques course with AdaBoost.

## Part 1: The VC dimension

### Definition

Slide 4: **the VC dimension of H, d<sub>VC</sub>(H), is the largest N for which m<sub>H</sub>(N) = 2<sup>N</sup>**. In other words:

- It is the most points H can shatter.
- d<sub>VC</sub> = minimum break point − 1.
- If N ≤ d<sub>VC</sub>, some set of N points can be shattered. If k > d<sub>VC</sub>, k is certainly a break point.

For N ≥ 2 and d<sub>VC</sub> ≥ 2, the previous post's bounding function loosens to m<sub>H</sub>(N) ≤ N<sup>d<sub>VC</sub></sup>. In d<sub>VC</sub> terms, the four running examples are: positive rays 1, positive intervals 2, convex sets ∞, 2D perceptrons 3.

Slide 6 spells out what the guarantee covers. As long as d<sub>VC</sub> is finite, g will generalize (E<sub>out</sub> ≈ E<sub>in</sub>) **regardless of the learning algorithm, the input distribution, or the target function**. The price is that it is a worst-case guarantee.

The quiz on slide 7 is worth a pause. If you find one set of N points that cannot be shattered, what does that tell you about d<sub>VC</sub>? Nothing. Another set of N points might be shatterable, or none might be. The definition hinges on "some" versus "all".

### d-dimensional perceptrons have d<sub>VC</sub> = d + 1

Slides 9–15 prove it in two directions.

**d<sub>VC</sub> ≥ d + 1**: it is enough to find **one** set of d + 1 points that can be shattered. Take the matrix X whose first row is (1, 0, …, 0) and whose i-th row adds a 1 in dimension i. X is invertible. For any desired labels y, set w = X<sup>−1</sup>y, and sign(Xw) = y.

**d<sub>VC</sub> ≤ d + 1**: now show that **no** set of d + 2 points can be shattered. Any d + 2 vectors in d + 1 dimensions are linearly dependent, so x<sub>d+2</sub> = a₁x₁ + … + a<sub>d+1</sub>x<sub>d+1</sub>. Label the first d + 1 points sign(a<sub>i</sub>). Then every term of w<sup>T</sup>x<sub>d+2</sub> is positive, and x<sub>d+2</sub> can never be labeled ×. Linear dependence restricts the dichotomies.

So a 1126-dimensional perceptron has d<sub>VC</sub> = 1127, as a quiz on slide 16 puts it. The [07e extended slides](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/07e_handout.pdf) add that origin-passing d-D perceptrons have d<sub>VC</sub> = d, and note that proving d<sub>VC</sub> is sometimes easier than deriving m<sub>H</sub>(N).

### Physical intuition: degrees of freedom

Slides 17–18: the perceptron's parameters w = (w₀, …, w<sub>d</sub>) create degrees of freedom, and d<sub>VC</sub> = d + 1 reads as the effective number of binary degrees of freedom. Positive rays have one free parameter, a, and d<sub>VC</sub> = 1. Positive intervals have two, ℓ and r, and d<sub>VC</sub> = 2. The rule of thumb is **d<sub>VC</sub> ≈ number of free parameters**, with the slide's own caveat: "but not always".

### Two ways to read the VC bound

Flip the VC bound around (slide 21). With probability at least 1 − δ,

E<sub>out</sub>(g) ≤ E<sub>in</sub>(g) + √( (8/N) · ln( 4(2N)<sup>d<sub>VC</sub></sup> / δ ) )

The square-root term, Ω(N, H, δ), is the **penalty for model complexity**.

**Reading 1: model complexity** (slide 22). As d<sub>VC</sub> grows, E<sub>in</sub> falls but Ω rises; shrink d<sub>VC</sub> and the reverse happens. The best d<sub>VC</sub> sits in the middle. The slide's verdict: "powerful H not always good!" The same picture returns in L13 on overfitting.

**Reading 2: sample complexity** (slide 23). With ε = 0.1, δ = 0.1 and d<sub>VC</sub> = 3, getting the bound under δ takes N of roughly 29,300. The slide sums it up: theory needs N ≈ 10,000·d<sub>VC</sub>, but **in practice N ≈ 10·d<sub>VC</sub> is often enough**.

### Why it is so loose

Slide 24 lists four sources. Each one is the price of holding in every case:

- Hoeffding must hold for any distribution and any target.
- It uses m<sub>H</sub>(N) instead of the dichotomy count on the data you actually have.
- It uses N<sup>d<sub>VC</sub></sup> instead of m<sub>H</sub>(N), treating every H with the same d<sub>VC</sub> alike.
- It takes a union bound over every choice the algorithm might make.

The slide's conclusion: it is hard to do much better, and the bound is "similarly loose for all models", so **the philosophical message is what matters**, not the numbers.

The 07e extended slides bring this into the deep learning era. The VC bound still holds as a mathematical theorem, and it still links model complexity to generalization conceptually. But for reasonable N and H, Ω is far above 1, so the bound is vacuous, and newer observations such as double descent are not fully explained yet. The slides' advice: "take the philosophical message, not the mathematical numbers". The same deck introduces another complexity measure, Rademacher complexity. It depends on the data, is softer than the growth function, and extends more easily to regression.

**Try this**: take a model you know, count its free parameters, estimate d<sub>VC</sub>, and check whether your data set has at least ten times that many examples. That is the most direct everyday use of VC theory.

## Part 2: Noise and error measures

### Noise and probabilistic targets

Slide 3 goes back to credit card approval and names three kinds of noise: a good customer mislabeled as bad (noise in y), identical customers with different labels (also noise in y), and inaccurate customer information (noise in x).

Does the VC bound survive? Slide 4 answers with marbles. Before, each marble's color was fixed (⟦f(x) ≠ h(x)⟧). Now the color is random (⟦y ≠ h(x)⟧, with y drawn from P(y|x)). As long as (x, y) is drawn i.i.d. from P(x, y), estimating a proportion by sampling works exactly as before, so **the VC theory still holds**.

The target function f therefore becomes a **target distribution P(y|x)** (slide 5). For example, P(○|x) = 0.7 and P(×|x) = 0.3 can be read as an ideal target f(x) = ○ plus 0.3 flipping noise. A deterministic f is just a special case of P(y|x). The goal of learning becomes: predict the ideal target (under P(y|x)) on inputs that show up often (under P(x)). This also explains why the pocket algorithm from L2 makes sense. Non-separable data does not mean the target is nonlinear. It may just be noise.

### The error measure decides the ideal target

Slides 8–10 generalize the error into a pointwise err(ỹ, y). E<sub>in</sub> averages it over the N examples; E<sub>out</sub> takes its expectation over the distribution. The two most common are:

- **0/1 error** ⟦ỹ ≠ y⟧: right or wrong, usually for classification.
- **Squared error** (ỹ − y)²: how far off, usually for regression.

Slide 11 shows noise and error jointly deciding the ideal target. Take P(y=1|x) = 0.2, P(y=2|x) = 0.7, P(y=3|x) = 0.1:

- Under 0/1 error, the best prediction is 2, with average error 0.3. Predicting 1.9 gives average error 1.0, because it is never exactly right.
- Under squared error, the best prediction is the expected value 1.9, with average error 0.29.

So the ideal target under 0/1 error is argmax P(y|x), and under squared error it is Σ y·P(y|x). A quiz on slide 13 adds one more: under absolute error |ỹ − y|, it is the weighted median.

### Choose the error from the application

Slides 14–16 use fingerprint verification to show that the two kinds of mistakes can cost very different amounts:

- A **supermarket** uses fingerprints for discounts. A false reject upsets a customer and loses future business, so it costs 10. A false accept gives away a small discount, so it costs 1.
- The **CIA** uses fingerprints at the door. A false accept lets in an intruder, so it costs 1000. A false reject annoys an employee, so it costs 1.

Slide 17's takeaway: **the true err is set by the application and the user**. What the algorithm actually optimizes is a different êrr, the algorithmic error measure, chosen for one of two reasons:

- **Plausible**: it makes sense. 0/1 corresponds to minimal flipping noise but is NP-hard to optimize; squared error corresponds to Gaussian noise.
- **Friendly**: it is easy to optimize, with a closed-form solution or a convex objective.

Linear regression and logistic regression in L9–L10 are two examples of friendly êrr.

### Weighted classification: reduction by copying examples

Writing the CIA cost matrix as E<sub>in</sub> means multiplying errors on true −1 examples by 1000 (slide 20). This is **weighted classification**.

How do you optimize it? PLA is unaffected on separable data. Pocket can change its replacement rule to "replace only if the new w has smaller weighted E<sub>in</sub>". But does the original pocket guarantee still hold?

Slides 22–23 give a systematic route. **Copy every −1 example 1000 times**, and the weighted E<sub>in</sub> of the original problem equals the ordinary 0/1 E<sub>in</sub> of the new data set. You never copy anything in practice. Weighted PLA just checks mistakes on −1 examples with 1000 times the probability, combined with the weighted pocket replacement rule. Turning a new problem into one you have already solved is called **reduction**, and the slides note that it applies to many other algorithms.

The quiz on slide 24 raises a practical issue. With 10 intruders and 999,990 employees, a constant classifier that always answers +1 has a weighted E<sub>in</sub> of 0.01. On extremely imbalanced data, setting the weights well keeps the model from lazily predicting the majority class.

**Try this**: next time you face imbalanced classification, write down the cost of each kind of mistake before deciding whether to reweight examples or move the decision threshold. Q6 of Fall 2024 HW3 asks you to derive the threshold α for the supermarket costs.

## Video list

L7 The VC Dimension:

- [Definition of VC Dimension](https://www.youtube.com/watch?v=XxPB9GlJEUk)
- [VC Dimension of Perceptrons](https://www.youtube.com/watch?v=WQzhc1IdB_I)
- [Physical Intuition of VC Dimension](https://www.youtube.com/watch?v=5-V5WCf8cY8)
- [Interpreting VC Dimension](https://www.youtube.com/watch?v=_DN_oF-i6ag)

L8 Noise and Error:

- [Noise and Probabilistic Target](https://www.youtube.com/watch?v=Br8J5pZM_CE)
- [Error Measure](https://www.youtube.com/watch?v=2gCnX0V1do8)
- [Algorithmic Error Measure](https://www.youtube.com/watch?v=0ApgGq4mh1E)
- [Weighted Classification](https://www.youtube.com/watch?v=XfuRb1jT4hs) (not on the Fall 2026 required list)

English counterpart: Lecture 7 of [Caltech's Learning from Data](https://work.caltech.edu/telecourse) is also The VC Dimension.

## Practice: Fall 2024 HW3 Q1 and Q5–7

[HW3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf) was released on 2024-10-07 and due 10/21, covering L7 to L10. Four problems match this post:

- **Q1** (auto-graded): five hypothesis sets, each with a single parameter. Which has the largest d<sub>VC</sub>? It tests "d<sub>VC</sub> ≈ number of free parameters, but not always" head-on.
- **Q5**: prove or disprove d<sub>VC</sub>(H₁ ∪ H₂) ≤ d<sub>VC</sub>(H₁) + d<sub>VC</sub>(H₂).
- **Q6**: under the supermarket error, where a false negative matters 10 times more than a false positive, the ideal target becomes sign(P(y=+1|x) − α). Find α.
- **Q7**: the course gave two definitions of E<sub>out</sub>, one against f and one against P(y|x). Prove an inequality between them, where E<sub>out</sub>(f) is the irreducible noise.

The rest of HW3 (linear regression, the hat matrix, the cpusmall experiments) is in the [next post](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en).

**Try this**: for Q1, try to shatter 1, 2 and 3 points with each option instead of just counting parameters. With no official solutions, check Q6 by plugging in concrete P(y|x) values and confirming that your α really minimizes expected cost under the supermarket matrix.

Per the course schedule, Fall 2026 hw2 comes out on 10/07. As of 2026-09-30 it is not yet public.

## Next

The next post, [Linear Regression and Logistic Regression](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en), moves on to "How Can Machines Learn?". It derives the closed-form solution of linear regression from this post's squared error, then derives cross-entropy and gradient descent from likelihood.

Further reading: the Stanford CS229 [generalization chapter guide](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-08-generalization-en) looks at the same problem through bias–variance. Caltech's Lecture 8 is also Bias-Variance Tradeoff, a different path from Lin's choice of Noise and Error for L8, and the two are worth comparing.

## References

- [Machine Learning Foundations / Techniques MOOC page (Hsuan-Tien Lin)](https://www.csie.ntu.edu.tw/~htlin/mooc/)
- [L7 The VC Dimension slides](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/07_handout.pdf)
- [L8 Noise and Error slides](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/08_handout.pdf)
- [L7 extended slides (Fall 2026)](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/07e_handout.pdf)
- [Fall 2024 L8 slides (08u)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/08u_handout.pdf)
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf) (lectures in Mandarin, slides in English)
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)
- [Fall 2024 Homework 3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf)
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)
- [Learning from Data textbook](http://amlbook.com)
- [MOOC slide errata](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php)
