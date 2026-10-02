---
title: "Hsuan-Tien Lin's ML Techniques T1–T2: Linear SVM and Dual SVM — the Fattest Separator, QP, and KKT"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, svm, optimization]
lang: en
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 9
tldr: "Lecture 1 of Machine Learning Techniques turns \"which separating line is best?\" into an optimization problem. Once you fix the scale so that min yₙ(wᵀxₙ+b) = 1, maximizing the margin is the same as minimizing ½wᵀw, which is a standard QP. Lecture 2 uses Lagrange duality to trade a QP with d̃+1 variables for one with N variables and N+1 constraints, then uses the KKT conditions to recover (b, w) from α. Only the points with αₙ > 0, the support vectors, affect the answer. The dual still contains the inner product zₙᵀzₘ, so the dependence on dimension is not really gone until the kernel lecture."
description: "A guide to Lectures 1 (Linear SVM) and 2 (Dual SVM) of Hsuan-Tien Lin's NTU course Machine Learning Techniques: the bridge from the cost of feature transforms (Foundations L12) and weight decay (L14) to the maximum margin, point-to-hyperplane distance, the standard hard-margin problem as a QP, why a large margin lowers the effective VC dimension, the Lagrangian and strong duality, the KKT conditions, and what support vectors mean. Includes video, slide, and LFD e-8.1–8.2 mappings."
draft: false
glossary:
  - term: "margin"
    aliases: ["fatness"]
    definition: "The distance from a separating hyperplane to the closest training point. Lin's slides first call it \"fatness\" before introducing the formal name, margin."
    context: "The quantity Techniques T1 maximizes: find the fattest separating hyperplane."
  - term: "KKT conditions"
    aliases: ["Karush-Kuhn-Tucker conditions"]
    definition: "Conditions that must hold when the primal and dual problems are both at their optimum: primal feasibility, dual feasibility, dual-inner optimality, and complementary slackness. For convex QPs like the SVM they are also sufficient."
    context: "Techniques T2 uses them to recover w and b from the dual solution α."
  - term: "support vector"
    aliases: ["SV"]
    definition: "A training point with αₙ > 0 in the dual solution. It always lies on the fat boundary, and w and b can be computed from the support vectors alone."
    context: "The origin of the name SVM. T2 separates \"candidates on the boundary\" from \"points with αₙ > 0\"."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm)

