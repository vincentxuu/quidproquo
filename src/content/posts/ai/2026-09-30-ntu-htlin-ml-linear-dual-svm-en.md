---
title: "Linear SVM: Writing the Fattest Separating Line as a Quadratic Program | NTU Hsuan-Tien Lin Machine Learning Techniques Lecture 1"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, svm, optimization]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 18
tldr: "Many lines classify all the data correctly; this lecture picks the one farthest from its nearest data point, the fattest one. After scaling (b, w) so that min yₙ(wᵀxₙ+b)=1, the largest margin is the same as minimizing ½wᵀw subject to yₙ(wᵀxₙ+b)≥1 for every point, which can go straight to a quadratic programming solver. Fatness helps for two reasons: it is weight decay within E_in=0, and it reduces the dichotomies that can be produced."
description: "A guide to Lecture 1 of NTU Hsuan-Tien Lin's Machine Learning Techniques, Linear Support Vector Machine: the fattest separating hyperplane, the distance from a point to a hyperplane, scaling and the standard hard-margin SVM problem, a four-point example solved by hand, the input format of quadratic programming, and why a large margin helps generalization."
draft: false
glossary:
  - term: "margin"
    aliases: ["fatness"]
    definition: "The distance from a separating hyperplane to the nearest training point. On the slides Lin first calls it fatness, then formally names it margin."
    context: "The quantity Techniques Lecture 1 maximizes: find the fattest separating hyperplane."
  - term: "hard-margin SVM"
    aliases: ["linear hard-margin SVM"]
    definition: "The SVM that requires every training point to be classified correctly and to stay out of the fat boundary. The standard problem minimizes ½wᵀw subject to yₙ(wᵀxₙ+b)≥1 for every point."
    context: "The standard problem derived in Techniques Lecture 1; the version that allows margin violations waits until Techniques Lecture 4."
  - term: "support vector"
    aliases: ["SV"]
    definition: "Techniques Lecture 1 first calls the training points that lie on the fat boundary support vector candidates: they determine where the fattest hyperplane is, and removing the other points does not change the answer. The formal definition waits until Techniques Lecture 2."
    context: "The source of the name SVM."
  - term: "quadratic programming"
    aliases: ["QP"]
    definition: "An optimization problem whose objective is a convex quadratic function of the variables and whose constraints are all linear in the variables. Ready-made solvers exist for it."
    context: "Techniques Lecture 1 maps the hard-margin SVM to the inputs of QP(Q, p, A, c)."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm)

**Video status: Videos included.** This article is written from the official MOOC handout [201_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/201_handout.pdf) and transcripts of the five official videos for this lecture, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/28 to 28/28), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Techniques Lecture 1 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en), following [Foundations Lecture 16: Three Learning Principles](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-16-three-learning-principles-en). The Roadmap on page 4 of the handout divides Techniques into three ways of handling features, and this lecture is the starting point of the first, Embedding Numerous Features: Kernel Models. The question it answers is concrete: when the data are linearly separable, many lines classify all of them correctly, so which one should you choose, and how do you compute it?

The prerequisites are a few things from Foundations: the linear classifier $h(\mathbf{x}) = \text{sign}(\mathbf{w}^\top\mathbf{x})$ and PLA ([Foundations Lecture 2](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en)), dichotomies and shattering ([Foundations Lecture 5](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en)), the VC dimension ([Foundations Lecture 7](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en)), feature transforms ([Foundations Lecture 12](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation-en)), and regularization ([Foundations Lecture 14](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization-en)), plus vector inner products and projection. After reading, you should be able to get from "find the fattest line" to the standard hard-margin SVM problem on your own, compute the fattest line by hand for a small data set, fill the problem into the four inputs of a quadratic programming solver, and say why a fat line helps generalization.

The derivation in this lecture runs in this order:

1. **The question**: all the data are classified correctly, so which line is better? The one farthest from its nearest data point.
2. **Write it as an optimization problem**: maximize the margin, subject to classifying every point correctly.
3. **Compute the distance**: take the intercept $b$ out of $\mathbf{w}$ and derive the distance from a point to a hyperplane.
4. **Fix the scaling**: look only at the ways of writing the line in which the nearest point gives exactly $y_n(\mathbf{w}^\top\mathbf{x}_n + b) = 1$; the margin becomes $1/\lVert\mathbf{w}\rVert$.
5. **Relax the constraint**: replace "the smallest equals 1" with "every one is at least 1" and prove the answer does not change.
6. **Hand it to quadratic programming**: the objective is a quadratic function and the constraints are linear.
7. **Go back and ask why**: two explanations, regularization and the VC dimension.

## How this course is organized: three techniques surrounding feature transforms

```youtube
url: https://www.youtube.com/watch?v=A-GxGCCAIrg
title: Linear Support Vector Machine (SVM) :: Course Introduction @ Machine Learning Techniques (機器學習技法)
```

(Video 00:18–03:00 introduces the course, and Fun Time follows.)

Page 1 of the handout gives the history of the course. Lin's machine learning course at NTU is a 15 to 17 week on-campus course, taught in English on a blackboard. When it moved to Coursera it was cut into two courses: the first 8 weeks are Machine Learning Foundations, and the last 8 weeks are this course, Machine Learning Techniques. The online version switched to Mandarin and to slides, and works with Coursera's quiz and homework mechanisms; the goal written on the handout is to make the online version even better than the on-campus one.

Foundations ties its 16 lectures together with four questions: when can machines learn (When), why can they learn (Why), how do they learn (How), and how can they learn better (How Better). The lectures each part covers are listed in the [Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). Techniques is organized differently. Page 2 of the handout says this course is again a mixture of philosophical illustrations, key theory, core algorithms, and usage in practice, but the backbone is now three major techniques surrounding feature transforms:

| Technique | The question on the handout | The model it inspires | Lectures |
|---|---|---|---|
| Embedding Numerous Features | how to exploit and regularize numerous features? | Support Vector Machine (SVM) | Techniques Lectures 1–6 |
| Combining Predictive Features | how to construct and blend predictive features? | Adaptive Boosting (AdaBoost) | Techniques Lectures 7–11 |
| Distilling Implicit Features | how to identify and learn implicit features? | Deep Learning | Techniques Lectures 12–15 |

The lecture ranges in the table follow the split in the overview and are not on this slide. In the lecture, Lin adds one sentence about each technique. The first: when you use a lot of feature transforms, complexity becomes a problem and has to be kept under control; the handout writes regularize and the lecture says controlling complexity, and the two refer to the same thing. The second: blend the features you have found so that the whole model performs better; the lecture also gives AdaBoost a Chinese name that means roughly "step-by-step boosting method". The third: the lecture switches to a plain way of putting it, which is letting the machine learn the features by itself; this idea led to neural networks early on and has grown into deep learning in recent years.

The first technique picks up a problem Foundations left behind. The feature transform in [Foundations Lecture 12](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation-en) can draw curved boundaries, but that lecture also lists the price: once the transformed dimension is high, computation and storage both get expensive, and $d_{\text{VC}}$ grows with it. The weight decay in [Foundations Lecture 14](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization-en) keeps complexity down by constraining the length of $\mathbf{w}$. What the first few Techniques lectures do is let you afford high-dimensional transforms without paying those two prices in full. This lecture does no transform yet and handles only linear classification in the original space, which is why it is called linear SVM.

### Fun Time: which description of this course is true

**Question (handout page 3):** Which of the following description of this course is true?

1. the course will be taught in Taiwanese
2. the course will tell me the techniques that create the android Lieutenant Commander Data in Star Trek
3. the course will be 16 weeks long
4. the course will focus on three major techniques

**Answer: 4.** Reading the question aloud in the lecture, Lin describes Data as a robot in that TV series. The handout's reference answer replies to each option in one line. Option 1: no, Lin's Taiwanese is unfortunately not good enough for teaching (yet). Option 2: no, although what the course teaches may serve as building blocks. Option 3: no, unless you count the previous course, Foundations, as well; 8 weeks plus 8 weeks is what makes 16. Option 4 is the table above.

## All correct, so which line is better: the fattest separating hyperplane

