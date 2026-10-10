---
title: "CS231N L16: Vision and Language — From CLIP's Contrastive Learning to Multimodal Foundation Models That Talk About Images"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, clip, vision-language-model, multimodal, foundation-models]
lang: en
series:
  name: "Reading Stanford CS231N"
  order: 17
tldr: "The CS231N Spring 2026 vision-and-language lecture replaces the \"one model per task\" approach of the first half of the course with foundation models: pre-train one model on a large, diverse dataset, then adapt it to many tasks through fine-tuning, zero-shot, or few-shot use. Three threads carry the lecture. First, CLIP: contrastive learning in both directions over 400 million image-text pairs scraped from the web, then writing class names as sentences to classify without any fine-tuning; it also has weak spots, such as failing to tell \"a mug in some grass\" from \"some grass in a mug\". Second, vision-language models from LLaVA and Flamingo to Qwen3-VL and Molmo, which feed image features into an LLM so it can look at an image and output text. Third, chaining: letting an LLM write descriptions or programs that string existing vision models together."
description: "A guide to Stanford CS231N (Spring 2026) Lecture 16, \"Vision + Language (and Foundation Models)\": what makes a foundation model, CLIP's data and two-way InfoNCE objective, zero-shot classification and prompt ensembles, CLIP's strengths and weaknesses (batch size, compositionality, hard negatives), SigLIP and CoCa, the two fusion designs of LLaVA and Flamingo, Qwen3-VL and Molmo/PixMo, CuPL and VisProg, and omni models."
draft: false
glossary:
  - term: "zero-shot classification"
    definition: "Classifying without fine-tuning on any labels from the target dataset: write each class as a sentence, turn it into a class vector with the text encoder, and assign each image to the most similar class."
    context: "CLIP made this practical for image classification."
  - term: "compositionality"
    definition: "Understanding the difference in meaning between things built from the same parts in different structures, such as \"a mug in some grass\" and \"some grass in a mug\". CS231N uses it to show a weakness of CLIP-style models."
    context: "The slides mention benchmarks such as Winoground, CREPE, and ARO."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs231n-vision-language)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

> **Source years:** slides and assignments are from Spring 2026; the recordings are from Spring 2025 (YouTube). The two may differ. This post follows the 2026 slides and uses the recording only as a supplement.
>
> This is part 17 of the [Reading Stanford CS231N](/posts/ai/2026-09-30-cs231n-course-overview-en) series. The previous post is [L14: Generative Models II, Diffusion](/posts/ai/2026-09-30-cs231n-generative-models-diffusion-en); the next is [A3 guide: Transformer Captioning, SSL, DDPM, CLIP & DINO](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip-en). L15 (3D vision) moves to after A3 in this series; see the [L15 guide](/posts/ai/2026-09-30-cs231n-3d-vision-en).

