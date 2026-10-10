---
title: "CS231N L10: Video Understanding — What Changes When You Add a Time Axis"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, cnn, vision-transformer, multimodal]
lang: en
series:
  name: "Reading Stanford CS231N"
  order: 12
tldr: "CS231N Lecture 10 treats video as 2D plus time, a T×3×H×W tensor, and follows one thread: efficiency. Train on short clips and average several clips at test time. Architectures run from per-frame 2D CNNs and late fusion to 3D CNNs, then two-stream networks that isolate motion with optical flow, and I3D, which inflates 2D weights into 3D. After 2021 the field moved to Transformers, where token counts explode, which led to divided space-time attention, Video Swin, MViT, and tubelets. The last part covers temporal localization, audio-visual models, VideoLLMs, and long-form video, where HourVideo shows how far the field still has to go."
description: "A guide to Stanford CS231N Spring 2026 Lecture 10 (Video Understanding): short-clip training, single-frame and late/early fusion, 3D convolution, optical flow and two-stream networks, I3D weight inflation, the token explosion in video ViTs and the TimeSformer, Video Swin, MViT, and tubelet responses, temporal action localization, audio-visual separation, and long-form video QA. Slides from Spring 2026, recordings from Spring 2025."
draft: false
glossary:
  - term: "optical flow"
    definition: "A displacement field F(x, y) = (dx, dy) between two consecutive frames that says where each pixel moves in the next frame."
    context: "Two-stream networks feed stacked optical flow into the temporal stream."
  - term: "tubelet"
    definition: "A small 3D block spanning several frames, used as one token in place of per-frame 2D patches."
    context: "ViViT, VideoMAE, and other video Transformers use tubelets to cut token counts and give each token motion information."
  - term: "divided space-time attention"
    definition: "Splits joint space-time self-attention into two steps: each token first attends to the same spatial location in other frames (time), then to other tokens in the same frame (space)."
    context: "The TimeSformer approach; it cuts per-token cost from O(NT) to O(N+T)."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs231n-video-understanding)

