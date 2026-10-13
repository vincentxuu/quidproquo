---
title: "Kernel SVM: Inner Products Without Computing High-Dimensional Features | NTU Hsuan-Tien Lin Machine Learning Techniques Lecture 3"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, svm, kernel-methods]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 20
tldr: "The dual SVM's variable count no longer depends on the feature dimension d̃, but every entry of the Q matrix is still one d̃-dimensional inner product. This lecture merges \"transform + inner product\" into a single kernel function K(x, x′); for the second-order transform the inner product takes only O(d). Once training, computing b, and prediction all use K, the SVM never touches the Z space. Pushed to the limit, the same move gives the Gaussian kernel, which corresponds to an infinite-dimensional transform, at the price that too large a γ still overfits."
description: "A guide to Lecture 3 of NTU Hsuan-Tien Lin's Machine Learning Techniques, Kernel Support Vector Machine: the derivation of the kernel trick, the kernel hard-margin SVM algorithm, the (γ, ζ, Q) of the polynomial kernel, the infinite-dimensional transform behind the Gaussian kernel, the trade-offs among three kernels, and Mercer's condition, with a kernel SVM on three points solved completely by hand."
draft: false
glossary:
  - term: "kernel function"
    definition: "The function K(x, x′) = Φ(x)ᵀΦ(x′) that merges the feature transform Φ with the inner product. Its inputs are two points in the original space, and its output is the inner product of their transformed versions in the Z space."
    context: "The main subject of Techniques Lecture 3; every transform Φ corresponds to one kernel function."
  - term: "kernel trick"
    definition: "Replacing every \"transform first, then take the inner product\" in an algorithm with a kernel function that is fast to compute, so that an algorithm that only uses inner products (the dual SVM, for example) no longer depends on the transformed dimension d̃."
    context: "Techniques Lecture 3 uses it to turn the dual SVM into the kernel SVM."
  - term: "Gaussian kernel"
    aliases: ["RBF kernel", "Radial Basis Function kernel"]
    definition: "K(x, x′) = exp(−γ‖x − x′‖²) with γ greater than 0. It corresponds to an infinite-dimensional transform; the larger γ is, the sharper the Gaussian."
    context: "Techniques Lecture 3 uses a Taylor expansion to show that it is an inner product of infinite-dimensional vectors."
  - term: "Mercer's condition"
    aliases: ["Mercer condition"]
    definition: "The necessary and sufficient condition for a function to be a valid kernel: it is symmetric, and the kernel matrix computed from every possible set of data is positive semi-definite."
    context: "Techniques Lecture 3 uses it to explain why an arbitrary similarity is not necessarily a valid kernel."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm)

**Video status: Videos included.** This article is written from the official MOOC handout [203_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/203_handout.pdf) and transcripts of the four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/22 to 22/22), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Techniques Lecture 3 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Techniques into three ways of handling features, and this lecture is still inside the first, Embedding Numerous Features: Kernel Models. The same page sums up the previous lecture, [Techniques Lecture 2: Dual SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm-en), this way: the dual SVM is another QP, with valuable geometric messages and "almost no dependence on $\tilde{d}$". The word almost is printed in gray on the slide, and what this lecture does is remove it.

The prerequisites are the dual problem from the previous lecture, the two formulas that recover $\mathbf{w}$ and $b$ from $\boldsymbol{\alpha}$, the definition of support vectors, and the polynomial transform from [Foundations Lecture 12: Nonlinear Transformation](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation-en). The Gaussian kernel section uses the Taylor expansion of the exponential function. After reading, you should be able to derive the kernel of the second-order transform yourself, write down the four steps of the kernel hard-margin SVM and carry them out by hand on a small data set, explain why the Gaussian kernel is an inner product of infinite-dimensional vectors, and use a 2×2 matrix to show that a given function is not a valid kernel.

The path through the lecture:

