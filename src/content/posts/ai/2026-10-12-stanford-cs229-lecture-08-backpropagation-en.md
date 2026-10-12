---
title: "Backpropagation: Why Computing the Gradient Costs Only One Forward Pass | Stanford CS229 Lecture 8"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, backpropagation, neural-networks, deep-learning]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 8
tldr: "The lecture starts from one theorem: if a scalar function can be computed with N basic operations, its gradient can also be computed in O(N) time. The method is to read the chain rule as \"given ∂J/∂u, you can compute ∂J/∂z, using only information about the module in between\", then derive a backward function for matrix multiplication and for the activation function: Wᵀv, vzᵀ, and σ′(z)⊙v. This article also works a forward and backward pass by hand on a small 2-2-1 network."
description: "A guide to Lecture 8 of Stanford CS229 Spring 2026: the O(N) theorem behind backpropagation, the chain rule in transposed-Jacobian form, the derivation of the backward functions for matrix multiplication and activation functions, and one complete hand-computed example."
draft: false
math: true
---

> 🌏 [中文版](/posts/ai/2026-10-12-stanford-cs229-lecture-08-backpropagation)

**Video status: Videos included.** This article is written from the English transcript of the Spring 2026 Lecture 8 recording published by Stanford Online, with notation matched to Section 7.4 of Chapter 7 in the 2026 main lecture notes. Almost the whole lecture is at the board; I did not see the board, so the equations on it are reconstructed from the notes.

[The previous lecture](/posts/ai/2026-10-12-stanford-cs229-lecture-07-neural-network-architecture-en) broke a neural network into modules such as matrix multiplication, activation functions, and LayerNorm, and left one question open: every SGD step needs the gradient of the loss with respect to all the parameters, so how do you compute it? Lecture 8 spends the whole hour on that. The lecturer is Tengyu Ma (in class he calls the notes "my lecture notes"; the main notes list Tengyu Ma and Andrew Ng as authors), and this is one of the lectures in [Stanford CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en) that is board derivation almost from start to finish.

The prerequisites are the multivariable chain rule, matrix multiplication and transposes, and the MLP notation from the previous lecture. After reading, you should be able to compute the gradient of every parameter of a small MLP by hand, say which equation each step uses, and explain why the whole backward pass costs the same order as one forward pass.

```youtube
url: https://www.youtube.com/watch?v=ne2ngVAoMG8
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 8: Neural Networks 2 (Backprop)
captions: en
```

## The problem this lecture solves (recording 00:05–03:40)

The lecturer first reviews the setup from last time. The loss function is the average of the per-example losses, and the loss on example $i$, $J^{(i)}(\theta)$, is the number you get by feeding the model output $h_\theta(x^{(i)})$ and the label $y^{(i)}$ into some loss such as cross-entropy. The simplest SGD draws one random example $i_k$ per step and updates

$$
\theta \leftarrow \theta - \eta\,\nabla J^{(i_k)}(\theta).
$$

The whole lecture cares about one thing in that formula, $\nabla J^{(i_k)}(\theta)$. The model is many layers of matrix multiplications and activation functions stacked together. How do you compute this gradient efficiently?

The way the lecturer positions the question is interesting. He says that how to tune the learning rate or design a dataset always involves some subjective judgment, while backpropagation has a definite answer:

> "this kind of questions, is one of the most technical questions you can ask in deep learning these days" (around 02:10)

He also mentions that research labs used to love asking candidates to derive backpropagation by hand in interviews. Today's frameworks all do auto-differentiation, so you do not have to write it yourself, but he thinks it is worth understanding because many later decisions "depends on fundamentally, how it works to some degree" (around 03:12). The memory release and computation ordering that come up in the second half of the lecture are decisions of this kind.

## One theorem: computing the gradient is as fast as computing the function (recording 03:40–12:26)

The lecturer does not start from neural networks. He begins with a more general statement.

**Differentiable circuit.** Draw the computation of a function as a graph: the inputs are $x_1, x_2, \dots$, and each node is an arithmetic operation (add, subtract, multiply, divide) or an elementary function (sin, cos, exp, sigmoid, and so on). The example in class first computes $x_1 + x_2$, then multiplies by $x_3$ to get $(x_1+x_2)\,x_3$; another path takes the same $x_1+x_2$ and adds $x_4$. A circuit differs from a formula in one respect only: intermediate results can be reused. In a formula, using $x_1+x_2$ twice means writing it twice; in a circuit it is computed once. The lecturer says this is really just a kind of computational graph.

**The size $N$ of a circuit** is the number of operation nodes. Assuming each basic operation takes $O(1)$ time, computing the function value means walking through the circuit once, which takes $O(N)$ time.

**Theorem (Theorem 7.4.1 in the notes; both the lecture and the notes call the statement informal).** Suppose a differentiable circuit of size $N$ computes a real-valued function $f:\mathbb{R}^\ell \to \mathbb{R}$. Then the gradient $\nabla f$ can be computed in $O(N)$ time, and the gradient computation is itself a circuit of size $O(N)$.