This is part 9 of [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en), and the first post on [Machine Learning Techniques](https://www.csie.ntu.edu.tw/~htlin/mooc/). It covers Techniques Lecture 1, Linear Support Vector Machine, and Lecture 2, Dual Support Vector Machine.

**Sources**: the MOOC slides [201_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/201_handout.pdf) and [202_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/202_handout.pdf), videos 1–9 of the [Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2), and the schedules on the [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) and [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) course pages, all opened and checked on 2026-09-30. The textbook sections are [LFD](http://amlbook.com) e-8.1 (linear SVM) and e-8.2 (dual SVM), as listed on both course pages. e-Chapter 8 is an online chapter of LFD, and I did not open the chapter itself.

Access level: the MOOC alone is **A2**. The slides and all 9 videos are free. Fall 2024 has no homework dedicated to these two lectures; the related problems are in HW6 (see the end of this post). That PDF is public, but there are no official solutions.

The lectures are taught in Mandarin; the slides are in English.

## Picking up from Foundations: the transform bill is still unpaid

Foundations ended with two tools, and Techniques Lecture 1 connects them.

The first is the [L12 nonlinear transform](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/12_handout.pdf). Mapping x to Q-th order polynomial features Φ_Q(x) lets you draw curved boundaries, but the "Price of Nonlinear Transform" section of L12 lists two costs. A d̃-dimensional feature vector is hard to compute and store when Q is large, and a large Q also means a large d_vc. See [part 6](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform-en).

The second is [L14 regularization](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf): add (λ/N)wᵀw to E_in, known as weight decay, to keep w short. See [part 7](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization-en).

The Course Design slide at the start of Lecture 1 says the whole course is built around three techniques for handling feature transforms. The first is Embedding Numerous Features: how to exploit and regularize a huge number of features. That technique leads to the SVM. The next two lectures aim to give you the complex boundaries of a high-dimensional transform without paying either of the L12 costs.

## T1: Linear SVM

### Which line is best?

The slides open with a picture of three lines that all separate the data, each with E_in = 0. Which one PLA picks depends on randomness. The VC bound treats them all the same, since they all have d_vc = d + 1. Yet most people would pick the one farthest from both classes.

Lin gives an informal argument. A future input x is probably some training point xₙ plus a bit of noise. The farther the line is from the closest xₙ, the more noise it can tolerate, and the less likely it is to overfit. He calls such a hyperplane "fat": its fatness is the distance to the closest training point, and the formal name is the **margin**. The goal becomes: among hyperplanes that classify every point correctly, find the one with the largest margin.

### Writing it as a standard problem

This part takes three small technical steps:

1. **Pull w₀ out and call it b.** The intercept plays a different role from the other weights when computing distance, so from here on the hypothesis is h(x) = sign(wᵀx + b), and x and w no longer carry the constant 1.
2. **Distance to a hyperplane.** Take two points x′ and x″ on the hyperplane to see that w is perpendicular to it. Project x − x′ onto the direction of w: distance = |wᵀx + b| / ‖w‖. For a separating line, the absolute value can be replaced by yₙ(wᵀxₙ + b).
3. **Fix the scale.** wᵀx + b = 0 and 3wᵀx + 3b = 0 describe the same line, so you can restrict attention to (b, w) with min yₙ(wᵀxₙ + b) = 1. The margin is then exactly 1/‖w‖.

The slides then argue that relaxing "the minimum equals 1" to "every point is ≥ 1" does not move the optimum. If the optimum had every point above 1 (the slide uses 1.126), you could scale (b, w) down and get a larger 1/‖w‖, a contradiction. Finally, max 1/‖w‖ becomes a min, the square root goes away, and a ½ is added:

```text
min_{b,w}  ½ wᵀw
subject to yₙ(wᵀxₙ + b) ≥ 1,  n = 1, …, N
```

This is the standard form of the **hard-margin SVM**. The slides solve one small case by hand with four 2D points and get w = (1, −1), b = −1, and a margin of 1/√2 ≈ 0.707. In the picture, only the points on the fat boundary pin down the line; removing the others changes nothing. Lin calls the boundary points **support vector (candidates)**, which is where the name SVM comes from.

### Handing it to a QP solver

In general you cannot solve it by hand, and gradient descent does not handle constraints easily. Luckily the objective is a convex quadratic in (b, w) and the constraints are linear in (b, w). That makes it a **quadratic programming (QP)** problem, and solvers already exist.

The slides map the SVM onto a generic solver call `QP(Q, p, A, c)`: the variable is u = [b; w]; Q is a square matrix with 0 in the top-left corner and an identity block in the bottom-right; p = 0; each constraint is aₙᵀ = yₙ[1, xₙᵀ] with cₙ = 1, N constraints in total. For a nonlinear SVM, replace xₙ with zₙ = Φ(xₙ).

### Why a large margin helps

This is the section of T1 worth reading slowly, because it ties the SVM back to Foundations theory.

First, from the regularization side. L14 regularization minimizes E_in subject to wᵀw ≤ C. The SVM flips this: minimize wᵀw subject to E_in = 0 (and more). The slide's conclusion is that the SVM is weight-decay regularization within E_in = 0.

Second, from the VC side. Imagine an algorithm A_ρ that returns a separating line with margin ≥ ρ if one exists, and gives up otherwise. With ρ = 0 it behaves like PLA and can shatter 3 points in general position. With ρ large enough, it cannot shatter any 3 points. Fewer dichotomies means a smaller effective VC dimension. The bound on the slide: when inputs lie in a ball of radius R, d_vc(A_ρ) ≤ min(R²/ρ², d) + 1, which never exceeds the d + 1 of ordinary perceptrons.

Note the caveat on the slide: this is the VC dimension of the algorithm A_ρ, which depends on the data. That goes beyond the VC theory covered in Foundations.

The last table is the point of T1:

| | hyperplanes | large-margin hyperplanes | hyperplanes + feature transform Φ |
|---|---|---|---|
| number of boundaries | not many | even fewer | many |
| boundary shape | simple | simple | sophisticated |

Few boundaries help generalization; sophisticated boundaries help lower E_in. Large margins combined with a rich feature transform may give you both. That is the case for the nonlinear SVM, and the problem T2 sets out to solve.

**Try this**: work the slide's Fun Time question (ρ = 1/4, 1126 dimensions, ‖z‖ ≤ 1: what is the upper bound on d_vc?) and make sure you can apply min(R²/ρ², d) + 1.

## T2: Dual SVM

### Motivation: an SVM that does not depend on d̃

The QP for a nonlinear SVM has d̃ + 1 variables and N constraints. When d̃ is huge, or infinite, you cannot solve it. The slide states the goal plainly: SVM without dependence on d̃. The plan is to find an "equivalent" QP with N variables and N + 1 constraints.

Lin gives fair warning here: "Warning: Heavy Math!!!!!!". He introduces the math needed without full rigor, and some results are simply "claimed", the same way Foundations claimed Hoeffding's inequality.

### The Lagrangian: hiding the constraints inside a max

The tool is the Lagrange multiplier, already seen in L14. There, λ was a given parameter. The dual SVM does the reverse: each constraint gets its own multiplier αₙ, treated as an unknown to solve for. N constraints mean N multipliers.

```text
L(b, w, α) = ½ wᵀw + Σₙ αₙ (1 − yₙ(wᵀzₙ + b))
```

The key observation: the original SVM equals `min_{b,w} ( max_{αₙ≥0} L )`. If (b, w) violates some constraint, that term is positive, the matching αₙ can grow without bound, and the max is ∞. If (b, w) satisfies all constraints, every term is ≤ 0, the max sets αₙ = 0, and what remains is ½wᵀw. The constraints are now hidden inside the max.

### The dual problem and strong duality

Swapping the min and the max gives a lower bound:

```text
min_{b,w} max_{α≥0} L  ≥  max_{α≥0} min_{b,w} L
```

The right-hand side is the **Lagrange dual problem**. The "≥" is weak duality. For a QP, equality holds when the primal is convex, feasible (true if the data are separable in Φ-space), and has linear constraints. That is **strong duality**, and the slides call these conditions constraint qualification. Then a single (b, w, α) is optimal for both sides.

### Simplifying: two partial derivatives

The inner problem of the dual is an unconstrained min, so its partial derivatives vanish at the optimum:

- With respect to b: Σ αₙyₙ = 0. Once you add this as a constraint, every term with b drops out.
- With respect to w: w = Σ αₙyₙzₙ. Substituting back leaves only α.

The result is the standard hard-margin SVM dual:

```text
min_α  ½ Σₙ Σₘ αₙαₘ yₙyₘ zₙᵀzₘ − Σₙ αₙ
subject to Σₙ yₙαₙ = 0;  αₙ ≥ 0, n = 1, …, N
```

N variables and N + 1 constraints, as promised.

### KKT conditions: recovering (b, w) from α

When the primal and dual are both optimal, four groups of conditions hold. These are the **KKT conditions**:

1. Primal feasible: yₙ(wᵀzₙ + b) ≥ 1
2. Dual feasible: αₙ ≥ 0
3. Dual-inner optimal: Σ yₙαₙ = 0; w = Σ αₙyₙzₙ
4. Primal-inner optimal (complementary slackness): αₙ(1 − yₙ(wᵀzₙ + b)) = 0

The slides say these are necessary for optimality, and sufficient here. You get w directly from condition 3. You get b from condition 4: for any αₙ > 0, the bracket must be 0, so b = yₙ − wᵀzₙ.

The slides add two practical warnings. First, the dual's matrix entries q_{n,m} = yₙyₘzₙᵀzₘ are usually nonzero, so with N = 30,000, just storing the dense matrix takes more than 3 GB. Second, many solvers treat equality and bound constraints specially, so in practice you want a solver built for the SVM rather than a generic QP.

### What the dual tells you

Complementary slackness says that any point with αₙ > 0 lies on the fat boundary. The slides use this to redefine the **support vector**: only points with αₙ > 0 are support vectors, and they are a subset of the candidates on the boundary. Both w and b can be computed from support vectors alone.

The slides also put the SVM next to PLA:

| | representation | where the coefficients come from |
|---|---|---|
| SVM | w = Σ αₙ(yₙzₙ) | the dual solution |
| PLA | w = Σ βₙ(yₙzₙ) | how many times each point was corrected |

In both cases w is a linear combination of yₙzₙ, "represented by the data". The same holds for GD/SGD-based logistic and linear regression started from w₀ = 0. The difference is that the SVM represents w with support vectors only.

Primal versus dual:

| | primal hard-margin SVM | dual hard-margin SVM |
|---|---|---|
| size | d̃ + 1 variables, N constraints | N variables, N + 1 simple constraints |
| suitable when | d̃ is small | N is small |
| physical meaning | find the specially scaled (b, w) | find the support vectors and their αₙ |

### Not done yet

The last slide of T2 asks: Are We Done Yet? The number of variables in the dual QP no longer depends on d̃, but q_{n,m} contains zₙᵀzₘ, an inner product in d̃ dimensions that costs O(d̃) to compute naively. The dependence on d̃ is hidden, not removed. Removing it takes the kernel trick in the [next post](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm-en).

<details>
<summary>Two Fun Time questions worth deriving yourself</summary>

- Two points (z, +1) and (−z, −1), with both α₁ and α₂ positive: what is the optimal b? Write the two complementary slackness equations and add them.
- N = 5566 with 1126 support vectors: how many points could be on the fat boundary? The key is "support vectors ⊆ candidates on the boundary ⊆ all data".

The slides include reference answers. Derive first, then check.

</details>

## Videos and slides

| Section | Video | Slides |
|---|---|---|
| Course Introduction | [T1-1](https://www.youtube.com/watch?v=A-GxGCCAIrg) | 201 |
| Large-Margin Separating Hyperplane | [T1-2](https://www.youtube.com/watch?v=8hak0XngnV0) | 201 |
| Standard Large-Margin Problem | [T1-3](https://www.youtube.com/watch?v=lHo9GcIURRs) | 201 |
| Support Vector Machine | [T1-4](https://www.youtube.com/watch?v=FAm70y081o4) | 201 |
| Reasons behind Large-Margin Hyperplane | [T1-5](https://www.youtube.com/watch?v=7UUO_AamxcA) | 201 |
| Motivation of Dual SVM | [T2-1](https://www.youtube.com/watch?v=VUp-17l03lk) | 202 |
| Lagrange Dual SVM | [T2-2](https://www.youtube.com/watch?v=Yhwtvbzg9Fw) | 202 |
| Solving Dual SVM | [T2-3](https://www.youtube.com/watch?v=qGk0p7K07Mc) | 202 |
| Messages behind Dual SVM | [T2-4](https://www.youtube.com/watch?v=agmmQh702aA) | 202 |

The YouTube title of T2-2 is spelled "Largange Dual SVM"; the slides spell Lagrange correctly.

## How the two semesters schedule it

- **Fall 2024**: W9 (10/28) covers linear SVM and dual SVM in the same week, with slides `201u` and `202u`.
- **Fall 2026**: scheduled for W9 (11/04), same two lectures together, with LFD e-8.1 and e-8.2 listed. The `201u_handout.pdf` link returned 404 on 2026-09-30 (the course is only in W4), so this post uses the MOOC version only.

## Practice: related problems in Fall 2024 HW6

[Fall 2024 HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf) (released 2024-11-18, due 12-02) covers kernels, soft margins, and aggregation, so most of it needs the next post. Two problems connect directly to this one:

- **Q1**: write the PLA weight vector as Σ αₙΦ(xₙ) and ask how α should be updated on each correction. This extends the "w represented by data" table at the end of T2.
- **Q13 (bonus)**: derive the dual of the soft-margin SVM dual and compare it with the primal. Get comfortable with the Lagrange duality steps in this post first.

There are no official solutions. For Q1, you can write a kernel perceptron and check step by step that its w matches ordinary PLA on the same data.

## Further reading

- The site's [CS229 2026 notes, chapter 6: support vector machines](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-06-support-vector-machines-en): another derivation of the SVM to compare with the QP view here.
- [Caltech Learning from Data](https://work.caltech.edu/telecourse): Abu-Mostafa's English course on the same textbook.

Series navigation: previous, [Validation and three learning principles](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en) | next, [Kernel trick and soft-margin SVM](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm-en) | [series overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en)

## References

- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/) — outline and slides for all 16 Techniques lectures
- [Techniques Lecture 1: Linear Support Vector Machine (201_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/201_handout.pdf)
- [Techniques Lecture 2: Dual Support Vector Machine (202_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/202_handout.pdf)
- [Foundations Lecture 12: Nonlinear Transformation (12_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/12_handout.pdf)
- [Foundations Lecture 14: Regularization (14_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf)
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2) (in Mandarin)
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)
- [Fall 2024 Homework 6 (hw6_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)
- [Learning from Data textbook site](http://amlbook.com)
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)
