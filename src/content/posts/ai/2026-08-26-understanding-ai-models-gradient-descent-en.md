---
title: "How Models Improve Themselves: Gradient Descent and the Training Loop"
date: 2026-08-26
category: ai
type: deep-dive
tags: [gradient-descent, backpropagation, training, learning-rate, ai-model, optimization]
lang: en
series:
  name: "認識 AI 模型"
  order: 5
tldr: "A model uses loss to know how wrong it is and gradients to know which direction to adjust. Gradient descent repeats three things: compute loss, compute gradients, update parameters. The learning rate controls step size — too large and you overshoot, too small and training takes forever."
description: "An introduction to gradient descent: from the valley analogy to the actual training loop (forward pass → loss → backward pass → weight update), learning rate trade-offs, and what epochs and batches mean."
draft: false
glossary:
  - term: "Gradient"
    def: "The partial derivative of loss with respect to each parameter — it tells the model which direction to adjust to reduce loss"
  - term: "Learning Rate"
    def: "The step size for each parameter update — too large causes oscillation, too small causes slow convergence"
  - term: "Epoch"
    def: "One complete pass through the entire training dataset"
---

> 🌏 [中文版](/posts/ai/2026-08-26-understanding-ai-models-gradient-descent)

You've seen models improve from GPT-3 to GPT-4, from giving rambling answers to being precisely useful. But what does "improve" actually mean mechanically? Nobody sat down and tuned billions of parameters by hand — so how does it work?

The previous article covered loss functions: the model has a number that tells it "how wrong I am." This article answers the next question: **once it knows it's wrong, how does it get better, one step at a time?**

## The Valley Analogy: Walking Downhill Blindfolded

Imagine you're blindfolded and dropped into a hilly landscape. Your goal is to reach the lowest valley. You can't see the terrain, but you can feel the **slope under your feet** — which direction the ground tilts, and how steeply.

Your strategy is intuitive: take a step in the downhill direction. At your new position, feel the slope again, and take another step downhill. Repeat, and you'll gradually move toward lower ground.

This is the core intuition behind gradient descent:

- **Your position** = the model's current parameter values
- **The terrain's height** = the magnitude of the loss (lower is better)
- **The slope under your feet** = the gradient
- **Taking a step downhill** = updating the parameters

You don't need to see the entire landscape. You just need to "feel the slope and step downhill" at every point.

## Gradients: Which Direction Makes Loss Grow Fastest

The mathematical definition of a gradient is: the partial derivative of loss with respect to each parameter. But you don't need to know how to compute partial derivatives to understand it.

A gradient tells you two things:
1. **Direction**: which way to adjust this parameter to make loss increase fastest
2. **Magnitude**: how steep the slope is in that direction

Since the gradient points toward the fastest increase in loss, you simply **go the opposite way** to make loss decrease.

A model has billions of parameters, each with its own gradient. All the gradients together form a massive "direction guide" telling the model which way to nudge each parameter.

<details>
<summary>Formula: The gradient descent update rule</summary>

For each parameter $w$, the update rule is:

$$w_{\text{new}} = w_{\text{old}} - \eta \cdot \frac{\partial L}{\partial w}$$

Where:
- $w$ is the current value of a parameter
- $\eta$ (eta) is the learning rate
- $\frac{\partial L}{\partial w}$ is the partial derivative (gradient) of loss $L$ with respect to parameter $w$
- The negative sign means "go in the opposite direction of the gradient" (since the gradient points toward increasing loss)

</details>

## The Training Loop: Four Steps on Repeat

Training a model is a loop. Each iteration does four things:

### 1. Forward Pass

Feed a piece of training data through the model from start to finish, producing a prediction.

For example, input "The weather in Taipei" and the model outputs a probability distribution over the next token.

### 2. Compute Loss

Compare the model's prediction against the correct answer and compute a number representing "how wrong" it was. The previous article covered this step.

### 3. Backward Pass (Backpropagation)

This is the critical step. Starting from the loss, **trace backward** along the model's computation path to compute the gradient for every single parameter.

Why "backward"? Because models are built layer by layer. Loss is computed at the final layer, but the parameters that need adjusting are spread across every layer. Backpropagation uses the chain rule from calculus to compute gradients from back to front, layer by layer.

You don't need to implement backpropagation yourself — PyTorch and TensorFlow do it automatically. But understanding that "gradients flow backward from the loss through every layer" helps you grasp why deep networks can run into "vanishing gradients" or "exploding gradients."

<details>
<summary>Formula: The chain rule and backpropagation</summary>

Suppose a model has three layers with outputs $a_1, a_2, a_3$, and the final loss is $L(a_3)$.