> **Source years**: The slides are the Spring 2026 [Lecture 10 slides](https://cs231n.stanford.edu/slides/2026/lecture_10.pdf) from [CS231N](https://cs231n.stanford.edu/) (92 pages, cover date 2026-04-30). The recording is the [Spring 2025 Lecture 10](https://www.youtube.com/watch?v=wElqklprhPE) on YouTube (about 1 hour 8 minutes; the 2025 schedule lists Ruohan Gao as lecturer). The 2026 recordings are on Canvas for enrolled students only, so the two years may differ.
>
> This is part 12 of the [Reading Stanford CS231N](/posts/ai/2026-09-30-cs231n-course-overview-en) series.

The [previous post](/posts/ai/2026-09-30-cs231n-detection-segmentation-visualization-en) moved the output from one label per image to every object and every pixel. This lecture extends in a different direction: **the input gains a time axis**. The slides set it up in one line: a video is a sequence of images, a 4D tensor of shape T×3×H×W.

One question ties the lecture together: **where in the network do you handle the extra T, and at what cost?** Each architecture is a different answer.

## Course video sources

This article uses Spring 2026 materials. The public Spring 2025 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=wElqklprhPE
title: Stanford CS231N 2025 Lecture 10: Video Understanding (YouTube)
```

Original videos: [Stanford CS231N 2025 Lecture 10: Video Understanding (YouTube)](https://www.youtube.com/watch?v=wElqklprhPE)

Course and recording entries:

- [Stanford CS231N 2025 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [Official course / lecture source](https://cs231n.stanford.edu/schedule.html)

## Task and data: from objects to actions

Image classification recognizes dogs, cats, and trucks. Video classification recognizes swimming, running, jumping, and eating. The example dataset is [Sports-1M](https://cs.stanford.edu/people/karpathy/deepvideo/): 1 million YouTube videos labeled with 487 sports (Karpathy et al., CVPR 2014).

The first obstacle is size. Video usually runs at 30 fps. Uncompressed at 3 bytes per pixel, SD (640×480) takes about 1.5 GB per minute and HD (1920×1080) about 10 GB per minute. That does not fit in GPU memory.

The course's fix is practical:

- **Training**: classify short clips at low fps
- **Testing**: run the model on several clips from the same video and average the predictions

Every architecture that follows assumes short clips.

## First-generation answers: how CNNs handle time

| Approach | Where time is fused | What the slides say |
|---|---|---|
| Single-frame CNN | Never; classify each frame independently and average probabilities at test time | Often a very strong baseline |
| Late fusion (FC) | Run a 2D CNN per frame, flatten T×D×H'×W', feed an MLP | Captures high-level appearance per frame; how do you handle arbitrary length? |
| Late fusion (pooling) | Run a 2D CNN per frame, average-pool over space and time | Good for high-level scene information, bad at comparing low-level motion between frames |
| Early fusion / 3D CNN | 3D convolution and pooling from the first layer, fusing time gradually | Every activation is a 4D tensor, D×T×H×W |

**Try single-frame first.** This is the most practical line in the section. Before a video project, run a plain 2D CNN on each frame, average, and treat that as the baseline to beat.

**How 3D convolution differs from 2D.** The slides go through it piece by piece. The filter gains a time dimension (for example 2×3×5×5). The sliding window works the same way with one more direction. You can stride in time. Each activation map becomes T'×28×28. Nothing is conceptually new; it is the convolution from [L5](/posts/ai/2026-09-30-cs231n-cnn-image-classification-en) pushed one dimension further.

## Two tricks that improve results

### Trick 1: pull motion out on its own (two-stream)

The slides cite Johansson's 1973 biological-motion experiment: people recognize an action from a few moving points of light. Motion alone carries a lot of information.

The tool for measuring motion is **optical flow**, a displacement field F(x, y) = (dx, dy) between two frames with I_{t+1}(x+dx, y+dy) = I_t(x, y). You can compute it with a classical algorithm or approximate it faster with a neural network.

[Two-stream networks](https://arxiv.org/abs/1406.2199) (Simonyan & Zisserman, NeurIPS 2014) separate appearance from motion:

- **Spatial stream**: a single image, 3×H×W
- **Temporal stream**: stacked optical flow, [2×(T−1)]×H×W, with the first 2D conv processing all flow images (early fusion)

In the slides' UCF-101 bar chart, the temporal stream alone (83.7) beats the spatial stream alone (73). Fusing both with an SVM reaches 88, against 65.4 for the 3D CNN baseline.

The slides add a note on the present: **optical flow is now rarely used directly for video understanding**. It survives mostly as an intermediate representation for other tasks such as robot control (citing Ko et al., ICLR 2024).

### Trick 2: inflate a 2D network into 3D (I3D)

Image architectures have years of research behind them. Can video reuse them? [I3D](https://arxiv.org/abs/1705.07750) (Carreira & Zisserman, CVPR 2017):

1. Take a 2D CNN and replace each K_h×K_w conv or pool layer with a K_t×K_h×K_w 3D version
2. Initialize the 3D weights from the 2D ones: copy them K_t times along time and divide by K_t

<details>
<summary>Why divide by K_t</summary>

Feed in a "constant" video, the same image repeated K_t times. The 3D convolution sums K_t identical results along time, and dividing by K_t gives exactly the original 2D output. The inflated network therefore starts out behaving like the ImageNet-pretrained 2D network and learns temporal information from there.

</details>

The slides show Kinetics-400 top-1 accuracy, all with an Inception backbone, in two groups (trained from scratch and ImageNet-pretrained). The comparison covers a per-frame CNN, CNN+LSTM, two-stream, an inflated 3D CNN, and a two-stream inflated 3D CNN.

## Second-generation answers: Transformers and the token explosion

The slides split the field into two eras: 2014–2021 for 3D CNNs plus RNNs, 2021–2026 for Transformers.

The problem with switching to [ViT](https://arxiv.org/abs/2010.11929) is arithmetic. A 224×224 image cut into 16×16 patches gives 14×14 = 196 tokens. Video blows that up:

| Input | Tokens | The slides' comparison |
|---|---|---|
| One image | 196 | |
| 16-frame clip | 3,136 | About a book chapter |
| 5 minutes at 1 fps | 58.8k | About a short novel |
| 5 minutes at 24 fps | 1,411,200 | Near current models' context limits |

Self-attention cost grows with the square of the token count. The slides give two broad strategies: **change the attention operator**, or **reduce the number of tokens**.

### Strategy 1: change attention

- **Divided space-time attention** ([TimeSformer](https://arxiv.org/abs/2102.05095), Bertasius et al., ICML 2021) splits joint space-time attention into two steps. In the time step, each token attends only to the same spatial location in other frames. In the space step, it attends only to other tokens in the same frame. Per-token cost drops from O(NT) to O(N+T), and information still spreads across space and time over many blocks.
- **[Video Swin Transformer](https://arxiv.org/abs/2106.13230)** (CVPR 2022) restricts self-attention to small local space-time cubes. It looks a lot like a 3D CNN with attention inside each cube. The cubes shift between layers so information crosses cube boundaries.
- **[MViT](https://arxiv.org/abs/2104.11227)** (Multiscale Vision Transformers, ICCV 2021) uses convolution to aggregate and shorten the K and V sequences before attention, while the output length stays the same. Like a ResNet, the network halves the spatial size and doubles the channels as it goes, for example from a 56×56 grid at 96 dimensions to 14×14 at 384.

### Strategy 2: fewer tokens (tubelets)

[ViViT](https://arxiv.org/abs/2103.15691) (Arnab et al., ICCV 2021) replaces patches with **tubelets**, 3D blocks spanning several frames. The slides give two intuitions: patches contain no motion information and tubelets do, and tubelets produce far fewer tokens (spanning 4 frames cuts the count by 4×). ViViT, VideoMAE, Video Swin, MViT, and V-JEPA all use them. Other token-reduction methods (adaptive token selection, token merging, learned compression) are deferred to [L16](/posts/ai/2026-09-30-cs231n-vision-language-en).

## Beyond classification: localization, multimodality, long video

So far everything classifies short clips. The second half extends in three directions.

**Temporal and spatio-temporal localization.** Temporal action localization finds the frames for each action in a long, untrimmed video. It can reuse a Faster R-CNN-style design: generate temporal proposals, then classify them. Spatio-temporal detection goes further: detect every person in space and time and classify what they are doing. The example dataset is [AVA](https://arxiv.org/abs/1705.08421).

**Audio-visual models.** The slides use the McGurk effect (the same sound paired with different lip movements is heard as "Ba" or "Fa") to show that vision changes what we hear. Then several lines of research:

- Visually guided speech separation: VisualVoice (Gao et al., CVPR 2021) separates a speech mixture into the left and right speakers
- Musical instrument separation: Gao & Grauman (ICCV 2019) train on 100,000 unlabeled multi-source clips and then separate audio in new videos
- Audio-visual fusion for action recognition, and audio as a cheap preview to speed up recognition in long videos
- Multimodal egocentric video, such as Ego-Exo conversational graph prediction (Jia et al., CVPR 2024)

**VideoLLMs and long video.** The slides list Video-LLaVA, VideoLLaMA 3, and Video-ChatGPT, then ask whether current vision systems can understand long-form video. The test is to ask questions about the video, such as "Where did I leave my AirPods after working out?" in a 1 hour 10 minute egocentric recording. The examples come from HourVideo, with question types like "identify the unique individuals the camera wearer interacted with" and "how can the camera wearer get to the backyard from the kitchen," posed as multiple-choice questions. The slides' takeaway: **there is a significant gap in long-form video understanding, and a lot of work left to do.**

## How to study it

- **Write tensor shapes on paper.** Every architecture here differs in which dimension holds T and at which layer it gets fused. For each diagram, write the input, intermediate activation, and output shapes. That beats memorizing model names.
- **Learn to compute token counts yourself.** The product 196 × T explains why every video Transformer design is about saving tokens or saving attention.
- **Gaps**: this lecture has no dedicated assignment, and none of A1–A3 includes a video problem. The 2026 recording is not public, so for the spoken explanation you need the 2025 recording.

## Further reading

- ViT and attention basics: [L8: Attention, Transformers, and ViT](/posts/ai/2026-09-30-cs231n-attention-transformers-vit-en) in this series
- Video token reduction and multimodal models: [L16: Vision and Language](/posts/ai/2026-09-30-cs231n-vision-language-en) in this series
- Why long sequences are expensive and how to split them across GPUs: the next post, [L11: Large-Scale Distributed Training](/posts/ai/2026-09-30-cs231n-distributed-training-en)

**Series navigation**: Previous: [L9: Object Detection, Segmentation, and Visualization](/posts/ai/2026-09-30-cs231n-detection-segmentation-visualization-en) | Next: [L11: Large-Scale Distributed Training](/posts/ai/2026-09-30-cs231n-distributed-training-en) | [Series overview](/posts/ai/2026-09-30-cs231n-course-overview-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS231N course homepage (Spring 2026)](https://cs231n.stanford.edu/)
- [CS231N Spring 2026 schedule](https://cs231n.stanford.edu/schedule.html)
- [Lecture 10: Video Understanding slides (Spring 2026, PDF)](https://cs231n.stanford.edu/slides/2026/lecture_10.pdf)
- [CS231N Spring 2025 schedule](https://cs231n.stanford.edu/2025/schedule.html)
- [Stanford CS231N 2025 Lecture 10: Video Understanding (YouTube)](https://www.youtube.com/watch?v=wElqklprhPE)
- [Stanford CS231N 2025 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [Karpathy et al. (2014). Large-scale Video Classification with Convolutional Neural Networks (Sports-1M)](https://cs.stanford.edu/people/karpathy/deepvideo/)
- [Simonyan & Zisserman (2014). Two-Stream Convolutional Networks for Action Recognition in Videos](https://arxiv.org/abs/1406.2199)
- [Carreira & Zisserman (2017). Quo Vadis, Action Recognition? A New Model and the Kinetics Dataset (I3D)](https://arxiv.org/abs/1705.07750)
- [Dosovitskiy et al. (2020). An Image is Worth 16x16 Words (ViT)](https://arxiv.org/abs/2010.11929)
- [Bertasius et al. (2021). Is Space-Time Attention All You Need for Video Understanding? (TimeSformer)](https://arxiv.org/abs/2102.05095)
- [Liu et al. (2022). Video Swin Transformer](https://arxiv.org/abs/2106.13230)
- [Fan et al. (2021). Multiscale Vision Transformers](https://arxiv.org/abs/2104.11227)
- [Arnab et al. (2021). ViViT: A Video Vision Transformer](https://arxiv.org/abs/2103.15691)
- [Gu et al. (2018). AVA: A Video Dataset of Spatio-temporally Localized Atomic Visual Actions](https://arxiv.org/abs/1705.08421)
