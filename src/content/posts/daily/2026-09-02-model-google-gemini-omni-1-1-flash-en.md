---
title: "Model Card｜Gemini Omni 1.1 Flash"
date: 2026-09-02
category: daily
tags: [ai-agent, model-release, daily, google, model-family-gemini]
lang: en
description: "Google graduates Gemini Omni Flash from preview to gemini-omni-1.1-flash — scene extension now reads 10 seconds of context instead of just the last one, adds first/last-frame camera control, ships 4K output via upscaling, and prices by resolution tier ($0.03 to $0.30 per second)"
tldr: "Gemini Omni 1.1 Flash (gemini-omni-1.1-flash): GA since 2026-08-27, replacing the preview that launched 6/30; closed-source, priced per output second: $0.03 at 360p, $0.10 at 720p (default), $0.15 at 1080p, $0.30 at 4K (1080p/4K are upscaled); ranks #1 on the Artificial Analysis Text-to-Video Arena without audio (1322 Elo) and #2 with audio (1237, trailing Wan3.0's 1241); adds scene extension (10s of context, chainable up to 40s total) and first/last-frame interpolation for camera control"
series:
  name: "AI Model Tracker"
  order: 12
glossary:
  - term: "Gemini Omni"
    def: "Google DeepMind's natively multimodal video generation and editing model family, processing text, image, audio, and video as combined input and output"
---

> 🌏 [中文版](/posts/daily/2026-09-02-model-google-gemini-omni-1-1-flash)

## Model Information

