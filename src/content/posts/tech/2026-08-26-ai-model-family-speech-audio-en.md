---
title: "Speech and Audio Models: Four Years from Whisper Rewriting Open ASR to ElevenLabs Consolidating Voice APIs"
date: 2026-08-26
category: tech
tags: [whisper, elevenlabs, text-to-speech, speech-to-text, kokoro, voice-cloning, model-family-speech]
lang: en
type: deep-dive
tldr: "Speech models split into two lines. Whisper led ASR: its MIT-licensed 1.55B model drove transcription cost toward zero in September 2022; after v2, v3, and turbo cut the decoder from 32 layers to four, OpenAI moved to closed gpt-4o-transcribe. In TTS, ElevenLabs grew to an $11B valuation and $500M ARR, while Kokoro (82M, Apache-2.0) and Chatterbox preserved self-hosting. Speech-to-speech Realtime APIs are now rewriting live conversation."
description: "A guide to speech model families: Whisper v1/v2/v3/turbo and WER, closed gpt-4o-transcribe, ElevenLabs v3/Flash/Scribe pricing and funding, open Kokoro/XTTS/Chatterbox, and the move to Realtime API and Gemini Live."
series:
  name: "AI 模型家族"
  order: 17
draft: false
glossary:
  - term: "WER"
    aliases: ["Word Error Rate", "字錯誤率"]
    definition: "The core speech-recognition metric: errors as a share of words in a human reference transcript; lower is better. Languages without space-delimited words, including Chinese and Japanese, often use CER instead."
  - term: "ASR"
    aliases: ["Automatic Speech Recognition", "自動語音辨識"]
    definition: "Converting audio into text. Whisper, Scribe, and gpt-4o-transcribe belong to this line."
  - term: "TTS"
    aliases: ["Text-to-Speech", "語音合成"]
    definition: "Converting text into speech. Evaluation often uses subjective MOS, with human speech around 4.5+; ElevenLabs v3 and Kokoro belong here."
  - term: "零樣本語音複製"
    aliases: ["zero-shot voice cloning"]
    definition: "Synthesizing a speaker after only seconds of reference audio, without retraining. XTTS v2 needs about six seconds and Chatterbox about five."
---

> 🌏 [中文版](/posts/tech/2026-08-26-ai-model-family-speech-audio)

In September 2022, OpenAI released [Whisper](https://github.com/openai/whisper) on GitHub under MIT: an encoder-decoder trained with weak supervision on 680K hours of web audio, up to 1.55B parameters. Commercial ASR was expensive per hour; Whisper made near-SOTA transcription runnable on a laptop and rewrote the market. On the other branch, ElevenLabs was founded in 2022 and four years later became the de facto voice API leader after a [$500M Series D at an $11B valuation](https://elevenlabs.io/blog/series-d) and more than $500M ARR. This fourteenth family article separates speech into ASR and TTS.

For benchmark interpretation, see the [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en). This is the fourteenth family deep dive in the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en).

## ASR: Whisper's Evolution and Turning Point

