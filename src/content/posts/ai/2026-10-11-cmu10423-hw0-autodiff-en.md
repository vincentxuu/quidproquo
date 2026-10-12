---
title: "Autodiff in Practice: From Hand Gradients to a Training Loop | CMU 10-423 Assignment 0"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 2
tldr: "Knowing that backpropagation uses the chain rule is different from implementing a correct training loop."
description: "A teaching guide based on public Spring 2026 materials: Autodiff in Practice: From Hand Gradients to a Training Loop | CMU 10-423 Assignment 0"
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-11-cmu10423-hw0-autodiff)

**Video status: recordings require sign-in or course authorization.** This guide uses public slides and assignments; numerical examples are site-authored, not a lecture transcript.

Knowing that backpropagation uses the chain rule is different from implementing a correct training loop. This guide uses a fully hand-checkable model to connect tensors, a scalar loss, gradients, and parameter updates. It is an original prerequisite exercise, not an official HW0 problem or solution. The schedule links a Colab handout; we do not claim access to every exercise or its grading criteria.

Read the RNN guide's gradient discussion first. You need Python and PyTorch. The example uses only CPU tensors and requires neither a dataset download nor a GPU. Confirm that PyTorch imports in your environment, save the code as `autodiff_toy.py`, and run it.

## Specify the objective before writing the loop

Our example has input x=2, target y=5, and prediction ŷ=wx+b. Starting from w=1 and b=0 gives ŷ=2. With L=(ŷ−y)²/2, the loss is 4.5. The factor of one half simplifies the derivative without changing the minimizing parameters.

The residual r=ŷ−y is −3. Therefore ∂L/∂w=r×x=−6 and ∂L/∂b=r=−3. A gradient descent step with learning rate 0.1 gives w'=1.6 and b'=0.3. The new prediction is 3.5 and the new loss is 1.125. The decrease validates this update direction on this example, not generalization to unseen inputs.

## Match autograd to the same calculation

```python
import torch
w = torch.tensor(1.0, requires_grad=True)
b = torch.tensor(0.0, requires_grad=True)
x = torch.tensor(2.0)
y = torch.tensor(5.0)
pred = w * x + b
loss = 0.5 * (pred - y).square()
loss.backward()
print(loss.item(), w.grad.item(), b.grad.item())
with torch.no_grad():
    w -= 0.1 * w.grad
    b -= 0.1 * b.grad
w.grad = None
b.grad = None
new_loss = 0.5 * (w * x + b - y).square()
print(w.item(), b.item(), new_loss.item())
```

Expect approximately `4.5 -6.0 -3.0`, followed by `1.6 0.3 1.125`. Small differences in the final floating-point digits are normal. `requires_grad` requests derivatives for the parameters; `backward` follows the loss graph. `no_grad` prevents the update itself from becoming part of a future differentiation graph. Clearing the gradients prevents unintended carryover.

Here we clear gradients after the update. A conventional optimizer loop usually calls `zero_grad` before the next forward pass. Either placement must make the intended accumulation window explicit. Deliberate gradient accumulation is a valid design, but forgetting to clear gradients is a different situation.

## A batch changes the reduction and the shapes

Use x=[1,2] and y=[3,5] with the original parameters. Predictions are [1,2] and residuals are [−2,−3]. If the loss is the mean half-squared error, L=(4+9)/4=3.25. The gradients are (−2×1−3×2)/2=−4 for w and (−2−3)/2=−2.5 for b.

The vector input still shares one w and one b across both examples. Replacing the mean with a sum doubles the loss and gradients, so the same learning rate produces a different update. State the reduction when comparing loss across batch sizes.

Also inspect the prediction and target shapes. Subtracting predictions of shape `[B,1]` from targets of shape `[B]` can broadcast into `[B,B]`, pairing every prediction with every target. Successful execution does not establish correct data flow. A shape check immediately before the loss is a cheap way to catch this error.

## Turn a single step into a loop

Each iteration clears gradients, runs a fresh forward pass, calculates a scalar loss, backpropagates, and updates parameters. A fresh forward pass matters because the previous graph describes the previous parameters. Reusing it after updates does not create a new training iteration. `retain_graph=True` should not be a routine patch for an incorrectly structured loop.

With dropout or batch normalization, train/eval modes change forward behavior. `eval()` is not equivalent to `no_grad()`: one switches layer modes, while the other controls gradient recording. A scalar model does not expose this distinction, but Assignment 1 does.

## Variations with answers

Remove the one-half factor from the single-example loss. The gradients become −12 and −6. Keeping learning rate 0.1 gives w=2.2 and b=0.6, so the prediction happens to equal 5 and the loss becomes zero. This numerical coincidence does not mean that scaling a loss always gives one-step convergence.

What if you backpropagate through the same graph twice without clearing gradients? If the graph was retained, contributions accumulate to −12 and −6. Normally a second backward call fails because the saved graph has been released. Distinguish gradient accumulation from graph lifetime before choosing a fix.

Next, follow the tensor shapes in causal attention and extend these checks to the network in Assignment 1. Official submission and AI-use rules remain governed by that semester's course materials.

[Previous](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff-en) | [Next](/posts/ai/2026-10-11-cmu10423-lecture-02-causal-attention-en) | [Series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## Course Video Sources

The official recording index is on SCS Panopto. The anonymous folder view is unloaded and requests sign-in; this is an access limitation, not evidence that recordings do not exist. Original audio and subtitles require the appropriate course access.

- [Official Panopto recording index](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [Official course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## References

- [HW0 recitation handout](https://colab.research.google.com/drive/1F-ik4J0hf8kUdQAH_1HdlpBufuF9j9ny?usp=sharing)
- [PyTorch autograd tutorial](https://docs.pytorch.org/tutorials/beginner/blitz/autograd_tutorial.html)
- [Course schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
