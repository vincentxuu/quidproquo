---
title: "Audio, Video, and World Models: A Reading Map | CMU 10-423 Topic Guide"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, speech-to-text, video-generation, world-model, diffusion-model, multimodal]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 50
tldr: "Audio representation, temporal relationships in video, and action-conditioned world transitions are different learning tasks. The earlier combined guide checked only audio at the end. This URL now serves as a reading map to five separate lessons, including the separate alignment deck from Lecture 26."
description: "Audio representation, temporal relationships in video, and action-conditioned world transitions are different learning tasks. The earlier combined guide checked only audio at the end. This URL now serves as a reading map to five separate lessons, including the separate alignment deck from Lecture 26."
draft: false
glossary:
  - term: "mel-spectrogram"
    aliases: ["log-mel spectrogram"]
    definition: "Cut audio into overlapping short windows, run a Fourier transform on each to get a spectrogram, then map the frequency axis onto the mel scale, which is closer to human hearing. The result can be treated like an image. Taking logarithms of mel-band energies yields a log-mel spectrogram; the two representations are not identical."
    context: "The audio representation in CMU 10-423 Lecture 24; Whisper's input is a log-mel spectrogram."
    links:
      - label: "Radford et al. 2022: Whisper"
        url: "https://arxiv.org/abs/2212.04356"
  - term: "world model"
    aliases: ["WM"]
    definition: "A model that takes a previous world state s and an action a and samples or predicts the next state s′ from a distribution p(s′ | s, a)."
    context: "The interactive-world-model deck in CMU 10-423 Lecture 26 covers 3D scenes, interactive video, and latent-state representations. Action control and multi-step transitions require separate evaluation."
    links:
      - label: "Bruce et al. 2024: Genie"
        url: "https://arxiv.org/abs/2402.15391"
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-audio-video-world-models)

