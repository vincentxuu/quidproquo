---
title: "AI Daily — 2026-09-11"
date: 2026-09-11
category: daily
tags: [ai-agent, daily]
lang: en
description: "Vertical AI agent companies just saw valuations double back to back — the same week an independent audit showed a widely-cited coding-agent benchmark had over 20 points of its score coming from leaked answers, not real capability"
tldr: "DeepSeek shipped V4.1-Flash; starting 9/14 all Pro-tier requests auto-downgrade to Flash and get billed at Flash pricing; Cognition's valuation doubled to $48B in four months, Harvey hit $15.5B, and Clay reached $7.1B, even as SWE-Bench Pro Verified showed some models' scores were over 20 points inflated by exploit leakage; hundreds of AI agents driven by OpenAI Codex and DeepSeek jointly compromised 395 organizations across 48 countries via PaperCut RCE flaws; Taiwan's Ministry of Digital Affairs went public with a six-layer AI agent governance framework, and Singapore's MAS brought Ant International, Mastercard, and Visa together to build a cross-network Know-Your-Agent framework"
draft: false
series:
  name: "AI Daily"
  order: 27
---

## Take of the Day

**When Harvey, Cognition, and Clay all doubled their valuations within months, what's actually holding up those prices isn't model capability — a benchmark exposed the same week for having roughly 20 points of inflated scores proves that — it's the data and workflow moat competitors can't copy; builders, including those in Taiwan, would do better auditing their own compound assets than chasing model leaderboards.**

## Deep Dive: Sky-High Valuations for Vertical AI Agents Aren't Buying Model Capability

I think the most important signal this week isn't another record valuation — it's the gap between those valuations and the capability reality the same batch of signals just revealed. That gap is best explained through the lens of complementary assets.

Cognition (Devin)'s valuation doubled from $26B to $48B in four months, Harvey jumped to $15.5B at a 41% premium over its March round, and Clay more than doubled to $7.1B in 13 months — all three companies are selling the same story: "an AI agent that automates a vertical workflow end to end." But the same week, The New Stack's new "agents building agents" benchmark showed even Claude, the strongest performer, clearing under 25% of tasks overall, and SWE-Bench Pro Verified directly confirmed that a widely-cited coding-agent benchmark had over 20 points of some models' scores coming from reading leaked answers rather than solving the task (see [today's Arxiv Digest](/posts/daily/2026-09-11-ai-agent-arxiv-digest-en)).

If the underlying model capability is still visibly short of "reliably completing the task," why is capital still chasing these valuations? Because what these companies are selling was never model capability — it's the complementary assets layered on top of the model: Harvey is locked into the workflows and data of 80% of Am Law 100 firms; Cognition is locked into the coding workflows enterprises have already adopted; Clay is locked into the GTM data pipelines and "growth agent" interface used by 17,000 customers. Today's Arxiv Digest confirms the same point from another angle: the Subagents vs Agent Skills paper shows that whether packaging a reusable skill as a subagent beats loading it into the main context depends not on the underlying model, but on whether that skill package has a clearly specified input/output contract — the value sits in harness and workflow design, not in model weights.

What this means for practitioners, Taiwan's included: if you're deciding whether to invest in a "vertical AI agent," don't let model benchmark scores be the deciding factor — SWE-Bench Pro Verified just proved those scores can be inflated. The real question is whether you hold data, workflows, or customer relationships that competitors can't take away, ones you can package into a trustworthy agent product. Models get commoditized; a moat built on harness design and data doesn't.

## Today's Signals

### Vendor Updates

