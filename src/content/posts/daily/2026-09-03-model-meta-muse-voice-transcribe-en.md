---
title: "Model Card｜Muse Voice Transcribe"
date: 2026-09-03
category: daily
tags: [ai-agent, model-release, daily, meta, model-family-muse]
lang: en
description: "Meta ships Muse Voice Transcribe, its first real-time audio perception model — a single model handling streaming ASR, 20+ speaker diarization, and endpointing, ranking #1 on Artificial Analysis streaming speech-to-text at 3.1% WER"
tldr: "Muse Voice Transcribe (muse-voice-transcribe-1.0): Meta Superintelligence Labs' first real-time audio perception model, launched 2026-09-01; closed-source, API-only, $0.18/hour of audio ($3.00 per 1,000 minutes); 3.1% final-transcript WER on streaming (#1 on Artificial Analysis AA-WER Streaming, ahead of Cartesia Ink-2's 3.4%), 0.16s delay from end-of-speech to final transcript; one model does ASR, 20+ speaker diarization, and endpointing together, replacing what used to require three separate systems"
series:
  name: "AI Model Tracker"
  order: 13
glossary:
  - term: "Muse"
    def: "Meta's multimodal AI model family, spanning Spark (text/multimodal LLM), Glimmer (local agentic model), and Voice (audio perception model) product lines"
---

> 🌏 [中文版](/posts/daily/2026-09-03-model-meta-muse-voice-transcribe)

## Model Information

