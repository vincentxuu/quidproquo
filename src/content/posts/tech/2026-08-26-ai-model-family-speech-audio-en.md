---
title: "Speech and Audio Model Families: From Open Whisper ASR to Eleven v4 and GPT-Live—How to Choose for Transcription, Synthesis, Live Voice, and Music"
date: 2026-08-26
category: tech
tags: [whisper, elevenlabs, text-to-speech, speech-to-text, kokoro, voice-cloning, model-family-speech]
lang: en
type: deep-dive
tldr: "As of November 2026, speech models split into four lines. Transcription (ASR): on Artificial Analysis AA-WER v2.2, Alibaba's Fun-Realtime-ASR-preview has the lowest error rate (1.7%) and ElevenLabs Scribe v3 is second (1.9%); the best open-weight model is Salesforce SOV-Transcribe-1 (2.3%, Apache 2.0), with Voxtral Small and Nemotron 3.5 Transcribe tied behind it (2.8%), while Whisper Large v3 sits around 4.1% as the old baseline. Speech synthesis (TTS): Eleven v4 and v4 Turbo tie for first, with Turbo at half the price; the top open-weight model is Fish Audio Drama 3, whose license allows free commercial use only below USD 500,000 in annual revenue. Live voice: OpenAI now leads with full-duplex GPT-Live-1 ($0.05 per minute), and Google offers Gemini 3.8 Live. Music: Suno v6 tops the AA instrumental board."
description: "November 2026 guide to speech and audio models: the AA-WER v2.2 transcription board and open-weight ASR after Whisper (SOV-Transcribe-1, Voxtral, Nemotron 3.5 Transcribe), Eleven v4, Scribe v3, and ElevenLabs pricing, licenses for open TTS such as Fish Audio Drama 3 and Kokoro, GPT-Live-1 and Gemini 3.8 Live, Suno v6 music generation, and a timeline from Whisper to Eleven v4."
series:
  name: "AI Model Families"
  order: 17
draft: false
glossary:
  - term: "WER"
    aliases: ["Word Error Rate", "字錯誤率"]
    definition: "The core speech-recognition metric: errors as a share of words in a human reference transcript; lower is better. Languages without space-delimited words, including Chinese and Japanese, often use CER instead."
  - term: "ASR"
    aliases: ["Automatic Speech Recognition", "自動語音辨識"]
    definition: "Converting audio into text. Whisper, Scribe, Voxtral, and Nemotron Transcribe belong to this line."
  - term: "TTS"
    aliases: ["Text-to-Speech", "語音合成"]
    definition: "Converting text into speech. The main evaluation is an Elo ranking from blind human listening battles; Eleven v4, Fish Audio Drama 3, and Kokoro belong here."
  - term: "零樣本語音複製"
    aliases: ["zero-shot voice cloning"]
    definition: "Synthesizing a speaker after only seconds of reference audio, without retraining. Eleven v4 Instant Voice Clone needs about 10 seconds and Chatterbox about five."
  - term: "全雙工"
    aliases: ["full duplex"]
    definition: "A voice model that listens while it speaks, so it can react to interruptions, backchannels, and pauses without waiting for a turn to end. GPT-Live-1 is one."
---

> :globe: [中文版](/posts/tech/2026-08-26-ai-model-family-speech-audio)

Speech model selection breaks into four problems: turning audio into text (ASR), reading text aloud (TTS), letting an agent talk with people directly (live voice), and generating music. This article is for developers adding speech to an agent or content product. It helps you decide which API or open-weight model to use for transcription, which TTS to use for dubbing and voice agents, which architecture to use for live conversation, and which open weights cannot actually be used commercially as-is. Leaderboards and prices are as of 2026-11-23; cite them with the date.

For benchmark interpretation, see the [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en); the cross-task tables are in the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en).

## The current selection map

