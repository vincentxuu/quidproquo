---
title: "AI Daily — 2026-11-06"
date: 2026-11-06
category: daily
tags: [ai-agent, daily]
lang: en
description: "One person renting GPUs to run 12 AI agents breached Taiwan's fire and dispatch systems as fast as OpenAI auto-patched 948 Linux kernel bugs — AI agents are cutting transaction costs on both sides of the security line at once"
tldr: "OpenAI's automated pipeline spends $1.21M patching 948 Linux kernel privilege-escalation bugs; Acronis uncovers BOSSAI, a lone operator in Hualien, Taiwan running 12 AI agents that breached hundreds of organizations across 11 countries including a Taipei fire-department patient-care platform; Huawei, Tencent, Alibaba and 17 other Chinese firms sign an AI agent safety pact at Wuzhen; Baidu open-sources a 280B-parameter ERNIE-5.5-Flash-Base, Cognition ships a low-cost 'made in USA' coding model SWE-2 Flash; Sand.ai raises $200M to become a unicorn, Kalepa raises $75M Series B"
draft: false
series:
  name: "AI 日報"
  order: 83
---

> 🌏 [繁體中文版](/posts/daily/2026-11-06-ai-agent-daily)

## The One-Line Take

**The BOSSAI case shows one person renting GPUs to run 12 AI agents can breach Taiwan's fire and dispatch systems as fast as OpenAI spends $1.21M to auto-patch 948 Linux kernel bugs — AI agents are cutting transaction costs on both sides of the security line at once, and the "economies of scale" moat that used to protect defenders is disappearing, only rebuildable through governance mechanisms.**

## Deep Dive: AI Agents Are Cutting the Transaction Cost on Both Sides of Security at Once

I think today's three stories, read together, point to the same structural shift: the transaction cost of running a multi-step attack or a multi-step defense is being cut in half by AI agents at the same time — on both sides of the line. (Framework: transaction cost)

OpenAI's automated pipeline, costing roughly $1.21M, found, verified, and patched 948 local privilege-escalation bugs in the Linux kernel — a vulnerability hunt that scale used to take an entire security team months; now it's a line item a research budget can cover. The same week, security firm Acronis uncovered a campaign called BOSSAI: a single operator in Hualien, Taiwan, renting GPUs to run 12 AI agents (some building servers, some scanning and writing exploits) — with no need for the agents to talk to each other, the operator just manually copy-pasted output between tools — breached hundreds of organizations across 11 countries, including a Taipei fire-department patient-care platform (exposing ECG readings and ambulance video dating back to 2018), a city 119 dispatch system, and data from Thai universities and Mexican telecoms. One person and one research lab are now using the same tool.

Together, these two stories show that the "economies of scale" that used to protect defenders — only large organizations could afford vulnerability-hunting or attack teams — is disappearing, and disappearing in both directions. That's also why CrowdStrike keeps doubling down on agent behavior monitoring, why Cloudflare wants sites to first learn to tell whether traffic is an agent, and why Huawei, Tencent, Alibaba and 17 other Chinese firms signed an AI agent safety pact at the Wuzhen World Internet Conference: everyone is racing to rebuild that vanishing scale moat through governance instead.

What this means for practitioners: if your security posture assumes "we're too small for anyone to bother attacking," the BOSSAI case directly disproves that — it hit exactly the kind of small, local public infrastructure (fire departments, dispatch systems) that used to be considered "not worth attacking," for the simple reason that they still had default passwords and unpatched open ports. The concrete action for Taiwan teams this week is to audit internet-facing services for default credentials and unclosed legacy ports — not to wait for an adversary to prove you're worth targeting.

