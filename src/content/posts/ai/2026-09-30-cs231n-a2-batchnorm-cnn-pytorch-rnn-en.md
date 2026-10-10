---
title: "CS231N Assignment 2 Guide: BatchNorm, Dropout, CNNs, PyTorch, and RNN Captioning"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, deep-learning, pytorch, cnn]
lang: en
series:
  name: "Reading Stanford CS231N"
  order: 9
tldr: "Assignment 2 of CS231N Spring 2026 is worth 18% of the grade. Across five notebooks you hand-write BatchNorm/LayerNorm, dropout, and the forward and backward passes for convolution and pooling, then learn PyTorch at three levels of abstraction, and finish with RNN image captioning on COCO in PyTorch. Q4 is the turning point: through Q3 you derive every gradient yourself, and from Q5 on autograd takes over while a numerical gradient check confirms it. The official slides warn that this is the longest of the three assignments."
description: "A guide to Stanford CS231N (Spring 2026) Assignment 2, built from the official assignment page and the assignment2.zip starter code: Q1 BatchNorm and LayerNorm, Q2 dropout, Q3 convolutional networks with spatial batch/group norm, Q4 PyTorch's three APIs and the CIFAR-10 challenge, Q5 RNN captioning. Covers files, inline questions, and a self-study route. No solutions."
draft: false
glossary:
  - term: "Batch Normalization"
    aliases: ["BatchNorm"]
    definition: "At training time, normalize each feature using the minibatch mean and variance, then multiply by a learned scale (γ) and add a learned shift (β). At test time, use the running mean and variance accumulated during training."
    context: "CS231N A2 Q1 has you write its forward pass, its backward pass, and a simplified backward pass."
  - term: "Group Normalization"
    aliases: ["GroupNorm"]
    definition: "Split each example's channels into G groups and normalize within each group of each example. It sits between LayerNorm (normalize the whole example) and BatchNorm (normalize across the batch), and does not depend on batch size."
    context: "The last part of CS231N A2 Q3 asks for spatial group normalization."
  - term: "autograd"
    aliases: ["automatic differentiation"]
    definition: "PyTorch's automatic differentiation engine. It records a dynamic computational graph during the forward pass and computes all parameter gradients when you call backward, so you don't hand-write backpropagation."
    context: "CS231N A2 switches to autograd from Q4 on; in Q5 you only write the RNN forward pass."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs231n-a2-batchnorm-cnn-pytorch-rnn)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

