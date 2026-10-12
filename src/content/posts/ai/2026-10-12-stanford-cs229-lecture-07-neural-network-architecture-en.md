---
title: "Neural Network Architecture: From a Single ReLU to Residual Connections and Normalization Layers | Stanford CS229 Lecture 7"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, deep-learning, neural-networks, sgd]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 7
tldr: "Lecture 7 first carries the training recipe for linear models over to nonlinear models unchanged: one loss per example, take the average, walk downhill with SGD. Two questions remain: what the model looks like, and how to compute the gradient. The second half answers the first. One neuron is ReLU(wᵀx+b); stacking m neurons into a matrix gives one layer, ReLU(Wx+b), with md+m parameters; above that come the residual block z+σ(MM(σ(MM(z)))) and LayerNorm and RMSNorm. Computing the gradient is left to Lecture 8."
description: "A guide to Lecture 7 of Stanford CS229 (Spring 2026): the supervised learning framework for nonlinear models, the derivations behind cross-entropy and SGD, the vectorized form that takes you from a single neuron to a multi-layer fully connected network, and the definitions of residual connections, LayerNorm, RMSNorm, and convolution, with numerical examples and self-check questions."
draft: false
math: true
---

> 🌏 [中文版](/posts/ai/2026-10-12-stanford-cs229-lecture-07-neural-network-architecture)

**Video status: Videos included.** This post is written from the English transcript of the Spring 2026 Lecture 7 recording published by Stanford Online, with formulas and notation checked against Sections 7.1 to 7.3 of Chapter 7 (Deep learning) in the 2026 main lecture notes. I did not see the whiteboard. Where the transcript has the lecturer pointing at the board, I reconstructed the content from the surrounding context and the notes.

This is the first deep learning lecture in [Reading Stanford CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en), taught by Tengyu Ma. Up through [the previous lecture](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization-en), almost every $h_\theta$ used for regression and classification had the form $\theta^\top x$, linear in the parameters. This lecture moves the same training recipe to nonlinear models and then defines the most widely used kind of nonlinear model, the neural network. The prerequisites are linear regression, softmax, and gradient descent from the earlier lectures, plus matrix multiplication. After reading, given the layer widths of a multi-layer network, you should be able to write down the shape of every weight matrix, count the parameters, run one forward pass by hand, and say what a residual connection and LayerNorm each do in terms of the formula.

```youtube
url: https://www.youtube.com/watch?v=fRM41w9jzQo
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 7: Neural Networks 1 (Architecture)
captions: en
```

The lecturer opens by setting the scope (recording 00:05–02:11): these two lectures only lay the groundwork for deep learning, and diffusion models and large language models come in later weeks. He also explains why he uses the whiteboard instead of slides. With slides you only see one at a time, "there's not enough memory there"; the whiteboard has six panels he can look back at, and writing forces him to slow down.

## What "nonlinear" model means (recording 02:11–08:00)

A linear model looks like this, where $x\in\mathbb{R}^d$ is the input and $\theta\in\mathbb{R}^d$ is the parameter vector:

$$
h_\theta(x)=\theta_1x_1+\theta_2x_2+\cdots+\theta_dx_d
$$

The lecture first rules out a case that looks nonlinear but does not count:

$$
h_\theta(x)=\theta_1x_1^2+\theta_2x_2^2+\cdots+\theta_dx_d^2
$$

It is quadratic in $x$, but set $z_i=x_i^2$ and treat $z$ as the new input, and the model is back to $\theta_1z_1+\cdots+\theta_dz_d$. What we learn is $\theta$, and $z$ is a fixed number we can compute, so every tool from linear regression still applies. In the lecturer's words, "this nonlinear in the data is not nonlinear enough in some sense" (in the passage starting at 03:12).

Nonlinear, in this lecture, means nonlinear in the **parameters**. He writes down an offhand example, $\theta_1^2x_1+\cdots$, and stresses that it is only an illustration; the model the lecture is really about is the neural network. A student asks what the difference is. His answer: a model that is nonlinear only in $x$ can be turned back into a linear model by changing the input, so from a learning point of view nothing changes. A model that is nonlinear in the parameters cannot be converted this way, so some of the techniques for linear models no longer apply.

An addition in this article: the lecturer says there is no way to turn this offhand example back into a linear model, and for this particular example that claim is too strong. Set $\phi_1=\theta_1^2$ and it is a linear model whose coefficient is constrained to $\phi_1\ge0$. Treat it as a notational illustration. The example that really cannot be converted is $\text{ReLU}(wx+b)$ later on, and self-check question 1 uses a set of numbers to confirm that it is not linear in the parameters.

Section 7.1 of the notes words it slightly differently. It says the models to be considered next are nonlinear in both the parameters $\theta$ and the inputs $x$, and the example in its footnote is $\theta_1^2x_1^2+\cdots+\theta_d^2x_d^2$.

## The regression loss, and why it equals the negative log-likelihood under a Gaussian assumption (recording 08:00–10:27, 17:53–19:55)

The dataset is $n$ pairs of inputs and labels, $\{(x^{(i)},y^{(i)})\}_{i=1}^n$. The notation follows the convention used throughout the course: the superscript $(i)$ says which example, and a subscript says which coordinate.

In a regression problem the label is $y^{(i)}\in\mathbb{R}$ and the model is $h_\theta:\mathbb{R}^d\to\mathbb{R}$. The loss on example $i$ and the overall loss are

$$
J^{(i)}(\theta)=\big(y^{(i)}-h_\theta(x^{(i)})\big)^2,\qquad J(\theta)=\frac1n\sum_{i=1}^nJ^{(i)}(\theta)
$$