| Version | Release | Parameters | Key facts |
|---|---|---|---|
| Original Whisper | 2022-09 | 39M–1550M | Six sizes plus four English-only variants; [paper](https://arxiv.org/abs/2212.04356), [GitHub](https://github.com/openai/whisper), MIT |
| large-v2 | 2022-12 | 1550M | Same architecture retrained, about 10–20% lower error ([discussion](https://github.com/openai/whisper/discussions/661)) |
| large-v3 | 2023-11 | 1550M | Mel bins 80→128, new tokenizer, broad multilingual WER improvements |
| large-v3-turbo | 2024-09-30 | ~800M | [Decoder cut 32→4 layers](https://github.com/openai/whisper/discussions/2363), about 8× faster, near large-v2 quality, CLI default; larger Thai/Cantonese regressions |
| Open line stalls | 2024–present | — | No open Whisper weights after turbo |
| gpt-4o-transcribe / mini | 2025-03-20 | Undisclosed | [Closed API](https://openai.com/index/introducing-our-next-generation-audio-models/); OpenAI claims 2.46% English FLEURS WER and fewer hallucinations; explicitly not open |

Two turning points matter. **Turbo closes the open chapter.** Inspired by Distil-Whisper, it prunes and fine-tunes large-v3: community VRAM estimates fall from about 10GB to 6GB and speed improves eightfold, but translation disappears and some languages regress. OpenAI later called closed [gpt-4o-transcribe](https://techcrunch.com/2025/03/20/openai-upgrades-its-transcription-and-voice-generating-ai-models/) much larger than Whisper and unsuitable for local use. NVIDIA Parakeet and Mistral Voxtral inherited the open frontier; [AA-WER v2.0](https://artificialanalysis.ai/articles/aa-wer-v2) places Parakeet near the front.

**ASR now costs below half a cent per minute.** Current [OpenAI prices](https://developers.openai.com/api/docs/pricing) are $0.0045/minute for gpt-transcribe, $0.006 for gpt-4o-transcribe, and $0.003 for mini. ElevenLabs batch Scribe v2 costs about $0.22/hour. Transcription is a commodity; competition moved to diarization, structured timestamps, and streaming.

## TTS: ElevenLabs' Consolidation and the Open Response

| Milestone | Date | Key facts |
|---|---|---|
| ElevenLabs founded | 2022 | Two Polish founders, starting with dubbing |
| Multilingual v2 | 2023 | 29-language high-quality synthesis; long-form narration workhorse |
| Scribe enters ASR | 2025-02-26 | [99 languages, diarization, word timestamps](https://elevenlabs.io/blog/meet-scribe); independent v1 WER 7.7% |
| Eleven v3 alpha | Mid-2025 | Audio tags such as `[laughs]`, multi-speaker dialogue |
| Flash v2.5 | 2024-12 | ~75ms, 32 languages, live-agent default; Turbo deprecated |
| Eleven v3 GA | 2026-02-02 | 70+ languages, but **not real-time**, 5,000 characters/request |
| Series D | 2026-02-04 | [$500M at $11B](https://elevenlabs.io/blog/series-d), led by Sequoia; $781M total funding |
| ARR exceeds $500M | 2026-05 | [NVentures and BlackRock join extension](https://siliconangle.com/2026/05/05/elevenlabs-adds-high-profile-investors-annualized-revenue-tops-500m/); May 7 price cuts, TTS −55% |

ElevenLabs sells a suite: v3 for expression and scriptable stage directions, Multilingual v2 for long form, Flash v2.5 for real time with a 40,000-character limit—eight times v3—Scribe for ASR, plus agents, effects, and music. It is not unbeatable: [Artificial Analysis](https://artificialanalysis.ai/text-to-speech/leaderboard/provider-voice) places v3 around 14th on Provider Voice while it remains among the most expensive at $100/million characters. The premium buys workflow integration, not an unassailable quality gap.

| Model | Parameters | License | Cloning | Positioning |
|---|---|---|---|---|
| [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) | 82M | Apache-2.0 | ✗ | 54 voices/8 languages, ~86MB quantized, browser-capable, faster than real time on ordinary CPUs but below real time on Raspberry Pi-class boards; ~$1,000 training cost |
| XTTS v2 | ~467M | CPML noncommercial | ✓ (~6s) | Former zero-shot leader; Coqui closed in 2024 and license page is gone; [idiap fork](https://github.com/idiap/coqui-ai-TTS) |
| Chatterbox | 0.5B | MIT | ✓ (~5s) | Practical commercial cloning, emotion exaggeration control |
| Fish Speech | ~500M | Research License, noncommercial | ✓ (10–30s) | Multilingual cloning; newer releases prohibit commercial use |
| Meta SeamlessM4T-v2 | — | CC-BY-NC 4.0 | ✗ | Speech translation, FLEURS WER 18.5% across 77 languages; Voicebox weights never released |

Kokoro showed that a few hundred hours of clean licensed data, 82M parameters, and about $1,000 of GPU time can produce commercial narration. It cannot clone, but makes offline narration nearly free. Chatterbox is the practical 2026 commercial cloning choice; Fish Speech is now noncommercial and XTTS's technical legacy survives without a viable commercial license.

## Architecture: Three Decisive Ideas

**Encoder-decoder plus weak supervision.** Whisper processes 30-second log-Mel spectrograms and autoregressively emits tokens. Its advantage was 680K hours of weakly labeled multilingual audio, robust to noise, accents, and domains, with one model handling recognition, translation, and language ID. Turbo shows much decoder capacity was redundant.

**Zero-shot cloning uses an audio prompt.** XTTS, Chatterbox, and Fish Speech compress seconds of reference audio into a speaker embedding. Newer models use LLM backbones—Chatterbox uses Llama, Orpheus Llama 3—to autoregress discrete audio tokens and inherit LLM inference infrastructure. ElevenLabs Professional Cloning trains on tens of minutes of material for a higher ceiling.

**Live conversation is moving from cascades to speech-to-speech.** ASR→LLM→TTS cascades add delay and lose emotion. [OpenAI Realtime](https://developers.openai.com/api/docs/models/gpt-realtime) reached GA in August 2025; GPT-Realtime-2 in May 2026 adds adjustable reasoning, native SIP, 60-minute sessions, and $32/$64 per million audio tokens—an estimated $0.23/minute that varies with usage. Gemini Live costs $3/$12, about $0.036/minute estimated, but recomputes full context each turn, needs compression and reconnection around 15 minutes, and requires Twilio/LiveKit for SIP. ElevenLabs stays with cascades through 75ms Flash v2.5 plus Agents. Use OpenAI for telephony and long sessions, Gemini for consumer volume, and ElevenLabs when voice identity and tags are the product.

## Licensing and Pricing

| Provider | Model | License | Approximate price | Best for |
|---|---|---|---|---|
| OpenAI Whisper | large-v3 / turbo | **MIT, self-hostable** | Your GPU | Private/local transcription |
| OpenAI API | gpt-4o-transcribe | Closed | $0.006/minute | Accurate batch transcription |
| OpenAI Realtime | GPT-Realtime-2 | Closed | Audio $32/$64 per 1M tokens | Phone agents |
| ElevenLabs TTS | v3 / Flash v2.5 | Closed | $0.10 / $0.05 per 1K characters | Dubbing and agent voices |
| ElevenLabs Scribe | Scribe v2 | Closed | Batch $0.22/hour | Structured high-accuracy transcripts |
| Kokoro-82M | v1.0 | **Apache-2.0** | Free, CPU-capable | Offline narration and edge devices |
| Chatterbox | V3 | **MIT** | Free, GPU recommended | Commercial voice cloning |
| Meta SeamlessM4T-v2 | — | CC-BY-NC | Free research | Speech translation research |

Two traps: XTTS v2's CPML has no commercial licensing path after Coqui's closure. Models such as F5-TTS and MaskGCT may have MIT code but CC-BY-NC **weights**. Fish Speech moved from a permissive reputation to a Research License. Always inspect the current weight license, not the repository license or an old impression.

## Selection for Three Agent Scenarios

**Batch transcription:** self-host Whisper large-v3-turbo for privacy or cost. For maximum accuracy and diarization, choose Scribe v2 or gpt-4o-transcribe; both cost cents per hour and differ mainly in structured output. Turbo has known language regressions, so test Chinese audio with your own WER set.

**Dubbing and content:** use ElevenLabs v3 for its unique directorial audio tags, Kokoro for high-volume offline narration at zero marginal cost, and Chatterbox or ElevenLabs Instant/Professional Cloning for commercial voice identity.

**Live voice:** OpenAI Realtime for PSTN with native SIP and 60-minute sessions; Gemini Live for large app/browser volume at over six times lower unit cost, while handling reconnection yourself; Flash v2.5 + Agents when a branded voice is the product. A Whisper + LLM + Kokoro cascade remains the cheapest fully self-hosted route if you engineer the latency.

In four years, Whisper made listening free infrastructure, ElevenLabs turned speaking into a $500M-ARR business, and the next contest moved to speech-to-speech: whoever fits latency inside the natural rhythm of conversation owns the next interaction layer.

---

## References

- [openai/whisper — GitHub](https://github.com/openai/whisper)
- [Robust Speech Recognition via Large-Scale Weak Supervision](https://arxiv.org/abs/2212.04356)
- [large-v3-turbo release, Discussion #2363](https://github.com/openai/whisper/discussions/2363)
- [Introducing next-generation audio models — OpenAI](https://openai.com/index/introducing-our-next-generation-audio-models/)
- [OpenAI upgrades transcription and voice models — TechCrunch](https://techcrunch.com/2025/03/20/openai-upgrades-its-transcription-and-voice-generating-ai-models/)
- [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing)
- [GPT-Realtime Model — OpenAI Docs](https://developers.openai.com/api/docs/models/gpt-realtime)
- [Meet Scribe — ElevenLabs](https://elevenlabs.io/blog/meet-scribe)
- [ElevenLabs model guide](https://help.elevenlabs.io/hc/en-us/articles/17883183930129-What-models-do-you-offer-and-what-is-the-difference-between-them)
- [ElevenLabs raises $500M Series D](https://elevenlabs.io/blog/series-d)
- [ElevenLabs raises $500M — TechCrunch](https://techcrunch.com/2026/02/04/elevenlabs-raises-500m-from-sequioia-at-a-11-billion-valuation/)
- [ElevenLabs ARR tops $500M — SiliconANGLE](https://siliconangle.com/2026/05/05/elevenlabs-adds-high-profile-investors-annualized-revenue-tops-500m/)
- [Kokoro-82M — Hugging Face](https://huggingface.co/hexgrad/Kokoro-82M)
- [Fish Speech — GitHub](https://github.com/fishaudio/fish-speech)
- [Speech Arena — Artificial Analysis](https://artificialanalysis.ai/text-to-speech/leaderboard/provider-voice)
- [idiap/coqui-ai-TTS — GitHub](https://github.com/idiap/coqui-ai-TTS)
- [AA-WER v2.0 — Artificial Analysis](https://artificialanalysis.ai/articles/aa-wer-v2)
- [SeamlessM4T — Meta AI](https://ai.meta.com/blog/seamless-m4t/)
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en)
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en)