Two details deserve a close look.

First, the output must be a scalar. The gradient $\nabla f$ is an $\ell$-dimensional vector, one partial derivative per input coordinate.

Second, $O(N)$ is not multiplied by the input dimension $\ell$. To see how good a deal this is, compare it with the most obvious approach (this comparison is an addition in this article, not lecture content): estimate the gradient with finite differences, where each coordinate requires nudging that coordinate and recomputing the function, so $\ell$ coordinates take $\ell + 1$ forward passes, $O(N\ell)$ in total, and the result is only an approximation. For a model with a hundred million parameters, finite differences need a hundred million forward passes, while the theorem says a constant multiple of one is enough.

**Mapping it to deep learning.** The lecturer lines up the notation:

| In the theorem | In deep learning |
|---|---|
| The function $f$ | The loss on a single example, $J^{(i)}$ |
| The input $x \in \mathbb{R}^\ell$ | The parameters $\theta$ |
| $\ell$ | The number of parameters |
| Computing $f$ (one walk through the circuit) | forward pass |
| Computing $\nabla f$ | backward pass |

A neural network is a differentiable circuit: a matrix multiplication unpacks into a pile of multiplications and additions, and an activation function is an elementary function. So the theorem applies directly.

The lecturer then adds an observation: in almost every neural network in use today, the number of operations in the forward pass is proportional to the number of parameters. His example is a $d \times d$ matrix times a vector, which has $d^2$ parameters and whose matrix-vector product also takes $d^2$ multiplications. So the conclusion can be made more concrete: computing the loss in the forward pass and the gradient in the backward pass both take $O(\text{number of parameters})$.

The lecturer says the rest of the lecture is a proof of this theorem, carried out in the language of modules that is close to neural networks rather than in the most abstract language of circuits.

## Using the theorem twice: second-order information is within reach (recording 12:26–19:20)

Before the proof, the lecturer shows two more advanced uses of the theorem. Both rest on the same reasoning: as long as a scalar function can be computed efficiently, its gradient can be computed efficiently, whether or not the definition of that function itself contains a gradient.

**Use one: differentiating "the loss after one step of gradient descent".** Define

$$
\theta \;\mapsto\; J\bigl(\theta - \eta\,\nabla J(\theta)\bigr).
$$

This is a function of $\theta$, and $\theta$ appears in it twice. Evaluating it takes three steps: take $\theta$, compute the gradient $\nabla J(\theta)$ (the theorem guarantees this step is the same order as one forward pass), and evaluate the loss once at the new point $\theta-\eta\nabla J(\theta)$. The lecturer says each step is efficient and the total is roughly three times the number of parameters, so the whole function is efficiently computable, and by the theorem so is its gradient with respect to $\theta$.

Expanding it reveals a second derivative (this expansion is an addition in this article). Let $\theta' = \theta - \eta\nabla J(\theta)$. The chain rule gives

$$
\frac{d}{d\theta}J(\theta') = \bigl(I - \eta\,\nabla^2 J(\theta)\bigr)\,\nabla J(\theta').
$$

Here the Jacobian of $\theta'$ with respect to $\theta$ is $I-\eta\nabla^2 J(\theta)$, and by the chain rule in the next section we should multiply by its transpose; the Hessian is symmetric, so the transpose changes nothing and the formula is written without it. A Hessian sits inside, yet at no point do we need to write the Hessian out. The lecturer says this kind of technique is used in meta learning: treat "the loss after running some training algorithm for a number of steps" as the objective and backpropagate to the learning rate or the initialization. The way he describes it, the outcome of running this algorithm for 10 steps can serve as a loss function for the initialization. He also mentions that methods such as test-time training use the same idea, and admits it is hard to explain without context; the point here is only to let you know it exists.

**Use two: the Hessian-vector product.** Take any vector $v \in \mathbb{R}^\ell$ and define

$$
g(x) = \langle \nabla f(x),\, v\rangle = \sum_{i=1}^{\ell} \frac{\partial f}{\partial x_i}\,v_i .
$$

Differentiate with respect to $x_j$. Since $v$ is a constant,

$$
\frac{\partial g}{\partial x_j} = \sum_{i=1}^{\ell} \frac{\partial^2 f}{\partial x_j\,\partial x_i}\,v_i = \bigl(\nabla^2 f(x)\,v\bigr)_j ,
$$

that is, $\nabla g(x) = \nabla^2 f(x)\,v$. $\nabla f$ can be computed in $O(N)$ and the inner product is cheap, so $g$ is an efficiently computable scalar function; apply the theorem once more and $\nabla g$ is too. The conclusion is that the Hessian times any vector can be computed in $O(N)$ time (the notes write $O(N+\ell)$; the extra $\ell$ is that inner product).

The lecturer makes a point of saying this does not mean the full Hessian can be computed: the Hessian has $\ell \times \ell$ entries, and just writing them down already takes longer than that.

