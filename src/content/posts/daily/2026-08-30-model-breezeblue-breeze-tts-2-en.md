---
title: "Model Card｜BreezeBlue Breeze TTS 2"
date: 2026-08-30
category: daily
tags: [ai-agent, model-release, daily, breezeblue, model-family-breeze-tts]
lang: en
description: "BreezeBlue open-sources Breeze TTS 2, a real-time voice model that tops the open-weights TTS leaderboard (1,215 Elo) by bundling voice design, voice direction, and low-latency streaming into one model"
tldr: "Breeze TTS 2: open weights (Apache 2.0 code, research/non-commercial model license), #1 open-weights model on Artificial Analysis Provider Voices (1,215 Elo, +90 over Fish Audio S2 Pro), #1 on both Voice Design (Role Fit 78.02) and Voice Direction (4.25) benchmarks; TTFA p50 133.6ms / p95 163.3ms, RTF 0.32 on H100; hosted API priced at $34 per 1M characters (over 2x Fish Audio S2 Pro); supports 50 languages, commercial use requires a separate license from RESONIA, INC."
series:
  name: "AI Model Tracker"
  order: 10
glossary:
  - term: "Breeze TTS"
    def: "BreezeBlue's family of real-time interactive text-to-speech models, built around voice design, voice direction, and low-latency streaming"
---

> 🌏 [中文版](/posts/daily/2026-08-30-model-breezeblue-breeze-tts-2)

## Model Information

