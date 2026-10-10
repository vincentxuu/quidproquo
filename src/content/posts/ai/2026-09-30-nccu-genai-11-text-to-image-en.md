---
title: "Reading NCCU Yen-Lung Tsai Generative AI, L11: Text-to-Image AI, Principles and Practice — CLIP Reads the Prompt, Schedulers Decide Whether It Converges, LoRA Learns Only ΔW, and You Build a Web App with diffusers"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, course-guide, generative-ai, diffusion-model, clip, lora, image-generation, text-to-image]
lang: en
series:
  name: "Reading NCCU Yen-Lung Tsai Generative AI"
  order: 11
tldr: "L11 fills in the rest of the Stable Diffusion diagram. CLIP is trained so that matching text and images get similar vectors, which turns a prompt into a 77×768 embedding. Schedulers compress 1,000 noising steps into twenty or thirty denoising steps, but ancestral samplers such as Euler a never settle: push to 100 steps and the subject changes jackets and seats. LoRA freezes the original W and learns only a ΔW factored into A·B. The hands-on part loads an SD 1.5-family model with diffusers, and the week 11 homework is your own image-generation web app."
description: "A guide to lecture 11 of Yen-Lung Tsai's NCCU course Generative AI: Text and Image Synthesis Principles and Practice (semester 1132, spring 2025), based on video 11, the 72-page GenAI11 slides and AI-Demo's Demo08g: CLIP and OpenCLIP, LAION-5B, the text encoders in SD 1.x and 2.x, schedulers through the lens of convergent sequences, ancestral vs. convergent samplers and their step counts, LoRA's low-rank factorization and checkpoints, .ckpt / .safetensors / diffusers formats, fp16 and memory tuning, pipeline parameters and seeds, a Gradio image app, and the week 11 homework and rubric from the Chang Gung satellite section."
draft: false
glossary:
  - term: "CLIP"
    aliases: ["Contrastive Language-Image Pretraining"]
    definition: "A 2021 OpenAI model that trains a text encoder and an image encoder together so that matching text and image vectors end up close. Stable Diffusion uses its text encoder to turn the prompt into a conditioning vector."
    context: "GenAI11 slides 7–16."
    links:
      - label: "Radford et al. 2021 (arXiv)"
        url: "https://arxiv.org/abs/2103.00020"
  - term: "Scheduler (sampler)"
    aliases: ["scheduler", "sampler"]
    definition: "The algorithm that decides, at each denoising step, how to estimate the next latent from the current noisy one, so generation doesn't need every noising step used in training."
    context: "GenAI11 slides 17–40; Euler a, DPM++ 2M Karras, UniPC and DDIM are all schedulers."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nccu-genai-11-text-to-image)