A student follows up, asking whether this only matters for optimizers that use second derivatives (the optimizer's name is not clear in the transcript). The lecturer answers:

> "I think most of the optimizers these days that are really useful don't have to actually compute the Hessian vector product." (around 18:35)

So this section shows you how powerful the theorem is; it is not something everyday training requires.

## Another way to read the chain rule (recording 19:20–27:20)

The chain rule is the core of backpropagation, but you have to read it from a different angle.

**Setup.** Three variables in a chain:

$$
z \in \mathbb{R}^m \;\xrightarrow{\;g\;}\; u = g(z) \in \mathbb{R}^n \;\xrightarrow{\;f\;}\; J = f(u) \in \mathbb{R}.
$$

$z$ is the input, $u$ is the intermediate variable, and $J$ is the final scalar.

**The chain rule from calculus class.** $J$ is affected by $z_i$ only through $u_1,\dots,u_n$, so add up the contribution of each path:

$$
\frac{\partial J}{\partial z_i} = \sum_{j=1}^{n} \frac{\partial J}{\partial u_j}\cdot\frac{\partial g_j}{\partial z_i}, \qquad i = 1,\dots,m.
$$

Here $g_j$ is the $j$-th output of $g$, which is $u_j$. (In class the lecturer switches index letters partway through, and $i$ and $j$ are somewhat mixed up in the transcript; the above follows equation 7.57 in the notes.)

**The new reading.** Treat this equation as a computational problem: someone hands you the $n$-dimensional vector $\frac{\partial J}{\partial u}$ and asks you to compute the $m$-dimensional vector $\frac{\partial J}{\partial z}$. The equation says each $\frac{\partial J}{\partial z_i}$ is a linear combination of $\frac{\partial J}{\partial u_1},\dots,\frac{\partial J}{\partial u_n}$ with coefficients $\frac{\partial g_j}{\partial z_i}$. A linear combination can be written as a matrix times a vector:

$$
\frac{\partial J}{\partial z} =
\begin{pmatrix}
\dfrac{\partial g_1}{\partial z_1} & \cdots & \dfrac{\partial g_n}{\partial z_1}\\
\vdots & \ddots & \vdots\\
\dfrac{\partial g_1}{\partial z_m} & \cdots & \dfrac{\partial g_n}{\partial z_m}
\end{pmatrix}
\frac{\partial J}{\partial u}.
$$

This matrix is $m \times n$, and its $(i,j)$ entry is $\frac{\partial g_j}{\partial z_i}$. The usual Jacobian puts outputs along the rows and inputs along the columns and is $n \times m$, so what we have here is the **transpose of the Jacobian**. The lecturer pauses at this point to say he has to copy from the notes so he does not get the indices backwards. When you derive it yourself, check the dimensions: the left side is $m$-dimensional and the vector on the right is $n$-dimensional, so the thing in the middle can only be $m \times n$.

**What information this equation needs.** The entries of the matrix are partial derivatives of $g$ evaluated at the point $z$, so all you need is the function $g$ and the value of $z$. $f$ does not appear at all. $f$ could be the composition of a hundred later layers $f_1, f_2, f_3, \dots$; once someone gives you $\frac{\partial J}{\partial u}$, you no longer care what $f$ looks like. The lecturer describes this as "Markovian":

> "You can forget about history, in some sense. And that's why it's efficient." (around 26:41)

**The backward function.** The lecturer calls this map from $\frac{\partial J}{\partial u}$ to $\frac{\partial J}{\partial z}$ the backward function of module $g$; $g$ itself is the forward function. He says this is exactly what every PyTorch module has to implement as backward: it depends only on the local information $g$ and $z$, so it can be composed with any computation that comes after. The notes give it a symbol,

$$
\frac{\partial J}{\partial z} = \mathcal{B}[g, z]\!\left(\frac{\partial J}{\partial u}\right),
$$

where, with $z$ fixed, $\mathcal{B}[g,z]$ is a linear map from $\mathbb{R}^n$ to $\mathbb{R}^m$ (the matrix above).

## Chaining backward functions together (recording 27:20–33:20)

Now consider three modules connected in a chain:

$$
x \;\xrightarrow{M_1}\; u_1 \;\xrightarrow{M_2}\; u_2 \;\xrightarrow{M_3}\; J .
$$

The forward pass computes $u_1, u_2, J$ in order. The backward pass starts from the end closest to $J$:

1. **Compute $\frac{\partial J}{\partial u_2}$.** Only one module, $M_3$, sits in between, so differentiate directly.
2. **Compute $\frac{\partial J}{\partial u_1}$.** Treat $M_3$ as $f$ and $M_2$ as $g$, with $z = u_1$ and $u = u_2$. Apply the result of the previous section: $\frac{\partial J}{\partial u_1} = \mathcal{B}[M_2, u_1]\bigl(\frac{\partial J}{\partial u_2}\bigr)$.
3. **Compute $\frac{\partial J}{\partial x}$.** This time treat $M_2$ and $M_3$ together as $f$ and $M_1$ as $g$. $f$ has become more complicated, but the previous step already computed $\frac{\partial J}{\partial u_1}$, so only $M_1$ and $x$ are needed: $\frac{\partial J}{\partial x} = \mathcal{B}[M_1, x]\bigl(\frac{\partial J}{\partial u_1}\bigr)$.

With more modules the move is the same, applied one module at a time from back to front. The modules need not be of one kind either: a matrix multiplication, an activation function, another matrix multiplication, a LayerNorm, each with its own Jacobian and therefore its own backward function. Work out the backward function for each kind of module, compose them in order, and you have the whole backward pass.

This is a good place to answer a question self-learners often have: why multiply from the back toward the front? (What follows is an addition in this article.) Because $J$ is a scalar, starting from the $J$ end means the thing in your hand is always a vector $\frac{\partial J}{\partial u_k}$, and passing through each module costs one matrix-vector product. If you pushed forward from the input end instead, the thing in your hand would be "the Jacobian of $u_k$ with respect to $x$", a full matrix, and every step would be a matrix-matrix product. That is why the theorem requires a scalar output.

## What we actually want is the gradient with respect to the parameters (recording 33:20–42:30)

The lecturer points out his own shortcut: the above computes all the way to $\frac{\partial J}{\partial x}$, but in training we usually do not care about the gradient with respect to the input data. We want the gradient with respect to the parameters.

The fix is to look at the same module from another angle. A module with parameters, $u_1 = M_1(x;\theta_1)$, has two inputs: $x$ and $\theta_1$. Hold $x$ fixed and view the module as a function from $\theta_1$ to $u_1$, and the reasoning from the chain rule section goes through unchanged:

$$
\frac{\partial J}{\partial \theta_1} = \mathcal{B}[M_1, \theta_1]\!\left(\frac{\partial J}{\partial u_1}\right).
$$

In the lecturer's words, the raw data and the parameters are just different tensors, and which one you treat as the variable is up to you.

So real backpropagation has two kinds of computation. The network the lecturer draws is $x \to \text{MM}_{\theta_1} \to u_1 \to \sigma \to u_2 \to \text{MM}_{\theta_2} \to u_3 \to \cdots \to u_k \to J$, where MM is a matrix multiplication module, the $u$ are intermediate variables (activations), and the parameters live inside the MM modules.

| Computation | What it does | What it needs |
|---|---|---|
| With respect to intermediate variables | $\frac{\partial J}{\partial u_k} \to \frac{\partial J}{\partial u_{k-1}} \to \cdots \to \frac{\partial J}{\partial u_1}$ | The previous step's result, the module, and the module's input |
| With respect to parameters | Branch off from $\frac{\partial J}{\partial u_1}$ to compute $\frac{\partial J}{\partial \theta_1}$, and from $\frac{\partial J}{\partial u_3}$ to compute $\frac{\partial J}{\partial \theta_2}$ | The gradient at the module's output, and the module's input |

The first kind is inherently sequential; each step waits for the one before. The second kind is a set of side branches off the main trunk: as soon as the gradient at a layer's output is ready, that layer's parameter gradient can be computed without waiting for earlier layers. So the two kinds of computation can be interleaved, and the branches can run in parallel. Parameters closer to the loss get their gradients sooner; the first layer's parameters have to wait until the whole trunk has been traversed. (A note for watching the video: at 40:11–41:17 the lecturer's spoken "first" and "last" do not refer to layers consistently from one sentence to the next; the above is organized from the dependency stated in the notes, "$\frac{\partial J}{\partial\theta^{[i]}}$ depends only on $\frac{\partial J}{\partial u^{[i]}}$ and $u^{[i-1]}$".)

