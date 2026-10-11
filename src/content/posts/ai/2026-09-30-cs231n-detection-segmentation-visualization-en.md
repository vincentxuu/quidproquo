---
title: "CS231N L9: Object Detection, Image Segmentation, and Visualization"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, cnn, object-detection, interpretability]
lang: en
series:
  name: "Reading Stanford CS231N"
  order: 11
tldr: "Lecture 9 of CS231N Spring 2026 moves from one label per image to one label per pixel and per object. Semantic segmentation uses fully convolutional networks that downsample and then upsample, and U-Net feeds high-resolution features back in. Detection goes from R-CNN's roughly 2,000 CNN forward passes to Fast R-CNN, Faster R-CNN's RPN, single-stage YOLO, and anchor-free DETR. Mask R-CNN adds a 28×28 mask per RoI. The last part covers saliency, CAM, and Grad-CAM. The adversarial examples, DeepDream, and style transfer listed on the schedule appear in neither the 2026 nor the 2025 slides."
description: "A guide to Stanford CS231N (Spring 2026) Lecture 9, built from the 147-page official slides: how classification, semantic segmentation, object detection, and instance segmentation differ in output; sliding windows and fully convolutional networks; unpooling and transposed convolution; U-Net; the multitask loss for single-object localization; R-CNN, Fast R-CNN, RPN and anchors; YOLO/SSD/RetinaNet; DETR; Mask R-CNN; first-layer filters, saliency maps, CAM, Grad-CAM, and ViT feature visualization. It also flags where the schedule's topic list and the actual slides disagree."
draft: false
glossary:
  - term: "semantic segmentation"
    definition: "Label every pixel of an image with a category without separating instances of the same category; two adjacent cows become one region labeled 'cow'."
    context: "CS231N Lecture 9 uses it as the first dense prediction task."
  - term: "transposed convolution"
    aliases: ["deconvolution"]
    definition: "A learnable upsampling layer: each input pixel scales the filter, the scaled copy is placed on the output, and overlapping regions are summed. The stride sets the ratio between movement in the output and in the input."
    context: "CS231N Lecture 9 uses a 3×3, stride-2 example that upsamples a 2×2 input to 4×4."
  - term: "anchor box"
    definition: "A candidate box of fixed size and aspect ratio placed at each position of a feature map. The model predicts whether it contains an object and the offsets that correct it to the ground-truth box."
    context: "CS231N Lecture 9 introduces it in the Region Proposal Network section."
  - term: "Grad-CAM"
    aliases: ["Gradient-weighted Class Activation Mapping"]
    definition: "Take the activations A of any layer, compute the gradient of a class score with respect to A, average it spatially to get a weight per channel, sum A with those weights, and apply ReLU to get a heat map for that class."
    context: "CS231N Lecture 9 uses it to lift CAM's restriction to the last convolutional layer."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs231n-detection-segmentation-visualization)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

> **Version note**: This post follows the [Lecture 9 slides](https://cs231n.stanford.edu/slides/2026/lecture_9.pdf) linked from the Spring 2026 [CS231N](https://cs231n.stanford.edu/) schedule (147 pages, downloaded and checked on 2026-09-30), compared against the [Spring 2025 slides](https://cs231n.stanford.edu/slides/2025/lecture_9.pdf). For video, watch Spring 2025's [Lecture 9](https://www.youtube.com/watch?v=PTypu6GqEd4); 2026 recordings are on Canvas for enrolled students only, and the two years may differ. Access level **A3**.

**Series**: previous [L8: Attention, Transformers, and ViT](/posts/ai/2026-09-30-cs231n-attention-transformers-vit-en) | next [L10: Video Understanding](/posts/ai/2026-09-30-cs231n-video-understanding-en) | [Series overview](/posts/ai/2026-09-30-cs231n-course-overview-en)

Every CS231N model so far answers one question: what is this image? Lecture 9 breaks that question apart. What's in the image, where is each thing, and which object does each pixel belong to? At the end it turns the question around: when the model decides, where is it actually looking?

## Course video sources

This article uses Spring 2026 materials. The official Spring 2026 schedule (checked live on 2026-10-10) lists no recording links, and no public Spring 2026 playlist was found. The Spring 2025 recordings below come from the public Stanford Online playlist and share the lecture title, but their content may differ from the 2026 lecture, and the original recording has not been verified. Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): the video is Spring 2025 Lecture 9 (length 1:13:43; speaker Ehsan Adeli per the video description). The transcript covers semantic segmentation and fully convolutional networks, upsampling/transposed convolution, R-CNN and region proposals, YOLO, DETR, Mask R-CNN, saliency, CAM/Grad-CAM and ViT attention visualization, matching the article's topic. The adversarial examples, DeepDream and style transfer listed in the YouTube description do not appear in the transcript either, consistent with the article saying those topics are not covered. U-Net and anchors are not named in the transcript as captioned; those details come from the slides. The article's slide details follow the 2026 deck and were not compared item by item with this earlier-term recording.