> **Version note**: This guide follows the Spring 2026 [CS231N](https://cs231n.stanford.edu/) [Assignment 2 page](https://cs231n.github.io/assignments2026/assignment2/) and the downloadable [assignment2.zip](https://cs231n.github.io/assignments/2026/assignment2.zip), downloaded on 2026-09-30 with every notebook and `cs231n/` module opened and checked. For the matching lectures, use the [Spring 2025 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16); 2026 recordings are on Canvas for enrolled students only, and the two years may differ. Access level **A3**: the handout and starter code are fully public. What you can't get is the Gradescope autograder, Ed announcements (including the notebook fix mentioned in Lecture 9), and grades. This post explains what each question trains. It gives no solutions.

**Series**: previous [L7: Recurrent Neural Networks and Image Captioning](/posts/ai/2026-09-30-cs231n-recurrent-neural-networks-en) | next [L8: Attention, Transformers, and ViT](/posts/ai/2026-09-30-cs231n-attention-transformers-vit-en) | [Series overview](/posts/ai/2026-09-30-cs231n-course-overview-en)

In A1 you built a fully connected network in numpy by hand. A2 asks two follow-up questions. Once the network gets deep, how do you keep it trainable? And when should you hand backpropagation over to a framework?

The five questions form a ramp from deriving gradients yourself to letting PyTorch do it. The [assignments page](https://cs231n.stanford.edu/assignments.html) weights A2 at 18% of the course grade, the most of the three assignments. Page 2 of the [Lecture 9 slides](https://cs231n.stanford.edu/slides/2026/lecture_9.pdf) also warns that A2 is the longest of the three, and that the midterm and project milestone deadlines follow closely after it. Start early.

## Course video sources

Official course and existing recording entries are linked below. A single public video matching this article has not been verified for embedding. Rechecked live on 2026-10-10: the official Spring 2026 schedule lists no recording links, no public Spring 2026 playlist was found, and the Spring 2025 playlist has no single lecture matching this article’s scope. Checked: 2026-10-10.

Course and recording entries:

- [Spring 2025 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [Official course / lecture source](https://cs231n.stanford.edu/schedule.html)

## What the assignment looks like

| Question | Notebook | Files you edit | Lecture |
|---|---|---|---|
| Q1 Batch Normalization | `BatchNormalization.ipynb` | `cs231n/layers.py`, `classifiers/fc_net.py` | [L6](/posts/ai/2026-09-30-cs231n-training-cnns-architectures-en) |
| Q2 Dropout | `Dropout.ipynb` | `cs231n/layers.py`, `classifiers/fc_net.py` | L6 |
| Q3 Convolutional networks | `ConvolutionalNetworks.ipynb` | `cs231n/layers.py`, `classifiers/cnn.py` | [L5](/posts/ai/2026-09-30-cs231n-cnn-image-classification-en), L6 |
| Q4 PyTorch on CIFAR-10 | `PyTorch.ipynb` | the notebook itself | 4/24 PyTorch review session |
| Q5 RNN image captioning | `RNN_Captioning_pytorch.ipynb` | `cs231n/rnn_layers_pytorch.py`, `classifiers/rnn_pytorch.py` | [L7](/posts/ai/2026-09-30-cs231n-recurrent-neural-networks-en) |

The [assignment page](https://cs231n.github.io/assignments2026/assignment2/) gives the deadline as Friday, May 8, 2026 at 11:59pm PST. Page 2 of the Lecture 8 slides says "due 5/7". That's a one-day gap; this guide goes with the assignment page.

One more mismatch to flag up front. The [assignments page](https://cs231n.stanford.edu/assignments.html) lists A2's topics as "Batch Normalization, Dropout, Convolutional Nets, Network Visualization, Image Captioning with RNNs". That list has Network Visualization and no PyTorch. The assignment page and the zip, however, make PyTorch the fourth question and contain no visualization notebook. This guide follows the assignment page and the starter code.

Everything runs in Colab. After the five notebooks, run `collect_submission.ipynb`. It zips your code into `a2_code_submission.zip` and converts every notebook into one `a2_inline_submission.pdf`; you upload both to Gradescope. The page adds a warning: cells must have run top to bottom, or the autograder may choke. If in doubt, use "Restart and Run All".

## Q1: BatchNorm and LayerNorm

**The situation**: stack A1's fully connected network five or six layers deep, and a slightly off initialization is enough to stall training.

The notebook opens with the hypothesis from [Ioffe & Szegedy 2015](https://arxiv.org/abs/1502.03167). The distribution of features deep in the network keeps shifting as earlier weights update, and that makes deep networks harder to train. BatchNorm inserts normalization layers into the network. At training time a layer estimates the mean and variance from the minibatch. At test time it uses running averages collected during training.

In `layers.py` you write:

1. `batchnorm_forward`, with separate train and test modes.
2. `batchnorm_backward`, backpropagating step by step through the computational graph.
3. `batchnorm_backward_alt`, the version you simplify on paper first. The notebook draws the sigmoid analogy: you can backprop through sigmoid's intermediate values, or derive a short closed-form gradient on paper. BatchNorm simplifies the same way.
4. BatchNorm inside `FullyConnectedNet`, followed by a comparison of deep networks with and without it.

Two experiments follow, each with an inline question. One varies the weight initialization scale and compares networks with and without BatchNorm. The other varies batch size and asks how BatchNorm's behavior changes with it.

<details>
<summary>Where the BatchNorm backward derivation starts (from the notebook)</summary>

The alternative-backward section writes out the forward pass in four lines, and you simplify from there:

```text
μ   = (1/N) Σ_k x_k
v   = (1/N) Σ_k (x_k − μ)²
σ   = sqrt(v + ε)
y_i = (x_i − μ) / σ
```

The hard part is that μ and σ depend on the whole batch. The gradient for each x_i comes back along three paths: directly through y_i, through μ, and through v. The first version computes the three paths separately, following the graph. The second merges them into one expression.

</details>

The second half switches to [Layer Normalization](https://arxiv.org/abs/1607.06450) (Ba, Kiros, and Hinton). LayerNorm normalizes each example over its own features and doesn't depend on the batch. You write `layernorm_forward` and `layernorm_backward`, then rerun the batch size experiment. Two inline questions here make good self-checks:

- Of four image preprocessing steps, which one is analogous to BatchNorm, and which to LayerNorm?
- When is LayerNorm likely not to work well? The options are a very deep network, a very small feature dimension, and a large regularization term.

## Q2: Dropout

`Dropout.ipynb` is short. You write `dropout_forward` and `dropout_backward`, wire them into `FullyConnectedNet`, and run a regularization experiment comparing training and validation accuracy with and without dropout.

Think before you answer the inline question: what happens if inverted dropout does **not** divide by `p`? The answer has to do with the expected output in training mode versus test mode.

## Q3: Convolutional networks

This is the last stop for hand-written gradients in A2, and the longest question. The notebook's framing: fully connected networks are computationally cheap and make good testbeds, but state-of-the-art results all come from convolutional networks.

In order:

1. **Naive convolution**: `conv_forward_naive` and `conv_backward_naive`. An aside shows image processing done with convolutions.
2. **Naive max pooling**: `max_pool_forward_naive` and `max_pool_backward_naive`.
3. **Fast layers**: the staff provide fast versions in `fast_layers.py`, backed by a Cython extension. The first time, run the compile cell, save the notebook, restart the runtime, and rerun from the top.
4. **Sandwich layers and a three-layer ConvNet**: finish `ThreeLayerConvNet` in `classifiers/cnn.py`, then go through sanity-check loss → gradient check → overfit a small dataset → full training → visualize the first-layer filters.
5. **Spatial BatchNorm**: extend Q1's BatchNorm to `(N, C, H, W)` feature maps.
6. **Spatial Group Normalization**: the notebook quotes an observation from the LayerNorm paper. On convolutional layers, LayerNorm underperforms BatchNorm, because units whose receptive fields sit near the image border have very different statistics from the rest. [Group Normalization](https://arxiv.org/abs/1803.08494) (Wu & He) compromises by splitting each example's channels into G groups and normalizing per group.

The sanity check → gradient check → overfit-small-data sequence is the debugging routine the whole course keeps coming back to. Step 4 walks you through it once more, and the habit matters more than getting any one formula right.

## Q4: PyTorch, the same network written three ways

Q4 is where the assignment turns. The notebook puts it plainly: now that you understand a framework's guts, you're free to use one. PyTorch runs on GPUs without writing CUDA, and it will make your final project experiments much faster.

`PyTorch.ipynb` has five parts and writes the same models at three levels of abstraction:

| Part | Abstraction | Approach |
|---|---|---|
| Part II Barebones | Level 1 | Raw tensors; you manage parameters and initialization |
| Part III Module API | Level 2 | Subclass `nn.Module`, define layers in `__init__`, chain them in `forward` |
| Part IV Sequential API | Level 3 | Write a feed-forward stack in one go with `nn.Sequential` |
| Part V CIFAR-10 challenge | Your choice | Design your own network |

The notebook includes a trade-off table: Barebones has high flexibility and low convenience; `nn.Module` has high flexibility and medium convenience; `nn.Sequential` has low flexibility and high convenience.

At each level you train a two-layer fully connected net and a three-layer ConvNet (32 5×5 filters → ReLU → 16 3×3 filters → ReLU → fully connected to 10 classes). Each comes with an accuracy you should see after one epoch as a sanity check. The Barebones ConvNet should beat 42%, for example. The Sequential ConvNet uses SGD with Nesterov momentum 0.9 and should beat 55%.

Part V asks for at least 70% accuracy on the CIFAR-10 **validation** set within 10 epochs. Layers, optimizer, and hyperparameters are up to you. The notebook suggests directions: filter size, number of filters, max pooling versus strided convolution, spatial batch norm after conv layers (PyTorch calls it `BatchNorm2d`), and deeper networks. You describe what you did at the end of the notebook, and you run the test set only once.

If PyTorch is new to you, start with the [Colab notebook](https://colab.research.google.com/github/cs231n/cs231n.github.io/blob/master/pytorch.ipynb) from the 4/24 PyTorch Review Session on the schedule. It covers tensors, broadcasting, and autograd, then building a simple network, Datasets and DataLoaders, and FashionMNIST, then CPU versus GPU training speed, and ends with pre-trained weights.

## Q5: RNN image captioning in PyTorch

The last question connects [L7](/posts/ai/2026-09-30-cs231n-recurrent-neural-networks-en)'s RNN to CNN features and generates image captions on COCO.

**The data**: the notebook uses the 2014 release of [COCO](https://cocodataset.org/), about 80,000 training and 40,000 validation images, each with 5 captions written by Amazon Mechanical Turk workers. You don't run the images through a CNN yourself. The staff already extracted fc7 features from an ImageNet-pretrained VGG-16 and reduced them from 4096 to 512 dimensions with PCA. The raw images take nearly 20 GB, so they aren't in the download; you get Flickr URLs for visualization. Captions come pre-encoded as sequences of integer IDs.

**What you write**, all in `rnn_layers_pytorch.py` and `classifiers/rnn_pytorch.py`:

- `rnn_step_forward` and `rnn_forward`: a vanilla RNN for one step and for a whole sequence.
- `word_embedding_forward`: word IDs to vectors.
- `temporal_affine_forward` and `temporal_softmax_loss`: the per-timestep output layer and loss, with a mask for varying lengths.
- `loss` and `sample` in `CaptioningRNN`.

This is the turn. The notebook states that because you write these in PyTorch, **autograd handles the backward pass**, and functions like `rnn_step_backward` are not required. You still verify autograd's gradients with the numerical gradient checker. If you feel adventurous you can write the backward passes yourself, but it's optional.

The `sample` method handles the gap between training and testing. During training, each step is fed the ground-truth word. At test time, you sample from the vocabulary distribution and feed that sample in at the next step. The notebook warns you: on an overfit small model, samples on training data look very good and samples on validation data mostly won't make sense.

The starter `CaptioningRNN` also accepts `cell_type='lstm'`, and `rnn_layers_pytorch.py` has stubs for `lstm_step_forward` and `lstm_forward`. The notebook, however, only asks for the vanilla RNN and says just "you will implement the LSTM case later". Neither the A2 page nor the notebook lists an LSTM question.

The one inline question: what's one advantage and one disadvantage of a **character-level** RNN for captioning? The hint says to compare the parameter spaces of word-level and character-level models.

## How to self-study it

1. **Watch the prerequisite lectures first**: Q1–Q3 build on L5–L6 and Q5 on L7. Watch [Lectures 5–7](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16) from the 2025 playlist before you start.
2. **Write both BatchNorm backward passes**: the simplified one is the best "graph versus derivation on paper" exercise in the assignment, and it extends [L4 on backpropagation](/posts/ai/2026-09-30-cs231n-neural-networks-backprop-en).
3. **Do the PyTorch review Colab before Q4**: it takes an afternoon and makes Part V much easier.
4. **Turn on the GPU for Part V**: in Colab, use `Runtime → Change runtime type` and select GPU. Do it before the imports, since switching restarts the kernel.
5. **Respect the Honor Code**: the [assignments page](https://cs231n.stanford.edu/assignments.html) notes that past solutions circulate online and expects submitted work to be your own. Generative AI falls under the collaboration policy: write your solutions independently, note the nature of the collaboration, and don't use AI to substantially complete the work, which the page calls an Honor Code violation.

## Further reading

- The same hand-written-layers-to-framework path starts in the [A1 guide](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet-en)
- The next assignment replaces the RNN with a Transformer: [A3 guide](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip-en)
- How another course teaches backprop and neural nets: [CS224N: Backpropagation and Neural Networks](/posts/ai/2026-08-22-cs224n-backprop-neural-nets-en)
- A fuller deep learning theory course: [MIT 6.7960 guide](/posts/ai/2026-08-26-mit-67960-deep-learning-guide-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Rechecked official sources; there is still no public recording matching this article, and a check date was added.

## References

- [CS231N course home (Spring 2026)](https://cs231n.stanford.edu/) — instructors, grading, recording policy
- [CS231N Assignment 2 page (Spring 2026)](https://cs231n.github.io/assignments2026/assignment2/) — deadline, goals, Q1–Q5, submission steps
- [assignment2.zip starter code](https://cs231n.github.io/assignments/2026/assignment2.zip) — five notebooks, `cs231n/` modules, `collectSubmission.sh`
- [CS231N assignments page](https://cs231n.stanford.edu/assignments.html) — A2 weight of 18%, Honor Code, generative AI policy (its topic list says Network Visualization, unlike the assignment page)
- [CS231N schedule (Spring 2026)](https://cs231n.stanford.edu/schedule.html) — A2 release date, PyTorch Review Session
- [PyTorch Review Session Colab](https://colab.research.google.com/github/cs231n/cs231n.github.io/blob/master/pytorch.ipynb)
- [Lecture 8 slides (Spring 2026)](https://cs231n.stanford.edu/slides/2026/lecture_8.pdf) — page 2, "Assignment 2 out, due 5/7"
- [Lecture 9 slides (Spring 2026)](https://cs231n.stanford.edu/slides/2026/lecture_9.pdf) — page 2, A2 is the longest, notebook fix notice
- [Spring 2025 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [Ioffe & Szegedy, Batch Normalization (2015)](https://arxiv.org/abs/1502.03167)
- [Ba, Kiros & Hinton, Layer Normalization (2016)](https://arxiv.org/abs/1607.06450)
- [Wu & He, Group Normalization (2018)](https://arxiv.org/abs/1803.08494)
- [COCO dataset](https://cocodataset.org/)