The lecturer then turns to the systems side: once everything downstream of an intermediate quantity has been computed, it can be dropped from memory; which quantity depends on which determines the order of computation, when to release memory, and when to communicate with other GPUs. His summary is that all of this comes down to the dependencies in the computational graph.

## Backward for matrix multiplication: with respect to the input (recording 42:30–48:26)

Up to here $g$ has been abstract. Now replace $g$ with concrete modules. The first is matrix multiplication:

$$
u = g(z) = Wz + b, \qquad z\in\mathbb{R}^m,\; W\in\mathbb{R}^{n\times m},\; b\in\mathbb{R}^n,\qquad J = f(u).
$$

**Goal:** given $\frac{\partial J}{\partial u}$, find $\frac{\partial J}{\partial z}$.

From the chain rule section, the $(i,j)$ entry of the matrix we need is $\frac{\partial (Wz+b)_j}{\partial z_i}$. First write out the $j$-th output, which is just the definition of matrix multiplication:

$$
(Wz+b)_j = b_j + \sum_{k=1}^{m} W_{jk}\,z_k .
$$

Differentiate with respect to $z_i$. $b_j$ does not depend on $z_i$, so its derivative is 0. The terms in the sum with $k \neq i$ do not depend on $z_i$ either, so their derivatives are 0 too. Only the $k = i$ term, $W_{ji}z_i$, remains. It is linear in $z_i$, so its derivative is the coefficient:

$$
\frac{\partial (Wz+b)_j}{\partial z_i} = W_{ji}.
$$

The $(i,j)$ entry of the matrix is $W_{ji}$, which is exactly the definition of $W^\top$. So

$$
\frac{\partial J}{\partial z} = W^\top\,\frac{\partial J}{\partial u}.
$$

> "So the backward function is just only a transpose. You just transpose your forward matrix and you multiply that, and that's it." (around 47:26)

The dimensions match as well: $W^\top$ is $m\times n$, and multiplying it by an $n$-dimensional vector gives an $m$-dimensional vector.

## Backward for matrix multiplication: with respect to the weights (recording 48:26–55:43)

Same module, but now $z$ is fixed and $W$ is the variable. The goal is to compute $\frac{\partial J}{\partial W}$ from $\frac{\partial J}{\partial u}$.

The lecturer says the notation is more awkward here. The variable $W$ is a matrix, and writing "the Jacobian of $u$ with respect to $W$" compactly would require tensor notation (the notes say it would be a fourth-order tensor), so he skips the matrix form and applies the summation form of the chain rule to each entry $W_{ij}$ directly:

$$
\frac{\partial J}{\partial W_{ij}} = \sum_{k=1}^{n} \frac{\partial J}{\partial u_k}\cdot\frac{\partial (Wz+b)_k}{\partial W_{ij}} .
$$

Write out the $k$-th output:

$$
(Wz+b)_k = \sum_{s=1}^{m} W_{ks}\,z_s + b_k .
$$

The weights that appear in this expression are $W_{k1},\dots,W_{km}$, the $k$-th row of $W$. When differentiating with respect to $W_{ij}$:

- If $k \neq i$, $W_{ij}$ does not appear in the expression at all, and the derivative is 0.
- If $k = i$, only the $s = j$ term, $W_{ij}z_j$, contains it, and the derivative is the coefficient $z_j$.

So the sum over $k$ keeps only the $k=i$ term:

$$
\frac{\partial J}{\partial W_{ij}} = \frac{\partial J}{\partial u_i}\cdot z_j .
$$

**How to remember it.** The lecturer says this is how he remembered it as a PhD student: draw the matrix multiplication as a graph with input nodes $z_1,\dots,z_m$ connected to output nodes $u_1,\dots,u_n$, where $W_{ij}$ is the weight on the edge joining $z_j$ and $u_i$. The gradient of that edge equals "the gradient at the output end $u_i$" times "the value at the input end $z_j$". An edge needs only the quantities at its two ends.

He says biology calls this form the Hebbian rule: a synapse's update equals the error at one end times the value at the other. (One sentence added in this article: the Hebbian rule as usually stated multiplies the activities of the neurons at the two ends; here the output end is replaced by a gradient, and what the two share is that "the update of an edge depends only on local quantities at its two ends".)

**Matrix form and rank 1.** Collect all $(i,j)$ into one matrix whose $(i,j)$ entry is $\frac{\partial J}{\partial u_i}\,z_j$. This is the outer product of a column vector ($n\times1$) and a row vector ($1\times m$):

$$
\frac{\partial J}{\partial W} = \frac{\partial J}{\partial u}\; z^\top \in \mathbb{R}^{n\times m}.
$$

Every row of the outer product is a multiple of $z^\top$, so the matrix has rank 1 (when one of the two vectors is the zero vector, the whole matrix is 0).

> "So the gradient for one example and for one weight matrix is always rank 1." (around 54:42)

The lecturer adds two points: some efficiency methods exploit this fact; and it holds only for a single example. Real training averages over many examples, and a sum of many rank-1 matrices is no longer rank 1.

**The bias gradient.** The lecture mentions that the dependence on $b$ also has to be computed, but only $W$ is derived on the board. Filling it in from equation 7.70 in the notes: the derivative of $(Wz+b)_j$ with respect to $b_i$ is 1 when $i=j$ and 0 otherwise, the matrix is the identity, and so

$$
\frac{\partial J}{\partial b} = \frac{\partial J}{\partial u}.
$$

## Backward for the activation function (recording 55:43–59:00)

The second kind of module is the elementwise activation function: $u = \sigma(z)$, meaning $u_i = \sigma(z_i)$, where $\sigma$ is a function of one variable applied to each coordinate, and the input and output here are both $m$-dimensional.

Apply the chain rule matrix again. Its $(i,j)$ entry is $\frac{\partial \sigma(z_j)}{\partial z_i}$. The $j$-th output looks only at the $j$-th input, so the entry is 0 when $i\neq j$ and $\sigma'(z_i)$ on the diagonal. The whole matrix is diagonal:

