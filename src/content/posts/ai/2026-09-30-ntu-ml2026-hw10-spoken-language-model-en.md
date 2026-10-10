---
title: "Reading NTU ML 2026: HW10 Spoken Language Model — Three Architectures, Mimi's 32 Token Layers, and How Moshi Listens While It Talks"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, homework, speech-processing, tokenization, multimodal, voice-ai]
lang: en
series:
  name: "Reading NTU Hung-yi Lee Machine Learning 2026 Spring"
  order: 20
tldr: "HW10 is 12 multiple-choice questions answered only on NTU COOL. Section 1 compares three spoken language model architectures: Cascade (ASR → LLM → TTS, with text in the middle), End-to-End (a language model over discrete speech tokens), and Thinker-Talker (an LLM thinks, a separate decoder speaks). In the Colab, two models listen to three clips and guess the speaker's gender, and you work out which one is the cascade. Section 2 takes Mimi apart: tokenize an emotion corpus into 32 RVQ layers, plot UMAP for layers 0, 6, 16, and 31, then encode and decode speech, laughter, and music to hear what breaks. The rest are paper questions on TWIST, AudioLM, LLaMA-Omni 2, Moshi, and GLM-4-Voice, covering initialization, pretraining, interleaving, and realtime/full-duplex behavior. The Colab needs Llama-3.2-3B-Instruct access and an HF token. Questions and Colab are public; outside readers miss only the COOL grading and answers."
description: "A guide to HW10 \"Spoken Language Model\" in NTU Hung-yi Lee's Machine Learning 2026 Spring, based on hw10.pdf, the homework Colab, and the TA video: Cascade, End-to-End, and Thinker-Talker architectures; the Model A vs Model B gender experiment; Mimi's semantic and acoustic RVQ layers; UMAP analysis on the EmoV-DB emotion corpus; detokenizer reconstruction and PESQ; TWIST's text-model initialization; AudioLM's two token types; interleaving in Moshi and GLM-4-Voice; realtime and full-duplex; and where the PDF and Colab question numbers disagree."
draft: false
glossary:
  - term: "Thinker-Talker"
    aliases: ["Thinker–Talker architecture"]
    definition: "Splits a spoken dialogue model in two: the Thinker is an LLM that understands and reasons; the Talker is a decoder that produces speech tokens from the Thinker's output or hidden states."
    context: "HW10 uses LLaMA-Omni 2 as the Thinker-Talker example and compares it with end-to-end models like Moshi."
  - term: "Mimi"
    aliases: ["kyutai/mimi", "Mimi codec"]
    definition: "Kyutai's neural audio codec. It encodes a waveform into multiple layers of RVQ (residual vector quantization) discrete tokens and can decode them back. Moshi uses it as its speech tokenizer."
    context: "The HW10 Colab loads it with Hugging Face transformers' MimiModel. Layer 0 comes from the semantic quantizer; the other layers come from the acoustic quantizer."
  - term: "Full-duplex"
    aliases: ["full duplex"]
    definition: "The model can speak while it is listening to the user, without waiting for an explicit turn switch."
    context: "HW10 PDF page 22 defines realtime as short output latency and full-duplex as listening and talking at the same time."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-ml2026-hw10-spoken-language-model)

