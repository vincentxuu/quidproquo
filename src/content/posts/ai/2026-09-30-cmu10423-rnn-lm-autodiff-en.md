---
title: "CMU 10-423 L1: RNN Language Models and Autodiff — Generative AI Starts with Predicting the Next Word (with HW0)"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, cmu, ai-course, rnn, language-model, n-gram, backpropagation, pytorch]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 1
tldr: "Lecture 1 of CMU 10-423 boils generative AI down to one line: it is probabilistic modeling, and text generation means estimating p(next word | all previous words). The slides go from n-grams, which you learn by counting, to RNNs, which squeeze the previous words into a fixed-length vector. In between comes module-based autodiff: if every module can run forward and backward, gradients flow back through the computation graph automatically, and that is how PyTorch works. The HW0 handout on Google Drive returns 401; only the recitation Colab is public, covering PyTorch, LSTMs, Weights & Biases and einops."
description: "Guide to Lecture 1 of CMU 10-423/623/723 Generative AI (Spring 2026), based on the lecture1-overview slides (plain and inked) and the schedule's readings: generative AI as probabilistic modeling, what generative AI can do and what scaling costs, module-based automatic differentiation, n-gram language models, RNN language models and sampling, plus what the HW0 recitation Colab contains and what is missing."
draft: false
glossary:
  - term: "module-based autodiff"
    aliases: ["module-based automatic differentiation"]
    definition: "Split a neural network's computation into modules, each responsible for two things: forward computes the output, and backward takes the output's gradient and returns the input's gradient. Gradients for the whole computation graph then flow back module by module in reverse topological order."
    context: "Lecture 1 of CMU 10-423 uses it to explain why PyTorch's nn.Module looks the way it does."
  - term: "n-gram language model"
    aliases: ["n-Gram LM"]
    definition: "A language model that assumes the next word depends only on the previous n−1 words. Its probabilities come straight from counting in a corpus, which is also its maximum likelihood estimate."
    context: "Lecture 1 of CMU 10-423 uses it as background for RNN language models."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff)