| Field | Value |
|---|---|
| Model ID | `muse-voice-transcribe-1.0` |
| Vendor | Meta (Meta Superintelligence Labs) |
| Parameters | Undisclosed |
| Context Window | Not applicable — a real-time streaming ASR model, not a text context-window concept; WebSocket sessions cap at 60 minutes, single file uploads cap at 10 minutes of audio |
| Input pricing (USD/1M tokens) | Not applicable (billed by audio duration, not tokens — see below) |
| Output pricing (USD/1M tokens) | Not applicable; official rate is $0.18 per hour of audio (equivalent to $3.00 per 1,000 audio-minutes), with streaming, non-streaming, and ZDR (zero data retention) priced the same |
| Open source | No (no released weights, API-only) |
| Release date | 2026-09-01 |
| Official announcement | [Meta AI Research Blog: Introducing Muse Voice Transcribe](https://research.meta.ai/blog/introducing-muse-voice-transcribe) |
| HuggingFace | None (closed-source, available only via Meta Model API) |
| Family | Muse (shares lineage with the Muse Spark 1.x text models and the Muse Glimmer local model; Meta's first real-time audio perception model) |

## Highlights

- One model integrates streaming ASR, speaker diarization (20+ speakers), and endpointing, replacing what previously required stitching three separate systems together
- 3.1% final-transcript WER on streaming, ranking #1 on Artificial Analysis AA-WER Streaming, ahead of Cartesia Ink-2's 3.4%
- Only 0.16 seconds of delay from end-of-speech to final transcript, more than 2.5x faster than Cartesia Ink-2's 0.43 seconds, landing on the speed-accuracy Pareto front
- 17.5% average speaker-labelling error across three public diarization sets (AMI-IHM, AMI-SDM, VoxConverse), ahead of rival systems' 21.1%–28.6% (Meta's own evaluation)
- Trained on 70+ languages (25 extensively verified), with native in-sentence code-switching — mixed-language sentences are recognized correctly

## Benchmark Results

| Benchmark | Muse Voice Transcribe | Predecessor | Best competitor |
|---|---|---|---|
| Final-transcript streaming WER (AA-WER Streaming, lower is better) | 3.1% | None (Meta's first model of this kind) | Cartesia Ink-2 3.4% |
| Delay after end-of-speech (seconds, lower is better) | 0.16s | — | ElevenLabs Scribe v2 Realtime 0.14s (higher WER and pricier) |
| Diarization average error rate (AMI-IHM/AMI-SDM/VoxConverse average) | 17.5% | — | Rival systems 21.1%–28.6% (Meta's own evaluation) |
| API pricing (per 1,000 audio-minutes) | $3.00 | — | Cartesia Ink-2 $4.00; ElevenLabs Scribe v2 Realtime $6.50 |

⚠️ The streaming WER and delay figures come from a third party, Artificial Analysis' AA-WER Streaming benchmark; the diarization error figures are Meta's own self-reported evaluation and await independent third-party reproduction.

## vs. Predecessor / Competitors

This is Meta Superintelligence Labs' first real-time audio perception model, so there's no strict predecessor to compare against — the relevant baseline is the existing streaming ASR market.

Against Cartesia Ink-2, the closest competitor in the streaming ASR space, the WER gap is small (3.1% vs. 3.4%), but the latency gap is significant: 0.16s vs. 0.43s, more than 2.5x faster, which matters more directly for how natural real-time voice interaction feels. Pricing is also 25% cheaper ($3.00 vs. $4.00 per 1,000 minutes). Against ElevenLabs Scribe v2 Realtime, ElevenLabs answers faster (0.14s) but is less accurate and costs more than double ($6.50 vs. $3.00) — suggesting Meta is optimizing jointly for accuracy, latency, and price rather than maximizing any single metric.

The biggest differentiator is the "three-in-one" architecture: diarization, endpointing, and ASR share the same model and the same set of special tokens (`<|start_of_turn|>`, `<|speaker_A-Z|>`, `<|speech_onset|>`, `<|speech_endpoint|>`), with no need to bolt on a second or third model. Most competitors — including Cartesia, ElevenLabs, and Deepgram — haven't reached this level of integration; diarization is also included at the same rate rather than billed as a separate add-on, as some rivals charge for streaming diarization.

## What This Means for Agent Development

Building a voice agent used to mean wiring together ASR, VAD/endpointing, and diarization as three separate systems, with every hand-off adding latency and a chance for things to drift out of sync. Muse Voice Transcribe collapses that pipeline into a single API call that returns the transcript, speaker labels, and turn boundaries together.

- If you're building customer-support or meeting-notes agents: diarization is included at the same rate, and audio over an hour doesn't need to be split up client-side — a good fit for meeting transcription and call-quality analysis on long recordings
- If you're building real-time voice interaction agents (voice commands, AI-glasses assistants): the 0.16s delay plus "adaptive delay" (the model learns, via RL, how long to listen per word based on difficulty) gets closer to natural conversational rhythm than a fixed-buffer strategy
- Not a fit for: on-premise or self-hosted deployments, or audio that can't leave your own infrastructure (no open weights, API-only); also not a fit if you need word-level timestamps, emotion detection, or sound-event detection — the official docs explicitly say none of these are supported yet

## Today's Insight

I used to think the goal was simply the most accurate speech recognition model possible. But Muse Voice Transcribe's real design insight is treating delay itself as a variable the model can learn — using reinforcement learning so the model decides, per word, how much audio context it needs before committing to text, rather than an engineer hand-tuning a fixed buffer. That reframes latency as something a training objective can optimize, not just something architecture can shave down.

## References

- [Meta AI Research Blog: Introducing Muse Voice Transcribe](https://research.meta.ai/blog/introducing-muse-voice-transcribe)
- [Meta Model API docs: Speech to text (Muse Voice Transcribe)](https://dev.meta.ai/docs/speech-to-text)
- [MarkTechPost: Meta Superintelligence Labs Releases Muse Voice Transcribe](https://www.marktechpost.com/2026/09/01/meta-superintelligence-labs-releases-muse-voice-transcribe-one-real-time-model-for-streaming-asr-diarization-and-endpointing)
- [DataNorth AI: Meta launches Muse Voice Transcribe (with Cartesia Ink-2/ElevenLabs comparison table)](https://datanorth.ai/news/meta-launches-muse-voice-transcribe)
- [9to5Mac: Meta launches Muse Voice Transcribe for real-time voice dictation on Mac](https://9to5mac.com/2026/09/01/meta-launches-muse-voice-transcribe-for-real-time-voice-dictation-on-mac)
