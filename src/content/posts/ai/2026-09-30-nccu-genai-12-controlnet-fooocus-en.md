---
title: "NCCU Yen-Lung Tsai Generative AI L12: ControlNet and Fooocus, or How to Make an Image Model Follow Your Composition"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, generative-ai, ai-course, diffusion-model, image-generation, stable-diffusion]
lang: en
series:
  name: "Reading NCCU Yen-Lung Tsai Generative AI"
  order: 12
tldr: "The Stable Diffusion setup from L11 listens only to the prompt, so composition and pose are left to luck. L12 adds a steering wheel. ControlNet copies a block of SD and wires the copy back in through zero convolutions, so extra conditions such as edge maps, poses, and depth maps can steer generation. The standard example is Canny edges. The second half covers Fooocus, an SD interface that aims to be 'as simple as Midjourney': Presets, Styles, and the five Input Image features, where Image Prompt is ControlNet with a friendly wrapper. Week 12 homework: pick a use case, make at least 3 image sets in Fooocus, and write up your creative process."
description: "A guide to lecture 12 of NCCU Professor Yen-Lung Tsai's 'Generative AI: Text and Image Synthesis Principles and Practice' (Spring 2025, term 1132): what ControlNet is for and how it is built (a locked block, a trainable copy, zero convolutions), Canny edge detection, the Stop At and Weight parameters; installing Fooocus, Presets and Styles, the five Input Image features (Upscale/Variation, Image Prompt, Inpaint/Outpaint, Describe, Metadata), a brief look at FramePack, and the week 12 assignment and rubric from the Chang Gung satellite section."
draft: false
glossary:
  - term: "zero convolution"
    aliases: ["zero-initialized convolution"]
    definition: "A 1×1 convolution whose weights and bias start at 0. ControlNet uses it to connect the trainable copy back to the original model, so at the start of training the extra branch outputs 0 and cannot damage the pretrained Stable Diffusion."
    context: "The ControlNet diagram in the L12 slides puts one zero convolution before and one after the trainable clone."
    links:
      - label: "Zhang et al. 2023 (ControlNet)"
        url: "https://arxiv.org/abs/2302.05543"
  - term: "Canny edge detection"
    aliases: ["Canny"]
    definition: "A classic image-processing algorithm that turns a photo into white outlines on a black background. The most common way to use ControlNet is to feed it this edge map so the new image keeps the original composition."
    context: "L12 demonstrates it with one photo: original, then Canny edges, then a new image generated with ControlNet."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nccu-genai-12-controlnet-fooocus)

**This post is based on the Spring 2025 offering (NCCU term 1132) of Yen-Lung Tsai's "Generative AI: Text and Image Synthesis Principles and Practice" at National Chengchi University.** It is part 12 of the [Reading NCCU Yen-Lung Tsai Generative AI](/posts/ai/2026-09-30-nccu-genai-course-overview-en) series and follows [L11: Text-to-Image AI](/posts/ai/2026-09-30-nccu-genai-11-text-to-image-en).