The loss is written as a function of $\theta$ because the data is given and only the parameters can move. The formula is the same as in linear regression; the only difference is that $h_\theta$ is no longer $\theta^\top x$. Equation (7.1) in the notes has an extra $\frac12$ in front, which the lecture leaves out; multiplying by a constant does not change where the minimum is. The lecturer mentions in passing that error, loss, and cost all mean the same thing. The notes still say cost, and researchers today more often say loss.

Later a student follows up: why does squared error count as a likelihood too? The lecturer derives it on the spot. The derivation is the same one [Lecture 3](/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression-en) did for the linear model, with $\theta^\top x$ replaced by a general $h_\theta(x)$. Assume the data is generated like this:

$$
y=h_\theta(x)+\epsilon,\qquad\epsilon\sim\mathcal{N}(0,\sigma^2)
$$

Then, given $x$, $y$ follows a Gaussian distribution with mean $h_\theta(x)$ and variance $\sigma^2$:

$$
p(y\mid x;\theta)=\frac{1}{\sqrt{2\pi}\,\sigma}\exp\!\Big(-\frac{(y-h_\theta(x))^2}{2\sigma^2}\Big)
$$

Take the negative log. The product becomes a sum, and the $\log$ cancels the exponential:

$$
-\log p(y\mid x;\theta)=\log\big(\sqrt{2\pi}\,\sigma\big)+\frac{1}{2\sigma^2}\big(y-h_\theta(x)\big)^2
$$

The first term does not depend on $\theta$. The second is the squared error times the positive constant $\frac{1}{2\sigma^2}$. So when you minimize over $\theta$, the negative log-likelihood and the squared error pick the same parameters.

## Multi-class classification: logits, softmax, and cross-entropy (recording 10:27–17:53)

The notes also have a passage on binary classification; to save time the lecture goes straight to the multi-class case. Here the lecturer drops the superscript $(i)$ and looks at a single example $(x,y)$, where the label $y\in\{1,\dots,k\}$ is a discrete class index.

The model $\bar h_\theta:\mathbb{R}^d\to\mathbb{R}^k$ outputs one real number per class, and these $k$ numbers are called **logits**. The bar is there only to tell it apart from the regression $h_\theta$. Softmax turns the logits into probabilities:

$$
P(y=j\mid x;\theta)=\frac{\exp\big(\bar h_\theta(x)_j\big)}{\sum_{s=1}^k\exp\big(\bar h_\theta(x)_s\big)}
$$

The exponential makes every term positive, and dividing by the sum makes them add up to 1. The loss is again the negative log-likelihood. There is one detail the lecturer stops to spell out: the formula above gives a probability for every $j$, but the label we actually have is one specific $y$, so we substitute $y$ for $j$:

$$
\ell_{\text{ce}}\big(\bar h_\theta(x),y\big)=-\log\frac{\exp\big(\bar h_\theta(x)_y\big)}{\sum_{s=1}^k\exp\big(\bar h_\theta(x)_s\big)}
$$

This is the **cross-entropy loss**. Its two inputs are the logits vector and the label. The lecturer notes that PyTorch has a module of the same name that you can call directly. The loss over the whole dataset is still the average: $J(\theta)=\frac1n\sum_i\ell_{\text{ce}}\big(\bar h_\theta(x^{(i)}),y^{(i)}\big)$.

**Numerical example (made up for this article, not from the lecture).** Three classes, and the logits for some example are $(2,1,0)$.

- Exponentiate: $e^2\approx7.389$, $e^1\approx2.718$, $e^0=1$, which sum to about $11.107$.
- Probabilities: $7.389/11.107\approx0.665$, $2.718/11.107\approx0.245$, $1/11.107\approx0.090$.
- If the label is class 1, the loss is $-\log0.665\approx0.408$; if the label is class 3, the loss is $-\log0.090\approx2.408$.

What this means: the model gave its highest score to class 1. If the answer really is class 1, the loss is small; if the answer is class 3, the one the model favored least, the loss is nearly six times larger. A second way to check the arithmetic: expanded, the loss is $\log\sum_s e^{\text{logit}_s}-\text{logit}_y$, which is $\log11.107-2\approx2.408-2=0.408$.

**Why is it called cross-entropy?** A student asks this and the lecturer answers verbally, saying the derivation is a bit long to write out. Filling it in along the direction he describes (the formulas below are added by this article): let $p_\theta(j)=P(y=j\mid x;\theta)$, and let $p^\star$ be the true distribution of the label given $x$. Take the expectation of the loss under the true distribution:

$$
\mathbb{E}_{y\sim p^\star}\big[\ell_{\text{ce}}\big]=\sum_{j=1}^kp^\star(j)\cdot\big(-\log p_\theta(j)\big)=-\sum_{j=1}^kp^\star(j)\log p_\theta(j)
$$

The right-hand side is the cross-entropy between $p^\star$ and $p_\theta$: the probabilities of one distribution times the log probabilities of the other, summed.

**What about one-hot vectors?** In the lecture's notation $y$ is just an integer, so it can be used directly as a subscript. The lecturer says you can also encode $y$ as a one-hot vector. Mathematically it is the same thing, except that "take the $y$-th coordinate" is rewritten as an inner product with the one-hot vector.

## Optimization: gradient descent, SGD, and minibatches (recording 19:55–34:23)

The total loss $J(\theta)$ is a function of $\theta$, and the next job is to find a $\theta$ that makes it small. Newton's method is off the table here. The lecturer's reason is that the function is no longer convex, so Newton's method has no guarantee; he adds that in fact no method has guarantees for all non-convex functions.

**Gradient descent** treats $J$ as a whole. At each step