| Field | Value |
|---|---|
| Model ID | `gemini-omni-1.1-flash` |
| Vendor | Google (Google DeepMind) |
| Parameters | Undisclosed |
| Context Window | Not a conventional text model, so no context-window concept applies; each generation produces 4–10 seconds of video at 24fps, extendable via `previous_interaction_id` in 10-second increments up to a cumulative 40 seconds |
| Input pricing (USD/1M tokens) | Not applicable (billed per output second, see below); text/thinking prompt tokens are $1.50 at Standard tier |
| Output pricing (USD/1M tokens) | Derived from the $17.50/1M video-output-token rate: $0.03/sec at 360p, $0.10/sec at 720p (default native resolution), $0.15/sec at 1080p (upscaled), $0.30/sec at 4K (upscaled) |
| Open source | No |
| Release date | 2026-08-27 (GA release, replacing the `gemini-omni-flash-preview` that launched 2026-06-30; that preview endpoint retires 2026-09-30) |
| Official announcement | [Google Blog: Gemini Omni 1.1 Flash lets you build with more control](https://blog.google/innovation-and-ai/technology/developers-tools/build-with-gemini-omni-1-1-flash) |
| HuggingFace | None (closed-source; available only via the Gemini API, AI Studio, and Enterprise Agent Platform) |
| Family | Gemini Omni (predecessor: Gemini Omni Flash Preview, released 2026-06-30) |

## Highlights

- Scene extension jumps from the predecessor's "reads only the last second" to analyzing up to 10 seconds of prior context, meaningfully improving visual consistency, and chains in 10-second increments up to a cumulative 40 seconds
- New first/last-frame interpolation: specify two keyframes and the model generates the continuous motion between them — useful for camera orbits, zoom transitions, and seamless loops
- A new 360p draft mode runs up to 60% faster than standard 720p and costs one-third as much, letting teams iterate cheaply before committing to a final render
- Ranks #1 on the Artificial Analysis Text-to-Video Arena (without audio) at 1322 Elo, ahead of second-place MiniMax H3 at 1302

## Benchmark Results

| Benchmark | Gemini Omni 1.1 Flash | Predecessor (Omni Flash Preview) | Strongest competitor |
|---|---|---|---|
| AA Text-to-Video Arena (no audio, Elo) | 1322 (#1) | Never separately listed on the official leaderboard | MiniMax H3 1302 (#2) |
| AA Text-to-Video Arena (with audio, Elo) | 1237 (#2) | — | Wan3.0 1241 (#1) |
| AA Image-to-Video Arena (with audio, Elo) | ~1203 (#1) | — | Dreamina Seedance 2.0 720p ~1197 (#2) |
| Max cumulative extension length | 40 seconds (4 × 10s) | No documented cumulative cap; extension only referenced the final second | Wan3.0: 30 seconds in a single generation (no multi-turn chaining mechanism) |
| Max output resolution | 4K (upscaled) | 720p only; no 1080p/4K option | Veo 3.1 Fast 4K, priced the same at $0.30/sec |

⚠️ Arena Elo scores are live blind-vote figures from the Artificial Analysis leaderboard (snapshotted late August 2026) that shift weekly as new votes come in — they are not vendor self-reported numbers. Scene-extension, resolution, and pricing specs come from Google's official announcement and documentation.

## Comparison with Predecessor/Competitors

Compared with its own preview, Omni 1.1's biggest advance isn't resolution but controllability: the scene-extension context window grows from 1 second to 10 seconds, making multi-segment extensions far more visually and narratively coherent, and first/last-frame interpolation lets developers pin down exactly where a camera move starts and ends instead of hoping a text prompt gets it right.

Against competitors, Omni 1.1 tops the "without audio" T2V leaderboard (1322 Elo) but slips to #2 on the "with audio" board (1237), trailing Wan3.0 at 1241 — its strength is concentrated in visual quality and camera control rather than synchronized audio-video generation. On pricing, the 720p rate holds steady at $0.10/sec, unchanged despite the added capabilities; but the $0.30/sec 4K rate matches Google's own Veo 3.1 Fast exactly, so it isn't undercutting on price.

The tiered-by-resolution pricing model — 360p at a third of the 720p rate — mirrors Alibaba's Wan3.0 pricing logic, a sign that mainstream video models are converging on the same billing pattern: cheap drafts, pricier finals.

## Implications for Agent Development

`previous_interaction_id` turns "generate → review → tweak one thing in plain language" into a multi-turn conversation within a single session, rather than requiring the full scene to be re-described every time. For agents running content-generation pipelines, that means the state-management burden of tracking "previous video description plus diff" moves to the API side.

- If you're building a marketing/social content automation agent: use 360p draft mode to have the agent generate candidates in bulk, then upscale only the selected ones to 4K after a human or scoring agent picks winners — cutting average generation cost substantially
- If you're building a long-form narrative video pipeline: the 40-second cumulative extension cap combined with first/last-frame interpolation supports a "generate keyframes, let the model fill in the motion" storyboard workflow that replaces manual keyframe animation
- Not a fit: scenarios needing precise audio-video synchronization (it isn't the strongest on the with-audio arena — Wan3.0 and MiniMax H3 fit better), or scenarios needing offline/local deployment or fine-tuning, since it's fully closed-source and API-only

## Today's Insight

I assumed "4K output" meant an across-the-board bump in native rendering quality, but Omni 1.1's 4K is an upscale, not a native render — native output tops out at 720p. That's a reminder to distinguish "native resolution" from "upscaled resolution" when reading a video model's spec sheet, since the two carry very different implications for detail fidelity; the per-second price gap ($0.10 vs $0.30) reflects that distinction too — upscaling is a comparatively cheap compute task, not triple the cost of native rendering.

## References

- [Google Blog: Gemini Omni 1.1 Flash lets you build with more control](https://blog.google/innovation-and-ai/technology/developers-tools/build-with-gemini-omni-1-1-flash)
- [Gemini API docs: Generate and edit videos with Gemini Omni Flash](https://ai.google.dev/gemini-api/docs/omni)
- [Gemini API Release notes: Gemini Omni Flash in public preview (2026-06-30)](https://ai.google.dev/gemini-api/docs/changelog)
- [Google DeepMind Model Card: Gemini Omni Flash](https://deepmind.google/models/model-cards/gemini-omni-flash)
- [Artificial Analysis: Text to Video Leaderboard](https://artificialanalysis.ai/video/leaderboard/text-to-video)
- [the-decoder: Google's Gemini Omni 1.1 Flash makes AI video generation cheaper and more flexible](https://the-decoder.com/googles-gemini-omni-1-1-flash-makes-ai-video-generation-cheaper-and-more-flexible)
- [Dataconomy: Gemini Omni 1.1 Flash Adds 4K Video Upscaling](https://dataconomy.com/2026/08/28/google-gemini-omni-11-flash-ai-video-tools)
- [Hedra: Best AI Video Models in 2026](https://www.hedra.com/blog/best-ai-video-models)