```youtube
url: https://www.youtube.com/watch?v=PTypu6GqEd4
title: Stanford CS231N | Spring 2025 | Lecture 9: Object Detection, Image Segmentation, Visualizing
```

Original videos: [Stanford CS231N | Spring 2025 | Lecture 9: Object Detection, Image Segmentation, Visualizing](https://www.youtube.com/watch?v=PTypu6GqEd4)
Other related videos (text links only): [DETR - End to end object detection with transformers (ECCV2020)](https://www.youtube.com/watch?v=utxbUlo9CyY)

Course and recording entries:

- [Official course / lecture source](https://cs231n.stanford.edu/schedule.html)

## First, a gap: the schedule and the slides disagree

The [2026 schedule](https://cs231n.stanford.edu/schedule.html) lists six topics for this lecture: single-stage detectors, two-stage detectors, semantic/instance/panoptic segmentation, feature visualization and inversion, adversarial examples, and DeepDream and style transfer.

The 147 slides cover the first three and part of visualization. Searching the deck turns up no "adversarial", "DeepDream", "style transfer", "panoptic", or "inversion", and the same holds for the 178-page 2025 deck. The deck's own agenda (slide 29) is: Transformers recap → semantic segmentation, object detection, instance segmentation → visualizing model layers, saliency maps, CAM and Grad-CAM.

So this post sticks to what the slides cover and doesn't fill in the missing topics. For adversarial examples and generative topics, see this site's [CS230 post on adversarial examples and generative models](/posts/ai/2026-08-16-cs230-adversarial-and-generative-en).

The first 28 slides recap Lecture 8's Transformers and ViT, with one extra page on **RMSNorm**, which replaces LayerNorm with root-mean-square normalization; the slides say training is a bit more stable. See the [previous post](/posts/ai/2026-09-30-cs231n-attention-transformers-vit-en) for that material.

## Four tasks, four kinds of output

Slide 30 lines the tasks up in one picture:

| Task | Output | The slides' description |
|---|---|---|
| Classification | One label (CAT) | No spatial extent |
| Semantic segmentation | One label per pixel (GRASS, CAT, TREE, SKY) | No objects, just pixels |
| Object detection | A class and a box per object (DOG, DOG, CAT) | Multiple objects |
| Instance segmentation | A mask per object | Multiple objects |

Moving right, the output gets finer. That's the spine of the lecture: each step to the right requires one more change to the network.

## Semantic segmentation: make the output as big as the input

**The situation**: label every pixel with a category. Two cows standing together get labeled "cow"; semantic segmentation doesn't say which is which.

The slides try three ideas, and each hits a problem:

1. **Sliding window**: crop a patch around each pixel and classify the center pixel with a CNN. Very inefficient, since overlapping patches don't share features.
2. **Run the whole image through a classification CNN**: classification networks shrink the feature maps as they go deeper, but segmentation needs the output to match the input size.
3. **Fully convolutional, no downsampling**: use only conv layers and predict all pixels at once (C×H×W scores, argmax to an H×W prediction). Convolutions at full image resolution are too expensive.

The fix is the design of [FCN](https://arxiv.org/abs/1411.4038) (Long, Shelhamer, and Darrell, CVPR 2015) and similar networks: downsample **inside** the network with pooling and strided convolution, then upsample back to full size.

Upsampling comes in two flavors:

- **Fixed-rule unpooling**: nearest neighbor copies each value across a block; "bed of nails" puts it in the top-left corner and fills the rest with zeros; max unpooling remembers which positions the earlier max pooling picked and puts values back there.
- **Learnable transposed convolution**: each input pixel scales the filter, the scaled copy is placed on the output, and overlaps are summed. The slides use a 3×3, stride 2, pad 1 example to go from a 2×2 input to 4×4, plus a 1D example showing that the output is a sum of filter copies weighted by the input values.

### U-Net

[U-Net](https://arxiv.org/abs/1505.04597) (Ronneberger et al. 2015) adds one thing to this design. In the slides' words, the downsampling phase increases the field of view but loses spatial information, and the upsampling phase has to rebuild a high-resolution map. U-Net **concatenates** the high-resolution feature maps from the downsampling phase onto the matching upsampling layers to restore the lost detail. A3's DDPM starter code also ships a `unet.py`, so you'll meet it again in the [A3 guide](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip-en).

## Object detection: the number of outputs varies

### One object: classification plus regression

With one object in the image, the problem is simple. The CNN's feature vector feeds two heads: one outputs class scores (softmax loss), the other the box's four numbers (x, y, w, h) (L2 loss). The key line on the slides is "treat localization as a regression problem"; the two losses add up to a multitask loss.

### Many objects: here's the trouble

Each image has a different number of objects. One cat needs 4 numbers; three animals need 12. A fixed-size output layer can't hold that.

The obvious idea is to crop many patches and classify each as an object or background. But the combinations of positions, scales, and aspect ratios are huge, and the compute explodes.

### Two-stage: the R-CNN family

**R-CNN** ([Girshick et al., CVPR 2014](https://arxiv.org/abs/1311.2524)) first uses a region proposal method to find regions that look like objects. The slides use Selective Search as the example: about 2,000 proposals in a few seconds on a CPU. Each proposal is warped to 224×224, run through an ImageNet-pretrained CNN on its own, classified by SVMs, and adjusted by four predicted corrections (dx, dy, dw, dh).

The slides name the problem directly: it's very slow, with about 2,000 independent forward passes per image.

**Fast R-CNN** ([Girshick, ICCV 2015](https://arxiv.org/abs/1504.08083)) runs the whole image through a backbone (AlexNet, VGG, ResNet, and so on) once, then crops and resizes each proposal from the feature map and passes it to a small per-region network that outputs a class and box offsets.

**Faster R-CNN** ([Ren et al.](https://arxiv.org/abs/1506.01497)) hands region proposals to the network too, with a **Region Proposal Network (RPN)**. In the slides' example, a 640×480 input becomes a 512×20×15 feature map. At each position, imagine an **anchor box** of fixed size; predict whether it contains an object (binary classification), and for positive boxes regress four numbers that correct it to the ground-truth box. In practice each position gets K anchors of different sizes and scales, and the K×20×15 boxes are sorted by "objectness" score, keeping the top ~300 as proposals.

### Single-stage: YOLO, SSD, RetinaNet

Single-stage detectors merge "find candidates" and "classify" into one step. As the slides describe it: divide the image into a 7×7 grid, put B base boxes in each cell, regress 5 numbers per box (dx, dy, dh, dw, confidence), and predict scores for C classes (background counts as one). The output is 7×7×(5B + C). The slides note it looks a lot like an RPN, except it's category-specific.

The title of [YOLO](https://arxiv.org/abs/1506.02640) (Redmon et al., CVPR 2016) is "Unified, Real-Time Object Detection", and the slides label it real-time object detection. The same slide also cites SSD and RetinaNet (Focal Loss).

### DETR: no anchors

[DETR](https://arxiv.org/abs/2005.12872) (Carion et al., ECCV 2020) brings Lecture 8's Transformer into detection. The slides sum it up in three lines: directly output a set of boxes from a Transformer; no anchors and no regression of box transforms; match predicted boxes to ground-truth boxes with bipartite matching, then train to regress box coordinates.

## Instance segmentation: Mask R-CNN

Instance segmentation separates both individual objects and pixels. [Mask R-CNN](https://arxiv.org/abs/1703.06870) (He et al., ICCV 2017) takes the cheap route: on top of Faster R-CNN, add a small mask network on each RoI that predicts a 28×28 binary mask. In the slides' diagram, each RoI goes through RoI Align to a 256×14×14 feature, and the outputs are C class scores, 4 box coordinates per class, and a C×28×28 mask, one per class. The slides add that it also does pose estimation.

## Where is the model looking?

The last part shifts from how to do the tasks to how to understand the model.

- **Visualizing first-layer filters**: AlexNet's first layer has 64 filters of 3×11×11; ResNet-18, ResNet-101, and DenseNet-121 each have 64 of 3×7×7. Drawn as small images, they show edge and color detectors.
- **Saliency maps** ([Simonyan et al. 2014](https://arxiv.org/abs/1312.6034)): compute the gradient of the unnormalized class score with respect to the input pixels, take the absolute value, and take the max over the RGB channels. Bright pixels are the ones whose change would most affect the score.
- **CAM** ([Zhou et al., CVPR 2016](https://arxiv.org/abs/1512.04150)): when a network ends in conv features f → global average pooling → a fully connected layer, the class score can be rewritten as "weight the features at each position by the FC weights, then average". The map before averaging is the class heat map. The limitation is that it only applies to the last conv layer.
- **Grad-CAM** ([Selvaraju et al., CVPR 2017](https://arxiv.org/abs/1610.02391)) lifts that limitation; the steps are below.
- **Visualizing ViT features**: the final slide reproduces figures from two 2022 papers that apply the same ideas to ViTs.

<details>
<summary>Grad-CAM in four steps (slides 140–143)</summary>

```text
1. Pick any layer, activations A ∈ R^{H×W×K}
2. Gradient of class score S_c w.r.t. A: ∂S_c/∂A ∈ R^{H×W×K}
3. Global-average-pool the gradients to get one weight per channel
   α_k = (1/HW) Σ_{h,w} ∂S_c/∂A_{h,w,k}
4. Heat map M^c_{h,w} = ReLU( Σ_k α_k A_{h,w,k} )
```

</details>

## How to self-study it

1. **Watch the video, then page through the slides**: the 2025 recording runs about 1 hour 13 minutes. The 2026 deck is 31 slides shorter than 2025's, with the same agenda.
2. **Make a table**: for R-CNN → Fast R-CNN → Faster R-CNN → YOLO → DETR, write down what each one cut out. This is the easiest part of the lecture to mix up.
3. **Work one transposed convolution by hand**: using the slides' 1D example, compute the output of two input values and a three-tap filter on paper.
4. **Suggested readings on the schedule**: [FCN](https://arxiv.org/abs/1411.4038), [Fast R-CNN](https://arxiv.org/abs/1504.08083), [Faster R-CNN](https://arxiv.org/abs/1506.01497), the [DETR paper](https://arxiv.org/abs/2005.12872), and DETR's official [blog post](https://ai.facebook.com/blog/end-to-end-object-detection-with-transformers/) and [video](https://www.youtube.com/watch?v=utxbUlo9CyY).

## Further reading

- Adversarial examples and generative models: [CS230 on adversarial examples and generative models](/posts/ai/2026-08-16-cs230-adversarial-and-generative-en)
- The Transformer groundwork: [L8: Attention, Transformers, and ViT](/posts/ai/2026-09-30-cs231n-attention-transformers-vit-en)
- A fuller deep learning theory course: [MIT 6.7960 guide](/posts/ai/2026-08-26-mit-67960-deep-learning-guide-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Official sources only have Spring 2025 recordings, so the status is now related supplementary video only, and video titles use the original titles. The second embedded video was the DETR authors’ ECCV 2020 talk rather than a course recording, so it was removed from the embeds and kept as a text link.
- 2026-10-10: Checked the video content against its transcript. The video topic and lecture number match, and the sampled concepts appear in the transcript. The article makes no specific video claims that needed correcting, so only the check note was added.

## References

- [CS231N Lecture 9 slides (Spring 2026)](https://cs231n.stanford.edu/slides/2026/lecture_9.pdf) — source of every architecture, number, and example in this post
- [CS231N Lecture 9 slides (Spring 2025)](https://cs231n.stanford.edu/slides/2025/lecture_9.pdf) — for comparison; also lacks adversarial examples and style transfer
- [CS231N schedule (Spring 2026)](https://cs231n.stanford.edu/schedule.html) — the 4/28 lecture topics and suggested readings
- [Spring 2025 Lecture 9 recording](https://www.youtube.com/watch?v=PTypu6GqEd4)
- [Long, Shelhamer & Darrell, Fully Convolutional Networks for Semantic Segmentation (CVPR 2015)](https://arxiv.org/abs/1411.4038)
- [Ronneberger et al., U-Net (2015)](https://arxiv.org/abs/1505.04597)
- [Girshick et al., Rich feature hierarchies for accurate object detection and semantic segmentation (CVPR 2014)](https://arxiv.org/abs/1311.2524)
- [Girshick, Fast R-CNN (ICCV 2015)](https://arxiv.org/abs/1504.08083)
- [Ren et al., Faster R-CNN: Towards Real-Time Object Detection with Region Proposal Networks](https://arxiv.org/abs/1506.01497)
- [Redmon et al., You Only Look Once (CVPR 2016)](https://arxiv.org/abs/1506.02640)
- [Carion et al., End-to-End Object Detection with Transformers (ECCV 2020)](https://arxiv.org/abs/2005.12872)
- [He et al., Mask R-CNN (ICCV 2017)](https://arxiv.org/abs/1703.06870)
- [Simonyan, Vedaldi & Zisserman, Deep Inside Convolutional Networks (ICLR Workshop 2014)](https://arxiv.org/abs/1312.6034)
- [Zhou et al., Learning Deep Features for Discriminative Localization (CVPR 2016)](https://arxiv.org/abs/1512.04150)
- [Selvaraju et al., Grad-CAM (CVPR 2017)](https://arxiv.org/abs/1610.02391)