$$
\theta:=\theta-\eta\,\nabla J(\theta),\qquad\nabla J(\theta)=\frac1n\sum_{i=1}^n\nabla J^{(i)}(\theta)
$$

The lecture writes the step size as $\eta$; the notes write $\alpha$. Computing $\nabla J$ once means computing the gradient for each of the $n$ examples and averaging.

**Stochastic gradient descent (SGD)**, in its plainest form, draws one $j$ uniformly from $\{1,\dots,n\}$ at each step and uses only that example:

$$
\theta:=\theta-\eta\,\nabla J^{(j)}(\theta)
$$

Why is looking at a single example defensible? $j$ is random and each value is drawn with probability $\frac1n$, so the expectation of the single-example gradient is

$$
\mathbb{E}_j\big[\nabla J^{(j)}(\theta)\big]=\sum_{j=1}^n\frac1n\,\nabla J^{(j)}(\theta)=\nabla\Big(\frac1n\sum_{j=1}^nJ^{(j)}(\theta)\Big)=\nabla J(\theta)
$$

The middle equality uses the fact that the sum of gradients equals the gradient of the sum. The conclusion: the single-example gradient averages out to exactly the full gradient, but each individual draw carries noise.

A small example shows what the noise looks like (made up for this article): a one-dimensional parameter and three examples whose single-example gradients at the current $\theta$ are $4$, $1$, and $-2$. The full gradient is their average, $1$, so gradient descent moves in the negative direction. SGD goes too far if it draws the first example and even goes the opposite way if it draws the third, but the three cases are equally likely and the average is still $1$. The lecturer draws the same thing on the whiteboard with arrows: the black arrow is the full gradient, the blue arrows scatter around it and sometimes point backward, and along the trajectory the blue line wiggles while roughly following the black one. He also cautions that how closely the two trajectories track each other in the long run depends on the step size and many other details, and the error is sometimes amplified and sometimes shrunk.

A student then asks: so why use SGD at all? The lecturer gives three reasons.

1. **The full gradient is too expensive.** The numbers he cites are about a million examples in 2015 and roughly a trillion tokens in 2026. You cannot go through every gradient at every step.
2. **Computing the full gradient is wasteful.** The gradients of different examples are highly correlated. If every example tells you to go the same way, a small subset is enough to know the direction.
3. **The process does not need to be precise.** If one step goes astray, later steps correct it; the force that every step shares washes out the perturbations.

**The Q&A on local minima.** A student asks whether SGD's noise can help you jump out when you are stuck at a local minimum. The lecturer first draws the one-dimensional case: you walk downhill to the bottom of a valley, the gradient is 0, and you stop. The idea that noise bounces you into another valley sounds reasonable, but he says the research community does not see it that way:

> "I don't think people believe that stochastic descent can help you to jump out of a local minimum." (in the passage starting at 29:18)

The other side is that people also do not think high-dimensional loss functions have many bad local minima. The lecturer says he has worked on theory in this area himself and stresses that no one is sure it is right. The hypothesis closest to a consensus today is that bad local minima are very rare, and possibly every local minimum is a global minimum. He uses a skiing analogy: slide down a mountain in any direction and you will most likely end up at some parking lot; occasionally you slide into the backcountry and get stuck, and even then you can usually find a creek valley that keeps going down. He adds on his own that the analogy does not fully hold in two dimensions; it is in high dimensions that you can more reliably find a direction that goes down.

Another student says this is counterintuitive and wants the mathematical reason. The lecturer says it is not something that holds in general and he can only give a sentence or two of intuition: a local minimum requires the Hessian at that point to be positive semidefinite in every direction, and that condition is hard to satisfy. A zero gradient is already $d$ equations; requiring in addition that the Hessian has no negative direction leaves far fewer points. For certain specific models, papers by him and other researchers have actually counted the local minima, and the count matches the number of global minima; the general case is hard to compute. The transcript records the tool used as "categorize formula", which should be the Kac–Rice formula.

**Minibatches.** In practice you do not draw a single example at a time. Using all the data is too expensive, using one example is too noisy, and the compromise is to draw $B$ examples each time. The lecturer also gives a hardware reason: computing one example at a time leaves GPU utilization far too low, and if you have ten thousand GPUs most of them sit idle. He says the term SGD covers both batch size 1 and the larger versions. The update follows equation (7.10) in the notes, with the step size changed to the lecture's $\eta$:

$$
\theta:=\theta-\frac{\eta}{B}\sum_{k=1}^B\nabla J^{(j_k)}(\theta)
$$

where $j_1,\dots,j_B$ are $B$ indices drawn from $\{1,\dots,n\}$ (the notes specify sampling without replacement).

## The framework is in place; two questions remain (recording 34:23–36:25)

The recipe so far: define a loss for each example, take the average, and pick an optimization method to run. The lecturer says unsupervised learning later on uses the same scaffold, except the loss has no $y$ in it. The recipe holds for any $h_\theta$, so two questions are left:

1. How do we define $h_\theta$ (or $\bar h_\theta$)? That is the second half of this lecture.
2. How do we compute the single-example gradient $\nabla J^{(j)}(\theta)$? Once you can compute it for one example, the gradient of a batch is just the average. The algorithm is called backpropagation, or automatic differentiation, and it is the topic of [the next lecture](/posts/ai/2026-10-12-stanford-cs229-lecture-08-backpropagation-en).

## One neuron: ReLU and activation functions (recording 36:25–43:34)

The example is still house price prediction, which the lecturer himself says is probably twenty years old. The horizontal axis is the size of the house and the vertical axis is the price. The data he describes has this shape: at first the price does not rise much with size, and only later does it become close to a straight line. A single straight line would not fit well enough, so we want a model that can at least draw a "flat first, then sloped" kinked line. That kinked line can be written as