```diagram
title: AI Agents Are Cutting the Transaction Cost on Both Sides of Security at Once
desc: Only large organizations used to be able to afford vulnerability-hunting or attack teams. Today's OpenAI and BOSSAI cases show the same AI agent tooling is collapsing that scale threshold for both defenders and attackers.
caption: Left: OpenAI's automated vulnerability hunting ($1.21M to patch 948 Linux kernel bugs). Right: BOSSAI, a lone operator running 12 AI agents to breach hundreds of organizations across 11 countries, including Taiwan's fire and dispatch systems.
---
<svg viewBox="0 0 640 300">
  <rect class="dg-box" x="32" y="40" width="248" height="220" rx="8"/>
  <text class="dg-tag" x="52" y="68" dominant-baseline="central">Defender</text>
  <text class="dg-label" x="156" y="100" text-anchor="middle" dominant-baseline="central">OpenAI automated vuln hunting</text>
  <text class="dg-sub" x="156" y="130" text-anchor="middle" dominant-baseline="central">Research budget: $1.21M</text>
  <text class="dg-sub" x="156" y="154" text-anchor="middle" dominant-baseline="central">Patched 948 Linux kernel bugs</text>
  <text class="dg-sub" x="156" y="178" text-anchor="middle" dominant-baseline="central">Scale of an entire security team</text>

  <path class="dg-line" d="M280 150H360" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--accent" x="360" y="40" width="248" height="220" rx="8"/>
  <text class="dg-tag" x="380" y="68" dominant-baseline="central">Attacker</text>
  <text class="dg-label" x="484" y="100" text-anchor="middle" dominant-baseline="central">BOSSAI, one operator</text>
  <text class="dg-sub" x="484" y="130" text-anchor="middle" dominant-baseline="central">12 AI agents, divided roles</text>
  <text class="dg-sub" x="484" y="154" text-anchor="middle" dominant-baseline="central">Breached 11 countries, hundreds of orgs</text>
  <text class="dg-sub" x="484" y="178" text-anchor="middle" dominant-baseline="central">Matches nation-state scale</text>
</svg>
```

## Today's Developments

### Vendor Updates

