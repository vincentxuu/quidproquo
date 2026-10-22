---
title: "AI Daily — 2026-10-23"
date: 2026-10-23
category: daily
tags: [ai-agent, daily]
lang: en
description: "The same day Google slashed the cost of running a huge fleet of autonomous agents, US banks started tightening the trust budget for letting an agent act under your identity — capacity is scaling up while the trust layer pulls back"
tldr: "Google's Agent Compute Engine runs every Gemini agent in its own hardware-isolated microVM, packing 10x more agents per server; the same day, major US banks began locking out AI agents that log in with customer credentials; Anthropic ships a preview of \"Claude Duet,\" a proactive personal agent; a suspected China-linked actor used AI agents to breach 48 government and corporate targets across Asia; DeepSeek closes a \\$15B round pushing its valuation toward \\$89B, two days after the US ordered federal agencies to remove its systems"
draft: false
series:
  name: "AI 日報"
  order: 69
---

> 🌏 [中文版](/posts/daily/2026-10-23-ai-agent-daily)

## Today's Take

**The same day Google cut the compute cost of running a huge fleet of autonomous agents, US banks started tightening the trust budget for letting an agent act under your identity — infrastructure capacity is scaling up while the trust and verification layer is pulling back.**

## Deep Dive: Capacity Scaled Up, Trust Didn't Keep Pace

I think the thread worth pulling today is that two lines — the "capacity" for autonomous agents and the "trust" placed in them — are moving in opposite directions. (Framework: transaction cost)

Google's Agent Compute Engine drove the transaction cost of running a large fleet of autonomous agents way down: every Gemini agent runs in its own hardware-isolated microVM, idle ones auto-suspend to free resources, a single server can now pack 10x more agents, and in a 200,000-agent test, suspend/resume completed within 500ms. Technically, running far more agents autonomously is no longer the bottleneck.

But the same day, Axios reported that Morgan Stanley, JPMorgan, Bank of America, and Wells Fargo had started locking out AI agents that log in with customer credentials, because some agents take action on their own without a direct instruction from the user — most banks now prefer to grant read-only access instead. In other words, the "trust transaction cost" of letting an agent act under a user's identity did not fall alongside the infrastructure cost — it got tighter. Today's arxiv paper puts a number on that exact gap: coding agents completed 86.1% of tasks on average, but only 15.2% backed up state first (details below under "Technical Progress") — the capability to act has already outrun the awareness of acting dangerously. A suspected China-linked actor using AI agents to automate breaches of 48 targets across Asia is that downside risk already playing out, not a hypothetical.

What this means for practitioners: a headline about scaled-up capacity doesn't mean it's safe to let agents act autonomously — the real question is how fast you'd notice and recover if one acted wrongly. For Taiwanese teams evaluating whether to let an agent touch customer accounts, payments, or internal-system credentials directly, this round of US bank lockdowns is a ready-made reference: draw the line between "read-only" and "can act" first, and decide on autonomy second — not the other way around.

## Today's Developments

### Vendor Moves

