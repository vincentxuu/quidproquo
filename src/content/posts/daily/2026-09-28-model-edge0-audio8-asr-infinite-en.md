---
title: "Model Card: Audio8 ASR Infinite"
date: 2026-09-28
category: daily
type: digest
tags: [ai-agent, model-release, daily, edge0, model-family-audio8]
lang: en
description: "Edge0 open-sources Audio8 ASR Infinite, a streaming ASR model — 4B parameters, rolling KV cache for drift-free 24/7 transcription, Chinese accuracy far ahead of Voxtral and Nemotron, but the claimed Apache-2.0 license hides a non-commercial gap in its Qwen decoder"
tldr: "Audio8 ASR Infinite: Edge0 open-sourced it on HuggingFace on 2026-09-21. 4B parameters (Voxtral Realtime audio tower + Qwen2.5-3B-Instruct decoder), 30-second rolling KV cache with exact RoPE re-basing for unlimited-length, drift-free 24/7 streaming, plus semantic VAD heads that distinguish thinking pauses from real end-of-turn. Chinese CER (aishell1 1.75%, aishell4 2.89%) crushes Voxtral-Mini-4B-Realtime (16.80%/16.46%) and Nemotron-3.5-ASR-Streaming-0.6B, but English LibriSpeech WER actually loses to Voxtral. The card claims Apache-2.0, but a GitHub issue points out the decoder inherits Qwen2.5-3B-Instruct's non-commercial Qwen Research License — a licensing gap that needs resolving before commercial deployment"
series:
  name: "AI Model Tracker"
  order: 34
glossary:
  - term: "Audio8"
    def: "Edge0's streaming speech-recognition (ASR) model line; Audio8 ASR Infinite is its first public release"
---

> 🌏 [中文版](/posts/daily/2026-09-28-model-edge0-audio8-asr-infinite)

## Model Info