**Video status: Videos included.** [Source details](#course-video-sources)

**This guide covers semester 1132 (spring 2025) of Yen-Lung Tsai's NCCU course *Generative AI: Text and Image Synthesis Principles and Practice*.** It is part 11 of the [Reading NCCU Yen-Lung Tsai Generative AI](/posts/ai/2026-09-30-nccu-genai-course-overview-en) series and follows [L10, the adventure that starts with the VAE](/posts/ai/2026-09-30-nccu-genai-10-vae-to-diffusion-en). Last week ended on the Stable Diffusion diagram. This week takes apart its CLIP and scheduler boxes, adds LoRA, the most common fine-tuning technique, and then writes code.

It draws on four official sources: [video 11](https://www.youtube.com/watch?v=8VS6Dcxmp34) (2025-04-29, about 2 h 59 min), the 72-page GenAI11 slides in the instructor's [slide folder](https://drive.google.com/drive/folders/1c6A9Pa-c7cNi5kHUp7j-ccgYBRy9JpeA), the [AI-Demo](https://github.com/yenlung/AI-Demo) notebook [`【Demo08g】打造Stable_Diffusion的WebUI`](https://yenlung.me/AI08g), and the week 11 homework on the [Chang Gung satellite course page](https://yangchihyuan.github.io/courses/GenerativeAI2025) (in Mandarin). Access level: **A3**. Demo08g was last committed on 2025-04-29, the day of the lecture. **What follows quotes the current repo version.**

## Course video sources

Video sources were checked against the official course page and rechecked live on 2026-10-10: lecture and video match, and the YouTube videos are public and embeddable. No timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=8VS6Dcxmp34
title: 【生成式 AI】11. 文字生圖AI的原理及實作（YouTube 錄影）
```

Original videos: [【生成式 AI】11. 文字生圖AI的原理及實作（YouTube 錄影）](https://www.youtube.com/watch?v=8VS6Dcxmp34)

Course and recording entries:

- [Official course and recording entry](https://yangchihyuan.github.io/courses/GenerativeAI2025)

Checked: 2026-10-10.

## Where this week sits in the course

The slides have four parts: CLIP, which brings the meaning of text and images closer; "don't go ancestral": schedulers; LoRA; and image generation with diffusers. The video timeline:

| Time | Content |
|---|---|
| 23:00–36:05 | Diffusion review |
| 36:05–48:24 | CLIP, OpenCLIP, how SD understands text |
| 48:24–1:03:11 | Schedulers via convergent sequences, the ancestral family, recommended settings |
| 1:13:01–1:25:34 | LoRA, checkpoints |
| 1:25:34–2:03:35 | diffusers hands-on, finding models, the image web app, homework briefing |
| from 2:15:45 | Lightning talk, course announcements, TA session |

Slides 3–6 repeat last week's diagram, the "merge text into noise" picture and the Q/K/V figure, so you can follow along even if you skipped L10.

## Idea 1: CLIP brings text and images together

Where does the "CLIP text embedding 77×768" on the left of the diagram come from? Slides 7–8 introduce **CLIP (Contrastive Language-Image Pretraining)**, from OpenAI's [Radford et al. 2021](https://arxiv.org/abs/2103.00020).

One picture on the slide says it all. A text encoder fθ reads "a girl in a cafe", an image encoder gθ reads a photo of a girl in a café, and training makes the two vectors **as similar as possible**. Matching pairs get pulled together; mismatched pairs get pushed apart. After training, the text encoder's output carries "what this sentence looks like in the world of images", which is exactly what you want as a condition for generating images.

Slides 15–16 connect this to [L05's transformers](/posts/ai/2026-09-30-nccu-genai-05-transformers-math-en). CLIP's text side has 12 transformer layers. Like any network, they turn one set of vectors into another, and the last layer can be read as the computer's "abstract understanding" of the input.

### OpenCLIP, LAION-5B and SD's two generations of text encoder

Slides 9–11 lay out the versions:

| | Text encoder |
|---|---|
| SD 1.x | CLIP |
| SD 2.x | OpenCLIP (trained on LAION-5B) |

Slide 10 compares data scale: ImageNet at about 14 million images, OpenAI CLIP's training set marked "?", and [LAION-5B](https://arxiv.org/abs/2210.08402) at about 5.85 billion image-text pairs.

Slide 9 says OpenCLIP exists because "OpenAI released the CLIP model but not the trained parameters". A small correction is due. According to OpenAI's [CLIP model card](https://github.com/openai/CLIP/blob/main/model-card.md), the weights were released in stages (ViT-L/14 in January 2022). **What OpenAI didn't release was the training dataset.** The SD 1.5 [model card](https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-v1-5) also states it uses a fixed, pretrained CLIP ViT-L/14 text encoder. [OpenCLIP](https://github.com/mlfoundations/open_clip) is an open-source reimplementation of CLIP. The point is that it can be trained from scratch on public data.

Slides 12–14 add a fun observation: most community models are built on version 1.5, and users report that the original SD 1.x knows more celebrities. Tsai searches for "Tzuyu Chou" on LAION's clip-retrieval site (the slide notes the site no longer works, but LAION-5B's contents haven't changed), concludes SD should "know" her, and generates an image with the standard SD v1.5. His verdict: you might not think it looks like her, but at least it draws an East Asian face correctly.

## Idea 2: schedulers, and "don't go ancestral"

Slide 18 is titled "Scheduler (sampler): don't go A?" The Mandarin "A 圖" reads as a joke, since it is also slang for racy pictures; here the A stands for ancestral samplers. To see why it matters, you need a detour through calculus.

Slides 19–22: remember whether a sequence a1, a2, …, an converges or diverges? A standard move in analysis is to guess a1, then apply some clever update to adjust it bit by bit until you reach the right answer. The objects don't have to be numbers; you can ask whether a sequence of vectors or tensors converges. Slide 23 jokes that everyone must think the instructor walked into the wrong class. Slide 24 reveals the point: **denoising does exactly this**, with fθ turning xt into xt−1.

Slides 25–31 explain what a scheduler does. Training adds noise over 1,000 steps, but nobody wants 1,000 steps to generate an image. The network learns the noise εθ. It can't estimate all of it at once, but it can estimate the noise added over some stretch of time. Subtract that, and you land at an earlier xt−k. So you don't need all 1,000 steps. Different schedulers are different answers to "how far to jump, and how".

### More steps, better image? Not necessarily

Slide 32 punctures a fantasy: more sampling steps don't always mean a prettier image. The advice is to try a small step count first, then raise the steps with **the same random seed** once you like the result.

Slide 33 flags the "A" family, the **ancestral schedulers**: Euler a, DPM2 a, DPM2 a Karras, DPM++ 2S a and DPM++ 2S a Karras. They inject random noise during denoising to speed things up. The catch is that they basically don't converge.

Slides 34–37 show an Euler a sequence. Steps 5 to 15 look like a horror film, and step 20 already looks good. At step 25 she's suddenly in a different jacket. At step 30 the leather jacket is back, but she's less sharp and her drink has changed. After that it's a denim jacket, a new seat, a haircut and a move indoors. By step 100 she looks "a bit impatient from posing too long". This sequence explains "doesn't converge" better than any formula.

Slide 38 adds that the A family isn't alone: DDIM and the SDE samplers don't converge either. Slides 39–40 cite [stable-diffusion-art.com's sampler guide](https://stable-diffusion-art.com/samplers/) for these recommendations:

| Type | Scheduler | Suggested steps |
|---|---|---|
| Convergent | DPM++ 2M Karras | 20–30 |
| Convergent | UniPC | 20–30 |
| Non-convergent | DPM++ SDE Karras (a slower algorithm) | 8–12 |
| Non-convergent | DDIM | 10–15 |

The slides close with a caveat: not converging isn't necessarily a problem. It just means extra steps may not buy what you expect.

**Try this:** with one seed and one prompt, run Euler a at 20, 50 and 100 steps, then UniPC at the same three counts. Put the six images side by side and you'll see convergence, or its absence, for yourself.

## Idea 3: LoRA learns only a very thin ΔW

Slides 43–44 explain why people fine-tune. The pretrained Stable Diffusion falls short in places, and we want to adjust it with our own data. Two problems follow. The model is huge, so your computer may not be able to train it. And your data is much smaller, so could it wreck what the model already learned?

Slides 45–47 perform LoRA's trick in three steps:

1. Write Stable Diffusion's parameters as an m×n matrix W.
2. **Freeze** the original W and adjust only ΔW in W + ΔW. The problem: ΔW still has m×n parameters.
3. Factor ΔW into A·B, with A being m×k and B being k×n. Just pick a small k.

<details>
<summary>Why a small k saves so much</summary>

Learning ΔW directly takes m·n parameters. Factored as A·B, it takes m·k + k·n = k(m+n). With m = n = 1,000 and k = 8, that's 1 million versus 16,000, about 1.6%. k is the rank, which is what "low-rank" refers to.

</details>

Slide 48 cites Microsoft's [LoRA paper (Hu et al. 2021)](https://arxiv.org/abs/2106.09685) and stresses that the method is general enough for almost any neural network. As the paper's title shows, it was first proposed for large language models.

In practice (slides 49–54):

- **Where to find them:** [Civitai](https://civitai.com/) and [models tagged lora on Hugging Face](https://huggingface.co/models?other=lora).
- **How to use them:** W + α×ΔW, where α sets the strength, say 0.7. Once merged, it behaves like a new model. In interfaces that support it, add `<lora:LoRA的檔案名稱:0.7>` (that is, `<lora:filename:weight>`) to the prompt.
- **What a checkpoint is:** a complete set of model parameters. Merge a LoRA into the original weights and the result is a checkpoint.
- **File formats:** Stable Diffusion models usually come as `.ckpt` or `.safetensors`. diffusers stores one model per folder, so a single-file model has to be converted first. LoRAs come in both formats too; check whether a download is a LoRA (partial parameters) or a full checkpoint.

## This week's demo notebook

### System tuning from the slides

Slides 59–63 collect a few details for running diffusers on Colab or your own machine:

- Load with `torch_dtype=torch.float16` to save compute. Move to `"cuda"`; on a Mac, use `"mps"`.
- On low VRAM, `pipe.enable_attention_slicing()` computes in slices to save memory. Macs share VRAM and RAM, so memory runs out fast.
- `pipe.enable_model_cpu_offload()` lets the GPU rest between tasks.
- A Mac needs a one-step "warm-up" image before it behaves. In the slide's words: "To this day, nobody knows why."

The slides load `runwayml/stable-diffusion-v1-5`. On Hugging Face that name now redirects to [`stable-diffusion-v1-5/stable-diffusion-v1-5`](https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-v1-5), so you can use the new name directly.

Slide 66 lists the common pipeline parameters: `prompt`, `negative_prompt`, `width` / `height` (default 512), `num_images_per_prompt`, `num_inference_steps` (default 50), `guidance_scale` (default 7.5; higher follows the prompt more closely; the slide writes "GFC scale", usually called CFG scale, for classifier-free guidance), and `generator` (sets the seed). Slide 67 covers image size: SD suggests one side at 512 and the other a multiple of 8. Slide 68 stresses that **the random seed is the key to controlling the image**, fixed with `torch.Generator(device="cpu").manual_seed(r)`.

Slide 69 suggests some SD 1.5 models to try, such as `Lykon/dreamshaper-8` and `SG161222/Realistic_Vision_V6.0_B1_noVAE`. Slide 70 shows how to filter for SD 1.5 models on Civitai.

### Demo08g: your own image UI in Gradio

The "WebUI" in the name suggests AUTOMATIC1111. In fact Demo08g is **a custom interface built with diffusers and Gradio**, continuing from the Demo08 notebook covered in [L10](/posts/ai/2026-09-30-nccu-genai-10-vae-to-diffusion-en).

The current repo version is structured like this:

1. Load `digiplay/majicMIX_realistic_v6` (fp16, on CUDA) and swap in `UniPCMultistepScheduler`.
2. `generate_images()` takes the prompt, toggles for prompt boosting and a negative prompt, an optional custom seed, height, width, steps and image count. It first checks that height and width are multiples of 8. For multiple images it uses "base seed + i" and returns the images plus the list of seeds used.
3. The Gradio page: the left column holds the prompt and toggles, height and width dropdowns (512 / 768 / 1024), a steps slider from 10 to 50 (default 20) and an image count from 1 to 4. The right column shows a gallery and the seed info.

Printing the seeds is a practical touch: when you like an image, you can keep its seed and tweak everything else.

## Homework: week 11 (Chang Gung satellite version)

The task on slide 72: build your own image-generation web app! Find a suitable model. Adjust the prompt, or even recommend prompts to users. Add features, for example: let an LLM optimize the prompt automatically (or translate a Mandarin prompt into English), give each style its own optimized prompt and negative prompt, or let users switch schedulers and VAEs.

The Chang Gung version: generate images from text with an SD 1.5 model on Hugging Face. You can find a model you like on [Civitai](https://civitai.com/models) first, then search for it on Hugging Face (if it isn't there, it may not be on Hugging Face at all). You may submit a Colab link or a PDF. The 1132 deadline was 2025-05-12.

**Submit:** the model you used, plus several generated sets. Each set is the input prompt and other settings plus the output image.

**Rubric** (out of 10): same model or prompt as the instructor, 2; images only, 4; about the same as the instructor's demo code, 6; four or more sets meeting the requirements, 7–10 depending on creativity. Anywhere you used generative AI, attach the prompt and output screenshots, or it counts as copying from AI.

**Self-grading for readers:** "about the same as the demo" caps at 6, so swapping the model name isn't enough. Of the extensions on the slide, a scheduler dropdown is the easiest way to stand out. Include one convergent and one non-convergent option, pair them with a fixed seed, and users can compare for themselves. It's also the best review of the scheduler section. Submissions go through each school's LMS, so outside readers can only grade themselves against this rubric.

## Self-check

- State CLIP's training objective and which half of it Stable Diffusion uses.
- Say how the text encoders in SD 1.x and SD 2.x differ.
- Explain what a scheduler does using convergent sequences, and name two non-convergent schedulers.
- Say why an Euler a image keeps changing even at 100 steps.
- Write LoRA's parameter count k(m+n) and explain how a checkpoint differs from a LoRA file.
- Find the line in Demo08g that fixes the seed, and add a scheduler dropdown.

## Further reading

This guide stands on its own. To go deeper, the site has these:

- The math of diffusion, sampling and guidance: [MIT 6.S184 guide](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en)
- Visual generation and CLIP-style models: [Stanford CS231N guide](/posts/ai/2026-09-30-cs231n-course-overview-en)
- Transformers and LoRA on LLMs: [Stanford CME295 guide](/posts/ai/2026-09-29-stanford-cme295-transformers-llms-en)
- The course landscape and access levels: [Global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)

Previous: [L10 The adventure that starts with the VAE](/posts/ai/2026-09-30-nccu-genai-10-vae-to-diffusion-en) | Next: [L12 ControlNet and Fooocus](/posts/ai/2026-09-30-nccu-genai-12-controlnet-fooocus-en) | [Series overview](/posts/ai/2026-09-30-nccu-genai-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Matched against the official course page and YouTube: lecture and embedded videos agree and are publicly embeddable, so status is now Videos included.

## References

- [Generative AI 11: Text-to-image AI, principles and practice (YouTube, in Mandarin)](https://www.youtube.com/watch?v=8VS6Dcxmp34)
- [Yen-Lung Tsai's 1132 Generative AI slide folder (GenAI11, in Mandarin)](https://drive.google.com/drive/folders/1c6A9Pa-c7cNi5kHUp7j-ccgYBRy9JpeA)
- [1132 lecture playlist (in Mandarin)](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv)
- [Chang Gung satellite course page: Generative AI 2025 (in Mandarin)](https://yangchihyuan.github.io/courses/GenerativeAI2025)
- [yenlung/AI-Demo: Demo08g, a Stable Diffusion web UI](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo08g%E3%80%91%E6%89%93%E9%80%A0Stable_Diffusion%E7%9A%84WebUI.ipynb)
- [yenlung/AI-Demo: Demo08, generating images with diffusers](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo08%E3%80%91%E7%94%A8diffusers%E5%A5%97%E4%BB%B6%E7%94%9F%E6%88%90%E5%9C%96%E5%83%8F.ipynb)
- [Radford et al. (2021). Learning Transferable Visual Models From Natural Language Supervision. arXiv:2103.00020](https://arxiv.org/abs/2103.00020)
- [Schuhmann et al. (2022). LAION-5B: An open large-scale dataset for training next generation image-text models. arXiv:2210.08402](https://arxiv.org/abs/2210.08402)
- [Hu et al. (2021). LoRA: Low-Rank Adaptation of Large Language Models. arXiv:2106.09685](https://arxiv.org/abs/2106.09685)
- [OpenAI CLIP model card](https://github.com/openai/CLIP/blob/main/model-card.md)
- [mlfoundations/open_clip (GitHub)](https://github.com/mlfoundations/open_clip)
- [stable-diffusion-v1-5 model card (Hugging Face)](https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-v1-5)
- [stable-diffusion-art.com sampler guide (cited on slides 39–40)](https://stable-diffusion-art.com/samplers/)
- [Hugging Face diffusers documentation](https://huggingface.co/docs/diffusers/index)
- [Civitai](https://civitai.com/)