**This post follows HW10 of [NTU Hung-yi Lee's Machine Learning 2026 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) (taught in Mandarin).** It is part 20 of the [Reading NTU Hung-yi Lee Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) series, and the last one. The previous post is [HW9: Flow Matching](/posts/ai/2026-09-30-ntu-ml2026-hw9-flow-matching-en).

Official materials used: the homework slides [hw10.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw10.pdf) (42 pages; from page 31 on, all 12 questions with their options), the [homework Colab](https://colab.research.google.com/drive/1QBtp0lQrjQbTKB1sLIxoavqhSU7EhG_g?usp=sharing) (32 cells), and the TA video listed on the course page, [ML 2026 Spring HW10 Spoken Language Model](https://youtu.be/Gx96VH6ePC4). The course page lists 5/29 as the release date; the deadline is 2026/06/18 23:59:59 (UTC+8), no late submissions. Grades are out by 2026/06/19, regrade requests close on 06/21, and final course grades are out by 06/22. The TAs are 陳竣瑋, 陳思齊, 鄭安妤, and 尹廷安.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=Gx96VH6ePC4
title: TA video: ML 2026 Spring HW10 Spoken Language Model
```

Original videos: [TA video: ML 2026 Spring HW10 Spoken Language Model](https://www.youtube.com/watch?v=Gx96VH6ePC4)

Course and recording entries:

- [Official course and recording entry](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

## Access level: A3, but no official answers

- **Available**: the homework PDF (all 12 questions and options in the appendix), the Colab starter code, and the [homework code repo](https://github.com/Tincan0325/26spring_ml_hw10_speech_model) that the Colab clones.
- **Not available**: answers are submitted on NTU COOL, which needs an NTU account, so outside readers get no grading and no answer key. This post gives no answers to any question.
- **Accounts and hardware**: Section 1 uses [meta-llama/Llama-3.2-3B-Instruct](https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct), so you must request access on Hugging Face and paste an HF token into the Colab. The Colab requires a GPU (a T4 is enough), estimates 1–2 hours, and warns that free accounts aren't guaranteed a GPU.

## Prerequisites and extra material

No lecture this semester corresponds to this homework. PDF page 3 lists two 2025 videos as extra material (both in Mandarin): [GenAI & ML Intro 2025, lecture 10: a history of spoken language models](https://youtu.be/CbIPjrOj2Tc) (the title notes that 2025-era techniques start at 1:42:00) and [ML in the GenAI era 2025, lecture 12: how language models learned to talk](https://youtu.be/gkAyqoQkOSk). The tokenizer figure on page 13 is credited to [the 2025 HW10](https://youtu.be/FDxg0mtFKZo).

Six readings are assigned: [TWIST](https://arxiv.org/abs/2305.13009), [AudioLM](https://arxiv.org/abs/2209.03143), [LLaMA-Omni 2](https://arxiv.org/abs/2505.02625), the [Mimi model](https://huggingface.co/kyutai/mimi) and [Mimi codec paper](https://kyutai.org/Moshi.pdf), [Moshi](https://arxiv.org/abs/2410.00037), and [GLM-4-Voice](https://arxiv.org/abs/2412.02612).

## Goals and format

PDF page 4 splits the homework in two:

- **Section 1**: learn the different types of spoken language model.
- **Section 2**: learn how speech becomes tokens through Mimi, and the initialization, pretraining, and interleaving steps of a spoken LM.

You answer **12 multiple-choice questions** on NTU COOL. The PDF weights Q1–Q5 and Q10–Q12 at 1% each and Q6–Q8 at 0.5% each; Q9 has no weight printed.

Page 5 frames the task: speech in, speech out. The obvious approach is ASR to text, an LLM (such as ChatGPT), then TTS. The whole homework asks what other routes exist, and what each one gives up and gains.

## Section 1: three architectures

PDF pages 7–9 draw the three architectures:

| Type | Pipeline | Intermediate representation |
|---|---|---|
| Type 1 Cascade | ASR → LLM → TTS | Text |
| Type 2 End-to-End | tokenizer → Speech LLM/Transformer → detokenizer | Discrete speech tokens |
| Type 3 Thinker-Talker | tokenizer → Thinker (LLM) → hidden states → Talker (decoder) → detokenizer | Discrete speech tokens, with hidden states passed from Thinker to Talker |

The four questions test:

- **Q1**: cascade vs non-cascade, sourced from the Moshi paper. Moshi's abstract names three problems with traditional pipelines: stacking components adds several seconds of latency; using text as the intermediate modality loses information that changes meaning, such as emotion and non-speech sounds; and relying on explicit speaker turns can't handle overlap and interruptions.
- **Q2**: the Colab experiment (next section).
- **Q3**: LLaMA-Omni 2's Thinker-Talker design. Its abstract says it builds on the Qwen2.5 series with a speech encoder and an autoregressive streaming speech decoder, ranges from 0.5B to 14B parameters, and trains on only 200K multi-turn speech dialogues.
- **Q4**: LLaMA-Omni 2 (Thinker-Talker) compared with Moshi (end-to-end).

### Colab: which of Model A and Model B is the cascade

Section 1 asks a model, by voice, whether the speaker is male or female. The Colab clones the homework repo, sets up Model A and then Model B, has each listen to the three clips F_1, F_2, and M_1 in `sample_audio_prompted/`, and prints their text responses. You decide from the answers which one is the cascade; the reasons are part of the options.

Three practical notes:

- Model A downloads about 15 GB of weights on the first run; the Colab says to expect 5–7 minutes.
- Model B's setup installs `transformers==4.49.0` and restarts the runtime. A cell between the two frees GPU memory and clears cached modules.
- The question text is inconsistent: PDF page 10 says "ten sample audio files", while the appendix on page 32 and the Colab code both use three (2 female, 1 male). Go with what the Colab actually runs.

## Section 2: Mimi splits sound into 32 layers

The figure on page 13 draws the tokenizer's output as a table: frames (time) across, layers down, an integer token in each cell. The detokenizer turns the table back into sound.

The Colab loads the model with Hugging Face transformers' `MimiModel.from_pretrained("kyutai/mimi")`. The core function `get_mimi_token` reads the audio file, converts it to mono, resamples to Mimi's sampling rate, calls `mimi_model.encode`, and returns tokens shaped (1, number of RVQ layers, frames), with 32 layers by default.

The Colab code also makes the source of each layer explicit: **layer 0 comes from the semantic residual vector quantizer, and layers 1–31 from the acoustic residual vector quantizer**. That lines up with AudioLM, whose abstract says it uses discretized activations of a pretrained masked language model to capture long-term structure and a neural audio codec's discrete codes for high-quality synthesis, since each token type makes a different trade-off.

### Q5: UMAP on an emotion corpus

The data is [EmoV-DB](https://www.openslr.org/115/) with five emotions: Amused, Angry, Disgusted, Sleepy, and Neutral. PDF page 15 shows how each clip becomes one point:

1. Extract Mimi tokens and keep one layer.
2. Look up that layer's codebook to turn each token into a 256-dim vector (token-to-embedding retrieval).
3. Average over frames, giving one 256-dim vector per clip.
4. Reduce to 2D with [UMAP](https://pair-code.github.io/understanding-umap/); same color means same emotion.

The Colab plots layers 0, 6, 16, and 31 side by side; processing the corpus takes about 2–5 minutes. The question asks how well emotions cluster at different layers. Make a prediction first: layer 0 is semantic, and the later layers are acoustic residuals that add detail one layer at a time. Where would you expect emotion to show up? Then look at the plots.

### Q6–Q7: decode it back and hear what breaks

The detokenizer section encodes each file, decodes it, and scores reconstruction with PESQ. Note that the Colab encodes with only **8 layers** here (`num_quantizers=8`), not the 32 used earlier.

The four files are English speech, Chinese speech, laughter, and music. Q6 compares Chinese and English reconstruction; Q7 asks whether laughter or music reconstructs worst and what that implies. Both need your ears, not just the PESQ number.

**The question numbers don't match**: the PDF labels UMAP as Q5 and the detokenizer as Q6–Q7, while the Colab comments label UMAP as Q6 and the detokenizer as Q7–Q8. The PDF calls the file `TTS_English_speech.wav`; the Colab calls it `English_speech.wav`. When answering, follow the PDF, which matches the COOL quiz.

## Section 2: initialization, pretraining, interleaving

The next three questions are paper reading:

- **Q8, TWIST** ([Textually Pretrained Speech Language Models](https://arxiv.org/abs/2305.13009)): start a speech LM from a pretrained text LM (warm start) and compare with training from scratch (cold start). The options test concrete choices (which weights are kept, how embeddings are handled) and results (data volume, convergence speed, tokenizer frame rate), so check the numbers in the paper's experiment sections.
- **Q9, AudioLM**: the two common kinds of discrete speech tokens in modern spoken LMs, what information each captures, and how generation is staged.
- **Q10, interleaving in Moshi and GLM-4-Voice**: both interleave text tokens with speech tokens, but for different purposes and in different ways. GLM-4-Voice's abstract says it uses a 12.5Hz single-codebook speech tokenizer, synthesizes interleaved speech-text data from existing text corpora with a text-to-token model, and continues pretraining from GLM-4-9B. Moshi's abstract says it first predicts time-aligned text tokens as a prefix to the audio tokens, which it calls "Inner Monologue". The survey cited on PDF page 21 is [On The Landscape of Spoken Language Models](https://arxiv.org/abs/2504.08528).

## Realtime and full-duplex

PDF page 22 gives two definitions: **realtime** means short output latency; **full-duplex** means the model can talk back while still listening. The cited benchmark is [Full-Duplex-Bench](https://arxiv.org/abs/2503.04721).

- **Q11** asks which implementation choices give Moshi its low latency. Moshi's abstract reports a theoretical latency of 160ms and 200ms in practice.
- **Q12** asks which Moshi design choices enable full-duplex behavior. The abstract says it models its own speech and the user's speech as separate parallel streams, so it needs no explicit speaker turns.

The options mix in several mechanisms that sound plausible but aren't in the paper. For these two questions, check the paper's architecture sections; don't answer from the abstract alone.

## Rules and resources

- No plagiarism; cite resources. Don't share code or prediction files. Don't use closed-source LLM APIs such as GPT-4 or Gemini. Don't look for extra data or test answers. A first violation means 0 on that homework and the semester grade × 0.9; more than one means an F. (These are the generic rules on PDF page 29; a few clearly carry over from homeworks that upload prediction files.)
- Post questions in the NTU COOL HW10 discussion board first. The PDF says email subjects must start with `[GenAI-ML 2026 Fall HW10]`, which matches neither the course name nor the semester, so confirm on the discussion board before emailing.
- TA hours: before and after class on Fridays 5/29 and 6/5 in room 博理 112; on 6/12 they move to Google Meet.

## Going further

- **What to read first**: [Moshi](https://arxiv.org/abs/2410.00037) alone covers Q1, Q4, Q10, Q11, and Q12, and Mimi comes from the same work. Read its architecture sections first and the other papers go much faster.
- **Something to try tonight**: after running the detokenizer cell, change `num_quantizers` from 8 to 2, 4, 16, and 32, listen to the English speech and the music each time, and note the PESQ. You'll hear what "each RVQ layer fills in the residual" means.
- **Related reading**: to see how a cascade architecture works in a product, the site's [LiveKit Voice Agents](/posts/ai/2026-08-22-livekit-voice-agents-en) breaks down a streaming STT → LLM → TTS pipeline and interruption handling, a useful contrast with Moshi's full-duplex design.

## What this post could and couldn't verify

Verified: the full text and embedded links of hw10.pdf; the Colab's markdown and code (model IDs, layer sources, UMAP procedure, number of layers used for decoding, audio file list); the release date and TA list on the course page; the titles and uploaders of the TA video and the extra videos (YouTube oEmbed); and the titles and abstracts of the six papers (arXiv API).

Not verified: the TA video has no captions to pull, so this post doesn't transcribe it and any extra hints in it are missing. This post deliberately doesn't say which models Model A and Model B are in the homework repo, because that is the answer to Q2. The PDF gives no weight for Q9. No official answers have been released.

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) | Previous: [HW9: Flow Matching](/posts/ai/2026-09-30-ntu-ml2026-hw9-flow-matching-en) | This is the last post in the series

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [NTU Hung-yi Lee, Machine Learning 2026 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) (in Mandarin)
- [hw10.pdf (ML 2026 Spring HW10: Spoken Language Model)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw10.pdf)
- [HW10 Colab starter code](https://colab.research.google.com/drive/1QBtp0lQrjQbTKB1sLIxoavqhSU7EhG_g?usp=sharing)
- [Homework code repo: Tincan0325/26spring_ml_hw10_speech_model (GitHub)](https://github.com/Tincan0325/26spring_ml_hw10_speech_model)
- [TA video: ML 2026 Spring HW10 Spoken Language Model](https://youtu.be/Gx96VH6ePC4)
- [Extra: GenAI & ML Intro 2025, lecture 10](https://youtu.be/CbIPjrOj2Tc) (in Mandarin)
- [Extra: ML in the GenAI era 2025, lecture 12](https://youtu.be/gkAyqoQkOSk) (in Mandarin)
- [GenAI & ML Intro 2025, HW10](https://youtu.be/FDxg0mtFKZo) (in Mandarin)
- [Textually Pretrained Speech Language Models (arXiv 2305.13009)](https://arxiv.org/abs/2305.13009)
- [AudioLM: a Language Modeling Approach to Audio Generation (arXiv 2209.03143)](https://arxiv.org/abs/2209.03143)
- [LLaMA-Omni2: LLM-based Real-time Spoken Chatbot with Autoregressive Streaming Speech Synthesis (arXiv 2505.02625)](https://arxiv.org/abs/2505.02625)
- [Moshi: a speech-text foundation model for real-time dialogue (arXiv 2410.00037)](https://arxiv.org/abs/2410.00037)
- [Moshi technical report PDF (Kyutai)](https://kyutai.org/Moshi.pdf)
- [kyutai/mimi (Hugging Face)](https://huggingface.co/kyutai/mimi)
- [GLM-4-Voice: Towards Intelligent and Human-Like End-to-End Spoken Chatbot (arXiv 2412.02612)](https://arxiv.org/abs/2412.02612)
- [On The Landscape of Spoken Language Models: A Comprehensive Survey (arXiv 2504.08528)](https://arxiv.org/abs/2504.08528)
- [Full-Duplex-Bench (arXiv 2503.04721)](https://arxiv.org/abs/2503.04721)
- [EmoV-DB (OpenSLR 115)](https://www.openslr.org/115/)
- [Understanding UMAP (PAIR)](https://pair-code.github.io/understanding-umap/)
- [meta-llama/Llama-3.2-3B-Instruct (Hugging Face)](https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct)
