---
title: "CNNs and ViT: Turning an Image into Model Inputs | CMU 10-423 Lecture 5"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, cnn, bert, vision-transformer, computer-vision]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 7
tldr: "Text models convert text into tokens; image models also need a computational representation of pixels."
description: "A teaching guide based on public Spring 2026 materials: CNNs and ViT: Turning an Image into Model Inputs | CMU 10-423 Lecture 5"
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-cnn-bert-vit)

**Video status: recordings require sign-in or course authorization.** This guide uses public slides and assignments; numerical examples are site-authored, not a lecture transcript.

Text models convert text into tokens; image models also need a computational representation of pixels. CNNs apply shared local filters, while ViT splits an image into patches and integrates them with a Transformer. We follow the same small image through both routes and explain where BERT's bidirectional attention fits.

Prerequisites are attention and shape reasoning from Lecture 2. If convolution is unfamiliar, start with a shared weighted sum over each small window. Its locality and receptive field become clearer after the arithmetic.

## Move one filter across an image

Our original grayscale example has rows [1,2,3,4], [5,6,7,8], [9,10,11,12], and [13,14,15,16]. Use an all-ones 2×2 kernel, stride two, no padding, and zero bias. The output width and height are (4−2)/2+1=2.

The upper-left window contains 1,2,5,6 and sums to 14. The upper-right sums to 22, the lower-left to 46, and the lower-right to 54. Thus the output is [14,22;46,54]. One kernel is reused at all four positions rather than storing four independent parameter sets.

Deep learning libraries generally implement cross-correlation without flipping the kernel, although it is conventionally called convolution. The all-ones kernel is unaffected by this distinction. An asymmetric kernel requires following the library's actual convention.

For multichannel input, a filter combines weighted values across all input channels into one output channel. A 2×2 filter on RGB has 12 weights plus one bias, rather than independently assigning final class scores to the three colors.

## Locality and receptive fields impose useful assumptions

Local connections and shared weights encode an image-specific inductive bias. A filter can detect a shifted pattern at another location, although stride, padding, and boundaries affect exact translation behavior. Stacking layers expands the receptive field: two stride-one 3×3 convolutions give a central output a 5×5 receptive field, not 6×6.

Pooling and striding reduce spatial resolution, lowering cost and combining information but potentially losing precise locations. Compression useful for classification may be inappropriate for pixel-level prediction.

## Convert the same image into ViT tokens

Split the 4×4 image into nonoverlapping 2×2 patches. There are four patches, each flattened into four values; the upper-left becomes [1,2,5,6]. A shared linear projection converts each patch into a d-dimensional token. Four pixels form one patch token, not four separate tokens.

At d=3, the projection has 12 weights plus three biases. The four tokens form `[4,3]`, receive positional information, and become `[5,3]` if a class token is added. Single-head attention then uses a 5×5 score matrix. Other readout schemes can omit the class token; it is not required by every image Transformer.

Changing to 1×1 patches increases image tokens from four to sixteen. With a class token, attention pairs grow from 25 to 289. Smaller patches can preserve detail but impose a larger sequence cost.

## Bidirectional attention depends on the task

BERT is an encoder-only Transformer that lets input positions read both left and right context. Masked language modeling hides selected input tokens and predicts them from visible context. Its masking and target placement differ from autoregressive next-token training.

ViT commonly uses bidirectional self-attention because the complete input image is already available. This does not justify placing a bidirectional text encoder over unshifted next-token targets: the model could read the content it should predict. Task definitions determine visibility, not the Transformer label alone.

## Variations with answers

An 8×8 RGB image with 2×2 patches, embedding dimension six, and one class token has sixteen image tokens. Each raw patch has twelve values; its projection has 72 weights plus six biases. The complete sequence has seventeen tokens and a 17×17 single-head score matrix.

Change the original grayscale convolution to stride one without padding. The output is 3×3, and its upper-left value remains 14, but adjacent windows overlap. Once you can calculate token counts, parameter counts, and visibility, you can examine how image representations support GAN and diffusion generation.

[Previous](/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa-en) | [Next](/posts/ai/2026-09-30-cmu10423-gans-en) | [Series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## Course Video Sources

The official recording index is on SCS Panopto. The anonymous folder view is unloaded and requests sign-in; this is an access limitation, not evidence that recordings do not exist. Original audio and subtitles require the appropriate course access.

- [Official Panopto recording index](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [Official course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## References

- [Lecture 5 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture5-cnn-vit.pdf)
- [Deep Learning: Convolutional Networks](https://www.deeplearningbook.org/contents/convnets.html)
- [BERT](https://arxiv.org/abs/1810.04805)
- [Vision Transformer](https://arxiv.org/abs/2010.11929)
- [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [inked in-class version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture5-cnn-vit-ink.pdf)
- [sections 9.1–9.3](http://www.deeplearningbook.org/contents/convnets.html)
- [BERT](https://arxiv.org/pdf/1810.04805.pdf)
- [ViT](https://arxiv.org/pdf/2010.11929.pdf)
- [Spring 2026 practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
- [HW2 handout (hw2.zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw2.zip)