| Item | Value |
|---|---|
| Model ID | `Edge0/Audio8-ASR-Infinite` |
| Vendor | Edge0 |
| Parameters | 4B (audio tower initialized from Voxtral Realtime 4B + decoder initialized from Qwen2.5-3B-Instruct, both fully retrained) |
| Context Window | 30-second rolling audio/text window (rolling KV cache with exact RoPE re-basing, claimed to run 24/7 without drift) |
| Input pricing (USD/1M tokens) | Not offered (open weights, no official hosted API — self-host with vLLM) |
| Output pricing (USD/1M tokens) | Not offered (same as above) |
| Open source | Claimed yes (Apache-2.0) — but see the licensing gap below |
| Release date | 2026-09-21 (HuggingFace checkpoint upload) / 2026-09-23 (official X announcement) |
| Official announcement | [Samuel Zeng (Edge0) on X](https://x.com/SamuelZengML/status/2102726739449332221) |
| HuggingFace | [Edge0/Audio8-ASR-Infinite](https://huggingface.co/Edge0/Audio8-ASR-Infinite) |
| Family | Audio8 (Edge0's first streaming-ASR model line) |

## Highlights

- Native streaming architecture decoding up to 12.5 times per second (80ms audio clock); freely combine 80/120/160ms clocks with 240–560ms transcription delay from a single checkpoint to fit different latency budgets
- A rolling KV cache keeps only a 30-second audio window and applies exact RoPE re-basing, holding memory and latency constant — the vendor claims it can run 24/7 without drift
- Semantic VAD heads (8 classes across 4 time horizons — 0.5/1.0/2.0/3.0s) distinguish "the speaker is still thinking," stuttering, and an actual end of turn, instead of relying on silence duration like traditional acoustic VAD
- Bilingual (Chinese/English), with Chinese recognition accuracy well ahead of similarly sized competitors (see benchmarks below)

## Benchmarks

| Benchmark | Audio8 ASR Infinite | Voxtral-Mini-4B-Realtime-2602 | Nemotron-3.5-ASR-Streaming-0.6B |
|---|---|---|---|
| aishell1/test (Chinese, CER) | 1.75% | 16.80% | 12.93%@560ms |
| aishell4/test (Chinese, CER) | 2.89% | 16.46% | 14.68%@560ms |
| LibriSpeech test-clean (English, WER) | 3.04% | **2.21%** | 3.35%@560ms |
| LibriSpeech test-other (English, WER) | 6.81% | **5.55%** | 7.14%@560ms |
| Average error rate | **3.62%** | 10.25% (2 sets only) | 9.52% |

⚠️ These are Edge0's own measurements at the 80ms audio clock with 480ms transcription delay (greedy decode, EOS suppressed). GitHub Issue #1 contains an independent third-party reproduction that matches the official table.

## Versus Predecessors and Competitors

The biggest gap is in Chinese: aishell1/aishell4 CER is roughly a tenth of Voxtral-Mini-4B-Realtime's and a fifth of Nemotron-3.5-ASR-Streaming's, which strongly suggests Edge0's training data and optimization target skew Chinese. But English LibriSpeech is the one place it loses to Voxtral, trailing by roughly 0.8–1.3 percentage points in WER — this isn't a clean sweep, it's a deliberate trade-off favoring Chinese.

The part worth watching closely is licensing. Both the model card and the GitHub repo claim Apache-2.0, but the community flagged in [GitHub Issue #2](https://github.com/Edge0-AI/Audio8-ASR-Infinite/issues/2) that the decoder was initialized from `Qwen/Qwen2.5-3B-Instruct` and retrained — and unlike Qwen2.5's 0.5B/1.5B/7B/14B/32B siblings, the 3B checkpoint ships under the Qwen RESEARCH LICENSE AGREEMENT, which is non-commercial-only and non-transferable. In other words: Edge0's own contributions — the audio tower training, projector, VAD heads, and code — can legitimately be Apache-2.0, but whether downstream users can commercially use the roughly 3B-parameter decoder remains unresolved, and Edge0 hasn't yet acknowledged or documented the gap.

## What This Means for Agent Development

Rolling KV cache plus semantic VAD directly addresses two of the most common pain points in voice agents: long-running listening sessions that can't rely on periodic resets to hold accuracy, and turn-taking logic that misfires when it depends only on silence length.

- If you're building 24/7 voice use cases (call-center monitoring, meeting transcripts, full-duplex voice assistants): the rolling KV cache's constant-memory property is the key advantage — no need to periodically reset the session and lose context continuity, as with traditional streaming ASR
- If you're building Chinese-first voice agents: single-digit Chinese CER (1.75%/2.89%) clearly beats comparably sized open options and is worth shortlisting for a self-hosted ASR front end
- If you plan to ship commercially: check the license first — the decoder's inherited Qwen Research License is non-commercial, so production use carries real legal risk until Edge0 ships a permissively licensed base or you secure a separate commercial license from Alibaba
- Not a fit for: English-first use cases (Voxtral-Mini-4B-Realtime edges it out); teams that need to ship commercially right away and can't absorb the licensing uncertainty

## Today's Takeaway

An "Apache-2.0" label doesn't mean the whole repo is safe to use commercially. When a model is architecturally a splice of a self-trained module plus an external LLM decoder, the decoder's original license keeps binding downstream users through derivative-work clauses — and that kind of gap usually only surfaces when the community reads the config.json and architecture table line by line, because the official model card won't volunteer it.

## References

- [HuggingFace: Edge0/Audio8-ASR-Infinite](https://huggingface.co/Edge0/Audio8-ASR-Infinite)
- [Official announcement by Samuel Zeng (Edge0) on X](https://x.com/SamuelZengML/status/2102726739449332221)
- [AlphaSignal: Edge0 Ships Audio8 ASR Infinite to Transcribe Speech for Hours Straight](https://alphasignal.ai/news/edge0-ships-audio8-asr-infinite-to-transcribe-speech-for-hours-straight)
- [GitHub: Edge0-AI/Audio8-ASR-Infinite](https://github.com/Edge0-AI/Audio8-ASR-Infinite)
- [GitHub Issue #2: decoder licensing gap discussion](https://github.com/Edge0-AI/Audio8-ASR-Infinite/issues/2)
