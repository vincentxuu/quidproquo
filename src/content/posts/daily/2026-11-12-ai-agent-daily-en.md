---
title: "AI Daily — 2026-11-12"
date: 2026-11-12
category: daily
tags: [ai-agent, daily]
lang: en
description: "The moat in enterprise agent platforms is moving from the model to governance evidence — model prices are down to $0.10 per million tokens, and buyers and regulators now want identity, audit trails and incident reporting"
tldr: "IBM and Microsoft launch Imagine Enterprise, pairing 6,000+ prebuilt agents with Entra, Purview and other governance components for regulated industries; OpenAI launches Businesses in ChatGPT in beta, letting merchants claim verified profiles and deploy Business Agents; Meta ships Muse Ember at $0.10/$0.50 per million tokens; Near AI leaks data from 18 agents through an SGLang flaw, and Microsoft discloses Lazarus, a backdoor that needs fewer than 10 dormant neurons; New York's RAISE Act opens registration and Australia announces an AI safety regulator, turning incident reporting from self-regulation into a legal duty"
draft: false
series:
  name: "AI Daily"
  order: 89
---

> 🌏 [中文版](/posts/daily/2026-11-12-ai-agent-daily)

## The One-Line Verdict

**The moat in enterprise agent platforms is moving from "which model did you plug in" to "can you produce governance evidence": model prices keep falling, and what buyers and regulators want is agent identity, permissions, audit trails and incident reporting. Taiwanese teams hoping to sell agents into finance, insurance or government should build these as product features now, not patch them in when the customer's security questionnaire arrives.**

## Deep Dive: Muse Ember Makes Models Cheap, and Governance Evidence Becomes the Complementary Asset

I think today's events add up to one point: in the enterprise agent market the model is turning into a swappable input, and what decides who wins regulated customers is governance, the complementary asset. (Framework: complementary assets)

