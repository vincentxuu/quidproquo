---
title: "Funding Alert｜Phonic Raises $27.5M Series A for Its Speech-to-Speech Voice Agent Model"
date: 2026-10-31
category: daily
type: digest
tags: [ai-agent, funding, daily, phonic, voice-agent]
lang: en
description: "Phonic, which builds native speech-to-speech models for voice agents, raised a $27.5M Series A led by First Round and launched Phonic-1, which tops the Artificial Analysis speech benchmark"
tldr: "Phonic raised a $27.5M Series A led by First Round, bringing total funding to $31.5M, and launched its speech-to-speech model Phonic-1, which beat GPT-Live-1, Grok Voice 3, and Eleven v4 Turbo in blind listening tests — though it still loses to human voice actors. The signal: voice agents are shifting from stitched-together pipelines to native end-to-end models."
series:
  name: "AI Agent Funding"
  order: 118
---

> 🌏 [中文版](/posts/daily/2026-10-31-funding-phonic)

## Funding Details

| Item | Value |
|---|---|
| Company | Phonic (San Francisco, US) |
| Round | Series A |
| Amount | $27.5M |
| Lead | First Round Capital |
| Participants | Lux Capital, Felicis, Definition, Essence VC |
| Valuation | Undisclosed |
| Total raised | $31.5M ($4M seed + $27.5M Series A) |
| Founded | 2024 (the team describes founding the company "more than two years ago") |
| Headcount | About 10 (researchers and engineers from MIT, Stanford, and CMU) |

## What the company does

Phonic builds the underlying model layer for voice agents. Instead of stacking another layer on top of the typical speech-recognition (STT) + LLM + text-to-speech (TTS) pipeline, it trains a native, end-to-end speech-to-speech model so a voice agent can hear tone, pauses, and emotion directly — not just the semantic meaning left after converting speech to text.

Its differentiator is acting while the caller is still talking. Most voice agents wait for the user to finish a sentence and say "let me check" before calling a tool; Phonic-1 can call tools while the caller is mid-sentence, so the answer is ready the moment they stop. The company has demonstrated a 44-minute call with 123 tool calls that switches seamlessly between English and Portuguese. The model supports more than 50 languages and can switch languages mid-call while keeping the same voice identity. Customers include Ashby (powering AI interview scheduling in 25 countries), Maven AGI, Rho, and a Fortune 50 IT infrastructure company, running on Together AI's infrastructure.

Phonic-1 (High) debuted at number one on Artificial Analysis's Speech-to-Speech Index (87.1, narrowly ahead of Grok Voice 3.0's 86.9) and has the fastest time-to-first-audio among the top five models (0.61 seconds). On Sierra's multilingual full-duplex benchmark, τ³-Voice, it scores 83.2, ahead of GPT-Live-1's 79.9 and Gemini 3.8 Live's 68.5.

## What this round signals

### What it means for the agent ecosystem

The bottleneck for voice agents is shifting from "how do we stitch three models together" to "should we train a native end-to-end model instead." Phonic's "act while listening" pitch directly targets the two long-standing problems with cascaded pipelines in real customer-service calls: latency (waiting for the caller to finish before processing starts) and lost emotion (converting speech to text strips out tone, pauses, and feeling). That suggests the next round of voice-agent competition will likely be decided at the model layer rather than the orchestration layer — tool calling and memory management.

### What investors are betting on

First Round led the round, but the more notable detail is the roster of developer-tool angels who participated personally: Vercel's Guillermo Rauch, Replit's Amjad Masad, Hugging Face's Clement Delangue, Modal's Erik Bernhardsson, and AngelList's Naval Ravikant. That roster reads less like a group of financial investors betting on market size, and more like the developer-infrastructure ecosystem collectively betting that voice will become the next agent interface.

### Numbers worth watching