$$
\frac{\partial J}{\partial z} = \operatorname{diag}\bigl(\sigma'(z_1),\dots,\sigma'(z_m)\bigr)\,\frac{\partial J}{\partial u}.
$$

A diagonal matrix times a vector gives a result whose $i$-th coordinate is $\sigma'(z_i)\cdot\frac{\partial J}{\partial u_i}$. So there is no need to build the matrix; write it as an elementwise product:

$$
\frac{\partial J}{\partial z} = \sigma'(z)\odot\frac{\partial J}{\partial u}.
$$

The lecturer reminds the class that $\odot$ is not the inner product: the inner product multiplies elementwise and then sums everything into one number; $\odot$ does not sum, and the result is still a vector.

## Checking the cost again, and the closing Q&A (recording 59:00–1:02:07)

At the end the lecturer compares the cost of the three backward functions with their forward counterparts, confirming that what the theorem says holds at the module level. The table below uses the dimensions from the derivations above ($W\in\mathbb{R}^{n\times m}$):

| Module and variable | Forward | Backward function | Backward cost |
|---|---|---|---|
| Matrix multiplication, w.r.t. $z$ | $Wz+b$, $O(mn)$ | $W^\top v$ | $O(mn)$; a transposed matrix times a vector costs the same as the original matrix times a vector |
| Matrix multiplication, w.r.t. $W$ | Same as above | $v\,z^\top$ | $O(mn)$; filling in $mn$ entries |
| Activation function, w.r.t. $z$ | $\sigma(z)$, $O(m)$ | $\sigma'(z)\odot v$ | $O(m)$ |

Here $v$ stands for the incoming $\frac{\partial J}{\partial u}$. The backward of each module is the same order as its forward, and summing over the whole network gives the theorem's conclusion.

At the end of class a student asks about sigmoid. The lecturer says several activation functions are in common use today and he cannot recall all the names on the spot (the transcript is unclear here too); what matters is that it is a function of one variable that can be differentiated quickly. He also mentions that some people now use gating: do two matrix multiplications, then multiply the two results elementwise, as another kind of nonlinearity; details and references are in the notes.

## A complete example: a 2-2-1 network by hand

What follows is an example made up for this article, not from the lecture. The lecture derives the backward function of individual modules only and never chains a whole network together; the chaining order here follows Algorithm 3 in Section 7.4.4 of the notes, and the loss is the squared loss given in Section 7.4.3, $\ell_{\text{MSE}}(z,y)=\frac12(z-y)^2$, whose backward multiplies by $(z-y)$. The activation function is ReLU, $\sigma(t)=\max(t,0)$, with derivative 1 when $t>0$ and 0 when $t<0$.

**The network and the numbers.**

$$
x=\begin{pmatrix}1\\2\end{pmatrix},\quad
W^{[1]}=\begin{pmatrix}1&-1\\2&1\end{pmatrix},\quad
b^{[1]}=\begin{pmatrix}0\\-1\end{pmatrix},\quad
W^{[2]}=\begin{pmatrix}3&2\end{pmatrix},\quad
b^{[2]}=1,\quad y=5.
$$

**Forward.** Keep every intermediate value; the backward pass will use them.

$$
z^{[1]} = W^{[1]}x+b^{[1]} = \begin{pmatrix}1\cdot1+(-1)\cdot2+0\\ 2\cdot1+1\cdot2-1\end{pmatrix}=\begin{pmatrix}-1\\3\end{pmatrix},
\qquad
a^{[1]}=\sigma(z^{[1]})=\begin{pmatrix}0\\3\end{pmatrix},
$$

$$
z^{[2]} = W^{[2]}a^{[1]}+b^{[2]} = 3\cdot0+2\cdot3+1 = 7,
\qquad
J=\tfrac12(7-5)^2=2 .
$$

**Backward.** Walk back from $J$, noting which equation each step uses.

1. Loss module: $\dfrac{\partial J}{\partial z^{[2]}} = z^{[2]}-y = 2$.
2. Second-layer parameters (a branch, using $vz^\top$ and the bias rule):

$$
\frac{\partial J}{\partial W^{[2]}} = 2\cdot a^{[1]\top} = \begin{pmatrix}0&6\end{pmatrix},\qquad
\frac{\partial J}{\partial b^{[2]}} = 2 .
$$

3. Through the second-layer matrix multiplication (the trunk, using $W^\top v$):

$$
\frac{\partial J}{\partial a^{[1]}} = W^{[2]\top}\cdot 2 = \begin{pmatrix}6\\4\end{pmatrix}.
$$