For the [CS231N](https://cs231n.stanford.edu/) lecture on May 26, 2026, the [schedule](https://cs231n.stanford.edu/schedule.html) gives the title "Vision and Language", while the slide cover reads "Vision + Language (and Foundation Models)". The official material is the 122-page [lecture_16.pdf](https://cs231n.stanford.edu/slides/2026/lecture_16.pdf); the matching public recording is [Spring 2025 Lecture 16](https://www.youtube.com/watch?v=mQOK0Mfyrkk).

**The gap between recording and slides is especially large for this lecture.** The 2025 [lecture_16.pdf](https://cs231n.stanford.edu/slides/2025/lecture_16.pdf) has 148 pages, was given by Ranjay Krishna, and includes a long section on Segment Anything; the 2026 version lists Segment Anything only in the taxonomy, and adds Qwen3-VL, SigLIP, and omni models. When the 2025 recording covers something the 2026 slides don't, treat it as extra material.

## Course video sources

This article uses Spring 2026 materials. The public Spring 2025 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=mQOK0Mfyrkk
title: YouTube: CS231N Spring 2025 Lecture 16: Vision and Language
```

Original videos: [YouTube: CS231N Spring 2025 Lecture 16: Vision and Language](https://www.youtube.com/watch?v=mQOK0Mfyrkk)

Course and recording entries:

- [Official course / lecture source](https://cs231n.stanford.edu/schedule.html)

## Scene: how far can one model per task go?

Slide 2 recaps how the course has thought about models so far: **train a specialized model for each task**. Four data domains, four models, four tasks.

Slide 3 switches to another paradigm: the **foundation model**. Pre-train one model on a large-scale, diverse dataset, then adapt it to many tasks through fine-tuning, zero-shot, or few-shot use.

How do you tell whether a model counts as a foundation model? Slide 4 gives two tiers:

- **Always seen**: general and robust across many different tasks
- **Often seen**: many parameters, lots of data, a self-supervised pre-training objective

Slide 7 sorts foundation models into five classes and marks the ones this lecture covers: Language (ELMo, BERT, GPT, T5), Classification (CLIP, CoCa), LM + Vision (LLaVA, Flamingo, GPT, Gemini, Qwen), Chaining (LMs + CLIP, Visual Programming), and And More (Segment Anything, Whisper, DALL·E, Stable Diffusion, Imagen).

## Intuition: widen SimCLR's representation space to hold sentences too

Slides 9–11 recap [SimCLR from L12](/posts/ai/2026-09-30-cs231n-self-supervised-learning-en): learn image features with a self-supervised objective that pulls two augmentations of the same image together and pushes different images apart, in the hope that the learned representation generalizes to new instances.

Slide 13 asks the key question: **what if this representation space could also embed sentences?** If "My favorite dog is a golden retriever" and "A cute fluffy cat" could live in the same space as images, how would you build that joint image-text space?

## Mechanism 1: CLIP in two steps

**Step 1: collect a ton of data** (slides 14–15). [CLIP](https://arxiv.org/abs/2103.00020)'s training data was scraped at scale from web images and their alt-text, about 400 million image-text pairs. The slides note this data collection has since been replicated ([Xu et al., Demystifying CLIP Data, ICLR 2024](https://arxiv.org/abs/2309.16671)).

**Step 2: pick a loss** (slides 17–25). The slides quote the CLIP authors on prior work such as image captioning: instead of predicting the **exact** words for an image, you only need a model that **matches the correct description to the image**.

So CLIP uses the same family of contrastive objective as SimCLR (InfoNCE). A batch of N images and N texts goes through an image encoder and a text encoder, and pairwise similarities form an N×N matrix. A **two-way InfoNCE loss** (image-to-text and text-to-image) pushes up the similarities on the diagonal. The slides note that some details aren't shown, such as the temperature parameter and L2 normalization of the vectors. After training you have a model that embeds images and text and gives a similarity score between an image and a text.

## Mechanism 2: classify without fine-tuning

The traditional route (slides 26–27) transfers the pre-trained encoder to downstream tasks such as classification, detection, and segmentation with a linear classifier on top.

Language models allow another use (slide 28): no fine-tuning, just use the model "in a creative way", for example by turning review classification into a fill-in-the-blank: "The movie review 'I hated the movie' is ____". Can a vision-language model do the same?

**CLIP's clever trick** (slides 30–37):

1. Use the **text encoder** to produce a vector for each class, such as "plane", "dog", "bird"
2. Run a new image through the image encoder and score it against each class vector
3. Pick the most similar class

The slides compare this to 1-NN with the text vectors as the training data. Two prompt-engineering tricks:

| Technique | Gain on ImageNet (per the slides) |
|---|---|
| Write the class as a sentence, "A photo of a [category]", since CLIP was trained on sentences | +1.3% |
| Use several templates ("A photo of…", "A drawing of…") and average the vectors | +5% |

**Results** (slides 38–43): after training on 400 million image-text pairs, CLIP's zero-shot accuracy matches a ResNet-101 trained on ImageNet — and CLIP used **no human labels at all**. The generalization story is more interesting: a model trained on ImageNet drops when moved to ObjectNet (same classes, odd viewpoints), while zero-shot CLIP does well, and likewise on graphic images, sketches, and adversarial datasets.

**How can no labels beat labels?** Slides 46–48 offer three possible answers: "no labels" is a bit misleading (the text is itself supervision), the pre-training scale is massive, and test set leakage. The third probably isn't the main cause: dataset leakage is around 2%. The scale comparison:

| | CLIP | ImageNet ResNet |
|---|---|---|
| Parameters | 307 million | 44.5 million |
| Training data | 400 million images | 1.28 million |

**Two common variants** (slides 49–52):

- **[SigLIP](https://arxiv.org/abs/2303.15343)**: uses a sigmoid instead of a softmax. The benefit is that computing each sample's loss doesn't require materializing the whole batch, which saves memory
- **[CoCa](https://arxiv.org/abs/2205.01917)**: adds a generative objective on top of CLIP, in the form of a decoder with a captioning loss

## Strengths and weaknesses of CLIP-style models

**Strengths** (slide 54):

1. The dot product is very efficient: easy to train and scale, fast at inference, for example retrieval over 5 billion images
2. Open vocabulary, with zero-shot generalization
3. Can be chained with other models (CuPL, later in the lecture)

**Weaknesses** (slides 55–62). The slides cite an April 2022 example from Tristan Thrush et al.: CLIP **cannot distinguish** "there is a mug in some grass" from "there is some grass in a mug".

1. **It relies too heavily on batch size to learn concepts.** Larger batches give finer concepts: at batch size 4 it learns "animal", at 100 "dog", at 32,000 "Welsh Corgi". But there is a limit: even in a batch of 32K, you are unlikely to see both "a mug in some grass" and "some grass in a mug". This is the **compositionality** problem, with benchmarks such as Winoground, CREPE, and ARO. One fix is hard-negative fine-tuning ("horse eating grass" vs. "grass eating horse"), but that has its own problem: "a black cat and a brown dog" and "a brown dog and a black cat" describe the same thing — a "hard positive" that should not be pushed apart
2. **Image-level captions are insufficient supervision.** You can also train on region captions with bounding-box coordinates
3. **No single 5-billion-image dataset contains everything.** Data collection and filtering have to be very intentional

## Mechanism 3: letting an LLM see — LLaVA and Flamingo

**Motivation** (slide 65): language models that do next-token prediction can handle a wide range of tasks at inference time — math, sentiment analysis, symbolic reasoning. Can we build a model that **takes images and text as input and outputs text**? That is a vision-language model (VLM).

**Historical context** (slides 66–67): VLMs didn't start with LLaVA; they go back at least to [ViLBERT](https://arxiv.org/abs/1908.02265) in 2019. But those models had to be fine-tuned for each task separately, with non-trivial task-specific methods such as Mask R-CNN bounding-box re-ranking for RefCOCO — the same task-specific paradigm the lecture criticized at the start.

**[LLaVA](https://arxiv.org/abs/2304.08485)'s key idea** (slides 68–75): an LLM already decodes text autoregressively, so **insert image tokens** ahead of the text tokens. Which image tokens work best? A CLIP encoder is a good option, but the layer matters:

- The patch tokens in the final layer are not supervised (CLIP's contrastive loss only looks at the CLS or pooling token), so they could be random and the loss wouldn't change
- So use the **penultimate layer**. In practice these tokens preserve spatial and linguistic information best for the LLM, and dropping CLS gives slight gains

LLaVA's training recipe has three steps: initialize the decoder with a pre-trained LLM (such as LLaMA) and use a pre-trained CLIP as the image encoder; train a new linear layer to bridge CLIP features into the LLM's input space; then fine-tune the LLM and the linear layer together. The slides note that about 178,000 samples of image + instruction + output text give reasonable performance.

**[Flamingo](https://arxiv.org/abs/2204.14198)'s alternative fusion** (slides 76–85): images go through a vision encoder and feed into the language model's layers from the side, leaving only an `<image>` tag in the text sequence. The architecture diagram on slide 78 marks the vision encoder and the LM blocks as frozen; the two learned parts are the Perceiver sampler, which converts a variable number of image tokens into a fixed number, and the gated cross-attention layers inserted between LM blocks (labeled GATED XATTN-DENSE in the figure). The training data is arranged like language modeling, with special tags such as `<image>` and `<eos>` marking when an image appears or the text ends. It supports in-context learning and works zero-shot and few-shot.

## The state of play in 2026: open weights are not fully open source

**Who is state of the art?** (slide 86) The slides say Gemini is widely considered the best proprietary VLM.

**Open models** (slides 87–94): the slides first separate **open weights** (download and run locally) from **fully open source** (reproduce the training). They then use the [Qwen3-VL technical report](https://arxiv.org/abs/2511.21631) (December 2025) to show what changed since LLaVA:

1. Native image resolution: larger images get more tokens, with 2D-RoPE positional embeddings to handle varying sizes
2. A SigLIP-2 vision encoder instead of CLIP
3. For video, frame times are given in text, such as `<0.0 seconds>`
4. Embeddings from layers 8, 16, and 24 of SigLIP-2 are used
5. Four training phases, starting with bridging the vision encoder and later including context extension

**Most open-weight models are distilled** (slides 96–102, [Molmo and PixMo](https://arxiv.org/abs/2409.17146), CVPR 2025). The slides sort models into API only, open weights, distilled, and completely open, then compare data sizes: Molmo's PixMo has about 700k image-text pairs, against 6 billion for the Llama 3.1V shown on the slide. That is a quality-versus-quantity tradeoff: internet data is often incidental ("pink, japan, aesthetic"), while human annotations are intentional. The catch is that dense captions are hard to collect. Molmo's clever fix: **people don't like to type, but they love to talk**. Annotators spoke about an image for 60 to 90 seconds, and the speech was automatically converted to text for pre-training.

## Mechanism 4: chaining — stringing models together

**CuPL** (slides 104–107, [Pratt et al.](https://arxiv.org/abs/2209.03320)): how does a model classify a concept it has never seen (marimba, viaduct, papillon, lorikeet)? First have an LLM generate a description of the class, then classify using the description.

**VisProg** (slides 108–116, [Gupta & Kembhavi](https://arxiv.org/abs/2211.11559)): can chaining generalize to all vision tasks? The traditional options are to train a new model for the new task, or hand-write a Python script that chains existing models (say, run single-image VQA twice and combine the answers) — but the hand-written script only covers two images. VisProg has GPT generate that program, composing off-the-shelf vision models to answer the question.

**Omni models** (slide 117): beyond vision and language, train one model to take in and output text, audio, and video. The slides say this started with GPT-4o in 2024, and that Thinking Machines and Gemini have recently introduced their own.

## Back to the models: where this lecture sits in the course

Looking back, this lecture gathers parts from earlier ones: the ViT from [L8](/posts/ai/2026-09-30-cs231n-attention-transformers-vit-en) is CLIP's image encoder, the contrastive learning of [L12](/posts/ai/2026-09-30-cs231n-self-supervised-learning-en) becomes image-text contrast, and the captioning of [L7](/posts/ai/2026-09-30-cs231n-recurrent-neural-networks-en) is the path CLIP's authors decided not to take. The [FLUX.1](/posts/ai/2026-09-30-cs231n-generative-models-diffusion-en) model from the previous lecture also uses CLIP as one of its text encoders.

**Assignment mapping.** Q4 of [A3](https://cs231n.github.io/assignments2026/assignment3/) is CLIP and DINO (`CLIP_DINO.ipynb`, `cs231n/clip_dino.py`). The CLIP part reuses the COCO data from the A2 captioning task and asks you to implement image-text similarity, a zero-shot classifier, and a text-to-image retriever; one inline question is weakness #1 from this lecture: "Why does CLIP's learning depend on the batch size?" Details are in the [A3 guide](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip-en).

## Going deeper

**Official material**

- [lecture_16.pdf (2026)](https://cs231n.stanford.edu/slides/2026/lecture_16.pdf)
- [lecture_16.pdf (2025)](https://cs231n.stanford.edu/slides/2025/lecture_16.pdf): includes the Segment Anything section that matches the 2025 recording
- Recording: [Spring 2025 L16](https://www.youtube.com/watch?v=mQOK0Mfyrkk)
- [A3](https://cs231n.github.io/assignments2026/assignment3/): Q4 CLIP & DINO

**Related posts on this site** (each is self-contained; overlap is kept)

- [CS224N: Multimodality](/posts/ai/2026-08-22-cs224n-multimodality-en) — the same family of models from an NLP course
- [CS336 Lecture 17: Multimodal alignment](/posts/ai/2026-08-22-cs336-multimodal-alignment-en) — image tokens from the language-model training side

## Access limits

Under the grading in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en), this course is **A3**: the 2026 slides, assignments, and starter code are public, plus full 2025 recordings. The gaps for this lecture: 2026 recordings are on Canvas for enrolled students only, and the 2025 recording differs from the 2026 slides more than in other lectures.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Stanford CS231N course homepage (Spring 2026)](https://cs231n.stanford.edu/)
- [CS231N Spring 2026 schedule](https://cs231n.stanford.edu/schedule.html)
- [CS231N Spring 2026 Lecture 16 slides](https://cs231n.stanford.edu/slides/2026/lecture_16.pdf)
- [CS231N Spring 2025 schedule](https://cs231n.stanford.edu/2025/schedule.html)
- [CS231N Spring 2025 Lecture 16 slides](https://cs231n.stanford.edu/slides/2025/lecture_16.pdf)
- [YouTube: CS231N Spring 2025 Lecture 16: Vision and Language](https://www.youtube.com/watch?v=mQOK0Mfyrkk)
- [CS231N Assignment 3 (Spring 2026)](https://cs231n.github.io/assignments2026/assignment3/)
- [Radford et al., Learning Transferable Visual Models From Natural Language Supervision (CLIP)](https://arxiv.org/abs/2103.00020)
- [Zhai et al., Sigmoid Loss for Language Image Pre-Training (SigLIP)](https://arxiv.org/abs/2303.15343)
- [Yu et al., CoCa: Contrastive Captioners are Image-Text Foundation Models](https://arxiv.org/abs/2205.01917)
- [Liu et al., Visual Instruction Tuning (LLaVA)](https://arxiv.org/abs/2304.08485)
- [Alayrac et al., Flamingo](https://arxiv.org/abs/2204.14198)
- [Qwen3-VL Technical Report](https://arxiv.org/abs/2511.21631)
- [Deitke et al., Molmo and PixMo](https://arxiv.org/abs/2409.17146)
- [Pratt et al., What does a platypus look like? (CuPL)](https://arxiv.org/abs/2209.03320)
- [Gupta & Kembhavi, Visual Programming (VisProg)](https://arxiv.org/abs/2211.11559)