```youtube
url: https://www.youtube.com/watch?v=8hak0XngnV0
title: Linear SVM :: Large-Margin Separating Hyperplane @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–01:11 reviews linear classification, 01:11–03:21 asks which line is best, 03:21–08:04 explains with measurement error, 08:04–09:41 turns "robust" into "fat", 09:41–13:11 writes the optimization problem, and Fun Time follows.)

### Neither PLA nor the VC bound can tell them apart

Page 5 of the handout first reviews linear classification: compute a weighted score $s = \mathbf{w}^\top\mathbf{x}$ and look at its sign, $h(\mathbf{x}) = \text{sign}(\mathbf{w}^\top\mathbf{x})$. When the data are linear separable, PLA can find a line that completely separates the circles (positive examples) from the crosses (negative examples).

Page 6 shows three pictures. All three contain the same data, each with a different line, and all three lines classify the data perfectly. The handout asks: which line is best?

- **Ask PLA**: the handout's answer is depending on randomness. In the lecture, Lin explains that PLA holds a line and rotates it a little whenever it sees a mistake, so which perfect line it stops on depends on the mistakes it saw along the way; if it picks a random mistake to fix each time, where it stops is not fixed.
- **Ask the VC bound**: the handout's answer is whichever you like. The VC bound says

$$
E_{\text{out}}(\mathbf{w}) \le \underbrace{E_{\text{in}}(\mathbf{w})}_{0} + \underbrace{\Omega(\mathcal{H})}_{d_{\text{VC}} = d+1}
$$

All three lines have $E_{\text{in}}$ equal to 0, and they all come from the same hypothesis set (linear classifiers in $d$ dimensions, $d_{\text{VC}} = d+1$), so the complexity term is identical. By the theory learned in Foundations, the three lines are no different.

Yet most people would pick the rightmost line by intuition. The handout writes "You? rightmost one, possibly :-)". In the rightmost picture the line is farther from the points on both sides.

### Why the line farthest from the points: tolerating measurement error

Page 7 gives an argument the handout itself labels as an informal argument. In the lecture, Lin first says this is only a simple explanation and that a more careful theoretical guarantee comes later.

Imagine the training data are $\mathbf{x}_n$ and a future test input $\mathbf{x}$ is very close to some $\mathbf{x}_n$, $\mathbf{x} \approx \mathbf{x}_n$. The reason given in the lecture is measurement error, or error in the data collection process: even data that should be exactly identical come in slightly different. The handout writes "(Gaussian-like) noise"; the lecture does not mention Gaussian and only says measurement error. If we trust the training data, the most reasonable prediction gives this $\mathbf{x}$ the same label as $\mathbf{x}_n$.

The picture on page 7 draws a gray circle around every training point, standing for how much error the line can still tolerate. Within one picture every point's circle is the same size, and the radius is the distance from the nearest point to the line: make the circles any bigger and the nearest point's circle crosses the line. In the left picture one point sits right next to the line, so every circle is too small to see; in the right picture even the nearest point is far from the line, so every point's circle is large. The handout writes this observation as two chains of equivalences:

| From the point's side | From the line's side |
|---|---|
| $\mathbf{x}_n$ further from hyperplane | distance to closest $\mathbf{x}_n$ |
| ⟺ tolerate more noise | ⟺ amount of noise tolerance |
| ⟺ more robust to overfitting | ⟺ robustness of hyperplane |

The lecture connects this back to something from Foundations ([Foundations Lecture 13: Hazard of Overfitting](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization-en)): noise is the main cause of overfitting, and measurement error is a kind of noise, so the more error a line can tolerate, the better it is. How robust a line is comes down to how far it is from its nearest training point.

### From robust to fat

Page 8 draws the same thing from another angle. Instead of drawing circles around the points, let the line itself grow outward on both sides: how fat it can get depends on where it first touches the nearest point. In the picture each of the three lines grows into a gray band, thin on the left and wide on the right. The handout's definitions are:

- a robust separating hyperplane is a fat one, far from both sides of examples;
- robustness is equivalent to fatness, the distance to the closest $\mathbf{x}_n$.

The goal then fits on one line: find fattest separating hyperplane. In the lecture, Lin says this lecture prefers fatter lines, like someone with a steadier stance, and even jokes about Yang Guifei: fatter is better.

### Writing it as an optimization problem

Page 9 writes the goal as a formula. Each line is determined by $\mathbf{w}$, and the $\mathbf{w}$ we want satisfies two things: it classifies all the data correctly, and it is the fattest.

$$
\begin{aligned}
\max_{\mathbf{w}}\quad & \text{fatness}(\mathbf{w}) \\
\text{subject to}\quad & \mathbf{w} \text{ classifies every } (\mathbf{x}_n, y_n) \text{ correctly} \\
& \text{fatness}(\mathbf{w}) = \min_{n=1,\dots,N} \text{distance}(\mathbf{x}_n, \mathbf{w})
\end{aligned}
$$

Fatness is computed like this: find the distance from the line to every point and take the smallest. In the lecture, Lin stresses that this problem is only simple to state in words, which does not make it easy to solve; the work ahead is to rewrite it step by step into a form we know how to solve.

The handout then changes two pieces of wording. First, the formal name of fatness is margin. Lin's explanation in the lecture is that a margin is like the blank space at the edge of a page: a blank strip is left on both sides of the line, no training data appear in that strip, and the wider the blank space, the fatter the line. Second, "correct" can be written as an inequality. $y_n = \text{sign}(\mathbf{w}^\top\mathbf{x}_n)$ means the score $\mathbf{w}^\top\mathbf{x}_n$ has the same sign as $y_n$, and the product of two numbers with the same sign is always positive:

$$
\begin{aligned}
\max_{\mathbf{w}}\quad & \text{margin}(\mathbf{w}) \\
\text{subject to}\quad & \text{every } y_n\mathbf{w}^\top\mathbf{x}_n > 0 \\
& \text{margin}(\mathbf{w}) = \min_{n=1,\dots,N} \text{distance}(\mathbf{x}_n, \mathbf{w})
\end{aligned}
$$

This is the largest-margin separating hyperplane: separating means it splits the data completely, and largest-margin means its margin is the largest. For now we assume the data are linearly separable; otherwise no $\mathbf{w}$ can satisfy the first constraint. The distance in the formula is still only a name, and how to compute it is left to the section "Turning 'fattest' into a solvable problem".

### Fun Time: the fattest separating line for two points

**Question (handout page 10):** Consider two examples $(\mathbf{v}, +1)$ and $(-\mathbf{v}, -1)$ where $\mathbf{v} \in \mathbb{R}^2$ (without padding the $v_0 = 1$). Which of the following hyperplane is the largest-margin separating one for the two examples? The handout suggests visualizing with $\mathbf{v} = (3, 2)$.

1. $x_1 = 0$
2. $x_2 = 0$
3. $v_1x_1 + v_2x_2 = 0$
4. $v_2x_1 + v_1x_2 = 0$

**Answer: 3.** The handout's reason: the largest-margin separating line must be a perpendicular bisector of the line segment between $\mathbf{v}$ and $-\mathbf{v}$, hence $\mathbf{v}$ is a normal vector of that line; the result extends to $\mathbf{v} \in \mathbb{R}^d$.

The handout does not say why it must be the perpendicular bisector, so this article fills that in. Any line that separates the two points has to pass between them. The two points' distances to the line add up to the length of the projection of the segment between them onto the normal direction, which cannot exceed the distance between the two points, $2\lVert\mathbf{v}\rVert$. The smaller of the two distances is the margin, so the margin is at most $\lVert\mathbf{v}\rVert$. To equal $\lVert\mathbf{v}\rVert$ exactly, the line must be perpendicular to the segment (so the projection does not shrink) and pass through the midpoint (so both sides are equally far). The midpoint of these two points is the origin, and the line through the origin perpendicular to $\mathbf{v}$ is $\mathbf{v}^\top\mathbf{x} = v_1x_1 + v_2x_2 = 0$.

Check the four options with $\mathbf{v} = (3, 2)$ (the distance formula is derived in the section "Turning 'fattest' into a solvable problem"; it is used here ahead of time):

| Option | Line | Distance from $\mathbf{v}$ to the line |
|---|---|---|
| 1 | $x_1 = 0$ | $3$ |
| 2 | $x_2 = 0$ | $2$ |
| 3 | $3x_1 + 2x_2 = 0$ | $\frac{9+4}{\sqrt{13}} = \sqrt{13} \approx 3.606$ |
| 4 | $2x_1 + 3x_2 = 0$ | $\frac{6+6}{\sqrt{13}} \approx 3.328$ |

All four lines pass through the origin, and $-\mathbf{v}$ is as far from each line as $\mathbf{v}$ is, so the numbers in the table are the margins. For this $\mathbf{v}$ all four lines separate the two points, and the fattest is option 3, whose margin is exactly $\lVert\mathbf{v}\rVert = \sqrt{13}$. Options 1 and 2 look at only one coordinate; change $\mathbf{v}$ to $(0, 2)$ and option 1's line lies right on top of both points and cannot separate them at all. Option 4 swaps the two components of $\mathbf{v}$, and the resulting normal vector $(v_2, v_1)$ is in general not in the direction of $\mathbf{v}$.

## Turning "fattest" into a solvable problem: distance, scaling, and the standard problem

```youtube
url: https://www.youtube.com/watch?v=lHo9GcIURRs
title: Linear SVM :: Standard Large-Margin Problem @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–02:51 takes the intercept out, 02:51–07:00 derives the distance formula, 07:00–08:55 covers the distance to a separating hyperplane, 08:55–11:51 fixes the scaling, 11:51–16:44 relaxes the constraint, 16:44–18:38 does the final cleanup, and Fun Time follows.)

