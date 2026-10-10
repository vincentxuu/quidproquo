---
title: "CS231N Assignment 3: Transformer Captioning, Self-Supervised Learning, DDPM, CLIP and DINO"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, homework, transformer, vision-transformer, self-supervised-learning, contrastive-learning, diffusion-model, clip]
lang: en
series:
  name: "Reading Stanford CS231N"
  order: 18
tldr: "Assignment 3 in CS231N Spring 2026 is worth 15% of the grade and turns L8, L12–L14 and L16 into four Colab notebooks. Q1 has you write multi-head attention and a Transformer decoder for COCO captioning, then assemble a ViT and train it on CIFAR-10. Q2 implements SimCLR's augmentations and contrastive loss and compares linear classification with and without self-supervised pretraining. Q3 builds DDPM's noising, UNet, denoising loss, sampling and classifier-free guidance to generate text-conditioned 32×32 emoji. Q4 uses pretrained CLIP for similarity, zero-shot classification and retrieval, then segments a video with DINO features trained on a single labeled frame. This guide covers structure, files and targets only. No solutions."
description: "A guide to Stanford CS231N Spring 2026 Assignment 3: which files and functions the Transformer_Captioning, Self_Supervised_Learning, DDPM and CLIP_DINO notebooks ask you to fill in, the numeric checks you have to pass, what the inline questions ask, which lectures they build on, and what a self-learner outside Stanford can and cannot get. Assignment from Spring 2026, recordings from Spring 2025. No solutions."
draft: false
glossary:
  - term: "NT-Xent loss"
    aliases: ["normalized temperature-scaled cross entropy"]
    definition: "The contrastive loss in SimCLR: pull together the representations of two augmented views of the same image and push away every other sample in the batch, using cosine similarity divided by a temperature τ."
    context: "A3 Q2 asks for a pairwise version first, then a vectorized one."
  - term: "classifier-free guidance"
    aliases: ["CFG"]
    definition: "Randomly drop the condition while training a conditional diffusion model; at sampling time, extrapolate from the unconditional noise prediction toward the conditional one, with a weight w that trades fidelity against diversity."
    context: "The last part of A3 Q3 implements it in `Unet.cfg_forward`."
  - term: "zero-shot classification"
    definition: "Classify without training on any labeled examples: describe each class in a sentence and predict the sentence closest to the image in a shared embedding space."
    context: "A3 Q4 implements `clip_zero_shot_classifier` on top of pretrained CLIP."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip)