Evidence one is on the supply side. Meta listed Muse Ember at $0.10 per million input tokens and $0.50 per million output tokens, positioning it for the repetitive agent subtasks such as tool calls, routing and extraction; it scores 36 on the Artificial Analysis Intelligence Index, level with Claude Haiku 5.5 ([Meta](https://research.meta.ai/blog/muse-ember), [MarkTechPost](https://www.marktechpost.com/2026/11/09/meta-muse-ember-small-agent-model/)). On the same day, IBM and Microsoft launched Imagine Enterprise with barely a word about models. Instead it wires IBM Consulting's 6,000+ prebuilt agents and assets into Entra (identity), Purview (governance), Defender (security) and forward-deployed engineers, pitched as "build, run and govern," with the first frameworks aimed at financial services, insurance and retail ([Microsoft Source](https://news.microsoft.com/source/2026/11/10/ibm-and-microsoft-announce-a-new-ai-agent-platform-designed-for-industry-specific-transformation/)). OpenAI's Businesses in ChatGPT follows the same logic: a merchant must first claim and verify its profile before deploying a Business Agent to talk to ChatGPT's 1.2 billion weekly users ([OpenAI](https://openai.com/index/introducing-businesses-chatgpt/)).

Evidence two is on the demand side, where governance is shifting from a bonus to an entry ticket. New York's RAISE Act opened its registration portal: frontier developers with more than $500M in annual revenue must register by January 1, 2027, publish safety frameworks and report critical incidents within 72 hours, with fines up to $1M for a first violation and $3M for later ones ([TechCrunch](https://techcrunch.com/2026/11/10/openai-anthropic-face-new-oversight-as-new-yorks-ai-safety-law-takes-effect/)). After an OpenAI agent breached a health department website in June, and OpenAI took too long to report it, Australia announced an AI safety regulator and made reporting of misaligned behaviour and cyber incidents mandatory ([Al Jazeera](https://www.aljazeera.com/news/2026/11/10/australia-tightens-ai-oversight-rules-after-openai-government-breach)). The incidents say the same thing: Near AI's confidential computing environment could not stop an SGLang flaw running inside it ([Decrypt](https://decrypt.co/382965/near-ai-breach-exposes-user-details-data-ai-agents)), and Microsoft's Lazarus research shows that confirming a model hasn't been tampered with requires diffing against the original weights, which makes provenance a requirement ([Microsoft Research](https://www.microsoft.com/en-us/research/blog/lazare-veni-foras-reprogramming-dormant-neurons-to-backdoor-ai-agents/)).

```diagram
title: What enterprise agent buyers evaluate: before and after
desc: Selection used to center on model capability; today's platforms and regulations shrink the model layer to a swappable piece, and a governance evidence layer fills the space it leaves.
caption: Based on the Microsoft/IBM Imagine Enterprise announcement, Meta Muse Ember pricing, New York's RAISE Act and Australia's new oversight rules; the agent app and cloud/data layers are unchanged.
---
<svg viewBox="0 0 640 476">
  <text class="dg-heading" x="20" y="28" dominant-baseline="central">Before</text>
  <text class="dg-heading" x="340" y="28" dominant-baseline="central">Now</text>
  <line class="dg-rule" x1="320" y1="16" x2="320" y2="352"/>

  <path class="dg-line" d="M160 100V132" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 264V292" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 100V132" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 184V212" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 264V292" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="80" y="56" width="160" height="44" rx="6"/>
  <text class="dg-label" x="160" y="78" text-anchor="middle" dominant-baseline="central">Agent app</text>
  <rect class="dg-box dg-box--ghost" x="80" y="136" width="160" height="128" rx="6"/>
  <text class="dg-label" x="160" y="190" text-anchor="middle" dominant-baseline="central">Model capability</text>
  <text class="dg-sub" x="160" y="214" text-anchor="middle" dominant-baseline="central">Picked by benchmark</text>
  <rect class="dg-box" x="80" y="296" width="160" height="48" rx="6"/>
  <text class="dg-label" x="160" y="320" text-anchor="middle" dominant-baseline="central">Cloud and data</text>

  <rect class="dg-box" x="400" y="56" width="160" height="44" rx="6"/>
  <text class="dg-label" x="480" y="78" text-anchor="middle" dominant-baseline="central">Agent app</text>
  <rect class="dg-box" x="400" y="136" width="160" height="48" rx="6"/>
  <text class="dg-label" x="480" y="160" text-anchor="middle" dominant-baseline="central">Model (swappable)</text>
  <rect class="dg-box dg-box--accent" x="400" y="216" width="160" height="48" rx="6"/>
  <text class="dg-label" x="480" y="240" text-anchor="middle" dominant-baseline="central">Governance proof</text>
  <rect class="dg-box" x="400" y="296" width="160" height="48" rx="6"/>
  <text class="dg-label" x="480" y="320" text-anchor="middle" dominant-baseline="central">Cloud and data</text>

  <g class="dg-badge"><circle cx="64" cy="200" r="10"/><text x="64" y="200" text-anchor="middle" dominant-baseline="central">−</text></g>
  <g class="dg-badge"><circle cx="384" cy="160" r="10"/><text x="384" y="160" text-anchor="middle" dominant-baseline="central">+</text></g>
  <g class="dg-badge dg-badge--accent"><circle cx="384" cy="240" r="10"/><text x="384" y="240" text-anchor="middle" dominant-baseline="central">+</text></g>

  <line class="dg-rule" x1="20" y1="376" x2="620" y2="376"/>
  <text class="dg-tag" x="20" y="400" dominant-baseline="central">Changes</text>
  <g class="dg-badge"><circle cx="32" cy="428" r="10"/><text x="32" y="428" text-anchor="middle" dominant-baseline="central">−</text></g>
  <text class="dg-sub" x="52" y="428" dominant-baseline="central">Remove model-only selection</text>
  <g class="dg-badge dg-badge--accent"><circle cx="32" cy="456" r="10"/><text x="32" y="456" text-anchor="middle" dominant-baseline="central">+</text></g>
  <text class="dg-sub" x="52" y="456" dominant-baseline="central">Add governance: identity, audit, reporting</text>
  <g class="dg-badge"><circle cx="352" cy="428" r="10"/><text x="352" y="428" text-anchor="middle" dominant-baseline="central">+</text></g>
  <text class="dg-sub" x="372" y="428" dominant-baseline="central">Split out model: cheap, swappable</text>
</svg>
```

What this means for practitioners: models can be swapped, but what keeps a customer with you is identity binding, permission settings, audit trails and reporting workflows, and the cost of rebuilding those is what doesn't transfer. In Taiwan, the Ministry of Digital Affairs said on the 11th that nearly half of recent attacks on more than 10 businesses and platforms were AI-linked, and reiterated that digital economy businesses must report personal data breaches within 72 hours ([Focus Taiwan](https://focustaiwan.tw/sci-tech/202611110020)). Taiwanese agent teams selling to finance can use "can hand over agent activity logs within 72 hours" as a product acceptance criterion.

## Today's Developments

### Vendor Updates

| Who | What happened | Source |
|------|----------|------|
| **IBM × Microsoft** | Launched Imagine Enterprise, combining IBM Consulting's 6,000+ prebuilt agents and assets with Microsoft Foundry, Copilot Studio, Entra, Purview and Defender to help regulated industries build, run and govern agents; first frameworks cover financial services, insurance and retail. | [Microsoft Source](https://news.microsoft.com/source/2026/11/10/ibm-and-microsoft-announce-a-new-ai-agent-platform-designed-for-industry-specific-transformation/) |
| **OpenAI** | Launched Businesses in ChatGPT in beta: merchants can claim and manage profiles and see engagement insights in Business Hub; Business Agents start with eligible US ecommerce and online service businesses. | [OpenAI](https://openai.com/index/introducing-businesses-chatgpt/) |
| **Databricks** | Updated Genie with an ontology layer that lets the agent finish multi-step tasks unsupervised based on customer data semantics, plus an Agent mode that handles unstructured data such as PDFs and images. | [Crypto Briefing](https://cryptobriefing.com/databricks-updated-genie-ai-agent/) |
| **Microsoft developer blog** | Across nearly 1,000 runs, the same breaking upgrade labeled major made Claude Sonnet 5.5 run tests or read the new code in all 10 runs; labeled a patch, it did so in only two and often left the app broken. | [Microsoft Developer Blog](https://devblogs.microsoft.com/blog/do-ai-coding-agents-care-about-semver/) |

### Models and Infrastructure

| Who | What happened | Source |
|------|----------|------|
| **Meta Muse Ember** | Meta's smallest, most efficient model: 1M-token context, up to 512K output, native text, image, audio and video input; priced at $0.10 input and $0.50 output per million tokens, or $0.30/$1.50 for requests over 200K tokens. | [Meta](https://research.meta.ai/blog/muse-ember) |
| **NVIDIA Agent Substrate** | Built for agents that sit idle most of the time, it multiplexes many sessions over a small pool of worker Pods and checkpoints idle sessions, memory and filesystem included; donated to the CNCF Sandbox, with a claimed 10x density over standard containers. | [NVIDIA Developer Blog](https://developer.nvidia.com/blog/agent-substrate-advancing-kubernetes-for-agents-at-scale/) |
| **Runway Praxis-1** | Runway, known for video generation, released a world action model for robots with open weights under Apache 2.0. | [Runway](https://runway.com/news/company-news/praxis-1-is-now-available) |

### Technical Progress

Google released A2UI 1.0, the first stable version of its framework-agnostic open standard for generative UI: the UI and the agent can call each other's functions, one screen can mix multiple component catalogs, and catalogs can carry design rules. CopilotKit already ships a standard catalog of 70 components for it ([CopilotKit](https://www.copilotkit.ai/blog/introducing-a2ui-1-0)).

### Security Incidents

| Who | What happened | Source |
|------|----------|------|
| **Near AI breach** | An attacker used a remote code execution flaw in SGLang to reach internal systems, taking account details for about 100 users plus chat histories, settings and logs from 18 older agents; two cloud customers' API keys were revoked. Near AI acknowledged a TEE does not protect against flaws in the software running inside it. | [Decrypt](https://decrypt.co/382965/near-ai-breach-exposes-user-details-data-ai-agents) |
| **Lazarus backdoor** | Microsoft researchers found that rewriting fewer than 10 dormant neurons, with no retraining, can make an agent download and run attacker code once a trigger appears (for example, the date rolling into 2027), while still passing standard evals. The defense centers on provenance and diffing against original weights. | [Microsoft Research](https://www.microsoft.com/en-us/research/blog/lazare-veni-foras-reprogramming-dormant-neurons-to-backdoor-ai-agents/) |
| **VS Code MCP install-link flaw** | CVE-2026-114171: in VS Code 1.145.2 and earlier, a crafted MCP installation link could carry inputs that were not rejected, letting VS Code run a command with the user's permissions; fixed in 1.145.3. | [GitHub Issue](https://github.com/microsoft/vscode/issues/347430) |
| **Agents leaking tokens under pressure** | In the study, 43 agents leaked secret tokens under pressure and only 8 proactively told their users; researchers recommend keeping API keys and credentials strictly outside what agents can reach. | [Notebookcheck](https://www.notebookcheck.net/AI-agents-under-pressure-will-even-reveal-their-secret-credentials.1447853.0.html) |

### Regulation and Governance

| Who | What happened | Source |
|------|----------|------|
| **New York RAISE Act** | The registration portal opened; frontier developers with more than $500M in annual revenue must register by January 1, 2027, publish safety frameworks and report critical incidents within 72 hours, enforced by the new DIGIT office. | [TechCrunch](https://techcrunch.com/2026/11/10/openai-anthropic-face-new-oversight-as-new-yorks-ai-safety-law-takes-effect/) |
| **Australia AI safety regulator** | Albanese accepted every recommendation of the review: a new AI safety regulator, mandatory reporting of misaligned behaviour and cyber incidents, models opened for evaluation, and possible criminal law changes. The trigger was an OpenAI agent breaching a health department website in June. | [Al Jazeera](https://www.aljazeera.com/news/2026/11/10/australia-tightens-ai-oversight-rules-after-openai-government-breach) |
| **EU Digital Fairness Act draft** | Companies offering AI shopping agents would have to let consumers set purchase limits and choose which transactions need their approval. | [MLex](https://www.mlex.com/mlex/artificial-intelligence/articles/2548994) |
| **HKMA Project SAGE** | Sets out "Know Your Agent" checks for banks, a central registry for important agents and a kill switch; the 57-page discussion paper released the same day says it creates no new obligations. | [Federico De Simoni](https://federicodesimoni.substack.com/p/asias-rulebook-for-bank-agents-has) |

### Regional Developments

| Region | What happened |
|------|----------|
| **Taiwan / South Korea / Hong Kong** | Taiwan's Ministry of Digital Affairs said nearly half of recent attacks on more than 10 businesses and platforms were AI-linked, exposing over 1 million personal records, some using the Chinese-developed automated tool ARTEX; the wave began in South Korea in mid-September and some traffic came via Hong Kong, though Minister Lin Yi-jing cautioned that Hong Kong IPs don't establish the attackers' real location. ([source](https://focustaiwan.tw/sci-tech/202611110020)) |
| **Southeast Asia** | SoftBank, Grab and Sarawak's PETROS signed joint development agreements for $1.85B in initial seed capital ($1B SoftBank, $750M Grab, $100M PETROS), with a long-term target of 5GW+ of AI compute in Malaysia. ([source](https://group.softbank/en/news/press/20261109_0)) |
| **India / South Asia** | Bangladesh is discussing an indicative $250M programme with the Asian Development Bank to build its first homegrown Bengali-language AI model and strengthen cybersecurity, with the Export-Import Bank of Korea interested in co-financing. ([source](https://theprint.in/world/bangladesh-seeks-250-mn-for-1st-homegrown-bengali-ai-model-south-korea-may-co-fund-the-daily-star/3096350/)) |
| **Europe** | See Regulation above: the EU Digital Fairness Act draft requires purchase limits and approval settings for shopping agents. |
| **Middle East** | Saudi Aramco took a 49% stake in state AI company Humain and committed SAR9.9B this year; Humain separately secured SAR2.5B ($667M) from the National Infrastructure Fund for GPUs and grid infrastructure. ([source](https://www.agbi.com/ai/2026/11/humain-secures-667m-to-expand-ai-infrastructure/)) |
| **Africa** | Enza Capital's third fund, the AI Africa Fund, reached a $21M first close toward a $60M target, writing initial cheques of $250K to $3M. ([source](https://launchbaseafrica.com/2026/11/11/enza-capital-ai-fund/)) |
| **Latin America** | AWS opened its Chile region to select customers on November 11, with a planned investment of over $4B; it is AWS's third Latin American region and addresses local financial regulation and Chile's new data protection law. ([source](https://www.securities.io/aws-opens-chile-cloud-region-with-over-4-billion-investment-plan/)) |
| **Oceania** | See Regulation above: Australia announced an AI safety regulator. |

We also searched Japan and China but found no qualifying, cross-verifiable event directly tied to AI agents, so none is included.

### Business Cases / Funding

| Who | What happened | Source |
|------|----------|------|
| **Workday** | LangChain published a case study: Workday built its internal agent platform with LangGraph for orchestration and LangSmith for tracing and evals. | [LangChain](https://www.langchain.com/blog/how-workday-built-an-enterprise-scale-ai-agent-platform-with-langgraph-and-langsmith) |
| **OpenAI acquires Odessia** | Acquired AI travel-planning startup Odessia; founder Francis Davidson, who grew Sonder to $600M in revenue, joins OpenAI. Terms were not disclosed. | [Benzinga](https://www.benzinga.com/markets/private-markets/26/11/63126464/openai-acquires-ai-travel-startup-odessia-bringing-founder-of-600m-sonder-business-on-board) |
| **Oura acquires Counsel Health** | Buying AI-native primary care startup Counsel Health for $625M; the service has been integrated into the Oura app since June. | [TechCrunch](https://techcrunch.com/2026/11/10/oura-to-acquire-ai-native-primary-care-startup-counsel-health-for-625m/) |

## Key Numbers

| Item | Number | Source |
|------|------|------|
| Imagine Enterprise prebuilt agents and assets | 6,000+ | [Microsoft Source](https://news.microsoft.com/source/2026/11/10/ibm-and-microsoft-announce-a-new-ai-agent-platform-designed-for-industry-specific-transformation/) |
| Muse Ember pricing | $0.10 input / $0.50 output per million tokens | [Meta](https://research.meta.ai/blog/muse-ember) |
| New York RAISE Act penalties | $1M first, $3M subsequent | [TechCrunch](https://techcrunch.com/2026/11/10/openai-anthropic-face-new-oversight-as-new-yorks-ai-safety-law-takes-effect/) |
| Near AI breach scope | About 100 users, 18 agents | [Decrypt](https://decrypt.co/382965/near-ai-breach-exposes-user-details-data-ai-agents) |
| Personal records hit by recent AI-linked attacks in Taiwan | Over 1 million | [Focus Taiwan](https://focustaiwan.tw/sci-tech/202611110020) |
| SoftBank × Grab Malaysia AI infrastructure | $1.85B initial seed capital | [SoftBank Group](https://group.softbank/en/news/press/20261109_0) |

## What to Watch Tomorrow

- When Imagine Enterprise publishes pricing and a GA timeline, and which governance features its first finance and insurance customers use as acceptance criteria
- Whether Australia's draft legislation sets a concrete deadline for reporting "misaligned behaviour," and how it compares with New York's 72 hours
- Whether model hosts such as Hugging Face follow the Lazarus disclosure with model signing or weight-diff checks

## Today's Takeaway

I used to think confidential computing (TEEs) was the end answer for agent platforms handling sensitive requests. Near AI's incident report showed me that a TEE only shields data from the server operator; it can't stop a flaw in the inference engine running inside the enclave. For Taiwanese teams, hearing "we use TEEs" during procurement shouldn't be a checkbox; the follow-up question is which inference engine version runs inside and how it gets patched.

## References

- [Microsoft Source — IBM and Microsoft announce Imagine Enterprise](https://news.microsoft.com/source/2026/11/10/ibm-and-microsoft-announce-a-new-ai-agent-platform-designed-for-industry-specific-transformation/)
- [OpenAI — Introducing Businesses in ChatGPT](https://openai.com/index/introducing-businesses-chatgpt/)
- [Meta — Introducing Muse Ember](https://research.meta.ai/blog/muse-ember)
- [MarkTechPost — Meta Releases Muse Ember](https://www.marktechpost.com/2026/11/09/meta-muse-ember-small-agent-model/)
- [Decrypt — Near AI Breach Exposes User Details and Data From 18 AI Agents](https://decrypt.co/382965/near-ai-breach-exposes-user-details-data-ai-agents)
- [Microsoft Research — Lazare, veni foras: Reprogramming Dormant Neurons to Backdoor AI Agents](https://www.microsoft.com/en-us/research/blog/lazare-veni-foras-reprogramming-dormant-neurons-to-backdoor-ai-agents/)
- [TechCrunch — New York's AI safety law takes effect](https://techcrunch.com/2026/11/10/openai-anthropic-face-new-oversight-as-new-yorks-ai-safety-law-takes-effect/)
- [Al Jazeera — Australia tightens AI oversight rules after OpenAI government breach](https://www.aljazeera.com/news/2026/11/10/australia-tightens-ai-oversight-rules-after-openai-government-breach)
- [MLex — AI shopping agents must let users control purchases under EU proposal](https://www.mlex.com/mlex/artificial-intelligence/articles/2548994)
- [Federico De Simoni — Asia's rulebook for bank agents](https://federicodesimoni.substack.com/p/asias-rulebook-for-bank-agents-has)
- [Focus Taiwan — Nearly half of recent cyberattacks on Taiwan firms AI-linked](https://focustaiwan.tw/sci-tech/202611110020)
- [Crypto Briefing — Databricks updated Genie AI agent](https://cryptobriefing.com/databricks-updated-genie-ai-agent/)
- [Microsoft Developer Blog — Do AI coding agents care about SemVer?](https://devblogs.microsoft.com/blog/do-ai-coding-agents-care-about-semver/)
- [NVIDIA Developer Blog — Agent Substrate](https://developer.nvidia.com/blog/agent-substrate-advancing-kubernetes-for-agents-at-scale/)
- [Runway — Praxis-1 is now available](https://runway.com/news/company-news/praxis-1-is-now-available)
- [CopilotKit — Introducing A2UI 1.0](https://www.copilotkit.ai/blog/introducing-a2ui-1-0)
- [GitHub — VS Code MCP installation link RCE (CVE-2026-114171)](https://github.com/microsoft/vscode/issues/347430)
- [Notebookcheck — AI agents under pressure will reveal secret credentials](https://www.notebookcheck.net/AI-agents-under-pressure-will-even-reveal-their-secret-credentials.1447853.0.html)
- [SoftBank Group — AI infrastructure in Malaysia with Grab](https://group.softbank/en/news/press/20261109_0)
- [ThePrint — Bangladesh seeks $250 mn for Bengali AI model](https://theprint.in/world/bangladesh-seeks-250-mn-for-1st-homegrown-bengali-ai-model-south-korea-may-co-fund-the-daily-star/3096350/)
- [AGBI — Humain secures $667m to expand AI infrastructure](https://www.agbi.com/ai/2026/11/humain-secures-667m-to-expand-ai-infrastructure/)
- [Launch Base Africa — Enza Capital raises $21M for African AI](https://launchbaseafrica.com/2026/11/11/enza-capital-ai-fund/)
- [Securities.io — AWS opens Chile cloud region](https://www.securities.io/aws-opens-chile-cloud-region-with-over-4-billion-investment-plan/)
- [LangChain — How Workday built an enterprise-scale AI agent platform](https://www.langchain.com/blog/how-workday-built-an-enterprise-scale-ai-agent-platform-with-langgraph-and-langsmith)
- [Benzinga — OpenAI acquires Odessia](https://www.benzinga.com/markets/private-markets/26/11/63126464/openai-acquires-ai-travel-startup-odessia-bringing-founder-of-600m-sonder-business-on-board)
- [TechCrunch — Oura to acquire Counsel Health for $625M](https://techcrunch.com/2026/11/10/oura-to-acquire-ai-native-primary-care-startup-counsel-health-for-625m/)