```diagram
title: Phonic-1's blind-listening preference: beats three AI models, loses to human voice actors
desc: In blind pairwise comparisons run by third party Podonos, Phonic-1 beat GPT-Live-1 61.5% to 32.0%, beat Grok Voice 3 66.5% to 26.5%, and beat Eleven v4 Turbo 78.0% to 14.0% — but against human voice actors, Phonic-1 scored only 32.0% versus the human voice actors' 57.0%.
caption: Figures from Phonic's official blog (phonic.ai/blog/phonic-1, 2026-10-29), from blind pairwise comparisons run by Podonos. Value axis 0-100%, x=200+value x 4. The filled blue point always represents Phonic-1's score; the hollow gray point represents the comparison model or human score.
---
<svg viewBox="0 0 640 360">
  <text class="dg-label" x="180" y="80" text-anchor="end" dominant-baseline="central">vs GPT-Live-1</text>
  <line class="dg-axis" x1="328" y1="80" x2="446" y2="80"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="328" cy="80" r="6"/>
  <circle class="dg-point dg-c-accent" cx="446" cy="80" r="6"/>
  <text class="dg-sub" x="316" y="80" text-anchor="end" dominant-baseline="central">32.0%</text>
  <text class="dg-sub dg-text--accent" x="458" y="80" dominant-baseline="central">61.5%</text>

  <text class="dg-label" x="180" y="150" text-anchor="end" dominant-baseline="central">vs Grok Voice 3</text>
  <line class="dg-axis" x1="306" y1="150" x2="466" y2="150"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="306" cy="150" r="6"/>
  <circle class="dg-point dg-c-accent" cx="466" cy="150" r="6"/>
  <text class="dg-sub" x="294" y="150" text-anchor="end" dominant-baseline="central">26.5%</text>
  <text class="dg-sub dg-text--accent" x="478" y="150" dominant-baseline="central">66.5%</text>

  <text class="dg-label" x="180" y="220" text-anchor="end" dominant-baseline="central">vs Eleven v4 Turbo</text>
  <line class="dg-axis" x1="256" y1="220" x2="512" y2="220"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="256" cy="220" r="6"/>
  <circle class="dg-point dg-c-accent" cx="512" cy="220" r="6"/>
  <text class="dg-sub" x="244" y="220" text-anchor="end" dominant-baseline="central">14.0%</text>
  <text class="dg-sub dg-text--accent" x="524" y="220" dominant-baseline="central">78.0%</text>

  <text class="dg-label" x="180" y="290" text-anchor="end" dominant-baseline="central">vs human voice actors</text>
  <line class="dg-axis" x1="328" y1="290" x2="428" y2="290"/>
  <circle class="dg-point dg-c-accent" cx="328" cy="290" r="6"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="428" cy="290" r="6"/>
  <text class="dg-sub dg-text--accent" x="316" y="290" text-anchor="end" dominant-baseline="central">32.0%</text>
  <text class="dg-sub" x="440" y="290" dominant-baseline="central">57.0%</text>
</svg>
```

- On the multilingual full-duplex benchmark τ³-Voice, Phonic-1 scores 83.2 — 3.3 points ahead of GPT-Live-1 (79.9) and 14.7 points ahead of Gemini 3.8 Live (68.5)
- It has the fastest time-to-first-audio among the top five models at 0.61 seconds — one of the rare cases that's best on both intelligence and latency at once
- Just $31.5M in total funding produced a model that debuted at number one, with a team of only about 10 people — notably capital-efficient in a wave of voice AI funding where rounds routinely run into the hundreds of millions

## Watchlist status

Phonic isn't on the watchlist yet. Recommend adding it under section C5 (Voice AI / Voice Agent) — the existing names there (Vapi, Retell, Bland AI, ElevenLabs, PolyAI, Parloa, Synthflow, Cartesia, LiveKit) are all cascaded or platform-layer solutions, while Phonic's differentiation is the native speech-to-speech model itself. Tracking: tool-calling while the caller is still speaking, $27.5M Series A led by First Round.

## Today's takeaway

Phonic publicly disclosed that it loses to human voice actors in blind tests (32.0% vs. 57.0%), rather than only showing off the three AI models it beat. That kind of disclosure — being upfront about exactly how much you're still losing by — is more trustworthy than pure marketing copy. It's also a reminder that the real competitive bar for voice agents today isn't "beat other AI models," it's "close the gap with humans" — and that gap is still 25 percentage points wide.

## References

- [Introducing Phonic-1 and our $27.5M Series A](https://phonic.ai/blog/phonic-1)
- [MIT-Founded Phonic Beats Grok and GPT With Fastest Voice AI Response](https://alphasignal.ai/news/mit-founded-phonic-beats-grok-and-gpt-with-fastest-voice-ai-response)
- [Phonic Raises $27.5M to Launch Phonic-1 Agentic Speech AI Model](https://huggingnews.com/ai/phonic-raises-275m-to-launch-phonic-1-agentic-speech-ai-model-96dfbe61)
- [Why Big Tech earnings are a crucial report card for the AI boom](https://fortune.com/2026/10/30/why-big-tech-earnings-are-a-crucial-report-card-for-the-ai-boom-and-its-future/)