> **Which year**: The assignment follows the [CS231N](https://cs231n.stanford.edu/) Spring 2026 [Assignment 3 page](https://cs231n.github.io/assignments2026/assignment3/) and the [assignment3.zip starter code](https://cs231n.github.io/assignments/2026/assignment3.zip) (downloaded 2026-09-30; the notebooks were last modified in May 2026). Recordings for the related lectures come from the [Spring 2025 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16). The 2026 recordings are on Canvas for enrolled students only, and the two years may differ.
>
> This is post 18 in the [Reading Stanford CS231N](/posts/ai/2026-09-30-cs231n-course-overview-en) series.

**Series**: previous [L16: Vision and Language](/posts/ai/2026-09-30-cs231n-vision-language-en) | next [L15: 3D Vision](/posts/ai/2026-09-30-cs231n-3d-vision-en) | [series overview](/posts/ai/2026-09-30-cs231n-course-overview-en)

A3 is the last of CS231N's three assignments. Attention, self-supervision, diffusion and CLIP have lived on slides so far. This assignment makes you write them as code that runs and passes numeric checks.

The four questions span the course's third unit:

| Question | Notebook | Main lectures |
|---|---|---|
| Q1 Image Captioning with Transformers | `Transformer_Captioning.ipynb` | [L8 Attention and Transformers](/posts/ai/2026-09-30-cs231n-attention-transformers-vit-en) |
| Q2 Self-Supervised Learning for Image Classification | `Self_Supervised_Learning.ipynb` | [L12 Self-Supervised Learning](/posts/ai/2026-09-30-cs231n-self-supervised-learning-en) |
| Q3 Denoising Diffusion Probabilistic Models | `DDPM.ipynb` | [L14 Generative Models 2](/posts/ai/2026-09-30-cs231n-generative-models-diffusion-en), with background in [L13](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan-en) |
| Q4 CLIP and DINO | `CLIP_DINO.ipynb` | [L16 Vision and Language](/posts/ai/2026-09-30-cs231n-vision-language-en) (CLIP), L12 (DINO) |

This post covers only what the official page and the starter code show: questions, files and targets. **It gives no solutions.**

## Course video sources

Official course and existing recording entries are linked below. A single public video matching this article has not been verified for embedding.

Course and recording entries:

- [CS231N Spring 2025 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [Official course / lecture source](https://cs231n.stanford.edu/schedule.html)

## The basics

The [assignments page](https://cs231n.stanford.edu/assignments.html) makes A3 15% of the course grade. The 2026 schedule releases it on May 14 (the day of L13) and sets the deadline at 11:59pm Pacific on May 28.

The assignment page lists four goals: understand and implement Transformers and combine them with CNN features for captioning; use self-supervised learning to help image classification; implement DDPM for image generation; implement and understand CLIP and DINO. Most of the code is PyTorch.

The official workflow is Google Colab. Local development isn't officially supported, but a `requirements.txt` is included if you want your own virtual env. When the four notebooks are done, you run `collect_submission.ipynb`. It zips your code into `a3_code_submission.zip` and converts all notebooks into one `a3_inline_submission.pdf`, and both go to Gradescope.

Every notebook opens with a "Student Declaration" asking whether and how you used generative AI. The assignments page treats generative AI like a collaborator: you write your solutions independently, and using it to substantially complete the work violates the Honor Code. The same page says the staff knows past solutions are online and still expects your own work.

## Q1: from captioning to ViT, two Transformers in one notebook

The notebook picks up from A2's RNN captioning. You already captioned COCO images with a vanilla RNN; now you do the same job with a Transformer decoder. Unlike A2, this one is mostly PyTorch, not NumPy.

Everything you fill in lives in `cs231n/transformer_layers.py` and `cs231n/classifiers/transformer.py`, in this order:

1. **`MultiHeadAttention`**: multi-head scaled dot-product attention, with dropout on the attention weights. The notebook spells out that each head projects to d/h dimensions and the scale factor is 1/√(d/h).
2. **`PositionalEncoding`**: sine/cosine position codes added to the word embeddings.
3. **`TransformerDecoderLayer`**: self-attention, cross-attention over image features, and a per-position feedforward block.
4. **`CaptioningTransformer.forward`**: assemble the captioning model, overfit it on a small dataset (the notebook wants a final training loss below 0.05), then compare against the RNN using the provided sampling code.

The second half switches to the [Vision Transformer](https://arxiv.org/abs/2010.11929). You fill in `PatchEmbedding`, `TransformerEncoderLayer` and the `VisionTransformer` forward pass, then tune architecture and hyperparameters to **exceed 0.45 test accuracy on CIFAR-10 after 2 epochs**. This ViT average-pools all patch vectors before classifying and reuses the same 1D sinusoidal positional encoding.

Every step comes with a numeric check, with tolerances from e-3 to 1e-6. You move on only when it passes.

There are three **inline questions**. Why multiple heads, why divide by √(d/h), and why add a linear layer after attention? Why do ViTs often lose to CNNs on small datasets, and what helps? And how does self-attention cost change if you separately double the hidden dimension, the image side length, the patch size, or the number of layers?

Think about that last one before you code. It checks whether you've absorbed that token count depends on image size and patch size.

## Q2: SimCLR, and whether pretraining actually helps

The assignment page reminds you to switch the Colab runtime to GPU before you start.

The notebook uses [SimCLR](https://arxiv.org/abs/2002.05709) as its template. Augment the same image twice, pass both through an encoder f to get representations h, then through a projection head g to get z. The contrastive loss pulls the two z's of the same image together. After training, g is discarded and only f is kept for downstream tasks.

The work sits in `cs231n/simclr/`:

- **`data_utils.py`**: `compute_train_transform()` applies a random resized crop to 32×32, a horizontal flip with probability 0.5, color jitter with probability 0.8, and grayscale with probability 0.2. `CIFAR10Pair.__getitem__()` returns the augmented pair.
- **`contrastive_loss.py`**: first `sim` and a pairwise `simclr_loss_naive`, then the vectorized `sim_positive_pairs`, `compute_sim_matrix` and `simclr_loss_vectorized`. All checks use a 1e-7 tolerance. The notebook notes that it reorders positive pairs in the batch, so its indices differ from the paper's; the change makes vectorization easier.
- **`utils.py`**: complete `train()` using your vectorized loss.

You don't train from scratch. The course provides weights pretrained on CIFAR-10 for about 18 hours, and the notebook has you load them and train a bit more (about 10 minutes).

Then comes the experiment the whole question builds to. Remove the projection head, freeze every earlier layer, and train only a linear classifier. Compare its test accuracy with a baseline that had no self-supervised pretraining and trains all weights, and plot the two. The notebook warns up front that the baseline will look low but reasonable.

Q2 has no inline question. What you hand in is that comparison plot.

## Q3: DDPM, from the noising equation to text-conditioned generation

The notebook trains a DDPM to generate **32×32 emoji conditioned on text prompts**. Text goes through a pretrained CLIP text encoder into a 512-dimensional vector. To save time, the training-set text is already encoded.

The steps follow the equations in the [DDPM paper](https://arxiv.org/abs/2006.11239):

1. **`q_sample`** (`cs231n/gaussian_diffusion.py`): the forward noising process from Eq. (4). The check expects zero relative error.
2. **`predict_start_from_noise` and `predict_noise_from_start`**: the model can predict either the clean image or the noise, and each can be recovered from the other.
3. **`Unet.__init__` and `Unet.forward`** (`cs231n/unet.py`): define the down- and upsampling blocks and the forward pass, taking x_t, t and the text embedding and returning a tensor of the same shape.
4. **`p_losses`**: the denoising training objective.
5. **`p_sample`**: one reverse-process sampling step, from Eq. (6). The outer `sample` loop is already written.
6. **`Unet.cfg_forward`**: classifier-free guidance. The notebook gives the update ε ← (w+1)·ε(x_t, t, c) − w·ε(x_t, t, ∅), with the condition dropped at some rate during training.

The training code is in `cs231n/ddpm_trainer.py` and needs no changes. The rest of the notebook samples from a pretrained model in `cs231n/exp/pretrained`. You can train your own on a Colab GPU, but the notebook says it may take more than 12 hours on a T4 before generations look reasonable.

It is also candid about limits. The emoji dataset is small, not enough for a text-to-image model that generalizes. Unseen prompts may come out poorly, and a higher guidance scale doesn't guarantee faithfulness to the text.

Q3 also has no inline question.

## Q4: CLIP and DINO, two representations learned without labels

**The CLIP half** extracts features for COCO images and captions with a pretrained CLIP (the captioning data again, but matching pairs instead of generating). Then, in `cs231n/clip_dino.py`, you implement:

- `get_similarity_no_loop`: the text–image similarity matrix, without loops.
- `clip_zero_shot_classifier`: zero-shot classification from one description per class. The notebook lists the 10 expected predictions so you can compare.
- `CLIPImageRetriever`: the reverse direction, retrieving images from text. Comments give the expected top two for each query.

**The DINO half** starts with the motivation. Contrastive methods like SimCLR and CLIP need very large batches. [BYOL](https://arxiv.org/abs/2006.07733) avoids many negatives with a student–teacher setup, and [DINO](https://arxiv.org/abs/2104.14294) follows that idea: the student learns by backpropagation, while the teacher skips backprop and tracks an exponential moving average of the student's weights.

Three steps follow. Visualize the attention maps from the [CLS] token to each patch in the last layer of a DINO ViT. Run PCA on patch features and color the image by the top three components. Finally, implement `DINOSegmentation`: train a lightweight per-patch classifier **on the labels of a single frame from one [DAVIS](https://davischallenge.org) video**, then segment the rest of that video. The targets are mean IoU above 0.45 on the first test frame, above 0.50 on the last, and above 0.55 over the whole video. The notebook suggests a linear layer or a two-layer MLP with suitable weight decay to avoid overfitting.

There are five **inline questions**. Why does CLIP's learning depend on batch size, and what can you do if batch size is fixed? How would you extend image–text alignment to more than two modalities? Where do the tensor shapes printed in the attention-map section come from? What structure does the PCA view show, and what do same-colored and differently colored regions mean? And would a segmentation model trained on CLIP ViT patch features beat DINO or lose to it, and why?

That last question ties L12 to L16. Neither CLIP nor DINO uses human labels, but their training objectives teach patch features different things.

## What's in the starter code

`assignment3.zip` is about 24 MB, most of it one GIF used in the DINO demo. The files that matter for the four questions:

| Path | Used in |
|---|---|
| `cs231n/transformer_layers.py`, `cs231n/classifiers/transformer.py` | Q1 layers and models to fill in |
| `cs231n/captioning_solver_transformer.py`, `cs231n/classification_solver_vit.py` | Q1 training loops (provided) |
| `cs231n/simclr/` (`data_utils.py`, `contrastive_loss.py`, `utils.py`, `model.py`) | Q2 |
| `cs231n/gaussian_diffusion.py`, `cs231n/unet.py`, `cs231n/ddpm_trainer.py`, `cs231n/emoji_dataset.py` | Q3 |
| `cs231n/clip_dino.py` | Q4 functions and classes to fill in |
| `cs231n/datasets/get_datasets.sh` and friends | Download COCO and other data |

The zip still contains `images/styles/` and a style-transfer example image, but none of the four 2026 questions uses style transfer.

## What a self-learner can get

**Available**: the assignment page, the full questions and numeric checks in all four notebooks, the `.py` skeletons, and the download steps for the Q2 and Q3 pretrained weights. (The SimCLR weight URL in the Q2 notebook still returned HTTP 200 on 2026-09-30; Q3 uses `trainer.download_pretrained()`, which I haven't run.) By design, a Colab GPU is enough to get every question to "checks pass, results visible." Under the scheme in the [global AI course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en), that is access level **A3**.

**Not available**: the Gradescope autograder and the rubric for the inline questions, the TA explanations on Ed, and the 2026 lecture recordings. The numeric checks only confirm that your implementation matches the reference. Nobody grades your inline answers.

## How to self-study it

1. Go Q1 → Q2 → Q3 → Q4. Q1's attention and ViT are what let you read DINO's attention maps in Q4. Q2's contrastive loss is what explains why CLIP cares about batch size.
2. Read the matching lecture slides before each question. When a check fails, go back to the equations rather than searching for past solutions.
3. Write your inline answers in two or three sentences, then test them. For Q1's third question, actually double the image side length and time the attention.
4. Q2's comparison plot and Q4's IoU numbers are the most research-like parts. Treat them as a warm-up for the final project.

One thing to do tonight: open `Transformer_Captioning.ipynb`, read only the four scenarios in Inline Question 3, and write down on paper how token count and compute change in each.

## Further reading

- Attention and Transformers from the language-model side: [Reading Stanford CS224N](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en), [Reading Stanford CS336](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en), [Reading Stanford CME295](/posts/ai/2026-09-29-stanford-cme295-transformers-llms-en)
- The full math of diffusion and flow matching: [Reading MIT 6.S184](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en)
- Another course's take on generative models: [CS230 adversarial examples and generative models](/posts/ai/2026-08-16-cs230-adversarial-and-generative-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS231N Assignment 3 (Spring 2026)](https://cs231n.github.io/assignments2026/assignment3/)
- [assignment3.zip starter code](https://cs231n.github.io/assignments/2026/assignment3.zip)
- [CS231N assignments page (weights, Honor Code, generative AI policy)](https://cs231n.stanford.edu/assignments.html)
- [CS231N Spring 2026 schedule](https://cs231n.stanford.edu/schedule.html)
- [CS231N Spring 2025 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- Vaswani et al., [Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- Dosovitskiy et al., [An Image is Worth 16x16 Words (ViT)](https://arxiv.org/abs/2010.11929)
- Chen et al., [A Simple Framework for Contrastive Learning of Visual Representations (SimCLR)](https://arxiv.org/abs/2002.05709)
- Ho et al., [Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239)
- Radford et al., [CLIP official repo](https://github.com/openai/CLIP)
- Grill et al., [BYOL](https://arxiv.org/abs/2006.07733)
- Caron et al., [Emerging Properties in Self-Supervised Vision Transformers (DINO)](https://arxiv.org/abs/2104.14294)