To compute the gradient of loss with respect to the first layer's parameter $w_1$, the chain rule says:

$$\frac{\partial L}{\partial w_1} = \frac{\partial L}{\partial a_3} \cdot \frac{\partial a_3}{\partial a_2} \cdot \frac{\partial a_2}{\partial a_1} \cdot \frac{\partial a_1}{\partial w_1}$$

Backpropagation starts from $\frac{\partial L}{\partial a_3}$ and multiplies backward layer by layer, so each intermediate gradient is computed exactly once rather than recomputed from scratch.

</details>

### 4. Update Parameters (Weight Update)

With the gradient for every parameter in hand, update them all. Each parameter moves a small step in the direction that reduces loss.

Then go back to step 1 with the next piece of data.

```
forward pass → compute loss → backward pass → update parameters → repeat
```

This loop runs billions of times, and the model goes from "random guessing" to "useful AI."

## Learning Rate: How Big Each Step Is

Back to the valley analogy. After feeling the slope, you need to decide **how big a step to take**. That's the learning rate.

**Learning rate too large**: You charge downhill in big strides, overshoot the valley, and end up on the opposite slope. Then you charge back, overshoot again — oscillating forever, never reaching the bottom.

**Learning rate too small**: You inch forward in tiny steps. The direction is correct, but reaching the valley floor takes millions of steps. Training time becomes impractical.

**Just right**: Start with larger steps to approach the valley quickly, then shrink the steps for precise convergence. In practice, most training uses a "learning rate schedule" — gradually reducing the learning rate as training progresses.

Typical initial learning rates range from $10^{-3}$ to $10^{-5}$. These numbers look small, but multiplied by the gradient and repeated across billions of iterations, the effect adds up.

## Batches and Epochs: How Much at Once, How Many Times Through

### Batch

In real training, you don't update parameters after every single data point — that would be too noisy. One data point's gradient might point in a very specific direction that isn't representative.

Instead, the model processes a batch of data at once, computes the average gradient across the batch, and then updates. Common batch sizes range from 32 to several thousand. Larger batches produce more stable gradient estimates but require more memory.

### Epoch

One complete pass through the entire training dataset is called an **epoch**.

Large language models typically train for just 1–2 epochs — because the dataset itself is already enormous. When a model release blog says "trained for 2 epochs on 15T tokens," it means the training loop ran through all 15 trillion tokens twice. On each pass, every parameter was updated countless times.

By contrast, tasks with small training sets (like fine-tuning) might need 3–10 epochs, giving the model enough opportunities to learn patterns from limited data.

## The Scale of Training

Putting these concepts together, you can appreciate what "training a large language model" actually entails:

- **Parameters**: GPT-4-class models have hundreds of billions of parameters. Each parameter needs a gradient computed at every update.
- **Training data**: 15 trillion tokens, run for 1–2 epochs.
- **Hardware**: Thousands of GPUs computing in parallel, training for weeks to months.
- **Cost**: A single training run costs tens to hundreds of millions of dollars.

Behind all these numbers, the core is the same thing: forward pass, compute loss, backward pass, update parameters. It's just that the scale requires an entire data center to execute.

## Key Takeaways

1. **Gradients** tell the model which direction to adjust each parameter. They are the partial derivatives of loss with respect to parameters.
2. **Gradient descent** is the process of repeatedly computing gradients and moving parameters in the opposite direction to reduce loss.
3. **The training loop** is four steps on repeat: forward pass → compute loss → backward pass → update parameters.
4. **Learning rate** controls the step size. Too large causes oscillation; too small causes slow convergence.
5. **Batch** is how many data points you process before updating; **epoch** is how many times you pass through the full dataset.

Next up, we'll look at how these trained parameters are organized — the Transformer architecture and the attention mechanism.

## For Readers Who Want to Go Deeper

- [Stanford CS109: Lecture 19 — Maximum Likelihood Estimation](https://web.stanford.edu/class/cs109/): The probabilistic foundation behind loss functions. The loss that gradient descent minimizes is statistically equivalent to maximizing the likelihood of the data.
- [Stanford CS224N: Lecture 5 — Backpropagation and Neural Network Training](https://web.stanford.edu/class/cs224n/): A full walkthrough of backpropagation with NLP examples, including computation graphs and gradient flow.

## References

- Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep Learning*, Chapter 4: Numerical Computation & Chapter 8: Optimization. MIT Press.
- Ruder, S. (2016). [An overview of gradient descent optimization algorithms](https://arxiv.org/abs/1609.04747). arXiv:1609.04747.
- Stanford CS229 Lecture Notes: [Supervised Learning, Discriminative Algorithms](https://cs229.stanford.edu/lectures-spring2022/main_notes.pdf).