### First take the intercept out of w

Foundations always pads $\mathbf{x}$ with an $x_0 = 1$ so that the intercept becomes $w_0$ and everything can be written as a single inner product. In the lecture, Lin compares that $x_0$ to a shoe lift tucked underneath. Page 11 of the handout says that when computing distance, $w_0$ and $(w_1, \dots, w_d)$ play different roles (the reason only shows once the formula is derived), so from here on the two are separated:

$$
b = w_0, \qquad \mathbf{w} = \begin{bmatrix} w_1 \\ \vdots \\ w_d \end{bmatrix}, \qquad \mathbf{x} = \begin{bmatrix} x_1 \\ \vdots \\ x_d \end{bmatrix}
$$

$b$ is the bias, that is, the intercept. $\mathbf{w}$ and $\mathbf{x}$ each have one component fewer than before; the handout says to shorten them, and the lecture says they got a little shorter in height. The hypotheses in this lecture and the next few are all written as

$$
h(\mathbf{x}) = \text{sign}(\mathbf{w}^\top\mathbf{x} + b)
$$

### Distance from a point to a hyperplane

Page 12 computes $\text{distance}(\mathbf{x}, b, \mathbf{w})$: the distance from a point $\mathbf{x}$ to the hyperplane $\mathbf{w}^\top\mathbf{x}' + b = 0$. The derivation has three steps.

**Step 1: what points on the hyperplane satisfy.** Take any two points $\mathbf{x}'$ and $\mathbf{x}''$ on the hyperplane. Both satisfy the hyperplane's equation, and rearranging gives

$$
\mathbf{w}^\top\mathbf{x}' = -b, \qquad \mathbf{w}^\top\mathbf{x}'' = -b
$$

**Step 2: w is perpendicular to the hyperplane.** Subtract the two equations:

$$
\mathbf{w}^\top(\mathbf{x}'' - \mathbf{x}') = -b - (-b) = 0
$$

$\mathbf{x}'' - \mathbf{x}'$ is the vector from one point on the hyperplane to another, so it lies entirely on the hyperplane. $\mathbf{x}'$ and $\mathbf{x}''$ were chosen arbitrarily, so the inner product of $\mathbf{w}$ with every vector on the hyperplane is 0; that is, $\mathbf{w}$ is perpendicular to the hyperplane and is its normal vector. In the lecture, Lin remarks that once you have the normal vector, things get easy.

**Step 3: projection.** The distance from the point $\mathbf{x}$ to the hyperplane is the length you get after taking the vector $\mathbf{x} - \mathbf{x}'$ from any point $\mathbf{x}'$ on the hyperplane to $\mathbf{x}$ and projecting it onto the direction perpendicular to the hyperplane. The perpendicular direction is $\mathbf{w}$; projecting onto a direction means taking the inner product with the unit vector in that direction, $\mathbf{w}/\lVert\mathbf{w}\rVert$, and then the absolute value:

$$
\text{distance}(\mathbf{x}, b, \mathbf{w}) = \left|\frac{\mathbf{w}^\top}{\lVert\mathbf{w}\rVert}(\mathbf{x} - \mathbf{x}')\right| = \frac{1}{\lVert\mathbf{w}\rVert}\left|\mathbf{w}^\top\mathbf{x} - \mathbf{w}^\top\mathbf{x}'\right| = \frac{1}{\lVert\mathbf{w}\rVert}\left|\mathbf{w}^\top\mathbf{x} + b\right|
$$

The last equality uses $\mathbf{w}^\top\mathbf{x}' = -b$ from step 1. There is no $\mathbf{x}'$ in the result, so it does not matter which point on the hyperplane you pick.

The formula reads: compute the original score $\mathbf{w}^\top\mathbf{x} + b$, take its absolute value, and divide by the length of $\mathbf{w}$. The denominator has only $\lVert\mathbf{w}\rVert$ and no $b$. In the lecture, Lin points out that this is the reason for separating $b$ from $\mathbf{w}$: the distance needs only the length of $\mathbf{w}$, not the size of $b$; if $w_0$ were still packed inside $\mathbf{w}$, the length would come out wrong.

### A separating hyperplane lets you drop the absolute value

We only care about hyperplanes that classify the data correctly. Page 13 uses this property to remove the absolute value. A separating hyperplane has, for every $n$,

$$
y_n(\mathbf{w}^\top\mathbf{x}_n + b) > 0
$$

$y_n$ is $+1$ or $-1$ and has the same sign as the score, so $y_n$ times the score is exactly the absolute value of the score:

$$
\text{distance}(\mathbf{x}_n, b, \mathbf{w}) = \frac{1}{\lVert\mathbf{w}\rVert}\,y_n(\mathbf{w}^\top\mathbf{x}_n + b)
$$

Substitute it back into the optimization problem and distance is no longer just a name:

$$
\begin{aligned}
\max_{b,\mathbf{w}}\quad & \text{margin}(b, \mathbf{w}) \\
\text{subject to}\quad & \text{every } y_n(\mathbf{w}^\top\mathbf{x}_n + b) > 0 \\
& \text{margin}(b, \mathbf{w}) = \min_{n=1,\dots,N} \frac{1}{\lVert\mathbf{w}\rVert}\,y_n(\mathbf{w}^\top\mathbf{x}_n + b)
\end{aligned}
$$

At this point in the lecture Lin asks: can we solve it now? Apparently not yet; it needs more simplifying.

### Fixing the scaling: make the nearest point equal exactly 1

The observation on page 14 is that the same hyperplane can be written in many ways. $\mathbf{w}^\top\mathbf{x} + b = 0$ and $3\mathbf{w}^\top\mathbf{x} + 3b = 0$ are the same hyperplane; the handout writes scaling does not matter. In the lecture, Lin puts it this way: there are not really that many lines in the world, the pairs $(b, \mathbf{w})$ are all over the place, and many of them are just the same line scaled up or down. Since scaling does not change the line, pick the scaling that makes the formulas easiest to write: consider only the $(b, \mathbf{w})$ that satisfy

$$
\min_{n=1,\dots,N} y_n(\mathbf{w}^\top\mathbf{x}_n + b) = 1
$$

An addition in this article: why this choice does not leave out any line. For any $(b, \mathbf{w})$ that separates the data, $m = \min_n y_n(\mathbf{w}^\top\mathbf{x}_n + b)$ is a positive number. Divide both $b$ and $\mathbf{w}$ by $m$: the hyperplane is unchanged, and the new minimum is $m/m = 1$. So every separating hyperplane has exactly one way of being written that fits this scaling.

Under this scaling the margin formula becomes very simple. $\frac{1}{\lVert\mathbf{w}\rVert}$ does not depend on $n$, so it can be pulled outside the min:

$$
\text{margin}(b, \mathbf{w}) = \frac{1}{\lVert\mathbf{w}\rVert}\min_{n} y_n(\mathbf{w}^\top\mathbf{x}_n + b) = \frac{1}{\lVert\mathbf{w}\rVert} \times 1 = \frac{1}{\lVert\mathbf{w}\rVert}
$$

There is a side benefit too. If the smallest one equals 1, every $y_n(\mathbf{w}^\top\mathbf{x}_n + b)$ is certainly greater than 0, so the original "correct" constraint no longer needs to be written; in the lecture, Lin says writing it would be pointless. The problem becomes

$$
\max_{b,\mathbf{w}}\ \frac{1}{\lVert\mathbf{w}\rVert} \qquad \text{subject to} \quad \min_{n=1,\dots,N} y_n(\mathbf{w}^\top\mathbf{x}_n + b) = 1
$$

### Relaxing the constraint: from "the smallest equals 1" to "every one is at least 1"

The constraint still contains a min. In the lecture, Lin says maximizing on the outside is annoying enough, and now a minimization pops up inside, which is hard to handle. Page 15 relaxes the constraint to a necessary condition of it:

$$
y_n(\mathbf{w}^\top\mathbf{x}_n + b) \ge 1 \quad \text{for all } n
$$

If the smallest equals 1, every one is certainly at least 1, so any $(b, \mathbf{w})$ that was feasible before is still feasible under the new constraint. The converse does not always hold: every one being at least 1 does not guarantee that some one equals exactly 1. In the lecture, Lin says this is a necessary condition but not a sufficient one, and illustrates it with a sketch: the original constraint encloses a small region, and after relaxing we get a large region that contains it. Relax a constraint carelessly and the optimal solution may move outside the small region, which changes the answer. What has to be proved is that the optimal solution found in the large region still lies in the small region.

The handout argues by contradiction. Suppose the optimal solution $(b, \mathbf{w})$ of the relaxed problem lies outside the small region, that is, every point is strictly greater than 1. The number the handout uses is

$$
y_n(\mathbf{w}^\top\mathbf{x}_n + b) > 1.126 \quad \text{for all } n
$$

Then divide both $b$ and $\mathbf{w}$ by 1.126 and look at the new pair $\left(\frac{b}{1.126}, \frac{\mathbf{w}}{1.126}\right)$:

- It is still feasible: $y_n\left(\frac{\mathbf{w}^\top\mathbf{x}_n + b}{1.126}\right) > \frac{1.126}{1.126} = 1$.
- Its objective value is larger: $\mathbf{w}$ got shorter, and $\frac{1}{\lVert\mathbf{w}/1.126\rVert} = \frac{1.126}{\lVert\mathbf{w}\rVert} > \frac{1}{\lVert\mathbf{w}\rVert}$.

We have found a feasible solution that is better, which contradicts "$(b, \mathbf{w})$ is optimal". There is nothing special about 1.126; the argument is the same for any number greater than 1. So the optimal solution of the relaxed problem must have some point that equals exactly 1, and it lies in the small region. Every solution in the small region is also in the large region, and since the champion of the large region lies in the small region, it is the champion of the small region as well. Relaxing did not change the answer.

### Final cleanup: max becomes min

At the end of page 15 come three adjustments that do not change the optimal solution, which the handout writes on one line as "max ⟹ min, remove √, add ½":

1. **Maximizing $\frac{1}{\lVert\mathbf{w}\rVert}$ becomes minimizing $\lVert\mathbf{w}\rVert$.** The larger a positive number is, the smaller its reciprocal. The reason given in the lecture is that the gradient descent in Foundations was always about minimizing, so switching to minimization is closer to the familiar form.
2. **Remove the square root.** $\lVert\mathbf{w}\rVert = \sqrt{\mathbf{w}^\top\mathbf{w}}$, and minimizing the length is the same as minimizing the squared length, so minimize $\mathbf{w}^\top\mathbf{w}$ instead.
3. **Multiply by $\frac{1}{2}$ in front.** Minimizing a quantity and minimizing half of it have the same optimal solution. The lecture only says the reason will show up later. An addition in this article: when [Techniques Lecture 2](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm-en) takes the partial derivative with respect to $\mathbf{w}$, this $\frac{1}{2}$ cancels the 2 that comes from differentiating the square; it also matches the $\frac{1}{2}\mathbf{u}^\top Q\mathbf{u}$ in the standard form of QP.

The result is what the handout calls the standard problem:

$$
\begin{aligned}
\min_{b,\mathbf{w}}\quad & \frac{1}{2}\mathbf{w}^\top\mathbf{w} \\
\text{subject to}\quad & y_n(\mathbf{w}^\top\mathbf{x}_n + b) \ge 1 \quad \text{for all } n
\end{aligned}
$$

The $(b, \mathbf{w})$ that solves this problem is the fattest separating hyperplane, and its margin is $1/\lVert\mathbf{w}\rVert$. The summary on page 28 of the handout wraps this section up in one phrase: minimize 'length of w' at special separating scale.

### Fun Time: three points and a given line

**Question (handout page 16):** Consider three examples $(\mathbf{x}_1, +1)$, $(\mathbf{x}_2, +1)$, $(\mathbf{x}_3, -1)$, where $\mathbf{x}_1 = (3, 0)$, $\mathbf{x}_2 = (0, 4)$, $\mathbf{x}_3 = (0, 0)$. In addition, consider a hyperplane $x_1 + x_2 = 1$. Which of the following is **not true**?

1. the hyperplane is a separating one for the three examples
2. the distance from the hyperplane to $\mathbf{x}_1$ is $2$
3. the distance from the hyperplane to $\mathbf{x}_3$ is $\frac{1}{\sqrt{2}}$
4. the example that is closest to the hyperplane is $\mathbf{x}_3$

**Answer: 2.** Write the hyperplane as $\mathbf{w} = (1, 1)$, $b = -1$, with $\lVert\mathbf{w}\rVert = \sqrt{2}$. Point by point:

| Point | $y_n$ | Score $\mathbf{w}^\top\mathbf{x}_n + b$ | $y_n \times$ score | Distance |
|---|---|---|---|---|
| $\mathbf{x}_1 = (3, 0)$ | $+1$ | $3 + 0 - 1 = 2$ | $2$ | $\frac{2}{\sqrt{2}} = \sqrt{2} \approx 1.414$ |
| $\mathbf{x}_2 = (0, 4)$ | $+1$ | $0 + 4 - 1 = 3$ | $3$ | $\frac{3}{\sqrt{2}} \approx 2.121$ |
| $\mathbf{x}_3 = (0, 0)$ | $-1$ | $-1$ | $1$ | $\frac{1}{\sqrt{2}} \approx 0.707$ |

The fourth column is all positive, so all three are classified correctly and option 1 is true. The distance of $\mathbf{x}_3$ is $\frac{1}{\sqrt{2}}$, and it is the smallest of the three, so options 3 and 4 are true. The distance of $\mathbf{x}_1$ is $\sqrt{2}$; option 2 writes 2, which forgets to divide by $\lVert\mathbf{w}\rVert$ and takes the score itself as the distance. The handout's reference answer lists only the computation $\frac{1}{\sqrt{2}}(3 + 0 - 1) = \sqrt{2}$, and the lecture likewise only says the distance should be $\sqrt{2}$ rather than 2; "forgot to divide by the length" is this article's reading of the wrong option.

An addition in this article: this line classifies the data correctly, but it is not the fattest. Its margin is $\frac{1}{\sqrt{2}} \approx 0.707$. Solve the standard problem for these three points: the constraints are $3w_1 + b \ge 1$, $4w_2 + b \ge 1$, and $-b \ge 1$. Adding the first and the third gives $w_1 \ge \frac{2}{3}$, and adding the second and the third gives $w_2 \ge \frac{1}{2}$, so $\frac{1}{2}\mathbf{w}^\top\mathbf{w} \ge \frac{1}{2}\left(\frac{4}{9} + \frac{1}{4}\right) = \frac{25}{72}$. Taking $\mathbf{w} = \left(\frac{2}{3}, \frac{1}{2}\right)$, $b = -1$ makes all three equal exactly 1, so it is the optimal solution, and the margin is $\frac{1}{\lVert\mathbf{w}\rVert} = \frac{6}{5} = 1.2$. The fattest line is $4x_1 + 3x_2 = 6$, and all three points are at distance 1.2 from it.

## Four points by hand, then over to quadratic programming

```youtube
url: https://www.youtube.com/watch?v=FAm70y081o4
title: Linear SVM :: Support Vector Machine @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–03:53 solves four points by hand, 03:53–06:10 covers support vectors, 06:10–07:53 covers quadratic programming, 07:53–13:59 maps to the solver's inputs, 13:59–14:58 wraps it into an algorithm, and Fun Time follows.)

### Numerical example: the handout's four points

Page 17 of the handout solves the standard problem from start to finish on a small data set. The data are four points in two dimensions:

| $n$ | $\mathbf{x}_n$ | $y_n$ |
|---|---|---|
| 1 | $(0, 0)$ | $-1$ |
| 2 | $(2, 2)$ | $-1$ |
| 3 | $(2, 0)$ | $+1$ |
| 4 | $(3, 0)$ | $+1$ |

**Step 1: one constraint per point.** Substitute each point into $y_n(w_1x_{n,1} + w_2x_{n,2} + b) \ge 1$:

$$
\begin{aligned}
-b &\ge 1 && \text{(i)} \\
-2w_1 - 2w_2 - b &\ge 1 && \text{(ii)} \\
2w_1 + b &\ge 1 && \text{(iii)} \\
3w_1 + b &\ge 1 && \text{(iv)}
\end{aligned}
$$

**Step 2: add constraints in pairs to eliminate b.** The left sides of (i) and (iii) add up to $2w_1$ and the right sides add up to 2, so $w_1 \ge 1$. Adding (ii) and (iii) cancels both $2w_1$ and $b$, leaving $-2w_2 \ge 2$, so $w_2 \le -1$. In the lecture, Lin calls these two necessary conditions: if all four original constraints hold, these two must hold.

**Step 3: get a lower bound on the objective.** $w_1 \ge 1$ means $w_1^2 \ge 1$; $w_2 \le -1$ means $w_2^2 \ge 1$. So

$$
\frac{1}{2}\mathbf{w}^\top\mathbf{w} = \frac{1}{2}(w_1^2 + w_2^2) \ge \frac{1}{2}(1 + 1) = 1
$$

No feasible solution has an objective value below 1.

**Step 4: find a feasible solution that reaches the lower bound exactly.** For the objective value to equal 1, the only choice is $w_1 = 1$, $w_2 = -1$. Substitute them back into the four constraints to see the range of $b$: (i) requires $b \le -1$; (ii) is $-2 + 2 - b \ge 1$, again $b \le -1$; (iii) is $2 + b \ge 1$, requiring $b \ge -1$; (iv) is $3 + b \ge 1$, requiring $b \ge -2$. The only value for which all four hold is $b = -1$. The handout writes only the conclusion "$(w_1 = 1, w_2 = -1, b = -1)$ at lower bound and satisfies (i)–(iv)"; the ranges of $b$ in between are filled in by this article.

The objective value reaches the lower bound and all four constraints are satisfied, so this is the optimal solution. The classifier is

$$
g_{\text{SVM}}(\mathbf{x}) = \text{sign}(x_1 - x_2 - 1)
$$

**What this result means.** Page 18 computes the margin:

$$
\text{margin}(b, \mathbf{w}) = \frac{1}{\lVert\mathbf{w}\rVert} = \frac{1}{\sqrt{1^2 + (-1)^2}} = \frac{1}{\sqrt{2}} \approx 0.707
$$

Checking point by point, the first three points have $y_n(\mathbf{w}^\top\mathbf{x}_n + b)$ equal to exactly 1 and are at distance 0.707 from the line; point 4 gives $3 - 0 - 1 = 2$, at distance 1.414. The line $x_1 - x_2 - 1 = 0$ grows 0.707 on each side and just touches the first three points.

This article compares it with two more lines that also classify the four points correctly; the numbers are computed for this article and are not on the handout:

| Line | $\mathbf{w}$, $b$ | $y_n(\mathbf{w}^\top\mathbf{x}_n + b)$ for the four points | $\frac{1}{2}\mathbf{w}^\top\mathbf{w}$ | margin |
|---|---|---|---|---|
| $x_1 - x_2 - 1 = 0$ | $(1, -1)$, $-1$ | $1, 1, 1, 2$ | $1$ | $\frac{1}{\sqrt{2}} \approx 0.707$ |
| $x_1 - 2x_2 - 1 = 0$ | $(1, -2)$, $-1$ | $1, 3, 1, 2$ | $2.5$ | $\frac{1}{\sqrt{5}} \approx 0.447$ |
| $2x_1 - x_2 - 3 = 0$ | $(2, -1)$, $-3$ | $3, 1, 1, 3$ | $2.5$ | $\frac{1}{\sqrt{5}} \approx 0.447$ |

All three are written so that the minimum is 1, matching the scaling chosen earlier, so $\frac{1}{2}\mathbf{w}^\top\mathbf{w}$ can be compared directly: the smaller, the fatter. The last two lines are feasible, but their objective value is 2.5 and their margin is only 0.447.

The benefit of fatness also shows up on this data set. Suppose a test point $(2, 0.6)$ arrives. It is only 0.6 away from the training point $(2, 0)$, so by "very close means the same class" it should be a positive example. The fattest line gives it the score $2 - 0.6 - 1 = 0.4 > 0$ and calls it positive. The second line gives $2 - 1.2 - 1 = -0.2 < 0$ and calls it negative. An error of 0.6 is smaller than 0.707 and larger than 0.447, so the former holds up and the latter does not.

### Support vectors: only the points on the boundary decide the line

In the picture on page 18, the three points $(0,0)$, $(2,2)$, and $(2,0)$ are boxed; they sit exactly on the edge of the gray fat boundary. $(3,0)$ is not boxed. The handout's observations are:

- examples on the boundary "locate" the fattest hyperplane;
- the other examples are not needed.

In the lecture, Lin explains that if you erase the points that are farther away, pretend you never saw them, and look for the fattest line again with the remaining points, you find the same line. This article checks that: after removing $(3, 0)$, constraint (iv) is gone, none of the four steps above needs changing, and the answer is still $(1, -1, -1)$. Conversely, remove the boundary point $(2, 2)$: constraint (ii) disappears, the requirement $w_2 \le -1$ disappears with it, and the optimal solution becomes $\mathbf{w} = (1, 0)$, $b = -1$, the line $x_1 = 1$, with margin 1. Move a point on the boundary and the line moves with it.

The handout calls a boundary example a support vector, followed in small print by "(candidate)". The explanation in the lecture is that these points hold up that fat hyperplane; for now they are only candidates for support vectors, and a precise definition comes later. That definition is in [Techniques Lecture 2](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm-en). This is where the name SVM comes from:

> support vector machine (SVM): learn fattest hyperplanes (with help of support vectors)

### The general case: this is a quadratic programming problem

Four points can be forced through by hand, but that stops working once there is more data. Page 19 lists two roads that do not work: doing it manually is not easy, of course; gradient descent is not easy either, because of the constraints. In the lecture, Lin puts it this way: now you cannot roll freely down into the valley, because some places are off limits.

The good news is that this problem has two properties:

- the objective function $\frac{1}{2}\mathbf{w}^\top\mathbf{w}$ is a convex quadratic function of $(b, \mathbf{w})$;
- the constraints $y_n(\mathbf{w}^\top\mathbf{x}_n + b) \ge 1$ are linear in $(b, \mathbf{w})$.

An optimization problem with these two properties is called quadratic programming (QP). In the lecture, Lin says you can think of it as the advanced version of linear programming; people who study numerical optimization understand it thoroughly, and ready-made tools exist. The handout says QP is an "easy" optimization problem. The remaining work is to write SVM in the standard form of QP and hand the coefficients to a tool.

### Mapping to the four inputs of a QP solver

Page 20 puts the two problems side by side. The QP solver $\text{QP}(Q, \mathbf{p}, A, \mathbf{c})$ solves

$$
\begin{aligned}
\min_{\mathbf{u}}\quad & \frac{1}{2}\mathbf{u}^\top Q\mathbf{u} + \mathbf{p}^\top\mathbf{u} \\
\text{subject to}\quad & \mathbf{a}_m^\top\mathbf{u} \ge c_m, \quad m = 1, 2, \dots, M
\end{aligned}
$$

$\mathbf{u}$ is the variable to solve for; $Q$ holds the coefficients of the quadratic terms and $\mathbf{p}$ the coefficients of the linear terms; each constraint has a set of coefficients $\mathbf{a}_m$ and a constant $c_m$, and stacking all the $\mathbf{a}_m^\top$ gives the matrix $A$ while stacking all the $c_m$ gives the vector $\mathbf{c}$. Match them item by item:

**Variables.** We solve for $b$ and $\mathbf{w}$, all packed into $\mathbf{u}$, with $d + 1$ components in total:

$$
\mathbf{u} = \begin{bmatrix} b \\ \mathbf{w} \end{bmatrix}
$$

**Quadratic term.** The objective function is $\frac{1}{2}\mathbf{w}^\top\mathbf{w}$, which contains only $\mathbf{w}$ and no $b$. In the lecture, Lin explains that we do not care about the part involving $b$, and not caring means a coefficient of 0; $\mathbf{w}$ is multiplied by itself, so the corresponding block is the identity matrix:

$$
Q = \begin{bmatrix} 0 & \mathbf{0}_d^\top \\ \mathbf{0}_d & \mathrm{I}_d \end{bmatrix}
$$

Check: $\mathbf{u}^\top Q\mathbf{u} = 0 \cdot b^2 + \mathbf{w}^\top\mathrm{I}_d\mathbf{w} = \mathbf{w}^\top\mathbf{w}$.

**Linear term.** The objective function has no linear term in $b$ or $\mathbf{w}$, so $\mathbf{p} = \mathbf{0}_{d+1}$.

**Constraints.** SVM has $N$ of them, so $M = N$. The constants on the right are all 1, so $c_n = 1$. The left side has to be written as the inner product of some vector with $\mathbf{u}$. Expand $y_n(\mathbf{w}^\top\mathbf{x}_n + b)$ into $y_n \cdot b + y_n\mathbf{x}_n^\top\mathbf{w}$: what multiplies $b$ is $y_n$, and what multiplies $\mathbf{w}$ is $y_n\mathbf{x}_n$. So

$$
\mathbf{a}_n^\top = y_n\begin{bmatrix} 1 & \mathbf{x}_n^\top \end{bmatrix}
$$

The first entry is $y_n$, and the next $d$ entries are $y_n\mathbf{x}_n^\top$.

With the mapping done, Lin says in the lecture that only one step is left: call the solver. The box on the handout reads: SVM with general QP solver: easy if you've read the manual. The lecture mentions that Matlab and plenty of other software come with a built-in QP tool, but you have to read the manual yourself for the details, the way you read the instructions for a new household appliance: the constraints here are written with "≥", some tools want you to feed them the "≤" form, and then the coefficients have to change sign; when there are equality constraints or other kinds of constraints, they may also have to be fed in some other way.

### The Linear Hard-Margin SVM Algorithm

Page 21 wraps the procedure into three steps:

1. Compute $Q = \begin{bmatrix} 0 & \mathbf{0}_d^\top \\ \mathbf{0}_d & \mathrm{I}_d \end{bmatrix}$, $\mathbf{p} = \mathbf{0}_{d+1}$, $\mathbf{a}_n^\top = y_n\begin{bmatrix} 1 & \mathbf{x}_n^\top \end{bmatrix}$, $c_n = 1$.
2. Call $\begin{bmatrix} b \\ \mathbf{w} \end{bmatrix} \leftarrow \text{QP}(Q, \mathbf{p}, A, \mathbf{c})$.
3. Return $b$ and $\mathbf{w}$ as $g_{\text{SVM}}$.

Each of the two adjectives in the name means something. **Hard-margin**: the handout writes nothing violate 'fat boundary', meaning no point may violate the fat boundary; in the lecture, Lin says this means insisting that circles and crosses be completely separated, with no mistake allowed. When the data are not linearly separable this QP has no feasible solution, and relaxing this requirement is the job of [Techniques Lecture 4: Soft-Margin SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-04-soft-margin-svm-en). **Linear**: it uses the original $\mathbf{x}_n$ and looks for a hyperplane in the $\mathbf{x}$ space.

What if you want a non-linear boundary? The handout's hint is "$\mathbf{z}_n = \boldsymbol{\Phi}(\mathbf{x}_n)$—remember? :-)". Following Foundations Lecture 12, first transform $\mathbf{x}_n$ into $\mathbf{z}_n$, then run the same algorithm on $\mathbf{z}_n$.

### Fun Time: the a to feed the solver for the four points

**Question (handout page 22):** Use the four points from page 17 again: two negative examples with $\mathbf{x}_1 = (0, 0)$ and $\mathbf{x}_2 = (2, 2)$; two positive examples with $\mathbf{x}_3 = (2, 0)$ and $\mathbf{x}_4 = (3, 0)$. Define $\mathbf{u}$, $Q$, $\mathbf{p}$, $c_n$ as those listed on page 20. What are the $\mathbf{a}_n^\top$ that need to be fed into the QP solver?

1. $\mathbf{a}_1^\top = [-1, 0, 0]$, $\mathbf{a}_2^\top = [-1, 2, 2]$, $\mathbf{a}_3^\top = [-1, 2, 0]$, $\mathbf{a}_4^\top = [-1, 3, 0]$
2. $\mathbf{a}_1^\top = [1, 0, 0]$, $\mathbf{a}_2^\top = [1, -2, -2]$, $\mathbf{a}_3^\top = [-1, 2, 0]$, $\mathbf{a}_4^\top = [-1, 3, 0]$
3. $\mathbf{a}_1^\top = [1, 0, 0]$, $\mathbf{a}_2^\top = [1, 2, 2]$, $\mathbf{a}_3^\top = [1, 2, 0]$, $\mathbf{a}_4^\top = [1, 3, 0]$
4. $\mathbf{a}_1^\top = [-1, 0, 0]$, $\mathbf{a}_2^\top = [-1, -2, -2]$, $\mathbf{a}_3^\top = [1, 2, 0]$, $\mathbf{a}_4^\top = [1, 3, 0]$

**Answer: 4.** The handout's reference answer is one line: $\mathbf{a}_n^\top = y_n\begin{bmatrix} 1 & \mathbf{x}_n^\top \end{bmatrix}$. Following it:

- $\mathbf{a}_1^\top = (-1)[1, 0, 0] = [-1, 0, 0]$
- $\mathbf{a}_2^\top = (-1)[1, 2, 2] = [-1, -2, -2]$
- $\mathbf{a}_3^\top = (+1)[1, 2, 0] = [1, 2, 0]$
- $\mathbf{a}_4^\top = (+1)[1, 3, 0] = [1, 3, 0]$

Each row times $\mathbf{u} = (b, w_1, w_2)$ is one of the constraints (i) to (iv) above; the second row, for example, is $-b - 2w_1 - 2w_2 \ge 1$. Substitute the hand-computed optimal solution $\mathbf{u} = (-1, 1, -1)$ and the four rows give $1, 1, 1, 2$, all at least 1; $\frac{1}{2}\mathbf{u}^\top Q\mathbf{u} = \frac{1}{2}(1 + 1) = 1$, which agrees with the objective value computed by hand. This article also handed this $Q$, $\mathbf{p}$, $A$, $\mathbf{c}$ to a numerical optimization program, which likewise returned $(b, w_1, w_2) = (-1, 1, -1)$.

Each of the other options is wrong in one place. Option 3 is $[1, \mathbf{x}_n^\top]$, which forgets to multiply by $y_n$. Option 1 is $[-1, \mathbf{x}_n^\top]$: the first entry is $-1$ everywhere and the rest is not multiplied by $y_n$. Option 2 is $[-y_n, y_n\mathbf{x}_n^\top]$: the $\mathbf{x}_n$ part is right, but the sign of the coefficient of $b$ is flipped.

## Why fatness helps: two explanations, regularization and the VC dimension

```youtube
url: https://www.youtube.com/watch?v=7UUO_AamxcA
title: Linear SVM :: Reasons behind Large-Margin Hyperplane @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–02:08 looks at it through regularization, 02:08–05:29 shows that a large margin restricts dichotomies, 05:29–09:26 covers the VC dimension of an algorithm, 09:26–11:10 pairs it with feature transforms, 11:10–11:55 is Fun Time, and the summary follows.)

The formulas in this section are written with $\mathbf{z}_n$ (handout page 23), a reminder that the method works just the same in the transformed space. Measurement error was used earlier to explain why to be fat, and that was an intuitive account. This section adds two explanations that connect to the theory in Foundations.

### Explanation one: SVM is weight decay within E_in equal to 0

Put the regularization of [Foundations Lecture 14](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization-en) next to the standard SVM problem (page 23):

| | minimize | constraint |
|---|---|---|
| regularization | $E_{\text{in}}$ | $\mathbf{w}^\top\mathbf{w} \le C$ |
| SVM | $\mathbf{w}^\top\mathbf{w}$ | $E_{\text{in}} = 0$ [and more] |

Regularization wants to push $E_{\text{in}}$ down but fears overfitting, so it constrains the length of $\mathbf{w}$ and allows only the $\mathbf{w}$ in a small region. SVM swaps the two roles: what it minimizes is the length of $\mathbf{w}$, and the constraint is classifying all the data correctly. In the lecture, Lin says the two are doing two sides of the same thing: the object being minimized and the constraint trade places, but both try to take care of these two concerns at once.

The "and more" in the table means SVM's constraint is stricter than $E_{\text{in}} = 0$. Classifying correctly only needs $y_n(\mathbf{w}^\top\mathbf{z}_n + b) > 0$, and SVM requires $\ge 1$. The handout's conclusion: SVM (large-margin hyperplane) is weight-decay regularization within $E_{\text{in}} = 0$.

### Explanation two: insisting on fatness leaves fewer dichotomies

The second explanation goes back to VC theory. [Foundations Lecture 5](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en) uses dichotomies to count the complexity of a hypothesis set: given $N$ points, how many different circle-and-cross patterns can be produced. Being able to produce all $2^N$ is called shattering.

Page 24 defines a "large-margin algorithm" $\mathcal{A}_\rho$: if a separating hyperplane $g$ with margin at least $\rho$ exists, return it; otherwise return 0, that is, give no answer. The lecture's analogy is looking for a partner: this algorithm likes them as fat as possible; if the data offer one that is fat enough, it picks that one, and if none is fat enough, it would rather stay single for life.

- **$\mathcal{A}_0$**: does not care about fatness, just like PLA. For 3 points in general position in the plane, all 8 labelings can be produced, so they can be shattered. The handout's picture draws 4 of them, and the lecture explains that the other 4 are their symmetric counterparts.
- **$\mathcal{A}_{1.126}$**: requires the line to be at least 1.126 fat. The handout says this is more strict than SVM; SVM only looks for the fattest and does not prescribe a minimum fatness. For the same 3 points in the picture, a fat enough line can be found when all are labeled circles; but in some labelings a circle and a cross are too close for a line that fat to fit between them, and $\mathcal{A}_{1.126}$ cannot produce them. So these 3 points cannot be shattered.

Fewer producible dichotomies means lower complexity. The handout writes this chain of reasoning as:

> fewer dichotomies ⟹ smaller 'VC dim.' ⟹ better generalization

"VC dim." is in quotation marks. In the lecture, Lin explains that this is not a VC dimension derived from the Foundations definition; you can think of it as an effective VC dimension, and the lower it is, the closer $E_{\text{in}}$ and $E_{\text{out}}$ are.

### The VC dimension of an algorithm: the example on the unit circle

Page 25 explains the quotation marks. The $d_{\text{VC}}(\mathcal{H})$ of Foundations is a property of the hypothesis set and is data-independent. The $d_{\text{VC}}(\mathcal{A}_\rho)$ discussed here is a property of the algorithm: whether $\mathcal{A}_\rho$ can produce a given dichotomy depends on whether a fat enough line can be found on this particular data, so it is data-dependent. The handout notes that this needs more than VC. In the lecture, Lin says the rigorous derivation of this part takes more effort and that only the concept is covered here: see how many points this algorithm can shatter at most.

The setting in the handout is $\mathcal{X}$ being the unit circle in $\mathbb{R}^2$. The lecture talks about any three points inside the circle, and the picture on the slide is a filled circle, so what is meant here is the disk of radius 1.

- $\rho = 0$: just perceptrons, $d_{\text{VC}} = 3$.
- $\rho > \frac{\sqrt{3}}{2}$: cannot shatter any 3 inputs, $d_{\text{VC}} < 3$. The reason the handout gives: some two of the inputs must be at distance at most $\sqrt{3}$.

The handout gives this reason in a single line, and this article completes it.

**Why some two points must be at distance at most √3.** If one of the three points is at the center, its distance to each of the other two is at most 1. Otherwise, the three points are seen from the center in three directions, the three directions go around a full 360 degrees, and some two of them must form an angle $\theta$ of at most 120 degrees. Those two points are at distances $r_1$ and $r_2$ from the center, both at most 1. By the law of cosines, $\cos\theta \ge -\frac{1}{2}$, so their squared distance is

$$
r_1^2 + r_2^2 - 2r_1r_2\cos\theta \ \le\ r_1^2 + r_2^2 + r_1r_2 \ \le\ 3
$$

**Why that rules out shattering.** Label one of these two points a circle and the other a cross. The separating line has to pass between the two points, and their distances to the line add up to no more than the distance between them, $\sqrt{3}$ (the same argument as in the Fun Time on "the fattest separating line for two points"). The nearer of the two is then at distance at most $\frac{\sqrt{3}}{2}$ from the line, so the margin is at most $\frac{\sqrt{3}}{2}$ as well. When $\rho$ is greater than this number, $\mathcal{A}_\rho$ cannot find a line that qualifies, and this labeling cannot be produced. With at least one of the 8 labelings missing, it is not shattering.

**Applied to a concrete set of points (an example made up for this article, not from the slides).** Take the equilateral triangle inscribed in the unit circle: $(0, 1)$, $\left(-\frac{\sqrt{3}}{2}, -\frac{1}{2}\right)$, $\left(\frac{\sqrt{3}}{2}, -\frac{1}{2}\right)$, with every side of length $\sqrt{3}$. Label the top point a circle and the bottom two crosses, and the fattest separating line is the horizontal line $x_2 = \frac{1}{4}$: the top point is at height 1, the bottom two at height $-\frac{1}{2}$, they are 1.5 apart, the line sits right in the middle, and the margin is 0.75. By symmetry the other five one-against-two labelings also give 0.75; when the three points all get the same label, the line can be placed far away and the margin can be as large as you like. So for these three points, $\mathcal{A}_\rho$ with $\rho \le 0.75$ can shatter them and with $\rho > 0.75$ it cannot. The handout's threshold $\frac{\sqrt{3}}{2} \approx 0.866$ is larger than 0.75; it is a sufficient condition guaranteed to hold for any three points in the disk.

The handout then gives the general result: when $\mathcal{X}$ lies inside a hyperball of radius $R$,

$$
d_{\text{VC}}(\mathcal{A}_\rho) \le \min\left(\frac{R^2}{\rho^2},\ d\right) + 1 \ \le\ \underbrace{d + 1}_{d_{\text{VC}}(\text{perceptrons})}
$$

The handout does not prove this formula, and neither does this article. It says two things. First, the upper bound depends on two quantities: the range $R$ over which the data spread, and the required fatness $\rho$. In the lecture, Lin explains that a bigger circle has room for a fatter line, and data squeezed into a small range do not. Second, whatever happens, it is never worse than the $d + 1$ of ordinary perceptrons; when $\rho$ is large enough, the $\frac{R^2}{\rho^2}$ term is smaller than $d$ and the upper bound really does come down. The lecture sums it up as: one more way to control complexity.

An addition in this article, about something to watch for when reading this formula that the handout does not mention. When $\frac{R^2}{\rho^2}$ is not an integer, plugging in literally gives a number with a fractional part. Check it against the equilateral triangle above: with $R = 1$, $\rho = 0.75$, $d = 2$, $\min\left(\frac{16}{9},\ 2\right) + 1 = \frac{25}{9} \approx 2.78$, which read literally says at most 2 points can be shattered. Yet those three points all lie in the disk of radius 1 and really can be shattered by $\mathcal{A}_{0.75}$: the six one-against-two labelings all have margin 0.75, and the two all-same labelings have unlimited margin. So when $\frac{R^2}{\rho^2}$ is not an integer, this formula cannot be read literally as an exact upper bound; what it conveys is the trend that the larger $\rho$ is relative to $R$, the fewer points can be shattered. The two numbers this lecture actually uses are not affected: that 3 points cannot be shattered when $\rho > \frac{\sqrt{3}}{2}$ was proved above directly from the distance between two points, without this formula; and in the Fun Time, $\frac{R^2}{\rho^2} = 16$ happens to be an integer.

### Paired with feature transforms: not many boundaries, yet sophisticated shapes

Page 26 closes with a table:

| | large-margin hyperplanes | hyperplanes | hyperplanes + feature transform Φ |
|---|---|---|---|
| number of boundaries that can be produced (#) | even fewer | not many | many |
| shape of the boundary | simple | simple | sophisticated |

The handout's two comments: not many is good, for $d_{\text{VC}}$ and generalization; sophisticated is also good, for a possibly better $E_{\text{in}}$. The lecture looks back at what Foundations did: hyperplanes were used in the first place because their $d_{\text{VC}}$ is not large and the complexity stays under control; but a boundary that is too simple may not do well, which is why feature transforms were added to buy sophisticated boundaries. We want to take care of both terms of the VC bound, but the original tools could take care of only one at a time.

A large margin offers a new combination. Put large-margin hyperplanes together with numerous feature transforms:

| | large-margin hyperplanes + numerous feature transform Φ |
|---|---|
| number of boundaries that can be produced (#) | not many |
| shape of the boundary | sophisticated |

The feature transform pushes the number up to "many", and the large margin pulls it back to "not many" while keeping the sophisticated shape. The handout calls this a new possibility: non-linear SVM. In the lecture, Lin says that with this new way of controlling complexity, you can use all kinds of feature transforms with more peace of mind. This is exactly what the first technique in Course Design sets out to do: exploit numerous features while keeping complexity in check.

### Fun Time: the upper bound in a 1126-dimensional space

**Question (handout page 27):** Consider running the large-margin algorithm $\mathcal{A}_\rho$ with $\rho = \frac{1}{4}$ on a $\mathcal{Z}$-space such that $\mathbf{z} = \boldsymbol{\Phi}(\mathbf{x})$ is of 1126 dimensions (excluding $z_0$) and $\lVert\mathbf{z}\rVert \le 1$. What is the upper bound of $d_{\text{VC}}(\mathcal{A}_\rho)$ when calculated by $\min\left(\frac{R^2}{\rho^2}, d\right) + 1$?

1. $5$
2. $17$
3. $1126$
4. $1127$

**Answer: 2.** The handout's reference answer: $d = 1126$ and $R = 1$, so the upper bound is 17. The computation is

$$
\frac{R^2}{\rho^2} = \frac{1}{(1/4)^2} = 16, \qquad \min(16,\ 1126) + 1 = 17
$$

Option 1's 5 forgets the square and computes $\frac{R}{\rho} + 1 = 4 + 1$. Option 3 takes only $d$. Option 4's 1127 is the $d + 1$ of ordinary perceptrons and does not use the margin at all. The comment in the lecture is that even in a 1126-dimensional space, as long as you insist on fatness, the upper bound on the VC dimension is as small as 17.

The summary on page 28 wraps each of the five parts into one line: the course goes from foundations to techniques; the large-margin separating hyperplane is intuitively more robust against noise; the standard problem minimizes the length of $\mathbf{w}$ at a special scale; SVM can be solved "easily" via quadratic programming; a large margin gives fewer dichotomies and better generalization. The preview for the next lecture is solving non-linear Support Vector Machine.

## Self-check

**1. Three examples: $(4, 3)$ labeled $+1$, $(0, 0)$ labeled $-1$, and $(6, 6)$ labeled $+1$; the hyperplane is $3x_1 + 4x_2 - 10 = 0$. Compute the three points' distances to it and the margin, then rewrite $(b, \mathbf{w})$ in the scaling where "the smallest $y_n(\mathbf{w}^\top\mathbf{x}_n + b)$ equals 1" and confirm that $1/\lVert\mathbf{w}\rVert$ equals the margin.**

Answer: $\mathbf{w} = (3, 4)$, $b = -10$, $\lVert\mathbf{w}\rVert = 5$. The three points' $y_n \times$ score values are $12 + 12 - 10 = 14$, $(-1)(-10) = 10$, and $18 + 24 - 10 = 32$; the distances are $2.8$, $2$, and $6.4$; the margin is 2. The minimum is 10, so divide everything by 10: $\mathbf{w} = (0.3, 0.4)$, $b = -1$. Now $\lVert\mathbf{w}\rVert = 0.5$ and $1/\lVert\mathbf{w}\rVert = 2$, which agrees with the margin.

**2. Three examples: $(1, 0)$ labeled $-1$, $(3, 0)$ labeled $+1$, and $(4, 4)$ labeled $+1$. Following the handout's method for solving four points by hand, find the hard-margin SVM's $(b, \mathbf{w})$ and margin, and say which points are on the fat boundary.**

Answer: the constraints are $-w_1 - b \ge 1$, $3w_1 + b \ge 1$, and $4w_1 + 4w_2 + b \ge 1$. Adding the first two gives $2w_1 \ge 2$, $w_1 \ge 1$, so $\frac{1}{2}\mathbf{w}^\top\mathbf{w} \ge \frac{1}{2}$, with equality requiring $w_1 = 1$, $w_2 = 0$. Substituting back: the first needs $b \le -2$ and the second needs $b \ge -2$, so $b = -2$; the third is $4 + 0 - 2 = 2 \ge 1$, which holds. The optimal solution is $\mathbf{w} = (1, 0)$, $b = -2$, the line $x_1 = 2$, with margin $1/\lVert\mathbf{w}\rVert = 1$. The first two points have $y_n(\mathbf{w}^\top\mathbf{x}_n + b)$ equal to 1 and are on the fat boundary; $(4, 4)$ gives 2 and is not on the boundary, and removing it does not change the answer.

**3. Why can the constraint "the smallest $y_n(\mathbf{w}^\top\mathbf{x}_n + b)$ equals 1" be replaced by "every one is at least 1"?**

Criterion: the answer needs three points. First, the latter is a necessary condition of the former, so the feasible set can only grow. Second, the optimal solution of the relaxed problem cannot have every point strictly greater than 1: if the minimum were some $c > 1$, dividing $(b, \mathbf{w})$ by $c$ would still be feasible while making $\mathbf{w}$ shorter, contradicting optimality. Third, the optimal solution of the relaxed problem therefore already satisfies the original constraint, and it is also the optimal solution of the original problem. Saying only "because scaling does not matter" does not count as correct; that is the reason for the previous step (fixing the scaling).

**4. The data have $d = 3$ features and $N = 5$ examples. Write down the sizes of the four QP inputs and the contents of $Q$. If the solver you have only accepts the form $\mathbf{a}_m^\top\mathbf{u} \le c_m$, how should $\mathbf{a}_n$ and $c_n$ change?**

Answer: $\mathbf{u}$ has 4 components ($b$ plus 3 values of $w$). $Q$ is $4 \times 4$ with diagonal $0, 1, 1, 1$ and 0 everywhere else. $\mathbf{p}$ is 4 zeros. $A$ is $5 \times 4$, and row $n$ is $y_n[1, x_{n,1}, x_{n,2}, x_{n,3}]$. $\mathbf{c}$ is 5 ones. To switch to the "≤" form, multiply both sides of the inequality by $-1$: $-\mathbf{a}_n^\top\mathbf{u} \le -1$, so feed $-y_n[1, \mathbf{x}_n^\top]$ and $-1$.

**5. The data lie in a ball of radius $R = 10$ and the features have $d = 50$ dimensions. Use the handout's formula to compute the upper bound of $d_{\text{VC}}(\mathcal{A}_\rho)$ for $\rho = 2$ and for $\rho = 1$, and say in which case the large margin helps.**

Answer: for $\rho = 2$, $\frac{R^2}{\rho^2} = 25$ and the upper bound is $\min(25, 50) + 1 = 26$, smaller than the perceptron's 51, so the large margin helps. For $\rho = 1$, $\frac{R^2}{\rho^2} = 100$ and the upper bound is $\min(100, 50) + 1 = 51$, the same as the perceptron, so the formula gives no better guarantee. The margin has to be large enough relative to the range of the data for the upper bound to come down.

## Exercises and corresponding reading

**The corresponding week in two semesters.** The [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) puts linear SVM and dual SVM in the same week (W9, 10/28), and the slide code for this lecture is `201u`. The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) also puts them in W9 (11/04), with the two lectures taught together. The Fall 2026 link to `201u_handout.pdf` for that week returned a 404 when opened on 2026-09-30 (the course had only reached W4 at the time), so this article uses only the MOOC handout. The MOOC handouts and videos are all free to access.

**Textbook.** Both course pages map this lecture to e-8.1 of [Learning from Data](http://amlbook.com) (LFD). e-Chapter 8 is one of LFD's online chapters and is not in the printed book.

**Homework.** This lecture had no homework of its own in Fall 2024. The related [Fall 2024 HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf) (released 2024-11-18, due 12-02) is about kernels, soft margin, and aggregation, and has no official solutions; the problems in it closest to the first two SVM lectures, Q1 and Q13, use duality and "$\mathbf{w}$ represented by data" and are discussed in [Techniques Lecture 2](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm-en). The guide to the whole assignment is in [Techniques Homework and Final Project](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en). The most direct exercise for this lecture is to redo self-check question 2 with a few sets of points you make up yourself, then follow the three steps of the Linear Hard-Margin SVM Algorithm, hand the same data to whatever QP tool you have, and compare the answers.

**Further reading.** [Chapter 6 of the CS229 main notes](https://cs229.stanford.edu/main_notes.pdf) derives SVM in a different way and can be read alongside this lecture's QP formulation. [Caltech Learning from Data](https://work.caltech.edu/telecourse) is the course in English that Abu-Mostafa teaches from the same textbook.

**Next lecture.** [Techniques Lecture 2: Dual SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm-en) deals with the problem this lecture leaves behind: after a high-dimensional feature transform, $\mathbf{u}$ has $\tilde{d} + 1$ components and the QP becomes too large to solve, so it has to be traded for an equivalent problem whose number of variables depends only on the amount of data.

## Course video sources

Original videos: [Course Introduction](https://www.youtube.com/watch?v=A-GxGCCAIrg), [Large-Margin Separating Hyperplane](https://www.youtube.com/watch?v=8hak0XngnV0), [Standard Large-Margin Problem](https://www.youtube.com/watch?v=lHo9GcIURRs), [Support Vector Machine](https://www.youtube.com/watch?v=FAm70y081o4), [Reasons behind Large-Margin Hyperplane](https://www.youtube.com/watch?v=7UUO_AamxcA)

- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-10: Marked the video status and checked the recording sources and how to access them.
- 2026-10-10: Rechecked the video status. The embedded videos match the lecture numbering of the official playlist.
- 2026-10-13: Previously combined with Lecture 2 in one article; changed to one article per lecture and rewritten from the handout and the video transcripts.

## References

- [Techniques Lecture 1 handout, 201_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/201_handout.pdf): the main source for this article. The derivations in the five parts, the four-point example, and the five Fun Time questions all come from this handout.
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2): the IDs and titles of the five videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these five videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Foundations Lecture 12 handout, 12_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/12_handout.pdf): the two prices of feature transforms, which this lecture's motivation follows from.
- [Foundations Lecture 14 handout, 14_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf): the formulation of weight decay, used for comparison with the standard SVM problem.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the corresponding week and LFD chapter.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the corresponding week and LFD chapter.
- [Fall 2024 Homework 6 (hw6_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf): the assignment's topics and the related problem numbers.
- [Learning from Data textbook website](http://amlbook.com): the source of e-8.1.
- [CS229 main notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf): further reading, the SVM derivation in Chapter 6.
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse): further reading, a course in English that uses the same textbook.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course, and which lectures the four Foundations questions and the three Techniques categories cover.
