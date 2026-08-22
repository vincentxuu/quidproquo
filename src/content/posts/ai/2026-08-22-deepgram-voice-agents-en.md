---
title: "Deepgram Voice Agent API: From Streaming STT and Turn Detection to TTS"
date: 2026-08-22
category: ai
type: deep-dive
tags: [deepgram, voice-agent, speech-to-text, text-to-speech, conversational-ai, telephony]
lang: en
tldr: "Deepgram combines streaming STT, LLM orchestration, turn detection, barge-in, and streaming TTS over one WebSocket while preserving paths for standalone speech models and bring-your-own LLM or TTS."
description: "A technical guide to Deepgram Voice Agent API streaming STT, turn detection, barge-in, TTS, telephony, data policy, and platform tradeoffs."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-deepgram-voice-agents)

[Deepgram](https://developers.deepgram.com/reference/deepgram-api-overview) began as speech-recognition infrastructure. Its current product surface spans streaming STT, TTS, Audio Intelligence, and a Voice Agent API that packages the complete conversational loop. The backbone remains a cascaded architecture: speech becomes text, an LLM produces a response, and speech synthesis speaks it. The difference is that STT, orchestration, and TTS can coordinate inside one bidirectional WebSocket runtime.

This places Deepgram between a speech-model supplier and a complete voice-agent platform. You can use Flux or Nova for STT and Aura for TTS inside your own Pipecat or LiveKit pipeline. Alternatively, Voice Agent API can own turn-taking, barge-in, LLM routing, and tool events. Deepgram also supports bring-your-own LLM, bring-your-own TTS, Dedicated, and self-hosted deployments; the bundled stack is not the only path.

In January 2026, the company announced a [$130 million Series C at a $1.3 billion valuation](https://deepgram.com/learn/press-release-deepgram-raises-series-c), led by AVP.

The same company release says more than 1,300 organizations build Voice AI with Deepgram APIs. These are company-reported funding and adoption figures, not an independent audit.

## Backbone: streaming STT → orchestration → streaming TTS

A Deepgram Voice Agent conversation can be simplified as:

```text
caller / microphone
        │ audio frames
        ▼
Flux or Nova STT ──> turn detection ──> LLM + tools
        ▲                                  │ text stream
        │ barge-in                         ▼
        └──────────── Aura TTS <───┘
```

STT does not wait for a complete recording. It continuously emits partial transcripts and speech events. Flux is designed for conversational audio and integrates end-of-turn decisions into the model; Nova is the general-purpose recognition family with real-time streaming. When orchestration sees a likely utterance boundary, it can send incremental transcript text to the LLM without waiting for a fixed silence timeout.

TTS also streams while the LLM generates text rather than waiting for the complete response. The runtime simultaneously watches for the user to speak again. On barge-in, it stops the agent turn and emits `UserStartedSpeaking`; the telephony bridge then clears audio still queued by the carrier. The user experience therefore depends less on one model benchmark than on whether end-of-turn, interruption, and playback cleanup agree.

## Endpointing, turn detection, and barge-in are different

These concepts are often collapsed:

- Endpointing decides when a segment of speech has temporarily stopped, traditionally through silence duration.
- Turn detection decides whether the speaker has actually completed the thought, using cadence, semantics, and audio context. A pause is not always a handoff.
- Barge-in is the full process of stopping synthesis and playback when the user interrupts an agent already speaking.

Deepgram's runtime owns the first two and stops the interrupted response on its side. It does not control the telephony playback buffer. The official [Twilio integration guide](https://developers.deepgram.com/docs/build-voice-agent-with-twilio-deepgram-openai) still requires the bridge to send `clear` on `UserStartedSpeaking`; otherwise, the model stops while the caller hears another fragment of old audio.

Production tests need real calls containing short answers, hesitation, background speech, numbers, and names. Measure false cutoff, dead air, time from interruption to stopped playback, and transcript loss after barge-in—not only STT word error rate.

## Minimal Voice Agent connection

The Python SDK uses one WebSocket for settings, audio bytes, and typed events. This minimal skeleton sends audio; production code must also continuously read output audio and events:

```python
import asyncio
from deepgram import AsyncDeepgramClient

async def run(audio_chunks):
    client = AsyncDeepgramClient()

    async with client.agent.v1.connect() as agent:
        await agent.send_settings({
            "type": "Settings",
            "audio": {
                "input": {"encoding": "linear16", "sample_rate": 16000},
                "output": {"encoding": "linear16", "sample_rate": 16000},
            },
            "agent": {
                "language": "en",
                "listen": {"provider": {"type": "deepgram", "model": "flux-general-en"}},
                "think": {"provider": {"type": "open_ai", "model": "gpt-4o-mini"}},
                "speak": {"provider": {"type": "deepgram", "model": "aura-2-thalia-en"}},
            },
        })

        async for chunk in audio_chunks:
            await agent.send_media(chunk)

asyncio.run(run(...))
```

Telephony requires more than handing a SIP number to this code. With Twilio, `<Connect><Stream>` opens a bidirectional media stream. Your server maintains one Twilio WebSocket and one Deepgram WebSocket per call, aligning μ-law and sample rates while owning audio relay, call state, and the barge-in clear. Amazon Connect, SIP, and other carriers have a similar boundary: Deepgram owns the voice loop; the telephony provider owns numbers, routing, and the PSTN.

## Tool calling and state placement

Voice Agent API can emit structured function requests and update prompts, inject messages, or switch voices during a session. That does not justify executing tools without controls inside the WebSocket handler. Each call needs a traceable state object containing conversation ID, caller authorization, tool results, handoff status, and recording consent.

Function arguments remain untrusted model output. Account lookups, appointment changes, and payments need schema validation, authorization, idempotency, and explicit confirmation. Barge-in may occur while a tool runs; cancelling speech does not cancel a backend side effect, so tool workflows need their own cancellation boundary.

## Data retention, model training, and security boundaries

Deepgram's policy cannot be summarized as merely “no training.” The [Model Improvement Partnership Program](https://developers.deepgram.com/docs/the-deepgram-model-improvement-partnership-program) is an optional model-improvement arrangement. Its documentation says only data contractually included in the program is used for subsequent model training. Requests can add `mip_opt_out=true`; opted-out content is retained only as long as needed to process the request.

MIP opt-out does not automatically mean zero retention for every metadata record, billing log, or external LLM. A Voice Agent using managed LLM or TTS components needs a complete review of each provider, contract, region, and retention setting. EU and AU endpoints support Voice Agent. Stricter workloads can use Dedicated or [self-hosted deployment](https://developers.deepgram.com/docs/self-hosted-introduction), where a typical deployment sends no audio or transcript back to Deepgram and reports usage metadata instead.

Do not put API keys in clients. Browser and mobile direct connections should use short-lived tokens with separate scope, expiry, rate limit, and project boundaries. Deepgram documents SOC 2 Type II, HIPAA, PCI, and GDPR programs, but applicability to a specific product, region, subprocessor, and BAA is determined by contracts and audit documents.

## Choosing among LiveKit, Vapi, Cartesia, and ElevenLabs

| Product | Center of gravity | Consider it first when |
|---|---|---|
| [Deepgram](https://developers.deepgram.com/reference/deepgram-api-overview) | Proprietary streaming STT and TTS plus bundled orchestration, also available as components | Recognition quality, turn timing, and deployment control are primary risks |
| [LiveKit Agents](https://docs.livekit.io/agents/) | WebRTC media infrastructure and an open agent framework composing STT, LLM, and TTS providers | Browser or app real-time media, room topology, and multi-provider composition matter |
| [Vapi](https://docs.vapi.ai/quickstart/introduction) | Phone-first orchestration, numbers, and provider composition | You want a phone agent quickly with less telephony-bridge ownership |
| [Cartesia](https://docs.cartesia.ai/get-started/overview) | Low-latency, controllable speech generation and voice models | You own orchestration and TTS expression is the differentiator |
| [ElevenAgents](https://elevenlabs.io/docs/eleven-agents/overview) | ElevenLabs voices plus a full conversational-agent platform | Voice design, branded voices, and an integrated builder are priorities |

This is not a feature checklist. LiveKit is closer to a media plane and framework; Deepgram's bundled API moves more timing decisions into the provider runtime. Vapi leans toward telephony products and orchestration. Cartesia is primarily a voice-model component. ElevenLabs is expanding from its voice catalog into a full agent platform. Teams with established WebRTC or telephony control planes may prefer an assembled stack; teams without voice-runtime experience may benefit from bundled turn coordination.

## Reading the vendor benchmark

Deepgram's [Voice Agent Quality Index evaluation](https://deepgram.com/learn/voice-agent-api-generally-available) used common prompts, 121 audio files, 50 ms audio chunks, and comparable LLMs to evaluate latency, interruption, and response coverage. It reports a composite score of 71.5 for Deepgram, ahead of OpenAI and ElevenLabs.

Deepgram designed and ran this vendor benchmark. Metric weights, default configurations, and audio selection may favor its runtime. The useful lesson is that latency alone is insufficient; the result cannot be projected directly onto your language, noise, telephony codec, or caller behavior. Re-run the concepts on a private call set and listen to every false cutoff and barge-in failure.

## Fit, non-fit, and overall tradeoff

Deepgram fits voice agents that need streaming transcription, inspectable text boundaries, phone interruption handling, and cloud, Dedicated, or self-hosted options. When STT accuracy and turn timing matter more than a distinctive voice persona, the integrated runtime can reduce cross-provider latency and inconsistent state.

It may not fit teams that need a fully custom media graph, only want one signature voice, or route every component dynamically across providers. BYO options reduce lock-in, but orchestration semantics, event models, and billing still create a platform dependency.

Evaluate with 100 calls from real scenarios. Test STT and endpointing separately, then run the bundled Voice Agent. Record transcript accuracy, false turn detection, barge-in stop time, end-to-end p95, tool success, and full cost per minute. Voice-agent quality belongs to the entire streaming loop; choosing only the fastest TTS or most accurate STT is not yet a platform decision.

## References

- [Deepgram API Overview](https://developers.deepgram.com/reference/deepgram-api-overview)
- [Deepgram Voice Agent API architecture and GA](https://deepgram.com/learn/voice-agent-api-generally-available)
- [Deepgram Twilio Voice Agent Guide](https://developers.deepgram.com/docs/build-voice-agent-with-twilio-deepgram-openai)
- [Deepgram Model Improvement Partnership Program](https://developers.deepgram.com/docs/the-deepgram-model-improvement-partnership-program)
- [Deepgram Self-Hosted Introduction](https://developers.deepgram.com/docs/self-hosted-introduction)
- [Deepgram Data Privacy Compliance](https://developers.deepgram.com/trust-security/data-privacy-compliance)
- [Deepgram Series C announcement](https://deepgram.com/learn/press-release-deepgram-raises-series-c)
- [LiveKit Agents](https://docs.livekit.io/agents/)
- [Vapi Documentation](https://docs.vapi.ai/quickstart/introduction)
- [Cartesia Documentation](https://docs.cartesia.ai/get-started/overview)
- [ElevenAgents Overview](https://elevenlabs.io/docs/eleven-agents/overview)