> **Edition note**: This post follows Lecture 1 of [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/), Spring 2026 (2026-01-12, Matt Gormley and Aran Nayebi). The main sources are the [lecture1-overview slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture1-overview.pdf) and the [inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture1-overview-ink.pdf) (111 pages each), plus the public [HW0 recitation Colab](https://colab.research.google.com/drive/1F-ik4J0hf8kUdQAH_1HdlpBufuF9j9ny?usp=sharing). Facts were checked on 2026-09-30. The recordings are on Panopto and need a CMU account, so this post is based on the slides only. **The HW0 handout (Google Drive) returns 401 and is not available outside CMU.**

**Series position**: Previous: [Series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) | Next: [L2–L3: Transformer language models, LLM training and decoding](/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding-en)

You type a sentence into ChatGPT and it answers one word at a time. Lecture 1 asks you to accept that, mathematically, this process keeps answering one question: given all the words so far, what is the probability distribution over the next word? All 26 lectures of the course, whether about text, images, audio or video, are different ways of estimating distributions like that.

The deck has three parts: a course tour (what generative AI is, what it can do, course policies), module-based autodiff, and language models from n-grams to RNNs. The policies are covered in the [series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en), so this post sticks to the technical content.

## Generative AI is probabilistic modeling

The deck opens with nested circles: AI contains machine learning, which contains deep learning, with GenAI at the center. It then lists AI's sub-goals (perception, reasoning, control, planning, communication, creativity, learning) and asks what generative AI has to do with any of them.

The slides' answer: it is making inroads into all of them. A few examples:

- **Communication**: LLMs excel at both understanding and generating human language, even though they are usually trained only to generate the next word given the previous ones.
- **Learning**: traditional ML learns by estimating parameters, but in-context learning (giving training examples as context at test time) shows that learning can also happen through inference.
- **Reasoning**: LLMs are unexpectedly good at some reasoning tasks, as with chain-of-thought prompting.
- **Planning**: LLMs already do grounded planning for embodied agents (LLM-Planner), and planning is a key step for agentic code assistants.

A whole section then shows off capabilities: GPT-4 writing a proof that there are infinitely many primes as a Shakespearean dialogue, image inpainting and colorization, SDXL text-to-image, MusicGen, code generation, and video generation.

Next come the costs of scaling. Later lectures keep returning to these numbers:

- Training data: [The Pile](https://arxiv.org/abs/2101.00027) combines 22 smaller datasets into 825 GB, about 1.2 trillion tokens.
- RLHF: the [InstructGPT](https://arxiv.org/abs/2203.02155) paper reports that human raters preferred the 1.3B-parameter InstructGPT over the 175B GPT-3, a model with 100x more parameters.
- Memory: GPT-3's 175 billion parameters take 651 GB in 32-bit floats and 325 GB in 16-bit; the slide lists a single A100 at 80 GB.

The section ends with a single formula:

$$
p(x_{t+1} \mid x_1, \ldots, x_t)
$$

**GenAI is Probabilistic Modeling.** And if you want to model how each variable interacts with everything before it, Lecture 1's answer is the RNN language model.

## Module-based autodiff: why PyTorch looks the way it does

Training a neural network means computing gradients. The slides first review reverse-mode automatic differentiation, better known as backpropagation:

1. **Forward**: write $y = f(x)$ as an algorithm. Each intermediate variable is a node in the computation graph; visit the nodes in topological order and store each value.
2. **Backward**: start from $dy/dy = 1$, walk the graph in reverse topological order, and use the chain rule to pass gradients back to the inputs.

Then the slides compare two ways to write this. The **procedural method** writes the forward and backward passes of a one-hidden-layer network as two monolithic blocks. The slides list three drawbacks: the code is hard to reuse for other models, individual steps are harder to optimize, and when a finite-difference check fails, all you learn is that the bug is somewhere in those 17 lines.

**Module-based autodiff** splits the computation into modules. Each module only has to do two things:

- **forward**: given input $a$, compute output $b = f(a)$.
- **backward**: given the output gradient $g_b = \nabla_b J$, use the chain rule to compute the input gradient $g_a = \nabla_a J$.

The slides write out forward and backward for four modules: Linear, Sigmoid, Softmax and Cross-Entropy. For the Linear module $b = \omega a$, backward is $g_\omega = g_b a^T$ and $g_a = \omega^T g_b$. The advantages mirror the drawbacks above: modules are easy to reuse, an encapsulated layer can be optimized on its own in C++ or CUDA, and you can run a finite-difference check on each layer separately.

<details>
<summary>The OOP version: backpropagating with a tape</summary>

The last step turns each module into an object. When a module runs `apply_fwd`, it pushes itself onto a global stack (the tape). For the backward pass you no longer write `NNBackward` by hand: you pop modules off the tape one by one, call `apply_bwd` on each, and add the resulting gradients to its input modules. This lets the control flow define the computation graph.

</details>

The final two slides rewrite the same network in PyTorch and answer two common questions:

- Why not call `linear.forward()` directly? PyTorch's `__call__` on every Module calls `forward`, so `linear(x)` is just syntactic sugar.
- Why not pass parameters into the Module? Storing them inside the Module and marking them as contributing to the gradient keeps the code cleaner.

The schedule lists [Paszke et al. 2019, the PyTorch paper](https://proceedings.neurips.cc/paper/2019/file/bdbca288fee7f92f2bfa9f7012727740-Paper.pdf), and [Bottou & Gallinari 1991](https://papers.nips.cc/paper/1990/file/a8c88a0055f636e4a163a5e3d16adab7-Paper.pdf) (A Framework for the Cooperation of Learning Algorithms) as readings for this part.

## Background: n-gram language models

Back to language models. The question: how do you define a probability over a sequence of length $T$?

The **chain rule of probability** holds for every distribution:

$$
p(w_1, \ldots, w_6) = p(w_1)\, p(w_2 \mid w_1)\, p(w_3 \mid w_2, w_1) \cdots p(w_6 \mid w_5, \ldots, w_1)
$$

The slides expand "The bat made noise at night" word by word. An n-gram model adds one assumption: each word looks only at the previous $n-1$ words. With $n=2$ you get $p(w_3 \mid w_2)$; with $n=3$, $p(w_4 \mid w_3, w_2)$. The slides point out that this is a **model** because it assumes how many words to condition on, whereas the chain rule is an identity that always holds.

How do you learn the probabilities? **Count.** The slides give 11 snippets containing "cows eat": corn follows 4 times, grass 3, hay 2, and "if" and "which" once each, so $p(\text{corn} \mid \text{cows eat}) = 4/11$.

How do you generate? Picture each conditional distribution as a weighted 50,000-sided die. Pick the die for the current context, roll it, emit the word, repeat. The slides train a 5-gram model on Shakespeare: every word sounds like Shakespeare, but the sentences make no sense.

## RNN language models: compress the past into a vector

An n-gram model sees only a fixed window. The RNN language model's key idea has two steps:

1. Convert all previous words into a **fixed-length vector** $h_t = f_\theta(w_{t-1}, \ldots, w_1)$.
2. Define a distribution $p(w_t \mid h_t)$ conditioned on that vector.

The RNN definition (the slide reproduces a paper excerpt; Lecture 2 credits Graves et al. 2013):

$$
h_t = \mathcal{H}(W_{xh} x_t + W_{hh} h_{t-1} + b_h), \quad y_t = W_{hy} h_t + b_y
$$

$\mathcal{H}$ is usually an elementwise sigmoid. The slides then build the RNN-LM frame by frame: start at START, and at each step read the previous word, update $h_t$, output a distribution over the next word, and finally emit END. The probability of the sentence is the product of the per-step probabilities.

Sampling works exactly as it does for n-grams, one die roll per step, except that a neural network now defines the die. The slides use [Karpathy's RNN example](http://karpathy.github.io/2015/05/21/rnn-effectiveness/): two columns, one generated by an RNN-LM trained on Shakespeare and one from the real *As You Like It*, and students guess which is real.

There is a setup for what comes next: $h_t$ has a fixed length, so the longer the sentence, the harder it is to hold on to early information. Lecture 2, in the [next post](/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding-en), opens with RNNs forgetting.

## HW0: PyTorch Primer

HW0 went out on January 14 with Slot A due January 26. Lecture 1's homework table describes it as an image classifier plus a text classifier, with written and programming parts. Lecture 2 adds two points:

- Both the written and programming parts go to Gradescope.
- During Slot A, staff grant (essentially) any reasonable extension request, but you have to ask, and an extension eats into the HW1 window.

**The handout is on Google Drive and returned 401 when tested on 2026-09-30**, so the descriptions above are all we can confirm. What is public is the [Colab notebook](https://colab.research.google.com/drive/1F-ik4J0hf8kUdQAH_1HdlpBufuF9j9ny?usp=sharing) from the January 16 recitation. Its table of contents has five sections:

1. **PyTorch basics**: creating and manipulating tensors (`cat`, `stack`, `reshape`, `view`, `permute`), and how autograd fills in `.grad` along the computation graph.
2. **Model training**: `Dataset` and `DataLoader` on Fashion-MNIST, plus an MLP. An advanced part implements a Linear layer and a cross-entropy loss by hand with `torch.autograd.Function`, forward and backward. This is the PyTorch version of Lecture 1's module-based autodiff.
3. **LSTM basics**: a minimal `nn.LSTM` model with notes on input shapes.
4. **Weights & Biases**: logging losses, hyperparameters, images, tables and histograms, and having W&B back up the code for each run.
5. **einops**: `rearrange`, `reduce`, `einsum`.

Two things to watch before running it:

- The W&B login cell hard-codes an API key. Replace it with your own key from wandb.ai.
- In the custom loss, `CrossEntropyLoss.__init__` calls `super(Linear, self).__init__()`, which fails when you instantiate it. Change it to `super(CrossEntropyLoss, self)`.

## Self-check

Question 1 of the [practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf), "AutoDiff / RNN-LMs," is worth 11 points and is all multiple choice: what the chain rule of probability does in a language model, properties of RNNs, and the effects of vanishing gradients. Try it after this lecture, then check the [solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf).

One thing to do tonight: open the HW0 recitation Colab, save a copy, run it up to "Advanced: Under the hood of a Linear layer," and read `LinearFunction.backward` next to the Linear module's backward formula from the slides.

## Further reading

- The full backpropagation derivation: [CMU 11-785 Lecture 5: Backpropagation](/posts/ai/2026-08-22-cmu-11785-05-backpropagation-en)
- Training RNNs and their gradient problems: [CMU 11-785 Lecture 13: RNNs (Part 1)](/posts/ai/2026-08-22-cmu-11785-13-rnn-one-en)
- How another course teaches RNN language models: [CS224N: RNN language models](/posts/ai/2026-08-22-cs224n-rnn-language-models-en)

## References

- [CMU 10-423/623/723 homepage (Spring 2026)](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html): L1 date, readings, HW0 timeline
- [Lecture 1 slides: Course Overview + RNN-LMs + Automatic Differentiation](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture1-overview.pdf)
- [Lecture 1 slides (inked)](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture1-overview-ink.pdf)
- [Lecture 2 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture2-transformer.pdf): HW0 submission and extension policy
- [HW0 recitation Colab](https://colab.research.google.com/drive/1F-ik4J0hf8kUdQAH_1HdlpBufuF9j9ny?usp=sharing)
- [Coursework](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html): HW0 handout link (Google Drive, 401 outside CMU)
- [Goodfellow, Bengio & Courville, Deep Learning, Chapter 10: Sequence Modeling](http://www.deeplearningbook.org/contents/rnn.html): the schedule assigns 10.1–10.5
- [Bottou & Gallinari (1991), A Framework for the Cooperation of Learning Algorithms](https://papers.nips.cc/paper/1990/file/a8c88a0055f636e4a163a5e3d16adab7-Paper.pdf)
- [Paszke et al. (2019), PyTorch: An Imperative Style, High-Performance Deep Learning Library](https://proceedings.neurips.cc/paper/2019/file/bdbca288fee7f92f2bfa9f7012727740-Paper.pdf)
- [Karpathy (2015), The Unreasonable Effectiveness of Recurrent Neural Networks](http://karpathy.github.io/2015/05/21/rnn-effectiveness/): source of the RNN sampling example in the slides
- [Practice Exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf) and [Solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