| Entity | Today's development | Source |
|------|----------|------|
| **OpenAI** | Launches Images 2.6, bringing faster image generation, GIF creation, more precise editing, and new API controls to ChatGPT, Codex, and the API | [OpenAI](https://openai.com/index/introducing-images-2-6/) |
| **Meta** | Adds voice interaction and expressive avatars to its personal AI agent app Muse, aiming for more natural human-agent interaction | [Meta](https://about.fb.com/news/2026/11/introducing-muse-ai-voice-expressive-avatars/) |
| **Google** | Research team proposes the Agile Deliberation framework to help human teams use AI to quickly define gray areas in policy and content judgment | [Google Research](https://research.google/blog/agile-deliberation-how-ai-helps-humans-define-the-gray-areas/) |
| **NVIDIA** | Shares how it uses AI agents internally to integrate compute, network, hardware, and scheduling dashboards, simplifying SRE inspection of GPU clusters | [NVIDIA](https://developer.nvidia.com/blog/how-nvidia-uses-ai-agents-to-streamline-ai-factory-operations/) |
| **Cloudflare** | Publishes two posts same day: a framework to help sites identify and manage AI agent traffic acting for users; and a tool giving site owners visibility into personal AI agents with configurable access rules | [Cloudflare 1](https://blog.cloudflare.com/trusted-agent-delegation/), [Cloudflare 2](https://blog.cloudflare.com/personal-agents-visibility-control/) |
| **Google Cloud** | Launches Agent Compute Engine and accompanying governance tooling, built on the infrastructure that runs Gemini for work internally, serving enterprise AI agent deployment | [SecurityBrief Asia](https://securitybrief.asia/story/google-cloud-launches-ai-agent-engine-governance) |
| **Alibaba Cloud** | AI Gateway adds FinOps Session Observability, breaking down costs at the session level to help enterprises optimize agent spend | [Alibaba Cloud](https://www.alibabacloud.com/blog/ai-gateway-launches-finops-session-observability-to-help-enterprises-optimize-agent-costs_603734) |

### Models & Infrastructure

| Entity | Today's development | Source |
|------|----------|------|
| **NVIDIA** | Releases Cosmos 3 open model on Hugging Face, adding interactive world-simulation capability for physical AI and robot training | [Hugging Face](https://huggingface.co/blog/nvidia/cosmos-interactive-world-simulation) |
| **Baidu** | Releases ERNIE-5.5-Flash-Base and a BF16 version, a 280B-parameter open base model deliberately left untuned for developers to post-train | [Hugging Face](https://huggingface.co/baidu/ERNIE-5.5-Flash-Base) |
| **Visa** | Launches the industry's first Agentic Commerce Benchmark for AI shopping, testing 22 models on 15 shopping tasks; overall pass rate is only 57.2% | [Yahoo Finance](https://finance.yahoo.com/technology/ai/articles/visa-releases-first-kind-industry-144300055.html) |
| **Phonon TTS** | A newly released on-device text-to-speech model claims top results on multiple speech benchmarks | [Hugging Face](https://huggingface.co/blog/phonon-tts) |

### Pricing & API Lifecycle

Google DeepMind extends Gemini Omni 1.2 Flash video clips to 15 seconds and cuts pricing 30%, down to $0.07 per second of 720p — the third round of video-generation price cuts this year, pushing video-gen costs toward the same order of magnitude as text generation. ([The Decoder](https://the-decoder.com/googles-gemini-omni-1-2-flash-stretches-ai-video-clips-to-15-seconds-and-cuts-pricing-by-30-percent/))

### Security Incidents

| Entity | Today's development | Source |
|------|----------|------|
| **OpenAI** | Automated pipeline finds, verifies, and patches 948 local privilege-escalation bugs in the Linux kernel, at a cost of roughly $1.21M | [OpenAI](https://openai.com/index/a-thousand-fewer-paths-to-root/) |
| **BOSSAI (Taiwan)** | Acronis uncovers a lone operator in Hualien, Taiwan running a 12-AI-agent attack mesh that breached hundreds of organizations across 11 countries, including a Taipei fire-department patient-care platform and a city 119 dispatch system | [Acronis](https://www.acronis.com/en/tru/posts/bossai-inside-the-ai-attack-mesh-that-targeted-taiwans-emergency-services/) |

### Regulation & Governance

| Entity | Today's development | Source |
|------|----------|------|
| **20 Chinese firms incl. Huawei, Tencent, Alibaba** | Sign a voluntary pact at the World Internet Conference in Wuzhen to strengthen AI agent safety, preserve user control over key decisions, and advance cross-vendor agent interoperability | [MLex](https://www.mlex.com/mlex/articles/2546595/huawei-tencent-back-ai-agent-pact-on-safety-user-control) |
| **US Department of Defense** | Chief technology officer says the federal government will publish a complete list of laws applicable to domestic AI labs this month | [Reuters](https://www.reuters.com/legal/litigation/pentagon-chief-tech-officer-says-government-will-detail-laws-that-apply-ai-labs-2026-11-04) |

### Coding Agent Track

| Entity | Today's development | Source |
|------|----------|------|
| **Cognition (Devin)** | Ships SWE-2 Flash, billed as a "fully made in USA" coding model striking a new balance between low cost and high speed | [Cognition](https://cognition.com/blog/swe-2-flash) |
| **Cursor** | Lays out a "self-driving codebases" vision: agents merging PRs, managing deploys, and monitoring production | [Cursor](https://cursor.com/blog/self-driving-codebases) |
| **Microsoft Agent Framework** | Adds installable builder skills, giving coding agents officially maintained .NET and Python development guidance | [Microsoft](https://devblogs.microsoft.com/agent-framework/give-your-coding-agent-a-head-start-with-microsoft-agent-framework-skills-for-net-and-python/) |

### Regional Developments

| Region | Today's development |
|------|----------|
| **Taiwan** | Acronis uncovers the BOSSAI attack mesh — a lone operator in Hualien running 12 AI agents breached a Taipei fire-department patient-care platform and a city 119 dispatch system, exposing patient data dating back to 2018; see Security Incidents above |
| **China/Hong Kong** | Zetrix AI and the China Academy of Information Communications Technology launch cross-border AI agent identity service KYA at the Wuzhen World Internet Conference, planning to submit findings to the ITU; at the same event, Huawei, Tencent, Alibaba and 17 other firms signed an AI agent safety pact (see Regulation above) |
| **Southeast Asia** | Vietnam's Ministry of Science and Technology opens the AI4VN 2026 summit in Hanoi, making "Agentic AI and the future of learning" its theme for the first time, as Viettel, FPT, and VNPT accelerate AI-native data center builds |
| **Middle East (incl. Israel)** | UAE Deputy Prime Minister Sheikh Mohammed announces an Annual Government Challenge with AED 9M in prizes, inviting federal employees to design agentic AI solutions; Abu Dhabi's AIREV secures a strategic investment from Singapore's Terra Invest for its sovereign agentic AI platform |
| **Africa** | INSEAD-backed Nigerian telecom-infrastructure startup KrosAI raises $135K in seed funding to simplify deploying AI voice agents in emerging markets |
| **Latin America** | Colombia's Celes closes a $5M Series A led by Brazil's SP Ventures, using AI agents for retail demand forecasting and replenishment automation, formally entering the Brazilian market |

Searched but not included: Japan/Korea, India/South Asia, Oceania (Australia/NZ) — today's Japan/Korea hits were mostly small raises (e.g. Japan's Intentia, a ~$64K debt round) and trade-show-adjacent news, none reaching the bar of a same-day AI-agent-direct event; Oceania turned up mostly personnel appointments and generic governance commentary, with no qualifying platform/regulation/funding event; this round's supplemental-search budget went to the four regions above, and the signals set itself had nothing for India/South Asia either, so it's omitted as well.

### Business Cases / Funding

| Entity | Today's development | Source |
|------|----------|------|
| **Sand.ai** | Beijing video-generation startup closes a $200M Series A+ extension, crossing $1B valuation to become a unicorn, with $300M raised cumulatively in 10 months | [DealStreetAsia](https://www.dealstreetasia.com/stories/sand-ai-enters-unicorn-club-500283) |
| **Kalepa** | AI insurance-underwriting startup closes a $75M Series B at a $470M valuation; customers report underwriting time cut 30-60% | [Reuters](https://www.reuters.com/legal/transactional/ai-powered-insurance-startup-kalepa-valued-470-million-new-funding-round-2026-11-05) |

## Technical Progress

No Arxiv Digest today. On frameworks: Mastra adds TTFT (time to first token) and TTFC latency metrics to its agent Observability suite, helping teams track perceived user-facing speed — another observability upgrade this month following knowledge-base and MCP Events features ([Mastra](https://mastra.ai/blog/introducing-latency-metrics)).

## Tools & Ecosystem

No GitHub Digest today. On tooling: Mistral launches Studio, letting enterprises build and deploy agents, workflows, and applications on its Le Chonk model family while keeping control of their own models, data, and infrastructure; Alibaba Cloud explains how durable-execution techniques let AI agents reliably resume tasks after interruption through state persistence; Zep launches Agent Skills, converting an agent's execution history into verifiable procedures so smaller models can approach Claude Opus 5.5-level performance on business-task benchmarks.

| Entity | Today's development | Source |
|------|----------|------|
| **Mistral** | Studio, an enterprise agent build-and-deploy platform | [Mistral](https://mistral.ai/news/build-with-studio/) |
| **Alibaba Cloud** | Durable Agent, keeping agents reliably running in the cloud long-term | [Alibaba Cloud](https://www.alibabacloud.com/blog/durable-agent-explained-how-to-keep-an-agent-running-reliably-in-the-cloud-over-the-long-term_603735) |
| **Zep** | Agent Skills, turning execution history into verifiable procedures | [Zep](https://www.getzep.com/blog/introducing-zep-agent-skills) |
| **Kong** | Open-sources Volcano SDK, a TypeScript agent SDK combining LLM reasoning with real-world action via MCP tools | [Kong](https://konghq.com/blog/product-releases/kong-ai-registry) |
| **Dharma Field Extractor** | An open-source model that turns arbitrary document input into structured JSON fields, suited for agent pre-processing of unstructured documents | [Hugging Face](https://huggingface.co/blog/Dharma-AI/dharma-field-extractor) |

## Key Numbers

| Item | Number | Source |
|------|------|------|
| OpenAI's Linux kernel bugs patched | 948, costing roughly $1.21M | [OpenAI](https://openai.com/index/a-thousand-fewer-paths-to-root/) |
| Visa Agentic Commerce Benchmark pass rate | 57.2% | [Yahoo Finance](https://finance.yahoo.com/technology/ai/articles/visa-releases-first-kind-industry-144300055.html) |
| Baidu ERNIE-5.5-Flash-Base parameter count | 280B | [Hugging Face](https://huggingface.co/baidu/ERNIE-5.5-Flash-Base) |
| Sand.ai raise / valuation | $200M / crosses $1B | [DealStreetAsia](https://www.dealstreetasia.com/stories/sand-ai-enters-unicorn-club-500283) |
| BOSSAI attack scale | 12 AI agents / 11 countries, hundreds of orgs | [Acronis](https://www.acronis.com/en/tru/posts/bossai-inside-the-ai-attack-mesh-that-targeted-taiwans-emergency-services/) |

## Watching Tomorrow

- How fast Taiwan's fire department and city dispatch systems patch up after Acronis exposed BOSSAI, and whether a copycat campaign shows up
- As cloud long-running-agent infrastructure like Alibaba Cloud's Durable Agent and Google Cloud's Agent Compute Engine piles up, whether the next competitive front is cross-cloud migration and lock-in costs
- Whether the AI agent safety pact signed by 20 Chinese firms turns into a binding cross-vendor interoperability standard

## Today's Update

I used to think coordinating multiple agents for an attack required building a real orchestration framework so agents could talk to each other. Reading the BOSSAI case changed that — it turns out you don't need that at all: the operator just manually copy-pasted one agent's output into the next agent's input box, and that was enough to chain together a 12-agent attack with divided roles. That means "does it have automated orchestration" isn't a reliable signal of threat scale — manual copy-paste can achieve similar coordination, so defenders can't assess an adversary just by how much engineering sophistication the setup appears to require.

## References

- [A thousand fewer paths to root — OpenAI](https://openai.com/index/a-thousand-fewer-paths-to-root/)
- [BOSSAI: Inside the AI attack mesh that targeted Taiwan's emergency services — Acronis](https://www.acronis.com/en/tru/posts/bossai-inside-the-ai-attack-mesh-that-targeted-taiwans-emergency-services/)
- [Introducing Images 2.6 — OpenAI](https://openai.com/index/introducing-images-2-6/)
- [Agile Deliberation: How AI helps humans define the gray areas — Google Research](https://research.google/blog/agile-deliberation-how-ai-helps-humans-define-the-gray-areas/)
- [Introducing Muse AI voice & expressive avatars — Meta](https://about.fb.com/news/2026/11/introducing-muse-ai-voice-expressive-avatars/)
- [How NVIDIA uses AI agents to streamline AI factory operations](https://developer.nvidia.com/blog/how-nvidia-uses-ai-agents-to-streamline-ai-factory-operations/)
- [Trusted agent delegation — Cloudflare](https://blog.cloudflare.com/trusted-agent-delegation/)
- [Personal agents visibility & control — Cloudflare](https://blog.cloudflare.com/personal-agents-visibility-control/)
- [Google Cloud launches AI Agent Engine & governance — SecurityBrief Asia](https://securitybrief.asia/story/google-cloud-launches-ai-agent-engine-governance)
- [AI Gateway launches FinOps Session Observability — Alibaba Cloud](https://www.alibabacloud.com/blog/ai-gateway-launches-finops-session-observability-to-help-enterprises-optimize-agent-costs_603734)
- [NVIDIA Cosmos interactive world simulation — Hugging Face](https://huggingface.co/blog/nvidia/cosmos-interactive-world-simulation)
- [ERNIE-5.5-Flash-Base — Baidu / Hugging Face](https://huggingface.co/baidu/ERNIE-5.5-Flash-Base)
- [Visa releases first-of-its-kind Agentic Commerce Benchmark — Yahoo Finance](https://finance.yahoo.com/technology/ai/articles/visa-releases-first-kind-industry-144300055.html)
- [Phonon TTS — Hugging Face](https://huggingface.co/blog/phonon-tts)
- [Google's Gemini Omni 1.2 Flash stretches AI video clips to 15 seconds and cuts pricing by 30% — The Decoder](https://the-decoder.com/googles-gemini-omni-1-2-flash-stretches-ai-video-clips-to-15-seconds-and-cuts-pricing-by-30-percent/)
- [Huawei, Tencent back AI agent pact on safety, user control — MLex](https://www.mlex.com/mlex/articles/2546595/huawei-tencent-back-ai-agent-pact-on-safety-user-control)
- [Pentagon chief technology officer says government will detail laws that apply to AI labs — Reuters](https://www.reuters.com/legal/litigation/pentagon-chief-tech-officer-says-government-will-detail-laws-that-apply-ai-labs-2026-11-04)
- [SWE-2 Flash — Cognition](https://cognition.com/blog/swe-2-flash)
- [Self-driving codebases — Cursor](https://cursor.com/blog/self-driving-codebases)
- [Give your coding agent a head start with Microsoft Agent Framework skills — Microsoft](https://devblogs.microsoft.com/agent-framework/give-your-coding-agent-a-head-start-with-microsoft-agent-framework-skills-for-net-and-python/)
- [Zetrix AI, China Academy of Information launch cross-border agent identity service KYA — Yahoo Finance SG](https://sg.finance.yahoo.com/news/zetrix-ai-china-academy-information-085600223.html)
- [Vietnam AI4VN 2026 summit opens in Hanoi](https://dev.to/vuhung16au/vietnam-ai-llm-daily-briefing-nov-05-2026-130d)
- [UAE launches AED 9M government AI challenge — Middle East AI News](https://www.middleeastainews.com/p/uae-launches-government-ai-challenge)
- [Abu Dhabi's AIREV secures backing of Singapore's Terra Invest — Arabian Business](https://www.arabianbusiness.com/abnews/abu-dhabis-airev-secures-backing-of-singapores-terra-invest-for-strategic-funding-round)
- [INSEAD-backed KrosAI raises $135K to wire AI voice agents into Africa's PH — Dealroom](https://dealroom.co/news/169763-insead-backed-krosai-raises-135k-to-wire-ai-voice-agents-into-africas-ph)
- [Colombia's Celes raises $5M Series A to enter Brazil's retail market — Dealroom](https://dealroom.co/news/167686-colombias-celes-raises-5m-series-a-to-enter-brazils-retail-market)
- [Sand.ai enters unicorn club — DealStreetAsia](https://www.dealstreetasia.com/stories/sand-ai-enters-unicorn-club-500283)
- [AI-powered insurance startup Kalepa valued at $470 million in new funding round — Reuters](https://www.reuters.com/legal/transactional/ai-powered-insurance-startup-kalepa-valued-470-million-new-funding-round-2026-11-05)
- [Introducing latency metrics for Mastra agents](https://mastra.ai/blog/introducing-latency-metrics)
- [Build with Studio — Mistral](https://mistral.ai/news/build-with-studio/)
- [Durable Agent explained — Alibaba Cloud](https://www.alibabacloud.com/blog/durable-agent-explained-how-to-keep-an-agent-running-reliably-in-the-cloud-over-the-long-term_603735)
- [Introducing Zep Agent Skills](https://www.getzep.com/blog/introducing-zep-agent-skills)
- [Kong launches AI Registry / Volcano SDK](https://konghq.com/blog/product-releases/kong-ai-registry)
- [Dharma Field Extractor — Hugging Face](https://huggingface.co/blog/Dharma-AI/dharma-field-extractor)

Sources above were retrieved on 2026-11-06.
