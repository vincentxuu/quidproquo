---
title: "Vapi: Managed Voice-Agent Orchestration and the Safety Boundaries Before Going Live"
date: 2026-08-22
category: ai
type: deep-dive
tags: [vapi, voice-agent, telephony, speech-to-text, text-to-speech, ai-agent]
lang: en
tldr: "Vapi connects phone and web audio, STT, LLMs, TTS, tool calls, and call observability in a managed voice runtime. Providers are swappable, but Vapi's realtime orchestration is not portable. In May 2026, the company reported one million developers and announced a $50 million Series B."
description: "A component-by-component guide to Vapi phone and web calls, assistant configuration, STT/LLM/TTS, tool calls, observability, provider swapping, recording consent, data retention, precise PCI and HIPAA boundaries, and alternatives including LiveKit, Cartesia, Deepgram, and ElevenLabs."
draft: false
---

🌏 [中文版](/posts/ai/2026-08-22-vapi-voice-agents)

[Vapi](https://docs.vapi.ai/quickstart/introduction) is a managed voice-agent orchestration platform. It streams phone or WebRTC audio through speech-to-text (STT), an LLM, and text-to-speech (TTS), manages turns, interruptions, transfers, and tool calls, then records transcripts, latency, and outcomes for each call. It is not a better voice model. It is the runtime that prevents several realtime services from colliding inside one conversation.

As of August 2026, Vapi's [official Series B announcement](https://vapi.ai/blog/series-b) reports one million developers on the platform and a $50 million round led by Peak XV, bringing total funding to $72 million. These are company-reported developer and funding figures, not active production-call counts. Selection should follow one call from connection to completion and ask which stages you are willing to delegate to Vapi.

## 1. Phone and web calls: choose where audio enters

Vapi has two primary entry points. Phone calls connect to the PSTN through inbound numbers or server-initiated outbound calls. Web calls use browser and mobile SDKs for realtime voice interfaces. The [web quickstart](https://docs.vapi.ai/quickstart/web) needs only a public key and assistant ID on the frontend:

```bash
pnpm add @vapi-ai/web
```

```ts
import Vapi from "@vapi-ai/web";

const vapi = new Vapi("YOUR_PUBLIC_API_KEY");
await vapi.start("YOUR_ASSISTANT_ID");

vapi.on("call-end", () => console.log("ended"));
vapi.on("message", (message) => {
  if (message.type === "transcript") console.log(message.transcript);
});
```

Phone operations use a private API key that must never enter browser code. Import or purchase a number, then create an outbound call from a backend:

```bash
curl -X POST https://api.vapi.ai/call \
  -H "Authorization: Bearer $VAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumberId": "YOUR_PHONE_NUMBER_ID",
    "assistantId": "YOUR_ASSISTANT_ID",
    "customer": {"number": "+15551234567"}
  }'
```

Phone and web transports can share an assistant, but their media paths differ. Telephony adds carriers, SIP, numbering regulations, and voicemail. Web clients add microphone permissions, device switching, and frontend state. Do not infer PSTN production quality from a browser demo. Test target countries, carriers, and real devices.

## 2. Assistant configuration is a versionable conversation contract

An assistant is Vapi's configuration center: first message, system prompt, transcriber, model, voice, tools, artifact plan, and compliance plan. The [Create Assistant API](https://docs.vapi.ai/api-reference/assistants/create?explorer=true) creates it from JSON. A common pattern saves a stable assistant and uses per-call overrides for names, appointment identifiers, and other dynamic data instead of reconstructing every setting.

Prompts must be rewritten for speech. Ask one question at a time, keep answers short, pronounce numbers and URLs, and do not restart an entire response after interruption. One assistant should own one job. When a call crosses departments, a Squad connects specialized assistants with context-preserving transfers. This is safer than placing support, sales, payments, and medical routing in one system prompt because each assistant can receive a narrower tool and artifact policy.

## 3. STT to LLM to TTS: providers swap, total latency remains

Vapi exposes three provider slots for the voice pipeline. Its [Core Models documentation](https://docs.vapi.ai/quickstart) says STT, LLM, and TTS providers can be replaced or connected to custom servers. [Model Intelligence](https://docs.vapi.ai/assistants/model-intelligence/overview), introduced in July 2026, adds presets and weekly refreshed latency, cost, and quality metrics.

The architecture supports layer-by-layer changes: replace STT when domain terms transcribe poorly, change only the LLM when reasoning is weak, and replace TTS when the voice misses the brand. This reduces model lock-in without eliminating platform lock-in. Vapi's [data-flow documentation](https://docs.vapi.ai/security-and-privacy/data-flow) states that endpointing, interruption detection, emotion detection, backchanneling, filler injection, and related orchestration run exclusively on Vapi infrastructure.

The introduction advertises sub-600ms response times, while Core Models describes an ideal 500–700ms voice-to-voice target. Both are Vapi targets or vendor-reported claims, not your SLA. Actual latency combines endpointing, STT partials, LLM time to first token, TTS time to first byte, network, and telephony transport. [Call artifacts](https://docs.vapi.ai/whats-new/2025/8/9) expose transcriber, model, voice, endpointing, and turn latency separately. Tune the slow segment rather than replacing whichever model has the best headline benchmark.

## 4. Tools turn spoken words into real side effects

[Vapi tools](https://docs.vapi.ai/tools/) include built-in call-control tools, webhook-based custom tools, TypeScript code tools executed on Vapi, and Make or GoHighLevel integrations. They let an assistant retrieve orders, schedule appointments, update CRM records, transfer to a human, or end a call. Tools may be synchronous or asynchronous and can pin a version.

Voice has a larger attack surface than chat. One mistranscribed digit, an instruction in background audio, or an impersonated caller can trigger an irreversible action. Keep schemas narrow and revalidate every argument on the backend. Separate read and write tools. Require a second spoken confirmation or human handoff for payments, cancellations, and personal-data changes. A customer ID spoken by the caller is not authorization, and the model should never choose an arbitrary webhook URL.

Tool webhooks also need source verification, timeouts, and idempotency keys. A disconnect or model retry can submit “cancel it” twice. Calendar booking, refunds, and CRM updates must be safely replayable. Vapi performs function calling; it does not supply transactional consistency for your business APIs.

## 5. Observability identifies which realtime stage failed

Vapi's [debugging documentation](https://docs.vapi.ai/debugging) separates Call Logs, API Logs, and Webhook Logs. A call log shows transcript, duration, ended reason, tool results, and workflow; artifacts add per-turn performance metrics. Structured outputs read the complete transcript, messages, tool results, and metadata after the call and produce schema-validated summaries, outcome flags, or extracted fields. The [official quickstart](https://docs.vapi.ai/assistants/structured-outputs-quickstart) says processing typically completes within seconds after hangup.

These analyses are not ground truth. Summaries and CSAT extraction remain model outputs and need sampled human review. Technical monitors should track provider errors, timeouts, and latency. Effectiveness monitors should track completion, handoff rate, hangup point, and complaints. Vapi monitors can query Insights on a schedule, create issues at thresholds, and notify email, Slack, or webhooks. They do not prove that a prompt change caused an improvement.

## 6. Retention and recording consent: defaults retain data, modes differ

The default data flow stores recordings, full transcripts, call logs, and structured outputs in Vapi. The [call-recording documentation](https://docs.vapi.ai/assistants/call-recording) lists Pay-As-You-Go maximum retention as 30 days for chats and 14 days for calls; configurable retention is an Enterprise feature. Artifacts can be redirected to S3, GCS, R2, Supabase, or Azure Blob, but system logs and product-usage metrics remain on Vapi.

Recording consent is not globally solved by a toggle. Vapi's Enterprise [Recording Consent Plan](https://docs.vapi.ai/security-and-privacy/recording-consent-plan) can place an artifact-free consent assistant first, collect verbal consent or play a stay-on-line notice, and begin recording only after transfer to the main assistant. Vapi also warns that jurisdictional rules differ and some require explicit agreement from every party. Deployers still need legal review for covered locations, purpose, disclosure, withdrawal, and deletion.

Zero Data Retention (ZDR) uses variable values, logs, recordings, and transcripts during a call but does not persist them afterward. This removes dashboard debugging and post-call analysis. It does not mean audio never passed through Vapi orchestration.

## 7. PCI and HIPAA mean only what their documented modes cover

**PCI** is an assistant-level setting, and `compliancePlan.pciEnabled` defaults to false. Vapi's [PCI documentation](https://docs.vapi.ai/security-and-privacy/pci) requires PCI-compatible model, voice, and transcriber choices. When enabled without compliant custom storage or a webhook, recordings and transcripts are permanently deleted. This does not automatically make your CRM, tool endpoint, payment flow, or staff permissions PCI DSS compliant.

**HIPAA** is an organization-wide Enterprise or add-on feature that requires a signed BAA with Vapi and limits the whole organization to listed compliant providers. The [HIPAA documentation](https://docs.vapi.ai/security-and-privacy/hipaa) says HIPAA mode and ZDR are mutually exclusive. HIPAA mode still stores recordings, transcripts, and logs in Vapi's private HIPAA-compliant storage by default unless custom storage is configured. Bringing provider keys is insufficient; provider accounts and storage must also meet requirements.

A healthcare assistant should not enter production merely because a toggle exists. Diagram every STT, LLM, TTS, tool, webhook, and storage system that touches PHI, then confirm BAAs and account settings for each. Never put real PHI in a test organization. PCI and HIPAA modes also do not replace recording consent, TCPA, or local telemarketing rules.

## 8. Choosing among adjacent and same-layer tools

**LiveKit Agents** is an Apache-2.0 open-source framework. You can self-host the LiveKit server or use LiveKit Cloud. Its [official documentation](https://docs.livekit.io/agents/) covers STT–LLM–TTS and realtime models, turn detection, WebRTC, SIP, and agent-server orchestration. LiveKit is the stronger fit for video, custom multi-platform clients, Kubernetes, or runtime-code control. Vapi is faster when the goal is to connect numbers, providers, tools, logs, and compliance configuration as a managed service.

**Cartesia** primarily supplies realtime TTS and voice models. Its [realtime quickstart](https://docs.cartesia.ai/get-started/realtime-text-to-speech-quickstart) streams text over WebSocket and returns audio. Cartesia can be a Vapi voice provider. It becomes a Vapi replacement only when you already own transport, STT, LLM, turn-taking, and tools.

**Deepgram** has expanded from STT and TTS into a full [Voice Agent API](https://developers.deepgram.com/docs/voice-agent). One WebSocket handles listening, thinking, speaking, function calling, and telephony, and a Kubernetes self-hosted deployment is available. Test Deepgram when vertical speech-stack integration, regional endpoints, or self-hosting matter. Vapi differentiates through wider provider composition, assistant and Squad configuration, and cross-provider orchestration.

**ElevenLabs** offers TTS, STT, voice cloning, and conversational agents. Its [documentation](https://elevenlabs.io/docs/overview/intro/) positions it as a complete voice-infrastructure suite. ElevenLabs is direct when branded voice and speech quality are the product center. Vapi is more neutral when you want Deepgram STT, an Anthropic LLM, and Cartesia or ElevenLabs TTS in one runtime.

## Overall

Vapi trades managed cost and orchestration lock-in for realtime streaming, turn-taking, telephony, provider fallback, and per-call debugging that are expensive to operate. It fits teams shipping inbound support, outbound qualification, booking, or routing without first building voice infrastructure.

It is excessive for a standalone TTS feature and unsuitable when all audio and operational telemetry must remain inside a fully self-hosted network. It is dangerous to scale outbound calling before consent, identity verification, and tool authorization exist. The first production milestone should not be “the agent sounds human.” It should know when it misheard, when it lacks authority, when to hand off, and leave enough evidence in the call artifact to audit each decision.

## References

- [Vapi Introduction](https://docs.vapi.ai/quickstart/introduction) (assistants, STT/LLM/TTS, phone/web, and vendor latency claim)
- [Vapi Web calls](https://docs.vapi.ai/quickstart/web) (Web SDK, server SDK, and outbound calls)
- [Vapi Create Assistant API](https://docs.vapi.ai/api-reference/assistants/create?explorer=true) (assistant configuration fields)
- [Vapi Core Models](https://docs.vapi.ai/quickstart) (three-stage pipeline, custom providers, and ideal latency)
- [Vapi Model Intelligence](https://docs.vapi.ai/assistants/model-intelligence/overview) (presets and metric methodology)
- [Vapi Tools](https://docs.vapi.ai/tools/) (default, custom, code, and integration tools)
- [Vapi Debugging voice agents](https://docs.vapi.ai/debugging) (Call, API, and Webhook logs)
- [Vapi Structured outputs quickstart](https://docs.vapi.ai/assistants/structured-outputs-quickstart) (post-call analysis and HIPAA storage behavior)
- [Vapi Data Flow](https://docs.vapi.ai/security-and-privacy/data-flow) (default and custom storage, custom providers, and orchestration boundary)
- [Vapi Call recording](https://docs.vapi.ai/assistants/call-recording) (artifacts, retention, and legal warning)
- [Vapi Recording Consent Plan](https://docs.vapi.ai/security-and-privacy/recording-consent-plan) (verbal and stay-on-line consent and audit data)
- [Vapi PCI Compliance](https://docs.vapi.ai/security-and-privacy/pci) (PCI mode, providers, and storage behavior)
- [Vapi HIPAA Compliance](https://docs.vapi.ai/security-and-privacy/hipaa) (BAA, organization scope, providers, and ZDR exclusion)
- [Vapi August 9, 2025 changelog](https://docs.vapi.ai/whats-new/2025/8/9) (component and turn latency artifacts)
- [Vapi official Series B announcement](https://vapi.ai/blog/series-b) (funding and company-reported developer count)
- [LiveKit Agents documentation](https://docs.livekit.io/agents/) (open-source runtime, models, WebRTC, and SIP)
- [Cartesia Realtime TTS quickstart](https://docs.cartesia.ai/get-started/realtime-text-to-speech-quickstart) (WebSocket TTS)
- [Deepgram Voice Agent API](https://developers.deepgram.com/docs/voice-agent) (single-WebSocket voice pipeline and telephony)
- [ElevenLabs documentation overview](https://elevenlabs.io/docs/overview/intro/) (TTS, STT, voice cloning, and conversational agents)