$$
h_\theta(x)=\max(wx+b,\,0)+c
$$

$\max(wx+b,0)$ clips every part of the line below 0 to 0, and $c$ then shifts the whole line up or down. The lecturer notes that clipping negative values is also sensible because house prices are not negative. Equation (7.11) in the notes has no $+c$ term, and the motivation it gives is only to keep the house price from going negative.

The function $\max(t,0)$ is called **ReLU** (rectified linear unit) in deep learning:

$$
\text{ReLU}(t)=\max(t,0)
$$

The negative side is 0, and the positive side is a straight line with slope 1. The model above is therefore written $\text{ReLU}(wx+b)+c$. Without the ReLU, it is just a straight line.

**Numerical example (made up for this article).** Take $w=0.3$, $b=-300$, $c=200$, with $x$ in square feet and the output in thousands of dollars.

- $x=500$: $wx+b=150-300=-150$, which is $0$ after the ReLU, so the output is $0+200=200$.
- $x=1000$: $wx+b=0$, and the output is $200$.
- $x=2000$: $wx+b=600-300=300$, and the output is $300+200=500$.

The kink is where $wx+b=0$, that is, at $x=-b/w=1000$. To the left of the kink the model outputs a constant 200; to the right, each extra square foot adds 0.3. $w$ sets the slope, $b$ together with $w$ sets the position of the kink, and $c$ sets the height of the flat part. All three parameters have to be learned from data.

Nonlinear functions like ReLU that map one real number to one real number are called **activation functions**. The lecturer explains where the name comes from: a biological neuron is stimulated by other neurons and fires only above some threshold, with no response below it, so the response is a nonlinear function of the stimulus. He says he is no expert on this, and that the biological function does not happen to look like ReLU. It looks more like a sigmoid, which is why early deep learning used the sigmoid; it was later replaced because of computational problems. The transcript records this sentence as "this ReLU is actually a bad idea"; from context it refers to the sigmoid. One reason Section 7.2 of the notes gives is that the gradients of sigmoid and tanh vanish as the input moves toward either extreme.

When the input is a $d$-dimensional vector, replace $wx$ with an inner product:

$$
h_\theta(x)=\text{ReLU}(w^\top x+b),\qquad w\in\mathbb{R}^d,\ b\in\mathbb{R}
$$

$w$ is called the weight vector and $b$ the bias. $w^\top x$ is a scalar; add the scalar $b$, apply ReLU once, and the output is still a scalar. The activation function is used once, so this is **one neuron**, also called a one-layer network.

## Stacking neurons: the two-layer fully connected network (recording 43:34–50:58)

The lecturer uses the house price example to explain why you would stack. The raw inputs are $x_1$ the size, $x_2$ the number of bedrooms, $x_3$ the zip code, and an $x_4$ that, looking at his notes, he says he cannot remember (the notes have the wealth of the neighborhood). What really drives the price may be intermediate quantities that are not in the data, such as walkability $a_1$ and school quality $a_2$. Each intermediate quantity can be thought of as some linear combination of the raw inputs passed through a ReLU, and the final price is in turn a linear combination of these intermediate quantities, for example $\theta_9a_1+\theta_{10}a_2$. He says the notation here is very loose; the point is only to convey the idea of applying "linear, nonlinear, linear again" repeatedly. The same example in the notes has three intermediate quantities, the extra one being the family size the house can hold.

Older papers often draw this structure as a row of circles connected to the next row of circles. The lecturer's comment:

> "once you know what they are talking about, the drawings are very useful. But when you don't really know what they are talking about, it's kind of confusing." (in the passage starting at 46:52)

So he defines it with formulas instead. The input is $x\in\mathbb{R}^d$, and there are $m$ intermediate variables. Each one is a neuron, and each takes **all** of the inputs:

$$
\begin{aligned}
a_1&=\text{ReLU}\big(w_1^{[1]\top}x+b_1^{[1]}\big)\\
a_2&=\text{ReLU}\big(w_2^{[1]\top}x+b_2^{[1]}\big)\\
&\ \,\vdots\\
a_m&=\text{ReLU}\big(w_m^{[1]\top}x+b_m^{[1]}\big)
\end{aligned}
$$

Each $w_j^{[1]}\in\mathbb{R}^d$ and $b_j^{[1]}\in\mathbb{R}$. The output is a linear combination of these $a_j$. Collect $a_1,\dots,a_m$ into a vector $a\in\mathbb{R}^m$ and there is no need to write out a long $\theta_1a_1+\cdots$:

$$
\bar h_\theta(x)=w^{[2]\top}a+b^{[2]},\qquad w^{[2]}\in\mathbb{R}^m,\ b^{[2]}\in\mathbb{R}
$$

The square-bracket superscript is the layer index: the $[1]$ parameters turn $x$ into $a$, and the $[2]$ parameters turn $a$ into the output. Note that $w^{[2]}$ has dimension $m$, the same as $a$ and unrelated to $x$, because it takes an inner product with $a$. This is the **two-layer fully connected neural network**; "fully connected" means every $a_j$ depends on all of the $x_i$.

Keep the three kinds of indices apart: a parenthesized superscript $(i)$ is which example, a square-bracket superscript $[k]$ is which layer, and a subscript is which coordinate or which neuron.

## Vectorization: one layer is ReLU(Wx + b) (recording 50:58–54:15)

There are too many indices, and the lecturer himself says it is a mess. Transpose the $m$ weight vectors of the first layer into row vectors and stack them row by row into a matrix:

$$
W^{[1]}=\begin{bmatrix}w_1^{[1]\top}\\w_2^{[1]\top}\\\vdots\\w_m^{[1]\top}\end{bmatrix}\in\mathbb{R}^{m\times d},\qquad b^{[1]}=\begin{bmatrix}b_1^{[1]}\\b_2^{[1]}\\\vdots\\b_m^{[1]}\end{bmatrix}\in\mathbb{R}^m
$$

By the definition of matrix multiplication, the $j$-th coordinate of $W^{[1]}x$ is exactly the inner product of row $j$ with $x$, namely $w_j^{[1]\top}x$. So the $m$ equations collapse into one:

$$
a=\text{ReLU}\big(W^{[1]}x+b^{[1]}\big)
$$

Here ReLU acts on a vector, which means it is applied **elementwise**; the lecturer says to remember this. He reminds the class that all vectors are column vectors by default and become row vectors only after a transpose. He also says that most of the time you do not need to remember the correspondence above, only that what one layer does is "multiply by a matrix, add a bias vector, take the ReLU elementwise, and get a vector".

Parameter count: $W^{[1]}$ turns a $d$-dimensional input into an $m$-dimensional output and has $m\times d$ numbers; $b^{[1]}$ has $m$. The layer has $md+m$ parameters in total.

**Full numerical example (made up for this article).** Take $d=3$, $m=2$:

$$
x=\begin{bmatrix}1\\2\\-1\end{bmatrix},\quad W^{[1]}=\begin{bmatrix}1&-1&2\\0.5&1&1\end{bmatrix},\quad b^{[1]}=\begin{bmatrix}1\\0.5\end{bmatrix},\quad w^{[2]}=\begin{bmatrix}3\\-1\end{bmatrix},\quad b^{[2]}=0.5
$$

The linear part of the first layer, one row at a time:

- Row 1: $1\cdot1+(-1)\cdot2+2\cdot(-1)=-3$; adding the bias $1$ gives $-2$.
- Row 2: $0.5\cdot1+1\cdot2+1\cdot(-1)=1.5$; adding the bias $0.5$ gives $2$.

Take the ReLU elementwise: $a=\big(\max(-2,0),\ \max(2,0)\big)=(0,2)$. Second layer: $\bar h_\theta(x)=3\cdot0+(-1)\cdot2+0.5=-1.5$.

The result shows two things. The first neuron outputs 0 for this input, so its weights contribute nothing to this output; ReLU makes each example activate only a subset of the neurons. Also, the final output is negative, because the last layer has no ReLU after it. The footnote to equation (7.13) in the notes specifically mentions that multi-layer networks usually do not put a ReLU near the output, especially when the output is not necessarily positive.

Parameter count: the first layer has $md+m=2\cdot3+2=8$, the second has $m+1=3$, for 11 in total.

## One level more abstract: MM, other activation functions, and multiple layers (recording 54:15–1:04:48)

To write fewer symbols, the lecturer defines "multiply by a matrix and add a bias" as a module (the notes call it MM, for matrix multiplication):

$$
\text{MM}_{W,b}(z)=Wz+b
$$

ReLU can also be swapped for another activation function $\sigma$. An activation function is always a scalar function $\mathbb{R}\to\mathbb{R}$, applied elementwise when used on a vector. One layer is then written $\sigma(\text{MM}_{W,b}(z))$.

In class the lecturer sketches several of them without writing formulas and tells everyone to look at the notes. Section 7.2 of the notes lists:

- sigmoid: $\sigma(z)=\dfrac{1}{1+e^{-z}}$
- tanh: $\sigma(z)=\dfrac{e^z-e^{-z}}{e^z+e^{-z}}$
- leaky ReLU: $\sigma(z)=\max\{z,\gamma z\}$, $\gamma\in(0,1)$
- GELU: $\sigma(z)=\dfrac z2\Big(1+\text{erf}\big(\tfrac{z}{\sqrt2}\big)\Big)$

The lecturer's summary is that these functions are roughly increasing and are often close to 0 to the left of 0 (his word is often; by the formulas above, tanh approaches $-1$ on the left, so it is not one of these). GELU is the one that is not strictly increasing: on the negative side it dips down a little before coming back. Scanning the notes' formula numerically, the minimum is at about $z\approx-0.75$ with a value of about $-0.17$ (these numbers were computed for this article). As for why you would pick one over another, the lecturer is frank:

> "So exactly why use any of this is like a little like a magic." (in the passage starting at 57:24)

His observation is that smoother functions seem to help, and ReLU is not smooth enough; beyond that, sometimes the consideration is stability and sometimes it is simply what worked when people tried it. The notes also list Swish, ReLU², Softplus, and gated activation functions such as GLU, which the lecture does not mention.

With these two modules, a multi-layer network is repeated application:

$$
\text{MM}_{W^{[r]},b^{[r]}}\Big(\sigma\big(\cdots\sigma\big(\text{MM}_{W^{[2]},b^{[2]}}\big(\sigma\big(\text{MM}_{W^{[1]},b^{[1]}}(x)\big)\big)\big)\cdots\big)\Big)
$$

The lecturer says the number of layers is roughly the number of matrix multiplications. Each layer uses a **different** $W$ and $b$. Their shapes may be similar, but they are different variables, so the full expression needs square-bracket superscripts to tell them apart.

**The dimensions have to be compatible.** For $Wz$ to make sense, the number of columns of $W$ must equal the dimension of $z$, and the number of rows can be chosen freely. Suppose the input is $d$-dimensional:

- $W^{[1]}\in\mathbb{R}^{m_1\times d}$, with an $m_1$-dimensional output; the dimension does not change after $\sigma$.
- $W^{[2]}$ must therefore have $m_1$ columns, that is, $W^{[2]}\in\mathbb{R}^{m_2\times m_1}$, and $m_2$ is again free to choose.

The output dimension of each layer becomes the input dimension of the next. The lecturer adds that the dimension of the raw input is fixed by the data and cannot be changed; after that you usually do not change dimensions often, keeping the same width for a long stretch and changing it once or twice along the way. Counting as in the previous section, layer $k$ has $m_km_{k-1}+m_k$ parameters, and the notes write the total as $(d+1)m_1+(m_1+1)m_2+\cdots+(m_{r-1}+1)m_r$.

Architecture diagrams in papers today are more abstract than the circle drawings: one box labeled MM, one box labeled $\sigma$, stacked upward. Merge several boxes into one and it is called an **MLP** (multilayer perceptron). The lecturer cautions that the term refers to different things in different papers, sometimes one matrix multiplication plus one $\sigma$, sometimes two.

A student asks whether the intermediate dimensions usually get smaller and smaller. The lecturer says in most cases yes, because the raw input tends to be large. A language model starts at the vocabulary size, perhaps 250,000, shrinks to around 2,000 first, and then keeps using that; an image has three RGB channels, each for example 256×256, and also has to be shrunk first.

## Residual connections (recording 1:04:48–1:11:50)

A residual block is defined as follows: apply two matrix multiplications and activation functions alternately to the input $z$, then add $z$ itself back at the end.

$$
\text{Res}(z)=z+\sigma\big(\text{MM}(\sigma(\text{MM}(z)))\big)
$$

The two MMs each have their own weights. One constraint follows immediately from the definition: $z$ is added to the term after it, so the input and output dimensions of the block must be the same. $z$ also does not have to be the raw input; it can be the output of any intermediate layer.

A residual network is put together roughly like this: one transformation at the start to change the raw dimension into the intermediate dimension, many residual blocks stacked in the middle, and possibly one more change of dimension at the end. The notes write a simplified version as $\text{ResNet-S}(x)=\text{MM}(\text{Res}(\text{Res}(\cdots\text{Res}(x))))$.

The lecturer says this design comes from the famous 2015 residual network paper (the notes cite it as He et al., 2016) and relays the original motivation. Suppose that by some layer the intermediate variable $z$ is already close to the target $y$. Since it is already close, let the network describe only the gap:

$$
y-z=\sigma(\text{MM}(z))
$$

Move $z$ to the right-hand side:

$$
y=z+\sigma(\text{MM}(z))
$$

This is almost the residual block. The only difference is that people later found one layer was not good enough to describe the gap and switched to two. The lecturer says that about seven to ten years ago people tried putting two, three, or more layers inside, two to three turned out best, and the reason was never really understood. Here is how he frames the whole account:

> "So this is just a story. It's not like there's any formal proof there." (in the passage starting at 1:08:59)

One student gets confused about "which one is the assumption". The lecturer's answer is that the two equations are equivalent: if you believe describing the residual directly is advantageous, you write the first one, and rearranging gives the second, "nothing profound". Intuitively, predicting the original label is hard and predicting a gap that is already small is easier, so the easy job goes to those two layers.

He also mentions another family of explanations that looks at it from the optimization side: in some cases you can argue that adding $z$ improves the condition number of the optimization problem and makes training easier, and some of his own papers belong to this family. There are many explanations, and it is hard to know which one is the real reason.

An observation you can check yourself (an addition in this article): if the weights and biases of both MMs are all 0 and the activation function is ReLU, then $\sigma(\text{MM}(\cdot))=\text{ReLU}(0)=0$, so $\text{Res}(z)=z$. In other words, for a residual block to represent "do nothing", you only need to set the parameters to 0.

## LayerNorm and RMSNorm (recording 1:11:50–1:18:50)

With seven minutes left, the lecturer chooses to cover layer normalization first. It is a module whose input is $z\in\mathbb{R}^m$ and whose purpose is to normalize $z$.

**Step one**: compute the mean and standard deviation of this vector's own coordinates, subtract the mean, and divide by the standard deviation. The notes call this step LN-S:

$$
\hat\mu=\frac1m\sum_{i=1}^mz_i,\qquad\hat\sigma=\sqrt{\frac1m\sum_{i=1}^m(z_i-\hat\mu)^2},\qquad\text{LN-S}(z)_i=\frac{z_i-\hat\mu}{\hat\sigma}
$$

Afterward, the coordinates of the vector have mean 0 and standard deviation 1. Note that the mean is taken over **the $m$ coordinates of the same vector** and has nothing to do with other examples. A footnote in the notes explains that the denominator is $m$ and not $m-1$ because the goal is for the output variance to be exactly 1, not to do statistical estimation.

**Step two**: mean 0 and standard deviation 1 are not necessarily the best choice, so add two learnable scalars, $\beta$ and $\gamma$:

$$
\text{LN}(z)_i=\beta+\gamma\cdot\frac{z_i-\hat\mu}{\hat\sigma}
$$

The output's mean becomes $\beta$ and its standard deviation becomes $|\gamma|$. The lecturer calls this step the clever part: normalize to 1 first, then leave a $\gamma$ so that training itself decides how large to normalize to, without locking the scale at 1.

The lecturer says LayerNorm is still used in large language models, in a form slightly different from the original, and then introduces the simpler **RMSNorm** (the examples the notes give are LLaMA and Qwen). It does not subtract the mean. It only divides by the square root of the mean of the squared coordinates and then multiplies by a learnable $\gamma$:

$$
\text{RMSNorm}(z)_i=\gamma\cdot\frac{z_i}{\hat\sigma},\qquad\hat\sigma=\sqrt{\frac1m\sum_{i=1}^mz_i^2}
$$

In class he briefly writes it as keeping $\beta$ and immediately corrects it to keeping $\gamma$. The meaning is that you do not care whether the mean is 0 but still want to control the scale. As for why this is better, he says it is mainly an empirical result.

**Numerical example (made up for this article).** $z=(2,4,6,8)$.

- The mean is $\hat\mu=5$; the deviations are $(-3,-1,1,3)$ and the mean of their squares is $(9+1+1+9)/4=5$, so $\hat\sigma=\sqrt5\approx2.236$.
- $\text{LN-S}(z)\approx(-1.342,\,-0.447,\,0.447,\,1.342)$.
- With $\beta=0.5$, $\gamma=2$: $\text{LN}(z)\approx(-2.183,\,-0.394,\,1.394,\,3.183)$, with mean 0.5 and standard deviation 2.
- RMSNorm ($\gamma=1$): the mean of the squares is $(4+16+36+64)/4=30$, $\sqrt{30}\approx5.477$, and the output is about $(0.365,\,0.730,\,1.095,\,1.461)$. All four numbers are still positive because the mean was not subtracted.

Now scale the input up by ten, $z'=(20,40,60,80)$. The mean becomes 50 and the standard deviation becomes $10\sqrt5$, so $(20-50)/(10\sqrt5)=-3/\sqrt5\approx-1.342$, exactly the same as before. The same goes for RMSNorm: $20/\sqrt{3000}=20/54.77\approx0.365$.

This is the **scale invariance** the lecturer covers in the last minute. In general, multiply $z$ by a scalar $\alpha>0$ and both the mean and the standard deviation are multiplied by $\alpha$:

$$
\text{LN-S}(\alpha z)_i=\frac{\alpha z_i-\alpha\hat\mu}{\alpha\hat\sigma}=\frac{z_i-\hat\mu}{\hat\sigma}=\text{LN-S}(z)_i
$$

The $\alpha$ in the numerator and denominator cancels, so $\text{LN}(\alpha z)=\text{LN}(z)$. The notes connect this to the preceding layer: $\text{MM}_{\alpha W,\alpha b}(z)=\alpha\,\text{MM}_{W,b}(z)$, and therefore $\text{LN}(\text{MM}_{\alpha W,\alpha b}(z))=\text{LN}(\text{MM}_{W,b}(z))$. Scale the preceding layer's weights and bias up or down together, and the output after normalization does not change. The notes restrict this to $\alpha>0$; when $\alpha$ is negative, $\hat\sigma$ is only multiplied by $|\alpha|$ and the normalized vector flips sign (this sentence is an addition in this article).

What this property is good for, in the lecturer's telling: in the past, when tuning a model, the outputs could grow layer after layer, up to something like $10^{20}$, and then everything would blow up; normalizing at every layer keeps it from getting there. Initialization also becomes less sensitive, and getting the scale wrong does not lead to total collapse. He adds one caveat that he himself calls somewhat advanced: the forward pass is invariant to scale but the gradient is not, so part of the problem is pushed over to the optimization side, which is much more complicated.

## Convolution: the one-minute version (recording 1:18:50–1:20:15)

There is no time in class for convolutional networks. The lecturer uses the last minute to give a one-sentence version and leaves the rest to the notes: a convolutional layer is also a matrix multiplication, except the matrix is not a dense one but one with special structure. The transcript records it as "topless matrix"; from the description it should be a Toeplitz matrix. The nonzero entries appear only in a band near the diagonal, and every row holds the same set of numbers, shifted one position to the right. That shared set of numbers is called the filter, and the effect is to apply the same filter once at every position of the data.

The matrix and parameter counts that follow are filled in from the notes; the lecture does not write them. Equation (7.53) in the notes gives the general form of this matrix. This article plugs in filter length $k=3$ and input dimension $m=4$ (with zero padding at the boundary), with filter $(w_1,w_2,w_3)$, and gets

$$
Q=\begin{bmatrix}w_2&w_3&0&0\\w_1&w_2&w_3&0\\0&w_1&w_2&w_3\\0&0&w_1&w_2\end{bmatrix}
$$

A general $4\times4$ matrix has 16 parameters; this one has only 3. The general conclusion in the notes is that convolution has $k$ parameters and costs $O(km)$ to compute, while a general matrix multiplication has $m^2$ parameters and costs $O(m^2)$. The two-dimensional and multi-channel versions are in the notes.

The lecturer's assessment of convolution is that it is not used much anymore. What remains is mostly vision, and vision has also largely moved to transformers, so "probably it's fine to skip them" (in the passage starting at 1:20:12).

## Self-check

**1. Is $h(x)=\text{ReLU}(wx+b)$ linear in the parameters $(w,b)$? Give a set of numbers to show it.**

No. If it were linear, adding two sets of parameters would add the outputs. Take $x=1$: the parameters $(1,0)$ give $\text{ReLU}(1)=1$; the parameters $(-1,0)$ give $\text{ReLU}(-1)=0$; the sum of the two parameter sets is $(0,0)$, which gives $\text{ReLU}(0)=0$, but $1+0=1\neq0$. Criterion: the answer needs a concrete counterexample; saying "because there is a ReLU" is not enough.

**2. Three classes, the logits are $(3,0,0)$, and the label is class 2. What is the cross-entropy loss?**

The denominator is $e^3+1+1\approx22.086$, the probability of class 2 is $1/22.086\approx0.045$, and the loss is $\log22.086\approx3.095$. You can also compute it directly as $\log\sum_se^{\text{logit}_s}-\text{logit}_y=3.095-0$.