4. Through the ReLU (the trunk, using $\sigma'(z)\odot v$). $z^{[1]}=(-1,3)$, so $\sigma'(z^{[1]})=(0,1)$:

$$
\frac{\partial J}{\partial z^{[1]}} = \begin{pmatrix}0\\1\end{pmatrix}\odot\begin{pmatrix}6\\4\end{pmatrix}=\begin{pmatrix}0\\4\end{pmatrix}.
$$

5. First-layer parameters (a branch):

$$
\frac{\partial J}{\partial W^{[1]}} = \begin{pmatrix}0\\4\end{pmatrix}\begin{pmatrix}1&2\end{pmatrix}=\begin{pmatrix}0&0\\4&8\end{pmatrix},\qquad
\frac{\partial J}{\partial b^{[1]}}=\begin{pmatrix}0\\4\end{pmatrix}.
$$

Training needs nothing beyond this point. If you also want the gradient with respect to the input, use $W^\top v$ once more: $\frac{\partial J}{\partial x}=W^{[1]\top}(0,4)^\top=(8,4)^\top$.

**Checking the arithmetic.** Pick $W^{[1]}_{22}$ and check it with a finite difference: change it from 1 to 1.001, so $z^{[1]}_2 = 2+2.002-1=3.002$, $z^{[2]}=2\cdot3.002+1=7.004$, and $J=\frac12(2.004)^2=2.008008$. The loss rises by 0.008008; dividing by 0.001 gives 8.008, which agrees with the 8 from backpropagation (the 0.008 difference is the second-order term). I also ran finite differences in NumPy on all four entries of $W^{[1]}$, and the result was $(0,0;4,8)$.

**What these numbers mean.**

- The gradient of the first row of $W^{[1]}$ is all 0. The first hidden unit's $z^{[1]}_1=-1$ is clipped to 0 by the ReLU, and the gradient flowing back is multiplied by 0 in step 4. On this example, no small change to the first-row weights changes the loss.
- The first entry of $\frac{\partial J}{\partial W^{[2]}}$ is also 0, for a different reason: the input end of that edge is $a^{[1]}_1=0$. This is the "output-end gradient times input-end value" rule at work; if either end is 0, the edge has no gradient.
- The two rows of $\frac{\partial J}{\partial W^{[1]}}$ are 0 times and 4 times $(1,2)$, so the rank is 1, as the lecture said.
- Update all four sets of parameters one gradient step with learning rate $\eta=0.01$, redo the forward pass, and you get $z^{[2]}=6.3344$ and $J\approx0.890$; the loss falls from 2 to 0.89.
- Cost: the forward pass did two matrix-vector products, one ReLU, and one loss; the backward pass did one transposed-matrix-vector product (two if you want $\partial J/\partial x$), two outer products, and one elementwise product. The two sides are the same order.

## Self-check

**1.** $g:\mathbb{R}^3\to\mathbb{R}^2$ and $J=f(g(z))$. What are the dimensions of the matrix in the backward function? What is its $(3,1)$ entry?

Answer: $3\times2$. It turns the 2-dimensional $\frac{\partial J}{\partial u}$ into the 3-dimensional $\frac{\partial J}{\partial z}$. The $(3,1)$ entry is $\frac{\partial g_1}{\partial z_3}$; rows index inputs and columns index outputs, the opposite of the usual Jacobian.

**2.** $W=\begin{pmatrix}1&2&0\\-1&0&3\end{pmatrix}$, $z=(1,1,1)^\top$, and you are given $\frac{\partial J}{\partial u}=(2,1)^\top$, where $u=Wz+b$. Find $\frac{\partial J}{\partial z}$, $\frac{\partial J}{\partial W}$, and $\frac{\partial J}{\partial b}$.

Answer: $\frac{\partial J}{\partial z}=W^\top(2,1)^\top=(2-1,\;4+0,\;0+3)^\top=(1,4,3)^\top$. $\frac{\partial J}{\partial W}=(2,1)^\top(1,1,1)=\begin{pmatrix}2&2&2\\1&1&1\end{pmatrix}$. $\frac{\partial J}{\partial b}=(2,1)^\top$. Notice that computing $\frac{\partial J}{\partial z}$ never uses the value of $z$, and computing $\frac{\partial J}{\partial W}$ never uses the value of $W$.

**3.** Change $b^{[1]}$ in the example above to $(2,-1)^\top$, leave everything else alone, and recompute all the gradients.

Answer: $z^{[1]}=(1,3)$, $a^{[1]}=(1,3)$, $z^{[2]}=3+6+1=10$, $J=12.5$. $\frac{\partial J}{\partial z^{[2]}}=5$; $\frac{\partial J}{\partial W^{[2]}}=(5,15)$, $\frac{\partial J}{\partial b^{[2]}}=5$; $\frac{\partial J}{\partial a^{[1]}}=(15,10)$; both ReLUs are active, so $\frac{\partial J}{\partial z^{[1]}}=(15,10)$; $\frac{\partial J}{\partial W^{[1]}}=\begin{pmatrix}15&30\\10&20\end{pmatrix}$, $\frac{\partial J}{\partial b^{[1]}}=(15,10)$. The first row is no longer 0, but the matrix is still rank 1.

**4.** Which intermediate values from the forward pass must be kept for the backward pass? Go through them one by one for an MLP.

Criterion: you should be able to say what each backward function needs. The backward of matrix multiplication with respect to the input needs $W$ (the parameters are there anyway); the backward with respect to the weights needs that layer's input $z$ (in an MLP, the previous layer's $a$); the backward of the activation function needs its own input $z$ to compute $\sigma'(z)$. So every layer's $z^{[k]}$ and $a^{[k]}$ have to be stored until that layer's backward step is done, which is one reason training uses more memory than inference.