| Task | API first choice | Open-weight first choice | Key difference |
|---|---|---|---|
| Batch transcription | Fun-Realtime-ASR-preview (Alibaba), Scribe v3 (ElevenLabs), MAI-Transcribe-2 (Microsoft) | SOV-Transcribe-1 (Apache 2.0), Voxtral Small (Apache 2.0), Nemotron 3.5 Transcribe (OpenMDW-1.1) | Top three APIs are at 1.7%–2.0%; the best open weights reach 2.3%, Whisper Large v3 about 4.1% |
| Speech synthesis | Eleven v4 / v4 Turbo | Fish Audio Drama 3 (revenue threshold), Kokoro 82M (Apache 2.0) | v4 Turbo ties v4 at half the price; Drama 3 is high quality but 35B parameters, Kokoro is cheap but cannot clone voices |
| Live voice | GPT-Live-1, Gemini 3.8 Live, Eleven Realtime v1 | A self-assembled cascade (open ASR + LLM + TTS) | Billing units differ: GPT-Live per minute, Gemini Live per token with the whole context re-billed each turn |
| Music | Suno v6 | Nothing close to the front | Suno v6 scores 1148 instrumental Elo; third place onward trails by more than 60 points |

## ASR: after Whisper, transcription became a language-model job

### The November 2026 AA-WER board

| Model | AA-WER | Type | Per 1,000 minutes | Positioning |
|---|---|---|---|---|
| Fun-Realtime-ASR-preview | 1.7% | Closed API | $2.82 | Alibaba, lowest error rate |
| Scribe v3 | 1.9% | Closed API | $3.33 | ElevenLabs, launched 2026-11-10 |
| MAI-Transcribe-2 | 2.0% | Closed API | $1.67 | Microsoft, about 340× real time |
| Voxtral Small Transcribe 3 | 2.1% | API | $4.00 | Mistral |
| SOV-Transcribe-1 | 2.3% | Open weights, Apache 2.0 | — | Salesforce, best open-weight model |
| Voxtral Small | 2.8% | Open weights, Apache 2.0 | $4.00 | Mistral, 24B |
| Nemotron 3.5 Transcribe | 2.8% | Open weights, OpenMDW-1.1 | $2.00 | NVIDIA, 34B (4.3B active) |
| GPT Transcribe | 3.3% | Closed API | $4.50 | OpenAI |
| Whisper Large v3 | About 4.1% | Open weights, MIT | From $1.15 | Old baseline with the broadest tooling; 4.1%–4.5% across providers |
| Parakeet TDT 0.6B V3 | 4.5% | Open weights | $1.50 | NVIDIA, about 628× real time, fastest |