**3. A network takes a 10-dimensional input, has two hidden layers of width 5, and outputs 3 logits. Write the shapes of the three weight matrices and compute the total number of parameters. By the lecture's definition, how many layers does this network have?**

$W^{[1]}\in\mathbb{R}^{5\times10}$, $W^{[2]}\in\mathbb{R}^{5\times5}$, $W^{[3]}\in\mathbb{R}^{3\times5}$. The parameter count is $(50+5)+(25+5)+(15+3)=103$. There are three matrix multiplications, so it has three layers. Criterion: the number of columns of each matrix must equal the output dimension of the previous layer.

**4. Why must the input and output dimensions of a residual block be the same? If you want to change the dimension from 512 to 256 partway through a network, can you use the residual block as defined in the lecture directly?**

Because the definition contains $z+\sigma(\cdots)$, and two vectors of different dimensions cannot be added. You cannot use it directly. The residual network described in the lecture puts the change of dimension outside the residual blocks, with one matrix multiplication at the start and one at the end. A change partway through can be handled the same way: insert an $\text{MM}$ with $W\in\mathbb{R}^{256\times512}$ between two groups of residual blocks (changing dimension partway through is a scenario this article adds as an extension).

**5. $z=(1,3)$. Compute $\text{LN-S}(z)$ and $\text{RMSNorm}(z)$ with $\gamma=1$. After adding 10 to every coordinate to get $(11,13)$, which one's output stays the same?**

$\hat\mu=2$, $\hat\sigma=1$, and $\text{LN-S}(z)=(-1,1)$. RMSNorm: the mean of the squares is $(1+9)/2=5$, $\sqrt5\approx2.236$, and the output is about $(0.447,1.342)$. After adding 10, the mean for LN-S becomes 12 and the standard deviation is still 1, so the output is still $(-1,1)$; RMSNorm becomes $(11,13)/\sqrt{145}\approx(0.914,1.080)$, which has changed. The thing to see in this question is that the two differ only in whether the mean is subtracted: both are invariant to scaling up or down, and only LayerNorm is also invariant to shifting everything by a constant. (The shift part is an exercise this article adds as an extension; the lecture only covers scale.)

## Corresponding reading

Chapter 7, Deep learning, of the main lecture notes `main_notes.pdf`:

- **7.1 Supervised learning with non-linear models** (pp. 80–83): corresponds to the first half of this lecture. The notes have an extra passage on binary classification that the lecture skips; the squared loss carries a factor of $\frac12$; SGD and minibatch SGD are written as Algorithms 1 and 2, with the step size denoted $\alpha$.
- **7.2 Neural networks** (pp. 84–93): a single neuron, stacking neurons, the two-layer fully connected network, vectorization, multiple layers, and other activation functions.
- **7.3 Modules in Modern Neural Networks** (pp. 93–99): the module notation for MM and MLP, residual connections, layer normalization and scale invariance, RMSNorm, and convolutional layers.

Parts the lecture covers that Chapter 7 of the notes either lacks or treats very briefly: where the name cross-entropy comes from, the three reasons for using SGD, the whole Q&A on local minima and the high-dimensional loss landscape, and the motivating story for residual connections. For these, the recording is the main source. The derivation connecting squared error and the Gaussian likelihood is not in Chapter 7; the notes put it in the linear regression chapter, and this series covers it in [Lecture 3](/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression-en).

Parts in the notes that the lecture does not get to, worth reading on your own:

- **Why the activation function cannot be the identity** (pp. 91–92). If $\sigma(z)=z$ and the biases are 0, a two-layer network is $W^{[2]}W^{[1]}x=\tilde Wx$, and no matter how many layers you stack it is still just a linear model.
- **The connection to kernel methods** (pp. 92–93). View everything before the last layer as a learned feature map $\phi_\beta(x)$, and the whole network is a linear model on those features; the difference is that the features are trained too.
- **The full definition of convolution** (pp. 97–99): one-dimensional convolution, and the parameter counts for multi-channel and two-dimensional convolution.
- **Batch normalization and group normalization** (p. 96), each of which the notes mention in a single sentence.

Backpropagation in Section 7.4 and vectorization over training examples in Section 7.5 belong to the next lecture.

**Series navigation**: Previous: [Lecture 6: bias and variance, regularization, and model selection](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization-en) | Next: [Lecture 8: backpropagation](/posts/ai/2026-10-12-stanford-cs229-lecture-08-backpropagation-en)

## Course video sources

Original video: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 7: Neural Networks 1 (Architecture)](https://www.youtube.com/watch?v=fRM41w9jzQo)

- [Stanford CS229 Machine Learning | Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 course website](https://cs229.stanford.edu/)
- [CS229 main lecture notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

Checked: 2026-10-12.

Content check: verified against the video transcript (2026-10-12): the whole article was compared passage by passage against the English transcript of this recording (about 80 minutes), and the time ranges marked on each section come from the transcript's paragraph timestamps. I did not view the whiteboard; the full forms of the formulas come from Chapter 7 of the main lecture notes, and places where the lecture and the notes disagree are marked in the text.

## References

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 7: Neural Networks 1 (Architecture)](https://www.youtube.com/watch?v=fRM41w9jzQo): the main source for this article; the lecture's statements and quotations all come from the English transcript of this recording.
- [CS229 main lecture notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf): Sections 7.1–7.3 of Chapter 7 (pp. 80–99), used to fill in the formulas, notation, and page numbers for what was on the whiteboard.
- [CS229 course website](https://cs229.stanford.edu/): the official entry point for the course and the notes.
- [Reading Stanford CS229: course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): the overview and self-study route for this series.