I used three official sources: the [lecture 12 recording](https://www.youtube.com/watch?v=3TdC6xb1RfY) (2025-05-06, 3 h 12 min), the slide deck [GenAI12 ControlNet 與 Fooocus](https://drive.google.com/file/d/15-cHR3PSoGVmXj0yrrzCksDJQ1fcVtir/view) (33 slides, in Chinese), and the week 12 assignment on the [Chang Gung satellite section page](https://yangchihyuan.github.io/courses/GenerativeAI2025) (in Chinese). Access level is **A3**: recordings, slides, and the assignment with its rubric are public. There is no matching notebook in [AI-Demo](https://github.com/yenlung/AI-Demo) this week; the hands-on part uses the open-source [Fooocus](https://github.com/lllyasviel/Fooocus) itself.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=3TdC6xb1RfY
title: 【生成式 AI】12. ControlNet 與 Fooocus (YouTube recording, 2025-05-06)
```

Original videos: [【生成式 AI】12. ControlNet 與 Fooocus (YouTube recording, 2025-05-06)](https://www.youtube.com/watch?v=3TdC6xb1RfY)

Course and recording entries:

- [Official course and recording entry](https://yangchihyuan.github.io/courses/GenerativeAI2025)

## Where this week sits in the course

L10 went from VAEs to latents. L11 took Stable Diffusion apart into U-Net, CLIP, schedulers, and LoRA, and built an image-generation web app with diffusers. Anyone who did that hit the same wall quickly: a prompt can say *what* you want but not *what it should look like*. Pose and layout are left to the model's mood.

L12 answers that: **how do you control what gets generated?** It closes the three image-generation lectures. The first half is about principles (ControlNet); the second half is pure tool practice (Fooocus).

The recording runs roughly like this: ControlNet starts at 19:30, Fooocus installation and interface at 30:14, the second session (from 1:17) covers the advanced Input Image features, Inpaint, and CPDS pose control, FramePack comes in at 1:56, and a TA session starts after 2:25.

## ControlNet: a steering wheel for image generation

Slide 3 defines ControlNet in four lines:

- An extension architecture for **controlling** Stable Diffusion image generation
- Proposed by Lvmin Zhang and colleagues in 2023 ([paper](https://arxiv.org/abs/2302.05543))
- Controls generation through "extra input conditions" such as pose lines, edge maps, and depth maps
- For creators, it "puts a steering wheel on image generation"

### The standard example: Canny edges

Slides 4 and 5 walk through the whole pipeline with one photo of someone eating ice cream. **Canny edge detection** first turns the photo into white outlines on black. The edge map goes into ControlNet, which produces a new image with the same composition and pose but a different person, outfit, and background.

That is why people talk about "the Canny model." ControlNet is an architecture, and in practice a separate version is trained for each kind of condition. The one that takes edge maps is called the Canny model.

### Architecture: copy a block of SD, train it outside, and plug it back in

The diagram on slide 6 has only a few boxes, but it captures the core design:

1. A block of the original SD is **locked** (the slide draws a padlock); its parameters don't change
2. The block is **copied**, and the copy is trainable
3. The condition c (for example, a Canny edge map) passes through a **zero convolution**, is added to the input x, and goes into the trainable copy
4. The copy's output passes through another zero convolution and is added back to the original block's output y

Tsai's one-line summary: "Copy a block of Stable Diffusion, train it 'outside,' then send it back."

Why zero convolutions? Their weights start at 0, so at the beginning of training the extra branch outputs 0 and the whole model behaves exactly like the original SD. The control signal seeps in gradually as training proceeds. The expensive pretrained SD isn't wrecked on the first step.

<details>
<summary>One ControlNet block as an equation</summary>

Let the original block be F(·; Θ) with Θ locked, the copy have trainable parameters Θc, and Z(·; Θz1), Z(·; Θz2) be the two zero convolutions. The ControlNet block outputs:

y_c = F(x; Θ) + Z( F( x + Z(c; Θz1); Θc ); Θz2 )

At the start of training Θz1 and Θz2 are all 0, so the second term vanishes and y_c = F(x; Θ), the same as the original model. See Section 3 of the [ControlNet paper](https://arxiv.org/abs/2302.05543).

</details>

### Two knobs: Stop At and Weight

Slide 7 draws SD's denoising as a row of U-Net steps to show that the condition doesn't have to act on every step. The slide labels two parameters and says "our 'idea' has at least two parameters to tune":

- **Stop At** (0.5 in the figure): the condition only applies during the early steps, after which the model is left alone
- **Weight** (0.6 in the figure): how strongly the condition pushes

The intuition: early denoising steps decide the overall layout, later ones fill in detail. With a small Stop At, the layout follows your edges and the details are left to the model. Both parameters come back in Fooocus's Image Prompt advanced options.

## Fooocus: Stable Diffusion as simple as Midjourney

The second part of the deck is titled "easy image generation." [Fooocus](https://github.com/lllyasviel/Fooocus) comes from the same author as ControlNet (GitHub user lllyasviel). The slides describe it as a new web UI for SD whose goal is "Stable Diffusion as simple as Midjourney."

> A note from fact-checking: the Fooocus README now says the project is in "Limited Long-Term Support (LTS) with Bug Fixes Only." No new features will be added, and everything is built on SDXL. For newer models such as Flux, the README points to the same author's WebUI Forge or to ComfyUI. This is the status as of 2026-09-30; the 1132 lecture didn't mention it.

### Installation

The slides cover two platforms:

- **Windows**: download the package from GitHub, unzip it wherever you want, and run `run.bat`
- **Mac/Linux**: install Anaconda first (on Apple Silicon Macs, pick the right build), then:

```bash
cd
git clone https://github.com/lllyasviel/Fooocus.git
cd Fooocus
conda env create -f environment.yaml   # creates a virtual environment named fooocus
conda activate fooocus
pip install -r requirements_versions.txt
```

The slides stop there. According to the [README](https://github.com/lllyasviel/Fooocus#mac), you then launch with `python entry_with_update.py`; the first run downloads the SDXL models automatically and takes a while. The README also says Mac is "not intensively tested," and since Apple Silicon has no discrete GPU, generation is much slower than on a machine with an NVIDIA card. The minimum on Windows is an NVIDIA GPU with 4GB VRAM plus 8GB RAM.

If you don't have a suitable computer, the recording has a segment at 39:57 on "running Fooocus in Colab." The Fooocus README links an [official Colab notebook](https://colab.research.google.com/github/lllyasviel/Fooocus/blob/main/fooocus_colab.ipynb) and notes that the free tier disables the refiner, and heavier features such as Image Prompt may disconnect a free session.

### Basic use: just type a prompt

Open the interface, type a prompt, click Generate. The slides stress one point: **you don't need a negative prompt, because Fooocus writes one for you.** The demo prompt is "a very cute Shiba Inu," and the default settings already produce a decent Shiba.

Tick **Advanced** and more tabs appear on the right:

- **Setting → Preset**: initial, anime, sai, lightning, default, realistic, lcm. Slide 18 lines up the same Shiba prompt under all seven presets; anime turns it into a cartoon dog, realistic leans photographic
- **Style**: there are a great many styles. The slides show Flat 2D Art, Pixel Art, Origami, Sketchnote, Papercraft, Sumi E, and others, calling it "only a small part"

### The five Input Image features

The slides call the Input Image checkbox, which you've probably never clicked, the door to "a world of magic": combined with Advanced, it can produce interesting results with very little prompt, or none at all. It has five tabs:

| Feature | What the slides say |
|---|---|
| Upscale or Variation | Like Midjourney's U (upscale) and V (variation) |
| Image Prompt | ControlNet with a friendly wrapper |
| Inpaint or Outpaint | Just that: redraw part of the image, or extend it outward |
| Describe | AI describes the image; you can reuse it as a prompt |
| Metadata | Shows the prompt and other info for an image you generated before |

Slide 25 ties back to the first half: **Image Prompt is basically ControlNet.** It takes up to 4 reference images; remember to open the Advanced box below it. Each image gets one control type:

- **ImagePrompt**: style reference
- **PyraCanny**: trace the edges, i.e. the Canny approach from earlier
- **CPDS**: follow the pose
- **FaceSwap**: follow the person

The second session of the recording (from 1:21:44) demonstrates these one by one, including "how to keep a character consistent," changing hair color with Inpaint, and multi-image input with CPDS for pose. It ends with a quick pass over Refiner and LoRA in the Models tab and Developer Debug Mode.

## Bonus: FramePack, video generation on your own machine

The last short section introduces the same author's [FramePack](https://github.com/lllyasviel/FramePack), pitched as "video generation on your own computer." Linux installation looks like Fooocus: clone the repo, create a Python 3.10 environment with conda, install PyTorch for CUDA 12.6, then the requirements. The FramePack README says it supports Linux and Windows and needs at least 6GB of GPU memory. This is only an introduction; the homework doesn't use it.

## The week 12 assignment (Chang Gung satellite version)

The assignment is titled "AI image-generation creative task: build your Fooocus workflow!" The summary below follows the [Chang Gung satellite page](https://yangchihyuan.github.io/courses/GenerativeAI2025). The deadline was 2025-05-19.

**What to do:**

1. Imagine a use case: social media images, presentation graphics, website visuals, personal branding, and so on
2. Generate at least 3 image sets with Fooocus; the input and output for one image count as one set
   - Input: a short note per image, such as which Fooocus features you used (prompt settings, Style, Inpaint, Canny, etc.)
   - Output: the generated image
3. Summarize your creative process (text or a flowchart) so the TA can follow your steps from inspiration and settings to revisions and final output
4. Overall reflections

Submit a Colab link or a PDF.

**Rubric:**

| Points | Condition |
|---|---|
| 0 | Link doesn't open and no screenshots |
| 2 | Identical settings/prompts to the instructor's |
| 4 | Only the generated images |
| 6 | Barely different from the instructor's demo |
| 7–10 | 3+ image sets and all requirements met, scored by creativity |

**For self-study:** the point of this assignment is the process, not how pretty the images are. Pick a use case you actually need, like the cover of your next presentation. Make the first set with just a prompt and a Style, the second from a sketch or photo through PyraCanny, and the third by using Inpaint to fix whatever you disliked in the second. The three sets then form one workflow, "idea → layout control → local fixes," which also gives you something concrete to write in the process section.

NCCU grades its own students differently (the Fall 2026 syllabus weights homework and reflections at 75%), so outside readers can only self-grade against this rubric.

## Self-check

1. Why does ControlNet lock the original SD block and train a separate copy?
2. What does a zero convolution output at the start of training, and how does that protect the original model?
3. If you move Stop At from 1.0 to 0.3, how would you expect the result to change?
4. In Fooocus's Image Prompt, what do PyraCanny and CPDS each control?
5. To put the same character into three different scenes, which Input Image feature would you use?

<details>
<summary>Suggested answers</summary>

1. The original SD was trained on huge amounts of data, and fine-tuning it directly can easily break it. Locking the original block and training only the copy preserves what it already knows.
2. Zero. At the start of training the whole model outputs exactly what the original SD would, and the control signal is added gradually.
3. The condition only applies during the first 30% of denoising steps. The overall layout should still roughly follow the edges, but details are left to the model, so the result will look less like the reference.
4. PyraCanny controls outlines and composition (trace the edges); CPDS controls the person's pose (follow the pose).
5. On the slides, the match is FaceSwap in Image Prompt (follow the person). The recording has a segment at 1:25:34, "how do you keep a character consistent?", where you can check how Tsai actually does it.

</details>

## Further reading

This post stands on its own. To dig deeper:

- The math of conditional generation and classifier-free guidance: [MIT 6.S184 L3B: Guidance and classifier-free guidance](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance-en)
- Diffusion from DDPM to latent diffusion: [CS231N L14: Generative Models II, Diffusion](/posts/ai/2026-09-30-cs231n-generative-models-diffusion-en)
- Where ControlNet sits in 2023 computer vision research: [2023 AI Conference Guide: Computer Vision](/posts/ai/2026-08-24-ai-conference-2023-cv-en)

Series navigation: [series overview](/posts/ai/2026-09-30-nccu-genai-course-overview-en) | previous, [L11: Text-to-Image AI](/posts/ai/2026-09-30-nccu-genai-11-text-to-image-en) | next, [L13: Reinforcement Learning and Generative AI Applications](/posts/ai/2026-09-30-nccu-genai-13-reinforcement-learning-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [Chang Gung satellite section page: 生成式AI：文字與圖像生成的原理與實務 2025 (schedule, week 12 assignment and rubric)](https://yangchihyuan.github.io/courses/GenerativeAI2025) (in Chinese)
- [【生成式 AI】12. ControlNet 與 Fooocus (YouTube recording, 2025-05-06)](https://www.youtube.com/watch?v=3TdC6xb1RfY) (in Chinese)
- [1132 Generative AI recording playlist](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv) (in Chinese)
- [GenAI12 ControlNet 與 Fooocus slides (Google Drive)](https://drive.google.com/file/d/15-cHR3PSoGVmXj0yrrzCksDJQ1fcVtir/view) (in Chinese)
- [1132 slide folder entry point (yenlung.me/1132GenAI)](https://yenlung.me/1132GenAI)
- [Zhang, Rao, and Agrawala 2023: Adding Conditional Control to Text-to-Image Diffusion Models (ControlNet)](https://arxiv.org/abs/2302.05543)
- [lllyasviel/Fooocus (GitHub, with install instructions and project status)](https://github.com/lllyasviel/Fooocus)
- [Official Fooocus Colab notebook](https://colab.research.google.com/github/lllyasviel/Fooocus/blob/main/fooocus_colab.ipynb)
- [lllyasviel/FramePack (GitHub)](https://github.com/lllyasviel/FramePack)
