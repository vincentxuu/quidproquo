---
title: "Audio Representation and ASR: From Samples to Text | CMU 10-423 Lecture 24"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 32
description: "Audio Representation and ASR: From Samples to Text | CMU 10-423 Lecture 24"
draft: false
---

> [繁體中文版](/posts/ai/2026-10-11-cmu10423-lecture-24a-audio-representation-asr)

**Video status: recordings require login or course authorization.** This guide uses the public slides for Lecture 24 of CMU 10-423 Spring 2026. Worked examples and variations are teaching additions.

A one-second recording at 16 kHz contains 16,000 amplitude samples. Treating them as text tokens misses the main difficulty: the same sentence produces different waveforms with different speakers and speaking rates. Speech recognition must preserve what was said without requiring identical signals. This guide covers representation and transcription; the next covers audio generation.

Prerequisites are vector shapes and the [encoder–decoder bridge](/posts/ai/2026-10-11-cmu10423-lecture-13-vision-language-en). Music theory is unnecessary.

## Samples become time–frequency features

A sample is an amplitude at one instant. Sample rate tells us how often amplitude is measured, not which word or pitch is present. Frequency structure comes from oscillations across a time interval.

The short-time Fourier transform takes a window, applies a window function, transforms it, and moves forward by a hop. Overlap prevents a boundary event from belonging to just one slice. Each window produces a frequency vector; stacking windows produces a spectrogram. Its values may represent magnitude or energy, depending on the definition.

A mel filter bank then aggregates frequency bins with weighted filters. The mel scale relates to auditory frequency perception; it is not a dictionary of words. Taking logs compresses dynamic range. A sample is an original time point, a frame is an analysis window, and a mel bin is a frequency aggregation. These are different units.

## A complete shape example

This is a teaching example, **not a reproduction of Whisper preprocessing**. Assume 16,000 mono samples, a 400-sample window and FFT, a hop of 160, no padding, and no centering. Window zero covers indices 0–399; the next covers 160–559. The last complete window must start at or before 15,600:

```text
frames = floor((16000 - 400) / 160) + 1 = 98
last start = 97 × 160 = 15520
last covered index = 15919
```

The remaining 80 samples do not form another complete window under these rules. A one-sided real FFT has 201 bins, including DC and Nyquist. Applying 80 mel filters changes the shape from `(98,201)` to `(98,80)`. One second is neither one frame nor 16,000 text tokens.

Now assume a temporal convolution with kernel 3, padding 1, and stride 2. Its output length is `floor((98+2−3)/2)+1=49`; the output channel count depends on the convolution. Those 49 positions are downsampled audio features, not 49 words. The Whisper paper uses 16 kHz audio, 25 ms windows, 10 ms hops, and 80-channel log-mel features. Its actual padding, segmentation, and boundary behavior must be checked in code rather than inferred from this no-padding example.

## Features become variable-length text

Whisper uses an encoder–decoder Transformer. The encoder processes audio features. The decoder reads the text prefix and accesses encoded audio through cross-attention. During training, the prefix comes from the reference transcript and the objective raises the probability of the next reference token. During inference, the prefix contains the model's own outputs.

Audio-feature length and text length need not match. The architecture does not require assigning each word to a sample beforehand. Task tokens can specify transcription, translation, or language. Translation into English is a different target from a verbatim source-language transcript and must be scored accordingly. Multitask training does not guarantee robustness to every accent, noise condition, or silent segment.

## Recognition needs a separate test

Consider the reference `we need two tickets` and the hypothesis `we need tickets now`. An optimal alignment deletes `two`, retains `tickets`, and inserts `now`: zero substitutions, one deletion, one insertion. With four reference words, WER is `(0+1+1)/4=0.5`. Semantic similarity does not erase edit errors. Tokenization, punctuation, and case normalization must be fixed before comparing systems, especially when word boundaries are not written explicitly.

Variation: change the hop to 320 while retaining the no-padding assumptions. The answer is `floor(15600/320)+1=49` frames, then 25 positions after the same convolution. A larger hop reduces temporal resolution; it does not improve frequency resolution, which still depends on the window and FFT. A separate question: adding one word to a four-word reference gives WER 1/4.

These questions test feature shapes and transcription errors separately. Plotting a spectrogram cannot substitute for ASR evaluation. A clean visualization proves that the signal was organized, not that the model understood it. Recognition must also be tested on held-out speakers, noise, and languages with fixed scoring rules.


## Continue reading

- [Previous](/posts/ai/2026-09-30-cmu10423-code-generation-agents-en)
- [Next](/posts/ai/2026-10-11-cmu10423-lecture-24b-audio-generation-en)

## Course video sources

The official [course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/) provides a Panopto recording link; access requires login or course authorization. This is a slide-based guide; it does not include a recording transcript, captions, or original-audio shadowing material.

## References

- [CMU Lecture 24 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture24-audio.pdf)
- [Whisper paper](https://arxiv.org/abs/2212.04356)