1. **Find the bottleneck**: the dual problem's $Q_D$ still needs $\tilde{d}$-dimensional inner products.
2. **A shortcut for the second-order transform**: computing the transform and the inner product together takes only $O(d)$.
3. **The kernel trick**: the three places in the dual SVM that use an inner product are all replaced by a kernel function.
4. **The polynomial kernel**: adding scaling to the transform gives $(\zeta + \gamma\mathbf{x}^\top\mathbf{x}')^Q$.
5. **The Gaussian kernel**: the same move pushed to infinitely many dimensions.
6. **Comparison and limits**: the trade-offs among three kernels, and which functions count as kernels.

## Can the transform and the inner product be computed together: the kernel trick

```youtube
url: https://www.youtube.com/watch?v=oOi7kqUTqxw
title: Kernel Support Vector Machine :: Kernel Trick @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–03:33 reviews the previous lecture and points out the bottleneck, 03:33–10:47 derives the fast inner product for the second-order transform, 10:47–17:41 defines the kernel function and plugs it into three places in the dual SVM, 17:41–19:55 gives the full algorithm and its cost, and Fun Time follows.)

### The bottleneck left by the previous lecture

Page 2 of the handout copies out the previous lecture's dual problem again, with half-way done written next to the heading:

$$
\begin{aligned}
\min_{\boldsymbol{\alpha}}\quad & \frac{1}{2}\boldsymbol{\alpha}^\top Q_D\boldsymbol{\alpha} - \mathbf{1}^\top\boldsymbol{\alpha} \\
\text{subject to}\quad & \mathbf{y}^\top\boldsymbol{\alpha} = 0; \\
& \alpha_n \ge 0,\quad n = 1, 2, \dots, N
\end{aligned}
$$

There are $N$ variables and $N+1$ constraints, and neither number depends on $\tilde{d}$. $\tilde{d}$ is hiding in the entries of $Q_D$:

$$
q_{n,m} = y_n y_m\,\mathbf{z}_n^\top\mathbf{z}_m, \qquad \mathbf{z}_n^\top\mathbf{z}_m = \boldsymbol{\Phi}(\mathbf{x}_n)^\top\boldsymbol{\Phi}(\mathbf{x}_m)
$$

This is an inner product in $\mathbb{R}^{\tilde{d}}$. The numbers Lin gives in the lecture: an inner product in a 10,000-dimensional space takes 10,000 steps if you compute it by definition, and in 100,000 dimensions it takes 100,000 steps. Without these coefficients the QP cannot even be started, so in the lecture Lin calls this step the bottleneck of the whole solution process. The handout states the requirement in one line: $\mathbf{z}_n^\top\mathbf{z}_m$ must be calculated faster than $O(\tilde{d})$.

In the lecture, Lin then looks at this inner product as two actions. Seen from the X space, $\mathbf{z}_n^\top\mathbf{z}_m$ means transforming each of the two $\mathbf{x}$ first and then taking the inner product. Transforming into 10,000 dimensions costs 10,000 units of effort, and the inner product in 10,000 dimensions costs another 10,000; as long as the two steps are done separately, neither cost can be avoided. Here Lin uses a Taiwanese expression for a sneaky shortcut: can the two steps be merged and computed together, faster?

### The inner product of the second-order transform takes O(d)

Page 3 of the handout uses the 2nd order polynomial transform as its example. This $\boldsymbol{\Phi}_2$ is written slightly differently from the one in Foundations Lecture 12:

$$
\boldsymbol{\Phi}_2(\mathbf{x}) = (1,\ x_1, x_2, \dots, x_d,\ x_1^2, x_1x_2, \dots, x_1x_d,\ x_2x_1, x_2^2, \dots, x_2x_d,\ \dots,\ x_d^2)
$$

$x_1x_2$ and $x_2x_1$ have the same value, yet both are included. The slide's note says this is for 'simplicity'; in the lecture Lin says outright that it is padding, done so that the formulas that follow tidy up more cleanly. Counted this way, $\boldsymbol{\Phi}_2(\mathbf{x})$ has $1 + d + d^2$ components: one constant, $d$ first-order terms, and $d^2$ second-order terms (one $x_ix_j$ for every pair $(i, j)$).

Now take two points $\mathbf{x}$ and $\mathbf{x}'$ and, following the definition, multiply the transformed vectors component by component and add everything up:

$$
\boldsymbol{\Phi}_2(\mathbf{x})^\top\boldsymbol{\Phi}_2(\mathbf{x}') = \underbrace{1 \cdot 1}_{\text{constant}} + \underbrace{\sum_{i=1}^{d} x_i x_i'}_{\text{1st order}} + \underbrace{\sum_{i=1}^{d}\sum_{j=1}^{d} x_i x_j\, x_i' x_j'}_{\text{2nd order}}
$$

The troublesome part is the double sum at the end, which has $d^2$ terms. What Lin does in the lecture is collect the factors that involve $i$ on one side and the factors that involve $j$ on the other. Each term is a product of four numbers, and $x_i x_i'$ does not contain $j$, so it can be pulled out of the inner sum:

$$
\sum_{i=1}^{d}\sum_{j=1}^{d} x_i x_j\, x_i' x_j' = \sum_{i=1}^{d} x_i x_i' \Big(\sum_{j=1}^{d} x_j x_j'\Big) = \Big(\sum_{i=1}^{d} x_i x_i'\Big)\Big(\sum_{j=1}^{d} x_j x_j'\Big)
$$

The second equality holds because the sum in parentheses does not contain $i$, so it is a constant as far as the outer sum is concerned. Both parentheses are the inner product in the original space, $\mathbf{x}^\top\mathbf{x}'$, so

$$
\boldsymbol{\Phi}_2(\mathbf{x})^\top\boldsymbol{\Phi}_2(\mathbf{x}') = 1 + \mathbf{x}^\top\mathbf{x}' + (\mathbf{x}^\top\mathbf{x}')^2
$$

To evaluate the right-hand side, spend $O(d)$ computing $\mathbf{x}^\top\mathbf{x}'$ once, then square and add. The handout's conclusion is that for $\boldsymbol{\Phi}_2$, transform + inner product can be carefully done in $O(d)$ instead of $O(d^2)$. In the lecture, Lin adds a caveat: merging the two steps does not always make the computation faster; it just happens to work in this special case.

Here is a small check made up for this article (not from the slides). Take $d = 2$, $\mathbf{x} = (1, 2)$, and $\mathbf{x}' = (3, 1)$.

- **By definition**: $\boldsymbol{\Phi}_2(\mathbf{x}) = (1,\ 1, 2,\ 1, 2, 2, 4)$ and $\boldsymbol{\Phi}_2(\mathbf{x}') = (1,\ 3, 1,\ 9, 3, 3, 1)$, each with $1 + 2 + 4 = 7$ components. The inner product is $1 + 3 + 2 + 9 + 6 + 6 + 4 = 31$.
- **By the shortcut**: $\mathbf{x}^\top\mathbf{x}' = 3 + 2 = 5$, and $1 + 5 + 5^2 = 31$.

The two agree. With $d = 2$ the difference is invisible, but it becomes obvious once $d$ is 100: the definition requires expanding each point into $1 + 100 + 100^2 = 10{,}101$ dimensions before taking the inner product, while the shortcut needs one 100-dimensional inner product plus two operations.

### The kernel function: wrapping the transform inside

Page 4 of the handout gives this shortcut a name. Every transform $\boldsymbol{\Phi}$ corresponds to a kernel function:

$$
K_{\boldsymbol{\Phi}}(\mathbf{x}, \mathbf{x}') \equiv \boldsymbol{\Phi}(\mathbf{x})^\top\boldsymbol{\Phi}(\mathbf{x}')
$$

The result above is written $K_{\boldsymbol{\Phi}_2}(\mathbf{x}, \mathbf{x}') = 1 + \mathbf{x}^\top\mathbf{x}' + (\mathbf{x}^\top\mathbf{x}')^2$, with the subscript saying which transform it corresponds to. In the lecture, Lin stresses that a kernel function takes the original $\mathbf{x}$ as input: it operates directly on things in the X space, and that stands for the two steps of transforming and then taking the inner product in the Z space, with the transform wrapped inside the function. The hope, of course, is that this function is fast to compute.

Next, the places in the dual SVM that use the Z space are found one by one and replaced. There are three.

**First, the quadratic coefficients.** This is the bottleneck itself, and the substitution is direct:

$$
q_{n,m} = y_n y_m\,\mathbf{z}_n^\top\mathbf{z}_m = y_n y_m K(\mathbf{x}_n, \mathbf{x}_m)
$$

**Second, computing $b$.** The previous lecture picks a support vector $(\mathbf{x}_s, y_s)$ and uses $b = y_s - \mathbf{w}^\top\mathbf{z}_s$. What appears here is the inner product of $\mathbf{w}$ and $\mathbf{z}_s$, and $\mathbf{w}$ is a $\tilde{d}$-dimensional vector. In the lecture, Lin voices the student's doubt first: at first glance this is not an inner product of two $\mathbf{z}$ vectors, so a kernel cannot be used. The way out is another KKT condition from the previous lecture, $\mathbf{w} = \sum_n \alpha_n y_n \mathbf{z}_n$: $\mathbf{w}$ is itself a linear combination of the $\mathbf{z}_n$. Substitute it in, and the inner product distributes over the sum:

$$
b = y_s - \mathbf{w}^\top\mathbf{z}_s = y_s - \Big(\sum_{n=1}^{N}\alpha_n y_n \mathbf{z}_n\Big)^\top\mathbf{z}_s = y_s - \sum_{n=1}^{N}\alpha_n y_n\,\mathbf{z}_n^\top\mathbf{z}_s = y_s - \sum_{n=1}^{N}\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}_s)
$$

**Third, prediction.** For a new input $\mathbf{x}$, the classifier is $\text{sign}(\mathbf{w}^\top\boldsymbol{\Phi}(\mathbf{x}) + b)$. $\boldsymbol{\Phi}(\mathbf{x})$ is just another $\mathbf{z}$, so the same move applies:

$$
g_{\text{SVM}}(\mathbf{x}) = \text{sign}\big(\mathbf{w}^\top\boldsymbol{\Phi}(\mathbf{x}) + b\big) = \text{sign}\Big(\sum_{n=1}^{N}\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + b\Big)
$$

With all three replaced, Lin goes back over the procedure in the lecture: is there a single moment where an inner product is really taken in the Z space? No. $\mathbf{w}$ is never computed at all. It only ever appears in the form of an inner product with some $\mathbf{z}$, and every such appearance has been replaced by a kernel. The handout calls this the kernel trick: plug in an efficient kernel function to avoid dependence on $\tilde{d}$.

### The kernel hard-margin SVM algorithm

Page 5 of the handout rewrites the previous lecture's dual SVM as the Kernel Hard-Margin SVM Algorithm. The steps are the same as before, except that every inner product in the Z space becomes $K$:

1. Compute $q_{n,m} = y_n y_m K(\mathbf{x}_n, \mathbf{x}_m)$ and $\mathbf{p} = -\mathbf{1}_N$, then prepare $(A, \mathbf{c})$ from the equality constraint $\mathbf{y}^\top\boldsymbol{\alpha} = 0$ and the bound constraints $\alpha_n \ge 0$.
2. $\boldsymbol{\alpha} \leftarrow \text{QP}(Q_D, \mathbf{p}, A, \mathbf{c})$.
3. Pick a support vector $(\mathbf{x}_s, y_s)$ and set $b \leftarrow y_s - \sum_{\text{SV}} \alpha_n y_n K(\mathbf{x}_n, \mathbf{x}_s)$.
4. Return the support vectors, their $\alpha_n$, and $b$. For a new $\mathbf{x}$, $g_{\text{SVM}}(\mathbf{x}) = \text{sign}\big(\sum_{\text{SV}} \alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + b\big)$.

The sums in steps 3 and 4 run over the support vectors only, because terms with $\alpha_n = 0$ contribute nothing. For step 3, Lin adds a practical note in the lecture: mathematically one support vector is enough, but you can also pick several, compute $b$ from each, and average, which is numerically more stable.

The handout lists the cost of each step:

| Step | Cost | Relation to $\tilde{d}$ |
|---|---|---|
| 1 | $O(N^2)$ kernel evaluations | none, if the kernel is fast to compute |
| 2 | a QP with $N$ variables and $N+1$ constraints | none |
| 3, 4 | $O(\#\text{SV})$ kernel evaluations | none, if the kernel is fast to compute |

The handout's summary: kernel SVM uses a computational shortcut to avoid $\tilde{d}$ and predicts with SVs only. An addition in this article, on a consequence that is easy to overlook: what you have to store after training changes. The primal SVM stores $(b, \mathbf{w})$. The kernel SVM has no $\mathbf{w}$ to store; it stores the support vectors themselves, their $\alpha_n$ (and $y_n$), and $b$. Every prediction on a new example costs one kernel evaluation against each support vector.

### A numerical example: kernel SVM on three points

The following is an example made up for this article, not from the slides. Its purpose is to walk through all four steps above and to see that the kernel route and really transforming into the Z space give the same answer.

The data are three points in one dimension:

| $n$ | $x_n$ | $y_n$ |
|---|---|---|
| 1 | $-1$ | $+1$ |
| 2 | $0$ | $-1$ |
| 3 | $1$ | $+1$ |

The negative example is sandwiched between the two positive ones, so no single cut on the number line separates them, and the linear hard-margin SVM has no solution. The kernel is $K_2(x, x') = (1 + xx')^2$, which is only introduced formally in the next section (treat it as a given function for now; its transform is $\boldsymbol{\Phi}(x) = (1, \sqrt{2}x, x^2)$, because $1 + 2xx' + x^2x'^2 = (1 + xx')^2$).

**Step 1: compute the kernel matrix and $Q_D$.** For example, $K(x_1, x_3) = (1 + (-1)(1))^2 = 0$, $K(x_1, x_2) = (1 + 0)^2 = 1$, and $K(x_1, x_1) = (1 + 1)^2 = 4$. Compute them all, then multiply by $y_n y_m$:

$$
K = \begin{bmatrix} 4 & 1 & 0 \\ 1 & 1 & 1 \\ 0 & 1 & 4 \end{bmatrix}, \qquad Q_D = \begin{bmatrix} 4 & -1 & 0 \\ -1 & 1 & -1 \\ 0 & -1 & 4 \end{bmatrix}
$$

The entries of $Q_D$ that change sign are the four at $(1,2)$, $(2,1)$, $(2,3)$, and $(3,2)$, because point 2 has the opposite label from the other two.

**Step 2: solve the dual problem.** The equality constraint is $\alpha_1 - \alpha_2 + \alpha_3 = 0$, so $\alpha_2 = \alpha_1 + \alpha_3$. Expand $Q_D$:

$$
\boldsymbol{\alpha}^\top Q_D\boldsymbol{\alpha} = 4\alpha_1^2 + \alpha_2^2 + 4\alpha_3^2 - 2\alpha_1\alpha_2 - 2\alpha_2\alpha_3 = 4\alpha_1^2 + 4\alpha_3^2 + \alpha_2\big(\alpha_2 - 2(\alpha_1 + \alpha_3)\big)
$$

Substituting $\alpha_2 = \alpha_1 + \alpha_3$ turns the last term into $-(\alpha_1 + \alpha_3)^2$, and the whole quadratic term becomes $3\alpha_1^2 + 3\alpha_3^2 - 2\alpha_1\alpha_3$. Meanwhile $\sum_n \alpha_n = 2(\alpha_1 + \alpha_3)$. The objective function becomes

$$
\frac{1}{2}\big(3\alpha_1^2 + 3\alpha_3^2 - 2\alpha_1\alpha_3\big) - 2\alpha_1 - 2\alpha_3
$$

Set the partial derivatives with respect to $\alpha_1$ and $\alpha_3$ to 0: $3\alpha_1 - \alpha_3 - 2 = 0$ and $3\alpha_3 - \alpha_1 - 2 = 0$. Subtracting the two equations gives $\alpha_1 = \alpha_3$; substituting back gives $\alpha_1 = \alpha_3 = 1$, and therefore $\alpha_2 = 2$. All three are positive, so $\alpha_n \ge 0$ is not violated:

$$
\boldsymbol{\alpha} = (1, 2, 1), \qquad \text{objective} = \frac{1}{2}(3 + 3 - 2) - 4 = -2
$$

**Step 3: compute $b$.** All three points are support vectors, so compute it from each:

- From point 1: $b = 1 - \big[(1)(+1)(4) + (2)(-1)(1) + (1)(+1)(0)\big] = 1 - 2 = -1$
- From point 2: $b = -1 - \big[(1)(+1)(1) + (2)(-1)(1) + (1)(+1)(1)\big] = -1 - 0 = -1$
- From point 3: symmetric with point 1, $b = -1$

**Step 4: write down the classifier.**

$$
g_{\text{SVM}}(x) = \text{sign}\big((1 - x)^2 - 2 \cdot 1 + (1 + x)^2 - 1\big) = \text{sign}\big(2x^2 - 1\big)
$$

The $-2 \cdot 1$ in the middle comes from point 2: $K(0, x) = 1$ whatever $x$ is. The boundary is at $x = \pm\frac{1}{\sqrt{2}} \approx \pm 0.707$; the region between is classified $-1$ and the two sides $+1$. The scores of the three training points are $2 - 1 = 1$, $0 - 1 = -1$, and $2 - 1 = 1$, and each multiplied by its own $y_n$ is exactly 1, so all three points lie on the fat boundary and all four KKT conditions hold.

**For comparison: really computing in the Z space.** With $\boldsymbol{\Phi}(x) = (1, \sqrt{2}x, x^2)$, the three points become $\mathbf{z}_1 = (1, -\sqrt{2}, 1)$, $\mathbf{z}_2 = (1, 0, 0)$, and $\mathbf{z}_3 = (1, \sqrt{2}, 1)$.

$$
\mathbf{w} = \sum_n \alpha_n y_n\mathbf{z}_n = (1, -\sqrt{2}, 1) - 2(1, 0, 0) + (1, \sqrt{2}, 1) = (0, 0, 2)
$$

$\mathbf{w}^\top\boldsymbol{\Phi}(x) + b = 2x^2 - 1$, exactly what the kernel route produced. The margin in the Z space is $1/\lVert\mathbf{w}\rVert = \frac{1}{2}$.

**What this result means.** From start to finish, the kernel route used only the 9 kernel values between the $x_n$ (really 6, because of symmetry). It never wrote down a single $\mathbf{z}_n$ and never computed $\mathbf{w}$, yet it arrived at the same boundary. In this example $\tilde{d}$ is only 2 (not counting the constant), so little is saved; but with the same four steps, you can swap the kernel for a 10th-order polynomial or a Gaussian without changing one word of the procedure. This data set is used again in the next two sections.

### Fun Time: two points whose inner product is 10

**Question (page 6):** Consider two examples $\mathbf{x}$ and $\mathbf{x}'$ such that $\mathbf{x}^\top\mathbf{x}' = 10$. What is $K_{\boldsymbol{\Phi}_2}(\mathbf{x}, \mathbf{x}')$?

1. $1$
2. $11$
3. $111$
4. $1111$

**Answer: 3.** Plug into the formula: $1 + 10 + 10^2 = 111$. Choice 1 counts only the constant term, choice 2 drops the second-order term, and choice 4 adds an extra $10^3$, a term that only a third-order transform would have.

The question gives neither the dimension of $\mathbf{x}$ nor the values of $\mathbf{x}$ and $\mathbf{x}'$. The answer needs just one number, the inner product in the original space, and that is exactly what a kernel means: whether $\mathbf{x}$ has 3 dimensions or 3,000, and however many terms $\boldsymbol{\Phi}_2$ expands into, the answer is unaffected.

## Same second-order transform, different coefficients, different kernel: the polynomial kernel

```youtube
url: https://www.youtube.com/watch?v=Fb-WSBvsPak
title: Kernel Support Vector Machine :: Polynomial Kernel @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–03:50 adds scaling to the second-order transform, 03:50–05:48 looks at the results of three second-order kernels, 05:48–09:18 generalizes to order Q, 09:18–11:29 covers the linear kernel, and Fun Time follows.)