**Video status: recordings require login or course authorization.** [Recording source](#course-video-sources)

Audio representation, temporal relationships in video, and action-conditioned world transitions are different learning tasks. The earlier combined guide checked only audio at the end. This URL now serves as a reading map to five separate lessons, including the separate alignment deck from Lecture 26.

## Choose a lesson

- [Audio representation and ASR](/posts/ai/2026-10-11-cmu10423-lecture-24a-audio-representation-asr-en): work through its mechanism, example, and answer criteria.
- [Audio generation](/posts/ai/2026-10-11-cmu10423-lecture-24b-audio-generation-en): work through its mechanism, example, and answer criteria.
- [Video generation](/posts/ai/2026-10-11-cmu10423-lecture-25-video-generation-en): work through its mechanism, example, and answer criteria.
- [Interactive world models](/posts/ai/2026-10-11-cmu10423-lecture-26a-world-models-en): work through its mechanism, example, and answer criteria.
- [Alignment science](/posts/ai/2026-10-11-cmu10423-lecture-26b-science-of-alignment-en): work through its mechanism, example, and answer criteria.

The [course map](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) lists the core path. This page is a topic guide, not an additional lecture. Choose the question you need to answer and follow its lesson.

## A worked comparison

Teaching world model: the state is character position x=0, with actions right and left. Define toy transitions f(x,right)=x+1 and f(x,left)=x−1. From the same initial state, next positions are 1 and −1; two right actions produce 2. This tests action intervention rather than visual continuity alone. A model that always moves to 1 fails the control test even if its frames look convincing. The audio lesson’s 98-frame spectrogram example tests representation, not video coherence or world dynamics.

## Check your understanding

If a video follows a “walk right” text prompt but has no action input, does it pass an interactive-world-model check?

<details>
<summary>Answer and criterion</summary>

Not by itself. Change actions under the same state and history, inspect subsequent transitions, and test multi-step rollout. Text-conditioned video does not automatically provide that interface or capability.

</details>

## How to use this map

Before reading the answer, identify the inputs, what changes, and the outputs. Then complete the linked lesson’s variation. If two mechanisms seem identical, trace where their conditions or data paths diverge. This page checks relationships and boundaries; it does not replace the derivations, implementations, or evaluations in the individual lessons.

The source edition is Spring 2026. Teaching examples are not official assessments or reconstructed classroom speech. Recordings remain subject to course authorization.

## Course video sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, the anonymous reader returned an unloaded folder and a sign-in prompt; it did not provide playable lecture content. This establishes an access limit, not the absence of recordings. This guide uses public written materials and provides no reconstructed classroom speech or original-audio transcript.

- [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)

## Update Log

- 2026-10-11: Rebuilt the teaching scope, worked example, and self-check; retained the original URL and publication date.

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The login wall is confirmed (anonymous Panopto folder lists no videos and prompts sign-in); the official pages link no public YouTube version, so the status is unchanged.

## References

- [CMU 10-423/623/723 Generative AI (Spring 2026) course home page](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Course schedule (Lectures 24–26, Quiz 6, project timeline)](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Lecture 24 slides: Audio Understanding and Synthesis](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture24-audio.pdf)
- [Lecture 24 slides (inked in-class version)](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture24-audio-ink.pdf)
- [Lecture 25 slides: Video Generation and Understanding](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture25-video.pdf)
- [Lecture 26 slides: Interactive World Models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture26-world-models.pdf)
- [Radford et al. 2022: Robust Speech Recognition via Large-Scale Weak Supervision (Whisper)](https://arxiv.org/abs/2212.04356)
- [Wu et al. 2024: Towards audio language modeling — an overview](https://arxiv.org/abs/2402.13236)
- [Huang et al. 2018: Music Transformer](https://arxiv.org/abs/1809.04281)
- [Copet et al. 2023: Simple and Controllable Music Generation (MusicGen, NeurIPS)](https://proceedings.neurips.cc/paper_files/paper/2023/hash/94b472a1842cd7c56dcb125fb2765fbd-Abstract-Conference.html)
- [Liu et al. 2023: AudioLDM](https://arxiv.org/abs/2301.12503)
- [Evans et al. 2024: Fast Timing-Conditioned Latent Audio Diffusion (Stable Audio)](https://arxiv.org/abs/2402.04825)
- [Das et al. 2024: SpeechVerse](https://arxiv.org/abs/2405.08295)
- [Veo 3 Tech Report](https://storage.googleapis.com/deepmind-media/veo/Veo-3-Tech-Report.pdf)
- [Chen et al. 2024: Panda-70M](https://arxiv.org/abs/2402.19479)
- [Ho et al. 2022: Video Diffusion Models](https://arxiv.org/abs/2204.03458)
- [Çiçek et al. 2016: 3D U-Net](https://arxiv.org/abs/1606.06650)
- [Arnab et al. 2021: ViViT: A Video Vision Transformer](https://arxiv.org/abs/2103.15691)
- [Blattmann et al. 2023: Align your Latents (Video LDM)](https://arxiv.org/abs/2304.08818)
- [Peebles & Xie 2022: Scalable Diffusion Models with Transformers (DiT)](https://arxiv.org/abs/2212.09748)
- [OpenAI: Video generation models as world simulators (Sora)](https://openai.com/index/video-generation-models-as-world-simulators/)
- [Zheng et al. 2025: Open-Sora 2.0](https://arxiv.org/abs/2503.09642)
- [Liu et al. 2024: World Model on Million-Length Video And Language With Blockwise RingAttention (Large World Model)](https://arxiv.org/abs/2402.08268)
- [Rivard et al. 2025: NeuralOS](https://arxiv.org/abs/2507.08800)
- [Zhuge et al. 2026: Neural Computers](https://arxiv.org/abs/2604.06425)
- [Mildenhall et al. 2020: NeRF](https://arxiv.org/abs/2003.08934)
- [Kerbl et al. 2023: 3D Gaussian Splatting for Real-Time Radiance Field Rendering](https://arxiv.org/abs/2308.04079)
- [Poole et al. 2022: DreamFusion](https://arxiv.org/abs/2209.14988)
- [Chen et al. 2023: Text-to-3D using Gaussian Splatting (GSGen)](https://arxiv.org/abs/2309.16585)
- [Bruce et al. 2024: Genie: Generative Interactive Environments](https://arxiv.org/abs/2402.15391)
- [Chang et al. 2022: MaskGIT](https://arxiv.org/abs/2202.04200)
- [Google DeepMind: Genie 3](https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/)
- [Assran et al. 2025: V-JEPA 2](https://arxiv.org/abs/2506.09985)
- [PAN Team 2025: PAN: A World Model for General, Actionable, and Long-Horizon World Simulation](https://arxiv.org/abs/2511.09057)
- [HW623 handout (paper list)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/HW623.pdf)