**Anthropic**: Shipped a preview of "Claude Duet," a proactive personal agent that watches connected apps in the background and surfaces action suggestions requiring approval, targeting SMBs and professionals, competing with Muse and Dots. ([source](https://www.cnbc.com/2026/10/21/anthropic-preview-of-claude-duet-personal-ai-agent-take-on-muse-dots.html))

**Google**: Launched Agent Compute Engine, running every Gemini agent in a hardware-isolated microVM (see the deep dive above for details). ([source](https://the-decoder.com/googles-agent-compute-engine-gives-every-gemini-agent-its-own-hardware-isolated-micro-virtual-machine/))

**Mastercard**: After completing end-to-end pilots with Cloudflare, Ant International, and Coinbase, opened Early Access for Agent Pay for Machines, letting developers build agent-to-agent commerce via API. ([source](https://www.mastercard.com/us/en/news-and-trends/press/2026/october/Mastercard-Agent-Pay-for-Machines-in-action.html))

**NVIDIA**: Advanced three fronts at GTC Berlin — expanding confidential computing and launching the OpenShell reference architecture; expanding its open model family across language, robotics, biology, and quantum computing for European sovereign AI; and demonstrating agentic security for media production with Adobe, Bertelsmann, and UFA. ([source](https://blogs.nvidia.com/blog/confidential-computing-model-builders-infrastructure/), [source](https://blogs.nvidia.com/blog/open-models-europe-industry/))

**Cohere**: Launched Rerank 5 (passage-level precision + Context Focus) and a public beta of confidential computing for Model Vault, combining NVIDIA GPUs with Azure confidential computing for hardware-level protection. ([source](https://cohere.com/blog/rerank-5))

**Microsoft**: Published a stance committing to give customers more control over cloud and AI infrastructure for "digital sovereignty," while retaining the control needed to operate the system. ([source](https://blogs.microsoft.com/blog/2026/10/20/advancing-digital-sovereignty-with-greater-control-and-choice/))

**OpenAI**: Partnered with PerturbAI and Scripps Research to use thousands of agents running on GPT-Rosalind to analyze a CRISPR map of millions of mouse brain cells in 32 minutes — a job that would take human teams months. ([source](https://the-decoder.com/openai-agents-analyze-mouse-brain-data-in-32-minutes-a-job-that-would-take-humans-months/))

### Coding Agent Track

**Cognition (Devin)**: Its UK team grew over 200% in six months, prompting a new London office to deepen local customer relationships. ([source](https://cognition.com/blog/building-in-london)) Today's [AI Agent GitHub Digest](/posts/daily/2026-10-23-ai-agent-github-digest-en) echoes the same track — both hermes-agent and prime-agent shipped "self-improvement" as a headline feature; for giving coding agents context on known version-specific bugs, see today's [Tool of the Day: landmine](/posts/daily/2026-10-23-tool-landmine-en).

### Models & Infrastructure

**IBM**: Introduced an ensemble version of its Granite time-series models, targeting enterprise use cases that need reliable forecasting. ([source](https://huggingface.co/blog/ibm-research/granite-timeseries-ensemble-r1))

**Recursive**: Released its first language model, Flint — a 40B-parameter local coding MoE model produced by its internal "Eureka Machine" system through self-directed testing and architecture optimization; whether the self-improvement approach holds up remains to be seen. ([source](https://the-decoder.com/recursive-shows-first-result-of-its-ai-driven-research-process-with-flint/))

Today's framework update, [Mastra @mastra/core@1.79.0](/posts/daily/2026-10-23-framework-mastra-1.79.0-en), switches session addressing to a dedicated sessionId and adds experimental MCP Events.

Today's [AI Agent Arxiv Digest](/posts/daily/2026-10-23-ai-agent-arxiv-digest-en) points out that agents' "ability to act" is outpacing "acting safely": six frontier models completed 86.1% of tasks on average but backed up state first only 15.2% of the time; writing policy into the prompt still let through 13–15% of policy-violating tool calls, and only a separately trained guard model cut attack success by 40–44%.

### Security Incidents

**China-linked automated breach**: Researchers at VULONE found an exposed server showing a suspected China-linked actor using AI agents to automate breaches of 66 government and corporate targets across Asia between Sept 24 and Oct 14, successfully compromising 48. ([source](https://securityonline.info/ai-driven-hacking-campaign-asia/))

**AI agents find a critical RCE themselves**: OpenAI's GPT-5.6 Sol found the PHP2Shell unauthenticated RCE vulnerability during the "Patch the Planet" coordinated disclosure effort; Google's Gemini 4 Argon independently verified the same flaw, and someone attempted exploitation four days before the public advisory. ([source](https://thehackernews.com/2026/10/someone-tried-to-exploit-php2shell-4.html))

**US banks lock out credential-logging agents**: See the deep dive above. ([source](https://the-decoder.com/major-us-banks-are-locking-out-ai-agents-that-log-in-with-customer-credentials/))

### Regulation & Governance

**China tightens model export controls**: Creating uncertainty for the international availability of openly licensed Chinese models like Qwen and DeepSeek. ([source](https://www.nytimes.com/2026/10/21/world/asia/china-moves-to-tighten-its-grip-over-exports-of-top-ai-models.html))

**Trump administration pushes self-regulation**: The administration is pushing an AI self-regulation accord in place of congressional legislation, while Anthropic CEO Amodei defended restrictions on sales to Chinese state enterprises; commentators note self-regulation is currently one of the few levers the federal government has for AI safety absent congressional action, though its effectiveness remains in question. ([source](https://www.foxnews.com/live-news/ai-artificial-super-intelligence-regulation-midterms-congress-october-21))

**European startups weigh relocation**: An AWS EMEA executive says nearly 40% of European startups are considering relocating, as AI Act compliance can eat up to 40 cents of every euro of technical budget. ([source](https://www.globalbankingandfinance.com/europe-risks-startup-exodus-regulation-funding-skill-gaps/))

### Tools & Ecosystem

**Agentic AI Foundation tops 300 members**: AAIF, co-founded by Anthropic, Block, and OpenAI under the Linux Foundation, added 60 organizations this quarter. ([source](http://www.prnewswire.com/news-releases/agentic-ai-foundation-surpasses-300-members-in-less-than-one-year-302916687.html))

**Alibaba Cloud open-sources HiRoute**: A routing engine that dynamically dispatches agent requests to the best-fit model by task stage, cutting costs up to 90% when mixing GPT-6 Astra and Qwen-3.8 Flash. ([source](https://www.alibabacloud.com/blog/hiroute-is-open-source-help-your-agents-do-more-and-your-subscriptions-go-further_603660))

**VocabX**: Dharma-AI specializes small language model vocabularies to cut inference cost by 77%. ([source](https://huggingface.co/blog/Dharma-AI/vocabx-vocabulary-specialization))

Today's [AI Agent GitHub Digest](/posts/daily/2026-10-23-ai-agent-github-digest-en) covers context-mode (once #1 on Hacker News) and Composio's new session hooks — two more signals of agent context and execution safety becoming off-the-shelf kits.

### Regional Developments

**China**

Personal-agent startup Today AI closed over $200M, led by Ant Group, Tencent, and Sequoia China, among others. ([source](https://www.kucoin.com/news/flash/personal-agent-completes-over-200m-in-funding-backed-by-ant-group-tencent-sequoia-china)) This is the other side of today's [DeepSeek $15B round](/posts/daily/2026-10-23-funding-deepseek-en): two days after the US ordered federal agencies to remove DeepSeek's systems, Chinese capital is responding to geopolitical pressure with the largest AI funding round on record.

**Southeast Asia**

Singapore allocated over S$45M to help manufacturers adopt ready-to-deploy AI tools; the same report notes Anthropic's Singapore office has signed an MOU with the local Digital Development agency. ([source](https://www.channelnewsasia.com/singapore/singapore-manufacturer-ai-adoption-45-million-6477566))

Regionally, Southeast Asia's $1T digital economy target has slipped five years, but AI investment is surging against that trend — enterprise AI workloads in Singapore and Malaysia now account for 45–60% of the total. ([source](https://e27.co/southeast-asias-us1t-digital-dream-slips-five-years-and-ai-is-the-new-reason-to-keep-believing-20261021/))

**Latin America**

Chile's CENIA says every Latin American country has an AI strategy document, but only Brazil and Colombia have earmarked public budget for it — compute cost remains the main bottleneck. ([source](https://www.bnamericas.com/en/interviews/latin-america-has-plenty-of-ai-strategy-and-little-budget-cenia-says))

**Africa**

A weekly Africa AI intelligence brief notes that AI funding and compute in Nigeria, Kenya, and South Africa mostly comes from development finance institutions, while governance is lagging behind. ([source](https://innovation-village.com/ai-africa-intelligence-october-14-21-2026-vol-27/))

**Oceania**

AgenticAdvertising.org launched an Australian chapter to advance open standards for autonomous AI agents in media buying and ad trading. ([source](https://www.bandt.com.au/agenticadvertising-org-launches-aussie-chapter-to-advance-ai-powered-media-trading/))

(No qualifying, reliably-sourced AI-specific events were found today for Taiwan, Japan/Korea, India, or the Middle East, so they're omitted; North American events are already covered under Vendor Moves, Security, and Regulation above and aren't repeated here.)

### Business Cases / Funding

**DeepSeek**: Closed about $15B in new funding, pushing its valuation from $50B to nearly $89B in four months. Details in the [funding brief](/posts/daily/2026-10-23-funding-deepseek-en).

**Flapping Airplanes**: Closed a $1B Series A, taking its valuation from a $1.5B seed round to $6B in just one year. Details in the [funding brief](/posts/daily/2026-10-23-funding-flapping-airplanes-en).

**Mave**: Closed $34M (including a $28M Series A), letting AI agents connect enterprise security tools to investigate 100% of alerts within minutes. Details in the [funding brief](/posts/daily/2026-10-23-funding-mave-en).

**The enterprise AI returns gap**: Gartner surveyed 2,002 technology leaders and found only 13% report major returns from AI; investors at TechCrunch Disrupt separately warned that AI funding inflows combined with inflated revenue figures could trigger a correction by 2027, with capital currently favoring defense, robotics, and AI infrastructure. ([source](https://the-decoder.com/only-13-percent-of-companies-see-real-returns-from-ai-gartner-survey-finds/), [source](https://techcrunch.com/2026/10/22/investors-break-down-how-founders-can-raise-a-series-a-today/))

## Key Numbers

| Item | Number | Source |
|------|------|------|
| Google Agent Compute Engine density gain | 10x (in a 200,000-agent test) | [the-decoder](https://the-decoder.com/googles-agent-compute-engine-gives-every-gemini-agent-its-own-hardware-isolated-micro-virtual-machine/) |
| Coding agent task completion vs. backup rate | 86.1% vs. 15.2% | [AI Agent Arxiv Digest](/posts/daily/2026-10-23-ai-agent-arxiv-digest-en) |
| AgentPolicyForge guard model attack-success reduction | 40–44% | [AI Agent Arxiv Digest](/posts/daily/2026-10-23-ai-agent-arxiv-digest-en) |
| DeepSeek's latest valuation | ~$89B | [funding brief](/posts/daily/2026-10-23-funding-deepseek-en) |
| Share of enterprises reporting major AI returns | 13% | [the-decoder](https://the-decoder.com/only-13-percent-of-companies-see-real-returns-from-ai-gartner-survey-finds/) |

## Today's Digest Roundup

- 📄 [AI Agent Arxiv Digest — 2026-10-23](/posts/daily/2026-10-23-ai-agent-arxiv-digest-en)
- 📄 [AI Agent GitHub Digest — 2026-10-23](/posts/daily/2026-10-23-ai-agent-github-digest-en)
- 📄 [Framework Update: Mastra @mastra/core@1.79.0](/posts/daily/2026-10-23-framework-mastra-1.79.0-en)
- 📄 [Funding Brief: DeepSeek closes $15B round](/posts/daily/2026-10-23-funding-deepseek-en)
- 📄 [Funding Brief: Flapping Airplanes Series A $1B](/posts/daily/2026-10-23-funding-flapping-airplanes-en)
- 📄 [Funding Brief: Mave closes $34M](/posts/daily/2026-10-23-funding-mave-en)
- 📄 [Pricing Watch: Claude Sonnet 4.5 retires 11/30](/posts/daily/2026-10-23-pricing-anthropic-claude-sonnet-4-5-retirement-en)
- 📄 [Tool of the Day: landmine](/posts/daily/2026-10-23-tool-landmine-en)
- 📄 [AI Engineer Interview Drill — 2026-10-23: Coding](/posts/daily/2026-10-23-ai-interview-daily-en)
- 📄 [Product Builder Interview Drill — 2026-10-23: Growth & Experimentation](/posts/daily/2026-10-23-product-builder-interview-daily-en)

## Watching Tomorrow

- Whether real-world usage and pricing for Claude Duet keep pace with the buzz around Muse/Dots once it's generally available
- Whether this round of bank agent lockouts spreads to other financial sub-sectors like brokerages and insurance
- Whether Chinese peers like Moonshot AI and Manus AI follow DeepSeek's $15B round with fundraises of their own

## Today's Insight

I used to think the main battlefield for agent security was blocking malicious input — prompt injection, jailbreaks, that kind of external attack. Today I realized the bigger battlefield is actually guarding against your own agent acting on its own initiative: what US banks are locking out isn't a compromised agent, it's one behaving normally but acting without an explicit instruction. The 15.2% figure from today's arxiv backup-awareness paper is making the same point — the problem isn't whether an agent can be breached, it's whether it's careful enough when it acts on its own. For Taiwanese teams, the takeaway is to put "will it act recklessly on its own" on the same risk checklist as "can it be breached" — not as an afterthought.

## References

- [Anthropic launches Claude Duet — CNBC](https://www.cnbc.com/2026/10/21/anthropic-preview-of-claude-duet-personal-ai-agent-take-on-muse-dots.html)
- [Google Agent Compute Engine — the-decoder](https://the-decoder.com/googles-agent-compute-engine-gives-every-gemini-agent-its-own-hardware-isolated-micro-virtual-machine/)
- [US banks locking out AI agents — the-decoder](https://the-decoder.com/major-us-banks-are-locking-out-ai-agents-that-log-in-with-customer-credentials/)
- [Mastercard Agent Pay for Machines](https://www.mastercard.com/us/en/news-and-trends/press/2026/october/Mastercard-Agent-Pay-for-Machines-in-action.html)
- [NVIDIA Confidential Computing / OpenShell](https://blogs.nvidia.com/blog/confidential-computing-model-builders-infrastructure/)
- [NVIDIA open model family (Europe)](https://blogs.nvidia.com/blog/open-models-europe-industry/)
- [Cohere Rerank 5](https://cohere.com/blog/rerank-5)
- [Microsoft digital sovereignty stance](https://blogs.microsoft.com/blog/2026/10/20/advancing-digital-sovereignty-with-greater-control-and-choice/)
- [OpenAI agents analyze mouse brain data — the-decoder](https://the-decoder.com/openai-agents-analyze-mouse-brain-data-in-32-minutes-a-job-that-would-take-humans-months/)
- [Cognition's London office — Cognition Blog](https://cognition.com/blog/building-in-london)
- [IBM Granite time-series ensemble](https://huggingface.co/blog/ibm-research/granite-timeseries-ensemble-r1)
- [Recursive's Flint — the-decoder](https://the-decoder.com/recursive-shows-first-result-of-its-ai-driven-research-process-with-flint/)
- [China-linked AI-driven breach campaign — securityonline](https://securityonline.info/ai-driven-hacking-campaign-asia/)
- [AI finds the PHP2Shell RCE — The Hacker News](https://thehackernews.com/2026/10/someone-tried-to-exploit-php2shell-4.html)
- [China tightens AI model export controls — NYTimes](https://www.nytimes.com/2026/10/21/world/asia/china-moves-to-tighten-its-grip-over-exports-of-top-ai-models.html)
- [Trump administration pushes AI self-regulation accord — Fox News](https://www.foxnews.com/live-news/ai-artificial-super-intelligence-regulation-midterms-congress-october-21)
- [European startups weigh relocation — Global Banking & Finance](https://www.globalbankingandfinance.com/europe-risks-startup-exodus-regulation-funding-skill-gaps/)
- [Agentic AI Foundation tops 300 members — PRNewswire](http://www.prnewswire.com/news-releases/agentic-ai-foundation-surpasses-300-members-in-less-than-one-year-302916687.html)
- [Alibaba Cloud open-sources HiRoute](https://www.alibabacloud.com/blog/hiroute-is-open-source-help-your-agents-do-more-and-your-subscriptions-go-further_603660)
- [VocabX vocabulary specialization — HuggingFace Blog](https://huggingface.co/blog/Dharma-AI/vocabx-vocabulary-specialization)
- [China's Today AI closes $200M — KuCoin News](https://www.kucoin.com/news/flash/personal-agent-completes-over-200m-in-funding-backed-by-ant-group-tencent-sequoia-china)
- [Singapore's S$45M manufacturer AI subsidy — CNA](https://www.channelnewsasia.com/singapore/singapore-manufacturer-ai-adoption-45-million-6477566)
- [Southeast Asia's AI investment surge — e27](https://e27.co/southeast-asias-us1t-digital-dream-slips-five-years-and-ai-is-the-new-reason-to-keep-believing-20261021/)
- [Latin America's AI strategy-budget gap — BNamericas](https://www.bnamericas.com/en/interviews/latin-america-has-plenty-of-ai-strategy-and-little-budget-cenia-says)
- [Africa AI intelligence weekly — Innovation Village](https://innovation-village.com/ai-africa-intelligence-october-14-21-2026-vol-27/)
- [AAO Australian chapter — B&T](https://www.bandt.com.au/agenticadvertising-org-launches-aussie-chapter-to-advance-ai-powered-media-trading/)
- [Gartner AI returns survey — the-decoder](https://the-decoder.com/only-13-percent-of-companies-see-real-returns-from-ai-gartner-survey-finds/)
- [TechCrunch Disrupt Series A advice](https://techcrunch.com/2026/10/22/investors-break-down-how-founders-can-raise-a-series-a-today/)