**5.** The Hessian-vector product can be computed in $O(N)$. Why can't the full Hessian?

Criterion: you should mention output size. $\nabla^2 f(x)\,v$ is an $\ell$-dimensional vector, and it is the gradient of the scalar function $g(x)=\langle\nabla f(x),v\rangle$, so the theorem applies. The full Hessian has $\ell^2$ entries, and just writing them down takes $\ell^2$ time; to assemble the whole Hessian with this trick you would run it once for each of the $\ell$ basis vectors at $O(N+\ell)$ each, $O((N+\ell)\,\ell)$ in total; in the common case $N\ge\ell$ that is $O(N\ell)$, the same as $\ell$ forward passes.

## Corresponding reading

Main lecture notes, Chapter 7, Section 7.4 Backpropagation, roughly pages 99–111:

- The theorem and its two corollaries: the start of Section 7.4 (Theorem 7.4.1)
- The chain rule and the $\mathcal{B}[g,z]$ notation: Section 7.4.1, equations 7.56–7.63
- Chaining modules, and the two kinds of computation (with respect to intermediate variables and with respect to parameters): Section 7.4.2, equations (B1) and (B2) and Figure 7.5
- The backward functions for matrix multiplication and activation functions: Section 7.4.3, equations 7.66–7.73

Differences between the lecture and the notes:

- **Not covered in the lecture.** The backward of loss functions (squared loss, logistic loss, cross-entropy; equations 7.74–7.75), Algorithm 3 in Section 7.4.4, which chains all the modules into the full MLP algorithm, and the derivation of the bias gradient never made it onto the board. The hand-computed example in this article uses all three and fills them in from the notes. The vectorization over examples in Section 7.5 is not covered in this lecture either.
- **Extra in the lecture.** The Hebbian-rule mnemonic, the fact that the weight gradient for a single example is rank 1, the systems view of parallel computation and memory release, the uses in meta learning and test-time training, and the closing Q&A on activation functions and gating are absent from Section 7.4 of the notes or only touched on.
- **Differences in detail.** For the cost of the Hessian-vector product, the lecture says $O(N)$ and the notes write $O(N+\ell)$. The notes also have a footnote explaining that the gradient for input coordinates the output does not depend on defaults to 0, so the theorem still holds when $N\le\ell$.
- **Granularity.** Remark 7.4.3 in the notes explains that the rigorous proof of the theorem breaks the network down to the level of individual additions and multiplications; in practice larger modules such as matrix multiplication are more convenient, and the cost conclusion is unchanged. The cost check at the end of the lecture corresponds to this passage.

**Series navigation**: previous [Lecture 7: neural network architecture](/posts/ai/2026-10-12-stanford-cs229-lecture-07-neural-network-architecture-en) | next [Lecture 9: k-means and Gaussian mixture models](/posts/ai/2026-10-12-stanford-cs229-lecture-09-k-means-gmm-en)

## Course video sources

Original video: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 8: Neural Networks 2 (Backprop)](https://www.youtube.com/watch?v=ne2ngVAoMG8)

- [Stanford CS229 Machine Learning | Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 course website](https://cs229.stanford.edu/)
- [CS229 main lecture notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

Checked: 2026-10-12.

Content check: verified against the video transcript (2026-10-12): I read the full English transcript (about 62 minutes), and the time ranges of every section and all quotations come from it. I did not watch the board; the equations on the board are reconstructed from Section 7.4 of the main notes. Where the transcript mixes up index letters or is unclear (the $i$ and $j$ of the chain rule, and the names of the optimizer and activation functions in the Q&A), I follow the notes or leave the detail out.

## References

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 8: Neural Networks 2 (Backprop)](https://www.youtube.com/watch?v=ne2ngVAoMG8): the main source for this article; the order of the lecture, the lecturer's phrasing, and the quotations all come from the English transcript of this recording.
- [CS229 main lecture notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf): Chapter 7, Section 7.4, used to reconstruct the board equations, the $\mathcal{B}[g,z]$ notation, the backward of the bias and the loss function, and Algorithm 3, which the hand-computed example follows.
- [CS229 course website](https://cs229.stanford.edu/): entry point for the course and the notes.
- [Reading Stanford CS229: course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): entry point for the series and where each lecture sits.
- [Lecture 7: neural network architecture](/posts/ai/2026-10-12-stanford-cs229-lecture-07-neural-network-architecture-en): source of the module notation this lecture reuses (MM, $\sigma$, LayerNorm).
