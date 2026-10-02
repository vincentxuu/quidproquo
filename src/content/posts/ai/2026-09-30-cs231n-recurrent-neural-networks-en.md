---
title: "CS231N L7: Recurrent Neural Networks and Image Captioning — RNNs, LSTMs, and Captioning"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, deep-learning, rnn]
lang: en
series:
  name: "Reading Stanford CS231N"
  order: 8
tldr: "An RNN updates one hidden state at every time step with the same weights, so it can handle sequences of any length. CS231N Lecture 7 starts by hand-building an RNN that detects repeated 1s. It then covers character-level language models and feeding CNN features into an RNN for image captioning. Gradient flow explains why vanilla RNNs are hard to train: clip gradients to stop them exploding, and change the architecture (the LSTM) to stop them vanishing. The lecture ends by calling state space models like Mamba \"modern RNNs.\""
description: "A guide to Lecture 7 on the Stanford CS231N Spring 2026 schedule: one-to-many, many-to-one, and many-to-many sequence problems, the vanilla RNN recurrence and computational graph, BPTT and truncated BPTT, character-level language models, image captioning, VQA and Visual Dialog, exploding and vanishing gradients, LSTM gates and cell-state gradient flow, and state space models. Based on the lecture_7.pdf linked from the 2026 schedule, the suggested readings, and the 2025 L7 recording."
draft: false
glossary:
  - term: "BPTT"
    aliases: ["backpropagation through time"]
    definition: "Unroll an RNN over time into one computational graph, run forward through the whole sequence to compute the loss, then backpropagate through the whole sequence. The truncated version backpropagates only over a fixed-length chunk while carrying the hidden state forward."
    context: "CS231N L7 uses it to explain how RNNs are trained and why long sequences need truncation."
  - term: "cell state"
    definition: "The extra state c that an LSTM keeps alongside the hidden state h. Backpropagating from c_t to c_{t-1} only multiplies elementwise by the forget gate f, with no matrix multiply, so gradients are less likely to vanish."
    context: "CS231N L7 compares this uninterrupted gradient path to ResNet's shortcuts."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs231n-recurrent-neural-networks)