(AA-WER v2.2 from [Artificial Analysis Speech to Text](https://artificialanalysis.ai/speech-to-text), 2026-11-23. It measures mostly English non-streaming transcription over about eight hours of audio: voice-agent conversations (50%), European Parliament speeches and earnings calls (25% each). Prices are for the providers listed on the board; self-hosting open weights is costed separately.)

Read the board two ways. First, the API front is packed around 2%, a gap smaller than what a change in recording conditions produces, so latency, price, and diarization matter more than 0.2 points on the board. ElevenLabs says Scribe v3 makes 27% fewer word errors than Scribe v2 (FLEURS, 102 languages, vendor-measured) and fewer diarization errors; Microsoft's MAI-Transcribe-2 trades a little accuracy for the lowest price and highest speed. Second, the distance between open weights and APIs has shrunk to under half a point: self-hosting no longer means clearly worse transcripts.

### The new open-weight shape: speech encoder plus MoE language model

Whisper is an encoder-decoder: an audio encoder reads 30-second log-Mel spectrograms and a small decoder autoregressively emits text. The models that reached the open-weight front in late 2026 instead pair a speech encoder with a large language model:

- **[SOV-Transcribe-1](https://huggingface.co/salesforce-sovereign-intelligence/SOV-Transcribe-1)** (Salesforce, 2026-11): Whisper large-v3's audio encoder feeding Gemma 4 26B A4B, an MoE language model, for 26.6B total and 4.6B active parameters. It supports English, French, German, Spanish, Italian, Portuguese, and Dutch, has been tested on up to 30 minutes of audio, and accepts natural-language instructions for verbatim or cleaned transcripts plus context biasing with proper nouns. Whisper's encoder survives here; the decoder is what got replaced.
- **[Nemotron 3.5 Transcribe](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Transcribe-30B-A4B)** (NVIDIA, 2026-10): a Mamba-2/Transformer hybrid MoE language model with ASR and speaker encoders, 34B total and 4.3B active. It covers 40 languages and recordings up to one hour, and besides transcription does speaker attribution, speech translation, timestamps, and audio question answering on one H100 80GB. Its place in NVIDIA's lineup is covered in the [Nemotron family article](/posts/tech/2026-10-10-ai-model-family-nemotron-en).
- **[Voxtral Small](https://huggingface.co/mistralai/Voxtral-Small-24B-2507)** (Mistral, 2025-07): 24B and Apache 2.0, the oldest of the three with the simplest license; Mistral's later Voxtral 3 transcription models are API products, see the [Mistral family article](/posts/tech/2026-08-24-ai-model-family-mistral-en).

The cost is size: Whisper Large v3 is 1.55B, while these three range from 24B to 34B total parameters and need data-center GPUs to self-host. For pure throughput, the 0.6B Parakeet TDT V3 is still the fastest option, at roughly Whisper-level accuracy.

### Whisper: the open line stopped at turbo

Whisper's open weights stopped at large-v3-turbo in 2024-09 (decoder cut from 32 to 4 layers, about 8× faster, with larger regressions in Thai and Cantonese). No open weights have followed; the last GitHub release was a 2025-06 package update. OpenAI's transcription moved to closed APIs: [current prices](https://developers.openai.com/api/docs/pricing) are $0.0045 per minute for gpt-transcribe, $0.006 for gpt-4o-transcribe, and $0.003 for mini, with live transcription through gpt-live-transcribe and gpt-realtime-whisper at $0.017 per minute. Whisper's value now is its ecosystem: nearly every speech tool supports it and it has the most quantized and accelerated variants, but on AA-WER it trails the front by about two points.

## TTS: Eleven v4 retakes first, and open weights need a license check

### The November 2026 TTS board

| Model | AA Elo | Type | Per 1M characters | Positioning |
|---|---|---|---|---|
| Eleven v4 Turbo | 1340 | Closed API | $40 | ElevenLabs, for live agents, tied first with v4 |
| Eleven v4 | 1340 | Closed API | $80 | ElevenLabs, for content production |
| StepAudio 3 TTS | 1307 | Closed API | $14 | StepFun |
| Qwen-Audio-3.1-TTS-Plus | 1298 | Closed API | $19.31 | Alibaba |
| Simba 3.5 | 1293 | Closed API | $6.58 | Cheapest near the top |
| Gemini 3.8 Flash TTS | 1282 | Closed API | $16.49 | Google |
| Fish Audio Drama 3 | 1277 | Open weights (Fish Audio Community License) | $15 | Best open-weight model |
| Breeze TTS 2 | 1228 | Open weights (weights noncommercial) | $34 | Third among open weights |
| Eleven v3 | 1191 | Closed API | $100 | Previous generation, now 24th |
| Kokoro 82M v1.0 | 1060 | Open weights, Apache 2.0 | $0.65 | Among the cheapest on the board, self-hostable |

(Elo from the Provider Voice board of the [Artificial Analysis Text to Speech Leaderboard](https://artificialanalysis.ai/text-to-speech/leaderboard), 2026-11-23, anchored at Zonos-v0.1 = 1000. It compares each provider's built-in voices and does not test cloning; open-weight prices are the hosted prices listed on the board.)

### ElevenLabs: v4 brings a new architecture at v3's price

[Eleven v4 and v4 Turbo](https://elevenlabs.io/blog/eleven-v4) launched on 2026-09-28 on what ElevenLabs calls an entirely new architecture. Compared with v3, four changes affect selection:

- **v4 Turbo brings top quality to live agents.** Median inference latency is about 100ms and time to first speech about 150ms (vendor-measured); it ties v4 on the board at half the price ($0.04 versus $0.08 per 1,000 characters). In the v3 era, live use meant falling back to Flash v2.5, which now scores 1075.
- **Faster cloning.** Instant Voice Clone needs about 10 seconds of reference audio; Professional Voice Clone, unsupported in v3, returns in v4.
- **90+ languages, deliberately without carrying the source accent across languages.** The [docs](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/eleven-v4) explain that a voice cloned from a Korean speaker generating English will speak fluent native English, not Korean-accented English. That helps localization; if your product depends on carrying one accent into other languages, test before migrating.
- **Audio tags remain, and ElevenLabs admits they are not perfect yet.** Tags such as `[laughs]`, `[whispers]`, and sound effects can be stacked, and v4 follows them more accurately than v3.

On the [API pricing page](https://elevenlabs.io/pricing/api), v4 and v3 both cost $0.08 per 1,000 characters, and v4 Turbo and the Flash/Turbo line cost $0.04. AA's $100 listing for v3 differs from the pricing page; use the pricing page. At company level, a $300 million employee tender on 2026-09-30 [valued ElevenLabs at $22 billion](https://elevenlabs.io/blog/tender-22bn), double its February Series D, with enterprise customers at 55% of revenue. It still sells a suite: TTS, Scribe transcription, the ElevenAgents platform, Realtime voice, sound effects, and music.

### Open-weight TTS: pick two of quality, license, and maintenance

| Model | Parameters | Weight license | Cloning | Status |
|---|---|---|---|---|
| [Fish Audio Drama 3](https://huggingface.co/fishaudio/drama-3) | 35B (3B active) | Fish Audio Community License | ✓ | 2026-10, best open-weight model; multi-speaker dialogue with up to 16 characters |
| Breeze TTS 2 | — | Weights noncommercial; commercial use needs a separate license | ✓ | 2026-08, strong voice design and direction, low throughput |
| [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) | 82M | Apache 2.0 | ✗ | No new version since 2025-01; faster than real time on ordinary CPUs |
| [Chatterbox](https://github.com/resemble-ai/chatterbox) | 0.5B | MIT | ✓ (about 5s) | Unmaintained since 2026-08, archive only; outputs watermarked by default |
| Voxtral 4B TTS | 4B | CC-BY-NC 4.0 | ✓ | Mistral; weights noncommercial, commercial use through the API |
| XTTS v2 (Coqui) | About 467M | CPML (noncommercial) | ✓ (about 6s) | Coqui closed in 2024; no path to a commercial license |

**Fish Audio Drama 3 is the strongest open-weight model, but not unconditionally commercial.** Its [LICENSE](https://huggingface.co/fishaudio/drama-3/blob/main/LICENSE) is the Fish Audio Community License dated 2026-10-13: free for research and noncommercial use; free commercial use for companies with annual revenue below USD 500,000; any other commercial use, or offering it as a hosted service, requires a separate agreement. The Hugging Face license field still says research license; the LICENSE file governs. The Fish Speech GitHub repo now uses the same license. Architecturally it is a 35B-total MoE with 3B active per token, and a single stream gets first audio in under 100ms on an H200, but deployment is far heavier than the roughly 500M previous-generation Fish Speech.

**Chatterbox went from the practical commercial cloning pick to an archive.** In 2026-08 Resemble AI retired the Chatterbox line and moved to deepfake detection: code and weights stay public under MIT, with no support, updates, or paid tier. June's Multilingual V3 (0.5B, 25 languages) is the final release, and all self-hosted output embeds a PerTh watermark by default. Using it now means owning maintenance yourself.

**Kokoro is still the answer for offline narration.** At 82M parameters, Apache 2.0, and faster than real time on ordinary CPUs, its 1060 score makes it one of the few open-weight options that is both directly commercial and cheap enough to ignore cost; it cannot clone voices.

The licensing rule has not changed: a code license is not a weight license (F5-TTS and MaskGCT have MIT code but CC-BY-NC weights), and one company's models can carry different licenses (Mistral's Voxtral Small is Apache 2.0, Voxtral 4B TTS is CC-BY-NC). Reread the weight LICENSE file at every version change.

## Live voice: three architectures

The old approach chained ASR→LLM→TTS (a cascade), and latency and tone both suffered at each handoff. In late 2026 vendors offer three different answers, which OpenAI's [voice agents guide](https://developers.openai.com/api/docs/guides/voice-agents) also lays side by side:

- **A full-duplex voice layer plus a separate backend: GPT-Live-1.** [Launched in the API on 2026-09-10](https://openai.com/index/introducing-gpt-live-1-in-the-api/), it listens while speaking and delegates reasoning and tool calls to a backend you choose (an OpenAI Responses model or any agent of your own). Billing covers only the voice layer: $0.05 per active minute and $0.02 while WebRTC inference is paused, with the backend billed separately; it supports WebRTC, WebSocket, and SIP telephony. The benefit is that an existing text agent stays as it is and only the voice interface changes.
- **A single speech-to-speech model: gpt-realtime-2.1, Gemini 3.8 Live.** One model listens, reasons, and speaks. OpenAI's gpt-realtime-2.1 costs $32/$64 per million audio tokens, mini $10/$20. Google's [Gemini 3.8 Live](https://blog.google/innovation-and-ai/technology/developers-tools/build-real-time-voice-applications-gemini-audio/) (2026-09-15) costs about $0.005 per minute of audio input and $0.018 per minute of output, with an Extended Thinking variant for adjustable reasoning; but the [Live API re-bills the whole session context every turn](https://cloud.google.com/model-garden/pricing), and proactive audio is always on, so listening time counts as input. Long conversations cost far more than the per-minute rate suggests.
- **The cascade taken to its limit: ElevenLabs.** Eleven v4 Turbo + Scribe v3 Live + ElevenAgents, or [Eleven Realtime v1 Mini/Max](https://elevenlabs.io/pricing/api) ($0.08 per minute plus LLM usage, compatible with the OpenAI Realtime interface). When the voice itself is the product—a brand voice or character—this route gives the most control.

On evaluation, the top five models on the reasoning task (Big Bench Audio) of [Artificial Analysis Speech to Speech](https://artificialanalysis.ai/speech-to-speech) all exceed 98.8%, and the top five on conversational dynamics (Full Duplex Bench) all exceed 96.9%, with GPT-Live-1 among the latter. The front is too close for benchmarks to decide; architecture, billing model, and telephony integration do.

## Music generation: Suno v6 leads by a margin

| Model | AA Elo (instrumental) | Developer |
|---|---|---|
| Suno v6 | 1148 | Suno |
| Suno v6-mini | 1114 | Suno |
| Mureka V9.5 | 1084 | Mureka |
| Lyria 3 Pro | 1080 | Google |
| Eleven Music | 1021 | ElevenLabs |
| MiniMax Music 3.0 | 1000 | MiniMax (board anchor) |
| MusicGen | 868 | Meta, open weights, last place |

([AA-Music-Instrumental v1.1](https://artificialanalysis.ai/music/leaderboard/instrumental), 2026-11-23. A separate vocal board may rank differently.)

[Suno v6](https://suno.com/blog/introducing-v6) (2026-09-09) comes as v6, the more experimental v6-wild, and v6-mini for all users. It can rewrite one section of a song from natural language, mash up elements from several songs, and use images or video as references. It was developed with Warner, BMG, and Believe, and older models are being retired; but Suno has not published training-data details, and [lawsuits from Sony and Universal are still ongoing](https://techcrunch.com/2026/09/09/suno-replaces-its-ai-models-with-a-new-one-trained-on-licensed-music-as-copyright-suits-pile-up/), so read the terms before commercial use. To wire music into a product through an API, ElevenLabs' Eleven Music at $0.15 per minute is a ready option, with quality below the second tier.

## Timeline

| Date | Event | What it changed for selection |
|---|---|---|
| 2022-09 | [Whisper](https://github.com/openai/whisper) open-sourced under MIT, up to 1.55B | Near-SOTA transcription ran on a laptop and pushed commercial ASR prices down |
| 2023-11 | Whisper large-v3 (Mel 80→128 bins) | Broad multilingual error reductions; the open baseline for the next two years |
| 2024-09 | large-v3-turbo ([decoder 32→4 layers](https://github.com/openai/whisper/discussions/2363)) | About 8× faster, and the last open-weight Whisper |
| 2025-01 | Kokoro-82M | Showed 82M parameters can deliver commercial narration-grade TTS |
| 2025-03 | Closed [gpt-4o-transcribe](https://openai.com/index/introducing-our-next-generation-audio-models/) | OpenAI transcription moved to APIs; NVIDIA, Mistral, and others took the open frontier |
| 2026-02 | Eleven v3 GA; [$500M Series D at $11B](https://elevenlabs.io/blog/series-d) | v3 audio tags made directing delivery a standard TTS interface |
| 2026-08 | [Breeze TTS 2](/posts/daily/2026-08-30-model-breezeblue-breeze-tts-2-en) open weights; Chatterbox unmaintained | The open TTS front shifted to research or threshold licenses |
| 2026-09 | [Meta Muse Voice Transcribe](/posts/daily/2026-09-03-model-meta-muse-voice-transcribe-en), [GPT-Live-1](/posts/daily/2026-09-11-ai-agent-daily-en), [Gemini 3.8 Live](/posts/daily/2026-09-16-ai-agent-daily-en), Suno v6, Eleven v4 | Live voice moved from cascades to full duplex; TTS first place returned to ElevenLabs |
| 2026-10 | Fish Audio Drama 3; [Nemotron 3.5 Transcribe](/posts/daily/2026-10-29-ai-agent-daily-en); [Phonic-1](/posts/daily/2026-10-31-funding-phonic-en) | Open-weight ASR became speech encoder + MoE language model |
| 2026-11 | Scribe v3, SOV-Transcribe-1 | The gap between API and open-weight transcription narrowed to under half a point |

For the streaming-transcription branch, see the [Audio8 ASR Infinite](/posts/daily/2026-09-28-model-edge0-audio8-asr-infinite-en) model card: it far outperforms the streaming Voxtral and Nemotron models on Chinese CER, but its decoder inherits a noncommercial Qwen license.

## Licensing and pricing

| Provider | Representative | License | Price | Best for |
|---|---|---|---|---|
| OpenAI Whisper | large-v3 / turbo | **MIT, self-hostable weights** | Your GPU | Local transcription, broadest tooling |
| Salesforce | SOV-Transcribe-1 | **Apache 2.0** | Your GPU (26.6B) | Highest self-hosted accuracy, seven European languages |
| NVIDIA | Nemotron 3.5 Transcribe | OpenMDW-1.1 | Your GPU (1×H100) | 40 languages, speaker attribution, long recordings |
| ElevenLabs | Scribe v3 / v3 Live | Closed | $0.20 / $0.22 per hour | Accurate transcription and diarization |
| OpenAI API | gpt-transcribe | Closed | $0.0045 per minute | Batch transcription inside the OpenAI ecosystem |
| ElevenLabs | Eleven v4 / v4 Turbo | Closed | $0.08 / $0.04 per 1,000 characters | Dubbing, voice agents |
| Fish Audio | Drama 3 | Community License (commercial below USD 500,000 revenue) | Self-host or $15 per 1M characters | High-quality self-hosted TTS for small teams |
| Kokoro | 82M v1.0 | **Apache 2.0** | Free, CPU-capable | Offline narration, edge devices |
| OpenAI | GPT-Live-1 | Closed | $0.05 per minute (backend extra) | Full-duplex phone and app voice agents |
| Google | Gemini 3.8 Live | Closed | Audio about $0.005 / $0.018 per minute, context re-billed per turn | High-volume, short-turn app voice |
| Suno | v6 | Subscription | Pro / Premier plans | Music creation |

## Selection for four agent scenarios

**Batch transcription:** for the most accurate API, use Fun-Realtime-ASR-preview or Scribe v3; for cheap and fast, MAI-Transcribe-2. To self-host, start with language: for English and major European languages, SOV-Transcribe-1 is most accurate; for 40 languages, speaker attribution, or hour-long recordings, Nemotron 3.5 Transcribe; for the simplest license and lowest deployment bar, Voxtral Small or Whisper. The board is mostly English, so test CER on your own Chinese recordings.

**Dubbing and content:** for quality, choose Eleven v4, and test the new cross-language accent behavior before multilingual dubbing; use Kokoro for high-volume offline narration; to self-host with cloning, Fish Audio Drama 3 works directly below USD 500,000 in annual revenue, and above that you negotiate a license or return to ElevenLabs Instant/Professional Voice Clone.

**Live voice:** if you already have a text agent and want a voice interface, GPT-Live-1 leaves the backend untouched; for one model at the lowest unit price, Gemini 3.8 Live, but first estimate the bill with your own conversation lengths after context re-billing; when the voice is the product, ElevenLabs v4 Turbo + ElevenAgents. A fully self-hosted cascade (Nemotron or Voxtral + an open LLM + Kokoro) is cheapest, and you own the latency engineering.

**Music:** for the best output, Suno v6; to integrate through an API, Eleven Music. Check commercial terms for generated content in both cases.

## Limitations and trade-offs

- **The boards lean English.** AA-WER uses three mostly English datasets, and the TTS board compares built-in voices; Chinese transcription, cloning quality, and accent consistency are not on the boards.
- **Vendor numbers do not mix with board numbers.** Scribe v3's "27% fewer errors" and Eleven v4's "75% blind preference" are vendor-measured under conditions that differ from AA's.
- **The new open-weight front is large.** SOV-Transcribe-1, Nemotron 3.5 Transcribe, and Fish Audio Drama 3 are all in the 26B–35B class; "self-hostable" does not mean "cheap to deploy."
- **Licenses and maintenance status change.** Chatterbox went from popular to archived within a year, and Fish Speech moved from a research license to the Community License; check both the license file and repo maintenance status again before launch.
- **Live voice bills differ in structure.** Per-minute, per-token, and per-turn context re-billing cannot be compared by unit price; compute with your own typical call length.

---

## Update history

- 2026-11-23: Replaced the whole article with November 2026 data and reorganized it. ASR now uses the AA-WER v2.2 board (previously v2.0) and adds Scribe v3, SOV-Transcribe-1, Nemotron 3.5 Transcribe, and a section on open-weight transcription becoming speech encoder + MoE language model; TTS now covers Eleven v4/v4 Turbo and the November Provider Voice board, with open weights rewritten around Fish Audio Drama 3, Kokoro, and the now-unmaintained Chatterbox; live voice is rewritten as three architectures (GPT-Live-1, gpt-realtime-2.1 and Gemini 3.8 Live, and Eleven Realtime); added a music generation section (Suno v6) and a timeline, moving Whisper version details and the ElevenLabs v3 era into the timeline with links to the daily model cards from that time. Corrected errors in the earlier version: ElevenLabs pricing (v3 is $0.08 and Flash $0.04 per 1,000 characters, not $0.10/$0.05), Fish Speech now uses the Community License (commercial use for small companies, not a blanket ban), removed the "fourteenth article" ordinal that did not match the series order, and removed a Realtime per-minute estimate that had no calculation basis.
- 2026-10-11: Normalized series metadata and end-section ordering; retained the existing comparison hierarchy, sources, and dates. No fresh fact-check was performed.

## References

- [Speech to Text Leaderboard (AA-WER v2.2) — Artificial Analysis](https://artificialanalysis.ai/speech-to-text) — transcription error rate, speed, and price
- [Text to Speech Leaderboard — Artificial Analysis](https://artificialanalysis.ai/text-to-speech/leaderboard) — TTS Provider Voice Elo and price
- [Speech to Speech — Artificial Analysis](https://artificialanalysis.ai/speech-to-speech) — reasoning and conversational-dynamics evaluation for live voice models
- [AA-Music-Instrumental v1.1 — Artificial Analysis](https://artificialanalysis.ai/music/leaderboard/instrumental) — instrumental music Elo
- [SOV-Transcribe-1 — Hugging Face](https://huggingface.co/salesforce-sovereign-intelligence/SOV-Transcribe-1) — architecture, parameters, languages, Apache 2.0
- [NVIDIA Nemotron 3.5 Transcribe — Hugging Face](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Transcribe-30B-A4B) — architecture, languages, deployment, OpenMDW-1.1
- [Voxtral-Small-24B-2507 — Hugging Face](https://huggingface.co/mistralai/Voxtral-Small-24B-2507) — Apache 2.0 weights
- [openai/whisper — GitHub](https://github.com/openai/whisper) — model sizes and release history
- [Robust Speech Recognition via Large-Scale Weak Supervision (arXiv:2212.04356)](https://arxiv.org/abs/2212.04356) — original Whisper paper
- [large-v3-turbo model release — openai/whisper Discussion #2363](https://github.com/openai/whisper/discussions/2363) — decoder 32→4 layers
- [Introducing next-generation audio models in the API — OpenAI](https://openai.com/index/introducing-our-next-generation-audio-models/) — gpt-4o-transcribe launch
- [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing) — transcription, Realtime, and GPT-Live pricing
- [Build more natural voice experiences with GPT-Live-1 in the API — OpenAI](https://openai.com/index/introducing-gpt-live-1-in-the-api/) — GPT-Live-1 launch and delegation architecture
- [Voice agents — OpenAI Docs](https://developers.openai.com/api/docs/guides/voice-agents) — GPT-Live, Realtime, and chained architectures
- [Build real-time voice applications with Gemini 3.8 Live and 3.5 Transcribe — Google](https://blog.google/innovation-and-ai/technology/developers-tools/build-real-time-voice-applications-gemini-audio/) — Gemini 3.8 Live launch and per-minute prices
- [Agent Platform Pricing — Google Cloud](https://cloud.google.com/model-garden/pricing) — Live API per-turn context billing rules
- [Introducing Eleven v4 — ElevenLabs](https://elevenlabs.io/blog/eleven-v4) — v4 / v4 Turbo launch, latency, languages
- [Eleven v4 — ElevenLabs Docs](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/eleven-v4) — model IDs and cross-language accent behavior
- [ElevenLabs API Pricing](https://elevenlabs.io/pricing/api) — current TTS, Scribe, Realtime, and Music prices
- [Introducing Scribe v3 and v3 Live — ElevenLabs](https://elevenlabs.io/blog/scribe-v3) — Scribe v3 launch and vendor-measured error rates
- [ElevenLabs valuation increases to $22 billion — ElevenLabs](https://elevenlabs.io/blog/tender-22bn) — September 2026 employee tender and revenue mix
- [ElevenLabs raises $500M Series D at $11B valuation](https://elevenlabs.io/blog/series-d) — February 2026 funding announcement
- [fishaudio/drama-3 — Hugging Face](https://huggingface.co/fishaudio/drama-3) — model card and Fish Audio Community License
- [hexgrad/Kokoro-82M — Hugging Face](https://huggingface.co/hexgrad/Kokoro-82M) — model card and Apache 2.0
- [resemble-ai/chatterbox — GitHub](https://github.com/resemble-ai/chatterbox) — retirement notice and MIT archive
- [Chatterbox Multilingual v3 — Resemble AI](https://www.resemble.ai/resources/chatterbox-multilingual-v3-tts-with-embedded-watermarking-for-25-languages) — final release and default watermarking
- [idiap/coqui-ai-TTS — GitHub](https://github.com/idiap/coqui-ai-TTS) — community-maintained XTTS fork
- [Introducing v6 — Suno](https://suno.com/blog/introducing-v6) — Suno v6 model family and partners
- [Suno replaces its AI models with a new one trained on licensed music — TechCrunch](https://techcrunch.com/2026/09/09/suno-replaces-its-ai-models-with-a-new-one-trained-on-licensed-music-as-copyright-suits-pile-up/) — licensed data and ongoing lawsuits
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site, series guide
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
