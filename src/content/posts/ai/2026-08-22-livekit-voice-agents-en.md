---
title: "LiveKit Voice Agents: From WebRTC Rooms to Interruptible Voice Pipelines"
date: 2026-08-22
category: ai
tags: [livekit, voice-agent, webrtc, realtime-ai, speech-to-text, telephony]
lang: en
type: deep-dive
tldr: "LiveKit models a voice agent as a server participant in a realtime media room, with AgentSession orchestrating STT, turn detection, LLM, TTS, and interruption. It raised a $100 million Series C at a $1 billion valuation in 2026. It fits products needing WebRTC, multiple client platforms, telephony, and swappable models, but self-hosting the media server does not self-host the entire AI pipeline."
description: "A lifecycle and selection-focused guide to LiveKit Voice Agents: WebRTC rooms, AgentSession, STT/LLM/TTS, turn detection, interruption, SIP telephony, recording safety, and self-host versus Cloud."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-livekit-voice-agents)

[LiveKit](https://livekit.io/) began as a WebRTC media server before the Agents SDK grew on top. That history distinguishes it from a typical voice-agent API. Users, AI agents, phones, and services are room participants; audio, video, and data tracks first travel through a realtime media layer. STT, LLM, and TTS are replaceable processing nodes inside an agent session.

Large systems have validated that position. In January 2026, LiveKit announced a [$100 million Series C led by Index Ventures at a $1 billion valuation](https://livekit.com/blog/livekit-series-c). The same announcement reports more than one million monthly Agents downloads and billions of calls per year between agents and users on its network; these are company-reported figures. An earlier [TechCrunch report](https://techcrunch.com/2025/04/10/livekits-tools-help-power-real-time-communications/) confirms its role in ChatGPT Voice Mode and quotes the company reporting more than 500 paying customers and 100,000 developers at the time.

## Architecture: rooms bound connections, sessions bound conversations

```text
Web / iOS / Android / SIP phone
              │ WebRTC / RTP media
              ▼
         LiveKit Room
       ┌──────┴────────┐
 user participant   agent participant
                          │
                    AgentSession
          audio → VAD/STT → turn detector
                          → LLM/tools
                          → streaming TTS → audio
```

A room manages participants, tracks, network quality, codecs, reconnects, and permissions. An agent worker receives a dispatch job and joins the room; `AgentSession` then handles a conversation with a linked participant. The separation lets one backend serve browsers, native apps, telephones, robots, and multi-user rooms without rebuilding voice transport for each client.

In the [official lifecycle](https://docs.livekit.io/agents/logic/sessions/), a session moves through initializing and starting into running, while the agent switches among listening, thinking, and speaking. Closing can drain queued speech, commit transcripts, await pending operations, and close I/O. Production failures often sit at these boundaries: the user leaves while a worker stays alive, TTS continues during a handoff, or a stuck tool keeps a phone call billable. Test every close path.

## Minimal Agents SDK usage

LiveKit Inference provides unified model strings, while provider plugins offer direct integrations. A minimal Python agent looks like this:

```python
from livekit.agents import (
    Agent, AgentServer, AgentSession, JobContext,
    TurnHandlingOptions, inference,
)

server = AgentServer()

@server.rtc_session()
async def voice_agent(ctx: JobContext):
    session = AgentSession(
        stt="deepgram/nova-3:en",
        llm="google/gemma-4-31b-it",
        tts="cartesia/sonic-3",
        turn_handling=TurnHandlingOptions(
            turn_detection=inference.TurnDetector(),
        ),
    )
    await session.start(
        room=ctx.room,
        agent=Agent(instructions="Be concise and confirm before taking action."),
    )

if __name__ == "__main__":
    server.run()
```

The API evolves quickly. The [current documentation](https://docs.livekit.io/agents/logic/sessions/) has moved turn settings into `TurnHandlingOptions`, so do not copy an old tutorial and pin it indefinitely. Use `console` mode for prompt and tool testing, `dev` to attach to a room, and production `start` only with worker autoscaling.

## Latency is a critical path, not one number

From the moment a user stops speaking to the first audible response, the path includes uplink, VAD/STT partials, end-of-turn decision, LLM first token, TTS first audio, and downlink playout. An average hides bad conversations. Measure p50 and p95 for each segment and track premature endpointing as a quality metric.

Preemptive generation starts the LLM before a turn is confirmed. The [official documentation](https://docs.livekit.io/agents/logic/sessions/) explicitly notes its cost: a wrong prediction discards generated output and consumes extra tokens. It is not free acceleration. Measure early endpoints, discarded generations, and interruptions on real speech before enabling preemptive TTS.

Network topology also matters. WebRTC prefers direct or UDP paths and falls back to TURN relay on restricted networks; calls enter through PSTN and SIP. If agent code, media edge, STT, LLM, and TTS occupy different regions, each hop adds jitter and tail latency. LiveKit Cloud supplies global media and inference routing. Self-hosters own the regional placement of SFUs, TURN, workers, and model endpoints.

## Turn detection and interruption create conversational behavior

A fixed silence timeout interrupts users during pauses and waits too long after complete sentences. LiveKit can combine VAD, STT endpointing, and a semantic turn detector to decide whether an utterance is complete in meaning. Language, accent, phone quality, and filler words change behavior, so build a turn-evaluation set from your own recordings.

Interruption, or barge-in, is another state transition. When a user speaks over the agent, the system must stop playout, cancel or retain generation, update chat context, and listen again. Background television or the agent's acoustic echo can cause false interruption, so tune noise cancellation, echo control, and minimum speech duration together. Some customer-service content, such as mandatory disclosures, may require non-interruptible playback.

## Telephony: SIP connects the call; operations begin afterward

[LiveKit Telephony](https://docs.livekit.io/telephony/) turns a PSTN caller into a room participant through a SIP trunk, allowing one AgentSession to handle web and phone users. Inbound trunks and dispatch rules route calls to rooms and agents; outbound trunks initiate calls. DTMF, IVR detection, transfer, and human handoff should be explicit workflows rather than hidden prompt instructions.

Phones add caller ID, carriers, jurisdictional rules, recording notices, rejection, and voicemail. Build a safe route to a human before optimizing for full automation. If the product needs only telephony and no web, mobile, or video client, the full WebRTC client ecosystem may be unnecessary overhead.

## Data security, recording, and consent

Realtime audio, transcripts, session replays, tool arguments, and phone numbers are sensitive. The first decision is not retention duration but whether retention is necessary at all. Debugging may need only time-aligned events and redacted transcripts. If recording is necessary, provide notice and obtain valid consent for the jurisdictions and context before recording begins, with stop-recording, deletion, and human-support paths. A single prompt is not a global compliance strategy; legal review is required.

Self-hosting the LiveKit server can keep the media plane in a VPC. If STT, LLM, and TTS still call external APIs, audio and text cross that boundary. Verify every provider's retention, training, region, and zero-data-retention terms. Keep API keys on servers, issue participant tokens with minimum room permissions, and never place the LiveKit API secret or model keys in a client.

Recording normally uses Egress to create files, adding object storage, encryption, access, and deletion lifecycles. Observability also needs data classification: engineers may need latency traces without having permission to replay every customer call.

## Self-host or LiveKit Cloud

**Choose self-hosting** when the team already operates WebRTC, media must remain on a defined network, the SFU needs modification, or deployment targets edges and specialized hardware. LiveKit server and Agents framework are open source, but model services, carriers, and recording storage remain separate systems. The team owns TURN, autoscaling, upgrades, multi-region routing, and alerts.

**Choose Cloud** for global edges, managed TURN, telephony, agent dispatch and compute, observability, and unified inference routing. Cloud removes realtime-infrastructure operations. It does not supply prompt quality, tool permissions, conversation QA, or legal compliance.

The honest cost unit is a successful minute of conversation. Include media, agent compute, STT, LLM tokens, TTS characters, SIP minutes, recordings, and failed retries. Comparing only TTS cost per million characters misses the system.

## Choosing among Vapi, Cartesia, Deepgram, and ElevenLabs

[Vapi](https://vapi.ai/) exposes a higher-level, telephony-first voice-agent API. It offers a shorter path for quickly composing inbound and outbound calls with existing integrations. LiveKit fits teams that need room, client, media-track, and agent-code control, or that serve web, mobile, and video in addition to phones.

[Cartesia](https://cartesia.ai/), [Deepgram](https://deepgram.com/), and [ElevenLabs](https://elevenlabs.io/) began primarily as model and speech platforms: Cartesia and ElevenLabs commonly provide TTS, while Deepgram commonly provides STT. They increasingly offer complete voice-agent products as well. LiveKit does not have to replace them; Agents plugins and Inference put these providers into one pipeline. A single provider's realtime speech-to-speech API may be simpler when it satisfies the complete workflow. LiveKit's media abstraction matters when STT/TTS must be swappable or when video, telephony, and custom clients join the system.

Use identical recordings and tasks to compare end-of-turn errors, p95 time to first audio, barge-in success, call connection, tool completion, and cost per successful minute. An impressive voice demo does not prove reliable operation over noisy, cross-region telephone calls.

## Conclusion

LiveKit fits teams that treat a voice agent as a realtime distributed system rather than one voice API. Rooms manage media and participants, AgentSession manages conversational state, and STT/LLM/TTS remain replaceable. That layering enables multiple clients and modalities while creating more lifecycle transitions to operate.

For a simple telephony MVP, test a higher-level managed voice-agent API first. Choose LiveKit when the product needs a WebRTC app, phone, video, custom workflows, low-level media control, or a self-hosting path. The decisive test is not how human the synthesized voice sounds. It is whether the session ends correctly when someone pauses, interrupts, disconnects, transfers to a person, or withdraws consent.

## References

- [LiveKit Agents GitHub repository](https://github.com/livekit/agents)
- [LiveKit AgentSession documentation](https://docs.livekit.io/agents/logic/sessions/)
- [LiveKit Turns overview](https://docs.livekit.io/agents/logic/turns/)
- [LiveKit Telephony documentation](https://docs.livekit.io/telephony/)
- [LiveKit Series C announcement](https://livekit.com/blog/livekit-series-c)
- [LiveKit’s tools power real-time communications, including OpenAI’s Voice Mode — TechCrunch](https://techcrunch.com/2025/04/10/livekits-tools-help-power-real-time-communications/)
- [LiveKit voice-agent examples](https://github.com/livekit/agents/tree/main/examples/voice_agents)
- [Vapi](https://vapi.ai/)
- [Cartesia](https://cartesia.ai/)
- [Deepgram](https://deepgram.com/)
- [ElevenLabs](https://elevenlabs.io/)
