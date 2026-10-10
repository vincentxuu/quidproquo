---
title: "CMU 10-423 L24–L26: Audio, Video Generation, and Interactive World Models — Taking Generative Models from Images to Sound, Time, and Worlds You Can Act In"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, speech-to-text, video-generation, world-model, diffusion-model, multimodal]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 22
tldr: "The last three lectures of CMU 10-423 carry the Transformers, tokenizers, and latent diffusion from earlier in the course over to new kinds of data. L24 covers audio: turn sound into a mel-spectrogram or discrete tokens, then transcribe with Whisper, generate with AudioLM and MusicGen, and diffuse with AudioLDM. L25 covers video: 3D UNets with spatio-temporal attention, latent video diffusion, DiT and Sora, and finally the interactive NeuralOS. The first half of L26 covers world models, which predict the next state from a state and an action, along three routes: generate a 3D scene, interactive video (Genie), and latent representations (V-JEPA, PAN)."
description: "A guide to Lectures 24–26 of CMU 10-423/623/723 Generative AI (Spring 2026): audio representations (PCM, mel-spectrogram), speech recognition with Whisper, Gemini, and Parakeet, AudioLM, Music Transformer, MusicGen, AudioLDM, StableAudio, SpeechVerse; video diffusion (3D UNet, ViViT, Video Diffusion Model, Video LDM, DiT, Sora, Open-Sora), Large World Model, NeuralOS; and the definition of world models and their three routes (NeRF/Gaussian splatting, Genie 1–3, V-JEPA, PAN)."
draft: false
glossary:
  - term: "mel-spectrogram"
    aliases: ["log-mel spectrogram"]
    definition: "Cut audio into overlapping short windows, run a Fourier transform on each to get a spectrogram, then map the frequency axis onto the mel scale, which is closer to human hearing. The result can be treated like an image."
    context: "The audio representation in CMU 10-423 Lecture 24; Whisper's input is a log-mel spectrogram."
    links:
      - label: "Radford et al. 2022: Whisper"
        url: "https://arxiv.org/abs/2212.04356"
  - term: "world model"
    aliases: ["WM"]
    definition: "A model that takes a previous world state s and an action a and samples or predicts the next state s′ from a distribution p(s′ | s, a)."
    context: "The definition used in the first half of CMU 10-423 Lecture 26, which focuses on physical interactions in 3D."
    links:
      - label: "Bruce et al. 2024: Genie"
        url: "https://arxiv.org/abs/2402.15391"
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-audio-video-world-models)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

**This post is based on the Spring 2026 edition of [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/).** It is part 22 of the [Reading CMU 10-423](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) series and follows [L23: code generation and autonomous agents](/posts/ai/2026-09-30-cmu10423-code-generation-agents-en). It covers the course's last three lectures:

| Lecture | Date | Title | Speakers (title slide) |
|---|---|---|---|
| Lecture 24 | April 13 | Audio understanding and synthesis | Matt Gormley |
| Lecture 25 | April 15 | Generative Models for Videos | Aran Nayebi & Matt Gormley |
| Lecture 26 (first half) | April 20 | Interactive World Models | Matt Gormley & Aran Nayebi |

Official materials used: the [schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html), the [L24 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture24-audio.pdf) (38 pages) and [inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture24-audio-ink.pdf) (38 pages), the [L25 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture25-video.pdf) (34 pages), and the [L26 world models slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture26-world-models.pdf) (40 pages). L26's other deck, "Science of Alignment," is covered in [part 20](/posts/ai/2026-09-30-cmu10423-risks-alignment-en). None of the three lectures lists readings on the schedule. The course's access grade is **A3** (definitions in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)), but the recordings sit behind a CMU Panopto login and the audio and video demos survive only as links, so this post relies entirely on slide text and figure captions.

All three lectures share one question: **how do the tokenizers, Transformers, and latent diffusion you learned on text and images extend to sound, to the time axis, and to worlds that respond to a user's actions?** The answer keeps the same shape. First find a good representation (a spectrogram, discrete tokens, a latent space), then apply a generative model you already know.

## Course video sources

