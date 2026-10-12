---
title: "Audio Generation: Codec Tokens and Diffusion | CMU 10-423 Lecture 24"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 33
description: "Audio Generation: Codec Tokens and Diffusion | CMU 10-423 Lecture 24"
draft: false
---

> [繁體中文版](/posts/ai/2026-10-11-cmu10423-lecture-24b-audio-generation)

**Video status: recordings require login or course authorization.** This guide uses the public slides for Lecture 24 of CMU 10-423 Spring 2026. Worked examples and variations are teaching additions.

ASR maps audio to text. Text-to-speech must restore information that text omits: speaker identity, timing, intonation, and amplitude. “Okay” can sound enthusiastic or reluctant. Generation selects a plausible signal under a condition rather than inverting a unique transcript lookup table.

Prerequisites are [audio representation](/posts/ai/2026-10-11-cmu10423-lecture-24a-audio-representation-asr-en) and [diffusion](/posts/ai/2026-09-30-cmu10423-diffusion-models-en). We compare waveform prediction, discrete codec tokens, and continuous diffusion targets using one second of audio.

## Predicting individual samples

WaveNet factorizes waveform probability into conditional probabilities for successive samples. Causal dilated convolutions access past samples without exposing future ones during training. Dilation expands the receptive field without requiring a huge kernel in every layer.

At 16 kHz, one second requires 16,000 sample-level decisions. Sentence content changes over much longer intervals. Waveform generation is possible, but it must handle a long sequence and fine acoustic variation simultaneously. A compressed representation lets the generator operate on fewer units.

## A codec is not a composer

A neural codec encodes a waveform into continuous features, quantizes those features into codebook indices, and decodes them back to audio. An index is not inherently a syllable. Residual vector quantization successively quantizes the error left by earlier codebooks.

A separate generator learns which indices should follow, conditioned on earlier tokens and possibly text or an audio prefix. The codec defines the representation; the generator chooses symbols; the decoder reconstructs sound. Training a codec to reconstruct input does not teach it to generate speech matching a text prompt.

AudioLM separates semantic and acoustic tokens to handle slower content and finer acoustic information hierarchically. It is not simply a language model over every mel bin, and semantic tokens are not guaranteed verbatim transcript labels.

## A complete token budget

Assume a teaching codec produces 50 frames per second, with two codebooks per frame and 1,024 entries per codebook. This is an illustrative configuration, not a product specification. A 16,000-sample input becomes a `(50,2)` array of indices. Flattening in frame-then-codebook order gives 100 indices. Each fixed-length index needs `log2(1024)=10` bits, so the ideal rate is `50×2×10=1000` bits/s.

This excludes packets, model storage, and entropy coding. Sixteen-bit mono PCM at 16 kHz uses `16000×16=256000` bits/s. The 256-fold ratio is a rate comparison for these assumptions, not a guarantee of unchanged quality. Nor do 100 index decisions mean only 100 operations: encoder, decoder, and Transformer computation have their own costs.

An audio prompt containing the first 20 frames supplies 40 indices. Completing the remaining 30 frames requires 60 indices. The decoder should then reconstruct a one-second signal. Incorrect ordering can corrupt the audio despite correct dimensions, so shape checks must be accompanied by listening and measurement.

## Diffusion uses a different axis

A diffusion model can target mel features, continuous codec latents, or waveforms. Training corrupts a clean representation at varying noise levels and learns conditional denoising. Sampling reverses this process from noise. Mel output usually requires a vocoder because magnitude/mel features do not retain full phase information. Latent diffusion uses the decoder appropriate to its latent representation.

Denoising steps are not audio time steps. Twenty iterations may update the whole latent sequence, whereas 100 autoregressive indices refer to sequence positions. Step counts alone do not establish latency or quality advantages.

## Variations and evaluation

Keep 50 frames/s but use four 512-entry codebooks. The answer is 200 indices/s and `50×4×9=1800` ideal bits/s. Two seconds contain 400 indices. Decoding only the first codebook does not guarantee the same quality: the decoder must support that configuration, and distortion must be measured.

If correctly shaped tokens ignore the text prompt, which component failed? Conditional control in the generator is the first suspect. If encoding and decoding real audio already produces distortion, the codec also has a reconstruction problem. Evaluate those separately. With fixed prompts and varied seeds, assess content accuracy, speaker consistency, noise, and perceived naturalness. Good reconstruction, pleasant sound, and correct spoken content are separate pieces of evidence.


## Continue reading

- [Previous](/posts/ai/2026-10-11-cmu10423-lecture-24a-audio-representation-asr-en)
- [Next](/posts/ai/2026-10-11-cmu10423-lecture-25-video-generation-en)

## Course video sources

The official [course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/) provides a Panopto recording link; access requires login or course authorization. This is a slide-based guide; it does not include a recording transcript, captions, or original-audio shadowing material.

## References

- [CMU Lecture 24 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture24-audio.pdf)
- [AudioLM](https://arxiv.org/abs/2209.03143)
- [SoundStream](https://arxiv.org/abs/2107.03312)
- [WaveNet](https://arxiv.org/abs/1609.03499)