### Adding scaling to the transform

Is the $\boldsymbol{\Phi}_2$ above the only second-order transform? In the lecture, Lin answers no: there are many second-order transforms, some of which lead to a kernel that is easy to compute and some of which do not. Page 7 of the handout lists three, differing only in the constants in front of the terms. The slide writes the second-order terms as $x_1^2, \dots, x_d^2$ without further explanation; since the kernel on the right of the same row contains $(\mathbf{x}^\top\mathbf{x}')^2$, that must be shorthand for all $d^2$ products $x_ix_j$ (this is this article's reading).

**The original.** $\boldsymbol{\Phi}_2(\mathbf{x}) = (1, x_1, \dots, x_d, x_1^2, \dots, x_d^2)$, corresponding to $K_{\boldsymbol{\Phi}_2}(\mathbf{x}, \mathbf{x}') = 1 + \mathbf{x}^\top\mathbf{x}' + (\mathbf{x}^\top\mathbf{x}')^2$.

**First-order terms multiplied by $\sqrt{2}$.** The transform is $(1, \sqrt{2}x_1, \dots, \sqrt{2}x_d, x_1^2, \dots, x_d^2)$. In the inner product of two such vectors, the first-order part becomes $\sum_i (\sqrt{2}x_i)(\sqrt{2}x_i') = 2\,\mathbf{x}^\top\mathbf{x}'$ and the rest is unchanged:

$$
K_2(\mathbf{x}, \mathbf{x}') = 1 + 2\,\mathbf{x}^\top\mathbf{x}' + (\mathbf{x}^\top\mathbf{x}')^2 = (1 + \mathbf{x}^\top\mathbf{x}')^2
$$

The extra 2 is exactly what makes the three terms a perfect square. In the lecture, Lin says that is the benefit of multiplying by $\sqrt{2}$.

**Adding a scaling parameter $\gamma$.** The transform is $(1, \sqrt{2\gamma}x_1, \dots, \sqrt{2\gamma}x_d, \gamma x_1^2, \dots, \gamma x_d^2)$. The inner product of the first-order terms is $\sum_i (\sqrt{2\gamma}x_i)(\sqrt{2\gamma}x_i') = 2\gamma\,\mathbf{x}^\top\mathbf{x}'$; the inner product of the second-order terms is $\sum_i\sum_j (\gamma x_ix_j)(\gamma x_i'x_j') = \gamma^2(\mathbf{x}^\top\mathbf{x}')^2$, where the last equality uses the same step that split the double sum in the kernel trick section. Together:

$$
K_2(\mathbf{x}, \mathbf{x}') = 1 + 2\gamma\,\mathbf{x}^\top\mathbf{x}' + \gamma^2(\mathbf{x}^\top\mathbf{x}')^2 = (1 + \gamma\,\mathbf{x}^\top\mathbf{x}')^2, \qquad \gamma > 0
$$

The handout's comment on this $K_2$ is that it is somewhat 'easier' to calculate than $K_{\boldsymbol{\Phi}_2}$, and that it is the commonly used form; in the lecture Lin adds that it also extends more easily to higher orders.

On the slide, the original $\boldsymbol{\Phi}_2$ is blue, the one multiplied only by $\sqrt{2}$ is red, and the one with $\gamma$ is green; the handout's line about equivalent power compares the blue one and the green one. In the lecture, Lin asks on the students' behalf: what exactly is different between blue and green? The answer has two layers.

- **What is the same:** both are second-order transforms and correspond to the same space. When you do linear operations in that space, these scalings end up absorbed by the linear coefficients $\tilde{\mathbf{w}}$, so the set of boundaries they can represent is the same. The handout's wording is equivalent power.
- **What is different:** they define different inner products. Lin's chain of reasoning in the lecture: a different inner product means a different distance; SVM is an algorithm that decides the margin by distance; so the geometry differs, the computed margin differs, and the final boundary may differ. The handout writes it as different inner product ⟹ different geometry.

### Changing the kernel changes the definition of margin

Page 8 of the handout runs SVM three times on the same two-dimensional data and puts the three plots side by side. The plots do not label which class is positive; following the course's usual drawing convention, blue circles are positive and red crosses are negative, and the points boxed by squares are the support vectors:

| Plot | Kernel | What the boundary looks like |
|---|---|---|
| Left | $(1 + 0.001\,\mathbf{x}^\top\mathbf{x}')^2$ | A single curve opening upward, separating the blue circles above from the red crosses below |
| Middle | $1 + \mathbf{x}^\top\mathbf{x}' + (\mathbf{x}^\top\mathbf{x}')^2$ | Besides the curve at the top, another region classified blue appears at the bottom of the plot, toward the right |
| Right | $(1 + 1000\,\mathbf{x}^\top\mathbf{x}')^2$ | The curve at the top is close to the middle plot's, and the bottom again has an extra blue region, closer to the center than in the middle plot |

All three are quadratic curves, and all three separate the data perfectly. In the lecture, Lin points out that the left plot's boundary looks simpler, without the extra piece at the bottom of the middle plot, and that the number of support vectors is not quite the same across the three plots (counting boxes on the plots, this article gets 4, 5, and 6 in order). The blue region at the bottom contains no training points at all; this article's interpretation is that it is the other branch of the same quadratic curve, and the made-up example below computes the same phenomenon. The handout's two conclusions:

- $g_{\text{SVM}}$ different, SVs different, and it is 'hard' to say which is better before learning. In the lecture, Lin explains that the three each have their own definition of margin, and under different definitions they are not easy to compare.
- Change of kernel ⇔ change of margin definition. So the kernel needs selecting, just like selecting the transform $\boldsymbol{\Phi}$ before; the transform is now wrapped inside the kernel, and choosing a kernel is choosing a transform.

**An example made up for this article: two points, and where γ pushes the boundary.** The handout's plots give no data coordinates, so they cannot be reproduced by hand. Here the smallest possible data set is used to compute "same kernel family, different $\gamma$, different boundary". Two points in one dimension: $x_1 = 0$ labeled $-1$ and $x_2 = 1$ labeled $+1$; the kernel is $K_2(x, x') = (1 + \gamma xx')^2$.

The kernel values: $K(x_1, x_1) = 1$, $K(x_1, x_2) = 1$, and $K(x_2, x_2) = (1 + \gamma)^2$ ($x_1 = 0$ makes the first two values 1). The equality constraint $-\alpha_1 + \alpha_2 = 0$ gives $\alpha_1 = \alpha_2 = \alpha$. The entries of $Q_D$ are $q_{1,1} = 1$, $q_{1,2} = -1$, and $q_{2,2} = (1 + \gamma)^2$, and the objective function is

$$
\frac{1}{2}\alpha^2\big(1 - 2 + (1 + \gamma)^2\big) - 2\alpha = \frac{1}{2}\alpha^2\,\gamma(2 + \gamma) - 2\alpha
$$

Setting the derivative to 0 gives $\alpha = \dfrac{2}{\gamma(2 + \gamma)}$. Compute $b$ from point 1: $b = -1 - \alpha\big[(-1)(1) + (+1)(1)\big] = -1$. The classifier is

$$
g_{\text{SVM}}(x) = \text{sign}\Big(\alpha\big[(1 + \gamma x)^2 - 1\big] - 1\Big)
$$

The boundary satisfies $(1 + \gamma x)^2 - 1 = \frac{1}{\alpha} = \frac{\gamma(2 + \gamma)}{2}$. Expanding the left side and dividing both sides by $\gamma$ gives $\gamma x^2 + 2x - \big(1 + \frac{\gamma}{2}\big) = 0$, whose solutions are $x = \dfrac{-1 \pm \sqrt{1 + \gamma(1 + \gamma/2)}}{\gamma}$. Try a few values of $\gamma$:

| $\gamma$ | $\alpha$ | Boundary (two roots) | Margin in the Z space |
|---|---|---|---|
| $0.001$ | $999.5$ | $0.5001$ and $-2000.5$ | $0.022$ |
| $0.1$ | $9.524$ | $0.512$ and $-20.5$ | $0.229$ |
| $1$ | $0.667$ | $0.581$ and $-2.581$ | $0.866$ |
| $10$ | $0.0167$ | $0.681$ and $-0.881$ | $5.48$ |
| $1000$ | $2.0 \times 10^{-6}$ | $0.7068$ and $-0.7088$ | $500.5$ |

Between the two roots the classifier outputs $-1$, and outside them $+1$. The margin column is $1/\lVert\mathbf{w}\rVert$, computed from $\lVert\mathbf{w}\rVert^2 = \boldsymbol{\alpha}^\top Q_D\boldsymbol{\alpha} = 2\alpha$.

Three things can be read off this table. First, when $\gamma$ is very small, the left root runs off to $-2000$, and near the data you see only the single cut at $x \approx 0.5$, the midpoint of the two points, so the behavior is almost that of a linear SVM; the reason is that for small $\gamma$ the second-order term $\gamma x^2$ in the transform is much smaller than the first-order term $\sqrt{2\gamma}x$. Second, when $\gamma$ is very large, the boundary approaches $\pm\frac{1}{\sqrt{2}}$, symmetric about the origin: the second-order term dominates, and a positive region is drawn even on the negative half-line far from the data. With the same second-order kernel and the same two points, $x = 0.6$ is classified $+1$ when $\gamma = 1$ and $-1$ when $\gamma = 10$. Third, the margin goes from 0.022 to 500, and each of these numbers measures a distance in a different Z space, so they cannot be compared with one another; this is why Lin says in the lecture that it is not easy to tell which is better.

### The general polynomial kernel

Page 9 of the handout adds one more parameter, $\zeta$, and generalizes the order:

$$
\begin{aligned}
K_2(\mathbf{x}, \mathbf{x}') &= (\zeta + \gamma\,\mathbf{x}^\top\mathbf{x}')^2 \\
K_3(\mathbf{x}, \mathbf{x}') &= (\zeta + \gamma\,\mathbf{x}^\top\mathbf{x}')^3 \\
&\ \ \vdots \\
K_Q(\mathbf{x}, \mathbf{x}') &= (\zeta + \gamma\,\mathbf{x}^\top\mathbf{x}')^Q
\end{aligned}
\qquad \gamma > 0,\ \zeta \ge 0
$$

Each of the three parameters controls one thing. As Lin explains in the lecture, $\gamma$ controls the scaling of the original inner product; $\zeta$ controls the constant term and how it combines with the coefficients of the terms of each order; and $Q$ is the order of the polynomial. The handout says this kernel embeds a $Q$-th order transform $\boldsymbol{\Phi}_Q$ specially, with the specific coefficients determined by the parameters $(\gamma, \zeta)$. Exactly how $\zeta$ enters the coefficients of the transform is the Fun Time question of this section.

The point is the cost. $Q$ can be 2, 3, or 10, and in the lecture Lin even says 100 or 1000 would be fine: the effort is always one inner product in the original space plus a little arithmetic. This article converts with the formula from Foundations Lecture 12: with $d = 10$ input features and a 10th-order polynomial transform, the dimension after removing duplicates is $\binom{20}{10} - 1 = 184{,}755$; with the kernel it is still one 10-dimensional inner product, plus one addition, one multiplication, and one 10th power. As Lin puts it in the lecture, a 10th-order transform is now almost as easy as a 2nd-order one.

Will such a high order overfit? Lin's answer in the lecture is that it might, but in SVM there is also the large margin to help control complexity. The plot on the right of page 9 is an example: on a two-dimensional data set, the boundary from a 10th-order polynomial kernel is a curve that bends a few times, captioned 10-th order polynomial with margin 0.1. Lin's comment in the lecture is that although it corresponds to a 10th-order transform, this boundary is not bad, and there are not too many support vectors either. The handout calls SVM with the polynomial kernel the polynomial SVM.

### Special case: the linear kernel

Page 10 of the handout goes back to the simplest case: $Q = 1$, $\gamma = 1$, $\zeta = 0$.

$$
K_1(\mathbf{x}, \mathbf{x}') = (0 + 1 \cdot \mathbf{x}^\top\mathbf{x}')^1 = \mathbf{x}^\top\mathbf{x}'
$$

This is just the usual inner product in the original space, called the linear kernel, and it corresponds to doing no transform at all. In the lecture, Lin explains why the two parameters can be set this way: $\gamma$ only scales the original data, and if the data are already properly prepared, 1 will do; the role of the constant term is already handled by the SVM's $b$, so $\zeta$ is 0.

The handout says this case is 'even easier': it can be solved efficiently, often in primal form, without necessarily going through the dual. On the right of the slide is a straight line with a gray fat boundary, which Lin says in the lecture is the picture from the very start of the SVM lectures: just go back and solve the original problem of finding the fattest boundary; and if you really want the dual, plugging in the linear kernel works too.

The bottom line of this page is linear first, remember? In the lecture, Lin turns it into an order of operations: try the linear SVM on the data first; if it does well enough, there is no need to try polynomials; if it does not, then move on to polynomials. This is a reminder the course has repeated ever since Foundations.

### Fun Time: which transform gives the general second-order kernel

**Question (page 11):** Consider the general 2-nd polynomial kernel $K_2(\mathbf{x}, \mathbf{x}') = (\zeta + \gamma\,\mathbf{x}^\top\mathbf{x}')^2$. Which of the following transform can be used to derive this kernel?

1. $\boldsymbol{\Phi}(\mathbf{x}) = (1, \sqrt{2\gamma}x_1, \dots, \sqrt{2\gamma}x_d, \gamma x_1^2, \dots, \gamma x_d^2)$
2. $\boldsymbol{\Phi}(\mathbf{x}) = (\zeta, \sqrt{2\gamma}x_1, \dots, \sqrt{2\gamma}x_d, x_1^2, \dots, x_d^2)$
3. $\boldsymbol{\Phi}(\mathbf{x}) = (\zeta, \sqrt{2\gamma\zeta}x_1, \dots, \sqrt{2\gamma\zeta}x_d, x_1^2, \dots, x_d^2)$
4. $\boldsymbol{\Phi}(\mathbf{x}) = (\zeta, \sqrt{2\gamma\zeta}x_1, \dots, \sqrt{2\gamma\zeta}x_d, \gamma x_1^2, \dots, \gamma x_d^2)$

**Answer: 4.** Expand the target first:

$$
(\zeta + \gamma\,\mathbf{x}^\top\mathbf{x}')^2 = \zeta^2 + 2\gamma\zeta\,\mathbf{x}^\top\mathbf{x}' + \gamma^2(\mathbf{x}^\top\mathbf{x}')^2
$$

The handout's answer says we need $\zeta^2$ from the 0-th order terms, $2\gamma\zeta\,\mathbf{x}^\top\mathbf{x}'$ from the 1-st order terms, and $\gamma^2(\mathbf{x}^\top\mathbf{x}')^2$ from the 2-nd order terms. If a segment of the transform is multiplied by a constant $c$, the inner product of that segment is multiplied by $c^2$, so the constants of the three segments must be $\zeta$, $\sqrt{2\gamma\zeta}$, and $\gamma$ in order. Computing the inner product for each of the four choices:

| Choice | Inner product | Compared with the target |
|---|---|---|
| 1 | $1 + 2\gamma\,\mathbf{x}^\top\mathbf{x}' + \gamma^2(\mathbf{x}^\top\mathbf{x}')^2$ | Equal only when $\zeta = 1$ |
| 2 | $\zeta^2 + 2\gamma\,\mathbf{x}^\top\mathbf{x}' + (\mathbf{x}^\top\mathbf{x}')^2$ | The first-order term is missing $\zeta$, and the second-order term is missing $\gamma^2$ |
| 3 | $\zeta^2 + 2\gamma\zeta\,\mathbf{x}^\top\mathbf{x}' + (\mathbf{x}^\top\mathbf{x}')^2$ | The second-order term is missing $\gamma^2$ |
| 4 | $\zeta^2 + 2\gamma\zeta\,\mathbf{x}^\top\mathbf{x}' + \gamma^2(\mathbf{x}^\top\mathbf{x}')^2$ | Equal |

This article expanded all four transforms numerically with $\gamma = 0.7$, $\zeta = 1.3$, and two random three-dimensional vectors; only choice 4's inner product equals $(\zeta + \gamma\,\mathbf{x}^\top\mathbf{x}')^2$.

An addition in this article: this question also explains why the handout requires $\zeta \ge 0$. The first-order coefficient in choice 4 is $\sqrt{2\gamma\zeta}$; with $\gamma > 0$, a negative $\zeta$ has no real square root, so the transform cannot be written with real numbers. The lecture does not derive this condition; Lin only says that going back through the derivation gives it. What is said aloud is that $\zeta$ must be greater than 0, while the slide writes $\zeta \ge 0$. This article follows the slide, because with $\zeta = 0$ the transform in choice 4 can still be written down (the constant and first-order terms become 0), and $\zeta = 0$ is exactly what the linear kernel uses. What goes wrong when $\zeta$ is negative gets a concrete example in the Fun Time of the section comparing kernels.

## An infinite-dimensional transform still has a computable inner product: the Gaussian kernel

```youtube
url: https://www.youtube.com/watch?v=_-fIkbSBdF8
title: Kernel Support Vector Machine :: Gaussian Kernel @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–07:21 derives the infinite-dimensional transform, 07:21–09:27 covers the hypothesis of the Gaussian SVM and the name RBF, 09:27–11:27 reviews the support vector mechanism, 11:27–13:59 looks at the results for three values of γ, and Fun Time follows.)

### The derivation in one dimension

In the lecture, Lin opens with what is described there as a very crazy idea: since a kernel lets us pretend we did the transform and the inner product in the Z space, can this shortcut be pushed to the limit and used with an infinite-dimensional transform? Back when every component in the Z space had to be computed before taking the inner product, infinitely many dimensions were unthinkable. Page 12 of the handout answers: yes, if $K(\mathbf{x}, \mathbf{x}')$ is efficiently computable.

To see it clearly, let the input have just one dimension, $\mathbf{x} = (x)$, and consider this function:

$$
K(x, x') = \exp\big(-(x - x')^2\big)
$$

It is a Gaussian function. This time the direction is the reverse of the polynomial kernel: there the transform came first and the kernel was worked out from it; here the function comes first, and the task is to find which transform it is the inner product of. The derivation has four steps.

**Step 1: expand the square.** $-(x - x')^2 = -x^2 - x'^2 + 2xx'$, and adding exponents means multiplying:

$$
K(x, x') = \exp(-x^2)\,\exp(-x'^2)\,\exp(2xx')
$$

Of the first two factors, one contains only $x$ and the other only $x'$, so they are already separated. The slide marks the parts containing only $x$ in blue and the parts containing only $x'$ in red. The third factor, $\exp(2xx')$, mixes the two; in the lecture Lin calls it purple, and the remaining work is to split the purple into blue and red.

**Step 2: Taylor expansion.** The expansion of the exponential function is $\exp(a) = \sum_{i=0}^{\infty} \frac{a^i}{i!}$. Take $a = 2xx'$:

$$
\exp(2xx') = \sum_{i=0}^{\infty}\frac{(2xx')^i}{i!} = \sum_{i=0}^{\infty}\frac{2^i}{i!}\,x^i\,x'^i
$$

**Step 3: split the coefficient evenly between the two sides.** In each term $x^i$ goes to blue and $x'^i$ goes to red, and the remaining coefficient $\frac{2^i}{i!}$ belongs to neither. In the lecture, Lin treats it like dividing up a family's property: to split a number evenly between two sides, give each its square root. This is the same thing as setting $\sqrt{2}$ for the polynomial kernel, only in the opposite direction: there the transform's coefficients were chosen and then the kernel was examined; here the coefficient is already present and has to be divided back between the two sides. Move the first two factors inside the sum as well:

$$
K(x, x') = \sum_{i=0}^{\infty}\Big(\exp(-x^2)\sqrt{\frac{2^i}{i!}}\,x^i\Big)\Big(\exp(-x'^2)\sqrt{\frac{2^i}{i!}}\,x'^i\Big)
$$

**Step 4: recognize the inner product.** The two parentheses look exactly alike, except that one holds $x$ and the other $x'$, which means they are the $i$-th component of the same transform. Summing over $i$ from 0 to infinity is the inner product of two infinite-dimensional vectors:

$$
K(x, x') = \boldsymbol{\Phi}(x)^\top\boldsymbol{\Phi}(x'), \qquad \boldsymbol{\Phi}(x) = \exp(-x^2)\cdot\Big(1,\ \sqrt{\frac{2}{1!}}\,x,\ \sqrt{\frac{2^2}{2!}}\,x^2,\ \dots\Big)
$$

The components of $\boldsymbol{\Phi}(x)$ are $x^i$ of every order, each multiplied by a coefficient, and all of them multiplied by a common $\exp(-x^2)$ in front. So a Gaussian function hides an infinite-dimensional transform, and computing it takes one subtraction, one square, and one exponential.

**This article's numerical check (not from the slides).** Take $x = 1$ and $x' = 0.5$, so $K = \exp(-0.25) = 0.778801$. Multiply the components of $\boldsymbol{\Phi}(1)$ and $\boldsymbol{\Phi}(0.5)$ one pair at a time and accumulate:

| Up to term $i$ | Component $i$ of $\boldsymbol{\Phi}(1)$ | Component $i$ of $\boldsymbol{\Phi}(0.5)$ | Accumulated inner product |
|---|---|---|---|
| 0 | $0.3679$ | $0.7788$ | $0.2865$ |
| 1 | $0.5203$ | $0.5507$ | $0.5730$ |
| 2 | $0.5203$ | $0.2753$ | $0.7163$ |
| 4 | $0.3004$ | $0.0397$ | $0.7760$ |
| 6 | $0.1097$ | $0.0036$ | $0.77874$ |
| 8 | $0.0293$ | $0.0002$ | $0.77880$ |

With only the first 3 components the inner product is 0.7163, still 8% short of the true value; it takes up to term 8 to match to five decimal places. Every dimension of the infinite-dimensional vector really does contribute, just less and less further out.

The last line of the handout says "more generally": the version with multi-dimensional input and a scaling parameter is the Gaussian kernel:

$$
K(\mathbf{x}, \mathbf{x}') = \exp\big(-\gamma\lVert\mathbf{x} - \mathbf{x}'\rVert^2\big), \qquad \gamma > 0
$$

The handout does not derive this general form, and in the lecture Lin only says it can be proved that an infinite-dimensional transform is buried in it as well. An addition in this article, sketching the derivation. In one dimension with $\gamma$, the four steps are identical, except that $2xx'$ becomes $2\gamma xx'$, giving $\boldsymbol{\Phi}(x) = \exp(-\gamma x^2)\big(1, \sqrt{\frac{2\gamma}{1!}}x, \sqrt{\frac{(2\gamma)^2}{2!}}x^2, \dots\big)$. In several dimensions, $\lVert\mathbf{x} - \mathbf{x}'\rVert^2 = \mathbf{x}^\top\mathbf{x} - 2\,\mathbf{x}^\top\mathbf{x}' + \mathbf{x}'^\top\mathbf{x}'$, and the mixed factor becomes $\exp(2\gamma\,\mathbf{x}^\top\mathbf{x}') = \sum_i \frac{(2\gamma)^i}{i!}(\mathbf{x}^\top\mathbf{x}')^i$. Here $(\mathbf{x}^\top\mathbf{x}')^i$ is the $i$-th order polynomial kernel with $\zeta = 0$ and $\gamma = 1$, which is itself the inner product of the vectors made of all monomials of order $i$; multiply the vector for each $i$ by $\sqrt{(2\gamma)^i/i!}$ and concatenate them all into one long list, and that is the infinite-dimensional $\boldsymbol{\Phi}$.

### What the hypothesis of the Gaussian SVM looks like

With the kernel in hand, drop it straight into the four-step algorithm from the kernel trick section. Page 13 of the handout writes out the final classifier:

$$
g_{\text{SVM}}(\mathbf{x}) = \text{sign}\Big(\sum_{\text{SV}}\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + b\Big) = \text{sign}\Big(\sum_{\text{SV}}\alpha_n y_n \exp\big(-\gamma\lVert\mathbf{x} - \mathbf{x}_n\rVert^2\big) + b\Big)
$$

Viewed as a function of $\mathbf{x}$, $\exp(-\gamma\lVert\mathbf{x} - \mathbf{x}_n\rVert^2)$ is a Gaussian centered at $\mathbf{x}_n$. So $g_{\text{SVM}}$ is a linear combination of Gaussians, each centered at a support vector, with coefficient $\alpha_n y_n$.

The Gaussian kernel's other name, the Radial Basis Function (RBF) kernel, comes from this picture. In the lecture, Lin takes the name apart: radial refers to a function, like the Gaussian, that spreads outward from some center; basis function refers to a function used in a linear combination. Lin also mentions that the RBF kernel you see in some SVM software means this one.

The same classifier can therefore be read in two ways, and the lecture gives both:

- **From the process:** map the data into an infinite-dimensional space and find the fattest hyperplane there.
- **From the result:** SVM decides for you which Gaussians to use (centered at which support vectors) and how to combine them ($\alpha_n$; $y_n$ comes with the data).

The handout's summary puts the two in one sentence: Gaussian SVM finds $\alpha_n$ to combine Gaussians centered at $\mathbf{x}_n$ and achieves large margin in infinite-dimensional space.

### The support vector mechanism is now complete

Page 14 of the handout looks back at what the first three Techniques lectures achieve together. The table has only two rows:

| | large-margin hyperplanes + higher-order transforms with kernel trick |
|---|---|
| Number of boundaries | not many |
| Shape of the boundary | sophisticated |

The large margin leaves fewer boundaries to choose from, and the transform makes the boundaries sophisticated enough. Page 26 of the Techniques Lecture 1 handout already listed this combination as a new possibility (large-margin hyperplanes plus numerous feature transforms: not many, with sophisticated boundaries); the table on this page is the same column of that table, with the transform part rewritten as higher-order transforms with kernel trick. What was missing then was computational feasibility, and two replacements now supply it:

- The transformed vector $\mathbf{z} = \boldsymbol{\Phi}(\mathbf{x})$ is replaced by an efficient kernel $K(\mathbf{x}, \mathbf{x}')$.
- Storing the optimal $\mathbf{w}$ is replaced by storing a few support vectors and their $\alpha_n$.

As Lin puts it in the lecture, we stop insisting on two things: we no longer insist on computing $\mathbf{z}$, and we no longer insist on storing the $\mathbf{w}$ of the Z space, only its representation. The handout says the Gaussian SVM brings a new possibility: infinite-dimensional linear classification, with generalization 'guarded by' large-margin.

### What happens when γ is too large

Is the story really that rosy? In the lecture, Lin asks this question and then turns to the three plots on page 15 of the handout. Same data, same Gaussian kernel, only $\gamma$ changes:

| $\gamma$ | What the boundary looks like | How Lin describes it in the lecture |
|---|---|---|
| $1$ | A smooth curve, with all the red crosses below it | Looks pretty good; the large margin is doing its job |
| $10$ | The boundary grows several bumps and dents, and the red region puts out tentacles | Like an amoeba |
| $100$ | Each red cross is wrapped in its own small loop (a few that sit very close merge into one), and everything else is blue | Every cross is a small island, each going its own way |

Why does this happen? Lin's explanation in the lecture: a larger $\gamma$ amounts to a smaller standard deviation for the Gaussian, so the Gaussian gets sharper; the classifier is a linear combination of Gaussians, and once they are all sharp, the combination comes out as one small island after another. The handout writes large $\gamma$ ⟹ sharp Gaussians ⟹ 'overfit'?, and the next line, in red, is warning: SVM can still overfit.

In the lecture, Lin is blunt about this: in the infinite-dimensional space, SVM feels good about itself and believes it has found the fattest boundary, but that fatness, mapped back to the original space, is not necessarily enough. Whether the protection of the large margin is strong enough also depends on the transform itself; the two work together. So the handout's conclusion is that the Gaussian SVM needs careful selection of $\gamma$, and Lin's advice in the lecture is that you usually should not use too large a $\gamma$.

**An example made up for this article: islands on three points.** Go back to the three points from the kernel trick section ($-1$, $0$, $1$, with labels $+1$, $-1$, $+1$), change the kernel to $\exp(-\gamma(x - x')^2)$, and keep the four steps as they are. Adjacent points are at distance 1, and their kernel value is written $k = e^{-\gamma}$; the two end points are at distance 2, written $m = e^{-4\gamma}$; a point with itself gives 1.

$$
Q_D = \begin{bmatrix} 1 & -k & m \\ -k & 1 & -k \\ m & -k & 1 \end{bmatrix}
$$

Again eliminate $\alpha_2$ with $\alpha_2 = \alpha_1 + \alpha_3$ and write $s = \alpha_1 + \alpha_3$; the objective function is $\frac{1}{2}\big(\alpha_1^2 + \alpha_3^2 + 2m\alpha_1\alpha_3 + (1 - 2k)s^2\big) - 2s$. Take partial derivatives with respect to $\alpha_1$ and $\alpha_3$:

$$
\alpha_1 + m\alpha_3 + (1 - 2k)s - 2 = 0, \qquad \alpha_3 + m\alpha_1 + (1 - 2k)s - 2 = 0
$$

Subtracting the two equations gives $(1 - m)(\alpha_1 - \alpha_3) = 0$, so $\alpha_1 = \alpha_3 = a$ and $s = 2a$. Substituting back: $a\,(1 + m + 2 - 4k) = 2$,

$$
\alpha_1 = \alpha_3 = \frac{2}{3 - 4k + m}, \qquad \alpha_2 = 2\alpha_1
$$

Compute $b$ from point 2: $b = -1 - \big[a k - 2a + a k\big] = -1 + 2a(1 - k)$. The classifier is

$$
g_{\text{SVM}}(x) = \text{sign}\Big(a\,e^{-\gamma(x+1)^2} - 2a\,e^{-\gamma x^2} + a\,e^{-\gamma(x-1)^2} + b\Big)
$$

Three Gaussians, each centered at a support vector, with a negative coefficient on the middle one. Try three values of $\gamma$:

| $\gamma$ | $k = e^{-\gamma}$ | $m = e^{-4\gamma}$ | $\alpha_1 = \alpha_3$ | $\alpha_2$ | $b$ | Region classified $-1$ |
|---|---|---|---|---|---|---|
| $1$ | $0.3679$ | $0.0183$ | $1.2930$ | $2.5860$ | $0.6347$ | $\lvert x\rvert < 0.588$ |
| $10$ | $4.5 \times 10^{-5}$ | $4.2 \times 10^{-18}$ | $0.6667$ | $1.3334$ | $0.3334$ | $\lvert x\rvert < 0.367$ |
| $100$ | $3.7 \times 10^{-44}$ | about $0$ | $0.6667$ | $1.3333$ | $0.3333$ | $\lvert x\rvert < 0.118$ |

All three values of $\gamma$ classify the training data perfectly, and $y_n \times$ score is 1 for all three training points (this article checked each one). The difference is the size of the region around the negative example: it is 1.18 wide when $\gamma = 1$ and only 0.24 wide when $\gamma = 100$. To the $\gamma = 100$ classifier, only points hugging $x = 0$ are negative. $x = 0.2$ is 0.2 away from the negative example and 0.8 away from the nearest positive one, yet it is classified $+1$, because all three Gaussians have decayed to almost 0 there and the score is just $b = \frac{1}{3}$. This is the one-dimensional version of the islands in the handout's plot: a short distance away from every training point, a single constant is all that is left to decide the classification. By comparison, the polynomial kernel gives a negative region of $\lvert x\rvert < 0.707$ on the same data.

With only three points, there is no saying which $\gamma$ is right. What this example shows is the mechanism: the larger $\gamma$ is, the smaller the range each support vector can influence.

### Fun Time: the kernel as γ goes to infinity

**Question (page 16):** Consider the Gaussian kernel $K(\mathbf{x}, \mathbf{x}') = \exp(-\gamma\lVert\mathbf{x} - \mathbf{x}'\rVert^2)$. What function does the kernel converge to if $\gamma \to \infty$? ($[\![\cdot]\!]$ is the indicator function: 1 when the condition holds and 0 when it does not.)

1. $K_{\lim}(\mathbf{x}, \mathbf{x}') = 0$
2. $K_{\lim}(\mathbf{x}, \mathbf{x}') = [\![\mathbf{x} = \mathbf{x}']\!]$
3. $K_{\lim}(\mathbf{x}, \mathbf{x}') = [\![\mathbf{x} \ne \mathbf{x}']\!]$
4. $K_{\lim}(\mathbf{x}, \mathbf{x}') = 1$

**Answer: 2.** There are two cases. When $\mathbf{x} = \mathbf{x}'$ the distance is 0 and $\exp(0) = 1$, regardless of $\gamma$. When $\mathbf{x} \ne \mathbf{x}'$ the squared distance is some positive number $c$, and $\exp(-\gamma c)$ goes to 0 as $\gamma \to \infty$. The handout's answer says this limit is an impulse function, an extreme case of how the Gaussian gets sharper as $\gamma$ grows.

Choice 1 misses the case $\mathbf{x} = \mathbf{x}'$; choice 3 has the two cases reversed; choice 4 is the limit in the other direction, since the kernel approaches 1 everywhere only when $\gamma \to 0$.

Lin's comment on this limit in the lecture is that the kernel is merely recognizing whether each example is itself, and you can imagine how little tolerance it has for measurement error. The three-point example above shows this limit directly: $k$ and $m$ both become 0, $Q_D$ becomes the identity matrix, and the solution is $\boldsymbol{\alpha} = (\frac{2}{3}, \frac{4}{3}, \frac{2}{3})$ with $b = \frac{1}{3}$; the $\gamma = 100$ row of the table is already nearly identical to it. At that point the classifier gives $1$, $-1$, $1$ only at the three training points themselves and outputs $\text{sign}(\frac{1}{3}) = +1$ everywhere else: the training data are all correct, but the only thing it has learned is to memorize these three points.

## How to choose among three kernels, and which functions count as kernels

```youtube
url: https://www.youtube.com/watch?v=sacJmcs8TKE
title: Kernel Support Vector Machine :: Comparison of Kernels @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–01:51 covers the linear kernel, 01:51–04:47 the polynomial kernel, 04:47–06:53 the Gaussian kernel, 06:53–11:16 other valid kernels and Mercer's condition, 11:16–11:52 is Fun Time, and the summary of the whole lecture follows.)

### Pros and cons of the three kernels

Pages 17 to 19 of the handout each spend one page listing the Cons and Pros of one kernel. Here they are merged into one table first, followed by what the lecture adds.

| Kernel | Cons | Pros | The handout's one-liner |
|---|---|---|---|
| linear: $\mathbf{x}^\top\mathbf{x}'$ | restricted, the data are not always linearly separable | safe; fast, with a special QP solver in primal; very explainable, $\mathbf{w}$ and the SVs say something | an important basic tool |
| polynomial: $(\zeta + \gamma\,\mathbf{x}^\top\mathbf{x}')^Q$ | numerical difficulty for large $Q$; three parameters $(\gamma, \zeta, Q)$, more difficult to select | less restricted than linear; $Q$ has a clear physical meaning | perhaps small-$Q$ only |
| Gaussian: $\exp(-\gamma\lVert\mathbf{x} - \mathbf{x}'\rVert^2)$ | mysterious, with no $\mathbf{w}$; slower than linear; possibly too powerful | more powerful than the other two; bounded, with less numerical difficulty than polynomial; one parameter only | one of most popular but shall be used with care |

**The linear kernel.** The lecture goes into more detail on why it is fast: because no transform is involved, a special QP solver can be designed for the primal problem, and that is usually faster than going through the dual, where computing $Q_D$ alone takes a lot of effort. Explainable means that each component of $\mathbf{w}$ is the weight of the corresponding feature, while the support vectors tell you which points the machine considers important. For the Cons cell, the slide shows a plot: red crosses spread around the outside and blue circles in the middle, which no straight line can separate. Lin's positioning in the lecture: if you are going to use SVM, linear is the tool you should try first.

**The polynomial kernel.** The handout gives the source of the numerical difficulty in two lines: when $\lvert\zeta + \gamma\,\mathbf{x}^\top\mathbf{x}'\rvert < 1$, $K \to 0$, and when it is greater than 1, $K$ becomes big. The lecture uses the 20th power as its example; this article works it out: $0.5^{20} \approx 9.5 \times 10^{-7}$ and $2^{20} = 1{,}048{,}576$, so bases that differ by only a factor of 4 give kernel values 12 orders of magnitude apart. Lin says in the lecture that such a wide numerical range is hard work for a general QP solver and makes inaccurate solutions more likely. The example of physical meaning: if you believe the relationship among features is at most cubic, you can express that picture directly with $Q = 3$. The price of having many parameters is that trying all the combinations of $(\gamma, \zeta, Q)$ takes a lot of time.

The footer of the handout page has a sentence that is easy to skip: the polynomial kernel is sometimes efficiently done by linear on $\boldsymbol{\Phi}_Q(\mathbf{x})$. Lin expands on it in the lecture: when the order is very low (second or third, say) and $\tilde{d}$ is not too large yet, expanding the transform directly and solving with a special solver for the primal linear SVM is sometimes faster; there is no need to assume a polynomial transform must go through a kernel.

**The Gaussian kernel.** It is bounded because the value of a Gaussian function lies between 0 and 1, so it does not blow up the way a polynomial does. For why it is hard to explain, Lin sets a scene in the lecture: your boss asks how this model classifies, and you answer that it first goes to an infinite-dimensional space, finds the fattest thing there, and then comes back; the boss has zoned out by the second sentence. It is slower than linear because the dual problem has to be solved and $Q_D$ has to be computed. Too powerful refers to the islands in the Gaussian kernel section. Lin's summary in the lecture is that it is probably one of the most commonly used SVM kernels, at the price that the parameter has to be chosen carefully, the computation takes waiting, and you do not fully know how the classification is being made.

Page 22 of the handout wraps this section into one phrase: linear for efficiency or Gaussian for power.

### Can other functions serve as kernels: Mercer's condition

Are these three the only options? Page 20 of the handout starts from what a kernel means: a kernel represents a special similarity, namely $\boldsymbol{\Phi}(\mathbf{x})^\top\boldsymbol{\Phi}(\mathbf{x}')$. In the lecture, Lin explains why an inner product is a similarity: when two vectors are perpendicular the inner product is 0, and you can say they are very dissimilar; when they point in opposite directions the inner product is negative.

So can you take whatever similarity function you like and feed it to SVM as a kernel? The handout's answer is not really. A kernel is a similarity, but it is the specific similarity "inner product of vectors in the Z space", and not every similarity can be written as an inner product in some space. Lin says in the lecture that if you want to use your own kernel, you have to find a way to show why it is a kernel.

Start with the necessary conditions: if $K$ really is the inner product of some $\boldsymbol{\Phi}$, what properties must it have?

**Symmetric.** The inner product of vectors is symmetric, $\boldsymbol{\Phi}(\mathbf{x})^\top\boldsymbol{\Phi}(\mathbf{x}') = \boldsymbol{\Phi}(\mathbf{x}')^\top\boldsymbol{\Phi}(\mathbf{x})$, so $K(\mathbf{x}, \mathbf{x}') = K(\mathbf{x}', \mathbf{x})$.

**The kernel matrix is positive semi-definite.** Take $N$ points $\mathbf{x}_1, \dots, \mathbf{x}_N$ of your choice and arrange $k_{ij} = K(\mathbf{x}_i, \mathbf{x}_j)$ into an $N \times N$ matrix; the handout also writes this matrix as $K$:

$$
K = \begin{bmatrix} \boldsymbol{\Phi}(\mathbf{x}_1)^\top\boldsymbol{\Phi}(\mathbf{x}_1) & \boldsymbol{\Phi}(\mathbf{x}_1)^\top\boldsymbol{\Phi}(\mathbf{x}_2) & \cdots & \boldsymbol{\Phi}(\mathbf{x}_1)^\top\boldsymbol{\Phi}(\mathbf{x}_N) \\ \boldsymbol{\Phi}(\mathbf{x}_2)^\top\boldsymbol{\Phi}(\mathbf{x}_1) & \boldsymbol{\Phi}(\mathbf{x}_2)^\top\boldsymbol{\Phi}(\mathbf{x}_2) & \cdots & \boldsymbol{\Phi}(\mathbf{x}_2)^\top\boldsymbol{\Phi}(\mathbf{x}_N) \\ \vdots & \vdots & \ddots & \vdots \\ \boldsymbol{\Phi}(\mathbf{x}_N)^\top\boldsymbol{\Phi}(\mathbf{x}_1) & \boldsymbol{\Phi}(\mathbf{x}_N)^\top\boldsymbol{\Phi}(\mathbf{x}_2) & \cdots & \boldsymbol{\Phi}(\mathbf{x}_N)^\top\boldsymbol{\Phi}(\mathbf{x}_N) \end{bmatrix}
$$

In each entry the left factor depends only on the row and the right factor only on the column (blue and red respectively on the slide). Treat each $\mathbf{z}_n = \boldsymbol{\Phi}(\mathbf{x}_n)$ as a row and stack them into a matrix $Z$, and the whole matrix is

$$
K = \begin{bmatrix} \mathbf{z}_1 & \mathbf{z}_2 & \cdots & \mathbf{z}_N \end{bmatrix}^\top \begin{bmatrix} \mathbf{z}_1 & \mathbf{z}_2 & \cdots & \mathbf{z}_N \end{bmatrix} = ZZ^\top
$$

The handout says $ZZ^\top$ must always be positive semi-definite, and in the lecture Lin says this is a very basic result in linear algebra. This article fills in the step: for every vector $\mathbf{v} \in \mathbb{R}^N$,

$$
\mathbf{v}^\top K\mathbf{v} = \mathbf{v}^\top ZZ^\top\mathbf{v} = (Z^\top\mathbf{v})^\top(Z^\top\mathbf{v}) = \Big\lVert\sum_{n=1}^{N} v_n\mathbf{z}_n\Big\rVert^2 \ge 0
$$

The squared length of a vector cannot be negative, and that is the definition of positive semi-definite.

Together these two are called Mercer's condition. The handout writes necessary & sufficient: they are not only necessary conditions but sufficient ones too. For a function that satisfies both, there is guaranteed to be some $\boldsymbol{\Phi}$ that makes it equal to $\boldsymbol{\Phi}(\mathbf{x})^\top\boldsymbol{\Phi}(\mathbf{x}')$. In the lecture, Lin notes that sufficiency was proved by mathematicians, is harder, and is not covered in this course.

The condition can be used in two directions, and they differ greatly in difficulty. To reject a function, it is enough to find one data set whose matrix is not positive semi-definite, which is what the Fun Time below does. To accept a function, you must prove that the matrix is positive semi-definite for every data set and every $N$, and Lin says in the lecture that this is really not that easy. The handout's comment: define your own kernel: possible, but hard. Lin's advice in the lecture is to keep this condition in mind if the day comes when you really do want to define your own kernel.

An addition in this article on how this relates to SVM. As an addition in the article on [Techniques Lecture 2: Dual SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm-en) noted, the dual problem is convex because $\boldsymbol{\alpha}^\top Q_D\boldsymbol{\alpha} = \lVert\sum_n \alpha_n y_n\mathbf{z}_n\rVert^2 \ge 0$. With a kernel, $\boldsymbol{\alpha}^\top Q_D\boldsymbol{\alpha} = \sum_n\sum_m (\alpha_n y_n)(\alpha_m y_m)K(\mathbf{x}_n, \mathbf{x}_m)$, which is $\mathbf{v}^\top K\mathbf{v}$ with $v_n = \alpha_n y_n$. Only when the kernel matrix is positive semi-definite is $Q_D$ positive semi-definite, and only then is the QP convex. Feed in an invalid function and there is no Z space behind it, and what gets handed to the QP solver may no longer be a convex problem.

### Fun Time: which one is not a valid kernel

**Question (page 21):** Which of the following is not a valid kernel? (Hint: Consider two 1-dimensional vectors $\mathbf{x}_1 = (1)$ and $\mathbf{x}_2 = (-1)$ and check Mercer's condition.)

1. $K(\mathbf{x}, \mathbf{x}') = (-1 + \mathbf{x}^\top\mathbf{x}')^2$
2. $K(\mathbf{x}, \mathbf{x}') = (0 + \mathbf{x}^\top\mathbf{x}')^2$
3. $K(\mathbf{x}, \mathbf{x}') = (1 + \mathbf{x}^\top\mathbf{x}')^2$
4. $K(\mathbf{x}, \mathbf{x}') = (-1 - \mathbf{x}^\top\mathbf{x}')^2$

**Answer: 1.** Follow the hint and compute the four 2×2 matrices. The inner products of the two points are $\mathbf{x}_1^\top\mathbf{x}_1 = 1$, $\mathbf{x}_1^\top\mathbf{x}_2 = -1$, and $\mathbf{x}_2^\top\mathbf{x}_2 = 1$.

| Choice | Diagonal: $K(\mathbf{x}_1, \mathbf{x}_1) = K(\mathbf{x}_2, \mathbf{x}_2)$ | Off-diagonal: $K(\mathbf{x}_1, \mathbf{x}_2)$ | Eigenvalues |
|---|---|---|---|
| 1 | $(-1 + 1)^2 = 0$ | $(-1 - 1)^2 = 4$ | $4$ and $-4$ |
| 2 | $(0 + 1)^2 = 1$ | $(0 - 1)^2 = 1$ | $2$ and $0$ |
| 3 | $(1 + 1)^2 = 4$ | $(1 - 1)^2 = 0$ | $4$ and $4$ |
| 4 | $(-1 - 1)^2 = 4$ | $(-1 + 1)^2 = 0$ | $4$ and $4$ |

For a 2×2 symmetric matrix whose diagonal entries are both $p$ and whose off-diagonal entries are both $q$, the eigenvalues are $p + q$ and $p - q$ (with eigenvectors $(1, 1)$ and $(1, -1)$). The matrix for choice 1 is

$$
K = \begin{bmatrix} 0 & 4 \\ 4 & 0 \end{bmatrix}
$$

It has a negative eigenvalue, so it is not positive semi-definite. A direct check works too: take $\mathbf{v} = (1, -1)$, and $\mathbf{v}^\top K\mathbf{v} = 0 - 4 - 4 + 0 = -8 < 0$. One data set is enough to reject it.

For the other three choices, the matrix from these two points is positive semi-definite, but that only shows they passed this one test and cannot be taken as proof of validity. The handout's answer gives the real reasons: choices 2 and 3 are just polynomial kernels ($\zeta = 0$ and $\zeta = 1$, with $\gamma = 1$ and $Q = 2$), which have explicit transforms; choice 4 is the same function as choice 3, because $(-1 - t)^2 = (1 + t)^2$.

Two additions in this article. First, choice 1 is the "polynomial kernel" with $\zeta = -1$, which violates the handout's requirement $\zeta \ge 0$ and picks up the question left open by the Fun Time in the polynomial kernel section. Second, the contradiction is visible even without eigenvalues: $K(\mathbf{x}_1, \mathbf{x}_1) = 0$ means $\lVert\boldsymbol{\Phi}(\mathbf{x}_1)\rVert^2 = 0$, so $\boldsymbol{\Phi}(\mathbf{x}_1)$ can only be the zero vector; the inner product of the zero vector with every vector is 0, yet $K(\mathbf{x}_1, \mathbf{x}_2)$ is 4.

What happens if you force it into SVM anyway? This article's trial calculation: label $\mathbf{x}_1$ as $+1$ and $\mathbf{x}_2$ as $-1$; the diagonal of $Q_D$ is 0 and the off-diagonal is $(+1)(-1)(4) = -4$. The equality constraint gives $\alpha_1 = \alpha_2 = a$, and the objective function is $\frac{1}{2}(-8a^2) - 2a = -4a^2 - 2a$, which keeps decreasing as $a$ grows and has no minimum. The dual problem simply breaks.

### Summary of this lecture and the next one

Page 22 of the handout wraps each of the four sections into one line: the kernel is a shortcut of transform + inner product; the polynomial kernel embeds a specially-scaled polynomial transform; the Gaussian kernel embeds an infinite dimensional transform; choose linear for efficiency or Gaussian for power.

At the end of the lecture, Lin points out one thing that has not been relaxed so far: from Techniques Lecture 1 until now, we have insisted that the data be linearly separable in the Z space. That insistence can make SVM fit the noise, and the overfitting seen in the Gaussian kernel section is related to it. The handout announces what the next lecture deals with: avoiding overfitting in Gaussian (and other kernels).

## Self-check

**1. Let $\mathbf{x} = (1, 2)$ and $\mathbf{x}' = (2, 0)$. Compute four kernel values: $K_{\boldsymbol{\Phi}_2}$; $K_2 = (1 + \gamma\,\mathbf{x}^\top\mathbf{x}')^2$ with $\gamma = 1$; the polynomial kernel with $\zeta = 2$, $\gamma = 0.5$, $Q = 3$; and the Gaussian kernel with $\gamma = 0.5$.**

Answer: $\mathbf{x}^\top\mathbf{x}' = 2$ and $\lVert\mathbf{x} - \mathbf{x}'\rVert^2 = (-1)^2 + 2^2 = 5$. In order: $1 + 2 + 4 = 7$; $(1 + 2)^2 = 9$; $(2 + 0.5 \times 2)^3 = 27$; $\exp(-2.5) \approx 0.0821$. All four numbers use only the inner product or the distance in the original space.

**2. In the three-point example (polynomial kernel $K_2 = (1 + xx')^2$, $\boldsymbol{\alpha} = (1, 2, 1)$, $b = -1$), do not use the simplified formula $2x^2 - 1$; predict the label of $x = 0.6$ using kernel values only.**

Answer: $K(-1, 0.6) = (1 - 0.6)^2 = 0.16$, $K(0, 0.6) = 1$, and $K(1, 0.6) = (1 + 0.6)^2 = 2.56$. The score is $(1)(+1)(0.16) + (2)(-1)(1) + (1)(+1)(2.56) - 1 = -0.28$, so the prediction is $-1$. Checking with $2 \times 0.36 - 1 = -0.28$ gives the same value.

**3. After training, a kernel SVM has no $\mathbf{w}$. So how is $b$ computed? And how is $\mathbf{w}^\top\boldsymbol{\Phi}(\mathbf{x})$ computed at prediction time?**

Criterion: the answer must say that $\mathbf{w} = \sum_n \alpha_n y_n\mathbf{z}_n$ is a linear combination of the support vectors; that $\mathbf{w}$ only appears in the form of an inner product with some $\mathbf{z}$, which after substitution becomes $\sum_n \alpha_n y_n\,\mathbf{z}_n^\top\mathbf{z}$, where every term is an inner product of two $\mathbf{z}$ vectors and can be replaced by $K(\mathbf{x}_n, \mathbf{x})$; and that therefore $b = y_s - \sum_{\text{SV}}\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}_s)$ and prediction uses $\sum_{\text{SV}}\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + b$. An answer that only says "use the kernel" without mentioning that $\mathbf{w}$ is a linear combination does not count as correct.

**4. Is $K(\mathbf{x}, \mathbf{x}') = -\mathbf{x}^\top\mathbf{x}'$ a valid kernel? What about $K(\mathbf{x}, \mathbf{x}') = 1 + \mathbf{x}^\top\mathbf{x}'$?**

Answer: the first is not. It is symmetric, but take just one point $\mathbf{x}_1 = (1)$ and the 1×1 matrix is $[-1]$, which is not positive semi-definite; put another way, $K(\mathbf{x}, \mathbf{x})$ is $\lVert\boldsymbol{\Phi}(\mathbf{x})\rVert^2$ and cannot be negative. The second is: it is the polynomial kernel with $\zeta = 1$, $\gamma = 1$, $Q = 1$, and its transform, $\boldsymbol{\Phi}(\mathbf{x}) = (1, x_1, \dots, x_d)$, can be written down directly.

**5. You have $N = 10{,}000$ examples and $d = 100$ features, and you want to train an SVM with a 10th-order polynomial transform. How many variables does the primal problem have to face? If you go through the kernel, roughly how much computation does preparing $Q_D$ take?**

Answer: the dimension of the 10th-order polynomial transform after removing duplicates is $\binom{110}{10} - 1 \approx 4.7 \times 10^{13}$, and the number of variables in the primal problem is that number plus 1; not even a single $\mathbf{z}_n$ can be stored. Through the kernel: $Q_D$ has $10^8$ entries (about half that with symmetry), each one a 100-dimensional inner product plus a few operations, for about $10^{10}$ multiplications in total, which an ordinary computer can do. The price is that $Q_D$ itself has $10^8$ entries to store, and that at prediction time every new example needs one kernel evaluation against each support vector.

## Exercises and corresponding reading

**The corresponding weeks in two semesters.** The [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) puts kernel SVM and soft-margin SVM in the same week (W10, 11/04), and the slide code for this lecture is `203u`. The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) likewise puts it in W10 (11/11), with the two lectures taught together. The Fall 2026 `203u_handout.pdf` link returned 404 when opened on 2026-09-30, so this article uses only the MOOC version of the handout.

**Textbook.** Both course pages map this lecture to e-8.3 of [Learning from Data](http://amlbook.com) (LFD). e-Chapter 8 is an online chapter of LFD and is not in the printed book.

**Homework.** The related problems are in [Fall 2024 HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf) (released 2024-11-18, due 12-02), which has no official solutions:

| Problem | Content | Where it connects to this lecture |
|---|---|---|
| Q1 | Apply the kernel trick to PLA: maintain $\boldsymbol{\alpha}$ instead of $\mathbf{w}$ | The step "$\mathbf{w}$ is a linear combination of the $\mathbf{z}_n$" used when computing $b$ and predicting |
| Q7 | With a large enough $\gamma$, the Gaussian kernel can achieve $E_{\text{in}} = 0$ | The Fun Time of the Gaussian kernel section and the three-point example |
| Q8 | Prove that $\exp(2\cos(x - x') - 2)$ is a valid kernel | Mercer's condition and the Gaussian kernel |
| Q10 | MNIST 3 versus 7, polynomial kernel, comparing the number of support vectors for different $C$ and $Q$ | The polynomial kernel ($C$ is a parameter from the next lecture) |
| Q11 | The same data, Gaussian kernel, comparing the margin for different $C$ and $\gamma$ | The Gaussian kernel ($C$ is a parameter from the next lecture) |

Q10 and Q11 use the soft-margin parameter $C$, so do them after reading the next lecture. The data for the programming problems is [mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2) from the LIBSVM website. The problem set recommends [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/) and warns about two things: do not let the package rescale the data automatically, or you have in effect changed the kernel; and confirm for yourself that the package solves the dual form from the lecture, with enough numerical precision. The first point connects directly to this lecture (the following is this article's explanation): multiplying all features by the same constant $c$ multiplies both $\mathbf{x}^\top\mathbf{x}'$ and $\lVert\mathbf{x} - \mathbf{x}'\rVert^2$ by $c^2$, which has the same effect as replacing $\gamma$ with $c^2\gamma$; scaling each feature by a different factor amounts to switching to another kernel. The guide to the whole assignment is in [Techniques Homework and Final Project](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en).

**Hands-on.** Redo the three-point example with a different kernel: use $K_{\boldsymbol{\Phi}_2}(x, x') = 1 + xx' + (xx')^2$ and follow the four steps to solve for $\boldsymbol{\alpha}$, $b$, and the boundary. This article has worked it out, and the answer is still $\boldsymbol{\alpha} = (1, 2, 1)$, $b = -1$, and the boundary $2x^2 - 1 = 0$. Think about why the two kernels give the same answer on this data (hint: the two transforms differ only in the coefficient of the first-order term, and what is the first-order component of the optimal $\mathbf{w}$?).

**Further reading.** [Chapter 5 of the CS229 main notes](https://cs229.stanford.edu/main_notes.pdf) introduces kernel methods in a different order and can be read side by side with this lecture's presentation. [Caltech Learning from Data](https://work.caltech.edu/telecourse) is the English-language course for the same textbook.

**Next lecture.** [Techniques Lecture 4: Soft-Margin SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-04-soft-margin-svm-en) relaxes the requirement that the data be perfectly separated and deals with the overfitting this lecture saw with the Gaussian kernel.

## Course video sources

Original videos: [Kernel Trick](https://www.youtube.com/watch?v=oOi7kqUTqxw), [Polynomial Kernel](https://www.youtube.com/watch?v=Fb-WSBvsPak), [Gaussian Kernel](https://www.youtube.com/watch?v=_-fIkbSBdF8), [Comparison of Kernels](https://www.youtube.com/watch?v=sacJmcs8TKE)

- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist on that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-13: Originally combined with Lecture 4 in one article; changed to one article per lecture and rewritten from the handout and the video transcripts.
- 2026-10-10: Rechecked the video status. The embedded videos match the lecture numbering of the official playlist.
- 2026-10-10: Marked the video status and verified the recording sources and how they were obtained.

## References

- [Techniques Lecture 3 handout, 203_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/203_handout.pdf): the main source for this article. The derivations in the four sections, the four Fun Time questions, the plots on pages 8, 9, and 15, and the pros and cons of the three kernels all come from this handout.
- [Techniques Lecture 2: Dual SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm-en): the dual problem, the KKT conditions, and the formulas that recover w and b from α, which this lecture uses directly.
- [Foundations Lecture 12: Nonlinear Transformation](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation-en): the dimension formula for the Q-th order polynomial transform, used to convert to d̃.
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the corresponding week and LFD chapter.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the corresponding week and LFD chapter.
- [Fall 2024 Homework 6 (hw6_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf): the content of Q1, Q7, Q8, Q10, and Q11.
- [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/): the package recommended for the HW6 programming problems.
- [LIBSVM Data: mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2): the data for the HW6 programming problems.
- [Learning from Data textbook website](http://amlbook.com): the source of e-8.3.
- [CS229 main notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf): further reading, the kernel methods in Chapter 5.
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse): further reading, the English-language course for the same textbook.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