The course links Spring 2026 recordings through SCS Panopto. On 2026-10-10 the anonymous Panopto folder listed no videos and prompted sign-in. The course homepage and schedule link no public (YouTube) recordings; an instructor post dated 2026-04-08 said YouTube recordings were “coming very soon”, but no such link had appeared on the official pages when checked. This article follows the public slides and assignments; recording access is governed by course authorization.

Course and recording entries:

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

Checked: 2026-10-10.

## L24: understanding and synthesizing audio

### Turning sound into something a model can eat

The deck starts with raw audio. A recording device keeps sampling air pressure (amplitude), which gives the PCM representation. A raw audio file has three parameters: number of channels, bit depth (bits per amplitude), and sampling rate (samples per second). The example is a 44.1 kHz, 16-bit stereo recording: 44,100 samples per second, each sample two 16-bit integers, one per channel.

If a sound never changed, a single Fast Fourier Transform (FFT) would recover the sine waves behind it. Real sound changes over time, so you run many FFTs over overlapping windows and get a spectrogram you can view as an image. Pass the frequencies through a frequency-to-mel map and you have a mel-spectrogram.

### Speech recognition: Whisper, Gemini, Parakeet

[Whisper](https://arxiv.org/abs/2212.04356) is an encoder-decoder Transformer that the slides call almost identical to Vaswani et al. (2017). The concrete settings:

- The input is a log-mel spectrogram of a 30-second chunk (16 kHz, 80 channels, 25 ms window, 10 ms stride).
- The encoder starts with two convolution layers plus sinusoidal positional embeddings; the decoder uses learned positional embeddings.
- Encoder and decoder have the same number of Transformer blocks (32).
- One model is trained on many tasks, with special tokens marking the task and the language; timestamp tokens let it produce time-aligned transcripts.
- The Large model has 1.5B parameters, and the dataset is so large that only 2–3 epochs are used.

The results slides say Whisper closes the gap to human-level word error rate on English LibriSpeech, does well on high-resource languages and less well on low-resource ones, and translates speech across many languages.

Two other routes:

- **Gemini**: a multimodal LLM that, unlike Whisper, is decoder-only. Audio is converted to 16 kHz and each second becomes 25 tokens. Transcription falls out naturally, and text prompts can be interleaved with the audio.
- **Parakeet (NVIDIA)**: the slide says it tends to be about 10x faster than Whisper while keeping very high recognition quality. The family is built on FastConformer, paired with three output schemes: TDT (Token and Duration Transducer), RNN-Transducer, and CTC. The figure comes from Hugging Face's [Open ASR Leaderboard](https://huggingface.co/spaces/hf-audio/open_asr_leaderboard).

### Audio generation: sound as a token sequence

The generation section opens with a figure from an [overview of audio language modeling](https://arxiv.org/abs/2402.13236): many models first use an audio codec to turn the signal into discrete tokens, then train a language model on those tokens to generate speech, music, or natural sounds.

**AudioLM** is built from:

| Component | Setting on the slides |
|---|---|
| Input | Single-channel audio of length T = 16000 |
| Acoustic tokenizer | SoundStream neural audio codec, vocabulary N = 1024 |
| Semantic tokenizer | w2v-BERT, vocabulary K = 1024, sequence length T′ = T/640 |
| Generator | Decoder-only Transformer in a three-stage hierarchy; each stage conditions on the previous one, with a separate model per stage to keep sequences short |
| Output | SoundStream decoder |

**Music generation** uses two representations. [Music Transformer](https://arxiv.org/abs/1809.04281) generates MIDI (the slides compare its continuations with a baseline Transformer and an LSTM). **MusicGen** generates audio tokens directly:

- The audio tokenizer is EnCodec, a convolutional autoencoder
- Codebook interleaving: several token streams predicted in parallel
- Text prompts are encoded with T5, Flan-T5, or CLAP; melody prompts go through an information bottleneck
- The decoder is a Transformer LM of up to 3.3B parameters

**The diffusion route**: [AudioLDM](https://arxiv.org/abs/2301.12503) handles text to audio, text plus audio to audio (style transfer or completion), and audio to audio (inpainting). It has three parts: a VAE that compresses the mel-spectrogram into a latent space (compression ratio r = 4), a DDPM with a DDIM schedule and classifier-free guidance, and encoders trained with contrastive language-audio pre-training (CLAP, like CLIP for audio). [StableAudio](https://arxiv.org/abs/2402.04825) is architecturally similar but also conditions on start and end times, so the model learns where a snippet sits within a song and can generate audio of variable length.

This section maps almost one to one onto [part 13 on text-to-image](/posts/ai/2026-09-30-cmu10423-text-to-image-vlm-en): the VAE plays the role of latent diffusion's compressor, and CLAP plays the role of CLIP.

### Audio language models: SpeechVerse

[SpeechVerse](https://arxiv.org/abs/2405.08295) represents a common architecture for audio language models. Audio passes through a pre-trained audio encoder and an adapter to become vectors, text goes through the LLM's embedding matrix, and the two are concatenated and fed to a pre-trained LLM. The slide points out that this mirrors the pattern from [part 13](/posts/ai/2026-09-30-cmu10423-text-to-image-vlm-en): attach an image encoder to a pre-trained LLM to get a VLM.

The last slide previews the next lecture: [Veo 3](https://storage.googleapis.com/deepmind-media/veo/Veo-3-Tech-Report.pdf) is a video diffusion model that diffuses audio at the same time, so its clips come with synced sound.

## L25: generating and understanding video

### Data: most captions are written by models

The deck notes that the largest captioned video datasets mostly use a model to write the captions, for example [Panda-70M](https://arxiv.org/abs/2402.19479), and that caption quality and style vary a lot depending on which model was used.

### From 3D UNet to the Video Diffusion Model

The [Video Diffusion Model](https://arxiv.org/abs/2204.03458) (2022) is a 3D UNet plus spatio-temporal attention, with relative positional embeddings along the time axis. The slides explain it through two predecessors:

- **[3D UNet](https://arxiv.org/abs/1606.06650)**: originally for segmenting 3D biomedical images (the example is a 3D scan of a Xenopus kidney). It is almost identical to the standard UNet, except that 2D convolution (height, width, channel) becomes 3D convolution (height, width, depth, channel).
- **[ViViT](https://arxiv.org/abs/2103.15691)** (written VViT on the slides): an image ViT treats every frame as independent and only attends over space; the video version alternates spatial and temporal attention.

<details>
<summary>Factorized spatio-temporal attention as shown on the slides</summary>

Spatial attention:

1. reshape: `b t h w c -> (b t) (h w) c`
2. multi-headed attention
3. reshape back to `b t h w c`

Temporal attention:

1. reshape: `b t h w c -> (b h w) t c`
2. multi-headed attention
3. reshape back to the original shape

The trick is to fold whichever axes are not part of this attention into the batch dimension.

</details>

The Video Diffusion Model adds two more techniques:

- **Joint image and video training**: when training on images, the temporal attention is masked so that all attention mass stays on the current image. The slides say this improves video generation.
- **Reconstruction guided sampling**: used for sampling from a conditional distribution, for example generating the next 16 frames given the first 16, or filling in frames to raise a low frame rate. The key idea is to guide the sample based on the model's reconstruction of the conditioning data.

### Latent video diffusion, DiT, and Sora

- **[Video LDM](https://arxiv.org/abs/2304.08818)**: two parts, an encoder/decoder that compresses video to a latent representation and back, and a video diffusion model trained in that latent space. Same idea as latent diffusion in [part 13](/posts/ai/2026-09-30-cmu10423-text-to-image-vlm-en).
- **[DiT](https://arxiv.org/abs/2212.09748)**: a Transformer replaces the UNet as the diffusion backbone, covered in [part 14](/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer-en).
- **[Sora](https://openai.com/index/video-generation-models-as-world-simulators/)**: the slide says only that Sora uses a DiT backbone trained on images and videos.
- **[Open-Sora 2.0](https://arxiv.org/abs/2503.09642)**: training costs are falling as models and datasets improve; it uses a three-stage training recipe and is evaluated with human evaluation plus benchmarks and metrics.

### Video understanding and "interactive video"

Video understanding gets a single example: the [Large World Model](https://arxiv.org/abs/2402.08268), which both generates and understands text, images, and video.

The final section, "agentic video generation + understanding," is the newest material in the lecture:

- **[NeuralOS](https://arxiv.org/abs/2507.08800)** (2025): interactive video diffusion for GUIs. User actions plus a hidden state go in, the next screen comes out.
- **[Neural Computers](https://arxiv.org/abs/2604.06425)** (2026): the slide shows only a [demo link](https://metauto.ai/neuralcomputer/) and the paper source, with no explanatory text.

NeuralOS already takes a state and an action and predicts the next frame, which leads straight into L26's definition of a world model.

## L26, first half: interactive world models

### Definition and uses

The deck sets the tone with psychology: a world model is "hypothetical thinking," informally a thought experiment. Then it gives the course's definition:

> A world model takes a previous world state s and an action a, and samples (or predicts) the next world state s′ through a distribution (or function): s′ ∼ p(s′ | s, a).

What the state holds depends on what you want to model. The slide contrasts "all geopolitical entities, their leaders, and the decisions they make" with "physical interactions in a 3D world," and the course focuses on the latter.

The slides list six uses: simulated training data for robotics, simulated training data for autonomous driving, interactive worlds (i.e. computer games) created by prompting, automatic generation and editing of 3D animation or graphics, letting a thinking model hypothesize about physical interactions in the real world, and faster creation of VR/AR environments. Data sources include large image and video datasets, smaller 3D scene datasets, text, audio, and multimodal data.

### Three routes

| Route | Approach | Examples on the slides |
|---|---|---|
| 1. Generate a 3D scene, then render/simulate | Produce a representation an existing renderer can draw | Marble (World Labs), GSGen, DreamFusion, NeRF-VAE |
| 2. Interactive videos | The feel of interacting with a game engine | Genie 1–3, GameNGen, Muse, Oasis, GAIA 1–2 |
| 3. Latent world representations | Represent the world state in a low-dimensional latent space (continuous, discrete, or both) | PAN, V-JEPA 1–2 |

### Route 1: generating 3D scenes

[NeRF](https://arxiv.org/abs/2003.08934) and [Gaussian Splatting](https://arxiv.org/abs/2308.04079) share a goal: synthesize a 3D scene from 2D images and define a differentiable renderer.

- **NeRF**: a continuous neural field mapping 3D position and view direction to density and emitted radiance. Its drawback is slow volumetric rendering, which is a poor fit for real-time interaction.
- **Gaussian Splatting**: represent the scene as a cloud of 3D Gaussians (splats), each with position, shape, opacity, and color, and render in real time or near real time by rasterizing them efficiently.

Generative models sit on top of these representations. [DreamFusion](https://arxiv.org/abs/2209.14988) trains a NeRF from scratch for each caption, which works because NeRF is differentiable. [GSGen](https://arxiv.org/abs/2309.16585) does the same but generates Gaussian splats. The section ends with [World Labs' Marble](https://marble.worldlabs.ai/).

### Route 2: interactive video (Genie)

[Genie-1](https://arxiv.org/abs/2402.15391) gets more slides than any other model in the lecture. At test time it takes an image as a prompt, accepts one user action per time step, and generates the next frame from the current frame and the action, mimicking how you'd interact with a video game.

| Item | What the slides say |
|---|---|
| Training data | 6.8M 16-second videos (30k hours) of 2D platformer games |
| Size | 11B parameters |
| Video tokenizer | A VQ-VAE that encodes T frames into discrete tokens; ST-Transformer backbone |
| Latent action model (LAM) | Another VQ-VAE that learns latent actions from unlabeled video: the encoder infers actions from consecutive frames, the decoder reconstructs the next frame from past frames plus actions. Discarded at test time, since a human supplies the actions |
| Dynamics model | A decoder-only [MaskGIT](https://arxiv.org/abs/2202.04200) that predicts the next frame's tokens from previous video tokens and actions, trained with cross-entropy; action embeddings are added rather than concatenated |

The LAM is the part to notice. The training data contains no key presses at all; the model learns the actions from how frames change. The qualitative results show that images from a text-to-image model can serve as prompts, and that the learned latent actions map onto real keys so users can discover what each one does.

The slides cover two follow-up experiments:

- **Robotics**: training Genie on 130k robot demonstrations, a simulation dataset, and 209k episodes of real robot data (all video, no actions) yields a model that lets you play with a robot arm "game" style.
- **Do latent actions transfer?** On CoinRun, a procedurally generated platformer, three policies are compared: behavior cloning on expert actions (the skyline), random actions (the baseline), and a LAM-based policy trained on Genie's latent actions, with a mapping from latent to expert actions learned from a few examples.

The slides call Genie-2's technical description vague and guess that the main change is scale (more parameters, more data). For [Genie-3](https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/) they list six limitations:

- The interaction window lasts only a few minutes
- Actions are (likely) latent and come from a fixed set; you can't define new ones
- Prompting for world changes is an open set, creating an asymmetry between closed actions and open world changes
- Seemingly limited to one character
- Fundamentally still a video model, with no game-engine-readable world representation (point cloud, mesh, Gaussian splats)
- Very high compute demands

### Route 3: latent world representations

- **[V-JEPA](https://arxiv.org/abs/2506.09985) (1–2)**: a non-generative world model. It always works in latent space, minimizing the gap between the latent representation of the true masked regions of a raw video and the latent representation predicted from the masked video, with the loss defined directly between the two latents. The goal is to transfer the learned representation to other tasks.
- **[PAN](https://arxiv.org/abs/2511.09057)**: aims at long-horizon, conditioned interactive simulation. Three parts: a vision encoder h maps observations to structured latent states; an autoregressive world model f predicts the next latent state from actions and history (long horizon); a video diffusion decoder g reconstructs high-quality frames from latent states (short horizon). Unlike JEPA, PAN keeps its training objective in observation space. The slides' reasoning: the JEPA objective is prone to collapse and needs careful regularization, while an observation-space objective forces the model to stay grounded in the real observations in the training data.

## How the course tests these lectures

- **Quiz 6**: in class on April 20 (the day of L26) per the schedule, covering L21–L24. So L24 audio is in scope and L25 and L26 are not. The questions are not public.
- **Homework and exam**: there are no programming assignments after L15, and the [practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf), released before the March 30 exam, doesn't cover these lectures either.
- **HW623**: papers on the [list](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/HW623.pdf) that relate to these lectures include [NeRF](https://arxiv.org/abs/2003.08934), [Video Diffusion Models](https://arxiv.org/abs/2204.03458), [Video-LLaVA](https://arxiv.org/abs/2311.10122), and [A Recipe for Generating 3D Worlds From a Single Image](https://arxiv.org/abs/2503.16611).
- **Project**: both the L24 and L25 decks open with project reminders (midway report April 13, poster upload April 26, presentations April 28, final report and code April 30). Details are in [part 23](/posts/ai/2026-09-30-cmu10423-exam-hw623-project-en).

**Try this tonight**: take a 30-second recording and plot its log-mel spectrogram with `librosa` or `torchaudio` using 80 channels, a 25 ms window, and a 10 ms stride, which are Whisper's input settings. Looking at that image, you'll see why the diffusion models in the second half of L24 can treat sound as a picture.

## What this post can and cannot confirm

Confirmed: schedule dates and titles, the text and figure captions of the three decks, and the paper URLs the slides cite. Not confirmed: spoken explanations and demo content (Panopto requires a login and the slides keep only demo links), technical details of Genie-2 and Genie-3 (the slides themselves call them vague), the content of Neural Computers (the slide has only a link), and the Quiz 6 questions. The reminder slide at the start of the L26 deck lists HW623 due April 21, poster upload April 27, and the final report May 1. The schedule says April 20, 26, and 30. The reminder slide looks carried over from an earlier term, so this post follows the schedule.

Further reading: for the math of diffusion and flow matching, see [Reading MIT 6.S184](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en); for the role of world models in reinforcement learning, see [CS234 guest lecture: World of World Modeling](/posts/ai/2026-09-30-cs234-guest-world-models-en).

Series navigation: previous [L23: code generation and autonomous agents](/posts/ai/2026-09-30-cmu10423-code-generation-agents-en) | next [Wrap-up: practice exam, HW623, and the final project](/posts/ai/2026-09-30-cmu10423-exam-hw623-project-en) | [series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## Update Log

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