| Field | Value |
|---|---|
| Model ID | `BreezeBlue/Breeze-TTS-2` (hosted API model id `breeze-tts-2`) |
| Vendor | BreezeBlue (parent company RESONIA, INC.) |
| Parameters | Not fully disclosed; backbone is a Qwen3-architecture model at `llama-1B` scale (28 layers, hidden size 2048), plus a depth decoder (`llama-100M` scale), a T5Gemma2-based text encoder, and a Kyutai Mimi audio codec (24kHz, 32 quantizers) |
| Context Window | Not applicable (TTS model; streaming latency is the primary metric, not context length) |
| Input pricing (USD/1M tokens) | Not applicable; hosted API is priced at $34.00 / 1M characters |
| Output pricing (USD/1M tokens) | Not applicable (single billing dimension, same as above) |
| Open source | Yes (code under Apache License 2.0; model weights under the BreezeBlue Research and Non-Commercial License — commercial use requires separate authorization from RESONIA, INC.) |
| Release date | 2026-08-17 (official announcement/press release); weights and PyTorch inference code open-sourced 2026-08-25 |
| Official announcement | [Introducing Breeze TTS 2](https://breezeblue.ai/breeze-tts-2) |
| HuggingFace | [BreezeBlue/Breeze-TTS-2](https://huggingface.co/BreezeBlue/Breeze-TTS-2) |
| Family | Breeze TTS series (Breeze TTS 2 is the latest generation) |

## Highlights

- Tops the Artificial Analysis Provider Voices blind Speech Arena among open-weights models: 1,215 Elo, 90 points ahead of the previous open-weights leader Fish Audio S2 Pro (1,125 Elo), ranking #6 overall out of roughly 100 models (open and closed combined)
- #1 on BreezeBlue's own Voice Design benchmark (generating a voice from a text description with no reference audio): Role Fit score 78.02, 5.24 points ahead of runner-up MiMo-V2.5-TTS (72.78), and produces 39% more distinct voices (Voice Diversity 708) than the closest competitor
- #1 on the Voice Direction benchmark (steering tone, emotion, and pace via natural language while preserving a reference voice's identity): score 4.25, 13% ahead of runner-up MiMo-v2.5-TTS (3.76), while keeping speaker similarity (SPK_SIM) at 0.67
- Low-latency streaming: time-to-first-audio (TTFA) p50 133.6ms / p95 163.3ms, time-to-first-byte (TTFB) p50 119.4ms, and a warmed-up real-time factor (RTF) of 0.32 (~3.1x real time) on an H100 — faster than ElevenLabs Flash v2.5 and Fish Audio S2.1 Pro on the same latency benchmark
- Natural speech across 50 languages, with inline vocal-event tags — parentheses in English (e.g. `(sigh)`) or square brackets in Chinese (e.g. `[叹气]`) — for laughs, coughs, sighs, and similar cues embedded directly in the script

## Benchmark Results

| Benchmark | Breeze TTS 2 | Runner-up | Notes |
|---|---|---|---|
| Artificial Analysis Provider Voices (Elo, open weights) | 1,215 (#6 overall out of ~100 models) | Fish Audio S2 Pro: 1,125 | Each model uses its own native voices |
| Artificial Analysis Controlled Voices (Elo) | 1,002 (tied; #16/39 among open weights) | Voxtral TTS (Mistral): 1,010 | All models synthesize the same reference speaker; Breeze TTS 2 ties Fish Audio S2 Pro here |
| TTS Voice Design Benchmark (Role Fit) | 78.02 | MiMo-V2.5-TTS: 72.78 | BreezeBlue's own open-sourced benchmark |
| TTS Voice Direction Benchmark | 4.25 | MiMo-v2.5-TTS: 3.76 | BreezeBlue's own open-sourced benchmark; SPK_SIM 0.67 |
| Throughput (characters/second) | 45 | Fish Audio S2 Pro: 102 | Breeze TTS 2's throughput is less than half of the competitor's |

⚠️ Provider Voices / Controlled Voices Elo scores come from Artificial Analysis, an independent third-party blind arena, and carry higher confidence. The Voice Design / Voice Direction / Latency benchmarks are BreezeBlue's own — but with open-sourced evaluation code, not a black-box self-report — though they haven't yet seen large-scale independent reproduction. Throughput figures are sourced from AlphaSignal's reporting on Artificial Analysis data.

## Comparison with Predecessor/Competitors

Breeze TTS 2 is BreezeBlue's second generation, and this is the first time its weights have been made public (previously it was only available as a hosted commercial service). Compared to the incumbent open-weights leader Fish Audio S2 Pro, Breeze TTS 2 leads decisively (+90 Elo) in the "using its own designed voices" track, but only ties — and even trails Mistral's Voxtral TTS — on the Controlled Voices track, where every model synthesizes the same reference speaker. That split suggests Breeze TTS 2's edge isn't raw acoustic naturalness, but rather the product-oriented combination of voice design and voice direction — consistent with BreezeBlue's own positioning of the model for interactive voice experiences (game characters, digital companions, narrative content) rather than one-shot narration.

The trade-off is speed and price: throughput of 45 characters/second is less than half of Fish Audio S2 Pro's 102 characters/second, and the hosted API's $34 per 1M characters is more than double Fish Audio's $15 per 1M characters, and far above lightweight open-weights options like Kokoro 82M v1.0 at $0.65 per 1M characters. In short, Breeze TTS 2 trades throughput and cost for controllability and latency in voice design/direction — whether that trade is worth it depends on whether your application genuinely needs "a distinct voice per character" rather than simply high-throughput narration.

## Implications for Agent Development

Breeze TTS 2's positioning is clear: it's not a general-purpose narration tool, but a model built for agents and applications that need real-time interactive voice. A p50 TTFA of 133.6ms combined with a single WebSocket connection that streams continuously across multiple conversation turns (`connection.appendText()` / `flush()` / `endTurn()`) is an API design purpose-built for multi-turn voice agent conversations.

- If you're building game NPCs or digital companions: Voice Design lets you generate a character-specific voice from a text description (e.g. "a gravelly, world-weary storyteller") without a voice library, and a Voice Diversity score of 708 means you're less likely to collide on voices even with many characters
- If you're building customer service or multi-turn voice agents: Voice Direction lets you adjust tone in real time (e.g. shifting from confident to panicked) within the same voice identity, without redesigning the voice, and low-latency streaming suits real-time voice interaction
- Not a fit: high-throughput batch narration of long-form content (audiobooks, long-form voiceover) — at 45 characters/second and $34 per 1M characters, Breeze TTS 2 will be far more expensive than throughput-optimized models like Fish Audio S2 Pro or Kokoro; commercial deployment also requires separate authorization from RESONIA, INC. — only non-commercial testing is covered by the open weights license

## Today's Insight

Most TTS benchmarks historically measure just one thing: how human the speech sounds (naturalness). But Breeze TTS 2's split performance across two tracks — dominant on Provider Voices, merely tied on Controlled Voices — points to something easy to miss: "good" for a voice model isn't a single dimension. When the product need is "design a plausible-sounding voice for each character" rather than "mimic one specific real speaker," traditional speaker-similarity/naturalness evaluations may not even capture the real differentiator — which is presumably why BreezeBlue built and open-sourced its own Voice Design and Voice Direction benchmarks instead.

## References

- [BreezeBlue official announcement: Introducing Breeze TTS 2](https://breezeblue.ai/breeze-tts-2)
- [HuggingFace model card: BreezeBlue/Breeze-TTS-2](https://huggingface.co/BreezeBlue/Breeze-TTS-2)
- [GitHub: breezeblue-ai/breeze-tts](https://github.com/breezeblue-ai/breeze-tts)
- [AlphaSignal: BreezeBlue's Breeze TTS 2 Tops Open Weights Voice AI With 1,215 Elo](https://alphasignal.ai/news/breezeblue-s-breeze-tts-2-tops-open-weights-voice-ai-with-1-215-elo)
- [Artificial Analysis on X: Breeze TTS 2 ranking announcement](https://x.com/ArtificialAnlys/status/2092399623839326550)
- [Cincinnati Enquirer (press release): Breeze Blue Unveils Breeze TTS 2](https://www.cincinnati.com/press-release/story/110150/breeze-blue-unveils-breeze-tts-2-real-time-flagship-voice-ai-for-interactive-media/)
