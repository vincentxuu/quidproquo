---
title: "ElevenLabs ElevenAgents: The Lifecycle from Realtime Speech to Phone Agents"
date: 2026-08-22
category: ai
type: deep-dive
tags: [elevenlabs, voice-agent, ai-agent, speech-to-text, text-to-speech, telephony]
lang: en
tldr: "ElevenLabs has expanded from a TTS vendor into the ElevenAgents platform: Scribe Realtime listens, Flash speaks, and the platform connects the LLM, turn-taking, tools, and telephony. The key choice is whether you need a voice model or the whole agent control plane."
description: "A lifecycle-oriented guide to ElevenLabs ElevenAgents: realtime STT/TTS, turn-taking, tools, telephony, data governance, and a restrained comparison with LiveKit, Vapi, Cartesia, and Deepgram."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-elevenlabs-conversational-ai)

[ElevenAgents](https://elevenlabs.io/docs/eleven-agents/overview/) is ElevenLabs' current fully managed voice-agent platform, formerly called Conversational AI. It joins realtime speech-to-text (STT), an LLM, text-to-speech (TTS), turn-taking, tools, a knowledge base, testing, and deployment into one pipeline, then exposes the same agent on the web, mobile devices, and phones.

It is more than a talking chatbot. The underlying [Scribe v2 Realtime](https://elevenlabs.io/docs/overview/capabilities/speech-to-text) and [Flash TTS](https://elevenlabs.io/docs/overview/capabilities/text-to-speech) are available separately. **Speech Engine** manages STT, TTS, turn-taking, and interruptions while leaving LLM logic on your server. ElevenAgents is the top layer that also hosts the LLM, tools, telephony, and operational control plane.

The selection question is therefore not merely whether ElevenLabs sounds good. It is whether you need a speech model, a voice runtime with a replaceable LLM, or an end-to-end agent platform from configuration through phone operations.

## 1. Listen and Speak: Measure the Whole Loop

A voice-agent loop is audio input → partial or committed STT transcript → end-of-turn decision → LLM text → first TTS audio → playback. ElevenLabs Realtime STT streams audio over WebSocket and supports VAD-based or manual commits. Scribe returns both partial and committed transcripts; partial text must not be treated as immutable.

ElevenLabs lists about 150ms latency for Scribe v2 Realtime and about 75ms model latency for Flash TTS. These are **vendor-reported model figures**, not perceived end-to-end latency. The [latency guide](https://elevenlabs.io/docs/api-reference/reducing-latency) explicitly notes that location, endpoint choice, and queuing add delay. Before launch, record four timestamps—`speech_end`, committed transcript, first LLM token, and first audio byte—instead of adding two vendor numbers.

Flash targets conversations, Multilingual v2 favors stable long-form output, and Eleven v3 favors expressiveness. Stream pronounceable phrases early without fragmenting prosody. For phones, test the actual narrowband μ-law path rather than treating a headphone demo as call quality.

## 2. Decide: Speech Engine Versus ElevenAgents

[Speech Engine](https://elevenlabs.io/docs/overview/capabilities/speech-engine) fits teams that already have a text agent. ElevenLabs manages capture, transcription, turns, and playback. Your WebSocket server receives the transcript and history, then calls any LLM capable of streaming text. You retain control over prompts, memory, model routing, and tool orchestration.

ElevenAgents also manages the LLM, knowledge base, workflows, and analytics. Its [tool system](https://elevenlabs.io/docs/eleven-agents/customization/tools) includes client, webhook, MCP, and system tools, covering actions such as hanging up, transferring, switching languages, and sending DTMF. The convenience ties prompts, tool schemas, conversation records, and releases more closely to platform objects.

This is a minimal React connection. A public agent can use an ID directly. A private agent needs a signed URL or WebRTC token minted by your backend; never expose the API key in a browser.

```tsx
import {
  ConversationProvider,
  useConversationControls,
} from "@elevenlabs/react";

function AgentButton() {
  const { startSession, endSession } = useConversationControls();
  return (
    <>
      <button onClick={() => startSession({ agentId: "YOUR_AGENT_ID" })}>
        Start call
      </button>
      <button onClick={endSession}>End call</button>
    </>
  );
}

export default function App() {
  return <ConversationProvider><AgentButton /></ConversationProvider>;
}
```

## 3. Turn-Taking: Silence Has More Than One Meaning

[Conversation flow](https://elevenlabs.io/docs/eleven-agents/customization/conversation-flow) exposes silence timeout, soft timeout, interruptions, and turn eagerness. Customer service usually benefits from barge-in; legal disclosures or safety instructions may require temporarily disabling interruption. Aggressive settings talk over users, while conservative settings leave awkward gaps. No single configuration fits every language and phone environment.

Collect real calls and label normal pauses, thinking pauses, completed utterances, false interruptions, and genuine barge-ins. Tune endpointing per language. When a tool is slow, use a soft timeout or tool-call sound to show that work continues; do not have the LLM promise “one second” when an external API controls the timing.

## 4. Act and Call: Tool Authorization Beats Prompting

Webhook tools can fetch orders or create bookings, client tools can change the UI, and system tools can hang up or transfer. Every state-changing tool should pass through authentication, input validation, idempotency, and authorization at your API gateway. The model choosing a tool is not authorization.

The telephony layer supports SIP trunks, Twilio, batch outbound calls, and transfers. The [Twilio register-call guide](https://elevenlabs.io/docs/eleven-agents/phone-numbers/twilio-integration/register-call) shows that retaining full Twilio control requires your own WebSocket bridge, and that mode does not support the platform's call transfer. If humans must take over, test failed transfers, no-answer behavior, and summary handoff before launch.

## 5. Voice Cloning: Verification Is Not Consent

The [voice-cloning documentation](https://elevenlabs.io/docs/eleven-api/concepts/voice-cloning) separates Instant Voice Cloning from Professional Voice Cloning. IVC conditions generation on a short reference sample. PVC fine-tunes on more recording and better suits a consistent production brand voice. Both have voice verification, but ElevenLabs acknowledges that verification can establish participation, not ownership of every recording.

Technical verification cannot replace explicit consent. A production process should record the voice owner's approved purposes, duration, channels, withdrawal, and sublicensing terms, and disclose AI use at the start of a call. Without auditable consent, use Voice Design or licensed Voice Library assets rather than cloning a person. High-risk workflows should also constrain what a voice may say so vocal identity cannot authorize unrelated claims.

## 6. Retention, Training, and Security

ElevenLabs' [data-use explanation](https://elevenlabs.io/docs/help-center/legal/is-my-data-used-to-improve-eleven-labs-ai-models) says some non-enterprise data may improve audio models and users can opt out. Enterprise customer data is not used for training by default. Training choice and retention are separate controls; verify both.

Agents can disable audio saving, set transcript retention, and offer enterprise sensitive-data redaction. [Zero Retention Mode](https://elevenlabs.io/docs/eleven-api/resources/zero-retention-mode) covers eligible API traffic, not UI or playground traffic, and reduces debugging visibility. A practical test is to create a test agent, disable audio saving, choose the shortest purpose-compatible retention, place a call, then inspect history and webhook payloads for residual data.

Use short-lived signed URLs or tokens for private agents and keep API keys server-side. Verify webhook origin, restrict egress destinations, and redact secrets. Healthcare deployments must complete a BAA; a product-level HIPAA statement does not make an individual deployment compliant.

## How to Read Funding and Adoption Figures

In its February 2026 [Series D announcement](https://elevenlabs.io/blog/series-d), ElevenLabs said it raised $500 million at an $11 billion valuation. The company reported more than $330 million in prior-year ARR and later [reported ARR above $500 million](https://elevenlabs.io/blog/500m-arr-and-new-investors) in May.

These are company announcements without a public audit methodology. They indicate commercial momentum, not whether your deployment will meet connection rate, task completion, human transfer, end-to-end latency, or cost-per-success targets.

## Choosing Among LiveKit, Vapi, Cartesia, and Deepgram

| Primary need | Start with | Restrained judgment |
|---|---|---|
| ElevenLabs voices, low-code agents, and same-platform telephony operations | ElevenLabs | A gradual path runs from Speech Engine to ElevenAgents, but the control plane is concentrated |
| Realtime media, an open-source agent framework, and freely mixed models | [LiveKit](https://docs.livekit.io/agents/logic/turns/) | Detailed WebRTC, pipeline, and turn-detector control; you assemble more providers and operations yourself |
| Phone-first orchestration with selectable STT, LLM, and TTS providers | [Vapi](https://docs.vapi.ai/quickstart/introduction) | Provider orchestration is central, and ElevenLabs can remain the selected voice |
| Cartesia Ink/Sonic with a code-first managed runtime | [Cartesia Line](https://docs.cartesia.ai/line/introduction) | Line combines STT, TTS, deployment, and agent code; A/B test your actual languages and voices |
| Deepgram-first STT or a one-WebSocket voice pipeline | [Deepgram Voice Agent API](https://developers.deepgram.com/docs/voice-agent) | A direct listening-thinking-speaking stack with a self-hosted option |

Do not rank platforms by a single TTS latency. LiveKit emphasizes realtime media and composition, Vapi multi-provider phone orchestration, while Cartesia and Deepgram each offer speech models plus agent platforms. ElevenLabs extends from voice assets into agent operations. A blind test with your languages, accents, noise, phone codec, and tool flow is the comparison that matters.

## Fit, Non-Fit, and the Final Decision

ElevenAgents fits teams for which voice quality and brand voice are central, which need fast web and phone deployment, and which accept an integrated control plane. If a mature text agent already exists, start with Speech Engine to test value without migrating everything.

If you require full self-hosting, free replacement of every pipeline stage, or complex existing contact-center routing, a LiveKit, Vapi, or Deepgram architecture may fit better. If you only need TTS, do not adopt the entire agent platform for hypothetical future telephony.

Start with one narrow flow: one language, one tool, and one human-transfer exit. Test it end to end using the real codec, then inspect consent, turn-taking, tool authorization, and data deletion call by call. Until those four pass, a human-sounding voice is not an operable voice agent.

## References

- [ElevenAgents overview](https://elevenlabs.io/docs/eleven-agents/overview/) (current product scope and channels)
- [Speech Engine](https://elevenlabs.io/docs/overview/capabilities/speech-engine) (bring-your-own-LLM boundary)
- [Speech to Text](https://elevenlabs.io/docs/overview/capabilities/speech-to-text), [Text to Speech](https://elevenlabs.io/docs/overview/capabilities/text-to-speech), and [Latency optimization](https://elevenlabs.io/docs/api-reference/reducing-latency) (models and latency scope)
- [React SDK](https://elevenlabs.io/docs/eleven-agents/libraries/react) and [WebSocket](https://elevenlabs.io/docs/eleven-agents/libraries/web-sockets) (minimal connection and authentication)
- [Conversation flow](https://elevenlabs.io/docs/eleven-agents/customization/conversation-flow) and [Tools](https://elevenlabs.io/docs/eleven-agents/customization/tools) (turn-taking and actions)
- [Register Twilio calls](https://elevenlabs.io/docs/eleven-agents/phone-numbers/twilio-integration/register-call) (telephony integration limits)
- [Voice cloning](https://elevenlabs.io/docs/eleven-api/concepts/voice-cloning) (IVC, PVC, and verification limits)
- [Data use](https://elevenlabs.io/docs/help-center/legal/is-my-data-used-to-improve-eleven-labs-ai-models), [Agent privacy](https://elevenlabs.io/docs/eleven-agents/customization/privacy), and [Zero Retention Mode](https://elevenlabs.io/docs/eleven-api/resources/zero-retention-mode) (training, storage, and deletion)
- [ElevenLabs Series D](https://elevenlabs.io/blog/series-d) and [2026 ARR update](https://elevenlabs.io/blog/500m-arr-and-new-investors) (company-reported financing and revenue)
- [LiveKit turns](https://docs.livekit.io/agents/logic/turns/), [Vapi introduction](https://docs.vapi.ai/quickstart/introduction), [Cartesia Line](https://docs.cartesia.ai/line/introduction), and [Deepgram Voice Agent](https://developers.deepgram.com/docs/voice-agent) (official positioning of adjacent platforms)