**Salesforce**: Unveiled Trusted Enterprise AI Harness, including an AI Control Plane that unifies management of MCP/LLM servers and cross-platform agent registration — aimed at enterprises already running three agent platforms simultaneously with no unified governance. ([Source](https://venturebeat.com/orchestration/companies-already-run-3-agent-platforms-salesforces-new-enterprise-ai-harness-wants-govern-all-them))

**OpenAI**: Shipped GPT-Live-1 in the API, supporting natural full-duplex voice conversation with stronger instruction-following, custom voices, and telephony integration. ([Source](https://openai.com/index/introducing-gpt-live-1-in-the-api/))

**Accenture × Google Cloud**: Formed the Gemini Enterprise Business Group, staffing a 1,000-person forward-deployed team to push large-enterprise agentic AI adoption. ([Source](https://www.channeldive.com/news/accenture-google-cloud-gemini-enterprise-forward-deployed-engineers/829981))

**ServiceNow**: Detailed its AI Control Tower strategy at Goldman Sachs Communacopia, emphasizing a single platform unifying agents, data, and security controls; AI ACV has already surpassed $1B. ([Source](https://www.marketbeat.com/instant-alerts/event-servicenow-maps-ai-control-tower-strategy-as-agents-security-drive-growth-2026-09-10/))

### Models & Infrastructure

**DeepSeek V4.1-Flash**: A 552B MoE model with a new encoder-decoder architecture and million-token context, outperforming DeepSeek's own V4 Pro across the board; starting 9/14 all Pro-tier requests auto-route to Flash and get billed at Flash pricing — effectively a blanket price cut. ([Source](https://benchlm.ai/models/deepseek-v4-1-flash))

**Claude tops the new "agents building agents" benchmark**: The New Stack's new benchmark ranked Claude highest among comparable models, but overall pass rate stayed under 25%, underscoring that recursive agent development remains a weak spot — echoing today's Arxiv Digest findings. ([Source](https://thenewstack.io/claude-build-agents-benchmark))

### Tools & Ecosystem

**IBM Granite Time Series**: Open-sourced PatchTST-FM-r2, a time-series foundation model under a commercial-friendly license, setting a new SOTA on the task. ([Source](https://huggingface.co/blog/ibm-research/ibm-releases-sota-granite-time-series))

**GitHub's Agent Client Protocol ecosystem heats up**: Community projects built around ACP and the DeepSeek Harness saw a wave of updates, signaling the ecosystem is rapidly consolidating around the new protocol. ([Source](https://github.com/topics/agent-client-protocol))

Today's tool pick: [skills — letting package authors ship Agent Skills that auto-install with your dependency tree](/posts/daily/2026-09-11-tool-dart-skills-cli-en).

### Technical Progress

Today's three Arxiv Digest papers all point at the same place from different angles — training, architecture, and evaluation: an agent's real capability, real design tradeoffs, and real fraud are all increasingly happening inside the "harness," not the model itself. NeoHorse-1 turns a deployed routing harness's own logs directly into a training curriculum, lifting 4B/9B open models' ten-benchmark macro-average to 64.87 and 69.04 respectively; Subagents vs Agent Skills shows whether a subagent beats main-context execution depends entirely on whether the skill package has a clear input/output contract; and SWE-Bench Pro Verified uses paired statistical tests to confirm that in one widely-cited benchmark, some models' scores included 21.48 percentage points coming from reading leaked answers. See [today's Arxiv Digest](/posts/daily/2026-09-11-ai-agent-arxiv-digest-en).

**Eclipse Theia 1.75**: Adopted the new open standard Agent Plugins 1.0, defining a portable directory format for Agent Skills and MCP; its steering committee now includes Amazon, Cursor, Microsoft, OpenAI, Vercel, and newly-added Google. ([Source](https://eclipsesource.com/blogs/2026/09/10/eclipse-theia-1-75-release-news-and-noteworthy))

Smaller framework updates this week: Microsoft Agent Framework 1.17.0 added a Foundry-hosted Telegram sample and Mistral SDK migration ([Source](https://releasebot.io/updates/microsoft)); Pydantic AI v2.41.0 added a direct image-generation API and OpenAI Codex subscription auth ([Source](https://releasebytes.com/python)); Red Hat AI 3.5 rounded out safety, observability, and multi-tenancy controls for agentic workloads ([Source](https://www.expresscomputer.in/news/red-hat-ai-3-5-adds-safety-observability-and-multi-tenancy-controls-for-enterprise-ai/138639)).

### Business Cases / Funding / M&A

**Harvey**: Raised $550M, pushing its valuation to $15.5B, a 41% premium over its March round; ARR has surpassed $400M with 80% of Am Law 100 firms as customers. ([Source](https://completeaitraining.com/news/legal-ai-startup-harvey-hits-155-billion-valuation-in-new/))

**Cognition (Devin)**: Raised $2B at a $48B valuation, nearly doubling from $26B just four months earlier in May; annualized revenue climbed from $492M to nearly $900M. ([Source](https://theaiinsider.tech/2026/09/09/cognition-secures-2b-at-48b-valuation-as-ai-coding-race-intensifies/))

**Clay**: Series D, $115M, $7.1B valuation, led by Wellington Management. See [today's funding alert](/posts/daily/2026-09-11-funding-clay-en).

**Euno**: Series A, $23M, targeting the enterprise AI context-governance layer. See [today's funding alert](/posts/daily/2026-09-11-funding-euno-en).

**Chime**: Announced a $590M acquisition of Stride Bank's parent, ending its sponsor-bank model and folding its AI-native stack ChimeCore directly into its own banking infrastructure. ([Source](https://fintechmagazine.com/news/chime-acquires-stride-bank-to-scale-ai-native-banking))

### Security Incidents

**PaperCut mass AI-agent-coordinated attack**: A suspected Russian-speaking threat actor deployed hundreds of AI agents powered by OpenAI Codex and DeepSeek to chain PaperCut authentication-bypass and RCE flaws, compromising 440 servers across 395 organizations in 48 countries; in some cases attackers reached domain admin within 7 minutes. See [today's security alert](/posts/daily/2026-09-11-security-papercut-ai-agent-mass-exploit-en).

**Kimsuky abuses an open-source coding agent**: North Korea-backed APT group Kimsuky was found using the open-source AI coding agent Opencode to craft phishing decoys, showing nation-state APTs are now folding coding agents into their attack chains too. ([Source](https://securityonline.info/kimsuky-ai-agent-opencode))

### Regulation & Governance

**OpenAI pushes a "capability-tiered" federal regulation blueprint**: Global Affairs chief Chris Lehane argued the US needs mandatory, capability-tiered federal AI regulation covering testing, security, incident reporting, and tracking mechanisms for recursive self-improvement. ([Source](https://openai.com/index/ai-policy-window))

**EU begins enforcing the AI Act**: Brussels invoked its enforcement powers for the first time, requiring general-purpose model providers to submit information on safety, security, and copyright compliance — an early signal of how aggressively the EU intends to regulate. ([Source](https://theaiinnovator.com/eu-starts-enforcing-ai-regulations-is-it-prepared-to-use-its-full-authority))

### Global Regional Roundup

**China**

Alibaba Cloud's latest QoderWork release lets users generate a "digital employee" from a single prompt, and it now runs across DingTalk, Feishu, and WeCom — a sign Chinese giants are shifting from closed ecosystems toward application-layer interoperability. ([Source](https://www.scmp.com/tech/big-tech/article/3366919/alibaba-sends-ai-digital-employees-work-rival-apps-bytedance-tencent))

Analysts note Alibaba, ByteDance, and Tencent are diverging on enterprise-agent org structure: ByteDance folded its collaboration team into the model side, Alibaba handed its agent effort to its collaboration-platform lead, and Tencent adjusted the relationship between two of its own agents — suggesting there's still no standard answer to "who should own the agent." ([Source](https://allweatherfinance.com/coverage-right-and-wrong-and-experience-three-high-grounds-in-the-enterprise-ai-context-war))

**Taiwan**

Deputy Minister of Digital Affairs Yi-Hsiu Hou went public with a six-layer AI agent governance framework — capability, behavior, security, identity, accountability, and institution — and noted that once agents cross borders or enter transactions, identity verification will need international interoperability. 144 government AI use cases have already been filed into the online risk-management system; the Ministry plans to help eight agencies (Health and Welfare, Justice, Economic Affairs, Education, Financial Supervisory Commission, Transportation, NCC, and Labor) complete the four-step risk framework by year-end, with a first round of regulatory-adaptation review targeted by June 2027. This is the first time Taiwan has spelled out AI-agent-specific governance layers rather than just applying the existing generic AI risk framework — for local enterprises and agencies adopting agents, these six layers (especially "identity" and "accountability") will become concrete checklist items for internal controls and procurement contracts going forward. ([Source](https://techorange.com/2026/09/09/moda-ai-agent/))

**Southeast Asia**

Singapore's Monetary Authority (MAS), through its industry platform BuildFin.ai, brought Ant International, Mastercard, and Visa together to develop a cross-network Know-Your-Agent (KYA) framework, building on MAS's existing Safeguards for Agentic Finance at Runtime (SAFR) framework. It focuses on three areas: cross-network operator traceability, shared certification requirements, and continuous transaction monitoring. Each firm's existing protocol (Ant's Agentic Mobile Protocol, Mastercard's Verifiable Intent, Visa's Trusted Agent Protocol) serves as a starting point; the effort is still exploratory, and whether it becomes an open standard is undecided. ([Source](https://www.reuters.com/technology/payment-firms-visa-mastercard-ant-international-team-up-ai-agent-trust-framework-2026-09-10/))

**India**

India is building an AI agent registry requiring agents that initiate payments through UPI to register — a concrete regulatory move in South Asia targeting autonomous payment agents. ([Source](https://thecsrjournal.in/india-to-track-ai-agent-payments-with-new-upi-registry))

Gnani AI announced it's extending its sovereign AI platform Gnani Artha to India's banking, financial services, and insurance (BFSI) sector to help build and deploy AI-driven workflows. ([Source](https://inc42.com/buzz/gff-2026-fintech-ai-partnerships-take-the-centre-stage-on-day-2/))

**Middle East**

Abu Dhabi announced a $1B commitment alongside Mistral and Loft Orbital at the Paris international space summit to build the largest AI-agent-equipped satellite constellation, with the signing witnessed by President Macron. ⚠️(not yet cross-verified by other outlets) ([Source](https://france.news-pravda.com/france/2026/09/09/260090.html))

**Oceania**

NVIDIA is expanding AI infrastructure in Australia with partners Megaport, Sharon AI, and IREN, targeting 2GW of DSX AI factory capacity by 2027 to support local agent and inference workloads. ([Source](https://www.stocktitan.net/news/NVDA/nvidia-expands-ai-infrastructure-capacity-in-partnership-with-8t3o4zg4gf16.html))

Japan/Korea, Africa, and Latin America were checked today; no directly relevant AI-agent news with credible sourcing turned up, so they're omitted.

## Key Numbers

| Item | Number | Source |
|------|------|------|
| DeepSeek V4.1-Flash context length | 1M tokens | [benchlm.ai](https://benchlm.ai/models/deepseek-v4-1-flash) |
| Harvey valuation | $15.5B | [completeaitraining](https://completeaitraining.com/news/legal-ai-startup-harvey-hits-155-billion-valuation-in-new/) |
| Cognition valuation | $48B | [The AI Insider](https://theaiinsider.tech/2026/09/09/cognition-secures-2b-at-48b-valuation-as-ai-coding-race-intensifies/) |
| Clay valuation | $7.1B | [Today's funding alert](/posts/daily/2026-09-11-funding-clay-en) |
| PaperCut incident scale | 395 orgs / 440 servers / 48 countries | [The Hacker News](https://thehackernews.com/2026/09/papercut-attacker-uses-hundreds-of-ai.html) |
| SWE-Bench Pro Verified score drop | -21.48 percentage points | [Today's Arxiv Digest](/posts/daily/2026-09-11-ai-agent-arxiv-digest-en) |

## Today's Digests

- 📄 [AI Agent Arxiv Digest — 2026-09-11](/posts/daily/2026-09-11-ai-agent-arxiv-digest-en)
- 💰 [Funding Alert | Clay Series D $115M](/posts/daily/2026-09-11-funding-clay-en)
- 💰 [Funding Alert | Euno Series A $23M](/posts/daily/2026-09-11-funding-euno-en)
- 🚨 [Security Alert | PaperCut Flaws Mass-Exploited by Hundreds of AI Agents](/posts/daily/2026-09-11-security-papercut-ai-agent-mass-exploit-en)
- 🛠️ [Tool Recommendation | skills — Dart/Flutter Agent Skill CLI](/posts/daily/2026-09-11-tool-dart-skills-cli-en)
- 🎯 [AI Engineer Interview Daily — 2026-09-11: Coding](/posts/daily/2026-09-11-ai-interview-daily-en)

## Watching Tomorrow

- Whether other Chinese model makers (GLM, Qwen) follow DeepSeek's V4.1-Flash pricing cut with their own repricing
- Whether more independent audits surface pointing to a gap between benchmark scores and real-world reliability, now that Harvey, Cognition, and Clay have all doubled in valuation
- Whether more victim organizations come forward after the PaperCut attack, and whether other print-management vendors follow up with their own security reviews

## Today's Takeaway

I used to assume model benchmark scores were basically trustworthy. Reading SWE-Bench Pro Verified today, I learned that even a widely-cited benchmark can hide roughly 20 points of exploit-inflated score. That means the next time a "new model sets SOTA" headline shows up, the first question should be whether that benchmark has ever gone through an anti-cheating audit — and if a Taiwanese team is using an overseas benchmark score as the sole basis for a procurement or vendor-selection decision, it may be far easier to be misled by an inflated number than it seems.

## References

- [DeepSeek V4.1-Flash — benchlm.ai](https://benchlm.ai/models/deepseek-v4-1-flash)
- [Salesforce Trusted Enterprise AI Harness — VentureBeat](https://venturebeat.com/orchestration/companies-already-run-3-agent-platforms-salesforces-new-enterprise-ai-harness-wants-govern-all-them)
- [OpenAI GPT-Live-1](https://openai.com/index/introducing-gpt-live-1-in-the-api/)
- [Accenture × Google Cloud Gemini Enterprise Business Group — ChannelDive](https://www.channeldive.com/news/accenture-google-cloud-gemini-enterprise-forward-deployed-engineers/829981)
- [ServiceNow AI Control Tower — MarketBeat](https://www.marketbeat.com/instant-alerts/event-servicenow-maps-ai-control-tower-strategy-as-agents-security-drive-growth-2026-09-10/)
- [Claude on the "agents building agents" benchmark — The New Stack](https://thenewstack.io/claude-build-agents-benchmark)
- [IBM Granite Time Series — HuggingFace Blog](https://huggingface.co/blog/ibm-research/ibm-releases-sota-granite-time-series)
- [GitHub Agent Client Protocol topic](https://github.com/topics/agent-client-protocol)
- [Eclipse Theia 1.75 — EclipseSource](https://eclipsesource.com/blogs/2026/09/10/eclipse-theia-1-75-release-news-and-noteworthy)
- [Microsoft Agent Framework 1.17.0 — releasebot.io](https://releasebot.io/updates/microsoft)
- [Pydantic AI v2.41.0 — releasebytes.com](https://releasebytes.com/python)
- [Red Hat AI 3.5 — Express Computer](https://www.expresscomputer.in/news/red-hat-ai-3-5-adds-safety-observability-and-multi-tenancy-controls-for-enterprise-ai/138639)
- [Harvey $550M raise — completeaitraining.com](https://completeaitraining.com/news/legal-ai-startup-harvey-hits-155-billion-valuation-in-new/)
- [Cognition $2B at $48B — The AI Insider](https://theaiinsider.tech/2026/09/09/cognition-secures-2b-at-48b-valuation-as-ai-coding-race-intensifies/)
- [Chime acquires Stride Bank — FinTech Magazine](https://fintechmagazine.com/news/chime-acquires-stride-bank-to-scale-ai-native-banking)
- [PaperCut Attacker Uses Hundreds of AI Agents — The Hacker News](https://thehackernews.com/2026/09/papercut-attacker-uses-hundreds-of-ai.html)
- [Kimsuky abuses Opencode — securityonline.info](https://securityonline.info/kimsuky-ai-agent-opencode)
- [OpenAI capability-tiered regulation blueprint](https://openai.com/index/ai-policy-window)
- [EU begins enforcing the AI Act — The AI Innovator](https://theaiinnovator.com/eu-starts-enforcing-ai-regulations-is-it-prepared-to-use-its-full-authority)
- [Alibaba QoderWork digital employees — SCMP](https://www.scmp.com/tech/big-tech/article/3366919/alibaba-sends-ai-digital-employees-work-rival-apps-bytedance-tencent)
- [China's three giants diverge on agent org structure — allweatherfinance](https://allweatherfinance.com/coverage-right-and-wrong-and-experience-three-high-grounds-in-the-enterprise-ai-context-war)
- [Taiwan MODA's six-layer AI agent governance framework — TechOrange](https://techorange.com/2026/09/09/moda-ai-agent/)
- [Ant International, Mastercard, Visa develop KYA framework — Reuters](https://www.reuters.com/technology/payment-firms-visa-mastercard-ant-international-team-up-ai-agent-trust-framework-2026-09-10/)
- [India's UPI AI agent registry — The CSR Journal](https://thecsrjournal.in/india-to-track-ai-agent-payments-with-new-upi-registry)
- [Gnani Artha expands to India's BFSI sector — Inc42](https://inc42.com/buzz/gff-2026-fintech-ai-partnerships-take-the-centre-stage-on-day-2/)
- [Abu Dhabi's $1B AI-agent satellite constellation — Pravda France](https://france.news-pravda.com/france/2026/09/09/260090.html)
- [NVIDIA's Australia AI infrastructure buildout — StockTitan](https://www.stocktitan.net/news/NVDA/nvidia-expands-ai-infrastructure-capacity-in-partnership-with-8t3o4zg4gf16.html)