> **Source years**: slides are the [lecture_7.pdf](https://cs231n.stanford.edu/slides/2026/lecture_7.pdf) linked from the Spring 2026 schedule; the recording is the Spring 2025 [YouTube L7](https://www.youtube.com/watch?v=kG2lAPBF7zA). The two may differ, and I flag differences below. This is post 8 of the [Reading Stanford CS231N](/posts/ai/2026-09-30-cs231n-course-overview-en) series and follows [L6: Training CNNs and CNN Architectures](/posts/ai/2026-09-30-cs231n-training-cnns-architectures-en).

Up to L6, every model took **fixed-size** input: one image in, one set of scores out. But a video is a sequence of frames, a sentence is a sequence of words, and a caption is a word sequence of unknown length. This lecture asks: **when the input or output is a sequence, how does the network have to change?**

The [official schedule](https://cs231n.stanford.edu/schedule.html) lists RNN, LSTM, GRU, language modeling, image captioning, and sequence-to-sequence. It suggests two readings: the [RNN chapter of the Deep Learning book](http://www.deeplearningbook.org/contents/rnn.html) and Christopher Olah's [Understanding LSTM Networks](https://colah.github.io/posts/2015-08-Understanding-LSTMs/).

Official materials used here:

- The lecture_7.pdf linked from the 2026 schedule, 119 pages (page numbers below are PDF pages; the deck's own footer numbers don't match them)
- The two suggested readings
- The Spring 2025 L7 recording. The 2025 schedule lists Zane Durante as the lecturer

Access level is **A3**. The 2026 class recordings are on Canvas only.

Two things to note first:

1. The footer of this deck reads "April 21, 2025," yet the page 2 announcement says A2 comes out "this Thursday (4/23)" and the project proposal is due the same day, which matches the 2026 schedule. I call it "the deck linked from the 2026 schedule" and don't infer how much changed. Compared with the [2025 lecture_7.pdf](https://cs231n.stanford.edu/slides/2025/lecture_7.pdf), the main sections are nearly the same. The 2025 deck opens with a few "Clarifications from Last Time" slides (how to scale dropout at test time, and how normalization relates to initialization) and later adds a Visual Language Navigation slide.
2. **The schedule lists GRU and sequence-to-sequence, but neither appears in the text of the 2026 slides**, and the 2025 slides don't have them either. I don't fill them in here. For GRU, Olah's suggested article covers it.

## Opening: closing out L6, then turning to sequences

Pages 3–10 wrap up the previous lecture: the three phases of training feedforward networks (one-time setup, training dynamics, evaluation), the ILSVRC winners chart, and a model complexity comparison (from Canziani et al. 2017). VGG has the most parameters and operations. AlexNet has less compute but is still memory heavy, with lower accuracy. ResNet has moderate efficiency and the highest accuracy.

Page 11 is the agenda:

- Recurrent neural networks
- Sequence modeling (so far, inputs were assumed fixed-length)
- Simple models common before the transformer era: RNNs and their variants
- The relation to modern state space models

## Five shapes of sequence problems

Pages 12–16 sort the problems with a classic figure:

| Shape | Example from the slides |
|---|---|
| one to one | A regular feedforward network |
| one to many | Image captioning: image → sequence of words |
| many to one | Action prediction: sequence of video frames → action class |
| many to many | Video captioning: sequence of frames → caption |
| many to many (per step) | Frame-level video classification |

## The core of an RNN: an internal state updated over and over

Pages 17–24. The key idea is an "internal state" that gets updated as each element of the sequence is read. The same recurrence formula applies at every time step:

```
h_t = f_W(h_{t-1}, x_t)      # new state = function(old state, input at this step)
y_t = f_{W_hy}(h_t)          # output computed from the new state
```

The slides stress that **the same function and the same parameters are used at every time step.**

The simplest form is the vanilla RNN, also called an Elman RNN after Jeffrey Elman. The state is a single hidden vector h:

```
h_t = tanh(W_hh h_{t-1} + W_xh x_t)
y_t = W_hy h_t
```

### Building an RNN by hand

Pages 25–33 are a good warm-up. The task: read a stream of 0s and 1s and output 1 whenever two 1s appear in a row. It's a many-to-many sequence task.

What should the hidden state hold? The previous input and the current one. The slides use ReLU everywhere for simplicity, initialize h_0 to (0, 0, 1), and fill in weights by hand so the output is max(current + previous − 1, 0). And "it just works."

Then the slides ask the real question: **how do you find those Ws in practice?** By training, which is the next section.

## Computational graph and BPTT

Pages 34–50 unroll the RNN over time into a computational graph. Every step reuses the same weight matrix W, so W's gradient is the sum of the gradients from each step.

- **Many to many**: each step has an output y_t and a loss L_t, and the total loss is their sum.
- **Many to one**: output only at the last step.
- **One to many**: input only at the first step; later inputs are 0 or the previous output.

Training uses **backpropagation through time (BPTT)**: run forward through the whole sequence to compute the loss, then backward through the whole sequence to compute the gradient. That gets expensive for long sequences, so there's **truncated BPTT**: run forward and backward through chunks, carry the hidden state forward forever, but backpropagate only over a smaller number of steps.

## Character-level language model

Pages 51–65 use a more practical example. The vocabulary is four characters, [h, e, l, o], and the training sequence is "hello." Each step takes a one-hot character vector and outputs scores for the next character, which softmax turns into probabilities.

At test time the model **samples** one character at a time and feeds it back as the next input.

Along the way the slides explain embedding layers. Multiplying a one-hot vector by a weight matrix just picks out one column, so in practice a separate embedding layer usually sits between the input and the hidden layer.

Then comes the classic example from Andrej Karpathy's 2015 blog post: [min-char-rnn.py](https://gist.github.com/karpathy/d4dee566867f8291f086), 112 lines of Python. The slides show samples that start as gibberish, improve with training, and end up producing C code. The generated-C-code slide lists OpenAI Codex, GitHub Copilot, Claude Code, and Cursor as a reminder of where this line of work led.

Pages 66–72, "Searching for interpretable cells": some hidden units specialize in tracking quotes, line length, if statements, comments, and code depth.

### RNN tradeoffs

Page 73:

- **Advantages**: handles input of any length (no context length); step t can in theory use information from many steps back; model size doesn't grow with input length; the same weights at every step make processing symmetric.
- **Disadvantages**: recurrent computation is slow; in practice it's hard to reach information from many steps back.

## Image captioning: plugging a CNN into an RNN

Pages 74–87 are the lecture's most direct link to computer vision. The slides list four representative papers (Mao et al.; Vinyals et al., Show and Tell; Donahue et al., LRCN; Chen and Zitnick), plus Karpathy and Fei-Fei's "Deep Visual-Semantic Alignments for Generating Image Descriptions."

The recipe:

1. Take a CNN (the slides draw a VGG-shaped network), **remove the final FC-1000 and softmax**, and use the FC-4096 output vector v to represent the image.
2. The RNN's first input is a special `<START>` token.
3. Change the recurrence to include the image feature:

```
before: h = tanh(W_xh x + W_hh h)
now:    h = tanh(W_xh x + W_hh h + W_ih v)
```

4. At each step, sample a word from the output distribution (the slides' example draws "straw," then "hat") and feed it back in.
5. Stop when the `<END>` token is sampled.

The slides show neuraltalk2 successes and failures. The failures teach the most. The model describes a woman in a fur coat as "A woman is holding a cat in her hand" and a person doing a handstand by a lake as "A woman standing on a beach holding a surfboard." It picks up things that often appear together without actually understanding the scene.

Two more slides extend this to other vision-and-language tasks: VQA (Agrawal et al. 2015; Zhu et al.'s Visual 7W) and Visual Dialog (Das et al., CVPR 2017).

**What to do**: this section is exactly what [A2](/posts/ai/2026-09-30-cs231n-a2-batchnorm-cnn-pytorch-rnn-en) Q5, "Image Captioning with Vanilla RNNs," has you implement. The official assignment page says it uses COCO and lives in `RNN_Captioning_pytorch.ipynb`. Draw the "now" formula above as a computational graph on paper before you open the notebook.

## Why vanilla RNNs are hard to train

Page 91 briefly covers multilayer RNNs, stacking layers in depth with each unrolled in time. Pages 93–104 then get to the math at the center of the lecture: gradient flow.

Backpropagating from h_t to h_{t-1} multiplies by the transpose of W_hh. Going back many time steps means **multiplying by the same matrix again and again**:

- With the tanh derivative in the mix, the factor is almost always below 1, so **gradients vanish**.
- Even without the nonlinearity: a largest singular value above 1 means **exploding gradients**, and below 1 means vanishing gradients.

The fixes differ:

| Problem | Fix |
|---|---|
| Exploding gradients | **Gradient clipping**: scale the gradient down if its norm is too big |
| Vanishing gradients | **Change the RNN architecture** |

The slides cite two classic analyses, Bengio et al. 1994 and Pascanu et al. 2013.

## LSTM: one more path with uninterrupted gradient flow

Pages 105–116. The LSTM (Hochreiter and Schmidhuber 1997) keeps a **cell state** c alongside the hidden state h and controls it with four gates:

| Gate | Activation | Role (slide wording) |
|---|---|---|
| i: input gate | sigmoid | Whether to write to cell |
| f: forget gate | sigmoid | Whether to erase cell |
| o: output gate | sigmoid | How much to reveal cell |
| g: "gate gate" | tanh | How much to write to cell |

All four come from one matrix W applied to [h_{t-1}, x_t] (W is 4h × 2h).

<details>
<summary>LSTM update equations</summary>

```
c_t = f ⊙ c_{t-1} + i ⊙ g
h_t = o ⊙ tanh(c_t)
```

⊙ is elementwise multiplication.

</details>

The point is gradient flow: **backpropagating from c_t to c_{t-1} only multiplies elementwise by f, with no matrix multiply by W.** The whole c path gives uninterrupted gradient flow. The slides put this next to ResNet with the note "Similar to ResNet!" Recall from [L6](/posts/ai/2026-09-30-cs231n-training-cnns-architectures-en) that ResNet's residual connections solve the same kind of optimization problem.

Do LSTMs solve vanishing gradients? Page 115 answers carefully:

- The LSTM makes it **easier** for an RNN to preserve information over many time steps. If f = 1 and i = 0, a cell's information is preserved indefinitely. By contrast, it's hard for a vanilla RNN to learn a recurrent weight matrix that preserves information.
- The LSTM **doesn't guarantee** there's no vanishing or exploding gradient, but it gives the model an easier way to learn long-distance dependencies.

## Modern RNNs: state space models

Page 117 connects RNNs to the present. Some modern models, sometimes called "state space models," also keep a hidden state. Their main advantages are unlimited context length and compute that scales linearly with sequence length. The slide shows an RWKV scaling plot along with "Simplified State Space Layers for Sequence Modeling" and "Mamba: Linear-Time Sequence Modeling with Selective State Spaces."

The summary on page 118:

- RNNs allow a lot of flexibility in architecture design.
- Vanilla RNNs are simple but don't work very well.
- More complex variants (e.g., LSTMs, Mamba) can selectively pass information forward.
- Backward gradient flow in an RNN can explode or vanish. Exploding is controlled with gradient clipping, and backpropagation through time is often needed.

The last slide previews the next lecture: attention and transformers.

## What this post can and can't confirm

Confirmed: the 2026 schedule's topics and suggested readings, the content of the deck linked from the 2026 schedule, the A2 Q5 description, and the existence and lecturer of the 2025 L7 recording (per the 2025 schedule).

Not confirmed: how much of GRU and sequence-to-sequence, both listed on the schedule, was covered in class (neither year's slides mention them in text); who taught this lecture in 2026 (the lecturer column on the 2026 schedule is commented out); and what the 2026 class recording contains (Canvas only).

Further reading on this site: [CS224N on RNNs and language models](/posts/ai/2026-08-22-cs224n-rnn-language-models-en) covers the same models from the NLP side. [CMU 11-785's first RNN lecture](/posts/ai/2026-08-22-cmu-11785-13-rnn-one-en) and its [seq2seq lecture](/posts/ai/2026-08-22-cmu-11785-15-seq2seq-ctc-en) cover the sequence-to-sequence material these slides don't expand on.

Series navigation: previous [L6: Training CNNs and CNN Architectures](/posts/ai/2026-09-30-cs231n-training-cnns-architectures-en) | next [A2 guide: BatchNorm, Dropout, CNNs, PyTorch, and RNN Captioning](/posts/ai/2026-09-30-cs231n-a2-batchnorm-cnn-pytorch-rnn-en) | [series overview](/posts/ai/2026-09-30-cs231n-course-overview-en)

## References

- [CS231n: Deep Learning for Computer Vision (Spring 2026 course site)](https://cs231n.stanford.edu/)
- [CS231n Spring 2026 schedule](https://cs231n.stanford.edu/schedule.html)
- [Lecture 7: Recurrent Neural Networks slides (as linked from the 2026 schedule)](https://cs231n.stanford.edu/slides/2026/lecture_7.pdf)
- [Lecture 7 slides (Spring 2025, for comparison)](https://cs231n.stanford.edu/slides/2025/lecture_7.pdf)
- [Stanford CS231N Spring 2025 Lecture 7: Recurrent Neural Networks (YouTube)](https://www.youtube.com/watch?v=kG2lAPBF7zA)
- [CS231n Spring 2025 schedule](https://cs231n.stanford.edu/2025/schedule.html)
- [Goodfellow, Bengio, Courville: Deep Learning, RNN chapter (suggested reading on the schedule)](http://www.deeplearningbook.org/contents/rnn.html)
- [Christopher Olah: Understanding LSTM Networks](https://colah.github.io/posts/2015-08-Understanding-LSTMs/)
- [Andrej Karpathy: min-char-rnn.py](https://gist.github.com/karpathy/d4dee566867f8291f086)
- [CS231n Assignment 2 (Spring 2026)](https://cs231n.github.io/assignments2026/assignment2/)
